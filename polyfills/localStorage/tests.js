/* eslint-env mocha, browser */
/* global proclaim */

beforeEach(function () {
	localStorage.clear();
	localStorage.setItem('hi', 'there');
});

describe('getItem', function () {
	it('should get an item', function () {
		proclaim.equal(localStorage.getItem('hi'), 'there');
	});
});

describe('setItem', function () {
	it('should set an item', function () {
		localStorage.setItem('x', 'y');
		proclaim.equal(localStorage.getItem('x'), 'y');
	});

	it('should set an item with special characters', function () {
		var key = 'x [{]}\\|;:\'",<.>/?!@#$%^&*()-_=+\n\t'
		localStorage.setItem(key, 'y');
		proclaim.equal(localStorage.getItem(key), 'y');
	});

	it('should set an item with an empty key', function () {
		localStorage.setItem('', 'y');
		proclaim.equal(localStorage.getItem(''), 'y');
	});
});

describe('removeItem', function () {
	it('should remove an item', function () {
		localStorage.removeItem('hi');
		proclaim.equal(localStorage.getItem('hi'), null);
	});
});

describe('key', function () {
	it('should get a key', function () {
		proclaim.equal(localStorage.key(0), 'hi');
	});
});

describe('clear', function () {
	it('should clear all items', function () {
		localStorage.clear();
		proclaim.equal(localStorage.getItem('hi'), null);
	});
});

describe('length', function () {
	it('should get number of items', function () {
		proclaim.equal(localStorage.length, 1);
	});
});
