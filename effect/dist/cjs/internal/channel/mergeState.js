"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isRightDone = exports.isLeftDone = exports.isBothRunning = exports.isMergeState = exports.RightDone = exports.LeftDone = exports.BothRunning = exports.MergeStateTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/channelMergeState.js");
/** @internal */
const MergeStateSymbolKey = "effect/ChannelMergeState";
/** @internal */
exports.MergeStateTypeId = /*#__PURE__*/Symbol.for(MergeStateSymbolKey);
/** @internal */
const proto = {
  [exports.MergeStateTypeId]: exports.MergeStateTypeId
};
/** @internal */
const BothRunning = (left, right) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_BOTH_RUNNING;
  op.left = left;
  op.right = right;
  return op;
};
exports.BothRunning = BothRunning;
/** @internal */
const LeftDone = f => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_LEFT_DONE;
  op.f = f;
  return op;
};
exports.LeftDone = LeftDone;
/** @internal */
const RightDone = f => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_RIGHT_DONE;
  op.f = f;
  return op;
};
exports.RightDone = RightDone;
/** @internal */
const isMergeState = u => (0, Predicate_js_1.hasProperty)(u, exports.MergeStateTypeId);
exports.isMergeState = isMergeState;
/** @internal */
const isBothRunning = self => {
  return self._tag === OpCodes.OP_BOTH_RUNNING;
};
exports.isBothRunning = isBothRunning;
/** @internal */
const isLeftDone = self => {
  return self._tag === OpCodes.OP_LEFT_DONE;
};
exports.isLeftDone = isLeftDone;
/** @internal */
const isRightDone = self => {
  return self._tag === OpCodes.OP_RIGHT_DONE;
};
exports.isRightDone = isRightDone;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onBothRunning,
  onLeftDone,
  onRightDone
}) => {
  switch (self._tag) {
    case OpCodes.OP_BOTH_RUNNING:
      {
        return onBothRunning(self.left, self.right);
      }
    case OpCodes.OP_LEFT_DONE:
      {
        return onLeftDone(self.f);
      }
    case OpCodes.OP_RIGHT_DONE:
      {
        return onRightDone(self.f);
      }
  }
});
//# sourceMappingURL=mergeState.js.map