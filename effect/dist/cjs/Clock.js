"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Clock = exports.clockWith = exports.currentTimeNanos = exports.currentTimeMillis = exports.sleep = exports.make = exports.ClockTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/clock.js");
const defaultServices = /*#__PURE__*/require("./internal/defaultServices.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ClockTypeId = internal.ClockTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.sleep = defaultServices.sleep;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.currentTimeMillis = defaultServices.currentTimeMillis;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.currentTimeNanos = defaultServices.currentTimeNanos;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.clockWith = defaultServices.clockWith;
/**
 * @since 2.0.0
 * @category context
 */
exports.Clock = internal.clockTag;
//# sourceMappingURL=Clock.js.map