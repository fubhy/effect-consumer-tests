"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withRequestCache = exports.withRequestCaching = exports.cacheRequest = exports.fromRequest = exports.currentCacheEnabled = exports.currentCache = void 0;
const Duration_js_1 = /*#__PURE__*/require("../Duration.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const BlockedRequests = /*#__PURE__*/require("./blockedRequests.js");
const cache_js_1 = /*#__PURE__*/require("./cache.js");
const cause_js_1 = /*#__PURE__*/require("./cause.js");
const core = /*#__PURE__*/require("./core.js");
const fiberRuntime_js_1 = /*#__PURE__*/require("./fiberRuntime.js");
const request_js_1 = /*#__PURE__*/require("./request.js");
/** @internal */
exports.currentCache = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentCache"), () => core.fiberRefUnsafeMake((0, cache_js_1.unsafeMakeWith)(65536, () => core.map(core.deferredMake(), handle => ({
  listeners: new request_js_1.Listeners(),
  handle
})), () => (0, Duration_js_1.seconds)(60))));
/** @internal */
exports.currentCacheEnabled = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentCacheEnabled"), () => core.fiberRefUnsafeMake(false));
/** @internal */
const fromRequest = (request, dataSource) => core.flatMap(core.isEffect(dataSource) ? dataSource : core.succeed(dataSource), ds => core.fiberIdWith(id => {
  const proxy = new Proxy(request, {});
  return core.fiberRefGetWith(exports.currentCacheEnabled, cacheEnabled => {
    if (cacheEnabled) {
      return core.fiberRefGetWith(exports.currentCache, cache => core.flatMap(cache.getEither(proxy), orNew => {
        switch (orNew._tag) {
          case "Left":
            {
              orNew.left.listeners.increment();
              return core.blocked(BlockedRequests.empty, core.flatMap(core.exit(core.deferredAwait(orNew.left.handle)), exit => {
                if (exit._tag === "Failure" && (0, cause_js_1.isInterruptedOnly)(exit.cause)) {
                  orNew.left.listeners.decrement();
                  return core.flatMap(cache.invalidateWhen(proxy, entry => entry.handle === orNew.left.handle), () => (0, exports.fromRequest)(proxy, dataSource));
                }
                return (0, fiberRuntime_js_1.ensuring)(core.deferredAwait(orNew.left.handle), core.sync(() => orNew.left.listeners.decrement()));
              }));
            }
          case "Right":
            {
              orNew.right.listeners.increment();
              return core.blocked(BlockedRequests.single(ds, BlockedRequests.makeEntry({
                request: proxy,
                result: orNew.right.handle,
                listeners: orNew.right.listeners,
                ownerId: id,
                state: {
                  completed: false
                }
              })), core.uninterruptibleMask(restore => core.flatMap(core.exit(restore(core.deferredAwait(orNew.right.handle))), exit => {
                orNew.right.listeners.decrement();
                return exit;
              })));
            }
        }
      }));
    }
    const listeners = new request_js_1.Listeners();
    listeners.increment();
    return core.flatMap(core.deferredMake(), ref => core.blocked(BlockedRequests.single(ds, BlockedRequests.makeEntry({
      request: proxy,
      result: ref,
      listeners,
      ownerId: id,
      state: {
        completed: false
      }
    })), (0, fiberRuntime_js_1.ensuring)(core.deferredAwait(ref), core.sync(() => listeners.decrement()))));
  });
}));
exports.fromRequest = fromRequest;
/** @internal */
const cacheRequest = (request, result) => {
  return core.fiberRefGetWith(exports.currentCacheEnabled, cacheEnabled => {
    if (cacheEnabled) {
      return core.fiberRefGetWith(exports.currentCache, cache => core.flatMap(cache.getEither(request), orNew => {
        switch (orNew._tag) {
          case "Left":
            {
              return core.unit;
            }
          case "Right":
            {
              return core.deferredComplete(orNew.right.handle, result);
            }
        }
      }));
    }
    return core.unit;
  });
};
exports.cacheRequest = cacheRequest;
/** @internal */
exports.withRequestCaching = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, strategy) => core.fiberRefLocally(self, exports.currentCacheEnabled, strategy));
/** @internal */
exports.withRequestCache = /*#__PURE__*/(0, Function_js_1.dual)(2,
// @ts-expect-error
(self, cache) => core.fiberRefLocally(self, exports.currentCache, cache));
//# sourceMappingURL=query.js.map