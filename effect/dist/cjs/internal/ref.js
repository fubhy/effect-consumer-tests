"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeGet = exports.updateSomeAndGet = exports.updateSome = exports.updateAndGet = exports.update = exports.modifySome = exports.modify = exports.setAndGet = exports.getAndUpdateSome = exports.getAndUpdate = exports.getAndSet = exports.set = exports.get = exports.make = exports.unsafeMake = exports.refVariance = exports.RefTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const core = /*#__PURE__*/require("./core.js");
/** @internal */
exports.RefTypeId = /*#__PURE__*/Symbol.for("effect/Ref");
/** @internal */
exports.refVariance = {
  _A: _ => _
};
class RefImpl {
  ref;
  [exports.RefTypeId] = exports.refVariance;
  constructor(ref) {
    this.ref = ref;
  }
  modify(f) {
    return core.sync(() => {
      const current = MutableRef.get(this.ref);
      const [b, a] = f(current);
      if (current !== a) {
        MutableRef.set(a)(this.ref);
      }
      return b;
    });
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
const unsafeMake = value => new RefImpl(MutableRef.make(value));
exports.unsafeMake = unsafeMake;
/** @internal */
const make = value => core.sync(() => (0, exports.unsafeMake)(value));
exports.make = make;
/** @internal */
const get = self => self.modify(a => [a, a]);
exports.get = get;
/** @internal */
exports.set = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.modify(() => [void 0, value]));
/** @internal */
exports.getAndSet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.modify(a => [a, value]));
/** @internal */
exports.getAndUpdate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => [a, f(a)]));
/** @internal */
exports.getAndUpdateSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => self.modify(value => {
  const option = pf(value);
  switch (option._tag) {
    case "None":
      {
        return [value, value];
      }
    case "Some":
      {
        return [value, option.value];
      }
  }
}));
/** @internal */
exports.setAndGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.modify(() => [value, value]));
/** @internal */
exports.modify = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(f));
/** @internal */
exports.modifySome = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, fallback, pf) => self.modify(value => {
  const option = pf(value);
  switch (option._tag) {
    case "None":
      {
        return [fallback, value];
      }
    case "Some":
      {
        return option.value;
      }
  }
}));
/** @internal */
exports.update = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => [void 0, f(a)]));
/** @internal */
exports.updateAndGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => {
  const result = f(a);
  return [result, result];
}));
/** @internal */
exports.updateSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => [void 0, Option.match(f(a), {
  onNone: () => a,
  onSome: b => b
})]));
/** @internal */
exports.updateSomeAndGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => self.modify(value => {
  const option = pf(value);
  switch (option._tag) {
    case "None":
      {
        return [value, value];
      }
    case "Some":
      {
        return [option.value, option.value];
      }
  }
}));
/** @internal */
const unsafeGet = self => MutableRef.get(self.ref);
exports.unsafeGet = unsafeGet;
//# sourceMappingURL=ref.js.map