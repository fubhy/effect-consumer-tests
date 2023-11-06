"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromLiteral = exports.greaterThanEqual = exports.greaterThan = exports.lessThanEqual = exports.lessThan = exports.Order = exports.locally = exports.allLevels = exports.None = exports.Trace = exports.Debug = exports.Info = exports.Warning = exports.Error = exports.Fatal = exports.All = void 0;
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const core = /*#__PURE__*/require("./internal/core.js");
const number = /*#__PURE__*/require("./Number.js");
const order = /*#__PURE__*/require("./Order.js");
/**
 * @since 2.0.0
 * @category constructors
 */
exports.All = core.logLevelAll;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Fatal = core.logLevelFatal;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Error = core.logLevelError;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Warning = core.logLevelWarning;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Info = core.logLevelInfo;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Debug = core.logLevelDebug;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Trace = core.logLevelTrace;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.None = core.logLevelNone;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.allLevels = core.allLogLevels;
/**
 * Locally applies the specified `LogLevel` to an `Effect` workflow, reverting
 * to the previous `LogLevel` after the `Effect` workflow completes.
 *
 * @since 2.0.0
 * @category utils
 */
exports.locally = /*#__PURE__*/(0, Function_js_1.dual)(2, (use, self) => core.fiberRefLocally(use, core.currentLogLevel, self));
/**
 * @since 2.0.0
 * @category instances
 */
exports.Order = /*#__PURE__*/(0, Function_js_1.pipe)(number.Order, /*#__PURE__*/order.mapInput(level => level.ordinal));
/**
 * @since 2.0.0
 * @category ordering
 */
exports.lessThan = /*#__PURE__*/order.lessThan(exports.Order);
/**
 * @since 2.0.0
 * @category ordering
 */
exports.lessThanEqual = /*#__PURE__*/order.lessThanOrEqualTo(exports.Order);
/**
 * @since 2.0.0
 * @category ordering
 */
exports.greaterThan = /*#__PURE__*/order.greaterThan(exports.Order);
/**
 * @since 2.0.0
 * @category ordering
 */
exports.greaterThanEqual = /*#__PURE__*/order.greaterThanOrEqualTo(exports.Order);
/**
 * @since 2.0.0
 * @category conversions
 */
const fromLiteral = _ => {
  switch (_) {
    case "All":
      {
        return exports.All;
      }
    case "Debug":
      {
        return exports.Debug;
      }
    case "Error":
      {
        return exports.Error;
      }
    case "Fatal":
      {
        return exports.Fatal;
      }
    case "Info":
      {
        return exports.Info;
      }
    case "Trace":
      {
        return exports.Trace;
      }
    case "None":
      {
        return exports.None;
      }
    case "Warning":
      {
        return exports.Warning;
      }
  }
};
exports.fromLiteral = fromLiteral;
//# sourceMappingURL=LogLevel.js.map