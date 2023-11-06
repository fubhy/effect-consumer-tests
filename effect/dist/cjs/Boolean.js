"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.some = exports.every = exports.implies = exports.eqv = exports.xor = exports.nor = exports.or = exports.nand = exports.and = exports.not = exports.Order = exports.Equivalence = exports.match = exports.isBoolean = void 0;
/**
 * This module provides utility functions and type class instances for working with the `boolean` type in TypeScript.
 * It includes functions for basic boolean operations, as well as type class instances for
 * `Equivalence` and `Order`.
 *
 * @since 2.0.0
 */
const equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const order = /*#__PURE__*/require("./Order.js");
const predicate = /*#__PURE__*/require("./Predicate.js");
/**
 * Tests if a value is a `boolean`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isBoolean } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(isBoolean(true), true)
 * assert.deepStrictEqual(isBoolean("true"), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isBoolean = predicate.isBoolean;
/**
 * This function returns the result of either of the given functions depending on the value of the boolean parameter.
 * It is useful when you have to run one of two functions depending on the boolean value.
 *
 * @param value - the boolean value that decides which function will be executed.
 * @param onFalse - a lazy evaluation function that will be executed when the `value` is `false`.
 * @param onTrue - a lazy evaluation function that will be executed when the `value` is `true`.
 *
 * @example
 * import * as B from "effect/Boolean"
 *
 * assert.deepStrictEqual(B.match(true, { onFalse: () => "It's false!", onTrue: () => "It's true!" }), "It's true!")
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (value, options) => value ? options.onTrue() : options.onFalse());
/**
 * @category instances
 * @since 2.0.0
 */
exports.Equivalence = equivalence.boolean;
/**
 * @category instances
 * @since 2.0.0
 */
exports.Order = order.boolean;
/**
 * Negates the given boolean: `!self`
 *
 * @example
 * import { not } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(not(true), false)
 * assert.deepStrictEqual(not(false), true)
 *
 * @category combinators
 * @since 2.0.0
 */
const not = self => !self;
exports.not = not;
/**
 * Combines two boolean using AND: `self && that`.
 *
 * @example
 * import { and } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(and(true, true), true)
 * assert.deepStrictEqual(and(true, false), false)
 * assert.deepStrictEqual(and(false, true), false)
 * assert.deepStrictEqual(and(false, false), false)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.and = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self && that);
/**
 * Combines two boolean using NAND: `!(self && that)`.
 *
 * @example
 * import { nand } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(nand(true, true), false)
 * assert.deepStrictEqual(nand(true, false), true)
 * assert.deepStrictEqual(nand(false, true), true)
 * assert.deepStrictEqual(nand(false, false), true)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.nand = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => !(self && that));
/**
 * Combines two boolean using OR: `self || that`.
 *
 * @example
 * import { or } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(or(true, true), true)
 * assert.deepStrictEqual(or(true, false), true)
 * assert.deepStrictEqual(or(false, true), true)
 * assert.deepStrictEqual(or(false, false), false)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.or = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self || that);
/**
 * Combines two booleans using NOR: `!(self || that)`.
 *
 * @example
 * import { nor } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(nor(true, true), false)
 * assert.deepStrictEqual(nor(true, false), false)
 * assert.deepStrictEqual(nor(false, true), false)
 * assert.deepStrictEqual(nor(false, false), true)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.nor = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => !(self || that));
/**
 * Combines two booleans using XOR: `(!self && that) || (self && !that)`.
 *
 * @example
 * import { xor } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(xor(true, true), false)
 * assert.deepStrictEqual(xor(true, false), true)
 * assert.deepStrictEqual(xor(false, true), true)
 * assert.deepStrictEqual(xor(false, false), false)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.xor = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => !self && that || self && !that);
/**
 * Combines two booleans using EQV (aka XNOR): `!xor(self, that)`.
 *
 * @example
 * import { eqv } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(eqv(true, true), true)
 * assert.deepStrictEqual(eqv(true, false), false)
 * assert.deepStrictEqual(eqv(false, true), false)
 * assert.deepStrictEqual(eqv(false, false), true)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.eqv = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => !(0, exports.xor)(self, that));
/**
 * Combines two booleans using an implication: `(!self || that)`.
 *
 * @example
 * import { implies } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(implies(true, true), true)
 * assert.deepStrictEqual(implies(true, false), false)
 * assert.deepStrictEqual(implies(false, true), true)
 * assert.deepStrictEqual(implies(false, false), true)
 *
 * @category combinators
 * @since 2.0.0
 */
exports.implies = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self ? that : true);
/**
 * This utility function is used to check if all the elements in a collection of boolean values are `true`.
 *
 * @param collection - An iterable collection of booleans.
 *
 * @example
 * import { every } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(every([true, true, true]), true)
 * assert.deepStrictEqual(every([true, false, true]), false)
 *
 * @since 2.0.0
 */
const every = collection => {
  for (const b of collection) {
    if (!b) {
      return false;
    }
  }
  return true;
};
exports.every = every;
/**
 * This utility function is used to check if at least one of the elements in a collection of boolean values is `true`.
 *
 * @param collection - An iterable collection of booleans.
 *
 * @example
 * import { some } from 'effect/Boolean'
 *
 * assert.deepStrictEqual(some([true, false, true]), true)
 * assert.deepStrictEqual(some([false, false, false]), false)
 *
 * @since 2.0.0
 */
const some = collection => {
  for (const b of collection) {
    if (b) {
      return true;
    }
  }
  return false;
};
exports.some = some;
//# sourceMappingURL=Boolean.js.map