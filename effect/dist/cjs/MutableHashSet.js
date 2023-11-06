"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.size = exports.remove = exports.has = exports.add = exports.make = exports.fromIterable = exports.empty = void 0;
/**
 * @since 2.0.0
 */
const Dual = /*#__PURE__*/require("./Function.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const MutableHashMap = /*#__PURE__*/require("./MutableHashMap.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/MutableHashSet");
const MutableHashSetProto = {
  [TypeId]: TypeId,
  [Symbol.iterator]() {
    return Array.from(this.keyMap).map(([_]) => _)[Symbol.iterator]();
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashSet",
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
const fromHashMap = keyMap => {
  const set = Object.create(MutableHashSetProto);
  set.keyMap = keyMap;
  return set;
};
/**
 * @since 2.0.0
 * @category constructors
 */
const empty = () => fromHashMap(MutableHashMap.empty());
exports.empty = empty;
/**
 * @since 2.0.0
 * @category constructors
 */
const fromIterable = keys => fromHashMap(MutableHashMap.fromIterable(Array.from(keys).map(k => [k, true])));
exports.fromIterable = fromIterable;
/**
 * @since 2.0.0
 * @category constructors
 */
const make = (...keys) => (0, exports.fromIterable)(keys);
exports.make = make;
/**
 * @since 2.0.0
 * @category elements
 */
exports.add = /*#__PURE__*/Dual.dual(2, (self, key) => (MutableHashMap.set(self.keyMap, key, true), self));
/**
 * @since 2.0.0
 * @category elements
 */
exports.has = /*#__PURE__*/Dual.dual(2, (self, key) => MutableHashMap.has(self.keyMap, key));
/**
 * @since 2.0.0
 * @category elements
 */
exports.remove = /*#__PURE__*/Dual.dual(2, (self, key) => (MutableHashMap.remove(self.keyMap, key), self));
/**
 * @since 2.0.0
 * @category elements
 */
const size = self => MutableHashMap.size(self.keyMap);
exports.size = size;
//# sourceMappingURL=MutableHashSet.js.map