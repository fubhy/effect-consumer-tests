/**
 * @since 2.0.0
 */
import { pipe } from "./Function.js";
import { globalValue } from "./GlobalValue.js";
import { hasProperty } from "./Predicate.js";
import { PCGRandom } from "./Utils.js";
/** @internal */
const randomHashCache = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/Hash/randomHashCache"), () => new WeakMap());
/** @internal */
const pcgr = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/Hash/pcgr"), () => new PCGRandom());
/**
 * @since 2.0.0
 * @category symbols
 */
export const symbol = /*#__PURE__*/Symbol.for("effect/Hash");
/**
 * @since 2.0.0
 * @category hashing
 */
export const hash = self => {
  switch (typeof self) {
    case "number":
      {
        return number(self);
      }
    case "bigint":
      {
        return string(self.toString(10));
      }
    case "boolean":
      {
        return string(String(self));
      }
    case "symbol":
      {
        return string(String(self));
      }
    case "string":
      {
        return string(self);
      }
    case "undefined":
      {
        return string("undefined");
      }
    case "function":
    case "object":
      {
        if (self === null) {
          return string("null");
        }
        if (isHash(self)) {
          return self[symbol]();
        } else {
          return random(self);
        }
      }
    default:
      {
        throw new Error("Bug in Equal.hash");
      }
  }
};
/**
 * @since 2.0.0
 * @category hashing
 */
export const random = self => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, number(pcgr.integer(Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
/**
 * @since 2.0.0
 * @category hashing
 */
export const combine = b => self => self * 53 ^ b;
/**
 * @since 2.0.0
 * @category hashing
 */
export const optimize = n => n & 0xbfffffff | n >>> 1 & 0x40000000;
/**
 * @since 2.0.0
 * @category guards
 */
export const isHash = u => hasProperty(u, symbol);
/**
 * @since 2.0.0
 * @category hashing
 */
export const number = n => {
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
  return optimize(n);
};
/**
 * @since 2.0.0
 * @category hashing
 */
export const string = str => {
  let h = 5381,
    i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
/**
 * @since 2.0.0
 * @category hashing
 */
export const structureKeys = (o, keys) => {
  let h = 12289;
  for (let i = 0; i < keys.length; i++) {
    h ^= pipe(string(keys[i]), combine(hash(o[keys[i]])));
  }
  return optimize(h);
};
/**
 * @since 2.0.0
 * @category hashing
 */
export const structure = o => structureKeys(o, Object.keys(o));
/**
 * @since 2.0.0
 * @category hashing
 */
export const array = arr => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(hash(arr[i])));
  }
  return optimize(h);
};
//# sourceMappingURL=Hash.js.map