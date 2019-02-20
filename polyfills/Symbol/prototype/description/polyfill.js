Object.defineProperty(Symbol.prototype, 'description', {
    configurable: true,
    enumerable: false,
    get: function () {
        var string = this.toString()
        var check = Symbol.toString().slice(20, Symbol.toString().length - 2)
        var native = "[native code]"
        if (check !== native) {
            return string.slice('__\u0001symbol:'.length, 19)
        } else {
            return string.slice(7, string.length - 1)
        }
    }
});