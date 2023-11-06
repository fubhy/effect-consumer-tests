"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fold = exports.findEffect = exports.filterInputEffect = exports.filterInput = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.every = exports.contextWithSink = exports.contextWithEffect = exports.contextWith = exports.context = exports.ensuringWith = exports.ensuring = exports.dropWhileEffect = exports.dropWhile = exports.dropUntilEffect = exports.dropUntil = exports.drop = exports.drain = exports.dimapChunksEffect = exports.dimapChunks = exports.dimapEffect = exports.dimap = exports.dieSync = exports.dieMessage = exports.die = exports.mapInputChunksEffect = exports.mapInputChunks = exports.mapInputEffect = exports.mapInput = exports.collectLeftover = exports.collectAllWhileWith = exports.collectAllWhileEffect = exports.collectAllWhile = exports.collectAllUntilEffect = exports.collectAllUntil = exports.collectAllToSetN = exports.collectAllToSet = exports.collectAllToMapN = exports.collectAllToMap = exports.collectAllFrom = exports.collectAllN = exports.collectAll = exports.as = exports.suspend = exports.isSink = exports.SinkImpl = exports.SinkTypeId = void 0;
exports.sync = exports.summarized = exports.sum = exports.succeed = exports.splitWhere = exports.some = exports.serviceWithSink = exports.serviceWithEffect = exports.serviceWith = exports.service = exports.refineOrDieWith = exports.refineOrDie = exports.raceWith = exports.raceBoth = exports.race = exports.provideContext = exports.orElse = exports.never = exports.mapLeftover = exports.mapError = exports.mapEffect = exports.map = exports.leftover = exports.last = exports.ignoreLeftover = exports.head = exports.fromQueue = exports.fromPush = exports.fromPubSub = exports.fromEffect = exports.fromChannel = exports.forEachChunkWhile = exports.forEachWhile = exports.forEachChunk = exports.forEach = exports.flatMap = exports.foldWeightedEffect = exports.foldWeightedDecomposeEffect = exports.foldWeightedDecompose = exports.foldWeighted = exports.foldUntilEffect = exports.foldUntil = exports.foldLeftEffect = exports.foldLeftChunksEffect = exports.foldLeftChunks = exports.foldLeft = exports.foldEffect = exports.foldChunksEffect = exports.foldChunks = exports.foldSink = void 0;
exports.timed = exports.mkString = exports.count = exports.channelToSink = exports.zipWith = exports.zipRight = exports.zipLeft = exports.zip = exports.withDuration = exports.unwrapScoped = exports.unwrap = exports.toChannel = exports.take = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Clock = /*#__PURE__*/require("../Clock.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Effect = /*#__PURE__*/require("../Effect.js");
const Either = /*#__PURE__*/require("../Either.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const PubSub = /*#__PURE__*/require("../PubSub.js");
const Queue = /*#__PURE__*/require("../Queue.js");
const ReadonlyArray = /*#__PURE__*/require("../ReadonlyArray.js");
const Ref = /*#__PURE__*/require("../Ref.js");
const channel = /*#__PURE__*/require("./channel.js");
const mergeDecision = /*#__PURE__*/require("./channel/mergeDecision.js");
const core = /*#__PURE__*/require("./core-stream.js");
/** @internal */
exports.SinkTypeId = /*#__PURE__*/Symbol.for("effect/Sink");
/** @internal */
const sinkVariance = {
  _R: _ => _,
  _E: _ => _,
  _In: _ => _,
  _L: _ => _,
  _Z: _ => _
};
/** @internal */
class SinkImpl {
  channel;
  [exports.SinkTypeId] = sinkVariance;
  constructor(channel) {
    this.channel = channel;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.SinkImpl = SinkImpl;
/** @internal */
const isSink = u => (0, Predicate_js_1.hasProperty)(u, exports.SinkTypeId);
exports.isSink = isSink;
/** @internal */
const suspend = evaluate => new SinkImpl(core.suspend(() => (0, exports.toChannel)(evaluate())));
exports.suspend = suspend;
/** @internal */
exports.as = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, z) => (0, Function_js_1.pipe)(self, (0, exports.map)(() => z)));
/** @internal */
const collectAll = () => new SinkImpl(collectAllLoop(Chunk.empty()));
exports.collectAll = collectAll;
/** @internal */
const collectAllLoop = acc => core.readWithCause({
  onInput: chunk => collectAllLoop((0, Function_js_1.pipe)(acc, Chunk.appendAll(chunk))),
  onFailure: core.failCause,
  onDone: () => core.succeed(acc)
});
/** @internal */
const collectAllN = n => (0, exports.suspend)(() => (0, exports.fromChannel)(collectAllNLoop(n, Chunk.empty())));
exports.collectAllN = collectAllN;
/** @internal */
const collectAllNLoop = (n, acc) => core.readWithCause({
  onInput: chunk => {
    const [collected, leftovers] = Chunk.splitAt(chunk, n);
    if (collected.length < n) {
      return collectAllNLoop(n - collected.length, Chunk.appendAll(acc, collected));
    }
    if (Chunk.isEmpty(leftovers)) {
      return core.succeed(Chunk.appendAll(acc, collected));
    }
    return core.flatMap(core.write(leftovers), () => core.succeed(Chunk.appendAll(acc, collected)));
  },
  onFailure: core.failCause,
  onDone: () => core.succeed(acc)
});
/** @internal */
const collectAllFrom = self => (0, exports.collectAllWhileWith)(self, {
  initial: Chunk.empty(),
  while: Function_js_1.constTrue,
  body: (chunk, z) => (0, Function_js_1.pipe)(chunk, Chunk.append(z))
});
exports.collectAllFrom = collectAllFrom;
/** @internal */
const collectAllToMap = (key, merge) => {
  return (0, Function_js_1.pipe)((0, exports.foldLeftChunks)(HashMap.empty(), (map, chunk) => (0, Function_js_1.pipe)(chunk, Chunk.reduce(map, (map, input) => {
    const k = key(input);
    const v = (0, Function_js_1.pipe)(map, HashMap.has(k)) ? merge((0, Function_js_1.pipe)(map, HashMap.unsafeGet(k)), input) : input;
    return (0, Function_js_1.pipe)(map, HashMap.set(k, v));
  }))));
};
exports.collectAllToMap = collectAllToMap;
/** @internal */
const collectAllToMapN = (n, key, merge) => {
  return (0, exports.foldWeighted)({
    initial: HashMap.empty(),
    maxCost: n,
    cost: (acc, input) => (0, Function_js_1.pipe)(acc, HashMap.has(key(input))) ? 0 : 1,
    body: (acc, input) => {
      const k = key(input);
      const v = (0, Function_js_1.pipe)(acc, HashMap.has(k)) ? merge((0, Function_js_1.pipe)(acc, HashMap.unsafeGet(k)), input) : input;
      return (0, Function_js_1.pipe)(acc, HashMap.set(k, v));
    }
  });
};
exports.collectAllToMapN = collectAllToMapN;
/** @internal */
const collectAllToSet = () => (0, exports.foldLeftChunks)(HashSet.empty(), (acc, chunk) => (0, Function_js_1.pipe)(chunk, Chunk.reduce(acc, (acc, input) => (0, Function_js_1.pipe)(acc, HashSet.add(input)))));
exports.collectAllToSet = collectAllToSet;
/** @internal */
const collectAllToSetN = n => (0, exports.foldWeighted)({
  initial: HashSet.empty(),
  maxCost: n,
  cost: (acc, input) => HashSet.has(acc, input) ? 0 : 1,
  body: (acc, input) => HashSet.add(acc, input)
});
exports.collectAllToSetN = collectAllToSetN;
/** @internal */
const collectAllUntil = p => {
  return (0, Function_js_1.pipe)((0, exports.fold)([Chunk.empty(), true], tuple => tuple[1], ([chunk, _], input) => [(0, Function_js_1.pipe)(chunk, Chunk.append(input)), !p(input)]), (0, exports.map)(tuple => tuple[0]));
};
exports.collectAllUntil = collectAllUntil;
/** @internal */
const collectAllUntilEffect = p => {
  return (0, Function_js_1.pipe)((0, exports.foldEffect)([Chunk.empty(), true], tuple => tuple[1], ([chunk, _], input) => (0, Function_js_1.pipe)(p(input), Effect.map(bool => [(0, Function_js_1.pipe)(chunk, Chunk.append(input)), !bool]))), (0, exports.map)(tuple => tuple[0]));
};
exports.collectAllUntilEffect = collectAllUntilEffect;
/** @internal */
const collectAllWhile = predicate => (0, exports.fromChannel)(collectAllWhileReader(predicate, Chunk.empty()));
exports.collectAllWhile = collectAllWhile;
/** @internal */
const collectAllWhileReader = (predicate, done) => core.readWith({
  onInput: input => {
    const [collected, leftovers] = (0, Function_js_1.pipe)(Chunk.toReadonlyArray(input), ReadonlyArray.span(predicate));
    if (leftovers.length === 0) {
      return collectAllWhileReader(predicate, (0, Function_js_1.pipe)(done, Chunk.appendAll(Chunk.unsafeFromArray(collected))));
    }
    return (0, Function_js_1.pipe)(core.write(Chunk.unsafeFromArray(leftovers)), channel.zipRight(core.succeed((0, Function_js_1.pipe)(done, Chunk.appendAll(Chunk.unsafeFromArray(collected))))));
  },
  onFailure: core.fail,
  onDone: () => core.succeed(done)
});
/** @internal */
const collectAllWhileEffect = predicate => (0, exports.fromChannel)(collectAllWhileEffectReader(predicate, Chunk.empty()));
exports.collectAllWhileEffect = collectAllWhileEffect;
/** @internal */
const collectAllWhileEffectReader = (predicate, done) => core.readWith({
  onInput: input => (0, Function_js_1.pipe)(core.fromEffect((0, Function_js_1.pipe)(input, Effect.takeWhile(predicate), Effect.map(Chunk.unsafeFromArray))), core.flatMap(collected => {
    const leftovers = (0, Function_js_1.pipe)(input, Chunk.drop(collected.length));
    if (Chunk.isEmpty(leftovers)) {
      return collectAllWhileEffectReader(predicate, (0, Function_js_1.pipe)(done, Chunk.appendAll(collected)));
    }
    return (0, Function_js_1.pipe)(core.write(leftovers), channel.zipRight(core.succeed((0, Function_js_1.pipe)(done, Chunk.appendAll(collected)))));
  })),
  onFailure: core.fail,
  onDone: () => core.succeed(done)
});
/** @internal */
exports.collectAllWhileWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const refs = (0, Function_js_1.pipe)(Ref.make(Chunk.empty()), Effect.zip(Ref.make(false)));
  const newChannel = (0, Function_js_1.pipe)(core.fromEffect(refs), core.flatMap(([leftoversRef, upstreamDoneRef]) => {
    const upstreamMarker = core.readWith({
      onInput: input => (0, Function_js_1.pipe)(core.write(input), core.flatMap(() => upstreamMarker)),
      onFailure: core.fail,
      onDone: done => (0, Function_js_1.pipe)(core.fromEffect(Ref.set(upstreamDoneRef, true)), channel.as(done))
    });
    return (0, Function_js_1.pipe)(upstreamMarker, core.pipeTo(channel.bufferChunk(leftoversRef)), core.pipeTo(collectAllWhileWithLoop(self, leftoversRef, upstreamDoneRef, options.initial, options.while, options.body)));
  }));
  return new SinkImpl(newChannel);
});
/** @internal */
const collectAllWhileWithLoop = (self, leftoversRef, upstreamDoneRef, currentResult, p, f) => {
  return (0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.doneCollect, channel.foldChannel({
    onFailure: core.fail,
    onSuccess: ([leftovers, doneValue]) => p(doneValue) ? (0, Function_js_1.pipe)(core.fromEffect(Ref.set(leftoversRef, Chunk.flatten(leftovers))), core.flatMap(() => (0, Function_js_1.pipe)(core.fromEffect(Ref.get(upstreamDoneRef)), core.flatMap(upstreamDone => {
      const accumulatedResult = f(currentResult, doneValue);
      return upstreamDone ? (0, Function_js_1.pipe)(core.write(Chunk.flatten(leftovers)), channel.as(accumulatedResult)) : collectAllWhileWithLoop(self, leftoversRef, upstreamDoneRef, accumulatedResult, p, f);
    })))) : (0, Function_js_1.pipe)(core.write(Chunk.flatten(leftovers)), channel.as(currentResult))
  }));
};
/** @internal */
const collectLeftover = self => new SinkImpl((0, Function_js_1.pipe)(core.collectElements((0, exports.toChannel)(self)), channel.map(([chunks, z]) => [z, Chunk.flatten(chunks)])));
exports.collectLeftover = collectLeftover;
/** @internal */
exports.mapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.mapInputChunks)(Chunk.map(f))));
/** @internal */
exports.mapInputEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapInputChunksEffect)(self, chunk => Effect.map(Effect.forEach(chunk, v => f(v)), Chunk.unsafeFromArray)));
/** @internal */
exports.mapInputChunks = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const loop = core.readWith({
    onInput: chunk => (0, Function_js_1.pipe)(core.write(f(chunk)), core.flatMap(() => loop)),
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new SinkImpl((0, Function_js_1.pipe)(loop, core.pipeTo((0, exports.toChannel)(self))));
});
/** @internal */
exports.mapInputChunksEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const loop = core.readWith({
    onInput: chunk => (0, Function_js_1.pipe)(core.fromEffect(f(chunk)), core.flatMap(core.write), core.flatMap(() => loop)),
    onFailure: core.fail,
    onDone: core.succeed
  });
  return new SinkImpl((0, Function_js_1.pipe)(loop, channel.pipeToOrFail((0, exports.toChannel)(self))));
});
/** @internal */
const die = defect => (0, exports.failCause)(Cause.die(defect));
exports.die = die;
/** @internal */
const dieMessage = message => (0, exports.failCause)(Cause.die(Cause.RuntimeException(message)));
exports.dieMessage = dieMessage;
/** @internal */
const dieSync = evaluate => (0, exports.failCauseSync)(() => Cause.die(evaluate()));
exports.dieSync = dieSync;
/** @internal */
exports.dimap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.map)((0, exports.mapInput)(self, options.onInput), options.onDone));
/** @internal */
exports.dimapEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.mapEffect)((0, exports.mapInputEffect)(self, options.onInput), options.onDone));
/** @internal */
exports.dimapChunks = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.map)((0, exports.mapInputChunks)(self, options.onInput), options.onDone));
/** @internal */
exports.dimapChunksEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => (0, exports.mapEffect)((0, exports.mapInputChunksEffect)(self, options.onInput), options.onDone));
/** @internal */
exports.drain = /*#__PURE__*/new SinkImpl( /*#__PURE__*/channel.drain( /*#__PURE__*/channel.identityChannel()));
/** @internal */
const drop = n => (0, exports.suspend)(() => new SinkImpl(dropLoop(n)));
exports.drop = drop;
/** @internal */
const dropLoop = n => core.readWith({
  onInput: input => {
    const dropped = (0, Function_js_1.pipe)(input, Chunk.drop(n));
    const leftover = Math.max(n - input.length, 0);
    const more = Chunk.isEmpty(input) || leftover > 0;
    if (more) {
      return dropLoop(leftover);
    }
    return (0, Function_js_1.pipe)(core.write(dropped), channel.zipRight(channel.identityChannel()));
  },
  onFailure: core.fail,
  onDone: () => core.unit
});
/** @internal */
const dropUntil = predicate => new SinkImpl((0, Function_js_1.pipe)((0, exports.toChannel)((0, exports.dropWhile)(input => !predicate(input))), channel.pipeToOrFail((0, exports.toChannel)((0, exports.drop)(1)))));
exports.dropUntil = dropUntil;
/** @internal */
const dropUntilEffect = predicate => (0, exports.suspend)(() => new SinkImpl(dropUntilEffectReader(predicate)));
exports.dropUntilEffect = dropUntilEffect;
/** @internal */
const dropUntilEffectReader = predicate => core.readWith({
  onInput: input => (0, Function_js_1.pipe)(input, Effect.dropUntil(predicate), Effect.map(leftover => {
    const more = leftover.length === 0;
    return more ? dropUntilEffectReader(predicate) : (0, Function_js_1.pipe)(core.write(Chunk.unsafeFromArray(leftover)), channel.zipRight(channel.identityChannel()));
  }), channel.unwrap),
  onFailure: core.fail,
  onDone: () => core.unit
});
/** @internal */
const dropWhile = predicate => new SinkImpl(dropWhileReader(predicate));
exports.dropWhile = dropWhile;
/** @internal */
const dropWhileReader = predicate => core.readWith({
  onInput: input => {
    const out = (0, Function_js_1.pipe)(input, Chunk.dropWhile(predicate));
    if (Chunk.isEmpty(out)) {
      return dropWhileReader(predicate);
    }
    return (0, Function_js_1.pipe)(core.write(out), channel.zipRight(channel.identityChannel()));
  },
  onFailure: core.fail,
  onDone: core.succeedNow
});
/** @internal */
const dropWhileEffect = predicate => (0, exports.suspend)(() => new SinkImpl(dropWhileEffectReader(predicate)));
exports.dropWhileEffect = dropWhileEffect;
/** @internal */
const dropWhileEffectReader = predicate => core.readWith({
  onInput: input => (0, Function_js_1.pipe)(input, Effect.dropWhile(predicate), Effect.map(leftover => {
    const more = leftover.length === 0;
    return more ? dropWhileEffectReader(predicate) : (0, Function_js_1.pipe)(core.write(Chunk.unsafeFromArray(leftover)), channel.zipRight(channel.identityChannel()));
  }), channel.unwrap),
  onFailure: core.fail,
  onDone: () => core.unit
});
/** @internal */
exports.ensuring = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => new SinkImpl((0, Function_js_1.pipe)(self, exports.toChannel, channel.ensuring(finalizer))));
/** @internal */
exports.ensuringWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => new SinkImpl((0, Function_js_1.pipe)(self, exports.toChannel, core.ensuringWith(finalizer))));
/** @internal */
const context = () => (0, exports.fromEffect)(Effect.context());
exports.context = context;
/** @internal */
const contextWith = f => (0, Function_js_1.pipe)((0, exports.context)(), (0, exports.map)(f));
exports.contextWith = contextWith;
/** @internal */
const contextWithEffect = f => (0, Function_js_1.pipe)((0, exports.context)(), (0, exports.mapEffect)(f));
exports.contextWithEffect = contextWithEffect;
/** @internal */
const contextWithSink = f => new SinkImpl(channel.unwrap((0, Function_js_1.pipe)(Effect.contextWith(context => (0, exports.toChannel)(f(context))))));
exports.contextWithSink = contextWithSink;
/** @internal */
const every = predicate => (0, exports.fold)(true, Function_js_1.identity, (acc, input) => acc && predicate(input));
exports.every = every;
/** @internal */
const fail = e => new SinkImpl(core.fail(e));
exports.fail = fail;
/** @internal */
const failSync = evaluate => new SinkImpl(core.failSync(evaluate));
exports.failSync = failSync;
/** @internal */
const failCause = cause => new SinkImpl(core.failCause(cause));
exports.failCause = failCause;
/** @internal */
const failCauseSync = evaluate => new SinkImpl(core.failCauseSync(evaluate));
exports.failCauseSync = failCauseSync;
/** @internal */
const filterInput = f => {
  return self => (0, Function_js_1.pipe)(self, (0, exports.mapInputChunks)(Chunk.filter(f)));
};
exports.filterInput = filterInput;
/** @internal */
exports.filterInputEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapInputChunksEffect)(self, chunk => Effect.map(Effect.filter(chunk, f), Chunk.unsafeFromArray)));
/** @internal */
exports.findEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const newChannel = (0, Function_js_1.pipe)(core.fromEffect((0, Function_js_1.pipe)(Ref.make(Chunk.empty()), Effect.zip(Ref.make(false)))), core.flatMap(([leftoversRef, upstreamDoneRef]) => {
    const upstreamMarker = core.readWith({
      onInput: input => (0, Function_js_1.pipe)(core.write(input), core.flatMap(() => upstreamMarker)),
      onFailure: core.fail,
      onDone: done => (0, Function_js_1.pipe)(core.fromEffect(Ref.set(upstreamDoneRef, true)), channel.as(done))
    });
    const loop = channel.foldChannel(core.collectElements((0, exports.toChannel)(self)), {
      onFailure: core.fail,
      onSuccess: ([leftovers, doneValue]) => (0, Function_js_1.pipe)(core.fromEffect(f(doneValue)), core.flatMap(satisfied => (0, Function_js_1.pipe)(core.fromEffect(Ref.set(leftoversRef, Chunk.flatten(leftovers))), channel.zipRight((0, Function_js_1.pipe)(core.fromEffect(Ref.get(upstreamDoneRef)), core.flatMap(upstreamDone => {
        if (satisfied) {
          return (0, Function_js_1.pipe)(core.write(Chunk.flatten(leftovers)), channel.as(Option.some(doneValue)));
        }
        if (upstreamDone) {
          return (0, Function_js_1.pipe)(core.write(Chunk.flatten(leftovers)), channel.as(Option.none()));
        }
        return loop;
      }))))))
    });
    return (0, Function_js_1.pipe)(upstreamMarker, core.pipeTo(channel.bufferChunk(leftoversRef)), core.pipeTo(loop));
  }));
  return new SinkImpl(newChannel);
});
/** @internal */
const fold = (s, contFn, f) => (0, exports.suspend)(() => new SinkImpl(foldReader(s, contFn, f)));
exports.fold = fold;
/** @internal */
const foldReader = (s, contFn, f) => {
  if (!contFn(s)) {
    return core.succeedNow(s);
  }
  return core.readWith({
    onInput: input => {
      const [nextS, leftovers] = foldChunkSplit(s, input, contFn, f, 0, input.length);
      if (Chunk.isNonEmpty(leftovers)) {
        return (0, Function_js_1.pipe)(core.write(leftovers), channel.as(nextS));
      }
      return foldReader(nextS, contFn, f);
    },
    onFailure: core.fail,
    onDone: () => core.succeedNow(s)
  });
};
/** @internal */
const foldChunkSplit = (s, chunk, contFn, f, index, length) => {
  if (index === length) {
    return [s, Chunk.empty()];
  }
  const s1 = f(s, (0, Function_js_1.pipe)(chunk, Chunk.unsafeGet(index)));
  if (contFn(s1)) {
    return foldChunkSplit(s1, chunk, contFn, f, index + 1, length);
  }
  return [s1, (0, Function_js_1.pipe)(chunk, Chunk.drop(index + 1))];
};
/** @internal */
exports.foldSink = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const newChannel = (0, Function_js_1.pipe)((0, exports.toChannel)(self), core.collectElements, channel.foldChannel({
    onFailure: error => (0, exports.toChannel)(options.onFailure(error)),
    onSuccess: ([leftovers, z]) => core.suspend(() => {
      const leftoversRef = {
        ref: (0, Function_js_1.pipe)(leftovers, Chunk.filter(Chunk.isNonEmpty))
      };
      const refReader = (0, Function_js_1.pipe)(core.sync(() => {
        const ref = leftoversRef.ref;
        leftoversRef.ref = Chunk.empty();
        return ref;
      }),
      // This cast is safe because of the L1 >: L <: In1 bound. It follows that
      // L <: In1 and therefore Chunk[L] can be safely cast to Chunk[In1].
      core.flatMap(chunk => channel.writeChunk(chunk)));
      const passthrough = channel.identityChannel();
      const continuationSink = (0, Function_js_1.pipe)(refReader, channel.zipRight(passthrough), core.pipeTo((0, exports.toChannel)(options.onSuccess(z))));
      return core.flatMap(core.collectElements(continuationSink), ([newLeftovers, z1]) => (0, Function_js_1.pipe)(core.succeed(leftoversRef.ref), core.flatMap(channel.writeChunk), channel.zipRight(channel.writeChunk(newLeftovers)), channel.as(z1)));
    })
  }));
  return new SinkImpl(newChannel);
});
/** @internal */
const foldChunks = (s, contFn, f) => (0, exports.suspend)(() => new SinkImpl(foldChunksReader(s, contFn, f)));
exports.foldChunks = foldChunks;
/** @internal */
const foldChunksReader = (s, contFn, f) => {
  if (!contFn(s)) {
    return core.succeedNow(s);
  }
  return core.readWith({
    onInput: input => foldChunksReader(f(s, input), contFn, f),
    onFailure: core.fail,
    onDone: () => core.succeedNow(s)
  });
};
/** @internal */
const foldChunksEffect = (s, contFn, f) => (0, exports.suspend)(() => new SinkImpl(foldChunksEffectReader(s, contFn, f)));
exports.foldChunksEffect = foldChunksEffect;
/** @internal */
const foldChunksEffectReader = (s, contFn, f) => {
  if (!contFn(s)) {
    return core.succeedNow(s);
  }
  return core.readWith({
    onInput: input => (0, Function_js_1.pipe)(core.fromEffect(f(s, input)), core.flatMap(s => foldChunksEffectReader(s, contFn, f))),
    onFailure: core.fail,
    onDone: () => core.succeedNow(s)
  });
};
/** @internal */
const foldEffect = (s, contFn, f) => (0, exports.suspend)(() => new SinkImpl(foldEffectReader(s, contFn, f)));
exports.foldEffect = foldEffect;
/** @internal */
const foldEffectReader = (s, contFn, f) => {
  if (!contFn(s)) {
    return core.succeedNow(s);
  }
  return core.readWith({
    onInput: input => (0, Function_js_1.pipe)(core.fromEffect(foldChunkSplitEffect(s, input, contFn, f)), core.flatMap(([nextS, leftovers]) => (0, Function_js_1.pipe)(leftovers, Option.match({
      onNone: () => foldEffectReader(nextS, contFn, f),
      onSome: leftover => (0, Function_js_1.pipe)(core.write(leftover), channel.as(nextS))
    })))),
    onFailure: core.fail,
    onDone: () => core.succeedNow(s)
  });
};
/** @internal */
const foldChunkSplitEffect = (s, chunk, contFn, f) => foldChunkSplitEffectInternal(s, chunk, 0, chunk.length, contFn, f);
/** @internal */
const foldChunkSplitEffectInternal = (s, chunk, index, length, contFn, f) => {
  if (index === length) {
    return Effect.succeed([s, Option.none()]);
  }
  return (0, Function_js_1.pipe)(f(s, (0, Function_js_1.pipe)(chunk, Chunk.unsafeGet(index))), Effect.flatMap(s1 => contFn(s1) ? foldChunkSplitEffectInternal(s1, chunk, index + 1, length, contFn, f) : Effect.succeed([s1, Option.some((0, Function_js_1.pipe)(chunk, Chunk.drop(index + 1)))])));
};
/** @internal */
const foldLeft = (s, f) => (0, exports.ignoreLeftover)((0, exports.fold)(s, Function_js_1.constTrue, f));
exports.foldLeft = foldLeft;
/** @internal */
const foldLeftChunks = (s, f) => (0, exports.foldChunks)(s, Function_js_1.constTrue, f);
exports.foldLeftChunks = foldLeftChunks;
/** @internal */
const foldLeftChunksEffect = (s, f) => (0, exports.ignoreLeftover)((0, exports.foldChunksEffect)(s, Function_js_1.constTrue, f));
exports.foldLeftChunksEffect = foldLeftChunksEffect;
/** @internal */
const foldLeftEffect = (s, f) => (0, exports.foldEffect)(s, Function_js_1.constTrue, f);
exports.foldLeftEffect = foldLeftEffect;
/** @internal */
const foldUntil = (s, max, f) => (0, Function_js_1.pipe)((0, exports.fold)([s, 0], tuple => tuple[1] < max, ([output, count], input) => [f(output, input), count + 1]), (0, exports.map)(tuple => tuple[0]));
exports.foldUntil = foldUntil;
/** @internal */
const foldUntilEffect = (s, max, f) => (0, Function_js_1.pipe)((0, exports.foldEffect)([s, 0], tuple => tuple[1] < max, ([output, count], input) => (0, Function_js_1.pipe)(f(output, input), Effect.map(s => [s, count + 1]))), (0, exports.map)(tuple => tuple[0]));
exports.foldUntilEffect = foldUntilEffect;
/** @internal */
const foldWeighted = options => (0, exports.foldWeightedDecompose)({
  ...options,
  decompose: Chunk.of
});
exports.foldWeighted = foldWeighted;
/** @internal */
const foldWeightedDecompose = options => (0, exports.suspend)(() => new SinkImpl(foldWeightedDecomposeLoop(options.initial, 0, false, options.maxCost, options.cost, options.decompose, options.body)));
exports.foldWeightedDecompose = foldWeightedDecompose;
/** @internal */
const foldWeightedDecomposeLoop = (s, cost, dirty, max, costFn, decompose, f) => core.readWith({
  onInput: input => {
    const [nextS, nextCost, nextDirty, leftovers] = foldWeightedDecomposeFold(input, 0, s, cost, dirty, max, costFn, decompose, f);
    if (Chunk.isNonEmpty(leftovers)) {
      return (0, Function_js_1.pipe)(core.write(leftovers), channel.zipRight(core.succeedNow(nextS)));
    }
    if (cost > max) {
      return core.succeedNow(nextS);
    }
    return foldWeightedDecomposeLoop(nextS, nextCost, nextDirty, max, costFn, decompose, f);
  },
  onFailure: core.fail,
  onDone: () => core.succeedNow(s)
});
/** @internal */
const foldWeightedDecomposeFold = (input, index, s, cost, dirty, max, costFn, decompose, f) => {
  if (index === input.length) {
    return [s, cost, dirty, Chunk.empty()];
  }
  const elem = (0, Function_js_1.pipe)(input, Chunk.unsafeGet(index));
  const total = cost + costFn(s, elem);
  if (total <= max) {
    return foldWeightedDecomposeFold(input, index + 1, f(s, elem), total, true, max, costFn, decompose, f);
  }
  const decomposed = decompose(elem);
  if (decomposed.length <= 1 && !dirty) {
    // If `elem` cannot be decomposed, we need to cross the `max` threshold. To
    // minimize "injury", we only allow this when we haven't added anything else
    // to the aggregate (dirty = false).
    return [f(s, elem), total, true, (0, Function_js_1.pipe)(input, Chunk.drop(index + 1))];
  }
  if (decomposed.length <= 1 && dirty) {
    // If the state is dirty and `elem` cannot be decomposed, we stop folding
    // and include `elem` in the leftovers.
    return [s, cost, dirty, (0, Function_js_1.pipe)(input, Chunk.drop(index))];
  }
  // `elem` got decomposed, so we will recurse with the decomposed elements pushed
  // into the chunk we're processing and see if we can aggregate further.
  const next = (0, Function_js_1.pipe)(decomposed, Chunk.appendAll((0, Function_js_1.pipe)(input, Chunk.drop(index + 1))));
  return foldWeightedDecomposeFold(next, 0, s, cost, dirty, max, costFn, decompose, f);
};
/** @internal */
const foldWeightedDecomposeEffect = options => (0, exports.suspend)(() => new SinkImpl(foldWeightedDecomposeEffectLoop(options.initial, options.maxCost, options.cost, options.decompose, options.body, 0, false)));
exports.foldWeightedDecomposeEffect = foldWeightedDecomposeEffect;
/** @internal */
const foldWeightedEffect = options => (0, exports.foldWeightedDecomposeEffect)({
  ...options,
  decompose: input => Effect.succeed(Chunk.of(input))
});
exports.foldWeightedEffect = foldWeightedEffect;
/** @internal */
const foldWeightedDecomposeEffectLoop = (s, max, costFn, decompose, f, cost, dirty) => core.readWith({
  onInput: input => (0, Function_js_1.pipe)(core.fromEffect(foldWeightedDecomposeEffectFold(s, max, costFn, decompose, f, input, dirty, cost, 0)), core.flatMap(([nextS, nextCost, nextDirty, leftovers]) => {
    if (Chunk.isNonEmpty(leftovers)) {
      return (0, Function_js_1.pipe)(core.write(leftovers), channel.zipRight(core.succeedNow(nextS)));
    }
    if (cost > max) {
      return core.succeedNow(nextS);
    }
    return foldWeightedDecomposeEffectLoop(nextS, max, costFn, decompose, f, nextCost, nextDirty);
  })),
  onFailure: core.fail,
  onDone: () => core.succeedNow(s)
});
/** @internal */
const foldWeightedDecomposeEffectFold = (s, max, costFn, decompose, f, input, dirty, cost, index) => {
  if (index === input.length) {
    return Effect.succeed([s, cost, dirty, Chunk.empty()]);
  }
  const elem = (0, Function_js_1.pipe)(input, Chunk.unsafeGet(index));
  return (0, Function_js_1.pipe)(costFn(s, elem), Effect.map(newCost => cost + newCost), Effect.flatMap(total => {
    if (total <= max) {
      return (0, Function_js_1.pipe)(f(s, elem), Effect.flatMap(s => foldWeightedDecomposeEffectFold(s, max, costFn, decompose, f, input, true, total, index + 1)));
    }
    return (0, Function_js_1.pipe)(decompose(elem), Effect.flatMap(decomposed => {
      if (decomposed.length <= 1 && !dirty) {
        // If `elem` cannot be decomposed, we need to cross the `max` threshold. To
        // minimize "injury", we only allow this when we haven't added anything else
        // to the aggregate (dirty = false).
        return (0, Function_js_1.pipe)(f(s, elem), Effect.map(s => [s, total, true, (0, Function_js_1.pipe)(input, Chunk.drop(index + 1))]));
      }
      if (decomposed.length <= 1 && dirty) {
        // If the state is dirty and `elem` cannot be decomposed, we stop folding
        // and include `elem` in th leftovers.
        return Effect.succeed([s, cost, dirty, (0, Function_js_1.pipe)(input, Chunk.drop(index))]);
      }
      // `elem` got decomposed, so we will recurse with the decomposed elements pushed
      // into the chunk we're processing and see if we can aggregate further.
      const next = (0, Function_js_1.pipe)(decomposed, Chunk.appendAll((0, Function_js_1.pipe)(input, Chunk.drop(index + 1))));
      return foldWeightedDecomposeEffectFold(s, max, costFn, decompose, f, next, dirty, cost, 0);
    }));
  }));
};
/** @internal */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.foldSink)(self, {
  onFailure: exports.fail,
  onSuccess: f
}));
/** @internal */
const forEach = f => {
  const process = core.readWithCause({
    onInput: input => (0, Function_js_1.pipe)(core.fromEffect(Effect.forEach(input, v => f(v), {
      discard: true
    })), core.flatMap(() => process)),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new SinkImpl(process);
};
exports.forEach = forEach;
/** @internal */
const forEachChunk = f => {
  const process = core.readWithCause({
    onInput: input => (0, Function_js_1.pipe)(core.fromEffect(f(input)), core.flatMap(() => process)),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new SinkImpl(process);
};
exports.forEachChunk = forEachChunk;
/** @internal */
const forEachWhile = f => {
  const process = core.readWithCause({
    onInput: input => forEachWhileReader(f, input, 0, input.length, process),
    onFailure: core.failCause,
    onDone: () => core.unit
  });
  return new SinkImpl(process);
};
exports.forEachWhile = forEachWhile;
/** @internal */
const forEachWhileReader = (f, input, index, length, cont) => {
  if (index === length) {
    return cont;
  }
  return (0, Function_js_1.pipe)(core.fromEffect(f((0, Function_js_1.pipe)(input, Chunk.unsafeGet(index)))), core.flatMap(bool => bool ? forEachWhileReader(f, input, index + 1, length, cont) : core.write((0, Function_js_1.pipe)(input, Chunk.drop(index)))), channel.catchAll(error => (0, Function_js_1.pipe)(core.write((0, Function_js_1.pipe)(input, Chunk.drop(index))), channel.zipRight(core.fail(error)))));
};
/** @internal */
const forEachChunkWhile = f => {
  const reader = core.readWith({
    onInput: input => (0, Function_js_1.pipe)(core.fromEffect(f(input)), core.flatMap(cont => cont ? reader : core.unit)),
    onFailure: core.fail,
    onDone: () => core.unit
  });
  return new SinkImpl(reader);
};
exports.forEachChunkWhile = forEachChunkWhile;
/** @internal */
const fromChannel = channel => new SinkImpl(channel);
exports.fromChannel = fromChannel;
/** @internal */
const fromEffect = effect => new SinkImpl(core.fromEffect(effect));
exports.fromEffect = fromEffect;
/** @internal */
const fromPubSub = (pubsub, options) => (0, exports.fromQueue)(pubsub, options);
exports.fromPubSub = fromPubSub;
/** @internal */
const fromPush = push => new SinkImpl(channel.unwrapScoped((0, Function_js_1.pipe)(push, Effect.map(fromPushPull))));
exports.fromPush = fromPush;
const fromPushPull = push => core.readWith({
  onInput: input => channel.foldChannel(core.fromEffect(push(Option.some(input))), {
    onFailure: ([either, leftovers]) => Either.match(either, {
      onLeft: error => (0, Function_js_1.pipe)(core.write(leftovers), channel.zipRight(core.fail(error))),
      onRight: z => (0, Function_js_1.pipe)(core.write(leftovers), channel.zipRight(core.succeedNow(z)))
    }),
    onSuccess: () => fromPushPull(push)
  }),
  onFailure: core.fail,
  onDone: () => channel.foldChannel(core.fromEffect(push(Option.none())), {
    onFailure: ([either, leftovers]) => Either.match(either, {
      onLeft: error => (0, Function_js_1.pipe)(core.write(leftovers), channel.zipRight(core.fail(error))),
      onRight: z => (0, Function_js_1.pipe)(core.write(leftovers), channel.zipRight(core.succeedNow(z)))
    }),
    onSuccess: () => core.fromEffect(Effect.dieMessage("BUG: Sink.fromPush - please report an issue at https://github.com/Effect-TS/stream/issues"))
  })
});
/** @internal */
const fromQueue = (queue, options) => options?.shutdown ? (0, exports.unwrapScoped)(Effect.map(Effect.acquireRelease(Effect.succeed(queue), Queue.shutdown), exports.fromQueue)) : (0, exports.forEachChunk)(input => (0, Function_js_1.pipe)(Queue.offerAll(queue, input)));
exports.fromQueue = fromQueue;
/** @internal */
const head = () => (0, exports.fold)(Option.none(), Option.isNone, (option, input) => Option.match(option, {
  onNone: () => Option.some(input),
  onSome: () => option
}));
exports.head = head;
/** @internal */
const ignoreLeftover = self => new SinkImpl(channel.drain((0, exports.toChannel)(self)));
exports.ignoreLeftover = ignoreLeftover;
/** @internal */
const last = () => (0, exports.foldLeftChunks)(Option.none(), (s, input) => Option.orElse(Chunk.last(input), () => s));
exports.last = last;
/** @internal */
const leftover = chunk => new SinkImpl(core.suspend(() => core.write(chunk)));
exports.leftover = leftover;
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  return new SinkImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.map(f)));
});
/** @internal */
exports.mapEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new SinkImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.mapEffect(f))));
/** @internal */
exports.mapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new SinkImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.mapError(f))));
/** @internal */
exports.mapLeftover = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new SinkImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.mapOut(Chunk.map(f)))));
/** @internal */
exports.never = /*#__PURE__*/(0, exports.fromEffect)(Effect.never);
/** @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => new SinkImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), channel.orElse(() => (0, exports.toChannel)(that())))));
/** @internal */
exports.provideContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, context) => new SinkImpl((0, Function_js_1.pipe)((0, exports.toChannel)(self), core.provideContext(context))));
/** @internal */
exports.race = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.raceBoth)(that), (0, exports.map)(Either.merge)));
/** @internal */
exports.raceBoth = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isSink)(args[1]), (self, that, options) => (0, exports.raceWith)(self, {
  other: that,
  onSelfDone: selfDone => mergeDecision.Done(Effect.map(selfDone, Either.left)),
  onOtherDone: thatDone => mergeDecision.Done(Effect.map(thatDone, Either.right)),
  capacity: options?.capacity ?? 16
}));
/** @internal */
exports.raceWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const scoped = Effect.gen(function* ($) {
    const pubsub = yield* $(PubSub.bounded(options?.capacity ?? 16));
    const channel1 = yield* $(channel.fromPubSubScoped(pubsub));
    const channel2 = yield* $(channel.fromPubSubScoped(pubsub));
    const reader = channel.toPubSub(pubsub);
    const writer = (0, Function_js_1.pipe)(channel1, core.pipeTo((0, exports.toChannel)(self)), channel.mergeWith({
      other: (0, Function_js_1.pipe)(channel2, core.pipeTo((0, exports.toChannel)(options.other))),
      onSelfDone: options.onSelfDone,
      onOtherDone: options.onOtherDone
    }));
    const racedChannel = channel.mergeWith(reader, {
      other: writer,
      onSelfDone: _ => mergeDecision.Await(exit => Effect.suspend(() => exit)),
      onOtherDone: done => mergeDecision.Done(Effect.suspend(() => done))
    });
    return new SinkImpl(racedChannel);
  });
  return (0, exports.unwrapScoped)(scoped);
});
/** @internal */
exports.refineOrDie = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)(self, (0, exports.refineOrDieWith)(pf, Function_js_1.identity)));
/** @internal */
exports.refineOrDieWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, pf, f) => {
  const newChannel = (0, Function_js_1.pipe)(self, exports.toChannel, channel.catchAll(error => Option.match(pf(error), {
    onNone: () => core.failCauseSync(() => Cause.die(f(error))),
    onSome: core.fail
  })));
  return new SinkImpl(newChannel);
});
/** @internal */
const service = tag => (0, exports.serviceWith)(tag, Function_js_1.identity);
exports.service = service;
/** @internal */
const serviceWith = (tag, f) => (0, exports.fromEffect)(Effect.map(tag, f));
exports.serviceWith = serviceWith;
/** @internal */
const serviceWithEffect = (tag, f) => (0, exports.fromEffect)(Effect.flatMap(tag, f));
exports.serviceWithEffect = serviceWithEffect;
/** @internal */
const serviceWithSink = (tag, f) => new SinkImpl((0, Function_js_1.pipe)(Effect.map(tag, service => (0, exports.toChannel)(f(service))), channel.unwrap));
exports.serviceWithSink = serviceWithSink;
/** @internal */
const some = predicate => (0, exports.fold)(false, bool => !bool, (acc, input) => acc || predicate(input));
exports.some = some;
/** @internal */
exports.splitWhere = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const newChannel = (0, Function_js_1.pipe)(core.fromEffect(Ref.make(Chunk.empty())), core.flatMap(ref => (0, Function_js_1.pipe)(splitWhereSplitter(false, ref, f), channel.pipeToOrFail((0, exports.toChannel)(self)), core.collectElements, core.flatMap(([leftovers, z]) => (0, Function_js_1.pipe)(core.fromEffect(Ref.get(ref)), core.flatMap(leftover => (0, Function_js_1.pipe)(core.write((0, Function_js_1.pipe)(leftover, Chunk.appendAll(Chunk.flatten(leftovers)))), channel.zipRight(core.succeed(z)))))))));
  return new SinkImpl(newChannel);
});
/** @internal */
const splitWhereSplitter = (written, leftovers, f) => core.readWithCause({
  onInput: input => {
    if (Chunk.isEmpty(input)) {
      return splitWhereSplitter(written, leftovers, f);
    }
    if (written) {
      const index = indexWhere(input, f);
      if (index === -1) {
        return channel.zipRight(core.write(input), splitWhereSplitter(true, leftovers, f));
      }
      const [left, right] = Chunk.splitAt(input, index);
      return channel.zipRight(core.write(left), core.fromEffect(Ref.set(leftovers, right)));
    }
    const index = indexWhere(input, f, 1);
    if (index === -1) {
      return channel.zipRight(core.write(input), splitWhereSplitter(true, leftovers, f));
    }
    const [left, right] = (0, Function_js_1.pipe)(input, Chunk.splitAt(Math.max(index, 1)));
    return channel.zipRight(core.write(left), core.fromEffect(Ref.set(leftovers, right)));
  },
  onFailure: core.failCause,
  onDone: core.succeed
});
/** @internal */
const indexWhere = (self, predicate, from = 0) => {
  const iterator = self[Symbol.iterator]();
  let index = 0;
  let result = -1;
  let next;
  while (result < 0 && (next = iterator.next()) && !next.done) {
    const a = next.value;
    if (index >= from && predicate(a)) {
      result = index;
    }
    index = index + 1;
  }
  return result;
};
/** @internal */
const succeed = z => new SinkImpl(core.succeed(z));
exports.succeed = succeed;
/** @internal */
exports.sum = /*#__PURE__*/(0, exports.foldLeftChunks)(0, (acc, chunk) => acc + Chunk.reduce(chunk, 0, (s, a) => s + a));
/** @internal */
exports.summarized = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, summary, f) => {
  const newChannel = (0, Function_js_1.pipe)(core.fromEffect(summary), core.flatMap(start => (0, Function_js_1.pipe)(self, exports.toChannel, core.flatMap(done => (0, Function_js_1.pipe)(core.fromEffect(summary), channel.map(end => [done, f(start, end)]))))));
  return new SinkImpl(newChannel);
});
/** @internal */
const sync = evaluate => new SinkImpl(core.sync(evaluate));
exports.sync = sync;
/** @internal */
const take = n => (0, Function_js_1.pipe)((0, exports.foldChunks)(Chunk.empty(), chunk => chunk.length < n, (acc, chunk) => (0, Function_js_1.pipe)(acc, Chunk.appendAll(chunk))), (0, exports.flatMap)(acc => {
  const [taken, leftover] = (0, Function_js_1.pipe)(acc, Chunk.splitAt(n));
  return new SinkImpl((0, Function_js_1.pipe)(core.write(leftover), channel.zipRight(core.succeedNow(taken))));
}));
exports.take = take;
/** @internal */
const toChannel = self => Effect.isEffect(self) ? (0, exports.toChannel)((0, exports.fromEffect)(self)) : self.channel;
exports.toChannel = toChannel;
/** @internal */
const unwrap = effect => new SinkImpl(channel.unwrap((0, Function_js_1.pipe)(effect, Effect.map(sink => (0, exports.toChannel)(sink)))));
exports.unwrap = unwrap;
/** @internal */
const unwrapScoped = effect => {
  return new SinkImpl(channel.unwrapScoped((0, Function_js_1.pipe)(effect, Effect.map(sink => (0, exports.toChannel)(sink)))));
};
exports.unwrapScoped = unwrapScoped;
/** @internal */
const withDuration = self => (0, Function_js_1.pipe)(self, (0, exports.summarized)(Clock.currentTimeMillis, (start, end) => Duration.millis(end - start)));
exports.withDuration = withDuration;
/** @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isSink)(args[1]), (self, that, options) => (0, exports.zipWith)(self, that, (z, z2) => [z, z2], options));
/** @internal */
exports.zipLeft = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isSink)(args[1]), (self, that, options) => (0, exports.zipWith)(self, that, (z, _) => z, options));
/** @internal */
exports.zipRight = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isSink)(args[1]), (self, that, options) => (0, exports.zipWith)(self, that, (_, z2) => z2, options));
/** @internal */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isSink)(args[1]), (self, that, f, options) => options?.concurrent ? (0, exports.raceWith)(self, {
  other: that,
  onSelfDone: Exit.match({
    onFailure: cause => mergeDecision.Done(Effect.failCause(cause)),
    onSuccess: leftZ => mergeDecision.Await(Exit.match({
      onFailure: Effect.failCause,
      onSuccess: rightZ => Effect.succeed(f(leftZ, rightZ))
    }))
  }),
  onOtherDone: Exit.match({
    onFailure: cause => mergeDecision.Done(Effect.failCause(cause)),
    onSuccess: rightZ => mergeDecision.Await(Exit.match({
      onFailure: Effect.failCause,
      onSuccess: leftZ => Effect.succeed(f(leftZ, rightZ))
    }))
  })
}) : (0, exports.flatMap)(self, z => (0, exports.map)(that, z2 => f(z, z2))));
// Circular with Channel
/** @internal */
const channelToSink = self => new SinkImpl(self);
exports.channelToSink = channelToSink;
// Constants
/** @internal */
exports.count = /*#__PURE__*/(0, exports.foldLeftChunks)(0, (acc, chunk) => acc + chunk.length);
/** @internal */
exports.mkString = /*#__PURE__*/(0, exports.suspend)(() => {
  const strings = [];
  return (0, Function_js_1.pipe)((0, exports.foldLeftChunks)(void 0, (_, elems) => Chunk.map(elems, elem => {
    strings.push(String(elem));
  })), (0, exports.map)(() => strings.join("")));
});
/** @internal */
exports.timed = /*#__PURE__*/(0, Function_js_1.pipe)( /*#__PURE__*/(0, exports.withDuration)(exports.drain), /*#__PURE__*/(0, exports.map)(tuple => tuple[1]));
//# sourceMappingURL=sink.js.map