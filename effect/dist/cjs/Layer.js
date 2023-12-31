"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.succeedContext = exports.succeed = exports.service = exports.scopedContext = exports.scopedDiscard = exports.scoped = exports.scope = exports.retry = exports.provideMerge = exports.fiberRefLocallyScopedWith = exports.locallyScoped = exports.locallyWith = exports.locally = exports.locallyEffect = exports.provide = exports.project = exports.passthrough = exports.orElse = exports.orDie = exports.mergeAll = exports.merge = exports.memoize = exports.matchCause = exports.match = exports.mapError = exports.map = exports.launch = exports.function = exports.fresh = exports.flatten = exports.flatMap = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.extendScope = exports.effectContext = exports.effectDiscard = exports.effect = exports.discard = exports.dieSync = exports.die = exports.context = exports.catchAllCause = exports.catchAll = exports.buildWithScope = exports.build = exports.isFresh = exports.isLayer = exports.LayerTypeId = void 0;
exports.withParentSpan = exports.withSpan = exports.setUnhandledErrorLogLevel = exports.setTracerTiming = exports.setTracer = exports.span = exports.setScheduler = exports.setRequestCache = exports.setRequestCaching = exports.setRequestBatching = exports.parentSpan = exports.setConfigProvider = exports.setClock = exports.unwrapScoped = exports.unwrapEffect = exports.zipWithPar = exports.useMerge = exports.use = exports.toRuntime = exports.tapErrorCause = exports.tapError = exports.tap = exports.syncContext = exports.sync = exports.suspend = void 0;
const Context = /*#__PURE__*/require("./Context.js");
const clock_js_1 = /*#__PURE__*/require("./internal/clock.js");
const core = /*#__PURE__*/require("./internal/core.js");
const defaultServices = /*#__PURE__*/require("./internal/defaultServices.js");
const fiberRuntime = /*#__PURE__*/require("./internal/fiberRuntime.js");
const internal = /*#__PURE__*/require("./internal/layer.js");
const circularLayer = /*#__PURE__*/require("./internal/layer/circular.js");
const query = /*#__PURE__*/require("./internal/query.js");
const Scheduler = /*#__PURE__*/require("./Scheduler.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.LayerTypeId = internal.LayerTypeId;
/**
 * Returns `true` if the specified value is a `Layer`, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isLayer = internal.isLayer;
/**
 * Returns `true` if the specified `Layer` is a fresh version that will not be
 * shared, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isFresh = internal.isFresh;
/**
 * Builds a layer into a scoped value.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.build = internal.build;
/**
 * Builds a layer into an `Effect` value. Any resources associated with this
 * layer will be released when the specified scope is closed unless their scope
 * has been extended. This allows building layers where the lifetime of some of
 * the services output by the layer exceed the lifetime of the effect the
 * layer is provided to.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.buildWithScope = internal.buildWithScope;
/**
 * Recovers from all errors.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchAll = internal.catchAll;
/**
 * Recovers from all errors.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchAllCause = internal.catchAllCause;
/**
 * Constructs a `Layer` that passes along the specified context as an
 * output.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.context = internal.context;
/**
 * Constructs a layer that dies with the specified defect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.die = internal.die;
/**
 * Constructs a layer that dies with the specified defect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dieSync = internal.dieSync;
/**
 * Replaces the layer's output with `void` and includes the layer only for its
 * side-effects.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.discard = internal.discard;
/**
 * Constructs a layer from the specified effect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.effect = internal.fromEffect;
/**
 * Constructs a layer from the specified effect discarding it's output.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.effectDiscard = internal.fromEffectDiscard;
/**
 * Constructs a layer from the specified effect, which must return one or more
 * services.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.effectContext = internal.fromEffectContext;
/**
 * Extends the scope of this layer, returning a new layer that when provided
 * to an effect will not immediately release its associated resources when
 * that effect completes execution but instead when the scope the resulting
 * effect depends on is closed.
 *
 * @since 2.0.0
 * @category utils
 */
exports.extendScope = internal.extendScope;
/**
 * Constructs a layer that fails with the specified error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fail = internal.fail;
/**
 * Constructs a layer that fails with the specified error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failSync = internal.failSync;
/**
 * Constructs a layer that fails with the specified cause.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failCause = internal.failCause;
/**
 * Constructs a layer that fails with the specified cause.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failCauseSync = internal.failCauseSync;
/**
 * Constructs a layer dynamically based on the output of this layer.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = internal.flatMap;
/**
 * Flattens layers nested in the context of an effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatten = internal.flatten;
/**
 * Creates a fresh version of this layer that will not be shared.
 *
 * @since 2.0.0
 * @category utils
 */
exports.fresh = internal.fresh;
const fromFunction = internal.fromFunction;
exports.function = fromFunction;
/**
 * Builds this layer and uses it until it is interrupted. This is useful when
 * your entire application is a layer, such as an HTTP server.
 *
 * @since 2.0.0
 * @category conversions
 */
exports.launch = internal.launch;
/**
 * Returns a new layer whose output is mapped by the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = internal.map;
/**
 * Returns a layer with its error channel mapped using the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapError = internal.mapError;
/**
 * Feeds the error or output services of this layer into the input of either
 * the specified `failure` or `success` layers, resulting in a new layer with
 * the inputs of this layer, and the error or outputs of the specified layer.
 *
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
/**
 * Feeds the error or output services of this layer into the input of either
 * the specified `failure` or `success` layers, resulting in a new layer with
 * the inputs of this layer, and the error or outputs of the specified layer.
 *
 * @since 2.0.0
 * @category folding
 */
exports.matchCause = internal.matchCause;
/**
 * Returns a scoped effect that, if evaluated, will return the lazily computed
 * result of this layer.
 *
 * @since 2.0.0
 * @category utils
 */
exports.memoize = internal.memoize;
/**
 * Combines this layer with the specified layer, producing a new layer that
 * has the inputs and outputs of both.
 *
 * @since 2.0.0
 * @category utils
 */
exports.merge = internal.merge;
/**
 * Merges all the layers together in parallel.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.mergeAll = internal.mergeAll;
/**
 * Translates effect failure into death of the fiber, making all failures
 * unchecked and not a part of the type of the layer.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orDie = internal.orDie;
/**
 * Executes this layer and returns its output, if it succeeds, but otherwise
 * executes the specified layer.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElse = internal.orElse;
/**
 * Returns a new layer that produces the outputs of this layer but also
 * passes through the inputs.
 *
 * @since 2.0.0
 * @category utils
 */
exports.passthrough = internal.passthrough;
/**
 * Projects out part of one of the services output by this layer using the
 * specified function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.project = internal.project;
/**
 * Feeds the output services of this builder into the input of the specified
 * builder, resulting in a new builder with the inputs of this builder as
 * well as any leftover inputs, and the outputs of the specified builder.
 *
 * @since 2.0.0
 * @category utils
 */
exports.provide = internal.provide;
/**
 * @since 2.0.0
 * @category utils
 */
exports.locallyEffect = internal.locallyEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.locally = internal.fiberRefLocally;
/**
 * @since 2.0.0
 * @category utils
 */
exports.locallyWith = internal.fiberRefLocallyWith;
/**
 * @since 2.0.0
 * @category utils
 */
exports.locallyScoped = internal.fiberRefLocallyScoped;
/**
 * @since 2.0.0
 * @category utils
 */
exports.fiberRefLocallyScopedWith = internal.fiberRefLocallyScopedWith;
/**
 * Feeds the output services of this layer into the input of the specified
 * layer, resulting in a new layer with the inputs of this layer, and the
 * outputs of both layers.
 *
 * @since 2.0.0
 * @category utils
 */
exports.provideMerge = internal.provideMerge;
/**
 * Retries constructing this layer according to the specified schedule.
 *
 * @since 2.0.0
 * @category retrying
 */
exports.retry = internal.retry;
/**
 * A layer that constructs a scope and closes it when the workflow the layer
 * is provided to completes execution, whether by success, failure, or
 * interruption. This can be used to close a scope when providing a layer to a
 * workflow.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.scope = internal.scope;
/**
 * Constructs a layer from the specified scoped effect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.scoped = internal.scoped;
/**
 * Constructs a layer from the specified scoped effect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.scopedDiscard = internal.scopedDiscard;
/**
 * Constructs a layer from the specified scoped effect, which must return one
 * or more services.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.scopedContext = internal.scopedContext;
/**
 * Constructs a layer that accesses and returns the specified service from the
 * context.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.service = internal.service;
/**
 * Constructs a layer from the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = internal.succeed;
/**
 * Constructs a layer from the specified value, which must return one or more
 * services.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeedContext = internal.succeedContext;
/**
 * Lazily constructs a layer. This is useful to avoid infinite recursion when
 * creating layers that refer to themselves.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.suspend = internal.suspend;
/**
 * Lazily constructs a layer from the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sync = internal.sync;
/**
 * Lazily constructs a layer from the specified value, which must return one or more
 * services.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.syncContext = internal.syncContext;
/**
 * Performs the specified effect if this layer succeeds.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tap = internal.tap;
/**
 * Performs the specified effect if this layer fails.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapError = internal.tapError;
/**
 * Performs the specified effect if this layer fails.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapErrorCause = internal.tapErrorCause;
/**
 * Converts a layer that requires no services into a scoped runtime, which can
 * be used to execute effects.
 *
 * @since 2.0.0
 * @category conversions
 */
exports.toRuntime = internal.toRuntime;
/**
 * Feeds the output services of this builder into the input of the specified
 * builder, resulting in a new builder with the inputs of this builder as
 * well as any leftover inputs, and the outputs of the specified builder.
 *
 * @since 2.0.0
 * @category utils
 */
exports.use = internal.use;
/**
 * Feeds the output services of this layer into the input of the specified
 * layer, resulting in a new layer with the inputs of this layer, and the
 * outputs of both layers.
 *
 * @since 2.0.0
 * @category utils
 */
exports.useMerge = internal.useMerge;
/**
 * Combines this layer the specified layer, producing a new layer that has the
 * inputs of both, and the outputs of both combined using the specified
 * function.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWithPar = internal.zipWithPar;
/**
 * @since 2.0.0
 * @category utils
 */
exports.unwrapEffect = internal.unwrapEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.unwrapScoped = internal.unwrapScoped;
/**
 * @since 2.0.0
 * @category clock
 */
const setClock = clock => (0, exports.scopedDiscard)(fiberRuntime.fiberRefLocallyScopedWith(defaultServices.currentServices, Context.add(clock_js_1.clockTag, clock)));
exports.setClock = setClock;
/**
 * Sets the current `ConfigProvider`.
 *
 * @since 2.0.0
 * @category config
 */
exports.setConfigProvider = circularLayer.setConfigProvider;
/**
 * Adds the provided span to the span stack.
 *
 * @since 2.0.0
 * @category tracing
 */
exports.parentSpan = circularLayer.parentSpan;
/**
 * @since 2.0.0
 * @category requests & batching
 */
const setRequestBatching = requestBatching => (0, exports.scopedDiscard)(fiberRuntime.fiberRefLocallyScoped(core.currentRequestBatching, requestBatching));
exports.setRequestBatching = setRequestBatching;
/**
 * @since 2.0.0
 * @category requests & batching
 */
const setRequestCaching = requestCaching => (0, exports.scopedDiscard)(fiberRuntime.fiberRefLocallyScoped(query.currentCacheEnabled, requestCaching));
exports.setRequestCaching = setRequestCaching;
/**
 * @since 2.0.0
 * @category requests & batching
 */
exports.setRequestCache = cache => (0, exports.scopedDiscard)(core.isEffect(cache) ? core.flatMap(cache, x => fiberRuntime.fiberRefLocallyScoped(query.currentCache, x)) : fiberRuntime.fiberRefLocallyScoped(query.currentCache, cache));
/**
 * @since 2.0.0
 * @category scheduler
 */
const setScheduler = scheduler => (0, exports.scopedDiscard)(fiberRuntime.fiberRefLocallyScoped(Scheduler.currentScheduler, scheduler));
exports.setScheduler = setScheduler;
/**
 * Create and add a span to the current span stack.
 *
 * The span is ended when the Layer is released.
 *
 * @since 2.0.0
 * @category tracing
 */
exports.span = circularLayer.span;
/**
 * Create a Layer that sets the current Tracer
 *
 * @since 2.0.0
 * @category tracing
 */
exports.setTracer = circularLayer.setTracer;
/**
 * @since 2.0.0
 * @category tracing
 */
const setTracerTiming = enabled => (0, exports.scopedDiscard)(fiberRuntime.fiberRefLocallyScoped(core.currentTracerTimingEnabled, enabled));
exports.setTracerTiming = setTracerTiming;
/**
 * @since 2.0.0
 * @category logging
 */
const setUnhandledErrorLogLevel = level => (0, exports.scopedDiscard)(fiberRuntime.fiberRefLocallyScoped(core.currentUnhandledErrorLogLevel, level));
exports.setUnhandledErrorLogLevel = setUnhandledErrorLogLevel;
/**
 * @since 2.0.0
 * @category tracing
 */
exports.withSpan = internal.withSpan;
/**
 * @since 2.0.0
 * @category tracing
 */
exports.withParentSpan = internal.withParentSpan;
//# sourceMappingURL=Layer.js.map