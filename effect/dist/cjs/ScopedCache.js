"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeWith = exports.make = exports.ScopedCacheTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/scopedCache.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ScopedCacheTypeId = internal.ScopedCacheTypeId;
/**
 * Constructs a new cache with the specified capacity, time to live, and
 * lookup function.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Constructs a new cache with the specified capacity, time to live, and
 * lookup function, where the time to live can depend on the `Exit` value
 * returned by the lookup function.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeWith = internal.makeWith;
//# sourceMappingURL=ScopedCache.js.map