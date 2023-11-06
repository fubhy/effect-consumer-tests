"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.succeed = exports.poll = exports.make = exports.fail = exports.done = exports._await = exports.TDeferredTypeId = void 0;
const Either = /*#__PURE__*/require("../../Either.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
const core = /*#__PURE__*/require("./core.js");
const stm = /*#__PURE__*/require("./stm.js");
const tRef = /*#__PURE__*/require("./tRef.js");
/** @internal */
const TDeferredSymbolKey = "effect/TDeferred";
/** @internal */
exports.TDeferredTypeId = /*#__PURE__*/Symbol.for(TDeferredSymbolKey);
/** @internal */
const tDeferredVariance = {
  _E: _ => _,
  _A: _ => _
};
/** @internal */
class TDeferredImpl {
  ref;
  [exports.TDeferredTypeId] = tDeferredVariance;
  constructor(ref) {
    this.ref = ref;
  }
}
/** @internal */
const _await = self => stm.flatten(stm.collect(tRef.get(self.ref), option => Option.isSome(option) ? Option.some(stm.fromEither(option.value)) : Option.none()));
exports._await = _await;
/** @internal */
exports.done = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, either) => core.flatMap(tRef.get(self.ref), Option.match({
  onNone: () => core.zipRight(tRef.set(self.ref, Option.some(either)), core.succeed(true)),
  onSome: () => core.succeed(false)
})));
/** @internal */
exports.fail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, error) => (0, exports.done)(self, Either.left(error)));
/** @internal */
const make = () => core.map(tRef.make(Option.none()), ref => new TDeferredImpl(ref));
exports.make = make;
/** @internal */
const poll = self => tRef.get(self.ref);
exports.poll = poll;
/** @internal */
exports.succeed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.done)(self, Either.right(value)));
//# sourceMappingURL=tDeferred.js.map