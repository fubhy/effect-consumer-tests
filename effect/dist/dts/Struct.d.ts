/**
 * This module provides utility functions for working with structs in TypeScript.
 *
 * @since 2.0.0
 */
import * as Equivalence from "./Equivalence.js";
import * as order from "./Order.js";
import type { Simplify } from "./Types.js";
/**
 * Create a new object by picking properties of an existing object.
 *
 * @example
 * import { pick } from "effect/Struct"
 * import { pipe } from "effect/Function"
 *
 * assert.deepStrictEqual(pipe({ a: "a", b: 1, c: true }, pick("a", "b")), { a: "a", b: 1 })
 *
 * @since 2.0.0
 */
export declare const pick: <S, Keys extends readonly [keyof S, ...(keyof S)[]]>(...keys: Keys) => (s: S) => Simplify<Pick<S, Keys[number]>>;
/**
 * Create a new object by omitting properties of an existing object.
 *
 * @example
 * import { omit } from "effect/Struct"
 * import { pipe } from "effect/Function"
 *
 * assert.deepStrictEqual(pipe({ a: "a", b: 1, c: true }, omit("c")), { a: "a", b: 1 })
 *
 * @since 2.0.0
 */
export declare const omit: <S, Keys extends readonly [keyof S, ...(keyof S)[]]>(...keys: Keys) => (s: S) => Simplify<Omit<S, Keys[number]>>;
/**
 * Given a struct of `Equivalence`s returns a new `Equivalence` that compares values of a struct
 * by applying each `Equivalence` to the corresponding property of the struct.
 *
 * Alias of {@link Equivalence.struct}.
 *
 * @example
 * import { getEquivalence } from "effect/Struct"
 * import * as S from "effect/String"
 * import * as N from "effect/Number"
 *
 * const PersonEquivalence = getEquivalence({
 *   name: S.Equivalence,
 *   age: N.Equivalence
 * })
 *
 * assert.deepStrictEqual(
 *   PersonEquivalence({ name: "John", age: 25 }, { name: "John", age: 25 }),
 *   true
 * )
 * assert.deepStrictEqual(
 *   PersonEquivalence({ name: "John", age: 25 }, { name: "John", age: 40 }),
 *   false
 * )
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const getEquivalence: <R extends Record<string, Equivalence.Equivalence<any>>>(isEquivalents: R) => Equivalence.Equivalence<{
    readonly [K in keyof R]: [R[K]] extends [Equivalence.Equivalence<infer A>] ? A : never;
}>;
/**
 * This function creates and returns a new `Order` for a struct of values based on the given `Order`s
 * for each property in the struct.
 *
 * Alias of {@link order.struct}.
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const getOrder: <R extends {
    readonly [x: string]: order.Order<any>;
}>(fields: R) => order.Order<{
    [K in keyof R]: [R[K]] extends [order.Order<infer A>] ? A : never;
}>;
type PartialTransform<O> = Partial<{
    [K in keyof O]: (a: O[K]) => unknown;
}>;
type Transformed<O, T extends PartialTransform<O>> = unknown & {
    [K in keyof O]: K extends keyof T ? T[K] extends (...a: any) => any ? ReturnType<T[K]> : O[K] : O[K];
};
/**
 * Transforms the values of a Struct provided a transformation function for each key.
 * If no transformation function is provided for a key, it will return the origional value for that key.
 *
 * @example
 * import { evolve } from 'effect/Struct'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     { a: 'a', b: 1, c: 3 },
 *     evolve({
 *       a: (a) => a.length,
 *       b: (b) => b * 2
 *     })
 *   ),
 *   { a: 1, b: 2, c: 3 }
 * )
 *
 * @since 2.0.0
 */
export declare const evolve: {
    <O, T extends PartialTransform<O>>(t: T): (obj: O) => Transformed<O, T>;
    <O, T extends PartialTransform<O>>(obj: O, t: T): Transformed<O, T>;
};
export {};
//# sourceMappingURL=Struct.d.ts.map