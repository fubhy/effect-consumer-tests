"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PullRight = exports.PullLeft = exports.PullBoth = exports.DrainRight = exports.DrainLeft = exports.OP_PULL_RIGHT = exports.OP_PULL_LEFT = exports.OP_PULL_BOTH = exports.OP_DRAIN_RIGHT = exports.OP_DRAIN_LEFT = void 0;
/** @internal */
exports.OP_DRAIN_LEFT = "DrainLeft";
/** @internal */
exports.OP_DRAIN_RIGHT = "DrainRight";
/** @internal */
exports.OP_PULL_BOTH = "PullBoth";
/** @internal */
exports.OP_PULL_LEFT = "PullLeft";
/** @internal */
exports.OP_PULL_RIGHT = "PullRight";
/** @internal */
exports.DrainLeft = {
  _tag: exports.OP_DRAIN_LEFT
};
/** @internal */
exports.DrainRight = {
  _tag: exports.OP_DRAIN_RIGHT
};
/** @internal */
exports.PullBoth = {
  _tag: exports.OP_PULL_BOTH
};
/** @internal */
const PullLeft = rightChunk => ({
  _tag: exports.OP_PULL_LEFT,
  rightChunk
});
exports.PullLeft = PullLeft;
/** @internal */
const PullRight = leftChunk => ({
  _tag: exports.OP_PULL_RIGHT,
  leftChunk
});
exports.PullRight = PullRight;
//# sourceMappingURL=zipAllState.js.map