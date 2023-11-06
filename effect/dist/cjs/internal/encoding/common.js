"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decoder = exports.encoder = exports.isDecodeException = exports.DecodeException = exports.DecodeExceptionTypeId = void 0;
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
/** @internal */
exports.DecodeExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Encoding/errors/Decode");
/** @internal */
const DecodeException = (input, message) => ({
  _tag: "DecodeException",
  [exports.DecodeExceptionTypeId]: exports.DecodeExceptionTypeId,
  input,
  message
});
exports.DecodeException = DecodeException;
/** @internal */
const isDecodeException = u => (0, Predicate_js_1.hasProperty)(u, exports.DecodeExceptionTypeId);
exports.isDecodeException = isDecodeException;
/** @interal */
exports.encoder = /*#__PURE__*/new TextEncoder();
/** @interal */
exports.decoder = /*#__PURE__*/new TextDecoder();
//# sourceMappingURL=common.js.map