"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fiberActive = exports.fiberLifetimes = exports.fiberFailures = exports.fiberSuccesses = exports.fiberStarted = exports.unsafeSnapshot = exports.zip = exports.withNow = exports.value = exports.update = exports.trackSuccessWith = exports.trackSuccess = exports.trackErrorWith = exports.trackError = exports.trackDurationWith = exports.trackDuration = exports.trackDefectWith = exports.trackDefect = exports.trackAll = exports.timerWithBoundaries = exports.timer = exports.taggedWithLabels = exports.taggedWithLabelsInput = exports.tagged = exports.summaryTimestamp = exports.summary = exports.sync = exports.succeed = exports.snapshot = exports.set = exports.mapType = exports.map = exports.incrementBy = exports.increment = exports.histogram = exports.gauge = exports.fromMetricKey = exports.withConstantInput = exports.frequency = exports.counter = exports.mapInput = exports.make = exports.globalMetricRegistry = exports.MetricTypeId = void 0;
const fiberRuntime = /*#__PURE__*/require("./internal/fiberRuntime.js");
const internal = /*#__PURE__*/require("./internal/metric.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MetricTypeId = internal.MetricTypeId;
/**
 * @since 2.0.0
 * @category globals
 */
exports.globalMetricRegistry = internal.globalMetricRegistry;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Returns a new metric that is powered by this one, but which accepts updates
 * of the specified new type, which must be transformable to the input type of
 * this metric.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapInput = internal.mapInput;
/**
 * Represents a Counter metric that tracks cumulative numerical values over time.
 * Counters can be incremented and decremented and provide a running total of changes.
 *
 * @param name - The name of the counter metric.
 * @param options - An optional configuration for the counter:
 * - description - A description of the counter.
 * - bigint - Indicates if the counter uses 'bigint' data type.
 * - incremental - Set to 'true' for a counter that only increases. With this configuration, Effect ensures that non-incremental updates have no impact on the counter, making it exclusively suitable for counting upwards.
 *
 * @example
 * import * as Metric from "effect/Metric"
 *
 * const numberCounter = Metric.counter("count", {
 *   description: "A number counter"
 * });
 *
 * const bigintCounter = Metric.counter("count", {
 *   description: "A bigint counter",
 *   bigint: true
 * });
 *
 * @since 2.0.0
 * @category constructors
 */
exports.counter = internal.counter;
/**
 * Creates a Frequency metric to count occurrences of events.
 * Frequency metrics are used to count the number of times specific events or incidents occur.
 *
 * @param name - The name of the Frequency metric.
 * @param description - An optional description of the Frequency metric.
 *
 * @example
 * import * as Metric from "effect/Metric"
 *
 * const errorFrequency = Metric.frequency("error_frequency", "Counts the occurrences of errors.");
 *
 * @since 2.0.0
 * @category constructors
 */
exports.frequency = internal.frequency;
/**
 * Returns a new metric that is powered by this one, but which accepts updates
 * of any type, and translates them to updates with the specified constant
 * update value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.withConstantInput = internal.withConstantInput;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.fromMetricKey = internal.fromMetricKey;
/**
 * Represents a Gauge metric that tracks and reports a single numerical value at a specific moment.
 * Gauges are suitable for metrics that represent instantaneous values, such as memory usage or CPU load.
 *
 * @param name - The name of the gauge metric.
 * @param options - An optional configuration for the gauge:
 * - description - A description of the gauge metric.
 * - bigint - Indicates if the counter uses 'bigint' data type.
 *
 * @example
 * import * as Metric from "effect/Metric"
 *
 * const numberGauge = Metric.gauge("memory_usage", {
 *   description: "A gauge for memory usage"
 * });
 *
 * const bigintGauge = Metric.gauge("cpu_load", {
 *   description: "A gauge for CPU load",
 *   bigint: true
 * });
 *
 * @since 2.0.0
 * @category constructors
 */
exports.gauge = internal.gauge;
/**
 * Represents a Histogram metric that records observations in specified value boundaries.
 * Histogram metrics are useful for measuring the distribution of values within a range.
 *
 * @param name - The name of the histogram metric.
 * @param boundaries - The boundaries for defining the histogram's value ranges.
 * @param description - A description of the histogram metric.
 *
 * @example
 * import * as Metric from "effect/Metric"
 * import * as MetricBoundaries from "effect/MetricBoundaries"
 *
 * const latencyHistogram = Metric.histogram("latency_histogram",
 *   MetricBoundaries.linear({ start: 0, width: 10, count: 11 }),
 *   "Measures the distribution of request latency."
 * );
 *
 * @since 2.0.0
 * @category constructors
 */
exports.histogram = internal.histogram;
/**
 * @since 2.0.0
 * @category aspects
 */
exports.increment = internal.increment;
/**
 * @since 2.0.0
 * @category aspects
 */
exports.incrementBy = internal.incrementBy;
/**
 * Returns a new metric that is powered by this one, but which outputs a new
 * state type, determined by transforming the state type of this metric by the
 * specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = internal.map;
/**
 * @since 2.0.0
 * @category mapping
 */
exports.mapType = internal.mapType;
/**
 * @since 2.0.0
 * @category aspects
 */
exports.set = internal.set;
/**
 * Captures a snapshot of all metrics recorded by the application.
 *
 * @since 2.0.0
 * @category getters
 */
exports.snapshot = internal.snapshot;
/**
 * Creates a metric that ignores input and produces constant output.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = internal.succeed;
/**
 * Creates a metric that ignores input and produces constant output.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sync = internal.sync;
/**
 * Creates a Summary metric that records observations and calculates quantiles.
 * Summary metrics provide statistical information about a set of values, including quantiles.
 *
 * @param options - An object with configuration options for the Summary metric:
 * - name - The name of the Summary metric.
 * - maxAge - The maximum age of observations to retain.
 * - maxSize - The maximum number of observations to keep.
 * - error - The error percentage when calculating quantiles.
 * - quantiles - An `Chunk` of quantiles to calculate (e.g., [0.5, 0.9]).
 * - description - An optional description of the Summary metric.
 *
 * @example
 * import * as Metric from "effect/Metric"
 * import * as Chunk from "effect/Chunk"
 *
 * const responseTimesSummary = Metric.summary({
 *   name: "response_times_summary",
 *   maxAge: "60 seconds", // Retain observations for 60 seconds.
 *   maxSize: 1000, // Keep a maximum of 1000 observations.
 *   error: 0.01, // Allow a 1% error when calculating quantiles.
 *   quantiles: Chunk.make(0.5, 0.9, 0.99), // Calculate 50th, 90th, and 99th percentiles.
 *   description: "Measures the distribution of response times."
 * });
 *
 * @since 2.0.0
 * @category constructors
 */
exports.summary = internal.summary;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.summaryTimestamp = internal.summaryTimestamp;
/**
 * Returns a new metric, which is identical in every way to this one, except
 * the specified tags have been added to the tags of this metric.
 *
 * @since 2.0.0
 * @category utils
 */
exports.tagged = internal.tagged;
/**
 * Returns a new metric, which is identical in every way to this one, except
 * dynamic tags are added based on the update values. Note that the metric
 * returned by this method does not return any useful information, due to the
 * dynamic nature of the added tags.
 *
 * @since 2.0.0
 * @category utils
 */
exports.taggedWithLabelsInput = internal.taggedWithLabelsInput;
/**
 * Returns a new metric, which is identical in every way to this one, except
 * the specified tags have been added to the tags of this metric.
 *
 * @since 2.0.0
 * @category utils
 */
exports.taggedWithLabels = internal.taggedWithLabels;
/**
 * Creates a timer metric, based on a histogram, which keeps track of
 * durations in milliseconds. The unit of time will automatically be added to
 * the metric as a tag (i.e. `"time_unit: milliseconds"`).
 *
 * @since 2.0.0
 * @category constructors
 */
exports.timer = internal.timer;
/**
 * Creates a timer metric, based on a histogram created from the provided
 * boundaries, which keeps track of durations in milliseconds. The unit of time
 * will automatically be added to the metric as a tag (i.e.
 * `"time_unit: milliseconds"`).
 *
 * @since 2.0.0
 * @category constructors
 */
exports.timerWithBoundaries = internal.timerWithBoundaries;
/**
 * Returns an aspect that will update this metric with the specified constant
 * value every time the aspect is applied to an effect, regardless of whether
 * that effect fails or succeeds.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackAll = internal.trackAll;
/**
 * Returns an aspect that will update this metric with the defects of the
 * effects that it is applied to.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackDefect = internal.trackDefect;
/**
 * Returns an aspect that will update this metric with the result of applying
 * the specified function to the defect throwables of the effects that the
 * aspect is applied to.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackDefectWith = internal.trackDefectWith;
/**
 * Returns an aspect that will update this metric with the duration that the
 * effect takes to execute. To call this method, the input type of the metric
 * must be `Duration`.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackDuration = internal.trackDuration;
/**
 * Returns an aspect that will update this metric with the duration that the
 * effect takes to execute. To call this method, you must supply a function
 * that can convert the `Duration` to the input type of this metric.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackDurationWith = internal.trackDurationWith;
/**
 * Returns an aspect that will update this metric with the failure value of
 * the effects that it is applied to.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackError = internal.trackError;
/**
 * Returns an aspect that will update this metric with the result of applying
 * the specified function to the error value of the effects that the aspect is
 * applied to.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackErrorWith = internal.trackErrorWith;
/**
 * Returns an aspect that will update this metric with the success value of
 * the effects that it is applied to.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackSuccess = internal.trackSuccess;
/**
 * Returns an aspect that will update this metric with the result of applying
 * the specified function to the success value of the effects that the aspect is
 * applied to.
 *
 * @since 2.0.0
 * @category aspects
 */
exports.trackSuccessWith = internal.trackSuccessWith;
/**
 * Updates the metric with the specified update message. For example, if the
 * metric were a counter, the update would increment the method by the
 * provided amount.
 *
 * @since 2.0.0
 * @category utils
 */
exports.update = internal.update;
/**
 * Retrieves a snapshot of the value of the metric at this moment in time.
 *
 * @since 2.0.0
 * @category getters
 */
exports.value = internal.value;
/**
 * @since 2.0.0
 * @category utils
 */
exports.withNow = internal.withNow;
/**
 * @since 2.0.0
 * @category zipping
 */
exports.zip = internal.zip;
/**
 * Unsafely captures a snapshot of all metrics recorded by the application.
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeSnapshot = internal.unsafeSnapshot;
/**
 * @since 2.0.0
 * @category metrics
 */
exports.fiberStarted = fiberRuntime.fiberStarted;
/**
 * @since 2.0.0
 * @category metrics
 */
exports.fiberSuccesses = fiberRuntime.fiberSuccesses;
/**
 * @since 2.0.0
 * @category metrics
 */
exports.fiberFailures = fiberRuntime.fiberFailures;
/**
 * @since 2.0.0
 * @category metrics
 */
exports.fiberLifetimes = fiberRuntime.fiberLifetimes;
/**
 * @since 2.0.0
 * @category metrics
 */
exports.fiberActive = fiberRuntime.fiberActive;
//# sourceMappingURL=Metric.js.map