/**
 * @since 2.0.0
 */
import * as Equal from "./Equal.js";
import type * as equivalence from "./Equivalence.js";
import type { Inspectable } from "./Inspectable.js";
import * as Option from "./Option.js";
import * as order from "./Order.js";
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
export interface Duration extends Equal.Equal, Pipeable, Inspectable {
    readonly [TypeId]: TypeId;
    readonly value: DurationValue;
}
/**
 * @since 2.0.0
 * @category models
 */
export type DurationValue = {
    _tag: "Millis";
    millis: number;
} | {
    _tag: "Nanos";
    nanos: bigint;
} | {
    _tag: "Infinity";
};
/**
 * @since 2.0.0
 * @category models
 */
export type Unit = "nanos" | "micros" | "millis" | "seconds" | "minutes" | "hours" | "days" | "weeks";
/**
 * @since 2.0.0
 * @category models
 */
export type DurationInput = Duration | number | bigint | `${number} ${Unit}`;
/**
 * @since 2.0.0
 */
export declare const decode: (input: DurationInput) => Duration;
/**
 * @since 2.0.0
 * @category guards
 */
export declare const isDuration: (u: unknown) => u is Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const zero: Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const infinity: Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const nanos: (nanos: bigint) => Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const micros: (micros: bigint) => Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const millis: (millis: number) => Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const seconds: (seconds: number) => Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const minutes: (minutes: number) => Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const hours: (hours: number) => Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const days: (days: number) => Duration;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const weeks: (weeks: number) => Duration;
/**
 * @since 2.0.0
 * @category getters
 */
export declare const toMillis: (self: DurationInput) => number;
/**
 * @since 2.0.0
 * @category getters
 */
export declare const toSeconds: (self: DurationInput) => number;
/**
 * Get the duration in nanoseconds as a bigint.
 *
 * If the duration is infinite, returns `Option.none()`
 *
 * @since 2.0.0
 * @category getters
 */
export declare const toNanos: (self: DurationInput) => Option.Option<bigint>;
/**
 * Get the duration in nanoseconds as a bigint.
 *
 * If the duration is infinite, it throws an error.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const unsafeToNanos: (self: DurationInput) => bigint;
/**
 * @since 2.0.0
 * @category getters
 */
export declare const toHrTime: (self: DurationInput) => readonly [seconds: number, nanos: number];
/**
 * @since 2.0.0
 * @category pattern matching
 */
export declare const match: {
    <A, B>(options: {
        readonly onMillis: (millis: number) => A;
        readonly onNanos: (nanos: bigint) => B;
    }): (self: DurationInput) => A | B;
    <A, B>(self: DurationInput, options: {
        readonly onMillis: (millis: number) => A;
        readonly onNanos: (nanos: bigint) => B;
    }): A | B;
};
/**
 * @since 2.0.0
 * @category pattern matching
 */
export declare const matchWith: {
    <A, B>(that: DurationInput, options: {
        readonly onMillis: (self: number, that: number) => A;
        readonly onNanos: (self: bigint, that: bigint) => B;
    }): (self: DurationInput) => A | B;
    <A, B>(self: DurationInput, that: DurationInput, options: {
        readonly onMillis: (self: number, that: number) => A;
        readonly onNanos: (self: bigint, that: bigint) => B;
    }): A | B;
};
/**
 * @category instances
 * @since 2.0.0
 */
export declare const Order: order.Order<Duration>;
/**
 * Checks if a `Duration` is between a `minimum` and `maximum` value.
 *
 * @category predicates
 * @since 2.0.0
 */
export declare const between: {
    (minimum: DurationInput, maximum: DurationInput): (self: DurationInput) => boolean;
    (self: DurationInput, minimum: DurationInput, maximum: DurationInput): boolean;
};
/**
 * @category instances
 * @since 2.0.0
 */
export declare const Equivalence: equivalence.Equivalence<Duration>;
/**
 * @since 2.0.0
 */
export declare const min: {
    (that: DurationInput): (self: DurationInput) => Duration;
    (self: DurationInput, that: DurationInput): Duration;
};
/**
 * @since 2.0.0
 */
export declare const max: {
    (that: DurationInput): (self: DurationInput) => Duration;
    (self: DurationInput, that: DurationInput): Duration;
};
/**
 * @since 2.0.0
 */
export declare const clamp: {
    (minimum: DurationInput, maximum: DurationInput): (self: DurationInput) => Duration;
    (self: DurationInput, minimum: DurationInput, maximum: DurationInput): Duration;
};
/**
 * @since 2.0.0
 * @category math
 */
export declare const times: {
    (times: number): (self: DurationInput) => Duration;
    (self: DurationInput, times: number): Duration;
};
/**
 * @since 2.0.0
 * @category math
 */
export declare const sum: {
    (that: DurationInput): (self: DurationInput) => Duration;
    (self: DurationInput, that: DurationInput): Duration;
};
/**
 * @since 2.0.0
 * @category predicates
 */
export declare const lessThan: {
    (that: DurationInput): (self: DurationInput) => boolean;
    (self: DurationInput, that: DurationInput): boolean;
};
/**
 * @since 2.0.0
 * @category predicates
 */
export declare const lessThanOrEqualTo: {
    (that: DurationInput): (self: DurationInput) => boolean;
    (self: DurationInput, that: DurationInput): boolean;
};
/**
 * @since 2.0.0
 * @category predicates
 */
export declare const greaterThan: {
    (that: DurationInput): (self: DurationInput) => boolean;
    (self: DurationInput, that: DurationInput): boolean;
};
/**
 * @since 2.0.0
 * @category predicates
 */
export declare const greaterThanOrEqualTo: {
    (that: DurationInput): (self: DurationInput) => boolean;
    (self: DurationInput, that: DurationInput): boolean;
};
/**
 * @since 2.0.0
 * @category predicates
 */
export declare const equals: {
    (that: DurationInput): (self: DurationInput) => boolean;
    (self: DurationInput, that: DurationInput): boolean;
};
export {};
//# sourceMappingURL=Duration.d.ts.map