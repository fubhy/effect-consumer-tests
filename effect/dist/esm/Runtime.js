import * as internal from "./internal/runtime.js";
/**
 * Executes the effect using the provided Scheduler or using the global
 * Scheduler if not provided
 *
 * @since 2.0.0
 * @category execution
 */
export const runFork = internal.unsafeFork;
/**
 * Executes the effect synchronously returning the exit.
 *
 * This method is effectful and should only be invoked at the edges of your
 * program.
 *
 * @since 2.0.0
 * @category execution
 */
export const runSyncExit = internal.unsafeRunSyncExit;
/**
 * Executes the effect synchronously throwing in case of errors or async boundaries.
 *
 * This method is effectful and should only be invoked at the edges of your
 * program.
 *
 * @since 2.0.0
 * @category execution
 */
export const runSync = internal.unsafeRunSync;
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
export const runCallback = internal.unsafeRunCallback;
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
export const runPromise = internal.unsafeRunPromise;
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
export const runPromiseExit = internal.unsafeRunPromiseExit;
/**
 * @since 2.0.0
 * @category constructors
 */
export const defaultRuntime = internal.defaultRuntime;
/**
 * @since 2.0.0
 * @category constructors
 */
export const defaultRuntimeFlags = internal.defaultRuntimeFlags;
/**
 * @since 2.0.0
 * @category constructors
 */
export const make = internal.make;
/**
 * @since 2.0.0
 * @category symbols
 */
export const FiberFailureId = /*#__PURE__*/Symbol.for("effect/Runtime/FiberFailure");
/**
 * @since 2.0.0
 * @category symbols
 */
export const FiberFailureCauseId = internal.FiberFailureCauseId;
/**
 * @since 2.0.0
 * @category guards
 */
export const isAsyncFiberException = internal.isAsyncFiberException;
/**
 * @since 2.0.0
 * @category guards
 */
export const isFiberFailure = internal.isFiberFailure;
/**
 * @since 2.0.0
 * @category constructors
 */
export const makeFiberFailure = internal.fiberFailure;
//# sourceMappingURL=Runtime.js.map