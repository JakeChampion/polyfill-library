/* eslint-env mocha */
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
	proclaim.isFunction(String.prototype.strike);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.strike, 0);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.strike, 'strike');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'strike');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
    proclaim.throws(function () {
        String.prototype.strike.call(undefined);
    }, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
    proclaim.throws(function () {
        String.prototype.strike.call(null);
    }, TypeError);
});

it('works on strings correctly', function() {
	proclaim.deepEqual('_'.strike(), '<strike>_</strike>');
	proclaim.deepEqual('<'.strike(), '<strike><</strike>');
	proclaim.deepEqual(String.prototype.strike.call(1234), '<strike>1234</strike>');
});