"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StructuralBase = exports.Base = exports.StructuralCommitPrototype = exports.CommitPrototype = exports.EffectPrototype = exports.channelVariance = exports.sinkVariance = exports.effectVariance = exports.ChannelTypeId = exports.SinkTypeId = exports.StreamTypeId = exports.EffectTypeId = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Data = /*#__PURE__*/require("./data.js");
const OpCodes = /*#__PURE__*/require("./opCodes/effect.js");
const version_js_1 = /*#__PURE__*/require("./version.js");
/** @internal */
exports.EffectTypeId = /*#__PURE__*/Symbol.for("effect/Effect");
/** @internal */
exports.StreamTypeId = /*#__PURE__*/Symbol.for("effect/Stream");
/** @internal */
exports.SinkTypeId = /*#__PURE__*/Symbol.for("effect/Sink");
/** @internal */
exports.ChannelTypeId = /*#__PURE__*/Symbol.for("effect/Channel");
/** @internal */
exports.effectVariance = {
  _R: _ => _,
  _E: _ => _,
  _A: _ => _,
  _V: version_js_1.moduleVersion
};
/** @internal */
exports.sinkVariance = {
  _R: _ => _,
  _E: _ => _,
  _In: _ => _,
  _L: _ => _,
  _Z: _ => _
};
/** @internal */
exports.channelVariance = {
  _Env: _ => _,
  _InErr: _ => _,
  _InElem: _ => _,
  _InDone: _ => _,
  _OutErr: _ => _,
  _OutElem: _ => _,
  _OutDone: _ => _
};
/** @internal */
exports.EffectPrototype = {
  [exports.EffectTypeId]: exports.effectVariance,
  [exports.StreamTypeId]: exports.effectVariance,
  [exports.SinkTypeId]: exports.sinkVariance,
  [exports.ChannelTypeId]: exports.channelVariance,
  [Equal.symbol](that) {
    return this === that;
  },
  [Hash.symbol]() {
    return Hash.random(this);
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
exports.CommitPrototype = {
  ...exports.EffectPrototype,
  _op: OpCodes.OP_COMMIT
};
/** @internal */
exports.StructuralCommitPrototype = {
  ...exports.CommitPrototype,
  ...Data.Structural.prototype
};
/** @internal */
exports.Base = /*#__PURE__*/function () {
  function Base() {}
  Base.prototype = exports.CommitPrototype;
  return Base;
}();
/** @internal */
exports.StructuralBase = /*#__PURE__*/function () {
  function Base() {}
  Base.prototype = exports.StructuralCommitPrototype;
  return Base;
}();
//# sourceMappingURL=effectable.js.map