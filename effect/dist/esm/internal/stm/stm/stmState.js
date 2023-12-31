import * as Equal from "../../../Equal.js";
import * as Exit from "../../../Exit.js";
import { pipe } from "../../../Function.js";
import * as Hash from "../../../Hash.js";
import { hasProperty } from "../../../Predicate.js";
import * as OpCodes from "../opCodes/stmState.js";
import * as TExitOpCodes from "../opCodes/tExit.js";
/** @internal */
const STMStateSymbolKey = "effect/STM/State";
/** @internal */
export const STMStateTypeId = /*#__PURE__*/Symbol.for(STMStateSymbolKey);
/** @internal */
export const isSTMState = u => hasProperty(u, STMStateTypeId);
/** @internal */
export const isRunning = self => {
  return self._tag === OpCodes.OP_RUNNING;
};
/** @internal */
export const isDone = self => {
  return self._tag === OpCodes.OP_DONE;
};
/** @internal */
export const isInterrupted = self => {
  return self._tag === OpCodes.OP_INTERRUPTED;
};
/** @internal */
export const done = exit => {
  return {
    [STMStateTypeId]: STMStateTypeId,
    _tag: OpCodes.OP_DONE,
    exit,
    [Hash.symbol]() {
      return pipe(Hash.hash(STMStateSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_DONE)), Hash.combine(Hash.hash(exit)));
    },
    [Equal.symbol](that) {
      return isSTMState(that) && that._tag === OpCodes.OP_DONE && Equal.equals(exit, that.exit);
    }
  };
};
/** @internal */
export const interrupted = {
  [STMStateTypeId]: STMStateTypeId,
  _tag: OpCodes.OP_INTERRUPTED,
  [Hash.symbol]() {
    return pipe(Hash.hash(STMStateSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_INTERRUPTED)), Hash.combine(Hash.hash("interrupted")));
  },
  [Equal.symbol](that) {
    return isSTMState(that) && that._tag === OpCodes.OP_INTERRUPTED;
  }
};
/** @internal */
export const running = {
  [STMStateTypeId]: STMStateTypeId,
  _tag: OpCodes.OP_RUNNING,
  [Hash.symbol]() {
    return pipe(Hash.hash(STMStateSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_RUNNING)), Hash.combine(Hash.hash("running")));
  },
  [Equal.symbol](that) {
    return isSTMState(that) && that._tag === OpCodes.OP_RUNNING;
  }
};
/** @internal */
export const fromTExit = tExit => {
  switch (tExit._tag) {
    case TExitOpCodes.OP_FAIL:
      {
        return done(Exit.fail(tExit.error));
      }
    case TExitOpCodes.OP_DIE:
      {
        return done(Exit.die(tExit.defect));
      }
    case TExitOpCodes.OP_INTERRUPT:
      {
        return done(Exit.interrupt(tExit.fiberId));
      }
    case TExitOpCodes.OP_SUCCEED:
      {
        return done(Exit.succeed(tExit.value));
      }
    case TExitOpCodes.OP_RETRY:
      {
        throw new Error("BUG: STM.STMState.fromTExit - please report an issue at https://github.com/Effect-TS/io/issues");
      }
  }
};
//# sourceMappingURL=stmState.js.map