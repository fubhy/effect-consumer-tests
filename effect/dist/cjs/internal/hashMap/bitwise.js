"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromBitmap = exports.toBitmap = exports.hashFragment = exports.popcount = void 0;
const config_js_1 = /*#__PURE__*/require("./config.js");
/**
 * Hamming weight.
 *
 * Taken from: http://jsperf.com/hamming-weight
 *
 * @internal
 */
function popcount(x) {
  x -= x >> 1 & 0x55555555;
  x = (x & 0x33333333) + (x >> 2 & 0x33333333);
  x = x + (x >> 4) & 0x0f0f0f0f;
  x += x >> 8;
  x += x >> 16;
  return x & 0x7f;
}
exports.popcount = popcount;
/** @internal */
function hashFragment(shift, h) {
  return h >>> shift & config_js_1.MASK;
}
exports.hashFragment = hashFragment;
/** @internal */
function toBitmap(x) {
  return 1 << x;
}
exports.toBitmap = toBitmap;
/** @internal */
function fromBitmap(bitmap, bit) {
  return popcount(bitmap & bit - 1);
}
exports.fromBitmap = fromBitmap;
//# sourceMappingURL=bitwise.js.map