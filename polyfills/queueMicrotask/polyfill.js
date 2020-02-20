/* global Promise */
self.queueMicrotask = function queueMicrotask(microtask) {
  if (arguments.length < 1) {
    throw new TypeError(
      "queueMicrotask requires at least 1 argument, but only 0 were passed"
    );
  }

  if (typeof microtask != "function") {
    throw new TypeError("Argument 1 of queueMicrotask is not callable.");
  }

  Promise.resolve()
    .then(function() {
      try {
        microtask();
      } catch (e) {
        self.dispatchEvent(
          new ErrorEvent("error", {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e,
            bubbles: true,
            cancelable: true,
            composed: false
          })
        );
        throw e;
      }
    })
    .catch(function() {});
};
