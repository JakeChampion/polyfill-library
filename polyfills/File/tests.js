/* eslint-env mocha, browser */
/* global proclaim, File */

it('is a function', function () {
	proclaim.isFunction(File);
});

it('has correct arity', function () {
	proclaim.arity(File, 2);
});

it('has correct name', function () {
	proclaim.hasName(File, 'File');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(window, 'File');
});

describe('File', function() {
	it("has valid constructor", function () {
		proclaim.isInstanceOf(new File([], ''), File);
		proclaim.equal((new File([], '')).constructor, File);
		proclaim.equal((new File([], '')).constructor.name, "File");
		if ("__proto__" in {}) {
			proclaim.equal(Object.prototype.isPrototypeOf.call((new File([], '')).__proto__, new File([], '')), true);
			proclaim.equal((new File([], '')).__proto__ === File.prototype, true);
		}
	});

	it("implements .name", function () {
		var a = new File([], '');
		proclaim.equal(a.name, '');	

		var b = new File([], 'beta');
		proclaim.equal(b.name, 'beta');

		// The name constructor param takes just about anything
		// Make sure we match native behaviour.
		var c = new File([], {});
		proclaim.equal(c.name, '[object Object]');
		
		var d = new File([], 5);
		proclaim.equal(d.name, '5');

		var d = new File([], function(){});
		proclaim.equal(d.name, 'function(){}');

		var eStringer = {};
		eStringer.toString = function () {
			return 'stringer';	
		}
		var e = new File([], eStringer);
		proclaim.equal(e.name, 'stringer');
	});

	// https://bugs.chromium.org/p/chromium/issues/detail?id=1105171
	// it("implements .name escaping", function () {
	// 	// 4.1.2 https://w3c.github.io/FileAPI/#file-constructor
	// 	// Let n be a new string of the same size as the fileName argument to the constructor.
	// 	// Copy every character from fileName to n, replacing any "/" character (U+002F SOLIDUS) with a ":" (U+003A COLON).
	// 	var f = new File([], '/alpha//beta/');
	// 	proclaim.equal(f.name, ":alpha::beta:");
	// });

	it("implements .lastModified", function () {
		// set "now" so that we can compare later
		var now = new Date();

		var a = new File([], '', {lastModified: 100});
		proclaim.equal(a.lastModified, 100);

		// Hard to get a fixed number without passing an exact value for lastModified
		// Just checking if it is a number
		var b = new File([], 'beta');
		proclaim.equal(typeof b.lastModified, 'number');
		proclaim.ok(now < b.lastModified);
	});
});
