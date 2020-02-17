(function (global) {
	var promise = global.Promise.resolve();
	global.queueMicrotask = function queueMicrotask(microtask) {
		if (arguments.length > 1) {
			throw new TypeError("Window.queueMicrotask requires at least 1 argument, but only 0 were passed");
		}

		if (typeof(microtask) != 'function'){
			throw new TypeError('Argument 1 of Window.queueMicrotask is not callable.');
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
