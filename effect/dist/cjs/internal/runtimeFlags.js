"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.differ = exports.renderPatch = exports.patch = exports.diff = exports.disabledSet = exports.enabledSet = exports.windDown = exports.toSet = exports.runtimeMetrics = exports.render = exports.opSupervision = exports.none = exports.make = exports.isEnabled = exports.isDisabled = exports.interruption = exports.interruptible = exports.enableAll = exports.enable = exports.disableAll = exports.disable = exports.cooperativeYielding = exports.allFlags = exports.CooperativeYielding = exports.WindDown = exports.RuntimeMetrics = exports.OpSupervision = exports.Interruption = exports.None = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const internalDiffer = /*#__PURE__*/require("./differ.js");
const runtimeFlagsPatch = /*#__PURE__*/require("./runtimeFlagsPatch.js");
/** @internal */
exports.None = 0;
/** @internal */
exports.Interruption = 1 << 0;
/** @internal */
exports.OpSupervision = 1 << 1;
/** @internal */
exports.RuntimeMetrics = 1 << 2;
/** @internal */
exports.WindDown = 1 << 4;
/** @internal */
exports.CooperativeYielding = 1 << 5;
/** @internal */
exports.allFlags = [exports.None, exports.Interruption, exports.OpSupervision, exports.RuntimeMetrics, exports.WindDown, exports.CooperativeYielding];
const print = flag => {
  switch (flag) {
    case exports.CooperativeYielding:
      {
        return "CooperativeYielding";
      }
    case exports.WindDown:
      {
        return "WindDown";
      }
    case exports.RuntimeMetrics:
      {
        return "RuntimeMetrics";
      }
    case exports.OpSupervision:
      {
        return "OpSupervision";
      }
    case exports.Interruption:
      {
        return "Interruption";
      }
    case exports.None:
      {
        return "None";
      }
  }
};
/** @internal */
const cooperativeYielding = self => (0, exports.isEnabled)(self, exports.CooperativeYielding);
exports.cooperativeYielding = cooperativeYielding;
/** @internal */
exports.disable = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flag) => self & ~flag);
/** @internal */
exports.disableAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flags) => self & ~flags);
/** @internal */
exports.enable = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flag) => self | flag);
/** @internal */
exports.enableAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flags) => self | flags);
/** @internal */
const interruptible = self => (0, exports.interruption)(self) && !(0, exports.windDown)(self);
exports.interruptible = interruptible;
/** @internal */
const interruption = self => (0, exports.isEnabled)(self, exports.Interruption);
exports.interruption = interruption;
/** @internal */
exports.isDisabled = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flag) => !(0, exports.isEnabled)(self, flag));
/** @internal */
exports.isEnabled = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, flag) => (self & flag) !== 0);
/** @internal */
const make = (...flags) => flags.reduce((a, b) => a | b, 0);
exports.make = make;
/** @internal */
exports.none = /*#__PURE__*/(0, exports.make)(exports.None);
/** @internal */
const opSupervision = self => (0, exports.isEnabled)(self, exports.OpSupervision);
exports.opSupervision = opSupervision;
/** @internal */
const render = self => {
  const active = [];
  exports.allFlags.forEach(flag => {
    if ((0, exports.isEnabled)(self, flag)) {
      active.push(`${print(flag)}`);
    }
  });
  return `RuntimeFlags(${active.join(", ")})`;
};
exports.render = render;
/** @internal */
const runtimeMetrics = self => (0, exports.isEnabled)(self, exports.RuntimeMetrics);
exports.runtimeMetrics = runtimeMetrics;
/** @internal */
const toSet = self => new Set(exports.allFlags.filter(flag => (0, exports.isEnabled)(self, flag)));
exports.toSet = toSet;
const windDown = self => (0, exports.isEnabled)(self, exports.WindDown);
exports.windDown = windDown;
// circular with RuntimeFlagsPatch
/** @internal */
const enabledSet = self => (0, exports.toSet)(runtimeFlagsPatch.active(self) & runtimeFlagsPatch.enabled(self));
exports.enabledSet = enabledSet;
/** @internal */
const disabledSet = self => (0, exports.toSet)(runtimeFlagsPatch.active(self) & ~runtimeFlagsPatch.enabled(self));
exports.disabledSet = disabledSet;
/** @internal */
exports.diff = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => runtimeFlagsPatch.make(self ^ that, that));
/** @internal */
exports.patch = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, patch) => self & (runtimeFlagsPatch.invert(runtimeFlagsPatch.active(patch)) | runtimeFlagsPatch.enabled(patch)) | runtimeFlagsPatch.active(patch) & runtimeFlagsPatch.enabled(patch));
/** @internal */
const renderPatch = self => {
  const enabled = Array.from((0, exports.enabledSet)(self)).map(flag => print(flag)).join(", ");
  const disabled = Array.from((0, exports.disabledSet)(self)).map(flag => print(flag)).join(", ");
  return `RuntimeFlagsPatch(enabled = (${enabled}), disabled = (${disabled}))`;
};
exports.renderPatch = renderPatch;
/** @internal */
exports.differ = /*#__PURE__*/internalDiffer.make({
  empty: runtimeFlagsPatch.empty,
  diff: (oldValue, newValue) => (0, exports.diff)(oldValue, newValue),
  combine: (first, second) => runtimeFlagsPatch.andThen(second)(first),
  patch: (_patch, oldValue) => (0, exports.patch)(oldValue, _patch)
});
//# sourceMappingURL=runtimeFlags.js.map