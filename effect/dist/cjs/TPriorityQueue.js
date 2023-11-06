"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toReadonlyArray = exports.toArray = exports.takeUpTo = exports.takeOption = exports.takeAll = exports.take = exports.size = exports.retainIf = exports.removeIf = exports.peekOption = exports.peek = exports.offerAll = exports.offer = exports.make = exports.isNonEmpty = exports.isEmpty = exports.fromIterable = exports.empty = exports.TPriorityQueueTypeId = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/stm/tPriorityQueue.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TPriorityQueueTypeId = internal.TPriorityQueueTypeId;
/**
 * Constructs a new empty `TPriorityQueue` with the specified `Order`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Makes a new `TPriorityQueue` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = internal.fromIterable;
/**
 * Checks whether the queue is empty.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isEmpty = internal.isEmpty;
/**
 * Checks whether the queue is not empty.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isNonEmpty = internal.isNonEmpty;
/**
 * Makes a new `TPriorityQueue` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Offers the specified value to the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.offer = internal.offer;
/**
 * Offers all of the elements in the specified collection to the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.offerAll = internal.offerAll;
/**
 * Peeks at the first value in the queue without removing it, retrying until a
 * value is in the queue.
 *
 * @since 2.0.0
 * @category getters
 */
exports.peek = internal.peek;
/**
 * Peeks at the first value in the queue without removing it, returning `None`
 * if there is not a value in the queue.
 *
 * @since 2.0.0
 * @category getters
 */
exports.peekOption = internal.peekOption;
/**
 * Removes all elements from the queue matching the specified predicate.
 *
 * @since 2.0.0
 * @category getters
 */
exports.removeIf = internal.removeIf;
/**
 * Retains only elements from the queue matching the specified predicate.
 *
 * @since 2.0.0
 * @category getters
 */
exports.retainIf = internal.retainIf;
/**
 * Returns the size of the queue.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = internal.size;
/**
 * Takes a value from the queue, retrying until a value is in the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.take = internal.take;
/**
 * Takes all values from the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeAll = internal.takeAll;
/**
 * Takes a value from the queue, returning `None` if there is not a value in
 * the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeOption = internal.takeOption;
/**
 * Takes up to the specified maximum number of elements from the queue.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeUpTo = internal.takeUpTo;
/**
 * Collects all values into a chunk.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toArray = internal.toChunk;
/**
 * Collects all values into an array.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toReadonlyArray = internal.toReadonlyArray;
//# sourceMappingURL=TPriorityQueue.js.map