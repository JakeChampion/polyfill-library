(function() {
	try {
		if ("WeakMap" in self && self.WeakMap.length === 0) {
			var o = {};
			var wm = new self.WeakMap([[o, 'test']]);
			return (wm.get(o) === 'test' && wm.delete(0) === false);
		} else {
			return false;
		}
	} catch (err) {
		return false;
	}
}())
