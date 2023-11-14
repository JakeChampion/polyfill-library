"Intl" in self &&
	"NumberFormat" in self.Intl &&
	(function supportsES2020() {
		try {
			const s = new self.Intl.NumberFormat("en", {
				style: "unit",
				unit: "bit",
				unitDisplay: "long",
				notation: "scientific"
			}).format(10000);

			// Check for a plurality bug in environment that uses the older versions of ICU:
			// https://unicode-org.atlassian.net/browse/ICU-13836
			if (s !== "1E4 bits") {
				return false;
			}
		} catch (e) {
			return false;
		}
		return true;
	})();
