"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.done = exports.pending = exports.deferredVariance = exports.DeferredTypeId = void 0;
const OpCodes = /*#__PURE__*/require("./opCodes/deferred.js");
/** @internal */
const DeferredSymbolKey = "effect/Deferred";
/** @internal */
exports.DeferredTypeId = /*#__PURE__*/Symbol.for(DeferredSymbolKey);
/** @internal */
exports.deferredVariance = {
  _E: _ => _,
  _A: _ => _
};
/** @internal */
const pending = joiners => {
  return {
    _tag: OpCodes.OP_STATE_PENDING,
    joiners
  };
};
exports.pending = pending;
/** @internal */
const done = effect => {
  return {
    _tag: OpCodes.OP_STATE_DONE,
    effect
  };
};
exports.done = done;
//# sourceMappingURL=deferred.js.map