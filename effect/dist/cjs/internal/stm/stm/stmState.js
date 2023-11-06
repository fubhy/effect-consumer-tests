"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromTExit = exports.running = exports.interrupted = exports.done = exports.isInterrupted = exports.isDone = exports.isRunning = exports.isSTMState = exports.STMStateTypeId = void 0;
const Equal = /*#__PURE__*/require("../../../Equal.js");
const Exit = /*#__PURE__*/require("../../../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../../../Function.js");
const Hash = /*#__PURE__*/require("../../../Hash.js");
const Predicate_js_1 = /*#__PURE__*/require("../../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/stmState.js");
const TExitOpCodes = /*#__PURE__*/require("../opCodes/tExit.js");
/** @internal */
const STMStateSymbolKey = "effect/STM/State";
/** @internal */
exports.STMStateTypeId = /*#__PURE__*/Symbol.for(STMStateSymbolKey);
/** @internal */
const isSTMState = u => (0, Predicate_js_1.hasProperty)(u, exports.STMStateTypeId);
exports.isSTMState = isSTMState;
/** @internal */
const isRunning = self => {
  return self._tag === OpCodes.OP_RUNNING;
};
exports.isRunning = isRunning;
/** @internal */
const isDone = self => {
  return self._tag === OpCodes.OP_DONE;
};
exports.isDone = isDone;
/** @internal */
const isInterrupted = self => {
  return self._tag === OpCodes.OP_INTERRUPTED;
};
exports.isInterrupted = isInterrupted;
/** @internal */
const done = exit => {
  return {
    [exports.STMStateTypeId]: exports.STMStateTypeId,
    _tag: OpCodes.OP_DONE,
    exit,
    [Hash.symbol]() {
      return (0, Function_js_1.pipe)(Hash.hash(STMStateSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_DONE)), Hash.combine(Hash.hash(exit)));
    },
    [Equal.symbol](that) {
      return (0, exports.isSTMState)(that) && that._tag === OpCodes.OP_DONE && Equal.equals(exit, that.exit);
    }
  };
};
exports.done = done;
/** @internal */
exports.interrupted = {
  [exports.STMStateTypeId]: exports.STMStateTypeId,
  _tag: OpCodes.OP_INTERRUPTED,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(STMStateSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_INTERRUPTED)), Hash.combine(Hash.hash("interrupted")));
  },
  [Equal.symbol](that) {
    return (0, exports.isSTMState)(that) && that._tag === OpCodes.OP_INTERRUPTED;
  }
};
/** @internal */
exports.running = {
  [exports.STMStateTypeId]: exports.STMStateTypeId,
  _tag: OpCodes.OP_RUNNING,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(STMStateSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_RUNNING)), Hash.combine(Hash.hash("running")));
  },
  [Equal.symbol](that) {
    return (0, exports.isSTMState)(that) && that._tag === OpCodes.OP_RUNNING;
  }
};
/** @internal */
const fromTExit = tExit => {
  switch (tExit._tag) {
    case TExitOpCodes.OP_FAIL:
      {
        return (0, exports.done)(Exit.fail(tExit.error));
      }
    case TExitOpCodes.OP_DIE:
      {
        return (0, exports.done)(Exit.die(tExit.defect));
      }
    case TExitOpCodes.OP_INTERRUPT:
      {
        return (0, exports.done)(Exit.interrupt(tExit.fiberId));
      }
    case TExitOpCodes.OP_SUCCEED:
      {
        return (0, exports.done)(Exit.succeed(tExit.value));
      }
    case TExitOpCodes.OP_RETRY:
      {
        throw new Error("BUG: STM.STMState.fromTExit - please report an issue at https://github.com/Effect-TS/io/issues");
      }
  }
};
exports.fromTExit = fromTExit;
//# sourceMappingURL=stmState.js.map