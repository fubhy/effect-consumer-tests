"use strict";

/**
 * This module provides utility functions and type class instances for working with the `BigDecimal` type in TypeScript.
 * It includes functions for basic arithmetic operations, as well as type class instances for `Equivalence` and `Order`.
 *
 * A `BigDecimal` allows storing any real number to arbitrary precision; which avoids common floating point errors
 * (such as 0.1 + 0.2 ≠ 0.3) at the cost of complexity.
 *
 * Internally, `BigDecimal` uses a `BigInt` object, paired with a 64-bit integer which determines the position of the
 * decimal point. Therefore, the precision *is not* actually arbitrary, but limited to 2<sup>63</sup> decimal places.
 *
 * It is not recommended to convert a floating point number to a decimal directly, as the floating point representation
 * may be unexpected.
 *
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPositive = exports.isNegative = exports.isZero = exports.isInteger = exports.unsafeToNumber = exports.toString = exports.unsafeFromString = exports.fromString = exports.fromNumber = exports.fromBigInt = exports.equals = exports.Equivalence = exports.unsafeRemainder = exports.remainder = exports.negate = exports.abs = exports.sign = exports.max = exports.min = exports.clamp = exports.between = exports.greaterThanOrEqualTo = exports.greaterThan = exports.lessThanOrEqualTo = exports.lessThan = exports.Order = exports.unsafeDivide = exports.divide = exports.subtract = exports.multiply = exports.sum = exports.scale = exports.normalize = exports.make = exports.isBigDecimal = exports.TypeId = void 0;
const Equal = /*#__PURE__*/require("./Equal.js");
const equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Hash = /*#__PURE__*/require("./Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const Option = /*#__PURE__*/require("./Option.js");
const order = /*#__PURE__*/require("./Order.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const DEFAULT_PRECISION = 100;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TypeId = /*#__PURE__*/Symbol.for("effect/BigDecimal");
const BigDecimalProto = {
  [exports.TypeId]: exports.TypeId,
  [Hash.symbol]() {
    const normalized = (0, exports.normalize)(this);
    return (0, Function_js_1.pipe)(Hash.hash(normalized.value), Hash.combine(Hash.number(normalized.scale)));
  },
  [Equal.symbol](that) {
    return (0, exports.isBigDecimal)(that) && (0, exports.equals)(this, that);
  },
  toString() {
    return (0, exports.toString)(this);
  },
  toJSON() {
    return (0, exports.toString)(this);
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return (0, exports.toString)(this);
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/**
 * Checks if a given value is a `BigDecimal`.
 *
 * @param u - The value to check.
 *
 * @since 2.0.0
 * @category guards
 */
const isBigDecimal = u => (0, Predicate_js_1.hasProperty)(u, exports.TypeId);
exports.isBigDecimal = isBigDecimal;
/**
 * Creates a `BigDecimal` from a `bigint` value and a scale.
 *
 * @param value - The `bigint` value to create a `BigDecimal` from.
 * @param scale - The scale of the `BigDecimal`.
 *
 * @since 2.0.0
 * @category constructors
 */
const make = (value, scale) => {
  const o = Object.create(BigDecimalProto);
  o.value = value;
  o.scale = scale;
  return o;
};
exports.make = make;
const bigint0 = /*#__PURE__*/BigInt(0);
const bigint1 = /*#__PURE__*/BigInt(1);
const bigint10 = /*#__PURE__*/BigInt(10);
const zero = /*#__PURE__*/(0, exports.make)(bigint0, 0);
/**
 * Normalizes a given `BigDecimal` by removing trailing zeros.
 *
 * @param self - The `BigDecimal` to normalize.
 *
 * @example
 * import { normalize, make, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(normalize(unsafeFromString("123.00000")), make(123n, 0))
 * assert.deepStrictEqual(normalize(unsafeFromString("12300000")), make(123n, -5))
 *
 * @since 2.0.0
 * @category scaling
 */
const normalize = self => {
  if (self.normalized === undefined) {
    if (self.value === bigint0) {
      self.normalized = zero;
    } else {
      const digits = `${self.value}`;
      let trail = 0;
      for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] === "0") {
          trail++;
        } else {
          break;
        }
      }
      if (trail === 0) {
        self.normalized = self;
      }
      const value = BigInt(digits.substring(0, digits.length - trail));
      const scale = self.scale - trail;
      self.normalized = (0, exports.make)(value, scale);
    }
  }
  return self.normalized;
};
exports.normalize = normalize;
/**
 * Scales a given `BigDecimal` to the specified scale.
 *
 * If the given scale is smaller than the current scale, the value will be rounded down to
 * the nearest integer.
 *
 * @param self - The `BigDecimal` to scale.
 * @param scale - The scale to scale to.
 *
 * @since 2.0.0
 * @category scaling
 */
const scale = (self, scale) => {
  if (scale > self.scale) {
    return (0, exports.make)(self.value * bigint10 ** BigInt(scale - self.scale), scale);
  }
  if (scale < self.scale) {
    return (0, exports.make)(self.value / bigint10 ** BigInt(self.scale - scale), scale);
  }
  return self;
};
exports.scale = scale;
/**
 * Provides an addition operation on `BigDecimal`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { sum, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(sum(unsafeFromString("2"), unsafeFromString("3")), unsafeFromString("5"))
 *
 * @since 2.0.0
 * @category math
 */
exports.sum = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (that.value === bigint0) {
    return self;
  }
  if (self.value === bigint0) {
    return that;
  }
  if (self.scale > that.scale) {
    return (0, exports.make)((0, exports.scale)(that, self.scale).value + self.value, self.scale);
  }
  if (self.scale < that.scale) {
    return (0, exports.make)((0, exports.scale)(self, that.scale).value + that.value, that.scale);
  }
  return (0, exports.make)(self.value + that.value, self.scale);
});
/**
 * Provides a multiplication operation on `BigDecimal`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { multiply, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(multiply(unsafeFromString("2"), unsafeFromString("3")), unsafeFromString("6"))
 *
 * @since 2.0.0
 * @category math
 */
exports.multiply = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (that.value === bigint0 || self.value === bigint0) {
    return zero;
  }
  return (0, exports.make)(self.value * that.value, self.scale + that.scale);
});
/**
 * Provides a subtraction operation on `BigDecimal`s.
 *
 * @param self - The first operand.
 * @param that - The second operand.
 *
 * @example
 * import { subtract, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(subtract(unsafeFromString("2"), unsafeFromString("3")), unsafeFromString("-1"))
 *
 * @since 2.0.0
 * @category math
 */
exports.subtract = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (that.value === bigint0) {
    return self;
  }
  if (self.value === bigint0) {
    return (0, exports.make)(-that.value, that.scale);
  }
  if (self.scale > that.scale) {
    return (0, exports.make)(self.value - (0, exports.scale)(that, self.scale).value, self.scale);
  }
  if (self.scale < that.scale) {
    return (0, exports.make)((0, exports.scale)(self, that.scale).value - that.value, that.scale);
  }
  return (0, exports.make)(self.value - that.value, self.scale);
});
/**
 * Internal function used for arbitrary precision division.
 */
const divideWithPrecision = (num, den, scale, precision) => {
  if (num === bigint0) {
    return zero;
  }
  const numNegative = num < bigint0;
  const denNegative = den < bigint0;
  const negateResult = numNegative !== denNegative;
  num = numNegative ? -num : num;
  den = denNegative ? -den : den;
  // Shift digits until numerator is larger than denominator (set scale appropriately).
  while (num < den) {
    num *= bigint10;
    scale++;
  }
  // First division.
  let quotient = num / den;
  let remainder = num % den;
  if (remainder === bigint0) {
    // No remainder, return immediately.
    return (0, exports.make)(negateResult ? -quotient : quotient, scale);
  }
  // The quotient is guaranteed to be non-negative at this point. No need to consider sign.
  let count = `${quotient}`.length;
  // Shift the remainder by 1 decimal; The quotient will be 1 digit upon next division.
  remainder *= bigint10;
  while (remainder !== bigint0 && count < precision) {
    const q = remainder / den;
    const r = remainder % den;
    quotient = quotient * bigint10 + q;
    remainder = r * bigint10;
    count++;
    scale++;
  }
  if (remainder !== bigint0) {
    // Round final number with remainder.
    quotient += roundTerminal(remainder / den);
  }
  return (0, exports.make)(negateResult ? -quotient : quotient, scale);
};
/**
 * Internal function used for rounding.
 *
 * Returns 1 if the most significant digit is >= 5, otherwise 0.
 *
 * This is used after dividing a number by a power of ten and rounding the last digit.
 */
const roundTerminal = n => {
  if (n === bigint0) {
    return bigint0;
  }
  const pos = n > bigint0 ? 0 : 1;
  return Number(`${n}`[pos]) < 5 ? bigint0 : bigint1;
};
/**
 * Provides a division operation on `BigDecimal`s.
 *
 * If the dividend is not a multiple of the divisor the result will be a `BigDecimal` value
 * which represents the integer division rounded down to the nearest integer.
 *
 * If the divisor is `0`, the result will be `None`.
 *
 * @param self - The dividend operand.
 * @param that - The divisor operand.
 *
 * @example
 * import { divide, unsafeFromString } from "effect/BigDecimal"
 * import { some, none } from "effect/Option"
 *
 * assert.deepStrictEqual(divide(unsafeFromString("6"), unsafeFromString("3")), some(unsafeFromString("2")))
 * assert.deepStrictEqual(divide(unsafeFromString("6"), unsafeFromString("4")), some(unsafeFromString("1.5")))
 * assert.deepStrictEqual(divide(unsafeFromString("6"), unsafeFromString("0")), none())
 *
 * @since 2.0.0
 * @category math
 */
exports.divide = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (that.value === bigint0) {
    return Option.none();
  }
  if (self.value === bigint0) {
    return Option.some(zero);
  }
  const scale = self.scale - that.scale;
  if (self.value === that.value) {
    return Option.some((0, exports.make)(bigint1, scale));
  }
  return Option.some(divideWithPrecision(self.value, that.value, scale, DEFAULT_PRECISION));
});
/**
 * Provides an unsafe division operation on `BigDecimal`s.
 *
 * If the dividend is not a multiple of the divisor the result will be a `BigDecimal` value
 * which represents the integer division rounded down to the nearest integer.
 *
 * Throws a `RangeError` if the divisor is `0`.
 *
 * @param self - The dividend operand.
 * @param that - The divisor operand.as
 *
 * @example
 * import { unsafeDivide, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(unsafeDivide(unsafeFromString("6"), unsafeFromString("3")), unsafeFromString("2"))
 * assert.deepStrictEqual(unsafeDivide(unsafeFromString("6"), unsafeFromString("4")), unsafeFromString("1.5"))
 *
 * @since 2.0.0
 * @category math
 */
exports.unsafeDivide = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (that.value === bigint0) {
    throw new RangeError("Division by zero");
  }
  if (self.value === bigint0) {
    return zero;
  }
  const scale = self.scale - that.scale;
  if (self.value === that.value) {
    return (0, exports.make)(bigint1, scale);
  }
  return divideWithPrecision(self.value, that.value, scale, DEFAULT_PRECISION);
});
/**
 * @since 2.0.0
 * @category instances
 */
exports.Order = /*#__PURE__*/order.make((self, that) => {
  const scmp = order.number((0, exports.sign)(self), (0, exports.sign)(that));
  if (scmp !== 0) {
    return scmp;
  }
  if (self.scale > that.scale) {
    return order.bigint(self.value, (0, exports.scale)(that, self.scale).value);
  }
  if (self.scale < that.scale) {
    return order.bigint((0, exports.scale)(self, that.scale).value, that.value);
  }
  return order.bigint(self.value, that.value);
});
/**
 * Returns `true` if the first argument is less than the second, otherwise `false`.
 *
 * @param self - The first argument.
 * @param that - The second argument.
 *
 * @example
 * import { lessThan, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(lessThan(unsafeFromString("2"), unsafeFromString("3")), true)
 * assert.deepStrictEqual(lessThan(unsafeFromString("3"), unsafeFromString("3")), false)
 * assert.deepStrictEqual(lessThan(unsafeFromString("4"), unsafeFromString("3")), false)
 *
 * @since 2.0.0
 * @category predicates
 */
exports.lessThan = /*#__PURE__*/order.lessThan(exports.Order);
/**
 * Checks if a given `BigDecimal` is less than or equal to the provided one.
 *
 * @param self - The first `BigDecimal` to compare with.
 * @param that - The second `BigDecimal` to compare with.
 *
 * @example
 * import { lessThanOrEqualTo, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(lessThanOrEqualTo(unsafeFromString("2"), unsafeFromString("3")), true)
 * assert.deepStrictEqual(lessThanOrEqualTo(unsafeFromString("3"), unsafeFromString("3")), true)
 * assert.deepStrictEqual(lessThanOrEqualTo(unsafeFromString("4"), unsafeFromString("3")), false)
 *
 * @since 2.0.0
 * @category predicates
 */
exports.lessThanOrEqualTo = /*#__PURE__*/order.lessThanOrEqualTo(exports.Order);
/**
 * Returns `true` if the first argument is greater than the second, otherwise `false`.
 *
 * @param self - The first argument.
 * @param that - The second argument.
 *
 * @example
 * import { greaterThan, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(greaterThan(unsafeFromString("2"), unsafeFromString("3")), false)
 * assert.deepStrictEqual(greaterThan(unsafeFromString("3"), unsafeFromString("3")), false)
 * assert.deepStrictEqual(greaterThan(unsafeFromString("4"), unsafeFromString("3")), true)
 *
 * @since 2.0.0
 * @category predicates
 */
exports.greaterThan = /*#__PURE__*/order.greaterThan(exports.Order);
/**
 * Checks if a given `BigDecimal` is greater than or equal to the provided one.
 *
 * @param self - The first `BigDecimal` to compare with.
 * @param that - The second `BigDecimal` to compare with.
 *
 * @example
 * import { greaterThanOrEqualTo, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(greaterThanOrEqualTo(unsafeFromString("2"), unsafeFromString("3")), false)
 * assert.deepStrictEqual(greaterThanOrEqualTo(unsafeFromString("3"), unsafeFromString("3")), true)
 * assert.deepStrictEqual(greaterThanOrEqualTo(unsafeFromString("4"), unsafeFromString("3")), true)
 *
 * @since 2.0.0
 * @category predicates
 */
exports.greaterThanOrEqualTo = /*#__PURE__*/order.greaterThanOrEqualTo(exports.Order);
/**
 * Checks if a `BigDecimal` is between a `minimum` and `maximum` value (inclusive).
 *
 * @param self - The `number` to check.
 * @param minimum - The `minimum` value to check.
 * @param maximum - The `maximum` value to check.
 *
 * @example
 * import { between, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(between(unsafeFromString("0"), unsafeFromString("5"))(unsafeFromString("3")), true)
 * assert.deepStrictEqual(between(unsafeFromString("0"), unsafeFromString("5"))(unsafeFromString("-1")), false)
 * assert.deepStrictEqual(between(unsafeFromString("0"), unsafeFromString("5"))(unsafeFromString("6")), false)
 *
 * @since 2.0.0
 * @category predicates
 */
exports.between = /*#__PURE__*/order.between(exports.Order);
/**
 * Restricts the given `BigDecimal` to be within the range specified by the `minimum` and `maximum` values.
 *
 * - If the `BigDecimal` is less than the `minimum` value, the function returns the `minimum` value.
 * - If the `BigDecimal` is greater than the `maximum` value, the function returns the `maximum` value.
 * - Otherwise, it returns the original `BigDecimal`.
 *
 * @param self - The `BigDecimal` to be clamped.
 * @param minimum - The lower end of the range.
 * @param maximum - The upper end of the range.
 *
 * @example
 * import { clamp, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(clamp(unsafeFromString("0"), unsafeFromString("5"))(unsafeFromString("3")), unsafeFromString("3"))
 * assert.deepStrictEqual(clamp(unsafeFromString("0"), unsafeFromString("5"))(unsafeFromString("-1")), unsafeFromString("0"))
 * assert.deepStrictEqual(clamp(unsafeFromString("0"), unsafeFromString("5"))(unsafeFromString("6")), unsafeFromString("5"))
 *
 * @since 2.0.0
 * @category math
 */
exports.clamp = /*#__PURE__*/order.clamp(exports.Order);
/**
 * Returns the minimum between two `BigDecimal`s.
 *
 * @param self - The first `BigDecimal`.
 * @param that - The second `BigDecimal`.
 *
 * @example
 * import { min, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(min(unsafeFromString("2"), unsafeFromString("3")), unsafeFromString("2"))
 *
 * @since 2.0.0
 * @category math
 */
exports.min = /*#__PURE__*/order.min(exports.Order);
/**
 * Returns the maximum between two `BigDecimal`s.
 *
 * @param self - The first `BigDecimal`.
 * @param that - The second `BigDecimal`.
 *
 * @example
 * import { max, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(max(unsafeFromString("2"), unsafeFromString("3")), unsafeFromString("3"))
 *
 * @since 2.0.0
 * @category math
 */
exports.max = /*#__PURE__*/order.max(exports.Order);
/**
 * Determines the sign of a given `BigDecimal`.
 *
 * @param n - The `BigDecimal` to determine the sign of.
 *
 * @example
 * import { sign, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(sign(unsafeFromString("-5")), -1)
 * assert.deepStrictEqual(sign(unsafeFromString("0")), 0)
 * assert.deepStrictEqual(sign(unsafeFromString("5")), 1)
 *
 * @since 2.0.0
 * @category math
 */
const sign = n => n.value === bigint0 ? 0 : n.value < bigint0 ? -1 : 1;
exports.sign = sign;
/**
 * Determines the absolute value of a given `BigDecimal`.
 *
 * @param n - The `BigDecimal` to determine the absolute value of.
 *
 * @example
 * import { abs, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(abs(unsafeFromString("-5")), unsafeFromString("5"))
 * assert.deepStrictEqual(abs(unsafeFromString("0")), unsafeFromString("0"))
 * assert.deepStrictEqual(abs(unsafeFromString("5")), unsafeFromString("5"))
 *
 * @since 2.0.0
 * @category math
 */
const abs = n => n.value < bigint0 ? (0, exports.make)(-n.value, n.scale) : n;
exports.abs = abs;
/**
 * Provides a negate operation on `BigDecimal`s.
 *
 * @param n - The `BigDecimal` to negate.
 *
 * @example
 * import { negate, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(negate(unsafeFromString("3")), unsafeFromString("-3"))
 * assert.deepStrictEqual(negate(unsafeFromString("-6")), unsafeFromString("6"))
 *
 * @since 2.0.0
 * @category math
 */
const negate = n => (0, exports.make)(-n.value, n.scale);
exports.negate = negate;
/**
 * Returns the remainder left over when one operand is divided by a second operand.
 *
 * If the divisor is `0`, the result will be `None`.
 *
 * @param self - The dividend.
 * @param divisor - The divisor.
 *
 * @example
 * import { remainder, unsafeFromString } from "effect/BigDecimal"
 * import { some } from "effect/Option"
 *
 * assert.deepStrictEqual(remainder(unsafeFromString("2"), unsafeFromString("2")), some(unsafeFromString("0")))
 * assert.deepStrictEqual(remainder(unsafeFromString("3"), unsafeFromString("2")), some(unsafeFromString("1")))
 * assert.deepStrictEqual(remainder(unsafeFromString("-4"), unsafeFromString("2")), some(unsafeFromString("0")))
 *
 * @since 2.0.0
 * @category math
 */
exports.remainder = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, divisor) => {
  if (divisor.value === bigint0) {
    return Option.none();
  }
  const max = Math.max(self.scale, divisor.scale);
  return Option.some((0, exports.make)((0, exports.scale)(self, max).value % (0, exports.scale)(divisor, max).value, max));
});
/**
 * Returns the remainder left over when one operand is divided by a second operand.
 *
 * Throws a `RangeError` if the divisor is `0`.
 *
 * @param self - The dividend.
 * @param divisor - The divisor.
 *
 * @example
 * import { unsafeRemainder, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(unsafeRemainder(unsafeFromString("2"), unsafeFromString("2")), unsafeFromString("0"))
 * assert.deepStrictEqual(unsafeRemainder(unsafeFromString("3"), unsafeFromString("2")), unsafeFromString("1"))
 * assert.deepStrictEqual(unsafeRemainder(unsafeFromString("-4"), unsafeFromString("2")), unsafeFromString("0"))
 *
 * @since 2.0.0
 * @category math
 */
exports.unsafeRemainder = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, divisor) => {
  if (divisor.value === bigint0) {
    throw new RangeError("Division by zero");
  }
  const max = Math.max(self.scale, divisor.scale);
  return (0, exports.make)((0, exports.scale)(self, max).value % (0, exports.scale)(divisor, max).value, max);
});
/**
 * @category instances
 * @since 2.0.0
 */
exports.Equivalence = /*#__PURE__*/equivalence.make((self, that) => {
  if (self.scale > that.scale) {
    return (0, exports.scale)(that, self.scale).value === self.value;
  }
  if (self.scale < that.scale) {
    return (0, exports.scale)(self, that.scale).value === that.value;
  }
  return self.value === that.value;
});
/**
 * Checks if two `BigDecimal`s are equal.
 *
 * @since 2.0.0
 * @category predicates
 */
exports.equals = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.Equivalence)(self, that));
/**
 * Creates a `BigDecimal` from a `bigint` value.
 *
 * @param value - The `bigint` value to create a `BigDecimal` from.
 *
 * @since 2.0.0
 * @category constructors
 */
const fromBigInt = n => (0, exports.make)(n, 0);
exports.fromBigInt = fromBigInt;
/**
 * Creates a `BigDecimal` from a `number` value.
 *
 * It is not recommended to convert a floating point number to a decimal directly,
 * as the floating point representation may be unexpected.
 *
 * @param value - The `number` value to create a `BigDecimal` from.
 *
 * @example
 * import { fromNumber, make } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(fromNumber(123), make(123n, 0))
 * assert.deepStrictEqual(fromNumber(123.456), make(123456n, 3))
 *
 * @since 2.0.0
 * @category constructors
 */
const fromNumber = n => {
  const [lead, trail = ""] = `${n}`.split(".");
  return (0, exports.make)(BigInt(`${lead}${trail}`), trail.length);
};
exports.fromNumber = fromNumber;
/**
 * Parses a numerical `string` into a `BigDecimal`.
 *
 * @param s - The `string` to parse.
 *
 * @example
 * import { fromString, make } from "effect/BigDecimal"
 * import { some, none } from "effect/Option"
 *
 * assert.deepStrictEqual(fromString("123"), some(make(123n, 0)))
 * assert.deepStrictEqual(fromString("123.456"), some(make(123456n, 3)))
 * assert.deepStrictEqual(fromString("123.abc"), none())
 *
 * @since 2.0.0
 * @category constructors
 */
const fromString = s => {
  let digits;
  let scale;
  const dot = s.search(/\./);
  if (dot !== -1) {
    const lead = s.slice(0, dot);
    const trail = s.slice(dot + 1);
    digits = `${lead}${trail}`;
    scale = trail.length;
  } else {
    digits = s;
    scale = 0;
  }
  if (digits === "") {
    // TODO: This mimics the BigInt constructor behavior. Should this be `Option.none()`?
    return Option.some(zero);
  }
  if (!/^(?:\+|-)?\d+$/.test(digits)) {
    return Option.none();
  }
  return Option.some((0, exports.make)(BigInt(digits), scale));
};
exports.fromString = fromString;
/**
 * Parses a numerical `string` into a `BigDecimal`.
 *
 * @param s - The `string` to parse.
 *
 * @example
 * import { unsafeFromString, make } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(unsafeFromString("123"), make(123n, 0))
 * assert.deepStrictEqual(unsafeFromString("123.456"), make(123456n, 3))
 * assert.throws(() => unsafeFromString("123.abc"))
 *
 * @since 2.0.0
 * @category constructors
 */
const unsafeFromString = s => Option.getOrThrowWith((0, exports.fromString)(s), () => new Error("Invalid numerical string"));
exports.unsafeFromString = unsafeFromString;
/**
 * Formats a given `BigDecimal` as a `string`.
 *
 * @param normalized - The `BigDecimal` to format.
 *
 * @example
 * import { toString, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(toString(unsafeFromString("-5")), "-5")
 * assert.deepStrictEqual(toString(unsafeFromString("123.456")), "123.456")
 * assert.deepStrictEqual(toString(unsafeFromString("-0.00000123")), "-0.00000123")
 *
 * @since 2.0.0
 * @category conversions
 */
const toString = n => {
  const negative = n.value < bigint0;
  const absolute = negative ? `${n.value}`.substring(1) : `${n.value}`;
  let before;
  let after;
  if (n.scale >= absolute.length) {
    before = "0";
    after = "0".repeat(n.scale - absolute.length) + absolute;
  } else {
    const location = absolute.length - n.scale;
    if (location > absolute.length) {
      const zeros = location - absolute.length;
      before = `${absolute}${"0".repeat(zeros)}`;
      after = "";
    } else {
      after = absolute.slice(location);
      before = absolute.slice(0, location);
    }
  }
  const complete = after === "" ? before : `${before}.${after}`;
  return negative ? `-${complete}` : complete;
};
exports.toString = toString;
/**
 * Converts a `BigDecimal` to a `number`.
 *
 * This function will produce incorrect results if the `BigDecimal` exceeds the 64-bit range of a `number`.
 *
 * @param n - The `BigDecimal` to convert.
 *
 * @example
 * import { unsafeToNumber, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(unsafeToNumber(unsafeFromString("123.456")), 123.456)
 *
 * @since 2.0.0
 * @category conversions
 */
const unsafeToNumber = n => Number((0, exports.toString)(n));
exports.unsafeToNumber = unsafeToNumber;
/**
 * Checks if a given `BigDecimal` is an integer.
 *
 * @param n - The `BigDecimal` to check.
 *
 * @example
 * import { isInteger, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(isInteger(unsafeFromString("0")), true)
 * assert.deepStrictEqual(isInteger(unsafeFromString("1")), true)
 * assert.deepStrictEqual(isInteger(unsafeFromString("1.1")), false)
 *
 * @since 2.0.0
 * @category predicates
 */
const isInteger = n => (0, exports.normalize)(n).scale <= 0;
exports.isInteger = isInteger;
/**
 * Checks if a given `BigDecimal` is `0`.
 *
 * @param n - The `BigDecimal` to check.
 *
 * @example
 * import { isZero, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(isZero(unsafeFromString("0")), true)
 * assert.deepStrictEqual(isZero(unsafeFromString("1")), false)
 *
 * @since 2.0.0
 * @category predicates
 */
const isZero = n => n.value === bigint0;
exports.isZero = isZero;
/**
 * Checks if a given `BigDecimal` is negative.
 *
 * @param n - The `BigDecimal` to check.
 *
 * @example
 * import { isNegative, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(isNegative(unsafeFromString("-1")), true)
 * assert.deepStrictEqual(isNegative(unsafeFromString("0")), false)
 * assert.deepStrictEqual(isNegative(unsafeFromString("1")), false)
 *
 * @since 2.0.0
 * @category predicates
 */
const isNegative = n => n.value < bigint0;
exports.isNegative = isNegative;
/**
 * Checks if a given `BigDecimal` is positive.
 *
 * @param n - The `BigDecimal` to check.
 *
 * @example
 * import { isPositive, unsafeFromString } from "effect/BigDecimal"
 *
 * assert.deepStrictEqual(isPositive(unsafeFromString("-1")), false)
 * assert.deepStrictEqual(isPositive(unsafeFromString("0")), false)
 * assert.deepStrictEqual(isPositive(unsafeFromString("1")), true)
 *
 * @since 2.0.0
 * @category predicates
 */
const isPositive = n => n.value > bigint0;
exports.isPositive = isPositive;
//# sourceMappingURL=BigDecimal.js.map