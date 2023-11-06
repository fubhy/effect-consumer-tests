"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fibersIn = exports.none = exports.fromEffect = exports.track = exports.unsafeTrack = exports.Const = exports.Track = exports.isZip = exports.Zip = exports.ProxySupervisor = exports.supervisorVariance = exports.SupervisorTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const SortedSet = /*#__PURE__*/require("../SortedSet.js");
const core = /*#__PURE__*/require("./core.js");
/** @internal */
const SupervisorSymbolKey = "effect/Supervisor";
/** @internal */
exports.SupervisorTypeId = /*#__PURE__*/Symbol.for(SupervisorSymbolKey);
/** @internal */
exports.supervisorVariance = {
  _T: _ => _
};
/** @internal */
class ProxySupervisor {
  underlying;
  value0;
  [exports.SupervisorTypeId] = exports.supervisorVariance;
  constructor(underlying, value0) {
    this.underlying = underlying;
    this.value0 = value0;
  }
  value() {
    return this.value0();
  }
  onStart(context, effect, parent, fiber) {
    this.underlying.onStart(context, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.underlying.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.underlying.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.underlying.onSuspend(fiber);
  }
  onResume(fiber) {
    this.underlying.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, () => (0, Function_js_1.pipe)(this.value(), core.map(f)));
  }
  zip(right) {
    return new Zip(this, right);
  }
}
exports.ProxySupervisor = ProxySupervisor;
/** @internal */
class Zip {
  left;
  right;
  _tag = "Zip";
  [exports.SupervisorTypeId] = exports.supervisorVariance;
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
  value() {
    return core.zip(this.left.value(), this.right.value());
  }
  onStart(context, effect, parent, fiber) {
    this.left.onStart(context, effect, parent, fiber);
    this.right.onStart(context, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.left.onEnd(value, fiber);
    this.right.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.left.onEffect(fiber, effect);
    this.right.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.left.onSuspend(fiber);
    this.right.onSuspend(fiber);
  }
  onResume(fiber) {
    this.left.onResume(fiber);
    this.right.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, () => (0, Function_js_1.pipe)(this.value(), core.map(f)));
  }
  zip(right) {
    return new Zip(this, right);
  }
}
exports.Zip = Zip;
const isZip = self => (0, Predicate_js_1.hasProperty)(self, exports.SupervisorTypeId) && (0, Predicate_js_1.isTagged)(self, "Zip");
exports.isZip = isZip;
class Track {
  [exports.SupervisorTypeId] = exports.supervisorVariance;
  fibers = new Set();
  value() {
    return core.sync(() => Array.from(this.fibers));
  }
  onStart(_context, _effect, _parent, fiber) {
    this.fibers.add(fiber);
  }
  onEnd(_value, fiber) {
    this.fibers.delete(fiber);
  }
  onEffect(_fiber, _effect) {
    //
  }
  onSuspend(_fiber) {
    //
  }
  onResume(_fiber) {
    //
  }
  map(f) {
    return new ProxySupervisor(this, () => (0, Function_js_1.pipe)(this.value(), core.map(f)));
  }
  zip(right) {
    return new Zip(this, right);
  }
  onRun(execution, _fiber) {
    return execution();
  }
}
exports.Track = Track;
class Const {
  effect;
  [exports.SupervisorTypeId] = exports.supervisorVariance;
  constructor(effect) {
    this.effect = effect;
  }
  value() {
    return this.effect;
  }
  onStart(_context, _effect, _parent, _fiber) {
    //
  }
  onEnd(_value, _fiber) {
    //
  }
  onEffect(_fiber, _effect) {
    //
  }
  onSuspend(_fiber) {
    //
  }
  onResume(_fiber) {
    //
  }
  map(f) {
    return new ProxySupervisor(this, () => (0, Function_js_1.pipe)(this.value(), core.map(f)));
  }
  zip(right) {
    return new Zip(this, right);
  }
  onRun(execution, _fiber) {
    return execution();
  }
}
exports.Const = Const;
class FibersIn {
  ref;
  [exports.SupervisorTypeId] = exports.supervisorVariance;
  constructor(ref) {
    this.ref = ref;
  }
  value() {
    return core.sync(() => MutableRef.get(this.ref));
  }
  onStart(_context, _effect, _parent, fiber) {
    (0, Function_js_1.pipe)(this.ref, MutableRef.set((0, Function_js_1.pipe)(MutableRef.get(this.ref), SortedSet.add(fiber))));
  }
  onEnd(_value, fiber) {
    (0, Function_js_1.pipe)(this.ref, MutableRef.set((0, Function_js_1.pipe)(MutableRef.get(this.ref), SortedSet.remove(fiber))));
  }
  onEffect(_fiber, _effect) {
    //
  }
  onSuspend(_fiber) {
    //
  }
  onResume(_fiber) {
    //
  }
  map(f) {
    return new ProxySupervisor(this, () => (0, Function_js_1.pipe)(this.value(), core.map(f)));
  }
  zip(right) {
    return new Zip(this, right);
  }
  onRun(execution, _fiber) {
    return execution();
  }
}
/** @internal */
const unsafeTrack = () => {
  return new Track();
};
exports.unsafeTrack = unsafeTrack;
/** @internal */
exports.track = /*#__PURE__*/core.sync(exports.unsafeTrack);
/** @internal */
const fromEffect = effect => {
  return new Const(effect);
};
exports.fromEffect = fromEffect;
/** @internal */
exports.none = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)("effect/Supervisor/none", () => (0, exports.fromEffect)(core.unit));
/** @internal */
const fibersIn = ref => core.sync(() => new FibersIn(ref));
exports.fibersIn = fibersIn;
//# sourceMappingURL=supervisor.js.map