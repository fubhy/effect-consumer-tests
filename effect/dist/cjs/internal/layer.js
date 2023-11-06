"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.succeedContext = exports.succeed = exports.service = exports.scope = exports.scopedContext = exports.scopedDiscard = exports.scoped = exports.retry = exports.provideMerge = exports.provide = exports.project = exports.passthrough = exports.orElse = exports.orDie = exports.mergeAll = exports.merge = exports.memoize = exports.match = exports.matchCause = exports.mapError = exports.map = exports.launch = exports.fromFunction = exports.fiberRefLocallyScopedWith = exports.fiberRefLocallyScoped = exports.fiberRefLocallyWith = exports.locallyEffect = exports.fiberRefLocally = exports.fromEffectContext = exports.fromEffectDiscard = exports.fromEffect = exports.fresh = exports.flatten = exports.flatMap = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.extendScope = exports.context = exports.discard = exports.dieSync = exports.die = exports.catchAllCause = exports.catchAll = exports.buildWithScope = exports.build = exports.isFresh = exports.isLayer = exports.LayerTypeId = void 0;
exports.effect_provide = exports.withParentSpan = exports.withSpan = exports.unwrapScoped = exports.unwrapEffect = exports.zipWithPar = exports.useMerge = exports.use = exports.toRuntime = exports.tapErrorCause = exports.tapError = exports.tap = exports.syncContext = exports.sync = exports.suspend = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Clock = /*#__PURE__*/require("../Clock.js");
const Context = /*#__PURE__*/require("../Context.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const FiberRefsPatch = /*#__PURE__*/require("../FiberRefsPatch.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const ScheduleDecision = /*#__PURE__*/require("../ScheduleDecision.js");
const Intervals = /*#__PURE__*/require("../ScheduleIntervals.js");
const Scope = /*#__PURE__*/require("../Scope.js");
const effect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const circular = /*#__PURE__*/require("./effect/circular.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const EffectOpCodes = /*#__PURE__*/require("./opCodes/effect.js");
const OpCodes = /*#__PURE__*/require("./opCodes/layer.js");
const ref = /*#__PURE__*/require("./ref.js");
const runtime = /*#__PURE__*/require("./runtime.js");
const runtimeFlags = /*#__PURE__*/require("./runtimeFlags.js");
const synchronized = /*#__PURE__*/require("./synchronizedRef.js");
const tracer = /*#__PURE__*/require("./tracer.js");
/** @internal */
const LayerSymbolKey = "effect/Layer";
/** @internal */
exports.LayerTypeId = /*#__PURE__*/Symbol.for(LayerSymbolKey);
/** @internal */
const layerVariance = {
  _RIn: _ => _,
  _E: _ => _,
  _ROut: _ => _
};
/** @internal */
const proto = {
  [exports.LayerTypeId]: layerVariance,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
const isLayer = u => (0, Predicate_js_1.hasProperty)(u, exports.LayerTypeId);
exports.isLayer = isLayer;
/** @internal */
const isFresh = self => {
  return self._tag === OpCodes.OP_FRESH;
};
exports.isFresh = isFresh;
// -----------------------------------------------------------------------------
// MemoMap
// -----------------------------------------------------------------------------
/** @internal */
class MemoMap {
  ref;
  constructor(ref) {
    this.ref = ref;
  }
  /**
   * Checks the memo map to see if a layer exists. If it is, immediately
   * returns it. Otherwise, obtains the layer, stores it in the memo map,
   * and adds a finalizer to the `Scope`.
   */
  getOrElseMemoize(layer, scope) {
    return (0, Function_js_1.pipe)(synchronized.modifyEffect(this.ref, map => {
      const inMap = map.get(layer);
      if (inMap !== undefined) {
        const [acquire, release] = inMap;
        const cached = (0, Function_js_1.pipe)(acquire, core.flatMap(([patch, b]) => (0, Function_js_1.pipe)(effect.patchFiberRefs(patch), core.as(b))), core.onExit(core.exitMatch({
          onFailure: () => core.unit,
          onSuccess: () => core.scopeAddFinalizerExit(scope, release)
        })));
        return core.succeed([cached, map]);
      }
      return (0, Function_js_1.pipe)(ref.make(0), core.flatMap(observers => (0, Function_js_1.pipe)(core.deferredMake(), core.flatMap(deferred => (0, Function_js_1.pipe)(ref.make(() => core.unit), core.map(finalizerRef => {
        const resource = core.uninterruptibleMask(restore => (0, Function_js_1.pipe)(fiberRuntime.scopeMake(), core.flatMap(innerScope => (0, Function_js_1.pipe)(restore(core.flatMap(withScope(layer, innerScope), f => effect.diffFiberRefs(f(this)))), core.exit, core.flatMap(exit => {
          switch (exit._tag) {
            case EffectOpCodes.OP_FAILURE:
              {
                return (0, Function_js_1.pipe)(core.deferredFailCause(deferred, exit.i0), core.zipRight(core.scopeClose(innerScope, exit)), core.zipRight(core.failCause(exit.i0)));
              }
            case EffectOpCodes.OP_SUCCESS:
              {
                return (0, Function_js_1.pipe)(ref.set(finalizerRef, exit => (0, Function_js_1.pipe)(core.scopeClose(innerScope, exit), core.whenEffect(ref.modify(observers, n => [n === 1, n - 1])), core.asUnit)), core.zipRight(ref.update(observers, n => n + 1)), core.zipRight(core.scopeAddFinalizerExit(scope, exit => (0, Function_js_1.pipe)(ref.get(finalizerRef), core.flatMap(finalizer => finalizer(exit))))), core.zipRight(core.deferredSucceed(deferred, exit.i0)), core.as(exit.i0[1]));
              }
          }
        })))));
        const memoized = [(0, Function_js_1.pipe)(core.deferredAwait(deferred), core.onExit(core.exitMatchEffect({
          onFailure: () => core.unit,
          onSuccess: () => ref.update(observers, n => n + 1)
        }))), exit => (0, Function_js_1.pipe)(ref.get(finalizerRef), core.flatMap(finalizer => finalizer(exit)))];
        return [resource, (0, exports.isFresh)(layer) ? map : map.set(layer, memoized)];
      }))))));
    }), core.flatten);
  }
}
const makeMemoMap = () => core.map(circular.makeSynchronized(new Map()), ref => new MemoMap(ref));
/** @internal */
const build = self => fiberRuntime.scopeWith(scope => (0, exports.buildWithScope)(self, scope));
exports.build = build;
/** @internal */
exports.buildWithScope = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, scope) => core.flatMap(makeMemoMap(), memoMap => core.flatMap(withScope(self, scope), run => run(memoMap))));
const withScope = (self, scope) => {
  const op = self;
  switch (op._tag) {
    case "Locally":
      {
        return core.sync(() => memoMap => op.f(memoMap.getOrElseMemoize(op.self, scope)));
      }
    case "ExtendScope":
      {
        return core.sync(() => memoMap => fiberRuntime.scopeWith(scope => memoMap.getOrElseMemoize(op.layer, scope)));
      }
    case "Fold":
      {
        return core.sync(() => memoMap => (0, Function_js_1.pipe)(memoMap.getOrElseMemoize(op.layer, scope), core.matchCauseEffect({
          onFailure: cause => memoMap.getOrElseMemoize(op.failureK(cause), scope),
          onSuccess: value => memoMap.getOrElseMemoize(op.successK(value), scope)
        })));
      }
    case "Fresh":
      {
        return core.sync(() => _ => (0, Function_js_1.pipe)(op.layer, (0, exports.buildWithScope)(scope)));
      }
    case "FromEffect":
      {
        return core.sync(() => _ => op.effect);
      }
    case "ProvideTo":
      {
        return core.sync(() => memoMap => (0, Function_js_1.pipe)(memoMap.getOrElseMemoize(op.first, scope), core.flatMap(env => (0, Function_js_1.pipe)(memoMap.getOrElseMemoize(op.second, scope), core.provideContext(env)))));
      }
    case "Scoped":
      {
        return core.sync(() => _ => fiberRuntime.scopeExtend(op.effect, scope));
      }
    case "Suspend":
      {
        return core.sync(() => memoMap => memoMap.getOrElseMemoize(op.evaluate(), scope));
      }
    case "ZipWith":
      {
        return core.sync(() => memoMap => (0, Function_js_1.pipe)(memoMap.getOrElseMemoize(op.first, scope), core.zipWith(memoMap.getOrElseMemoize(op.second, scope), op.zipK)));
      }
    case "ZipWithPar":
      {
        return core.sync(() => memoMap => (0, Function_js_1.pipe)(memoMap.getOrElseMemoize(op.first, scope), fiberRuntime.zipWithOptions(memoMap.getOrElseMemoize(op.second, scope), op.zipK, {
          concurrent: true
        })));
      }
  }
};
// -----------------------------------------------------------------------------
// Layer
// -----------------------------------------------------------------------------
/** @internal */
exports.catchAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, onFailure) => (0, exports.match)(self, {
  onFailure,
  onSuccess: exports.succeedContext
}));
/** @internal */
exports.catchAllCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, onFailure) => (0, exports.matchCause)(self, {
  onFailure,
  onSuccess: exports.succeedContext
}));
/** @internal */
const die = defect => (0, exports.failCause)(Cause.die(defect));
exports.die = die;
/** @internal */
const dieSync = evaluate => (0, exports.failCauseSync)(() => Cause.die(evaluate()));
exports.dieSync = dieSync;
/** @internal */
const discard = self => (0, exports.map)(self, () => Context.empty());
exports.discard = discard;
/** @internal */
const context = () => fromEffectContext(core.context());
exports.context = context;
/** @internal */
const extendScope = self => {
  const extendScope = Object.create(proto);
  extendScope._tag = OpCodes.OP_EXTEND_SCOPE;
  extendScope.layer = self;
  return extendScope;
};
exports.extendScope = extendScope;
/** @internal */
const fail = error => (0, exports.failCause)(Cause.fail(error));
exports.fail = fail;
/** @internal */
const failSync = evaluate => (0, exports.failCauseSync)(() => Cause.fail(evaluate()));
exports.failSync = failSync;
/** @internal */
const failCause = cause => fromEffectContext(core.failCause(cause));
exports.failCause = failCause;
/** @internal */
const failCauseSync = evaluate => fromEffectContext(core.failCauseSync(evaluate));
exports.failCauseSync = failCauseSync;
/** @internal */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.match)(self, {
  onFailure: exports.fail,
  onSuccess: f
}));
/** @internal */
exports.flatten = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, tag) => (0, exports.flatMap)(self, Context.get(tag)));
/** @internal */
const fresh = self => {
  const fresh = Object.create(proto);
  fresh._tag = OpCodes.OP_FRESH;
  fresh.layer = self;
  return fresh;
};
exports.fresh = fresh;
/** @internal */
exports.fromEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (a, b) => {
  const tagFirst = Context.isTag(a);
  const tag = tagFirst ? a : b;
  const effect = tagFirst ? b : a;
  return fromEffectContext(core.map(effect, service => Context.make(tag, service)));
});
/** @internal */
const fromEffectDiscard = effect => fromEffectContext(core.map(effect, () => Context.empty()));
exports.fromEffectDiscard = fromEffectDiscard;
/** @internal */
function fromEffectContext(effect) {
  const fromEffect = Object.create(proto);
  fromEffect._tag = OpCodes.OP_FROM_EFFECT;
  fromEffect.effect = effect;
  return fromEffect;
}
exports.fromEffectContext = fromEffectContext;
/** @internal */
exports.fiberRefLocally = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, ref, value) => (0, exports.locallyEffect)(self, core.fiberRefLocally(ref, value)));
/** @internal */
exports.locallyEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const locally = Object.create(proto);
  locally._tag = "Locally";
  locally.self = self;
  locally.f = f;
  return locally;
});
/** @internal */
exports.fiberRefLocallyWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, ref, value) => (0, exports.locallyEffect)(self, core.fiberRefLocallyWith(ref, value)));
/** @internal */
const fiberRefLocallyScoped = (self, value) => (0, exports.scopedDiscard)(fiberRuntime.fiberRefLocallyScoped(self, value));
exports.fiberRefLocallyScoped = fiberRefLocallyScoped;
/** @internal */
const fiberRefLocallyScopedWith = (self, value) => (0, exports.scopedDiscard)(fiberRuntime.fiberRefLocallyScopedWith(self, value));
exports.fiberRefLocallyScopedWith = fiberRefLocallyScopedWith;
/** @internal */
const fromFunction = (tagA, tagB, f) => fromEffectContext(core.map(tagA, a => Context.make(tagB, f(a))));
exports.fromFunction = fromFunction;
/** @internal */
const launch = self => fiberRuntime.scopedEffect(core.zipRight(fiberRuntime.scopeWith(scope => (0, Function_js_1.pipe)(self, (0, exports.buildWithScope)(scope))), core.never));
exports.launch = launch;
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flatMap)(self, context => (0, exports.succeedContext)(f(context))));
/** @internal */
exports.mapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.catchAll)(self, error => (0, exports.failSync)(() => f(error))));
/** @internal */
exports.matchCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => {
  const fold = Object.create(proto);
  fold._tag = OpCodes.OP_FOLD;
  fold.layer = self;
  fold.failureK = onFailure;
  fold.successK = onSuccess;
  return fold;
});
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => (0, exports.matchCause)(self, {
  onFailure: cause => {
    const failureOrCause = Cause.failureOrCause(cause);
    switch (failureOrCause._tag) {
      case "Left":
        {
          return onFailure(failureOrCause.left);
        }
      case "Right":
        {
          return (0, exports.failCause)(failureOrCause.right);
        }
    }
  },
  onSuccess
}));
/** @internal */
const memoize = self => fiberRuntime.scopeWith(scope => core.map(effect.memoize((0, exports.buildWithScope)(self, scope)), fromEffectContext));
exports.memoize = memoize;
/** @internal */
exports.merge = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWithPar)(self, that, (a, b) => (0, Function_js_1.pipe)(a, Context.merge(b))));
/** @internal */
const mergeAll = (...layers) => {
  let final = layers[0];
  for (let i = 1; i < layers.length; i++) {
    final = (0, exports.merge)(layers[i])(final);
  }
  return final;
};
exports.mergeAll = mergeAll;
/** @internal */
const orDie = self => (0, exports.catchAll)(self, defect => (0, exports.die)(defect));
exports.orDie = orDie;
/** @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.catchAll)(self, that));
/** @internal */
const passthrough = self => (0, exports.merge)((0, exports.context)(), self);
exports.passthrough = passthrough;
/** @internal */
exports.project = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, tagA, tagB, f) => (0, exports.map)(self, context => Context.make(tagB, f(Context.unsafeGet(context, tagA)))));
/** @internal */
exports.provide = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.suspend)(() => {
  const provideTo = Object.create(proto);
  provideTo._tag = OpCodes.OP_PROVIDE_TO;
  provideTo.first = Object.create(proto, {
    _tag: {
      value: OpCodes.OP_ZIP_WITH,
      enumerable: true
    },
    first: {
      value: (0, exports.context)(),
      enumerable: true
    },
    second: {
      value: self
    },
    zipK: {
      value: (a, b) => Context.merge(a, b)
    }
  });
  provideTo.second = that;
  return provideTo;
}));
/** @internal */
exports.provideMerge = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  const zipWith = Object.create(proto);
  zipWith._tag = OpCodes.OP_ZIP_WITH;
  zipWith.first = self;
  zipWith.second = (0, Function_js_1.pipe)(self, (0, exports.provide)(that));
  zipWith.zipK = (a, b) => Context.merge(a, b);
  return zipWith;
});
/** @internal */
exports.retry = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, exports.suspend)(() => {
  const stateTag = Context.Tag();
  return (0, Function_js_1.pipe)((0, exports.succeed)(stateTag, {
    state: schedule.initial
  }), (0, exports.flatMap)(env => retryLoop(self, schedule, stateTag, (0, Function_js_1.pipe)(env, Context.get(stateTag)).state)));
}));
/** @internal */
const retryLoop = (self, schedule, stateTag, state) => {
  return (0, Function_js_1.pipe)(self, (0, exports.catchAll)(error => (0, Function_js_1.pipe)(retryUpdate(schedule, stateTag, error, state), (0, exports.flatMap)(env => (0, exports.fresh)(retryLoop(self, schedule, stateTag, (0, Function_js_1.pipe)(env, Context.get(stateTag)).state))))));
};
/** @internal */
const retryUpdate = (schedule, stateTag, error, state) => {
  return (0, exports.fromEffect)(stateTag, (0, Function_js_1.pipe)(Clock.currentTimeMillis, core.flatMap(now => (0, Function_js_1.pipe)(schedule.step(now, error, state), core.flatMap(([state, _, decision]) => ScheduleDecision.isDone(decision) ? core.fail(error) : (0, Function_js_1.pipe)(Clock.sleep(Duration.millis(Intervals.start(decision.intervals) - now)), core.as({
    state
  })))))));
};
/** @internal */
exports.scoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (a, b) => {
  const tagFirst = Context.isTag(a);
  const tag = tagFirst ? a : b;
  const effect = tagFirst ? b : a;
  return (0, exports.scopedContext)(core.map(effect, service => Context.make(tag, service)));
});
/** @internal */
const scopedDiscard = effect => {
  return (0, exports.scopedContext)((0, Function_js_1.pipe)(effect, core.as(Context.empty())));
};
exports.scopedDiscard = scopedDiscard;
/** @internal */
const scopedContext = effect => {
  const scoped = Object.create(proto);
  scoped._tag = OpCodes.OP_SCOPED;
  scoped.effect = effect;
  return scoped;
};
exports.scopedContext = scopedContext;
/** @internal */
exports.scope = /*#__PURE__*/(0, exports.scopedContext)( /*#__PURE__*/core.map( /*#__PURE__*/fiberRuntime.acquireRelease( /*#__PURE__*/fiberRuntime.scopeMake(), (scope, exit) => scope.close(exit)), scope => Context.make(Scope.Scope, scope)));
/** @internal */
const service = tag => {
  return (0, exports.fromEffect)(tag, tag);
};
exports.service = service;
/** @internal */
exports.succeed = /*#__PURE__*/(0, Function_js_1.dual)(2, (a, b) => {
  const tagFirst = Context.isTag(a);
  const tag = tagFirst ? a : b;
  const resource = tagFirst ? b : a;
  return fromEffectContext(core.succeed(Context.make(tag, resource)));
});
/** @internal */
const succeedContext = context => {
  return fromEffectContext(core.succeed(context));
};
exports.succeedContext = succeedContext;
/** @internal */
const suspend = evaluate => {
  const suspend = Object.create(proto);
  suspend._tag = OpCodes.OP_SUSPEND;
  suspend.evaluate = evaluate;
  return suspend;
};
exports.suspend = suspend;
/** @internal */
exports.sync = /*#__PURE__*/(0, Function_js_1.dual)(2, (a, b) => {
  const tagFirst = Context.isTag(a);
  const tag = tagFirst ? a : b;
  const evaluate = tagFirst ? b : a;
  return fromEffectContext(core.sync(() => Context.make(tag, evaluate())));
});
/** @internal */
const syncContext = evaluate => {
  return fromEffectContext(core.sync(evaluate));
};
exports.syncContext = syncContext;
/** @internal */
exports.tap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flatMap)(self, context => fromEffectContext(core.as(f(context), context))));
/** @internal */
exports.tapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.catchAll)(self, e => fromEffectContext(core.flatMap(f(e), () => core.fail(e)))));
/** @internal */
exports.tapErrorCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.catchAllCause)(self, cause => fromEffectContext(core.flatMap(f(cause), () => core.failCause(cause)))));
/** @internal */
const toRuntime = self => {
  return (0, Function_js_1.pipe)(fiberRuntime.scopeWith(scope => (0, Function_js_1.pipe)(self, (0, exports.buildWithScope)(scope))), core.flatMap(context => (0, Function_js_1.pipe)(runtime.runtime(), core.provideContext(context))));
};
exports.toRuntime = toRuntime;
/** @internal */
exports.use = /*#__PURE__*/(0, Function_js_1.dual)(2, (that, self) => (0, exports.suspend)(() => {
  const provideTo = Object.create(proto);
  provideTo._tag = OpCodes.OP_PROVIDE_TO;
  provideTo.first = Object.create(proto, {
    _tag: {
      value: OpCodes.OP_ZIP_WITH,
      enumerable: true
    },
    first: {
      value: (0, exports.context)(),
      enumerable: true
    },
    second: {
      value: self
    },
    zipK: {
      value: (a, b) => (0, Function_js_1.pipe)(a, Context.merge(b))
    }
  });
  provideTo.second = that;
  return provideTo;
}));
/** @internal */
exports.useMerge = /*#__PURE__*/(0, Function_js_1.dual)(2, (that, self) => {
  const zipWith = Object.create(proto);
  zipWith._tag = OpCodes.OP_ZIP_WITH;
  zipWith.first = self;
  zipWith.second = (0, Function_js_1.pipe)(self, (0, exports.provide)(that));
  zipWith.zipK = (a, b) => {
    return (0, Function_js_1.pipe)(a, Context.merge(b));
  };
  return zipWith;
});
/** @internal */
exports.zipWithPar = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.suspend)(() => {
  const zipWithPar = Object.create(proto);
  zipWithPar._tag = OpCodes.OP_ZIP_WITH_PAR;
  zipWithPar.first = self;
  zipWithPar.second = that;
  zipWithPar.zipK = f;
  return zipWithPar;
}));
/** @internal */
const unwrapEffect = self => {
  const tag = Context.Tag();
  return (0, exports.flatMap)((0, exports.fromEffect)(tag, self), context => Context.get(context, tag));
};
exports.unwrapEffect = unwrapEffect;
/** @internal */
const unwrapScoped = self => {
  const tag = Context.Tag();
  return (0, exports.flatMap)((0, exports.scoped)(tag, self), context => Context.get(context, tag));
};
exports.unwrapScoped = unwrapScoped;
// -----------------------------------------------------------------------------
// tracing
// -----------------------------------------------------------------------------
/** @internal */
exports.withSpan = /*#__PURE__*/(0, Function_js_1.dual)(args => (0, exports.isLayer)(args[0]), (self, name, options) => (0, exports.unwrapScoped)(core.map(options?.onEnd ? core.tap(fiberRuntime.makeSpanScoped(name, options), span => fiberRuntime.addFinalizer(exit => options.onEnd(span, exit))) : fiberRuntime.makeSpanScoped(name, options), span => (0, exports.withParentSpan)(self, span))));
/** @internal */
exports.withParentSpan = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, span) => (0, exports.provide)((0, exports.succeedContext)(Context.make(tracer.spanTag, span)), self));
// circular with Effect
const provideSomeLayer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, layer) => core.acquireUseRelease(fiberRuntime.scopeMake(), scope => core.flatMap((0, exports.buildWithScope)(layer, scope), context => core.provideSomeContext(self, context)), (scope, exit) => core.scopeClose(scope, exit)));
const provideSomeRuntime = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, rt) => {
  const patchFlags = runtimeFlags.diff(runtime.defaultRuntime.runtimeFlags, rt.runtimeFlags);
  const inversePatchFlags = runtimeFlags.diff(rt.runtimeFlags, runtime.defaultRuntime.runtimeFlags);
  const patchRefs = FiberRefsPatch.diff(runtime.defaultRuntime.fiberRefs, rt.fiberRefs);
  const inversePatchRefs = FiberRefsPatch.diff(rt.fiberRefs, runtime.defaultRuntime.fiberRefs);
  return core.acquireUseRelease(core.flatMap(core.updateRuntimeFlags(patchFlags), () => effect.patchFiberRefs(patchRefs)), () => core.provideSomeContext(self, rt.context), () => core.flatMap(core.updateRuntimeFlags(inversePatchFlags), () => effect.patchFiberRefs(inversePatchRefs)));
});
/** @internal */
exports.effect_provide = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, source) => (0, exports.isLayer)(source) ? provideSomeLayer(self, source) : Context.isContext(source) ? core.provideSomeContext(self, source) : provideSomeRuntime(self, source));
//# sourceMappingURL=layer.js.map