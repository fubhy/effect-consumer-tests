"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.some = exports.every = exports.nand = exports.nor = exports.implies = exports.eqv = exports.xor = exports.and = exports.or = exports.not = exports.struct = exports.tuple = exports.productMany = exports.all = exports.product = exports.compose = exports.isReadonlyRecord = exports.isRecord = exports.isIterable = exports.isDate = exports.isUint8Array = exports.isError = exports.isNotNullable = exports.isNullable = exports.isTagged = exports.hasProperty = exports.isObject = exports.isUnknown = exports.isNever = exports.isNotNull = exports.isNull = exports.isNotUndefined = exports.isUndefined = exports.isFunction = exports.isSymbol = exports.isBigInt = exports.isBoolean = exports.isNumber = exports.isString = exports.mapInput = void 0;
/**
 * @since 2.0.0
 */
const Function_js_1 = /*#__PURE__*/require("./Function.js");
/**
 * Given a `Predicate<A>` returns a `Predicate<B>`
 *
 * @param self - the `Predicate<A>` to be transformed to `Predicate<B>`.
 * @param f - a function to transform `B` to `A`.
 *
 * @example
 * import * as P from "effect/Predicate"
 * import * as N from "effect/Number"
 *
 * const minLength3 = P.mapInput(N.greaterThan(2), (s: string) => s.length)
 *
 * assert.deepStrictEqual(minLength3("a"), false)
 * assert.deepStrictEqual(minLength3("aa"), false)
 * assert.deepStrictEqual(minLength3("aaa"), true)
 * assert.deepStrictEqual(minLength3("aaaa"), true)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.mapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => b => self(f(b)));
/**
 * Tests if a value is a `string`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isString } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isString("a"), true)
 *
 * assert.deepStrictEqual(isString(1), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isString = input => typeof input === "string";
exports.isString = isString;
/**
 * Tests if a value is a `number`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNumber } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNumber(2), true)
 *
 * assert.deepStrictEqual(isNumber("2"), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isNumber = input => typeof input === "number";
exports.isNumber = isNumber;
/**
 * Tests if a value is a `boolean`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isBoolean } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isBoolean(true), true)
 *
 * assert.deepStrictEqual(isBoolean("true"), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isBoolean = input => typeof input === "boolean";
exports.isBoolean = isBoolean;
/**
 * Tests if a value is a `bigint`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isBigInt } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isBigInt(1n), true)
 *
 * assert.deepStrictEqual(isBigInt(1), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isBigInt = input => typeof input === "bigint";
exports.isBigInt = isBigInt;
/**
 * Tests if a value is a `symbol`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isSymbol } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isSymbol(Symbol.for("a")), true)
 *
 * assert.deepStrictEqual(isSymbol("a"), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isSymbol = input => typeof input === "symbol";
exports.isSymbol = isSymbol;
/**
 * Tests if a value is a `function`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isFunction } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isFunction(isFunction), true)
 *
 * assert.deepStrictEqual(isFunction("function"), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isFunction = Function_js_1.isFunction;
/**
 * Tests if a value is `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isUndefined } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isUndefined(undefined), true)
 *
 * assert.deepStrictEqual(isUndefined(null), false)
 * assert.deepStrictEqual(isUndefined("undefined"), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isUndefined = input => input === undefined;
exports.isUndefined = isUndefined;
/**
 * Tests if a value is not `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNotUndefined } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNotUndefined(null), true)
 * assert.deepStrictEqual(isNotUndefined("undefined"), true)
 *
 * assert.deepStrictEqual(isNotUndefined(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isNotUndefined = input => input !== undefined;
exports.isNotUndefined = isNotUndefined;
/**
 * Tests if a value is `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNull } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNull(null), true)
 *
 * assert.deepStrictEqual(isNull(undefined), false)
 * assert.deepStrictEqual(isNull("null"), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isNull = input => input === null;
exports.isNull = isNull;
/**
 * Tests if a value is not `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNotNull } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNotNull(undefined), true)
 * assert.deepStrictEqual(isNotNull("null"), true)
 *
 * assert.deepStrictEqual(isNotNull(null), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isNotNull = input => input !== null;
exports.isNotNull = isNotNull;
/**
 * A guard that always fails.
 *
 * @param _ - The value to test.
 *
 * @example
 * import { isNever } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNever(null), false)
 * assert.deepStrictEqual(isNever(undefined), false)
 * assert.deepStrictEqual(isNever({}), false)
 * assert.deepStrictEqual(isNever([]), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isNever = _ => false;
exports.isNever = isNever;
/**
 * A guard that always succeeds.
 *
 * @param _ - The value to test.
 *
 * @example
 * import { isUnknown } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isUnknown(null), true)
 * assert.deepStrictEqual(isUnknown(undefined), true)
 *
 * assert.deepStrictEqual(isUnknown({}), true)
 * assert.deepStrictEqual(isUnknown([]), true)
 *
 * @category guards
 * @since 2.0.0
 */
const isUnknown = _ => true;
exports.isUnknown = isUnknown;
/**
 * Tests if a value is an `object`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isObject } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isObject({}), true)
 * assert.deepStrictEqual(isObject([]), true)
 *
 * assert.deepStrictEqual(isObject(null), false)
 * assert.deepStrictEqual(isObject(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isObject = input => typeof input === "object" && input !== null || (0, exports.isFunction)(input);
exports.isObject = isObject;
/**
 * Checks whether a value is an `object` containing a specified property key.
 *
 * @param property - The field to check within the object.
 * @param self - The value to examine.
 *
 * @category guards
 * @since 2.0.0
 */
exports.hasProperty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, property) => (0, exports.isObject)(self) && property in self);
/**
 * Tests if a value is an `object` with a property `_tag` that matches the given tag.
 *
 * @param input - The value to test.
 * @param tag - The tag to test for.
 *
 * @example
 * import { isTagged } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isTagged(1, "a"), false)
 * assert.deepStrictEqual(isTagged(null, "a"), false)
 * assert.deepStrictEqual(isTagged({}, "a"), false)
 * assert.deepStrictEqual(isTagged({ a: "a" }, "a"), false)
 * assert.deepStrictEqual(isTagged({ _tag: "a" }, "a"), true)
 * assert.deepStrictEqual(isTagged("a")({ _tag: "a" }), true)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isTagged = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, tag) => (0, exports.hasProperty)(self, "_tag") && self["_tag"] === tag);
/**
 * A guard that succeeds when the input is `null` or `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNullable } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNullable(null), true)
 * assert.deepStrictEqual(isNullable(undefined), true)
 *
 * assert.deepStrictEqual(isNullable({}), false)
 * assert.deepStrictEqual(isNullable([]), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isNullable = input => input === null || input === undefined;
exports.isNullable = isNullable;
/**
 * A guard that succeeds when the input is not `null` or `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNotNullable } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNotNullable({}), true)
 * assert.deepStrictEqual(isNotNullable([]), true)
 *
 * assert.deepStrictEqual(isNotNullable(null), false)
 * assert.deepStrictEqual(isNotNullable(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isNotNullable = input => input !== null && input !== undefined;
exports.isNotNullable = isNotNullable;
/**
 * A guard that succeeds when the input is an `Error`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isError } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isError(new Error()), true)
 *
 * assert.deepStrictEqual(isError(null), false)
 * assert.deepStrictEqual(isError({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isError = input => input instanceof Error;
exports.isError = isError;
/**
 * A guard that succeeds when the input is a `Uint8Array`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isUint8Array } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isUint8Array(new Uint8Array()), true)
 *
 * assert.deepStrictEqual(isUint8Array(null), false)
 * assert.deepStrictEqual(isUint8Array({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isUint8Array = input => input instanceof Uint8Array;
exports.isUint8Array = isUint8Array;
/**
 * A guard that succeeds when the input is a `Date`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isDate } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isDate(new Date()), true)
 *
 * assert.deepStrictEqual(isDate(null), false)
 * assert.deepStrictEqual(isDate({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isDate = input => input instanceof Date;
exports.isDate = isDate;
/**
 * A guard that succeeds when the input is an `Iterable`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isIterable } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isIterable([]), true)
 * assert.deepStrictEqual(isIterable(new Set()), true)
 *
 * assert.deepStrictEqual(isIterable(null), false)
 * assert.deepStrictEqual(isIterable({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isIterable = input => (0, exports.hasProperty)(input, Symbol.iterator);
exports.isIterable = isIterable;
/**
 * A guard that succeeds when the input is a record.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isRecord } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isRecord({}), true)
 * assert.deepStrictEqual(isRecord({ a: 1 }), true)
 *
 * assert.deepStrictEqual(isRecord([]), false)
 * assert.deepStrictEqual(isRecord([1, 2, 3]), false)
 * assert.deepStrictEqual(isRecord(null), false)
 * assert.deepStrictEqual(isRecord(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isRecord = input => (0, exports.isObject)(input) && !Array.isArray(input);
exports.isRecord = isRecord;
/**
 * A guard that succeeds when the input is a readonly record.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isReadonlyRecord } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isReadonlyRecord({}), true)
 * assert.deepStrictEqual(isReadonlyRecord({ a: 1 }), true)
 *
 * assert.deepStrictEqual(isReadonlyRecord([]), false)
 * assert.deepStrictEqual(isReadonlyRecord([1, 2, 3]), false)
 * assert.deepStrictEqual(isReadonlyRecord(null), false)
 * assert.deepStrictEqual(isReadonlyRecord(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isReadonlyRecord = exports.isRecord;
/**
 * @since 2.0.0
 */
exports.compose = /*#__PURE__*/(0, Function_js_1.dual)(2, (ab, bc) => a => ab(a) && bc(a));
/**
 * @category combining
 * @since 2.0.0
 */
const product = (self, that) => ([a, b]) => self(a) && that(b);
exports.product = product;
/**
 * @category combining
 * @since 2.0.0
 */
const all = collection => {
  return as => {
    let collectionIndex = 0;
    for (const p of collection) {
      if (collectionIndex >= as.length) {
        break;
      }
      if (p(as[collectionIndex]) === false) {
        return false;
      }
      collectionIndex++;
    }
    return true;
  };
};
exports.all = all;
/**
 * @category combining
 * @since 2.0.0
 */
const productMany = (self, collection) => {
  const rest = (0, exports.all)(collection);
  return ([head, ...tail]) => self(head) === false ? false : rest(tail);
};
exports.productMany = productMany;
/**
 * Similar to `Promise.all` but operates on `Predicate`s.
 *
 * ```
 * [Predicate<A>, Predicate<B>, ...] -> Predicate<[A, B, ...]>
 * ```
 *
 * @since 2.0.0
 */
const tuple = (...elements) => (0, exports.all)(elements);
exports.tuple = tuple;
/**
 * @since 2.0.0
 */
const struct = fields => {
  const keys = Object.keys(fields);
  return a => {
    for (const key of keys) {
      if (!fields[key](a[key])) {
        return false;
      }
    }
    return true;
  };
};
exports.struct = struct;
/**
 * Negates the result of a given predicate.
 *
 * @param self - A predicate.
 *
 * @example
 * import * as P from "effect/Predicate"
 * import * as N from "effect/Number"
 *
 * const isPositive = P.not(N.lessThan(0))
 *
 * assert.deepStrictEqual(isPositive(-1), false)
 * assert.deepStrictEqual(isPositive(0), true)
 * assert.deepStrictEqual(isPositive(1), true)
 *
 * @category combinators
 * @since 2.0.0
 */
const not = self => a => !self(a);
exports.not = not;
/**
 * Combines two predicates into a new predicate that returns `true` if at least one of the predicates returns `true`.
 *
 * @param self - A predicate.
 * @param that - A predicate.
 *
 * @example
 * import * as P from "effect/Predicate"
 * import * as N from "effect/Number"
 *
 * const nonZero = P.or(N.lessThan(0), N.greaterThan(0))
 *
 * assert.deepStrictEqual(nonZero(-1), true)
 * assert.deepStrictEqual(nonZero(0), false)
 * assert.deepStrictEqual(nonZero(1), true)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.or = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => a => self(a) || that(a));
/**
 * Combines two predicates into a new predicate that returns `true` if both of the predicates returns `true`.
 *
 * @param self - A predicate.
 * @param that - A predicate.
 *
 * @example
 * import * as P from "effect/Predicate"
 *
 * const minLength = (n: number) => (s: string) => s.length >= n
 * const maxLength = (n: number) => (s: string) => s.length <= n
 *
 * const length = (n: number) => P.and(minLength(n), maxLength(n))
 *
 * assert.deepStrictEqual(length(2)("aa"), true)
 * assert.deepStrictEqual(length(2)("a"), false)
 * assert.deepStrictEqual(length(2)("aaa"), false)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.and = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => a => self(a) && that(a));
/**
 * @category combinators
 * @since 2.0.0
 */
exports.xor = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => a => self(a) !== that(a));
/**
 * @category combinators
 * @since 2.0.0
 */
exports.eqv = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => a => self(a) === that(a));
/**
 * @category combinators
 * @since 2.0.0
 */
exports.implies = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => a => self(a) ? that(a) : true);
/**
 * @category combinators
 * @since 2.0.0
 */
exports.nor = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => a => !(self(a) || that(a)));
/**
 * @category combinators
 * @since 2.0.0
 */
exports.nand = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => a => !(self(a) && that(a)));
/**
 * @category elements
 * @since 2.0.0
 */
const every = collection => a => {
  for (const p of collection) {
    if (!p(a)) {
      return false;
    }
  }
  return true;
};
exports.every = every;
/**
 * @category elements
 * @since 2.0.0
 */
const some = collection => a => {
  for (const p of collection) {
    if (p(a)) {
      return true;
    }
  }
  return false;
};
exports.some = some;
//# sourceMappingURL=Predicate.js.map