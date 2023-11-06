"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.disabledSet = exports.enabledSet = exports.inverse = exports.exclude = exports.either = exports.both = exports.andThen = exports.includes = exports.isDisabled = exports.isEnabled = exports.isActive = exports.isEmpty = exports.disable = exports.enable = exports.make = exports.empty = void 0;
/**
 * @since 2.0.0
 */
const runtimeFlags = /*#__PURE__*/require("./internal/runtimeFlags.js");
const internal = /*#__PURE__*/require("./internal/runtimeFlagsPatch.js");
/**
 * The empty `RuntimeFlagsPatch`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Creates a `RuntimeFlagsPatch` describing enabling the provided `RuntimeFlag`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.enable = internal.enable;
/**
 * Creates a `RuntimeFlagsPatch` describing disabling the provided `RuntimeFlag`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.disable = internal.disable;
/**
 * Returns `true` if the specified `RuntimeFlagsPatch` is empty.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isEmpty = internal.isEmpty;
/**
 * Returns `true` if the `RuntimeFlagsPatch` describes the specified
 * `RuntimeFlag` as active.
 *
 * @since 2.0.0
 * @category elements
 */
exports.isActive = internal.isActive;
/**
 * Returns `true` if the `RuntimeFlagsPatch` describes the specified
 * `RuntimeFlag` as enabled.
 *
 * @since 2.0.0
 * @category elements
 */
exports.isEnabled = internal.isEnabled;
/**
 * Returns `true` if the `RuntimeFlagsPatch` describes the specified
 * `RuntimeFlag` as disabled.
 *
 * @since 2.0.0
 * @category elements
 */
exports.isDisabled = internal.isDisabled;
/**
 * Returns `true` if the `RuntimeFlagsPatch` includes the specified
 * `RuntimeFlag`, `false` otherwise.
 *
 * @since 2.0.0
 * @category elements
 */
exports.includes = internal.isActive;
/**
 * Creates a `RuntimeFlagsPatch` describing the application of the `self` patch,
 * followed by `that` patch.
 *
 * @since 2.0.0
 * @category utils
 */
exports.andThen = internal.andThen;
/**
 * Creates a `RuntimeFlagsPatch` describing application of both the `self` patch
 * and `that` patch.
 *
 * @since 2.0.0
 * @category utils
 */
exports.both = internal.both;
/**
 * Creates a `RuntimeFlagsPatch` describing application of either the `self`
 * patch or `that` patch.
 *
 * @since 2.0.0
 * @category utils
 */
exports.either = internal.either;
/**
 * Creates a `RuntimeFlagsPatch` which describes exclusion of the specified
 * `RuntimeFlag` from the set of `RuntimeFlags`.
 *
 * @category utils
 * @since 2.0.0
 */
exports.exclude = internal.exclude;
/**
 * Creates a `RuntimeFlagsPatch` which describes the inverse of the patch
 * specified by the provided `RuntimeFlagsPatch`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.inverse = internal.inverse;
/**
 * Returns a `ReadonlySet<number>` containing the `RuntimeFlags` described as
 * enabled by the specified `RuntimeFlagsPatch`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.enabledSet = runtimeFlags.enabledSet;
/**
 * Returns a `ReadonlySet<number>` containing the `RuntimeFlags` described as
 * disabled by the specified `RuntimeFlagsPatch`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.disabledSet = runtimeFlags.disabledSet;
/**
 * Renders the provided `RuntimeFlagsPatch` to a string.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.render = runtimeFlags.renderPatch;
//# sourceMappingURL=RuntimeFlagsPatch.js.map