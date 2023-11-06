"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remainder = exports.multiplyAll = exports.sumAll = exports.sign = exports.max = exports.min = exports.clamp = exports.between = exports.greaterThanOrEqualTo = exports.greaterThan = exports.lessThanOrEqualTo = exports.lessThan = exports.Order = exports.Equivalence = exports.decrement = exports.increment = exports.unsafeDivide = exports.divide = exports.subtract = exports.multiply = exports.sum = exports.isNumber = void 0;
/**
 * This module provides utility functions and type class instances for working with the `number` type in TypeScript.
 * It includes functions for basic arithmetic operations, as well as type class instances for
 * `Equivalence` and `Order`.
 *
 * @since 2.0.0
 */
const equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const option = /*#__PURE__*/require("./internal/option.js");
const order = /*#__PURE__*/require("./Order.js");
const predicate = /*#__PURE__*/require("./Predicate.js");
/**
 * Tests if a value is a `number`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNumber } from 'effect/Number'
 *
 * assert.deepStrictEqual(isNumber(2), true)
 * assert.deepStrictEqual(isNumber("2"), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isNumber = predicate.isNumber;
/**
 * Provides an addition operation on `number`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { sum } from 'effect/Number'
 *
 * assert.deepStrictEqual(sum(2, 3), 5)
 *
 * @category math
 * @since 2.0.0
 */
exports.sum = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self + that);
/**
 * Provides a multiplication operation on `number`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { multiply } from 'effect/Number'
 *
 * assert.deepStrictEqual(multiply(2, 3), 6)
 *
 * @category math
 * @since 2.0.0
 */
exports.multiply = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self * that);
/**
 * Provides a subtraction operation on `number`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { subtract } from 'effect/Number'
 *
 * assert.deepStrictEqual(subtract(2, 3), -1)
 *
 * @category math
 * @since 2.0.0
 */
exports.subtract = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self - that);
/**
 * Provides a division operation on `number`s.
 *
 * @param self - The dividend operand.
 * @param that - The divisor operand.
 *
 * @example
 * import { divide } from 'effect/Number'
 * import { some, none } from 'effect/Option'
 *
 * assert.deepStrictEqual(divide(6, 3), some(2))
 * assert.deepStrictEqual(divide(6, 0), none())
 *
 * @category math
 * @since 2.0.0
 */
exports.divide = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => that === 0 ? option.none : option.some(self / that));
/**
 * Provides a division operation on `number`s.
 *
 * Throws a `RangeError` if the divisor is `0`.
 *
 * @param self - The dividend operand.
 * @param that - The divisor operand.
 *
 * @example
 * import { unsafeDivide } from 'effect/Number'
 *
 * assert.deepStrictEqual(unsafeDivide(6, 3), 2)
 *
 * @category math
 * @since 2.0.0
 */
exports.unsafeDivide = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self / that);
/**
 * Returns the result of adding `1` to a given number.
 *
 * @param n - A `number` to be incremented.
 *
 * @example
 * import { increment } from 'effect/Number'
 *
 * assert.deepStrictEqual(increment(2), 3)
 *
 * @category math
 * @since 2.0.0
 */
const increment = n => n + 1;
exports.increment = increment;
/**
 * Decrements a number by `1`.
 *
 * @param n - A `number` to be decremented.
 *
 * @example
 * import { decrement } from 'effect/Number'
 *
 * assert.deepStrictEqual(decrement(3), 2)
 *
 * @category math
 * @since 2.0.0
 */
const decrement = n => n - 1;
exports.decrement = decrement;
/**
 * @category instances
 * @since 2.0.0
 */
exports.Equivalence = equivalence.number;
/**
 * @category instances
 * @since 2.0.0
 */
exports.Order = order.number;
/**
 * Returns `true` if the first argument is less than the second, otherwise `false`.
 *
 * @param self - The first argument.
 * @param that - The second argument.
 *
 * @example
 * import { lessThan } from 'effect/Number'
 *
 * assert.deepStrictEqual(lessThan(2, 3), true)
 * assert.deepStrictEqual(lessThan(3, 3), false)
 * assert.deepStrictEqual(lessThan(4, 3), false)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.lessThan = /*#__PURE__*/order.lessThan(exports.Order);
/**
 * Returns a function that checks if a given `number` is less than or equal to the provided one.
 *
 * @param self - The first `number` to compare with.
 * @param that - The second `number` to compare with.
 *
 * @example
 * import { lessThanOrEqualTo } from 'effect/Number'
 *
 * assert.deepStrictEqual(lessThanOrEqualTo(2, 3), true)
 * assert.deepStrictEqual(lessThanOrEqualTo(3, 3), true)
 * assert.deepStrictEqual(lessThanOrEqualTo(4, 3), false)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.lessThanOrEqualTo = /*#__PURE__*/order.lessThanOrEqualTo(exports.Order);
/**
 * Returns `true` if the first argument is greater than the second, otherwise `false`.
 *
 * @param self - The first argument.
 * @param that - The second argument.
 *
 * @example
 * import { greaterThan } from 'effect/Number'
 *
 * assert.deepStrictEqual(greaterThan(2, 3), false)
 * assert.deepStrictEqual(greaterThan(3, 3), false)
 * assert.deepStrictEqual(greaterThan(4, 3), true)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.greaterThan = /*#__PURE__*/order.greaterThan(exports.Order);
/**
 * Returns a function that checks if a given `number` is greater than or equal to the provided one.
 *
 * @param self - The first `number` to compare with.
 * @param that - The second `number` to compare with.
 *
 * @example
 * import { greaterThanOrEqualTo } from 'effect/Number'
 *
 * assert.deepStrictEqual(greaterThanOrEqualTo(2, 3), false)
 * assert.deepStrictEqual(greaterThanOrEqualTo(3, 3), true)
 * assert.deepStrictEqual(greaterThanOrEqualTo(4, 3), true)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.greaterThanOrEqualTo = /*#__PURE__*/order.greaterThanOrEqualTo(exports.Order);
/**
 * Checks if a `number` is between a `minimum` and `maximum` value (inclusive).
 *
 * @param self - The `number` to check.
 * @param minimum - The `minimum` value to check.
 * @param maximum - The `maximum` value to check.
 *
 * @example
 * import { between } from 'effect/Number'
 *
 * assert.deepStrictEqual(between(0, 5)(3), true)
 * assert.deepStrictEqual(between(0, 5)(-1), false)
 * assert.deepStrictEqual(between(0, 5)(6), false)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.between = /*#__PURE__*/order.between(exports.Order);
/**
 * Restricts the given `number` to be within the range specified by the `minimum` and `maximum` values.
 *
 * - If the `number` is less than the `minimum` value, the function returns the `minimum` value.
 * - If the `number` is greater than the `maximum` value, the function returns the `maximum` value.
 * - Otherwise, it returns the original `number`.
 *
 * @param self - The `number` to be clamped.
 * @param minimum - The lower end of the range.
 * @param maximum - The upper end of the range.
 *
 * @example
 * import { clamp } from 'effect/Number'
 *
 * assert.deepStrictEqual(clamp(0, 5)(3), 3)
 * assert.deepStrictEqual(clamp(0, 5)(-1), 0)
 * assert.deepStrictEqual(clamp(0, 5)(6), 5)
 *
 * @since 2.0.0
 */
exports.clamp = /*#__PURE__*/order.clamp(exports.Order);
/**
 * Returns the minimum between two `number`s.
 *
 * @param self - The first `number`.
 * @param that - The second `number`.
 *
 * @example
 * import { min } from 'effect/Number'
 *
 * assert.deepStrictEqual(min(2, 3), 2)
 *
 * @since 2.0.0
 */
exports.min = /*#__PURE__*/order.min(exports.Order);
/**
 * Returns the maximum between two `number`s.
 *
 * @param self - The first `number`.
 * @param that - The second `number`.
 *
 * @example
 * import { max } from 'effect/Number'
 *
 * assert.deepStrictEqual(max(2, 3), 3)
 *
 * @since 2.0.0
 */
exports.max = /*#__PURE__*/order.max(exports.Order);
/**
 * Determines the sign of a given `number`.
 *
 * @param n - The `number` to determine the sign of.
 *
 * @example
 * import { sign } from 'effect/Number'
 *
 * assert.deepStrictEqual(sign(-5), -1)
 * assert.deepStrictEqual(sign(0), 0)
 * assert.deepStrictEqual(sign(5), 1)
 *
 * @category math
 * @since 2.0.0
 */
const sign = n => (0, exports.Order)(n, 0);
exports.sign = sign;
/**
 * Takes an `Iterable` of `number`s and returns their sum as a single `number`.
 *
 * @param collection - The collection of `number`s to sum.
 *
 * @example
 * import { sumAll } from 'effect/Number'
 *
 * assert.deepStrictEqual(sumAll([2, 3, 4]), 9)
 *
 * @category math
 * @since 2.0.0
 */
const sumAll = collection => {
  let out = 0;
  for (const n of collection) {
    out += n;
  }
  return out;
};
exports.sumAll = sumAll;
/**
 * Takes an `Iterable` of `number`s and returns their multiplication as a single `number`.
 *
 * @param collection - The collection of `number`s to multiply.
 *
 * @example
 * import { multiplyAll } from 'effect/Number'
 *
 * assert.deepStrictEqual(multiplyAll([2, 3, 4]), 24)
 *
 * @category math
 * @since 2.0.0
 */
const multiplyAll = collection => {
  let out = 1;
  for (const n of collection) {
    if (n === 0) {
      return 0;
    }
    out *= n;
  }
  return out;
};
exports.multiplyAll = multiplyAll;
/**
 * Returns the remainder left over when one operand is divided by a second operand.
 *
 * It always takes the sign of the dividend.
 *
 * @param self - The dividend.
 * @param divisor - The divisor.
 *
 * @example
 * import { remainder } from "effect/Number"
 *
 * assert.deepStrictEqual(remainder(2, 2), 0)
 * assert.deepStrictEqual(remainder(3, 2), 1)
 * assert.deepStrictEqual(remainder(-4, 2), -0)
 *
 * @category math
 * @since 2.0.0
 */
exports.remainder = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, divisor) => {
  // https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
  const selfDecCount = (self.toString().split(".")[1] || "").length;
  const divisorDecCount = (divisor.toString().split(".")[1] || "").length;
  const decCount = selfDecCount > divisorDecCount ? selfDecCount : divisorDecCount;
  const selfInt = parseInt(self.toFixed(decCount).replace(".", ""));
  const divisorInt = parseInt(divisor.toFixed(decCount).replace(".", ""));
  return selfInt % divisorInt / Math.pow(10, decCount);
});
//# sourceMappingURL=Number.js.map