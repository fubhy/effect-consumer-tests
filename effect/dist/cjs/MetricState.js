"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSummaryState = exports.isHistogramState = exports.isGaugeState = exports.isFrequencyState = exports.isCounterState = exports.isMetricState = exports.summary = exports.histogram = exports.gauge = exports.frequency = exports.counter = exports.SummaryStateTypeId = exports.HistogramStateTypeId = exports.GaugeStateTypeId = exports.FrequencyStateTypeId = exports.CounterStateTypeId = exports.MetricStateTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/metric/state.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MetricStateTypeId = internal.MetricStateTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.CounterStateTypeId = internal.CounterStateTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FrequencyStateTypeId = internal.FrequencyStateTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.GaugeStateTypeId = internal.GaugeStateTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.HistogramStateTypeId = internal.HistogramStateTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.SummaryStateTypeId = internal.SummaryStateTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.counter = internal.counter;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.frequency = internal.frequency;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.gauge = internal.gauge;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.histogram = internal.histogram;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.summary = internal.summary;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isMetricState = internal.isMetricState;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isCounterState = internal.isCounterState;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isFrequencyState = internal.isFrequencyState;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isGaugeState = internal.isGaugeState;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isHistogramState = internal.isHistogramState;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isSummaryState = internal.isSummaryState;
//# sourceMappingURL=MetricState.js.map