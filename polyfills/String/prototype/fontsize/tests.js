
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
	proclaim.isFunction(String.prototype.fontsize);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.fontsize, 1);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.fontsize, 'fontsize');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'fontsize');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
    proclaim["throws"](function () {
        String.prototype.fontsize.call(undefined);
    }, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
    proclaim["throws"](function () {
        String.prototype.fontsize.call(null);
    }, TypeError);
});

it('works on strings correctly', function() {
	proclaim.deepEqual('_'.fontsize('b'), '<font size="b">_</font>');
	proclaim.deepEqual('<'.fontsize('<'), '<font size="<"><</font>');
	proclaim.deepEqual('_'.fontsize(1234), '<font size="1234">_</font>');
	proclaim.deepEqual('_'.fontsize('\x22a\x22'), '<font size="&quot;a&quot;">_</font>');
	proclaim.deepEqual(String.prototype.fontsize.call(1234, 5678), '<font size="5678">1234</font>');
});