"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTracer = exports.span = exports.parentSpan = exports.setConfigProvider = exports.disableWindDown = exports.disableRuntimeMetrics = exports.disableOpSupervision = exports.disableInterruption = exports.disableCooperativeYielding = exports.enableWindDown = exports.enableRuntimeMetrics = exports.enableOpSupervision = exports.enableInterruption = exports.enableCooperativeYielding = exports.addSupervisor = exports.replaceLoggerScoped = exports.replaceLoggerEffect = exports.replaceLogger = exports.removeLogger = exports.addLoggerScoped = exports.addLoggerEffect = exports.addLogger = exports.withMinimumLogLevel = exports.minimumLogLevel = void 0;
const Context = /*#__PURE__*/require("../../Context.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const HashSet = /*#__PURE__*/require("../../HashSet.js");
const core = /*#__PURE__*/require("../core.js");
const fiberRuntime = /*#__PURE__*/require("../fiberRuntime.js");
const layer = /*#__PURE__*/require("../layer.js");
const runtimeFlags = /*#__PURE__*/require("../runtimeFlags.js");
const runtimeFlagsPatch = /*#__PURE__*/require("../runtimeFlagsPatch.js");
const _supervisor = /*#__PURE__*/require("../supervisor.js");
const tracer = /*#__PURE__*/require("../tracer.js");
// circular with Logger
/** @internal */
const minimumLogLevel = level => layer.scopedDiscard(fiberRuntime.fiberRefLocallyScoped(fiberRuntime.currentMinimumLogLevel, level));
exports.minimumLogLevel = minimumLogLevel;
/** @internal */
exports.withMinimumLogLevel = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, level) => core.fiberRefLocally(fiberRuntime.currentMinimumLogLevel, level)(self));
/** @internal */
const addLogger = logger => layer.scopedDiscard(fiberRuntime.fiberRefLocallyScopedWith(fiberRuntime.currentLoggers, HashSet.add(logger)));
exports.addLogger = addLogger;
/** @internal */
const addLoggerEffect = effect => layer.unwrapEffect(core.map(effect, exports.addLogger));
exports.addLoggerEffect = addLoggerEffect;
/** @internal */
const addLoggerScoped = effect => layer.unwrapScoped(core.map(effect, exports.addLogger));
exports.addLoggerScoped = addLoggerScoped;
/** @internal */
const removeLogger = logger => layer.scopedDiscard(fiberRuntime.fiberRefLocallyScopedWith(fiberRuntime.currentLoggers, HashSet.remove(logger)));
exports.removeLogger = removeLogger;
/** @internal */
exports.replaceLogger = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => layer.flatMap((0, exports.removeLogger)(self), () => (0, exports.addLogger)(that)));
/** @internal */
exports.replaceLoggerEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => layer.flatMap((0, exports.removeLogger)(self), () => (0, exports.addLoggerEffect)(that)));
/** @internal */
exports.replaceLoggerScoped = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => layer.flatMap((0, exports.removeLogger)(self), () => (0, exports.addLoggerScoped)(that)));
/** @internal */
const addSupervisor = supervisor => layer.scopedDiscard(fiberRuntime.fiberRefLocallyScopedWith(fiberRuntime.currentSupervisor, current => new _supervisor.Zip(current, supervisor)));
exports.addSupervisor = addSupervisor;
/** @internal */
exports.enableCooperativeYielding = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.enable(runtimeFlags.CooperativeYielding)));
/** @internal */
exports.enableInterruption = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.enable(runtimeFlags.Interruption)));
/** @internal */
exports.enableOpSupervision = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.enable(runtimeFlags.OpSupervision)));
/** @internal */
exports.enableRuntimeMetrics = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.enable(runtimeFlags.RuntimeMetrics)));
/** @internal */
exports.enableWindDown = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.enable(runtimeFlags.WindDown)));
/** @internal */
exports.disableCooperativeYielding = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.disable(runtimeFlags.CooperativeYielding)));
/** @internal */
exports.disableInterruption = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.disable(runtimeFlags.Interruption)));
/** @internal */
exports.disableOpSupervision = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.disable(runtimeFlags.OpSupervision)));
/** @internal */
exports.disableRuntimeMetrics = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.disable(runtimeFlags.RuntimeMetrics)));
/** @internal */
exports.disableWindDown = /*#__PURE__*/layer.scopedDiscard( /*#__PURE__*/fiberRuntime.withRuntimeFlagsScoped( /*#__PURE__*/runtimeFlagsPatch.disable(runtimeFlags.WindDown)));
/** @internal */
const setConfigProvider = configProvider => layer.scopedDiscard(fiberRuntime.withConfigProviderScoped(configProvider));
exports.setConfigProvider = setConfigProvider;
/** @internal */
const parentSpan = span => layer.succeedContext(Context.make(tracer.spanTag, span));
exports.parentSpan = parentSpan;
/** @internal */
const span = (name, options) => layer.scoped(tracer.spanTag, options?.onEnd ? core.tap(fiberRuntime.makeSpanScoped(name, options), span => fiberRuntime.addFinalizer(exit => options.onEnd(span, exit))) : fiberRuntime.makeSpanScoped(name, options));
exports.span = span;
/** @internal */
const setTracer = tracer => layer.scopedDiscard(fiberRuntime.withTracerScoped(tracer));
exports.setTracer = setTracer;
//# sourceMappingURL=circular.js.map