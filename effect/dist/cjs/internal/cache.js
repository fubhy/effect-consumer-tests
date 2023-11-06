"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeMakeWith = exports.makeWith = exports.make = exports.makeEntryStats = exports.makeCacheStats = exports.CacheTypeId = exports.initialCacheState = exports.makeCacheState = exports.makeKeySet = exports.isMapKey = exports.makeMapKey = exports.MapKeyTypeId = exports.refreshing = exports.pending = exports.complete = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Deferred = /*#__PURE__*/require("../Deferred.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Either = /*#__PURE__*/require("../Either.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const MutableHashMap = /*#__PURE__*/require("../MutableHashMap.js");
const MutableQueue = /*#__PURE__*/require("../MutableQueue.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const effect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const Data = /*#__PURE__*/require("./data.js");
const fiberId_js_1 = /*#__PURE__*/require("./fiberId.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
/** @internal */
const complete = (key, exit, entryStats, timeToLiveMillis) => Data.struct({
  _tag: "Complete",
  key,
  exit,
  entryStats,
  timeToLiveMillis
});
exports.complete = complete;
/** @internal */
const pending = (key, deferred) => Data.struct({
  _tag: "Pending",
  key,
  deferred
});
exports.pending = pending;
/** @internal */
const refreshing = (deferred, complete) => Data.struct({
  _tag: "Refreshing",
  deferred,
  complete
});
exports.refreshing = refreshing;
/** @internal */
exports.MapKeyTypeId = /*#__PURE__*/Symbol.for("effect/Cache/MapKey");
class MapKeyImpl {
  current;
  [exports.MapKeyTypeId] = exports.MapKeyTypeId;
  previous = undefined;
  next = undefined;
  constructor(current) {
    this.current = current;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(this.current), Hash.combine(Hash.hash(this.previous)), Hash.combine(Hash.hash(this.next)));
  }
  [Equal.symbol](that) {
    if (this === that) {
      return true;
    }
    return (0, exports.isMapKey)(that) && Equal.equals(this.current, that.current) && Equal.equals(this.previous, that.previous) && Equal.equals(this.next, that.next);
  }
}
/** @internal */
const makeMapKey = current => new MapKeyImpl(current);
exports.makeMapKey = makeMapKey;
/** @internal */
const isMapKey = u => (0, Predicate_js_1.hasProperty)(u, exports.MapKeyTypeId);
exports.isMapKey = isMapKey;
class KeySetImpl {
  head = undefined;
  tail = undefined;
  add(key) {
    if (key !== this.tail) {
      if (this.tail === undefined) {
        this.head = key;
        this.tail = key;
      } else {
        const previous = key.previous;
        const next = key.next;
        if (next !== undefined) {
          key.next = undefined;
          if (previous !== undefined) {
            previous.next = next;
            next.previous = previous;
          } else {
            this.head = next;
            this.head.previous = undefined;
          }
        }
        this.tail.next = key;
        key.previous = this.tail;
        this.tail = key;
      }
    }
  }
  remove() {
    const key = this.head;
    if (key !== undefined) {
      const next = key.next;
      if (next !== undefined) {
        key.next = undefined;
        this.head = next;
        this.head.previous = undefined;
      } else {
        this.head = undefined;
        this.tail = undefined;
      }
    }
    return key;
  }
}
/** @internal */
const makeKeySet = () => new KeySetImpl();
exports.makeKeySet = makeKeySet;
/**
 * Constructs a new `CacheState` from the specified values.
 *
 * @internal
 */
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
const initialCacheState = () => (0, exports.makeCacheState)(MutableHashMap.empty(), (0, exports.makeKeySet)(), MutableQueue.unbounded(), MutableRef.make(false), 0, 0);
exports.initialCacheState = initialCacheState;
/** @internal */
const CacheSymbolKey = "effect/Cache";
/** @internal */
exports.CacheTypeId = /*#__PURE__*/Symbol.for(CacheSymbolKey);
const cacheVariance = {
  _Key: _ => _,
  _Error: _ => _,
  _Value: _ => _
};
/** @internal */
const makeCacheStats = options => options;
exports.makeCacheStats = makeCacheStats;
/** @internal */
const makeEntryStats = loadedMillis => ({
  loadedMillis
});
exports.makeEntryStats = makeEntryStats;
class CacheImpl {
  capacity;
  context;
  fiberId;
  lookup;
  timeToLive;
  [exports.CacheTypeId] = cacheVariance;
  cacheState;
  constructor(capacity, context, fiberId, lookup, timeToLive) {
    this.capacity = capacity;
    this.context = context;
    this.fiberId = fiberId;
    this.lookup = lookup;
    this.timeToLive = timeToLive;
    this.cacheState = (0, exports.initialCacheState)();
  }
  get(key) {
    return core.map(this.getEither(key), Either.merge);
  }
  cacheStats() {
    return core.sync(() => (0, exports.makeCacheStats)({
      hits: this.cacheState.hits,
      misses: this.cacheState.misses,
      size: MutableHashMap.size(this.cacheState.map)
    }));
  }
  getOption(key) {
    return core.suspend(() => Option.match(MutableHashMap.get(this.cacheState.map, key), {
      onNone: () => {
        const mapKey = (0, exports.makeMapKey)(key);
        this.trackAccess(mapKey);
        this.trackMiss();
        return core.succeed(Option.none());
      },
      onSome: value => this.resolveMapValue(value)
    }));
  }
  getOptionComplete(key) {
    return core.suspend(() => Option.match(MutableHashMap.get(this.cacheState.map, key), {
      onNone: () => {
        const mapKey = (0, exports.makeMapKey)(key);
        this.trackAccess(mapKey);
        this.trackMiss();
        return core.succeed(Option.none());
      },
      onSome: value => this.resolveMapValue(value, true)
    }));
  }
  contains(key) {
    return core.sync(() => MutableHashMap.has(this.cacheState.map, key));
  }
  entryStats(key) {
    return core.sync(() => {
      const option = MutableHashMap.get(this.cacheState.map, key);
      if (Option.isSome(option)) {
        switch (option.value._tag) {
          case "Complete":
            {
              const loaded = option.value.entryStats.loadedMillis;
              return Option.some((0, exports.makeEntryStats)(loaded));
            }
          case "Pending":
            {
              return Option.none();
            }
          case "Refreshing":
            {
              const loaded = option.value.complete.entryStats.loadedMillis;
              return Option.some((0, exports.makeEntryStats)(loaded));
            }
        }
      }
      return Option.none();
    });
  }
  getEither(key) {
    return core.suspend(() => {
      const k = key;
      let mapKey = undefined;
      let deferred = undefined;
      let value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, k));
      if (value === undefined) {
        deferred = Deferred.unsafeMake(this.fiberId);
        mapKey = (0, exports.makeMapKey)(k);
        if (MutableHashMap.has(this.cacheState.map, k)) {
          value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, k));
        } else {
          MutableHashMap.set(this.cacheState.map, k, (0, exports.pending)(mapKey, deferred));
        }
      }
      if (value === undefined) {
        this.trackAccess(mapKey);
        this.trackMiss();
        return core.map(this.lookupValueOf(key, deferred), Either.right);
      } else {
        return core.flatMap(this.resolveMapValue(value), Option.match({
          onNone: () => this.getEither(key),
          onSome: value => core.succeed(Either.left(value))
        }));
      }
    });
  }
  invalidate(key) {
    return core.sync(() => {
      MutableHashMap.remove(this.cacheState.map, key);
    });
  }
  invalidateWhen(key, when) {
    return core.sync(() => {
      const value = MutableHashMap.get(this.cacheState.map, key);
      if (Option.isSome(value) && value.value._tag === "Complete") {
        if (value.value.exit._tag === "Success") {
          if (when(value.value.exit.value)) {
            MutableHashMap.remove(this.cacheState.map, key);
          }
        }
      }
    });
  }
  invalidateAll() {
    return core.sync(() => {
      this.cacheState.map = MutableHashMap.empty();
    });
  }
  refresh(key) {
    return effect.clockWith(clock => core.suspend(() => {
      const k = key;
      const deferred = Deferred.unsafeMake(this.fiberId);
      let value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, k));
      if (value === undefined) {
        if (MutableHashMap.has(this.cacheState.map, k)) {
          value = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, k));
        } else {
          MutableHashMap.set(this.cacheState.map, k, (0, exports.pending)((0, exports.makeMapKey)(k), deferred));
        }
      }
      if (value === undefined) {
        return core.asUnit(this.lookupValueOf(key, deferred));
      } else {
        switch (value._tag) {
          case "Complete":
            {
              if (this.hasExpired(clock, value.timeToLiveMillis)) {
                const found = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, k));
                if (Equal.equals(found, value)) {
                  MutableHashMap.remove(this.cacheState.map, k);
                }
                return core.asUnit(this.get(key));
              }
              // Only trigger the lookup if we're still the current value, `completedResult`
              return (0, Function_js_1.pipe)(this.lookupValueOf(key, deferred), effect.when(() => {
                const current = Option.getOrUndefined(MutableHashMap.get(this.cacheState.map, k));
                if (Equal.equals(current, value)) {
                  const mapValue = (0, exports.refreshing)(deferred, value);
                  MutableHashMap.set(this.cacheState.map, k, mapValue);
                  return true;
                }
                return false;
              }), core.asUnit);
            }
          case "Pending":
            {
              return Deferred.await(value.deferred);
            }
          case "Refreshing":
            {
              return Deferred.await(value.deferred);
            }
        }
      }
    }));
  }
  set(key, value) {
    return effect.clockWith(clock => core.sync(() => {
      const now = clock.unsafeCurrentTimeMillis();
      const k = key;
      const lookupResult = Exit.succeed(value);
      const mapValue = (0, exports.complete)((0, exports.makeMapKey)(k), lookupResult, (0, exports.makeEntryStats)(now), now + Duration.toMillis(Duration.decode(this.timeToLive(lookupResult))));
      MutableHashMap.set(this.cacheState.map, k, mapValue);
    }));
  }
  size() {
    return core.sync(() => {
      return MutableHashMap.size(this.cacheState.map);
    });
  }
  values() {
    return core.sync(() => {
      const values = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          values.push(entry[1].exit.value);
        }
      }
      return values;
    });
  }
  entries() {
    return core.sync(() => {
      const values = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          values.push([entry[0], entry[1].exit.value]);
        }
      }
      return values;
    });
  }
  keys() {
    return core.sync(() => {
      const keys = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          keys.push(entry[0]);
        }
      }
      return keys;
    });
  }
  resolveMapValue(value, ignorePending = false) {
    return effect.clockWith(clock => {
      switch (value._tag) {
        case "Complete":
          {
            this.trackAccess(value.key);
            this.trackHit();
            if (this.hasExpired(clock, value.timeToLiveMillis)) {
              MutableHashMap.remove(this.cacheState.map, value.key.current);
              return core.succeed(Option.none());
            }
            return core.map(value.exit, Option.some);
          }
        case "Pending":
          {
            this.trackAccess(value.key);
            this.trackHit();
            if (ignorePending) {
              return core.succeed(Option.none());
            }
            return core.map(Deferred.await(value.deferred), Option.some);
          }
        case "Refreshing":
          {
            this.trackAccess(value.complete.key);
            this.trackHit();
            if (this.hasExpired(clock, value.complete.timeToLiveMillis)) {
              if (ignorePending) {
                return core.succeed(Option.none());
              }
              return core.map(Deferred.await(value.deferred), Option.some);
            }
            return core.map(value.complete.exit, Option.some);
          }
      }
    });
  }
  trackHit() {
    this.cacheState.hits = this.cacheState.hits + 1;
  }
  trackMiss() {
    this.cacheState.misses = this.cacheState.misses + 1;
  }
  trackAccess(key) {
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
        if (key !== undefined) {
          if (MutableHashMap.has(this.cacheState.map, key.current)) {
            MutableHashMap.remove(this.cacheState.map, key.current);
            size = size - 1;
            loop = size > this.capacity;
          }
        } else {
          loop = false;
        }
      }
      MutableRef.set(this.cacheState.updating, false);
    }
  }
  hasExpired(clock, timeToLiveMillis) {
    return clock.unsafeCurrentTimeMillis() > timeToLiveMillis;
  }
  lookupValueOf(input, deferred) {
    return effect.clockWith(clock => core.suspend(() => {
      const key = input;
      return (0, Function_js_1.pipe)(this.lookup(input), core.provideContext(this.context), core.exit, core.flatMap(exit => {
        const now = clock.unsafeCurrentTimeMillis();
        const stats = (0, exports.makeEntryStats)(now);
        const value = (0, exports.complete)((0, exports.makeMapKey)(key), exit, stats, now + Duration.toMillis(Duration.decode(this.timeToLive(exit))));
        MutableHashMap.set(this.cacheState.map, key, value);
        return core.zipRight(Deferred.done(deferred, exit), exit);
      }), core.onInterrupt(() => core.zipRight(Deferred.interrupt(deferred), core.sync(() => {
        MutableHashMap.remove(this.cacheState.map, key);
      }))));
    }));
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
const makeWith = options => core.map(fiberRuntime.all([core.context(), core.fiberId]), ([context, fiberId]) => new CacheImpl(options.capacity, context, fiberId, options.lookup, exit => Duration.decode(options.timeToLive(exit))));
exports.makeWith = makeWith;
/** @internal */
const unsafeMakeWith = (capacity, lookup, timeToLive) => new CacheImpl(capacity, Context.empty(), fiberId_js_1.none, lookup, exit => Duration.decode(timeToLive(exit)));
exports.unsafeMakeWith = unsafeMakeWith;
//# sourceMappingURL=cache.js.map