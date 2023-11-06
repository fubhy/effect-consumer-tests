"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unbounded = exports.takeUpTo = exports.takeN = exports.takeBetween = exports.takeAll = exports.take = exports.sliding = exports.size = exports.shutdown = exports.seek = exports.poll = exports.peekOption = exports.peek = exports.offerAll = exports.offer = exports.isShutdown = exports.isFull = exports.isEmpty = exports.dropping = exports.capacity = exports.bounded = exports.awaitShutdown = exports.isTDequeue = exports.isTEnqueue = exports.isTQueue = exports.tEnqueueVariance = exports.tDequeueVariance = exports.Sliding = exports.Dropping = exports.BackPressure = exports.TDequeueTypeId = exports.TEnqueueTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const RA = /*#__PURE__*/require("../../ReadonlyArray.js");
const STM = /*#__PURE__*/require("../../STM.js");
const core = /*#__PURE__*/require("./core.js");
const OpCodes = /*#__PURE__*/require("./opCodes/strategy.js");
const stm = /*#__PURE__*/require("./stm.js");
const tRef = /*#__PURE__*/require("./tRef.js");
const TEnqueueSymbolKey = "effect/TQueue/TEnqueue";
/** @internal */
exports.TEnqueueTypeId = /*#__PURE__*/Symbol.for(TEnqueueSymbolKey);
const TDequeueSymbolKey = "effect/TQueue/TDequeue";
/** @internal */
exports.TDequeueTypeId = /*#__PURE__*/Symbol.for(TDequeueSymbolKey);
/** @internal */
exports.BackPressure = {
  _tag: OpCodes.OP_BACKPRESSURE_STRATEGY
};
/** @internal */
exports.Dropping = {
  _tag: OpCodes.OP_DROPPING_STRATEGY
};
/** @internal */
exports.Sliding = {
  _tag: OpCodes.OP_SLIDING_STRATEGY
};
/** @internal */
exports.tDequeueVariance = {
  _Out: _ => _
};
/** @internal */
exports.tEnqueueVariance = {
  _In: _ => _
};
class TQueueImpl {
  ref;
  requestedCapacity;
  strategy;
  [exports.TDequeueTypeId] = exports.tDequeueVariance;
  [exports.TEnqueueTypeId] = exports.tEnqueueVariance;
  constructor(ref, requestedCapacity, strategy) {
    this.ref = ref;
    this.requestedCapacity = requestedCapacity;
    this.strategy = strategy;
  }
  capacity() {
    return this.requestedCapacity;
  }
  size = core.withSTMRuntime(runtime => {
    const queue = tRef.unsafeGet(this.ref, runtime.journal);
    if (queue === undefined) {
      return STM.interruptAs(runtime.fiberId);
    }
    return core.succeed(queue.length);
  });
  isFull = core.map(this.size, size => size === this.requestedCapacity);
  isEmpty = core.map(this.size, size => size === 0);
  shutdown = core.withSTMRuntime(runtime => {
    tRef.unsafeSet(this.ref, void 0, runtime.journal);
    return stm.unit;
  });
  isShutdown = core.effect(journal => {
    const queue = tRef.unsafeGet(this.ref, journal);
    return queue === undefined;
  });
  awaitShutdown = core.flatMap(this.isShutdown, isShutdown => isShutdown ? stm.unit : core.retry);
  offer(value) {
    return core.withSTMRuntime(runtime => {
      const queue = (0, Function_js_1.pipe)(this.ref, tRef.unsafeGet(runtime.journal));
      if (queue === undefined) {
        return core.interruptAs(runtime.fiberId);
      }
      if (queue.length < this.requestedCapacity) {
        queue.push(value);
        tRef.unsafeSet(this.ref, queue, runtime.journal);
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
            const dequeued = queue.shift();
            if (dequeued === undefined) {
              return core.succeed(true);
            }
            queue.push(value);
            tRef.unsafeSet(this.ref, queue, runtime.journal);
            return core.succeed(true);
          }
      }
    });
  }
  offerAll(iterable) {
    return core.withSTMRuntime(runtime => {
      const as = Array.from(iterable);
      const queue = tRef.unsafeGet(this.ref, runtime.journal);
      if (queue === undefined) {
        return core.interruptAs(runtime.fiberId);
      }
      if (queue.length + as.length <= this.requestedCapacity) {
        tRef.unsafeSet(this.ref, [...queue, ...as], runtime.journal);
        return core.succeed(true);
      }
      switch (this.strategy._tag) {
        case OpCodes.OP_BACKPRESSURE_STRATEGY:
          {
            return core.retry;
          }
        case OpCodes.OP_DROPPING_STRATEGY:
          {
            const forQueue = as.slice(0, this.requestedCapacity - queue.length);
            tRef.unsafeSet(this.ref, [...queue, ...forQueue], runtime.journal);
            return core.succeed(false);
          }
        case OpCodes.OP_SLIDING_STRATEGY:
          {
            const forQueue = as.slice(0, this.requestedCapacity - queue.length);
            const toDrop = queue.length + forQueue.length - this.requestedCapacity;
            const newQueue = queue.slice(toDrop);
            tRef.unsafeSet(this.ref, [...newQueue, ...forQueue], runtime.journal);
            return core.succeed(true);
          }
      }
    });
  }
  peek = core.withSTMRuntime(runtime => {
    const queue = tRef.unsafeGet(this.ref, runtime.journal);
    if (queue === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    const head = queue[0];
    if (head === undefined) {
      return core.retry;
    }
    return core.succeed(head);
  });
  peekOption = core.withSTMRuntime(runtime => {
    const queue = tRef.unsafeGet(this.ref, runtime.journal);
    if (queue === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    return core.succeed(Option.fromNullable(queue[0]));
  });
  take = core.withSTMRuntime(runtime => {
    const queue = tRef.unsafeGet(this.ref, runtime.journal);
    if (queue === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    const dequeued = queue.shift();
    if (dequeued === undefined) {
      return core.retry;
    }
    tRef.unsafeSet(this.ref, queue, runtime.journal);
    return core.succeed(dequeued);
  });
  takeAll = core.withSTMRuntime(runtime => {
    const queue = tRef.unsafeGet(this.ref, runtime.journal);
    if (queue === undefined) {
      return core.interruptAs(runtime.fiberId);
    }
    tRef.unsafeSet(this.ref, [], runtime.journal);
    return core.succeed(queue);
  });
  takeUpTo(max) {
    return core.withSTMRuntime(runtime => {
      const queue = tRef.unsafeGet(this.ref, runtime.journal);
      if (queue === undefined) {
        return core.interruptAs(runtime.fiberId);
      }
      const [toTake, remaining] = Chunk.splitAt(Chunk.unsafeFromArray(queue), max);
      tRef.unsafeSet(this.ref, Array.from(remaining), runtime.journal);
      return core.succeed(Array.from(toTake));
    });
  }
}
/** @internal */
const isTQueue = u => {
  return (0, exports.isTEnqueue)(u) && (0, exports.isTDequeue)(u);
};
exports.isTQueue = isTQueue;
/** @internal */
const isTEnqueue = u => (0, Predicate_js_1.hasProperty)(u, exports.TEnqueueTypeId);
exports.isTEnqueue = isTEnqueue;
/** @internal */
const isTDequeue = u => (0, Predicate_js_1.hasProperty)(u, exports.TDequeueTypeId);
exports.isTDequeue = isTDequeue;
/** @internal */
const awaitShutdown = self => self.awaitShutdown;
exports.awaitShutdown = awaitShutdown;
/** @internal */
const bounded = requestedCapacity => makeQueue(requestedCapacity, exports.BackPressure);
exports.bounded = bounded;
/** @internal */
const capacity = self => {
  return self.capacity();
};
exports.capacity = capacity;
/** @internal */
const dropping = requestedCapacity => makeQueue(requestedCapacity, exports.Dropping);
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
exports.offer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.offer(value));
/** @internal */
exports.offerAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, iterable) => self.offerAll(iterable));
/** @internal */
const peek = self => self.peek;
exports.peek = peek;
/** @internal */
const peekOption = self => self.peekOption;
exports.peekOption = peekOption;
/** @internal */
const poll = self => (0, Function_js_1.pipe)(self.takeUpTo(1), core.map(RA.head));
exports.poll = poll;
/** @internal */
exports.seek = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => seekLoop(self, predicate));
const seekLoop = (self, predicate) => core.flatMap(self.take, a => predicate(a) ? core.succeed(a) : seekLoop(self, predicate));
/** @internal */
const shutdown = self => self.shutdown;
exports.shutdown = shutdown;
/** @internal */
const size = self => self.size;
exports.size = size;
/** @internal */
const sliding = requestedCapacity => makeQueue(requestedCapacity, exports.Sliding);
exports.sliding = sliding;
/** @internal */
const take = self => self.take;
exports.take = take;
/** @internal */
const takeAll = self => self.takeAll;
exports.takeAll = takeAll;
/** @internal */
exports.takeBetween = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, min, max) => stm.suspend(() => {
  const takeRemainder = (min, max, acc) => {
    if (max < min) {
      return core.succeed(acc);
    }
    return (0, Function_js_1.pipe)(self.takeUpTo(max), core.flatMap(taken => {
      const remaining = min - taken.length;
      if (remaining === 1) {
        return (0, Function_js_1.pipe)(self.take, core.map(a => (0, Function_js_1.pipe)(acc, Chunk.appendAll(Chunk.unsafeFromArray(taken)), Chunk.append(a))));
      }
      if (remaining > 1) {
        return (0, Function_js_1.pipe)(self.take, core.flatMap(a => takeRemainder(remaining - 1, max - taken.length - 1, (0, Function_js_1.pipe)(acc, Chunk.appendAll(Chunk.unsafeFromArray(taken)), Chunk.append(a)))));
      }
      return core.succeed((0, Function_js_1.pipe)(acc, Chunk.appendAll(Chunk.unsafeFromArray(taken))));
    }));
  };
  return core.map(takeRemainder(min, max, Chunk.empty()), c => Array.from(c));
}));
/** @internal */
exports.takeN = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, Function_js_1.pipe)(self, (0, exports.takeBetween)(n, n)));
/** @internal */
exports.takeUpTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, max) => self.takeUpTo(max));
/** @internal */
const unbounded = () => makeQueue(Number.MAX_SAFE_INTEGER, exports.Dropping);
exports.unbounded = unbounded;
const makeQueue = (requestedCapacity, strategy) => core.map(tRef.make([]), ref => new TQueueImpl(ref, requestedCapacity, strategy));
//# sourceMappingURL=tQueue.js.map