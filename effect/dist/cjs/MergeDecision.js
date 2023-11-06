"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isMergeDecision = exports.AwaitConst = exports.Await = exports.Done = exports.MergeDecisionTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/channel/mergeDecision.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MergeDecisionTypeId = internal.MergeDecisionTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Done = internal.Done;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Await = internal.Await;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.AwaitConst = internal.AwaitConst;
/**
 * Returns `true` if the specified value is a `MergeDecision`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isMergeDecision = internal.isMergeDecision;
/**
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
//# sourceMappingURL=MergeDecision.js.map