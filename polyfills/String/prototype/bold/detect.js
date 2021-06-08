'bold' in String.prototype && (function() {
	var test = ''.bold('"');
	return test == test.toLowerCase() && test.split('"').length <= 3;
}())
