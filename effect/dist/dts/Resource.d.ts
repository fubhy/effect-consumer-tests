/**
 * @since 2.0.0
 */
import type * as Effect from "./Effect.js";
import type * as Schedule from "./Schedule.js";
import type * as Scope from "./Scope.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const ResourceTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type ResourceTypeId = typeof ResourceTypeId;
/**
 * A `Resource` is a possibly resourceful value that is loaded into memory, and
 * which can be refreshed either manually or automatically.
 *
 * @since 2.0.0
 * @category models
 */
export interface Resource<E, A> extends Resource.Variance<E, A> {
}
/**
 * @since 2.0.0
 */
export declare namespace Resource {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<E, A> {
        readonly [ResourceTypeId]: {
            _E: (_: never) => E;
            _A: (_: never) => A;
        };
    }
}
/**
 * Creates a new `Resource` value that is automatically refreshed according to
 * the specified policy. Note that error retrying is not performed
 * automatically, so if you want to retry on errors, you should first apply
 * retry policies to the acquisition effect before passing it to this
 * constructor.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const auto: <R, E, A, R2, Out>(acquire: Effect.Effect<R, E, A>, policy: Schedule.Schedule<R2, unknown, Out>) => Effect.Effect<Scope.Scope | R | R2, never, Resource<E, A>>;
/**
 * Retrieves the current value stored in the cache.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const get: <E, A>(self: Resource<E, A>) => Effect.Effect<never, E, A>;
/**
 * Creates a new `Resource` value that must be manually refreshed by calling
 * the refresh method. Note that error retrying is not performed
 * automatically, so if you want to retry on errors, you should first apply
 * retry policies to the acquisition effect before passing it to this
 * constructor.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const manual: <R, E, A>(acquire: Effect.Effect<R, E, A>) => Effect.Effect<Scope.Scope | R, never, Resource<E, A>>;
/**
 * Refreshes the cache. This method will not return until either the refresh
 * is successful, or the refresh operation fails.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const refresh: <E, A>(self: Resource<E, A>) => Effect.Effect<never, E, void>;
//# sourceMappingURL=Resource.d.ts.map