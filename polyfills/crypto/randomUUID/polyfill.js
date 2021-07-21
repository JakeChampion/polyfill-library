(function (global) {
	if ('crypto' in global && 'getRandomValues' in global.crypto && 'Uint8Array' in global) {
		// getRandomValues is fast and produces good UUID's
		global.crypto.randomUUID = function randomUUID() {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
				return (c ^ global.crypto.getRandomValues(new global.Uint8Array(1))[0] & 15 >> c / 4).toString(16);
			});
		};

		return;
	}

	if (!('crypto' in global)) {
		global.crypto = {};
	}

	var _url = global.URL || global.webkitURL;
	if (typeof _url !== 'undefined' && ('createObjectURL' in _url) && ('Blob' in global) && (function () {
		try {
			_url.createObjectURL(new global.Blob('', { type: 'text/plain' }));
			return true;
		} catch (_) {
			return false;
		}
	}())) {
		// createObjectURL is slower but produces good UUID's (mainly IE 10)
		global.crypto.randomUUID = function randomUUID() {
			var objURL = _url.createObjectURL(new global.Blob('', { type: 'text/plain' }));
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

		return
	}

	// Math.random produces poor UUID's but is only needed for IE 8,9 and some other very old browsers.
	global.crypto.randomUUID = function randomUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0;
			var v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
}(self));
