'FormData' in self && (function(self) {
	try {
		var formData = new self.FormData();
		// FormData as iterator is the newest feature.
		if ('Symbol' in self && 'iterator' in self.Symbol && typeof formData[self.Symbol.iterator] === 'function') {
			return true;
		}

		return false;
	} catch (e) {
		return false;
	}
}(self))
