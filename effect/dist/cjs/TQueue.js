"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unbounded = exports.takeUpTo = exports.takeN = exports.takeBetween = exports.takeAll = exports.take = exports.sliding = exports.size = exports.shutdown = exports.seek = exports.poll = exports.peekOption = exports.peek = exports.offerAll = exports.offer = exports.isShutdown = exports.isFull = exports.isEmpty = exports.dropping = exports.capacity = exports.bounded = exports.awaitShutdown = exports.isTEnqueue = exports.isTDequeue = exports.isTQueue = exports.TEnqueueTypeId = exports.TDequeueTypeId = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/stm/tQueue.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TDequeueTypeId = internal.TDequeueTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TEnqueueTypeId = internal.TEnqueueTypeId;
/**
 * Returns `true` if the specified value is a `TQueue`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isTQueue = internal.isTQueue;
/**
 * Returns `true` if the specified value is a `TDequeue`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isTDequeue = internal.isTDequeue;
/**
 * Returns `true` if the specified value is a `TEnqueue`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isTEnqueue = internal.isTEnqueue;
/**
 * Waits until the queue is shutdown. The `STM` returned by this method will
 * not resume until the queue has been shutdown. If the queue is already
 * shutdown, the `STM` will resume right away.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.awaitShutdown = internal.awaitShutdown;
/**
 * Creates a bounded queue with the back pressure strategy. The queue will
 * retain values until they have been taken, applying back pressure to
 * offerors if the queue is at capacity.
 *
 * For best performance use capacities that are powers of two.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.bounded = internal.bounded;
/**
 * Returns the number of elements the queue can hold.
 *
 * @since 2.0.0
 * @category getters
 */
exports.capacity = internal.capacity;
/**
 * Creates a bounded queue with the dropping strategy. The queue will drop new
 * values if the queue is at capacity.
 *
 * For best performance use capacities that are powers of two.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dropping = internal.dropping;
/**
 * Returns `true` if the `TQueue` contains zero elements, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isEmpty = internal.isEmpty;
/**
 * Returns `true` if the `TQueue` contains at least one element, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isFull = internal.isFull;
/**
 * Returns `true` if `shutdown` has been called, otherwise returns `false`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isShutdown = internal.isShutdown;
/**
 * Places one value in the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.offer = internal.offer;
/**
 * For Bounded TQueue: uses the `BackPressure` Strategy, places the values in
 * the queue and always returns true. If the queue has reached capacity, then
 * the fiber performing the `offerAll` will be suspended until there is room
 * in the queue.
 *
 * For Unbounded TQueue: Places all values in the queue and returns true.
 *
 * For Sliding TQueue: uses `Sliding` Strategy If there is room in the queue,
 * it places the values otherwise it removes the old elements and enqueues the
 * new ones. Always returns true.
 *
 * For Dropping TQueue: uses `Dropping` Strategy, It places the values in the
 * queue but if there is no room it will not enqueue them and return false.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.offerAll = internal.offerAll;
/**
 * Views the next element in the queue without removing it, retrying if the
 * queue is empty.
 *
 * @since 2.0.0
 * @category getters
 */
exports.peek = internal.peek;
/**
 * Views the next element in the queue without removing it, returning `None`
 * if the queue is empty.
 *
 * @since 2.0.0
 * @category getters
 */
exports.peekOption = internal.peekOption;
/**
 * Takes a single element from the queue, returning `None` if the queue is
 * empty.
 *
 * @since 2.0.0
 * @category getters
 */
exports.poll = internal.poll;
/**
 * Drops elements from the queue while they do not satisfy the predicate,
 * taking and returning the first element that does satisfy the predicate.
 * Retries if no elements satisfy the predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.seek = internal.seek;
/**
 * Interrupts any fibers that are suspended on `offer` or `take`. Future calls
 * to `offer*` and `take*` will be interrupted immediately.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.shutdown = internal.shutdown;
/**
 * Retrieves the size of the queue, which is equal to the number of elements
 * in the queue. This may be negative if fibers are suspended waiting for
 * elements to be added to the queue.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = internal.size;
/**
 * Creates a bounded queue with the sliding strategy. The queue will add new
 * values and drop old values if the queue is at capacity.
 *
 * For best performance use capacities that are powers of two.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sliding = internal.sliding;
/**
 * Takes the oldest value in the queue. If the queue is empty, this will return
 * a computation that resumes when an item has been added to the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.take = internal.take;
/**
 * Takes all the values in the queue and returns the values. If the queue is
 * empty returns an empty collection.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeAll = internal.takeAll;
/**
 * Takes a number of elements from the queue between the specified minimum and
 * maximum. If there are fewer than the minimum number of elements available,
 * retries until at least the minimum number of elements have been collected.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeBetween = internal.takeBetween;
/**
 * Takes the specified number of elements from the queue. If there are fewer
 * than the specified number of elements available, it retries until they
 * become available.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeN = internal.takeN;
/**
 * Takes up to max number of values from the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeUpTo = internal.takeUpTo;
/**
 * Creates an unbounded queue.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unbounded = internal.unbounded;
//# sourceMappingURL=TQueue.js.map