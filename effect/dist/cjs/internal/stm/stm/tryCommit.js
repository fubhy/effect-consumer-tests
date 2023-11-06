"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.suspend = exports.done = void 0;
const OpCodes = /*#__PURE__*/require("../opCodes/tryCommit.js");
/** @internal */
const done = exit => {
  return {
    _tag: OpCodes.OP_DONE,
    exit
  };
};
exports.done = done;
/** @internal */
const suspend = journal => {
  return {
    _tag: OpCodes.OP_SUSPEND,
    journal
  };
};
exports.suspend = suspend;
//# sourceMappingURL=tryCommit.js.map