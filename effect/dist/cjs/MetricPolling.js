"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = exports.retry = exports.pollAndUpdate = exports.poll = exports.launch = exports.collectAll = exports.make = exports.PollingMetricTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/metric/polling.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.PollingMetricTypeId = internal.PollingMetricTypeId;
/**
 * Constructs a new polling metric from a metric and poll effect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Collects all of the polling metrics into a single polling metric, which
 * polls for, updates, and produces the outputs of all individual metrics.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.collectAll = internal.collectAll;
/**
 * Returns an effect that will launch the polling metric in a background
 * fiber, using the specified schedule.
 *
 * @since 2.0.0
 * @category utils
 */
exports.launch = internal.launch;
/**
 * An effect that polls a value that may be fed to the metric.
 *
 * @since 2.0.0
 * @category utils
 */
exports.poll = internal.poll;
/**
 * An effect that polls for a value and uses the value to update the metric.
 *
 * @since 2.0.0
 * @category utils
 */
exports.pollAndUpdate = internal.pollAndUpdate;
/**
 * Returns a new polling metric whose poll function will be retried with the
 * specified retry policy.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.retry = internal.retry;
/**
 * Zips this polling metric with the specified polling metric.
 *
 * @since 2.0.0
 * @category utils
 */
exports.zip = internal.zip;
//# sourceMappingURL=MetricPolling.js.map