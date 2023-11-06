"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = exports.array = exports.tuple = exports.productMany = exports.all = exports.product = exports.Date = exports.mapInput = exports.combineAll = exports.combineMany = exports.combine = exports.symbol = exports.bigint = exports.boolean = exports.number = exports.string = exports.strict = exports.make = void 0;
/**
 * This module provides an implementation of the `Equivalence` type class, which defines a binary relation
 * that is reflexive, symmetric, and transitive. In other words, it defines a notion of equivalence between values of a certain type.
 * These properties are also known in mathematics as an "equivalence relation".
 *
 * @since 2.0.0
 */
const Function_js_1 = /*#__PURE__*/require("./Function.js");
/**
 * @category constructors
 * @since 2.0.0
 */
const make = isEquivalent => (self, that) => self === that || isEquivalent(self, that);
exports.make = make;
const isStrictEquivalent = (x, y) => x === y;
/**
 * Return an `Equivalence` that uses strict equality (===) to compare values.
 *
 * @since 2.0.0
 * @category constructors
 */
const strict = () => isStrictEquivalent;
exports.strict = strict;
/**
 * @category instances
 * @since 2.0.0
 */
exports.string = /*#__PURE__*/(0, exports.strict)();
/**
 * @category instances
 * @since 2.0.0
 */
exports.number = /*#__PURE__*/(0, exports.strict)();
/**
 * @category instances
 * @since 2.0.0
 */
exports.boolean = /*#__PURE__*/(0, exports.strict)();
/**
 * @category instances
 * @since 2.0.0
 */
exports.bigint = /*#__PURE__*/(0, exports.strict)();
/**
 * @category instances
 * @since 2.0.0
 */
exports.symbol = /*#__PURE__*/(0, exports.strict)();
/**
 * @category combining
 * @since 2.0.0
 */
exports.combine = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.make)((x, y) => self(x, y) && that(x, y)));
/**
 * @category combining
 * @since 2.0.0
 */
exports.combineMany = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, collection) => (0, exports.make)((x, y) => {
  if (!self(x, y)) {
    return false;
  }
  for (const equivalence of collection) {
    if (!equivalence(x, y)) {
      return false;
    }
  }
  return true;
}));
const isAlwaysEquivalent = (_x, _y) => true;
/**
 * @category combining
 * @since 2.0.0
 */
const combineAll = collection => (0, exports.combineMany)(isAlwaysEquivalent, collection);
exports.combineAll = combineAll;
/**
 * @category combinators
 * @since 2.0.0
 */
exports.mapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.make)((x, y) => self(f(x), f(y))));
/**
 * @category instances
 * @since 2.0.0
 */
exports.Date = /*#__PURE__*/(0, exports.mapInput)(exports.number, date => date.getTime());
/**
 * @category combining
 * @since 2.0.0
 */
exports.product = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.make)(([xa, xb], [ya, yb]) => self(xa, ya) && that(xb, yb)));
/**
 * @category combining
 * @since 2.0.0
 */
const all = collection => {
  return (0, exports.make)((x, y) => {
    const len = Math.min(x.length, y.length);
    let collectionLength = 0;
    for (const equivalence of collection) {
      if (collectionLength >= len) {
        break;
      }
      if (!equivalence(x[collectionLength], y[collectionLength])) {
        return false;
      }
      collectionLength++;
    }
    return true;
  });
};
exports.all = all;
/**
 * @category combining
 * @since 2.0.0
 */
const productMany = (self, collection) => {
  const equivalence = (0, exports.all)(collection);
  return (0, exports.make)((x, y) => !self(x[0], y[0]) ? false : equivalence(x.slice(1), y.slice(1)));
};
exports.productMany = productMany;
/**
 * Similar to `Promise.all` but operates on `Equivalence`s.
 *
 * ```
 * [Equivalence<A>, Equivalence<B>, ...] -> Equivalence<[A, B, ...]>
 * ```
 *
 * Given a tuple of `Equivalence`s returns a new `Equivalence` that compares values of a tuple
 * by applying each `Equivalence` to the corresponding element of the tuple.
 *
 * @category combinators
 * @since 2.0.0
 */
const tuple = (...elements) => (0, exports.all)(elements);
exports.tuple = tuple;
/**
 * Creates a new `Equivalence` for an array of values based on a given `Equivalence` for the elements of the array.
 *
 * @category combinators
 * @since 2.0.0
 */
const array = item => (0, exports.make)((self, that) => {
  if (self.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self.length; i++) {
    const isEq = item(self[i], that[i]);
    if (!isEq) {
      return false;
    }
  }
  return true;
});
exports.array = array;
/**
 * Given a struct of `Equivalence`s returns a new `Equivalence` that compares values of a struct
 * by applying each `Equivalence` to the corresponding property of the struct.
 *
 * @category combinators
 * @since 2.0.0
 */
const struct = fields => {
  const keys = Object.keys(fields);
  return (0, exports.make)((self, that) => {
    for (const key of keys) {
      if (!fields[key](self[key], that[key])) {
        return false;
      }
    }
    return true;
  });
};
exports.struct = struct;
//# sourceMappingURL=Equivalence.js.map