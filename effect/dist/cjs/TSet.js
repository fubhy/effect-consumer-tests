"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.union = exports.transformSTM = exports.transform = exports.toReadonlySet = exports.toReadonlyArray = exports.toHashSet = exports.toChunk = exports.takeSomeSTM = exports.takeSome = exports.takeFirstSTM = exports.takeFirst = exports.size = exports.retainIfDiscard = exports.retainIf = exports.removeIfDiscard = exports.removeIf = exports.removeAll = exports.remove = exports.reduceSTM = exports.reduce = exports.make = exports.isEmpty = exports.intersection = exports.has = exports.fromIterable = exports.forEach = exports.empty = exports.difference = exports.add = exports.TSetTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/stm/tSet.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TSetTypeId = internal.TSetTypeId;
/**
 * Stores new element in the set.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.add = internal.add;
/**
 * Atomically transforms the set into the difference of itself and the
 * provided set.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.difference = internal.difference;
/**
 * Makes an empty `TSet`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Atomically performs transactional-effect for each element in set.
 *
 * @since 2.0.0
 * @category elements
 */
exports.forEach = internal.forEach;
/**
 * Makes a new `TSet` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = internal.fromIterable;
/**
 * Tests whether or not set contains an element.
 *
 * @since 2.0.0
 * @category elements
 */
exports.has = internal.has;
/**
 * Atomically transforms the set into the intersection of itself and the
 * provided set.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.intersection = internal.intersection;
/**
 * Tests if the set is empty or not
 *
 * @since 2.0.0
 * @category getters
 */
exports.isEmpty = internal.isEmpty;
/**
 * Makes a new `TSet` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Atomically folds using a pure function.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduce = internal.reduce;
/**
 * Atomically folds using a transactional function.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduceSTM = internal.reduceSTM;
/**
 * Removes a single element from the set.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.remove = internal.remove;
/**
 * Removes elements from the set.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.removeAll = internal.removeAll;
/**
 * Removes bindings matching predicate and returns the removed entries.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.removeIf = internal.removeIf;
/**
 * Removes elements matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.removeIfDiscard = internal.removeIfDiscard;
/**
 * Retains bindings matching predicate and returns removed bindings.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.retainIf = internal.retainIf;
/**
 * Retains elements matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.retainIfDiscard = internal.retainIfDiscard;
/**
 * Returns the set's cardinality.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = internal.size;
/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeFirst = internal.takeFirst;
/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeFirstSTM = internal.takeFirstSTM;
/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeSome = internal.takeSome;
/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.takeSomeSTM = internal.takeSomeSTM;
/**
 * Collects all elements into a `Chunk`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toChunk = internal.toChunk;
/**
 * Collects all elements into a `HashSet`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toHashSet = internal.toHashSet;
/**
 * Collects all elements into a `ReadonlyArray`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toReadonlyArray = internal.toReadonlyArray;
/**
 * Collects all elements into a `ReadonlySet`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toReadonlySet = internal.toReadonlySet;
/**
 * Atomically updates all elements using a pure function.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.transform = internal.transform;
/**
 * Atomically updates all elements using a transactional function.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.transformSTM = internal.transformSTM;
/**
 * Atomically transforms the set into the union of itself and the provided
 * set.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.union = internal.union;
//# sourceMappingURL=TSet.js.map