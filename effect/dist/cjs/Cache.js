"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeEntryStats = exports.makeCacheStats = exports.makeWith = exports.make = exports.CacheTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/cache.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.CacheTypeId = internal.CacheTypeId;
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
/**
 * Constructs a new `CacheStats` from the specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeCacheStats = internal.makeCacheStats;
/**
 * Constructs a new `EntryStats` from the specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeEntryStats = internal.makeEntryStats;
//# sourceMappingURL=Cache.js.map