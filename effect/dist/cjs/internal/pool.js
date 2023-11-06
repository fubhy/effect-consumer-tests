"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidate = exports.get = exports.makeWithTTL = exports.make = exports.isPool = exports.PoolTypeId = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const effect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const fiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const queue = /*#__PURE__*/require("./queue.js");
const ref = /*#__PURE__*/require("./ref.js");
/** @internal */
const PoolSymbolKey = "effect/Pool";
/** @internal */
exports.PoolTypeId = /*#__PURE__*/Symbol.for(PoolSymbolKey);
const poolVariance = {
  _E: _ => _,
  _A: _ => _
};
/**
 * A strategy that does nothing to shrink excess items. This is useful when
 * the minimum size of the pool is equal to its maximum size and so there is
 * nothing to do.
 */
class NoneStrategy {
  initial() {
    return core.unit;
  }
  track() {
    return core.unit;
  }
  run() {
    return core.unit;
  }
}
/**
 * A strategy that shrinks the pool down to its minimum size if items in the
 * pool have not been used for the specified duration.
 */
class TimeToLiveStrategy {
  timeToLive;
  constructor(timeToLive) {
    this.timeToLive = timeToLive;
  }
  initial() {
    return core.flatMap(effect.clock, clock => core.flatMap(clock.currentTimeMillis, now => core.map(ref.make(now), ref => [clock, ref])));
  }
  track(state) {
    return core.asUnit(core.flatMap(state[0].currentTimeMillis, now => ref.set(state[1], now)));
  }
  run(state, getExcess, shrink) {
    return core.flatMap(getExcess, excess => excess <= 0 ? core.zipRight(state[0].sleep(this.timeToLive), this.run(state, getExcess, shrink)) : (0, Function_js_1.pipe)(core.zipWith(ref.get(state[1]), state[0].currentTimeMillis, (start, end) => end - start), core.flatMap(duration => {
      if (duration >= Duration.toMillis(this.timeToLive)) {
        return core.zipRight(shrink, this.run(state, getExcess, shrink));
      } else {
        return core.zipRight(state[0].sleep(this.timeToLive), this.run(state, getExcess, shrink));
      }
    })));
  }
}
class PoolImpl {
  creator;
  min;
  max;
  isShuttingDown;
  state;
  items;
  invalidated;
  track;
  [exports.PoolTypeId] = poolVariance;
  constructor(creator, min, max, isShuttingDown, state, items, invalidated, track) {
    this.creator = creator;
    this.min = min;
    this.max = max;
    this.isShuttingDown = isShuttingDown;
    this.state = state;
    this.items = items;
    this.invalidated = invalidated;
    this.track = track;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(this.creator), Hash.combine(Hash.number(this.min)), Hash.combine(Hash.number(this.max)), Hash.combine(Hash.hash(this.isShuttingDown)), Hash.combine(Hash.hash(this.state)), Hash.combine(Hash.hash(this.items)), Hash.combine(Hash.hash(this.invalidated)), Hash.combine(Hash.hash(this.track)));
  }
  [Equal.symbol](that) {
    return (0, exports.isPool)(that) && Equal.equals(this.creator, that.creator) && this.min === that.min && this.max === that.max && Equal.equals(this.isShuttingDown, that.isShuttingDown) && Equal.equals(this.state, that.state) && Equal.equals(this.items, that.items) && Equal.equals(this.invalidated, that.invalidated) && Equal.equals(this.track, that.track);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
  get() {
    const acquire = () => core.flatMap(ref.get(this.isShuttingDown), down => down ? core.interrupt : core.flatten(ref.modify(this.state, state => {
      if (state.free > 0 || state.size >= this.max) {
        return [core.flatMap(queue.take(this.items), attempted => core.exitMatch(attempted.result, {
          onFailure: () => core.succeed(attempted),
          onSuccess: item => core.flatMap(ref.get(this.invalidated), set => {
            if ((0, Function_js_1.pipe)(set, HashSet.has(item))) {
              return core.flatMap(finalizeInvalid(this, attempted), acquire);
            }
            return core.succeed(attempted);
          })
        })), {
          ...state,
          free: state.free - 1
        }];
      }
      if (state.size >= 0) {
        return [core.flatMap(allocate(this), acquire), {
          size: state.size + 1,
          free: state.free + 1
        }];
      }
      return [core.interrupt, state];
    })));
    const release = attempted => core.exitMatch(attempted.result, {
      onFailure: () => core.flatten(ref.modify(this.state, state => {
        if (state.size <= this.min) {
          return [allocate(this), {
            ...state,
            free: state.free + 1
          }];
        }
        return [core.unit, {
          ...state,
          size: state.size - 1
        }];
      })),
      onSuccess: item => core.flatMap(ref.get(this.invalidated), set => {
        if ((0, Function_js_1.pipe)(set, HashSet.has(item))) {
          return finalizeInvalid(this, attempted);
        }
        return (0, Function_js_1.pipe)(ref.update(this.state, state => ({
          ...state,
          free: state.free + 1
        })), core.zipRight(queue.offer(this.items, attempted)), core.zipRight(this.track(attempted.result)), core.zipRight(core.whenEffect(getAndShutdown(this), ref.get(this.isShuttingDown))));
      })
    });
    return (0, Function_js_1.pipe)(fiberRuntime.acquireRelease(acquire(), release), fiberRuntime.withEarlyRelease, fiberRuntime.disconnect, core.flatMap(([release, attempted]) => (0, Function_js_1.pipe)(effect.when(release, () => isFailure(attempted)), core.zipRight(toEffect(attempted)))));
  }
  invalidate(item) {
    return ref.update(this.invalidated, HashSet.add(item));
  }
}
const allocate = self => core.uninterruptibleMask(restore => core.flatMap(fiberRuntime.scopeMake(), scope => core.flatMap(core.exit(restore(fiberRuntime.scopeExtend(self.creator, scope))), exit => core.flatMap(core.succeed({
  result: exit,
  finalizer: core.scopeClose(scope, core.exitSucceed(void 0))
}), attempted => (0, Function_js_1.pipe)(queue.offer(self.items, attempted), core.zipRight(self.track(attempted.result)), core.zipRight(core.whenEffect(getAndShutdown(self), ref.get(self.isShuttingDown))), core.as(attempted))))));
/**
 * Returns the number of items in the pool in excess of the minimum size.
 */
const excess = self => core.map(ref.get(self.state), state => state.size - Math.min(self.min, state.free));
const finalizeInvalid = (self, attempted) => (0, Function_js_1.pipe)(forEach(attempted, a => ref.update(self.invalidated, HashSet.remove(a))), core.zipRight(attempted.finalizer), core.zipRight(core.flatten(ref.modify(self.state, state => {
  if (state.size <= self.min) {
    return [allocate(self), {
      ...state,
      free: state.free + 1
    }];
  }
  return [core.unit, {
    ...state,
    size: state.size - 1
  }];
}))));
/**
 * Gets items from the pool and shuts them down as long as there are items
 * free, signalling shutdown of the pool if the pool is empty.
 */
const getAndShutdown = self => core.flatten(ref.modify(self.state, state => {
  if (state.free > 0) {
    return [core.matchCauseEffect(queue.take(self.items), {
      onFailure: () => core.unit,
      onSuccess: attempted => (0, Function_js_1.pipe)(forEach(attempted, a => ref.update(self.invalidated, HashSet.remove(a))), core.zipRight(attempted.finalizer), core.zipRight(ref.update(self.state, state => ({
        ...state,
        size: state.size - 1
      }))), core.flatMap(() => getAndShutdown(self)))
    }), {
      ...state,
      free: state.free - 1
    }];
  }
  if (state.size > 0) {
    return [core.unit, state];
  }
  return [queue.shutdown(self.items), {
    ...state,
    size: state.size - 1
  }];
}));
/**
 * Begins pre-allocating pool entries based on minimum pool size.
 */
const initialize = self => fiberRuntime.replicateEffect(core.uninterruptibleMask(restore => core.flatten(ref.modify(self.state, state => {
  if (state.size < self.min && state.size >= 0) {
    return [core.flatMap(fiberRuntime.scopeMake(), scope => core.flatMap(core.exit(restore(fiberRuntime.scopeExtend(self.creator, scope))), exit => core.flatMap(core.succeed({
      result: exit,
      finalizer: core.scopeClose(scope, core.exitSucceed(void 0))
    }), attempted => (0, Function_js_1.pipe)(queue.offer(self.items, attempted), core.zipRight(self.track(attempted.result)), core.zipRight(core.whenEffect(getAndShutdown(self), ref.get(self.isShuttingDown))), core.as(attempted))))), {
      size: state.size + 1,
      free: state.free + 1
    }];
  }
  return [core.unit, state];
}))), self.min, {
  discard: true
});
/**
 * Shrinks the pool down, but never to less than the minimum size.
 */
const shrink = self => core.uninterruptible(core.flatten(ref.modify(self.state, state => {
  if (state.size > self.min && state.free > 0) {
    return [(0, Function_js_1.pipe)(queue.take(self.items), core.flatMap(attempted => (0, Function_js_1.pipe)(forEach(attempted, a => ref.update(self.invalidated, HashSet.remove(a))), core.zipRight(attempted.finalizer), core.zipRight(ref.update(self.state, state => ({
      ...state,
      size: state.size - 1
    })))))), {
      ...state,
      free: state.free - 1
    }];
  }
  return [core.unit, state];
})));
const shutdown = self => core.flatten(ref.modify(self.isShuttingDown, down => down ? [queue.awaitShutdown(self.items), true] : [core.zipRight(getAndShutdown(self), queue.awaitShutdown(self.items)), true]));
const isFailure = self => core.exitIsFailure(self.result);
const forEach = (self, f) => core.exitMatch(self.result, {
  onFailure: () => core.unit,
  onSuccess: f
});
const toEffect = self => self.result;
/**
 * A more powerful variant of `make` that allows specifying a `Strategy` that
 * describes how a pool whose excess items are not being used will be shrunk
 * down to the minimum size.
 */
const makeWith = options => core.uninterruptibleMask(restore => (0, Function_js_1.pipe)(fiberRuntime.all([core.context(), ref.make(false), ref.make({
  size: 0,
  free: 0
}), queue.bounded(options.max), ref.make(HashSet.empty()), options.strategy.initial()]), core.flatMap(([context, down, state, items, inv, initial]) => {
  const pool = new PoolImpl(core.mapInputContext(options.acquire, old => Context.merge(old)(context)), options.min, options.max, down, state, items, inv, exit => options.strategy.track(initial, exit));
  return (0, Function_js_1.pipe)(fiberRuntime.forkDaemon(restore(initialize(pool))), core.flatMap(fiber => core.flatMap(fiberRuntime.forkDaemon(restore(options.strategy.run(initial, excess(pool), shrink(pool)))), shrink => fiberRuntime.addFinalizer(() => (0, Function_js_1.pipe)(shutdown(pool), core.zipRight(core.interruptFiber(fiber)), core.zipRight(core.interruptFiber(shrink)))))), core.as(pool));
})));
/** @internal */
const isPool = u => (0, Predicate_js_1.hasProperty)(u, exports.PoolTypeId);
exports.isPool = isPool;
/** @internal */
const make = options => makeWith({
  acquire: options.acquire,
  min: options.size,
  max: options.size,
  strategy: new NoneStrategy()
});
exports.make = make;
/** @internal */
const makeWithTTL = options => makeWith({
  acquire: options.acquire,
  min: options.min,
  max: options.max,
  strategy: new TimeToLiveStrategy(Duration.decode(options.timeToLive))
});
exports.makeWithTTL = makeWithTTL;
/** @internal */
const get = self => self.get();
exports.get = get;
/** @internal */
exports.invalidate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => self.invalidate(value));
//# sourceMappingURL=pool.js.map