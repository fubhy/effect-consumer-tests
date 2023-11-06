"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDone = exports.isContinue = exports.done = exports.continueWith = exports.continue = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/schedule/decision.js");
const _continue = internal._continue;
exports.continue = _continue;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.continueWith = internal.continueWith;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.done = internal.done;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isContinue = internal.isContinue;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isDone = internal.isDone;
//# sourceMappingURL=ScheduleDecision.js.map