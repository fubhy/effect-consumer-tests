"use strict";

/**
 * Bun currently has a bug where `setTimeout` doesn't behave correctly with a 0ms delay.
 *
 * @see https://github.com/oven-sh/bun/issues/3333
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = exports.clear = void 0;
/** @internal */
const isBun = typeof process === "undefined" ? false : !!process?.isBun;
/** @internal */
exports.clear = isBun ? id => clearInterval(id) : id => clearTimeout(id);
/** @internal */
exports.set = isBun ? (fn, ms) => {
  const id = setInterval(() => {
    fn();
    clearInterval(id);
  }, ms);
  return id;
} : (fn, ms) => setTimeout(fn, ms);
//# sourceMappingURL=timeout.js.map