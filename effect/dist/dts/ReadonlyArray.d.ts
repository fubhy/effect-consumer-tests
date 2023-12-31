/**
 * This module provides utility functions for working with arrays in TypeScript.
 *
 * @since 2.0.0
 */
import type { Either } from "./Either.js";
import * as Equivalence from "./Equivalence.js";
import type { LazyArg } from "./Function.js";
import type { TypeLambda } from "./HKT.js";
import type { Option } from "./Option.js";
import * as Order from "./Order.js";
import type { Predicate, Refinement } from "./Predicate.js";
/**
 * @category type lambdas
 * @since 2.0.0
 */
export interface ReadonlyArrayTypeLambda extends TypeLambda {
    readonly type: ReadonlyArray<this["Target"]>;
}
/**
 * @category models
 * @since 2.0.0
 */
export type NonEmptyReadonlyArray<A> = readonly [A, ...Array<A>];
/**
 * @category models
 * @since 2.0.0
 */
export type NonEmptyArray<A> = [A, ...Array<A>];
/**
 * Builds a `NonEmptyArray` from an non-empty collection of elements.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const make: <Elements extends [any, ...any[]]>(...elements: Elements) => [Elements[number], ...Elements[number][]];
/**
 * Return a `NonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to an integer >= 1.
 *
 * @example
 * import { makeBy } from 'effect/ReadonlyArray'
 *
 * assert.deepStrictEqual(makeBy(5, n => n * 2), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const makeBy: <A>(n: number, f: (i: number) => A) => [A, ...A[]];
/**
 * Return a `NonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'effect/ReadonlyArray'
 *
 * assert.deepStrictEqual(range(1, 3), [1, 2, 3])
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const range: (start: number, end: number) => [number, ...number[]];
/**
 * Return a `NonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to an integer >= 1.
 *
 * @example
 * import { replicate } from 'effect/ReadonlyArray'
 *
 * assert.deepStrictEqual(replicate("a", 3), ["a", "a", "a"])
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const replicate: {
    (n: number): <A>(a: A) => NonEmptyArray<A>;
    <A>(a: A, n: number): NonEmptyArray<A>;
};
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromIterable: <A>(collection: Iterable<A>) => A[];
/**
 * Takes a record and returns an array of tuples containing its keys and values.
 *
 * @param self - The record to transform.
 *
 * @example
 * import { fromRecord } from "effect/ReadonlyArray"
 *
 * const x = { a: 1, b: 2, c: 3 }
 * assert.deepStrictEqual(fromRecord(x), [["a", 1], ["b", 2], ["c", 3]])
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const fromRecord: <K extends string, A>(self: Readonly<Record<K, A>>) => Array<[K, A]>;
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromOption: <A>(self: Option<A>) => Array<A>;
/**
 * @category pattern matching
 * @since 2.0.0
 */
export declare const match: {
    <B, A, C = B>(options: {
        readonly onEmpty: LazyArg<B>;
        readonly onNonEmpty: (self: NonEmptyReadonlyArray<A>) => C;
    }): (self: ReadonlyArray<A>) => B | C;
    <A, B, C = B>(self: ReadonlyArray<A>, options: {
        readonly onEmpty: LazyArg<B>;
        readonly onNonEmpty: (self: NonEmptyReadonlyArray<A>) => C;
    }): B | C;
};
/**
 * @category pattern matching
 * @since 2.0.0
 */
export declare const matchLeft: {
    <B, A, C = B>(options: {
        readonly onEmpty: LazyArg<B>;
        readonly onNonEmpty: (head: A, tail: Array<A>) => C;
    }): (self: ReadonlyArray<A>) => B | C;
    <A, B, C = B>(self: ReadonlyArray<A>, options: {
        readonly onEmpty: LazyArg<B>;
        readonly onNonEmpty: (head: A, tail: Array<A>) => C;
    }): B | C;
};
/**
 * @category pattern matching
 * @since 2.0.0
 */
export declare const matchRight: {
    <B, A, C = B>(options: {
        readonly onEmpty: LazyArg<B>;
        readonly onNonEmpty: (init: Array<A>, last: A) => C;
    }): (self: ReadonlyArray<A>) => B | C;
    <A, B, C = B>(self: ReadonlyArray<A>, options: {
        readonly onEmpty: LazyArg<B>;
        readonly onNonEmpty: (init: Array<A>, last: A) => C;
    }): B | C;
};
/**
 * Prepend an element to the front of an `Iterable`, creating a new `NonEmptyArray`.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const prepend: {
    <B>(head: B): <A>(self: Iterable<A>) => NonEmptyArray<A | B>;
    <A, B>(self: Iterable<A>, head: B): NonEmptyArray<A | B>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const prependAll: {
    <B>(that: Iterable<B>): <A>(self: Iterable<A>) => Array<A | B>;
    <A, B>(self: Iterable<A>, that: Iterable<B>): Array<A | B>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const prependAllNonEmpty: {
    <B>(that: NonEmptyReadonlyArray<B>): <A>(self: Iterable<A>) => NonEmptyArray<A | B>;
    <B>(that: Iterable<B>): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A | B>;
    <A, B>(self: Iterable<A>, that: NonEmptyReadonlyArray<B>): NonEmptyArray<A | B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, that: Iterable<B>): NonEmptyArray<A | B>;
};
/**
 * Append an element to the end of an `Iterable`, creating a new `NonEmptyArray`.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const append: {
    <B>(last: B): <A>(self: Iterable<A>) => NonEmptyArray<A | B>;
    <A, B>(self: Iterable<A>, last: B): NonEmptyArray<A | B>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const appendAll: {
    <B>(that: Iterable<B>): <A>(self: Iterable<A>) => Array<A | B>;
    <A, B>(self: Iterable<A>, that: Iterable<B>): Array<A | B>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const appendAllNonEmpty: {
    <B>(that: NonEmptyReadonlyArray<B>): <A>(self: Iterable<A>) => NonEmptyArray<A | B>;
    <B>(that: Iterable<B>): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A | B>;
    <A, B>(self: Iterable<A>, that: NonEmptyReadonlyArray<B>): NonEmptyArray<A | B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, that: Iterable<B>): NonEmptyArray<A | B>;
};
/**
 * Reduce an `Iterable` from the left, keeping all intermediate results instead of only the final result.
 *
 * @category folding
 * @since 2.0.0
 */
export declare const scan: {
    <B, A>(b: B, f: (b: B, a: A) => B): (self: Iterable<A>) => NonEmptyArray<B>;
    <A, B>(self: Iterable<A>, b: B, f: (b: B, a: A) => B): NonEmptyArray<B>;
};
/**
 * Reduce an `Iterable` from the right, keeping all intermediate results instead of only the final result.
 *
 * @category folding
 * @since 2.0.0
 */
export declare const scanRight: {
    <B, A>(b: B, f: (b: B, a: A) => B): (self: Iterable<A>) => NonEmptyArray<B>;
    <A, B>(self: Iterable<A>, b: B, f: (b: B, a: A) => B): NonEmptyArray<B>;
};
/**
 * Determine if an `Array` is empty narrowing down the type to `[]`.
 *
 * @param self - The `Array` to check.
 *
 * @example
 * import { isEmptyArray } from "effect/ReadonlyArray"
 *
 * assert.deepStrictEqual(isEmptyArray([]), true);
 * assert.deepStrictEqual(isEmptyArray([1, 2, 3]), false);
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isEmptyArray: <A>(self: A[]) => self is [];
/**
 * Determine if a `ReadonlyArray` is empty narrowing down the type to `readonly []`.
 *
 * @param self - The `ReadonlyArray` to check.
 *
 * @example
 * import { isEmptyReadonlyArray } from "effect/ReadonlyArray"
 *
 * assert.deepStrictEqual(isEmptyReadonlyArray([]), true);
 * assert.deepStrictEqual(isEmptyReadonlyArray([1, 2, 3]), false);
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isEmptyReadonlyArray: <A>(self: ReadonlyArray<A>) => self is readonly [];
/**
 * Determine if an `Array` is non empty narrowing down the type to `NonEmptyArray`.
 *
 * An `Array` is considered to be a `NonEmptyArray` if it contains at least one element.
 *
 * @param self - The `Array` to check.
 *
 * @example
 * import { isNonEmptyArray } from "effect/ReadonlyArray"
 *
 * assert.deepStrictEqual(isNonEmptyArray([]), false);
 * assert.deepStrictEqual(isNonEmptyArray([1, 2, 3]), true);
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNonEmptyArray: <A>(self: Array<A>) => self is NonEmptyArray<A>;
/**
 * Determine if a `ReadonlyArray` is non empty narrowing down the type to `NonEmptyReadonlyArray`.
 *
 * A `ReadonlyArray` is considered to be a `NonEmptyReadonlyArray` if it contains at least one element.
 *
 * @param self - The `ReadonlyArray` to check.
 *
 * @example
 * import { isNonEmptyReadonlyArray } from "effect/ReadonlyArray"
 *
 * assert.deepStrictEqual(isNonEmptyReadonlyArray([]), false);
 * assert.deepStrictEqual(isNonEmptyReadonlyArray([1, 2, 3]), true);
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNonEmptyReadonlyArray: <A>(self: ReadonlyArray<A>) => self is NonEmptyReadonlyArray<A>;
/**
 * Return the number of elements in a `ReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const length: <A>(self: readonly A[]) => number;
/**
 * This function provides a safe way to read a value at a particular index from a `ReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const get: {
    (index: number): <A>(self: ReadonlyArray<A>) => Option<A>;
    <A>(self: ReadonlyArray<A>, index: number): Option<A>;
};
/**
 * Gets an element unsafely, will throw on out of bounds.
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeGet: {
    (index: number): <A>(self: ReadonlyArray<A>) => A;
    <A>(self: ReadonlyArray<A>, index: number): A;
};
/**
 * Return a tuple containing the first element, and a new `Array` of the remaining elements, if any.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const unprepend: <A>(self: readonly [A, ...A[]]) => [A, A[]];
/**
 * Return a tuple containing a copy of the `NonEmptyReadonlyArray` without its last element, and that last element.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const unappend: <A>(self: readonly [A, ...A[]]) => [A[], A];
/**
 * Get the first element of a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const head: <A>(self: ReadonlyArray<A>) => Option<A>;
/**
 * @category getters
 * @since 2.0.0
 */
export declare const headNonEmpty: <A>(self: NonEmptyReadonlyArray<A>) => A;
/**
 * Get the last element in a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const last: <A>(self: readonly A[]) => Option<A>;
/**
 * @category getters
 * @since 2.0.0
 */
export declare const lastNonEmpty: <A>(self: readonly [A, ...A[]]) => A;
/**
 * Get all but the first element of an `Iterable`, creating a new `Array`, or `None` if the `Iterable` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const tail: <A>(self: Iterable<A>) => Option<A[]>;
/**
 * @category getters
 * @since 2.0.0
 */
export declare const tailNonEmpty: <A>(self: readonly [A, ...A[]]) => A[];
/**
 * Get all but the last element of an `Iterable`, creating a new `Array`, or `None` if the `Iterable` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const init: <A>(self: Iterable<A>) => Option<A[]>;
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const initNonEmpty: <A>(self: readonly [A, ...A[]]) => A[];
/**
 * Keep only a max number of elements from the start of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const take: {
    (n: number): <A>(self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, n: number): Array<A>;
};
/**
 * Keep only a max number of elements from the end of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const takeRight: {
    (n: number): <A>(self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, n: number): Array<A>;
};
/**
 * Calculate the longest initial subarray for which all element satisfy the specified predicate, creating a new `Array`.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const takeWhile: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: Iterable<A>) => Array<B>;
    <A>(predicate: Predicate<A>): <B extends A>(self: Iterable<B>) => Array<B>;
    <A, B extends A>(self: Iterable<A>, refinement: Refinement<A, B>): Array<B>;
    <B extends A, A>(self: Iterable<B>, predicate: Predicate<A>): Array<B>;
};
/**
 * Split an `Iterable` into two parts:
 *
 * 1. the longest initial subarray for which all elements satisfy the specified predicate
 * 2. the remaining elements
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const span: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: Iterable<A>) => [init: Array<B>, rest: Array<A>];
    <A>(predicate: Predicate<A>): <B extends A>(self: Iterable<B>) => [init: Array<B>, rest: Array<B>];
    <A, B extends A>(self: Iterable<A>, refinement: Refinement<A, B>): [init: Array<B>, rest: Array<A>];
    <B extends A, A>(self: Iterable<B>, predicate: Predicate<A>): [init: Array<B>, rest: Array<B>];
};
/**
 * Drop a max number of elements from the start of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const drop: {
    (n: number): <A>(self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, n: number): Array<A>;
};
/**
 * Drop a max number of elements from the end of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const dropRight: {
    (n: number): <A>(self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, n: number): Array<A>;
};
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new `Array`.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const dropWhile: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: Iterable<A>) => Array<B>;
    <A>(predicate: Predicate<A>): <B extends A>(self: Iterable<B>) => Array<B>;
    <A, B extends A>(self: Iterable<A>, refinement: Refinement<A, B>): Array<B>;
    <B extends A, A>(self: Iterable<B>, predicate: Predicate<A>): Array<B>;
};
/**
 * Return the first index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findFirstIndex: {
    <A>(predicate: Predicate<A>): (self: Iterable<A>) => Option<number>;
    <A>(self: Iterable<A>, predicate: Predicate<A>): Option<number>;
};
/**
 * Return the last index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findLastIndex: {
    <A>(predicate: Predicate<A>): (self: Iterable<A>) => Option<number>;
    <A>(self: Iterable<A>, predicate: Predicate<A>): Option<number>;
};
/**
 * Returns the first element that satisfies the specified
 * predicate, or `None` if no such element exists.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findFirst: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: Iterable<A>) => Option<B>;
    <A>(predicate: Predicate<A>): <B extends A>(self: Iterable<B>) => Option<B>;
    <A, B extends A>(self: Iterable<A>, refinement: Refinement<A, B>): Option<B>;
    <B extends A, A>(self: Iterable<B>, predicate: Predicate<A>): Option<B>;
};
/**
 * Find the last element for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findLast: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: Iterable<A>) => Option<B>;
    <A>(predicate: Predicate<A>): <B extends A>(self: Iterable<B>) => Option<B>;
    <A, B extends A>(self: Iterable<A>, refinement: Refinement<A, B>): Option<B>;
    <B extends A, A>(self: Iterable<B>, predicate: Predicate<A>): Option<B>;
};
/**
 * Insert an element at the specified index, creating a new `NonEmptyArray`,
 * or return `None` if the index is out of bounds.
 *
 * @since 2.0.0
 */
export declare const insertAt: {
    <B>(i: number, b: B): <A>(self: Iterable<A>) => Option<NonEmptyArray<A | B>>;
    <A, B>(self: Iterable<A>, i: number, b: B): Option<NonEmptyArray<A | B>>;
};
/**
 * Change the element at the specified index, creating a new `Array`,
 * or return a copy of the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
export declare const replace: {
    <B>(i: number, b: B): <A>(self: Iterable<A>) => Array<A | B>;
    <A, B>(self: Iterable<A>, i: number, b: B): Array<A | B>;
};
/**
 * @since 2.0.0
 */
export declare const replaceOption: {
    <B>(i: number, b: B): <A>(self: Iterable<A>) => Option<Array<A | B>>;
    <A, B>(self: Iterable<A>, i: number, b: B): Option<Array<A | B>>;
};
/**
 * Apply a function to the element at the specified index, creating a new `Array`,
 * or return a copy of the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
export declare const modify: {
    <A, B>(i: number, f: (a: A) => B): (self: Iterable<A>) => Array<A | B>;
    <A, B>(self: Iterable<A>, i: number, f: (a: A) => B): Array<A | B>;
};
/**
 * Apply a function to the element at the specified index, creating a new `Array`,
 * or return `None` if the index is out of bounds.
 *
 * @since 2.0.0
 */
export declare const modifyOption: {
    <A, B>(i: number, f: (a: A) => B): (self: Iterable<A>) => Option<Array<A | B>>;
    <A, B>(self: Iterable<A>, i: number, f: (a: A) => B): Option<Array<A | B>>;
};
/**
 * Delete the element at the specified index, creating a new `Array`,
 * or return a copy of the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
export declare const remove: {
    (i: number): <A>(self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, i: number): Array<A>;
};
/**
 * Reverse an `Iterable`, creating a new `Array`.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const reverse: <A>(self: Iterable<A>) => A[];
/**
 * @category elements
 * @since 2.0.0
 */
export declare const reverseNonEmpty: <A>(self: readonly [A, ...A[]]) => [A, ...A[]];
/**
 * Sort the elements of an `Iterable` in increasing order, creating a new `Array`.
 *
 * @category sorting
 * @since 2.0.0
 */
export declare const sort: {
    <B>(O: Order.Order<B>): <A extends B>(self: Iterable<A>) => Array<A>;
    <A extends B, B>(self: Iterable<A>, O: Order.Order<B>): Array<A>;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const sortWith: {
    <A, B>(f: (a: A) => B, order: Order.Order<B>): (self: ReadonlyArray<A>) => Array<A>;
    <A, B>(self: ReadonlyArray<A>, f: (a: A) => B, order: Order.Order<B>): Array<A>;
};
/**
 * Sort the elements of a `NonEmptyReadonlyArray` in increasing order, creating a new `NonEmptyArray`.
 *
 * @category sorting
 * @since 2.0.0
 */
export declare const sortNonEmpty: {
    <B>(O: Order.Order<B>): <A extends B>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A>;
    <A extends B, B>(self: NonEmptyReadonlyArray<A>, O: Order.Order<B>): NonEmptyArray<A>;
};
/**
 * Sort the elements of an `Iterable` in increasing order, where elements are compared
 * using first `orders[0]`, then `orders[1]`, etc...
 *
 * @category sorting
 * @since 2.0.0
 */
export declare const sortBy: <B>(...orders: readonly Order.Order<B>[]) => <A extends B>(self: Iterable<A>) => A[];
/**
 * @category sorting
 * @since 2.0.0
 */
export declare const sortByNonEmpty: <B>(...orders: readonly Order.Order<B>[]) => <A extends B>(as: readonly [A, ...A[]]) => [A, ...A[]];
/**
 * Takes two `Iterable`s and returns an `Array` of corresponding pairs.
 * If one input `Iterable` is short, excess elements of the
 * longer `Iterable` are discarded.
 *
 * @since 2.0.0
 */
export declare const zip: {
    <B>(that: Iterable<B>): <A>(self: Iterable<A>) => Array<[A, B]>;
    <A, B>(self: Iterable<A>, that: Iterable<B>): Array<[A, B]>;
};
/**
 * Apply a function to pairs of elements at the same index in two `Iterable`s, collecting the results in a new `Array`. If one
 * input `Iterable` is short, excess elements of the longer `Iterable` are discarded.
 *
 * @since 2.0.0
 */
export declare const zipWith: {
    <B, A, C>(that: Iterable<B>, f: (a: A, b: B) => C): (self: Iterable<A>) => Array<C>;
    <B, A, C>(self: Iterable<A>, that: Iterable<B>, f: (a: A, b: B) => C): Array<C>;
};
/**
 * @since 2.0.0
 */
export declare const zipNonEmpty: {
    <B>(that: NonEmptyReadonlyArray<B>): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<[A, B]>;
    <A, B>(self: NonEmptyReadonlyArray<A>, that: NonEmptyReadonlyArray<B>): NonEmptyArray<[A, B]>;
};
/**
 * @since 2.0.0
 */
export declare const zipNonEmptyWith: {
    <B, A, C>(that: NonEmptyReadonlyArray<B>, f: (a: A, b: B) => C): (self: NonEmptyReadonlyArray<A>) => NonEmptyArray<C>;
    <A, B, C>(self: NonEmptyReadonlyArray<A>, that: NonEmptyReadonlyArray<B>, f: (a: A, b: B) => C): NonEmptyArray<C>;
};
/**
 * This function is the inverse of `zip`. Takes an `Iterable` of pairs and return two corresponding `Array`s.
 *
 * @since 2.0.0
 */
export declare const unzip: <A, B>(self: Iterable<readonly [A, B]>) => [A[], B[]];
/**
 * @since 2.0.0
 */
export declare const unzipNonEmpty: <A, B>(self: readonly [readonly [A, B], ...(readonly [A, B])[]]) => [[A, ...A[]], [B, ...B[]]];
/**
 * Places an element in between members of an `Iterable`
 *
 * @since 2.0.0
 */
export declare const intersperse: {
    <B>(middle: B): <A>(self: Iterable<A>) => Array<A | B>;
    <A, B>(self: Iterable<A>, middle: B): Array<A | B>;
};
/**
 * Places an element in between members of a `NonEmptyReadonlyArray`
 *
 * @since 2.0.0
 */
export declare const intersperseNonEmpty: {
    <B>(middle: B): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A | B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, middle: B): NonEmptyArray<A | B>;
};
/**
 * Apply a function to the head, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export declare const modifyNonEmptyHead: {
    <A, B>(f: (a: A) => B): (self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A | B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, f: (a: A) => B): NonEmptyArray<A | B>;
};
/**
 * Change the head, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export declare const setNonEmptyHead: {
    <B>(b: B): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A | B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, b: B): NonEmptyArray<A | B>;
};
/**
 * Apply a function to the last element, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export declare const modifyNonEmptyLast: {
    <A, B>(f: (a: A) => B): (self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A | B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, f: (a: A) => B): NonEmptyArray<A | B>;
};
/**
 * Change the last element, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export declare const setNonEmptyLast: {
    <B>(b: B): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A | B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, b: B): NonEmptyArray<A | B>;
};
/**
 * Rotate an `Iterable` by `n` steps.
 *
 * @since 2.0.0
 */
export declare const rotate: {
    (n: number): <A>(self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, n: number): Array<A>;
};
/**
 * Rotate a `NonEmptyReadonlyArray` by `n` steps.
 *
 * @since 2.0.0
 */
export declare const rotateNonEmpty: {
    (n: number): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A>;
    <A>(self: NonEmptyReadonlyArray<A>, n: number): NonEmptyArray<A>;
};
/**
 * Returns a function that checks if a `ReadonlyArray` contains a given value using a provided `isEquivalent` function.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const containsWith: <A>(isEquivalent: (self: A, that: A) => boolean) => {
    (a: A): (self: Iterable<A>) => boolean;
    (self: Iterable<A>, a: A): boolean;
};
/**
 * Returns a function that checks if a `ReadonlyArray` contains a given value using the default `Equivalence`.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const contains: {
    <A>(a: A): (self: Iterable<A>) => boolean;
    <A>(self: Iterable<A>, a: A): boolean;
};
/**
 * Remove duplicates from a `NonEmptyReadonlyArray`, keeping the first occurrence of an element using the provided `isEquivalent` function.
 *
 * @since 2.0.0
 */
export declare const dedupeNonEmptyWith: {
    <A>(isEquivalent: (self: A, that: A) => boolean): (self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A>;
    <A>(self: NonEmptyReadonlyArray<A>, isEquivalent: (self: A, that: A) => boolean): NonEmptyArray<A>;
};
/**
 * Remove duplicates from a `NonEmptyReadonlyArray`, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 */
export declare const dedupeNonEmpty: <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A>;
/**
 * A useful recursion pattern for processing an `Iterable` to produce a new `Array`, often used for "chopping" up the input
 * `Iterable`. Typically chop is called with some function that will consume an initial prefix of the `Iterable` and produce a
 * value and the rest of the `Array`.
 *
 * @since 2.0.0
 */
export declare const chop: {
    <A, B>(f: (as: NonEmptyReadonlyArray<A>) => readonly [B, ReadonlyArray<A>]): (self: Iterable<A>) => Array<B>;
    <A, B>(self: Iterable<A>, f: (as: NonEmptyReadonlyArray<A>) => readonly [B, ReadonlyArray<A>]): Array<B>;
};
/**
 * A useful recursion pattern for processing a `NonEmptyReadonlyArray` to produce a new `NonEmptyReadonlyArray`, often used for "chopping" up the input
 * `NonEmptyReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `NonEmptyReadonlyArray` and produce a
 * value and the tail of the `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export declare const chopNonEmpty: {
    <A, B>(f: (as: NonEmptyReadonlyArray<A>) => readonly [B, ReadonlyArray<A>]): (self: NonEmptyReadonlyArray<A>) => NonEmptyArray<B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, f: (as: NonEmptyReadonlyArray<A>) => readonly [B, ReadonlyArray<A>]): NonEmptyArray<B>;
};
/**
 * Splits an `Iterable` into two pieces, the first piece has max `n` elements.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const splitAt: {
    (n: number): <A>(self: Iterable<A>) => [Array<A>, Array<A>];
    <A>(self: Iterable<A>, n: number): [Array<A>, Array<A>];
};
/**
 * @since 2.0.0
 */
export declare const copy: {
    <A>(self: NonEmptyReadonlyArray<A>): NonEmptyArray<A>;
    <A>(self: ReadonlyArray<A>): Array<A>;
};
/**
 * Splits a `NonEmptyReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const splitNonEmptyAt: {
    (n: number): <A>(self: NonEmptyReadonlyArray<A>) => [NonEmptyArray<A>, Array<A>];
    <A>(self: NonEmptyReadonlyArray<A>, n: number): [NonEmptyArray<A>, Array<A>];
};
/**
 * Splits an `Iterable` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `Iterable`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `self`.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const chunksOf: {
    (n: number): <A>(self: Iterable<A>) => Array<NonEmptyArray<A>>;
    <A>(self: Iterable<A>, n: number): Array<NonEmptyArray<A>>;
};
/**
 * Splits a `NonEmptyReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `NonEmptyReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
export declare const chunksOfNonEmpty: {
    (n: number): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<NonEmptyArray<A>>;
    <A>(self: NonEmptyReadonlyArray<A>, n: number): NonEmptyArray<NonEmptyArray<A>>;
};
/**
 * Group equal, consecutive elements of a `NonEmptyReadonlyArray` into `NonEmptyArray`s using the provided `isEquivalent` function.
 *
 * @category grouping
 * @since 2.0.0
 */
export declare const groupWith: {
    <A>(isEquivalent: (self: A, that: A) => boolean): (self: NonEmptyReadonlyArray<A>) => NonEmptyArray<NonEmptyArray<A>>;
    <A>(self: NonEmptyReadonlyArray<A>, isEquivalent: (self: A, that: A) => boolean): NonEmptyArray<NonEmptyArray<A>>;
};
/**
 * Group equal, consecutive elements of a `NonEmptyReadonlyArray` into `NonEmptyArray`s.
 *
 * @category grouping
 * @since 2.0.0
 */
export declare const group: <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyArray<NonEmptyArray<A>>;
/**
 * Splits an `Iterable` into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @category grouping
 * @since 2.0.0
 */
export declare const groupBy: {
    <A>(f: (a: A) => string): (self: Iterable<A>) => Record<string, NonEmptyArray<A>>;
    <A>(self: Iterable<A>, f: (a: A) => string): Record<string, NonEmptyArray<A>>;
};
/**
 * @since 2.0.0
 */
export declare const unionWith: <A>(isEquivalent: (self: A, that: A) => boolean) => {
    (that: Iterable<A>): (self: Iterable<A>) => A[];
    (self: Iterable<A>, that: Iterable<A>): A[];
};
/**
 * @since 2.0.0
 */
export declare const union: {
    <B>(that: Iterable<B>): <A>(self: Iterable<A>) => Array<A | B>;
    <A, B>(self: Iterable<A>, that: Iterable<B>): Array<A | B>;
};
/**
 * @since 2.0.0
 */
export declare const unionNonEmptyWith: <A>(isEquivalent: (self: A, that: A) => boolean) => {
    (that: readonly [A, ...A[]]): (self: readonly A[]) => [A, ...A[]];
    (that: readonly A[]): (self: readonly [A, ...A[]]) => [A, ...A[]];
    (self: readonly A[], that: readonly [A, ...A[]]): [A, ...A[]];
    (self: readonly [A, ...A[]], that: readonly A[]): [A, ...A[]];
};
/**
 * @since 2.0.0
 */
export declare const unionNonEmpty: {
    <A>(that: NonEmptyReadonlyArray<A>): (self: ReadonlyArray<A>) => NonEmptyArray<A>;
    <A>(that: ReadonlyArray<A>): (self: NonEmptyReadonlyArray<A>) => NonEmptyArray<A>;
    <A>(self: ReadonlyArray<A>, that: NonEmptyReadonlyArray<A>): NonEmptyArray<A>;
    <A>(self: NonEmptyReadonlyArray<A>, that: ReadonlyArray<A>): NonEmptyArray<A>;
};
/**
 * Creates an `Array` of unique values that are included in all given `Iterable`s using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
export declare const intersectionWith: <A>(isEquivalent: (self: A, that: A) => boolean) => {
    (that: Iterable<A>): (self: Iterable<A>) => A[];
    (self: Iterable<A>, that: Iterable<A>): A[];
};
/**
 * Creates an `Array` of unique values that are included in all given `Iterable`s.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
export declare const intersection: {
    <B>(that: Iterable<B>): <A>(self: Iterable<A>) => Array<A & B>;
    <A, B>(self: Iterable<A>, that: Iterable<B>): Array<A & B>;
};
/**
 * Creates a `Array` of values not included in the other given `Iterable` using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
export declare const differenceWith: <A>(isEquivalent: (self: A, that: A) => boolean) => {
    (that: Iterable<A>): (self: Iterable<A>) => A[];
    (self: Iterable<A>, that: Iterable<A>): A[];
};
/**
 * Creates a `Array` of values not included in the other given `Iterable` using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
export declare const difference: {
    <A>(that: Iterable<A>): (self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, that: Iterable<A>): Array<A>;
};
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const empty: <A = never>() => Array<A>;
/**
 * Constructs a new `NonEmptyArray<A>` from the specified value.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const of: <A>(a: A) => [A, ...A[]];
/**
 * @since 2.0.0
 */
export declare namespace ReadonlyArray {
    /**
     * @since 2.0.0
     */
    type Infer<T extends ReadonlyArray<any>> = T[number];
    /**
     * @since 2.0.0
     */
    type With<T extends ReadonlyArray<any>, A> = T extends NonEmptyReadonlyArray<any> ? NonEmptyArray<A> : Array<A>;
}
/**
 * @category mapping
 * @since 2.0.0
 */
export declare const map: {
    <T extends ReadonlyArray<any>, B>(f: (a: ReadonlyArray.Infer<T>, i: number) => B): (self: T) => ReadonlyArray.With<T, B>;
    <T extends ReadonlyArray<any>, B>(self: T, f: (a: ReadonlyArray.Infer<T>, i: number) => B): ReadonlyArray.With<T, B>;
};
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatMap: {
    <A, B>(f: (a: A, i: number) => ReadonlyArray<B>): (self: ReadonlyArray<A>) => Array<B>;
    <A, B>(self: ReadonlyArray<A>, f: (a: A, i: number) => ReadonlyArray<B>): Array<B>;
};
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatMapNonEmpty: {
    <A, B>(f: (a: A, i: number) => NonEmptyReadonlyArray<B>): (self: NonEmptyReadonlyArray<A>) => NonEmptyArray<B>;
    <A, B>(self: NonEmptyReadonlyArray<A>, f: (a: A, i: number) => NonEmptyReadonlyArray<B>): NonEmptyArray<B>;
};
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatten: <A>(self: ReadonlyArray<ReadonlyArray<A>>) => Array<A>;
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flattenNonEmpty: <A>(self: NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>) => NonEmptyArray<A>;
/**
 * @category filtering
 * @since 2.0.0
 */
export declare const filterMap: {
    <A, B>(f: (a: A, i: number) => Option<B>): (self: Iterable<A>) => Array<B>;
    <A, B>(self: Iterable<A>, f: (a: A, i: number) => Option<B>): Array<B>;
};
/**
 * Transforms all elements of the `readonlyArray` for as long as the specified function returns some value
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const filterMapWhile: {
    <A, B>(f: (a: A) => Option<B>): (self: Iterable<A>) => Array<B>;
    <A, B>(self: Iterable<A>, f: (a: A) => Option<B>): Array<B>;
};
/**
 * @category filtering
 * @since 2.0.0
 */
export declare const partitionMap: {
    <A, B, C>(f: (a: A, i: number) => Either<B, C>): (self: Iterable<A>) => [Array<B>, Array<C>];
    <A, B, C>(self: Iterable<A>, f: (a: A, i: number) => Either<B, C>): [Array<B>, Array<C>];
};
/**
 * @category filtering
 * @since 2.0.0
 */
export declare const compact: <A>(self: Iterable<Option<A>>) => Array<A>;
/**
 * @category filtering
 * @since 2.0.0
 */
export declare const filter: {
    <C extends A, B extends A, A = C>(refinement: (a: A, i: number) => a is B): (self: Iterable<C>) => Array<B>;
    <B extends A, A = B>(predicate: (a: A, i: number) => boolean): (self: Iterable<B>) => Array<B>;
    <C extends A, B extends A, A = C>(self: Iterable<C>, refinement: (a: A, i: number) => a is B): Array<B>;
    <B extends A, A = B>(self: Iterable<B>, predicate: (a: A, i: number) => boolean): Array<B>;
};
/**
 * @category filtering
 * @since 2.0.0
 */
export declare const partition: {
    <C extends A, B extends A, A = C>(refinement: (a: A, i: number) => a is B): (self: Iterable<C>) => [Array<C>, Array<B>];
    <B extends A, A = B>(predicate: (a: A, i: number) => boolean): (self: Iterable<B>) => [Array<B>, Array<B>];
    <C extends A, B extends A, A = C>(self: Iterable<C>, refinement: (a: A, i: number) => a is B): [Array<C>, Array<B>];
    <B extends A, A = B>(self: Iterable<B>, predicate: (a: A, i: number) => boolean): [Array<B>, Array<B>];
};
/**
 * @category filtering
 * @since 2.0.0
 */
export declare const separate: <E, A>(self: Iterable<Either<E, A>>) => [Array<E>, Array<A>];
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduce: {
    <B, A>(b: B, f: (b: B, a: A, i: number) => B): (self: Iterable<A>) => B;
    <A, B>(self: Iterable<A>, b: B, f: (b: B, a: A, i: number) => B): B;
};
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduceRight: {
    <B, A>(b: B, f: (b: B, a: A, i: number) => B): (self: Iterable<A>) => B;
    <A, B>(self: Iterable<A>, b: B, f: (b: B, a: A, i: number) => B): B;
};
/**
 * @category lifting
 * @since 2.0.0
 */
export declare const liftPredicate: {
    <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (c: C) => Array<B>;
    <B extends A, A = B>(predicate: Predicate<A>): (b: B) => Array<B>;
};
/**
 * @category lifting
 * @since 2.0.0
 */
export declare const liftOption: <A extends unknown[], B>(f: (...a: A) => Option<B>) => (...a: A) => B[];
/**
 * @category conversions
 * @since 2.0.0
 */
export declare const fromNullable: <A>(a: A) => NonNullable<A>[];
/**
 * @category lifting
 * @since 2.0.0
 */
export declare const liftNullable: <A extends unknown[], B>(f: (...a: A) => B | null | undefined) => (...a: A) => NonNullable<B>[];
/**
 * @category combining
 * @since 2.0.0
 */
export declare const flatMapNullable: {
    <A, B>(f: (a: A) => B | null | undefined): (self: ReadonlyArray<A>) => Array<NonNullable<B>>;
    <A, B>(self: ReadonlyArray<A>, f: (a: A) => B | null | undefined): Array<NonNullable<B>>;
};
/**
 * @category lifting
 * @since 2.0.0
 */
export declare const liftEither: <A extends unknown[], E, B>(f: (...a: A) => Either<E, B>) => (...a: A) => B[];
/**
 * Check if a predicate holds true for every `ReadonlyArray` element.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const every: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: ReadonlyArray<A>) => self is ReadonlyArray<B>;
    <A>(predicate: Predicate<A>): (self: ReadonlyArray<A>) => boolean;
    <A, B extends A>(self: ReadonlyArray<A>, refinement: Refinement<A, B>): self is ReadonlyArray<B>;
    <A>(self: ReadonlyArray<A>, predicate: Predicate<A>): boolean;
};
/**
 * Check if a predicate holds true for some `ReadonlyArray` element.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const some: {
    <A>(predicate: Predicate<A>): <B extends A>(self: ReadonlyArray<B>) => self is NonEmptyReadonlyArray<B>;
    <B extends A, A = B>(self: ReadonlyArray<B>, predicate: Predicate<A>): self is NonEmptyReadonlyArray<B>;
};
/**
 * @since 2.0.0
 */
export declare const extend: {
    <A, B>(f: (as: ReadonlyArray<A>) => B): (self: ReadonlyArray<A>) => Array<B>;
    <A, B>(self: ReadonlyArray<A>, f: (as: ReadonlyArray<A>) => B): Array<B>;
};
/**
 * @since 2.0.0
 */
export declare const min: {
    <A>(O: Order.Order<A>): (self: NonEmptyReadonlyArray<A>) => A;
    <A>(self: NonEmptyReadonlyArray<A>, O: Order.Order<A>): A;
};
/**
 * @since 2.0.0
 */
export declare const max: {
    <A>(O: Order.Order<A>): (self: NonEmptyReadonlyArray<A>) => A;
    <A>(self: NonEmptyReadonlyArray<A>, O: Order.Order<A>): A;
};
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const unfold: <B, A>(b: B, f: (b: B) => Option<readonly [A, B]>) => A[];
/**
 * This function creates and returns a new `Order` for an array of values based on a given `Order` for the elements of the array.
 * The returned `Order` compares two arrays by applying the given `Order` to each element in the arrays.
 * If all elements are equal, the arrays are then compared based on their length.
 * It is useful when you need to compare two arrays of the same type and you have a specific way of comparing each element of the array.
 *
 * @category instances
 * @since 2.0.0
 */
export declare const getOrder: <A>(O: Order.Order<A>) => Order.Order<ReadonlyArray<A>>;
/**
 * @category instances
 * @since 2.0.0
 */
export declare const getEquivalence: <A>(isEquivalent: Equivalence.Equivalence<A>) => Equivalence.Equivalence<ReadonlyArray<A>>;
/**
 * Iterate over the `Iterable` applying `f`.
 *
 * @since 2.0.0
 */
export declare const forEach: {
    <A>(f: (a: A, i: number) => void): (self: Iterable<A>) => void;
    <A>(self: Iterable<A>, f: (a: A, i: number) => void): void;
};
/**
 * Remove duplicates from am `Iterable` using the provided `isEquivalent` function, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 */
export declare const dedupeWith: {
    <A>(isEquivalent: (self: A, that: A) => boolean): (self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, isEquivalent: (self: A, that: A) => boolean): Array<A>;
};
/**
 * Remove duplicates from am `Iterable`, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 */
export declare const dedupe: <A>(self: Iterable<A>) => Array<A>;
/**
 * Deduplicates adjacent elements that are identical using the provided `isEquivalent` function.
 *
 * @since 2.0.0
 */
export declare const dedupeAdjacentWith: {
    <A>(isEquivalent: (self: A, that: A) => boolean): (self: Iterable<A>) => Array<A>;
    <A>(self: Iterable<A>, isEquivalent: (self: A, that: A) => boolean): Array<A>;
};
/**
 * Deduplicates adjacent elements that are identical.
 *
 * @since 2.0.0
 */
export declare const dedupeAdjacent: <A>(self: Iterable<A>) => Array<A>;
/**
 * Joins the elements together with "sep" in the middle.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const join: {
    (sep: string): (self: Iterable<string>) => string;
    (self: Iterable<string>, sep: string): string;
};
/**
 * Statefully maps over the chunk, producing new elements of type `B`.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const mapAccum: {
    <S, A, B>(s: S, f: (s: S, a: A) => readonly [S, B]): (self: Iterable<A>) => [S, Array<B>];
    <S, A, B>(self: Iterable<A>, s: S, f: (s: S, a: A) => readonly [S, B]): [S, Array<B>];
};
/**
 * Zips this chunk crosswise with the specified chunk using the specified combiner.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const cartesianWith: {
    <A, B, C>(that: ReadonlyArray<B>, f: (a: A, b: B) => C): (self: ReadonlyArray<A>) => Array<C>;
    <A, B, C>(self: ReadonlyArray<A>, that: ReadonlyArray<B>, f: (a: A, b: B) => C): Array<C>;
};
/**
 * Zips this chunk crosswise with the specified chunk.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const cartesian: {
    <B>(that: ReadonlyArray<B>): <A>(self: ReadonlyArray<A>) => Array<[A, B]>;
    <A, B>(self: ReadonlyArray<A>, that: ReadonlyArray<B>): Array<[A, B]>;
};
//# sourceMappingURL=ReadonlyArray.d.ts.map