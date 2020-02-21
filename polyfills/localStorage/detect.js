'localStorage' in self && (function() {
	try {
		// Needed for Safari private browsing.
		self.localStorage.setItem('storage_test', 1);
		self.localStorage.removeItem('storage_test');
		return true;
	} catch (e) {
		return false;
	}
}).call(self)
