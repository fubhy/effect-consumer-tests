import * as internal from "./internal/stm/tSet.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export const TSetTypeId = internal.TSetTypeId;
/**
 * Stores new element in the set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const add = internal.add;
/**
 * Atomically transforms the set into the difference of itself and the
 * provided set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const difference = internal.difference;
/**
 * Makes an empty `TSet`.
 *
 * @since 2.0.0
 * @category constructors
 */
export const empty = internal.empty;
/**
 * Atomically performs transactional-effect for each element in set.
 *
 * @since 2.0.0
 * @category elements
 */
export const forEach = internal.forEach;
/**
 * Makes a new `TSet` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
export const fromIterable = internal.fromIterable;
/**
 * Tests whether or not set contains an element.
 *
 * @since 2.0.0
 * @category elements
 */
export const has = internal.has;
/**
 * Atomically transforms the set into the intersection of itself and the
 * provided set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const intersection = internal.intersection;
/**
 * Tests if the set is empty or not
 *
 * @since 2.0.0
 * @category getters
 */
export const isEmpty = internal.isEmpty;
/**
 * Makes a new `TSet` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
export const make = internal.make;
/**
 * Atomically folds using a pure function.
 *
 * @since 2.0.0
 * @category folding
 */
export const reduce = internal.reduce;
/**
 * Atomically folds using a transactional function.
 *
 * @since 2.0.0
 * @category folding
 */
export const reduceSTM = internal.reduceSTM;
/**
 * Removes a single element from the set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const remove = internal.remove;
/**
 * Removes elements from the set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const removeAll = internal.removeAll;
/**
 * Removes bindings matching predicate and returns the removed entries.
 *
 * @since 2.0.0
 * @category mutations
 */
export const removeIf = internal.removeIf;
/**
 * Removes elements matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
export const removeIfDiscard = internal.removeIfDiscard;
/**
 * Retains bindings matching predicate and returns removed bindings.
 *
 * @since 2.0.0
 * @category mutations
 */
export const retainIf = internal.retainIf;
/**
 * Retains elements matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
export const retainIfDiscard = internal.retainIfDiscard;
/**
 * Returns the set's cardinality.
 *
 * @since 2.0.0
 * @category getters
 */
export const size = internal.size;
/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeFirst = internal.takeFirst;
/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeFirstSTM = internal.takeFirstSTM;
/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeSome = internal.takeSome;
/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeSomeSTM = internal.takeSomeSTM;
/**
 * Collects all elements into a `Chunk`.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toChunk = internal.toChunk;
/**
 * Collects all elements into a `HashSet`.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toHashSet = internal.toHashSet;
/**
 * Collects all elements into a `ReadonlyArray`.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toReadonlyArray = internal.toReadonlyArray;
/**
 * Collects all elements into a `ReadonlySet`.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toReadonlySet = internal.toReadonlySet;
/**
 * Atomically updates all elements using a pure function.
 *
 * @since 2.0.0
 * @category mutations
 */
export const transform = internal.transform;
/**
 * Atomically updates all elements using a transactional function.
 *
 * @since 2.0.0
 * @category mutations
 */
export const transformSTM = internal.transformSTM;
/**
 * Atomically transforms the set into the union of itself and the provided
 * set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const union = internal.union;
//# sourceMappingURL=TSet.js.map