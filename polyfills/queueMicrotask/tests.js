/* eslint-env mocha, browser */
/* global proclaim Promise*/

describe('queueMicrotask', function() {
    it('is defined as a function on window', function() {
        proclaim.isTypeOf(window.queueMicrotask, 'function');
	});

	it('throws type error if an argument is 0', function(){
		proclaim["throws"](function() { window.queueMicrotask(0) }, TypeError);
	});

	it('throws type error if no argument is supplied', function() {
		proclaim["throws"](function() { window.queueMicrotask() }, TypeError);
	});

	it('throws type error if an argument is undefined', function() {
		proclaim["throws"](function() { window.queueMicrotask(undefined) }, TypeError);
	});

	it('throws type error if an argument is null', function(){
		proclaim["throws"](function() { window.queueMicrotask(null) }, TypeError);
	});

	it('throws type error if an argument is of a String type', function(){
		proclaim["throws"](function() { window.queueMicrotask('test') }, TypeError);
	});

	it('array elements are inserted in correct order', async () => {
		var testArray = [];
		Promise.resolve().then(function() { testArray.push('1')} );
		queueMicrotask(function () { testArray.push('2') } );
		await Promise.resolve().then(function() { testArray.push('3')})
		proclaim.deepEqual(testArray, ['1', '2', '3']);
	});

	it('microtask runs before timeout 0', async () => {
		var testvalue = 0;
		setTimeout(function() {
			testvalue = 1;
		}, 0);
		await queueMicrotask(function () { testvalue = 2 });
		proclaim.equal(testvalue, 2);
	});

	it('throws type error if more than one argument has been supplied', function() {
		proclaim["throws"](function() { window.queueMicrotask(function() {}, [], []) }, TypeError);
	});
});
