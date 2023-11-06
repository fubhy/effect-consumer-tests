"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.within = exports.upperCase = exports.snakeCase = exports.unnested = exports.orElse = exports.nested = exports.lowerCase = exports.kebabCase = exports.mapInputPath = exports.constantCase = exports.fromMap = exports.fromFlat = exports.fromEnv = exports.makeFlat = exports.make = exports.ConfigProvider = exports.FlatConfigProviderTypeId = exports.ConfigProviderTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/configProvider.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ConfigProviderTypeId = internal.ConfigProviderTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.FlatConfigProviderTypeId = internal.FlatConfigProviderTypeId;
/**
 * The service tag for `ConfigProvider`.
 *
 * @since 2.0.0
 * @category context
 */
exports.ConfigProvider = internal.configProviderTag;
/**
 * Creates a new config provider.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Creates a new flat config provider.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeFlat = internal.makeFlat;
/**
 * A config provider that loads configuration from context variables,
 * using the default System service.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEnv = internal.fromEnv;
/**
 * Constructs a new `ConfigProvider` from a key/value (flat) provider, where
 * nesting is embedded into the string keys.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromFlat = internal.fromFlat;
/**
 * Constructs a ConfigProvider using a map and the specified delimiter string,
 * which determines how to split the keys in the map into path segments.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromMap = internal.fromMap;
/**
 * Returns a new config provider that will automatically convert all property
 * names to constant case. This can be utilized to adapt the names of
 * configuration properties from the default naming convention of camel case
 * to the naming convention of a config provider.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.constantCase = internal.constantCase;
/**
 * Returns a new config provider that will automatically tranform all path
 * configuration names with the specified function. This can be utilized to
 * adapt the names of configuration properties from one naming convention to
 * another.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapInputPath = internal.mapInputPath;
/**
 * Returns a new config provider that will automatically convert all property
 * names to kebab case. This can be utilized to adapt the names of
 * configuration properties from the default naming convention of camel case
 * to the naming convention of a config provider.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.kebabCase = internal.kebabCase;
/**
 * Returns a new config provider that will automatically convert all property
 * names to lower case. This can be utilized to adapt the names of
 * configuration properties from the default naming convention of camel case
 * to the naming convention of a config provider.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.lowerCase = internal.lowerCase;
/**
 * Returns a new config provider that will automatically nest all
 * configuration under the specified property name. This can be utilized to
 * aggregate separate configuration sources that are all required to load a
 * single configuration value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.nested = internal.nested;
/**
 * Returns a new config provider that preferentially loads configuration data
 * from this one, but which will fall back to the specified alternate provider
 * if there are any issues loading the configuration from this provider.
 *
 * @since 2.0.0
 * @category utils
 */
exports.orElse = internal.orElse;
/**
 * Returns a new config provider that will automatically un-nest all
 * configuration under the specified property name. This can be utilized to
 * de-aggregate separate configuration sources that are all required to load a
 * single configuration value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.unnested = internal.unnested;
/**
 * Returns a new config provider that will automatically convert all property
 * names to upper case. This can be utilized to adapt the names of
 * configuration properties from the default naming convention of camel case
 * to the naming convention of a config provider.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.snakeCase = internal.snakeCase;
/**
 * Returns a new config provider that will automatically convert all property
 * names to upper case. This can be utilized to adapt the names of
 * configuration properties from the default naming convention of camel case
 * to the naming convention of a config provider.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.upperCase = internal.upperCase;
/**
 * Returns a new config provider that transforms the config provider with the
 * specified function within the specified path.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.within = internal.within;
//# sourceMappingURL=ConfigProvider.js.map