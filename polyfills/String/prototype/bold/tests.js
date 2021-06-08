
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
	proclaim.isFunction(String.prototype.bold);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.bold, 0);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.bold, 'bold');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'bold');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
	proclaim["throws"](function () {
		String.prototype.bold.call(undefined);
	}, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
	proclaim["throws"](function () {
		String.prototype.bold.call(null);
	}, TypeError);
});

it('works on strings correctly', function() {
	proclaim.deepEqual('_'.bold(), '<b>_</b>');
	proclaim.deepEqual('<'.bold(), '<b><</b>');
	proclaim.deepEqual(String.prototype.bold.call(1234), '<b>1234</b>');
});
