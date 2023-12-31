/**
 * @since 2.0.0
 */
import type * as Either from "./Either.js";
import type * as Option from "./Option.js";
import type * as STM from "./STM.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const TDeferredTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type TDeferredTypeId = typeof TDeferredTypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface TDeferred<E, A> extends TDeferred.Variance<E, A> {
}
/**
 * @since 2.0.0
 */
export declare namespace TDeferred {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<E, A> {
        readonly [TDeferredTypeId]: {
            readonly _E: (_: never) => E;
            readonly _A: (_: never) => A;
        };
    }
}
declare const _await: <E, A>(self: TDeferred<E, A>) => STM.STM<never, E, A>;
export { 
/**
 * @since 2.0.0
 * @category getters
 */
_await as await };
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const done: {
    <E, A>(either: Either.Either<E, A>): (self: TDeferred<E, A>) => STM.STM<never, never, boolean>;
    <E, A>(self: TDeferred<E, A>, either: Either.Either<E, A>): STM.STM<never, never, boolean>;
};
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const fail: {
    <E>(error: E): <A>(self: TDeferred<E, A>) => STM.STM<never, never, boolean>;
    <E, A>(self: TDeferred<E, A>, error: E): STM.STM<never, never, boolean>;
};
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <E, A>() => STM.STM<never, never, TDeferred<E, A>>;
/**
 * @since 2.0.0
 * @category getters
 */
export declare const poll: <E, A>(self: TDeferred<E, A>) => STM.STM<never, never, Option.Option<Either.Either<E, A>>>;
/**
 * @since 2.0.0
 * @category mutations
 */
export declare const succeed: {
    <A>(value: A): <E>(self: TDeferred<E, A>) => STM.STM<never, never, boolean>;
    <E, A>(self: TDeferred<E, A>, value: A): STM.STM<never, never, boolean>;
};
//# sourceMappingURL=TDeferred.d.ts.map