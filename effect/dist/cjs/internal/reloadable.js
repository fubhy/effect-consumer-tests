"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reloadFork = exports.reload = exports.reloadableTag = exports.manual = exports.get = exports.autoFromConfig = exports.auto = exports.ReloadableTypeId = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const effect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const _layer = /*#__PURE__*/require("./layer.js");
const _schedule = /*#__PURE__*/require("./schedule.js");
const scopedRef = /*#__PURE__*/require("./scopedRef.js");
/** @internal */
const ReloadableSymbolKey = "effect/Reloadable";
/** @internal */
exports.ReloadableTypeId = /*#__PURE__*/Symbol.for(ReloadableSymbolKey);
/** @internal */
const reloadableVariance = {
  _A: _ => _
};
/** @internal */
const auto = (tag, options) => _layer.scoped((0, exports.reloadableTag)(tag), (0, Function_js_1.pipe)(_layer.build((0, exports.manual)(tag, {
  layer: options.layer
})), core.map(Context.unsafeGet((0, exports.reloadableTag)(tag))), core.tap(reloadable => fiberRuntime.acquireRelease((0, Function_js_1.pipe)(reloadable.reload(), effect.ignoreLogged, _schedule.schedule_Effect(options.schedule), fiberRuntime.forkDaemon), core.interruptFiber))));
exports.auto = auto;
/** @internal */
const autoFromConfig = (tag, options) => _layer.scoped((0, exports.reloadableTag)(tag), (0, Function_js_1.pipe)(core.context(), core.flatMap(env => (0, Function_js_1.pipe)(_layer.build((0, exports.auto)(tag, {
  layer: options.layer,
  schedule: options.scheduleFromConfig(env)
})), core.map(Context.unsafeGet((0, exports.reloadableTag)(tag)))))));
exports.autoFromConfig = autoFromConfig;
/** @internal */
const get = tag => core.flatMap((0, exports.reloadableTag)(tag), reloadable => scopedRef.get(reloadable.scopedRef));
exports.get = get;
/** @internal */
const manual = (tag, options) => _layer.scoped((0, exports.reloadableTag)(tag), (0, Function_js_1.pipe)(core.context(), core.flatMap(env => (0, Function_js_1.pipe)(scopedRef.fromAcquire((0, Function_js_1.pipe)(_layer.build(options.layer), core.map(Context.unsafeGet(tag)))), core.map(ref => ({
  [exports.ReloadableTypeId]: reloadableVariance,
  scopedRef: ref,
  reload: () => (0, Function_js_1.pipe)(scopedRef.set(ref, (0, Function_js_1.pipe)(_layer.build(options.layer), core.map(Context.unsafeGet(tag)))), core.provideContext(env))
}))))));
exports.manual = manual;
/** @internal */
const tagMap = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Reloadable/tagMap"), () => new WeakMap([]));
/** @internal */
const reloadableTag = tag => {
  if (tagMap.has(tag)) {
    return tagMap.get(tag);
  }
  const newTag = Context.Tag();
  tagMap.set(tag, newTag);
  return newTag;
};
exports.reloadableTag = reloadableTag;
/** @internal */
const reload = tag => core.flatMap((0, exports.reloadableTag)(tag), reloadable => reloadable.reload());
exports.reload = reload;
/** @internal */
const reloadFork = tag => core.flatMap((0, exports.reloadableTag)(tag), reloadable => (0, Function_js_1.pipe)(reloadable.reload(), effect.ignoreLogged, fiberRuntime.forkDaemon, core.asUnit));
exports.reloadFork = reloadFork;
//# sourceMappingURL=reloadable.js.map