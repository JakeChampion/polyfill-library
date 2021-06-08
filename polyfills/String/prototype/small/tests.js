
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
	proclaim.isFunction(String.prototype.small);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.small, 0);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.small, 'small');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'small');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
	proclaim["throws"](function () {
		String.prototype.small.call(undefined);
	}, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
	proclaim["throws"](function () {
		String.prototype.small.call(null);
	}, TypeError);
});

it('works on strings correctly', function() {
	proclaim.deepEqual('_'.small(), '<small>_</small>');
	proclaim.deepEqual('<'.small(), '<small><</small>');
	proclaim.deepEqual(String.prototype.small.call(1234), '<small>1234</small>');
});
