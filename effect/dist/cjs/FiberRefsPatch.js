"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = exports.combine = exports.diff = exports.empty = void 0;
const internal = /*#__PURE__*/require("./internal/fiberRefs/patch.js");
/**
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Constructs a patch that describes the changes between the specified
 * collections of `FiberRef`
 *
 * @since 2.0.0
 * @category constructors
 */
exports.diff = internal.diff;
/**
 * Combines this patch and the specified patch to create a new patch that
 * describes applying the changes from this patch and the specified patch
 * sequentially.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.combine = internal.combine;
/**
 * Applies the changes described by this patch to the specified collection
 * of `FiberRef` values.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.patch = internal.patch;
//# sourceMappingURL=FiberRefsPatch.js.map