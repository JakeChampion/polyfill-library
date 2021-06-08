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

it('has the well known symbol toStringTag as static properties on Symbol', function() {
	proclaim.notEqual(Symbol.toStringTag, undefined);

	if (supportsDescriptors) {
		var toStringTag = Symbol.toStringTag;
		Symbol.toStringTag = "nope";
		proclaim.equal(Symbol.toStringTag, toStringTag);
	}
});
