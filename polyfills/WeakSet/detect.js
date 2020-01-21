(function(global) {
	try {
		if (Object.prototype.hasOwnProperty.call(global, "WeakSet") && global.WeakSet.length === 0) {
			var o = {};
			var ws = new global.WeakSet([o]);
			return (ws.has(o) && ws["delete"](0) === false);
		} else {
			return false;
		}
	} catch (err) {
		return false;
	}
}(this))
