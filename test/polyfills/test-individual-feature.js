"use strict";

// Ensure Array.prototype.flatMap exists
require('array.prototype.flatmap').shim();
const intersection = require('lodash').intersection;
const path = require('path');
const execa = require('execa');
const polyfillLibrary = require("../../lib/index.js");
const feature = process.argv.slice(2)[0];

const featureToFolder = feature => feature.replace(/\./g, path.sep);

function generateDependencyTreeForFeature(feature) {
    return polyfillLibrary.getPolyfills({
        features: {
            [feature]: {}
        },
        unknown: 'polyfill',
        uaString: ''
    }).then(Object.keys);
}

async function featureRequiresTesting(feature) {
    
    const filesWhichChanged = execa.shellSync('git diff --name-only origin/master').stdout.split('\n');

    // if any of the dependencies in the tree from the feature is the same as latest commit, run the tests
    const dependencies = generateDependencyTreeForFeature(feature);
    const dependencyFolders = dependencies.map(feature => `polyfills/${featureToFolder(feature)}`);

    const filesRequiredByFeature = dependencyFolders.flatMap(folder => {
        return [
            folder + '/config.json',
            folder + '/polyfill.js',
            folder + '/detect.js',
            folder + '/tests.js'
        ];
    });
    
    const fileRequiredByFeatureHasChanged = intersection(filesRequiredByFeature, filesWhichChanged);
    const anyFileInLibFolderHasChanged = filesWhichChanged.some(file => file.startsWith('lib/'));
    const karmaPolyfillPluginHasChanged = filesWhichChanged.some(file => file.startsWith('karma-polyfill-library-plugin.js'));
    const packageJsonHasChanged = filesWhichChanged.some(file => file.startsWith('package.json'));

    if (!fileRequiredByFeatureHasChanged) {
        if (!anyFileInLibFolderHasChanged) {
            if (!karmaPolyfillPluginHasChanged) {
                if (packageJsonHasChanged) {
                    // If the change in package.json was in the `dependencies` object
                    // check if it was a dependency that is being used as a third-party-polyfill.
                    // If it is, only run the tests if that polyfill is within the `filesRequiredByFeature` array.
                } else {
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