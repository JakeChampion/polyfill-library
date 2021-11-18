
/* globals proclaim, AggregateError */

function makeArrayIterator (array) {
	var i = 0;
	var iterator = {};
	// polyfill for `Symbol.iterator` has been provided as part of `IterableToList`
	iterator[self.Symbol.iterator] = function () {
		return {
			next: function() {
				return i >= array.length
					? { done: true }
					: { value: array[i++] };
			}
		};
	};
	return iterator;
}

it('is a function', function () {
	proclaim.isFunction(AggregateError);
});

describe('AggregateError', function () {
	it("constructs an AggregateError", function () {
		var aggregateError = new AggregateError([]);
		proclaim.ok(aggregateError instanceof Error);
		proclaim.ok(aggregateError instanceof AggregateError);
		proclaim.equal(aggregateError.name, 'AggregateError');
	});

	it("constructs an AggregateError when passed an array", function () {
		var errors = [new Error('x'), new Error('y')];
		var aggregateError = new AggregateError(errors);
		proclaim.equal(aggregateError.message, '');
		proclaim.notEqual(aggregateError.errors, errors);
		proclaim.deepStrictEqual(aggregateError.errors, errors);
	});

	it("constructs an AggregateError when passed an array and message", function () {
		var errors = [new Error('x'), new Error('y')];
		var aggregateError = new AggregateError(errors, 'z');
		proclaim.equal(aggregateError.message, 'z');
		proclaim.notEqual(aggregateError.errors, errors);
		proclaim.deepStrictEqual(aggregateError.errors, errors);
	});

	it("constructs an AggregateError when passed an iterator", function () {
		var errors = [new Error('x'), new Error('y')];
		var iterator = makeArrayIterator(errors);
		var aggregateError = new AggregateError(iterator);
		proclaim.equal(aggregateError.message, '');
		proclaim.notEqual(aggregateError.errors, errors);
		proclaim.deepStrictEqual(aggregateError.errors, errors);
	});

	it("throws an error for input that is not iterable", function () {
		proclaim['throws'](function () {
			new AggregateError(0)
		}, /is not iterable/);
	});
});
