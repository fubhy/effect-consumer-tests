"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Equivalence = exports.isSymbol = void 0;
const equivalence = /*#__PURE__*/require("./Equivalence.js");
const predicate = /*#__PURE__*/require("./Predicate.js");
/**
 * Tests if a value is a `symbol`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isSymbol } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isSymbol(Symbol.for("a")), true)
 * assert.deepStrictEqual(isSymbol("a"), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isSymbol = predicate.isSymbol;
/**
 * @category instances
 * @since 2.0.0
 */
exports.Equivalence = equivalence.symbol;
//# sourceMappingURL=Symbol.js.map