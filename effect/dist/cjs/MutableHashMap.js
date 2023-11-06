"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.size = exports.set = exports.remove = exports.modifyAt = exports.modify = exports.has = exports.get = exports.fromIterable = exports.make = exports.empty = void 0;
/**
 * @since 2.0.0
 */
const Dual = /*#__PURE__*/require("./Function.js");
const HashMap = /*#__PURE__*/require("./HashMap.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const MutableRef = /*#__PURE__*/require("./MutableRef.js");
const Option = /*#__PURE__*/require("./Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/MutableHashMap");
const MutableHashMapProto = {
  [TypeId]: TypeId,
  [Symbol.iterator]() {
    return this.backingMap.current[Symbol.iterator]();
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
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
const fromHashMap = backingMap => {
  const map = Object.create(MutableHashMapProto);
  map.backingMap = MutableRef.make(backingMap);
  return map;
};
/**
 * @since 2.0.0
 * @category constructors
 */
const empty = () => fromHashMap(HashMap.empty());
exports.empty = empty;
/**
 * @since 2.0.0
 * @category constructors
 */
const make = (...entries) => (0, exports.fromIterable)(entries);
exports.make = make;
/**
 * @since 2.0.0
 * @category conversions
 */
const fromIterable = entries => fromHashMap(HashMap.fromIterable(entries));
exports.fromIterable = fromIterable;
/**
 * @since 2.0.0
 * @category elements
 */
exports.get = /*#__PURE__*/Dual.dual(2, (self, key) => HashMap.get(self.backingMap.current, key));
/**
 * @since 2.0.0
 * @category elements
 */
exports.has = /*#__PURE__*/Dual.dual(2, (self, key) => Option.isSome((0, exports.get)(self, key)));
/**
 * Updates the value of the specified key within the `MutableHashMap` if it exists.
 *
 * @since 2.0.0
 */
exports.modify = /*#__PURE__*/Dual.dual(3, (self, key, f) => {
  MutableRef.update(self.backingMap, HashMap.modify(key, f));
  return self;
});
/**
 * Set or remove the specified key in the `MutableHashMap` using the specified
 * update function.
 *
 * @since 2.0.0
 */
exports.modifyAt = /*#__PURE__*/Dual.dual(3, (self, key, f) => {
  const result = f((0, exports.get)(self, key));
  if (Option.isSome(result)) {
    (0, exports.set)(self, key, result.value);
  } else {
    (0, exports.remove)(self, key);
  }
  return self;
});
/**
 * @since 2.0.0
 */
exports.remove = /*#__PURE__*/Dual.dual(2, (self, key) => {
  MutableRef.update(self.backingMap, HashMap.remove(key));
  return self;
});
/**
 * @since 2.0.0
 */
exports.set = /*#__PURE__*/Dual.dual(3, (self, key, value) => {
  MutableRef.update(self.backingMap, HashMap.set(key, value));
  return self;
});
/**
 * @since 2.0.0
 * @category elements
 */
const size = self => HashMap.size(MutableRef.get(self.backingMap));
exports.size = size;
//# sourceMappingURL=MutableHashMap.js.map