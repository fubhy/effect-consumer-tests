"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isBufferSliding = exports.isBackPressure = exports.isMergeStrategy = exports.BufferSliding = exports.BackPressure = exports.MergeStrategyTypeId = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/channel/mergeStrategy.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MergeStrategyTypeId = internal.MergeStrategyTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.BackPressure = internal.BackPressure;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.BufferSliding = internal.BufferSliding;
/**
 * Returns `true` if the specified value is a `MergeStrategy`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isMergeStrategy = internal.isMergeStrategy;
/**
 * Returns `true` if the specified `MergeStrategy` is a `BackPressure`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isBackPressure = internal.isBackPressure;
/**
 * Returns `true` if the specified `MergeStrategy` is a `BufferSliding`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isBufferSliding = internal.isBufferSliding;
/**
 * Folds an `MergeStrategy` into a value of type `A`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
//# sourceMappingURL=MergeStrategy.js.map