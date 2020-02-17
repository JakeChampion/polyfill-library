(function (global) {
	var promise = global.Promise.resolve();
	global.queueMicrotask = function queueMicrotask(microtask) {
		if (arguments.length > 1) {
			throw new TypeError();
		}

		if (typeof(microtask) != 'function'){
			throw new TypeError();
		}

		promise = promise.then(function(){
			try {
				microtask();
			} catch(error) {
				console.log('error: ', error);
			}
		});
	};
}(this))
