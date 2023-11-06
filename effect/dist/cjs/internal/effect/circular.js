"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipWithFiber = exports.zipRightFiber = exports.zipLeftFiber = exports.zipFiber = exports.updateSomeAndGetEffectSynchronized = exports.unsafeMakeSynchronized = exports.makeSynchronized = exports.synchronizedVariance = exports.SynchronizedTypeId = exports.timeoutTo = exports.timeoutFailCause = exports.timeoutFail = exports.timeout = exports.supervised = exports.scheduleForked = exports.raceFirst = exports.memoizeFunction = exports.fromFiberEffect = exports.fromFiber = exports.forkScoped = exports.forkIn = exports.forkAll = exports.ensuringChildren = exports.ensuringChild = exports.cachedInvalidate = exports.cached = exports.awaitAllChildren = exports.makeSemaphore = exports.unsafeMakeSemaphore = void 0;
const Duration = /*#__PURE__*/require("../../Duration.js");
const Either = /*#__PURE__*/require("../../Either.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Exit = /*#__PURE__*/require("../../Exit.js");
const FiberId = /*#__PURE__*/require("../../FiberId.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Hash = /*#__PURE__*/require("../../Hash.js");
const MutableHashMap = /*#__PURE__*/require("../../MutableHashMap.js");
const Option = /*#__PURE__*/require("../../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const Predicate = /*#__PURE__*/require("../../Predicate.js");
const Scheduler_js_1 = /*#__PURE__*/require("../../Scheduler.js");
const internalCause = /*#__PURE__*/require("../cause.js");
const effect = /*#__PURE__*/require("../core-effect.js");
const core = /*#__PURE__*/require("../core.js");
const executionStrategy = /*#__PURE__*/require("../executionStrategy.js");
const internalFiber = /*#__PURE__*/require("../fiber.js");
const fiberRuntime = /*#__PURE__*/require("../fiberRuntime.js");
const fiberScope_js_1 = /*#__PURE__*/require("../fiberScope.js");
const internalRef = /*#__PURE__*/require("../ref.js");
const _schedule = /*#__PURE__*/require("../schedule.js");
const supervisor = /*#__PURE__*/require("../supervisor.js");
/** @internal */
class Semaphore {
  permits;
  waiters = new Array();
  taken = 0;
  constructor(permits) {
    this.permits = permits;
  }
  get free() {
    return this.permits - this.taken;
  }
  take = n => core.asyncEither(resume => {
    if (this.free < n) {
      const observer = () => {
        if (this.free >= n) {
          const observerIndex = this.waiters.findIndex(cb => cb === observer);
          if (observerIndex !== -1) {
            this.waiters.splice(observerIndex, 1);
          }
          this.taken += n;
          resume(core.succeed(n));
        }
      };
      this.waiters.push(observer);
      return Either.left(core.sync(() => {
        const observerIndex = this.waiters.findIndex(cb => cb === observer);
        if (observerIndex !== -1) {
          this.waiters.splice(observerIndex, 1);
        }
      }));
    }
    this.taken += n;
    return Either.right(core.succeed(n));
  });
  release = n => core.withFiberRuntime(fiber => {
    this.taken -= n;
    fiber.getFiberRef(Scheduler_js_1.currentScheduler).scheduleTask(() => {
      this.waiters.forEach(wake => wake());
    }, fiber.getFiberRef(core.currentSchedulingPriority));
    return core.unit;
  });
  withPermits = n => self => core.uninterruptibleMask(restore => core.flatMap(restore(this.take(n)), permits => fiberRuntime.ensuring(restore(self), this.release(permits))));
}
/** @internal */
const unsafeMakeSemaphore = leases => {
  return new Semaphore(leases);
};
exports.unsafeMakeSemaphore = unsafeMakeSemaphore;
/** @internal */
const makeSemaphore = permits => core.sync(() => (0, exports.unsafeMakeSemaphore)(permits));
exports.makeSemaphore = makeSemaphore;
/** @internal */
const awaitAllChildren = self => (0, exports.ensuringChildren)(self, fiberRuntime.fiberAwaitAll);
exports.awaitAllChildren = awaitAllChildren;
/** @internal */
exports.cached = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, timeToLive) => core.map((0, exports.cachedInvalidate)(self, timeToLive), tuple => tuple[0]));
/** @internal */
exports.cachedInvalidate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, timeToLive) => {
  const duration = Duration.decode(timeToLive);
  return core.flatMap(core.context(), env => core.map((0, exports.makeSynchronized)(Option.none()), cache => [core.provideContext(getCachedValue(self, duration, cache), env), invalidateCache(cache)]));
});
/** @internal */
const computeCachedValue = (self, timeToLive, start) => {
  const timeToLiveMillis = Duration.toMillis(Duration.decode(timeToLive));
  return (0, Function_js_1.pipe)(core.deferredMake(), core.tap(deferred => core.intoDeferred(self, deferred)), core.map(deferred => Option.some([start + timeToLiveMillis, deferred])));
};
/** @internal */
const getCachedValue = (self, timeToLive, cache) => core.uninterruptibleMask(restore => (0, Function_js_1.pipe)(effect.clockWith(clock => clock.currentTimeMillis), core.flatMap(time => (0, exports.updateSomeAndGetEffectSynchronized)(cache, option => {
  switch (option._tag) {
    case "None":
      {
        return Option.some(computeCachedValue(self, timeToLive, time));
      }
    case "Some":
      {
        const [end] = option.value;
        return end - time <= 0 ? Option.some(computeCachedValue(self, timeToLive, time)) : Option.none();
      }
  }
})), core.flatMap(option => Option.isNone(option) ? core.dieMessage("BUG: Effect.cachedInvalidate - please report an issue at https://github.com/Effect-TS/io/issues") : restore(core.deferredAwait(option.value[1])))));
/** @internal */
const invalidateCache = cache => internalRef.set(cache, Option.none());
/** @internal */
exports.ensuringChild = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.ensuringChildren)(self, children => f(fiberRuntime.fiberAll(children))));
/** @internal */
exports.ensuringChildren = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, children) => core.flatMap(supervisor.track, supervisor => (0, Function_js_1.pipe)((0, exports.supervised)(self, supervisor), fiberRuntime.ensuring(core.flatMap(supervisor.value(), children)))));
/** @internal */
// @ts-expect-error
exports.forkAll = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (effects, options) => options?.discard ? core.forEachSequentialDiscard(effects, fiberRuntime.fork) : core.map(core.forEachSequential(effects, fiberRuntime.fork), fiberRuntime.fiberAll));
/** @internal */
exports.forkIn = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, scope) => core.uninterruptibleMask(restore => core.flatMap(scope.fork(executionStrategy.sequential), child => (0, Function_js_1.pipe)(restore(self), core.onExit(exit => child.close(exit)), fiberRuntime.forkDaemon, core.tap(fiber => child.addFinalizer(() => core.fiberIdWith(fiberId => Equal.equals(fiberId, fiber.id()) ? core.unit : core.asUnit(core.interruptFiber(fiber)))))))));
/** @internal */
const forkScoped = self => fiberRuntime.scopeWith(scope => (0, exports.forkIn)(self, scope));
exports.forkScoped = forkScoped;
/** @internal */
const fromFiber = fiber => internalFiber.join(fiber);
exports.fromFiber = fromFiber;
/** @internal */
const fromFiberEffect = fiber => core.suspend(() => core.flatMap(fiber, internalFiber.join));
exports.fromFiberEffect = fromFiberEffect;
const memoKeySymbol = /*#__PURE__*/Symbol.for("effect/Effect/memoizeFunction.key");
class Key {
  a;
  eq;
  [memoKeySymbol] = memoKeySymbol;
  constructor(a, eq) {
    this.a = a;
    this.eq = eq;
  }
  [Equal.symbol](that) {
    if (Predicate.hasProperty(that, memoKeySymbol)) {
      if (this.eq) {
        return this.eq(this.a, that.a);
      } else {
        return Equal.equals(this.a, that.a);
      }
    }
    return false;
  }
  [Hash.symbol]() {
    return this.eq ? 0 : Hash.hash(this.a);
  }
}
/** @internal */
const memoizeFunction = (f, eq) => {
  return (0, Function_js_1.pipe)(core.sync(() => MutableHashMap.empty()), core.flatMap(exports.makeSynchronized), core.map(ref => a => (0, Function_js_1.pipe)(ref.modifyEffect(map => {
    const result = (0, Function_js_1.pipe)(map, MutableHashMap.get(new Key(a, eq)));
    if (Option.isNone(result)) {
      return (0, Function_js_1.pipe)(core.deferredMake(), core.tap(deferred => (0, Function_js_1.pipe)(effect.diffFiberRefs(f(a)), core.intoDeferred(deferred), fiberRuntime.fork)), core.map(deferred => [deferred, (0, Function_js_1.pipe)(map, MutableHashMap.set(new Key(a, eq), deferred))]));
    }
    return core.succeed([result.value, map]);
  }), core.flatMap(core.deferredAwait), core.flatMap(([patch, b]) => (0, Function_js_1.pipe)(effect.patchFiberRefs(patch), core.as(b))))));
};
exports.memoizeFunction = memoizeFunction;
/** @internal */
exports.raceFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(core.exit(self), fiberRuntime.race(core.exit(that)), effect => core.flatten(effect)));
/** @internal */
exports.scheduleForked = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, Function_js_1.pipe)(self, _schedule.schedule_Effect(schedule), exports.forkScoped));
/** @internal */
exports.supervised = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, supervisor) => {
  const supervise = core.fiberRefLocallyWith(fiberRuntime.currentSupervisor, s => s.zip(supervisor));
  return supervise(self);
});
/** @internal */
exports.timeout = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, duration) => (0, exports.timeoutTo)(self, {
  onTimeout: Option.none,
  onSuccess: Option.some,
  duration
}));
/** @internal */
exports.timeoutFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  duration,
  onTimeout
}) => core.flatten((0, exports.timeoutTo)(self, {
  onTimeout: () => core.failSync(onTimeout),
  onSuccess: core.succeed,
  duration
})));
/** @internal */
exports.timeoutFailCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  duration,
  onTimeout
}) => core.flatten((0, exports.timeoutTo)(self, {
  onTimeout: () => core.failCauseSync(onTimeout),
  onSuccess: core.succeed,
  duration
})));
/** @internal */
exports.timeoutTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  duration,
  onSuccess,
  onTimeout
}) => core.fiberIdWith(parentFiberId => fiberRuntime.raceFibersWith(self, core.interruptible(effect.sleep(duration)), {
  onSelfWin: (winner, loser) => core.flatMap(winner.await(), exit => {
    if (exit._tag === "Success") {
      return core.flatMap(winner.inheritAll(), () => core.as(core.interruptAsFiber(loser, parentFiberId), onSuccess(exit.value)));
    } else {
      return core.flatMap(core.interruptAsFiber(loser, parentFiberId), () => core.exitFailCause(exit.cause));
    }
  }),
  onOtherWin: (winner, loser) => core.flatMap(winner.await(), exit => {
    if (exit._tag === "Success") {
      return core.flatMap(winner.inheritAll(), () => core.as(core.interruptAsFiber(loser, parentFiberId), onTimeout()));
    } else {
      return core.flatMap(core.interruptAsFiber(loser, parentFiberId), () => core.exitFailCause(exit.cause));
    }
  }),
  otherScope: fiberScope_js_1.globalScope
})));
// circular with Synchronized
/** @internal */
const SynchronizedSymbolKey = "effect/Ref/SynchronizedRef";
/** @internal */
exports.SynchronizedTypeId = /*#__PURE__*/Symbol.for(SynchronizedSymbolKey);
/** @internal */
exports.synchronizedVariance = {
  _A: _ => _
};
/** @internal */
class SynchronizedImpl {
  ref;
  withLock;
  [exports.SynchronizedTypeId] = exports.synchronizedVariance;
  [internalRef.RefTypeId] = internalRef.refVariance;
  constructor(ref, withLock) {
    this.ref = ref;
    this.withLock = withLock;
  }
  modify(f) {
    return this.modifyEffect(a => core.succeed(f(a)));
  }
  modifyEffect(f) {
    return this.withLock((0, Function_js_1.pipe)(core.flatMap(internalRef.get(this.ref), f), core.flatMap(([b, a]) => core.as(internalRef.set(this.ref, a), b))));
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
const makeSynchronized = value => core.sync(() => (0, exports.unsafeMakeSynchronized)(value));
exports.makeSynchronized = makeSynchronized;
/** @internal */
const unsafeMakeSynchronized = value => {
  const ref = internalRef.unsafeMake(value);
  const sem = (0, exports.unsafeMakeSemaphore)(1);
  return new SynchronizedImpl(ref, sem.withPermits(1));
};
exports.unsafeMakeSynchronized = unsafeMakeSynchronized;
/** @internal */
exports.updateSomeAndGetEffectSynchronized = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => self.modifyEffect(value => {
  const result = pf(value);
  switch (result._tag) {
    case "None":
      {
        return core.succeed([value, value]);
      }
    case "Some":
      {
        return core.map(result.value, a => [a, a]);
      }
  }
}));
// circular with Fiber
/** @internal */
exports.zipFiber = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWithFiber)(self, that, (a, b) => [a, b]));
/** @internal */
exports.zipLeftFiber = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWithFiber)(self, that, (a, _) => a));
/** @internal */
exports.zipRightFiber = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWithFiber)(self, that, (_, b) => b));
/** @internal */
exports.zipWithFiber = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => ({
  [internalFiber.FiberTypeId]: internalFiber.fiberVariance,
  id: () => (0, Function_js_1.pipe)(self.id(), FiberId.getOrElse(that.id())),
  await: () => (0, Function_js_1.pipe)(self.await(), core.flatten, fiberRuntime.zipWithOptions(core.flatten(that.await()), f, {
    concurrent: true
  }), core.exit),
  children: () => self.children(),
  inheritAll: () => core.zipRight(that.inheritAll(), self.inheritAll()),
  poll: () => core.zipWith(self.poll(), that.poll(), (optionA, optionB) => (0, Function_js_1.pipe)(optionA, Option.flatMap(exitA => (0, Function_js_1.pipe)(optionB, Option.map(exitB => Exit.zipWith(exitA, exitB, {
    onSuccess: f,
    onFailure: internalCause.parallel
  })))))),
  interruptAsFork: id => core.zipRight(self.interruptAsFork(id), that.interruptAsFork(id)),
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}));
//# sourceMappingURL=circular.js.map