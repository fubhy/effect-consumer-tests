"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isNoUpstream = exports.isPulled = exports.isUpstreamPullRequest = exports.NoUpstream = exports.Pulled = exports.UpstreamPullRequestTypeId = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/channel/upstreamPullRequest.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.UpstreamPullRequestTypeId = internal.UpstreamPullRequestTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Pulled = internal.Pulled;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.NoUpstream = internal.NoUpstream;
/**
 * Returns `true` if the specified value is an `UpstreamPullRequest`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isUpstreamPullRequest = internal.isUpstreamPullRequest;
/**
 * Returns `true` if the specified `UpstreamPullRequest` is a `Pulled`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isPulled = internal.isPulled;
/**
 * Returns `true` if the specified `UpstreamPullRequest` is a `NoUpstream`,
 * `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isNoUpstream = internal.isNoUpstream;
/**
 * Folds an `UpstreamPullRequest<A>` into a value of type `Z`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
//# sourceMappingURL=UpstreamPullRequest.js.map