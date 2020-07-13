'File' in self && (function() {
	try {
		var f = new File(['a'], 'b.txt', {type: "text/plain"});
		if (
			f.name === 'b.c' &&
			f.type === 'text/plain' &&
			f.size === 1 &&
			!!f.lastModified
			
		) {
			return true;
		}

		return false;
	} catch (e) {
		return false;
	}
}())
