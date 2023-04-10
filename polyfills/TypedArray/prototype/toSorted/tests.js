/* eslint-env mocha, browser */
/* global proclaim, Int8Array */

// use "Int8Array" as a proxy for all "TypedArray" subclasses

it('is a function', function () {
	proclaim.isFunction(Int8Array.prototype.toSorted);
});

it('has correct arity', function () {
	proclaim.arity(Int8Array.prototype.toSorted, 1);
});

it('has correct name', function () {
	proclaim.hasName(Int8Array.prototype.toSorted, 'toSorted');
});

it('is not enumerable', function () {
	if ('__proto__' in Int8Array.prototype && self.Int8Array.prototype.__proto__ !== Object.prototype) {
		proclaim.isNotEnumerable(Int8Array.prototype.__proto__, 'toSorted');
	} else {
		proclaim.isNotEnumerable(Int8Array.prototype, 'toSorted');
	}
});

describe('toSorted', function () {
	var typedArray = new Int8Array(5);
	typedArray[0] = 6;
	typedArray[1] = 4;
	typedArray[2] = 5;
	typedArray[4] = 3;

	it('should sort with no comparefn (by copy)', function () {
		proclaim.equal(typedArray.toSorted().toString(), [0, 3, 4, 5, 6].toString());
		proclaim.equal(typedArray[0], 6);
	});

	it('should sort with comparefn (by copy)', function () {
		proclaim.deepStrictEqual(typedArray.toSorted(function (a, b) {
			return a - b;
		}).toString(), [0, 3, 4, 5, 6].toString());
		proclaim.equal(typedArray[0], 6);
	});

	it('should throw for invalid comparefn', function () {
		proclaim.throws(function () {
			typedArray.toSorted('invalid');
		});
	});
});
