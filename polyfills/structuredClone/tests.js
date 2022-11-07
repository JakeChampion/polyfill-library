/* eslint-env mocha, browser */
// eslint-disable-next-line no-unused-vars
/* globals proclaim */

describe('structuredClone', function () {
	it('is a function', function () {
		proclaim.isFunction(structuredClone);
	});

	it('has correct arity', function () {
		proclaim.arity(structuredClone, 2);
	});

	const date = new Date;

	const obj = {
	  arr: [],
	  bigint: 1n,
	  boolean: true,
	  number: 123,
	  string: '',
	  undefined: void 0,
	  null: null,
	  int: new Uint32Array([1, 2, 3]),
	  map: new Map([['a', 123]]),
	  set: new Set(['a', 'b']),
	  Bool: new Boolean(false),
	  Num: new Number(0),
	  Str: new String(''),
	  re: new RegExp('test', 'gim'),
	  error: new Error('test'),
	  BI: Object(1n),
	  date
	};

	obj.arr.push(obj, obj, obj);

	var deserialized = structuredClone(obj);

	it('serializes correct types', function () {
		proclaim.isInstanceOf(deserialized.int, Uint32Array);
		proclaim.isInstanceOf(deserialized.Bool, Boolean);
		proclaim.isInstanceOf(deserialized.Num, Number);
		proclaim.isInstanceOf(deserialized.Str, String);
		proclaim.isInstanceOf(deserialized.re, RegExp);
		proclaim.isInstanceOf(deserialized.error, Error);
		proclaim.isInstanceOf(deserialized.BI, BigInt);
		proclaim.isInstanceOf(deserialized.date, Date);
	});

	it('serializes values', function () {
		proclaim.equal(deserialized.bigint, 1n);
		proclaim.equal(deserialized.boolean, true);
		proclaim.equal(deserialized.number, 123);
		proclaim.equal(deserialized.string, '');
		proclaim.equal(deserialized.undefined, void 0);
		proclaim.equal(deserialized.null, null);

		proclaim.equal(deserialized.int.length, 3);
		proclaim.equal(deserialized.int[0], 1);
		proclaim.equal(deserialized.int[1], 2);
		proclaim.equal(deserialized.int[2], 3);

		proclaim.equal(deserialized.map.size, 1);
		proclaim.equal(deserialized.map.get('a'), 123);

		proclaim.equal(deserialized.set.size, 2);
		proclaim.equal([...deserialized.set].join(','), 'a,b');

		proclaim.equal(deserialized.Bool.valueOf(), false);
		proclaim.equal(deserialized.Num.valueOf(), 0);
		proclaim.equal(deserialized.Str.valueOf(), '');
		proclaim.equal(deserialized.re.source, 'test');
		proclaim.equal(deserialized.re.flags, 'gim');
		proclaim.equal(deserialized.error.message, 'test');
		proclaim.equal(deserialized.BI.valueOf(), 1n);
		proclaim.equal(deserialized.date.toISOString(), date.toISOString());
	});

	it('preserves references', function () {
		proclaim.equal(deserialized.arr.length, 3);
		proclaim.equal(deserialized.arr[0], deserialized);
		proclaim.equal(deserialized.arr[1], deserialized);
		proclaim.equal(deserialized.arr[2], deserialized);
	});
});
