"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reloadFork = exports.tag = exports.reload = exports.manual = exports.get = exports.autoFromConfig = exports.auto = exports.ReloadableTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/reloadable.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ReloadableTypeId = internal.ReloadableTypeId;
/**
 * Makes a new reloadable service from a layer that describes the construction
 * of a static service. The service is automatically reloaded according to the
 * provided schedule.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.auto = internal.auto;
/**
 * Makes a new reloadable service from a layer that describes the construction
 * of a static service. The service is automatically reloaded according to a
 * schedule, which is extracted from the input to the layer.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.autoFromConfig = internal.autoFromConfig;
/**
 * Retrieves the current version of the reloadable service.
 *
 * @since 2.0.0
 * @category getters
 */
exports.get = internal.get;
/**
 * Makes a new reloadable service from a layer that describes the construction
 * of a static service.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.manual = internal.manual;
/**
 * Reloads the specified service.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.reload = internal.reload;
/**
 * @since 2.0.0
 * @category context
 */
exports.tag = internal.reloadableTag;
/**
 * Forks the reload of the service in the background, ignoring any errors.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.reloadFork = internal.reloadFork;
//# sourceMappingURL=Reloadable.js.map