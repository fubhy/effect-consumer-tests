import * as Context from "../Context.js";
import * as Duration from "../Duration.js";
import * as Either from "../Either.js";
import { constFalse } from "../Function.js";
import * as core from "./core.js";
import * as timeout from "./timeout.js";
/** @internal */
const ClockSymbolKey = "effect/Clock";
/** @internal */
export const ClockTypeId = /*#__PURE__*/Symbol.for(ClockSymbolKey);
/** @internal */
export const clockTag = /*#__PURE__*/Context.Tag(ClockTypeId);
/** @internal */
export const MAX_TIMER_MILLIS = 2 ** 31 - 1;
/** @internal */
export const globalClockScheduler = {
  unsafeSchedule(task, duration) {
    const millis = Duration.toMillis(duration);
    // If the duration is greater than the value allowable by the JS timer
    // functions, treat the value as an infinite duration
    if (millis > MAX_TIMER_MILLIS) {
      return constFalse;
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
  [ClockTypeId] = ClockTypeId;
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return processOrPerformanceNow();
  }
  currentTimeMillis = core.sync(() => this.unsafeCurrentTimeMillis());
  currentTimeNanos = core.sync(() => this.unsafeCurrentTimeNanos());
  scheduler() {
    return core.succeed(globalClockScheduler);
  }
  sleep(duration) {
    return core.asyncEither(cb => {
      const canceler = globalClockScheduler.unsafeSchedule(() => cb(core.unit), duration);
      return Either.left(core.asUnit(core.sync(canceler)));
    });
  }
}
/** @internal */
export const make = () => new ClockImpl();
//# sourceMappingURL=clock.js.map