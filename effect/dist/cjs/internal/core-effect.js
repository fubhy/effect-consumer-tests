"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logTrace = exports.log = exports.iterate = exports.isSuccess = exports.isFailure = exports.inheritFiberRefs = exports.ignoreLogged = exports.ignore = exports.head = exports.fiberRefs = exports.gen = exports.forever = exports.every = exports.match = exports.flipWith = exports.firstSuccessOf = exports.findFirst = exports.filterOrFail = exports.filterOrElse = exports.filterOrDieMessage = exports.filterOrDie = exports.filterMap = exports.eventually = exports.contextWith = exports.dropWhile = exports.dropUntil = exports.bindValue = exports.bindTo = exports.bind = exports.Do = exports.diffFiberRefsAndRuntimeFlags = exports.diffFiberRefs = exports.descriptor = exports.allowInterrupt = exports.descriptorWith = exports.delay = exports.clock = exports.clockWith = exports.cause = exports.catchTags = exports.catchTag = exports.catchSomeDefect = exports.catchSomeCause = exports.catchAllDefect = exports._catch = exports.try_ = exports.asyncOption = exports.asSomeError = exports.asSome = exports.annotateLogs = void 0;
exports.tryMap = exports.tryPromise = exports.tracer = exports.tracerWith = exports.timedWith = exports.timed = exports.tapErrorCause = exports.tapErrorTag = exports.tapError = exports.tapDefect = exports.tapBoth = exports.takeWhile = exports.takeUntil = exports.labelMetricsSet = exports.labelMetrics = exports.tagMetrics = exports.summarized = exports.succeedSome = exports.succeedNone = exports.sleep = exports.setFiberRefs = exports.sandbox = exports.repeatN = exports.reduceWhile = exports.reduceRight = exports.reduce = exports.random = exports.provideServiceEffect = exports.provideService = exports.promise = exports.patchFiberRefs = exports.parallelErrors = exports.orElseSucceed = exports.orElseFail = exports.option = exports.once = exports.none = exports.negate = exports.merge = exports.memoize = exports.mapErrorCause = exports.mapAccum = exports.loop = exports.logAnnotations = exports.withLogSpan = exports.logFatal = exports.logError = exports.logWarning = exports.logInfo = exports.logDebug = void 0;
exports.optionFromOptional = exports.fromNullable = exports.withSpan = exports.withParentSpan = exports.useSpan = exports.spanLinks = exports.spanAnnotations = exports.makeSpan = exports.linkSpans = exports.currentTimeNanosTracing = exports.currentSpan = exports.currentParentSpan = exports.annotateSpans = exports.annotateCurrentSpan = exports.serviceOption = exports.serviceMembers = exports.serviceConstants = exports.serviceFunctions = exports.serviceFunction = exports.serviceFunctionEffect = exports.withMetric = exports.whenRef = exports.whenFiberRef = exports.when = exports.updateService = exports.updateFiberRefs = exports.unsandbox = exports.unlessEffect = exports.unless = exports.tryMapPromise = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Clock = /*#__PURE__*/require("../Clock.js");
const Context = /*#__PURE__*/require("../Context.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Either = /*#__PURE__*/require("../Either.js");
const FiberId = /*#__PURE__*/require("../FiberId.js");
const FiberRefs = /*#__PURE__*/require("../FiberRefs.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const List = /*#__PURE__*/require("../List.js");
const LogLevel = /*#__PURE__*/require("../LogLevel.js");
const LogSpan = /*#__PURE__*/require("../LogSpan.js");
const Option = /*#__PURE__*/require("../Option.js");
const Predicate = /*#__PURE__*/require("../Predicate.js");
const ReadonlyArray = /*#__PURE__*/require("../ReadonlyArray.js");
const Ref = /*#__PURE__*/require("../Ref.js");
const Tracer = /*#__PURE__*/require("../Tracer.js");
const internalCause = /*#__PURE__*/require("./cause.js");
const core = /*#__PURE__*/require("./core.js");
const defaultServices = /*#__PURE__*/require("./defaultServices.js");
const fiberRefsPatch = /*#__PURE__*/require("./fiberRefs/patch.js");
const metricLabel = /*#__PURE__*/require("./metric/label.js");
const runtimeFlags = /*#__PURE__*/require("./runtimeFlags.js");
const SingleShotGen = /*#__PURE__*/require("./singleShotGen.js");
const internalTracer = /*#__PURE__*/require("./tracer.js");
/* @internal */
exports.annotateLogs = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), function () {
  const args = arguments;
  return core.fiberRefLocallyWith(args[0], core.currentLogAnnotations, typeof args[1] === "string" ? HashMap.set(args[1], args[2]) : annotations => Object.entries(args[1]).reduce((acc, [key, value]) => HashMap.set(acc, key, value), annotations));
});
/* @internal */
const asSome = self => core.map(self, Option.some);
exports.asSome = asSome;
/* @internal */
const asSomeError = self => core.mapError(self, Option.some);
exports.asSomeError = asSomeError;
/* @internal */
const asyncOption = (register, blockingOn = FiberId.none) => core.asyncEither(cb => {
  const option = register(cb);
  switch (option._tag) {
    case "None":
      {
        return Either.left(core.unit);
      }
    case "Some":
      {
        return Either.right(option.value);
      }
  }
}, blockingOn);
exports.asyncOption = asyncOption;
/* @internal */
const try_ = arg => {
  let evaluate;
  let onFailure = undefined;
  if (typeof arg === "function") {
    evaluate = arg;
  } else {
    evaluate = arg.try;
    onFailure = arg.catch;
  }
  return core.sync(() => {
    try {
      return evaluate();
    } catch (error) {
      throw core.makeEffectError(internalCause.fail(onFailure ? onFailure(error) : error));
    }
  });
};
exports.try_ = try_;
/* @internal */
exports._catch = /*#__PURE__*/(0, Function_js_1.dual)(
// @ts-expect-error
3, (self, tag, options) => core.catchAll(self, e => {
  if (Predicate.hasProperty(e, tag) && e[tag] === options.failure) {
    return options.onFailure(e);
  }
  return core.fail(e);
}));
/* @internal */
exports.catchAllDefect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.catchAllCause(self, core.unified(cause => {
  const option = internalCause.find(cause, _ => internalCause.isDieType(_) ? Option.some(_) : Option.none());
  switch (option._tag) {
    case "None":
      {
        return core.failCause(cause);
      }
    case "Some":
      {
        return f(option.value.defect);
      }
  }
})));
/* @internal */
exports.catchSomeCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.matchCauseEffect(self, {
  onFailure: cause => {
    const option = f(cause);
    switch (option._tag) {
      case "None":
        {
          return core.failCause(cause);
        }
      case "Some":
        {
          return option.value;
        }
    }
  },
  onSuccess: core.succeed
}));
/* @internal */
exports.catchSomeDefect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => core.catchAllCause(self, core.unified(cause => {
  const option = internalCause.find(cause, _ => internalCause.isDieType(_) ? Option.some(_) : Option.none());
  switch (option._tag) {
    case "None":
      {
        return core.failCause(cause);
      }
    case "Some":
      {
        const optionEffect = pf(option.value.defect);
        return optionEffect._tag === "Some" ? optionEffect.value : core.failCause(cause);
      }
  }
})));
/* @internal */
exports.catchTag = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, k, f) => core.catchIf(self, Predicate.isTagged(k), f));
/** @internal */
exports.catchTags = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cases) => {
  let keys;
  return core.catchIf(self, e => {
    keys ??= Object.keys(cases);
    return Predicate.hasProperty(e, "_tag") && Predicate.isString(e["_tag"]) && keys.includes(e["_tag"]);
  }, e => cases[e["_tag"]](e));
});
/* @internal */
const cause = self => core.matchCause(self, {
  onFailure: Function_js_1.identity,
  onSuccess: () => internalCause.empty
});
exports.cause = cause;
/* @internal */
exports.clockWith = Clock.clockWith;
/* @internal */
exports.clock = /*#__PURE__*/(0, exports.clockWith)(core.succeed);
/* @internal */
exports.delay = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, duration) => core.zipRight(Clock.sleep(duration), self));
/* @internal */
const descriptorWith = f => core.withFiberRuntime((state, status) => f({
  id: state.id(),
  status,
  interruptors: internalCause.interruptors(state.getFiberRef(core.currentInterruptedCause))
}));
exports.descriptorWith = descriptorWith;
/* @internal */
exports.allowInterrupt = /*#__PURE__*/(0, exports.descriptorWith)(descriptor => HashSet.size(descriptor.interruptors) > 0 ? core.interrupt : core.unit);
/* @internal */
exports.descriptor = /*#__PURE__*/(0, exports.descriptorWith)(core.succeed);
/* @internal */
const diffFiberRefs = self => (0, exports.summarized)(self, exports.fiberRefs, fiberRefsPatch.diff);
exports.diffFiberRefs = diffFiberRefs;
/* @internal */
const diffFiberRefsAndRuntimeFlags = self => (0, exports.summarized)(self, core.zip(exports.fiberRefs, core.runtimeFlags), ([refs, flags], [refsNew, flagsNew]) => [fiberRefsPatch.diff(refs, refsNew), runtimeFlags.diff(flags, flagsNew)]);
exports.diffFiberRefsAndRuntimeFlags = diffFiberRefsAndRuntimeFlags;
/* @internal */
exports.Do = /*#__PURE__*/core.succeed({});
/* @internal */
exports.bind = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, f) => core.flatMap(self, k => core.map(f(k), a => ({
  ...k,
  [tag]: a
}))));
/* @internal */
exports.bindTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, tag) => core.map(self, a => ({
  [tag]: a
})));
/* @internal */
exports.bindValue = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, f) => core.map(self, k => ({
  ...k,
  [tag]: f(k)
})));
/* @internal */
exports.dropUntil = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, predicate) => core.suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next;
  let dropping = core.succeed(false);
  let i = 0;
  while ((next = iterator.next()) && !next.done) {
    const a = next.value;
    const index = i++;
    dropping = core.flatMap(dropping, bool => {
      if (bool) {
        builder.push(a);
        return core.succeed(true);
      }
      return predicate(a, index);
    });
  }
  return core.map(dropping, () => builder);
}));
/* @internal */
exports.dropWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, f) => core.suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next;
  let dropping = core.succeed(true);
  let i = 0;
  while ((next = iterator.next()) && !next.done) {
    const a = next.value;
    const index = i++;
    dropping = core.flatMap(dropping, d => core.map(d ? f(a, index) : core.succeed(false), b => {
      if (!b) {
        builder.push(a);
      }
      return b;
    }));
  }
  return core.map(dropping, () => builder);
}));
/* @internal */
const contextWith = f => core.map(core.context(), f);
exports.contextWith = contextWith;
/* @internal */
const eventually = self => core.orElse(self, () => core.flatMap(core.yieldNow(), () => (0, exports.eventually)(self)));
exports.eventually = eventually;
/* @internal */
exports.filterMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, pf) => core.map(core.forEachSequential(elements, Function_js_1.identity), ReadonlyArray.filterMap(pf)));
/* @internal */
exports.filterOrDie = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, filter, orDieWith) => (0, exports.filterOrElse)(self, filter, a => core.dieSync(() => orDieWith(a))));
/* @internal */
exports.filterOrDieMessage = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, filter, message) => (0, exports.filterOrElse)(self, filter, () => core.dieMessage(message)));
/* @internal */
exports.filterOrElse = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, filter, orElse) => core.flatMap(self, a => filter(a) ? core.succeed(a) : orElse(a)));
/* @internal */
exports.filterOrFail = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, filter, orFailWith) => (0, exports.filterOrElse)(self, filter, a => core.failSync(() => orFailWith(a))));
/* @internal */
exports.findFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, f) => core.suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const next = iterator.next();
  if (!next.done) {
    return findLoop(iterator, 0, f, next.value);
  }
  return core.succeed(Option.none());
}));
const findLoop = (iterator, index, f, value) => core.flatMap(f(value, index), result => {
  if (result) {
    return core.succeed(Option.some(value));
  }
  const next = iterator.next();
  if (!next.done) {
    return findLoop(iterator, index + 1, f, next.value);
  }
  return core.succeed(Option.none());
});
/* @internal */
const firstSuccessOf = effects => core.suspend(() => {
  const list = Chunk.fromIterable(effects);
  if (!Chunk.isNonEmpty(list)) {
    return core.dieSync(() => internalCause.IllegalArgumentException(`Received an empty collection of effects`));
  }
  return (0, Function_js_1.pipe)(Chunk.tailNonEmpty(list), ReadonlyArray.reduce(Chunk.headNonEmpty(list), (left, right) => core.orElse(left, () => right)));
});
exports.firstSuccessOf = firstSuccessOf;
/* @internal */
exports.flipWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.flip(f(core.flip(self))));
/* @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => core.matchEffect(self, {
  onFailure: e => core.succeed(onFailure(e)),
  onSuccess: a => core.succeed(onSuccess(a))
}));
/* @internal */
exports.every = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, f) => core.suspend(() => forAllLoop(elements[Symbol.iterator](), 0, f)));
const forAllLoop = (iterator, index, f) => {
  const next = iterator.next();
  return next.done ? core.succeed(true) : core.flatMap(f(next.value, index), b => b ? forAllLoop(iterator, index + 1, f) : core.succeed(b));
};
/* @internal */
const forever = self => {
  const loop = core.flatMap(core.flatMap(self, () => core.yieldNow()), () => loop);
  return loop;
};
exports.forever = forever;
/** @internal */
class EffectGen {
  value;
  constructor(value) {
    this.value = value;
  }
  [Symbol.iterator]() {
    return new SingleShotGen.SingleShotGen(this);
  }
}
const adapter = function () {
  let x = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    x = arguments[i](x);
  }
  return new EffectGen(x);
};
/**
 * Inspired by https://github.com/tusharmath/qio/pull/22 (revised)
  @internal */
const gen = function () {
  let f;
  if (arguments.length === 1) {
    f = arguments[0];
  } else {
    f = arguments[1].bind(arguments[0]);
  }
  return core.suspend(() => {
    const iterator = f(adapter);
    const state = iterator.next();
    const run = state => state.done ? core.succeed(state.value) : (0, Function_js_1.pipe)(state.value.value, core.flatMap(val => run(iterator.next(val))));
    return run(state);
  });
};
exports.gen = gen;
/* @internal */
exports.fiberRefs = /*#__PURE__*/core.withFiberRuntime(state => core.succeed(state.getFiberRefs()));
/* @internal */
const head = self => core.matchEffect(self, {
  onFailure: e => core.fail(Option.some(e)),
  onSuccess: as => {
    const iterator = as[Symbol.iterator]();
    const next = iterator.next();
    if (next.done) {
      return core.fail(Option.none());
    }
    return core.succeed(next.value);
  }
});
exports.head = head;
/* @internal */
const ignore = self => (0, exports.match)(self, {
  onFailure: Function_js_1.constVoid,
  onSuccess: Function_js_1.constVoid
});
exports.ignore = ignore;
/* @internal */
const ignoreLogged = self => core.matchCauseEffect(self, {
  onFailure: cause => (0, exports.logDebug)(cause, "An error was silently ignored because it is not anticipated to be useful"),
  onSuccess: () => core.unit
});
exports.ignoreLogged = ignoreLogged;
/* @internal */
const inheritFiberRefs = childFiberRefs => (0, exports.updateFiberRefs)((parentFiberId, parentFiberRefs) => FiberRefs.joinAs(parentFiberRefs, parentFiberId, childFiberRefs));
exports.inheritFiberRefs = inheritFiberRefs;
/* @internal */
const isFailure = self => (0, exports.match)(self, {
  onFailure: Function_js_1.constTrue,
  onSuccess: Function_js_1.constFalse
});
exports.isFailure = isFailure;
/* @internal */
const isSuccess = self => (0, exports.match)(self, {
  onFailure: Function_js_1.constFalse,
  onSuccess: Function_js_1.constTrue
});
exports.isSuccess = isSuccess;
/* @internal */
const iterate = (initial, options) => core.suspend(() => {
  if (options.while(initial)) {
    return core.flatMap(options.body(initial), z2 => (0, exports.iterate)(z2, options));
  }
  return core.succeed(initial);
});
exports.iterate = iterate;
const logWithLevel = level => (messageOrCause, supplementary) => {
  const levelOption = Option.fromNullable(level);
  let message;
  let cause;
  if (internalCause.isCause(messageOrCause)) {
    cause = messageOrCause;
    message = supplementary ?? "";
  } else {
    message = messageOrCause;
    cause = supplementary ?? internalCause.empty;
  }
  return core.withFiberRuntime(fiberState => {
    fiberState.log(message, cause, levelOption);
    return core.unit;
  });
};
/** @internal */
exports.log = /*#__PURE__*/logWithLevel();
/** @internal */
exports.logTrace = /*#__PURE__*/logWithLevel(LogLevel.Trace);
/** @internal */
exports.logDebug = /*#__PURE__*/logWithLevel(LogLevel.Debug);
/** @internal */
exports.logInfo = /*#__PURE__*/logWithLevel(LogLevel.Info);
/** @internal */
exports.logWarning = /*#__PURE__*/logWithLevel(LogLevel.Warning);
/** @internal */
exports.logError = /*#__PURE__*/logWithLevel(LogLevel.Error);
/** @internal */
exports.logFatal = /*#__PURE__*/logWithLevel(LogLevel.Fatal);
/* @internal */
exports.withLogSpan = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, label) => core.flatMap(Clock.currentTimeMillis, now => core.fiberRefLocallyWith(effect, core.currentLogSpan, List.prepend(LogSpan.make(label, now)))));
/* @internal */
exports.logAnnotations = /*#__PURE__*/core.fiberRefGet(core.currentLogAnnotations);
/* @internal */
// @ts-expect-error
const loop = (initial, options) => options.discard ? loopDiscard(initial, options.while, options.step, options.body) : core.map(loopInternal(initial, options.while, options.step, options.body), x => Array.from(x));
exports.loop = loop;
const loopInternal = (initial, cont, inc, body) => core.suspend(() => cont(initial) ? core.flatMap(body(initial), a => core.map(loopInternal(inc(initial), cont, inc, body), List.prepend(a))) : core.sync(() => List.empty()));
const loopDiscard = (initial, cont, inc, body) => core.suspend(() => cont(initial) ? core.flatMap(body(initial), () => loopDiscard(inc(initial), cont, inc, body)) : core.unit);
/* @internal */
exports.mapAccum = /*#__PURE__*/(0, Function_js_1.dual)(3, (elements, zero, f) => core.suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let result = core.succeed(zero);
  let next;
  let i = 0;
  while (!(next = iterator.next()).done) {
    const index = i++;
    result = core.flatMap(result, state => core.map(f(state, next.value, index), ([z, b]) => {
      builder.push(b);
      return z;
    }));
  }
  return core.map(result, z => [z, builder]);
}));
/* @internal */
exports.mapErrorCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.matchCauseEffect(self, {
  onFailure: c => core.failCauseSync(() => f(c)),
  onSuccess: core.succeed
}));
/* @internal */
const memoize = self => (0, Function_js_1.pipe)(core.deferredMake(), core.flatMap(deferred => (0, Function_js_1.pipe)((0, exports.diffFiberRefsAndRuntimeFlags)(self), core.intoDeferred(deferred), exports.once, core.map(complete => core.zipRight(complete, (0, Function_js_1.pipe)(core.deferredAwait(deferred), core.flatMap(([patch, a]) => core.as(core.zip((0, exports.patchFiberRefs)(patch[0]), core.updateRuntimeFlags(patch[1])), a))))))));
exports.memoize = memoize;
/* @internal */
const merge = self => core.matchEffect(self, {
  onFailure: e => core.succeed(e),
  onSuccess: core.succeed
});
exports.merge = merge;
/* @internal */
const negate = self => core.map(self, b => !b);
exports.negate = negate;
/* @internal */
const none = self => core.matchEffect(self, {
  onFailure: e => core.fail(Option.some(e)),
  onSuccess: option => {
    switch (option._tag) {
      case "None":
        {
          return core.unit;
        }
      case "Some":
        {
          return core.fail(Option.none());
        }
    }
  }
});
exports.none = none;
/* @internal */
const once = self => core.map(Ref.make(true), ref => core.asUnit(core.whenEffect(self, Ref.getAndSet(ref, false))));
exports.once = once;
/* @internal */
const option = self => core.matchEffect(self, {
  onFailure: () => core.succeed(Option.none()),
  onSuccess: a => core.succeed(Option.some(a))
});
exports.option = option;
/* @internal */
exports.orElseFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, evaluate) => core.orElse(self, () => core.failSync(evaluate)));
/* @internal */
exports.orElseSucceed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, evaluate) => core.orElse(self, () => core.sync(evaluate)));
/* @internal */
const parallelErrors = self => core.matchCauseEffect(self, {
  onFailure: cause => {
    const errors = Array.from(internalCause.failures(cause));
    return errors.length === 0 ? core.failCause(cause) : core.fail(errors);
  },
  onSuccess: core.succeed
});
exports.parallelErrors = parallelErrors;
/* @internal */
const patchFiberRefs = patch => (0, exports.updateFiberRefs)((fiberId, fiberRefs) => (0, Function_js_1.pipe)(patch, fiberRefsPatch.patch(fiberId, fiberRefs)));
exports.patchFiberRefs = patchFiberRefs;
/* @internal */
const promise = evaluate => evaluate.length >= 1 ? core.async((resolve, signal) => {
  evaluate(signal).then(a => resolve(core.exitSucceed(a))).catch(e => resolve(core.exitDie(e)));
}) : core.async(resolve => {
  ;
  evaluate().then(a => resolve(core.exitSucceed(a))).catch(e => resolve(core.exitDie(e)));
});
exports.promise = promise;
/* @internal */
exports.provideService = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, service) => core.contextWithEffect(env => core.provideContext(self, Context.add(env, tag, service))));
/* @internal */
exports.provideServiceEffect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, effect) => core.contextWithEffect(env => core.flatMap(effect, service => core.provideContext(self, (0, Function_js_1.pipe)(env, Context.add(tag, service))))));
/* @internal */
exports.random = /*#__PURE__*/defaultServices.randomWith(core.succeed);
/* @internal */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (elements, zero, f) => ReadonlyArray.fromIterable(elements).reduce((acc, el, i) => core.flatMap(acc, a => f(a, el, i)), core.succeed(zero)));
/* @internal */
exports.reduceRight = /*#__PURE__*/(0, Function_js_1.dual)(3, (elements, zero, f) => ReadonlyArray.fromIterable(elements).reduceRight((acc, el, i) => core.flatMap(acc, a => f(el, a, i)), core.succeed(zero)));
/* @internal */
exports.reduceWhile = /*#__PURE__*/(0, Function_js_1.dual)(3, (elements, zero, options) => core.flatMap(core.sync(() => elements[Symbol.iterator]()), iterator => reduceWhileLoop(iterator, 0, zero, options.while, options.body)));
const reduceWhileLoop = (iterator, index, state, predicate, f) => {
  const next = iterator.next();
  if (!next.done && predicate(state)) {
    return core.flatMap(f(state, next.value, index), nextState => reduceWhileLoop(iterator, index + 1, nextState, predicate, f));
  }
  return core.succeed(state);
};
/* @internal */
exports.repeatN = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => core.suspend(() => repeatNLoop(self, n)));
/* @internal */
const repeatNLoop = (self, n) => core.flatMap(self, a => n <= 0 ? core.succeed(a) : core.zipRight(core.yieldNow(), repeatNLoop(self, n - 1)));
/* @internal */
const sandbox = self => core.matchCauseEffect(self, {
  onFailure: core.fail,
  onSuccess: core.succeed
});
exports.sandbox = sandbox;
/* @internal */
const setFiberRefs = fiberRefs => core.suspend(() => FiberRefs.setAll(fiberRefs));
exports.setFiberRefs = setFiberRefs;
/* @internal */
exports.sleep = Clock.sleep;
/* @internal */
exports.succeedNone = /*#__PURE__*/core.succeed( /*#__PURE__*/Option.none());
/* @internal */
const succeedSome = value => core.succeed(Option.some(value));
exports.succeedSome = succeedSome;
/* @internal */
exports.summarized = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, summary, f) => core.flatMap(summary, start => core.flatMap(self, value => core.map(summary, end => [f(start, end), value]))));
/* @internal */
exports.tagMetrics = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), function () {
  return (0, exports.labelMetrics)(arguments[0], typeof arguments[1] === "string" ? [metricLabel.make(arguments[1], arguments[2])] : Object.entries(arguments[1]).map(([k, v]) => metricLabel.make(k, v)));
});
/* @internal */
exports.labelMetrics = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, labels) => (0, exports.labelMetricsSet)(self, HashSet.fromIterable(labels)));
/* @internal */
exports.labelMetricsSet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, labels) => core.fiberRefLocallyWith(core.currentMetricLabels, set => (0, Function_js_1.pipe)(set, HashSet.union(labels)))(self));
/* @internal */
exports.takeUntil = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, predicate) => core.suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next;
  let effect = core.succeed(false);
  let i = 0;
  while ((next = iterator.next()) && !next.done) {
    const a = next.value;
    const index = i++;
    effect = core.flatMap(effect, bool => {
      if (bool) {
        return core.succeed(true);
      }
      builder.push(a);
      return predicate(a, index);
    });
  }
  return core.map(effect, () => builder);
}));
/* @internal */
exports.takeWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, predicate) => core.suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next;
  let taking = core.succeed(true);
  let i = 0;
  while ((next = iterator.next()) && !next.done) {
    const a = next.value;
    const index = i++;
    taking = core.flatMap(taking, taking => (0, Function_js_1.pipe)(taking ? predicate(a, index) : core.succeed(false), core.map(bool => {
      if (bool) {
        builder.push(a);
      }
      return bool;
    })));
  }
  return core.map(taking, () => builder);
}));
/* @internal */
exports.tapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => core.matchCauseEffect(self, {
  onFailure: cause => {
    const either = internalCause.failureOrCause(cause);
    switch (either._tag) {
      case "Left":
        {
          return core.zipRight(onFailure(either.left), core.failCause(cause));
        }
      case "Right":
        {
          return core.failCause(cause);
        }
    }
  },
  onSuccess: a => core.as(onSuccess(a), a)
}));
/* @internal */
exports.tapDefect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.catchAllCause(self, cause => Option.match(internalCause.keepDefects(cause), {
  onNone: () => core.failCause(cause),
  onSome: a => core.zipRight(f(a), core.failCause(cause))
})));
/* @internal */
exports.tapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.matchCauseEffect(self, {
  onFailure: cause => {
    const either = internalCause.failureOrCause(cause);
    switch (either._tag) {
      case "Left":
        {
          return core.zipRight(f(either.left), core.failCause(cause));
        }
      case "Right":
        {
          return core.failCause(cause);
        }
    }
  },
  onSuccess: core.succeed
}));
/* @internal */
exports.tapErrorTag = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, k, f) => (0, exports.tapError)(self, e => {
  if (Predicate.isTagged(e, k)) {
    return f(e);
  }
  return core.unit;
}));
/* @internal */
exports.tapErrorCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.matchCauseEffect(self, {
  onFailure: cause => core.zipRight(f(cause), core.failCause(cause)),
  onSuccess: core.succeed
}));
/* @internal */
const timed = self => (0, exports.timedWith)(self, Clock.currentTimeNanos);
exports.timed = timed;
/* @internal */
exports.timedWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, nanos) => (0, exports.summarized)(self, nanos, (start, end) => Duration.nanos(end - start)));
/* @internal */
exports.tracerWith = Tracer.tracerWith;
/** @internal */
exports.tracer = /*#__PURE__*/(0, exports.tracerWith)(core.succeed);
/* @internal */
const tryPromise = arg => {
  let evaluate;
  let catcher = undefined;
  if (typeof arg === "function") {
    evaluate = arg;
  } else {
    evaluate = arg.try;
    catcher = arg.catch;
  }
  if (evaluate.length >= 1) {
    return core.suspend(() => {
      const controller = new AbortController();
      return core.flatMap((0, exports.try_)(() => evaluate(controller.signal)), promise => core.async(resolve => {
        promise.then(a => resolve(core.exitSucceed(a))).catch(e => resolve(core.fail(catcher ? catcher(e) : e)));
        return core.sync(() => controller.abort());
      }));
    });
  }
  return core.flatMap((0, exports.try_)(arg), promise => core.async(resolve => {
    promise.then(a => resolve(core.exitSucceed(a))).catch(e => resolve(core.fail(catcher ? catcher(e) : e)));
  }));
};
exports.tryPromise = tryPromise;
/* @internal */
exports.tryMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => core.flatMap(self, a => (0, exports.try_)({
  try: () => options.try(a),
  catch: options.catch
})));
/* @internal */
exports.tryMapPromise = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => core.flatMap(self, a => (0, exports.tryPromise)({
  try: options.try.length >= 1 ? signal => options.try(a, signal) : () => options.try(a),
  catch: options.catch
})));
/* @internal */
exports.unless = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.suspend(() => predicate() ? exports.succeedNone : (0, exports.asSome)(self)));
/* @internal */
exports.unlessEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.flatMap(predicate, b => b ? exports.succeedNone : (0, exports.asSome)(self)));
/* @internal */
const unsandbox = self => (0, exports.mapErrorCause)(self, internalCause.flatten);
exports.unsandbox = unsandbox;
/* @internal */
const updateFiberRefs = f => core.withFiberRuntime(state => {
  state.setFiberRefs(f(state.id(), state.getFiberRefs()));
  return core.unit;
});
exports.updateFiberRefs = updateFiberRefs;
/* @internal */
exports.updateService = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, f) => core.mapInputContext(self, context => Context.add(context, tag, f(Context.unsafeGet(context, tag)))));
/* @internal */
exports.when = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.suspend(() => predicate() ? core.map(self, Option.some) : core.succeed(Option.none())));
/* @internal */
exports.whenFiberRef = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, fiberRef, predicate) => core.flatMap(core.fiberRefGet(fiberRef), s => predicate(s) ? core.map(self, a => [s, Option.some(a)]) : core.succeed([s, Option.none()])));
/* @internal */
exports.whenRef = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, ref, predicate) => core.flatMap(Ref.get(ref), s => predicate(s) ? core.map(self, a => [s, Option.some(a)]) : core.succeed([s, Option.none()])));
/* @internal */
exports.withMetric = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, metric) => metric(self));
/** @internal */
const serviceFunctionEffect = (service, f) => (...args) => core.flatMap(service, a => f(a)(...args));
exports.serviceFunctionEffect = serviceFunctionEffect;
/** @internal */
const serviceFunction = (service, f) => (...args) => core.map(service, a => f(a)(...args));
exports.serviceFunction = serviceFunction;
/** @internal */
const serviceFunctions = tag => new Proxy({}, {
  get(_target, prop, _receiver) {
    return (...args) => core.flatMap(tag, s => s[prop](...args));
  }
});
exports.serviceFunctions = serviceFunctions;
/** @internal */
const serviceConstants = tag => new Proxy({}, {
  get(_target, prop, _receiver) {
    return core.flatMap(tag, s => s[prop]);
  }
});
exports.serviceConstants = serviceConstants;
/** @internal */
const serviceMembers = tag => ({
  functions: (0, exports.serviceFunctions)(tag),
  constants: (0, exports.serviceConstants)(tag)
});
exports.serviceMembers = serviceMembers;
/** @internal */
const serviceOption = tag => core.map(core.context(), Context.getOption(tag));
exports.serviceOption = serviceOption;
// -----------------------------------------------------------------------------
// tracing
// -----------------------------------------------------------------------------
/* @internal */
const annotateCurrentSpan = function () {
  const args = arguments;
  return core.flatMap(exports.currentSpan, span => span._tag === "Some" ? core.sync(() => {
    if (typeof args[0] === "string") {
      span.value.attribute(args[0], args[1]);
    } else {
      for (const key in args[0]) {
        span.value.attribute(key, args[0][key]);
      }
    }
  }) : core.unit);
};
exports.annotateCurrentSpan = annotateCurrentSpan;
/* @internal */
exports.annotateSpans = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), function () {
  const args = arguments;
  return core.fiberRefLocallyWith(args[0], core.currentTracerSpanAnnotations, typeof args[1] === "string" ? HashMap.set(args[1], args[2]) : annotations => Object.entries(args[1]).reduce((acc, [key, value]) => HashMap.set(acc, key, value), annotations));
});
/** @internal */
exports.currentParentSpan = /*#__PURE__*/(0, exports.serviceOption)(internalTracer.spanTag);
/** @internal */
exports.currentSpan = /*#__PURE__*/core.map( /*#__PURE__*/core.context(), context => {
  const span = context.unsafeMap.get(internalTracer.spanTag);
  return span !== undefined && span._tag === "Span" ? Option.some(span) : Option.none();
});
const bigint0 = /*#__PURE__*/BigInt(0);
/** @internal */
exports.currentTimeNanosTracing = /*#__PURE__*/core.fiberRefGetWith(core.currentTracerTimingEnabled, enabled => enabled ? Clock.currentTimeNanos : core.succeed(bigint0));
/* @internal */
exports.linkSpans = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), (self, span, attributes) => core.fiberRefLocallyWith(self, core.currentTracerSpanLinks, Chunk.append({
  _tag: "SpanLink",
  span,
  attributes: attributes ?? {}
})));
/** @internal */
const makeSpan = (name, options) => (0, exports.tracerWith)(tracer => core.flatMap(options?.parent ? (0, exports.succeedSome)(options.parent) : options?.root ? exports.succeedNone : exports.currentParentSpan, parent => core.flatMap(core.fiberRefGet(core.currentTracerSpanAnnotations), annotations => core.flatMap(core.fiberRefGet(core.currentTracerSpanLinks), links => core.flatMap(exports.currentTimeNanosTracing, startTime => core.sync(() => {
  const linksArray = options?.links ? [...Chunk.toReadonlyArray(links), ...options.links] : Chunk.toReadonlyArray(links);
  const span = tracer.span(name, parent, options?.context ?? Context.empty(), linksArray, startTime);
  HashMap.forEach(annotations, (value, key) => span.attribute(key, value));
  Object.entries(options?.attributes ?? {}).forEach(([k, v]) => span.attribute(k, v));
  return span;
}))))));
exports.makeSpan = makeSpan;
/* @internal */
exports.spanAnnotations = /*#__PURE__*/core.fiberRefGet(core.currentTracerSpanAnnotations);
/* @internal */
exports.spanLinks = /*#__PURE__*/core.fiberRefGet(core.currentTracerSpanLinks);
/** @internal */
const useSpan = (name, ...args) => {
  const options = args.length === 1 ? undefined : args[0];
  const evaluate = args[args.length - 1];
  return core.acquireUseRelease((0, exports.makeSpan)(name, options), evaluate, (span, exit) => core.flatMap(exports.currentTimeNanosTracing, endTime => core.sync(() => span.end(endTime, exit))));
};
exports.useSpan = useSpan;
/** @internal */
exports.withParentSpan = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, span) => (0, exports.provideService)(self, internalTracer.spanTag, span));
/** @internal */
exports.withSpan = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] !== "string", (self, name, options) => (0, exports.useSpan)(name, options ?? {}, span => (0, exports.withParentSpan)(self, span)));
// -------------------------------------------------------------------------------------
// optionality
// -------------------------------------------------------------------------------------
/* @internal */
const fromNullable = value => value == null ? core.fail(internalCause.NoSuchElementException()) : core.succeed(value);
exports.fromNullable = fromNullable;
/* @internal */
const optionFromOptional = self => core.catchAll(core.map(self, Option.some), error => internalCause.isNoSuchElementException(error) ? exports.succeedNone : core.fail(error));
exports.optionFromOptional = optionFromOptional;
//# sourceMappingURL=core-effect.js.map