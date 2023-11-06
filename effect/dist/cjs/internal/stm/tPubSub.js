"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unbounded = exports.subscribeScoped = exports.subscribe = exports.sliding = exports.shutdown = exports.size = exports.publishAll = exports.publish = exports.isShutdown = exports.isFull = exports.isEmpty = exports.dropping = exports.capacity = exports.bounded = exports.awaitShutdown = exports.makeNode = exports.TPubSubTypeId = void 0;
const Effect = /*#__PURE__*/require("../../Effect.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const HashSet = /*#__PURE__*/require("../../HashSet.js");
const Option = /*#__PURE__*/require("../../Option.js");
const RA = /*#__PURE__*/require("../../ReadonlyArray.js");
const core = /*#__PURE__*/require("./core.js");
const OpCodes = /*#__PURE__*/require("./opCodes/strategy.js");
const stm = /*#__PURE__*/require("./stm.js");
const tQueue = /*#__PURE__*/require("./tQueue.js");
const tRef = /*#__PURE__*/require("./tRef.js");
/** @internal */
const TPubSubSymbolKey = "effect/TPubSub";
/** @internal */
exports.TPubSubTypeId = /*#__PURE__*/Symbol.for(TPubSubSymbolKey);
/** @internal */
const makeNode = (head, subscribers, tail) => ({
  head,
  subscribers,
  tail
});
exports.makeNode = makeNode;
/** @internal */
class TPubSubImpl {
  pubsubSize;
  publisherHead;
  publisherTail;
  requestedCapacity;
  strategy;
  subscriberCount;
  subscribers;
  [exports.TPubSubTypeId] = exports.TPubSubTypeId;
  [tQueue.TEnqueueTypeId] = tQueue.tEnqueueVariance;
  constructor(pubsubSize, publisherHead, publisherTail, requestedCapacity, strategy, subscriberCount, subscribers) {
    this.pubsubSize = pubsubSize;
    this.publisherHead = publisherHead;
    this.publisherTail = publisherTail;
    this.requestedCapacity = requestedCapacity;
    this.strategy = strategy;
    this.subscriberCount = subscriberCount;
    this.subscribers = subscribers;
  }
  isShutdown = core.effect(journal => {
    const currentPublisherTail = tRef.unsafeGet(this.publisherTail, journal);
    return currentPublisherTail === undefined;
  });
  awaitShutdown = core.flatMap(this.isShutdown, isShutdown => isShutdown ? stm.unit : core.retry);
  capacity() {
    return this.requestedCapacity;
  }
  size = core.withSTMRuntime(runtime => {
    const currentPublisherTail = tRef.unsafeGet(this.publisherTail, runtime.journal);
    if (currentPublisherTail === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    return core.succeed(tRef.unsafeGet(this.pubsubSize, runtime.journal));
  });
  isEmpty = core.map(this.size, size => size === 0);
  isFull = core.map(this.size, size => size === this.capacity());
  offer(value) {
    return core.withSTMRuntime(runtime => {
      const currentPublisherTail = tRef.unsafeGet(this.publisherTail, runtime.journal);
      if (currentPublisherTail === undefined) {
        return core.interruptAs(runtime.fiberId);
      }
      const currentSubscriberCount = tRef.unsafeGet(this.subscriberCount, runtime.journal);
      if (currentSubscriberCount === 0) {
        return core.succeed(true);
      }
      const currentPubSubSize = tRef.unsafeGet(this.pubsubSize, runtime.journal);
      if (currentPubSubSize < this.requestedCapacity) {
        const updatedPublisherTail = new tRef.TRefImpl(void 0);
        const updatedNode = (0, exports.makeNode)(value, currentSubscriberCount, updatedPublisherTail);
        tRef.unsafeSet(currentPublisherTail, updatedNode, runtime.journal);
        tRef.unsafeSet(this.publisherTail, updatedPublisherTail, runtime.journal);
        tRef.unsafeSet(this.pubsubSize, currentPubSubSize + 1, runtime.journal);
        return core.succeed(true);
      }
      switch (this.strategy._tag) {
        case OpCodes.OP_BACKPRESSURE_STRATEGY:
          {
            return core.retry;
          }
        case OpCodes.OP_DROPPING_STRATEGY:
          {
            return core.succeed(false);
          }
        case OpCodes.OP_SLIDING_STRATEGY:
          {
            if (this.requestedCapacity > 0) {
              let currentPublisherHead = tRef.unsafeGet(this.publisherHead, runtime.journal);
              let loop = true;
              while (loop) {
                const node = tRef.unsafeGet(currentPublisherHead, runtime.journal);
                if (node === undefined) {
                  return core.retry;
                }
                const head = node.head;
                const tail = node.tail;
                if (head !== undefined) {
                  const updatedNode = (0, exports.makeNode)(void 0, node.subscribers, node.tail);
                  tRef.unsafeSet(currentPublisherHead, updatedNode, runtime.journal);
                  tRef.unsafeSet(this.publisherHead, tail, runtime.journal);
                  loop = false;
                } else {
                  currentPublisherHead = tail;
                }
              }
            }
            const updatedPublisherTail = new tRef.TRefImpl(void 0);
            const updatedNode = (0, exports.makeNode)(value, currentSubscriberCount, updatedPublisherTail);
            tRef.unsafeSet(currentPublisherTail, updatedNode, runtime.journal);
            tRef.unsafeSet(this.publisherTail, updatedPublisherTail, runtime.journal);
            return core.succeed(true);
          }
      }
    });
  }
  offerAll(iterable) {
    return core.map(stm.forEach(iterable, a => this.offer(a)), RA.every(Function_js_1.identity));
  }
  shutdown = core.effect(journal => {
    const currentPublisherTail = tRef.unsafeGet(this.publisherTail, journal);
    if (currentPublisherTail !== undefined) {
      tRef.unsafeSet(this.publisherTail, void 0, journal);
      const currentSubscribers = tRef.unsafeGet(this.subscribers, journal);
      HashSet.forEach(currentSubscribers, subscriber => {
        tRef.unsafeSet(subscriber, void 0, journal);
      });
      tRef.unsafeSet(this.subscribers, HashSet.empty(), journal);
    }
  });
}
/** @internal */
class TPubSubSubscriptionImpl {
  pubsubSize;
  publisherHead;
  requestedCapacity;
  subscriberHead;
  subscriberCount;
  subscribers;
  [exports.TPubSubTypeId] = exports.TPubSubTypeId;
  [tQueue.TDequeueTypeId] = tQueue.tDequeueVariance;
  constructor(pubsubSize, publisherHead, requestedCapacity, subscriberHead, subscriberCount, subscribers) {
    this.pubsubSize = pubsubSize;
    this.publisherHead = publisherHead;
    this.requestedCapacity = requestedCapacity;
    this.subscriberHead = subscriberHead;
    this.subscriberCount = subscriberCount;
    this.subscribers = subscribers;
  }
  isShutdown = core.effect(journal => {
    const currentSubscriberHead = tRef.unsafeGet(this.subscriberHead, journal);
    return currentSubscriberHead === undefined;
  });
  awaitShutdown = core.flatMap(this.isShutdown, isShutdown => isShutdown ? stm.unit : core.retry);
  capacity() {
    return this.requestedCapacity;
  }
  size = core.withSTMRuntime(runtime => {
    let currentSubscriberHead = tRef.unsafeGet(this.subscriberHead, runtime.journal);
    if (currentSubscriberHead === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    let loop = true;
    let size = 0;
    while (loop) {
      const node = tRef.unsafeGet(currentSubscriberHead, runtime.journal);
      if (node === undefined) {
        loop = false;
      } else {
        const head = node.head;
        const tail = node.tail;
        if (head !== undefined) {
          size = size + 1;
          if (size >= Number.MAX_SAFE_INTEGER) {
            loop = false;
          }
        }
        currentSubscriberHead = tail;
      }
    }
    return core.succeed(size);
  });
  isEmpty = core.map(this.size, size => size === 0);
  isFull = core.map(this.size, size => size === this.capacity());
  peek = core.withSTMRuntime(runtime => {
    let currentSubscriberHead = tRef.unsafeGet(this.subscriberHead, runtime.journal);
    if (currentSubscriberHead === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    let value = undefined;
    let loop = true;
    while (loop) {
      const node = tRef.unsafeGet(currentSubscriberHead, runtime.journal);
      if (node === undefined) {
        return core.retry;
      }
      const head = node.head;
      const tail = node.tail;
      if (head !== undefined) {
        value = head;
        loop = false;
      } else {
        currentSubscriberHead = tail;
      }
    }
    return core.succeed(value);
  });
  peekOption = core.withSTMRuntime(runtime => {
    let currentSubscriberHead = tRef.unsafeGet(this.subscriberHead, runtime.journal);
    if (currentSubscriberHead === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    let value = Option.none();
    let loop = true;
    while (loop) {
      const node = tRef.unsafeGet(currentSubscriberHead, runtime.journal);
      if (node === undefined) {
        value = Option.none();
        loop = false;
      } else {
        const head = node.head;
        const tail = node.tail;
        if (head !== undefined) {
          value = Option.some(head);
          loop = false;
        } else {
          currentSubscriberHead = tail;
        }
      }
    }
    return core.succeed(value);
  });
  shutdown = core.effect(journal => {
    let currentSubscriberHead = tRef.unsafeGet(this.subscriberHead, journal);
    if (currentSubscriberHead !== undefined) {
      tRef.unsafeSet(this.subscriberHead, void 0, journal);
      let loop = true;
      while (loop) {
        const node = tRef.unsafeGet(currentSubscriberHead, journal);
        if (node === undefined) {
          loop = false;
        } else {
          const head = node.head;
          const tail = node.tail;
          if (head !== undefined) {
            const subscribers = node.subscribers;
            if (subscribers === 1) {
              const size = tRef.unsafeGet(this.pubsubSize, journal);
              const updatedNode = (0, exports.makeNode)(undefined, 0, tail);
              tRef.unsafeSet(currentSubscriberHead, updatedNode, journal);
              tRef.unsafeSet(this.publisherHead, tail, journal);
              tRef.unsafeSet(this.pubsubSize, size - 1, journal);
            } else {
              const updatedNode = (0, exports.makeNode)(head, subscribers - 1, tail);
              tRef.unsafeSet(currentSubscriberHead, updatedNode, journal);
            }
          }
          currentSubscriberHead = tail;
        }
      }
      const currentSubscriberCount = tRef.unsafeGet(this.subscriberCount, journal);
      tRef.unsafeSet(this.subscriberCount, currentSubscriberCount - 1, journal);
      tRef.unsafeSet(this.subscribers, HashSet.remove(tRef.unsafeGet(this.subscribers, journal), this.subscriberHead), journal);
    }
  });
  take = core.withSTMRuntime(runtime => {
    let currentSubscriberHead = tRef.unsafeGet(this.subscriberHead, runtime.journal);
    if (currentSubscriberHead === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    let value = undefined;
    let loop = true;
    while (loop) {
      const node = tRef.unsafeGet(currentSubscriberHead, runtime.journal);
      if (node === undefined) {
        return core.retry;
      }
      const head = node.head;
      const tail = node.tail;
      if (head !== undefined) {
        const subscribers = node.subscribers;
        if (subscribers === 1) {
          const size = tRef.unsafeGet(this.pubsubSize, runtime.journal);
          const updatedNode = (0, exports.makeNode)(void 0, 0, tail);
          tRef.unsafeSet(currentSubscriberHead, updatedNode, runtime.journal);
          tRef.unsafeSet(this.publisherHead, tail, runtime.journal);
          tRef.unsafeSet(this.pubsubSize, size - 1, runtime.journal);
        } else {
          const updatedNode = (0, exports.makeNode)(head, subscribers - 1, tail);
          tRef.unsafeSet(currentSubscriberHead, updatedNode, runtime.journal);
        }
        tRef.unsafeSet(this.subscriberHead, tail, runtime.journal);
        value = head;
        loop = false;
      } else {
        currentSubscriberHead = tail;
      }
    }
    return core.succeed(value);
  });
  takeAll = this.takeUpTo(Number.POSITIVE_INFINITY);
  takeUpTo(max) {
    return core.withSTMRuntime(runtime => {
      let currentSubscriberHead = tRef.unsafeGet(this.subscriberHead, runtime.journal);
      if (currentSubscriberHead === undefined) {
        return core.interruptAs(runtime.fiberId);
      }
      const builder = [];
      let n = 0;
      while (n !== max) {
        const node = tRef.unsafeGet(currentSubscriberHead, runtime.journal);
        if (node === undefined) {
          n = max;
        } else {
          const head = node.head;
          const tail = node.tail;
          if (head !== undefined) {
            const subscribers = node.subscribers;
            if (subscribers === 1) {
              const size = tRef.unsafeGet(this.pubsubSize, runtime.journal);
              const updatedNode = (0, exports.makeNode)(void 0, 0, tail);
              tRef.unsafeSet(currentSubscriberHead, updatedNode, runtime.journal);
              tRef.unsafeSet(this.publisherHead, tail, runtime.journal);
              tRef.unsafeSet(this.pubsubSize, size - 1, runtime.journal);
            } else {
              const updatedNode = (0, exports.makeNode)(head, subscribers - 1, tail);
              tRef.unsafeSet(currentSubscriberHead, updatedNode, runtime.journal);
            }
            builder.push(head);
            n = n + 1;
          }
          currentSubscriberHead = tail;
        }
      }
      tRef.unsafeSet(this.subscriberHead, currentSubscriberHead, runtime.journal);
      return core.succeed(builder);
    });
  }
}
/** @internal */
const makeTPubSub = (requestedCapacity, strategy) => (0, Function_js_1.pipe)(stm.all([tRef.make(void 0), tRef.make(0)]), core.flatMap(([empty, pubsubSize]) => (0, Function_js_1.pipe)(stm.all([tRef.make(empty), tRef.make(empty), tRef.make(0), tRef.make(HashSet.empty())]), core.map(([publisherHead, publisherTail, subscriberCount, subscribers]) => new TPubSubImpl(pubsubSize, publisherHead, publisherTail, requestedCapacity, strategy, subscriberCount, subscribers)))));
const makeSubscription = (pubsubSize, publisherHead, publisherTail, requestedCapacity, subscriberCount, subscribers) => (0, Function_js_1.pipe)(tRef.get(publisherTail), core.flatMap(currentPublisherTail => (0, Function_js_1.pipe)(stm.all([tRef.make(currentPublisherTail), tRef.get(subscriberCount), tRef.get(subscribers)]), stm.tap(([_, currentSubscriberCount]) => (0, Function_js_1.pipe)(subscriberCount, tRef.set(currentSubscriberCount + 1))), stm.tap(([subscriberHead, _, currentSubscribers]) => (0, Function_js_1.pipe)(subscribers, tRef.set((0, Function_js_1.pipe)(currentSubscribers, HashSet.add(subscriberHead))))), core.map(([subscriberHead]) => new TPubSubSubscriptionImpl(pubsubSize, publisherHead, requestedCapacity, subscriberHead, subscriberCount, subscribers)))));
/** @internal */
const awaitShutdown = self => self.awaitShutdown;
exports.awaitShutdown = awaitShutdown;
/** @internal */
const bounded = requestedCapacity => makeTPubSub(requestedCapacity, tQueue.BackPressure);
exports.bounded = bounded;
/** @internal */
const capacity = self => self.capacity();
exports.capacity = capacity;
/** @internal */
const dropping = requestedCapacity => makeTPubSub(requestedCapacity, tQueue.Dropping);
exports.dropping = dropping;
/** @internal */
const isEmpty = self => self.isEmpty;
exports.isEmpty = isEmpty;
/** @internal */
const isFull = self => self.isFull;
exports.isFull = isFull;
/** @internal */
const isShutdown = self => self.isShutdown;
exports.isShutdown = isShutdown;
/** @internal */
exports.publish = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.offer(value));
/** @internal */
exports.publishAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, iterable) => self.offerAll(iterable));
/** @internal */
const size = self => self.size;
exports.size = size;
/** @internal */
const shutdown = self => self.shutdown;
exports.shutdown = shutdown;
/** @internal */
const sliding = requestedCapacity => makeTPubSub(requestedCapacity, tQueue.Sliding);
exports.sliding = sliding;
/** @internal */
const subscribe = self => makeSubscription(self.pubsubSize, self.publisherHead, self.publisherTail, self.requestedCapacity, self.subscriberCount, self.subscribers);
exports.subscribe = subscribe;
/** @internal */
const subscribeScoped = self => Effect.acquireRelease((0, exports.subscribe)(self), dequeue => tQueue.shutdown(dequeue));
exports.subscribeScoped = subscribeScoped;
/** @internal */
const unbounded = () => makeTPubSub(Number.MAX_SAFE_INTEGER, tQueue.Dropping);
exports.unbounded = unbounded;
//# sourceMappingURL=tPubSub.js.map