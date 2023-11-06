"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.values = exports.union = exports.toggle = exports.some = exports.size = exports.remove = exports.partition = exports.map = exports.isSubset = exports.intersection = exports.has = exports.forEach = exports.flatMap = exports.filter = exports.every = exports.difference = exports.add = exports.make = exports.fromIterable = exports.empty = exports.isSortedSet = void 0;
/**
 * @since 2.0.0
 */
const Equal = /*#__PURE__*/require("./Equal.js");
const Dual = /*#__PURE__*/require("./Function.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Hash = /*#__PURE__*/require("./Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const RBT = /*#__PURE__*/require("./RedBlackTree.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/SortedSet");
const SortedSetProto = {
  [TypeId]: {
    _A: _ => _
  },
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(this.keyTree), Hash.combine(Hash.hash(TypeId)));
  },
  [Equal.symbol](that) {
    return (0, exports.isSortedSet)(that) && Equal.equals(this.keyTree, that.keyTree);
  },
  [Symbol.iterator]() {
    return RBT.keys(this.keyTree);
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "SortedSet",
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
const fromTree = keyTree => {
  const a = Object.create(SortedSetProto);
  a.keyTree = keyTree;
  return a;
};
/**
 * @since 2.0.0
 * @category refinements
 */
const isSortedSet = u => (0, Predicate_js_1.hasProperty)(u, TypeId);
exports.isSortedSet = isSortedSet;
/**
 * @since 2.0.0
 * @category constructors
 */
const empty = O => fromTree(RBT.empty(O));
exports.empty = empty;
/**
 * @since 2.0.0
 * @category constructors
 */
const fromIterable = ord => iterable => fromTree(RBT.fromIterable(ord)(Array.from(iterable).map(k => [k, true])));
exports.fromIterable = fromIterable;
/**
 * @since 2.0.0
 * @category constructors
 */
const make = ord => (...entries) => (0, exports.fromIterable)(ord)(entries);
exports.make = make;
/**
 * @since 2.0.0
 * @category elements
 */
exports.add = /*#__PURE__*/Dual.dual(2, (self, value) => RBT.has(self.keyTree, value) ? self : fromTree(RBT.insert(self.keyTree, value, true)));
/**
 * @since 2.0.0
 */
exports.difference = /*#__PURE__*/Dual.dual(2, (self, that) => {
  let out = self;
  for (const value of that) {
    out = (0, exports.remove)(out, value);
  }
  return out;
});
/**
 * Check if a predicate holds true for every `SortedSet` element.
 *
 * @since 2.0.0
 * @category elements
 */
exports.every = /*#__PURE__*/Dual.dual(2, (self, refinement) => {
  for (const value of self) {
    if (!refinement(value)) {
      return false;
    }
  }
  return true;
});
/**
 * @since 2.0.0
 * @category filtering
 */
exports.filter = /*#__PURE__*/Dual.dual(2, (self, predicate) => {
  const ord = RBT.getOrder(self.keyTree);
  let out = (0, exports.empty)(ord);
  for (const value of self) {
    if (predicate(value)) {
      out = (0, exports.add)(out, value);
    }
  }
  return out;
});
/**
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = /*#__PURE__*/Dual.dual(3, (self, O, f) => {
  let out = (0, exports.empty)(O);
  (0, exports.forEach)(self, a => {
    for (const b of f(a)) {
      out = (0, exports.add)(out, b);
    }
  });
  return out;
});
/**
 * @since 2.0.0
 * @category traversing
 */
exports.forEach = /*#__PURE__*/Dual.dual(2, (self, f) => RBT.forEach(self.keyTree, f));
/**
 * @since 2.0.0
 * @category elements
 */
exports.has = /*#__PURE__*/Dual.dual(2, (self, value) => RBT.has(self.keyTree, value));
/**
 * @since 2.0.0
 */
exports.intersection = /*#__PURE__*/Dual.dual(2, (self, that) => {
  const ord = RBT.getOrder(self.keyTree);
  let out = (0, exports.empty)(ord);
  for (const value of that) {
    if ((0, exports.has)(self, value)) {
      out = (0, exports.add)(out, value);
    }
  }
  return out;
});
/**
 * @since 2.0.0
 * @category elements
 */
exports.isSubset = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.every)(self, a => (0, exports.has)(that, a)));
/**
 * @since 2.0.0
 * @category mapping
 */
exports.map = /*#__PURE__*/Dual.dual(3, (self, O, f) => {
  let out = (0, exports.empty)(O);
  (0, exports.forEach)(self, a => {
    const b = f(a);
    if (!(0, exports.has)(out, b)) {
      out = (0, exports.add)(out, b);
    }
  });
  return out;
});
/**
 * @since 2.0.0
 * @category filtering
 */
exports.partition = /*#__PURE__*/Dual.dual(2, (self, predicate) => {
  const ord = RBT.getOrder(self.keyTree);
  let right = (0, exports.empty)(ord);
  let left = (0, exports.empty)(ord);
  for (const value of self) {
    if (predicate(value)) {
      right = (0, exports.add)(right, value);
    } else {
      left = (0, exports.add)(left, value);
    }
  }
  return [left, right];
});
/**
 * @since 2.0.0
 * @category elements
 */
exports.remove = /*#__PURE__*/Dual.dual(2, (self, value) => fromTree(RBT.removeFirst(self.keyTree, value)));
/**
 * @since 2.0.0
 * @category getters
 */
const size = self => RBT.size(self.keyTree);
exports.size = size;
/**
 * Check if a predicate holds true for some `SortedSet` element.
 *
 * @since 2.0.0
 * @category elements
 */
exports.some = /*#__PURE__*/Dual.dual(2, (self, predicate) => {
  for (const value of self) {
    if (predicate(value)) {
      return true;
    }
  }
  return false;
});
/**
 * @since 2.0.0
 * @category elements
 */
exports.toggle = /*#__PURE__*/Dual.dual(2, (self, value) => (0, exports.has)(self, value) ? (0, exports.remove)(self, value) : (0, exports.add)(self, value));
/**
 * @since 2.0.0
 */
exports.union = /*#__PURE__*/Dual.dual(2, (self, that) => {
  const ord = RBT.getOrder(self.keyTree);
  let out = (0, exports.empty)(ord);
  for (const value of self) {
    out = (0, exports.add)(value)(out);
  }
  for (const value of that) {
    out = (0, exports.add)(value)(out);
  }
  return out;
});
/**
 * @since 2.0.0
 * @category getters
 */
const values = self => RBT.keys(self.keyTree);
exports.values = values;
//# sourceMappingURL=SortedSet.js.map