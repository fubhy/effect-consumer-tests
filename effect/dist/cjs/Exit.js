"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipWith = exports.zipParRight = exports.zipParLeft = exports.zipPar = exports.zipRight = exports.zipLeft = exports.zip = exports.unit = exports.succeed = exports.matchEffect = exports.match = exports.mapErrorCause = exports.mapError = exports.mapBoth = exports.map = exports.interrupt = exports.getOrElse = exports.fromOption = exports.fromEither = exports.forEachEffect = exports.flatten = exports.flatMapEffect = exports.flatMap = exports.failCause = exports.fail = exports.exists = exports.die = exports.all = exports.causeOption = exports.asUnit = exports.as = exports.isInterrupted = exports.isSuccess = exports.isFailure = exports.isExit = void 0;
const core = /*#__PURE__*/require("./internal/core.js");
/**
 * Returns `true` if the specified value is an `Exit`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isExit = core.exitIsExit;
/**
 * Returns `true` if the specified `Exit` is a `Failure`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isFailure = core.exitIsFailure;
/**
 * Returns `true` if the specified `Exit` is a `Success`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isSuccess = core.exitIsSuccess;
/**
 * Returns `true` if the specified exit is a `Failure` **and** the `Cause` of
 * the failure was due to interruption, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isInterrupted = core.exitIsInterrupted;
/**
 * Maps the `Success` value of the specified exit to the provided constant
 * value.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.as = core.exitAs;
/**
 * Maps the `Success` value of the specified exit to a void.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.asUnit = core.exitAsUnit;
/**
 * Returns a `Some<Cause<E>>` if the specified exit is a `Failure`, `None`
 * otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.causeOption = core.exitCauseOption;
/**
 * Collects all of the specified exit values into a `Some<Exit<E, List<A>>>`. If
 * the provided iterable contains no elements, `None` will be returned.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.all = core.exitCollectAll;
/**
 * Constructs a new `Exit.Failure` from the specified unrecoverable defect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.die = core.exitDie;
/**
 * Executes the predicate on the value of the specified exit if it is a
 * `Success`, otherwise returns `false`.
 *
 * @since 2.0.0
 * @category elements
 */
exports.exists = core.exitExists;
/**
 * Constructs a new `Exit.Failure` from the specified recoverable error of type
 * `E`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fail = core.exitFail;
/**
 * Constructs a new `Exit.Failure` from the specified `Cause` of type `E`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failCause = core.exitFailCause;
/**
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = core.exitFlatMap;
/**
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMapEffect = core.exitFlatMapEffect;
/**
 * @since 2.0.0
 * @category sequencing
 */
exports.flatten = core.exitFlatten;
/**
 * @since 2.0.0
 * @category traversing
 */
exports.forEachEffect = core.exitForEachEffect;
/**
 * Converts an `Either<E, A>` into an `Exit<E, A>`.
 *
 * @since 2.0.0
 * @category conversions
 */
exports.fromEither = core.exitFromEither;
/**
 * Converts an `Option<A>` into an `Exit<void, A>`.
 *
 * @since 2.0.0
 * @category conversions
 */
exports.fromOption = core.exitFromOption;
/**
 * Returns the `A` if specified exit is a `Success`, otherwise returns the
 * alternate `A` value computed from the specified function which receives the
 * `Cause<E>` of the exit `Failure`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.getOrElse = core.exitGetOrElse;
/**
 * Constructs a new `Exit.Failure` from the specified `FiberId` indicating that
 * the `Fiber` running an `Effect` workflow was terminated due to interruption.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.interrupt = core.exitInterrupt;
/**
 * Maps over the `Success` value of the specified exit using the provided
 * function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = core.exitMap;
/**
 * Maps over the `Success` and `Failure` cases of the specified exit using the
 * provided functions.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapBoth = core.exitMapBoth;
/**
 * Maps over the error contained in the `Failure` of the specified exit using
 * the provided function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapError = core.exitMapError;
/**
 * Maps over the `Cause` contained in the `Failure` of the specified exit using
 * the provided function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapErrorCause = core.exitMapErrorCause;
/**
 * @since 2.0.0
 * @category folding
 */
exports.match = core.exitMatch;
/**
 * @since 2.0.0
 * @category folding
 */
exports.matchEffect = core.exitMatchEffect;
/**
 * Constructs a new `Exit.Success` containing the specified value of type `A`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = core.exitSucceed;
/**
 * Represents an `Exit` which succeeds with `undefined`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unit = core.exitUnit;
/**
 * Sequentially zips the this result with the specified result or else returns
 * the failed `Cause<E | E2>`.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zip = core.exitZip;
/**
 * Sequentially zips the this result with the specified result discarding the
 * second element of the tuple or else returns the failed `Cause<E | E2>`.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipLeft = core.exitZipLeft;
/**
 * Sequentially zips the this result with the specified result discarding the
 * first element of the tuple or else returns the failed `Cause<E | E2>`.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipRight = core.exitZipRight;
/**
 * Parallelly zips the this result with the specified result or else returns
 * the failed `Cause<E | E2>`.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipPar = core.exitZipPar;
/**
 * Parallelly zips the this result with the specified result discarding the
 * second element of the tuple or else returns the failed `Cause<E | E2>`.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipParLeft = core.exitZipParLeft;
/**
 * Parallelly zips the this result with the specified result discarding the
 * first element of the tuple or else returns the failed `Cause<E | E2>`.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipParRight = core.exitZipParRight;
/**
 * Zips this exit together with that exit using the specified combination
 * functions.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWith = core.exitZipWith;
//# sourceMappingURL=Exit.js.map