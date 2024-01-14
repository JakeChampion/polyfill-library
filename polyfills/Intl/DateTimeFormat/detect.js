"Intl" in self &&
	"DateTimeFormat" in self.Intl &&
	"formatToParts" in self.Intl.DateTimeFormat.prototype &&
	"formatRange" in Intl.DateTimeFormat.prototype &&
	!(function hasChromeLt71Bug() {
		try {
			return (
				new self.Intl.DateTimeFormat("en", {
					hourCycle: "h11",
					hour: "numeric"
				}).formatToParts(0)[2].type !== "dayPeriod"
			);
		} catch (e) {
			return false;
		}
	})() &&
	!(function hasUnthrownDateTimeStyleBug() {
		try {
			return !!new self.Intl.DateTimeFormat("en", {
				dateStyle: "short",
				hour: "numeric"
			}).format(new Date(0));
		} catch (e) {
			return false;
		}
	})() &&
	(function supportsDateStyle() {
		try {
			return !!new self.Intl.DateTimeFormat(undefined, {
				dateStyle: "short"
			}).resolvedOptions().dateStyle;
		} catch (e) {
			return false;
		}
	})();
