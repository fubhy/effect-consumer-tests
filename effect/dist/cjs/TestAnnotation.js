"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagged = exports.retried = exports.repeated = exports.ignored = exports.fibers = exports.compose = exports.make = exports.isTestAnnotation = exports.TestAnnotationTypeId = void 0;
/**
 * @since 2.0.0
 */
const Chunk = /*#__PURE__*/require("./Chunk.js");
const Context = /*#__PURE__*/require("./Context.js");
const Either = /*#__PURE__*/require("./Either.js");
const Equal = /*#__PURE__*/require("./Equal.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Hash = /*#__PURE__*/require("./Hash.js");
const HashSet = /*#__PURE__*/require("./HashSet.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
/** @internal */
const TestAnnotationSymbolKey = "effect/TestAnnotation";
/**
 * @since 2.0.0
 */
exports.TestAnnotationTypeId = /*#__PURE__*/Symbol.for(TestAnnotationSymbolKey);
/** @internal */
class TestAnnotationImpl {
  identifier;
  tag;
  initial;
  combine;
  [exports.TestAnnotationTypeId] = exports.TestAnnotationTypeId;
  constructor(identifier, tag, initial, combine) {
    this.identifier = identifier;
    this.tag = tag;
    this.initial = initial;
    this.combine = combine;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(TestAnnotationSymbolKey), Hash.combine(Hash.hash(this.identifier)), Hash.combine(Hash.hash(this.tag)));
  }
  [Equal.symbol](that) {
    return (0, exports.isTestAnnotation)(that) && this.identifier === that.identifier && Equal.equals(this.tag, that.tag);
  }
}
/**
 * @since 2.0.0
 */
const isTestAnnotation = u => (0, Predicate_js_1.hasProperty)(u, exports.TestAnnotationTypeId);
exports.isTestAnnotation = isTestAnnotation;
/**
 * @since 2.0.0
 */
const make = (identifier, tag, initial, combine) => {
  return new TestAnnotationImpl(identifier, tag, initial, combine);
};
exports.make = make;
/**
 * @since 2.0.0
 */
const compose = (left, right) => {
  if (Either.isLeft(left) && Either.isLeft(right)) {
    return Either.left(left.left + right.left);
  }
  if (Either.isRight(left) && Either.isRight(right)) {
    return Either.right((0, Function_js_1.pipe)(left.right, Chunk.appendAll(right.right)));
  }
  if (Either.isRight(left) && Either.isLeft(right)) {
    return right;
  }
  if (Either.isLeft(left) && Either.isRight(right)) {
    return right;
  }
  throw new Error("BUG: TestAnnotation.compose - please report an issue at https://github.com/Effect-TS/io/issues");
};
exports.compose = compose;
/**
 * @since 2.0.0
 */
exports.fibers = /*#__PURE__*/(0, exports.make)("fibers", /*#__PURE__*/Context.Tag(), /*#__PURE__*/Either.left(0), exports.compose);
/**
 * An annotation which counts ignored tests.
 *
 * @since 2.0.0
 */
exports.ignored = /*#__PURE__*/(0, exports.make)("ignored", /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestAnnotation/ignored")), 0, (a, b) => a + b);
/**
 * An annotation which counts repeated tests.
 *
 * @since 2.0.0
 */
exports.repeated = /*#__PURE__*/(0, exports.make)("repeated", /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestAnnotation/repeated")), 0, (a, b) => a + b);
/**
 * An annotation which counts retried tests.
 *
 * @since 2.0.0
 */
exports.retried = /*#__PURE__*/(0, exports.make)("retried", /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestAnnotation/retired")), 0, (a, b) => a + b);
/**
 * An annotation which tags tests with strings.
 *
 * @since 2.0.0
 */
exports.tagged = /*#__PURE__*/(0, exports.make)("tagged", /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestAnnotation/tagged")), /*#__PURE__*/HashSet.empty(), (a, b) => (0, Function_js_1.pipe)(a, HashSet.union(b)));
//# sourceMappingURL=TestAnnotation.js.map