/**
 * @since 2.0.0
 */
import * as Equal from "./Equal.js";
import * as Dual from "./Function.js";
import { pipe } from "./Function.js";
import * as Hash from "./Hash.js";
import { NodeInspectSymbol, toJSON, toString } from "./Inspectable.js";
import * as Option from "./Option.js";
import { pipeArguments } from "./Pipeable.js";
import { hasProperty } from "./Predicate.js";
import * as RBT from "./RedBlackTree.js";
const TypeId = /*#__PURE__*/Symbol.for("effect/SortedMap");
const SortedMapProto = {
  [TypeId]: TypeId,
  [Hash.symbol]() {
    return pipe(Hash.hash(this.tree), Hash.combine(Hash.hash("effect/SortedMap")));
  },
  [Equal.symbol](that) {
    return isSortedMap(that) && Equal.equals(this.tree, that.tree);
  },
  [Symbol.iterator]() {
    return this.tree[Symbol.iterator]();
  },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return {
      _id: "SortedMap",
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
const makeImpl = tree => {
  const self = Object.create(SortedMapProto);
  self.tree = tree;
  return self;
};
/**
 * @since 2.0.0
 * @category refinements
 */
export const isSortedMap = u => hasProperty(u, TypeId);
/**
 * @since 2.0.0
 * @category constructors
 */
export const empty = ord => makeImpl(RBT.empty(ord));
/**
 * @since 2.0.0
 * @category constructors
 */
export const fromIterable = ord => iterable => makeImpl(RBT.fromIterable(ord)(iterable));
/**
 * @since 2.0.0
 * @category constructors
 */
export const make = ord => (...entries) => fromIterable(ord)(entries);
/**
 * @since 2.0.0
 * @category predicates
 */
export const isEmpty = self => size(self) === 0;
/**
 * @since 2.0.0
 * @category predicates
 */
export const isNonEmpty = self => size(self) > 0;
/**
 * @since 2.0.0
 * @category getters
 */
export const entries = self => self[Symbol.iterator]();
/**
 * @since 2.0.0
 * @category elements
 */
export const get = /*#__PURE__*/Dual.dual(2, (self, key) => RBT.findFirst(self.tree, key));
/**
 * Gets the `Order<K>` that the `SortedMap<K, V>` is using.
 *
 * @since 2.0.0
 * @category getters
 */
export const getOrder = self => RBT.getOrder(self.tree);
/**
 * @since 2.0.0
 * @category elements
 */
export const has = /*#__PURE__*/Dual.dual(2, (self, key) => Option.isSome(get(self, key)));
/**
 * @since 2.0.0
 * @category elements
 */
export const headOption = self => RBT.first(self.tree);
/**
 * @since 2.0.0
 * @category mapping
 */
export const map = /*#__PURE__*/Dual.dual(2, (self, f) => reduce(self, empty(RBT.getOrder(self.tree)), (acc, v, k) => set(acc, k, f(v, k))));
/**
 * @since 2.0.0
 * @category getters
 */
export const keys = self => RBT.keys(self.tree);
/**
 * @since 2.0.0
 * @category folding
 */
export const reduce = /*#__PURE__*/Dual.dual(3, (self, zero, f) => RBT.reduce(self.tree, zero, f));
/**
 * @since 2.0.0
 * @category elements
 */
export const remove = /*#__PURE__*/Dual.dual(2, (self, key) => makeImpl(RBT.removeFirst(self.tree, key)));
/**
 * @since 2.0.0
 * @category elements
 */
export const set = /*#__PURE__*/Dual.dual(3, (self, key, value) => RBT.has(self.tree, key) ? makeImpl(RBT.insert(RBT.removeFirst(self.tree, key), key, value)) : makeImpl(RBT.insert(self.tree, key, value)));
/**
 * @since 2.0.0
 * @category getters
 */
export const size = self => RBT.size(self.tree);
/**
 * @since 2.0.0
 * @category getters
 */
export const values = self => RBT.values(self.tree);
//# sourceMappingURL=SortedMap.js.map