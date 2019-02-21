/* eslint-env mocha */
/* globals proclaim, Symbol */

it('is defined', function () {
	proclaim.include(Symbol.prototype, 'description');
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(Symbol.prototype, 'description');
});

it('is configurable', function () {
    if (Object.getOwnPropertyDescriptor) {
        proclaim.isTrue(Object.getOwnPropertyDescriptor(Symbol.prototype, 'description').configurable);
    }
});

it('works with numbers', function () {
    proclaim.strictEqual(Symbol(1).description, "1");
});

it('works with booleans', function () {
    proclaim.strictEqual(Symbol(true).description, "true");
});

it('works with null', function () {
    proclaim.strictEqual(Symbol(null).description, "null");
});

it('works with undefined', function () {
    proclaim.strictEqual(Symbol(undefined).description, undefined);
});

it('works with arrays', function () {
    proclaim.strictEqual(Symbol([]).description, "");
});

it('works with objects', function () {
    proclaim.strictEqual(Symbol({}).description, "[object Object]");
});

it('works with regexes', function () {
    proclaim.strictEqual(Symbol(/./).description, "/./");
});

it('works with NaNs', function () {
    proclaim.strictEqual(Symbol(NaN).description, "NaN");
});

it('works with functions', function () {
    proclaim.strictEqual(Symbol(function(){}).description, String(function(){}));
});

it('works with no input', function () {
    proclaim.strictEqual(Symbol().description, undefined);
});

it('works with an empty string', function () {
    proclaim.strictEqual(Symbol("").description, "");
});

// non symbols

if (Object.getOwnPropertyDescriptor) {
    var getter = Object.getOwnPropertyDescriptor(Symbol.prototype, 'description').get;

    it('does not throw an error if context is a symbol', function () {
        proclaim.doesNotThrow(function() {
            getter.call(Symbol());
        });
    });

    it('throws an error if context is a number', function () {
        proclaim.throws(function() {
            getter.call(1)
        }, TypeError);
    });
    
    it('throws an error if context is null', function () {
        proclaim.throws(function() {
            getter.call(null)
        }, TypeError);
    });
    
    it('throws an error if context is undefined', function () {
        proclaim.throws(function() {
            getter.call(undefined)
        }, TypeError);
    });
    
    it('throws an error if context is an array', function () {
        proclaim.throws(function() {
            getter.call([])
        }, TypeError);
    });
    
    it('throws an error if context is an object', function () {
        proclaim.throws(function() {
            getter.call({})
        }, TypeError);
    });
    
    it('throws an error if context is a regex', function () {
        proclaim.throws(function() {
            getter.call(/./)
        }, TypeError);
    });
    
    it('throws an error if context is NaN', function () {
        proclaim.throws(function() {
            getter.call(NaN)
        }, TypeError);
    });
    
    it('throws an error if context is a function', function () {
        proclaim.throws(function() {
            getter.call(function(){})
        }, TypeError);
    });

    it('throws an error if context is a string', function () {
        proclaim.throws(function() {
            getter.call('kate')
        }, TypeError);
    });
};