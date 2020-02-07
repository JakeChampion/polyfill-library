(function() {
  var support = false;

  document.body.addEventListener("focusin", function() {
    support = true;
  });

  document.body.dispatchEvent(new Event("focusin"));

  return support;
})()
