"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestContext = exports.LiveContext = exports.live = void 0;
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const defaultServices = /*#__PURE__*/require("./internal/defaultServices.js");
const layer = /*#__PURE__*/require("./internal/layer.js");
const TestClock = /*#__PURE__*/require("./TestClock.js");
const TestServices = /*#__PURE__*/require("./TestServices.js");
/** @internal */
exports.live = /*#__PURE__*/(0, Function_js_1.pipe)( /*#__PURE__*/TestServices.annotationsLayer(), /*#__PURE__*/layer.merge( /*#__PURE__*/TestServices.liveLayer()), /*#__PURE__*/layer.merge( /*#__PURE__*/TestServices.sizedLayer(100)), /*#__PURE__*/layer.merge( /*#__PURE__*/(0, Function_js_1.pipe)( /*#__PURE__*/TestServices.liveLayer(), /*#__PURE__*/layer.merge( /*#__PURE__*/TestServices.annotationsLayer()), /*#__PURE__*/layer.provideMerge(TestClock.defaultTestClock))), /*#__PURE__*/layer.merge( /*#__PURE__*/TestServices.testConfigLayer({
  repeats: 100,
  retries: 100,
  samples: 200,
  shrinks: 1000
})));
/**
 * @since 2.0.0
 */
exports.LiveContext = /*#__PURE__*/layer.syncContext(() => defaultServices.liveServices);
/**
 * @since 2.0.0
 */
exports.TestContext = /*#__PURE__*/layer.provideMerge(exports.LiveContext, exports.live);
//# sourceMappingURL=TestContext.js.map