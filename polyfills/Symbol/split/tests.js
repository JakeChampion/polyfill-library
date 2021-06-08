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

it('has the well known symbol split as static properties on Symbol', function() {
	proclaim.notEqual(Symbol.split, undefined);

	if (supportsDescriptors) {
		var split = Symbol.split;
		Symbol.split = "nope";
		proclaim.equal(Symbol.split, split);
	}
});
