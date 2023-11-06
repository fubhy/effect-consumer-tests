"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSomeEffect = exports.updateAndGetEffect = exports.updateEffect = exports.modifySomeEffect = exports.modifyEffect = exports.modify = exports.getAndUpdateSomeEffect = exports.getAndUpdateEffect = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Option = /*#__PURE__*/require("../Option.js");
const core = /*#__PURE__*/require("./core.js");
/** @internal */
exports.getAndUpdateEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modifyEffect(value => core.map(f(value), result => [value, result])));
/** @internal */
exports.getAndUpdateSomeEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => self.modifyEffect(value => {
  const result = pf(value);
  switch (result._tag) {
    case "None":
      {
        return core.succeed([value, value]);
      }
    case "Some":
      {
        return core.map(result.value, newValue => [value, newValue]);
      }
  }
}));
/** @internal */
exports.modify = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modify(f));
/** @internal */
exports.modifyEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modifyEffect(f));
/** @internal */
exports.modifySomeEffect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, fallback, pf) => self.modifyEffect(value => (0, Function_js_1.pipe)(pf(value), Option.getOrElse(() => core.succeed([fallback, value])))));
/** @internal */
exports.updateEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modifyEffect(value => core.map(f(value), result => [undefined, result])));
/** @internal */
exports.updateAndGetEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.modifyEffect(value => core.map(f(value), result => [result, result])));
/** @internal */
exports.updateSomeEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => self.modifyEffect(value => {
  const result = pf(value);
  switch (result._tag) {
    case "None":
      {
        return core.succeed([void 0, value]);
      }
    case "Some":
      {
        return core.map(result.value, a => [void 0, a]);
      }
  }
}));
//# sourceMappingURL=synchronizedRef.js.map