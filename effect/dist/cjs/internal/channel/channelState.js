"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.effectOrUndefinedIgnored = exports.effect = exports.isRead = exports.isFromEffect = exports.isEmit = exports.isDone = exports.isChannelState = exports.Read = exports.FromEffect = exports.Emit = exports.Done = exports.ChannelStateTypeId = void 0;
const Effect = /*#__PURE__*/require("../../Effect.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/channelState.js");
/** @internal */
exports.ChannelStateTypeId = /*#__PURE__*/Symbol.for("effect/ChannelState");
/** @internal */
const channelStateVariance = {
  _R: _ => _,
  _E: _ => _
};
/** @internal */
const proto = {
  [exports.ChannelStateTypeId]: channelStateVariance
};
/** @internal */
const Done = () => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_DONE;
  return op;
};
exports.Done = Done;
/** @internal */
const Emit = () => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_EMIT;
  return op;
};
exports.Emit = Emit;
/** @internal */
const FromEffect = effect => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_FROM_EFFECT;
  op.effect = effect;
  return op;
};
exports.FromEffect = FromEffect;
/** @internal */
const Read = (upstream, onEffect, onEmit, onDone) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_READ;
  op.upstream = upstream;
  op.onEffect = onEffect;
  op.onEmit = onEmit;
  op.onDone = onDone;
  return op;
};
exports.Read = Read;
/** @internal */
const isChannelState = u => (0, Predicate_js_1.hasProperty)(u, exports.ChannelStateTypeId);
exports.isChannelState = isChannelState;
/** @internal */
const isDone = self => self._tag === OpCodes.OP_DONE;
exports.isDone = isDone;
/** @internal */
const isEmit = self => self._tag === OpCodes.OP_EMIT;
exports.isEmit = isEmit;
/** @internal */
const isFromEffect = self => self._tag === OpCodes.OP_FROM_EFFECT;
exports.isFromEffect = isFromEffect;
/** @internal */
const isRead = self => self._tag === OpCodes.OP_READ;
exports.isRead = isRead;
/** @internal */
const effect = self => (0, exports.isFromEffect)(self) ? self.effect : Effect.unit;
exports.effect = effect;
/** @internal */
const effectOrUndefinedIgnored = self => (0, exports.isFromEffect)(self) ? Effect.ignore(self.effect) : undefined;
exports.effectOrUndefinedIgnored = effectOrUndefinedIgnored;
//# sourceMappingURL=channelState.js.map