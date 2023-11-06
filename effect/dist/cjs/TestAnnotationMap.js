"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combine = exports.annotate = exports.get = exports.update = exports.overwrite = exports.make = exports.empty = exports.isTestAnnotationMap = exports.TestAnnotationMapTypeId = void 0;
/**
 * @since 2.0.0
 */
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
/**
 * @since 2.0.0
 */
exports.TestAnnotationMapTypeId = /*#__PURE__*/Symbol.for("effect/TestAnnotationMap");
/** @internal */
class TestAnnotationMapImpl {
  map;
  [exports.TestAnnotationMapTypeId] = exports.TestAnnotationMapTypeId;
  constructor(map) {
    this.map = map;
  }
}
/**
 * @since 2.0.0
 */
const isTestAnnotationMap = u => (0, Predicate_js_1.hasProperty)(u, exports.TestAnnotationMapTypeId);
exports.isTestAnnotationMap = isTestAnnotationMap;
/**
 * @since 2.0.0
 */
const empty = () => new TestAnnotationMapImpl(new Map());
exports.empty = empty;
/**
 * @since 2.0.0
 */
const make = map => {
  return new TestAnnotationMapImpl(map);
};
exports.make = make;
/**
 * @since 2.0.0
 */
exports.overwrite = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, value) => (0, exports.make)(self.map.set(key, value)));
/**
 * @since 2.0.0
 */
exports.update = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, f) => {
  let value = self.map.get(key);
  if (value === undefined) {
    value = key.initial;
  }
  return (0, Function_js_1.pipe)(self, (0, exports.overwrite)(key, f(value)));
});
/**
 * Retrieves the annotation of the specified type, or its default value if
 * there is none.
 *
 * @since 2.0.0
 */
exports.get = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, key) => {
  const value = self.map.get(key);
  if (value === undefined) {
    return key.initial;
  }
  return value;
});
/**
 * Appends the specified annotation to the annotation map.
 *
 * @since 2.0.0
 */
exports.annotate = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, value) => (0, exports.update)(self, key, _ => key.combine(_, value)));
/**
 * @since 2.0.0
 */
exports.combine = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  const result = new Map(self.map);
  for (const entry of that.map) {
    if (result.has(entry[0])) {
      const value = result.get(entry[0]);
      result.set(entry[0], entry[0].combine(value, entry[1]));
    } else {
      result.set(entry[0], entry[1]);
    }
  }
  return (0, exports.make)(result);
});
//# sourceMappingURL=TestAnnotationMap.js.map