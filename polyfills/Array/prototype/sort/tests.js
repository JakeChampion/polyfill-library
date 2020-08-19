/* globals proclaim */

it("is a function", function () {
	proclaim.isFunction(Array.prototype.sort);
});

it("has correct arity", function () {
	proclaim.arity(Array.prototype.sort, 1);
});

it("has correct name", function () {
	proclaim.hasName(Array.prototype.sort, "sort");
});

it("is not enumerable", function () {
	proclaim.isNotEnumerable(Array.prototype, "sort");
});

it("has a stable sort", function () {
	var obj = {
		length: 3,
		0: 2,
		1: 1,
		2: 3
	};
	proclaim.deepStrictEqual(
		Array.prototype.sort.call(obj, function (a, b) {
			return a - b;
		}),
		obj
	);
});
