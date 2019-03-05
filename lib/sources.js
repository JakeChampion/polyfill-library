"use strict";

const path = require("path");
const fs = require("graceful-fs");
const denodeify = require("denodeify");
const readFile = denodeify(fs.readFile);
const readdir = denodeify(fs.readdir);
const LRUCache = require('mnemonist/lru-cache');
const polyfillMetaCache = new LRUCache(1000);

const polyfillDirectory = path.join(__dirname, "../polyfills/__dist");
/**
 * Get the metadata for a specific polyfill within the collection of polyfill sources.
 * @param {String} featureName - The name of a polyfill whose metadata should be returned.
 * @returns {Promise<Object|undefined>} A promise which resolves with the metadata or with `undefined` if no metadata exists for the polyfill.
 */
function getPolyfillMeta(featureName) {
	let meta = polyfillMetaCache.get(featureName);
	if (meta === undefined) {
		meta = readFile(
			path.join(polyfillDirectory, featureName, "meta.json"),
			"UTF-8"
		).then(JSON.parse)
		.catch(() => undefined);
		polyfillMetaCache.set(featureName, meta);
	}
	return meta;
}

/**
 * Get a list of all the polyfills which exist within the collection of polyfill sources.
 * @returns {Promise<Array>} A promise which resolves with an array of all the polyfills within the collection.
 */
const listPolyfills = (function() {
	const features = readdir(polyfillDirectory).then(features =>
		features.filter(f => f.indexOf(".json") === -1)
	);
	return function listPolyfills() {
		return features;
	};
}());

/**
 * Get a list of all the polyfill aliases which exist within the collection of polyfill sources.
 * @returns {Promise<Array>} A promise which resolves with an object of all the polyfill aliases within the collection.
 */
const listAliases = (function() {
	const aliases = readFile(path.join(polyfillDirectory, "aliases.json")).then(JSON.parse);
	return function listAliases() {
		return aliases;
	};
}());

/**
 * Get the polyfills that are under the same alias.
 * @param {String} alias - The name of an alias whose metadata should be returned.
 * @returns {Promise<Object|undefined>} A promise which resolves with the metadata or with `undefined` if no alias with that name exists.
 */
function getConfigAliases(alias) {
	return listAliases().then(aliases => aliases[alias]);
}

/**
 * Get the aliases for a specific polyfill.
 * @param {String} featureName - The name of a polyfill whose implementation should be returned.
 * @param {'min'|'raw'} type - Which implementation should be returned: minified or raw implementation.
 * @returns {ReadStream} A ReadStream instance of the polyfill implementation as a utf-8 string.
 */
function streamPolyfillSource(featureName, type) {
	return fs.createReadStream(
		path.join(polyfillDirectory, featureName, type + ".js"), {
			encoding: "UTF-8"
		}
	);
}

module.exports = {
	streamPolyfillSource,
	getConfigAliases,
	listAliases,
	listPolyfills,
	getPolyfillMeta
};