"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlidingStrategy = exports.DroppingStrategy = exports.unsafeMakePubSub = exports.makePubSub = exports.unsafeMakeSubscription = exports.subscribe = exports.publishAll = exports.publish = exports.awaitShutdown = exports.isShutdown = exports.shutdown = exports.isEmpty = exports.isFull = exports.size = exports.capacity = exports.unbounded = exports.sliding = exports.dropping = exports.bounded = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const MutableQueue = /*#__PURE__*/require("../MutableQueue.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const cause = /*#__PURE__*/require("./cause.js");
const core = /*#__PURE__*/require("./core.js");
const executionStrategy = /*#__PURE__*/require("./executionStrategy.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const queue = /*#__PURE__*/require("./queue.js");
const addSubscribers = (subscription, pollers) => subscribers => {
  if (!subscribers.has(subscription)) {
    subscribers.set(subscription, new Set());
  }
  const set = subscribers.get(subscription);
  set.add(pollers);
};
const removeSubscribers = (subscription, pollers) => subscribers => {
  if (!subscribers.has(subscription)) {
    return;
  }
  const set = subscribers.get(subscription);
  set.delete(pollers);
  if (set.size === 0) {
    subscribers.delete(subscription);
  }
};
/** @internal */
const bounded = requestedCapacity => (0, Function_js_1.pipe)(core.sync(() => makeBoundedPubSub(requestedCapacity)), core.flatMap(atomicPubSub => (0, exports.makePubSub)(atomicPubSub, new BackPressureStrategy())));
exports.bounded = bounded;
/** @internal */
const dropping = requestedCapacity => (0, Function_js_1.pipe)(core.sync(() => makeBoundedPubSub(requestedCapacity)), core.flatMap(atomicPubSub => (0, exports.makePubSub)(atomicPubSub, new DroppingStrategy())));
exports.dropping = dropping;
/** @internal */
const sliding = requestedCapacity => (0, Function_js_1.pipe)(core.sync(() => makeBoundedPubSub(requestedCapacity)), core.flatMap(atomicPubSub => (0, exports.makePubSub)(atomicPubSub, new SlidingStrategy())));
exports.sliding = sliding;
/** @internal */
const unbounded = () => (0, Function_js_1.pipe)(core.sync(() => makeUnboundedPubSub()), core.flatMap(atomicPubSub => (0, exports.makePubSub)(atomicPubSub, new DroppingStrategy())));
exports.unbounded = unbounded;
/** @internal */
const capacity = self => self.capacity();
exports.capacity = capacity;
/** @internal */
const size = self => self.size();
exports.size = size;
/** @internal */
const isFull = self => self.isFull();
exports.isFull = isFull;
/** @internal */
const isEmpty = self => self.isEmpty();
exports.isEmpty = isEmpty;
/** @internal */
const shutdown = self => self.shutdown();
exports.shutdown = shutdown;
/** @internal */
const isShutdown = self => self.isShutdown();
exports.isShutdown = isShutdown;
/** @internal */
const awaitShutdown = self => self.awaitShutdown();
exports.awaitShutdown = awaitShutdown;
/** @internal */
exports.publish = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.publish(value));
/** @internal */
exports.publishAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, elements) => self.publishAll(elements));
/** @internal */
const subscribe = self => self.subscribe();
exports.subscribe = subscribe;
/** @internal */
const makeBoundedPubSub = requestedCapacity => {
  ensureCapacity(requestedCapacity);
  if (requestedCapacity === 1) {
    return new BoundedPubSubSingle();
  } else if (nextPow2(requestedCapacity) === requestedCapacity) {
    return new BoundedPubSubPow2(requestedCapacity);
  } else {
    return new BoundedPubSubArb(requestedCapacity);
  }
};
/** @internal */
const makeUnboundedPubSub = () => {
  return new UnboundedPubSub();
};
/** @internal */
const makeSubscription = (pubsub, subscribers, strategy) => core.map(core.deferredMake(), deferred => (0, exports.unsafeMakeSubscription)(pubsub, subscribers, pubsub.subscribe(), MutableQueue.unbounded(), deferred, MutableRef.make(false), strategy));
/** @internal */
const unsafeMakeSubscription = (pubsub, subscribers, subscription, pollers, shutdownHook, shutdownFlag, strategy) => {
  return new SubscriptionImpl(pubsub, subscribers, subscription, pollers, shutdownHook, shutdownFlag, strategy);
};
exports.unsafeMakeSubscription = unsafeMakeSubscription;
/** @internal */
class BoundedPubSubArb {
  array;
  publisherIndex = 0;
  subscribers;
  subscriberCount = 0;
  subscribersIndex = 0;
  capacity;
  constructor(requestedCapacity) {
    this.array = Array.from({
      length: requestedCapacity
    });
    this.subscribers = Array.from({
      length: requestedCapacity
    });
    this.capacity = requestedCapacity;
  }
  isEmpty() {
    return this.publisherIndex === this.subscribersIndex;
  }
  isFull() {
    return this.publisherIndex === this.subscribersIndex + this.capacity;
  }
  size() {
    return this.publisherIndex - this.subscribersIndex;
  }
  publish(value) {
    if (this.isFull()) {
      return false;
    }
    if (this.subscriberCount !== 0) {
      const index = this.publisherIndex % this.capacity;
      this.array[index] = value;
      this.subscribers[index] = this.subscriberCount;
      this.publisherIndex += 1;
    }
    return true;
  }
  publishAll(elements) {
    const chunk = Chunk.fromIterable(elements);
    const n = chunk.length;
    const size = this.publisherIndex - this.subscribersIndex;
    const available = this.capacity - size;
    const forPubSub = Math.min(n, available);
    if (forPubSub === 0) {
      return chunk;
    }
    let iteratorIndex = 0;
    const publishAllIndex = this.publisherIndex + forPubSub;
    while (this.publisherIndex !== publishAllIndex) {
      const a = Chunk.unsafeGet(chunk, iteratorIndex++);
      const index = this.publisherIndex % this.capacity;
      this.array[index] = a;
      this.subscribers[index] = this.subscriberCount;
      this.publisherIndex += 1;
    }
    return Chunk.drop(chunk, iteratorIndex);
  }
  slide() {
    if (this.subscribersIndex !== this.publisherIndex) {
      const index = this.subscribersIndex % this.capacity;
      this.array[index] = null;
      this.subscribers[index] = 0;
      this.subscribersIndex += 1;
    }
  }
  subscribe() {
    this.subscriberCount += 1;
    return new BoundedPubSubArbSubscription(this, this.publisherIndex, false);
  }
}
class BoundedPubSubArbSubscription {
  self;
  subscriberIndex;
  unsubscribed;
  constructor(self, subscriberIndex, unsubscribed) {
    this.self = self;
    this.subscriberIndex = subscriberIndex;
    this.unsubscribed = unsubscribed;
  }
  isEmpty() {
    return this.unsubscribed || this.self.publisherIndex === this.subscriberIndex || this.self.publisherIndex === this.self.subscribersIndex;
  }
  size() {
    if (this.unsubscribed) {
      return 0;
    }
    return this.self.publisherIndex - Math.max(this.subscriberIndex, this.self.subscribersIndex);
  }
  poll(default_) {
    if (this.unsubscribed) {
      return default_;
    }
    this.subscriberIndex = Math.max(this.subscriberIndex, this.self.subscribersIndex);
    if (this.subscriberIndex !== this.self.publisherIndex) {
      const index = this.subscriberIndex % this.self.capacity;
      const elem = this.self.array[index];
      this.self.subscribers[index] -= 1;
      if (this.self.subscribers[index] === 0) {
        this.self.array[index] = null;
        this.self.subscribersIndex += 1;
      }
      this.subscriberIndex += 1;
      return elem;
    }
    return default_;
  }
  pollUpTo(n) {
    if (this.unsubscribed) {
      return Chunk.empty();
    }
    this.subscriberIndex = Math.max(this.subscriberIndex, this.self.subscribersIndex);
    const size = this.self.publisherIndex - this.subscriberIndex;
    const toPoll = Math.min(n, size);
    if (toPoll <= 0) {
      return Chunk.empty();
    }
    const builder = [];
    const pollUpToIndex = this.subscriberIndex + toPoll;
    while (this.subscriberIndex !== pollUpToIndex) {
      const index = this.subscriberIndex % this.self.capacity;
      const a = this.self.array[index];
      this.self.subscribers[index] -= 1;
      if (this.self.subscribers[index] === 0) {
        this.self.array[index] = null;
        this.self.subscribersIndex += 1;
      }
      builder.push(a);
      this.subscriberIndex += 1;
    }
    return Chunk.fromIterable(builder);
  }
  unsubscribe() {
    if (!this.unsubscribed) {
      this.unsubscribed = true;
      this.self.subscriberCount -= 1;
      this.subscriberIndex = Math.max(this.subscriberIndex, this.self.subscribersIndex);
      while (this.subscriberIndex !== this.self.publisherIndex) {
        const index = this.subscriberIndex % this.self.capacity;
        this.self.subscribers[index] -= 1;
        if (this.self.subscribers[index] === 0) {
          this.self.array[index] = null;
          this.self.subscribersIndex += 1;
        }
        this.subscriberIndex += 1;
      }
    }
  }
}
/** @internal */
class BoundedPubSubPow2 {
  array;
  mask;
  publisherIndex = 0;
  subscribers;
  subscriberCount = 0;
  subscribersIndex = 0;
  capacity;
  constructor(requestedCapacity) {
    this.array = Array.from({
      length: requestedCapacity
    });
    this.mask = requestedCapacity - 1;
    this.subscribers = Array.from({
      length: requestedCapacity
    });
    this.capacity = requestedCapacity;
  }
  isEmpty() {
    return this.publisherIndex === this.subscribersIndex;
  }
  isFull() {
    return this.publisherIndex === this.subscribersIndex + this.capacity;
  }
  size() {
    return this.publisherIndex - this.subscribersIndex;
  }
  publish(value) {
    if (this.isFull()) {
      return false;
    }
    if (this.subscriberCount !== 0) {
      const index = this.publisherIndex & this.mask;
      this.array[index] = value;
      this.subscribers[index] = this.subscriberCount;
      this.publisherIndex += 1;
    }
    return true;
  }
  publishAll(elements) {
    const chunk = Chunk.fromIterable(elements);
    const n = chunk.length;
    const size = this.publisherIndex - this.subscribersIndex;
    const available = this.capacity - size;
    const forPubSub = Math.min(n, available);
    if (forPubSub === 0) {
      return chunk;
    }
    let iteratorIndex = 0;
    const publishAllIndex = this.publisherIndex + forPubSub;
    while (this.publisherIndex !== publishAllIndex) {
      const elem = Chunk.unsafeGet(chunk, iteratorIndex++);
      const index = this.publisherIndex & this.mask;
      this.array[index] = elem;
      this.subscribers[index] = this.subscriberCount;
      this.publisherIndex += 1;
    }
    return Chunk.drop(chunk, iteratorIndex);
  }
  slide() {
    if (this.subscribersIndex !== this.publisherIndex) {
      const index = this.subscribersIndex & this.mask;
      this.array[index] = null;
      this.subscribers[index] = 0;
      this.subscribersIndex += 1;
    }
  }
  subscribe() {
    this.subscriberCount += 1;
    return new BoundedPubSubPow2Subscription(this, this.publisherIndex, false);
  }
}
/** @internal */
class BoundedPubSubPow2Subscription {
  self;
  subscriberIndex;
  unsubscribed;
  constructor(self, subscriberIndex, unsubscribed) {
    this.self = self;
    this.subscriberIndex = subscriberIndex;
    this.unsubscribed = unsubscribed;
  }
  isEmpty() {
    return this.unsubscribed || this.self.publisherIndex === this.subscriberIndex || this.self.publisherIndex === this.self.subscribersIndex;
  }
  size() {
    if (this.unsubscribed) {
      return 0;
    }
    return this.self.publisherIndex - Math.max(this.subscriberIndex, this.self.subscribersIndex);
  }
  poll(default_) {
    if (this.unsubscribed) {
      return default_;
    }
    this.subscriberIndex = Math.max(this.subscriberIndex, this.self.subscribersIndex);
    if (this.subscriberIndex !== this.self.publisherIndex) {
      const index = this.subscriberIndex & this.self.mask;
      const elem = this.self.array[index];
      this.self.subscribers[index] -= 1;
      if (this.self.subscribers[index] === 0) {
        this.self.array[index] = null;
        this.self.subscribersIndex += 1;
      }
      this.subscriberIndex += 1;
      return elem;
    }
    return default_;
  }
  pollUpTo(n) {
    if (this.unsubscribed) {
      return Chunk.empty();
    }
    this.subscriberIndex = Math.max(this.subscriberIndex, this.self.subscribersIndex);
    const size = this.self.publisherIndex - this.subscriberIndex;
    const toPoll = Math.min(n, size);
    if (toPoll <= 0) {
      return Chunk.empty();
    }
    const builder = [];
    const pollUpToIndex = this.subscriberIndex + toPoll;
    while (this.subscriberIndex !== pollUpToIndex) {
      const index = this.subscriberIndex & this.self.mask;
      const elem = this.self.array[index];
      this.self.subscribers[index] -= 1;
      if (this.self.subscribers[index] === 0) {
        this.self.array[index] = null;
        this.self.subscribersIndex += 1;
      }
      builder.push(elem);
      this.subscriberIndex += 1;
    }
    return Chunk.fromIterable(builder);
  }
  unsubscribe() {
    if (!this.unsubscribed) {
      this.unsubscribed = true;
      this.self.subscriberCount -= 1;
      this.subscriberIndex = Math.max(this.subscriberIndex, this.self.subscribersIndex);
      while (this.subscriberIndex !== this.self.publisherIndex) {
        const index = this.subscriberIndex & this.self.mask;
        this.self.subscribers[index] -= 1;
        if (this.self.subscribers[index] === 0) {
          this.self.array[index] = null;
          this.self.subscribersIndex += 1;
        }
        this.subscriberIndex += 1;
      }
    }
  }
}
/** @internal */
class BoundedPubSubSingle {
  publisherIndex = 0;
  subscriberCount = 0;
  subscribers = 0;
  value = null;
  capacity = 1;
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  isEmpty() {
    return this.subscribers === 0;
  }
  isFull() {
    return !this.isEmpty();
  }
  size() {
    return this.isEmpty() ? 0 : 1;
  }
  publish(value) {
    if (this.isFull()) {
      return false;
    }
    if (this.subscriberCount !== 0) {
      this.value = value;
      this.subscribers = this.subscriberCount;
      this.publisherIndex += 1;
    }
    return true;
  }
  publishAll(elements) {
    const chunk = Chunk.fromIterable(elements);
    if (Chunk.isEmpty(chunk)) {
      return chunk;
    }
    if (this.publish(Chunk.unsafeHead(chunk))) {
      return Chunk.drop(chunk, 1);
    } else {
      return chunk;
    }
  }
  slide() {
    if (this.isFull()) {
      this.subscribers = 0;
      this.value = null;
    }
  }
  subscribe() {
    this.subscriberCount += 1;
    return new BoundedPubSubSingleSubscription(this, this.publisherIndex, false);
  }
}
/** @internal */
class BoundedPubSubSingleSubscription {
  self;
  subscriberIndex;
  unsubscribed;
  constructor(self, subscriberIndex, unsubscribed) {
    this.self = self;
    this.subscriberIndex = subscriberIndex;
    this.unsubscribed = unsubscribed;
  }
  isEmpty() {
    return this.unsubscribed || this.self.subscribers === 0 || this.subscriberIndex === this.self.publisherIndex;
  }
  size() {
    return this.isEmpty() ? 0 : 1;
  }
  poll(default_) {
    if (this.isEmpty()) {
      return default_;
    }
    const elem = this.self.value;
    this.self.subscribers -= 1;
    if (this.self.subscribers === 0) {
      this.self.value = null;
    }
    this.subscriberIndex += 1;
    return elem;
  }
  pollUpTo(n) {
    if (this.isEmpty() || n < 1) {
      return Chunk.empty();
    }
    const a = this.self.value;
    this.self.subscribers -= 1;
    if (this.self.subscribers === 0) {
      this.self.value = null;
    }
    this.subscriberIndex += 1;
    return Chunk.of(a);
  }
  unsubscribe() {
    if (!this.unsubscribed) {
      this.unsubscribed = true;
      this.self.subscriberCount -= 1;
      if (this.subscriberIndex !== this.self.publisherIndex) {
        this.self.subscribers -= 1;
        if (this.self.subscribers === 0) {
          this.self.value = null;
        }
      }
    }
  }
}
/** @internal */
class Node {
  value;
  subscribers;
  next;
  constructor(value, subscribers, next) {
    this.value = value;
    this.subscribers = subscribers;
    this.next = next;
  }
}
/** @internal */
class UnboundedPubSub {
  publisherHead = new Node(null, 0, null);
  publisherIndex = 0;
  publisherTail;
  subscribersIndex = 0;
  capacity = Number.MAX_SAFE_INTEGER;
  constructor() {
    this.publisherTail = this.publisherHead;
  }
  isEmpty() {
    return this.publisherHead === this.publisherTail;
  }
  isFull() {
    return false;
  }
  size() {
    return this.publisherIndex - this.subscribersIndex;
  }
  publish(value) {
    const subscribers = this.publisherTail.subscribers;
    if (subscribers !== 0) {
      this.publisherTail.next = new Node(value, subscribers, null);
      this.publisherTail = this.publisherTail.next;
      this.publisherIndex += 1;
    }
    return true;
  }
  publishAll(elements) {
    for (const a of elements) {
      this.publish(a);
    }
    return Chunk.empty();
  }
  slide() {
    if (this.publisherHead !== this.publisherTail) {
      this.publisherHead = this.publisherHead.next;
      this.publisherHead.value = null;
      this.subscribersIndex += 1;
    }
  }
  subscribe() {
    this.publisherTail.subscribers += 1;
    return new UnboundedPubSubSubscription(this, this.publisherTail, this.publisherIndex, false);
  }
}
/** @internal */
class UnboundedPubSubSubscription {
  self;
  subscriberHead;
  subscriberIndex;
  unsubscribed;
  constructor(self, subscriberHead, subscriberIndex, unsubscribed) {
    this.self = self;
    this.subscriberHead = subscriberHead;
    this.subscriberIndex = subscriberIndex;
    this.unsubscribed = unsubscribed;
  }
  isEmpty() {
    if (this.unsubscribed) {
      return true;
    }
    let empty = true;
    let loop = true;
    while (loop) {
      if (this.subscriberHead === this.self.publisherTail) {
        loop = false;
      } else {
        if (this.subscriberHead.next.value !== null) {
          empty = false;
          loop = false;
        } else {
          this.subscriberHead = this.subscriberHead.next;
          this.subscriberIndex += 1;
        }
      }
    }
    return empty;
  }
  size() {
    if (this.unsubscribed) {
      return 0;
    }
    return this.self.publisherIndex - Math.max(this.subscriberIndex, this.self.subscribersIndex);
  }
  poll(default_) {
    if (this.unsubscribed) {
      return default_;
    }
    let loop = true;
    let polled = default_;
    while (loop) {
      if (this.subscriberHead === this.self.publisherTail) {
        loop = false;
      } else {
        const elem = this.subscriberHead.next.value;
        if (elem !== null) {
          polled = elem;
          this.subscriberHead.subscribers -= 1;
          if (this.subscriberHead.subscribers === 0) {
            this.self.publisherHead = this.self.publisherHead.next;
            this.self.publisherHead.value = null;
            this.self.subscribersIndex += 1;
          }
          loop = false;
        }
        this.subscriberHead = this.subscriberHead.next;
        this.subscriberIndex += 1;
      }
    }
    return polled;
  }
  pollUpTo(n) {
    const builder = [];
    const default_ = null;
    let i = 0;
    while (i !== n) {
      const a = this.poll(default_);
      if (a === default_) {
        i = n;
      } else {
        builder.push(a);
        i += 1;
      }
    }
    return Chunk.fromIterable(builder);
  }
  unsubscribe() {
    if (!this.unsubscribed) {
      this.unsubscribed = true;
      this.self.publisherTail.subscribers -= 1;
      while (this.subscriberHead !== this.self.publisherTail) {
        if (this.subscriberHead.next.value !== null) {
          this.subscriberHead.subscribers -= 1;
          if (this.subscriberHead.subscribers === 0) {
            this.self.publisherHead = this.self.publisherHead.next;
            this.self.publisherHead.value = null;
            this.self.subscribersIndex += 1;
          }
        }
        this.subscriberHead = this.subscriberHead.next;
      }
    }
  }
}
/** @internal */
class SubscriptionImpl {
  pubsub;
  subscribers;
  subscription;
  pollers;
  shutdownHook;
  shutdownFlag;
  strategy;
  [queue.DequeueTypeId] = queue.dequeueVariance;
  constructor(pubsub, subscribers, subscription, pollers, shutdownHook, shutdownFlag, strategy) {
    this.pubsub = pubsub;
    this.subscribers = subscribers;
    this.subscription = subscription;
    this.pollers = pollers;
    this.shutdownHook = shutdownHook;
    this.shutdownFlag = shutdownFlag;
    this.strategy = strategy;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  capacity() {
    return this.pubsub.capacity;
  }
  isActive() {
    return !MutableRef.get(this.shutdownFlag);
  }
  size() {
    return core.suspend(() => MutableRef.get(this.shutdownFlag) ? core.interrupt : core.succeed(this.subscription.size()));
  }
  unsafeSize() {
    if (MutableRef.get(this.shutdownFlag)) {
      return Option.none();
    }
    return Option.some(this.subscription.size());
  }
  isFull() {
    return core.map(this.size(), size => size === this.capacity());
  }
  isEmpty() {
    return core.map(this.size(), size => size === 0);
  }
  shutdown() {
    return core.uninterruptible(core.withFiberRuntime(state => {
      MutableRef.set(this.shutdownFlag, true);
      return (0, Function_js_1.pipe)(fiberRuntime.forEachParUnbounded(unsafePollAllQueue(this.pollers), d => core.deferredInterruptWith(d, state.id()), false), core.zipRight(core.sync(() => {
        this.subscribers.delete(this.subscription);
        this.subscription.unsubscribe();
        this.strategy.unsafeOnPubSubEmptySpace(this.pubsub, this.subscribers);
      })), core.whenEffect(core.deferredSucceed(this.shutdownHook, void 0)), core.asUnit);
    }));
  }
  isShutdown() {
    return core.sync(() => MutableRef.get(this.shutdownFlag));
  }
  awaitShutdown() {
    return core.deferredAwait(this.shutdownHook);
  }
  take() {
    return core.withFiberRuntime(state => {
      if (MutableRef.get(this.shutdownFlag)) {
        return core.interrupt;
      }
      const message = MutableQueue.isEmpty(this.pollers) ? this.subscription.poll(MutableQueue.EmptyMutableQueue) : MutableQueue.EmptyMutableQueue;
      if (message === MutableQueue.EmptyMutableQueue) {
        const deferred = core.deferredUnsafeMake(state.id());
        return (0, Function_js_1.pipe)(core.suspend(() => {
          (0, Function_js_1.pipe)(this.pollers, MutableQueue.offer(deferred));
          (0, Function_js_1.pipe)(this.subscribers, addSubscribers(this.subscription, this.pollers));
          this.strategy.unsafeCompletePollers(this.pubsub, this.subscribers, this.subscription, this.pollers);
          return MutableRef.get(this.shutdownFlag) ? core.interrupt : core.deferredAwait(deferred);
        }), core.onInterrupt(() => core.sync(() => unsafeRemove(this.pollers, deferred))));
      } else {
        this.strategy.unsafeOnPubSubEmptySpace(this.pubsub, this.subscribers);
        return core.succeed(message);
      }
    });
  }
  takeAll() {
    return core.suspend(() => {
      if (MutableRef.get(this.shutdownFlag)) {
        return core.interrupt;
      }
      const as = MutableQueue.isEmpty(this.pollers) ? unsafePollAllSubscription(this.subscription) : Chunk.empty();
      this.strategy.unsafeOnPubSubEmptySpace(this.pubsub, this.subscribers);
      return core.succeed(as);
    });
  }
  takeUpTo(max) {
    return core.suspend(() => {
      if (MutableRef.get(this.shutdownFlag)) {
        return core.interrupt;
      }
      const as = MutableQueue.isEmpty(this.pollers) ? unsafePollN(this.subscription, max) : Chunk.empty();
      this.strategy.unsafeOnPubSubEmptySpace(this.pubsub, this.subscribers);
      return core.succeed(as);
    });
  }
  takeBetween(min, max) {
    return core.suspend(() => takeRemainderLoop(this, min, max, Chunk.empty()));
  }
}
/** @internal */
const takeRemainderLoop = (self, min, max, acc) => {
  if (max < min) {
    return core.succeed(acc);
  }
  return (0, Function_js_1.pipe)(self.takeUpTo(max), core.flatMap(bs => {
    const remaining = min - bs.length;
    if (remaining === 1) {
      return (0, Function_js_1.pipe)(self.take(), core.map(b => (0, Function_js_1.pipe)(acc, Chunk.appendAll(bs), Chunk.append(b))));
    }
    if (remaining > 1) {
      return (0, Function_js_1.pipe)(self.take(), core.flatMap(b => takeRemainderLoop(self, remaining - 1, max - bs.length - 1, (0, Function_js_1.pipe)(acc, Chunk.appendAll(bs), Chunk.append(b)))));
    }
    return core.succeed((0, Function_js_1.pipe)(acc, Chunk.appendAll(bs)));
  }));
};
/** @internal */
class PubSubImpl {
  pubsub;
  subscribers;
  scope;
  shutdownHook;
  shutdownFlag;
  strategy;
  [queue.EnqueueTypeId] = queue.enqueueVariance;
  constructor(pubsub, subscribers, scope, shutdownHook, shutdownFlag, strategy) {
    this.pubsub = pubsub;
    this.subscribers = subscribers;
    this.scope = scope;
    this.shutdownHook = shutdownHook;
    this.shutdownFlag = shutdownFlag;
    this.strategy = strategy;
  }
  capacity() {
    return this.pubsub.capacity;
  }
  size() {
    return core.suspend(() => MutableRef.get(this.shutdownFlag) ? core.interrupt : core.sync(() => this.pubsub.size()));
  }
  unsafeSize() {
    if (MutableRef.get(this.shutdownFlag)) {
      return Option.none();
    }
    return Option.some(this.pubsub.size());
  }
  isFull() {
    return core.map(this.size(), size => size === this.capacity());
  }
  isEmpty() {
    return core.map(this.size(), size => size === 0);
  }
  awaitShutdown() {
    return core.deferredAwait(this.shutdownHook);
  }
  isShutdown() {
    return core.sync(() => MutableRef.get(this.shutdownFlag));
  }
  shutdown() {
    return core.uninterruptible(core.withFiberRuntime(state => {
      (0, Function_js_1.pipe)(this.shutdownFlag, MutableRef.set(true));
      return (0, Function_js_1.pipe)(this.scope.close(core.exitInterrupt(state.id())), core.zipRight(this.strategy.shutdown()), core.whenEffect(core.deferredSucceed(this.shutdownHook, void 0)), core.asUnit);
    }));
  }
  publish(value) {
    return core.suspend(() => {
      if (MutableRef.get(this.shutdownFlag)) {
        return core.interrupt;
      }
      if (this.pubsub.publish(value)) {
        this.strategy.unsafeCompleteSubscribers(this.pubsub, this.subscribers);
        return core.succeed(true);
      }
      return this.strategy.handleSurplus(this.pubsub, this.subscribers, Chunk.of(value), this.shutdownFlag);
    });
  }
  isActive() {
    return !MutableRef.get(this.shutdownFlag);
  }
  unsafeOffer(value) {
    if (MutableRef.get(this.shutdownFlag)) {
      return false;
    }
    if (this.pubsub.publish(value)) {
      this.strategy.unsafeCompleteSubscribers(this.pubsub, this.subscribers);
      return true;
    }
    return false;
  }
  publishAll(elements) {
    return core.suspend(() => {
      if (MutableRef.get(this.shutdownFlag)) {
        return core.interrupt;
      }
      const surplus = unsafePublishAll(this.pubsub, elements);
      this.strategy.unsafeCompleteSubscribers(this.pubsub, this.subscribers);
      if (Chunk.isEmpty(surplus)) {
        return core.succeed(true);
      }
      return this.strategy.handleSurplus(this.pubsub, this.subscribers, surplus, this.shutdownFlag);
    });
  }
  subscribe() {
    const acquire = core.tap(fiberRuntime.all([this.scope.fork(executionStrategy.sequential), makeSubscription(this.pubsub, this.subscribers, this.strategy)]), tuple => tuple[0].addFinalizer(() => tuple[1].shutdown()));
    return core.map(fiberRuntime.acquireRelease(acquire, (tuple, exit) => tuple[0].close(exit)), tuple => tuple[1]);
  }
  offer(value) {
    return this.publish(value);
  }
  offerAll(elements) {
    return this.publishAll(elements);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
const makePubSub = (pubsub, strategy) => core.flatMap(fiberRuntime.scopeMake(), scope => core.map(core.deferredMake(), deferred => (0, exports.unsafeMakePubSub)(pubsub, new Map(), scope, deferred, MutableRef.make(false), strategy)));
exports.makePubSub = makePubSub;
/** @internal */
const unsafeMakePubSub = (pubsub, subscribers, scope, shutdownHook, shutdownFlag, strategy) => {
  return new PubSubImpl(pubsub, subscribers, scope, shutdownHook, shutdownFlag, strategy);
};
exports.unsafeMakePubSub = unsafeMakePubSub;
/** @internal */
const nextPow2 = n => {
  const nextPow = Math.ceil(Math.log(n) / Math.log(2.0));
  return Math.max(Math.pow(2, nextPow), 2);
};
/** @internal */
const ensureCapacity = capacity => {
  if (capacity <= 0) {
    throw cause.InvalidPubSubCapacityException(`Cannot construct PubSub with capacity of ${capacity}`);
  }
};
/** @internal */
const unsafeCompleteDeferred = (deferred, a) => {
  core.deferredUnsafeDone(deferred, core.succeed(a));
};
/** @internal */
const unsafeOfferAll = (queue, as) => {
  return (0, Function_js_1.pipe)(queue, MutableQueue.offerAll(as));
};
/** @internal */
const unsafePollAllQueue = queue => {
  return (0, Function_js_1.pipe)(queue, MutableQueue.pollUpTo(Number.POSITIVE_INFINITY));
};
/** @internal */
const unsafePollAllSubscription = subscription => {
  return subscription.pollUpTo(Number.POSITIVE_INFINITY);
};
/** @internal */
const unsafePollN = (subscription, max) => {
  return subscription.pollUpTo(max);
};
/** @internal */
const unsafePublishAll = (pubsub, as) => {
  return pubsub.publishAll(as);
};
/** @internal */
const unsafeRemove = (queue, value) => {
  unsafeOfferAll(queue, (0, Function_js_1.pipe)(unsafePollAllQueue(queue), Chunk.filter(elem => elem !== value)));
};
/**
 * A strategy that applies back pressure to publishers when the `PubSub` is at
 * capacity. This guarantees that all subscribers will receive all messages
 * published to the `PubSub` while they are subscribed. However, it creates the
 * risk that a slow subscriber will slow down the rate at which messages
 * are published and received by other subscribers.
 *
 * @internal
 */
class BackPressureStrategy {
  publishers = MutableQueue.unbounded();
  shutdown() {
    return core.flatMap(core.fiberId, fiberId => core.flatMap(core.sync(() => unsafePollAllQueue(this.publishers)), publishers => fiberRuntime.forEachParUnboundedDiscard(publishers, ([_, deferred, last]) => last ? (0, Function_js_1.pipe)(core.deferredInterruptWith(deferred, fiberId), core.asUnit) : core.unit, false)));
  }
  handleSurplus(pubsub, subscribers, elements, isShutdown) {
    return core.withFiberRuntime(state => {
      const deferred = core.deferredUnsafeMake(state.id());
      return (0, Function_js_1.pipe)(core.suspend(() => {
        this.unsafeOffer(elements, deferred);
        this.unsafeOnPubSubEmptySpace(pubsub, subscribers);
        this.unsafeCompleteSubscribers(pubsub, subscribers);
        return MutableRef.get(isShutdown) ? core.interrupt : core.deferredAwait(deferred);
      }), core.onInterrupt(() => core.sync(() => this.unsafeRemove(deferred))));
    });
  }
  unsafeOnPubSubEmptySpace(pubsub, subscribers) {
    let keepPolling = true;
    while (keepPolling && !pubsub.isFull()) {
      const publisher = (0, Function_js_1.pipe)(this.publishers, MutableQueue.poll(MutableQueue.EmptyMutableQueue));
      if (publisher === MutableQueue.EmptyMutableQueue) {
        keepPolling = false;
      } else {
        const published = pubsub.publish(publisher[0]);
        if (published && publisher[2]) {
          unsafeCompleteDeferred(publisher[1], true);
        } else if (!published) {
          unsafeOfferAll(this.publishers, (0, Function_js_1.pipe)(unsafePollAllQueue(this.publishers), Chunk.prepend(publisher)));
        }
        this.unsafeCompleteSubscribers(pubsub, subscribers);
      }
    }
  }
  unsafeCompletePollers(pubsub, subscribers, subscription, pollers) {
    return unsafeStrategyCompletePollers(this, pubsub, subscribers, subscription, pollers);
  }
  unsafeCompleteSubscribers(pubsub, subscribers) {
    return unsafeStrategyCompleteSubscribers(this, pubsub, subscribers);
  }
  unsafeOffer(elements, deferred) {
    const iterator = elements[Symbol.iterator]();
    let next = iterator.next();
    if (!next.done) {
      // eslint-disable-next-line no-constant-condition
      while (1) {
        const value = next.value;
        next = iterator.next();
        if (next.done) {
          (0, Function_js_1.pipe)(this.publishers, MutableQueue.offer([value, deferred, true]));
          break;
        }
        (0, Function_js_1.pipe)(this.publishers, MutableQueue.offer([value, deferred, false]));
      }
    }
  }
  unsafeRemove(deferred) {
    unsafeOfferAll(this.publishers, (0, Function_js_1.pipe)(unsafePollAllQueue(this.publishers), Chunk.filter(([_, a]) => a !== deferred)));
  }
}
/**
 * A strategy that drops new messages when the `PubSub` is at capacity. This
 * guarantees that a slow subscriber will not slow down the rate at which
 * messages are published. However, it creates the risk that a slow
 * subscriber will slow down the rate at which messages are received by
 * other subscribers and that subscribers may not receive all messages
 * published to the `PubSub` while they are subscribed.
 *
 * @internal
 */
class DroppingStrategy {
  shutdown() {
    return core.unit;
  }
  handleSurplus(_pubsub, _subscribers, _elements, _isShutdown) {
    return core.succeed(false);
  }
  unsafeOnPubSubEmptySpace(_pubsub, _subscribers) {
    //
  }
  unsafeCompletePollers(pubsub, subscribers, subscription, pollers) {
    return unsafeStrategyCompletePollers(this, pubsub, subscribers, subscription, pollers);
  }
  unsafeCompleteSubscribers(pubsub, subscribers) {
    return unsafeStrategyCompleteSubscribers(this, pubsub, subscribers);
  }
}
exports.DroppingStrategy = DroppingStrategy;
/**
 * A strategy that adds new messages and drops old messages when the `PubSub` is
 * at capacity. This guarantees that a slow subscriber will not slow down
 * the rate at which messages are published and received by other
 * subscribers. However, it creates the risk that a slow subscriber will
 * not receive some messages published to the `PubSub` while it is subscribed.
 *
 * @internal
 */
class SlidingStrategy {
  shutdown() {
    return core.unit;
  }
  handleSurplus(pubsub, subscribers, elements, _isShutdown) {
    return core.sync(() => {
      this.unsafeSlidingPublish(pubsub, elements);
      this.unsafeCompleteSubscribers(pubsub, subscribers);
      return true;
    });
  }
  unsafeOnPubSubEmptySpace(_pubsub, _subscribers) {
    //
  }
  unsafeCompletePollers(pubsub, subscribers, subscription, pollers) {
    return unsafeStrategyCompletePollers(this, pubsub, subscribers, subscription, pollers);
  }
  unsafeCompleteSubscribers(pubsub, subscribers) {
    return unsafeStrategyCompleteSubscribers(this, pubsub, subscribers);
  }
  unsafeSlidingPublish(pubsub, elements) {
    const it = elements[Symbol.iterator]();
    let next = it.next();
    if (!next.done && pubsub.capacity > 0) {
      let a = next.value;
      let loop = true;
      while (loop) {
        pubsub.slide();
        const pub = pubsub.publish(a);
        if (pub && (next = it.next()) && !next.done) {
          a = next.value;
        } else if (pub) {
          loop = false;
        }
      }
    }
  }
}
exports.SlidingStrategy = SlidingStrategy;
/** @internal */
const unsafeStrategyCompletePollers = (strategy, pubsub, subscribers, subscription, pollers) => {
  let keepPolling = true;
  while (keepPolling && !subscription.isEmpty()) {
    const poller = (0, Function_js_1.pipe)(pollers, MutableQueue.poll(MutableQueue.EmptyMutableQueue));
    if (poller === MutableQueue.EmptyMutableQueue) {
      (0, Function_js_1.pipe)(subscribers, removeSubscribers(subscription, pollers));
      if (MutableQueue.isEmpty(pollers)) {
        keepPolling = false;
      } else {
        (0, Function_js_1.pipe)(subscribers, addSubscribers(subscription, pollers));
      }
    } else {
      const pollResult = subscription.poll(MutableQueue.EmptyMutableQueue);
      if (pollResult === MutableQueue.EmptyMutableQueue) {
        unsafeOfferAll(pollers, (0, Function_js_1.pipe)(unsafePollAllQueue(pollers), Chunk.prepend(poller)));
      } else {
        unsafeCompleteDeferred(poller, pollResult);
        strategy.unsafeOnPubSubEmptySpace(pubsub, subscribers);
      }
    }
  }
};
/** @internal */
const unsafeStrategyCompleteSubscribers = (strategy, pubsub, subscribers) => {
  for (const [subscription, pollersSet] of subscribers) {
    for (const pollers of pollersSet) {
      strategy.unsafeCompletePollers(pubsub, subscribers, subscription, pollers);
    }
  }
};
//# sourceMappingURL=pubsub.js.map