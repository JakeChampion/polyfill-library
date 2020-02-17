/* eslint-env mocha, browser */
/* global proclaim Promise*/

describe('queueMicrotask', function() {
	it('is defined as a function in the global scope', function() {
        	proclaim.deepStrictEqual(typeof queueMicrotask, 'function');
	});

	it('throws type error if an argument is 0', function() {
		proclaim["throws"](function() { queueMicrotask(0) }, TypeError);
	});

	it('throws type error if no argument is supplied', function() {
		proclaim["throws"](function() { queueMicrotask() }, TypeError);
	});

	it('throws type error if an argument is undefined', function() {
		proclaim["throws"](function() { queueMicrotask(undefined) }, TypeError);
	});

	it('throws type error if an argument is null', function() {
		proclaim["throws"](function() { queueMicrotask(null) }, TypeError);
	});

	it('throws type error if an argument is of a String type', function() {
		proclaim["throws"](function() { queueMicrotask('test') }, TypeError);
	});
	
	it('rethrows exceptions from the microtask callback', function(done) {
		var error = new Error("uh oh");
		self.addEventListener("error", function(event) {
			proclaim.deepStrictEquals(event.error, error);
			done();
		});
		queueMicrotask(function () { throw error; });
	});

	it('array elements are inserted in the correct order',  function(done) {
		var testArray = [];
		Promise.resolve().then(function() { testArray.push('1')} );
		queueMicrotask(function () { testArray.push('2') } );
		Promise.resolve().then(function() {
			testArray.push('3');
			proclaim.deepEqual(testArray, ['1', '2', '3']);
			done();
		})
	});
	
	it('runs all queued microtasks even if previous ones threw errors',  function(done) {
		var testArray = [];
		queueMicrotask(function () { testArray.push('1') } );
		queueMicrotask(function () { throw new Error('uh oh')} );
		queueMicrotask(function () { testArray.push('2') } );
		Promise.resolve().then(function() {
			testArray.push('3');
			proclaim.deepEqual(testArray, ['1', '2', '3']);
			done();
		})
	});

	it('microtask runs before timeout 0', function(done) {
		var testvalue = 0;
		setTimeout(function() {
			proclaim.equal(testvalue, 2);
			done();
		}, 0);
		queueMicrotask(function () {
			testvalue = 2;
		});
	});

	it('does not pass any arguments to the callback', function() {
		queueMicrotask(function () {
			proclaim.deepStrictEqual(arguments, []);
		}, 1, 2);

	});
});
