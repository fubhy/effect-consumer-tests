import type { TypeLambda } from "./HKT.js";
/**
 * @category type class
 * @since 2.0.0
 */
export interface Equivalence<A> {
    (self: A, that: A): boolean;
}
/**
 * @category type lambdas
 * @since 2.0.0
 */
export interface EquivalenceTypeLambda extends TypeLambda {
    readonly type: Equivalence<this["Target"]>;
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const make: <A>(isEquivalent: (self: A, that: A) => boolean) => Equivalence<A>;
/**
 * Return an `Equivalence` that uses strict equality (===) to compare values.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const strict: <A>() => Equivalence<A>;
/**
 * @category instances
 * @since 2.0.0
 */
export declare const string: Equivalence<string>;
/**
 * @category instances
 * @since 2.0.0
 */
export declare const number: Equivalence<number>;
/**
 * @category instances
 * @since 2.0.0
 */
export declare const boolean: Equivalence<boolean>;
/**
 * @category instances
 * @since 2.0.0
 */
export declare const bigint: Equivalence<bigint>;
/**
 * @category instances
 * @since 2.0.0
 */
export declare const symbol: Equivalence<symbol>;
/**
 * @category combining
 * @since 2.0.0
 */
export declare const combine: {
    <A>(that: Equivalence<A>): (self: Equivalence<A>) => Equivalence<A>;
    <A>(self: Equivalence<A>, that: Equivalence<A>): Equivalence<A>;
};
/**
 * @category combining
 * @since 2.0.0
 */
export declare const combineMany: {
    <A>(collection: Iterable<Equivalence<A>>): (self: Equivalence<A>) => Equivalence<A>;
    <A>(self: Equivalence<A>, collection: Iterable<Equivalence<A>>): Equivalence<A>;
};
/**
 * @category combining
 * @since 2.0.0
 */
export declare const combineAll: <A>(collection: Iterable<Equivalence<A>>) => Equivalence<A>;
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const mapInput: {
    <B, A>(f: (b: B) => A): (self: Equivalence<A>) => Equivalence<B>;
    <A, B>(self: Equivalence<A>, f: (b: B) => A): Equivalence<B>;
};
/**
 * @category instances
 * @since 2.0.0
 */
export declare const Date: Equivalence<Date>;
/**
 * @category combining
 * @since 2.0.0
 */
export declare const product: {
    <B>(that: Equivalence<B>): <A>(self: Equivalence<A>) => Equivalence<readonly [A, B]>;
    <A, B>(self: Equivalence<A>, that: Equivalence<B>): Equivalence<readonly [A, B]>;
};
/**
 * @category combining
 * @since 2.0.0
 */
export declare const all: <A>(collection: Iterable<Equivalence<A>>) => Equivalence<readonly A[]>;
/**
 * @category combining
 * @since 2.0.0
 */
export declare const productMany: <A>(self: Equivalence<A>, collection: Iterable<Equivalence<A>>) => Equivalence<readonly [A, ...A[]]>;
/**
 * Similar to `Promise.all` but operates on `Equivalence`s.
 *
 * ```
 * [Equivalence<A>, Equivalence<B>, ...] -> Equivalence<[A, B, ...]>
 * ```
 *
 * Given a tuple of `Equivalence`s returns a new `Equivalence` that compares values of a tuple
 * by applying each `Equivalence` to the corresponding element of the tuple.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const tuple: <T extends readonly Equivalence<any>[]>(...elements: T) => Equivalence<Readonly<{ [I in keyof T]: [T[I]] extends [Equivalence<infer A>] ? A : never; }>>;
/**
 * Creates a new `Equivalence` for an array of values based on a given `Equivalence` for the elements of the array.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const array: <A>(item: Equivalence<A>) => Equivalence<readonly A[]>;
/**
 * Given a struct of `Equivalence`s returns a new `Equivalence` that compares values of a struct
 * by applying each `Equivalence` to the corresponding property of the struct.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const struct: <R extends Record<string, Equivalence<any>>>(fields: R) => Equivalence<{ readonly [K in keyof R]: [R[K]] extends [Equivalence<infer A>] ? A : never; }>;
//# sourceMappingURL=Equivalence.d.ts.map