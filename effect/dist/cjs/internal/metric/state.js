"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSummaryState = exports.isHistogramState = exports.isGaugeState = exports.isFrequencyState = exports.isCounterState = exports.isMetricState = exports.summary = exports.histogram = exports.gauge = exports.frequency = exports.counter = exports.SummaryState = exports.HistogramState = exports.SummaryStateTypeId = exports.HistogramStateTypeId = exports.GaugeStateTypeId = exports.FrequencyStateTypeId = exports.CounterStateTypeId = exports.MetricStateTypeId = void 0;
const Equal = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Hash = /*#__PURE__*/require("../../Hash.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
/** @internal */
const MetricStateSymbolKey = "effect/MetricState";
/** @internal */
exports.MetricStateTypeId = /*#__PURE__*/Symbol.for(MetricStateSymbolKey);
/** @internal */
const CounterStateSymbolKey = "effect/MetricState/Counter";
/** @internal */
exports.CounterStateTypeId = /*#__PURE__*/Symbol.for(CounterStateSymbolKey);
/** @internal */
const FrequencyStateSymbolKey = "effect/MetricState/Frequency";
/** @internal */
exports.FrequencyStateTypeId = /*#__PURE__*/Symbol.for(FrequencyStateSymbolKey);
/** @internal */
const GaugeStateSymbolKey = "effect/MetricState/Gauge";
/** @internal */
exports.GaugeStateTypeId = /*#__PURE__*/Symbol.for(GaugeStateSymbolKey);
/** @internal */
const HistogramStateSymbolKey = "effect/MetricState/Histogram";
/** @internal */
exports.HistogramStateTypeId = /*#__PURE__*/Symbol.for(HistogramStateSymbolKey);
/** @internal */
const SummaryStateSymbolKey = "effect/MetricState/Summary";
/** @internal */
exports.SummaryStateTypeId = /*#__PURE__*/Symbol.for(SummaryStateSymbolKey);
/** @internal */
const metricStateVariance = {
  _A: _ => _
};
/** @internal */
class CounterState {
  count;
  [exports.MetricStateTypeId] = metricStateVariance;
  [exports.CounterStateTypeId] = exports.CounterStateTypeId;
  constructor(count) {
    this.count = count;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(CounterStateSymbolKey), Hash.combine(Hash.hash(this.count)));
  }
  [Equal.symbol](that) {
    return (0, exports.isCounterState)(that) && this.count === that.count;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
class FrequencyState {
  occurrences;
  [exports.MetricStateTypeId] = metricStateVariance;
  [exports.FrequencyStateTypeId] = exports.FrequencyStateTypeId;
  constructor(occurrences) {
    this.occurrences = occurrences;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(FrequencyStateSymbolKey), Hash.combine(Hash.hash(this.occurrences)));
  }
  [Equal.symbol](that) {
    return (0, exports.isFrequencyState)(that) && Equal.equals(this.occurrences, that.occurrences);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
class GaugeState {
  value;
  [exports.MetricStateTypeId] = metricStateVariance;
  [exports.GaugeStateTypeId] = exports.GaugeStateTypeId;
  constructor(value) {
    this.value = value;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(GaugeStateSymbolKey), Hash.combine(Hash.hash(this.value)));
  }
  [Equal.symbol](u) {
    return (0, exports.isGaugeState)(u) && this.value === u.value;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
class HistogramState {
  buckets;
  count;
  min;
  max;
  sum;
  [exports.MetricStateTypeId] = metricStateVariance;
  [exports.HistogramStateTypeId] = exports.HistogramStateTypeId;
  constructor(buckets, count, min, max, sum) {
    this.buckets = buckets;
    this.count = count;
    this.min = min;
    this.max = max;
    this.sum = sum;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(HistogramStateSymbolKey), Hash.combine(Hash.hash(this.buckets)), Hash.combine(Hash.hash(this.count)), Hash.combine(Hash.hash(this.min)), Hash.combine(Hash.hash(this.max)), Hash.combine(Hash.hash(this.sum)));
  }
  [Equal.symbol](that) {
    return (0, exports.isHistogramState)(that) && Equal.equals(this.buckets, that.buckets) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.HistogramState = HistogramState;
/** @internal */
class SummaryState {
  error;
  quantiles;
  count;
  min;
  max;
  sum;
  [exports.MetricStateTypeId] = metricStateVariance;
  [exports.SummaryStateTypeId] = exports.SummaryStateTypeId;
  constructor(error, quantiles, count, min, max, sum) {
    this.error = error;
    this.quantiles = quantiles;
    this.count = count;
    this.min = min;
    this.max = max;
    this.sum = sum;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(SummaryStateSymbolKey), Hash.combine(Hash.hash(this.error)), Hash.combine(Hash.hash(this.quantiles)), Hash.combine(Hash.hash(this.count)), Hash.combine(Hash.hash(this.min)), Hash.combine(Hash.hash(this.max)), Hash.combine(Hash.hash(this.sum)));
  }
  [Equal.symbol](that) {
    return (0, exports.isSummaryState)(that) && this.error === that.error && Equal.equals(this.quantiles, that.quantiles) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.SummaryState = SummaryState;
/** @internal */
const counter = count => new CounterState(count);
exports.counter = counter;
/** @internal */
const frequency = occurrences => {
  return new FrequencyState(occurrences);
};
exports.frequency = frequency;
/** @internal */
const gauge = count => new GaugeState(count);
exports.gauge = gauge;
/** @internal */
const histogram = options => new HistogramState(options.buckets, options.count, options.min, options.max, options.sum);
exports.histogram = histogram;
/** @internal */
const summary = options => new SummaryState(options.error, options.quantiles, options.count, options.min, options.max, options.sum);
exports.summary = summary;
/** @internal */
const isMetricState = u => (0, Predicate_js_1.hasProperty)(u, exports.MetricStateTypeId);
exports.isMetricState = isMetricState;
/** @internal */
const isCounterState = u => (0, Predicate_js_1.hasProperty)(u, exports.CounterStateTypeId);
exports.isCounterState = isCounterState;
/**
 * @since 2.0.0
 * @category refinements
 */
const isFrequencyState = u => (0, Predicate_js_1.hasProperty)(u, exports.FrequencyStateTypeId);
exports.isFrequencyState = isFrequencyState;
/**
 * @since 2.0.0
 * @category refinements
 */
const isGaugeState = u => (0, Predicate_js_1.hasProperty)(u, exports.GaugeStateTypeId);
exports.isGaugeState = isGaugeState;
/**
 * @since 2.0.0
 * @category refinements
 */
const isHistogramState = u => (0, Predicate_js_1.hasProperty)(u, exports.HistogramStateTypeId);
exports.isHistogramState = isHistogramState;
/**
 * @since 2.0.0
 * @category refinements
 */
const isSummaryState = u => (0, Predicate_js_1.hasProperty)(u, exports.SummaryStateTypeId);
exports.isSummaryState = isSummaryState;
//# sourceMappingURL=state.js.map