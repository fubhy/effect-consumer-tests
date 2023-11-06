"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isPullAfterAllEnqueued = exports.isPullAfterNext = exports.isUpstreamPullStrategy = exports.PullAfterAllEnqueued = exports.PullAfterNext = exports.UpstreamPullStrategyTypeId = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/channel/upstreamPullStrategy.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.UpstreamPullStrategyTypeId = internal.UpstreamPullStrategyTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.PullAfterNext = internal.PullAfterNext;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.PullAfterAllEnqueued = internal.PullAfterAllEnqueued;
/**
 * Returns `true` if the specified value is an `UpstreamPullStrategy`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isUpstreamPullStrategy = internal.isUpstreamPullStrategy;
/**
 * Returns `true` if the specified `UpstreamPullStrategy` is a `PullAfterNext`,
 * `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isPullAfterNext = internal.isPullAfterNext;
/**
 * Returns `true` if the specified `UpstreamPullStrategy` is a
 * `PullAfterAllEnqueued`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isPullAfterAllEnqueued = internal.isPullAfterAllEnqueued;
/**
 * Folds an `UpstreamPullStrategy<A>` into a value of type `Z`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
//# sourceMappingURL=UpstreamPullStrategy.js.map