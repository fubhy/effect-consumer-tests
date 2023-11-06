"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const List = /*#__PURE__*/require("../List.js");
const core = /*#__PURE__*/require("./core.js");
const _fiberId = /*#__PURE__*/require("./fiberId.js");
const fiberRefs = /*#__PURE__*/require("./fiberRefs.js");
/** @internal */
exports.test = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, input) => self.log({
  fiberId: _fiberId.none,
  logLevel: core.logLevelInfo,
  message: input,
  cause: Cause.empty,
  context: fiberRefs.empty(),
  spans: List.empty(),
  annotations: HashMap.empty(),
  date: new Date()
}));
//# sourceMappingURL=logger-circular.js.map