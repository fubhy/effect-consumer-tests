import * as Equal from "../../../Equal.js";
import { pipe } from "../../../Function.js";
import * as Hash from "../../../Hash.js";
import { hasProperty } from "../../../Predicate.js";
import * as OpCodes from "../opCodes/tExit.js";
/** @internal */
const TExitSymbolKey = "effect/TExit";
/** @internal */
export const TExitTypeId = /*#__PURE__*/Symbol.for(TExitSymbolKey);
/** @internal */
const variance = {
  _E: _ => _,
  _A: _ => _
};
/** @internal */
export const isExit = u => hasProperty(u, TExitTypeId);
/** @internal */
export const isFail = self => {
  return self._tag === OpCodes.OP_FAIL;
};
/** @internal */
export const isDie = self => {
  return self._tag === OpCodes.OP_DIE;
};
/** @internal */
export const isInterrupt = self => {
  return self._tag === OpCodes.OP_INTERRUPT;
};
/** @internal */
export const isSuccess = self => {
  return self._tag === OpCodes.OP_SUCCEED;
};
/** @internal */
export const isRetry = self => {
  return self._tag === OpCodes.OP_RETRY;
};
/** @internal */
export const fail = error => ({
  [TExitTypeId]: variance,
  _tag: OpCodes.OP_FAIL,
  error,
  [Hash.symbol]() {
    return pipe(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_FAIL)), Hash.combine(Hash.hash(error)));
  },
  [Equal.symbol](that) {
    return isExit(that) && that._tag === OpCodes.OP_FAIL && Equal.equals(error, that.error);
  }
});
/** @internal */
export const die = defect => ({
  [TExitTypeId]: variance,
  _tag: OpCodes.OP_DIE,
  defect,
  [Hash.symbol]() {
    return pipe(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_DIE)), Hash.combine(Hash.hash(defect)));
  },
  [Equal.symbol](that) {
    return isExit(that) && that._tag === OpCodes.OP_DIE && Equal.equals(defect, that.defect);
  }
});
/** @internal */
export const interrupt = fiberId => ({
  [TExitTypeId]: variance,
  _tag: OpCodes.OP_INTERRUPT,
  fiberId,
  [Hash.symbol]() {
    return pipe(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_INTERRUPT)), Hash.combine(Hash.hash(fiberId)));
  },
  [Equal.symbol](that) {
    return isExit(that) && that._tag === OpCodes.OP_INTERRUPT && Equal.equals(fiberId, that.fiberId);
  }
});
/** @internal */
export const succeed = value => ({
  [TExitTypeId]: variance,
  _tag: OpCodes.OP_SUCCEED,
  value,
  [Hash.symbol]() {
    return pipe(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_SUCCEED)), Hash.combine(Hash.hash(value)));
  },
  [Equal.symbol](that) {
    return isExit(that) && that._tag === OpCodes.OP_SUCCEED && Equal.equals(value, that.value);
  }
});
/** @internal */
export const retry = {
  [TExitTypeId]: variance,
  _tag: OpCodes.OP_RETRY,
  [Hash.symbol]() {
    return pipe(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_RETRY)), Hash.combine(Hash.hash("retry")));
  },
  [Equal.symbol](that) {
    return isExit(that) && isRetry(that);
  }
};
/** @internal */
export const unit = () => succeed(undefined);
//# sourceMappingURL=tExit.js.map