(function () {
  'use strict';

  function _regeneratorRuntime() {
    /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

    _regeneratorRuntime = function () {
      return exports;
    };

    var exports = {},
        Op = Object.prototype,
        hasOwn = Op.hasOwnProperty,
        $Symbol = "function" == typeof Symbol ? Symbol : {},
        iteratorSymbol = $Symbol.iterator || "@@iterator",
        asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
        toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }

    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
          generator = Object.create(protoGenerator.prototype),
          context = new Context(tryLocsList || []);
      return generator._invoke = function (innerFn, self, context) {
        var state = "suspendedStart";
        return function (method, arg) {
          if ("executing" === state) throw new Error("Generator is already running");

          if ("completed" === state) {
            if ("throw" === method) throw arg;
            return doneResult();
          }

          for (context.method = method, context.arg = arg;;) {
            var delegate = context.delegate;

            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
              if ("suspendedStart" === state) throw state = "completed", context.arg;
              context.dispatchException(context.arg);
            } else "return" === context.method && context.abrupt("return", context.arg);
            state = "executing";
            var record = tryCatch(innerFn, self, context);

            if ("normal" === record.type) {
              if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
              return {
                value: record.arg,
                done: context.done
              };
            }

            "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
          }
        };
      }(innerFn, self, context), generator;
    }

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    exports.wrap = wrap;
    var ContinueSentinel = {};

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {}

    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
        NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if ("throw" !== record.type) {
          var result = record.arg,
              value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }

        reject(record.arg);
      }

      var previousPromise;

      this._invoke = function (method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      };
    }

    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (undefined === method) {
        if (context.delegate = null, "throw" === context.method) {
          if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
          context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }

    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;

            return next.value = undefined, next.done = !0, next;
          };

          return next.next = next;
        }
      }

      return {
        next: doneResult
      };
    }

    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }

    return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (object) {
      var keys = [];

      for (var key in object) keys.push(key);

      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }

        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;

        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
              record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
                hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        }

        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  /*! markdown-it 10.0.0 https://github.com//markdown-it/markdown-it @license MIT */
  (function (f) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;

      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }

      g.markdownit = f();
    }
  })(function () {
    return function () {
      function r(e, n, t) {
        function o(i, f) {
          if (!n[i]) {
            if (!e[i]) {
              var c = "function" == typeof require && require;
              if (!f && c) return c(i, !0);
              if (u) return u(i, !0);
              var a = new Error("Cannot find module '" + i + "'");
              throw a.code = "MODULE_NOT_FOUND", a;
            }

            var p = n[i] = {
              exports: {}
            };
            e[i][0].call(p.exports, function (r) {
              var n = e[i][1][r];
              return o(n || r);
            }, p, p.exports, r, e, n, t);
          }

          return n[i].exports;
        }

        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
          o(t[i]);
        }

        return o;
      }

      return r;
    }()({
      1: [function (require, module, exports) {
        /*eslint quotes:0*/

        module.exports = require('entities/lib/maps/entities.json');
      }, {
        "entities/lib/maps/entities.json": 52
      }],
      2: [function (require, module, exports) {

        module.exports = ['address', 'article', 'aside', 'base', 'basefont', 'blockquote', 'body', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dialog', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'iframe', 'legend', 'li', 'link', 'main', 'menu', 'menuitem', 'meta', 'nav', 'noframes', 'ol', 'optgroup', 'option', 'p', 'param', 'section', 'source', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul'];
      }, {}],
      3: [function (require, module, exports) {

        var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
        var unquoted = '[^"\'=<>`\\x00-\\x20]+';
        var single_quoted = "'[^']*'";
        var double_quoted = '"[^"]*"';
        var attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';
        var attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';
        var open_tag = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>';
        var close_tag = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>';
        var comment = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
        var processing = '<[?].*?[?]>';
        var declaration = '<![A-Z]+\\s+[^>]*>';
        var cdata = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';
        var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment + '|' + processing + '|' + declaration + '|' + cdata + ')');
        var HTML_OPEN_CLOSE_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + ')');
        module.exports.HTML_TAG_RE = HTML_TAG_RE;
        module.exports.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;
      }, {}],
      4: [function (require, module, exports) {

        function _class(obj) {
          return Object.prototype.toString.call(obj);
        }

        function isString(obj) {
          return _class(obj) === '[object String]';
        }

        var _hasOwnProperty = Object.prototype.hasOwnProperty;

        function has(object, key) {
          return _hasOwnProperty.call(object, key);
        } // Merge objects
        //


        function assign(obj
        /*from1, from2, from3, ...*/
        ) {
          var sources = Array.prototype.slice.call(arguments, 1);
          sources.forEach(function (source) {
            if (!source) {
              return;
            }

            if (_typeof(source) !== 'object') {
              throw new TypeError(source + 'must be object');
            }

            Object.keys(source).forEach(function (key) {
              obj[key] = source[key];
            });
          });
          return obj;
        } // Remove element from array and put another array at those position.
        // Useful for some operations with tokens


        function arrayReplaceAt(src, pos, newElements) {
          return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
        } ////////////////////////////////////////////////////////////////////////////////


        function isValidEntityCode(c) {
          /*eslint no-bitwise:0*/
          // broken sequence
          if (c >= 0xD800 && c <= 0xDFFF) {
            return false;
          } // never used


          if (c >= 0xFDD0 && c <= 0xFDEF) {
            return false;
          }

          if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) {
            return false;
          } // control codes


          if (c >= 0x00 && c <= 0x08) {
            return false;
          }

          if (c === 0x0B) {
            return false;
          }

          if (c >= 0x0E && c <= 0x1F) {
            return false;
          }

          if (c >= 0x7F && c <= 0x9F) {
            return false;
          } // out of range


          if (c > 0x10FFFF) {
            return false;
          }

          return true;
        }

        function fromCodePoint(c) {
          /*eslint no-bitwise:0*/
          if (c > 0xffff) {
            c -= 0x10000;
            var surrogate1 = 0xd800 + (c >> 10),
                surrogate2 = 0xdc00 + (c & 0x3ff);
            return String.fromCharCode(surrogate1, surrogate2);
          }

          return String.fromCharCode(c);
        }

        var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
        var ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
        var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + '|' + ENTITY_RE.source, 'gi');
        var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;

        var entities = require('./entities');

        function replaceEntityPattern(match, name) {
          var code = 0;

          if (has(entities, name)) {
            return entities[name];
          }

          if (name.charCodeAt(0) === 0x23
          /* # */
          && DIGITAL_ENTITY_TEST_RE.test(name)) {
            code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);

            if (isValidEntityCode(code)) {
              return fromCodePoint(code);
            }
          }

          return match;
        }
        /*function replaceEntities(str) {
          if (str.indexOf('&') < 0) { return str; }
        
          return str.replace(ENTITY_RE, replaceEntityPattern);
        }*/


        function unescapeMd(str) {
          if (str.indexOf('\\') < 0) {
            return str;
          }

          return str.replace(UNESCAPE_MD_RE, '$1');
        }

        function unescapeAll(str) {
          if (str.indexOf('\\') < 0 && str.indexOf('&') < 0) {
            return str;
          }

          return str.replace(UNESCAPE_ALL_RE, function (match, escaped, entity) {
            if (escaped) {
              return escaped;
            }

            return replaceEntityPattern(match, entity);
          });
        } ////////////////////////////////////////////////////////////////////////////////


        var HTML_ESCAPE_TEST_RE = /[&<>"]/;
        var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
        var HTML_REPLACEMENTS = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        };

        function replaceUnsafeChar(ch) {
          return HTML_REPLACEMENTS[ch];
        }

        function escapeHtml(str) {
          if (HTML_ESCAPE_TEST_RE.test(str)) {
            return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
          }

          return str;
        } ////////////////////////////////////////////////////////////////////////////////


        var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;

        function escapeRE(str) {
          return str.replace(REGEXP_ESCAPE_RE, '\\$&');
        } ////////////////////////////////////////////////////////////////////////////////


        function isSpace(code) {
          switch (code) {
            case 0x09:
            case 0x20:
              return true;
          }

          return false;
        } // Zs (unicode class) || [\t\f\v\r\n]


        function isWhiteSpace(code) {
          if (code >= 0x2000 && code <= 0x200A) {
            return true;
          }

          switch (code) {
            case 0x09: // \t

            case 0x0A: // \n

            case 0x0B: // \v

            case 0x0C: // \f

            case 0x0D: // \r

            case 0x20:
            case 0xA0:
            case 0x1680:
            case 0x202F:
            case 0x205F:
            case 0x3000:
              return true;
          }

          return false;
        } ////////////////////////////////////////////////////////////////////////////////

        /*eslint-disable max-len*/


        var UNICODE_PUNCT_RE = require('uc.micro/categories/P/regex'); // Currently without astral characters support.


        function isPunctChar(ch) {
          return UNICODE_PUNCT_RE.test(ch);
        } // Markdown ASCII punctuation characters.
        //
        // !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
        // http://spec.commonmark.org/0.15/#ascii-punctuation-character
        //
        // Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
        //


        function isMdAsciiPunct(ch) {
          switch (ch) {
            case 0x21
            /* ! */
            :
            case 0x22
            /* " */
            :
            case 0x23
            /* # */
            :
            case 0x24
            /* $ */
            :
            case 0x25
            /* % */
            :
            case 0x26
            /* & */
            :
            case 0x27
            /* ' */
            :
            case 0x28
            /* ( */
            :
            case 0x29
            /* ) */
            :
            case 0x2A
            /* * */
            :
            case 0x2B
            /* + */
            :
            case 0x2C
            /* , */
            :
            case 0x2D
            /* - */
            :
            case 0x2E
            /* . */
            :
            case 0x2F
            /* / */
            :
            case 0x3A
            /* : */
            :
            case 0x3B
            /* ; */
            :
            case 0x3C
            /* < */
            :
            case 0x3D
            /* = */
            :
            case 0x3E
            /* > */
            :
            case 0x3F
            /* ? */
            :
            case 0x40
            /* @ */
            :
            case 0x5B
            /* [ */
            :
            case 0x5C
            /* \ */
            :
            case 0x5D
            /* ] */
            :
            case 0x5E
            /* ^ */
            :
            case 0x5F
            /* _ */
            :
            case 0x60
            /* ` */
            :
            case 0x7B
            /* { */
            :
            case 0x7C
            /* | */
            :
            case 0x7D
            /* } */
            :
            case 0x7E
            /* ~ */
            :
              return true;

            default:
              return false;
          }
        } // Hepler to unify [reference labels].
        //


        function normalizeReference(str) {
          // Trim and collapse whitespace
          //
          str = str.trim().replace(/\s+/g, ' '); // In node v10 'ẞ'.toLowerCase() === 'Ṿ', which is presumed to be a bug
          // fixed in v12 (couldn't find any details).
          //
          // So treat this one as a special case
          // (remove this when node v10 is no longer supported).
          //

          if ('ẞ'.toLowerCase() === 'Ṿ') {
            str = str.replace(/ẞ/g, 'ß');
          } // .toLowerCase().toUpperCase() should get rid of all differences
          // between letter variants.
          //
          // Simple .toLowerCase() doesn't normalize 125 code points correctly,
          // and .toUpperCase doesn't normalize 6 of them (list of exceptions:
          // İ, ϴ, ẞ, Ω, K, Å - those are already uppercased, but have differently
          // uppercased versions).
          //
          // Here's an example showing how it happens. Lets take greek letter omega:
          // uppercase U+0398 (Θ), U+03f4 (ϴ) and lowercase U+03b8 (θ), U+03d1 (ϑ)
          //
          // Unicode entries:
          // 0398;GREEK CAPITAL LETTER THETA;Lu;0;L;;;;;N;;;;03B8;
          // 03B8;GREEK SMALL LETTER THETA;Ll;0;L;;;;;N;;;0398;;0398
          // 03D1;GREEK THETA SYMBOL;Ll;0;L;<compat> 03B8;;;;N;GREEK SMALL LETTER SCRIPT THETA;;0398;;0398
          // 03F4;GREEK CAPITAL THETA SYMBOL;Lu;0;L;<compat> 0398;;;;N;;;;03B8;
          //
          // Case-insensitive comparison should treat all of them as equivalent.
          //
          // But .toLowerCase() doesn't change ϑ (it's already lowercase),
          // and .toUpperCase() doesn't change ϴ (already uppercase).
          //
          // Applying first lower then upper case normalizes any character:
          // '\u0398\u03f4\u03b8\u03d1'.toLowerCase().toUpperCase() === '\u0398\u0398\u0398\u0398'
          //
          // Note: this is equivalent to unicode case folding; unicode normalization
          // is a different step that is not required here.
          //
          // Final result should be uppercased, because it's later stored in an object
          // (this avoid a conflict with Object.prototype members,
          // most notably, `__proto__`)
          //


          return str.toLowerCase().toUpperCase();
        } ////////////////////////////////////////////////////////////////////////////////
        // Re-export libraries commonly used in both markdown-it and its plugins,
        // so plugins won't have to depend on them explicitly, which reduces their
        // bundled size (e.g. a browser build).
        //


        exports.lib = {};
        exports.lib.mdurl = require('mdurl');
        exports.lib.ucmicro = require('uc.micro');
        exports.assign = assign;
        exports.isString = isString;
        exports.has = has;
        exports.unescapeMd = unescapeMd;
        exports.unescapeAll = unescapeAll;
        exports.isValidEntityCode = isValidEntityCode;
        exports.fromCodePoint = fromCodePoint; // exports.replaceEntities     = replaceEntities;

        exports.escapeHtml = escapeHtml;
        exports.arrayReplaceAt = arrayReplaceAt;
        exports.isSpace = isSpace;
        exports.isWhiteSpace = isWhiteSpace;
        exports.isMdAsciiPunct = isMdAsciiPunct;
        exports.isPunctChar = isPunctChar;
        exports.escapeRE = escapeRE;
        exports.normalizeReference = normalizeReference;
      }, {
        "./entities": 1,
        "mdurl": 58,
        "uc.micro": 65,
        "uc.micro/categories/P/regex": 63
      }],
      5: [function (require, module, exports) {

        exports.parseLinkLabel = require('./parse_link_label');
        exports.parseLinkDestination = require('./parse_link_destination');
        exports.parseLinkTitle = require('./parse_link_title');
      }, {
        "./parse_link_destination": 6,
        "./parse_link_label": 7,
        "./parse_link_title": 8
      }],
      6: [function (require, module, exports) {

        var unescapeAll = require('../common/utils').unescapeAll;

        module.exports = function parseLinkDestination(str, pos, max) {
          var code,
              level,
              lines = 0,
              start = pos,
              result = {
            ok: false,
            pos: 0,
            lines: 0,
            str: ''
          };

          if (str.charCodeAt(pos) === 0x3C
          /* < */
          ) {
            pos++;

            while (pos < max) {
              code = str.charCodeAt(pos);

              if (code === 0x0A
              /* \n */
              ) {
                return result;
              }

              if (code === 0x3E
              /* > */
              ) {
                result.pos = pos + 1;
                result.str = unescapeAll(str.slice(start + 1, pos));
                result.ok = true;
                return result;
              }

              if (code === 0x5C
              /* \ */
              && pos + 1 < max) {
                pos += 2;
                continue;
              }

              pos++;
            } // no closing '>'


            return result;
          } // this should be ... } else { ... branch


          level = 0;

          while (pos < max) {
            code = str.charCodeAt(pos);

            if (code === 0x20) {
              break;
            } // ascii control characters


            if (code < 0x20 || code === 0x7F) {
              break;
            }

            if (code === 0x5C
            /* \ */
            && pos + 1 < max) {
              pos += 2;
              continue;
            }

            if (code === 0x28
            /* ( */
            ) {
              level++;
            }

            if (code === 0x29
            /* ) */
            ) {
              if (level === 0) {
                break;
              }

              level--;
            }

            pos++;
          }

          if (start === pos) {
            return result;
          }

          if (level !== 0) {
            return result;
          }

          result.str = unescapeAll(str.slice(start, pos));
          result.lines = lines;
          result.pos = pos;
          result.ok = true;
          return result;
        };
      }, {
        "../common/utils": 4
      }],
      7: [function (require, module, exports) {

        module.exports = function parseLinkLabel(state, start, disableNested) {
          var level,
              found,
              marker,
              prevPos,
              labelEnd = -1,
              max = state.posMax,
              oldPos = state.pos;
          state.pos = start + 1;
          level = 1;

          while (state.pos < max) {
            marker = state.src.charCodeAt(state.pos);

            if (marker === 0x5D
            /* ] */
            ) {
              level--;

              if (level === 0) {
                found = true;
                break;
              }
            }

            prevPos = state.pos;
            state.md.inline.skipToken(state);

            if (marker === 0x5B
            /* [ */
            ) {
              if (prevPos === state.pos - 1) {
                // increase level if we find text `[`, which is not a part of any token
                level++;
              } else if (disableNested) {
                state.pos = oldPos;
                return -1;
              }
            }
          }

          if (found) {
            labelEnd = state.pos;
          } // restore old state


          state.pos = oldPos;
          return labelEnd;
        };
      }, {}],
      8: [function (require, module, exports) {

        var unescapeAll = require('../common/utils').unescapeAll;

        module.exports = function parseLinkTitle(str, pos, max) {
          var code,
              marker,
              lines = 0,
              start = pos,
              result = {
            ok: false,
            pos: 0,
            lines: 0,
            str: ''
          };

          if (pos >= max) {
            return result;
          }

          marker = str.charCodeAt(pos);

          if (marker !== 0x22
          /* " */
          && marker !== 0x27
          /* ' */
          && marker !== 0x28
          /* ( */
          ) {
            return result;
          }

          pos++; // if opening marker is "(", switch it to closing marker ")"

          if (marker === 0x28) {
            marker = 0x29;
          }

          while (pos < max) {
            code = str.charCodeAt(pos);

            if (code === marker) {
              result.pos = pos + 1;
              result.lines = lines;
              result.str = unescapeAll(str.slice(start + 1, pos));
              result.ok = true;
              return result;
            } else if (code === 0x0A) {
              lines++;
            } else if (code === 0x5C
            /* \ */
            && pos + 1 < max) {
              pos++;

              if (str.charCodeAt(pos) === 0x0A) {
                lines++;
              }
            }

            pos++;
          }

          return result;
        };
      }, {
        "../common/utils": 4
      }],
      9: [function (require, module, exports) {

        var utils = require('./common/utils');

        var helpers = require('./helpers');

        var Renderer = require('./renderer');

        var ParserCore = require('./parser_core');

        var ParserBlock = require('./parser_block');

        var ParserInline = require('./parser_inline');

        var LinkifyIt = require('linkify-it');

        var mdurl = require('mdurl');

        var punycode = require('punycode');

        var config = {
          'default': require('./presets/default'),
          zero: require('./presets/zero'),
          commonmark: require('./presets/commonmark')
        }; ////////////////////////////////////////////////////////////////////////////////
        //
        // This validator can prohibit more than really needed to prevent XSS. It's a
        // tradeoff to keep code simple and to be secure by default.
        //
        // If you need different setup - override validator method as you wish. Or
        // replace it with dummy function and use external sanitizer.
        //

        var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
        var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

        function validateLink(url) {
          // url should be normalized at this point, and existing entities are decoded
          var str = url.trim().toLowerCase();
          return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) ? true : false : true;
        } ////////////////////////////////////////////////////////////////////////////////


        var RECODE_HOSTNAME_FOR = ['http:', 'https:', 'mailto:'];

        function normalizeLink(url) {
          var parsed = mdurl.parse(url, true);

          if (parsed.hostname) {
            // Encode hostnames in urls like:
            // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
            //
            // We don't encode unknown schemas, because it's likely that we encode
            // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
            //
            if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
              try {
                parsed.hostname = punycode.toASCII(parsed.hostname);
              } catch (er) {
                /**/
              }
            }
          }

          return mdurl.encode(mdurl.format(parsed));
        }

        function normalizeLinkText(url) {
          var parsed = mdurl.parse(url, true);

          if (parsed.hostname) {
            // Encode hostnames in urls like:
            // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
            //
            // We don't encode unknown schemas, because it's likely that we encode
            // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
            //
            if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
              try {
                parsed.hostname = punycode.toUnicode(parsed.hostname);
              } catch (er) {
                /**/
              }
            }
          }

          return mdurl.decode(mdurl.format(parsed));
        }
        /**
         * class MarkdownIt
         *
         * Main parser/renderer class.
         *
         * ##### Usage
         *
         * ```javascript
         * // node.js, "classic" way:
         * var MarkdownIt = require('markdown-it'),
         *     md = new MarkdownIt();
         * var result = md.render('# markdown-it rulezz!');
         *
         * // node.js, the same, but with sugar:
         * var md = require('markdown-it')();
         * var result = md.render('# markdown-it rulezz!');
         *
         * // browser without AMD, added to "window" on script load
         * // Note, there are no dash.
         * var md = window.markdownit();
         * var result = md.render('# markdown-it rulezz!');
         * ```
         *
         * Single line rendering, without paragraph wrap:
         *
         * ```javascript
         * var md = require('markdown-it')();
         * var result = md.renderInline('__markdown-it__ rulezz!');
         * ```
         **/

        /**
         * new MarkdownIt([presetName, options])
         * - presetName (String): optional, `commonmark` / `zero`
         * - options (Object)
         *
         * Creates parser instanse with given config. Can be called without `new`.
         *
         * ##### presetName
         *
         * MarkdownIt provides named presets as a convenience to quickly
         * enable/disable active syntax rules and options for common use cases.
         *
         * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
         *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
         * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
         *   similar to GFM, used when no preset name given. Enables all available rules,
         *   but still without html, typographer & autolinker.
         * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
         *   all rules disabled. Useful to quickly setup your config via `.enable()`.
         *   For example, when you need only `bold` and `italic` markup and nothing else.
         *
         * ##### options:
         *
         * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
         *   That's not safe! You may need external sanitizer to protect output from XSS.
         *   It's better to extend features via plugins, instead of enabling HTML.
         * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
         *   (`<br />`). This is needed only for full CommonMark compatibility. In real
         *   world you will need HTML output.
         * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
         * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
         *   Can be useful for external highlighters.
         * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
         * - __typographer__  - `false`. Set `true` to enable [some language-neutral
         *   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
         *   quotes beautification (smartquotes).
         * - __quotes__ - `“”‘’`, String or Array. Double + single quotes replacement
         *   pairs, when typographer enabled and smartquotes on. For example, you can
         *   use `'«»„“'` for Russian, `'„“‚‘'` for German, and
         *   `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
         * - __highlight__ - `null`. Highlighter function for fenced code blocks.
         *   Highlighter `function (str, lang)` should return escaped HTML. It can also
         *   return empty string if the source was not changed and should be escaped
         *   externaly. If result starts with <pre... internal wrapper is skipped.
         *
         * ##### Example
         *
         * ```javascript
         * // commonmark mode
         * var md = require('markdown-it')('commonmark');
         *
         * // default mode
         * var md = require('markdown-it')();
         *
         * // enable everything
         * var md = require('markdown-it')({
         *   html: true,
         *   linkify: true,
         *   typographer: true
         * });
         * ```
         *
         * ##### Syntax highlighting
         *
         * ```js
         * var hljs = require('highlight.js') // https://highlightjs.org/
         *
         * var md = require('markdown-it')({
         *   highlight: function (str, lang) {
         *     if (lang && hljs.getLanguage(lang)) {
         *       try {
         *         return hljs.highlight(lang, str, true).value;
         *       } catch (__) {}
         *     }
         *
         *     return ''; // use external default escaping
         *   }
         * });
         * ```
         *
         * Or with full wrapper override (if you need assign class to `<pre>`):
         *
         * ```javascript
         * var hljs = require('highlight.js') // https://highlightjs.org/
         *
         * // Actual default values
         * var md = require('markdown-it')({
         *   highlight: function (str, lang) {
         *     if (lang && hljs.getLanguage(lang)) {
         *       try {
         *         return '<pre class="hljs"><code>' +
         *                hljs.highlight(lang, str, true).value +
         *                '</code></pre>';
         *       } catch (__) {}
         *     }
         *
         *     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
         *   }
         * });
         * ```
         *
         **/


        function MarkdownIt(presetName, options) {
          if (!(this instanceof MarkdownIt)) {
            return new MarkdownIt(presetName, options);
          }

          if (!options) {
            if (!utils.isString(presetName)) {
              options = presetName || {};
              presetName = 'default';
            }
          }
          /**
           * MarkdownIt#inline -> ParserInline
           *
           * Instance of [[ParserInline]]. You may need it to add new rules when
           * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
           * [[MarkdownIt.enable]].
           **/


          this.inline = new ParserInline();
          /**
           * MarkdownIt#block -> ParserBlock
           *
           * Instance of [[ParserBlock]]. You may need it to add new rules when
           * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
           * [[MarkdownIt.enable]].
           **/

          this.block = new ParserBlock();
          /**
           * MarkdownIt#core -> Core
           *
           * Instance of [[Core]] chain executor. You may need it to add new rules when
           * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
           * [[MarkdownIt.enable]].
           **/

          this.core = new ParserCore();
          /**
           * MarkdownIt#renderer -> Renderer
           *
           * Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
           * rules for new token types, generated by plugins.
           *
           * ##### Example
           *
           * ```javascript
           * var md = require('markdown-it')();
           *
           * function myToken(tokens, idx, options, env, self) {
           *   //...
           *   return result;
           * };
           *
           * md.renderer.rules['my_token'] = myToken
           * ```
           *
           * See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
           **/

          this.renderer = new Renderer();
          /**
           * MarkdownIt#linkify -> LinkifyIt
           *
           * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
           * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
           * rule.
           **/

          this.linkify = new LinkifyIt();
          /**
           * MarkdownIt#validateLink(url) -> Boolean
           *
           * Link validation function. CommonMark allows too much in links. By default
           * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
           * except some embedded image types.
           *
           * You can change this behaviour:
           *
           * ```javascript
           * var md = require('markdown-it')();
           * // enable everything
           * md.validateLink = function () { return true; }
           * ```
           **/

          this.validateLink = validateLink;
          /**
           * MarkdownIt#normalizeLink(url) -> String
           *
           * Function used to encode link url to a machine-readable format,
           * which includes url-encoding, punycode, etc.
           **/

          this.normalizeLink = normalizeLink;
          /**
           * MarkdownIt#normalizeLinkText(url) -> String
           *
           * Function used to decode link url to a human-readable format`
           **/

          this.normalizeLinkText = normalizeLinkText; // Expose utils & helpers for easy acces from plugins

          /**
           * MarkdownIt#utils -> utils
           *
           * Assorted utility functions, useful to write plugins. See details
           * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js).
           **/

          this.utils = utils;
          /**
           * MarkdownIt#helpers -> helpers
           *
           * Link components parser functions, useful to write plugins. See details
           * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
           **/

          this.helpers = utils.assign({}, helpers);
          this.options = {};
          this.configure(presetName);

          if (options) {
            this.set(options);
          }
        }
        /** chainable
         * MarkdownIt.set(options)
         *
         * Set parser options (in the same format as in constructor). Probably, you
         * will never need it, but you can change options after constructor call.
         *
         * ##### Example
         *
         * ```javascript
         * var md = require('markdown-it')()
         *             .set({ html: true, breaks: true })
         *             .set({ typographer, true });
         * ```
         *
         * __Note:__ To achieve the best possible performance, don't modify a
         * `markdown-it` instance options on the fly. If you need multiple configurations
         * it's best to create multiple instances and initialize each with separate
         * config.
         **/


        MarkdownIt.prototype.set = function (options) {
          utils.assign(this.options, options);
          return this;
        };
        /** chainable, internal
         * MarkdownIt.configure(presets)
         *
         * Batch load of all options and compenent settings. This is internal method,
         * and you probably will not need it. But if you with - see available presets
         * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
         *
         * We strongly recommend to use presets instead of direct config loads. That
         * will give better compatibility with next versions.
         **/


        MarkdownIt.prototype.configure = function (presets) {
          var self = this,
              presetName;

          if (utils.isString(presets)) {
            presetName = presets;
            presets = config[presetName];

            if (!presets) {
              throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
            }
          }

          if (!presets) {
            throw new Error('Wrong `markdown-it` preset, can\'t be empty');
          }

          if (presets.options) {
            self.set(presets.options);
          }

          if (presets.components) {
            Object.keys(presets.components).forEach(function (name) {
              if (presets.components[name].rules) {
                self[name].ruler.enableOnly(presets.components[name].rules);
              }

              if (presets.components[name].rules2) {
                self[name].ruler2.enableOnly(presets.components[name].rules2);
              }
            });
          }

          return this;
        };
        /** chainable
         * MarkdownIt.enable(list, ignoreInvalid)
         * - list (String|Array): rule name or list of rule names to enable
         * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
         *
         * Enable list or rules. It will automatically find appropriate components,
         * containing rules with given names. If rule not found, and `ignoreInvalid`
         * not set - throws exception.
         *
         * ##### Example
         *
         * ```javascript
         * var md = require('markdown-it')()
         *             .enable(['sub', 'sup'])
         *             .disable('smartquotes');
         * ```
         **/


        MarkdownIt.prototype.enable = function (list, ignoreInvalid) {
          var result = [];

          if (!Array.isArray(list)) {
            list = [list];
          }

          ['core', 'block', 'inline'].forEach(function (chain) {
            result = result.concat(this[chain].ruler.enable(list, true));
          }, this);
          result = result.concat(this.inline.ruler2.enable(list, true));
          var missed = list.filter(function (name) {
            return result.indexOf(name) < 0;
          });

          if (missed.length && !ignoreInvalid) {
            throw new Error('MarkdownIt. Failed to enable unknown rule(s): ' + missed);
          }

          return this;
        };
        /** chainable
         * MarkdownIt.disable(list, ignoreInvalid)
         * - list (String|Array): rule name or list of rule names to disable.
         * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
         *
         * The same as [[MarkdownIt.enable]], but turn specified rules off.
         **/


        MarkdownIt.prototype.disable = function (list, ignoreInvalid) {
          var result = [];

          if (!Array.isArray(list)) {
            list = [list];
          }

          ['core', 'block', 'inline'].forEach(function (chain) {
            result = result.concat(this[chain].ruler.disable(list, true));
          }, this);
          result = result.concat(this.inline.ruler2.disable(list, true));
          var missed = list.filter(function (name) {
            return result.indexOf(name) < 0;
          });

          if (missed.length && !ignoreInvalid) {
            throw new Error('MarkdownIt. Failed to disable unknown rule(s): ' + missed);
          }

          return this;
        };
        /** chainable
         * MarkdownIt.use(plugin, params)
         *
         * Load specified plugin with given params into current parser instance.
         * It's just a sugar to call `plugin(md, params)` with curring.
         *
         * ##### Example
         *
         * ```javascript
         * var iterator = require('markdown-it-for-inline');
         * var md = require('markdown-it')()
         *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
         *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
         *             });
         * ```
         **/


        MarkdownIt.prototype.use = function (plugin
        /*, params, ... */
        ) {
          var args = [this].concat(Array.prototype.slice.call(arguments, 1));
          plugin.apply(plugin, args);
          return this;
        };
        /** internal
         * MarkdownIt.parse(src, env) -> Array
         * - src (String): source string
         * - env (Object): environment sandbox
         *
         * Parse input string and returns list of block tokens (special token type
         * "inline" will contain list of inline tokens). You should not call this
         * method directly, until you write custom renderer (for example, to produce
         * AST).
         *
         * `env` is used to pass data between "distributed" rules and return additional
         * metadata like reference info, needed for the renderer. It also can be used to
         * inject data in specific cases. Usually, you will be ok to pass `{}`,
         * and then pass updated object to renderer.
         **/


        MarkdownIt.prototype.parse = function (src, env) {
          if (typeof src !== 'string') {
            throw new Error('Input data should be a String');
          }

          var state = new this.core.State(src, this, env);
          this.core.process(state);
          return state.tokens;
        };
        /**
         * MarkdownIt.render(src [, env]) -> String
         * - src (String): source string
         * - env (Object): environment sandbox
         *
         * Render markdown string into html. It does all magic for you :).
         *
         * `env` can be used to inject additional metadata (`{}` by default).
         * But you will not need it with high probability. See also comment
         * in [[MarkdownIt.parse]].
         **/


        MarkdownIt.prototype.render = function (src, env) {
          env = env || {};
          return this.renderer.render(this.parse(src, env), this.options, env);
        };
        /** internal
         * MarkdownIt.parseInline(src, env) -> Array
         * - src (String): source string
         * - env (Object): environment sandbox
         *
         * The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
         * block tokens list with the single `inline` element, containing parsed inline
         * tokens in `children` property. Also updates `env` object.
         **/


        MarkdownIt.prototype.parseInline = function (src, env) {
          var state = new this.core.State(src, this, env);
          state.inlineMode = true;
          this.core.process(state);
          return state.tokens;
        };
        /**
         * MarkdownIt.renderInline(src [, env]) -> String
         * - src (String): source string
         * - env (Object): environment sandbox
         *
         * Similar to [[MarkdownIt.render]] but for single paragraph content. Result
         * will NOT be wrapped into `<p>` tags.
         **/


        MarkdownIt.prototype.renderInline = function (src, env) {
          env = env || {};
          return this.renderer.render(this.parseInline(src, env), this.options, env);
        };

        module.exports = MarkdownIt;
      }, {
        "./common/utils": 4,
        "./helpers": 5,
        "./parser_block": 10,
        "./parser_core": 11,
        "./parser_inline": 12,
        "./presets/commonmark": 13,
        "./presets/default": 14,
        "./presets/zero": 15,
        "./renderer": 16,
        "linkify-it": 53,
        "mdurl": 58,
        "punycode": 60
      }],
      10: [function (require, module, exports) {

        var Ruler = require('./ruler');

        var _rules = [// First 2 params - rule name & source. Secondary array - list of rules,
        // which can be terminated by this one.
        ['table', require('./rules_block/table'), ['paragraph', 'reference']], ['code', require('./rules_block/code')], ['fence', require('./rules_block/fence'), ['paragraph', 'reference', 'blockquote', 'list']], ['blockquote', require('./rules_block/blockquote'), ['paragraph', 'reference', 'blockquote', 'list']], ['hr', require('./rules_block/hr'), ['paragraph', 'reference', 'blockquote', 'list']], ['list', require('./rules_block/list'), ['paragraph', 'reference', 'blockquote']], ['reference', require('./rules_block/reference')], ['heading', require('./rules_block/heading'), ['paragraph', 'reference', 'blockquote']], ['lheading', require('./rules_block/lheading')], ['html_block', require('./rules_block/html_block'), ['paragraph', 'reference', 'blockquote']], ['paragraph', require('./rules_block/paragraph')]];
        /**
         * new ParserBlock()
         **/

        function ParserBlock() {
          /**
           * ParserBlock#ruler -> Ruler
           *
           * [[Ruler]] instance. Keep configuration of block rules.
           **/
          this.ruler = new Ruler();

          for (var i = 0; i < _rules.length; i++) {
            this.ruler.push(_rules[i][0], _rules[i][1], {
              alt: (_rules[i][2] || []).slice()
            });
          }
        } // Generate tokens for input range
        //


        ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
          var ok,
              i,
              rules = this.ruler.getRules(''),
              len = rules.length,
              line = startLine,
              hasEmptyLines = false,
              maxNesting = state.md.options.maxNesting;

          while (line < endLine) {
            state.line = line = state.skipEmptyLines(line);

            if (line >= endLine) {
              break;
            } // Termination condition for nested calls.
            // Nested calls currently used for blockquotes & lists


            if (state.sCount[line] < state.blkIndent) {
              break;
            } // If nesting level exceeded - skip tail to the end. That's not ordinary
            // situation and we should not care about content.


            if (state.level >= maxNesting) {
              state.line = endLine;
              break;
            } // Try all possible rules.
            // On success, rule should:
            //
            // - update `state.line`
            // - update `state.tokens`
            // - return true


            for (i = 0; i < len; i++) {
              ok = rules[i](state, line, endLine, false);

              if (ok) {
                break;
              }
            } // set state.tight if we had an empty line before current tag
            // i.e. latest empty line should not count


            state.tight = !hasEmptyLines; // paragraph might "eat" one newline after it in nested lists

            if (state.isEmpty(state.line - 1)) {
              hasEmptyLines = true;
            }

            line = state.line;

            if (line < endLine && state.isEmpty(line)) {
              hasEmptyLines = true;
              line++;
              state.line = line;
            }
          }
        };
        /**
         * ParserBlock.parse(str, md, env, outTokens)
         *
         * Process input string and push block tokens into `outTokens`
         **/


        ParserBlock.prototype.parse = function (src, md, env, outTokens) {
          var state;

          if (!src) {
            return;
          }

          state = new this.State(src, md, env, outTokens);
          this.tokenize(state, state.line, state.lineMax);
        };

        ParserBlock.prototype.State = require('./rules_block/state_block');
        module.exports = ParserBlock;
      }, {
        "./ruler": 17,
        "./rules_block/blockquote": 18,
        "./rules_block/code": 19,
        "./rules_block/fence": 20,
        "./rules_block/heading": 21,
        "./rules_block/hr": 22,
        "./rules_block/html_block": 23,
        "./rules_block/lheading": 24,
        "./rules_block/list": 25,
        "./rules_block/paragraph": 26,
        "./rules_block/reference": 27,
        "./rules_block/state_block": 28,
        "./rules_block/table": 29
      }],
      11: [function (require, module, exports) {

        var Ruler = require('./ruler');

        var _rules = [['normalize', require('./rules_core/normalize')], ['block', require('./rules_core/block')], ['inline', require('./rules_core/inline')], ['linkify', require('./rules_core/linkify')], ['replacements', require('./rules_core/replacements')], ['smartquotes', require('./rules_core/smartquotes')]];
        /**
         * new Core()
         **/

        function Core() {
          /**
           * Core#ruler -> Ruler
           *
           * [[Ruler]] instance. Keep configuration of core rules.
           **/
          this.ruler = new Ruler();

          for (var i = 0; i < _rules.length; i++) {
            this.ruler.push(_rules[i][0], _rules[i][1]);
          }
        }
        /**
         * Core.process(state)
         *
         * Executes core chain rules.
         **/


        Core.prototype.process = function (state) {
          var i, l, rules;
          rules = this.ruler.getRules('');

          for (i = 0, l = rules.length; i < l; i++) {
            rules[i](state);
          }
        };

        Core.prototype.State = require('./rules_core/state_core');
        module.exports = Core;
      }, {
        "./ruler": 17,
        "./rules_core/block": 30,
        "./rules_core/inline": 31,
        "./rules_core/linkify": 32,
        "./rules_core/normalize": 33,
        "./rules_core/replacements": 34,
        "./rules_core/smartquotes": 35,
        "./rules_core/state_core": 36
      }],
      12: [function (require, module, exports) {

        var Ruler = require('./ruler'); ////////////////////////////////////////////////////////////////////////////////
        // Parser rules


        var _rules = [['text', require('./rules_inline/text')], ['newline', require('./rules_inline/newline')], ['escape', require('./rules_inline/escape')], ['backticks', require('./rules_inline/backticks')], ['strikethrough', require('./rules_inline/strikethrough').tokenize], ['emphasis', require('./rules_inline/emphasis').tokenize], ['link', require('./rules_inline/link')], ['image', require('./rules_inline/image')], ['autolink', require('./rules_inline/autolink')], ['html_inline', require('./rules_inline/html_inline')], ['entity', require('./rules_inline/entity')]];
        var _rules2 = [['balance_pairs', require('./rules_inline/balance_pairs')], ['strikethrough', require('./rules_inline/strikethrough').postProcess], ['emphasis', require('./rules_inline/emphasis').postProcess], ['text_collapse', require('./rules_inline/text_collapse')]];
        /**
         * new ParserInline()
         **/

        function ParserInline() {
          var i;
          /**
           * ParserInline#ruler -> Ruler
           *
           * [[Ruler]] instance. Keep configuration of inline rules.
           **/

          this.ruler = new Ruler();

          for (i = 0; i < _rules.length; i++) {
            this.ruler.push(_rules[i][0], _rules[i][1]);
          }
          /**
           * ParserInline#ruler2 -> Ruler
           *
           * [[Ruler]] instance. Second ruler used for post-processing
           * (e.g. in emphasis-like rules).
           **/


          this.ruler2 = new Ruler();

          for (i = 0; i < _rules2.length; i++) {
            this.ruler2.push(_rules2[i][0], _rules2[i][1]);
          }
        } // Skip single token by running all rules in validation mode;
        // returns `true` if any rule reported success
        //


        ParserInline.prototype.skipToken = function (state) {
          var ok,
              i,
              pos = state.pos,
              rules = this.ruler.getRules(''),
              len = rules.length,
              maxNesting = state.md.options.maxNesting,
              cache = state.cache;

          if (typeof cache[pos] !== 'undefined') {
            state.pos = cache[pos];
            return;
          }

          if (state.level < maxNesting) {
            for (i = 0; i < len; i++) {
              // Increment state.level and decrement it later to limit recursion.
              // It's harmless to do here, because no tokens are created. But ideally,
              // we'd need a separate private state variable for this purpose.
              //
              state.level++;
              ok = rules[i](state, true);
              state.level--;

              if (ok) {
                break;
              }
            }
          } else {
            // Too much nesting, just skip until the end of the paragraph.
            //
            // NOTE: this will cause links to behave incorrectly in the following case,
            //       when an amount of `[` is exactly equal to `maxNesting + 1`:
            //
            //       [[[[[[[[[[[[[[[[[[[[[foo]()
            //
            // TODO: remove this workaround when CM standard will allow nested links
            //       (we can replace it by preventing links from being parsed in
            //       validation mode)
            //
            state.pos = state.posMax;
          }

          if (!ok) {
            state.pos++;
          }

          cache[pos] = state.pos;
        }; // Generate tokens for input range
        //


        ParserInline.prototype.tokenize = function (state) {
          var ok,
              i,
              rules = this.ruler.getRules(''),
              len = rules.length,
              end = state.posMax,
              maxNesting = state.md.options.maxNesting;

          while (state.pos < end) {
            // Try all possible rules.
            // On success, rule should:
            //
            // - update `state.pos`
            // - update `state.tokens`
            // - return true
            if (state.level < maxNesting) {
              for (i = 0; i < len; i++) {
                ok = rules[i](state, false);

                if (ok) {
                  break;
                }
              }
            }

            if (ok) {
              if (state.pos >= end) {
                break;
              }

              continue;
            }

            state.pending += state.src[state.pos++];
          }

          if (state.pending) {
            state.pushPending();
          }
        };
        /**
         * ParserInline.parse(str, md, env, outTokens)
         *
         * Process input string and push inline tokens into `outTokens`
         **/


        ParserInline.prototype.parse = function (str, md, env, outTokens) {
          var i, rules, len;
          var state = new this.State(str, md, env, outTokens);
          this.tokenize(state);
          rules = this.ruler2.getRules('');
          len = rules.length;

          for (i = 0; i < len; i++) {
            rules[i](state);
          }
        };

        ParserInline.prototype.State = require('./rules_inline/state_inline');
        module.exports = ParserInline;
      }, {
        "./ruler": 17,
        "./rules_inline/autolink": 37,
        "./rules_inline/backticks": 38,
        "./rules_inline/balance_pairs": 39,
        "./rules_inline/emphasis": 40,
        "./rules_inline/entity": 41,
        "./rules_inline/escape": 42,
        "./rules_inline/html_inline": 43,
        "./rules_inline/image": 44,
        "./rules_inline/link": 45,
        "./rules_inline/newline": 46,
        "./rules_inline/state_inline": 47,
        "./rules_inline/strikethrough": 48,
        "./rules_inline/text": 49,
        "./rules_inline/text_collapse": 50
      }],
      13: [function (require, module, exports) {

        module.exports = {
          options: {
            html: true,
            // Enable HTML tags in source
            xhtmlOut: true,
            // Use '/' to close single tags (<br />)
            breaks: false,
            // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-',
            // CSS language prefix for fenced blocks
            linkify: false,
            // autoconvert URL-like texts to links
            // Enable some language-neutral replacements + quotes beautification
            typographer: false,
            // Double + single quotes replacement pairs, when typographer enabled,
            // and smartquotes on. Could be either a String or an Array.
            //
            // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
            // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
            quotes: "\u201C\u201D\u2018\u2019",

            /* “”‘’ */
            // Highlighter function. Should return escaped HTML,
            // or '' if the source string is not changed and should be escaped externaly.
            // If result starts with <pre... internal wrapper is skipped.
            //
            // function (/*str, lang*/) { return ''; }
            //
            highlight: null,
            maxNesting: 20 // Internal protection, recursion limit

          },
          components: {
            core: {
              rules: ['normalize', 'block', 'inline']
            },
            block: {
              rules: ['blockquote', 'code', 'fence', 'heading', 'hr', 'html_block', 'lheading', 'list', 'reference', 'paragraph']
            },
            inline: {
              rules: ['autolink', 'backticks', 'emphasis', 'entity', 'escape', 'html_inline', 'image', 'link', 'newline', 'text'],
              rules2: ['balance_pairs', 'emphasis', 'text_collapse']
            }
          }
        };
      }, {}],
      14: [function (require, module, exports) {

        module.exports = {
          options: {
            html: false,
            // Enable HTML tags in source
            xhtmlOut: false,
            // Use '/' to close single tags (<br />)
            breaks: false,
            // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-',
            // CSS language prefix for fenced blocks
            linkify: false,
            // autoconvert URL-like texts to links
            // Enable some language-neutral replacements + quotes beautification
            typographer: false,
            // Double + single quotes replacement pairs, when typographer enabled,
            // and smartquotes on. Could be either a String or an Array.
            //
            // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
            // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
            quotes: "\u201C\u201D\u2018\u2019",

            /* “”‘’ */
            // Highlighter function. Should return escaped HTML,
            // or '' if the source string is not changed and should be escaped externaly.
            // If result starts with <pre... internal wrapper is skipped.
            //
            // function (/*str, lang*/) { return ''; }
            //
            highlight: null,
            maxNesting: 100 // Internal protection, recursion limit

          },
          components: {
            core: {},
            block: {},
            inline: {}
          }
        };
      }, {}],
      15: [function (require, module, exports) {

        module.exports = {
          options: {
            html: false,
            // Enable HTML tags in source
            xhtmlOut: false,
            // Use '/' to close single tags (<br />)
            breaks: false,
            // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-',
            // CSS language prefix for fenced blocks
            linkify: false,
            // autoconvert URL-like texts to links
            // Enable some language-neutral replacements + quotes beautification
            typographer: false,
            // Double + single quotes replacement pairs, when typographer enabled,
            // and smartquotes on. Could be either a String or an Array.
            //
            // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
            // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
            quotes: "\u201C\u201D\u2018\u2019",

            /* “”‘’ */
            // Highlighter function. Should return escaped HTML,
            // or '' if the source string is not changed and should be escaped externaly.
            // If result starts with <pre... internal wrapper is skipped.
            //
            // function (/*str, lang*/) { return ''; }
            //
            highlight: null,
            maxNesting: 20 // Internal protection, recursion limit

          },
          components: {
            core: {
              rules: ['normalize', 'block', 'inline']
            },
            block: {
              rules: ['paragraph']
            },
            inline: {
              rules: ['text'],
              rules2: ['balance_pairs', 'text_collapse']
            }
          }
        };
      }, {}],
      16: [function (require, module, exports) {

        var assign = require('./common/utils').assign;

        var unescapeAll = require('./common/utils').unescapeAll;

        var escapeHtml = require('./common/utils').escapeHtml; ////////////////////////////////////////////////////////////////////////////////


        var default_rules = {};

        default_rules.code_inline = function (tokens, idx, options, env, slf) {
          var token = tokens[idx];
          return '<code' + slf.renderAttrs(token) + '>' + escapeHtml(tokens[idx].content) + '</code>';
        };

        default_rules.code_block = function (tokens, idx, options, env, slf) {
          var token = tokens[idx];
          return '<pre' + slf.renderAttrs(token) + '><code>' + escapeHtml(tokens[idx].content) + '</code></pre>\n';
        };

        default_rules.fence = function (tokens, idx, options, env, slf) {
          var token = tokens[idx],
              info = token.info ? unescapeAll(token.info).trim() : '',
              langName = '',
              highlighted,
              i,
              tmpAttrs,
              tmpToken;

          if (info) {
            langName = info.split(/\s+/g)[0];
          }

          if (options.highlight) {
            highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
          } else {
            highlighted = escapeHtml(token.content);
          }

          if (highlighted.indexOf('<pre') === 0) {
            return highlighted + '\n';
          } // If language exists, inject class gently, without modifying original token.
          // May be, one day we will add .clone() for token and simplify this part, but
          // now we prefer to keep things local.


          if (info) {
            i = token.attrIndex('class');
            tmpAttrs = token.attrs ? token.attrs.slice() : [];

            if (i < 0) {
              tmpAttrs.push(['class', options.langPrefix + langName]);
            } else {
              tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
            } // Fake token just to render attributes


            tmpToken = {
              attrs: tmpAttrs
            };
            return '<pre><code' + slf.renderAttrs(tmpToken) + '>' + highlighted + '</code></pre>\n';
          }

          return '<pre><code' + slf.renderAttrs(token) + '>' + highlighted + '</code></pre>\n';
        };

        default_rules.image = function (tokens, idx, options, env, slf) {
          var token = tokens[idx]; // "alt" attr MUST be set, even if empty. Because it's mandatory and
          // should be placed on proper position for tests.
          //
          // Replace content with actual value

          token.attrs[token.attrIndex('alt')][1] = slf.renderInlineAsText(token.children, options, env);
          return slf.renderToken(tokens, idx, options);
        };

        default_rules.hardbreak = function (tokens, idx, options
        /*, env */
        ) {
          return options.xhtmlOut ? '<br />\n' : '<br>\n';
        };

        default_rules.softbreak = function (tokens, idx, options
        /*, env */
        ) {
          return options.breaks ? options.xhtmlOut ? '<br />\n' : '<br>\n' : '\n';
        };

        default_rules.text = function (tokens, idx
        /*, options, env */
        ) {
          return escapeHtml(tokens[idx].content);
        };

        default_rules.html_block = function (tokens, idx
        /*, options, env */
        ) {
          return tokens[idx].content;
        };

        default_rules.html_inline = function (tokens, idx
        /*, options, env */
        ) {
          return tokens[idx].content;
        };
        /**
         * new Renderer()
         *
         * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
         **/


        function Renderer() {
          /**
           * Renderer#rules -> Object
           *
           * Contains render rules for tokens. Can be updated and extended.
           *
           * ##### Example
           *
           * ```javascript
           * var md = require('markdown-it')();
           *
           * md.renderer.rules.strong_open  = function () { return '<b>'; };
           * md.renderer.rules.strong_close = function () { return '</b>'; };
           *
           * var result = md.renderInline(...);
           * ```
           *
           * Each rule is called as independent static function with fixed signature:
           *
           * ```javascript
           * function my_token_render(tokens, idx, options, env, renderer) {
           *   // ...
           *   return renderedHTML;
           * }
           * ```
           *
           * See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
           * for more details and examples.
           **/
          this.rules = assign({}, default_rules);
        }
        /**
         * Renderer.renderAttrs(token) -> String
         *
         * Render token attributes to string.
         **/


        Renderer.prototype.renderAttrs = function renderAttrs(token) {
          var i, l, result;

          if (!token.attrs) {
            return '';
          }

          result = '';

          for (i = 0, l = token.attrs.length; i < l; i++) {
            result += ' ' + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
          }

          return result;
        };
        /**
         * Renderer.renderToken(tokens, idx, options) -> String
         * - tokens (Array): list of tokens
         * - idx (Numbed): token index to render
         * - options (Object): params of parser instance
         *
         * Default token renderer. Can be overriden by custom function
         * in [[Renderer#rules]].
         **/


        Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
          var nextToken,
              result = '',
              needLf = false,
              token = tokens[idx]; // Tight list paragraphs

          if (token.hidden) {
            return '';
          } // Insert a newline between hidden paragraph and subsequent opening
          // block-level tag.
          //
          // For example, here we should insert a newline before blockquote:
          //  - a
          //    >
          //


          if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
            result += '\n';
          } // Add token name, e.g. `<img`


          result += (token.nesting === -1 ? '</' : '<') + token.tag; // Encode attributes, e.g. `<img src="foo"`

          result += this.renderAttrs(token); // Add a slash for self-closing tags, e.g. `<img src="foo" /`

          if (token.nesting === 0 && options.xhtmlOut) {
            result += ' /';
          } // Check if we need to add a newline after this tag


          if (token.block) {
            needLf = true;

            if (token.nesting === 1) {
              if (idx + 1 < tokens.length) {
                nextToken = tokens[idx + 1];

                if (nextToken.type === 'inline' || nextToken.hidden) {
                  // Block-level tag containing an inline tag.
                  //
                  needLf = false;
                } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
                  // Opening tag + closing tag of the same type. E.g. `<li></li>`.
                  //
                  needLf = false;
                }
              }
            }
          }

          result += needLf ? '>\n' : '>';
          return result;
        };
        /**
         * Renderer.renderInline(tokens, options, env) -> String
         * - tokens (Array): list on block tokens to renter
         * - options (Object): params of parser instance
         * - env (Object): additional data from parsed input (references, for example)
         *
         * The same as [[Renderer.render]], but for single token of `inline` type.
         **/


        Renderer.prototype.renderInline = function (tokens, options, env) {
          var type,
              result = '',
              rules = this.rules;

          for (var i = 0, len = tokens.length; i < len; i++) {
            type = tokens[i].type;

            if (typeof rules[type] !== 'undefined') {
              result += rules[type](tokens, i, options, env, this);
            } else {
              result += this.renderToken(tokens, i, options);
            }
          }

          return result;
        };
        /** internal
         * Renderer.renderInlineAsText(tokens, options, env) -> String
         * - tokens (Array): list on block tokens to renter
         * - options (Object): params of parser instance
         * - env (Object): additional data from parsed input (references, for example)
         *
         * Special kludge for image `alt` attributes to conform CommonMark spec.
         * Don't try to use it! Spec requires to show `alt` content with stripped markup,
         * instead of simple escaping.
         **/


        Renderer.prototype.renderInlineAsText = function (tokens, options, env) {
          var result = '';

          for (var i = 0, len = tokens.length; i < len; i++) {
            if (tokens[i].type === 'text') {
              result += tokens[i].content;
            } else if (tokens[i].type === 'image') {
              result += this.renderInlineAsText(tokens[i].children, options, env);
            }
          }

          return result;
        };
        /**
         * Renderer.render(tokens, options, env) -> String
         * - tokens (Array): list on block tokens to renter
         * - options (Object): params of parser instance
         * - env (Object): additional data from parsed input (references, for example)
         *
         * Takes token stream and generates HTML. Probably, you will never need to call
         * this method directly.
         **/


        Renderer.prototype.render = function (tokens, options, env) {
          var i,
              len,
              type,
              result = '',
              rules = this.rules;

          for (i = 0, len = tokens.length; i < len; i++) {
            type = tokens[i].type;

            if (type === 'inline') {
              result += this.renderInline(tokens[i].children, options, env);
            } else if (typeof rules[type] !== 'undefined') {
              result += rules[tokens[i].type](tokens, i, options, env, this);
            } else {
              result += this.renderToken(tokens, i, options, env);
            }
          }

          return result;
        };

        module.exports = Renderer;
      }, {
        "./common/utils": 4
      }],
      17: [function (require, module, exports) {
        /**
         * new Ruler()
         **/

        function Ruler() {
          // List of added rules. Each element is:
          //
          // {
          //   name: XXX,
          //   enabled: Boolean,
          //   fn: Function(),
          //   alt: [ name2, name3 ]
          // }
          //
          this.__rules__ = []; // Cached rule chains.
          //
          // First level - chain name, '' for default.
          // Second level - diginal anchor for fast filtering by charcodes.
          //

          this.__cache__ = null;
        } ////////////////////////////////////////////////////////////////////////////////
        // Helper methods, should not be used directly
        // Find rule index by name
        //


        Ruler.prototype.__find__ = function (name) {
          for (var i = 0; i < this.__rules__.length; i++) {
            if (this.__rules__[i].name === name) {
              return i;
            }
          }

          return -1;
        }; // Build rules lookup cache
        //


        Ruler.prototype.__compile__ = function () {
          var self = this;
          var chains = ['']; // collect unique names

          self.__rules__.forEach(function (rule) {
            if (!rule.enabled) {
              return;
            }

            rule.alt.forEach(function (altName) {
              if (chains.indexOf(altName) < 0) {
                chains.push(altName);
              }
            });
          });

          self.__cache__ = {};
          chains.forEach(function (chain) {
            self.__cache__[chain] = [];

            self.__rules__.forEach(function (rule) {
              if (!rule.enabled) {
                return;
              }

              if (chain && rule.alt.indexOf(chain) < 0) {
                return;
              }

              self.__cache__[chain].push(rule.fn);
            });
          });
        };
        /**
         * Ruler.at(name, fn [, options])
         * - name (String): rule name to replace.
         * - fn (Function): new rule function.
         * - options (Object): new rule options (not mandatory).
         *
         * Replace rule by name with new function & options. Throws error if name not
         * found.
         *
         * ##### Options:
         *
         * - __alt__ - array with names of "alternate" chains.
         *
         * ##### Example
         *
         * Replace existing typographer replacement rule with new one:
         *
         * ```javascript
         * var md = require('markdown-it')();
         *
         * md.core.ruler.at('replacements', function replace(state) {
         *   //...
         * });
         * ```
         **/


        Ruler.prototype.at = function (name, fn, options) {
          var index = this.__find__(name);

          var opt = options || {};

          if (index === -1) {
            throw new Error('Parser rule not found: ' + name);
          }

          this.__rules__[index].fn = fn;
          this.__rules__[index].alt = opt.alt || [];
          this.__cache__ = null;
        };
        /**
         * Ruler.before(beforeName, ruleName, fn [, options])
         * - beforeName (String): new rule will be added before this one.
         * - ruleName (String): name of added rule.
         * - fn (Function): rule function.
         * - options (Object): rule options (not mandatory).
         *
         * Add new rule to chain before one with given name. See also
         * [[Ruler.after]], [[Ruler.push]].
         *
         * ##### Options:
         *
         * - __alt__ - array with names of "alternate" chains.
         *
         * ##### Example
         *
         * ```javascript
         * var md = require('markdown-it')();
         *
         * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
         *   //...
         * });
         * ```
         **/


        Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
          var index = this.__find__(beforeName);

          var opt = options || {};

          if (index === -1) {
            throw new Error('Parser rule not found: ' + beforeName);
          }

          this.__rules__.splice(index, 0, {
            name: ruleName,
            enabled: true,
            fn: fn,
            alt: opt.alt || []
          });

          this.__cache__ = null;
        };
        /**
         * Ruler.after(afterName, ruleName, fn [, options])
         * - afterName (String): new rule will be added after this one.
         * - ruleName (String): name of added rule.
         * - fn (Function): rule function.
         * - options (Object): rule options (not mandatory).
         *
         * Add new rule to chain after one with given name. See also
         * [[Ruler.before]], [[Ruler.push]].
         *
         * ##### Options:
         *
         * - __alt__ - array with names of "alternate" chains.
         *
         * ##### Example
         *
         * ```javascript
         * var md = require('markdown-it')();
         *
         * md.inline.ruler.after('text', 'my_rule', function replace(state) {
         *   //...
         * });
         * ```
         **/


        Ruler.prototype.after = function (afterName, ruleName, fn, options) {
          var index = this.__find__(afterName);

          var opt = options || {};

          if (index === -1) {
            throw new Error('Parser rule not found: ' + afterName);
          }

          this.__rules__.splice(index + 1, 0, {
            name: ruleName,
            enabled: true,
            fn: fn,
            alt: opt.alt || []
          });

          this.__cache__ = null;
        };
        /**
         * Ruler.push(ruleName, fn [, options])
         * - ruleName (String): name of added rule.
         * - fn (Function): rule function.
         * - options (Object): rule options (not mandatory).
         *
         * Push new rule to the end of chain. See also
         * [[Ruler.before]], [[Ruler.after]].
         *
         * ##### Options:
         *
         * - __alt__ - array with names of "alternate" chains.
         *
         * ##### Example
         *
         * ```javascript
         * var md = require('markdown-it')();
         *
         * md.core.ruler.push('my_rule', function replace(state) {
         *   //...
         * });
         * ```
         **/


        Ruler.prototype.push = function (ruleName, fn, options) {
          var opt = options || {};

          this.__rules__.push({
            name: ruleName,
            enabled: true,
            fn: fn,
            alt: opt.alt || []
          });

          this.__cache__ = null;
        };
        /**
         * Ruler.enable(list [, ignoreInvalid]) -> Array
         * - list (String|Array): list of rule names to enable.
         * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
         *
         * Enable rules with given names. If any rule name not found - throw Error.
         * Errors can be disabled by second param.
         *
         * Returns list of found rule names (if no exception happened).
         *
         * See also [[Ruler.disable]], [[Ruler.enableOnly]].
         **/


        Ruler.prototype.enable = function (list, ignoreInvalid) {
          if (!Array.isArray(list)) {
            list = [list];
          }

          var result = []; // Search by name and enable

          list.forEach(function (name) {
            var idx = this.__find__(name);

            if (idx < 0) {
              if (ignoreInvalid) {
                return;
              }

              throw new Error('Rules manager: invalid rule name ' + name);
            }

            this.__rules__[idx].enabled = true;
            result.push(name);
          }, this);
          this.__cache__ = null;
          return result;
        };
        /**
         * Ruler.enableOnly(list [, ignoreInvalid])
         * - list (String|Array): list of rule names to enable (whitelist).
         * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
         *
         * Enable rules with given names, and disable everything else. If any rule name
         * not found - throw Error. Errors can be disabled by second param.
         *
         * See also [[Ruler.disable]], [[Ruler.enable]].
         **/


        Ruler.prototype.enableOnly = function (list, ignoreInvalid) {
          if (!Array.isArray(list)) {
            list = [list];
          }

          this.__rules__.forEach(function (rule) {
            rule.enabled = false;
          });

          this.enable(list, ignoreInvalid);
        };
        /**
         * Ruler.disable(list [, ignoreInvalid]) -> Array
         * - list (String|Array): list of rule names to disable.
         * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
         *
         * Disable rules with given names. If any rule name not found - throw Error.
         * Errors can be disabled by second param.
         *
         * Returns list of found rule names (if no exception happened).
         *
         * See also [[Ruler.enable]], [[Ruler.enableOnly]].
         **/


        Ruler.prototype.disable = function (list, ignoreInvalid) {
          if (!Array.isArray(list)) {
            list = [list];
          }

          var result = []; // Search by name and disable

          list.forEach(function (name) {
            var idx = this.__find__(name);

            if (idx < 0) {
              if (ignoreInvalid) {
                return;
              }

              throw new Error('Rules manager: invalid rule name ' + name);
            }

            this.__rules__[idx].enabled = false;
            result.push(name);
          }, this);
          this.__cache__ = null;
          return result;
        };
        /**
         * Ruler.getRules(chainName) -> Array
         *
         * Return array of active functions (rules) for given chain name. It analyzes
         * rules configuration, compiles caches if not exists and returns result.
         *
         * Default chain name is `''` (empty string). It can't be skipped. That's
         * done intentionally, to keep signature monomorphic for high speed.
         **/


        Ruler.prototype.getRules = function (chainName) {
          if (this.__cache__ === null) {
            this.__compile__();
          } // Chain can be empty, if rules disabled. But we still have to return Array.


          return this.__cache__[chainName] || [];
        };

        module.exports = Ruler;
      }, {}],
      18: [function (require, module, exports) {

        var isSpace = require('../common/utils').isSpace;

        module.exports = function blockquote(state, startLine, endLine, silent) {
          var adjustTab,
              ch,
              i,
              initial,
              l,
              lastLineEmpty,
              lines,
              nextLine,
              offset,
              oldBMarks,
              oldBSCount,
              oldIndent,
              oldParentType,
              oldSCount,
              oldTShift,
              spaceAfterMarker,
              terminate,
              terminatorRules,
              token,
              wasOutdented,
              oldLineMax = state.lineMax,
              pos = state.bMarks[startLine] + state.tShift[startLine],
              max = state.eMarks[startLine]; // if it's indented more than 3 spaces, it should be a code block

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          } // check the block quote marker


          if (state.src.charCodeAt(pos++) !== 0x3E
          /* > */
          ) {
            return false;
          } // we know that it's going to be a valid blockquote,
          // so no point trying to find the end of it in silent mode


          if (silent) {
            return true;
          } // skip spaces after ">" and re-calculate offset


          initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]); // skip one optional space after '>'

          if (state.src.charCodeAt(pos) === 0x20
          /* space */
          ) {
            // ' >   test '
            //     ^ -- position start of line here:
            pos++;
            initial++;
            offset++;
            adjustTab = false;
            spaceAfterMarker = true;
          } else if (state.src.charCodeAt(pos) === 0x09
          /* tab */
          ) {
            spaceAfterMarker = true;

            if ((state.bsCount[startLine] + offset) % 4 === 3) {
              // '  >\t  test '
              //       ^ -- position start of line here (tab has width===1)
              pos++;
              initial++;
              offset++;
              adjustTab = false;
            } else {
              // ' >\t  test '
              //    ^ -- position start of line here + shift bsCount slightly
              //         to make extra space appear
              adjustTab = true;
            }
          } else {
            spaceAfterMarker = false;
          }

          oldBMarks = [state.bMarks[startLine]];
          state.bMarks[startLine] = pos;

          while (pos < max) {
            ch = state.src.charCodeAt(pos);

            if (isSpace(ch)) {
              if (ch === 0x09) {
                offset += 4 - (offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4;
              } else {
                offset++;
              }
            } else {
              break;
            }

            pos++;
          }

          oldBSCount = [state.bsCount[startLine]];
          state.bsCount[startLine] = state.sCount[startLine] + 1 + (spaceAfterMarker ? 1 : 0);
          lastLineEmpty = pos >= max;
          oldSCount = [state.sCount[startLine]];
          state.sCount[startLine] = offset - initial;
          oldTShift = [state.tShift[startLine]];
          state.tShift[startLine] = pos - state.bMarks[startLine];
          terminatorRules = state.md.block.ruler.getRules('blockquote');
          oldParentType = state.parentType;
          state.parentType = 'blockquote';
          wasOutdented = false; // Search the end of the block
          //
          // Block ends with either:
          //  1. an empty line outside:
          //     ```
          //     > test
          //
          //     ```
          //  2. an empty line inside:
          //     ```
          //     >
          //     test
          //     ```
          //  3. another tag:
          //     ```
          //     > test
          //      - - -
          //     ```

          for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
            // check if it's outdented, i.e. it's inside list item and indented
            // less than said list item:
            //
            // ```
            // 1. anything
            //    > current blockquote
            // 2. checking this line
            // ```
            if (state.sCount[nextLine] < state.blkIndent) wasOutdented = true;
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];

            if (pos >= max) {
              // Case 1: line is not inside the blockquote, and this line is empty.
              break;
            }

            if (state.src.charCodeAt(pos++) === 0x3E
            /* > */
            && !wasOutdented) {
              // This line is inside the blockquote.
              // skip spaces after ">" and re-calculate offset
              initial = offset = state.sCount[nextLine] + pos - (state.bMarks[nextLine] + state.tShift[nextLine]); // skip one optional space after '>'

              if (state.src.charCodeAt(pos) === 0x20
              /* space */
              ) {
                // ' >   test '
                //     ^ -- position start of line here:
                pos++;
                initial++;
                offset++;
                adjustTab = false;
                spaceAfterMarker = true;
              } else if (state.src.charCodeAt(pos) === 0x09
              /* tab */
              ) {
                spaceAfterMarker = true;

                if ((state.bsCount[nextLine] + offset) % 4 === 3) {
                  // '  >\t  test '
                  //       ^ -- position start of line here (tab has width===1)
                  pos++;
                  initial++;
                  offset++;
                  adjustTab = false;
                } else {
                  // ' >\t  test '
                  //    ^ -- position start of line here + shift bsCount slightly
                  //         to make extra space appear
                  adjustTab = true;
                }
              } else {
                spaceAfterMarker = false;
              }

              oldBMarks.push(state.bMarks[nextLine]);
              state.bMarks[nextLine] = pos;

              while (pos < max) {
                ch = state.src.charCodeAt(pos);

                if (isSpace(ch)) {
                  if (ch === 0x09) {
                    offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
                  } else {
                    offset++;
                  }
                } else {
                  break;
                }

                pos++;
              }

              lastLineEmpty = pos >= max;
              oldBSCount.push(state.bsCount[nextLine]);
              state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
              oldSCount.push(state.sCount[nextLine]);
              state.sCount[nextLine] = offset - initial;
              oldTShift.push(state.tShift[nextLine]);
              state.tShift[nextLine] = pos - state.bMarks[nextLine];
              continue;
            } // Case 2: line is not inside the blockquote, and the last line was empty.


            if (lastLineEmpty) {
              break;
            } // Case 3: another tag found.


            terminate = false;

            for (i = 0, l = terminatorRules.length; i < l; i++) {
              if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
              }
            }

            if (terminate) {
              // Quirk to enforce "hard termination mode" for paragraphs;
              // normally if you call `tokenize(state, startLine, nextLine)`,
              // paragraphs will look below nextLine for paragraph continuation,
              // but if blockquote is terminated by another tag, they shouldn't
              state.lineMax = nextLine;

              if (state.blkIndent !== 0) {
                // state.blkIndent was non-zero, we now set it to zero,
                // so we need to re-calculate all offsets to appear as
                // if indent wasn't changed
                oldBMarks.push(state.bMarks[nextLine]);
                oldBSCount.push(state.bsCount[nextLine]);
                oldTShift.push(state.tShift[nextLine]);
                oldSCount.push(state.sCount[nextLine]);
                state.sCount[nextLine] -= state.blkIndent;
              }

              break;
            }

            oldBMarks.push(state.bMarks[nextLine]);
            oldBSCount.push(state.bsCount[nextLine]);
            oldTShift.push(state.tShift[nextLine]);
            oldSCount.push(state.sCount[nextLine]); // A negative indentation means that this is a paragraph continuation
            //

            state.sCount[nextLine] = -1;
          }

          oldIndent = state.blkIndent;
          state.blkIndent = 0;
          token = state.push('blockquote_open', 'blockquote', 1);
          token.markup = '>';
          token.map = lines = [startLine, 0];
          state.md.block.tokenize(state, startLine, nextLine);
          token = state.push('blockquote_close', 'blockquote', -1);
          token.markup = '>';
          state.lineMax = oldLineMax;
          state.parentType = oldParentType;
          lines[1] = state.line; // Restore original tShift; this might not be necessary since the parser
          // has already been here, but just to make sure we can do that.

          for (i = 0; i < oldTShift.length; i++) {
            state.bMarks[i + startLine] = oldBMarks[i];
            state.tShift[i + startLine] = oldTShift[i];
            state.sCount[i + startLine] = oldSCount[i];
            state.bsCount[i + startLine] = oldBSCount[i];
          }

          state.blkIndent = oldIndent;
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      19: [function (require, module, exports) {

        module.exports = function code(state, startLine, endLine
        /*, silent*/
        ) {
          var nextLine, last, token;

          if (state.sCount[startLine] - state.blkIndent < 4) {
            return false;
          }

          last = nextLine = startLine + 1;

          while (nextLine < endLine) {
            if (state.isEmpty(nextLine)) {
              nextLine++;
              continue;
            }

            if (state.sCount[nextLine] - state.blkIndent >= 4) {
              nextLine++;
              last = nextLine;
              continue;
            }

            break;
          }

          state.line = last;
          token = state.push('code_block', 'code', 0);
          token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
          token.map = [startLine, state.line];
          return true;
        };
      }, {}],
      20: [function (require, module, exports) {

        module.exports = function fence(state, startLine, endLine, silent) {
          var marker,
              len,
              params,
              nextLine,
              mem,
              token,
              markup,
              haveEndMarker = false,
              pos = state.bMarks[startLine] + state.tShift[startLine],
              max = state.eMarks[startLine]; // if it's indented more than 3 spaces, it should be a code block

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          }

          if (pos + 3 > max) {
            return false;
          }

          marker = state.src.charCodeAt(pos);

          if (marker !== 0x7E
          /* ~ */
          && marker !== 0x60
          /* ` */
          ) {
            return false;
          } // scan marker length


          mem = pos;
          pos = state.skipChars(pos, marker);
          len = pos - mem;

          if (len < 3) {
            return false;
          }

          markup = state.src.slice(mem, pos);
          params = state.src.slice(pos, max);

          if (marker === 0x60
          /* ` */
          ) {
            if (params.indexOf(String.fromCharCode(marker)) >= 0) {
              return false;
            }
          } // Since start is found, we can report success here in validation mode


          if (silent) {
            return true;
          } // search end of block


          nextLine = startLine;

          for (;;) {
            nextLine++;

            if (nextLine >= endLine) {
              // unclosed block should be autoclosed by end of document.
              // also block seems to be autoclosed by end of parent
              break;
            }

            pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];

            if (pos < max && state.sCount[nextLine] < state.blkIndent) {
              // non-empty line with negative indent should stop the list:
              // - ```
              //  test
              break;
            }

            if (state.src.charCodeAt(pos) !== marker) {
              continue;
            }

            if (state.sCount[nextLine] - state.blkIndent >= 4) {
              // closing fence should be indented less than 4 spaces
              continue;
            }

            pos = state.skipChars(pos, marker); // closing code fence must be at least as long as the opening one

            if (pos - mem < len) {
              continue;
            } // make sure tail has spaces only


            pos = state.skipSpaces(pos);

            if (pos < max) {
              continue;
            }

            haveEndMarker = true; // found!

            break;
          } // If a fence has heading spaces, they should be removed from its inner block


          len = state.sCount[startLine];
          state.line = nextLine + (haveEndMarker ? 1 : 0);
          token = state.push('fence', 'code', 0);
          token.info = params;
          token.content = state.getLines(startLine + 1, nextLine, len, true);
          token.markup = markup;
          token.map = [startLine, state.line];
          return true;
        };
      }, {}],
      21: [function (require, module, exports) {

        var isSpace = require('../common/utils').isSpace;

        module.exports = function heading(state, startLine, endLine, silent) {
          var ch,
              level,
              tmp,
              token,
              pos = state.bMarks[startLine] + state.tShift[startLine],
              max = state.eMarks[startLine]; // if it's indented more than 3 spaces, it should be a code block

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          }

          ch = state.src.charCodeAt(pos);

          if (ch !== 0x23
          /* # */
          || pos >= max) {
            return false;
          } // count heading level


          level = 1;
          ch = state.src.charCodeAt(++pos);

          while (ch === 0x23
          /* # */
          && pos < max && level <= 6) {
            level++;
            ch = state.src.charCodeAt(++pos);
          }

          if (level > 6 || pos < max && !isSpace(ch)) {
            return false;
          }

          if (silent) {
            return true;
          } // Let's cut tails like '    ###  ' from the end of string


          max = state.skipSpacesBack(max, pos);
          tmp = state.skipCharsBack(max, 0x23, pos); // #

          if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
            max = tmp;
          }

          state.line = startLine + 1;
          token = state.push('heading_open', 'h' + String(level), 1);
          token.markup = '########'.slice(0, level);
          token.map = [startLine, state.line];
          token = state.push('inline', '', 0);
          token.content = state.src.slice(pos, max).trim();
          token.map = [startLine, state.line];
          token.children = [];
          token = state.push('heading_close', 'h' + String(level), -1);
          token.markup = '########'.slice(0, level);
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      22: [function (require, module, exports) {

        var isSpace = require('../common/utils').isSpace;

        module.exports = function hr(state, startLine, endLine, silent) {
          var marker,
              cnt,
              ch,
              token,
              pos = state.bMarks[startLine] + state.tShift[startLine],
              max = state.eMarks[startLine]; // if it's indented more than 3 spaces, it should be a code block

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          }

          marker = state.src.charCodeAt(pos++); // Check hr marker

          if (marker !== 0x2A
          /* * */
          && marker !== 0x2D
          /* - */
          && marker !== 0x5F
          /* _ */
          ) {
            return false;
          } // markers can be mixed with spaces, but there should be at least 3 of them


          cnt = 1;

          while (pos < max) {
            ch = state.src.charCodeAt(pos++);

            if (ch !== marker && !isSpace(ch)) {
              return false;
            }

            if (ch === marker) {
              cnt++;
            }
          }

          if (cnt < 3) {
            return false;
          }

          if (silent) {
            return true;
          }

          state.line = startLine + 1;
          token = state.push('hr', 'hr', 0);
          token.map = [startLine, state.line];
          token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      23: [function (require, module, exports) {

        var block_names = require('../common/html_blocks');

        var HTML_OPEN_CLOSE_TAG_RE = require('../common/html_re').HTML_OPEN_CLOSE_TAG_RE; // An array of opening and corresponding closing sequences for html tags,
        // last argument defines whether it can terminate a paragraph or not
        //


        var HTML_SEQUENCES = [[/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true], [/^<!--/, /-->/, true], [/^<\?/, /\?>/, true], [/^<![A-Z]/, />/, true], [/^<!\[CDATA\[/, /\]\]>/, true], [new RegExp('^</?(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true], [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + '\\s*$'), /^$/, false]];

        module.exports = function html_block(state, startLine, endLine, silent) {
          var i,
              nextLine,
              token,
              lineText,
              pos = state.bMarks[startLine] + state.tShift[startLine],
              max = state.eMarks[startLine]; // if it's indented more than 3 spaces, it should be a code block

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          }

          if (!state.md.options.html) {
            return false;
          }

          if (state.src.charCodeAt(pos) !== 0x3C
          /* < */
          ) {
            return false;
          }

          lineText = state.src.slice(pos, max);

          for (i = 0; i < HTML_SEQUENCES.length; i++) {
            if (HTML_SEQUENCES[i][0].test(lineText)) {
              break;
            }
          }

          if (i === HTML_SEQUENCES.length) {
            return false;
          }

          if (silent) {
            // true if this sequence can be a terminator, false otherwise
            return HTML_SEQUENCES[i][2];
          }

          nextLine = startLine + 1; // If we are here - we detected HTML block.
          // Let's roll down till block end.

          if (!HTML_SEQUENCES[i][1].test(lineText)) {
            for (; nextLine < endLine; nextLine++) {
              if (state.sCount[nextLine] < state.blkIndent) {
                break;
              }

              pos = state.bMarks[nextLine] + state.tShift[nextLine];
              max = state.eMarks[nextLine];
              lineText = state.src.slice(pos, max);

              if (HTML_SEQUENCES[i][1].test(lineText)) {
                if (lineText.length !== 0) {
                  nextLine++;
                }

                break;
              }
            }
          }

          state.line = nextLine;
          token = state.push('html_block', '', 0);
          token.map = [startLine, nextLine];
          token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
          return true;
        };
      }, {
        "../common/html_blocks": 2,
        "../common/html_re": 3
      }],
      24: [function (require, module, exports) {

        module.exports = function lheading(state, startLine, endLine
        /*, silent*/
        ) {
          var content,
              terminate,
              i,
              l,
              token,
              pos,
              max,
              level,
              marker,
              nextLine = startLine + 1,
              oldParentType,
              terminatorRules = state.md.block.ruler.getRules('paragraph'); // if it's indented more than 3 spaces, it should be a code block

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          }

          oldParentType = state.parentType;
          state.parentType = 'paragraph'; // use paragraph to match terminatorRules
          // jump line-by-line until empty one or EOF

          for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
            // this would be a code block normally, but after paragraph
            // it's considered a lazy continuation regardless of what's there
            if (state.sCount[nextLine] - state.blkIndent > 3) {
              continue;
            } //
            // Check for underline in setext header
            //


            if (state.sCount[nextLine] >= state.blkIndent) {
              pos = state.bMarks[nextLine] + state.tShift[nextLine];
              max = state.eMarks[nextLine];

              if (pos < max) {
                marker = state.src.charCodeAt(pos);

                if (marker === 0x2D
                /* - */
                || marker === 0x3D
                /* = */
                ) {
                  pos = state.skipChars(pos, marker);
                  pos = state.skipSpaces(pos);

                  if (pos >= max) {
                    level = marker === 0x3D
                    /* = */
                    ? 1 : 2;
                    break;
                  }
                }
              }
            } // quirk for blockquotes, this line should already be checked by that rule


            if (state.sCount[nextLine] < 0) {
              continue;
            } // Some tags can terminate paragraph without empty line.


            terminate = false;

            for (i = 0, l = terminatorRules.length; i < l; i++) {
              if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
              }
            }

            if (terminate) {
              break;
            }
          }

          if (!level) {
            // Didn't find valid underline
            return false;
          }

          content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
          state.line = nextLine + 1;
          token = state.push('heading_open', 'h' + String(level), 1);
          token.markup = String.fromCharCode(marker);
          token.map = [startLine, state.line];
          token = state.push('inline', '', 0);
          token.content = content;
          token.map = [startLine, state.line - 1];
          token.children = [];
          token = state.push('heading_close', 'h' + String(level), -1);
          token.markup = String.fromCharCode(marker);
          state.parentType = oldParentType;
          return true;
        };
      }, {}],
      25: [function (require, module, exports) {

        var isSpace = require('../common/utils').isSpace; // Search `[-+*][\n ]`, returns next pos after marker on success
        // or -1 on fail.


        function skipBulletListMarker(state, startLine) {
          var marker, pos, max, ch;
          pos = state.bMarks[startLine] + state.tShift[startLine];
          max = state.eMarks[startLine];
          marker = state.src.charCodeAt(pos++); // Check bullet

          if (marker !== 0x2A
          /* * */
          && marker !== 0x2D
          /* - */
          && marker !== 0x2B
          /* + */
          ) {
            return -1;
          }

          if (pos < max) {
            ch = state.src.charCodeAt(pos);

            if (!isSpace(ch)) {
              // " -test " - is not a list item
              return -1;
            }
          }

          return pos;
        } // Search `\d+[.)][\n ]`, returns next pos after marker on success
        // or -1 on fail.


        function skipOrderedListMarker(state, startLine) {
          var ch,
              start = state.bMarks[startLine] + state.tShift[startLine],
              pos = start,
              max = state.eMarks[startLine]; // List marker should have at least 2 chars (digit + dot)

          if (pos + 1 >= max) {
            return -1;
          }

          ch = state.src.charCodeAt(pos++);

          if (ch < 0x30
          /* 0 */
          || ch > 0x39
          /* 9 */
          ) {
            return -1;
          }

          for (;;) {
            // EOL -> fail
            if (pos >= max) {
              return -1;
            }

            ch = state.src.charCodeAt(pos++);

            if (ch >= 0x30
            /* 0 */
            && ch <= 0x39
            /* 9 */
            ) {
              // List marker should have no more than 9 digits
              // (prevents integer overflow in browsers)
              if (pos - start >= 10) {
                return -1;
              }

              continue;
            } // found valid marker


            if (ch === 0x29
            /* ) */
            || ch === 0x2e
            /* . */
            ) {
              break;
            }

            return -1;
          }

          if (pos < max) {
            ch = state.src.charCodeAt(pos);

            if (!isSpace(ch)) {
              // " 1.test " - is not a list item
              return -1;
            }
          }

          return pos;
        }

        function markTightParagraphs(state, idx) {
          var i,
              l,
              level = state.level + 2;

          for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
            if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
              state.tokens[i + 2].hidden = true;
              state.tokens[i].hidden = true;
              i += 2;
            }
          }
        }

        module.exports = function list(state, startLine, endLine, silent) {
          var ch,
              contentStart,
              i,
              indent,
              indentAfterMarker,
              initial,
              isOrdered,
              itemLines,
              l,
              listLines,
              listTokIdx,
              markerCharCode,
              markerValue,
              max,
              nextLine,
              offset,
              oldListIndent,
              oldParentType,
              oldSCount,
              oldTShift,
              oldTight,
              pos,
              posAfterMarker,
              prevEmptyEnd,
              start,
              terminate,
              terminatorRules,
              token,
              isTerminatingParagraph = false,
              tight = true; // if it's indented more than 3 spaces, it should be a code block

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          } // Special case:
          //  - item 1
          //   - item 2
          //    - item 3
          //     - item 4
          //      - this one is a paragraph continuation


          if (state.listIndent >= 0 && state.sCount[startLine] - state.listIndent >= 4 && state.sCount[startLine] < state.blkIndent) {
            return false;
          } // limit conditions when list can interrupt
          // a paragraph (validation mode only)


          if (silent && state.parentType === 'paragraph') {
            // Next list item should still terminate previous list item;
            //
            // This code can fail if plugins use blkIndent as well as lists,
            // but I hope the spec gets fixed long before that happens.
            //
            if (state.tShift[startLine] >= state.blkIndent) {
              isTerminatingParagraph = true;
            }
          } // Detect list type and position after marker


          if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
            isOrdered = true;
            start = state.bMarks[startLine] + state.tShift[startLine];
            markerValue = Number(state.src.substr(start, posAfterMarker - start - 1)); // If we're starting a new ordered list right after
            // a paragraph, it should start with 1.

            if (isTerminatingParagraph && markerValue !== 1) return false;
          } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
            isOrdered = false;
          } else {
            return false;
          } // If we're starting a new unordered list right after
          // a paragraph, first line should not be empty.


          if (isTerminatingParagraph) {
            if (state.skipSpaces(posAfterMarker) >= state.eMarks[startLine]) return false;
          } // We should terminate list on style change. Remember first one to compare.


          markerCharCode = state.src.charCodeAt(posAfterMarker - 1); // For validation mode we can terminate immediately

          if (silent) {
            return true;
          } // Start list


          listTokIdx = state.tokens.length;

          if (isOrdered) {
            token = state.push('ordered_list_open', 'ol', 1);

            if (markerValue !== 1) {
              token.attrs = [['start', markerValue]];
            }
          } else {
            token = state.push('bullet_list_open', 'ul', 1);
          }

          token.map = listLines = [startLine, 0];
          token.markup = String.fromCharCode(markerCharCode); //
          // Iterate list items
          //

          nextLine = startLine;
          prevEmptyEnd = false;
          terminatorRules = state.md.block.ruler.getRules('list');
          oldParentType = state.parentType;
          state.parentType = 'list';

          while (nextLine < endLine) {
            pos = posAfterMarker;
            max = state.eMarks[nextLine];
            initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);

            while (pos < max) {
              ch = state.src.charCodeAt(pos);

              if (ch === 0x09) {
                offset += 4 - (offset + state.bsCount[nextLine]) % 4;
              } else if (ch === 0x20) {
                offset++;
              } else {
                break;
              }

              pos++;
            }

            contentStart = pos;

            if (contentStart >= max) {
              // trimming space in "-    \n  3" case, indent is 1 here
              indentAfterMarker = 1;
            } else {
              indentAfterMarker = offset - initial;
            } // If we have more than 4 spaces, the indent is 1
            // (the rest is just indented code block)


            if (indentAfterMarker > 4) {
              indentAfterMarker = 1;
            } // "  -  test"
            //  ^^^^^ - calculating total length of this thing


            indent = initial + indentAfterMarker; // Run subparser & write tokens

            token = state.push('list_item_open', 'li', 1);
            token.markup = String.fromCharCode(markerCharCode);
            token.map = itemLines = [startLine, 0]; // change current state, then restore it after parser subcall

            oldTight = state.tight;
            oldTShift = state.tShift[startLine];
            oldSCount = state.sCount[startLine]; //  - example list
            // ^ listIndent position will be here
            //   ^ blkIndent position will be here
            //

            oldListIndent = state.listIndent;
            state.listIndent = state.blkIndent;
            state.blkIndent = indent;
            state.tight = true;
            state.tShift[startLine] = contentStart - state.bMarks[startLine];
            state.sCount[startLine] = offset;

            if (contentStart >= max && state.isEmpty(startLine + 1)) {
              // workaround for this case
              // (list item is empty, list terminates before "foo"):
              // ~~~~~~~~
              //   -
              //
              //     foo
              // ~~~~~~~~
              state.line = Math.min(state.line + 2, endLine);
            } else {
              state.md.block.tokenize(state, startLine, endLine, true);
            } // If any of list item is tight, mark list as tight


            if (!state.tight || prevEmptyEnd) {
              tight = false;
            } // Item become loose if finish with empty line,
            // but we should filter last element, because it means list finish


            prevEmptyEnd = state.line - startLine > 1 && state.isEmpty(state.line - 1);
            state.blkIndent = state.listIndent;
            state.listIndent = oldListIndent;
            state.tShift[startLine] = oldTShift;
            state.sCount[startLine] = oldSCount;
            state.tight = oldTight;
            token = state.push('list_item_close', 'li', -1);
            token.markup = String.fromCharCode(markerCharCode);
            nextLine = startLine = state.line;
            itemLines[1] = nextLine;
            contentStart = state.bMarks[startLine];

            if (nextLine >= endLine) {
              break;
            } //
            // Try to check if list is terminated or continued.
            //


            if (state.sCount[nextLine] < state.blkIndent) {
              break;
            } // if it's indented more than 3 spaces, it should be a code block


            if (state.sCount[startLine] - state.blkIndent >= 4) {
              break;
            } // fail if terminating block found


            terminate = false;

            for (i = 0, l = terminatorRules.length; i < l; i++) {
              if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
              }
            }

            if (terminate) {
              break;
            } // fail if list has another type


            if (isOrdered) {
              posAfterMarker = skipOrderedListMarker(state, nextLine);

              if (posAfterMarker < 0) {
                break;
              }
            } else {
              posAfterMarker = skipBulletListMarker(state, nextLine);

              if (posAfterMarker < 0) {
                break;
              }
            }

            if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
              break;
            }
          } // Finalize list


          if (isOrdered) {
            token = state.push('ordered_list_close', 'ol', -1);
          } else {
            token = state.push('bullet_list_close', 'ul', -1);
          }

          token.markup = String.fromCharCode(markerCharCode);
          listLines[1] = nextLine;
          state.line = nextLine;
          state.parentType = oldParentType; // mark paragraphs tight if needed

          if (tight) {
            markTightParagraphs(state, listTokIdx);
          }

          return true;
        };
      }, {
        "../common/utils": 4
      }],
      26: [function (require, module, exports) {

        module.exports = function paragraph(state, startLine
        /*, endLine*/
        ) {
          var content,
              terminate,
              i,
              l,
              token,
              oldParentType,
              nextLine = startLine + 1,
              terminatorRules = state.md.block.ruler.getRules('paragraph'),
              endLine = state.lineMax;
          oldParentType = state.parentType;
          state.parentType = 'paragraph'; // jump line-by-line until empty one or EOF

          for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
            // this would be a code block normally, but after paragraph
            // it's considered a lazy continuation regardless of what's there
            if (state.sCount[nextLine] - state.blkIndent > 3) {
              continue;
            } // quirk for blockquotes, this line should already be checked by that rule


            if (state.sCount[nextLine] < 0) {
              continue;
            } // Some tags can terminate paragraph without empty line.


            terminate = false;

            for (i = 0, l = terminatorRules.length; i < l; i++) {
              if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
              }
            }

            if (terminate) {
              break;
            }
          }

          content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
          state.line = nextLine;
          token = state.push('paragraph_open', 'p', 1);
          token.map = [startLine, state.line];
          token = state.push('inline', '', 0);
          token.content = content;
          token.map = [startLine, state.line];
          token.children = [];
          token = state.push('paragraph_close', 'p', -1);
          state.parentType = oldParentType;
          return true;
        };
      }, {}],
      27: [function (require, module, exports) {

        var normalizeReference = require('../common/utils').normalizeReference;

        var isSpace = require('../common/utils').isSpace;

        module.exports = function reference(state, startLine, _endLine, silent) {
          var ch,
              destEndPos,
              destEndLineNo,
              endLine,
              href,
              i,
              l,
              label,
              labelEnd,
              oldParentType,
              res,
              start,
              str,
              terminate,
              terminatorRules,
              title,
              lines = 0,
              pos = state.bMarks[startLine] + state.tShift[startLine],
              max = state.eMarks[startLine],
              nextLine = startLine + 1; // if it's indented more than 3 spaces, it should be a code block

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          }

          if (state.src.charCodeAt(pos) !== 0x5B
          /* [ */
          ) {
            return false;
          } // Simple check to quickly interrupt scan on [link](url) at the start of line.
          // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54


          while (++pos < max) {
            if (state.src.charCodeAt(pos) === 0x5D
            /* ] */
            && state.src.charCodeAt(pos - 1) !== 0x5C
            /* \ */
            ) {
              if (pos + 1 === max) {
                return false;
              }

              if (state.src.charCodeAt(pos + 1) !== 0x3A
              /* : */
              ) {
                return false;
              }

              break;
            }
          }

          endLine = state.lineMax; // jump line-by-line until empty one or EOF

          terminatorRules = state.md.block.ruler.getRules('reference');
          oldParentType = state.parentType;
          state.parentType = 'reference';

          for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
            // this would be a code block normally, but after paragraph
            // it's considered a lazy continuation regardless of what's there
            if (state.sCount[nextLine] - state.blkIndent > 3) {
              continue;
            } // quirk for blockquotes, this line should already be checked by that rule


            if (state.sCount[nextLine] < 0) {
              continue;
            } // Some tags can terminate paragraph without empty line.


            terminate = false;

            for (i = 0, l = terminatorRules.length; i < l; i++) {
              if (terminatorRules[i](state, nextLine, endLine, true)) {
                terminate = true;
                break;
              }
            }

            if (terminate) {
              break;
            }
          }

          str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
          max = str.length;

          for (pos = 1; pos < max; pos++) {
            ch = str.charCodeAt(pos);

            if (ch === 0x5B
            /* [ */
            ) {
              return false;
            } else if (ch === 0x5D
            /* ] */
            ) {
              labelEnd = pos;
              break;
            } else if (ch === 0x0A
            /* \n */
            ) {
              lines++;
            } else if (ch === 0x5C
            /* \ */
            ) {
              pos++;

              if (pos < max && str.charCodeAt(pos) === 0x0A) {
                lines++;
              }
            }
          }

          if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A
          /* : */
          ) {
            return false;
          } // [label]:   destination   'title'
          //         ^^^ skip optional whitespace here


          for (pos = labelEnd + 2; pos < max; pos++) {
            ch = str.charCodeAt(pos);

            if (ch === 0x0A) {
              lines++;
            } else if (isSpace(ch)) ; else {
              break;
            }
          } // [label]:   destination   'title'
          //            ^^^^^^^^^^^ parse this


          res = state.md.helpers.parseLinkDestination(str, pos, max);

          if (!res.ok) {
            return false;
          }

          href = state.md.normalizeLink(res.str);

          if (!state.md.validateLink(href)) {
            return false;
          }

          pos = res.pos;
          lines += res.lines; // save cursor state, we could require to rollback later

          destEndPos = pos;
          destEndLineNo = lines; // [label]:   destination   'title'
          //                       ^^^ skipping those spaces

          start = pos;

          for (; pos < max; pos++) {
            ch = str.charCodeAt(pos);

            if (ch === 0x0A) {
              lines++;
            } else if (isSpace(ch)) ; else {
              break;
            }
          } // [label]:   destination   'title'
          //                          ^^^^^^^ parse this


          res = state.md.helpers.parseLinkTitle(str, pos, max);

          if (pos < max && start !== pos && res.ok) {
            title = res.str;
            pos = res.pos;
            lines += res.lines;
          } else {
            title = '';
            pos = destEndPos;
            lines = destEndLineNo;
          } // skip trailing spaces until the rest of the line


          while (pos < max) {
            ch = str.charCodeAt(pos);

            if (!isSpace(ch)) {
              break;
            }

            pos++;
          }

          if (pos < max && str.charCodeAt(pos) !== 0x0A) {
            if (title) {
              // garbage at the end of the line after title,
              // but it could still be a valid reference if we roll back
              title = '';
              pos = destEndPos;
              lines = destEndLineNo;

              while (pos < max) {
                ch = str.charCodeAt(pos);

                if (!isSpace(ch)) {
                  break;
                }

                pos++;
              }
            }
          }

          if (pos < max && str.charCodeAt(pos) !== 0x0A) {
            // garbage at the end of the line
            return false;
          }

          label = normalizeReference(str.slice(1, labelEnd));

          if (!label) {
            // CommonMark 0.20 disallows empty labels
            return false;
          } // Reference can not terminate anything. This check is for safety only.

          /*istanbul ignore if*/


          if (silent) {
            return true;
          }

          if (typeof state.env.references === 'undefined') {
            state.env.references = {};
          }

          if (typeof state.env.references[label] === 'undefined') {
            state.env.references[label] = {
              title: title,
              href: href
            };
          }

          state.parentType = oldParentType;
          state.line = startLine + lines + 1;
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      28: [function (require, module, exports) {

        var Token = require('../token');

        var isSpace = require('../common/utils').isSpace;

        function StateBlock(src, md, env, tokens) {
          var ch, s, start, pos, len, indent, offset, indent_found;
          this.src = src; // link to parser instance

          this.md = md;
          this.env = env; //
          // Internal state vartiables
          //

          this.tokens = tokens;
          this.bMarks = []; // line begin offsets for fast jumps

          this.eMarks = []; // line end offsets for fast jumps

          this.tShift = []; // offsets of the first non-space characters (tabs not expanded)

          this.sCount = []; // indents for each line (tabs expanded)
          // An amount of virtual spaces (tabs expanded) between beginning
          // of each line (bMarks) and real beginning of that line.
          //
          // It exists only as a hack because blockquotes override bMarks
          // losing information in the process.
          //
          // It's used only when expanding tabs, you can think about it as
          // an initial tab length, e.g. bsCount=21 applied to string `\t123`
          // means first tab should be expanded to 4-21%4 === 3 spaces.
          //

          this.bsCount = []; // block parser variables

          this.blkIndent = 0; // required block content indent (for example, if we are
          // inside a list, it would be positioned after list marker)

          this.line = 0; // line index in src

          this.lineMax = 0; // lines count

          this.tight = false; // loose/tight mode for lists

          this.ddIndent = -1; // indent of the current dd block (-1 if there isn't any)

          this.listIndent = -1; // indent of the current list block (-1 if there isn't any)
          // can be 'blockquote', 'list', 'root', 'paragraph' or 'reference'
          // used in lists to determine if they interrupt a paragraph

          this.parentType = 'root';
          this.level = 0; // renderer

          this.result = ''; // Create caches
          // Generate markers.

          s = this.src;
          indent_found = false;

          for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
            ch = s.charCodeAt(pos);

            if (!indent_found) {
              if (isSpace(ch)) {
                indent++;

                if (ch === 0x09) {
                  offset += 4 - offset % 4;
                } else {
                  offset++;
                }

                continue;
              } else {
                indent_found = true;
              }
            }

            if (ch === 0x0A || pos === len - 1) {
              if (ch !== 0x0A) {
                pos++;
              }

              this.bMarks.push(start);
              this.eMarks.push(pos);
              this.tShift.push(indent);
              this.sCount.push(offset);
              this.bsCount.push(0);
              indent_found = false;
              indent = 0;
              offset = 0;
              start = pos + 1;
            }
          } // Push fake entry to simplify cache bounds checks


          this.bMarks.push(s.length);
          this.eMarks.push(s.length);
          this.tShift.push(0);
          this.sCount.push(0);
          this.bsCount.push(0);
          this.lineMax = this.bMarks.length - 1; // don't count last fake line
        } // Push new token to "stream".
        //


        StateBlock.prototype.push = function (type, tag, nesting) {
          var token = new Token(type, tag, nesting);
          token.block = true;
          if (nesting < 0) this.level--; // closing tag

          token.level = this.level;
          if (nesting > 0) this.level++; // opening tag

          this.tokens.push(token);
          return token;
        };

        StateBlock.prototype.isEmpty = function isEmpty(line) {
          return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
        };

        StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
          for (var max = this.lineMax; from < max; from++) {
            if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
              break;
            }
          }

          return from;
        }; // Skip spaces from given position.


        StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
          var ch;

          for (var max = this.src.length; pos < max; pos++) {
            ch = this.src.charCodeAt(pos);

            if (!isSpace(ch)) {
              break;
            }
          }

          return pos;
        }; // Skip spaces from given position in reverse.


        StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
          if (pos <= min) {
            return pos;
          }

          while (pos > min) {
            if (!isSpace(this.src.charCodeAt(--pos))) {
              return pos + 1;
            }
          }

          return pos;
        }; // Skip char codes from given position


        StateBlock.prototype.skipChars = function skipChars(pos, code) {
          for (var max = this.src.length; pos < max; pos++) {
            if (this.src.charCodeAt(pos) !== code) {
              break;
            }
          }

          return pos;
        }; // Skip char codes reverse from given position - 1


        StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
          if (pos <= min) {
            return pos;
          }

          while (pos > min) {
            if (code !== this.src.charCodeAt(--pos)) {
              return pos + 1;
            }
          }

          return pos;
        }; // cut lines range from source.


        StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
          var i,
              lineIndent,
              ch,
              first,
              last,
              queue,
              lineStart,
              line = begin;

          if (begin >= end) {
            return '';
          }

          queue = new Array(end - begin);

          for (i = 0; line < end; line++, i++) {
            lineIndent = 0;
            lineStart = first = this.bMarks[line];

            if (line + 1 < end || keepLastLF) {
              // No need for bounds check because we have fake entry on tail.
              last = this.eMarks[line] + 1;
            } else {
              last = this.eMarks[line];
            }

            while (first < last && lineIndent < indent) {
              ch = this.src.charCodeAt(first);

              if (isSpace(ch)) {
                if (ch === 0x09) {
                  lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
                } else {
                  lineIndent++;
                }
              } else if (first - lineStart < this.tShift[line]) {
                // patched tShift masked characters to look like spaces (blockquotes, list markers)
                lineIndent++;
              } else {
                break;
              }

              first++;
            }

            if (lineIndent > indent) {
              // partially expanding tabs in code blocks, e.g '\t\tfoobar'
              // with indent=2 becomes '  \tfoobar'
              queue[i] = new Array(lineIndent - indent + 1).join(' ') + this.src.slice(first, last);
            } else {
              queue[i] = this.src.slice(first, last);
            }
          }

          return queue.join('');
        }; // re-export Token class to use in block rules


        StateBlock.prototype.Token = Token;
        module.exports = StateBlock;
      }, {
        "../common/utils": 4,
        "../token": 51
      }],
      29: [function (require, module, exports) {

        var isSpace = require('../common/utils').isSpace;

        function getLine(state, line) {
          var pos = state.bMarks[line] + state.blkIndent,
              max = state.eMarks[line];
          return state.src.substr(pos, max - pos);
        }

        function escapedSplit(str) {
          var result = [],
              pos = 0,
              max = str.length,
              ch,
              escapes = 0,
              lastPos = 0,
              backTicked = false,
              lastBackTick = 0;
          ch = str.charCodeAt(pos);

          while (pos < max) {
            if (ch === 0x60
            /* ` */
            ) {
              if (backTicked) {
                // make \` close code sequence, but not open it;
                // the reason is: `\` is correct code block
                backTicked = false;
                lastBackTick = pos;
              } else if (escapes % 2 === 0) {
                backTicked = true;
                lastBackTick = pos;
              }
            } else if (ch === 0x7c
            /* | */
            && escapes % 2 === 0 && !backTicked) {
              result.push(str.substring(lastPos, pos));
              lastPos = pos + 1;
            }

            if (ch === 0x5c
            /* \ */
            ) {
              escapes++;
            } else {
              escapes = 0;
            }

            pos++; // If there was an un-closed backtick, go back to just after
            // the last backtick, but as if it was a normal character

            if (pos === max && backTicked) {
              backTicked = false;
              pos = lastBackTick + 1;
            }

            ch = str.charCodeAt(pos);
          }

          result.push(str.substring(lastPos));
          return result;
        }

        module.exports = function table(state, startLine, endLine, silent) {
          var ch, lineText, pos, i, nextLine, columns, columnCount, token, aligns, t, tableLines, tbodyLines; // should have at least two lines

          if (startLine + 2 > endLine) {
            return false;
          }

          nextLine = startLine + 1;

          if (state.sCount[nextLine] < state.blkIndent) {
            return false;
          } // if it's indented more than 3 spaces, it should be a code block


          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            return false;
          } // first character of the second line should be '|', '-', ':',
          // and no other characters are allowed but spaces;
          // basically, this is the equivalent of /^[-:|][-:|\s]*$/ regexp


          pos = state.bMarks[nextLine] + state.tShift[nextLine];

          if (pos >= state.eMarks[nextLine]) {
            return false;
          }

          ch = state.src.charCodeAt(pos++);

          if (ch !== 0x7C
          /* | */
          && ch !== 0x2D
          /* - */
          && ch !== 0x3A
          /* : */
          ) {
            return false;
          }

          while (pos < state.eMarks[nextLine]) {
            ch = state.src.charCodeAt(pos);

            if (ch !== 0x7C
            /* | */
            && ch !== 0x2D
            /* - */
            && ch !== 0x3A
            /* : */
            && !isSpace(ch)) {
              return false;
            }

            pos++;
          }

          lineText = getLine(state, startLine + 1);
          columns = lineText.split('|');
          aligns = [];

          for (i = 0; i < columns.length; i++) {
            t = columns[i].trim();

            if (!t) {
              // allow empty columns before and after table, but not in between columns;
              // e.g. allow ` |---| `, disallow ` ---||--- `
              if (i === 0 || i === columns.length - 1) {
                continue;
              } else {
                return false;
              }
            }

            if (!/^:?-+:?$/.test(t)) {
              return false;
            }

            if (t.charCodeAt(t.length - 1) === 0x3A
            /* : */
            ) {
              aligns.push(t.charCodeAt(0) === 0x3A
              /* : */
              ? 'center' : 'right');
            } else if (t.charCodeAt(0) === 0x3A
            /* : */
            ) {
              aligns.push('left');
            } else {
              aligns.push('');
            }
          }

          lineText = getLine(state, startLine).trim();

          if (lineText.indexOf('|') === -1) {
            return false;
          }

          if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
          }

          columns = escapedSplit(lineText.replace(/^\||\|$/g, '')); // header row will define an amount of columns in the entire table,
          // and align row shouldn't be smaller than that (the rest of the rows can)

          columnCount = columns.length;

          if (columnCount > aligns.length) {
            return false;
          }

          if (silent) {
            return true;
          }

          token = state.push('table_open', 'table', 1);
          token.map = tableLines = [startLine, 0];
          token = state.push('thead_open', 'thead', 1);
          token.map = [startLine, startLine + 1];
          token = state.push('tr_open', 'tr', 1);
          token.map = [startLine, startLine + 1];

          for (i = 0; i < columns.length; i++) {
            token = state.push('th_open', 'th', 1);
            token.map = [startLine, startLine + 1];

            if (aligns[i]) {
              token.attrs = [['style', 'text-align:' + aligns[i]]];
            }

            token = state.push('inline', '', 0);
            token.content = columns[i].trim();
            token.map = [startLine, startLine + 1];
            token.children = [];
            token = state.push('th_close', 'th', -1);
          }

          token = state.push('tr_close', 'tr', -1);
          token = state.push('thead_close', 'thead', -1);
          token = state.push('tbody_open', 'tbody', 1);
          token.map = tbodyLines = [startLine + 2, 0];

          for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
              break;
            }

            lineText = getLine(state, nextLine).trim();

            if (lineText.indexOf('|') === -1) {
              break;
            }

            if (state.sCount[nextLine] - state.blkIndent >= 4) {
              break;
            }

            columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));
            token = state.push('tr_open', 'tr', 1);

            for (i = 0; i < columnCount; i++) {
              token = state.push('td_open', 'td', 1);

              if (aligns[i]) {
                token.attrs = [['style', 'text-align:' + aligns[i]]];
              }

              token = state.push('inline', '', 0);
              token.content = columns[i] ? columns[i].trim() : '';
              token.children = [];
              token = state.push('td_close', 'td', -1);
            }

            token = state.push('tr_close', 'tr', -1);
          }

          token = state.push('tbody_close', 'tbody', -1);
          token = state.push('table_close', 'table', -1);
          tableLines[1] = tbodyLines[1] = nextLine;
          state.line = nextLine;
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      30: [function (require, module, exports) {

        module.exports = function block(state) {
          var token;

          if (state.inlineMode) {
            token = new state.Token('inline', '', 0);
            token.content = state.src;
            token.map = [0, 1];
            token.children = [];
            state.tokens.push(token);
          } else {
            state.md.block.parse(state.src, state.md, state.env, state.tokens);
          }
        };
      }, {}],
      31: [function (require, module, exports) {

        module.exports = function inline(state) {
          var tokens = state.tokens,
              tok,
              i,
              l; // Parse inlines

          for (i = 0, l = tokens.length; i < l; i++) {
            tok = tokens[i];

            if (tok.type === 'inline') {
              state.md.inline.parse(tok.content, state.md, state.env, tok.children);
            }
          }
        };
      }, {}],
      32: [function (require, module, exports) {

        var arrayReplaceAt = require('../common/utils').arrayReplaceAt;

        function isLinkOpen(str) {
          return /^<a[>\s]/i.test(str);
        }

        function isLinkClose(str) {
          return /^<\/a\s*>/i.test(str);
        }

        module.exports = function linkify(state) {
          var i,
              j,
              l,
              tokens,
              token,
              currentToken,
              nodes,
              ln,
              text,
              pos,
              lastPos,
              level,
              htmlLinkLevel,
              url,
              fullUrl,
              urlText,
              blockTokens = state.tokens,
              links;

          if (!state.md.options.linkify) {
            return;
          }

          for (j = 0, l = blockTokens.length; j < l; j++) {
            if (blockTokens[j].type !== 'inline' || !state.md.linkify.pretest(blockTokens[j].content)) {
              continue;
            }

            tokens = blockTokens[j].children;
            htmlLinkLevel = 0; // We scan from the end, to keep position when new tags added.
            // Use reversed logic in links start/end match

            for (i = tokens.length - 1; i >= 0; i--) {
              currentToken = tokens[i]; // Skip content of markdown links

              if (currentToken.type === 'link_close') {
                i--;

                while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
                  i--;
                }

                continue;
              } // Skip content of html tag links


              if (currentToken.type === 'html_inline') {
                if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
                  htmlLinkLevel--;
                }

                if (isLinkClose(currentToken.content)) {
                  htmlLinkLevel++;
                }
              }

              if (htmlLinkLevel > 0) {
                continue;
              }

              if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {
                text = currentToken.content;
                links = state.md.linkify.match(text); // Now split string to nodes

                nodes = [];
                level = currentToken.level;
                lastPos = 0;

                for (ln = 0; ln < links.length; ln++) {
                  url = links[ln].url;
                  fullUrl = state.md.normalizeLink(url);

                  if (!state.md.validateLink(fullUrl)) {
                    continue;
                  }

                  urlText = links[ln].text; // Linkifier might send raw hostnames like "example.com", where url
                  // starts with domain name. So we prepend http:// in those cases,
                  // and remove it afterwards.
                  //

                  if (!links[ln].schema) {
                    urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
                  } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
                    urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
                  } else {
                    urlText = state.md.normalizeLinkText(urlText);
                  }

                  pos = links[ln].index;

                  if (pos > lastPos) {
                    token = new state.Token('text', '', 0);
                    token.content = text.slice(lastPos, pos);
                    token.level = level;
                    nodes.push(token);
                  }

                  token = new state.Token('link_open', 'a', 1);
                  token.attrs = [['href', fullUrl]];
                  token.level = level++;
                  token.markup = 'linkify';
                  token.info = 'auto';
                  nodes.push(token);
                  token = new state.Token('text', '', 0);
                  token.content = urlText;
                  token.level = level;
                  nodes.push(token);
                  token = new state.Token('link_close', 'a', -1);
                  token.level = --level;
                  token.markup = 'linkify';
                  token.info = 'auto';
                  nodes.push(token);
                  lastPos = links[ln].lastIndex;
                }

                if (lastPos < text.length) {
                  token = new state.Token('text', '', 0);
                  token.content = text.slice(lastPos);
                  token.level = level;
                  nodes.push(token);
                } // replace current node


                blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
              }
            }
          }
        };
      }, {
        "../common/utils": 4
      }],
      33: [function (require, module, exports) {

        var NEWLINES_RE = /\r\n?|\n/g;
        var NULL_RE = /\0/g;

        module.exports = function normalize(state) {
          var str; // Normalize newlines

          str = state.src.replace(NEWLINES_RE, '\n'); // Replace NULL characters

          str = str.replace(NULL_RE, "\uFFFD");
          state.src = str;
        };
      }, {}],
      34: [function (require, module, exports) {
        // - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
        // - miltiplication 2 x 4 -> 2 × 4

        var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/; // Workaround for phantomjs - need regex without /g flag,
        // or root check will fail every second time

        var SCOPED_ABBR_TEST_RE = /\((c|tm|r|p)\)/i;
        var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
        var SCOPED_ABBR = {
          c: '©',
          r: '®',
          p: '§',
          tm: '™'
        };

        function replaceFn(match, name) {
          return SCOPED_ABBR[name.toLowerCase()];
        }

        function replace_scoped(inlineTokens) {
          var i,
              token,
              inside_autolink = 0;

          for (i = inlineTokens.length - 1; i >= 0; i--) {
            token = inlineTokens[i];

            if (token.type === 'text' && !inside_autolink) {
              token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
            }

            if (token.type === 'link_open' && token.info === 'auto') {
              inside_autolink--;
            }

            if (token.type === 'link_close' && token.info === 'auto') {
              inside_autolink++;
            }
          }
        }

        function replace_rare(inlineTokens) {
          var i,
              token,
              inside_autolink = 0;

          for (i = inlineTokens.length - 1; i >= 0; i--) {
            token = inlineTokens[i];

            if (token.type === 'text' && !inside_autolink) {
              if (RARE_RE.test(token.content)) {
                token.content = token.content.replace(/\+-/g, '±') // .., ..., ....... -> …
                // but ?..... & !..... -> ?.. & !..
                .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..').replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',') // em-dash
                .replace(/(^|[^-])---([^-]|$)/mg, "$1\u2014$2") // en-dash
                .replace(/(^|\s)--(\s|$)/mg, "$1\u2013$2").replace(/(^|[^-\s])--([^-\s]|$)/mg, "$1\u2013$2");
              }
            }

            if (token.type === 'link_open' && token.info === 'auto') {
              inside_autolink--;
            }

            if (token.type === 'link_close' && token.info === 'auto') {
              inside_autolink++;
            }
          }
        }

        module.exports = function replace(state) {
          var blkIdx;

          if (!state.md.options.typographer) {
            return;
          }

          for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
            if (state.tokens[blkIdx].type !== 'inline') {
              continue;
            }

            if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
              replace_scoped(state.tokens[blkIdx].children);
            }

            if (RARE_RE.test(state.tokens[blkIdx].content)) {
              replace_rare(state.tokens[blkIdx].children);
            }
          }
        };
      }, {}],
      35: [function (require, module, exports) {

        var isWhiteSpace = require('../common/utils').isWhiteSpace;

        var isPunctChar = require('../common/utils').isPunctChar;

        var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;

        var QUOTE_TEST_RE = /['"]/;
        var QUOTE_RE = /['"]/g;
        var APOSTROPHE = "\u2019";
        /* ’ */

        function replaceAt(str, index, ch) {
          return str.substr(0, index) + ch + str.substr(index + 1);
        }

        function process_inlines(tokens, state) {
          var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar, isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace, canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;
          stack = [];

          for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            thisLevel = tokens[i].level;

            for (j = stack.length - 1; j >= 0; j--) {
              if (stack[j].level <= thisLevel) {
                break;
              }
            }

            stack.length = j + 1;

            if (token.type !== 'text') {
              continue;
            }

            text = token.content;
            pos = 0;
            max = text.length;
            /*eslint no-labels:0,block-scoped-var:0*/

            OUTER: while (pos < max) {
              QUOTE_RE.lastIndex = pos;
              t = QUOTE_RE.exec(text);

              if (!t) {
                break;
              }

              canOpen = canClose = true;
              pos = t.index + 1;
              isSingle = t[0] === "'"; // Find previous character,
              // default to space if it's the beginning of the line
              //

              lastChar = 0x20;

              if (t.index - 1 >= 0) {
                lastChar = text.charCodeAt(t.index - 1);
              } else {
                for (j = i - 1; j >= 0; j--) {
                  if (tokens[j].type === 'softbreak' || tokens[j].type === 'hardbreak') break; // lastChar defaults to 0x20

                  if (tokens[j].type !== 'text') continue;
                  lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
                  break;
                }
              } // Find next character,
              // default to space if it's the end of the line
              //


              nextChar = 0x20;

              if (pos < max) {
                nextChar = text.charCodeAt(pos);
              } else {
                for (j = i + 1; j < tokens.length; j++) {
                  if (tokens[j].type === 'softbreak' || tokens[j].type === 'hardbreak') break; // nextChar defaults to 0x20

                  if (tokens[j].type !== 'text') continue;
                  nextChar = tokens[j].content.charCodeAt(0);
                  break;
                }
              }

              isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
              isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
              isLastWhiteSpace = isWhiteSpace(lastChar);
              isNextWhiteSpace = isWhiteSpace(nextChar);

              if (isNextWhiteSpace) {
                canOpen = false;
              } else if (isNextPunctChar) {
                if (!(isLastWhiteSpace || isLastPunctChar)) {
                  canOpen = false;
                }
              }

              if (isLastWhiteSpace) {
                canClose = false;
              } else if (isLastPunctChar) {
                if (!(isNextWhiteSpace || isNextPunctChar)) {
                  canClose = false;
                }
              }

              if (nextChar === 0x22
              /* " */
              && t[0] === '"') {
                if (lastChar >= 0x30
                /* 0 */
                && lastChar <= 0x39
                /* 9 */
                ) {
                  // special case: 1"" - count first quote as an inch
                  canClose = canOpen = false;
                }
              }

              if (canOpen && canClose) {
                // treat this as the middle of the word
                canOpen = false;
                canClose = isNextPunctChar;
              }

              if (!canOpen && !canClose) {
                // middle of word
                if (isSingle) {
                  token.content = replaceAt(token.content, t.index, APOSTROPHE);
                }

                continue;
              }

              if (canClose) {
                // this could be a closing quote, rewind the stack to get a match
                for (j = stack.length - 1; j >= 0; j--) {
                  item = stack[j];

                  if (stack[j].level < thisLevel) {
                    break;
                  }

                  if (item.single === isSingle && stack[j].level === thisLevel) {
                    item = stack[j];

                    if (isSingle) {
                      openQuote = state.md.options.quotes[2];
                      closeQuote = state.md.options.quotes[3];
                    } else {
                      openQuote = state.md.options.quotes[0];
                      closeQuote = state.md.options.quotes[1];
                    } // replace token.content *before* tokens[item.token].content,
                    // because, if they are pointing at the same token, replaceAt
                    // could mess up indices when quote length != 1


                    token.content = replaceAt(token.content, t.index, closeQuote);
                    tokens[item.token].content = replaceAt(tokens[item.token].content, item.pos, openQuote);
                    pos += closeQuote.length - 1;

                    if (item.token === i) {
                      pos += openQuote.length - 1;
                    }

                    text = token.content;
                    max = text.length;
                    stack.length = j;
                    continue OUTER;
                  }
                }
              }

              if (canOpen) {
                stack.push({
                  token: i,
                  pos: t.index,
                  single: isSingle,
                  level: thisLevel
                });
              } else if (canClose && isSingle) {
                token.content = replaceAt(token.content, t.index, APOSTROPHE);
              }
            }
          }
        }

        module.exports = function smartquotes(state) {
          /*eslint max-depth:0*/
          var blkIdx;

          if (!state.md.options.typographer) {
            return;
          }

          for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
            if (state.tokens[blkIdx].type !== 'inline' || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
              continue;
            }

            process_inlines(state.tokens[blkIdx].children, state);
          }
        };
      }, {
        "../common/utils": 4
      }],
      36: [function (require, module, exports) {

        var Token = require('../token');

        function StateCore(src, md, env) {
          this.src = src;
          this.env = env;
          this.tokens = [];
          this.inlineMode = false;
          this.md = md; // link to parser instance
        } // re-export Token class to use in core rules


        StateCore.prototype.Token = Token;
        module.exports = StateCore;
      }, {
        "../token": 51
      }],
      37: [function (require, module, exports) {
        /*eslint max-len:0*/

        var EMAIL_RE = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
        var AUTOLINK_RE = /^<([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)>/;

        module.exports = function autolink(state, silent) {
          var tail,
              linkMatch,
              emailMatch,
              url,
              fullUrl,
              token,
              pos = state.pos;

          if (state.src.charCodeAt(pos) !== 0x3C
          /* < */
          ) {
            return false;
          }

          tail = state.src.slice(pos);

          if (tail.indexOf('>') < 0) {
            return false;
          }

          if (AUTOLINK_RE.test(tail)) {
            linkMatch = tail.match(AUTOLINK_RE);
            url = linkMatch[0].slice(1, -1);
            fullUrl = state.md.normalizeLink(url);

            if (!state.md.validateLink(fullUrl)) {
              return false;
            }

            if (!silent) {
              token = state.push('link_open', 'a', 1);
              token.attrs = [['href', fullUrl]];
              token.markup = 'autolink';
              token.info = 'auto';
              token = state.push('text', '', 0);
              token.content = state.md.normalizeLinkText(url);
              token = state.push('link_close', 'a', -1);
              token.markup = 'autolink';
              token.info = 'auto';
            }

            state.pos += linkMatch[0].length;
            return true;
          }

          if (EMAIL_RE.test(tail)) {
            emailMatch = tail.match(EMAIL_RE);
            url = emailMatch[0].slice(1, -1);
            fullUrl = state.md.normalizeLink('mailto:' + url);

            if (!state.md.validateLink(fullUrl)) {
              return false;
            }

            if (!silent) {
              token = state.push('link_open', 'a', 1);
              token.attrs = [['href', fullUrl]];
              token.markup = 'autolink';
              token.info = 'auto';
              token = state.push('text', '', 0);
              token.content = state.md.normalizeLinkText(url);
              token = state.push('link_close', 'a', -1);
              token.markup = 'autolink';
              token.info = 'auto';
            }

            state.pos += emailMatch[0].length;
            return true;
          }

          return false;
        };
      }, {}],
      38: [function (require, module, exports) {

        module.exports = function backtick(state, silent) {
          var start,
              max,
              marker,
              matchStart,
              matchEnd,
              token,
              pos = state.pos,
              ch = state.src.charCodeAt(pos);

          if (ch !== 0x60
          /* ` */
          ) {
            return false;
          }

          start = pos;
          pos++;
          max = state.posMax;

          while (pos < max && state.src.charCodeAt(pos) === 0x60
          /* ` */
          ) {
            pos++;
          }

          marker = state.src.slice(start, pos);
          matchStart = matchEnd = pos;

          while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
            matchEnd = matchStart + 1;

            while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60
            /* ` */
            ) {
              matchEnd++;
            }

            if (matchEnd - matchStart === marker.length) {
              if (!silent) {
                token = state.push('code_inline', 'code', 0);
                token.markup = marker;
                token.content = state.src.slice(pos, matchStart).replace(/\n/g, ' ').replace(/^ (.+) $/, '$1');
              }

              state.pos = matchEnd;
              return true;
            }
          }

          if (!silent) {
            state.pending += marker;
          }

          state.pos += marker.length;
          return true;
        };
      }, {}],
      39: [function (require, module, exports) {

        function processDelimiters(state, delimiters) {
          var closerIdx,
              openerIdx,
              closer,
              opener,
              minOpenerIdx,
              newMinOpenerIdx,
              isOddMatch,
              lastJump,
              openersBottom = {},
              max = delimiters.length;

          for (closerIdx = 0; closerIdx < max; closerIdx++) {
            closer = delimiters[closerIdx]; // Length is only used for emphasis-specific "rule of 3",
            // if it's not defined (in strikethrough or 3rd party plugins),
            // we can default it to 0 to disable those checks.
            //

            closer.length = closer.length || 0;
            if (!closer.close) continue; // Previously calculated lower bounds (previous fails)
            // for each marker and each delimiter length modulo 3.

            if (!openersBottom.hasOwnProperty(closer.marker)) {
              openersBottom[closer.marker] = [-1, -1, -1];
            }

            minOpenerIdx = openersBottom[closer.marker][closer.length % 3];
            newMinOpenerIdx = -1;
            openerIdx = closerIdx - closer.jump - 1;

            for (; openerIdx > minOpenerIdx; openerIdx -= opener.jump + 1) {
              opener = delimiters[openerIdx];
              if (opener.marker !== closer.marker) continue;
              if (newMinOpenerIdx === -1) newMinOpenerIdx = openerIdx;

              if (opener.open && opener.end < 0 && opener.level === closer.level) {
                isOddMatch = false; // from spec:
                //
                // If one of the delimiters can both open and close emphasis, then the
                // sum of the lengths of the delimiter runs containing the opening and
                // closing delimiters must not be a multiple of 3 unless both lengths
                // are multiples of 3.
                //

                if (opener.close || closer.open) {
                  if ((opener.length + closer.length) % 3 === 0) {
                    if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
                      isOddMatch = true;
                    }
                  }
                }

                if (!isOddMatch) {
                  // If previous delimiter cannot be an opener, we can safely skip
                  // the entire sequence in future checks. This is required to make
                  // sure algorithm has linear complexity (see *_*_*_*_*_... case).
                  //
                  lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? delimiters[openerIdx - 1].jump + 1 : 0;
                  closer.jump = closerIdx - openerIdx + lastJump;
                  closer.open = false;
                  opener.end = closerIdx;
                  opener.jump = lastJump;
                  opener.close = false;
                  newMinOpenerIdx = -1;
                  break;
                }
              }
            }

            if (newMinOpenerIdx !== -1) {
              // If match for this delimiter run failed, we want to set lower bound for
              // future lookups. This is required to make sure algorithm has linear
              // complexity.
              //
              // See details here:
              // https://github.com/commonmark/cmark/issues/178#issuecomment-270417442
              //
              openersBottom[closer.marker][(closer.length || 0) % 3] = newMinOpenerIdx;
            }
          }
        }

        module.exports = function link_pairs(state) {
          var curr,
              tokens_meta = state.tokens_meta,
              max = state.tokens_meta.length;
          processDelimiters(state, state.delimiters);

          for (curr = 0; curr < max; curr++) {
            if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
              processDelimiters(state, tokens_meta[curr].delimiters);
            }
          }
        };
      }, {}],
      40: [function (require, module, exports) {
        //

        module.exports.tokenize = function emphasis(state, silent) {
          var i,
              scanned,
              token,
              start = state.pos,
              marker = state.src.charCodeAt(start);

          if (silent) {
            return false;
          }

          if (marker !== 0x5F
          /* _ */
          && marker !== 0x2A
          /* * */
          ) {
            return false;
          }

          scanned = state.scanDelims(state.pos, marker === 0x2A);

          for (i = 0; i < scanned.length; i++) {
            token = state.push('text', '', 0);
            token.content = String.fromCharCode(marker);
            state.delimiters.push({
              // Char code of the starting marker (number).
              //
              marker: marker,
              // Total length of these series of delimiters.
              //
              length: scanned.length,
              // An amount of characters before this one that's equivalent to
              // current one. In plain English: if this delimiter does not open
              // an emphasis, neither do previous `jump` characters.
              //
              // Used to skip sequences like "*****" in one step, for 1st asterisk
              // value will be 0, for 2nd it's 1 and so on.
              //
              jump: i,
              // A position of the token this delimiter corresponds to.
              //
              token: state.tokens.length - 1,
              // If this delimiter is matched as a valid opener, `end` will be
              // equal to its position, otherwise it's `-1`.
              //
              end: -1,
              // Boolean flags that determine if this delimiter could open or close
              // an emphasis.
              //
              open: scanned.can_open,
              close: scanned.can_close
            });
          }

          state.pos += scanned.length;
          return true;
        };

        function postProcess(state, delimiters) {
          var i,
              startDelim,
              endDelim,
              token,
              ch,
              isStrong,
              max = delimiters.length;

          for (i = max - 1; i >= 0; i--) {
            startDelim = delimiters[i];

            if (startDelim.marker !== 0x5F
            /* _ */
            && startDelim.marker !== 0x2A
            /* * */
            ) {
              continue;
            } // Process only opening markers


            if (startDelim.end === -1) {
              continue;
            }

            endDelim = delimiters[startDelim.end]; // If the previous delimiter has the same marker and is adjacent to this one,
            // merge those into one strong delimiter.
            //
            // `<em><em>whatever</em></em>` -> `<strong>whatever</strong>`
            //

            isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1 && delimiters[i - 1].marker === startDelim.marker;
            ch = String.fromCharCode(startDelim.marker);
            token = state.tokens[startDelim.token];
            token.type = isStrong ? 'strong_open' : 'em_open';
            token.tag = isStrong ? 'strong' : 'em';
            token.nesting = 1;
            token.markup = isStrong ? ch + ch : ch;
            token.content = '';
            token = state.tokens[endDelim.token];
            token.type = isStrong ? 'strong_close' : 'em_close';
            token.tag = isStrong ? 'strong' : 'em';
            token.nesting = -1;
            token.markup = isStrong ? ch + ch : ch;
            token.content = '';

            if (isStrong) {
              state.tokens[delimiters[i - 1].token].content = '';
              state.tokens[delimiters[startDelim.end + 1].token].content = '';
              i--;
            }
          }
        } // Walk through delimiter list and replace text tokens with tags
        //


        module.exports.postProcess = function emphasis(state) {
          var curr,
              tokens_meta = state.tokens_meta,
              max = state.tokens_meta.length;
          postProcess(state, state.delimiters);

          for (curr = 0; curr < max; curr++) {
            if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
              postProcess(state, tokens_meta[curr].delimiters);
            }
          }
        };
      }, {}],
      41: [function (require, module, exports) {

        var entities = require('../common/entities');

        var has = require('../common/utils').has;

        var isValidEntityCode = require('../common/utils').isValidEntityCode;

        var fromCodePoint = require('../common/utils').fromCodePoint;

        var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
        var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;

        module.exports = function entity(state, silent) {
          var ch,
              code,
              match,
              pos = state.pos,
              max = state.posMax;

          if (state.src.charCodeAt(pos) !== 0x26
          /* & */
          ) {
            return false;
          }

          if (pos + 1 < max) {
            ch = state.src.charCodeAt(pos + 1);

            if (ch === 0x23
            /* # */
            ) {
              match = state.src.slice(pos).match(DIGITAL_RE);

              if (match) {
                if (!silent) {
                  code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
                  state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
                }

                state.pos += match[0].length;
                return true;
              }
            } else {
              match = state.src.slice(pos).match(NAMED_RE);

              if (match) {
                if (has(entities, match[1])) {
                  if (!silent) {
                    state.pending += entities[match[1]];
                  }

                  state.pos += match[0].length;
                  return true;
                }
              }
            }
          }

          if (!silent) {
            state.pending += '&';
          }

          state.pos++;
          return true;
        };
      }, {
        "../common/entities": 1,
        "../common/utils": 4
      }],
      42: [function (require, module, exports) {

        var isSpace = require('../common/utils').isSpace;

        var ESCAPED = [];

        for (var i = 0; i < 256; i++) {
          ESCAPED.push(0);
        }

        '\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'.split('').forEach(function (ch) {
          ESCAPED[ch.charCodeAt(0)] = 1;
        });

        module.exports = function escape(state, silent) {
          var ch,
              pos = state.pos,
              max = state.posMax;

          if (state.src.charCodeAt(pos) !== 0x5C
          /* \ */
          ) {
            return false;
          }

          pos++;

          if (pos < max) {
            ch = state.src.charCodeAt(pos);

            if (ch < 256 && ESCAPED[ch] !== 0) {
              if (!silent) {
                state.pending += state.src[pos];
              }

              state.pos += 2;
              return true;
            }

            if (ch === 0x0A) {
              if (!silent) {
                state.push('hardbreak', 'br', 0);
              }

              pos++; // skip leading whitespaces from next line

              while (pos < max) {
                ch = state.src.charCodeAt(pos);

                if (!isSpace(ch)) {
                  break;
                }

                pos++;
              }

              state.pos = pos;
              return true;
            }
          }

          if (!silent) {
            state.pending += '\\';
          }

          state.pos++;
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      43: [function (require, module, exports) {

        var HTML_TAG_RE = require('../common/html_re').HTML_TAG_RE;

        function isLetter(ch) {
          /*eslint no-bitwise:0*/
          var lc = ch | 0x20; // to lower case

          return lc >= 0x61
          /* a */
          && lc <= 0x7a
          /* z */
          ;
        }

        module.exports = function html_inline(state, silent) {
          var ch,
              match,
              max,
              token,
              pos = state.pos;

          if (!state.md.options.html) {
            return false;
          } // Check start


          max = state.posMax;

          if (state.src.charCodeAt(pos) !== 0x3C
          /* < */
          || pos + 2 >= max) {
            return false;
          } // Quick fail on second char


          ch = state.src.charCodeAt(pos + 1);

          if (ch !== 0x21
          /* ! */
          && ch !== 0x3F
          /* ? */
          && ch !== 0x2F
          /* / */
          && !isLetter(ch)) {
            return false;
          }

          match = state.src.slice(pos).match(HTML_TAG_RE);

          if (!match) {
            return false;
          }

          if (!silent) {
            token = state.push('html_inline', '', 0);
            token.content = state.src.slice(pos, pos + match[0].length);
          }

          state.pos += match[0].length;
          return true;
        };
      }, {
        "../common/html_re": 3
      }],
      44: [function (require, module, exports) {

        var normalizeReference = require('../common/utils').normalizeReference;

        var isSpace = require('../common/utils').isSpace;

        module.exports = function image(state, silent) {
          var attrs,
              code,
              content,
              label,
              labelEnd,
              labelStart,
              pos,
              ref,
              res,
              title,
              token,
              tokens,
              start,
              href = '',
              oldPos = state.pos,
              max = state.posMax;

          if (state.src.charCodeAt(state.pos) !== 0x21
          /* ! */
          ) {
            return false;
          }

          if (state.src.charCodeAt(state.pos + 1) !== 0x5B
          /* [ */
          ) {
            return false;
          }

          labelStart = state.pos + 2;
          labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false); // parser failed to find ']', so it's not a valid link

          if (labelEnd < 0) {
            return false;
          }

          pos = labelEnd + 1;

          if (pos < max && state.src.charCodeAt(pos) === 0x28
          /* ( */
          ) {
            //
            // Inline link
            //
            // [link](  <href>  "title"  )
            //        ^^ skipping these spaces
            pos++;

            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);

              if (!isSpace(code) && code !== 0x0A) {
                break;
              }
            }

            if (pos >= max) {
              return false;
            } // [link](  <href>  "title"  )
            //          ^^^^^^ parsing link destination


            start = pos;
            res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);

            if (res.ok) {
              href = state.md.normalizeLink(res.str);

              if (state.md.validateLink(href)) {
                pos = res.pos;
              } else {
                href = '';
              }
            } // [link](  <href>  "title"  )
            //                ^^ skipping these spaces


            start = pos;

            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);

              if (!isSpace(code) && code !== 0x0A) {
                break;
              }
            } // [link](  <href>  "title"  )
            //                  ^^^^^^^ parsing link title


            res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);

            if (pos < max && start !== pos && res.ok) {
              title = res.str;
              pos = res.pos; // [link](  <href>  "title"  )
              //                         ^^ skipping these spaces

              for (; pos < max; pos++) {
                code = state.src.charCodeAt(pos);

                if (!isSpace(code) && code !== 0x0A) {
                  break;
                }
              }
            } else {
              title = '';
            }

            if (pos >= max || state.src.charCodeAt(pos) !== 0x29
            /* ) */
            ) {
              state.pos = oldPos;
              return false;
            }

            pos++;
          } else {
            //
            // Link reference
            //
            if (typeof state.env.references === 'undefined') {
              return false;
            }

            if (pos < max && state.src.charCodeAt(pos) === 0x5B
            /* [ */
            ) {
              start = pos + 1;
              pos = state.md.helpers.parseLinkLabel(state, pos);

              if (pos >= 0) {
                label = state.src.slice(start, pos++);
              } else {
                pos = labelEnd + 1;
              }
            } else {
              pos = labelEnd + 1;
            } // covers label === '' and label === undefined
            // (collapsed reference link and shortcut reference link respectively)


            if (!label) {
              label = state.src.slice(labelStart, labelEnd);
            }

            ref = state.env.references[normalizeReference(label)];

            if (!ref) {
              state.pos = oldPos;
              return false;
            }

            href = ref.href;
            title = ref.title;
          } //
          // We found the end of the link, and know for a fact it's a valid link;
          // so all that's left to do is to call tokenizer.
          //


          if (!silent) {
            content = state.src.slice(labelStart, labelEnd);
            state.md.inline.parse(content, state.md, state.env, tokens = []);
            token = state.push('image', 'img', 0);
            token.attrs = attrs = [['src', href], ['alt', '']];
            token.children = tokens;
            token.content = content;

            if (title) {
              attrs.push(['title', title]);
            }
          }

          state.pos = pos;
          state.posMax = max;
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      45: [function (require, module, exports) {

        var normalizeReference = require('../common/utils').normalizeReference;

        var isSpace = require('../common/utils').isSpace;

        module.exports = function link(state, silent) {
          var attrs,
              code,
              label,
              labelEnd,
              labelStart,
              pos,
              res,
              ref,
              title,
              token,
              href = '',
              oldPos = state.pos,
              max = state.posMax,
              start = state.pos,
              parseReference = true;

          if (state.src.charCodeAt(state.pos) !== 0x5B
          /* [ */
          ) {
            return false;
          }

          labelStart = state.pos + 1;
          labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true); // parser failed to find ']', so it's not a valid link

          if (labelEnd < 0) {
            return false;
          }

          pos = labelEnd + 1;

          if (pos < max && state.src.charCodeAt(pos) === 0x28
          /* ( */
          ) {
            //
            // Inline link
            //
            // might have found a valid shortcut link, disable reference parsing
            parseReference = false; // [link](  <href>  "title"  )
            //        ^^ skipping these spaces

            pos++;

            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);

              if (!isSpace(code) && code !== 0x0A) {
                break;
              }
            }

            if (pos >= max) {
              return false;
            } // [link](  <href>  "title"  )
            //          ^^^^^^ parsing link destination


            start = pos;
            res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);

            if (res.ok) {
              href = state.md.normalizeLink(res.str);

              if (state.md.validateLink(href)) {
                pos = res.pos;
              } else {
                href = '';
              }
            } // [link](  <href>  "title"  )
            //                ^^ skipping these spaces


            start = pos;

            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);

              if (!isSpace(code) && code !== 0x0A) {
                break;
              }
            } // [link](  <href>  "title"  )
            //                  ^^^^^^^ parsing link title


            res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);

            if (pos < max && start !== pos && res.ok) {
              title = res.str;
              pos = res.pos; // [link](  <href>  "title"  )
              //                         ^^ skipping these spaces

              for (; pos < max; pos++) {
                code = state.src.charCodeAt(pos);

                if (!isSpace(code) && code !== 0x0A) {
                  break;
                }
              }
            } else {
              title = '';
            }

            if (pos >= max || state.src.charCodeAt(pos) !== 0x29
            /* ) */
            ) {
              // parsing a valid shortcut link failed, fallback to reference
              parseReference = true;
            }

            pos++;
          }

          if (parseReference) {
            //
            // Link reference
            //
            if (typeof state.env.references === 'undefined') {
              return false;
            }

            if (pos < max && state.src.charCodeAt(pos) === 0x5B
            /* [ */
            ) {
              start = pos + 1;
              pos = state.md.helpers.parseLinkLabel(state, pos);

              if (pos >= 0) {
                label = state.src.slice(start, pos++);
              } else {
                pos = labelEnd + 1;
              }
            } else {
              pos = labelEnd + 1;
            } // covers label === '' and label === undefined
            // (collapsed reference link and shortcut reference link respectively)


            if (!label) {
              label = state.src.slice(labelStart, labelEnd);
            }

            ref = state.env.references[normalizeReference(label)];

            if (!ref) {
              state.pos = oldPos;
              return false;
            }

            href = ref.href;
            title = ref.title;
          } //
          // We found the end of the link, and know for a fact it's a valid link;
          // so all that's left to do is to call tokenizer.
          //


          if (!silent) {
            state.pos = labelStart;
            state.posMax = labelEnd;
            token = state.push('link_open', 'a', 1);
            token.attrs = attrs = [['href', href]];

            if (title) {
              attrs.push(['title', title]);
            }

            state.md.inline.tokenize(state);
            token = state.push('link_close', 'a', -1);
          }

          state.pos = pos;
          state.posMax = max;
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      46: [function (require, module, exports) {

        var isSpace = require('../common/utils').isSpace;

        module.exports = function newline(state, silent) {
          var pmax,
              max,
              pos = state.pos;

          if (state.src.charCodeAt(pos) !== 0x0A
          /* \n */
          ) {
            return false;
          }

          pmax = state.pending.length - 1;
          max = state.posMax; // '  \n' -> hardbreak
          // Lookup in pending chars is bad practice! Don't copy to other rules!
          // Pending string is stored in concat mode, indexed lookups will cause
          // convertion to flat mode.

          if (!silent) {
            if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
              if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
                state.pending = state.pending.replace(/ +$/, '');
                state.push('hardbreak', 'br', 0);
              } else {
                state.pending = state.pending.slice(0, -1);
                state.push('softbreak', 'br', 0);
              }
            } else {
              state.push('softbreak', 'br', 0);
            }
          }

          pos++; // skip heading spaces for next line

          while (pos < max && isSpace(state.src.charCodeAt(pos))) {
            pos++;
          }

          state.pos = pos;
          return true;
        };
      }, {
        "../common/utils": 4
      }],
      47: [function (require, module, exports) {

        var Token = require('../token');

        var isWhiteSpace = require('../common/utils').isWhiteSpace;

        var isPunctChar = require('../common/utils').isPunctChar;

        var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;

        function StateInline(src, md, env, outTokens) {
          this.src = src;
          this.env = env;
          this.md = md;
          this.tokens = outTokens;
          this.tokens_meta = Array(outTokens.length);
          this.pos = 0;
          this.posMax = this.src.length;
          this.level = 0;
          this.pending = '';
          this.pendingLevel = 0; // Stores { start: end } pairs. Useful for backtrack
          // optimization of pairs parse (emphasis, strikes).

          this.cache = {}; // List of emphasis-like delimiters for current tag

          this.delimiters = []; // Stack of delimiter lists for upper level tags

          this._prev_delimiters = [];
        } // Flush pending text
        //


        StateInline.prototype.pushPending = function () {
          var token = new Token('text', '', 0);
          token.content = this.pending;
          token.level = this.pendingLevel;
          this.tokens.push(token);
          this.pending = '';
          return token;
        }; // Push new token to "stream".
        // If pending text exists - flush it as text token
        //


        StateInline.prototype.push = function (type, tag, nesting) {
          if (this.pending) {
            this.pushPending();
          }

          var token = new Token(type, tag, nesting);
          var token_meta = null;

          if (nesting < 0) {
            // closing tag
            this.level--;
            this.delimiters = this._prev_delimiters.pop();
          }

          token.level = this.level;

          if (nesting > 0) {
            // opening tag
            this.level++;

            this._prev_delimiters.push(this.delimiters);

            this.delimiters = [];
            token_meta = {
              delimiters: this.delimiters
            };
          }

          this.pendingLevel = this.level;
          this.tokens.push(token);
          this.tokens_meta.push(token_meta);
          return token;
        }; // Scan a sequence of emphasis-like markers, and determine whether
        // it can start an emphasis sequence or end an emphasis sequence.
        //
        //  - start - position to scan from (it should point at a valid marker);
        //  - canSplitWord - determine if these markers can be found inside a word
        //


        StateInline.prototype.scanDelims = function (start, canSplitWord) {
          var pos = start,
              lastChar,
              nextChar,
              count,
              can_open,
              can_close,
              isLastWhiteSpace,
              isLastPunctChar,
              isNextWhiteSpace,
              isNextPunctChar,
              left_flanking = true,
              right_flanking = true,
              max = this.posMax,
              marker = this.src.charCodeAt(start); // treat beginning of the line as a whitespace

          lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20;

          while (pos < max && this.src.charCodeAt(pos) === marker) {
            pos++;
          }

          count = pos - start; // treat end of the line as a whitespace

          nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20;
          isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
          isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
          isLastWhiteSpace = isWhiteSpace(lastChar);
          isNextWhiteSpace = isWhiteSpace(nextChar);

          if (isNextWhiteSpace) {
            left_flanking = false;
          } else if (isNextPunctChar) {
            if (!(isLastWhiteSpace || isLastPunctChar)) {
              left_flanking = false;
            }
          }

          if (isLastWhiteSpace) {
            right_flanking = false;
          } else if (isLastPunctChar) {
            if (!(isNextWhiteSpace || isNextPunctChar)) {
              right_flanking = false;
            }
          }

          if (!canSplitWord) {
            can_open = left_flanking && (!right_flanking || isLastPunctChar);
            can_close = right_flanking && (!left_flanking || isNextPunctChar);
          } else {
            can_open = left_flanking;
            can_close = right_flanking;
          }

          return {
            can_open: can_open,
            can_close: can_close,
            length: count
          };
        }; // re-export Token class to use in block rules


        StateInline.prototype.Token = Token;
        module.exports = StateInline;
      }, {
        "../common/utils": 4,
        "../token": 51
      }],
      48: [function (require, module, exports) {
        //

        module.exports.tokenize = function strikethrough(state, silent) {
          var i,
              scanned,
              token,
              len,
              ch,
              start = state.pos,
              marker = state.src.charCodeAt(start);

          if (silent) {
            return false;
          }

          if (marker !== 0x7E
          /* ~ */
          ) {
            return false;
          }

          scanned = state.scanDelims(state.pos, true);
          len = scanned.length;
          ch = String.fromCharCode(marker);

          if (len < 2) {
            return false;
          }

          if (len % 2) {
            token = state.push('text', '', 0);
            token.content = ch;
            len--;
          }

          for (i = 0; i < len; i += 2) {
            token = state.push('text', '', 0);
            token.content = ch + ch;
            state.delimiters.push({
              marker: marker,
              length: 0,
              // disable "rule of 3" length checks meant for emphasis
              jump: i,
              token: state.tokens.length - 1,
              end: -1,
              open: scanned.can_open,
              close: scanned.can_close
            });
          }

          state.pos += scanned.length;
          return true;
        };

        function postProcess(state, delimiters) {
          var i,
              j,
              startDelim,
              endDelim,
              token,
              loneMarkers = [],
              max = delimiters.length;

          for (i = 0; i < max; i++) {
            startDelim = delimiters[i];

            if (startDelim.marker !== 0x7E
            /* ~ */
            ) {
              continue;
            }

            if (startDelim.end === -1) {
              continue;
            }

            endDelim = delimiters[startDelim.end];
            token = state.tokens[startDelim.token];
            token.type = 's_open';
            token.tag = 's';
            token.nesting = 1;
            token.markup = '~~';
            token.content = '';
            token = state.tokens[endDelim.token];
            token.type = 's_close';
            token.tag = 's';
            token.nesting = -1;
            token.markup = '~~';
            token.content = '';

            if (state.tokens[endDelim.token - 1].type === 'text' && state.tokens[endDelim.token - 1].content === '~') {
              loneMarkers.push(endDelim.token - 1);
            }
          } // If a marker sequence has an odd number of characters, it's splitted
          // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
          // start of the sequence.
          //
          // So, we have to move all those markers after subsequent s_close tags.
          //


          while (loneMarkers.length) {
            i = loneMarkers.pop();
            j = i + 1;

            while (j < state.tokens.length && state.tokens[j].type === 's_close') {
              j++;
            }

            j--;

            if (i !== j) {
              token = state.tokens[j];
              state.tokens[j] = state.tokens[i];
              state.tokens[i] = token;
            }
          }
        } // Walk through delimiter list and replace text tokens with tags
        //


        module.exports.postProcess = function strikethrough(state) {
          var curr,
              tokens_meta = state.tokens_meta,
              max = state.tokens_meta.length;
          postProcess(state, state.delimiters);

          for (curr = 0; curr < max; curr++) {
            if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
              postProcess(state, tokens_meta[curr].delimiters);
            }
          }
        };
      }, {}],
      49: [function (require, module, exports) {
        // '{}$%@~+=:' reserved for extentions
        // !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
        // !!!! Don't confuse with "Markdown ASCII Punctuation" chars
        // http://spec.commonmark.org/0.15/#ascii-punctuation-character

        function isTerminatorChar(ch) {
          switch (ch) {
            case 0x0A
            /* \n */
            :
            case 0x21
            /* ! */
            :
            case 0x23
            /* # */
            :
            case 0x24
            /* $ */
            :
            case 0x25
            /* % */
            :
            case 0x26
            /* & */
            :
            case 0x2A
            /* * */
            :
            case 0x2B
            /* + */
            :
            case 0x2D
            /* - */
            :
            case 0x3A
            /* : */
            :
            case 0x3C
            /* < */
            :
            case 0x3D
            /* = */
            :
            case 0x3E
            /* > */
            :
            case 0x40
            /* @ */
            :
            case 0x5B
            /* [ */
            :
            case 0x5C
            /* \ */
            :
            case 0x5D
            /* ] */
            :
            case 0x5E
            /* ^ */
            :
            case 0x5F
            /* _ */
            :
            case 0x60
            /* ` */
            :
            case 0x7B
            /* { */
            :
            case 0x7D
            /* } */
            :
            case 0x7E
            /* ~ */
            :
              return true;

            default:
              return false;
          }
        }

        module.exports = function text(state, silent) {
          var pos = state.pos;

          while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
            pos++;
          }

          if (pos === state.pos) {
            return false;
          }

          if (!silent) {
            state.pending += state.src.slice(state.pos, pos);
          }

          state.pos = pos;
          return true;
        }; // Alternative implementation, for memory.
        //
        // It costs 10% of performance, but allows extend terminators list, if place it
        // to `ParcerInline` property. Probably, will switch to it sometime, such
        // flexibility required.

        /*
        var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;
        
        module.exports = function text(state, silent) {
          var pos = state.pos,
              idx = state.src.slice(pos).search(TERMINATOR_RE);
        
          // first char is terminator -> empty text
          if (idx === 0) { return false; }
        
          // no terminator -> text till end of string
          if (idx < 0) {
            if (!silent) { state.pending += state.src.slice(pos); }
            state.pos = state.src.length;
            return true;
          }
        
          if (!silent) { state.pending += state.src.slice(pos, pos + idx); }
        
          state.pos += idx;
        
          return true;
        };*/

      }, {}],
      50: [function (require, module, exports) {

        module.exports = function text_collapse(state) {
          var curr,
              last,
              level = 0,
              tokens = state.tokens,
              max = state.tokens.length;

          for (curr = last = 0; curr < max; curr++) {
            // re-calculate levels after emphasis/strikethrough turns some text nodes
            // into opening/closing tags
            if (tokens[curr].nesting < 0) level--; // closing tag

            tokens[curr].level = level;
            if (tokens[curr].nesting > 0) level++; // opening tag

            if (tokens[curr].type === 'text' && curr + 1 < max && tokens[curr + 1].type === 'text') {
              // collapse two adjacent text nodes
              tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
            } else {
              if (curr !== last) {
                tokens[last] = tokens[curr];
              }

              last++;
            }
          }

          if (curr !== last) {
            tokens.length = last;
          }
        };
      }, {}],
      51: [function (require, module, exports) {
        /**
         * class Token
         **/

        /**
         * new Token(type, tag, nesting)
         *
         * Create new token and fill passed properties.
         **/

        function Token(type, tag, nesting) {
          /**
           * Token#type -> String
           *
           * Type of the token (string, e.g. "paragraph_open")
           **/
          this.type = type;
          /**
           * Token#tag -> String
           *
           * html tag name, e.g. "p"
           **/

          this.tag = tag;
          /**
           * Token#attrs -> Array
           *
           * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
           **/

          this.attrs = null;
          /**
           * Token#map -> Array
           *
           * Source map info. Format: `[ line_begin, line_end ]`
           **/

          this.map = null;
          /**
           * Token#nesting -> Number
           *
           * Level change (number in {-1, 0, 1} set), where:
           *
           * -  `1` means the tag is opening
           * -  `0` means the tag is self-closing
           * - `-1` means the tag is closing
           **/

          this.nesting = nesting;
          /**
           * Token#level -> Number
           *
           * nesting level, the same as `state.level`
           **/

          this.level = 0;
          /**
           * Token#children -> Array
           *
           * An array of child nodes (inline and img tokens)
           **/

          this.children = null;
          /**
           * Token#content -> String
           *
           * In a case of self-closing tag (code, html, fence, etc.),
           * it has contents of this tag.
           **/

          this.content = '';
          /**
           * Token#markup -> String
           *
           * '*' or '_' for emphasis, fence string for fence, etc.
           **/

          this.markup = '';
          /**
           * Token#info -> String
           *
           * fence infostring
           **/

          this.info = '';
          /**
           * Token#meta -> Object
           *
           * A place for plugins to store an arbitrary data
           **/

          this.meta = null;
          /**
           * Token#block -> Boolean
           *
           * True for block-level tokens, false for inline tokens.
           * Used in renderer to calculate line breaks
           **/

          this.block = false;
          /**
           * Token#hidden -> Boolean
           *
           * If it's true, ignore this element when rendering. Used for tight lists
           * to hide paragraphs.
           **/

          this.hidden = false;
        }
        /**
         * Token.attrIndex(name) -> Number
         *
         * Search attribute index by name.
         **/


        Token.prototype.attrIndex = function attrIndex(name) {
          var attrs, i, len;

          if (!this.attrs) {
            return -1;
          }

          attrs = this.attrs;

          for (i = 0, len = attrs.length; i < len; i++) {
            if (attrs[i][0] === name) {
              return i;
            }
          }

          return -1;
        };
        /**
         * Token.attrPush(attrData)
         *
         * Add `[ name, value ]` attribute to list. Init attrs if necessary
         **/


        Token.prototype.attrPush = function attrPush(attrData) {
          if (this.attrs) {
            this.attrs.push(attrData);
          } else {
            this.attrs = [attrData];
          }
        };
        /**
         * Token.attrSet(name, value)
         *
         * Set `name` attribute to `value`. Override old value if exists.
         **/


        Token.prototype.attrSet = function attrSet(name, value) {
          var idx = this.attrIndex(name),
              attrData = [name, value];

          if (idx < 0) {
            this.attrPush(attrData);
          } else {
            this.attrs[idx] = attrData;
          }
        };
        /**
         * Token.attrGet(name)
         *
         * Get the value of attribute `name`, or null if it does not exist.
         **/


        Token.prototype.attrGet = function attrGet(name) {
          var idx = this.attrIndex(name),
              value = null;

          if (idx >= 0) {
            value = this.attrs[idx][1];
          }

          return value;
        };
        /**
         * Token.attrJoin(name, value)
         *
         * Join value to existing attribute via space. Or create new attribute if not
         * exists. Useful to operate with token classes.
         **/


        Token.prototype.attrJoin = function attrJoin(name, value) {
          var idx = this.attrIndex(name);

          if (idx < 0) {
            this.attrPush([name, value]);
          } else {
            this.attrs[idx][1] = this.attrs[idx][1] + ' ' + value;
          }
        };

        module.exports = Token;
      }, {}],
      52: [function (require, module, exports) {
        module.exports = {
          "Aacute": "\xC1",
          "aacute": "\xE1",
          "Abreve": "\u0102",
          "abreve": "\u0103",
          "ac": "\u223E",
          "acd": "\u223F",
          "acE": "\u223E\u0333",
          "Acirc": "\xC2",
          "acirc": "\xE2",
          "acute": "\xB4",
          "Acy": "\u0410",
          "acy": "\u0430",
          "AElig": "\xC6",
          "aelig": "\xE6",
          "af": "\u2061",
          "Afr": "\uD835\uDD04",
          "afr": "\uD835\uDD1E",
          "Agrave": "\xC0",
          "agrave": "\xE0",
          "alefsym": "\u2135",
          "aleph": "\u2135",
          "Alpha": "\u0391",
          "alpha": "\u03B1",
          "Amacr": "\u0100",
          "amacr": "\u0101",
          "amalg": "\u2A3F",
          "amp": "&",
          "AMP": "&",
          "andand": "\u2A55",
          "And": "\u2A53",
          "and": "\u2227",
          "andd": "\u2A5C",
          "andslope": "\u2A58",
          "andv": "\u2A5A",
          "ang": "\u2220",
          "ange": "\u29A4",
          "angle": "\u2220",
          "angmsdaa": "\u29A8",
          "angmsdab": "\u29A9",
          "angmsdac": "\u29AA",
          "angmsdad": "\u29AB",
          "angmsdae": "\u29AC",
          "angmsdaf": "\u29AD",
          "angmsdag": "\u29AE",
          "angmsdah": "\u29AF",
          "angmsd": "\u2221",
          "angrt": "\u221F",
          "angrtvb": "\u22BE",
          "angrtvbd": "\u299D",
          "angsph": "\u2222",
          "angst": "\xC5",
          "angzarr": "\u237C",
          "Aogon": "\u0104",
          "aogon": "\u0105",
          "Aopf": "\uD835\uDD38",
          "aopf": "\uD835\uDD52",
          "apacir": "\u2A6F",
          "ap": "\u2248",
          "apE": "\u2A70",
          "ape": "\u224A",
          "apid": "\u224B",
          "apos": "'",
          "ApplyFunction": "\u2061",
          "approx": "\u2248",
          "approxeq": "\u224A",
          "Aring": "\xC5",
          "aring": "\xE5",
          "Ascr": "\uD835\uDC9C",
          "ascr": "\uD835\uDCB6",
          "Assign": "\u2254",
          "ast": "*",
          "asymp": "\u2248",
          "asympeq": "\u224D",
          "Atilde": "\xC3",
          "atilde": "\xE3",
          "Auml": "\xC4",
          "auml": "\xE4",
          "awconint": "\u2233",
          "awint": "\u2A11",
          "backcong": "\u224C",
          "backepsilon": "\u03F6",
          "backprime": "\u2035",
          "backsim": "\u223D",
          "backsimeq": "\u22CD",
          "Backslash": "\u2216",
          "Barv": "\u2AE7",
          "barvee": "\u22BD",
          "barwed": "\u2305",
          "Barwed": "\u2306",
          "barwedge": "\u2305",
          "bbrk": "\u23B5",
          "bbrktbrk": "\u23B6",
          "bcong": "\u224C",
          "Bcy": "\u0411",
          "bcy": "\u0431",
          "bdquo": "\u201E",
          "becaus": "\u2235",
          "because": "\u2235",
          "Because": "\u2235",
          "bemptyv": "\u29B0",
          "bepsi": "\u03F6",
          "bernou": "\u212C",
          "Bernoullis": "\u212C",
          "Beta": "\u0392",
          "beta": "\u03B2",
          "beth": "\u2136",
          "between": "\u226C",
          "Bfr": "\uD835\uDD05",
          "bfr": "\uD835\uDD1F",
          "bigcap": "\u22C2",
          "bigcirc": "\u25EF",
          "bigcup": "\u22C3",
          "bigodot": "\u2A00",
          "bigoplus": "\u2A01",
          "bigotimes": "\u2A02",
          "bigsqcup": "\u2A06",
          "bigstar": "\u2605",
          "bigtriangledown": "\u25BD",
          "bigtriangleup": "\u25B3",
          "biguplus": "\u2A04",
          "bigvee": "\u22C1",
          "bigwedge": "\u22C0",
          "bkarow": "\u290D",
          "blacklozenge": "\u29EB",
          "blacksquare": "\u25AA",
          "blacktriangle": "\u25B4",
          "blacktriangledown": "\u25BE",
          "blacktriangleleft": "\u25C2",
          "blacktriangleright": "\u25B8",
          "blank": "\u2423",
          "blk12": "\u2592",
          "blk14": "\u2591",
          "blk34": "\u2593",
          "block": "\u2588",
          "bne": "=\u20E5",
          "bnequiv": "\u2261\u20E5",
          "bNot": "\u2AED",
          "bnot": "\u2310",
          "Bopf": "\uD835\uDD39",
          "bopf": "\uD835\uDD53",
          "bot": "\u22A5",
          "bottom": "\u22A5",
          "bowtie": "\u22C8",
          "boxbox": "\u29C9",
          "boxdl": "\u2510",
          "boxdL": "\u2555",
          "boxDl": "\u2556",
          "boxDL": "\u2557",
          "boxdr": "\u250C",
          "boxdR": "\u2552",
          "boxDr": "\u2553",
          "boxDR": "\u2554",
          "boxh": "\u2500",
          "boxH": "\u2550",
          "boxhd": "\u252C",
          "boxHd": "\u2564",
          "boxhD": "\u2565",
          "boxHD": "\u2566",
          "boxhu": "\u2534",
          "boxHu": "\u2567",
          "boxhU": "\u2568",
          "boxHU": "\u2569",
          "boxminus": "\u229F",
          "boxplus": "\u229E",
          "boxtimes": "\u22A0",
          "boxul": "\u2518",
          "boxuL": "\u255B",
          "boxUl": "\u255C",
          "boxUL": "\u255D",
          "boxur": "\u2514",
          "boxuR": "\u2558",
          "boxUr": "\u2559",
          "boxUR": "\u255A",
          "boxv": "\u2502",
          "boxV": "\u2551",
          "boxvh": "\u253C",
          "boxvH": "\u256A",
          "boxVh": "\u256B",
          "boxVH": "\u256C",
          "boxvl": "\u2524",
          "boxvL": "\u2561",
          "boxVl": "\u2562",
          "boxVL": "\u2563",
          "boxvr": "\u251C",
          "boxvR": "\u255E",
          "boxVr": "\u255F",
          "boxVR": "\u2560",
          "bprime": "\u2035",
          "breve": "\u02D8",
          "Breve": "\u02D8",
          "brvbar": "\xA6",
          "bscr": "\uD835\uDCB7",
          "Bscr": "\u212C",
          "bsemi": "\u204F",
          "bsim": "\u223D",
          "bsime": "\u22CD",
          "bsolb": "\u29C5",
          "bsol": "\\",
          "bsolhsub": "\u27C8",
          "bull": "\u2022",
          "bullet": "\u2022",
          "bump": "\u224E",
          "bumpE": "\u2AAE",
          "bumpe": "\u224F",
          "Bumpeq": "\u224E",
          "bumpeq": "\u224F",
          "Cacute": "\u0106",
          "cacute": "\u0107",
          "capand": "\u2A44",
          "capbrcup": "\u2A49",
          "capcap": "\u2A4B",
          "cap": "\u2229",
          "Cap": "\u22D2",
          "capcup": "\u2A47",
          "capdot": "\u2A40",
          "CapitalDifferentialD": "\u2145",
          "caps": "\u2229\uFE00",
          "caret": "\u2041",
          "caron": "\u02C7",
          "Cayleys": "\u212D",
          "ccaps": "\u2A4D",
          "Ccaron": "\u010C",
          "ccaron": "\u010D",
          "Ccedil": "\xC7",
          "ccedil": "\xE7",
          "Ccirc": "\u0108",
          "ccirc": "\u0109",
          "Cconint": "\u2230",
          "ccups": "\u2A4C",
          "ccupssm": "\u2A50",
          "Cdot": "\u010A",
          "cdot": "\u010B",
          "cedil": "\xB8",
          "Cedilla": "\xB8",
          "cemptyv": "\u29B2",
          "cent": "\xA2",
          "centerdot": "\xB7",
          "CenterDot": "\xB7",
          "cfr": "\uD835\uDD20",
          "Cfr": "\u212D",
          "CHcy": "\u0427",
          "chcy": "\u0447",
          "check": "\u2713",
          "checkmark": "\u2713",
          "Chi": "\u03A7",
          "chi": "\u03C7",
          "circ": "\u02C6",
          "circeq": "\u2257",
          "circlearrowleft": "\u21BA",
          "circlearrowright": "\u21BB",
          "circledast": "\u229B",
          "circledcirc": "\u229A",
          "circleddash": "\u229D",
          "CircleDot": "\u2299",
          "circledR": "\xAE",
          "circledS": "\u24C8",
          "CircleMinus": "\u2296",
          "CirclePlus": "\u2295",
          "CircleTimes": "\u2297",
          "cir": "\u25CB",
          "cirE": "\u29C3",
          "cire": "\u2257",
          "cirfnint": "\u2A10",
          "cirmid": "\u2AEF",
          "cirscir": "\u29C2",
          "ClockwiseContourIntegral": "\u2232",
          "CloseCurlyDoubleQuote": "\u201D",
          "CloseCurlyQuote": "\u2019",
          "clubs": "\u2663",
          "clubsuit": "\u2663",
          "colon": ":",
          "Colon": "\u2237",
          "Colone": "\u2A74",
          "colone": "\u2254",
          "coloneq": "\u2254",
          "comma": ",",
          "commat": "@",
          "comp": "\u2201",
          "compfn": "\u2218",
          "complement": "\u2201",
          "complexes": "\u2102",
          "cong": "\u2245",
          "congdot": "\u2A6D",
          "Congruent": "\u2261",
          "conint": "\u222E",
          "Conint": "\u222F",
          "ContourIntegral": "\u222E",
          "copf": "\uD835\uDD54",
          "Copf": "\u2102",
          "coprod": "\u2210",
          "Coproduct": "\u2210",
          "copy": "\xA9",
          "COPY": "\xA9",
          "copysr": "\u2117",
          "CounterClockwiseContourIntegral": "\u2233",
          "crarr": "\u21B5",
          "cross": "\u2717",
          "Cross": "\u2A2F",
          "Cscr": "\uD835\uDC9E",
          "cscr": "\uD835\uDCB8",
          "csub": "\u2ACF",
          "csube": "\u2AD1",
          "csup": "\u2AD0",
          "csupe": "\u2AD2",
          "ctdot": "\u22EF",
          "cudarrl": "\u2938",
          "cudarrr": "\u2935",
          "cuepr": "\u22DE",
          "cuesc": "\u22DF",
          "cularr": "\u21B6",
          "cularrp": "\u293D",
          "cupbrcap": "\u2A48",
          "cupcap": "\u2A46",
          "CupCap": "\u224D",
          "cup": "\u222A",
          "Cup": "\u22D3",
          "cupcup": "\u2A4A",
          "cupdot": "\u228D",
          "cupor": "\u2A45",
          "cups": "\u222A\uFE00",
          "curarr": "\u21B7",
          "curarrm": "\u293C",
          "curlyeqprec": "\u22DE",
          "curlyeqsucc": "\u22DF",
          "curlyvee": "\u22CE",
          "curlywedge": "\u22CF",
          "curren": "\xA4",
          "curvearrowleft": "\u21B6",
          "curvearrowright": "\u21B7",
          "cuvee": "\u22CE",
          "cuwed": "\u22CF",
          "cwconint": "\u2232",
          "cwint": "\u2231",
          "cylcty": "\u232D",
          "dagger": "\u2020",
          "Dagger": "\u2021",
          "daleth": "\u2138",
          "darr": "\u2193",
          "Darr": "\u21A1",
          "dArr": "\u21D3",
          "dash": "\u2010",
          "Dashv": "\u2AE4",
          "dashv": "\u22A3",
          "dbkarow": "\u290F",
          "dblac": "\u02DD",
          "Dcaron": "\u010E",
          "dcaron": "\u010F",
          "Dcy": "\u0414",
          "dcy": "\u0434",
          "ddagger": "\u2021",
          "ddarr": "\u21CA",
          "DD": "\u2145",
          "dd": "\u2146",
          "DDotrahd": "\u2911",
          "ddotseq": "\u2A77",
          "deg": "\xB0",
          "Del": "\u2207",
          "Delta": "\u0394",
          "delta": "\u03B4",
          "demptyv": "\u29B1",
          "dfisht": "\u297F",
          "Dfr": "\uD835\uDD07",
          "dfr": "\uD835\uDD21",
          "dHar": "\u2965",
          "dharl": "\u21C3",
          "dharr": "\u21C2",
          "DiacriticalAcute": "\xB4",
          "DiacriticalDot": "\u02D9",
          "DiacriticalDoubleAcute": "\u02DD",
          "DiacriticalGrave": "`",
          "DiacriticalTilde": "\u02DC",
          "diam": "\u22C4",
          "diamond": "\u22C4",
          "Diamond": "\u22C4",
          "diamondsuit": "\u2666",
          "diams": "\u2666",
          "die": "\xA8",
          "DifferentialD": "\u2146",
          "digamma": "\u03DD",
          "disin": "\u22F2",
          "div": "\xF7",
          "divide": "\xF7",
          "divideontimes": "\u22C7",
          "divonx": "\u22C7",
          "DJcy": "\u0402",
          "djcy": "\u0452",
          "dlcorn": "\u231E",
          "dlcrop": "\u230D",
          "dollar": "$",
          "Dopf": "\uD835\uDD3B",
          "dopf": "\uD835\uDD55",
          "Dot": "\xA8",
          "dot": "\u02D9",
          "DotDot": "\u20DC",
          "doteq": "\u2250",
          "doteqdot": "\u2251",
          "DotEqual": "\u2250",
          "dotminus": "\u2238",
          "dotplus": "\u2214",
          "dotsquare": "\u22A1",
          "doublebarwedge": "\u2306",
          "DoubleContourIntegral": "\u222F",
          "DoubleDot": "\xA8",
          "DoubleDownArrow": "\u21D3",
          "DoubleLeftArrow": "\u21D0",
          "DoubleLeftRightArrow": "\u21D4",
          "DoubleLeftTee": "\u2AE4",
          "DoubleLongLeftArrow": "\u27F8",
          "DoubleLongLeftRightArrow": "\u27FA",
          "DoubleLongRightArrow": "\u27F9",
          "DoubleRightArrow": "\u21D2",
          "DoubleRightTee": "\u22A8",
          "DoubleUpArrow": "\u21D1",
          "DoubleUpDownArrow": "\u21D5",
          "DoubleVerticalBar": "\u2225",
          "DownArrowBar": "\u2913",
          "downarrow": "\u2193",
          "DownArrow": "\u2193",
          "Downarrow": "\u21D3",
          "DownArrowUpArrow": "\u21F5",
          "DownBreve": "\u0311",
          "downdownarrows": "\u21CA",
          "downharpoonleft": "\u21C3",
          "downharpoonright": "\u21C2",
          "DownLeftRightVector": "\u2950",
          "DownLeftTeeVector": "\u295E",
          "DownLeftVectorBar": "\u2956",
          "DownLeftVector": "\u21BD",
          "DownRightTeeVector": "\u295F",
          "DownRightVectorBar": "\u2957",
          "DownRightVector": "\u21C1",
          "DownTeeArrow": "\u21A7",
          "DownTee": "\u22A4",
          "drbkarow": "\u2910",
          "drcorn": "\u231F",
          "drcrop": "\u230C",
          "Dscr": "\uD835\uDC9F",
          "dscr": "\uD835\uDCB9",
          "DScy": "\u0405",
          "dscy": "\u0455",
          "dsol": "\u29F6",
          "Dstrok": "\u0110",
          "dstrok": "\u0111",
          "dtdot": "\u22F1",
          "dtri": "\u25BF",
          "dtrif": "\u25BE",
          "duarr": "\u21F5",
          "duhar": "\u296F",
          "dwangle": "\u29A6",
          "DZcy": "\u040F",
          "dzcy": "\u045F",
          "dzigrarr": "\u27FF",
          "Eacute": "\xC9",
          "eacute": "\xE9",
          "easter": "\u2A6E",
          "Ecaron": "\u011A",
          "ecaron": "\u011B",
          "Ecirc": "\xCA",
          "ecirc": "\xEA",
          "ecir": "\u2256",
          "ecolon": "\u2255",
          "Ecy": "\u042D",
          "ecy": "\u044D",
          "eDDot": "\u2A77",
          "Edot": "\u0116",
          "edot": "\u0117",
          "eDot": "\u2251",
          "ee": "\u2147",
          "efDot": "\u2252",
          "Efr": "\uD835\uDD08",
          "efr": "\uD835\uDD22",
          "eg": "\u2A9A",
          "Egrave": "\xC8",
          "egrave": "\xE8",
          "egs": "\u2A96",
          "egsdot": "\u2A98",
          "el": "\u2A99",
          "Element": "\u2208",
          "elinters": "\u23E7",
          "ell": "\u2113",
          "els": "\u2A95",
          "elsdot": "\u2A97",
          "Emacr": "\u0112",
          "emacr": "\u0113",
          "empty": "\u2205",
          "emptyset": "\u2205",
          "EmptySmallSquare": "\u25FB",
          "emptyv": "\u2205",
          "EmptyVerySmallSquare": "\u25AB",
          "emsp13": "\u2004",
          "emsp14": "\u2005",
          "emsp": "\u2003",
          "ENG": "\u014A",
          "eng": "\u014B",
          "ensp": "\u2002",
          "Eogon": "\u0118",
          "eogon": "\u0119",
          "Eopf": "\uD835\uDD3C",
          "eopf": "\uD835\uDD56",
          "epar": "\u22D5",
          "eparsl": "\u29E3",
          "eplus": "\u2A71",
          "epsi": "\u03B5",
          "Epsilon": "\u0395",
          "epsilon": "\u03B5",
          "epsiv": "\u03F5",
          "eqcirc": "\u2256",
          "eqcolon": "\u2255",
          "eqsim": "\u2242",
          "eqslantgtr": "\u2A96",
          "eqslantless": "\u2A95",
          "Equal": "\u2A75",
          "equals": "=",
          "EqualTilde": "\u2242",
          "equest": "\u225F",
          "Equilibrium": "\u21CC",
          "equiv": "\u2261",
          "equivDD": "\u2A78",
          "eqvparsl": "\u29E5",
          "erarr": "\u2971",
          "erDot": "\u2253",
          "escr": "\u212F",
          "Escr": "\u2130",
          "esdot": "\u2250",
          "Esim": "\u2A73",
          "esim": "\u2242",
          "Eta": "\u0397",
          "eta": "\u03B7",
          "ETH": "\xD0",
          "eth": "\xF0",
          "Euml": "\xCB",
          "euml": "\xEB",
          "euro": "\u20AC",
          "excl": "!",
          "exist": "\u2203",
          "Exists": "\u2203",
          "expectation": "\u2130",
          "exponentiale": "\u2147",
          "ExponentialE": "\u2147",
          "fallingdotseq": "\u2252",
          "Fcy": "\u0424",
          "fcy": "\u0444",
          "female": "\u2640",
          "ffilig": "\uFB03",
          "fflig": "\uFB00",
          "ffllig": "\uFB04",
          "Ffr": "\uD835\uDD09",
          "ffr": "\uD835\uDD23",
          "filig": "\uFB01",
          "FilledSmallSquare": "\u25FC",
          "FilledVerySmallSquare": "\u25AA",
          "fjlig": "fj",
          "flat": "\u266D",
          "fllig": "\uFB02",
          "fltns": "\u25B1",
          "fnof": "\u0192",
          "Fopf": "\uD835\uDD3D",
          "fopf": "\uD835\uDD57",
          "forall": "\u2200",
          "ForAll": "\u2200",
          "fork": "\u22D4",
          "forkv": "\u2AD9",
          "Fouriertrf": "\u2131",
          "fpartint": "\u2A0D",
          "frac12": "\xBD",
          "frac13": "\u2153",
          "frac14": "\xBC",
          "frac15": "\u2155",
          "frac16": "\u2159",
          "frac18": "\u215B",
          "frac23": "\u2154",
          "frac25": "\u2156",
          "frac34": "\xBE",
          "frac35": "\u2157",
          "frac38": "\u215C",
          "frac45": "\u2158",
          "frac56": "\u215A",
          "frac58": "\u215D",
          "frac78": "\u215E",
          "frasl": "\u2044",
          "frown": "\u2322",
          "fscr": "\uD835\uDCBB",
          "Fscr": "\u2131",
          "gacute": "\u01F5",
          "Gamma": "\u0393",
          "gamma": "\u03B3",
          "Gammad": "\u03DC",
          "gammad": "\u03DD",
          "gap": "\u2A86",
          "Gbreve": "\u011E",
          "gbreve": "\u011F",
          "Gcedil": "\u0122",
          "Gcirc": "\u011C",
          "gcirc": "\u011D",
          "Gcy": "\u0413",
          "gcy": "\u0433",
          "Gdot": "\u0120",
          "gdot": "\u0121",
          "ge": "\u2265",
          "gE": "\u2267",
          "gEl": "\u2A8C",
          "gel": "\u22DB",
          "geq": "\u2265",
          "geqq": "\u2267",
          "geqslant": "\u2A7E",
          "gescc": "\u2AA9",
          "ges": "\u2A7E",
          "gesdot": "\u2A80",
          "gesdoto": "\u2A82",
          "gesdotol": "\u2A84",
          "gesl": "\u22DB\uFE00",
          "gesles": "\u2A94",
          "Gfr": "\uD835\uDD0A",
          "gfr": "\uD835\uDD24",
          "gg": "\u226B",
          "Gg": "\u22D9",
          "ggg": "\u22D9",
          "gimel": "\u2137",
          "GJcy": "\u0403",
          "gjcy": "\u0453",
          "gla": "\u2AA5",
          "gl": "\u2277",
          "glE": "\u2A92",
          "glj": "\u2AA4",
          "gnap": "\u2A8A",
          "gnapprox": "\u2A8A",
          "gne": "\u2A88",
          "gnE": "\u2269",
          "gneq": "\u2A88",
          "gneqq": "\u2269",
          "gnsim": "\u22E7",
          "Gopf": "\uD835\uDD3E",
          "gopf": "\uD835\uDD58",
          "grave": "`",
          "GreaterEqual": "\u2265",
          "GreaterEqualLess": "\u22DB",
          "GreaterFullEqual": "\u2267",
          "GreaterGreater": "\u2AA2",
          "GreaterLess": "\u2277",
          "GreaterSlantEqual": "\u2A7E",
          "GreaterTilde": "\u2273",
          "Gscr": "\uD835\uDCA2",
          "gscr": "\u210A",
          "gsim": "\u2273",
          "gsime": "\u2A8E",
          "gsiml": "\u2A90",
          "gtcc": "\u2AA7",
          "gtcir": "\u2A7A",
          "gt": ">",
          "GT": ">",
          "Gt": "\u226B",
          "gtdot": "\u22D7",
          "gtlPar": "\u2995",
          "gtquest": "\u2A7C",
          "gtrapprox": "\u2A86",
          "gtrarr": "\u2978",
          "gtrdot": "\u22D7",
          "gtreqless": "\u22DB",
          "gtreqqless": "\u2A8C",
          "gtrless": "\u2277",
          "gtrsim": "\u2273",
          "gvertneqq": "\u2269\uFE00",
          "gvnE": "\u2269\uFE00",
          "Hacek": "\u02C7",
          "hairsp": "\u200A",
          "half": "\xBD",
          "hamilt": "\u210B",
          "HARDcy": "\u042A",
          "hardcy": "\u044A",
          "harrcir": "\u2948",
          "harr": "\u2194",
          "hArr": "\u21D4",
          "harrw": "\u21AD",
          "Hat": "^",
          "hbar": "\u210F",
          "Hcirc": "\u0124",
          "hcirc": "\u0125",
          "hearts": "\u2665",
          "heartsuit": "\u2665",
          "hellip": "\u2026",
          "hercon": "\u22B9",
          "hfr": "\uD835\uDD25",
          "Hfr": "\u210C",
          "HilbertSpace": "\u210B",
          "hksearow": "\u2925",
          "hkswarow": "\u2926",
          "hoarr": "\u21FF",
          "homtht": "\u223B",
          "hookleftarrow": "\u21A9",
          "hookrightarrow": "\u21AA",
          "hopf": "\uD835\uDD59",
          "Hopf": "\u210D",
          "horbar": "\u2015",
          "HorizontalLine": "\u2500",
          "hscr": "\uD835\uDCBD",
          "Hscr": "\u210B",
          "hslash": "\u210F",
          "Hstrok": "\u0126",
          "hstrok": "\u0127",
          "HumpDownHump": "\u224E",
          "HumpEqual": "\u224F",
          "hybull": "\u2043",
          "hyphen": "\u2010",
          "Iacute": "\xCD",
          "iacute": "\xED",
          "ic": "\u2063",
          "Icirc": "\xCE",
          "icirc": "\xEE",
          "Icy": "\u0418",
          "icy": "\u0438",
          "Idot": "\u0130",
          "IEcy": "\u0415",
          "iecy": "\u0435",
          "iexcl": "\xA1",
          "iff": "\u21D4",
          "ifr": "\uD835\uDD26",
          "Ifr": "\u2111",
          "Igrave": "\xCC",
          "igrave": "\xEC",
          "ii": "\u2148",
          "iiiint": "\u2A0C",
          "iiint": "\u222D",
          "iinfin": "\u29DC",
          "iiota": "\u2129",
          "IJlig": "\u0132",
          "ijlig": "\u0133",
          "Imacr": "\u012A",
          "imacr": "\u012B",
          "image": "\u2111",
          "ImaginaryI": "\u2148",
          "imagline": "\u2110",
          "imagpart": "\u2111",
          "imath": "\u0131",
          "Im": "\u2111",
          "imof": "\u22B7",
          "imped": "\u01B5",
          "Implies": "\u21D2",
          "incare": "\u2105",
          "in": "\u2208",
          "infin": "\u221E",
          "infintie": "\u29DD",
          "inodot": "\u0131",
          "intcal": "\u22BA",
          "int": "\u222B",
          "Int": "\u222C",
          "integers": "\u2124",
          "Integral": "\u222B",
          "intercal": "\u22BA",
          "Intersection": "\u22C2",
          "intlarhk": "\u2A17",
          "intprod": "\u2A3C",
          "InvisibleComma": "\u2063",
          "InvisibleTimes": "\u2062",
          "IOcy": "\u0401",
          "iocy": "\u0451",
          "Iogon": "\u012E",
          "iogon": "\u012F",
          "Iopf": "\uD835\uDD40",
          "iopf": "\uD835\uDD5A",
          "Iota": "\u0399",
          "iota": "\u03B9",
          "iprod": "\u2A3C",
          "iquest": "\xBF",
          "iscr": "\uD835\uDCBE",
          "Iscr": "\u2110",
          "isin": "\u2208",
          "isindot": "\u22F5",
          "isinE": "\u22F9",
          "isins": "\u22F4",
          "isinsv": "\u22F3",
          "isinv": "\u2208",
          "it": "\u2062",
          "Itilde": "\u0128",
          "itilde": "\u0129",
          "Iukcy": "\u0406",
          "iukcy": "\u0456",
          "Iuml": "\xCF",
          "iuml": "\xEF",
          "Jcirc": "\u0134",
          "jcirc": "\u0135",
          "Jcy": "\u0419",
          "jcy": "\u0439",
          "Jfr": "\uD835\uDD0D",
          "jfr": "\uD835\uDD27",
          "jmath": "\u0237",
          "Jopf": "\uD835\uDD41",
          "jopf": "\uD835\uDD5B",
          "Jscr": "\uD835\uDCA5",
          "jscr": "\uD835\uDCBF",
          "Jsercy": "\u0408",
          "jsercy": "\u0458",
          "Jukcy": "\u0404",
          "jukcy": "\u0454",
          "Kappa": "\u039A",
          "kappa": "\u03BA",
          "kappav": "\u03F0",
          "Kcedil": "\u0136",
          "kcedil": "\u0137",
          "Kcy": "\u041A",
          "kcy": "\u043A",
          "Kfr": "\uD835\uDD0E",
          "kfr": "\uD835\uDD28",
          "kgreen": "\u0138",
          "KHcy": "\u0425",
          "khcy": "\u0445",
          "KJcy": "\u040C",
          "kjcy": "\u045C",
          "Kopf": "\uD835\uDD42",
          "kopf": "\uD835\uDD5C",
          "Kscr": "\uD835\uDCA6",
          "kscr": "\uD835\uDCC0",
          "lAarr": "\u21DA",
          "Lacute": "\u0139",
          "lacute": "\u013A",
          "laemptyv": "\u29B4",
          "lagran": "\u2112",
          "Lambda": "\u039B",
          "lambda": "\u03BB",
          "lang": "\u27E8",
          "Lang": "\u27EA",
          "langd": "\u2991",
          "langle": "\u27E8",
          "lap": "\u2A85",
          "Laplacetrf": "\u2112",
          "laquo": "\xAB",
          "larrb": "\u21E4",
          "larrbfs": "\u291F",
          "larr": "\u2190",
          "Larr": "\u219E",
          "lArr": "\u21D0",
          "larrfs": "\u291D",
          "larrhk": "\u21A9",
          "larrlp": "\u21AB",
          "larrpl": "\u2939",
          "larrsim": "\u2973",
          "larrtl": "\u21A2",
          "latail": "\u2919",
          "lAtail": "\u291B",
          "lat": "\u2AAB",
          "late": "\u2AAD",
          "lates": "\u2AAD\uFE00",
          "lbarr": "\u290C",
          "lBarr": "\u290E",
          "lbbrk": "\u2772",
          "lbrace": "{",
          "lbrack": "[",
          "lbrke": "\u298B",
          "lbrksld": "\u298F",
          "lbrkslu": "\u298D",
          "Lcaron": "\u013D",
          "lcaron": "\u013E",
          "Lcedil": "\u013B",
          "lcedil": "\u013C",
          "lceil": "\u2308",
          "lcub": "{",
          "Lcy": "\u041B",
          "lcy": "\u043B",
          "ldca": "\u2936",
          "ldquo": "\u201C",
          "ldquor": "\u201E",
          "ldrdhar": "\u2967",
          "ldrushar": "\u294B",
          "ldsh": "\u21B2",
          "le": "\u2264",
          "lE": "\u2266",
          "LeftAngleBracket": "\u27E8",
          "LeftArrowBar": "\u21E4",
          "leftarrow": "\u2190",
          "LeftArrow": "\u2190",
          "Leftarrow": "\u21D0",
          "LeftArrowRightArrow": "\u21C6",
          "leftarrowtail": "\u21A2",
          "LeftCeiling": "\u2308",
          "LeftDoubleBracket": "\u27E6",
          "LeftDownTeeVector": "\u2961",
          "LeftDownVectorBar": "\u2959",
          "LeftDownVector": "\u21C3",
          "LeftFloor": "\u230A",
          "leftharpoondown": "\u21BD",
          "leftharpoonup": "\u21BC",
          "leftleftarrows": "\u21C7",
          "leftrightarrow": "\u2194",
          "LeftRightArrow": "\u2194",
          "Leftrightarrow": "\u21D4",
          "leftrightarrows": "\u21C6",
          "leftrightharpoons": "\u21CB",
          "leftrightsquigarrow": "\u21AD",
          "LeftRightVector": "\u294E",
          "LeftTeeArrow": "\u21A4",
          "LeftTee": "\u22A3",
          "LeftTeeVector": "\u295A",
          "leftthreetimes": "\u22CB",
          "LeftTriangleBar": "\u29CF",
          "LeftTriangle": "\u22B2",
          "LeftTriangleEqual": "\u22B4",
          "LeftUpDownVector": "\u2951",
          "LeftUpTeeVector": "\u2960",
          "LeftUpVectorBar": "\u2958",
          "LeftUpVector": "\u21BF",
          "LeftVectorBar": "\u2952",
          "LeftVector": "\u21BC",
          "lEg": "\u2A8B",
          "leg": "\u22DA",
          "leq": "\u2264",
          "leqq": "\u2266",
          "leqslant": "\u2A7D",
          "lescc": "\u2AA8",
          "les": "\u2A7D",
          "lesdot": "\u2A7F",
          "lesdoto": "\u2A81",
          "lesdotor": "\u2A83",
          "lesg": "\u22DA\uFE00",
          "lesges": "\u2A93",
          "lessapprox": "\u2A85",
          "lessdot": "\u22D6",
          "lesseqgtr": "\u22DA",
          "lesseqqgtr": "\u2A8B",
          "LessEqualGreater": "\u22DA",
          "LessFullEqual": "\u2266",
          "LessGreater": "\u2276",
          "lessgtr": "\u2276",
          "LessLess": "\u2AA1",
          "lesssim": "\u2272",
          "LessSlantEqual": "\u2A7D",
          "LessTilde": "\u2272",
          "lfisht": "\u297C",
          "lfloor": "\u230A",
          "Lfr": "\uD835\uDD0F",
          "lfr": "\uD835\uDD29",
          "lg": "\u2276",
          "lgE": "\u2A91",
          "lHar": "\u2962",
          "lhard": "\u21BD",
          "lharu": "\u21BC",
          "lharul": "\u296A",
          "lhblk": "\u2584",
          "LJcy": "\u0409",
          "ljcy": "\u0459",
          "llarr": "\u21C7",
          "ll": "\u226A",
          "Ll": "\u22D8",
          "llcorner": "\u231E",
          "Lleftarrow": "\u21DA",
          "llhard": "\u296B",
          "lltri": "\u25FA",
          "Lmidot": "\u013F",
          "lmidot": "\u0140",
          "lmoustache": "\u23B0",
          "lmoust": "\u23B0",
          "lnap": "\u2A89",
          "lnapprox": "\u2A89",
          "lne": "\u2A87",
          "lnE": "\u2268",
          "lneq": "\u2A87",
          "lneqq": "\u2268",
          "lnsim": "\u22E6",
          "loang": "\u27EC",
          "loarr": "\u21FD",
          "lobrk": "\u27E6",
          "longleftarrow": "\u27F5",
          "LongLeftArrow": "\u27F5",
          "Longleftarrow": "\u27F8",
          "longleftrightarrow": "\u27F7",
          "LongLeftRightArrow": "\u27F7",
          "Longleftrightarrow": "\u27FA",
          "longmapsto": "\u27FC",
          "longrightarrow": "\u27F6",
          "LongRightArrow": "\u27F6",
          "Longrightarrow": "\u27F9",
          "looparrowleft": "\u21AB",
          "looparrowright": "\u21AC",
          "lopar": "\u2985",
          "Lopf": "\uD835\uDD43",
          "lopf": "\uD835\uDD5D",
          "loplus": "\u2A2D",
          "lotimes": "\u2A34",
          "lowast": "\u2217",
          "lowbar": "_",
          "LowerLeftArrow": "\u2199",
          "LowerRightArrow": "\u2198",
          "loz": "\u25CA",
          "lozenge": "\u25CA",
          "lozf": "\u29EB",
          "lpar": "(",
          "lparlt": "\u2993",
          "lrarr": "\u21C6",
          "lrcorner": "\u231F",
          "lrhar": "\u21CB",
          "lrhard": "\u296D",
          "lrm": "\u200E",
          "lrtri": "\u22BF",
          "lsaquo": "\u2039",
          "lscr": "\uD835\uDCC1",
          "Lscr": "\u2112",
          "lsh": "\u21B0",
          "Lsh": "\u21B0",
          "lsim": "\u2272",
          "lsime": "\u2A8D",
          "lsimg": "\u2A8F",
          "lsqb": "[",
          "lsquo": "\u2018",
          "lsquor": "\u201A",
          "Lstrok": "\u0141",
          "lstrok": "\u0142",
          "ltcc": "\u2AA6",
          "ltcir": "\u2A79",
          "lt": "<",
          "LT": "<",
          "Lt": "\u226A",
          "ltdot": "\u22D6",
          "lthree": "\u22CB",
          "ltimes": "\u22C9",
          "ltlarr": "\u2976",
          "ltquest": "\u2A7B",
          "ltri": "\u25C3",
          "ltrie": "\u22B4",
          "ltrif": "\u25C2",
          "ltrPar": "\u2996",
          "lurdshar": "\u294A",
          "luruhar": "\u2966",
          "lvertneqq": "\u2268\uFE00",
          "lvnE": "\u2268\uFE00",
          "macr": "\xAF",
          "male": "\u2642",
          "malt": "\u2720",
          "maltese": "\u2720",
          "Map": "\u2905",
          "map": "\u21A6",
          "mapsto": "\u21A6",
          "mapstodown": "\u21A7",
          "mapstoleft": "\u21A4",
          "mapstoup": "\u21A5",
          "marker": "\u25AE",
          "mcomma": "\u2A29",
          "Mcy": "\u041C",
          "mcy": "\u043C",
          "mdash": "\u2014",
          "mDDot": "\u223A",
          "measuredangle": "\u2221",
          "MediumSpace": "\u205F",
          "Mellintrf": "\u2133",
          "Mfr": "\uD835\uDD10",
          "mfr": "\uD835\uDD2A",
          "mho": "\u2127",
          "micro": "\xB5",
          "midast": "*",
          "midcir": "\u2AF0",
          "mid": "\u2223",
          "middot": "\xB7",
          "minusb": "\u229F",
          "minus": "\u2212",
          "minusd": "\u2238",
          "minusdu": "\u2A2A",
          "MinusPlus": "\u2213",
          "mlcp": "\u2ADB",
          "mldr": "\u2026",
          "mnplus": "\u2213",
          "models": "\u22A7",
          "Mopf": "\uD835\uDD44",
          "mopf": "\uD835\uDD5E",
          "mp": "\u2213",
          "mscr": "\uD835\uDCC2",
          "Mscr": "\u2133",
          "mstpos": "\u223E",
          "Mu": "\u039C",
          "mu": "\u03BC",
          "multimap": "\u22B8",
          "mumap": "\u22B8",
          "nabla": "\u2207",
          "Nacute": "\u0143",
          "nacute": "\u0144",
          "nang": "\u2220\u20D2",
          "nap": "\u2249",
          "napE": "\u2A70\u0338",
          "napid": "\u224B\u0338",
          "napos": "\u0149",
          "napprox": "\u2249",
          "natural": "\u266E",
          "naturals": "\u2115",
          "natur": "\u266E",
          "nbsp": "\xA0",
          "nbump": "\u224E\u0338",
          "nbumpe": "\u224F\u0338",
          "ncap": "\u2A43",
          "Ncaron": "\u0147",
          "ncaron": "\u0148",
          "Ncedil": "\u0145",
          "ncedil": "\u0146",
          "ncong": "\u2247",
          "ncongdot": "\u2A6D\u0338",
          "ncup": "\u2A42",
          "Ncy": "\u041D",
          "ncy": "\u043D",
          "ndash": "\u2013",
          "nearhk": "\u2924",
          "nearr": "\u2197",
          "neArr": "\u21D7",
          "nearrow": "\u2197",
          "ne": "\u2260",
          "nedot": "\u2250\u0338",
          "NegativeMediumSpace": "\u200B",
          "NegativeThickSpace": "\u200B",
          "NegativeThinSpace": "\u200B",
          "NegativeVeryThinSpace": "\u200B",
          "nequiv": "\u2262",
          "nesear": "\u2928",
          "nesim": "\u2242\u0338",
          "NestedGreaterGreater": "\u226B",
          "NestedLessLess": "\u226A",
          "NewLine": "\n",
          "nexist": "\u2204",
          "nexists": "\u2204",
          "Nfr": "\uD835\uDD11",
          "nfr": "\uD835\uDD2B",
          "ngE": "\u2267\u0338",
          "nge": "\u2271",
          "ngeq": "\u2271",
          "ngeqq": "\u2267\u0338",
          "ngeqslant": "\u2A7E\u0338",
          "nges": "\u2A7E\u0338",
          "nGg": "\u22D9\u0338",
          "ngsim": "\u2275",
          "nGt": "\u226B\u20D2",
          "ngt": "\u226F",
          "ngtr": "\u226F",
          "nGtv": "\u226B\u0338",
          "nharr": "\u21AE",
          "nhArr": "\u21CE",
          "nhpar": "\u2AF2",
          "ni": "\u220B",
          "nis": "\u22FC",
          "nisd": "\u22FA",
          "niv": "\u220B",
          "NJcy": "\u040A",
          "njcy": "\u045A",
          "nlarr": "\u219A",
          "nlArr": "\u21CD",
          "nldr": "\u2025",
          "nlE": "\u2266\u0338",
          "nle": "\u2270",
          "nleftarrow": "\u219A",
          "nLeftarrow": "\u21CD",
          "nleftrightarrow": "\u21AE",
          "nLeftrightarrow": "\u21CE",
          "nleq": "\u2270",
          "nleqq": "\u2266\u0338",
          "nleqslant": "\u2A7D\u0338",
          "nles": "\u2A7D\u0338",
          "nless": "\u226E",
          "nLl": "\u22D8\u0338",
          "nlsim": "\u2274",
          "nLt": "\u226A\u20D2",
          "nlt": "\u226E",
          "nltri": "\u22EA",
          "nltrie": "\u22EC",
          "nLtv": "\u226A\u0338",
          "nmid": "\u2224",
          "NoBreak": "\u2060",
          "NonBreakingSpace": "\xA0",
          "nopf": "\uD835\uDD5F",
          "Nopf": "\u2115",
          "Not": "\u2AEC",
          "not": "\xAC",
          "NotCongruent": "\u2262",
          "NotCupCap": "\u226D",
          "NotDoubleVerticalBar": "\u2226",
          "NotElement": "\u2209",
          "NotEqual": "\u2260",
          "NotEqualTilde": "\u2242\u0338",
          "NotExists": "\u2204",
          "NotGreater": "\u226F",
          "NotGreaterEqual": "\u2271",
          "NotGreaterFullEqual": "\u2267\u0338",
          "NotGreaterGreater": "\u226B\u0338",
          "NotGreaterLess": "\u2279",
          "NotGreaterSlantEqual": "\u2A7E\u0338",
          "NotGreaterTilde": "\u2275",
          "NotHumpDownHump": "\u224E\u0338",
          "NotHumpEqual": "\u224F\u0338",
          "notin": "\u2209",
          "notindot": "\u22F5\u0338",
          "notinE": "\u22F9\u0338",
          "notinva": "\u2209",
          "notinvb": "\u22F7",
          "notinvc": "\u22F6",
          "NotLeftTriangleBar": "\u29CF\u0338",
          "NotLeftTriangle": "\u22EA",
          "NotLeftTriangleEqual": "\u22EC",
          "NotLess": "\u226E",
          "NotLessEqual": "\u2270",
          "NotLessGreater": "\u2278",
          "NotLessLess": "\u226A\u0338",
          "NotLessSlantEqual": "\u2A7D\u0338",
          "NotLessTilde": "\u2274",
          "NotNestedGreaterGreater": "\u2AA2\u0338",
          "NotNestedLessLess": "\u2AA1\u0338",
          "notni": "\u220C",
          "notniva": "\u220C",
          "notnivb": "\u22FE",
          "notnivc": "\u22FD",
          "NotPrecedes": "\u2280",
          "NotPrecedesEqual": "\u2AAF\u0338",
          "NotPrecedesSlantEqual": "\u22E0",
          "NotReverseElement": "\u220C",
          "NotRightTriangleBar": "\u29D0\u0338",
          "NotRightTriangle": "\u22EB",
          "NotRightTriangleEqual": "\u22ED",
          "NotSquareSubset": "\u228F\u0338",
          "NotSquareSubsetEqual": "\u22E2",
          "NotSquareSuperset": "\u2290\u0338",
          "NotSquareSupersetEqual": "\u22E3",
          "NotSubset": "\u2282\u20D2",
          "NotSubsetEqual": "\u2288",
          "NotSucceeds": "\u2281",
          "NotSucceedsEqual": "\u2AB0\u0338",
          "NotSucceedsSlantEqual": "\u22E1",
          "NotSucceedsTilde": "\u227F\u0338",
          "NotSuperset": "\u2283\u20D2",
          "NotSupersetEqual": "\u2289",
          "NotTilde": "\u2241",
          "NotTildeEqual": "\u2244",
          "NotTildeFullEqual": "\u2247",
          "NotTildeTilde": "\u2249",
          "NotVerticalBar": "\u2224",
          "nparallel": "\u2226",
          "npar": "\u2226",
          "nparsl": "\u2AFD\u20E5",
          "npart": "\u2202\u0338",
          "npolint": "\u2A14",
          "npr": "\u2280",
          "nprcue": "\u22E0",
          "nprec": "\u2280",
          "npreceq": "\u2AAF\u0338",
          "npre": "\u2AAF\u0338",
          "nrarrc": "\u2933\u0338",
          "nrarr": "\u219B",
          "nrArr": "\u21CF",
          "nrarrw": "\u219D\u0338",
          "nrightarrow": "\u219B",
          "nRightarrow": "\u21CF",
          "nrtri": "\u22EB",
          "nrtrie": "\u22ED",
          "nsc": "\u2281",
          "nsccue": "\u22E1",
          "nsce": "\u2AB0\u0338",
          "Nscr": "\uD835\uDCA9",
          "nscr": "\uD835\uDCC3",
          "nshortmid": "\u2224",
          "nshortparallel": "\u2226",
          "nsim": "\u2241",
          "nsime": "\u2244",
          "nsimeq": "\u2244",
          "nsmid": "\u2224",
          "nspar": "\u2226",
          "nsqsube": "\u22E2",
          "nsqsupe": "\u22E3",
          "nsub": "\u2284",
          "nsubE": "\u2AC5\u0338",
          "nsube": "\u2288",
          "nsubset": "\u2282\u20D2",
          "nsubseteq": "\u2288",
          "nsubseteqq": "\u2AC5\u0338",
          "nsucc": "\u2281",
          "nsucceq": "\u2AB0\u0338",
          "nsup": "\u2285",
          "nsupE": "\u2AC6\u0338",
          "nsupe": "\u2289",
          "nsupset": "\u2283\u20D2",
          "nsupseteq": "\u2289",
          "nsupseteqq": "\u2AC6\u0338",
          "ntgl": "\u2279",
          "Ntilde": "\xD1",
          "ntilde": "\xF1",
          "ntlg": "\u2278",
          "ntriangleleft": "\u22EA",
          "ntrianglelefteq": "\u22EC",
          "ntriangleright": "\u22EB",
          "ntrianglerighteq": "\u22ED",
          "Nu": "\u039D",
          "nu": "\u03BD",
          "num": "#",
          "numero": "\u2116",
          "numsp": "\u2007",
          "nvap": "\u224D\u20D2",
          "nvdash": "\u22AC",
          "nvDash": "\u22AD",
          "nVdash": "\u22AE",
          "nVDash": "\u22AF",
          "nvge": "\u2265\u20D2",
          "nvgt": ">\u20D2",
          "nvHarr": "\u2904",
          "nvinfin": "\u29DE",
          "nvlArr": "\u2902",
          "nvle": "\u2264\u20D2",
          "nvlt": "<\u20D2",
          "nvltrie": "\u22B4\u20D2",
          "nvrArr": "\u2903",
          "nvrtrie": "\u22B5\u20D2",
          "nvsim": "\u223C\u20D2",
          "nwarhk": "\u2923",
          "nwarr": "\u2196",
          "nwArr": "\u21D6",
          "nwarrow": "\u2196",
          "nwnear": "\u2927",
          "Oacute": "\xD3",
          "oacute": "\xF3",
          "oast": "\u229B",
          "Ocirc": "\xD4",
          "ocirc": "\xF4",
          "ocir": "\u229A",
          "Ocy": "\u041E",
          "ocy": "\u043E",
          "odash": "\u229D",
          "Odblac": "\u0150",
          "odblac": "\u0151",
          "odiv": "\u2A38",
          "odot": "\u2299",
          "odsold": "\u29BC",
          "OElig": "\u0152",
          "oelig": "\u0153",
          "ofcir": "\u29BF",
          "Ofr": "\uD835\uDD12",
          "ofr": "\uD835\uDD2C",
          "ogon": "\u02DB",
          "Ograve": "\xD2",
          "ograve": "\xF2",
          "ogt": "\u29C1",
          "ohbar": "\u29B5",
          "ohm": "\u03A9",
          "oint": "\u222E",
          "olarr": "\u21BA",
          "olcir": "\u29BE",
          "olcross": "\u29BB",
          "oline": "\u203E",
          "olt": "\u29C0",
          "Omacr": "\u014C",
          "omacr": "\u014D",
          "Omega": "\u03A9",
          "omega": "\u03C9",
          "Omicron": "\u039F",
          "omicron": "\u03BF",
          "omid": "\u29B6",
          "ominus": "\u2296",
          "Oopf": "\uD835\uDD46",
          "oopf": "\uD835\uDD60",
          "opar": "\u29B7",
          "OpenCurlyDoubleQuote": "\u201C",
          "OpenCurlyQuote": "\u2018",
          "operp": "\u29B9",
          "oplus": "\u2295",
          "orarr": "\u21BB",
          "Or": "\u2A54",
          "or": "\u2228",
          "ord": "\u2A5D",
          "order": "\u2134",
          "orderof": "\u2134",
          "ordf": "\xAA",
          "ordm": "\xBA",
          "origof": "\u22B6",
          "oror": "\u2A56",
          "orslope": "\u2A57",
          "orv": "\u2A5B",
          "oS": "\u24C8",
          "Oscr": "\uD835\uDCAA",
          "oscr": "\u2134",
          "Oslash": "\xD8",
          "oslash": "\xF8",
          "osol": "\u2298",
          "Otilde": "\xD5",
          "otilde": "\xF5",
          "otimesas": "\u2A36",
          "Otimes": "\u2A37",
          "otimes": "\u2297",
          "Ouml": "\xD6",
          "ouml": "\xF6",
          "ovbar": "\u233D",
          "OverBar": "\u203E",
          "OverBrace": "\u23DE",
          "OverBracket": "\u23B4",
          "OverParenthesis": "\u23DC",
          "para": "\xB6",
          "parallel": "\u2225",
          "par": "\u2225",
          "parsim": "\u2AF3",
          "parsl": "\u2AFD",
          "part": "\u2202",
          "PartialD": "\u2202",
          "Pcy": "\u041F",
          "pcy": "\u043F",
          "percnt": "%",
          "period": ".",
          "permil": "\u2030",
          "perp": "\u22A5",
          "pertenk": "\u2031",
          "Pfr": "\uD835\uDD13",
          "pfr": "\uD835\uDD2D",
          "Phi": "\u03A6",
          "phi": "\u03C6",
          "phiv": "\u03D5",
          "phmmat": "\u2133",
          "phone": "\u260E",
          "Pi": "\u03A0",
          "pi": "\u03C0",
          "pitchfork": "\u22D4",
          "piv": "\u03D6",
          "planck": "\u210F",
          "planckh": "\u210E",
          "plankv": "\u210F",
          "plusacir": "\u2A23",
          "plusb": "\u229E",
          "pluscir": "\u2A22",
          "plus": "+",
          "plusdo": "\u2214",
          "plusdu": "\u2A25",
          "pluse": "\u2A72",
          "PlusMinus": "\xB1",
          "plusmn": "\xB1",
          "plussim": "\u2A26",
          "plustwo": "\u2A27",
          "pm": "\xB1",
          "Poincareplane": "\u210C",
          "pointint": "\u2A15",
          "popf": "\uD835\uDD61",
          "Popf": "\u2119",
          "pound": "\xA3",
          "prap": "\u2AB7",
          "Pr": "\u2ABB",
          "pr": "\u227A",
          "prcue": "\u227C",
          "precapprox": "\u2AB7",
          "prec": "\u227A",
          "preccurlyeq": "\u227C",
          "Precedes": "\u227A",
          "PrecedesEqual": "\u2AAF",
          "PrecedesSlantEqual": "\u227C",
          "PrecedesTilde": "\u227E",
          "preceq": "\u2AAF",
          "precnapprox": "\u2AB9",
          "precneqq": "\u2AB5",
          "precnsim": "\u22E8",
          "pre": "\u2AAF",
          "prE": "\u2AB3",
          "precsim": "\u227E",
          "prime": "\u2032",
          "Prime": "\u2033",
          "primes": "\u2119",
          "prnap": "\u2AB9",
          "prnE": "\u2AB5",
          "prnsim": "\u22E8",
          "prod": "\u220F",
          "Product": "\u220F",
          "profalar": "\u232E",
          "profline": "\u2312",
          "profsurf": "\u2313",
          "prop": "\u221D",
          "Proportional": "\u221D",
          "Proportion": "\u2237",
          "propto": "\u221D",
          "prsim": "\u227E",
          "prurel": "\u22B0",
          "Pscr": "\uD835\uDCAB",
          "pscr": "\uD835\uDCC5",
          "Psi": "\u03A8",
          "psi": "\u03C8",
          "puncsp": "\u2008",
          "Qfr": "\uD835\uDD14",
          "qfr": "\uD835\uDD2E",
          "qint": "\u2A0C",
          "qopf": "\uD835\uDD62",
          "Qopf": "\u211A",
          "qprime": "\u2057",
          "Qscr": "\uD835\uDCAC",
          "qscr": "\uD835\uDCC6",
          "quaternions": "\u210D",
          "quatint": "\u2A16",
          "quest": "?",
          "questeq": "\u225F",
          "quot": "\"",
          "QUOT": "\"",
          "rAarr": "\u21DB",
          "race": "\u223D\u0331",
          "Racute": "\u0154",
          "racute": "\u0155",
          "radic": "\u221A",
          "raemptyv": "\u29B3",
          "rang": "\u27E9",
          "Rang": "\u27EB",
          "rangd": "\u2992",
          "range": "\u29A5",
          "rangle": "\u27E9",
          "raquo": "\xBB",
          "rarrap": "\u2975",
          "rarrb": "\u21E5",
          "rarrbfs": "\u2920",
          "rarrc": "\u2933",
          "rarr": "\u2192",
          "Rarr": "\u21A0",
          "rArr": "\u21D2",
          "rarrfs": "\u291E",
          "rarrhk": "\u21AA",
          "rarrlp": "\u21AC",
          "rarrpl": "\u2945",
          "rarrsim": "\u2974",
          "Rarrtl": "\u2916",
          "rarrtl": "\u21A3",
          "rarrw": "\u219D",
          "ratail": "\u291A",
          "rAtail": "\u291C",
          "ratio": "\u2236",
          "rationals": "\u211A",
          "rbarr": "\u290D",
          "rBarr": "\u290F",
          "RBarr": "\u2910",
          "rbbrk": "\u2773",
          "rbrace": "}",
          "rbrack": "]",
          "rbrke": "\u298C",
          "rbrksld": "\u298E",
          "rbrkslu": "\u2990",
          "Rcaron": "\u0158",
          "rcaron": "\u0159",
          "Rcedil": "\u0156",
          "rcedil": "\u0157",
          "rceil": "\u2309",
          "rcub": "}",
          "Rcy": "\u0420",
          "rcy": "\u0440",
          "rdca": "\u2937",
          "rdldhar": "\u2969",
          "rdquo": "\u201D",
          "rdquor": "\u201D",
          "rdsh": "\u21B3",
          "real": "\u211C",
          "realine": "\u211B",
          "realpart": "\u211C",
          "reals": "\u211D",
          "Re": "\u211C",
          "rect": "\u25AD",
          "reg": "\xAE",
          "REG": "\xAE",
          "ReverseElement": "\u220B",
          "ReverseEquilibrium": "\u21CB",
          "ReverseUpEquilibrium": "\u296F",
          "rfisht": "\u297D",
          "rfloor": "\u230B",
          "rfr": "\uD835\uDD2F",
          "Rfr": "\u211C",
          "rHar": "\u2964",
          "rhard": "\u21C1",
          "rharu": "\u21C0",
          "rharul": "\u296C",
          "Rho": "\u03A1",
          "rho": "\u03C1",
          "rhov": "\u03F1",
          "RightAngleBracket": "\u27E9",
          "RightArrowBar": "\u21E5",
          "rightarrow": "\u2192",
          "RightArrow": "\u2192",
          "Rightarrow": "\u21D2",
          "RightArrowLeftArrow": "\u21C4",
          "rightarrowtail": "\u21A3",
          "RightCeiling": "\u2309",
          "RightDoubleBracket": "\u27E7",
          "RightDownTeeVector": "\u295D",
          "RightDownVectorBar": "\u2955",
          "RightDownVector": "\u21C2",
          "RightFloor": "\u230B",
          "rightharpoondown": "\u21C1",
          "rightharpoonup": "\u21C0",
          "rightleftarrows": "\u21C4",
          "rightleftharpoons": "\u21CC",
          "rightrightarrows": "\u21C9",
          "rightsquigarrow": "\u219D",
          "RightTeeArrow": "\u21A6",
          "RightTee": "\u22A2",
          "RightTeeVector": "\u295B",
          "rightthreetimes": "\u22CC",
          "RightTriangleBar": "\u29D0",
          "RightTriangle": "\u22B3",
          "RightTriangleEqual": "\u22B5",
          "RightUpDownVector": "\u294F",
          "RightUpTeeVector": "\u295C",
          "RightUpVectorBar": "\u2954",
          "RightUpVector": "\u21BE",
          "RightVectorBar": "\u2953",
          "RightVector": "\u21C0",
          "ring": "\u02DA",
          "risingdotseq": "\u2253",
          "rlarr": "\u21C4",
          "rlhar": "\u21CC",
          "rlm": "\u200F",
          "rmoustache": "\u23B1",
          "rmoust": "\u23B1",
          "rnmid": "\u2AEE",
          "roang": "\u27ED",
          "roarr": "\u21FE",
          "robrk": "\u27E7",
          "ropar": "\u2986",
          "ropf": "\uD835\uDD63",
          "Ropf": "\u211D",
          "roplus": "\u2A2E",
          "rotimes": "\u2A35",
          "RoundImplies": "\u2970",
          "rpar": ")",
          "rpargt": "\u2994",
          "rppolint": "\u2A12",
          "rrarr": "\u21C9",
          "Rrightarrow": "\u21DB",
          "rsaquo": "\u203A",
          "rscr": "\uD835\uDCC7",
          "Rscr": "\u211B",
          "rsh": "\u21B1",
          "Rsh": "\u21B1",
          "rsqb": "]",
          "rsquo": "\u2019",
          "rsquor": "\u2019",
          "rthree": "\u22CC",
          "rtimes": "\u22CA",
          "rtri": "\u25B9",
          "rtrie": "\u22B5",
          "rtrif": "\u25B8",
          "rtriltri": "\u29CE",
          "RuleDelayed": "\u29F4",
          "ruluhar": "\u2968",
          "rx": "\u211E",
          "Sacute": "\u015A",
          "sacute": "\u015B",
          "sbquo": "\u201A",
          "scap": "\u2AB8",
          "Scaron": "\u0160",
          "scaron": "\u0161",
          "Sc": "\u2ABC",
          "sc": "\u227B",
          "sccue": "\u227D",
          "sce": "\u2AB0",
          "scE": "\u2AB4",
          "Scedil": "\u015E",
          "scedil": "\u015F",
          "Scirc": "\u015C",
          "scirc": "\u015D",
          "scnap": "\u2ABA",
          "scnE": "\u2AB6",
          "scnsim": "\u22E9",
          "scpolint": "\u2A13",
          "scsim": "\u227F",
          "Scy": "\u0421",
          "scy": "\u0441",
          "sdotb": "\u22A1",
          "sdot": "\u22C5",
          "sdote": "\u2A66",
          "searhk": "\u2925",
          "searr": "\u2198",
          "seArr": "\u21D8",
          "searrow": "\u2198",
          "sect": "\xA7",
          "semi": ";",
          "seswar": "\u2929",
          "setminus": "\u2216",
          "setmn": "\u2216",
          "sext": "\u2736",
          "Sfr": "\uD835\uDD16",
          "sfr": "\uD835\uDD30",
          "sfrown": "\u2322",
          "sharp": "\u266F",
          "SHCHcy": "\u0429",
          "shchcy": "\u0449",
          "SHcy": "\u0428",
          "shcy": "\u0448",
          "ShortDownArrow": "\u2193",
          "ShortLeftArrow": "\u2190",
          "shortmid": "\u2223",
          "shortparallel": "\u2225",
          "ShortRightArrow": "\u2192",
          "ShortUpArrow": "\u2191",
          "shy": "\xAD",
          "Sigma": "\u03A3",
          "sigma": "\u03C3",
          "sigmaf": "\u03C2",
          "sigmav": "\u03C2",
          "sim": "\u223C",
          "simdot": "\u2A6A",
          "sime": "\u2243",
          "simeq": "\u2243",
          "simg": "\u2A9E",
          "simgE": "\u2AA0",
          "siml": "\u2A9D",
          "simlE": "\u2A9F",
          "simne": "\u2246",
          "simplus": "\u2A24",
          "simrarr": "\u2972",
          "slarr": "\u2190",
          "SmallCircle": "\u2218",
          "smallsetminus": "\u2216",
          "smashp": "\u2A33",
          "smeparsl": "\u29E4",
          "smid": "\u2223",
          "smile": "\u2323",
          "smt": "\u2AAA",
          "smte": "\u2AAC",
          "smtes": "\u2AAC\uFE00",
          "SOFTcy": "\u042C",
          "softcy": "\u044C",
          "solbar": "\u233F",
          "solb": "\u29C4",
          "sol": "/",
          "Sopf": "\uD835\uDD4A",
          "sopf": "\uD835\uDD64",
          "spades": "\u2660",
          "spadesuit": "\u2660",
          "spar": "\u2225",
          "sqcap": "\u2293",
          "sqcaps": "\u2293\uFE00",
          "sqcup": "\u2294",
          "sqcups": "\u2294\uFE00",
          "Sqrt": "\u221A",
          "sqsub": "\u228F",
          "sqsube": "\u2291",
          "sqsubset": "\u228F",
          "sqsubseteq": "\u2291",
          "sqsup": "\u2290",
          "sqsupe": "\u2292",
          "sqsupset": "\u2290",
          "sqsupseteq": "\u2292",
          "square": "\u25A1",
          "Square": "\u25A1",
          "SquareIntersection": "\u2293",
          "SquareSubset": "\u228F",
          "SquareSubsetEqual": "\u2291",
          "SquareSuperset": "\u2290",
          "SquareSupersetEqual": "\u2292",
          "SquareUnion": "\u2294",
          "squarf": "\u25AA",
          "squ": "\u25A1",
          "squf": "\u25AA",
          "srarr": "\u2192",
          "Sscr": "\uD835\uDCAE",
          "sscr": "\uD835\uDCC8",
          "ssetmn": "\u2216",
          "ssmile": "\u2323",
          "sstarf": "\u22C6",
          "Star": "\u22C6",
          "star": "\u2606",
          "starf": "\u2605",
          "straightepsilon": "\u03F5",
          "straightphi": "\u03D5",
          "strns": "\xAF",
          "sub": "\u2282",
          "Sub": "\u22D0",
          "subdot": "\u2ABD",
          "subE": "\u2AC5",
          "sube": "\u2286",
          "subedot": "\u2AC3",
          "submult": "\u2AC1",
          "subnE": "\u2ACB",
          "subne": "\u228A",
          "subplus": "\u2ABF",
          "subrarr": "\u2979",
          "subset": "\u2282",
          "Subset": "\u22D0",
          "subseteq": "\u2286",
          "subseteqq": "\u2AC5",
          "SubsetEqual": "\u2286",
          "subsetneq": "\u228A",
          "subsetneqq": "\u2ACB",
          "subsim": "\u2AC7",
          "subsub": "\u2AD5",
          "subsup": "\u2AD3",
          "succapprox": "\u2AB8",
          "succ": "\u227B",
          "succcurlyeq": "\u227D",
          "Succeeds": "\u227B",
          "SucceedsEqual": "\u2AB0",
          "SucceedsSlantEqual": "\u227D",
          "SucceedsTilde": "\u227F",
          "succeq": "\u2AB0",
          "succnapprox": "\u2ABA",
          "succneqq": "\u2AB6",
          "succnsim": "\u22E9",
          "succsim": "\u227F",
          "SuchThat": "\u220B",
          "sum": "\u2211",
          "Sum": "\u2211",
          "sung": "\u266A",
          "sup1": "\xB9",
          "sup2": "\xB2",
          "sup3": "\xB3",
          "sup": "\u2283",
          "Sup": "\u22D1",
          "supdot": "\u2ABE",
          "supdsub": "\u2AD8",
          "supE": "\u2AC6",
          "supe": "\u2287",
          "supedot": "\u2AC4",
          "Superset": "\u2283",
          "SupersetEqual": "\u2287",
          "suphsol": "\u27C9",
          "suphsub": "\u2AD7",
          "suplarr": "\u297B",
          "supmult": "\u2AC2",
          "supnE": "\u2ACC",
          "supne": "\u228B",
          "supplus": "\u2AC0",
          "supset": "\u2283",
          "Supset": "\u22D1",
          "supseteq": "\u2287",
          "supseteqq": "\u2AC6",
          "supsetneq": "\u228B",
          "supsetneqq": "\u2ACC",
          "supsim": "\u2AC8",
          "supsub": "\u2AD4",
          "supsup": "\u2AD6",
          "swarhk": "\u2926",
          "swarr": "\u2199",
          "swArr": "\u21D9",
          "swarrow": "\u2199",
          "swnwar": "\u292A",
          "szlig": "\xDF",
          "Tab": "\t",
          "target": "\u2316",
          "Tau": "\u03A4",
          "tau": "\u03C4",
          "tbrk": "\u23B4",
          "Tcaron": "\u0164",
          "tcaron": "\u0165",
          "Tcedil": "\u0162",
          "tcedil": "\u0163",
          "Tcy": "\u0422",
          "tcy": "\u0442",
          "tdot": "\u20DB",
          "telrec": "\u2315",
          "Tfr": "\uD835\uDD17",
          "tfr": "\uD835\uDD31",
          "there4": "\u2234",
          "therefore": "\u2234",
          "Therefore": "\u2234",
          "Theta": "\u0398",
          "theta": "\u03B8",
          "thetasym": "\u03D1",
          "thetav": "\u03D1",
          "thickapprox": "\u2248",
          "thicksim": "\u223C",
          "ThickSpace": "\u205F\u200A",
          "ThinSpace": "\u2009",
          "thinsp": "\u2009",
          "thkap": "\u2248",
          "thksim": "\u223C",
          "THORN": "\xDE",
          "thorn": "\xFE",
          "tilde": "\u02DC",
          "Tilde": "\u223C",
          "TildeEqual": "\u2243",
          "TildeFullEqual": "\u2245",
          "TildeTilde": "\u2248",
          "timesbar": "\u2A31",
          "timesb": "\u22A0",
          "times": "\xD7",
          "timesd": "\u2A30",
          "tint": "\u222D",
          "toea": "\u2928",
          "topbot": "\u2336",
          "topcir": "\u2AF1",
          "top": "\u22A4",
          "Topf": "\uD835\uDD4B",
          "topf": "\uD835\uDD65",
          "topfork": "\u2ADA",
          "tosa": "\u2929",
          "tprime": "\u2034",
          "trade": "\u2122",
          "TRADE": "\u2122",
          "triangle": "\u25B5",
          "triangledown": "\u25BF",
          "triangleleft": "\u25C3",
          "trianglelefteq": "\u22B4",
          "triangleq": "\u225C",
          "triangleright": "\u25B9",
          "trianglerighteq": "\u22B5",
          "tridot": "\u25EC",
          "trie": "\u225C",
          "triminus": "\u2A3A",
          "TripleDot": "\u20DB",
          "triplus": "\u2A39",
          "trisb": "\u29CD",
          "tritime": "\u2A3B",
          "trpezium": "\u23E2",
          "Tscr": "\uD835\uDCAF",
          "tscr": "\uD835\uDCC9",
          "TScy": "\u0426",
          "tscy": "\u0446",
          "TSHcy": "\u040B",
          "tshcy": "\u045B",
          "Tstrok": "\u0166",
          "tstrok": "\u0167",
          "twixt": "\u226C",
          "twoheadleftarrow": "\u219E",
          "twoheadrightarrow": "\u21A0",
          "Uacute": "\xDA",
          "uacute": "\xFA",
          "uarr": "\u2191",
          "Uarr": "\u219F",
          "uArr": "\u21D1",
          "Uarrocir": "\u2949",
          "Ubrcy": "\u040E",
          "ubrcy": "\u045E",
          "Ubreve": "\u016C",
          "ubreve": "\u016D",
          "Ucirc": "\xDB",
          "ucirc": "\xFB",
          "Ucy": "\u0423",
          "ucy": "\u0443",
          "udarr": "\u21C5",
          "Udblac": "\u0170",
          "udblac": "\u0171",
          "udhar": "\u296E",
          "ufisht": "\u297E",
          "Ufr": "\uD835\uDD18",
          "ufr": "\uD835\uDD32",
          "Ugrave": "\xD9",
          "ugrave": "\xF9",
          "uHar": "\u2963",
          "uharl": "\u21BF",
          "uharr": "\u21BE",
          "uhblk": "\u2580",
          "ulcorn": "\u231C",
          "ulcorner": "\u231C",
          "ulcrop": "\u230F",
          "ultri": "\u25F8",
          "Umacr": "\u016A",
          "umacr": "\u016B",
          "uml": "\xA8",
          "UnderBar": "_",
          "UnderBrace": "\u23DF",
          "UnderBracket": "\u23B5",
          "UnderParenthesis": "\u23DD",
          "Union": "\u22C3",
          "UnionPlus": "\u228E",
          "Uogon": "\u0172",
          "uogon": "\u0173",
          "Uopf": "\uD835\uDD4C",
          "uopf": "\uD835\uDD66",
          "UpArrowBar": "\u2912",
          "uparrow": "\u2191",
          "UpArrow": "\u2191",
          "Uparrow": "\u21D1",
          "UpArrowDownArrow": "\u21C5",
          "updownarrow": "\u2195",
          "UpDownArrow": "\u2195",
          "Updownarrow": "\u21D5",
          "UpEquilibrium": "\u296E",
          "upharpoonleft": "\u21BF",
          "upharpoonright": "\u21BE",
          "uplus": "\u228E",
          "UpperLeftArrow": "\u2196",
          "UpperRightArrow": "\u2197",
          "upsi": "\u03C5",
          "Upsi": "\u03D2",
          "upsih": "\u03D2",
          "Upsilon": "\u03A5",
          "upsilon": "\u03C5",
          "UpTeeArrow": "\u21A5",
          "UpTee": "\u22A5",
          "upuparrows": "\u21C8",
          "urcorn": "\u231D",
          "urcorner": "\u231D",
          "urcrop": "\u230E",
          "Uring": "\u016E",
          "uring": "\u016F",
          "urtri": "\u25F9",
          "Uscr": "\uD835\uDCB0",
          "uscr": "\uD835\uDCCA",
          "utdot": "\u22F0",
          "Utilde": "\u0168",
          "utilde": "\u0169",
          "utri": "\u25B5",
          "utrif": "\u25B4",
          "uuarr": "\u21C8",
          "Uuml": "\xDC",
          "uuml": "\xFC",
          "uwangle": "\u29A7",
          "vangrt": "\u299C",
          "varepsilon": "\u03F5",
          "varkappa": "\u03F0",
          "varnothing": "\u2205",
          "varphi": "\u03D5",
          "varpi": "\u03D6",
          "varpropto": "\u221D",
          "varr": "\u2195",
          "vArr": "\u21D5",
          "varrho": "\u03F1",
          "varsigma": "\u03C2",
          "varsubsetneq": "\u228A\uFE00",
          "varsubsetneqq": "\u2ACB\uFE00",
          "varsupsetneq": "\u228B\uFE00",
          "varsupsetneqq": "\u2ACC\uFE00",
          "vartheta": "\u03D1",
          "vartriangleleft": "\u22B2",
          "vartriangleright": "\u22B3",
          "vBar": "\u2AE8",
          "Vbar": "\u2AEB",
          "vBarv": "\u2AE9",
          "Vcy": "\u0412",
          "vcy": "\u0432",
          "vdash": "\u22A2",
          "vDash": "\u22A8",
          "Vdash": "\u22A9",
          "VDash": "\u22AB",
          "Vdashl": "\u2AE6",
          "veebar": "\u22BB",
          "vee": "\u2228",
          "Vee": "\u22C1",
          "veeeq": "\u225A",
          "vellip": "\u22EE",
          "verbar": "|",
          "Verbar": "\u2016",
          "vert": "|",
          "Vert": "\u2016",
          "VerticalBar": "\u2223",
          "VerticalLine": "|",
          "VerticalSeparator": "\u2758",
          "VerticalTilde": "\u2240",
          "VeryThinSpace": "\u200A",
          "Vfr": "\uD835\uDD19",
          "vfr": "\uD835\uDD33",
          "vltri": "\u22B2",
          "vnsub": "\u2282\u20D2",
          "vnsup": "\u2283\u20D2",
          "Vopf": "\uD835\uDD4D",
          "vopf": "\uD835\uDD67",
          "vprop": "\u221D",
          "vrtri": "\u22B3",
          "Vscr": "\uD835\uDCB1",
          "vscr": "\uD835\uDCCB",
          "vsubnE": "\u2ACB\uFE00",
          "vsubne": "\u228A\uFE00",
          "vsupnE": "\u2ACC\uFE00",
          "vsupne": "\u228B\uFE00",
          "Vvdash": "\u22AA",
          "vzigzag": "\u299A",
          "Wcirc": "\u0174",
          "wcirc": "\u0175",
          "wedbar": "\u2A5F",
          "wedge": "\u2227",
          "Wedge": "\u22C0",
          "wedgeq": "\u2259",
          "weierp": "\u2118",
          "Wfr": "\uD835\uDD1A",
          "wfr": "\uD835\uDD34",
          "Wopf": "\uD835\uDD4E",
          "wopf": "\uD835\uDD68",
          "wp": "\u2118",
          "wr": "\u2240",
          "wreath": "\u2240",
          "Wscr": "\uD835\uDCB2",
          "wscr": "\uD835\uDCCC",
          "xcap": "\u22C2",
          "xcirc": "\u25EF",
          "xcup": "\u22C3",
          "xdtri": "\u25BD",
          "Xfr": "\uD835\uDD1B",
          "xfr": "\uD835\uDD35",
          "xharr": "\u27F7",
          "xhArr": "\u27FA",
          "Xi": "\u039E",
          "xi": "\u03BE",
          "xlarr": "\u27F5",
          "xlArr": "\u27F8",
          "xmap": "\u27FC",
          "xnis": "\u22FB",
          "xodot": "\u2A00",
          "Xopf": "\uD835\uDD4F",
          "xopf": "\uD835\uDD69",
          "xoplus": "\u2A01",
          "xotime": "\u2A02",
          "xrarr": "\u27F6",
          "xrArr": "\u27F9",
          "Xscr": "\uD835\uDCB3",
          "xscr": "\uD835\uDCCD",
          "xsqcup": "\u2A06",
          "xuplus": "\u2A04",
          "xutri": "\u25B3",
          "xvee": "\u22C1",
          "xwedge": "\u22C0",
          "Yacute": "\xDD",
          "yacute": "\xFD",
          "YAcy": "\u042F",
          "yacy": "\u044F",
          "Ycirc": "\u0176",
          "ycirc": "\u0177",
          "Ycy": "\u042B",
          "ycy": "\u044B",
          "yen": "\xA5",
          "Yfr": "\uD835\uDD1C",
          "yfr": "\uD835\uDD36",
          "YIcy": "\u0407",
          "yicy": "\u0457",
          "Yopf": "\uD835\uDD50",
          "yopf": "\uD835\uDD6A",
          "Yscr": "\uD835\uDCB4",
          "yscr": "\uD835\uDCCE",
          "YUcy": "\u042E",
          "yucy": "\u044E",
          "yuml": "\xFF",
          "Yuml": "\u0178",
          "Zacute": "\u0179",
          "zacute": "\u017A",
          "Zcaron": "\u017D",
          "zcaron": "\u017E",
          "Zcy": "\u0417",
          "zcy": "\u0437",
          "Zdot": "\u017B",
          "zdot": "\u017C",
          "zeetrf": "\u2128",
          "ZeroWidthSpace": "\u200B",
          "Zeta": "\u0396",
          "zeta": "\u03B6",
          "zfr": "\uD835\uDD37",
          "Zfr": "\u2128",
          "ZHcy": "\u0416",
          "zhcy": "\u0436",
          "zigrarr": "\u21DD",
          "zopf": "\uD835\uDD6B",
          "Zopf": "\u2124",
          "Zscr": "\uD835\uDCB5",
          "zscr": "\uD835\uDCCF",
          "zwj": "\u200D",
          "zwnj": "\u200C"
        };
      }, {}],
      53: [function (require, module, exports) {
        // Helpers
        // Merge objects
        //

        function assign(obj
        /*from1, from2, from3, ...*/
        ) {
          var sources = Array.prototype.slice.call(arguments, 1);
          sources.forEach(function (source) {
            if (!source) {
              return;
            }

            Object.keys(source).forEach(function (key) {
              obj[key] = source[key];
            });
          });
          return obj;
        }

        function _class(obj) {
          return Object.prototype.toString.call(obj);
        }

        function isString(obj) {
          return _class(obj) === '[object String]';
        }

        function isObject(obj) {
          return _class(obj) === '[object Object]';
        }

        function isRegExp(obj) {
          return _class(obj) === '[object RegExp]';
        }

        function isFunction(obj) {
          return _class(obj) === '[object Function]';
        }

        function escapeRE(str) {
          return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
        } ////////////////////////////////////////////////////////////////////////////////


        var defaultOptions = {
          fuzzyLink: true,
          fuzzyEmail: true,
          fuzzyIP: false
        };

        function isOptionsObj(obj) {
          return Object.keys(obj || {}).reduce(function (acc, k) {
            return acc || defaultOptions.hasOwnProperty(k);
          }, false);
        }

        var defaultSchemas = {
          'http:': {
            validate: function validate(text, pos, self) {
              var tail = text.slice(pos);

              if (!self.re.http) {
                // compile lazily, because "host"-containing variables can change on tlds update.
                self.re.http = new RegExp('^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i');
              }

              if (self.re.http.test(tail)) {
                return tail.match(self.re.http)[0].length;
              }

              return 0;
            }
          },
          'https:': 'http:',
          'ftp:': 'http:',
          '//': {
            validate: function validate(text, pos, self) {
              var tail = text.slice(pos);

              if (!self.re.no_http) {
                // compile lazily, because "host"-containing variables can change on tlds update.
                self.re.no_http = new RegExp('^' + self.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
                // with code comments
                '(?:localhost|(?:(?:' + self.re.src_domain + ')\\.)+' + self.re.src_domain_root + ')' + self.re.src_port + self.re.src_host_terminator + self.re.src_path, 'i');
              }

              if (self.re.no_http.test(tail)) {
                // should not be `://` & `///`, that protects from errors in protocol name
                if (pos >= 3 && text[pos - 3] === ':') {
                  return 0;
                }

                if (pos >= 3 && text[pos - 3] === '/') {
                  return 0;
                }

                return tail.match(self.re.no_http)[0].length;
              }

              return 0;
            }
          },
          'mailto:': {
            validate: function validate(text, pos, self) {
              var tail = text.slice(pos);

              if (!self.re.mailto) {
                self.re.mailto = new RegExp('^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i');
              }

              if (self.re.mailto.test(tail)) {
                return tail.match(self.re.mailto)[0].length;
              }

              return 0;
            }
          }
        };
        /*eslint-disable max-len*/
        // RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)

        var tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]'; // DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead

        var tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');
        /*eslint-enable max-len*/
        ////////////////////////////////////////////////////////////////////////////////

        function resetScanCache(self) {
          self.__index__ = -1;
          self.__text_cache__ = '';
        }

        function createValidator(re) {
          return function (text, pos) {
            var tail = text.slice(pos);

            if (re.test(tail)) {
              return tail.match(re)[0].length;
            }

            return 0;
          };
        }

        function createNormalizer() {
          return function (match, self) {
            self.normalize(match);
          };
        } // Schemas compiler. Build regexps.
        //


        function compile(self) {
          // Load & clone RE patterns.
          var re = self.re = require('./lib/re')(self.__opts__); // Define dynamic patterns


          var tlds = self.__tlds__.slice();

          self.onCompile();

          if (!self.__tlds_replaced__) {
            tlds.push(tlds_2ch_src_re);
          }

          tlds.push(re.src_xn);
          re.src_tlds = tlds.join('|');

          function untpl(tpl) {
            return tpl.replace('%TLDS%', re.src_tlds);
          }

          re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), 'i');
          re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), 'i');
          re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
          re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), 'i'); //
          // Compile each schema
          //

          var aliases = [];
          self.__compiled__ = {}; // Reset compiled data

          function schemaError(name, val) {
            throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
          }

          Object.keys(self.__schemas__).forEach(function (name) {
            var val = self.__schemas__[name]; // skip disabled methods

            if (val === null) {
              return;
            }

            var compiled = {
              validate: null,
              link: null
            };
            self.__compiled__[name] = compiled;

            if (isObject(val)) {
              if (isRegExp(val.validate)) {
                compiled.validate = createValidator(val.validate);
              } else if (isFunction(val.validate)) {
                compiled.validate = val.validate;
              } else {
                schemaError(name, val);
              }

              if (isFunction(val.normalize)) {
                compiled.normalize = val.normalize;
              } else if (!val.normalize) {
                compiled.normalize = createNormalizer();
              } else {
                schemaError(name, val);
              }

              return;
            }

            if (isString(val)) {
              aliases.push(name);
              return;
            }

            schemaError(name, val);
          }); //
          // Compile postponed aliases
          //

          aliases.forEach(function (alias) {
            if (!self.__compiled__[self.__schemas__[alias]]) {
              // Silently fail on missed schemas to avoid errons on disable.
              // schemaError(alias, self.__schemas__[alias]);
              return;
            }

            self.__compiled__[alias].validate = self.__compiled__[self.__schemas__[alias]].validate;
            self.__compiled__[alias].normalize = self.__compiled__[self.__schemas__[alias]].normalize;
          }); //
          // Fake record for guessed links
          //

          self.__compiled__[''] = {
            validate: null,
            normalize: createNormalizer()
          }; //
          // Build schema condition
          //

          var slist = Object.keys(self.__compiled__).filter(function (name) {
            // Filter disabled & fake schemas
            return name.length > 0 && self.__compiled__[name];
          }).map(escapeRE).join('|'); // (?!_) cause 1.5x slowdown

          self.re.schema_test = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + '))(' + slist + ')', 'i');
          self.re.schema_search = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + '))(' + slist + ')', 'ig');
          self.re.pretest = RegExp('(' + self.re.schema_test.source + ')|(' + self.re.host_fuzzy_test.source + ')|@', 'i'); //
          // Cleanup
          //

          resetScanCache(self);
        }
        /**
         * class Match
         *
         * Match result. Single element of array, returned by [[LinkifyIt#match]]
         **/


        function Match(self, shift) {
          var start = self.__index__,
              end = self.__last_index__,
              text = self.__text_cache__.slice(start, end);
          /**
           * Match#schema -> String
           *
           * Prefix (protocol) for matched string.
           **/


          this.schema = self.__schema__.toLowerCase();
          /**
           * Match#index -> Number
           *
           * First position of matched string.
           **/

          this.index = start + shift;
          /**
           * Match#lastIndex -> Number
           *
           * Next position after matched string.
           **/

          this.lastIndex = end + shift;
          /**
           * Match#raw -> String
           *
           * Matched string.
           **/

          this.raw = text;
          /**
           * Match#text -> String
           *
           * Notmalized text of matched string.
           **/

          this.text = text;
          /**
           * Match#url -> String
           *
           * Normalized url of matched string.
           **/

          this.url = text;
        }

        function createMatch(self, shift) {
          var match = new Match(self, shift);

          self.__compiled__[match.schema].normalize(match, self);

          return match;
        }
        /**
         * class LinkifyIt
         **/

        /**
         * new LinkifyIt(schemas, options)
         * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
         * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
         *
         * Creates new linkifier instance with optional additional schemas.
         * Can be called without `new` keyword for convenience.
         *
         * By default understands:
         *
         * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
         * - "fuzzy" links and emails (example.com, foo@bar.com).
         *
         * `schemas` is an object, where each key/value describes protocol/rule:
         *
         * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
         *   for example). `linkify-it` makes shure that prefix is not preceeded with
         *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
         * - __value__ - rule to check tail after link prefix
         *   - _String_ - just alias to existing rule
         *   - _Object_
         *     - _validate_ - validator function (should return matched length on success),
         *       or `RegExp`.
         *     - _normalize_ - optional function to normalize text & url of matched result
         *       (for example, for @twitter mentions).
         *
         * `options`:
         *
         * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
         * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
         *   like version numbers. Default `false`.
         * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
         *
         **/


        function LinkifyIt(schemas, options) {
          if (!(this instanceof LinkifyIt)) {
            return new LinkifyIt(schemas, options);
          }

          if (!options) {
            if (isOptionsObj(schemas)) {
              options = schemas;
              schemas = {};
            }
          }

          this.__opts__ = assign({}, defaultOptions, options); // Cache last tested result. Used to skip repeating steps on next `match` call.

          this.__index__ = -1;
          this.__last_index__ = -1; // Next scan position

          this.__schema__ = '';
          this.__text_cache__ = '';
          this.__schemas__ = assign({}, defaultSchemas, schemas);
          this.__compiled__ = {};
          this.__tlds__ = tlds_default;
          this.__tlds_replaced__ = false;
          this.re = {};
          compile(this);
        }
        /** chainable
         * LinkifyIt#add(schema, definition)
         * - schema (String): rule name (fixed pattern prefix)
         * - definition (String|RegExp|Object): schema definition
         *
         * Add new rule definition. See constructor description for details.
         **/


        LinkifyIt.prototype.add = function add(schema, definition) {
          this.__schemas__[schema] = definition;
          compile(this);
          return this;
        };
        /** chainable
         * LinkifyIt#set(options)
         * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
         *
         * Set recognition options for links without schema.
         **/


        LinkifyIt.prototype.set = function set(options) {
          this.__opts__ = assign(this.__opts__, options);
          return this;
        };
        /**
         * LinkifyIt#test(text) -> Boolean
         *
         * Searches linkifiable pattern and returns `true` on success or `false` on fail.
         **/


        LinkifyIt.prototype.test = function test(text) {
          // Reset scan cache
          this.__text_cache__ = text;
          this.__index__ = -1;

          if (!text.length) {
            return false;
          }

          var m, ml, me, len, shift, next, re, tld_pos, at_pos; // try to scan for link with schema - that's the most simple rule

          if (this.re.schema_test.test(text)) {
            re = this.re.schema_search;
            re.lastIndex = 0;

            while ((m = re.exec(text)) !== null) {
              len = this.testSchemaAt(text, m[2], re.lastIndex);

              if (len) {
                this.__schema__ = m[2];
                this.__index__ = m.index + m[1].length;
                this.__last_index__ = m.index + m[0].length + len;
                break;
              }
            }
          }

          if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
            // guess schemaless links
            tld_pos = text.search(this.re.host_fuzzy_test);

            if (tld_pos >= 0) {
              // if tld is located after found link - no need to check fuzzy pattern
              if (this.__index__ < 0 || tld_pos < this.__index__) {
                if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
                  shift = ml.index + ml[1].length;

                  if (this.__index__ < 0 || shift < this.__index__) {
                    this.__schema__ = '';
                    this.__index__ = shift;
                    this.__last_index__ = ml.index + ml[0].length;
                  }
                }
              }
            }
          }

          if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
            // guess schemaless emails
            at_pos = text.indexOf('@');

            if (at_pos >= 0) {
              // We can't skip this check, because this cases are possible:
              // 192.168.1.1@gmail.com, my.in@example.com
              if ((me = text.match(this.re.email_fuzzy)) !== null) {
                shift = me.index + me[1].length;
                next = me.index + me[0].length;

                if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
                  this.__schema__ = 'mailto:';
                  this.__index__ = shift;
                  this.__last_index__ = next;
                }
              }
            }
          }

          return this.__index__ >= 0;
        };
        /**
         * LinkifyIt#pretest(text) -> Boolean
         *
         * Very quick check, that can give false positives. Returns true if link MAY BE
         * can exists. Can be used for speed optimization, when you need to check that
         * link NOT exists.
         **/


        LinkifyIt.prototype.pretest = function pretest(text) {
          return this.re.pretest.test(text);
        };
        /**
         * LinkifyIt#testSchemaAt(text, name, position) -> Number
         * - text (String): text to scan
         * - name (String): rule (schema) name
         * - position (Number): text offset to check from
         *
         * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
         * at given position. Returns length of found pattern (0 on fail).
         **/


        LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
          // If not supported schema check requested - terminate
          if (!this.__compiled__[schema.toLowerCase()]) {
            return 0;
          }

          return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
        };
        /**
         * LinkifyIt#match(text) -> Array|null
         *
         * Returns array of found link descriptions or `null` on fail. We strongly
         * recommend to use [[LinkifyIt#test]] first, for best speed.
         *
         * ##### Result match description
         *
         * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
         *   protocol-neutral  links.
         * - __index__ - offset of matched text
         * - __lastIndex__ - index of next char after mathch end
         * - __raw__ - matched text
         * - __text__ - normalized text
         * - __url__ - link, generated from matched text
         **/


        LinkifyIt.prototype.match = function match(text) {
          var shift = 0,
              result = []; // Try to take previous element from cache, if .test() called before

          if (this.__index__ >= 0 && this.__text_cache__ === text) {
            result.push(createMatch(this, shift));
            shift = this.__last_index__;
          } // Cut head if cache was used


          var tail = shift ? text.slice(shift) : text; // Scan string until end reached

          while (this.test(tail)) {
            result.push(createMatch(this, shift));
            tail = tail.slice(this.__last_index__);
            shift += this.__last_index__;
          }

          if (result.length) {
            return result;
          }

          return null;
        };
        /** chainable
         * LinkifyIt#tlds(list [, keepOld]) -> this
         * - list (Array): list of tlds
         * - keepOld (Boolean): merge with current list if `true` (`false` by default)
         *
         * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
         * to avoid false positives. By default this algorythm used:
         *
         * - hostname with any 2-letter root zones are ok.
         * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
         *   are ok.
         * - encoded (`xn--...`) root zones are ok.
         *
         * If list is replaced, then exact match for 2-chars root zones will be checked.
         **/


        LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
          list = Array.isArray(list) ? list : [list];

          if (!keepOld) {
            this.__tlds__ = list.slice();
            this.__tlds_replaced__ = true;
            compile(this);
            return this;
          }

          this.__tlds__ = this.__tlds__.concat(list).sort().filter(function (el, idx, arr) {
            return el !== arr[idx - 1];
          }).reverse();
          compile(this);
          return this;
        };
        /**
         * LinkifyIt#normalize(match)
         *
         * Default normalizer (if schema does not define it's own).
         **/


        LinkifyIt.prototype.normalize = function normalize(match) {
          // Do minimal possible changes by default. Need to collect feedback prior
          // to move forward https://github.com/markdown-it/linkify-it/issues/1
          if (!match.schema) {
            match.url = 'http://' + match.url;
          }

          if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
            match.url = 'mailto:' + match.url;
          }
        };
        /**
         * LinkifyIt#onCompile()
         *
         * Override to modify basic RegExp-s.
         **/


        LinkifyIt.prototype.onCompile = function onCompile() {};

        module.exports = LinkifyIt;
      }, {
        "./lib/re": 54
      }],
      54: [function (require, module, exports) {

        module.exports = function (opts) {
          var re = {}; // Use direct extract instead of `regenerate` to reduse browserified size

          re.src_Any = require('uc.micro/properties/Any/regex').source;
          re.src_Cc = require('uc.micro/categories/Cc/regex').source;
          re.src_Z = require('uc.micro/categories/Z/regex').source;
          re.src_P = require('uc.micro/categories/P/regex').source; // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)

          re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join('|'); // \p{\Z\Cc} (white spaces + control)

          re.src_ZCc = [re.src_Z, re.src_Cc].join('|'); // Experimental. List of chars, completely prohibited in links
          // because can separate it from other part of text

          var text_separators = "[><\uFF5C]"; // All possible word characters (everything without punctuation, spaces & controls)
          // Defined via punctuation & spaces to save space
          // Should be something like \p{\L\N\S\M} (\w but without `_`)

          re.src_pseudo_letter = '(?:(?!' + text_separators + '|' + re.src_ZPCc + ')' + re.src_Any + ')'; // The same as abothe but without [0-9]
          // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';
          ////////////////////////////////////////////////////////////////////////////////

          re.src_ip4 = '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'; // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.

          re.src_auth = '(?:(?:(?!' + re.src_ZCc + '|[@/\\[\\]()]).)+@)?';
          re.src_port = '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';
          re.src_host_terminator = '(?=$|' + text_separators + '|' + re.src_ZPCc + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + re.src_ZPCc + '))';
          re.src_path = '(?:' + '[/?#]' + '(?:' + '(?!' + re.src_ZCc + '|' + text_separators + '|[()[\\]{}.,"\'?!\\-]).|' + '\\[(?:(?!' + re.src_ZCc + '|\\]).)*\\]|' + '\\((?:(?!' + re.src_ZCc + '|[)]).)*\\)|' + '\\{(?:(?!' + re.src_ZCc + '|[}]).)*\\}|' + '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' + "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" + "\\'(?=" + re.src_pseudo_letter + '|[-]).|' + // allow `I'm_king` if no pair found
          '\\.{2,4}[a-zA-Z0-9%/]|' + // github has ... in commit range links,
          // google has .... in links (issue #66)
          // Restrict to
          // - english
          // - percent-encoded
          // - parts of file path
          // until more examples found.
          '\\.(?!' + re.src_ZCc + '|[.]).|' + (opts && opts['---'] ? '\\-(?!--(?:[^-]|$))(?:-*)|' // `---` => long dash, terminate
          : '\\-+|') + '\\,(?!' + re.src_ZCc + ').|' + // allow `,,,` in paths
          '\\!(?!' + re.src_ZCc + '|[!]).|' + '\\?(?!' + re.src_ZCc + '|[?]).' + ')+' + '|\\/' + ')?'; // Allow anything in markdown spec, forbid quote (") at the first position
          // because emails enclosed in quotes are far more common

          re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
          re.src_xn = 'xn--[a-z0-9\\-]{1,59}'; // More to read about domain names
          // http://serverfault.com/questions/638260/

          re.src_domain_root = // Allow letters & digits (http://test1)
          '(?:' + re.src_xn + '|' + re.src_pseudo_letter + '{1,63}' + ')';
          re.src_domain = '(?:' + re.src_xn + '|' + '(?:' + re.src_pseudo_letter + ')' + '|' + '(?:' + re.src_pseudo_letter + '(?:-|' + re.src_pseudo_letter + '){0,61}' + re.src_pseudo_letter + ')' + ')';
          re.src_host = '(?:' + // Don't need IP check, because digits are already allowed in normal domain names
          //   src_ip4 +
          // '|' +
          '(?:(?:(?:' + re.src_domain + ')\\.)*' + re.src_domain
          /*_root*/
          + ')' + ')';
          re.tpl_host_fuzzy = '(?:' + re.src_ip4 + '|' + '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))' + ')';
          re.tpl_host_no_ip_fuzzy = '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))';
          re.src_host_strict = re.src_host + re.src_host_terminator;
          re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
          re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
          re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
          re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator; ////////////////////////////////////////////////////////////////////////////////
          // Main rules
          // Rude test fuzzy links by host, for quick deny

          re.tpl_host_fuzzy_test = 'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + re.src_ZPCc + '|>|$))';
          re.tpl_email_fuzzy = '(^|' + text_separators + '|"|\\(|' + re.src_ZCc + ')' + '(' + re.src_email_name + '@' + re.tpl_host_fuzzy_strict + ')';
          re.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
          // but can start with > (markdown blockquote)
          "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + '))' + "((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_fuzzy_strict + re.src_path + ')';
          re.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
          // but can start with > (markdown blockquote)
          "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + '))' + "((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ')';
          return re;
        };
      }, {
        "uc.micro/categories/Cc/regex": 61,
        "uc.micro/categories/P/regex": 63,
        "uc.micro/categories/Z/regex": 64,
        "uc.micro/properties/Any/regex": 66
      }],
      55: [function (require, module, exports) {
        /* eslint-disable no-bitwise */

        var decodeCache = {};

        function getDecodeCache(exclude) {
          var i,
              ch,
              cache = decodeCache[exclude];

          if (cache) {
            return cache;
          }

          cache = decodeCache[exclude] = [];

          for (i = 0; i < 128; i++) {
            ch = String.fromCharCode(i);
            cache.push(ch);
          }

          for (i = 0; i < exclude.length; i++) {
            ch = exclude.charCodeAt(i);
            cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
          }

          return cache;
        } // Decode percent-encoded string.
        //


        function decode(string, exclude) {
          var cache;

          if (typeof exclude !== 'string') {
            exclude = decode.defaultChars;
          }

          cache = getDecodeCache(exclude);
          return string.replace(/(%[a-f0-9]{2})+/gi, function (seq) {
            var i,
                l,
                b1,
                b2,
                b3,
                b4,
                chr,
                result = '';

            for (i = 0, l = seq.length; i < l; i += 3) {
              b1 = parseInt(seq.slice(i + 1, i + 3), 16);

              if (b1 < 0x80) {
                result += cache[b1];
                continue;
              }

              if ((b1 & 0xE0) === 0xC0 && i + 3 < l) {
                // 110xxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);

                if ((b2 & 0xC0) === 0x80) {
                  chr = b1 << 6 & 0x7C0 | b2 & 0x3F;

                  if (chr < 0x80) {
                    result += "\uFFFD\uFFFD";
                  } else {
                    result += String.fromCharCode(chr);
                  }

                  i += 3;
                  continue;
                }
              }

              if ((b1 & 0xF0) === 0xE0 && i + 6 < l) {
                // 1110xxxx 10xxxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                b3 = parseInt(seq.slice(i + 7, i + 9), 16);

                if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                  chr = b1 << 12 & 0xF000 | b2 << 6 & 0xFC0 | b3 & 0x3F;

                  if (chr < 0x800 || chr >= 0xD800 && chr <= 0xDFFF) {
                    result += "\uFFFD\uFFFD\uFFFD";
                  } else {
                    result += String.fromCharCode(chr);
                  }

                  i += 6;
                  continue;
                }
              }

              if ((b1 & 0xF8) === 0xF0 && i + 9 < l) {
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                b3 = parseInt(seq.slice(i + 7, i + 9), 16);
                b4 = parseInt(seq.slice(i + 10, i + 12), 16);

                if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
                  chr = b1 << 18 & 0x1C0000 | b2 << 12 & 0x3F000 | b3 << 6 & 0xFC0 | b4 & 0x3F;

                  if (chr < 0x10000 || chr > 0x10FFFF) {
                    result += "\uFFFD\uFFFD\uFFFD\uFFFD";
                  } else {
                    chr -= 0x10000;
                    result += String.fromCharCode(0xD800 + (chr >> 10), 0xDC00 + (chr & 0x3FF));
                  }

                  i += 9;
                  continue;
                }
              }

              result += "\uFFFD";
            }

            return result;
          });
        }

        decode.defaultChars = ';/?:@&=+$,#';
        decode.componentChars = '';
        module.exports = decode;
      }, {}],
      56: [function (require, module, exports) {

        var encodeCache = {}; // Create a lookup array where anything but characters in `chars` string
        // and alphanumeric chars is percent-encoded.
        //

        function getEncodeCache(exclude) {
          var i,
              ch,
              cache = encodeCache[exclude];

          if (cache) {
            return cache;
          }

          cache = encodeCache[exclude] = [];

          for (i = 0; i < 128; i++) {
            ch = String.fromCharCode(i);

            if (/^[0-9a-z]$/i.test(ch)) {
              // always allow unencoded alphanumeric characters
              cache.push(ch);
            } else {
              cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
            }
          }

          for (i = 0; i < exclude.length; i++) {
            cache[exclude.charCodeAt(i)] = exclude[i];
          }

          return cache;
        } // Encode unsafe characters with percent-encoding, skipping already
        // encoded sequences.
        //
        //  - string       - string to encode
        //  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
        //  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
        //


        function encode(string, exclude, keepEscaped) {
          var i,
              l,
              code,
              nextCode,
              cache,
              result = '';

          if (typeof exclude !== 'string') {
            // encode(string, keepEscaped)
            keepEscaped = exclude;
            exclude = encode.defaultChars;
          }

          if (typeof keepEscaped === 'undefined') {
            keepEscaped = true;
          }

          cache = getEncodeCache(exclude);

          for (i = 0, l = string.length; i < l; i++) {
            code = string.charCodeAt(i);

            if (keepEscaped && code === 0x25
            /* % */
            && i + 2 < l) {
              if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
                result += string.slice(i, i + 3);
                i += 2;
                continue;
              }
            }

            if (code < 128) {
              result += cache[code];
              continue;
            }

            if (code >= 0xD800 && code <= 0xDFFF) {
              if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
                nextCode = string.charCodeAt(i + 1);

                if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                  result += encodeURIComponent(string[i] + string[i + 1]);
                  i++;
                  continue;
                }
              }

              result += '%EF%BF%BD';
              continue;
            }

            result += encodeURIComponent(string[i]);
          }

          return result;
        }

        encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
        encode.componentChars = "-_.!~*'()";
        module.exports = encode;
      }, {}],
      57: [function (require, module, exports) {

        module.exports = function format(url) {
          var result = '';
          result += url.protocol || '';
          result += url.slashes ? '//' : '';
          result += url.auth ? url.auth + '@' : '';

          if (url.hostname && url.hostname.indexOf(':') !== -1) {
            // ipv6 address
            result += '[' + url.hostname + ']';
          } else {
            result += url.hostname || '';
          }

          result += url.port ? ':' + url.port : '';
          result += url.pathname || '';
          result += url.search || '';
          result += url.hash || '';
          return result;
        };
      }, {}],
      58: [function (require, module, exports) {

        module.exports.encode = require('./encode');
        module.exports.decode = require('./decode');
        module.exports.format = require('./format');
        module.exports.parse = require('./parse');
      }, {
        "./decode": 55,
        "./encode": 56,
        "./format": 57,
        "./parse": 59
      }],
      59: [function (require, module, exports) {
        // Changes from joyent/node:
        //
        // 1. No leading slash in paths,
        //    e.g. in `url.parse('http://foo?bar')` pathname is ``, not `/`
        //
        // 2. Backslashes are not replaced with slashes,
        //    so `http:\\example.org\` is treated like a relative path
        //
        // 3. Trailing colon is treated like a part of the path,
        //    i.e. in `http://example.org:foo` pathname is `:foo`
        //
        // 4. Nothing is URL-encoded in the resulting object,
        //    (in joyent/node some chars in auth and paths are encoded)
        //
        // 5. `url.parse()` does not have `parseQueryString` argument
        //
        // 6. Removed extraneous result properties: `host`, `path`, `query`, etc.,
        //    which can be constructed using other parts of the url.
        //

        function Url() {
          this.protocol = null;
          this.slashes = null;
          this.auth = null;
          this.port = null;
          this.hostname = null;
          this.hash = null;
          this.search = null;
          this.pathname = null;
        } // Reference: RFC 3986, RFC 1808, RFC 2396
        // define these here so at least they only have to be
        // compiled once on the first module load.


        var protocolPattern = /^([a-z0-9.+-]+:)/i,
            portPattern = /:[0-9]*$/,
            // Special case for a simple path URL
        simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
            // RFC 2396: characters reserved for delimiting URLs.
        // We actually just auto-escape these.
        delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
            // RFC 2396: characters not allowed for various reasons.
        unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
            // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
        autoEscape = ['\''].concat(unwise),
            // Characters that are never ever allowed in a hostname.
        // Note that any invalid chars are also handled, but these
        // are the ones that are *expected* to be seen, so we fast-path
        // them.
        nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
            hostEndingChars = ['/', '?', '#'],
            hostnameMaxLen = 255,
            hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
            hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
            // protocols that can allow "unsafe" and "unwise" chars.

        /* eslint-disable no-script-url */
        // protocols that never have a hostname.
        hostlessProtocol = {
          'javascript': true,
          'javascript:': true
        },
            // protocols that always contain a // bit.
        slashedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'https:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        };
        /* eslint-enable no-script-url */

        function urlParse(url, slashesDenoteHost) {
          if (url && url instanceof Url) {
            return url;
          }

          var u = new Url();
          u.parse(url, slashesDenoteHost);
          return u;
        }

        Url.prototype.parse = function (url, slashesDenoteHost) {
          var i,
              l,
              lowerProto,
              hec,
              slashes,
              rest = url; // trim before proceeding.
          // This is to support parse stuff like "  http://foo.com  \n"

          rest = rest.trim();

          if (!slashesDenoteHost && url.split('#').length === 1) {
            // Try fast path regexp
            var simplePath = simplePathPattern.exec(rest);

            if (simplePath) {
              this.pathname = simplePath[1];

              if (simplePath[2]) {
                this.search = simplePath[2];
              }

              return this;
            }
          }

          var proto = protocolPattern.exec(rest);

          if (proto) {
            proto = proto[0];
            lowerProto = proto.toLowerCase();
            this.protocol = proto;
            rest = rest.substr(proto.length);
          } // figure out if it's got a host
          // user@server is *always* interpreted as a hostname, and url
          // resolution will treat //foo/bar as host=foo,path=bar because that's
          // how the browser resolves relative URLs.


          if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
            slashes = rest.substr(0, 2) === '//';

            if (slashes && !(proto && hostlessProtocol[proto])) {
              rest = rest.substr(2);
              this.slashes = true;
            }
          }

          if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
            // there's a hostname.
            // the first instance of /, ?, ;, or # ends the host.
            //
            // If there is an @ in the hostname, then non-host chars *are* allowed
            // to the left of the last @ sign, unless some host-ending character
            // comes *before* the @-sign.
            // URLs are obnoxious.
            //
            // ex:
            // http://a@b@c/ => user:a@b host:c
            // http://a@b?@c => user:a host:c path:/?@c
            // v0.12 TODO(isaacs): This is not quite how Chrome does things.
            // Review our test case against browsers more comprehensively.
            // find the first instance of any hostEndingChars
            var hostEnd = -1;

            for (i = 0; i < hostEndingChars.length; i++) {
              hec = rest.indexOf(hostEndingChars[i]);

              if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
                hostEnd = hec;
              }
            } // at this point, either we have an explicit point where the
            // auth portion cannot go past, or the last @ char is the decider.


            var auth, atSign;

            if (hostEnd === -1) {
              // atSign can be anywhere.
              atSign = rest.lastIndexOf('@');
            } else {
              // atSign must be in auth portion.
              // http://a@b/c@d => host:b auth:a path:/c@d
              atSign = rest.lastIndexOf('@', hostEnd);
            } // Now we have a portion which is definitely the auth.
            // Pull that off.


            if (atSign !== -1) {
              auth = rest.slice(0, atSign);
              rest = rest.slice(atSign + 1);
              this.auth = auth;
            } // the host is the remaining to the left of the first non-host char


            hostEnd = -1;

            for (i = 0; i < nonHostChars.length; i++) {
              hec = rest.indexOf(nonHostChars[i]);

              if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
                hostEnd = hec;
              }
            } // if we still have not hit it, then the entire thing is a host.


            if (hostEnd === -1) {
              hostEnd = rest.length;
            }

            if (rest[hostEnd - 1] === ':') {
              hostEnd--;
            }

            var host = rest.slice(0, hostEnd);
            rest = rest.slice(hostEnd); // pull out port.

            this.parseHost(host); // we've indicated that there is a hostname,
            // so even if it's empty, it has to be present.

            this.hostname = this.hostname || ''; // if hostname begins with [ and ends with ]
            // assume that it's an IPv6 address.

            var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']'; // validate a little.

            if (!ipv6Hostname) {
              var hostparts = this.hostname.split(/\./);

              for (i = 0, l = hostparts.length; i < l; i++) {
                var part = hostparts[i];

                if (!part) {
                  continue;
                }

                if (!part.match(hostnamePartPattern)) {
                  var newpart = '';

                  for (var j = 0, k = part.length; j < k; j++) {
                    if (part.charCodeAt(j) > 127) {
                      // we replace non-ASCII char with a temporary placeholder
                      // we need this to make sure size of hostname is not
                      // broken by replacing non-ASCII by nothing
                      newpart += 'x';
                    } else {
                      newpart += part[j];
                    }
                  } // we test again with ASCII char only


                  if (!newpart.match(hostnamePartPattern)) {
                    var validParts = hostparts.slice(0, i);
                    var notHost = hostparts.slice(i + 1);
                    var bit = part.match(hostnamePartStart);

                    if (bit) {
                      validParts.push(bit[1]);
                      notHost.unshift(bit[2]);
                    }

                    if (notHost.length) {
                      rest = notHost.join('.') + rest;
                    }

                    this.hostname = validParts.join('.');
                    break;
                  }
                }
              }
            }

            if (this.hostname.length > hostnameMaxLen) {
              this.hostname = '';
            } // strip [ and ] from the hostname
            // the host field still retains them, though


            if (ipv6Hostname) {
              this.hostname = this.hostname.substr(1, this.hostname.length - 2);
            }
          } // chop off from the tail first.


          var hash = rest.indexOf('#');

          if (hash !== -1) {
            // got a fragment string.
            this.hash = rest.substr(hash);
            rest = rest.slice(0, hash);
          }

          var qm = rest.indexOf('?');

          if (qm !== -1) {
            this.search = rest.substr(qm);
            rest = rest.slice(0, qm);
          }

          if (rest) {
            this.pathname = rest;
          }

          if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
            this.pathname = '';
          }

          return this;
        };

        Url.prototype.parseHost = function (host) {
          var port = portPattern.exec(host);

          if (port) {
            port = port[0];

            if (port !== ':') {
              this.port = port.substr(1);
            }

            host = host.substr(0, host.length - port.length);
          }

          if (host) {
            this.hostname = host;
          }
        };

        module.exports = urlParse;
      }, {}],
      60: [function (require, module, exports) {
        (function (global) {

          (function (root) {
            /** Detect free variables */
            var freeExports = _typeof(exports) == 'object' && exports && !exports.nodeType && exports;
            var freeModule = _typeof(module) == 'object' && module && !module.nodeType && module;
            var freeGlobal = _typeof(global) == 'object' && global;

            if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
              root = freeGlobal;
            }
            /**
             * The `punycode` object.
             * @name punycode
             * @type Object
             */


            var punycode,

            /** Highest positive signed 32-bit float value */
            maxInt = 2147483647,
                // aka. 0x7FFFFFFF or 2^31-1

            /** Bootstring parameters */
            base = 36,
                tMin = 1,
                tMax = 26,
                skew = 38,
                damp = 700,
                initialBias = 72,
                initialN = 128,
                // 0x80
            delimiter = '-',
                // '\x2D'

            /** Regular expressions */
            regexPunycode = /^xn--/,
                regexNonASCII = /[^\x20-\x7E]/,
                // unprintable ASCII chars + non-ASCII chars
            regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
                // RFC 3490 separators

            /** Error messages */
            errors = {
              'overflow': 'Overflow: input needs wider integers to process',
              'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
              'invalid-input': 'Invalid input'
            },

            /** Convenience shortcuts */
            baseMinusTMin = base - tMin,
                floor = Math.floor,
                stringFromCharCode = String.fromCharCode,

            /** Temporary variable */
            key;
            /*--------------------------------------------------------------------------*/

            /**
             * A generic error utility function.
             * @private
             * @param {String} type The error type.
             * @returns {Error} Throws a `RangeError` with the applicable error message.
             */

            function error(type) {
              throw new RangeError(errors[type]);
            }
            /**
             * A generic `Array#map` utility function.
             * @private
             * @param {Array} array The array to iterate over.
             * @param {Function} callback The function that gets called for every array
             * item.
             * @returns {Array} A new array of values returned by the callback function.
             */


            function map(array, fn) {
              var length = array.length;
              var result = [];

              while (length--) {
                result[length] = fn(array[length]);
              }

              return result;
            }
            /**
             * A simple `Array#map`-like wrapper to work with domain name strings or email
             * addresses.
             * @private
             * @param {String} domain The domain name or email address.
             * @param {Function} callback The function that gets called for every
             * character.
             * @returns {Array} A new string of characters returned by the callback
             * function.
             */


            function mapDomain(string, fn) {
              var parts = string.split('@');
              var result = '';

              if (parts.length > 1) {
                // In email addresses, only the domain name should be punycoded. Leave
                // the local part (i.e. everything up to `@`) intact.
                result = parts[0] + '@';
                string = parts[1];
              } // Avoid `split(regex)` for IE8 compatibility. See #17.


              string = string.replace(regexSeparators, '\x2E');
              var labels = string.split('.');
              var encoded = map(labels, fn).join('.');
              return result + encoded;
            }
            /**
             * Creates an array containing the numeric code points of each Unicode
             * character in the string. While JavaScript uses UCS-2 internally,
             * this function will convert a pair of surrogate halves (each of which
             * UCS-2 exposes as separate characters) into a single code point,
             * matching UTF-16.
             * @see `punycode.ucs2.encode`
             * @see <https://mathiasbynens.be/notes/javascript-encoding>
             * @memberOf punycode.ucs2
             * @name decode
             * @param {String} string The Unicode input string (UCS-2).
             * @returns {Array} The new array of code points.
             */


            function ucs2decode(string) {
              var output = [],
                  counter = 0,
                  length = string.length,
                  value,
                  extra;

              while (counter < length) {
                value = string.charCodeAt(counter++);

                if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                  // high surrogate, and there is a next character
                  extra = string.charCodeAt(counter++);

                  if ((extra & 0xFC00) == 0xDC00) {
                    // low surrogate
                    output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                  } else {
                    // unmatched surrogate; only append this code unit, in case the next
                    // code unit is the high surrogate of a surrogate pair
                    output.push(value);
                    counter--;
                  }
                } else {
                  output.push(value);
                }
              }

              return output;
            }
            /**
             * Creates a string based on an array of numeric code points.
             * @see `punycode.ucs2.decode`
             * @memberOf punycode.ucs2
             * @name encode
             * @param {Array} codePoints The array of numeric code points.
             * @returns {String} The new Unicode string (UCS-2).
             */


            function ucs2encode(array) {
              return map(array, function (value) {
                var output = '';

                if (value > 0xFFFF) {
                  value -= 0x10000;
                  output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                  value = 0xDC00 | value & 0x3FF;
                }

                output += stringFromCharCode(value);
                return output;
              }).join('');
            }
            /**
             * Converts a basic code point into a digit/integer.
             * @see `digitToBasic()`
             * @private
             * @param {Number} codePoint The basic numeric code point value.
             * @returns {Number} The numeric value of a basic code point (for use in
             * representing integers) in the range `0` to `base - 1`, or `base` if
             * the code point does not represent a value.
             */


            function basicToDigit(codePoint) {
              if (codePoint - 48 < 10) {
                return codePoint - 22;
              }

              if (codePoint - 65 < 26) {
                return codePoint - 65;
              }

              if (codePoint - 97 < 26) {
                return codePoint - 97;
              }

              return base;
            }
            /**
             * Converts a digit/integer into a basic code point.
             * @see `basicToDigit()`
             * @private
             * @param {Number} digit The numeric value of a basic code point.
             * @returns {Number} The basic code point whose value (when used for
             * representing integers) is `digit`, which needs to be in the range
             * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
             * used; else, the lowercase form is used. The behavior is undefined
             * if `flag` is non-zero and `digit` has no uppercase form.
             */


            function digitToBasic(digit, flag) {
              //  0..25 map to ASCII a..z or A..Z
              // 26..35 map to ASCII 0..9
              return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
            }
            /**
             * Bias adaptation function as per section 3.4 of RFC 3492.
             * https://tools.ietf.org/html/rfc3492#section-3.4
             * @private
             */


            function adapt(delta, numPoints, firstTime) {
              var k = 0;
              delta = firstTime ? floor(delta / damp) : delta >> 1;
              delta += floor(delta / numPoints);

              for (; delta > baseMinusTMin * tMax >> 1; k += base) {
                delta = floor(delta / baseMinusTMin);
              }

              return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
            }
            /**
             * Converts a Punycode string of ASCII-only symbols to a string of Unicode
             * symbols.
             * @memberOf punycode
             * @param {String} input The Punycode string of ASCII-only symbols.
             * @returns {String} The resulting string of Unicode symbols.
             */


            function decode(input) {
              // Don't use UCS-2
              var output = [],
                  inputLength = input.length,
                  out,
                  i = 0,
                  n = initialN,
                  bias = initialBias,
                  basic,
                  j,
                  index,
                  oldi,
                  w,
                  k,
                  digit,
                  t,

              /** Cached calculation results */
              baseMinusT; // Handle the basic code points: let `basic` be the number of input code
              // points before the last delimiter, or `0` if there is none, then copy
              // the first basic code points to the output.

              basic = input.lastIndexOf(delimiter);

              if (basic < 0) {
                basic = 0;
              }

              for (j = 0; j < basic; ++j) {
                // if it's not a basic code point
                if (input.charCodeAt(j) >= 0x80) {
                  error('not-basic');
                }

                output.push(input.charCodeAt(j));
              } // Main decoding loop: start just after the last delimiter if any basic code
              // points were copied; start at the beginning otherwise.


              for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
                // `index` is the index of the next character to be consumed.
                // Decode a generalized variable-length integer into `delta`,
                // which gets added to `i`. The overflow checking is easier
                // if we increase `i` as we go, then subtract off its starting
                // value at the end to obtain `delta`.
                for (oldi = i, w = 1, k = base;; k += base) {
                  if (index >= inputLength) {
                    error('invalid-input');
                  }

                  digit = basicToDigit(input.charCodeAt(index++));

                  if (digit >= base || digit > floor((maxInt - i) / w)) {
                    error('overflow');
                  }

                  i += digit * w;
                  t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

                  if (digit < t) {
                    break;
                  }

                  baseMinusT = base - t;

                  if (w > floor(maxInt / baseMinusT)) {
                    error('overflow');
                  }

                  w *= baseMinusT;
                }

                out = output.length + 1;
                bias = adapt(i - oldi, out, oldi == 0); // `i` was supposed to wrap around from `out` to `0`,
                // incrementing `n` each time, so we'll fix that now:

                if (floor(i / out) > maxInt - n) {
                  error('overflow');
                }

                n += floor(i / out);
                i %= out; // Insert `n` at position `i` of the output

                output.splice(i++, 0, n);
              }

              return ucs2encode(output);
            }
            /**
             * Converts a string of Unicode symbols (e.g. a domain name label) to a
             * Punycode string of ASCII-only symbols.
             * @memberOf punycode
             * @param {String} input The string of Unicode symbols.
             * @returns {String} The resulting Punycode string of ASCII-only symbols.
             */


            function encode(input) {
              var n,
                  delta,
                  handledCPCount,
                  basicLength,
                  bias,
                  j,
                  m,
                  q,
                  k,
                  t,
                  currentValue,
                  output = [],

              /** `inputLength` will hold the number of code points in `input`. */
              inputLength,

              /** Cached calculation results */
              handledCPCountPlusOne,
                  baseMinusT,
                  qMinusT; // Convert the input in UCS-2 to Unicode

              input = ucs2decode(input); // Cache the length

              inputLength = input.length; // Initialize the state

              n = initialN;
              delta = 0;
              bias = initialBias; // Handle the basic code points

              for (j = 0; j < inputLength; ++j) {
                currentValue = input[j];

                if (currentValue < 0x80) {
                  output.push(stringFromCharCode(currentValue));
                }
              }

              handledCPCount = basicLength = output.length; // `handledCPCount` is the number of code points that have been handled;
              // `basicLength` is the number of basic code points.
              // Finish the basic string - if it is not empty - with a delimiter

              if (basicLength) {
                output.push(delimiter);
              } // Main encoding loop:


              while (handledCPCount < inputLength) {
                // All non-basic code points < n have been handled already. Find the next
                // larger one:
                for (m = maxInt, j = 0; j < inputLength; ++j) {
                  currentValue = input[j];

                  if (currentValue >= n && currentValue < m) {
                    m = currentValue;
                  }
                } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                // but guard against overflow


                handledCPCountPlusOne = handledCPCount + 1;

                if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                  error('overflow');
                }

                delta += (m - n) * handledCPCountPlusOne;
                n = m;

                for (j = 0; j < inputLength; ++j) {
                  currentValue = input[j];

                  if (currentValue < n && ++delta > maxInt) {
                    error('overflow');
                  }

                  if (currentValue == n) {
                    // Represent delta as a generalized variable-length integer
                    for (q = delta, k = base;; k += base) {
                      t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

                      if (q < t) {
                        break;
                      }

                      qMinusT = q - t;
                      baseMinusT = base - t;
                      output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                      q = floor(qMinusT / baseMinusT);
                    }

                    output.push(stringFromCharCode(digitToBasic(q, 0)));
                    bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                    delta = 0;
                    ++handledCPCount;
                  }
                }

                ++delta;
                ++n;
              }

              return output.join('');
            }
            /**
             * Converts a Punycode string representing a domain name or an email address
             * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
             * it doesn't matter if you call it on a string that has already been
             * converted to Unicode.
             * @memberOf punycode
             * @param {String} input The Punycoded domain name or email address to
             * convert to Unicode.
             * @returns {String} The Unicode representation of the given Punycode
             * string.
             */


            function toUnicode(input) {
              return mapDomain(input, function (string) {
                return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
              });
            }
            /**
             * Converts a Unicode string representing a domain name or an email address to
             * Punycode. Only the non-ASCII parts of the domain name will be converted,
             * i.e. it doesn't matter if you call it with a domain that's already in
             * ASCII.
             * @memberOf punycode
             * @param {String} input The domain name or email address to convert, as a
             * Unicode string.
             * @returns {String} The Punycode representation of the given domain name or
             * email address.
             */


            function toASCII(input) {
              return mapDomain(input, function (string) {
                return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
              });
            }
            /*--------------------------------------------------------------------------*/

            /** Define the public API */


            punycode = {
              /**
               * A string representing the current Punycode.js version number.
               * @memberOf punycode
               * @type String
               */
              'version': '1.4.1',

              /**
               * An object of methods to convert from JavaScript's internal character
               * representation (UCS-2) to Unicode code points, and back.
               * @see <https://mathiasbynens.be/notes/javascript-encoding>
               * @memberOf punycode
               * @type Object
               */
              'ucs2': {
                'decode': ucs2decode,
                'encode': ucs2encode
              },
              'decode': decode,
              'encode': encode,
              'toASCII': toASCII,
              'toUnicode': toUnicode
            };
            /** Expose `punycode` */
            // Some AMD build optimizers, like r.js, check for specific condition patterns
            // like the following:

            if (freeExports && freeModule) {
              if (module.exports == freeExports) {
                // in Node.js, io.js, or RingoJS v0.8.0+
                freeModule.exports = punycode;
              } else {
                // in Narwhal or RingoJS v0.7.0-
                for (key in punycode) {
                  punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
                }
              }
            } else {
              // in Rhino or a web browser
              root.punycode = punycode;
            }
          })(this);
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {}],
      61: [function (require, module, exports) {
        module.exports = /[\0-\x1F\x7F-\x9F]/;
      }, {}],
      62: [function (require, module, exports) {
        module.exports = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
      }, {}],
      63: [function (require, module, exports) {
        module.exports = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
      }, {}],
      64: [function (require, module, exports) {
        module.exports = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
      }, {}],
      65: [function (require, module, exports) {

        exports.Any = require('./properties/Any/regex');
        exports.Cc = require('./categories/Cc/regex');
        exports.Cf = require('./categories/Cf/regex');
        exports.P = require('./categories/P/regex');
        exports.Z = require('./categories/Z/regex');
      }, {
        "./categories/Cc/regex": 61,
        "./categories/Cf/regex": 62,
        "./categories/P/regex": 63,
        "./categories/Z/regex": 64,
        "./properties/Any/regex": 66
      }],
      66: [function (require, module, exports) {
        module.exports = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      }, {}],
      67: [function (require, module, exports) {

        module.exports = require('./lib/');
      }, {
        "./lib/": 9
      }]
    }, {}, [67])(67);
  });

  /*! markdown-it-footnote 3.0.2 https://github.com//markdown-it/markdown-it-footnote @license MIT */
  (function (f) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;

      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }

      g.markdownitFootnote = f();
    }
  })(function () {
    return function () {
      function r(e, n, t) {
        function o(i, f) {
          if (!n[i]) {
            if (!e[i]) {
              var c = "function" == typeof require && require;
              if (!f && c) return c(i, !0);
              if (u) return u(i, !0);
              var a = new Error("Cannot find module '" + i + "'");
              throw a.code = "MODULE_NOT_FOUND", a;
            }

            var p = n[i] = {
              exports: {}
            };
            e[i][0].call(p.exports, function (r) {
              var n = e[i][1][r];
              return o(n || r);
            }, p, p.exports, r, e, n, t);
          }

          return n[i].exports;
        }

        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
          o(t[i]);
        }

        return o;
      }

      return r;
    }()({
      1: [function (require, module, exports) {
        // Renderer partials

        function render_footnote_anchor_name(tokens, idx, options, env
        /*, slf*/
        ) {
          var n = Number(tokens[idx].meta.id + 1).toString();
          var prefix = '';

          if (typeof env.docId === 'string') {
            prefix = '-' + env.docId + '-';
          }

          return prefix + n;
        }

        function render_footnote_caption(tokens, idx
        /*, options, env, slf*/
        ) {
          var n = Number(tokens[idx].meta.id + 1).toString();

          if (tokens[idx].meta.subId > 0) {
            n += ':' + tokens[idx].meta.subId;
          }

          return '[' + n + ']';
        }

        function render_footnote_ref(tokens, idx, options, env, slf) {
          var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
          var caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
          var refid = id;

          if (tokens[idx].meta.subId > 0) {
            refid += ':' + tokens[idx].meta.subId;
          }

          return '<sup class="footnote-ref"><a href="#fn' + id + '" id="fnref' + refid + '">' + caption + '</a></sup>';
        }

        function render_footnote_block_open(tokens, idx, options) {
          return (options.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') + '<section class="footnotes">\n' + '<ol class="footnotes-list">\n';
        }

        function render_footnote_block_close() {
          return '</ol>\n</section>\n';
        }

        function render_footnote_open(tokens, idx, options, env, slf) {
          var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);

          if (tokens[idx].meta.subId > 0) {
            id += ':' + tokens[idx].meta.subId;
          }

          return '<li id="fn' + id + '" class="footnote-item">';
        }

        function render_footnote_close() {
          return '</li>\n';
        }

        function render_footnote_anchor(tokens, idx, options, env, slf) {
          var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);

          if (tokens[idx].meta.subId > 0) {
            id += ':' + tokens[idx].meta.subId;
          }
          /* ↩ with escape code to prevent display as Apple Emoji on iOS */


          return ' <a href="#fnref' + id + "\" class=\"footnote-backref\">\u21A9\uFE0E</a>";
        }

        module.exports = function footnote_plugin(md) {
          var parseLinkLabel = md.helpers.parseLinkLabel,
              isSpace = md.utils.isSpace;
          md.renderer.rules.footnote_ref = render_footnote_ref;
          md.renderer.rules.footnote_block_open = render_footnote_block_open;
          md.renderer.rules.footnote_block_close = render_footnote_block_close;
          md.renderer.rules.footnote_open = render_footnote_open;
          md.renderer.rules.footnote_close = render_footnote_close;
          md.renderer.rules.footnote_anchor = render_footnote_anchor; // helpers (only used in other rules, no tokens are attached to those)

          md.renderer.rules.footnote_caption = render_footnote_caption;
          md.renderer.rules.footnote_anchor_name = render_footnote_anchor_name; // Process footnote block definition

          function footnote_def(state, startLine, endLine, silent) {
            var oldBMark,
                oldTShift,
                oldSCount,
                oldParentType,
                pos,
                label,
                token,
                initial,
                offset,
                ch,
                posAfterColon,
                start = state.bMarks[startLine] + state.tShift[startLine],
                max = state.eMarks[startLine]; // line should be at least 5 chars - "[^x]:"

            if (start + 4 > max) {
              return false;
            }

            if (state.src.charCodeAt(start) !== 0x5B
            /* [ */
            ) {
              return false;
            }

            if (state.src.charCodeAt(start + 1) !== 0x5E
            /* ^ */
            ) {
              return false;
            }

            for (pos = start + 2; pos < max; pos++) {
              if (state.src.charCodeAt(pos) === 0x20) {
                return false;
              }

              if (state.src.charCodeAt(pos) === 0x5D
              /* ] */
              ) {
                break;
              }
            }

            if (pos === start + 2) {
              return false;
            } // no empty footnote labels


            if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 0x3A
            /* : */
            ) {
              return false;
            }

            if (silent) {
              return true;
            }

            pos++;

            if (!state.env.footnotes) {
              state.env.footnotes = {};
            }

            if (!state.env.footnotes.refs) {
              state.env.footnotes.refs = {};
            }

            label = state.src.slice(start + 2, pos - 2);
            state.env.footnotes.refs[':' + label] = -1;
            token = new state.Token('footnote_reference_open', '', 1);
            token.meta = {
              label: label
            };
            token.level = state.level++;
            state.tokens.push(token);
            oldBMark = state.bMarks[startLine];
            oldTShift = state.tShift[startLine];
            oldSCount = state.sCount[startLine];
            oldParentType = state.parentType;
            posAfterColon = pos;
            initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);

            while (pos < max) {
              ch = state.src.charCodeAt(pos);

              if (isSpace(ch)) {
                if (ch === 0x09) {
                  offset += 4 - offset % 4;
                } else {
                  offset++;
                }
              } else {
                break;
              }

              pos++;
            }

            state.tShift[startLine] = pos - posAfterColon;
            state.sCount[startLine] = offset - initial;
            state.bMarks[startLine] = posAfterColon;
            state.blkIndent += 4;
            state.parentType = 'footnote';

            if (state.sCount[startLine] < state.blkIndent) {
              state.sCount[startLine] += state.blkIndent;
            }

            state.md.block.tokenize(state, startLine, endLine, true);
            state.parentType = oldParentType;
            state.blkIndent -= 4;
            state.tShift[startLine] = oldTShift;
            state.sCount[startLine] = oldSCount;
            state.bMarks[startLine] = oldBMark;
            token = new state.Token('footnote_reference_close', '', -1);
            token.level = --state.level;
            state.tokens.push(token);
            return true;
          } // Process inline footnotes (^[...])


          function footnote_inline(state, silent) {
            var labelStart,
                labelEnd,
                footnoteId,
                token,
                tokens,
                max = state.posMax,
                start = state.pos;

            if (start + 2 >= max) {
              return false;
            }

            if (state.src.charCodeAt(start) !== 0x5E
            /* ^ */
            ) {
              return false;
            }

            if (state.src.charCodeAt(start + 1) !== 0x5B
            /* [ */
            ) {
              return false;
            }

            labelStart = start + 2;
            labelEnd = parseLinkLabel(state, start + 1); // parser failed to find ']', so it's not a valid note

            if (labelEnd < 0) {
              return false;
            } // We found the end of the link, and know for a fact it's a valid link;
            // so all that's left to do is to call tokenizer.
            //


            if (!silent) {
              if (!state.env.footnotes) {
                state.env.footnotes = {};
              }

              if (!state.env.footnotes.list) {
                state.env.footnotes.list = [];
              }

              footnoteId = state.env.footnotes.list.length;
              state.md.inline.parse(state.src.slice(labelStart, labelEnd), state.md, state.env, tokens = []);
              token = state.push('footnote_ref', '', 0);
              token.meta = {
                id: footnoteId
              };
              state.env.footnotes.list[footnoteId] = {
                content: state.src.slice(labelStart, labelEnd),
                tokens: tokens
              };
            }

            state.pos = labelEnd + 1;
            state.posMax = max;
            return true;
          } // Process footnote references ([^...])


          function footnote_ref(state, silent) {
            var label,
                pos,
                footnoteId,
                footnoteSubId,
                token,
                max = state.posMax,
                start = state.pos; // should be at least 4 chars - "[^x]"

            if (start + 3 > max) {
              return false;
            }

            if (!state.env.footnotes || !state.env.footnotes.refs) {
              return false;
            }

            if (state.src.charCodeAt(start) !== 0x5B
            /* [ */
            ) {
              return false;
            }

            if (state.src.charCodeAt(start + 1) !== 0x5E
            /* ^ */
            ) {
              return false;
            }

            for (pos = start + 2; pos < max; pos++) {
              if (state.src.charCodeAt(pos) === 0x20) {
                return false;
              }

              if (state.src.charCodeAt(pos) === 0x0A) {
                return false;
              }

              if (state.src.charCodeAt(pos) === 0x5D
              /* ] */
              ) {
                break;
              }
            }

            if (pos === start + 2) {
              return false;
            } // no empty footnote labels


            if (pos >= max) {
              return false;
            }

            pos++;
            label = state.src.slice(start + 2, pos - 1);

            if (typeof state.env.footnotes.refs[':' + label] === 'undefined') {
              return false;
            }

            if (!silent) {
              if (!state.env.footnotes.list) {
                state.env.footnotes.list = [];
              }

              if (state.env.footnotes.refs[':' + label] < 0) {
                footnoteId = state.env.footnotes.list.length;
                state.env.footnotes.list[footnoteId] = {
                  label: label,
                  count: 0
                };
                state.env.footnotes.refs[':' + label] = footnoteId;
              } else {
                footnoteId = state.env.footnotes.refs[':' + label];
              }

              footnoteSubId = state.env.footnotes.list[footnoteId].count;
              state.env.footnotes.list[footnoteId].count++;
              token = state.push('footnote_ref', '', 0);
              token.meta = {
                id: footnoteId,
                subId: footnoteSubId,
                label: label
              };
            }

            state.pos = pos;
            state.posMax = max;
            return true;
          } // Glue footnote tokens to end of token stream


          function footnote_tail(state) {
            var i,
                l,
                j,
                t,
                lastParagraph,
                list,
                token,
                tokens,
                current,
                currentLabel,
                insideRef = false,
                refTokens = {};

            if (!state.env.footnotes) {
              return;
            }

            state.tokens = state.tokens.filter(function (tok) {
              if (tok.type === 'footnote_reference_open') {
                insideRef = true;
                current = [];
                currentLabel = tok.meta.label;
                return false;
              }

              if (tok.type === 'footnote_reference_close') {
                insideRef = false; // prepend ':' to avoid conflict with Object.prototype members

                refTokens[':' + currentLabel] = current;
                return false;
              }

              if (insideRef) {
                current.push(tok);
              }

              return !insideRef;
            });

            if (!state.env.footnotes.list) {
              return;
            }

            list = state.env.footnotes.list;
            token = new state.Token('footnote_block_open', '', 1);
            state.tokens.push(token);

            for (i = 0, l = list.length; i < l; i++) {
              token = new state.Token('footnote_open', '', 1);
              token.meta = {
                id: i,
                label: list[i].label
              };
              state.tokens.push(token);

              if (list[i].tokens) {
                tokens = [];
                token = new state.Token('paragraph_open', 'p', 1);
                token.block = true;
                tokens.push(token);
                token = new state.Token('inline', '', 0);
                token.children = list[i].tokens;
                token.content = list[i].content;
                tokens.push(token);
                token = new state.Token('paragraph_close', 'p', -1);
                token.block = true;
                tokens.push(token);
              } else if (list[i].label) {
                tokens = refTokens[':' + list[i].label];
              }

              state.tokens = state.tokens.concat(tokens);

              if (state.tokens[state.tokens.length - 1].type === 'paragraph_close') {
                lastParagraph = state.tokens.pop();
              } else {
                lastParagraph = null;
              }

              t = list[i].count > 0 ? list[i].count : 1;

              for (j = 0; j < t; j++) {
                token = new state.Token('footnote_anchor', '', 0);
                token.meta = {
                  id: i,
                  subId: j,
                  label: list[i].label
                };
                state.tokens.push(token);
              }

              if (lastParagraph) {
                state.tokens.push(lastParagraph);
              }

              token = new state.Token('footnote_close', '', -1);
              state.tokens.push(token);
            }

            token = new state.Token('footnote_block_close', '', -1);
            state.tokens.push(token);
          }

          md.block.ruler.before('reference', 'footnote_def', footnote_def, {
            alt: ['paragraph', 'reference']
          });
          md.inline.ruler.after('image', 'footnote_inline', footnote_inline);
          md.inline.ruler.after('footnote_inline', 'footnote_ref', footnote_ref);
          md.core.ruler.after('inline', 'footnote_tail', footnote_tail);
        };
      }, {}]
    }, {}, [1])(1);
  });

  /*! markdown-it-task-lists 2.1.0 https://github.com/revin/markdown-it-task-lists#readme by @license ISC */
  (function (f) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;

      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }

      g.markdownitTaskLists = f();
    }
  })(function () {
    return function () {
      function e(t, n, r) {
        function s(o, u) {
          if (!n[o]) {
            if (!t[o]) {
              var a = typeof require == "function" && require;
              if (!u && a) return a(o, !0);
              if (i) return i(o, !0);
              var f = new Error("Cannot find module '" + o + "'");
              throw f.code = "MODULE_NOT_FOUND", f;
            }

            var l = n[o] = {
              exports: {}
            };
            t[o][0].call(l.exports, function (e) {
              var n = t[o][1][e];
              return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
          }

          return n[o].exports;
        }

        var i = typeof require == "function" && require;

        for (var o = 0; o < r.length; o++) {
          s(r[o]);
        }

        return s;
      }

      return e;
    }()({
      1: [function (require, module, exports) {
        // Markdown-it plugin to render GitHub-style task lists; see
        //
        // https://github.com/blog/1375-task-lists-in-gfm-issues-pulls-comments
        // https://github.com/blog/1825-task-lists-in-all-markdown-documents
        var disableCheckboxes = true;
        var useLabelWrapper = false;
        var useLabelAfter = false;

        module.exports = function (md, options) {
          if (options) {
            disableCheckboxes = !options.enabled;
            useLabelWrapper = !!options.label;
            useLabelAfter = !!options.labelAfter;
          }

          md.core.ruler.after('inline', 'github-task-lists', function (state) {
            var tokens = state.tokens;

            for (var i = 2; i < tokens.length; i++) {
              if (isTodoItem(tokens, i)) {
                todoify(tokens[i], state.Token);
                attrSet(tokens[i - 2], 'class', 'task-list-item' + (!disableCheckboxes ? ' enabled' : ''));
                attrSet(tokens[parentToken(tokens, i - 2)], 'class', 'contains-task-list');
              }
            }
          });
        };

        function attrSet(token, name, value) {
          var index = token.attrIndex(name);
          var attr = [name, value];

          if (index < 0) {
            token.attrPush(attr);
          } else {
            token.attrs[index] = attr;
          }
        }

        function parentToken(tokens, index) {
          var targetLevel = tokens[index].level - 1;

          for (var i = index - 1; i >= 0; i--) {
            if (tokens[i].level === targetLevel) {
              return i;
            }
          }

          return -1;
        }

        function isTodoItem(tokens, index) {
          return isInline(tokens[index]) && isParagraph(tokens[index - 1]) && isListItem(tokens[index - 2]) && startsWithTodoMarkdown(tokens[index]);
        }

        function todoify(token, TokenConstructor) {
          token.children.unshift(makeCheckbox(token, TokenConstructor));
          token.children[1].content = token.children[1].content.slice(3);
          token.content = token.content.slice(3);

          if (useLabelWrapper) {
            if (useLabelAfter) {
              token.children.pop(); // Use large random number as id property of the checkbox.

              var id = 'task-item-' + Math.ceil(Math.random() * (10000 * 1000) - 1000);
              token.children[0].content = token.children[0].content.slice(0, -1) + ' id="' + id + '">';
              token.children.push(afterLabel(token.content, id, TokenConstructor));
            } else {
              token.children.unshift(beginLabel(TokenConstructor));
              token.children.push(endLabel(TokenConstructor));
            }
          }
        }

        function makeCheckbox(token, TokenConstructor) {
          var checkbox = new TokenConstructor('html_inline', '', 0);
          var disabledAttr = disableCheckboxes ? ' disabled="" ' : '';

          if (token.content.indexOf('[ ] ') === 0) {
            checkbox.content = '<input class="task-list-item-checkbox"' + disabledAttr + 'type="checkbox">';
          } else if (token.content.indexOf('[x] ') === 0 || token.content.indexOf('[X] ') === 0) {
            checkbox.content = '<input class="task-list-item-checkbox" checked=""' + disabledAttr + 'type="checkbox">';
          }

          return checkbox;
        } // these next two functions are kind of hacky; probably should really be a
        // true block-level token with .tag=='label'


        function beginLabel(TokenConstructor) {
          var token = new TokenConstructor('html_inline', '', 0);
          token.content = '<label>';
          return token;
        }

        function endLabel(TokenConstructor) {
          var token = new TokenConstructor('html_inline', '', 0);
          token.content = '</label>';
          return token;
        }

        function afterLabel(content, id, TokenConstructor) {
          var token = new TokenConstructor('html_inline', '', 0);
          token.content = '<label class="task-list-item-label" for="' + id + '">' + content + '</label>';
          token.attrs = [{
            "for": id
          }];
          return token;
        }

        function isInline(token) {
          return token.type === 'inline';
        }

        function isParagraph(token) {
          return token.type === 'paragraph_open';
        }

        function isListItem(token) {
          return token.type === 'list_item_open';
        }

        function startsWithTodoMarkdown(token) {
          // leading whitespace in a list item is already trimmed off by markdown-it
          return token.content.indexOf('[ ] ') === 0 || token.content.indexOf('[x] ') === 0 || token.content.indexOf('[X] ') === 0;
        }
      }, {}]
    }, {}, [1])(1);
  });

  (function (f) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;

      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }

      g.markdownItAttrs = f();
    }
  })(function () {
    return function () {
      function r(e, n, t) {
        function o(i, f) {
          if (!n[i]) {
            if (!e[i]) {
              var c = "function" == typeof require && require;
              if (!f && c) return c(i, !0);
              if (u) return u(i, !0);
              var a = new Error("Cannot find module '" + i + "'");
              throw a.code = "MODULE_NOT_FOUND", a;
            }

            var p = n[i] = {
              exports: {}
            };
            e[i][0].call(p.exports, function (r) {
              var n = e[i][1][r];
              return o(n || r);
            }, p, p.exports, r, e, n, t);
          }

          return n[i].exports;
        }

        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
          o(t[i]);
        }

        return o;
      }

      return r;
    }()({
      1: [function (require, module, exports) {

        function _typeof$1(obj) {
          if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
            _typeof$1 = function _typeof$1(obj) {
              return _typeof(obj);
            };
          } else {
            _typeof$1 = function _typeof$1(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
            };
          }

          return _typeof$1(obj);
        }

        var patternsConfig = require('./patterns.js');

        var defaultOptions = {
          leftDelimiter: '{',
          rightDelimiter: '}',
          allowedAttributes: []
        };

        module.exports = function attributes(md, options_) {
          var options = Object.assign({}, defaultOptions);
          options = Object.assign(options, options_);
          var patterns = patternsConfig(options);

          function curlyAttrs(state) {
            var tokens = state.tokens;

            var _loop = function _loop(i) {
              for (var p = 0; p < patterns.length; p++) {
                var pattern = patterns[p];
                var j = null; // position of child with offset 0

                var match = pattern.tests.every(function (t) {
                  var res = test(tokens, i, t);

                  if (res.j !== null) {
                    j = res.j;
                  }

                  return res.match;
                });

                if (match) {
                  pattern.transform(tokens, i, j);

                  if (pattern.name === 'inline attributes' || pattern.name === 'inline nesting 0') {
                    // retry, may be several inline attributes
                    p--;
                  }
                }
              }
            };

            for (var i = 0; i < tokens.length; i++) {
              _loop(i);
            }
          }

          md.core.ruler.before('linkify', 'curly_attributes', curlyAttrs);
        };
        /**
         * Test if t matches token stream.
         *
         * @param {array} tokens
         * @param {number} i
         * @param {object} t Test to match.
         * @return {object} { match: true|false, j: null|number }
         */


        function test(tokens, i, t) {
          var res = {
            match: false,
            j: null // position of child

          };
          var ii = t.shift !== undefined ? i + t.shift : t.position;
          var token = get(tokens, ii); // supports negative ii

          if (token === undefined) {
            return res;
          }

          var _loop2 = function _loop2(key) {
            if (key === 'shift' || key === 'position') {
              return "continue";
            }

            if (token[key] === undefined) {
              return {
                v: res
              };
            }

            if (key === 'children' && isArrayOfObjects(t.children)) {
              var _ret2 = function () {
                if (token.children.length === 0) {
                  return {
                    v: {
                      v: res
                    }
                  };
                }

                var match;
                var childTests = t.children;
                var children = token.children;

                if (childTests.every(function (tt) {
                  return tt.position !== undefined;
                })) {
                  // positions instead of shifts, do not loop all children
                  match = childTests.every(function (tt) {
                    return test(children, tt.position, tt).match;
                  });

                  if (match) {
                    // we may need position of child in transform
                    var j = last(childTests).position;
                    res.j = j >= 0 ? j : children.length + j;
                  }
                } else {
                  var _loop3 = function _loop3(_j) {
                    match = childTests.every(function (tt) {
                      return test(children, _j, tt).match;
                    });

                    if (match) {
                      res.j = _j; // all tests true, continue with next key of pattern t

                      return "break";
                    }
                  };

                  for (var _j = 0; _j < children.length; _j++) {
                    var _ret3 = _loop3(_j);

                    if (_ret3 === "break") break;
                  }
                }

                if (match === false) {
                  return {
                    v: {
                      v: res
                    }
                  };
                }

                return {
                  v: "continue"
                };
              }();

              if (_typeof$1(_ret2) === "object") return _ret2.v;
            }

            switch (_typeof$1(t[key])) {
              case 'boolean':
              case 'number':
              case 'string':
                if (token[key] !== t[key]) {
                  return {
                    v: res
                  };
                }

                break;

              case 'function':
                if (!t[key](token[key])) {
                  return {
                    v: res
                  };
                }

                break;

              case 'object':
                if (isArrayOfFunctions(t[key])) {
                  var r = t[key].every(function (tt) {
                    return tt(token[key]);
                  });

                  if (r === false) {
                    return {
                      v: res
                    };
                  }

                  break;
                }

              // fall through for objects !== arrays of functions

              default:
                throw new Error("Unknown type of pattern test (key: ".concat(key, "). Test should be of type boolean, number, string, function or array of functions."));
            }
          };

          for (var key in t) {
            var _ret = _loop2(key);

            switch (_ret) {
              case "continue":
                continue;

              default:
                if (_typeof$1(_ret) === "object") return _ret.v;
            }
          } // no tests returned false -> all tests returns true


          res.match = true;
          return res;
        }

        function isArrayOfObjects(arr) {
          return Array.isArray(arr) && arr.length && arr.every(function (i) {
            return _typeof$1(i) === 'object';
          });
        }

        function isArrayOfFunctions(arr) {
          return Array.isArray(arr) && arr.length && arr.every(function (i) {
            return typeof i === 'function';
          });
        }
        /**
         * Get n item of array. Supports negative n, where -1 is last
         * element in array.
         * @param {array} arr
         * @param {number} n
         */


        function get(arr, n) {
          return n >= 0 ? arr[n] : arr[arr.length + n];
        } // get last element of array, safe - returns {} if not found


        function last(arr) {
          return arr.slice(-1)[0] || {};
        }
      }, {
        "./patterns.js": 2
      }],
      2: [function (require, module, exports) {
        /**
         * If a pattern matches the token stream,
         * then run transform.
         */

        var utils = require('./utils.js');

        module.exports = function (options) {
          var __hr = new RegExp('^ {0,3}[-*_]{3,} ?' + utils.escapeRegExp(options.leftDelimiter) + '[^' + utils.escapeRegExp(options.rightDelimiter) + ']');

          return [{
            /**
             * ```python {.cls}
             * for i in range(10):
             *     print(i)
             * ```
             */
            name: 'fenced code blocks',
            tests: [{
              shift: 0,
              block: true,
              info: utils.hasDelimiters('end', options)
            }],
            transform: function transform(tokens, i) {
              var token = tokens[i];
              var start = token.info.lastIndexOf(options.leftDelimiter);
              var attrs = utils.getAttrs(token.info, start, options);
              utils.addAttrs(attrs, token);
              token.info = utils.removeDelimiter(token.info, options);
            }
          }, {
            /**
             * bla `click()`{.c} ![](img.png){.d}
             *
             * differs from 'inline attributes' as it does
             * not have a closing tag (nesting: -1)
             */
            name: 'inline nesting 0',
            tests: [{
              shift: 0,
              type: 'inline',
              children: [{
                shift: -1,
                type: function type(str) {
                  return str === 'image' || str === 'code_inline';
                }
              }, {
                shift: 0,
                type: 'text',
                content: utils.hasDelimiters('start', options)
              }]
            }],
            transform: function transform(tokens, i, j) {
              var token = tokens[i].children[j];
              var endChar = token.content.indexOf(options.rightDelimiter);
              var attrToken = tokens[i].children[j - 1];
              var attrs = utils.getAttrs(token.content, 0, options);
              utils.addAttrs(attrs, attrToken);

              if (token.content.length === endChar + options.rightDelimiter.length) {
                tokens[i].children.splice(j, 1);
              } else {
                token.content = token.content.slice(endChar + options.rightDelimiter.length);
              }
            }
          }, {
            /**
             * | h1 |
             * | -- |
             * | c1 |
             * {.c}
             */
            name: 'tables',
            tests: [{
              // let this token be i, such that for-loop continues at
              // next token after tokens.splice
              shift: 0,
              type: 'table_close'
            }, {
              shift: 1,
              type: 'paragraph_open'
            }, {
              shift: 2,
              type: 'inline',
              content: utils.hasDelimiters('only', options)
            }],
            transform: function transform(tokens, i) {
              var token = tokens[i + 2];
              var tableOpen = utils.getMatchingOpeningToken(tokens, i);
              var attrs = utils.getAttrs(token.content, 0, options); // add attributes

              utils.addAttrs(attrs, tableOpen); // remove <p>{.c}</p>

              tokens.splice(i + 1, 3);
            }
          }, {
            /**
             * *emphasis*{.with attrs=1}
             */
            name: 'inline attributes',
            tests: [{
              shift: 0,
              type: 'inline',
              children: [{
                shift: -1,
                nesting: -1 // closing inline tag, </em>{.a}

              }, {
                shift: 0,
                type: 'text',
                content: utils.hasDelimiters('start', options)
              }]
            }],
            transform: function transform(tokens, i, j) {
              var token = tokens[i].children[j];
              var content = token.content;
              var attrs = utils.getAttrs(content, 0, options);
              var openingToken = utils.getMatchingOpeningToken(tokens[i].children, j - 1);
              utils.addAttrs(attrs, openingToken);
              token.content = content.slice(content.indexOf(options.rightDelimiter) + options.rightDelimiter.length);
            }
          }, {
            /**
             * - item
             * {.a}
             */
            name: 'list softbreak',
            tests: [{
              shift: -2,
              type: 'list_item_open'
            }, {
              shift: 0,
              type: 'inline',
              children: [{
                position: -2,
                type: 'softbreak'
              }, {
                position: -1,
                type: 'text',
                content: utils.hasDelimiters('only', options)
              }]
            }],
            transform: function transform(tokens, i, j) {
              var token = tokens[i].children[j];
              var content = token.content;
              var attrs = utils.getAttrs(content, 0, options);
              var ii = i - 2;

              while (tokens[ii - 1] && tokens[ii - 1].type !== 'ordered_list_open' && tokens[ii - 1].type !== 'bullet_list_open') {
                ii--;
              }

              utils.addAttrs(attrs, tokens[ii - 1]);
              tokens[i].children = tokens[i].children.slice(0, -2);
            }
          }, {
            /**
             * - nested list
             *   - with double \n
             *   {.a} <-- apply to nested ul
             *
             * {.b} <-- apply to root <ul>
             */
            name: 'list double softbreak',
            tests: [{
              // let this token be i = 0 so that we can erase
              // the <p>{.a}</p> tokens below
              shift: 0,
              type: function type(str) {
                return str === 'bullet_list_close' || str === 'ordered_list_close';
              }
            }, {
              shift: 1,
              type: 'paragraph_open'
            }, {
              shift: 2,
              type: 'inline',
              content: utils.hasDelimiters('only', options),
              children: function children(arr) {
                return arr.length === 1;
              }
            }, {
              shift: 3,
              type: 'paragraph_close'
            }],
            transform: function transform(tokens, i) {
              var token = tokens[i + 2];
              var content = token.content;
              var attrs = utils.getAttrs(content, 0, options);
              var openingToken = utils.getMatchingOpeningToken(tokens, i);
              utils.addAttrs(attrs, openingToken);
              tokens.splice(i + 1, 3);
            }
          }, {
            /**
             * - end of {.list-item}
             */
            name: 'list item end',
            tests: [{
              shift: -2,
              type: 'list_item_open'
            }, {
              shift: 0,
              type: 'inline',
              children: [{
                position: -1,
                type: 'text',
                content: utils.hasDelimiters('end', options)
              }]
            }],
            transform: function transform(tokens, i, j) {
              var token = tokens[i].children[j];
              var content = token.content;
              var attrs = utils.getAttrs(content, content.lastIndexOf(options.leftDelimiter), options);
              utils.addAttrs(attrs, tokens[i - 2]);
              var trimmed = content.slice(0, content.lastIndexOf(options.leftDelimiter));
              token.content = last(trimmed) !== ' ' ? trimmed : trimmed.slice(0, -1);
            }
          }, {
            /**
             * something with softbreak
             * {.cls}
             */
            name: '\n{.a} softbreak then curly in start',
            tests: [{
              shift: 0,
              type: 'inline',
              children: [{
                position: -2,
                type: 'softbreak'
              }, {
                position: -1,
                type: 'text',
                content: utils.hasDelimiters('only', options)
              }]
            }],
            transform: function transform(tokens, i, j) {
              var token = tokens[i].children[j];
              var attrs = utils.getAttrs(token.content, 0, options); // find last closing tag

              var ii = i + 1;

              while (tokens[ii + 1] && tokens[ii + 1].nesting === -1) {
                ii++;
              }

              var openingToken = utils.getMatchingOpeningToken(tokens, ii);
              utils.addAttrs(attrs, openingToken);
              tokens[i].children = tokens[i].children.slice(0, -2);
            }
          }, {
            /**
             * horizontal rule --- {#id}
             */
            name: 'horizontal rule',
            tests: [{
              shift: 0,
              type: 'paragraph_open'
            }, {
              shift: 1,
              type: 'inline',
              children: function children(arr) {
                return arr.length === 1;
              },
              content: function content(str) {
                return str.match(__hr) !== null;
              }
            }, {
              shift: 2,
              type: 'paragraph_close'
            }],
            transform: function transform(tokens, i) {
              var token = tokens[i];
              token.type = 'hr';
              token.tag = 'hr';
              token.nesting = 0;
              var content = tokens[i + 1].content;
              var start = content.lastIndexOf(options.leftDelimiter);
              token.attrs = utils.getAttrs(content, start, options);
              token.markup = content;
              tokens.splice(i + 1, 2);
            }
          }, {
            /**
             * end of {.block}
             */
            name: 'end of block',
            tests: [{
              shift: 0,
              type: 'inline',
              children: [{
                position: -1,
                content: utils.hasDelimiters('end', options),
                type: function type(t) {
                  return t !== 'code_inline';
                }
              }]
            }],
            transform: function transform(tokens, i, j) {
              var token = tokens[i].children[j];
              var content = token.content;
              var attrs = utils.getAttrs(content, content.lastIndexOf(options.leftDelimiter), options);
              var ii = i + 1;

              while (tokens[ii + 1] && tokens[ii + 1].nesting === -1) {
                ii++;
              }

              var openingToken = utils.getMatchingOpeningToken(tokens, ii);
              utils.addAttrs(attrs, openingToken);
              var trimmed = content.slice(0, content.lastIndexOf(options.leftDelimiter));
              token.content = last(trimmed) !== ' ' ? trimmed : trimmed.slice(0, -1);
            }
          }];
        }; // get last element of array or string


        function last(arr) {
          return arr.slice(-1)[0];
        }
      }, {
        "./utils.js": 3
      }],
      3: [function (require, module, exports) {
        /**
         * parse {.class #id key=val} strings
         * @param {string} str: string to parse
         * @param {int} start: where to start parsing (including {)
         * @returns {2d array}: [['key', 'val'], ['class', 'red']]
         */

        exports.getAttrs = function (str, start, options) {
          // not tab, line feed, form feed, space, solidus, greater than sign, quotation mark, apostrophe and equals sign
          var allowedKeyChars = /[^\t\n\f />"'=]/;
          var pairSeparator = ' ';
          var keySeparator = '=';
          var classChar = '.';
          var idChar = '#';
          var attrs = [];
          var key = '';
          var value = '';
          var parsingKey = true;
          var valueInsideQuotes = false; // read inside {}
          // start + left delimiter length to avoid beginning {
          // breaks when } is found or end of string

          for (var i = start + options.leftDelimiter.length; i < str.length; i++) {
            if (str.slice(i, i + options.rightDelimiter.length) === options.rightDelimiter) {
              if (key !== '') {
                attrs.push([key, value]);
              }

              break;
            }

            var char_ = str.charAt(i); // switch to reading value if equal sign

            if (char_ === keySeparator && parsingKey) {
              parsingKey = false;
              continue;
            } // {.class} {..css-module}


            if (char_ === classChar && key === '') {
              if (str.charAt(i + 1) === classChar) {
                key = 'css-module';
                i += 1;
              } else {
                key = 'class';
              }

              parsingKey = false;
              continue;
            } // {#id}


            if (char_ === idChar && key === '') {
              key = 'id';
              parsingKey = false;
              continue;
            } // {value="inside quotes"}


            if (char_ === '"' && value === '') {
              valueInsideQuotes = true;
              continue;
            }

            if (char_ === '"' && valueInsideQuotes) {
              valueInsideQuotes = false;
              continue;
            } // read next key/value pair


            if (char_ === pairSeparator && !valueInsideQuotes) {
              if (key === '') {
                // beginning or ending space: { .red } vs {.red}
                continue;
              }

              attrs.push([key, value]);
              key = '';
              value = '';
              parsingKey = true;
              continue;
            } // continue if character not allowed


            if (parsingKey && char_.search(allowedKeyChars) === -1) {
              continue;
            } // no other conditions met; append to key/value


            if (parsingKey) {
              key += char_;
              continue;
            }

            value += char_;
          }

          if (options.allowedAttributes && options.allowedAttributes.length) {
            var allowedAttributes = options.allowedAttributes;
            return attrs.filter(function (attrPair) {
              var attr = attrPair[0];

              function isAllowedAttribute(allowedAttribute) {
                return attr === allowedAttribute || allowedAttribute instanceof RegExp && allowedAttribute.test(attr);
              }

              return allowedAttributes.some(isAllowedAttribute);
            });
          } else {
            return attrs;
          }
        };
        /**
         * add attributes from [['key', 'val']] list
         * @param {array} attrs: [['key', 'val']]
         * @param {token} token: which token to add attributes
         * @returns token
         */


        exports.addAttrs = function (attrs, token) {
          for (var j = 0, l = attrs.length; j < l; ++j) {
            var key = attrs[j][0];

            if (key === 'class') {
              token.attrJoin('class', attrs[j][1]);
            } else if (key === 'css-module') {
              token.attrJoin('css-module', attrs[j][1]);
            } else {
              token.attrPush(attrs[j]);
            }
          }

          return token;
        };
        /**
         * Does string have properly formatted curly?
         *
         * start: '{.a} asdf'
         * middle: 'a{.b}c'
         * end: 'asdf {.a}'
         * only: '{.a}'
         *
         * @param {string} where to expect {} curly. start, middle, end or only.
         * @return {function(string)} Function which testes if string has curly.
         */


        exports.hasDelimiters = function (where, options) {
          if (!where) {
            throw new Error('Parameter `where` not passed. Should be "start", "middle", "end" or "only".');
          }
          /**
           * @param {string} str
           * @return {boolean}
           */


          return function (str) {
            // we need minimum three chars, for example {b}
            var minCurlyLength = options.leftDelimiter.length + 1 + options.rightDelimiter.length;

            if (!str || typeof str !== 'string' || str.length < minCurlyLength) {
              return false;
            }

            function validCurlyLength(curly) {
              var isClass = curly.charAt(options.leftDelimiter.length) === '.';
              var isId = curly.charAt(options.leftDelimiter.length) === '#';
              return isClass || isId ? curly.length >= minCurlyLength + 1 : curly.length >= minCurlyLength;
            }

            var start, end, slice, nextChar;
            var rightDelimiterMinimumShift = minCurlyLength - options.rightDelimiter.length;

            switch (where) {
              case 'start':
                // first char should be {, } found in char 2 or more
                slice = str.slice(0, options.leftDelimiter.length);
                start = slice === options.leftDelimiter ? 0 : -1;
                end = start === -1 ? -1 : str.indexOf(options.rightDelimiter, rightDelimiterMinimumShift); // check if next character is not one of the delimiters

                nextChar = str.charAt(end + options.rightDelimiter.length);

                if (nextChar && options.rightDelimiter.indexOf(nextChar) !== -1) {
                  end = -1;
                }

                break;

              case 'end':
                // last char should be }
                start = str.lastIndexOf(options.leftDelimiter);
                end = start === -1 ? -1 : str.indexOf(options.rightDelimiter, start + rightDelimiterMinimumShift);
                end = end === str.length - options.rightDelimiter.length ? end : -1;
                break;

              case 'only':
                // '{.a}'
                slice = str.slice(0, options.leftDelimiter.length);
                start = slice === options.leftDelimiter ? 0 : -1;
                slice = str.slice(str.length - options.rightDelimiter.length);
                end = slice === options.rightDelimiter ? str.length - options.rightDelimiter.length : -1;
                break;
            }

            return start !== -1 && end !== -1 && validCurlyLength(str.substring(start, end + options.rightDelimiter.length));
          };
        };
        /**
         * Removes last curly from string.
         */


        exports.removeDelimiter = function (str, options) {
          var start = escapeRegExp(options.leftDelimiter);
          var end = escapeRegExp(options.rightDelimiter);
          var curly = new RegExp('[ \\n]?' + start + '[^' + start + end + ']+' + end + '$');
          var pos = str.search(curly);
          return pos !== -1 ? str.slice(0, pos) : str;
        };
        /**
         * Escapes special characters in string s such that the string
         * can be used in `new RegExp`. For example "[" becomes "\\[".
         *
         * @param {string} s Regex string.
         * @return {string} Escaped string.
         */


        function escapeRegExp(s) {
          return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

        exports.escapeRegExp = escapeRegExp;
        /**
         * find corresponding opening block
         */

        exports.getMatchingOpeningToken = function (tokens, i) {
          if (tokens[i].type === 'softbreak') {
            return false;
          } // non closing blocks, example img


          if (tokens[i].nesting === 0) {
            return tokens[i];
          }

          var level = tokens[i].level;
          var type = tokens[i].type.replace('_close', '_open');

          for (; i >= 0; --i) {
            if (tokens[i].type === type && tokens[i].level === level) {
              return tokens[i];
            }
          }
        };
        /**
         * from https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js
         */


        var HTML_ESCAPE_TEST_RE = /[&<>"]/;
        var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
        var HTML_REPLACEMENTS = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        };

        function replaceUnsafeChar(ch) {
          return HTML_REPLACEMENTS[ch];
        }

        exports.escapeHtml = function (str) {
          if (HTML_ESCAPE_TEST_RE.test(str)) {
            return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
          }

          return str;
        };
      }, {}]
    }, {}, [1])(1);
  });

  /*! @license DOMPurify 2.4.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.4.0/LICENSE */
  (function (global, factory) {
    (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DOMPurify = factory());
  })(undefined, function () {

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var hasOwnProperty = Object.hasOwnProperty,
        setPrototypeOf = Object.setPrototypeOf,
        isFrozen = Object.isFrozen,
        getPrototypeOf = Object.getPrototypeOf,
        getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var freeze = Object.freeze,
        seal = Object.seal,
        create = Object.create; // eslint-disable-line import/no-mutable-exports

    var _ref = typeof Reflect !== 'undefined' && Reflect,
        apply = _ref.apply,
        construct = _ref.construct;

    if (!apply) {
      apply = function apply(fun, thisValue, args) {
        return fun.apply(thisValue, args);
      };
    }

    if (!freeze) {
      freeze = function freeze(x) {
        return x;
      };
    }

    if (!seal) {
      seal = function seal(x) {
        return x;
      };
    }

    if (!construct) {
      construct = function construct(Func, args) {
        return _construct(Func, _toConsumableArray(args));
      };
    }

    var arrayForEach = unapply(Array.prototype.forEach);
    var arrayPop = unapply(Array.prototype.pop);
    var arrayPush = unapply(Array.prototype.push);
    var stringToLowerCase = unapply(String.prototype.toLowerCase);
    var stringMatch = unapply(String.prototype.match);
    var stringReplace = unapply(String.prototype.replace);
    var stringIndexOf = unapply(String.prototype.indexOf);
    var stringTrim = unapply(String.prototype.trim);
    var regExpTest = unapply(RegExp.prototype.test);
    var typeErrorCreate = unconstruct(TypeError);

    function unapply(func) {
      return function (thisArg) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return apply(func, thisArg, args);
      };
    }

    function unconstruct(func) {
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return construct(func, args);
      };
    }
    /* Add properties to a lookup table */


    function addToSet(set, array, transformCaseFunc) {
      transformCaseFunc = transformCaseFunc ? transformCaseFunc : stringToLowerCase;

      if (setPrototypeOf) {
        // Make 'in' and truthy checks like Boolean(set.constructor)
        // independent of any properties defined on Object.prototype.
        // Prevent prototype setters from intercepting set as a this value.
        setPrototypeOf(set, null);
      }

      var l = array.length;

      while (l--) {
        var element = array[l];

        if (typeof element === 'string') {
          var lcElement = transformCaseFunc(element);

          if (lcElement !== element) {
            // Config presets (e.g. tags.js, attrs.js) are immutable.
            if (!isFrozen(array)) {
              array[l] = lcElement;
            }

            element = lcElement;
          }
        }

        set[element] = true;
      }

      return set;
    }
    /* Shallow clone an object */


    function clone(object) {
      var newObject = create(null);
      var property;

      for (property in object) {
        if (apply(hasOwnProperty, object, [property])) {
          newObject[property] = object[property];
        }
      }

      return newObject;
    }
    /* IE10 doesn't support __lookupGetter__ so lets'
     * simulate it. It also automatically checks
     * if the prop is function or getter and behaves
     * accordingly. */


    function lookupGetter(object, prop) {
      while (object !== null) {
        var desc = getOwnPropertyDescriptor(object, prop);

        if (desc) {
          if (desc.get) {
            return unapply(desc.get);
          }

          if (typeof desc.value === 'function') {
            return unapply(desc.value);
          }
        }

        object = getPrototypeOf(object);
      }

      function fallbackValue(element) {
        console.warn('fallback value for', element);
        return null;
      }

      return fallbackValue;
    }

    var html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']); // SVG

    var svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
    var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']); // List of SVG elements that are disallowed by default.
    // We still need to know them so that we can do namespace
    // checks properly in case one wants to add them to
    // allow-list.

    var svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'fedropshadow', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
    var mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']); // Similarly to SVG, we want to know all MathML elements,
    // even those that we disallow by default.

    var mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
    var text = freeze(['#text']);
    var html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns', 'slot']);
    var svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
    var mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
    var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);
    var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode

    var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
    var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape

    var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape

    var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
    );
    var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
    var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
    );
    var DOCTYPE_NAME = seal(/^html$/i);

    var getGlobal = function getGlobal() {
      return typeof window === 'undefined' ? null : window;
    };
    /**
     * Creates a no-op policy for internal use only.
     * Don't export this function outside this module!
     * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
     * @param {Document} document The document object (to determine policy name suffix)
     * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
     * are not supported).
     */


    var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
      if (_typeof(trustedTypes) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
        return null;
      } // Allow the callers to control the unique policy name
      // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
      // Policy creation with duplicate names throws in Trusted Types.


      var suffix = null;
      var ATTR_NAME = 'data-tt-policy-suffix';

      if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
        suffix = document.currentScript.getAttribute(ATTR_NAME);
      }

      var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

      try {
        return trustedTypes.createPolicy(policyName, {
          createHTML: function createHTML(html) {
            return html;
          },
          createScriptURL: function createScriptURL(scriptUrl) {
            return scriptUrl;
          }
        });
      } catch (_) {
        // Policy creation failed (most likely another DOMPurify script has
        // already run). Skip creating the policy, as this will only cause errors
        // if TT are enforced.
        console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
        return null;
      }
    };

    function createDOMPurify() {
      var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

      var DOMPurify = function DOMPurify(root) {
        return createDOMPurify(root);
      };
      /**
       * Version label, exposed for easier checks
       * if DOMPurify is up to date or not
       */


      DOMPurify.version = '2.4.0';
      /**
       * Array of elements that DOMPurify removed during sanitation.
       * Empty if nothing was removed.
       */

      DOMPurify.removed = [];

      if (!window || !window.document || window.document.nodeType !== 9) {
        // Not running in a browser, provide a factory function
        // so that you can pass your own Window
        DOMPurify.isSupported = false;
        return DOMPurify;
      }

      var originalDocument = window.document;
      var document = window.document;
      var DocumentFragment = window.DocumentFragment,
          HTMLTemplateElement = window.HTMLTemplateElement,
          Node = window.Node,
          Element = window.Element,
          NodeFilter = window.NodeFilter,
          _window$NamedNodeMap = window.NamedNodeMap,
          NamedNodeMap = _window$NamedNodeMap === void 0 ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
          HTMLFormElement = window.HTMLFormElement,
          DOMParser = window.DOMParser,
          trustedTypes = window.trustedTypes;
      var ElementPrototype = Element.prototype;
      var cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
      var getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
      var getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
      var getParentNode = lookupGetter(ElementPrototype, 'parentNode'); // As per issue #47, the web-components registry is inherited by a
      // new document created via createHTMLDocument. As per the spec
      // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
      // a new empty registry is used when creating a template contents owner
      // document, so we use that as our parent document to ensure nothing
      // is inherited.

      if (typeof HTMLTemplateElement === 'function') {
        var template = document.createElement('template');

        if (template.content && template.content.ownerDocument) {
          document = template.content.ownerDocument;
        }
      }

      var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);

      var emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML('') : '';
      var _document = document,
          implementation = _document.implementation,
          createNodeIterator = _document.createNodeIterator,
          createDocumentFragment = _document.createDocumentFragment,
          getElementsByTagName = _document.getElementsByTagName;
      var importNode = originalDocument.importNode;
      var documentMode = {};

      try {
        documentMode = clone(document).documentMode ? document.documentMode : {};
      } catch (_) {}

      var hooks = {};
      /**
       * Expose whether this browser supports running the full DOMPurify.
       */

      DOMPurify.isSupported = typeof getParentNode === 'function' && implementation && typeof implementation.createHTMLDocument !== 'undefined' && documentMode !== 9;
      var MUSTACHE_EXPR$1 = MUSTACHE_EXPR,
          ERB_EXPR$1 = ERB_EXPR,
          DATA_ATTR$1 = DATA_ATTR,
          ARIA_ATTR$1 = ARIA_ATTR,
          IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA,
          ATTR_WHITESPACE$1 = ATTR_WHITESPACE;
      var IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
      /**
       * We consider the elements and attributes below to be safe. Ideally
       * don't add any new ones but feel free to remove unwanted ones.
       */

      /* allowed element names */

      var ALLOWED_TAGS = null;
      var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray(html$1), _toConsumableArray(svg$1), _toConsumableArray(svgFilters), _toConsumableArray(mathMl$1), _toConsumableArray(text)));
      /* Allowed attribute names */

      var ALLOWED_ATTR = null;
      var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray(html), _toConsumableArray(svg), _toConsumableArray(mathMl), _toConsumableArray(xml)));
      /*
       * Configure how DOMPUrify should handle custom elements and their attributes as well as customized built-in elements.
       * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
       * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
       * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
       */

      var CUSTOM_ELEMENT_HANDLING = Object.seal(Object.create(null, {
        tagNameCheck: {
          writable: true,
          configurable: false,
          enumerable: true,
          value: null
        },
        attributeNameCheck: {
          writable: true,
          configurable: false,
          enumerable: true,
          value: null
        },
        allowCustomizedBuiltInElements: {
          writable: true,
          configurable: false,
          enumerable: true,
          value: false
        }
      }));
      /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */

      var FORBID_TAGS = null;
      /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */

      var FORBID_ATTR = null;
      /* Decide if ARIA attributes are okay */

      var ALLOW_ARIA_ATTR = true;
      /* Decide if custom data attributes are okay */

      var ALLOW_DATA_ATTR = true;
      /* Decide if unknown protocols are okay */

      var ALLOW_UNKNOWN_PROTOCOLS = false;
      /* Output should be safe for common template engines.
       * This means, DOMPurify removes data attributes, mustaches and ERB
       */

      var SAFE_FOR_TEMPLATES = false;
      /* Decide if document with <html>... should be returned */

      var WHOLE_DOCUMENT = false;
      /* Track whether config is already set on this instance of DOMPurify. */

      var SET_CONFIG = false;
      /* Decide if all elements (e.g. style, script) must be children of
       * document.body. By default, browsers might move them to document.head */

      var FORCE_BODY = false;
      /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
       * string (or a TrustedHTML object if Trusted Types are supported).
       * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
       */

      var RETURN_DOM = false;
      /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
       * string  (or a TrustedHTML object if Trusted Types are supported) */

      var RETURN_DOM_FRAGMENT = false;
      /* Try to return a Trusted Type object instead of a string, return a string in
       * case Trusted Types are not supported  */

      var RETURN_TRUSTED_TYPE = false;
      /* Output should be free from DOM clobbering attacks?
       * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
       */

      var SANITIZE_DOM = true;
      /* Achieve full DOM Clobbering protection by isolating the namespace of named
       * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
       *
       * HTML/DOM spec rules that enable DOM Clobbering:
       *   - Named Access on Window (§7.3.3)
       *   - DOM Tree Accessors (§3.1.5)
       *   - Form Element Parent-Child Relations (§4.10.3)
       *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
       *   - HTMLCollection (§4.2.10.2)
       *
       * Namespace isolation is implemented by prefixing `id` and `name` attributes
       * with a constant string, i.e., `user-content-`
       */

      var SANITIZE_NAMED_PROPS = false;
      var SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
      /* Keep element content when removing element? */

      var KEEP_CONTENT = true;
      /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
       * of importing it into a new Document and returning a sanitized copy */

      var IN_PLACE = false;
      /* Allow usage of profiles like html, svg and mathMl */

      var USE_PROFILES = {};
      /* Tags to ignore content of when KEEP_CONTENT is true */

      var FORBID_CONTENTS = null;
      var DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
      /* Tags that are safe for data: URIs */

      var DATA_URI_TAGS = null;
      var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
      /* Attributes safe for values like "javascript:" */

      var URI_SAFE_ATTRIBUTES = null;
      var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
      var MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
      var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
      var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
      /* Document namespace */

      var NAMESPACE = HTML_NAMESPACE;
      var IS_EMPTY_INPUT = false;
      /* Parsing of strict XHTML documents */

      var PARSER_MEDIA_TYPE;
      var SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
      var DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
      var transformCaseFunc;
      /* Keep a reference to config to pass to hooks */

      var CONFIG = null;
      /* Ideally, do not touch anything below this line */

      /* ______________________________________________ */

      var formElement = document.createElement('form');

      var isRegexOrFunction = function isRegexOrFunction(testValue) {
        return testValue instanceof RegExp || testValue instanceof Function;
      };
      /**
       * _parseConfig
       *
       * @param  {Object} cfg optional config literal
       */
      // eslint-disable-next-line complexity


      var _parseConfig = function _parseConfig(cfg) {
        if (CONFIG && CONFIG === cfg) {
          return;
        }
        /* Shield configuration object from tampering */


        if (!cfg || _typeof(cfg) !== 'object') {
          cfg = {};
        }
        /* Shield configuration object from prototype pollution */


        cfg = clone(cfg);
        PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
        SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE; // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.

        transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? function (x) {
          return x;
        } : stringToLowerCase;
        /* Set configuration parameters */

        ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
        ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
        URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), // eslint-disable-line indent
        cfg.ADD_URI_SAFE_ATTR, // eslint-disable-line indent
        transformCaseFunc // eslint-disable-line indent
        ) // eslint-disable-line indent
        : DEFAULT_URI_SAFE_ATTRIBUTES;
        DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), // eslint-disable-line indent
        cfg.ADD_DATA_URI_TAGS, // eslint-disable-line indent
        transformCaseFunc // eslint-disable-line indent
        ) // eslint-disable-line indent
        : DEFAULT_DATA_URI_TAGS;
        FORBID_CONTENTS = 'FORBID_CONTENTS' in cfg ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
        FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
        FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
        USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
        ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true

        ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true

        ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false

        SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false

        WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false

        RETURN_DOM = cfg.RETURN_DOM || false; // Default false

        RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false

        RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false

        FORCE_BODY = cfg.FORCE_BODY || false; // Default false

        SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true

        SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false

        KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true

        IN_PLACE = cfg.IN_PLACE || false; // Default false

        IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$1;
        NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;

        if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
          CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
        }

        if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
          CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
        }

        if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
          CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
        }

        if (SAFE_FOR_TEMPLATES) {
          ALLOW_DATA_ATTR = false;
        }

        if (RETURN_DOM_FRAGMENT) {
          RETURN_DOM = true;
        }
        /* Parse profile info */


        if (USE_PROFILES) {
          ALLOWED_TAGS = addToSet({}, _toConsumableArray(text));
          ALLOWED_ATTR = [];

          if (USE_PROFILES.html === true) {
            addToSet(ALLOWED_TAGS, html$1);
            addToSet(ALLOWED_ATTR, html);
          }

          if (USE_PROFILES.svg === true) {
            addToSet(ALLOWED_TAGS, svg$1);
            addToSet(ALLOWED_ATTR, svg);
            addToSet(ALLOWED_ATTR, xml);
          }

          if (USE_PROFILES.svgFilters === true) {
            addToSet(ALLOWED_TAGS, svgFilters);
            addToSet(ALLOWED_ATTR, svg);
            addToSet(ALLOWED_ATTR, xml);
          }

          if (USE_PROFILES.mathMl === true) {
            addToSet(ALLOWED_TAGS, mathMl$1);
            addToSet(ALLOWED_ATTR, mathMl);
            addToSet(ALLOWED_ATTR, xml);
          }
        }
        /* Merge configuration parameters */


        if (cfg.ADD_TAGS) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone(ALLOWED_TAGS);
          }

          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }

        if (cfg.ADD_ATTR) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone(ALLOWED_ATTR);
          }

          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }

        if (cfg.ADD_URI_SAFE_ATTR) {
          addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
        }

        if (cfg.FORBID_CONTENTS) {
          if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
            FORBID_CONTENTS = clone(FORBID_CONTENTS);
          }

          addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
        }
        /* Add #text in case KEEP_CONTENT is set to true */


        if (KEEP_CONTENT) {
          ALLOWED_TAGS['#text'] = true;
        }
        /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */


        if (WHOLE_DOCUMENT) {
          addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
        }
        /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */


        if (ALLOWED_TAGS.table) {
          addToSet(ALLOWED_TAGS, ['tbody']);
          delete FORBID_TAGS.tbody;
        } // Prevent further manipulation of configuration.
        // Not available in IE8, Safari 5, etc.


        if (freeze) {
          freeze(cfg);
        }

        CONFIG = cfg;
      };

      var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
      var HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']); // Certain elements are allowed in both SVG and HTML
      // namespace. We need to specify them explicitly
      // so that they don't get erroneously deleted from
      // HTML namespace.

      var COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
      /* Keep track of all possible SVG and MathML tags
       * so that we can perform the namespace checks
       * correctly. */

      var ALL_SVG_TAGS = addToSet({}, svg$1);
      addToSet(ALL_SVG_TAGS, svgFilters);
      addToSet(ALL_SVG_TAGS, svgDisallowed);
      var ALL_MATHML_TAGS = addToSet({}, mathMl$1);
      addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
      /**
       *
       *
       * @param  {Element} element a DOM element whose namespace is being checked
       * @returns {boolean} Return false if the element has a
       *  namespace that a spec-compliant parser would never
       *  return. Return true otherwise.
       */

      var _checkValidNamespace = function _checkValidNamespace(element) {
        var parent = getParentNode(element); // In JSDOM, if we're inside shadow DOM, then parentNode
        // can be null. We just simulate parent in this case.

        if (!parent || !parent.tagName) {
          parent = {
            namespaceURI: HTML_NAMESPACE,
            tagName: 'template'
          };
        }

        var tagName = stringToLowerCase(element.tagName);
        var parentTagName = stringToLowerCase(parent.tagName);

        if (element.namespaceURI === SVG_NAMESPACE) {
          // The only way to switch from HTML namespace to SVG
          // is via <svg>. If it happens via any other tag, then
          // it should be killed.
          if (parent.namespaceURI === HTML_NAMESPACE) {
            return tagName === 'svg';
          } // The only way to switch from MathML to SVG is via
          // svg if parent is either <annotation-xml> or MathML
          // text integration points.


          if (parent.namespaceURI === MATHML_NAMESPACE) {
            return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
          } // We only allow elements that are defined in SVG
          // spec. All others are disallowed in SVG namespace.


          return Boolean(ALL_SVG_TAGS[tagName]);
        }

        if (element.namespaceURI === MATHML_NAMESPACE) {
          // The only way to switch from HTML namespace to MathML
          // is via <math>. If it happens via any other tag, then
          // it should be killed.
          if (parent.namespaceURI === HTML_NAMESPACE) {
            return tagName === 'math';
          } // The only way to switch from SVG to MathML is via
          // <math> and HTML integration points


          if (parent.namespaceURI === SVG_NAMESPACE) {
            return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
          } // We only allow elements that are defined in MathML
          // spec. All others are disallowed in MathML namespace.


          return Boolean(ALL_MATHML_TAGS[tagName]);
        }

        if (element.namespaceURI === HTML_NAMESPACE) {
          // The only way to switch from SVG to HTML is via
          // HTML integration points, and from MathML to HTML
          // is via MathML text integration points
          if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
            return false;
          }

          if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
            return false;
          } // We disallow tags that are specific for MathML
          // or SVG and should never appear in HTML namespace


          return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
        } // The code should never reach this place (this means
        // that the element somehow got namespace that is not
        // HTML, SVG or MathML). Return false just in case.


        return false;
      };
      /**
       * _forceRemove
       *
       * @param  {Node} node a DOM node
       */


      var _forceRemove = function _forceRemove(node) {
        arrayPush(DOMPurify.removed, {
          element: node
        });

        try {
          // eslint-disable-next-line unicorn/prefer-dom-node-remove
          node.parentNode.removeChild(node);
        } catch (_) {
          try {
            node.outerHTML = emptyHTML;
          } catch (_) {
            node.remove();
          }
        }
      };
      /**
       * _removeAttribute
       *
       * @param  {String} name an Attribute name
       * @param  {Node} node a DOM node
       */


      var _removeAttribute = function _removeAttribute(name, node) {
        try {
          arrayPush(DOMPurify.removed, {
            attribute: node.getAttributeNode(name),
            from: node
          });
        } catch (_) {
          arrayPush(DOMPurify.removed, {
            attribute: null,
            from: node
          });
        }

        node.removeAttribute(name); // We void attribute values for unremovable "is"" attributes

        if (name === 'is' && !ALLOWED_ATTR[name]) {
          if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
            try {
              _forceRemove(node);
            } catch (_) {}
          } else {
            try {
              node.setAttribute(name, '');
            } catch (_) {}
          }
        }
      };
      /**
       * _initDocument
       *
       * @param  {String} dirty a string of dirty markup
       * @return {Document} a DOM, filled with the dirty markup
       */


      var _initDocument = function _initDocument(dirty) {
        /* Create a HTML document */
        var doc;
        var leadingWhitespace;

        if (FORCE_BODY) {
          dirty = '<remove></remove>' + dirty;
        } else {
          /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
          var matches = stringMatch(dirty, /^[\r\n\t ]+/);
          leadingWhitespace = matches && matches[0];
        }

        if (PARSER_MEDIA_TYPE === 'application/xhtml+xml') {
          // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
          dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
        }

        var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
        /*
         * Use the DOMParser API by default, fallback later if needs be
         * DOMParser not work for svg when has multiple root element.
         */

        if (NAMESPACE === HTML_NAMESPACE) {
          try {
            doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
          } catch (_) {}
        }
        /* Use createHTMLDocument in case DOMParser is not available */


        if (!doc || !doc.documentElement) {
          doc = implementation.createDocument(NAMESPACE, 'template', null);

          try {
            doc.documentElement.innerHTML = IS_EMPTY_INPUT ? '' : dirtyPayload;
          } catch (_) {// Syntax error if dirtyPayload is invalid xml
          }
        }

        var body = doc.body || doc.documentElement;

        if (dirty && leadingWhitespace) {
          body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
        }
        /* Work on whole document or just its body */


        if (NAMESPACE === HTML_NAMESPACE) {
          return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
        }

        return WHOLE_DOCUMENT ? doc.documentElement : body;
      };
      /**
       * _createIterator
       *
       * @param  {Document} root document/fragment to create iterator for
       * @return {Iterator} iterator instance
       */


      var _createIterator = function _createIterator(root) {
        return createNodeIterator.call(root.ownerDocument || root, root, // eslint-disable-next-line no-bitwise
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, null, false);
      };
      /**
       * _isClobbered
       *
       * @param  {Node} elm element to check for clobbering attacks
       * @return {Boolean} true if clobbered, false if safe
       */


      var _isClobbered = function _isClobbered(elm) {
        return elm instanceof HTMLFormElement && (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function');
      };
      /**
       * _isNode
       *
       * @param  {Node} obj object to check whether it's a DOM node
       * @return {Boolean} true is object is a DOM node
       */


      var _isNode = function _isNode(object) {
        return _typeof(Node) === 'object' ? object instanceof Node : object && _typeof(object) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
      };
      /**
       * _executeHook
       * Execute user configurable hooks
       *
       * @param  {String} entryPoint  Name of the hook's entry point
       * @param  {Node} currentNode node to work on with the hook
       * @param  {Object} data additional hook parameters
       */


      var _executeHook = function _executeHook(entryPoint, currentNode, data) {
        if (!hooks[entryPoint]) {
          return;
        }

        arrayForEach(hooks[entryPoint], function (hook) {
          hook.call(DOMPurify, currentNode, data, CONFIG);
        });
      };
      /**
       * _sanitizeElements
       *
       * @protect nodeName
       * @protect textContent
       * @protect removeChild
       *
       * @param   {Node} currentNode to check for permission to exist
       * @return  {Boolean} true if node was killed, false if left alive
       */


      var _sanitizeElements = function _sanitizeElements(currentNode) {
        var content;
        /* Execute a hook if present */

        _executeHook('beforeSanitizeElements', currentNode, null);
        /* Check if element is clobbered or can clobber */


        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);

          return true;
        }
        /* Check if tagname contains Unicode */


        if (regExpTest(/[\u0080-\uFFFF]/, currentNode.nodeName)) {
          _forceRemove(currentNode);

          return true;
        }
        /* Now let's check the element's type and name */


        var tagName = transformCaseFunc(currentNode.nodeName);
        /* Execute a hook if present */

        _executeHook('uponSanitizeElement', currentNode, {
          tagName: tagName,
          allowedTags: ALLOWED_TAGS
        });
        /* Detect mXSS attempts abusing namespace confusion */


        if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
          _forceRemove(currentNode);

          return true;
        }
        /* Mitigate a problem with templates inside select */


        if (tagName === 'select' && regExpTest(/<template/i, currentNode.innerHTML)) {
          _forceRemove(currentNode);

          return true;
        }
        /* Remove element if anything forbids its presence */


        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          /* Check if we have a custom element to handle */
          if (!FORBID_TAGS[tagName] && _basicCustomElementTest(tagName)) {
            if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
            if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
          }
          /* Keep content except for bad-listed elements */


          if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
            var parentNode = getParentNode(currentNode) || currentNode.parentNode;
            var childNodes = getChildNodes(currentNode) || currentNode.childNodes;

            if (childNodes && parentNode) {
              var childCount = childNodes.length;

              for (var i = childCount - 1; i >= 0; --i) {
                parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
              }
            }
          }

          _forceRemove(currentNode);

          return true;
        }
        /* Check whether element has a valid namespace */


        if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
          _forceRemove(currentNode);

          return true;
        }

        if ((tagName === 'noscript' || tagName === 'noembed') && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
          _forceRemove(currentNode);

          return true;
        }
        /* Sanitize element content to be template-safe */


        if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
          /* Get the element's text content */
          content = currentNode.textContent;
          content = stringReplace(content, MUSTACHE_EXPR$1, ' ');
          content = stringReplace(content, ERB_EXPR$1, ' ');

          if (currentNode.textContent !== content) {
            arrayPush(DOMPurify.removed, {
              element: currentNode.cloneNode()
            });
            currentNode.textContent = content;
          }
        }
        /* Execute a hook if present */


        _executeHook('afterSanitizeElements', currentNode, null);

        return false;
      };
      /**
       * _isValidAttribute
       *
       * @param  {string} lcTag Lowercase tag name of containing element.
       * @param  {string} lcName Lowercase attribute name.
       * @param  {string} value Attribute value.
       * @return {Boolean} Returns true if `value` is valid, otherwise false.
       */
      // eslint-disable-next-line complexity


      var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
        /* Make sure attribute cannot clobber */
        if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
          return false;
        }
        /* Allow valid data-* attributes: At least one character after "-"
            (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
            XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
            We don't need to check the value; it's always URI safe. */


        if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$1, lcName)) ;else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ;else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
          if ( // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          _basicCustomElementTest(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ;else {
            return false;
          }
          /* Check value is safe. First, is attr inert? If so, is safe */
        } else if (URI_SAFE_ATTRIBUTES[lcName]) ;else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ''))) ;else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ;else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ''))) ;else if (!value) ;else {
          return false;
        }
        return true;
      };
      /**
       * _basicCustomElementCheck
       * checks if at least one dash is included in tagName, and it's not the first char
       * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
       * @param {string} tagName name of the tag of the node to sanitize
       */


      var _basicCustomElementTest = function _basicCustomElementTest(tagName) {
        return tagName.indexOf('-') > 0;
      };
      /**
       * _sanitizeAttributes
       *
       * @protect attributes
       * @protect nodeName
       * @protect removeAttribute
       * @protect setAttribute
       *
       * @param  {Node} currentNode to sanitize
       */


      var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
        var attr;
        var value;
        var lcName;
        var l;
        /* Execute a hook if present */

        _executeHook('beforeSanitizeAttributes', currentNode, null);

        var attributes = currentNode.attributes;
        /* Check if we have attributes; if not we might have a text node */

        if (!attributes) {
          return;
        }

        var hookEvent = {
          attrName: '',
          attrValue: '',
          keepAttr: true,
          allowedAttributes: ALLOWED_ATTR
        };
        l = attributes.length;
        /* Go backwards over all attributes; safely remove bad ones */

        while (l--) {
          attr = attributes[l];
          var _attr = attr,
              name = _attr.name,
              namespaceURI = _attr.namespaceURI;
          value = name === 'value' ? attr.value : stringTrim(attr.value);
          lcName = transformCaseFunc(name);
          /* Execute a hook if present */

          hookEvent.attrName = lcName;
          hookEvent.attrValue = value;
          hookEvent.keepAttr = true;
          hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set

          _executeHook('uponSanitizeAttribute', currentNode, hookEvent);

          value = hookEvent.attrValue;
          /* Did the hooks approve of the attribute? */

          if (hookEvent.forceKeepAttr) {
            continue;
          }
          /* Remove attribute */


          _removeAttribute(name, currentNode);
          /* Did the hooks approve of the attribute? */


          if (!hookEvent.keepAttr) {
            continue;
          }
          /* Work around a security issue in jQuery 3.0 */


          if (regExpTest(/\/>/i, value)) {
            _removeAttribute(name, currentNode);

            continue;
          }
          /* Sanitize attribute content to be template-safe */


          if (SAFE_FOR_TEMPLATES) {
            value = stringReplace(value, MUSTACHE_EXPR$1, ' ');
            value = stringReplace(value, ERB_EXPR$1, ' ');
          }
          /* Is `value` valid for this attribute? */


          var lcTag = transformCaseFunc(currentNode.nodeName);

          if (!_isValidAttribute(lcTag, lcName, value)) {
            continue;
          }
          /* Full DOM Clobbering protection via namespace isolation,
           * Prefix id and name attributes with `user-content-`
           */


          if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
            // Remove the attribute with this value
            _removeAttribute(name, currentNode); // Prefix the value and later re-create the attribute with the sanitized value


            value = SANITIZE_NAMED_PROPS_PREFIX + value;
          }
          /* Handle attributes that require Trusted Types */


          if (trustedTypesPolicy && _typeof(trustedTypes) === 'object' && typeof trustedTypes.getAttributeType === 'function') {
            if (namespaceURI) ;else {
              switch (trustedTypes.getAttributeType(lcTag, lcName)) {
                case 'TrustedHTML':
                  value = trustedTypesPolicy.createHTML(value);
                  break;

                case 'TrustedScriptURL':
                  value = trustedTypesPolicy.createScriptURL(value);
                  break;
              }
            }
          }
          /* Handle invalid data-* attribute set by try-catching it */


          try {
            if (namespaceURI) {
              currentNode.setAttributeNS(namespaceURI, name, value);
            } else {
              /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
              currentNode.setAttribute(name, value);
            }

            arrayPop(DOMPurify.removed);
          } catch (_) {}
        }
        /* Execute a hook if present */


        _executeHook('afterSanitizeAttributes', currentNode, null);
      };
      /**
       * _sanitizeShadowDOM
       *
       * @param  {DocumentFragment} fragment to iterate over recursively
       */


      var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
        var shadowNode;

        var shadowIterator = _createIterator(fragment);
        /* Execute a hook if present */


        _executeHook('beforeSanitizeShadowDOM', fragment, null);

        while (shadowNode = shadowIterator.nextNode()) {
          /* Execute a hook if present */
          _executeHook('uponSanitizeShadowNode', shadowNode, null);
          /* Sanitize tags and elements */


          if (_sanitizeElements(shadowNode)) {
            continue;
          }
          /* Deep shadow DOM detected */


          if (shadowNode.content instanceof DocumentFragment) {
            _sanitizeShadowDOM(shadowNode.content);
          }
          /* Check attributes, sanitize if necessary */


          _sanitizeAttributes(shadowNode);
        }
        /* Execute a hook if present */


        _executeHook('afterSanitizeShadowDOM', fragment, null);
      };
      /**
       * Sanitize
       * Public method providing core sanitation functionality
       *
       * @param {String|Node} dirty string or DOM node
       * @param {Object} configuration object
       */
      // eslint-disable-next-line complexity


      DOMPurify.sanitize = function (dirty) {
        var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var body;
        var importedNode;
        var currentNode;
        var oldNode;
        var returnNode;
        /* Make sure we have a string to sanitize.
          DO NOT return early, as this will return the wrong type if
          the user has requested a DOM object rather than a string */

        IS_EMPTY_INPUT = !dirty;

        if (IS_EMPTY_INPUT) {
          dirty = '<!-->';
        }
        /* Stringify, in case dirty is an object */


        if (typeof dirty !== 'string' && !_isNode(dirty)) {
          // eslint-disable-next-line no-negated-condition
          if (typeof dirty.toString !== 'function') {
            throw typeErrorCreate('toString is not a function');
          } else {
            dirty = dirty.toString();

            if (typeof dirty !== 'string') {
              throw typeErrorCreate('dirty is not a string, aborting');
            }
          }
        }
        /* Check we can run. Otherwise fall back or ignore */


        if (!DOMPurify.isSupported) {
          if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
            if (typeof dirty === 'string') {
              return window.toStaticHTML(dirty);
            }

            if (_isNode(dirty)) {
              return window.toStaticHTML(dirty.outerHTML);
            }
          }

          return dirty;
        }
        /* Assign config vars */


        if (!SET_CONFIG) {
          _parseConfig(cfg);
        }
        /* Clean up removed elements */


        DOMPurify.removed = [];
        /* Check if dirty is correctly typed for IN_PLACE */

        if (typeof dirty === 'string') {
          IN_PLACE = false;
        }

        if (IN_PLACE) {
          /* Do some early pre-sanitization to avoid unsafe root nodes */
          if (dirty.nodeName) {
            var tagName = transformCaseFunc(dirty.nodeName);

            if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
              throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
            }
          }
        } else if (dirty instanceof Node) {
          /* If dirty is a DOM element, append to an empty document to avoid
             elements being stripped by the parser */
          body = _initDocument('<!---->');
          importedNode = body.ownerDocument.importNode(dirty, true);

          if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
            /* Node is already a body, use as is */
            body = importedNode;
          } else if (importedNode.nodeName === 'HTML') {
            body = importedNode;
          } else {
            // eslint-disable-next-line unicorn/prefer-dom-node-append
            body.appendChild(importedNode);
          }
        } else {
          /* Exit directly if we have nothing to do */
          if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
          dirty.indexOf('<') === -1) {
            return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
          }
          /* Initialize the document to work on */


          body = _initDocument(dirty);
          /* Check we have a DOM node from the data */

          if (!body) {
            return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
          }
        }
        /* Remove first element node (ours) if FORCE_BODY is set */


        if (body && FORCE_BODY) {
          _forceRemove(body.firstChild);
        }
        /* Get node iterator */


        var nodeIterator = _createIterator(IN_PLACE ? dirty : body);
        /* Now start iterating over the created document */


        while (currentNode = nodeIterator.nextNode()) {
          /* Fix IE's strange behavior with manipulated textNodes #89 */
          if (currentNode.nodeType === 3 && currentNode === oldNode) {
            continue;
          }
          /* Sanitize tags and elements */


          if (_sanitizeElements(currentNode)) {
            continue;
          }
          /* Shadow DOM detected, sanitize it */


          if (currentNode.content instanceof DocumentFragment) {
            _sanitizeShadowDOM(currentNode.content);
          }
          /* Check attributes, sanitize if necessary */


          _sanitizeAttributes(currentNode);

          oldNode = currentNode;
        }

        oldNode = null;
        /* If we sanitized `dirty` in-place, return it. */

        if (IN_PLACE) {
          return dirty;
        }
        /* Return sanitized string or DOM */


        if (RETURN_DOM) {
          if (RETURN_DOM_FRAGMENT) {
            returnNode = createDocumentFragment.call(body.ownerDocument);

            while (body.firstChild) {
              // eslint-disable-next-line unicorn/prefer-dom-node-append
              returnNode.appendChild(body.firstChild);
            }
          } else {
            returnNode = body;
          }

          if (ALLOWED_ATTR.shadowroot) {
            /*
              AdoptNode() is not used because internal state is not reset
              (e.g. the past names map of a HTMLFormElement), this is safe
              in theory but we would rather not risk another attack vector.
              The state that is cloned by importNode() is explicitly defined
              by the specs.
            */
            returnNode = importNode.call(originalDocument, returnNode, true);
          }

          return returnNode;
        }

        var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
        /* Serialize doctype if allowed */

        if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
          serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
        }
        /* Sanitize final string template-safe */


        if (SAFE_FOR_TEMPLATES) {
          serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$1, ' ');
          serializedHTML = stringReplace(serializedHTML, ERB_EXPR$1, ' ');
        }

        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
      };
      /**
       * Public method to set the configuration once
       * setConfig
       *
       * @param {Object} cfg configuration object
       */


      DOMPurify.setConfig = function (cfg) {
        _parseConfig(cfg);

        SET_CONFIG = true;
      };
      /**
       * Public method to remove the configuration
       * clearConfig
       *
       */


      DOMPurify.clearConfig = function () {
        CONFIG = null;
        SET_CONFIG = false;
      };
      /**
       * Public method to check if an attribute value is valid.
       * Uses last set config, if any. Otherwise, uses config defaults.
       * isValidAttribute
       *
       * @param  {string} tag Tag name of containing element.
       * @param  {string} attr Attribute name.
       * @param  {string} value Attribute value.
       * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
       */


      DOMPurify.isValidAttribute = function (tag, attr, value) {
        /* Initialize shared config vars if necessary. */
        if (!CONFIG) {
          _parseConfig({});
        }

        var lcTag = transformCaseFunc(tag);
        var lcName = transformCaseFunc(attr);
        return _isValidAttribute(lcTag, lcName, value);
      };
      /**
       * AddHook
       * Public method to add DOMPurify hooks
       *
       * @param {String} entryPoint entry point for the hook to add
       * @param {Function} hookFunction function to execute
       */


      DOMPurify.addHook = function (entryPoint, hookFunction) {
        if (typeof hookFunction !== 'function') {
          return;
        }

        hooks[entryPoint] = hooks[entryPoint] || [];
        arrayPush(hooks[entryPoint], hookFunction);
      };
      /**
       * RemoveHook
       * Public method to remove a DOMPurify hook at a given entryPoint
       * (pops it from the stack of hooks if more are present)
       *
       * @param {String} entryPoint entry point for the hook to remove
       * @return {Function} removed(popped) hook
       */


      DOMPurify.removeHook = function (entryPoint) {
        if (hooks[entryPoint]) {
          return arrayPop(hooks[entryPoint]);
        }
      };
      /**
       * RemoveHooks
       * Public method to remove all DOMPurify hooks at a given entryPoint
       *
       * @param  {String} entryPoint entry point for the hooks to remove
       */


      DOMPurify.removeHooks = function (entryPoint) {
        if (hooks[entryPoint]) {
          hooks[entryPoint] = [];
        }
      };
      /**
       * RemoveAllHooks
       * Public method to remove all DOMPurify hooks
       *
       */


      DOMPurify.removeAllHooks = function () {
        hooks = {};
      };

      return DOMPurify;
    }

    var purify = createDOMPurify();
    return purify;
  });

  var LoadedScripts = [];
  var LoadedStyles = [];

  var ScriptLoader = function ScriptLoader(scripts, callback) {
    var len = scripts.length;
    var i = 0;

    var AppendScript = function AppendScript() {
      if (LoadedScripts.indexOf(scripts[i]) < 0 && scripts[i] !== undefined) {
        var script = document.createElement("script");
        script.src = scripts[i];
        document.getElementsByTagName("head")[0].appendChild(script);
        LoadedScripts.push(scripts[i]);
        i++;

        if (i == len) {
          if (callback) {
            script.onload = callback;
          }

          return;
        }

        script.onload = AppendScript;
      } else if (scripts[i] == undefined && i != len) {
        i++;
        AppendScript();
      } else {
        return;
      }
    };

    AppendScript();
  };

  var StyleLoader = function StyleLoader(styles) {
    var len = styles.length;
    var i = 0;

    var AppendStyle = function AppendStyle() {
      if (LoadedStyles.indexOf(styles[i]) < 0 && styles[i] !== undefined) {
        var link = document.createElement("link");
        link.href = styles[i];
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
        LoadedStyles.push(styles[i]);
        i++;
        link.onload = AppendStyle;
      } else if (styles[i] == undefined && i != len) {
        i++;
        AppendStyle();
      } else {
        return;
      }
    };

    AppendStyle();
  };

  var DataLoader = /*#__PURE__*/_createClass(
  /*
  // DataLoaderをオプションなしで初期化してload()にURLを渡すと、
  // 拡張子(txt/json/html/xml)からフォーマットを判断してデータを返す。
  // callbackが必要ないとか、拡張子と内容がずれているとかがなければこれでOK
  const loader = new DataLoader();
  const data = await loader.load("/data/iss.txt");
   // 細かいオプションを設定したければ、初期化時にオプションを設定して
  const loader2 = new DataLoader({
    "url":"/data/iss.txt", // optional 上と同じくload()で指定してもOK。
    "format":"text",
    "callback":(data)=>{
      console.log(data);
    }
  });
  // そのままload()すると、callbackが実行される。
  loader.load();
  // awaitで待てばデータが返ってくる（上の例だとcallbackも実行される）。
  const data = await loader.load();
  // load()にURLを渡すと、先の設定で指定したurlを取得して、callbackが実行される。
  loader.load(/data/iss2.txt);
  */
  function DataLoader() {
    var _this = this;

    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, DataLoader);

    _defineProperty(this, "_get_format", function (url) {
      var extention = url.split('.').pop();
      var format;

      switch (extention) {
        case "json":
          format = "json";
          break;

        case "txt":
          format = "text";
          break;

        case "xml":
          format = "xml";
          break;

        case "html":
          format = "html";
          break;

        default:
          format = "text";
          break;
      }

      return format;
    });

    _defineProperty(this, "load", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(url) {
        var request, format, response;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (url) {
                  request = new Request(url);
                } else if (_this.url) {
                  request = new Request(_this.option.url);
                }

                if (_this.option.format) {
                  format = _this.option.format;
                } else {
                  format = _this._get_format(url);
                }

                _context.next = 4;
                return fetch(request).then(function (response) {
                  if (response.status === 200) {
                    switch (format) {
                      case "json":
                        return response.json();

                      case "text":
                        return response.text();

                      case "html":
                      case "xml":
                        return response.text();

                      default:
                        return response.text();
                    }
                  } else {
                    throw new Error("Error: " + response.status);
                  }
                }).then(function (response) {
                  if (_this.option.callback) {
                    _this.option.callback(response);
                  }

                  switch (format) {
                    case "xml":
                      var parser = new DOMParser();
                      var xml = parser.parseFromString(response, "text/xml");
                      return xml;

                    case "html":
                      var parser = new DOMParser();
                      var html = parser.parseFromString(response, "text/html");
                      return html;

                    default:
                      return response;
                  }
                })["catch"](function (error) {
                  console.error(error);
                });

              case 4:
                response = _context.sent;
                return _context.abrupt("return", response);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    this.option = option;
  });

  var GrobalStorage = {};
  GrobalStorage.highlight_exception = ["math", "graph", "chart"];
  GrobalStorage.plugins_loaded = false;

  var MarkdownViewer = /*#__PURE__*/function (_HTMLElement) {
    _inherits(MarkdownViewer, _HTMLElement);

    var _super = _createSuper(MarkdownViewer);

    function MarkdownViewer() {
      var _this;

      _classCallCheck(this, MarkdownViewer);

      _this = _super.call(this);

      _defineProperty(_assertThisInitialized(_this), "SetDefaults", function () {
        _this.config = {};

        if (_this.dataset.config) {
          _this.config = JSON.parse(_this.dataset.config);
        } else {
          if (_this.config.html == undefined) {
            _this.config.html = true;
          }

          if (_this.config.sanitize == undefined) {
            _this.config.sanitize = false;
          }

          if (_this.config.format == undefined) {
            _this.config.format = "markdown";
          }

          if (_this.config.query == undefined) {
            _this.config.query = true;
          }

          if (_this.config.query == undefined) {
            _this.config.query_path = "./";
          }
          /*
          const config = {
            "html":true,
            "sanitize":false,
            "format":"markdown",
            "query":true,
            "query_path":"./"
          }
          */

        }
      });

      _defineProperty(_assertThisInitialized(_this), "code_highlight_hook", function (f) {
        _this.Storage.CodeHighlightHook.push(f);
      });

      _defineProperty(_assertThisInitialized(_this), "init", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var markdown, src, loader, md_element, html, dom, code_array, i, class_list, lang;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.renderer = window.markdownit({
                  html: _this.config.html,
                  linkify: true,
                  breaks: true,
                  typographer: true,
                  highlight: function highlight(code, lang) {
                    if (_this.Storage.CodeHighlightHook.length > 0) {
                      for (var i in _this.Storage.CodeHighlightHook) {
                        code = _this.Storage.CodeHighlightHook[i](code, lang);
                      }
                    }

                    return code;
                  }
                });

                _this.renderer.linkify.set({
                  fuzzyLink: false
                });

                _this.renderer.use(markdownitFootnote).use(markdownitTaskLists).use(markdownItAttrs, {
                  allowedAttributes: _this.Storage.allowed_attributes
                });

                _this.code_highlight_hook(function (code, lang) {
                  if (GrobalStorage.highlight_exception.indexOf(lang) < 0) {
                    return hljs.highlightAuto(code, [lang]).value;
                  }
                });

                src = _this.getAttribute("src");

                if (!src) {
                  _context.next = 13;
                  break;
                }

                _this.Storage.mode = 'include';
                loader = new DataLoader();
                _context.next = 10;
                return loader.load(src);

              case 10:
                markdown = _context.sent;
                _context.next = 15;
                break;

              case 13:
                md_element = document.querySelector("template[data-target=\"".concat(_this.id, "\"]"));

                if (md_element) {
                  _this.Storage.mode = 'inline';
                  markdown = md_element.innerHTML;
                } else {
                  console.error("No markdown document is found.");
                }

              case 15:
                markdown = markdown.replace(/(&gt;)/g, '>');
                markdown = markdown.replace(/(&lt;)/g, '<');
                html = _this.renderer.render(markdown);
                dom = document.createRange().createContextualFragment(html);

                _this.appendChild(dom);

                _this.dataset.status = "loaded";
                code_array = document.querySelectorAll("code[class*=\"language\"]");

                for (i in code_array) {
                  class_list = code_array[i].classList;

                  if (class_list && class_list.value.match(/language/)) {
                    lang = class_list.value.match(/(|\s)language-(.*)(|\s)/)[2];
                    code_array[i].setAttribute("data-language", lang);

                    if (GrobalStorage.highlight_exception.indexOf(lang) < 0) {
                      code_array[i].setAttribute("data-highlight", true);
                    } else {
                      code_array[i].setAttribute("data-highlight", false);
                    }
                  }

                  if (code_array[i].parentNode) {
                    code_array[i].parentNode.classList.add("code");
                  }

                  if (code_array[i].dataset && code_array[i].dataset.highlight && code_array[i].dataset.highlight == "true") {
                    hljs.lineNumbersBlock(code_array[i], {
                      singleLine: false
                    });
                  }
                }

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })));

      _this.dataset.status = "assigned";
      _this.Storage = {};
      _this.Storage.CodeHighlightHook = [];
      _this.Storage.allowed_attributes = ['id', 'class', 'style'];

      _this.SetDefaults();

      return _this;
    }

    _createClass(MarkdownViewer, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        this.dataset.status = "connected";
        this.init();
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, old_value, new_value) {
        //console.log(this.id,name, new_value)
        if (name == 'data-status' && new_value == "loaded") {
          if (GrobalStorage.plugins_loaded == false) {
            customElements.define('mdview-plugins', MDViewPlugin);
            customElements.define('mdview-plugin-math', MDViewPluginMath);
            customElements.define('mdview-plugin-graph', MDViewPluginGraph);
            customElements.define('mdview-plugin-chart', MDViewPluginChart);
            GrobalStorage.plugins_loaded = true;
          }
        }
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['data-status'];
      }
    }]);

    return MarkdownViewer;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  var MDViewToc = /*#__PURE__*/function (_HTMLElement2) {
    _inherits(MDViewToc, _HTMLElement2);

    var _super2 = _createSuper(MDViewToc);

    function MDViewToc() {
      var _this2;

      _classCallCheck(this, MDViewToc);

      //console.log("MarkdownToc","constructor called")
      _this2 = _super2.call(this);

      _defineProperty(_assertThisInitialized(_this2), "crc32", function (str) {
        // checksum - JavaScript CRC32 - Stack Overflow https://stackoverflow.com/questions/18638900/javascript-crc32
        var a_table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
        var b_table = a_table.split(' ').map(function (s) {
          return parseInt(s, 16);
        });
        var crc = -1;

        for (var i = 0, iTop = str.length; i < iTop; i++) {
          crc = crc >>> 8 ^ b_table[(crc ^ str.charCodeAt(i)) & 0xFF];
        }

        return ((crc ^ -1) >>> 0).toString(16);
      });

      _defineProperty(_assertThisInitialized(_this2), "init", function () {
        _this2.renderer = window.markdownit({
          html: true,
          linkify: true,
          breaks: true,
          typographer: true
        });

        var element = _this2.closest('mdview-content');

        var header_array = element.querySelectorAll("h2, h3");
        var toc_str_array = [];
        toc_str_array.push("## Contents");

        for (var i in header_array) {
          if (header_array[i].textContent) {
            header_array[i].id = _this2.crc32(header_array[i].textContent);
            var indent_seeds = "          ";
            var depth = Number(header_array[i].tagName.slice(1, 2));
            var indent = indent_seeds.substr(0, (depth - 2) * 2);
            var str = indent + "- [" + header_array[i].textContent + "](#" + header_array[i].id + ")";
            toc_str_array.push(str);
          }
        }

        var toc = toc_str_array.join("\n");

        var html = _this2.renderer.render(toc);

        var dom = document.createRange().createContextualFragment(html);
        var toc_wrapper = document.createElement("div");
        toc_wrapper.classList.add("toc");
        toc_wrapper.appendChild(dom);

        _this2.appendChild(toc_wrapper);

        var toc_array = _this2.querySelectorAll(".toc");

        toc_array.forEach(function (element, index) {
          var toc_title = element.querySelectorAll("h2")[0];
          var toc_toggle_target = element.querySelectorAll("ul")[0];

          if (_this2.dataset.initial == "close") {
            toc_title.classList.toggle("close");
            toc_toggle_target.classList.add("toc-close");
          }

          toc_title.addEventListener('click', function (e) {
            toc_title.classList.toggle("close");

            if (toc_title.classList.contains("close")) {
              toc_toggle_target.classList.add("toc-close");
            } else {
              toc_toggle_target.classList.remove("toc-close");
            }
          });
        });
      });

      return _this2;
    }

    _createClass(MDViewToc, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        this.init();
      }
    }]);

    return MDViewToc;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  var MDViewPlugin = /*#__PURE__*/function (_HTMLElement3) {
    _inherits(MDViewPlugin, _HTMLElement3);

    var _super3 = _createSuper(MDViewPlugin);

    function MDViewPlugin() {
      var _this3;

      _classCallCheck(this, MDViewPlugin);

      _this3 = _super3.call(this);
      var plugins = _this3.children;
      _this3.dataset.count = plugins.length;
      _this3.dataset.loaded = 0;
      return _this3;
    }

    _createClass(MDViewPlugin, [{
      key: "connectedCallback",
      value: function connectedCallback() {}
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, old_value, new_value) {
        console.log(this.id, name, old_value, new_value);
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['data-count', 'data-loaded'];
      }
    }]);

    return MDViewPlugin;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  var MDViewPluginMath = /*#__PURE__*/function (_HTMLElement4) {
    _inherits(MDViewPluginMath, _HTMLElement4);

    var _super4 = _createSuper(MDViewPluginMath);

    function MDViewPluginMath() {
      var _this4;

      _classCallCheck(this, MDViewPluginMath);

      //GrobalStorage.highlight_exception.push("math");
      _this4 = _super4.call(this);
      _this4.dataset.status = "assigned";
      return _this4;
    }

    _createClass(MDViewPluginMath, [{
      key: "init",
      value: function init() {
        var _this5 = this;

        window.MathJax.startup.promise.then(function () {
          var viewer = _this5.closest('mdview-content');

          var math_element = viewer.querySelectorAll(".language-math");
          math_element.forEach(function (element, index) {
            MathJax.typesetPromise(element.childNodes);
            var svg = document.createRange().createContextualFragment(element.innerHTML);
            element.parentNode.insertBefore(svg, element);
            element.style.display = "none";
          }); //this.remove();
        });
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this6 = this;

        this.dataset.status = "connected";
        ScriptLoader(["https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"], function () {
          _this6.init();
        });
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, old_value, new_value) {
        console.log(this.tagName, name, new_value);
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['data-status'];
      }
    }]);

    return MDViewPluginMath;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  var MDViewPluginGraph = /*#__PURE__*/function (_HTMLElement5) {
    _inherits(MDViewPluginGraph, _HTMLElement5);

    var _super5 = _createSuper(MDViewPluginGraph);

    function MDViewPluginGraph() {
      var _this7;

      _classCallCheck(this, MDViewPluginGraph);

      _this7 = _super5.call(this);
      _this7.dataset.status = "assigned";
      return _this7;
    }

    _createClass(MDViewPluginGraph, [{
      key: "init",
      value: function init() {
        var viewer = this.closest('mdview-content');
        var graph_array = viewer.querySelectorAll(".language-graph");
        graph_array.forEach(function (element, index) {
          var p_node = element.parentNode;
          var graph_code = JSON.parse(element.innerHTML);
          var graph_id = "graph_" + index;
          var graph_element = document.createElement('div');
          graph_element.setAttribute("id", graph_id);
          graph_element.setAttribute("class", "graph");
          graph_element.style.width = "90%";
          graph_element.style.padding = "0";
          graph_element.style.margin = "0";
          p_node.parentNode.insertBefore(graph_element, p_node);
          p_node.style.display = "none";
          graph_code.bindto = "#" + graph_id;

          if (graph_code) {
            c3.generate(graph_code);
          }
        }); //this.remove();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this8 = this;

        this.dataset.status = "connected";
        ScriptLoader(["https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.0/c3.min.js", "https://cdnjs.cloudflare.com/ajax/libs/d3/5.9.2/d3.min.js"], function () {
          _this8.init();
        });
        StyleLoader(["https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.0/c3.min.css"]);
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, old_value, new_value) {
        console.log(this.tagName, name, new_value);
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['data-status'];
      }
    }]);

    return MDViewPluginGraph;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  var MDViewPluginChart = /*#__PURE__*/function (_HTMLElement6) {
    _inherits(MDViewPluginChart, _HTMLElement6);

    var _super6 = _createSuper(MDViewPluginChart);

    function MDViewPluginChart() {
      var _this9;

      _classCallCheck(this, MDViewPluginChart);

      _this9 = _super6.call(this);
      _this9.dataset.status = "assigned";
      return _this9;
    }

    _createClass(MDViewPluginChart, [{
      key: "init",
      value: function init() {
        var viewer = this.closest('mdview-content');
        var chart_array = viewer.querySelectorAll(".language-chart");
        chart_array.forEach(function (element, index) {
          var p_node = element.parentNode;
          var chart_element = document.createElement('pre');
          chart_element.classList.add("mermaid");
          chart_element.innerHTML = element.innerHTML;
          p_node.parentNode.insertBefore(chart_element, p_node);
          p_node.style.display = "none";
        });
        mermaid.initialize({
          startOnLoad: true
        }); //this.remove();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this10 = this;

        this.dataset.status = "connected";
        ScriptLoader(["https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"], function () {
          _this10.init();
        });
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, old_value, new_value) {
        console.log(this.tagName, name, new_value);
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['data-status'];
      }
    }]);

    return MDViewPluginChart;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  var scripts = [//"https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.2.0/markdown-it.min.js",
  //"https://cdn.jsdelivr.net/npm/markdown-it-attrs@4.1.4/markdown-it-attrs.browser.js",
  //"https://cdn.jsdelivr.net/npm/markdown-it-footnote@3.0.3/dist/markdown-it-footnote.min.js",
  //"https://cdn.jsdelivr.net/npm/markdown-it-task-lists@2.1.1/dist/markdown-it-task-lists.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js", "https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.7.0/highlightjs-line-numbers.min.js" //"https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js"
  ];
  var styles = ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/github.min.css"];
  ScriptLoader(scripts, function () {
    customElements.define('mdview-content', MarkdownViewer);
    customElements.define('mdview-toc', MDViewToc);
  });
  StyleLoader(styles);

})();
