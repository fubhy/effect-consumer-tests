"use strict";

/**
 * This module provides utility functions and type class instances for working with the `bigint` type in TypeScript.
 * It includes functions for basic arithmetic operations, as well as type class instances for
 * `Equivalence` and `Order`.
 *
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multiplyAll = exports.sumAll = exports.sqrt = exports.unsafeSqrt = exports.lcm = exports.gcd = exports.abs = exports.sign = exports.max = exports.min = exports.clamp = exports.between = exports.greaterThanOrEqualTo = exports.greaterThan = exports.lessThanOrEqualTo = exports.lessThan = exports.Order = exports.Equivalence = exports.decrement = exports.increment = exports.unsafeDivide = exports.divide = exports.subtract = exports.multiply = exports.sum = exports.isBigInt = void 0;
const equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Option = /*#__PURE__*/require("./Option.js");
const order = /*#__PURE__*/require("./Order.js");
const predicate = /*#__PURE__*/require("./Predicate.js");
const bigint0 = /*#__PURE__*/BigInt(0);
const bigint1 = /*#__PURE__*/BigInt(1);
const bigint2 = /*#__PURE__*/BigInt(2);
/**
 * Tests if a value is a `bigint`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isBigInt } from "effect/BigInt"
 *
 * assert.deepStrictEqual(isBigInt(1n), true)
 * assert.deepStrictEqual(isBigInt(1), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isBigInt = predicate.isBigInt;
/**
 * Provides an addition operation on `bigint`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { sum } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(sum(2n, 3n), 5n)
 *
 * @category math
 * @since 2.0.0
 */
exports.sum = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self + that);
/**
 * Provides a multiplication operation on `bigint`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { multiply } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(multiply(2n, 3n), 6n)
 *
 * @category math
 * @since 2.0.0
 */
exports.multiply = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self * that);
/**
 * Provides a subtraction operation on `bigint`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { subtract } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(subtract(2n, 3n), -1n)
 *
 * @category math
 * @since 2.0.0
 */
exports.subtract = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self - that);
/**
 * Provides a division operation on `bigint`s.
 *
 * If the dividend is not a multiple of the divisor the result will be a `bigint` value
 * which represents the integer division rounded down to the nearest integer.
 *
 * Returns `None` if the divisor is `0n`.
 *
 * @param self - The dividend operand.
 * @param that - The divisor operand.
 *
 * @example
 * import { divide } from 'effect/BigInt'
 * import { some, none } from 'effect/Option'
 *
 * assert.deepStrictEqual(divide(6n, 3n), some(2n))
 * assert.deepStrictEqual(divide(6n, 0n), none())
 *
 * @category math
 * @since 2.0.0
 */
exports.divide = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => that === bigint0 ? Option.none() : Option.some(self / that));
/**
 * Provides a division operation on `bigint`s.
 *
 * If the dividend is not a multiple of the divisor the result will be a `bigint` value
 * which represents the integer division rounded down to the nearest integer.
 *
 * Throws a `RangeError` if the divisor is `0n`.
 *
 * @param self - The dividend operand.
 * @param that - The divisor operand.
 *
 * @example
 * import { unsafeDivide } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(unsafeDivide(6n, 3n), 2n)
 * assert.deepStrictEqual(unsafeDivide(6n, 4n), 1n)
 *
 * @category math
 * @since 2.0.0
 */
exports.unsafeDivide = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self / that);
/**
 * Returns the result of adding `1n` to a given number.
 *
 * @param n - A `bigint` to be incremented.
 *
 * @example
 * import { increment } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(increment(2n), 3n)
 *
 * @category math
 * @since 2.0.0
 */
const increment = n => n + bigint1;
exports.increment = increment;
/**
 * Decrements a number by `1n`.
 *
 * @param n - A `bigint` to be decremented.
 *
 * @example
 * import { decrement } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(decrement(3n), 2n)
 *
 * @category math
 * @since 2.0.0
 */
const decrement = n => n - bigint1;
exports.decrement = decrement;
/**
 * @category instances
 * @since 2.0.0
 */
exports.Equivalence = equivalence.bigint;
/**
 * @category instances
 * @since 2.0.0
 */
exports.Order = order.bigint;
/**
 * Returns `true` if the first argument is less than the second, otherwise `false`.
 *
 * @param self - The first argument.
 * @param that - The second argument.
 *
 * @example
 * import { lessThan } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(lessThan(2n, 3n), true)
 * assert.deepStrictEqual(lessThan(3n, 3n), false)
 * assert.deepStrictEqual(lessThan(4n, 3n), false)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.lessThan = /*#__PURE__*/order.lessThan(exports.Order);
/**
 * Returns a function that checks if a given `bigint` is less than or equal to the provided one.
 *
 * @param self - The first `bigint` to compare with.
 * @param that - The second `bigint` to compare with.
 *
 * @example
 * import { lessThanOrEqualTo } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(lessThanOrEqualTo(2n, 3n), true)
 * assert.deepStrictEqual(lessThanOrEqualTo(3n, 3n), true)
 * assert.deepStrictEqual(lessThanOrEqualTo(4n, 3n), false)
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
 * import { greaterThan } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(greaterThan(2n, 3n), false)
 * assert.deepStrictEqual(greaterThan(3n, 3n), false)
 * assert.deepStrictEqual(greaterThan(4n, 3n), true)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.greaterThan = /*#__PURE__*/order.greaterThan(exports.Order);
/**
 * Returns a function that checks if a given `bigint` is greater than or equal to the provided one.
 *
 * @param self - The first `bigint` to compare with.
 * @param that - The second `bigint` to compare with.
 *
 * @example
 * import { greaterThanOrEqualTo } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(greaterThanOrEqualTo(2n, 3n), false)
 * assert.deepStrictEqual(greaterThanOrEqualTo(3n, 3n), true)
 * assert.deepStrictEqual(greaterThanOrEqualTo(4n, 3n), true)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.greaterThanOrEqualTo = /*#__PURE__*/order.greaterThanOrEqualTo(exports.Order);
/**
 * Checks if a `bigint` is between a `minimum` and `maximum` value (inclusive).
 *
 * @param self - The `number` to check.
 * @param minimum - The `minimum` value to check.
 * @param maximum - The `maximum` value to check.
 *
 * @example
 * import { between } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(between(0n, 5n)(3n), true)
 * assert.deepStrictEqual(between(0n, 5n)(-1n), false)
 * assert.deepStrictEqual(between(0n, 5n)(6n), false)
 *
 * @category predicates
 * @since 2.0.0
 */
exports.between = /*#__PURE__*/order.between(exports.Order);
/**
 * Restricts the given `bigint` to be within the range specified by the `minimum` and `maximum` values.
 *
 * - If the `bigint` is less than the `minimum` value, the function returns the `minimum` value.
 * - If the `bigint` is greater than the `maximum` value, the function returns the `maximum` value.
 * - Otherwise, it returns the original `bigint`.
 *
 * @param self - The `bigint` to be clamped.
 * @param minimum - The lower end of the range.
 * @param maximum - The upper end of the range.
 *
 * @example
 * import { clamp } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(clamp(0n, 5n)(3n), 3n)
 * assert.deepStrictEqual(clamp(0n, 5n)(-1n), 0n)
 * assert.deepStrictEqual(clamp(0n, 5n)(6n), 5n)
 *
 * @since 2.0.0
 */
exports.clamp = /*#__PURE__*/order.clamp(exports.Order);
/**
 * Returns the minimum between two `bigint`s.
 *
 * @param self - The first `bigint`.
 * @param that - The second `bigint`.
 *
 * @example
 * import { min } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(min(2n, 3n), 2n)
 *
 * @since 2.0.0
 */
exports.min = /*#__PURE__*/order.min(exports.Order);
/**
 * Returns the maximum between two `bigint`s.
 *
 * @param self - The first `bigint`.
 * @param that - The second `bigint`.
 *
 * @example
 * import { max } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(max(2n, 3n), 3n)
 *
 * @since 2.0.0
 */
exports.max = /*#__PURE__*/order.max(exports.Order);
/**
 * Determines the sign of a given `bigint`.
 *
 * @param n - The `bigint` to determine the sign of.
 *
 * @example
 * import { sign } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(sign(-5n), -1)
 * assert.deepStrictEqual(sign(0n), 0)
 * assert.deepStrictEqual(sign(5n), 1)
 *
 * @category math
 * @since 2.0.0
 */
const sign = n => (0, exports.Order)(n, bigint0);
exports.sign = sign;
/**
 * Determines the absolute value of a given `bigint`.
 *
 * @param n - The `bigint` to determine the absolute value of.
 *
 * @example
 * import { abs } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(abs(-5n), 5n)
 * assert.deepStrictEqual(abs(0n), 0n)
 * assert.deepStrictEqual(abs(5n), 5n)
 *
 * @category math
 * @since 2.0.0
 */
const abs = n => n < bigint0 ? -n : n;
exports.abs = abs;
/**
 * Determines the greatest common divisor of two `bigint`s.
 *
 * @param a - The first `bigint`.
 * @param b - The second `bigint`.
 *
 * @example
 * import { gcd } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(gcd(2n, 3n), 1n)
 * assert.deepStrictEqual(gcd(2n, 4n), 2n)
 * assert.deepStrictEqual(gcd(16n, 24n), 8n)
 *
 * @category math
 * @since 2.0.0
 */
exports.gcd = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  while (that !== bigint0) {
    const t = that;
    that = self % that;
    self = t;
  }
  return self;
});
/**
 * Determines the least common multiple of two `bigint`s.
 *
 * @param a - The first `bigint`.
 * @param b - The second `bigint`.
 *
 * @example
 * import { lcm } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(lcm(2n, 3n), 6n)
 * assert.deepStrictEqual(lcm(2n, 4n), 4n)
 * assert.deepStrictEqual(lcm(16n, 24n), 48n)
 *
 * @category math
 * @since 2.0.0
 */
exports.lcm = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self * that / (0, exports.gcd)(self, that));
/**
 * Determines the square root of a given `bigint` unsafely. Throws if the given `bigint` is negative.
 *
 * @param n - The `bigint` to determine the square root of.
 *
 * @example
 * import { unsafeSqrt } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(unsafeSqrt(4n), 2n)
 * assert.deepStrictEqual(unsafeSqrt(9n), 3n)
 * assert.deepStrictEqual(unsafeSqrt(16n), 4n)
 *
 * @category math
 * @since 2.0.0
 */
const unsafeSqrt = n => {
  if (n < bigint0) {
    throw new RangeError("Cannot take the square root of a negative number");
  }
  if (n < bigint2) {
    return n;
  }
  let x = n / bigint2;
  while (x * x > n) {
    x = (n / x + x) / bigint2;
  }
  return x;
};
exports.unsafeSqrt = unsafeSqrt;
/**
 * Determines the square root of a given `bigint` safely. Returns `none` if the given `bigint` is negative.
 *
 * @param n - The `bigint` to determine the square root of.
 *
 * @example
 * import { sqrt } from 'effect/BigInt'
 * import * as Option from 'effect/Option'
 *
 * assert.deepStrictEqual(sqrt(4n), Option.some(2n))
 * assert.deepStrictEqual(sqrt(9n), Option.some(3n))
 * assert.deepStrictEqual(sqrt(16n), Option.some(4n))
 * assert.deepStrictEqual(sqrt(-1n), Option.none())
 *
 * @category math
 * @since 2.0.0
 */
const sqrt = n => (0, exports.greaterThanOrEqualTo)(n, bigint0) ? Option.some((0, exports.unsafeSqrt)(n)) : Option.none();
exports.sqrt = sqrt;
/**
 * Takes an `Iterable` of `bigint`s and returns their sum as a single `bigint
 *
 * @param collection - The collection of `bigint`s to sum.
 *
 * @example
 * import { sumAll } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(sumAll([2n, 3n, 4n]), 9n)
 *
 * @category math
 * @since 2.0.0
 */
const sumAll = collection => {
  let out = bigint0;
  for (const n of collection) {
    out += n;
  }
  return out;
};
exports.sumAll = sumAll;
/**
 * Takes an `Iterable` of `bigint`s and returns their multiplication as a single `number`.
 *
 * @param collection - The collection of `bigint`s to multiply.
 *
 * @example
 * import { multiplyAll } from 'effect/BigInt'
 *
 * assert.deepStrictEqual(multiplyAll([2n, 3n, 4n]), 24n)
 *
 * @category math
 * @since 2.0.0
 */
const multiplyAll = collection => {
  let out = bigint1;
  for (const n of collection) {
    if (n === bigint0) {
      return bigint0;
    }
    out *= n;
  }
  return out;
};
exports.multiplyAll = multiplyAll;
//# sourceMappingURL=BigInt.js.map