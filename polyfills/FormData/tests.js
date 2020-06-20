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