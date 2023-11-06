"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeEntry = exports.isEntry = exports.EntryTypeId = exports.makeCache = exports.succeed = exports.fail = exports.completeEffect = exports.interruptWhenPossible = exports.complete = exports.tagged = exports.of = exports.isRequest = exports.RequestTypeId = void 0;
const _RequestBlock = /*#__PURE__*/require("./internal/blockedRequests.js");
const cache = /*#__PURE__*/require("./internal/cache.js");
const core = /*#__PURE__*/require("./internal/core.js");
const fiberRuntime = /*#__PURE__*/require("./internal/fiberRuntime.js");
const internal = /*#__PURE__*/require("./internal/request.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.RequestTypeId = internal.RequestTypeId;
/**
 * Returns `true` if the specified value is a `Request`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isRequest = internal.isRequest;
/**
 * Constructs a new `Request`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.of = internal.of;
/**
 * Constructs a new `Request`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.tagged = internal.tagged;
/**
 * Complete a `Request` with the specified result.
 *
 * @since 2.0.0
 * @category request completion
 */
exports.complete = internal.complete;
/**
 * Interrupts the child effect when requests are no longer needed
 *
 * @since 2.0.0
 * @category request completion
 */
exports.interruptWhenPossible = fiberRuntime.interruptWhenPossible;
/**
 * Complete a `Request` with the specified effectful computation, failing the
 * request with the error from the effect workflow if it fails, and completing
 * the request with the value of the effect workflow if it succeeds.
 *
 * @since 2.0.0
 * @category request completion
 */
exports.completeEffect = internal.completeEffect;
/**
 * Complete a `Request` with the specified error.
 *
 * @since 2.0.0
 * @category request completion
 */
exports.fail = internal.fail;
/**
 * Complete a `Request` with the specified value.
 *
 * @since 2.0.0
 * @category request completion
 */
exports.succeed = internal.succeed;
/**
 * @since 2.0.0
 * @category models
 */
const makeCache = options => cache.make({
  ...options,
  lookup: () => core.map(core.deferredMake(), handle => ({
    listeners: new internal.Listeners(),
    handle
  }))
});
exports.makeCache = makeCache;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.EntryTypeId = /*#__PURE__*/Symbol.for("effect/RequestBlock.Entry");
/**
 * @since 2.0.0
 * @category guards
 */
exports.isEntry = _RequestBlock.isEntry;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.makeEntry = _RequestBlock.makeEntry;
//# sourceMappingURL=Request.js.map