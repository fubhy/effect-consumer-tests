"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.end = exports.halt = exports.emit = exports.OP_END = exports.OP_HALT = exports.OP_EMIT = void 0;
/** @internal */
exports.OP_EMIT = "Emit";
/** @internal */
exports.OP_HALT = "Halt";
/** @internal */
exports.OP_END = "End";
/** @internal */
const emit = elements => ({
  _tag: exports.OP_EMIT,
  elements
});
exports.emit = emit;
/** @internal */
const halt = cause => ({
  _tag: exports.OP_HALT,
  cause
});
exports.halt = halt;
/** @internal */
const end = reason => ({
  _tag: exports.OP_END,
  reason
});
exports.end = end;
//# sourceMappingURL=handoffSignal.js.map