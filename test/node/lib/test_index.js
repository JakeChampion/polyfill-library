/* eslint-env mocha */
'use strict';
const assert = require('proclaim');
const setsToArrays = require('../../utils/sets_to_arrays');

const polyfillio = require('../../../lib/index');

describe("polyfillio", function () {
	this.timeout(30000);

	describe(".getPolyfills(features)", () => {

		it("should not include unused dependencies", () => {
			const input = {
				features: {
					'Promise': {}
				},
				uaString: 'chrome/45'
			};
			return polyfillio.getPolyfills(input).then(result => assert.deepEqual(setsToArrays(result), {}));
		});

		it("should return polyfills for unknown UA when unknown is not set", () => {
			return polyfillio.getPolyfills({
				features: {
					'Math.sign': {}
				},
				uaString: ''
			}).then(result => assert.deepEqual(setsToArrays(result), {
				'Math.sign': {
					"flags": ["gated"]
				},
				"Object.defineProperty": {
					"aliasOf": [
						"Math.sign",
						"_ESAbstract.CreateMethodProperty"
					],
					"flags": ["gated"]
				},
				"_ESAbstract.CreateMethodProperty": {
					"aliasOf": [
						"Math.sign"
					],
					"flags": ["gated"]
				}
			}));
		});

		it("should return no polyfills for unknown UA when unknown is set to ignore", () => {
			return polyfillio.getPolyfills({
				features: {
					'Math.sign': {}
				},
				uaString: '',
				unknown: 'ignore',
			}).then(result => assert.deepEqual(setsToArrays(result), {}));
		});

		it("should return polyfills for unknown UA when unknown is set to `polyfill`", () => {
			return polyfillio.getPolyfills({
				features: {
					'Math.sign': {}
				},
				unknown: 'polyfill',
				uaString: ''
			}).then(result => assert.deepEqual(setsToArrays(result), {
				'Math.sign': {
					"flags": ["gated"]
				},
				"Object.defineProperty": {
					"aliasOf": [
						"Math.sign",
						"_ESAbstract.CreateMethodProperty"
					],
					"flags": ["gated"]
				},
				"_ESAbstract.CreateMethodProperty": {
					"aliasOf": [
						"Math.sign"
					],
					"flags": ["gated"]
				}
			}));
		});

		it("should return polyfills for unknown UA when unknown is set to `polyfill` and `uaString` param is not set", () => {
			// ... even when `uaString` param is missing entirely
			return polyfillio.getPolyfills({
				features: {
					'Math.sign': {}
				},
				unknown: 'polyfill',
			}).then(result => assert.deepEqual(setsToArrays(result), {
				'Math.sign': {
					"flags": ["gated"]
				},
				"Object.defineProperty": {
					"aliasOf": [
						"Math.sign",
						"_ESAbstract.CreateMethodProperty"
					],
					"flags": ["gated"]
				},
				"_ESAbstract.CreateMethodProperty": {
					"aliasOf": [
						"Math.sign"
					],
					"flags": ["gated"]
				}
			}));
		});

		it("should understand the 'all' alias", () => {
			return polyfillio.getPolyfills({
				features: {
					'all': {
						flags: []
					}
				},
				uaString: 'ie/8'
			}).then(result => assert(Object.keys(result).length > 0));
		});

		it("should respect the excludes option", async () => {
			const chrome30NoExcludes = await polyfillio.getPolyfills({
				features: {
					'fetch': {}
				},
				uaString: 'chrome/30'
			});
			assert.deepEqual(setsToArrays(chrome30NoExcludes), {
				"fetch": {
					"flags": []
				},
				"Promise": {
					"flags": [],
					"aliasOf": [
						"fetch"
					]
				},
				"Symbol.iterator": {
					"flags": [],
					"aliasOf": [
						"fetch"
					]
				},
				"_ESAbstract.CreateMethodProperty": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Function.prototype.bind",
						"Object.create",
						"Object.defineProperties",
						"Object.freeze",
						"Object.getOwnPropertyDescriptor",
						"Object.getOwnPropertyNames",
						"Object.getPrototypeOf",
						"Object.keys",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"_ESAbstract.OrdinaryCreateFromConstructor",
						"fetch"
					]
				},
				"_ESAbstract.ToObject": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Object.create",
						"Object.defineProperties",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.GetMethod",
						"_ESAbstract.GetV",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"_ESAbstract.ToLength": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"fetch"
					]
				},
				"_ESAbstract.Get": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Object.create",
						"Object.defineProperties",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"_ESAbstract.GetPrototypeFromConstructor",
						"_ESAbstract.OrdinaryCreateFromConstructor",
						"_ESAbstract.OrdinaryToPrimitive",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"_ESAbstract.IsCallable": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Function.prototype.bind",
						"Object.getOwnPropertyDescriptor",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.GetMethod",
						"_ESAbstract.OrdinaryToPrimitive",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"_ESAbstract.HasProperty": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"fetch"
					]
				},
				"_ESAbstract.Call": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.OrdinaryToPrimitive",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"_ESAbstract.ToString": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"fetch"
					]
				},
				"Symbol.toStringTag": {
					"flags": [],
					"aliasOf": [
						"Promise",
						"fetch"
					]
				},
				"Symbol": {
					"flags": [],
					"aliasOf": [
						"Promise",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"fetch"
					]
				},
				"_ESAbstract.ToInteger": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.forEach",
						"_ESAbstract.ToLength",
						"fetch"
					]
				},
				"_ESAbstract.ToPrimitive": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.forEach",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"_ESAbstract.Type": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Object.create",
						"Object.defineProperties",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"_ESAbstract.GetPrototypeFromConstructor",
						"_ESAbstract.IsConstructor",
						"_ESAbstract.OrdinaryCreateFromConstructor",
						"_ESAbstract.OrdinaryToPrimitive",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"Object.keys": {
					"flags": [],
					"aliasOf": [
						"Object.create",
						"Object.defineProperties",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"fetch"
					]
				},
				"_ESAbstract.GetMethod": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.IsConstructor",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"_ESAbstract.OrdinaryToPrimitive": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.forEach",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"_ESAbstract.ArraySpeciesCreate": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"fetch"
					]
				},
				"_ESAbstract.ToBoolean": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"fetch"
					]
				},
				"_ESAbstract.CreateDataPropertyOrThrow": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"fetch"
					]
				},
				"_ESAbstract.GetV": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.forEach",
						"_ESAbstract.GetMethod",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					]
				},
				"_ESAbstract.IsArray": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"fetch"
					]
				},
				"_ESAbstract.ArrayCreate": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"fetch"
					]
				},
				"_ESAbstract.IsConstructor": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"fetch"
					]
				},
				"_ESAbstract.Construct": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"fetch"
					]
				},
				"_ESAbstract.CreateDataProperty": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.CreateDataPropertyOrThrow",
						"fetch"
					]
				},
				"_ESAbstract.OrdinaryCreateFromConstructor": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"fetch"
					]
				},
				"_ESAbstract.GetPrototypeFromConstructor": {
					"flags": [],
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Promise",
						"Symbol",
						"Symbol.iterator",
						"Symbol.toStringTag",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"_ESAbstract.OrdinaryCreateFromConstructor",
						"fetch"
					]
				}
			});

			const chrome30ExcludePromise = await polyfillio.getPolyfills({
				features: {
					'fetch': {}
				},
				excludes: ["Promise", "non-existent-feature"],
				uaString: 'chrome/30'
			});

			assert.deepEqual(setsToArrays(chrome30ExcludePromise), {
				"Object.keys": {
					"aliasOf": [
						"Object.create",
						"Object.defineProperties",
						"Symbol",
						"Symbol.iterator",
						"fetch"
					],
					"flags": []
				},
				"Symbol": {
					"aliasOf": [
						"Symbol.iterator",
						"fetch"
					],
					"flags": []
				},
				"Symbol.iterator": {
					"aliasOf": [
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.ArrayCreate": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"fetch",
					],
					"flags": []
				},
				"_ESAbstract.ArraySpeciesCreate": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.Call": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.OrdinaryToPrimitive",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.Construct": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"fetch",
					],
					"flags": []
				},
				"_ESAbstract.CreateDataProperty": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.CreateDataPropertyOrThrow",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.CreateDataPropertyOrThrow": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.CreateMethodProperty": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Function.prototype.bind",
						"Object.create",
						"Object.defineProperties",
						"Object.freeze",
						"Object.getOwnPropertyDescriptor",
						"Object.getOwnPropertyNames",
						"Object.getPrototypeOf",
						"Object.keys",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"_ESAbstract.OrdinaryCreateFromConstructor",
						"fetch",
					],
					"flags": []
				},
				"_ESAbstract.Get": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Object.create",
						"Object.defineProperties",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"_ESAbstract.GetPrototypeFromConstructor",
						"_ESAbstract.OrdinaryCreateFromConstructor",
						"_ESAbstract.OrdinaryToPrimitive",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.GetMethod": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.IsConstructor",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.GetPrototypeFromConstructor": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"_ESAbstract.OrdinaryCreateFromConstructor",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.GetV": {
					"aliasOf": [
						"Array.prototype.forEach",
						"_ESAbstract.GetMethod",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.HasProperty": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.IsArray": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.IsCallable": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Function.prototype.bind",
						"Object.getOwnPropertyDescriptor",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.GetMethod",
						"_ESAbstract.OrdinaryToPrimitive",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.IsConstructor": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.OrdinaryCreateFromConstructor": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.OrdinaryToPrimitive": {
					"aliasOf": [
						"Array.prototype.forEach",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.ToBoolean": {
					"aliasOf": [
						"Array.prototype.filter",
						"Symbol",
						"Symbol.iterator",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.ToInteger": {
					"aliasOf": [
						"Array.prototype.forEach",
						"_ESAbstract.ToLength",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.ToLength": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.ToObject": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Object.create",
						"Object.defineProperties",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.GetMethod",
						"_ESAbstract.GetV",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.ToPrimitive": {
					"aliasOf": [
						"Array.prototype.forEach",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.ToString": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Symbol",
						"Symbol.iterator",
						"fetch"
					],
					"flags": []
				},
				"_ESAbstract.Type": {
					"aliasOf": [
						"Array.prototype.filter",
						"Array.prototype.forEach",
						"Array.prototype.map",
						"Object.create",
						"Object.defineProperties",
						"Symbol",
						"Symbol.iterator",
						"_ESAbstract.ArraySpeciesCreate",
						"_ESAbstract.Construct",
						"_ESAbstract.GetPrototypeFromConstructor",
						"_ESAbstract.IsConstructor",
						"_ESAbstract.OrdinaryCreateFromConstructor",
						"_ESAbstract.OrdinaryToPrimitive",
						"_ESAbstract.ToPrimitive",
						"_ESAbstract.ToString",
						"fetch"
					],
					"flags": []
				},
				"fetch": {
					"flags": []
				}
			});
		});
	});

	describe('.getPolyfillString', () => {

		it('should produce different output when gated flag is enabled', () => {
			return Promise.all([
				polyfillio.getPolyfillString({
					features: {
						default: {}
					},
					uaString: 'chrome/30'
				}),
				polyfillio.getPolyfillString({
					features: {
						default: {
							flags: new Set(['gated'])
						}
					},
					uaString: 'chrome/30'
				})
			]).then(results => {
				assert.notEqual(setsToArrays(results[0]), setsToArrays(results[1]));
			});
		});

		it('should support streaming output', done => {
			const ReadableStream = require('stream').Readable;
			const buf = [];
			const s = polyfillio.getPolyfillString({
				features: {
					default: {}
				},
				uaString: 'chrome/30',
				stream: true,
				minify: false
			});
			assert.instanceOf(s, ReadableStream);
			s.on('data', chunk => buf.push(chunk));
			s.on('end', () => {
				const bundle = buf.join('');
				assert.include(bundle, 'Polyfill service');
				assert.include(bundle, "function(undefined)");
				done();
			});
		});

	});
});