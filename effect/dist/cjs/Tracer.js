"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tracerWith = exports.externalSpan = exports.make = exports.Tracer = exports.ParentSpan = exports.TracerTypeId = void 0;
const defaultServices = /*#__PURE__*/require("./internal/defaultServices.js");
const internal = /*#__PURE__*/require("./internal/tracer.js");
/**
 * @since 2.0.0
 */
exports.TracerTypeId = internal.TracerTypeId;
/**
 * @since 2.0.0
 * @category tags
 */
exports.ParentSpan = internal.spanTag;
/**
 * @since 2.0.0
 * @category tags
 */
exports.Tracer = internal.tracerTag;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.externalSpan = internal.externalSpan;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.tracerWith = defaultServices.tracerWith;
//# sourceMappingURL=Tracer.js.map