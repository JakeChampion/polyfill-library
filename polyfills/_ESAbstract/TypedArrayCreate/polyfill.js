/* global Construct */
// 23.2.4.2 TypedArrayCreate ( constructor, argumentList )
function TypedArrayCreate(constructor, argumentList) { // eslint-disable-line no-unused-vars
	// 1. Let newTypedArray be ? Construct(constructor, argumentList).
	var newTypedArray = Construct(constructor, argumentList);
	// 2. Perform ? ValidateTypedArray(newTypedArray).
	// TODO: Add ValidateTypedArray
	// 3. If the number of elements in argumentList is 1 and argumentList[0] is a Number, then
	if (argumentList.length === 1 && typeof argumentList[0] === 'number') {
		// a. If newTypedArray.[[ArrayLength]] < ℝ(argumentList[0]), throw a TypeError exception.
		if (newTypedArray.length < argumentList[0]) throw TypeError();
	}
	// 4. Return newTypedArray.
	return newTypedArray;
}
