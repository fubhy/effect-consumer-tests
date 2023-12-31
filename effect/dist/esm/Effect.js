import { dual, identity } from "./Function.js";
import * as effect from "./internal/core-effect.js";
import * as core from "./internal/core.js";
import * as defaultServices from "./internal/defaultServices.js";
import * as circular from "./internal/effect/circular.js";
import * as fiberRuntime from "./internal/fiberRuntime.js";
import * as layer from "./internal/layer.js";
import * as query from "./internal/query.js";
import * as _runtime from "./internal/runtime.js";
import * as _schedule from "./internal/schedule.js";
import * as Scheduler from "./Scheduler.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export const EffectTypeId = core.EffectTypeId;
// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * This function returns `true` if the specified value is an `Effect` value,
 * `false` otherwise.
 *
 * This function can be useful for checking the type of a value before
 * attempting to operate on it as an `Effect` value. For example, you could
 * use `isEffect` to check the type of a value before using it as an
 * argument to a function that expects an `Effect` value.
 *
 * @param u - The value to check for being an `Effect` value.
 *
 * @returns `true` if the specified value is an `Effect` value, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export const isEffect = core.isEffect;
// -------------------------------------------------------------------------------------
// caching
// -------------------------------------------------------------------------------------
/**
 * Returns an effect that, if evaluated, will return the cached result of this
 * effect. Cached results will expire after `timeToLive` duration.
 *
 * @since 2.0.0
 * @category caching
 */
export const cachedWithTTL = circular.cached;
/**
 * Returns an effect that, if evaluated, will return the cached result of this
 * effect. Cached results will expire after `timeToLive` duration. In
 * addition, returns an effect that can be used to invalidate the current
 * cached value before the `timeToLive` duration expires.
 *
 * @since 2.0.0
 * @category caching
 */
export const cachedInvalidateWithTTL = circular.cachedInvalidate;
/**
 * Returns an effect that, if evaluated, will return the lazily computed
 * result of this effect.
 *
 * @since 2.0.0
 * @category caching
 */
export const cached = effect.memoize;
/**
 * Returns a memoized version of the specified effectual function.
 *
 * @since 2.0.0
 * @category caching
 */
export const cachedFunction = circular.memoizeFunction;
/**
 * Returns an effect that will be executed at most once, even if it is
 * evaluated multiple times.
 *
 * @example
 * import * as Effect from "effect/Effect"
 * import * as Console from "effect/Console"
 *
 * const program = Effect.gen(function* (_) {
 *   const twice = Console.log("twice")
 *   yield* _(twice, Effect.repeatN(1))
 *   const once = yield* _(Console.log("once"), Effect.once)
 *   yield* _(once, Effect.repeatN(1))
 * })
 *
 * Effect.runFork(program)
 * // Output:
 * // twice
 * // twice
 * // once
 *
 * @since 2.0.0
 * @category caching
 */
export const once = effect.once;
// -------------------------------------------------------------------------------------
// collecting & elements
// -------------------------------------------------------------------------------------
/**
 * Runs all the provided effects in sequence respecting the structure provided in input.
 *
 * Supports multiple arguments, a single argument tuple / array or record / struct.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const all = fiberRuntime.all;
/**
 * Data-last variant of `Effect.all`.
 *
 * Runs all the provided effects in sequence respecting the structure provided in input.
 *
 * Supports multiple arguments, a single argument tuple / array or record / struct.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const allWith = fiberRuntime.allWith;
/**
 * Evaluate and run each effect in the structure and collect the results,
 * discarding results from failed effects.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const allSuccesses = fiberRuntime.allSuccesses;
/**
 * Drops all elements until the effectful predicate returns true.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const dropUntil = effect.dropUntil;
/**
 * Drops all elements so long as the predicate returns true.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const dropWhile = effect.dropWhile;
/**
 * Determines whether all elements of the `Collection<A>` satisfies the effectual
 * predicate `f`.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const every = effect.every;
/**
 * Determines whether any element of the `Iterable<A>` satisfies the effectual
 * predicate `f`.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const exists = fiberRuntime.exists;
/**
 * Filters the collection using the specified effectful predicate.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const filter = fiberRuntime.filter;
/**
 * Returns the first element that satisfies the effectful predicate.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const findFirst = effect.findFirst;
/**
 * This function takes an iterable of `Effect` values and returns a new
 * `Effect` value that represents the first `Effect` value in the iterable
 * that succeeds. If all of the `Effect` values in the iterable fail, then
 * the resulting `Effect` value will fail as well.
 *
 * This function is sequential, meaning that the `Effect` values in the
 * iterable will be executed in sequence, and the first one that succeeds
 * will determine the outcome of the resulting `Effect` value.
 *
 * @param effects - The iterable of `Effect` values to evaluate.
 *
 * @returns A new `Effect` value that represents the first successful
 * `Effect` value in the iterable, or a failed `Effect` value if all of the
 * `Effect` values in the iterable fail.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const firstSuccessOf = effect.firstSuccessOf;
/**
 * @since 2.0.0
 * @category collecting & elements
 */
export const forEach = fiberRuntime.forEachOptions;
/**
 * Returns a successful effect with the head of the collection if the collection
 * is non-empty, or fails with the error `None` if the collection is empty.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const head = effect.head;
/**
 * Merges an `Iterable<Effect<R, E, A>>` to a single effect, working
 * sequentially.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const mergeAll = fiberRuntime.mergeAll;
/**
 * Feeds elements of type `A` to a function `f` that returns an effect.
 * Collects all successes and failures in a tupled fashion.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const partition = fiberRuntime.partition;
/**
 * Folds an `Iterable<A>` using an effectual function f, working sequentially
 * from left to right.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const reduce = effect.reduce;
/**
 * Reduces an `Iterable<Effect<R, E, A>>` to a single effect.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const reduceEffect = fiberRuntime.reduceEffect;
/**
 * Folds an `Iterable<A>` using an effectual function f, working sequentially from left to right.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const reduceRight = effect.reduceRight;
/**
 * Folds over the elements in this chunk from the left, stopping the fold early
 * when the predicate is not satisfied.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const reduceWhile = effect.reduceWhile;
/**
 * Replicates the given effect `n` times.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const replicate = fiberRuntime.replicate;
/**
 * Performs this effect the specified number of times and collects the
 * results.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const replicateEffect = fiberRuntime.replicateEffect;
/**
 * Takes elements until the effectual predicate returns true.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const takeUntil = effect.takeUntil;
/**
 * Takes all elements so long as the effectual predicate returns true.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const takeWhile = effect.takeWhile;
/**
 * Feeds elements of type `A` to `f` and accumulates all errors in error
 * channel or successes in success channel.
 *
 * This combinator is lossy meaning that if there are errors all successes
 * will be lost. To retain all information please use `partition`.
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const validateAll = fiberRuntime.validateAll;
/**
 * Feeds elements of type `A` to `f` until it succeeds. Returns first success
 * or the accumulation of all errors.
 *
 * If `elements` is empty then `Effect.fail([])` is returned.
 *
 * @example
 * import * as Effect from "effect/Effect"
 * import * as Exit from "effect/Exit"
 *
 * const f = (n: number) => (n > 0 ? Effect.succeed(n) : Effect.fail(`${n} is negative`))
 *
 * assert.deepStrictEqual(Effect.runSyncExit(Effect.validateFirst([], f)), Exit.fail([]))
 * assert.deepStrictEqual(Effect.runSyncExit(Effect.validateFirst([1, 2], f)), Exit.succeed(1))
 * assert.deepStrictEqual(Effect.runSyncExit(Effect.validateFirst([1, -1], f)), Exit.succeed(1))
 * assert.deepStrictEqual(Effect.runSyncExit(Effect.validateFirst([-1, 2], f)), Exit.succeed(2))
 * assert.deepStrictEqual(Effect.runSyncExit(Effect.validateFirst([-1, -2], f)), Exit.fail(['-1 is negative', '-2 is negative']))
 *
 * @since 2.0.0
 * @category collecting & elements
 */
export const validateFirst = fiberRuntime.validateFirst;
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Imports an asynchronous side-effect into a pure `Effect` value.
 * The callback function `Effect<R, E, A> => void` must be called at most once.
 *
 * If an Effect is returned by the registration function, it will be executed
 * if the fiber executing the effect is interrupted.
 *
 * The registration function can also receive an `AbortSignal` if required for
 * interruption.
 *
 * The `FiberId` of the fiber that may complete the async callback may be
 * provided to allow for better diagnostics.
 *
 * @since 2.0.0
 * @category constructors
 */
export const async = core.async;
/**
 * Converts an asynchronous, callback-style API into an `Effect`, which will
 * be executed asynchronously.
 *
 * With this variant, the registration function may return a an `Effect`.
 *
 * @since 2.0.0
 * @category constructors
 */
export const asyncEffect = _runtime.asyncEffect;
/**
 * Imports an asynchronous effect into a pure `Effect` value, possibly returning
 * the value synchronously.
 *
 * If the register function returns a value synchronously, then the callback
 * function `Effect<R, E, A> => void` must not be called. Otherwise the callback
 * function must be called at most once.
 *
 * The `FiberId` of the fiber that may complete the async callback may be
 * provided to allow for better diagnostics.
 *
 * @since 2.0.0
 * @category constructors
 */
export const asyncOption = effect.asyncOption;
/**
 * Imports an asynchronous side-effect into an effect. It has the option of
 * returning the value synchronously, which is useful in cases where it cannot
 * be determined if the effect is synchronous or asynchronous until the register
 * is actually executed. It also has the option of returning a canceler,
 * which will be used by the runtime to cancel the asynchronous effect if the fiber
 * executing the effect is interrupted.
 *
 * If the register function returns a value synchronously, then the callback
 * function `Effect<R, E, A> => void` must not be called. Otherwise the callback
 * function must be called at most once.
 *
 * The `FiberId` of the fiber that may complete the async callback may be
 * provided to allow for better diagnostics.
 *
 * @since 2.0.0
 * @category constructors
 */
export const asyncEither = core.asyncEither;
/**
 * @since 2.0.0
 * @category constructors
 */
export const fail = core.fail;
/**
 * @since 2.0.0
 * @category constructors
 */
export const failSync = core.failSync;
/**
 * @since 2.0.0
 * @category constructors
 */
export const failCause = core.failCause;
/**
 * @since 2.0.0
 * @category constructors
 */
export const failCauseSync = core.failCauseSync;
/**
 * @since 2.0.0
 * @category constructors
 */
export const die = core.die;
/**
 * Returns an effect that dies with a `RuntimeException` having the specified
 * text message. This method can be used for terminating a fiber because a
 * defect has been detected in the code.
 *
 * @since 2.0.0
 * @category constructors
 */
export const dieMessage = core.dieMessage;
/**
 * @since 2.0.0
 * @category constructors
 */
export const dieSync = core.dieSync;
/**
 * @since 2.0.0
 * @category constructors
 */
export const gen = effect.gen;
/**
 * Returns a effect that will never produce anything. The moral equivalent of
 * `while(true) {}`, only without the wasted CPU cycles.
 *
 * @since 2.0.0
 * @category constructors
 */
export const never = core.never;
/**
 * Requires the option produced by this value to be `None`.
 *
 * @since 2.0.0
 * @category constructors
 */
export const none = effect.none;
/**
 * Like `tryPromise` but produces a defect in case of errors.
 *
 * An optional `AbortSignal` can be provided to allow for interruption of the
 * wrapped Promise api.
 *
 * @since 2.0.0
 * @category constructors
 */
export const promise = effect.promise;
/**
 * @since 2.0.0
 * @category constructors
 */
export const succeed = core.succeed;
/**
 * Returns an effect which succeeds with `None`.
 *
 * @since 2.0.0
 * @category constructors
 */
export const succeedNone = effect.succeedNone;
/**
 * Returns an effect which succeeds with the value wrapped in a `Some`.
 *
 * @since 2.0.0
 * @category constructors
 */
export const succeedSome = effect.succeedSome;
/**
 * @since 2.0.0
 * @category constructors
 */
export const suspend = core.suspend;
/**
 * @since 2.0.0
 * @category constructors
 */
export const sync = core.sync;
/**
 * @since 2.0.0
 * @category constructors
 */
export const unit = core.unit;
/**
 * @since 2.0.0
 * @category constructors
 */
export const yieldNow = core.yieldNow;
// -------------------------------------------------------------------------------------
// error handling
// -------------------------------------------------------------------------------------
const _catch = effect._catch;
export {
/**
 * Recovers from specified error.
 *
 * @since 2.0.0
 * @category error handling
 */
_catch as catch };
/**
 * Recovers from all recoverable errors.
 *
 * **Note**: that `Effect.catchAll` will not recover from unrecoverable defects. To
 * recover from both recoverable and unrecoverable errors use
 * `Effect.catchAllCause`.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchAll = core.catchAll;
/**
 * Recovers from both recoverable and unrecoverable errors.
 *
 * See `absorb`, `sandbox`, `mapErrorCause` for other functions that can
 * recover from defects.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchAllCause = core.catchAllCause;
/**
 * Recovers from all defects with provided function.
 *
 * **WARNING**: There is no sensible way to recover from defects. This
 * method should be used only at the boundary between Effect and an external
 * system, to transmit information on a defect for diagnostic or explanatory
 * purposes.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchAllDefect = effect.catchAllDefect;
/**
 * Recovers from errors that match the given predicate.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchIf = core.catchIf;
/**
 * Recovers from some or all of the error cases.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchSome = core.catchSome;
/**
 * Recovers from some or all of the error cases with provided cause.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchSomeCause = effect.catchSomeCause;
/**
 * Recovers from some or all of the defects with provided partial function.
 *
 * **WARNING**: There is no sensible way to recover from defects. This
 * method should be used only at the boundary between Effect and an external
 * system, to transmit information on a defect for diagnostic or explanatory
 * purposes.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchSomeDefect = effect.catchSomeDefect;
/**
 * Recovers from the specified tagged error.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchTag = effect.catchTag;
/**
 * Recovers from the specified tagged errors.
 *
 * @since 2.0.0
 * @category error handling
 */
export const catchTags = effect.catchTags;
/**
 * Returns an effect that succeeds with the cause of failure of this effect,
 * or `Cause.empty` if the effect did succeed.
 *
 * @since 2.0.0
 * @category error handling
 */
export const cause = effect.cause;
/**
 * Returns an effect that ignores errors and runs repeatedly until it
 * eventually succeeds.
 *
 * @since 2.0.0
 * @category error handling
 */
export const eventually = effect.eventually;
/**
 * Returns a new effect that ignores the success or failure of this effect.
 *
 * @since 2.0.0
 * @category error handling
 */
export const ignore = effect.ignore;
/**
 * Returns a new effect that ignores the success or failure of this effect,
 * but which also logs failures at the Debug level, just in case the failure
 * turns out to be important.
 *
 * @since 2.0.0
 * @category error handling
 */
export const ignoreLogged = effect.ignoreLogged;
/**
 * Exposes all parallel errors in a single call.
 *
 * @since 2.0.0
 * @category error handling
 */
export const parallelErrors = effect.parallelErrors;
/**
 * Exposes the full `Cause` of failure for the specified effect.
 *
 * @since 2.0.0
 * @category error handling
 */
export const sandbox = effect.sandbox;
/**
 * Retries with the specified retry policy. Retries are done following the
 * failure of the original `io` (up to a fixed maximum with `once` or `recurs`
 * for example), so that that `io.retry(Schedule.once)` means "execute `io`
 * and in case of failure, try again once".
 *
 * @since 2.0.0
 * @category error handling
 */
export const retry = _schedule.retry_Effect;
/**
 * Retries this effect the specified number of times.
 *
 * @since 2.0.0
 * @category error handling
 */
export const retryN = _schedule.retryN_Effect;
/**
 * Retries with the specified schedule, until it fails, and then both the
 * value produced by the schedule together with the last error are passed to
 * the recovery function.
 *
 * @since 2.0.0
 * @category error handling
 */
export const retryOrElse = _schedule.retryOrElse_Effect;
/**
 * Retries this effect until its error satisfies the specified predicate.
 *
 * @since 2.0.0
 * @category error handling
 */
export const retryUntil = _schedule.retryUntil_Effect;
/**
 * Retries this effect until its error satisfies the specified effectful
 * predicate.
 *
 * @since 2.0.0
 * @category error handling
 */
export const retryUntilEffect = _schedule.retryUntilEffect_Effect;
/**
 * Retries this effect while its error satisfies the specified predicate.
 *
 * @since 2.0.0
 * @category error handling
 */
export const retryWhile = _schedule.retryWhile_Effect;
/**
 * Retries this effect while its error satisfies the specified effectful
 * predicate.
 *
 * @since 2.0.0
 * @category error handling
 */
export const retryWhileEffect = _schedule.retryWhileEffect_Effect;
const try_ = effect.try_;
export {
/**
 * Imports a synchronous side-effect into a pure `Effect` value, translating any
 * thrown exceptions into typed failed effects creating with `Effect.fail`.
 *
 * @since 2.0.0
 * @category error handling
 */
try_ as try };
/**
 * Returns an effect whose success is mapped by the specified side effecting
 * `try` function, translating any promise rejections into typed failed effects
 * via the `catch` function.
 *
 * @since 2.0.0
 * @category error handling
 */
export const tryMap = effect.tryMap;
/**
 * Returns an effect whose success is mapped by the specified side effecting
 * `try` function, translating any promise rejections into typed failed effects
 * via the `catch` function.
 *
 * An optional `AbortSignal` can be provided to allow for interruption of the
 * wrapped Promise api.
 *
 * @since 2.0.0
 * @category error handling
 */
export const tryMapPromise = effect.tryMapPromise;
/**
 * Create an `Effect` that when executed will construct `promise` and wait for
 * its result, errors will produce failure as `unknown`.
 *
 * An optional `AbortSignal` can be provided to allow for interruption of the
 * wrapped Promise api.
 *
 * @since 2.0.0
 * @category error handling
 */
export const tryPromise = effect.tryPromise;
/**
 * The inverse operation `sandbox(effect)`
 *
 * Terminates with exceptions on the `Left` side of the `Either` error, if it
 * exists. Otherwise extracts the contained `Effect<R, E, A>`
 *
 * @since 2.0.0
 * @category error handling
 */
export const unsandbox = effect.unsandbox;
// -------------------------------------------------------------------------------------
// interuption
// -------------------------------------------------------------------------------------
/**
 * This function checks if any fibers are attempting to interrupt the current
 * fiber, and if so, performs self-interruption.
 *
 * Note that this allows for interruption to occur in uninterruptible regions.
 *
 * @returns A new `Effect` value that represents the check for interruption
 * and the potential self-interruption of the current fiber.
 *
 * @since 2.0.0
 * @category interruption
 */
export const allowInterrupt = effect.allowInterrupt;
/**
 * Checks the interrupt status, and produces the effect returned by the
 * specified callback.
 *
 * @since 2.0.0
 * @category interruption
 */
export const checkInterruptible = core.checkInterruptible;
/**
 * Returns an effect whose interruption will be disconnected from the
 * fiber's own interruption, being performed in the background without
 * slowing down the fiber's interruption.
 *
 * This method is useful to create "fast interrupting" effects. For
 * example, if you call this on a bracketed effect, then even if the
 * effect is "stuck" in acquire or release, its interruption will return
 * immediately, while the acquire / release are performed in the
 * background.
 *
 * See timeout and race for other applications.
 *
 * @since 2.0.0
 * @category interruption
 */
export const disconnect = fiberRuntime.disconnect;
/**
 * @since 2.0.0
 * @category interruption
 */
export const interrupt = core.interrupt;
/**
 * @since 2.0.0
 * @category interruption
 */
export const interruptWith = core.interruptWith;
/**
 * @since 2.0.0
 * @category interruption
 */
export const interruptible = core.interruptible;
/**
 * @since 2.0.0
 * @category interruption
 */
export const interruptibleMask = core.interruptibleMask;
/**
 * @since 2.0.0
 * @category interruption
 */
export const onInterrupt = core.onInterrupt;
/**
 * @since 2.0.0
 * @category interruption
 */
export const uninterruptible = core.uninterruptible;
/**
 * @since 2.0.0
 * @category interruption
 */
export const uninterruptibleMask = core.uninterruptibleMask;
// -------------------------------------------------------------------------------------
// mapping
// -------------------------------------------------------------------------------------
/**
 * This function maps the success value of an `Effect` value to a specified
 * constant value.
 *
 * @param value - The constant value that the success value of the `Effect`
 * value will be mapped to.
 * @param self - The `Effect` value whose success value will be mapped to the
 * specified constant value.
 *
 * @returns A new `Effect` value that represents the mapping of the success
 * value of the original `Effect` value to the specified constant value.
 *
 * @since 2.0.0
 * @category mapping
 */
export const as = core.as;
/**
 * This function maps the success value of an `Effect` value to a `Some` value
 * in an `Option` value. If the original `Effect` value fails, the returned
 * `Effect` value will also fail.
 *
 * @param self - The `Effect` value whose success value will be mapped to a
 * `Some` value in an `Option` value.
 *
 * @returns A new `Effect` value that represents the mapping of the success
 * value of the original `Effect` value to a `Some` value in an `Option`
 * value. The returned `Effect` value may fail if the original `Effect` value
 * fails.
 *
 * @category mapping
 * @since 2.0.0
 */
export const asSome = effect.asSome;
/**
 * This function maps the error value of an `Effect` value to a `Some` value
 * in an `Option` value. If the original `Effect` value succeeds, the returned
 * `Effect` value will also succeed.
 *
 * @param self - The `Effect` value whose error value will be mapped to a
 * `Some` value in an `Option` value.
 *
 * @returns A new `Effect` value that represents the mapping of the error
 * value of the original `Effect` value to a `Some` value in an `Option`
 * value. The returned `Effect` value may succeed if the original `Effect`
 * value succeeds.
 *
 * @category mapping
 * @since 2.0.0
 */
export const asSomeError = effect.asSomeError;
/**
 * This function maps the success value of an `Effect` value to `void`. If the
 * original `Effect` value succeeds, the returned `Effect` value will also
 * succeed. If the original `Effect` value fails, the returned `Effect` value
 * will fail with the same error.
 *
 * @param self - The `Effect` value whose success value will be mapped to `void`.
 *
 * @returns A new `Effect` value that represents the mapping of the success
 * value of the original `Effect` value to `void`.
 *
 * @since 2.0.0
 * @category mapping
 */
export const asUnit = core.asUnit;
/**
 * Returns an effect that swaps the error/success cases. This allows you to
 * use all methods on the error channel, possibly before flipping back.
 *
 * @since 2.0.0
 * @category mapping
 */
export const flip = core.flip;
/**
 * Swaps the error/value parameters, applies the function `f` and flips the
 * parameters back
 *
 * @since 2.0.0
 * @category mapping
 */
export const flipWith = effect.flipWith;
/**
 * @since 2.0.0
 * @category mapping
 */
export const map = core.map;
/**
 * Statefully and effectfully maps over the elements of this chunk to produce
 * new elements.
 *
 * @since 2.0.0
 * @category mapping
 */
export const mapAccum = effect.mapAccum;
/**
 * Returns an effect whose failure and success channels have been mapped by
 * the specified `onFailure` and `onSuccess` functions.
 *
 * @since 2.0.0
 * @category mapping
 */
export const mapBoth = core.mapBoth;
/**
 * Returns an effect with its error channel mapped using the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
export const mapError = core.mapError;
/**
 * Returns an effect with its full cause of failure mapped using the specified
 * function. This can be used to transform errors while preserving the
 * original structure of `Cause`.
 *
 * See `absorb`, `sandbox`, `catchAllCause` for other functions for dealing
 * with defects.
 *
 * @since 2.0.0
 * @category mapping
 */
export const mapErrorCause = effect.mapErrorCause;
/**
 * Returns a new effect where the error channel has been merged into the
 * success channel to their common combined type.
 *
 * @since 2.0.0
 * @category mapping
 */
export const merge = effect.merge;
/**
 * Returns a new effect where boolean value of this effect is negated.
 *
 * @since 2.0.0
 * @category mapping
 */
export const negate = effect.negate;
// -------------------------------------------------------------------------------------
// scoping, resources & finalization
// -------------------------------------------------------------------------------------
/**
 * This function constructs a scoped resource from an `acquire` and `release`
 * `Effect` value.
 *
 * If the `acquire` `Effect` value successfully completes execution, then the
 * `release` `Effect` value will be added to the finalizers associated with the
 * scope of this `Effect` value, and it is guaranteed to be run when the scope
 * is closed.
 *
 * The `acquire` and `release` `Effect` values will be run uninterruptibly.
 * Additionally, the `release` `Effect` value may depend on the `Exit` value
 * specified when the scope is closed.
 *
 * @param acquire - The `Effect` value that acquires the resource.
 * @param release - The `Effect` value that releases the resource.
 *
 * @returns A new `Effect` value that represents the scoped resource.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const acquireRelease = fiberRuntime.acquireRelease;
/**
 * This function constructs a scoped resource from an `acquire` and `release`
 * `Effect` value.
 *
 * If the `acquire` `Effect` value successfully completes execution, then the
 * `release` `Effect` value will be added to the finalizers associated with the
 * scope of this `Effect` value, and it is guaranteed to be run when the scope
 * is closed.
 *
 * The `acquire` `Effect` values will be run interruptibly.
 * The `release` `Effect` values will be run uninterruptibly.
 *
 * Additionally, the `release` `Effect` value may depend on the `Exit` value
 * specified when the scope is closed.
 *
 * @param acquire - The `Effect` value that acquires the resource.
 * @param release - The `Effect` value that releases the resource.
 *
 * @returns A new `Effect` value that represents the scoped resource.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const acquireReleaseInterruptible = fiberRuntime.acquireReleaseInterruptible;
/**
 * This function is used to ensure that an `Effect` value that represents the
 * acquisition of a resource (for example, opening a file, launching a thread,
 * etc.) will not be interrupted, and that the resource will always be released
 * when the `Effect` value completes execution.
 *
 * `acquireUseRelease` does the following:
 *
 *   1. Ensures that the `Effect` value that acquires the resource will not be
 *      interrupted. Note that acquisition may still fail due to internal
 *      reasons (such as an uncaught exception).
 *   2. Ensures that the `release` `Effect` value will not be interrupted,
 *      and will be executed as long as the acquisition `Effect` value
 *      successfully acquires the resource.
 *
 * During the time period between the acquisition and release of the resource,
 * the `use` `Effect` value will be executed.
 *
 * If the `release` `Effect` value fails, then the entire `Effect` value will
 * fail, even if the `use` `Effect` value succeeds. If this fail-fast behavior
 * is not desired, errors produced by the `release` `Effect` value can be caught
 * and ignored.
 *
 * @param acquire - The `Effect` value that acquires the resource.
 * @param use - The `Effect` value that is executed between the acquisition
 * and release of the resource.
 * @param release - The `Effect` value that releases the resource.
 *
 * @returns A new `Effect` value that represents the acquisition, use, and
 * release of the resource.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const acquireUseRelease = core.acquireUseRelease;
/**
 * This function adds a finalizer to the scope of the calling `Effect` value.
 * The finalizer is guaranteed to be run when the scope is closed, and it may
 * depend on the `Exit` value that the scope is closed with.
 *
 * @param finalizer - The finalizer to add to the scope of the calling
 * `Effect` value. This function must take an `Exit` value as its parameter,
 * and return a new `Effect` value.
 *
 * @returns A new `Effect` value that represents the addition of the finalizer
 * to the scope of the calling `Effect` value.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const addFinalizer = fiberRuntime.addFinalizer;
/**
 * Returns an effect that, if this effect _starts_ execution, then the
 * specified `finalizer` is guaranteed to be executed, whether this effect
 * succeeds, fails, or is interrupted.
 *
 * For use cases that need access to the effect's result, see `onExit`.
 *
 * Finalizers offer very powerful guarantees, but they are low-level, and
 * should generally not be used for releasing resources. For higher-level
 * logic built on `ensuring`, see the `acquireRelease` family of methods.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const ensuring = fiberRuntime.ensuring;
/**
 * Runs the specified effect if this effect fails, providing the error to the
 * effect if it exists. The provided effect will not be interrupted.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const onError = core.onError;
/**
 * Ensures that a cleanup functions runs, whether this effect succeeds, fails,
 * or is interrupted.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const onExit = core.onExit;
/**
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const parallelFinalizers = fiberRuntime.parallelFinalizers;
/**
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const finalizersMask = fiberRuntime.finalizersMask;
/**
 * Returns a new scoped workflow that runs finalizers added to the scope of
 * this workflow sequentially in the reverse of the order in which they were
 * added. Note that finalizers are run sequentially by default so this only
 * has meaning if used within a scope where finalizers are being run in
 * parallel.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const sequentialFinalizers = fiberRuntime.sequentialFinalizers;
/**
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const scope = fiberRuntime.scope;
/**
 * Accesses the current scope and uses it to perform the specified effect.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const scopeWith = fiberRuntime.scopeWith;
/**
 * Scopes all resources uses in this workflow to the lifetime of the workflow,
 * ensuring that their finalizers are run as soon as this workflow completes
 * execution, whether by success, failure, or interruption.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const scoped = fiberRuntime.scopedEffect;
/**
 * Scopes all resources acquired by `resource` to the lifetime of `use`
 * without effecting the scope of any resources acquired by `use`.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const using = fiberRuntime.using;
/**
 * Returns a new scoped workflow that returns the result of this workflow as
 * well as a finalizer that can be run to close the scope of this workflow.
 *
 * @since 2.0.0
 * @category scoping, resources & finalization
 */
export const withEarlyRelease = fiberRuntime.withEarlyRelease;
// -------------------------------------------------------------------------------------
// supervision & fibers
// -------------------------------------------------------------------------------------
/**
 * Returns a new effect that will not succeed with its value before first
 * waiting for the end of all child fibers forked by the effect.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const awaitAllChildren = circular.awaitAllChildren;
/**
 * Returns a new workflow that will not supervise any fibers forked by this
 * workflow.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const daemonChildren = fiberRuntime.daemonChildren;
/**
 * Constructs an effect with information about the current `Fiber`.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const descriptor = effect.descriptor;
/**
 * Constructs an effect based on information about the current `Fiber`.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const descriptorWith = effect.descriptorWith;
/**
 * Returns a new workflow that executes this one and captures the changes in
 * `FiberRef` values.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const diffFiberRefs = effect.diffFiberRefs;
/**
 * Acts on the children of this fiber (collected into a single fiber),
 * guaranteeing the specified callback will be invoked, whether or not this
 * effect succeeds.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const ensuringChild = circular.ensuringChild;
/**
 * Acts on the children of this fiber, guaranteeing the specified callback
 * will be invoked, whether or not this effect succeeds.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const ensuringChildren = circular.ensuringChildren;
/**
 * @since 2.0.0
 * @category supervision & fibers
 */
export const fiberId = core.fiberId;
/**
 * @since 2.0.0
 * @category supervision & fibers
 */
export const fiberIdWith = core.fiberIdWith;
/**
 * Returns an effect that forks this effect into its own separate fiber,
 * returning the fiber immediately, without waiting for it to begin executing
 * the effect.
 *
 * You can use the `fork` method whenever you want to execute an effect in a
 * new fiber, concurrently and without "blocking" the fiber executing other
 * effects. Using fibers can be tricky, so instead of using this method
 * directly, consider other higher-level methods, such as `raceWith`,
 * `zipPar`, and so forth.
 *
 * The fiber returned by this method has methods to interrupt the fiber and to
 * wait for it to finish executing the effect. See `Fiber` for more
 * information.
 *
 * Whenever you use this method to launch a new fiber, the new fiber is
 * attached to the parent fiber's scope. This means when the parent fiber
 * terminates, the child fiber will be terminated as well, ensuring that no
 * fibers leak. This behavior is called "auto supervision", and if this
 * behavior is not desired, you may use the `forkDaemon` or `forkIn` methods.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const fork = fiberRuntime.fork;
/**
 * Forks the effect into a new fiber attached to the global scope. Because the
 * new fiber is attached to the global scope, when the fiber executing the
 * returned effect terminates, the forked fiber will continue running.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const forkDaemon = fiberRuntime.forkDaemon;
/**
 * Returns an effect that forks all of the specified values, and returns a
 * composite fiber that produces a list of their results, in order.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const forkAll = circular.forkAll;
/**
 * Forks the effect in the specified scope. The fiber will be interrupted
 * when the scope is closed.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const forkIn = circular.forkIn;
/**
 * Forks the fiber in a `Scope`, interrupting it when the scope is closed.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const forkScoped = circular.forkScoped;
/**
 * Like fork but handles an error with the provided handler.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const forkWithErrorHandler = fiberRuntime.forkWithErrorHandler;
/**
 * Creates an `Effect` value that represents the exit value of the specified
 * fiber.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const fromFiber = circular.fromFiber;
/**
 * Creates an `Effect` value that represents the exit value of the specified
 * fiber.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const fromFiberEffect = circular.fromFiberEffect;
/**
 * Returns an effect with the behavior of this one, but where all child fibers
 * forked in the effect are reported to the specified supervisor.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const supervised = circular.supervised;
/**
 * Transplants specified effects so that when those effects fork other
 * effects, the forked effects will be governed by the scope of the fiber that
 * executes this effect.
 *
 * This can be used to "graft" deep grandchildren onto a higher-level scope,
 * effectively extending their lifespans into the parent scope.
 *
 * @since 2.0.0
 * @category supervision & fibers
 */
export const transplant = core.transplant;
/**
 * @since 2.0.0
 * @category supervision & fibers
 */
export const withConcurrency = core.withConcurrency;
// ---------------------------------------------------------------------------------------
// scheduler
// ---------------------------------------------------------------------------------------
/**
 * Sets the provided scheduler for usage in the wrapped effect
 *
 * @since 2.0.0
 * @category scheduler
 */
export const withScheduler = Scheduler.withScheduler;
/**
 * Sets the scheduling priority used when yielding
 *
 * @since 2.0.0
 * @category utils
 */
export const withSchedulingPriority = core.withSchedulingPriority;
/**
 * Sets the maximum number of operations before yield by the default schedulers
 *
 * @since 2.0.0
 * @category utils
 */
export const withMaxOpsBeforeYield = core.withMaxOpsBeforeYield;
// ---------------------------------------------------------------------------------------
// clock
// ---------------------------------------------------------------------------------------
/**
 * Retreives the `Clock` service from the context
 *
 * @since 2.0.0
 * @category clock
 */
export const clock = effect.clock;
/**
 * Retreives the `Clock` service from the context and provides it to the
 * specified effectful function.
 *
 * @since 2.0.0
 * @category clock
 */
export const clockWith = effect.clockWith;
/**
 * Sets the implementation of the clock service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 * @category constructors
 */
export const withClockScoped = fiberRuntime.withClockScoped;
/**
 * Executes the specified workflow with the specified implementation of the
 * clock service.
 *
 * @since 2.0.0
 * @category clock
 */
export const withClock = defaultServices.withClock;
// ---------------------------------------------------------------------------------------
// delays & timeouts
// ---------------------------------------------------------------------------------------
/**
 * Returns an effect that is delayed from this effect by the specified
 * `Duration`.
 *
 * @since 2.0.0
 * @category delays & timeouts
 */
export const delay = effect.delay;
/**
 * Returns an effect that suspends for the specified duration. This method is
 * asynchronous, and does not actually block the fiber executing the effect.
 *
 * @since 2.0.0
 * @category delays & timeouts
 */
export const sleep = effect.sleep;
/**
 * Returns a new effect that executes this one and times the execution.
 *
 * @since 2.0.0
 * @category delays & timeouts
 */
export const timed = effect.timed;
/**
 * A more powerful variation of `timed` that allows specifying the clock.
 *
 * @since 2.0.0
 * @category delays & timeouts
 */
export const timedWith = effect.timedWith;
/**
 * Returns an effect that will timeout this effect, returning `None` if the
 * timeout elapses before the effect has produced a value; and returning
 * `Some` of the produced value otherwise.
 *
 * If the timeout elapses without producing a value, the running effect will
 * be safely interrupted.
 *
 * WARNING: The effect returned by this method will not itself return until
 * the underlying effect is actually interrupted. This leads to more
 * predictable resource utilization. If early return is desired, then instead
 * of using `effect.timeout(d)`, use `effect.disconnect.timeout(d)`, which
 * first disconnects the effect's interruption signal before performing the
 * timeout, resulting in earliest possible return, before an underlying effect
 * has been successfully interrupted.
 *
 * @since 2.0.0
 * @category delays & timeouts
 */
export const timeout = circular.timeout;
/**
 * The same as `timeout`, but instead of producing a `None` in the event of
 * timeout, it will produce the specified error.
 *
 * @since 2.0.0
 * @category delays & timeouts
 */
export const timeoutFail = circular.timeoutFail;
/**
 * The same as `timeout`, but instead of producing a `None` in the event of
 * timeout, it will produce the specified failure.
 *
 * @since 2.0.0
 * @category delays & timeouts
 */
export const timeoutFailCause = circular.timeoutFailCause;
/**
 * Returns an effect that will timeout this effect, returning either the
 * default value if the timeout elapses before the effect has produced a
 * value or returning the result of applying the function `onSuccess` to the
 * success value of the effect.
 *
 * If the timeout elapses without producing a value, the running effect will
 * be safely interrupted.
 *
 * @since 2.0.0
 * @category delays & timeouts
 */
export const timeoutTo = circular.timeoutTo;
// -------------------------------------------------------------------------------------
// config
// -------------------------------------------------------------------------------------
/**
 * Uses the default config provider to load the specified config, or fail with
 * an error of type Config.Error.
 *
 * @since 2.0.0
 * @category config
 */
export const config = defaultServices.config;
/**
 * Retrieves the default config provider, and passes it to the specified
 * function, which may return an effect that uses the provider to perform some
 * work or compute some value.
 *
 * @since 2.0.0
 * @category config
 */
export const configProviderWith = defaultServices.configProviderWith;
/**
 * Executes the specified workflow with the specified configuration provider.
 *
 * @since 2.0.0
 * @category config
 */
export const withConfigProvider = defaultServices.withConfigProvider;
/**
 * Sets the configuration provider to the specified value and restores it to its original value
 * when the scope is closed.
 *
 * @since 2.0.0
 * @category config
 */
export const withConfigProviderScoped = fiberRuntime.withConfigProviderScoped;
// -------------------------------------------------------------------------------------
// context
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 * @category context
 */
export const context = core.context;
/**
 * Accesses the context of the effect.
 *
 * @since 2.0.0
 * @category context
 */
export const contextWith = effect.contextWith;
/**
 * Effectually accesses the context of the effect.
 *
 * @since 2.0.0
 * @category context
 */
export const contextWithEffect = core.contextWithEffect;
/**
 * Provides some of the context required to run this effect,
 * leaving the remainder `R0`.
 *
 * @since 2.0.0
 * @category context
 */
export const mapInputContext = core.mapInputContext;
/**
 * Splits the context into two parts, providing one part using the
 * specified layer/context/runtime and leaving the remainder `R0`
 *
 * @since 2.0.0
 * @category context
 */
export const provide = layer.effect_provide;
/**
 * Provides the effect with the single service it requires. If the effect
 * requires more than one service use `provideContext` instead.
 *
 * @since 2.0.0
 * @category context
 */
export const provideService = effect.provideService;
/**
 * Provides the effect with the single service it requires. If the effect
 * requires more than one service use `provideContext` instead.
 *
 * @since 2.0.0
 * @category context
 */
export const provideServiceEffect = effect.provideServiceEffect;
/**
 * @since 2.0.0
 * @category context
 */
export const serviceFunction = effect.serviceFunction;
/**
 * @since 2.0.0
 * @category context
 */
export const serviceFunctionEffect = effect.serviceFunctionEffect;
/**
 * @since 2.0.0
 * @category context
 */
export const serviceFunctions = effect.serviceFunctions;
/**
 * @since 2.0.0
 * @category context
 */
export const serviceConstants = effect.serviceConstants;
/**
 * @since 2.0.0
 * @category context
 */
export const serviceMembers = effect.serviceMembers;
/**
 * @since 2.0.0
 * @category context
 */
export const serviceOption = effect.serviceOption;
/**
 * Updates the service with the required service entry.
 *
 * @since 2.0.0
 * @category context
 */
export const updateService = effect.updateService;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 * @category do notation
 */
export const Do = effect.Do;
/**
 * Binds an effectful value in a `do` scope
 *
 * @since 2.0.0
 * @category do notation
 */
export const bind = effect.bind;
/**
 * @category do notation
 * @since 2.0.0
 */
export const bindTo = effect.bindTo;
const let_ = effect.bindValue;
export {
/**
 * Like bind for values
 *
 * @since 2.0.0
 * @category do notation
 */
let_ as let };
// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------
/**
 * Returns an effect whose failure and success have been lifted into an
 * `Either`. The resulting effect cannot fail, because the failure case has
 * been exposed as part of the `Either` success case.
 *
 * This method is useful for recovering from effects that may fail.
 *
 * The error parameter of the returned `Effect` is `never`, since it is
 * guaranteed the effect does not model failure.
 *
 * @since 2.0.0
 * @category conversions
 */
export const either = core.either;
/**
 * @since 2.0.0
 * @category conversions
 */
export const exit = core.exit;
/**
 * @since 2.0.0
 * @category conversions
 */
export const intoDeferred = core.intoDeferred;
/**
 * Executes this effect, skipping the error but returning optionally the
 * success.
 *
 * @since 2.0.0
 * @category conversions
 */
export const option = effect.option;
// -------------------------------------------------------------------------------------
// filtering & conditionals
// -------------------------------------------------------------------------------------
const if_ = core.if_;
export {
/**
 * Runs `onTrue` if the result of `self` is `true` and `onFalse` otherwise.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
if_ as if };
/**
 * Filter the specified effect with the provided function, dying with specified
 * defect if the predicate fails.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const filterOrDie = effect.filterOrDie;
/**
 * Filter the specified effect with the provided function, dying with specified
 * message if the predicate fails.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const filterOrDieMessage = effect.filterOrDieMessage;
/**
 * Filters the specified effect with the provided function returning the value
 * of the effect if it is successful, otherwise returns the value of `orElse`.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const filterOrElse = effect.filterOrElse;
/**
 * Filter the specified effect with the provided function, failing with specified
 * error if the predicate fails.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const filterOrFail = effect.filterOrFail;
/**
 * The moral equivalent of `if (!p) exp`.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const unless = effect.unless;
/**
 * The moral equivalent of `if (!p) exp` when `p` has side-effects.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const unlessEffect = effect.unlessEffect;
/**
 * The moral equivalent of `if (p) exp`.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const when = effect.when;
/**
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const whenEffect = core.whenEffect;
/**
 * Executes this workflow when value of the specified `FiberRef` satisfies the
 * predicate.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const whenFiberRef = effect.whenFiberRef;
/**
 * Executes this workflow when the value of the `Ref` satisfies the predicate.
 *
 * @since 2.0.0
 * @category filtering & conditionals
 */
export const whenRef = effect.whenRef;
// -------------------------------------------------------------------------------------
// sequencing
// -------------------------------------------------------------------------------------
/**
 * This function is a pipeable operator that maps over an `Effect` value,
 * flattening the result of the mapping function into a new `Effect` value.
 *
 * @param f - The mapping function to apply to the `Effect` value.
 * This function must return another `Effect` value.
 *
 * @returns A new `Effect` value that is the result of flattening the
 * mapped `Effect` value.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const flatMap = core.flatMap;
/**
 * @since 2.0.0
 * @category sequencing
 */
export const flatten = core.flatten;
/**
 * Returns an effect that races this effect with all the specified effects,
 * yielding the value of the first effect to succeed with a value. Losers of
 * the race will be interrupted immediately
 *
 * @since 2.0.0
 * @category sequencing
 */
export const raceAll = fiberRuntime.raceAll;
/**
 * Returns an effect that races this effect with the specified effect,
 * returning the first successful `A` from the faster side. If one effect
 * succeeds, the other will be interrupted. If neither succeeds, then the
 * effect will fail with some error.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const race = fiberRuntime.race;
/**
 * Returns an effect that races this effect with the specified effect,
 * yielding the first result to complete, whether by success or failure. If
 * neither effect completes, then the composed effect will not complete.
 *
 * WARNING: The raced effect will safely interrupt the "loser", but will not
 * resume until the loser has been cleanly terminated. If early return is
 * desired, then instead of performing `l raceFirst r`, perform
 * `l.disconnect raceFirst r.disconnect`, which disconnects left and right
 * interrupt signal, allowing a fast return, with interruption performed
 * in the background.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const raceFirst = circular.raceFirst;
/**
 * Returns an effect that races this effect with the specified effect, calling
 * the specified finisher as soon as one result or the other has been computed.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const raceWith = fiberRuntime.raceWith;
/**
 * Summarizes a effect by computing some value before and after execution, and
 * then combining the values to produce a summary, together with the result of
 * execution.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const summarized = effect.summarized;
/**
 * @since 2.0.0
 * @category sequencing
 */
export const tap = core.tap;
/**
 * Returns an effect that effectfully "peeks" at the failure or success of
 * this effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const tapBoth = effect.tapBoth;
/**
 * Returns an effect that effectually "peeks" at the defect of this effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const tapDefect = effect.tapDefect;
/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const tapError = effect.tapError;
/**
 * Returns an effect that effectfully "peeks" at the specific tagged failure of this effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const tapErrorTag = effect.tapErrorTag;
/**
 * Returns an effect that effectually "peeks" at the cause of the failure of
 * this effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
export const tapErrorCause = effect.tapErrorCause;
// -------------------------------------------------------------------------------------
// repetition / recursion
// -------------------------------------------------------------------------------------
/**
 * Repeats this effect forever (until the first error).
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const forever = effect.forever;
/**
 * The `Effect.iterate` function allows you to iterate with an effectful operation. It uses an effectful `body` operation to change the state during each iteration and continues the iteration as long as the `while` function evaluates to `true`:
 *
 * ```ts
 * Effect.iterate(initial, options: { while, body })
 * ```
 *
 * We can think of `Effect.iterate` as equivalent to a `while` loop in JavaScript:
 *
 * ```ts
 * let result = initial
 *
 * while (options.while(result)) {
 *   result = options.body(result)
 * }
 *
 * return result
 * ```
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const iterate = effect.iterate;
/**
 * The `Effect.loop` function allows you to repeatedly change the state based on an `step` function until a condition given by the `while` function is evaluated to `true`:
 *
 * ```ts
 * Effect.loop(initial, options: { while, step, body })
 * ```
 *
 * It collects all intermediate states in an array and returns it as the final result.
 *
 * We can think of Effect.loop as equivalent to a while loop in JavaScript:
 *
 * ```ts
 * let state = initial
 * const result = []
 *
 * while (options.while(state)) {
 *   result.push(options.body(state))
 *   state = options.step(state)
 * }
 *
 * return result
 * ```
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const loop = effect.loop;
/**
 * Returns a new effect that repeats this effect according to the specified
 * schedule or until the first failure. Scheduled recurrences are in addition
 * to the first execution, so that `io.repeat(Schedule.once)` yields an effect
 * that executes `io`, and then if that succeeds, executes `io` an additional
 * time.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const repeat = _schedule.repeat_Effect;
/**
 * Returns a new effect that repeats this effect the specified number of times
 * or until the first failure. Repeats are in addition to the first execution,
 * so that `io.repeatN(1)` yields an effect that executes `io`, and then if
 * that succeeds, executes `io` an additional time.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const repeatN = effect.repeatN;
/**
 * Returns a new effect that repeats this effect according to the specified
 * schedule or until the first failure, at which point, the failure value and
 * schedule output are passed to the specified handler.
 *
 * Scheduled recurrences are in addition to the first execution, so that
 * `pipe(effect, Effect.repeat(Schedule.once()))` yields an effect that executes
 * `effect`, and then if that succeeds, executes `effect` an additional time.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const repeatOrElse = _schedule.repeatOrElse_Effect;
/**
 * Repeats this effect until its value satisfies the specified predicate or
 * until the first failure.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const repeatUntil = _schedule.repeatUntil_Effect;
/**
 * Repeats this effect until its value satisfies the specified effectful
 * predicate or until the first failure.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const repeatUntilEffect = _schedule.repeatUntilEffect_Effect;
/**
 * Repeats this effect while its value satisfies the specified effectful
 * predicate or until the first failure.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const repeatWhile = _schedule.repeatWhile_Effect;
/**
 * Repeats this effect while its value satisfies the specified effectful
 * predicate or until the first failure.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const repeatWhileEffect = _schedule.repeatWhileEffect_Effect;
/**
 * Runs this effect according to the specified schedule.
 *
 * See `scheduleFrom` for a variant that allows the schedule's decision to
 * depend on the result of this effect.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const schedule = _schedule.schedule_Effect;
/**
 * Runs this effect according to the specified schedule in a new fiber
 * attached to the current scope.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const scheduleForked = circular.scheduleForked;
/**
 * Runs this effect according to the specified schedule starting from the
 * specified input value.
 *
 * @since 2.0.0
 * @category repetition / recursion
 */
export const scheduleFrom = _schedule.scheduleFrom_Effect;
/**
 * @since 2.0.0
 * @category repetition / recursion
 */
export const whileLoop = core.whileLoop;
// -------------------------------------------------------------------------------------
// fiber refs
// -------------------------------------------------------------------------------------
/**
 * Returns a collection of all `FiberRef` values for the fiber running this
 * effect.
 *
 * @since 2.0.0
 * @category fiber refs
 */
export const getFiberRefs = effect.fiberRefs;
/**
 * Inherits values from all `FiberRef` instances into current fiber.
 *
 * @since 2.0.0
 * @category fiber refs
 */
export const inheritFiberRefs = effect.inheritFiberRefs;
/**
 * @since 2.0.0
 * @category fiber refs
 */
export const locally = core.fiberRefLocally;
/**
 * @since 2.0.0
 * @category fiber refs
 */
export const locallyWith = core.fiberRefLocallyWith;
/**
 * @since 2.0.0
 * @category fiber refs
 */
export const locallyScoped = fiberRuntime.fiberRefLocallyScoped;
/**
 * @since 2.0.0
 * @category fiber refs
 */
export const locallyScopedWith = fiberRuntime.fiberRefLocallyScopedWith;
/**
 * Applies the specified changes to the `FiberRef` values for the fiber
 * running this workflow.
 *
 * @since 2.0.0
 * @category fiber refs
 */
export const patchFiberRefs = effect.patchFiberRefs;
/**
 * Sets the `FiberRef` values for the fiber running this effect to the values
 * in the specified collection of `FiberRef` values.
 *
 * @since 2.0.0
 * @category fiber refs
 */
export const setFiberRefs = effect.setFiberRefs;
/**
 * Updates the `FiberRef` values for the fiber running this effect using the
 * specified function.
 *
 * @since 2.0.0
 * @category fiber refs
 */
export const updateFiberRefs = effect.updateFiberRefs;
// -------------------------------------------------------------------------------------
// getters & folding
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if this effect is a failure, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters & folding
 */
export const isFailure = effect.isFailure;
/**
 * Returns `true` if this effect is a success, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters & folding
 */
export const isSuccess = effect.isSuccess;
/**
 * Folds over the failure value or the success value to yield an effect that
 * does not fail, but succeeds with the value returned by the left or right
 * function passed to `match`.
 *
 * @since 2.0.0
 * @category getters & folding
 */
export const match = effect.match;
/**
 * @since 2.0.0
 * @category getters & folding
 */
export const matchCause = core.matchCause;
/**
 * @since 2.0.0
 * @category getters & folding
 */
export const matchCauseEffect = core.matchCauseEffect;
/**
 * @since 2.0.0
 * @category getters & folding
 */
export const matchEffect = core.matchEffect;
// -------------------------------------------------------------------------------------
// logging
// -------------------------------------------------------------------------------------
/**
 * Logs the specified message or cause at the current log level.
 *
 * You can set the current log level using `FiberRef.currentLogLevel`.
 *
 * @since 2.0.0
 * @category logging
 */
export const log = effect.log;
/**
 * Logs the specified message or cause at the Trace log level.
 *
 * @since 2.0.0
 * @category logging
 */
export const logTrace = effect.logTrace;
/**
 * Logs the specified message or cause at the Debug log level.
 *
 * @since 2.0.0
 * @category logging
 */
export const logDebug = effect.logDebug;
/**
 * Logs the specified message or cause at the Info log level.
 *
 * @since 2.0.0
 * @category logging
 */
export const logInfo = effect.logInfo;
/**
 * Logs the specified message or cause at the Warning log level.
 *
 * @since 2.0.0
 * @category logging
 */
export const logWarning = effect.logWarning;
/**
 * Logs the specified message or cause at the Error log level.
 *
 * @since 2.0.0
 * @category logging
 */
export const logError = effect.logError;
/**
 * Logs the specified message or cause at the Fatal log level.
 *
 * @since 2.0.0
 * @category logging
 */
export const logFatal = effect.logFatal;
/**
 * Adjusts the label for the current logging span.
 *
 * @since 2.0.0
 * @category logging
 */
export const withLogSpan = effect.withLogSpan;
/**
 * Annotates each log in this effect with the specified log annotation.
 *
 * @since 2.0.0
 * @category logging
 */
export const annotateLogs = effect.annotateLogs;
/**
 * Retrieves the log annotations associated with the current scope.
 *
 * @since 2.0.0
 * @category logging
 */
export const logAnnotations = effect.logAnnotations;
/**
 * Decides wether child fibers will report or not unhandled errors via the logger
 *
 * @since 2.0.0
 * @category logging
 */
export const withUnhandledErrorLogLevel = core.withUnhandledErrorLogLevel;
// -------------------------------------------------------------------------------------
// alternatives
// -------------------------------------------------------------------------------------
/**
 * Translates effect failure into death of the fiber, making all failures
 * unchecked and not a part of the type of the effect.
 *
 * @since 2.0.0
 * @category alternatives
 */
export const orDie = core.orDie;
/**
 * Keeps none of the errors, and terminates the fiber with them, using the
 * specified function to convert the `E` into a `Throwable`.
 *
 * @since 2.0.0
 * @category alternatives
 */
export const orDieWith = core.orDieWith;
/**
 * Executes this effect and returns its value, if it succeeds, but otherwise
 * executes the specified effect.
 *
 * @since 2.0.0
 * @category alternatives
 */
export const orElse = core.orElse;
/**
 * Executes this effect and returns its value, if it succeeds, but otherwise
 * fails with the specified error.
 *
 * @since 2.0.0
 * @category alternatives
 */
export const orElseFail = effect.orElseFail;
/**
 * Executes this effect and returns its value, if it succeeds, but
 * otherwise succeeds with the specified value.
 *
 * @since 2.0.0
 * @category alternatives
 */
export const orElseSucceed = effect.orElseSucceed;
// -------------------------------------------------------------------------------------
// random
// -------------------------------------------------------------------------------------
/**
 * Retreives the `Random` service from the context.
 *
 * @since 2.0.0
 * @category random
 */
export const random = effect.random;
/**
 * Retreives the `Random` service from the context and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 * @category random
 */
export const randomWith = defaultServices.randomWith;
// -------------------------------------------------------------------------------------
// runtime
// -------------------------------------------------------------------------------------
/**
 * Returns an effect that accesses the runtime, which can be used to
 * (unsafely) execute tasks. This is useful for integration with legacy code
 * that must call back into Effect code.
 *
 * @since 2.0.0
 * @category runtime
 */
export const runtime = _runtime.runtime;
/**
 * Retrieves an effect that succeeds with the current runtime flags, which
 * govern behavior and features of the runtime system.
 *
 * @since 2.0.0
 * @category runtime
 */
export const getRuntimeFlags = core.runtimeFlags;
/**
 * @since 2.0.0
 * @category runtime
 */
export const patchRuntimeFlags = core.updateRuntimeFlags;
/**
 * @since 2.0.0
 * @category runtime
 */
export const withRuntimeFlagsPatch = core.withRuntimeFlags;
/**
 * @since 2.0.0
 * @category runtime
 */
export const withRuntimeFlagsPatchScoped = fiberRuntime.withRuntimeFlagsScoped;
// -------------------------------------------------------------------------------------
// metrics
// -------------------------------------------------------------------------------------
/**
 * Tags each metric in this effect with the specific tag.
 *
 * @since 2.0.0
 * @category metrics
 */
export const tagMetrics = effect.tagMetrics;
/**
 * Tags each metric in this effect with the specific tag.
 *
 * @since 2.0.0
 * @category metrics
 */
export const labelMetrics = effect.labelMetrics;
/**
 * Tags each metric in this effect with the specific tag.
 *
 * @since 2.0.0
 * @category metrics
 */
export const labelMetricsSet = effect.labelMetricsSet;
/**
 * Tags each metric in a scope with a the specific tag.
 *
 * @since 2.0.0
 * @category metrics
 */
export const tagMetricsScoped = fiberRuntime.tagMetricsScoped;
/**
 * Tags each metric in a scope with a the specific tag.
 *
 * @since 2.0.0
 * @category metrics
 */
export const labelMetricsScoped = fiberRuntime.labelMetricsScoped;
/**
 * Tags each metric in a scope with a the specific tag.
 *
 * @since 2.0.0
 * @category metrics
 */
export const labelMetricsScopedSet = fiberRuntime.labelMetricsScopedSet;
/**
 * Retrieves the metric labels associated with the current scope.
 *
 * @since 2.0.0
 * @category metrics
 */
export const metricLabels = core.metricLabels;
/**
 * @since 2.0.0
 * @category metrics
 */
export const withMetric = effect.withMetric;
// -------------------------------------------------------------------------------------
// unify
// -------------------------------------------------------------------------------------
/**
 * Used to unify functions that would otherwise return `Effect<A, B, C> | Effect<D, E, F>`
 *
 * @category unify
 * @since 2.0.0
 */
export const unifiedFn = core.unified;
/**
 * Used to unify effects that would otherwise be `Effect<A, B, C> | Effect<D, E, F>`
 *
 * @category unify
 * @since 2.0.0
 */
export const unified = identity;
/**
 * Unsafely creates a new Semaphore
 *
 * @since 2.0.0
 * @category semaphore
 */
export const unsafeMakeSemaphore = circular.unsafeMakeSemaphore;
/**
 * Creates a new Semaphore
 *
 * @since 2.0.0
 * @category semaphore
 */
export const makeSemaphore = circular.makeSemaphore;
// -------------------------------------------------------------------------------------
// execution
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 * @category execution
 */
export const runFork = _runtime.unsafeForkEffect;
/**
 * @since 2.0.0
 * @category execution
 */
export const runCallback = _runtime.unsafeRunEffect;
/**
 * Runs an `Effect` workflow, returning a `Promise` which resolves with the
 * result of the workflow or rejects with an error.
 *
 * @since 2.0.0
 * @category execution
 */
export const runPromise = _runtime.unsafeRunPromiseEffect;
/**
 * Runs an `Effect` workflow, returning a `Promise` which resolves with the
 * `Exit` value of the workflow.
 *
 * @since 2.0.0
 * @category execution
 */
export const runPromiseExit = _runtime.unsafeRunPromiseExitEffect;
/**
 * @since 2.0.0
 * @category execution
 */
export const runSync = _runtime.unsafeRunSyncEffect;
/**
 * @since 2.0.0
 * @category execution
 */
export const runSyncExit = _runtime.unsafeRunSyncExitEffect;
// -------------------------------------------------------------------------------------
// zipping
// -------------------------------------------------------------------------------------
/**
 * Sequentially zips the this result with the specified result. Combines both
 * `Cause`s when both effects fail.
 *
 * @since 2.0.0
 * @category zipping
 */
export const validate = fiberRuntime.validate;
/**
 * Sequentially zips this effect with the specified effect using the specified
 * combiner function. Combines the causes in case both effect fail.
 *
 * @since 2.0.0
 * @category zipping
 */
export const validateWith = fiberRuntime.validateWith;
/**
 * @since 2.0.0
 * @category zipping
 */
export const zip = fiberRuntime.zipOptions;
/**
 * @since 2.0.0
 * @category zipping
 */
export const zipLeft = fiberRuntime.zipLeftOptions;
/**
 * @since 2.0.0
 * @category zipping
 */
export const zipRight = fiberRuntime.zipRightOptions;
/**
 * @since 2.0.0
 * @category zipping
 */
export const zipWith = fiberRuntime.zipWithOptions;
// -------------------------------------------------------------------------------------
// applicatives
// -------------------------------------------------------------------------------------
/**
 * @category combining
 * @since 2.0.0
 */
export const ap = /*#__PURE__*/dual(2, (self, that) => zipWith(self, that, (f, a) => f(a)));
// -------------------------------------------------------------------------------------
// requests & batching
// -------------------------------------------------------------------------------------
/**
 * @category requests & batching
 * @since 2.0.0
 */
export const blocked = core.blocked;
/**
 * @category requests & batching
 * @since 2.0.0
 */
export const runRequestBlock = core.runRequestBlock;
/**
 * @category requests & batching
 * @since 2.0.0
 */
export const step = core.step;
/**
 * @category requests & batching
 * @since 2.0.0
 */
export const flatMapStep = core.flatMapStep;
/**
 * @since 2.0.0
 * @category requests & batching
 */
export const request = query.fromRequest;
/**
 * @since 2.0.0
 * @category requests & batching
 */
export const cacheRequestResult = query.cacheRequest;
/**
 * @since 2.0.0
 * @category requests & batching
 */
export const withRequestBatching = core.withRequestBatching;
/**
 * @since 2.0.0
 * @category requests & batching
 */
export const withRequestCaching = query.withRequestCaching;
/**
 * @since 2.0.0
 * @category requests & batching
 */
export const withRequestCache = query.withRequestCache;
// -------------------------------------------------------------------------------------
// tracing
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 * @category tracing
 */
export const tracer = effect.tracer;
/**
 * @since 2.0.0
 * @category tracing
 */
export const tracerWith = defaultServices.tracerWith;
/**
 * @since 2.0.0
 * @category tracing
 */
export const withTracer = defaultServices.withTracer;
/**
 * @since 2.0.0
 * @category tracing
 */
export const withTracerScoped = fiberRuntime.withTracerScoped;
/**
 * @since 2.0.0
 * @category tracing
 */
export const withTracerTiming = core.withTracerTiming;
/**
 * Adds an annotation to each span in this effect.
 *
 * @since 2.0.0
 * @category tracing
 */
export const annotateSpans = effect.annotateSpans;
/**
 * Adds an annotation to the current span if available
 *
 * @since 2.0.0
 * @category tracing
 */
export const annotateCurrentSpan = effect.annotateCurrentSpan;
/**
 * @since 2.0.0
 * @category tracing
 */
export const currentSpan = effect.currentSpan;
/**
 * @since 2.0.0
 * @category tracing
 */
export const currentParentSpan = effect.currentParentSpan;
/**
 * @since 2.0.0
 * @category tracing
 */
export const spanAnnotations = effect.spanAnnotations;
/**
 * @since 2.0.0
 * @category tracing
 */
export const spanLinks = effect.spanLinks;
/**
 * For all spans in this effect, add a link with the provided span.
 *
 * @since 2.0.0
 * @category tracing
 */
export const linkSpans = effect.linkSpans;
/**
 * Create a new span for tracing.
 *
 * @since 2.0.0
 * @category tracing
 */
export const makeSpan = effect.makeSpan;
/**
 * Create a new span for tracing, and automatically close it when the Scope
 * finalizes.
 *
 * The span is not added to the current span stack, so no child spans will be
 * created for it.
 *
 * @since 2.0.0
 * @category tracing
 */
export const makeSpanScoped = fiberRuntime.makeSpanScoped;
/**
 * Create a new span for tracing, and automatically close it when the effect
 * completes.
 *
 * The span is not added to the current span stack, so no child spans will be
 * created for it.
 *
 * @since 2.0.0
 * @category tracing
 */
export const useSpan = effect.useSpan;
/**
 * Wraps the effect with a new span for tracing.
 *
 * @since 2.0.0
 * @category tracing
 */
export const withSpan = effect.withSpan;
/**
 * Wraps the effect with a new span for tracing.
 *
 * The span is ended when the Scope is finalized.
 *
 * @since 2.0.0
 * @category tracing
 */
export const withSpanScoped = fiberRuntime.withSpanScoped;
/**
 * Adds the provided span to the current span stack.
 *
 * @since 2.0.0
 * @category tracing
 */
export const withParentSpan = effect.withParentSpan;
// -------------------------------------------------------------------------------------
// optionality
// -------------------------------------------------------------------------------------
/**
 * Returns an effect that errors with `NoSuchElementException` if the value is
 * null or undefined, otherwise succeeds with the value.
 *
 * @since 2.0.0
 * @category optionality
 */
export const fromNullable = effect.fromNullable;
/**
 * Wraps the success value of this effect with `Option.some`, and maps
 * `Cause.NoSuchElementException` to `Option.none`.
 *
 * @since 2.0.0
 * @category optionality
 */
export const optionFromOptional = effect.optionFromOptional;
//# sourceMappingURL=Effect.js.map