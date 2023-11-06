"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.empty = exports.unsafeMake = exports.updatedAs = exports.setAll = exports.joinAs = exports.getOrDefault = exports.get = exports.forkAs = exports.fiberRefs = exports.delete = exports.FiberRefsSym = void 0;
const internal = /*#__PURE__*/require("./internal/fiberRefs.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FiberRefsSym = internal.FiberRefsSym;
const delete_ = internal.delete_;
exports.delete = delete_;
/**
 * Returns a set of each `FiberRef` in this collection.
 *
 * @since 2.0.0
 * @category getters
 */
exports.fiberRefs = internal.fiberRefs;
/**
 * Forks this collection of fiber refs as the specified child fiber id. This
 * will potentially modify the value of the fiber refs, as determined by the
 * individual fiber refs that make up the collection.
 *
 * @since 2.0.0
 * @category utils
 */
exports.forkAs = internal.forkAs;
/**
 * Gets the value of the specified `FiberRef` in this collection of `FiberRef`
 * values if it exists or `None` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.get = internal.get;
/**
 * Gets the value of the specified `FiberRef` in this collection of `FiberRef`
 * values if it exists or the `initial` value of the `FiberRef` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.getOrDefault = internal.getOrDefault;
/**
 * Joins this collection of fiber refs to the specified collection, as the
 * specified fiber id. This will perform diffing and merging to ensure
 * preservation of maximum information from both child and parent refs.
 *
 * @since 2.0.0
 * @category utils
 */
exports.joinAs = internal.joinAs;
/**
 * Set each ref to either its value or its default.
 *
 * @since 2.0.0
 * @category utils
 */
exports.setAll = internal.setAll;
/**
 * Updates the value of the specified `FiberRef` using the provided `FiberId`
 *
 * @since 2.0.0
 * @category utils
 */
exports.updatedAs = internal.updatedAs;
/**
 * Note: it will not copy the provided Map, make sure to provide a fresh one.
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeMake = internal.unsafeMake;
/**
 * The empty collection of `FiberRef` values.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.empty = internal.empty;
//# sourceMappingURL=FiberRefs.js.map