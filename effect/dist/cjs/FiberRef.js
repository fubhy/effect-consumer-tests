"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interruptedCause = exports.currentTracerSpanLinks = exports.currentTracerSpanAnnotations = exports.currentTracerTimingEnabled = exports.currentMetricLabels = exports.currentSupervisor = exports.currentScheduler = exports.currentRuntimeFlags = exports.currentLogSpan = exports.currentMinimumLogLevel = exports.currentLogLevel = exports.currentLoggers = exports.currentLogAnnotations = exports.unhandledErrorLogLevel = exports.currentMaxOpsBeforeYield = exports.currentSchedulingPriority = exports.currentContext = exports.currentRequestCacheEnabled = exports.currentRequestCache = exports.currentRequestBatchingEnabled = exports.updateSomeAndGet = exports.updateAndGet = exports.updateSome = exports.update = exports.modifySome = exports.modify = exports.reset = exports.delete = exports.set = exports.getWith = exports.getAndUpdateSome = exports.getAndUpdate = exports.getAndSet = exports.get = exports.unsafeMakePatch = exports.unsafeMakeSupervisor = exports.unsafeMakeContext = exports.unsafeMakeHashSet = exports.unsafeMake = exports.makeRuntimeFlags = exports.makeContext = exports.makeWith = exports.make = exports.FiberRefTypeId = void 0;
const core = /*#__PURE__*/require("./internal/core.js");
const fiberRuntime = /*#__PURE__*/require("./internal/fiberRuntime.js");
const query = /*#__PURE__*/require("./internal/query.js");
const Scheduler = /*#__PURE__*/require("./Scheduler.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FiberRefTypeId = core.FiberRefTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = fiberRuntime.fiberRefMake;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.makeWith = fiberRuntime.fiberRefMakeWith;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.makeContext = fiberRuntime.fiberRefMakeContext;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.makeRuntimeFlags = fiberRuntime.fiberRefMakeRuntimeFlags;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.unsafeMake = core.fiberRefUnsafeMake;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.unsafeMakeHashSet = core.fiberRefUnsafeMakeHashSet;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.unsafeMakeContext = core.fiberRefUnsafeMakeContext;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.unsafeMakeSupervisor = fiberRuntime.fiberRefUnsafeMakeSupervisor;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.unsafeMakePatch = core.fiberRefUnsafeMakePatch;
/**
 * @since 2.0.0
 * @category getters
 */
exports.get = core.fiberRefGet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndSet = core.fiberRefGetAndSet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdate = core.fiberRefGetAndUpdate;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdateSome = core.fiberRefGetAndUpdateSome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getWith = core.fiberRefGetWith;
/**
 * @since 2.0.0
 * @category utils
 */
exports.set = core.fiberRefSet;
const _delete = core.fiberRefDelete;
exports.delete = _delete;
/**
 * @since 2.0.0
 * @category utils
 */
exports.reset = core.fiberRefReset;
/**
 * @since 2.0.0
 * @category utils
 */
exports.modify = core.fiberRefModify;
/**
 * @since 2.0.0
 * @category utils
 */
exports.modifySome = core.fiberRefModifySome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.update = core.fiberRefUpdate;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSome = core.fiberRefUpdateSome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateAndGet = core.fiberRefUpdateAndGet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSomeAndGet = core.fiberRefUpdateSomeAndGet;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentRequestBatchingEnabled = core.currentRequestBatching;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentRequestCache = query.currentCache;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentRequestCacheEnabled = query.currentCacheEnabled;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentContext = core.currentContext;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentSchedulingPriority = core.currentSchedulingPriority;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentMaxOpsBeforeYield = core.currentMaxOpsBeforeYield;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.unhandledErrorLogLevel = core.currentUnhandledErrorLogLevel;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentLogAnnotations = core.currentLogAnnotations;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentLoggers = fiberRuntime.currentLoggers;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentLogLevel = core.currentLogLevel;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentMinimumLogLevel = fiberRuntime.currentMinimumLogLevel;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentLogSpan = core.currentLogSpan;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentRuntimeFlags = fiberRuntime.currentRuntimeFlags;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentScheduler = Scheduler.currentScheduler;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentSupervisor = fiberRuntime.currentSupervisor;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentMetricLabels = core.currentMetricLabels;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentTracerTimingEnabled = core.currentTracerTimingEnabled;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentTracerSpanAnnotations = core.currentTracerSpanAnnotations;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentTracerSpanLinks = core.currentTracerSpanLinks;
/**
 * @since 2.0.0
 * @category fiberRefs
 */
exports.interruptedCause = core.currentInterruptedCause;
//# sourceMappingURL=FiberRef.js.map