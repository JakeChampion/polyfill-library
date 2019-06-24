'Map' in this && (function(self) {
	try {
		var m = new Map([[1, 1], [2, 2]]);
		if (Map.length === 0) {
			if (m.size === 2) {
				if ('Symbol' in self && 'iterator' in Symbol && typeof m[Symbol.iterator] === 'function') {
					return true;
				}
			}
		}
		return false;
	} catch (e) {
		return false;
	}
}(this))
