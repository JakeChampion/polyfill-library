"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
if (typeof Intl === 'undefined') {
    if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'Intl', {
            value: {},
        });
    }
    else if (typeof global !== 'undefined') {
        Object.defineProperty(global, 'Intl', {
            value: {},
        });
    }
}
if (!('getCanonicalLocales' in Intl) ||
    // Native Intl.getCanonicalLocales is just buggy
    // https://bugs.chromium.org/p/v8/issues/detail?id=10682
    Intl.getCanonicalLocales('und-x-private')[0] === 'x-private') {
    Object.defineProperty(Intl, 'getCanonicalLocales', {
        value: _1.getCanonicalLocales,
        writable: true,
        enumerable: false,
        configurable: true,
    });
}
