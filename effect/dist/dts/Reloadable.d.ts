/**
 * @since 2.0.0
 */
import type * as Context from "./Context.js";
import type * as Effect from "./Effect.js";
import type * as Layer from "./Layer.js";
import type * as Schedule from "./Schedule.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const ReloadableTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type ReloadableTypeId = typeof ReloadableTypeId;
/**
 * A `Reloadable` is an implementation of some service that can be dynamically
 * reloaded, or swapped out for another implementation on-the-fly.
 *
 * @since 2.0.0
 * @category models
 */
export interface Reloadable<A> extends Reloadable.Variance<A> {
}
/**
 * @since 2.0.0
 */
export declare namespace Reloadable {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<A> {
        readonly [ReloadableTypeId]: {
            readonly _A: (_: never) => A;
        };
    }
}
/**
 * Makes a new reloadable service from a layer that describes the construction
 * of a static service. The service is automatically reloaded according to the
 * provided schedule.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const auto: <Out extends Context.Tag<any, any>, In, E, R>(tag: Out, options: {
    readonly layer: Layer.Layer<In, E, Context.Tag.Identifier<Out>>;
    readonly schedule: Schedule.Schedule<R, unknown, unknown>;
}) => Layer.Layer<In | R, E, Reloadable<Context.Tag.Identifier<Out>>>;
/**
 * Makes a new reloadable service from a layer that describes the construction
 * of a static service. The service is automatically reloaded according to a
 * schedule, which is extracted from the input to the layer.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const autoFromConfig: <Out extends Context.Tag<any, any>, In, E, R>(tag: Out, options: {
    readonly layer: Layer.Layer<In, E, Context.Tag.Identifier<Out>>;
    readonly scheduleFromConfig: (context: Context.Context<In>) => Schedule.Schedule<R, unknown, unknown>;
}) => Layer.Layer<In | R, E, Reloadable<Context.Tag.Identifier<Out>>>;
/**
 * Retrieves the current version of the reloadable service.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const get: <T extends Context.Tag<any, any>>(tag: T) => Effect.Effect<Reloadable<Context.Tag.Identifier<T>>, never, Context.Tag.Service<T>>;
/**
 * Makes a new reloadable service from a layer that describes the construction
 * of a static service.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const manual: <Out extends Context.Tag<any, any>, In, E>(tag: Out, options: {
    readonly layer: Layer.Layer<In, E, Context.Tag.Identifier<Out>>;
}) => Layer.Layer<In, E, Reloadable<Context.Tag.Identifier<Out>>>;
/**
 * Reloads the specified service.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const reload: <T extends Context.Tag<any, any>>(tag: T) => Effect.Effect<Reloadable<Context.Tag.Identifier<T>>, unknown, void>;
/**
 * @since 2.0.0
 * @category context
 */
export declare const tag: <T extends Context.Tag<any, any>>(tag: T) => Context.Tag<Reloadable<Context.Tag.Identifier<T>>, Reloadable<Context.Tag.Service<T>>>;
/**
 * Forks the reload of the service in the background, ignoring any errors.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const reloadFork: <T extends Context.Tag<any, any>>(tag: T) => Effect.Effect<Reloadable<Context.Tag.Identifier<T>>, unknown, void>;
//# sourceMappingURL=Reloadable.d.ts.map