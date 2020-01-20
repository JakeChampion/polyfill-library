/* eslint-disable no-prototype-builtins */
/* global ToString, ToPrimitive, CreateMethodProperty, Type */
(function() {
  "use strict";

  var arePropertyDescriptorsSupported = function() {
    var obj = {};
    try {
      Object.defineProperty(obj, "x", { enumerable: false, value: obj });
      /* eslint-disable no-unused-vars, no-restricted-syntax */
      for (var _ in obj) {
        return false;
      }
      /* eslint-enable no-unused-vars, no-restricted-syntax */
      return obj.x === obj;
    } catch (e) {
      // this is IE 8.
      return false;
    }
  };

  var isObject = function(it) {
    return typeof it === "object" ? it !== null : typeof it === "function";
  };

  var id = 0;
  var postfix = Math.random();

  function uid(key) {
    return (
      "Symbol(" +
      String(key === undefined ? "" : key) +
      ")_" +
      (++id + postfix).toString(36)
    );
  }

  var supportsDescriptors =
    Object.defineProperty && arePropertyDescriptorsSupported();
  var hidden = uid("hidden");
  var hiddenKeys = {};
  var allSymbols = {};
  var objectPrototypeSymbols = {};
  var stringToSymbolRegistry = {};
  var symbolToStringRegistry = {};
  var state = uid("state");
  hiddenKeys[state] = true;
  hiddenKeys[hidden] = true;
  var setInternalState = function(it, metadata) {
    Object.defineProperty(it, state, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: metadata
    });
    return metadata;
  };
  var getInternalState = function(it) {
    return it.hasOwnProperty(state) ? it[state] : {};
  };
  var nativeObjectCreate = Object.create;

  var wrap = function(tag, description) {
    var symbol = (allSymbols[tag] = nativeObjectCreate(Symbol.prototype));
    setInternalState(symbol, {
      type: "Symbol",
      tag: tag,
      description: description
    });
    if (!supportsDescriptors) {
      symbol.description = description;
    }
    return Object.freeze(symbol);
  };
  var nativeDefineProperty = Object.defineProperty;

  // The abstract operation thisSymbolValue(value) performs the following steps:
  function thisSymbolValue(value) {
    // 1. If Type(value) is Symbol, return value.
    if (Type(value) === "symbol") {
      return value;
    }
    // 2. If Type(value) is Object and value has a [[SymbolData]] internal slot, then
    // a. Let s be value.[[SymbolData]].
    // b. Assert: Type(s) is Symbol.
    // c. Return s.
    // 3. Throw a TypeError exception.
    throw TypeError(value + " is not a symbol");
  }

  // 19.4.1.1 Symbol ( [ description ] )
  function Symbol() {
    // 1. If NewTarget is not undefined, throw a TypeError exception.
    if (this instanceof Symbol) {
      throw TypeError("Symbol is not a constructor");
    }
    // 2. If description is undefined, let descString be undefined.
    if (arguments.length === 0 || arguments[0] === undefined) {
      var descString = undefined;
      // 3. Else, let descString be ? ToString(description).
    } else {
      descString = ToString(arguments[0]);
    }

    // 4. Return a new unique Symbol value whose [[Description]] value is descString.
    var tag = uid(descString);

    if (supportsDescriptors) {
      nativeDefineProperty(Object.prototype, tag, {
        configurable: true,
        set: function setter(value) {
          if (this === Object.prototype) {
            setter.call(objectPrototypeSymbols, value);
          }
          if (this.hasOwnProperty(hidden) && this[hidden].hasOwnProperty(tag)) {
            this[hidden][tag] = false;
          }
          nativeDefineProperty(this, tag, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
          });
        }
      });
    }
    return wrap(tag, descString);
  }

  var defineProperty = function defineProperty(O, P, Attributes) {
    if (O === Object.prototype)
      defineProperty(objectPrototypeSymbols, P, Attributes);
    if (!isObject(O)) {
      throw new TypeError(String(O) + " is not an object");
    }
    var key = ToPrimitive(P, String);
    if (!isObject(Attributes)) {
      throw new TypeError(String(Attributes) + " is not an object");
    }
    if (allSymbols.hasOwnProperty(key)) {
      if (!Attributes.enumerable) {
        if (!O.hasOwnProperty(hidden))
          nativeDefineProperty(O, hidden, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: {}
          });
        O[hidden][key] = true;
      } else {
        if (O.hasOwnProperty(hidden) && O[hidden][key]) O[hidden][key] = false;
        Attributes = nativeObjectCreate(Attributes, {
          enumerable: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
          }
        });
      }
      return nativeDefineProperty(O, key, Attributes);
    }
    return nativeDefineProperty(O, key, Attributes);
  };

  Object.defineProperty = defineProperty;

  var toString = {}.toString;
  var split = "".split;
  CreateMethodProperty(Object, "defineProperties", function defineProperties(
    O,
    Properties
  ) {
    if (!isObject(O)) {
      throw new TypeError(String(O) + " is not an object");
    }
    // Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
    var properties =
      (Type(Properties) === "string" || Properties instanceof String) &&
      toString.call(Properties) == "[object String]"
        ? split.call(Properties, "")
        : Object(Properties);
    var keys = Object.keys(properties).concat(
      Object.getOwnPropertySymbols(properties)
    );
    keys.forEach(function(key) {
      if (!supportsDescriptors || properties.propertyIsEnumerable(key)) {
        Object.defineProperty(O, key, properties[key]);
      }
    });
    return O;
  });

  CreateMethodProperty(Object, "create", function create(O, Properties) {
    return Properties === undefined
      ? nativeObjectCreate(O)
      : Object.defineProperties(nativeObjectCreate(O), Properties);
  });

  var nativePropertyIsEnumerable = Object.prototype.propertyIsEnumerable;
  CreateMethodProperty(
    Object.prototype,
    "propertyIsEnumerable",
    function propertyIsEnumerable(V) {
      var P = ToPrimitive(V, String);
      var enumerable = nativePropertyIsEnumerable.call(this, P);
      if (
        this === Object.prototype &&
        allSymbols.hasOwnProperty(P) &&
        !objectPrototypeSymbols.hasOwnProperty(P)
      )
        return false;
      return enumerable ||
        !this.hasOwnProperty(P) ||
        !allSymbols.hasOwnProperty(P) ||
        (this.hasOwnProperty(hidden) && this[hidden][P])
        ? enumerable
        : true;
    }
  );

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  CreateMethodProperty(
    Object,
    "getOwnPropertyDescriptor",
    function getOwnPropertyDescriptor(O, P) {
      // Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
      var it =
        (Type(O) === "string" || O instanceof String) &&
        toString.call(O) == "[object String]"
          ? split.call(O, "")
          : Object(O);
      var key = ToPrimitive(P, String);
      if (
        it === Object.prototype &&
        allSymbols.hasOwnProperty(key) &&
        !objectPrototypeSymbols.hasOwnProperty(key)
      )
        return;
      var descriptor = nativeGetOwnPropertyDescriptor(it, key);
      if (
        descriptor &&
        allSymbols.hasOwnProperty(key) &&
        !(it.hasOwnProperty(hidden) && it[hidden][key])
      ) {
        descriptor.enumerable = true;
      }
      return descriptor;
    }
  );

  var nativeGetOwnPropertyNames = Object.getOwnPropertyNames;
  CreateMethodProperty(
    Object,
    "getOwnPropertyNames",
    function getOwnPropertyNames(O) {
      // Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
      var it =
        (Type(O) === "string" || O instanceof String) &&
        toString.call(O) == "[object String]"
          ? split.call(O, "")
          : Object(O);
      var names = nativeGetOwnPropertyNames(it);
      var result = [];
      names.forEach(function(key) {
        if (!allSymbols.hasOwnProperty(key) && !hiddenKeys.hasOwnProperty(key))
          result.push(key);
      });
      return result;
    }
  );

  CreateMethodProperty(
    Object,
    "getOwnPropertySymbols",
    function getOwnPropertySymbols(O) {
      var IS_OBJECT_PROTOTYPE = O === Object.prototype;
      // Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
      var it =
        (Type(O) === "string" || O instanceof String) &&
        toString.call(O) == "[object String]"
          ? split.call(O, "")
          : Object(O);
      var names = nativeGetOwnPropertyNames(
        IS_OBJECT_PROTOTYPE ? objectPrototypeSymbols : it
      );
      var result = [];
      names.forEach(function(key) {
        if (
          allSymbols.hasOwnProperty(key) &&
          (!IS_OBJECT_PROTOTYPE || Object.prototype.hasOwnProperty(key))
        ) {
          result.push(allSymbols[key]);
        }
      });
      return result;
    }
  );

  var nativeToString = Object.prototype.toString;
  // Polyfill.io - Patching Object.prototype.toString to work correctly for Symbol objects.
  // TODO: Make a full Object.prototype.toString polyfill which works with Symbol.toStringTag
  var strictModeSupported = (function(){ 'use strict'; return this; }).call(null) === null;
  CreateMethodProperty(Object.prototype, "toString", function() {
    if (Type(this) === "symbol") {
      return "[object Symbol]";
	}
	if (!strictModeSupported) {
		// https://github.com/Financial-Times/polyfill-library/issues/164#issuecomment-486965300
		// Polyfill.io this code is here for the situation where a browser does not
		// support strict mode and is executing `Object.prototype.toString.call(null)`.
		// This code ensures that we return the correct result in that situation however,
		// this code also introduces a bug where it will return the incorrect result for
		// `Object.prototype.toString.call(window)`. We can't have the correct result for
		// both `window` and `null`, so we have opted for `null` as we believe this is the more 
		// common situation. 
		if (this === self) {
			return '[object Null]';
		}
	}
    return nativeToString.call(this);
  });

  // 19.4.3.3 Symbol.prototype.toString ( )
  CreateMethodProperty(Symbol.prototype, "toString", function toString() {
    // 1. Let sym be ? thisSymbolValue(this value).
    var sym = thisSymbolValue(this);
    // 2. Return SymbolDescriptiveString(sym).
    return getInternalState(sym).tag;
  });

  if (supportsDescriptors) {
    // 19.4.3.2 get Symbol.prototype.description
    nativeDefineProperty(Symbol.prototype, "description", {
      configurable: true,
      get: function description() {
        // 1. Let s be the this value.
        var s = this;
        // 2. Let sym be ? thisSymbolValue(s).
        var sym = thisSymbolValue(s);
        // 3. Return sym.[[Description]].
        return getInternalState(sym).description;
      }
    });
  }

  // 19.4.2.2 Symbol.for ( key )
  CreateMethodProperty(Symbol, "for", function(key) {
    // 1. Let stringKey be ? ToString(key).
    var stringKey = String(key);
    // 2. For each element e of the GlobalSymbolRegistry List, do
    if (stringToSymbolRegistry.hasOwnProperty(stringKey)) {
      // a. If SameValue(e.[[Key]], stringKey) is true, return e.[[Symbol]].
      return stringToSymbolRegistry[stringKey];
    }
    // 3. Assert: GlobalSymbolRegistry does not currently contain an entry for stringKey.
    // 4. Let newSymbol be a new unique Symbol value whose [[Description]] value is stringKey.
    var newSymbol = Symbol(stringKey);
    // 5. Append the Record { [[Key]]: stringKey, [[Symbol]]: newSymbol } to the GlobalSymbolRegistry List.
    stringToSymbolRegistry[stringKey] = newSymbol;
    symbolToStringRegistry[newSymbol] = stringKey;
    // 6. Return newSymbol.
    return newSymbol;
  });

  // 19.4.2.6 Symbol.keyFor ( sym )
  CreateMethodProperty(Symbol, "keyFor", function keyFor(sym) {
    // 1. If Type(sym) is not Symbol, throw a TypeError exception.
    if (Type(sym) !== "symbol") {
      throw TypeError(sym + " is not a symbol");
    }
    // 2. For each element e of the GlobalSymbolRegistry List (see 19.4.2.2), do
    if (symbolToStringRegistry.hasOwnProperty(sym)) {
      // a. If SameValue(e.[[Symbol]], sym) is true, return e.[[Key]].
      return symbolToStringRegistry[sym];
    }
    // 3. Assert: GlobalSymbolRegistry does not currently contain an entry for sym.
    // 4. Return undefined.
  });

  // Export the object
  try {
    CreateMethodProperty(self, "Symbol", Symbol);
  } catch (e) {
    // IE8 throws an error here if we set enumerable to false.
    // More info on table 2: https://msdn.microsoft.com/en-us/library/dd229916(v=vs.85).aspx
    self.Symbol = Symbol;
  }
}());
