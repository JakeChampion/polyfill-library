/**
 * Adapted from Web Platform Tests
 * HTMLFormElement.prototype.requestSubmit()
 * @link https://github.com/web-platform-tests/wpt/blob/master/html/semantics/forms/the-form-element/form-requestsubmit.html
 * Retrieved: 4 Nov 2022
 *
 * # The 3-Clause BSD License
 *
 * Copyright © web-platform-tests contributors
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* eslint-env mocha, browser */
// eslint-disable-next-line no-unused-vars
/* globals proclaim */
describe("HTMLFormElement.prototype.requestSubmit", function () {
	// Add <iframe> to DOM for use by several tests
	this.beforeAll(function () {
		document.body.insertAdjacentHTML(
			"afterbegin",
			"<div id=\"test-container\"></div>"
		);

		document.body.insertAdjacentHTML(
			"afterbegin",
			'<iframe name="iframe" src="about:blank"></iframe>'
		);
	});

	this.beforeEach(function () {
		document.getElementById("test-container").innerHTML = "";
	});

	it("Passing an element which is not a submit button should throw", function () {
		document.getElementById("test-container").insertAdjacentHTML(
			"afterbegin",
			'<form><input type="reset"><input type="text"><button type="reset"></button><button type="button"></button></form>'
		);
		var form = document.querySelector("form");
		proclaim.throws(function () {
			form.requestSubmit(document.body);
		});
		// These inputs/buttons are not type="submit", so they should throw when used as submitter
		for (var index = 0; index < form.elements.length; index++) {
			var control = form.elements[index];
			proclaim.throws(function () {
				form.requestSubmit(control);
			});
		}
	});

	it("Passing a submit button not owned by the context object should throw", function () {
		document.getElementById("test-container").insertAdjacentHTML(
			"afterbegin",
			'<form><input form="" type="submit"><button form="form2" type="submit"></button></form><form id="form2"></form>'
		);
		var form = document.querySelector("form");
		var submitButton = document.createElement("button");
		submitButton.type = "submit";
		proclaim.throws(function () {
			form.requestSubmit(submitButton);
		});

		var buttons = form.querySelectorAll("input, button");
		proclaim.strictEqual(buttons.length, 2);
		for (var index = 0; index < buttons.length; index++) {
			var control = buttons[index];
			proclaim.throws(function () {
				form.requestSubmit(control);
			});
		}
	});

	it("requestSubmit() should accept button[type=submit], input[type=submit], and input[type=image]", function () {
		document.getElementById("test-container").insertAdjacentHTML(
			"afterbegin",
			'<input type=submit form="form1"><form id="form1" target="_blank"><button type="submit"></button><button></button><button type="invalid"></button><input type="submit"><input type="image"></form>'
		);
		var form = document.querySelector("form");
		var didDispatchSubmit = false;
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			didDispatchSubmit = true;
		});

		// Assert that button[type=submit] & input[type=submit] can submit the form
		proclaim.strictEqual(form.elements.length, 5);
		for (var index = 0; index < form.elements.length; index++) {
			var control = form.elements[index];
			didDispatchSubmit = false;
			form.requestSubmit(control);
			proclaim.isTrue(didDispatchSubmit);
		}
		// Assert that input[type=image] can submit the form
		var imageInput = form.querySelector("[type=image]");
		didDispatchSubmit = false;
		form.requestSubmit(imageInput);
		proclaim.isTrue(didDispatchSubmit);
	});

	it("requestSubmit() should trigger interactive form validation", function () {
		document.getElementById("test-container").insertAdjacentHTML(
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
		document.getElementById("test-container").insertAdjacentHTML(
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
		proclaim.strictEqual(submitCounter, 1);

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
		proclaim.strictEqual(submitCounter, 1);

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
		proclaim.strictEqual(submitCounter, 1);
	});

	it("requestSubmit() doesn't run interactive validation reentrantly", function () {
		document.getElementById("test-container").insertAdjacentHTML(
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
		proclaim.strictEqual(invalidCounter, 1);

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
		proclaim.strictEqual(invalidCounter, 1);

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
		proclaim.strictEqual(invalidCounter, 1);
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
		document.getElementById("test-container").insertAdjacentHTML(
			"afterbegin",
			'<form action="/common/blank.html"><input required><input type=submit formnovalidate formtarget=iframe name=s value=v></form>'
		);
		var form = document.body.querySelector("form");
		var iframe = document.body.querySelector("iframe");
		// There should be one :invalid input within the form
		proclaim.strictEqual(form.querySelectorAll(":invalid").length, 1);
		// The form should be submitted though it is invalid. Use <iframe> to accept the POST, and examine the submission there.
		iframe.addEventListener("load", function () {
			var formUrlencodedSubmission = iframe.contentWindow.location.search;
			proclaim.isTrue(new RegExp("s=v").test(formUrlencodedSubmission));
			done();
		});
		form.requestSubmit(form.querySelector("[type=submit]"));
	});

	it("Using requestSubmit on a disabled button (via disabled attribute) should trigger submit", function (done) {
		document.getElementById("test-container").insertAdjacentHTML(
			"afterbegin",
			'<form><button type="submit" name="n1" value="v1" disabled=""></button></form>'
		);
		var form = document.querySelector("form");
		var submitter = form.querySelector("button[type=submit]");

		form.addEventListener("submit", function (ev) {
			ev.preventDefault();
			proclaim.strictEqual(ev.target, form);
			done();
		});

		form.requestSubmit(submitter);
	});

	it("[Optional: Only applies if browser supports FormData] The constructed FormData object should not contain an entry for the submit button that was used to submit the form.", function () {
		// If the browser does support FormData, skip this test because it is only about
		// the behavior of the constructed FormData.
		if (typeof window.FormData !== "function") {
			this.skip();
		}
		document.getElementById("test-container").insertAdjacentHTML(
			"afterbegin",
			'<form><input name="n1" value="v1"><button type="submit" name="n2" value="v2"></button></form><form id="form2"></form>'
		);
		var form = document.querySelector("form");
		var formDataInEvent = null;
		var submitter = form.querySelector("button[type=submit]");

		form.addEventListener("submit", function (e) {
			e.preventDefault();
			// This FormData constructor doesn't know how the form was submitted,
			// so the submitter is not present in this FormData, even though it
			// would be present in POST submissions. Only the normally-included data is here.
			formDataInEvent = new FormData(e.target);
		});

		form.requestSubmit(submitter);
		proclaim.strictEqual(formDataInEvent.get("n1"), "v1");
		proclaim.isFalse(formDataInEvent.has("n2"));
	});

	it("[Optional: Only applies if browser supports FormData] Using requestSubmit on a disabled button (via disabled attribute) should not be visible in constructed FormData", function (done) {
		// If the browser does support FormData, skip this test because
		// it is only about the behavior of the constructed FormData.
		if (typeof window.FormData !== "function") {
			this.skip();
		}
		document.getElementById("test-container").insertAdjacentHTML(
			"afterbegin",
			'<form><button type="submit" name="n1" value="v1" disabled=""></button></form>'
		);
		var form = document.querySelector("form");
		var formDataInEvent = null;
		var submitter = form.querySelector("button[type=submit]");

		form.addEventListener("submit", function (ev) {
			ev.preventDefault();
			formDataInEvent = new FormData(ev.target);
			proclaim.strictEqual(ev.target, form);
			proclaim.isFalse(formDataInEvent.has("n1"));
			done();
		});

		form.requestSubmit(submitter);
	});
});
