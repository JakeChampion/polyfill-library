/* global Symbol */
!(function(n) {
  var t = {};
  function e(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = { i: r, l: !1, exports: {} });
    return n[r].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
  }
  (e.m = n),
    (e.c = t),
    (e.d = function(n, t, r) {
      e.o(n, t) || Object.defineProperty(n, t, { enumerable: !0, get: r });
    }),
    (e.r = function(n) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(n, "__esModule", { value: !0 });
    }),
    (e.t = function(n, t) {
      if ((1 & t && (n = e(n)), 8 & t)) return n;
      if (4 & t && "object" == typeof n && n && n.__esModule) return n;
      var r = Object.create(null);
      if (
        (e.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: n }),
        2 & t && "string" != typeof n)
      )
        for (var o in n)
          e.d(
            r,
            o,
            function(t) {
              return n[t];
            }.bind(null, o)
          );
      return r;
    }),
    (e.n = function(n) {
      var t =
        n && n.__esModule
          ? function() {
              return n["default"];
            }
          : function() {
              return n;
            };
      return e.d(t, "a", t), t;
    }),
    (e.o = function(n, t) {
      return Object.prototype.hasOwnProperty.call(n, t);
    }),
    (e.p = ""),
    e((e.s = 80));
})({
  2:
    /*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
    /*! no static exports found */
    /*! all exports used */
    /*! ModuleConcatenation bailout: Module is not an ECMAScript module */ function(
      n,
      _t
    ) {
      var e;
      e = (function() {
        return this;
      })();
      try {
        e = e || Function("return this")() || (0, eval)("this");
      } catch (_n) {
        "object" == typeof window && (e = window);
      }
      n.exports = e;
    },
  5:
    /*!*********************!*\
  !*** ./src/yaku.js ***!
  \*********************/
    /*! no static exports found */
    /*! all exports used */
    /*! ModuleConcatenation bailout: Module is not an ECMAScript module */ function(
      n,
      t,
      e
    ) {
      (function(t) {
        !(function() {
          "use strict";
          var e,
            r,
            o,
            i = null,
            u = "object" == typeof self,
            c = u ? self : t,
            f = c.Promise,
            s = c.process,
            a = c.console,
            l = !1,
            h = Array,
            v = Error,
            p = 1,
            d = 2,
            _ = 3,
            y = "Symbol",
            m = "iterator",
            j = "species",
            w = y + "(" + j + ")",
            b = "return",
            g = "_uh",
            x = "_pt",
            k = "_st",
            S = "Invalid argument",
            P = "\nFrom previous ",
            T = "Chaining cycle detected for promise",
            O = "rejectionHandled",
            R = "unhandledRejection",
            C = { e: i },
            F = function() {},
            M = /^.+\/node_modules\/yaku\/.+\n?/gm,
            E = function(n) {
              var t;
              if (!I(this) || this._s !== e) throw B("Invalid this");
              if (((this._s = _), l && (this[x] = D()), n !== F)) {
                if (!L(n)) throw B(S);
                (t = $(n)(V(this, d), V(this, p))) === C && Z(this, p, t.e);
              }
            };
          function H() {
            return E[y][j] || w;
          }
          function I(n) {
            return n && "object" == typeof n;
          }
          function L(n) {
            return "function" == typeof n;
          }
          function A(n, t) {
            return n instanceof t;
          }
          function U(n, t, e) {
            if (!t(n)) throw B(e);
          }
          function Y() {
            try {
              return r.apply(o, arguments);
            } catch (_n) {
              return (C.e = n), C;
            }
          }
          function $(n, t) {
            return (r = n), (o = t), Y;
          }
          function q(n, t) {
            var r = h(n),
              o = 0;
            function i() {
              for (var i = 0; i < o; )
                t(r[i], r[i + 1]), (r[i++] = e), (r[i++] = e);
              (o = 0), r.length > n && (r.length = n);
            }
            return function(n, t) {
              (r[o++] = n), (r[o++] = t), 2 === o && E.nextTick(i);
            };
          }
          function z(n, t) {
            var e,
              r,
              o,
              i,
              u = 0;
            if (!n) throw B(S);
            var c = n[E[y][m]];
            if (L(c)) r = c.call(n);
            else {
              if (!L(n.next)) {
                if (A(n, h)) {
                  for (e = n.length; u < e; ) t(n[u], u++);
                  return u;
                }
                throw B(S);
              }
              r = n;
            }
            for (; !(o = r.next()).done; )
              if ((i = $(t)(o.value, u++)) === C)
                throw (L(r[b]) && r[b](), i.e);
            return u;
          }
          function B(n) {
            return new TypeError(n);
          }
          function D(n) {
            return (n ? "" : P) + new v().stack;
          }
          (E["default"] = E),
            (function(n, t) {
              for (var e in t) n[e] = t[e];
            })(E.prototype, {
              then: function(n, t) {
                if (void 0 === this._s) throw B();
                return (function(n, t, e, r) {
                  L(e) && (t._onFulfilled = e);
                  L(r) && (n[g] && K(O, n), (t._onRejected = r));
                  l && (t._p = n);
                  (n[n._c++] = t), n._s !== _ && G(n, t);
                  return t;
                })(this, Q(E.speciesConstructor(this, E)), n, t);
              },
              "catch": function(n) {
                return this.then(e, n);
              },
              "finally": function(n) {
                return this.then(
                  function(t) {
                    return E.resolve(n()).then(function() {
                      return t;
                    });
                  },
                  function(t) {
                    return E.resolve(n()).then(function() {
                      throw t;
                    });
                  }
                );
              },
              _c: 0,
              _p: i
            }),
            (E.resolve = function(n) {
              return N(n) ? n : nn(Q(this), n);
            }),
            (E.reject = function(n) {
              return Z(Q(this), p, n);
            }),
            (E.race = function(n) {
              var t = this,
                e = Q(t),
                r = function(n) {
                  Z(e, d, n);
                },
                o = function(n) {
                  Z(e, p, n);
                },
                i = $(z)(n, function(n) {
                  t.resolve(n).then(r, o);
                });
              return i === C ? t.reject(i.e) : e;
            }),
            (E.all = function(n) {
              var t,
                e = this,
                r = Q(e),
                o = [];
              function i(n) {
                Z(r, p, n);
              }
              return (t = $(z)(n, function(n, u) {
                e.resolve(n).then(function(n) {
                  (o[u] = n), --t || Z(r, d, o);
                }, i);
              })) === C
                ? e.reject(t.e)
                : (t || Z(r, d, []), r);
            }),
            (E.Symbol = c[y] || {}),
            $(function() {
              Object.defineProperty(E, H(), {
                get: function() {
                  return this;
                }
              });
            })(),
            (E.speciesConstructor = function(n, t) {
              var e = n.constructor;
              return (e && e[H()]) || t;
            }),
            (E.unhandledRejection = function(n, t) {
              a && a.error("Uncaught (in promise)", l ? t.longStack : W(n, t));
            }),
            (E.rejectionHandled = F),
            (E.enableLongStackTrace = function() {
              l = !0;
            }),
            (E.nextTick = u
              ? function(n) {
                  f
                    ? new f(function(n) {
                        n();
                      }).then(n)
                    : setTimeout(n);
                }
              : s.nextTick),
            (E._s = 1);
          var G = q(999, function(n, t) {
              var r, o;
              (o = n._s !== p ? t._onFulfilled : t._onRejected) !== e
                ? (r = $(X)(o, n._v)) !== C
                  ? nn(t, r)
                  : Z(t, p, r.e)
                : Z(t, n._s, n._v);
            }),
            J = q(9, function(n) {
              (function n(t) {
                if (t._umark) return !0;
                t._umark = !0;
                var e,
                  r = 0,
                  o = t._c;
                for (; r < o; ) if ((e = t[r++])._onRejected || n(e)) return !0;
              })(n) || ((n[g] = 1), K(R, n));
            });
          function K(n, t) {
            var e = "on" + n.toLowerCase(),
              r = c[e];
            s && s.listeners(n).length
              ? n === R
                ? s.emit(n, t._v, t)
                : s.emit(n, t)
              : r
              ? r({ reason: t._v, promise: t })
              : E[n](t._v, t);
          }
          function N(n) {
            return n && n._s;
          }
          function Q(n) {
            return N(n)
              ? new n(F)
              : ((t = new n(function(n, o) {
                  if (t) throw B();
                  (e = n), (r = o);
                })),
                U(e, L),
                U(r, L),
                t);
            var t, e, r;
          }
          function V(n, t) {
            var e = !1;
            return function(r) {
              e ||
                ((e = !0),
                l && (n[k] = D(!0)),
                t === d ? nn(n, r) : Z(n, t, r));
            };
          }
          function W(n, t) {
            var e = [];
            function r(n) {
              return e.push(n.replace(/^\s+|\s+$/g, ""));
            }
            return (
              l &&
                (t[k] && r(t[k]),
                (function n(t) {
                  t && x in t && (n(t._next), r(t[x] + ""), n(t._p));
                })(t)),
              (n && n.stack ? n.stack : n) +
                ("\n" + e.join("\n")).replace(M, "")
            );
          }
          function X(n, t) {
            return n(t);
          }
          function Z(n, t, e) {
            var r = 0,
              o = n._c;
            if (n._s === _)
              for (
                n._s = t,
                  n._v = e,
                  t === p &&
                    (l &&
                      (function(n) {
                        return A(n, v);
                      })(e) &&
                      (e.longStack = W(e, n)),
                    J(n));
                r < o;

              )
                G(n, n[r++]);
            return n;
          }
          function nn(n, t) {
            if (t === n && t) return Z(n, p, B(T)), n;
            if (t !== i && (L(t) || I(t))) {
              var e = $(tn)(t);
              if (e === C) return Z(n, p, e.e), n;
              L(e)
                ? (l && N(t) && (n._next = t),
                  N(t)
                    ? en(n, t, e)
                    : E.nextTick(function() {
                        en(n, t, e);
                      }))
                : Z(n, d, t);
            } else Z(n, d, t);
            return n;
          }
          function tn(n) {
            return n.then;
          }
          function en(n, t, e) {
            var r = $(e, t)(
              function(e) {
                t && ((t = i), nn(n, e));
              },
              function(e) {
                t && ((t = i), Z(n, p, e));
              }
            );
            r === C && t && (Z(n, p, r.e), (t = i));
          }
          try {
            n.exports = E;
          } catch (_n) {
            c.Yaku = E;
          }
        })();
      }.call(this, e(/*! ./../node_modules/webpack/buildin/global.js */ 2)));
    },
  80:
    /*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
    /*! no static exports found */
    /*! all exports used */
    /*! ModuleConcatenation bailout: Module is not an ECMAScript module */ function(
      n,
      t,
      e
    ) {
      (function(n) {
        var t = e(/*! ./yaku */ 5);
        try {
          (n.Promise = t), (window.Promise = t);
        // eslint-disable-next-line no-empty
        } catch (_n) {}
      }.call(this, e(/*! ./../node_modules/webpack/buildin/global.js */ 2)));
    }
});
