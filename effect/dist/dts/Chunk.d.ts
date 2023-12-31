/**
 * @since 2.0.0
 */
import type { Either } from "./Either.js";
import * as Equal from "./Equal.js";
import * as Equivalence from "./Equivalence.js";
import type { TypeLambda } from "./HKT.js";
import { type Inspectable } from "./Inspectable.js";
import type { NonEmptyIterable } from "./NonEmptyIterable.js";
import type { Option } from "./Option.js";
import * as Order from "./Order.js";
import type { Pipeable } from "./Pipeable.js";
import { type Predicate, type Refinement } from "./Predicate.js";
declare const TypeId: unique symbol;
/**
 * @category symbol
 * @since 2.0.0
 */
export type TypeId = typeof TypeId;
/**
 * @category models
 * @since 2.0.0
 */
export interface Chunk<A> extends Iterable<A>, Equal.Equal, Pipeable, Inspectable {
    readonly [TypeId]: {
        readonly _A: (_: never) => A;
    };
    readonly length: number;
}
/**
 * @category model
 * @since 2.0.0
 */
export interface NonEmptyChunk<A> extends Chunk<A>, NonEmptyIterable<A> {
}
/**
 * @category type lambdas
 * @since 2.0.0
 */
export interface ChunkTypeLambda extends TypeLambda {
    readonly type: Chunk<this["Target"]>;
}
/**
 * Compares the two chunks of equal length using the specified function
 *
 * @category equivalence
 * @since 2.0.0
 */
export declare const getEquivalence: <A>(isEquivalent: Equivalence.Equivalence<A>) => Equivalence.Equivalence<Chunk<A>>;
/**
 * Checks if `u` is a `Chunk<unknown>`
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const isChunk: {
    <A>(u: Iterable<A>): u is Chunk<A>;
    (u: unknown): u is Chunk<unknown>;
};
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const empty: <A = never>() => Chunk<A>;
/**
 * Builds a `NonEmptyChunk` from an non-empty collection of elements.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const make: <As extends readonly [any, ...any[]]>(...as: As) => NonEmptyChunk<As[number]>;
/**
 * Builds a `NonEmptyChunk` from a single element.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const of: <A>(a: A) => NonEmptyChunk<A>;
/**
 * Converts from an `Iterable<A>`
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const fromIterable: <A>(self: Iterable<A>) => Chunk<A>;
/**
 * Converts the specified `Chunk` to a `ReadonlyArray`.
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const toReadonlyArray: <A>(self: Chunk<A>) => readonly A[];
/**
 * @since 2.0.0
 * @category elements
 */
export declare const reverse: <A>(self: Chunk<A>) => Chunk<A>;
/**
 * This function provides a safe way to read a value at a particular index from a `Chunk`.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const get: {
    (index: number): <A>(self: Chunk<A>) => Option<A>;
    <A>(self: Chunk<A>, index: number): Option<A>;
};
/**
 * Wraps an array into a chunk without copying, unsafe on mutable arrays
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeFromArray: <A>(self: readonly A[]) => Chunk<A>;
/**
 * Wraps an array into a chunk without copying, unsafe on mutable arrays
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeFromNonEmptyArray: <A>(self: readonly [A, ...A[]]) => NonEmptyChunk<A>;
/**
 * Gets an element unsafely, will throw on out of bounds
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeGet: {
    (index: number): <A>(self: Chunk<A>) => A;
    <A>(self: Chunk<A>, index: number): A;
};
/**
 * Appends the specified element to the end of the `Chunk`.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const append: {
    <A2>(a: A2): <A>(self: Chunk<A>) => NonEmptyChunk<A2 | A>;
    <A, A2>(self: Chunk<A>, a: A2): NonEmptyChunk<A | A2>;
};
/**
 * Prepend an element to the front of a `Chunk`, creating a new `NonEmptyChunk`.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const prepend: {
    <B>(elem: B): <A>(self: Chunk<A>) => NonEmptyChunk<B | A>;
    <A, B>(self: Chunk<A>, elem: B): NonEmptyChunk<A | B>;
};
/**
 * Takes the first up to `n` elements from the chunk
 *
 * @since 2.0.0
 */
export declare const take: {
    (n: number): <A>(self: Chunk<A>) => Chunk<A>;
    <A>(self: Chunk<A>, n: number): Chunk<A>;
};
/**
 * Drops the first up to `n` elements from the chunk
 *
 * @since 2.0.0
 */
export declare const drop: {
    (n: number): <A>(self: Chunk<A>) => Chunk<A>;
    <A>(self: Chunk<A>, n: number): Chunk<A>;
};
/**
 * Drops the last `n` elements.
 *
 * @since 2.0.0
 */
export declare const dropRight: {
    (n: number): <A>(self: Chunk<A>) => Chunk<A>;
    <A>(self: Chunk<A>, n: number): Chunk<A>;
};
/**
 * Drops all elements so long as the predicate returns true.
 *
 * @since 2.0.0
 */
export declare const dropWhile: {
    <A>(f: (a: A) => boolean): (self: Chunk<A>) => Chunk<A>;
    <A>(self: Chunk<A>, f: (a: A) => boolean): Chunk<A>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const prependAll: {
    <B>(that: Chunk<B>): <A>(self: Chunk<A>) => Chunk<B | A>;
    <A, B>(self: Chunk<A>, that: Chunk<B>): Chunk<A | B>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const prependAllNonEmpty: {
    <B>(that: NonEmptyChunk<B>): <A>(self: Chunk<A>) => NonEmptyChunk<B | A>;
    <B>(that: Chunk<B>): <A>(self: NonEmptyChunk<A>) => NonEmptyChunk<B | A>;
    <A, B>(self: Chunk<A>, that: NonEmptyChunk<B>): NonEmptyChunk<A | B>;
    <A, B>(self: NonEmptyChunk<A>, that: Chunk<B>): NonEmptyChunk<A | B>;
};
/**
 * Concatenates the two chunks
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const appendAll: {
    <B>(that: Chunk<B>): <A>(self: Chunk<A>) => Chunk<B | A>;
    <A, B>(self: Chunk<A>, that: Chunk<B>): Chunk<A | B>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const appendAllNonEmpty: {
    <B>(that: NonEmptyChunk<B>): <A>(self: Chunk<A>) => NonEmptyChunk<B | A>;
    <B>(that: Chunk<B>): <A>(self: NonEmptyChunk<A>) => NonEmptyChunk<B | A>;
    <A, B>(self: Chunk<A>, that: NonEmptyChunk<B>): NonEmptyChunk<A | B>;
    <A, B>(self: NonEmptyChunk<A>, that: Chunk<B>): NonEmptyChunk<A | B>;
};
/**
 * Returns a filtered and mapped subset of the elements.
 *
 * @since 2.0.0
 * @category filtering
 */
export declare const filterMap: {
    <A, B>(f: (a: A, i: number) => Option<B>): (self: Chunk<A>) => Chunk<B>;
    <A, B>(self: Chunk<A>, f: (a: A, i: number) => Option<B>): Chunk<B>;
};
/**
 * Returns a filtered and mapped subset of the elements.
 *
 * @since 2.0.0
 * @category filtering
 */
export declare const filter: {
    <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (self: Chunk<C>) => Chunk<B>;
    <B extends A, A = B>(predicate: Predicate<A>): (self: Chunk<B>) => Chunk<B>;
    <C extends A, B extends A, A = C>(self: Chunk<C>, refinement: Refinement<A, B>): Chunk<B>;
    <B extends A, A = B>(self: Chunk<B>, predicate: Predicate<A>): Chunk<B>;
};
/**
 * Transforms all elements of the chunk for as long as the specified function returns some value
 *
 * @since 2.0.0
 * @category filtering
 */
export declare const filterMapWhile: {
    <A, B>(f: (a: A) => Option<B>): (self: Chunk<A>) => Chunk<B>;
    <A, B>(self: Chunk<A>, f: (a: A) => Option<B>): Chunk<B>;
};
/**
 * Filter out optional values
 *
 * @since 2.0.0
 * @category filtering
 */
export declare const compact: <A>(self: Chunk<Option<A>>) => Chunk<A>;
/**
 * Returns a chunk with the elements mapped by the specified function.
 *
 * @since 2.0.0
 * @category sequencing
 */
export declare const flatMap: {
    <A, B>(f: (a: A, i: number) => Chunk<B>): (self: Chunk<A>) => Chunk<B>;
    <A, B>(self: Chunk<A>, f: (a: A, i: number) => Chunk<B>): Chunk<B>;
};
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatMapNonEmpty: {
    <A, B>(f: (a: A, i: number) => NonEmptyChunk<B>): (self: NonEmptyChunk<A>) => NonEmptyChunk<B>;
    <A, B>(self: NonEmptyChunk<A>, f: (a: A, i: number) => NonEmptyChunk<B>): NonEmptyChunk<B>;
};
/**
 * Applies the specified function to each element of the `List`.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const forEach: {
    <A, B>(f: (a: A) => B): (self: Chunk<A>) => void;
    <A, B>(self: Chunk<A>, f: (a: A) => B): void;
};
/**
 * Flattens a chunk of chunks into a single chunk by concatenating all chunks.
 *
 * @since 2.0.0
 * @category sequencing
 */
export declare const flatten: <A>(self: Chunk<Chunk<A>>) => Chunk<A>;
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flattenNonEmpty: <A>(self: NonEmptyChunk<NonEmptyChunk<A>>) => NonEmptyChunk<A>;
/**
 * Groups elements in chunks of up to `n` elements.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const chunksOf: {
    (n: number): <A>(self: Chunk<A>) => Chunk<Chunk<A>>;
    <A>(self: Chunk<A>, n: number): Chunk<Chunk<A>>;
};
/**
 * Creates a Chunk of unique values that are included in all given Chunks.
 *
 * The order and references of result values are determined by the Chunk.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const intersection: {
    <A>(that: Chunk<A>): <B>(self: Chunk<B>) => Chunk<A & B>;
    <A, B>(self: Chunk<A>, that: Chunk<B>): Chunk<A & B>;
};
/**
 * Determines if the chunk is empty.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const isEmpty: <A>(self: Chunk<A>) => boolean;
/**
 * Determines if the chunk is not empty.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const isNonEmpty: <A>(self: Chunk<A>) => self is NonEmptyChunk<A>;
/**
 * Returns the first element of this chunk if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const head: <A>(self: Chunk<A>) => Option<A>;
/**
 * Returns the first element of this chunk.
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeHead: <A>(self: Chunk<A>) => A;
/**
 * Returns the first element of this non empty chunk.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const headNonEmpty: <A>(self: NonEmptyChunk<A>) => A;
/**
 * Returns the last element of this chunk if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const last: <A>(self: Chunk<A>) => Option<A>;
/**
 * Returns the last element of this chunk.
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeLast: <A>(self: Chunk<A>) => A;
/**
 * @since 2.0.0
 */
export declare namespace Chunk {
    /**
     * @since 2.0.0
     */
    type Infer<T extends Chunk<any>> = T extends Chunk<infer A> ? A : never;
    /**
     * @since 2.0.0
     */
    type With<T extends Chunk<any>, A> = T extends NonEmptyChunk<any> ? NonEmptyChunk<A> : Chunk<A>;
}
/**
 * Returns a chunk with the elements mapped by the specified f function.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const map: {
    <T extends Chunk<any>, B>(f: (a: Chunk.Infer<T>, i: number) => B): (self: T) => Chunk.With<T, B>;
    <T extends Chunk<any>, B>(self: T, f: (a: Chunk.Infer<T>, i: number) => B): Chunk.With<T, B>;
};
/**
 * Statefully maps over the chunk, producing new elements of type `B`.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const mapAccum: {
    <S, A, B>(s: S, f: (s: S, a: A) => readonly [S, B]): (self: Chunk<A>) => [S, Chunk<B>];
    <S, A, B>(self: Chunk<A>, s: S, f: (s: S, a: A) => readonly [S, B]): [S, Chunk<B>];
};
/**
 * Separate elements based on a predicate that also exposes the index of the element.
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const partition: {
    <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (self: Chunk<C>) => [Chunk<Exclude<C, B>>, Chunk<B>];
    <B extends A, A = B>(predicate: (a: A) => boolean): (self: Chunk<B>) => [Chunk<B>, Chunk<B>];
    <C extends A, B extends A, A = C>(self: Chunk<C>, refinement: Refinement<A, B>): [Chunk<Exclude<C, B>>, Chunk<B>];
    <B extends A, A = B>(self: Chunk<B>, predicate: (a: A) => boolean): [Chunk<B>, Chunk<B>];
};
/**
 * Partitions the elements of this chunk into two chunks using f.
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const partitionMap: {
    <A, B, C>(f: (a: A) => Either<B, C>): (self: Chunk<A>) => [Chunk<B>, Chunk<C>];
    <A, B, C>(self: Chunk<A>, f: (a: A) => Either<B, C>): [Chunk<B>, Chunk<C>];
};
/**
 * Partitions the elements of this chunk into two chunks.
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const separate: <A, B>(self: Chunk<Either<A, B>>) => [Chunk<A>, Chunk<B>];
/**
 * Retireves the size of the chunk
 *
 * @since 2.0.0
 * @category elements
 */
export declare const size: <A>(self: Chunk<A>) => number;
/**
 * Sort the elements of a Chunk in increasing order, creating a new Chunk.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const sort: {
    <B>(O: Order.Order<B>): <A extends B>(self: Chunk<A>) => Chunk<A>;
    <A extends B, B>(self: Chunk<A>, O: Order.Order<B>): Chunk<A>;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const sortWith: {
    <A, B>(f: (a: A) => B, order: Order.Order<B>): (self: Chunk<A>) => Chunk<A>;
    <A, B>(self: Chunk<A>, f: (a: A) => B, order: Order.Order<B>): Chunk<A>;
};
/**
 *  Returns two splits of this chunk at the specified index.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const splitAt: {
    (n: number): <A>(self: Chunk<A>) => [Chunk<A>, Chunk<A>];
    <A>(self: Chunk<A>, n: number): [Chunk<A>, Chunk<A>];
};
/**
 * Splits this chunk into `n` equally sized chunks.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const split: {
    (n: number): <A>(self: Chunk<A>) => Chunk<Chunk<A>>;
    <A>(self: Chunk<A>, n: number): Chunk<Chunk<A>>;
};
/**
 * Splits this chunk on the first element that matches this predicate.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const splitWhere: {
    <A>(predicate: Predicate<A>): (self: Chunk<A>) => [Chunk<A>, Chunk<A>];
    <A>(self: Chunk<A>, predicate: Predicate<A>): [Chunk<A>, Chunk<A>];
};
/**
 * Returns every elements after the first.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const tail: <A>(self: Chunk<A>) => Option<Chunk<A>>;
/**
 * Returns every elements after the first.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const tailNonEmpty: <A>(self: NonEmptyChunk<A>) => Chunk<A>;
/**
 * Takes the last `n` elements.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const takeRight: {
    (n: number): <A>(self: Chunk<A>) => Chunk<A>;
    <A>(self: Chunk<A>, n: number): Chunk<A>;
};
/**
 * Takes all elements so long as the predicate returns true.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const takeWhile: {
    <A>(predicate: Predicate<A>): (self: Chunk<A>) => Chunk<A>;
    <A>(self: Chunk<A>, predicate: Predicate<A>): Chunk<A>;
};
/**
 * Creates a Chunks of unique values, in order, from all given Chunks.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const union: {
    <A>(that: Chunk<A>): <B>(self: Chunk<B>) => Chunk<A | B>;
    <A, B>(self: Chunk<A>, that: Chunk<B>): Chunk<A | B>;
};
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const dedupe: <A>(self: Chunk<A>) => Chunk<A>;
/**
 * Deduplicates adjacent elements that are identical.
 *
 * @since 2.0.0
 * @category filtering
 */
export declare const dedupeAdjacent: <A>(self: Chunk<A>) => Chunk<A>;
/**
 * Takes a `Chunk` of pairs and return two corresponding `Chunk`s.
 *
 * Note: The function is reverse of `zip`.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const unzip: <A, B>(self: Chunk<readonly [A, B]>) => [Chunk<A>, Chunk<B>];
/**
 * Zips this chunk pointwise with the specified chunk using the specified combiner.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const zipWith: {
    <A, B, C>(that: Chunk<B>, f: (a: A, b: B) => C): (self: Chunk<A>) => Chunk<C>;
    <A, B, C>(self: Chunk<A>, that: Chunk<B>, f: (a: A, b: B) => C): Chunk<C>;
};
/**
 * Zips this chunk pointwise with the specified chunk.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const zip: {
    <B>(that: Chunk<B>): <A>(self: Chunk<A>) => Chunk<readonly [A, B]>;
    <A, B>(self: Chunk<A>, that: Chunk<B>): Chunk<readonly [A, B]>;
};
/**
 * Delete the element at the specified index, creating a new `Chunk`,
 * or returning the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
export declare const remove: {
    (i: number): <A>(self: Chunk<A>) => Chunk<A>;
    <A>(self: Chunk<A>, i: number): Chunk<A>;
};
/**
 * @since 2.0.0
 */
export declare const modifyOption: {
    <A, B>(i: number, f: (a: A) => B): (self: Chunk<A>) => Option<Chunk<A | B>>;
    <A, B>(self: Chunk<A>, i: number, f: (a: A) => B): Option<Chunk<A | B>>;
};
/**
 * Apply a function to the element at the specified index, creating a new `Chunk`,
 * or returning the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
export declare const modify: {
    <A, B>(i: number, f: (a: A) => B): (self: Chunk<A>) => Chunk<A | B>;
    <A, B>(self: Chunk<A>, i: number, f: (a: A) => B): Chunk<A | B>;
};
/**
 * Change the element at the specified index, creating a new `Chunk`,
 * or returning the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
export declare const replace: {
    <B>(i: number, b: B): <A>(self: Chunk<A>) => Chunk<B | A>;
    <A, B>(self: Chunk<A>, i: number, b: B): Chunk<B | A>;
};
/**
 * @since 2.0.0
 */
export declare const replaceOption: {
    <B>(i: number, b: B): <A>(self: Chunk<A>) => Option<Chunk<B | A>>;
    <A, B>(self: Chunk<A>, i: number, b: B): Option<Chunk<B | A>>;
};
/**
 * Return a Chunk of length n with element i initialized with f(i).
 *
 * **Note**. `n` is normalized to an integer >= 1.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const makeBy: {
    <A>(f: (i: number) => A): (n: number) => NonEmptyChunk<A>;
    <A>(n: number, f: (i: number) => A): NonEmptyChunk<A>;
};
/**
 * Create a non empty `Chunk` containing a range of integers, including both endpoints.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const range: (start: number, end: number) => NonEmptyChunk<number>;
/**
 * Returns a function that checks if a `Chunk` contains a given value using the default `Equivalence`.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const contains: {
    <A>(a: A): (self: Chunk<A>) => boolean;
    <A>(self: Chunk<A>, a: A): boolean;
};
/**
 * Returns a function that checks if a `Chunk` contains a given value using a provided `isEquivalent` function.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const containsWith: <A>(isEquivalent: (self: A, that: A) => boolean) => {
    (a: A): (self: Chunk<A>) => boolean;
    (self: Chunk<A>, a: A): boolean;
};
/**
 * Returns the first element that satisfies the specified
 * predicate, or `None` if no such element exists.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findFirst: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: Chunk<A>) => Option<B>;
    <A>(predicate: Predicate<A>): <B extends A>(self: Chunk<B>) => Option<B>;
    <A, B extends A>(self: Chunk<A>, refinement: Refinement<A, B>): Option<B>;
    <B extends A, A>(self: Chunk<B>, predicate: Predicate<A>): Option<B>;
};
/**
 * Return the first index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findFirstIndex: {
    <A>(predicate: Predicate<A>): (self: Chunk<A>) => Option<number>;
    <A>(self: Chunk<A>, predicate: Predicate<A>): Option<number>;
};
/**
 * Find the last element for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findLast: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: Chunk<A>) => Option<B>;
    <A>(predicate: Predicate<A>): <B extends A>(self: Chunk<B>) => Option<B>;
    <A, B extends A>(self: Chunk<A>, refinement: Refinement<A, B>): Option<B>;
    <B extends A, A>(self: Chunk<B>, predicate: Predicate<A>): Option<B>;
};
/**
 * Return the last index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findLastIndex: {
    <A>(predicate: Predicate<A>): (self: Chunk<A>) => Option<number>;
    <A>(self: Chunk<A>, predicate: Predicate<A>): Option<number>;
};
/**
 * Check if a predicate holds true for every `Chunk` element.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const every: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: Chunk<A>) => self is Chunk<B>;
    <A>(predicate: Predicate<A>): (self: Chunk<A>) => boolean;
    <A, B extends A>(self: Chunk<A>, refinement: Refinement<A, B>): self is Chunk<B>;
    <A>(self: Chunk<A>, predicate: Predicate<A>): boolean;
};
/**
 * Check if a predicate holds true for some `Chunk` element.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const some: {
    <A>(predicate: Predicate<A>): <B extends A>(self: Chunk<B>) => self is NonEmptyChunk<B>;
    <B extends A, A = B>(self: Chunk<B>, predicate: Predicate<A>): self is NonEmptyChunk<B>;
};
/**
 * Joins the elements together with "sep" in the middle.
 *
 * @category folding
 * @since 2.0.0
 */
export declare const join: {
    (sep: string): (self: Chunk<string>) => string;
    (self: Chunk<string>, sep: string): string;
};
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduce: {
    <B, A>(b: B, f: (b: B, a: A, i: number) => B): (self: Chunk<A>) => B;
    <A, B>(self: Chunk<A>, b: B, f: (b: B, a: A, i: number) => B): B;
};
/**
 * @category folding
 * @since 2.0.0
 */
export declare const reduceRight: {
    <B, A>(b: B, f: (b: B, a: A, i: number) => B): (self: Chunk<A>) => B;
    <A, B>(self: Chunk<A>, b: B, f: (b: B, a: A, i: number) => B): B;
};
export {};
//# sourceMappingURL=Chunk.d.ts.map