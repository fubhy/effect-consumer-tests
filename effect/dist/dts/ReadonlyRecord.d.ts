/**
 * This module provides utility functions for working with records in TypeScript.
 *
 * @since 2.0.0
 */
import type { Either } from "./Either.js";
import type { Equivalence } from "./Equivalence.js";
import type { TypeLambda } from "./HKT.js";
import * as Option from "./Option.js";
/**
 * @category models
 * @since 2.0.0
 */
export interface ReadonlyRecord<A> {
    readonly [x: string]: A;
}
/**
 * @category type lambdas
 * @since 2.0.0
 */
export interface ReadonlyRecordTypeLambda extends TypeLambda {
    readonly type: ReadonlyRecord<this["Target"]>;
}
/**
 * Creates a new, empty record.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const empty: <A>() => Record<string, A>;
/**
 * Determine if a record is empty.
 *
 * @param self - record to test for emptiness.
 *
 * @example
 * import { isEmptyRecord } from "effect/ReadonlyRecord"
 *
 * assert.deepStrictEqual(isEmptyRecord({}), true);
 * assert.deepStrictEqual(isEmptyRecord({ a: 3 }), false);
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isEmptyRecord: <A>(self: Record<string, A>) => self is Record<string, never>;
/**
 * Determine if a record is empty.
 *
 * @param self - record to test for emptiness.
 *
 * @example
 * import { isEmptyReadonlyRecord } from "effect/ReadonlyRecord"
 *
 * assert.deepStrictEqual(isEmptyReadonlyRecord({}), true);
 * assert.deepStrictEqual(isEmptyReadonlyRecord({ a: 3 }), false);
 *
 * @category guards
 * @since 2.0.0
 */
export declare const isEmptyReadonlyRecord: <A>(self: ReadonlyRecord<A>) => self is ReadonlyRecord<never>;
/**
 * Takes an iterable and a projection function and returns a record.
 * The projection function maps each value of the iterable to a tuple of a key and a value, which is then added to the resulting record.
 *
 * @param self - An iterable of values to be mapped to a record.
 * @param f - A projection function that maps values of the iterable to a tuple of a key and a value.
 *
 * @example
 * import { fromIterable } from "effect/ReadonlyRecord"
 *
 * const input = [1, 2, 3, 4]
 *
 * assert.deepStrictEqual(
 *   fromIterable(input, a => [String(a), a * 2]),
 *   { '1': 2, '2': 4, '3': 6, '4': 8 }
 * )
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const fromIterable: {
    <A, B>(f: (a: A) => readonly [string, B]): (self: Iterable<A>) => Record<string, B>;
    <A, B>(self: Iterable<A>, f: (a: A) => readonly [string, B]): Record<string, B>;
};
/**
 * Builds a record from an iterable of key-value pairs.
 *
 * If there are conflicting keys when using `fromEntries`, the last occurrence of the key/value pair will overwrite the
 * previous ones. So the resulting record will only have the value of the last occurrence of each key.
 *
 * @param self - The iterable of key-value pairs.
 *
 * @example
 * import { fromEntries } from "effect/ReadonlyRecord"
 *
 * const input: Array<[string, number]> = [["a", 1], ["b", 2]]
 *
 * assert.deepStrictEqual(fromEntries(input), { a: 1, b: 2 })
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const fromEntries: <A>(self: Iterable<readonly [string, A]>) => Record<string, A>;
/**
 * Transforms the values of a record into an `Array` with a custom mapping function.
 *
 * @param self - The record to transform.
 * @param f - The custom mapping function to apply to each key/value of the record.
 *
 * @example
 * import { collect } from "effect/ReadonlyRecord"
 *
 * const x = { a: 1, b: 2, c: 3 }
 * assert.deepStrictEqual(collect(x, (key, n) => [key, n]), [["a", 1], ["b", 2], ["c", 3]])
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const collect: {
    <K extends string, A, B>(f: (key: K, a: A) => B): (self: Record<K, A>) => Array<B>;
    <K extends string, A, B>(self: Record<K, A>, f: (key: K, a: A) => B): Array<B>;
};
/**
 * Takes a record and returns an array of tuples containing its keys and values.
 *
 * @param self - The record to transform.
 *
 * @example
 * import { toEntries } from "effect/ReadonlyRecord"
 *
 * const x = { a: 1, b: 2, c: 3 }
 * assert.deepStrictEqual(toEntries(x), [["a", 1], ["b", 2], ["c", 3]])
 *
 * @category conversions
 * @since 2.0.0
 */
export declare const toEntries: <K extends string, A>(self: Record<K, A>) => Array<[K, A]>;
/**
 * Returns the number of key/value pairs in a record.
 *
 * @param self - A record to calculate the number of key/value pairs in.
 *
 * @example
 * import { size } from "effect/ReadonlyRecord";
 *
 * assert.deepStrictEqual(size({ a: "a", b: 1, c: true }), 3);
 *
 * @since 2.0.0
 */
export declare const size: <A>(self: ReadonlyRecord<A>) => number;
/**
 * Check if a given `key` exists in a record.
 *
 * @param self - the record to look in.
 * @param key - the key to look for in the record.
 *
 * @example
 * import { has } from "effect/ReadonlyRecord"
 *
 * assert.deepStrictEqual(has({ a: 1, b: 2 }, "a"), true);
 * assert.deepStrictEqual(has({ a: 1, b: 2 }, "c"), false);
 *
 * @since 2.0.0
 */
export declare const has: {
    (key: string): <A>(self: ReadonlyRecord<A>) => boolean;
    <A>(self: ReadonlyRecord<A>, key: string): boolean;
};
/**
 * Retrieve a value at a particular key from a record, returning it wrapped in an `Option`.
 *
 * @param self - The record to retrieve value from.
 * @param key - Key to retrieve from record.
 *
 * @example
 * import { get } from "effect/ReadonlyRecord"
 * import { some, none } from "effect/Option"
 *
 * const person = { name: "John Doe", age: 35 }
 *
 * assert.deepStrictEqual(get(person, "name"), some("John Doe"))
 * assert.deepStrictEqual(get(person, "email"), none())
 *
 * @since 2.0.0
 */
export declare const get: {
    (key: string): <A>(self: ReadonlyRecord<A>) => Option.Option<A>;
    <A>(self: ReadonlyRecord<A>, key: string): Option.Option<A>;
};
/**
 * Apply a function to the element at the specified key, creating a new record,
 * or return `None` if the key doesn't exist.
 *
 * @param self - The record to be updated.
 * @param key - The key of the element to modify.
 * @param f - The function to apply to the element.
 *
 * @example
 * import { modifyOption } from "effect/ReadonlyRecord"
 * import { some, none } from "effect/Option"
 *
 * const f = (x: number) => x * 2
 *
 * assert.deepStrictEqual(
 *  modifyOption({ a: 3 }, 'a', f),
 *  some({ a: 6 })
 * )
 * assert.deepStrictEqual(
 *  modifyOption({ a: 3 }, 'b', f),
 *  none()
 * )
 *
 * @since 2.0.0
 */
export declare const modifyOption: {
    <A, B>(key: string, f: (a: A) => B): (self: ReadonlyRecord<A>) => Option.Option<Record<string, A | B>>;
    <A, B>(self: ReadonlyRecord<A>, key: string, f: (a: A) => B): Option.Option<Record<string, A | B>>;
};
/**
 * Replaces a value in the record with the new value passed as parameter.
 *
 * @param self - The record to be updated.
 * @param key - The key to search for in the record.
 * @param b - The new value to replace the existing value with.
 *
 * @example
 * import { replaceOption } from "effect/ReadonlyRecord"
 * import { some, none } from "effect/Option"
 *
 * assert.deepStrictEqual(
 *   replaceOption({ a: 1, b: 2, c: 3 }, 'a', 10),
 *   some({ a: 10, b: 2, c: 3 })
 * )
 * assert.deepStrictEqual(replaceOption({}, 'a', 10), none())
 *
 * @since 2.0.0
 */
export declare const replaceOption: {
    <B>(key: string, b: B): <A>(self: ReadonlyRecord<A>) => Option.Option<Record<string, A | B>>;
    <A, B>(self: ReadonlyRecord<A>, key: string, b: B): Option.Option<Record<string, A | B>>;
};
/**
 * Removes a key from a record and returns a new record
 *
 * @param self - the record to remove the key from.
 * @param key - the key to remove from the record.
 *
 * @example
 * import { remove } from "effect/ReadonlyRecord"
 *
 * assert.deepStrictEqual(remove({ a: 1, b: 2 }, "a"), { b: 2 })
 *
 * @since 2.0.0
 */
export declare const remove: {
    (key: string): <A>(self: ReadonlyRecord<A>) => Record<string, A>;
    <A>(self: ReadonlyRecord<A>, key: string): Record<string, A>;
};
/**
 * Retrieves the value of the property with the given `key` from a record and returns an `Option`
 * of a tuple with the value and the record with the removed property.
 * If the key is not present, returns `O.none`.
 *
 * @param self - The input record.
 * @param key - The key of the property to retrieve.
 *
 * @example
 * import { pop } from "effect/ReadonlyRecord"
 * import { some, none } from 'effect/Option'
 *
 * assert.deepStrictEqual(pop({ a: 1, b: 2 }, "a"), some([1, { b: 2 }]))
 * assert.deepStrictEqual(pop({ a: 1, b: 2 }, "c"), none())
 *
 * @category record
 * @since 2.0.0
 */
export declare const pop: {
    (key: string): <A>(self: ReadonlyRecord<A>) => Option.Option<[A, Record<string, A>]>;
    <A>(self: ReadonlyRecord<A>, key: string): Option.Option<[A, Record<string, A>]>;
};
/**
 * Maps a record into another record by applying a transformation function to each of its values.
 *
 * @param self - The record to be mapped.
 * @param f - A transformation function that will be applied to each of the values in the record.
 *
 * @example
 * import { map } from "effect/ReadonlyRecord"
 *
 * const f = (n: number) => `-${n}`
 *
 * assert.deepStrictEqual(map({ a: 3, b: 5 }, f), { a: "-3", b: "-5" })
 *
 * const g = (n: number, key: string) => `${key.toUpperCase()}-${n}`
 *
 * assert.deepStrictEqual(map({ a: 3, b: 5 }, g), { a: "A-3", b: "B-5" })
 *
 * @since 2.0.0
 */
export declare const map: {
    <K extends string, A, B>(f: (a: A, key: K) => B): (self: Record<K, A>) => Record<K, B>;
    <K extends string, A, B>(self: Record<K, A>, f: (a: A, key: K) => B): Record<K, B>;
};
/**
 * Transforms a record into a record by applying the function `f` to each key and value in the original record.
 * If the function returns `Some`, the key-value pair is included in the output record.
 *
 * @param self - The input record.
 * @param f - The transformation function.
 *
 * @example
 * import { filterMap } from "effect/ReadonlyRecord"
 * import { some, none } from 'effect/Option'
 *
 * const x = { a: 1, b: 2, c: 3 }
 * const f = (a: number, key: string) => a > 2 ? some(a * 2) : none()
 * assert.deepStrictEqual(filterMap(x, f), { c: 6 })
 *
 * @since 2.0.0
 */
export declare const filterMap: {
    <K extends string, A, B>(f: (a: A, key: K) => Option.Option<B>): (self: Record<K, A>) => Record<string, B>;
    <K extends string, A, B>(self: Record<K, A>, f: (a: A, key: K) => Option.Option<B>): Record<string, B>;
};
/**
 * Selects properties from a record whose values match the given predicate.
 *
 * @param self - The record to filter.
 * @param predicate - A function that returns a `boolean` value to determine if the entry should be included in the new record.
 *
 * @example
 * import { filter } from "effect/ReadonlyRecord"
 *
 * const x = { a: 1, b: 2, c: 3, d: 4 }
 * assert.deepStrictEqual(filter(x, (n) => n > 2), { c: 3, d: 4 })
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const filter: {
    <K extends string, C extends A, B extends A, A = C>(refinement: (a: A, key: K) => a is B): (self: Record<K, C>) => Record<string, B>;
    <K extends string, B extends A, A = B>(predicate: (a: A, key: K) => boolean): (self: Record<K, B>) => Record<string, B>;
    <K extends string, C extends A, B extends A, A = C>(self: Record<K, C>, refinement: (a: A, key: K) => a is B): Record<string, B>;
    <K extends string, B extends A, A = B>(self: Record<K, B>, predicate: (a: A, key: K) => boolean): Record<string, B>;
};
/**
 * Given a record with `Option` values, returns a record with only the `Some` values, with the same keys.
 *
 * @param self - A record with `Option` values.
 *
 * @example
 * import { compact } from "effect/ReadonlyRecord"
 * import { some, none } from 'effect/Option'
 *
 * assert.deepStrictEqual(
 *   compact({ a: some(1), b: none(), c: some(2) }),
 *   { a: 1, c: 2 }
 * )
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const compact: <A>(self: ReadonlyRecord<Option.Option<A>>) => Record<string, A>;
/**
 * Partitions the elements of a record into two groups: those that match a predicate, and those that don't.
 *
 * @param self - The record to partition.
 * @param f - The predicate function to apply to each element.
 *
 * @example
 * import { partitionMap } from "effect/ReadonlyRecord"
 * import { left, right } from 'effect/Either'
 *
 * const x = { a: 1, b: 2, c: 3 }
 * const f = (n: number) => (n % 2 === 0 ? right(n) : left(n))
 * assert.deepStrictEqual(partitionMap(x, f), [{ a: 1, c: 3 }, { b: 2}])
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const partitionMap: {
    <K extends string, A, B, C>(f: (a: A, key: K) => Either<B, C>): (self: Record<K, A>) => [Record<string, B>, Record<string, C>];
    <K extends string, A, B, C>(self: Record<K, A>, f: (a: A, key: K) => Either<B, C>): [Record<string, B>, Record<string, C>];
};
/**
 * Partitions a record of `Either` values into two separate records,
 * one with the `Left` values and one with the `Right` values.
 *
 * @param self - the record to partition.
 *
 * @example
 * import { separate } from "effect/ReadonlyRecord"
 * import { left, right } from 'effect/Either'
 *
 * assert.deepStrictEqual(
 *   separate({ a: left("e"), b: right(1) }),
 *   [{ a: "e" }, { b: 1 }]
 * )
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const separate: <A, B>(self: ReadonlyRecord<Either<A, B>>) => [Record<string, A>, Record<string, B>];
/**
 * Partitions a record into two separate records based on the result of a predicate function.
 *
 * @param self - The input record to partition.
 * @param predicate - The partitioning function to determine the partitioning of each value of the record.
 *
 * @example
 * import { partition } from "effect/ReadonlyRecord"
 *
 * assert.deepStrictEqual(
 *   partition({ a: 1, b: 3 }, (n) => n > 2),
 *   [{ a: 1 }, { b: 3 }]
 * )
 *
 * @category filtering
 * @since 2.0.0
 */
export declare const partition: {
    <K extends string, C extends A, B extends A, A = C>(refinement: (a: A, key: K) => a is B): (self: Record<K, C>) => [Record<string, C>, Record<string, B>];
    <K extends string, B extends A, A = B>(predicate: (a: A, key: K) => boolean): (self: Record<K, B>) => [Record<string, B>, Record<string, B>];
    <K extends string, C extends A, B extends A, A = C>(self: Record<K, C>, refinement: (a: A, key: K) => a is B): [Record<string, C>, Record<string, B>];
    <K extends string, B extends A, A = B>(self: Record<K, B>, predicate: (a: A, key: K) => boolean): [Record<string, B>, Record<string, B>];
};
/**
 * Retrieve the keys of a given record as an array.
 *
 * @param self - The object for which you want to get the keys.
 *
 * @since 2.0.0
 */
export declare const keys: <A>(self: ReadonlyRecord<A>) => Array<string>;
/**
 * Retrieve the values of a given record as an array.
 *
 * @param self - The object for which you want to get the values.
 *
 * @since 2.0.0
 */
export declare const values: <A>(self: ReadonlyRecord<A>) => A[];
/**
 * Add a new key-value pair or update an existing key's value in a record.
 *
 * @param self - The record to which you want to add or update a key-value pair.
 * @param key - The key you want to add or update.
 * @param values - The value you want to associate with the key.
 *
 * @example
 * import { upsert } from "effect/ReadonlyRecord"
 *
 * assert.deepStrictEqual(upsert("a", 5)({ a: 1, b: 2 }), { a: 5, b: 2 });
 * assert.deepStrictEqual(upsert("c", 5)({ a: 1, b: 2 }), { a: 1, b: 2, c: 5 });
 *
 * @since 2.0.0
 */
export declare const upsert: {
    <B>(key: string, value: B): <A>(self: ReadonlyRecord<A>) => Record<string, A | B>;
    <A, B>(self: ReadonlyRecord<A>, key: string, value: B): Record<string, A | B>;
};
/**
 * Replace a key's value in a record and return the updated record.
 *
 * @param self - The original record.
 * @param key - The key to replace.
 * @param value - The new value to associate with the key.
 *
 * @example
 * import { update } from "effect/ReadonlyRecord"
 * import { some, none } from "effect/Option"
 *
 * assert.deepStrictEqual(update("a", 3)({ a: 1, b: 2 }), { a: 3, b: 2 });
 * assert.deepStrictEqual(update("c", 3)({ a: 1, b: 2 }), { a: 1, b: 2 });
 *
 * @since 2.0.0
 */
export declare const update: {
    <B>(key: string, value: B): <A>(self: ReadonlyRecord<A>) => Record<string, A | B>;
    <A, B>(self: ReadonlyRecord<A>, key: string, value: B): Record<string, A | B>;
};
/**
 * Check if all the keys and values in one record are also found in another record.
 *
 * @param self - The first record to check.
 * @param that - The second record to compare against.
 * @param equivalence - A function to compare values.
 *
 * @since 2.0.0
 */
export declare const isSubrecordBy: <A>(equivalence: Equivalence<A>) => {
    (that: ReadonlyRecord<A>): (self: ReadonlyRecord<A>) => boolean;
    (self: ReadonlyRecord<A>, that: ReadonlyRecord<A>): boolean;
};
/**
 * Check if one record is a subrecord of another, meaning it contains all the keys and values found in the second record.
 * This comparison uses default equality checks (`Equal.equivalence()`).
 *
 * @param self - The first record to check.
 * @param that - The second record to compare against.
 *
 * @since 2.0.0
 */
export declare const isSubrecord: {
    <A>(that: ReadonlyRecord<A>): (self: ReadonlyRecord<A>) => boolean;
    <A>(self: ReadonlyRecord<A>, that: ReadonlyRecord<A>): boolean;
};
/**
 * Reduce a record to a single value by combining its entries with a specified function.
 *
 * @param self - The record to reduce.
 * @param zero - The initial value of the accumulator.
 * @param f - The function to combine entries (accumulator, value, key).
 *
 * @category folding
 * @since 2.0.0
 */
export declare const reduce: {
    <Z, V, K extends string>(zero: Z, f: (accumulator: Z, value: V, key: K) => Z): (self: Record<K, V>) => Z;
    <K extends string, V, Z>(self: Record<K, V>, zero: Z, f: (accumulator: Z, value: V, key: K) => Z): Z;
};
/**
 * Check if all entries in a record meet a specific condition.
 *
 * @param self - The record to check.
 * @param predicate - The condition to test entries (value, key).
 *
 * @since 2.0.0
 */
export declare const every: {
    <A, K extends string>(predicate: (value: A, key: K) => boolean): (self: Record<K, A>) => boolean;
    <K extends string, A>(self: Record<K, A>, predicate: (value: A, key: K) => boolean): boolean;
};
/**
 * Check if any entry in a record meets a specific condition.
 *
 * @param self - The record to check.
 * @param predicate - The condition to test entries (value, key).
 *
 * @since 2.0.0
 */
export declare const some: {
    <A, K extends string>(predicate: (value: A, key: K) => boolean): (self: Record<K, A>) => boolean;
    <K extends string, A>(self: Record<K, A>, predicate: (value: A, key: K) => boolean): boolean;
};
/**
 * Merge two records, preserving entries that exist in either of the records.
 *
 * @param self - The first record.
 * @param that - The second record to combine with the first.
 * @param combine - A function to specify how to merge entries with the same key.
 *
 * @since 2.0.0
 */
export declare const union: {
    <K1 extends string, V0, V1>(that: Record<K1, V1>, combine: (selfValue: V0, thatValue: V1) => V0 | V1): <K0 extends string>(self: Record<K0, V0>) => Record<K0 | K1, V0 | V1>;
    <K0 extends string, V0, K1 extends string, V1>(self: Record<K0, V0>, that: Record<K1, V1>, combine: (selfValue: V0, thatValue: V1) => V0 | V1): Record<K0 | K1, V0 | V1>;
};
/**
 * Merge two records, retaining only the entries that exist in both records.
 *
 * @param self - The first record.
 * @param that - The second record to merge with the first.
 * @param combine - A function to specify how to merge entries with the same key.
 *
 * @since 2.0.0
 */
export declare const intersection: {
    <A>(that: ReadonlyRecord<A>, combine: (selfValue: A, thatValue: A) => A): (self: ReadonlyRecord<A>) => Record<string, A>;
    <A>(self: ReadonlyRecord<A>, that: ReadonlyRecord<A>, combine: (selfValue: A, thatValue: A) => A): Record<string, A>;
};
/**
 * Merge two records, preserving only the entries that are unique to each record.
 *
 * @param self - The first record.
 * @param that - The second record to compare with the first.
 *
 * @since 2.0.0
 */
export declare const difference: {
    <A>(that: ReadonlyRecord<A>): (self: ReadonlyRecord<A>) => Record<string, A>;
    <A>(self: ReadonlyRecord<A>, that: ReadonlyRecord<A>): Record<string, A>;
};
/**
 * Create an `Equivalence` for records using the provided `Equivalence` for values.
 *
 * @param equivalence - An `Equivalence` for the values contained in the records.
 *
 * @category instances
 * @since 2.0.0
 */
export declare const getEquivalence: <A>(equivalence: Equivalence<A>) => Equivalence<ReadonlyRecord<A>>;
/**
 * Create a non-empty record from a single element.
 *
 * @param key - The key for the element.
 * @param value - The value associated with the key.
 *
 * @category constructors
 * @since 2.0.0
 */
export declare const singleton: <K extends string, A>(key: K, value: A) => Record<K, A>;
//# sourceMappingURL=ReadonlyRecord.d.ts.map