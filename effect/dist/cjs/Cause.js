"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InterruptedException = exports.reduceWithContext = exports.reduce = exports.match = exports.filter = exports.find = exports.squashWith = exports.squash = exports.contains = exports.flatten = exports.flatMap = exports.map = exports.as = exports.stripSomeDefects = exports.stripFailures = exports.linearize = exports.keepDefects = exports.interruptOption = exports.dieOption = exports.flipCauseOption = exports.failureOrCause = exports.failureOption = exports.interruptors = exports.defects = exports.failures = exports.isInterruptedOnly = exports.isInterrupted = exports.isDie = exports.isFailure = exports.isEmpty = exports.size = exports.isParallelType = exports.isSequentialType = exports.isInterruptType = exports.isDieType = exports.isFailType = exports.isEmptyType = exports.isCause = exports.sequential = exports.parallel = exports.interrupt = exports.die = exports.fail = exports.empty = exports.InvalidPubSubCapacityExceptionTypeId = exports.NoSuchElementExceptionTypeId = exports.IllegalArgumentExceptionTypeId = exports.InterruptedExceptionTypeId = exports.RuntimeExceptionTypeId = exports.CauseTypeId = void 0;
exports.originalError = exports.pretty = exports.isRuntimeException = exports.RuntimeException = exports.isNoSuchElementException = exports.NoSuchElementException = exports.isIllegalArgumentException = exports.IllegalArgumentException = exports.isInterruptedException = void 0;
const internal = /*#__PURE__*/require("./internal/cause.js");
const core_js_1 = /*#__PURE__*/require("./internal/core.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.CauseTypeId = internal.CauseTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.RuntimeExceptionTypeId = internal.RuntimeExceptionTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.InterruptedExceptionTypeId = internal.InterruptedExceptionTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.IllegalArgumentExceptionTypeId = internal.IllegalArgumentExceptionTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.NoSuchElementExceptionTypeId = internal.NoSuchElementExceptionTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.InvalidPubSubCapacityExceptionTypeId = internal.InvalidPubSubCapacityExceptionTypeId;
/**
 * Constructs a new `Empty` cause.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Constructs a new `Fail` cause from the specified `error`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fail = internal.fail;
/**
 * Constructs a new `Die` cause from the specified `defect`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.die = internal.die;
/**
 * Constructs a new `Interrupt` cause from the specified `fiberId`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.interrupt = internal.interrupt;
/**
 * Constructs a new `Parallel` cause from the specified `left` and `right`
 * causes.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.parallel = internal.parallel;
/**
 * Constructs a new `Sequential` cause from the specified pecified `left` and
 * `right` causes.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sequential = internal.sequential;
/**
 * Returns `true` if the specified value is a `Cause`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isCause = internal.isCause;
/**
 * Returns `true` if the specified `Cause` is an `Empty` type, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isEmptyType = internal.isEmptyType;
/**
 * Returns `true` if the specified `Cause` is a `Fail` type, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isFailType = internal.isFailType;
/**
 * Returns `true` if the specified `Cause` is a `Die` type, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isDieType = internal.isDieType;
/**
 * Returns `true` if the specified `Cause` is an `Interrupt` type, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isInterruptType = internal.isInterruptType;
/**
 * Returns `true` if the specified `Cause` is a `Sequential` type, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isSequentialType = internal.isSequentialType;
/**
 * Returns `true` if the specified `Cause` is a `Parallel` type, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isParallelType = internal.isParallelType;
/**
 * Returns the size of the cause, calculated as the number of individual `Cause`
 * nodes found in the `Cause` semiring structure.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = internal.size;
/**
 * Returns `true` if the specified cause is empty, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isEmpty = internal.isEmpty;
/**
 * Returns `true` if the specified cause contains a failure, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isFailure = internal.isFailure;
/**
 * Returns `true` if the specified cause contains a defect, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isDie = internal.isDie;
/**
 * Returns `true` if the specified cause contains an interruption, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isInterrupted = internal.isInterrupted;
/**
 * Returns `true` if the specified cause contains only interruptions (without
 * any `Die` or `Fail` causes), `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isInterruptedOnly = internal.isInterruptedOnly;
/**
 * Returns a `List` of all recoverable errors of type `E` in the specified
 * cause.
 *
 * @since 2.0.0
 * @category getters
 */
exports.failures = internal.failures;
/**
 * Returns a `List` of all unrecoverable defects in the specified cause.
 *
 * @since 2.0.0
 * @category getters
 */
exports.defects = internal.defects;
/**
 * Returns a `HashSet` of `FiberId`s for all fibers that interrupted the fiber
 * described by the specified cause.
 *
 * @since 2.0.0
 * @category getters
 */
exports.interruptors = internal.interruptors;
/**
 * Returns the `E` associated with the first `Fail` in this `Cause`, if one
 * exists.
 *
 * @since 2.0.0
 * @category getters
 */
exports.failureOption = internal.failureOption;
/**
 * Returns the first checked error on the `Left` if available, if there are
 * no checked errors return the rest of the `Cause` that is known to contain
 * only `Die` or `Interrupt` causes.
 *
 * @since 2.0.0
 * @category getters
 */
exports.failureOrCause = internal.failureOrCause;
/**
 * Converts the specified `Cause<Option<E>>` to an `Option<Cause<E>>` by
 * recursively stripping out any failures with the error `None`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.flipCauseOption = internal.flipCauseOption;
/**
 * Returns the defect associated with the first `Die` in this `Cause`, if one
 * exists.
 *
 * @since 2.0.0
 * @category getters
 */
exports.dieOption = internal.dieOption;
/**
 * Returns the `FiberId` associated with the first `Interrupt` in the specified
 * cause, if one exists.
 *
 * @since 2.0.0
 * @category getters
 */
exports.interruptOption = internal.interruptOption;
/**
 * Remove all `Fail` and `Interrupt` nodes from the specified cause, and return
 * a cause containing only `Die` cause/finalizer defects.
 *
 * @since 2.0.0
 * @category getters
 */
exports.keepDefects = internal.keepDefects;
/**
 * Linearizes the specified cause into a `HashSet` of parallel causes where each
 * parallel cause contains a linear sequence of failures.
 *
 * @since 2.0.0
 * @category getters
 */
exports.linearize = internal.linearize;
/**
 * Remove all `Fail` and `Interrupt` nodes from the specified cause, and return
 * a cause containing only `Die` cause/finalizer defects.
 *
 * @since 2.0.0
 * @category getters
 */
exports.stripFailures = internal.stripFailures;
/**
 * Remove all `Die` causes that the specified partial function is defined at,
 * returning `Some` with the remaining causes or `None` if there are no
 * remaining causes.
 *
 * @since 2.0.0
 * @category getters
 */
exports.stripSomeDefects = internal.stripSomeDefects;
/**
 * @since 2.0.0
 * @category mapping
 */
exports.as = internal.as;
/**
 * @since 2.0.0
 * @category mapping
 */
exports.map = internal.map;
/**
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = internal.flatMap;
/**
 * @since 2.0.0
 * @category sequencing
 */
exports.flatten = internal.flatten;
/**
 * Returns `true` if the `self` cause contains or is equal to `that` cause,
 * `false` otherwise.
 *
 * @since 2.0.0
 * @category elements
 */
exports.contains = internal.contains;
/**
 * Squashes a `Cause` down to a single defect, chosen to be the "most important"
 * defect.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.squash = internal.squash;
/**
 * Squashes a `Cause` down to a single defect, chosen to be the "most important"
 * defect. If a recoverable error is found, the provided function will be used
 * to map the error a defect, and the resulting value will be returned.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.squashWith = internal.squashWith;
/**
 * Uses the provided partial function to search the specified cause and attempt
 * to extract information from it.
 *
 * @since 2.0.0
 * @category elements
 */
exports.find = internal.find;
/**
 * Filters causes which match the provided predicate out of the specified cause.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filter = internal.filter;
/**
 * Folds the specified cause into a value of type `Z`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
/**
 * Reduces the specified cause into a value of type `Z`, beginning with the
 * provided `zero` value.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduce = internal.reduce;
/**
 * Reduces the specified cause into a value of type `Z` using a `Cause.Reducer`.
 * Also allows for accessing the provided context during reduction.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduceWithContext = internal.reduceWithContext;
/**
 * Represents a checked exception which occurs when a `Fiber` is interrupted.
 *
 * @since 2.0.0
 * @category errors
 */
exports.InterruptedException = internal.InterruptedException;
/**
 * Returns `true` if the specified value is an `InterruptedException`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isInterruptedException = internal.isInterruptedException;
/**
 * Represents a checked exception which occurs when an invalid argument is
 * provided to a method.
 *
 * @since 2.0.0
 * @category errors
 */
exports.IllegalArgumentException = internal.IllegalArgumentException;
/**
 * Returns `true` if the specified value is an `IllegalArgumentException`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isIllegalArgumentException = internal.isIllegalArgumentException;
/**
 * Represents a checked exception which occurs when an expected element was
 * unable to be found.
 *
 * @since 2.0.0
 * @category errors
 */
exports.NoSuchElementException = internal.NoSuchElementException;
/**
 * Returns `true` if the specified value is an `NoSuchElementException`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isNoSuchElementException = internal.isNoSuchElementException;
/**
 * Represents a generic checked exception which occurs at runtime.
 *
 * @since 2.0.0
 * @category errors
 */
exports.RuntimeException = internal.RuntimeException;
/**
 * Returns `true` if the specified value is an `RuntimeException`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isRuntimeException = internal.isRuntimeException;
/**
 * Returns the specified `Cause` as a pretty-printed string.
 *
 * @since 2.0.0
 * @category rendering
 */
exports.pretty = internal.pretty;
/**
 * Returns the original, unproxied, instance of a thrown error
 *
 * @since 2.0.0
 * @category errors
 */
exports.originalError = core_js_1.originalInstance;
//# sourceMappingURL=Cause.js.map