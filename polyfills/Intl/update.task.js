/* eslint-env node */

/*
 * This script will copy all of the localisation language files from the Intl
 * module and install them within a folder in this directory named ~locale.
 *
 * The detect.js file used for Intl is copied into every ~locale polyfill for
 * use on detecting whether that locale needs to be polyfilled.
 *
 * The config.toml file for each locale polyfill is based off of the one for
 * Intl. The changes made ot it are:
 *  - Removing the "install" section
 *  - Adding Intl as a dependency
 */

'use strict';

var fs = require('graceful-fs');
var path = require('path');
var LocalesPath = path.dirname(require.resolve('intl/locale-data/jsonp/en.js'));
var IntlPolyfillOutput = path.resolve('polyfills/Intl');
var LocalesPolyfillOutput = path.resolve('polyfills/Intl/~locale');
var crypto = require('crypto');
var mkdirp = require('mkdirp');
var TOML = require('@iarna/toml');

function md5 (contents) {
	return crypto.createHash('md5').update(contents).digest('hex');
}

function writeFileIfChanged (filePath, newFile) {
	if (fs.existsSync(filePath)) {
		var currentFile = fs.readFileSync(filePath);
		var currentFileHash = md5(currentFile);
		var newFileHash = md5(newFile);

		if (newFileHash !== currentFileHash) {
			fs.writeFileSync(filePath, newFile);
		}
  } else {
		fs.writeFileSync(filePath, newFile);
	}
}

var configSource = TOML.parse(fs.readFileSync(path.join(IntlPolyfillOutput, 'config.toml'), 'utf-8'));
delete configSource.install;

if (!fs.existsSync(LocalesPolyfillOutput)) {
	mkdirp.sync(LocalesPolyfillOutput);
}

// customizing the config to add intl as a dependency
configSource.dependencies.push('Intl');

// don't test every single locale - it will be too slow
configSource.test = { ci: false };

var configFileSource = TOML.stringify(configSource);

function intlLocaleDetectFor(locale) {
	return "'Intl' in self && " +
			"Intl.Collator && " +
			"Intl.Collator.supportedLocalesOf && " +
			"Intl.Collator.supportedLocalesOf('"+locale+"').length === 1 && " +
			"Intl.DateTimeFormat && " +
			"Intl.DateTimeFormat.supportedLocalesOf && " +
			"Intl.DateTimeFormat.supportedLocalesOf('"+locale+"').length === 1 && " +
			"Intl.NumberFormat && " +
			"Intl.NumberFormat.supportedLocalesOf && " +
			"Intl.NumberFormat.supportedLocalesOf('"+locale+"').length === 1";
}

console.log('Importing Intl.~locale.* polyfill from ' + LocalesPath);
var locales = fs.readdirSync(LocalesPath);
locales.forEach(function (file) {
	var locale = file.slice(0, file.indexOf('.'));
	var localeOutputPath = path.join(LocalesPolyfillOutput, locale);

	if (!fs.existsSync(localeOutputPath)) {
		mkdirp.sync(localeOutputPath);
	}

	var localePolyfillSource = fs.readFileSync(path.join(LocalesPath, file));
	var polyfillOutputPath = path.join(localeOutputPath, 'polyfill.js');
	var detectOutputPath = path.join(localeOutputPath, 'detect.js');
	var configOutputPath = path.join(localeOutputPath, 'config.toml');
	writeFileIfChanged(polyfillOutputPath, localePolyfillSource);
	writeFileIfChanged(detectOutputPath, intlLocaleDetectFor(locale));
	writeFileIfChanged(configOutputPath, configFileSource);
});

var intlPolyfillDetect = "'Intl' in self && \n Intl.Collator && \n Intl.DateTimeFormat && \n Intl.NumberFormat && \n Intl.NumberFormat.supportedLocalesOf ";

locales.forEach(function (file) {
	var locale = file.slice(0, file.indexOf('.'));
	intlPolyfillDetect += "&& \n Intl.Collator.supportedLocalesOf('"+locale+"').length === 1 ";
	intlPolyfillDetect += "&& \n Intl.DateTimeFormat.supportedLocalesOf('"+locale+"').length === 1 ";
	intlPolyfillDetect += "&& \n Intl.NumberFormat.supportedLocalesOf('"+locale+"').length === 1 ";
})

var detectOutputPath = path.join(IntlPolyfillOutput, 'detect.js');
writeFileIfChanged(detectOutputPath, intlPolyfillDetect);
console.log(locales.length + ' imported locales');
console.log('Intl polyfill imported successfully');
