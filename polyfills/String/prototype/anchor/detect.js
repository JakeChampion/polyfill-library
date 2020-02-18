'anchor' in String.prototype && (function() {
    var test = ''.anchor('"');
    return test == test.toLowerCase() && test.split('"').length <= 3;
}())