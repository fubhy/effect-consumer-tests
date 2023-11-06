"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = exports.encode = void 0;
const Either = /*#__PURE__*/require("../../Either.js");
const Base64 = /*#__PURE__*/require("./base64.js");
const common_js_1 = /*#__PURE__*/require("./common.js");
/** @internal */
const encode = data => Base64.encode(data).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
exports.encode = encode;
/** @internal */
const decode = str => {
  const length = str.length;
  if (length % 4 === 1) {
    return Either.left((0, common_js_1.DecodeException)(str, `Length should be a multiple of 4, but is ${length}`));
  }
  if (!/^[-_A-Z0-9]*?={0,2}$/i.test(str)) {
    return Either.left((0, common_js_1.DecodeException)(str, "Invalid input"));
  }
  // Some variants allow or require omitting the padding '=' signs
  let sanitized = length % 4 === 2 ? `${str}==` : length % 4 === 3 ? `${str}=` : str;
  sanitized = sanitized.replace(/-/g, "+").replace(/_/g, "/");
  return Base64.decode(sanitized);
};
exports.decode = decode;
//# sourceMappingURL=base64Url.js.map