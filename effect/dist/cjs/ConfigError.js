"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduceWithContext = exports.prefixed = exports.isUnsupported = exports.isSourceUnavailable = exports.isMissingDataOnly = exports.isMissingData = exports.isInvalidData = exports.isOr = exports.isAnd = exports.isConfigError = exports.Unsupported = exports.SourceUnavailable = exports.InvalidData = exports.MissingData = exports.Or = exports.And = exports.ConfigErrorTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/configError.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ConfigErrorTypeId = internal.ConfigErrorTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.And = internal.And;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Or = internal.Or;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.MissingData = internal.MissingData;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.InvalidData = internal.InvalidData;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.SourceUnavailable = internal.SourceUnavailable;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Unsupported = internal.Unsupported;
/**
 * Returns `true` if the specified value is a `ConfigError`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isConfigError = internal.isConfigError;
/**
 * Returns `true` if the specified `ConfigError` is an `And`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isAnd = internal.isAnd;
/**
 * Returns `true` if the specified `ConfigError` is an `Or`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isOr = internal.isOr;
/**
 * Returns `true` if the specified `ConfigError` is an `InvalidData`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isInvalidData = internal.isInvalidData;
/**
 * Returns `true` if the specified `ConfigError` is an `MissingData`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isMissingData = internal.isMissingData;
/**
 * Returns `true` if the specified `ConfigError` contains only `MissingData` errors, `false` otherwise.
 *
 * @since 2.0.0
 * @categer getters
 */
exports.isMissingDataOnly = internal.isMissingDataOnly;
/**
 * Returns `true` if the specified `ConfigError` is a `SourceUnavailable`,
 * `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isSourceUnavailable = internal.isSourceUnavailable;
/**
 * Returns `true` if the specified `ConfigError` is an `Unsupported`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isUnsupported = internal.isUnsupported;
/**
 * @since 2.0.0
 * @category utils
 */
exports.prefixed = internal.prefixed;
/**
 * @since 2.0.0
 * @category folding
 */
exports.reduceWithContext = internal.reduceWithContext;
//# sourceMappingURL=ConfigError.js.map