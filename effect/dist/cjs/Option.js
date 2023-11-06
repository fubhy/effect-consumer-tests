"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exports.contains = exports.containsWith = exports.liftPredicate = exports.lift2 = exports.getOrder = exports.getEquivalence = exports.filter = exports.filterMap = exports.partitionMap = exports.toArray = exports.reduceCompact = exports.ap = exports.zipWith = exports.all = exports.productMany = exports.product = exports.tap = exports.zipLeft = exports.composeK = exports.zipRight = exports.flatten = exports.flatMapNullable = exports.flatMap = exports.unit = exports.asUnit = exports.as = exports.map = exports.getOrThrow = exports.getOrThrowWith = exports.liftThrowable = exports.getOrUndefined = exports.getOrNull = exports.liftNullable = exports.fromNullable = exports.firstSomeOf = exports.orElseEither = exports.orElse = exports.getOrElse = exports.getLeft = exports.getRight = exports.fromIterable = exports.toRefinement = exports.match = exports.isSome = exports.isNone = exports.isOption = exports.some = exports.none = exports.TypeId = void 0;
exports.gen = exports.Do = exports.bind = exports.let = exports.bindTo = void 0;
const Equal = /*#__PURE__*/require("./Equal.js");
const Equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const either = /*#__PURE__*/require("./internal/either.js");
const option = /*#__PURE__*/require("./internal/option.js");
const order = /*#__PURE__*/require("./Order.js");
const Gen = /*#__PURE__*/require("./Utils.js");
/**
 * @category symbols
 * @since 2.0.0
 */
exports.TypeId = /*#__PURE__*/Symbol.for("effect/Option");
/**
 * Creates a new `Option` that represents the absence of a value.
 *
 * @category constructors
 * @since 2.0.0
 */
const none = () => option.none;
exports.none = none;
/**
 * Creates a new `Option` that wraps the given value.
 *
 * @param value - The value to wrap.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.some = option.some;
/**
 * Tests if a value is a `Option`.
 *
 * @param input - The value to check.
 *
 * @example
 * import { some, none, isOption } from 'effect/Option'
 *
 * assert.deepStrictEqual(isOption(some(1)), true)
 * assert.deepStrictEqual(isOption(none()), true)
 * assert.deepStrictEqual(isOption({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isOption = option.isOption;
/**
 * Determine if a `Option` is a `None`.
 *
 * @param self - The `Option` to check.
 *
 * @example
 * import { some, none, isNone } from 'effect/Option'
 *
 * assert.deepStrictEqual(isNone(some(1)), false)
 * assert.deepStrictEqual(isNone(none()), true)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isNone = option.isNone;
/**
 * Determine if a `Option` is a `Some`.
 *
 * @param self - The `Option` to check.
 *
 * @example
 * import { some, none, isSome } from 'effect/Option'
 *
 * assert.deepStrictEqual(isSome(some(1)), true)
 * assert.deepStrictEqual(isSome(none()), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isSome = option.isSome;
/**
 * Matches the given `Option` and returns either the provided `onNone` value or the result of the provided `onSome`
 * function when passed the `Option`'s value.
 *
 * @param self - The `Option` to match
 * @param onNone - The value to be returned if the `Option` is `None`
 * @param onSome - The function to be called if the `Option` is `Some`, it will be passed the `Option`'s value and its result will be returned
 *
 * @example
 * import { some, none, match } from 'effect/Option'
 * import { pipe } from "effect/Function"
 *
 * assert.deepStrictEqual(
 *   pipe(some(1), match({ onNone: () => 'a none', onSome: (a) => `a some containing ${a}` })),
 *   'a some containing 1'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(none(), match({ onNone: () => 'a none', onSome: (a) => `a some containing ${a}` })),
 *   'a none'
 * )
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onNone,
  onSome
}) => (0, exports.isNone)(self) ? onNone() : onSome(self.value));
/**
 * Returns a type guard from a `Option` returning function.
 * This function ensures that a type guard definition is type-safe.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * const parsePositive = (n: number): O.Option<number> =>
 *   n > 0 ? O.some(n) : O.none()
 *
 * const isPositive = O.toRefinement(parsePositive)
 *
 * assert.deepStrictEqual(isPositive(1), true)
 * assert.deepStrictEqual(isPositive(-1), false)
 *
 * @category conversions
 * @since 2.0.0
 */
const toRefinement = f => a => (0, exports.isSome)(f(a));
exports.toRefinement = toRefinement;
/**
 * Converts an `Iterable` of values into an `Option`. Returns the first value of the `Iterable` wrapped in a `Some`
 * if the `Iterable` is not empty, otherwise returns `None`.
 *
 * @param collection - The `Iterable` to be converted to an `Option`.
 *
 * @example
 * import { fromIterable, some, none } from 'effect/Option'
 *
 * assert.deepStrictEqual(fromIterable([1, 2, 3]), some(1))
 * assert.deepStrictEqual(fromIterable([]), none())
 *
 * @category conversions
 * @since 2.0.0
 */
const fromIterable = collection => {
  for (const a of collection) {
    return (0, exports.some)(a);
  }
  return (0, exports.none)();
};
exports.fromIterable = fromIterable;
/**
 * Converts a `Either` to an `Option` discarding the error.
 *
 * Alias of {@link fromEither}.
 *
 * @example
 * import * as O from "effect/Option"
 * import * as E from "effect/Either"
 *
 * assert.deepStrictEqual(O.getRight(E.right('ok')), O.some('ok'))
 * assert.deepStrictEqual(O.getRight(E.left('err')), O.none())
 *
 * @category conversions
 * @since 2.0.0
 */
exports.getRight = either.getRight;
/**
 * Converts a `Either` to an `Option` discarding the value.
 *
 * @example
 * import * as O from "effect/Option"
 * import * as E from "effect/Either"
 *
 * assert.deepStrictEqual(O.getLeft(E.right("ok")), O.none())
 * assert.deepStrictEqual(O.getLeft(E.left("a")), O.some("a"))
 *
 * @category conversions
 * @since 2.0.0
 */
exports.getLeft = either.getLeft;
/**
 * Returns the value of the `Option` if it is `Some`, otherwise returns `onNone`
 *
 * @param self - The `Option` to get the value of.
 * @param onNone - Function that returns the default value to return if the `Option` is `None`.
 *
 * @example
 * import { some, none, getOrElse } from 'effect/Option'
 * import { pipe } from "effect/Function"
 *
 * assert.deepStrictEqual(pipe(some(1), getOrElse(() => 0)), 1)
 * assert.deepStrictEqual(pipe(none(), getOrElse(() => 0)), 0)
 *
 * @category getters
 * @since 2.0.0
 */
exports.getOrElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, onNone) => (0, exports.isNone)(self) ? onNone() : self.value);
/**
 * Returns the provided `Option` `that` if `self` is `None`, otherwise returns `self`.
 *
 * @param self - The first `Option` to be checked.
 * @param that - The `Option` to return if `self` is `None`.
 *
 * @example
 * import * as O from "effect/Option"
 * import { pipe } from "effect/Function"
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none(),
 *     O.orElse(() => O.none())
 *   ),
 *   O.none()
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.orElse(() => O.none())
 *   ),
 *   O.some('a')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none(),
 *     O.orElse(() => O.some('b'))
 *   ),
 *   O.some('b')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.orElse(() => O.some('b'))
 *   ),
 *   O.some('a')
 * )
 *
 * @category error handling
 * @since 2.0.0
 */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.isNone)(self) ? that() : self);
/**
 * Similar to `orElse`, but instead of returning a simple union, it returns an `Either` object,
 * which contains information about which of the two `Option`s has been chosen.
 *
 * This is useful when it's important to know whether the value was retrieved from the first `Option` or the second option.
 *
 * @param self - The first `Option` to be checked.
 * @param that - The second `Option` to be considered if the first `Option` is `None`.
 *
 * @category error handling
 * @since 2.0.0
 */
exports.orElseEither = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.isNone)(self) ? (0, exports.map)(that(), either.right) : (0, exports.map)(self, either.left));
/**
 * Given an `Iterable` collection of `Option`s, returns the first `Some` found in the collection.
 *
 * @param collection - An iterable collection of `Option` to be searched.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * assert.deepStrictEqual(O.firstSomeOf([O.none(), O.some(1), O.some(2)]), O.some(1))
 *
 * @category error handling
 * @since 2.0.0
 */
const firstSomeOf = collection => {
  let out = (0, exports.none)();
  for (out of collection) {
    if ((0, exports.isSome)(out)) {
      return out;
    }
  }
  return out;
};
exports.firstSomeOf = firstSomeOf;
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @param nullableValue - The nullable value to be converted to an `Option`.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * assert.deepStrictEqual(O.fromNullable(undefined), O.none())
 * assert.deepStrictEqual(O.fromNullable(null), O.none())
 * assert.deepStrictEqual(O.fromNullable(1), O.some(1))
 *
 * @category conversions
 * @since 2.0.0
 */
const fromNullable = nullableValue => nullableValue == null ? (0, exports.none)() : (0, exports.some)(nullableValue);
exports.fromNullable = fromNullable;
/**
 * This API is useful for lifting a function that returns `null` or `undefined` into the `Option` context.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * const parse = (s: string): number | undefined => {
 *   const n = parseFloat(s)
 *   return isNaN(n) ? undefined : n
 * }
 *
 * const parseOption = O.liftNullable(parse)
 *
 * assert.deepStrictEqual(parseOption('1'), O.some(1))
 * assert.deepStrictEqual(parseOption('not a number'), O.none())
 *
 * @category conversions
 * @since 2.0.0
 */
const liftNullable = f => (...a) => (0, exports.fromNullable)(f(...a));
exports.liftNullable = liftNullable;
/**
 * Returns the value of the `Option` if it is a `Some`, otherwise returns `null`.
 *
 * @param self - The `Option` to extract the value from.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * assert.deepStrictEqual(O.getOrNull(O.some(1)), 1)
 * assert.deepStrictEqual(O.getOrNull(O.none()), null)
 *
 * @category getters
 * @since 2.0.0
 */
exports.getOrNull = /*#__PURE__*/(0, exports.getOrElse)(Function_js_1.constNull);
/**
 * Returns the value of the `Option` if it is a `Some`, otherwise returns `undefined`.
 *
 * @param self - The `Option` to extract the value from.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * assert.deepStrictEqual(O.getOrUndefined(O.some(1)), 1)
 * assert.deepStrictEqual(O.getOrUndefined(O.none()), undefined)
 *
 * @category getters
 * @since 2.0.0
 */
exports.getOrUndefined = /*#__PURE__*/(0, exports.getOrElse)(Function_js_1.constUndefined);
/**
 * A utility function that lifts a function that throws exceptions into a function that returns an `Option`.
 *
 * This function is useful for any function that might throw an exception, allowing the developer to handle
 * the exception in a more functional way.
 *
 * @param f - the function that can throw exceptions.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * const parse = O.liftThrowable(JSON.parse)
 *
 * assert.deepStrictEqual(parse("1"), O.some(1))
 * assert.deepStrictEqual(parse(""), O.none())
 *
 * @category conversions
 * @since 2.0.0
 */
const liftThrowable = f => (...a) => {
  try {
    return (0, exports.some)(f(...a));
  } catch (e) {
    return (0, exports.none)();
  }
};
exports.liftThrowable = liftThrowable;
/**
 * Extracts the value of an `Option` or throws if the `Option` is `None`.
 *
 * If a default error is sufficient for your use case and you don't need to configure the thrown error, see {@link getOrThrow}.
 *
 * @param self - The `Option` to extract the value from.
 * @param onNone - A function that will be called if the `Option` is `None`. It returns the error to be thrown.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * assert.deepStrictEqual(
 *   O.getOrThrowWith(O.some(1), () => new Error('Unexpected None')),
 *   1
 * )
 * assert.throws(() => O.getOrThrowWith(O.none(), () => new Error('Unexpected None')))
 *
 * @category conversions
 * @since 2.0.0
 */
exports.getOrThrowWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, onNone) => {
  if ((0, exports.isSome)(self)) {
    return self.value;
  }
  throw onNone();
});
/**
 * Extracts the value of an `Option` or throws if the `Option` is `None`.
 *
 * The thrown error is a default error. To configure the error thrown, see  {@link getOrThrowWith}.
 *
 * @param self - The `Option` to extract the value from.
 * @throws `Error("getOrThrow called on a None")`
 *
 * @example
 * import * as O from "effect/Option"
 *
 * assert.deepStrictEqual(O.getOrThrow(O.some(1)), 1)
 * assert.throws(() => O.getOrThrow(O.none()))
 *
 * @category conversions
 * @since 2.0.0
 */
exports.getOrThrow = /*#__PURE__*/(0, exports.getOrThrowWith)(() => new Error("getOrThrow called on a None"));
/**
 * Maps the `Some` side of an `Option` value to a new `Option` value.
 *
 * @param self - An `Option` to map
 * @param f - The function to map over the value of the `Option`
 *
 * @category transforming
 * @since 2.0.0
 */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.isNone)(self) ? (0, exports.none)() : (0, exports.some)(f(self.value)));
/**
 * Maps the `Some` value of this `Option` to the specified constant value.
 *
 * @category transforming
 * @since 2.0.0
 */
exports.as = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, b) => (0, exports.map)(self, () => b));
/**
 * Maps the `Some` value of this `Option` to the `void` constant value.
 *
 * This is useful when the value of the `Option` is not needed, but the presence or absence of the value is important.
 *
 * @category transforming
 * @since 2.0.0
 */
exports.asUnit = /*#__PURE__*/(0, exports.as)(undefined);
/**
 * @since 2.0.0
 */
exports.unit = /*#__PURE__*/(0, exports.some)(undefined);
/**
 * Applies a function to the value of an `Option` and flattens the result, if the input is `Some`.
 *
 * @category transforming
 * @since 2.0.0
 */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.isNone)(self) ? (0, exports.none)() : f(self.value));
/**
 * This is `flatMap` + `fromNullable`, useful when working with optional values.
 *
 * @example
 * import { some, none, flatMapNullable } from 'effect/Option'
 * import { pipe } from "effect/Function"
 *
 * interface Employee {
 *   company?: {
 *     address?: {
 *       street?: {
 *         name?: string
 *       }
 *     }
 *   }
 * }
 *
 * const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     some(employee1),
 *     flatMapNullable(employee => employee.company?.address?.street?.name),
 *   ),
 *   some('high street')
 * )
 *
 * const employee2: Employee = { company: { address: { street: {} } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     some(employee2),
 *     flatMapNullable(employee => employee.company?.address?.street?.name),
 *   ),
 *   none()
 * )
 *
 * @category transforming
 * @since 2.0.0
 */
exports.flatMapNullable = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.isNone)(self) ? (0, exports.none)() : (0, exports.fromNullable)(f(self.value)));
/**
 * @category transforming
 * @since 2.0.0
 */
exports.flatten = /*#__PURE__*/(0, exports.flatMap)(Function_js_1.identity);
/**
 * @category transforming
 * @since 2.0.0
 */
exports.zipRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.flatMap)(self, () => that));
/**
 * @category transforming
 * @since 2.0.0
 */
exports.composeK = /*#__PURE__*/(0, Function_js_1.dual)(2, (afb, bfc) => a => (0, exports.flatMap)(afb(a), bfc));
/**
 * Sequences the specified `that` `Option` but ignores its value.
 *
 * It is useful when we want to chain multiple operations, but only care about the result of `self`.
 *
 * @param that - The `Option` that will be ignored in the chain and discarded
 * @param self - The `Option` we care about
 *
 * @category transforming
 * @since 2.0.0
 */
exports.zipLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.tap)(self, () => that));
/**
 * Applies the provided function `f` to the value of the `Option` if it is `Some` and returns the original `Option`
 * unless `f` returns `None`, in which case it returns `None`.
 *
 * This function is useful for performing additional computations on the value of the input `Option` without affecting its value.
 *
 * @param f - Function to apply to the value of the `Option` if it is `Some`
 * @param self - The `Option` to apply the function to
 *
 * @example
 * import * as O from "effect/Option"
 *
 * const getInteger = (n: number) => Number.isInteger(n) ? O.some(n) : O.none()
 *
 * assert.deepStrictEqual(O.tap(O.none(), getInteger), O.none())
 * assert.deepStrictEqual(O.tap(O.some(1), getInteger), O.some(1))
 * assert.deepStrictEqual(O.tap(O.some(1.14), getInteger), O.none())
 *
 * @category transforming
 * @since 2.0.0
 */
exports.tap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flatMap)(self, a => (0, exports.map)(f(a), () => a)));
/**
 * @category combining
 * @since 2.0.0
 */
const product = (self, that) => (0, exports.isSome)(self) && (0, exports.isSome)(that) ? (0, exports.some)([self.value, that.value]) : (0, exports.none)();
exports.product = product;
/**
 * @category combining
 * @since 2.0.0
 */
const productMany = (self, collection) => {
  if ((0, exports.isNone)(self)) {
    return (0, exports.none)();
  }
  const out = [self.value];
  for (const o of collection) {
    if ((0, exports.isNone)(o)) {
      return (0, exports.none)();
    }
    out.push(o.value);
  }
  return (0, exports.some)(out);
};
exports.productMany = productMany;
/**
 * Takes a structure of `Option`s and returns an `Option` of values with the same structure.
 *
 * - If a tuple is supplied, then the returned `Option` will contain a tuple with the same length.
 * - If a struct is supplied, then the returned `Option` will contain a struct with the same keys.
 * - If an iterable is supplied, then the returned `Option` will contain an array.
 *
 * @param fields - the struct of `Option`s to be sequenced.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * assert.deepStrictEqual(O.all([O.some(1), O.some(2)]), O.some([1, 2]))
 * assert.deepStrictEqual(O.all({ a: O.some(1), b: O.some("hello") }), O.some({ a: 1, b: "hello" }))
 * assert.deepStrictEqual(O.all({ a: O.some(1), b: O.none() }), O.none())
 *
 * @category combining
 * @since 2.0.0
 */
// @ts-expect-error
const all = input => {
  if (Symbol.iterator in input) {
    const out = [];
    for (const o of input) {
      if ((0, exports.isNone)(o)) {
        return (0, exports.none)();
      }
      out.push(o.value);
    }
    return (0, exports.some)(out);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const o = input[key];
    if ((0, exports.isNone)(o)) {
      return (0, exports.none)();
    }
    out[key] = o.value;
  }
  return (0, exports.some)(out);
};
exports.all = all;
/**
 * Zips two `Option` values together using a provided function, returning a new `Option` of the result.
 *
 * @param self - The left-hand side of the zip operation
 * @param that - The right-hand side of the zip operation
 * @param f - The function used to combine the values of the two `Option`s
 *
 * @example
 * import * as O from "effect/Option"
 *
 * type Complex = [number, number]
 *
 * const complex = (real: number, imaginary: number): Complex => [real, imaginary]
 *
 * assert.deepStrictEqual(O.zipWith(O.none(), O.none(), complex), O.none())
 * assert.deepStrictEqual(O.zipWith(O.some(1), O.none(), complex), O.none())
 * assert.deepStrictEqual(O.zipWith(O.none(), O.some(1), complex), O.none())
 * assert.deepStrictEqual(O.zipWith(O.some(1), O.some(2), complex), O.some([1, 2]))
 *
 * assert.deepStrictEqual(O.zipWith(O.some(1), complex)(O.some(2)), O.some([2, 1]))
 *
 * @category combining
 * @since 2.0.0
 */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.map)((0, exports.product)(self, that), ([a, b]) => f(a, b)));
/**
 * @category combining
 * @since 2.0.0
 */
exports.ap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWith)(self, that, (f, a) => f(a)));
/**
 * Reduces an `Iterable` of `Option<A>` to a single value of type `B`, elements that are `None` are ignored.
 *
 * @param self - The Iterable of `Option<A>` to be reduced.
 * @param b - The initial value of the accumulator.
 * @param f - The reducing function that takes the current accumulator value and the unwrapped value of an `Option<A>`.
 *
 * @example
 * import { some, none, reduceCompact } from 'effect/Option'
 * import { pipe } from "effect/Function"
 *
 * const iterable = [some(1), none(), some(2), none()]
 * assert.deepStrictEqual(pipe(iterable, reduceCompact(0, (b, a) => b + a)), 3)
 *
 * @category folding
 * @since 2.0.0
 */
exports.reduceCompact = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, b, f) => {
  let out = b;
  for (const oa of self) {
    if ((0, exports.isSome)(oa)) {
      out = f(out, oa.value);
    }
  }
  return out;
});
/**
 * Transforms an `Option` into an `Array`.
 * If the input is `None`, an empty array is returned.
 * If the input is `Some`, the value is wrapped in an array.
 *
 * @param self - The `Option` to convert to an array.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * assert.deepStrictEqual(O.toArray(O.some(1)), [1])
 * assert.deepStrictEqual(O.toArray(O.none()), [])
 *
 * @category conversions
 * @since 2.0.0
 */
const toArray = self => (0, exports.isNone)(self) ? [] : [self.value];
exports.toArray = toArray;
/**
 * @category filtering
 * @since 2.0.0
 */
exports.partitionMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  if ((0, exports.isNone)(self)) {
    return [(0, exports.none)(), (0, exports.none)()];
  }
  const e = f(self.value);
  return either.isLeft(e) ? [(0, exports.some)(e.left), (0, exports.none)()] : [(0, exports.none)(), (0, exports.some)(e.right)];
});
/**
 * Maps over the value of an `Option` and filters out `None`s.
 *
 * Useful when in addition to filtering you also want to change the type of the `Option`.
 *
 * @param self - The `Option` to map over.
 * @param f - A function to apply to the value of the `Option`.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * const evenNumber = (n: number) => n % 2 === 0 ? O.some(n) : O.none()
 *
 * assert.deepStrictEqual(O.filterMap(O.none(), evenNumber), O.none())
 * assert.deepStrictEqual(O.filterMap(O.some(3), evenNumber), O.none())
 * assert.deepStrictEqual(O.filterMap(O.some(2), evenNumber), O.some(2))
 *
 * @category filtering
 * @since 2.0.0
 */
exports.filterMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.isNone)(self) ? (0, exports.none)() : f(self.value));
/**
 * Filters an `Option` using a predicate. If the predicate is not satisfied or the `Option` is `None` returns `None`.
 *
 * If you need to change the type of the `Option` in addition to filtering, see `filterMap`.
 *
 * @param predicate - A predicate function to apply to the `Option` value.
 * @param fb - The `Option` to filter.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * // predicate
 * const isEven = (n: number) => n % 2 === 0
 *
 * assert.deepStrictEqual(O.filter(O.none(), isEven), O.none())
 * assert.deepStrictEqual(O.filter(O.some(3), isEven), O.none())
 * assert.deepStrictEqual(O.filter(O.some(2), isEven), O.some(2))
 *
 * // refinement
 * const isNumber = (v: unknown): v is number => typeof v === "number"
 *
 * assert.deepStrictEqual(O.filter(O.none(), isNumber), O.none())
 * assert.deepStrictEqual(O.filter(O.some('hello'), isNumber), O.none())
 * assert.deepStrictEqual(O.filter(O.some(2), isNumber), O.some(2))
 *
 * @category filtering
 * @since 2.0.0
 */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.filterMap)(self, b => predicate(b) ? option.some(b) : option.none));
/**
 * @example
 * import { none, some, getEquivalence } from 'effect/Option'
 * import * as N from 'effect/Number'
 *
 * const isEquivalent = getEquivalence(N.Equivalence)
 * assert.deepStrictEqual(isEquivalent(none(), none()), true)
 * assert.deepStrictEqual(isEquivalent(none(), some(1)), false)
 * assert.deepStrictEqual(isEquivalent(some(1), none()), false)
 * assert.deepStrictEqual(isEquivalent(some(1), some(2)), false)
 * assert.deepStrictEqual(isEquivalent(some(1), some(1)), true)
 *
 * @category equivalence
 * @since 2.0.0
 */
const getEquivalence = isEquivalent => Equivalence.make((x, y) => x === y || ((0, exports.isNone)(x) ? (0, exports.isNone)(y) : (0, exports.isNone)(y) ? false : isEquivalent(x.value, y.value)));
exports.getEquivalence = getEquivalence;
/**
 * The `Order` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Order` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 * @example
 * import { none, some, getOrder } from 'effect/Option'
 * import * as N from 'effect/Number'
 * import { pipe } from "effect/Function"
 *
 * const O = getOrder(N.Order)
 * assert.deepStrictEqual(O(none(), none()), 0)
 * assert.deepStrictEqual(O(none(), some(1)), -1)
 * assert.deepStrictEqual(O(some(1), none()), 1)
 * assert.deepStrictEqual(O(some(1), some(2)), -1)
 * assert.deepStrictEqual(O(some(1), some(1)), 0)
 *
 * @category sorting
 * @since 2.0.0
 */
const getOrder = O => order.make((self, that) => (0, exports.isSome)(self) ? (0, exports.isSome)(that) ? O(self.value, that.value) : 1 : -1);
exports.getOrder = getOrder;
/**
 * Lifts a binary function into `Option`.
 *
 * @param f - The function to lift.
 *
 * @category lifting
 * @since 2.0.0
 */
const lift2 = f => (0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWith)(self, that, f));
exports.lift2 = lift2;
/**
 * Transforms a `Predicate` function into a `Some` of the input value if the predicate returns `true` or `None`
 * if the predicate returns `false`.
 *
 * @param predicate - A `Predicate` function that takes in a value of type `A` and returns a boolean.
 *
 * @example
 * import * as O from "effect/Option"
 *
 * const getOption = O.liftPredicate((n: number) => n >= 0)
 *
 * assert.deepStrictEqual(getOption(-1), O.none())
 * assert.deepStrictEqual(getOption(1), O.some(1))
 *
 * @category lifting
 * @since 2.0.0
 */
const liftPredicate = predicate => b => predicate(b) ? (0, exports.some)(b) : (0, exports.none)();
exports.liftPredicate = liftPredicate;
/**
 * Returns a function that checks if a `Option` contains a given value using a provided `isEquivalent` function.
 *
 * @param equivalent - An `Equivalence` instance to compare values of the `Option`.
 * @param self - The `Option` to apply the comparison to.
 * @param a - The value to compare against the `Option`.
 *
 * @example
 * import { some, none, containsWith } from 'effect/Option'
 * import { Equivalence } from 'effect/Number'
 * import { pipe } from "effect/Function"
 *
 * assert.deepStrictEqual(pipe(some(2), containsWith(Equivalence)(2)), true)
 * assert.deepStrictEqual(pipe(some(1), containsWith(Equivalence)(2)), false)
 * assert.deepStrictEqual(pipe(none(), containsWith(Equivalence)(2)), false)
 *
 * @category elements
 * @since 2.0.0
 */
const containsWith = isEquivalent => (0, Function_js_1.dual)(2, (self, a) => (0, exports.isNone)(self) ? false : isEquivalent(self.value, a));
exports.containsWith = containsWith;
const _equivalence = /*#__PURE__*/Equal.equivalence();
/**
 * Returns a function that checks if an `Option` contains a given value using the default `Equivalence`.
 *
 * @category elements
 * @since 2.0.0
 */
exports.contains = /*#__PURE__*/(0, exports.containsWith)(_equivalence);
/**
 * Check if a value in an `Option` type meets a certain predicate.
 *
 * @param self - The `Option` to check.
 * @param predicate - The condition to check.
 *
 * @example
 * import { some, none, exists } from 'effect/Option'
 * import { pipe } from "effect/Function"
 *
 * const isEven = (n: number) => n % 2 === 0
 *
 * assert.deepStrictEqual(pipe(some(2), exists(isEven)), true)
 * assert.deepStrictEqual(pipe(some(1), exists(isEven)), false)
 * assert.deepStrictEqual(pipe(none(), exists(isEven)), false)
 *
 * @since 2.0.0
 */
exports.exists = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.isNone)(self) ? false : predicate(self.value));
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @category do notation
 * @since 2.0.0
 */
exports.bindTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, name) => (0, exports.map)(self, a => ({
  [name]: a
})));
const let_ = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, name, f) => (0, exports.map)(self, a => Object.assign({}, a, {
  [name]: f(a)
})));
exports.let = let_;
/**
 * @category do notation
 * @since 2.0.0
 */
exports.bind = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, name, f) => (0, exports.flatMap)(self, a => (0, exports.map)(f(a), b => Object.assign({}, a, {
  [name]: b
}))));
/**
 * @category do notation
 * @since 2.0.0
 */
exports.Do = /*#__PURE__*/(0, exports.some)({});
const adapter = /*#__PURE__*/Gen.adapter();
/**
 * @category generators
 * @since 2.0.0
 */
const gen = f => {
  const iterator = f(adapter);
  let state = iterator.next();
  if (state.done) {
    return (0, exports.some)(state.value);
  } else {
    let current = state.value.value;
    if ((0, exports.isNone)(current)) {
      return current;
    }
    while (!state.done) {
      state = iterator.next(current.value);
      if (!state.done) {
        current = state.value.value;
        if ((0, exports.isNone)(current)) {
          return current;
        }
      }
    }
    return (0, exports.some)(state.value);
  }
};
exports.gen = gen;
//# sourceMappingURL=Option.js.map