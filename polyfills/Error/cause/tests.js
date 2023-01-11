/* eslint-env mocha, browser */
/* global proclaim */

var testCases = [
	{_Error: Error, name: 'Error', arity: 1},
	{_Error: EvalError, name: 'EvalError', arity: 1},
	{_Error: RangeError, name: 'RangeError', arity: 1},
	{_Error: ReferenceError, name: 'ReferenceError', arity: 1},
	{_Error: SyntaxError, name: 'SyntaxError', arity: 1},
	{_Error: TypeError, name: 'TypeError', arity: 1},
	{_Error: URIError, name: 'URIError', arity: 1}
];

testCases.forEach(function (testCase) {
	var _Error = testCase._Error;
	var name = testCase.name;
	var arity = testCase.arity;
	describe(name, function () {
		it('is a function', function () {
			proclaim.isFunction(_Error);
		});

		it('has correct arity', function () {
			proclaim.arity(_Error, arity);
		});

		it('has correct name', function () {
			proclaim.hasName(_Error, name);
		});

		it('is not enumerable', function () {
			proclaim.isNotEnumerable(self, name);
		});

		it('has the right prototype', function () {
			if (name === 'Error') {
				proclaim.equal(Object.getPrototypeOf(_Error), Function.prototype);
			} else {
				try {
					proclaim.equal(Object.getPrototypeOf(_Error), Error);
				} catch (err) {
					// `TypeError` and other `Error` flavors have the wrong prototype in ie9 and ie10
					proclaim.equal(Object.getPrototypeOf(_Error), Function.prototype);
				}
			}
		});

		it("is instance of", function () {
			var error = new _Error('m', { cause: 'c' });
			proclaim.ok(error instanceof Error);
			proclaim.ok(error instanceof _Error);
		});

		it('creates an object without a cause', function () {
			proclaim.equal(new _Error('m').name, name);
			proclaim.equal(new _Error('m').message, 'm');
			proclaim.doesNotInclude(new _Error('m'), 'cause');
			proclaim.doesNotInclude(new _Error('m', null), 'cause');
			proclaim.doesNotInclude(new _Error('m', {}), 'cause');
		});

		it('creates an object with a cause', function () {
			var error = new _Error('m', { cause: 'c' });
			proclaim.equal(error.name, name);
			proclaim.equal(error.message, 'm');
			proclaim.equal(error.cause, 'c');
			proclaim.isNotEnumerable(error, 'cause');
		});

		it('creates an object without new', function () {
			proclaim.isObject(_Error());
		});
	});
});
