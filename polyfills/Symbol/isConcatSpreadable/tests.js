/* eslint-env mocha, browser */
/* global proclaim, Symbol */

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
	for (var _ in obj) { return false; }
	return obj.x === obj;
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

it('has the well known symbol isConcatSpreadable as static properties on Symbol', function() {
	proclaim.notEqual(Symbol.isConcatSpreadable, undefined);

	if (supportsDescriptors) {
		var isConcatSpreadable = Symbol.isConcatSpreadable;
		Symbol.isConcatSpreadable = "nope";
		proclaim.equal(Symbol.isConcatSpreadable, isConcatSpreadable);
	}
});
