(function() {
	var support = false;
	var parent = document.lastChild;
    var a = document.createElement('a');
	var addSupport = function () {
		support = true;
	};

	a.href = '#';

	a.addEventListener ? a.addEventListener('focusin', addSupport) : a.onfocusin = addSupport;

	parent.appendChild(a).focus();

	parent.removeChild(a);

	return support;
})()