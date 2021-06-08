'small' in String.prototype && (function() {
	var test = ''.small('"');
	return test == test.toLowerCase() && test.split('"').length <= 3;
}())
