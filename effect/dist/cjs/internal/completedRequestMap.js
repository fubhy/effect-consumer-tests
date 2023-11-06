"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentRequestMap = void 0;
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const core_js_1 = /*#__PURE__*/require("./core.js");
/** @internal */
exports.currentRequestMap = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentRequestMap"), () => (0, core_js_1.fiberRefUnsafeMake)(new Map()));
//# sourceMappingURL=completedRequestMap.js.map