"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invert = exports.inverse = exports.andThen = exports.either = exports.both = exports.exclude = exports.isDisabled = exports.isEnabled = exports.isActive = exports.isEmpty = exports.disable = exports.enable = exports.empty = exports.make = exports.enabled = exports.active = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
/** @internal */
const BIT_MASK = 0xff;
/** @internal */
const BIT_SHIFT = 0x08;
/** @internal */
const active = patch => patch & BIT_MASK;
exports.active = active;
/** @internal */
const enabled = patch => patch >> BIT_SHIFT & BIT_MASK;
exports.enabled = enabled;
/** @internal */
const make = (active, enabled) => (active & BIT_MASK) + ((enabled & active & BIT_MASK) << BIT_SHIFT);
exports.make = make;
/** @internal */
exports.empty = /*#__PURE__*/(0, exports.make)(0, 0);
/** @internal */
const enable = flag => (0, exports.make)(flag, flag);
exports.enable = enable;
/** @internal */
const disable = flag => (0, exports.make)(flag, 0);
exports.disable = disable;
/** @internal */
const isEmpty = patch => patch === 0;
exports.isEmpty = isEmpty;
/** @internal */
exports.isActive = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flag) => ((0, exports.active)(self) & flag) !== 0);
/** @internal */
exports.isEnabled = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flag) => ((0, exports.enabled)(self) & flag) !== 0);
/** @internal */
exports.isDisabled = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flag) => ((0, exports.active)(self) & flag) !== 0 && ((0, exports.enabled)(self) & flag) === 0);
/** @internal */
exports.exclude = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flag) => (0, exports.make)((0, exports.active)(self) & ~flag, (0, exports.enabled)(self)));
/** @internal */
exports.both = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.make)((0, exports.active)(self) | (0, exports.active)(that), (0, exports.enabled)(self) & (0, exports.enabled)(that)));
/** @internal */
exports.either = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.make)((0, exports.active)(self) | (0, exports.active)(that), (0, exports.enabled)(self) | (0, exports.enabled)(that)));
/** @internal */
exports.andThen = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self | that);
/** @internal */
const inverse = patch => (0, exports.make)((0, exports.enabled)(patch), (0, exports.invert)((0, exports.active)(patch)));
exports.inverse = inverse;
/** @internal */
const invert = n => ~n >>> 0 & BIT_MASK;
exports.invert = invert;
//# sourceMappingURL=runtimeFlagsPatch.js.map