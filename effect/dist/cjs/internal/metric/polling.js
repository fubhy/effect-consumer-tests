"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = exports.retry = exports.pollAndUpdate = exports.poll = exports.launch = exports.collectAll = exports.make = exports.PollingMetricTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const core = /*#__PURE__*/require("../core.js");
const circular = /*#__PURE__*/require("../effect/circular.js");
const metric = /*#__PURE__*/require("../metric.js");
const schedule = /*#__PURE__*/require("../schedule.js");
/** @internal */
const PollingMetricSymbolKey = "effect/MetricPolling";
/** @internal */
exports.PollingMetricTypeId = /*#__PURE__*/Symbol.for(PollingMetricSymbolKey);
/** @internal */
const make = (metric, poll) => {
  return {
    [exports.PollingMetricTypeId]: exports.PollingMetricTypeId,
    pipe() {
      return (0, Pipeable_js_1.pipeArguments)(this, arguments);
    },
    metric,
    poll
  };
};
exports.make = make;
/** @internal */
const collectAll = iterable => {
  const metrics = Array.from(iterable);
  return {
    [exports.PollingMetricTypeId]: exports.PollingMetricTypeId,
    pipe() {
      return (0, Pipeable_js_1.pipeArguments)(this, arguments);
    },
    metric: metric.make(Array.of(void 0), (inputs, extraTags) => {
      for (let i = 0; i < inputs.length; i++) {
        const pollingMetric = metrics[i];
        const input = (0, Function_js_1.pipe)(inputs, x => x[i]);
        pollingMetric.metric.unsafeUpdate(input, extraTags);
      }
    }, extraTags => Array.from(metrics.map(pollingMetric => pollingMetric.metric.unsafeValue(extraTags)))),
    poll: core.forEachSequential(metrics, metric => metric.poll)
  };
};
exports.collectAll = collectAll;
/** @internal */
exports.launch = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, Function_js_1.pipe)((0, exports.pollAndUpdate)(self), core.zipRight(metric.value(self.metric)), circular.scheduleForked(schedule)));
/** @internal */
const poll = self => self.poll;
exports.poll = poll;
/** @internal */
const pollAndUpdate = self => core.flatMap(self.poll, value => metric.update(self.metric, value));
exports.pollAndUpdate = pollAndUpdate;
/** @internal */
exports.retry = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, policy) => ({
  [exports.PollingMetricTypeId]: exports.PollingMetricTypeId,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  metric: self.metric,
  poll: schedule.retry_Effect(self.poll, policy)
}));
/** @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => ({
  [exports.PollingMetricTypeId]: exports.PollingMetricTypeId,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  metric: (0, Function_js_1.pipe)(self.metric, metric.zip(that.metric)),
  poll: core.zip(self.poll, that.poll)
}));
//# sourceMappingURL=polling.js.map