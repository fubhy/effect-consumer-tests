/**
 * @since 2.0.0
 */
import type * as HashSet from "./HashSet.js";
import type * as Option from "./Option.js";
import type { Predicate } from "./Predicate.js";
import type * as STM from "./STM.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const TSetTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type TSetTypeId = typeof TSetTypeId;
/**
 * Transactional set implemented on top of `TMap`.
 *
 * @since 2.0.0
 * @category models
 */
export interface TSet<A> extends TSet.Variance<A> {
}
/**
 * @since 2.0.0
 */
export declare namespace TSet {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<A> {
        readonly [TSetTypeId]: {
            readonly _A: (_: never) => A;
        };
    }
}
/**
 * Stores new element in the set.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const add: {
    <A>(value: A): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, value: A): STM.STM<never, never, void>;
};
/**
 * Atomically transforms the set into the difference of itself and the
 * provided set.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const difference: {
    <A>(other: TSet<A>): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, other: TSet<A>): STM.STM<never, never, void>;
};
/**
 * Makes an empty `TSet`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const empty: <A>() => STM.STM<never, never, TSet<A>>;
/**
 * Atomically performs transactional-effect for each element in set.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const forEach: {
    <A, R, E>(f: (value: A) => STM.STM<R, E, void>): (self: TSet<A>) => STM.STM<R, E, void>;
    <A, R, E>(self: TSet<A>, f: (value: A) => STM.STM<R, E, void>): STM.STM<R, E, void>;
};
/**
 * Makes a new `TSet` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromIterable: <A>(iterable: Iterable<A>) => STM.STM<never, never, TSet<A>>;
/**
 * Tests whether or not set contains an element.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const has: {
    <A>(value: A): (self: TSet<A>) => STM.STM<never, never, boolean>;
    <A>(self: TSet<A>, value: A): STM.STM<never, never, boolean>;
};
/**
 * Atomically transforms the set into the intersection of itself and the
 * provided set.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const intersection: {
    <A>(other: TSet<A>): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, other: TSet<A>): STM.STM<never, never, void>;
};
/**
 * Tests if the set is empty or not
 *
 * @since 2.0.0
 * @category getters
 */
export declare const isEmpty: <A>(self: TSet<A>) => STM.STM<never, never, boolean>;
/**
 * Makes a new `TSet` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <Elements extends Array<any>>(...elements: Elements) => STM.STM<never, never, TSet<Elements[number]>>;
/**
 * Atomically folds using a pure function.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduce: {
    <Z, A>(zero: Z, f: (accumulator: Z, value: A) => Z): (self: TSet<A>) => STM.STM<never, never, Z>;
    <Z, A>(self: TSet<A>, zero: Z, f: (accumulator: Z, value: A) => Z): STM.STM<never, never, Z>;
};
/**
 * Atomically folds using a transactional function.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduceSTM: {
    <Z, A, R, E>(zero: Z, f: (accumulator: Z, value: A) => STM.STM<R, E, Z>): (self: TSet<A>) => STM.STM<R, E, Z>;
    <Z, A, R, E>(self: TSet<A>, zero: Z, f: (accumulator: Z, value: A) => STM.STM<R, E, Z>): STM.STM<R, E, Z>;
};
/**
 * Removes a single element from the set.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const remove: {
    <A>(value: A): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, value: A): STM.STM<never, never, void>;
};
/**
 * Removes elements from the set.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const removeAll: {
    <A>(iterable: Iterable<A>): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, iterable: Iterable<A>): STM.STM<never, never, void>;
};
/**
 * Removes bindings matching predicate and returns the removed entries.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const removeIf: {
    <A>(predicate: Predicate<A>): (self: TSet<A>) => STM.STM<never, never, Array<A>>;
    <A>(self: TSet<A>, predicate: Predicate<A>): STM.STM<never, never, Array<A>>;
};
/**
 * Removes elements matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const removeIfDiscard: {
    <A>(predicate: Predicate<A>): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, predicate: Predicate<A>): STM.STM<never, never, void>;
};
/**
 * Retains bindings matching predicate and returns removed bindings.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const retainIf: {
    <A>(predicate: Predicate<A>): (self: TSet<A>) => STM.STM<never, never, Array<A>>;
    <A>(self: TSet<A>, predicate: Predicate<A>): STM.STM<never, never, Array<A>>;
};
/**
 * Retains elements matching predicate.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const retainIfDiscard: {
    <A>(predicate: Predicate<A>): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, predicate: Predicate<A>): STM.STM<never, never, void>;
};
/**
 * Returns the set's cardinality.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const size: <A>(self: TSet<A>) => STM.STM<never, never, number>;
/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const takeFirst: {
    <A, B>(pf: (a: A) => Option.Option<B>): (self: TSet<A>) => STM.STM<never, never, B>;
    <A, B>(self: TSet<A>, pf: (a: A) => Option.Option<B>): STM.STM<never, never, B>;
};
/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const takeFirstSTM: {
    <A, R, E, B>(pf: (a: A) => STM.STM<R, Option.Option<E>, B>): (self: TSet<A>) => STM.STM<R, E, B>;
    <A, R, E, B>(self: TSet<A>, pf: (a: A) => STM.STM<R, Option.Option<E>, B>): STM.STM<R, E, B>;
};
/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const takeSome: {
    <A, B>(pf: (a: A) => Option.Option<B>): (self: TSet<A>) => STM.STM<never, never, [B, ...Array<B>]>;
    <A, B>(self: TSet<A>, pf: (a: A) => Option.Option<B>): STM.STM<never, never, [B, ...Array<B>]>;
};
/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const takeSomeSTM: {
    <A, R, E, B>(pf: (a: A) => STM.STM<R, Option.Option<E>, B>): (self: TSet<A>) => STM.STM<R, E, [B, ...Array<B>]>;
    <A, R, E, B>(self: TSet<A>, pf: (a: A) => STM.STM<R, Option.Option<E>, B>): STM.STM<R, E, [B, ...Array<B>]>;
};
/**
 * Collects all elements into a `Chunk`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toChunk: <A>(self: TSet<A>) => STM.STM<never, never, Array<A>>;
/**
 * Collects all elements into a `HashSet`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toHashSet: <A>(self: TSet<A>) => STM.STM<never, never, HashSet.HashSet<A>>;
/**
 * Collects all elements into a `ReadonlyArray`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toReadonlyArray: <A>(self: TSet<A>) => STM.STM<never, never, ReadonlyArray<A>>;
/**
 * Collects all elements into a `ReadonlySet`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toReadonlySet: <A>(self: TSet<A>) => STM.STM<never, never, ReadonlySet<A>>;
/**
 * Atomically updates all elements using a pure function.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const transform: {
    <A>(f: (a: A) => A): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, f: (a: A) => A): STM.STM<never, never, void>;
};
/**
 * Atomically updates all elements using a transactional function.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const transformSTM: {
    <A, R, E>(f: (a: A) => STM.STM<R, E, A>): (self: TSet<A>) => STM.STM<R, E, void>;
    <A, R, E>(self: TSet<A>, f: (a: A) => STM.STM<R, E, A>): STM.STM<R, E, void>;
};
/**
 * Atomically transforms the set into the union of itself and the provided
 * set.
 *
 * @since 2.0.0
 * @category mutations
 */
export declare const union: {
    <A>(other: TSet<A>): (self: TSet<A>) => STM.STM<never, never, void>;
    <A>(self: TSet<A>, other: TSet<A>): STM.STM<never, never, void>;
};
//# sourceMappingURL=TSet.d.ts.map