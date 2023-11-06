"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minimumLogLevel = exports.logFmt = exports.tracerLogger = exports.stringLogger = exports.logfmtLogger = exports.defaultLogger = exports.zipRight = exports.zipLeft = exports.zip = exports.withMinimumLogLevel = exports.test = exports.sync = exports.succeed = exports.simple = exports.replaceScoped = exports.replaceEffect = exports.replace = exports.remove = exports.none = exports.map = exports.filterLogLevel = exports.mapInput = exports.addScoped = exports.addEffect = exports.add = exports.make = exports.LoggerTypeId = void 0;
const fiberRuntime = /*#__PURE__*/require("./internal/fiberRuntime.js");
const circular = /*#__PURE__*/require("./internal/layer/circular.js");
const internalCircular = /*#__PURE__*/require("./internal/logger-circular.js");
const internal = /*#__PURE__*/require("./internal/logger.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.LoggerTypeId = internal.LoggerTypeId;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.make = internal.makeLogger;
/**
 * @since 2.0.0
 * @category context
 */
exports.add = circular.addLogger;
/**
 * @since 2.0.0
 * @category context
 */
exports.addEffect = circular.addLoggerEffect;
/**
 * @since 2.0.0
 * @category context
 */
exports.addScoped = circular.addLoggerScoped;
/**
 * @since 2.0.0
 * @category mapping
 */
exports.mapInput = internal.mapInput;
/**
 * Returns a version of this logger that only logs messages when the log level
 * satisfies the specified predicate.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterLogLevel = internal.filterLogLevel;
/**
 * @since 2.0.0
 * @category mapping
 */
exports.map = internal.map;
/**
 * A logger that does nothing in response to logging events.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.none = internal.none;
/**
 * @since 2.0.0
 * @category context
 */
exports.remove = circular.removeLogger;
/**
 * @since 2.0.0
 * @category context
 */
exports.replace = circular.replaceLogger;
/**
 * @since 2.0.0
 * @category context
 */
exports.replaceEffect = circular.replaceLoggerEffect;
/**
 * @since 2.0.0
 * @category context
 */
exports.replaceScoped = circular.replaceLoggerScoped;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.simple = internal.simple;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = internal.succeed;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.sync = internal.sync;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.test = internalCircular.test;
/**
 * @since 2.0.0
 * @category context
 */
exports.withMinimumLogLevel = circular.withMinimumLogLevel;
/**
 * Combines this logger with the specified logger to produce a new logger that
 * logs to both this logger and that logger.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zip = internal.zip;
/**
 * @since 2.0.0
 * @category zipping
 */
exports.zipLeft = internal.zipLeft;
/**
 * @since 2.0.0
 * @category zipping
 */
exports.zipRight = internal.zipRight;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.defaultLogger = fiberRuntime.defaultLogger;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.logfmtLogger = internal.logfmtLogger;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.stringLogger = internal.stringLogger;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.tracerLogger = fiberRuntime.tracerLogger;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.logFmt = /*#__PURE__*/(0, exports.replace)(fiberRuntime.defaultLogger, fiberRuntime.logFmtLogger);
/**
 * @since 2.0.0
 * @category context
 */
exports.minimumLogLevel = circular.minimumLogLevel;
//# sourceMappingURL=Logger.js.map