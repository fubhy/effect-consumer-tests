import * as Chunk from "../Chunk.js";
import * as Context from "../Context.js";
import * as Either from "../Either.js";
import * as Equal from "../Equal.js";
import * as FiberId from "../FiberId.js";
import { dual, identity, pipe } from "../Function.js";
import { globalValue } from "../GlobalValue.js";
import * as Hash from "../Hash.js";
import * as HashMap from "../HashMap.js";
import * as HashSet from "../HashSet.js";
import { NodeInspectSymbol, toJSON, toString } from "../Inspectable.js";
import * as List from "../List.js";
import * as MutableRef from "../MutableRef.js";
import * as Option from "../Option.js";
import { pipeArguments } from "../Pipeable.js";
import { hasProperty, isObject } from "../Predicate.js";
import * as ReadonlyArray from "../ReadonlyArray.js";
import * as RuntimeFlagsPatch from "../RuntimeFlagsPatch.js";
import * as _blockedRequests from "./blockedRequests.js";
import * as internalCause from "./cause.js";
import * as deferred from "./deferred.js";
import * as internalDiffer from "./differ.js";
import { effectVariance } from "./effectable.js";
import * as DeferredOpCodes from "./opCodes/deferred.js";
import * as OpCodes from "./opCodes/effect.js";
import * as _runtimeFlags from "./runtimeFlags.js";
import * as internalTracer from "./tracer.js";
// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------
/** @internal */
const EffectErrorSymbolKey = "effect/EffectError";
/** @internal */
export const EffectErrorTypeId = /*#__PURE__*/Symbol.for(EffectErrorSymbolKey);
/** @internal */
export const isEffectError = u => hasProperty(u, EffectErrorTypeId);
/** @internal */
export const makeEffectError = cause => ({
  [EffectErrorTypeId]: EffectErrorTypeId,
  _tag: "EffectError",
  cause
});
/**
 * @internal
 */
export const blocked = (blockedRequests, _continue) => {
  const effect = new EffectPrimitive("Blocked");
  effect.i0 = blockedRequests;
  effect.i1 = _continue;
  return effect;
};
/**
 * @internal
 */
export const runRequestBlock = blockedRequests => {
  const effect = new EffectPrimitive("RunBlocked");
  effect.i0 = blockedRequests;
  return effect;
};
/** @internal */
export const EffectTypeId = /*#__PURE__*/Symbol.for("effect/Effect");
/** @internal */
export class RevertFlags {
  patch;
  op;
  _op = OpCodes.OP_REVERT_FLAGS;
  constructor(patch, op) {
    this.patch = patch;
    this.op = op;
  }
}
/** @internal */
class EffectPrimitive {
  _op;
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
  trace = undefined;
  [EffectTypeId] = effectVariance;
  constructor(_op) {
    this._op = _op;
  }
  [Equal.symbol](that) {
    return this === that;
  }
  [Hash.symbol]() {
    return Hash.random(this);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      i0: toJSON(this.i0),
      i1: toJSON(this.i1),
      i2: toJSON(this.i2)
    };
  }
  toString() {
    return toString(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
/** @internal */
class EffectPrimitiveFailure {
  _op;
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
  trace = undefined;
  [EffectTypeId] = effectVariance;
  constructor(_op) {
    this._op = _op;
    // @ts-expect-error
    this._tag = _op;
  }
  [Equal.symbol](that) {
    return this === that;
  }
  [Hash.symbol]() {
    return Hash.random(this);
  }
  get cause() {
    return this.i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return toString(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
/** @internal */
class EffectPrimitiveSuccess {
  _op;
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
  trace = undefined;
  [EffectTypeId] = effectVariance;
  constructor(_op) {
    this._op = _op;
    // @ts-expect-error
    this._tag = _op;
  }
  [Equal.symbol](that) {
    return this === that;
  }
  [Hash.symbol]() {
    return Hash.random(this);
  }
  get value() {
    return this.i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: toJSON(this.value)
    };
  }
  toString() {
    return toString(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
/** @internal */
export const isEffect = u => hasProperty(u, EffectTypeId);
/* @internal */
export const withFiberRuntime = withRuntime => {
  const effect = new EffectPrimitive(OpCodes.OP_WITH_RUNTIME);
  effect.i0 = withRuntime;
  return effect;
};
/* @internal */
export const acquireUseRelease = /*#__PURE__*/dual(3, (acquire, use, release) => uninterruptibleMask(restore => flatMap(acquire, a => flatMap(exit(suspend(() => restore(step(use(a))))), exit => {
  if (exit._tag === "Success" && exit.value._op === "Blocked") {
    const value = exit.value;
    return blocked(value.i0, acquireUseRelease(succeed(a), () => value.i1, release));
  }
  const flat = exitFlatten(exit);
  return suspend(() => release(a, flat)).pipe(matchCauseEffect({
    onFailure: cause => {
      switch (flat._tag) {
        case OpCodes.OP_FAILURE:
          {
            return failCause(internalCause.parallel(flat.i0, cause));
          }
        case OpCodes.OP_SUCCESS:
          {
            return failCause(cause);
          }
      }
    },
    onSuccess: () => flat
  }));
}))));
/* @internal */
export const as = /*#__PURE__*/dual(2, (self, value) => flatMap(self, () => succeed(value)));
/* @internal */
export const asUnit = self => as(self, void 0);
/* @internal */
export const async = (register, blockingOn = FiberId.none) => suspend(() => {
  let cancelerRef = undefined;
  let controllerRef = undefined;
  const effect = new EffectPrimitive(OpCodes.OP_ASYNC);
  if (register.length !== 1) {
    const controller = new AbortController();
    controllerRef = controller;
    effect.i0 = resume => {
      cancelerRef = register(resume, controller.signal);
    };
  } else {
    effect.i0 = resume => {
      // @ts-expect-error
      cancelerRef = register(resume);
    };
  }
  effect.i1 = blockingOn;
  return onInterrupt(effect, () => {
    if (controllerRef) {
      controllerRef.abort();
    }
    return cancelerRef ?? unit;
  });
});
/* @internal */
export const asyncEither = (register, blockingOn = FiberId.none) => async(resume => {
  const result = register(resume);
  if (Either.isRight(result)) {
    resume(result.right);
  } else {
    return result.left;
  }
}, blockingOn);
/* @internal */
export const catchAllCause = /*#__PURE__*/dual(2, (self, f) => {
  const effect = new EffectPrimitive(OpCodes.OP_ON_FAILURE);
  effect.i0 = self;
  effect.i1 = f;
  return effect;
});
/* @internal */
export const catchAll = /*#__PURE__*/dual(2, (self, f) => matchEffect(self, {
  onFailure: f,
  onSuccess: succeed
}));
/**
 * @macro identity
 * @internal
 */
export const unified = f => (...args) => f(...args);
/* @internal */
export const catchIf = /*#__PURE__*/dual(3, (self, predicate, f) => catchAllCause(self, cause => {
  const either = internalCause.failureOrCause(cause);
  switch (either._tag) {
    case "Left":
      {
        return predicate(either.left) ? f(either.left) : failCause(cause);
      }
    case "Right":
      {
        return failCause(either.right);
      }
  }
}));
/* @internal */
export const catchSome = /*#__PURE__*/dual(2, (self, pf) => catchAllCause(self, cause => {
  const either = internalCause.failureOrCause(cause);
  switch (either._tag) {
    case "Left":
      {
        return pipe(pf(either.left), Option.getOrElse(() => failCause(cause)));
      }
    case "Right":
      {
        return failCause(either.right);
      }
  }
}));
/* @internal */
export const checkInterruptible = f => withFiberRuntime((_, status) => f(_runtimeFlags.interruption(status.runtimeFlags)));
const spanSymbol = /*#__PURE__*/Symbol.for("effect/SpanAnnotation");
const originalSymbol = /*#__PURE__*/Symbol.for("effect/OriginalAnnotation");
/* @internal */
export const originalInstance = obj => {
  if (hasProperty(obj, originalSymbol)) {
    // @ts-expect-error
    return obj[originalSymbol];
  }
  return obj;
};
/* @internal */
const capture = (obj, span) => {
  if (Option.isSome(span)) {
    return new Proxy(obj, {
      has(target, p) {
        return p === spanSymbol || p === originalSymbol || p in target;
      },
      get(target, p) {
        if (p === spanSymbol) {
          return span.value;
        }
        if (p === originalSymbol) {
          return obj;
        }
        // @ts-expect-error
        return target[p];
      }
    });
  }
  return obj;
};
/* @internal */
export const die = defect => isObject(defect) && !(spanSymbol in defect) ? withFiberRuntime(fiber => failCause(internalCause.die(capture(defect, currentSpanFromFiber(fiber))))) : failCause(internalCause.die(defect));
/* @internal */
export const dieMessage = message => failCauseSync(() => internalCause.die(internalCause.RuntimeException(message)));
/* @internal */
export const dieSync = evaluate => flatMap(sync(evaluate), die);
/* @internal */
export const either = self => matchEffect(self, {
  onFailure: e => succeed(Either.left(e)),
  onSuccess: a => succeed(Either.right(a))
});
/* @internal */
export const exit = self => matchCause(self, {
  onFailure: exitFailCause,
  onSuccess: exitSucceed
});
/* @internal */
export const fail = error => isObject(error) && !(spanSymbol in error) ? withFiberRuntime(fiber => failCause(internalCause.fail(capture(error, currentSpanFromFiber(fiber))))) : failCause(internalCause.fail(error));
/* @internal */
export const failSync = evaluate => flatMap(sync(evaluate), fail);
/* @internal */
export const failCause = cause => {
  const effect = new EffectPrimitiveFailure(OpCodes.OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
/* @internal */
export const failCauseSync = evaluate => flatMap(sync(evaluate), failCause);
/* @internal */
export const fiberId = /*#__PURE__*/withFiberRuntime(state => succeed(state.id()));
/* @internal */
export const fiberIdWith = f => withFiberRuntime(state => f(state.id()));
/* @internal */
export const flatMap = /*#__PURE__*/dual(2, (self, f) => {
  const effect = new EffectPrimitive(OpCodes.OP_ON_SUCCESS);
  effect.i0 = self;
  effect.i1 = f;
  return effect;
});
/* @internal */
export const step = self => {
  const effect = new EffectPrimitive("OnStep");
  effect.i0 = self;
  effect.i1 = exitSucceed;
  return effect;
};
/* @internal */
export const flatMapStep = (self, f) => {
  const effect = new EffectPrimitive("OnStep");
  effect.i0 = self;
  effect.i1 = f;
  return effect;
};
/* @internal */
export const flatten = self => flatMap(self, identity);
/* @internal */
export const flip = self => matchEffect(self, {
  onFailure: succeed,
  onSuccess: fail
});
/* @internal */
export const matchCause = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => matchCauseEffect(self, {
  onFailure: cause => succeed(onFailure(cause)),
  onSuccess: a => succeed(onSuccess(a))
}));
/* @internal */
export const matchCauseEffect = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  const effect = new EffectPrimitive(OpCodes.OP_ON_SUCCESS_AND_FAILURE);
  effect.i0 = self;
  effect.i1 = onFailure;
  effect.i2 = onSuccess;
  return effect;
});
/* @internal */
export const matchEffect = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => matchCauseEffect(self, {
  onFailure: cause => {
    const failures = internalCause.failures(cause);
    const defects = internalCause.defects(cause);
    if (defects.length > 0) {
      return failCause(internalCause.electFailures(cause));
    }
    if (failures.length > 0) {
      return onFailure(Chunk.unsafeHead(failures));
    }
    return failCause(cause);
  },
  onSuccess
}));
/* @internal */
export const forEachSequential = /*#__PURE__*/dual(2, (self, f) => suspend(() => {
  const arr = ReadonlyArray.fromIterable(self);
  const ret = new Array(arr.length);
  let i = 0;
  return as(whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: b => {
      ret[i++] = b;
    }
  }), ret);
}));
/* @internal */
export const forEachSequentialDiscard = /*#__PURE__*/dual(2, (self, f) => suspend(() => {
  const arr = ReadonlyArray.fromIterable(self);
  let i = 0;
  return whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: () => {
      i++;
    }
  });
}));
/* @internal */
export const if_ = /*#__PURE__*/dual(args => typeof args[0] === "boolean" || isEffect(args[0]), (self, {
  onFalse,
  onTrue
}) => typeof self === "boolean" ? self ? onTrue : onFalse : flatMap(self, unified(b => b ? onTrue : onFalse)));
/* @internal */
export const interrupt = /*#__PURE__*/flatMap(fiberId, fiberId => interruptWith(fiberId));
/* @internal */
export const interruptWith = fiberId => failCause(internalCause.interrupt(fiberId));
/* @internal */
export const interruptible = self => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = RuntimeFlagsPatch.enable(_runtimeFlags.Interruption);
  const _continue = orBlock => {
    if (orBlock._tag === "Blocked") {
      return blocked(orBlock.i0, interruptible(orBlock.i1));
    } else {
      return orBlock;
    }
  };
  effect.i1 = () => flatMapStep(self, _continue);
  return effect;
};
/* @internal */
export const interruptibleMask = f => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = RuntimeFlagsPatch.enable(_runtimeFlags.Interruption);
  const _continue = step => {
    if (step._op === "Blocked") {
      return blocked(step.i0, interruptible(step.i1));
    }
    return step;
  };
  effect.i1 = oldFlags => _runtimeFlags.interruption(oldFlags) ? step(f(interruptible)) : step(f(uninterruptible));
  return flatMap(effect, _continue);
};
/* @internal */
export const intoDeferred = /*#__PURE__*/dual(2, (self, deferred) => uninterruptibleMask(restore => flatMap(exit(restore(self)), exit => deferredDone(deferred, exit))));
/* @internal */
export const map = /*#__PURE__*/dual(2, (self, f) => flatMap(self, a => sync(() => f(a))));
/* @internal */
export const mapBoth = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => matchEffect(self, {
  onFailure: e => failSync(() => onFailure(e)),
  onSuccess: a => sync(() => onSuccess(a))
}));
/* @internal */
export const mapError = /*#__PURE__*/dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: cause => {
    const either = internalCause.failureOrCause(cause);
    switch (either._tag) {
      case "Left":
        {
          return failSync(() => f(either.left));
        }
      case "Right":
        {
          return failCause(either.right);
        }
    }
  },
  onSuccess: succeed
}));
/* @internal */
export const onError = /*#__PURE__*/dual(2, (self, cleanup) => onExit(self, unified(exit => exitIsSuccess(exit) ? unit : cleanup(exit.i0))));
/* @internal */
export const onExit = /*#__PURE__*/dual(2, (self, cleanup) => uninterruptibleMask(restore => matchCauseEffect(restore(self), {
  onFailure: cause1 => {
    const result = exitFailCause(cause1);
    return matchCauseEffect(cleanup(result), {
      onFailure: cause2 => exitFailCause(internalCause.sequential(cause1, cause2)),
      onSuccess: () => result
    });
  },
  onSuccess: success => {
    const result = exitSucceed(success);
    return zipRight(cleanup(result), result);
  }
})));
/* @internal */
export const onInterrupt = /*#__PURE__*/dual(2, (self, cleanup) => onExit(self, exitMatch({
  onFailure: cause => internalCause.isInterruptedOnly(cause) ? asUnit(cleanup(internalCause.interruptors(cause))) : unit,
  onSuccess: () => unit
})));
/* @internal */
export const orElse = /*#__PURE__*/dual(2, (self, that) => attemptOrElse(self, that, succeed));
/* @internal */
export const orDie = self => orDieWith(self, identity);
/* @internal */
export const orDieWith = /*#__PURE__*/dual(2, (self, f) => matchEffect(self, {
  onFailure: e => die(f(e)),
  onSuccess: succeed
}));
/* @internal */
export const partitionMap = (elements, f) => ReadonlyArray.fromIterable(elements).reduceRight(([lefts, rights], current) => {
  const either = f(current);
  switch (either._tag) {
    case "Left":
      {
        return [[either.left, ...lefts], rights];
      }
    case "Right":
      {
        return [lefts, [either.right, ...rights]];
      }
  }
}, [new Array(), new Array()]);
/* @internal */
export const runtimeFlags = /*#__PURE__*/withFiberRuntime((_, status) => succeed(status.runtimeFlags));
/* @internal */
export const succeed = value => {
  const effect = new EffectPrimitiveSuccess(OpCodes.OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
/* @internal */
export const suspend = effect => flatMap(sync(effect), identity);
/* @internal */
export const sync = evaluate => {
  const effect = new EffectPrimitive(OpCodes.OP_SYNC);
  effect.i0 = evaluate;
  return effect;
};
/* @internal */
export const tap = /*#__PURE__*/dual(2, (self, f) => flatMap(self, a => as(f(a), a)));
/* @internal */
export const transplant = f => withFiberRuntime(state => {
  const scopeOverride = state.getFiberRef(currentForkScopeOverride);
  const scope = pipe(scopeOverride, Option.getOrElse(() => state.scope()));
  return f(fiberRefLocally(currentForkScopeOverride, Option.some(scope)));
});
/* @internal */
export const attemptOrElse = /*#__PURE__*/dual(3, (self, that, onSuccess) => matchCauseEffect(self, {
  onFailure: cause => {
    const defects = internalCause.defects(cause);
    if (defects.length > 0) {
      return failCause(Option.getOrThrow(internalCause.keepDefectsAndElectFailures(cause)));
    }
    return that();
  },
  onSuccess
}));
/* @internal */
export const uninterruptible = self => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = RuntimeFlagsPatch.disable(_runtimeFlags.Interruption);
  effect.i1 = () => flatMapStep(self, _continue);
  const _continue = orBlock => {
    if (orBlock._tag === "Blocked") {
      return blocked(orBlock.i0, uninterruptible(orBlock.i1));
    } else {
      return orBlock;
    }
  };
  return effect;
};
/* @internal */
export const uninterruptibleMask = f => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = RuntimeFlagsPatch.disable(_runtimeFlags.Interruption);
  const _continue = step => {
    if (step._op === "Blocked") {
      return blocked(step.i0, uninterruptible(step.i1));
    }
    return step;
  };
  effect.i1 = oldFlags => _runtimeFlags.interruption(oldFlags) ? step(f(interruptible)) : step(f(uninterruptible));
  return flatMap(effect, _continue);
};
/* @internal */
export const unit = /*#__PURE__*/succeed(void 0);
/* @internal */
export const updateRuntimeFlags = patch => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = patch;
  effect.i1 = void 0;
  return effect;
};
/* @internal */
export const whenEffect = /*#__PURE__*/dual(2, (self, predicate) => flatMap(predicate, b => {
  if (b) {
    return pipe(self, map(Option.some));
  }
  return succeed(Option.none());
}));
/* @internal */
export const whileLoop = options => {
  const effect = new EffectPrimitive(OpCodes.OP_WHILE);
  effect.i0 = options.while;
  effect.i1 = options.body;
  effect.i2 = options.step;
  return effect;
};
/* @internal */
export const withConcurrency = /*#__PURE__*/dual(2, (self, concurrency) => fiberRefLocally(self, currentConcurrency, concurrency));
/* @internal */
export const withRequestBatching = /*#__PURE__*/dual(2, (self, requestBatching) => fiberRefLocally(self, currentRequestBatching, requestBatching));
/* @internal */
export const withRuntimeFlags = /*#__PURE__*/dual(2, (self, update) => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = update;
  effect.i1 = () => self;
  return effect;
});
/** @internal */
export const withTracerTiming = /*#__PURE__*/dual(2, (effect, enabled) => fiberRefLocally(effect, currentTracerTimingEnabled, enabled));
/* @internal */
export const yieldNow = options => {
  const effect = new EffectPrimitive(OpCodes.OP_YIELD);
  return typeof options?.priority !== "undefined" ? withSchedulingPriority(options.priority)(effect) : effect;
};
/* @internal */
export const zip = /*#__PURE__*/dual(2, (self, that) => flatMap(self, a => map(that, b => [a, b])));
/* @internal */
export const zipFlatten = /*#__PURE__*/dual(2, (self, that) => flatMap(self, a => map(that, b => [...a, b])));
/* @internal */
export const zipLeft = /*#__PURE__*/dual(2, (self, that) => flatMap(self, a => as(that, a)));
/* @internal */
export const zipRight = /*#__PURE__*/dual(2, (self, that) => flatMap(self, () => that));
/* @internal */
export const zipWith = /*#__PURE__*/dual(3, (self, that, f) => flatMap(self, a => map(that, b => f(a, b))));
/* @internal */
export const never = /*#__PURE__*/asyncEither(() => {
  const interval = setInterval(() => {
    //
  }, 2 ** 31 - 1);
  return Either.left(sync(() => clearInterval(interval)));
});
// -----------------------------------------------------------------------------
// Fiber
// -----------------------------------------------------------------------------
/* @internal */
export const interruptFiber = self => flatMap(fiberId, fiberId => pipe(self, interruptAsFiber(fiberId)));
/* @internal */
export const interruptAsFiber = /*#__PURE__*/dual(2, (self, fiberId) => flatMap(self.interruptAsFork(fiberId), () => self.await()));
// -----------------------------------------------------------------------------
// LogLevel
// -----------------------------------------------------------------------------
/** @internal */
export const logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 50000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 40000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 30000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 20000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 10000,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const allLogLevels = [logLevelAll, logLevelTrace, logLevelDebug, logLevelInfo, logLevelWarning, logLevelError, logLevelFatal, logLevelNone];
// -----------------------------------------------------------------------------
// FiberRef
// -----------------------------------------------------------------------------
/** @internal */
const FiberRefSymbolKey = "effect/FiberRef";
/** @internal */
export const FiberRefTypeId = /*#__PURE__*/Symbol.for(FiberRefSymbolKey);
/** @internal */
const fiberRefVariance = {
  _A: _ => _
};
/* @internal */
export const fiberRefGet = self => fiberRefModify(self, a => [a, a]);
/* @internal */
export const fiberRefGetAndSet = /*#__PURE__*/dual(2, (self, value) => fiberRefModify(self, v => [v, value]));
/* @internal */
export const fiberRefGetAndUpdate = /*#__PURE__*/dual(2, (self, f) => fiberRefModify(self, v => [v, f(v)]));
/* @internal */
export const fiberRefGetAndUpdateSome = /*#__PURE__*/dual(2, (self, pf) => fiberRefModify(self, v => [v, Option.getOrElse(pf(v), () => v)]));
/* @internal */
export const fiberRefGetWith = /*#__PURE__*/dual(2, (self, f) => flatMap(fiberRefGet(self), f));
/* @internal */
export const fiberRefSet = /*#__PURE__*/dual(2, (self, value) => fiberRefModify(self, () => [void 0, value]));
/* @internal */
export const fiberRefDelete = self => withFiberRuntime(state => {
  state.unsafeDeleteFiberRef(self);
  return unit;
});
/* @internal */
export const fiberRefReset = self => fiberRefSet(self, self.initial);
/* @internal */
export const fiberRefModify = /*#__PURE__*/dual(2, (self, f) => withFiberRuntime(state => {
  const [b, a] = f(state.getFiberRef(self));
  state.setFiberRef(self, a);
  return succeed(b);
}));
/* @internal */
export const fiberRefModifySome = (self, def, f) => fiberRefModify(self, v => Option.getOrElse(f(v), () => [def, v]));
/* @internal */
export const fiberRefUpdate = /*#__PURE__*/dual(2, (self, f) => fiberRefModify(self, v => [void 0, f(v)]));
/* @internal */
export const fiberRefUpdateSome = /*#__PURE__*/dual(2, (self, pf) => fiberRefModify(self, v => [void 0, Option.getOrElse(pf(v), () => v)]));
/* @internal */
export const fiberRefUpdateAndGet = /*#__PURE__*/dual(2, (self, f) => fiberRefModify(self, v => {
  const result = f(v);
  return [result, result];
}));
/* @internal */
export const fiberRefUpdateSomeAndGet = /*#__PURE__*/dual(2, (self, pf) => fiberRefModify(self, v => {
  const result = Option.getOrElse(pf(v), () => v);
  return [result, result];
}));
// circular
/** @internal */
const RequestResolverSymbolKey = "effect/RequestResolver";
/** @internal */
export const RequestResolverTypeId = /*#__PURE__*/Symbol.for(RequestResolverSymbolKey);
const dataSourceVariance = {
  _R: _ => _,
  _A: _ => _
};
/** @internal */
export class RequestResolverImpl {
  runAll;
  target;
  [RequestResolverTypeId] = dataSourceVariance;
  constructor(runAll, target) {
    this.runAll = runAll;
    this.target = target;
    this.runAll = runAll;
  }
  [Hash.symbol]() {
    return this.target ? Hash.hash(this.target) : Hash.random(this);
  }
  [Equal.symbol](that) {
    return this.target ? isRequestResolver(that) && Equal.equals(this.target, that.target) : this === that;
  }
  identified(...ids) {
    return new RequestResolverImpl(this.runAll, Chunk.fromIterable(ids));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/** @internal */
export const isRequestResolver = u => hasProperty(u, RequestResolverTypeId);
// end
/** @internal */
export const resolverLocally = /*#__PURE__*/dual(3, (use, self, value) => new RequestResolverImpl(requests => fiberRefLocally(use.runAll(requests), self, value), Chunk.make("Locally", use, self, value)));
/** @internal */
export const requestBlockLocally = (self, ref, value) => _blockedRequests.reduce(self, LocallyReducer(ref, value));
const LocallyReducer = (ref, value) => ({
  emptyCase: () => _blockedRequests.empty,
  parCase: (left, right) => _blockedRequests.par(left, right),
  seqCase: (left, right) => _blockedRequests.seq(left, right),
  singleCase: (dataSource, blockedRequest) => _blockedRequests.single(resolverLocally(dataSource, ref, value), blockedRequest)
});
/* @internal */
export const fiberRefLocally = /*#__PURE__*/dual(3, (use, self, value) => flatMap(acquireUseRelease(zipLeft(fiberRefGet(self), fiberRefSet(self, value)), () => step(use), oldValue => fiberRefSet(self, oldValue)), res => {
  if (res._op === "Blocked") {
    return blocked(res.i0, fiberRefLocally(res.i1, self, value));
  }
  return res;
}));
/* @internal */
export const fiberRefLocallyWith = /*#__PURE__*/dual(3, (use, self, f) => fiberRefGetWith(self, a => fiberRefLocally(use, self, f(a))));
/** @internal */
export const fiberRefUnsafeMake = (initial, options) => fiberRefUnsafeMakePatch(initial, {
  differ: internalDiffer.update(),
  fork: options?.fork ?? identity,
  join: options?.join
});
/** @internal */
export const fiberRefUnsafeMakeHashSet = initial => {
  const differ = internalDiffer.hashSet();
  return fiberRefUnsafeMakePatch(initial, {
    differ,
    fork: differ.empty
  });
};
/** @internal */
export const fiberRefUnsafeMakeContext = initial => {
  const differ = internalDiffer.environment();
  return fiberRefUnsafeMakePatch(initial, {
    differ,
    fork: differ.empty
  });
};
/** @internal */
export const fiberRefUnsafeMakePatch = (initial, options) => ({
  [FiberRefTypeId]: fiberRefVariance,
  initial,
  diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
  combine: (first, second) => options.differ.combine(first, second),
  patch: patch => oldValue => options.differ.patch(patch, oldValue),
  fork: options.fork,
  join: options.join ?? ((_, n) => n),
  pipe() {
    return pipeArguments(this, arguments);
  }
});
/** @internal */
export const fiberRefUnsafeMakeRuntimeFlags = initial => fiberRefUnsafeMakePatch(initial, {
  differ: _runtimeFlags.differ,
  fork: _runtimeFlags.differ.empty
});
/** @internal */
export const currentContext = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentContext"), () => fiberRefUnsafeMakeContext(Context.empty()));
/** @internal */
export const currentSchedulingPriority = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => fiberRefUnsafeMake(0));
/** @internal */
export const currentMaxOpsBeforeYield = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => fiberRefUnsafeMake(2048));
/** @internal */
export const currentLogAnnotations = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentLogAnnotation"), () => fiberRefUnsafeMake(HashMap.empty()));
/** @internal */
export const currentLogLevel = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentLogLevel"), () => fiberRefUnsafeMake(logLevelInfo));
/** @internal */
export const currentLogSpan = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentLogSpan"), () => fiberRefUnsafeMake(List.empty()));
/** @internal */
export const withSchedulingPriority = /*#__PURE__*/dual(2, (self, scheduler) => fiberRefLocally(self, currentSchedulingPriority, scheduler));
/** @internal */
export const withMaxOpsBeforeYield = /*#__PURE__*/dual(2, (self, scheduler) => fiberRefLocally(self, currentMaxOpsBeforeYield, scheduler));
/** @internal */
export const currentConcurrency = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentConcurrency"), () => fiberRefUnsafeMake("unbounded"));
/**
 * @internal
 */
export const currentRequestBatching = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentRequestBatching"), () => fiberRefUnsafeMake(true));
/** @internal */
export const currentUnhandledErrorLogLevel = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => fiberRefUnsafeMake(Option.some(logLevelDebug)));
/** @internal */
export const withUnhandledErrorLogLevel = /*#__PURE__*/dual(2, (self, level) => fiberRefLocally(self, currentUnhandledErrorLogLevel, level));
/** @internal */
export const currentMetricLabels = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentMetricLabels"), () => fiberRefUnsafeMakeHashSet(HashSet.empty()));
/* @internal */
export const metricLabels = /*#__PURE__*/fiberRefGet(currentMetricLabels);
/** @internal */
export const currentForkScopeOverride = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => fiberRefUnsafeMake(Option.none(), {
  fork: () => Option.none(),
  join: (parent, _) => parent
}));
/** @internal */
export const currentInterruptedCause = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentInterruptedCause"), () => fiberRefUnsafeMake(internalCause.empty, {
  fork: () => internalCause.empty,
  join: (parent, _) => parent
}));
/** @internal */
export const currentTracerTimingEnabled = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentTracerTiming"), () => fiberRefUnsafeMake(true));
/** @internal */
export const currentTracerSpanAnnotations = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentTracerSpanAnnotations"), () => fiberRefUnsafeMake(HashMap.empty()));
/** @internal */
export const currentTracerSpanLinks = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentTracerSpanLinks"), () => fiberRefUnsafeMake(Chunk.empty()));
// -----------------------------------------------------------------------------
// Scope
// -----------------------------------------------------------------------------
/** @internal */
export const ScopeTypeId = /*#__PURE__*/Symbol.for("effect/Scope");
/** @internal */
export const CloseableScopeTypeId = /*#__PURE__*/Symbol.for("effect/CloseableScope");
/* @internal */
export const scopeAddFinalizer = (self, finalizer) => self.addFinalizer(() => asUnit(finalizer));
/* @internal */
export const scopeAddFinalizerExit = (self, finalizer) => self.addFinalizer(finalizer);
/* @internal */
export const scopeClose = (self, exit) => self.close(exit);
/* @internal */
export const scopeFork = (self, strategy) => self.fork(strategy);
/* @internal */
export const releaseMapAdd = /*#__PURE__*/dual(2, (self, finalizer) => map(releaseMapAddIfOpen(self, finalizer), Option.match({
  onNone: () => () => unit,
  onSome: key => exit => releaseMapRelease(key, exit)(self)
})));
/* @internal */
export const releaseMapRelease = /*#__PURE__*/dual(3, (self, key, exit) => suspend(() => {
  switch (self.state._tag) {
    case "Exited":
      {
        return unit;
      }
    case "Running":
      {
        const finalizer = self.state.finalizers.get(key);
        self.state.finalizers.delete(key);
        if (finalizer != null) {
          return self.state.update(finalizer)(exit);
        }
        return unit;
      }
  }
}));
/* @internal */
export const releaseMapAddIfOpen = /*#__PURE__*/dual(2, (self, finalizer) => suspend(() => {
  switch (self.state._tag) {
    case "Exited":
      {
        self.state.nextKey += 1;
        return as(finalizer(self.state.exit), Option.none());
      }
    case "Running":
      {
        const key = self.state.nextKey;
        self.state.finalizers.set(key, finalizer);
        self.state.nextKey += 1;
        return succeed(Option.some(key));
      }
  }
}));
/* @internal */
export const releaseMapGet = /*#__PURE__*/dual(2, (self, key) => sync(() => self.state._tag === "Running" ? Option.fromNullable(self.state.finalizers.get(key)) : Option.none()));
/* @internal */
export const releaseMapReplace = /*#__PURE__*/dual(3, (self, key, finalizer) => suspend(() => {
  switch (self.state._tag) {
    case "Exited":
      {
        return as(finalizer(self.state.exit), Option.none());
      }
    case "Running":
      {
        const fin = Option.fromNullable(self.state.finalizers.get(key));
        self.state.finalizers.set(key, finalizer);
        return succeed(fin);
      }
  }
}));
/* @internal */
export const releaseMapRemove = /*#__PURE__*/dual(2, (self, key) => sync(() => {
  if (self.state._tag === "Exited") {
    return Option.none();
  }
  const fin = Option.fromNullable(self.state.finalizers.get(key));
  self.state.finalizers.delete(key);
  return fin;
}));
/* @internal */
export const releaseMapMake = /*#__PURE__*/sync(() => ({
  state: {
    _tag: "Running",
    nextKey: 0,
    finalizers: new Map(),
    update: identity
  }
}));
// -----------------------------------------------------------------------------
// Exit
// -----------------------------------------------------------------------------
/** @internal */
export const exitIsExit = u => isEffect(u) && "_tag" in u && (u._tag === "Success" || u._tag === "Failure");
/** @internal */
export const exitIsFailure = self => self._tag === "Failure";
/** @internal */
export const exitIsSuccess = self => self._tag === "Success";
/** @internal */
export const exitIsInterrupted = self => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return internalCause.isInterrupted(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return false;
      }
  }
};
/** @internal */
export const exitAs = /*#__PURE__*/dual(2, (self, value) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return exitFailCause(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return exitSucceed(value);
      }
  }
});
/** @internal */
export const exitAsUnit = self => exitAs(self, void 0);
/** @internal */
export const exitCauseOption = self => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return Option.some(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return Option.none();
      }
  }
};
/** @internal */
export const exitCollectAll = (exits, options) => exitCollectAllInternal(exits, options?.parallel ? internalCause.parallel : internalCause.sequential);
/** @internal */
export const exitDie = defect => exitFailCause(internalCause.die(defect));
/** @internal */
export const exitExists = /*#__PURE__*/dual(2, (self, predicate) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return false;
      }
    case OpCodes.OP_SUCCESS:
      {
        return predicate(self.i0);
      }
  }
});
/** @internal */
export const exitFail = error => exitFailCause(internalCause.fail(error));
/** @internal */
export const exitFailCause = cause => {
  const effect = new EffectPrimitiveFailure(OpCodes.OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
/** @internal */
export const exitFlatMap = /*#__PURE__*/dual(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return exitFailCause(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return f(self.i0);
      }
  }
});
/** @internal */
export const exitFlatMapEffect = /*#__PURE__*/dual(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return succeed(exitFailCause(self.i0));
      }
    case OpCodes.OP_SUCCESS:
      {
        return f(self.i0);
      }
  }
});
/** @internal */
export const exitFlatten = self => pipe(self, exitFlatMap(identity));
/** @internal */
export const exitForEachEffect = /*#__PURE__*/dual(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return succeed(exitFailCause(self.i0));
      }
    case OpCodes.OP_SUCCESS:
      {
        return exit(f(self.i0));
      }
  }
});
/** @internal */
export const exitFromEither = either => {
  switch (either._tag) {
    case "Left":
      {
        return exitFail(either.left);
      }
    case "Right":
      {
        return exitSucceed(either.right);
      }
  }
};
/** @internal */
export const exitFromOption = option => {
  switch (option._tag) {
    case "None":
      {
        return exitFail(void 0);
      }
    case "Some":
      {
        return exitSucceed(option.value);
      }
  }
};
/** @internal */
export const exitGetOrElse = /*#__PURE__*/dual(2, (self, orElse) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return orElse(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return self.i0;
      }
  }
});
/** @internal */
export const exitInterrupt = fiberId => exitFailCause(internalCause.interrupt(fiberId));
/** @internal */
export const exitMap = /*#__PURE__*/dual(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return exitFailCause(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return exitSucceed(f(self.i0));
      }
  }
});
/** @internal */
export const exitMapBoth = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return exitFailCause(pipe(self.i0, internalCause.map(onFailure)));
      }
    case OpCodes.OP_SUCCESS:
      {
        return exitSucceed(onSuccess(self.i0));
      }
  }
});
/** @internal */
export const exitMapError = /*#__PURE__*/dual(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return exitFailCause(pipe(self.i0, internalCause.map(f)));
      }
    case OpCodes.OP_SUCCESS:
      {
        return exitSucceed(self.i0);
      }
  }
});
/** @internal */
export const exitMapErrorCause = /*#__PURE__*/dual(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return exitFailCause(f(self.i0));
      }
    case OpCodes.OP_SUCCESS:
      {
        return exitSucceed(self.i0);
      }
  }
});
/** @internal */
export const exitMatch = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return onFailure(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return onSuccess(self.i0);
      }
  }
});
/** @internal */
export const exitMatchEffect = /*#__PURE__*/dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return onFailure(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return onSuccess(self.i0);
      }
  }
});
/** @internal */
export const exitSucceed = value => {
  const effect = new EffectPrimitiveSuccess(OpCodes.OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
/** @internal */
export const exitUnit = /*#__PURE__*/exitSucceed(void 0);
/** @internal */
export const exitZip = /*#__PURE__*/dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (a, a2) => [a, a2],
  onFailure: internalCause.sequential
}));
/** @internal */
export const exitZipLeft = /*#__PURE__*/dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (a, _) => a,
  onFailure: internalCause.sequential
}));
/** @internal */
export const exitZipRight = /*#__PURE__*/dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (_, a2) => a2,
  onFailure: internalCause.sequential
}));
/** @internal */
export const exitZipPar = /*#__PURE__*/dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (a, a2) => [a, a2],
  onFailure: internalCause.parallel
}));
/** @internal */
export const exitZipParLeft = /*#__PURE__*/dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (a, _) => a,
  onFailure: internalCause.parallel
}));
/** @internal */
export const exitZipParRight = /*#__PURE__*/dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (_, a2) => a2,
  onFailure: internalCause.parallel
}));
/** @internal */
export const exitZipWith = /*#__PURE__*/dual(3, (self, that, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        switch (that._tag) {
          case OpCodes.OP_SUCCESS:
            {
              return exitFailCause(self.i0);
            }
          case OpCodes.OP_FAILURE:
            {
              return exitFailCause(onFailure(self.i0, that.i0));
            }
        }
      }
    case OpCodes.OP_SUCCESS:
      {
        switch (that._tag) {
          case OpCodes.OP_SUCCESS:
            {
              return exitSucceed(onSuccess(self.i0, that.i0));
            }
          case OpCodes.OP_FAILURE:
            {
              return exitFailCause(that.i0);
            }
        }
      }
  }
});
const exitCollectAllInternal = (exits, combineCauses) => {
  const list = Chunk.fromIterable(exits);
  if (!Chunk.isNonEmpty(list)) {
    return Option.none();
  }
  return pipe(Chunk.tailNonEmpty(list), ReadonlyArray.reduce(pipe(Chunk.headNonEmpty(list), exitMap(Chunk.of)), (accumulator, current) => pipe(accumulator, exitZipWith(current, {
    onSuccess: (list, value) => pipe(list, Chunk.prepend(value)),
    onFailure: combineCauses
  }))), exitMap(Chunk.reverse), exitMap(chunk => Array.from(chunk)), Option.some);
};
// -----------------------------------------------------------------------------
// Deferred
// -----------------------------------------------------------------------------
/** @internal */
export const deferredUnsafeMake = fiberId => ({
  [deferred.DeferredTypeId]: deferred.deferredVariance,
  state: MutableRef.make(deferred.pending([])),
  blockingOn: fiberId,
  pipe() {
    return pipeArguments(this, arguments);
  }
});
/* @internal */
export const deferredMake = () => flatMap(fiberId, id => deferredMakeAs(id));
/* @internal */
export const deferredMakeAs = fiberId => sync(() => deferredUnsafeMake(fiberId));
/* @internal */
export const deferredAwait = self => asyncEither(k => {
  const state = MutableRef.get(self.state);
  switch (state._tag) {
    case DeferredOpCodes.OP_STATE_DONE:
      {
        return Either.right(state.effect);
      }
    case DeferredOpCodes.OP_STATE_PENDING:
      {
        pipe(self.state, MutableRef.set(deferred.pending([k, ...state.joiners])));
        return Either.left(deferredInterruptJoiner(self, k));
      }
  }
}, self.blockingOn);
/* @internal */
export const deferredComplete = /*#__PURE__*/dual(2, (self, effect) => intoDeferred(effect, self));
/* @internal */
export const deferredCompleteWith = /*#__PURE__*/dual(2, (self, effect) => sync(() => {
  const state = MutableRef.get(self.state);
  switch (state._tag) {
    case DeferredOpCodes.OP_STATE_DONE:
      {
        return false;
      }
    case DeferredOpCodes.OP_STATE_PENDING:
      {
        pipe(self.state, MutableRef.set(deferred.done(effect)));
        for (let i = 0; i < state.joiners.length; i++) {
          state.joiners[i](effect);
        }
        return true;
      }
  }
}));
/* @internal */
export const deferredDone = /*#__PURE__*/dual(2, (self, exit) => deferredCompleteWith(self, exit));
/* @internal */
export const deferredFail = /*#__PURE__*/dual(2, (self, error) => deferredCompleteWith(self, fail(error)));
/* @internal */
export const deferredFailSync = /*#__PURE__*/dual(2, (self, evaluate) => deferredCompleteWith(self, failSync(evaluate)));
/* @internal */
export const deferredFailCause = /*#__PURE__*/dual(2, (self, cause) => deferredCompleteWith(self, failCause(cause)));
/* @internal */
export const deferredFailCauseSync = /*#__PURE__*/dual(2, (self, evaluate) => deferredCompleteWith(self, failCauseSync(evaluate)));
/* @internal */
export const deferredDie = /*#__PURE__*/dual(2, (self, defect) => deferredCompleteWith(self, die(defect)));
/* @internal */
export const deferredDieSync = /*#__PURE__*/dual(2, (self, evaluate) => deferredCompleteWith(self, dieSync(evaluate)));
/* @internal */
export const deferredInterrupt = self => flatMap(fiberId, fiberId => deferredCompleteWith(self, interruptWith(fiberId)));
/* @internal */
export const deferredInterruptWith = /*#__PURE__*/dual(2, (self, fiberId) => deferredCompleteWith(self, interruptWith(fiberId)));
/* @internal */
export const deferredIsDone = self => sync(() => MutableRef.get(self.state)._tag === DeferredOpCodes.OP_STATE_DONE);
/* @internal */
export const deferredPoll = self => sync(() => {
  const state = MutableRef.get(self.state);
  switch (state._tag) {
    case DeferredOpCodes.OP_STATE_DONE:
      {
        return Option.some(state.effect);
      }
    case DeferredOpCodes.OP_STATE_PENDING:
      {
        return Option.none();
      }
  }
});
/* @internal */
export const deferredSucceed = /*#__PURE__*/dual(2, (self, value) => deferredCompleteWith(self, succeed(value)));
/* @internal */
export const deferredSync = /*#__PURE__*/dual(2, (self, evaluate) => deferredCompleteWith(self, sync(evaluate)));
/** @internal */
export const deferredUnsafeDone = (self, effect) => {
  const state = MutableRef.get(self.state);
  if (state._tag === DeferredOpCodes.OP_STATE_PENDING) {
    pipe(self.state, MutableRef.set(deferred.done(effect)));
    for (let i = state.joiners.length - 1; i >= 0; i--) {
      state.joiners[i](effect);
    }
  }
};
const deferredInterruptJoiner = (self, joiner) => sync(() => {
  const state = MutableRef.get(self.state);
  if (state._tag === DeferredOpCodes.OP_STATE_PENDING) {
    pipe(self.state, MutableRef.set(deferred.pending(state.joiners.filter(j => j !== joiner))));
  }
});
// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------
const constContext = /*#__PURE__*/fiberRefGet(currentContext);
/* @internal */
export const context = () => constContext;
/* @internal */
export const contextWith = f => map(context(), f);
/* @internal */
export const contextWithEffect = f => flatMap(context(), f);
/* @internal */
export const provideContext = /*#__PURE__*/dual(2, (self, context) => fiberRefLocally(currentContext, context)(self));
/* @internal */
export const provideSomeContext = /*#__PURE__*/dual(2, (self, context) => fiberRefLocallyWith(currentContext, parent => Context.merge(parent, context))(self));
/* @internal */
export const mapInputContext = /*#__PURE__*/dual(2, (self, f) => contextWithEffect(context => provideContext(self, f(context))));
// -----------------------------------------------------------------------------
// Tracing
// -----------------------------------------------------------------------------
/** @internal */
export const currentSpanFromFiber = fiber => {
  const span = fiber.getFiberRef(currentContext).unsafeMap.get(internalTracer.spanTag);
  return span !== undefined && span._tag === "Span" ? Option.some(span) : Option.none();
};
//# sourceMappingURL=core.js.map