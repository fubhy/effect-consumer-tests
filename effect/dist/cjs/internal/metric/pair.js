"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeMake = exports.make = exports.MetricPairTypeId = void 0;
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
/** @internal */
const MetricPairSymbolKey = "effect/MetricPair";
/** @internal */
exports.MetricPairTypeId = /*#__PURE__*/Symbol.for(MetricPairSymbolKey);
/** @internal */
const metricPairVariance = {
  _Type: _ => _
};
/** @internal */
const make = (metricKey, metricState) => {
  return {
    [exports.MetricPairTypeId]: metricPairVariance,
    metricKey,
    metricState,
    pipe() {
      return (0, Pipeable_js_1.pipeArguments)(this, arguments);
    }
  };
};
exports.make = make;
/** @internal */
const unsafeMake = (metricKey, metricState) => {
  return {
    [exports.MetricPairTypeId]: metricPairVariance,
    metricKey,
    metricState,
    pipe() {
      return (0, Pipeable_js_1.pipeArguments)(this, arguments);
    }
  };
};
exports.unsafeMake = unsafeMake;
//# sourceMappingURL=pair.js.map