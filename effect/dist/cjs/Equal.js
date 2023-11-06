"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equivalence = exports.isEqual = exports.equals = exports.symbol = void 0;
const Hash = /*#__PURE__*/require("./Hash.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.symbol = /*#__PURE__*/Symbol.for("effect/Equal");
function equals() {
  if (arguments.length === 1) {
    return self => compareBoth(self, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
exports.equals = equals;
function compareBoth(self, that) {
  if (self === that) {
    return true;
  }
  const selfType = typeof self;
  if (selfType !== typeof that) {
    return false;
  }
  if ((selfType === "object" || selfType === "function") && self !== null && that !== null) {
    if ((0, exports.isEqual)(self) && (0, exports.isEqual)(that)) {
      return Hash.hash(self) === Hash.hash(that) && self[exports.symbol](that);
    }
  }
  return false;
}
/**
 * @since 2.0.0
 * @category guards
 */
const isEqual = u => (0, Predicate_js_1.hasProperty)(u, exports.symbol);
exports.isEqual = isEqual;
/**
 * @since 2.0.0
 * @category instances
 */
const equivalence = () => (self, that) => equals(self, that);
exports.equivalence = equivalence;
//# sourceMappingURL=Equal.js.map