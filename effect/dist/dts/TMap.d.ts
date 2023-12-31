import type { LazyArg } from "./Function.js";
import type * as HashMap from "./HashMap.js";
import type * as Option from "./Option.js";
import type * as STM from "./STM.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const TMapTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type TMapTypeId = typeof TMapTypeId;
/**
 * Transactional map implemented on top of `TRef` and `TArray`. Resolves
 * conflicts via chaining.
 *
 * @since 2.0.0
 * @category models
 */
export interface TMap<K, V> extends TMap.Variance<K, V> {
}
/**
 * @since 2.0.0
 */
export declare namespace TMap {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<K, V> {
        readonly [TMapTypeId]: {
            readonly _K: (_: never) => K;
            readonly _V: (_: never) => V;
        };
    }
}
/**
 * Makes an empty `TMap`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const empty: <K, V>() => STM.STM<never, never, TMap<K, V>>;
/**
 * Finds the key/value pair matching the specified predicate, and uses the
 * provided function to extract a value out of it.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const find: {
    <K, V, A>(pf: (key: K, value: V) => Option.Option<A>): (self: TMap<K, V>) => STM.STM<never, never, Option.Option<A>>;
    <K, V, A>(self: TMap<K, V>, pf: (key: K, value: V) => Option.Option<A>): STM.STM<never, never, Option.Option<A>>;
};
/**
 * Finds the key/value pair matching the specified predicate, and uses the
 * provided effectful function to extract a value out of it.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findSTM: {
    <K, V, R, E, A>(f: (key: K, value: V) => STM.STM<R, Option.Option<E>, A>): (self: TMap<K, V>) => STM.STM<R, E, Option.Option<A>>;
    <K, V, R, E, A>(self: TMap<K, V>, f: (key: K, value: V) => STM.STM<R, Option.Option<E>, A>): STM.STM<R, E, Option.Option<A>>;
};
/**
 * Finds all the key/value pairs matching the specified predicate, and uses
 * the provided function to extract values out them.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findAll: {
    <K, V, A>(pf: (key: K, value: V) => Option.Option<A>): (self: TMap<K, V>) => STM.STM<never, never, Array<A>>;
    <K, V, A>(self: TMap<K, V>, pf: (key: K, value: V) => Option.Option<A>): STM.STM<never, never, Array<A>>;
};
/**
 * Finds all the key/value pairs matching the specified predicate, and uses
 * the provided effectful function to extract values out of them..
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findAllSTM: {
    <K, V, R, E, A>(pf: (key: K, value: V) => STM.STM<R, Option.Option<E>, A>): (self: TMap<K, V>) => STM.STM<R, E, Array<A>>;
    <K, V, R, E, A>(self: TMap<K, V>, pf: (key: K, value: V) => STM.STM<R, Option.Option<E>, A>): STM.STM<R, E, Array<A>>;
};
/**
 * Atomically performs transactional-effect for each binding present in map.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const forEach: {
    <K, V, R, E, _>(f: (key: K, value: V) => STM.STM<R, E, _>): (self: TMap<K, V>) => STM.STM<R, E, void>;
    <K, V, R, E, _>(self: TMap<K, V>, f: (key: K, value: V) => STM.STM<R, E, _>): STM.STM<R, E, void>;
};
/**
 * Makes a new `TMap` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromIterable: <K, V>(iterable: Iterable<readonly [K, V]>) => STM.STM<never, never, TMap<K, V>>;
/**
 * Retrieves value associated with given key.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const get: {
    <K>(key: K): <V>(self: TMap<K, V>) => STM.STM<never, never, Option.Option<V>>;
    <K, V>(self: TMap<K, V>, key: K): STM.STM<never, never, Option.Option<V>>;
};
/**
 * Retrieves value associated with given key or default value, in case the key
 * isn't present.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const getOrElse: {
    <K, V>(key: K, fallback: LazyArg<V>): (self: TMap<K, V>) => STM.STM<never, never, V>;
    <K, V>(self: TMap<K, V>, key: K, fallback: LazyArg<V>): STM.STM<never, never, V>;
};
/**
 * Tests whether or not map contains a key.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const has: {
    <K>(key: K): <V>(self: TMap<K, V>) => STM.STM<never, never, boolean>;
    <K, V>(self: TMap<K, V>, key: K): STM.STM<never, never, boolean>;
};
/**
 * Tests if the map is empty or not.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const isEmpty: <K, V>(self: TMap<K, V>) => STM.STM<never, never, boolean>;
/**
 * Collects all keys stored in map.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const keys: <K, V>(self: TMap<K, V>) => STM.STM<never, never, Array<K>>;
/**
 * Makes a new `TMap` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <K, V>(...entries: Array<readonly [K, V]>) => STM.STM<never, never, TMap<K, V>>;
/**
 * If the key is not already associated with a value, stores the provided value,
 * otherwise merge the existing value with the new one using function `f` and
 * store the result.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const merge: {
    <K, V>(key: K, value: V, f: (x: V, y: V) => V): (self: TMap<K, V>) => STM.STM<never, never, V>;
    <K, V>(self: TMap<K, V>, key: K, value: V, f: (x: V, y: V) => V): STM.STM<never, never, V>;
};
/**
 * Atomically folds using a pure function.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduce: {
    <Z, V>(zero: Z, f: (acc: Z, value: V) => Z): <K>(self: TMap<K, V>) => STM.STM<never, never, Z>;
    <K, V, Z>(self: TMap<K, V>, zero: Z, f: (acc: Z, value: V) => Z): STM.STM<never, never, Z>;
};
/**
 * Atomically folds using a transactional function.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduceSTM: {
    <Z, V, R, E>(zero: Z, f: (acc: Z, value: V) => STM.STM<R, E, Z>): <K>(self: TMap<K, V>) => STM.STM<R, E, Z>;
    <K, V, Z, R, E>(self: TMap<K, V>, zero: Z, f: (acc: Z, value: V) => STM.STM<R, E, Z>): STM.STM<R, E, Z>;
};
/**
 * Atomically folds using a pure function.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduceWithIndex: {
    <Z, K, V>(zero: Z, f: (acc: Z, value: V, key: K) => Z): (self: TMap<K, V>) => STM.STM<never, never, Z>;
    <K, V, Z>(self: TMap<K, V>, zero: Z, f: (acc: Z, value: V, key: K) => Z): STM.STM<never, never, Z>;
};
/**
 * Atomically folds using a transactional function.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduceWithIndexSTM: {
    <Z, V, K, R, E>(zero: Z, f: (acc: Z, value: V, key: K) => STM.STM<R, E, Z>): (self: TMap<K, V>) => STM.STM<R, E, Z>;
    <Z, V, K, R, E>(self: TMap<K, V>, zero: Z, f: (acc: Z, value: V, key: K) => STM.STM<R, E, Z>): STM.STM<R, E, Z>;
};
/**
 * Removes binding for given key.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const remove: {
    <K>(key: K): <V>(self: TMap<K, V>) => STM.STM<never, never, void>;
    <K, V>(self: TMap<K, V>, key: K): STM.STM<never, never, void>;
};
/**
 * Deletes all entries associated with the specified keys.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const removeAll: {
    <K>(keys: Iterable<K>): <V>(self: TMap<K, V>) => STM.STM<never, never, void>;
    <K, V>(self: TMap<K, V>, keys: Iterable<K>): STM.STM<never, never, void>;
};
/**
 * Removes bindings matching predicate and returns the removed entries.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const removeIf: {
    <K, V>(predicate: (key: K, value: V) => boolean): (self: TMap<K, V>) => STM.STM<never, never, Array<readonly [K, V]>>;
    <K, V>(self: TMap<K, V>, predicate: (key: K, value: V) => boolean): STM.STM<never, never, Array<readonly [K, V]>>;
};
/**
 * Removes bindings matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const removeIfDiscard: {
    <K, V>(predicate: (key: K, value: V) => boolean): (self: TMap<K, V>) => STM.STM<never, never, void>;
    <K, V>(self: TMap<K, V>, predicate: (key: K, value: V) => boolean): STM.STM<never, never, void>;
};
/**
 * Retains bindings matching predicate and returns removed bindings.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const retainIf: {
    <K, V>(predicate: (key: K, value: V) => boolean): (self: TMap<K, V>) => STM.STM<never, never, Array<readonly [K, V]>>;
    <K, V>(self: TMap<K, V>, predicate: (key: K, value: V) => boolean): STM.STM<never, never, Array<readonly [K, V]>>;
};
/**
 * Retains bindings matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const retainIfDiscard: {
    <K, V>(predicate: (key: K, value: V) => boolean): (self: TMap<K, V>) => STM.STM<never, never, void>;
    <K, V>(self: TMap<K, V>, predicate: (key: K, value: V) => boolean): STM.STM<never, never, void>;
};
/**
 * Stores new binding into the map.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const set: {
    <K, V>(key: K, value: V): (self: TMap<K, V>) => STM.STM<never, never, void>;
    <K, V>(self: TMap<K, V>, key: K, value: V): STM.STM<never, never, void>;
};
/**
 * Stores new binding in the map if it does not already exist.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const setIfAbsent: {
    <K, V>(key: K, value: V): (self: TMap<K, V>) => STM.STM<never, never, void>;
    <K, V>(self: TMap<K, V>, key: K, value: V): STM.STM<never, never, void>;
};
/**
 * Returns the number of bindings.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const size: <K, V>(self: TMap<K, V>) => STM.STM<never, never, number>;
/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const takeFirst: {
    <K, V, A>(pf: (key: K, value: V) => Option.Option<A>): (self: TMap<K, V>) => STM.STM<never, never, A>;
    <K, V, A>(self: TMap<K, V>, pf: (key: K, value: V) => Option.Option<A>): STM.STM<never, never, A>;
};
/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const takeFirstSTM: {
    <K, V, R, E, A>(pf: (key: K, value: V) => STM.STM<R, Option.Option<E>, A>): (self: TMap<K, V>) => STM.STM<R, E, A>;
    <K, V, R, E, A>(self: TMap<K, V>, pf: (key: K, value: V) => STM.STM<R, Option.Option<E>, A>): STM.STM<R, E, A>;
};
/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const takeSome: {
    <K, V, A>(pf: (key: K, value: V) => Option.Option<A>): (self: TMap<K, V>) => STM.STM<never, never, [A, ...Array<A>]>;
    <K, V, A>(self: TMap<K, V>, pf: (key: K, value: V) => Option.Option<A>): STM.STM<never, never, [A, ...Array<A>]>;
};
/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const takeSomeSTM: {
    <K, V, R, E, A>(pf: (key: K, value: V) => STM.STM<R, Option.Option<E>, A>): (self: TMap<K, V>) => STM.STM<R, E, [A, ...Array<A>]>;
    <K, V, R, E, A>(self: TMap<K, V>, pf: (key: K, value: V) => STM.STM<R, Option.Option<E>, A>): STM.STM<R, E, [A, ...Array<A>]>;
};
/**
 * Collects all bindings into a `Chunk`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toChunk: <K, V>(self: TMap<K, V>) => STM.STM<never, never, Array<readonly [K, V]>>;
/**
 * Collects all bindings into a `HashMap`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toHashMap: <K, V>(self: TMap<K, V>) => STM.STM<never, never, HashMap.HashMap<K, V>>;
/**
 * Collects all bindings into a `ReadonlyArray`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toReadonlyArray: <K, V>(self: TMap<K, V>) => STM.STM<never, never, ReadonlyArray<readonly [K, V]>>;
/**
 * Collects all bindings into a `ReadonlyMap`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toReadonlyMap: <K, V>(self: TMap<K, V>) => STM.STM<never, never, ReadonlyMap<K, V>>;
/**
 * Atomically updates all bindings using a pure function.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const transform: {
    <K, V>(f: (key: K, value: V) => readonly [K, V]): (self: TMap<K, V>) => STM.STM<never, never, void>;
    <K, V>(self: TMap<K, V>, f: (key: K, value: V) => readonly [K, V]): STM.STM<never, never, void>;
};
/**
 * Atomically updates all bindings using a transactional function.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const transformSTM: {
    <K, V, R, E>(f: (key: K, value: V) => STM.STM<R, E, readonly [K, V]>): (self: TMap<K, V>) => STM.STM<R, E, void>;
    <K, V, R, E>(self: TMap<K, V>, f: (key: K, value: V) => STM.STM<R, E, readonly [K, V]>): STM.STM<R, E, void>;
};
/**
 * Atomically updates all values using a pure function.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const transformValues: {
    <V>(f: (value: V) => V): <K>(self: TMap<K, V>) => STM.STM<never, never, void>;
    <K, V>(self: TMap<K, V>, f: (value: V) => V): STM.STM<never, never, void>;
};
/**
 * Atomically updates all values using a transactional function.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const transformValuesSTM: {
    <V, R, E>(f: (value: V) => STM.STM<R, E, V>): <K>(self: TMap<K, V>) => STM.STM<R, E, void>;
    <K, V, R, E>(self: TMap<K, V>, f: (value: V) => STM.STM<R, E, V>): STM.STM<R, E, void>;
};
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
export declare const updateWith: {
    <K, V>(key: K, f: (value: Option.Option<V>) => Option.Option<V>): (self: TMap<K, V>) => STM.STM<never, never, Option.Option<V>>;
    <K, V>(self: TMap<K, V>, key: K, f: (value: Option.Option<V>) => Option.Option<V>): STM.STM<never, never, Option.Option<V>>;
};
/**
 * Collects all values stored in map.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const values: <K, V>(self: TMap<K, V>) => STM.STM<never, never, Array<V>>;
//# sourceMappingURL=TMap.d.ts.map