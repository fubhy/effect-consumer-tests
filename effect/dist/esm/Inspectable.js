/**
 * @since 2.0.0
 */
import { hasProperty, isFunction } from "./Predicate.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export const NodeInspectSymbol = /*#__PURE__*/Symbol.for("nodejs.util.inspect.custom");
/**
 * @since 2.0.0
 */
export const toJSON = x => {
  if (hasProperty(x, "toJSON") && isFunction(x["toJSON"]) && x["toJSON"].length === 0) {
    return x.toJSON();
  } else if (Array.isArray(x)) {
    return x.map(toJSON);
  }
  return x;
};
/**
 * @since 2.0.0
 */
export const toString = x => JSON.stringify(x, null, 2);
//# sourceMappingURL=Inspectable.js.map