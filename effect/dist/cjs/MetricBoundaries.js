"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exponential = exports.linear = exports.fromChunk = exports.isMetricBoundaries = exports.MetricBoundariesTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/metric/boundaries.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MetricBoundariesTypeId = internal.MetricBoundariesTypeId;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isMetricBoundaries = internal.isMetricBoundaries;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.fromChunk = internal.fromChunk;
/**
 * A helper method to create histogram bucket boundaries for a histogram
 * with linear increasing values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.linear = internal.linear;
/**
 * A helper method to create histogram bucket boundaries for a histogram
 * with exponentially increasing values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.exponential = internal.exponential;
//# sourceMappingURL=MetricBoundaries.js.map