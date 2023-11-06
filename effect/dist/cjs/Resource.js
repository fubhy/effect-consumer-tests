"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refresh = exports.manual = exports.get = exports.auto = exports.ResourceTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/resource.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ResourceTypeId = internal.ResourceTypeId;
/**
 * Creates a new `Resource` value that is automatically refreshed according to
 * the specified policy. Note that error retrying is not performed
 * automatically, so if you want to retry on errors, you should first apply
 * retry policies to the acquisition effect before passing it to this
 * constructor.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.auto = internal.auto;
/**
 * Retrieves the current value stored in the cache.
 *
 * @since 2.0.0
 * @category getters
 */
exports.get = internal.get;
/**
 * Creates a new `Resource` value that must be manually refreshed by calling
 * the refresh method. Note that error retrying is not performed
 * automatically, so if you want to retry on errors, you should first apply
 * retry policies to the acquisition effect before passing it to this
 * constructor.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.manual = internal.manual;
/**
 * Refreshes the cache. This method will not return until either the refresh
 * is successful, or the refresh operation fails.
 *
 * @since 2.0.0
 * @category utils
 */
exports.refresh = internal.refresh;
//# sourceMappingURL=Resource.js.map