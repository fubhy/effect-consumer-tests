"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exponential = exports.linear = exports.fromChunk = exports.isMetricBoundaries = exports.MetricBoundariesTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Hash = /*#__PURE__*/require("../../Hash.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const ReadonlyArray = /*#__PURE__*/require("../../ReadonlyArray.js");
/** @internal */
const MetricBoundariesSymbolKey = "effect/MetricBoundaries";
/** @internal */
exports.MetricBoundariesTypeId = /*#__PURE__*/Symbol.for(MetricBoundariesSymbolKey);
/** @internal */
class MetricBoundariesImpl {
  values;
  [exports.MetricBoundariesTypeId] = exports.MetricBoundariesTypeId;
  constructor(values) {
    this.values = values;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(MetricBoundariesSymbolKey), Hash.combine(Hash.hash(this.values)));
  }
  [Equal.symbol](u) {
    return (0, exports.isMetricBoundaries)(u) && Equal.equals(this.values, u.values);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
const isMetricBoundaries = u => (0, Predicate_js_1.hasProperty)(u, exports.MetricBoundariesTypeId);
exports.isMetricBoundaries = isMetricBoundaries;
/** @internal */
const fromChunk = chunk => {
  const values = (0, Function_js_1.pipe)(chunk, Chunk.appendAll(Chunk.of(Number.POSITIVE_INFINITY)), Chunk.dedupe);
  return new MetricBoundariesImpl(values);
};
exports.fromChunk = fromChunk;
/** @internal */
const linear = options => (0, Function_js_1.pipe)(ReadonlyArray.makeBy(options.count - 1, i => options.start + i * options.width), Chunk.unsafeFromArray, exports.fromChunk);
exports.linear = linear;
/** @internal */
const exponential = options => (0, Function_js_1.pipe)(ReadonlyArray.makeBy(options.count - 1, i => options.start * Math.pow(options.factor, i)), Chunk.unsafeFromArray, exports.fromChunk);
exports.exponential = exponential;
//# sourceMappingURL=boundaries.js.map