"use strict";

const path = require("path");
const fs = require("graceful-fs");
const {promisify} = require("util");
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const LRUCache = require('mnemonist/lru-cache');
const StreamCache = require('stream-cache');
const polyfillMetaCache = new LRUCache(1000);
const polyfillSourceCache = new LRUCache(1000);
const polyfillDirectory = path.join(__dirname, "../polyfills/__dist");

/**
 * Get the metadata for a specific polyfill within the collection of polyfill sources.
 * @param {String} featureName - The name of a polyfill whose metadata should be returned.
 * @returns {Promise<Object|undefined>} A promise which resolves with the metadata or with `undefined` if no metadata exists for the polyfill.
 */
async function getPolyfillMeta(featureName) {
  let meta = polyfillMetaCache.get(featureName);
  if (meta === undefined) {
    try {
      meta = await readFile(
	path.join(polyfillDirectory, featureName, "meta.json"),
	"UTF-8"
      );
      meta = JSON.parse(meta);
      polyfillMetaCache.set(featureName, meta);
    } catch (error) {
      // if file doesn't exist
      meta = undefined;
    }
  }
  return meta;
}

const features = (async function() {
	const polyfillFiles = await readdir(polyfillDirectory);
  return polyfillFiles.filter(f => !f.endsWith(".json"));
}());

/**
 * Get a list of all the polyfills which exist within the collection of polyfill sources.
 * @returns {Promise<Array>} A promise which resolves with an array of all the polyfills within the collection.
 */
function listPolyfills() {
  return features;
}

const _aliases = (async function() {
  const aliases = await readFile(path.join(polyfillDirectory, "aliases.json"));
  return JSON.parse(aliases);
}());

/**
 * Get a list of all the polyfill aliases which exist within the collection of polyfill sources.
 * @returns {Promise<Object>} A promise which resolves with an object mapping all the aliases within the collection to the polyfills they include.
 */
function listAliases() {
  return _aliases;
}

/**
 * Get the polyfills that are under the same alias.
 * @param {String} alias - The name of an alias whose metadata should be returned.
 * @returns {Promise<Object|undefined>} A promise which resolves with the metadata or with `undefined` if no alias with that name exists.
 */
async function getConfigAliases(alias) {
  const aliases = await listAliases();
  return aliases[alias];
}

/**
 * Get the aliases for a specific polyfill.
 * @param {String} featureName - The name of a polyfill whose implementation should be returned.
 * @param {'min'|'raw'} type - Which implementation should be returned: minified or raw implementation.
 * @returns {ReadStream} A ReadStream instance of the polyfill implementation as a utf-8 string.
 */
function streamPolyfillSource(featureName, type) {
	const key = featureName + '.' + type;
	let source = polyfillSourceCache.get(key);
	if (source === undefined) {
		source = new StreamCache();
		fs.createReadStream(
			path.join(polyfillDirectory, featureName, type + ".js"), {
				encoding: "UTF-8"
			}
		).pipe(source);
		polyfillSourceCache.set(key, source);
	}
	return source;
}

module.exports = {
	streamPolyfillSource,
	getConfigAliases,
	listAliases,
	listPolyfills,
	getPolyfillMeta
};
