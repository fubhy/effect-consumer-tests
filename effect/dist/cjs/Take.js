"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tap = exports.of = exports.matchEffect = exports.match = exports.map = exports.make = exports.isSuccess = exports.isFailure = exports.isDone = exports.fromPull = exports.fromExit = exports.fromEffect = exports.failCause = exports.fail = exports.end = exports.done = exports.dieMessage = exports.die = exports.chunk = exports.TakeTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/take.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TakeTypeId = internal.TakeTypeId;
/**
 * Creates a `Take` with the specified chunk.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.chunk = internal.chunk;
/**
 * Creates a failing `Take` with the specified defect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.die = internal.die;
/**
 * Creates a failing `Take` with the specified error message.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dieMessage = internal.dieMessage;
/**
 * Transforms a `Take<E, A>` to an `Effect<never, E, A>`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.done = internal.done;
/**
 * Represents the end-of-stream marker.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.end = internal.end;
/**
 * Creates a failing `Take` with the specified error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fail = internal.fail;
/**
 * Creates a failing `Take` with the specified cause.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failCause = internal.failCause;
/**
 * Creates an effect from `Effect<R, E, A>` that does not fail, but succeeds with
 * the `Take<E, A>`. Error from stream when pulling is converted to
 * `Take.failCause`. Creates a single value chunk.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEffect = internal.fromEffect;
/**
 * Creates a `Take` from an `Exit`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromExit = internal.fromExit;
/**
 * Creates effect from `Effect<R, Option<E>, Chunk<A>>` that does not fail, but
 * succeeds with the `Take<E, A>`. Errors from stream when pulling are converted
 * to `Take.failCause`, and the end-of-stream is converted to `Take.end`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromPull = internal.fromPull;
/**
 * Checks if this `take` is done (`Take.end`).
 *
 * @since 2.0.0
 * @category getters
 */
exports.isDone = internal.isDone;
/**
 * Checks if this `take` is a failure.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isFailure = internal.isFailure;
/**
 * Checks if this `take` is a success.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isSuccess = internal.isSuccess;
/**
 * Constructs a `Take`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Transforms `Take<E, A>` to `Take<E, B>` by applying function `f`.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = internal.map;
/**
 * Folds over the failure cause, success value and end-of-stream marker to
 * yield a value.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.match = internal.match;
/**
 * Effectful version of `Take.fold`.
 *
 * Folds over the failure cause, success value and end-of-stream marker to
 * yield an effect.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.matchEffect = internal.matchEffect;
/**
 * Creates a `Take` with a single value chunk.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.of = internal.of;
/**
 * Returns an effect that effectfully "peeks" at the success of this take.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tap = internal.tap;
//# sourceMappingURL=Take.js.map