"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMetricLabel = exports.make = exports.MetricLabelTypeId = void 0;
const Equal = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Hash = /*#__PURE__*/require("../../Hash.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
/** @internal */
const MetricLabelSymbolKey = "effect/MetricLabel";
/** @internal */
exports.MetricLabelTypeId = /*#__PURE__*/Symbol.for(MetricLabelSymbolKey);
/** @internal */
class MetricLabelImpl {
  key;
  value;
  [exports.MetricLabelTypeId] = exports.MetricLabelTypeId;
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(MetricLabelSymbolKey), Hash.combine(Hash.hash(this.key)), Hash.combine(Hash.hash(this.value)));
  }
  [Equal.symbol](that) {
    return (0, exports.isMetricLabel)(that) && this.key === that.key && this.value === that.value;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
const make = (key, value) => {
  return new MetricLabelImpl(key, value);
};
exports.make = make;
/** @internal */
const isMetricLabel = u => (0, Predicate_js_1.hasProperty)(u, exports.MetricLabelTypeId);
exports.isMetricLabel = isMetricLabel;
//# sourceMappingURL=label.js.map