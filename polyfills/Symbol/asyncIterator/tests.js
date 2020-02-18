/* eslint-env mocha, browser */
/* global proclaim, Symbol */

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        for (var _ in obj) { return false; }
		return obj.x === obj;
	} catch (e) { // this is IE 8.
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

it('has the well known symbol async-iterator as static properties on Symbol', function() {
	proclaim.notEqual(Symbol.asyncIterator, undefined);

	if (supportsDescriptors) {
		var asyncIterator = Symbol.asyncIterator;
		Symbol.asyncIterator = "nope";
		proclaim.equal(Symbol.asyncIterator, asyncIterator);
	}
});

