import * as Boolean from "../Boolean.js";
import * as Chunk from "../Chunk.js";
import * as Context from "../Context.js";
import * as Deferred from "../Deferred.js";
import { EffectTypeId } from "../Effectable.js";
import * as ExecutionStrategy from "../ExecutionStrategy.js";
import * as FiberId from "../FiberId.js";
import * as FiberRefs from "../FiberRefs.js";
import * as FiberRefsPatch from "../FiberRefsPatch.js";
import * as FiberStatus from "../FiberStatus.js";
import { dual, identity, pipe } from "../Function.js";
import { globalValue } from "../GlobalValue.js";
import * as HashMap from "../HashMap.js";
import * as HashSet from "../HashSet.js";
import * as LogLevel from "../LogLevel.js";
import * as MRef from "../MutableRef.js";
import * as Option from "../Option.js";
import { pipeArguments } from "../Pipeable.js";
import * as Predicate from "../Predicate.js";
import * as RA from "../ReadonlyArray.js";
import * as Ref from "../Ref.js";
import * as RuntimeFlagsPatch from "../RuntimeFlagsPatch.js";
import { currentScheduler } from "../Scheduler.js";
import * as _RequestBlock from "./blockedRequests.js";
import * as internalCause from "./cause.js";
import * as clock from "./clock.js";
import { currentRequestMap } from "./completedRequestMap.js";
import * as concurrency from "./concurrency.js";
import { configProviderTag } from "./configProvider.js";
import * as internalEffect from "./core-effect.js";
import * as core from "./core.js";
import * as defaultServices from "./defaultServices.js";
import { consoleTag } from "./defaultServices/console.js";
import * as executionStrategy from "./executionStrategy.js";
import * as internalFiber from "./fiber.js";
import * as FiberMessage from "./fiberMessage.js";
import * as fiberRefs from "./fiberRefs.js";
import * as fiberScope from "./fiberScope.js";
import * as internalLogger from "./logger.js";
import * as metric from "./metric.js";
import * as metricBoundaries from "./metric/boundaries.js";
import * as metricLabel from "./metric/label.js";
import * as OpCodes from "./opCodes/effect.js";
import { complete } from "./request.js";
import * as _runtimeFlags from "./runtimeFlags.js";
import { OpSupervision } from "./runtimeFlags.js";
import * as supervisor from "./supervisor.js";
import * as SupervisorPatch from "./supervisor/patch.js";
import * as tracer from "./tracer.js";
import { moduleVersion } from "./version.js";
/** @internal */
export const fiberStarted = /*#__PURE__*/metric.counter("effect_fiber_started");
/** @internal */
export const fiberActive = /*#__PURE__*/metric.counter("effect_fiber_active");
/** @internal */
export const fiberSuccesses = /*#__PURE__*/metric.counter("effect_fiber_successes");
/** @internal */
export const fiberFailures = /*#__PURE__*/metric.counter("effect_fiber_failures");
/** @internal */
export const fiberLifetimes = /*#__PURE__*/metric.tagged( /*#__PURE__*/metric.histogram("effect_fiber_lifetimes", /*#__PURE__*/metricBoundaries.exponential({
  start: 1.0,
  factor: 1.3,
  count: 100
})), "time_unit", "milliseconds");
/** @internal */
const EvaluationSignalContinue = "Continue";
/** @internal */
const EvaluationSignalDone = "Done";
/** @internal */
const EvaluationSignalYieldNow = "Yield";
/** @internal */
export const runtimeFiberVariance = {
  _E: _ => _,
  _A: _ => _
};
const absurd = _ => {
  throw new Error(`BUG: FiberRuntime - ${JSON.stringify(_)} - please report an issue at https://github.com/Effect-TS/io/issues`);
};
const contOpSuccess = {
  [OpCodes.OP_ON_SUCCESS]: (_, cont, value) => {
    return cont.i1(value);
  },
  ["OnStep"]: (_, cont, value) => {
    return cont.i1(core.exitSucceed(value));
  },
  [OpCodes.OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) => {
    return cont.i2(value);
  },
  [OpCodes.OP_REVERT_FLAGS]: (self, cont, value) => {
    self.patchRuntimeFlags(self._runtimeFlags, cont.patch);
    if (_runtimeFlags.interruptible(self._runtimeFlags) && self.isInterrupted()) {
      return core.exitFailCause(self.getInterruptedCause());
    } else {
      return core.exitSucceed(value);
    }
  },
  [OpCodes.OP_WHILE]: (self, cont, value) => {
    cont.i2(value);
    if (cont.i0()) {
      self.pushStack(cont);
      return cont.i1();
    } else {
      return core.unit;
    }
  }
};
const drainQueueWhileRunningTable = {
  [FiberMessage.OP_INTERRUPT_SIGNAL]: (self, runtimeFlags, cur, message) => {
    self.processNewInterruptSignal(message.cause);
    return _runtimeFlags.interruptible(runtimeFlags) ? core.exitFailCause(message.cause) : cur;
  },
  [FiberMessage.OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [FiberMessage.OP_STATEFUL]: (self, runtimeFlags, cur, message) => {
    message.onFiber(self, FiberStatus.running(runtimeFlags));
    return cur;
  },
  [FiberMessage.OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) => {
    return core.flatMap(core.yieldNow(), () => cur);
  }
};
/**
 * Executes all requests, submitting requests to each data source in parallel.
 */
const runBlockedRequests = self => core.forEachSequentialDiscard(_RequestBlock.flatten(self), requestsByRequestResolver => forEachParUnboundedDiscard(_RequestBlock.sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential]) => {
  const map = new Map();
  for (const block of sequential) {
    for (const entry of block) {
      map.set(entry.request, entry);
    }
  }
  return core.fiberRefLocally(invokeWithInterrupt(dataSource.runAll(sequential), sequential.flat()), currentRequestMap, map);
}, false));
/** @internal */
export class FiberRuntime {
  [internalFiber.FiberTypeId] = internalFiber.fiberVariance;
  [internalFiber.RuntimeFiberTypeId] = runtimeFiberVariance;
  pipe() {
    return pipeArguments(this, arguments);
  }
  _fiberRefs;
  _fiberId;
  _runtimeFlags;
  _queue = new Array();
  _children = null;
  _observers = new Array();
  _running = false;
  _stack = [];
  _asyncInterruptor = null;
  _asyncBlockingOn = null;
  _exitValue = null;
  _steps = [false];
  _supervisor;
  _scheduler;
  _tracer;
  currentOpCount = 0;
  isYielding = false;
  constructor(fiberId, fiberRefs0, runtimeFlags0) {
    this._runtimeFlags = runtimeFlags0;
    this._fiberId = fiberId;
    this._fiberRefs = fiberRefs0;
    this._supervisor = this.getFiberRef(currentSupervisor);
    this._scheduler = this.getFiberRef(currentScheduler);
    if (_runtimeFlags.runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(core.currentMetricLabels);
      fiberStarted.unsafeUpdate(1, tags);
      fiberActive.unsafeUpdate(1, tags);
    }
    this._tracer = Context.get(this.getFiberRef(defaultServices.currentServices), tracer.tracerTag);
  }
  /**
   * The identity of the fiber.
   */
  id() {
    return this._fiberId;
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background. This can be called to "kick off" execution of a fiber after
   * it has been created.
   */
  resume(effect) {
    this.tell(FiberMessage.resume(effect));
  }
  /**
   * The status of the fiber.
   */
  status() {
    return this.ask((_, status) => status);
  }
  /**
   * Gets the fiber runtime flags.
   */
  runtimeFlags() {
    return this.ask((state, status) => {
      if (FiberStatus.isDone(status)) {
        return state._runtimeFlags;
      }
      return status.runtimeFlags;
    });
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return fiberScope.unsafeMake(this);
  }
  /**
   * Retrieves the immediate children of the fiber.
   */
  children() {
    return this.ask(fiber => Array.from(fiber.getChildren()));
  }
  /**
   * Gets the fiber's set of children.
   */
  getChildren() {
    if (this._children === null) {
      this._children = new Set();
    }
    return this._children;
  }
  /**
   * Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
   * if the fiber has not been interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getInterruptedCause() {
    return this.getFiberRef(core.currentInterruptedCause);
  }
  /**
   * Retrieves the whole set of fiber refs.
   */
  fiberRefs() {
    return this.ask(fiber => fiber.getFiberRefs());
  }
  /**
   * Returns an effect that will contain information computed from the fiber
   * state and status while running on the fiber.
   *
   * This allows the outside world to interact safely with mutable fiber state
   * without locks or immutable data.
   */
  ask(f) {
    return core.suspend(() => {
      const deferred = core.deferredUnsafeMake(this._fiberId);
      this.tell(FiberMessage.stateful((fiber, status) => {
        core.deferredUnsafeDone(deferred, core.sync(() => f(fiber, status)));
      }));
      return core.deferredAwait(deferred);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(message) {
    this._queue.push(message);
    if (!this._running) {
      this._running = true;
      this.drainQueueLaterOnExecutor();
    }
  }
  await() {
    return core.async(resume => {
      const cb = exit => resume(core.succeed(exit));
      this.tell(FiberMessage.stateful((fiber, _) => {
        if (fiber._exitValue !== null) {
          cb(this._exitValue);
        } else {
          fiber.addObserver(cb);
        }
      }));
      return core.sync(() => this.tell(FiberMessage.stateful((fiber, _) => {
        fiber.removeObserver(cb);
      })));
    }, this.id());
  }
  inheritAll() {
    return core.withFiberRuntime((parentFiber, parentStatus) => {
      const parentFiberId = parentFiber.id();
      const parentFiberRefs = parentFiber.getFiberRefs();
      const parentRuntimeFlags = parentStatus.runtimeFlags;
      const childFiberRefs = this.getFiberRefs();
      const updatedFiberRefs = fiberRefs.joinAs(parentFiberRefs, parentFiberId, childFiberRefs);
      parentFiber.setFiberRefs(updatedFiberRefs);
      const updatedRuntimeFlags = parentFiber.getFiberRef(currentRuntimeFlags);
      const patch = pipe(_runtimeFlags.diff(parentRuntimeFlags, updatedRuntimeFlags),
      // Do not inherit WindDown or Interruption!
      RuntimeFlagsPatch.exclude(_runtimeFlags.Interruption), RuntimeFlagsPatch.exclude(_runtimeFlags.WindDown));
      return core.updateRuntimeFlags(patch);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  poll() {
    return core.sync(() => Option.fromNullable(this._exitValue));
  }
  /**
   * Unsafely observes the fiber, but returns immediately if it is not
   * already done.
   */
  unsafePoll() {
    return this._exitValue;
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  interruptAsFork(fiberId) {
    return core.sync(() => this.tell(FiberMessage.interruptSignal(internalCause.interrupt(fiberId))));
  }
  /**
   * Adds an observer to the list of observers.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addObserver(observer) {
    if (this._exitValue !== null) {
      observer(this._exitValue);
    } else {
      this._observers.push(observer);
    }
  }
  /**
   * Removes the specified observer from the list of observers that will be
   * notified when the fiber exits.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeObserver(observer) {
    this._observers = this._observers.filter(o => o !== observer);
  }
  /**
   * Retrieves all fiber refs of the fiber.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRefs() {
    this.setFiberRef(currentRuntimeFlags, this._runtimeFlags);
    return this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(fiberRef) {
    this._fiberRefs = fiberRefs.delete_(this._fiberRefs, fiberRef);
  }
  /**
   * Retrieves the state of the fiber ref, or else its initial value.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRef(fiberRef) {
    if (this._fiberRefs.locals.has(fiberRef)) {
      return this._fiberRefs.locals.get(fiberRef)[0][1];
    }
    return fiberRef.initial;
  }
  /**
   * Sets the fiber ref to the specified value.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRef(fiberRef, value) {
    this._fiberRefs = fiberRefs.updatedAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef,
      value
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this._tracer = Context.get(this.getFiberRef(defaultServices.currentServices), tracer.tracerTag);
    this._supervisor = this.getFiberRef(currentSupervisor);
    this._scheduler = this.getFiberRef(currentScheduler);
  }
  /**
   * Wholesale replaces all fiber refs of this fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRefs(fiberRefs) {
    this._fiberRefs = fiberRefs;
    this.refreshRefCache();
  }
  /**
   * Adds a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addChild(child) {
    this.getChildren().add(child);
  }
  /**
   * Removes a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeChild(child) {
    this.getChildren().delete(child);
  }
  /**
   * On the current thread, executes all messages in the fiber's inbox. This
   * method may return before all work is done, in the event the fiber executes
   * an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueOnCurrentThread() {
    let recurse = true;
    while (recurse) {
      let evaluationSignal = EvaluationSignalContinue;
      const prev = globalThis[internalFiber.currentFiberURI];
      globalThis[internalFiber.currentFiberURI] = this;
      try {
        while (evaluationSignal === EvaluationSignalContinue) {
          evaluationSignal = this._queue.length === 0 ? EvaluationSignalDone : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
        }
      } finally {
        this._running = false;
        globalThis[internalFiber.currentFiberURI] = prev;
      }
      // Maybe someone added something to the queue between us checking, and us
      // giving up the drain. If so, we need to restart the draining, but only
      // if we beat everyone else to the restart:
      if (this._queue.length > 0 && !this._running) {
        this._running = true;
        if (evaluationSignal === EvaluationSignalYieldNow) {
          this.drainQueueLaterOnExecutor();
          recurse = false;
        } else {
          recurse = true;
        }
      } else {
        recurse = false;
      }
    }
  }
  /**
   * Schedules the execution of all messages in the fiber's inbox.
   *
   * This method will return immediately after the scheduling
   * operation is completed, but potentially before such messages have been
   * executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueLaterOnExecutor() {
    this._scheduler.scheduleTask(this.run, this.getFiberRef(core.currentSchedulingPriority));
  }
  /**
   * Drains the fiber's message queue while the fiber is actively running,
   * returning the next effect to execute, which may be the input effect if no
   * additional effect needs to be executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueWhileRunning(runtimeFlags, cur0) {
    let cur = cur0;
    while (this._queue.length > 0) {
      const message = this._queue.splice(0, 1)[0];
      // @ts-expect-error
      cur = drainQueueWhileRunningTable[message._tag](this, runtimeFlags, cur, message);
    }
    return cur;
  }
  /**
   * Determines if the fiber is interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  isInterrupted() {
    return !internalCause.isEmpty(this.getFiberRef(core.currentInterruptedCause));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(cause) {
    const oldSC = this.getFiberRef(core.currentInterruptedCause);
    this.setFiberRef(core.currentInterruptedCause, internalCause.sequential(oldSC, cause));
  }
  /**
   * Processes a new incoming interrupt signal.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  processNewInterruptSignal(cause) {
    this.addInterruptedCause(cause);
    this.sendInterruptSignalToAllChildren();
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0) {
      return false;
    }
    let told = false;
    for (const child of this._children) {
      child.tell(FiberMessage.interruptSignal(internalCause.interrupt(this.id())));
      told = true;
    }
    return told;
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const it = this._children.values();
      this._children = null;
      let isDone = false;
      const body = () => {
        const next = it.next();
        if (!next.done) {
          return core.asUnit(next.value.await());
        } else {
          return core.sync(() => {
            isDone = true;
          });
        }
      };
      return core.whileLoop({
        while: () => !isDone,
        body,
        step: () => {
          //
        }
      });
    }
    return null;
  }
  reportExitValue(exit) {
    if (_runtimeFlags.runtimeMetrics(this._runtimeFlags)) {
      const tags = this.getFiberRef(core.currentMetricLabels);
      fiberActive.unsafeUpdate(-1, tags);
      switch (exit._tag) {
        case OpCodes.OP_SUCCESS:
          {
            fiberSuccesses.unsafeUpdate(1, tags);
            break;
          }
        case OpCodes.OP_FAILURE:
          {
            fiberFailures.unsafeUpdate(1, tags);
            break;
          }
      }
    }
    if (exit._tag === "Failure") {
      const level = this.getFiberRef(core.currentUnhandledErrorLogLevel);
      if (!internalCause.isInterruptedOnly(exit.cause) && level._tag === "Some") {
        this.log("Fiber terminated with a non handled error", exit.cause, level);
      }
    }
  }
  setExitValue(exit) {
    this._exitValue = exit;
    if (_runtimeFlags.runtimeMetrics(this._runtimeFlags)) {
      const tags = this.getFiberRef(core.currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = new Date().getTime();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
    }
    this.reportExitValue(exit);
    for (let i = this._observers.length - 1; i >= 0; i--) {
      this._observers[i](exit);
    }
  }
  getLoggers() {
    return this.getFiberRef(currentLoggers);
  }
  log(message, cause, overrideLogLevel) {
    const logLevel = Option.isSome(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(core.currentLogLevel);
    const minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
    if (LogLevel.greaterThan(minimumLogLevel, logLevel)) {
      return;
    }
    const spans = this.getFiberRef(core.currentLogSpan);
    const annotations = this.getFiberRef(core.currentLogAnnotations);
    const loggers = this.getLoggers();
    const contextMap = this.getFiberRefs();
    if (HashSet.size(loggers) > 0) {
      const clockService = Context.get(this.getFiberRef(defaultServices.currentServices), clock.clockTag);
      const date = new Date(clockService.unsafeCurrentTimeMillis());
      for (const logger of loggers) {
        logger.log({
          fiberId: this.id(),
          logLevel,
          message,
          cause,
          context: contextMap,
          spans,
          annotations,
          date
        });
      }
    }
  }
  /**
   * Evaluates a single message on the current thread, while the fiber is
   * suspended. This method should only be called while evaluation of the
   * fiber's effect is suspended due to an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateMessageWhileSuspended(message) {
    switch (message._tag) {
      case FiberMessage.OP_YIELD_NOW:
        {
          return EvaluationSignalYieldNow;
        }
      case FiberMessage.OP_INTERRUPT_SIGNAL:
        {
          this.processNewInterruptSignal(message.cause);
          if (this._asyncInterruptor !== null) {
            this._asyncInterruptor(core.exitFailCause(message.cause));
            this._asyncInterruptor = null;
          }
          return EvaluationSignalContinue;
        }
      case FiberMessage.OP_RESUME:
        {
          this._asyncInterruptor = null;
          this._asyncBlockingOn = null;
          this.evaluateEffect(message.effect);
          return EvaluationSignalContinue;
        }
      case FiberMessage.OP_STATEFUL:
        {
          message.onFiber(this, this._exitValue !== null ? FiberStatus.done : FiberStatus.suspended(this._runtimeFlags, this._asyncBlockingOn));
          return EvaluationSignalContinue;
        }
      default:
        {
          return absurd(message);
        }
    }
  }
  /**
   * Evaluates an effect until completion, potentially asynchronously.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateEffect(effect0) {
    this._supervisor.onResume(this);
    try {
      let effect = _runtimeFlags.interruptible(this._runtimeFlags) && this.isInterrupted() ? core.exitFailCause(this.getInterruptedCause()) : effect0;
      while (effect !== null) {
        try {
          const eff = effect;
          const exit = this.runLoop(eff);
          this._runtimeFlags = pipe(this._runtimeFlags, _runtimeFlags.enable(_runtimeFlags.WindDown));
          const interruption = this.interruptAllChildren();
          if (interruption !== null) {
            effect = core.flatMap(interruption, () => exit);
          } else {
            if (this._queue.length === 0) {
              // No more messages to process, so we will allow the fiber to end life:
              this.setExitValue(exit);
            } else {
              // There are messages, possibly added by the final op executed by
              // the fiber. To be safe, we should execute those now before we
              // allow the fiber to end life:
              this.tell(FiberMessage.resume(exit));
            }
            effect = null;
          }
        } catch (e) {
          if (core.isEffect(e)) {
            if (e._op === OpCodes.OP_YIELD) {
              if (_runtimeFlags.cooperativeYielding(this._runtimeFlags)) {
                this.tell(FiberMessage.yieldNow());
                this.tell(FiberMessage.resume(core.exitUnit));
                effect = null;
              } else {
                effect = core.exitUnit;
              }
            } else if (e._op === OpCodes.OP_ASYNC) {
              // Terminate this evaluation, async resumption will continue evaluation:
              effect = null;
            }
          } else {
            throw e;
          }
        }
      }
    } finally {
      this._supervisor.onSuspend(this);
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on the current
   * thread. This can be called to "kick off" execution of a fiber after it has
   * been created, in hopes that the effect can be executed synchronously.
   *
   * This is not the normal way of starting a fiber, but it is useful when the
   * express goal of executing the fiber is to synchronously produce its exit.
   */
  start(effect) {
    if (!this._running) {
      this._running = true;
      const prev = globalThis[internalFiber.currentFiberURI];
      globalThis[internalFiber.currentFiberURI] = this;
      try {
        this.evaluateEffect(effect);
      } finally {
        this._running = false;
        globalThis[internalFiber.currentFiberURI] = prev;
        // Because we're special casing `start`, we have to be responsible
        // for spinning up the fiber if there were new messages added to
        // the queue between the completion of the effect and the transition
        // to the not running state.
        if (this._queue.length > 0) {
          this.drainQueueLaterOnExecutor();
        }
      }
    } else {
      this.tell(FiberMessage.resume(effect));
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background, and on the correct thread pool. This can be called to "kick
   * off" execution of a fiber after it has been created, in hopes that the
   * effect can be executed synchronously.
   */
  startFork(effect) {
    this.tell(FiberMessage.resume(effect));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(oldRuntimeFlags, patch) {
    const newRuntimeFlags = _runtimeFlags.patch(oldRuntimeFlags, patch);
    globalThis[internalFiber.currentFiberURI] = this;
    this._runtimeFlags = newRuntimeFlags;
    return newRuntimeFlags;
  }
  /**
   * Initiates an asynchronous operation, by building a callback that will
   * resume execution, and then feeding that callback to the registration
   * function, handling error cases and repeated resumptions appropriately.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  initiateAsync(runtimeFlags, asyncRegister) {
    let alreadyCalled = false;
    const callback = effect => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        this.tell(FiberMessage.resume(effect));
      }
    };
    if (_runtimeFlags.interruptible(runtimeFlags)) {
      this._asyncInterruptor = callback;
    }
    try {
      asyncRegister(callback);
    } catch (e) {
      callback(core.failCause(internalCause.die(e)));
    }
  }
  pushStack(cont) {
    this._stack.push(cont);
    if (cont._op === "OnStep") {
      this._steps.push(true);
    }
    if (cont._op === "RevertFlags") {
      this._steps.push(false);
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep" || item._op === "RevertFlags") {
        this._steps.pop();
      }
      return item;
    }
    return;
  }
  getNextSuccessCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OpCodes.OP_ON_FAILURE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  getNextFailCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OpCodes.OP_ON_SUCCESS && frame._op !== OpCodes.OP_WHILE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  [OpCodes.OP_TAG](op) {
    return core.map(core.fiberRefGet(core.currentContext), context => {
      try {
        return Context.unsafeGet(context, op);
      } catch (e) {
        console.log(e);
        throw e;
      }
    });
  }
  ["Left"](op) {
    return core.fail(op.left);
  }
  ["None"](_) {
    return core.fail(internalCause.NoSuchElementException());
  }
  ["Right"](op) {
    return core.exitSucceed(op.right);
  }
  ["Some"](op) {
    return core.exitSucceed(op.value);
  }
  [OpCodes.OP_SYNC](op) {
    const value = op.i0();
    const cont = this.getNextSuccessCont();
    if (cont !== undefined) {
      if (!(cont._op in contOpSuccess)) {
        // @ts-expect-error
        absurd(cont);
      }
      // @ts-expect-error
      return contOpSuccess[cont._op](this, cont, value);
    } else {
      throw core.exitSucceed(value);
    }
  }
  [OpCodes.OP_SUCCESS](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== undefined) {
      if (!(cont._op in contOpSuccess)) {
        // @ts-expect-error
        absurd(cont);
      }
      // @ts-expect-error
      return contOpSuccess[cont._op](this, cont, oldCur.i0);
    } else {
      throw oldCur;
    }
  }
  [OpCodes.OP_FAILURE](op) {
    const cause = op.i0;
    const cont = this.getNextFailCont();
    if (cont !== undefined) {
      switch (cont._op) {
        case OpCodes.OP_ON_FAILURE:
        case OpCodes.OP_ON_SUCCESS_AND_FAILURE:
          {
            if (!(_runtimeFlags.interruptible(this._runtimeFlags) && this.isInterrupted())) {
              return cont.i1(cause);
            } else {
              return core.exitFailCause(internalCause.stripFailures(cause));
            }
          }
        case "OnStep":
          {
            if (!(_runtimeFlags.interruptible(this._runtimeFlags) && this.isInterrupted())) {
              return cont.i1(core.exitFailCause(cause));
            } else {
              return core.exitFailCause(internalCause.stripFailures(cause));
            }
          }
        case OpCodes.OP_REVERT_FLAGS:
          {
            this.patchRuntimeFlags(this._runtimeFlags, cont.patch);
            if (_runtimeFlags.interruptible(this._runtimeFlags) && this.isInterrupted()) {
              return core.exitFailCause(internalCause.sequential(cause, this.getInterruptedCause()));
            } else {
              return core.exitFailCause(cause);
            }
          }
        default:
          {
            absurd(cont);
          }
      }
    } else {
      throw core.exitFailCause(cause);
    }
  }
  [OpCodes.OP_WITH_RUNTIME](op) {
    return op.i0(this, FiberStatus.running(this._runtimeFlags));
  }
  ["Blocked"](op) {
    if (this._steps[this._steps.length - 1]) {
      const nextOp = this.popStack();
      if (nextOp) {
        switch (nextOp._op) {
          case "OnStep":
            {
              return nextOp.i1(op);
            }
          case "OnSuccess":
            {
              return core.blocked(op.i0, core.flatMap(op.i1, nextOp.i1));
            }
          case "OnSuccessAndFailure":
            {
              return core.blocked(op.i0, core.matchCauseEffect(op.i1, {
                onFailure: nextOp.i1,
                onSuccess: nextOp.i2
              }));
            }
          case "OnFailure":
            {
              return core.blocked(op.i0, core.catchAllCause(op.i1, nextOp.i1));
            }
          case "While":
            {
              return core.blocked(op.i0, core.flatMap(op.i1, a => {
                nextOp.i2(a);
                if (nextOp.i0()) {
                  return core.whileLoop({
                    while: nextOp.i0,
                    body: nextOp.i1,
                    step: nextOp.i2
                  });
                }
                return core.unit;
              }));
            }
          case "RevertFlags":
            {
              this.pushStack(nextOp);
              break;
            }
        }
      }
    }
    return core.uninterruptibleMask(restore => core.flatMap(fork(core.runRequestBlock(op.i0)), () => restore(op.i1)));
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.i0);
  }
  [OpCodes.OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.i0;
    const oldRuntimeFlags = this._runtimeFlags;
    const newRuntimeFlags = _runtimeFlags.patch(oldRuntimeFlags, updateFlags);
    // One more chance to short circuit: if we're immediately going
    // to interrupt. Interruption will cause immediate reversion of
    // the flag, so as long as we "peek ahead", there's no need to
    // set them to begin with.
    if (_runtimeFlags.interruptible(newRuntimeFlags) && this.isInterrupted()) {
      return core.exitFailCause(this.getInterruptedCause());
    } else {
      // Impossible to short circuit, so record the changes
      this.patchRuntimeFlags(this._runtimeFlags, updateFlags);
      if (op.i1) {
        // Since we updated the flags, we need to revert them
        const revertFlags = _runtimeFlags.diff(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new core.RevertFlags(revertFlags, op));
        return op.i1(oldRuntimeFlags);
      } else {
        return core.exitUnit;
      }
    }
  }
  [OpCodes.OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OpCodes.OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OpCodes.OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.i0;
  }
  [OpCodes.OP_ASYNC](op) {
    this._asyncBlockingOn = op.i1;
    this.initiateAsync(this._runtimeFlags, op.i0);
    throw op;
  }
  [OpCodes.OP_YIELD](op) {
    this.isYielding = false;
    throw op;
  }
  [OpCodes.OP_WHILE](op) {
    const check = op.i0;
    const body = op.i1;
    if (check()) {
      this.pushStack(op);
      return body();
    } else {
      return core.exitUnit;
    }
  }
  [OpCodes.OP_COMMIT](op) {
    return op.commit();
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(effect0) {
    let cur = effect0;
    this.currentOpCount = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if ((this._runtimeFlags & OpSupervision) !== 0) {
        this._supervisor.onEffect(this, cur);
      }
      if (this._queue.length > 0) {
        cur = this.drainQueueWhileRunning(this._runtimeFlags, cur);
      }
      if (!this.isYielding) {
        this.currentOpCount += 1;
        const shouldYield = this._scheduler.shouldYield(this);
        if (shouldYield !== false) {
          this.isYielding = true;
          this.currentOpCount = 0;
          const oldCur = cur;
          cur = core.flatMap(core.yieldNow({
            priority: shouldYield
          }), () => oldCur);
        }
      }
      try {
        if (!("_op" in cur) || !(cur._op in this)) {
          console.log(cur);
          // @ts-expect-error
          absurd(cur);
        }
        // @ts-expect-error
        cur = this._tracer.context(() => {
          if (moduleVersion !== cur[EffectTypeId]._V) {
            return core.dieMessage(`Cannot execute an Effect versioned ${cur[EffectTypeId]._V} with a Runtime of version ${moduleVersion}`);
          }
          // @ts-expect-error
          return this[cur._op](cur);
        }, this);
      } catch (e) {
        if (core.isEffect(e)) {
          if (e._op === OpCodes.OP_YIELD || e._op === OpCodes.OP_ASYNC) {
            throw e;
          }
          if (e._op === OpCodes.OP_SUCCESS || e._op === OpCodes.OP_FAILURE) {
            return e;
          }
        } else {
          if (core.isEffectError(e)) {
            cur = core.exitFailCause(e.cause);
          } else if (internalCause.isInterruptedException(e)) {
            cur = core.exitFailCause(internalCause.sequential(internalCause.die(e), internalCause.interrupt(FiberId.none)));
          } else {
            cur = core.exitFailCause(internalCause.die(e));
          }
        }
      }
    }
  }
  run = () => {
    this.drainQueueOnCurrentThread();
  };
}
// circular with Logger
/** @internal */
export const currentMinimumLogLevel = /*#__PURE__*/globalValue("effect/FiberRef/currentMinimumLogLevel", () => core.fiberRefUnsafeMake(LogLevel.fromLiteral("Info")));
/** @internal */
export const getConsole = refs => {
  const defaultServicesValue = FiberRefs.getOrDefault(refs, defaultServices.currentServices);
  const cnsl = Context.get(defaultServicesValue, consoleTag);
  return cnsl.unsafe;
};
/** @internal */
export const defaultLogger = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/Logger/defaultLogger"), () => internalLogger.makeLogger(options => {
  const formatted = internalLogger.stringLogger.log(options);
  getConsole(options.context).log(formatted);
}));
/** @internal */
export const logFmtLogger = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/Logger/logFmtLogger"), () => internalLogger.makeLogger(options => {
  const formatted = internalLogger.logfmtLogger.log(options);
  getConsole(options.context).log(formatted);
}));
/** @internal */
export const tracerLogger = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/Logger/tracerLogger"), () => internalLogger.makeLogger(({
  annotations,
  cause,
  context,
  fiberId,
  logLevel,
  message
}) => {
  const span = Option.flatMap(fiberRefs.get(context, core.currentContext), Context.getOption(tracer.spanTag));
  const clockService = Option.map(fiberRefs.get(context, defaultServices.currentServices), _ => Context.get(_, clock.clockTag));
  if (span._tag === "None" || span.value._tag === "ExternalSpan" || clockService._tag === "None") {
    return;
  }
  const attributes = Object.fromEntries(HashMap.map(annotations, value => internalLogger.serializeUnknown(value)));
  attributes["effect.fiberId"] = FiberId.threadName(fiberId);
  attributes["effect.logLevel"] = logLevel.label;
  if (cause !== null && cause._tag !== "Empty") {
    attributes["effect.cause"] = internalCause.pretty(cause);
  }
  span.value.event(String(message), clockService.value.unsafeCurrentTimeNanos(), attributes);
}));
/** @internal */
export const currentLoggers = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/FiberRef/currentLoggers"), () => core.fiberRefUnsafeMakeHashSet(HashSet.make(defaultLogger, tracerLogger)));
// circular with Effect
/* @internal */
export const acquireRelease = /*#__PURE__*/dual(args => core.isEffect(args[0]), (acquire, release) => {
  return core.uninterruptible(core.tap(acquire, a => addFinalizer(exit => release(a, exit))));
});
/* @internal */
export const acquireReleaseInterruptible = /*#__PURE__*/dual(args => core.isEffect(args[0]), (acquire, release) => {
  return ensuring(acquire, addFinalizer(exit => release(exit)));
});
/* @internal */
export const addFinalizer = finalizer => core.withFiberRuntime(runtime => {
  const acquireRefs = runtime.getFiberRefs();
  const acquireFlags = runtime._runtimeFlags;
  return core.flatMap(scope, scope => core.scopeAddFinalizerExit(scope, exit => core.withFiberRuntime(runtimeFinalizer => {
    const preRefs = runtimeFinalizer.getFiberRefs();
    const preFlags = runtimeFinalizer._runtimeFlags;
    const patchRefs = FiberRefsPatch.diff(preRefs, acquireRefs);
    const patchFlags = _runtimeFlags.diff(preFlags, acquireFlags);
    const inverseRefs = FiberRefsPatch.diff(acquireRefs, preRefs);
    runtimeFinalizer.setFiberRefs(FiberRefsPatch.patch(patchRefs, runtimeFinalizer.id(), acquireRefs));
    return ensuring(core.withRuntimeFlags(finalizer(exit), patchFlags), core.sync(() => {
      runtimeFinalizer.setFiberRefs(FiberRefsPatch.patch(inverseRefs, runtimeFinalizer.id(), runtimeFinalizer.getFiberRefs()));
    }));
  })));
});
/* @internal */
export const daemonChildren = self => {
  const forkScope = core.fiberRefLocally(core.currentForkScopeOverride, Option.some(fiberScope.globalScope));
  return forkScope(self);
};
/** @internal */
const _existsParFound = /*#__PURE__*/Symbol.for("effect/Effect/existsPar/found");
/* @internal */
export const exists = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (elements, f, options) => concurrency.matchSimple(options, () => core.suspend(() => existsLoop(elements[Symbol.iterator](), 0, f)), () => core.matchEffect(forEachOptions(elements, (a, i) => core.if_(f(a, i), {
  onTrue: core.fail(_existsParFound),
  onFalse: core.unit
}), options), {
  onFailure: e => e === _existsParFound ? core.succeed(true) : core.fail(e),
  onSuccess: () => core.succeed(false)
})));
const existsLoop = (iterator, index, f) => {
  const next = iterator.next();
  if (next.done) {
    return core.succeed(false);
  }
  return pipe(core.flatMap(f(next.value, index), b => b ? core.succeed(b) : existsLoop(iterator, index + 1, f)));
};
/* @internal */
export const filter = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (elements, f, options) => {
  const predicate = options?.negate ? (a, i) => core.map(f(a, i), Boolean.not) : f;
  return concurrency.matchSimple(options, () => core.suspend(() => RA.fromIterable(elements).reduceRight((effect, a, i) => core.zipWith(effect, core.suspend(() => predicate(a, i)), (list, b) => b ? [a, ...list] : list), core.sync(() => new Array()))), () => core.map(forEachOptions(elements, (a, i) => core.map(predicate(a, i), b => b ? Option.some(a) : Option.none()), options), RA.compact));
});
// === all
const allResolveInput = input => {
  if (Array.isArray(input) || Predicate.isIterable(input)) {
    return [input, Option.none()];
  }
  const keys = Object.keys(input);
  const size = keys.length;
  return [keys.map(k => input[k]), Option.some(values => {
    const res = {};
    for (let i = 0; i < size; i++) {
      ;
      res[keys[i]] = values[i];
    }
    return res;
  })];
};
const allValidate = (effects, reconcile, options) => {
  const eitherEffects = [];
  for (const effect of effects) {
    eitherEffects.push(core.either(effect));
  }
  return core.flatMap(forEachOptions(eitherEffects, identity, {
    concurrency: options?.concurrency,
    batching: options?.batching
  }), eithers => {
    const none = Option.none();
    const size = eithers.length;
    const errors = new Array(size);
    const successes = new Array(size);
    let errored = false;
    for (let i = 0; i < size; i++) {
      const either = eithers[i];
      if (either._tag === "Left") {
        errors[i] = Option.some(either.left);
        errored = true;
      } else {
        successes[i] = either.right;
        errors[i] = none;
      }
    }
    if (errored) {
      return reconcile._tag === "Some" ? core.fail(reconcile.value(errors)) : core.fail(errors);
    } else if (options?.discard) {
      return core.unit;
    }
    return reconcile._tag === "Some" ? core.succeed(reconcile.value(successes)) : core.succeed(successes);
  });
};
const allEither = (effects, reconcile, options) => {
  const eitherEffects = [];
  for (const effect of effects) {
    eitherEffects.push(core.either(effect));
  }
  if (options?.discard) {
    return forEachOptions(eitherEffects, identity, {
      concurrency: options?.concurrency,
      batching: options?.batching,
      discard: true
    });
  }
  return core.map(forEachOptions(eitherEffects, identity, {
    concurrency: options?.concurrency,
    batching: options?.batching
  }), eithers => reconcile._tag === "Some" ? reconcile.value(eithers) : eithers);
};
/* @internal */
export const all = (arg, options) => {
  const [effects, reconcile] = allResolveInput(arg);
  if (options?.mode === "validate") {
    return allValidate(effects, reconcile, options);
  } else if (options?.mode === "either") {
    return allEither(effects, reconcile, options);
  }
  return reconcile._tag === "Some" ? core.map(forEachOptions(effects, identity, options), reconcile.value) : forEachOptions(effects, identity, options);
};
/* @internal */
export const allWith = options => arg => all(arg, options);
/* @internal */
export const allSuccesses = (elements, options) => core.map(all(RA.fromIterable(elements).map(core.exit), options), RA.filterMap(exit => core.exitIsSuccess(exit) ? Option.some(exit.i0) : Option.none()));
/* @internal */
export const replicate = /*#__PURE__*/dual(2, (self, n) => Array.from({
  length: n
}, () => self));
/* @internal */
export const replicateEffect = /*#__PURE__*/dual(args => core.isEffect(args[0]), (self, n, options) => all(replicate(self, n), options));
// @ts-expect-error
export const forEachOptions = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (self, f, options) => core.withFiberRuntime(r => {
  const requestBatchingEnabled = options?.batching === true || options?.batching === "inherit" && r.getFiberRef(core.currentRequestBatching);
  if (options?.discard) {
    return concurrency.match(options, () => finalizersMask(ExecutionStrategy.sequential)(restore => requestBatchingEnabled ? forEachBatchedDiscard(self, (a, i) => restore(f(a, i))) : core.forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))), () => finalizersMask(ExecutionStrategy.parallel)(restore => forEachParUnboundedDiscard(self, (a, i) => restore(f(a, i)), requestBatchingEnabled)), n => finalizersMask(ExecutionStrategy.parallelN(n))(restore => forEachParNDiscard(self, n, (a, i) => restore(f(a, i)), requestBatchingEnabled)));
  }
  return concurrency.match(options, () => finalizersMask(ExecutionStrategy.sequential)(restore => requestBatchingEnabled ? forEachParN(self, 1, (a, i) => restore(f(a, i)), true) : core.forEachSequential(self, (a, i) => restore(f(a, i)))), () => finalizersMask(ExecutionStrategy.parallel)(restore => forEachParUnbounded(self, (a, i) => restore(f(a, i)), requestBatchingEnabled)), n => finalizersMask(ExecutionStrategy.parallelN(n))(restore => forEachParN(self, n, (a, i) => restore(f(a, i)), requestBatchingEnabled)));
}));
/* @internal */
export const forEachParUnbounded = (self, f, batching) => core.suspend(() => {
  const as = RA.fromIterable(self);
  const array = new Array(as.length);
  const fn = (a, i) => core.flatMap(f(a, i), b => core.sync(() => array[i] = b));
  return core.zipRight(forEachParUnboundedDiscard(as, fn, batching), core.succeed(array));
});
const forEachBatchedDiscard = (self, f) => core.suspend(() => {
  const as = RA.fromIterable(self);
  const size = as.length;
  if (size === 0) {
    return core.unit;
  } else if (size === 1) {
    return core.asUnit(f(as[0], 0));
  }
  const effects = as.map(f);
  const blocked = new Array();
  const loop = i => i === effects.length ? core.suspend(() => {
    if (blocked.length > 0) {
      const requests = blocked.map(b => b.i0).reduce(_RequestBlock.par);
      return core.blocked(requests, forEachBatchedDiscard(blocked.map(b => b.i1), identity));
    }
    return core.unit;
  }) : core.flatMapStep(effects[i], s => {
    if (s._op === "Blocked") {
      blocked.push(s);
      return loop(i + 1);
    } else if (s._op === "Failure") {
      return core.suspend(() => {
        if (blocked.length > 0) {
          const requests = blocked.map(b => b.i0).reduce(_RequestBlock.par);
          return core.blocked(requests, core.flatMap(forEachBatchedDiscard(blocked.map(b => b.i1), identity), () => s));
        }
        return core.unit;
      });
    } else {
      return loop(i + 1);
    }
  });
  return loop(0);
});
/* @internal */
export const forEachParUnboundedDiscard = (self, f, batching) => core.suspend(() => {
  const as = RA.fromIterable(self);
  const size = as.length;
  if (size === 0) {
    return core.unit;
  } else if (size === 1) {
    return core.asUnit(f(as[0], 0));
  }
  return core.uninterruptibleMask(restore => {
    const deferred = core.deferredUnsafeMake(FiberId.none);
    let ref = 0;
    const residual = [];
    const joinOrder = [];
    const process = core.transplant(graft => core.forEachSequential(as, (a, i) => pipe(graft(pipe(core.suspend(() => restore((batching ? core.step : core.exit)(f(a, i)))), core.flatMap(exit => {
      switch (exit._op) {
        case "Failure":
          {
            if (residual.length > 0) {
              const requests = residual.map(blocked => blocked.i0).reduce(_RequestBlock.par);
              const _continue = forEachParUnboundedDiscard(residual, blocked => blocked.i1, batching);
              return core.blocked(requests, core.matchCauseEffect(_continue, {
                onFailure: cause => core.zipRight(core.deferredFail(deferred, void 0), core.failCause(internalCause.parallel(cause, exit.cause))),
                onSuccess: () => core.zipRight(core.deferredFail(deferred, void 0), core.failCause(exit.cause))
              }));
            }
            return core.zipRight(core.deferredFail(deferred, void 0), core.failCause(exit.cause));
          }
        default:
          {
            if (exit._op === "Blocked") {
              residual.push(exit);
            }
            if (ref + 1 === size) {
              if (residual.length > 0) {
                const requests = residual.map(blocked => blocked.i0).reduce(_RequestBlock.par);
                const _continue = forEachParUnboundedDiscard(residual, blocked => blocked.i1, batching);
                return core.deferredSucceed(deferred, core.blocked(requests, _continue));
              } else {
                core.deferredUnsafeDone(deferred, core.exitSucceed(core.exitUnit));
              }
            } else {
              ref = ref + 1;
            }
            return core.unit;
          }
      }
    }))), forkDaemon, core.map(fiber => {
      fiber.addObserver(() => {
        joinOrder.push(fiber);
      });
      return fiber;
    }))));
    return core.flatMap(process, fibers => core.matchCauseEffect(restore(core.deferredAwait(deferred)), {
      onFailure: cause => core.flatMap(forEachParUnbounded(fibers, core.interruptFiber, batching), exits => {
        const exit = core.exitCollectAll(exits, {
          parallel: true
        });
        if (exit._tag === "Some" && core.exitIsFailure(exit.value)) {
          return core.failCause(internalCause.parallel(internalCause.stripFailures(cause), exit.value.i0));
        } else {
          return core.failCause(internalCause.stripFailures(cause));
        }
      }),
      onSuccess: rest => core.flatMap(rest, () => core.forEachSequentialDiscard(joinOrder, f => f.inheritAll()))
    }));
  });
});
/* @internal */
export const forEachParN = (self, n, f, batching) => core.suspend(() => {
  const as = RA.fromIterable(self);
  const array = new Array(as.length);
  const fn = (a, i) => core.map(f(a, i), b => array[i] = b);
  return core.zipRight(forEachParNDiscard(as, n, fn, batching), core.succeed(array));
});
/* @internal */
export const forEachParNDiscard = (self, n, f, batching) => core.suspend(() => {
  let i = 0;
  const iterator = self[Symbol.iterator]();
  const residual = [];
  const worker = core.flatMap(core.sync(() => iterator.next()), next => next.done ? core.unit : core.flatMap((batching ? core.step : core.exit)(core.asUnit(f(next.value, i++))), res => {
    switch (res._op) {
      case "Blocked":
        {
          residual.push(res);
          return worker;
        }
      case "Failure":
        {
          return res;
        }
      case "Success":
        return worker;
    }
  }));
  const effects = [];
  for (let i = 0; i < n; i++) {
    effects.push(worker);
  }
  return core.flatMap(core.exit(forEachParUnboundedDiscard(effects, identity, batching)), exit => {
    if (residual.length === 0) {
      return exit;
    }
    const requests = residual.map(blocked => blocked.i0).reduce(_RequestBlock.par);
    const _continue = forEachParNDiscard(residual, n, blocked => blocked.i1, batching);
    if (exit._tag === "Failure") {
      return core.blocked(requests, core.matchCauseEffect(_continue, {
        onFailure: cause => core.exitFailCause(internalCause.parallel(exit.cause, cause)),
        onSuccess: () => exit
      }));
    }
    return core.blocked(requests, _continue);
  });
});
/* @internal */
export const fork = self => core.withFiberRuntime((state, status) => core.succeed(unsafeFork(self, state, status.runtimeFlags)));
/* @internal */
export const forkDaemon = self => forkWithScopeOverride(self, fiberScope.globalScope);
/* @internal */
export const forkWithErrorHandler = /*#__PURE__*/dual(2, (self, handler) => fork(core.onError(self, cause => {
  const either = internalCause.failureOrCause(cause);
  switch (either._tag) {
    case "Left":
      {
        return handler(either.left);
      }
    case "Right":
      {
        return core.failCause(either.right);
      }
  }
})));
/** @internal */
export const unsafeFork = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  childFiber.resume(effect);
  return childFiber;
};
/** @internal */
export const unsafeMakeChildFiber = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childId = FiberId.unsafeMake();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = fiberRefs.forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
  const childContext = fiberRefs.getOrDefault(childFiberRefs, core.currentContext);
  const supervisor = childFiber._supervisor;
  supervisor.onStart(childContext, effect, Option.some(parentFiber), childFiber);
  childFiber.addObserver(exit => supervisor.onEnd(exit, childFiber));
  const parentScope = overrideScope !== null ? overrideScope : pipe(parentFiber.getFiberRef(core.currentForkScopeOverride), Option.getOrElse(() => parentFiber.scope()));
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
};
/* @internal */
const forkWithScopeOverride = (self, scopeOverride) => core.withFiberRuntime((parentFiber, parentStatus) => core.succeed(unsafeFork(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)));
/* @internal */
export const mergeAll = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (elements, zero, f, options) => concurrency.matchSimple(options, () => RA.fromIterable(elements).reduce((acc, a, i) => core.zipWith(acc, a, (acc, a) => f(acc, a, i)), core.succeed(zero)), () => core.flatMap(Ref.make(zero), acc => core.flatMap(forEachOptions(elements, (effect, i) => core.flatMap(effect, a => Ref.update(acc, b => f(b, a, i))), options), () => Ref.get(acc)))));
/* @internal */
export const partition = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (elements, f, options) => pipe(forEachOptions(elements, (a, i) => core.either(f(a, i)), options), core.map(chunk => core.partitionMap(chunk, identity))));
/* @internal */
export const validateAll = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (elements, f, options) => core.flatMap(partition(elements, f, {
  concurrency: options?.concurrency,
  batching: options?.batching
}), ([es, bs]) => es.length === 0 ? options?.discard ? core.unit : core.succeed(bs) : core.fail(es)));
/* @internal */
export const raceAll = all => {
  const list = Chunk.fromIterable(all);
  if (!Chunk.isNonEmpty(list)) {
    return core.dieSync(() => internalCause.IllegalArgumentException(`Received an empty collection of effects`));
  }
  const self = Chunk.headNonEmpty(list);
  const effects = Chunk.tailNonEmpty(list);
  const inheritAll = res => pipe(internalFiber.inheritAll(res[1]), core.as(res[0]));
  return pipe(core.deferredMake(), core.flatMap(done => pipe(Ref.make(effects.length), core.flatMap(fails => core.uninterruptibleMask(restore => pipe(fork(core.interruptible(self)), core.flatMap(head => pipe(effects, core.forEachSequential(effect => fork(core.interruptible(effect))), core.map(Chunk.unsafeFromArray), core.map(tail => pipe(tail, Chunk.prepend(head))), core.tap(fibers => pipe(fibers, RA.reduce(core.unit, (effect, fiber) => pipe(effect, core.zipRight(pipe(internalFiber._await(fiber), core.flatMap(raceAllArbiter(fibers, fiber, done, fails)), fork, core.asUnit)))))), core.flatMap(fibers => pipe(restore(pipe(Deferred.await(done), core.flatMap(inheritAll))), core.onInterrupt(() => pipe(fibers, RA.reduce(core.unit, (effect, fiber) => pipe(effect, core.zipLeft(core.interruptFiber(fiber))))))))))))))));
};
/* @internal */
const raceAllArbiter = (fibers, winner, deferred, fails) => exit => core.exitMatchEffect(exit, {
  onFailure: cause => pipe(Ref.modify(fails, fails => [fails === 0 ? pipe(core.deferredFailCause(deferred, cause), core.asUnit) : core.unit, fails - 1]), core.flatten),
  onSuccess: value => pipe(core.deferredSucceed(deferred, [value, winner]), core.flatMap(set => set ? pipe(Chunk.fromIterable(fibers), RA.reduce(core.unit, (effect, fiber) => fiber === winner ? effect : pipe(effect, core.zipLeft(core.interruptFiber(fiber))))) : core.unit))
});
/* @internal */
export const reduceEffect = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (elements, zero, f, options) => concurrency.matchSimple(options, () => RA.fromIterable(elements).reduce((acc, a, i) => core.zipWith(acc, a, (acc, a) => f(acc, a, i)), zero), () => core.suspend(() => pipe(mergeAll([zero, ...elements], Option.none(), (acc, elem, i) => {
  switch (acc._tag) {
    case "None":
      {
        return Option.some(elem);
      }
    case "Some":
      {
        return Option.some(f(acc.value, elem, i));
      }
  }
}, options), core.map(option => {
  switch (option._tag) {
    case "None":
      {
        throw new Error("BUG: Effect.reduceEffect - please report an issue at https://github.com/Effect-TS/io/issues");
      }
    case "Some":
      {
        return option.value;
      }
  }
})))));
/* @internal */
export const parallelFinalizers = self => core.contextWithEffect(context => Option.match(Context.getOption(context, scopeTag), {
  onNone: () => self,
  onSome: scope => {
    switch (scope.strategy._tag) {
      case "Parallel":
        return self;
      case "Sequential":
      case "ParallelN":
        return core.flatMap(core.scopeFork(scope, ExecutionStrategy.parallel), inner => scopeExtend(self, inner));
    }
  }
}));
/* @internal */
export const parallelNFinalizers = parallelism => self => core.contextWithEffect(context => Option.match(Context.getOption(context, scopeTag), {
  onNone: () => self,
  onSome: scope => {
    if (scope.strategy._tag === "ParallelN" && scope.strategy.parallelism === parallelism) {
      return self;
    }
    return core.flatMap(core.scopeFork(scope, ExecutionStrategy.parallelN(parallelism)), inner => scopeExtend(self, inner));
  }
}));
/* @internal */
export const finalizersMask = strategy => self => core.contextWithEffect(context => Option.match(Context.getOption(context, scopeTag), {
  onNone: () => self(identity),
  onSome: scope => {
    const patch = strategy._tag === "Parallel" ? parallelFinalizers : strategy._tag === "Sequential" ? sequentialFinalizers : parallelNFinalizers(strategy.parallelism);
    switch (scope.strategy._tag) {
      case "Parallel":
        return patch(self(parallelFinalizers));
      case "Sequential":
        return patch(self(sequentialFinalizers));
      case "ParallelN":
        return patch(self(parallelNFinalizers(scope.strategy.parallelism)));
    }
  }
}));
/* @internal */
export const scopeWith = f => core.flatMap(scopeTag, f);
/* @internal */
export const scopedEffect = effect => core.flatMap(scopeMake(), scope => scopeUse(scope)(effect));
/* @internal */
export const sequentialFinalizers = self => core.contextWithEffect(context => Option.match(Context.getOption(context, scopeTag), {
  onNone: () => self,
  onSome: scope => {
    switch (scope.strategy._tag) {
      case "Sequential":
        return self;
      case "Parallel":
      case "ParallelN":
        return core.flatMap(core.scopeFork(scope, ExecutionStrategy.sequential), inner => scopeExtend(self, inner));
    }
  }
}));
/* @internal */
export const tagMetricsScoped = (key, value) => labelMetricsScoped([metricLabel.make(key, value)]);
/* @internal */
export const labelMetricsScoped = labels => labelMetricsScopedSet(HashSet.fromIterable(labels));
/* @internal */
export const labelMetricsScopedSet = labels => fiberRefLocallyScopedWith(core.currentMetricLabels, set => pipe(set, HashSet.union(labels)));
/* @internal */
export const using = /*#__PURE__*/dual(2, (self, use) => core.acquireUseRelease(scopeMake(), scope => core.flatMap(scopeExtend(self, scope), use), (scope, exit) => core.scopeClose(scope, exit)));
/** @internal */
export const validate = /*#__PURE__*/dual(args => core.isEffect(args[1]), (self, that, options) => validateWith(self, that, (a, b) => [a, b], options));
/** @internal */
export const validateWith = /*#__PURE__*/dual(args => core.isEffect(args[1]), (self, that, f, options) => core.flatten(zipWithOptions(core.exit(self), core.exit(that), (ea, eb) => core.exitZipWith(ea, eb, {
  onSuccess: f,
  onFailure: (ca, cb) => options?.concurrent ? internalCause.parallel(ca, cb) : internalCause.sequential(ca, cb)
}), options)));
/* @internal */
export const validateAllPar = /*#__PURE__*/dual(2, (elements, f) => core.flatMap(partition(elements, f), ([es, bs]) => es.length === 0 ? core.succeed(bs) : core.fail(es)));
/* @internal */
export const validateAllParDiscard = /*#__PURE__*/dual(2, (elements, f) => core.flatMap(partition(elements, f), ([es, _]) => es.length === 0 ? core.unit : core.fail(es)));
/* @internal */
export const validateFirst = /*#__PURE__*/dual(args => Predicate.isIterable(args[0]), (elements, f, options) => core.flip(forEachOptions(elements, (a, i) => core.flip(f(a, i)), options)));
/* @internal */
export const withClockScoped = value => fiberRefLocallyScopedWith(defaultServices.currentServices, Context.add(clock.clockTag, value));
/* @internal */
export const withConfigProviderScoped = value => fiberRefLocallyScopedWith(defaultServices.currentServices, Context.add(configProviderTag, value));
/* @internal */
export const withEarlyRelease = self => scopeWith(parent => core.flatMap(core.scopeFork(parent, executionStrategy.sequential), child => pipe(self, scopeExtend(child), core.map(value => [core.fiberIdWith(fiberId => core.scopeClose(child, core.exitInterrupt(fiberId))), value]))));
/** @internal */
export const zipOptions = /*#__PURE__*/dual(args => core.isEffect(args[1]), (self, that, options) => zipWithOptions(self, that, (a, b) => [a, b], options));
/** @internal */
export const zipLeftOptions = /*#__PURE__*/dual(args => core.isEffect(args[1]), (self, that, options) => zipWithOptions(self, that, (a, _) => a, options));
/** @internal */
export const zipRightOptions = /*#__PURE__*/dual(args => core.isEffect(args[1]), (self, that, options) => zipWithOptions(self, that, (_, b) => b, options));
/** @internal */
export const zipWithOptions = /*#__PURE__*/dual(args => core.isEffect(args[1]), (self, that, f, options) => core.map(all([self, that], {
  concurrency: options?.concurrent ? 2 : 1,
  batching: options?.batching
}), ([a, a2]) => f(a, a2)));
/* @internal */
export const withRuntimeFlagsScoped = update => {
  if (update === RuntimeFlagsPatch.empty) {
    return core.unit;
  }
  return pipe(core.runtimeFlags, core.flatMap(runtimeFlags => {
    const updatedRuntimeFlags = _runtimeFlags.patch(runtimeFlags, update);
    const revertRuntimeFlags = _runtimeFlags.diff(updatedRuntimeFlags, runtimeFlags);
    return pipe(core.updateRuntimeFlags(update), core.zipRight(addFinalizer(() => core.updateRuntimeFlags(revertRuntimeFlags))), core.asUnit);
  }), core.uninterruptible);
};
// circular with ReleaseMap
/* @internal */
export const releaseMapReleaseAll = (strategy, exit) => self => core.suspend(() => {
  switch (self.state._tag) {
    case "Exited":
      {
        return core.unit;
      }
    case "Running":
      {
        const finalizersMap = self.state.finalizers;
        const update = self.state.update;
        const finalizers = Array.from(finalizersMap.keys()).sort((a, b) => b - a).map(key => finalizersMap.get(key));
        self.state = {
          _tag: "Exited",
          nextKey: self.state.nextKey,
          exit,
          update
        };
        return executionStrategy.isSequential(strategy) ? pipe(finalizers, core.forEachSequential(fin => core.exit(update(fin)(exit))), core.flatMap(results => pipe(core.exitCollectAll(results), Option.map(core.exitAsUnit), Option.getOrElse(() => core.exitUnit)))) : executionStrategy.isParallel(strategy) ? pipe(forEachParUnbounded(finalizers, fin => core.exit(update(fin)(exit)), false), core.flatMap(results => pipe(core.exitCollectAll(results, {
          parallel: true
        }), Option.map(core.exitAsUnit), Option.getOrElse(() => core.exitUnit)))) : pipe(forEachParN(finalizers, strategy.parallelism, fin => core.exit(update(fin)(exit)), false), core.flatMap(results => pipe(core.exitCollectAll(results, {
          parallel: true
        }), Option.map(core.exitAsUnit), Option.getOrElse(() => core.exitUnit))));
      }
  }
});
// circular with Scope
/** @internal */
export const scopeTag = /*#__PURE__*/Context.Tag(core.ScopeTypeId);
/* @internal */
export const scope = scopeTag;
/* @internal */
export const scopeMake = (strategy = executionStrategy.sequential) => core.map(core.releaseMapMake, rm => ({
  [core.ScopeTypeId]: core.ScopeTypeId,
  [core.CloseableScopeTypeId]: core.CloseableScopeTypeId,
  strategy,
  pipe() {
    return pipeArguments(this, arguments);
  },
  fork: strategy => core.uninterruptible(pipe(scopeMake(strategy), core.flatMap(scope => pipe(core.releaseMapAdd(rm, exit => core.scopeClose(scope, exit)), core.tap(fin => core.scopeAddFinalizerExit(scope, fin)), core.as(scope))))),
  close: exit => core.asUnit(releaseMapReleaseAll(strategy, exit)(rm)),
  addFinalizer: fin => core.asUnit(core.releaseMapAdd(fin)(rm))
}));
/* @internal */
export const scopeExtend = /*#__PURE__*/dual(2, (effect, scope) => core.mapInputContext(effect,
// @ts-expect-error
Context.merge(Context.make(scopeTag, scope))));
/* @internal */
export const scopeUse = /*#__PURE__*/dual(2, (effect, scope) => pipe(effect, scopeExtend(scope), core.onExit(exit => scope.close(exit))));
// circular with Supervisor
/** @internal */
export const fiberRefUnsafeMakeSupervisor = initial => core.fiberRefUnsafeMakePatch(initial, {
  differ: SupervisorPatch.differ,
  fork: SupervisorPatch.empty
});
// circular with FiberRef
/* @internal */
export const fiberRefLocallyScoped = /*#__PURE__*/dual(2, (self, value) => core.asUnit(acquireRelease(core.flatMap(core.fiberRefGet(self), oldValue => core.as(core.fiberRefSet(self, value), oldValue)), oldValue => core.fiberRefSet(self, oldValue))));
/* @internal */
export const fiberRefLocallyScopedWith = /*#__PURE__*/dual(2, (self, f) => core.fiberRefGetWith(self, a => fiberRefLocallyScoped(self, f(a))));
/* @internal */
export const fiberRefMake = (initial, options) => fiberRefMakeWith(() => core.fiberRefUnsafeMake(initial, options));
/* @internal */
export const fiberRefMakeWith = ref => acquireRelease(core.tap(core.sync(ref), ref => core.fiberRefUpdate(ref, identity)), fiberRef => core.fiberRefDelete(fiberRef));
/* @internal */
export const fiberRefMakeContext = initial => fiberRefMakeWith(() => core.fiberRefUnsafeMakeContext(initial));
/* @internal */
export const fiberRefMakeRuntimeFlags = initial => fiberRefMakeWith(() => core.fiberRefUnsafeMakeRuntimeFlags(initial));
/** @internal */
export const currentRuntimeFlags = /*#__PURE__*/core.fiberRefUnsafeMakeRuntimeFlags(_runtimeFlags.none);
/** @internal */
export const currentSupervisor = /*#__PURE__*/fiberRefUnsafeMakeSupervisor(supervisor.none);
// circular with Fiber
/* @internal */
export const fiberAwaitAll = fibers => core.asUnit(internalFiber._await(fiberAll(fibers)));
/** @internal */
export const fiberAll = fibers => ({
  [internalFiber.FiberTypeId]: internalFiber.fiberVariance,
  id: () => RA.fromIterable(fibers).reduce((id, fiber) => FiberId.combine(id, fiber.id()), FiberId.none),
  await: () => core.exit(forEachParUnbounded(fibers, fiber => core.flatten(fiber.await()), false)),
  children: () => core.map(forEachParUnbounded(fibers, fiber => fiber.children(), false), RA.flatten),
  inheritAll: () => core.forEachSequentialDiscard(fibers, fiber => fiber.inheritAll()),
  poll: () => core.map(core.forEachSequential(fibers, fiber => fiber.poll()), RA.reduceRight(Option.some(core.exitSucceed(new Array())), (optionB, optionA) => {
    switch (optionA._tag) {
      case "None":
        {
          return Option.none();
        }
      case "Some":
        {
          switch (optionB._tag) {
            case "None":
              {
                return Option.none();
              }
            case "Some":
              {
                return Option.some(core.exitZipWith(optionA.value, optionB.value, {
                  onSuccess: (a, chunk) => [a, ...chunk],
                  onFailure: internalCause.parallel
                }));
              }
          }
        }
    }
  })),
  interruptAsFork: fiberId => core.forEachSequentialDiscard(fibers, fiber => fiber.interruptAsFork(fiberId)),
  pipe() {
    return pipeArguments(this, arguments);
  }
});
/* @internal */
export const fiberInterruptFork = self => core.asUnit(forkDaemon(core.interruptFiber(self)));
/* @internal */
export const fiberJoinAll = fibers => core.asUnit(internalFiber.join(fiberAll(fibers)));
/* @internal */
export const fiberScoped = self => acquireRelease(core.succeed(self), core.interruptFiber);
//
// circular race
//
/** @internal */
export const raceWith = /*#__PURE__*/dual(3, (self, other, options) => raceFibersWith(self, other, {
  onSelfWin: (winner, loser) => core.flatMap(winner.await(), exit => {
    switch (exit._tag) {
      case OpCodes.OP_SUCCESS:
        {
          return core.flatMap(winner.inheritAll(), () => options.onSelfDone(exit, loser));
        }
      case OpCodes.OP_FAILURE:
        {
          return options.onSelfDone(exit, loser);
        }
    }
  }),
  onOtherWin: (winner, loser) => core.flatMap(winner.await(), exit => {
    switch (exit._tag) {
      case OpCodes.OP_SUCCESS:
        {
          return core.flatMap(winner.inheritAll(), () => options.onOtherDone(exit, loser));
        }
      case OpCodes.OP_FAILURE:
        {
          return options.onOtherDone(exit, loser);
        }
    }
  })
}));
/** @internal */
export const disconnect = self => core.uninterruptibleMask(restore => core.fiberIdWith(fiberId => core.flatMap(forkDaemon(restore(self)), fiber => pipe(restore(internalFiber.join(fiber)), core.onInterrupt(() => pipe(fiber, internalFiber.interruptAsFork(fiberId)))))));
/** @internal */
export const race = /*#__PURE__*/dual(2, (self, that) => core.fiberIdWith(parentFiberId => raceWith(self, that, {
  onSelfDone: (exit, right) => core.exitMatchEffect(exit, {
    onFailure: cause => pipe(internalFiber.join(right), internalEffect.mapErrorCause(cause2 => internalCause.parallel(cause, cause2))),
    onSuccess: value => pipe(right, core.interruptAsFiber(parentFiberId), core.as(value))
  }),
  onOtherDone: (exit, left) => core.exitMatchEffect(exit, {
    onFailure: cause => pipe(internalFiber.join(left), internalEffect.mapErrorCause(cause2 => internalCause.parallel(cause2, cause))),
    onSuccess: value => pipe(left, core.interruptAsFiber(parentFiberId), core.as(value))
  })
})));
/** @internal */
export const raceFibersWith = /*#__PURE__*/dual(3, (self, other, options) => core.withFiberRuntime((parentFiber, parentStatus) => {
  const parentRuntimeFlags = parentStatus.runtimeFlags;
  const raceIndicator = MRef.make(true);
  const leftFiber = unsafeMakeChildFiber(self, parentFiber, parentRuntimeFlags, options.selfScope);
  const rightFiber = unsafeMakeChildFiber(other, parentFiber, parentRuntimeFlags, options.otherScope);
  return core.async(cb => {
    leftFiber.addObserver(() => completeRace(leftFiber, rightFiber, options.onSelfWin, raceIndicator, cb));
    rightFiber.addObserver(() => completeRace(rightFiber, leftFiber, options.onOtherWin, raceIndicator, cb));
    leftFiber.startFork(self);
    rightFiber.startFork(other);
  }, FiberId.combine(leftFiber.id(), rightFiber.id()));
}));
const completeRace = (winner, loser, cont, ab, cb) => {
  if (MRef.compareAndSet(true, false)(ab)) {
    cb(cont(winner, loser));
  }
};
/** @internal */
export const ensuring = /*#__PURE__*/dual(2, (self, finalizer) => core.uninterruptibleMask(restore => core.matchCauseEffect(restore(self), {
  onFailure: cause1 => core.matchCauseEffect(finalizer, {
    onFailure: cause2 => core.failCause(internalCause.sequential(cause1, cause2)),
    onSuccess: () => core.failCause(cause1)
  }),
  onSuccess: a => core.as(finalizer, a)
})));
/** @internal */
export const invokeWithInterrupt = (dataSource, all) => core.fiberIdWith(id => core.flatMap(core.flatMap(forkDaemon(core.interruptible(dataSource)), processing => core.async(cb => {
  const counts = all.map(_ => _.listeners.count);
  const checkDone = () => {
    if (counts.every(count => count === 0)) {
      cleanup.forEach(f => f());
      cb(core.interruptFiber(processing));
    }
  };
  processing.addObserver(exit => {
    cleanup.forEach(f => f());
    cb(exit);
  });
  const cleanup = all.map((r, i) => {
    const observer = count => {
      counts[i] = count;
      checkDone();
    };
    r.listeners.addObserver(observer);
    return () => r.listeners.removeObserver(observer);
  });
  checkDone();
  return core.sync(() => {
    cleanup.forEach(f => f());
  });
})), () => core.suspend(() => {
  const residual = all.flatMap(entry => {
    if (!entry.state.completed) {
      return [entry];
    }
    return [];
  });
  return core.forEachSequentialDiscard(residual, entry => complete(entry.request, core.exitInterrupt(id)));
})));
/** @internal */
export const interruptWhenPossible = /*#__PURE__*/dual(2, (self, all) => core.fiberRefGetWith(currentRequestMap, map => core.suspend(() => {
  const entries = RA.fromIterable(all).flatMap(_ => map.has(_) ? [map.get(_)] : []);
  return invokeWithInterrupt(self, entries);
})));
// circular Tracer
/** @internal */
export const makeSpanScoped = (name, options) => acquireRelease(internalEffect.makeSpan(name, options), (span, exit) => core.flatMap(internalEffect.currentTimeNanosTracing, endTime => core.sync(() => span.end(endTime, exit))));
/* @internal */
export const withTracerScoped = value => fiberRefLocallyScopedWith(defaultServices.currentServices, Context.add(tracer.tracerTag, value));
/** @internal */
export const withSpanScoped = /*#__PURE__*/dual(args => typeof args[0] !== "string", (self, name, options) => core.flatMap(makeSpanScoped(name, options), span => internalEffect.provideService(self, tracer.spanTag, span)));
//# sourceMappingURL=fiberRuntime.js.map