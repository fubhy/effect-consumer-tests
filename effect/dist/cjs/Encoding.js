"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDecodeException = exports.DecodeException = exports.DecodeExceptionTypeId = exports.decodeHexString = exports.decodeHex = exports.encodeHex = exports.decodeBase64UrlString = exports.decodeBase64Url = exports.encodeBase64Url = exports.decodeBase64String = exports.decodeBase64 = exports.encodeBase64 = void 0;
/**
 * This module provides encoding & decoding functionality for:
 *
 * - base64 (RFC4648)
 * - base64 (URL)
 * - hex
 *
 * @since 2.0.0
 */
const Either = /*#__PURE__*/require("./Either.js");
const Base64 = /*#__PURE__*/require("./internal/encoding/base64.js");
const Base64Url = /*#__PURE__*/require("./internal/encoding/base64Url.js");
const Common = /*#__PURE__*/require("./internal/encoding/common.js");
const Hex = /*#__PURE__*/require("./internal/encoding/hex.js");
/**
 * Encodes the given value into a base64 (RFC4648) `string`.
 *
 * @category encoding
 * @since 2.0.0
 */
const encodeBase64 = input => typeof input === "string" ? Base64.encode(Common.encoder.encode(input)) : Base64.encode(input);
exports.encodeBase64 = encodeBase64;
/**
 * Decodes a base64 (RFC4648) encoded `string` into a `Uint8Array`.
 *
 * @category decoding
 * @since 2.0.0
 */
const decodeBase64 = str => Base64.decode(str);
exports.decodeBase64 = decodeBase64;
/**
 * Decodes a base64 (RFC4648) encoded `string` into a UTF-8 `string`.
 *
 * @category decoding
 * @since 2.0.0
 */
const decodeBase64String = str => Either.map((0, exports.decodeBase64)(str), _ => Common.decoder.decode(_));
exports.decodeBase64String = decodeBase64String;
/**
 * Encodes the given value into a base64 (URL) `string`.
 *
 * @category encoding
 * @since 2.0.0
 */
const encodeBase64Url = input => typeof input === "string" ? Base64Url.encode(Common.encoder.encode(input)) : Base64Url.encode(input);
exports.encodeBase64Url = encodeBase64Url;
/**
 * Decodes a base64 (URL) encoded `string` into a `Uint8Array`.
 *
 * @category decoding
 * @since 2.0.0
 */
const decodeBase64Url = str => Base64Url.decode(str);
exports.decodeBase64Url = decodeBase64Url;
/**
 * Decodes a base64 (URL) encoded `string` into a UTF-8 `string`.
 *
 * @category decoding
 * @since 2.0.0
 */
const decodeBase64UrlString = str => Either.map((0, exports.decodeBase64Url)(str), _ => Common.decoder.decode(_));
exports.decodeBase64UrlString = decodeBase64UrlString;
/**
 * Encodes the given value into a hex `string`.
 *
 * @category encoding
 * @since 2.0.0
 */
const encodeHex = input => typeof input === "string" ? Hex.encode(Common.encoder.encode(input)) : Hex.encode(input);
exports.encodeHex = encodeHex;
/**
 * Decodes a hex encoded `string` into a `Uint8Array`.
 *
 * @category decoding
 * @since 2.0.0
 */
const decodeHex = str => Hex.decode(str);
exports.decodeHex = decodeHex;
/**
 * Decodes a hex encoded `string` into a UTF-8 `string`.
 *
 * @category decoding
 * @since 2.0.0
 */
const decodeHexString = str => Either.map((0, exports.decodeHex)(str), _ => Common.decoder.decode(_));
exports.decodeHexString = decodeHexString;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.DecodeExceptionTypeId = Common.DecodeExceptionTypeId;
/**
 * Creates a checked exception which occurs when decoding fails.
 *
 * @since 2.0.0
 * @category errors
 */
exports.DecodeException = Common.DecodeException;
/**
 * Returns `true` if the specified value is an `DecodeException`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isDecodeException = Common.isDecodeException;
//# sourceMappingURL=Encoding.js.map