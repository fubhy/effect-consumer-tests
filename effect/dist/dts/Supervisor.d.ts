/**
 * A `Supervisor<T>` is allowed to supervise the launching and termination of
 * fibers, producing some visible value of type `T` from the supervision.
 *
 * @since 2.0.0
 */
import type * as Context from "./Context.js";
import type * as Effect from "./Effect.js";
import type * as Exit from "./Exit.js";
import type * as Fiber from "./Fiber.js";
import type * as Layer from "./Layer.js";
import type * as MutableRef from "./MutableRef.js";
import type * as Option from "./Option.js";
import type * as SortedSet from "./SortedSet.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const SupervisorTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type SupervisorTypeId = typeof SupervisorTypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface Supervisor<T> extends Supervisor.Variance<T> {
    /**
     * Returns an `Effect` that succeeds with the value produced by this
     * supervisor. This value may change over time, reflecting what the supervisor
     * produces as it supervises fibers.
     */
    value(): Effect.Effect<never, never, T>;
    /**
     * Supervises the start of a `Fiber`.
     */
    onStart<R, E, A>(context: Context.Context<R>, effect: Effect.Effect<R, E, A>, parent: Option.Option<Fiber.RuntimeFiber<any, any>>, fiber: Fiber.RuntimeFiber<E, A>): void;
    /**
     * Supervises the end of a `Fiber`.
     */
    onEnd<E, A>(value: Exit.Exit<E, A>, fiber: Fiber.RuntimeFiber<E, A>): void;
    /**
     * Supervises the execution of an `Effect` by a `Fiber`.
     */
    onEffect<E, A>(fiber: Fiber.RuntimeFiber<E, A>, effect: Effect.Effect<any, any, any>): void;
    /**
     * Supervises the suspension of a computation running within a `Fiber`.
     */
    onSuspend<E, A>(fiber: Fiber.RuntimeFiber<E, A>): void;
    /**
     * Supervises the resumption of a computation running within a `Fiber`.
     */
    onResume<E, A>(fiber: Fiber.RuntimeFiber<E, A>): void;
    /**
     * Maps this supervisor to another one, which has the same effect, but whose
     * value has been transformed by the specified function.
     */
    map<B>(f: (a: T) => B): Supervisor<B>;
    /**
     * Returns a new supervisor that performs the function of this supervisor, and
     * the function of the specified supervisor, producing a tuple of the outputs
     * produced by both supervisors.
     */
    zip<A>(right: Supervisor<A>): Supervisor<readonly [T, A]>;
}
/**
 * @since 2.0.0
 */
export declare namespace Supervisor {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<T> {
        readonly [SupervisorTypeId]: {
            readonly _T: (_: never) => T;
        };
    }
}
/**
 * @since 2.0.0
 * @category context
 */
export declare const addSupervisor: <A>(supervisor: Supervisor<A>) => Layer.Layer<never, never, never>;
/**
 * Creates a new supervisor that tracks children in a set.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fibersIn: (ref: MutableRef.MutableRef<SortedSet.SortedSet<Fiber.RuntimeFiber<any, any>>>) => Effect.Effect<never, never, Supervisor<SortedSet.SortedSet<Fiber.RuntimeFiber<any, any>>>>;
/**
 * Creates a new supervisor that constantly yields effect when polled
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromEffect: <A>(effect: Effect.Effect<never, never, A>) => Supervisor<A>;
/**
 * A supervisor that doesn't do anything in response to supervision events.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const none: Supervisor<void>;
/**
 * Creates a new supervisor that tracks children in a set.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const track: Effect.Effect<never, never, Supervisor<Array<Fiber.RuntimeFiber<any, any>>>>;
/**
 * Unsafely creates a new supervisor that tracks children in a set.
 *
 * @since 2.0.0
 * @category unsafe
 */
export declare const unsafeTrack: () => Supervisor<Array<Fiber.RuntimeFiber<any, any>>>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare abstract class AbstractSupervisor<T> implements Supervisor<T> {
    /**
     * @since 2.0.0
     */
    abstract value(): Effect.Effect<never, never, T>;
    /**
     * @since 2.0.0
     */
    onStart<R, E, A>(_context: Context.Context<R>, _effect: Effect.Effect<R, E, A>, _parent: Option.Option<Fiber.RuntimeFiber<any, any>>, _fiber: Fiber.RuntimeFiber<E, A>): void;
    /**
     * @since 2.0.0
     */
    onEnd<E, A>(_value: Exit.Exit<E, A>, _fiber: Fiber.RuntimeFiber<E, A>): void;
    /**
     * @since 2.0.0
     */
    onEffect<E, A>(_fiber: Fiber.RuntimeFiber<E, A>, _effect: Effect.Effect<any, any, any>): void;
    /**
     * @since 2.0.0
     */
    onSuspend<E, A>(_fiber: Fiber.RuntimeFiber<E, A>): void;
    /**
     * @since 2.0.0
     */
    onResume<E, A>(_fiber: Fiber.RuntimeFiber<E, A>): void;
    /**
     * @since 2.0.0
     */
    map<B>(f: (a: T) => B): Supervisor<B>;
    /**
     * @since 2.0.0
     */
    zip<A>(right: Supervisor<A>): Supervisor<readonly [T, A]>;
    /**
     * @since 2.0.0
     */
    onRun<E, A, X>(execution: () => X, _fiber: Fiber.RuntimeFiber<E, A>): X;
    /**
     * @since 2.0.0
     */
    readonly [SupervisorTypeId]: {
        _T: (_: never) => never;
    };
}
//# sourceMappingURL=Supervisor.d.ts.map