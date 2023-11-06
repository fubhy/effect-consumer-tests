"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeWith = exports.make = exports.ScopedCacheTypeId = exports.releaseOwner = exports.toScoped = exports.refreshing = exports.pending = exports.complete = exports.initialCacheState = exports.makeCacheState = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Data = /*#__PURE__*/require("../Data.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const MutableHashMap = /*#__PURE__*/require("../MutableHashMap.js");
const MutableQueue = /*#__PURE__*/require("../MutableQueue.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Scope = /*#__PURE__*/require("../Scope.js");
const _cache = /*#__PURE__*/require("./cache.js");
const effect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
/** @internal */
const makeCacheState = (map, keys, accesses, updating, hits, misses) => ({
  map,
  keys,
  accesses,
  updating,
  hits,
  misses
});
exports.makeCacheState = makeCacheState;
/**
 * Constructs an initial cache state.
 *
 * @internal
 */
const initialCacheState = () => (0, exports.makeCacheState)(MutableHashMap.empty(), _cache.makeKeySet(), MutableQueue.unbounded(), MutableRef.make(false), 0, 0);
exports.initialCacheState = initialCacheState;
/** @internal */
const complete = (key, exit, ownerCount, entryStats, timeToLive) => Data.struct({
  _tag: "Complete",
  key,
  exit,
  ownerCount,
  entryStats,
  timeToLive
});
exports.complete = complete;
/** @internal */
const pending = (key, scoped) => Data.struct({
  _tag: "Pending",
  key,
  scoped
});
exports.pending = pending;
/** @internal */
const refreshing = (scoped, complete) => Data.struct({
  _tag: "Refreshing",
  scoped,
  complete
});
exports.refreshing = refreshing;
/** @internal */
const toScoped = self => Exit.matchEffect(self.exit, {
  onFailure: cause => core.failCause(cause),
  onSuccess: ([value]) => fiberRuntime.acquireRelease(core.as(core.sync(() => MutableRef.incrementAndGet(self.ownerCount)), value), () => (0, exports.releaseOwner)(self))
});
exports.toScoped = toScoped;
/** @internal */
const releaseOwner = self => Exit.matchEffect(self.exit, {
  onFailure: () => core.unit,
  onSuccess: ([, finalizer]) => core.flatMap(core.sync(() => MutableRef.decrementAndGet(self.ownerCount)), numOwner => effect.when(finalizer(Exit.unit), () => numOwner === 0))
});
exports.releaseOwner = releaseOwner;
/** @internal */
const ScopedCacheSymbolKey = "effect/ScopedCache";
/** @internal */
exports.ScopedCacheTypeId = /*#__PURE__*/Symbol.for(ScopedCacheSymbolKey);
const scopedCacheVariance = {
  _Key: _ => _,
  _Error: _ => _,
  _Value: _ => _
};
class ScopedCacheImpl {
  capacity;
  scopedLookup;
  clock;
  timeToLive;
  context;
  [exports.ScopedCacheTypeId] = scopedCacheVariance;
  cacheState;
  constructor(capacity, scopedLookup, clock, timeToLive, context) {
    this.capacity = capacity;
    this.scopedLookup = scopedLookup;
    this.clock = clock;
    this.timeToLive = timeToLive;
    this.context = context;
    this.cacheState = (0, exports.initialCacheState)();
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  cacheStats() {
    return core.sync(() => _cache.makeCacheStats({
      hits: this.cacheState.hits,
      misses: this.cacheState.misses,
      size: MutableHashMap.size(this.cacheState.map)
    }));
  }
  getOption(key) {
    return core.suspend(() => Option.match(MutableHashMap.get(this.cacheState.map, key), {
      onNone: () => effect.succeedNone,
      onSome: value => core.flatten(this.resolveMapValue(value))
    }));
  }
  getOptionComplete(key) {
    return core.suspend(() => Option.match(MutableHashMap.get(this.cacheState.map, key), {
      onNone: () => effect.succeedNone,
      onSome: value => core.flatten(this.resolveMapValue(value, true))
    }));
  }
  contains(key) {
    return core.sync(() => MutableHashMap.has(this.cacheState.map, key));
  }
  entryStats(key) {
    return core.sync(() => {
      const value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
      if (value === undefined) {
        return Option.none();
      }
      switch (value._tag) {
        case "Complete":
          {
            return Option.some(_cache.makeEntryStats(value.entryStats.loadedMillis));
          }
        case "Pending":
          {
            return Option.none();
          }
        case "Refreshing":
          {
            return Option.some(_cache.makeEntryStats(value.complete.entryStats.loadedMillis));
          }
      }
    });
  }
  get(key) {
    return (0, Function_js_1.pipe)(this.lookupValueOf(key), effect.memoize, core.flatMap(lookupValue => core.suspend(() => {
      let k = undefined;
      let value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
      if (value === undefined) {
        k = _cache.makeMapKey(key);
        if (MutableHashMap.has(this.cacheState.map, key)) {
          value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
        } else {
          MutableHashMap.set(this.cacheState.map, key, (0, exports.pending)(k, lookupValue));
        }
      }
      if (value === undefined) {
        this.trackMiss();
        return core.zipRight(this.ensureMapSizeNotExceeded(k), lookupValue);
      }
      return core.map(this.resolveMapValue(value), core.flatMap(Option.match({
        onNone: () => {
          const val = value;
          const current = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
          if (Equal.equals(current, value)) {
            MutableHashMap.remove(this.cacheState.map, key);
          }
          return (0, Function_js_1.pipe)(this.ensureMapSizeNotExceeded(val.key), core.zipRight((0, exports.releaseOwner)(val)), core.zipRight(this.get(key)));
        },
        onSome: core.succeed
      })));
    })), core.flatten);
  }
  invalidate(key) {
    return core.suspend(() => {
      if (MutableHashMap.has(this.cacheState.map, key)) {
        const mapValue = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
        MutableHashMap.remove(this.cacheState.map, key);
        switch (mapValue._tag) {
          case "Complete":
            {
              return (0, exports.releaseOwner)(mapValue);
            }
          case "Pending":
            {
              return core.unit;
            }
          case "Refreshing":
            {
              return (0, exports.releaseOwner)(mapValue.complete);
            }
        }
      }
      return core.unit;
    });
  }
  invalidateAll() {
    return fiberRuntime.forEachParUnboundedDiscard(HashSet.fromIterable(Array.from(this.cacheState.map).map(([key]) => key)), key => this.invalidate(key), false);
  }
  refresh(key) {
    return (0, Function_js_1.pipe)(this.lookupValueOf(key), effect.memoize, core.flatMap(scoped => {
      let value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
      let newKey = undefined;
      if (value === undefined) {
        newKey = _cache.makeMapKey(key);
        if (MutableHashMap.has(this.cacheState.map, key)) {
          value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
        } else {
          MutableHashMap.set(this.cacheState.map, key, (0, exports.pending)(newKey, scoped));
        }
      }
      let finalScoped;
      if (value === undefined) {
        finalScoped = core.zipRight(this.ensureMapSizeNotExceeded(newKey), scoped);
      } else {
        switch (value._tag) {
          case "Complete":
            {
              if (this.hasExpired(value.timeToLive)) {
                finalScoped = core.succeed(this.get(key));
              } else {
                const current = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
                if (Equal.equals(current, value)) {
                  const mapValue = (0, exports.refreshing)(scoped, value);
                  MutableHashMap.set(this.cacheState.map, key, mapValue);
                  finalScoped = scoped;
                } else {
                  finalScoped = core.succeed(this.get(key));
                }
              }
              break;
            }
          case "Pending":
            {
              finalScoped = value.scoped;
              break;
            }
          case "Refreshing":
            {
              finalScoped = value.scoped;
              break;
            }
        }
      }
      return core.flatMap(finalScoped, s => fiberRuntime.scopedEffect(core.asUnit(s)));
    }));
  }
  size() {
    return core.sync(() => MutableHashMap.size(this.cacheState.map));
  }
  resolveMapValue(value, ignorePending = false) {
    switch (value._tag) {
      case "Complete":
        {
          this.trackHit();
          if (this.hasExpired(value.timeToLive)) {
            return core.succeed(effect.succeedNone);
          }
          return core.as(this.ensureMapSizeNotExceeded(value.key), effect.asSome((0, exports.toScoped)(value)));
        }
      case "Pending":
        {
          this.trackHit();
          if (ignorePending) {
            return core.succeed(effect.succeedNone);
          }
          return core.zipRight(this.ensureMapSizeNotExceeded(value.key), core.map(value.scoped, effect.asSome));
        }
      case "Refreshing":
        {
          this.trackHit();
          if (this.hasExpired(value.complete.timeToLive)) {
            if (ignorePending) {
              return core.succeed(effect.succeedNone);
            }
            return core.zipRight(this.ensureMapSizeNotExceeded(value.complete.key), core.map(value.scoped, effect.asSome));
          }
          return core.as(this.ensureMapSizeNotExceeded(value.complete.key), effect.asSome((0, exports.toScoped)(value.complete)));
        }
    }
  }
  lookupValueOf(key) {
    return (0, Function_js_1.pipe)(core.onInterrupt(core.flatMap(Scope.make(), scope => (0, Function_js_1.pipe)(this.scopedLookup(key), core.provideContext((0, Function_js_1.pipe)(this.context, Context.add(Scope.Scope, scope))), core.exit, core.map(exit => [exit, exit => Scope.close(scope, exit)]))), () => core.sync(() => MutableHashMap.remove(this.cacheState.map, key))), core.flatMap(([exit, release]) => {
      const now = this.clock.unsafeCurrentTimeMillis();
      const expiredAt = now + Duration.toMillis(this.timeToLive(exit));
      switch (exit._tag) {
        case "Success":
          {
            const exitWithFinalizer = Exit.succeed([exit.value, release]);
            const completedResult = (0, exports.complete)(_cache.makeMapKey(key), exitWithFinalizer, MutableRef.make(1), _cache.makeEntryStats(now), expiredAt);
            let previousValue = undefined;
            if (MutableHashMap.has(this.cacheState.map, key)) {
              previousValue = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
            }
            MutableHashMap.set(this.cacheState.map, key, completedResult);
            return core.sync(() => core.flatten(core.as(this.cleanMapValue(previousValue), (0, exports.toScoped)(completedResult))));
          }
        case "Failure":
          {
            const completedResult = (0, exports.complete)(_cache.makeMapKey(key), exit, MutableRef.make(0), _cache.makeEntryStats(now), expiredAt);
            let previousValue = undefined;
            if (MutableHashMap.has(this.cacheState.map, key)) {
              previousValue = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key));
            }
            MutableHashMap.set(this.cacheState.map, key, completedResult);
            return core.zipRight(release(exit), core.sync(() => core.flatten(core.as(this.cleanMapValue(previousValue), (0, exports.toScoped)(completedResult)))));
          }
      }
    }), effect.memoize, core.flatten);
  }
  hasExpired(timeToLive) {
    return this.clock.unsafeCurrentTimeMillis() > timeToLive;
  }
  trackHit() {
    this.cacheState.hits = this.cacheState.hits + 1;
  }
  trackMiss() {
    this.cacheState.misses = this.cacheState.misses + 1;
  }
  trackAccess(key) {
    const cleanedKeys = [];
    MutableQueue.offer(this.cacheState.accesses, key);
    if (MutableRef.compareAndSet(this.cacheState.updating, false, true)) {
      let loop = true;
      while (loop) {
        const key = MutableQueue.poll(this.cacheState.accesses, MutableQueue.EmptyMutableQueue);
        if (key === MutableQueue.EmptyMutableQueue) {
          loop = false;
        } else {
          this.cacheState.keys.add(key);
        }
      }
      let size = MutableHashMap.size(this.cacheState.map);
      loop = size > this.capacity;
      while (loop) {
        const key = this.cacheState.keys.remove();
        if (key === undefined) {
          loop = false;
        } else {
          if (MutableHashMap.has(this.cacheState.map, key.current)) {
            const removed = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, key.current));
            MutableHashMap.remove(this.cacheState.map, key.current);
            size = size - 1;
            cleanedKeys.push(removed);
            loop = size > this.capacity;
          }
        }
      }
      MutableRef.set(this.cacheState.updating, false);
    }
    return cleanedKeys;
  }
  cleanMapValue(mapValue) {
    if (mapValue === undefined) {
      return core.unit;
    }
    switch (mapValue._tag) {
      case "Complete":
        {
          return (0, exports.releaseOwner)(mapValue);
        }
      case "Pending":
        {
          return core.unit;
        }
      case "Refreshing":
        {
          return (0, exports.releaseOwner)(mapValue.complete);
        }
    }
  }
  ensureMapSizeNotExceeded(key) {
    return fiberRuntime.forEachParUnboundedDiscard(this.trackAccess(key), cleanedMapValue => this.cleanMapValue(cleanedMapValue), false);
  }
}
/** @internal */
const make = options => {
  const timeToLive = Duration.decode(options.timeToLive);
  return (0, exports.makeWith)({
    capacity: options.capacity,
    lookup: options.lookup,
    timeToLive: () => timeToLive
  });
};
exports.make = make;
/** @internal */
const makeWith = options => core.flatMap(effect.clock, clock => buildWith(options.capacity, options.lookup, clock, exit => Duration.decode(options.timeToLive(exit))));
exports.makeWith = makeWith;
const buildWith = (capacity, scopedLookup, clock, timeToLive) => fiberRuntime.acquireRelease(core.flatMap(core.context(), context => core.sync(() => new ScopedCacheImpl(capacity, scopedLookup, clock, timeToLive, context))), cache => cache.invalidateAll());
//# sourceMappingURL=scopedCache.js.map