"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.current = exports.previous = exports.notStarted = exports.OP_CURRENT = exports.OP_PREVIOUS = exports.OP_NOT_STARTED = void 0;
/** @internal */
exports.OP_NOT_STARTED = "NotStarted";
/** @internal */
exports.OP_PREVIOUS = "Previous";
/** @internal */
exports.OP_CURRENT = "Current";
/** @internal */
exports.notStarted = {
  _tag: exports.OP_NOT_STARTED
};
/** @internal */
const previous = fiber => ({
  _tag: exports.OP_PREVIOUS,
  fiber
});
exports.previous = previous;
/** @internal */
const current = fiber => ({
  _tag: exports.OP_CURRENT,
  fiber
});
exports.current = current;
//# sourceMappingURL=debounceState.js.map