"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Class = void 0;
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const Stream = /*#__PURE__*/require("./Stream.js");
const streamVariance = {
  _R: _ => _,
  _E: _ => _,
  _A: _ => _
};
/**
 * @since 2.0.0
 * @category constructors
 */
class Class {
  /**
   * @since 2.0.0
   */
  [Stream.StreamTypeId] = streamVariance;
  /**
   * @since 2.0.0
   */
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  /**
   * @internal
   */
  get channel() {
    return Stream.toChannel(this.toStream());
  }
}
exports.Class = Class;
//# sourceMappingURL=Streamable.js.map