"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFirst = exports.filterMap = exports.compact = exports.filter = exports.reduce = exports.forEach = exports.flatMap = exports.map = exports.removeMany = exports.remove = exports.union = exports.modify = exports.modifyHash = exports.modifyAt = exports.mutate = exports.endMutation = exports.beginMutation = exports.size = exports.values = exports.keys = exports.setTree = exports.set = exports.hasHash = exports.has = exports.unsafeGet = exports.getHash = exports.get = exports.isEmpty = exports.isHashMap = exports.fromIterable = exports.make = exports.empty = exports.HashMapTypeId = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Dual = /*#__PURE__*/require("../Function.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const bitwise_js_1 = /*#__PURE__*/require("./hashMap/bitwise.js");
const config_js_1 = /*#__PURE__*/require("./hashMap/config.js");
const Node = /*#__PURE__*/require("./hashMap/node.js");
/** @internal */
exports.HashMapTypeId = /*#__PURE__*/Symbol.for("effect/HashMap");
const HashMapProto = {
  [exports.HashMapTypeId]: exports.HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator(this, (k, v) => [k, v]);
  },
  [Hash.symbol]() {
    let hash = Hash.hash("HashMap");
    for (const item of this) {
      hash ^= Hash.combine(Hash.hash(item[0]))(Hash.hash(item[1]));
    }
    return hash;
  },
  [Equal.symbol](that) {
    if ((0, exports.isHashMap)(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = (0, Function_js_1.pipe)(that, (0, exports.getHash)(item[0], Hash.hash(item[0])));
        if (Option.isNone(elem)) {
          return false;
        } else {
          if (!Equal.equals(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
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
const makeImpl = (editable, edit, root, size) => {
  const map = Object.create(HashMapProto);
  map._editable = editable;
  map._edit = edit;
  map._root = root;
  map._size = size;
  return map;
};
class HashMapIterator {
  map;
  f;
  v;
  constructor(map, f) {
    this.map = map;
    this.f = f;
    this.v = visitLazy(this.map._root, this.f, undefined);
  }
  next() {
    if (Option.isNone(this.v)) {
      return {
        done: true,
        value: undefined
      };
    }
    const v0 = this.v.value;
    this.v = applyCont(v0.cont);
    return {
      done: false,
      value: v0.value
    };
  }
  [Symbol.iterator]() {
    return new HashMapIterator(this.map, this.f);
  }
}
const applyCont = cont => cont ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4]) : Option.none();
const visitLazy = (node, f, cont = undefined) => {
  switch (node._tag) {
    case "LeafNode":
      {
        if (Option.isSome(node.value)) {
          return Option.some({
            value: f(node.key, node.value.value),
            cont
          });
        }
        return applyCont(cont);
      }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode":
      {
        const children = node.children;
        return visitLazyChildren(children.length, children, 0, f, cont);
      }
    default:
      {
        return applyCont(cont);
      }
  }
};
const visitLazyChildren = (len, children, i, f, cont) => {
  while (i < len) {
    const child = children[i++];
    if (child && !Node.isEmptyNode(child)) {
      return visitLazy(child, f, [len, children, i, f, cont]);
    }
  }
  return applyCont(cont);
};
const _empty = /*#__PURE__*/makeImpl(false, 0, /*#__PURE__*/new Node.EmptyNode(), 0);
/** @internal */
const empty = () => _empty;
exports.empty = empty;
/** @internal */
const make = (...entries) => (0, exports.fromIterable)(entries);
exports.make = make;
/** @internal */
const fromIterable = entries => {
  const map = (0, exports.beginMutation)((0, exports.empty)());
  for (const entry of entries) {
    (0, exports.set)(entry[0], entry[1])(map);
  }
  return (0, exports.endMutation)(map);
};
exports.fromIterable = fromIterable;
/** @internal */
const isHashMap = u => (0, Predicate_js_1.hasProperty)(u, exports.HashMapTypeId);
exports.isHashMap = isHashMap;
/** @internal */
const isEmpty = self => self && Node.isEmptyNode(self._root);
exports.isEmpty = isEmpty;
/** @internal */
exports.get = /*#__PURE__*/Dual.dual(2, (self, key) => (0, exports.getHash)(self, key, Hash.hash(key)));
/** @internal */
exports.getHash = /*#__PURE__*/Dual.dual(3, (self, key, hash) => {
  let node = self._root;
  let shift = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    switch (node._tag) {
      case "LeafNode":
        {
          return Equal.equals(key, node.key) ? node.value : Option.none();
        }
      case "CollisionNode":
        {
          if (hash === node.hash) {
            const children = node.children;
            for (let i = 0, len = children.length; i < len; ++i) {
              const child = children[i];
              if ("key" in child && Equal.equals(key, child.key)) {
                return child.value;
              }
            }
          }
          return Option.none();
        }
      case "IndexedNode":
        {
          const frag = (0, bitwise_js_1.hashFragment)(shift, hash);
          const bit = (0, bitwise_js_1.toBitmap)(frag);
          if (node.mask & bit) {
            node = node.children[(0, bitwise_js_1.fromBitmap)(node.mask, bit)];
            shift += config_js_1.SIZE;
            break;
          }
          return Option.none();
        }
      case "ArrayNode":
        {
          node = node.children[(0, bitwise_js_1.hashFragment)(shift, hash)];
          if (node) {
            shift += config_js_1.SIZE;
            break;
          }
          return Option.none();
        }
      default:
        return Option.none();
    }
  }
});
/** @internal */
exports.unsafeGet = /*#__PURE__*/Dual.dual(2, (self, key) => {
  const element = (0, exports.getHash)(self, key, Hash.hash(key));
  if (Option.isNone(element)) {
    throw new Error("Error: Expected map to contain key");
  }
  return element.value;
});
/** @internal */
exports.has = /*#__PURE__*/Dual.dual(2, (self, key) => Option.isSome((0, exports.getHash)(self, key, Hash.hash(key))));
/** @internal */
exports.hasHash = /*#__PURE__*/Dual.dual(3, (self, key, hash) => Option.isSome((0, exports.getHash)(self, key, hash)));
/** @internal */
exports.set = /*#__PURE__*/Dual.dual(3, (self, key, value) => (0, exports.modifyAt)(self, key, () => Option.some(value)));
/** @internal */
exports.setTree = /*#__PURE__*/Dual.dual(3, (self, newRoot, newSize) => {
  if (self._editable) {
    ;
    self._root = newRoot;
    self._size = newSize;
    return self;
  }
  return newRoot === self._root ? self : makeImpl(self._editable, self._edit, newRoot, newSize);
});
/** @internal */
const keys = self => new HashMapIterator(self, key => key);
exports.keys = keys;
/** @internal */
const values = self => new HashMapIterator(self, (_, value) => value);
exports.values = values;
/** @internal */
const size = self => self._size;
exports.size = size;
/** @internal */
const beginMutation = self => makeImpl(true, self._edit + 1, self._root, self._size);
exports.beginMutation = beginMutation;
/** @internal */
const endMutation = self => {
  ;
  self._editable = false;
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
exports.modifyAt = /*#__PURE__*/Dual.dual(3, (self, key, f) => (0, exports.modifyHash)(self, key, Hash.hash(key), f));
/** @internal */
exports.modifyHash = /*#__PURE__*/Dual.dual(4, (self, key, hash, f) => {
  const size = {
    value: self._size
  };
  const newRoot = self._root.modify(self._editable ? self._edit : NaN, 0, f, hash, key, size);
  return (0, Function_js_1.pipe)(self, (0, exports.setTree)(newRoot, size.value));
});
/** @internal */
exports.modify = /*#__PURE__*/Dual.dual(3, (self, key, f) => (0, exports.modifyAt)(self, key, Option.map(f)));
/** @internal */
exports.union = /*#__PURE__*/Dual.dual(2, (self, that) => {
  const result = (0, exports.beginMutation)(self);
  (0, exports.forEach)(that, (v, k) => (0, exports.set)(result, k, v));
  return (0, exports.endMutation)(result);
});
/** @internal */
exports.remove = /*#__PURE__*/Dual.dual(2, (self, key) => (0, exports.modifyAt)(self, key, Option.none));
/** @internal */
exports.removeMany = /*#__PURE__*/Dual.dual(2, (self, keys) => (0, exports.mutate)(self, map => {
  for (const key of keys) {
    (0, exports.remove)(key)(map);
  }
}));
/**
 * Maps over the entries of the `HashMap` using the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.reduce)(self, (0, exports.empty)(), (map, value, key) => (0, exports.set)(map, key, f(value, key))));
/** @internal */
exports.flatMap = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.reduce)(self, (0, exports.empty)(), (zero, value, key) => (0, exports.mutate)(zero, map => (0, exports.forEach)(f(value, key), (value, key) => (0, exports.set)(map, key, value)))));
/** @internal */
exports.forEach = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.reduce)(self, void 0, (_, value, key) => f(value, key)));
/** @internal */
exports.reduce = /*#__PURE__*/Dual.dual(3, (self, zero, f) => {
  const root = self._root;
  if (root._tag === "LeafNode") {
    return Option.isSome(root.value) ? f(zero, root.value.value, root.key) : zero;
  }
  if (root._tag === "EmptyNode") {
    return zero;
  }
  const toVisit = [root.children];
  let children;
  while (children = toVisit.pop()) {
    for (let i = 0, len = children.length; i < len;) {
      const child = children[i++];
      if (child && !Node.isEmptyNode(child)) {
        if (child._tag === "LeafNode") {
          if (Option.isSome(child.value)) {
            zero = f(zero, child.value.value, child.key);
          }
        } else {
          toVisit.push(child.children);
        }
      }
    }
  }
  return zero;
});
/** @internal */
exports.filter = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.mutate)((0, exports.empty)(), map => {
  for (const [k, a] of self) {
    if (f(a, k)) {
      (0, exports.set)(map, k, a);
    }
  }
}));
/** @internal */
const compact = self => (0, exports.filterMap)(self, Function_js_1.identity);
exports.compact = compact;
/** @internal */
exports.filterMap = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.mutate)((0, exports.empty)(), map => {
  for (const [k, a] of self) {
    const option = f(a, k);
    if (Option.isSome(option)) {
      (0, exports.set)(map, k, option.value);
    }
  }
}));
/** @internal */
exports.findFirst = /*#__PURE__*/Dual.dual(2, (self, predicate) => {
  for (const ka of self) {
    if (predicate(ka[0], ka[1])) {
      return Option.some(ka);
    }
  }
  return Option.none();
});
//# sourceMappingURL=hashMap.js.map