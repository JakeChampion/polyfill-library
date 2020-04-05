"use strict";

const toposort = require("toposort").array;
const createAliasResolver = require("./aliases");
const UA = require("@financial-times/polyfill-useragent-normaliser");
const sources = require("./sources");
const appVersion = require("../package.json").version;
const streamFromPromise = require("stream-from-promise");
const streamFromString = require("from2-string");
const mergeStream = require("merge2");
const streamToString = require("stream-to-string");
const normalizeUserAgent = UA.normalize;
const LRUCache = require("mnemonist/lru-cache");
const cache = new LRUCache(1000);

module.exports = {
  listAliases,
  listAllPolyfills,
  describePolyfill,
  getOptions,
  getPolyfills,
  getPolyfillString,
  normalizeUserAgent
};

/**
 * Get a list of all the aliases which exist within the collection of polyfill sources.
 * @returns {Promise<Array>} A promise which resolves with an array of all the aliases within the collection.
 */
function listAliases() {
  return sources.listAliases();
}

/**
 * Get a list of all the polyfills which exist within the collection of polyfill sources.
 * @returns {Promise<Array>} A promise which resolves with an array of all the polyfills within the collection.
 */
function listAllPolyfills() {
  return sources.listPolyfills();
}

/**
 * Get the metadata for a specific polyfill within the collection of polyfill sources.
 * @param {String} featureName - The name of a polyfill whose metadata should be returned.
 * @returns {Promise<Object|undefined>} A promise which resolves with the metadata or with `undefined` if no metadata exists for the polyfill.
 */
function describePolyfill(featureName) {
  return sources.getPolyfillMeta(featureName);
}

/**
 * Create an options object for use with `getPolyfills` or `getPolyfillString`.
 * @param {object} opts - Valid keys are uaString, minify, unknown, excludes, rum and features.
 * @param {Boolean} [opts.minify=true] - Whether to return the minified or raw implementation of the polyfills.
 * @param {'ignore'|'polyfill'} [opts.unknown='polyfill'] - Whether to return all polyfills or no polyfills if the user-agent is unknown or unsupported.
 * @param {Object} [opts.features={}] - Which features should be returned if the user-agent does not support them natively.
 * @param {Array<String>} [opts.excludes=[]] - Which features should be excluded from the returned object.
 * @param {String} [opts.uaString=''] - The user-agent string to check each feature against.
 * @param {Boolean} [opts.rum=false] - Whether to add a script to the polyfill bundle which reports anonymous usage data
 * @return {Object} options - opts merged with the defaults option values.
 */
function getOptions(options_ = {}) {
  const hasProperty = (property, object) =>
    Object.prototype.hasOwnProperty.call(object, property);
  const options = {
    callback:
      hasProperty("callback", options_) &&
      typeof options_.callback === "string" &&
      options_.callback.match(/^[\w.]+$/)
        ? options_.callback
        : false,
    uaString: hasProperty("uaString", options_) ? options_.uaString : "",
    minify: hasProperty("minify", options_) ? options_.minify : true,
    unknown: hasProperty("unknown", options_) ? options_.unknown : "polyfill",
    features: hasProperty("features", options_) ? options_.features : {},
    excludes: hasProperty("excludes", options_) ? options_.excludes : [],
    rum: hasProperty("rum", options_) ? options_.rum : false
  };

  // Normalise flags
  Object.keys(options.features).forEach(k => {
    if (!options.features[k].flags) {
      options.features[k].flags = new Set();
    } else if (options.features[k].flags.constructor !== Set) {
      options.features[k].flags = new Set(options.features[k].flags);
    }
  });

  return options;
}

/**
 * Given a set of features that should be polyfilled in 'options.features'
 * (with flags i.e. `{<featurename>: {flags:Set[<flaglist>]}, ...}`),
 * determine which have a configuration valid for the given options.uaString,
 * and return a promise of set of canonical (unaliased) features (with flags) and polyfills.
 *
 * @param {object} opts - Valid keys are uaString, minify, unknown, excludes, rum and features.
 * @param {Boolean} [opts.minify=true] - Whether to return the minified or raw implementation of the polyfills.
 * @param {'ignore'|'polyfill'} [opts.unknown='polyfill'] - Whether to return all polyfills or no polyfills if the user-agent is unknown or unsupported.
 * @param {Object} [opts.features={}] - Which features should be returned if the user-agent does not support them natively.
 * @param {Array<String>} [opts.excludes=[]] - Which features should be excluded from the returned object.
 * @param {String} [opts.uaString=''] - The user-agent string to check each feature against.
 * @param {Boolean} [opts.rum=false] - Whether to add a script to the polyfill bundle which reports anonymous usage data.
 * @return {Promise<Object>} - Canonicalised feature definitions filtered for UA
 */
function getPolyfills(options_) {
  const options = getOptions(options_);
  let ua = cache.get(options.uaString);
  if (ua === undefined) {
    ua = new UA(options.uaString);
    cache.set(options.uaString, ua);
  }
  const resolveAliases = createAliasResolver(sources.getConfigAliases);
  const aliasDependencies = async featureName => {
    const meta = await sources.getPolyfillMeta(featureName);
    const result = ((meta && meta.dependencies) || [])
      .filter(depName => !options.excludes.includes(depName))
    .concat(featureName);
    return result;
  };
  const resolveDependencies = createAliasResolver(aliasDependencies);

  // Filter the features object to remove features not suitable for the current UA
  const filterForUATargeting = async features => {
    const featuresList = Object.keys(features);
    const featuresForUA = {};
    for (const featureName of featuresList) {
    const meta = await sources.getPolyfillMeta(featureName);
      if (meta) {
    
    const isBrowserMatch = 
      meta.browsers &&
      meta.browsers[ua.getFamily()] &&
      ua.satisfies(meta.browsers[ua.getFamily()]);
    const hasAlwaysFlagOverride = features[featureName].flags.has("always");
        const unknownOverride = options.unknown === "polyfill" && ua.isUnknown();
    
        if (unknownOverride) {
          features[featureName].flags.add("gated");
        }

        if (isBrowserMatch || hasAlwaysFlagOverride || unknownOverride) {
          featuresForUA[featureName] = features[featureName];
        }
      }
  }
    return featuresForUA;
  };

  const filterForExcludes = function(features) {
    for (const featureName of Object.keys(features)) {
      if (options.excludes.includes(featureName)) {
        delete features[featureName];
      }
    }
    return features;
  };

  const requestedFeatures = Object.keys(options.features);
  const filterForUnusedAbstractMethods = async features => {
    let dependencyWasRemoved = false;
    const featureNames = Object.keys(features);

    const dependenciesForAllFeatures = [];
    for (const featureName of featureNames) {
      const meta = sources.getPolyfillMeta(featureName);
      if (meta.dependencies) {
        dependenciesForAllFeatures.push(...meta);
      }
    }
    for (const featureName of featureNames) {
      if (featureName.startsWith("_")) {
        if (!dependenciesForAllFeatures.includes(featureName)) {
          const feature = features[featureName];
          if (
            !requestedFeatures.some(featureName =>
              feature.aliasOf.has(featureName)
            )
          ) {
            delete features[featureName];
            dependencyWasRemoved = true;
          }
        }
      }
    }
    if (dependencyWasRemoved) {
      return filterForUnusedAbstractMethods(features);
    }
    return features;
  };

  return Promise.resolve(options.features)
    .then(resolveAliases)
    .then(filterForUATargeting)
    .then(resolveDependencies)
    .then(filterForUATargeting)
    .then(filterForExcludes)
    .then(filterForUnusedAbstractMethods);
}

/**
 * Create a polyfill bundle.
 * @param {object} opts - Valid keys are uaString, minify, unknown, excludes, rum and features.
 * @param {Boolean} [opts.minify=true] - Whether to return the minified or raw implementation of the polyfills.
 * @param {'ignore'|'polyfill'} [opts.unknown='polyfill'] - Whether to return all polyfills or no polyfills if the user-agent is unknown or unsupported.
 * @param {Object} [opts.features={}] - Which features should be returned if the user-agent does not support them natively.
 * @param {Array<String>} [opts.excludes=[]] - Which features should be excluded from the returned object.
 * @param {String} [opts.uaString=''] - The user-agent string to check each feature against.
 * @param {Boolean} [opts.rum=false] - Whether to add a script to the polyfill bundle which reports anonymous usage data.
 * @param {Boolean} [opts.stream=false] - Whether to return a stream or a string of the polyfill bundle.
 * @return {Promise<String> | ReadStream} - Polyfill bundle as either a utf-8 stream or a promise of a utf-8 string.
 */
function getPolyfillString(options_) {
  const options = getOptions(options_);
  const lf = options.minify ? "" : "\n";
  const allWarnText =
    "Using the `all` alias with polyfill.io is a very bad idea. In a future version of the service, `all` will deliver the same behaviour as `default`, so we recommend using `default` instead.";
  const output = mergeStream();
  const explainerComment = [];
  // Build a polyfill bundle of polyfill sources sorted in dependency order
  getPolyfills(options).then(targetedFeatures => {
    const warnings = {
      unknown: []
    };
    const featureNodes = [];
    const featureEdges = [];

    Promise.all(
      Object.keys(targetedFeatures).map(featureName => {
        const feature = targetedFeatures[featureName];
        return sources.getPolyfillMeta(featureName).then(polyfill => {
          if (!polyfill) {
            warnings.unknown.push(featureName);
          } else {
            featureNodes.push(featureName);

            if (polyfill.dependencies) {
              polyfill.dependencies.forEach(depName => {
                if (depName in targetedFeatures) {
                  featureEdges.push([depName, featureName]);
                }
              });
            }

            feature.comment =
              featureName +
              ", License: " +
              (polyfill.license || "CC0") +
              (feature.aliasOf && feature.aliasOf.size
                ? ' (required by "' +
                  [...feature.aliasOf].join('", "') +
                  '")'
                : "");
          }
        });
      })
    ).then(() => {
      // Sort the features alphabetically, so ones with no dependencies
      // turn up in the same order
      featureNodes.sort((a, b) => a.localeCompare(b));
      featureEdges.sort(([, a], [, b]) => a.localeCompare(b));

      const sortedFeatures = toposort(featureNodes, featureEdges);

      if (!options.minify) {
        explainerComment.push(
          "Polyfill service " +
            (process.env.NODE_ENV === "production"
              ? "v" + appVersion
              : "DEVELOPMENT MODE - for live use set NODE_ENV to 'production'"),
          "For detailed credits and licence information see https://github.com/financial-times/polyfill-service.",
          "",
          "Features requested: " + Object.keys(options.features),
          ""
        );
        explainerComment.push(
          ...sortedFeatures
            .filter(
              featureName =>
                targetedFeatures[featureName] &&
                targetedFeatures[featureName].comment
            )
            .map(featureName => "- " + targetedFeatures[featureName].comment)
        );
        if (warnings.unknown.length > 0) {
          explainerComment.push(
            "",
            "These features were not recognised:",
            warnings.unknown.map(s => "- " + s)
          );
        }
        if ("all" in options.features) {
          explainerComment.push("", allWarnText);
        }
      } else {
        explainerComment.push(
          "Disable minification (remove `.min` from URL path) for more info"
        );
      }
      output.add(
        streamFromString("/* " + explainerComment.join("\n * ") + " */\n\n")
      );

      if (sortedFeatures.length > 0) {
        // Outer closure hides private features from global scope
        output.add(streamFromString("(function(self, undefined) {" + lf));

        // Using the graph, stream all the polyfill sources in dependency order
        for (const featureName of sortedFeatures) {
          const detect = sources.getPolyfillMeta(featureName).then(meta => {
            if (meta.detectSource) {
              return "if (!(" + meta.detectSource + ")) {" + lf;
            } else {
              return "";
            }
          });
          const wrapInDetect = targetedFeatures[featureName].flags.has("gated");
          if (wrapInDetect) {
            output.add(streamFromPromise(detect));
            output.add(
              sources.streamPolyfillSource(
                featureName,
                options.minify ? "min" : "raw"
              )
            );
            output.add(
              streamFromPromise(
                detect.then(wrap => {
                  if (wrap) {
                    return lf + "}" + lf + lf;
                  }
                })
              )
            );
          } else {
            output.add(
              sources.streamPolyfillSource(
                featureName,
                options.minify ? "min" : "raw"
              )
            );
          }
        }
        // Invoke the closure, passing the global object as the only argument
        output.add(
          streamFromString(
            "})" +
              lf +
              "('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});" +
              lf
          )
        );
      } else {
        if (!options.minify) {
          output.add(
            streamFromString(
              "\n/* No polyfills found for current settings */\n\n"
            )
          );
        }
      }

      if ("all" in options.features) {
        output.add(streamFromString("\nconsole.log('" + allWarnText + "');\n"));
      }

      if (options.callback) {
        output.add(
          streamFromString(
            "\ntypeof " +
              options.callback +
              "==='function' && " +
              options.callback +
              "();"
          )
        );
      }
    });
  });

  return options_.stream ? output : Promise.resolve(streamToString(output));
}
