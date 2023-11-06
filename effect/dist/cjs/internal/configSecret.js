"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeWipe = exports.value = exports.fromString = exports.fromChunk = exports.make = exports.isConfigSecret = exports.proto = exports.ConfigSecretTypeId = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
/** @internal */
const ConfigSecretSymbolKey = "effect/ConfigSecret";
/** @internal */
exports.ConfigSecretTypeId = /*#__PURE__*/Symbol.for(ConfigSecretSymbolKey);
/** @internal */
exports.proto = {
  [exports.ConfigSecretTypeId]: exports.ConfigSecretTypeId,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(ConfigSecretSymbolKey), Hash.combine(Hash.array(this.raw)));
  },
  [Equal.symbol](that) {
    return (0, exports.isConfigSecret)(that) && this.raw.length === that.raw.length && this.raw.every((v, i) => Equal.equals(v, that.raw[i]));
  }
};
/** @internal */
const isConfigSecret = u => (0, Predicate_js_1.hasProperty)(u, exports.ConfigSecretTypeId);
exports.isConfigSecret = isConfigSecret;
/** @internal */
const make = bytes => {
  const secret = Object.create(exports.proto);
  Object.defineProperty(secret, "toString", {
    enumerable: false,
    value() {
      return "ConfigSecret(<redacted>)";
    }
  });
  Object.defineProperty(secret, "raw", {
    enumerable: false,
    value: bytes
  });
  return secret;
};
exports.make = make;
/** @internal */
const fromChunk = chunk => {
  return (0, exports.make)(Chunk.toReadonlyArray(chunk).map(char => char.charCodeAt(0)));
};
exports.fromChunk = fromChunk;
/** @internal */
const fromString = text => {
  return (0, exports.make)(text.split("").map(char => char.charCodeAt(0)));
};
exports.fromString = fromString;
/** @internal */
const value = self => {
  return self.raw.map(byte => String.fromCharCode(byte)).join("");
};
exports.value = value;
/** @internal */
const unsafeWipe = self => {
  for (let i = 0; i < self.raw.length; i++) {
    self.raw[i] = 0;
  }
};
exports.unsafeWipe = unsafeWipe;
//# sourceMappingURL=configSecret.js.map