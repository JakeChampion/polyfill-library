('document' in self && 'documentElement' in self.document && 'style' in self.document.documentElement && 'scrollBehavior' in document.documentElement.style) || (function () {
    try {
        var supportsSmoothScroll = false;

        var scrollOptions = {
            top: 0,
            left: 0
        };

        Object.defineProperty(scrollOptions, 'behavior', {
            get: function () {
                supportsSmoothScroll = true;
                return 'smooth';
            },

            // Ensure this property lasts through cloning / destructuring:
            enumerable: true
        });

        document.body.scrollTo(scrollOptions);

        return supportsSmoothScroll;
    } catch (e) {
        return false;
    }
})();