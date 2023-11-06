"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isYield = exports.isClose = exports.isContinue = exports.isChildExecutorDecision = exports.Yield = exports.Close = exports.Continue = exports.ChildExecutorDecisionTypeId = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/channel/childExecutorDecision.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ChildExecutorDecisionTypeId = internal.ChildExecutorDecisionTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Continue = internal.Continue;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Close = internal.Close;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Yield = internal.Yield;
/**
 * Returns `true` if the specified value is a `ChildExecutorDecision`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isChildExecutorDecision = internal.isChildExecutorDecision;
/**
 * Returns `true` if the specified `ChildExecutorDecision` is a `Continue`,
 * `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isContinue = internal.isContinue;
/**
 * Returns `true` if the specified `ChildExecutorDecision` is a `Close`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isClose = internal.isClose;
/**
 * Returns `true` if the specified `ChildExecutorDecision` is a `Yield`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isYield = internal.isYield;
/**
 * Folds over a `ChildExecutorDecision` to produce a value of type `A`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
//# sourceMappingURL=ChildExecutorDecision.js.map