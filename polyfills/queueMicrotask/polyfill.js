(function () {
	let promise = new Promise((resolve, reject) => {resolve()});
	function queueMicrotask(microtask) {
		promise = promise.then(()=> {
			try {
				microtask();
			} catch(error) {
				console.log('error: ', error);
			}
		});
	}
}())
