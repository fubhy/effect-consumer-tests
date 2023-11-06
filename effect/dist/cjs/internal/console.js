"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTime = exports.withGroup = exports.warn = exports.trace = exports.timeLog = exports.time = exports.table = exports.log = exports.info = exports.group = exports.error = exports.dirxml = exports.dir = exports.debug = exports.countReset = exports.count = exports.clear = exports.assert = exports.setConsole = exports.withConsole = exports.consoleWith = exports.console = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const core = /*#__PURE__*/require("./core.js");
const defaultServices = /*#__PURE__*/require("./defaultServices.js");
const defaultConsole = /*#__PURE__*/require("./defaultServices/console.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const layer = /*#__PURE__*/require("./layer.js");
/** @internal */
exports.console = /*#__PURE__*/core.map( /*#__PURE__*/core.fiberRefGet(defaultServices.currentServices), /*#__PURE__*/Context.get(defaultConsole.consoleTag));
/** @internal */
const consoleWith = f => core.fiberRefGetWith(defaultServices.currentServices, services => f(Context.get(services, defaultConsole.consoleTag)));
exports.consoleWith = consoleWith;
/** @internal */
exports.withConsole = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, value) => core.fiberRefLocallyWith(effect, defaultServices.currentServices, Context.add(defaultConsole.consoleTag, value)));
/** @internal */
const setConsole = console => layer.scopedDiscard(fiberRuntime.fiberRefLocallyScopedWith(defaultServices.currentServices, Context.add(defaultConsole.consoleTag, console)));
exports.setConsole = setConsole;
/** @internal */
const assert = (condition, ...args) => (0, exports.consoleWith)(_ => _.assert(condition, ...args));
exports.assert = assert;
/** @internal */
exports.clear = /*#__PURE__*/(0, exports.consoleWith)(_ => _.clear);
/** @internal */
const count = label => (0, exports.consoleWith)(_ => _.count(label));
exports.count = count;
/** @internal */
const countReset = label => (0, exports.consoleWith)(_ => _.countReset(label));
exports.countReset = countReset;
/** @internal */
const debug = (...args) => (0, exports.consoleWith)(_ => _.debug(...args));
exports.debug = debug;
/** @internal */
const dir = (item, options) => (0, exports.consoleWith)(_ => _.dir(item, options));
exports.dir = dir;
/** @internal */
const dirxml = (...args) => (0, exports.consoleWith)(_ => _.dirxml(...args));
exports.dirxml = dirxml;
/** @internal */
const error = (...args) => (0, exports.consoleWith)(_ => _.error(...args));
exports.error = error;
/** @internal */
const group = options => (0, exports.consoleWith)(_ => fiberRuntime.acquireRelease(_.group(options), () => _.groupEnd));
exports.group = group;
/** @internal */
const info = (...args) => (0, exports.consoleWith)(_ => _.info(...args));
exports.info = info;
/** @internal */
const log = (...args) => (0, exports.consoleWith)(_ => _.log(...args));
exports.log = log;
/** @internal */
const table = (tabularData, properties) => (0, exports.consoleWith)(_ => _.table(tabularData, properties));
exports.table = table;
/** @internal */
const time = label => (0, exports.consoleWith)(_ => fiberRuntime.acquireRelease(_.time(label), () => _.timeEnd(label)));
exports.time = time;
/** @internal */
const timeLog = (label, ...args) => (0, exports.consoleWith)(_ => _.timeLog(label, ...args));
exports.timeLog = timeLog;
/** @internal */
const trace = (...args) => (0, exports.consoleWith)(_ => _.trace(...args));
exports.trace = trace;
/** @internal */
const warn = (...args) => (0, exports.consoleWith)(_ => _.warn(...args));
exports.warn = warn;
/** @internal */
exports.withGroup = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), (self, options) => (0, exports.consoleWith)(_ => core.acquireUseRelease(_.group(options), () => self, () => _.groupEnd)));
/** @internal */
exports.withTime = /*#__PURE__*/(0, Function_js_1.dual)(args => core.isEffect(args[0]), (self, label) => (0, exports.consoleWith)(_ => core.acquireUseRelease(_.time(label), () => self, () => _.timeEnd(label))));
//# sourceMappingURL=console.js.map