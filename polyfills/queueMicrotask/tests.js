/* eslint-env mocha, browser */
/* global proclaim */

describe('queueMicrotask', function () {
    it('is defined as a function on window', function () {
        proclaim.isTypeOf(window.queueMicrotask, 'function');
    });
});
