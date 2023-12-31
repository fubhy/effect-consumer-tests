/**
 * A data type for immutable linked lists representing ordered collections of elements of type `A`.
 *
 * This data type is optimal for last-in-first-out (LIFO), stack-like access patterns. If you need another access pattern, for example, random access or FIFO, consider using a collection more suited to this than `List`.
 *
 * **Performance**
 *
 * - Time: `List` has `O(1)` prepend and head/tail access. Most other operations are `O(n)` on the number of elements in the list. This includes the index-based lookup of elements, `length`, `append` and `reverse`.
 * - Space: `List` implements structural sharing of the tail list. This means that many operations are either zero- or constant-memory cost.
 *
 * @since 2.0.0
 */
/**
 * This file is ported from
 *
 * Scala (https://www.scala-lang.org)
 *
 * Copyright EPFL and Lightbend, Inc.
 *
 * Licensed under Apache License 2.0
 * (http://www.apache.org/licenses/LICENSE-2.0).
 */
import * as Chunk from "./Chunk.js";
import * as Either from "./Either.js";
import * as Equal from "./Equal.js";
import * as Equivalence from "./Equivalence.js";
import { type Inspectable } from "./Inspectable.js";
import * as Option from "./Option.js";
import type { Pipeable } from "./Pipeable.js";
import { type Predicate, type Refinement } from "./Predicate.js";
import * as ReadonlyArray from "./ReadonlyArray.js";
/**
 * Represents an immutable linked list of elements of type `A`.
 *
 * A `List` is optimal for last-in-first-out (LIFO), stack-like access patterns.
 * If you need another access pattern, for example, random access or FIFO,
 * consider using a collection more suited for that other than `List`.
 *
 * @since 2.0.0
 * @category models
 */
export type List<A> = Cons<A> | Nil<A>;
/**
 * @since 2.0.0
 * @category symbol
 */
export declare const TypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface Nil<A> extends Iterable<A>, Equal.Equal, Pipeable, Inspectable {
    readonly [TypeId]: TypeId;
    readonly _tag: "Nil";
}
/**
 * @since 2.0.0
 * @category models
 */
export interface Cons<A> extends Iterable<A>, Equal.Equal, Pipeable, Inspectable {
    readonly [TypeId]: TypeId;
    readonly _tag: "Cons";
    readonly head: A;
    readonly tail: List<A>;
}
/**
 * Converts the specified `List` to a `ReadonlyArray`.
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const toReadonlyArray: <A>(self: List<A>) => readonly A[];
/**
 * @category equivalence
 * @since 2.0.0
 */
export declare const getEquivalence: <A>(isEquivalent: Equivalence.Equivalence<A>) => Equivalence.Equivalence<List<A>>;
/**
 * Returns `true` if the specified value is a `List`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isList: {
    <A>(u: Iterable<A>): u is List<A>;
    (u: unknown): u is List<unknown>;
};
/**
 * Returns `true` if the specified value is a `List.Nil<A>`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isNil: <A>(self: List<A>) => self is Nil<A>;
/**
 * Returns `true` if the specified value is a `List.Cons<A>`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isCons: <A>(self: List<A>) => self is Cons<A>;
/**
 * Returns the number of elements contained in the specified `List`
 *
 * @since 2.0.0
 * @category getters
 */
export declare const size: <A>(self: List<A>) => number;
/**
 * Constructs a new empty `List<A>`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const nil: <A = never>() => List<A>;
/**
 * Constructs a new `List.Cons<A>` from the specified `head` and `tail` values.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const cons: <A>(head: A, tail: List<A>) => Cons<A>;
/**
 * Constructs a new empty `List<A>`.
 *
 * Alias of {@link nil}.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const empty: <A = never>() => List<A>;
/**
 * Constructs a new `List<A>` from the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const of: <A>(value: A) => Cons<A>;
/**
 * Constructs a new `List<A>` from the specified `Iterable<A>`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromIterable: <A>(prefix: Iterable<A>) => List<A>;
/**
 * Constructs a new `List<A>` from the specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <Elements extends readonly [any, ...any[]]>(...elements: Elements) => Cons<Elements[number]>;
/**
 * Appends the specified element to the end of the `List`, creating a new `Cons`.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const append: {
    <B>(element: B): <A>(self: List<A>) => Cons<A | B>;
    <A, B>(self: List<A>, element: B): Cons<A | B>;
};
/**
 * Concatentates the specified lists together.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const appendAll: {
    <B>(that: List<B>): <A>(self: List<A>) => List<A | B>;
    <A, B>(self: List<A>, that: List<B>): List<A | B>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const appendAllNonEmpty: {
    <B>(that: Cons<B>): <A>(self: List<A>) => Cons<B | A>;
    <B>(that: List<B>): <A>(self: Cons<A>) => Cons<B | A>;
    <A, B>(self: List<A>, that: Cons<B>): Cons<A | B>;
    <A, B>(self: Cons<A>, that: List<B>): Cons<A | B>;
};
/**
 * Prepends the specified element to the beginning of the list.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const prepend: {
    <B>(element: B): <A>(self: List<A>) => Cons<A | B>;
    <A, B>(self: List<A>, element: B): Cons<A | B>;
};
/**
 * Prepends the specified prefix list to the beginning of the specified list.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const prependAll: {
    <B>(prefix: List<B>): <A>(self: List<A>) => List<A | B>;
    <A, B>(self: List<A>, prefix: List<B>): List<A | B>;
};
/**
 * @category concatenating
 * @since 2.0.0
 */
export declare const prependAllNonEmpty: {
    <B>(that: Cons<B>): <A>(self: List<A>) => Cons<B | A>;
    <B>(that: List<B>): <A>(self: Cons<A>) => Cons<B | A>;
    <A, B>(self: List<A>, that: Cons<B>): Cons<A | B>;
    <A, B>(self: Cons<A>, that: List<B>): Cons<A | B>;
};
/**
 * Prepends the specified prefix list (in reverse order) to the beginning of the
 * specified list.
 *
 * @category concatenating
 * @since 2.0.0
 */
export declare const prependAllReversed: {
    <B>(prefix: List<B>): <A>(self: List<A>) => List<A | B>;
    <A, B>(self: List<A>, prefix: List<B>): List<A | B>;
};
/**
 * Drops the first `n` elements from the specified list.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const drop: {
    (n: number): <A>(self: List<A>) => List<A>;
    <A>(self: List<A>, n: number): List<A>;
};
/**
 * Check if a predicate holds true for every `List` element.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const every: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: List<A>) => self is List<B>;
    <A>(predicate: Predicate<A>): (self: List<A>) => boolean;
    <A, B extends A>(self: List<A>, refinement: Refinement<A, B>): self is List<B>;
    <A>(self: List<A>, predicate: Predicate<A>): boolean;
};
/**
 * Check if a predicate holds true for some `List` element.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const some: {
    <A>(predicate: Predicate<A>): <B extends A>(self: List<B>) => self is Cons<B>;
    <B extends A, A = B>(self: List<B>, predicate: Predicate<A>): self is Cons<B>;
};
/**
 * Filters a list using the specified predicate.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const filter: {
    <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (self: List<C>) => List<B>;
    <B extends A, A = B>(predicate: Predicate<A>): (self: List<B>) => List<B>;
    <C extends A, B extends A, A = C>(self: List<C>, refinement: Refinement<A, B>): List<B>;
    <B extends A, A = B>(self: List<B>, predicate: Predicate<A>): List<B>;
};
/**
 * Filters and maps a list using the specified partial function. The resulting
 * list may be smaller than the input list due to the possibility of the partial
 * function not being defined for some elements.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const filterMap: {
    <A, B>(f: (a: A) => Option.Option<B>): (self: List<A>) => List<B>;
    <A, B>(self: List<A>, f: (a: A) => Option.Option<B>): List<B>;
};
/**
 * Removes all `None` values from the specified list.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const compact: <A>(self: List<Option.Option<A>>) => List<A>;
/**
 * Returns the first element that satisfies the specified
 * predicate, or `None` if no such element exists.
 *
 * @category elements
 * @since 2.0.0
 */
export declare const findFirst: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: List<A>) => Option.Option<B>;
    <A>(predicate: Predicate<A>): (self: List<A>) => Option.Option<A>;
    <A, B extends A>(self: List<A>, refinement: Refinement<A, B>): Option.Option<B>;
    <A>(self: List<A>, predicate: Predicate<A>): Option.Option<A>;
};
/**
 * Flat maps a list using the specified function.
 *
 * @since 2.0.0
 * @category sequencing
 */
export declare const flatMap: {
    <A, B>(f: (a: A) => List<B>): (self: List<A>) => List<B>;
    <A, B>(self: List<A>, f: (a: A) => List<B>): List<B>;
};
/**
 * @category sequencing
 * @since 2.0.0
 */
export declare const flatMapNonEmpty: {
    <A, B>(f: (a: A) => Cons<B>): (self: Cons<A>) => Cons<B>;
    <A, B>(self: Cons<A>, f: (a: A) => Cons<B>): Cons<B>;
};
/**
 * Applies the specified function to each element of the `List`.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const forEach: {
    <A, B>(f: (a: A) => B): (self: List<A>) => void;
    <A, B>(self: List<A>, f: (a: A) => B): void;
};
/**
 * Returns the first element of the specified list, or `None` if the list is
 * empty.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const head: <A>(self: List<A>) => Option.Option<A>;
/**
 * Returns the last element of the specified list, or `None` if the list is
 * empty.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const last: <A>(self: List<A>) => Option.Option<A>;
/**
 * @since 2.0.0
 */
export declare namespace List {
    /**
     * @since 2.0.0
     */
    type Infer<T extends List<any>> = T extends List<infer A> ? A : never;
    /**
     * @since 2.0.0
     */
    type With<T extends List<any>, A> = T extends Cons<any> ? Cons<A> : List<A>;
}
/**
 * Applies the specified mapping function to each element of the list.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const map: {
    <T extends List<any>, B>(f: (a: List.Infer<T>, i: number) => B): (self: T) => List.With<T, B>;
    <T extends List<any>, B>(self: T, f: (a: List.Infer<T>, i: number) => B): List.With<T, B>;
};
/**
 * Partition a list into two lists, where the first list contains all elements
 * that did not satisfy the specified predicate, and the second list contains
 * all elements that did satisfy the specified predicate.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const partition: {
    <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (self: List<C>) => [List<Exclude<C, B>>, List<B>];
    <B extends A, A = B>(predicate: (a: A) => boolean): (self: List<B>) => [List<B>, List<B>];
    <C extends A, B extends A, A = C>(self: List<C>, refinement: Refinement<A, B>): [List<Exclude<C, B>>, List<B>];
    <B extends A, A = B>(self: List<B>, predicate: (a: A) => boolean): [List<B>, List<B>];
};
/**
 * Partition a list into two lists, where the first list contains all elements
 * for which the specified function returned a `Left`, and the second list
 * contains all elements for which the specified function returned a `Right`.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const partitionMap: {
    <A, B, C>(f: (a: A) => Either.Either<B, C>): (self: List<A>) => readonly [List<B>, List<C>];
    <A, B, C>(self: List<A>, f: (a: A) => Either.Either<B, C>): readonly [List<B>, List<C>];
};
/**
 * Folds over the elements of the list using the specified function, using the
 * specified initial value.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduce: {
    <Z, A>(zero: Z, f: (b: Z, a: A) => Z): (self: List<A>) => Z;
    <A, Z>(self: List<A>, zero: Z, f: (b: Z, a: A) => Z): Z;
};
/**
 * Folds over the elements of the list using the specified function, beginning
 * with the last element of the list, using the specified initial value.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const reduceRight: {
    <Z, A>(zero: Z, f: (accumulator: Z, value: A) => Z): (self: List<A>) => Z;
    <Z, A>(self: List<A>, zero: Z, f: (accumulator: Z, value: A) => Z): Z;
};
/**
 * Returns a new list with the elements of the specified list in reverse order.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const reverse: <A>(self: List<A>) => List<A>;
/**
 * Splits the specified list into two lists at the specified index.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const splitAt: {
    (n: number): <A>(self: List<A>) => readonly [List<A>, List<A>];
    <A>(self: List<A>, n: number): readonly [List<A>, List<A>];
};
/**
 * Returns the tail of the specified list, or `None` if the list is empty.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const tail: <A>(self: List<A>) => Option.Option<List<A>>;
/**
 * Takes the specified number of elements from the beginning of the specified
 * list.
 *
 * @since 2.0.0
 * @category combinators
 */
export declare const take: {
    (n: number): <A>(self: List<A>) => List<A>;
    <A>(self: List<A>, n: number): List<A>;
};
/**
 * Converts the specified `List` to a `Chunk`.
 *
 * @since 2.0.0
 * @category conversions
 */
export declare const toChunk: <A>(self: List<A>) => Chunk.Chunk<A>;
/**
 * Unsafely returns the first element of the specified `List`.
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeHead: <A>(self: List<A>) => A;
/**
 * Unsafely returns the last element of the specified `List`.
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeLast: <A>(self: List<A>) => A;
/**
 * Unsafely returns the tail of the specified `List`.
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeTail: <A>(self: List<A>) => List<A>;
//# sourceMappingURL=List.d.ts.map