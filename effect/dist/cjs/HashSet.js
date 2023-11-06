"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partition = exports.filter = exports.reduce = exports.forEach = exports.flatMap = exports.map = exports.toggle = exports.union = exports.intersection = exports.difference = exports.remove = exports.add = exports.mutate = exports.endMutation = exports.beginMutation = exports.size = exports.values = exports.isSubset = exports.every = exports.some = exports.has = exports.make = exports.fromIterable = exports.empty = exports.isHashSet = void 0;
const HS = /*#__PURE__*/require("./internal/hashSet.js");
const TypeId = HS.HashSetTypeId;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isHashSet = HS.isHashSet;
/**
 * Creates an empty `HashSet`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = HS.empty;
/**
 * Construct a new `HashSet` from a `Collection` of values
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = HS.fromIterable;
/**
 * Construct a new `HashSet` from a variable number of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = HS.make;
/**
 * Checks if the specified value exists in the `HashSet`.
 *
 * @since 2.0.0
 * @category elements
 */
exports.has = HS.has;
/**
 * Check if a predicate holds true for some `HashSet` element.
 *
 * @since 2.0.0
 * @category elements
 */
exports.some = HS.some;
/**
 * Check if a predicate holds true for every `HashSet` element.
 *
 * @since 2.0.0
 * @category elements
 */
exports.every = HS.every;
/**
 * Returns `true` if and only if every element in the this `HashSet` is an
 * element of the second set,
 *
 * **NOTE**: the hash and equal of both sets must be the same.
 *
 * @since 2.0.0
 * @category elements
 */
exports.isSubset = HS.isSubset;
/**
 * Returns an `IterableIterator` of the values in the `HashSet`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.values = HS.values;
/**
 * Calculates the number of values in the `HashSet`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = HS.size;
/**
 * Marks the `HashSet` as mutable.
 *
 * @since 2.0.0
 */
exports.beginMutation = HS.beginMutation;
/**
 * Marks the `HashSet` as immutable.
 *
 * @since 2.0.0
 */
exports.endMutation = HS.endMutation;
/**
 * Mutates the `HashSet` within the context of the provided function.
 *
 * @since 2.0.0
 */
exports.mutate = HS.mutate;
/**
 * Adds a value to the `HashSet`.
 *
 * @since 2.0.0
 */
exports.add = HS.add;
/**
 * Removes a value from the `HashSet`.
 *
 * @since 2.0.0
 */
exports.remove = HS.remove;
/**
 * Computes the set difference between this `HashSet` and the specified
 * `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 2.0.0
 */
exports.difference = HS.difference;
/**
 * Returns a `HashSet` of values which are present in both this set and that
 * `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 2.0.0
 */
exports.intersection = HS.intersection;
/**
 * Computes the set union `(`self` + `that`)` between this `HashSet` and the
 * specified `Iterable<A>`.
 *
 * **NOTE**: the hash and equal of the values in both the set and the iterable
 * must be the same.
 *
 * @since 2.0.0
 */
exports.union = HS.union;
/**
 * Checks if a value is present in the `HashSet`. If it is present, the value
 * will be removed from the `HashSet`, otherwise the value will be added to the
 * `HashSet`.
 *
 * @since 2.0.0
 */
exports.toggle = HS.toggle;
/**
 * Maps over the values of the `HashSet` using the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = HS.map;
/**
 * Chains over the values of the `HashSet` using the specified function.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = HS.flatMap;
/**
 * Applies the specified function to the values of the `HashSet`.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.forEach = HS.forEach;
/**
 * Reduces the specified state over the values of the `HashSet`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduce = HS.reduce;
/**
 * Filters values out of a `HashSet` using the specified predicate.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filter = HS.filter;
/**
 * Partition the values of a `HashSet` using the specified predicate.
 *
 * If a value matches the predicate, it will be placed into the `HashSet` on the
 * right side of the resulting `Tuple`, otherwise the value will be placed into
 * the left side.
 *
 * @since 2.0.0
 * @category partitioning
 */
exports.partition = HS.partition;
//# sourceMappingURL=HashSet.js.map