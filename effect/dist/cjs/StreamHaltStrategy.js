"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isEither = exports.isBoth = exports.isRight = exports.isLeft = exports.fromInput = exports.Either = exports.Both = exports.Right = exports.Left = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/stream/haltStrategy.js");
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Left = internal.Left;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Right = internal.Right;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Both = internal.Both;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Either = internal.Either;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.fromInput = internal.fromInput;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isLeft = internal.isLeft;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isRight = internal.isRight;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isBoth = internal.isBoth;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isEither = internal.isEither;
/**
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
//# sourceMappingURL=StreamHaltStrategy.js.map