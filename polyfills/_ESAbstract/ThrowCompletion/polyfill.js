// 6.2.4.2 ThrowCompletion ( value )
// eslint-disable-next-line no-unused-vars
function ThrowCompletion(value) {
	return {
		"[[Type]]": "throw",
		"[[Value]]": value
	};
}
