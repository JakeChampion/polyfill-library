'strike' in String.prototype && (function() {
    var test = ''.strike('"');
    return test == test.toLowerCase() && test.split('"').length <= 3;
}())