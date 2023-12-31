/**
 * This module provides utility functions for working with tuples in TypeScript.
 *
 * @since 2.0.0
 */
import * as Equivalence from "./Equivalence.js";
import { dual } from "./Function.js";
import * as order from "./Order.js";
/**
 * Constructs a new tuple from the provided values.
 *
 * @param elements - The list of elements to create the tuple from.
 *
 * @example
 * import { tuple } from "effect/Tuple"
 *
 * assert.deepStrictEqual(tuple(1, 'hello', true), [1, 'hello', true])
 *
 * @category constructors
 * @since 2.0.0
 */
export const tuple = (...elements) => elements;
/**
 * Return the first element of a tuple.
 *
 * @param self - A tuple of length `2`.
 *
 * @example
 * import { getFirst } from "effect/Tuple"
 *
 * assert.deepStrictEqual(getFirst(["hello", 42]), "hello")
 *
 * @category getters
 * @since 2.0.0
 */
export const getFirst = self => self[0];
/**
 * Return the second element of a tuple.
 *
 * @param self - A tuple of length `2`.
 *
 * @example
 * import { getSecond } from "effect/Tuple"
 *
 * assert.deepStrictEqual(getSecond(["hello", 42]), 42)
 *
 * @category getters
 * @since 2.0.0
 */
export const getSecond = self => self[1];
/**
 * Transforms both elements of a tuple using the given functions.
 *
 * @param self - A tuple of length `2`.
 * @param f - The function to transform the first element of the tuple.
 * @param g - The function to transform the second element of the tuple.
 *
 * @example
 * import { mapBoth } from "effect/Tuple"
 *
 * assert.deepStrictEqual(
 *   mapBoth(["hello", 42], { onFirst: s => s.toUpperCase(), onSecond: n => n.toString() }),
 *   ["HELLO", "42"]
 * )
 *
 * @category mapping
 * @since 2.0.0
 */
export const mapBoth = /*#__PURE__*/dual(2, (self, {
  onFirst,
  onSecond
}) => [onFirst(self[0]), onSecond(self[1])]);
/**
 * Transforms the first component of a tuple using a given function.
 *
 * @param self - A tuple of length `2`.
 * @param f - The function to transform the first element of the tuple.
 *
 * @example
 * import { mapFirst } from "effect/Tuple"
 *
 * assert.deepStrictEqual(
 *   mapFirst(["hello", 42], s => s.toUpperCase()),
 *   ["HELLO", 42]
 * )
 *
 * @category mapping
 * @since 2.0.0
 */
export const mapFirst = /*#__PURE__*/dual(2, (self, f) => [f(self[0]), self[1]]);
/**
 * Transforms the second component of a tuple using a given function.
 *
 * @param self - A tuple of length `2`.
 * @param f - The function to transform the second element of the tuple.
 *
 * @example
 * import { mapSecond } from "effect/Tuple"
 *
 * assert.deepStrictEqual(
 *   mapSecond(["hello", 42], n => n.toString()),
 *   ["hello", "42"]
 * )
 *
 * @category mapping
 * @since 2.0.0
 */
export const mapSecond = /*#__PURE__*/dual(2, (self, f) => [self[0], f(self[1])]);
/**
 * Swaps the two elements of a tuple.
 *
 * @param self - A tuple of length `2`.
 *
 * @example
 * import { swap } from "effect/Tuple"
 *
 * assert.deepStrictEqual(swap(["hello", 42]), [42, "hello"])
 *
 * @since 2.0.0
 */
export const swap = self => [self[1], self[0]];
/**
 * Given a tuple of `Equivalence`s returns a new `Equivalence` that compares values of a tuple
 * by applying each `Equivalence` to the corresponding element of the tuple.
 *
 * @category combinators
 * @since 2.0.0
 */
export const getEquivalence = Equivalence.tuple;
/**
 * This function creates and returns a new `Order` for a tuple of values based on the given `Order`s for each element in the tuple.
 * The returned `Order` compares two tuples of the same type by applying the corresponding `Order` to each element in the tuple.
 * It is useful when you need to compare two tuples of the same type and you have a specific way of comparing each element
 * of the tuple.
 *
 * @category combinators
 * @since 2.0.0
 */
export const getOrder = order.tuple;
/**
 * Appends an element to the end of a tuple.
 *
 * @category concatenating
 * @since 2.0.0
 */
export const appendElement = /*#__PURE__*/dual(2, (self, that) => [...self, that]);
/*

  TODO:

  - at
  - swap

*/
//# sourceMappingURL=Tuple.js.map