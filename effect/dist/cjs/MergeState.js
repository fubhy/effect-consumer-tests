"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isRightDone = exports.isLeftDone = exports.isBothRunning = exports.isMergeState = exports.RightDone = exports.LeftDone = exports.BothRunning = exports.MergeStateTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/channel/mergeState.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MergeStateTypeId = internal.MergeStateTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.BothRunning = internal.BothRunning;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.LeftDone = internal.LeftDone;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.RightDone = internal.RightDone;
/**
 * Returns `true` if the specified value is a `MergeState`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isMergeState = internal.isMergeState;
/**
 * Returns `true` if the specified `MergeState` is a `BothRunning`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isBothRunning = internal.isBothRunning;
/**
 * Returns `true` if the specified `MergeState` is a `LeftDone`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isLeftDone = internal.isLeftDone;
/**
 * Returns `true` if the specified `MergeState` is a `RightDone`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isRightDone = internal.isRightDone;
/**
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
//# sourceMappingURL=MergeState.js.map