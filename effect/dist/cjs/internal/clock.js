"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = exports.globalClockScheduler = exports.MAX_TIMER_MILLIS = exports.clockTag = exports.ClockTypeId = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Either = /*#__PURE__*/require("../Either.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const core = /*#__PURE__*/require("./core.js");
const timeout = /*#__PURE__*/require("./timeout.js");
/** @internal */
const ClockSymbolKey = "effect/Clock";
/** @internal */
exports.ClockTypeId = /*#__PURE__*/Symbol.for(ClockSymbolKey);
/** @internal */
exports.clockTag = /*#__PURE__*/Context.Tag(exports.ClockTypeId);
/** @internal */
exports.MAX_TIMER_MILLIS = 2 ** 31 - 1;
/** @internal */
exports.globalClockScheduler = {
  unsafeSchedule(task, duration) {
    const millis = Duration.toMillis(duration);
    // If the duration is greater than the value allowable by the JS timer
    // functions, treat the value as an infinite duration
    if (millis > exports.MAX_TIMER_MILLIS) {
      return Function_js_1.constFalse;
    }
    let completed = false;
    const handle = timeout.set(() => {
      completed = true;
      task();
    }, millis);
    return () => {
      timeout.clear(handle);
      return !completed;
    };
  }
};
const performanceNowNanos = /*#__PURE__*/function () {
  const bigint1e6 = /*#__PURE__*/BigInt(1000000);
  if (typeof performance === "undefined") {
    return () => BigInt(Date.now()) * bigint1e6;
  }
  const origin = "timeOrigin" in performance && typeof performance.timeOrigin === "number" ? /*#__PURE__*/BigInt( /*#__PURE__*/Math.round(performance.timeOrigin * 1000000)) : /*#__PURE__*/BigInt( /*#__PURE__*/Date.now()) * bigint1e6 - /*#__PURE__*/BigInt( /*#__PURE__*/Math.round( /*#__PURE__*/performance.now() * 1000000));
  return () => origin + BigInt(Math.round(performance.now() * 1000000));
}();
const processOrPerformanceNow = /*#__PURE__*/function () {
  const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : undefined;
  if (!processHrtime) {
    return performanceNowNanos;
  }
  const origin = /*#__PURE__*/performanceNowNanos() - /*#__PURE__*/processHrtime.bigint();
  return () => origin + processHrtime.bigint();
}();
/** @internal */
class ClockImpl {
  [exports.ClockTypeId] = exports.ClockTypeId;
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return processOrPerformanceNow();
  }
  currentTimeMillis = core.sync(() => this.unsafeCurrentTimeMillis());
  currentTimeNanos = core.sync(() => this.unsafeCurrentTimeNanos());
  scheduler() {
    return core.succeed(exports.globalClockScheduler);
  }
  sleep(duration) {
    return core.asyncEither(cb => {
      const canceler = exports.globalClockScheduler.unsafeSchedule(() => cb(core.unit), duration);
      return Either.left(core.asUnit(core.sync(canceler)));
    });
  }
}
/** @internal */
const make = () => new ClockImpl();
exports.make = make;
//# sourceMappingURL=clock.js.map