"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = exports.using = exports.labelMetricsScopedSet = exports.labelMetricsScoped = exports.tagMetricsScoped = exports.sequentialFinalizers = exports.scopedEffect = exports.scopeWith = exports.finalizersMask = exports.parallelNFinalizers = exports.parallelFinalizers = exports.reduceEffect = exports.raceAll = exports.validateAll = exports.partition = exports.mergeAll = exports.unsafeMakeChildFiber = exports.unsafeFork = exports.forkWithErrorHandler = exports.forkDaemon = exports.fork = exports.forEachParNDiscard = exports.forEachParN = exports.forEachParUnboundedDiscard = exports.forEachParUnbounded = exports.forEachOptions = exports.replicateEffect = exports.replicate = exports.allSuccesses = exports.allWith = exports.all = exports.filter = exports.exists = exports.daemonChildren = exports.addFinalizer = exports.acquireReleaseInterruptible = exports.acquireRelease = exports.currentLoggers = exports.tracerLogger = exports.logFmtLogger = exports.defaultLogger = exports.getConsole = exports.currentMinimumLogLevel = exports.FiberRuntime = exports.runtimeFiberVariance = exports.fiberLifetimes = exports.fiberFailures = exports.fiberSuccesses = exports.fiberActive = exports.fiberStarted = void 0;
exports.withSpanScoped = exports.withTracerScoped = exports.makeSpanScoped = exports.interruptWhenPossible = exports.invokeWithInterrupt = exports.ensuring = exports.raceFibersWith = exports.race = exports.disconnect = exports.raceWith = exports.fiberScoped = exports.fiberJoinAll = exports.fiberInterruptFork = exports.fiberAll = exports.fiberAwaitAll = exports.currentSupervisor = exports.currentRuntimeFlags = exports.fiberRefMakeRuntimeFlags = exports.fiberRefMakeContext = exports.fiberRefMakeWith = exports.fiberRefMake = exports.fiberRefLocallyScopedWith = exports.fiberRefLocallyScoped = exports.fiberRefUnsafeMakeSupervisor = exports.scopeUse = exports.scopeExtend = exports.scopeMake = exports.scope = exports.scopeTag = exports.releaseMapReleaseAll = exports.withRuntimeFlagsScoped = exports.zipWithOptions = exports.zipRightOptions = exports.zipLeftOptions = exports.zipOptions = exports.withEarlyRelease = exports.withConfigProviderScoped = exports.withClockScoped = exports.validateFirst = exports.validateAllParDiscard = exports.validateAllPar = exports.validateWith = void 0;
const Boolean = /*#__PURE__*/require("../Boolean.js");
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Context = /*#__PURE__*/require("../Context.js");
const Deferred = /*#__PURE__*/require("../Deferred.js");
const Effectable_js_1 = /*#__PURE__*/require("../Effectable.js");
const ExecutionStrategy = /*#__PURE__*/require("../ExecutionStrategy.js");
const FiberId = /*#__PURE__*/require("../FiberId.js");
const FiberRefs = /*#__PURE__*/require("../FiberRefs.js");
const FiberRefsPatch = /*#__PURE__*/require("../FiberRefsPatch.js");
const FiberStatus = /*#__PURE__*/require("../FiberStatus.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const LogLevel = /*#__PURE__*/require("../LogLevel.js");
const MRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate = /*#__PURE__*/require("../Predicate.js");
const RA = /*#__PURE__*/require("../ReadonlyArray.js");
const Ref = /*#__PURE__*/require("../Ref.js");
const RuntimeFlagsPatch = /*#__PURE__*/require("../RuntimeFlagsPatch.js");
const Scheduler_js_1 = /*#__PURE__*/require("../Scheduler.js");
const _RequestBlock = /*#__PURE__*/require("./blockedRequests.js");
const internalCause = /*#__PURE__*/require("./cause.js");
const clock = /*#__PURE__*/require("./clock.js");
const completedRequestMap_js_1 = /*#__PURE__*/require("./completedRequestMap.js");
const concurrency = /*#__PURE__*/require("./concurrency.js");
const configProvider_js_1 = /*#__PURE__*/require("./configProvider.js");
const internalEffect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const defaultServices = /*#__PURE__*/require("./defaultServices.js");
const console_js_1 = /*#__PURE__*/require("./defaultServices/console.js");
const executionStrategy = /*#__PURE__*/require("./executionStrategy.js");
const internalFiber = /*#__PURE__*/require("./fiber.js");
const FiberMessage = /*#__PURE__*/require("./fiberMessage.js");
const fiberRefs = /*#__PURE__*/require("./fiberRefs.js");
const fiberScope = /*#__PURE__*/require("./fiberScope.js");
const internalLogger = /*#__PURE__*/require("./logger.js");
const metric = /*#__PURE__*/require("./metric.js");
const metricBoundaries = /*#__PURE__*/require("./metric/boundaries.js");
const metricLabel = /*#__PURE__*/require("./metric/label.js");
const OpCodes = /*#__PURE__*/require("./opCodes/effect.js");
const request_js_1 = /*#__PURE__*/require("./request.js");
const _runtimeFlags = /*#__PURE__*/require("./runtimeFlags.js");
const runtimeFlags_js_1 = /*#__PURE__*/require("./runtimeFlags.js");
const supervisor = /*#__PURE__*/require("./supervisor.js");
const SupervisorPatch = /*#__PURE__*/require("./supervisor/patch.js");
const tracer = /*#__PURE__*/require("./tracer.js");
const version_js_1 = /*#__PURE__*/require("./version.js");
/** @internal */
exports.fiberStarted = /*#__PURE__*/metric.counter("effect_fiber_started");
/** @internal */
exports.fiberActive = /*#__PURE__*/metric.counter("effect_fiber_active");
/** @internal */
exports.fiberSuccesses = /*#__PURE__*/metric.counter("effect_fiber_successes");
/** @internal */
exports.fiberFailures = /*#__PURE__*/metric.counter("effect_fiber_failures");
/** @internal */
exports.fiberLifetimes = /*#__PURE__*/metric.tagged( /*#__PURE__*/metric.histogram("effect_fiber_lifetimes", /*#__PURE__*/metricBoundaries.exponential({
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
exports.runtimeFiberVariance = {
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
const runBlockedRequests = self => core.forEachSequentialDiscard(_RequestBlock.flatten(self), requestsByRequestResolver => (0, exports.forEachParUnboundedDiscard)(_RequestBlock.sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential]) => {
  const map = new Map();
  for (const block of sequential) {
    for (const entry of block) {
      map.set(entry.request, entry);
    }
  }
  return core.fiberRefLocally((0, exports.invokeWithInterrupt)(dataSource.runAll(sequential), sequential.flat()), completedRequestMap_js_1.currentRequestMap, map);
}, false));
/** @internal */
class FiberRuntime {
  [internalFiber.FiberTypeId] = internalFiber.fiberVariance;
  [internalFiber.RuntimeFiberTypeId] = exports.runtimeFiberVariance;
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
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
    this._supervisor = this.getFiberRef(exports.currentSupervisor);
    this._scheduler = this.getFiberRef(Scheduler_js_1.currentScheduler);
    if (_runtimeFlags.runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(core.currentMetricLabels);
      exports.fiberStarted.unsafeUpdate(1, tags);
      exports.fiberActive.unsafeUpdate(1, tags);
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
      const updatedRuntimeFlags = parentFiber.getFiberRef(exports.currentRuntimeFlags);
      const patch = (0, Function_js_1.pipe)(_runtimeFlags.diff(parentRuntimeFlags, updatedRuntimeFlags),
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
    this.setFiberRef(exports.currentRuntimeFlags, this._runtimeFlags);
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
    this._supervisor = this.getFiberRef(exports.currentSupervisor);
    this._scheduler = this.getFiberRef(Scheduler_js_1.currentScheduler);
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
      exports.fiberActive.unsafeUpdate(-1, tags);
      switch (exit._tag) {
        case OpCodes.OP_SUCCESS:
          {
            exports.fiberSuccesses.unsafeUpdate(1, tags);
            break;
          }
        case OpCodes.OP_FAILURE:
          {
            exports.fiberFailures.unsafeUpdate(1, tags);
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
      exports.fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
    }
    this.reportExitValue(exit);
    for (let i = this._observers.length - 1; i >= 0; i--) {
      this._observers[i](exit);
    }
  }
  getLoggers() {
    return this.getFiberRef(exports.currentLoggers);
  }
  log(message, cause, overrideLogLevel) {
    const logLevel = Option.isSome(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(core.currentLogLevel);
    const minimumLogLevel = this.getFiberRef(exports.currentMinimumLogLevel);
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
          this._runtimeFlags = (0, Function_js_1.pipe)(this._runtimeFlags, _runtimeFlags.enable(_runtimeFlags.WindDown));
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
    return core.uninterruptibleMask(restore => core.flatMap((0, exports.fork)(core.runRequestBlock(op.i0)), () => restore(op.i1)));
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
      if ((this._runtimeFlags & runtimeFlags_js_1.OpSupervision) !== 0) {
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
          if (version_js_1.moduleVersion !== cur[Effectable_js_1.EffectTypeId]._V) {
            return core.dieMessage(`Cannot execute an Effect versioned ${cur[Effectable_js_1.EffectTypeId]._V} with a Runtime of version ${version_js_1.moduleVersion}`);
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
exports.FiberRuntime = FiberRuntime;
// circular with Logger
/** @internal */
exports.currentMinimumLogLevel = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)("effect/FiberRef/currentMinimumLogLevel", () => core.fiberRefUnsafeMake(LogLevel.fromLiteral("Info")));
/** @internal */
const getConsole = refs => {
  const defaultServicesValue = FiberRefs.getOrDefault(refs, defaultServices.currentServices);
  const cnsl = Context.get(defaultServicesValue, console_js_1.consoleTag);
  return cnsl.unsafe;
};
exports.getConsole = getConsole;
/** @internal */
exports.defaultLogger = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Logger/defaultLogger"), () => internalLogger.makeLogger(options => {
  const formatted = internalLogger.stringLogger.log(options);
  (0, exports.getConsole)(options.context).log(formatted);
}));
/** @internal */
exports.logFmtLogger = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Logger/logFmtLogger"), () => internalLogger.makeLogger(options => {
  const formatted = internalLogger.logfmtLogger.log(options);
  (0, exports.getConsole)(options.context).log(formatted);
}));
/** @internal */
exports.tracerLogger = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Logger/tracerLogger"), () => internalLogger.makeLogger(({
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
exports.currentLoggers = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentLoggers"), () => core.fiberRefUnsafeMakeHashSet(HashSet.make(exports.defaultLogger, exports.tracerLogger)));
// circular with Effect
/* @internal */
exports.acquireRelease = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), (acquire, release) => {
  return core.uninterruptible(core.tap(acquire, a => (0, exports.addFinalizer)(exit => release(a, exit))));
});
/* @internal */
exports.acquireReleaseInterruptible = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), (acquire, release) => {
  return (0, exports.ensuring)(acquire, (0, exports.addFinalizer)(exit => release(exit)));
});
/* @internal */
const addFinalizer = finalizer => core.withFiberRuntime(runtime => {
  const acquireRefs = runtime.getFiberRefs();
  const acquireFlags = runtime._runtimeFlags;
  return core.flatMap(exports.scope, scope => core.scopeAddFinalizerExit(scope, exit => core.withFiberRuntime(runtimeFinalizer => {
    const preRefs = runtimeFinalizer.getFiberRefs();
    const preFlags = runtimeFinalizer._runtimeFlags;
    const patchRefs = FiberRefsPatch.diff(preRefs, acquireRefs);
    const patchFlags = _runtimeFlags.diff(preFlags, acquireFlags);
    const inverseRefs = FiberRefsPatch.diff(acquireRefs, preRefs);
    runtimeFinalizer.setFiberRefs(FiberRefsPatch.patch(patchRefs, runtimeFinalizer.id(), acquireRefs));
    return (0, exports.ensuring)(core.withRuntimeFlags(finalizer(exit), patchFlags), core.sync(() => {
      runtimeFinalizer.setFiberRefs(FiberRefsPatch.patch(inverseRefs, runtimeFinalizer.id(), runtimeFinalizer.getFiberRefs()));
    }));
  })));
});
exports.addFinalizer = addFinalizer;
/* @internal */
const daemonChildren = self => {
  const forkScope = core.fiberRefLocally(core.currentForkScopeOverride, Option.some(fiberScope.globalScope));
  return forkScope(self);
};
exports.daemonChildren = daemonChildren;
/** @internal */
const _existsParFound = /*#__PURE__*/Symbol.for("effect/Effect/existsPar/found");
/* @internal */
exports.exists = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (elements, f, options) => concurrency.matchSimple(options, () => core.suspend(() => existsLoop(elements[Symbol.iterator](), 0, f)), () => core.matchEffect((0, exports.forEachOptions)(elements, (a, i) => core.if_(f(a, i), {
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
  return (0, Function_js_1.pipe)(core.flatMap(f(next.value, index), b => b ? core.succeed(b) : existsLoop(iterator, index + 1, f)));
};
/* @internal */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (elements, f, options) => {
  const predicate = options?.negate ? (a, i) => core.map(f(a, i), Boolean.not) : f;
  return concurrency.matchSimple(options, () => core.suspend(() => RA.fromIterable(elements).reduceRight((effect, a, i) => core.zipWith(effect, core.suspend(() => predicate(a, i)), (list, b) => b ? [a, ...list] : list), core.sync(() => new Array()))), () => core.map((0, exports.forEachOptions)(elements, (a, i) => core.map(predicate(a, i), b => b ? Option.some(a) : Option.none()), options), RA.compact));
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
  return core.flatMap((0, exports.forEachOptions)(eitherEffects, Function_js_1.identity, {
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
    return (0, exports.forEachOptions)(eitherEffects, Function_js_1.identity, {
      concurrency: options?.concurrency,
      batching: options?.batching,
      discard: true
    });
  }
  return core.map((0, exports.forEachOptions)(eitherEffects, Function_js_1.identity, {
    concurrency: options?.concurrency,
    batching: options?.batching
  }), eithers => reconcile._tag === "Some" ? reconcile.value(eithers) : eithers);
};
/* @internal */
const all = (arg, options) => {
  const [effects, reconcile] = allResolveInput(arg);
  if (options?.mode === "validate") {
    return allValidate(effects, reconcile, options);
  } else if (options?.mode === "either") {
    return allEither(effects, reconcile, options);
  }
  return reconcile._tag === "Some" ? core.map((0, exports.forEachOptions)(effects, Function_js_1.identity, options), reconcile.value) : (0, exports.forEachOptions)(effects, Function_js_1.identity, options);
};
exports.all = all;
/* @internal */
const allWith = options => arg => (0, exports.all)(arg, options);
exports.allWith = allWith;
/* @internal */
const allSuccesses = (elements, options) => core.map((0, exports.all)(RA.fromIterable(elements).map(core.exit), options), RA.filterMap(exit => core.exitIsSuccess(exit) ? Option.some(exit.i0) : Option.none()));
exports.allSuccesses = allSuccesses;
/* @internal */
exports.replicate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => Array.from({
  length: n
}, () => self));
/* @internal */
exports.replicateEffect = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), (self, n, options) => (0, exports.all)((0, exports.replicate)(self, n), options));
// @ts-expect-error
exports.forEachOptions = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (self, f, options) => core.withFiberRuntime(r => {
  const requestBatchingEnabled = options?.batching === true || options?.batching === "inherit" && r.getFiberRef(core.currentRequestBatching);
  if (options?.discard) {
    return concurrency.match(options, () => (0, exports.finalizersMask)(ExecutionStrategy.sequential)(restore => requestBatchingEnabled ? forEachBatchedDiscard(self, (a, i) => restore(f(a, i))) : core.forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))), () => (0, exports.finalizersMask)(ExecutionStrategy.parallel)(restore => (0, exports.forEachParUnboundedDiscard)(self, (a, i) => restore(f(a, i)), requestBatchingEnabled)), n => (0, exports.finalizersMask)(ExecutionStrategy.parallelN(n))(restore => (0, exports.forEachParNDiscard)(self, n, (a, i) => restore(f(a, i)), requestBatchingEnabled)));
  }
  return concurrency.match(options, () => (0, exports.finalizersMask)(ExecutionStrategy.sequential)(restore => requestBatchingEnabled ? (0, exports.forEachParN)(self, 1, (a, i) => restore(f(a, i)), true) : core.forEachSequential(self, (a, i) => restore(f(a, i)))), () => (0, exports.finalizersMask)(ExecutionStrategy.parallel)(restore => (0, exports.forEachParUnbounded)(self, (a, i) => restore(f(a, i)), requestBatchingEnabled)), n => (0, exports.finalizersMask)(ExecutionStrategy.parallelN(n))(restore => (0, exports.forEachParN)(self, n, (a, i) => restore(f(a, i)), requestBatchingEnabled)));
}));
/* @internal */
const forEachParUnbounded = (self, f, batching) => core.suspend(() => {
  const as = RA.fromIterable(self);
  const array = new Array(as.length);
  const fn = (a, i) => core.flatMap(f(a, i), b => core.sync(() => array[i] = b));
  return core.zipRight((0, exports.forEachParUnboundedDiscard)(as, fn, batching), core.succeed(array));
});
exports.forEachParUnbounded = forEachParUnbounded;
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
      return core.blocked(requests, forEachBatchedDiscard(blocked.map(b => b.i1), Function_js_1.identity));
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
          return core.blocked(requests, core.flatMap(forEachBatchedDiscard(blocked.map(b => b.i1), Function_js_1.identity), () => s));
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
const forEachParUnboundedDiscard = (self, f, batching) => core.suspend(() => {
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
    const process = core.transplant(graft => core.forEachSequential(as, (a, i) => (0, Function_js_1.pipe)(graft((0, Function_js_1.pipe)(core.suspend(() => restore((batching ? core.step : core.exit)(f(a, i)))), core.flatMap(exit => {
      switch (exit._op) {
        case "Failure":
          {
            if (residual.length > 0) {
              const requests = residual.map(blocked => blocked.i0).reduce(_RequestBlock.par);
              const _continue = (0, exports.forEachParUnboundedDiscard)(residual, blocked => blocked.i1, batching);
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
                const _continue = (0, exports.forEachParUnboundedDiscard)(residual, blocked => blocked.i1, batching);
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
    }))), exports.forkDaemon, core.map(fiber => {
      fiber.addObserver(() => {
        joinOrder.push(fiber);
      });
      return fiber;
    }))));
    return core.flatMap(process, fibers => core.matchCauseEffect(restore(core.deferredAwait(deferred)), {
      onFailure: cause => core.flatMap((0, exports.forEachParUnbounded)(fibers, core.interruptFiber, batching), exits => {
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
exports.forEachParUnboundedDiscard = forEachParUnboundedDiscard;
/* @internal */
const forEachParN = (self, n, f, batching) => core.suspend(() => {
  const as = RA.fromIterable(self);
  const array = new Array(as.length);
  const fn = (a, i) => core.map(f(a, i), b => array[i] = b);
  return core.zipRight((0, exports.forEachParNDiscard)(as, n, fn, batching), core.succeed(array));
});
exports.forEachParN = forEachParN;
/* @internal */
const forEachParNDiscard = (self, n, f, batching) => core.suspend(() => {
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
  return core.flatMap(core.exit((0, exports.forEachParUnboundedDiscard)(effects, Function_js_1.identity, batching)), exit => {
    if (residual.length === 0) {
      return exit;
    }
    const requests = residual.map(blocked => blocked.i0).reduce(_RequestBlock.par);
    const _continue = (0, exports.forEachParNDiscard)(residual, n, blocked => blocked.i1, batching);
    if (exit._tag === "Failure") {
      return core.blocked(requests, core.matchCauseEffect(_continue, {
        onFailure: cause => core.exitFailCause(internalCause.parallel(exit.cause, cause)),
        onSuccess: () => exit
      }));
    }
    return core.blocked(requests, _continue);
  });
});
exports.forEachParNDiscard = forEachParNDiscard;
/* @internal */
const fork = self => core.withFiberRuntime((state, status) => core.succeed((0, exports.unsafeFork)(self, state, status.runtimeFlags)));
exports.fork = fork;
/* @internal */
const forkDaemon = self => forkWithScopeOverride(self, fiberScope.globalScope);
exports.forkDaemon = forkDaemon;
/* @internal */
exports.forkWithErrorHandler = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, handler) => (0, exports.fork)(core.onError(self, cause => {
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
const unsafeFork = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = (0, exports.unsafeMakeChildFiber)(effect, parentFiber, parentRuntimeFlags, overrideScope);
  childFiber.resume(effect);
  return childFiber;
};
exports.unsafeFork = unsafeFork;
/** @internal */
const unsafeMakeChildFiber = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childId = FiberId.unsafeMake();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = fiberRefs.forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
  const childContext = fiberRefs.getOrDefault(childFiberRefs, core.currentContext);
  const supervisor = childFiber._supervisor;
  supervisor.onStart(childContext, effect, Option.some(parentFiber), childFiber);
  childFiber.addObserver(exit => supervisor.onEnd(exit, childFiber));
  const parentScope = overrideScope !== null ? overrideScope : (0, Function_js_1.pipe)(parentFiber.getFiberRef(core.currentForkScopeOverride), Option.getOrElse(() => parentFiber.scope()));
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
};
exports.unsafeMakeChildFiber = unsafeMakeChildFiber;
/* @internal */
const forkWithScopeOverride = (self, scopeOverride) => core.withFiberRuntime((parentFiber, parentStatus) => core.succeed((0, exports.unsafeFork)(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)));
/* @internal */
exports.mergeAll = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (elements, zero, f, options) => concurrency.matchSimple(options, () => RA.fromIterable(elements).reduce((acc, a, i) => core.zipWith(acc, a, (acc, a) => f(acc, a, i)), core.succeed(zero)), () => core.flatMap(Ref.make(zero), acc => core.flatMap((0, exports.forEachOptions)(elements, (effect, i) => core.flatMap(effect, a => Ref.update(acc, b => f(b, a, i))), options), () => Ref.get(acc)))));
/* @internal */
exports.partition = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (elements, f, options) => (0, Function_js_1.pipe)((0, exports.forEachOptions)(elements, (a, i) => core.either(f(a, i)), options), core.map(chunk => core.partitionMap(chunk, Function_js_1.identity))));
/* @internal */
exports.validateAll = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (elements, f, options) => core.flatMap((0, exports.partition)(elements, f, {
  concurrency: options?.concurrency,
  batching: options?.batching
}), ([es, bs]) => es.length === 0 ? options?.discard ? core.unit : core.succeed(bs) : core.fail(es)));
/* @internal */
const raceAll = all => {
  const list = Chunk.fromIterable(all);
  if (!Chunk.isNonEmpty(list)) {
    return core.dieSync(() => internalCause.IllegalArgumentException(`Received an empty collection of effects`));
  }
  const self = Chunk.headNonEmpty(list);
  const effects = Chunk.tailNonEmpty(list);
  const inheritAll = res => (0, Function_js_1.pipe)(internalFiber.inheritAll(res[1]), core.as(res[0]));
  return (0, Function_js_1.pipe)(core.deferredMake(), core.flatMap(done => (0, Function_js_1.pipe)(Ref.make(effects.length), core.flatMap(fails => core.uninterruptibleMask(restore => (0, Function_js_1.pipe)((0, exports.fork)(core.interruptible(self)), core.flatMap(head => (0, Function_js_1.pipe)(effects, core.forEachSequential(effect => (0, exports.fork)(core.interruptible(effect))), core.map(Chunk.unsafeFromArray), core.map(tail => (0, Function_js_1.pipe)(tail, Chunk.prepend(head))), core.tap(fibers => (0, Function_js_1.pipe)(fibers, RA.reduce(core.unit, (effect, fiber) => (0, Function_js_1.pipe)(effect, core.zipRight((0, Function_js_1.pipe)(internalFiber._await(fiber), core.flatMap(raceAllArbiter(fibers, fiber, done, fails)), exports.fork, core.asUnit)))))), core.flatMap(fibers => (0, Function_js_1.pipe)(restore((0, Function_js_1.pipe)(Deferred.await(done), core.flatMap(inheritAll))), core.onInterrupt(() => (0, Function_js_1.pipe)(fibers, RA.reduce(core.unit, (effect, fiber) => (0, Function_js_1.pipe)(effect, core.zipLeft(core.interruptFiber(fiber))))))))))))))));
};
exports.raceAll = raceAll;
/* @internal */
const raceAllArbiter = (fibers, winner, deferred, fails) => exit => core.exitMatchEffect(exit, {
  onFailure: cause => (0, Function_js_1.pipe)(Ref.modify(fails, fails => [fails === 0 ? (0, Function_js_1.pipe)(core.deferredFailCause(deferred, cause), core.asUnit) : core.unit, fails - 1]), core.flatten),
  onSuccess: value => (0, Function_js_1.pipe)(core.deferredSucceed(deferred, [value, winner]), core.flatMap(set => set ? (0, Function_js_1.pipe)(Chunk.fromIterable(fibers), RA.reduce(core.unit, (effect, fiber) => fiber === winner ? effect : (0, Function_js_1.pipe)(effect, core.zipLeft(core.interruptFiber(fiber))))) : core.unit))
});
/* @internal */
exports.reduceEffect = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (elements, zero, f, options) => concurrency.matchSimple(options, () => RA.fromIterable(elements).reduce((acc, a, i) => core.zipWith(acc, a, (acc, a) => f(acc, a, i)), zero), () => core.suspend(() => (0, Function_js_1.pipe)((0, exports.mergeAll)([zero, ...elements], Option.none(), (acc, elem, i) => {
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
const parallelFinalizers = self => core.contextWithEffect(context => Option.match(Context.getOption(context, exports.scopeTag), {
  onNone: () => self,
  onSome: scope => {
    switch (scope.strategy._tag) {
      case "Parallel":
        return self;
      case "Sequential":
      case "ParallelN":
        return core.flatMap(core.scopeFork(scope, ExecutionStrategy.parallel), inner => (0, exports.scopeExtend)(self, inner));
    }
  }
}));
exports.parallelFinalizers = parallelFinalizers;
/* @internal */
const parallelNFinalizers = parallelism => self => core.contextWithEffect(context => Option.match(Context.getOption(context, exports.scopeTag), {
  onNone: () => self,
  onSome: scope => {
    if (scope.strategy._tag === "ParallelN" && scope.strategy.parallelism === parallelism) {
      return self;
    }
    return core.flatMap(core.scopeFork(scope, ExecutionStrategy.parallelN(parallelism)), inner => (0, exports.scopeExtend)(self, inner));
  }
}));
exports.parallelNFinalizers = parallelNFinalizers;
/* @internal */
const finalizersMask = strategy => self => core.contextWithEffect(context => Option.match(Context.getOption(context, exports.scopeTag), {
  onNone: () => self(Function_js_1.identity),
  onSome: scope => {
    const patch = strategy._tag === "Parallel" ? exports.parallelFinalizers : strategy._tag === "Sequential" ? exports.sequentialFinalizers : (0, exports.parallelNFinalizers)(strategy.parallelism);
    switch (scope.strategy._tag) {
      case "Parallel":
        return patch(self(exports.parallelFinalizers));
      case "Sequential":
        return patch(self(exports.sequentialFinalizers));
      case "ParallelN":
        return patch(self((0, exports.parallelNFinalizers)(scope.strategy.parallelism)));
    }
  }
}));
exports.finalizersMask = finalizersMask;
/* @internal */
const scopeWith = f => core.flatMap(exports.scopeTag, f);
exports.scopeWith = scopeWith;
/* @internal */
const scopedEffect = effect => core.flatMap((0, exports.scopeMake)(), scope => (0, exports.scopeUse)(scope)(effect));
exports.scopedEffect = scopedEffect;
/* @internal */
const sequentialFinalizers = self => core.contextWithEffect(context => Option.match(Context.getOption(context, exports.scopeTag), {
  onNone: () => self,
  onSome: scope => {
    switch (scope.strategy._tag) {
      case "Sequential":
        return self;
      case "Parallel":
      case "ParallelN":
        return core.flatMap(core.scopeFork(scope, ExecutionStrategy.sequential), inner => (0, exports.scopeExtend)(self, inner));
    }
  }
}));
exports.sequentialFinalizers = sequentialFinalizers;
/* @internal */
const tagMetricsScoped = (key, value) => (0, exports.labelMetricsScoped)([metricLabel.make(key, value)]);
exports.tagMetricsScoped = tagMetricsScoped;
/* @internal */
const labelMetricsScoped = labels => (0, exports.labelMetricsScopedSet)(HashSet.fromIterable(labels));
exports.labelMetricsScoped = labelMetricsScoped;
/* @internal */
const labelMetricsScopedSet = labels => (0, exports.fiberRefLocallyScopedWith)(core.currentMetricLabels, set => (0, Function_js_1.pipe)(set, HashSet.union(labels)));
exports.labelMetricsScopedSet = labelMetricsScopedSet;
/* @internal */
exports.using = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, use) => core.acquireUseRelease((0, exports.scopeMake)(), scope => core.flatMap((0, exports.scopeExtend)(self, scope), use), (scope, exit) => core.scopeClose(scope, exit)));
/** @internal */
exports.validate = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[1]), (self, that, options) => (0, exports.validateWith)(self, that, (a, b) => [a, b], options));
/** @internal */
exports.validateWith = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[1]), (self, that, f, options) => core.flatten((0, exports.zipWithOptions)(core.exit(self), core.exit(that), (ea, eb) => core.exitZipWith(ea, eb, {
  onSuccess: f,
  onFailure: (ca, cb) => options?.concurrent ? internalCause.parallel(ca, cb) : internalCause.sequential(ca, cb)
}), options)));
/* @internal */
exports.validateAllPar = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, f) => core.flatMap((0, exports.partition)(elements, f), ([es, bs]) => es.length === 0 ? core.succeed(bs) : core.fail(es)));
/* @internal */
exports.validateAllParDiscard = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, f) => core.flatMap((0, exports.partition)(elements, f), ([es, _]) => es.length === 0 ? core.unit : core.fail(es)));
/* @internal */
exports.validateFirst = /*#__PURE__*/(0, Function_js_1.dual)(args => Predicate.isIterable(args[0]), (elements, f, options) => core.flip((0, exports.forEachOptions)(elements, (a, i) => core.flip(f(a, i)), options)));
/* @internal */
const withClockScoped = value => (0, exports.fiberRefLocallyScopedWith)(defaultServices.currentServices, Context.add(clock.clockTag, value));
exports.withClockScoped = withClockScoped;
/* @internal */
const withConfigProviderScoped = value => (0, exports.fiberRefLocallyScopedWith)(defaultServices.currentServices, Context.add(configProvider_js_1.configProviderTag, value));
exports.withConfigProviderScoped = withConfigProviderScoped;
/* @internal */
const withEarlyRelease = self => (0, exports.scopeWith)(parent => core.flatMap(core.scopeFork(parent, executionStrategy.sequential), child => (0, Function_js_1.pipe)(self, (0, exports.scopeExtend)(child), core.map(value => [core.fiberIdWith(fiberId => core.scopeClose(child, core.exitInterrupt(fiberId))), value]))));
exports.withEarlyRelease = withEarlyRelease;
/** @internal */
exports.zipOptions = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[1]), (self, that, options) => (0, exports.zipWithOptions)(self, that, (a, b) => [a, b], options));
/** @internal */
exports.zipLeftOptions = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[1]), (self, that, options) => (0, exports.zipWithOptions)(self, that, (a, _) => a, options));
/** @internal */
exports.zipRightOptions = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[1]), (self, that, options) => (0, exports.zipWithOptions)(self, that, (_, b) => b, options));
/** @internal */
exports.zipWithOptions = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[1]), (self, that, f, options) => core.map((0, exports.all)([self, that], {
  concurrency: options?.concurrent ? 2 : 1,
  batching: options?.batching
}), ([a, a2]) => f(a, a2)));
/* @internal */
const withRuntimeFlagsScoped = update => {
  if (update === RuntimeFlagsPatch.empty) {
    return core.unit;
  }
  return (0, Function_js_1.pipe)(core.runtimeFlags, core.flatMap(runtimeFlags => {
    const updatedRuntimeFlags = _runtimeFlags.patch(runtimeFlags, update);
    const revertRuntimeFlags = _runtimeFlags.diff(updatedRuntimeFlags, runtimeFlags);
    return (0, Function_js_1.pipe)(core.updateRuntimeFlags(update), core.zipRight((0, exports.addFinalizer)(() => core.updateRuntimeFlags(revertRuntimeFlags))), core.asUnit);
  }), core.uninterruptible);
};
exports.withRuntimeFlagsScoped = withRuntimeFlagsScoped;
// circular with ReleaseMap
/* @internal */
const releaseMapReleaseAll = (strategy, exit) => self => core.suspend(() => {
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
        return executionStrategy.isSequential(strategy) ? (0, Function_js_1.pipe)(finalizers, core.forEachSequential(fin => core.exit(update(fin)(exit))), core.flatMap(results => (0, Function_js_1.pipe)(core.exitCollectAll(results), Option.map(core.exitAsUnit), Option.getOrElse(() => core.exitUnit)))) : executionStrategy.isParallel(strategy) ? (0, Function_js_1.pipe)((0, exports.forEachParUnbounded)(finalizers, fin => core.exit(update(fin)(exit)), false), core.flatMap(results => (0, Function_js_1.pipe)(core.exitCollectAll(results, {
          parallel: true
        }), Option.map(core.exitAsUnit), Option.getOrElse(() => core.exitUnit)))) : (0, Function_js_1.pipe)((0, exports.forEachParN)(finalizers, strategy.parallelism, fin => core.exit(update(fin)(exit)), false), core.flatMap(results => (0, Function_js_1.pipe)(core.exitCollectAll(results, {
          parallel: true
        }), Option.map(core.exitAsUnit), Option.getOrElse(() => core.exitUnit))));
      }
  }
});
exports.releaseMapReleaseAll = releaseMapReleaseAll;
// circular with Scope
/** @internal */
exports.scopeTag = /*#__PURE__*/Context.Tag(core.ScopeTypeId);
/* @internal */
exports.scope = exports.scopeTag;
/* @internal */
const scopeMake = (strategy = executionStrategy.sequential) => core.map(core.releaseMapMake, rm => ({
  [core.ScopeTypeId]: core.ScopeTypeId,
  [core.CloseableScopeTypeId]: core.CloseableScopeTypeId,
  strategy,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  fork: strategy => core.uninterruptible((0, Function_js_1.pipe)((0, exports.scopeMake)(strategy), core.flatMap(scope => (0, Function_js_1.pipe)(core.releaseMapAdd(rm, exit => core.scopeClose(scope, exit)), core.tap(fin => core.scopeAddFinalizerExit(scope, fin)), core.as(scope))))),
  close: exit => core.asUnit((0, exports.releaseMapReleaseAll)(strategy, exit)(rm)),
  addFinalizer: fin => core.asUnit(core.releaseMapAdd(fin)(rm))
}));
exports.scopeMake = scopeMake;
/* @internal */
exports.scopeExtend = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, scope) => core.mapInputContext(effect,
// @ts-expect-error
Context.merge(Context.make(exports.scopeTag, scope))));
/* @internal */
exports.scopeUse = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, scope) => (0, Function_js_1.pipe)(effect, (0, exports.scopeExtend)(scope), core.onExit(exit => scope.close(exit))));
// circular with Supervisor
/** @internal */
const fiberRefUnsafeMakeSupervisor = initial => core.fiberRefUnsafeMakePatch(initial, {
  differ: SupervisorPatch.differ,
  fork: SupervisorPatch.empty
});
exports.fiberRefUnsafeMakeSupervisor = fiberRefUnsafeMakeSupervisor;
// circular with FiberRef
/* @internal */
exports.fiberRefLocallyScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => core.asUnit((0, exports.acquireRelease)(core.flatMap(core.fiberRefGet(self), oldValue => core.as(core.fiberRefSet(self, value), oldValue)), oldValue => core.fiberRefSet(self, oldValue))));
/* @internal */
exports.fiberRefLocallyScopedWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.fiberRefGetWith(self, a => (0, exports.fiberRefLocallyScoped)(self, f(a))));
/* @internal */
const fiberRefMake = (initial, options) => (0, exports.fiberRefMakeWith)(() => core.fiberRefUnsafeMake(initial, options));
exports.fiberRefMake = fiberRefMake;
/* @internal */
const fiberRefMakeWith = ref => (0, exports.acquireRelease)(core.tap(core.sync(ref), ref => core.fiberRefUpdate(ref, Function_js_1.identity)), fiberRef => core.fiberRefDelete(fiberRef));
exports.fiberRefMakeWith = fiberRefMakeWith;
/* @internal */
const fiberRefMakeContext = initial => (0, exports.fiberRefMakeWith)(() => core.fiberRefUnsafeMakeContext(initial));
exports.fiberRefMakeContext = fiberRefMakeContext;
/* @internal */
const fiberRefMakeRuntimeFlags = initial => (0, exports.fiberRefMakeWith)(() => core.fiberRefUnsafeMakeRuntimeFlags(initial));
exports.fiberRefMakeRuntimeFlags = fiberRefMakeRuntimeFlags;
/** @internal */
exports.currentRuntimeFlags = /*#__PURE__*/core.fiberRefUnsafeMakeRuntimeFlags(_runtimeFlags.none);
/** @internal */
exports.currentSupervisor = /*#__PURE__*/(0, exports.fiberRefUnsafeMakeSupervisor)(supervisor.none);
// circular with Fiber
/* @internal */
const fiberAwaitAll = fibers => core.asUnit(internalFiber._await((0, exports.fiberAll)(fibers)));
exports.fiberAwaitAll = fiberAwaitAll;
/** @internal */
const fiberAll = fibers => ({
  [internalFiber.FiberTypeId]: internalFiber.fiberVariance,
  id: () => RA.fromIterable(fibers).reduce((id, fiber) => FiberId.combine(id, fiber.id()), FiberId.none),
  await: () => core.exit((0, exports.forEachParUnbounded)(fibers, fiber => core.flatten(fiber.await()), false)),
  children: () => core.map((0, exports.forEachParUnbounded)(fibers, fiber => fiber.children(), false), RA.flatten),
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
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
});
exports.fiberAll = fiberAll;
/* @internal */
const fiberInterruptFork = self => core.asUnit((0, exports.forkDaemon)(core.interruptFiber(self)));
exports.fiberInterruptFork = fiberInterruptFork;
/* @internal */
const fiberJoinAll = fibers => core.asUnit(internalFiber.join((0, exports.fiberAll)(fibers)));
exports.fiberJoinAll = fiberJoinAll;
/* @internal */
const fiberScoped = self => (0, exports.acquireRelease)(core.succeed(self), core.interruptFiber);
exports.fiberScoped = fiberScoped;
//
// circular race
//
/** @internal */
exports.raceWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, other, options) => (0, exports.raceFibersWith)(self, other, {
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
const disconnect = self => core.uninterruptibleMask(restore => core.fiberIdWith(fiberId => core.flatMap((0, exports.forkDaemon)(restore(self)), fiber => (0, Function_js_1.pipe)(restore(internalFiber.join(fiber)), core.onInterrupt(() => (0, Function_js_1.pipe)(fiber, internalFiber.interruptAsFork(fiberId)))))));
exports.disconnect = disconnect;
/** @internal */
exports.race = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => core.fiberIdWith(parentFiberId => (0, exports.raceWith)(self, that, {
  onSelfDone: (exit, right) => core.exitMatchEffect(exit, {
    onFailure: cause => (0, Function_js_1.pipe)(internalFiber.join(right), internalEffect.mapErrorCause(cause2 => internalCause.parallel(cause, cause2))),
    onSuccess: value => (0, Function_js_1.pipe)(right, core.interruptAsFiber(parentFiberId), core.as(value))
  }),
  onOtherDone: (exit, left) => core.exitMatchEffect(exit, {
    onFailure: cause => (0, Function_js_1.pipe)(internalFiber.join(left), internalEffect.mapErrorCause(cause2 => internalCause.parallel(cause2, cause))),
    onSuccess: value => (0, Function_js_1.pipe)(left, core.interruptAsFiber(parentFiberId), core.as(value))
  })
})));
/** @internal */
exports.raceFibersWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, other, options) => core.withFiberRuntime((parentFiber, parentStatus) => {
  const parentRuntimeFlags = parentStatus.runtimeFlags;
  const raceIndicator = MRef.make(true);
  const leftFiber = (0, exports.unsafeMakeChildFiber)(self, parentFiber, parentRuntimeFlags, options.selfScope);
  const rightFiber = (0, exports.unsafeMakeChildFiber)(other, parentFiber, parentRuntimeFlags, options.otherScope);
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
exports.ensuring = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => core.uninterruptibleMask(restore => core.matchCauseEffect(restore(self), {
  onFailure: cause1 => core.matchCauseEffect(finalizer, {
    onFailure: cause2 => core.failCause(internalCause.sequential(cause1, cause2)),
    onSuccess: () => core.failCause(cause1)
  }),
  onSuccess: a => core.as(finalizer, a)
})));
/** @internal */
const invokeWithInterrupt = (dataSource, all) => core.fiberIdWith(id => core.flatMap(core.flatMap((0, exports.forkDaemon)(core.interruptible(dataSource)), processing => core.async(cb => {
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
  return core.forEachSequentialDiscard(residual, entry => (0, request_js_1.complete)(entry.request, core.exitInterrupt(id)));
})));
exports.invokeWithInterrupt = invokeWithInterrupt;
/** @internal */
exports.interruptWhenPossible = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, all) => core.fiberRefGetWith(completedRequestMap_js_1.currentRequestMap, map => core.suspend(() => {
  const entries = RA.fromIterable(all).flatMap(_ => map.has(_) ? [map.get(_)] : []);
  return (0, exports.invokeWithInterrupt)(self, entries);
})));
// circular Tracer
/** @internal */
const makeSpanScoped = (name, options) => (0, exports.acquireRelease)(internalEffect.makeSpan(name, options), (span, exit) => core.flatMap(internalEffect.currentTimeNanosTracing, endTime => core.sync(() => span.end(endTime, exit))));
exports.makeSpanScoped = makeSpanScoped;
/* @internal */
const withTracerScoped = value => (0, exports.fiberRefLocallyScopedWith)(defaultServices.currentServices, Context.add(tracer.tracerTag, value));
exports.withTracerScoped = withTracerScoped;
/** @internal */
exports.withSpanScoped = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] !== "string", (self, name, options) => core.flatMap((0, exports.makeSpanScoped)(name, options), span => internalEffect.provideService(self, tracer.spanTag, span)));
//# sourceMappingURL=fiberRuntime.js.map