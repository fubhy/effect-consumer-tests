"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentTimeMillis = exports.testClockWith = exports.testClock = exports.sleeps = exports.sleep = exports.setTime = exports.save = exports.adjustWith = exports.adjust = exports.defaultTestClock = exports.live = exports.TestClockImpl = exports.TestClock = exports.makeData = void 0;
/**
 * @since 2.0.0
 */
const Chunk = /*#__PURE__*/require("./Chunk.js");
const Context = /*#__PURE__*/require("./Context.js");
const Duration = /*#__PURE__*/require("./Duration.js");
const Equal = /*#__PURE__*/require("./Equal.js");
const FiberStatus = /*#__PURE__*/require("./FiberStatus.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const HashMap = /*#__PURE__*/require("./HashMap.js");
const clock = /*#__PURE__*/require("./internal/clock.js");
const effect = /*#__PURE__*/require("./internal/core-effect.js");
const core = /*#__PURE__*/require("./internal/core.js");
const defaultServices = /*#__PURE__*/require("./internal/defaultServices.js");
const circular = /*#__PURE__*/require("./internal/effect/circular.js");
const fiberRuntime = /*#__PURE__*/require("./internal/fiberRuntime.js");
const layer = /*#__PURE__*/require("./internal/layer.js");
const ref = /*#__PURE__*/require("./internal/ref.js");
const synchronized = /*#__PURE__*/require("./internal/synchronizedRef.js");
const SuspendedWarningData = /*#__PURE__*/require("./internal/testing/suspendedWarningData.js");
const WarningData = /*#__PURE__*/require("./internal/testing/warningData.js");
const number = /*#__PURE__*/require("./Number.js");
const Option = /*#__PURE__*/require("./Option.js");
const Order = /*#__PURE__*/require("./Order.js");
const Annotations = /*#__PURE__*/require("./TestAnnotations.js");
const Live = /*#__PURE__*/require("./TestLive.js");
/**
 * @since 2.0.0
 */
const makeData = (instant, sleeps) => ({
  instant,
  sleeps
});
exports.makeData = makeData;
/**
 * @since 2.0.0
 */
exports.TestClock = /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestClock"));
/**
 * The warning message that will be displayed if a test is using time but is
 * not advancing the `TestClock`.
 *
 * @internal
 */
const warning = "Warning: A test is using time, but is not advancing " + "the test clock, which may result in the test hanging. Use TestClock.adjust to " + "manually advance the time.";
/**
 * The warning message that will be displayed if a test is advancing the clock
 * but a fiber is still running.
 *
 * @internal
 */
const suspendedWarning = "Warning: A test is advancing the test clock, " + "but a fiber is not suspending, which may result in the test hanging. Use " + "TestAspect.diagnose to identity the fiber that is not suspending.";
/** @internal */
class TestClockImpl {
  clockState;
  live;
  annotations;
  warningState;
  suspendedWarningState;
  [clock.ClockTypeId] = clock.ClockTypeId;
  constructor(clockState, live, annotations, warningState, suspendedWarningState) {
    this.clockState = clockState;
    this.live = live;
    this.annotations = annotations;
    this.warningState = warningState;
    this.suspendedWarningState = suspendedWarningState;
    this.currentTimeMillis = core.map(ref.get(this.clockState), data => data.instant);
    this.currentTimeNanos = core.map(ref.get(this.clockState), data => BigInt(data.instant * 1000000));
  }
  /**
   * Unsafely returns the current time in milliseconds.
   */
  unsafeCurrentTimeMillis() {
    return ref.unsafeGet(this.clockState).instant;
  }
  /**
   * Unsafely returns the current time in nanoseconds.
   */
  unsafeCurrentTimeNanos() {
    return BigInt(ref.unsafeGet(this.clockState).instant * 1000000);
  }
  /**
   * Returns the current clock time in milliseconds.
   */
  currentTimeMillis;
  /**
   * Returns the current clock time in nanoseconds.
   */
  currentTimeNanos;
  /**
   * Saves the `TestClock`'s current state in an effect which, when run, will
   * restore the `TestClock` state to the saved state.
   */
  save() {
    return core.map(ref.get(this.clockState), data => ref.set(this.clockState, data));
  }
  /**
   * Sets the current clock time to the specified instant. Any effects that
   * were scheduled to occur on or before the new time will be run in order.
   */
  setTime(instant) {
    return core.zipRight(this.warningDone(), this.run(() => instant));
  }
  /**
   * Semantically blocks the current fiber until the clock time is equal to or
   * greater than the specified duration. Once the clock time is adjusted to
   * on or after the duration, the fiber will automatically be resumed.
   */
  sleep(durationInput) {
    const duration = Duration.decode(durationInput);
    return core.flatMap(core.deferredMake(), deferred => (0, Function_js_1.pipe)(ref.modify(this.clockState, data => {
      const end = data.instant + Duration.toMillis(duration);
      if (end > data.instant) {
        return [true, (0, exports.makeData)(data.instant, (0, Function_js_1.pipe)(data.sleeps, Chunk.prepend([end, deferred])))];
      }
      return [false, data];
    }), core.flatMap(shouldAwait => shouldAwait ? (0, Function_js_1.pipe)(this.warningStart(), core.zipRight(core.deferredAwait(deferred))) : (0, Function_js_1.pipe)(core.deferredSucceed(deferred, void 0), core.asUnit))));
  }
  /**
   * Returns a list of the times at which all queued effects are scheduled to
   * resume.
   */
  sleeps() {
    return core.map(ref.get(this.clockState), data => Chunk.map(data.sleeps, _ => _[0]));
  }
  /**
   * Increments the current clock time by the specified duration. Any effects
   * that were scheduled to occur on or before the new time will be run in
   * order.
   */
  adjust(durationInput) {
    const duration = Duration.decode(durationInput);
    return core.zipRight(this.warningDone(), this.run(n => n + Duration.toMillis(duration)));
  }
  /**
   * Increments the current clock time by the specified duration. Any effects
   * that were scheduled to occur on or before the new time will be run in
   * order.
   */
  adjustWith(durationInput) {
    const duration = Duration.decode(durationInput);
    return effect => fiberRuntime.zipLeftOptions(effect, this.adjust(duration), {
      concurrent: true
    });
  }
  /**
   * Returns a set of all fibers in this test.
   */
  supervisedFibers() {
    return this.annotations.supervisedFibers();
  }
  /**
   * Captures a "snapshot" of the identifier and status of all fibers in this
   * test other than the current fiber. Fails with the `Unit` value if any of
   * these fibers are not done or suspended. Note that because we cannot
   * synchronize on the status of multiple fibers at the same time this
   * snapshot may not be fully consistent.
   */
  freeze() {
    return core.flatMap(this.supervisedFibers(), fibers => (0, Function_js_1.pipe)(fibers, effect.reduce(HashMap.empty(), (map, fiber) => (0, Function_js_1.pipe)(fiber.status(), core.flatMap(status => {
      if (FiberStatus.isDone(status)) {
        return core.succeed(HashMap.set(map, fiber.id(), status));
      }
      if (FiberStatus.isSuspended(status)) {
        return core.succeed(HashMap.set(map, fiber.id(), status));
      }
      return core.fail(void 0);
    })))));
  }
  /**
   * Forks a fiber that will display a warning message if a test is using time
   * but is not advancing the `TestClock`.
   */
  warningStart() {
    return synchronized.updateSomeEffect(this.warningState, data => WarningData.isStart(data) ? Option.some((0, Function_js_1.pipe)(this.live.provide((0, Function_js_1.pipe)(effect.logWarning(warning), effect.delay(Duration.seconds(5)))), core.interruptible, fiberRuntime.fork, core.map(fiber => WarningData.pending(fiber)))) : Option.none());
  }
  /**
   * Cancels the warning message that is displayed if a test is using time but
   * is not advancing the `TestClock`.
   */
  warningDone() {
    return synchronized.updateSomeEffect(this.warningState, warningData => {
      if (WarningData.isStart(warningData)) {
        return Option.some(core.succeed(WarningData.done));
      }
      if (WarningData.isPending(warningData)) {
        return Option.some((0, Function_js_1.pipe)(core.interruptFiber(warningData.fiber), core.as(WarningData.done)));
      }
      return Option.none();
    });
  }
  /**
   * Returns whether all descendants of this fiber are done or suspended.
   */
  suspended() {
    return (0, Function_js_1.pipe)(this.freeze(), core.zip(this.live.provide((0, Function_js_1.pipe)(effect.sleep(Duration.millis(5)), core.zipRight(this.freeze())))), core.flatMap(([first, last]) => Equal.equals(first, last) ? core.succeed(first) : core.fail(void 0)));
  }
  /**
   * Polls until all descendants of this fiber are done or suspended.
   */
  awaitSuspended() {
    return (0, Function_js_1.pipe)(this.suspendedWarningStart(), core.zipRight((0, Function_js_1.pipe)(this.suspended(), core.zipWith((0, Function_js_1.pipe)(this.live.provide(effect.sleep(Duration.millis(10))), core.zipRight(this.suspended())), Equal.equals), effect.filterOrFail(Function_js_1.identity, Function_js_1.constVoid), effect.eventually)), core.zipRight(this.suspendedWarningDone()));
  }
  /**
   * Forks a fiber that will display a warning message if a test is advancing
   * the `TestClock` but a fiber is not suspending.
   */
  suspendedWarningStart() {
    return synchronized.updateSomeEffect(this.suspendedWarningState, suspendedWarningData => {
      if (SuspendedWarningData.isStart(suspendedWarningData)) {
        return Option.some((0, Function_js_1.pipe)(this.live.provide((0, Function_js_1.pipe)(effect.logWarning(suspendedWarning), core.zipRight(ref.set(this.suspendedWarningState, SuspendedWarningData.done)), effect.delay(Duration.seconds(5)))), core.interruptible, fiberRuntime.fork, core.map(fiber => SuspendedWarningData.pending(fiber))));
      }
      return Option.none();
    });
  }
  /**
   * Cancels the warning message that is displayed if a test is advancing the
   * `TestClock` but a fiber is not suspending.
   */
  suspendedWarningDone() {
    return synchronized.updateSomeEffect(this.suspendedWarningState, suspendedWarningData => {
      if (SuspendedWarningData.isPending(suspendedWarningData)) {
        return Option.some((0, Function_js_1.pipe)(core.interruptFiber(suspendedWarningData.fiber), core.as(SuspendedWarningData.start)));
      }
      return Option.none();
    });
  }
  /**
   * Runs all effects scheduled to occur on or before the specified instant,
   * which may depend on the current time, in order.
   */
  run(f) {
    return (0, Function_js_1.pipe)(this.awaitSuspended(), core.zipRight((0, Function_js_1.pipe)(ref.modify(this.clockState, data => {
      const end = f(data.instant);
      const sorted = (0, Function_js_1.pipe)(data.sleeps, Chunk.sort((0, Function_js_1.pipe)(number.Order, Order.mapInput(_ => _[0]))));
      if (Chunk.isNonEmpty(sorted)) {
        const [instant, deferred] = Chunk.headNonEmpty(sorted);
        if (instant <= end) {
          return [Option.some([end, deferred]), (0, exports.makeData)(instant, Chunk.tailNonEmpty(sorted))];
        }
      }
      return [Option.none(), (0, exports.makeData)(end, data.sleeps)];
    }), core.flatMap(option => {
      switch (option._tag) {
        case "None":
          {
            return core.unit;
          }
        case "Some":
          {
            const [end, deferred] = option.value;
            return (0, Function_js_1.pipe)(core.deferredSucceed(deferred, void 0), core.zipRight(core.yieldNow()), core.zipRight(this.run(() => end)));
          }
      }
    }))));
  }
}
exports.TestClockImpl = TestClockImpl;
/**
 * @since 2.0.0
 */
const live = data => layer.scoped(exports.TestClock, effect.gen(function* ($) {
  const live = yield* $(Live.TestLive);
  const annotations = yield* $(Annotations.TestAnnotations);
  const clockState = yield* $(core.sync(() => ref.unsafeMake(data)));
  const warningState = yield* $(circular.makeSynchronized(WarningData.start));
  const suspendedWarningState = yield* $(circular.makeSynchronized(SuspendedWarningData.start));
  const testClock = new TestClockImpl(clockState, live, annotations, warningState, suspendedWarningState);
  yield* $(fiberRuntime.withClockScoped(testClock));
  yield* $(fiberRuntime.addFinalizer(() => core.zipRight(testClock.warningDone(), testClock.suspendedWarningDone())));
  return testClock;
}));
exports.live = live;
/**
 * @since 2.0.0
 */
exports.defaultTestClock = /*#__PURE__*/(0, exports.live)( /*#__PURE__*/(0, exports.makeData)( /*#__PURE__*/new Date(0).getTime(), /*#__PURE__*/Chunk.empty()));
/**
 * Accesses a `TestClock` instance in the context and increments the time
 * by the specified duration, running any actions scheduled for on or before
 * the new time in order.
 *
 * @since 2.0.0
 */
const adjust = durationInput => {
  const duration = Duration.decode(durationInput);
  return (0, exports.testClockWith)(testClock => testClock.adjust(duration));
};
exports.adjust = adjust;
/**
 * @since 2.0.0
 */
exports.adjustWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, durationInput) => {
  const duration = Duration.decode(durationInput);
  return (0, exports.testClockWith)(testClock => testClock.adjustWith(duration)(effect));
});
/**
 * Accesses a `TestClock` instance in the context and saves the clock
 * state in an effect which, when run, will restore the `TestClock` to the
 * saved state.
 *
 * @since 2.0.0
 */
const save = () => (0, exports.testClockWith)(testClock => testClock.save());
exports.save = save;
/**
 * Accesses a `TestClock` instance in the context and sets the clock time
 * to the specified `Instant`, running any actions scheduled for on or before
 * the new time in order.
 *
 * @since 2.0.0
 */
const setTime = instant => (0, exports.testClockWith)(testClock => testClock.setTime(instant));
exports.setTime = setTime;
/**
 * Semantically blocks the current fiber until the clock time is equal to or
 * greater than the specified duration. Once the clock time is adjusted to
 * on or after the duration, the fiber will automatically be resumed.
 *
 * @since 2.0.0
 */
const sleep = durationInput => {
  const duration = Duration.decode(durationInput);
  return (0, exports.testClockWith)(testClock => testClock.sleep(duration));
};
exports.sleep = sleep;
/**
 * Accesses a `TestClock` instance in the context and returns a list of
 * times that effects are scheduled to run.
 *
 * @since 2.0.0
 */
const sleeps = () => (0, exports.testClockWith)(testClock => testClock.sleeps());
exports.sleeps = sleeps;
/**
 * Retrieves the `TestClock` service for this test.
 *
 * @since 2.0.0
 */
const testClock = () => (0, exports.testClockWith)(core.succeed);
exports.testClock = testClock;
/**
 * Retrieves the `TestClock` service for this test and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 */
const testClockWith = f => core.fiberRefGetWith(defaultServices.currentServices, services => f((0, Function_js_1.pipe)(services, Context.get(clock.clockTag))));
exports.testClockWith = testClockWith;
/**
 * Accesses the current time of a `TestClock` instance in the context in
 * milliseconds.
 *
 * @since 2.0.0
 */
exports.currentTimeMillis = /*#__PURE__*/(0, exports.testClockWith)(testClock => testClock.currentTimeMillis);
//# sourceMappingURL=TestClock.js.map