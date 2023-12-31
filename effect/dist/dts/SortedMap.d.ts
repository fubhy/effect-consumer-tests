/**
 * @since 2.0.0
 */
import * as Equal from "./Equal.js";
import { type Inspectable } from "./Inspectable.js";
import * as Option from "./Option.js";
import type { Order } from "./Order.js";
import type { Pipeable } from "./Pipeable.js";
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
export interface SortedMap<K, V> extends Iterable<readonly [K, V]>, Equal.Equal, Pipeable, Inspectable {
    readonly [TypeId]: TypeId;
}
/**
 * @since 2.0.0
 * @category refinements
 */
export declare const isSortedMap: {
    <K, V>(u: Iterable<readonly [K, V]>): u is SortedMap<K, V>;
    (u: unknown): u is SortedMap<unknown, unknown>;
};
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const empty: <K, V = never>(ord: Order<K>) => SortedMap<K, V>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const fromIterable: <K>(ord: Order<K>) => <V>(iterable: Iterable<readonly [K, V]>) => SortedMap<K, V>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <K>(ord: Order<K>) => <Entries extends readonly (readonly [K, any])[]>(...entries: Entries) => SortedMap<K, Entries[number] extends readonly [any, infer V] ? V : never>;
/**
 * @since 2.0.0
 * @category predicates
 */
export declare const isEmpty: <K, V>(self: SortedMap<K, V>) => boolean;
/**
 * @since 2.0.0
 * @category predicates
 */
export declare const isNonEmpty: <K, V>(self: SortedMap<K, V>) => boolean;
/**
 * @since 2.0.0
 * @category getters
 */
export declare const entries: <K, V>(self: SortedMap<K, V>) => Iterator<readonly [K, V], any, undefined>;
/**
 * @since 2.0.0
 * @category elements
 */
export declare const get: {
    <K>(key: K): <V>(self: SortedMap<K, V>) => Option.Option<V>;
    <K, V>(self: SortedMap<K, V>, key: K): Option.Option<V>;
};
/**
 * Gets the `Order<K>` that the `SortedMap<K, V>` is using.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const getOrder: <K, V>(self: SortedMap<K, V>) => Order<K>;
/**
 * @since 2.0.0
 * @category elements
 */
export declare const has: {
    <K>(key: K): <V>(self: SortedMap<K, V>) => boolean;
    <K, V>(self: SortedMap<K, V>, key: K): boolean;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const headOption: <K, V>(self: SortedMap<K, V>) => Option.Option<readonly [K, V]>;
/**
 * @since 2.0.0
 * @category mapping
 */
export declare const map: {
    <A, K, B>(f: (a: A, k: K) => B): (self: SortedMap<K, A>) => SortedMap<K, B>;
    <K, A, B>(self: SortedMap<K, A>, f: (a: A, k: K) => B): SortedMap<K, B>;
};
/**
 * @since 2.0.0
 * @category getters
 */
export declare const keys: <K, V>(self: SortedMap<K, V>) => IterableIterator<K>;
/**
 * @since 2.0.0
 * @category folding
 */
export declare const reduce: {
    <B, A, K>(zero: B, f: (acc: B, value: A, key: K) => B): (self: SortedMap<K, A>) => B;
    <K, A, B>(self: SortedMap<K, A>, zero: B, f: (acc: B, value: A, key: K) => B): B;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const remove: {
    <K>(key: K): <V>(self: SortedMap<K, V>) => SortedMap<K, V>;
    <K, V>(self: SortedMap<K, V>, key: K): SortedMap<K, V>;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const set: {
    <K, V>(key: K, value: V): (self: SortedMap<K, V>) => SortedMap<K, V>;
    <K, V>(self: SortedMap<K, V>, key: K, value: V): SortedMap<K, V>;
};
/**
 * @since 2.0.0
 * @category getters
 */
export declare const size: <K, V>(self: SortedMap<K, V>) => number;
/**
 * @since 2.0.0
 * @category getters
 */
export declare const values: <K, V>(self: SortedMap<K, V>) => IterableIterator<V>;
export {};
//# sourceMappingURL=SortedMap.d.ts.map