"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refresh = exports.get = exports.manual = exports.auto = exports.ResourceTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const core = /*#__PURE__*/require("./core.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const _schedule = /*#__PURE__*/require("./schedule.js");
const scopedRef = /*#__PURE__*/require("./scopedRef.js");
/** @internal */
const ResourceSymbolKey = "effect/Resource";
/** @internal */
exports.ResourceTypeId = /*#__PURE__*/Symbol.for(ResourceSymbolKey);
/** @internal */
const cachedVariance = {
  _E: _ => _,
  _A: _ => _
};
/** @internal */
const auto = (acquire, policy) => core.tap((0, exports.manual)(acquire), manual => fiberRuntime.acquireRelease((0, Function_js_1.pipe)((0, exports.refresh)(manual), _schedule.schedule_Effect(policy), core.interruptible, fiberRuntime.forkDaemon), core.interruptFiber));
exports.auto = auto;
/** @internal */
const manual = acquire => core.flatMap(core.context(), env => (0, Function_js_1.pipe)(scopedRef.fromAcquire(core.exit(acquire)), core.map(ref => ({
  [exports.ResourceTypeId]: cachedVariance,
  scopedRef: ref,
  acquire: () => core.provideContext(acquire, env)
}))));
exports.manual = manual;
/** @internal */
const get = self => core.flatMap(scopedRef.get(self.scopedRef), Function_js_1.identity);
exports.get = get;
/** @internal */
const refresh = self => scopedRef.set(self.scopedRef, core.map(self.acquire(), core.exitSucceed));
exports.refresh = refresh;
//# sourceMappingURL=resource.js.map