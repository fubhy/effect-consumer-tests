import * as Clock from "../Clock.js";
import * as Duration from "../Duration.js";
import { constVoid, dual, identity, pipe } from "../Function.js";
import { globalValue } from "../GlobalValue.js";
import * as HashSet from "../HashSet.js";
import { pipeArguments } from "../Pipeable.js";
import * as ReadonlyArray from "../ReadonlyArray.js";
import * as Cause from "./cause.js";
import * as _effect from "./core-effect.js";
import * as core from "./core.js";
import * as metricBoundaries from "./metric/boundaries.js";
import * as metricKey from "./metric/key.js";
import * as metricLabel from "./metric/label.js";
import * as metricRegistry from "./metric/registry.js";
/** @internal */
const MetricSymbolKey = "effect/Metric";
/** @internal */
export const MetricTypeId = /*#__PURE__*/Symbol.for(MetricSymbolKey);
/** @internal */
const metricVariance = {
  _Type: _ => _,
  _In: _ => _,
  _Out: _ => _
};
/** @internal */
export const globalMetricRegistry = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/Metric/globalMetricRegistry"), () => metricRegistry.make());
/** @internal */
export const make = function (keyType, unsafeUpdate, unsafeValue) {
  const metric = Object.assign(effect => core.tap(effect, a => core.sync(() => unsafeUpdate(a, HashSet.empty()))), {
    [MetricTypeId]: metricVariance,
    keyType,
    unsafeUpdate,
    unsafeValue,
    pipe() {
      return pipeArguments(this, arguments);
    }
  });
  return metric;
};
/** @internal */
export const mapInput = /*#__PURE__*/dual(2, (self, f) => make(self.keyType, (input, extraTags) => self.unsafeUpdate(f(input), extraTags), self.unsafeValue));
/** @internal */
export const counter = (name, options) => fromMetricKey(metricKey.counter(name, options));
/** @internal */
export const frequency = (name, description) => fromMetricKey(metricKey.frequency(name, description));
/** @internal */
export const withConstantInput = /*#__PURE__*/dual(2, (self, input) => mapInput(self, () => input));
/** @internal */
export const fromMetricKey = key => {
  const hook = extraTags => {
    const fullKey = pipe(key, metricKey.taggedWithLabelSet(extraTags));
    return globalMetricRegistry.get(fullKey);
  };
  return make(key.keyType, (input, extraTags) => hook(extraTags).update(input), extraTags => hook(extraTags).get());
};
/** @internal */
export const gauge = (name, options) => fromMetricKey(metricKey.gauge(name, options));
/** @internal */
export const histogram = (name, boundaries, description) => fromMetricKey(metricKey.histogram(name, boundaries, description));
/* @internal */
export const increment = self => update(self, self.keyType.bigint ? BigInt(1) : 1);
/* @internal */
export const incrementBy = /*#__PURE__*/dual(2, (self, amount) => update(self, amount));
/** @internal */
export const map = /*#__PURE__*/dual(2, (self, f) => make(self.keyType, self.unsafeUpdate, extraTags => f(self.unsafeValue(extraTags))));
/** @internal */
export const mapType = /*#__PURE__*/dual(2, (self, f) => make(f(self.keyType), self.unsafeUpdate, self.unsafeValue));
/* @internal */
export const set = /*#__PURE__*/dual(2, (self, value) => update(self, value));
/** @internal */
export const succeed = out => make(void 0, constVoid, () => out);
/** @internal */
export const sync = evaluate => make(void 0, constVoid, evaluate);
/** @internal */
export const summary = options => withNow(summaryTimestamp(options));
/** @internal */
export const summaryTimestamp = options => fromMetricKey(metricKey.summary(options));
/** @internal */
export const tagged = /*#__PURE__*/dual(3, (self, key, value) => taggedWithLabels(self, HashSet.make(metricLabel.make(key, value))));
/** @internal */
export const taggedWithLabelsInput = /*#__PURE__*/dual(2, (self, f) => map(make(self.keyType, (input, extraTags) => self.unsafeUpdate(input, HashSet.union(HashSet.fromIterable(f(input)), extraTags)), self.unsafeValue), constVoid));
/** @internal */
export const taggedWithLabels = /*#__PURE__*/dual(2, (self, extraTagsIterable) => {
  const extraTags = HashSet.isHashSet(extraTagsIterable) ? extraTagsIterable : HashSet.fromIterable(extraTagsIterable);
  return make(self.keyType, (input, extraTags1) => self.unsafeUpdate(input, pipe(extraTags, HashSet.union(extraTags1))), extraTags1 => self.unsafeValue(pipe(extraTags, HashSet.union(extraTags1))));
});
/** @internal */
export const timer = name => {
  const boundaries = metricBoundaries.exponential({
    start: 1,
    factor: 2,
    count: 100
  });
  const base = pipe(histogram(name, boundaries), tagged("time_unit", "milliseconds"));
  return mapInput(base, Duration.toMillis);
};
/** @internal */
export const timerWithBoundaries = (name, boundaries) => {
  const base = pipe(histogram(name, metricBoundaries.fromChunk(boundaries)), tagged("time_unit", "milliseconds"));
  return mapInput(base, Duration.toMillis);
};
/* @internal */
export const trackAll = /*#__PURE__*/dual(2, (self, input) => effect => core.matchCauseEffect(effect, {
  onFailure: cause => {
    self.unsafeUpdate(input, HashSet.empty());
    return core.failCause(cause);
  },
  onSuccess: value => {
    self.unsafeUpdate(input, HashSet.empty());
    return core.succeed(value);
  }
}));
/* @internal */
export const trackDefect = /*#__PURE__*/dual(2, (self, metric) => trackDefectWith(self, metric, identity));
/* @internal */
export const trackDefectWith = /*#__PURE__*/dual(3, (self, metric, f) => {
  const updater = defect => metric.unsafeUpdate(f(defect), HashSet.empty());
  return _effect.tapDefect(self, cause => core.sync(() => pipe(Cause.defects(cause), ReadonlyArray.forEach(updater))));
});
/* @internal */
export const trackDuration = /*#__PURE__*/dual(2, (self, metric) => trackDurationWith(self, metric, identity));
/* @internal */
export const trackDurationWith = /*#__PURE__*/dual(3, (self, metric, f) => Clock.clockWith(clock => {
  const startTime = clock.unsafeCurrentTimeNanos();
  return core.map(self, a => {
    const endTime = clock.unsafeCurrentTimeNanos();
    const duration = Duration.nanos(endTime - startTime);
    metric.unsafeUpdate(f(duration), HashSet.empty());
    return a;
  });
}));
/* @internal */
export const trackError = /*#__PURE__*/dual(2, (self, metric) => trackErrorWith(self, metric, a => a));
/* @internal */
export const trackErrorWith = /*#__PURE__*/dual(3, (self, metric, f) => {
  const updater = error => update(metric, f(error));
  return _effect.tapError(self, updater);
});
/* @internal */
export const trackSuccess = /*#__PURE__*/dual(2, (self, metric) => trackSuccessWith(self, metric, a => a));
/* @internal */
export const trackSuccessWith = /*#__PURE__*/dual(3, (self, metric, f) => {
  const updater = value => update(metric, f(value));
  return core.tap(self, updater);
});
/* @internal */
export const update = /*#__PURE__*/dual(2, (self, input) => core.fiberRefGetWith(core.currentMetricLabels, tags => core.sync(() => self.unsafeUpdate(input, tags))));
/* @internal */
export const value = self => core.fiberRefGetWith(core.currentMetricLabels, tags => core.sync(() => self.unsafeValue(tags)));
/** @internal */
export const withNow = self => mapInput(self, input => [input, Date.now()]);
/** @internal */
export const zip = /*#__PURE__*/dual(2, (self, that) => make([self.keyType, that.keyType], (input, extraTags) => {
  const [l, r] = input;
  self.unsafeUpdate(l, extraTags);
  that.unsafeUpdate(r, extraTags);
}, extraTags => [self.unsafeValue(extraTags), that.unsafeValue(extraTags)]));
/** @internal */
export const unsafeSnapshot = () => globalMetricRegistry.snapshot();
/** @internal */
export const snapshot = /*#__PURE__*/core.sync(unsafeSnapshot);
//# sourceMappingURL=metric.js.map