
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
	proclaim.isFunction(String.prototype.fixed);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.fixed, 0);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.fixed, 'fixed');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'fixed');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
    proclaim["throws"](function () {
        String.prototype.fixed.call(undefined);
    }, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
    proclaim["throws"](function () {
        String.prototype.fixed.call(null);
    }, TypeError);
});

it('works on strings correctly', function() {
	proclaim.deepEqual('_'.fixed(), '<tt>_</tt>');
	proclaim.deepEqual('<'.fixed(), '<tt><</tt>');
	proclaim.deepEqual(String.prototype.fixed.call(1234), '<tt>1234</tt>');
});