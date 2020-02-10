(function (global) {
	var promise = new Promise(function(resolve, reject){resolve()});
	global.queueMicrotask = function queueMicrotask(microtask) {
		promise = promise.then(function(){
			try {
				microtask();
			} catch(error) {
				console.log('error: ', error);
			}
		});
	};
}(this))
