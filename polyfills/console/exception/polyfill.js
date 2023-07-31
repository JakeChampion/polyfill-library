console.exception = function exception() {
  if ("error" in console) {
    console.error.apply(this, arguments);
  }
};
