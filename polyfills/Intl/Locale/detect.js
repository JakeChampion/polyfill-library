"Intl" in self &&
	"Locale" in self.Intl &&
	!(
		/**
		 * https://bugs.chromium.org/p/v8/issues/detail?id=10682
		 */
		(function hasIntlGetCanonicalLocalesBug() {
			try {
				return new self.Intl.Locale("und-x-private").toString() === "x-private";
			} catch (e) {
				return true;
			}
		})()
	);
