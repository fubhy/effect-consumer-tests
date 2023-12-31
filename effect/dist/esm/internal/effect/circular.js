import * as Duration from "../../Duration.js";
import * as Either from "../../Either.js";
import * as Equal from "../../Equal.js";
import * as Exit from "../../Exit.js";
import * as FiberId from "../../FiberId.js";
import { dual, pipe } from "../../Function.js";
import * as Hash from "../../Hash.js";
import * as MutableHashMap from "../../MutableHashMap.js";
import * as Option from "../../Option.js";
import { pipeArguments } from "../../Pipeable.js";
import * as Predicate from "../../Predicate.js";
import { currentScheduler } from "../../Scheduler.js";
import * as internalCause from "../cause.js";
import * as effect from "../core-effect.js";
import * as core from "../core.js";
import * as executionStrategy from "../executionStrategy.js";
import * as internalFiber from "../fiber.js";
import * as fiberRuntime from "../fiberRuntime.js";
import { globalScope } from "../fiberScope.js";
import * as internalRef from "../ref.js";
import * as _schedule from "../schedule.js";
import * as supervisor from "../supervisor.js";
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
    fiber.getFiberRef(currentScheduler).scheduleTask(() => {
      this.waiters.forEach(wake => wake());
    }, fiber.getFiberRef(core.currentSchedulingPriority));
    return core.unit;
  });
  withPermits = n => self => core.uninterruptibleMask(restore => core.flatMap(restore(this.take(n)), permits => fiberRuntime.ensuring(restore(self), this.release(permits))));
}
/** @internal */
export const unsafeMakeSemaphore = leases => {
  return new Semaphore(leases);
};
/** @internal */
export const makeSemaphore = permits => core.sync(() => unsafeMakeSemaphore(permits));
/** @internal */
export const awaitAllChildren = self => ensuringChildren(self, fiberRuntime.fiberAwaitAll);
/** @internal */
export const cached = /*#__PURE__*/dual(2, (self, timeToLive) => core.map(cachedInvalidate(self, timeToLive), tuple => tuple[0]));
/** @internal */
export const cachedInvalidate = /*#__PURE__*/dual(2, (self, timeToLive) => {
  const duration = Duration.decode(timeToLive);
  return core.flatMap(core.context(), env => core.map(makeSynchronized(Option.none()), cache => [core.provideContext(getCachedValue(self, duration, cache), env), invalidateCache(cache)]));
});
/** @internal */
const computeCachedValue = (self, timeToLive, start) => {
  const timeToLiveMillis = Duration.toMillis(Duration.decode(timeToLive));
  return pipe(core.deferredMake(), core.tap(deferred => core.intoDeferred(self, deferred)), core.map(deferred => Option.some([start + timeToLiveMillis, deferred])));
};
/** @internal */
const getCachedValue = (self, timeToLive, cache) => core.uninterruptibleMask(restore => pipe(effect.clockWith(clock => clock.currentTimeMillis), core.flatMap(time => updateSomeAndGetEffectSynchronized(cache, option => {
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
export const ensuringChild = /*#__PURE__*/dual(2, (self, f) => ensuringChildren(self, children => f(fiberRuntime.fiberAll(children))));
/** @internal */
export const ensuringChildren = /*#__PURE__*/dual(2, (self, children) => core.flatMap(supervisor.track, supervisor => pipe(supervised(self, supervisor), fiberRuntime.ensuring(core.flatMap(supervisor.value(), children)))));
/** @internal */
// @ts-expect-error
export const forkAll = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (effects, options) => options?.discard ? core.forEachSequentialDiscard(effects, fiberRuntime.fork) : core.map(core.forEachSequential(effects, fiberRuntime.fork), fiberRuntime.fiberAll));
/** @internal */
export const forkIn = /*#__PURE__*/dual(2, (self, scope) => core.uninterruptibleMask(restore => core.flatMap(scope.fork(executionStrategy.sequential), child => pipe(restore(self), core.onExit(exit => child.close(exit)), fiberRuntime.forkDaemon, core.tap(fiber => child.addFinalizer(() => core.fiberIdWith(fiberId => Equal.equals(fiberId, fiber.id()) ? core.unit : core.asUnit(core.interruptFiber(fiber)))))))));
/** @internal */
export const forkScoped = self => fiberRuntime.scopeWith(scope => forkIn(self, scope));
/** @internal */
export const fromFiber = fiber => internalFiber.join(fiber);
/** @internal */
export const fromFiberEffect = fiber => core.suspend(() => core.flatMap(fiber, internalFiber.join));
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
export const memoizeFunction = (f, eq) => {
  return pipe(core.sync(() => MutableHashMap.empty()), core.flatMap(makeSynchronized), core.map(ref => a => pipe(ref.modifyEffect(map => {
    const result = pipe(map, MutableHashMap.get(new Key(a, eq)));
    if (Option.isNone(result)) {
      return pipe(core.deferredMake(), core.tap(deferred => pipe(effect.diffFiberRefs(f(a)), core.intoDeferred(deferred), fiberRuntime.fork)), core.map(deferred => [deferred, pipe(map, MutableHashMap.set(new Key(a, eq), deferred))]));
    }
    return core.succeed([result.value, map]);
  }), core.flatMap(core.deferredAwait), core.flatMap(([patch, b]) => pipe(effect.patchFiberRefs(patch), core.as(b))))));
};
/** @internal */
export const raceFirst = /*#__PURE__*/dual(2, (self, that) => pipe(core.exit(self), fiberRuntime.race(core.exit(that)), effect => core.flatten(effect)));
/** @internal */
export const scheduleForked = /*#__PURE__*/dual(2, (self, schedule) => pipe(self, _schedule.schedule_Effect(schedule), forkScoped));
/** @internal */
export const supervised = /*#__PURE__*/dual(2, (self, supervisor) => {
  const supervise = core.fiberRefLocallyWith(fiberRuntime.currentSupervisor, s => s.zip(supervisor));
  return supervise(self);
});
/** @internal */
export const timeout = /*#__PURE__*/dual(2, (self, duration) => timeoutTo(self, {
  onTimeout: Option.none,
  onSuccess: Option.some,
  duration
}));
/** @internal */
export const timeoutFail = /*#__PURE__*/dual(2, (self, {
  duration,
  onTimeout
}) => core.flatten(timeoutTo(self, {
  onTimeout: () => core.failSync(onTimeout),
  onSuccess: core.succeed,
  duration
})));
/** @internal */
export const timeoutFailCause = /*#__PURE__*/dual(2, (self, {
  duration,
  onTimeout
}) => core.flatten(timeoutTo(self, {
  onTimeout: () => core.failCauseSync(onTimeout),
  onSuccess: core.succeed,
  duration
})));
/** @internal */
export const timeoutTo = /*#__PURE__*/dual(2, (self, {
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
  otherScope: globalScope
})));
// circular with Synchronized
/** @internal */
const SynchronizedSymbolKey = "effect/Ref/SynchronizedRef";
/** @internal */
export const SynchronizedTypeId = /*#__PURE__*/Symbol.for(SynchronizedSymbolKey);
/** @internal */
export const synchronizedVariance = {
  _A: _ => _
};
/** @internal */
class SynchronizedImpl {
  ref;
  withLock;
  [SynchronizedTypeId] = synchronizedVariance;
  [internalRef.RefTypeId] = internalRef.refVariance;
  constructor(ref, withLock) {
    this.ref = ref;
    this.withLock = withLock;
  }
  modify(f) {
    return this.modifyEffect(a => core.succeed(f(a)));
  }
  modifyEffect(f) {
    return this.withLock(pipe(core.flatMap(internalRef.get(this.ref), f), core.flatMap(([b, a]) => core.as(internalRef.set(this.ref, a), b))));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/** @internal */
export const makeSynchronized = value => core.sync(() => unsafeMakeSynchronized(value));
/** @internal */
export const unsafeMakeSynchronized = value => {
  const ref = internalRef.unsafeMake(value);
  const sem = unsafeMakeSemaphore(1);
  return new SynchronizedImpl(ref, sem.withPermits(1));
};
/** @internal */
export const updateSomeAndGetEffectSynchronized = /*#__PURE__*/dual(2, (self, pf) => self.modifyEffect(value => {
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
export const zipFiber = /*#__PURE__*/dual(2, (self, that) => zipWithFiber(self, that, (a, b) => [a, b]));
/** @internal */
export const zipLeftFiber = /*#__PURE__*/dual(2, (self, that) => zipWithFiber(self, that, (a, _) => a));
/** @internal */
export const zipRightFiber = /*#__PURE__*/dual(2, (self, that) => zipWithFiber(self, that, (_, b) => b));
/** @internal */
export const zipWithFiber = /*#__PURE__*/dual(3, (self, that, f) => ({
  [internalFiber.FiberTypeId]: internalFiber.fiberVariance,
  id: () => pipe(self.id(), FiberId.getOrElse(that.id())),
  await: () => pipe(self.await(), core.flatten, fiberRuntime.zipWithOptions(core.flatten(that.await()), f, {
    concurrent: true
  }), core.exit),
  children: () => self.children(),
  inheritAll: () => core.zipRight(that.inheritAll(), self.inheritAll()),
  poll: () => core.zipWith(self.poll(), that.poll(), (optionA, optionB) => pipe(optionA, Option.flatMap(exitA => pipe(optionB, Option.map(exitB => Exit.zipWith(exitA, exitB, {
    onSuccess: f,
    onFailure: internalCause.parallel
  })))))),
  interruptAsFork: id => core.zipRight(self.interruptAsFork(id), that.interruptAsFork(id)),
  pipe() {
    return pipeArguments(this, arguments);
  }
}));
//# sourceMappingURL=circular.js.map