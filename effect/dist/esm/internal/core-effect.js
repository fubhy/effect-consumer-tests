import * as Chunk from "../Chunk.js";
import * as Clock from "../Clock.js";
import * as Context from "../Context.js";
import * as Duration from "../Duration.js";
import * as Either from "../Either.js";
import * as FiberId from "../FiberId.js";
import * as FiberRefs from "../FiberRefs.js";
import { constFalse, constTrue, constVoid, dual, identity, pipe } from "../Function.js";
import * as HashMap from "../HashMap.js";
import * as HashSet from "../HashSet.js";
import * as List from "../List.js";
import * as LogLevel from "../LogLevel.js";
import * as LogSpan from "../LogSpan.js";
import * as Option from "../Option.js";
import * as Predicate from "../Predicate.js";
import * as ReadonlyArray from "../ReadonlyArray.js";
import * as Ref from "../Ref.js";
import * as Tracer from "../Tracer.js";
import * as internalCause from "./cause.js";
import * as core from "./core.js";
import * as defaultServices from "./defaultServices.js";
import * as fiberRefsPatch from "./fiberRefs/patch.js";
import * as metricLabel from "./metric/label.js";
import * as runtimeFlags from "./runtimeFlags.js";
import * as SingleShotGen from "./singleShotGen.js";
import * as internalTracer from "./tracer.js";
/* @internal */
export const annotateLogs = /*#__PURE__*/dual(args => core.isEffect(args[0]), function () {
  const args = arguments;
  return core.fiberRefLocallyWith(args[0], core.currentLogAnnotations, typeof args[1] === "string" ? HashMap.set(args[1], args[2]) : annotations => Object.entries(args[1]).reduce((acc, [key, value]) => HashMap.set(acc, key, value), annotations));
});
/* @internal */
export const asSome = self => core.map(self, Option.some);
/* @internal */
export const asSomeError = self => core.mapError(self, Option.some);
/* @internal */
export const asyncOption = (register, blockingOn = FiberId.none) => core.asyncEither(cb => {
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
/* @internal */
export const try_ = arg => {
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
/* @internal */
export const _catch = /*#__PURE__*/dual(
// @ts-expect-error
3, (self, tag, options) => core.catchAll(self, e => {
  if (Predicate.hasProperty(e, tag) && e[tag] === options.failure) {
    return options.onFailure(e);
  }
  return core.fail(e);
}));
/* @internal */
export const catchAllDefect = /*#__PURE__*/dual(2, (self, f) => core.catchAllCause(self, core.unified(cause => {
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
export const catchSomeCause = /*#__PURE__*/dual(2, (self, f) => core.matchCauseEffect(self, {
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
export const catchSomeDefect = /*#__PURE__*/dual(2, (self, pf) => core.catchAllCause(self, core.unified(cause => {
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
export const catchTag = /*#__PURE__*/dual(3, (self, k, f) => core.catchIf(self, Predicate.isTagged(k), f));
/** @internal */
export const catchTags = /*#__PURE__*/dual(2, (self, cases) => {
  let keys;
  return core.catchIf(self, e => {
    keys ??= Object.keys(cases);
    return Predicate.hasProperty(e, "_tag") && Predicate.isString(e["_tag"]) && keys.includes(e["_tag"]);
  }, e => cases[e["_tag"]](e));
});
/* @internal */
export const cause = self => core.matchCause(self, {
  onFailure: identity,
  onSuccess: () => internalCause.empty
});
/* @internal */
export const clockWith = Clock.clockWith;
/* @internal */
export const clock = /*#__PURE__*/clockWith(core.succeed);
/* @internal */
export const delay = /*#__PURE__*/dual(2, (self, duration) => core.zipRight(Clock.sleep(duration), self));
/* @internal */
export const descriptorWith = f => core.withFiberRuntime((state, status) => f({
  id: state.id(),
  status,
  interruptors: internalCause.interruptors(state.getFiberRef(core.currentInterruptedCause))
}));
/* @internal */
export const allowInterrupt = /*#__PURE__*/descriptorWith(descriptor => HashSet.size(descriptor.interruptors) > 0 ? core.interrupt : core.unit);
/* @internal */
export const descriptor = /*#__PURE__*/descriptorWith(core.succeed);
/* @internal */
export const diffFiberRefs = self => summarized(self, fiberRefs, fiberRefsPatch.diff);
/* @internal */
export const diffFiberRefsAndRuntimeFlags = self => summarized(self, core.zip(fiberRefs, core.runtimeFlags), ([refs, flags], [refsNew, flagsNew]) => [fiberRefsPatch.diff(refs, refsNew), runtimeFlags.diff(flags, flagsNew)]);
/* @internal */
export const Do = /*#__PURE__*/core.succeed({});
/* @internal */
export const bind = /*#__PURE__*/dual(3, (self, tag, f) => core.flatMap(self, k => core.map(f(k), a => ({
  ...k,
  [tag]: a
}))));
/* @internal */
export const bindTo = /*#__PURE__*/dual(2, (self, tag) => core.map(self, a => ({
  [tag]: a
})));
/* @internal */
export const bindValue = /*#__PURE__*/dual(3, (self, tag, f) => core.map(self, k => ({
  ...k,
  [tag]: f(k)
})));
/* @internal */
export const dropUntil = /*#__PURE__*/dual(2, (elements, predicate) => core.suspend(() => {
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
export const dropWhile = /*#__PURE__*/dual(2, (elements, f) => core.suspend(() => {
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
export const contextWith = f => core.map(core.context(), f);
/* @internal */
export const eventually = self => core.orElse(self, () => core.flatMap(core.yieldNow(), () => eventually(self)));
/* @internal */
export const filterMap = /*#__PURE__*/dual(2, (elements, pf) => core.map(core.forEachSequential(elements, identity), ReadonlyArray.filterMap(pf)));
/* @internal */
export const filterOrDie = /*#__PURE__*/dual(3, (self, filter, orDieWith) => filterOrElse(self, filter, a => core.dieSync(() => orDieWith(a))));
/* @internal */
export const filterOrDieMessage = /*#__PURE__*/dual(3, (self, filter, message) => filterOrElse(self, filter, () => core.dieMessage(message)));
/* @internal */
export const filterOrElse = /*#__PURE__*/dual(3, (self, filter, orElse) => core.flatMap(self, a => filter(a) ? core.succeed(a) : orElse(a)));
/* @internal */
export const filterOrFail = /*#__PURE__*/dual(3, (self, filter, orFailWith) => filterOrElse(self, filter, a => core.failSync(() => orFailWith(a))));
/* @internal */
export const findFirst = /*#__PURE__*/dual(2, (elements, f) => core.suspend(() => {
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
export const firstSuccessOf = effects => core.suspend(() => {
  const list = Chunk.fromIterable(effects);
  if (!Chunk.isNonEmpty(list)) {
    return core.dieSync(() => internalCause.IllegalArgumentException(`Received an empty collection of effects`));
  }
  return pipe(Chunk.tailNonEmpty(list), ReadonlyArray.reduce(Chunk.headNonEmpty(list), (left, right) => core.orElse(left, () => right)));
});
/* @internal */
export const flipWith = /*#__PURE__*/dual(2, (self, f) => core.flip(f(core.flip(self))));
/* @internal */
export const match = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => core.matchEffect(self, {
  onFailure: e => core.succeed(onFailure(e)),
  onSuccess: a => core.succeed(onSuccess(a))
}));
/* @internal */
export const every = /*#__PURE__*/dual(2, (elements, f) => core.suspend(() => forAllLoop(elements[Symbol.iterator](), 0, f)));
const forAllLoop = (iterator, index, f) => {
  const next = iterator.next();
  return next.done ? core.succeed(true) : core.flatMap(f(next.value, index), b => b ? forAllLoop(iterator, index + 1, f) : core.succeed(b));
};
/* @internal */
export const forever = self => {
  const loop = core.flatMap(core.flatMap(self, () => core.yieldNow()), () => loop);
  return loop;
};
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
export const gen = function () {
  let f;
  if (arguments.length === 1) {
    f = arguments[0];
  } else {
    f = arguments[1].bind(arguments[0]);
  }
  return core.suspend(() => {
    const iterator = f(adapter);
    const state = iterator.next();
    const run = state => state.done ? core.succeed(state.value) : pipe(state.value.value, core.flatMap(val => run(iterator.next(val))));
    return run(state);
  });
};
/* @internal */
export const fiberRefs = /*#__PURE__*/core.withFiberRuntime(state => core.succeed(state.getFiberRefs()));
/* @internal */
export const head = self => core.matchEffect(self, {
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
/* @internal */
export const ignore = self => match(self, {
  onFailure: constVoid,
  onSuccess: constVoid
});
/* @internal */
export const ignoreLogged = self => core.matchCauseEffect(self, {
  onFailure: cause => logDebug(cause, "An error was silently ignored because it is not anticipated to be useful"),
  onSuccess: () => core.unit
});
/* @internal */
export const inheritFiberRefs = childFiberRefs => updateFiberRefs((parentFiberId, parentFiberRefs) => FiberRefs.joinAs(parentFiberRefs, parentFiberId, childFiberRefs));
/* @internal */
export const isFailure = self => match(self, {
  onFailure: constTrue,
  onSuccess: constFalse
});
/* @internal */
export const isSuccess = self => match(self, {
  onFailure: constFalse,
  onSuccess: constTrue
});
/* @internal */
export const iterate = (initial, options) => core.suspend(() => {
  if (options.while(initial)) {
    return core.flatMap(options.body(initial), z2 => iterate(z2, options));
  }
  return core.succeed(initial);
});
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
export const log = /*#__PURE__*/logWithLevel();
/** @internal */
export const logTrace = /*#__PURE__*/logWithLevel(LogLevel.Trace);
/** @internal */
export const logDebug = /*#__PURE__*/logWithLevel(LogLevel.Debug);
/** @internal */
export const logInfo = /*#__PURE__*/logWithLevel(LogLevel.Info);
/** @internal */
export const logWarning = /*#__PURE__*/logWithLevel(LogLevel.Warning);
/** @internal */
export const logError = /*#__PURE__*/logWithLevel(LogLevel.Error);
/** @internal */
export const logFatal = /*#__PURE__*/logWithLevel(LogLevel.Fatal);
/* @internal */
export const withLogSpan = /*#__PURE__*/dual(2, (effect, label) => core.flatMap(Clock.currentTimeMillis, now => core.fiberRefLocallyWith(effect, core.currentLogSpan, List.prepend(LogSpan.make(label, now)))));
/* @internal */
export const logAnnotations = /*#__PURE__*/core.fiberRefGet(core.currentLogAnnotations);
/* @internal */
// @ts-expect-error
export const loop = (initial, options) => options.discard ? loopDiscard(initial, options.while, options.step, options.body) : core.map(loopInternal(initial, options.while, options.step, options.body), x => Array.from(x));
const loopInternal = (initial, cont, inc, body) => core.suspend(() => cont(initial) ? core.flatMap(body(initial), a => core.map(loopInternal(inc(initial), cont, inc, body), List.prepend(a))) : core.sync(() => List.empty()));
const loopDiscard = (initial, cont, inc, body) => core.suspend(() => cont(initial) ? core.flatMap(body(initial), () => loopDiscard(inc(initial), cont, inc, body)) : core.unit);
/* @internal */
export const mapAccum = /*#__PURE__*/dual(3, (elements, zero, f) => core.suspend(() => {
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
export const mapErrorCause = /*#__PURE__*/dual(2, (self, f) => core.matchCauseEffect(self, {
  onFailure: c => core.failCauseSync(() => f(c)),
  onSuccess: core.succeed
}));
/* @internal */
export const memoize = self => pipe(core.deferredMake(), core.flatMap(deferred => pipe(diffFiberRefsAndRuntimeFlags(self), core.intoDeferred(deferred), once, core.map(complete => core.zipRight(complete, pipe(core.deferredAwait(deferred), core.flatMap(([patch, a]) => core.as(core.zip(patchFiberRefs(patch[0]), core.updateRuntimeFlags(patch[1])), a))))))));
/* @internal */
export const merge = self => core.matchEffect(self, {
  onFailure: e => core.succeed(e),
  onSuccess: core.succeed
});
/* @internal */
export const negate = self => core.map(self, b => !b);
/* @internal */
export const none = self => core.matchEffect(self, {
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
/* @internal */
export const once = self => core.map(Ref.make(true), ref => core.asUnit(core.whenEffect(self, Ref.getAndSet(ref, false))));
/* @internal */
export const option = self => core.matchEffect(self, {
  onFailure: () => core.succeed(Option.none()),
  onSuccess: a => core.succeed(Option.some(a))
});
/* @internal */
export const orElseFail = /*#__PURE__*/dual(2, (self, evaluate) => core.orElse(self, () => core.failSync(evaluate)));
/* @internal */
export const orElseSucceed = /*#__PURE__*/dual(2, (self, evaluate) => core.orElse(self, () => core.sync(evaluate)));
/* @internal */
export const parallelErrors = self => core.matchCauseEffect(self, {
  onFailure: cause => {
    const errors = Array.from(internalCause.failures(cause));
    return errors.length === 0 ? core.failCause(cause) : core.fail(errors);
  },
  onSuccess: core.succeed
});
/* @internal */
export const patchFiberRefs = patch => updateFiberRefs((fiberId, fiberRefs) => pipe(patch, fiberRefsPatch.patch(fiberId, fiberRefs)));
/* @internal */
export const promise = evaluate => evaluate.length >= 1 ? core.async((resolve, signal) => {
  evaluate(signal).then(a => resolve(core.exitSucceed(a))).catch(e => resolve(core.exitDie(e)));
}) : core.async(resolve => {
  ;
  evaluate().then(a => resolve(core.exitSucceed(a))).catch(e => resolve(core.exitDie(e)));
});
/* @internal */
export const provideService = /*#__PURE__*/dual(3, (self, tag, service) => core.contextWithEffect(env => core.provideContext(self, Context.add(env, tag, service))));
/* @internal */
export const provideServiceEffect = /*#__PURE__*/dual(3, (self, tag, effect) => core.contextWithEffect(env => core.flatMap(effect, service => core.provideContext(self, pipe(env, Context.add(tag, service))))));
/* @internal */
export const random = /*#__PURE__*/defaultServices.randomWith(core.succeed);
/* @internal */
export const reduce = /*#__PURE__*/dual(3, (elements, zero, f) => ReadonlyArray.fromIterable(elements).reduce((acc, el, i) => core.flatMap(acc, a => f(a, el, i)), core.succeed(zero)));
/* @internal */
export const reduceRight = /*#__PURE__*/dual(3, (elements, zero, f) => ReadonlyArray.fromIterable(elements).reduceRight((acc, el, i) => core.flatMap(acc, a => f(el, a, i)), core.succeed(zero)));
/* @internal */
export const reduceWhile = /*#__PURE__*/dual(3, (elements, zero, options) => core.flatMap(core.sync(() => elements[Symbol.iterator]()), iterator => reduceWhileLoop(iterator, 0, zero, options.while, options.body)));
const reduceWhileLoop = (iterator, index, state, predicate, f) => {
  const next = iterator.next();
  if (!next.done && predicate(state)) {
    return core.flatMap(f(state, next.value, index), nextState => reduceWhileLoop(iterator, index + 1, nextState, predicate, f));
  }
  return core.succeed(state);
};
/* @internal */
export const repeatN = /*#__PURE__*/dual(2, (self, n) => core.suspend(() => repeatNLoop(self, n)));
/* @internal */
const repeatNLoop = (self, n) => core.flatMap(self, a => n <= 0 ? core.succeed(a) : core.zipRight(core.yieldNow(), repeatNLoop(self, n - 1)));
/* @internal */
export const sandbox = self => core.matchCauseEffect(self, {
  onFailure: core.fail,
  onSuccess: core.succeed
});
/* @internal */
export const setFiberRefs = fiberRefs => core.suspend(() => FiberRefs.setAll(fiberRefs));
/* @internal */
export const sleep = Clock.sleep;
/* @internal */
export const succeedNone = /*#__PURE__*/core.succeed( /*#__PURE__*/Option.none());
/* @internal */
export const succeedSome = value => core.succeed(Option.some(value));
/* @internal */
export const summarized = /*#__PURE__*/dual(3, (self, summary, f) => core.flatMap(summary, start => core.flatMap(self, value => core.map(summary, end => [f(start, end), value]))));
/* @internal */
export const tagMetrics = /*#__PURE__*/dual(args => core.isEffect(args[0]), function () {
  return labelMetrics(arguments[0], typeof arguments[1] === "string" ? [metricLabel.make(arguments[1], arguments[2])] : Object.entries(arguments[1]).map(([k, v]) => metricLabel.make(k, v)));
});
/* @internal */
export const labelMetrics = /*#__PURE__*/dual(2, (self, labels) => labelMetricsSet(self, HashSet.fromIterable(labels)));
/* @internal */
export const labelMetricsSet = /*#__PURE__*/dual(2, (self, labels) => core.fiberRefLocallyWith(core.currentMetricLabels, set => pipe(set, HashSet.union(labels)))(self));
/* @internal */
export const takeUntil = /*#__PURE__*/dual(2, (elements, predicate) => core.suspend(() => {
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
export const takeWhile = /*#__PURE__*/dual(2, (elements, predicate) => core.suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next;
  let taking = core.succeed(true);
  let i = 0;
  while ((next = iterator.next()) && !next.done) {
    const a = next.value;
    const index = i++;
    taking = core.flatMap(taking, taking => pipe(taking ? predicate(a, index) : core.succeed(false), core.map(bool => {
      if (bool) {
        builder.push(a);
      }
      return bool;
    })));
  }
  return core.map(taking, () => builder);
}));
/* @internal */
export const tapBoth = /*#__PURE__*/dual(2, (self, {
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
export const tapDefect = /*#__PURE__*/dual(2, (self, f) => core.catchAllCause(self, cause => Option.match(internalCause.keepDefects(cause), {
  onNone: () => core.failCause(cause),
  onSome: a => core.zipRight(f(a), core.failCause(cause))
})));
/* @internal */
export const tapError = /*#__PURE__*/dual(2, (self, f) => core.matchCauseEffect(self, {
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
export const tapErrorTag = /*#__PURE__*/dual(3, (self, k, f) => tapError(self, e => {
  if (Predicate.isTagged(e, k)) {
    return f(e);
  }
  return core.unit;
}));
/* @internal */
export const tapErrorCause = /*#__PURE__*/dual(2, (self, f) => core.matchCauseEffect(self, {
  onFailure: cause => core.zipRight(f(cause), core.failCause(cause)),
  onSuccess: core.succeed
}));
/* @internal */
export const timed = self => timedWith(self, Clock.currentTimeNanos);
/* @internal */
export const timedWith = /*#__PURE__*/dual(2, (self, nanos) => summarized(self, nanos, (start, end) => Duration.nanos(end - start)));
/* @internal */
export const tracerWith = Tracer.tracerWith;
/** @internal */
export const tracer = /*#__PURE__*/tracerWith(core.succeed);
/* @internal */
export const tryPromise = arg => {
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
      return core.flatMap(try_(() => evaluate(controller.signal)), promise => core.async(resolve => {
        promise.then(a => resolve(core.exitSucceed(a))).catch(e => resolve(core.fail(catcher ? catcher(e) : e)));
        return core.sync(() => controller.abort());
      }));
    });
  }
  return core.flatMap(try_(arg), promise => core.async(resolve => {
    promise.then(a => resolve(core.exitSucceed(a))).catch(e => resolve(core.fail(catcher ? catcher(e) : e)));
  }));
};
/* @internal */
export const tryMap = /*#__PURE__*/dual(2, (self, options) => core.flatMap(self, a => try_({
  try: () => options.try(a),
  catch: options.catch
})));
/* @internal */
export const tryMapPromise = /*#__PURE__*/dual(2, (self, options) => core.flatMap(self, a => tryPromise({
  try: options.try.length >= 1 ? signal => options.try(a, signal) : () => options.try(a),
  catch: options.catch
})));
/* @internal */
export const unless = /*#__PURE__*/dual(2, (self, predicate) => core.suspend(() => predicate() ? succeedNone : asSome(self)));
/* @internal */
export const unlessEffect = /*#__PURE__*/dual(2, (self, predicate) => core.flatMap(predicate, b => b ? succeedNone : asSome(self)));
/* @internal */
export const unsandbox = self => mapErrorCause(self, internalCause.flatten);
/* @internal */
export const updateFiberRefs = f => core.withFiberRuntime(state => {
  state.setFiberRefs(f(state.id(), state.getFiberRefs()));
  return core.unit;
});
/* @internal */
export const updateService = /*#__PURE__*/dual(3, (self, tag, f) => core.mapInputContext(self, context => Context.add(context, tag, f(Context.unsafeGet(context, tag)))));
/* @internal */
export const when = /*#__PURE__*/dual(2, (self, predicate) => core.suspend(() => predicate() ? core.map(self, Option.some) : core.succeed(Option.none())));
/* @internal */
export const whenFiberRef = /*#__PURE__*/dual(3, (self, fiberRef, predicate) => core.flatMap(core.fiberRefGet(fiberRef), s => predicate(s) ? core.map(self, a => [s, Option.some(a)]) : core.succeed([s, Option.none()])));
/* @internal */
export const whenRef = /*#__PURE__*/dual(3, (self, ref, predicate) => core.flatMap(Ref.get(ref), s => predicate(s) ? core.map(self, a => [s, Option.some(a)]) : core.succeed([s, Option.none()])));
/* @internal */
export const withMetric = /*#__PURE__*/dual(2, (self, metric) => metric(self));
/** @internal */
export const serviceFunctionEffect = (service, f) => (...args) => core.flatMap(service, a => f(a)(...args));
/** @internal */
export const serviceFunction = (service, f) => (...args) => core.map(service, a => f(a)(...args));
/** @internal */
export const serviceFunctions = tag => new Proxy({}, {
  get(_target, prop, _receiver) {
    return (...args) => core.flatMap(tag, s => s[prop](...args));
  }
});
/** @internal */
export const serviceConstants = tag => new Proxy({}, {
  get(_target, prop, _receiver) {
    return core.flatMap(tag, s => s[prop]);
  }
});
/** @internal */
export const serviceMembers = tag => ({
  functions: serviceFunctions(tag),
  constants: serviceConstants(tag)
});
/** @internal */
export const serviceOption = tag => core.map(core.context(), Context.getOption(tag));
// -----------------------------------------------------------------------------
// tracing
// -----------------------------------------------------------------------------
/* @internal */
export const annotateCurrentSpan = function () {
  const args = arguments;
  return core.flatMap(currentSpan, span => span._tag === "Some" ? core.sync(() => {
    if (typeof args[0] === "string") {
      span.value.attribute(args[0], args[1]);
    } else {
      for (const key in args[0]) {
        span.value.attribute(key, args[0][key]);
      }
    }
  }) : core.unit);
};
/* @internal */
export const annotateSpans = /*#__PURE__*/dual(args => core.isEffect(args[0]), function () {
  const args = arguments;
  return core.fiberRefLocallyWith(args[0], core.currentTracerSpanAnnotations, typeof args[1] === "string" ? HashMap.set(args[1], args[2]) : annotations => Object.entries(args[1]).reduce((acc, [key, value]) => HashMap.set(acc, key, value), annotations));
});
/** @internal */
export const currentParentSpan = /*#__PURE__*/serviceOption(internalTracer.spanTag);
/** @internal */
export const currentSpan = /*#__PURE__*/core.map( /*#__PURE__*/core.context(), context => {
  const span = context.unsafeMap.get(internalTracer.spanTag);
  return span !== undefined && span._tag === "Span" ? Option.some(span) : Option.none();
});
const bigint0 = /*#__PURE__*/BigInt(0);
/** @internal */
export const currentTimeNanosTracing = /*#__PURE__*/core.fiberRefGetWith(core.currentTracerTimingEnabled, enabled => enabled ? Clock.currentTimeNanos : core.succeed(bigint0));
/* @internal */
export const linkSpans = /*#__PURE__*/dual(args => core.isEffect(args[0]), (self, span, attributes) => core.fiberRefLocallyWith(self, core.currentTracerSpanLinks, Chunk.append({
  _tag: "SpanLink",
  span,
  attributes: attributes ?? {}
})));
/** @internal */
export const makeSpan = (name, options) => tracerWith(tracer => core.flatMap(options?.parent ? succeedSome(options.parent) : options?.root ? succeedNone : currentParentSpan, parent => core.flatMap(core.fiberRefGet(core.currentTracerSpanAnnotations), annotations => core.flatMap(core.fiberRefGet(core.currentTracerSpanLinks), links => core.flatMap(currentTimeNanosTracing, startTime => core.sync(() => {
  const linksArray = options?.links ? [...Chunk.toReadonlyArray(links), ...options.links] : Chunk.toReadonlyArray(links);
  const span = tracer.span(name, parent, options?.context ?? Context.empty(), linksArray, startTime);
  HashMap.forEach(annotations, (value, key) => span.attribute(key, value));
  Object.entries(options?.attributes ?? {}).forEach(([k, v]) => span.attribute(k, v));
  return span;
}))))));
/* @internal */
export const spanAnnotations = /*#__PURE__*/core.fiberRefGet(core.currentTracerSpanAnnotations);
/* @internal */
export const spanLinks = /*#__PURE__*/core.fiberRefGet(core.currentTracerSpanLinks);
/** @internal */
export const useSpan = (name, ...args) => {
  const options = args.length === 1 ? undefined : args[0];
  const evaluate = args[args.length - 1];
  return core.acquireUseRelease(makeSpan(name, options), evaluate, (span, exit) => core.flatMap(currentTimeNanosTracing, endTime => core.sync(() => span.end(endTime, exit))));
};
/** @internal */
export const withParentSpan = /*#__PURE__*/dual(2, (self, span) => provideService(self, internalTracer.spanTag, span));
/** @internal */
export const withSpan = /*#__PURE__*/dual(args => typeof args[0] !== "string", (self, name, options) => useSpan(name, options ?? {}, span => withParentSpan(self, span)));
// -------------------------------------------------------------------------------------
// optionality
// -------------------------------------------------------------------------------------
/* @internal */
export const fromNullable = value => value == null ? core.fail(internalCause.NoSuchElementException()) : core.succeed(value);
/* @internal */
export const optionFromOptional = self => core.catchAll(core.map(self, Option.some), error => internalCause.isNoSuchElementException(error) ? succeedNone : core.fail(error));
//# sourceMappingURL=core-effect.js.map