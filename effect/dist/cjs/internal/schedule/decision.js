"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDone = exports.isContinue = exports.done = exports.continueWith = exports._continue = exports.OP_DONE = exports.OP_CONTINUE = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Intervals = /*#__PURE__*/require("../../ScheduleIntervals.js");
/** @internal */
exports.OP_CONTINUE = "Continue";
/** @internal */
exports.OP_DONE = "Done";
/** @internal */
const _continue = intervals => {
  return {
    _tag: exports.OP_CONTINUE,
    intervals
  };
};
exports._continue = _continue;
/** @internal */
const continueWith = interval => {
  return {
    _tag: exports.OP_CONTINUE,
    intervals: Intervals.make(Chunk.of(interval))
  };
};
exports.continueWith = continueWith;
/** @internal */
exports.done = {
  _tag: exports.OP_DONE
};
/** @internal */
const isContinue = self => {
  return self._tag === exports.OP_CONTINUE;
};
exports.isContinue = isContinue;
/** @internal */
const isDone = self => {
  return self._tag === exports.OP_DONE;
};
exports.isDone = isDone;
//# sourceMappingURL=decision.js.map