/**
 * @since 2.0.0
 */
import type * as Effect from "./Effect.js";
import type * as Option from "./Option.js";
import type * as Ref from "./Ref.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const SynchronizedRefTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type SynchronizedRefTypeId = typeof SynchronizedRefTypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface SynchronizedRef<A> extends SynchronizedRef.Variance<A>, Ref.Ref<A> {
    modifyEffect<R, E, B>(f: (a: A) => Effect.Effect<R, E, readonly [B, A]>): Effect.Effect<R, E, B>;
}
/**
 * @since 2.0.0
 */
export declare namespace SynchronizedRef {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<A> {
        readonly [SynchronizedRefTypeId]: {
            readonly _A: (_: never) => A;
        };
    }
}
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <A>(value: A) => Effect.Effect<never, never, SynchronizedRef<A>>;
/**
 * @since 2.0.0
 * @category getters
 */
export declare const get: <A>(self: SynchronizedRef<A>) => Effect.Effect<never, never, A>;
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndSet: {
    <A>(value: A): (self: Ref.Ref<A>) => Effect.Effect<never, never, A>;
    <A>(self: Ref.Ref<A>, value: A): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndUpdate: {
    <A>(f: (a: A) => A): (self: Ref.Ref<A>) => Effect.Effect<never, never, A>;
    <A>(self: Ref.Ref<A>, f: (a: A) => A): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndUpdateEffect: {
    <A, R, E>(f: (a: A) => Effect.Effect<R, E, A>): (self: SynchronizedRef<A>) => Effect.Effect<R, E, A>;
    <A, R, E>(self: SynchronizedRef<A>, f: (a: A) => Effect.Effect<R, E, A>): Effect.Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndUpdateSome: {
    <A>(pf: (a: A) => Option.Option<A>): (self: Ref.Ref<A>) => Effect.Effect<never, never, A>;
    <A>(self: Ref.Ref<A>, pf: (a: A) => Option.Option<A>): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const getAndUpdateSomeEffect: {
    <A, R, E>(pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): (self: SynchronizedRef<A>) => Effect.Effect<R, E, A>;
    <A, R, E>(self: SynchronizedRef<A>, pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): Effect.Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const modify: {
    <A, B>(f: (a: A) => readonly [B, A]): (self: SynchronizedRef<A>) => Effect.Effect<never, never, B>;
    <A, B>(self: SynchronizedRef<A>, f: (a: A) => readonly [B, A]): Effect.Effect<never, never, B>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const modifyEffect: {
    <A, R, E, B>(f: (a: A) => Effect.Effect<R, E, readonly [B, A]>): (self: SynchronizedRef<A>) => Effect.Effect<R, E, B>;
    <A, R, E, B>(self: SynchronizedRef<A>, f: (a: A) => Effect.Effect<R, E, readonly [B, A]>): Effect.Effect<R, E, B>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const modifySome: {
    <B, A>(fallback: B, pf: (a: A) => Option.Option<readonly [B, A]>): (self: Ref.Ref<A>) => Effect.Effect<never, never, B>;
    <A, B>(self: Ref.Ref<A>, fallback: B, pf: (a: A) => Option.Option<readonly [B, A]>): Effect.Effect<never, never, B>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const modifySomeEffect: {
    <A, B, R, E>(fallback: B, pf: (a: A) => Option.Option<Effect.Effect<R, E, readonly [B, A]>>): (self: SynchronizedRef<A>) => Effect.Effect<R, E, B>;
    <A, B, R, E>(self: SynchronizedRef<A>, fallback: B, pf: (a: A) => Option.Option<Effect.Effect<R, E, readonly [B, A]>>): Effect.Effect<R, E, B>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const set: {
    <A>(value: A): (self: Ref.Ref<A>) => Effect.Effect<never, never, void>;
    <A>(self: Ref.Ref<A>, value: A): Effect.Effect<never, never, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const setAndGet: {
    <A>(value: A): (self: Ref.Ref<A>) => Effect.Effect<never, never, A>;
    <A>(self: Ref.Ref<A>, value: A): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const update: {
    <A>(f: (a: A) => A): (self: Ref.Ref<A>) => Effect.Effect<never, never, void>;
    <A>(self: Ref.Ref<A>, f: (a: A) => A): Effect.Effect<never, never, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateEffect: {
    <A, R, E>(f: (a: A) => Effect.Effect<R, E, A>): (self: SynchronizedRef<A>) => Effect.Effect<R, E, void>;
    <A, R, E>(self: SynchronizedRef<A>, f: (a: A) => Effect.Effect<R, E, A>): Effect.Effect<R, E, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateAndGet: {
    <A>(f: (a: A) => A): (self: Ref.Ref<A>) => Effect.Effect<never, never, A>;
    <A>(self: Ref.Ref<A>, f: (a: A) => A): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateAndGetEffect: {
    <A, R, E>(f: (a: A) => Effect.Effect<R, E, A>): (self: SynchronizedRef<A>) => Effect.Effect<R, E, A>;
    <A, R, E>(self: SynchronizedRef<A>, f: (a: A) => Effect.Effect<R, E, A>): Effect.Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateSome: {
    <A>(f: (a: A) => Option.Option<A>): (self: Ref.Ref<A>) => Effect.Effect<never, never, void>;
    <A>(self: Ref.Ref<A>, f: (a: A) => Option.Option<A>): Effect.Effect<never, never, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateSomeEffect: {
    <A, R, E>(pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): (self: SynchronizedRef<A>) => Effect.Effect<R, E, void>;
    <A, R, E>(self: SynchronizedRef<A>, pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): Effect.Effect<R, E, void>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateSomeAndGet: {
    <A>(pf: (a: A) => Option.Option<A>): (self: Ref.Ref<A>) => Effect.Effect<never, never, A>;
    <A>(self: Ref.Ref<A>, pf: (a: A) => Option.Option<A>): Effect.Effect<never, never, A>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const updateSomeAndGetEffect: {
    <A, R, E>(pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): (self: SynchronizedRef<A>) => Effect.Effect<R, E, A>;
    <A, R, E>(self: SynchronizedRef<A>, pf: (a: A) => Option.Option<Effect.Effect<R, E, A>>): Effect.Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeMake: <A>(value: A) => SynchronizedRef<A>;
//# sourceMappingURL=SynchronizedRef.d.ts.map