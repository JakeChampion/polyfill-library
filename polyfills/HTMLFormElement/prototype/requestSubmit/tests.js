/* eslint-env mocha, browser */
// eslint-disable-next-line no-unused-vars
/* globals proclaim */

/**
 * Adapted from Web Platform Tests
 * HTMLFormElement.prototype.requestSubmit()
 * https://github.com/web-platform-tests/wpt/blob/master/html/semantics/forms/the-form-element/form-requestsubmit.html
 * Retrieved: 4 Nov 2022
 */

describe("HTMLFormElement.prototype.requestSubmit", function () {
	it("Passing an element which is not a submit button should throw", function () {
		document.body.insertAdjacentHTML(
			"afterbegin",
			'<form><input type="reset"><input type="text"><button type="reset"></button><button type="button"></button></form>'
		);
		var form = document.querySelector("form");
		proclaim.throws(function () {
			form.requestSubmit(document.body);
		}, TypeError);
		// These inputs/buttons are not type="submit", so they should throw when used as submitter
		for (var index = 0; index < form.elements.length; index++) {
			var control = form.elements[index];
			proclaim.throws(function () {
				form.requestSubmit(control);
			}, TypeError);
		}
	});

	it("Passing a submit button not owned by the context object should throw", function () {
		document.body.insertAdjacentHTML(
			"afterbegin",
			'<form><input form="" type="submit"><button form="form2" type="submit"></button></form><form id="form2"></form>'
		);
		var form = document.querySelector("form");
		var submitButton = document.createElement("button");
		submitButton.type = "submit";
		proclaim.throws(
			function () {
				form.requestSubmit(submitButton);
			},
			function (domException) {
				return domException.name === "NotFoundError";
			}
		);

		var buttons = form.querySelectorAll("input, button");
		proclaim.strictEqual(buttons.length, 2);
		for (var index = 0; index < buttons.length; index++) {
			var control = buttons[index];
			proclaim.throws(
				function () {
					form.requestSubmit(control);
				},
				function (domException) {
					return domException.name === "NotFoundError";
				},
				control.outerHTML // Description: the not-owned Element being tested
			);
		}
	});

	it("requestSubmit() should accept button[type=submit], input[type=submit], and input[type=image]", function () {
		document.body.insertAdjacentHTML(
			"afterbegin",
			'<input type=submit form="form1"><form id="form1" target="_blank"><button type="submit"></button><button></button><button type="invalid"></button><input type="submit"><input type="image"></form>'
		);
		var form = document.querySelector("form");
		var didDispatchSubmit = false;
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			didDispatchSubmit = true;
		});

		proclaim.strictEqual(form.elements.length, 5);
		for (var index = 0; index < form.elements.length; index++) {
			var control = form.elements[index];
			didDispatchSubmit = false;
			form.requestSubmit(control);
			proclaim.isTrue(
				didDispatchSubmit,
				control.outerHTML + "should submit the form"
			);
		}
		// <input type=image> is not in form.elements.
		var imageInput = form.querySelector("[type=image]");
		didDispatchSubmit = false;
		form.requestSubmit(control);
		proclaim.isTrue(
			didDispatchSubmit,
			imageInput.outerHTML + "should submit the form"
		);
	});

	it("requestSubmit() should trigger interactive form validation", function () {
		document.body.insertAdjacentHTML(
			"afterbegin",
			"<form><input required></form>"
		);
		var form = document.querySelector("form");
		var invalidControl = form.querySelector("input:invalid");
		var didDispatchInvalid = false;
		invalidControl.addEventListener("invalid", function () {
			didDispatchInvalid = true;
		});

		form.requestSubmit();
		proclaim.isTrue(didDispatchInvalid);
	});

	it("requestSubmit() doesn't run form submission reentrantly", function () {
		document.body.insertAdjacentHTML(
			"afterbegin",
			"<form><input type=submit></form>"
		);
		var form = document.querySelector("form");
		var submitButton = form.elements[0];
		var submitCounter = 0;
		form.addEventListener(
			"submit",
			function (e) {
				++submitCounter;
				form.requestSubmit();
				e.preventDefault();
			},
			{ once: true }
		);
		form.requestSubmit();
		proclaim.strictEqual(submitCounter, 1, "requestSubmit() + requestSubmit()");

		submitCounter = 0;
		form.addEventListener(
			"submit",
			function (e) {
				++submitCounter;
				submitButton.click();
				e.preventDefault();
			},
			{ once: true }
		);
		form.requestSubmit();
		proclaim.strictEqual(submitCounter, 1, "requestSubmit() + click()");

		submitCounter = 0;
		form.addEventListener(
			"submit",
			function (e) {
				++submitCounter;
				form.requestSubmit();
				e.preventDefault();
			},
			{ once: true }
		);
		submitButton.click();
		proclaim.strictEqual(submitCounter, 1, "click() + requestSubmit()");
	});

	it("requestSubmit() doesn't run interactive validation reentrantly", function () {
		document.body.insertAdjacentHTML(
			"afterbegin",
			"<form><input type=submit><input required></form>"
		);
		var form = document.querySelector("form");
		var submitButton = form.elements[0];
		var invalidControl = form.elements[1];
		var invalidCounter = 0;
		invalidControl.addEventListener(
			"invalid",
			function () {
				++invalidCounter;
				if (invalidCounter < 10) form.requestSubmit();
			},
			{ once: true }
		);
		form.requestSubmit();
		proclaim.strictEqual(
			invalidCounter,
			1,
			"requestSubmit() + requestSubmit()"
		);

		invalidCounter = 0;
		invalidControl.addEventListener(
			"invalid",
			function () {
				++invalidCounter;
				if (invalidCounter < 10) submitButton.click();
			},
			{ once: true }
		);
		form.requestSubmit();
		proclaim.strictEqual(invalidCounter, 1, "requestSubmit() + click()");

		invalidCounter = 0;
		invalidControl.addEventListener(
			"invalid",
			function () {
				++invalidCounter;
				if (invalidCounter < 10) form.requestSubmit();
			},
			{ once: true }
		);
		submitButton.click();
		proclaim.strictEqual(invalidCounter, 1, "click() + requestSubmit()");
	});

	it("requestSubmit() for a disconnected form should not submit the form", function () {
		var form = document.createElement("form");
		var submitCounter = 0;
		form.addEventListener("submit", function (e) {
			++submitCounter;
			e.preventDefault();
		});
		form.requestSubmit();
		proclaim.strictEqual(submitCounter, 0);
	});

	it("The value of the submitter should be appended, and form* attributes of the submitter should be handled.", function (done) {
		document.body.insertAdjacentHTML(
			"afterbegin",
			'<iframe name="iframe" src="about:blank"></iframe>'
		);
		document.body.insertAdjacentHTML(
			"afterbegin",
			'<form action="/common/blank.html"><input required><input type=submit formnovalidate formtarget=iframe name=s value=v></form>'
		);
		var form = document.body.querySelector("form");
		var iframe = document.body.querySelector("iframe");
		proclaim.isTrue(form.matches(":invalid"), "The form is invalid.");
		// The form should be submitted though it is invalid.
		iframe.addEventListener("load", function (event) {
			var iframeFormSubmissionUrl = new URLSearchParams(
				event.currentTarget.contentWindow.location.search
			);
			proclaim.isTrue(iframeFormSubmissionUrl.has("s"));
			proclaim.strictEqual(iframeFormSubmissionUrl.get("s"), "v");
			done();
		});
		form.requestSubmit(form.querySelector("[type=submit]"));
	});

	it("The constructed FormData object should not contain an entry for the submit button that was used to submit the form.", function () {
		document.body.insertAdjacentHTML(
			"afterbegin",
			'<form><input name="n1" value="v1"><button type="submit" name="n2" value="v2"></button></form><form id="form2"></form>'
		);
		var form = document.querySelector("form");
		var formDataInEvent = null;
		var submitter = form.querySelector("button[type=submit]");
		form.addEventListener("submit", function (e) {
			e.preventDefault();
			formDataInEvent = new FormData(e.target);
		});

		form.requestSubmit(submitter);
		proclaim.strictEqual(formDataInEvent.get("n1"), "v1");
		proclaim.isFalse(formDataInEvent.has("n2"));
	});

	it("Using requestSubmit on a disabled button (via disabled attribute) should trigger submit but not be visible in FormData", function (done) {
		document.body.insertAdjacentHTML(
			"afterbegin",
			'<form><button type="submit" name="n1" value="v1" disabled=""></button></form>'
		);
		var form = document.querySelector("form");
		var formDataInEvent = null;
		var submitter = form.querySelector("button[type=submit]");

		form.addEventListener("submit", function (ev) {
			ev.preventDefault();
			formDataInEvent = new FormData(ev.target);
			proclaim.isFalse(formDataInEvent.has("n1"));
			proclaim.strictEqual(ev.target, form);
			done();
		});

		form.requestSubmit(submitter);
	});
});
