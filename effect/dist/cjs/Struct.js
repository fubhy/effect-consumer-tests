"use strict";

/**
 * This module provides utility functions for working with structs in TypeScript.
 *
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evolve = exports.getOrder = exports.getEquivalence = exports.omit = exports.pick = void 0;
const Equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const order = /*#__PURE__*/require("./Order.js");
/**
 * Create a new object by picking properties of an existing object.
 *
 * @example
 * import { pick } from "effect/Struct"
 * import { pipe } from "effect/Function"
 *
 * assert.deepStrictEqual(pipe({ a: "a", b: 1, c: true }, pick("a", "b")), { a: "a", b: 1 })
 *
 * @since 2.0.0
 */
const pick = (...keys) => s => {
  const out = {};
  for (const k of keys) {
    out[k] = s[k];
  }
  return out;
};
exports.pick = pick;
/**
 * Create a new object by omitting properties of an existing object.
 *
 * @example
 * import { omit } from "effect/Struct"
 * import { pipe } from "effect/Function"
 *
 * assert.deepStrictEqual(pipe({ a: "a", b: 1, c: true }, omit("c")), { a: "a", b: 1 })
 *
 * @since 2.0.0
 */
const omit = (...keys) => s => {
  const out = {
    ...s
  };
  for (const k of keys) {
    delete out[k];
  }
  return out;
};
exports.omit = omit;
/**
 * Given a struct of `Equivalence`s returns a new `Equivalence` that compares values of a struct
 * by applying each `Equivalence` to the corresponding property of the struct.
 *
 * Alias of {@link Equivalence.struct}.
 *
 * @example
 * import { getEquivalence } from "effect/Struct"
 * import * as S from "effect/String"
 * import * as N from "effect/Number"
 *
 * const PersonEquivalence = getEquivalence({
 *   name: S.Equivalence,
 *   age: N.Equivalence
 * })
 *
 * assert.deepStrictEqual(
 *   PersonEquivalence({ name: "John", age: 25 }, { name: "John", age: 25 }),
 *   true
 * )
 * assert.deepStrictEqual(
 *   PersonEquivalence({ name: "John", age: 25 }, { name: "John", age: 40 }),
 *   false
 * )
 *
 * @category combinators
 * @since 2.0.0
 */
exports.getEquivalence = Equivalence.struct;
/**
 * This function creates and returns a new `Order` for a struct of values based on the given `Order`s
 * for each property in the struct.
 *
 * Alias of {@link order.struct}.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.getOrder = order.struct;
/**
 * Transforms the values of a Struct provided a transformation function for each key.
 * If no transformation function is provided for a key, it will return the origional value for that key.
 *
 * @example
 * import { evolve } from 'effect/Struct'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     { a: 'a', b: 1, c: 3 },
 *     evolve({
 *       a: (a) => a.length,
 *       b: (b) => b * 2
 *     })
 *   ),
 *   { a: 1, b: 2, c: 3 }
 * )
 *
 * @since 2.0.0
 */
exports.evolve = /*#__PURE__*/(0, Function_js_1.dual)(2, (obj, t) => {
  const out = {
    ...obj
  };
  for (const k in t) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      // @ts-expect-error
      out[k] = t[k](obj[k]);
    }
  }
  return out;
});
//# sourceMappingURL=Struct.js.map