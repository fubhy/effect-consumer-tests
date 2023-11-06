"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shrinks = exports.samples = exports.retries = exports.repeats = exports.testConfigLayer = exports.withTestConfigScoped = exports.withTestConfig = exports.testConfig = exports.testConfigWith = exports.withSize = exports.size = exports.sizedLayer = exports.withSizedScoped = exports.withSized = exports.sized = exports.sizedWith = exports.provideWithLive = exports.provideLive = exports.liveLayer = exports.withLiveScoped = exports.withLive = exports.live = exports.liveWith = exports.supervisedFibers = exports.annotate = exports.get = exports.annotationsLayer = exports.withAnnotationsScoped = exports.withAnnotations = exports.annotationsWith = exports.annotations = exports.currentServices = exports.liveServices = void 0;
/**
 * @since 2.0.0
 */
const Context = /*#__PURE__*/require("./Context.js");
const Effect = /*#__PURE__*/require("./Effect.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const core = /*#__PURE__*/require("./internal/core.js");
const defaultServices = /*#__PURE__*/require("./internal/defaultServices.js");
const fiberRuntime = /*#__PURE__*/require("./internal/fiberRuntime.js");
const layer = /*#__PURE__*/require("./internal/layer.js");
const ref = /*#__PURE__*/require("./internal/ref.js");
const TestAnnotationMap = /*#__PURE__*/require("./TestAnnotationMap.js");
const Annotations = /*#__PURE__*/require("./TestAnnotations.js");
const TestConfig = /*#__PURE__*/require("./TestConfig.js");
const Live = /*#__PURE__*/require("./TestLive.js");
const Sized = /*#__PURE__*/require("./TestSized.js");
/**
 * The default Effect test services.
 *
 * @since 2.0.0
 */
exports.liveServices = /*#__PURE__*/(0, Function_js_1.pipe)( /*#__PURE__*/Context.make(Annotations.TestAnnotations, /*#__PURE__*/Annotations.make( /*#__PURE__*/ref.unsafeMake( /*#__PURE__*/TestAnnotationMap.empty()))), /*#__PURE__*/Context.add(Live.TestLive, /*#__PURE__*/Live.make(defaultServices.liveServices)), /*#__PURE__*/Context.add(Sized.TestSized, /*#__PURE__*/Sized.make(100)), /*#__PURE__*/Context.add(TestConfig.TestConfig, /*#__PURE__*/TestConfig.make({
  repeats: 100,
  retries: 100,
  samples: 200,
  shrinks: 1000
})));
/**
 * @since 2.0.0
 */
exports.currentServices = /*#__PURE__*/core.fiberRefUnsafeMakeContext(exports.liveServices);
/**
 * Retrieves the `Annotations` service for this test.
 *
 * @since 2.0.0
 */
const annotations = () => (0, exports.annotationsWith)(core.succeed);
exports.annotations = annotations;
/**
 * Retrieves the `Annotations` service for this test and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 */
const annotationsWith = f => core.fiberRefGetWith(exports.currentServices, services => f(Context.get(services, Annotations.TestAnnotations)));
exports.annotationsWith = annotationsWith;
/**
 * Executes the specified workflow with the specified implementation of the
 * annotations service.
 *
 * @since 2.0.0
 */
exports.withAnnotations = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, annotations) => core.fiberRefLocallyWith(exports.currentServices, Context.add(Annotations.TestAnnotations, annotations))(effect));
/**
 * Sets the implementation of the annotations service to the specified value
 * and restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 */
const withAnnotationsScoped = annotations => fiberRuntime.fiberRefLocallyScopedWith(exports.currentServices, Context.add(Annotations.TestAnnotations, annotations));
exports.withAnnotationsScoped = withAnnotationsScoped;
/**
 * Constructs a new `Annotations` service wrapped in a layer.
 *
 * @since 2.0.0
 */
const annotationsLayer = () => layer.scoped(Annotations.TestAnnotations, (0, Function_js_1.pipe)(core.sync(() => ref.unsafeMake(TestAnnotationMap.empty())), core.map(Annotations.make), core.tap(exports.withAnnotationsScoped)));
exports.annotationsLayer = annotationsLayer;
/**
 * Accesses an `Annotations` instance in the context and retrieves the
 * annotation of the specified type, or its default value if there is none.
 *
 * @since 2.0.0
 */
const get = key => (0, exports.annotationsWith)(annotations => annotations.get(key));
exports.get = get;
/**
 * Accesses an `Annotations` instance in the context and appends the
 * specified annotation to the annotation map.
 *
 * @since 2.0.0
 */
const annotate = (key, value) => (0, exports.annotationsWith)(annotations => annotations.annotate(key, value));
exports.annotate = annotate;
/**
 * Returns the set of all fibers in this test.
 *
 * @since 2.0.0
 */
const supervisedFibers = () => (0, exports.annotationsWith)(annotations => annotations.supervisedFibers());
exports.supervisedFibers = supervisedFibers;
/**
 * Retrieves the `Live` service for this test and uses it to run the specified
 * workflow.
 *
 * @since 2.0.0
 */
const liveWith = f => core.fiberRefGetWith(exports.currentServices, services => f(Context.get(services, Live.TestLive)));
exports.liveWith = liveWith;
/**
 * Retrieves the `Live` service for this test.
 *
 * @since 2.0.0
 */
exports.live = /*#__PURE__*/(0, exports.liveWith)(core.succeed);
/**
 * Executes the specified workflow with the specified implementation of the
 * live service.
 *
 * @since 2.0.0
 */
exports.withLive = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, live) => core.fiberRefLocallyWith(exports.currentServices, Context.add(Live.TestLive, live))(effect));
/**
 * Sets the implementation of the live service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 */
const withLiveScoped = live => fiberRuntime.fiberRefLocallyScopedWith(exports.currentServices, Context.add(Live.TestLive, live));
exports.withLiveScoped = withLiveScoped;
/**
 * Constructs a new `Live` service wrapped in a layer.
 *
 * @since 2.0.0
 */
const liveLayer = () => layer.scoped(Live.TestLive, (0, Function_js_1.pipe)(core.context(), core.map(Live.make), core.tap(exports.withLiveScoped)));
exports.liveLayer = liveLayer;
/**
 * Provides a workflow with the "live" default Effect services.
 *
 * @since 2.0.0
 */
const provideLive = effect => (0, exports.liveWith)(live => live.provide(effect));
exports.provideLive = provideLive;
/**
 * Runs a transformation function with the live default Effect services while
 * ensuring that the workflow itself is run with the test services.
 *
 * @since 2.0.0
 */
exports.provideWithLive = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.fiberRefGetWith(defaultServices.currentServices, services => (0, exports.provideLive)(f(core.fiberRefLocally(defaultServices.currentServices, services)(self)))));
/**
 * Retrieves the `Sized` service for this test and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 */
const sizedWith = f => core.fiberRefGetWith(exports.currentServices, services => f(Context.get(services, Sized.TestSized)));
exports.sizedWith = sizedWith;
/**
 * Retrieves the `Sized` service for this test.
 *
 * @since 2.0.0
 */
exports.sized = /*#__PURE__*/(0, exports.sizedWith)(core.succeed);
/**
 * Executes the specified workflow with the specified implementation of the
 * sized service.
 *
 * @since 2.0.0
 */
exports.withSized = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, sized) => core.fiberRefLocallyWith(exports.currentServices, Context.add(Sized.TestSized, sized))(effect));
/**
 * Sets the implementation of the sized service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 */
const withSizedScoped = sized => fiberRuntime.fiberRefLocallyScopedWith(exports.currentServices, Context.add(Sized.TestSized, sized));
exports.withSizedScoped = withSizedScoped;
/**
 * @since 2.0.0
 */
const sizedLayer = size => layer.scoped(Sized.TestSized, (0, Function_js_1.pipe)(fiberRuntime.fiberRefMake(size), core.map(Sized.fromFiberRef), core.tap(exports.withSizedScoped)));
exports.sizedLayer = sizedLayer;
/**
 * @since 2.0.0
 */
exports.size = /*#__PURE__*/(0, exports.sizedWith)(sized => sized.size());
/**
 * @since 2.0.0
 */
exports.withSize = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, size) => (0, exports.sizedWith)(sized => sized.withSize(size)(effect)));
/**
 * Retrieves the `TestConfig` service for this test and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 */
const testConfigWith = f => core.fiberRefGetWith(exports.currentServices, services => f(Context.get(services, TestConfig.TestConfig)));
exports.testConfigWith = testConfigWith;
/**
 * Retrieves the `TestConfig` service for this test.
 *
 * @since 2.0.0
 */
exports.testConfig = /*#__PURE__*/(0, exports.testConfigWith)(core.succeed);
/**
 * Executes the specified workflow with the specified implementation of the
 * config service.
 *
 * @since 2.0.0
 */
exports.withTestConfig = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, config) => core.fiberRefLocallyWith(exports.currentServices, Context.add(TestConfig.TestConfig, config))(effect));
/**
 * Sets the implementation of the config service to the specified value and
 * restores it to its original value when the scope is closed.
 *
 * @since 2.0.0
 */
const withTestConfigScoped = config => fiberRuntime.fiberRefLocallyScopedWith(exports.currentServices, Context.add(TestConfig.TestConfig, config));
exports.withTestConfigScoped = withTestConfigScoped;
/**
 * Constructs a new `TestConfig` service with the specified settings.
 *
 * @since 2.0.0
 */
const testConfigLayer = params => layer.scoped(TestConfig.TestConfig, Effect.suspend(() => {
  const testConfig = TestConfig.make(params);
  return (0, Function_js_1.pipe)((0, exports.withTestConfigScoped)(testConfig), core.as(testConfig));
}));
exports.testConfigLayer = testConfigLayer;
/**
 * The number of times to repeat tests to ensure they are stable.
 *
 * @since 2.0.0
 */
exports.repeats = /*#__PURE__*/(0, exports.testConfigWith)(config => core.succeed(config.repeats));
/**
 * The number of times to retry flaky tests.
 *
 * @since 2.0.0
 */
exports.retries = /*#__PURE__*/(0, exports.testConfigWith)(config => core.succeed(config.retries));
/**
 * The number of sufficient samples to check for a random variable.
 *
 * @since 2.0.0
 */
exports.samples = /*#__PURE__*/(0, exports.testConfigWith)(config => core.succeed(config.samples));
/**
 * The maximum number of shrinkings to minimize large failures.
 *
 * @since 2.0.0
 */
exports.shrinks = /*#__PURE__*/(0, exports.testConfigWith)(config => core.succeed(config.shrinks));
//# sourceMappingURL=TestServices.js.map