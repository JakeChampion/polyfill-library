'sup' in String.prototype && (function() {
    var test = ''.sup('"');
    return test == test.toLowerCase() && test.split('"').length <= 3;
}())