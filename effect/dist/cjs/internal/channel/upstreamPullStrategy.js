"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isPullAfterAllEnqueued = exports.isPullAfterNext = exports.isUpstreamPullStrategy = exports.PullAfterAllEnqueued = exports.PullAfterNext = exports.UpstreamPullStrategyTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/channelUpstreamPullStrategy.js");
/** @internal */
const UpstreamPullStrategySymbolKey = "effect/ChannelUpstreamPullStrategy";
/** @internal */
exports.UpstreamPullStrategyTypeId = /*#__PURE__*/Symbol.for(UpstreamPullStrategySymbolKey);
/** @internal */
const upstreamPullStrategyVariance = {
  _A: _ => _
};
/** @internal */
const proto = {
  [exports.UpstreamPullStrategyTypeId]: upstreamPullStrategyVariance
};
/** @internal */
const PullAfterNext = emitSeparator => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_PULL_AFTER_NEXT;
  op.emitSeparator = emitSeparator;
  return op;
};
exports.PullAfterNext = PullAfterNext;
/** @internal */
const PullAfterAllEnqueued = emitSeparator => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_PULL_AFTER_ALL_ENQUEUED;
  op.emitSeparator = emitSeparator;
  return op;
};
exports.PullAfterAllEnqueued = PullAfterAllEnqueued;
/** @internal */
const isUpstreamPullStrategy = u => (0, Predicate_js_1.hasProperty)(u, exports.UpstreamPullStrategyTypeId);
exports.isUpstreamPullStrategy = isUpstreamPullStrategy;
/** @internal */
const isPullAfterNext = self => self._tag === OpCodes.OP_PULL_AFTER_NEXT;
exports.isPullAfterNext = isPullAfterNext;
/** @internal */
const isPullAfterAllEnqueued = self => self._tag === OpCodes.OP_PULL_AFTER_ALL_ENQUEUED;
exports.isPullAfterAllEnqueued = isPullAfterAllEnqueued;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onAllEnqueued,
  onNext
}) => {
  switch (self._tag) {
    case OpCodes.OP_PULL_AFTER_NEXT:
      {
        return onNext(self.emitSeparator);
      }
    case OpCodes.OP_PULL_AFTER_ALL_ENQUEUED:
      {
        return onAllEnqueued(self.emitSeparator);
      }
  }
});
//# sourceMappingURL=upstreamPullStrategy.js.map