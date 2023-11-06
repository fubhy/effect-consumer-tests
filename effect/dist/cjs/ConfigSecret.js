"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeWipe = exports.value = exports.fromString = exports.fromChunk = exports.make = exports.isConfigSecret = exports.ConfigSecretTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/configSecret.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ConfigSecretTypeId = internal.ConfigSecretTypeId;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isConfigSecret = internal.isConfigSecret;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.fromChunk = internal.fromChunk;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.fromString = internal.fromString;
/**
 * @since 2.0.0
 * @category getters
 */
exports.value = internal.value;
/**
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeWipe = internal.unsafeWipe;
//# sourceMappingURL=ConfigSecret.js.map