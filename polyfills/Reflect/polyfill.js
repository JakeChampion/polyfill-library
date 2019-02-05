// 26.1 The Reflect Object
Object.defineProperty(this, "Reflect", {
    value: this.Reflect || {},
    writable: true,
    configurable: true
});
Object.defineProperty(this, "Reflect", {
    value: this.Reflect || {},
    enumerable: false
});