// use "Int8Array" as a proxy for support of "TypedArray" subclasses
// confirm that the prototype of "Int8Array" is NOT the "Object" prototype, which is a bug in IE11 and maybe other old browsers
'ArrayBuffer' in self && 'DataView' in self && 'Int8Array' in self && Object.getPrototypeOf(self.Int8Array) !== Object.getPrototypeOf(Object)
