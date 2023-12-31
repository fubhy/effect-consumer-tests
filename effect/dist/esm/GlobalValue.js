/**
 * @since 2.0.0
 */
import { moduleVersion } from "./internal/version.js";
const globalStoreId = /*#__PURE__*/Symbol.for(`effect/GlobalValue/globalStoreId/${moduleVersion}`);
if (!(globalStoreId in globalThis)) {
  ;
  globalThis[globalStoreId] = /*#__PURE__*/new Map();
}
const globalStore = globalThis[globalStoreId];
/**
 * @since 2.0.0
 */
export const globalValue = (id, compute) => {
  if (!globalStore.has(id)) {
    globalStore.set(id, compute());
  }
  return globalStore.get(id);
};
//# sourceMappingURL=GlobalValue.js.map