if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
	// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
	self.Document = self.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
	self.Document.prototype = document;
}
