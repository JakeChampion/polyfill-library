'big' in String.prototype && (function() {
	var test = ''.big('"');
	return test == test.toLowerCase() && test.split('"').length <= 3;
}())
