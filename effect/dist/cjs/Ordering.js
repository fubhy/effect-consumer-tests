"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineAll = exports.combineMany = exports.combine = exports.match = exports.reverse = void 0;
const Function_js_1 = /*#__PURE__*/require("./Function.js");
/**
 * Inverts the ordering of the input `Ordering`.
 *
 * @param o - The input `Ordering`.
 *
 * @example
 * import { reverse } from "effect/Ordering"
 *
 * assert.deepStrictEqual(reverse(1), -1)
 * assert.deepStrictEqual(reverse(-1), 1)
 * assert.deepStrictEqual(reverse(0), 0)
 *
 * @since 2.0.0
 */
const reverse = o => o === -1 ? 1 : o === 1 ? -1 : 0;
exports.reverse = reverse;
/**
 * Depending on the `Ordering` parameter given to it, returns a value produced by one of the 3 functions provided as parameters.
 *
 * @param self - The `Ordering` parameter to match against.
 * @param onLessThan - A function that will be called if the `Ordering` parameter is `-1`.
 * @param onEqual - A function that will be called if the `Ordering` parameter is `0`.
 * @param onGreaterThan - A function that will be called if the `Ordering` parameter is `1`.
 *
 * @example
 * import { match } from "effect/Ordering"
 * import { constant } from "effect/Function"
 *
 * const toMessage = match({
 *   onLessThan: constant('less than'),
 *   onEqual: constant('equal'),
 *   onGreaterThan: constant('greater than')
 * })
 *
 * assert.deepStrictEqual(toMessage(-1), "less than")
 * assert.deepStrictEqual(toMessage(0), "equal")
 * assert.deepStrictEqual(toMessage(1), "greater than")
 *
 * @category pattern matching
 * @since 2.0.0
 */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onEqual,
  onGreaterThan,
  onLessThan
}) => self === -1 ? onLessThan() : self === 0 ? onEqual() : onGreaterThan());
/**
 * @category combining
 * @since 2.0.0
 */
exports.combine = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self !== 0 ? self : that);
/**
 * @category combining
 * @since 2.0.0
 */
exports.combineMany = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, collection) => {
  let ordering = self;
  if (ordering !== 0) {
    return ordering;
  }
  for (ordering of collection) {
    if (ordering !== 0) {
      return ordering;
    }
  }
  return ordering;
});
/**
 * @category combining
 * @since 2.0.0
 */
const combineAll = collection => (0, exports.combineMany)(0, collection);
exports.combineAll = combineAll;
//# sourceMappingURL=Ordering.js.map