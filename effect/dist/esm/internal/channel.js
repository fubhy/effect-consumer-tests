import * as Cause from "../Cause.js";
import * as Chunk from "../Chunk.js";
import * as Context from "../Context.js";
import * as Deferred from "../Deferred.js";
import * as Effect from "../Effect.js";
import * as Either from "../Either.js";
import * as Equal from "../Equal.js";
import * as Exit from "../Exit.js";
import * as Fiber from "../Fiber.js";
import { constVoid, dual, identity, pipe } from "../Function.js";
import * as Layer from "../Layer.js";
import * as Option from "../Option.js";
import { hasProperty } from "../Predicate.js";
import * as PubSub from "../PubSub.js";
import * as Queue from "../Queue.js";
import * as Ref from "../Ref.js";
import * as Scope from "../Scope.js";
import * as executor from "./channel/channelExecutor.js";
import * as mergeDecision from "./channel/mergeDecision.js";
import * as mergeState from "./channel/mergeState.js";
import * as _mergeStrategy from "./channel/mergeStrategy.js";
import * as singleProducerAsyncInput from "./channel/singleProducerAsyncInput.js";
import * as core from "./core-stream.js";
import * as MergeDecisionOpCodes from "./opCodes/channelMergeDecision.js";
import * as MergeStateOpCodes from "./opCodes/channelMergeState.js";
import * as ChannelStateOpCodes from "./opCodes/channelState.js";
import * as tracer from "./tracer.js";
/** @internal */
export const acquireUseRelease = (acquire, use, release) => core.flatMap(core.fromEffect(Ref.make(() => Effect.unit)), ref => pipe(core.fromEffect(Effect.uninterruptible(Effect.tap(acquire, a => Ref.set(ref, exit => release(a, exit))))), core.flatMap(use), core.ensuringWith(exit => Effect.flatMap(Ref.get(ref), f => f(exit)))));
/** @internal */
export const as = /*#__PURE__*/dual(2, (self, value) => map(self, () => value));
/** @internal */
export const asUnit = self => map(self, constVoid);
/** @internal */
export const buffer = options => core.suspend(() => {
  const doBuffer = (empty, isEmpty, ref) => unwrap(Ref.modify(ref, inElem => isEmpty(inElem) ? [core.readWith({
    onInput: input => core.flatMap(core.write(input), () => doBuffer(empty, isEmpty, ref)),
    onFailure: error => core.fail(error),
    onDone: done => core.succeedNow(done)
  }), inElem] : [core.flatMap(core.write(inElem), () => doBuffer(empty, isEmpty, ref)), empty]));
  return doBuffer(options.empty, options.isEmpty, options.ref);
});
/** @internal */
export const bufferChunk = ref => buffer({
  empty: Chunk.empty(),
  isEmpty: Chunk.isEmpty,
  ref
});
/** @internal */
export const catchAll = /*#__PURE__*/dual(2, (self, f) => core.catchAllCause(self, cause => Either.match(Cause.failureOrCause(cause), {
  onLeft: f,
  onRight: core.failCause
})));
/** @internal */
export const concatMap = /*#__PURE__*/dual(2, (self, f) => core.concatMapWith(self, f, () => void 0, () => void 0));
/** @internal */
export const collect = /*#__PURE__*/dual(2, (self, pf) => {
  const collector = core.readWith({
    onInput: out => Option.match(pf(out), {
      onNone: () => collector,
      onSome: out2 => core.flatMap(core.write(out2), () => collector)
    }),
    onFailure: core.fail,
    onDone: core.succeedNow
  });
  return core.pipeTo(self, collector);
});
/** @internal */
export const concatOut = self => core.concatAll(self);
/** @internal */
export const mapInput = /*#__PURE__*/dual(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(inElem), () => reader),
    onFailure: core.fail,
    onDone: done => core.succeedNow(f(done))
  });
  return core.pipeTo(reader, self);
});
/** @internal */
export const mapInputEffect = /*#__PURE__*/dual(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(inElem), () => reader),
    onFailure: core.fail,
    onDone: done => core.fromEffect(f(done))
  });
  return core.pipeTo(reader, self);
});
/** @internal */
export const mapInputError = /*#__PURE__*/dual(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(inElem), () => reader),
    onFailure: error => core.fail(f(error)),
    onDone: core.succeedNow
  });
  return core.pipeTo(reader, self);
});
/** @internal */
export const mapInputErrorEffect = /*#__PURE__*/dual(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(inElem), () => reader),
    onFailure: error => core.fromEffect(f(error)),
    onDone: core.succeedNow
  });
  return core.pipeTo(reader, self);
});
/** @internal */
export const mapInputIn = /*#__PURE__*/dual(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(f(inElem)), () => reader),
    onFailure: core.fail,
    onDone: core.succeedNow
  });
  return core.pipeTo(reader, self);
});
export const mapInputInEffect = /*#__PURE__*/dual(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.flatMap(core.fromEffect(f(inElem)), core.write), () => reader),
    onFailure: core.fail,
    onDone: core.succeedNow
  });
  return core.pipeTo(reader, self);
});
/** @internal */
export const doneCollect = self => core.suspend(() => {
  const builder = [];
  return pipe(core.pipeTo(self, doneCollectReader(builder)), core.flatMap(outDone => core.succeed([Chunk.unsafeFromArray(builder), outDone])));
});
/** @internal */
const doneCollectReader = builder => {
  return core.readWith({
    onInput: outElem => core.flatMap(core.sync(() => {
      builder.push(outElem);
    }), () => doneCollectReader(builder)),
    onFailure: core.fail,
    onDone: core.succeed
  });
};
/** @internal */
export const drain = self => {
  const drainer = core.readWithCause({
    onInput: () => drainer,
    onFailure: core.failCause,
    onDone: core.succeed
  });
  return core.pipeTo(self, drainer);
};
/** @internal */
export const emitCollect = self => core.flatMap(doneCollect(self), core.write);
/** @internal */
export const ensuring = /*#__PURE__*/dual(2, (self, finalizer) => core.ensuringWith(self, () => finalizer));
/** @internal */
export const context = () => core.fromEffect(Effect.context());
/** @internal */
export const contextWith = f => map(context(), f);
/** @internal */
export const contextWithChannel = f => core.flatMap(context(), f);
/** @internal */
export const contextWithEffect = f => mapEffect(context(), f);
/** @internal */
export const flatten = self => core.flatMap(self, identity);
/** @internal */
export const foldChannel = /*#__PURE__*/dual(2, (self, options) => core.foldCauseChannel(self, {
  onFailure: cause => {
    const either = Cause.failureOrCause(cause);
    switch (either._tag) {
      case "Left":
        {
          return options.onFailure(either.left);
        }
      case "Right":
        {
          return core.failCause(either.right);
        }
    }
  },
  onSuccess: options.onSuccess
}));
/** @internal */
export const fromEither = either => core.suspend(() => Either.match(either, {
  onLeft: core.fail,
  onRight: core.succeed
}));
/** @internal */
export const fromInput = input => unwrap(input.takeWith(core.failCause, elem => core.flatMap(core.write(elem), () => fromInput(input)), core.succeed));
/** @internal */
export const fromPubSub = pubsub => unwrapScoped(Effect.map(PubSub.subscribe(pubsub), fromQueue));
/** @internal */
export const fromPubSubScoped = pubsub => Effect.map(PubSub.subscribe(pubsub), fromQueue);
/** @internal */
export const fromOption = option => core.suspend(() => Option.match(option, {
  onNone: () => core.fail(Option.none()),
  onSome: core.succeed
}));
/** @internal */
export const fromQueue = queue => core.suspend(() => fromQueueInternal(queue));
/** @internal */
const fromQueueInternal = queue => pipe(core.fromEffect(Queue.take(queue)), core.flatMap(Either.match({
  onLeft: Exit.match({
    onFailure: core.failCause,
    onSuccess: core.succeedNow
  }),
  onRight: elem => core.flatMap(core.write(elem), () => fromQueueInternal(queue))
})));
/** @internal */
export const identityChannel = () => core.readWith({
  onInput: input => core.flatMap(core.write(input), () => identityChannel()),
  onFailure: core.fail,
  onDone: core.succeedNow
});
/** @internal */
export const interruptWhen = /*#__PURE__*/dual(2, (self, effect) => mergeWith(self, {
  other: core.fromEffect(effect),
  onSelfDone: selfDone => mergeDecision.Done(Effect.suspend(() => selfDone)),
  onOtherDone: effectDone => mergeDecision.Done(Effect.suspend(() => effectDone))
}));
/** @internal */
export const interruptWhenDeferred = /*#__PURE__*/dual(2, (self, deferred) => interruptWhen(self, Deferred.await(deferred)));
/** @internal */
export const map = /*#__PURE__*/dual(2, (self, f) => core.flatMap(self, a => core.sync(() => f(a))));
/** @internal */
export const mapEffect = /*#__PURE__*/dual(2, (self, f) => core.flatMap(self, z => core.fromEffect(f(z))));
/** @internal */
export const mapError = /*#__PURE__*/dual(2, (self, f) => mapErrorCause(self, Cause.map(f)));
/** @internal */
export const mapErrorCause = /*#__PURE__*/dual(2, (self, f) => core.catchAllCause(self, cause => core.failCause(f(cause))));
/** @internal */
export const mapOut = /*#__PURE__*/dual(2, (self, f) => {
  const reader = core.readWith({
    onInput: outElem => core.flatMap(core.write(f(outElem)), () => reader),
    onFailure: core.fail,
    onDone: core.succeedNow
  });
  return core.pipeTo(self, reader);
});
/** @internal */
export const mapOutEffect = /*#__PURE__*/dual(2, (self, f) => {
  const reader = core.readWithCause({
    onInput: outElem => pipe(core.fromEffect(f(outElem)), core.flatMap(core.write), core.flatMap(() => reader)),
    onFailure: core.failCause,
    onDone: core.succeedNow
  });
  return core.pipeTo(self, reader);
});
/** @internal */
export const mapOutEffectPar = /*#__PURE__*/dual(3, (self, f, n) => pipe(Effect.gen(function* ($) {
  const queue = yield* $(Effect.acquireRelease(Queue.bounded(n), queue => Queue.shutdown(queue)));
  const errorSignal = yield* $(Deferred.make());
  const withPermits = n === Number.POSITIVE_INFINITY ? _ => identity : (yield* $(Effect.makeSemaphore(n))).withPermits;
  const pull = yield* $(toPull(self));
  yield* $(Effect.matchCauseEffect(pull, {
    onFailure: cause => Queue.offer(queue, Effect.failCause(cause)),
    onSuccess: either => Either.match(either, {
      onLeft: outDone => {
        const lock = withPermits(n);
        return Effect.zipRight(Effect.interruptible(lock(Effect.unit)), Effect.asUnit(Queue.offer(queue, Effect.succeed(Either.left(outDone)))));
      },
      onRight: outElem => Effect.gen(function* ($) {
        const deferred = yield* $(Deferred.make());
        const latch = yield* $(Deferred.make());
        yield* $(Effect.asUnit(Queue.offer(queue, Effect.map(Deferred.await(deferred), Either.right))));
        yield* $(Deferred.succeed(latch, void 0), Effect.zipRight(pipe(Effect.uninterruptibleMask(restore => pipe(Effect.exit(restore(Deferred.await(errorSignal))), Effect.raceFirst(Effect.exit(restore(f(outElem)))),
        // TODO: remove
        Effect.flatMap(exit => Effect.suspend(() => exit)))), Effect.tapErrorCause(cause => Deferred.failCause(errorSignal, cause)), Effect.intoDeferred(deferred))), withPermits(1), Effect.forkScoped);
        yield* $(Deferred.await(latch));
      })
    })
  }), Effect.forever, Effect.interruptible, Effect.forkScoped);
  return queue;
}), Effect.map(queue => {
  const consumer = unwrap(Effect.matchCause(Effect.flatten(Queue.take(queue)), {
    onFailure: core.failCause,
    onSuccess: Either.match({
      onLeft: core.succeedNow,
      onRight: outElem => core.flatMap(core.write(outElem), () => consumer)
    })
  }));
  return consumer;
}), unwrapScoped));
/** @internal */
export const mergeAll = options => {
  return channels => mergeAllWith(options)(channels, constVoid);
};
/** @internal */
export const mergeAllUnbounded = channels => mergeAllWith({
  concurrency: "unbounded"
})(channels, constVoid);
/** @internal */
export const mergeAllUnboundedWith = (channels, f) => mergeAllWith({
  concurrency: "unbounded"
})(channels, f);
/** @internal */
export const mergeAllWith = ({
  bufferSize = 16,
  concurrency,
  mergeStrategy = _mergeStrategy.BackPressure()
}) => (channels, f) => pipe(Effect.gen(function* ($) {
  const concurrencyN = concurrency === "unbounded" ? Number.MAX_SAFE_INTEGER : concurrency;
  const input = yield* $(singleProducerAsyncInput.make());
  const queueReader = fromInput(input);
  const queue = yield* $(Effect.acquireRelease(Queue.bounded(bufferSize), queue => Queue.shutdown(queue)));
  const cancelers = yield* $(Effect.acquireRelease(Queue.unbounded(), queue => Queue.shutdown(queue)));
  const lastDone = yield* $(Ref.make(Option.none()));
  const errorSignal = yield* $(Deferred.make());
  const withPermits = (yield* $(Effect.makeSemaphore(concurrencyN))).withPermits;
  const pull = yield* $(toPull(channels));
  const evaluatePull = pull => pipe(Effect.flatMap(pull, Either.match({
    onLeft: done => Effect.succeed(Option.some(done)),
    onRight: outElem => Effect.as(Queue.offer(queue, Effect.succeed(Either.right(outElem))), Option.none())
  })), Effect.repeatUntil(Option.isSome), Effect.flatMap(outDone => Ref.update(lastDone, Option.match({
    onNone: () => Option.some(outDone.value),
    onSome: lastDone => Option.some(f(lastDone, outDone.value))
  }))), Effect.catchAllCause(cause => Cause.isInterrupted(cause) ? Effect.failCause(cause) : pipe(Queue.offer(queue, Effect.failCause(cause)), Effect.zipRight(Deferred.succeed(errorSignal, void 0)), Effect.asUnit)));
  yield* $(Effect.matchCauseEffect(pull, {
    onFailure: cause => pipe(Queue.offer(queue, Effect.failCause(cause)), Effect.zipRight(Effect.succeed(false))),
    onSuccess: Either.match({
      onLeft: outDone => Effect.raceWith(Deferred.await(errorSignal), withPermits(concurrencyN)(Effect.unit), {
        onSelfDone: (_, permitAcquisition) => Effect.as(Fiber.interrupt(permitAcquisition), false),
        onOtherDone: (_, failureAwait) => Effect.zipRight(Fiber.interrupt(failureAwait), pipe(Ref.get(lastDone), Effect.flatMap(Option.match({
          onNone: () => Queue.offer(queue, Effect.succeed(Either.left(outDone))),
          onSome: lastDone => Queue.offer(queue, Effect.succeed(Either.left(f(lastDone, outDone))))
        })), Effect.as(false)))
      }),
      onRight: channel => _mergeStrategy.match(mergeStrategy, {
        onBackPressure: () => Effect.gen(function* ($) {
          const latch = yield* $(Deferred.make());
          const raceEffects = pipe(queueReader, core.pipeTo(channel), toPull, Effect.flatMap(pull => Effect.race(evaluatePull(pull), Deferred.await(errorSignal))), Effect.scoped);
          yield* $(Deferred.succeed(latch, void 0), Effect.zipRight(raceEffects), withPermits(1), Effect.forkScoped);
          yield* $(Deferred.await(latch));
          const errored = yield* $(Deferred.isDone(errorSignal));
          return !errored;
        }),
        onBufferSliding: () => Effect.gen(function* ($) {
          const canceler = yield* $(Deferred.make());
          const latch = yield* $(Deferred.make());
          const size = yield* $(Queue.size(cancelers));
          yield* $(Queue.take(cancelers), Effect.flatMap(_ => Deferred.succeed(_, void 0)), Effect.when(() => size >= concurrencyN));
          yield* $(Queue.offer(cancelers, canceler));
          const raceEffects = pipe(queueReader, core.pipeTo(channel), toPull, Effect.flatMap(pull => pipe(evaluatePull(pull), Effect.race(Deferred.await(errorSignal)), Effect.race(Deferred.await(canceler)))), Effect.scoped);
          yield* $(Deferred.succeed(latch, void 0), Effect.zipRight(raceEffects), withPermits(1), Effect.forkScoped);
          yield* $(Deferred.await(latch));
          const errored = yield* $(Deferred.isDone(errorSignal));
          return !errored;
        })
      })
    })
  }), Effect.repeatWhile(identity), Effect.forkScoped);
  return [queue, input];
}), Effect.map(([queue, input]) => {
  const consumer = pipe(Queue.take(queue), Effect.flatten, Effect.matchCause({
    onFailure: core.failCause,
    onSuccess: Either.match({
      onLeft: core.succeedNow,
      onRight: outElem => core.flatMap(core.write(outElem), () => consumer)
    })
  }), unwrap);
  return core.embedInput(consumer, input);
}), unwrapScoped);
/** @internal */
export const mergeMap = /*#__PURE__*/dual(3, (self, f, options) => mergeAll(options)(mapOut(self, f)));
/** @internal */
export const mergeOut = /*#__PURE__*/dual(2, (self, n) => mergeAll({
  concurrency: n
})(mapOut(self, identity)));
/** @internal */
export const mergeOutWith = /*#__PURE__*/dual(3, (self, n, f) => mergeAllWith({
  concurrency: n
})(mapOut(self, identity), f));
/** @internal */
export const mergeWith = /*#__PURE__*/dual(2, (self, options) => unwrapScoped(Effect.flatMap(singleProducerAsyncInput.make(), input => {
  const queueReader = fromInput(input);
  return Effect.map(Effect.zip(toPull(core.pipeTo(queueReader, self)), toPull(core.pipeTo(queueReader, options.other))), ([pullL, pullR]) => {
    const handleSide = (exit, fiber, pull) => (done, both, single) => {
      const onDecision = decision => {
        const op = decision;
        if (op._tag === MergeDecisionOpCodes.OP_DONE) {
          return Effect.succeed(core.fromEffect(Effect.zipRight(Fiber.interrupt(fiber), op.effect)));
        }
        return Effect.map(Fiber.await(fiber), Exit.match({
          onFailure: cause => core.fromEffect(op.f(Exit.failCause(cause))),
          onSuccess: Either.match({
            onLeft: done => core.fromEffect(op.f(Exit.succeed(done))),
            onRight: elem => zipRight(core.write(elem), go(single(op.f)))
          })
        }));
      };
      return Exit.match(exit, {
        onFailure: cause => onDecision(done(Exit.failCause(cause))),
        onSuccess: Either.match({
          onLeft: z => onDecision(done(Exit.succeed(z))),
          onRight: elem => Effect.succeed(core.flatMap(core.write(elem), () => core.flatMap(core.fromEffect(Effect.forkDaemon(pull)), leftFiber => go(both(leftFiber, fiber)))))
        })
      });
    };
    const go = state => {
      switch (state._tag) {
        case MergeStateOpCodes.OP_BOTH_RUNNING:
          {
            const leftJoin = Effect.interruptible(Fiber.join(state.left));
            const rightJoin = Effect.interruptible(Fiber.join(state.right));
            return unwrap(Effect.raceWith(leftJoin, rightJoin, {
              onSelfDone: (leftExit, rf) => Effect.zipRight(Fiber.interrupt(rf), handleSide(leftExit, state.right, pullL)(options.onSelfDone, mergeState.BothRunning, f => mergeState.LeftDone(f))),
              onOtherDone: (rightExit, lf) => Effect.zipRight(Fiber.interrupt(lf), handleSide(rightExit, state.left, pullR)(options.onOtherDone, (left, right) => mergeState.BothRunning(right, left), f => mergeState.RightDone(f)))
            }));
          }
        case MergeStateOpCodes.OP_LEFT_DONE:
          {
            return unwrap(Effect.map(Effect.exit(pullR), Exit.match({
              onFailure: cause => core.fromEffect(state.f(Exit.failCause(cause))),
              onSuccess: Either.match({
                onLeft: done => core.fromEffect(state.f(Exit.succeed(done))),
                onRight: elem => core.flatMap(core.write(elem), () => go(mergeState.LeftDone(state.f)))
              })
            })));
          }
        case MergeStateOpCodes.OP_RIGHT_DONE:
          {
            return unwrap(Effect.map(Effect.exit(pullL), Exit.match({
              onFailure: cause => core.fromEffect(state.f(Exit.failCause(cause))),
              onSuccess: Either.match({
                onLeft: done => core.fromEffect(state.f(Exit.succeed(done))),
                onRight: elem => core.flatMap(core.write(elem), () => go(mergeState.RightDone(state.f)))
              })
            })));
          }
      }
    };
    return pipe(core.fromEffect(Effect.zipWith(Effect.forkDaemon(pullL), Effect.forkDaemon(pullR), (left, right) => mergeState.BothRunning(left, right))), core.flatMap(go), core.embedInput(input));
  });
})));
/** @internal */
export const never = /*#__PURE__*/core.fromEffect(Effect.never);
/** @internal */
export const orDie = /*#__PURE__*/dual(2, (self, error) => orDieWith(self, error));
/** @internal */
export const orDieWith = /*#__PURE__*/dual(2, (self, f) => catchAll(self, e => {
  throw f(e);
}));
/** @internal */
export const orElse = /*#__PURE__*/dual(2, (self, that) => catchAll(self, that));
/** @internal */
export const pipeToOrFail = /*#__PURE__*/dual(2, (self, that) => core.suspend(() => {
  let channelException = undefined;
  const reader = core.readWith({
    onInput: outElem => core.flatMap(core.write(outElem), () => reader),
    onFailure: outErr => {
      channelException = ChannelException(outErr);
      return core.failCause(Cause.die(channelException));
    },
    onDone: core.succeedNow
  });
  const writer = core.readWithCause({
    onInput: outElem => pipe(core.write(outElem), core.flatMap(() => writer)),
    onFailure: cause => Cause.isDieType(cause) && isChannelException(cause.defect) && Equal.equals(cause.defect, channelException) ? core.fail(cause.defect.error) : core.failCause(cause),
    onDone: core.succeedNow
  });
  return core.pipeTo(core.pipeTo(core.pipeTo(self, reader), that), writer);
}));
/** @internal */
export const provideService = /*#__PURE__*/dual(3, (self, tag, service) => {
  return core.flatMap(context(), context => core.provideContext(self, Context.add(context, tag, service)));
});
/** @internal */
export const provideLayer = /*#__PURE__*/dual(2, (self, layer) => unwrapScoped(Effect.map(Layer.build(layer), env => core.provideContext(self, env))));
/** @internal */
export const mapInputContext = /*#__PURE__*/dual(2, (self, f) => contextWithChannel(context => core.provideContext(self, f(context))));
/** @internal */
export const provideSomeLayer = /*#__PURE__*/dual(2, (self, layer) =>
// @ts-expect-error
provideLayer(self, Layer.merge(Layer.context(), layer)));
/** @internal */
export const read = () => core.readOrFail(Option.none());
/** @internal */
export const repeated = self => core.flatMap(self, () => repeated(self));
/** @internal */
export const run = self => Effect.scoped(executor.runScoped(self));
/** @internal */
export const runCollect = self => executor.run(core.collectElements(self));
/** @internal */
export const runDrain = self => executor.run(drain(self));
/** @internal */
export const scoped = effect => unwrap(Effect.uninterruptibleMask(restore => Effect.map(Scope.make(), scope => core.acquireReleaseOut(Effect.tapErrorCause(restore(Scope.extend(scope)(effect)), cause => Scope.close(scope, Exit.failCause(cause))), (_, exit) => Scope.close(scope, exit)))));
/** @internal */
export const service = tag => core.fromEffect(tag);
/** @internal */
export const serviceWith = tag => f => map(service(tag), f);
/** @internal */
export const serviceWithChannel = tag => f => core.flatMap(service(tag), f);
/** @internal */
export const serviceWithEffect = tag => f => mapEffect(service(tag), f);
/** @internal */
export const toPubSub = pubsub => toQueue(pubsub);
/** @internal */
export const toPull = self => Effect.map(Effect.acquireRelease(Effect.sync(() => new executor.ChannelExecutor(self, void 0, identity)), (exec, exit) => {
  const finalize = exec.close(exit);
  return finalize === undefined ? Effect.unit : finalize;
}), exec => Effect.suspend(() => interpretToPull(exec.run(), exec)));
/** @internal */
const interpretToPull = (channelState, exec) => {
  const state = channelState;
  switch (state._tag) {
    case ChannelStateOpCodes.OP_DONE:
      {
        return Exit.match(exec.getDone(), {
          onFailure: Effect.failCause,
          onSuccess: done => Effect.succeed(Either.left(done))
        });
      }
    case ChannelStateOpCodes.OP_EMIT:
      {
        return Effect.succeed(Either.right(exec.getEmit()));
      }
    case ChannelStateOpCodes.OP_FROM_EFFECT:
      {
        return pipe(state.effect, Effect.flatMap(() => interpretToPull(exec.run(), exec)));
      }
    case ChannelStateOpCodes.OP_READ:
      {
        return executor.readUpstream(state, () => interpretToPull(exec.run(), exec), cause => Effect.failCause(cause));
      }
  }
};
/** @internal */
export const toQueue = queue => core.suspend(() => toQueueInternal(queue));
/** @internal */
const toQueueInternal = queue => {
  return core.readWithCause({
    onInput: elem => core.flatMap(core.fromEffect(Queue.offer(queue, Either.right(elem))), () => toQueueInternal(queue)),
    onFailure: cause => core.fromEffect(pipe(Queue.offer(queue, Either.left(Exit.failCause(cause))))),
    onDone: done => core.fromEffect(pipe(Queue.offer(queue, Either.left(Exit.succeed(done)))))
  });
};
/** @internal */
export const unwrap = channel => flatten(core.fromEffect(channel));
/** @internal */
export const unwrapScoped = self => core.concatAllWith(scoped(self), (d, _) => d, (d, _) => d);
/** @internal */
export const updateService = /*#__PURE__*/dual(3, (self, tag, f) => mapInputContext(self, context => Context.merge(context, Context.make(tag, f(Context.unsafeGet(context, tag))))));
/** @internal */
export const withSpan = /*#__PURE__*/dual(3, (self, name, options) => unwrapScoped(Effect.flatMap(Effect.context(), context => Effect.map(Effect.makeSpanScoped(name, options), span => core.provideContext(self, Context.add(context, tracer.spanTag, span))))));
/** @internal */
export const writeAll = (...outs) => writeChunk(Chunk.fromIterable(outs));
/** @internal */
export const writeChunk = outs => writeChunkWriter(0, outs.length, outs);
/** @internal */
const writeChunkWriter = (idx, len, chunk) => {
  return idx === len ? core.unit : pipe(core.write(pipe(chunk, Chunk.unsafeGet(idx))), core.flatMap(() => writeChunkWriter(idx + 1, len, chunk)));
};
/** @internal */
export const zip = /*#__PURE__*/dual(args => core.isChannel(args[1]), (self, that, options) => options?.concurrent ? mergeWith(self, {
  other: that,
  onSelfDone: exit1 => mergeDecision.Await(exit2 => Effect.suspend(() => Exit.zip(exit1, exit2))),
  onOtherDone: exit2 => mergeDecision.Await(exit1 => Effect.suspend(() => Exit.zip(exit1, exit2)))
}) : core.flatMap(self, a => map(that, b => [a, b])));
/** @internal */
export const zipLeft = /*#__PURE__*/dual(args => core.isChannel(args[1]), (self, that, options) => options?.concurrent ? map(zip(self, that, {
  concurrent: true
}), tuple => tuple[0]) : core.flatMap(self, z => as(that, z)));
/** @internal */
export const zipRight = /*#__PURE__*/dual(args => core.isChannel(args[1]), (self, that, options) => options?.concurrent ? map(zip(self, that, {
  concurrent: true
}), tuple => tuple[1]) : core.flatMap(self, () => that));
/** @internal */
export const ChannelExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Channel/ChannelException");
/** @internal */
export const ChannelException = error => ({
  _tag: "ChannelException",
  [ChannelExceptionTypeId]: ChannelExceptionTypeId,
  error
});
/** @internal */
export const isChannelException = u => hasProperty(u, ChannelExceptionTypeId);
//# sourceMappingURL=channel.js.map