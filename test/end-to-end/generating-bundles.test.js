
'use strict';

const assert = require('proclaim');
const polyfillLibrary = require('../..');

describe("polyfill-library", function () {
	this.timeout(30000);

	it('should produce same output for same bundle', async () => {
		const bundle1 = await polyfillLibrary.getPolyfillString({
			features: {
				all: {}
			},
			uaString: 'other/0.0.0',
			unknown: 'polyfill'
		});

		const bundle2 = await polyfillLibrary.getPolyfillString({
			features: {
				all: {}
			},
			uaString: 'other/0.0.0',
			unknown: 'polyfill'
		});

		assert.deepStrictEqual(bundle1, bundle2);
	});
});
