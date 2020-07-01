
/* globals proclaim */

var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
	proclaim.isFunction(String.prototype.link);
});

it('has correct arity', function () {
	proclaim.arity(String.prototype.link, 1);
});

it('has correct name', function () {
	proclaim.hasName(String.prototype.link, 'link');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(String.prototype, 'link');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
    proclaim["throws"](function () {
        String.prototype.link.call(undefined);
    }, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
    proclaim["throws"](function () {
        String.prototype.link.call(null);
    }, TypeError);
});

it('works on strings correctly', function() {
	proclaim.deepEqual('_'.link('b'), '<a href="b">_</a>');
	proclaim.deepEqual('<'.link('<'), '<a href="<"><</a>');
	proclaim.deepEqual('_'.link(1234), '<a href="1234">_</a>');
	proclaim.deepEqual('_'.link('\x22a\x22'), '<a href="&quot;a&quot;">_</a>');
	proclaim.deepEqual(String.prototype.link.call(1234, 5678), '<a href="5678">1234</a>');
});