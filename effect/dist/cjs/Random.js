"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomWith = exports.shuffle = exports.nextIntBetween = exports.nextRange = exports.nextBoolean = exports.nextInt = exports.next = exports.RandomTypeId = void 0;
const defaultServices = /*#__PURE__*/require("./internal/defaultServices.js");
const internal = /*#__PURE__*/require("./internal/random.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.RandomTypeId = internal.RandomTypeId;
/**
 * Returns the next numeric value from the pseudo-random number generator.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.next = defaultServices.next;
/**
 * Returns the next integer value from the pseudo-random number generator.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.nextInt = defaultServices.nextInt;
/**
 * Returns the next boolean value from the pseudo-random number generator.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.nextBoolean = defaultServices.nextBoolean;
/**
 * Returns the next numeric value in the specified range from the
 * pseudo-random number generator.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.nextRange = defaultServices.nextRange;
/**
 * Returns the next integer value in the specified range from the
 * pseudo-random number generator.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.nextIntBetween = defaultServices.nextIntBetween;
/**
 * Uses the pseudo-random number generator to shuffle the specified iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.shuffle = defaultServices.shuffle;
/**
 * Retreives the `Random` service from the context and uses it to run the
 * specified workflow.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.randomWith = defaultServices.randomWith;
//# sourceMappingURL=Random.js.map