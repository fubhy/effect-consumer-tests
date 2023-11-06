"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalValue = void 0;
/**
 * @since 2.0.0
 */
const version_js_1 = /*#__PURE__*/require("./internal/version.js");
const globalStoreId = /*#__PURE__*/Symbol.for(`effect/GlobalValue/globalStoreId/${version_js_1.moduleVersion}`);
if (!(globalStoreId in globalThis)) {
  ;
  globalThis[globalStoreId] = /*#__PURE__*/new Map();
}
const globalStore = globalThis[globalStoreId];
/**
 * @since 2.0.0
 */
const globalValue = (id, compute) => {
  if (!globalStore.has(id)) {
    globalStore.set(id, compute());
  }
  return globalStore.get(id);
};
exports.globalValue = globalValue;
//# sourceMappingURL=GlobalValue.js.map