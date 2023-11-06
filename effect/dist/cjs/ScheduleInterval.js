"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.before = exports.after = exports.union = exports.size = exports.intersect = exports.isNonEmpty = exports.isEmpty = exports.max = exports.min = exports.lessThan = exports.empty = exports.make = exports.IntervalTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/schedule/interval.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.IntervalTypeId = internal.IntervalTypeId;
/**
 * Constructs a new interval from the two specified endpoints. If the start
 * endpoint greater than the end endpoint, then a zero size interval will be
 * returned.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * An `Interval` of zero-width.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Returns `true` if this `Interval` is less than `that` interval, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category ordering
 */
exports.lessThan = internal.lessThan;
/**
 * Returns the minimum of two `Interval`s.
 *
 * @since 2.0.0
 * @category ordering
 */
exports.min = internal.min;
/**
 * Returns the maximum of two `Interval`s.
 *
 * @since 2.0.0
 * @category ordering
 */
exports.max = internal.max;
/**
 * Returns `true` if the specified `Interval` is empty, `false` otherwise.
 *
 * @since 2.0.0
 * @category ordering
 */
exports.isEmpty = internal.isEmpty;
/**
 * Returns `true` if the specified `Interval` is non-empty, `false` otherwise.
 *
 * @since 2.0.0
 * @category ordering
 */
exports.isNonEmpty = internal.isNonEmpty;
/**
 * Computes a new `Interval` which is the intersection of this `Interval` and
 * that `Interval`.
 *
 * @since 2.0.0
 * @category ordering
 */
exports.intersect = internal.intersect;
/**
 * Calculates the size of the `Interval` as the `Duration` from the start of the
 * interval to the end of the interval.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = internal.size;
/**
 * Computes a new `Interval` which is the union of this `Interval` and that
 * `Interval` as a `Some`, otherwise returns `None` if the two intervals cannot
 * form a union.
 *
 * @since 2.0.0
 * @category utils
 */
exports.union = internal.union;
/**
 * Construct an `Interval` that includes all time equal to and after the
 * specified start time.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.after = internal.after;
/**
 * Construct an `Interval` that includes all time equal to and before the
 * specified end time.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.before = internal.before;
//# sourceMappingURL=ScheduleInterval.js.map