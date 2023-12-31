import * as Cause from "../Cause.js";
import * as Chunk from "../Chunk.js";
import * as Clock from "../Clock.js";
import * as Context from "../Context.js";
import * as Deferred from "../Deferred.js";
import * as Duration from "../Duration.js";
import * as Effect from "../Effect.js";
import * as Either from "../Either.js";
import * as Equal from "../Equal.js";
import * as Exit from "../Exit.js";
import * as Fiber from "../Fiber.js";
import { constTrue, dual, identity, pipe } from "../Function.js";
import * as Layer from "../Layer.js";
import * as MergeDecision from "../MergeDecision.js";
import * as Option from "../Option.js";
import { pipeArguments } from "../Pipeable.js";
import { hasProperty, isTagged } from "../Predicate.js";
import * as PubSub from "../PubSub.js";
import * as Queue from "../Queue.js";
import * as Ref from "../Ref.js";
import * as Runtime from "../Runtime.js";
import * as Schedule from "../Schedule.js";
import * as Scope from "../Scope.js";
import * as HaltStrategy from "../StreamHaltStrategy.js";
import * as channel from "./channel.js";
import * as channelExecutor from "./channel/channelExecutor.js";
import * as MergeStrategy from "./channel/mergeStrategy.js";
import * as singleProducerAsyncInput from "./channel/singleProducerAsyncInput.js";
import * as core from "./core-stream.js";
import { RingBuffer } from "./ringBuffer.js";
import * as _sink from "./sink.js";
import * as DebounceState from "./stream/debounceState.js";
import * as emit from "./stream/emit.js";
import * as haltStrategy from "./stream/haltStrategy.js";
import * as Handoff from "./stream/handoff.js";
import * as HandoffSignal from "./stream/handoffSignal.js";
import * as pull from "./stream/pull.js";
import * as SinkEndReason from "./stream/sinkEndReason.js";
import * as ZipAllState from "./stream/zipAllState.js";
import * as ZipChunksState from "./stream/zipChunksState.js";
import * as _take from "./take.js";
/** @internal */
const StreamSymbolKey = "effect/Stream";
/** @internal */
export const StreamTypeId = /*#__PURE__*/Symbol.for(StreamSymbolKey);
/** @internal */
const streamVariance = {
  _R: _ => _,
  _E: _ => _,
  _A: _ => _
};
/** @internal */
export class StreamImpl {
  channel;
  [StreamTypeId] = streamVariance;
  constructor(channel) {
    this.channel = channel;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/** @internal */
export const isStream = u => hasProperty(u, StreamTypeId) || Effect.isEffect(u);
/** @internal */
export const DefaultChunkSize = 4096;
/** @internal */
export const accumulate = self => chunks(accumulateChunks(self));
/** @internal */
export const accumulateChunks = self => {
  const accumulator = s => core.readWith({
    onInput: input => {
      const next = Chunk.appendAll(s, input);
      return core.flatMap(core.write(next), () => accumulator(next));
    },
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(core.pipeTo(toChannel(self), accumulator(Chunk.empty())));
};
/** @internal */
export const acquireRelease = (acquire, release) => scoped(Effect.acquireRelease(acquire, release));
/** @internal */
export const aggregate = /*#__PURE__*/dual(2, (self, sink) => aggregateWithin(self, sink, Schedule.forever));
/** @internal */
export const aggregateWithin = /*#__PURE__*/dual(3, (self, sink, schedule) => filterMap(aggregateWithinEither(self, sink, schedule), _ => Either.match(_, {
  onLeft: Option.none,
  onRight: Option.some
})));
/** @internal */
export const aggregateWithinEither = /*#__PURE__*/dual(3, (self, sink, schedule) => {
  const layer = Effect.all([Handoff.make(), Ref.make(SinkEndReason.ScheduleEnd), Ref.make(Chunk.empty()), Schedule.driver(schedule), Ref.make(false), Ref.make(false)]);
  return pipe(fromEffect(layer), flatMap(([handoff, sinkEndReason, sinkLeftovers, scheduleDriver, consumed, endAfterEmit]) => {
    const handoffProducer = core.readWithCause({
      onInput: input => core.flatMap(core.fromEffect(pipe(handoff, Handoff.offer(HandoffSignal.emit(input)), Effect.when(() => Chunk.isNonEmpty(input)))), () => handoffProducer),
      onFailure: cause => core.fromEffect(Handoff.offer(handoff, HandoffSignal.halt(cause))),
      onDone: () => core.fromEffect(Handoff.offer(handoff, HandoffSignal.end(SinkEndReason.UpstreamEnd)))
    });
    const handoffConsumer = pipe(Ref.getAndSet(sinkLeftovers, Chunk.empty()), Effect.flatMap(leftovers => {
      if (Chunk.isNonEmpty(leftovers)) {
        return pipe(Ref.set(consumed, true), Effect.zipRight(Effect.succeed(pipe(core.write(leftovers), core.flatMap(() => handoffConsumer)))));
      }
      return pipe(Handoff.take(handoff), Effect.map(signal => {
        switch (signal._tag) {
          case HandoffSignal.OP_EMIT:
            {
              return pipe(core.fromEffect(Ref.set(consumed, true)), channel.zipRight(core.write(signal.elements)), channel.zipRight(core.fromEffect(Ref.get(endAfterEmit))), core.flatMap(bool => bool ? core.unit : handoffConsumer));
            }
          case HandoffSignal.OP_HALT:
            {
              return core.failCause(signal.cause);
            }
          case HandoffSignal.OP_END:
            {
              if (signal.reason._tag === SinkEndReason.OP_SCHEDULE_END) {
                return pipe(Ref.get(consumed), Effect.map(bool => bool ? core.fromEffect(pipe(Ref.set(sinkEndReason, SinkEndReason.ScheduleEnd), Effect.zipRight(Ref.set(endAfterEmit, true)))) : pipe(core.fromEffect(pipe(Ref.set(sinkEndReason, SinkEndReason.ScheduleEnd), Effect.zipRight(Ref.set(endAfterEmit, true)))), core.flatMap(() => handoffConsumer))), channel.unwrap);
              }
              return pipe(Ref.set(sinkEndReason, signal.reason), Effect.zipRight(Ref.set(endAfterEmit, true)), core.fromEffect);
            }
        }
      }));
    }), channel.unwrap);
    const timeout = lastB => scheduleDriver.next(lastB);
    const scheduledAggregator = (sinkFiber, scheduleFiber, scope) => {
      const forkSink = pipe(Ref.set(consumed, false), Effect.zipRight(Ref.set(endAfterEmit, false)), Effect.zipRight(pipe(handoffConsumer, channel.pipeToOrFail(_sink.toChannel(sink)), core.collectElements, channelExecutor.run, Effect.forkIn(scope))));
      const handleSide = (leftovers, b, c) => pipe(Ref.set(sinkLeftovers, Chunk.flatten(leftovers)), Effect.zipRight(Effect.map(Ref.get(sinkEndReason), reason => {
        switch (reason._tag) {
          case SinkEndReason.OP_SCHEDULE_END:
            {
              return pipe(Effect.all([Ref.get(consumed), forkSink, pipe(timeout(Option.some(b)), Effect.forkIn(scope))]), Effect.map(([wasConsumed, sinkFiber, scheduleFiber]) => {
                const toWrite = pipe(c, Option.match({
                  onNone: () => Chunk.of(Either.right(b)),
                  onSome: c => Chunk.make(Either.right(b), Either.left(c))
                }));
                if (wasConsumed) {
                  return pipe(core.write(toWrite), core.flatMap(() => scheduledAggregator(sinkFiber, scheduleFiber, scope)));
                }
                return scheduledAggregator(sinkFiber, scheduleFiber, scope);
              }), channel.unwrap);
            }
          case SinkEndReason.OP_UPSTREAM_END:
            {
              return pipe(Ref.get(consumed), Effect.map(wasConsumed => wasConsumed ? core.write(Chunk.of(Either.right(b))) : core.unit), channel.unwrap);
            }
        }
      })), channel.unwrap);
      return channel.unwrap(Effect.raceWith(Fiber.join(sinkFiber), Fiber.join(scheduleFiber), {
        onSelfDone: (sinkExit, _) => pipe(Fiber.interrupt(scheduleFiber), Effect.zipRight(pipe(Effect.suspend(() => sinkExit), Effect.map(([leftovers, b]) => handleSide(leftovers, b, Option.none()))))),
        onOtherDone: (scheduleExit, _) => Effect.matchCauseEffect(Effect.suspend(() => scheduleExit), {
          onFailure: cause => Either.match(Cause.failureOrCause(cause), {
            onLeft: () => pipe(handoff, Handoff.offer(HandoffSignal.end(SinkEndReason.ScheduleEnd)), Effect.forkDaemon, Effect.zipRight(pipe(Fiber.join(sinkFiber), Effect.map(([leftovers, b]) => handleSide(leftovers, b, Option.none()))))),
            onRight: cause => pipe(handoff, Handoff.offer(HandoffSignal.halt(cause)), Effect.forkDaemon, Effect.zipRight(pipe(Fiber.join(sinkFiber), Effect.map(([leftovers, b]) => handleSide(leftovers, b, Option.none())))))
          }),
          onSuccess: c => pipe(handoff, Handoff.offer(HandoffSignal.end(SinkEndReason.ScheduleEnd)), Effect.forkDaemon, Effect.zipRight(pipe(Fiber.join(sinkFiber), Effect.map(([leftovers, b]) => handleSide(leftovers, b, Option.some(c))))))
        })
      }));
    };
    return unwrapScoped(pipe(self, toChannel, core.pipeTo(handoffProducer), channelExecutor.run, Effect.forkScoped, Effect.zipRight(pipe(handoffConsumer, channel.pipeToOrFail(_sink.toChannel(sink)), core.collectElements, channelExecutor.run, Effect.forkScoped, Effect.flatMap(sinkFiber => pipe(Effect.forkScoped(timeout(Option.none())), Effect.flatMap(scheduleFiber => pipe(Effect.scope, Effect.map(scope => new StreamImpl(scheduledAggregator(sinkFiber, scheduleFiber, scope)))))))))));
  }));
});
/** @internal */
export const as = /*#__PURE__*/dual(2, (self, value) => map(self, () => value));
/** @internal */
export const _async = (register, outputBuffer = 16) => asyncOption(cb => {
  register(cb);
  return Option.none();
}, outputBuffer);
/** @internal */
export const asyncEffect = (register, outputBuffer = 16) => pipe(Effect.acquireRelease(Queue.bounded(outputBuffer), queue => Queue.shutdown(queue)), Effect.flatMap(output => pipe(Effect.runtime(), Effect.flatMap(runtime => pipe(register(emit.make(k => pipe(_take.fromPull(k), Effect.flatMap(take => Queue.offer(output, take)), Effect.asUnit, Runtime.runPromiseExit(runtime)).then(exit => {
  if (Exit.isFailure(exit)) {
    if (!Cause.isInterrupted(exit.cause)) {
      throw Cause.squash(exit.cause);
    }
  }
}))), Effect.map(() => {
  const loop = pipe(Queue.take(output), Effect.flatMap(_take.done), Effect.match({
    onFailure: maybeError => pipe(core.fromEffect(Queue.shutdown(output)), channel.zipRight(Option.match(maybeError, {
      onNone: () => core.unit,
      onSome: core.fail
    }))),
    onSuccess: chunk => pipe(core.write(chunk), core.flatMap(() => loop))
  }), channel.unwrap);
  return loop;
}))))), channel.unwrapScoped, fromChannel);
/** @internal */
export const asyncInterrupt = (register, outputBuffer = 16) => pipe(Effect.acquireRelease(Queue.bounded(outputBuffer), queue => Queue.shutdown(queue)), Effect.flatMap(output => pipe(Effect.runtime(), Effect.flatMap(runtime => pipe(Effect.sync(() => register(emit.make(k => pipe(_take.fromPull(k), Effect.flatMap(take => Queue.offer(output, take)), Effect.asUnit, Runtime.runPromiseExit(runtime)).then(exit => {
  if (Exit.isFailure(exit)) {
    if (!Cause.isInterrupted(exit.cause)) {
      throw Cause.squash(exit.cause);
    }
  }
})))), Effect.map(Either.match({
  onLeft: canceler => {
    const loop = pipe(Queue.take(output), Effect.flatMap(_take.done), Effect.match({
      onFailure: maybeError => channel.zipRight(core.fromEffect(Queue.shutdown(output)), Option.match(maybeError, {
        onNone: () => core.unit,
        onSome: core.fail
      })),
      onSuccess: chunk => pipe(core.write(chunk), core.flatMap(() => loop))
    }), channel.unwrap);
    return pipe(fromChannel(loop), ensuring(canceler));
  },
  onRight: stream => unwrap(pipe(Queue.shutdown(output), Effect.as(stream)))
})))))), unwrapScoped);
/** @internal */
export const asyncOption = (register, outputBuffer = 16) => asyncInterrupt(emit => Option.match(register(emit), {
  onNone: () => Either.left(Effect.unit),
  onSome: Either.right
}), outputBuffer);
/** @internal */
export const asyncScoped = (register, outputBuffer = 16) => pipe(Effect.acquireRelease(Queue.bounded(outputBuffer), queue => Queue.shutdown(queue)), Effect.flatMap(output => pipe(Effect.runtime(), Effect.flatMap(runtime => pipe(register(emit.make(k => pipe(_take.fromPull(k), Effect.flatMap(take => Queue.offer(output, take)), Effect.asUnit, Runtime.runPromiseExit(runtime)).then(exit => {
  if (Exit.isFailure(exit)) {
    if (!Cause.isInterrupted(exit.cause)) {
      throw Cause.squash(exit.cause);
    }
  }
}))), Effect.zipRight(Ref.make(false)), Effect.flatMap(ref => pipe(Ref.get(ref), Effect.map(isDone => isDone ? pull.end() : pipe(Queue.take(output), Effect.flatMap(_take.done), Effect.onError(() => pipe(Ref.set(ref, true), Effect.zipRight(Queue.shutdown(output)))))))))))), scoped, flatMap(repeatEffectChunkOption));
/** @internal */
export const branchAfter = /*#__PURE__*/dual(3, (self, n, f) => suspend(() => {
  const buffering = acc => core.readWith({
    onInput: input => {
      const nextSize = acc.length + input.length;
      if (nextSize >= n) {
        const [b1, b2] = pipe(input, Chunk.splitAt(n - acc.length));
        return running(pipe(acc, Chunk.appendAll(b1)), b2);
      }
      return buffering(pipe(acc, Chunk.appendAll(input)));
    },
    onFailure: core.fail,
    onDone: () => running(acc, Chunk.empty())
  });
  const running = (prefix, leftover) => core.pipeTo(channel.zipRight(core.write(leftover), channel.identityChannel()), toChannel(f(prefix)));
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(buffering(Chunk.empty()))));
}));
/** @internal */
export const broadcast = /*#__PURE__*/dual(3, (self, n, maximumLag) => pipe(self, broadcastedQueues(n, maximumLag), Effect.map(tuple => tuple.map(queue => flattenTake(fromQueue(queue, {
  shutdown: true
}))))));
/** @internal */
export const broadcastDynamic = /*#__PURE__*/dual(2, (self, maximumLag) => pipe(self, broadcastedQueuesDynamic(maximumLag), Effect.map(effect => flattenTake(flatMap(scoped(effect), fromQueue)))));
/** @internal */
export const broadcastedQueues = /*#__PURE__*/dual(3, (self, n, maximumLag) => Effect.flatMap(PubSub.bounded(maximumLag), pubsub => pipe(Effect.all(Array.from({
  length: n
}, () => PubSub.subscribe(pubsub))), Effect.tap(() => Effect.forkScoped(runIntoPubSubScoped(self, pubsub))))));
/** @internal */
export const broadcastedQueuesDynamic = /*#__PURE__*/dual(2, (self, maximumLag) => Effect.map(toPubSub(self, maximumLag), PubSub.subscribe));
/** @internal */
export const buffer = /*#__PURE__*/dual(2, (self, options) => {
  if (options.capacity === "unbounded") {
    return bufferUnbounded(self);
  } else if (options.strategy === "dropping") {
    return bufferDropping(self, options.capacity);
  } else if (options.strategy === "sliding") {
    return bufferSliding(self, options.capacity);
  }
  const queue = toQueueOfElements(self, options);
  return new StreamImpl(channel.unwrapScoped(Effect.map(queue, queue => {
    const process = pipe(core.fromEffect(Queue.take(queue)), core.flatMap(Exit.match({
      onFailure: cause => pipe(Cause.flipCauseOption(cause), Option.match({
        onNone: () => core.unit,
        onSome: core.failCause
      })),
      onSuccess: value => core.flatMap(core.write(Chunk.of(value)), () => process)
    })));
    return process;
  })));
});
/** @internal */
export const bufferChunks = /*#__PURE__*/dual(2, (self, options) => {
  if (options.strategy === "dropping") {
    return bufferChunksDropping(self, options.capacity);
  } else if (options.strategy === "sliding") {
    return bufferChunksSliding(self, options.capacity);
  }
  const queue = toQueue(self, options);
  return new StreamImpl(channel.unwrapScoped(Effect.map(queue, queue => {
    const process = pipe(core.fromEffect(Queue.take(queue)), core.flatMap(_take.match({
      onEnd: () => core.unit,
      onFailure: core.failCause,
      onSuccess: value => pipe(core.write(value), core.flatMap(() => process))
    })));
    return process;
  })));
});
const bufferChunksDropping = /*#__PURE__*/dual(2, (self, capacity) => {
  const queue = Effect.acquireRelease(Queue.dropping(capacity), queue => Queue.shutdown(queue));
  return new StreamImpl(bufferSignal(queue, toChannel(self)));
});
const bufferChunksSliding = /*#__PURE__*/dual(2, (self, capacity) => {
  const queue = Effect.acquireRelease(Queue.sliding(capacity), queue => Queue.shutdown(queue));
  return new StreamImpl(bufferSignal(queue, toChannel(self)));
});
const bufferDropping = /*#__PURE__*/dual(2, (self, capacity) => {
  const queue = Effect.acquireRelease(Queue.dropping(capacity), queue => Queue.shutdown(queue));
  return new StreamImpl(bufferSignal(queue, toChannel(rechunk(1)(self))));
});
const bufferSliding = /*#__PURE__*/dual(2, (self, capacity) => {
  const queue = Effect.acquireRelease(Queue.sliding(capacity), queue => Queue.shutdown(queue));
  return new StreamImpl(bufferSignal(queue, toChannel(pipe(self, rechunk(1)))));
});
const bufferUnbounded = self => {
  const queue = toQueue(self, {
    strategy: "unbounded"
  });
  return new StreamImpl(channel.unwrapScoped(Effect.map(queue, queue => {
    const process = pipe(core.fromEffect(Queue.take(queue)), core.flatMap(_take.match({
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
    const terminate = take => pipe(Ref.get(ref), Effect.tap(Deferred.await), Effect.zipRight(Deferred.make()), Effect.flatMap(deferred => pipe(Queue.offer(queue, [take, deferred]), Effect.zipRight(Ref.set(ref, deferred)), Effect.zipRight(Deferred.await(deferred)))), Effect.asUnit, core.fromEffect);
    return core.readWithCause({
      onInput: input => pipe(Deferred.make(), Effect.flatMap(deferred => pipe(Queue.offer(queue, [_take.chunk(input), deferred]), Effect.flatMap(added => pipe(Ref.set(ref, deferred), Effect.when(() => added))))), Effect.asUnit, core.fromEffect, core.flatMap(() => producer(queue, ref))),
      onFailure: error => terminate(_take.failCause(error)),
      onDone: () => terminate(_take.end)
    });
  };
  const consumer = queue => {
    const process = pipe(core.fromEffect(Queue.take(queue)), core.flatMap(([take, deferred]) => channel.zipRight(core.fromEffect(Deferred.succeed(deferred, void 0)), _take.match(take, {
      onEnd: () => core.unit,
      onFailure: core.failCause,
      onSuccess: value => pipe(core.write(value), core.flatMap(() => process))
    }))));
    return process;
  };
  return channel.unwrapScoped(pipe(scoped, Effect.flatMap(queue => pipe(Deferred.make(), Effect.tap(start => Deferred.succeed(start, void 0)), Effect.flatMap(start => pipe(Ref.make(start), Effect.flatMap(ref => pipe(bufferChannel, core.pipeTo(producer(queue, ref)), channelExecutor.runScoped, Effect.forkScoped)), Effect.as(consumer(queue))))))));
};
/** @internal */
export const catchAll = /*#__PURE__*/dual(2, (self, f) => catchAllCause(self, cause => Either.match(Cause.failureOrCause(cause), {
  onLeft: f,
  onRight: failCause
})));
/** @internal */
export const catchAllCause = /*#__PURE__*/dual(2, (self, f) => new StreamImpl(pipe(toChannel(self), core.catchAllCause(cause => toChannel(f(cause))))));
/** @internal */
export const catchSome = /*#__PURE__*/dual(2, (self, pf) => pipe(self, catchAll(error => pipe(pf(error), Option.getOrElse(() => fail(error))))));
/** @internal */
export const catchSomeCause = /*#__PURE__*/dual(2, (self, pf) => pipe(self, catchAllCause(cause => pipe(pf(cause), Option.getOrElse(() => failCause(cause))))));
/* @internal */
export const catchTag = /*#__PURE__*/dual(3, (self, k, f) => catchAll(self, e => {
  if ("_tag" in e && e["_tag"] === k) {
    return f(e);
  }
  return fail(e);
}));
/** @internal */
export const catchTags = /*#__PURE__*/dual(2, (self, cases) => catchAll(self, e => {
  const keys = Object.keys(cases);
  if ("_tag" in e && keys.includes(e["_tag"])) {
    return cases[e["_tag"]](e);
  }
  return fail(e);
}));
/** @internal */
export const changes = self => pipe(self, changesWith((x, y) => Equal.equals(y)(x)));
/** @internal */
export const changesWith = /*#__PURE__*/dual(2, (self, f) => {
  const writer = last => core.readWithCause({
    onInput: input => {
      const [newLast, newChunk] = Chunk.reduce(input, [last, Chunk.empty()], ([option, outputs], output) => {
        if (Option.isSome(option) && f(option.value, output)) {
          return [Option.some(output), outputs];
        }
        return [Option.some(output), pipe(outputs, Chunk.append(output))];
      });
      return core.flatMap(core.write(newChunk), () => writer(newLast));
    },
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(writer(Option.none()))));
});
/** @internal */
export const changesWithEffect = /*#__PURE__*/dual(2, (self, f) => {
  const writer = last => core.readWithCause({
    onInput: input => pipe(input, Effect.reduce([last, Chunk.empty()], ([option, outputs], output) => {
      if (Option.isSome(option)) {
        return pipe(f(option.value, output), Effect.map(bool => bool ? [Option.some(output), outputs] : [Option.some(output), pipe(outputs, Chunk.append(output))]));
      }
      return Effect.succeed([Option.some(output), pipe(outputs, Chunk.append(output))]);
    }), core.fromEffect, core.flatMap(([newLast, newChunk]) => pipe(core.write(newChunk), core.flatMap(() => writer(newLast))))),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(writer(Option.none()))));
});
/** @internal */
export const chunks = self => pipe(self, mapChunks(Chunk.of));
/** @internal */
export const chunksWith = /*#__PURE__*/dual(2, (self, f) => flattenChunks(f(chunks(self))));
const unsome = effect => Effect.catchAll(Effect.asSome(effect), o => o._tag === "None" ? Effect.succeedNone : Effect.fail(o.value));
/** @internal */
export const combine = /*#__PURE__*/dual(4, (self, that, s, f) => {
  const producer = (handoff, latch) => pipe(core.fromEffect(Handoff.take(latch)), channel.zipRight(core.readWithCause({
    onInput: input => core.flatMap(core.fromEffect(pipe(handoff, Handoff.offer(Exit.succeed(input)))), () => producer(handoff, latch)),
    onFailure: cause => core.fromEffect(Handoff.offer(handoff, Exit.failCause(pipe(cause, Cause.map(Option.some))))),
    onDone: () => core.flatMap(core.fromEffect(Handoff.offer(handoff, Exit.fail(Option.none()))), () => producer(handoff, latch))
  })));
  return new StreamImpl(channel.unwrapScoped(Effect.gen(function* ($) {
    const left = yield* $(Handoff.make());
    const right = yield* $(Handoff.make());
    const latchL = yield* $(Handoff.make());
    const latchR = yield* $(Handoff.make());
    yield* $(toChannel(self), channel.concatMap(channel.writeChunk), core.pipeTo(producer(left, latchL)), channelExecutor.runScoped, Effect.forkScoped);
    yield* $(toChannel(that), channel.concatMap(channel.writeChunk), core.pipeTo(producer(right, latchR)), channelExecutor.runScoped, Effect.forkScoped);
    const pullLeft = pipe(latchL, Handoff.offer(void 0),
    // TODO: remove
    Effect.zipRight(pipe(Handoff.take(left), Effect.flatMap(exit => Effect.suspend(() => exit)))));
    const pullRight = pipe(latchR, Handoff.offer(void 0),
    // TODO: remove
    Effect.zipRight(pipe(Handoff.take(right), Effect.flatMap(exit => Effect.suspend(() => exit)))));
    return toChannel(unfoldEffect(s, s => Effect.flatMap(f(s, pullLeft, pullRight), unsome)));
  })));
});
/** @internal */
export const combineChunks = /*#__PURE__*/dual(4, (self, that, s, f) => {
  const producer = (handoff, latch) => channel.zipRight(core.fromEffect(Handoff.take(latch)), core.readWithCause({
    onInput: input => core.flatMap(core.fromEffect(pipe(handoff, Handoff.offer(_take.chunk(input)))), () => producer(handoff, latch)),
    onFailure: cause => core.fromEffect(Handoff.offer(handoff, _take.failCause(cause))),
    onDone: () => core.fromEffect(Handoff.offer(handoff, _take.end))
  }));
  return new StreamImpl(pipe(Effect.all([Handoff.make(), Handoff.make(), Handoff.make(), Handoff.make()]), Effect.tap(([left, _, latchL]) => pipe(toChannel(self), core.pipeTo(producer(left, latchL)), channelExecutor.runScoped, Effect.forkScoped)), Effect.tap(([_, right, __, latchR]) => pipe(toChannel(that), core.pipeTo(producer(right, latchR)), channelExecutor.runScoped, Effect.forkScoped)), Effect.map(([left, right, latchL, latchR]) => {
    const pullLeft = pipe(latchL, Handoff.offer(void 0), Effect.zipRight(pipe(Handoff.take(left), Effect.flatMap(_take.done))));
    const pullRight = pipe(latchR, Handoff.offer(void 0), Effect.zipRight(pipe(Handoff.take(right), Effect.flatMap(_take.done))));
    return toChannel(unfoldChunkEffect(s, s => Effect.flatMap(f(s, pullLeft, pullRight), unsome)));
  }), channel.unwrapScoped));
});
/** @internal */
export const concat = /*#__PURE__*/dual(2, (self, that) => new StreamImpl(pipe(toChannel(self), channel.zipRight(toChannel(that)))));
/** @internal */
export const concatAll = streams => suspend(() => pipe(streams, Chunk.reduce(empty, (x, y) => concat(y)(x))));
/** @internal */
export const cross = /*#__PURE__*/dual(2, (self, that) => pipe(self, crossWith(that, (a, a2) => [a, a2])));
/** @internal */
export const crossLeft = /*#__PURE__*/dual(2, (self, that) => pipe(self, crossWith(that, (a, _) => a)));
/** @internal */
export const crossRight = /*#__PURE__*/dual(2, (self, that) => flatMap(self, () => that));
/** @internal */
export const crossWith = /*#__PURE__*/dual(3, (self, that, f) => pipe(self, flatMap(a => pipe(that, map(b => f(a, b))))));
/** @internal */
export const debounce = /*#__PURE__*/dual(2, (self, duration) => pipe(singleProducerAsyncInput.make(), Effect.flatMap(input => Effect.transplant(grafter => pipe(Handoff.make(), Effect.map(handoff => {
  const enqueue = last => pipe(Clock.sleep(duration), Effect.as(last), Effect.fork, grafter, Effect.map(fiber => consumer(DebounceState.previous(fiber))));
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
          return pipe(Handoff.take(handoff), Effect.map(signal => {
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
              onFailure: cause => pipe(Fiber.interrupt(current), Effect.as(core.failCause(cause))),
              onSuccess: chunk => Effect.succeed(pipe(core.write(chunk), core.flatMap(() => consumer(DebounceState.current(current)))))
            }),
            onOtherDone: (rightExit, previous) => Exit.match(rightExit, {
              onFailure: cause => pipe(Fiber.interrupt(previous), Effect.as(core.failCause(cause))),
              onSuccess: signal => {
                switch (signal._tag) {
                  case HandoffSignal.OP_EMIT:
                    {
                      return pipe(Fiber.interrupt(previous), Effect.zipRight(enqueue(signal.elements)));
                    }
                  case HandoffSignal.OP_HALT:
                    {
                      return pipe(Fiber.interrupt(previous), Effect.as(core.failCause(signal.cause)));
                    }
                  case HandoffSignal.OP_END:
                    {
                      return pipe(Fiber.join(previous), Effect.map(chunk => pipe(core.write(chunk), channel.zipRight(core.unit))));
                    }
                }
              }
            })
          }));
        }
      case DebounceState.OP_CURRENT:
        {
          return pipe(Fiber.join(state.fiber), Effect.map(signal => {
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
  const debounceChannel = pipe(channel.fromInput(input), core.pipeTo(producer), channelExecutor.run, Effect.forkScoped, Effect.as(pipe(consumer(DebounceState.notStarted), core.embedInput(input))), channel.unwrapScoped);
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(debounceChannel)));
})))), unwrap));
/** @internal */
export const die = defect => fromEffect(Effect.die(defect));
/** @internal */
export const dieSync = evaluate => fromEffect(Effect.dieSync(evaluate));
/** @internal */
export const dieMessage = message => fromEffect(Effect.dieMessage(message));
/** @internal */
export const distributedWith = /*#__PURE__*/dual(2, (self, options) => pipe(Deferred.make(), Effect.flatMap(deferred => pipe(self, distributedWithDynamic({
  maximumLag: options.maximumLag,
  decide: a => Effect.flatMap(Deferred.await(deferred), f => f(a))
}), Effect.flatMap(next => pipe(Effect.all(Chunk.map(Chunk.range(0, options.size - 1), id => Effect.map(next, ([key, queue]) => [[key, id], queue]))), Effect.map(Chunk.unsafeFromArray), Effect.flatMap(entries => {
  const [mappings, queues] = Chunk.reduceRight(entries, [new Map(), Chunk.empty()], ([mappings, queues], [mapping, queue]) => [mappings.set(mapping[0], mapping[1]), pipe(queues, Chunk.prepend(queue))]);
  return pipe(Deferred.succeed(deferred, a => Effect.map(options.decide(a), f => key => pipe(f(mappings.get(key))))), Effect.as(Array.from(queues)));
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
export const distributedWithDynamic = /*#__PURE__*/dual(2, (self, options) => distributedWithDynamicCallback(self, options.maximumLag, options.decide, () => Effect.unit));
export const distributedWithDynamicCallback = /*#__PURE__*/dual(4, (self, maximumLag, decide, done) => pipe(Effect.acquireRelease(Ref.make(new Map()), (ref, _) => pipe(Ref.get(ref), Effect.flatMap(queues => pipe(queues.values(), Effect.forEach(Queue.shutdown))))), Effect.flatMap(queuesRef => Effect.gen(function* ($) {
  const offer = a => pipe(decide(a), Effect.flatMap(shouldProcess => pipe(Ref.get(queuesRef), Effect.flatMap(queues => pipe(queues.entries(), Effect.reduce(Chunk.empty(), (acc, [id, queue]) => {
    if (shouldProcess(id)) {
      return pipe(Queue.offer(queue, Exit.succeed(a)), Effect.matchCauseEffect({
        onFailure: cause =>
        // Ignore all downstream queues that were shut
        // down and remove them later
        Cause.isInterrupted(cause) ? Effect.succeed(pipe(acc, Chunk.prepend(id))) : Effect.failCause(cause),
        onSuccess: () => Effect.succeed(acc)
      }));
    }
    return Effect.succeed(acc);
  }), Effect.flatMap(ids => {
    if (Chunk.isNonEmpty(ids)) {
      return pipe(Ref.update(queuesRef, map => {
        for (const id of ids) {
          map.delete(id);
        }
        return map;
      }));
    }
    return Effect.unit;
  }))))), Effect.asUnit);
  const queuesLock = yield* $(Effect.makeSemaphore(1));
  const newQueue = yield* $(Ref.make(pipe(Queue.bounded(maximumLag), Effect.flatMap(queue => {
    const id = newDistributedWithDynamicId();
    return pipe(Ref.update(queuesRef, map => map.set(id, queue)), Effect.as([id, queue]));
  }))));
  const finalize = endTake =>
  // Make sure that no queues are currently being added
  queuesLock.withPermits(1)(pipe(Ref.set(newQueue, pipe(
  // All newly created queues should end immediately
  Queue.bounded(1), Effect.tap(queue => Queue.offer(queue, endTake)), Effect.flatMap(queue => {
    const id = newDistributedWithDynamicId();
    return pipe(Ref.update(queuesRef, map => map.set(id, queue)), Effect.as([id, queue]));
  }))), Effect.zipRight(pipe(Ref.get(queuesRef), Effect.flatMap(map => pipe(Chunk.fromIterable(map.values()), Effect.forEach(queue => pipe(Queue.offer(queue, endTake), Effect.catchSomeCause(cause => Cause.isInterrupted(cause) ? Option.some(Effect.unit) : Option.none()))))))), Effect.zipRight(done(endTake)), Effect.asUnit));
  yield* $(self, runForEachScoped(offer), Effect.matchCauseEffect({
    onFailure: cause => finalize(Exit.failCause(pipe(cause, Cause.map(Option.some)))),
    onSuccess: () => finalize(Exit.fail(Option.none()))
  }), Effect.forkScoped);
  return queuesLock.withPermits(1)(Effect.flatten(Ref.get(newQueue)));
}))));
/** @internal */
export const drain = self => new StreamImpl(channel.drain(toChannel(self)));
/** @internal */
export const drainFork = /*#__PURE__*/dual(2, (self, that) => pipe(fromEffect(Deferred.make()), flatMap(backgroundDied => pipe(scoped(pipe(that, runForEachScoped(() => Effect.unit), Effect.catchAllCause(cause => Deferred.failCause(backgroundDied, cause)), Effect.forkScoped)), crossRight(pipe(self, interruptWhenDeferred(backgroundDied)))))));
/** @internal */
export const drop = /*#__PURE__*/dual(2, (self, n) => {
  const loop = r => core.readWith({
    onInput: input => {
      const dropped = pipe(input, Chunk.drop(r));
      const leftover = Math.max(0, r - input.length);
      const more = Chunk.isEmpty(input) || leftover > 0;
      if (more) {
        return loop(leftover);
      }
      return pipe(core.write(dropped), channel.zipRight(channel.identityChannel()));
    },
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(loop(n))));
});
/** @internal */
export const dropRight = /*#__PURE__*/dual(2, (self, n) => {
  if (n <= 0) {
    return identityStream();
  }
  return suspend(() => {
    const queue = new RingBuffer(n);
    const reader = core.readWith({
      onInput: input => {
        const outputs = pipe(input, Chunk.filterMap(elem => {
          const head = queue.head();
          queue.put(elem);
          return head;
        }));
        return pipe(core.write(outputs), core.flatMap(() => reader));
      },
      onFailure: core.fail,
      onDone: () => core.unit
    });
    return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(reader)));
  });
});
/** @internal */
export const dropUntil = /*#__PURE__*/dual(2, (self, predicate) => drop(dropWhile(self, a => !predicate(a)), 1));
/** @internal */
export const dropUntilEffect = /*#__PURE__*/dual(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => pipe(Effect.dropUntil(input, predicate), Effect.map(Chunk.unsafeFromArray), Effect.map(leftover => {
      const more = Chunk.isEmpty(leftover);
      if (more) {
        return core.suspend(() => loop);
      }
      return pipe(core.write(leftover), channel.zipRight(channel.identityChannel()));
    }), channel.unwrap),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(loop)));
});
/** @internal */
export const dropWhile = /*#__PURE__*/dual(2, (self, predicate) => {
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
  return new StreamImpl(channel.pipeToOrFail(toChannel(self), loop));
});
/** @internal */
export const dropWhileEffect = /*#__PURE__*/dual(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => pipe(Effect.dropWhile(input, predicate), Effect.map(Chunk.unsafeFromArray), Effect.map(leftover => {
      const more = Chunk.isEmpty(leftover);
      if (more) {
        return core.suspend(() => loop);
      }
      return channel.zipRight(core.write(leftover), channel.identityChannel());
    }), channel.unwrap),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(channel.pipeToOrFail(toChannel(self), loop));
});
/** @internal */
export const either = self => pipe(self, map(Either.right), catchAll(error => make(Either.left(error))));
/** @internal */
export const empty = /*#__PURE__*/new StreamImpl( /*#__PURE__*/core.write( /*#__PURE__*/Chunk.empty()));
/** @internal */
export const ensuring = /*#__PURE__*/dual(2, (self, finalizer) => new StreamImpl(pipe(toChannel(self), channel.ensuring(finalizer))));
/** @internal */
export const ensuringWith = /*#__PURE__*/dual(2, (self, finalizer) => new StreamImpl(core.ensuringWith(toChannel(self), finalizer)));
/** @internal */
export const context = () => fromEffect(Effect.context());
/** @internal */
export const contextWith = f => pipe(context(), map(f));
/** @internal */
export const contextWithEffect = f => pipe(context(), mapEffectSequential(f));
/** @internal */
export const contextWithStream = f => pipe(context(), flatMap(f));
/** @internal */
export const execute = effect => drain(fromEffect(effect));
/** @internal */
export const fail = error => fromEffectOption(Effect.fail(Option.some(error)));
/** @internal */
export const failSync = evaluate => fromEffectOption(Effect.failSync(() => Option.some(evaluate())));
/** @internal */
export const failCause = cause => fromEffect(Effect.failCause(cause));
/** @internal */
export const failCauseSync = evaluate => fromEffect(Effect.failCauseSync(evaluate));
/** @internal */
export const filter = /*#__PURE__*/dual(2, (self, predicate) => mapChunks(self, Chunk.filter(predicate)));
/** @internal */
export const filterEffect = /*#__PURE__*/dual(2, (self, f) => {
  const loop = iterator => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: input => loop(input[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeed
      });
    } else {
      return pipe(f(next.value), Effect.map(bool => bool ? pipe(core.write(Chunk.of(next.value)), core.flatMap(() => loop(iterator))) : loop(iterator)), channel.unwrap);
    }
  };
  return new StreamImpl(core.suspend(() => pipe(toChannel(self), core.pipeTo(loop(Chunk.empty()[Symbol.iterator]())))));
});
/** @internal */
export const filterMap = /*#__PURE__*/dual(2, (self, pf) => mapChunks(self, Chunk.filterMap(pf)));
/** @internal */
export const filterMapEffect = /*#__PURE__*/dual(2, (self, pf) => suspend(() => {
  const loop = iterator => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: input => loop(input[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeed
      });
    } else {
      return pipe(pf(next.value), Option.match({
        onNone: () => Effect.sync(() => loop(iterator)),
        onSome: Effect.map(a2 => core.flatMap(core.write(Chunk.of(a2)), () => loop(iterator)))
      }), channel.unwrap);
    }
  };
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(loop(Chunk.empty()[Symbol.iterator]()))));
}));
/** @internal */
export const filterMapWhile = /*#__PURE__*/dual(2, (self, pf) => {
  const loop = core.readWith({
    onInput: input => {
      const mapped = Chunk.filterMapWhile(input, pf);
      if (mapped.length === input.length) {
        return pipe(core.write(mapped), core.flatMap(() => loop));
      }
      return core.write(mapped);
    },
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(loop)));
});
/** @internal */
export const filterMapWhileEffect = /*#__PURE__*/dual(2, (self, pf) => suspend(() => {
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
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(loop(Chunk.empty()[Symbol.iterator]()))));
}));
/** @internal */
export const finalizer = finalizer => acquireRelease(Effect.unit, () => finalizer);
/** @internal */
export const find = /*#__PURE__*/dual(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => Option.match(Chunk.findFirst(input, predicate), {
      onNone: () => loop,
      onSome: n => core.write(Chunk.of(n))
    }),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(loop)));
});
/** @internal */
export const findEffect = /*#__PURE__*/dual(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => pipe(Effect.findFirst(input, predicate), Effect.map(Option.match({
      onNone: () => loop,
      onSome: n => core.write(Chunk.of(n))
    })), channel.unwrap),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(loop)));
});
/** @internal */
export const flatMap = /*#__PURE__*/dual(args => typeof args[0] !== "function", (self, f, options) => {
  const bufferSize = options?.bufferSize ?? 16;
  if (options?.switch) {
    return matchConcurrency(options?.concurrency, () => flatMapParSwitchBuffer(self, 1, bufferSize, f), n => flatMapParSwitchBuffer(self, n, bufferSize, f));
  }
  return matchConcurrency(options?.concurrency, () => new StreamImpl(channel.concatMap(toChannel(self), as => pipe(as, Chunk.map(a => toChannel(f(a))), Chunk.reduce(core.unit, (left, right) => pipe(left, channel.zipRight(right)))))), _ => new StreamImpl(pipe(toChannel(self), channel.concatMap(channel.writeChunk), channel.mergeMap(out => toChannel(f(out)), options))));
});
/** @internal */
export const matchConcurrency = (concurrency, sequential, bounded) => {
  switch (concurrency) {
    case undefined:
      return sequential();
    case "unbounded":
      return bounded(Number.MAX_SAFE_INTEGER);
    default:
      return concurrency > 1 ? bounded(concurrency) : sequential();
  }
};
const flatMapParSwitchBuffer = /*#__PURE__*/dual(4, (self, n, bufferSize, f) => new StreamImpl(pipe(toChannel(self), channel.concatMap(channel.writeChunk), channel.mergeMap(out => toChannel(f(out)), {
  concurrency: n,
  mergeStrategy: MergeStrategy.BufferSliding(),
  bufferSize
}))));
/** @internal */
export const flatten = /*#__PURE__*/dual(args => isStream(args[0]), (self, options) => flatMap(self, identity, options));
/** @internal */
export const flattenChunks = self => {
  const flatten = core.readWithCause({
    onInput: chunks => core.flatMap(channel.writeChunk(chunks), () => flatten),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(flatten)));
};
/** @internal */
export const flattenEffect = /*#__PURE__*/dual(args => isStream(args[0]), (self, options) => options?.unordered ? flatMap(self, a => fromEffect(a), {
  concurrency: options.concurrency
}) : matchConcurrency(options?.concurrency, () => mapEffectSequential(self, identity), n => new StreamImpl(pipe(toChannel(self), channel.concatMap(channel.writeChunk), channel.mapOutEffectPar(identity, n), channel.mapOut(Chunk.of)))));
/** @internal */
export const flattenExitOption = self => {
  const processChunk = (chunk, cont) => {
    const [toEmit, rest] = pipe(chunk, Chunk.splitWhere(exit => !Exit.isSuccess(exit)));
    const next = pipe(Chunk.head(rest), Option.match({
      onNone: () => cont,
      onSome: Exit.match({
        onFailure: cause => Option.match(Cause.flipCauseOption(cause), {
          onNone: () => core.unit,
          onSome: core.failCause
        }),
        onSuccess: () => core.unit
      })
    }));
    return pipe(core.write(pipe(toEmit, Chunk.filterMap(exit => Exit.isSuccess(exit) ? Option.some(exit.value) : Option.none()))), core.flatMap(() => next));
  };
  const process = core.readWithCause({
    onInput: chunk => processChunk(chunk, process),
    onFailure: cause => core.failCause(cause),
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(process)));
};
/** @internal */
export const flattenIterables = self => pipe(self, map(Chunk.fromIterable), flattenChunks);
/** @internal */
export const flattenTake = self => flattenChunks(flattenExitOption(pipe(self, map(take => take.exit))));
/** @internal */
export const forever = self => new StreamImpl(channel.repeated(toChannel(self)));
/** @internal */
export const fromAsyncIterable = (iterable, onError) => pipe(Effect.acquireRelease(Effect.sync(() => iterable[Symbol.asyncIterator]()), iterator => iterator.return ? Effect.promise(async () => iterator.return()) : Effect.unit), Effect.map(iterator => repeatEffectOption(pipe(Effect.tryPromise({
  try: async () => iterator.next(),
  catch: reason => Option.some(onError(reason))
}), Effect.flatMap(result => result.done ? Effect.fail(Option.none()) : Effect.succeed(result.value))))), unwrapScoped);
/** @internal */
export const fromChannel = channel => new StreamImpl(channel);
/** @internal */
export const toChannel = stream => {
  if ("channel" in stream) {
    return stream.channel;
  } else if (Effect.isEffect(stream)) {
    return toChannel(fromEffect(stream));
  } else {
    throw new TypeError(`Expected a Stream.`);
  }
};
/** @internal */
export const fromChunk = chunk => new StreamImpl(Chunk.isEmpty(chunk) ? core.unit : core.write(chunk));
/** @internal */
export const fromChunkPubSub = (pubsub, options) => {
  if (options?.scoped) {
    const effect = Effect.map(PubSub.subscribe(pubsub), fromChunkQueue);
    return options.shutdown ? Effect.map(effect, ensuring(PubSub.shutdown(pubsub))) : effect;
  }
  const stream = flatMap(scoped(PubSub.subscribe(pubsub)), fromChunkQueue);
  return options?.shutdown ? ensuring(stream, PubSub.shutdown(pubsub)) : stream;
};
/** @internal */
export const fromChunkQueue = (queue, options) => pipe(Queue.take(queue), Effect.catchAllCause(cause => pipe(Queue.isShutdown(queue), Effect.flatMap(isShutdown => isShutdown && Cause.isInterrupted(cause) ? pull.end() : pull.failCause(cause)))), repeatEffectChunkOption, options?.shutdown ? ensuring(Queue.shutdown(queue)) : identity);
/** @internal */
export const fromChunks = (...chunks) => pipe(fromIterable(chunks), flatMap(fromChunk));
/** @internal */
export const fromEffect = effect => pipe(effect, Effect.mapError(Option.some), fromEffectOption);
/** @internal */
export const fromEffectOption = effect => new StreamImpl(channel.unwrap(Effect.match(effect, {
  onFailure: Option.match({
    onNone: () => core.unit,
    onSome: core.fail
  }),
  onSuccess: a => core.write(Chunk.of(a))
})));
/** @internal */
export const fromPubSub = (pubsub, options) => {
  const maxChunkSize = options?.maxChunkSize ?? DefaultChunkSize;
  if (options?.scoped) {
    const effect = Effect.map(PubSub.subscribe(pubsub), queue => fromQueue(queue, {
      maxChunkSize,
      shutdown: true
    }));
    return options.shutdown ? Effect.map(effect, ensuring(PubSub.shutdown(pubsub))) : effect;
  }
  const stream = flatMap(scoped(PubSub.subscribe(pubsub)), queue => fromQueue(queue, {
    maxChunkSize
  }));
  return options?.shutdown ? ensuring(stream, PubSub.shutdown(pubsub)) : stream;
};
/** @internal */
export const fromIterable = iterable => suspend(() => Chunk.isChunk(iterable) ? fromChunk(iterable) : fromIteratorSucceed(iterable[Symbol.iterator]()));
/** @internal */
export const fromIterableEffect = effect => pipe(effect, Effect.map(fromIterable), unwrap);
/** @internal */
export const fromIteratorSucceed = (iterator, maxChunkSize = DefaultChunkSize) => {
  return pipe(Effect.sync(() => {
    let builder = [];
    const loop = iterator => pipe(Effect.sync(() => {
      let next = iterator.next();
      if (maxChunkSize === 1) {
        if (next.done) {
          return core.unit;
        }
        return pipe(core.write(Chunk.of(next.value)), core.flatMap(() => loop(iterator)));
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
        return pipe(core.write(Chunk.unsafeFromArray(builder)), core.flatMap(() => loop(iterator)));
      }
      return core.unit;
    }), channel.unwrap);
    return new StreamImpl(loop(iterator));
  }), unwrap);
};
/** @internal */
export const fromPull = effect => pipe(effect, Effect.map(repeatEffectChunkOption), unwrapScoped);
/** @internal */
export const fromQueue = (queue, options) => pipe(Queue.takeBetween(queue, 1, options?.maxChunkSize ?? DefaultChunkSize), Effect.catchAllCause(cause => pipe(Queue.isShutdown(queue), Effect.flatMap(isShutdown => isShutdown && Cause.isInterrupted(cause) ? pull.end() : pull.failCause(cause)))), repeatEffectChunkOption, options?.shutdown ? ensuring(Queue.shutdown(queue)) : identity);
/** @internal */
export const fromSchedule = schedule => pipe(Schedule.driver(schedule), Effect.map(driver => repeatEffectOption(driver.next(void 0))), unwrap);
/** @internal */
export const fromReadableStream = (evaluate, onError) => unwrapScoped(Effect.map(Effect.acquireRelease(Effect.sync(() => evaluate().getReader()), reader => Effect.promise(() => reader.cancel())), reader => repeatEffectOption(Effect.flatMap(Effect.tryPromise({
  try: () => reader.read(),
  catch: reason => Option.some(onError(reason))
}), ({
  done,
  value
}) => done ? Effect.fail(Option.none()) : Effect.succeed(value)))));
/** @internal */
export const fromReadableStreamByob = (evaluate, onError, allocSize = 4096) => unwrapScoped(Effect.map(Effect.acquireRelease(Effect.sync(() => evaluate().getReader({
  mode: "byob"
})), reader => Effect.promise(() => reader.cancel())), reader => catchAll(forever(readChunkStreamByobReader(reader, onError, allocSize)), error => isTagged(error, "EOF") ? empty : fail(error))));
const readChunkStreamByobReader = (reader, onError, size) => {
  const buffer = new ArrayBuffer(size);
  return paginateEffect(0, offset => Effect.flatMap(Effect.tryPromise({
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
export const groupAdjacentBy = /*#__PURE__*/dual(2, (self, f) => {
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
  return new StreamImpl(channel.pipeToOrFail(toChannel(self), groupAdjacent(Option.none())));
});
/** @internal */
export const grouped = /*#__PURE__*/dual(2, (self, chunkSize) => pipe(self, rechunk(chunkSize), chunks));
/** @internal */
export const groupedWithin = /*#__PURE__*/dual(3, (self, chunkSize, duration) => aggregateWithin(self, _sink.collectAllN(chunkSize), Schedule.spaced(duration)));
/** @internal */
export const haltWhen = /*#__PURE__*/dual(2, (self, effect) => {
  const writer = fiber => pipe(Fiber.poll(fiber), Effect.map(Option.match({
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
  return new StreamImpl(pipe(Effect.forkScoped(effect), Effect.map(fiber => pipe(toChannel(self), core.pipeTo(writer(fiber)))), channel.unwrapScoped));
});
/** @internal */
export const haltAfter = /*#__PURE__*/dual(2, (self, duration) => pipe(self, haltWhen(Clock.sleep(duration))));
/** @internal */
export const haltWhenDeferred = /*#__PURE__*/dual(2, (self, deferred) => {
  const writer = pipe(Deferred.poll(deferred), Effect.map(Option.match({
    onNone: () => core.readWith({
      onInput: input => pipe(core.write(input), core.flatMap(() => writer)),
      onFailure: core.fail,
      onDone: () => core.unit
    }),
    onSome: effect => channel.unwrap(Effect.match(effect, {
      onFailure: core.fail,
      onSuccess: () => core.unit
    }))
  })), channel.unwrap);
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(writer)));
});
/** @internal */
export const identityStream = () => new StreamImpl(channel.identityChannel());
/** @internal */
export const interleave = /*#__PURE__*/dual(2, (self, that) => pipe(self, interleaveWith(that, forever(make(true, false)))));
/** @internal */
export const interleaveWith = /*#__PURE__*/dual(3, (self, that, decider) => {
  const producer = handoff => core.readWithCause({
    onInput: value => core.flatMap(core.fromEffect(Handoff.offer(handoff, _take.of(value))), () => producer(handoff)),
    onFailure: cause => core.fromEffect(Handoff.offer(handoff, _take.failCause(cause))),
    onDone: () => core.fromEffect(Handoff.offer(handoff, _take.end))
  });
  return new StreamImpl(channel.unwrapScoped(pipe(Handoff.make(), Effect.zip(Handoff.make()), Effect.tap(([left]) => pipe(toChannel(self), channel.concatMap(channel.writeChunk), core.pipeTo(producer(left)), channelExecutor.runScoped, Effect.forkScoped)), Effect.tap(([_, right]) => pipe(toChannel(that), channel.concatMap(channel.writeChunk), core.pipeTo(producer(right)), channelExecutor.runScoped, Effect.forkScoped)), Effect.map(([left, right]) => {
    const process = (leftDone, rightDone) => core.readWithCause({
      onInput: bool => {
        if (bool && !leftDone) {
          return pipe(core.fromEffect(Handoff.take(left)), core.flatMap(_take.match({
            onEnd: () => rightDone ? core.unit : process(true, rightDone),
            onFailure: core.failCause,
            onSuccess: chunk => pipe(core.write(chunk), core.flatMap(() => process(leftDone, rightDone)))
          })));
        }
        if (!bool && !rightDone) {
          return pipe(core.fromEffect(Handoff.take(right)), core.flatMap(_take.match({
            onEnd: () => leftDone ? core.unit : process(leftDone, true),
            onFailure: core.failCause,
            onSuccess: chunk => pipe(core.write(chunk), core.flatMap(() => process(leftDone, rightDone)))
          })));
        }
        return process(leftDone, rightDone);
      },
      onFailure: core.failCause,
      onDone: () => core.unit
    });
    return pipe(toChannel(decider), channel.concatMap(channel.writeChunk), core.pipeTo(process(false, false)));
  }))));
});
/** @internal */
export const intersperse = /*#__PURE__*/dual(2, (self, element) => new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(core.suspend(() => {
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
      return pipe(core.write(Chunk.unsafeFromArray(builder)), core.flatMap(() => writer(flagResult)));
    },
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return writer(true);
})))));
/** @internal */
export const intersperseAffixes = /*#__PURE__*/dual(2, (self, {
  end,
  middle,
  start
}) => pipe(make(start), concat(pipe(self, intersperse(middle))), concat(make(end))));
/** @internal */
export const interruptAfter = /*#__PURE__*/dual(2, (self, duration) => pipe(self, interruptWhen(Clock.sleep(duration))));
/** @internal */
export const interruptWhen = /*#__PURE__*/dual(2, (self, effect) => new StreamImpl(pipe(toChannel(self), channel.interruptWhen(effect))));
/** @internal */
export const interruptWhenDeferred = /*#__PURE__*/dual(2, (self, deferred) => new StreamImpl(pipe(toChannel(self), channel.interruptWhenDeferred(deferred))));
/** @internal */
export const iterate = (value, next) => unfold(value, a => Option.some([a, next(a)]));
/** @internal */
export const make = (...as) => fromIterable(as);
/** @internal */
export const map = /*#__PURE__*/dual(2, (self, f) => new StreamImpl(pipe(toChannel(self), channel.mapOut(Chunk.map(f)))));
/** @internal */
export const mapAccum = /*#__PURE__*/dual(3, (self, s, f) => {
  const accumulator = s => core.readWith({
    onInput: input => {
      const [nextS, chunk] = Chunk.mapAccum(input, s, f);
      return core.flatMap(core.write(chunk), () => accumulator(nextS));
    },
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(accumulator(s))));
});
/** @internal */
export const mapAccumEffect = /*#__PURE__*/dual(3, (self, s, f) => suspend(() => {
  const accumulator = s => core.readWith({
    onInput: input => pipe(Effect.suspend(() => {
      const outputs = [];
      const emit = output => Effect.sync(() => {
        outputs.push(output);
      });
      return pipe(input, Effect.reduce(s, (s, a) => pipe(f(s, a), Effect.flatMap(([s, a]) => pipe(emit(a), Effect.as(s))))), Effect.match({
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
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(accumulator(s))));
}));
/** @internal */
export const mapBoth = /*#__PURE__*/dual(2, (self, options) => pipe(self, mapError(options.onFailure), map(options.onSuccess)));
/** @internal */
export const mapChunks = /*#__PURE__*/dual(2, (self, f) => new StreamImpl(pipe(toChannel(self), channel.mapOut(f))));
/** @internal */
export const mapChunksEffect = /*#__PURE__*/dual(2, (self, f) => new StreamImpl(pipe(toChannel(self), channel.mapOutEffect(f))));
/** @internal */
export const mapConcat = /*#__PURE__*/dual(2, (self, f) => pipe(self, mapConcatChunk(a => Chunk.fromIterable(f(a)))));
/** @internal */
export const mapConcatChunk = /*#__PURE__*/dual(2, (self, f) => pipe(self, mapChunks(Chunk.flatMap(f))));
/** @internal */
export const mapConcatChunkEffect = /*#__PURE__*/dual(2, (self, f) => pipe(self, mapEffectSequential(f), mapConcatChunk(identity)));
/** @internal */
export const mapConcatEffect = /*#__PURE__*/dual(2, (self, f) => pipe(self, mapEffectSequential(a => pipe(f(a), Effect.map(Chunk.fromIterable))), mapConcatChunk(identity)));
/** @internal */
export const mapEffectSequential = /*#__PURE__*/dual(2, (self, f) => {
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
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(core.suspend(() => loop(Chunk.empty()[Symbol.iterator]())))));
});
/** @internal */
export const mapEffectPar = /*#__PURE__*/dual(3, (self, n, f) => new StreamImpl(pipe(toChannel(self), channel.concatMap(channel.writeChunk), channel.mapOutEffectPar(f, n), channel.mapOut(Chunk.of))));
/** @internal */
export const mapError = /*#__PURE__*/dual(2, (self, f) => new StreamImpl(pipe(toChannel(self), channel.mapError(f))));
/** @internal */
export const mapErrorCause = /*#__PURE__*/dual(2, (self, f) => new StreamImpl(pipe(toChannel(self), channel.mapErrorCause(f))));
/** @internal */
export const merge = /*#__PURE__*/dual(args => isStream(args[1]), (self, that, options) => mergeWith(self, that, {
  onSelf: identity,
  onOther: identity,
  haltStrategy: options?.haltStrategy
}));
/** @internal */
export const mergeAll = /*#__PURE__*/dual(args => Symbol.iterator in args[0], (streams, options) => flatten(fromIterable(streams), options));
/** @internal */
export const mergeEither = /*#__PURE__*/dual(2, (self, that) => mergeWith(self, that, {
  onSelf: Either.left,
  onOther: Either.right
}));
/** @internal */
export const mergeLeft = /*#__PURE__*/dual(2, (self, that) => pipe(self, merge(drain(that))));
/** @internal */
export const mergeRight = /*#__PURE__*/dual(2, (self, that) => pipe(drain(self), merge(that)));
/** @internal */
export const mergeWith = /*#__PURE__*/dual(3, (self, other, options) => {
  const strategy = options.haltStrategy ? haltStrategy.fromInput(options.haltStrategy) : HaltStrategy.Both;
  const handler = terminate => exit => terminate || !Exit.isSuccess(exit) ?
  // TODO: remove
  MergeDecision.Done(Effect.suspend(() => exit)) : MergeDecision.Await(exit => Effect.suspend(() => exit));
  return new StreamImpl(channel.mergeWith(toChannel(map(self, options.onSelf)), {
    other: toChannel(map(other, options.onOther)),
    onSelfDone: handler(strategy._tag === "Either" || strategy._tag === "Left"),
    onOtherDone: handler(strategy._tag === "Either" || strategy._tag === "Right")
  }));
});
/** @internal */
export const mkString = self => run(self, _sink.mkString);
/** @internal */
export const never = /*#__PURE__*/fromEffect(Effect.never);
/** @internal */
export const onError = /*#__PURE__*/dual(2, (self, cleanup) => pipe(self, catchAllCause(cause => fromEffect(pipe(cleanup(cause), Effect.zipRight(Effect.failCause(cause)))))));
/** @internal */
export const onDone = /*#__PURE__*/dual(2, (self, cleanup) => new StreamImpl(pipe(toChannel(self), core.ensuringWith(exit => Exit.isSuccess(exit) ? cleanup() : Effect.unit))));
/** @internal */
export const orDie = self => pipe(self, orDieWith(identity));
/** @internal */
export const orDieWith = /*#__PURE__*/dual(2, (self, f) => new StreamImpl(pipe(toChannel(self), channel.orDieWith(f))));
/** @internal */
export const orElse = /*#__PURE__*/dual(2, (self, that) => new StreamImpl(pipe(toChannel(self), channel.orElse(() => toChannel(that())))));
/** @internal */
export const orElseEither = /*#__PURE__*/dual(2, (self, that) => pipe(self, map(Either.left), orElse(() => pipe(that(), map(Either.right)))));
/** @internal */
export const orElseFail = /*#__PURE__*/dual(2, (self, error) => pipe(self, orElse(() => failSync(error))));
/** @internal */
export const orElseIfEmpty = /*#__PURE__*/dual(2, (self, element) => pipe(self, orElseIfEmptyChunk(() => Chunk.of(element()))));
/** @internal */
export const orElseIfEmptyChunk = /*#__PURE__*/dual(2, (self, chunk) => pipe(self, orElseIfEmptyStream(() => new StreamImpl(core.write(chunk())))));
/** @internal */
export const orElseIfEmptyStream = /*#__PURE__*/dual(2, (self, stream) => {
  const writer = core.readWith({
    onInput: input => {
      if (Chunk.isEmpty(input)) {
        return core.suspend(() => writer);
      }
      return pipe(core.write(input), channel.zipRight(channel.identityChannel()));
    },
    onFailure: core.fail,
    onDone: () => core.suspend(() => toChannel(stream()))
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(writer)));
});
/** @internal */
export const orElseSucceed = /*#__PURE__*/dual(2, (self, value) => pipe(self, orElse(() => sync(value))));
/** @internal */
export const paginate = (s, f) => paginateChunk(s, s => {
  const page = f(s);
  return [Chunk.of(page[0]), page[1]];
});
/** @internal */
export const paginateChunk = (s, f) => {
  const loop = s => {
    const page = f(s);
    return Option.match(page[1], {
      onNone: () => channel.zipRight(core.write(page[0]), core.unit),
      onSome: s => core.flatMap(core.write(page[0]), () => loop(s))
    });
  };
  return new StreamImpl(core.suspend(() => loop(s)));
};
/** @internal */
export const paginateChunkEffect = (s, f) => {
  const loop = s => channel.unwrap(Effect.map(f(s), ([chunk, option]) => Option.match(option, {
    onNone: () => channel.zipRight(core.write(chunk), core.unit),
    onSome: s => core.flatMap(core.write(chunk), () => loop(s))
  })));
  return new StreamImpl(core.suspend(() => loop(s)));
};
/** @internal */
export const paginateEffect = (s, f) => paginateChunkEffect(s, s => pipe(f(s), Effect.map(([a, s]) => [Chunk.of(a), s])));
/** @internal */
export const peel = /*#__PURE__*/dual(2, (self, sink) => {
  const OP_EMIT = "Emit";
  const OP_HALT = "Halt";
  const OP_END = "End";
  return pipe(Deferred.make(), Effect.flatMap(deferred => pipe(Handoff.make(), Effect.map(handoff => {
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
        return _sink.fromChannel(pipe(core.fromEffect(Deferred.succeed(deferred, z)), channel.zipRight(core.fromEffect(pipe(handoff, Handoff.offer({
          _tag: OP_EMIT,
          elements: leftovers
        })))), channel.zipRight(loop)));
      }
    });
    const producer = pipe(Handoff.take(handoff), Effect.map(signal => {
      switch (signal._tag) {
        case OP_EMIT:
          {
            return pipe(core.write(signal.elements), core.flatMap(() => producer));
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
    return pipe(self, tapErrorCause(cause => Deferred.failCause(deferred, cause)), run(consumer), Effect.forkScoped, Effect.zipRight(Deferred.await(deferred)), Effect.map(z => [z, new StreamImpl(producer)]));
  }))), Effect.flatten);
});
/** @internal */
export const partition = /*#__PURE__*/dual(args => typeof args[1] === "function", (self, predicate, options) => partitionEither(self, a => Effect.succeed(predicate(a) ? Either.left(a) : Either.right(a)), options));
/** @internal */
export const partitionEither = /*#__PURE__*/dual(args => typeof args[1] === "function", (self, predicate, options) => pipe(mapEffectSequential(self, predicate), distributedWith({
  size: 2,
  maximumLag: options?.bufferSize ?? 16,
  decide: Either.match({
    onLeft: () => Effect.succeed(n => n === 0),
    onRight: () => Effect.succeed(n => n === 1)
  })
}), Effect.flatMap(([queue1, queue2]) => Effect.succeed([filterMap(flattenExitOption(fromQueue(queue1, {
  shutdown: true
})), _ => Either.match(_, {
  onLeft: Option.some,
  onRight: Option.none
})), filterMap(flattenExitOption(fromQueue(queue2, {
  shutdown: true
})), _ => Either.match(_, {
  onLeft: Option.none,
  onRight: Option.some
}))]))));
/** @internal */
export const pipeThrough = /*#__PURE__*/dual(2, (self, sink) => new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(_sink.toChannel(sink)))));
/** @internal */
export const pipeThroughChannel = /*#__PURE__*/dual(2, (self, channel) => new StreamImpl(pipe(toChannel(self), core.pipeTo(channel))));
/** @internal */
export const pipeThroughChannelOrFail = /*#__PURE__*/dual(2, (self, chan) => new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(chan))));
/** @internal */
export const prepend = /*#__PURE__*/dual(2, (self, values) => new StreamImpl(channel.zipRight(core.write(values), toChannel(self))));
/** @internal */
export const provideContext = /*#__PURE__*/dual(2, (self, context) => new StreamImpl(pipe(toChannel(self), core.provideContext(context))));
/** @internal */
export const provideLayer = /*#__PURE__*/dual(2, (self, layer) => new StreamImpl(channel.unwrapScoped(pipe(Layer.build(layer), Effect.map(env => pipe(toChannel(self), core.provideContext(env)))))));
/** @internal */
export const provideService = /*#__PURE__*/dual(3, (self, tag, resource) => provideServiceEffect(self, tag, Effect.succeed(resource)));
/** @internal */
export const provideServiceEffect = /*#__PURE__*/dual(3, (self, tag, effect) => provideServiceStream(self, tag, fromEffect(effect)));
/** @internal */
export const provideServiceStream = /*#__PURE__*/dual(3, (self, tag, stream) => contextWithStream(env => flatMap(stream, service => pipe(self, provideContext(Context.add(env, tag, service))))));
/** @internal */
export const mapInputContext = /*#__PURE__*/dual(2, (self, f) => contextWithStream(env => pipe(self, provideContext(f(env)))));
/** @internal */
export const provideSomeLayer = /*#__PURE__*/dual(2, (self, layer) =>
// @ts-expect-error
pipe(self, provideLayer(pipe(Layer.context(), Layer.merge(layer)))));
/** @internal */
export const range = (min, max, chunkSize = DefaultChunkSize) => suspend(() => {
  if (min > max) {
    return empty;
  }
  const go = (min, max, chunkSize) => {
    const remaining = max - min + 1;
    if (remaining > chunkSize) {
      return pipe(core.write(Chunk.range(min, min + chunkSize - 1)), core.flatMap(() => go(min + chunkSize, max, chunkSize)));
    }
    return core.write(Chunk.range(min, min + remaining - 1));
  };
  return new StreamImpl(go(min, max, chunkSize));
});
/** @internal */
export const rechunk = /*#__PURE__*/dual(2, (self, n) => suspend(() => {
  const target = Math.max(n, 1);
  const process = rechunkProcess(new StreamRechunker(target), target);
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(process)));
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
          result = rechunker.write(pipe(chunk, Chunk.unsafeGet(index)));
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
export const refineOrDie = /*#__PURE__*/dual(2, (self, pf) => pipe(self, refineOrDieWith(pf, identity)));
/** @internal */
export const refineOrDieWith = /*#__PURE__*/dual(3, (self, pf, f) => new StreamImpl(channel.catchAll(toChannel(self), error => Option.match(pf(error), {
  onNone: () => core.failCause(Cause.die(f(error))),
  onSome: core.fail
}))));
/** @internal */
export const repeat = /*#__PURE__*/dual(2, (self, schedule) => filterMap(repeatEither(self, schedule), _ => Either.match(_, {
  onLeft: Option.none,
  onRight: Option.some
})));
/** @internal */
export const repeatEffect = effect => repeatEffectOption(pipe(effect, Effect.mapError(Option.some)));
/** @internal */
export const repeatEffectChunk = effect => repeatEffectChunkOption(pipe(effect, Effect.mapError(Option.some)));
/** @internal */
export const repeatEffectChunkOption = effect => unfoldChunkEffect(effect, effect => pipe(Effect.map(effect, chunk => Option.some([chunk, effect])), Effect.catchAll(Option.match({
  onNone: () => Effect.succeed(Option.none()),
  onSome: Effect.fail
}))));
/** @internal */
export const repeatEffectOption = effect => repeatEffectChunkOption(pipe(effect, Effect.map(Chunk.of)));
/** @internal */
export const repeatEither = /*#__PURE__*/dual(2, (self, schedule) => repeatWith(self, schedule, {
  onElement: a => Either.right(a),
  onSchedule: Either.left
}));
/** @internal */
export const repeatElements = /*#__PURE__*/dual(2, (self, schedule) => filterMap(repeatElementsWith(self, schedule, {
  onElement: a => Option.some(a),
  onSchedule: Option.none
}), identity));
/** @internal */
export const repeatElementsWith = /*#__PURE__*/dual(3, (self, schedule, options) => {
  const driver = pipe(Schedule.driver(schedule), Effect.map(driver => {
    const feed = input => Option.match(Chunk.head(input), {
      onNone: () => loop,
      onSome: a => channel.zipRight(core.write(Chunk.of(options.onElement(a))), step(pipe(input, Chunk.drop(1)), a))
    });
    const step = (input, a) => {
      const advance = pipe(driver.next(a), Effect.as(pipe(core.write(Chunk.of(options.onElement(a))), core.flatMap(() => step(input, a)))));
      const reset = pipe(driver.last(), Effect.orDie, Effect.flatMap(b => pipe(driver.reset(), Effect.map(() => pipe(core.write(Chunk.of(options.onSchedule(b))), channel.zipRight(feed(input)))))));
      return pipe(advance, Effect.orElse(() => reset), channel.unwrap);
    };
    const loop = core.readWith({
      onInput: feed,
      onFailure: core.fail,
      onDone: () => core.unit
    });
    return loop;
  }), channel.unwrap);
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(driver)));
});
/** @internal */
export const repeatValue = value => new StreamImpl(channel.repeated(core.write(Chunk.of(value))));
/** @internal */
export const repeatWith = /*#__PURE__*/dual(3, (self, schedule, options) => {
  return pipe(Schedule.driver(schedule), Effect.map(driver => {
    const scheduleOutput = pipe(driver.last(), Effect.orDie, Effect.map(options.onSchedule));
    const process = pipe(self, map(options.onElement), toChannel);
    const loop = channel.unwrap(Effect.match(driver.next(void 0), {
      onFailure: () => core.unit,
      onSuccess: () => pipe(process, channel.zipRight(pipe(scheduleOutput, Effect.map(c => pipe(core.write(Chunk.of(c)), core.flatMap(() => loop))), channel.unwrap)))
    }));
    return new StreamImpl(pipe(process, channel.zipRight(loop)));
  }), unwrap);
});
/** @internal */
export const repeatWithSchedule = (value, schedule) => repeatEffectWithSchedule(Effect.succeed(value), schedule);
/** @internal */
export const repeatEffectWithSchedule = (effect, schedule) => flatMap(fromEffect(Effect.zip(effect, Schedule.driver(schedule))), ([a, driver]) => concat(succeed(a), unfoldEffect(a, s => Effect.matchEffect(driver.next(s), {
  onFailure: Effect.succeed,
  onSuccess: () => Effect.map(effect, nextA => Option.some([nextA, nextA]))
}))));
/** @internal */
export const retry = /*#__PURE__*/dual(2, (self, schedule) => unwrap(Effect.map(Schedule.driver(schedule), driver => {
  const loop = catchAll(self, error => unwrap(Effect.matchEffect(driver.next(error), {
    onFailure: () => Effect.fail(error),
    onSuccess: () => Effect.succeed(pipe(loop, tap(() => driver.reset())))
  })));
  return loop;
})));
/** @internal */
export const run = /*#__PURE__*/dual(2, (self, sink) => pipe(toChannel(self), channel.pipeToOrFail(_sink.toChannel(sink)), channel.runDrain));
/** @internal */
export const runCollect = self => pipe(self, run(_sink.collectAll()));
/** @internal */
export const runCount = self => pipe(self, run(_sink.count));
/** @internal */
export const runDrain = self => pipe(self, run(_sink.drain));
/** @internal */
export const runFold = /*#__PURE__*/dual(3, (self, s, f) => pipe(self, runFoldWhileScoped(s, constTrue, f), Effect.scoped));
/** @internal */
export const runFoldEffect = /*#__PURE__*/dual(3, (self, s, f) => pipe(self, runFoldWhileScopedEffect(s, constTrue, f), Effect.scoped));
/** @internal */
export const runFoldScoped = /*#__PURE__*/dual(3, (self, s, f) => pipe(self, runFoldWhileScoped(s, constTrue, f)));
/** @internal */
export const runFoldScopedEffect = /*#__PURE__*/dual(3, (self, s, f) => pipe(self, runFoldWhileScopedEffect(s, constTrue, f)));
/** @internal */
export const runFoldWhile = /*#__PURE__*/dual(4, (self, s, cont, f) => pipe(self, runFoldWhileScoped(s, cont, f), Effect.scoped));
/** @internal */
export const runFoldWhileEffect = /*#__PURE__*/dual(4, (self, s, cont, f) => pipe(self, runFoldWhileScopedEffect(s, cont, f), Effect.scoped));
/** @internal */
export const runFoldWhileScoped = /*#__PURE__*/dual(4, (self, s, cont, f) => pipe(self, runScoped(_sink.fold(s, cont, f))));
/** @internal */
export const runFoldWhileScopedEffect = /*#__PURE__*/dual(4, (self, s, cont, f) => pipe(self, runScoped(_sink.foldEffect(s, cont, f))));
/** @internal */
export const runForEach = /*#__PURE__*/dual(2, (self, f) => pipe(self, run(_sink.forEach(f))));
/** @internal */
export const runForEachChunk = /*#__PURE__*/dual(2, (self, f) => pipe(self, run(_sink.forEachChunk(f))));
/** @internal */
export const runForEachChunkScoped = /*#__PURE__*/dual(2, (self, f) => pipe(self, runScoped(_sink.forEachChunk(f))));
/** @internal */
export const runForEachScoped = /*#__PURE__*/dual(2, (self, f) => pipe(self, runScoped(_sink.forEach(f))));
/** @internal */
export const runForEachWhile = /*#__PURE__*/dual(2, (self, f) => pipe(self, run(_sink.forEachWhile(f))));
/** @internal */
export const runForEachWhileScoped = /*#__PURE__*/dual(2, (self, f) => pipe(self, runScoped(_sink.forEachWhile(f))));
/** @internal */
export const runHead = self => pipe(self, run(_sink.head()));
/** @internal */
export const runIntoPubSub = /*#__PURE__*/dual(2, (self, pubsub) => pipe(self, runIntoQueue(pubsub)));
/** @internal */
export const runIntoPubSubScoped = /*#__PURE__*/dual(2, (self, pubsub) => pipe(self, runIntoQueueScoped(pubsub)));
/** @internal */
export const runIntoQueue = /*#__PURE__*/dual(2, (self, queue) => pipe(self, runIntoQueueScoped(queue), Effect.scoped));
/** @internal */
export const runIntoQueueElementsScoped = /*#__PURE__*/dual(2, (self, queue) => {
  const writer = core.readWithCause({
    onInput: input => core.flatMap(core.fromEffect(Queue.offerAll(queue, Chunk.map(input, Exit.succeed))), () => writer),
    onFailure: cause => core.fromEffect(Queue.offer(queue, Exit.failCause(Cause.map(cause, Option.some)))),
    onDone: () => core.fromEffect(Queue.offer(queue, Exit.fail(Option.none())))
  });
  return pipe(core.pipeTo(toChannel(self), writer), channel.drain, channelExecutor.runScoped, Effect.asUnit);
});
/** @internal */
export const runIntoQueueScoped = /*#__PURE__*/dual(2, (self, queue) => {
  const writer = core.readWithCause({
    onInput: input => core.flatMap(core.write(_take.chunk(input)), () => writer),
    onFailure: cause => core.write(_take.failCause(cause)),
    onDone: () => core.write(_take.end)
  });
  return pipe(core.pipeTo(toChannel(self), writer), channel.mapOutEffect(take => Queue.offer(queue, take)), channel.drain, channelExecutor.runScoped, Effect.asUnit);
});
/** @internal */
export const runLast = self => pipe(self, run(_sink.last()));
/** @internal */
export const runScoped = /*#__PURE__*/dual(2, (self, sink) => pipe(toChannel(self), channel.pipeToOrFail(_sink.toChannel(sink)), channel.drain, channelExecutor.runScoped));
/** @internal */
export const runSum = self => pipe(self, run(_sink.sum));
/** @internal */
export const scan = /*#__PURE__*/dual(3, (self, s, f) => pipe(self, scanEffect(s, (s, a) => Effect.succeed(f(s, a)))));
/** @internal */
export const scanReduce = /*#__PURE__*/dual(2, (self, f) => pipe(self, scanReduceEffect((a2, a) => Effect.succeed(f(a2, a)))));
/** @internal */
export const scanReduceEffect = /*#__PURE__*/dual(2, (self, f) => pipe(self, mapAccumEffect(Option.none(), (option, a) => {
  switch (option._tag) {
    case "None":
      {
        return Effect.succeed([Option.some(a), a]);
      }
    case "Some":
      {
        return pipe(f(option.value, a), Effect.map(b => [Option.some(b), b]));
      }
  }
})));
/** @internal */
export const schedule = /*#__PURE__*/dual(2, (self, schedule) => filterMap(scheduleWith(self, schedule, {
  onElement: Option.some,
  onSchedule: Option.none
}), identity));
/** @internal */
export const scheduleWith = /*#__PURE__*/dual(3, (self, schedule, options) => {
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
      onFailure: () => pipe(driver.last(), Effect.orDie, Effect.map(b => pipe(core.write(Chunk.make(options.onElement(next.value), options.onSchedule(b))), core.flatMap(() => loop(driver, iterator)))), Effect.zipLeft(driver.reset())),
      onSuccess: () => Effect.succeed(pipe(core.write(Chunk.of(options.onElement(next.value))), core.flatMap(() => loop(driver, iterator))))
    }));
  };
  return new StreamImpl(pipe(core.fromEffect(Schedule.driver(schedule)), core.flatMap(driver => pipe(toChannel(self), core.pipeTo(loop(driver, Chunk.empty()[Symbol.iterator]()))))));
});
/** @internal */
export const scanEffect = /*#__PURE__*/dual(3, (self, s, f) => new StreamImpl(pipe(core.write(Chunk.of(s)), core.flatMap(() => toChannel(pipe(self, mapAccumEffect(s, (s, a) => pipe(f(s, a), Effect.map(s => [s, s])))))))));
/** @internal */
export const scoped = effect => new StreamImpl(channel.ensuring(channel.scoped(pipe(effect, Effect.map(Chunk.of))), Effect.unit));
/** @internal */
export const some = self => pipe(self, mapError(Option.some), someOrFail(() => Option.none()));
/** @internal */
export const someOrElse = /*#__PURE__*/dual(2, (self, fallback) => pipe(self, map(Option.getOrElse(fallback))));
/** @internal */
export const someOrFail = /*#__PURE__*/dual(2, (self, error) => mapEffectSequential(self, Option.match({
  onNone: () => Effect.failSync(error),
  onSome: Effect.succeed
})));
/** @internal */
export const sliding = /*#__PURE__*/dual(2, (self, chunkSize) => slidingSize(self, chunkSize, 1));
/** @internal */
export const slidingSize = /*#__PURE__*/dual(3, (self, chunkSize, stepSize) => {
  if (chunkSize <= 0 || stepSize <= 0) {
    return die(Cause.IllegalArgumentException("Invalid bounds - `chunkSize` and `stepSize` must be greater than zero"));
  }
  return new StreamImpl(core.suspend(() => {
    const queue = new RingBuffer(chunkSize);
    const emitOnStreamEnd = (queueSize, channelEnd) => {
      if (queueSize < chunkSize) {
        const items = queue.toChunk();
        const result = Chunk.isEmpty(items) ? Chunk.empty() : Chunk.of(items);
        return pipe(core.write(result), core.flatMap(() => channelEnd));
      }
      const lastEmitIndex = queueSize - (queueSize - chunkSize) % stepSize;
      if (lastEmitIndex === queueSize) {
        return channelEnd;
      }
      const leftovers = queueSize - (lastEmitIndex - chunkSize + stepSize);
      const lastItems = pipe(queue.toChunk(), Chunk.takeRight(leftovers));
      const result = Chunk.isEmpty(lastItems) ? Chunk.empty() : Chunk.of(lastItems);
      return pipe(core.write(result), core.flatMap(() => channelEnd));
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
    return pipe(toChannel(self), core.pipeTo(reader(0)));
  }));
});
/** @internal */
export const split = /*#__PURE__*/dual(2, (self, predicate) => {
  const split = (leftovers, input) => {
    const [chunk, remaining] = pipe(leftovers, Chunk.appendAll(input), Chunk.splitWhere(predicate));
    if (Chunk.isEmpty(chunk) || Chunk.isEmpty(remaining)) {
      return loop(pipe(chunk, Chunk.appendAll(pipe(remaining, Chunk.drop(1)))));
    }
    return pipe(core.write(Chunk.of(chunk)), core.flatMap(() => split(Chunk.empty(), pipe(remaining, Chunk.drop(1)))));
  };
  const loop = leftovers => core.readWith({
    onInput: input => split(leftovers, input),
    onFailure: core.fail,
    onDone: () => {
      if (Chunk.isEmpty(leftovers)) {
        return core.unit;
      }
      if (Option.isNone(pipe(leftovers, Chunk.findFirst(predicate)))) {
        return channel.zipRight(core.write(Chunk.of(leftovers)), core.unit);
      }
      return channel.zipRight(split(Chunk.empty(), leftovers), core.unit);
    }
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(loop(Chunk.empty()))));
});
/** @internal */
export const splitOnChunk = /*#__PURE__*/dual(2, (self, delimiter) => {
  const next = (leftover, delimiterIndex) => core.readWithCause({
    onInput: inputChunk => {
      let buffer;
      const [carry, delimiterCursor] = pipe(inputChunk, Chunk.reduce([pipe(leftover, Option.getOrElse(() => Chunk.empty())), delimiterIndex], ([carry, delimiterCursor], a) => {
        const concatenated = pipe(carry, Chunk.append(a));
        if (delimiterCursor < delimiter.length && Equal.equals(a, pipe(delimiter, Chunk.unsafeGet(delimiterCursor)))) {
          if (delimiterCursor + 1 === delimiter.length) {
            if (buffer === undefined) {
              buffer = [];
            }
            buffer.push(pipe(concatenated, Chunk.take(concatenated.length - delimiter.length)));
            return [Chunk.empty(), 0];
          }
          return [concatenated, delimiterCursor + 1];
        }
        return [concatenated, Equal.equals(a, pipe(delimiter, Chunk.unsafeGet(0))) ? 1 : 0];
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
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(next(Option.none(), 0))));
});
/** @internal */
export const splitLines = self => suspend(() => {
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
  return new StreamImpl(core.pipeTo(toChannel(self), loop));
});
/** @internal */
export const succeed = value => fromChunk(Chunk.of(value));
/** @internal */
export const sync = evaluate => suspend(() => fromChunk(Chunk.of(evaluate())));
/** @internal */
export const suspend = stream => new StreamImpl(core.suspend(() => toChannel(stream())));
/** @internal */
export const take = /*#__PURE__*/dual(2, (self, n) => {
  if (!Number.isInteger(n)) {
    return die(Cause.IllegalArgumentException(`${n} must be an integer`));
  }
  const loop = n => core.readWith({
    onInput: input => {
      const taken = pipe(input, Chunk.take(Math.min(n, Number.POSITIVE_INFINITY)));
      const leftover = Math.max(0, n - taken.length);
      const more = leftover > 0;
      if (more) {
        return pipe(core.write(taken), core.flatMap(() => loop(leftover)));
      }
      return core.write(taken);
    },
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(0 < n ? loop(n) : core.unit)));
});
/** @internal */
export const takeRight = /*#__PURE__*/dual(2, (self, n) => {
  if (n <= 0) {
    return empty;
  }
  return new StreamImpl(pipe(Effect.succeed(new RingBuffer(n)), Effect.map(queue => {
    const reader = core.readWith({
      onInput: input => {
        for (const element of input) {
          queue.put(element);
        }
        return reader;
      },
      onFailure: core.fail,
      onDone: () => pipe(core.write(queue.toChunk()), channel.zipRight(core.unit))
    });
    return pipe(toChannel(self), core.pipeTo(reader));
  }), channel.unwrap));
});
/** @internal */
export const takeUntil = /*#__PURE__*/dual(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => {
      const taken = pipe(input, Chunk.takeWhile(a => !predicate(a)));
      const last = pipe(input, Chunk.drop(taken.length), Chunk.take(1));
      if (Chunk.isEmpty(last)) {
        return pipe(core.write(taken), core.flatMap(() => loop));
      }
      return core.write(pipe(taken, Chunk.appendAll(last)));
    },
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(loop)));
});
/** @internal */
export const takeUntilEffect = /*#__PURE__*/dual(2, (self, predicate) => {
  const loop = iterator => {
    const next = iterator.next();
    if (next.done) {
      return core.readWithCause({
        onInput: elem => loop(elem[Symbol.iterator]()),
        onFailure: core.failCause,
        onDone: core.succeed
      });
    }
    return pipe(predicate(next.value), Effect.map(bool => bool ? core.write(Chunk.of(next.value)) : pipe(core.write(Chunk.of(next.value)), core.flatMap(() => loop(iterator)))), channel.unwrap);
  };
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(loop(Chunk.empty()[Symbol.iterator]()))));
});
/** @internal */
export const takeWhile = /*#__PURE__*/dual(2, (self, predicate) => {
  const loop = core.readWith({
    onInput: input => {
      const taken = pipe(input, Chunk.takeWhile(predicate));
      const more = taken.length === input.length;
      if (more) {
        return pipe(core.write(taken), core.flatMap(() => loop));
      }
      return core.write(taken);
    },
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(loop)));
});
/** @internal */
export const tap = /*#__PURE__*/dual(2, (self, f) => mapEffectSequential(self, a => Effect.as(f(a), a)));
/** @internal */
export const tapBoth = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => pipe(self, tapError(onFailure), tap(onSuccess)));
/** @internal */
export const tapError = /*#__PURE__*/dual(2, (self, f) => catchAll(self, error => fromEffect(Effect.zipRight(f(error), Effect.fail(error)))));
/** @internal */
export const tapErrorCause = /*#__PURE__*/dual(2, (self, f) => {
  const loop = core.readWithCause({
    onInput: chunk => core.flatMap(core.write(chunk), () => loop),
    onFailure: cause => core.fromEffect(Effect.zipRight(f(cause), Effect.failCause(cause))),
    onDone: core.succeedNow
  });
  return new StreamImpl(pipe(toChannel(self), core.pipeTo(loop)));
});
/** @internal */
export const tapSink = /*#__PURE__*/dual(2, (self, sink) => pipe(fromEffect(Effect.all([Queue.bounded(1), Deferred.make()])), flatMap(([queue, deferred]) => {
  const right = flattenTake(fromQueue(queue, {
    maxChunkSize: 1
  }));
  const loop = core.readWithCause({
    onInput: chunk => pipe(core.fromEffect(Queue.offer(queue, _take.chunk(chunk))), core.foldCauseChannel({
      onFailure: () => core.flatMap(core.write(chunk), () => channel.identityChannel()),
      onSuccess: () => core.flatMap(core.write(chunk), () => loop)
    })),
    onFailure: cause => pipe(core.fromEffect(Queue.offer(queue, _take.failCause(cause))), core.foldCauseChannel({
      onFailure: () => core.failCause(cause),
      onSuccess: () => core.failCause(cause)
    })),
    onDone: () => pipe(core.fromEffect(Queue.offer(queue, _take.end)), core.foldCauseChannel({
      onFailure: () => core.unit,
      onSuccess: () => core.unit
    }))
  });
  return pipe(new StreamImpl(pipe(core.pipeTo(toChannel(self), loop), channel.ensuring(Effect.zipRight(Effect.forkDaemon(Queue.offer(queue, _take.end)), Deferred.await(deferred))))), merge(execute(pipe(run(right, sink), Effect.ensuring(Effect.zipRight(Queue.shutdown(queue), Deferred.succeed(deferred, void 0)))))));
})));
/** @internal */
export const throttle = /*#__PURE__*/dual(2, (self, options) => throttleEffect(self, {
  ...options,
  cost: chunk => Effect.succeed(options.cost(chunk))
}));
/** @internal */
export const throttleEffect = /*#__PURE__*/dual(2, (self, options) => {
  if (options.strategy === "enforce") {
    return throttleEnforceEffect(self, options.cost, options.units, options.duration, options.burst ?? 0);
  }
  return throttleShapeEffect(self, options.cost, options.units, options.duration, options.burst ?? 0);
});
const throttleEnforceEffect = (self, cost, units, duration, burst) => {
  const loop = (tokens, timestampMillis) => core.readWithCause({
    onInput: input => pipe(cost(input), Effect.zip(Clock.currentTimeMillis), Effect.map(([weight, currentTimeMillis]) => {
      const elapsed = currentTimeMillis - timestampMillis;
      const cycles = elapsed / Duration.toMillis(duration);
      const sum = tokens + cycles * units;
      const max = units + burst < 0 ? Number.POSITIVE_INFINITY : units + burst;
      const available = sum < 0 ? max : Math.min(sum, max);
      if (weight <= available) {
        return pipe(core.write(input), core.flatMap(() => loop(available - weight, currentTimeMillis)));
      }
      return loop(tokens, timestampMillis);
    }), channel.unwrap),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  const throttled = pipe(Clock.currentTimeMillis, Effect.map(currentTimeMillis => loop(units, currentTimeMillis)), channel.unwrap);
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(throttled)));
};
const throttleShapeEffect = (self, costFn, units, duration, burst) => {
  const loop = (tokens, timestampMillis) => core.readWithCause({
    onInput: input => pipe(costFn(input), Effect.zip(Clock.currentTimeMillis), Effect.map(([weight, currentTimeMillis]) => {
      const elapsed = currentTimeMillis - timestampMillis;
      const cycles = elapsed / Duration.toMillis(duration);
      const sum = tokens + cycles * units;
      const max = units + burst < 0 ? Number.POSITIVE_INFINITY : units + burst;
      const available = sum < 0 ? max : Math.min(sum, max);
      const remaining = available - weight;
      const waitCycles = remaining >= 0 ? 0 : -remaining / units;
      const delay = Duration.millis(Math.max(0, waitCycles * Duration.toMillis(duration)));
      if (Duration.greaterThan(delay, Duration.zero)) {
        return pipe(core.fromEffect(Clock.sleep(delay)), channel.zipRight(core.write(input)), core.flatMap(() => loop(remaining, currentTimeMillis)));
      }
      return core.flatMap(core.write(input), () => loop(remaining, currentTimeMillis));
    }), channel.unwrap),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  const throttled = pipe(Clock.currentTimeMillis, Effect.map(currentTimeMillis => loop(units, currentTimeMillis)), channel.unwrap);
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(throttled)));
};
/** @internal */
export const tick = interval => repeatWithSchedule(void 0, Schedule.spaced(interval));
/** @internal */
export const timeout = /*#__PURE__*/dual(2, (self, duration) => pipe(toPull(self), Effect.map(Effect.timeoutFail({
  onTimeout: () => Option.none(),
  duration
})), fromPull));
/** @internal */
export const timeoutFail = /*#__PURE__*/dual(3, (self, error, duration) => pipe(self, timeoutTo(duration, failSync(error))));
/** @internal */
export const timeoutFailCause = /*#__PURE__*/dual(3, (self, cause, duration) => pipe(toPull(self), Effect.map(Effect.timeoutFailCause({
  onTimeout: () => Cause.map(cause(), Option.some),
  duration
})), fromPull));
/** @internal */
export const timeoutTo = /*#__PURE__*/dual(3, (self, duration, that) => {
  const StreamTimeout = Cause.RuntimeException("Stream Timeout");
  return pipe(self, timeoutFailCause(() => Cause.die(StreamTimeout), duration), catchSomeCause(cause => Cause.isDieType(cause) && Cause.isRuntimeException(cause.defect) && cause.defect.message !== undefined && cause.defect.message === "Stream Timeout" ? Option.some(that) : Option.none()));
});
/** @internal */
export const toPubSub = /*#__PURE__*/dual(2, (self, capacity) => pipe(Effect.acquireRelease(PubSub.bounded(capacity), pubsub => PubSub.shutdown(pubsub)), Effect.tap(pubsub => pipe(self, runIntoPubSubScoped(pubsub), Effect.forkScoped))));
/** @internal */
export const toPull = self => Effect.map(channel.toPull(toChannel(self)), pull => pipe(pull, Effect.mapError(Option.some), Effect.flatMap(Either.match({
  onLeft: () => Effect.fail(Option.none()),
  onRight: Effect.succeed
}))));
/** @internal */
export const toQueue = /*#__PURE__*/dual(args => isStream(args[0]), (self, options) => Effect.tap(Effect.acquireRelease(options?.strategy === "unbounded" ? Queue.unbounded() : options?.strategy === "dropping" ? Queue.dropping(options.capacity ?? 2) : options?.strategy === "sliding" ? Queue.sliding(options.capacity ?? 2) : Queue.bounded(options?.capacity ?? 2), queue => Queue.shutdown(queue)), queue => Effect.forkScoped(runIntoQueueScoped(self, queue))));
/** @internal */
export const toQueueOfElements = /*#__PURE__*/dual(args => isStream(args[0]), (self, options) => Effect.tap(Effect.acquireRelease(Queue.bounded(options?.capacity ?? 2), queue => Queue.shutdown(queue)), queue => Effect.forkScoped(runIntoQueueElementsScoped(self, queue))));
/** @internal */
export const toReadableStream = source => {
  let pull;
  let scope;
  return new ReadableStream({
    start(controller) {
      scope = Effect.runSync(Scope.make());
      pull = pipe(toPull(source), Scope.use(scope), Effect.runSync, Effect.tap(chunk => Effect.sync(() => {
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
/** @internal */
export const transduce = /*#__PURE__*/dual(2, (self, sink) => {
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
          onInput: input => pipe(core.write(input), core.flatMap(() => buffer)),
          onFailure: core.fail,
          onDone: core.succeedNow
        });
      }
      leftovers.ref = Chunk.empty();
      return pipe(channel.writeChunk(leftover), core.flatMap(() => buffer));
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
    const transducer = pipe(sink, _sink.toChannel, core.collectElements, core.flatMap(([leftover, z]) => pipe(core.succeed([upstreamDone.ref, concatAndGet(leftover)]), core.flatMap(([done, newLeftovers]) => {
      const nextChannel = done && Chunk.isEmpty(newLeftovers) ? core.unit : transducer;
      return pipe(core.write(Chunk.of(z)), core.flatMap(() => nextChannel));
    }))));
    return pipe(toChannel(self), core.pipeTo(upstreamMarker), core.pipeTo(buffer), channel.pipeToOrFail(transducer));
  });
  return new StreamImpl(newChannel);
});
/** @internal */
export const unfold = (s, f) => unfoldChunk(s, s => pipe(f(s), Option.map(([a, s]) => [Chunk.of(a), s])));
/** @internal */
export const unfoldChunk = (s, f) => {
  const loop = s => Option.match(f(s), {
    onNone: () => core.unit,
    onSome: ([chunk, s]) => core.flatMap(core.write(chunk), () => loop(s))
  });
  return new StreamImpl(core.suspend(() => loop(s)));
};
/** @internal */
export const unfoldChunkEffect = (s, f) => suspend(() => {
  const loop = s => channel.unwrap(Effect.map(f(s), Option.match({
    onNone: () => core.unit,
    onSome: ([chunk, s]) => core.flatMap(core.write(chunk), () => loop(s))
  })));
  return new StreamImpl(loop(s));
});
/** @internal */
export const unfoldEffect = (s, f) => unfoldChunkEffect(s, s => pipe(f(s), Effect.map(Option.map(([a, s]) => [Chunk.of(a), s]))));
/** @internal */
export const unit = /*#__PURE__*/succeed(void 0);
/** @internal */
export const unwrap = effect => flatten(fromEffect(effect));
/** @internal */
export const unwrapScoped = effect => flatten(scoped(effect));
/** @internal */
export const updateService = /*#__PURE__*/dual(3, (self, tag, f) => pipe(self, mapInputContext(context => pipe(context, Context.add(tag, f(pipe(context, Context.unsafeGet(tag))))))));
/** @internal */
export const when = /*#__PURE__*/dual(2, (self, predicate) => pipe(self, whenEffect(Effect.sync(predicate))));
/** @internal */
export const whenCase = (evaluate, pf) => whenCaseEffect(pf)(Effect.sync(evaluate));
/** @internal */
export const whenCaseEffect = /*#__PURE__*/dual(2, (self, pf) => pipe(fromEffect(self), flatMap(a => pipe(pf(a), Option.getOrElse(() => empty)))));
/** @internal */
export const whenEffect = /*#__PURE__*/dual(2, (self, effect) => pipe(fromEffect(effect), flatMap(bool => bool ? self : empty)));
/** @internal */
export const withSpan = /*#__PURE__*/dual(3, (self, name, options) => new StreamImpl(channel.withSpan(toChannel(self), name, options)));
/** @internal */
export const zip = /*#__PURE__*/dual(2, (self, that) => pipe(self, zipWith(that, (a, a2) => [a, a2])));
/** @internal */
export const zipFlatten = /*#__PURE__*/dual(2, (self, that) => pipe(self, zipWith(that, (a, a2) => [...a, a2])));
/** @internal */
export const zipAll = /*#__PURE__*/dual(2, (self, options) => zipAllWith(self, {
  other: options.other,
  onSelf: a => [a, options.defaultOther],
  onOther: a2 => [options.defaultSelf, a2],
  onBoth: (a, a2) => [a, a2]
}));
/** @internal */
export const zipAllLeft = /*#__PURE__*/dual(3, (self, other, defaultSelf) => zipAllWith(self, {
  other,
  onSelf: identity,
  onOther: () => defaultSelf,
  onBoth: a => a
}));
/** @internal */
export const zipAllRight = /*#__PURE__*/dual(3, (self, other, defaultRight) => zipAllWith(self, {
  other,
  onSelf: () => defaultRight,
  onOther: identity,
  onBoth: (_, a2) => a2
}));
/** @internal */
export const zipAllSortedByKey = /*#__PURE__*/dual(2, (self, options) => zipAllSortedByKeyWith(self, {
  other: options.other,
  onSelf: a => [a, options.defaultOther],
  onOther: a2 => [options.defaultSelf, a2],
  onBoth: (a, a2) => [a, a2],
  order: options.order
}));
/** @internal */
export const zipAllSortedByKeyLeft = /*#__PURE__*/dual(2, (self, options) => zipAllSortedByKeyWith(self, {
  other: options.other,
  onSelf: identity,
  onOther: () => options.defaultSelf,
  onBoth: a => a,
  order: options.order
}));
/** @internal */
export const zipAllSortedByKeyRight = /*#__PURE__*/dual(2, (self, options) => zipAllSortedByKeyWith(self, {
  other: options.other,
  onSelf: () => options.defaultOther,
  onOther: identity,
  onBoth: (_, a2) => a2,
  order: options.order
}));
/** @internal */
export const zipAllSortedByKeyWith = /*#__PURE__*/dual(2, (self, options) => {
  const pull = (state, pullLeft, pullRight) => {
    switch (state._tag) {
      case ZipAllState.OP_DRAIN_LEFT:
        {
          return pipe(pullLeft, Effect.match({
            onFailure: Exit.fail,
            onSuccess: leftChunk => Exit.succeed([Chunk.map(leftChunk, ([k, a]) => [k, options.onSelf(a)]), ZipAllState.DrainLeft])
          }));
        }
      case ZipAllState.OP_DRAIN_RIGHT:
        {
          return pipe(pullRight, Effect.match({
            onFailure: Exit.fail,
            onSuccess: rightChunk => Exit.succeed([Chunk.map(rightChunk, ([k, a2]) => [k, options.onOther(a2)]), ZipAllState.DrainRight])
          }));
        }
      case ZipAllState.OP_PULL_BOTH:
        {
          return pipe(unsome(pullLeft), Effect.zip(unsome(pullRight), {
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
                return Effect.succeed(Exit.succeed([pipe(leftOption.value, Chunk.map(([k, a]) => [k, options.onSelf(a)])), ZipAllState.DrainLeft]));
              }
              if (Option.isNone(leftOption) && Option.isSome(rightOption)) {
                if (Chunk.isEmpty(rightOption.value)) {
                  return pull(ZipAllState.DrainRight, pullLeft, pullRight);
                }
                return Effect.succeed(Exit.succeed([pipe(rightOption.value, Chunk.map(([k, a2]) => [k, options.onOther(a2)])), ZipAllState.DrainRight]));
              }
              return Effect.succeed(Exit.fail(Option.none()));
            }
          }));
        }
      case ZipAllState.OP_PULL_LEFT:
        {
          return Effect.matchEffect(pullLeft, {
            onFailure: Option.match({
              onNone: () => Effect.succeed(Exit.succeed([pipe(state.rightChunk, Chunk.map(([k, a2]) => [k, options.onOther(a2)])), ZipAllState.DrainRight])),
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
    let leftTuple = pipe(leftChunk, Chunk.unsafeGet(leftIndex));
    let rightTuple = pipe(rightChunk, Chunk.unsafeGet(rightIndex));
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
          leftTuple = pipe(leftChunk, Chunk.unsafeGet(leftIndex));
          rightTuple = pipe(rightChunk, Chunk.unsafeGet(rightIndex));
          k1 = leftTuple[0];
          a = leftTuple[1];
          k2 = rightTuple[0];
          a2 = rightTuple[1];
        } else if (hasNext(leftChunk, leftIndex)) {
          state = ZipAllState.PullRight(pipe(leftChunk, Chunk.drop(leftIndex + 1)));
          loop = false;
        } else if (hasNext(rightChunk, rightIndex)) {
          state = ZipAllState.PullLeft(pipe(rightChunk, Chunk.drop(rightIndex + 1)));
          loop = false;
        } else {
          state = ZipAllState.PullBoth;
          loop = false;
        }
      } else if (compare < 0) {
        builder.push([k1, options.onSelf(a)]);
        if (hasNext(leftChunk, leftIndex)) {
          leftIndex = leftIndex + 1;
          leftTuple = pipe(leftChunk, Chunk.unsafeGet(leftIndex));
          k1 = leftTuple[0];
          a = leftTuple[1];
        } else {
          const rightBuilder = [];
          rightBuilder.push(rightTuple);
          while (hasNext(rightChunk, rightIndex)) {
            rightIndex = rightIndex + 1;
            rightTuple = pipe(rightChunk, Chunk.unsafeGet(rightIndex));
            rightBuilder.push(rightTuple);
          }
          state = ZipAllState.PullLeft(Chunk.unsafeFromArray(rightBuilder));
          loop = false;
        }
      } else {
        builder.push([k2, options.onOther(a2)]);
        if (hasNext(rightChunk, rightIndex)) {
          rightIndex = rightIndex + 1;
          rightTuple = pipe(rightChunk, Chunk.unsafeGet(rightIndex));
          k2 = rightTuple[0];
          a2 = rightTuple[1];
        } else {
          const leftBuilder = [];
          leftBuilder.push(leftTuple);
          while (hasNext(leftChunk, leftIndex)) {
            leftIndex = leftIndex + 1;
            leftTuple = pipe(leftChunk, Chunk.unsafeGet(leftIndex));
            leftBuilder.push(leftTuple);
          }
          state = ZipAllState.PullRight(Chunk.unsafeFromArray(leftBuilder));
          loop = false;
        }
      }
    }
    return [Chunk.unsafeFromArray(builder), state];
  };
  return combineChunks(self, options.other, ZipAllState.PullBoth, pull);
});
/** @internal */
export const zipAllWith = /*#__PURE__*/dual(2, (self, options) => {
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
          return pipe(unsome(pullLeft), Effect.zip(unsome(pullRight), {
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
  return combineChunks(self, options.other, ZipAllState.PullBoth, pull);
});
/** @internal */
export const zipLatest = /*#__PURE__*/dual(2, (self, that) => pipe(self, zipLatestWith(that, (a, a2) => [a, a2])));
/** @internal */
export const zipLatestWith = /*#__PURE__*/dual(3, (self, that, f) => {
  const pullNonEmpty = pull => pipe(pull, Effect.flatMap(chunk => Chunk.isEmpty(chunk) ? pullNonEmpty(pull) : Effect.succeed(chunk)));
  return pipe(toPull(self), Effect.map(pullNonEmpty), Effect.zip(pipe(toPull(that), Effect.map(pullNonEmpty))), Effect.flatMap(([left, right]) => pipe(fromEffectOption(Effect.raceWith(left, right, {
    onSelfDone: (leftDone, rightFiber) => pipe(Effect.suspend(() => leftDone), Effect.zipWith(Fiber.join(rightFiber), (l, r) => [l, r, true])),
    onOtherDone: (rightDone, leftFiber) => pipe(Effect.suspend(() => rightDone), Effect.zipWith(Fiber.join(leftFiber), (l, r) => [r, l, false]))
  })), flatMap(([l, r, leftFirst]) => pipe(fromEffect(Ref.make([Chunk.unsafeLast(l), Chunk.unsafeLast(r)])), flatMap(latest => pipe(fromChunk(leftFirst ? pipe(r, Chunk.map(a2 => f(Chunk.unsafeLast(l), a2))) : pipe(l, Chunk.map(a => f(a, Chunk.unsafeLast(r))))), concat(pipe(repeatEffectOption(left), mergeEither(repeatEffectOption(right)), mapEffectSequential(Either.match({
    onLeft: leftChunk => pipe(Ref.modify(latest, ([_, rightLatest]) => [pipe(leftChunk, Chunk.map(a => f(a, rightLatest))), [Chunk.unsafeLast(leftChunk), rightLatest]])),
    onRight: rightChunk => pipe(Ref.modify(latest, ([leftLatest, _]) => [pipe(rightChunk, Chunk.map(a2 => f(leftLatest, a2))), [leftLatest, Chunk.unsafeLast(rightChunk)]]))
  })), flatMap(fromChunk))))))), toPull)), fromPull);
});
/** @internal */
export const zipLeft = /*#__PURE__*/dual(2, (self, that) => pipe(self, zipWithChunks(that, (left, right) => {
  if (left.length > right.length) {
    return [pipe(left, Chunk.take(right.length)), Either.left(pipe(left, Chunk.take(right.length)))];
  }
  return [left, Either.right(pipe(right, Chunk.drop(left.length)))];
})));
/** @internal */
export const zipRight = /*#__PURE__*/dual(2, (self, that) => pipe(self, zipWithChunks(that, (left, right) => {
  if (left.length > right.length) {
    return [right, Either.left(pipe(left, Chunk.take(right.length)))];
  }
  return [pipe(right, Chunk.take(left.length)), Either.right(pipe(right, Chunk.drop(left.length)))];
})));
/** @internal */
export const zipWith = /*#__PURE__*/dual(3, (self, that, f) => pipe(self, zipWithChunks(that, (leftChunk, rightChunk) => zipChunks(leftChunk, rightChunk, f))));
/** @internal */
export const zipWithChunks = /*#__PURE__*/dual(3, (self, that, f) => {
  const pull = (state, pullLeft, pullRight) => {
    switch (state._tag) {
      case ZipChunksState.OP_PULL_BOTH:
        {
          return pipe(unsome(pullLeft), Effect.zip(unsome(pullRight), {
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
  return pipe(self, combineChunks(that, ZipChunksState.PullBoth, pull));
});
/** @internal */
export const zipWithIndex = self => pipe(self, mapAccum(0, (index, a) => [index + 1, [a, index]]));
/** @internal */
export const zipWithNext = self => {
  const process = last => core.readWithCause({
    onInput: input => {
      const [newLast, chunk] = Chunk.mapAccum(input, last, (prev, curr) => [Option.some(curr), pipe(prev, Option.map(a => [a, curr]))]);
      const output = Chunk.filterMap(chunk, option => Option.isSome(option) ? Option.some([option.value[0], Option.some(option.value[1])]) : Option.none());
      return core.flatMap(core.write(output), () => process(newLast));
    },
    onFailure: core.failCause,
    onDone: () => Option.match(last, {
      onNone: () => core.unit,
      onSome: value => channel.zipRight(core.write(Chunk.of([value, Option.none()])), core.unit)
    })
  });
  return new StreamImpl(pipe(toChannel(self), channel.pipeToOrFail(process(Option.none()))));
};
/** @internal */
export const zipWithPrevious = self => pipe(self, mapAccum(Option.none(), (prev, curr) => [Option.some(curr), [prev, curr]]));
/** @internal */
export const zipWithPreviousAndNext = self => pipe(zipWithNext(zipWithPrevious(self)), map(([[prev, curr], next]) => [prev, curr, pipe(next, Option.map(tuple => tuple[1]))]));
/** @internal */
const zipChunks = (left, right, f) => {
  if (left.length > right.length) {
    return [pipe(left, Chunk.take(right.length), Chunk.zipWith(right, f)), Either.left(pipe(left, Chunk.drop(right.length)))];
  }
  return [pipe(left, Chunk.zipWith(pipe(right, Chunk.take(left.length)), f)), Either.right(pipe(right, Chunk.drop(left.length)))];
};
// Do notation
/** @internal */
export const Do = /*#__PURE__*/succeed({});
/** @internal */
export const bind = /*#__PURE__*/dual(args => typeof args[0] !== "string", (self, tag, f, options) => flatMap(self, k => map(f(k), a => ({
  ...k,
  [tag]: a
})), options));
/* @internal */
export const bindTo = /*#__PURE__*/dual(2, (self, tag) => map(self, a => ({
  [tag]: a
})));
/* @internal */
export const let_ = /*#__PURE__*/dual(3, (self, tag, f) => map(self, k => ({
  ...k,
  [tag]: f(k)
})));
// Circular with Channel
/** @internal */
export const channelToStream = self => {
  return new StreamImpl(self);
};
// =============================================================================
// encoding
// =============================================================================
/** @internal */
export const decodeText = /*#__PURE__*/dual(args => isStream(args[0]), (self, encoding = "utf-8") => suspend(() => {
  const decoder = new TextDecoder(encoding);
  return map(self, s => decoder.decode(s));
}));
/** @internal */
export const encodeText = self => suspend(() => {
  const encoder = new TextEncoder();
  return map(self, s => encoder.encode(s));
});
//# sourceMappingURL=stream.js.map