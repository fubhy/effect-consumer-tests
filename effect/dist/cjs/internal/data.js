"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = exports.Structural = exports.StructProto = exports.ArrayProto = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Hash = /*#__PURE__*/require("../Hash.js");
/** @internal */
exports.ArrayProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(Array.prototype), {
  [Hash.symbol]() {
    return Hash.array(this);
  },
  [Equal.symbol](that) {
    if (Array.isArray(that) && this.length === that.length) {
      return this.every((v, i) => Equal.equals(v, that[i]));
    } else {
      return false;
    }
  }
});
/** @internal */
exports.StructProto = {
  [Hash.symbol]() {
    return Hash.structure(this);
  },
  [Equal.symbol](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key of selfKeys) {
      if (!(key in that && Equal.equals(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  }
};
/** @internal */
exports.Structural = /*#__PURE__*/function () {
  function Structural(args) {
    if (args) {
      Object.assign(this, args);
    }
  }
  Structural.prototype = exports.StructProto;
  return Structural;
}();
/** @internal */
const struct = as => Object.assign(Object.create(exports.StructProto), as);
exports.struct = struct;
//# sourceMappingURL=data.js.map