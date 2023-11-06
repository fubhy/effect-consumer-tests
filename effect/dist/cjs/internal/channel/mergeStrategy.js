"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isBufferSliding = exports.isBackPressure = exports.isMergeStrategy = exports.BufferSliding = exports.BackPressure = exports.MergeStrategyTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/channelMergeStrategy.js");
/** @internal */
const MergeStrategySymbolKey = "effect/ChannelMergeStrategy";
/** @internal */
exports.MergeStrategyTypeId = /*#__PURE__*/Symbol.for(MergeStrategySymbolKey);
/** @internal */
const proto = {
  [exports.MergeStrategyTypeId]: exports.MergeStrategyTypeId
};
/** @internal */
const BackPressure = _ => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_BACK_PRESSURE;
  return op;
};
exports.BackPressure = BackPressure;
/** @internal */
const BufferSliding = _ => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_BUFFER_SLIDING;
  return op;
};
exports.BufferSliding = BufferSliding;
/** @internal */
const isMergeStrategy = u => (0, Predicate_js_1.hasProperty)(u, exports.MergeStrategyTypeId);
exports.isMergeStrategy = isMergeStrategy;
/** @internal */
const isBackPressure = self => self._tag === OpCodes.OP_BACK_PRESSURE;
exports.isBackPressure = isBackPressure;
/** @internal */
const isBufferSliding = self => self._tag === OpCodes.OP_BUFFER_SLIDING;
exports.isBufferSliding = isBufferSliding;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onBackPressure,
  onBufferSliding
}) => {
  switch (self._tag) {
    case OpCodes.OP_BACK_PRESSURE:
      {
        return onBackPressure();
      }
    case OpCodes.OP_BUFFER_SLIDING:
      {
        return onBufferSliding();
      }
  }
});
//# sourceMappingURL=mergeStrategy.js.map