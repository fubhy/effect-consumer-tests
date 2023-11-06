"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toString = exports.toJSON = exports.NodeInspectSymbol = void 0;
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.NodeInspectSymbol = /*#__PURE__*/Symbol.for("nodejs.util.inspect.custom");
/**
 * @since 2.0.0
 */
const toJSON = x => {
  if ((0, Predicate_js_1.hasProperty)(x, "toJSON") && (0, Predicate_js_1.isFunction)(x["toJSON"]) && x["toJSON"].length === 0) {
    return x.toJSON();
  } else if (Array.isArray(x)) {
    return x.map(exports.toJSON);
  }
  return x;
};
exports.toJSON = toJSON;
/**
 * @since 2.0.0
 */
const toString = x => JSON.stringify(x, null, 2);
exports.toString = toString;
//# sourceMappingURL=Inspectable.js.map