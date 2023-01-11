/* eslint-env mocha, browser */
/* global proclaim */

describe(name, function () {
	it('is a function', function () {
		proclaim.isFunction(self.AggregateError);
	});

	it('has correct arity', function () {
		proclaim.arity(self.AggregateError, 1);
	});

	it('has correct name', function () {
		proclaim.hasName(self.AggregateError, 'AggregateError');
	});

	it('is not enumerable', function () {
		proclaim.isNotEnumerable(self, 'AggregateError');
	});

	it('has the right prototype', function () {
		try {
			proclaim.equal(Object.getPrototypeOf(self.AggregateError), Error);
		} catch (err) {
			// `TypeError` and other `Error` flavors have the wrong prototype in ie9 and ie10
			proclaim.equal(Object.getPrototypeOf(self.AggregateError), Function.prototype);
		}
	});

	it("is instance of", function () {
		var error = new self.AggregateError([], 'm', { cause: 'c' });
		proclaim.ok(error instanceof Error);
		proclaim.ok(error instanceof self.AggregateError);
	});

	it('creates an object without a cause', function () {
		proclaim.equal(new self.AggregateError([], 'm').name, 'AggregateError');
		proclaim.deepEqual(new self.AggregateError([], 'm').errors, []);
		proclaim.equal(new self.AggregateError([], 'm').message, 'm');
		proclaim.doesNotInclude(new self.AggregateError([], 'm'), 'cause');
		proclaim.doesNotInclude(new self.AggregateError([], 'm', null), 'cause');
		proclaim.doesNotInclude(new self.AggregateError([], 'm', {}), 'cause');
	});

	it('creates an object with a cause', function () {
		var error = new self.AggregateError([], 'm', { cause: 'c' });
		proclaim.equal(error.name, 'AggregateError');
		proclaim.deepEqual(error.errors, []);
		proclaim.equal(error.message, 'm');
		proclaim.equal(error.cause, 'c');
		proclaim.isNotEnumerable(error, 'cause');
	});

	it('creates an object without new', function () {
		proclaim.isObject(self.AggregateError([]));
	});
});
