"Intl" in self &&
	"getCanonicalLocales" in self.Intl &&
	// Native Intl.getCanonicalLocales is just buggy
	// https://bugs.chromium.org/p/v8/issues/detail?id=10682
	self.Intl.getCanonicalLocales("und-x-private")[0] !== "x-private";
