"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isMergeDecision = exports.AwaitConst = exports.Await = exports.Done = exports.MergeDecisionTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/channelMergeDecision.js");
/** @internal */
const MergeDecisionSymbolKey = "effect/ChannelMergeDecision";
/** @internal */
exports.MergeDecisionTypeId = /*#__PURE__*/Symbol.for(MergeDecisionSymbolKey);
/** @internal */
const proto = {
  [exports.MergeDecisionTypeId]: {
    _R: _ => _,
    _E0: _ => _,
    _Z0: _ => _,
    _E: _ => _,
    _Z: _ => _
  }
};
/** @internal */
const Done = effect => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_DONE;
  op.effect = effect;
  return op;
};
exports.Done = Done;
/** @internal */
const Await = f => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_AWAIT;
  op.f = f;
  return op;
};
exports.Await = Await;
/** @internal */
const AwaitConst = effect => (0, exports.Await)(() => effect);
exports.AwaitConst = AwaitConst;
/** @internal */
const isMergeDecision = u => (0, Predicate_js_1.hasProperty)(u, exports.MergeDecisionTypeId);
exports.isMergeDecision = isMergeDecision;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onAwait,
  onDone
}) => {
  const op = self;
  switch (op._tag) {
    case OpCodes.OP_DONE:
      {
        return onDone(op.effect);
      }
    case OpCodes.OP_AWAIT:
      {
        return onAwait(op.f);
      }
  }
});
//# sourceMappingURL=mergeDecision.js.map