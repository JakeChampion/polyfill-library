
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;


it('is a function', function () {
	proclaim.isFunction(String.prototype.fontcolor);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.fontcolor, 1);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.fontcolor, 'fontcolor');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'fontcolor');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
    proclaim["throws"](function () {
        String.prototype.fontcolor.call(undefined);
    }, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
    proclaim["throws"](function () {
        String.prototype.fontcolor.call(null);
    }, TypeError);
});

it('works on strings correctly', function() {
	proclaim.deepEqual('_'.fontcolor('b'), '<font color="b">_</font>');
	proclaim.deepEqual('<'.fontcolor('<'), '<font color="<"><</font>');
	proclaim.deepEqual('_'.fontcolor(1234), '<font color="1234">_</font>');
	proclaim.deepEqual('_'.fontcolor('\x22a\x22'), '<font color="&quot;a&quot;">_</font>');
	proclaim.deepEqual(String.prototype.fontcolor.call(1234, 5678), '<font color="5678">1234</font>');
});