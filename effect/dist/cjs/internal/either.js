"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromOption = exports.getRight = exports.getLeft = exports.right = exports.left = exports.isRight = exports.isLeft = exports.isEither = exports.TypeId = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const effectable_js_1 = /*#__PURE__*/require("./effectable.js");
const option = /*#__PURE__*/require("./option.js");
/**
 * @internal
 */
exports.TypeId = /*#__PURE__*/Symbol.for("effect/Either");
const CommonProto = {
  ...effectable_js_1.EffectPrototype,
  [exports.TypeId]: {
    _A: _ => _
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  }
};
const RightProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(CommonProto), {
  _tag: "Right",
  _op: "Right",
  [Equal.symbol](that) {
    return (0, exports.isEither)(that) && (0, exports.isRight)(that) && Equal.equals(that.right, this.right);
  },
  [Hash.symbol]() {
    return Hash.combine(Hash.hash(this._tag))(Hash.hash(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: (0, Inspectable_js_1.toJSON)(this.right)
    };
  }
});
const LeftProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(CommonProto), {
  _tag: "Left",
  _op: "Left",
  [Equal.symbol](that) {
    return (0, exports.isEither)(that) && (0, exports.isLeft)(that) && Equal.equals(that.left, this.left);
  },
  [Hash.symbol]() {
    return Hash.combine(Hash.hash(this._tag))(Hash.hash(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: (0, Inspectable_js_1.toJSON)(this.left)
    };
  }
});
/** @internal */
const isEither = input => (0, Predicate_js_1.hasProperty)(input, exports.TypeId);
exports.isEither = isEither;
/** @internal */
const isLeft = ma => ma._tag === "Left";
exports.isLeft = isLeft;
/** @internal */
const isRight = ma => ma._tag === "Right";
exports.isRight = isRight;
/** @internal */
const left = left => {
  const a = Object.create(LeftProto);
  a.left = left;
  return a;
};
exports.left = left;
/** @internal */
const right = right => {
  const a = Object.create(RightProto);
  a.right = right;
  return a;
};
exports.right = right;
/** @internal */
const getLeft = self => (0, exports.isRight)(self) ? option.none : option.some(self.left);
exports.getLeft = getLeft;
/** @internal */
const getRight = self => (0, exports.isLeft)(self) ? option.none : option.some(self.right);
exports.getRight = getRight;
/** @internal */
exports.fromOption = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, onNone) => option.isNone(self) ? (0, exports.left)(onNone()) : (0, exports.right)(self.value));
//# sourceMappingURL=either.js.map