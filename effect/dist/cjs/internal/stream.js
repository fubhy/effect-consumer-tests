"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drain = exports.distributedWithDynamicCallback = exports.distributedWithDynamic = exports.distributedWith = exports.dieMessage = exports.dieSync = exports.die = exports.debounce = exports.crossWith = exports.crossRight = exports.crossLeft = exports.cross = exports.concatAll = exports.concat = exports.combineChunks = exports.combine = exports.chunksWith = exports.chunks = exports.changesWithEffect = exports.changesWith = exports.changes = exports.catchTags = exports.catchTag = exports.catchSomeCause = exports.catchSome = exports.catchAllCause = exports.catchAll = exports.bufferChunks = exports.buffer = exports.broadcastedQueuesDynamic = exports.broadcastedQueues = exports.broadcastDynamic = exports.broadcast = exports.branchAfter = exports.asyncScoped = exports.asyncOption = exports.asyncInterrupt = exports.asyncEffect = exports._async = exports.as = exports.aggregateWithinEither = exports.aggregateWithin = exports.aggregate = exports.acquireRelease = exports.accumulateChunks = exports.accumulate = exports.DefaultChunkSize = exports.isStream = exports.StreamImpl = exports.StreamTypeId = void 0;
exports.fromIterableEffect = exports.fromIterable = exports.fromPubSub = exports.fromEffectOption = exports.fromEffect = exports.fromChunks = exports.fromChunkQueue = exports.fromChunkPubSub = exports.fromChunk = exports.toChannel = exports.fromChannel = exports.fromAsyncIterable = exports.forever = exports.flattenTake = exports.flattenIterables = exports.flattenExitOption = exports.flattenEffect = exports.flattenChunks = exports.flatten = exports.matchConcurrency = exports.flatMap = exports.findEffect = exports.find = exports.finalizer = exports.filterMapWhileEffect = exports.filterMapWhile = exports.filterMapEffect = exports.filterMap = exports.filterEffect = exports.filter = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.execute = exports.contextWithStream = exports.contextWithEffect = exports.contextWith = exports.context = exports.ensuringWith = exports.ensuring = exports.empty = exports.either = exports.dropWhileEffect = exports.dropWhile = exports.dropUntilEffect = exports.dropUntil = exports.dropRight = exports.drop = exports.drainFork = void 0;
exports.orElseEither = exports.orElse = exports.orDieWith = exports.orDie = exports.onDone = exports.onError = exports.never = exports.mkString = exports.mergeWith = exports.mergeRight = exports.mergeLeft = exports.mergeEither = exports.mergeAll = exports.merge = exports.mapErrorCause = exports.mapError = exports.mapEffectPar = exports.mapEffectSequential = exports.mapConcatEffect = exports.mapConcatChunkEffect = exports.mapConcatChunk = exports.mapConcat = exports.mapChunksEffect = exports.mapChunks = exports.mapBoth = exports.mapAccumEffect = exports.mapAccum = exports.map = exports.make = exports.iterate = exports.interruptWhenDeferred = exports.interruptWhen = exports.interruptAfter = exports.intersperseAffixes = exports.intersperse = exports.interleaveWith = exports.interleave = exports.identityStream = exports.haltWhenDeferred = exports.haltAfter = exports.haltWhen = exports.groupedWithin = exports.grouped = exports.groupAdjacentBy = exports.fromReadableStreamByob = exports.fromReadableStream = exports.fromSchedule = exports.fromQueue = exports.fromPull = exports.fromIteratorSucceed = void 0;
exports.runFoldWhileEffect = exports.runFoldWhile = exports.runFoldScopedEffect = exports.runFoldScoped = exports.runFoldEffect = exports.runFold = exports.runDrain = exports.runCount = exports.runCollect = exports.run = exports.retry = exports.repeatEffectWithSchedule = exports.repeatWithSchedule = exports.repeatWith = exports.repeatValue = exports.repeatElementsWith = exports.repeatElements = exports.repeatEither = exports.repeatEffectOption = exports.repeatEffectChunkOption = exports.repeatEffectChunk = exports.repeatEffect = exports.repeat = exports.refineOrDieWith = exports.refineOrDie = exports.rechunk = exports.range = exports.provideSomeLayer = exports.mapInputContext = exports.provideServiceStream = exports.provideServiceEffect = exports.provideService = exports.provideLayer = exports.provideContext = exports.prepend = exports.pipeThroughChannelOrFail = exports.pipeThroughChannel = exports.pipeThrough = exports.partitionEither = exports.partition = exports.peel = exports.paginateEffect = exports.paginateChunkEffect = exports.paginateChunk = exports.paginate = exports.orElseSucceed = exports.orElseIfEmptyStream = exports.orElseIfEmptyChunk = exports.orElseIfEmpty = exports.orElseFail = void 0;
exports.timeoutFail = exports.timeout = exports.tick = exports.throttleEffect = exports.throttle = exports.tapSink = exports.tapErrorCause = exports.tapError = exports.tapBoth = exports.tap = exports.takeWhile = exports.takeUntilEffect = exports.takeUntil = exports.takeRight = exports.take = exports.suspend = exports.sync = exports.succeed = exports.splitLines = exports.splitOnChunk = exports.split = exports.slidingSize = exports.sliding = exports.someOrFail = exports.someOrElse = exports.some = exports.scoped = exports.scanEffect = exports.scheduleWith = exports.schedule = exports.scanReduceEffect = exports.scanReduce = exports.scan = exports.runSum = exports.runScoped = exports.runLast = exports.runIntoQueueScoped = exports.runIntoQueueElementsScoped = exports.runIntoQueue = exports.runIntoPubSubScoped = exports.runIntoPubSub = exports.runHead = exports.runForEachWhileScoped = exports.runForEachWhile = exports.runForEachScoped = exports.runForEachChunkScoped = exports.runForEachChunk = exports.runForEach = exports.runFoldWhileScopedEffect = exports.runFoldWhileScoped = void 0;
exports.encodeText = exports.decodeText = exports.channelToStream = exports.let_ = exports.bindTo = exports.bind = exports.Do = exports.zipWithPreviousAndNext = exports.zipWithPrevious = exports.zipWithNext = exports.zipWithIndex = exports.zipWithChunks = exports.zipWith = exports.zipRight = exports.zipLeft = exports.zipLatestWith = exports.zipLatest = exports.zipAllWith = exports.zipAllSortedByKeyWith = exports.zipAllSortedByKeyRight = exports.zipAllSortedByKeyLeft = exports.zipAllSortedByKey = exports.zipAllRight = exports.zipAllLeft = exports.zipAll = exports.zipFlatten = exports.zip = exports.withSpan = exports.whenEffect = exports.whenCaseEffect = exports.whenCase = exports.when = exports.updateService = exports.unwrapScoped = exports.unwrap = exports.unit = exports.unfoldEffect = exports.unfoldChunkEffect = exports.unfoldChunk = exports.unfold = exports.transduce = exports.toReadableStream = exports.toQueueOfElements = exports.toQueue = exports.toPull = exports.toPubSub = exports.timeoutTo = exports.timeoutFailCause = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Clock = /*#__PURE__*/require("../Clock.js");
const Context = /*#__PURE__*/require("../Context.js");
const Deferred = /*#__PURE__*/require("../Deferred.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Effect = /*#__PURE__*/require("../Effect.js");
const Either = /*#__PURE__*/require("../Either.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const Fiber = /*#__PURE__*/require("../Fiber.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Layer = /*#__PURE__*/require("../Layer.js");
const MergeDecision = /*#__PURE__*/require("../MergeDecision.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const PubSub = /*#__PURE__*/require("../PubSub.js");
const Queue = /*#__PURE__*/require("../Queue.js");
const Ref = /*#__PURE__*/require("../Ref.js");
const Runtime = /*#__PURE__*/require("../Runtime.js");
const Schedule = /*#__PURE__*/require("../Schedule.js");
const Scope = /*#__PURE__*/require("../Scope.js");
const HaltStrategy = /*#__PURE__*/require("../StreamHaltStrategy.js");
const channel = /*#__PURE__*/require("./channel.js");
const channelExecutor = /*#__PURE__*/require("./channel/channelExecutor.js");
const MergeStrategy = /*#__PURE__*/require("./channel/mergeStrategy.js");
const singleProducerAsyncInput = /*#__PURE__*/require("./channel/singleProducerAsyncInput.js");
const core = /*#__PURE__*/require("./core-stream.js");
const ringBuffer_js_1 = /*#__PURE__*/require("./ringBuffer.js");
const _sink = /*#__PURE__*/require("./sink.js");
const DebounceState = /*#__PURE__*/require("./stream/debounceState.js");
const emit = /*#__PURE__*/require("./stream/emit.js");
const haltStrategy = /*#__PURE__*/require("./stream/haltStrategy.js");
const Handoff = /*#__PURE__*/require("./stream/handoff.js");
const HandoffSignal = /*#__PURE__*/require("./stream/handoffSignal.js");
const pull = /*#__PURE__*/require("./stream/pull.js");
const SinkEndReason = /*#__PURE__*/require("./stream/sinkEndReason.js");
const ZipAllState = /*#__PURE__*/require("./stream/zipAllState.js");
const ZipChunksState = /*#__PURE__*/require("./stream/zipChunksState.js");
const _take = /*#__PURE__*/require("./take.js");
/** @internal */
const StreamSymbolKey = "effect/Stream";
/** @internal */
exports.StreamTypeId = /*#__PURE__*/Symbol.for(StreamSymbolKey);
/** @internal */
const streamVariance = {
  _R: _ => _,
  _E: _ => _,
  _A: _ => _
};
/** @internal */
class StreamImpl {
  channel;
  [exports.StreamTypeId] = streamVariance;
  constructor(channel) {
    this.channel = channel;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.StreamImpl = StreamImpl;
/** @internal */
const isStream = u => (0, Predicate_js_1.hasProperty)(u, exports.StreamTypeId) || Effect.isEffect(u);
exports.isStream = isStream;
/** @internal */
exports.DefaultChunkSize = 4096;
/** @internal */
const accumulate = self => (0, exports.chunks)((0, exports.accumulateChunks)(self));
exports.accumulate = accumulate;
/** @internal */
const accumulateChunks = self => {
  const accumulator = s => core.readWith({
    onInput: input => {
      const next = Chunk.appendAll(s, input);
      return core.flatMap(core.write(next), () => accumulator(next));
    },
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(core.pipeTo((0, exports.toChannel)(self), accumulator(Chunk.empty())));
};
exports.accumulateChunks = accumulateChunks;
/** @internal */
const acquireRelease = (acquire, release) => (0, exports.scoped)(Effect.acquireRelease(acquire, release));
exports.acquireRelease = acquireRelease;
/** @internal */
exports.aggregate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, sink) => (0, exports.aggregateWithin)(self, sink, Schedule.forever));
/** @internal */
exports.aggregateWithin = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, sink, schedule) => (0, exports.filterMap)((0, exports.aggregateWithinEither)(self, sink, schedule), _ => Either.match(_, {
  onLeft: Option.none,
  onRight: Option.some
})));
/** @internal */
exports.aggregateWithinEither = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, sink, schedule) => {
  const layer = Effect.all([Handoff.make(), Ref.make(SinkEndReason.ScheduleEnd), Ref.make(Chunk.empty()), Schedule.driver(schedule), Ref.make(false), Ref.make(false)]);
  return (0, Function_js_1.pipe)((0, exports.fromEffect)(layer), (0, exports.flatMap)(([handoff, sinkEndReason, sinkLeftovers, scheduleDriver, consumed, endAfterEmit]) => {
    const handoffProducer = core.readWithCause({
      onInput: input => core.flatMap(core.fromEffect((0, Function_js_1.pipe)(handoff, Handoff.offer(HandoffSignal.emit(input)), Effect.when(() => Chunk.isNonEmpty(input)))), () => handoffProducer),
      onFailure: cause => core.fromEffect(Handoff.offer(handoff, HandoffSignal.halt(cause))),
      onDone: () => core.fromEffect(Handoff.offer(handoff, HandoffSignal.end(SinkEndReason.UpstreamEnd)))
    });
    const handoffConsumer = (0, Function_js_1.pipe)(Ref.getAndSet(sinkLeftovers, Chunk.empty()), Effect.flatMap(leftovers => {
      if (Chunk.isNonEmpty(leftovers)) {
        return (0, Function_js_1.pipe)(Ref.set(consumed, true), Effect.zipRight(Effect.succeed((0, Function_js_1.pipe)(core.write(leftovers), core.flatMap(() => handoffConsumer)))));
      }
      return (0, Function_js_1.pipe)(Handoff.take(handoff), Effect.map(signal => {
        switch (signal._tag) {
          case HandoffSignal.OP_EMIT:
            {
              return (0, Function_js_1.pipe)(core.fromEffect(Ref.set(consumed, true)), channel.zipRight(core.write(signal.elements)), channel.zipRight(core.fromEffect(Ref.get(endAfterEmit))), core.flatMap(bool => bool ? core.unit : handoffConsumer));
            }
          case HandoffSignal.OP_HALT:
            {
              return core.failCause(signal.cause);
            }
          case HandoffSignal.OP_END:
            {
              if (signal.reason._tag === SinkEndReason.OP_SCHEDULE_END) {
                return (0, Function_js_1.pipe)(Ref.get(consumed), Effect.map(bool => bool ? core.fromEffect((0, Function_js_1.pipe)(Ref.set(sinkEndReason, SinkEndReason.ScheduleEnd), Effect.zipRight(Ref.set(endAfterEmit, true)))) : (0, Function_js_1.pipe)(core.fromEffect((0, Function_js_1.pipe)(Ref.set(sinkEndReason, SinkEndReason.ScheduleEnd), Effect.zipRight(Ref.set(endAfterEmit, true)))), core.flatMap(() => handoffConsumer))), channel.unwrap);
              }
              return (0, Function_js_1.pipe)(Ref.set(sinkEndReason, signal.reason), Effect.zipRight(Ref.set(endAfterEmit, true)), core.fromEffect);
            }
        }
      }));
    }), channel.unwrap);
    const timeout = lastB => scheduleDriver.next(lastB);
    const scheduledAggregator = (sinkFiber, scheduleFiber, scope) => {
      const forkSink = (0, Function_js_1.pipe)(Ref.set(consumed, false), Effect.zipRight(Ref.set(endAfterEmit, false)), Effect.zipRight((0, Function_js_1.pipe)(handoffConsumer, channel.pipeToOrFail(_sink.toChannel(sink)), core.collectElements, channelExecutor.run, Effect.forkIn(scope))));
      const handleSide = (leftovers, b, c) => (0, Function_js_1.pipe)(Ref.set(sinkLeftovers, Chunk.flatten(leftovers)), Effect.zipRight(Effect.map(Ref.get(sinkEndReason), reason => {
        switch (reason._tag) {
          case SinkEndReason.OP_SCHEDULE_END:
            {
              return (0, Function_js_1.pipe)(Effect.all([Ref.get(consumed), forkSink, (0, Function_js_1.pipe)(timeout(Option.some(b)), Effect.forkIn(scope))]), Effect.map(([wasConsumed, sinkFiber, scheduleFiber]) => {
                const toWrite = (0, Function_js_1.pipe)(c, Option.match({
                  onNone: () => Chunk.of(Either.right(b)),
                  onSome: c => Chunk.make(Either.right(b), Either.left(c))
                }));
                if (wasConsumed) {
                  return (0, Function_js_1.pipe)(core.write(toWrite), core.flatMap(() => scheduledAggregator(sinkFiber, scheduleFiber, scope)));
                }
                return scheduledAggregator(sinkFiber, scheduleFiber, scope);
              }), channel.unwrap);
            }
          case SinkEndReason.OP_UPSTREAM_END:
            {
              return (0, Function_js_1.pipe)(Ref.get(consumed), Effect.map(wasConsumed => wasConsumed ? core.write(Chunk.of(Either.right(b))) : core.unit), channel.unwrap);
            }
        }
      })), channel.unwrap);
      return channel.unwrap(Effect.raceWith(Fiber.join(sinkFiber), Fiber.join(scheduleFiber), {
        onSelfDone: (sinkExit, _) => (0, Function_js_1.pipe)(Fiber.interrupt(scheduleFiber), Effect.zipRight((0, Function_js_1.pipe)(Effect.suspend(() => sinkExit), Effect.map(([leftovers, b]) => handleSide(leftovers, b, Option.none()))))),
        onOtherDone: (scheduleExit, _) => Effect.matchCauseEffect(Effect.suspend(() => scheduleExit), {
          onFailure: cause => Either.match(Cause.failureOrCause(cause), {
            onLeft: () => (0, Function_js_1.pipe)(handoff, Handoff.offer(HandoffSignal.end(SinkEndReason.ScheduleEnd)), Effect.forkDaemon, Effect.zipRight((0, Function_js_1.pipe)(Fiber.join(sinkFiber), Effect.map(([leftovers, b]) => handleSide(leftovers, b, Option.none()))))),
            onRight: cause => (0, Function_js_1.pipe)(handoff, Handoff.offer(HandoffSignal.halt(cause)), Effect.forkDaemon, Effect.zipRight((0, Function_js_1.pipe)(Fiber.join(sinkFiber), Effect.map(([leftovers, b]) => handleSide(leftovers, b, Option.none())))))
          }),
          onSuccess: c => (0, Function_js_1.pipe)(handoff, Handoff.offer(HandoffSignal.end(SinkEndReason.ScheduleEnd)), Effect.forkDaemon, Effect.zipRight((0, Function_js_1.pipe)(Fiber.join(sinkFiber), Effect.map(([leftovers, b]) => handleSide(leftovers, b, Option.some(c))))))
        })
      }));
    };
    return (0, exports.unwrapScoped)((0, Function_js_1.pipe)(self, exports.toChannel, core.pipeTo(handoffProducer), channelExecutor.run, Effect.forkScoped, Effect.zipRight((0, Function_js_1.pipe)(handoffConsumer, channel.pipeToOrFail(_sink.toChannel(sink)), core.collectElements, channelExecutor.run, Effect.forkScoped, Effect.flatMap(sinkFiber => (0, Function_js_1.pipe)(Effect.forkScoped(timeout(Option.none())), Effect.flatMap(scheduleFiber => (0, Function_js_1.pipe)(Effect.scope, Effect.map(scope => new StreamImpl(scheduledAggregator(sinkFiber, scheduleFiber, scope)))))))))));
  }));
});
/** @internal */
exports.as = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.map)(self, () => value));
/** @internal */
const _async = (register, outputBuffer = 16) => (0, exports.asyncOption)(cb => {
  register(cb);
  return Option.none();
}, outputBuffer);
exports._async = _async;
/** @internal */
const asyncEffect = (register, outputBuffer = 16) => (0, Function_js_1.pipe)(Effect.acquireRelease(Queue.bounded(outputBuffer), queue => Queue.shutdown(queue)), Effect.flatMap(output => (0, Function_js_1.pipe)(Effect.runtime(), Effect.flatMap(runtime => (0, Function_js_1.pipe)(register(emit.make(k => (0, Function_js_1.pipe)(_take.fromPull(k), Effect.flatMap(take => Queue.offer(output, take)), Effect.asUnit, Runtime.runPromiseExit(runtime)).then(exit => {
  if (Exit.isFailure(exit)) {
    if (!Cause.isInterrupted(exit.cause)) {
      throw Cause.squash(exit.cause);
    }
  }
}))), Effect.map(() => {
  const loop = (0, Function_js_1.pipe)(Queue.take(output), Effect.flatMap(_take.done), Effect.match({
    onFailure: maybeError => (0, Function_js_1.pipe)(core.fromEffect(Queue.shutdown(output)), channel.zipRight(Option.match(maybeError, {
      onNone: () => core.unit,
      onSome: core.fail
    }))),
    onSuccess: chunk => (0, Function_js_1.pipe)(core.write(chunk), core.flatMap(() => loop))
  }), channel.unwrap);
  return loop;
}))))), channel.unwrapScoped, exports.fromChannel);
exports.asyncEffect = asyncEffect;
/** @internal */
const asyncInterrupt = (register, outputBuffer = 16) => (0, Function_js_1.pipe)(Effect.acquireRelease(Queue.bounded(outputBuffer), queue => Queue.shutdown(queue)), Effect.flatMap(output => (0, Function_js_1.pipe)(Effect.runtime(), Effect.flatMap(runtime => (0, Function_js_1.pipe)(Effect.sync(() => register(emit.make(k => (0, Function_js_1.pipe)(_take.fromPull(k), Effect.flatMap(take => Queue.offer(output, take)), Effect.asUnit, Runtime.runPromiseExit(runtime)).then(exit => {
  if (Exit.isFailure(exit)) {
    if (!Cause.isInterrupted(exit.cause)) {
      throw Cause.squash(exit.cause);
    }
  }
})))), Effect.map(Either.match({
  onLeft: canceler => {
    const loop = (0, Function_js_1.pipe)(Queue.take(output), Effect.flatMap(_take.done), Effect.match({
      onFailure: maybeError => channel.zipRight(core.fromEffect(Queue.shutdown(output)), Option.match(maybeError, {
        onNone: () => core.unit,
        onSome: core.fail
      })),
      onSuccess: chunk => (0, Function_js_1.pipe)(core.write(chunk), core.flatMap(() => loop))
    }), channel.unwrap);
    return (0, Function_js_1.pipe)((0, exports.fromChannel)(loop), (0, exports.ensuring)(canceler));
  },
  onRight: stream => (0, exports.unwrap)((0, Function_js_1.pipe)(Queue.shutdown(output), Effect.as(stream)))
})))))), exports.unwrapScoped);
exports.asyncInterrupt = asyncInterrupt;
/** @internal */
const asyncOption = (register, outputBuffer = 16) => (0, exports.asyncInterrupt)(emit => Option.match(register(emit), {
  onNone: () => Either.left(Effect.unit),
  onSome: Either.right
}), outputBuffer);
exports.asyncOption = asyncOption;
/** @internal */
const asyncScoped = (register, outputBuffer = 16) => (0, Function_js_1.pipe)(Effect.acquireRelease(Queue.bounded(outputBuffer), queue => Queue.shutdown(queue)), Effect.flatMap(output => (0, Function_js_1.pipe)(Effect.runtime(), Effect.flatMap(runtime => (0, Function_js_1.pipe)(register(emit.make(k => (0, Function_js_1.pipe)(_take.fromPull(k), Effect.flatMap(take => Queue.offer(output, take)), Effect.asUnit, Runtime.runPromiseExit(runtime)).then(exit => {
  if (Exit.isFailure(exit)) {
    if (!Cause.isInterrupted(exit.cause)) {
      throw Cause.squash(exit.cause);
    }
  }
}))), Effect.zipRight(Ref.make(false)), Effect.flatMap(ref => (0, Function_js_1.pipe)(Ref.get(ref), Effect.map(isDone => isDone ? pull.end() : (0, Function_js_1.pipe)(Queue.take(output), Effect.flatMap(_take.done), Effect.onError(() => (0, Function_js_1.pipe)(Ref.set(ref, true), Effect.zipRight(Queue.shutdown(output)))))))))))), exports.scoped, (0, exports.flatMap)(exports.repeatEffectChunkOption));
exports.asyncScoped = asyncScoped;
/** @internal */
exports.branchAfter = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, n, f) => (0, exports.suspend)(() => {
  const buffering = acc => core.readWith({
    onInput: input => {
      const nextSize = acc.length + input.length;
      if (nextSize >= n) {
        const [b1, b2] = (0, Function_js_1.pipe)(input, Chunk.splitAt(n - acc.length));
        return running((0, Function_js_1.pipe)(acc, Chunk.appendAll(b1)), b2);
      }
      return buffering((0, Function_js_1.pipe)(acc, Chunk.appendAll(input)));
    },
    onFailure: core.fail,
    onDone: () => running(acc, Chunk.empty())
  });
  const running = (prefix, leftover) => core.pipeTo(channel.zipRight(core.write(leftover), channel.identityChannel()), (0, exports.toChannel)(f(prefix)));
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(buffering(Chunk.empty()))));
}));
/** @internal */
exports.broadcast = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, n, maximumLag) => (0, Function_js_1.pipe)(self, (0, exports.broadcastedQueues)(n, maximumLag), Effect.map(tuple => tuple.map(queue => (0, exports.flattenTake)((0, exports.fromQueue)(queue, {
  shutdown: true
}))))));
/** @internal */
exports.broadcastDynamic = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, maximumLag) => (0, Function_js_1.pipe)(self, (0, exports.broadcastedQueuesDynamic)(maximumLag), Effect.map(effect => (0, exports.flattenTake)((0, exports.flatMap)((0, exports.scoped)(effect), exports.fromQueue)))));
/** @internal */
exports.broadcastedQueues = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, n, maximumLag) => Effect.flatMap(PubSub.bounded(maximumLag), pubsub => (0, Function_js_1.pipe)(Effect.all(Array.from({
  length: n
}, () => PubSub.subscribe(pubsub))), Effect.tap(() => Effect.forkScoped((0, exports.runIntoPubSubScoped)(self, pubsub))))));
/** @internal */
exports.broadcastedQueuesDynamic = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, maximumLag) => Effect.map((0, exports.toPubSub)(self, maximumLag), PubSub.subscribe));
/** @internal */
exports.buffer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  if (options.capacity === "unbounded") {
    return bufferUnbounded(self);
  } else if (options.strategy === "dropping") {
    return bufferDropping(self, options.capacity);
  } else if (options.strategy === "sliding") {
    return bufferSliding(self, options.capacity);
  }
  const queue = (0, exports.toQueueOfElements)(self, options);
  return new StreamImpl(channel.unwrapScoped(Effect.map(queue, queue => {
    const process = (0, Function_js_1.pipe)(core.fromEffect(Queue.take(queue)), core.flatMap(Exit.match({
      onFailure: cause => (0, Function_js_1.pipe)(Cause.flipCauseOption(cause), Option.match({
        onNone: () => core.unit,
        onSome: core.failCause
      })),
      onSuccess: value => core.flatMap(core.write(Chunk.of(value)), () => process)
    })));
    return process;
  })));
});
/** @internal */
exports.bufferChunks = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  if (options.strategy === "dropping") {
    return bufferChunksDropping(self, options.capacity);
  } else if (options.strategy === "sliding") {
    return bufferChunksSliding(self, options.capacity);
  }
  const queue = (0, exports.toQueue)(self, options);
  return new StreamImpl(channel.unwrapScoped(Effect.map(queue, queue => {
    const process = (0, Function_js_1.pipe)(core.fromEffect(Queue.take(queue)), core.flatMap(_take.match({
      onEnd: () => core.unit,
      onFailure: core.failCause,
      onSuccess: value => (0, Function_js_1.pipe)(core.write(value), core.flatMap(() => process))
    })));
    return process;
  })));
});
const bufferChunksDropping = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, capacity) => {
  const queue = Effect.acquireRelease(Queue.dropping(capacity), queue => Queue.shutdown(queue));
  return new StreamImpl(bufferSignal(queue, (0, exports.toChannel)(self)));
});
const bufferChunksSliding = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, capacity) => {
  const queue = Effect.acquireRelease(Queue.sliding(capacity), queue => Queue.shutdown(queue));
  return new StreamImpl(bufferSignal(queue, (0, exports.toChannel)(self)));
});
const bufferDropping = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, capacity) => {
  const queue = Effect.acquireRelease(Queue.dropping(capacity), queue => Queue.shutdown(queue));
  return new StreamImpl(bufferSignal(queue, (0, exports.toChannel)((0, exports.rechunk)(1)(self))));
});
const bufferSliding = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, capacity) => {
  const queue = Effect.acquireRelease(Queue.sliding(capacity), queue => Queue.shutdown(queue));
  return new StreamImpl(bufferSignal(queue, (0, exports.toChannel)((0, Function_js_1.pipe)(self, (0, exports.rechunk)(1)))));
});
const bufferUnbounded = self => {
  const queue = (0, exports.toQueue)(self, {
    strategy: "unbounded"
  });
  return new StreamImpl(channel.unwrapScoped(Effect.map(queue, queue => {
    const process = (0, Function_js_1.pipe)(core.fromEffect(Queue.take(queue)), core.flatMap(_take.match({
      onEnd: () => core.unit,
      onFailure: core.failCause,
      onSuccess: value => core.flatMap(core.write(value), () => process)
    })));
    return process;
  })));
};
/** @internal */
const bufferSignal = (scoped, bufferChannel) => {
  const producer = (queue, ref) => {
    const terminate = take => (0, Function_js_1.pipe)(Ref.get(ref), Effect.tap(Deferred.await), Effect.zipRight(Deferred.make()), Effect.flatMap(deferred => (0, Function_js_1.pipe)(Queue.offer(queue, [take, deferred]), Effect.zipRight(Ref.set(ref, deferred)), Effect.zipRight(Deferred.await(deferred)))), Effect.asUnit, core.fromEffect);
    return core.readWithCause({
      onInput: input => (0, Function_js_1.pipe)(Deferred.make(), Effect.flatMap(deferred => (0, Function_js_1.pipe)(Queue.offer(queue, [_take.chunk(input), deferred]), Effect.flatMap(added => (0, Function_js_1.pipe)(Ref.set(ref, deferred), Effect.when(() => added))))), Effect.asUnit, core.fromEffect, core.flatMap(() => producer(queue, ref))),
      onFailure: error => terminate(_take.failCause(error)),
      onDone: () => terminate(_take.end)
    });
  };
  const consumer = queue => {
    const process = (0, Function_js_1.pipe)(core.fromEffect(Queue.take(queue)), core.flatMap(([take, deferred]) => channel.zipRight(core.fromEffect(Deferred.succeed(deferred, void 0)), _take.match(take, {
      onEnd: () => core.unit,
      onFailure: core.failCause,
      onSuccess: value => (0, Function_js_1.pipe)(core.write(value), core.flatMap(() => process))
    }))));
    return process;
  };
  return channel.unwrapScoped((0, Function_js_1.pipe)(scoped, Effect.flatMap(queue => (0, Function_js_1.pipe)(Deferred.make(), Effect.tap(start => Deferred.succeed(start, void 0)), Effect.flatMap(start => (0, Function_js_1.pipe)(Ref.make(start), Effect.flatMap(ref => (0, Function_js_1.pipe)(bufferChannel, core.pipeTo(producer(queue, ref)), channelExecutor.runScoped, Effect.forkScoped)), Effect.as(consumer(queue))))))));
};
/** @internal */
exports.catchAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.catchAllCause)(self, cause => Either.match(Cause.failureOrCause(cause), {
  onLeft: f,
  onRight: exports.failCause
})));
/** @internal */
exports.catchAllCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.catchAllCause(cause => (0, exports.toChannel)(f(cause))))));
/** @internal */
exports.catchSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)(self, (0, exports.catchAll)(error => (0, Function_js_1.pipe)(pf(error), Option.getOrElse(() => (0, exports.fail)(error))))));
/** @internal */
exports.catchSomeCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)(self, (0, exports.catchAllCause)(cause => (0, Function_js_1.pipe)(pf(cause), Option.getOrElse(() => (0, exports.failCause)(cause))))));
/* @internal */
exports.catchTag = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, k, f) => (0, exports.catchAll)(self, e => {
  if ("_tag" in e && e["_tag"] === k) {
    return f(e);
  }
  return (0, exports.fail)(e);
}));
/** @internal */
exports.catchTags = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cases) => (0, exports.catchAll)(self, e => {
  const keys = Object.keys(cases);
  if ("_tag" in e && keys.includes(e["_tag"])) {
    return cases[e["_tag"]](e);
  }
  return (0, exports.fail)(e);
}));
/** @internal */
const changes = self => (0, Function_js_1.pipe)(self, (0, exports.changesWith)((x, y) => Equal.equals(y)(x)));
exports.changes = changes;
/** @internal */
exports.changesWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const writer = last => core.readWithCause({
    onInput: input => {
      const [newLast, newChunk] = Chunk.reduce(input, [last, Chunk.empty()], ([option, outputs], output) => {
        if (Option.isSome(option) && f(option.value, output)) {
          return [Option.some(output), outputs];
        }
        return [Option.some(output), (0, Function_js_1.pipe)(outputs, Chunk.append(output))];
      });
      return core.flatMap(core.write(newChunk), () => writer(newLast));
    },
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(writer(Option.none()))));
});
/** @internal */
exports.changesWithEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const writer = last => core.readWithCause({
    onInput: input => (0, Function_js_1.pipe)(input, Effect.reduce([last, Chunk.empty()], ([option, outputs], output) => {
      if (Option.isSome(option)) {
        return (0, Function_js_1.pipe)(f(option.value, output), Effect.map(bool => bool ? [Option.some(output), outputs] : [Option.some(output), (0, Function_js_1.pipe)(outputs, Chunk.append(output))]));
      }
      return Effect.succeed([Option.some(output), (0, Function_js_1.pipe)(outputs, Chunk.append(output))]);
    }), core.fromEffect, core.flatMap(([newLast, newChunk]) => (0, Function_js_1.pipe)(core.write(newChunk), core.flatMap(() => writer(newLast))))),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(writer(Option.none()))));
});
/** @internal */
const chunks = self => (0, Function_js_1.pipe)(self, (0, exports.mapChunks)(Chunk.of));
exports.chunks = chunks;
/** @internal */
exports.chunksWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flattenChunks)(f((0, exports.chunks)(self))));
const unsome = effect => Effect.catchAll(Effect.asSome(effect), o => o._tag === "None" ? Effect.succeedNone : Effect.fail(o.value));
/** @internal */
exports.combine = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, that, s, f) => {
  const producer = (handoff, latch) => (0, Function_js_1.pipe)(core.fromEffect(Handoff.take(latch)), channel.zipRight(core.readWithCause({
    onInput: input => core.flatMap(core.fromEffect((0, Function_js_1.pipe)(handoff, Handoff.offer(Exit.succeed(input)))), () => producer(handoff, latch)),
    onFailure: cause => core.fromEffect(Handoff.offer(handoff, Exit.failCause((0, Function_js_1.pipe)(cause, Cause.map(Option.some))))),
    onDone: () => core.flatMap(core.fromEffect(Handoff.offer(handoff, Exit.fail(Option.none()))), () => producer(handoff, latch))
  })));
  return new StreamImpl(channel.unwrapScoped(Effect.gen(function* ($) {
    const left = yield* $(Handoff.make());
    const right = yield* $(Handoff.make());
    const latchL = yield* $(Handoff.make());
    const latchR = yield* $(Handoff.make());
    yield* $((0, exports.toChannel)(self), channel.concatMap(channel.writeChunk), core.pipeTo(producer(left, latchL)), channelExecutor.runScoped, Effect.forkScoped);
    yield* $((0, exports.toChannel)(that), channel.concatMap(channel.writeChunk), core.pipeTo(producer(right, latchR)), channelExecutor.runScoped, Effect.forkScoped);
    const pullLeft = (0, Function_js_1.pipe)(latchL, Handoff.offer(void 0),
    // TODO: remove
    Effect.zipRight((0, Function_js_1.pipe)(Handoff.take(left), Effect.flatMap(exit => Effect.suspend(() => exit)))));
    const pullRight = (0, Function_js_1.pipe)(latchR, Handoff.offer(void 0),
    // TODO: remove
    Effect.zipRight((0, Function_js_1.pipe)(Handoff.take(right), Effect.flatMap(exit => Effect.suspend(() => exit)))));
    return (0, exports.toChannel)((0, exports.unfoldEffect)(s, s => Effect.flatMap(f(s, pullLeft, pullRight), unsome)));
  })));
});
/** @internal */
exports.combineChunks = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, that, s, f) => {
  const producer = (handoff, latch) => channel.zipRight(core.fromEffect(Handoff.take(latch)), core.readWithCause({
    onInput: input => core.flatMap(core.fromEffect((0, Function_js_1.pipe)(handoff, Handoff.offer(_take.chunk(input)))), () => producer(handoff, latch)),
    onFailure: cause => core.fromEffect(Handoff.offer(handoff, _take.failCause(cause))),
    onDone: () => core.fromEffect(Handoff.offer(handoff, _take.end))
  }));
  return new StreamImpl((0, Function_js_1.pipe)(Effect.all([Handoff.make(), Handoff.make(), Handoff.make(), Handoff.make()]), Effect.tap(([left, _, latchL]) => (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(producer(left, latchL)), channelExecutor.runScoped, Effect.forkScoped)), Effect.tap(([_, right, __, latchR]) => (0, Function_js_1.pipe)((0, exports.toChannel)(that), core.pipeTo(producer(right, latchR)), channelExecutor.runScoped, Effect.forkScoped)), Effect.map(([left, right, latchL, latchR]) => {
    const pullLeft = (0, Function_js_1.pipe)(latchL, Handoff.offer(void 0), Effect.zipRight((0, Function_js_1.pipe)(Handoff.take(left), Effect.flatMap(_take.done))));
    const pullRight = (0, Function_js_1.pipe)(latchR, Handoff.offer(void 0), Effect.zipRight((0, Function_js_1.pipe)(Handoff.take(right), Effect.flatMap(_take.done))));
    return (0, exports.toChannel)((0, exports.unfoldChunkEffect)(s, s => Effect.flatMap(f(s, pullLeft, pullRight), unsome)));
  }), channel.unwrapScoped));
});
/** @internal */
exports.concat = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.zipRight((0, exports.toChannel)(that)))));
/** @internal */
const concatAll = streams => (0, exports.suspend)(() => (0, Function_js_1.pipe)(streams, Chunk.reduce(exports.empty, (x, y) => (0, exports.concat)(y)(x))));
exports.concatAll = concatAll;
/** @internal */
exports.cross = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.crossWith)(that, (a, a2) => [a, a2])));
/** @internal */
exports.crossLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.crossWith)(that, (a, _) => a)));
/** @internal */
exports.crossRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.flatMap)(self, () => that));
/** @internal */
exports.crossWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, Function_js_1.pipe)(self, (0, exports.flatMap)(a => (0, Function_js_1.pipe)(that, (0, exports.map)(b => f(a, b))))));
/** @internal */
exports.debounce = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, duration) => (0, Function_js_1.pipe)(singleProducerAsyncInput.make(), Effect.flatMap(input => Effect.transplant(grafter => (0, Function_js_1.pipe)(Handoff.make(), Effect.map(handoff => {
  const enqueue = last => (0, Function_js_1.pipe)(Clock.sleep(duration), Effect.as(last), Effect.fork, grafter, Effect.map(fiber => consumer(DebounceState.previous(fiber))));
  const producer = core.readWithCause({
    onInput: input => Option.match(Chunk.last(input), {
      onNone: () => producer,
      onSome: last => core.flatMap(core.fromEffect(Handoff.offer(handoff, HandoffSignal.emit(Chunk.of(last)))), () => producer)
    }),
    onFailure: cause => core.fromEffect(Handoff.offer(handoff, HandoffSignal.halt(cause))),
    onDone: () => core.fromEffect(Handoff.offer(handoff, HandoffSignal.end(SinkEndReason.UpstreamEnd)))
  });
  const consumer = state => {
    switch (state._tag) {
      case DebounceState.OP_NOT_STARTED:
        {
          return (0, Function_js_1.pipe)(Handoff.take(handoff), Effect.map(signal => {
            switch (signal._tag) {
              case HandoffSignal.OP_EMIT:
                {
                  return channel.unwrap(enqueue(signal.elements));
                }
              case HandoffSignal.OP_HALT:
                {
                  return core.failCause(signal.cause);
                }
              case HandoffSignal.OP_END:
                {
                  return core.unit;
                }
            }
          }), channel.unwrap);
        }
      case DebounceState.OP_PREVIOUS:
        {
          return channel.unwrap(Effect.raceWith(Fiber.join(state.fiber), Handoff.take(handoff), {
            onSelfDone: (leftExit, current) => Exit.match(leftExit, {
              onFailure: cause => (0, Function_js_1.pipe)(Fiber.interrupt(current), Effect.as(core.failCause(cause))),
              onSuccess: chunk => Effect.succeed((0, Function_js_1.pipe)(core.write(chunk), core.flatMap(() => consumer(DebounceState.current(current)))))
            }),
            onOtherDone: (rightExit, previous) => Exit.match(rightExit, {
              onFailure: cause => (0, Function_js_1.pipe)(Fiber.interrupt(previous), Effect.as(core.failCause(cause))),
              onSuccess: signal => {
                switch (signal._tag) {
                  case HandoffSignal.OP_EMIT:
                    {
                      return (0, Function_js_1.pipe)(Fiber.interrupt(previous), Effect.zipRight(enqueue(signal.elements)));
                    }
                  case HandoffSignal.OP_HALT:
                    {
                      return (0, Function_js_1.pipe)(Fiber.interrupt(previous), Effect.as(core.failCause(signal.cause)));
                    }
                  case HandoffSignal.OP_END:
                    {
                      return (0, Function_js_1.pipe)(Fiber.join(previous), Effect.map(chunk => (0, Function_js_1.pipe)(core.write(chunk), channel.zipRight(core.unit))));
                    }
                }
              }
            })
          }));
        }
      case DebounceState.OP_CURRENT:
        {
          return (0, Function_js_1.pipe)(Fiber.join(state.fiber), Effect.map(signal => {
            switch (signal._tag) {
              case HandoffSignal.OP_EMIT:
                {
                  return channel.unwrap(enqueue(signal.elements));
                }
              case HandoffSignal.OP_HALT:
                {
                  return core.failCause(signal.cause);
                }
              case HandoffSignal.OP_END:
                {
                  return core.unit;
                }
            }
          }), channel.unwrap);
        }
    }
  };
  const debounceChannel = (0, Function_js_1.pipe)(channel.fromInput(input), core.pipeTo(producer), channelExecutor.run, Effect.forkScoped, Effect.as((0, Function_js_1.pipe)(consumer(DebounceState.notStarted), core.embedInput(input))), channel.unwrapScoped);
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(debounceChannel)));
})))), exports.unwrap));
/** @internal */
const die = defect => (0, exports.fromEffect)(Effect.die(defect));
exports.die = die;
/** @internal */
const dieSync = evaluate => (0, exports.fromEffect)(Effect.dieSync(evaluate));
exports.dieSync = dieSync;
/** @internal */
const dieMessage = message => (0, exports.fromEffect)(Effect.dieMessage(message));
exports.dieMessage = dieMessage;
/** @internal */
exports.distributedWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, Function_js_1.pipe)(Deferred.make(), Effect.flatMap(deferred => (0, Function_js_1.pipe)(self, (0, exports.distributedWithDynamic)({
  maximumLag: options.maximumLag,
  decide: a => Effect.flatMap(Deferred.await(deferred), f => f(a))
}), Effect.flatMap(next => (0, Function_js_1.pipe)(Effect.all(Chunk.map(Chunk.range(0, options.size - 1), id => Effect.map(next, ([key, queue]) => [[key, id], queue]))), Effect.map(Chunk.unsafeFromArray), Effect.flatMap(entries => {
  const [mappings, queues] = Chunk.reduceRight(entries, [new Map(), Chunk.empty()], ([mappings, queues], [mapping, queue]) => [mappings.set(mapping[0], mapping[1]), (0, Function_js_1.pipe)(queues, Chunk.prepend(queue))]);
  return (0, Function_js_1.pipe)(Deferred.succeed(deferred, a => Effect.map(options.decide(a), f => key => (0, Function_js_1.pipe)(f(mappings.get(key))))), Effect.as(Array.from(queues)));
})))))));
/** @internal */
const distributedWithDynamicId = {
  ref: 0
};
const newDistributedWithDynamicId = () => {
  const current = distributedWithDynamicId.ref;
  distributedWithDynamicId.ref = current + 1;
  return current;
};
/** @internal */
exports.distributedWithDynamic = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.distributedWithDynamicCallback)(self, options.maximumLag, options.decide, () => Effect.unit));
exports.distributedWithDynamicCallback = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, maximumLag, decide, done) => (0, Function_js_1.pipe)(Effect.acquireRelease(Ref.make(new Map()), (ref, _) => (0, Function_js_1.pipe)(Ref.get(ref), Effect.flatMap(queues => (0, Function_js_1.pipe)(queues.values(), Effect.forEach(Queue.shutdown))))), Effect.flatMap(queuesRef => Effect.gen(function* ($) {
  const offer = a => (0, Function_js_1.pipe)(decide(a), Effect.flatMap(shouldProcess => (0, Function_js_1.pipe)(Ref.get(queuesRef), Effect.flatMap(queues => (0, Function_js_1.pipe)(queues.entries(), Effect.reduce(Chunk.empty(), (acc, [id, queue]) => {
    if (shouldProcess(id)) {
      return (0, Function_js_1.pipe)(Queue.offer(queue, Exit.succeed(a)), Effect.matchCauseEffect({
        onFailure: cause =>
        // Ignore all downstream queues that were shut
        // down and remove them later
        Cause.isInterrupted(cause) ? Effect.succeed((0, Function_js_1.pipe)(acc, Chunk.prepend(id))) : Effect.failCause(cause),
        onSuccess: () => Effect.succeed(acc)
      }));
    }
    return Effect.succeed(acc);
  }), Effect.flatMap(ids => {
    if (Chunk.isNonEmpty(ids)) {
      return (0, Function_js_1.pipe)(Ref.update(queuesRef, map => {
        for (const id of ids) {
          map.delete(id);
        }
        return map;
      }));
    }
    return Effect.unit;
  }))))), Effect.asUnit);
  const queuesLock = yield* $(Effect.makeSemaphore(1));
  const newQueue = yield* $(Ref.make((0, Function_js_1.pipe)(Queue.bounded(maximumLag), Effect.flatMap(queue => {
    const id = newDistributedWithDynamicId();
    return (0, Function_js_1.pipe)(Ref.update(queuesRef, map => map.set(id, queue)), Effect.as([id, queue]));
  }))));
  const finalize = endTake =>
  // Make sure that no queues are currently being added
  queuesLock.withPermits(1)((0, Function_js_1.pipe)(Ref.set(newQueue, (0, Function_js_1.pipe)(
  // All newly created queues should end immediately
  Queue.bounded(1), Effect.tap(queue => Queue.offer(queue, endTake)), Effect.flatMap(queue => {
    const id = newDistributedWithDynamicId();
    return (0, Function_js_1.pipe)(Ref.update(queuesRef, map => map.set(id, queue)), Effect.as([id, queue]));
  }))), Effect.zipRight((0, Function_js_1.pipe)(Ref.get(queuesRef), Effect.flatMap(map => (0, Function_js_1.pipe)(Chunk.fromIterable(map.values()), Effect.forEach(queue => (0, Function_js_1.pipe)(Queue.offer(queue, endTake), Effect.catchSomeCause(cause => Cause.isInterrupted(cause) ? Option.some(Effect.unit) : Option.none()))))))), Effect.zipRight(done(endTake)), Effect.asUnit));
  yield* $(self, (0, exports.runForEachScoped)(offer), Effect.matchCauseEffect({
    onFailure: cause => finalize(Exit.failCause((0, Function_js_1.pipe)(cause, Cause.map(Option.some)))),
    onSuccess: () => finalize(Exit.fail(Option.none()))
  }), Effect.forkScoped);
  return queuesLock.withPermits(1)(Effect.flatten(Ref.get(newQueue)));
}))));
/** @internal */
const drain = self => new StreamImpl(channel.drain((0, exports.toChannel)(self)));
exports.drain = drain;
/** @internal */
exports.drainFork = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)((0, exports.fromEffect)(Deferred.make()), (0, exports.flatMap)(backgroundDied => (0, Function_js_1.pipe)((0, exports.scoped)((0, Function_js_1.pipe)(that, (0, exports.runForEachScoped)(() => Effect.unit), Effect.catchAllCause(cause => Deferred.failCause(backgroundDied, cause)), Effect.forkScoped)), (0, exports.crossRight)((0, Function_js_1.pipe)(self, (0, exports.interruptWhenDeferred)(backgroundDied)))))));
/** @internal */
exports.drop = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const loop = r => core.readWith({
    onInput: input => {
      const dropped = (0, Function_js_1.pipe)(input, Chunk.drop(r));
      const leftover = Math.max(0, r - input.length);
      const more = Chunk.isEmpty(input) || leftover > 0;
      if (more) {
        return loop(leftover);
      }
      return (0, Function_js_1.pipe)(core.write(dropped), channel.zipRight(channel.identityChannel()));
    },
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(loop(n))));
});
/** @internal */
exports.dropRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  if (n <= 0) {
    return (0, exports.identityStream)();
  }
  return (0, exports.suspend)(() => {
    const queue = new ringBuffer_js_1.RingBuffer(n);
    const reader = core.readWith({
      onInput: input => {
        const outputs = (0, Function_js_1.pipe)(input, Chunk.filterMap(elem => {
          const head = queue.head();
          queue.put(elem);
          return head;
        }));
        return (0, Function_js_1.pipe)(core.write(outputs), core.flatMap(() => reader));
      },
      onFailure: core.fail,
      onDone: () => core.unit
    });
    return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(reader)));
  });
});
/** @internal */
exports.dropUntil = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.drop)((0, exports.dropWhile)(self, a => !predicate(a)), 1));
/** @internal */
exports.dropUntilEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => (0, Function_js_1.pipe)(Effect.dropUntil(input, predicate), Effect.map(Chunk.unsafeFromArray), Effect.map(leftover => {
      const more = Chunk.isEmpty(leftover);
      if (more) {
        return core.suspend(() => loop);
      }
      return (0, Function_js_1.pipe)(core.write(leftover), channel.zipRight(channel.identityChannel()));
    }), channel.unwrap),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(loop)));
});
/** @internal */
exports.dropWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => {
      const output = Chunk.dropWhile(input, predicate);
      if (Chunk.isEmpty(output)) {
        return core.suspend(() => loop);
      }
      return channel.zipRight(core.write(output), channel.identityChannel());
    },
    onFailure: core.fail,
    onDone: core.succeedNow
  });
  return new StreamImpl(channel.pipeToOrFail((0, exports.toChannel)(self), loop));
});
/** @internal */
exports.dropWhileEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => (0, Function_js_1.pipe)(Effect.dropWhile(input, predicate), Effect.map(Chunk.unsafeFromArray), Effect.map(leftover => {
      const more = Chunk.isEmpty(leftover);
      if (more) {
        return core.suspend(() => loop);
      }
      return channel.zipRight(core.write(leftover), channel.identityChannel());
    }), channel.unwrap),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(channel.pipeToOrFail((0, exports.toChannel)(self), loop));
});
/** @internal */
const either = self => (0, Function_js_1.pipe)(self, (0, exports.map)(Either.right), (0, exports.catchAll)(error => (0, exports.make)(Either.left(error))));
exports.either = either;
/** @internal */
exports.empty = /*#__PURE__*/new StreamImpl( /*#__PURE__*/core.write( /*#__PURE__*/Chunk.empty()));
/** @internal */
exports.ensuring = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.ensuring(finalizer))));
/** @internal */
exports.ensuringWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => new StreamImpl(core.ensuringWith((0, exports.toChannel)(self), finalizer)));
/** @internal */
const context = () => (0, exports.fromEffect)(Effect.context());
exports.context = context;
/** @internal */
const contextWith = f => (0, Function_js_1.pipe)((0, exports.context)(), (0, exports.map)(f));
exports.contextWith = contextWith;
/** @internal */
const contextWithEffect = f => (0, Function_js_1.pipe)((0, exports.context)(), (0, exports.mapEffectSequential)(f));
exports.contextWithEffect = contextWithEffect;
/** @internal */
const contextWithStream = f => (0, Function_js_1.pipe)((0, exports.context)(), (0, exports.flatMap)(f));
exports.contextWithStream = contextWithStream;
/** @internal */
const execute = effect => (0, exports.drain)((0, exports.fromEffect)(effect));
exports.execute = execute;
/** @internal */
const fail = error => (0, exports.fromEffectOption)(Effect.fail(Option.some(error)));
exports.fail = fail;
/** @internal */
const failSync = evaluate => (0, exports.fromEffectOption)(Effect.failSync(() => Option.some(evaluate())));
exports.failSync = failSync;
/** @internal */
const failCause = cause => (0, exports.fromEffect)(Effect.failCause(cause));
exports.failCause = failCause;
/** @internal */
const failCauseSync = evaluate => (0, exports.fromEffect)(Effect.failCauseSync(evaluate));
exports.failCauseSync = failCauseSync;
/** @internal */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.mapChunks)(self, Chunk.filter(predicate)));
/** @internal */
exports.filterEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const loop = iterator => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: input => loop(input[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeed
      });
    } else {
      return (0, Function_js_1.pipe)(f(next.value), Effect.map(bool => bool ? (0, Function_js_1.pipe)(core.write(Chunk.of(next.value)), core.flatMap(() => loop(iterator))) : loop(iterator)), channel.unwrap);
    }
  };
  return new StreamImpl(core.suspend(() => (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(loop(Chunk.empty()[Symbol.iterator]())))));
});
/** @internal */
exports.filterMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.mapChunks)(self, Chunk.filterMap(pf)));
/** @internal */
exports.filterMapEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.suspend)(() => {
  const loop = iterator => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: input => loop(input[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeed
      });
    } else {
      return (0, Function_js_1.pipe)(pf(next.value), Option.match({
        onNone: () => Effect.sync(() => loop(iterator)),
        onSome: Effect.map(a2 => core.flatMap(core.write(Chunk.of(a2)), () => loop(iterator)))
      }), channel.unwrap);
    }
  };
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(loop(Chunk.empty()[Symbol.iterator]()))));
}));
/** @internal */
exports.filterMapWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => {
  const loop = core.readWith({
    onInput: input => {
      const mapped = Chunk.filterMapWhile(input, pf);
      if (mapped.length === input.length) {
        return (0, Function_js_1.pipe)(core.write(mapped), core.flatMap(() => loop));
      }
      return core.write(mapped);
    },
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(loop)));
});
/** @internal */
exports.filterMapWhileEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.suspend)(() => {
  const loop = iterator => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: input => loop(input[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeed
      });
    } else {
      return channel.unwrap(Option.match(pf(next.value), {
        onNone: () => Effect.succeed(core.unit),
        onSome: Effect.map(a2 => core.flatMap(core.write(Chunk.of(a2)), () => loop(iterator)))
      }));
    }
  };
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(loop(Chunk.empty()[Symbol.iterator]()))));
}));
/** @internal */
const finalizer = finalizer => (0, exports.acquireRelease)(Effect.unit, () => finalizer);
exports.finalizer = finalizer;
/** @internal */
exports.find = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => Option.match(Chunk.findFirst(input, predicate), {
      onNone: () => loop,
      onSome: n => core.write(Chunk.of(n))
    }),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(loop)));
});
/** @internal */
exports.findEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => (0, Function_js_1.pipe)(Effect.findFirst(input, predicate), Effect.map(Option.match({
      onNone: () => loop,
      onSome: n => core.write(Chunk.of(n))
    })), channel.unwrap),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(loop)));
});
/** @internal */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] !== "function", (self, f, options) => {
  const bufferSize = options?.bufferSize ?? 16;
  if (options?.switch) {
    return (0, exports.matchConcurrency)(options?.concurrency, () => flatMapParSwitchBuffer(self, 1, bufferSize, f), n => flatMapParSwitchBuffer(self, n, bufferSize, f));
  }
  return (0, exports.matchConcurrency)(options?.concurrency, () => new StreamImpl(channel.concatMap((0, exports.toChannel)(self), as => (0, Function_js_1.pipe)(as, Chunk.map(a => (0, exports.toChannel)(f(a))), Chunk.reduce(core.unit, (left, right) => (0, Function_js_1.pipe)(left, channel.zipRight(right)))))), _ => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.concatMap(channel.writeChunk), channel.mergeMap(out => (0, exports.toChannel)(f(out)), options))));
});
/** @internal */
const matchConcurrency = (concurrency, sequential, bounded) => {
  switch (concurrency) {
    case undefined:
      return sequential();
    case "unbounded":
      return bounded(Number.MAX_SAFE_INTEGER);
    default:
      return concurrency > 1 ? bounded(concurrency) : sequential();
  }
};
exports.matchConcurrency = matchConcurrency;
const flatMapParSwitchBuffer = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, n, bufferSize, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.concatMap(channel.writeChunk), channel.mergeMap(out => (0, exports.toChannel)(f(out)), {
  concurrency: n,
  mergeStrategy: MergeStrategy.BufferSliding(),
  bufferSize
}))));
/** @internal */
exports.flatten = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isStream)(args[0]), (self, options) => (0, exports.flatMap)(self, Function_js_1.identity, options));
/** @internal */
const flattenChunks = self => {
  const flatten = core.readWithCause({
    onInput: chunks => core.flatMap(channel.writeChunk(chunks), () => flatten),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(flatten)));
};
exports.flattenChunks = flattenChunks;
/** @internal */
exports.flattenEffect = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isStream)(args[0]), (self, options) => options?.unordered ? (0, exports.flatMap)(self, a => (0, exports.fromEffect)(a), {
  concurrency: options.concurrency
}) : (0, exports.matchConcurrency)(options?.concurrency, () => (0, exports.mapEffectSequential)(self, Function_js_1.identity), n => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.concatMap(channel.writeChunk), channel.mapOutEffectPar(Function_js_1.identity, n), channel.mapOut(Chunk.of)))));
/** @internal */
const flattenExitOption = self => {
  const processChunk = (chunk, cont) => {
    const [toEmit, rest] = (0, Function_js_1.pipe)(chunk, Chunk.splitWhere(exit => !Exit.isSuccess(exit)));
    const next = (0, Function_js_1.pipe)(Chunk.head(rest), Option.match({
      onNone: () => cont,
      onSome: Exit.match({
        onFailure: cause => Option.match(Cause.flipCauseOption(cause), {
          onNone: () => core.unit,
          onSome: core.failCause
        }),
        onSuccess: () => core.unit
      })
    }));
    return (0, Function_js_1.pipe)(core.write((0, Function_js_1.pipe)(toEmit, Chunk.filterMap(exit => Exit.isSuccess(exit) ? Option.some(exit.value) : Option.none()))), core.flatMap(() => next));
  };
  const process = core.readWithCause({
    onInput: chunk => processChunk(chunk, process),
    onFailure: cause => core.failCause(cause),
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(process)));
};
exports.flattenExitOption = flattenExitOption;
/** @internal */
const flattenIterables = self => (0, Function_js_1.pipe)(self, (0, exports.map)(Chunk.fromIterable), exports.flattenChunks);
exports.flattenIterables = flattenIterables;
/** @internal */
const flattenTake = self => (0, exports.flattenChunks)((0, exports.flattenExitOption)((0, Function_js_1.pipe)(self, (0, exports.map)(take => take.exit))));
exports.flattenTake = flattenTake;
/** @internal */
const forever = self => new StreamImpl(channel.repeated((0, exports.toChannel)(self)));
exports.forever = forever;
/** @internal */
const fromAsyncIterable = (iterable, onError) => (0, Function_js_1.pipe)(Effect.acquireRelease(Effect.sync(() => iterable[Symbol.asyncIterator]()), iterator => iterator.return ? Effect.promise(async () => iterator.return()) : Effect.unit), Effect.map(iterator => (0, exports.repeatEffectOption)((0, Function_js_1.pipe)(Effect.tryPromise({
  try: async () => iterator.next(),
  catch: reason => Option.some(onError(reason))
}), Effect.flatMap(result => result.done ? Effect.fail(Option.none()) : Effect.succeed(result.value))))), exports.unwrapScoped);
exports.fromAsyncIterable = fromAsyncIterable;
/** @internal */
const fromChannel = channel => new StreamImpl(channel);
exports.fromChannel = fromChannel;
/** @internal */
const toChannel = stream => {
  if ("channel" in stream) {
    return stream.channel;
  } else if (Effect.isEffect(stream)) {
    return (0, exports.toChannel)((0, exports.fromEffect)(stream));
  } else {
    throw new TypeError(`Expected a Stream.`);
  }
};
exports.toChannel = toChannel;
/** @internal */
const fromChunk = chunk => new StreamImpl(Chunk.isEmpty(chunk) ? core.unit : core.write(chunk));
exports.fromChunk = fromChunk;
/** @internal */
const fromChunkPubSub = (pubsub, options) => {
  if (options?.scoped) {
    const effect = Effect.map(PubSub.subscribe(pubsub), exports.fromChunkQueue);
    return options.shutdown ? Effect.map(effect, (0, exports.ensuring)(PubSub.shutdown(pubsub))) : effect;
  }
  const stream = (0, exports.flatMap)((0, exports.scoped)(PubSub.subscribe(pubsub)), exports.fromChunkQueue);
  return options?.shutdown ? (0, exports.ensuring)(stream, PubSub.shutdown(pubsub)) : stream;
};
exports.fromChunkPubSub = fromChunkPubSub;
/** @internal */
const fromChunkQueue = (queue, options) => (0, Function_js_1.pipe)(Queue.take(queue), Effect.catchAllCause(cause => (0, Function_js_1.pipe)(Queue.isShutdown(queue), Effect.flatMap(isShutdown => isShutdown && Cause.isInterrupted(cause) ? pull.end() : pull.failCause(cause)))), exports.repeatEffectChunkOption, options?.shutdown ? (0, exports.ensuring)(Queue.shutdown(queue)) : Function_js_1.identity);
exports.fromChunkQueue = fromChunkQueue;
/** @internal */
const fromChunks = (...chunks) => (0, Function_js_1.pipe)((0, exports.fromIterable)(chunks), (0, exports.flatMap)(exports.fromChunk));
exports.fromChunks = fromChunks;
/** @internal */
const fromEffect = effect => (0, Function_js_1.pipe)(effect, Effect.mapError(Option.some), exports.fromEffectOption);
exports.fromEffect = fromEffect;
/** @internal */
const fromEffectOption = effect => new StreamImpl(channel.unwrap(Effect.match(effect, {
  onFailure: Option.match({
    onNone: () => core.unit,
    onSome: core.fail
  }),
  onSuccess: a => core.write(Chunk.of(a))
})));
exports.fromEffectOption = fromEffectOption;
/** @internal */
const fromPubSub = (pubsub, options) => {
  const maxChunkSize = options?.maxChunkSize ?? exports.DefaultChunkSize;
  if (options?.scoped) {
    const effect = Effect.map(PubSub.subscribe(pubsub), queue => (0, exports.fromQueue)(queue, {
      maxChunkSize,
      shutdown: true
    }));
    return options.shutdown ? Effect.map(effect, (0, exports.ensuring)(PubSub.shutdown(pubsub))) : effect;
  }
  const stream = (0, exports.flatMap)((0, exports.scoped)(PubSub.subscribe(pubsub)), queue => (0, exports.fromQueue)(queue, {
    maxChunkSize
  }));
  return options?.shutdown ? (0, exports.ensuring)(stream, PubSub.shutdown(pubsub)) : stream;
};
exports.fromPubSub = fromPubSub;
/** @internal */
const fromIterable = iterable => (0, exports.suspend)(() => Chunk.isChunk(iterable) ? (0, exports.fromChunk)(iterable) : (0, exports.fromIteratorSucceed)(iterable[Symbol.iterator]()));
exports.fromIterable = fromIterable;
/** @internal */
const fromIterableEffect = effect => (0, Function_js_1.pipe)(effect, Effect.map(exports.fromIterable), exports.unwrap);
exports.fromIterableEffect = fromIterableEffect;
/** @internal */
const fromIteratorSucceed = (iterator, maxChunkSize = exports.DefaultChunkSize) => {
  return (0, Function_js_1.pipe)(Effect.sync(() => {
    let builder = [];
    const loop = iterator => (0, Function_js_1.pipe)(Effect.sync(() => {
      let next = iterator.next();
      if (maxChunkSize === 1) {
        if (next.done) {
          return core.unit;
        }
        return (0, Function_js_1.pipe)(core.write(Chunk.of(next.value)), core.flatMap(() => loop(iterator)));
      }
      builder = [];
      let count = 0;
      while (next.done === false) {
        builder.push(next.value);
        count = count + 1;
        if (count >= maxChunkSize) {
          break;
        }
        next = iterator.next();
      }
      if (count > 0) {
        return (0, Function_js_1.pipe)(core.write(Chunk.unsafeFromArray(builder)), core.flatMap(() => loop(iterator)));
      }
      return core.unit;
    }), channel.unwrap);
    return new StreamImpl(loop(iterator));
  }), exports.unwrap);
};
exports.fromIteratorSucceed = fromIteratorSucceed;
/** @internal */
const fromPull = effect => (0, Function_js_1.pipe)(effect, Effect.map(exports.repeatEffectChunkOption), exports.unwrapScoped);
exports.fromPull = fromPull;
/** @internal */
const fromQueue = (queue, options) => (0, Function_js_1.pipe)(Queue.takeBetween(queue, 1, options?.maxChunkSize ?? exports.DefaultChunkSize), Effect.catchAllCause(cause => (0, Function_js_1.pipe)(Queue.isShutdown(queue), Effect.flatMap(isShutdown => isShutdown && Cause.isInterrupted(cause) ? pull.end() : pull.failCause(cause)))), exports.repeatEffectChunkOption, options?.shutdown ? (0, exports.ensuring)(Queue.shutdown(queue)) : Function_js_1.identity);
exports.fromQueue = fromQueue;
/** @internal */
const fromSchedule = schedule => (0, Function_js_1.pipe)(Schedule.driver(schedule), Effect.map(driver => (0, exports.repeatEffectOption)(driver.next(void 0))), exports.unwrap);
exports.fromSchedule = fromSchedule;
/** @internal */
const fromReadableStream = (evaluate, onError) => (0, exports.unwrapScoped)(Effect.map(Effect.acquireRelease(Effect.sync(() => evaluate().getReader()), reader => Effect.promise(() => reader.cancel())), reader => (0, exports.repeatEffectOption)(Effect.flatMap(Effect.tryPromise({
  try: () => reader.read(),
  catch: reason => Option.some(onError(reason))
}), ({
  done,
  value
}) => done ? Effect.fail(Option.none()) : Effect.succeed(value)))));
exports.fromReadableStream = fromReadableStream;
/** @internal */
const fromReadableStreamByob = (evaluate, onError, allocSize = 4096) => (0, exports.unwrapScoped)(Effect.map(Effect.acquireRelease(Effect.sync(() => evaluate().getReader({
  mode: "byob"
})), reader => Effect.promise(() => reader.cancel())), reader => (0, exports.catchAll)((0, exports.forever)(readChunkStreamByobReader(reader, onError, allocSize)), error => (0, Predicate_js_1.isTagged)(error, "EOF") ? exports.empty : (0, exports.fail)(error))));
exports.fromReadableStreamByob = fromReadableStreamByob;
const readChunkStreamByobReader = (reader, onError, size) => {
  const buffer = new ArrayBuffer(size);
  return (0, exports.paginateEffect)(0, offset => Effect.flatMap(Effect.tryPromise({
    try: () => reader.read(new Uint8Array(buffer, offset, buffer.byteLength - offset)),
    catch: reason => onError(reason)
  }), ({
    done,
    value
  }) => {
    if (done) {
      return Effect.fail({
        _tag: "EOF"
      });
    }
    const newOffset = offset + value.byteLength;
    return Effect.succeed([value, newOffset >= buffer.byteLength ? Option.none() : Option.some(newOffset)]);
  }));
};
/** @internal */
exports.groupAdjacentBy = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const groupAdjacentByChunk = (state, chunk) => {
    if (Chunk.isEmpty(chunk)) {
      return [state, Chunk.empty()];
    }
    const builder = [];
    let from = 0;
    let until = 0;
    let key = undefined;
    let previousChunk = Chunk.empty();
    switch (state._tag) {
      case "Some":
        {
          const tuple = state.value;
          key = tuple[0];
          let loop = true;
          while (loop && until < chunk.length) {
            const input = Chunk.unsafeGet(chunk, until);
            const updatedKey = f(input);
            if (!Equal.equals(key, updatedKey)) {
              const previousChunk = tuple[1];
              const additionalChunk = Chunk.unsafeFromArray(Array.from(chunk).slice(from, until));
              const group = Chunk.appendAllNonEmpty(previousChunk, additionalChunk);
              builder.push([key, group]);
              key = updatedKey;
              from = until;
              loop = false;
            }
            until = until + 1;
          }
          if (loop) {
            previousChunk = tuple[1];
          }
          break;
        }
      case "None":
        {
          key = f(Chunk.unsafeGet(chunk, until));
          until = until + 1;
          break;
        }
    }
    while (until < chunk.length) {
      const input = Chunk.unsafeGet(chunk, until);
      const updatedKey = f(input);
      if (!Equal.equals(key, updatedKey)) {
        builder.push([key, Chunk.unsafeFromArray(Array.from(chunk).slice(from, until))]);
        key = updatedKey;
        from = until;
      }
      until = until + 1;
    }
    const nonEmptyChunk = Chunk.appendAll(previousChunk, Chunk.unsafeFromArray(Array.from(chunk).slice(from, until)));
    const output = Chunk.unsafeFromArray(builder);
    return [Option.some([key, nonEmptyChunk]), output];
  };
  const groupAdjacent = state => core.readWithCause({
    onInput: input => {
      const [updatedState, output] = groupAdjacentByChunk(state, input);
      return Chunk.isEmpty(output) ? groupAdjacent(updatedState) : core.flatMap(core.write(output), () => groupAdjacent(updatedState));
    },
    onFailure: cause => Option.match(state, {
      onNone: () => core.failCause(cause),
      onSome: output => core.flatMap(core.write(Chunk.of(output)), () => core.failCause(cause))
    }),
    onDone: done => Option.match(state, {
      onNone: () => core.succeedNow(done),
      onSome: output => core.flatMap(core.write(Chunk.of(output)), () => core.succeedNow(done))
    })
  });
  return new StreamImpl(channel.pipeToOrFail((0, exports.toChannel)(self), groupAdjacent(Option.none())));
});
/** @internal */
exports.grouped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, chunkSize) => (0, Function_js_1.pipe)(self, (0, exports.rechunk)(chunkSize), exports.chunks));
/** @internal */
exports.groupedWithin = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, chunkSize, duration) => (0, exports.aggregateWithin)(self, _sink.collectAllN(chunkSize), Schedule.spaced(duration)));
/** @internal */
exports.haltWhen = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, effect) => {
  const writer = fiber => (0, Function_js_1.pipe)(Fiber.poll(fiber), Effect.map(Option.match({
    onNone: () => core.readWith({
      onInput: input => core.flatMap(core.write(input), () => writer(fiber)),
      onFailure: core.fail,
      onDone: () => core.unit
    }),
    onSome: Exit.match({
      onFailure: core.failCause,
      onSuccess: () => core.unit
    })
  })), channel.unwrap);
  return new StreamImpl((0, Function_js_1.pipe)(Effect.forkScoped(effect), Effect.map(fiber => (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(writer(fiber)))), channel.unwrapScoped));
});
/** @internal */
exports.haltAfter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, duration) => (0, Function_js_1.pipe)(self, (0, exports.haltWhen)(Clock.sleep(duration))));
/** @internal */
exports.haltWhenDeferred = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, deferred) => {
  const writer = (0, Function_js_1.pipe)(Deferred.poll(deferred), Effect.map(Option.match({
    onNone: () => core.readWith({
      onInput: input => (0, Function_js_1.pipe)(core.write(input), core.flatMap(() => writer)),
      onFailure: core.fail,
      onDone: () => core.unit
    }),
    onSome: effect => channel.unwrap(Effect.match(effect, {
      onFailure: core.fail,
      onSuccess: () => core.unit
    }))
  })), channel.unwrap);
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(writer)));
});
/** @internal */
const identityStream = () => new StreamImpl(channel.identityChannel());
exports.identityStream = identityStream;
/** @internal */
exports.interleave = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.interleaveWith)(that, (0, exports.forever)((0, exports.make)(true, false)))));
/** @internal */
exports.interleaveWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, decider) => {
  const producer = handoff => core.readWithCause({
    onInput: value => core.flatMap(core.fromEffect(Handoff.offer(handoff, _take.of(value))), () => producer(handoff)),
    onFailure: cause => core.fromEffect(Handoff.offer(handoff, _take.failCause(cause))),
    onDone: () => core.fromEffect(Handoff.offer(handoff, _take.end))
  });
  return new StreamImpl(channel.unwrapScoped((0, Function_js_1.pipe)(Handoff.make(), Effect.zip(Handoff.make()), Effect.tap(([left]) => (0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.concatMap(channel.writeChunk), core.pipeTo(producer(left)), channelExecutor.runScoped, Effect.forkScoped)), Effect.tap(([_, right]) => (0, Function_js_1.pipe)((0, exports.toChannel)(that), channel.concatMap(channel.writeChunk), core.pipeTo(producer(right)), channelExecutor.runScoped, Effect.forkScoped)), Effect.map(([left, right]) => {
    const process = (leftDone, rightDone) => core.readWithCause({
      onInput: bool => {
        if (bool && !leftDone) {
          return (0, Function_js_1.pipe)(core.fromEffect(Handoff.take(left)), core.flatMap(_take.match({
            onEnd: () => rightDone ? core.unit : process(true, rightDone),
            onFailure: core.failCause,
            onSuccess: chunk => (0, Function_js_1.pipe)(core.write(chunk), core.flatMap(() => process(leftDone, rightDone)))
          })));
        }
        if (!bool && !rightDone) {
          return (0, Function_js_1.pipe)(core.fromEffect(Handoff.take(right)), core.flatMap(_take.match({
            onEnd: () => leftDone ? core.unit : process(leftDone, true),
            onFailure: core.failCause,
            onSuccess: chunk => (0, Function_js_1.pipe)(core.write(chunk), core.flatMap(() => process(leftDone, rightDone)))
          })));
        }
        return process(leftDone, rightDone);
      },
      onFailure: core.failCause,
      onDone: () => core.unit
    });
    return (0, Function_js_1.pipe)((0, exports.toChannel)(decider), channel.concatMap(channel.writeChunk), core.pipeTo(process(false, false)));
  }))));
});
/** @internal */
exports.intersperse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, element) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(core.suspend(() => {
  const writer = isFirst => core.readWithCause({
    onInput: chunk => {
      const builder = [];
      let flagResult = isFirst;
      for (const output of chunk) {
        if (flagResult) {
          flagResult = false;
          builder.push(output);
        } else {
          builder.push(element);
          builder.push(output);
        }
      }
      return (0, Function_js_1.pipe)(core.write(Chunk.unsafeFromArray(builder)), core.flatMap(() => writer(flagResult)));
    },
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return writer(true);
})))));
/** @internal */
exports.intersperseAffixes = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  end,
  middle,
  start
}) => (0, Function_js_1.pipe)((0, exports.make)(start), (0, exports.concat)((0, Function_js_1.pipe)(self, (0, exports.intersperse)(middle))), (0, exports.concat)((0, exports.make)(end))));
/** @internal */
exports.interruptAfter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, duration) => (0, Function_js_1.pipe)(self, (0, exports.interruptWhen)(Clock.sleep(duration))));
/** @internal */
exports.interruptWhen = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, effect) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.interruptWhen(effect))));
/** @internal */
exports.interruptWhenDeferred = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, deferred) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.interruptWhenDeferred(deferred))));
/** @internal */
const iterate = (value, next) => (0, exports.unfold)(value, a => Option.some([a, next(a)]));
exports.iterate = iterate;
/** @internal */
const make = (...as) => (0, exports.fromIterable)(as);
exports.make = make;
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.mapOut(Chunk.map(f)))));
/** @internal */
exports.mapAccum = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => {
  const accumulator = s => core.readWith({
    onInput: input => {
      const [nextS, chunk] = Chunk.mapAccum(input, s, f);
      return core.flatMap(core.write(chunk), () => accumulator(nextS));
    },
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(accumulator(s))));
});
/** @internal */
exports.mapAccumEffect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => (0, exports.suspend)(() => {
  const accumulator = s => core.readWith({
    onInput: input => (0, Function_js_1.pipe)(Effect.suspend(() => {
      const outputs = [];
      const emit = output => Effect.sync(() => {
        outputs.push(output);
      });
      return (0, Function_js_1.pipe)(input, Effect.reduce(s, (s, a) => (0, Function_js_1.pipe)(f(s, a), Effect.flatMap(([s, a]) => (0, Function_js_1.pipe)(emit(a), Effect.as(s))))), Effect.match({
        onFailure: error => {
          if (outputs.length !== 0) {
            return channel.zipRight(core.write(Chunk.unsafeFromArray(outputs)), core.fail(error));
          }
          return core.fail(error);
        },
        onSuccess: s => core.flatMap(core.write(Chunk.unsafeFromArray(outputs)), () => accumulator(s))
      }));
    }), channel.unwrap),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(accumulator(s))));
}));
/** @internal */
exports.mapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, Function_js_1.pipe)(self, (0, exports.mapError)(options.onFailure), (0, exports.map)(options.onSuccess)));
/** @internal */
exports.mapChunks = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.mapOut(f))));
/** @internal */
exports.mapChunksEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.mapOutEffect(f))));
/** @internal */
exports.mapConcat = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.mapConcatChunk)(a => Chunk.fromIterable(f(a)))));
/** @internal */
exports.mapConcatChunk = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.mapChunks)(Chunk.flatMap(f))));
/** @internal */
exports.mapConcatChunkEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.mapEffectSequential)(f), (0, exports.mapConcatChunk)(Function_js_1.identity)));
/** @internal */
exports.mapConcatEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.mapEffectSequential)(a => (0, Function_js_1.pipe)(f(a), Effect.map(Chunk.fromIterable))), (0, exports.mapConcatChunk)(Function_js_1.identity)));
/** @internal */
exports.mapEffectSequential = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const loop = iterator => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: elem => loop(elem[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeed
      });
    } else {
      const value = next.value;
      return channel.unwrap(Effect.map(f(value), a2 => core.flatMap(core.write(Chunk.of(a2)), () => loop(iterator))));
    }
  };
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(core.suspend(() => loop(Chunk.empty()[Symbol.iterator]())))));
});
/** @internal */
exports.mapEffectPar = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, n, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.concatMap(channel.writeChunk), channel.mapOutEffectPar(f, n), channel.mapOut(Chunk.of))));
/** @internal */
exports.mapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.mapError(f))));
/** @internal */
exports.mapErrorCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.mapErrorCause(f))));
/** @internal */
exports.merge = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isStream)(args[1]), (self, that, options) => (0, exports.mergeWith)(self, that, {
  onSelf: Function_js_1.identity,
  onOther: Function_js_1.identity,
  haltStrategy: options?.haltStrategy
}));
/** @internal */
exports.mergeAll = /*#__PURE__*/(0, Function_js_1.dual)(args => Symbol.iterator in args[0], (streams, options) => (0, exports.flatten)((0, exports.fromIterable)(streams), options));
/** @internal */
exports.mergeEither = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.mergeWith)(self, that, {
  onSelf: Either.left,
  onOther: Either.right
}));
/** @internal */
exports.mergeLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.merge)((0, exports.drain)(that))));
/** @internal */
exports.mergeRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)((0, exports.drain)(self), (0, exports.merge)(that)));
/** @internal */
exports.mergeWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, other, options) => {
  const strategy = options.haltStrategy ? haltStrategy.fromInput(options.haltStrategy) : HaltStrategy.Both;
  const handler = terminate => exit => terminate || !Exit.isSuccess(exit) ?
  // TODO: remove
  MergeDecision.Done(Effect.suspend(() => exit)) : MergeDecision.Await(exit => Effect.suspend(() => exit));
  return new StreamImpl(channel.mergeWith((0, exports.toChannel)((0, exports.map)(self, options.onSelf)), {
    other: (0, exports.toChannel)((0, exports.map)(other, options.onOther)),
    onSelfDone: handler(strategy._tag === "Either" || strategy._tag === "Left"),
    onOtherDone: handler(strategy._tag === "Either" || strategy._tag === "Right")
  }));
});
/** @internal */
const mkString = self => (0, exports.run)(self, _sink.mkString);
exports.mkString = mkString;
/** @internal */
exports.never = /*#__PURE__*/(0, exports.fromEffect)(Effect.never);
/** @internal */
exports.onError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cleanup) => (0, Function_js_1.pipe)(self, (0, exports.catchAllCause)(cause => (0, exports.fromEffect)((0, Function_js_1.pipe)(cleanup(cause), Effect.zipRight(Effect.failCause(cause)))))));
/** @internal */
exports.onDone = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cleanup) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.ensuringWith(exit => Exit.isSuccess(exit) ? cleanup() : Effect.unit))));
/** @internal */
const orDie = self => (0, Function_js_1.pipe)(self, (0, exports.orDieWith)(Function_js_1.identity));
exports.orDie = orDie;
/** @internal */
exports.orDieWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.orDieWith(f))));
/** @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.orElse(() => (0, exports.toChannel)(that())))));
/** @internal */
exports.orElseEither = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.map)(Either.left), (0, exports.orElse)(() => (0, Function_js_1.pipe)(that(), (0, exports.map)(Either.right)))));
/** @internal */
exports.orElseFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, error) => (0, Function_js_1.pipe)(self, (0, exports.orElse)(() => (0, exports.failSync)(error))));
/** @internal */
exports.orElseIfEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, element) => (0, Function_js_1.pipe)(self, (0, exports.orElseIfEmptyChunk)(() => Chunk.of(element()))));
/** @internal */
exports.orElseIfEmptyChunk = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, chunk) => (0, Function_js_1.pipe)(self, (0, exports.orElseIfEmptyStream)(() => new StreamImpl(core.write(chunk())))));
/** @internal */
exports.orElseIfEmptyStream = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, stream) => {
  const writer = core.readWith({
    onInput: input => {
      if (Chunk.isEmpty(input)) {
        return core.suspend(() => writer);
      }
      return (0, Function_js_1.pipe)(core.write(input), channel.zipRight(channel.identityChannel()));
    },
    onFailure: core.fail,
    onDone: () => core.suspend(() => (0, exports.toChannel)(stream()))
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(writer)));
});
/** @internal */
exports.orElseSucceed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, Function_js_1.pipe)(self, (0, exports.orElse)(() => (0, exports.sync)(value))));
/** @internal */
const paginate = (s, f) => (0, exports.paginateChunk)(s, s => {
  const page = f(s);
  return [Chunk.of(page[0]), page[1]];
});
exports.paginate = paginate;
/** @internal */
const paginateChunk = (s, f) => {
  const loop = s => {
    const page = f(s);
    return Option.match(page[1], {
      onNone: () => channel.zipRight(core.write(page[0]), core.unit),
      onSome: s => core.flatMap(core.write(page[0]), () => loop(s))
    });
  };
  return new StreamImpl(core.suspend(() => loop(s)));
};
exports.paginateChunk = paginateChunk;
/** @internal */
const paginateChunkEffect = (s, f) => {
  const loop = s => channel.unwrap(Effect.map(f(s), ([chunk, option]) => Option.match(option, {
    onNone: () => channel.zipRight(core.write(chunk), core.unit),
    onSome: s => core.flatMap(core.write(chunk), () => loop(s))
  })));
  return new StreamImpl(core.suspend(() => loop(s)));
};
exports.paginateChunkEffect = paginateChunkEffect;
/** @internal */
const paginateEffect = (s, f) => (0, exports.paginateChunkEffect)(s, s => (0, Function_js_1.pipe)(f(s), Effect.map(([a, s]) => [Chunk.of(a), s])));
exports.paginateEffect = paginateEffect;
/** @internal */
exports.peel = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, sink) => {
  const OP_EMIT = "Emit";
  const OP_HALT = "Halt";
  const OP_END = "End";
  return (0, Function_js_1.pipe)(Deferred.make(), Effect.flatMap(deferred => (0, Function_js_1.pipe)(Handoff.make(), Effect.map(handoff => {
    const consumer = _sink.foldSink(_sink.collectLeftover(sink), {
      onFailure: error => _sink.zipRight(_sink.fromEffect(Deferred.fail(deferred, error)), _sink.fail(error)),
      onSuccess: ([z, leftovers]) => {
        const loop = core.readWithCause({
          onInput: elements => core.flatMap(core.fromEffect(Handoff.offer(handoff, {
            _tag: OP_EMIT,
            elements
          })), () => loop),
          onFailure: cause => channel.zipRight(core.fromEffect(Handoff.offer(handoff, {
            _tag: OP_HALT,
            cause
          })), core.failCause(cause)),
          onDone: _ => channel.zipRight(core.fromEffect(Handoff.offer(handoff, {
            _tag: OP_END
          })), core.unit)
        });
        return _sink.fromChannel((0, Function_js_1.pipe)(core.fromEffect(Deferred.succeed(deferred, z)), channel.zipRight(core.fromEffect((0, Function_js_1.pipe)(handoff, Handoff.offer({
          _tag: OP_EMIT,
          elements: leftovers
        })))), channel.zipRight(loop)));
      }
    });
    const producer = (0, Function_js_1.pipe)(Handoff.take(handoff), Effect.map(signal => {
      switch (signal._tag) {
        case OP_EMIT:
          {
            return (0, Function_js_1.pipe)(core.write(signal.elements), core.flatMap(() => producer));
          }
        case OP_HALT:
          {
            return core.failCause(signal.cause);
          }
        case OP_END:
          {
            return core.unit;
          }
      }
    }), channel.unwrap);
    return (0, Function_js_1.pipe)(self, (0, exports.tapErrorCause)(cause => Deferred.failCause(deferred, cause)), (0, exports.run)(consumer), Effect.forkScoped, Effect.zipRight(Deferred.await(deferred)), Effect.map(z => [z, new StreamImpl(producer)]));
  }))), Effect.flatten);
});
/** @internal */
exports.partition = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[1] === "function", (self, predicate, options) => (0, exports.partitionEither)(self, a => Effect.succeed(predicate(a) ? Either.left(a) : Either.right(a)), options));
/** @internal */
exports.partitionEither = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[1] === "function", (self, predicate, options) => (0, Function_js_1.pipe)((0, exports.mapEffectSequential)(self, predicate), (0, exports.distributedWith)({
  size: 2,
  maximumLag: options?.bufferSize ?? 16,
  decide: Either.match({
    onLeft: () => Effect.succeed(n => n === 0),
    onRight: () => Effect.succeed(n => n === 1)
  })
}), Effect.flatMap(([queue1, queue2]) => Effect.succeed([(0, exports.filterMap)((0, exports.flattenExitOption)((0, exports.fromQueue)(queue1, {
  shutdown: true
})), _ => Either.match(_, {
  onLeft: Option.some,
  onRight: Option.none
})), (0, exports.filterMap)((0, exports.flattenExitOption)((0, exports.fromQueue)(queue2, {
  shutdown: true
})), _ => Either.match(_, {
  onLeft: Option.none,
  onRight: Option.some
}))]))));
/** @internal */
exports.pipeThrough = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, sink) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(_sink.toChannel(sink)))));
/** @internal */
exports.pipeThroughChannel = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, channel) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(channel))));
/** @internal */
exports.pipeThroughChannelOrFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, chan) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(chan))));
/** @internal */
exports.prepend = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, values) => new StreamImpl(channel.zipRight(core.write(values), (0, exports.toChannel)(self))));
/** @internal */
exports.provideContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, context) => new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.provideContext(context))));
/** @internal */
exports.provideLayer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, layer) => new StreamImpl(channel.unwrapScoped((0, Function_js_1.pipe)(Layer.build(layer), Effect.map(env => (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.provideContext(env)))))));
/** @internal */
exports.provideService = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, resource) => (0, exports.provideServiceEffect)(self, tag, Effect.succeed(resource)));
/** @internal */
exports.provideServiceEffect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, effect) => (0, exports.provideServiceStream)(self, tag, (0, exports.fromEffect)(effect)));
/** @internal */
exports.provideServiceStream = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, stream) => (0, exports.contextWithStream)(env => (0, exports.flatMap)(stream, service => (0, Function_js_1.pipe)(self, (0, exports.provideContext)(Context.add(env, tag, service))))));
/** @internal */
exports.mapInputContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.contextWithStream)(env => (0, Function_js_1.pipe)(self, (0, exports.provideContext)(f(env)))));
/** @internal */
exports.provideSomeLayer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, layer) =>
// @ts-expect-error
(0, Function_js_1.pipe)(self, (0, exports.provideLayer)((0, Function_js_1.pipe)(Layer.context(), Layer.merge(layer)))));
/** @internal */
const range = (min, max, chunkSize = exports.DefaultChunkSize) => (0, exports.suspend)(() => {
  if (min > max) {
    return exports.empty;
  }
  const go = (min, max, chunkSize) => {
    const remaining = max - min + 1;
    if (remaining > chunkSize) {
      return (0, Function_js_1.pipe)(core.write(Chunk.range(min, min + chunkSize - 1)), core.flatMap(() => go(min + chunkSize, max, chunkSize)));
    }
    return core.write(Chunk.range(min, min + remaining - 1));
  };
  return new StreamImpl(go(min, max, chunkSize));
});
exports.range = range;
/** @internal */
exports.rechunk = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.suspend)(() => {
  const target = Math.max(n, 1);
  const process = rechunkProcess(new StreamRechunker(target), target);
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(process)));
}));
/** @internal */
const rechunkProcess = (rechunker, target) => core.readWithCause({
  onInput: chunk => {
    if (chunk.length === target && rechunker.isEmpty()) {
      return core.flatMap(core.write(chunk), () => rechunkProcess(rechunker, target));
    }
    if (chunk.length > 0) {
      const chunks = [];
      let result = undefined;
      let index = 0;
      while (index < chunk.length) {
        while (index < chunk.length && result === undefined) {
          result = rechunker.write((0, Function_js_1.pipe)(chunk, Chunk.unsafeGet(index)));
          index = index + 1;
        }
        if (result !== undefined) {
          chunks.push(result);
          result = undefined;
        }
      }
      return core.flatMap(channel.writeAll(...chunks), () => rechunkProcess(rechunker, target));
    }
    return core.suspend(() => rechunkProcess(rechunker, target));
  },
  onFailure: cause => channel.zipRight(rechunker.emitIfNotEmpty(), core.failCause(cause)),
  onDone: () => rechunker.emitIfNotEmpty()
});
/** @internal */
class StreamRechunker {
  n;
  builder = [];
  pos = 0;
  constructor(n) {
    this.n = n;
  }
  isEmpty() {
    return this.pos === 0;
  }
  write(elem) {
    this.builder.push(elem);
    this.pos += 1;
    if (this.pos === this.n) {
      const result = Chunk.unsafeFromArray(this.builder);
      this.builder = [];
      this.pos = 0;
      return result;
    }
    return undefined;
  }
  emitIfNotEmpty() {
    if (this.pos !== 0) {
      return core.write(Chunk.unsafeFromArray(this.builder));
    }
    return core.unit;
  }
}
/** @internal */
exports.refineOrDie = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)(self, (0, exports.refineOrDieWith)(pf, Function_js_1.identity)));
/** @internal */
exports.refineOrDieWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, pf, f) => new StreamImpl(channel.catchAll((0, exports.toChannel)(self), error => Option.match(pf(error), {
  onNone: () => core.failCause(Cause.die(f(error))),
  onSome: core.fail
}))));
/** @internal */
exports.repeat = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, exports.filterMap)((0, exports.repeatEither)(self, schedule), _ => Either.match(_, {
  onLeft: Option.none,
  onRight: Option.some
})));
/** @internal */
const repeatEffect = effect => (0, exports.repeatEffectOption)((0, Function_js_1.pipe)(effect, Effect.mapError(Option.some)));
exports.repeatEffect = repeatEffect;
/** @internal */
const repeatEffectChunk = effect => (0, exports.repeatEffectChunkOption)((0, Function_js_1.pipe)(effect, Effect.mapError(Option.some)));
exports.repeatEffectChunk = repeatEffectChunk;
/** @internal */
const repeatEffectChunkOption = effect => (0, exports.unfoldChunkEffect)(effect, effect => (0, Function_js_1.pipe)(Effect.map(effect, chunk => Option.some([chunk, effect])), Effect.catchAll(Option.match({
  onNone: () => Effect.succeed(Option.none()),
  onSome: Effect.fail
}))));
exports.repeatEffectChunkOption = repeatEffectChunkOption;
/** @internal */
const repeatEffectOption = effect => (0, exports.repeatEffectChunkOption)((0, Function_js_1.pipe)(effect, Effect.map(Chunk.of)));
exports.repeatEffectOption = repeatEffectOption;
/** @internal */
exports.repeatEither = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, exports.repeatWith)(self, schedule, {
  onElement: a => Either.right(a),
  onSchedule: Either.left
}));
/** @internal */
exports.repeatElements = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, exports.filterMap)((0, exports.repeatElementsWith)(self, schedule, {
  onElement: a => Option.some(a),
  onSchedule: Option.none
}), Function_js_1.identity));
/** @internal */
exports.repeatElementsWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, schedule, options) => {
  const driver = (0, Function_js_1.pipe)(Schedule.driver(schedule), Effect.map(driver => {
    const feed = input => Option.match(Chunk.head(input), {
      onNone: () => loop,
      onSome: a => channel.zipRight(core.write(Chunk.of(options.onElement(a))), step((0, Function_js_1.pipe)(input, Chunk.drop(1)), a))
    });
    const step = (input, a) => {
      const advance = (0, Function_js_1.pipe)(driver.next(a), Effect.as((0, Function_js_1.pipe)(core.write(Chunk.of(options.onElement(a))), core.flatMap(() => step(input, a)))));
      const reset = (0, Function_js_1.pipe)(driver.last(), Effect.orDie, Effect.flatMap(b => (0, Function_js_1.pipe)(driver.reset(), Effect.map(() => (0, Function_js_1.pipe)(core.write(Chunk.of(options.onSchedule(b))), channel.zipRight(feed(input)))))));
      return (0, Function_js_1.pipe)(advance, Effect.orElse(() => reset), channel.unwrap);
    };
    const loop = core.readWith({
      onInput: feed,
      onFailure: core.fail,
      onDone: () => core.unit
    });
    return loop;
  }), channel.unwrap);
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(driver)));
});
/** @internal */
const repeatValue = value => new StreamImpl(channel.repeated(core.write(Chunk.of(value))));
exports.repeatValue = repeatValue;
/** @internal */
exports.repeatWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, schedule, options) => {
  return (0, Function_js_1.pipe)(Schedule.driver(schedule), Effect.map(driver => {
    const scheduleOutput = (0, Function_js_1.pipe)(driver.last(), Effect.orDie, Effect.map(options.onSchedule));
    const process = (0, Function_js_1.pipe)(self, (0, exports.map)(options.onElement), exports.toChannel);
    const loop = channel.unwrap(Effect.match(driver.next(void 0), {
      onFailure: () => core.unit,
      onSuccess: () => (0, Function_js_1.pipe)(process, channel.zipRight((0, Function_js_1.pipe)(scheduleOutput, Effect.map(c => (0, Function_js_1.pipe)(core.write(Chunk.of(c)), core.flatMap(() => loop))), channel.unwrap)))
    }));
    return new StreamImpl((0, Function_js_1.pipe)(process, channel.zipRight(loop)));
  }), exports.unwrap);
});
/** @internal */
const repeatWithSchedule = (value, schedule) => (0, exports.repeatEffectWithSchedule)(Effect.succeed(value), schedule);
exports.repeatWithSchedule = repeatWithSchedule;
/** @internal */
const repeatEffectWithSchedule = (effect, schedule) => (0, exports.flatMap)((0, exports.fromEffect)(Effect.zip(effect, Schedule.driver(schedule))), ([a, driver]) => (0, exports.concat)((0, exports.succeed)(a), (0, exports.unfoldEffect)(a, s => Effect.matchEffect(driver.next(s), {
  onFailure: Effect.succeed,
  onSuccess: () => Effect.map(effect, nextA => Option.some([nextA, nextA]))
}))));
exports.repeatEffectWithSchedule = repeatEffectWithSchedule;
/** @internal */
exports.retry = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, exports.unwrap)(Effect.map(Schedule.driver(schedule), driver => {
  const loop = (0, exports.catchAll)(self, error => (0, exports.unwrap)(Effect.matchEffect(driver.next(error), {
    onFailure: () => Effect.fail(error),
    onSuccess: () => Effect.succeed((0, Function_js_1.pipe)(loop, (0, exports.tap)(() => driver.reset())))
  })));
  return loop;
})));
/** @internal */
exports.run = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, sink) => (0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(_sink.toChannel(sink)), channel.runDrain));
/** @internal */
const runCollect = self => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.collectAll()));
exports.runCollect = runCollect;
/** @internal */
const runCount = self => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.count));
exports.runCount = runCount;
/** @internal */
const runDrain = self => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.drain));
exports.runDrain = runDrain;
/** @internal */
exports.runFold = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => (0, Function_js_1.pipe)(self, (0, exports.runFoldWhileScoped)(s, Function_js_1.constTrue, f), Effect.scoped));
/** @internal */
exports.runFoldEffect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => (0, Function_js_1.pipe)(self, (0, exports.runFoldWhileScopedEffect)(s, Function_js_1.constTrue, f), Effect.scoped));
/** @internal */
exports.runFoldScoped = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => (0, Function_js_1.pipe)(self, (0, exports.runFoldWhileScoped)(s, Function_js_1.constTrue, f)));
/** @internal */
exports.runFoldScopedEffect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => (0, Function_js_1.pipe)(self, (0, exports.runFoldWhileScopedEffect)(s, Function_js_1.constTrue, f)));
/** @internal */
exports.runFoldWhile = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, s, cont, f) => (0, Function_js_1.pipe)(self, (0, exports.runFoldWhileScoped)(s, cont, f), Effect.scoped));
/** @internal */
exports.runFoldWhileEffect = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, s, cont, f) => (0, Function_js_1.pipe)(self, (0, exports.runFoldWhileScopedEffect)(s, cont, f), Effect.scoped));
/** @internal */
exports.runFoldWhileScoped = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, s, cont, f) => (0, Function_js_1.pipe)(self, (0, exports.runScoped)(_sink.fold(s, cont, f))));
/** @internal */
exports.runFoldWhileScopedEffect = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, s, cont, f) => (0, Function_js_1.pipe)(self, (0, exports.runScoped)(_sink.foldEffect(s, cont, f))));
/** @internal */
exports.runForEach = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.forEach(f))));
/** @internal */
exports.runForEachChunk = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.forEachChunk(f))));
/** @internal */
exports.runForEachChunkScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.runScoped)(_sink.forEachChunk(f))));
/** @internal */
exports.runForEachScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.runScoped)(_sink.forEach(f))));
/** @internal */
exports.runForEachWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.forEachWhile(f))));
/** @internal */
exports.runForEachWhileScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.runScoped)(_sink.forEachWhile(f))));
/** @internal */
const runHead = self => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.head()));
exports.runHead = runHead;
/** @internal */
exports.runIntoPubSub = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pubsub) => (0, Function_js_1.pipe)(self, (0, exports.runIntoQueue)(pubsub)));
/** @internal */
exports.runIntoPubSubScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pubsub) => (0, Function_js_1.pipe)(self, (0, exports.runIntoQueueScoped)(pubsub)));
/** @internal */
exports.runIntoQueue = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, queue) => (0, Function_js_1.pipe)(self, (0, exports.runIntoQueueScoped)(queue), Effect.scoped));
/** @internal */
exports.runIntoQueueElementsScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, queue) => {
  const writer = core.readWithCause({
    onInput: input => core.flatMap(core.fromEffect(Queue.offerAll(queue, Chunk.map(input, Exit.succeed))), () => writer),
    onFailure: cause => core.fromEffect(Queue.offer(queue, Exit.failCause(Cause.map(cause, Option.some)))),
    onDone: () => core.fromEffect(Queue.offer(queue, Exit.fail(Option.none())))
  });
  return (0, Function_js_1.pipe)(core.pipeTo((0, exports.toChannel)(self), writer), channel.drain, channelExecutor.runScoped, Effect.asUnit);
});
/** @internal */
exports.runIntoQueueScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, queue) => {
  const writer = core.readWithCause({
    onInput: input => core.flatMap(core.write(_take.chunk(input)), () => writer),
    onFailure: cause => core.write(_take.failCause(cause)),
    onDone: () => core.write(_take.end)
  });
  return (0, Function_js_1.pipe)(core.pipeTo((0, exports.toChannel)(self), writer), channel.mapOutEffect(take => Queue.offer(queue, take)), channel.drain, channelExecutor.runScoped, Effect.asUnit);
});
/** @internal */
const runLast = self => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.last()));
exports.runLast = runLast;
/** @internal */
exports.runScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, sink) => (0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(_sink.toChannel(sink)), channel.drain, channelExecutor.runScoped));
/** @internal */
const runSum = self => (0, Function_js_1.pipe)(self, (0, exports.run)(_sink.sum));
exports.runSum = runSum;
/** @internal */
exports.scan = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => (0, Function_js_1.pipe)(self, (0, exports.scanEffect)(s, (s, a) => Effect.succeed(f(s, a)))));
/** @internal */
exports.scanReduce = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.scanReduceEffect)((a2, a) => Effect.succeed(f(a2, a)))));
/** @internal */
exports.scanReduceEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.mapAccumEffect)(Option.none(), (option, a) => {
  switch (option._tag) {
    case "None":
      {
        return Effect.succeed([Option.some(a), a]);
      }
    case "Some":
      {
        return (0, Function_js_1.pipe)(f(option.value, a), Effect.map(b => [Option.some(b), b]));
      }
  }
})));
/** @internal */
exports.schedule = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, exports.filterMap)((0, exports.scheduleWith)(self, schedule, {
  onElement: Option.some,
  onSchedule: Option.none
}), Function_js_1.identity));
/** @internal */
exports.scheduleWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, schedule, options) => {
  const loop = (driver, iterator) => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: chunk => loop(driver, chunk[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeedNow
      });
    }
    return channel.unwrap(Effect.matchEffect(driver.next(next.value), {
      onFailure: () => (0, Function_js_1.pipe)(driver.last(), Effect.orDie, Effect.map(b => (0, Function_js_1.pipe)(core.write(Chunk.make(options.onElement(next.value), options.onSchedule(b))), core.flatMap(() => loop(driver, iterator)))), Effect.zipLeft(driver.reset())),
      onSuccess: () => Effect.succeed((0, Function_js_1.pipe)(core.write(Chunk.of(options.onElement(next.value))), core.flatMap(() => loop(driver, iterator))))
    }));
  };
  return new StreamImpl((0, Function_js_1.pipe)(core.fromEffect(Schedule.driver(schedule)), core.flatMap(driver => (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(loop(driver, Chunk.empty()[Symbol.iterator]()))))));
});
/** @internal */
exports.scanEffect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => new StreamImpl((0, Function_js_1.pipe)(core.write(Chunk.of(s)), core.flatMap(() => (0, exports.toChannel)((0, Function_js_1.pipe)(self, (0, exports.mapAccumEffect)(s, (s, a) => (0, Function_js_1.pipe)(f(s, a), Effect.map(s => [s, s])))))))));
/** @internal */
const scoped = effect => new StreamImpl(channel.ensuring(channel.scoped((0, Function_js_1.pipe)(effect, Effect.map(Chunk.of))), Effect.unit));
exports.scoped = scoped;
/** @internal */
const some = self => (0, Function_js_1.pipe)(self, (0, exports.mapError)(Option.some), (0, exports.someOrFail)(() => Option.none()));
exports.some = some;
/** @internal */
exports.someOrElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, fallback) => (0, Function_js_1.pipe)(self, (0, exports.map)(Option.getOrElse(fallback))));
/** @internal */
exports.someOrFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, error) => (0, exports.mapEffectSequential)(self, Option.match({
  onNone: () => Effect.failSync(error),
  onSome: Effect.succeed
})));
/** @internal */
exports.sliding = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, chunkSize) => (0, exports.slidingSize)(self, chunkSize, 1));
/** @internal */
exports.slidingSize = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, chunkSize, stepSize) => {
  if (chunkSize <= 0 || stepSize <= 0) {
    return (0, exports.die)(Cause.IllegalArgumentException("Invalid bounds - `chunkSize` and `stepSize` must be greater than zero"));
  }
  return new StreamImpl(core.suspend(() => {
    const queue = new ringBuffer_js_1.RingBuffer(chunkSize);
    const emitOnStreamEnd = (queueSize, channelEnd) => {
      if (queueSize < chunkSize) {
        const items = queue.toChunk();
        const result = Chunk.isEmpty(items) ? Chunk.empty() : Chunk.of(items);
        return (0, Function_js_1.pipe)(core.write(result), core.flatMap(() => channelEnd));
      }
      const lastEmitIndex = queueSize - (queueSize - chunkSize) % stepSize;
      if (lastEmitIndex === queueSize) {
        return channelEnd;
      }
      const leftovers = queueSize - (lastEmitIndex - chunkSize + stepSize);
      const lastItems = (0, Function_js_1.pipe)(queue.toChunk(), Chunk.takeRight(leftovers));
      const result = Chunk.isEmpty(lastItems) ? Chunk.empty() : Chunk.of(lastItems);
      return (0, Function_js_1.pipe)(core.write(result), core.flatMap(() => channelEnd));
    };
    const reader = queueSize => core.readWithCause({
      onInput: input => core.flatMap(core.write(Chunk.filterMap(input, (element, index) => {
        queue.put(element);
        const currentIndex = queueSize + index + 1;
        if (currentIndex < chunkSize || (currentIndex - chunkSize) % stepSize > 0) {
          return Option.none();
        }
        return Option.some(queue.toChunk());
      })), () => reader(queueSize + input.length)),
      onFailure: cause => emitOnStreamEnd(queueSize, core.failCause(cause)),
      onDone: () => emitOnStreamEnd(queueSize, core.unit)
    });
    return (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(reader(0)));
  }));
});
/** @internal */
exports.split = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const split = (leftovers, input) => {
    const [chunk, remaining] = (0, Function_js_1.pipe)(leftovers, Chunk.appendAll(input), Chunk.splitWhere(predicate));
    if (Chunk.isEmpty(chunk) || Chunk.isEmpty(remaining)) {
      return loop((0, Function_js_1.pipe)(chunk, Chunk.appendAll((0, Function_js_1.pipe)(remaining, Chunk.drop(1)))));
    }
    return (0, Function_js_1.pipe)(core.write(Chunk.of(chunk)), core.flatMap(() => split(Chunk.empty(), (0, Function_js_1.pipe)(remaining, Chunk.drop(1)))));
  };
  const loop = leftovers => core.readWith({
    onInput: input => split(leftovers, input),
    onFailure: core.fail,
    onDone: () => {
      if (Chunk.isEmpty(leftovers)) {
        return core.unit;
      }
      if (Option.isNone((0, Function_js_1.pipe)(leftovers, Chunk.findFirst(predicate)))) {
        return channel.zipRight(core.write(Chunk.of(leftovers)), core.unit);
      }
      return channel.zipRight(split(Chunk.empty(), leftovers), core.unit);
    }
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(loop(Chunk.empty()))));
});
/** @internal */
exports.splitOnChunk = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, delimiter) => {
  const next = (leftover, delimiterIndex) => core.readWithCause({
    onInput: inputChunk => {
      let buffer;
      const [carry, delimiterCursor] = (0, Function_js_1.pipe)(inputChunk, Chunk.reduce([(0, Function_js_1.pipe)(leftover, Option.getOrElse(() => Chunk.empty())), delimiterIndex], ([carry, delimiterCursor], a) => {
        const concatenated = (0, Function_js_1.pipe)(carry, Chunk.append(a));
        if (delimiterCursor < delimiter.length && Equal.equals(a, (0, Function_js_1.pipe)(delimiter, Chunk.unsafeGet(delimiterCursor)))) {
          if (delimiterCursor + 1 === delimiter.length) {
            if (buffer === undefined) {
              buffer = [];
            }
            buffer.push((0, Function_js_1.pipe)(concatenated, Chunk.take(concatenated.length - delimiter.length)));
            return [Chunk.empty(), 0];
          }
          return [concatenated, delimiterCursor + 1];
        }
        return [concatenated, Equal.equals(a, (0, Function_js_1.pipe)(delimiter, Chunk.unsafeGet(0))) ? 1 : 0];
      }));
      const output = buffer === undefined ? Chunk.empty() : Chunk.unsafeFromArray(buffer);
      return core.flatMap(core.write(output), () => next(Chunk.isNonEmpty(carry) ? Option.some(carry) : Option.none(), delimiterCursor));
    },
    onFailure: cause => Option.match(leftover, {
      onNone: () => core.failCause(cause),
      onSome: chunk => channel.zipRight(core.write(Chunk.of(chunk)), core.failCause(cause))
    }),
    onDone: done => Option.match(leftover, {
      onNone: () => core.succeed(done),
      onSome: chunk => channel.zipRight(core.write(Chunk.of(chunk)), core.succeed(done))
    })
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(next(Option.none(), 0))));
});
/** @internal */
const splitLines = self => (0, exports.suspend)(() => {
  let stringBuilder = "";
  let midCRLF = false;
  const splitLinesChunk = chunk => {
    const chunkBuilder = [];
    Chunk.map(chunk, str => {
      if (str.length !== 0) {
        let from = 0;
        let indexOfCR = str.indexOf("\r");
        let indexOfLF = str.indexOf("\n");
        if (midCRLF) {
          if (indexOfLF === 0) {
            chunkBuilder.push(stringBuilder);
            stringBuilder = "";
            from = 1;
            indexOfLF = str.indexOf("\n", from);
          } else {
            stringBuilder = stringBuilder + "\r";
          }
          midCRLF = false;
        }
        while (indexOfCR !== -1 || indexOfLF !== -1) {
          if (indexOfCR === -1 || indexOfLF !== -1 && indexOfLF < indexOfCR) {
            if (stringBuilder.length === 0) {
              chunkBuilder.push(str.substring(from, indexOfLF));
            } else {
              chunkBuilder.push(stringBuilder + str.substring(from, indexOfLF));
              stringBuilder = "";
            }
            from = indexOfLF + 1;
            indexOfLF = str.indexOf("\n", from);
          } else {
            if (str.length === indexOfCR + 1) {
              midCRLF = true;
              indexOfCR = -1;
            } else {
              if (indexOfLF === indexOfCR + 1) {
                if (stringBuilder.length === 0) {
                  chunkBuilder.push(str.substring(from, indexOfCR));
                } else {
                  stringBuilder = stringBuilder + str.substring(from, indexOfCR);
                  chunkBuilder.push(stringBuilder);
                  stringBuilder = "";
                }
                from = indexOfCR + 2;
                indexOfCR = str.indexOf("\r", from);
                indexOfLF = str.indexOf("\n", from);
              } else {
                indexOfCR = str.indexOf("\r", indexOfCR + 1);
              }
            }
          }
        }
        if (midCRLF) {
          stringBuilder = stringBuilder + str.substring(from, str.length - 1);
        } else {
          stringBuilder = stringBuilder + str.substring(from, str.length);
        }
      }
    });
    return Chunk.unsafeFromArray(chunkBuilder);
  };
  const loop = core.readWithCause({
    onInput: input => {
      const out = splitLinesChunk(input);
      return Chunk.isEmpty(out) ? loop : core.flatMap(core.write(out), () => loop);
    },
    onFailure: cause => stringBuilder.length === 0 ? core.failCause(cause) : core.flatMap(core.write(Chunk.of(stringBuilder)), () => core.failCause(cause)),
    onDone: done => stringBuilder.length === 0 ? core.succeed(done) : core.flatMap(core.write(Chunk.of(stringBuilder)), () => core.succeed(done))
  });
  return new StreamImpl(core.pipeTo((0, exports.toChannel)(self), loop));
});
exports.splitLines = splitLines;
/** @internal */
const succeed = value => (0, exports.fromChunk)(Chunk.of(value));
exports.succeed = succeed;
/** @internal */
const sync = evaluate => (0, exports.suspend)(() => (0, exports.fromChunk)(Chunk.of(evaluate())));
exports.sync = sync;
/** @internal */
const suspend = stream => new StreamImpl(core.suspend(() => (0, exports.toChannel)(stream())));
exports.suspend = suspend;
/** @internal */
exports.take = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  if (!Number.isInteger(n)) {
    return (0, exports.die)(Cause.IllegalArgumentException(`${n} must be an integer`));
  }
  const loop = n => core.readWith({
    onInput: input => {
      const taken = (0, Function_js_1.pipe)(input, Chunk.take(Math.min(n, Number.POSITIVE_INFINITY)));
      const leftover = Math.max(0, n - taken.length);
      const more = leftover > 0;
      if (more) {
        return (0, Function_js_1.pipe)(core.write(taken), core.flatMap(() => loop(leftover)));
      }
      return core.write(taken);
    },
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(0 < n ? loop(n) : core.unit)));
});
/** @internal */
exports.takeRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  if (n <= 0) {
    return exports.empty;
  }
  return new StreamImpl((0, Function_js_1.pipe)(Effect.succeed(new ringBuffer_js_1.RingBuffer(n)), Effect.map(queue => {
    const reader = core.readWith({
      onInput: input => {
        for (const element of input) {
          queue.put(element);
        }
        return reader;
      },
      onFailure: core.fail,
      onDone: () => (0, Function_js_1.pipe)(core.write(queue.toChunk()), channel.zipRight(core.unit))
    });
    return (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(reader));
  }), channel.unwrap));
});
/** @internal */
exports.takeUntil = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => {
      const taken = (0, Function_js_1.pipe)(input, Chunk.takeWhile(a => !predicate(a)));
      const last = (0, Function_js_1.pipe)(input, Chunk.drop(taken.length), Chunk.take(1));
      if (Chunk.isEmpty(last)) {
        return (0, Function_js_1.pipe)(core.write(taken), core.flatMap(() => loop));
      }
      return core.write((0, Function_js_1.pipe)(taken, Chunk.appendAll(last)));
    },
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(loop)));
});
/** @internal */
exports.takeUntilEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const loop = iterator => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: elem => loop(elem[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeed
      });
    }
    return (0, Function_js_1.pipe)(predicate(next.value), Effect.map(bool => bool ? core.write(Chunk.of(next.value)) : (0, Function_js_1.pipe)(core.write(Chunk.of(next.value)), core.flatMap(() => loop(iterator)))), channel.unwrap);
  };
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(loop(Chunk.empty()[Symbol.iterator]()))));
});
/** @internal */
exports.takeWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => {
      const taken = (0, Function_js_1.pipe)(input, Chunk.takeWhile(predicate));
      const more = taken.length === input.length;
      if (more) {
        return (0, Function_js_1.pipe)(core.write(taken), core.flatMap(() => loop));
      }
      return core.write(taken);
    },
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(loop)));
});
/** @internal */
exports.tap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapEffectSequential)(self, a => Effect.as(f(a), a)));
/** @internal */
exports.tapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => (0, Function_js_1.pipe)(self, (0, exports.tapError)(onFailure), (0, exports.tap)(onSuccess)));
/** @internal */
exports.tapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.catchAll)(self, error => (0, exports.fromEffect)(Effect.zipRight(f(error), Effect.fail(error)))));
/** @internal */
exports.tapErrorCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const loop = core.readWithCause({
    onInput: chunk => core.flatMap(core.write(chunk), () => loop),
    onFailure: cause => core.fromEffect(Effect.zipRight(f(cause), Effect.failCause(cause))),
    onDone: core.succeedNow
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(loop)));
});
/** @internal */
exports.tapSink = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, sink) => (0, Function_js_1.pipe)((0, exports.fromEffect)(Effect.all([Queue.bounded(1), Deferred.make()])), (0, exports.flatMap)(([queue, deferred]) => {
  const right = (0, exports.flattenTake)((0, exports.fromQueue)(queue, {
    maxChunkSize: 1
  }));
  const loop = core.readWithCause({
    onInput: chunk => (0, Function_js_1.pipe)(core.fromEffect(Queue.offer(queue, _take.chunk(chunk))), core.foldCauseChannel({
      onFailure: () => core.flatMap(core.write(chunk), () => channel.identityChannel()),
      onSuccess: () => core.flatMap(core.write(chunk), () => loop)
    })),
    onFailure: cause => (0, Function_js_1.pipe)(core.fromEffect(Queue.offer(queue, _take.failCause(cause))), core.foldCauseChannel({
      onFailure: () => core.failCause(cause),
      onSuccess: () => core.failCause(cause)
    })),
    onDone: () => (0, Function_js_1.pipe)(core.fromEffect(Queue.offer(queue, _take.end)), core.foldCauseChannel({
      onFailure: () => core.unit,
      onSuccess: () => core.unit
    }))
  });
  return (0, Function_js_1.pipe)(new StreamImpl((0, Function_js_1.pipe)(core.pipeTo((0, exports.toChannel)(self), loop), channel.ensuring(Effect.zipRight(Effect.forkDaemon(Queue.offer(queue, _take.end)), Deferred.await(deferred))))), (0, exports.merge)((0, exports.execute)((0, Function_js_1.pipe)((0, exports.run)(right, sink), Effect.ensuring(Effect.zipRight(Queue.shutdown(queue), Deferred.succeed(deferred, void 0)))))));
})));
/** @internal */
exports.throttle = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.throttleEffect)(self, {
  ...options,
  cost: chunk => Effect.succeed(options.cost(chunk))
}));
/** @internal */
exports.throttleEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  if (options.strategy === "enforce") {
    return throttleEnforceEffect(self, options.cost, options.units, options.duration, options.burst ?? 0);
  }
  return throttleShapeEffect(self, options.cost, options.units, options.duration, options.burst ?? 0);
});
const throttleEnforceEffect = (self, cost, units, duration, burst) => {
  const loop = (tokens, timestampMillis) => core.readWithCause({
    onInput: input => (0, Function_js_1.pipe)(cost(input), Effect.zip(Clock.currentTimeMillis), Effect.map(([weight, currentTimeMillis]) => {
      const elapsed = currentTimeMillis - timestampMillis;
      const cycles = elapsed / Duration.toMillis(duration);
      const sum = tokens + cycles * units;
      const max = units + burst < 0 ? Number.POSITIVE_INFINITY : units + burst;
      const available = sum < 0 ? max : Math.min(sum, max);
      if (weight <= available) {
        return (0, Function_js_1.pipe)(core.write(input), core.flatMap(() => loop(available - weight, currentTimeMillis)));
      }
      return loop(tokens, timestampMillis);
    }), channel.unwrap),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  const throttled = (0, Function_js_1.pipe)(Clock.currentTimeMillis, Effect.map(currentTimeMillis => loop(units, currentTimeMillis)), channel.unwrap);
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(throttled)));
};
const throttleShapeEffect = (self, costFn, units, duration, burst) => {
  const loop = (tokens, timestampMillis) => core.readWithCause({
    onInput: input => (0, Function_js_1.pipe)(costFn(input), Effect.zip(Clock.currentTimeMillis), Effect.map(([weight, currentTimeMillis]) => {
      const elapsed = currentTimeMillis - timestampMillis;
      const cycles = elapsed / Duration.toMillis(duration);
      const sum = tokens + cycles * units;
      const max = units + burst < 0 ? Number.POSITIVE_INFINITY : units + burst;
      const available = sum < 0 ? max : Math.min(sum, max);
      const remaining = available - weight;
      const waitCycles = remaining >= 0 ? 0 : -remaining / units;
      const delay = Duration.millis(Math.max(0, waitCycles * Duration.toMillis(duration)));
      if (Duration.greaterThan(delay, Duration.zero)) {
        return (0, Function_js_1.pipe)(core.fromEffect(Clock.sleep(delay)), channel.zipRight(core.write(input)), core.flatMap(() => loop(remaining, currentTimeMillis)));
      }
      return core.flatMap(core.write(input), () => loop(remaining, currentTimeMillis));
    }), channel.unwrap),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  const throttled = (0, Function_js_1.pipe)(Clock.currentTimeMillis, Effect.map(currentTimeMillis => loop(units, currentTimeMillis)), channel.unwrap);
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(throttled)));
};
/** @internal */
const tick = interval => (0, exports.repeatWithSchedule)(void 0, Schedule.spaced(interval));
exports.tick = tick;
/** @internal */
exports.timeout = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, duration) => (0, Function_js_1.pipe)((0, exports.toPull)(self), Effect.map(Effect.timeoutFail({
  onTimeout: () => Option.none(),
  duration
})), exports.fromPull));
/** @internal */
exports.timeoutFail = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, error, duration) => (0, Function_js_1.pipe)(self, (0, exports.timeoutTo)(duration, (0, exports.failSync)(error))));
/** @internal */
exports.timeoutFailCause = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, cause, duration) => (0, Function_js_1.pipe)((0, exports.toPull)(self), Effect.map(Effect.timeoutFailCause({
  onTimeout: () => Cause.map(cause(), Option.some),
  duration
})), exports.fromPull));
/** @internal */
exports.timeoutTo = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, duration, that) => {
  const StreamTimeout = Cause.RuntimeException("Stream Timeout");
  return (0, Function_js_1.pipe)(self, (0, exports.timeoutFailCause)(() => Cause.die(StreamTimeout), duration), (0, exports.catchSomeCause)(cause => Cause.isDieType(cause) && Cause.isRuntimeException(cause.defect) && cause.defect.message !== undefined && cause.defect.message === "Stream Timeout" ? Option.some(that) : Option.none()));
});
/** @internal */
exports.toPubSub = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, capacity) => (0, Function_js_1.pipe)(Effect.acquireRelease(PubSub.bounded(capacity), pubsub => PubSub.shutdown(pubsub)), Effect.tap(pubsub => (0, Function_js_1.pipe)(self, (0, exports.runIntoPubSubScoped)(pubsub), Effect.forkScoped))));
/** @internal */
const toPull = self => Effect.map(channel.toPull((0, exports.toChannel)(self)), pull => (0, Function_js_1.pipe)(pull, Effect.mapError(Option.some), Effect.flatMap(Either.match({
  onLeft: () => Effect.fail(Option.none()),
  onRight: Effect.succeed
}))));
exports.toPull = toPull;
/** @internal */
exports.toQueue = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isStream)(args[0]), (self, options) => Effect.tap(Effect.acquireRelease(options?.strategy === "unbounded" ? Queue.unbounded() : options?.strategy === "dropping" ? Queue.dropping(options.capacity ?? 2) : options?.strategy === "sliding" ? Queue.sliding(options.capacity ?? 2) : Queue.bounded(options?.capacity ?? 2), queue => Queue.shutdown(queue)), queue => Effect.forkScoped((0, exports.runIntoQueueScoped)(self, queue))));
/** @internal */
exports.toQueueOfElements = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isStream)(args[0]), (self, options) => Effect.tap(Effect.acquireRelease(Queue.bounded(options?.capacity ?? 2), queue => Queue.shutdown(queue)), queue => Effect.forkScoped((0, exports.runIntoQueueElementsScoped)(self, queue))));
/** @internal */
const toReadableStream = source => {
  let pull;
  let scope;
  return new ReadableStream({
    start(controller) {
      scope = Effect.runSync(Scope.make());
      pull = (0, Function_js_1.pipe)((0, exports.toPull)(source), Scope.use(scope), Effect.runSync, Effect.tap(chunk => Effect.sync(() => {
        Chunk.map(chunk, a => {
          controller.enqueue(a);
        });
      })), Effect.tapErrorCause(() => Scope.close(scope, Exit.unit)), Effect.catchTags({
        "None": () => Effect.sync(() => {
          controller.close();
        }),
        "Some": error => Effect.sync(() => {
          controller.error(error.value);
        })
      }), Effect.asUnit);
    },
    pull() {
      return Effect.runPromise(pull);
    },
    cancel() {
      return Effect.runPromise(Scope.close(scope, Exit.unit));
    }
  });
};
exports.toReadableStream = toReadableStream;
/** @internal */
exports.transduce = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, sink) => {
  const newChannel = core.suspend(() => {
    const leftovers = {
      ref: Chunk.empty()
    };
    const upstreamDone = {
      ref: false
    };
    const buffer = core.suspend(() => {
      const leftover = leftovers.ref;
      if (Chunk.isEmpty(leftover)) {
        return core.readWith({
          onInput: input => (0, Function_js_1.pipe)(core.write(input), core.flatMap(() => buffer)),
          onFailure: core.fail,
          onDone: core.succeedNow
        });
      }
      leftovers.ref = Chunk.empty();
      return (0, Function_js_1.pipe)(channel.writeChunk(leftover), core.flatMap(() => buffer));
    });
    const concatAndGet = chunk => {
      const leftover = leftovers.ref;
      const concatenated = Chunk.appendAll(leftover, Chunk.filter(chunk, chunk => chunk.length !== 0));
      leftovers.ref = concatenated;
      return concatenated;
    };
    const upstreamMarker = core.readWith({
      onInput: input => core.flatMap(core.write(input), () => upstreamMarker),
      onFailure: core.fail,
      onDone: done => channel.zipRight(core.sync(() => {
        upstreamDone.ref = true;
      }), core.succeedNow(done))
    });
    const transducer = (0, Function_js_1.pipe)(sink, _sink.toChannel, core.collectElements, core.flatMap(([leftover, z]) => (0, Function_js_1.pipe)(core.succeed([upstreamDone.ref, concatAndGet(leftover)]), core.flatMap(([done, newLeftovers]) => {
      const nextChannel = done && Chunk.isEmpty(newLeftovers) ? core.unit : transducer;
      return (0, Function_js_1.pipe)(core.write(Chunk.of(z)), core.flatMap(() => nextChannel));
    }))));
    return (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.pipeTo(upstreamMarker), core.pipeTo(buffer), channel.pipeToOrFail(transducer));
  });
  return new StreamImpl(newChannel);
});
/** @internal */
const unfold = (s, f) => (0, exports.unfoldChunk)(s, s => (0, Function_js_1.pipe)(f(s), Option.map(([a, s]) => [Chunk.of(a), s])));
exports.unfold = unfold;
/** @internal */
const unfoldChunk = (s, f) => {
  const loop = s => Option.match(f(s), {
    onNone: () => core.unit,
    onSome: ([chunk, s]) => core.flatMap(core.write(chunk), () => loop(s))
  });
  return new StreamImpl(core.suspend(() => loop(s)));
};
exports.unfoldChunk = unfoldChunk;
/** @internal */
const unfoldChunkEffect = (s, f) => (0, exports.suspend)(() => {
  const loop = s => channel.unwrap(Effect.map(f(s), Option.match({
    onNone: () => core.unit,
    onSome: ([chunk, s]) => core.flatMap(core.write(chunk), () => loop(s))
  })));
  return new StreamImpl(loop(s));
});
exports.unfoldChunkEffect = unfoldChunkEffect;
/** @internal */
const unfoldEffect = (s, f) => (0, exports.unfoldChunkEffect)(s, s => (0, Function_js_1.pipe)(f(s), Effect.map(Option.map(([a, s]) => [Chunk.of(a), s]))));
exports.unfoldEffect = unfoldEffect;
/** @internal */
exports.unit = /*#__PURE__*/(0, exports.succeed)(void 0);
/** @internal */
const unwrap = effect => (0, exports.flatten)((0, exports.fromEffect)(effect));
exports.unwrap = unwrap;
/** @internal */
const unwrapScoped = effect => (0, exports.flatten)((0, exports.scoped)(effect));
exports.unwrapScoped = unwrapScoped;
/** @internal */
exports.updateService = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, f) => (0, Function_js_1.pipe)(self, (0, exports.mapInputContext)(context => (0, Function_js_1.pipe)(context, Context.add(tag, f((0, Function_js_1.pipe)(context, Context.unsafeGet(tag))))))));
/** @internal */
exports.when = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, Function_js_1.pipe)(self, (0, exports.whenEffect)(Effect.sync(predicate))));
/** @internal */
const whenCase = (evaluate, pf) => (0, exports.whenCaseEffect)(pf)(Effect.sync(evaluate));
exports.whenCase = whenCase;
/** @internal */
exports.whenCaseEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)((0, exports.fromEffect)(self), (0, exports.flatMap)(a => (0, Function_js_1.pipe)(pf(a), Option.getOrElse(() => exports.empty)))));
/** @internal */
exports.whenEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, effect) => (0, Function_js_1.pipe)((0, exports.fromEffect)(effect), (0, exports.flatMap)(bool => bool ? self : exports.empty)));
/** @internal */
exports.withSpan = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, name, options) => new StreamImpl(channel.withSpan((0, exports.toChannel)(self), name, options)));
/** @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.zipWith)(that, (a, a2) => [a, a2])));
/** @internal */
exports.zipFlatten = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.zipWith)(that, (a, a2) => [...a, a2])));
/** @internal */
exports.zipAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.zipAllWith)(self, {
  other: options.other,
  onSelf: a => [a, options.defaultOther],
  onOther: a2 => [options.defaultSelf, a2],
  onBoth: (a, a2) => [a, a2]
}));
/** @internal */
exports.zipAllLeft = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, other, defaultSelf) => (0, exports.zipAllWith)(self, {
  other,
  onSelf: Function_js_1.identity,
  onOther: () => defaultSelf,
  onBoth: a => a
}));
/** @internal */
exports.zipAllRight = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, other, defaultRight) => (0, exports.zipAllWith)(self, {
  other,
  onSelf: () => defaultRight,
  onOther: Function_js_1.identity,
  onBoth: (_, a2) => a2
}));
/** @internal */
exports.zipAllSortedByKey = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.zipAllSortedByKeyWith)(self, {
  other: options.other,
  onSelf: a => [a, options.defaultOther],
  onOther: a2 => [options.defaultSelf, a2],
  onBoth: (a, a2) => [a, a2],
  order: options.order
}));
/** @internal */
exports.zipAllSortedByKeyLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.zipAllSortedByKeyWith)(self, {
  other: options.other,
  onSelf: Function_js_1.identity,
  onOther: () => options.defaultSelf,
  onBoth: a => a,
  order: options.order
}));
/** @internal */
exports.zipAllSortedByKeyRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.zipAllSortedByKeyWith)(self, {
  other: options.other,
  onSelf: () => options.defaultOther,
  onOther: Function_js_1.identity,
  onBoth: (_, a2) => a2,
  order: options.order
}));
/** @internal */
exports.zipAllSortedByKeyWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const pull = (state, pullLeft, pullRight) => {
    switch (state._tag) {
      case ZipAllState.OP_DRAIN_LEFT:
        {
          return (0, Function_js_1.pipe)(pullLeft, Effect.match({
            onFailure: Exit.fail,
            onSuccess: leftChunk => Exit.succeed([Chunk.map(leftChunk, ([k, a]) => [k, options.onSelf(a)]), ZipAllState.DrainLeft])
          }));
        }
      case ZipAllState.OP_DRAIN_RIGHT:
        {
          return (0, Function_js_1.pipe)(pullRight, Effect.match({
            onFailure: Exit.fail,
            onSuccess: rightChunk => Exit.succeed([Chunk.map(rightChunk, ([k, a2]) => [k, options.onOther(a2)]), ZipAllState.DrainRight])
          }));
        }
      case ZipAllState.OP_PULL_BOTH:
        {
          return (0, Function_js_1.pipe)(unsome(pullLeft), Effect.zip(unsome(pullRight), {
            concurrent: true
          }), Effect.matchEffect({
            onFailure: error => Effect.succeed(Exit.fail(Option.some(error))),
            onSuccess: ([leftOption, rightOption]) => {
              if (Option.isSome(leftOption) && Option.isSome(rightOption)) {
                if (Chunk.isEmpty(leftOption.value) && Chunk.isEmpty(rightOption.value)) {
                  return pull(ZipAllState.PullBoth, pullLeft, pullRight);
                }
                if (Chunk.isEmpty(leftOption.value)) {
                  return pull(ZipAllState.PullLeft(rightOption.value), pullLeft, pullRight);
                }
                if (Chunk.isEmpty(rightOption.value)) {
                  return pull(ZipAllState.PullRight(leftOption.value), pullLeft, pullRight);
                }
                return Effect.succeed(Exit.succeed(merge(leftOption.value, rightOption.value)));
              }
              if (Option.isSome(leftOption) && Option.isNone(rightOption)) {
                if (Chunk.isEmpty(leftOption.value)) {
                  return pull(ZipAllState.DrainLeft, pullLeft, pullRight);
                }
                return Effect.succeed(Exit.succeed([(0, Function_js_1.pipe)(leftOption.value, Chunk.map(([k, a]) => [k, options.onSelf(a)])), ZipAllState.DrainLeft]));
              }
              if (Option.isNone(leftOption) && Option.isSome(rightOption)) {
                if (Chunk.isEmpty(rightOption.value)) {
                  return pull(ZipAllState.DrainRight, pullLeft, pullRight);
                }
                return Effect.succeed(Exit.succeed([(0, Function_js_1.pipe)(rightOption.value, Chunk.map(([k, a2]) => [k, options.onOther(a2)])), ZipAllState.DrainRight]));
              }
              return Effect.succeed(Exit.fail(Option.none()));
            }
          }));
        }
      case ZipAllState.OP_PULL_LEFT:
        {
          return Effect.matchEffect(pullLeft, {
            onFailure: Option.match({
              onNone: () => Effect.succeed(Exit.succeed([(0, Function_js_1.pipe)(state.rightChunk, Chunk.map(([k, a2]) => [k, options.onOther(a2)])), ZipAllState.DrainRight])),
              onSome: error => Effect.succeed(Exit.fail(Option.some(error)))
            }),
            onSuccess: leftChunk => Chunk.isEmpty(leftChunk) ? pull(ZipAllState.PullLeft(state.rightChunk), pullLeft, pullRight) : Effect.succeed(Exit.succeed(merge(leftChunk, state.rightChunk)))
          });
        }
      case ZipAllState.OP_PULL_RIGHT:
        {
          return Effect.matchEffect(pullRight, {
            onFailure: Option.match({
              onNone: () => Effect.succeed(Exit.succeed([Chunk.map(state.leftChunk, ([k, a]) => [k, options.onSelf(a)]), ZipAllState.DrainLeft])),
              onSome: error => Effect.succeed(Exit.fail(Option.some(error)))
            }),
            onSuccess: rightChunk => Chunk.isEmpty(rightChunk) ? pull(ZipAllState.PullRight(state.leftChunk), pullLeft, pullRight) : Effect.succeed(Exit.succeed(merge(state.leftChunk, rightChunk)))
          });
        }
    }
  };
  const merge = (leftChunk, rightChunk) => {
    const hasNext = (chunk, index) => index < chunk.length - 1;
    const builder = [];
    let state = undefined;
    let leftIndex = 0;
    let rightIndex = 0;
    let leftTuple = (0, Function_js_1.pipe)(leftChunk, Chunk.unsafeGet(leftIndex));
    let rightTuple = (0, Function_js_1.pipe)(rightChunk, Chunk.unsafeGet(rightIndex));
    let k1 = leftTuple[0];
    let a = leftTuple[1];
    let k2 = rightTuple[0];
    let a2 = rightTuple[1];
    let loop = true;
    while (loop) {
      const compare = options.order(k1, k2);
      if (compare === 0) {
        builder.push([k1, options.onBoth(a, a2)]);
        if (hasNext(leftChunk, leftIndex) && hasNext(rightChunk, rightIndex)) {
          leftIndex = leftIndex + 1;
          rightIndex = rightIndex + 1;
          leftTuple = (0, Function_js_1.pipe)(leftChunk, Chunk.unsafeGet(leftIndex));
          rightTuple = (0, Function_js_1.pipe)(rightChunk, Chunk.unsafeGet(rightIndex));
          k1 = leftTuple[0];
          a = leftTuple[1];
          k2 = rightTuple[0];
          a2 = rightTuple[1];
        } else if (hasNext(leftChunk, leftIndex)) {
          state = ZipAllState.PullRight((0, Function_js_1.pipe)(leftChunk, Chunk.drop(leftIndex + 1)));
          loop = false;
        } else if (hasNext(rightChunk, rightIndex)) {
          state = ZipAllState.PullLeft((0, Function_js_1.pipe)(rightChunk, Chunk.drop(rightIndex + 1)));
          loop = false;
        } else {
          state = ZipAllState.PullBoth;
          loop = false;
        }
      } else if (compare < 0) {
        builder.push([k1, options.onSelf(a)]);
        if (hasNext(leftChunk, leftIndex)) {
          leftIndex = leftIndex + 1;
          leftTuple = (0, Function_js_1.pipe)(leftChunk, Chunk.unsafeGet(leftIndex));
          k1 = leftTuple[0];
          a = leftTuple[1];
        } else {
          const rightBuilder = [];
          rightBuilder.push(rightTuple);
          while (hasNext(rightChunk, rightIndex)) {
            rightIndex = rightIndex + 1;
            rightTuple = (0, Function_js_1.pipe)(rightChunk, Chunk.unsafeGet(rightIndex));
            rightBuilder.push(rightTuple);
          }
          state = ZipAllState.PullLeft(Chunk.unsafeFromArray(rightBuilder));
          loop = false;
        }
      } else {
        builder.push([k2, options.onOther(a2)]);
        if (hasNext(rightChunk, rightIndex)) {
          rightIndex = rightIndex + 1;
          rightTuple = (0, Function_js_1.pipe)(rightChunk, Chunk.unsafeGet(rightIndex));
          k2 = rightTuple[0];
          a2 = rightTuple[1];
        } else {
          const leftBuilder = [];
          leftBuilder.push(leftTuple);
          while (hasNext(leftChunk, leftIndex)) {
            leftIndex = leftIndex + 1;
            leftTuple = (0, Function_js_1.pipe)(leftChunk, Chunk.unsafeGet(leftIndex));
            leftBuilder.push(leftTuple);
          }
          state = ZipAllState.PullRight(Chunk.unsafeFromArray(leftBuilder));
          loop = false;
        }
      }
    }
    return [Chunk.unsafeFromArray(builder), state];
  };
  return (0, exports.combineChunks)(self, options.other, ZipAllState.PullBoth, pull);
});
/** @internal */
exports.zipAllWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const pull = (state, pullLeft, pullRight) => {
    switch (state._tag) {
      case ZipAllState.OP_DRAIN_LEFT:
        {
          return Effect.matchEffect(pullLeft, {
            onFailure: error => Effect.succeed(Exit.fail(error)),
            onSuccess: leftChunk => Effect.succeed(Exit.succeed([Chunk.map(leftChunk, options.onSelf), ZipAllState.DrainLeft]))
          });
        }
      case ZipAllState.OP_DRAIN_RIGHT:
        {
          return Effect.matchEffect(pullRight, {
            onFailure: error => Effect.succeed(Exit.fail(error)),
            onSuccess: rightChunk => Effect.succeed(Exit.succeed([Chunk.map(rightChunk, options.onOther), ZipAllState.DrainRight]))
          });
        }
      case ZipAllState.OP_PULL_BOTH:
        {
          return (0, Function_js_1.pipe)(unsome(pullLeft), Effect.zip(unsome(pullRight), {
            concurrent: true
          }), Effect.matchEffect({
            onFailure: error => Effect.succeed(Exit.fail(Option.some(error))),
            onSuccess: ([leftOption, rightOption]) => {
              if (Option.isSome(leftOption) && Option.isSome(rightOption)) {
                if (Chunk.isEmpty(leftOption.value) && Chunk.isEmpty(rightOption.value)) {
                  return pull(ZipAllState.PullBoth, pullLeft, pullRight);
                }
                if (Chunk.isEmpty(leftOption.value)) {
                  return pull(ZipAllState.PullLeft(rightOption.value), pullLeft, pullRight);
                }
                if (Chunk.isEmpty(rightOption.value)) {
                  return pull(ZipAllState.PullRight(leftOption.value), pullLeft, pullRight);
                }
                return Effect.succeed(Exit.succeed(zip(leftOption.value, rightOption.value, options.onBoth)));
              }
              if (Option.isSome(leftOption) && Option.isNone(rightOption)) {
                return Effect.succeed(Exit.succeed([Chunk.map(leftOption.value, options.onSelf), ZipAllState.DrainLeft]));
              }
              if (Option.isNone(leftOption) && Option.isSome(rightOption)) {
                return Effect.succeed(Exit.succeed([Chunk.map(rightOption.value, options.onOther), ZipAllState.DrainRight]));
              }
              return Effect.succeed(Exit.fail(Option.none()));
            }
          }));
        }
      case ZipAllState.OP_PULL_LEFT:
        {
          return Effect.matchEffect(pullLeft, {
            onFailure: Option.match({
              onNone: () => Effect.succeed(Exit.succeed([Chunk.map(state.rightChunk, options.onOther), ZipAllState.DrainRight])),
              onSome: error => Effect.succeed(Exit.fail(Option.some(error)))
            }),
            onSuccess: leftChunk => {
              if (Chunk.isEmpty(leftChunk)) {
                return pull(ZipAllState.PullLeft(state.rightChunk), pullLeft, pullRight);
              }
              if (Chunk.isEmpty(state.rightChunk)) {
                return pull(ZipAllState.PullRight(leftChunk), pullLeft, pullRight);
              }
              return Effect.succeed(Exit.succeed(zip(leftChunk, state.rightChunk, options.onBoth)));
            }
          });
        }
      case ZipAllState.OP_PULL_RIGHT:
        {
          return Effect.matchEffect(pullRight, {
            onFailure: Option.match({
              onNone: () => Effect.succeed(Exit.succeed([Chunk.map(state.leftChunk, options.onSelf), ZipAllState.DrainLeft])),
              onSome: error => Effect.succeed(Exit.fail(Option.some(error)))
            }),
            onSuccess: rightChunk => {
              if (Chunk.isEmpty(rightChunk)) {
                return pull(ZipAllState.PullRight(state.leftChunk), pullLeft, pullRight);
              }
              if (Chunk.isEmpty(state.leftChunk)) {
                return pull(ZipAllState.PullLeft(rightChunk), pullLeft, pullRight);
              }
              return Effect.succeed(Exit.succeed(zip(state.leftChunk, rightChunk, options.onBoth)));
            }
          });
        }
    }
  };
  const zip = (leftChunk, rightChunk, f) => {
    const [output, either] = zipChunks(leftChunk, rightChunk, f);
    switch (either._tag) {
      case "Left":
        {
          if (Chunk.isEmpty(either.left)) {
            return [output, ZipAllState.PullBoth];
          }
          return [output, ZipAllState.PullRight(either.left)];
        }
      case "Right":
        {
          if (Chunk.isEmpty(either.right)) {
            return [output, ZipAllState.PullBoth];
          }
          return [output, ZipAllState.PullLeft(either.right)];
        }
    }
  };
  return (0, exports.combineChunks)(self, options.other, ZipAllState.PullBoth, pull);
});
/** @internal */
exports.zipLatest = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.zipLatestWith)(that, (a, a2) => [a, a2])));
/** @internal */
exports.zipLatestWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => {
  const pullNonEmpty = pull => (0, Function_js_1.pipe)(pull, Effect.flatMap(chunk => Chunk.isEmpty(chunk) ? pullNonEmpty(pull) : Effect.succeed(chunk)));
  return (0, Function_js_1.pipe)((0, exports.toPull)(self), Effect.map(pullNonEmpty), Effect.zip((0, Function_js_1.pipe)((0, exports.toPull)(that), Effect.map(pullNonEmpty))), Effect.flatMap(([left, right]) => (0, Function_js_1.pipe)((0, exports.fromEffectOption)(Effect.raceWith(left, right, {
    onSelfDone: (leftDone, rightFiber) => (0, Function_js_1.pipe)(Effect.suspend(() => leftDone), Effect.zipWith(Fiber.join(rightFiber), (l, r) => [l, r, true])),
    onOtherDone: (rightDone, leftFiber) => (0, Function_js_1.pipe)(Effect.suspend(() => rightDone), Effect.zipWith(Fiber.join(leftFiber), (l, r) => [r, l, false]))
  })), (0, exports.flatMap)(([l, r, leftFirst]) => (0, Function_js_1.pipe)((0, exports.fromEffect)(Ref.make([Chunk.unsafeLast(l), Chunk.unsafeLast(r)])), (0, exports.flatMap)(latest => (0, Function_js_1.pipe)((0, exports.fromChunk)(leftFirst ? (0, Function_js_1.pipe)(r, Chunk.map(a2 => f(Chunk.unsafeLast(l), a2))) : (0, Function_js_1.pipe)(l, Chunk.map(a => f(a, Chunk.unsafeLast(r))))), (0, exports.concat)((0, Function_js_1.pipe)((0, exports.repeatEffectOption)(left), (0, exports.mergeEither)((0, exports.repeatEffectOption)(right)), (0, exports.mapEffectSequential)(Either.match({
    onLeft: leftChunk => (0, Function_js_1.pipe)(Ref.modify(latest, ([_, rightLatest]) => [(0, Function_js_1.pipe)(leftChunk, Chunk.map(a => f(a, rightLatest))), [Chunk.unsafeLast(leftChunk), rightLatest]])),
    onRight: rightChunk => (0, Function_js_1.pipe)(Ref.modify(latest, ([leftLatest, _]) => [(0, Function_js_1.pipe)(rightChunk, Chunk.map(a2 => f(leftLatest, a2))), [leftLatest, Chunk.unsafeLast(rightChunk)]]))
  })), (0, exports.flatMap)(exports.fromChunk))))))), exports.toPull)), exports.fromPull);
});
/** @internal */
exports.zipLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.zipWithChunks)(that, (left, right) => {
  if (left.length > right.length) {
    return [(0, Function_js_1.pipe)(left, Chunk.take(right.length)), Either.left((0, Function_js_1.pipe)(left, Chunk.take(right.length)))];
  }
  return [left, Either.right((0, Function_js_1.pipe)(right, Chunk.drop(left.length)))];
})));
/** @internal */
exports.zipRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.zipWithChunks)(that, (left, right) => {
  if (left.length > right.length) {
    return [right, Either.left((0, Function_js_1.pipe)(left, Chunk.take(right.length)))];
  }
  return [(0, Function_js_1.pipe)(right, Chunk.take(left.length)), Either.right((0, Function_js_1.pipe)(right, Chunk.drop(left.length)))];
})));
/** @internal */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, Function_js_1.pipe)(self, (0, exports.zipWithChunks)(that, (leftChunk, rightChunk) => zipChunks(leftChunk, rightChunk, f))));
/** @internal */
exports.zipWithChunks = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => {
  const pull = (state, pullLeft, pullRight) => {
    switch (state._tag) {
      case ZipChunksState.OP_PULL_BOTH:
        {
          return (0, Function_js_1.pipe)(unsome(pullLeft), Effect.zip(unsome(pullRight), {
            concurrent: true
          }), Effect.matchEffect({
            onFailure: error => Effect.succeed(Exit.fail(Option.some(error))),
            onSuccess: ([leftOption, rightOption]) => {
              if (Option.isSome(leftOption) && Option.isSome(rightOption)) {
                if (Chunk.isEmpty(leftOption.value) && Chunk.isEmpty(rightOption.value)) {
                  return pull(ZipChunksState.PullBoth, pullLeft, pullRight);
                }
                if (Chunk.isEmpty(leftOption.value)) {
                  return pull(ZipChunksState.PullLeft(rightOption.value), pullLeft, pullRight);
                }
                if (Chunk.isEmpty(rightOption.value)) {
                  return pull(ZipChunksState.PullRight(leftOption.value), pullLeft, pullRight);
                }
                return Effect.succeed(Exit.succeed(zip(leftOption.value, rightOption.value)));
              }
              return Effect.succeed(Exit.fail(Option.none()));
            }
          }));
        }
      case ZipChunksState.OP_PULL_LEFT:
        {
          return Effect.matchEffect(pullLeft, {
            onFailure: error => Effect.succeed(Exit.fail(error)),
            onSuccess: leftChunk => {
              if (Chunk.isEmpty(leftChunk)) {
                return pull(ZipChunksState.PullLeft(state.rightChunk), pullLeft, pullRight);
              }
              if (Chunk.isEmpty(state.rightChunk)) {
                return pull(ZipChunksState.PullRight(leftChunk), pullLeft, pullRight);
              }
              return Effect.succeed(Exit.succeed(zip(leftChunk, state.rightChunk)));
            }
          });
        }
      case ZipChunksState.OP_PULL_RIGHT:
        {
          return Effect.matchEffect(pullRight, {
            onFailure: error => Effect.succeed(Exit.fail(error)),
            onSuccess: rightChunk => {
              if (Chunk.isEmpty(rightChunk)) {
                return pull(ZipChunksState.PullRight(state.leftChunk), pullLeft, pullRight);
              }
              if (Chunk.isEmpty(state.leftChunk)) {
                return pull(ZipChunksState.PullLeft(rightChunk), pullLeft, pullRight);
              }
              return Effect.succeed(Exit.succeed(zip(state.leftChunk, rightChunk)));
            }
          });
        }
    }
  };
  const zip = (leftChunk, rightChunk) => {
    const [output, either] = f(leftChunk, rightChunk);
    switch (either._tag) {
      case "Left":
        {
          if (Chunk.isEmpty(either.left)) {
            return [output, ZipChunksState.PullBoth];
          }
          return [output, ZipChunksState.PullRight(either.left)];
        }
      case "Right":
        {
          if (Chunk.isEmpty(either.right)) {
            return [output, ZipChunksState.PullBoth];
          }
          return [output, ZipChunksState.PullLeft(either.right)];
        }
    }
  };
  return (0, Function_js_1.pipe)(self, (0, exports.combineChunks)(that, ZipChunksState.PullBoth, pull));
});
/** @internal */
const zipWithIndex = self => (0, Function_js_1.pipe)(self, (0, exports.mapAccum)(0, (index, a) => [index + 1, [a, index]]));
exports.zipWithIndex = zipWithIndex;
/** @internal */
const zipWithNext = self => {
  const process = last => core.readWithCause({
    onInput: input => {
      const [newLast, chunk] = Chunk.mapAccum(input, last, (prev, curr) => [Option.some(curr), (0, Function_js_1.pipe)(prev, Option.map(a => [a, curr]))]);
      const output = Chunk.filterMap(chunk, option => Option.isSome(option) ? Option.some([option.value[0], Option.some(option.value[1])]) : Option.none());
      return core.flatMap(core.write(output), () => process(newLast));
    },
    onFailure: core.failCause,
    onDone: () => Option.match(last, {
      onNone: () => core.unit,
      onSome: value => channel.zipRight(core.write(Chunk.of([value, Option.none()])), core.unit)
    })
  });
  return new StreamImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.pipeToOrFail(process(Option.none()))));
};
exports.zipWithNext = zipWithNext;
/** @internal */
const zipWithPrevious = self => (0, Function_js_1.pipe)(self, (0, exports.mapAccum)(Option.none(), (prev, curr) => [Option.some(curr), [prev, curr]]));
exports.zipWithPrevious = zipWithPrevious;
/** @internal */
const zipWithPreviousAndNext = self => (0, Function_js_1.pipe)((0, exports.zipWithNext)((0, exports.zipWithPrevious)(self)), (0, exports.map)(([[prev, curr], next]) => [prev, curr, (0, Function_js_1.pipe)(next, Option.map(tuple => tuple[1]))]));
exports.zipWithPreviousAndNext = zipWithPreviousAndNext;
/** @internal */
const zipChunks = (left, right, f) => {
  if (left.length > right.length) {
    return [(0, Function_js_1.pipe)(left, Chunk.take(right.length), Chunk.zipWith(right, f)), Either.left((0, Function_js_1.pipe)(left, Chunk.drop(right.length)))];
  }
  return [(0, Function_js_1.pipe)(left, Chunk.zipWith((0, Function_js_1.pipe)(right, Chunk.take(left.length)), f)), Either.right((0, Function_js_1.pipe)(right, Chunk.drop(left.length)))];
};
// Do notation
/** @internal */
exports.Do = /*#__PURE__*/(0, exports.succeed)({});
/** @internal */
exports.bind = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] !== "string", (self, tag, f, options) => (0, exports.flatMap)(self, k => (0, exports.map)(f(k), a => ({
  ...k,
  [tag]: a
})), options));
/* @internal */
exports.bindTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, tag) => (0, exports.map)(self, a => ({
  [tag]: a
})));
/* @internal */
exports.let_ = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, f) => (0, exports.map)(self, k => ({
  ...k,
  [tag]: f(k)
})));
// Circular with Channel
/** @internal */
const channelToStream = self => {
  return new StreamImpl(self);
};
exports.channelToStream = channelToStream;
// =============================================================================
// encoding
// =============================================================================
/** @internal */
exports.decodeText = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isStream)(args[0]), (self, encoding = "utf-8") => (0, exports.suspend)(() => {
  const decoder = new TextDecoder(encoding);
  return (0, exports.map)(self, s => decoder.decode(s));
}));
/** @internal */
const encodeText = self => (0, exports.suspend)(() => {
  const encoder = new TextEncoder();
  return (0, exports.map)(self, s => encoder.encode(s));
});
exports.encodeText = encodeText;
//# sourceMappingURL=stream.js.map