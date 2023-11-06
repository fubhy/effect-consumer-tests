"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSuspended = exports.isRunning = exports.isDone = exports.isFiberStatus = exports.suspended = exports.running = exports.done = exports.FiberStatusTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/fiberStatus.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FiberStatusTypeId = internal.FiberStatusTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.done = internal.done;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.running = internal.running;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.suspended = internal.suspended;
/**
 * Returns `true` if the specified value is a `FiberStatus`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isFiberStatus = internal.isFiberStatus;
/**
 * Returns `true` if the specified `FiberStatus` is `Done`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isDone = internal.isDone;
/**
 * Returns `true` if the specified `FiberStatus` is `Running`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isRunning = internal.isRunning;
/**
 * Returns `true` if the specified `FiberStatus` is `Suspended`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isSuspended = internal.isSuspended;
//# sourceMappingURL=FiberStatus.js.map