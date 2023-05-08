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

it("sorts", function () {
	proclaim.deepStrictEqual(
		Array.prototype.sort.call(["b", "c", "a"]),
		["a", "b", "c"]
	);

	proclaim.deepStrictEqual(
		["b", "c", "a"].sort(),
		["a", "b", "c"]
	);
});

it("sorts sparse arrays", function () {
	proclaim.deepStrictEqual(
		// eslint-disable-next-line no-sparse-arrays
		[6, 4, 5, , 3].sort(function (a, b) {
			return a - b;
		}),
		// eslint-disable-next-line no-sparse-arrays
		[3, 4, 5, 6, , ]
	);
});

it("sorts arrays with undefined", function () {
	proclaim.deepStrictEqual(
		[6, 4, 5, undefined, 3].sort(function (a, b) {
			return a - b;
		}),
		[3, 4, 5, 6, undefined]
	);
});

it("sorts arrays with comparefn that returns invalid results", function () {
	proclaim.deepStrictEqual(
		// eslint-disable-next-line no-sparse-arrays
		[6, 4, 5, , 3].sort(function () {
			return 'x';
		}),
		// eslint-disable-next-line no-sparse-arrays
		[6, 4, 5, 3, , ]
	);
});

it("has a stable sort", function () {
	var obj = {length:3, 0:2, 1:1,2:3};
	proclaim.deepStrictEqual(
		Array.prototype.sort.call(obj, function (a, b) {
			return a - b;
		}),
		obj
	);
});
