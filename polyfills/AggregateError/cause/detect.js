(function () {
	try {
		return ('AggregateError' in self) && new self.AggregateError([], 'm', { cause: 'c' }).cause === 'c';
	} catch (e) {
		return false;
	}
})()
