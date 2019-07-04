"use strict";

// Ensure Array.prototype.flatMap exists
require('array.prototype.flatmap').shim();
const intersection = require('lodash').intersection;
const fs = require('fs');
const path = require('path');
const execa = require('execa');
const globby = require('globby');
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

function hasOwnProperty (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
} 

function findDifferenceInObjects(inclusionObject, exclusionObject) {
    const result = {};
    for (const [key, value] of Object.entries(inclusionObject)) {
        if (hasOwnProperty(exclusionObject, key)) {
            if (exclusionObject[key] !== value) {
                result[key] = value;
            }
        } else {
            result[key] = value;
        }
    }
    return result;
}

async function findAllThirdPartyPolyfills () {
    const configs = await globby(['polyfills/**/config.json', '!polyfills/__dist']);
    return configs.map(file => {
        const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../', file), 'utf-8'));
        return config.install && config.install.module;
    }).filter(thirdPartyPolyfills => thirdPartyPolyfills !== undefined);
}

async function featureRequiresTesting(feature) {
    
    const filesWhichChanged = execa.shellSync('git diff --name-only origin/master').stdout.split('\n');

    // if any of the dependencies in the tree from the feature is the same as latest commit, run the tests
    const dependencies = await generateDependencyTreeForFeature(feature);
    const dependencyFolders = dependencies.map(feature => `polyfills/${featureToFolder(feature)}`);
    const thirdPartyPolyfills = await findAllThirdPartyPolyfills();

    const filesRequiredByFeature = dependencyFolders.flatMap(folder => {
        return [
            folder + '/config.json',
            folder + '/polyfill.js',
            folder + '/detect.js',
            folder + '/tests.js'
        ];
    });
    
    const fileRequiredByFeatureHasNotChanged = intersection(filesRequiredByFeature, filesWhichChanged).length === 0;
    const libFolderHasNotChanged = !filesWhichChanged.some(file => file.startsWith('lib/'));
    const karmaPolyfillPluginHasNotChanged = !filesWhichChanged.includes('karma-polyfill-library-plugin.js');
    const packageJsonHasChanged = filesWhichChanged.includes('package.json');
    const packageJsonDependenciesFromMaster = JSON.parse(execa.shellSync('git show origin/master:package.json').stdout).dependencies;
    const packageJsonDependenciesFromHead = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')).dependencies;
    const packageJsonDependenciesChanges = Object.keys(findDifferenceInObjects(packageJsonDependenciesFromHead, packageJsonDependenciesFromMaster));
    const thirdPartyPolyfillsWhichHaveBeenAddedOrChanged = intersection(packageJsonDependenciesChanges, thirdPartyPolyfills);

    if (fileRequiredByFeatureHasNotChanged && libFolderHasNotChanged && karmaPolyfillPluginHasNotChanged && !packageJsonHasChanged) {
        return false;
    }

    const thirdPartyDependenciesForFeature = filesRequiredByFeature.filter(file => file.endsWith('/config.json')).map(file => {
        const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../', file), 'utf-8'));
        return config.install && config.install.module;
    }).filter(thirdPartyPolyfills => thirdPartyPolyfills !== undefined);

    const thirdPartyPolyfillHasBeenAddedOrChangedForFeature = intersection(thirdPartyPolyfillsWhichHaveBeenAddedOrChanged, thirdPartyDependenciesForFeature).length > 0;
    const packageJsonHasOnlyHadThirdPartyPolyfillChangesAppliedToIt = packageJsonDependenciesChanges.every(dep => thirdPartyPolyfills.includes(dep));

    if (thirdPartyPolyfillHasBeenAddedOrChangedForFeature) {
        return true;
    }
    if (packageJsonHasOnlyHadThirdPartyPolyfillChangesAppliedToIt) {
        return false;
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
        console.error(err.stderr || err.stdout || err);
        console.log(`Errors found testing ${feature}`);
        process.exit(1);
    }
}());