'blink' in String.prototype && (function() {
	var test = ''.blink('"');
	return test == test.toLowerCase() && test.split('"').length <= 3;
}())
