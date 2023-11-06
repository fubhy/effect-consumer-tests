"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeDone = exports.unsafeMake = exports.sync = exports.succeed = exports.poll = exports.isDone = exports.interruptWith = exports.interrupt = exports.dieSync = exports.die = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.done = exports.completeWith = exports.complete = exports.await = exports.makeAs = exports.make = exports.DeferredTypeId = void 0;
const core = /*#__PURE__*/require("./internal/core.js");
const internal = /*#__PURE__*/require("./internal/deferred.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.DeferredTypeId = internal.DeferredTypeId;
/**
 * Creates a new `Deferred`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = core.deferredMake;
/**
 * Creates a new `Deferred` from the specified `FiberId`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeAs = core.deferredMakeAs;
const _await = core.deferredAwait;
exports.await = _await;
/**
 * Completes the deferred with the result of the specified effect. If the
 * deferred has already been completed, the method will produce false.
 *
 * Note that `Deferred.completeWith` will be much faster, so consider using
 * that if you do not need to memoize the result of the specified effect.
 *
 * @since 2.0.0
 * @category utils
 */
exports.complete = core.deferredComplete;
/**
 * Completes the deferred with the result of the specified effect. If the
 * deferred has already been completed, the method will produce false.
 *
 * @since 2.0.0
 * @category utils
 */
exports.completeWith = core.deferredCompleteWith;
/**
 * Exits the `Deferred` with the specified `Exit` value, which will be
 * propagated to all fibers waiting on the value of the `Deferred`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.done = core.deferredDone;
/**
 * Fails the `Deferred` with the specified error, which will be propagated to
 * all fibers waiting on the value of the `Deferred`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.fail = core.deferredFail;
/**
 * Fails the `Deferred` with the specified error, which will be propagated to
 * all fibers waiting on the value of the `Deferred`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.failSync = core.deferredFailSync;
/**
 * Fails the `Deferred` with the specified `Cause`, which will be propagated to
 * all fibers waiting on the value of the `Deferred`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.failCause = core.deferredFailCause;
/**
 * Fails the `Deferred` with the specified `Cause`, which will be propagated to
 * all fibers waiting on the value of the `Deferred`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.failCauseSync = core.deferredFailCauseSync;
/**
 * Kills the `Deferred` with the specified defect, which will be propagated to
 * all fibers waiting on the value of the `Deferred`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.die = core.deferredDie;
/**
 * Kills the `Deferred` with the specified defect, which will be propagated to
 * all fibers waiting on the value of the `Deferred`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.dieSync = core.deferredDieSync;
/**
 * Completes the `Deferred` with interruption. This will interrupt all fibers
 * waiting on the value of the `Deferred` with the `FiberId` of the fiber
 * calling this method.
 *
 * @since 2.0.0
 * @category utils
 */
exports.interrupt = core.deferredInterrupt;
/**
 * Completes the `Deferred` with interruption. This will interrupt all fibers
 * waiting on the value of the `Deferred` with the specified `FiberId`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.interruptWith = core.deferredInterruptWith;
/**
 * Returns `true` if this `Deferred` has already been completed with a value or
 * an error, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isDone = core.deferredIsDone;
/**
 * Returns a `Some<Effect<R, E, A>>` from the `Deferred` if this `Deferred` has
 * already been completed, `None` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.poll = core.deferredPoll;
/**
 * Completes the `Deferred` with the specified value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.succeed = core.deferredSucceed;
/**
 * Completes the `Deferred` with the specified lazily evaluated value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.sync = core.deferredSync;
/**
 * Unsafely creates a new `Deferred` from the specified `FiberId`.
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeMake = core.deferredUnsafeMake;
/**
 * Unsafely exits the `Deferred` with the specified `Exit` value, which will be
 * propagated to all fibers waiting on the value of the `Deferred`.
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeDone = core.deferredUnsafeDone;
//# sourceMappingURL=Deferred.js.map