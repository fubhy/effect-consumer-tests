"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.values = exports.size = exports.set = exports.remove = exports.reduce = exports.keys = exports.map = exports.headOption = exports.has = exports.getOrder = exports.get = exports.entries = exports.isNonEmpty = exports.isEmpty = exports.make = exports.fromIterable = exports.empty = exports.isSortedMap = void 0;
/**
 * @since 2.0.0
 */
const Equal = /*#__PURE__*/require("./Equal.js");
const Dual = /*#__PURE__*/require("./Function.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Hash = /*#__PURE__*/require("./Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const Option = /*#__PURE__*/require("./Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const RBT = /*#__PURE__*/require("./RedBlackTree.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/SortedMap");
const SortedMapProto = {
  [TypeId]: TypeId,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(this.tree), Hash.combine(Hash.hash("effect/SortedMap")));
  },
  [Equal.symbol](that) {
    return (0, exports.isSortedMap)(that) && Equal.equals(this.tree, that.tree);
  },
  [Symbol.iterator]() {
    return this.tree[Symbol.iterator]();
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "SortedMap",
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
const makeImpl = tree => {
  const self = Object.create(SortedMapProto);
  self.tree = tree;
  return self;
};
/**
 * @since 2.0.0
 * @category refinements
 */
const isSortedMap = u => (0, Predicate_js_1.hasProperty)(u, TypeId);
exports.isSortedMap = isSortedMap;
/**
 * @since 2.0.0
 * @category constructors
 */
const empty = ord => makeImpl(RBT.empty(ord));
exports.empty = empty;
/**
 * @since 2.0.0
 * @category constructors
 */
const fromIterable = ord => iterable => makeImpl(RBT.fromIterable(ord)(iterable));
exports.fromIterable = fromIterable;
/**
 * @since 2.0.0
 * @category constructors
 */
const make = ord => (...entries) => (0, exports.fromIterable)(ord)(entries);
exports.make = make;
/**
 * @since 2.0.0
 * @category predicates
 */
const isEmpty = self => (0, exports.size)(self) === 0;
exports.isEmpty = isEmpty;
/**
 * @since 2.0.0
 * @category predicates
 */
const isNonEmpty = self => (0, exports.size)(self) > 0;
exports.isNonEmpty = isNonEmpty;
/**
 * @since 2.0.0
 * @category getters
 */
const entries = self => self[Symbol.iterator]();
exports.entries = entries;
/**
 * @since 2.0.0
 * @category elements
 */
exports.get = /*#__PURE__*/Dual.dual(2, (self, key) => RBT.findFirst(self.tree, key));
/**
 * Gets the `Order<K>` that the `SortedMap<K, V>` is using.
 *
 * @since 2.0.0
 * @category getters
 */
const getOrder = self => RBT.getOrder(self.tree);
exports.getOrder = getOrder;
/**
 * @since 2.0.0
 * @category elements
 */
exports.has = /*#__PURE__*/Dual.dual(2, (self, key) => Option.isSome((0, exports.get)(self, key)));
/**
 * @since 2.0.0
 * @category elements
 */
const headOption = self => RBT.first(self.tree);
exports.headOption = headOption;
/**
 * @since 2.0.0
 * @category mapping
 */
exports.map = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.reduce)(self, (0, exports.empty)(RBT.getOrder(self.tree)), (acc, v, k) => (0, exports.set)(acc, k, f(v, k))));
/**
 * @since 2.0.0
 * @category getters
 */
const keys = self => RBT.keys(self.tree);
exports.keys = keys;
/**
 * @since 2.0.0
 * @category folding
 */
exports.reduce = /*#__PURE__*/Dual.dual(3, (self, zero, f) => RBT.reduce(self.tree, zero, f));
/**
 * @since 2.0.0
 * @category elements
 */
exports.remove = /*#__PURE__*/Dual.dual(2, (self, key) => makeImpl(RBT.removeFirst(self.tree, key)));
/**
 * @since 2.0.0
 * @category elements
 */
exports.set = /*#__PURE__*/Dual.dual(3, (self, key, value) => RBT.has(self.tree, key) ? makeImpl(RBT.insert(RBT.removeFirst(self.tree, key), key, value)) : makeImpl(RBT.insert(self.tree, key, value)));
/**
 * @since 2.0.0
 * @category getters
 */
const size = self => RBT.size(self.tree);
exports.size = size;
/**
 * @since 2.0.0
 * @category getters
 */
const values = self => RBT.values(self.tree);
exports.values = values;
//# sourceMappingURL=SortedMap.js.map