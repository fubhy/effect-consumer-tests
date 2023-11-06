"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.succeed = exports.poll = exports.make = exports.fail = exports.done = exports.await = exports.TDeferredTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/stm/tDeferred.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TDeferredTypeId = internal.TDeferredTypeId;
const _await = internal._await;
exports.await = _await;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.done = internal.done;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.fail = internal.fail;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category getters
 */
exports.poll = internal.poll;
/**
 * @since 2.0.0
 * @category mutations
 */
exports.succeed = internal.succeed;
//# sourceMappingURL=TDeferred.js.map