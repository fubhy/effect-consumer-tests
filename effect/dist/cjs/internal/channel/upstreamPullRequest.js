"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isNoUpstream = exports.isPulled = exports.isUpstreamPullRequest = exports.NoUpstream = exports.Pulled = exports.UpstreamPullRequestTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/channelUpstreamPullRequest.js");
/** @internal */
const UpstreamPullRequestSymbolKey = "effect/ChannelUpstreamPullRequest";
/** @internal */
exports.UpstreamPullRequestTypeId = /*#__PURE__*/Symbol.for(UpstreamPullRequestSymbolKey);
/** @internal */
const upstreamPullRequestVariance = {
  _A: _ => _
};
/** @internal */
const proto = {
  [exports.UpstreamPullRequestTypeId]: upstreamPullRequestVariance
};
/** @internal */
const Pulled = value => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_PULLED;
  op.value = value;
  return op;
};
exports.Pulled = Pulled;
/** @internal */
const NoUpstream = activeDownstreamCount => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_NO_UPSTREAM;
  op.activeDownstreamCount = activeDownstreamCount;
  return op;
};
exports.NoUpstream = NoUpstream;
/** @internal */
const isUpstreamPullRequest = u => (0, Predicate_js_1.hasProperty)(u, exports.UpstreamPullRequestTypeId);
exports.isUpstreamPullRequest = isUpstreamPullRequest;
/** @internal */
const isPulled = self => self._tag === OpCodes.OP_PULLED;
exports.isPulled = isPulled;
/** @internal */
const isNoUpstream = self => self._tag === OpCodes.OP_NO_UPSTREAM;
exports.isNoUpstream = isNoUpstream;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onNoUpstream,
  onPulled
}) => {
  switch (self._tag) {
    case OpCodes.OP_PULLED:
      {
        return onPulled(self.value);
      }
    case OpCodes.OP_NO_UPSTREAM:
      {
        return onNoUpstream(self.activeDownstreamCount);
      }
  }
});
//# sourceMappingURL=upstreamPullRequest.js.map