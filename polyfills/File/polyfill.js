
/* global CreateMethodProperty */
(function (global) {
	var supportsGetters = (function () {
		try {
			var a = {};
			Object.defineProperty(a, 't', {
				configurable: true,
				enumerable: false,
				get: function () {
					return true;
				},
				set: undefined
			});
			return !!a.t;
		} catch (e) {
			return false;
		}
	}());

	var _hasNativeFile = ('File' in global);

	var _hasNativeFileWithWorkingConstructor = (function () {
		try {
			_hasNativeFile && new File([], "");
			return true;
		} catch (e) {
			return false;
		}
	}());

	var NativeFile = global.File;
	var _nativeFileProto = _hasNativeFile ? NativeFile.prototype : null;

	// File ()
	// https://w3c.github.io/FileAPI/#file-section
	var FilePolyfill = function FilePolyfill(fileBits, fileName, options) {
		// 1. If NewTarget is undefined, throw a TypeError exception.
		if (!(this instanceof File)) {
			throw new TypeError('Failed to construct \'File\': Please use the \'new\' operator, this DOM object constructor cannot be called as a function.');
		}

		if (arguments.length < 2) {
			throw new TypeError('Failed to construct \'File\': 2 arguments required, but only ' + arguments.length + ' present.');
		}

		// 4.1.1 https://w3c.github.io/FileAPI/#file-constructor
		// Let bytes be the result of processing blob parts given fileBits and options.
		// This is handled by using either NativeFile or Blob.
		// Not our concern here.

		// 4.1.2 https://w3c.github.io/FileAPI/#file-constructor
		// Let n be a new string of the same size as the fileName argument to the constructor. Copy every character from fileName to n, replacing any "/" character (U+002F SOLIDUS) with a ":" (U+003A COLON).
		var n = fileName.toString().replace(/\//g, ':');

		var file;
		if (_hasNativeFileWithWorkingConstructor) {
			var file = new NativeFile(fileBits, n, options);
		} else {
			var file = new Blob(fileBits, options);
		}

		// 4.1.2 continues
		if (!('name' in file)) {
			if (supportsGetters) {
				this._name = n;
			} else {
				Object.defineProperty(file, 'name', {
					configurable: true,
					enumerable: false,
					writable: true,
					value: n,
				});
			}
		}

		// 4.1.3.3 https://w3c.github.io/FileAPI/#file-constructor
		// If the lastModified member is provided,
		// let d be set to the lastModified dictionary member.
		// If it is not provided, set d to the current date and time represented as the number of milliseconds since the Unix Epoch (which is the equivalent of Date.now()[ECMA - 262]).
		if (!('lastModified' in file)) {
			var lastModified;
			if (options && options.lastModified) {
				lastModified = options.lastModified;
			} else {
				lastModified = (new Date()).valueOf();
			}

			if (supportsGetters) {
				this._lastModified = lastModified;
			} else {
				Object.defineProperty(file, 'lastModified', {
					configurable: true,
					enumerable: false,
					writable: true,
					value: lastModified
				});
			}
		}

		return file;
	};

	if (_hasNativeFile) {
		FilePolyfill.prototype = Object.create(Blob.prototype);
	} else {
		FilePolyfill.prototype = Object.create(_nativeFileProto);
	}

	// Export the object
	try {
		CreateMethodProperty(global, 'File', FilePolyfill);
	} catch (e) {
		// IE8 throws an error here if we set enumerable to false.
		// More info on table 2: https://msdn.microsoft.com/en-us/library/dd229916(v=vs.85).aspx
		global.File = FilePolyfill;
	}

	CreateMethodProperty(global.File.prototype, 'constructor', FilePolyfill);

	if (supportsGetters) {
		if (!('lastModified' in global.File.prototype)) {
			Object.defineProperty(global.File.prototype, 'lastModified', {
				configurable: true,
				enumerable: false,
				get: function () {
					return this._lastModified;
				},
				set: undefined
			});
		}

		if (!('name' in global.File.prototype)) {
			Object.defineProperty(global.File.prototype, 'name', {
				configurable: true,
				enumerable: false,
				get: function () {
					return this._name;
				},
				set: undefined
			});
		}
	}

	try {
		Object.defineProperty(global.File, 'name', {
			configurable: true,
			enumerable: false,
			writable: false,
			value: 'File'
		});
	} catch (e) {
		// noop
	}
}(self));
