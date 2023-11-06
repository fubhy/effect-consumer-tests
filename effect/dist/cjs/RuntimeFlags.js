"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.windDown = exports.toSet = exports.runtimeMetrics = exports.render = exports.patch = exports.opSupervision = exports.none = exports.make = exports.isDisabled = exports.isEnabled = exports.interruption = exports.interruptible = exports.enableWindDown = exports.enableRuntimeMetrics = exports.enableOpSupervision = exports.enableInterruption = exports.enableCooperativeYielding = exports.enableAll = exports.enable = exports.disableWindDown = exports.disableRuntimeMetrics = exports.disableOpSupervision = exports.disableInterruption = exports.disableCooperativeYielding = exports.disableAll = exports.disable = exports.differ = exports.diff = exports.cooperativeYielding = exports.CooperativeYielding = exports.WindDown = exports.RuntimeMetrics = exports.OpSupervision = exports.Interruption = exports.None = void 0;
const circular = /*#__PURE__*/require("./internal/layer/circular.js");
const internal = /*#__PURE__*/require("./internal/runtimeFlags.js");
/**
 * No runtime flags.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.None = internal.None;
/**
 * The interruption flag determines whether or not the Effect runtime system will
 * interrupt a fiber.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.Interruption = internal.Interruption;
/**
 * The op supervision flag determines whether or not the Effect runtime system
 * will supervise all operations of the Effect runtime. Use of this flag will
 * negatively impact performance, but is required for some operations, such as
 * profiling.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.OpSupervision = internal.OpSupervision;
/**
 * The runtime metrics flag determines whether or not the Effect runtime system
 * will collect metrics about the Effect runtime. Use of this flag will have a
 * very small negative impact on performance, but generates very helpful
 * operational insight into running Effect applications that can be exported to
 * Prometheus or other tools via Effect Metrics.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.RuntimeMetrics = internal.RuntimeMetrics;
/**
 * The wind down flag determines whether the Effect runtime system will execute
 * effects in wind-down mode. In wind-down mode, even if interruption is
 * enabled and a fiber has been interrupted, the fiber will continue its
 * execution uninterrupted.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.WindDown = internal.WindDown;
/**
 * The cooperative yielding flag determines whether the Effect runtime will
 * yield to another fiber.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.CooperativeYielding = internal.CooperativeYielding;
/**
 * Returns `true` if the `CooperativeYielding` `RuntimeFlag` is enabled, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.cooperativeYielding = internal.cooperativeYielding;
/**
 * Creates a `RuntimeFlagsPatch` which describes the difference between `self`
 * and `that`.
 *
 * @since 2.0.0
 * @category diffing
 */
exports.diff = internal.diff;
/**
 * Constructs a differ that knows how to diff `RuntimeFlags` values.
 *
 * @since 2.0.0
 * @category utils
 */
exports.differ = internal.differ;
/**
 * Disables the specified `RuntimeFlag`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.disable = internal.disable;
/**
 * Disables all of the `RuntimeFlag`s in the specified set of `RuntimeFlags`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.disableAll = internal.disableAll;
/**
 * @since 2.0.0
 * @category context
 */
exports.disableCooperativeYielding = circular.disableCooperativeYielding;
/**
 * @since 2.0.0
 * @category context
 */
exports.disableInterruption = circular.disableInterruption;
/**
 * @since 2.0.0
 * @category context
 */
exports.disableOpSupervision = circular.disableOpSupervision;
/**
 * @since 2.0.0
 * @category context
 */
exports.disableRuntimeMetrics = circular.disableRuntimeMetrics;
/**
 * @since 2.0.0
 * @category context
 */
exports.disableWindDown = circular.disableWindDown;
/**
 * Enables the specified `RuntimeFlag`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.enable = internal.enable;
/**
 * Enables all of the `RuntimeFlag`s in the specified set of `RuntimeFlags`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.enableAll = internal.enableAll;
/**
 * @since 2.0.0
 * @category context
 */
exports.enableCooperativeYielding = circular.enableCooperativeYielding;
/**
 * @since 2.0.0
 * @category context
 */
exports.enableInterruption = circular.enableInterruption;
/**
 * @since 2.0.0
 * @category context
 */
exports.enableOpSupervision = circular.enableOpSupervision;
/**
 * @since 2.0.0
 * @category context
 */
exports.enableRuntimeMetrics = circular.enableRuntimeMetrics;
/**
 * @since 2.0.0
 * @category context
 */
exports.enableWindDown = circular.enableWindDown;
/**
 * Returns true only if the `Interruption` flag is **enabled** and the
 * `WindDown` flag is **disabled**.
 *
 * A fiber is said to be interruptible if interruption is enabled and the fiber
 * is not in its wind-down phase, in which it takes care of cleanup activities
 * related to fiber shutdown.
 *
 * @since 2.0.0
 * @category getters
 */
exports.interruptible = internal.interruptible;
/**
 * Returns `true` if the `Interruption` `RuntimeFlag` is enabled, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.interruption = internal.interruption;
/**
 * Returns `true` if the specified `RuntimeFlag` is enabled, `false` otherwise.
 *
 * @since 2.0.0
 * @category elements
 */
exports.isEnabled = internal.isEnabled;
/**
 * Returns `true` if the specified `RuntimeFlag` is disabled, `false` otherwise.
 *
 * @since 2.0.0
 * @category elements
 */
exports.isDisabled = internal.isDisabled;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.none = internal.none;
/**
 * Returns `true` if the `OpSupervision` `RuntimeFlag` is enabled, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.opSupervision = internal.opSupervision;
/**
 * Patches a set of `RuntimeFlag`s with a `RuntimeFlagsPatch`, returning the
 * patched set of `RuntimeFlag`s.
 *
 * @since 2.0.0
 * @category utils
 */
exports.patch = internal.patch;
/**
 * Converts the provided `RuntimeFlags` into a `string`.
 *
 * @category conversions
 * @since 2.0.0
 */
exports.render = internal.render;
/**
 * Returns `true` if the `RuntimeMetrics` `RuntimeFlag` is enabled, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.runtimeMetrics = internal.runtimeMetrics;
/**
 * Converts the provided `RuntimeFlags` into a `ReadonlySet<number>`.
 *
 * @category conversions
 * @since 2.0.0
 */
exports.toSet = internal.toSet;
/**
 * Returns `true` if the `WindDown` `RuntimeFlag` is enabled, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.windDown = internal.windDown;
//# sourceMappingURL=RuntimeFlags.js.map