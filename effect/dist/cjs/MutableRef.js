"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggle = exports.updateAndGet = exports.update = exports.setAndGet = exports.set = exports.incrementAndGet = exports.increment = exports.getAndUpdate = exports.getAndSet = exports.getAndIncrement = exports.getAndDecrement = exports.get = exports.decrementAndGet = exports.decrement = exports.compareAndSet = exports.make = void 0;
/**
 * @since 2.0.0
 */
const Equal = /*#__PURE__*/require("./Equal.js");
const Dual = /*#__PURE__*/require("./Function.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/MutableRef");
const MutableRefProto = {
  [TypeId]: TypeId,
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: (0, Inspectable_js_1.toJSON)(this.current)
    };
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/**
 * @since 2.0.0
 * @category constructors
 */
const make = value => {
  const ref = Object.create(MutableRefProto);
  ref.current = value;
  return ref;
};
exports.make = make;
/**
 * @since 2.0.0
 * @category general
 */
exports.compareAndSet = /*#__PURE__*/Dual.dual(3, (self, oldValue, newValue) => {
  if (Equal.equals(oldValue, self.current)) {
    self.current = newValue;
    return true;
  }
  return false;
});
/**
 * @since 2.0.0
 * @category numeric
 */
const decrement = self => (0, exports.update)(self, n => n - 1);
exports.decrement = decrement;
/**
 * @since 2.0.0
 * @category numeric
 */
const decrementAndGet = self => (0, exports.updateAndGet)(self, n => n - 1);
exports.decrementAndGet = decrementAndGet;
/**
 * @since 2.0.0
 * @category general
 */
const get = self => self.current;
exports.get = get;
/**
 * @since 2.0.0
 * @category numeric
 */
const getAndDecrement = self => (0, exports.getAndUpdate)(self, n => n - 1);
exports.getAndDecrement = getAndDecrement;
/**
 * @since 2.0.0
 * @category numeric
 */
const getAndIncrement = self => (0, exports.getAndUpdate)(self, n => n + 1);
exports.getAndIncrement = getAndIncrement;
/**
 * @since 2.0.0
 * @category general
 */
exports.getAndSet = /*#__PURE__*/Dual.dual(2, (self, value) => {
  const ret = self.current;
  self.current = value;
  return ret;
});
/**
 * @since 2.0.0
 * @category general
 */
exports.getAndUpdate = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.getAndSet)(self, f((0, exports.get)(self))));
/**
 * @since 2.0.0
 * @category numeric
 */
const increment = self => (0, exports.update)(self, n => n + 1);
exports.increment = increment;
/**
 * @since 2.0.0
 * @category numeric
 */
const incrementAndGet = self => (0, exports.updateAndGet)(self, n => n + 1);
exports.incrementAndGet = incrementAndGet;
/**
 * @since 2.0.0
 * @category general
 */
exports.set = /*#__PURE__*/Dual.dual(2, (self, value) => {
  self.current = value;
  return self;
});
/**
 * @since 2.0.0
 * @category general
 */
exports.setAndGet = /*#__PURE__*/Dual.dual(2, (self, value) => {
  self.current = value;
  return self.current;
});
/**
 * @since 2.0.0
 * @category general
 */
exports.update = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.set)(self, f((0, exports.get)(self))));
/**
 * @since 2.0.0
 * @category general
 */
exports.updateAndGet = /*#__PURE__*/Dual.dual(2, (self, f) => (0, exports.setAndGet)(self, f((0, exports.get)(self))));
/**
 * @since 2.0.0
 * @category boolean
 */
const toggle = self => (0, exports.update)(self, _ => !_);
exports.toggle = toggle;
//# sourceMappingURL=MutableRef.js.map