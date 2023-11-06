"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partition = exports.filter = exports.reduce = exports.forEach = exports.flatMap = exports.map = exports.toggle = exports.union = exports.intersection = exports.difference = exports.remove = exports.add = exports.mutate = exports.endMutation = exports.beginMutation = exports.size = exports.values = exports.isSubset = exports.every = exports.some = exports.has = exports.make = exports.fromIterable = exports.empty = exports.isHashSet = exports.makeImpl = exports.HashSetTypeId = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Dual = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const HM = /*#__PURE__*/require("./hashMap.js");
/** @internal */
exports.HashSetTypeId = /*#__PURE__*/Symbol.for("effect/HashSet");
const HashSetProto = {
  [exports.HashSetTypeId]: exports.HashSetTypeId,
  [Symbol.iterator]() {
    return HM.keys(this._keyMap);
  },
  [Hash.symbol]() {
    return Hash.combine(Hash.hash(this._keyMap))(Hash.hash("HashSet"));
  },
  [Equal.symbol](that) {
    if ((0, exports.isHashSet)(that)) {
      return HM.size(this._keyMap) === HM.size(that._keyMap) && Equal.equals(this._keyMap, that._keyMap);
    }
    return false;
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(Inspectable_js_1.toJSON)
    };
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
const makeImpl = keyMap => {
  const set = Object.create(HashSetProto);
  set._keyMap = keyMap;
  return set;
};
exports.makeImpl = makeImpl;
/** @internal */
const isHashSet = u => (0, Predicate_js_1.hasProperty)(u, exports.HashSetTypeId);
exports.isHashSet = isHashSet;
const _empty = /*#__PURE__*/(0, exports.makeImpl)( /*#__PURE__*/HM.empty());
/** @internal */
const empty = () => _empty;
exports.empty = empty;
/** @internal */
const fromIterable = elements => {
  const set = (0, exports.beginMutation)((0, exports.empty)());
  for (const value of elements) {
    (0, exports.add)(set, value);
  }
  return (0, exports.endMutation)(set);
};
exports.fromIterable = fromIterable;
/** @internal */
const make = (...elements) => {
  const set = (0, exports.beginMutation)((0, exports.empty)());
  for (const value of elements) {
    (0, exports.add)(set, value);
  }
  return (0, exports.endMutation)(set);
};
exports.make = make;
/** @internal */
exports.has = /*#__PURE__*/Dual.dual(2, (self, value) => HM.has(self._keyMap, value));
/** @internal */
exports.some = /*#__PURE__*/Dual.dual(2, (self, f) => {
  let found = false;
  for (const value of self) {
    found = f(value);
    if (found) {
      break;
    }
  }
  return found;
});
/** @internal */
exports.every = /*#__PURE__*/Dual.dual(2, (self, refinement) => !(0, exports.some)(self, a => !refinement(a)));
/** @internal */
exports.isSubset = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.every)(self, value => (0, exports.has)(that, value)));
/** @internal */
const values = self => HM.keys(self._keyMap);
exports.values = values;
/** @internal */
const size = self => HM.size(self._keyMap);
exports.size = size;
/** @internal */
const beginMutation = self => (0, exports.makeImpl)(HM.beginMutation(self._keyMap));
exports.beginMutation = beginMutation;
/** @internal */
const endMutation = self => {
  ;
  self._keyMap._editable = false;
  return self;
};
exports.endMutation = endMutation;
/** @internal */
exports.mutate = /*#__PURE__*/Dual.dual(2, (self, f) => {
  const transient = (0, exports.beginMutation)(self);
  f(transient);
  return (0, exports.endMutation)(transient);
});
/** @internal */
exports.add = /*#__PURE__*/Dual.dual(2, (self, value) => self._keyMap._editable ? (HM.set(value, true)(self._keyMap), self) : (0, exports.makeImpl)(HM.set(value, true)(self._keyMap)));
/** @internal */
exports.remove = /*#__PURE__*/Dual.dual(2, (self, value) => self._keyMap._editable ? (HM.remove(value)(self._keyMap), self) : (0, exports.makeImpl)(HM.remove(value)(self._keyMap)));
/** @internal */
exports.difference = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.mutate)(self, set => {
  for (const value of that) {
    (0, exports.remove)(set, value);
  }
}));
/** @internal */
exports.intersection = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.mutate)((0, exports.empty)(), set => {
  for (const value of that) {
    if ((0, exports.has)(value)(self)) {
      (0, exports.add)(value)(set);
    }
  }
}));
/** @internal */
exports.union = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.mutate)((0, exports.empty)(), set => {
  (0, exports.forEach)(self, value => (0, exports.add)(set, value));
  for (const value of that) {
    (0, exports.add)(set, value);
  }
}));
/** @internal */
exports.toggle = /*#__PURE__*/Dual.dual(2, (self, value) => (0, exports.has)(self, value) ? (0, exports.remove)(self, value) : (0, exports.add)(self, value));
/** @internal */
exports.map = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.mutate)((0, exports.empty)(), set => {
  (0, exports.forEach)(self, a => {
    const b = f(a);
    if (!(0, exports.has)(set, b)) {
      (0, exports.add)(set, b);
    }
  });
}));
/** @internal */
exports.flatMap = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.mutate)((0, exports.empty)(), set => {
  (0, exports.forEach)(self, a => {
    for (const b of f(a)) {
      if (!(0, exports.has)(set, b)) {
        (0, exports.add)(set, b);
      }
    }
  });
}));
/** @internal */
exports.forEach = /*#__PURE__*/Dual.dual(2, (self, f) => HM.forEach(self._keyMap, (_, k) => f(k)));
/** @internal */
exports.reduce = /*#__PURE__*/Dual.dual(3, (self, zero, f) => HM.reduce(self._keyMap, zero, (z, _, a) => f(z, a)));
/** @internal */
exports.filter = /*#__PURE__*/Dual.dual(2, (self, f) => {
  return (0, exports.mutate)((0, exports.empty)(), set => {
    const iterator = (0, exports.values)(self);
    let next;
    while (!(next = iterator.next()).done) {
      const value = next.value;
      if (f(value)) {
        (0, exports.add)(set, value);
      }
    }
  });
});
/** @internal */
exports.partition = /*#__PURE__*/Dual.dual(2, (self, f) => {
  const iterator = (0, exports.values)(self);
  let next;
  const right = (0, exports.beginMutation)((0, exports.empty)());
  const left = (0, exports.beginMutation)((0, exports.empty)());
  while (!(next = iterator.next()).done) {
    const value = next.value;
    if (f(value)) {
      (0, exports.add)(right, value);
    } else {
      (0, exports.add)(left, value);
    }
  }
  return [(0, exports.endMutation)(left), (0, exports.endMutation)(right)];
});
//# sourceMappingURL=hashSet.js.map