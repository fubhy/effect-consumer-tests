"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.some = exports.none = exports.isSome = exports.isNone = exports.isOption = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const effectable_js_1 = /*#__PURE__*/require("./effectable.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/Option");
const CommonProto = {
  ...effectable_js_1.EffectPrototype,
  [TypeId]: {
    _A: _ => _
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  }
};
const SomeProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [Equal.symbol](that) {
    return (0, exports.isOption)(that) && (0, exports.isSome)(that) && Equal.equals(that.value, this.value);
  },
  [Hash.symbol]() {
    return Hash.combine(Hash.hash(this._tag))(Hash.hash(this.value));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: (0, Inspectable_js_1.toJSON)(this.value)
    };
  }
});
const NoneProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  [Equal.symbol](that) {
    return (0, exports.isOption)(that) && (0, exports.isNone)(that);
  },
  [Hash.symbol]() {
    return Hash.combine(Hash.hash(this._tag));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
/** @internal */
const isOption = input => (0, Predicate_js_1.hasProperty)(input, TypeId);
exports.isOption = isOption;
/** @internal */
const isNone = fa => fa._tag === "None";
exports.isNone = isNone;
/** @internal */
const isSome = fa => fa._tag === "Some";
exports.isSome = isSome;
/** @internal */
exports.none = /*#__PURE__*/Object.create(NoneProto);
/** @internal */
const some = value => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};
exports.some = some;
//# sourceMappingURL=option.js.map