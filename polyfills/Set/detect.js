'Set' in this && (function() {
	try {
		var s = new self.Set([1, 2]);
		if (self.Set.length === 0) {
			if (s.size === 2) {
				if ('Symbol' in this && 'iterator' in self.Symbol && typeof s[self.Symbol.iterator] === 'function') {
					return true;
				}
			}
		}
		return false;
	} catch (e) {
		return false;
	}
}())
