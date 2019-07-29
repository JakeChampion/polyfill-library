'sub' in String.prototype && (function() {
    var test = ''.sub('"');
    return test == test.toLowerCase() && test.split('"').length <= 3;
}())