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
		[6, 4, 5, , 3].sort(),
		// eslint-disable-next-line no-sparse-arrays
		[3, 4, 5, 6, , ]
	);

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
		[6, 4, 5, undefined, 3].sort(),
		[3, 4, 5, 6, undefined]
	);

	proclaim.deepStrictEqual(
		[6, 4, 5, undefined, 3].sort(function (a, b) {
			return a - b;
		}),
		[3, 4, 5, 6, undefined]
	);
});

it("sorts arrays with comparefn that returns non-number results", function () {
	proclaim.deepStrictEqual(
		// eslint-disable-next-line no-sparse-arrays
		[6, 4, 5, , 3].sort(function () {
			return 'x';
		}),
		// eslint-disable-next-line no-sparse-arrays
		[6, 4, 5, 3, , ]
	);

	proclaim.deepStrictEqual(
		// eslint-disable-next-line no-sparse-arrays
		[6, 4, 5, , 3].sort(function (a, b) {
			return (a - b).toString();
		}),
		// eslint-disable-next-line no-sparse-arrays
		[3, 4, 5, 6, , ]
	);

	proclaim.deepStrictEqual(
		// eslint-disable-next-line no-sparse-arrays
		[6, 4, 5, , 3].sort(function () {
			return '0';
		}),
		// eslint-disable-next-line no-sparse-arrays
		[6, 4, 5, 3, , ]
	);
});

it("has a stable sort with array-like objects", function () {
	var obj = { length: 3, 0: 2, 1: 1, 2: 3 };
	proclaim.deepStrictEqual(
		Array.prototype.sort.call(obj, function (a, b) {
			return a - b;
		}),
		obj
	);

	proclaim.equal(obj[0], 1);
	proclaim.equal(obj[1], 2);
	proclaim.equal(obj[2], 3);
});

it("has a stable sort with arrays that contain duplicate values", function () {
	var array = [
		{ unique: 'a', sortValue: 1 },
		{ unique: 'b', sortValue: 2 },
		{ unique: 'c', sortValue: 0 },
		{ unique: 'd', sortValue: 4 },
		{ unique: 'e', sortValue: 2 },
		{ unique: 'f', sortValue: 2 }
	];

	array.sort(function (a, b) {
		return a.sortValue - b.sortValue;
	});

	proclaim.equal(array[0].unique, 'c');
	proclaim.equal(array[1].unique, 'a');
	proclaim.equal(array[2].unique, 'b');
	proclaim.equal(array[3].unique, 'e');
	proclaim.equal(array[4].unique, 'f');
	proclaim.equal(array[5].unique, 'd');
});

it("has a stable sort with arrays that contain duplicate values and comparefn occasionally returns NaN", function () {
	var array = [
		{ unique: 'a', sortValue: 1 },
		{ unique: 'b', sortValue: 2 },
		{ unique: 'c', sortValue: 0 },
		{ unique: 'd', sortValue: 4 },
		{ unique: 'e', sortValue: undefined },
		{ unique: 'f', sortValue: 2 }
	];

	array.sort(function (a, b) {
		return a.sortValue - b.sortValue;
	});

	proclaim.equal(array[0].unique, 'c');
	proclaim.equal(array[1].unique, 'a');
	proclaim.equal(array[2].unique, 'b');
	proclaim.equal(array[3].unique, 'd');
	proclaim.equal(array[4].unique, 'e');
	proclaim.equal(array[5].unique, 'f');
});
