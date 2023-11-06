"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.union = exports.transformSTM = exports.transform = exports.toReadonlySet = exports.toReadonlyArray = exports.toHashSet = exports.toChunk = exports.takeSomeSTM = exports.takeSome = exports.takeFirstSTM = exports.takeFirst = exports.size = exports.retainIfDiscard = exports.retainIf = exports.removeIfDiscard = exports.removeIf = exports.removeAll = exports.remove = exports.reduceSTM = exports.reduce = exports.make = exports.isEmpty = exports.intersection = exports.has = exports.fromIterable = exports.forEach = exports.empty = exports.difference = exports.add = exports.TSetTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const HashSet = /*#__PURE__*/require("../../HashSet.js");
const RA = /*#__PURE__*/require("../../ReadonlyArray.js");
const core = /*#__PURE__*/require("./core.js");
const tMap = /*#__PURE__*/require("./tMap.js");
/** @internal */
const TSetSymbolKey = "effect/TSet";
/** @internal */
exports.TSetTypeId = /*#__PURE__*/Symbol.for(TSetSymbolKey);
/** @internal */
const tSetVariance = {
  _A: _ => _
};
/** @internal */
class TSetImpl {
  tMap;
  [exports.TSetTypeId] = tSetVariance;
  constructor(tMap) {
    this.tMap = tMap;
  }
}
/** @internal */
exports.add = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => tMap.set(self.tMap, value, void 0));
/** @internal */
exports.difference = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, other) => core.flatMap((0, exports.toHashSet)(other), values => (0, exports.removeIfDiscard)(self, value => HashSet.has(values, value))));
/** @internal */
const empty = () => (0, exports.fromIterable)([]);
exports.empty = empty;
/** @internal */
exports.forEach = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.reduceSTM)(self, void 0, (_, value) => f(value)));
/** @internal */
const fromIterable = iterable => core.map(tMap.fromIterable(Array.from(iterable).map(a => [a, void 0])), tMap => new TSetImpl(tMap));
exports.fromIterable = fromIterable;
/** @internal */
exports.has = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => tMap.has(self.tMap, value));
/** @internal */
exports.intersection = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, other) => core.flatMap((0, exports.toHashSet)(other), values => (0, Function_js_1.pipe)(self, (0, exports.retainIfDiscard)(value => (0, Function_js_1.pipe)(values, HashSet.has(value))))));
/** @internal */
const isEmpty = self => tMap.isEmpty(self.tMap);
exports.isEmpty = isEmpty;
/** @internal */
const make = (...elements) => (0, exports.fromIterable)(elements);
exports.make = make;
/** @internal */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => tMap.reduceWithIndex(self.tMap, zero, (acc, _, key) => f(acc, key)));
/** @internal */
exports.reduceSTM = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => tMap.reduceWithIndexSTM(self.tMap, zero, (acc, _, key) => f(acc, key)));
/** @internal */
exports.remove = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => tMap.remove(self.tMap, value));
/** @internal */
exports.removeAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, iterable) => tMap.removeAll(self.tMap, iterable));
/** @internal */
exports.removeIf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, Function_js_1.pipe)(tMap.removeIf(self.tMap, key => predicate(key)), core.map(RA.map(entry => entry[0]))));
/** @internal */
exports.removeIfDiscard = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => tMap.removeIfDiscard(self.tMap, key => predicate(key)));
/** @internal */
exports.retainIf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, Function_js_1.pipe)(tMap.retainIf(self.tMap, key => predicate(key)), core.map(RA.map(entry => entry[0]))));
/** @internal */
exports.retainIfDiscard = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => tMap.retainIfDiscard(self.tMap, key => predicate(key)));
/** @internal */
const size = self => core.map((0, exports.toChunk)(self), chunk => chunk.length);
exports.size = size;
/** @internal */
exports.takeFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => tMap.takeFirst(self.tMap, key => pf(key)));
/** @internal */
exports.takeFirstSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => tMap.takeFirstSTM(self.tMap, key => pf(key)));
/** @internal */
exports.takeSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => tMap.takeSome(self.tMap, key => pf(key)));
/** @internal */
exports.takeSomeSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => tMap.takeSomeSTM(self.tMap, key => pf(key)));
/** @internal */
const toChunk = self => tMap.keys(self.tMap);
exports.toChunk = toChunk;
/** @internal */
const toHashSet = self => (0, exports.reduce)(self, HashSet.empty(), (acc, value) => (0, Function_js_1.pipe)(acc, HashSet.add(value)));
exports.toHashSet = toHashSet;
/** @internal */
const toReadonlyArray = self => (0, exports.reduce)(self, [], (acc, value) => [...acc, value]);
exports.toReadonlyArray = toReadonlyArray;
/** @internal */
const toReadonlySet = self => core.map((0, exports.toReadonlyArray)(self), values => new Set(values));
exports.toReadonlySet = toReadonlySet;
/** @internal */
exports.transform = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => tMap.transform(self.tMap, (key, value) => [f(key), value]));
/** @internal */
exports.transformSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => tMap.transformSTM(self.tMap, (key, value) => core.map(f(key), a => [a, value])));
/** @internal */
exports.union = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, other) => (0, exports.forEach)(other, value => (0, exports.add)(self, value)));
//# sourceMappingURL=tSet.js.map