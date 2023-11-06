"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.max = exports.isNonEmpty = exports.lessThan = exports.end = exports.start = exports.intersect = exports.union = exports.fromIterable = exports.empty = exports.make = exports.IntervalsTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/schedule/intervals.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.IntervalsTypeId = internal.IntervalsTypeId;
/**
 * Creates a new `Intervals` from a `List` of `Interval`s.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Constructs an empty list of `Interval`s.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Constructs `Intervals` from the specified `Iterable<Interval>`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = internal.fromIterable;
/**
 * Computes the union of this `Intervals` and  that `Intervals`
 *
 * @since 2.0.0
 * @category utils
 */
exports.union = internal.union;
/**
 * Produces the intersection of this `Intervals` and that `Intervals`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.intersect = internal.intersect;
/**
 * The start of the earliest interval in the specified `Intervals`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.start = internal.start;
/**
 * The end of the latest interval in the specified `Intervals`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.end = internal.end;
/**
 * Returns `true` if the start of this `Intervals` is before the start of that
 * `Intervals`, `false` otherwise.
 *
 * @since 2.0.0
 * @category ordering
 */
exports.lessThan = internal.lessThan;
/**
 * Returns `true` if this `Intervals` is non-empty, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isNonEmpty = internal.isNonEmpty;
/**
 * Returns the maximum of the two `Intervals` (i.e. which has the latest start).
 *
 * @since 2.0.0
 * @category ordering
 */
exports.max = internal.max;
//# sourceMappingURL=ScheduleIntervals.js.map