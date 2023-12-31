import * as Context from "../Context.js";
import { pipe } from "../Function.js";
import { globalValue } from "../GlobalValue.js";
import * as effect from "./core-effect.js";
import * as core from "./core.js";
import * as fiberRuntime from "./fiberRuntime.js";
import * as _layer from "./layer.js";
import * as _schedule from "./schedule.js";
import * as scopedRef from "./scopedRef.js";
/** @internal */
const ReloadableSymbolKey = "effect/Reloadable";
/** @internal */
export const ReloadableTypeId = /*#__PURE__*/Symbol.for(ReloadableSymbolKey);
/** @internal */
const reloadableVariance = {
  _A: _ => _
};
/** @internal */
export const auto = (tag, options) => _layer.scoped(reloadableTag(tag), pipe(_layer.build(manual(tag, {
  layer: options.layer
})), core.map(Context.unsafeGet(reloadableTag(tag))), core.tap(reloadable => fiberRuntime.acquireRelease(pipe(reloadable.reload(), effect.ignoreLogged, _schedule.schedule_Effect(options.schedule), fiberRuntime.forkDaemon), core.interruptFiber))));
/** @internal */
export const autoFromConfig = (tag, options) => _layer.scoped(reloadableTag(tag), pipe(core.context(), core.flatMap(env => pipe(_layer.build(auto(tag, {
  layer: options.layer,
  schedule: options.scheduleFromConfig(env)
})), core.map(Context.unsafeGet(reloadableTag(tag)))))));
/** @internal */
export const get = tag => core.flatMap(reloadableTag(tag), reloadable => scopedRef.get(reloadable.scopedRef));
/** @internal */
export const manual = (tag, options) => _layer.scoped(reloadableTag(tag), pipe(core.context(), core.flatMap(env => pipe(scopedRef.fromAcquire(pipe(_layer.build(options.layer), core.map(Context.unsafeGet(tag)))), core.map(ref => ({
  [ReloadableTypeId]: reloadableVariance,
  scopedRef: ref,
  reload: () => pipe(scopedRef.set(ref, pipe(_layer.build(options.layer), core.map(Context.unsafeGet(tag)))), core.provideContext(env))
}))))));
/** @internal */
const tagMap = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/Reloadable/tagMap"), () => new WeakMap([]));
/** @internal */
export const reloadableTag = tag => {
  if (tagMap.has(tag)) {
    return tagMap.get(tag);
  }
  const newTag = Context.Tag();
  tagMap.set(tag, newTag);
  return newTag;
};
/** @internal */
export const reload = tag => core.flatMap(reloadableTag(tag), reloadable => reloadable.reload());
/** @internal */
export const reloadFork = tag => core.flatMap(reloadableTag(tag), reloadable => pipe(reloadable.reload(), effect.ignoreLogged, fiberRuntime.forkDaemon, core.asUnit));
//# sourceMappingURL=reloadable.js.map