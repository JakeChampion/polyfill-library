/* eslint-disable unicorn/no-array-push-push */
'use strict';

/* eslint-disable unicorn/no-process-exit */

const fs = require('graceful-fs');
const path = require('path');
const TOML = require('@iarna/toml');
const semver = require('semver');
const { simplifyRange } = require('./simplify-versions');
const { mdnBrowserKey } = require('./mdn-browser-key');
const { parseRange } = require('./parse-range');
const { forEachPolyfillConfigPath } = require('./for-each-polyfill-config');
const assert = require('assert');

const browserData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mcd.json'), 'utf8'));

const deadBrowsers = new Set(['ie', 'ie_mob', 'android', 'bb', 'op_mini']);

const stats = {
	unbounded: 0,
	missing: 0,
	withWarnings: 0,
	unknownVersions: 0,
}

function processLog(logs) {
	if (logs.findIndex((x) => x[1] === 'error') > -1) {
		stats.withWarnings++;
		console.warn(logs.map((x) => x[0]).join('\n'));
	}
}

forEachPolyfillConfigPath((configPath) => {
	if (configPath.includes('~locale')) {
		return;
	}

	const logBuffer = [];

	logBuffer.push(['Infering browsers list for "' + configPath + '"...', 'info']);

	let config = {};

	try {
		config = TOML.parse(fs.readFileSync(configPath, 'utf-8'));
	} catch (error) {
		console.error('Error: ' + error);
		process.exit(1);
	}

	if (!config.browsers) {
		logBuffer.push(['Error: no browser in', configPath, 'error']);
		processLog(logBuffer);
		return;
	}

	const originalBrowsers = JSON.parse(JSON.stringify(config.browsers));

	if (configPath === 'polyfills/IntersectionObserverEntry/config.toml') {
		logBuffer.push(['Skipping IntersectionObserverEntry', 'info']);
		processLog(logBuffer);
		return;
	}

	let configTemplate = {};

	try {
		configTemplate = TOML.parse(fs.readFileSync(`tasks/polyfill-templates/config.toml`, 'utf-8'));
	} catch (error) {
		console.error('Error: ' + error);
		process.exit(1);
	}

	// Cleanup faulty Edge configs
	{
		if (config.browsers.edge === '<12') {
			delete config.browsers.edge;
		}

		if (config.browsers.edge_mob === '<12') {
			delete config.browsers.edge_mob;
		}
	}

	const configBrowserNames = Object.keys(config.browsers || {});
	const configTemplateBrowserNames = Object.keys(configTemplate.browsers || {});

	for (const browser of configBrowserNames) {
		// We want uniform configs with a known set of browsers.
		// The template for new polyfills is a good baseline.
		if (!configTemplateBrowserNames.includes(browser)) {
			logBuffer.push([`Error: browser "${browser}" is not defined in the template for new polyfills`, 'error']);
		}

		// Browser configs must be ranges.
		const parsedRange = parseRange(config.browsers[browser]);
		if (
			!parsedRange.isRanged && mdnBrowserKey(browser) !== 'ie' && !(
				// If the range is a single version and the first release it will be optimized as just this version.
				browserData.browsers[mdnBrowserKey(browser)] &&
				parsedRange.versions.length === 1 &&
				browserData.browsers[mdnBrowserKey(browser)].release_versions[0] === semver.coerce(parsedRange.versions[0]).toString()
			)
		) {
			logBuffer.push([`Error: browser "${browser}: ${config.browsers[browser]}" is not a range`, 'error']);
		}

		if (browser === 'android' && parsedRange.versions.findIndex((x) => semver.coerce(x).major > 6) > -1) {
			logBuffer.push([`Error: android config should not include later chromium versions, "${browser}: ${config.browsers[browser]}`, 'error']);

			config.browsers['android'] = '*';
		}

		// Browser configs must be valid ranges for `semver`.
		if (!semver.validRange(config.browsers[browser])) {
			logBuffer.push([`Error: browser "${browser}: ${config.browsers[browser]}" is not a valid range`, 'error']);
		}
	}

	for (const browser of configBrowserNames) {
		if (
			config.browsers[browser] !== '*' &&
			browserData.browsers[mdnBrowserKey(browser)]
		) {
			const parsedRange = parseRange(config.browsers[browser]);

			if (
				!parsedRange.isRanged &&
				parsedRange.versions.length === 1 &&
				browserData.browsers[mdnBrowserKey(browser)] &&
				!browserData.browsers[mdnBrowserKey(browser)].release_versions.includes(semver.coerce(parsedRange.versions[0]).toString())
			) {
				logBuffer.push([`Unknown single version "${browser}: ${config.browsers[browser]}"`, 'info']);
				continue;
			}

			// Some versions in configs might be very specific (e.g. a build number).
			// Other versions might be typo's.
			const unknownVersions = parsedRange.versions.filter((x) => {
				return !browserData.browsers[mdnBrowserKey(browser)].release_versions.includes(semver.coerce(x).toString());
			});

			const versions = browserData.browsers[mdnBrowserKey(browser)].release_versions.map((x) => semver.coerce(x));

			if (unknownVersions.length > 0) {
				// Warn when a version is not found in MDN data.
				logBuffer.push([`${browser}: unknown versions - ${JSON.stringify(unknownVersions)} `, 'info']);
				stats.unknownVersions++;
				// But add it to the list anyway.
				versions.push(...(unknownVersions.map((x) => semver.coerce(x))));
			}

			// Normalize the range by deconstructing and reconstructing it.
			// - deconstruct the range into a list of versions.
			const versionsSatisfiedByConfig = versions.filter((x) => semver.satisfies(semver.coerce(x), config.browsers[browser]));
			// - reconstruct a simplified range from the list of versions.
			config.browsers[browser] = simplifyRange(semver.sort(versions), versionsSatisfiedByConfig.join(' || ')).toString();

			if (!config.browsers[browser]) {
				logBuffer.push([`Error: browser "${browser}: ${originalBrowsers[browser]}" did not match any real browser versions`, 'error']);
			}
		}
	}

	for (const browser of configBrowserNames) {
		if (deadBrowsers.has(browser) || !browserData.browsers[mdnBrowserKey(browser)]) {
			continue;
		}

		const releaseVersions = browserData.browsers[mdnBrowserKey(browser)].release_versions;
		if (semver.satisfies(semver.coerce(releaseVersions[releaseVersions.length - 1]), config.browsers[browser])) {
			stats.unbounded++;
		}
	}

	for (const browser of configTemplateBrowserNames) {
		if (deadBrowsers.has(browser) || config.browsers[browser]) {
			continue;
		}

		stats.missing++;
	}

	// TODO :
	// check missing browsers stats
	// determine possible engines which might have those stats and are mappable
	// do the mapping

	try {
		assert.deepStrictEqual(config.browsers, originalBrowsers);
	} catch (_) {
		logBuffer.push(['Updated browser config', 'error']);
		logBuffer.push([TOML.stringify({ browsers: config.browsers }), 'error']);
	}

	processLog(logBuffer);

}).then(() => {
	if (process.env.GITHUB_STEP_SUMMARY) {
		fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Config stats\n\n- ${stats.missing} missing\n- ${stats.unknownVersions} unknown versions\n- ${stats.unbounded} unbounded\n- ${stats.withWarnings} warnings\n\n`);
	} else {
		console.log(stats);
	}
});
