/* eslint-env mocha, browser */
/* global proclaim, Symbol */

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
	for (var _ in obj) { return false; }
	return obj.x === obj;
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

it('has the well known symbol hasInstance as static properties on Symbol', function() {
	proclaim.notEqual(Symbol.hasInstance, undefined);

	if (supportsDescriptors) {
		var hasInstance = Symbol.hasInstance;
		Symbol.hasInstance = "nope";
		proclaim.equal(Symbol.hasInstance, hasInstance);
	}
});
