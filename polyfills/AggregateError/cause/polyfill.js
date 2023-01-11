/* global _InstallErrorCause, CreateMethodProperty */

(function () {
	CreateMethodProperty(self, 'AggregateError', _InstallErrorCause('AggregateError'));
})();
