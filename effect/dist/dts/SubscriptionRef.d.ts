/**
 * @since 2.0.0
 */
import type * as Effect from "./Effect.js";
import type * as Option from "./Option.js";
import type { Pipeable } from "./Pipeable.js";
import type * as Stream from "./Stream.js";
import * as Synchronized from "./SynchronizedRef.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const SubscriptionRefTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type SubscriptionRefTypeId = typeof SubscriptionRefTypeId;
/**
 * A `SubscriptionRef<A>` is a `Ref` that can be subscribed to in order to
 * receive the current value as well as all changes to the value.
 *
 * @since 2.0.0
 * @category models
 */
export interface SubscriptionRef<A> extends SubscriptionRef.Variance<A>, Synchronized.SynchronizedRef<A>, Pipeable {
    /**
     * A stream containing the current value of the `Ref` as well as all changes
     * to that value.
     */
    readonly changes: Stream.Stream<never, never, A>;
}
/**
 * @since 2.0.0
 */
export declare namespace SubscriptionRef {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<A> {
        readonly [SubscriptionRefTypeId]: {
            readonly _A: (_: never) => A;
        };
    }
}
/**
 * @since 2.0.0
 * @category getters
 */
export declare const get: <A>(self: SubscriptionRef<A>) => Effect.Effect<never, never, A>;
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndSet: {
    <A>(value: A): (self: SubscriptionRef<A>) => Effect.Effect<never, never, A>;
    <A>(self: SubscriptionRef<A>, value: A): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndUpdate: {
    <A>(f: (a: A) => A): (self: SubscriptionRef<A>) => Effect.Effect<never, never, A>;
    <A>(self: SubscriptionRef<A>, f: (a: A) => A): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndUpdateEffect: {
    <A, R, E>(f: (a: A) => Effect.Effect<R, E, A>): (self: SubscriptionRef<A>) => Effect.Effect<R, E, A>;
    <A, R, E>(self: SubscriptionRef<A>, f: (a: A) => Effect.Effect<R, E, A>): Effect.Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndUpdateSome: {
    <A>(pf: (a: A) => Option.Option<A>): (self: SubscriptionRef<A>) => Effect.Effect<never, never, A>;
    <A>(self: SubscriptionRef<A>, pf: (a: A) => Option.Option<A>): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndUpdateSomeEffect: {
    <A, R, E>(pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): (self: SubscriptionRef<A>) => Effect.Effect<R, E, A>;
    <A, R, E>(self: SubscriptionRef<A>, pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): Effect.Effect<R, E, A>;
};
/**
 * Creates a new `SubscriptionRef` with the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <A>(value: A) => Effect.Effect<never, never, SubscriptionRef<A>>;
/**
 * @since 2.0.0
 * @category utils
 */
export declare const modify: {
    <A, B>(f: (a: A) => readonly [B, A]): (self: SubscriptionRef<A>) => Effect.Effect<never, never, B>;
    <A, B>(self: SubscriptionRef<A>, f: (a: A) => readonly [B, A]): Effect.Effect<never, never, B>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const modifyEffect: {
    <A, R, E, B>(f: (a: A) => Effect.Effect<R, E, readonly [B, A]>): (self: SubscriptionRef<A>) => Effect.Effect<R, E, B>;
    <A, R, E, B>(self: SubscriptionRef<A>, f: (a: A) => Effect.Effect<R, E, readonly [B, A]>): Effect.Effect<R, E, B>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const modifySome: {
    <B, A>(fallback: B, pf: (a: A) => Option.Option<readonly [B, A]>): (self: SubscriptionRef<A>) => Effect.Effect<never, never, B>;
    <A, B>(self: SubscriptionRef<A>, fallback: B, pf: (a: A) => Option.Option<readonly [B, A]>): Effect.Effect<never, never, B>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const modifySomeEffect: {
    <A, B, R, E>(fallback: B, pf: (a: A) => Option.Option<Effect.Effect<R, E, readonly [B, A]>>): (self: SubscriptionRef<A>) => Effect.Effect<R, E, B>;
    <A, B, R, E>(self: SubscriptionRef<A>, fallback: B, pf: (a: A) => Option.Option<Effect.Effect<R, E, readonly [B, A]>>): Effect.Effect<R, E, B>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const set: {
    <A>(value: A): (self: SubscriptionRef<A>) => Effect.Effect<never, never, void>;
    <A>(self: SubscriptionRef<A>, value: A): Effect.Effect<never, never, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const setAndGet: {
    <A>(value: A): (self: SubscriptionRef<A>) => Effect.Effect<never, never, A>;
    <A>(self: SubscriptionRef<A>, value: A): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const update: {
    <A>(f: (a: A) => A): (self: SubscriptionRef<A>) => Effect.Effect<never, never, void>;
    <A>(self: SubscriptionRef<A>, f: (a: A) => A): Effect.Effect<never, never, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateEffect: {
    <A, R, E>(f: (a: A) => Effect.Effect<R, E, A>): (self: SubscriptionRef<A>) => Effect.Effect<R, E, void>;
    <A, R, E>(self: SubscriptionRef<A>, f: (a: A) => Effect.Effect<R, E, A>): Effect.Effect<R, E, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateAndGet: {
    <A>(f: (a: A) => A): (self: SubscriptionRef<A>) => Effect.Effect<never, never, A>;
    <A>(self: SubscriptionRef<A>, f: (a: A) => A): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateAndGetEffect: {
    <A, R, E>(f: (a: A) => Effect.Effect<R, E, A>): (self: SubscriptionRef<A>) => Effect.Effect<R, E, A>;
    <A, R, E>(self: SubscriptionRef<A>, f: (a: A) => Effect.Effect<R, E, A>): Effect.Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateSome: {
    <A>(f: (a: A) => Option.Option<A>): (self: SubscriptionRef<A>) => Effect.Effect<never, never, void>;
    <A>(self: SubscriptionRef<A>, f: (a: A) => Option.Option<A>): Effect.Effect<never, never, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateSomeEffect: {
    <A, R, E>(pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): (self: SubscriptionRef<A>) => Effect.Effect<R, E, void>;
    <A, R, E>(self: SubscriptionRef<A>, pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): Effect.Effect<R, E, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateSomeAndGet: {
    <A>(pf: (a: A) => Option.Option<A>): (self: SubscriptionRef<A>) => Effect.Effect<never, never, A>;
    <A>(self: SubscriptionRef<A>, pf: (a: A) => Option.Option<A>): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateSomeAndGetEffect: {
    <A, R, E>(pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): (self: SubscriptionRef<A>) => Effect.Effect<R, E, A>;
    <A, R, E>(self: SubscriptionRef<A>, pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): Effect.Effect<R, E, A>;
};
//# sourceMappingURL=SubscriptionRef.d.ts.map