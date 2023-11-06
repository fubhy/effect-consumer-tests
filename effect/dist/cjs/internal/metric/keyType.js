"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSummaryKey = exports.isHistogramKey = exports.isGaugeKey = exports.isFrequencyKey = exports.isCounterKey = exports.isMetricKeyType = exports.summary = exports.histogram = exports.gauge = exports.frequency = exports.counter = exports.HistogramKeyType = exports.SummaryKeyTypeTypeId = exports.HistogramKeyTypeTypeId = exports.GaugeKeyTypeTypeId = exports.FrequencyKeyTypeTypeId = exports.CounterKeyTypeTypeId = exports.MetricKeyTypeTypeId = void 0;
const Duration = /*#__PURE__*/require("../../Duration.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Hash = /*#__PURE__*/require("../../Hash.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
/** @internal */
const MetricKeyTypeSymbolKey = "effect/MetricKeyType";
/** @internal */
exports.MetricKeyTypeTypeId = /*#__PURE__*/Symbol.for(MetricKeyTypeSymbolKey);
/** @internal */
const CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
/** @internal */
exports.CounterKeyTypeTypeId = /*#__PURE__*/Symbol.for(CounterKeyTypeSymbolKey);
/** @internal */
const FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
/** @internal */
exports.FrequencyKeyTypeTypeId = /*#__PURE__*/Symbol.for(FrequencyKeyTypeSymbolKey);
/** @internal */
const GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
/** @internal */
exports.GaugeKeyTypeTypeId = /*#__PURE__*/Symbol.for(GaugeKeyTypeSymbolKey);
/** @internal */
const HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
/** @internal */
exports.HistogramKeyTypeTypeId = /*#__PURE__*/Symbol.for(HistogramKeyTypeSymbolKey);
/** @internal */
const SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
/** @internal */
exports.SummaryKeyTypeTypeId = /*#__PURE__*/Symbol.for(SummaryKeyTypeSymbolKey);
/** @internal */
const metricKeyTypeVariance = {
  _In: _ => _,
  _Out: _ => _
};
/** @internal */
class CounterKeyType {
  incremental;
  bigint;
  [exports.MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [exports.CounterKeyTypeTypeId] = exports.CounterKeyTypeTypeId;
  constructor(incremental, bigint) {
    this.incremental = incremental;
    this.bigint = bigint;
  }
  [Hash.symbol]() {
    return Hash.hash(CounterKeyTypeSymbolKey);
  }
  [Equal.symbol](that) {
    return (0, exports.isCounterKey)(that);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
class FrequencyKeyType {
  [exports.MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [exports.FrequencyKeyTypeTypeId] = exports.FrequencyKeyTypeTypeId;
  [Hash.symbol]() {
    return Hash.hash(FrequencyKeyTypeSymbolKey);
  }
  [Equal.symbol](that) {
    return (0, exports.isFrequencyKey)(that);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
class GaugeKeyType {
  bigint;
  [exports.MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [exports.GaugeKeyTypeTypeId] = exports.GaugeKeyTypeTypeId;
  constructor(bigint) {
    this.bigint = bigint;
  }
  [Hash.symbol]() {
    return Hash.hash(GaugeKeyTypeSymbolKey);
  }
  [Equal.symbol](that) {
    return (0, exports.isGaugeKey)(that);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/**
 * @category model
 * @since 2.0.0
 */
class HistogramKeyType {
  boundaries;
  [exports.MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [exports.HistogramKeyTypeTypeId] = exports.HistogramKeyTypeTypeId;
  constructor(boundaries) {
    this.boundaries = boundaries;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(HistogramKeyTypeSymbolKey), Hash.combine(Hash.hash(this.boundaries)));
  }
  [Equal.symbol](that) {
    return (0, exports.isHistogramKey)(that) && Equal.equals(this.boundaries, that.boundaries);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.HistogramKeyType = HistogramKeyType;
/** @internal */
class SummaryKeyType {
  maxAge;
  maxSize;
  error;
  quantiles;
  [exports.MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [exports.SummaryKeyTypeTypeId] = exports.SummaryKeyTypeTypeId;
  constructor(maxAge, maxSize, error, quantiles) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
    this.error = error;
    this.quantiles = quantiles;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(SummaryKeyTypeSymbolKey), Hash.combine(Hash.hash(this.maxAge)), Hash.combine(Hash.hash(this.maxSize)), Hash.combine(Hash.hash(this.error)), Hash.combine(Hash.hash(this.quantiles)));
  }
  [Equal.symbol](that) {
    return (0, exports.isSummaryKey)(that) && Equal.equals(this.maxAge, that.maxAge) && this.maxSize === that.maxSize && this.error === that.error && Equal.equals(this.quantiles, that.quantiles);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/**
 * @since 2.0.0
 * @category constructors
 */
const counter = options => new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false);
exports.counter = counter;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.frequency = /*#__PURE__*/new FrequencyKeyType();
/**
 * @since 2.0.0
 * @category constructors
 */
const gauge = options => new GaugeKeyType(options?.bigint ?? false);
exports.gauge = gauge;
/**
 * @since 2.0.0
 * @category constructors
 */
const histogram = boundaries => {
  return new HistogramKeyType(boundaries);
};
exports.histogram = histogram;
/**
 * @since 2.0.0
 * @category constructors
 */
const summary = options => {
  return new SummaryKeyType(Duration.decode(options.maxAge), options.maxSize, options.error, options.quantiles);
};
exports.summary = summary;
/**
 * @since 2.0.0
 * @category refinements
 */
const isMetricKeyType = u => (0, Predicate_js_1.hasProperty)(u, exports.MetricKeyTypeTypeId);
exports.isMetricKeyType = isMetricKeyType;
/**
 * @since 2.0.0
 * @category refinements
 */
const isCounterKey = u => (0, Predicate_js_1.hasProperty)(u, exports.CounterKeyTypeTypeId);
exports.isCounterKey = isCounterKey;
/**
 * @since 2.0.0
 * @category refinements
 */
const isFrequencyKey = u => (0, Predicate_js_1.hasProperty)(u, exports.FrequencyKeyTypeTypeId);
exports.isFrequencyKey = isFrequencyKey;
/**
 * @since 2.0.0
 * @category refinements
 */
const isGaugeKey = u => (0, Predicate_js_1.hasProperty)(u, exports.GaugeKeyTypeTypeId);
exports.isGaugeKey = isGaugeKey;
/**
 * @since 2.0.0
 * @category refinements
 */
const isHistogramKey = u => (0, Predicate_js_1.hasProperty)(u, exports.HistogramKeyTypeTypeId);
exports.isHistogramKey = isHistogramKey;
/**
 * @since 2.0.0
 * @category refinements
 */
const isSummaryKey = u => (0, Predicate_js_1.hasProperty)(u, exports.SummaryKeyTypeTypeId);
exports.isSummaryKey = isSummaryKey;
//# sourceMappingURL=keyType.js.map