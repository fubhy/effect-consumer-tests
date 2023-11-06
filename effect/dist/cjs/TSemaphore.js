"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeMake = exports.withPermitsScoped = exports.withPermitScoped = exports.withPermits = exports.withPermit = exports.releaseN = exports.release = exports.make = exports.available = exports.acquireN = exports.acquire = exports.TSemaphoreTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/stm/tSemaphore.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TSemaphoreTypeId = internal.TSemaphoreTypeId;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.acquire = internal.acquire;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.acquireN = internal.acquireN;
/**
 * @since 2.0.0
 * @category getters
 */
exports.available = internal.available;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.release = internal.release;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.releaseN = internal.releaseN;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.withPermit = internal.withPermit;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.withPermits = internal.withPermits;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.withPermitScoped = internal.withPermitScoped;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.withPermitsScoped = internal.withPermitsScoped;
/**
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeMake = internal.unsafeMakeSemaphore;
//# sourceMappingURL=TSemaphore.js.map