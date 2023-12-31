import * as Context from "../Context.js";
import { dual, pipe } from "../Function.js";
import { pipeArguments } from "../Pipeable.js";
import * as effect from "./core-effect.js";
import * as core from "./core.js";
import * as circular from "./effect/circular.js";
import * as fiberRuntime from "./fiberRuntime.js";
import * as ref from "./ref.js";
import * as synchronized from "./synchronizedRef.js";
/** @internal */
const ScopedRefSymbolKey = "effect/ScopedRef";
/** @internal */
export const ScopedRefTypeId = /*#__PURE__*/Symbol.for(ScopedRefSymbolKey);
/** @internal */
const scopedRefVariance = {
  _A: _ => _
};
/** @internal  */
const close = self => core.flatMap(ref.get(self.ref), tuple => tuple[0].close(core.exitUnit));
/** @internal */
export const fromAcquire = acquire => core.uninterruptibleMask(restore => pipe(fiberRuntime.scopeMake(), core.flatMap(newScope => pipe(restore(pipe(acquire, core.mapInputContext(Context.add(fiberRuntime.scopeTag, newScope)))), core.onError(cause => newScope.close(core.exitFail(cause))), core.flatMap(value => pipe(circular.makeSynchronized([newScope, value]), core.flatMap(ref => {
  const scopedRef = {
    [ScopedRefTypeId]: scopedRefVariance,
    pipe() {
      return pipeArguments(this, arguments);
    },
    ref
  };
  return pipe(fiberRuntime.addFinalizer(() => close(scopedRef)), core.as(scopedRef));
})))))));
/** @internal */
export const get = self => core.map(ref.get(self.ref), tuple => tuple[1]);
/** @internal */
export const make = evaluate => fromAcquire(core.sync(evaluate));
/** @internal */
export const set = /*#__PURE__*/dual(2, (self, acquire) => core.flatten(synchronized.modifyEffect(self.ref, ([oldScope, value]) => core.uninterruptibleMask(restore => pipe(fiberRuntime.scopeMake(), core.flatMap(newScope => pipe(restore(pipe(acquire, core.mapInputContext(Context.add(fiberRuntime.scopeTag, newScope)))), core.exit, core.flatMap(core.exitMatch({
  onFailure: cause => pipe(newScope.close(core.exitUnit), effect.ignore, core.as([core.failCause(cause), [oldScope, value]])),
  onSuccess: value => pipe(oldScope.close(core.exitUnit), effect.ignore, core.as([core.unit, [newScope, value]]))
})))))))));
//# sourceMappingURL=scopedRef.js.map