"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.between = exports.clamp = exports.max = exports.min = exports.greaterThanOrEqualTo = exports.lessThanOrEqualTo = exports.greaterThan = exports.lessThan = exports.struct = exports.array = exports.tuple = exports.productMany = exports.all = exports.product = exports.Date = exports.mapInput = exports.combineAll = exports.empty = exports.combineMany = exports.combine = exports.reverse = exports.bigint = exports.boolean = exports.number = exports.string = exports.make = void 0;
/**
 * @since 2.0.0
 */
const Function_js_1 = /*#__PURE__*/require("./Function.js");
/**
 * @category constructors
 * @since 2.0.0
 */
const make = compare => (self, that) => self === that ? 0 : compare(self, that);
exports.make = make;
/**
 * @category instances
 * @since 2.0.0
 */
exports.string = /*#__PURE__*/(0, exports.make)((self, that) => self < that ? -1 : 1);
/**
 * @category instances
 * @since 2.0.0
 */
exports.number = /*#__PURE__*/(0, exports.make)((self, that) => self < that ? -1 : 1);
/**
 * @category instances
 * @since 2.0.0
 */
exports.boolean = /*#__PURE__*/(0, exports.make)((self, that) => self < that ? -1 : 1);
/**
 * @category instances
 * @since 2.0.0
 */
exports.bigint = /*#__PURE__*/(0, exports.make)((self, that) => self < that ? -1 : 1);
/**
 * @since 2.0.0
 */
const reverse = O => (0, exports.make)((self, that) => O(that, self));
exports.reverse = reverse;
/**
 * @category combining
 * @since 2.0.0
 */
exports.combine = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.make)((a1, a2) => {
  const out = self(a1, a2);
  if (out !== 0) {
    return out;
  }
  return that(a1, a2);
}));
/**
 * @category combining
 * @since 2.0.0
 */
exports.combineMany = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, collection) => (0, exports.make)((a1, a2) => {
  let out = self(a1, a2);
  if (out !== 0) {
    return out;
  }
  for (const O of collection) {
    out = O(a1, a2);
    if (out !== 0) {
      return out;
    }
  }
  return out;
}));
/**
 * @since 2.0.0
 */
const empty = () => (0, exports.make)(() => 0);
exports.empty = empty;
/**
 * @category combining
 * @since 2.0.0
 */
const combineAll = collection => (0, exports.combineMany)((0, exports.empty)(), collection);
exports.combineAll = combineAll;
/**
 * @category combinators
 * @since 2.0.0
 */
exports.mapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.make)((b1, b2) => self(f(b1), f(b2))));
/**
 * @category instances
 * @since 2.0.0
 */
exports.Date = /*#__PURE__*/(0, exports.mapInput)(exports.number, date => date.getTime());
/**
 * @category combining
 * @since 2.0.0
 */
exports.product = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.make)(([xa, xb], [ya, yb]) => {
  const o = self(xa, ya);
  return o !== 0 ? o : that(xb, yb);
}));
/**
 * @category combining
 * @since 2.0.0
 */
const all = collection => {
  return (0, exports.make)((x, y) => {
    const len = Math.min(x.length, y.length);
    let collectionLength = 0;
    for (const O of collection) {
      if (collectionLength >= len) {
        break;
      }
      const o = O(x[collectionLength], y[collectionLength]);
      if (o !== 0) {
        return o;
      }
      collectionLength++;
    }
    return 0;
  });
};
exports.all = all;
/**
 * @category combining
 * @since 2.0.0
 */
exports.productMany = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, collection) => {
  const O = (0, exports.all)(collection);
  return (0, exports.make)((x, y) => {
    const o = self(x[0], y[0]);
    return o !== 0 ? o : O(x.slice(1), y.slice(1));
  });
});
/**
 * Similar to `Promise.all` but operates on `Order`s.
 *
 * ```
 * [Order<A>, Order<B>, ...] -> Order<[A, B, ...]>
 * ```
 *
 * This function creates and returns a new `Order` for a tuple of values based on the given `Order`s for each element in the tuple.
 * The returned `Order` compares two tuples of the same type by applying the corresponding `Order` to each element in the tuple.
 * It is useful when you need to compare two tuples of the same type and you have a specific way of comparing each element
 * of the tuple.
 *
 * @category combinators
 * @since 2.0.0
 */
const tuple = (...elements) => (0, exports.all)(elements);
exports.tuple = tuple;
/**
 * This function creates and returns a new `Order` for an array of values based on a given `Order` for the elements of the array.
 * The returned `Order` compares two arrays by applying the given `Order` to each element in the arrays.
 * If all elements are equal, the arrays are then compared based on their length.
 * It is useful when you need to compare two arrays of the same type and you have a specific way of comparing each element of the array.
 *
 * @category combinators
 * @since 2.0.0
 */
const array = O => (0, exports.make)((self, that) => {
  const aLen = self.length;
  const bLen = that.length;
  const len = Math.min(aLen, bLen);
  for (let i = 0; i < len; i++) {
    const o = O(self[i], that[i]);
    if (o !== 0) {
      return o;
    }
  }
  return (0, exports.number)(aLen, bLen);
});
exports.array = array;
/**
 * This function creates and returns a new `Order` for a struct of values based on the given `Order`s
 * for each property in the struct.
 *
 * @category combinators
 * @since 2.0.0
 */
const struct = fields => {
  const keys = Object.keys(fields);
  return (0, exports.make)((self, that) => {
    for (const key of keys) {
      const o = fields[key](self[key], that[key]);
      if (o !== 0) {
        return o;
      }
    }
    return 0;
  });
};
exports.struct = struct;
/**
 * Test whether one value is _strictly less than_ another.
 *
 * @since 2.0.0
 */
const lessThan = O => (0, Function_js_1.dual)(2, (self, that) => O(self, that) === -1);
exports.lessThan = lessThan;
/**
 * Test whether one value is _strictly greater than_ another.
 *
 * @since 2.0.0
 */
const greaterThan = O => (0, Function_js_1.dual)(2, (self, that) => O(self, that) === 1);
exports.greaterThan = greaterThan;
/**
 * Test whether one value is _non-strictly less than_ another.
 *
 * @since 2.0.0
 */
const lessThanOrEqualTo = O => (0, Function_js_1.dual)(2, (self, that) => O(self, that) !== 1);
exports.lessThanOrEqualTo = lessThanOrEqualTo;
/**
 * Test whether one value is _non-strictly greater than_ another.
 *
 * @since 2.0.0
 */
const greaterThanOrEqualTo = O => (0, Function_js_1.dual)(2, (self, that) => O(self, that) !== -1);
exports.greaterThanOrEqualTo = greaterThanOrEqualTo;
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen.
 *
 * @since 2.0.0
 */
const min = O => (0, Function_js_1.dual)(2, (self, that) => self === that || O(self, that) < 1 ? self : that);
exports.min = min;
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen.
 *
 * @since 2.0.0
 */
const max = O => (0, Function_js_1.dual)(2, (self, that) => self === that || O(self, that) > -1 ? self : that);
exports.max = max;
/**
 * Clamp a value between a minimum and a maximum.
 *
 * @since 2.0.0
 */
const clamp = O => (0, Function_js_1.dual)(3, (self, minimum, maximum) => (0, exports.min)(O)(maximum, (0, exports.max)(O)(minimum, self)));
exports.clamp = clamp;
/**
 * Test whether a value is between a minimum and a maximum (inclusive).
 *
 * @since 2.0.0
 */
const between = O => (0, Function_js_1.dual)(3, (self, minimum, maximum) => !(0, exports.lessThan)(O)(self, minimum) && !(0, exports.greaterThan)(O)(self, maximum));
exports.between = between;
//# sourceMappingURL=Order.js.map