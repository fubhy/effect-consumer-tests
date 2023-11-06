"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snapshot = exports.unsafeSnapshot = exports.zip = exports.withNow = exports.value = exports.update = exports.trackSuccessWith = exports.trackSuccess = exports.trackErrorWith = exports.trackError = exports.trackDurationWith = exports.trackDuration = exports.trackDefectWith = exports.trackDefect = exports.trackAll = exports.timerWithBoundaries = exports.timer = exports.taggedWithLabels = exports.taggedWithLabelsInput = exports.tagged = exports.summaryTimestamp = exports.summary = exports.sync = exports.succeed = exports.set = exports.mapType = exports.map = exports.incrementBy = exports.increment = exports.histogram = exports.gauge = exports.fromMetricKey = exports.withConstantInput = exports.frequency = exports.counter = exports.mapInput = exports.make = exports.globalMetricRegistry = exports.MetricTypeId = void 0;
const Clock = /*#__PURE__*/require("../Clock.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const ReadonlyArray = /*#__PURE__*/require("../ReadonlyArray.js");
const Cause = /*#__PURE__*/require("./cause.js");
const _effect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const metricBoundaries = /*#__PURE__*/require("./metric/boundaries.js");
const metricKey = /*#__PURE__*/require("./metric/key.js");
const metricLabel = /*#__PURE__*/require("./metric/label.js");
const metricRegistry = /*#__PURE__*/require("./metric/registry.js");
/** @internal */
const MetricSymbolKey = "effect/Metric";
/** @internal */
exports.MetricTypeId = /*#__PURE__*/Symbol.for(MetricSymbolKey);
/** @internal */
const metricVariance = {
  _Type: _ => _,
  _In: _ => _,
  _Out: _ => _
};
/** @internal */
exports.globalMetricRegistry = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Metric/globalMetricRegistry"), () => metricRegistry.make());
/** @internal */
const make = function (keyType, unsafeUpdate, unsafeValue) {
  const metric = Object.assign(effect => core.tap(effect, a => core.sync(() => unsafeUpdate(a, HashSet.empty()))), {
    [exports.MetricTypeId]: metricVariance,
    keyType,
    unsafeUpdate,
    unsafeValue,
    pipe() {
      return (0, Pipeable_js_1.pipeArguments)(this, arguments);
    }
  });
  return metric;
};
exports.make = make;
/** @internal */
exports.mapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.make)(self.keyType, (input, extraTags) => self.unsafeUpdate(f(input), extraTags), self.unsafeValue));
/** @internal */
const counter = (name, options) => (0, exports.fromMetricKey)(metricKey.counter(name, options));
exports.counter = counter;
/** @internal */
const frequency = (name, description) => (0, exports.fromMetricKey)(metricKey.frequency(name, description));
exports.frequency = frequency;
/** @internal */
exports.withConstantInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, input) => (0, exports.mapInput)(self, () => input));
/** @internal */
const fromMetricKey = key => {
  const hook = extraTags => {
    const fullKey = (0, Function_js_1.pipe)(key, metricKey.taggedWithLabelSet(extraTags));
    return exports.globalMetricRegistry.get(fullKey);
  };
  return (0, exports.make)(key.keyType, (input, extraTags) => hook(extraTags).update(input), extraTags => hook(extraTags).get());
};
exports.fromMetricKey = fromMetricKey;
/** @internal */
const gauge = (name, options) => (0, exports.fromMetricKey)(metricKey.gauge(name, options));
exports.gauge = gauge;
/** @internal */
const histogram = (name, boundaries, description) => (0, exports.fromMetricKey)(metricKey.histogram(name, boundaries, description));
exports.histogram = histogram;
/* @internal */
const increment = self => (0, exports.update)(self, self.keyType.bigint ? BigInt(1) : 1);
exports.increment = increment;
/* @internal */
exports.incrementBy = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, amount) => (0, exports.update)(self, amount));
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.make)(self.keyType, self.unsafeUpdate, extraTags => f(self.unsafeValue(extraTags))));
/** @internal */
exports.mapType = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.make)(f(self.keyType), self.unsafeUpdate, self.unsafeValue));
/* @internal */
exports.set = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.update)(self, value));
/** @internal */
const succeed = out => (0, exports.make)(void 0, Function_js_1.constVoid, () => out);
exports.succeed = succeed;
/** @internal */
const sync = evaluate => (0, exports.make)(void 0, Function_js_1.constVoid, evaluate);
exports.sync = sync;
/** @internal */
const summary = options => (0, exports.withNow)((0, exports.summaryTimestamp)(options));
exports.summary = summary;
/** @internal */
const summaryTimestamp = options => (0, exports.fromMetricKey)(metricKey.summary(options));
exports.summaryTimestamp = summaryTimestamp;
/** @internal */
exports.tagged = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, value) => (0, exports.taggedWithLabels)(self, HashSet.make(metricLabel.make(key, value))));
/** @internal */
exports.taggedWithLabelsInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.map)((0, exports.make)(self.keyType, (input, extraTags) => self.unsafeUpdate(input, HashSet.union(HashSet.fromIterable(f(input)), extraTags)), self.unsafeValue), Function_js_1.constVoid));
/** @internal */
exports.taggedWithLabels = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, extraTagsIterable) => {
  const extraTags = HashSet.isHashSet(extraTagsIterable) ? extraTagsIterable : HashSet.fromIterable(extraTagsIterable);
  return (0, exports.make)(self.keyType, (input, extraTags1) => self.unsafeUpdate(input, (0, Function_js_1.pipe)(extraTags, HashSet.union(extraTags1))), extraTags1 => self.unsafeValue((0, Function_js_1.pipe)(extraTags, HashSet.union(extraTags1))));
});
/** @internal */
const timer = name => {
  const boundaries = metricBoundaries.exponential({
    start: 1,
    factor: 2,
    count: 100
  });
  const base = (0, Function_js_1.pipe)((0, exports.histogram)(name, boundaries), (0, exports.tagged)("time_unit", "milliseconds"));
  return (0, exports.mapInput)(base, Duration.toMillis);
};
exports.timer = timer;
/** @internal */
const timerWithBoundaries = (name, boundaries) => {
  const base = (0, Function_js_1.pipe)((0, exports.histogram)(name, metricBoundaries.fromChunk(boundaries)), (0, exports.tagged)("time_unit", "milliseconds"));
  return (0, exports.mapInput)(base, Duration.toMillis);
};
exports.timerWithBoundaries = timerWithBoundaries;
/* @internal */
exports.trackAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, input) => effect => core.matchCauseEffect(effect, {
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
exports.trackDefect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, metric) => (0, exports.trackDefectWith)(self, metric, Function_js_1.identity));
/* @internal */
exports.trackDefectWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, metric, f) => {
  const updater = defect => metric.unsafeUpdate(f(defect), HashSet.empty());
  return _effect.tapDefect(self, cause => core.sync(() => (0, Function_js_1.pipe)(Cause.defects(cause), ReadonlyArray.forEach(updater))));
});
/* @internal */
exports.trackDuration = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, metric) => (0, exports.trackDurationWith)(self, metric, Function_js_1.identity));
/* @internal */
exports.trackDurationWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, metric, f) => Clock.clockWith(clock => {
  const startTime = clock.unsafeCurrentTimeNanos();
  return core.map(self, a => {
    const endTime = clock.unsafeCurrentTimeNanos();
    const duration = Duration.nanos(endTime - startTime);
    metric.unsafeUpdate(f(duration), HashSet.empty());
    return a;
  });
}));
/* @internal */
exports.trackError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, metric) => (0, exports.trackErrorWith)(self, metric, a => a));
/* @internal */
exports.trackErrorWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, metric, f) => {
  const updater = error => (0, exports.update)(metric, f(error));
  return _effect.tapError(self, updater);
});
/* @internal */
exports.trackSuccess = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, metric) => (0, exports.trackSuccessWith)(self, metric, a => a));
/* @internal */
exports.trackSuccessWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, metric, f) => {
  const updater = value => (0, exports.update)(metric, f(value));
  return core.tap(self, updater);
});
/* @internal */
exports.update = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, input) => core.fiberRefGetWith(core.currentMetricLabels, tags => core.sync(() => self.unsafeUpdate(input, tags))));
/* @internal */
const value = self => core.fiberRefGetWith(core.currentMetricLabels, tags => core.sync(() => self.unsafeValue(tags)));
exports.value = value;
/** @internal */
const withNow = self => (0, exports.mapInput)(self, input => [input, Date.now()]);
exports.withNow = withNow;
/** @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.make)([self.keyType, that.keyType], (input, extraTags) => {
  const [l, r] = input;
  self.unsafeUpdate(l, extraTags);
  that.unsafeUpdate(r, extraTags);
}, extraTags => [self.unsafeValue(extraTags), that.unsafeValue(extraTags)]));
/** @internal */
const unsafeSnapshot = () => exports.globalMetricRegistry.snapshot();
exports.unsafeSnapshot = unsafeSnapshot;
/** @internal */
exports.snapshot = /*#__PURE__*/core.sync(exports.unsafeSnapshot);
//# sourceMappingURL=metric.js.map