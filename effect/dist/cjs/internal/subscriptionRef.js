"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = exports.modifyEffect = exports.modify = exports.make = exports.get = exports.SubscriptionRefTypeId = void 0;
const Effect = /*#__PURE__*/require("../Effect.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const PubSub = /*#__PURE__*/require("../PubSub.js");
const Ref = /*#__PURE__*/require("../Ref.js");
const Synchronized = /*#__PURE__*/require("../SynchronizedRef.js");
const _circular = /*#__PURE__*/require("./effect/circular.js");
const _ref = /*#__PURE__*/require("./ref.js");
const stream = /*#__PURE__*/require("./stream.js");
/** @internal */
const SubscriptionRefSymbolKey = "effect/SubscriptionRef";
/** @internal */
exports.SubscriptionRefTypeId = /*#__PURE__*/Symbol.for(SubscriptionRefSymbolKey);
/** @internal */
const subscriptionRefVariance = {
  _A: _ => _
};
/** @internal */
class SubscriptionRefImpl {
  ref;
  pubsub;
  semaphore;
  // @ts-ignore
  [Ref.RefTypeId] = _ref.refVariance;
  // @ts-ignore
  [Synchronized.SynchronizedRefTypeId] = _circular.synchronizedVariance;
  [exports.SubscriptionRefTypeId] = subscriptionRefVariance;
  constructor(ref, pubsub, semaphore) {
    this.ref = ref;
    this.pubsub = pubsub;
    this.semaphore = semaphore;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  get changes() {
    return (0, Function_js_1.pipe)(Ref.get(this.ref), Effect.flatMap(a => Effect.map(stream.fromPubSub(this.pubsub, {
      scoped: true
    }), s => stream.concat(stream.make(a), s))), this.semaphore.withPermits(1), stream.unwrapScoped);
  }
  modify(f) {
    return this.modifyEffect(a => Effect.succeed(f(a)));
  }
  modifyEffect(f) {
    return (0, Function_js_1.pipe)(Ref.get(this.ref), Effect.flatMap(f), Effect.flatMap(([b, a]) => (0, Function_js_1.pipe)(Ref.set(this.ref, a), Effect.as(b), Effect.zipLeft(PubSub.publish(this.pubsub, a)))), this.semaphore.withPermits(1));
  }
}
/** @internal */
const get = self => Ref.get(self.ref);
exports.get = get;
/** @internal */
const make = value => (0, Function_js_1.pipe)(Effect.all([PubSub.unbounded(), Ref.make(value), Effect.makeSemaphore(1)]), Effect.map(([pubsub, ref, semaphore]) => new SubscriptionRefImpl(ref, pubsub, semaphore)));
exports.make = make;
/** @internal */
exports.modify = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(f));
/** @internal */
exports.modifyEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modifyEffect(f));
/** @internal */
exports.set = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, Function_js_1.pipe)(Ref.set(self.ref, value), Effect.zipLeft(PubSub.publish(self.pubsub, value)), self.semaphore.withPermits(1)));
//# sourceMappingURL=subscriptionRef.js.map