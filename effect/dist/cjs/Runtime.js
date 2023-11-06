"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeFiberFailure = exports.isFiberFailure = exports.isAsyncFiberException = exports.FiberFailureCauseId = exports.FiberFailureId = exports.make = exports.defaultRuntimeFlags = exports.defaultRuntime = exports.runPromiseExit = exports.runPromise = exports.runCallback = exports.runSync = exports.runSyncExit = exports.runFork = void 0;
const internal = /*#__PURE__*/require("./internal/runtime.js");
/**
 * Executes the effect using the provided Scheduler or using the global
 * Scheduler if not provided
 *
 * @since 2.0.0
 * @category execution
 */
exports.runFork = internal.unsafeFork;
/**
 * Executes the effect synchronously returning the exit.
 *
 * This method is effectful and should only be invoked at the edges of your
 * program.
 *
 * @since 2.0.0
 * @category execution
 */
exports.runSyncExit = internal.unsafeRunSyncExit;
/**
 * Executes the effect synchronously throwing in case of errors or async boundaries.
 *
 * This method is effectful and should only be invoked at the edges of your
 * program.
 *
 * @since 2.0.0
 * @category execution
 */
exports.runSync = internal.unsafeRunSync;
/**
 * Executes the effect asynchronously, eventually passing the exit value to
 * the specified callback.
 *
 * This method is effectful and should only be invoked at the edges of your
 * program.
 *
 * @since 2.0.0
 * @category execution
 */
exports.runCallback = internal.unsafeRunCallback;
/**
 * Runs the `Effect`, returning a JavaScript `Promise` that will be resolved
 * with the value of the effect once the effect has been executed, or will be
 * rejected with the first error or exception throw by the effect.
 *
 * This method is effectful and should only be used at the edges of your
 * program.
 *
 * @since 2.0.0
 * @category execution
 */
exports.runPromise = internal.unsafeRunPromise;
/**
 * Runs the `Effect`, returning a JavaScript `Promise` that will be resolved
 * with the `Exit` state of the effect once the effect has been executed.
 *
 * This method is effectful and should only be used at the edges of your
 * program.
 *
 * @since 2.0.0
 * @category execution
 */
exports.runPromiseExit = internal.unsafeRunPromiseExit;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.defaultRuntime = internal.defaultRuntime;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.defaultRuntimeFlags = internal.defaultRuntimeFlags;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FiberFailureId = /*#__PURE__*/Symbol.for("effect/Runtime/FiberFailure");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FiberFailureCauseId = internal.FiberFailureCauseId;
/**
 * @since 2.0.0
 * @category guards
 */
exports.isAsyncFiberException = internal.isAsyncFiberException;
/**
 * @since 2.0.0
 * @category guards
 */
exports.isFiberFailure = internal.isFiberFailure;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.makeFiberFailure = internal.fiberFailure;
//# sourceMappingURL=Runtime.js.map