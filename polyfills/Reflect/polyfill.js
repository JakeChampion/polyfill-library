// 26.1 The Reflect Object
Object.defineProperty(this, "Reflect", {
    value: this.Reflect || {},
    writable: true,
    enumerable: false,
    configurable: true
});