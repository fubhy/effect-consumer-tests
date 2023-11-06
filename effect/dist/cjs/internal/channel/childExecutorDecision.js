"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isYield = exports.isClose = exports.isContinue = exports.isChildExecutorDecision = exports.Yield = exports.Close = exports.Continue = exports.ChildExecutorDecisionTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/channelChildExecutorDecision.js");
/** @internal */
const ChildExecutorDecisionSymbolKey = "effect/ChannelChildExecutorDecision";
/** @internal */
exports.ChildExecutorDecisionTypeId = /*#__PURE__*/Symbol.for(ChildExecutorDecisionSymbolKey);
/** @internal */
const proto = {
  [exports.ChildExecutorDecisionTypeId]: exports.ChildExecutorDecisionTypeId
};
/** @internal */
const Continue = _ => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_CONTINUE;
  return op;
};
exports.Continue = Continue;
/** @internal */
const Close = value => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_CLOSE;
  op.value = value;
  return op;
};
exports.Close = Close;
/** @internal */
const Yield = _ => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_YIELD;
  return op;
};
exports.Yield = Yield;
/** @internal */
const isChildExecutorDecision = u => (0, Predicate_js_1.hasProperty)(u, exports.ChildExecutorDecisionTypeId);
exports.isChildExecutorDecision = isChildExecutorDecision;
/** @internal */
const isContinue = self => self._tag === OpCodes.OP_CONTINUE;
exports.isContinue = isContinue;
/** @internal */
const isClose = self => self._tag === OpCodes.OP_CLOSE;
exports.isClose = isClose;
/** @internal */
const isYield = self => self._tag === OpCodes.OP_YIELD;
exports.isYield = isYield;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onClose,
  onContinue,
  onYield
}) => {
  switch (self._tag) {
    case OpCodes.OP_CONTINUE:
      {
        return onContinue();
      }
    case OpCodes.OP_CLOSE:
      {
        return onClose(self.value);
      }
    case OpCodes.OP_YIELD:
      {
        return onYield();
      }
  }
});
//# sourceMappingURL=childExecutorDecision.js.map