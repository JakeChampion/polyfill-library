'fixed' in String.prototype && (function() {
	var test = ''.fixed('"');
	return test == test.toLowerCase() && test.split('"').length <= 3;
}())
