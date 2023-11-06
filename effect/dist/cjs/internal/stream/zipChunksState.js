"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PullRight = exports.PullLeft = exports.PullBoth = exports.OP_PULL_RIGHT = exports.OP_PULL_LEFT = exports.OP_PULL_BOTH = void 0;
/** @internal */
exports.OP_PULL_BOTH = "PullBoth";
/** @internal */
exports.OP_PULL_LEFT = "PullLet";
/** @internal */
exports.OP_PULL_RIGHT = "PullRight";
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
//# sourceMappingURL=zipChunksState.js.map