"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeLocks = exports.writeLocked = exports.writeLock = exports.withWriteLock = exports.withReadLock = exports.withLock = exports.releaseWrite = exports.releaseRead = exports.readLocked = exports.readLocks = exports.readLock = exports.make = exports.locked = exports.lock = exports.fiberWriteLocks = exports.fiberReadLocks = exports.acquireWrite = exports.acquireRead = exports.WriteLock = exports.ReadLock = exports.TReentrantLockTypeId = void 0;
const Effect = /*#__PURE__*/require("../../Effect.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const FiberId = /*#__PURE__*/require("../../FiberId.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const HashMap = /*#__PURE__*/require("../../HashMap.js");
const Option = /*#__PURE__*/require("../../Option.js");
const core = /*#__PURE__*/require("./core.js");
const tRef = /*#__PURE__*/require("./tRef.js");
const TReentrantLockSymbolKey = "effect/TReentrantLock";
/** @internal */
exports.TReentrantLockTypeId = /*#__PURE__*/Symbol.for(TReentrantLockSymbolKey);
const WriteLockTypeId = /*#__PURE__*/Symbol.for("effect/TReentrantLock/WriteLock");
const ReadLockTypeId = /*#__PURE__*/Symbol.for("effect/TReentrantLock/ReadLock");
class TReentranLockImpl {
  state;
  [exports.TReentrantLockTypeId] = exports.TReentrantLockTypeId;
  constructor(state) {
    this.state = state;
  }
}
/**
 * This data structure describes the state of the lock when multiple fibers
 * have acquired read locks. The state is tracked as a map from fiber identity
 * to number of read locks acquired by the fiber. This level of detail permits
 * upgrading a read lock to a write lock.
 *
 * @internal
 */
class ReadLock {
  readers;
  [ReadLockTypeId] = ReadLockTypeId;
  constructor(readers) {
    this.readers = readers;
  }
  get readLocks() {
    return Array.from(this.readers).reduce((acc, curr) => acc + curr[1], 0);
  }
  get writeLocks() {
    return 0;
  }
  readLocksHeld(fiberId) {
    return Option.getOrElse(HashMap.get(this.readers, fiberId), () => 0);
  }
  writeLocksHeld(_fiberId) {
    return 0;
  }
}
exports.ReadLock = ReadLock;
/**
 * This data structure describes the state of the lock when a single fiber has
 * a write lock. The fiber has an identity, and may also have acquired a
 * certain number of read locks.
 *
 * @internal
 */
class WriteLock {
  readLocks;
  writeLocks;
  fiberId;
  [WriteLockTypeId] = WriteLockTypeId;
  constructor(readLocks, writeLocks, fiberId) {
    this.readLocks = readLocks;
    this.writeLocks = writeLocks;
    this.fiberId = fiberId;
  }
  readLocksHeld(fiberId) {
    return Equal.equals(fiberId)(this.fiberId) ? this.readLocks : 0;
  }
  writeLocksHeld(fiberId) {
    return Equal.equals(fiberId)(this.fiberId) ? this.writeLocks : 0;
  }
}
exports.WriteLock = WriteLock;
const isReadLock = lock => {
  return ReadLockTypeId in lock;
};
const isWriteLock = lock => {
  return WriteLockTypeId in lock;
};
/**
 * An empty read lock state, in which no fiber holds any read locks.
 */
const emptyReadLock = /*#__PURE__*/new ReadLock( /*#__PURE__*/HashMap.empty());
/**
 * Creates a new read lock where the specified fiber holds the specified
 * number of read locks.
 */
const makeReadLock = (fiberId, count) => {
  if (count <= 0) {
    return emptyReadLock;
  }
  return new ReadLock(HashMap.make([fiberId, count]));
};
/**
 * Determines if there is no other holder of read locks aside from the
 * specified fiber id. If there are no other holders of read locks aside
 * from the specified fiber id, then it is safe to upgrade the read lock
 * into a write lock.
 */
const noOtherHolder = (readLock, fiberId) => {
  return HashMap.isEmpty(readLock.readers) || HashMap.size(readLock.readers) === 1 && HashMap.has(readLock.readers, fiberId);
};
/**
 * Adjusts the number of read locks held by the specified fiber id.
 */
const adjustReadLock = (readLock, fiberId, adjustment) => {
  const total = readLock.readLocksHeld(fiberId);
  const newTotal = total + adjustment;
  if (newTotal < 0) {
    throw new Error("BUG - TReentrantLock.ReadLock.adjust - please report an issue at https://github.com/Effect-TS/stm/issues");
  }
  if (newTotal === 0) {
    return new ReadLock(HashMap.remove(readLock.readers, fiberId));
  }
  return new ReadLock(HashMap.set(readLock.readers, fiberId, newTotal));
};
const adjustRead = (self, delta) => core.withSTMRuntime(runtime => {
  const lock = tRef.unsafeGet(self.state, runtime.journal);
  if (isReadLock(lock)) {
    const result = adjustReadLock(lock, runtime.fiberId, delta);
    tRef.unsafeSet(self.state, result, runtime.journal);
    return core.succeed(result.readLocksHeld(runtime.fiberId));
  }
  if (isWriteLock(lock) && Equal.equals(runtime.fiberId)(lock.fiberId)) {
    const newTotal = lock.readLocks + delta;
    if (newTotal < 0) {
      throw new Error(`Defect: Fiber ${FiberId.threadName(runtime.fiberId)} releasing read locks it does not hold, newTotal: ${newTotal}`);
    }
    tRef.unsafeSet(self.state, new WriteLock(newTotal, lock.writeLocks, runtime.fiberId), runtime.journal);
    return core.succeed(newTotal);
  }
  return core.retry;
});
/** @internal */
const acquireRead = self => adjustRead(self, 1);
exports.acquireRead = acquireRead;
/** @internal */
const acquireWrite = self => core.withSTMRuntime(runtime => {
  const lock = tRef.unsafeGet(self.state, runtime.journal);
  if (isReadLock(lock) && noOtherHolder(lock, runtime.fiberId)) {
    tRef.unsafeSet(self.state, new WriteLock(lock.readLocksHeld(runtime.fiberId), 1, runtime.fiberId), runtime.journal);
    return core.succeed(1);
  }
  if (isWriteLock(lock) && Equal.equals(runtime.fiberId)(lock.fiberId)) {
    tRef.unsafeSet(self.state, new WriteLock(lock.readLocks, lock.writeLocks + 1, runtime.fiberId), runtime.journal);
    return core.succeed(lock.writeLocks + 1);
  }
  return core.retry;
});
exports.acquireWrite = acquireWrite;
/** @internal */
const fiberReadLocks = self => core.effect((journal, fiberId) => tRef.unsafeGet(self.state, journal).readLocksHeld(fiberId));
exports.fiberReadLocks = fiberReadLocks;
/** @internal */
const fiberWriteLocks = self => core.effect((journal, fiberId) => tRef.unsafeGet(self.state, journal).writeLocksHeld(fiberId));
exports.fiberWriteLocks = fiberWriteLocks;
/** @internal */
const lock = self => (0, exports.writeLock)(self);
exports.lock = lock;
/** @internal */
const locked = self => core.zipWith((0, exports.readLocked)(self), (0, exports.writeLocked)(self), (x, y) => x || y);
exports.locked = locked;
/** @internal */
exports.make = /*#__PURE__*/core.map( /*#__PURE__*/tRef.make(emptyReadLock), readLock => new TReentranLockImpl(readLock));
/** @internal */
const readLock = self => Effect.acquireRelease(core.commit((0, exports.acquireRead)(self)), () => core.commit((0, exports.releaseRead)(self)));
exports.readLock = readLock;
/** @internal */
const readLocks = self => core.map(tRef.get(self.state), state => state.readLocks);
exports.readLocks = readLocks;
/** @internal */
const readLocked = self => core.map(tRef.get(self.state), state => state.readLocks > 0);
exports.readLocked = readLocked;
/** @internal */
const releaseRead = self => adjustRead(self, -1);
exports.releaseRead = releaseRead;
/** @internal */
const releaseWrite = self => core.withSTMRuntime(runtime => {
  const lock = tRef.unsafeGet(self.state, runtime.journal);
  if (isWriteLock(lock) && lock.writeLocks === 1 && Equal.equals(runtime.fiberId)(lock.fiberId)) {
    const result = makeReadLock(lock.fiberId, lock.readLocks);
    tRef.unsafeSet(self.state, result, runtime.journal);
    return core.succeed(result.writeLocksHeld(runtime.fiberId));
  }
  if (isWriteLock(lock) && Equal.equals(runtime.fiberId)(lock.fiberId)) {
    const result = new WriteLock(lock.readLocks, lock.writeLocks - 1, runtime.fiberId);
    tRef.unsafeSet(self.state, result, runtime.journal);
    return core.succeed(result.writeLocksHeld(runtime.fiberId));
  }
  throw new Error(`Defect: Fiber ${FiberId.threadName(runtime.fiberId)} releasing write lock it does not hold`);
});
exports.releaseWrite = releaseWrite;
/** @internal */
exports.withLock = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, self) => (0, exports.withWriteLock)(effect, self));
/** @internal */
exports.withReadLock = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, self) => Effect.uninterruptibleMask(restore => Effect.zipRight(restore(core.commit((0, exports.acquireRead)(self))), Effect.ensuring(effect, core.commit((0, exports.releaseRead)(self))))));
/** @internal */
exports.withWriteLock = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, self) => Effect.uninterruptibleMask(restore => Effect.zipRight(restore(core.commit((0, exports.acquireWrite)(self))), Effect.ensuring(effect, core.commit((0, exports.releaseWrite)(self))))));
/** @internal */
const writeLock = self => Effect.acquireRelease(core.commit((0, exports.acquireWrite)(self)), () => core.commit((0, exports.releaseWrite)(self)));
exports.writeLock = writeLock;
/** @internal */
const writeLocked = self => core.map(tRef.get(self.state), state => state.writeLocks > 0);
exports.writeLocked = writeLocked;
/** @internal */
const writeLocks = self => core.map(tRef.get(self.state), state => state.writeLocks);
exports.writeLocks = writeLocks;
//# sourceMappingURL=tReentrantLock.js.map