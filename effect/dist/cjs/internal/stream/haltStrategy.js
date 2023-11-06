"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isEither = exports.isBoth = exports.isRight = exports.isLeft = exports.fromInput = exports.Either = exports.Both = exports.Right = exports.Left = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const OpCodes = /*#__PURE__*/require("../opCodes/streamHaltStrategy.js");
/** @internal */
exports.Left = {
  _tag: OpCodes.OP_LEFT
};
/** @internal */
exports.Right = {
  _tag: OpCodes.OP_RIGHT
};
/** @internal */
exports.Both = {
  _tag: OpCodes.OP_BOTH
};
/** @internal */
exports.Either = {
  _tag: OpCodes.OP_EITHER
};
/** @internal */
const fromInput = input => {
  switch (input) {
    case "left":
      return exports.Left;
    case "right":
      return exports.Right;
    case "both":
      return exports.Both;
    case "either":
      return exports.Either;
    default:
      return input;
  }
};
exports.fromInput = fromInput;
/** @internal */
const isLeft = self => self._tag === OpCodes.OP_LEFT;
exports.isLeft = isLeft;
/** @internal */
const isRight = self => self._tag === OpCodes.OP_RIGHT;
exports.isRight = isRight;
/** @internal */
const isBoth = self => self._tag === OpCodes.OP_BOTH;
exports.isBoth = isBoth;
/** @internal */
const isEither = self => self._tag === OpCodes.OP_EITHER;
exports.isEither = isEither;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(5, (self, onLeft, onRight, onBoth, onEither) => {
  switch (self._tag) {
    case OpCodes.OP_LEFT:
      {
        return onLeft();
      }
    case OpCodes.OP_RIGHT:
      {
        return onRight();
      }
    case OpCodes.OP_BOTH:
      {
        return onBoth();
      }
    case OpCodes.OP_EITHER:
      {
        return onEither();
      }
  }
});
//# sourceMappingURL=haltStrategy.js.map