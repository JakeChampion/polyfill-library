/* eslint-env mocha */
/* globals proclaim */

it('is a function', function () {
    proclaim.isFunction(Array.prototype.flatMap);
});

it('has correct arity', function () {
    proclaim.arity(Array.prototype.flatMap, 1);
});

it('has correct name', function () {
    proclaim.hasName(Array.prototype.flatMap, 'flatMap');
});

it('is not enumerable', function () {
    proclaim.isNotEnumerable(Array.prototype, 'flatMap');
});

describe('callback', function () {
    it('has correct argument length', function () {
        [0].flatMap(function () {
            proclaim.equal(arguments.length, 3);
        });
    });
});

describe('applies callback correctly with', function () {
    it('arrays', function () {
        proclaim.equal([4, 5, 7, 12].flatMap(function (v) {
            return v % 2 === 0 ? [v] : [];
        }), [4, 12]);
    });
});
