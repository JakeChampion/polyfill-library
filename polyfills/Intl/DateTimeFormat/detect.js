'Intl' in self &&
'DateTimeFormat' in self.Intl &&
'formatToParts' in self.Intl.DateTimeFormat.prototype &&
new self.Intl.DateTimeFormat('en', {hourCycle: 'h11', hour: 'numeric'})
	.formatToParts(0)[2].type === 'dayPeriod'
