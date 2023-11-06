"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSummaryKey = exports.isHistogramKey = exports.isGaugeKey = exports.isFrequencyKey = exports.isCounterKey = exports.isMetricKeyType = exports.summary = exports.histogram = exports.gauge = exports.frequency = exports.counter = exports.SummaryKeyTypeTypeId = exports.HistogramKeyTypeTypeId = exports.GaugeKeyTypeTypeId = exports.FrequencyKeyTypeTypeId = exports.CounterKeyTypeTypeId = exports.MetricKeyTypeTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/metric/keyType.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MetricKeyTypeTypeId = internal.MetricKeyTypeTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.CounterKeyTypeTypeId = internal.CounterKeyTypeTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FrequencyKeyTypeTypeId = internal.FrequencyKeyTypeTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.GaugeKeyTypeTypeId = internal.GaugeKeyTypeTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.HistogramKeyTypeTypeId = internal.HistogramKeyTypeTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.SummaryKeyTypeTypeId = internal.SummaryKeyTypeTypeId;
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
exports.isMetricKeyType = internal.isMetricKeyType;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isCounterKey = internal.isCounterKey;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isFrequencyKey = internal.isFrequencyKey;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isGaugeKey = internal.isGaugeKey;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isHistogramKey = internal.isHistogramKey;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isSummaryKey = internal.isSummaryKey;
//# sourceMappingURL=MetricKeyType.js.map