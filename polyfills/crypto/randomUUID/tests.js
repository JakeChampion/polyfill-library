/* globals proclaim */

describe('crypto.randomUUID', function () {
	it('has a correct length', function () {
		proclaim.equal(crypto.randomUUID().length, 36);
	});

	it('returns a string', function () {
		proclaim.equal(typeof crypto.randomUUID(), "string");
	});

	it('passes a UUID regexp test', function () {
		// This regexp seems more strict than the one from WPT.
		// Testing both seems safest.
		proclaim.ok(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/.test(crypto.randomUUID()));
	});

	// WPT
	// Run for enough iterations that we're likely to catch edge-cases, like
	// failing to set a reserved bit:
	var iterations = 256;
	// Track all the UUIDs generated during test run, bail if we ever collide:
	var uuids = [];
	function randomUUID() {
			var uuid = crypto.randomUUID();
			if (uuids.indexOf(uuid) !== -1) {
					throw new Error('uuid collision ' +  uuid)
			}
			uuids.push(uuid);
			return uuid;
	}

	// UUID is in namespace format (16 bytes separated by dashes):
	it("has the correct namespace format", function () {
			// Added start and end tokens to the regexp. WPT version doesn't have these
			var UUIDRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
			for (var i = 0; i < iterations; i++) {
					proclaim.ok(UUIDRegex.test(randomUUID()));
			}
	});

	// Set the 4 most significant bits of array[6], which represent the UUID
	// version, to 0b0100:
	it("sets the correct version", function() {
			for (var i = 0; i < iterations; i++) {
					var value = parseInt(randomUUID().split('-')[2].slice(0, 2), 16);
					value = value & 240;
					proclaim.ok(value === 64);
			}
	});

	// Set the 2 most significant bits of array[8], which represent the UUID
	// variant, to 0b10:
	it("sets the correct variant", function() {
			for (var i = 0; i < iterations; i++) {
					// Grab the byte representing array[8]:
					var value = parseInt(randomUUID().split('-')[3].slice(0, 2), 16);
					value = value & 192
					proclaim.ok(value === 128);
			}
	});
});
