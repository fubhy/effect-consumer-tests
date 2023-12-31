/**
 * @since 2.0.0
 */
import * as Dual from "./Function.js";
import { NodeInspectSymbol, toJSON, toString } from "./Inspectable.js";
import * as MutableHashMap from "./MutableHashMap.js";
import { pipeArguments } from "./Pipeable.js";
const TypeId = /*#__PURE__*/Symbol.for("effect/MutableHashSet");
const MutableHashSetProto = {
  [TypeId]: TypeId,
  [Symbol.iterator]() {
    return Array.from(this.keyMap).map(([_]) => _)[Symbol.iterator]();
  },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
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
export const empty = () => fromHashMap(MutableHashMap.empty());
/**
 * @since 2.0.0
 * @category constructors
 */
export const fromIterable = keys => fromHashMap(MutableHashMap.fromIterable(Array.from(keys).map(k => [k, true])));
/**
 * @since 2.0.0
 * @category constructors
 */
export const make = (...keys) => fromIterable(keys);
/**
 * @since 2.0.0
 * @category elements
 */
export const add = /*#__PURE__*/Dual.dual(2, (self, key) => (MutableHashMap.set(self.keyMap, key, true), self));
/**
 * @since 2.0.0
 * @category elements
 */
export const has = /*#__PURE__*/Dual.dual(2, (self, key) => MutableHashMap.has(self.keyMap, key));
/**
 * @since 2.0.0
 * @category elements
 */
export const remove = /*#__PURE__*/Dual.dual(2, (self, key) => (MutableHashMap.remove(self.keyMap, key), self));
/**
 * @since 2.0.0
 * @category elements
 */
export const size = self => MutableHashMap.size(self.keyMap);
//# sourceMappingURL=MutableHashSet.js.map