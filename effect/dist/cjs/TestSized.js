"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromFiberRef = exports.make = exports.TestSized = exports.TestSizedTypeId = void 0;
/**
 * @since 2.0.0
 */
const Context = /*#__PURE__*/require("./Context.js");
const core = /*#__PURE__*/require("./internal/core.js");
/**
 * @since 2.0.0
 */
exports.TestSizedTypeId = /*#__PURE__*/Symbol.for("effect/TestSized");
/**
 * @since 2.0.0
 */
exports.TestSized = /*#__PURE__*/Context.Tag(exports.TestSizedTypeId);
/** @internal */
class SizedImpl {
  fiberRef;
  [exports.TestSizedTypeId] = exports.TestSizedTypeId;
  constructor(fiberRef) {
    this.fiberRef = fiberRef;
  }
  size() {
    return core.fiberRefGet(this.fiberRef);
  }
  withSize(size) {
    return effect => core.fiberRefLocally(this.fiberRef, size)(effect);
  }
}
/**
 * @since 2.0.0
 */
const make = size => new SizedImpl(core.fiberRefUnsafeMake(size));
exports.make = make;
/**
 * @since 2.0.0
 */
const fromFiberRef = fiberRef => new SizedImpl(fiberRef);
exports.fromFiberRef = fromFiberRef;
//# sourceMappingURL=TestSized.js.map