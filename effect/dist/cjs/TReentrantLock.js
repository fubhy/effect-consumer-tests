"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeLocks = exports.writeLocked = exports.writeLock = exports.withWriteLock = exports.withReadLock = exports.withLock = exports.releaseWrite = exports.releaseRead = exports.readLocked = exports.readLocks = exports.readLock = exports.make = exports.locked = exports.lock = exports.fiberWriteLocks = exports.fiberReadLocks = exports.acquireWrite = exports.acquireRead = exports.TReentrantLockTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/stm/tReentrantLock.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TReentrantLockTypeId = internal.TReentrantLockTypeId;
/**
 * Acquires a read lock. The transaction will suspend until no other fiber is
 * holding a write lock. Succeeds with the number of read locks held by this
 * fiber.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.acquireRead = internal.acquireRead;
/**
 * Acquires a write lock. The transaction will suspend until no other fibers
 * are holding read or write locks. Succeeds with the number of write locks
 * held by this fiber.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.acquireWrite = internal.acquireWrite;
/**
 * Retrieves the number of acquired read locks for this fiber.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.fiberReadLocks = internal.fiberReadLocks;
/**
 * Retrieves the number of acquired write locks for this fiber.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.fiberWriteLocks = internal.fiberWriteLocks;
/**
 * Just a convenience method for applications that only need reentrant locks,
 * without needing a distinction between readers / writers.
 *
 * See `TReentrantLock.writeLock`.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.lock = internal.lock;
/**
 * Determines if any fiber has a read or write lock.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.locked = internal.locked;
/**
 * Makes a new reentrant read/write lock.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Obtains a read lock in a scoped context.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.readLock = internal.readLock;
/**
 * Retrieves the total number of acquired read locks.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.readLocks = internal.readLocks;
/**
 * Determines if any fiber has a read lock.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.readLocked = internal.readLocked;
/**
 * Releases a read lock held by this fiber. Succeeds with the outstanding
 * number of read locks held by this fiber.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.releaseRead = internal.releaseRead;
/**
 * Releases a write lock held by this fiber. Succeeds with the outstanding
 * number of write locks held by this fiber.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.releaseWrite = internal.releaseWrite;
/**
 * Runs the specified workflow with a lock.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.withLock = internal.withLock;
/**
 * Runs the specified workflow with a read lock.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.withReadLock = internal.withReadLock;
/**
 * Runs the specified workflow with a write lock.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.withWriteLock = internal.withWriteLock;
/**
 * Obtains a write lock in a scoped context.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.writeLock = internal.writeLock;
/**
 * Determines if a write lock is held by some fiber.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.writeLocked = internal.writeLocked;
/**
 * Computes the number of write locks held by fibers.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.writeLocks = internal.writeLocks;
//# sourceMappingURL=TReentrantLock.js.map