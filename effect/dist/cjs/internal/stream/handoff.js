"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.poll = exports.take = exports.offer = exports.make = exports.OP_HANDOFF_STATE_FULL = exports.OP_HANDOFF_STATE_EMPTY = exports.HandoffTypeId = void 0;
const Deferred = /*#__PURE__*/require("../../Deferred.js");
const Effect = /*#__PURE__*/require("../../Effect.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
const Ref = /*#__PURE__*/require("../../Ref.js");
/** @internal */
exports.HandoffTypeId = /*#__PURE__*/Symbol.for("effect/Stream/Handoff");
/** @internal */
exports.OP_HANDOFF_STATE_EMPTY = "Empty";
/** @internal */
exports.OP_HANDOFF_STATE_FULL = "Full";
/** @internal */
const handoffStateEmpty = notifyConsumer => ({
  _tag: exports.OP_HANDOFF_STATE_EMPTY,
  notifyConsumer
});
/** @internal */
const handoffStateFull = (value, notifyProducer) => ({
  _tag: exports.OP_HANDOFF_STATE_FULL,
  value,
  notifyProducer
});
/** @internal */
const handoffStateMatch = (onEmpty, onFull) => {
  return self => {
    switch (self._tag) {
      case exports.OP_HANDOFF_STATE_EMPTY:
        {
          return onEmpty(self.notifyConsumer);
        }
      case exports.OP_HANDOFF_STATE_FULL:
        {
          return onFull(self.value, self.notifyProducer);
        }
    }
  };
};
/** @internal */
const handoffVariance = {
  _A: _ => _
};
/** @internal */
const make = () => (0, Function_js_1.pipe)(Deferred.make(), Effect.flatMap(deferred => Ref.make(handoffStateEmpty(deferred))), Effect.map(ref => ({
  [exports.HandoffTypeId]: handoffVariance,
  ref
})));
exports.make = make;
/** @internal */
exports.offer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => {
  return Effect.flatMap(Deferred.make(), deferred => Effect.flatten(Ref.modify(self.ref, state => (0, Function_js_1.pipe)(state, handoffStateMatch(notifyConsumer => [Effect.zipRight(Deferred.succeed(notifyConsumer, void 0), Deferred.await(deferred)), handoffStateFull(value, deferred)], (_, notifyProducer) => [Effect.flatMap(Deferred.await(notifyProducer), () => (0, Function_js_1.pipe)(self, (0, exports.offer)(value))), state])))));
});
/** @internal */
const take = self => Effect.flatMap(Deferred.make(), deferred => Effect.flatten(Ref.modify(self.ref, state => (0, Function_js_1.pipe)(state, handoffStateMatch(notifyConsumer => [Effect.flatMap(Deferred.await(notifyConsumer), () => (0, exports.take)(self)), state], (value, notifyProducer) => [Effect.as(Deferred.succeed(notifyProducer, void 0), value), handoffStateEmpty(deferred)])))));
exports.take = take;
/** @internal */
const poll = self => Effect.flatMap(Deferred.make(), deferred => Effect.flatten(Ref.modify(self.ref, state => (0, Function_js_1.pipe)(state, handoffStateMatch(() => [Effect.succeed(Option.none()), state], (value, notifyProducer) => [Effect.as(Deferred.succeed(notifyProducer, void 0), Option.some(value)), handoffStateEmpty(deferred)])))));
exports.poll = poll;
//# sourceMappingURL=handoff.js.map