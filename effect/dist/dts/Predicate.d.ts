import type { TypeLambda } from "./HKT.js";
/**
 * @category models
 * @since 2.0.0
 */
export interface Predicate<A> {
    (a: A): boolean;
}
/**
 * @category type lambdas
 * @since 2.0.0
 */
export interface PredicateTypeLambda extends TypeLambda {
    readonly type: Predicate<this["Target"]>;
}
/**
 * @category models
 * @since 2.0.0
 */
export interface Refinement<A, B extends A> {
    (a: A): a is B;
}
/**
 * Given a `Predicate<A>` returns a `Predicate<B>`
 *
 * @param self - the `Predicate<A>` to be transformed to `Predicate<B>`.
 * @param f - a function to transform `B` to `A`.
 *
 * @example
 * import * as P from "effect/Predicate"
 * import * as N from "effect/Number"
 *
 * const minLength3 = P.mapInput(N.greaterThan(2), (s: string) => s.length)
 *
 * assert.deepStrictEqual(minLength3("a"), false)
 * assert.deepStrictEqual(minLength3("aa"), false)
 * assert.deepStrictEqual(minLength3("aaa"), true)
 * assert.deepStrictEqual(minLength3("aaaa"), true)
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const mapInput: {
    <B, A>(f: (b: B) => A): (self: Predicate<A>) => Predicate<B>;
    <A, B>(self: Predicate<A>, f: (b: B) => A): Predicate<B>;
};
/**
 * Tests if a value is a `string`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isString } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isString("a"), true)
 *
 * assert.deepStrictEqual(isString(1), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isString: (input: unknown) => input is string;
/**
 * Tests if a value is a `number`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNumber } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNumber(2), true)
 *
 * assert.deepStrictEqual(isNumber("2"), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNumber: (input: unknown) => input is number;
/**
 * Tests if a value is a `boolean`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isBoolean } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isBoolean(true), true)
 *
 * assert.deepStrictEqual(isBoolean("true"), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isBoolean: (input: unknown) => input is boolean;
/**
 * Tests if a value is a `bigint`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isBigInt } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isBigInt(1n), true)
 *
 * assert.deepStrictEqual(isBigInt(1), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isBigInt: (input: unknown) => input is bigint;
/**
 * Tests if a value is a `symbol`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isSymbol } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isSymbol(Symbol.for("a")), true)
 *
 * assert.deepStrictEqual(isSymbol("a"), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isSymbol: (input: unknown) => input is symbol;
/**
 * Tests if a value is a `function`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isFunction } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isFunction(isFunction), true)
 *
 * assert.deepStrictEqual(isFunction("function"), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isFunction: (input: unknown) => input is Function;
/**
 * Tests if a value is `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isUndefined } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isUndefined(undefined), true)
 *
 * assert.deepStrictEqual(isUndefined(null), false)
 * assert.deepStrictEqual(isUndefined("undefined"), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isUndefined: (input: unknown) => input is undefined;
/**
 * Tests if a value is not `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNotUndefined } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNotUndefined(null), true)
 * assert.deepStrictEqual(isNotUndefined("undefined"), true)
 *
 * assert.deepStrictEqual(isNotUndefined(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNotUndefined: <A>(input: A) => input is Exclude<A, undefined>;
/**
 * Tests if a value is `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNull } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNull(null), true)
 *
 * assert.deepStrictEqual(isNull(undefined), false)
 * assert.deepStrictEqual(isNull("null"), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNull: (input: unknown) => input is null;
/**
 * Tests if a value is not `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNotNull } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNotNull(undefined), true)
 * assert.deepStrictEqual(isNotNull("null"), true)
 *
 * assert.deepStrictEqual(isNotNull(null), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNotNull: <A>(input: A) => input is Exclude<A, null>;
/**
 * A guard that always fails.
 *
 * @param _ - The value to test.
 *
 * @example
 * import { isNever } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNever(null), false)
 * assert.deepStrictEqual(isNever(undefined), false)
 * assert.deepStrictEqual(isNever({}), false)
 * assert.deepStrictEqual(isNever([]), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNever: (input: unknown) => input is never;
/**
 * A guard that always succeeds.
 *
 * @param _ - The value to test.
 *
 * @example
 * import { isUnknown } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isUnknown(null), true)
 * assert.deepStrictEqual(isUnknown(undefined), true)
 *
 * assert.deepStrictEqual(isUnknown({}), true)
 * assert.deepStrictEqual(isUnknown([]), true)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isUnknown: (input: unknown) => input is unknown;
/**
 * Tests if a value is an `object`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isObject } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isObject({}), true)
 * assert.deepStrictEqual(isObject([]), true)
 *
 * assert.deepStrictEqual(isObject(null), false)
 * assert.deepStrictEqual(isObject(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isObject: (input: unknown) => input is object;
/**
 * Checks whether a value is an `object` containing a specified property key.
 *
 * @param property - The field to check within the object.
 * @param self - The value to examine.
 *
 * @category guards
 * @since 2.0.0
 */
export declare const hasProperty: {
    <P extends PropertyKey>(property: P): (self: unknown) => self is {
        [K in P]: unknown;
    };
    <P extends PropertyKey>(self: unknown, property: P): self is {
        [K in P]: unknown;
    };
};
/**
 * Tests if a value is an `object` with a property `_tag` that matches the given tag.
 *
 * @param input - The value to test.
 * @param tag - The tag to test for.
 *
 * @example
 * import { isTagged } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isTagged(1, "a"), false)
 * assert.deepStrictEqual(isTagged(null, "a"), false)
 * assert.deepStrictEqual(isTagged({}, "a"), false)
 * assert.deepStrictEqual(isTagged({ a: "a" }, "a"), false)
 * assert.deepStrictEqual(isTagged({ _tag: "a" }, "a"), true)
 * assert.deepStrictEqual(isTagged("a")({ _tag: "a" }), true)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isTagged: {
    <K extends string>(tag: K): (self: unknown) => self is {
        _tag: K;
    };
    <K extends string>(self: unknown, tag: K): self is {
        _tag: K;
    };
};
/**
 * A guard that succeeds when the input is `null` or `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNullable } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNullable(null), true)
 * assert.deepStrictEqual(isNullable(undefined), true)
 *
 * assert.deepStrictEqual(isNullable({}), false)
 * assert.deepStrictEqual(isNullable([]), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNullable: <A>(input: A) => input is Extract<A, null | undefined>;
/**
 * A guard that succeeds when the input is not `null` or `undefined`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isNotNullable } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isNotNullable({}), true)
 * assert.deepStrictEqual(isNotNullable([]), true)
 *
 * assert.deepStrictEqual(isNotNullable(null), false)
 * assert.deepStrictEqual(isNotNullable(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isNotNullable: <A>(input: A) => input is NonNullable<A>;
/**
 * A guard that succeeds when the input is an `Error`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isError } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isError(new Error()), true)
 *
 * assert.deepStrictEqual(isError(null), false)
 * assert.deepStrictEqual(isError({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isError: (input: unknown) => input is Error;
/**
 * A guard that succeeds when the input is a `Uint8Array`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isUint8Array } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isUint8Array(new Uint8Array()), true)
 *
 * assert.deepStrictEqual(isUint8Array(null), false)
 * assert.deepStrictEqual(isUint8Array({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isUint8Array: (input: unknown) => input is Uint8Array;
/**
 * A guard that succeeds when the input is a `Date`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isDate } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isDate(new Date()), true)
 *
 * assert.deepStrictEqual(isDate(null), false)
 * assert.deepStrictEqual(isDate({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isDate: (input: unknown) => input is Date;
/**
 * A guard that succeeds when the input is an `Iterable`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isIterable } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isIterable([]), true)
 * assert.deepStrictEqual(isIterable(new Set()), true)
 *
 * assert.deepStrictEqual(isIterable(null), false)
 * assert.deepStrictEqual(isIterable({}), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isIterable: (input: unknown) => input is Iterable<unknown>;
/**
 * A guard that succeeds when the input is a record.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isRecord } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isRecord({}), true)
 * assert.deepStrictEqual(isRecord({ a: 1 }), true)
 *
 * assert.deepStrictEqual(isRecord([]), false)
 * assert.deepStrictEqual(isRecord([1, 2, 3]), false)
 * assert.deepStrictEqual(isRecord(null), false)
 * assert.deepStrictEqual(isRecord(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isRecord: (input: unknown) => input is {
    [x: string]: unknown;
    [x: symbol]: unknown;
};
/**
 * A guard that succeeds when the input is a readonly record.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isReadonlyRecord } from "effect/Predicate"
 *
 * assert.deepStrictEqual(isReadonlyRecord({}), true)
 * assert.deepStrictEqual(isReadonlyRecord({ a: 1 }), true)
 *
 * assert.deepStrictEqual(isReadonlyRecord([]), false)
 * assert.deepStrictEqual(isReadonlyRecord([1, 2, 3]), false)
 * assert.deepStrictEqual(isReadonlyRecord(null), false)
 * assert.deepStrictEqual(isReadonlyRecord(undefined), false)
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isReadonlyRecord: (input: unknown) => input is {
    readonly [x: string | symbol]: unknown;
};
/**
 * @since 2.0.0
 */
export declare const compose: {
    <A, B extends A, C extends B>(bc: Refinement<B, C>): (ab: Refinement<A, B>) => Refinement<A, C>;
    <A, B extends A, C extends B>(ab: Refinement<A, B>, bc: Refinement<B, C>): Refinement<A, C>;
};
/**
 * @category combining
 * @since 2.0.0
 */
export declare const product: <A, B>(self: Predicate<A>, that: Predicate<B>) => Predicate<readonly [A, B]>;
/**
 * @category combining
 * @since 2.0.0
 */
export declare const all: <A>(collection: Iterable<Predicate<A>>) => Predicate<readonly A[]>;
/**
 * @category combining
 * @since 2.0.0
 */
export declare const productMany: <A>(self: Predicate<A>, collection: Iterable<Predicate<A>>) => Predicate<readonly [A, ...A[]]>;
/**
 * Similar to `Promise.all` but operates on `Predicate`s.
 *
 * ```
 * [Predicate<A>, Predicate<B>, ...] -> Predicate<[A, B, ...]>
 * ```
 *
 * @since 2.0.0
 */
export declare const tuple: <T extends readonly Predicate<any>[]>(...elements: T) => Predicate<Readonly<{ [I in keyof T]: [T[I]] extends [Predicate<infer A>] ? A : never; }>>;
/**
 * @since 2.0.0
 */
export declare const struct: <R extends Record<string, Predicate<any>>>(fields: R) => Predicate<{ readonly [K in keyof R]: [R[K]] extends [Predicate<infer A>] ? A : never; }>;
/**
 * Negates the result of a given predicate.
 *
 * @param self - A predicate.
 *
 * @example
 * import * as P from "effect/Predicate"
 * import * as N from "effect/Number"
 *
 * const isPositive = P.not(N.lessThan(0))
 *
 * assert.deepStrictEqual(isPositive(-1), false)
 * assert.deepStrictEqual(isPositive(0), true)
 * assert.deepStrictEqual(isPositive(1), true)
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const not: <A>(self: Predicate<A>) => Predicate<A>;
/**
 * Combines two predicates into a new predicate that returns `true` if at least one of the predicates returns `true`.
 *
 * @param self - A predicate.
 * @param that - A predicate.
 *
 * @example
 * import * as P from "effect/Predicate"
 * import * as N from "effect/Number"
 *
 * const nonZero = P.or(N.lessThan(0), N.greaterThan(0))
 *
 * assert.deepStrictEqual(nonZero(-1), true)
 * assert.deepStrictEqual(nonZero(0), false)
 * assert.deepStrictEqual(nonZero(1), true)
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const or: {
    <A>(that: Predicate<A>): (self: Predicate<A>) => Predicate<A>;
    <A>(self: Predicate<A>, that: Predicate<A>): Predicate<A>;
};
/**
 * Combines two predicates into a new predicate that returns `true` if both of the predicates returns `true`.
 *
 * @param self - A predicate.
 * @param that - A predicate.
 *
 * @example
 * import * as P from "effect/Predicate"
 *
 * const minLength = (n: number) => (s: string) => s.length >= n
 * const maxLength = (n: number) => (s: string) => s.length <= n
 *
 * const length = (n: number) => P.and(minLength(n), maxLength(n))
 *
 * assert.deepStrictEqual(length(2)("aa"), true)
 * assert.deepStrictEqual(length(2)("a"), false)
 * assert.deepStrictEqual(length(2)("aaa"), false)
 *
 * @category combinators
 * @since 2.0.0
 */
export declare const and: {
    <A, C extends A>(that: Refinement<A, C>): <B extends A>(self: Refinement<A, B>) => Refinement<A, B & C>;
    <A, B extends A, C extends A>(self: Refinement<A, B>, that: Refinement<A, C>): Refinement<A, B & C>;
    <A>(that: Predicate<A>): (self: Predicate<A>) => Predicate<A>;
    <A>(self: Predicate<A>, that: Predicate<A>): Predicate<A>;
};
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const xor: {
    <A>(that: Predicate<A>): (self: Predicate<A>) => Predicate<A>;
    <A>(self: Predicate<A>, that: Predicate<A>): Predicate<A>;
};
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const eqv: {
    <A>(that: Predicate<A>): (self: Predicate<A>) => Predicate<A>;
    <A>(self: Predicate<A>, that: Predicate<A>): Predicate<A>;
};
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const implies: {
    <A>(that: Predicate<A>): (self: Predicate<A>) => Predicate<A>;
    <A>(self: Predicate<A>, that: Predicate<A>): Predicate<A>;
};
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const nor: {
    <A>(that: Predicate<A>): (self: Predicate<A>) => Predicate<A>;
    <A>(self: Predicate<A>, that: Predicate<A>): Predicate<A>;
};
/**
 * @category combinators
 * @since 2.0.0
 */
export declare const nand: {
    <A>(that: Predicate<A>): (self: Predicate<A>) => Predicate<A>;
    <A>(self: Predicate<A>, that: Predicate<A>): Predicate<A>;
};
/**
 * @category elements
 * @since 2.0.0
 */
export declare const every: <A>(collection: Iterable<Predicate<A>>) => Predicate<A>;
/**
 * @category elements
 * @since 2.0.0
 */
export declare const some: <A>(collection: Iterable<Predicate<A>>) => Predicate<A>;
//# sourceMappingURL=Predicate.d.ts.map