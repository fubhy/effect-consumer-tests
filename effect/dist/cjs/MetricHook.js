"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onUpdate = exports.summary = exports.histogram = exports.gauge = exports.frequency = exports.counter = exports.make = exports.MetricHookTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/metric/hook.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.MetricHookTypeId = internal.MetricHookTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.counter = internal.counter;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.frequency = internal.frequency;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.gauge = internal.gauge;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.histogram = internal.histogram;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.summary = internal.summary;
/**
 * @since 2.0.0
 * @category utils
 */
exports.onUpdate = internal.onUpdate;
//# sourceMappingURL=MetricHook.js.map