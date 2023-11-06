"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.values = exports.updateWith = exports.transformValuesSTM = exports.transformValues = exports.transformSTM = exports.transform = exports.toReadonlyMap = exports.toReadonlyArray = exports.toHashMap = exports.toChunk = exports.takeSomeSTM = exports.takeSome = exports.takeFirstSTM = exports.takeFirst = exports.size = exports.setIfAbsent = exports.set = exports.retainIfDiscard = exports.retainIf = exports.removeIfDiscard = exports.removeIf = exports.removeAll = exports.remove = exports.reduceWithIndexSTM = exports.reduceWithIndex = exports.reduceSTM = exports.reduce = exports.merge = exports.make = exports.keys = exports.isEmpty = exports.has = exports.getOrElse = exports.get = exports.fromIterable = exports.forEach = exports.findAllSTM = exports.findAll = exports.findSTM = exports.find = exports.empty = exports.TMapTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/stm/tMap.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.TMapTypeId = internal.TMapTypeId;
/**
 * Makes an empty `TMap`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Finds the key/value pair matching the specified predicate, and uses the
 * provided function to extract a value out of it.
 *
 * @since 2.0.0
 * @category elements
 */
exports.find = internal.find;
/**
 * Finds the key/value pair matching the specified predicate, and uses the
 * provided effectful function to extract a value out of it.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findSTM = internal.findSTM;
/**
 * Finds all the key/value pairs matching the specified predicate, and uses
 * the provided function to extract values out them.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findAll = internal.findAll;
/**
 * Finds all the key/value pairs matching the specified predicate, and uses
 * the provided effectful function to extract values out of them..
 *
 * @since 2.0.0
 * @category elements
 */
exports.findAllSTM = internal.findAllSTM;
/**
 * Atomically performs transactional-effect for each binding present in map.
 *
 * @since 2.0.0
 * @category elements
 */
exports.forEach = internal.forEach;
/**
 * Makes a new `TMap` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = internal.fromIterable;
/**
 * Retrieves value associated with given key.
 *
 * @since 2.0.0
 * @category elements
 */
exports.get = internal.get;
/**
 * Retrieves value associated with given key or default value, in case the key
 * isn't present.
 *
 * @since 2.0.0
 * @category elements
 */
exports.getOrElse = internal.getOrElse;
/**
 * Tests whether or not map contains a key.
 *
 * @since 2.0.0
 * @category elements
 */
exports.has = internal.has;
/**
 * Tests if the map is empty or not.
 *
 * @since 2.0.0
 * @category getters
 */
exports.isEmpty = internal.isEmpty;
/**
 * Collects all keys stored in map.
 *
 * @since 2.0.0
 * @category elements
 */
exports.keys = internal.keys;
/**
 * Makes a new `TMap` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * If the key is not already associated with a value, stores the provided value,
 * otherwise merge the existing value with the new one using function `f` and
 * store the result.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.merge = internal.merge;
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
 * Atomically folds using a pure function.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduceWithIndex = internal.reduceWithIndex;
/**
 * Atomically folds using a transactional function.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduceWithIndexSTM = internal.reduceWithIndexSTM;
/**
 * Removes binding for given key.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.remove = internal.remove;
/**
 * Deletes all entries associated with the specified keys.
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
 * Removes bindings matching predicate.
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
 * Retains bindings matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.retainIfDiscard = internal.retainIfDiscard;
/**
 * Stores new binding into the map.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.set = internal.set;
/**
 * Stores new binding in the map if it does not already exist.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.setIfAbsent = internal.setIfAbsent;
/**
 * Returns the number of bindings.
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
 * Collects all bindings into a `Chunk`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toChunk = internal.toArray;
/**
 * Collects all bindings into a `HashMap`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toHashMap = internal.toHashMap;
/**
 * Collects all bindings into a `ReadonlyArray`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toReadonlyArray = internal.toReadonlyArray;
/**
 * Collects all bindings into a `ReadonlyMap`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toReadonlyMap = internal.toReadonlyMap;
/**
 * Atomically updates all bindings using a pure function.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.transform = internal.transform;
/**
 * Atomically updates all bindings using a transactional function.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.transformSTM = internal.transformSTM;
/**
 * Atomically updates all values using a pure function.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.transformValues = internal.transformValues;
/**
 * Atomically updates all values using a transactional function.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.transformValuesSTM = internal.transformValuesSTM;
/**
 * Updates the mapping for the specified key with the specified function,
 * which takes the current value of the key as an input, if it exists, and
 * either returns `Some` with a new value to indicate to update the value in
 * the map or `None` to remove the value from the map. Returns `Some` with the
 * updated value or `None` if the value was removed from the map.
 *
 * @since 2.0.0
 * @category mutations
 */
exports.updateWith = internal.updateWith;
/**
 * Collects all values stored in map.
 *
 * @since 2.0.0
 * @category elements
 */
exports.values = internal.values;
//# sourceMappingURL=TMap.js.map