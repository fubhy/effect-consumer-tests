import { type Inspectable } from "./Inspectable.js";
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
export interface MutableHashSet<V> extends Iterable<V>, Pipeable, Inspectable {
    readonly [TypeId]: TypeId;
}
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const empty: <K = never>() => MutableHashSet<K>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const fromIterable: <K = never>(keys: Iterable<K>) => MutableHashSet<K>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <Keys extends readonly unknown[]>(...keys: Keys) => MutableHashSet<Keys[number]>;
/**
 * @since 2.0.0
 * @category elements
 */
export declare const add: {
    <V>(key: V): (self: MutableHashSet<V>) => MutableHashSet<V>;
    <V>(self: MutableHashSet<V>, key: V): MutableHashSet<V>;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const has: {
    <V>(key: V): (self: MutableHashSet<V>) => boolean;
    <V>(self: MutableHashSet<V>, key: V): boolean;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const remove: {
    <V>(key: V): (self: MutableHashSet<V>) => MutableHashSet<V>;
    <V>(self: MutableHashSet<V>, key: V): MutableHashSet<V>;
};
/**
 * @since 2.0.0
 * @category elements
 */
export declare const size: <V>(self: MutableHashSet<V>) => number;
export {};
//# sourceMappingURL=MutableHashSet.d.ts.map