/* eslint-env node */

/*
 * This script will copy all of the localisation language files from the Intl.NumberFormat
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
var LocalesPath = path.dirname(require.resolve('@formatjs/intl-numberformat/dist/locale-data/en.js'));
var IntlPolyfillOutput = path.resolve('polyfills/Intl/NumberFormat');
var LocalesPolyfillOutput = path.resolve('polyfills/Intl/NumberFormat/~locale');
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
configSource.dependencies.push('Intl.NumberFormat');

// don't test every single locale - it will be too slow
configSource.test = { ci: false };

function intlLocaleDetectFor(locale) {
	return "'Intl' in self && Intl.NumberFormat && (function () {\n\t\ttry {\n\t\t  new Intl.NumberFormat('".concat(locale, "', {\n\t\t\tstyle: 'unit',\n\t\t\tunit: 'byte'\n\t\t  });\n\t\t} catch (e) {\n\t\t  return false;\n\t\t}\n\t\treturn true;\n\t  })() && Intl.NumberFormat.supportedLocalesOf('").concat(locale, "').length");
}

console.log('Importing Intl.NumberFormat~locale.* polyfill from ' + LocalesPath);
var locales = fs.readdirSync(LocalesPath);
locales.filter(function(locale) {
	return locale.endsWith('.js')
}).forEach(function (file) {
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
	writeFileIfChanged(configOutputPath, TOML.stringify({...configSource, aliases: [...configSource.aliases, `Intl.~locale.${locale}`]}));
});


console.log(locales.length + ' imported locales');
console.log('Intl.NumberFormat polyfill imported successfully');
