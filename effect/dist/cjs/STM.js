"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gen = exports.fromOption = exports.fromEither = exports.forEach = exports.matchSTM = exports.match = exports.flipWith = exports.flip = exports.flatten = exports.flatMap = exports.filterOrFail = exports.filterOrElse = exports.filterOrDieMessage = exports.filterOrDie = exports.filterNot = exports.filter = exports.fiberId = exports.failSync = exports.fail = exports.exists = exports.every = exports.eventually = exports.ensuring = exports.either = exports.dieSync = exports.dieMessage = exports.die = exports.mapInputContext = exports.contextWithSTM = exports.contextWith = exports.context = exports.cond = exports.commitEither = exports.commit = exports.collectSTM = exports.collect = exports.check = exports.catchTags = exports.catchTag = exports.catchSome = exports.catchAll = exports.attempt = exports.asUnit = exports.asSomeError = exports.asSome = exports.as = exports.all = exports.acquireUseRelease = exports.isSTM = exports.STMTypeId = void 0;
exports.succeedSome = exports.succeedNone = exports.succeed = exports.some = exports.retryWhile = exports.retryUntil = exports.retry = exports.replicateSTMDiscard = exports.replicateSTM = exports.replicate = exports.repeatWhile = exports.repeatUntil = exports.rejectSTM = exports.reject = exports.refineOrDieWith = exports.refineOrDie = exports.reduceRight = exports.reduceAll = exports.reduce = exports.provideServiceSTM = exports.provideService = exports.provideSomeContext = exports.provideContext = exports.partition = exports.orTry = exports.orElseSucceed = exports.orElseOptional = exports.orElseFail = exports.orElseEither = exports.orElse = exports.orDieWith = exports.orDie = exports.option = exports.none = exports.negate = exports.mergeAll = exports.merge = exports.mapError = exports.mapBoth = exports.mapAttempt = exports.map = exports.loop = exports.iterate = exports.isSuccess = exports.isFailure = exports.interruptAs = exports.interrupt = exports.ignore = exports.if = exports.head = void 0;
exports.bindTo = exports.let = exports.bind = exports.Do = exports.firstSuccessOf = exports.zipWith = exports.zipRight = exports.zipLeft = exports.zip = exports.whenSTM = exports.when = exports.validateFirst = exports.validateAll = exports.unit = exports.unsome = exports.unlessSTM = exports.unless = exports.try = exports.tapError = exports.tapBoth = exports.tap = exports.sync = exports.suspend = exports.summarized = void 0;
/**
 * @since 2.0.0
 */
const Cause = /*#__PURE__*/require("./Cause.js");
const Chunk = /*#__PURE__*/require("./Chunk.js");
const core = /*#__PURE__*/require("./internal/stm/core.js");
const stm = /*#__PURE__*/require("./internal/stm/stm.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.STMTypeId = core.STMTypeId;
/**
 * Returns `true` if the provided value is an `STM`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isSTM = core.isSTM;
/**
 * Treats the specified `acquire` transaction as the acquisition of a
 * resource. The `acquire` transaction will be executed interruptibly. If it
 * is a success and is committed the specified `release` workflow will be
 * executed uninterruptibly as soon as the `use` workflow completes execution.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.acquireUseRelease = stm.acquireUseRelease;
/**
 * Runs all the provided transactional effects in sequence respecting the
 * structure provided in input.
 *
 * Supports multiple arguments, a single argument tuple / array or record /
 * struct.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.all = stm.all;
/**
 * Maps the success value of this effect to the specified constant value.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.as = stm.as;
/**
 * Maps the success value of this effect to an optional value.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.asSome = stm.asSome;
/**
 * Maps the error value of this effect to an optional value.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.asSomeError = stm.asSomeError;
/**
 * This function maps the success value of an `STM` to `void`. If the original
 * `STM` succeeds, the returned `STM` will also succeed. If the original `STM`
 * fails, the returned `STM` will fail with the same error.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.asUnit = stm.asUnit;
/**
 * Creates an `STM` value from a partial (but pure) function.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.attempt = stm.attempt;
/**
 * Recovers from all errors.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchAll = core.catchAll;
/**
 * Recovers from some or all of the error cases.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchSome = stm.catchSome;
/**
 * Recovers from the specified tagged error.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchTag = stm.catchTag;
/**
 * Recovers from multiple tagged errors.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchTags = stm.catchTags;
/**
 * Checks the condition, and if it's true, returns unit, otherwise, retries.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.check = stm.check;
/**
 * Simultaneously filters and maps the value produced by this effect.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.collect = stm.collect;
/**
 * Simultaneously filters and maps the value produced by this effect.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.collectSTM = stm.collectSTM;
/**
 * Commits this transaction atomically.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.commit = core.commit;
/**
 * Commits this transaction atomically, regardless of whether the transaction
 * is a success or a failure.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.commitEither = stm.commitEither;
/**
 * Similar to Either.cond, evaluate the predicate, return the given A as
 * success if predicate returns true, and the given E as error otherwise
 *
 * @since 2.0.0
 * @category constructors
 */
exports.cond = stm.cond;
/**
 * Retrieves the environment inside an stm.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.context = core.context;
/**
 * Accesses the environment of the transaction to perform a transaction.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.contextWith = core.contextWith;
/**
 * Accesses the environment of the transaction to perform a transaction.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.contextWithSTM = core.contextWithSTM;
/**
 * Transforms the environment being provided to this effect with the specified
 * function.
 *
 * @since 2.0.0
 * @category context
 */
exports.mapInputContext = core.mapInputContext;
/**
 * Fails the transactional effect with the specified defect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.die = core.die;
/**
 * Kills the fiber running the effect with a `Cause.RuntimeException` that
 * contains the specified message.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dieMessage = core.dieMessage;
/**
 * Fails the transactional effect with the specified lazily evaluated defect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dieSync = core.dieSync;
/**
 * Converts the failure channel into an `Either`.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.either = stm.either;
/**
 * Executes the specified finalization transaction whether or not this effect
 * succeeds. Note that as with all STM transactions, if the full transaction
 * fails, everything will be rolled back.
 *
 * @since 2.0.0
 * @category finalization
 */
exports.ensuring = core.ensuring;
/**
 * Returns an effect that ignores errors and runs repeatedly until it
 * eventually succeeds.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.eventually = stm.eventually;
/**
 * Determines whether all elements of the `Iterable<A>` satisfy the effectual
 * predicate.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.every = stm.every;
/**
 * Determines whether any element of the `Iterable[A]` satisfies the effectual
 * predicate `f`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.exists = stm.exists;
/**
 * Fails the transactional effect with the specified error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fail = core.fail;
/**
 * Fails the transactional effect with the specified lazily evaluated error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failSync = core.failSync;
/**
 * Returns the fiber id of the fiber committing the transaction.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fiberId = stm.fiberId;
/**
 * Filters the collection using the specified effectual predicate.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.filter = stm.filter;
/**
 * Filters the collection using the specified effectual predicate, removing
 * all elements that satisfy the predicate.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.filterNot = stm.filterNot;
/**
 * Dies with specified defect if the predicate fails.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterOrDie = stm.filterOrDie;
/**
 * Dies with a `Cause.RuntimeException` having the specified  message if the
 * predicate fails.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterOrDieMessage = stm.filterOrDieMessage;
/**
 * Supplies `orElse` if the predicate fails.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterOrElse = stm.filterOrElse;
/**
 * Fails with the specified error if the predicate fails.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterOrFail = stm.filterOrFail;
/**
 * Feeds the value produced by this effect to the specified function, and then
 * runs the returned effect as well to produce its results.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = core.flatMap;
/**
 * Flattens out a nested `STM` effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatten = stm.flatten;
/**
 * Flips the success and failure channels of this transactional effect. This
 * allows you to use all methods on the error channel, possibly before
 * flipping back.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.flip = stm.flip;
/**
 * Swaps the error/value parameters, applies the function `f` and flips the
 * parameters back
 *
 * @since 2.0.0
 * @category mutations
 */
exports.flipWith = stm.flipWith;
/**
 * Folds over the `STM` effect, handling both failure and success, but not
 * retry.
 *
 * @since 2.0.0
 * @category folding
 */
exports.match = stm.match;
/**
 * Effectfully folds over the `STM` effect, handling both failure and success.
 *
 * @since 2.0.0
 * @category folding
 */
exports.matchSTM = core.matchSTM;
/**
 * Applies the function `f` to each element of the `Iterable<A>` and returns
 * a transactional effect that produces a new `Chunk<A2>`.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.forEach = stm.forEach;
/**
 * Lifts an `Either` into a `STM`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEither = stm.fromEither;
/**
 * Lifts an `Option` into a `STM`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromOption = stm.fromOption;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.gen = stm.gen;
/**
 * Returns a successful effect with the head of the list if the list is
 * non-empty or fails with the error `None` if the list is empty.
 *
 * @since 2.0.0
 * @category getters
 */
exports.head = stm.head;
const if_ = stm.if_;
exports.if = if_;
/**
 * Returns a new effect that ignores the success or failure of this effect.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.ignore = stm.ignore;
/**
 * Interrupts the fiber running the effect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.interrupt = core.interrupt;
/**
 * Interrupts the fiber running the effect with the specified `FiberId`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.interruptAs = core.interruptAs;
/**
 * Returns whether this transactional effect is a failure.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isFailure = stm.isFailure;
/**
 * Returns whether this transactional effect is a success.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isSuccess = stm.isSuccess;
/**
 * Iterates with the specified transactional function. The moral equivalent
 * of:
 *
 * ```ts
 * const s = initial
 *
 * while (cont(s)) {
 *   s = body(s)
 * }
 *
 * return s
 * ```
 *
 * @since 2.0.0
 * @category constructors
 */
exports.iterate = stm.iterate;
/**
 * Loops with the specified transactional function, collecting the results
 * into a list. The moral equivalent of:
 *
 * ```ts
 * const as = []
 * let s  = initial
 *
 * while (cont(s)) {
 *   as.push(body(s))
 *   s  = inc(s)
 * }
 *
 * return as
 * ```
 *
 * @since 2.0.0
 * @category constructors
 */
exports.loop = stm.loop;
/**
 * Maps the value produced by the effect.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = core.map;
/**
 * Maps the value produced by the effect with the specified function that may
 * throw exceptions but is otherwise pure, translating any thrown exceptions
 * into typed failed effects.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapAttempt = stm.mapAttempt;
/**
 * Returns an `STM` effect whose failure and success channels have been mapped
 * by the specified pair of functions, `f` and `g`.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapBoth = stm.mapBoth;
/**
 * Maps from one error type to another.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapError = stm.mapError;
/**
 * Returns a new effect where the error channel has been merged into the
 * success channel to their common combined type.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.merge = stm.merge;
/**
 * Merges an `Iterable<STM>` to a single `STM`, working sequentially.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.mergeAll = stm.mergeAll;
/**
 * Returns a new effect where boolean value of this effect is negated.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.negate = stm.negate;
/**
 * Requires the option produced by this value to be `None`.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.none = stm.none;
/**
 * Converts the failure channel into an `Option`.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.option = stm.option;
/**
 * Translates `STM` effect failure into death of the fiber, making all
 * failures unchecked and not a part of the type of the effect.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orDie = stm.orDie;
/**
 * Keeps none of the errors, and terminates the fiber running the `STM` effect
 * with them, using the specified function to convert the `E` into a defect.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orDieWith = stm.orDieWith;
/**
 * Tries this effect first, and if it fails or retries, tries the other
 * effect.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElse = stm.orElse;
/**
 * Returns a transactional effect that will produce the value of this effect
 * in left side, unless it fails or retries, in which case, it will produce
 * the value of the specified effect in right side.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseEither = stm.orElseEither;
/**
 * Tries this effect first, and if it fails or retries, fails with the
 * specified error.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseFail = stm.orElseFail;
/**
 * Returns an effect that will produce the value of this effect, unless it
 * fails with the `None` value, in which case it will produce the value of the
 * specified effect.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseOptional = stm.orElseOptional;
/**
 * Tries this effect first, and if it fails or retries, succeeds with the
 * specified value.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseSucceed = stm.orElseSucceed;
/**
 * Tries this effect first, and if it enters retry, then it tries the other
 * effect. This is an equivalent of Haskell's orElse.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orTry = core.orTry;
/**
 * Feeds elements of type `A` to a function `f` that returns an effect.
 * Collects all successes and failures in a tupled fashion.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.partition = stm.partition;
/**
 * Provides the transaction its required environment, which eliminates its
 * dependency on `R`.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideContext = stm.provideContext;
/**
 * Splits the context into two parts, providing one part using the
 * specified layer and leaving the remainder `R0`.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideSomeContext = stm.provideSomeContext;
/**
 * Provides the effect with the single service it requires. If the transactional
 * effect requires more than one service use `provideEnvironment` instead.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideService = stm.provideService;
/**
 * Provides the effect with the single service it requires. If the transactional
 * effect requires more than one service use `provideEnvironment` instead.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideServiceSTM = stm.provideServiceSTM;
/**
 * Folds an `Iterable<A>` using an effectual function f, working sequentially
 * from left to right.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.reduce = stm.reduce;
/**
 * Reduces an `Iterable<STM>` to a single `STM`, working sequentially.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.reduceAll = stm.reduceAll;
/**
 * Folds an `Iterable<A>` using an effectual function f, working sequentially
 * from right to left.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.reduceRight = stm.reduceRight;
/**
 * Keeps some of the errors, and terminates the fiber with the rest.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.refineOrDie = stm.refineOrDie;
/**
 * Keeps some of the errors, and terminates the fiber with the rest, using the
 * specified function to convert the `E` into a `Throwable`.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.refineOrDieWith = stm.refineOrDieWith;
/**
 * Fail with the returned value if the `PartialFunction` matches, otherwise
 * continue with our held value.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.reject = stm.reject;
/**
 * Continue with the returned computation if the specified partial function
 * matches, translating the successful match into a failure, otherwise continue
 * with our held value.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.rejectSTM = stm.rejectSTM;
/**
 * Repeats this `STM` effect until its result satisfies the specified
 * predicate.
 *
 * **WARNING**: `repeatUntil` uses a busy loop to repeat the effect and will
 * consume a thread until it completes (it cannot yield). This is because STM
 * describes a single atomic transaction which must either complete, retry or
 * fail a transaction before yielding back to the Effect runtime.
 *   - Use `retryUntil` instead if you don't need to maintain transaction
 *     state for repeats.
 *   - Ensure repeating the STM effect will eventually satisfy the predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.repeatUntil = stm.repeatUntil;
/**
 * Repeats this `STM` effect while its result satisfies the specified
 * predicate.
 *
 * **WARNING**: `repeatWhile` uses a busy loop to repeat the effect and will
 * consume a thread until it completes (it cannot yield). This is because STM
 * describes a single atomic transaction which must either complete, retry or
 * fail a transaction before yielding back to the Effect runtime.
 *   - Use `retryWhile` instead if you don't need to maintain transaction
 *     state for repeats.
 *   - Ensure repeating the STM effect will eventually not satisfy the
 *     predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.repeatWhile = stm.repeatWhile;
/**
 * Replicates the given effect n times. If 0 or negative numbers are given, an
 * empty `Chunk` will be returned.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.replicate = stm.replicate;
/**
 * Performs this transaction the specified number of times and collects the
 * results.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.replicateSTM = stm.replicateSTM;
/**
 * Performs this transaction the specified number of times, discarding the
 * results.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.replicateSTMDiscard = stm.replicateSTMDiscard;
/**
 * Abort and retry the whole transaction when any of the underlying
 * transactional variables have changed.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.retry = core.retry;
/**
 * Filters the value produced by this effect, retrying the transaction until
 * the predicate returns `true` for the value.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.retryUntil = stm.retryUntil;
/**
 * Filters the value produced by this effect, retrying the transaction while
 * the predicate returns `true` for the value.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.retryWhile = stm.retryWhile;
/**
 * Converts an option on values into an option on errors.
 *
 * @since 2.0.0
 * @category getters
 */
exports.some = stm.some;
/**
 * Returns an `STM` effect that succeeds with the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = core.succeed;
/**
 * Returns an effect with the empty value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeedNone = stm.succeedNone;
/**
 * Returns an effect with the optional value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeedSome = stm.succeedSome;
/**
 * Summarizes a `STM` effect by computing a provided value before and after
 * execution, and then combining the values to produce a summary, together
 * with the result of execution.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.summarized = stm.summarized;
/**
 * Suspends creation of the specified transaction lazily.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.suspend = stm.suspend;
/**
 * Returns an `STM` effect that succeeds with the specified lazily evaluated
 * value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sync = core.sync;
/**
 * "Peeks" at the success of transactional effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tap = stm.tap;
/**
 * "Peeks" at both sides of an transactional effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapBoth = stm.tapBoth;
/**
 * "Peeks" at the error of the transactional effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapError = stm.tapError;
const try_ = stm.try_;
exports.try = try_;
/**
 * The moral equivalent of `if (!p) exp`
 *
 * @since 2.0.0
 * @category mutations
 */
exports.unless = stm.unless;
/**
 * The moral equivalent of `if (!p) exp` when `p` has side-effects
 *
 * @since 2.0.0
 * @category mutations
 */
exports.unlessSTM = stm.unlessSTM;
/**
 * Converts an option on errors into an option on values.
 *
 * @since 2.0.0
 * @category getters
 */
exports.unsome = stm.unsome;
/**
 * Returns an `STM` effect that succeeds with `Unit`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unit = stm.unit;
/**
 * Feeds elements of type `A` to `f` and accumulates all errors in error
 * channel or successes in success channel.
 *
 * This combinator is lossy meaning that if there are errors all successes
 * will be lost. To retain all information please use `STM.partition`.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.validateAll = stm.validateAll;
/**
 * Feeds elements of type `A` to `f` until it succeeds. Returns first success
 * or the accumulation of all errors.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.validateFirst = stm.validateFirst;
/**
 * The moral equivalent of `if (p) exp`.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.when = stm.when;
/**
 * The moral equivalent of `if (p) exp` when `p` has side-effects.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.whenSTM = stm.whenSTM;
/**
 * Sequentially zips this value with the specified one.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zip = core.zip;
/**
 * Sequentially zips this value with the specified one, discarding the second
 * element of the tuple.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipLeft = core.zipLeft;
/**
 * Sequentially zips this value with the specified one, discarding the first
 * element of the tuple.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipRight = core.zipRight;
/**
 * Sequentially zips this value with the specified one, combining the values
 * using the specified combiner function.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWith = core.zipWith;
/**
 * This function takes an iterable of `STM` values and returns a new
 * `STM` value that represents the first `STM` value in the iterable
 * that succeeds. If all of the `Effect` values in the iterable fail, then
 * the resulting `STM` value will fail as well.
 *
 * This function is sequential, meaning that the `STM` values in the
 * iterable will be executed in sequence, and the first one that succeeds
 * will determine the outcome of the resulting `STM` value.
 *
 * @param effects - The iterable of `STM` values to evaluate.
 *
 * @returns A new `STM` value that represents the first successful
 * `STM` value in the iterable, or a failed `STM` value if all of the
 * `STM` values in the iterable fail.
 *
 * @since 2.0.0
 * @category elements
 */
const firstSuccessOf = effects => (0, exports.suspend)(() => {
  const list = Chunk.fromIterable(effects);
  if (!Chunk.isNonEmpty(list)) {
    return (0, exports.dieSync)(() => Cause.IllegalArgumentException(`Received an empty collection of effects`));
  }
  return Chunk.reduce(Chunk.tailNonEmpty(list), Chunk.headNonEmpty(list), (left, right) => (0, exports.orElse)(left, () => right));
});
exports.firstSuccessOf = firstSuccessOf;
/**
 * @category do notation
 * @since 2.0.0
 */
exports.Do = /*#__PURE__*/(0, exports.succeed)({});
/**
 * @category do notation
 * @since 2.0.0
 */
exports.bind = stm.bind;
const let_ = stm.let_;
exports.let = let_;
/**
 * @category do notation
 * @since 2.0.0
 */
exports.bindTo = stm.bindTo;
//# sourceMappingURL=STM.js.map