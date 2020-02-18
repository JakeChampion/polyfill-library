'fontsize' in String.prototype && (function() {
    var test = ''.fontsize('"');
    return test == test.toLowerCase() && test.split('"').length <= 3;
}())