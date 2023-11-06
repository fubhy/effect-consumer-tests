"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeSet = exports.unsafeGet = exports.updateSomeAndGet = exports.updateSome = exports.updateAndGet = exports.update = exports.modifySome = exports.modify = exports.setAndGet = exports.getAndUpdateSome = exports.getAndUpdate = exports.getAndSet = exports.set = exports.get = exports.make = exports.TRefImpl = exports.TRefTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
const core = /*#__PURE__*/require("./core.js");
const Entry = /*#__PURE__*/require("./stm/entry.js");
const Versioned = /*#__PURE__*/require("./stm/versioned.js");
/** @internal */
const TRefSymbolKey = "effect/TRef";
/** @internal */
exports.TRefTypeId = /*#__PURE__*/Symbol.for(TRefSymbolKey);
/** @internal */
const tRefVariance = {
  _A: _ => _
};
/** @internal */
class TRefImpl {
  [exports.TRefTypeId] = tRefVariance;
  /** @internal */
  todos;
  /** @internal */
  versioned;
  constructor(value) {
    this.versioned = new Versioned.Versioned(value);
    this.todos = new Map();
  }
  modify(f) {
    return core.effect(journal => {
      const entry = getOrMakeEntry(this, journal);
      const [retValue, newValue] = f(Entry.unsafeGet(entry));
      Entry.unsafeSet(entry, newValue);
      return retValue;
    });
  }
}
exports.TRefImpl = TRefImpl;
/** @internal */
const make = value => core.effect(journal => {
  const ref = new TRefImpl(value);
  journal.set(ref, Entry.make(ref, true));
  return ref;
});
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
exports.getAndUpdateSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => Option.match(f(a), {
  onNone: () => [a, a],
  onSome: b => [a, b]
})));
/** @internal */
exports.setAndGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.modify(() => [value, value]));
/** @internal */
exports.modify = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(f));
/** @internal */
exports.modifySome = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, fallback, f) => self.modify(a => Option.match(f(a), {
  onNone: () => [fallback, a],
  onSome: b => b
})));
/** @internal */
exports.update = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => [void 0, f(a)]));
/** @internal */
exports.updateAndGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => {
  const b = f(a);
  return [b, b];
}));
/** @internal */
exports.updateSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => [void 0, Option.match(f(a), {
  onNone: () => a,
  onSome: b => b
})]));
/** @internal */
exports.updateSomeAndGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(a => Option.match(f(a), {
  onNone: () => [a, a],
  onSome: b => [b, b]
})));
/** @internal */
const getOrMakeEntry = (self, journal) => {
  if (journal.has(self)) {
    return journal.get(self);
  }
  const entry = Entry.make(self, false);
  journal.set(self, entry);
  return entry;
};
/** @internal */
exports.unsafeGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, journal) => Entry.unsafeGet(getOrMakeEntry(self, journal)));
/** @internal */
exports.unsafeSet = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, value, journal) => {
  const entry = getOrMakeEntry(self, journal);
  Entry.unsafeSet(entry, value);
  return undefined;
});
//# sourceMappingURL=tRef.js.map