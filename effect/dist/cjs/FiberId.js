"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeMake = exports.toSet = exports.toOption = exports.threadName = exports.make = exports.ids = exports.getOrElse = exports.combineAll = exports.combine = exports.isComposite = exports.isRuntime = exports.isNone = exports.isFiberId = exports.composite = exports.runtime = exports.none = exports.FiberIdTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/fiberId.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FiberIdTypeId = internal.FiberIdTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.none = internal.none;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.runtime = internal.runtime;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.composite = internal.composite;
/**
 * Returns `true` if the specified unknown value is a `FiberId`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isFiberId = internal.isFiberId;
/**
 * Returns `true` if the `FiberId` is a `None`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isNone = internal.isNone;
/**
 * Returns `true` if the `FiberId` is a `Runtime`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isRuntime = internal.isRuntime;
/**
 * Returns `true` if the `FiberId` is a `Composite`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isComposite = internal.isComposite;
/**
 * Combine two `FiberId`s.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.combine = internal.combine;
/**
 * Combines a set of `FiberId`s into a single `FiberId`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.combineAll = internal.combineAll;
/**
 * Returns this `FiberId` if it is not `None`, otherwise returns that `FiberId`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.getOrElse = internal.getOrElse;
/**
 * Get the set of identifiers for this `FiberId`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.ids = internal.ids;
/**
 * Creates a new `FiberId`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Creates a string representing the name of the current thread of execution
 * represented by the specified `FiberId`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.threadName = internal.threadName;
/**
 * Convert a `FiberId` into an `Option<FiberId>`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toOption = internal.toOption;
/**
 * Convert a `FiberId` into a `HashSet<FiberId>`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toSet = internal.toSet;
/**
 * Unsafely creates a new `FiberId`.
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeMake = internal.unsafeMake;
//# sourceMappingURL=FiberId.js.map