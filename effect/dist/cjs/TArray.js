"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSTM = exports.update = exports.transformSTM = exports.transform = exports.toArray = exports.someSTM = exports.some = exports.size = exports.reduceSTM = exports.reduceOptionSTM = exports.reduceOption = exports.reduce = exports.minOption = exports.maxOption = exports.make = exports.lastOption = exports.headOption = exports.get = exports.fromIterable = exports.forEach = exports.findLastSTM = exports.findLastIndexFrom = exports.findLastIndex = exports.findLast = exports.findFirstSTM = exports.findFirstIndexWhereFromSTM = exports.findFirstIndexWhereSTM = exports.findFirstIndexWhereFrom = exports.findFirstIndexWhere = exports.findFirstIndexFrom = exports.findFirstIndex = exports.findFirst = exports.everySTM = exports.every = exports.empty = exports.countSTM = exports.count = exports.contains = exports.collectFirstSTM = exports.collectFirst = exports.TArrayTypeId = void 0;
/**
 * @since 2.0.0
 */
const internal = /*#__PURE__*/require("./internal/stm/tArray.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TArrayTypeId = internal.TArrayTypeId;
/**
 * Finds the result of applying a partial function to the first value in its
 * domain.
 *
 * @since 2.0.0
 * @category elements
 */
exports.collectFirst = internal.collectFirst;
/**
 * Finds the result of applying an transactional partial function to the first
 * value in its domain.
 *
 * @since 2.0.0
 * @category elements
 */
exports.collectFirstSTM = internal.collectFirstSTM;
/**
 * Determine if the array contains a specified value.
 *
 * @macro trace
 * @since 2.0.0
 * @category elements
 */
exports.contains = internal.contains;
/**
 * Count the values in the array matching a predicate.
 *
 * @macro trace
 * @since 2.0.0
 * @category folding
 */
exports.count = internal.count;
/**
 * Count the values in the array matching a transactional predicate.
 *
 * @macro trace
 * @since 2.0.0
 * @category folding
 */
exports.countSTM = internal.countSTM;
/**
 * Makes an empty `TArray`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Atomically evaluate the conjunction of a predicate across the members of
 * the array.
 *
 * @since 2.0.0
 * @category elements
 */
exports.every = internal.every;
/**
 * Atomically evaluate the conjunction of a transactional predicate across the
 * members of the array.
 *
 * @since 2.0.0
 * @category elements
 */
exports.everySTM = internal.everySTM;
/**
 * Find the first element in the array matching the specified predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findFirst = internal.findFirst;
/**
 * Get the first index of a specific value in the array.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findFirstIndex = internal.findFirstIndex;
/**
 * Get the first index of a specific value in the array starting from the
 * specified index.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findFirstIndexFrom = internal.findFirstIndexFrom;
/**
 * Get the index of the first entry in the array matching a predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findFirstIndexWhere = internal.findFirstIndexWhere;
/**
 * Get the index of the first entry in the array starting from the specified
 * index, matching a predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findFirstIndexWhereFrom = internal.findFirstIndexWhereFrom;
/**
 * Get the index of the next entry that matches a transactional predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findFirstIndexWhereSTM = internal.findFirstIndexWhereSTM;
/**
 * Starting at specified index, get the index of the next entry that matches a
 * transactional predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findFirstIndexWhereFromSTM = internal.findFirstIndexWhereFromSTM;
/**
 * Find the first element in the array matching a transactional predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findFirstSTM = internal.findFirstSTM;
/**
 * Find the last element in the array matching a predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findLast = internal.findLast;
/**
 * Get the last index of a specific value in the array bounded above by a
 * specific index.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findLastIndex = internal.findLastIndex;
/**
 * Get the last index of a specific value in the array bounded above by a
 * specific index.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findLastIndexFrom = internal.findLastIndexFrom;
/**
 * Find the last element in the array matching a transactional predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findLastSTM = internal.findLastSTM;
/**
 * Atomically performs transactional effect for each item in array.
 *
 * @since 2.0.0
 * @category elements
 */
exports.forEach = internal.forEach;
/**
 * Makes a new `TArray` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = internal.fromIterable;
/**
 * Extracts value from ref in array.
 *
 * @since 2.0.0
 * @category elements
 */
exports.get = internal.get;
/**
 * The first entry of the array, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
exports.headOption = internal.headOption;
/**
 * The last entry in the array, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
exports.lastOption = internal.lastOption;
/**
 * Makes a new `TArray` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Atomically compute the greatest element in the array, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
exports.maxOption = internal.maxOption;
/**
 * Atomically compute the least element in the array, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
exports.minOption = internal.minOption;
/**
 * Atomically folds using a pure function.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduce = internal.reduce;
/**
 * Atomically reduce the array, if non-empty, by a binary operator.
 *
 * @since 2.0.0
 * @category elements
 */
exports.reduceOption = internal.reduceOption;
/**
 * Atomically reduce the non-empty array using a transactional binary
 * operator.
 *
 * @since 2.0.0
 * @category elements
 */
exports.reduceOptionSTM = internal.reduceOptionSTM;
/**
 * Atomically folds using a transactional function.
 *
 * @macro trace
 * @since 2.0.0
 * @category folding
 */
exports.reduceSTM = internal.reduceSTM;
/**
 * Returns the size of the `TArray`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = internal.size;
/**
 * Determine if the array contains a value satisfying a predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.some = internal.some;
/**
 * Determine if the array contains a value satisfying a transactional
 * predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.someSTM = internal.someSTM;
/**
 * Collects all elements into a chunk.
 *
 * @since 2.0.0
 * @since 2.0.0
 * @category destructors
 */
exports.toArray = internal.toArray;
/**
 * Atomically updates all elements using a pure function.
 *
 * @since 2.0.0
 * @category elements
 */
exports.transform = internal.transform;
/**
 * Atomically updates all elements using a transactional effect.
 *
 * @since 2.0.0
 * @category elements
 */
exports.transformSTM = internal.transformSTM;
/**
 * Updates element in the array with given function.
 *
 * @since 2.0.0
 * @category elements
 */
exports.update = internal.update;
/**
 * Atomically updates element in the array with given transactional effect.
 *
 * @since 2.0.0
 * @category elements
 */
exports.updateSTM = internal.updateSTM;
//# sourceMappingURL=TArray.js.map