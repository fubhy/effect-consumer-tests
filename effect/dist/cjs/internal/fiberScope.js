"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalScope = exports.unsafeMake = exports.FiberScopeTypeId = void 0;
const FiberId = /*#__PURE__*/require("../FiberId.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const FiberMessage = /*#__PURE__*/require("./fiberMessage.js");
/** @internal */
const FiberScopeSymbolKey = "effect/FiberScope";
/** @internal */
exports.FiberScopeTypeId = /*#__PURE__*/Symbol.for(FiberScopeSymbolKey);
/** @internal */
class Global {
  [exports.FiberScopeTypeId] = exports.FiberScopeTypeId;
  fiberId = FiberId.none;
  roots = new Set();
  add(_runtimeFlags, child) {
    this.roots.add(child);
    child.addObserver(() => {
      this.roots.delete(child);
    });
  }
}
/** @internal */
class Local {
  fiberId;
  parent;
  [exports.FiberScopeTypeId] = exports.FiberScopeTypeId;
  constructor(fiberId, parent) {
    this.fiberId = fiberId;
    this.parent = parent;
  }
  add(_runtimeFlags, child) {
    this.parent.tell(FiberMessage.stateful(parentFiber => {
      parentFiber.addChild(child);
      child.addObserver(() => {
        parentFiber.removeChild(child);
      });
    }));
  }
}
/** @internal */
const unsafeMake = fiber => {
  return new Local(fiber.id(), fiber);
};
exports.unsafeMake = unsafeMake;
/** @internal */
exports.globalScope = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberScope/Global"), () => new Global());
//# sourceMappingURL=fiberScope.js.map