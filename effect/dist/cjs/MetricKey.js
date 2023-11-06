"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taggedWithLabelSet = exports.taggedWithLabels = exports.tagged = exports.summary = exports.histogram = exports.gauge = exports.frequency = exports.counter = exports.isMetricKey = exports.MetricKeyTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/metric/key.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MetricKeyTypeId = internal.MetricKeyTypeId;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isMetricKey = internal.isMetricKey;
/**
 * Creates a metric key for a counter, with the specified name.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.counter = internal.counter;
/**
 * Creates a metric key for a categorical frequency table, with the specified
 * name.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.frequency = internal.frequency;
/**
 * Creates a metric key for a gauge, with the specified name.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.gauge = internal.gauge;
/**
 * Creates a metric key for a histogram, with the specified name and boundaries.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.histogram = internal.histogram;
/**
 * Creates a metric key for a summary, with the specified name, maxAge,
 * maxSize, error, and quantiles.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.summary = internal.summary;
/**
 * Returns a new `MetricKey` with the specified tag appended.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.tagged = internal.tagged;
/**
 * Returns a new `MetricKey` with the specified tags appended.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.taggedWithLabels = internal.taggedWithLabels;
/**
 * Returns a new `MetricKey` with the specified tags appended.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.taggedWithLabelSet = internal.taggedWithLabelSet;
//# sourceMappingURL=MetricKey.js.map