"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = exports.MetricRegistryTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const HashSet = /*#__PURE__*/require("../../HashSet.js");
const MutableHashMap = /*#__PURE__*/require("../../MutableHashMap.js");
const Option = /*#__PURE__*/require("../../Option.js");
const metricHook = /*#__PURE__*/require("./hook.js");
const metricKeyType = /*#__PURE__*/require("./keyType.js");
const metricPair = /*#__PURE__*/require("./pair.js");
/** @internal */
const MetricRegistrySymbolKey = "effect/MetricRegistry";
/** @internal */
exports.MetricRegistryTypeId = /*#__PURE__*/Symbol.for(MetricRegistrySymbolKey);
/** @internal */
class MetricRegistryImpl {
  [exports.MetricRegistryTypeId] = exports.MetricRegistryTypeId;
  map = MutableHashMap.empty();
  snapshot() {
    const result = [];
    for (const [key, hook] of this.map) {
      result.push(metricPair.unsafeMake(key, hook.get()));
    }
    return HashSet.fromIterable(result);
  }
  get(key) {
    const hook = (0, Function_js_1.pipe)(this.map, MutableHashMap.get(key), Option.getOrUndefined);
    if (hook == null) {
      if (metricKeyType.isCounterKey(key.keyType)) {
        return this.getCounter(key);
      }
      if (metricKeyType.isGaugeKey(key.keyType)) {
        return this.getGauge(key);
      }
      if (metricKeyType.isFrequencyKey(key.keyType)) {
        return this.getFrequency(key);
      }
      if (metricKeyType.isHistogramKey(key.keyType)) {
        return this.getHistogram(key);
      }
      if (metricKeyType.isSummaryKey(key.keyType)) {
        return this.getSummary(key);
      }
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/io/issues");
    } else {
      return hook;
    }
  }
  getCounter(key) {
    let value = (0, Function_js_1.pipe)(this.map, MutableHashMap.get(key), Option.getOrUndefined);
    if (value == null) {
      const counter = metricHook.counter(key);
      if (!(0, Function_js_1.pipe)(this.map, MutableHashMap.has(key))) {
        (0, Function_js_1.pipe)(this.map, MutableHashMap.set(key, counter));
      }
      value = counter;
    }
    return value;
  }
  getFrequency(key) {
    let value = (0, Function_js_1.pipe)(this.map, MutableHashMap.get(key), Option.getOrUndefined);
    if (value == null) {
      const frequency = metricHook.frequency(key);
      if (!(0, Function_js_1.pipe)(this.map, MutableHashMap.has(key))) {
        (0, Function_js_1.pipe)(this.map, MutableHashMap.set(key, frequency));
      }
      value = frequency;
    }
    return value;
  }
  getGauge(key) {
    let value = (0, Function_js_1.pipe)(this.map, MutableHashMap.get(key), Option.getOrUndefined);
    if (value == null) {
      const gauge = metricHook.gauge(key, key.keyType.bigint ? BigInt(0) : 0);
      if (!(0, Function_js_1.pipe)(this.map, MutableHashMap.has(key))) {
        (0, Function_js_1.pipe)(this.map, MutableHashMap.set(key, gauge));
      }
      value = gauge;
    }
    return value;
  }
  getHistogram(key) {
    let value = (0, Function_js_1.pipe)(this.map, MutableHashMap.get(key), Option.getOrUndefined);
    if (value == null) {
      const histogram = metricHook.histogram(key);
      if (!(0, Function_js_1.pipe)(this.map, MutableHashMap.has(key))) {
        (0, Function_js_1.pipe)(this.map, MutableHashMap.set(key, histogram));
      }
      value = histogram;
    }
    return value;
  }
  getSummary(key) {
    let value = (0, Function_js_1.pipe)(this.map, MutableHashMap.get(key), Option.getOrUndefined);
    if (value == null) {
      const summary = metricHook.summary(key);
      if (!(0, Function_js_1.pipe)(this.map, MutableHashMap.has(key))) {
        (0, Function_js_1.pipe)(this.map, MutableHashMap.set(key, summary));
      }
      value = summary;
    }
    return value;
  }
}
/** @internal */
const make = () => {
  return new MetricRegistryImpl();
};
exports.make = make;
//# sourceMappingURL=registry.js.map