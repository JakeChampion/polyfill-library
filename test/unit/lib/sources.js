/* eslint-env mocha */
"use strict";

const assert = require('proclaim');
const mockery = require('mockery');
const sinon = require('sinon');

describe('lib/sources', () => {
	let aliases;
	let fs;
	let sources;
	let process;
	let consoleMock;

	beforeEach(() => {

		fs = require('../mock/graceful-fs.mock');
		mockery.registerMock('graceful-fs', fs);
		fs.readdir.yields(undefined, []);

		process = require('../mock/process.mock');
		mockery.registerMock('process', process);

		consoleMock = require('../mock/console.mock');
		mockery.registerMock('console', consoleMock);

		aliases = {};
		mockery.registerMock('../polyfills/__dist/aliases.json', aliases);
	});

	it('exports an object', () => {
		sources = require('../../../lib/sources');
		assert.isObject(sources);
	});

	it('has a getPolyfillMeta method', () => {
		const sources = require('../../../lib/sources');
		assert.isFunction(sources.getPolyfillMeta);
	});

	it('has a listPolyfills method', () => {
		const sources = require('../../../lib/sources');
		assert.isFunction(sources.listPolyfills);
	});

	it('has a listPolyfills method', () => {
		const sources = require('../../../lib/sources');
		assert.isFunction(sources.listPolyfills);
	});

	it('has a getConfigAliases method', () => {
		const sources = require('../../../lib/sources');
		assert.isFunction(sources.getConfigAliases);
	});

	it('has a streamPolyfillSource method', () => {
		const sources = require('../../../lib/sources');
		assert.isFunction(sources.streamPolyfillSource);
	});

	describe('sources.listPolyfills()', () => {
		it('filters out json files from the polyfill directory', () => {
			const spy = sinon.spy(Array.prototype, 'filter');
			const sources = require('../../../lib/sources');

			return sources.listPolyfills().then(() => {
				spy.restore();
				assert.equal(spy.lastCall.args[0]('aliases.json'), false);
				assert.equal(spy.lastCall.args[0]('example.json'), false);
			});
		});

		it('returns a promise which resolves with an array containing names for each polyfilled feature', () => {
			fs.readdir.yields(undefined, ['Array.from', 'Symbol']);
			const sources = require('../../../lib/sources');
			return sources.listPolyfills().then(polyfills => assert.deepEqual(polyfills, ['Array.from', 'Symbol']));
		});
	});

	describe('sources.getConfigAliases()', () => {
		it('returns a promise which resolves with  an array of polyfills which are under the alias', () => {
			const sources = require('../../../lib/sources');
			return sources.getConfigAliases('es6').then(config => assert.isDefined(config));
		});

		it('returns a promise which resolves to undefined if alias does not exist', () => {
			const sources = require('../../../lib/sources');
			return sources.getConfigAliases('fake-alias').then(config => assert.isUndefined(config));
		});
	});

	describe.only('sources.getPolyfillMeta()', () => {
		it('returns a promise which resolves with the metadata for a feature if it exists', () => {
			const sources = require('../../../lib/sources');
			return sources.getPolyfillMeta('Array.from').then(meta => assert.isDefined(meta));
		});

		it('returns a promise which resolves with undefined for a feature if it does not exist', () => {
			fs.readFile.yields(new Error);
			const sources = require('../../../lib/sources');
			return sources.getPolyfillMeta('Array.smoosh').then(meta => {
				assert.isUndefined(meta);
			});
		});
	});

	describe('sources.listPolyfills()', () => {
		it('returns a promise which resolves with  an array containing names for each polyfilled feature', () => {
			fs.readdir.yields(undefined, ['Array.from', 'Symbol']);
			const sources = require('../../../lib/sources');
			return sources.listPolyfills().then(polyfills => assert.deepEqual(polyfills, ['Array.from', 'Symbol']));
		});
	});

	describe('sources.streamPolyfillSource()', () => {
		let pathMock;

		beforeEach(() => {
			pathMock = require('../mock/path.mock');
			mockery.registerMock('path', pathMock);
		});

		it('returns a read-stream', () => {
			pathMock.join.resetHistory();
			pathMock.join.withArgs('../polyfills/__dist', 'Array.from', 'min.js').returns('../polyfills/__dist/Array.from/min.js');
			pathMock.join.returnsArg(1);

			const sources = require('../../../lib/sources');
			sources.streamPolyfillSource('Array.from', 'min');
			assert.calledWithExactly(fs.createReadStream, '../polyfills/__dist/Array.from/min.js',
			{ encoding: 'UTF-8' });
		});
	});
});
