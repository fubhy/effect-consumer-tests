/**
 * @since 2.0.0
 */
import * as Equal from "./Equal.js";
import type { Inspectable } from "./Inspectable.js";
import type { Order } from "./Order.js";
import type { Pipeable } from "./Pipeable.js";
import type { Predicate, Refinement } from "./Predicate.js";
declare const TypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface SortedSet<A> extends Iterable<A>, Equal.Equal, Pipeable, Inspectable {
    readonly [TypeId]: {
        readonly _A: (_: never) => A;
    };
}
/**
 * @since 2.0.0
 * @category refinements
 */
export declare const isSortedSet: {
    <A>(u: Iterable<A>): u is SortedSet<A>;
    (u: unknown): u is SortedSet<unknown>;
};
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const empty: <A>(O: Order<A>) => SortedSet<A>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const fromIterable: <K>(ord: Order<K>) => (iterable: Iterable<K>) => SortedSet<K>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <K>(ord: Order<K>) => <Entries extends readonly K[]>(...entries: Entries) => SortedSet<Entries[number]>;
/**
 * @since 2.0.0
 * @category elements
 */
export declare const add: {
    <A>(value: A): (self: SortedSet<A>) => SortedSet<A>;
    <A>(self: SortedSet<A>, value: A): SortedSet<A>;
};
/**
 * @since 2.0.0
 */
export declare const difference: {
    <A, B extends A>(that: Iterable<B>): (self: SortedSet<A>) => SortedSet<A>;
    <A, B extends A>(self: SortedSet<A>, that: Iterable<B>): SortedSet<A>;
};
/**
 * Check if a predicate holds true for every `SortedSet` element.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const every: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: SortedSet<A>) => self is SortedSet<B>;
    <A>(predicate: Predicate<A>): (self: SortedSet<A>) => boolean;
    <A, B extends A>(self: SortedSet<A>, refinement: Refinement<A, B>): self is SortedSet<B>;
    <A>(self: SortedSet<A>, predicate: Predicate<A>): boolean;
};
/**
 * @since 2.0.0
 * @category filtering
 */
export declare const filter: {
    <A, B extends A>(refinement: Refinement<A, B>): (self: SortedSet<A>) => SortedSet<B>;
    <A>(predicate: Predicate<A>): (self: SortedSet<A>) => SortedSet<A>;
    <A, B extends A>(self: SortedSet<A>, refinement: Refinement<A, B>): SortedSet<B>;
    <A>(self: SortedSet<A>, predicate: Predicate<A>): SortedSet<A>;
};
/**
 * @since 2.0.0
 * @category sequencing
 */
export declare const flatMap: {
    <B, A>(O: Order<B>, f: (a: A) => Iterable<B>): (self: SortedSet<A>) => SortedSet<B>;
    <A, B>(self: SortedSet<A>, O: Order<B>, f: (a: A) => Iterable<B>): SortedSet<B>;
};
/**
 * @since 2.0.0
 * @category traversing
 */
export declare const forEach: {
    <A>(f: (a: A) => void): (self: SortedSet<A>) => void;
    <A>(self: SortedSet<A>, f: (a: A) => void): void;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const has: {
    <A>(value: A): (self: SortedSet<A>) => boolean;
    <A>(self: SortedSet<A>, value: A): boolean;
};
/**
 * @since 2.0.0
 */
export declare const intersection: {
    <A>(that: Iterable<A>): (self: SortedSet<A>) => SortedSet<A>;
    <A>(self: SortedSet<A>, that: Iterable<A>): SortedSet<A>;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const isSubset: {
    <A>(that: SortedSet<A>): (self: SortedSet<A>) => boolean;
    <A>(self: SortedSet<A>, that: SortedSet<A>): boolean;
};
/**
 * @since 2.0.0
 * @category mapping
 */
export declare const map: {
    <B, A>(O: Order<B>, f: (a: A) => B): (self: SortedSet<A>) => SortedSet<B>;
    <B, A>(self: SortedSet<A>, O: Order<B>, f: (a: A) => B): SortedSet<B>;
};
/**
 * @since 2.0.0
 * @category filtering
 */
export declare const partition: {
    <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (self: SortedSet<C>) => [SortedSet<Exclude<C, B>>, SortedSet<B>];
    <B extends A, A = B>(predicate: (a: A) => boolean): (self: SortedSet<B>) => [SortedSet<B>, SortedSet<B>];
    <C extends A, B extends A, A = C>(self: SortedSet<C>, refinement: Refinement<A, B>): [SortedSet<Exclude<C, B>>, SortedSet<B>];
    <B extends A, A = B>(self: SortedSet<B>, predicate: (a: A) => boolean): [SortedSet<B>, SortedSet<B>];
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const remove: {
    <A>(value: A): (self: SortedSet<A>) => SortedSet<A>;
    <A>(self: SortedSet<A>, value: A): SortedSet<A>;
};
/**
 * @since 2.0.0
 * @category getters
 */
export declare const size: <A>(self: SortedSet<A>) => number;
/**
 * Check if a predicate holds true for some `SortedSet` element.
 *
 * @since 2.0.0
 * @category elements
 */
export declare const some: {
    <A>(predicate: Predicate<A>): (self: SortedSet<A>) => boolean;
    <A>(self: SortedSet<A>, predicate: Predicate<A>): boolean;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const toggle: {
    <A>(value: A): (self: SortedSet<A>) => SortedSet<A>;
    <A>(self: SortedSet<A>, value: A): SortedSet<A>;
};
/**
 * @since 2.0.0
 */
export declare const union: {
    <A>(that: Iterable<A>): (self: SortedSet<A>) => SortedSet<A>;
    <A>(self: SortedSet<A>, that: Iterable<A>): SortedSet<A>;
};
/**
 * @since 2.0.0
 * @category getters
 */
export declare const values: <A>(self: SortedSet<A>) => IterableIterator<A>;
export {};
//# sourceMappingURL=SortedSet.d.ts.map