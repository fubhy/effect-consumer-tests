/**
 * @since 2.0.0
 */
import * as Equivalence from "./Equivalence.js";
import { constNull, constUndefined, dual, identity } from "./Function.js";
import * as either from "./internal/either.js";
import { isFunction } from "./Predicate.js";
import * as Gen from "./Utils.js";
/**
 * @category symbols
 * @since 2.0.0
 */
export const TypeId = either.TypeId;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
export const right = either.right;
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
export const left = either.left;
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
export const fromNullable = /*#__PURE__*/dual(2, (self, onNullable) => self == null ? left(onNullable(self)) : right(self));
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
export const fromOption = either.fromOption;
const try_ = evaluate => {
  if (isFunction(evaluate)) {
    try {
      return right(evaluate());
    } catch (e) {
      return left(e);
    }
  } else {
    try {
      return right(evaluate.try());
    } catch (e) {
      return left(evaluate.catch(e));
    }
  }
};
export {
/**
 * Imports a synchronous side-effect into a pure `Either` value, translating any
 * thrown exceptions into typed failed eithers creating with `Either.left`.
 *
 * @category constructors
 * @since 2.0.0
 */
try_ as try };
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
export const isEither = either.isEither;
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
export const isLeft = either.isLeft;
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
export const isRight = either.isRight;
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
export const getRight = either.getRight;
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
export const getLeft = either.getLeft;
/**
 * @category equivalence
 * @since 2.0.0
 */
export const getEquivalence = (EE, EA) => Equivalence.make((x, y) => x === y || (isLeft(x) ? isLeft(y) && EE(x.left, y.left) : isRight(y) && EA(x.right, y.right)));
/**
 * @category mapping
 * @since 2.0.0
 */
export const mapBoth = /*#__PURE__*/dual(2, (self, {
  onLeft,
  onRight
}) => isLeft(self) ? left(onLeft(self.left)) : right(onRight(self.right)));
/**
 * Maps the `Left` side of an `Either` value to a new `Either` value.
 *
 * @param self - The input `Either` value to map.
 * @param f - A transformation function to apply to the `Left` value of the input `Either`.
 *
 * @category mapping
 * @since 2.0.0
 */
export const mapLeft = /*#__PURE__*/dual(2, (self, f) => isLeft(self) ? left(f(self.left)) : right(self.right));
/**
 * Maps the `Right` side of an `Either` value to a new `Either` value.
 *
 * @param self - An `Either` to map
 * @param f - The function to map over the value of the `Either`
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = /*#__PURE__*/dual(2, (self, f) => isRight(self) ? right(f(self.right)) : left(self.left));
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
export const match = /*#__PURE__*/dual(2, (self, {
  onLeft,
  onRight
}) => isLeft(self) ? onLeft(self.left) : onRight(self.right));
/**
 * @category getters
 * @since 2.0.0
 */
export const merge = /*#__PURE__*/match({
  onLeft: identity,
  onRight: identity
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
export const getOrElse = /*#__PURE__*/dual(2, (self, onLeft) => isLeft(self) ? onLeft(self.left) : self.right);
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
export const getOrNull = /*#__PURE__*/getOrElse(constNull);
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
export const getOrUndefined = /*#__PURE__*/getOrElse(constUndefined);
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
export const getOrThrowWith = /*#__PURE__*/dual(2, (self, onLeft) => {
  if (isRight(self)) {
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
export const getOrThrow = /*#__PURE__*/getOrThrowWith(() => new Error("getOrThrow called on a Left"));
/**
 * Returns `self` if it is a `Right` or `that` otherwise.
 *
 * @param self - The input `Either` value to check and potentially return.
 * @param that - A function that takes the error value from `self` (if it's a `Left`) and returns a new `Either` value.
 *
 * @category error handling
 * @since 2.0.0
 */
export const orElse = /*#__PURE__*/dual(2, (self, that) => isLeft(self) ? that(self.left) : right(self.right));
/**
 * @category combining
 * @since 2.0.0
 */
export const flatMap = /*#__PURE__*/dual(2, (self, f) => isLeft(self) ? left(self.left) : f(self.right));
/**
 * @since 2.0.0
 * @category combining
 */
export const zipWith = /*#__PURE__*/dual(3, (self, that, f) => flatMap(self, a => map(that, b => f(a, b))));
/**
 * @category combining
 * @since 2.0.0
 */
export const ap = /*#__PURE__*/dual(2, (self, that) => zipWith(self, that, (f, a) => f(a)));
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
export const all = input => {
  if (Symbol.iterator in input) {
    const out = [];
    for (const e of input) {
      if (isLeft(e)) {
        return e;
      }
      out.push(e.right);
    }
    return right(out);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const e = input[key];
    if (isLeft(e)) {
      return e;
    }
    out[key] = e.right;
  }
  return right(out);
};
/**
 * @since 2.0.0
 */
export const reverse = self => isLeft(self) ? right(self.left) : left(self.right);
const adapter = /*#__PURE__*/Gen.adapter();
/**
 * @category generators
 * @since 2.0.0
 */
export const gen = f => {
  const iterator = f(adapter);
  let state = iterator.next();
  if (state.done) {
    return right(state.value);
  } else {
    let current = state.value.value;
    if (isLeft(current)) {
      return current;
    }
    while (!state.done) {
      state = iterator.next(current.right);
      if (!state.done) {
        current = state.value.value;
        if (isLeft(current)) {
          return current;
        }
      }
    }
    return right(state.value);
  }
};
//# sourceMappingURL=Either.js.map