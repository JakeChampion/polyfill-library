/* eslint-env mocha */
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
	proclaim.isFunction(String.prototype.big);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.big, 0);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.big, 'big');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'big');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
    proclaim["throws"](function () {
        String.prototype.big.call(undefined);
    }, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
    proclaim["throws"](function () {
        String.prototype.big.call(null);
    }, TypeError);
});

it('works on strings correctly', function() {
    proclaim.deepEqual('_'.big(), '<big>_</big>');
    proclaim.deepEqual('<'.big(), '<big><</big>');
    proclaim.deepEqual(String.prototype.big.call(1234), '<big>1234</big>');
});