"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = exports.make = exports.get = exports.fromAcquire = exports.ScopedRefTypeId = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const effect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const circular = /*#__PURE__*/require("./effect/circular.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const ref = /*#__PURE__*/require("./ref.js");
const synchronized = /*#__PURE__*/require("./synchronizedRef.js");
/** @internal */
const ScopedRefSymbolKey = "effect/ScopedRef";
/** @internal */
exports.ScopedRefTypeId = /*#__PURE__*/Symbol.for(ScopedRefSymbolKey);
/** @internal */
const scopedRefVariance = {
  _A: _ => _
};
/** @internal  */
const close = self => core.flatMap(ref.get(self.ref), tuple => tuple[0].close(core.exitUnit));
/** @internal */
const fromAcquire = acquire => core.uninterruptibleMask(restore => (0, Function_js_1.pipe)(fiberRuntime.scopeMake(), core.flatMap(newScope => (0, Function_js_1.pipe)(restore((0, Function_js_1.pipe)(acquire, core.mapInputContext(Context.add(fiberRuntime.scopeTag, newScope)))), core.onError(cause => newScope.close(core.exitFail(cause))), core.flatMap(value => (0, Function_js_1.pipe)(circular.makeSynchronized([newScope, value]), core.flatMap(ref => {
  const scopedRef = {
    [exports.ScopedRefTypeId]: scopedRefVariance,
    pipe() {
      return (0, Pipeable_js_1.pipeArguments)(this, arguments);
    },
    ref
  };
  return (0, Function_js_1.pipe)(fiberRuntime.addFinalizer(() => close(scopedRef)), core.as(scopedRef));
})))))));
exports.fromAcquire = fromAcquire;
/** @internal */
const get = self => core.map(ref.get(self.ref), tuple => tuple[1]);
exports.get = get;
/** @internal */
const make = evaluate => (0, exports.fromAcquire)(core.sync(evaluate));
exports.make = make;
/** @internal */
exports.set = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, acquire) => core.flatten(synchronized.modifyEffect(self.ref, ([oldScope, value]) => core.uninterruptibleMask(restore => (0, Function_js_1.pipe)(fiberRuntime.scopeMake(), core.flatMap(newScope => (0, Function_js_1.pipe)(restore((0, Function_js_1.pipe)(acquire, core.mapInputContext(Context.add(fiberRuntime.scopeTag, newScope)))), core.exit, core.flatMap(core.exitMatch({
  onFailure: cause => (0, Function_js_1.pipe)(newScope.close(core.exitUnit), effect.ignore, core.as([core.failCause(cause), [oldScope, value]])),
  onSuccess: value => (0, Function_js_1.pipe)(oldScope.close(core.exitUnit), effect.ignore, core.as([core.unit, [newScope, value]]))
})))))))));
//# sourceMappingURL=scopedRef.js.map