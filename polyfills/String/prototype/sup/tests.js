
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
	proclaim.isFunction(String.prototype.sup);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.sup, 0);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.sup, 'sup');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'sup');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
    proclaim["throws"](function () {
        String.prototype.sup.call(undefined);
    }, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
    proclaim["throws"](function () {
        String.prototype.sup.call(null);
    }, TypeError);
});

it('works on strings correctly', function() {
	proclaim.deepEqual('_'.sup(), '<sup>_</sup>');
	proclaim.deepEqual('<'.sup(), '<sup><</sup>');
	proclaim.deepEqual(String.prototype.sup.call(1234), '<sup>1234</sup>');
});