'italics' in String.prototype && (function() {
    var test = ''.italics('"');
    return test == test.toLowerCase() && test.split('"').length <= 3;
}())