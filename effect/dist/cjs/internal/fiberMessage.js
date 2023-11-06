"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yieldNow = exports.resume = exports.stateful = exports.interruptSignal = exports.OP_YIELD_NOW = exports.OP_RESUME = exports.OP_STATEFUL = exports.OP_INTERRUPT_SIGNAL = void 0;
/** @internal */
exports.OP_INTERRUPT_SIGNAL = "InterruptSignal";
/** @internal */
exports.OP_STATEFUL = "Stateful";
/** @internal */
exports.OP_RESUME = "Resume";
/** @internal */
exports.OP_YIELD_NOW = "YieldNow";
/** @internal */
const interruptSignal = cause => ({
  _tag: exports.OP_INTERRUPT_SIGNAL,
  cause
});
exports.interruptSignal = interruptSignal;
/** @internal */
const stateful = onFiber => ({
  _tag: exports.OP_STATEFUL,
  onFiber
});
exports.stateful = stateful;
/** @internal */
const resume = effect => ({
  _tag: exports.OP_RESUME,
  effect
});
exports.resume = resume;
/** @internal */
const yieldNow = () => ({
  _tag: exports.OP_YIELD_NOW
});
exports.yieldNow = yieldNow;
//# sourceMappingURL=fiberMessage.js.map