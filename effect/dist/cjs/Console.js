"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTime = exports.withGroup = exports.warn = exports.trace = exports.timeLog = exports.time = exports.table = exports.log = exports.info = exports.group = exports.error = exports.dirxml = exports.dir = exports.debug = exports.countReset = exports.count = exports.clear = exports.assert = exports.consoleWith = exports.setConsole = exports.withConsole = exports.TypeId = void 0;
const internal = /*#__PURE__*/require("./internal/console.js");
const defaultConsole = /*#__PURE__*/require("./internal/defaultServices/console.js");
/**
 * @since 2.0.0
 * @category type ids
 */
exports.TypeId = defaultConsole.TypeId;
/**
 * @since 2.0.0
 * @category default services
 */
exports.withConsole = internal.withConsole;
/**
 * @since 2.0.0
 * @category default services
 */
exports.setConsole = internal.setConsole;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.consoleWith = internal.consoleWith;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.assert = internal.assert;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.clear = internal.clear;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.count = internal.count;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.countReset = internal.countReset;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.debug = internal.debug;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.dir = internal.dir;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.dirxml = internal.dirxml;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.error = internal.error;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.group = internal.group;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.info = internal.info;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.log = internal.log;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.table = internal.table;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.time = internal.time;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.timeLog = internal.timeLog;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.trace = internal.trace;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.warn = internal.warn;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.withGroup = internal.withGroup;
/**
 * @since 2.0.0
 * @category accessor
 */
exports.withTime = internal.withTime;
//# sourceMappingURL=Console.js.map