"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = exports.isTestAnnotations = exports.TestAnnotations = exports.TestAnnotationsTypeId = void 0;
/**
 * @since 2.0.0
 */
const Context = /*#__PURE__*/require("./Context.js");
const Equal = /*#__PURE__*/require("./Equal.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const effect = /*#__PURE__*/require("./internal/core-effect.js");
const core = /*#__PURE__*/require("./internal/core.js");
const fiber = /*#__PURE__*/require("./internal/fiber.js");
const MutableRef = /*#__PURE__*/require("./MutableRef.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const RA = /*#__PURE__*/require("./ReadonlyArray.js");
const Ref = /*#__PURE__*/require("./Ref.js");
const SortedSet = /*#__PURE__*/require("./SortedSet.js");
const TestAnnotation = /*#__PURE__*/require("./TestAnnotation.js");
const TestAnnotationMap = /*#__PURE__*/require("./TestAnnotationMap.js");
/**
 * @since 2.0.0
 */
exports.TestAnnotationsTypeId = /*#__PURE__*/Symbol.for("effect/TestAnnotations");
/** @internal */
class AnnotationsImpl {
  ref;
  [exports.TestAnnotationsTypeId] = exports.TestAnnotationsTypeId;
  constructor(ref) {
    this.ref = ref;
  }
  get(key) {
    return core.map(Ref.get(this.ref), TestAnnotationMap.get(key));
  }
  annotate(key, value) {
    return Ref.update(this.ref, TestAnnotationMap.annotate(key, value));
  }
  supervisedFibers() {
    return effect.descriptorWith(descriptor => core.flatMap(this.get(TestAnnotation.fibers), either => {
      switch (either._tag) {
        case "Left":
          {
            return core.succeed(SortedSet.empty(fiber.Order));
          }
        case "Right":
          {
            return (0, Function_js_1.pipe)(either.right, core.forEachSequential(ref => core.sync(() => MutableRef.get(ref))), core.map(RA.reduce(SortedSet.empty(fiber.Order), (a, b) => SortedSet.union(a, b))), core.map(SortedSet.filter(fiber => !Equal.equals(fiber.id(), descriptor.id))));
          }
      }
    }));
  }
}
/**
 * @since 2.0.0
 */
exports.TestAnnotations = /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/Annotations"));
/**
 * @since 2.0.0
 */
const isTestAnnotations = u => (0, Predicate_js_1.hasProperty)(u, exports.TestAnnotationsTypeId);
exports.isTestAnnotations = isTestAnnotations;
/**
 * @since 2.0.0
 */
const make = ref => new AnnotationsImpl(ref);
exports.make = make;
//# sourceMappingURL=TestAnnotations.js.map