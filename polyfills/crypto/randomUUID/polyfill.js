(function (global) {
	// getRandomValues is fast and produces good UUID's
	if ('crypto' in global && 'getRandomValues' in global.crypto && 'Uint8Array' in global) {
		global.crypto.randomUUID = function randomUUID() {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
				return (c ^ global.crypto.getRandomValues(new global.Uint8Array(1))[0] & 15 >> c / 4).toString(16);
			});
		};

		return;
	}

	// createObjectURL is slower but produces good UUID's (mainly IE 10 as it doesn't require the Blob polyfill but lacks crypto)
	if (!('crypto' in global)) {
		global.crypto = {};
	}

	var _url = global.URL || global.webkitURL;
	if (typeof _url !== 'undefined' && ('createObjectURL' in _url) && ('Blob' in global) && (function () {
		try {
			var _objectURL = _url.createObjectURL(new global.Blob([''], { type: 'text/plain' }));
			if (_objectURL.indexOf('blob:') === -1) {
				// Blob polyfill doesn't produce UUID's.
				return false
			}
			return true;
		} catch (_) {
			return false;
		}
	}())) {
		global.crypto.randomUUID = function randomUUID() {
			var objURL = _url.createObjectURL(new global.Blob([''], { type: 'text/plain' }));
			if ('revokeObjectURL' in _url) {
				_url.revokeObjectURL(objURL);
			}

			var objURLParts = objURL.split('/');
			var uuid = objURLParts[objURLParts.length - 1];
			if (uuid.indexOf('blob:') === 0) {
				uuid = uuid.slice(5);
			}

			return uuid.toLowerCase();
		};
	}

}(self));
