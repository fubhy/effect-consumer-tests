import * as Duration from "../../Duration.js";
import * as Equal from "../../Equal.js";
import { pipe } from "../../Function.js";
import * as Hash from "../../Hash.js";
import { pipeArguments } from "../../Pipeable.js";
import { hasProperty } from "../../Predicate.js";
/** @internal */
const MetricKeyTypeSymbolKey = "effect/MetricKeyType";
/** @internal */
export const MetricKeyTypeTypeId = /*#__PURE__*/Symbol.for(MetricKeyTypeSymbolKey);
/** @internal */
const CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
/** @internal */
export const CounterKeyTypeTypeId = /*#__PURE__*/Symbol.for(CounterKeyTypeSymbolKey);
/** @internal */
const FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
/** @internal */
export const FrequencyKeyTypeTypeId = /*#__PURE__*/Symbol.for(FrequencyKeyTypeSymbolKey);
/** @internal */
const GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
/** @internal */
export const GaugeKeyTypeTypeId = /*#__PURE__*/Symbol.for(GaugeKeyTypeSymbolKey);
/** @internal */
const HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
/** @internal */
export const HistogramKeyTypeTypeId = /*#__PURE__*/Symbol.for(HistogramKeyTypeSymbolKey);
/** @internal */
const SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
/** @internal */
export const SummaryKeyTypeTypeId = /*#__PURE__*/Symbol.for(SummaryKeyTypeSymbolKey);
/** @internal */
const metricKeyTypeVariance = {
  _In: _ => _,
  _Out: _ => _
};
/** @internal */
class CounterKeyType {
  incremental;
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
  constructor(incremental, bigint) {
    this.incremental = incremental;
    this.bigint = bigint;
  }
  [Hash.symbol]() {
    return Hash.hash(CounterKeyTypeSymbolKey);
  }
  [Equal.symbol](that) {
    return isCounterKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/** @internal */
class FrequencyKeyType {
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [FrequencyKeyTypeTypeId] = FrequencyKeyTypeTypeId;
  [Hash.symbol]() {
    return Hash.hash(FrequencyKeyTypeSymbolKey);
  }
  [Equal.symbol](that) {
    return isFrequencyKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/** @internal */
class GaugeKeyType {
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [GaugeKeyTypeTypeId] = GaugeKeyTypeTypeId;
  constructor(bigint) {
    this.bigint = bigint;
  }
  [Hash.symbol]() {
    return Hash.hash(GaugeKeyTypeSymbolKey);
  }
  [Equal.symbol](that) {
    return isGaugeKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/**
 * @category model
 * @since 2.0.0
 */
export class HistogramKeyType {
  boundaries;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
  constructor(boundaries) {
    this.boundaries = boundaries;
  }
  [Hash.symbol]() {
    return pipe(Hash.hash(HistogramKeyTypeSymbolKey), Hash.combine(Hash.hash(this.boundaries)));
  }
  [Equal.symbol](that) {
    return isHistogramKey(that) && Equal.equals(this.boundaries, that.boundaries);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/** @internal */
class SummaryKeyType {
  maxAge;
  maxSize;
  error;
  quantiles;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [SummaryKeyTypeTypeId] = SummaryKeyTypeTypeId;
  constructor(maxAge, maxSize, error, quantiles) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
    this.error = error;
    this.quantiles = quantiles;
  }
  [Hash.symbol]() {
    return pipe(Hash.hash(SummaryKeyTypeSymbolKey), Hash.combine(Hash.hash(this.maxAge)), Hash.combine(Hash.hash(this.maxSize)), Hash.combine(Hash.hash(this.error)), Hash.combine(Hash.hash(this.quantiles)));
  }
  [Equal.symbol](that) {
    return isSummaryKey(that) && Equal.equals(this.maxAge, that.maxAge) && this.maxSize === that.maxSize && this.error === that.error && Equal.equals(this.quantiles, that.quantiles);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/**
 * @since 2.0.0
 * @category constructors
 */
export const counter = options => new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false);
/**
 * @since 2.0.0
 * @category constructors
 */
export const frequency = /*#__PURE__*/new FrequencyKeyType();
/**
 * @since 2.0.0
 * @category constructors
 */
export const gauge = options => new GaugeKeyType(options?.bigint ?? false);
/**
 * @since 2.0.0
 * @category constructors
 */
export const histogram = boundaries => {
  return new HistogramKeyType(boundaries);
};
/**
 * @since 2.0.0
 * @category constructors
 */
export const summary = options => {
  return new SummaryKeyType(Duration.decode(options.maxAge), options.maxSize, options.error, options.quantiles);
};
/**
 * @since 2.0.0
 * @category refinements
 */
export const isMetricKeyType = u => hasProperty(u, MetricKeyTypeTypeId);
/**
 * @since 2.0.0
 * @category refinements
 */
export const isCounterKey = u => hasProperty(u, CounterKeyTypeTypeId);
/**
 * @since 2.0.0
 * @category refinements
 */
export const isFrequencyKey = u => hasProperty(u, FrequencyKeyTypeTypeId);
/**
 * @since 2.0.0
 * @category refinements
 */
export const isGaugeKey = u => hasProperty(u, GaugeKeyTypeTypeId);
/**
 * @since 2.0.0
 * @category refinements
 */
export const isHistogramKey = u => hasProperty(u, HistogramKeyTypeTypeId);
/**
 * @since 2.0.0
 * @category refinements
 */
export const isSummaryKey = u => hasProperty(u, SummaryKeyTypeTypeId);
//# sourceMappingURL=keyType.js.map