"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.never = exports.mergeWith = exports.mergeOutWith = exports.mergeOut = exports.mergeMap = exports.mergeAllWith = exports.mergeAllUnboundedWith = exports.mergeAllUnbounded = exports.mergeAll = exports.mapOutEffectPar = exports.mapOutEffect = exports.mapOut = exports.mapErrorCause = exports.mapError = exports.mapEffect = exports.map = exports.interruptWhenDeferred = exports.interruptWhen = exports.identityChannel = exports.fromQueue = exports.fromOption = exports.fromPubSubScoped = exports.fromPubSub = exports.fromInput = exports.fromEither = exports.foldChannel = exports.flatten = exports.contextWithEffect = exports.contextWithChannel = exports.contextWith = exports.context = exports.ensuring = exports.emitCollect = exports.drain = exports.doneCollect = exports.mapInputInEffect = exports.mapInputIn = exports.mapInputErrorEffect = exports.mapInputError = exports.mapInputEffect = exports.mapInput = exports.concatOut = exports.collect = exports.concatMap = exports.catchAll = exports.bufferChunk = exports.buffer = exports.asUnit = exports.as = exports.acquireUseRelease = void 0;
exports.isChannelException = exports.ChannelException = exports.ChannelExceptionTypeId = exports.zipRight = exports.zipLeft = exports.zip = exports.writeChunk = exports.writeAll = exports.withSpan = exports.updateService = exports.unwrapScoped = exports.unwrap = exports.toQueue = exports.toPull = exports.toPubSub = exports.serviceWithEffect = exports.serviceWithChannel = exports.serviceWith = exports.service = exports.scoped = exports.runDrain = exports.runCollect = exports.run = exports.repeated = exports.read = exports.provideSomeLayer = exports.mapInputContext = exports.provideLayer = exports.provideService = exports.pipeToOrFail = exports.orElse = exports.orDieWith = exports.orDie = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Context = /*#__PURE__*/require("../Context.js");
const Deferred = /*#__PURE__*/require("../Deferred.js");
const Effect = /*#__PURE__*/require("../Effect.js");
const Either = /*#__PURE__*/require("../Either.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const Fiber = /*#__PURE__*/require("../Fiber.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Layer = /*#__PURE__*/require("../Layer.js");
const Option = /*#__PURE__*/require("../Option.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const PubSub = /*#__PURE__*/require("../PubSub.js");
const Queue = /*#__PURE__*/require("../Queue.js");
const Ref = /*#__PURE__*/require("../Ref.js");
const Scope = /*#__PURE__*/require("../Scope.js");
const executor = /*#__PURE__*/require("./channel/channelExecutor.js");
const mergeDecision = /*#__PURE__*/require("./channel/mergeDecision.js");
const mergeState = /*#__PURE__*/require("./channel/mergeState.js");
const _mergeStrategy = /*#__PURE__*/require("./channel/mergeStrategy.js");
const singleProducerAsyncInput = /*#__PURE__*/require("./channel/singleProducerAsyncInput.js");
const core = /*#__PURE__*/require("./core-stream.js");
const MergeDecisionOpCodes = /*#__PURE__*/require("./opCodes/channelMergeDecision.js");
const MergeStateOpCodes = /*#__PURE__*/require("./opCodes/channelMergeState.js");
const ChannelStateOpCodes = /*#__PURE__*/require("./opCodes/channelState.js");
const tracer = /*#__PURE__*/require("./tracer.js");
/** @internal */
const acquireUseRelease = (acquire, use, release) => core.flatMap(core.fromEffect(Ref.make(() => Effect.unit)), ref => (0, Function_js_1.pipe)(core.fromEffect(Effect.uninterruptible(Effect.tap(acquire, a => Ref.set(ref, exit => release(a, exit))))), core.flatMap(use), core.ensuringWith(exit => Effect.flatMap(Ref.get(ref), f => f(exit)))));
exports.acquireUseRelease = acquireUseRelease;
/** @internal */
exports.as = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.map)(self, () => value));
/** @internal */
const asUnit = self => (0, exports.map)(self, Function_js_1.constVoid);
exports.asUnit = asUnit;
/** @internal */
const buffer = options => core.suspend(() => {
  const doBuffer = (empty, isEmpty, ref) => (0, exports.unwrap)(Ref.modify(ref, inElem => isEmpty(inElem) ? [core.readWith({
    onInput: input => core.flatMap(core.write(input), () => doBuffer(empty, isEmpty, ref)),
    onFailure: error => core.fail(error),
    onDone: done => core.succeedNow(done)
  }), inElem] : [core.flatMap(core.write(inElem), () => doBuffer(empty, isEmpty, ref)), empty]));
  return doBuffer(options.empty, options.isEmpty, options.ref);
});
exports.buffer = buffer;
/** @internal */
const bufferChunk = ref => (0, exports.buffer)({
  empty: Chunk.empty(),
  isEmpty: Chunk.isEmpty,
  ref
});
exports.bufferChunk = bufferChunk;
/** @internal */
exports.catchAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.catchAllCause(self, cause => Either.match(Cause.failureOrCause(cause), {
  onLeft: f,
  onRight: core.failCause
})));
/** @internal */
exports.concatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.concatMapWith(self, f, () => void 0, () => void 0));
/** @internal */
exports.collect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => {
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
const concatOut = self => core.concatAll(self);
exports.concatOut = concatOut;
/** @internal */
exports.mapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(inElem), () => reader),
    onFailure: core.fail,
    onDone: done => core.succeedNow(f(done))
  });
  return core.pipeTo(reader, self);
});
/** @internal */
exports.mapInputEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(inElem), () => reader),
    onFailure: core.fail,
    onDone: done => core.fromEffect(f(done))
  });
  return core.pipeTo(reader, self);
});
/** @internal */
exports.mapInputError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(inElem), () => reader),
    onFailure: error => core.fail(f(error)),
    onDone: core.succeedNow
  });
  return core.pipeTo(reader, self);
});
/** @internal */
exports.mapInputErrorEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(inElem), () => reader),
    onFailure: error => core.fromEffect(f(error)),
    onDone: core.succeedNow
  });
  return core.pipeTo(reader, self);
});
/** @internal */
exports.mapInputIn = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.write(f(inElem)), () => reader),
    onFailure: core.fail,
    onDone: core.succeedNow
  });
  return core.pipeTo(reader, self);
});
exports.mapInputInEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const reader = core.readWith({
    onInput: inElem => core.flatMap(core.flatMap(core.fromEffect(f(inElem)), core.write), () => reader),
    onFailure: core.fail,
    onDone: core.succeedNow
  });
  return core.pipeTo(reader, self);
});
/** @internal */
const doneCollect = self => core.suspend(() => {
  const builder = [];
  return (0, Function_js_1.pipe)(core.pipeTo(self, doneCollectReader(builder)), core.flatMap(outDone => core.succeed([Chunk.unsafeFromArray(builder), outDone])));
});
exports.doneCollect = doneCollect;
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
const drain = self => {
  const drainer = core.readWithCause({
    onInput: () => drainer,
    onFailure: core.failCause,
    onDone: core.succeed
  });
  return core.pipeTo(self, drainer);
};
exports.drain = drain;
/** @internal */
const emitCollect = self => core.flatMap((0, exports.doneCollect)(self), core.write);
exports.emitCollect = emitCollect;
/** @internal */
exports.ensuring = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => core.ensuringWith(self, () => finalizer));
/** @internal */
const context = () => core.fromEffect(Effect.context());
exports.context = context;
/** @internal */
const contextWith = f => (0, exports.map)((0, exports.context)(), f);
exports.contextWith = contextWith;
/** @internal */
const contextWithChannel = f => core.flatMap((0, exports.context)(), f);
exports.contextWithChannel = contextWithChannel;
/** @internal */
const contextWithEffect = f => (0, exports.mapEffect)((0, exports.context)(), f);
exports.contextWithEffect = contextWithEffect;
/** @internal */
const flatten = self => core.flatMap(self, Function_js_1.identity);
exports.flatten = flatten;
/** @internal */
exports.foldChannel = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => core.foldCauseChannel(self, {
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
const fromEither = either => core.suspend(() => Either.match(either, {
  onLeft: core.fail,
  onRight: core.succeed
}));
exports.fromEither = fromEither;
/** @internal */
const fromInput = input => (0, exports.unwrap)(input.takeWith(core.failCause, elem => core.flatMap(core.write(elem), () => (0, exports.fromInput)(input)), core.succeed));
exports.fromInput = fromInput;
/** @internal */
const fromPubSub = pubsub => (0, exports.unwrapScoped)(Effect.map(PubSub.subscribe(pubsub), exports.fromQueue));
exports.fromPubSub = fromPubSub;
/** @internal */
const fromPubSubScoped = pubsub => Effect.map(PubSub.subscribe(pubsub), exports.fromQueue);
exports.fromPubSubScoped = fromPubSubScoped;
/** @internal */
const fromOption = option => core.suspend(() => Option.match(option, {
  onNone: () => core.fail(Option.none()),
  onSome: core.succeed
}));
exports.fromOption = fromOption;
/** @internal */
const fromQueue = queue => core.suspend(() => fromQueueInternal(queue));
exports.fromQueue = fromQueue;
/** @internal */
const fromQueueInternal = queue => (0, Function_js_1.pipe)(core.fromEffect(Queue.take(queue)), core.flatMap(Either.match({
  onLeft: Exit.match({
    onFailure: core.failCause,
    onSuccess: core.succeedNow
  }),
  onRight: elem => core.flatMap(core.write(elem), () => fromQueueInternal(queue))
})));
/** @internal */
const identityChannel = () => core.readWith({
  onInput: input => core.flatMap(core.write(input), () => (0, exports.identityChannel)()),
  onFailure: core.fail,
  onDone: core.succeedNow
});
exports.identityChannel = identityChannel;
/** @internal */
exports.interruptWhen = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, effect) => (0, exports.mergeWith)(self, {
  other: core.fromEffect(effect),
  onSelfDone: selfDone => mergeDecision.Done(Effect.suspend(() => selfDone)),
  onOtherDone: effectDone => mergeDecision.Done(Effect.suspend(() => effectDone))
}));
/** @internal */
exports.interruptWhenDeferred = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, deferred) => (0, exports.interruptWhen)(self, Deferred.await(deferred)));
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.flatMap(self, a => core.sync(() => f(a))));
/** @internal */
exports.mapEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.flatMap(self, z => core.fromEffect(f(z))));
/** @internal */
exports.mapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapErrorCause)(self, Cause.map(f)));
/** @internal */
exports.mapErrorCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.catchAllCause(self, cause => core.failCause(f(cause))));
/** @internal */
exports.mapOut = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const reader = core.readWith({
    onInput: outElem => core.flatMap(core.write(f(outElem)), () => reader),
    onFailure: core.fail,
    onDone: core.succeedNow
  });
  return core.pipeTo(self, reader);
});
/** @internal */
exports.mapOutEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const reader = core.readWithCause({
    onInput: outElem => (0, Function_js_1.pipe)(core.fromEffect(f(outElem)), core.flatMap(core.write), core.flatMap(() => reader)),
    onFailure: core.failCause,
    onDone: core.succeedNow
  });
  return core.pipeTo(self, reader);
});
/** @internal */
exports.mapOutEffectPar = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, f, n) => (0, Function_js_1.pipe)(Effect.gen(function* ($) {
  const queue = yield* $(Effect.acquireRelease(Queue.bounded(n), queue => Queue.shutdown(queue)));
  const errorSignal = yield* $(Deferred.make());
  const withPermits = n === Number.POSITIVE_INFINITY ? _ => Function_js_1.identity : (yield* $(Effect.makeSemaphore(n))).withPermits;
  const pull = yield* $((0, exports.toPull)(self));
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
        yield* $(Deferred.succeed(latch, void 0), Effect.zipRight((0, Function_js_1.pipe)(Effect.uninterruptibleMask(restore => (0, Function_js_1.pipe)(Effect.exit(restore(Deferred.await(errorSignal))), Effect.raceFirst(Effect.exit(restore(f(outElem)))),
        // TODO: remove
        Effect.flatMap(exit => Effect.suspend(() => exit)))), Effect.tapErrorCause(cause => Deferred.failCause(errorSignal, cause)), Effect.intoDeferred(deferred))), withPermits(1), Effect.forkScoped);
        yield* $(Deferred.await(latch));
      })
    })
  }), Effect.forever, Effect.interruptible, Effect.forkScoped);
  return queue;
}), Effect.map(queue => {
  const consumer = (0, exports.unwrap)(Effect.matchCause(Effect.flatten(Queue.take(queue)), {
    onFailure: core.failCause,
    onSuccess: Either.match({
      onLeft: core.succeedNow,
      onRight: outElem => core.flatMap(core.write(outElem), () => consumer)
    })
  }));
  return consumer;
}), exports.unwrapScoped));
/** @internal */
const mergeAll = options => {
  return channels => (0, exports.mergeAllWith)(options)(channels, Function_js_1.constVoid);
};
exports.mergeAll = mergeAll;
/** @internal */
const mergeAllUnbounded = channels => (0, exports.mergeAllWith)({
  concurrency: "unbounded"
})(channels, Function_js_1.constVoid);
exports.mergeAllUnbounded = mergeAllUnbounded;
/** @internal */
const mergeAllUnboundedWith = (channels, f) => (0, exports.mergeAllWith)({
  concurrency: "unbounded"
})(channels, f);
exports.mergeAllUnboundedWith = mergeAllUnboundedWith;
/** @internal */
const mergeAllWith = ({
  bufferSize = 16,
  concurrency,
  mergeStrategy = _mergeStrategy.BackPressure()
}) => (channels, f) => (0, Function_js_1.pipe)(Effect.gen(function* ($) {
  const concurrencyN = concurrency === "unbounded" ? Number.MAX_SAFE_INTEGER : concurrency;
  const input = yield* $(singleProducerAsyncInput.make());
  const queueReader = (0, exports.fromInput)(input);
  const queue = yield* $(Effect.acquireRelease(Queue.bounded(bufferSize), queue => Queue.shutdown(queue)));
  const cancelers = yield* $(Effect.acquireRelease(Queue.unbounded(), queue => Queue.shutdown(queue)));
  const lastDone = yield* $(Ref.make(Option.none()));
  const errorSignal = yield* $(Deferred.make());
  const withPermits = (yield* $(Effect.makeSemaphore(concurrencyN))).withPermits;
  const pull = yield* $((0, exports.toPull)(channels));
  const evaluatePull = pull => (0, Function_js_1.pipe)(Effect.flatMap(pull, Either.match({
    onLeft: done => Effect.succeed(Option.some(done)),
    onRight: outElem => Effect.as(Queue.offer(queue, Effect.succeed(Either.right(outElem))), Option.none())
  })), Effect.repeatUntil(Option.isSome), Effect.flatMap(outDone => Ref.update(lastDone, Option.match({
    onNone: () => Option.some(outDone.value),
    onSome: lastDone => Option.some(f(lastDone, outDone.value))
  }))), Effect.catchAllCause(cause => Cause.isInterrupted(cause) ? Effect.failCause(cause) : (0, Function_js_1.pipe)(Queue.offer(queue, Effect.failCause(cause)), Effect.zipRight(Deferred.succeed(errorSignal, void 0)), Effect.asUnit)));
  yield* $(Effect.matchCauseEffect(pull, {
    onFailure: cause => (0, Function_js_1.pipe)(Queue.offer(queue, Effect.failCause(cause)), Effect.zipRight(Effect.succeed(false))),
    onSuccess: Either.match({
      onLeft: outDone => Effect.raceWith(Deferred.await(errorSignal), withPermits(concurrencyN)(Effect.unit), {
        onSelfDone: (_, permitAcquisition) => Effect.as(Fiber.interrupt(permitAcquisition), false),
        onOtherDone: (_, failureAwait) => Effect.zipRight(Fiber.interrupt(failureAwait), (0, Function_js_1.pipe)(Ref.get(lastDone), Effect.flatMap(Option.match({
          onNone: () => Queue.offer(queue, Effect.succeed(Either.left(outDone))),
          onSome: lastDone => Queue.offer(queue, Effect.succeed(Either.left(f(lastDone, outDone))))
        })), Effect.as(false)))
      }),
      onRight: channel => _mergeStrategy.match(mergeStrategy, {
        onBackPressure: () => Effect.gen(function* ($) {
          const latch = yield* $(Deferred.make());
          const raceEffects = (0, Function_js_1.pipe)(queueReader, core.pipeTo(channel), exports.toPull, Effect.flatMap(pull => Effect.race(evaluatePull(pull), Deferred.await(errorSignal))), Effect.scoped);
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
          const raceEffects = (0, Function_js_1.pipe)(queueReader, core.pipeTo(channel), exports.toPull, Effect.flatMap(pull => (0, Function_js_1.pipe)(evaluatePull(pull), Effect.race(Deferred.await(errorSignal)), Effect.race(Deferred.await(canceler)))), Effect.scoped);
          yield* $(Deferred.succeed(latch, void 0), Effect.zipRight(raceEffects), withPermits(1), Effect.forkScoped);
          yield* $(Deferred.await(latch));
          const errored = yield* $(Deferred.isDone(errorSignal));
          return !errored;
        })
      })
    })
  }), Effect.repeatWhile(Function_js_1.identity), Effect.forkScoped);
  return [queue, input];
}), Effect.map(([queue, input]) => {
  const consumer = (0, Function_js_1.pipe)(Queue.take(queue), Effect.flatten, Effect.matchCause({
    onFailure: core.failCause,
    onSuccess: Either.match({
      onLeft: core.succeedNow,
      onRight: outElem => core.flatMap(core.write(outElem), () => consumer)
    })
  }), exports.unwrap);
  return core.embedInput(consumer, input);
}), exports.unwrapScoped);
exports.mergeAllWith = mergeAllWith;
/** @internal */
exports.mergeMap = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, f, options) => (0, exports.mergeAll)(options)((0, exports.mapOut)(self, f)));
/** @internal */
exports.mergeOut = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.mergeAll)({
  concurrency: n
})((0, exports.mapOut)(self, Function_js_1.identity)));
/** @internal */
exports.mergeOutWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, n, f) => (0, exports.mergeAllWith)({
  concurrency: n
})((0, exports.mapOut)(self, Function_js_1.identity), f));
/** @internal */
exports.mergeWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.unwrapScoped)(Effect.flatMap(singleProducerAsyncInput.make(), input => {
  const queueReader = (0, exports.fromInput)(input);
  return Effect.map(Effect.zip((0, exports.toPull)(core.pipeTo(queueReader, self)), (0, exports.toPull)(core.pipeTo(queueReader, options.other))), ([pullL, pullR]) => {
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
            onRight: elem => (0, exports.zipRight)(core.write(elem), go(single(op.f)))
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
            return (0, exports.unwrap)(Effect.raceWith(leftJoin, rightJoin, {
              onSelfDone: (leftExit, rf) => Effect.zipRight(Fiber.interrupt(rf), handleSide(leftExit, state.right, pullL)(options.onSelfDone, mergeState.BothRunning, f => mergeState.LeftDone(f))),
              onOtherDone: (rightExit, lf) => Effect.zipRight(Fiber.interrupt(lf), handleSide(rightExit, state.left, pullR)(options.onOtherDone, (left, right) => mergeState.BothRunning(right, left), f => mergeState.RightDone(f)))
            }));
          }
        case MergeStateOpCodes.OP_LEFT_DONE:
          {
            return (0, exports.unwrap)(Effect.map(Effect.exit(pullR), Exit.match({
              onFailure: cause => core.fromEffect(state.f(Exit.failCause(cause))),
              onSuccess: Either.match({
                onLeft: done => core.fromEffect(state.f(Exit.succeed(done))),
                onRight: elem => core.flatMap(core.write(elem), () => go(mergeState.LeftDone(state.f)))
              })
            })));
          }
        case MergeStateOpCodes.OP_RIGHT_DONE:
          {
            return (0, exports.unwrap)(Effect.map(Effect.exit(pullL), Exit.match({
              onFailure: cause => core.fromEffect(state.f(Exit.failCause(cause))),
              onSuccess: Either.match({
                onLeft: done => core.fromEffect(state.f(Exit.succeed(done))),
                onRight: elem => core.flatMap(core.write(elem), () => go(mergeState.RightDone(state.f)))
              })
            })));
          }
      }
    };
    return (0, Function_js_1.pipe)(core.fromEffect(Effect.zipWith(Effect.forkDaemon(pullL), Effect.forkDaemon(pullR), (left, right) => mergeState.BothRunning(left, right))), core.flatMap(go), core.embedInput(input));
  });
})));
/** @internal */
exports.never = /*#__PURE__*/core.fromEffect(Effect.never);
/** @internal */
exports.orDie = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, error) => (0, exports.orDieWith)(self, error));
/** @internal */
exports.orDieWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.catchAll)(self, e => {
  throw f(e);
}));
/** @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.catchAll)(self, that));
/** @internal */
exports.pipeToOrFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => core.suspend(() => {
  let channelException = undefined;
  const reader = core.readWith({
    onInput: outElem => core.flatMap(core.write(outElem), () => reader),
    onFailure: outErr => {
      channelException = (0, exports.ChannelException)(outErr);
      return core.failCause(Cause.die(channelException));
    },
    onDone: core.succeedNow
  });
  const writer = core.readWithCause({
    onInput: outElem => (0, Function_js_1.pipe)(core.write(outElem), core.flatMap(() => writer)),
    onFailure: cause => Cause.isDieType(cause) && (0, exports.isChannelException)(cause.defect) && Equal.equals(cause.defect, channelException) ? core.fail(cause.defect.error) : core.failCause(cause),
    onDone: core.succeedNow
  });
  return core.pipeTo(core.pipeTo(core.pipeTo(self, reader), that), writer);
}));
/** @internal */
exports.provideService = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, service) => {
  return core.flatMap((0, exports.context)(), context => core.provideContext(self, Context.add(context, tag, service)));
});
/** @internal */
exports.provideLayer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, layer) => (0, exports.unwrapScoped)(Effect.map(Layer.build(layer), env => core.provideContext(self, env))));
/** @internal */
exports.mapInputContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.contextWithChannel)(context => core.provideContext(self, f(context))));
/** @internal */
exports.provideSomeLayer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, layer) =>
// @ts-expect-error
(0, exports.provideLayer)(self, Layer.merge(Layer.context(), layer)));
/** @internal */
const read = () => core.readOrFail(Option.none());
exports.read = read;
/** @internal */
const repeated = self => core.flatMap(self, () => (0, exports.repeated)(self));
exports.repeated = repeated;
/** @internal */
const run = self => Effect.scoped(executor.runScoped(self));
exports.run = run;
/** @internal */
const runCollect = self => executor.run(core.collectElements(self));
exports.runCollect = runCollect;
/** @internal */
const runDrain = self => executor.run((0, exports.drain)(self));
exports.runDrain = runDrain;
/** @internal */
const scoped = effect => (0, exports.unwrap)(Effect.uninterruptibleMask(restore => Effect.map(Scope.make(), scope => core.acquireReleaseOut(Effect.tapErrorCause(restore(Scope.extend(scope)(effect)), cause => Scope.close(scope, Exit.failCause(cause))), (_, exit) => Scope.close(scope, exit)))));
exports.scoped = scoped;
/** @internal */
const service = tag => core.fromEffect(tag);
exports.service = service;
/** @internal */
const serviceWith = tag => f => (0, exports.map)((0, exports.service)(tag), f);
exports.serviceWith = serviceWith;
/** @internal */
const serviceWithChannel = tag => f => core.flatMap((0, exports.service)(tag), f);
exports.serviceWithChannel = serviceWithChannel;
/** @internal */
const serviceWithEffect = tag => f => (0, exports.mapEffect)((0, exports.service)(tag), f);
exports.serviceWithEffect = serviceWithEffect;
/** @internal */
const toPubSub = pubsub => (0, exports.toQueue)(pubsub);
exports.toPubSub = toPubSub;
/** @internal */
const toPull = self => Effect.map(Effect.acquireRelease(Effect.sync(() => new executor.ChannelExecutor(self, void 0, Function_js_1.identity)), (exec, exit) => {
  const finalize = exec.close(exit);
  return finalize === undefined ? Effect.unit : finalize;
}), exec => Effect.suspend(() => interpretToPull(exec.run(), exec)));
exports.toPull = toPull;
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
        return (0, Function_js_1.pipe)(state.effect, Effect.flatMap(() => interpretToPull(exec.run(), exec)));
      }
    case ChannelStateOpCodes.OP_READ:
      {
        return executor.readUpstream(state, () => interpretToPull(exec.run(), exec), cause => Effect.failCause(cause));
      }
  }
};
/** @internal */
const toQueue = queue => core.suspend(() => toQueueInternal(queue));
exports.toQueue = toQueue;
/** @internal */
const toQueueInternal = queue => {
  return core.readWithCause({
    onInput: elem => core.flatMap(core.fromEffect(Queue.offer(queue, Either.right(elem))), () => toQueueInternal(queue)),
    onFailure: cause => core.fromEffect((0, Function_js_1.pipe)(Queue.offer(queue, Either.left(Exit.failCause(cause))))),
    onDone: done => core.fromEffect((0, Function_js_1.pipe)(Queue.offer(queue, Either.left(Exit.succeed(done)))))
  });
};
/** @internal */
const unwrap = channel => (0, exports.flatten)(core.fromEffect(channel));
exports.unwrap = unwrap;
/** @internal */
const unwrapScoped = self => core.concatAllWith((0, exports.scoped)(self), (d, _) => d, (d, _) => d);
exports.unwrapScoped = unwrapScoped;
/** @internal */
exports.updateService = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, f) => (0, exports.mapInputContext)(self, context => Context.merge(context, Context.make(tag, f(Context.unsafeGet(context, tag))))));
/** @internal */
exports.withSpan = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, name, options) => (0, exports.unwrapScoped)(Effect.flatMap(Effect.context(), context => Effect.map(Effect.makeSpanScoped(name, options), span => core.provideContext(self, Context.add(context, tracer.spanTag, span))))));
/** @internal */
const writeAll = (...outs) => (0, exports.writeChunk)(Chunk.fromIterable(outs));
exports.writeAll = writeAll;
/** @internal */
const writeChunk = outs => writeChunkWriter(0, outs.length, outs);
exports.writeChunk = writeChunk;
/** @internal */
const writeChunkWriter = (idx, len, chunk) => {
  return idx === len ? core.unit : (0, Function_js_1.pipe)(core.write((0, Function_js_1.pipe)(chunk, Chunk.unsafeGet(idx))), core.flatMap(() => writeChunkWriter(idx + 1, len, chunk)));
};
/** @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isChannel(args[1]), (self, that, options) => options?.concurrent ? (0, exports.mergeWith)(self, {
  other: that,
  onSelfDone: exit1 => mergeDecision.Await(exit2 => Effect.suspend(() => Exit.zip(exit1, exit2))),
  onOtherDone: exit2 => mergeDecision.Await(exit1 => Effect.suspend(() => Exit.zip(exit1, exit2)))
}) : core.flatMap(self, a => (0, exports.map)(that, b => [a, b])));
/** @internal */
exports.zipLeft = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isChannel(args[1]), (self, that, options) => options?.concurrent ? (0, exports.map)((0, exports.zip)(self, that, {
  concurrent: true
}), tuple => tuple[0]) : core.flatMap(self, z => (0, exports.as)(that, z)));
/** @internal */
exports.zipRight = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isChannel(args[1]), (self, that, options) => options?.concurrent ? (0, exports.map)((0, exports.zip)(self, that, {
  concurrent: true
}), tuple => tuple[1]) : core.flatMap(self, () => that));
/** @internal */
exports.ChannelExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Channel/ChannelException");
/** @internal */
const ChannelException = error => ({
  _tag: "ChannelException",
  [exports.ChannelExceptionTypeId]: exports.ChannelExceptionTypeId,
  error
});
exports.ChannelException = ChannelException;
/** @internal */
const isChannelException = u => (0, Predicate_js_1.hasProperty)(u, exports.ChannelExceptionTypeId);
exports.isChannelException = isChannelException;
//# sourceMappingURL=channel.js.map