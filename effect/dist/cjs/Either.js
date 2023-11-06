"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gen = exports.reverse = exports.all = exports.ap = exports.zipWith = exports.flatMap = exports.orElse = exports.getOrThrow = exports.getOrThrowWith = exports.getOrUndefined = exports.getOrNull = exports.getOrElse = exports.merge = exports.match = exports.map = exports.mapLeft = exports.mapBoth = exports.getEquivalence = exports.getLeft = exports.getRight = exports.isRight = exports.isLeft = exports.isEither = exports.try = exports.fromOption = exports.fromNullable = exports.left = exports.right = exports.TypeId = void 0;
const Equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const either = /*#__PURE__*/require("./internal/either.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const Gen = /*#__PURE__*/require("./Utils.js");
/**
 * @category symbols
 * @since 2.0.0
 */
exports.TypeId = either.TypeId;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.right = either.right;
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.left = either.left;
/**
 * Takes a lazy default and a nullable value, if the value is not nully (`null` or `undefined`), turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import * as Either from 'effect/Either'
 *
 * assert.deepStrictEqual(Either.fromNullable(1, () => 'fallback'), Either.right(1))
 * assert.deepStrictEqual(Either.fromNullable(null, () => 'fallback'), Either.left('fallback'))
 *
 * @category constructors
 * @since 2.0.0
 */
exports.fromNullable = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, onNullable) => self == null ? (0, exports.left)(onNullable(self)) : (0, exports.right)(self));
/**
 * @example
 * import * as Either from 'effect/Either'
 * import * as Option from 'effect/Option'
 *
 * assert.deepStrictEqual(Either.fromOption(Option.some(1), () => 'error'), Either.right(1))
 * assert.deepStrictEqual(Either.fromOption(Option.none(), () => 'error'), Either.left('error'))
 *
 * @category constructors
 * @since 2.0.0
 */
exports.fromOption = either.fromOption;
const try_ = evaluate => {
  if ((0, Predicate_js_1.isFunction)(evaluate)) {
    try {
      return (0, exports.right)(evaluate());
    } catch (e) {
      return (0, exports.left)(e);
    }
  } else {
    try {
      return (0, exports.right)(evaluate.try());
    } catch (e) {
      return (0, exports.left)(evaluate.catch(e));
    }
  }
};
exports.try = try_;
/**
 * Tests if a value is a `Either`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isEither, left, right } from 'effect/Either'
 *
 * assert.deepStrictEqual(isEither(right(1)), true)
 * assert.deepStrictEqual(isEither(left("a")), true)
 * assert.deepStrictEqual(isEither({ right: 1 }), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isEither = either.isEither;
/**
 * Determine if a `Either` is a `Left`.
 *
 * @param self - The `Either` to check.
 *
 * @example
 * import { isLeft, left, right } from 'effect/Either'
 *
 * assert.deepStrictEqual(isLeft(right(1)), false)
 * assert.deepStrictEqual(isLeft(left("a")), true)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isLeft = either.isLeft;
/**
 * Determine if a `Either` is a `Right`.
 *
 * @param self - The `Either` to check.
 *
 * @example
 * import { isRight, left, right } from 'effect/Either'
 *
 * assert.deepStrictEqual(isRight(right(1)), true)
 * assert.deepStrictEqual(isRight(left("a")), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isRight = either.isRight;
/**
 * Converts a `Either` to an `Option` discarding the `Left`.
 *
 * Alias of {@link toOption}.
 *
 * @example
 * import * as O from 'effect/Option'
 * import * as E from 'effect/Either'
 *
 * assert.deepStrictEqual(E.getRight(E.right('ok')), O.some('ok'))
 * assert.deepStrictEqual(E.getRight(E.left('err')), O.none())
 *
 * @category getters
 * @since 2.0.0
 */
exports.getRight = either.getRight;
/**
 * Converts a `Either` to an `Option` discarding the value.
 *
 * @example
 * import * as O from 'effect/Option'
 * import * as E from 'effect/Either'
 *
 * assert.deepStrictEqual(E.getLeft(E.right('ok')), O.none())
 * assert.deepStrictEqual(E.getLeft(E.left('err')), O.some('err'))
 *
 * @category getters
 * @since 2.0.0
 */
exports.getLeft = either.getLeft;
/**
 * @category equivalence
 * @since 2.0.0
 */
const getEquivalence = (EE, EA) => Equivalence.make((x, y) => x === y || ((0, exports.isLeft)(x) ? (0, exports.isLeft)(y) && EE(x.left, y.left) : (0, exports.isRight)(y) && EA(x.right, y.right)));
exports.getEquivalence = getEquivalence;
/**
 * @category mapping
 * @since 2.0.0
 */
exports.mapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onLeft,
  onRight
}) => (0, exports.isLeft)(self) ? (0, exports.left)(onLeft(self.left)) : (0, exports.right)(onRight(self.right)));
/**
 * Maps the `Left` side of an `Either` value to a new `Either` value.
 *
 * @param self - The input `Either` value to map.
 * @param f - A transformation function to apply to the `Left` value of the input `Either`.
 *
 * @category mapping
 * @since 2.0.0
 */
exports.mapLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.isLeft)(self) ? (0, exports.left)(f(self.left)) : (0, exports.right)(self.right));
/**
 * Maps the `Right` side of an `Either` value to a new `Either` value.
 *
 * @param self - An `Either` to map
 * @param f - The function to map over the value of the `Either`
 *
 * @category mapping
 * @since 2.0.0
 */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.isRight)(self) ? (0, exports.right)(f(self.right)) : (0, exports.left)(self.left));
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the `onLeft function,
 * if the value is a `Right` the inner value is applied to the `onRight` function.
 *
 * @example
 * import * as E from 'effect/Either'
 * import { pipe } from 'effect/Function'
 *
 * const onLeft  = (strings: ReadonlyArray<string>): string => `strings: ${strings.join(', ')}`
 *
 * const onRight = (value: number): string => `Ok: ${value}`
 *
 * assert.deepStrictEqual(pipe(E.right(1), E.match({ onLeft, onRight })), 'Ok: 1')
 * assert.deepStrictEqual(
 *   pipe(E.left(['string 1', 'string 2']), E.match({ onLeft, onRight })),
 *   'strings: string 1, string 2'
 * )
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onLeft,
  onRight
}) => (0, exports.isLeft)(self) ? onLeft(self.left) : onRight(self.right));
/**
 * @category getters
 * @since 2.0.0
 */
exports.merge = /*#__PURE__*/(0, exports.match)({
  onLeft: Function_js_1.identity,
  onRight: Function_js_1.identity
});
/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import * as Either from 'effect/Either'
 *
 * assert.deepStrictEqual(Either.getOrElse(Either.right(1), (error) => error + "!"), 1)
 * assert.deepStrictEqual(Either.getOrElse(Either.left("not a number"), (error) => error + "!"), "not a number!")
 *
 * @category getters
 * @since 2.0.0
 */
exports.getOrElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, onLeft) => (0, exports.isLeft)(self) ? onLeft(self.left) : self.right);
/**
 * @example
 * import * as Either from 'effect/Either'
 *
 * assert.deepStrictEqual(Either.getOrNull(Either.right(1)), 1)
 * assert.deepStrictEqual(Either.getOrNull(Either.left("a")), null)
 *
 * @category getters
 * @since 2.0.0
 */
exports.getOrNull = /*#__PURE__*/(0, exports.getOrElse)(Function_js_1.constNull);
/**
 * @example
 * import * as Either from 'effect/Either'
 *
 * assert.deepStrictEqual(Either.getOrUndefined(Either.right(1)), 1)
 * assert.deepStrictEqual(Either.getOrUndefined(Either.left("a")), undefined)
 *
 * @category getters
 * @since 2.0.0
 */
exports.getOrUndefined = /*#__PURE__*/(0, exports.getOrElse)(Function_js_1.constUndefined);
/**
 * Extracts the value of an `Either` or throws if the `Either` is `Left`.
 *
 * If a default error is sufficient for your use case and you don't need to configure the thrown error, see {@link getOrThrow}.
 *
 * @param self - The `Either` to extract the value from.
 * @param onLeft - A function that will be called if the `Either` is `Left`. It returns the error to be thrown.
 *
 * @example
 * import * as E from "effect/Either"
 *
 * assert.deepStrictEqual(
 *   E.getOrThrowWith(E.right(1), () => new Error('Unexpected Left')),
 *   1
 * )
 * assert.throws(() => E.getOrThrowWith(E.left("error"), () => new Error('Unexpected Left')))
 *
 * @category getters
 * @since 2.0.0
 */
exports.getOrThrowWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, onLeft) => {
  if ((0, exports.isRight)(self)) {
    return self.right;
  }
  throw onLeft(self.left);
});
/**
 * Extracts the value of an `Either` or throws if the `Either` is `Left`.
 *
 * The thrown error is a default error. To configure the error thrown, see  {@link getOrThrowWith}.
 *
 * @param self - The `Either` to extract the value from.
 * @throws `Error("getOrThrow called on a Left")`
 *
 * @example
 * import * as E from "effect/Either"
 *
 * assert.deepStrictEqual(E.getOrThrow(E.right(1)), 1)
 * assert.throws(() => E.getOrThrow(E.left("error")))
 *
 * @category getters
 * @since 2.0.0
 */
exports.getOrThrow = /*#__PURE__*/(0, exports.getOrThrowWith)(() => new Error("getOrThrow called on a Left"));
/**
 * Returns `self` if it is a `Right` or `that` otherwise.
 *
 * @param self - The input `Either` value to check and potentially return.
 * @param that - A function that takes the error value from `self` (if it's a `Left`) and returns a new `Either` value.
 *
 * @category error handling
 * @since 2.0.0
 */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.isLeft)(self) ? that(self.left) : (0, exports.right)(self.right));
/**
 * @category combining
 * @since 2.0.0
 */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.isLeft)(self) ? (0, exports.left)(self.left) : f(self.right));
/**
 * @since 2.0.0
 * @category combining
 */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.flatMap)(self, a => (0, exports.map)(that, b => f(a, b))));
/**
 * @category combining
 * @since 2.0.0
 */
exports.ap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWith)(self, that, (f, a) => f(a)));
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
 * import * as Either from "effect/Either"
 *
 * assert.deepStrictEqual(Either.all([Either.right(1), Either.right(2)]), Either.right([1, 2]))
 * assert.deepStrictEqual(Either.all({ a: Either.right(1), b: Either.right("hello") }), Either.right({ a: 1, b: "hello" }))
 * assert.deepStrictEqual(Either.all({ a: Either.right(1), b: Either.left("error") }), Either.left("error"))
 *
 * @category combining
 * @since 2.0.0
 */
// @ts-expect-error
const all = input => {
  if (Symbol.iterator in input) {
    const out = [];
    for (const e of input) {
      if ((0, exports.isLeft)(e)) {
        return e;
      }
      out.push(e.right);
    }
    return (0, exports.right)(out);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const e = input[key];
    if ((0, exports.isLeft)(e)) {
      return e;
    }
    out[key] = e.right;
  }
  return (0, exports.right)(out);
};
exports.all = all;
/**
 * @since 2.0.0
 */
const reverse = self => (0, exports.isLeft)(self) ? (0, exports.right)(self.left) : (0, exports.left)(self.right);
exports.reverse = reverse;
const adapter = /*#__PURE__*/Gen.adapter();
/**
 * @category generators
 * @since 2.0.0
 */
const gen = f => {
  const iterator = f(adapter);
  let state = iterator.next();
  if (state.done) {
    return (0, exports.right)(state.value);
  } else {
    let current = state.value.value;
    if ((0, exports.isLeft)(current)) {
      return current;
    }
    while (!state.done) {
      state = iterator.next(current.right);
      if (!state.done) {
        current = state.value.value;
        if ((0, exports.isLeft)(current)) {
          return current;
        }
      }
    }
    return (0, exports.right)(state.value);
  }
};
exports.gen = gen;
//# sourceMappingURL=Either.js.map