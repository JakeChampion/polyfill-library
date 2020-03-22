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

Object.keys(compat).forEach(browserName => {
  const versions = compat[browserName];
  Object.keys(versions).forEach(version => {
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

    function buildData(support) {
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

    native.forEach(buildData("native"));
    polyfilled.forEach(buildData("polyfilled"));
    missing.forEach(buildData("missing"));
  });
});

const compatFile = path.join(__dirname, "compat.json");
fs.writeFileSync(compatFile, JSON.stringify(builtCompatTable, null, 2));
console.log("Updated compat.json");
