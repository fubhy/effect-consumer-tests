"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFirst = exports.filterMap = exports.compact = exports.filter = exports.reduce = exports.forEach = exports.flatMap = exports.map = exports.removeMany = exports.remove = exports.union = exports.modify = exports.modifyHash = exports.modifyAt = exports.mutate = exports.endMutation = exports.beginMutation = exports.size = exports.values = exports.keySet = exports.keys = exports.set = exports.hasHash = exports.has = exports.unsafeGet = exports.getHash = exports.get = exports.isEmpty = exports.fromIterable = exports.make = exports.empty = exports.isHashMap = void 0;
const HM = /*#__PURE__*/require("./internal/hashMap.js");
const _keySet = /*#__PURE__*/require("./internal/hashMap/keySet.js");
const TypeId = HM.HashMapTypeId;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isHashMap = HM.isHashMap;
/**
 * Creates a new `HashMap`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = HM.empty;
/**
 * Constructs a new `HashMap` from an array of key/value pairs.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = HM.make;
/**
 * Constructs a new `HashMap` from an iterable of key/value pairs.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = HM.fromIterable;
/**
 * Checks if the `HashMap` contains any entries.
 *
 * @since 2.0.0
 * @category elements
 */
exports.isEmpty = HM.isEmpty;
/**
 * Safely lookup the value for the specified key in the `HashMap` using the
 * internal hashing function.
 *
 * @since 2.0.0
 * @category elements
 */
exports.get = HM.get;
/**
 * Lookup the value for the specified key in the `HashMap` using a custom hash.
 *
 * @since 2.0.0
 * @category elements
 */
exports.getHash = HM.getHash;
/**
 * Unsafely lookup the value for the specified key in the `HashMap` using the
 * internal hashing function.
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeGet = HM.unsafeGet;
/**
 * Checks if the specified key has an entry in the `HashMap`.
 *
 * @since 2.0.0
 * @category elements
 */
exports.has = HM.has;
/**
 * Checks if the specified key has an entry in the `HashMap` using a custom
 * hash.
 *
 * @since 2.0.0
 * @category elements
 */
exports.hasHash = HM.hasHash;
/**
 * Sets the specified key to the specified value using the internal hashing
 * function.
 *
 * @since 2.0.0
 */
exports.set = HM.set;
/**
 * Returns an `IterableIterator` of the keys within the `HashMap`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.keys = HM.keys;
/**
 * Returns a `HashSet` of keys within the `HashMap`.
 *
 * @since 2.0.0
 * @category getter
 */
exports.keySet = _keySet.keySet;
/**
 * Returns an `IterableIterator` of the values within the `HashMap`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.values = HM.values;
/**
 * Returns the number of entries within the `HashMap`.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = HM.size;
/**
 * Marks the `HashMap` as mutable.
 *
 * @since 2.0.0
 */
exports.beginMutation = HM.beginMutation;
/**
 * Marks the `HashMap` as immutable.
 *
 * @since 2.0.0
 */
exports.endMutation = HM.endMutation;
/**
 * Mutates the `HashMap` within the context of the provided function.
 *
 * @since 2.0.0
 */
exports.mutate = HM.mutate;
/**
 * Set or remove the specified key in the `HashMap` using the specified
 * update function. The value of the specified key will be computed using the
 * provided hash.
 *
 * The update function will be invoked with the current value of the key if it
 * exists, or `None` if no such value exists.
 *
 * @since 2.0.0
 */
exports.modifyAt = HM.modifyAt;
/**
 * Alter the value of the specified key in the `HashMap` using the specified
 * update function. The value of the specified key will be computed using the
 * provided hash.
 *
 * The update function will be invoked with the current value of the key if it
 * exists, or `None` if no such value exists.
 *
 * This function will always either update or insert a value into the `HashMap`.
 *
 * @since 2.0.0
 */
exports.modifyHash = HM.modifyHash;
/**
 * Updates the value of the specified key within the `HashMap` if it exists.
 *
 * @since 2.0.0
 */
exports.modify = HM.modify;
/**
 * Performs a union of this `HashMap` and that `HashMap`.
 *
 * @since 2.0.0
 */
exports.union = HM.union;
/**
 * Remove the entry for the specified key in the `HashMap` using the internal
 * hashing function.
 *
 * @since 2.0.0
 */
exports.remove = HM.remove;
/**
 * Removes all entries in the `HashMap` which have the specified keys.
 *
 * @since 2.0.0
 */
exports.removeMany = HM.removeMany;
/**
 * Maps over the entries of the `HashMap` using the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = HM.map;
/**
 * Chains over the entries of the `HashMap` using the specified function.
 *
 * **NOTE**: the hash and equal of both maps have to be the same.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = HM.flatMap;
/**
 * Applies the specified function to the entries of the `HashMap`.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.forEach = HM.forEach;
/**
 * Reduces the specified state over the entries of the `HashMap`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduce = HM.reduce;
/**
 * Filters entries out of a `HashMap` using the specified predicate.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filter = HM.filter;
/**
 * Filters out `None` values from a `HashMap` of `Options`s.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.compact = HM.compact;
/**
 * Maps over the entries of the `HashMap` using the specified partial function
 * and filters out `None` values.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterMap = HM.filterMap;
/**
 * Returns the first element that satisfies the specified
 * predicate, or `None` if no such element exists.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findFirst = HM.findFirst;
//# sourceMappingURL=HashMap.js.map