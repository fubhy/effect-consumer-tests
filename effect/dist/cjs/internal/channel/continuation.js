"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContinuationFinalizerImpl = exports.ContinuationKImpl = exports.ContinuationTypeId = void 0;
const Exit = /*#__PURE__*/require("../../Exit.js");
const OpCodes = /*#__PURE__*/require("../opCodes/continuation.js");
/** @internal */
exports.ContinuationTypeId = /*#__PURE__*/Symbol.for("effect/ChannelContinuation");
/** @internal */
const continuationVariance = {
  _Env: _ => _,
  _InErr: _ => _,
  _InElem: _ => _,
  _InDone: _ => _,
  _OutErr: _ => _,
  _OutDone: _ => _,
  _OutErr2: _ => _,
  _OutElem: _ => _,
  _OutDone2: _ => _
};
/** @internal */
class ContinuationKImpl {
  onSuccess;
  onHalt;
  _tag = OpCodes.OP_CONTINUATION_K;
  [exports.ContinuationTypeId] = continuationVariance;
  constructor(onSuccess, onHalt) {
    this.onSuccess = onSuccess;
    this.onHalt = onHalt;
  }
  onExit(exit) {
    return Exit.isFailure(exit) ? this.onHalt(exit.cause) : this.onSuccess(exit.value);
  }
}
exports.ContinuationKImpl = ContinuationKImpl;
/** @internal */
class ContinuationFinalizerImpl {
  finalizer;
  _tag = OpCodes.OP_CONTINUATION_FINALIZER;
  [exports.ContinuationTypeId] = continuationVariance;
  constructor(finalizer) {
    this.finalizer = finalizer;
  }
}
exports.ContinuationFinalizerImpl = ContinuationFinalizerImpl;
//# sourceMappingURL=continuation.js.map