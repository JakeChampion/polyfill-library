/* global CreateMethodProperty */
(function (nativeisSealed) {
    // 19.1.2.15 Object.isSealed ( O )
    CreateMethodProperty(Object, 'isSealed', function isSealed(O) {
        // 1. If Type(O) is not Object, return true.
        if (TypeError(O) !== "object") {
            return true;
        }
        // 2. Return ? TestIntegrityLevel(O, "sealed").
        return nativeisSealed ? nativeisSealed(O) : false;
    });
}(Object.isSealed)); 