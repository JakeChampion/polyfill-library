"use strict";

const path = require('path');
const execa = require('execa');
const polyfillLibrary = require("../../lib/index.js");
const feature = process.argv.slice(2)[0];

const featureToFolder = feature => feature.replace(/\./g, path.sep);

async function featureRequiresTesting(feature) {
    const filesWhichChanged = execa.shellSync('git diff --name-only origin/master').stdout.split('\n');
    // if any of the dependencies in the tree from the feature is the same as latest commit, run the tests
    const dependencies = Object.keys(await polyfillLibrary.getPolyfills({
        features: {
            [feature]: {}
        },
        unknown: 'polyfill',
        uaString: ''
    })).map(feature => `polyfills/${featureToFolder(feature)}`);

    const configs = dependencies.map(d => d + '/config.json');
    const polyfills = dependencies.map(d => d + '/polyfill.js');
    const detects = dependencies.map(d => d + '/detect.js');
    const tests = dependencies.map(d => d + '/tests.js');
    const files = [].concat(configs, polyfills, detects, tests);

    if (!files.some(file => filesWhichChanged.includes(file))) {
        if (!filesWhichChanged.some(file => file.startsWith('lib/'))) {
            if (!filesWhichChanged.some(file => file.startsWith('karma-polyfill-library-plugin.js'))) {
                if (!filesWhichChanged.some(file => file.startsWith('package.json'))) {
                    return false;
                }
            }
        }
    }

    return true;
}

(async function () {
    try {
        if (await featureRequiresTesting(feature)) {
            console.log(`Testing ${feature}`);
            const result = execa('karma', ['start', path.join(__dirname, '../../', 'karma.conf.js'), `--browserstack`, `--features=${feature}`]);
            result.stdout.pipe(process.stdout);
            result.stderr.pipe(process.stderr);
            await result;
        } else {
            console.log(`${feature} has not changed, no need to run the tests.`);
            process.exit(0);
        }
    } catch (err) {
        console.log(`Errors found testing ${feature}`);
        console.error(err.stderr || err.stdout);
        console.log(`Errors found testing ${feature}`);
        process.exit(1);
    }
}());