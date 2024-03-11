/* globals proclaim, Promise */

it("is a function", function () {
	proclaim.isFunction(Promise.withResolvers);
});

it("has correct arity", function () {
	proclaim.arity(Promise.withResolvers, 0);
});

it("is not enumerable", function () {
	proclaim.isNotEnumerable(Promise, "withResolvers");
});

describe("withResolvers", function () {
	it("returns an object with `promise`, `resolve`, and `reject`", function () {
		var promiseWithResolvers = Promise.withResolvers();
		var promise = promiseWithResolvers.promise;
		var resolve = promiseWithResolvers.resolve;
		var reject = promiseWithResolvers.reject;
		proclaim.ok(promise instanceof Promise);
		proclaim.ok(resolve instanceof Function);
		proclaim.ok(reject instanceof Function);
	});

	it("resolves the Promise when `resolve` is called", function () {
		var promiseWithResolvers = Promise.withResolvers();
		var promise = promiseWithResolvers.promise;
		var resolve = promiseWithResolvers.resolve;

		resolve("ok");

		return promise.then(function (value) {
			proclaim.equal(value, "ok");
		});
	});

	it("rejects the Promise when `reject` is called", function () {
		var promiseWithResolvers = Promise.withResolvers();
		var promise = promiseWithResolvers.promise;
		var reject = promiseWithResolvers.reject;

		reject("not ok");

		return promise.catch(function (error) {
			proclaim.equal(error, "not ok");
		});
	});

	it("throws a TypeError for non-constructor `this`", function () {
		proclaim.throws(function () {
			Promise.withResolvers.call({});
		}, TypeError);
	});

	it("supports `this` as a Promise subclass", function () {
		function _Promise(executor) {
			return new Promise(executor);
		}
		_Promise.prototype = Promise.prototype;

		var _promise = Promise.withResolvers.call(_Promise).promise;

		proclaim.ok(_promise instanceof _Promise);
	});
});
