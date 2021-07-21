/* globals proclaim */

describe('crypto.randomUUID', function () {
	it('has a correct length', function () {
		proclaim.equal(crypto.randomUUID().length, 36);
	});

	it('returns a string', function () {
		proclaim.equal(typeof crypto.randomUUID(), "string");
	});

	it('passes a UUID regexp test', function () {
		proclaim.ok(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/.test(crypto.randomUUID()));
	});
});
