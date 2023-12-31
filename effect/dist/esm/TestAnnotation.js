/**
 * @since 2.0.0
 */
import * as Chunk from "./Chunk.js";
import * as Context from "./Context.js";
import * as Either from "./Either.js";
import * as Equal from "./Equal.js";
import { pipe } from "./Function.js";
import * as Hash from "./Hash.js";
import * as HashSet from "./HashSet.js";
import { hasProperty } from "./Predicate.js";
/** @internal */
const TestAnnotationSymbolKey = "effect/TestAnnotation";
/**
 * @since 2.0.0
 */
export const TestAnnotationTypeId = /*#__PURE__*/Symbol.for(TestAnnotationSymbolKey);
/** @internal */
class TestAnnotationImpl {
  identifier;
  tag;
  initial;
  combine;
  [TestAnnotationTypeId] = TestAnnotationTypeId;
  constructor(identifier, tag, initial, combine) {
    this.identifier = identifier;
    this.tag = tag;
    this.initial = initial;
    this.combine = combine;
  }
  [Hash.symbol]() {
    return pipe(Hash.hash(TestAnnotationSymbolKey), Hash.combine(Hash.hash(this.identifier)), Hash.combine(Hash.hash(this.tag)));
  }
  [Equal.symbol](that) {
    return isTestAnnotation(that) && this.identifier === that.identifier && Equal.equals(this.tag, that.tag);
  }
}
/**
 * @since 2.0.0
 */
export const isTestAnnotation = u => hasProperty(u, TestAnnotationTypeId);
/**
 * @since 2.0.0
 */
export const make = (identifier, tag, initial, combine) => {
  return new TestAnnotationImpl(identifier, tag, initial, combine);
};
/**
 * @since 2.0.0
 */
export const compose = (left, right) => {
  if (Either.isLeft(left) && Either.isLeft(right)) {
    return Either.left(left.left + right.left);
  }
  if (Either.isRight(left) && Either.isRight(right)) {
    return Either.right(pipe(left.right, Chunk.appendAll(right.right)));
  }
  if (Either.isRight(left) && Either.isLeft(right)) {
    return right;
  }
  if (Either.isLeft(left) && Either.isRight(right)) {
    return right;
  }
  throw new Error("BUG: TestAnnotation.compose - please report an issue at https://github.com/Effect-TS/io/issues");
};
/**
 * @since 2.0.0
 */
export const fibers = /*#__PURE__*/make("fibers", /*#__PURE__*/Context.Tag(), /*#__PURE__*/Either.left(0), compose);
/**
 * An annotation which counts ignored tests.
 *
 * @since 2.0.0
 */
export const ignored = /*#__PURE__*/make("ignored", /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestAnnotation/ignored")), 0, (a, b) => a + b);
/**
 * An annotation which counts repeated tests.
 *
 * @since 2.0.0
 */
export const repeated = /*#__PURE__*/make("repeated", /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestAnnotation/repeated")), 0, (a, b) => a + b);
/**
 * An annotation which counts retried tests.
 *
 * @since 2.0.0
 */
export const retried = /*#__PURE__*/make("retried", /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestAnnotation/retired")), 0, (a, b) => a + b);
/**
 * An annotation which tags tests with strings.
 *
 * @since 2.0.0
 */
export const tagged = /*#__PURE__*/make("tagged", /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestAnnotation/tagged")), /*#__PURE__*/HashSet.empty(), (a, b) => pipe(a, HashSet.union(b)));
//# sourceMappingURL=TestAnnotation.js.map