import { hasProperty } from "../../Predicate.js";
/** @internal */
export const DecodeExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Encoding/errors/Decode");
/** @internal */
export const DecodeException = (input, message) => ({
  _tag: "DecodeException",
  [DecodeExceptionTypeId]: DecodeExceptionTypeId,
  input,
  message
});
/** @internal */
export const isDecodeException = u => hasProperty(u, DecodeExceptionTypeId);
/** @interal */
export const encoder = /*#__PURE__*/new TextEncoder();
/** @interal */
export const decoder = /*#__PURE__*/new TextDecoder();
//# sourceMappingURL=common.js.map