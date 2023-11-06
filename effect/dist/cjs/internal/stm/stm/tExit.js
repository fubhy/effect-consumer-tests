"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unit = exports.retry = exports.succeed = exports.interrupt = exports.die = exports.fail = exports.isRetry = exports.isSuccess = exports.isInterrupt = exports.isDie = exports.isFail = exports.isExit = exports.TExitTypeId = void 0;
const Equal = /*#__PURE__*/require("../../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../../Function.js");
const Hash = /*#__PURE__*/require("../../../Hash.js");
const Predicate_js_1 = /*#__PURE__*/require("../../../Predicate.js");
const OpCodes = /*#__PURE__*/require("../opCodes/tExit.js");
/** @internal */
const TExitSymbolKey = "effect/TExit";
/** @internal */
exports.TExitTypeId = /*#__PURE__*/Symbol.for(TExitSymbolKey);
/** @internal */
const variance = {
  _E: _ => _,
  _A: _ => _
};
/** @internal */
const isExit = u => (0, Predicate_js_1.hasProperty)(u, exports.TExitTypeId);
exports.isExit = isExit;
/** @internal */
const isFail = self => {
  return self._tag === OpCodes.OP_FAIL;
};
exports.isFail = isFail;
/** @internal */
const isDie = self => {
  return self._tag === OpCodes.OP_DIE;
};
exports.isDie = isDie;
/** @internal */
const isInterrupt = self => {
  return self._tag === OpCodes.OP_INTERRUPT;
};
exports.isInterrupt = isInterrupt;
/** @internal */
const isSuccess = self => {
  return self._tag === OpCodes.OP_SUCCEED;
};
exports.isSuccess = isSuccess;
/** @internal */
const isRetry = self => {
  return self._tag === OpCodes.OP_RETRY;
};
exports.isRetry = isRetry;
/** @internal */
const fail = error => ({
  [exports.TExitTypeId]: variance,
  _tag: OpCodes.OP_FAIL,
  error,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_FAIL)), Hash.combine(Hash.hash(error)));
  },
  [Equal.symbol](that) {
    return (0, exports.isExit)(that) && that._tag === OpCodes.OP_FAIL && Equal.equals(error, that.error);
  }
});
exports.fail = fail;
/** @internal */
const die = defect => ({
  [exports.TExitTypeId]: variance,
  _tag: OpCodes.OP_DIE,
  defect,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_DIE)), Hash.combine(Hash.hash(defect)));
  },
  [Equal.symbol](that) {
    return (0, exports.isExit)(that) && that._tag === OpCodes.OP_DIE && Equal.equals(defect, that.defect);
  }
});
exports.die = die;
/** @internal */
const interrupt = fiberId => ({
  [exports.TExitTypeId]: variance,
  _tag: OpCodes.OP_INTERRUPT,
  fiberId,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_INTERRUPT)), Hash.combine(Hash.hash(fiberId)));
  },
  [Equal.symbol](that) {
    return (0, exports.isExit)(that) && that._tag === OpCodes.OP_INTERRUPT && Equal.equals(fiberId, that.fiberId);
  }
});
exports.interrupt = interrupt;
/** @internal */
const succeed = value => ({
  [exports.TExitTypeId]: variance,
  _tag: OpCodes.OP_SUCCEED,
  value,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_SUCCEED)), Hash.combine(Hash.hash(value)));
  },
  [Equal.symbol](that) {
    return (0, exports.isExit)(that) && that._tag === OpCodes.OP_SUCCEED && Equal.equals(value, that.value);
  }
});
exports.succeed = succeed;
/** @internal */
exports.retry = {
  [exports.TExitTypeId]: variance,
  _tag: OpCodes.OP_RETRY,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(TExitSymbolKey), Hash.combine(Hash.hash(OpCodes.OP_RETRY)), Hash.combine(Hash.hash("retry")));
  },
  [Equal.symbol](that) {
    return (0, exports.isExit)(that) && (0, exports.isRetry)(that);
  }
};
/** @internal */
const unit = () => (0, exports.succeed)(undefined);
exports.unit = unit;
//# sourceMappingURL=tExit.js.map