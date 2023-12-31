import * as fiberRuntime from "./internal/fiberRuntime.js";
import * as circular from "./internal/layer/circular.js";
import * as internalCircular from "./internal/logger-circular.js";
import * as internal from "./internal/logger.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export const LoggerTypeId = internal.LoggerTypeId;
/**
 * @category constructors
 * @since 2.0.0
 */
export const make = internal.makeLogger;
/**
 * @since 2.0.0
 * @category context
 */
export const add = circular.addLogger;
/**
 * @since 2.0.0
 * @category context
 */
export const addEffect = circular.addLoggerEffect;
/**
 * @since 2.0.0
 * @category context
 */
export const addScoped = circular.addLoggerScoped;
/**
 * @since 2.0.0
 * @category mapping
 */
export const mapInput = internal.mapInput;
/**
 * Returns a version of this logger that only logs messages when the log level
 * satisfies the specified predicate.
 *
 * @since 2.0.0
 * @category filtering
 */
export const filterLogLevel = internal.filterLogLevel;
/**
 * @since 2.0.0
 * @category mapping
 */
export const map = internal.map;
/**
 * A logger that does nothing in response to logging events.
 *
 * @since 2.0.0
 * @category constructors
 */
export const none = internal.none;
/**
 * @since 2.0.0
 * @category context
 */
export const remove = circular.removeLogger;
/**
 * @since 2.0.0
 * @category context
 */
export const replace = circular.replaceLogger;
/**
 * @since 2.0.0
 * @category context
 */
export const replaceEffect = circular.replaceLoggerEffect;
/**
 * @since 2.0.0
 * @category context
 */
export const replaceScoped = circular.replaceLoggerScoped;
/**
 * @since 2.0.0
 * @category constructors
 */
export const simple = internal.simple;
/**
 * @since 2.0.0
 * @category constructors
 */
export const succeed = internal.succeed;
/**
 * @since 2.0.0
 * @category constructors
 */
export const sync = internal.sync;
/**
 * @since 2.0.0
 * @category constructors
 */
export const test = internalCircular.test;
/**
 * @since 2.0.0
 * @category context
 */
export const withMinimumLogLevel = circular.withMinimumLogLevel;
/**
 * Combines this logger with the specified logger to produce a new logger that
 * logs to both this logger and that logger.
 *
 * @since 2.0.0
 * @category zipping
 */
export const zip = internal.zip;
/**
 * @since 2.0.0
 * @category zipping
 */
export const zipLeft = internal.zipLeft;
/**
 * @since 2.0.0
 * @category zipping
 */
export const zipRight = internal.zipRight;
/**
 * @since 2.0.0
 * @category constructors
 */
export const defaultLogger = fiberRuntime.defaultLogger;
/**
 * @since 2.0.0
 * @category constructors
 */
export const logfmtLogger = internal.logfmtLogger;
/**
 * @since 2.0.0
 * @category constructors
 */
export const stringLogger = internal.stringLogger;
/**
 * @since 2.0.0
 * @category constructors
 */
export const tracerLogger = fiberRuntime.tracerLogger;
/**
 * @since 2.0.0
 * @category constructors
 */
export const logFmt = /*#__PURE__*/replace(fiberRuntime.defaultLogger, fiberRuntime.logFmtLogger);
/**
 * @since 2.0.0
 * @category context
 */
export const minimumLogLevel = circular.minimumLogLevel;
//# sourceMappingURL=Logger.js.map