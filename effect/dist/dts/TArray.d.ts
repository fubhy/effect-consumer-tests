import type * as Option from "./Option.js";
import type * as Order from "./Order.js";
import type { Predicate } from "./Predicate.js";
import type * as STM from "./STM.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const TArrayTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type TArrayTypeId = typeof TArrayTypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface TArray<A> extends TArray.Variance<A> {
}
/**
 * @since 2.0.0
 */
export declare namespace TArray {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<A> {
        readonly [TArrayTypeId]: {
            readonly _A: (_: never) => A;
        };
    }
}
/**
 * Finds the result of applying a partial function to the first value in its
 * domain.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const collectFirst: {
    <A, B>(pf: (a: A) => Option.Option<B>): (self: TArray<A>) => STM.STM<never, never, Option.Option<B>>;
    <A, B>(self: TArray<A>, pf: (a: A) => Option.Option<B>): STM.STM<never, never, Option.Option<B>>;
};
/**
 * Finds the result of applying an transactional partial function to the first
 * value in its domain.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const collectFirstSTM: {
    <A, R, E, B>(pf: (a: A) => Option.Option<STM.STM<R, E, B>>): (self: TArray<A>) => STM.STM<R, E, Option.Option<B>>;
    <A, R, E, B>(self: TArray<A>, pf: (a: A) => Option.Option<STM.STM<R, E, B>>): STM.STM<R, E, Option.Option<B>>;
};
/**
 * Determine if the array contains a specified value.
 *
 * @macro trace
 * @since 2.0.0
 * @category elements
 */
export declare const contains: {
    <A>(value: A): (self: TArray<A>) => STM.STM<never, never, boolean>;
    <A>(self: TArray<A>, value: A): STM.STM<never, never, boolean>;
};
/**
 * Count the values in the array matching a predicate.
 *
 * @macro trace
 * @since 2.0.0
 * @category folding
 */
export declare const count: {
    <A>(predicate: Predicate<A>): (self: TArray<A>) => STM.STM<never, never, number>;
    <A>(self: TArray<A>, predicate: Predicate<A>): STM.STM<never, never, number>;
};
/**
 * Count the values in the array matching a transactional predicate.
 *
 * @macro trace
 * @since 2.0.0
 * @category folding
 */
export declare const countSTM: {
    <A, R, E>(predicate: (value: A) => STM.STM<R, E, boolean>): (self: TArray<A>) => STM.STM<R, E, number>;
    <A, R, E>(self: TArray<A>, predicate: (value: A) => STM.STM<R, E, boolean>): STM.STM<R, E, number>;
};
/**
 * Makes an empty `TArray`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const empty: <A>() => STM.STM<never, never, TArray<A>>;
/**
 * Atomically evaluate the conjunction of a predicate across the members of
 * the array.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const every: {
    <A>(predicate: Predicate<A>): (self: TArray<A>) => STM.STM<never, never, boolean>;
    <A>(self: TArray<A>, predicate: Predicate<A>): STM.STM<never, never, boolean>;
};
/**
 * Atomically evaluate the conjunction of a transactional predicate across the
 * members of the array.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const everySTM: {
    <A, R, E>(predicate: (value: A) => STM.STM<R, E, boolean>): (self: TArray<A>) => STM.STM<R, E, boolean>;
    <A, R, E>(self: TArray<A>, predicate: (value: A) => STM.STM<R, E, boolean>): STM.STM<R, E, boolean>;
};
/**
 * Find the first element in the array matching the specified predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findFirst: {
    <A>(predicate: Predicate<A>): (self: TArray<A>) => STM.STM<never, never, Option.Option<A>>;
    <A>(self: TArray<A>, predicate: Predicate<A>): STM.STM<never, never, Option.Option<A>>;
};
/**
 * Get the first index of a specific value in the array.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findFirstIndex: {
    <A>(value: A): (self: TArray<A>) => STM.STM<never, never, Option.Option<number>>;
    <A>(self: TArray<A>, value: A): STM.STM<never, never, Option.Option<number>>;
};
/**
 * Get the first index of a specific value in the array starting from the
 * specified index.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findFirstIndexFrom: {
    <A>(value: A, from: number): (self: TArray<A>) => STM.STM<never, never, Option.Option<number>>;
    <A>(self: TArray<A>, value: A, from: number): STM.STM<never, never, Option.Option<number>>;
};
/**
 * Get the index of the first entry in the array matching a predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findFirstIndexWhere: {
    <A>(predicate: Predicate<A>): (self: TArray<A>) => STM.STM<never, never, Option.Option<number>>;
    <A>(self: TArray<A>, predicate: Predicate<A>): STM.STM<never, never, Option.Option<number>>;
};
/**
 * Get the index of the first entry in the array starting from the specified
 * index, matching a predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findFirstIndexWhereFrom: {
    <A>(predicate: Predicate<A>, from: number): (self: TArray<A>) => STM.STM<never, never, Option.Option<number>>;
    <A>(self: TArray<A>, predicate: Predicate<A>, from: number): STM.STM<never, never, Option.Option<number>>;
};
/**
 * Get the index of the next entry that matches a transactional predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findFirstIndexWhereSTM: {
    <A, R, E>(predicate: (value: A) => STM.STM<R, E, boolean>): (self: TArray<A>) => STM.STM<R, E, Option.Option<number>>;
    <A, R, E>(self: TArray<A>, predicate: (value: A) => STM.STM<R, E, boolean>): STM.STM<R, E, Option.Option<number>>;
};
/**
 * Starting at specified index, get the index of the next entry that matches a
 * transactional predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findFirstIndexWhereFromSTM: {
    <A, R, E>(predicate: (value: A) => STM.STM<R, E, boolean>, from: number): (self: TArray<A>) => STM.STM<R, E, Option.Option<number>>;
    <A, R, E>(self: TArray<A>, predicate: (value: A) => STM.STM<R, E, boolean>, from: number): STM.STM<R, E, Option.Option<number>>;
};
/**
 * Find the first element in the array matching a transactional predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findFirstSTM: {
    <A, R, E>(predicate: (value: A) => STM.STM<R, E, boolean>): (self: TArray<A>) => STM.STM<R, E, Option.Option<A>>;
    <A, R, E>(self: TArray<A>, predicate: (value: A) => STM.STM<R, E, boolean>): STM.STM<R, E, Option.Option<A>>;
};
/**
 * Find the last element in the array matching a predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findLast: {
    <A>(predicate: Predicate<A>): (self: TArray<A>) => STM.STM<never, never, Option.Option<A>>;
    <A>(self: TArray<A>, predicate: Predicate<A>): STM.STM<never, never, Option.Option<A>>;
};
/**
 * Get the last index of a specific value in the array bounded above by a
 * specific index.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findLastIndex: {
    <A>(value: A): (self: TArray<A>) => STM.STM<never, never, Option.Option<number>>;
    <A>(self: TArray<A>, value: A): STM.STM<never, never, Option.Option<number>>;
};
/**
 * Get the last index of a specific value in the array bounded above by a
 * specific index.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findLastIndexFrom: {
    <A>(value: A, end: number): (self: TArray<A>) => STM.STM<never, never, Option.Option<number>>;
    <A>(self: TArray<A>, value: A, end: number): STM.STM<never, never, Option.Option<number>>;
};
/**
 * Find the last element in the array matching a transactional predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const findLastSTM: {
    <A, R, E>(predicate: (value: A) => STM.STM<R, E, boolean>): (self: TArray<A>) => STM.STM<R, E, Option.Option<A>>;
    <A, R, E>(self: TArray<A>, predicate: (value: A) => STM.STM<R, E, boolean>): STM.STM<R, E, Option.Option<A>>;
};
/**
 * Atomically performs transactional effect for each item in array.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const forEach: {
    <A, R, E>(f: (value: A) => STM.STM<R, E, void>): (self: TArray<A>) => STM.STM<R, E, void>;
    <A, R, E>(self: TArray<A>, f: (value: A) => STM.STM<R, E, void>): STM.STM<R, E, void>;
};
/**
 * Makes a new `TArray` initialized with provided iterable.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromIterable: <A>(iterable: Iterable<A>) => STM.STM<never, never, TArray<A>>;
/**
 * Extracts value from ref in array.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const get: {
    (index: number): <A>(self: TArray<A>) => STM.STM<never, never, A>;
    <A>(self: TArray<A>, index: number): STM.STM<never, never, A>;
};
/**
 * The first entry of the array, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const headOption: <A>(self: TArray<A>) => STM.STM<never, never, Option.Option<A>>;
/**
 * The last entry in the array, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const lastOption: <A>(self: TArray<A>) => STM.STM<never, never, Option.Option<A>>;
/**
 * Makes a new `TArray` that is initialized with specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <Elements extends [any, ...Array<any>]>(...elements: Elements) => STM.STM<never, never, TArray<Elements[number]>>;
/**
 * Atomically compute the greatest element in the array, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const maxOption: {
    <A>(order: Order.Order<A>): (self: TArray<A>) => STM.STM<never, never, Option.Option<A>>;
    <A>(self: TArray<A>, order: Order.Order<A>): STM.STM<never, never, Option.Option<A>>;
};
/**
 * Atomically compute the least element in the array, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const minOption: {
    <A>(order: Order.Order<A>): (self: TArray<A>) => STM.STM<never, never, Option.Option<A>>;
    <A>(self: TArray<A>, order: Order.Order<A>): STM.STM<never, never, Option.Option<A>>;
};
/**
 * Atomically folds using a pure function.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduce: {
    <Z, A>(zero: Z, f: (accumulator: Z, current: A) => Z): (self: TArray<A>) => STM.STM<never, never, Z>;
    <Z, A>(self: TArray<A>, zero: Z, f: (accumulator: Z, current: A) => Z): STM.STM<never, never, Z>;
};
/**
 * Atomically reduce the array, if non-empty, by a binary operator.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const reduceOption: {
    <A>(f: (x: A, y: A) => A): (self: TArray<A>) => STM.STM<never, never, Option.Option<A>>;
    <A>(self: TArray<A>, f: (x: A, y: A) => A): STM.STM<never, never, Option.Option<A>>;
};
/**
 * Atomically reduce the non-empty array using a transactional binary
 * operator.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const reduceOptionSTM: {
    <A, R, E>(f: (x: A, y: A) => STM.STM<R, E, A>): (self: TArray<A>) => STM.STM<R, E, Option.Option<A>>;
    <A, R, E>(self: TArray<A>, f: (x: A, y: A) => STM.STM<R, E, A>): STM.STM<R, E, Option.Option<A>>;
};
/**
 * Atomically folds using a transactional function.
 *
 * @macro trace
 * @since 2.0.0
 * @category folding
 */
export declare const reduceSTM: {
    <Z, A, R, E>(zero: Z, f: (accumulator: Z, current: A) => STM.STM<R, E, Z>): (self: TArray<A>) => STM.STM<R, E, Z>;
    <Z, A, R, E>(self: TArray<A>, zero: Z, f: (accumulator: Z, current: A) => STM.STM<R, E, Z>): STM.STM<R, E, Z>;
};
/**
 * Returns the size of the `TArray`.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const size: <A>(self: TArray<A>) => number;
/**
 * Determine if the array contains a value satisfying a predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const some: {
    <A>(predicate: Predicate<A>): (self: TArray<A>) => STM.STM<never, never, boolean>;
    <A>(self: TArray<A>, predicate: Predicate<A>): STM.STM<never, never, boolean>;
};
/**
 * Determine if the array contains a value satisfying a transactional
 * predicate.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const someSTM: {
    <A, R, E>(predicate: (value: A) => STM.STM<R, E, boolean>): (self: TArray<A>) => STM.STM<R, E, boolean>;
    <A, R, E>(self: TArray<A>, predicate: (value: A) => STM.STM<R, E, boolean>): STM.STM<R, E, boolean>;
};
/**
 * Collects all elements into a chunk.
 *
 * @since 2.0.0
 * @since 2.0.0
 * @category destructors
 */
export declare const toArray: <A>(self: TArray<A>) => STM.STM<never, never, Array<A>>;
/**
 * Atomically updates all elements using a pure function.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const transform: {
    <A>(f: (value: A) => A): (self: TArray<A>) => STM.STM<never, never, void>;
    <A>(self: TArray<A>, f: (value: A) => A): STM.STM<never, never, void>;
};
/**
 * Atomically updates all elements using a transactional effect.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const transformSTM: {
    <A, R, E>(f: (value: A) => STM.STM<R, E, A>): (self: TArray<A>) => STM.STM<R, E, void>;
    <A, R, E>(self: TArray<A>, f: (value: A) => STM.STM<R, E, A>): STM.STM<R, E, void>;
};
/**
 * Updates element in the array with given function.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const update: {
    <A>(index: number, f: (value: A) => A): (self: TArray<A>) => STM.STM<never, never, void>;
    <A>(self: TArray<A>, index: number, f: (value: A) => A): STM.STM<never, never, void>;
};
/**
 * Atomically updates element in the array with given transactional effect.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const updateSTM: {
    <A, R, E>(index: number, f: (value: A) => STM.STM<R, E, A>): (self: TArray<A>) => STM.STM<R, E, void>;
    <A, R, E>(self: TArray<A>, index: number, f: (value: A) => STM.STM<R, E, A>): STM.STM<R, E, void>;
};
//# sourceMappingURL=TArray.d.ts.map