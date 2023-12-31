import * as Effect from "../../Effect.js";
import { hasProperty } from "../../Predicate.js";
import * as OpCodes from "../opCodes/channelState.js";
/** @internal */
export const ChannelStateTypeId = /*#__PURE__*/Symbol.for("effect/ChannelState");
/** @internal */
const channelStateVariance = {
  _R: _ => _,
  _E: _ => _
};
/** @internal */
const proto = {
  [ChannelStateTypeId]: channelStateVariance
};
/** @internal */
export const Done = () => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_DONE;
  return op;
};
/** @internal */
export const Emit = () => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_EMIT;
  return op;
};
/** @internal */
export const FromEffect = effect => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_FROM_EFFECT;
  op.effect = effect;
  return op;
};
/** @internal */
export const Read = (upstream, onEffect, onEmit, onDone) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_READ;
  op.upstream = upstream;
  op.onEffect = onEffect;
  op.onEmit = onEmit;
  op.onDone = onDone;
  return op;
};
/** @internal */
export const isChannelState = u => hasProperty(u, ChannelStateTypeId);
/** @internal */
export const isDone = self => self._tag === OpCodes.OP_DONE;
/** @internal */
export const isEmit = self => self._tag === OpCodes.OP_EMIT;
/** @internal */
export const isFromEffect = self => self._tag === OpCodes.OP_FROM_EFFECT;
/** @internal */
export const isRead = self => self._tag === OpCodes.OP_READ;
/** @internal */
export const effect = self => isFromEffect(self) ? self.effect : Effect.unit;
/** @internal */
export const effectOrUndefinedIgnored = self => isFromEffect(self) ? Effect.ignore(self.effect) : undefined;
//# sourceMappingURL=channelState.js.map