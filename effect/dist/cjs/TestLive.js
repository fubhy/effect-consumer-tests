"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = exports.TestLive = exports.TestLiveTypeId = void 0;
/**
 * @since 2.0.0
 */
const Context = /*#__PURE__*/require("./Context.js");
const core = /*#__PURE__*/require("./internal/core.js");
const defaultServices = /*#__PURE__*/require("./internal/defaultServices.js");
/**
 * @since 2.0.0
 */
exports.TestLiveTypeId = /*#__PURE__*/Symbol.for("effect/TestLive");
/**
 * @since 2.0.0
 */
exports.TestLive = /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/TestLive"));
/** @internal */
class LiveImpl {
  services;
  [exports.TestLiveTypeId] = exports.TestLiveTypeId;
  constructor(services) {
    this.services = services;
  }
  provide(effect) {
    return core.fiberRefLocallyWith(defaultServices.currentServices, Context.merge(this.services))(effect);
  }
}
/**
 * @since 2.0.0
 */
const make = services => new LiveImpl(services);
exports.make = make;
//# sourceMappingURL=TestLive.js.map