"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taggedWithLabelSet = exports.taggedWithLabels = exports.tagged = exports.summary = exports.histogram = exports.gauge = exports.frequency = exports.counter = exports.isMetricKey = exports.MetricKeyTypeId = void 0;
const Equal = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Hash = /*#__PURE__*/require("../../Hash.js");
const HashSet = /*#__PURE__*/require("../../HashSet.js");
const Option = /*#__PURE__*/require("../../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const metricKeyType = /*#__PURE__*/require("./keyType.js");
const metricLabel = /*#__PURE__*/require("./label.js");
/** @internal */
const MetricKeySymbolKey = "effect/MetricKey";
/** @internal */
exports.MetricKeyTypeId = /*#__PURE__*/Symbol.for(MetricKeySymbolKey);
/** @internal */
const metricKeyVariance = {
  _Type: _ => _
};
/** @internal */
class MetricKeyImpl {
  name;
  keyType;
  description;
  tags;
  [exports.MetricKeyTypeId] = metricKeyVariance;
  constructor(name, keyType, description, tags = HashSet.empty()) {
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(this.name), Hash.combine(Hash.hash(this.keyType)), Hash.combine(Hash.hash(this.description)), Hash.combine(Hash.hash(this.tags)));
  }
  [Equal.symbol](u) {
    return (0, exports.isMetricKey)(u) && this.name === u.name && Equal.equals(this.keyType, u.keyType) && Equal.equals(this.description, u.description) && Equal.equals(this.tags, u.tags);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
const isMetricKey = u => (0, Predicate_js_1.hasProperty)(u, exports.MetricKeyTypeId);
exports.isMetricKey = isMetricKey;
/** @internal */
const counter = (name, options) => new MetricKeyImpl(name, metricKeyType.counter(options), Option.fromNullable(options?.description));
exports.counter = counter;
/** @internal */
const frequency = (name, description) => new MetricKeyImpl(name, metricKeyType.frequency, Option.fromNullable(description));
exports.frequency = frequency;
/** @internal */
const gauge = (name, options) => new MetricKeyImpl(name, metricKeyType.gauge(options), Option.fromNullable(options?.description));
exports.gauge = gauge;
/** @internal */
const histogram = (name, boundaries, description) => new MetricKeyImpl(name, metricKeyType.histogram(boundaries), Option.fromNullable(description));
exports.histogram = histogram;
/** @internal */
const summary = options => new MetricKeyImpl(options.name, metricKeyType.summary(options), Option.fromNullable(options.description));
exports.summary = summary;
/** @internal */
exports.tagged = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, value) => (0, exports.taggedWithLabelSet)(self, HashSet.make(metricLabel.make(key, value))));
/** @internal */
exports.taggedWithLabels = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, extraTags) => (0, exports.taggedWithLabelSet)(self, HashSet.fromIterable(extraTags)));
/** @internal */
exports.taggedWithLabelSet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, extraTags) => HashSet.size(extraTags) === 0 ? self : new MetricKeyImpl(self.name, self.keyType, self.description, (0, Function_js_1.pipe)(self.tags, HashSet.union(extraTags))));
//# sourceMappingURL=key.js.map