'fontcolor' in String.prototype && (function() {
    var test = ''.fontcolor('"');
    return test == test.toLowerCase() && test.split('"').length <= 3;
}())