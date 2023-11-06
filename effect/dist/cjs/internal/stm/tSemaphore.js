"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeMakeSemaphore = exports.withPermitsScoped = exports.withPermitScoped = exports.withPermits = exports.withPermit = exports.releaseN = exports.release = exports.available = exports.acquireN = exports.acquire = exports.make = exports.TSemaphoreTypeId = void 0;
const Cause = /*#__PURE__*/require("../../Cause.js");
const Effect = /*#__PURE__*/require("../../Effect.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const STM = /*#__PURE__*/require("../../STM.js");
const core = /*#__PURE__*/require("./core.js");
const tRef = /*#__PURE__*/require("./tRef.js");
/** @internal */
const TSemaphoreSymbolKey = "effect/TSemaphore";
/** @internal */
exports.TSemaphoreTypeId = /*#__PURE__*/Symbol.for(TSemaphoreSymbolKey);
/** @internal */
class TSemaphoreImpl {
  permits;
  [exports.TSemaphoreTypeId] = exports.TSemaphoreTypeId;
  constructor(permits) {
    this.permits = permits;
  }
}
/** @internal */
const make = permits => STM.map(tRef.make(permits), permits => new TSemaphoreImpl(permits));
exports.make = make;
/** @internal */
const acquire = self => (0, exports.acquireN)(self, 1);
exports.acquire = acquire;
/** @internal */
exports.acquireN = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => core.withSTMRuntime(driver => {
  if (n < 0) {
    throw Cause.IllegalArgumentException(`Unexpected negative value ${n} passed to Semaphore.acquireN`);
  }
  const value = tRef.unsafeGet(self.permits, driver.journal);
  if (value < n) {
    return STM.retry;
  } else {
    return STM.succeed(tRef.unsafeSet(self.permits, value - n, driver.journal));
  }
}));
/** @internal */
const available = self => tRef.get(self.permits);
exports.available = available;
/** @internal */
const release = self => (0, exports.releaseN)(self, 1);
exports.release = release;
/** @internal */
exports.releaseN = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => core.withSTMRuntime(driver => {
  if (n < 0) {
    throw Cause.IllegalArgumentException(`Unexpected negative value ${n} passed to Semaphore.releaseN`);
  }
  const current = tRef.unsafeGet(self.permits, driver.journal);
  return STM.succeed(tRef.unsafeSet(self.permits, current + n, driver.journal));
}));
/** @internal */
exports.withPermit = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, semaphore) => (0, exports.withPermits)(self, semaphore, 1));
/** @internal */
exports.withPermits = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, semaphore, permits) => Effect.uninterruptibleMask(restore => Effect.zipRight(restore(core.commit((0, exports.acquireN)(permits)(semaphore))), Effect.ensuring(self, core.commit((0, exports.releaseN)(permits)(semaphore))))));
/** @internal */
const withPermitScoped = self => (0, exports.withPermitsScoped)(self, 1);
exports.withPermitScoped = withPermitScoped;
/** @internal */
exports.withPermitsScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, permits) => Effect.acquireReleaseInterruptible(core.commit((0, exports.acquireN)(self, permits)), () => core.commit((0, exports.releaseN)(self, permits))));
/** @internal */
const unsafeMakeSemaphore = permits => {
  return new TSemaphoreImpl(new tRef.TRefImpl(permits));
};
exports.unsafeMakeSemaphore = unsafeMakeSemaphore;
//# sourceMappingURL=tSemaphore.js.map