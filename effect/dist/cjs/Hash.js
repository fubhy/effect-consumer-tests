"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.array = exports.structure = exports.structureKeys = exports.string = exports.number = exports.isHash = exports.optimize = exports.combine = exports.random = exports.hash = exports.symbol = void 0;
/**
 * @since 2.0.0
 */
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("./GlobalValue.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const Utils_js_1 = /*#__PURE__*/require("./Utils.js");
/** @internal */
const randomHashCache = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Hash/randomHashCache"), () => new WeakMap());
/** @internal */
const pcgr = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Hash/pcgr"), () => new Utils_js_1.PCGRandom());
/**
 * @since 2.0.0
 * @category symbols
 */
exports.symbol = /*#__PURE__*/Symbol.for("effect/Hash");
/**
 * @since 2.0.0
 * @category hashing
 */
const hash = self => {
  switch (typeof self) {
    case "number":
      {
        return (0, exports.number)(self);
      }
    case "bigint":
      {
        return (0, exports.string)(self.toString(10));
      }
    case "boolean":
      {
        return (0, exports.string)(String(self));
      }
    case "symbol":
      {
        return (0, exports.string)(String(self));
      }
    case "string":
      {
        return (0, exports.string)(self);
      }
    case "undefined":
      {
        return (0, exports.string)("undefined");
      }
    case "function":
    case "object":
      {
        if (self === null) {
          return (0, exports.string)("null");
        }
        if ((0, exports.isHash)(self)) {
          return self[exports.symbol]();
        } else {
          return (0, exports.random)(self);
        }
      }
    default:
      {
        throw new Error("Bug in Equal.hash");
      }
  }
};
exports.hash = hash;
/**
 * @since 2.0.0
 * @category hashing
 */
const random = self => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, (0, exports.number)(pcgr.integer(Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
exports.random = random;
/**
 * @since 2.0.0
 * @category hashing
 */
const combine = b => self => self * 53 ^ b;
exports.combine = combine;
/**
 * @since 2.0.0
 * @category hashing
 */
const optimize = n => n & 0xbfffffff | n >>> 1 & 0x40000000;
exports.optimize = optimize;
/**
 * @since 2.0.0
 * @category guards
 */
const isHash = u => (0, Predicate_js_1.hasProperty)(u, exports.symbol);
exports.isHash = isHash;
/**
 * @since 2.0.0
 * @category hashing
 */
const number = n => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 0xffffffff;
  }
  while (n > 0xffffffff) {
    h ^= n /= 0xffffffff;
  }
  return (0, exports.optimize)(n);
};
exports.number = number;
/**
 * @since 2.0.0
 * @category hashing
 */
const string = str => {
  let h = 5381,
    i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return (0, exports.optimize)(h);
};
exports.string = string;
/**
 * @since 2.0.0
 * @category hashing
 */
const structureKeys = (o, keys) => {
  let h = 12289;
  for (let i = 0; i < keys.length; i++) {
    h ^= (0, Function_js_1.pipe)((0, exports.string)(keys[i]), (0, exports.combine)((0, exports.hash)(o[keys[i]])));
  }
  return (0, exports.optimize)(h);
};
exports.structureKeys = structureKeys;
/**
 * @since 2.0.0
 * @category hashing
 */
const structure = o => (0, exports.structureKeys)(o, Object.keys(o));
exports.structure = structure;
/**
 * @since 2.0.0
 * @category hashing
 */
const array = arr => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = (0, Function_js_1.pipe)(h, (0, exports.combine)((0, exports.hash)(arr[i])));
  }
  return (0, exports.optimize)(h);
};
exports.array = array;
//# sourceMappingURL=Hash.js.map