"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = exports.nextRange = exports.nextIntBetween = exports.nextInt = exports.nextBoolean = exports.next = exports.live = exports.Tag = exports.TRandomTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/stm/tRandom.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TRandomTypeId = internal.TRandomTypeId;
/**
 * The service tag used to access `TRandom` in the environment of an effect.
 *
 * @since 2.0.0
 * @category context
 */
exports.Tag = internal.Tag;
/**
 * The "live" `TRandom` service wrapped into a `Layer`.
 *
 * @since 2.0.0
 * @category context
 */
exports.live = internal.live;
/**
 * Returns the next number from the pseudo-random number generator.
 *
 * @since 2.0.0
 * @category random
 */
exports.next = internal.next;
/**
 * Returns the next boolean value from the pseudo-random number generator.
 *
 * @since 2.0.0
 * @category random
 */
exports.nextBoolean = internal.nextBoolean;
/**
 * Returns the next integer from the pseudo-random number generator.
 *
 * @since 2.0.0
 * @category random
 */
exports.nextInt = internal.nextInt;
/**
 * Returns the next integer in the specified range from the pseudo-random number
 * generator.
 *
 * @since 2.0.0
 * @category random
 */
exports.nextIntBetween = internal.nextIntBetween;
/**
 * Returns the next number in the specified range from the pseudo-random number
 * generator.
 *
 * @since 2.0.0
 * @category random
 */
exports.nextRange = internal.nextRange;
/**
 * Uses the pseudo-random number generator to shuffle the specified iterable.
 *
 * @since 2.0.0
 * @category random
 */
exports.shuffle = internal.shuffle;
//# sourceMappingURL=TRandom.js.map