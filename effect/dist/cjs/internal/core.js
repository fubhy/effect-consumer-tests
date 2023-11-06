"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapBoth = exports.map = exports.intoDeferred = exports.interruptibleMask = exports.interruptible = exports.interruptWith = exports.interrupt = exports.if_ = exports.forEachSequentialDiscard = exports.forEachSequential = exports.matchEffect = exports.matchCauseEffect = exports.matchCause = exports.flip = exports.flatten = exports.flatMapStep = exports.step = exports.flatMap = exports.fiberIdWith = exports.fiberId = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.exit = exports.either = exports.dieSync = exports.dieMessage = exports.die = exports.originalInstance = exports.checkInterruptible = exports.catchSome = exports.catchIf = exports.unified = exports.catchAll = exports.catchAllCause = exports.asyncEither = exports.async = exports.asUnit = exports.as = exports.acquireUseRelease = exports.withFiberRuntime = exports.isEffect = exports.RevertFlags = exports.EffectTypeId = exports.runRequestBlock = exports.blocked = exports.makeEffectError = exports.isEffectError = exports.EffectErrorTypeId = void 0;
exports.fiberRefSet = exports.fiberRefGetWith = exports.fiberRefGetAndUpdateSome = exports.fiberRefGetAndUpdate = exports.fiberRefGetAndSet = exports.fiberRefGet = exports.FiberRefTypeId = exports.allLogLevels = exports.logLevelNone = exports.logLevelTrace = exports.logLevelDebug = exports.logLevelInfo = exports.logLevelWarning = exports.logLevelError = exports.logLevelFatal = exports.logLevelAll = exports.interruptAsFiber = exports.interruptFiber = exports.never = exports.zipWith = exports.zipRight = exports.zipLeft = exports.zipFlatten = exports.zip = exports.yieldNow = exports.withTracerTiming = exports.withRuntimeFlags = exports.withRequestBatching = exports.withConcurrency = exports.whileLoop = exports.whenEffect = exports.updateRuntimeFlags = exports.unit = exports.uninterruptibleMask = exports.uninterruptible = exports.attemptOrElse = exports.transplant = exports.tap = exports.sync = exports.suspend = exports.succeed = exports.runtimeFlags = exports.partitionMap = exports.orDieWith = exports.orDie = exports.orElse = exports.onInterrupt = exports.onExit = exports.onError = exports.mapError = void 0;
exports.releaseMapReplace = exports.releaseMapGet = exports.releaseMapAddIfOpen = exports.releaseMapRelease = exports.releaseMapAdd = exports.scopeFork = exports.scopeClose = exports.scopeAddFinalizerExit = exports.scopeAddFinalizer = exports.CloseableScopeTypeId = exports.ScopeTypeId = exports.currentTracerSpanLinks = exports.currentTracerSpanAnnotations = exports.currentTracerTimingEnabled = exports.currentInterruptedCause = exports.currentForkScopeOverride = exports.metricLabels = exports.currentMetricLabels = exports.withUnhandledErrorLogLevel = exports.currentUnhandledErrorLogLevel = exports.currentRequestBatching = exports.currentConcurrency = exports.withMaxOpsBeforeYield = exports.withSchedulingPriority = exports.currentLogSpan = exports.currentLogLevel = exports.currentLogAnnotations = exports.currentMaxOpsBeforeYield = exports.currentSchedulingPriority = exports.currentContext = exports.fiberRefUnsafeMakeRuntimeFlags = exports.fiberRefUnsafeMakePatch = exports.fiberRefUnsafeMakeContext = exports.fiberRefUnsafeMakeHashSet = exports.fiberRefUnsafeMake = exports.fiberRefLocallyWith = exports.fiberRefLocally = exports.requestBlockLocally = exports.resolverLocally = exports.isRequestResolver = exports.RequestResolverImpl = exports.RequestResolverTypeId = exports.fiberRefUpdateSomeAndGet = exports.fiberRefUpdateAndGet = exports.fiberRefUpdateSome = exports.fiberRefUpdate = exports.fiberRefModifySome = exports.fiberRefModify = exports.fiberRefReset = exports.fiberRefDelete = void 0;
exports.deferredDieSync = exports.deferredDie = exports.deferredFailCauseSync = exports.deferredFailCause = exports.deferredFailSync = exports.deferredFail = exports.deferredDone = exports.deferredCompleteWith = exports.deferredComplete = exports.deferredAwait = exports.deferredMakeAs = exports.deferredMake = exports.deferredUnsafeMake = exports.exitZipWith = exports.exitZipParRight = exports.exitZipParLeft = exports.exitZipPar = exports.exitZipRight = exports.exitZipLeft = exports.exitZip = exports.exitUnit = exports.exitSucceed = exports.exitMatchEffect = exports.exitMatch = exports.exitMapErrorCause = exports.exitMapError = exports.exitMapBoth = exports.exitMap = exports.exitInterrupt = exports.exitGetOrElse = exports.exitFromOption = exports.exitFromEither = exports.exitForEachEffect = exports.exitFlatten = exports.exitFlatMapEffect = exports.exitFlatMap = exports.exitFailCause = exports.exitFail = exports.exitExists = exports.exitDie = exports.exitCollectAll = exports.exitCauseOption = exports.exitAsUnit = exports.exitAs = exports.exitIsInterrupted = exports.exitIsSuccess = exports.exitIsFailure = exports.exitIsExit = exports.releaseMapMake = exports.releaseMapRemove = void 0;
exports.currentSpanFromFiber = exports.mapInputContext = exports.provideSomeContext = exports.provideContext = exports.contextWithEffect = exports.contextWith = exports.context = exports.deferredUnsafeDone = exports.deferredSync = exports.deferredSucceed = exports.deferredPoll = exports.deferredIsDone = exports.deferredInterruptWith = exports.deferredInterrupt = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Context = /*#__PURE__*/require("../Context.js");
const Either = /*#__PURE__*/require("../Either.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const FiberId = /*#__PURE__*/require("../FiberId.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const List = /*#__PURE__*/require("../List.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const ReadonlyArray = /*#__PURE__*/require("../ReadonlyArray.js");
const RuntimeFlagsPatch = /*#__PURE__*/require("../RuntimeFlagsPatch.js");
const _blockedRequests = /*#__PURE__*/require("./blockedRequests.js");
const internalCause = /*#__PURE__*/require("./cause.js");
const deferred = /*#__PURE__*/require("./deferred.js");
const internalDiffer = /*#__PURE__*/require("./differ.js");
const effectable_js_1 = /*#__PURE__*/require("./effectable.js");
const DeferredOpCodes = /*#__PURE__*/require("./opCodes/deferred.js");
const OpCodes = /*#__PURE__*/require("./opCodes/effect.js");
const _runtimeFlags = /*#__PURE__*/require("./runtimeFlags.js");
const internalTracer = /*#__PURE__*/require("./tracer.js");
// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------
/** @internal */
const EffectErrorSymbolKey = "effect/EffectError";
/** @internal */
exports.EffectErrorTypeId = /*#__PURE__*/Symbol.for(EffectErrorSymbolKey);
/** @internal */
const isEffectError = u => (0, Predicate_js_1.hasProperty)(u, exports.EffectErrorTypeId);
exports.isEffectError = isEffectError;
/** @internal */
const makeEffectError = cause => ({
  [exports.EffectErrorTypeId]: exports.EffectErrorTypeId,
  _tag: "EffectError",
  cause
});
exports.makeEffectError = makeEffectError;
/**
 * @internal
 */
const blocked = (blockedRequests, _continue) => {
  const effect = new EffectPrimitive("Blocked");
  effect.i0 = blockedRequests;
  effect.i1 = _continue;
  return effect;
};
exports.blocked = blocked;
/**
 * @internal
 */
const runRequestBlock = blockedRequests => {
  const effect = new EffectPrimitive("RunBlocked");
  effect.i0 = blockedRequests;
  return effect;
};
exports.runRequestBlock = runRequestBlock;
/** @internal */
exports.EffectTypeId = /*#__PURE__*/Symbol.for("effect/Effect");
/** @internal */
class RevertFlags {
  patch;
  op;
  _op = OpCodes.OP_REVERT_FLAGS;
  constructor(patch, op) {
    this.patch = patch;
    this.op = op;
  }
}
exports.RevertFlags = RevertFlags;
/** @internal */
class EffectPrimitive {
  _op;
  i0 = undefined;
  i1 = undefined;
  i2 = undefined;
  trace = undefined;
  [exports.EffectTypeId] = effectable_js_1.effectVariance;
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
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      i0: (0, Inspectable_js_1.toJSON)(this.i0),
      i1: (0, Inspectable_js_1.toJSON)(this.i1),
      i2: (0, Inspectable_js_1.toJSON)(this.i2)
    };
  }
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  }
  [Inspectable_js_1.NodeInspectSymbol]() {
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
  [exports.EffectTypeId] = effectable_js_1.effectVariance;
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
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  }
  [Inspectable_js_1.NodeInspectSymbol]() {
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
  [exports.EffectTypeId] = effectable_js_1.effectVariance;
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
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: (0, Inspectable_js_1.toJSON)(this.value)
    };
  }
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  }
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  }
}
/** @internal */
const isEffect = u => (0, Predicate_js_1.hasProperty)(u, exports.EffectTypeId);
exports.isEffect = isEffect;
/* @internal */
const withFiberRuntime = withRuntime => {
  const effect = new EffectPrimitive(OpCodes.OP_WITH_RUNTIME);
  effect.i0 = withRuntime;
  return effect;
};
exports.withFiberRuntime = withFiberRuntime;
/* @internal */
exports.acquireUseRelease = /*#__PURE__*/(0, Function_js_1.dual)(3, (acquire, use, release) => (0, exports.uninterruptibleMask)(restore => (0, exports.flatMap)(acquire, a => (0, exports.flatMap)((0, exports.exit)((0, exports.suspend)(() => restore((0, exports.step)(use(a))))), exit => {
  if (exit._tag === "Success" && exit.value._op === "Blocked") {
    const value = exit.value;
    return (0, exports.blocked)(value.i0, (0, exports.acquireUseRelease)((0, exports.succeed)(a), () => value.i1, release));
  }
  const flat = (0, exports.exitFlatten)(exit);
  return (0, exports.suspend)(() => release(a, flat)).pipe((0, exports.matchCauseEffect)({
    onFailure: cause => {
      switch (flat._tag) {
        case OpCodes.OP_FAILURE:
          {
            return (0, exports.failCause)(internalCause.parallel(flat.i0, cause));
          }
        case OpCodes.OP_SUCCESS:
          {
            return (0, exports.failCause)(cause);
          }
      }
    },
    onSuccess: () => flat
  }));
}))));
/* @internal */
exports.as = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.flatMap)(self, () => (0, exports.succeed)(value)));
/* @internal */
const asUnit = self => (0, exports.as)(self, void 0);
exports.asUnit = asUnit;
/* @internal */
const async = (register, blockingOn = FiberId.none) => (0, exports.suspend)(() => {
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
  return (0, exports.onInterrupt)(effect, () => {
    if (controllerRef) {
      controllerRef.abort();
    }
    return cancelerRef ?? exports.unit;
  });
});
exports.async = async;
/* @internal */
const asyncEither = (register, blockingOn = FiberId.none) => (0, exports.async)(resume => {
  const result = register(resume);
  if (Either.isRight(result)) {
    resume(result.right);
  } else {
    return result.left;
  }
}, blockingOn);
exports.asyncEither = asyncEither;
/* @internal */
exports.catchAllCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const effect = new EffectPrimitive(OpCodes.OP_ON_FAILURE);
  effect.i0 = self;
  effect.i1 = f;
  return effect;
});
/* @internal */
exports.catchAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.matchEffect)(self, {
  onFailure: f,
  onSuccess: exports.succeed
}));
/**
 * @macro identity
 * @internal
 */
const unified = f => (...args) => f(...args);
exports.unified = unified;
/* @internal */
exports.catchIf = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, predicate, f) => (0, exports.catchAllCause)(self, cause => {
  const either = internalCause.failureOrCause(cause);
  switch (either._tag) {
    case "Left":
      {
        return predicate(either.left) ? f(either.left) : (0, exports.failCause)(cause);
      }
    case "Right":
      {
        return (0, exports.failCause)(either.right);
      }
  }
}));
/* @internal */
exports.catchSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.catchAllCause)(self, cause => {
  const either = internalCause.failureOrCause(cause);
  switch (either._tag) {
    case "Left":
      {
        return (0, Function_js_1.pipe)(pf(either.left), Option.getOrElse(() => (0, exports.failCause)(cause)));
      }
    case "Right":
      {
        return (0, exports.failCause)(either.right);
      }
  }
}));
/* @internal */
const checkInterruptible = f => (0, exports.withFiberRuntime)((_, status) => f(_runtimeFlags.interruption(status.runtimeFlags)));
exports.checkInterruptible = checkInterruptible;
const spanSymbol = /*#__PURE__*/Symbol.for("effect/SpanAnnotation");
const originalSymbol = /*#__PURE__*/Symbol.for("effect/OriginalAnnotation");
/* @internal */
const originalInstance = obj => {
  if ((0, Predicate_js_1.hasProperty)(obj, originalSymbol)) {
    // @ts-expect-error
    return obj[originalSymbol];
  }
  return obj;
};
exports.originalInstance = originalInstance;
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
const die = defect => (0, Predicate_js_1.isObject)(defect) && !(spanSymbol in defect) ? (0, exports.withFiberRuntime)(fiber => (0, exports.failCause)(internalCause.die(capture(defect, (0, exports.currentSpanFromFiber)(fiber))))) : (0, exports.failCause)(internalCause.die(defect));
exports.die = die;
/* @internal */
const dieMessage = message => (0, exports.failCauseSync)(() => internalCause.die(internalCause.RuntimeException(message)));
exports.dieMessage = dieMessage;
/* @internal */
const dieSync = evaluate => (0, exports.flatMap)((0, exports.sync)(evaluate), exports.die);
exports.dieSync = dieSync;
/* @internal */
const either = self => (0, exports.matchEffect)(self, {
  onFailure: e => (0, exports.succeed)(Either.left(e)),
  onSuccess: a => (0, exports.succeed)(Either.right(a))
});
exports.either = either;
/* @internal */
const exit = self => (0, exports.matchCause)(self, {
  onFailure: exports.exitFailCause,
  onSuccess: exports.exitSucceed
});
exports.exit = exit;
/* @internal */
const fail = error => (0, Predicate_js_1.isObject)(error) && !(spanSymbol in error) ? (0, exports.withFiberRuntime)(fiber => (0, exports.failCause)(internalCause.fail(capture(error, (0, exports.currentSpanFromFiber)(fiber))))) : (0, exports.failCause)(internalCause.fail(error));
exports.fail = fail;
/* @internal */
const failSync = evaluate => (0, exports.flatMap)((0, exports.sync)(evaluate), exports.fail);
exports.failSync = failSync;
/* @internal */
const failCause = cause => {
  const effect = new EffectPrimitiveFailure(OpCodes.OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
exports.failCause = failCause;
/* @internal */
const failCauseSync = evaluate => (0, exports.flatMap)((0, exports.sync)(evaluate), exports.failCause);
exports.failCauseSync = failCauseSync;
/* @internal */
exports.fiberId = /*#__PURE__*/(0, exports.withFiberRuntime)(state => (0, exports.succeed)(state.id()));
/* @internal */
const fiberIdWith = f => (0, exports.withFiberRuntime)(state => f(state.id()));
exports.fiberIdWith = fiberIdWith;
/* @internal */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const effect = new EffectPrimitive(OpCodes.OP_ON_SUCCESS);
  effect.i0 = self;
  effect.i1 = f;
  return effect;
});
/* @internal */
const step = self => {
  const effect = new EffectPrimitive("OnStep");
  effect.i0 = self;
  effect.i1 = exports.exitSucceed;
  return effect;
};
exports.step = step;
/* @internal */
const flatMapStep = (self, f) => {
  const effect = new EffectPrimitive("OnStep");
  effect.i0 = self;
  effect.i1 = f;
  return effect;
};
exports.flatMapStep = flatMapStep;
/* @internal */
const flatten = self => (0, exports.flatMap)(self, Function_js_1.identity);
exports.flatten = flatten;
/* @internal */
const flip = self => (0, exports.matchEffect)(self, {
  onFailure: exports.succeed,
  onSuccess: exports.fail
});
exports.flip = flip;
/* @internal */
exports.matchCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => (0, exports.matchCauseEffect)(self, {
  onFailure: cause => (0, exports.succeed)(onFailure(cause)),
  onSuccess: a => (0, exports.succeed)(onSuccess(a))
}));
/* @internal */
exports.matchCauseEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
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
exports.matchEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => (0, exports.matchCauseEffect)(self, {
  onFailure: cause => {
    const failures = internalCause.failures(cause);
    const defects = internalCause.defects(cause);
    if (defects.length > 0) {
      return (0, exports.failCause)(internalCause.electFailures(cause));
    }
    if (failures.length > 0) {
      return onFailure(Chunk.unsafeHead(failures));
    }
    return (0, exports.failCause)(cause);
  },
  onSuccess
}));
/* @internal */
exports.forEachSequential = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.suspend)(() => {
  const arr = ReadonlyArray.fromIterable(self);
  const ret = new Array(arr.length);
  let i = 0;
  return (0, exports.as)((0, exports.whileLoop)({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: b => {
      ret[i++] = b;
    }
  }), ret);
}));
/* @internal */
exports.forEachSequentialDiscard = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.suspend)(() => {
  const arr = ReadonlyArray.fromIterable(self);
  let i = 0;
  return (0, exports.whileLoop)({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: () => {
      i++;
    }
  });
}));
/* @internal */
exports.if_ = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] === "boolean" || (0, exports.isEffect)(args[0]), (self, {
  onFalse,
  onTrue
}) => typeof self === "boolean" ? self ? onTrue : onFalse : (0, exports.flatMap)(self, (0, exports.unified)(b => b ? onTrue : onFalse)));
/* @internal */
exports.interrupt = /*#__PURE__*/(0, exports.flatMap)(exports.fiberId, fiberId => (0, exports.interruptWith)(fiberId));
/* @internal */
const interruptWith = fiberId => (0, exports.failCause)(internalCause.interrupt(fiberId));
exports.interruptWith = interruptWith;
/* @internal */
const interruptible = self => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = RuntimeFlagsPatch.enable(_runtimeFlags.Interruption);
  const _continue = orBlock => {
    if (orBlock._tag === "Blocked") {
      return (0, exports.blocked)(orBlock.i0, (0, exports.interruptible)(orBlock.i1));
    } else {
      return orBlock;
    }
  };
  effect.i1 = () => (0, exports.flatMapStep)(self, _continue);
  return effect;
};
exports.interruptible = interruptible;
/* @internal */
const interruptibleMask = f => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = RuntimeFlagsPatch.enable(_runtimeFlags.Interruption);
  const _continue = step => {
    if (step._op === "Blocked") {
      return (0, exports.blocked)(step.i0, (0, exports.interruptible)(step.i1));
    }
    return step;
  };
  effect.i1 = oldFlags => _runtimeFlags.interruption(oldFlags) ? (0, exports.step)(f(exports.interruptible)) : (0, exports.step)(f(exports.uninterruptible));
  return (0, exports.flatMap)(effect, _continue);
};
exports.interruptibleMask = interruptibleMask;
/* @internal */
exports.intoDeferred = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, deferred) => (0, exports.uninterruptibleMask)(restore => (0, exports.flatMap)((0, exports.exit)(restore(self)), exit => (0, exports.deferredDone)(deferred, exit))));
/* @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flatMap)(self, a => (0, exports.sync)(() => f(a))));
/* @internal */
exports.mapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => (0, exports.matchEffect)(self, {
  onFailure: e => (0, exports.failSync)(() => onFailure(e)),
  onSuccess: a => (0, exports.sync)(() => onSuccess(a))
}));
/* @internal */
exports.mapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.matchCauseEffect)(self, {
  onFailure: cause => {
    const either = internalCause.failureOrCause(cause);
    switch (either._tag) {
      case "Left":
        {
          return (0, exports.failSync)(() => f(either.left));
        }
      case "Right":
        {
          return (0, exports.failCause)(either.right);
        }
    }
  },
  onSuccess: exports.succeed
}));
/* @internal */
exports.onError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cleanup) => (0, exports.onExit)(self, (0, exports.unified)(exit => (0, exports.exitIsSuccess)(exit) ? exports.unit : cleanup(exit.i0))));
/* @internal */
exports.onExit = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cleanup) => (0, exports.uninterruptibleMask)(restore => (0, exports.matchCauseEffect)(restore(self), {
  onFailure: cause1 => {
    const result = (0, exports.exitFailCause)(cause1);
    return (0, exports.matchCauseEffect)(cleanup(result), {
      onFailure: cause2 => (0, exports.exitFailCause)(internalCause.sequential(cause1, cause2)),
      onSuccess: () => result
    });
  },
  onSuccess: success => {
    const result = (0, exports.exitSucceed)(success);
    return (0, exports.zipRight)(cleanup(result), result);
  }
})));
/* @internal */
exports.onInterrupt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cleanup) => (0, exports.onExit)(self, (0, exports.exitMatch)({
  onFailure: cause => internalCause.isInterruptedOnly(cause) ? (0, exports.asUnit)(cleanup(internalCause.interruptors(cause))) : exports.unit,
  onSuccess: () => exports.unit
})));
/* @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.attemptOrElse)(self, that, exports.succeed));
/* @internal */
const orDie = self => (0, exports.orDieWith)(self, Function_js_1.identity);
exports.orDie = orDie;
/* @internal */
exports.orDieWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.matchEffect)(self, {
  onFailure: e => (0, exports.die)(f(e)),
  onSuccess: exports.succeed
}));
/* @internal */
const partitionMap = (elements, f) => ReadonlyArray.fromIterable(elements).reduceRight(([lefts, rights], current) => {
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
exports.partitionMap = partitionMap;
/* @internal */
exports.runtimeFlags = /*#__PURE__*/(0, exports.withFiberRuntime)((_, status) => (0, exports.succeed)(status.runtimeFlags));
/* @internal */
const succeed = value => {
  const effect = new EffectPrimitiveSuccess(OpCodes.OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
exports.succeed = succeed;
/* @internal */
const suspend = effect => (0, exports.flatMap)((0, exports.sync)(effect), Function_js_1.identity);
exports.suspend = suspend;
/* @internal */
const sync = evaluate => {
  const effect = new EffectPrimitive(OpCodes.OP_SYNC);
  effect.i0 = evaluate;
  return effect;
};
exports.sync = sync;
/* @internal */
exports.tap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flatMap)(self, a => (0, exports.as)(f(a), a)));
/* @internal */
const transplant = f => (0, exports.withFiberRuntime)(state => {
  const scopeOverride = state.getFiberRef(exports.currentForkScopeOverride);
  const scope = (0, Function_js_1.pipe)(scopeOverride, Option.getOrElse(() => state.scope()));
  return f((0, exports.fiberRefLocally)(exports.currentForkScopeOverride, Option.some(scope)));
});
exports.transplant = transplant;
/* @internal */
exports.attemptOrElse = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, onSuccess) => (0, exports.matchCauseEffect)(self, {
  onFailure: cause => {
    const defects = internalCause.defects(cause);
    if (defects.length > 0) {
      return (0, exports.failCause)(Option.getOrThrow(internalCause.keepDefectsAndElectFailures(cause)));
    }
    return that();
  },
  onSuccess
}));
/* @internal */
const uninterruptible = self => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = RuntimeFlagsPatch.disable(_runtimeFlags.Interruption);
  effect.i1 = () => (0, exports.flatMapStep)(self, _continue);
  const _continue = orBlock => {
    if (orBlock._tag === "Blocked") {
      return (0, exports.blocked)(orBlock.i0, (0, exports.uninterruptible)(orBlock.i1));
    } else {
      return orBlock;
    }
  };
  return effect;
};
exports.uninterruptible = uninterruptible;
/* @internal */
const uninterruptibleMask = f => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = RuntimeFlagsPatch.disable(_runtimeFlags.Interruption);
  const _continue = step => {
    if (step._op === "Blocked") {
      return (0, exports.blocked)(step.i0, (0, exports.uninterruptible)(step.i1));
    }
    return step;
  };
  effect.i1 = oldFlags => _runtimeFlags.interruption(oldFlags) ? (0, exports.step)(f(exports.interruptible)) : (0, exports.step)(f(exports.uninterruptible));
  return (0, exports.flatMap)(effect, _continue);
};
exports.uninterruptibleMask = uninterruptibleMask;
/* @internal */
exports.unit = /*#__PURE__*/(0, exports.succeed)(void 0);
/* @internal */
const updateRuntimeFlags = patch => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = patch;
  effect.i1 = void 0;
  return effect;
};
exports.updateRuntimeFlags = updateRuntimeFlags;
/* @internal */
exports.whenEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.flatMap)(predicate, b => {
  if (b) {
    return (0, Function_js_1.pipe)(self, (0, exports.map)(Option.some));
  }
  return (0, exports.succeed)(Option.none());
}));
/* @internal */
const whileLoop = options => {
  const effect = new EffectPrimitive(OpCodes.OP_WHILE);
  effect.i0 = options.while;
  effect.i1 = options.body;
  effect.i2 = options.step;
  return effect;
};
exports.whileLoop = whileLoop;
/* @internal */
exports.withConcurrency = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, concurrency) => (0, exports.fiberRefLocally)(self, exports.currentConcurrency, concurrency));
/* @internal */
exports.withRequestBatching = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, requestBatching) => (0, exports.fiberRefLocally)(self, exports.currentRequestBatching, requestBatching));
/* @internal */
exports.withRuntimeFlags = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, update) => {
  const effect = new EffectPrimitive(OpCodes.OP_UPDATE_RUNTIME_FLAGS);
  effect.i0 = update;
  effect.i1 = () => self;
  return effect;
});
/** @internal */
exports.withTracerTiming = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, enabled) => (0, exports.fiberRefLocally)(effect, exports.currentTracerTimingEnabled, enabled));
/* @internal */
const yieldNow = options => {
  const effect = new EffectPrimitive(OpCodes.OP_YIELD);
  return typeof options?.priority !== "undefined" ? (0, exports.withSchedulingPriority)(options.priority)(effect) : effect;
};
exports.yieldNow = yieldNow;
/* @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.flatMap)(self, a => (0, exports.map)(that, b => [a, b])));
/* @internal */
exports.zipFlatten = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.flatMap)(self, a => (0, exports.map)(that, b => [...a, b])));
/* @internal */
exports.zipLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.flatMap)(self, a => (0, exports.as)(that, a)));
/* @internal */
exports.zipRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.flatMap)(self, () => that));
/* @internal */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.flatMap)(self, a => (0, exports.map)(that, b => f(a, b))));
/* @internal */
exports.never = /*#__PURE__*/(0, exports.asyncEither)(() => {
  const interval = setInterval(() => {
    //
  }, 2 ** 31 - 1);
  return Either.left((0, exports.sync)(() => clearInterval(interval)));
});
// -----------------------------------------------------------------------------
// Fiber
// -----------------------------------------------------------------------------
/* @internal */
const interruptFiber = self => (0, exports.flatMap)(exports.fiberId, fiberId => (0, Function_js_1.pipe)(self, (0, exports.interruptAsFiber)(fiberId)));
exports.interruptFiber = interruptFiber;
/* @internal */
exports.interruptAsFiber = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, fiberId) => (0, exports.flatMap)(self.interruptAsFork(fiberId), () => self.await()));
// -----------------------------------------------------------------------------
// LogLevel
// -----------------------------------------------------------------------------
/** @internal */
exports.logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 50000,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 40000,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 30000,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 20000,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 10000,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.allLogLevels = [exports.logLevelAll, exports.logLevelTrace, exports.logLevelDebug, exports.logLevelInfo, exports.logLevelWarning, exports.logLevelError, exports.logLevelFatal, exports.logLevelNone];
// -----------------------------------------------------------------------------
// FiberRef
// -----------------------------------------------------------------------------
/** @internal */
const FiberRefSymbolKey = "effect/FiberRef";
/** @internal */
exports.FiberRefTypeId = /*#__PURE__*/Symbol.for(FiberRefSymbolKey);
/** @internal */
const fiberRefVariance = {
  _A: _ => _
};
/* @internal */
const fiberRefGet = self => (0, exports.fiberRefModify)(self, a => [a, a]);
exports.fiberRefGet = fiberRefGet;
/* @internal */
exports.fiberRefGetAndSet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.fiberRefModify)(self, v => [v, value]));
/* @internal */
exports.fiberRefGetAndUpdate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.fiberRefModify)(self, v => [v, f(v)]));
/* @internal */
exports.fiberRefGetAndUpdateSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.fiberRefModify)(self, v => [v, Option.getOrElse(pf(v), () => v)]));
/* @internal */
exports.fiberRefGetWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flatMap)((0, exports.fiberRefGet)(self), f));
/* @internal */
exports.fiberRefSet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.fiberRefModify)(self, () => [void 0, value]));
/* @internal */
const fiberRefDelete = self => (0, exports.withFiberRuntime)(state => {
  state.unsafeDeleteFiberRef(self);
  return exports.unit;
});
exports.fiberRefDelete = fiberRefDelete;
/* @internal */
const fiberRefReset = self => (0, exports.fiberRefSet)(self, self.initial);
exports.fiberRefReset = fiberRefReset;
/* @internal */
exports.fiberRefModify = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.withFiberRuntime)(state => {
  const [b, a] = f(state.getFiberRef(self));
  state.setFiberRef(self, a);
  return (0, exports.succeed)(b);
}));
/* @internal */
const fiberRefModifySome = (self, def, f) => (0, exports.fiberRefModify)(self, v => Option.getOrElse(f(v), () => [def, v]));
exports.fiberRefModifySome = fiberRefModifySome;
/* @internal */
exports.fiberRefUpdate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.fiberRefModify)(self, v => [void 0, f(v)]));
/* @internal */
exports.fiberRefUpdateSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.fiberRefModify)(self, v => [void 0, Option.getOrElse(pf(v), () => v)]));
/* @internal */
exports.fiberRefUpdateAndGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.fiberRefModify)(self, v => {
  const result = f(v);
  return [result, result];
}));
/* @internal */
exports.fiberRefUpdateSomeAndGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.fiberRefModify)(self, v => {
  const result = Option.getOrElse(pf(v), () => v);
  return [result, result];
}));
// circular
/** @internal */
const RequestResolverSymbolKey = "effect/RequestResolver";
/** @internal */
exports.RequestResolverTypeId = /*#__PURE__*/Symbol.for(RequestResolverSymbolKey);
const dataSourceVariance = {
  _R: _ => _,
  _A: _ => _
};
/** @internal */
class RequestResolverImpl {
  runAll;
  target;
  [exports.RequestResolverTypeId] = dataSourceVariance;
  constructor(runAll, target) {
    this.runAll = runAll;
    this.target = target;
    this.runAll = runAll;
  }
  [Hash.symbol]() {
    return this.target ? Hash.hash(this.target) : Hash.random(this);
  }
  [Equal.symbol](that) {
    return this.target ? (0, exports.isRequestResolver)(that) && Equal.equals(this.target, that.target) : this === that;
  }
  identified(...ids) {
    return new RequestResolverImpl(this.runAll, Chunk.fromIterable(ids));
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.RequestResolverImpl = RequestResolverImpl;
/** @internal */
const isRequestResolver = u => (0, Predicate_js_1.hasProperty)(u, exports.RequestResolverTypeId);
exports.isRequestResolver = isRequestResolver;
// end
/** @internal */
exports.resolverLocally = /*#__PURE__*/(0, Function_js_1.dual)(3, (use, self, value) => new RequestResolverImpl(requests => (0, exports.fiberRefLocally)(use.runAll(requests), self, value), Chunk.make("Locally", use, self, value)));
/** @internal */
const requestBlockLocally = (self, ref, value) => _blockedRequests.reduce(self, LocallyReducer(ref, value));
exports.requestBlockLocally = requestBlockLocally;
const LocallyReducer = (ref, value) => ({
  emptyCase: () => _blockedRequests.empty,
  parCase: (left, right) => _blockedRequests.par(left, right),
  seqCase: (left, right) => _blockedRequests.seq(left, right),
  singleCase: (dataSource, blockedRequest) => _blockedRequests.single((0, exports.resolverLocally)(dataSource, ref, value), blockedRequest)
});
/* @internal */
exports.fiberRefLocally = /*#__PURE__*/(0, Function_js_1.dual)(3, (use, self, value) => (0, exports.flatMap)((0, exports.acquireUseRelease)((0, exports.zipLeft)((0, exports.fiberRefGet)(self), (0, exports.fiberRefSet)(self, value)), () => (0, exports.step)(use), oldValue => (0, exports.fiberRefSet)(self, oldValue)), res => {
  if (res._op === "Blocked") {
    return (0, exports.blocked)(res.i0, (0, exports.fiberRefLocally)(res.i1, self, value));
  }
  return res;
}));
/* @internal */
exports.fiberRefLocallyWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (use, self, f) => (0, exports.fiberRefGetWith)(self, a => (0, exports.fiberRefLocally)(use, self, f(a))));
/** @internal */
const fiberRefUnsafeMake = (initial, options) => (0, exports.fiberRefUnsafeMakePatch)(initial, {
  differ: internalDiffer.update(),
  fork: options?.fork ?? Function_js_1.identity,
  join: options?.join
});
exports.fiberRefUnsafeMake = fiberRefUnsafeMake;
/** @internal */
const fiberRefUnsafeMakeHashSet = initial => {
  const differ = internalDiffer.hashSet();
  return (0, exports.fiberRefUnsafeMakePatch)(initial, {
    differ,
    fork: differ.empty
  });
};
exports.fiberRefUnsafeMakeHashSet = fiberRefUnsafeMakeHashSet;
/** @internal */
const fiberRefUnsafeMakeContext = initial => {
  const differ = internalDiffer.environment();
  return (0, exports.fiberRefUnsafeMakePatch)(initial, {
    differ,
    fork: differ.empty
  });
};
exports.fiberRefUnsafeMakeContext = fiberRefUnsafeMakeContext;
/** @internal */
const fiberRefUnsafeMakePatch = (initial, options) => ({
  [exports.FiberRefTypeId]: fiberRefVariance,
  initial,
  diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
  combine: (first, second) => options.differ.combine(first, second),
  patch: patch => oldValue => options.differ.patch(patch, oldValue),
  fork: options.fork,
  join: options.join ?? ((_, n) => n),
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
});
exports.fiberRefUnsafeMakePatch = fiberRefUnsafeMakePatch;
/** @internal */
const fiberRefUnsafeMakeRuntimeFlags = initial => (0, exports.fiberRefUnsafeMakePatch)(initial, {
  differ: _runtimeFlags.differ,
  fork: _runtimeFlags.differ.empty
});
exports.fiberRefUnsafeMakeRuntimeFlags = fiberRefUnsafeMakeRuntimeFlags;
/** @internal */
exports.currentContext = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentContext"), () => (0, exports.fiberRefUnsafeMakeContext)(Context.empty()));
/** @internal */
exports.currentSchedulingPriority = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => (0, exports.fiberRefUnsafeMake)(0));
/** @internal */
exports.currentMaxOpsBeforeYield = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => (0, exports.fiberRefUnsafeMake)(2048));
/** @internal */
exports.currentLogAnnotations = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentLogAnnotation"), () => (0, exports.fiberRefUnsafeMake)(HashMap.empty()));
/** @internal */
exports.currentLogLevel = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentLogLevel"), () => (0, exports.fiberRefUnsafeMake)(exports.logLevelInfo));
/** @internal */
exports.currentLogSpan = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentLogSpan"), () => (0, exports.fiberRefUnsafeMake)(List.empty()));
/** @internal */
exports.withSchedulingPriority = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, scheduler) => (0, exports.fiberRefLocally)(self, exports.currentSchedulingPriority, scheduler));
/** @internal */
exports.withMaxOpsBeforeYield = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, scheduler) => (0, exports.fiberRefLocally)(self, exports.currentMaxOpsBeforeYield, scheduler));
/** @internal */
exports.currentConcurrency = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentConcurrency"), () => (0, exports.fiberRefUnsafeMake)("unbounded"));
/**
 * @internal
 */
exports.currentRequestBatching = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentRequestBatching"), () => (0, exports.fiberRefUnsafeMake)(true));
/** @internal */
exports.currentUnhandledErrorLogLevel = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => (0, exports.fiberRefUnsafeMake)(Option.some(exports.logLevelDebug)));
/** @internal */
exports.withUnhandledErrorLogLevel = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, level) => (0, exports.fiberRefLocally)(self, exports.currentUnhandledErrorLogLevel, level));
/** @internal */
exports.currentMetricLabels = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentMetricLabels"), () => (0, exports.fiberRefUnsafeMakeHashSet)(HashSet.empty()));
/* @internal */
exports.metricLabels = /*#__PURE__*/(0, exports.fiberRefGet)(exports.currentMetricLabels);
/** @internal */
exports.currentForkScopeOverride = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => (0, exports.fiberRefUnsafeMake)(Option.none(), {
  fork: () => Option.none(),
  join: (parent, _) => parent
}));
/** @internal */
exports.currentInterruptedCause = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentInterruptedCause"), () => (0, exports.fiberRefUnsafeMake)(internalCause.empty, {
  fork: () => internalCause.empty,
  join: (parent, _) => parent
}));
/** @internal */
exports.currentTracerTimingEnabled = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentTracerTiming"), () => (0, exports.fiberRefUnsafeMake)(true));
/** @internal */
exports.currentTracerSpanAnnotations = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentTracerSpanAnnotations"), () => (0, exports.fiberRefUnsafeMake)(HashMap.empty()));
/** @internal */
exports.currentTracerSpanLinks = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentTracerSpanLinks"), () => (0, exports.fiberRefUnsafeMake)(Chunk.empty()));
// -----------------------------------------------------------------------------
// Scope
// -----------------------------------------------------------------------------
/** @internal */
exports.ScopeTypeId = /*#__PURE__*/Symbol.for("effect/Scope");
/** @internal */
exports.CloseableScopeTypeId = /*#__PURE__*/Symbol.for("effect/CloseableScope");
/* @internal */
const scopeAddFinalizer = (self, finalizer) => self.addFinalizer(() => (0, exports.asUnit)(finalizer));
exports.scopeAddFinalizer = scopeAddFinalizer;
/* @internal */
const scopeAddFinalizerExit = (self, finalizer) => self.addFinalizer(finalizer);
exports.scopeAddFinalizerExit = scopeAddFinalizerExit;
/* @internal */
const scopeClose = (self, exit) => self.close(exit);
exports.scopeClose = scopeClose;
/* @internal */
const scopeFork = (self, strategy) => self.fork(strategy);
exports.scopeFork = scopeFork;
/* @internal */
exports.releaseMapAdd = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => (0, exports.map)((0, exports.releaseMapAddIfOpen)(self, finalizer), Option.match({
  onNone: () => () => exports.unit,
  onSome: key => exit => (0, exports.releaseMapRelease)(key, exit)(self)
})));
/* @internal */
exports.releaseMapRelease = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, exit) => (0, exports.suspend)(() => {
  switch (self.state._tag) {
    case "Exited":
      {
        return exports.unit;
      }
    case "Running":
      {
        const finalizer = self.state.finalizers.get(key);
        self.state.finalizers.delete(key);
        if (finalizer != null) {
          return self.state.update(finalizer)(exit);
        }
        return exports.unit;
      }
  }
}));
/* @internal */
exports.releaseMapAddIfOpen = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => (0, exports.suspend)(() => {
  switch (self.state._tag) {
    case "Exited":
      {
        self.state.nextKey += 1;
        return (0, exports.as)(finalizer(self.state.exit), Option.none());
      }
    case "Running":
      {
        const key = self.state.nextKey;
        self.state.finalizers.set(key, finalizer);
        self.state.nextKey += 1;
        return (0, exports.succeed)(Option.some(key));
      }
  }
}));
/* @internal */
exports.releaseMapGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, key) => (0, exports.sync)(() => self.state._tag === "Running" ? Option.fromNullable(self.state.finalizers.get(key)) : Option.none()));
/* @internal */
exports.releaseMapReplace = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, finalizer) => (0, exports.suspend)(() => {
  switch (self.state._tag) {
    case "Exited":
      {
        return (0, exports.as)(finalizer(self.state.exit), Option.none());
      }
    case "Running":
      {
        const fin = Option.fromNullable(self.state.finalizers.get(key));
        self.state.finalizers.set(key, finalizer);
        return (0, exports.succeed)(fin);
      }
  }
}));
/* @internal */
exports.releaseMapRemove = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, key) => (0, exports.sync)(() => {
  if (self.state._tag === "Exited") {
    return Option.none();
  }
  const fin = Option.fromNullable(self.state.finalizers.get(key));
  self.state.finalizers.delete(key);
  return fin;
}));
/* @internal */
exports.releaseMapMake = /*#__PURE__*/(0, exports.sync)(() => ({
  state: {
    _tag: "Running",
    nextKey: 0,
    finalizers: new Map(),
    update: Function_js_1.identity
  }
}));
// -----------------------------------------------------------------------------
// Exit
// -----------------------------------------------------------------------------
/** @internal */
const exitIsExit = u => (0, exports.isEffect)(u) && "_tag" in u && (u._tag === "Success" || u._tag === "Failure");
exports.exitIsExit = exitIsExit;
/** @internal */
const exitIsFailure = self => self._tag === "Failure";
exports.exitIsFailure = exitIsFailure;
/** @internal */
const exitIsSuccess = self => self._tag === "Success";
exports.exitIsSuccess = exitIsSuccess;
/** @internal */
const exitIsInterrupted = self => {
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
exports.exitIsInterrupted = exitIsInterrupted;
/** @internal */
exports.exitAs = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return (0, exports.exitFailCause)(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return (0, exports.exitSucceed)(value);
      }
  }
});
/** @internal */
const exitAsUnit = self => (0, exports.exitAs)(self, void 0);
exports.exitAsUnit = exitAsUnit;
/** @internal */
const exitCauseOption = self => {
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
exports.exitCauseOption = exitCauseOption;
/** @internal */
const exitCollectAll = (exits, options) => exitCollectAllInternal(exits, options?.parallel ? internalCause.parallel : internalCause.sequential);
exports.exitCollectAll = exitCollectAll;
/** @internal */
const exitDie = defect => (0, exports.exitFailCause)(internalCause.die(defect));
exports.exitDie = exitDie;
/** @internal */
exports.exitExists = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
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
const exitFail = error => (0, exports.exitFailCause)(internalCause.fail(error));
exports.exitFail = exitFail;
/** @internal */
const exitFailCause = cause => {
  const effect = new EffectPrimitiveFailure(OpCodes.OP_FAILURE);
  effect.i0 = cause;
  return effect;
};
exports.exitFailCause = exitFailCause;
/** @internal */
exports.exitFlatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return (0, exports.exitFailCause)(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return f(self.i0);
      }
  }
});
/** @internal */
exports.exitFlatMapEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return (0, exports.succeed)((0, exports.exitFailCause)(self.i0));
      }
    case OpCodes.OP_SUCCESS:
      {
        return f(self.i0);
      }
  }
});
/** @internal */
const exitFlatten = self => (0, Function_js_1.pipe)(self, (0, exports.exitFlatMap)(Function_js_1.identity));
exports.exitFlatten = exitFlatten;
/** @internal */
exports.exitForEachEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return (0, exports.succeed)((0, exports.exitFailCause)(self.i0));
      }
    case OpCodes.OP_SUCCESS:
      {
        return (0, exports.exit)(f(self.i0));
      }
  }
});
/** @internal */
const exitFromEither = either => {
  switch (either._tag) {
    case "Left":
      {
        return (0, exports.exitFail)(either.left);
      }
    case "Right":
      {
        return (0, exports.exitSucceed)(either.right);
      }
  }
};
exports.exitFromEither = exitFromEither;
/** @internal */
const exitFromOption = option => {
  switch (option._tag) {
    case "None":
      {
        return (0, exports.exitFail)(void 0);
      }
    case "Some":
      {
        return (0, exports.exitSucceed)(option.value);
      }
  }
};
exports.exitFromOption = exitFromOption;
/** @internal */
exports.exitGetOrElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, orElse) => {
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
const exitInterrupt = fiberId => (0, exports.exitFailCause)(internalCause.interrupt(fiberId));
exports.exitInterrupt = exitInterrupt;
/** @internal */
exports.exitMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return (0, exports.exitFailCause)(self.i0);
      }
    case OpCodes.OP_SUCCESS:
      {
        return (0, exports.exitSucceed)(f(self.i0));
      }
  }
});
/** @internal */
exports.exitMapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return (0, exports.exitFailCause)((0, Function_js_1.pipe)(self.i0, internalCause.map(onFailure)));
      }
    case OpCodes.OP_SUCCESS:
      {
        return (0, exports.exitSucceed)(onSuccess(self.i0));
      }
  }
});
/** @internal */
exports.exitMapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return (0, exports.exitFailCause)((0, Function_js_1.pipe)(self.i0, internalCause.map(f)));
      }
    case OpCodes.OP_SUCCESS:
      {
        return (0, exports.exitSucceed)(self.i0);
      }
  }
});
/** @internal */
exports.exitMapErrorCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        return (0, exports.exitFailCause)(f(self.i0));
      }
    case OpCodes.OP_SUCCESS:
      {
        return (0, exports.exitSucceed)(self.i0);
      }
  }
});
/** @internal */
exports.exitMatch = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
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
exports.exitMatchEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
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
const exitSucceed = value => {
  const effect = new EffectPrimitiveSuccess(OpCodes.OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
exports.exitSucceed = exitSucceed;
/** @internal */
exports.exitUnit = /*#__PURE__*/(0, exports.exitSucceed)(void 0);
/** @internal */
exports.exitZip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.exitZipWith)(self, that, {
  onSuccess: (a, a2) => [a, a2],
  onFailure: internalCause.sequential
}));
/** @internal */
exports.exitZipLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.exitZipWith)(self, that, {
  onSuccess: (a, _) => a,
  onFailure: internalCause.sequential
}));
/** @internal */
exports.exitZipRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.exitZipWith)(self, that, {
  onSuccess: (_, a2) => a2,
  onFailure: internalCause.sequential
}));
/** @internal */
exports.exitZipPar = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.exitZipWith)(self, that, {
  onSuccess: (a, a2) => [a, a2],
  onFailure: internalCause.parallel
}));
/** @internal */
exports.exitZipParLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.exitZipWith)(self, that, {
  onSuccess: (a, _) => a,
  onFailure: internalCause.parallel
}));
/** @internal */
exports.exitZipParRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.exitZipWith)(self, that, {
  onSuccess: (_, a2) => a2,
  onFailure: internalCause.parallel
}));
/** @internal */
exports.exitZipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OpCodes.OP_FAILURE:
      {
        switch (that._tag) {
          case OpCodes.OP_SUCCESS:
            {
              return (0, exports.exitFailCause)(self.i0);
            }
          case OpCodes.OP_FAILURE:
            {
              return (0, exports.exitFailCause)(onFailure(self.i0, that.i0));
            }
        }
      }
    case OpCodes.OP_SUCCESS:
      {
        switch (that._tag) {
          case OpCodes.OP_SUCCESS:
            {
              return (0, exports.exitSucceed)(onSuccess(self.i0, that.i0));
            }
          case OpCodes.OP_FAILURE:
            {
              return (0, exports.exitFailCause)(that.i0);
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
  return (0, Function_js_1.pipe)(Chunk.tailNonEmpty(list), ReadonlyArray.reduce((0, Function_js_1.pipe)(Chunk.headNonEmpty(list), (0, exports.exitMap)(Chunk.of)), (accumulator, current) => (0, Function_js_1.pipe)(accumulator, (0, exports.exitZipWith)(current, {
    onSuccess: (list, value) => (0, Function_js_1.pipe)(list, Chunk.prepend(value)),
    onFailure: combineCauses
  }))), (0, exports.exitMap)(Chunk.reverse), (0, exports.exitMap)(chunk => Array.from(chunk)), Option.some);
};
// -----------------------------------------------------------------------------
// Deferred
// -----------------------------------------------------------------------------
/** @internal */
const deferredUnsafeMake = fiberId => ({
  [deferred.DeferredTypeId]: deferred.deferredVariance,
  state: MutableRef.make(deferred.pending([])),
  blockingOn: fiberId,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
});
exports.deferredUnsafeMake = deferredUnsafeMake;
/* @internal */
const deferredMake = () => (0, exports.flatMap)(exports.fiberId, id => (0, exports.deferredMakeAs)(id));
exports.deferredMake = deferredMake;
/* @internal */
const deferredMakeAs = fiberId => (0, exports.sync)(() => (0, exports.deferredUnsafeMake)(fiberId));
exports.deferredMakeAs = deferredMakeAs;
/* @internal */
const deferredAwait = self => (0, exports.asyncEither)(k => {
  const state = MutableRef.get(self.state);
  switch (state._tag) {
    case DeferredOpCodes.OP_STATE_DONE:
      {
        return Either.right(state.effect);
      }
    case DeferredOpCodes.OP_STATE_PENDING:
      {
        (0, Function_js_1.pipe)(self.state, MutableRef.set(deferred.pending([k, ...state.joiners])));
        return Either.left(deferredInterruptJoiner(self, k));
      }
  }
}, self.blockingOn);
exports.deferredAwait = deferredAwait;
/* @internal */
exports.deferredComplete = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, effect) => (0, exports.intoDeferred)(effect, self));
/* @internal */
exports.deferredCompleteWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, effect) => (0, exports.sync)(() => {
  const state = MutableRef.get(self.state);
  switch (state._tag) {
    case DeferredOpCodes.OP_STATE_DONE:
      {
        return false;
      }
    case DeferredOpCodes.OP_STATE_PENDING:
      {
        (0, Function_js_1.pipe)(self.state, MutableRef.set(deferred.done(effect)));
        for (let i = 0; i < state.joiners.length; i++) {
          state.joiners[i](effect);
        }
        return true;
      }
  }
}));
/* @internal */
exports.deferredDone = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, exit) => (0, exports.deferredCompleteWith)(self, exit));
/* @internal */
exports.deferredFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, error) => (0, exports.deferredCompleteWith)(self, (0, exports.fail)(error)));
/* @internal */
exports.deferredFailSync = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, evaluate) => (0, exports.deferredCompleteWith)(self, (0, exports.failSync)(evaluate)));
/* @internal */
exports.deferredFailCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cause) => (0, exports.deferredCompleteWith)(self, (0, exports.failCause)(cause)));
/* @internal */
exports.deferredFailCauseSync = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, evaluate) => (0, exports.deferredCompleteWith)(self, (0, exports.failCauseSync)(evaluate)));
/* @internal */
exports.deferredDie = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, defect) => (0, exports.deferredCompleteWith)(self, (0, exports.die)(defect)));
/* @internal */
exports.deferredDieSync = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, evaluate) => (0, exports.deferredCompleteWith)(self, (0, exports.dieSync)(evaluate)));
/* @internal */
const deferredInterrupt = self => (0, exports.flatMap)(exports.fiberId, fiberId => (0, exports.deferredCompleteWith)(self, (0, exports.interruptWith)(fiberId)));
exports.deferredInterrupt = deferredInterrupt;
/* @internal */
exports.deferredInterruptWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, fiberId) => (0, exports.deferredCompleteWith)(self, (0, exports.interruptWith)(fiberId)));
/* @internal */
const deferredIsDone = self => (0, exports.sync)(() => MutableRef.get(self.state)._tag === DeferredOpCodes.OP_STATE_DONE);
exports.deferredIsDone = deferredIsDone;
/* @internal */
const deferredPoll = self => (0, exports.sync)(() => {
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
exports.deferredPoll = deferredPoll;
/* @internal */
exports.deferredSucceed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.deferredCompleteWith)(self, (0, exports.succeed)(value)));
/* @internal */
exports.deferredSync = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, evaluate) => (0, exports.deferredCompleteWith)(self, (0, exports.sync)(evaluate)));
/** @internal */
const deferredUnsafeDone = (self, effect) => {
  const state = MutableRef.get(self.state);
  if (state._tag === DeferredOpCodes.OP_STATE_PENDING) {
    (0, Function_js_1.pipe)(self.state, MutableRef.set(deferred.done(effect)));
    for (let i = state.joiners.length - 1; i >= 0; i--) {
      state.joiners[i](effect);
    }
  }
};
exports.deferredUnsafeDone = deferredUnsafeDone;
const deferredInterruptJoiner = (self, joiner) => (0, exports.sync)(() => {
  const state = MutableRef.get(self.state);
  if (state._tag === DeferredOpCodes.OP_STATE_PENDING) {
    (0, Function_js_1.pipe)(self.state, MutableRef.set(deferred.pending(state.joiners.filter(j => j !== joiner))));
  }
});
// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------
const constContext = /*#__PURE__*/(0, exports.fiberRefGet)(exports.currentContext);
/* @internal */
const context = () => constContext;
exports.context = context;
/* @internal */
const contextWith = f => (0, exports.map)((0, exports.context)(), f);
exports.contextWith = contextWith;
/* @internal */
const contextWithEffect = f => (0, exports.flatMap)((0, exports.context)(), f);
exports.contextWithEffect = contextWithEffect;
/* @internal */
exports.provideContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, context) => (0, exports.fiberRefLocally)(exports.currentContext, context)(self));
/* @internal */
exports.provideSomeContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, context) => (0, exports.fiberRefLocallyWith)(exports.currentContext, parent => Context.merge(parent, context))(self));
/* @internal */
exports.mapInputContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.contextWithEffect)(context => (0, exports.provideContext)(self, f(context))));
// -----------------------------------------------------------------------------
// Tracing
// -----------------------------------------------------------------------------
/** @internal */
const currentSpanFromFiber = fiber => {
  const span = fiber.getFiberRef(exports.currentContext).unsafeMap.get(internalTracer.spanTag);
  return span !== undefined && span._tag === "Span" ? Option.some(span) : Option.none();
};
exports.currentSpanFromFiber = currentSpanFromFiber;
//# sourceMappingURL=core.js.map