"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDone = exports.isPending = exports.isStart = exports.done = exports.pending = exports.start = exports.OP_WARNING_DATA_DONE = exports.OP_WARNING_DATA_PENDING = exports.OP_WARNING_DATA_START = void 0;
/** @internal */
exports.OP_WARNING_DATA_START = "Start";
/** @internal */
exports.OP_WARNING_DATA_PENDING = "Pending";
/** @internal */
exports.OP_WARNING_DATA_DONE = "Done";
/**
 * State indicating that a test has not used time.
 *
 * @internal
 */
exports.start = {
  _tag: exports.OP_WARNING_DATA_START
};
/**
 * State indicating that a test has used time but has not adjusted the
 * `TestClock` with a reference to the fiber that will display the warning
 * message.
 *
 * @internal
 */
const pending = fiber => {
  return {
    _tag: exports.OP_WARNING_DATA_PENDING,
    fiber
  };
};
exports.pending = pending;
/**
 * State indicating that a test has used time or the warning message has
 * already been displayed.
 *
 * @internal
 */
exports.done = {
  _tag: exports.OP_WARNING_DATA_DONE
};
/** @internal */
const isStart = self => {
  return self._tag === exports.OP_WARNING_DATA_START;
};
exports.isStart = isStart;
/** @internal */
const isPending = self => {
  return self._tag === exports.OP_WARNING_DATA_PENDING;
};
exports.isPending = isPending;
/** @internal */
const isDone = self => {
  return self._tag === exports.OP_WARNING_DATA_DONE;
};
exports.isDone = isDone;
//# sourceMappingURL=warningData.js.map