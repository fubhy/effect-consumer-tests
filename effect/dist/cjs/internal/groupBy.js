"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupByIterable = exports.groupByKey = exports.bindEffect = exports.mapEffectOptions = exports.groupBy = exports.make = exports.first = exports.filter = exports.evaluate = exports.isGroupBy = exports.GroupByTypeId = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Deferred = /*#__PURE__*/require("../Deferred.js");
const Effect = /*#__PURE__*/require("../Effect.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const Queue = /*#__PURE__*/require("../Queue.js");
const Ref = /*#__PURE__*/require("../Ref.js");
const channel = /*#__PURE__*/require("./channel.js");
const channelExecutor = /*#__PURE__*/require("./channel/channelExecutor.js");
const core = /*#__PURE__*/require("./core-stream.js");
const stream = /*#__PURE__*/require("./stream.js");
const take = /*#__PURE__*/require("./take.js");
/** @internal */
const GroupBySymbolKey = "effect/GroupBy";
/** @internal */
exports.GroupByTypeId = /*#__PURE__*/Symbol.for(GroupBySymbolKey);
/** @internal */
const groupByVariance = {
  _R: _ => _,
  _E: _ => _,
  _K: _ => _,
  _V: _ => _
};
/** @internal */
const isGroupBy = u => (0, Predicate_js_1.hasProperty)(u, exports.GroupByTypeId);
exports.isGroupBy = isGroupBy;
/** @internal */
exports.evaluate = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isGroupBy)(args[0]), (self, f, options) => stream.flatMap(self.grouped, ([key, queue]) => f(key, stream.flattenTake(stream.fromQueue(queue, {
  shutdown: true
}))), {
  concurrency: "unbounded",
  bufferSize: options?.bufferSize ?? 16
}));
/** @internal */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.make)((0, Function_js_1.pipe)(self.grouped, stream.filterEffect(tuple => {
  if (predicate(tuple[0])) {
    return (0, Function_js_1.pipe)(Effect.succeed(tuple), Effect.as(true));
  }
  return (0, Function_js_1.pipe)(Queue.shutdown(tuple[1]), Effect.as(false));
}))));
/** @internal */
exports.first = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.make)((0, Function_js_1.pipe)(stream.zipWithIndex(self.grouped), stream.filterEffect(tuple => {
  const index = tuple[1];
  const queue = tuple[0][1];
  if (index < n) {
    return (0, Function_js_1.pipe)(Effect.succeed(tuple), Effect.as(true));
  }
  return (0, Function_js_1.pipe)(Queue.shutdown(queue), Effect.as(false));
}), stream.map(tuple => tuple[0]))));
/** @internal */
const make = grouped => ({
  [exports.GroupByTypeId]: groupByVariance,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  grouped
});
exports.make = make;
// Circular with Stream
/** @internal */
exports.groupBy = /*#__PURE__*/(0, Function_js_1.dual)(args => stream.isStream(args[0]), (self, f, options) => (0, exports.make)(stream.unwrapScoped(Effect.gen(function* ($) {
  const decider = yield* $(Deferred.make());
  const output = yield* $(Effect.acquireRelease(Queue.bounded(options?.bufferSize ?? 16), queue => Queue.shutdown(queue)));
  const ref = yield* $(Ref.make(new Map()));
  const add = yield* $(stream.mapEffectSequential(self, f), stream.distributedWithDynamicCallback(options?.bufferSize ?? 16, ([key, value]) => Effect.flatMap(Deferred.await(decider), f => f(key, value)), exit => Queue.offer(output, exit)));
  yield* $(Deferred.succeed(decider, (key, _) => (0, Function_js_1.pipe)(Ref.get(ref), Effect.map(map => Option.fromNullable(map.get(key))), Effect.flatMap(Option.match({
    onNone: () => Effect.flatMap(add, ([index, queue]) => Effect.zipRight(Ref.update(ref, map => map.set(key, index)), (0, Function_js_1.pipe)(Queue.offer(output, Exit.succeed([key, mapDequeue(queue, exit => new take.TakeImpl((0, Function_js_1.pipe)(exit, Exit.map(tuple => Chunk.of(tuple[1])))))])), Effect.as(n => n === index)))),
    onSome: index => Effect.succeed(n => n === index)
  })))));
  return stream.flattenExitOption(stream.fromQueue(output, {
    shutdown: true
  }));
}))));
/** @internal */
exports.mapEffectOptions = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] !== "function", (self, f, options) => {
  if (options?.key) {
    return (0, exports.evaluate)((0, exports.groupByKey)(self, options.key, {
      bufferSize: options.bufferSize
    }), (_, s) => stream.mapEffectSequential(s, f));
  }
  return stream.matchConcurrency(options?.concurrency, () => stream.mapEffectSequential(self, f), n => options?.unordered ? stream.flatMap(self, a => stream.fromEffect(f(a)), {
    concurrency: n
  }) : stream.mapEffectPar(self, n, f));
});
/** @internal */
exports.bindEffect = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] !== "string", (self, tag, f, options) => (0, exports.mapEffectOptions)(self, k => Effect.map(f(k), a => ({
  ...k,
  [tag]: a
})), options));
const mapDequeue = (dequeue, f) => new MapDequeue(dequeue, f);
class MapDequeue {
  dequeue;
  f;
  [Queue.DequeueTypeId] = {
    _Out: _ => _
  };
  constructor(dequeue, f) {
    this.dequeue = dequeue;
    this.f = f;
  }
  capacity() {
    return Queue.capacity(this.dequeue);
  }
  size() {
    return Queue.size(this.dequeue);
  }
  unsafeSize() {
    return this.dequeue.unsafeSize();
  }
  awaitShutdown() {
    return Queue.awaitShutdown(this.dequeue);
  }
  isActive() {
    return this.dequeue.isActive();
  }
  isShutdown() {
    return Queue.isShutdown(this.dequeue);
  }
  shutdown() {
    return Queue.shutdown(this.dequeue);
  }
  isFull() {
    return Queue.isFull(this.dequeue);
  }
  isEmpty() {
    return Queue.isEmpty(this.dequeue);
  }
  take() {
    return (0, Function_js_1.pipe)(Queue.take(this.dequeue), Effect.map(a => this.f(a)));
  }
  takeAll() {
    return (0, Function_js_1.pipe)(Queue.takeAll(this.dequeue), Effect.map(Chunk.map(a => this.f(a))));
  }
  takeUpTo(max) {
    return (0, Function_js_1.pipe)(Queue.takeUpTo(this.dequeue, max), Effect.map(Chunk.map(a => this.f(a))));
  }
  takeBetween(min, max) {
    return (0, Function_js_1.pipe)(Queue.takeBetween(this.dequeue, min, max), Effect.map(Chunk.map(a => this.f(a))));
  }
  takeN(n) {
    return (0, Function_js_1.pipe)(Queue.takeN(this.dequeue, n), Effect.map(Chunk.map(a => this.f(a))));
  }
  poll() {
    return (0, Function_js_1.pipe)(Queue.poll(this.dequeue), Effect.map(Option.map(a => this.f(a))));
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
exports.groupByKey = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] !== "function", (self, f, options) => {
  const loop = (map, outerQueue) => core.readWithCause({
    onInput: input => core.flatMap(core.fromEffect(Effect.forEach((0, exports.groupByIterable)(input, f), ([key, values]) => {
      const innerQueue = map.get(key);
      if (innerQueue === undefined) {
        return (0, Function_js_1.pipe)(Queue.bounded(options?.bufferSize ?? 16), Effect.flatMap(innerQueue => (0, Function_js_1.pipe)(Effect.sync(() => {
          map.set(key, innerQueue);
        }), Effect.zipRight(Queue.offer(outerQueue, take.of([key, innerQueue]))), Effect.zipRight((0, Function_js_1.pipe)(Queue.offer(innerQueue, take.chunk(values)), Effect.catchSomeCause(cause => Cause.isInterruptedOnly(cause) ? Option.some(Effect.unit) : Option.none()))))));
      }
      return Effect.catchSomeCause(Queue.offer(innerQueue, take.chunk(values)), cause => Cause.isInterruptedOnly(cause) ? Option.some(Effect.unit) : Option.none());
    }, {
      discard: true
    })), () => loop(map, outerQueue)),
    onFailure: cause => core.fromEffect(Queue.offer(outerQueue, take.failCause(cause))),
    onDone: () => (0, Function_js_1.pipe)(core.fromEffect((0, Function_js_1.pipe)(Effect.forEach(map.entries(), ([_, innerQueue]) => (0, Function_js_1.pipe)(Queue.offer(innerQueue, take.end), Effect.catchSomeCause(cause => Cause.isInterruptedOnly(cause) ? Option.some(Effect.unit) : Option.none())), {
      discard: true
    }), Effect.zipRight(Queue.offer(outerQueue, take.end)))))
  });
  return (0, exports.make)(stream.unwrapScoped((0, Function_js_1.pipe)(Effect.sync(() => new Map()), Effect.flatMap(map => (0, Function_js_1.pipe)(Effect.acquireRelease(Queue.unbounded(), queue => Queue.shutdown(queue)), Effect.flatMap(queue => (0, Function_js_1.pipe)(self, stream.toChannel, core.pipeTo(loop(map, queue)), channel.drain, channelExecutor.runScoped, Effect.forkScoped, Effect.as(stream.flattenTake(stream.fromQueue(queue, {
    shutdown: true
  }))))))))));
});
/**
 * A variant of `groupBy` that retains the insertion order of keys.
 *
 * @internal
 */
exports.groupByIterable = /*#__PURE__*/(0, Function_js_1.dual)(2, (iterable, f) => {
  const builder = [];
  const iterator = iterable[Symbol.iterator]();
  const map = new Map();
  let next;
  while ((next = iterator.next()) && !next.done) {
    const value = next.value;
    const key = f(value);
    if (map.has(key)) {
      const innerBuilder = map.get(key);
      innerBuilder.push(value);
    } else {
      const innerBuilder = [value];
      builder.push([key, innerBuilder]);
      map.set(key, innerBuilder);
    }
  }
  return Chunk.unsafeFromArray(builder.map(tuple => [tuple[0], Chunk.unsafeFromArray(tuple[1])]));
});
//# sourceMappingURL=groupBy.js.map