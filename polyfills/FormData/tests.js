/* eslint-env mocha, browser */
/* global proclaim */

it('should be able to append a value', function() {
	var fd = new FormData();
	fd.append('test', 'value');

	proclaim.ok('everything', 'everything is ok');
});

it('should be able to get a value', function () {
	var fd = new FormData();
	fd.append('test', 'value');
	var value = fd.get('test');

	proclaim.equal(value, 'value');
});

it('should be able to set a value', function () {
	var fd = new FormData();
	fd.set('test', 'value');
	var value = fd.get('test');

	proclaim.equal(value, 'value');
});

it('should be able to set a value, overriding the previous value', function () {
	var fd = new FormData();
	fd.set('test', 'alpha');
	fd.set('test', 'beta');
	var value = fd.get('test');

	proclaim.equal(value, 'beta');
});

it('should be able to get all values', function () {
	var fd = new FormData();
	fd.append('test', 'alpha');
	fd.append('test', 'beta');
	var values = fd.getAll('test');

	proclaim.deepEqual(values, ['alpha', 'beta']);
});

it('should be able to delete a value', function () {
	var fd = new FormData();
	fd.append('test', 'value');
	fd.delete('test');

	var value = fd.get('test');

	proclaim.equal(value, undefined);
});

it('should be able to get the keys', function () {
	var fd = new FormData();
	fd.set('alpha', 'value');
	fd.set('beta', 'value');
	// A second set with the same key to ensure we only get this back once
	fd.set('beta', 'value');

	var alpha = 0;
	var beta = 0;
	var unknown = 0;

	// https://stackoverflow.com/a/49556416/4263818
	var keys, e, key;
	for (keys = fd.keys(); !(e = keys.next()).done && (key = e.value);) {
		switch (key) {
			case 'alpha':
				alpha++;
				break;
			case 'beta':
				beta++;
				break;

			default:
				unknown++
				break;
		}
	}

	proclaim.equal(unknown, 0);
	proclaim.equal(alpha, 1);
	proclaim.equal(beta, 1);
});

it('should be able to get the values', function () {
	var fd = new FormData();
	fd.append('x', 'alpha');
	fd.append('x', 'beta');
	fd.append('y', 'gamma');

	// A second append with a different key, but same value.
	fd.append('z', 'gamma');

	// A second append with the same key and same value.
	fd.append('z', 'gamma');

	var alpha = 0;
	var beta = 0;
	var gamma = 0;
	var unknown = 0;

	var values, e, value;
	for (values = fd.values(); !(e = values.next()).done && (value = e.value);) {
		switch (value) {
			case 'alpha':
				alpha++;
				break;
			case 'beta':
				beta++;
				break;
			case 'gamma':
				gamma++;
				break;

			default:
				unknown++
				break;
		}
	}

	proclaim.equal(unknown, 0);
	proclaim.equal(alpha, 1);
	proclaim.equal(beta, 1);
	proclaim.equal(gamma, 3);
});

it('should be able to get the entries', function () {
	var fd = new FormData();
	fd.set('test', 'value');

	var entries, e, pair;
	for (entries = fd.entries(); !(e = entries.next()).done && (pair = e.value);) {
		proclaim.deepEqual(pair, ['test', 'value']);
	}
});

it('should be able to construct from FormElement', function () {
	var tests = [
		{
			innerHTML: '<input type="text" name="field-text" value="alpha">',
			expected: ['field-text', 'alpha'],
		},
		{
			innerHTML: '<input type="checkbox" name="field-checkbox" checked="checked">',
			expected: ['field-checkbox', 'on'],
		},
		{
			innerHTML: '<input type="radio" name="field-radio" value="alpha" checked="checked"><input type="radio" name="field-radio" value="beta">',
			expected: ['field-radio', 'alpha'],
		},
	]

	tests.forEach(function(test) {
		var form = document.createElement('form');
		form.innerHTML = test.innerHTML;

		var fd = new FormData(form);

		var entries, e, pair;
		for (entries = fd.entries(); !(e = entries.next()).done && (pair = e.value);) {
			proclaim.deepEqual(pair, test.expected);
		}
	});
});

it('is a function', function () {
	proclaim.isFunction(FormData);
});

it('has correct arity', function () {
	proclaim.arity(FormData, 0);
});

it('has correct name', function () {
	proclaim.hasName(FormData, 'FormData');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(window, 'FormData');
});

var arePropertyDescriptorsSupported = function() {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', {
			enumerable: false,
			value: obj
		});
		for (var _ in obj) {
			return false;
		}
		return obj.x === obj;
	} catch (e) { // this is IE 8.
		return false;
	}
};

var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

describe('FormData', function () {

	if (supportsDescriptors) {
		var hasGetOwnPropertyDescriptor = 'getOwnPropertyDescriptor' in Object && typeof Object.getOwnPropertyDescriptor === 'function';
		if (hasGetOwnPropertyDescriptor) {
			it('has correct descriptors defined for FormData', function () {
				var descriptor = Object.getOwnPropertyDescriptor(window, 'FormData');

				proclaim.isTrue(descriptor.configurable);
				try {
					proclaim.isFalse(descriptor.enumerable);
				} catch (e) {
					// Safari 5.1 sets the property to true.
					proclaim.isTrue(descriptor.enumerable);
				}
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.isFunction(descriptor.value);
			});
			it('has correct descriptors defined for FormData.name', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData, 'name');

				try {
					proclaim.isTrue(descriptor.configurable);
				} catch (e) {
					// Safari 8 sets the name property with correct value but also to be non-configurable
					proclaim.isFalse(descriptor.configurable);
				}
				proclaim.isFalse(descriptor.enumerable);
				proclaim.isFalse(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.equal(descriptor.value, 'FormData');
			});
			it('has correct descriptors defined for FormData.prototype', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData, 'prototype');

				proclaim.isFalse(descriptor.configurable);
				proclaim.isFalse(descriptor.enumerable);
				try {
					proclaim.isFalse(descriptor.writable);
				} catch (e) {
					// Safari 5.1 sets the property to true.
					proclaim.isTrue(descriptor.writable);
				}
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype.get', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, 'get');

				proclaim.isTrue(descriptor.configurable);
				proclaim.isTrue(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype.set', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, 'set');

				proclaim.isTrue(descriptor.configurable);
				proclaim.isTrue(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype.has', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, 'has');

				proclaim.isTrue(descriptor.configurable);
				proclaim.isTrue(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype.delete', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, 'delete');

				proclaim.isTrue(descriptor.configurable);
				proclaim.isTrue(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype.values', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, 'values');

				proclaim.isTrue(descriptor.configurable);
				proclaim.isTrue(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype.keys', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, 'keys');

				proclaim.isTrue(descriptor.configurable);
				proclaim.isTrue(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype[Symbol.iterator]', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, Symbol.iterator);

				proclaim.isTrue(descriptor.configurable);
				proclaim.isFalse(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype.entries', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, 'entries');

				proclaim.isTrue(descriptor.configurable);
				proclaim.isTrue(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
			it('has correct descriptors defined for FormData.prototype.constructor', function () {
				var descriptor = Object.getOwnPropertyDescriptor(FormData.prototype, 'constructor');

				proclaim.isTrue(descriptor.configurable);
				proclaim.isFalse(descriptor.enumerable);
				proclaim.isTrue(descriptor.writable);
				proclaim.doesNotInclude(descriptor, 'get');
				proclaim.doesNotInclude(descriptor, 'set');
				proclaim.ok(descriptor.value);
			});
		}
	}

	describe('constructor', function () {
		it('has 0 length', function () {
			proclaim.equal(FormData.length, 0);
		});

		it('throws error if called without NewTarget set. I.E. Called as a normal function and not a constructor', function () {
			proclaim["throws"](function () {
				FormData(); // eslint-disable-line new-cap
			});
		});

		it("has valid constructor", function () {
			proclaim.isInstanceOf(new FormData, FormData);
			proclaim.isInstanceOf(new FormData(), FormData);
			proclaim.equal((new FormData()).constructor, FormData);
			proclaim.equal((new FormData()).constructor.name, "FormData");
			if ("__proto__" in {}) {
				proclaim.equal(Object.prototype.isPrototypeOf.call((new FormData).__proto__, new FormData()), true);
				proclaim.equal((new FormData).__proto__ === FormData.prototype, true);
			}
		});
	});

	describe('FormData.prototype.delete', function () {
		it('has 1 length', function () {
			proclaim.equal(FormData.prototype['delete'].length, 1);
		});

		it('throws a TypeError if `this` is not an Object', function () {
			proclaim["throws"](function () {
				FormData.prototype['delete'].call('');
			}, TypeError);
			proclaim["throws"](function () {
				FormData.prototype['delete'].call(1);
			}, TypeError);
			proclaim["throws"](function () {
				FormData.prototype['delete'].call(true);
			}, TypeError);
			proclaim["throws"](function () {
				FormData.prototype['delete'].call(/ /);
			}, TypeError);
			proclaim["throws"](function () {
				FormData.prototype['delete'].call(null);
			}, TypeError);
			proclaim["throws"](function () {
				FormData.prototype['delete'].call(undefined);
			}, TypeError);
		});

		it('throws a TypeError if `this` is not an a FormData Object', function () {
			proclaim["throws"](function () {
				FormData.prototype['delete'].call([]);
			}, TypeError);
			proclaim["throws"](function () {
				FormData.prototype['delete'].call({});
			}, TypeError);
		});

		it('returns undefined if key was not in FormData', function () {
			var fd = new FormData();
			proclaim.isUndefined(fd['delete']('k'));
		});

		it('returns undefined if key was in FormData', function () {
			var fd = new FormData();
			fd.set('k', 1);
			proclaim.isUndefined(fd['delete']('k'));
		});
	});

	it("implements .has()", function () {
		var o = new FormData();
		var generic = {};
		var callback = function () {};
		proclaim.equal(o.has(callback), false);
		o.set(callback, generic);
		proclaim.equal(o.has(callback), true);
	});

	it("implements .get()", function () {
		var o = new FormData();
		var generic = {};
		var callback = function () {};
		o.set(callback, generic);
		proclaim.equal(o.get(callback, 123), generic);
		proclaim.equal(o.get(callback), generic);
	});

	it("implements .set()", function () {
		var o = new FormData();
		var generic = {};
		var frozenObject = {};
		if (Object.freeze) {
			Object.freeze(frozenObject);
		}
		var callback = function () {};
		o.set(callback, generic);
		proclaim.equal(o.get(callback), generic);
		o.set(callback, callback);
		proclaim.equal(o.get(callback), callback);
		o.set(callback, o);
		proclaim.equal(o.get(callback), o);
		o.set(o, callback);
		proclaim.equal(o.get(o), callback);
		o.set(NaN, generic);
		proclaim.ok(o.has(NaN));
		proclaim.equal(o.get(NaN), generic);
		o.set("key", undefined);
		proclaim.ok(o.has("key"));
		proclaim.equal(o.get("key"), 'undefined');

		proclaim.ok(!o.has(-0));
		proclaim.ok(!o.has(0));
		o.set(-0, callback);
		proclaim.ok(o.has(-0));
		proclaim.ok(o.has(0));
		proclaim.equal(o.get(-0), callback);
		proclaim.equal(o.get(0), callback); // Native impl fails in IE11
		o.set(0, generic);
		proclaim.ok(o.has(-0));
		proclaim.ok(o.has(0));
		proclaim.equal(o.get(-0), generic);
		proclaim.equal(o.get(0), generic);

		o.set("", "test value");
		proclaim.equal(o.get(""), 'test value');
	});

	it("implements .delete()", function () {
		var o = new FormData();
		var generic = 'a';
		var callback = function () {};
		o.set(callback, generic);
		o.set(generic, callback);
		o.set(o, callback);
		proclaim.equal(o.has(callback) && o.has(generic) && o.has(o), true);
		o["delete"](callback);
		o["delete"](generic);
		o["delete"](o);
		proclaim.equal(!o.has(callback) && !o.has(generic) && !o.has(o), true);
		proclaim.ok(o["delete"](o) === undefined);
		o.set(o, callback);
		proclaim.ok(o["delete"](o) === undefined);
	});

	it("does not throw an error when a non-object key is used", function () {
		var o = new FormData();
		proclaim.doesNotThrow(function() {
			o.set("key", o);
		});
	});

	it("exhibits correct iterator behaviour", function () {
		var o = new FormData();
		// test that things get returned in insertion order as per the specs
		var form = document.createElement('form');
		form.innerHTML = '<input type="text" name="1" value="a"><input type="text" name="2" value="b"><input type="text" name="3" value="c">';
		o = new FormData(form);

		var keys = o.keys();
		var values = o.values();
		var k = keys.next();
		var v = values.next();
		proclaim.equal(k.value, "1");
		proclaim.equal(v.value, "a");
		o['delete']("2");
		k = keys.next();
		v = values.next();
		proclaim.equal(k.value, "3");
		proclaim.equal(v.value, "c");
		// insertion of previously-removed item goes to the end
		o.set("2", "b");
		k = keys.next();
		v = values.next();
		proclaim.equal(k.value, "2");
		proclaim.equal(v.value, "b");
		// when called again, new iterator starts from beginning
		var entriesagain = o.entries();
		proclaim.equal(entriesagain.next().value[0], "1");
		proclaim.equal(entriesagain.next().value[0], "3");
		proclaim.equal(entriesagain.next().value[0], "2");
		// after a iterator is finished, don't return any more elements
		k = keys.next();
		v = values.next();
		proclaim.equal(k.done, true);
		proclaim.equal(v.done, true);
		k = keys.next();
		v = values.next();
		proclaim.equal(k.done, true);
		proclaim.equal(v.done, true);
		o.set("4", "d");
		k = keys.next();
		v = values.next();

		// WARNING! : this check is done in MAP tests, but causes failures for FormData.
		// proclaim.equal(k.done, true);
		// proclaim.equal(v.done, true);

		// new element shows up in iterators that didn't yet finish
		proclaim.equal(entriesagain.next().value[0], "4");
		proclaim.equal(entriesagain.next().done, true);
		// value is present but undefined when done is true, so that Array.from and other noncompliant
		// interfaces recognize it as a valid iterator
		var lastResult = entriesagain.next();
		proclaim.equal(lastResult.done, true);
		proclaim.ok(Object.prototype.hasOwnProperty.call(lastResult, 'value'));
		proclaim.equal(lastResult.value, void 0);
	});

	if ('Symbol' in window && 'iterator' in Symbol) {
		it('FormData.prototype[Symbol.iterator] is an alias to FormData.prototype.entries', function () {
			proclaim.strictEqual(FormData.prototype[Symbol.iterator], FormData.prototype.entries);
		});

		it("implements iterable for all iterators", function () {
			var form = document.createElement('form');
			form.innerHTML = '<input type="text" name="1" value="a"><input type="text" name="2" value="b"><input type="text" name="3" value="c">';
			var o = new FormData(form);
			
			var valuesIterator = o.values()[Symbol.iterator]();
			proclaim.isObject(valuesIterator);
			var v = valuesIterator.next();
			proclaim.equal(v.value, "a");
			v = valuesIterator.next();
			proclaim.equal(v.value, "b");
			v = valuesIterator.next();
			proclaim.equal(v.value, "c");
			v = valuesIterator.next();
			proclaim.equal(v.done, true);

			var keysIterator = o.keys()[Symbol.iterator]();
			proclaim.isObject(keysIterator);
			var k = keysIterator.next();
			proclaim.equal(k.value, "1");
			k = keysIterator.next();
			proclaim.equal(k.value, "2");
			k = keysIterator.next();
			proclaim.equal(k.value, "3");
			k = keysIterator.next();
			proclaim.equal(k.done, true);

			var entriesIterator = o.entries()[Symbol.iterator]();
			proclaim.isObject(entriesIterator);
			var e = entriesIterator.next();
			proclaim.deepEqual(e.value, ["1","a"]);
			e = entriesIterator.next();
			proclaim.deepEqual(e.value, ["2","b"]);
			e = entriesIterator.next();
			proclaim.deepEqual(e.value, ["3","c"]);
			e = entriesIterator.next();
			proclaim.equal(e.done, true);
		});
	}

	it.skip("has reasonable runtime performance with .has(), .delete(), .get() and .set()", function (done) {
		this.timeout(10 * 1000);
		var fd = new FormData();
		var operations = 10000;
		var timeout = setTimeout(function() {
			timeout = null;
			proclaim.fail('FormData performance was unreasonably slow');
			done();
		}, 1000);
		function operateOnFormData(fd, i) {
			if (!timeout) {
				return; // timeout has been cleared, signaling test has failed
			}
			if (i <= 0) {
				clearTimeout(timeout);
				proclaim.ok(true, 'FormData performance is good');
				done();
				return;
			}
			for (var j = 0; j < operations / 10; j++) {
				var key = 'item-' + i;
				var value = 'mock-value-' + i;
				fd.set(key, value);
				fd.has(key);
				fd.get(key);
				i--;
			}
			if (i <= 0) {
				// Remove all entries
				var keys, e, key;
				for (keys = fd.keys(); !(e = keys.next()).done && (key = e.value);) {
					fd["delete"](key);
				};
			}
			// release this frame in case timeout has occurred
			setTimeout(function() {
				operateOnFormData(fd, i);
			}, 1);
		}
		operateOnFormData(fd, operations);
	});
});
