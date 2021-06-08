'link' in String.prototype && (function() {
	var test = ''.link('"');
	return test == test.toLowerCase() && test.split('"').length <= 3;
}())
