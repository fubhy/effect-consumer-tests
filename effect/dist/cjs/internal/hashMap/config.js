"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MIN_ARRAY_NODE = exports.MAX_INDEX_NODE = exports.MASK = exports.BUCKET_SIZE = exports.SIZE = void 0;
/** @internal */
exports.SIZE = 5;
/** @internal */
exports.BUCKET_SIZE = /*#__PURE__*/Math.pow(2, exports.SIZE);
/** @internal */
exports.MASK = exports.BUCKET_SIZE - 1;
/** @internal */
exports.MAX_INDEX_NODE = exports.BUCKET_SIZE / 2;
/** @internal */
exports.MIN_ARRAY_NODE = exports.BUCKET_SIZE / 4;
//# sourceMappingURL=config.js.map