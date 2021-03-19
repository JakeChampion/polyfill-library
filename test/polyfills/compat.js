"use strict";

const fs = require("fs-extra");
const path = require("path");
const _ = require('lodash');

const intersection = (a, b) =>
  new Set([...b].filter(value => a.has(value)));
const difference = (a, b) =>
  new Set([...b].filter(value => !a.has(value)));

console.log("Reading test result data");
const control = fs.readJSONSync(path.join(__dirname, "results-control.json"));
const all = fs.readJSONSync(path.join(__dirname, "results-all.json"));

const compat = _.merge({}, control, all);
const builtCompatTable = {};

function buildData(support, browserName, version) {
  return function(feature) {
    if (!builtCompatTable[feature]) {
      builtCompatTable[feature] = {};
    }

    if (!builtCompatTable[feature][browserName]) {
      builtCompatTable[feature][browserName] = {};
    }

    builtCompatTable[feature][browserName][version] = support;
  };
}

for (const browserName of Object.keys(compat)) {
  const versions = compat[browserName];
  for (const version of Object.keys(versions)) {
    const testResults = versions[version];
    if (!testResults.all || !testResults.control) {
      throw new Error(
        "Missing test results for " + browserName + "/" + version
      );
    }

    const allTests = new Set([...testResults.control.testedSuites]);
    const failedNative = new Set([...testResults.control.failingSuites]);
    const failedPolyfilled = new Set([...testResults.all.failingSuites]);

    const missing = intersection(failedNative, failedPolyfilled);
    const polyfilled = difference(failedPolyfilled, failedNative);
    const native = difference(failedNative, allTests);

    for (const feature of native)  buildData("native", browserName, version)(feature);
    for (const feature of polyfilled)  buildData("polyfilled", browserName, version)(feature);
    for (const feature of missing)  buildData("missing", browserName, version)(feature);
  }
}

const compatFile = path.join(__dirname, "compat.json");
fs.writeFileSync(compatFile, JSON.stringify(builtCompatTable, undefined, 2));
console.log("Updated compat.json");
