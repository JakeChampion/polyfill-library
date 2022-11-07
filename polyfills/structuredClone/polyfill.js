"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function (env) {
  // node_modules/@ungap/structured-clone/esm/types.js
  var VOID = -1;
  var PRIMITIVE = 0;
  var ARRAY = 1;
  var OBJECT = 2;
  var DATE = 3;
  var REGEXP = 4;
  var MAP = 5;
  var SET = 6;
  var ERROR = 7;
  var BIGINT = 8;

  // node_modules/@ungap/structured-clone/esm/deserialize.js
  function deserializer($, _) {
    var as = function as(out, index) {
      $.set(index, out);
      return out;
    };
    var unpair = function unpair(index) {
      if ($.has(index)) return $.get(index);

      var _$index = _slicedToArray(_[index], 2),
          type = _$index[0],
          value = _$index[1];

      switch (type) {
        case PRIMITIVE:
        case VOID:
          return as(value, index);
        case ARRAY:
          {
            var arr = as([], index);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var index2 = _step.value;

                arr.push(unpair(index2));
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            return arr;
          }
        case OBJECT:
          {
            var object = as({}, index);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _ref = _step2.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var key = _ref2[0];
                var _index = _ref2[1];

                object[unpair(key)] = unpair(_index);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return object;
          }
        case DATE:
          return as(new Date(value), index);
        case REGEXP:
          {
            var source = value.source,
                flags = value.flags;

            return as(new RegExp(source, flags), index);
          }
        case MAP:
          {
            var map = as( /* @__PURE__ */new Map(), index);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = value[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _ref3 = _step3.value;

                var _ref4 = _slicedToArray(_ref3, 2);

                var _key = _ref4[0];
                var _index2 = _ref4[1];

                map.set(unpair(_key), unpair(_index2));
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            return map;
          }
        case SET:
          {
            var set = as( /* @__PURE__ */new Set(), index);
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = value[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _index3 = _step4.value;

                set.add(unpair(_index3));
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            return set;
          }
        case ERROR:
          {
            var name = value.name,
                message = value.message;

            return as(new env[name](message), index);
          }
        case BIGINT:
          return as(BigInt(value), index);
        case "BigInt":
          return as(Object(BigInt(value)), index);
      }
      return as(new env[type](value), index);
    };
    return unpair;
  };

  function deserialize(serialized) {
    return deserializer( /* @__PURE__ */new Map(), serialized)(0);
  };

  // node_modules/@ungap/structured-clone/esm/serialize.js
  var EMPTY = "";
  var _ref5 = {},
      toString = _ref5.toString;
  var keys = Object.keys;

  function typeOf(value) {
    var type = typeof value === "undefined" ? "undefined" : _typeof(value);
    if (type !== "object" || !value) return [PRIMITIVE, type];
    var asString = toString.call(value).slice(8, -1);
    switch (asString) {
      case "Array":
        return [ARRAY, EMPTY];
      case "Object":
        return [OBJECT, EMPTY];
      case "Date":
        return [DATE, EMPTY];
      case "RegExp":
        return [REGEXP, EMPTY];
      case "Map":
        return [MAP, EMPTY];
      case "Set":
        return [SET, EMPTY];
    }
    if (asString.includes("Array")) return [ARRAY, asString];
    if (asString.includes("Error")) return [ERROR, asString];
    return [OBJECT, asString];
  };
  function shouldSkip(_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        TYPE = _ref7[0],
        type = _ref7[1];

    return TYPE === PRIMITIVE && (type === "function" || type === "symbol");
  };
  function serializer(strict, json, $, _) {
    var as = function as(out, value) {
      var index = _.push(out) - 1;
      $.set(value, index);
      return index;
    };
    var pair = function pair(value) {
      if ($.has(value)) return $.get(value);

      var _typeOf = typeOf(value),
          _typeOf2 = _slicedToArray(_typeOf, 2),
          TYPE = _typeOf2[0],
          type = _typeOf2[1];

      switch (TYPE) {
        case PRIMITIVE:
          {
            var entry = value;
            switch (type) {
              case "bigint":
                TYPE = BIGINT;
                entry = value.toString();
                break;
              case "function":
              case "symbol":
                if (strict) throw new TypeError("unable to serialize " + type);
                entry = null;
                break;
              case "undefined":
                return as([VOID], value);
            }
            return as([TYPE, entry], value);
          }
        case ARRAY:
          {
            if (type) return as([type, [].concat(_toConsumableArray(value))], value);
            var arr = [];
            var index = as([TYPE, arr], value);
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = value[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var _entry = _step5.value;

                arr.push(pair(_entry));
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }

            return index;
          }
        case OBJECT:
          {
            if (type) {
              switch (type) {
                case "BigInt":
                  return as([type, value.toString()], value);
                case "Boolean":
                case "Number":
                case "String":
                  return as([type, value.valueOf()], value);
              }
            }
            if (json && "toJSON" in value) return pair(value.toJSON());
            var entries = [];
            var _index4 = as([TYPE, entries], value);
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = keys(value)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var key = _step6.value;

                if (strict || !shouldSkip(typeOf(value[key]))) entries.push([pair(key), pair(value[key])]);
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }

            return _index4;
          }
        case DATE:
          return as([TYPE, value.toISOString()], value);
        case REGEXP:
          {
            var source = value.source,
                flags = value.flags;

            return as([TYPE, { source: source, flags: flags }], value);
          }
        case MAP:
          {
            var _entries = [];
            var _index5 = as([TYPE, _entries], value);
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = value[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var _ref8 = _step7.value;

                var _ref9 = _slicedToArray(_ref8, 2);

                var _key2 = _ref9[0];
                var _entry2 = _ref9[1];

                if (strict || !(shouldSkip(typeOf(_key2)) || shouldSkip(typeOf(_entry2)))) _entries.push([pair(_key2), pair(_entry2)]);
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }

            return _index5;
          }
        case SET:
          {
            var _entries2 = [];
            var _index6 = as([TYPE, _entries2], value);
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
              for (var _iterator8 = value[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var _entry3 = _step8.value;

                if (strict || !shouldSkip(typeOf(_entry3))) _entries2.push(pair(_entry3));
              }
            } catch (err) {
              _didIteratorError8 = true;
              _iteratorError8 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                  _iterator8.return();
                }
              } finally {
                if (_didIteratorError8) {
                  throw _iteratorError8;
                }
              }
            }

            return _index6;
          }
      }
      var message = value.message;

      return as([TYPE, { name: type, message: message }], value);
    };
    return pair;
  };

  function serialize(value) {
    var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        json = _ref10.json,
        lossy = _ref10.lossy;

    var _ = [];
    return serializer(!(json || lossy), !!json, /* @__PURE__ */new Map(), _)(value), _;
  };

  // polyfill.js
  env.structuredClone = function(any, options) {
    return deserialize(serialize(any, options));
  };
})(self);
