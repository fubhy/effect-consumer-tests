"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipWith = exports.zip = exports.withDescription = exports.withDefault = exports.validate = exports.unwrap = exports.hashMap = exports.sync = exports.suspend = exports.succeed = exports.string = exports.hashSet = exports.secret = exports.repeat = exports.primitive = exports.option = exports.orElseIf = exports.orElse = exports.nested = exports.mapOrFail = exports.mapAttempt = exports.map = exports.isConfig = exports.logLevel = exports.integer = exports.number = exports.fail = exports.date = exports.chunk = exports.boolean = exports.array = exports.all = exports.ConfigTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/config.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ConfigTypeId = internal.ConfigTypeId;
/**
 * Constructs a config from a tuple / struct / arguments of configs.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.all = internal.all;
/**
 * Constructs a config for an array of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.array = internal.array;
/**
 * Constructs a config for a boolean value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.boolean = internal.boolean;
/**
 * Constructs a config for a sequence of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.chunk = internal.chunk;
/**
 * Constructs a config for a date value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.date = internal.date;
/**
 * Constructs a config that fails with the specified message.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fail = internal.fail;
/**
 * Constructs a config for a float value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.number = internal.number;
/**
 * Constructs a config for a integer value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.integer = internal.integer;
/**
 * Constructs a config for a `LogLevel` value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.logLevel = internal.logLevel;
/**
 * This function returns `true` if the specified value is an `Config` value,
 * `false` otherwise.
 *
 * This function can be useful for checking the type of a value before
 * attempting to operate on it as an `Config` value. For example, you could
 * use `isConfig` to check the type of a value before using it as an
 * argument to a function that expects an `Config` value.
 *
 * @param u - The value to check for being a `Config` value.
 *
 * @returns `true` if the specified value is a `Config` value, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isConfig = internal.isConfig;
/**
 * Returns a  config whose structure is the same as this one, but which produces
 * a different value, constructed using the specified function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.map = internal.map;
/**
 * Returns a config whose structure is the same as this one, but which may
 * produce a different value, constructed using the specified function, which
 * may throw exceptions that will be translated into validation errors.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapAttempt = internal.mapAttempt;
/**
 * Returns a new config whose structure is the samea as this one, but which
 * may produce a different value, constructed using the specified fallible
 * function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapOrFail = internal.mapOrFail;
/**
 * Returns a config that has this configuration nested as a property of the
 * specified name.
 *
 * @since 2.0.0
 * @category utils
 */
exports.nested = internal.nested;
/**
 * Returns a config whose structure is preferentially described by this
 * config, but which falls back to the specified config if there is an issue
 * reading from this config.
 *
 * @since 2.0.0
 * @category utils
 */
exports.orElse = internal.orElse;
/**
 * Returns configuration which reads from this configuration, but which falls
 * back to the specified configuration if reading from this configuration
 * fails with an error satisfying the specified predicate.
 *
 * @since 2.0.0
 * @category utils
 */
exports.orElseIf = internal.orElseIf;
/**
 * Returns an optional version of this config, which will be `None` if the
 * data is missing from configuration, and `Some` otherwise.
 *
 * @since 2.0.0
 * @category utils
 */
exports.option = internal.option;
/**
 * Constructs a new primitive config.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.primitive = internal.primitive;
/**
 * Returns a config that describes a sequence of values, each of which has the
 * structure of this config.
 *
 * @since 2.0.0
 * @category utils
 */
exports.repeat = internal.repeat;
/**
 * Constructs a config for a secret value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.secret = internal.secret;
/**
 * Constructs a config for a sequence of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.hashSet = internal.hashSet;
/**
 * Constructs a config for a string value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.string = internal.string;
/**
 * Constructs a config which contains the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = internal.succeed;
/**
 * Lazily constructs a config.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.suspend = internal.suspend;
/**
 * Constructs a config which contains the specified lazy value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sync = internal.sync;
/**
 * Constructs a config for a sequence of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.hashMap = internal.hashMap;
/**
 * Constructs a config from some configuration wrapped with the `Wrap<A>` utility type.
 *
 * For example:
 *
 * ```
 * import { Config, unwrap } from "./Config"
 *
 * interface Options { key: string }
 *
 * const makeConfig = (config: Config.Wrap<Options>): Config<Options> => unwrap(config)
 * ```
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unwrap = internal.unwrap;
/**
 * Returns a config that describes the same structure as this one, but which
 * performs validation during loading.
 *
 * @since 2.0.0
 * @category utils
 */
exports.validate = internal.validate;
/**
 * Returns a config that describes the same structure as this one, but has the
 * specified default value in case the information cannot be found.
 *
 * @since 2.0.0
 * @category utils
 */
exports.withDefault = internal.withDefault;
/**
 * Adds a description to this configuration, which is intended for humans.
 *
 * @since 2.0.0
 * @category utils
 */
exports.withDescription = internal.withDescription;
/**
 * Returns a config that is the composition of this config and the specified
 * config.
 *
 * @since 2.0.0
 * @category utils
 */
exports.zip = internal.zip;
/**
 * Returns a config that is the composes this config and the specified config
 * using the provided function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.zipWith = internal.zipWith;
//# sourceMappingURL=Config.js.map