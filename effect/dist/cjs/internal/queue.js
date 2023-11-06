"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeCompleteTakers = exports.unsafeRemove = exports.slidingStrategy = exports.droppingStrategy = exports.backPressureStrategy = exports.takeN = exports.takeBetween = exports.takeUpTo = exports.takeAll = exports.take = exports.poll = exports.offerAll = exports.unsafeOffer = exports.offer = exports.shutdown = exports.awaitShutdown = exports.isShutdown = exports.isEmpty = exports.isFull = exports.size = exports.capacity = exports.backingQueueFromMutableQueue = exports.BackingQueueFromMutableQueue = exports.make = exports.unbounded = exports.sliding = exports.dropping = exports.bounded = exports.isDequeue = exports.isEnqueue = exports.isQueue = exports.dequeueVariance = exports.enqueueVariance = exports.QueueStrategyTypeId = exports.DequeueTypeId = exports.EnqueueTypeId = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const MutableQueue = /*#__PURE__*/require("../MutableQueue.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const ReadonlyArray = /*#__PURE__*/require("../ReadonlyArray.js");
const core = /*#__PURE__*/require("./core.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
/** @internal */
const EnqueueSymbolKey = "effect/QueueEnqueue";
/** @internal */
exports.EnqueueTypeId = /*#__PURE__*/Symbol.for(EnqueueSymbolKey);
/** @internal */
const DequeueSymbolKey = "effect/QueueDequeue";
/** @internal */
exports.DequeueTypeId = /*#__PURE__*/Symbol.for(DequeueSymbolKey);
/** @internal */
const QueueStrategySymbolKey = "effect/QueueStrategy";
/** @internal */
exports.QueueStrategyTypeId = /*#__PURE__*/Symbol.for(QueueStrategySymbolKey);
/** @internal */
const queueStrategyVariance = {
  _A: _ => _
};
/** @internal */
exports.enqueueVariance = {
  _In: _ => _
};
/** @internal */
exports.dequeueVariance = {
  _Out: _ => _
};
/** @internal */
class QueueImpl {
  queue;
  takers;
  shutdownHook;
  shutdownFlag;
  strategy;
  [exports.EnqueueTypeId] = exports.enqueueVariance;
  [exports.DequeueTypeId] = exports.dequeueVariance;
  constructor( /** @internal */
  queue, /** @internal */
  takers, /** @internal */
  shutdownHook, /** @internal */
  shutdownFlag, /** @internal */
  strategy) {
    this.queue = queue;
    this.takers = takers;
    this.shutdownHook = shutdownHook;
    this.shutdownFlag = shutdownFlag;
    this.strategy = strategy;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  capacity() {
    return this.queue.capacity();
  }
  size() {
    return core.suspend(() => core.catchAll(this.unsafeSize(), () => core.interrupt));
  }
  unsafeSize() {
    if (MutableRef.get(this.shutdownFlag)) {
      return Option.none();
    }
    return Option.some(this.queue.length() - MutableQueue.length(this.takers) + this.strategy.surplusSize());
  }
  isEmpty() {
    return core.map(this.size(), size => size <= 0);
  }
  isFull() {
    return core.map(this.size(), size => size >= this.capacity());
  }
  shutdown() {
    return core.uninterruptible(core.withFiberRuntime(state => {
      (0, Function_js_1.pipe)(this.shutdownFlag, MutableRef.set(true));
      return (0, Function_js_1.pipe)(fiberRuntime.forEachParUnboundedDiscard(unsafePollAll(this.takers), d => core.deferredInterruptWith(d, state.id()), false), core.zipRight(this.strategy.shutdown()), core.whenEffect(core.deferredSucceed(this.shutdownHook, void 0)), core.asUnit);
    }));
  }
  isShutdown() {
    return core.sync(() => MutableRef.get(this.shutdownFlag));
  }
  awaitShutdown() {
    return core.deferredAwait(this.shutdownHook);
  }
  isActive() {
    return !MutableRef.get(this.shutdownFlag);
  }
  unsafeOffer(value) {
    if (MutableRef.get(this.shutdownFlag)) {
      return false;
    }
    let noRemaining;
    if (this.queue.length() === 0) {
      const taker = (0, Function_js_1.pipe)(this.takers, MutableQueue.poll(MutableQueue.EmptyMutableQueue));
      if (taker !== MutableQueue.EmptyMutableQueue) {
        unsafeCompleteDeferred(taker, value);
        noRemaining = true;
      } else {
        noRemaining = false;
      }
    } else {
      noRemaining = false;
    }
    if (noRemaining) {
      return true;
    }
    // Not enough takers, offer to the queue
    const succeeded = this.queue.offer(value);
    (0, exports.unsafeCompleteTakers)(this.strategy, this.queue, this.takers);
    return succeeded;
  }
  offer(value) {
    return core.suspend(() => {
      if (MutableRef.get(this.shutdownFlag)) {
        return core.interrupt;
      }
      let noRemaining;
      if (this.queue.length() === 0) {
        const taker = (0, Function_js_1.pipe)(this.takers, MutableQueue.poll(MutableQueue.EmptyMutableQueue));
        if (taker !== MutableQueue.EmptyMutableQueue) {
          unsafeCompleteDeferred(taker, value);
          noRemaining = true;
        } else {
          noRemaining = false;
        }
      } else {
        noRemaining = false;
      }
      if (noRemaining) {
        return core.succeed(true);
      }
      // Not enough takers, offer to the queue
      const succeeded = this.queue.offer(value);
      (0, exports.unsafeCompleteTakers)(this.strategy, this.queue, this.takers);
      return succeeded ? core.succeed(true) : this.strategy.handleSurplus([value], this.queue, this.takers, this.shutdownFlag);
    });
  }
  offerAll(iterable) {
    return core.suspend(() => {
      if (MutableRef.get(this.shutdownFlag)) {
        return core.interrupt;
      }
      const values = ReadonlyArray.fromIterable(iterable);
      const pTakers = this.queue.length() === 0 ? ReadonlyArray.fromIterable(unsafePollN(this.takers, values.length)) : ReadonlyArray.empty;
      const [forTakers, remaining] = (0, Function_js_1.pipe)(values, ReadonlyArray.splitAt(pTakers.length));
      for (let i = 0; i < pTakers.length; i++) {
        const taker = pTakers[i];
        const item = forTakers[i];
        unsafeCompleteDeferred(taker, item);
      }
      if (remaining.length === 0) {
        return core.succeed(true);
      }
      // Not enough takers, offer to the queue
      const surplus = this.queue.offerAll(remaining);
      (0, exports.unsafeCompleteTakers)(this.strategy, this.queue, this.takers);
      return Chunk.isEmpty(surplus) ? core.succeed(true) : this.strategy.handleSurplus(surplus, this.queue, this.takers, this.shutdownFlag);
    });
  }
  take() {
    return core.withFiberRuntime(state => {
      if (MutableRef.get(this.shutdownFlag)) {
        return core.interrupt;
      }
      const item = this.queue.poll(MutableQueue.EmptyMutableQueue);
      if (item !== MutableQueue.EmptyMutableQueue) {
        this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers);
        return core.succeed(item);
      } else {
        // Add the deferred to takers, then:
        // - Try to take again in case a value was added since
        // - Wait for the deferred to be completed
        // - Clean up resources in case of interruption
        const deferred = core.deferredUnsafeMake(state.id());
        return (0, Function_js_1.pipe)(core.suspend(() => {
          (0, Function_js_1.pipe)(this.takers, MutableQueue.offer(deferred));
          (0, exports.unsafeCompleteTakers)(this.strategy, this.queue, this.takers);
          return MutableRef.get(this.shutdownFlag) ? core.interrupt : core.deferredAwait(deferred);
        }), core.onInterrupt(() => {
          return core.sync(() => (0, exports.unsafeRemove)(this.takers, deferred));
        }));
      }
    });
  }
  takeAll() {
    return core.suspend(() => {
      return MutableRef.get(this.shutdownFlag) ? core.interrupt : core.sync(() => {
        const values = this.queue.pollUpTo(Number.POSITIVE_INFINITY);
        this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers);
        return Chunk.fromIterable(values);
      });
    });
  }
  takeUpTo(max) {
    return core.suspend(() => MutableRef.get(this.shutdownFlag) ? core.interrupt : core.sync(() => {
      const values = this.queue.pollUpTo(max);
      this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers);
      return Chunk.fromIterable(values);
    }));
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
  return (0, Function_js_1.pipe)((0, exports.takeUpTo)(self, max), core.flatMap(bs => {
    const remaining = min - bs.length;
    if (remaining === 1) {
      return (0, Function_js_1.pipe)((0, exports.take)(self), core.map(b => (0, Function_js_1.pipe)(acc, Chunk.appendAll(bs), Chunk.append(b))));
    }
    if (remaining > 1) {
      return (0, Function_js_1.pipe)((0, exports.take)(self), core.flatMap(b => takeRemainderLoop(self, remaining - 1, max - bs.length - 1, (0, Function_js_1.pipe)(acc, Chunk.appendAll(bs), Chunk.append(b)))));
    }
    return core.succeed((0, Function_js_1.pipe)(acc, Chunk.appendAll(bs)));
  }));
};
/** @internal */
const isQueue = u => (0, exports.isEnqueue)(u) && (0, exports.isDequeue)(u);
exports.isQueue = isQueue;
/** @internal */
const isEnqueue = u => (0, Predicate_js_1.hasProperty)(u, exports.EnqueueTypeId);
exports.isEnqueue = isEnqueue;
/** @internal */
const isDequeue = u => (0, Predicate_js_1.hasProperty)(u, exports.DequeueTypeId);
exports.isDequeue = isDequeue;
/** @internal */
const bounded = requestedCapacity => (0, Function_js_1.pipe)(core.sync(() => MutableQueue.bounded(requestedCapacity)), core.flatMap(queue => (0, exports.make)((0, exports.backingQueueFromMutableQueue)(queue), (0, exports.backPressureStrategy)())));
exports.bounded = bounded;
/** @internal */
const dropping = requestedCapacity => (0, Function_js_1.pipe)(core.sync(() => MutableQueue.bounded(requestedCapacity)), core.flatMap(queue => (0, exports.make)((0, exports.backingQueueFromMutableQueue)(queue), (0, exports.droppingStrategy)())));
exports.dropping = dropping;
/** @internal */
const sliding = requestedCapacity => (0, Function_js_1.pipe)(core.sync(() => MutableQueue.bounded(requestedCapacity)), core.flatMap(queue => (0, exports.make)((0, exports.backingQueueFromMutableQueue)(queue), (0, exports.slidingStrategy)())));
exports.sliding = sliding;
/** @internal */
const unbounded = () => (0, Function_js_1.pipe)(core.sync(() => MutableQueue.unbounded()), core.flatMap(queue => (0, exports.make)((0, exports.backingQueueFromMutableQueue)(queue), (0, exports.droppingStrategy)())));
exports.unbounded = unbounded;
/** @internal */
const unsafeMake = (queue, takers, shutdownHook, shutdownFlag, strategy) => {
  return new QueueImpl(queue, takers, shutdownHook, shutdownFlag, strategy);
};
/** @internal */
const make = (queue, strategy) => (0, Function_js_1.pipe)(core.deferredMake(), core.map(deferred => unsafeMake(queue, MutableQueue.unbounded(), deferred, MutableRef.make(false), strategy)));
exports.make = make;
/** @internal */
class BackingQueueFromMutableQueue {
  mutable;
  constructor(mutable) {
    this.mutable = mutable;
  }
  poll(def) {
    return MutableQueue.poll(this.mutable, def);
  }
  pollUpTo(limit) {
    return MutableQueue.pollUpTo(this.mutable, limit);
  }
  offerAll(elements) {
    return MutableQueue.offerAll(this.mutable, elements);
  }
  offer(element) {
    return MutableQueue.offer(this.mutable, element);
  }
  capacity() {
    return MutableQueue.capacity(this.mutable);
  }
  length() {
    return MutableQueue.length(this.mutable);
  }
}
exports.BackingQueueFromMutableQueue = BackingQueueFromMutableQueue;
/** @internal */
const backingQueueFromMutableQueue = mutable => new BackingQueueFromMutableQueue(mutable);
exports.backingQueueFromMutableQueue = backingQueueFromMutableQueue;
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
const isShutdown = self => self.isShutdown();
exports.isShutdown = isShutdown;
/** @internal */
const awaitShutdown = self => self.awaitShutdown();
exports.awaitShutdown = awaitShutdown;
/** @internal */
const shutdown = self => self.shutdown();
exports.shutdown = shutdown;
/** @internal */
exports.offer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.offer(value));
/** @internal */
exports.unsafeOffer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.unsafeOffer(value));
/** @internal */
exports.offerAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, iterable) => self.offerAll(iterable));
/** @internal */
const poll = self => core.map(self.takeUpTo(1), Chunk.head);
exports.poll = poll;
/** @internal */
const take = self => self.take();
exports.take = take;
/** @internal */
const takeAll = self => self.takeAll();
exports.takeAll = takeAll;
/** @internal */
exports.takeUpTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, max) => self.takeUpTo(max));
/** @internal */
exports.takeBetween = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, min, max) => self.takeBetween(min, max));
/** @internal */
exports.takeN = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => self.takeBetween(n, n));
// -----------------------------------------------------------------------------
// Strategy
// -----------------------------------------------------------------------------
/** @internal */
const backPressureStrategy = () => new BackPressureStrategy();
exports.backPressureStrategy = backPressureStrategy;
/** @internal */
const droppingStrategy = () => new DroppingStrategy();
exports.droppingStrategy = droppingStrategy;
/** @internal */
const slidingStrategy = () => new SlidingStrategy();
exports.slidingStrategy = slidingStrategy;
/** @internal */
class BackPressureStrategy {
  [exports.QueueStrategyTypeId] = queueStrategyVariance;
  putters = MutableQueue.unbounded();
  surplusSize() {
    return MutableQueue.length(this.putters);
  }
  onCompleteTakersWithEmptyQueue(takers) {
    while (!MutableQueue.isEmpty(this.putters) && !MutableQueue.isEmpty(takers)) {
      const taker = MutableQueue.poll(takers, void 0);
      const putter = MutableQueue.poll(this.putters, void 0);
      if (putter[2]) {
        unsafeCompleteDeferred(putter[1], true);
      }
      unsafeCompleteDeferred(taker, putter[0]);
    }
  }
  shutdown() {
    return (0, Function_js_1.pipe)(core.fiberId, core.flatMap(fiberId => (0, Function_js_1.pipe)(core.sync(() => unsafePollAll(this.putters)), core.flatMap(putters => fiberRuntime.forEachParUnboundedDiscard(putters, ([_, deferred, isLastItem]) => isLastItem ? (0, Function_js_1.pipe)(core.deferredInterruptWith(deferred, fiberId), core.asUnit) : core.unit, false)))));
  }
  handleSurplus(iterable, queue, takers, isShutdown) {
    return core.withFiberRuntime(state => {
      const deferred = core.deferredUnsafeMake(state.id());
      return (0, Function_js_1.pipe)(core.suspend(() => {
        this.unsafeOffer(iterable, deferred);
        this.unsafeOnQueueEmptySpace(queue, takers);
        (0, exports.unsafeCompleteTakers)(this, queue, takers);
        return MutableRef.get(isShutdown) ? core.interrupt : core.deferredAwait(deferred);
      }), core.onInterrupt(() => core.sync(() => this.unsafeRemove(deferred))));
    });
  }
  unsafeOnQueueEmptySpace(queue, takers) {
    let keepPolling = true;
    while (keepPolling && (queue.capacity() === Number.POSITIVE_INFINITY || queue.length() < queue.capacity())) {
      const putter = (0, Function_js_1.pipe)(this.putters, MutableQueue.poll(MutableQueue.EmptyMutableQueue));
      if (putter === MutableQueue.EmptyMutableQueue) {
        keepPolling = false;
      } else {
        const offered = queue.offer(putter[0]);
        if (offered && putter[2]) {
          unsafeCompleteDeferred(putter[1], true);
        } else if (!offered) {
          unsafeOfferAll(this.putters, (0, Function_js_1.pipe)(unsafePollAll(this.putters), Chunk.prepend(putter)));
        }
        (0, exports.unsafeCompleteTakers)(this, queue, takers);
      }
    }
  }
  unsafeOffer(iterable, deferred) {
    const stuff = Array.from(iterable);
    for (let i = 0; i < stuff.length; i++) {
      const value = stuff[i];
      if (i === stuff.length - 1) {
        (0, Function_js_1.pipe)(this.putters, MutableQueue.offer([value, deferred, true]));
      } else {
        (0, Function_js_1.pipe)(this.putters, MutableQueue.offer([value, deferred, false]));
      }
    }
  }
  unsafeRemove(deferred) {
    unsafeOfferAll(this.putters, (0, Function_js_1.pipe)(unsafePollAll(this.putters), Chunk.filter(([, _]) => _ !== deferred)));
  }
}
/** @internal */
class DroppingStrategy {
  [exports.QueueStrategyTypeId] = queueStrategyVariance;
  surplusSize() {
    return 0;
  }
  shutdown() {
    return core.unit;
  }
  onCompleteTakersWithEmptyQueue() {}
  handleSurplus(_iterable, _queue, _takers, _isShutdown) {
    return core.succeed(false);
  }
  unsafeOnQueueEmptySpace(_queue, _takers) {
    //
  }
}
/** @internal */
class SlidingStrategy {
  [exports.QueueStrategyTypeId] = queueStrategyVariance;
  surplusSize() {
    return 0;
  }
  shutdown() {
    return core.unit;
  }
  onCompleteTakersWithEmptyQueue() {}
  handleSurplus(iterable, queue, takers, _isShutdown) {
    return core.sync(() => {
      this.unsafeOffer(queue, iterable);
      (0, exports.unsafeCompleteTakers)(this, queue, takers);
      return true;
    });
  }
  unsafeOnQueueEmptySpace(_queue, _takers) {
    //
  }
  unsafeOffer(queue, iterable) {
    const iterator = iterable[Symbol.iterator]();
    let next;
    let offering = true;
    while (!(next = iterator.next()).done && offering) {
      if (queue.capacity() === 0) {
        return;
      }
      // Poll 1 and retry
      queue.poll(MutableQueue.EmptyMutableQueue);
      offering = queue.offer(next.value);
    }
  }
}
/** @internal */
const unsafeCompleteDeferred = (deferred, a) => {
  return core.deferredUnsafeDone(deferred, core.succeed(a));
};
/** @internal */
const unsafeOfferAll = (queue, as) => {
  return (0, Function_js_1.pipe)(queue, MutableQueue.offerAll(as));
};
/** @internal */
const unsafePollAll = queue => {
  return (0, Function_js_1.pipe)(queue, MutableQueue.pollUpTo(Number.POSITIVE_INFINITY));
};
/** @internal */
const unsafePollN = (queue, max) => {
  return (0, Function_js_1.pipe)(queue, MutableQueue.pollUpTo(max));
};
/** @internal */
const unsafeRemove = (queue, a) => {
  unsafeOfferAll(queue, (0, Function_js_1.pipe)(unsafePollAll(queue), Chunk.filter(b => a !== b)));
};
exports.unsafeRemove = unsafeRemove;
/** @internal */
const unsafeCompleteTakers = (strategy, queue, takers) => {
  // Check both a taker and an item are in the queue, starting with the taker
  let keepPolling = true;
  while (keepPolling && queue.length() !== 0) {
    const taker = (0, Function_js_1.pipe)(takers, MutableQueue.poll(MutableQueue.EmptyMutableQueue));
    if (taker !== MutableQueue.EmptyMutableQueue) {
      const element = queue.poll(MutableQueue.EmptyMutableQueue);
      if (element !== MutableQueue.EmptyMutableQueue) {
        unsafeCompleteDeferred(taker, element);
        strategy.unsafeOnQueueEmptySpace(queue, takers);
      } else {
        unsafeOfferAll(takers, (0, Function_js_1.pipe)(unsafePollAll(takers), Chunk.prepend(taker)));
      }
      keepPolling = true;
    } else {
      keepPolling = false;
    }
  }
  if (keepPolling && queue.length() === 0 && !MutableQueue.isEmpty(takers)) {
    strategy.onCompleteTakersWithEmptyQueue(takers);
  }
};
exports.unsafeCompleteTakers = unsafeCompleteTakers;
//# sourceMappingURL=queue.js.map