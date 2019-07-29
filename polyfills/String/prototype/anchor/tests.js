/* eslint-env mocha */
/* globals proclaim */
var hasStrictMode = (function () {
	return this === null;
}).call(null);

var ifHasStrictModeIt = hasStrictMode ? it : it.skip;

it('is a function', function () {
    proclaim.isFunction(String.prototype.anchor);
});

it('has correct arity', function () {
    proclaim.arity(String.prototype.anchor, 1);
});

it('has correct name', function () {
    proclaim.hasName(String.prototype.anchor, 'anchor');
});

it('is not enumerable', function () {
    proclaim.isNotEnumerable(String.prototype, 'anchor');
});

ifHasStrictModeIt('should throw a TypeError when called with undefined context', function () {
    proclaim.throws(function () {
        String.prototype.anchor.call(undefined);
    }, TypeError);
});

ifHasStrictModeIt('should throw a TypeError when called with null context', function () {
    proclaim.throws(function () {
        String.prototype.anchor.call(null);
    }, TypeError);
});

it('works on strings correctly', function() {
    proclaim.deepEqual('_'.anchor('b'), '<a name="b">_</a>');
    proclaim.deepEqual('<'.anchor('<'), '<a name="<"><</a>');
    proclaim.deepEqual('_'.anchor(1234), '<a name="1234">_</a>');
    proclaim.deepEqual('_'.anchor('\x22a\x22'), '<a name="&quot;a&quot;">_</a>');
    proclaim.deepEqual(String.prototype.anchor.call(1234, 5678), '<a name="5678">1234</a>');
});