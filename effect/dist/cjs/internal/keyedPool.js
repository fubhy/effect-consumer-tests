"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidate = exports.get = exports.makeWithTTLBy = exports.makeWithTTL = exports.makeWith = exports.make = exports.KeyedPoolTypeId = void 0;
const Duration = /*#__PURE__*/require("../Duration.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate = /*#__PURE__*/require("../Predicate.js");
const core = /*#__PURE__*/require("./core.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const pool = /*#__PURE__*/require("./pool.js");
/** @internal */
const KeyedPoolSymbolKey = "effect/KeyedPool";
/** @internal */
exports.KeyedPoolTypeId = /*#__PURE__*/Symbol.for(KeyedPoolSymbolKey);
const KeyedPoolMapValueSymbol = /*#__PURE__*/Symbol.for("effect/KeyedPool/MapValue");
const keyedPoolVariance = {
  _K: _ => _,
  _E: _ => _,
  _A: _ => _
};
class KeyedPoolImpl {
  getOrCreatePool;
  activePools;
  [exports.KeyedPoolTypeId] = keyedPoolVariance;
  constructor(getOrCreatePool, activePools) {
    this.getOrCreatePool = getOrCreatePool;
    this.activePools = activePools;
  }
  get(key) {
    return core.flatMap(this.getOrCreatePool(key), pool.get);
  }
  invalidate(item) {
    return core.flatMap(this.activePools(), core.forEachSequentialDiscard(pool => pool.invalidate(item)));
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
class Complete {
  pool;
  _tag = "Complete";
  [KeyedPoolMapValueSymbol] = KeyedPoolMapValueSymbol;
  constructor(pool) {
    this.pool = pool;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.string("effect/KeyedPool/Complete"), Hash.combine(Hash.hash(this.pool)));
  }
  [Equal.symbol](u) {
    return isComplete(u) && Equal.equals(this.pool, u.pool);
  }
}
const isComplete = u => Predicate.isTagged(u, "Complete") && KeyedPoolMapValueSymbol in u;
class Pending {
  deferred;
  _tag = "Pending";
  [KeyedPoolMapValueSymbol] = KeyedPoolMapValueSymbol;
  constructor(deferred) {
    this.deferred = deferred;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.string("effect/KeyedPool/Pending"), Hash.combine(Hash.hash(this.deferred)));
  }
  [Equal.symbol](u) {
    return isPending(u) && Equal.equals(this.deferred, u.deferred);
  }
}
const isPending = u => Predicate.isTagged(u, "Pending") && KeyedPoolMapValueSymbol in u;
const makeImpl = (get, min, max, timeToLive) => (0, Function_js_1.pipe)(fiberRuntime.all([core.context(), core.fiberId, core.sync(() => MutableRef.make(HashMap.empty())), fiberRuntime.scopeMake()]), core.map(([context, fiberId, map, scope]) => {
  const getOrCreatePool = key => core.suspend(() => {
    let value = Option.getOrUndefined(HashMap.get(MutableRef.get(map), key));
    if (value === undefined) {
      return core.uninterruptibleMask(restore => {
        const deferred = core.deferredUnsafeMake(fiberId);
        value = new Pending(deferred);
        let previous = undefined;
        if (HashMap.has(MutableRef.get(map), key)) {
          previous = Option.getOrUndefined(HashMap.get(MutableRef.get(map), key));
        } else {
          MutableRef.update(map, HashMap.set(key, value));
        }
        if (previous === undefined) {
          return (0, Function_js_1.pipe)(restore(fiberRuntime.scopeExtend(pool.makeWithTTL({
            acquire: core.provideContext(get(key), context),
            min: min(key),
            max: max(key),
            timeToLive: Option.getOrElse(timeToLive(key), () => Duration.infinity)
          }), scope)), core.matchCauseEffect({
            onFailure: cause => {
              const current = Option.getOrUndefined(HashMap.get(MutableRef.get(map), key));
              if (Equal.equals(current, value)) {
                MutableRef.update(map, HashMap.remove(key));
              }
              return core.zipRight(core.deferredFailCause(deferred, cause), core.failCause(cause));
            },
            onSuccess: pool => {
              MutableRef.update(map, HashMap.set(key, new Complete(pool)));
              return core.as(core.deferredSucceed(deferred, pool), pool);
            }
          }));
        }
        switch (previous._tag) {
          case "Complete":
            {
              return core.succeed(previous.pool);
            }
          case "Pending":
            {
              return restore(core.deferredAwait(previous.deferred));
            }
        }
      });
    }
    switch (value._tag) {
      case "Complete":
        {
          return core.succeed(value.pool);
        }
      case "Pending":
        {
          return core.deferredAwait(value.deferred);
        }
    }
  });
  const activePools = () => core.suspend(() => core.forEachSequential(Array.from(HashMap.values(MutableRef.get(map))), value => {
    switch (value._tag) {
      case "Complete":
        {
          return core.succeed(value.pool);
        }
      case "Pending":
        {
          return core.deferredAwait(value.deferred);
        }
    }
  }));
  return new KeyedPoolImpl(getOrCreatePool, activePools);
}));
/** @internal */
const make = options => makeImpl(options.acquire, () => options.size, () => options.size, () => Option.none());
exports.make = make;
/** @internal */
const makeWith = options => makeImpl(options.acquire, options.size, options.size, () => Option.none());
exports.makeWith = makeWith;
/** @internal */
const makeWithTTL = options => {
  const timeToLive = Duration.decode(options.timeToLive);
  return makeImpl(options.acquire, options.min, options.max, () => Option.some(timeToLive));
};
exports.makeWithTTL = makeWithTTL;
/** @internal */
const makeWithTTLBy = options => makeImpl(options.acquire, options.min, options.max, key => Option.some(Duration.decode(options.timeToLive(key))));
exports.makeWithTTLBy = makeWithTTLBy;
/** @internal */
exports.get = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, key) => self.get(key));
/** @internal */
exports.invalidate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, item) => self.invalidate(item));
//# sourceMappingURL=keyedPool.js.map