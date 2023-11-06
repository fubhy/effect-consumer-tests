"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = exports.first = exports.filter = exports.evaluate = exports.GroupByTypeId = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/groupBy.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.GroupByTypeId = internal.GroupByTypeId;
/**
 * Run the function across all groups, collecting the results in an
 * arbitrary order.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.evaluate = internal.evaluate;
/**
 * Filter the groups to be processed.
 *
 * @since 2.0.0
 * @category utils
 */
exports.filter = internal.filter;
/**
 * Only consider the first `n` groups found in the `Stream`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.first = internal.first;
/**
 * Constructs a `GroupBy` from a `Stream`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
//# sourceMappingURL=GroupBy.js.map