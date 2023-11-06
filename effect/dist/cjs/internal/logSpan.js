"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.make = void 0;
/** @internal */
const make = (label, startTime) => ({
  label,
  startTime
});
exports.make = make;
/** @internal */
const render = now => {
  return self => {
    const label = self.label.replace(/[\s="]/g, "_");
    return `${label}=${now - self.startTime}ms`;
  };
};
exports.render = render;
//# sourceMappingURL=logSpan.js.map