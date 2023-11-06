"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendElement = exports.getOrder = exports.getEquivalence = exports.swap = exports.mapSecond = exports.mapFirst = exports.mapBoth = exports.getSecond = exports.getFirst = exports.tuple = void 0;
/**
 * This module provides utility functions for working with tuples in TypeScript.
 *
 * @since 2.0.0
 */
const Equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const order = /*#__PURE__*/require("./Order.js");
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
const tuple = (...elements) => elements;
exports.tuple = tuple;
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
const getFirst = self => self[0];
exports.getFirst = getFirst;
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
const getSecond = self => self[1];
exports.getSecond = getSecond;
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
exports.mapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
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
exports.mapFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => [f(self[0]), self[1]]);
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
exports.mapSecond = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => [self[0], f(self[1])]);
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
const swap = self => [self[1], self[0]];
exports.swap = swap;
/**
 * Given a tuple of `Equivalence`s returns a new `Equivalence` that compares values of a tuple
 * by applying each `Equivalence` to the corresponding element of the tuple.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.getEquivalence = Equivalence.tuple;
/**
 * This function creates and returns a new `Order` for a tuple of values based on the given `Order`s for each element in the tuple.
 * The returned `Order` compares two tuples of the same type by applying the corresponding `Order` to each element in the tuple.
 * It is useful when you need to compare two tuples of the same type and you have a specific way of comparing each element
 * of the tuple.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.getOrder = order.tuple;
/**
 * Appends an element to the end of a tuple.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.appendElement = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => [...self, that]);
/*

  TODO:

  - at
  - swap

*/
//# sourceMappingURL=Tuple.js.map