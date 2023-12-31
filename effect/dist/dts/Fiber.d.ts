/**
 * @since 2.0.0
 */
import type * as Cause from "./Cause.js";
import type * as Effect from "./Effect.js";
import type * as Either from "./Either.js";
import type * as Exit from "./Exit.js";
import type * as FiberId from "./FiberId.js";
import type { FiberRef } from "./FiberRef.js";
import type * as FiberRefs from "./FiberRefs.js";
import type * as FiberStatus from "./FiberStatus.js";
import type * as HashSet from "./HashSet.js";
import type * as Option from "./Option.js";
import type * as order from "./Order.js";
import type { Pipeable } from "./Pipeable.js";
import type * as RuntimeFlags from "./RuntimeFlags.js";
import type * as Scope from "./Scope.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const FiberTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type FiberTypeId = typeof FiberTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const RuntimeFiberTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type RuntimeFiberTypeId = typeof RuntimeFiberTypeId;
/**
 * A fiber is a lightweight thread of execution that never consumes more than a
 * whole thread (but may consume much less, depending on contention and
 * asynchronicity). Fibers are spawned by forking effects, which run
 * concurrently with the parent effect.
 *
 * Fibers can be joined, yielding their result to other fibers, or interrupted,
 * which terminates the fiber, safely releasing all resources.
 *
 * @since 2.0.0
 * @category models
 */
export interface Fiber<E, A> extends Fiber.Variance<E, A>, Pipeable {
    /**
     * The identity of the fiber.
     */
    id(): FiberId.FiberId;
    /**
     * Awaits the fiber, which suspends the awaiting fiber until the result of the
     * fiber has been determined.
     */
    await(): Effect.Effect<never, never, Exit.Exit<E, A>>;
    /**
     * Retrieves the immediate children of the fiber.
     */
    children(): Effect.Effect<never, never, Array<Fiber.Runtime<any, any>>>;
    /**
     * Inherits values from all `FiberRef` instances into current fiber. This
     * will resume immediately.
     */
    inheritAll(): Effect.Effect<never, never, void>;
    /**
     * Tentatively observes the fiber, but returns immediately if it is not
     * already done.
     */
    poll(): Effect.Effect<never, never, Option.Option<Exit.Exit<E, A>>>;
    /**
     * In the background, interrupts the fiber as if interrupted from the
     * specified fiber. If the fiber has already exited, the returned effect will
     * resume immediately. Otherwise, the effect will resume when the fiber exits.
     */
    interruptAsFork(fiberId: FiberId.FiberId): Effect.Effect<never, never, void>;
}
/**
 * A runtime fiber that is executing an effect. Runtime fibers have an
 * identity and a trace.
 *
 * @since 2.0.0
 * @category models
 */
export interface RuntimeFiber<E, A> extends Fiber<E, A>, Fiber.RuntimeVariance<E, A> {
    /**
     * Reads the current number of ops that have occurred since the last yield
     */
    get currentOpCount(): number;
    /**
     * Reads the current value of a fiber ref
     */
    getFiberRef<X>(fiberRef: FiberRef<X>): X;
    /**
     * The identity of the fiber.
     */
    id(): FiberId.Runtime;
    /**
     * The status of the fiber.
     */
    status(): Effect.Effect<never, never, FiberStatus.FiberStatus>;
    /**
     * Returns the current `RuntimeFlags` the fiber is running with.
     */
    runtimeFlags(): Effect.Effect<never, never, RuntimeFlags.RuntimeFlags>;
    /**
     * Adds an observer to the list of observers.
     */
    addObserver(observer: (exit: Exit.Exit<E, A>) => void): void;
    /**
     * Removes the specified observer from the list of observers that will be
     * notified when the fiber exits.
     */
    removeObserver(observer: (exit: Exit.Exit<E, A>) => void): void;
    /**
     * Retrieves all fiber refs of the fiber.
     */
    getFiberRefs(): FiberRefs.FiberRefs;
    /**
     * Unsafely observes the fiber, but returns immediately if it is not
     * already done.
     */
    unsafePoll(): Exit.Exit<E, A> | null;
}
/**
 * @since 2.0.0
 */
export declare namespace Fiber {
    /**
     * @since 2.0.0
     * @category models
     */
    type Runtime<E, A> = RuntimeFiber<E, A>;
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<E, A> {
        readonly [FiberTypeId]: {
            readonly _E: (_: never) => E;
            readonly _A: (_: never) => A;
        };
    }
    /**
     * @since 2.0.0
     */
    interface RuntimeVariance<E, A> {
        readonly [RuntimeFiberTypeId]: {
            readonly _E: (_: never) => E;
            readonly _A: (_: never) => A;
        };
    }
    /**
     * @since 2.0.0
     * @category models
     */
    interface Dump {
        /**
         * The fiber's unique identifier.
         */
        readonly id: FiberId.Runtime;
        /**
         * The status of the fiber.
         */
        readonly status: FiberStatus.FiberStatus;
    }
    /**
     * A record containing information about a `Fiber`.
     *
     * @since 2.0.0
     * @category models
     */
    interface Descriptor {
        /**
         * The fiber's unique identifier.
         */
        readonly id: FiberId.FiberId;
        /**
         * The status of the fiber.
         */
        readonly status: FiberStatus.FiberStatus;
        /**
         * The set of fibers attempting to interrupt the fiber or its ancestors.
         */
        readonly interruptors: HashSet.HashSet<FiberId.FiberId>;
    }
}
/**
 * @since 2.0.0
 * @category instances
 */
export declare const Order: order.Order<RuntimeFiber<unknown, unknown>>;
/**
 * Returns `true` if the specified value is a `Fiber`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isFiber: (u: unknown) => u is Fiber<unknown, unknown>;
/**
 * Returns `true` if the specified `Fiber` is a `RuntimeFiber`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isRuntimeFiber: <E, A>(self: Fiber<E, A>) => self is RuntimeFiber<E, A>;
/**
 * The identity of the fiber.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const id: <E, A>(self: Fiber<E, A>) => FiberId.FiberId;
declare const _await: <E, A>(self: Fiber<E, A>) => Effect.Effect<never, never, Exit.Exit<E, A>>;
export { 
/**
 * Awaits the fiber, which suspends the awaiting fiber until the result of the
 * fiber has been determined.
 *
 * @since 2.0.0
 * @category getters
 */
_await as await };
/**
 * Awaits on all fibers to be completed, successfully or not.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const awaitAll: (fibers: Iterable<Fiber<any, any>>) => Effect.Effect<never, never, void>;
/**
 * Retrieves the immediate children of the fiber.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const children: <E, A>(self: Fiber<E, A>) => Effect.Effect<never, never, Array<RuntimeFiber<any, any>>>;
/**
 * Collects all fibers into a single fiber producing an in-order list of the
 * results.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const all: <E, A>(fibers: Iterable<Fiber<E, A>>) => Fiber<E, ReadonlyArray<A>>;
/**
 * A fiber that is done with the specified `Exit` value.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const done: <E, A>(exit: Exit.Exit<E, A>) => Fiber<E, A>;
/**
 * @since 2.0.0
 * @category destructors
 */
export declare const dump: <E, A>(self: RuntimeFiber<E, A>) => Effect.Effect<never, never, Fiber.Dump>;
/**
 * @since 2.0.0
 * @category destructors
 */
export declare const dumpAll: (fibers: Iterable<RuntimeFiber<unknown, unknown>>) => Effect.Effect<never, never, Array<Fiber.Dump>>;
/**
 * A fiber that has already failed with the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fail: <E>(error: E) => Fiber<E, never>;
/**
 * Creates a `Fiber` that has already failed with the specified cause.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const failCause: <E>(cause: Cause.Cause<E>) => Fiber<E, never>;
/**
 * Lifts an `Effect` into a `Fiber`.
 *
 * @since 2.0.0
 * @category conversions
 */
export declare const fromEffect: <E, A>(effect: Effect.Effect<never, E, A>) => Effect.Effect<never, never, Fiber<E, A>>;
/**
 * Gets the current fiber if one is running.
 *
 * @since 2.0.0
 * @category utilities
 */
export declare const getCurrentFiber: () => Option.Option<RuntimeFiber<any, any>>;
/**
 * Inherits values from all `FiberRef` instances into current fiber. This
 * will resume immediately.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const inheritAll: <E, A>(self: Fiber<E, A>) => Effect.Effect<never, never, void>;
/**
 * Interrupts the fiber from whichever fiber is calling this method. If the
 * fiber has already exited, the returned effect will resume immediately.
 * Otherwise, the effect will resume when the fiber exits.
 *
 * @since 2.0.0
 * @category interruption
 */
export declare const interrupt: <E, A>(self: Fiber<E, A>) => Effect.Effect<never, never, Exit.Exit<E, A>>;
/**
 * Constructrs a `Fiber` that is already interrupted.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const interrupted: (fiberId: FiberId.FiberId) => Fiber<never, never>;
/**
 * Interrupts the fiber as if interrupted from the specified fiber. If the
 * fiber has already exited, the returned effect will resume immediately.
 * Otherwise, the effect will resume when the fiber exits.
 *
 * @since 2.0.0
 * @category interruption
 */
export declare const interruptAs: {
    (fiberId: FiberId.FiberId): <E, A>(self: Fiber<E, A>) => Effect.Effect<never, never, Exit.Exit<E, A>>;
    <E, A>(self: Fiber<E, A>, fiberId: FiberId.FiberId): Effect.Effect<never, never, Exit.Exit<E, A>>;
};
/**
 * Interrupts the fiber as if interrupted from the specified fiber. If the
 * fiber has already exited, the returned effect will resume immediately.
 * Otherwise, the effect will resume when the fiber exits.
 *
 * @since 2.0.0
 * @category interruption
 */
export declare const interruptAsFork: {
    (fiberId: FiberId.FiberId): <E, A>(self: Fiber<E, A>) => Effect.Effect<never, never, void>;
    <E, A>(self: Fiber<E, A>, fiberId: FiberId.FiberId): Effect.Effect<never, never, void>;
};
/**
 * Interrupts all fibers, awaiting their interruption.
 *
 * @since 2.0.0
 * @category interruption
 */
export declare const interruptAll: (fibers: Iterable<Fiber<any, any>>) => Effect.Effect<never, never, void>;
/**
 * Interrupts all fibers as by the specified fiber, awaiting their
 * interruption.
 *
 * @since 2.0.0
 * @category interruption
 */
export declare const interruptAllAs: {
    (fiberId: FiberId.FiberId): (fibers: Iterable<Fiber<any, any>>) => Effect.Effect<never, never, void>;
    (fibers: Iterable<Fiber<any, any>>, fiberId: FiberId.FiberId): Effect.Effect<never, never, void>;
};
/**
 * Interrupts the fiber from whichever fiber is calling this method. The
 * interruption will happen in a separate daemon fiber, and the returned
 * effect will always resume immediately without waiting.
 *
 * @since 2.0.0
 * @category interruption
 */
export declare const interruptFork: <E, A>(self: Fiber<E, A>) => Effect.Effect<never, never, void>;
/**
 * Joins the fiber, which suspends the joining fiber until the result of the
 * fiber has been determined. Attempting to join a fiber that has erred will
 * result in a catchable error. Joining an interrupted fiber will result in an
 * "inner interruption" of this fiber, unlike interruption triggered by
 * another fiber, "inner interruption" can be caught and recovered.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const join: <E, A>(self: Fiber<E, A>) => Effect.Effect<never, E, A>;
/**
 * Joins all fibers, awaiting their _successful_ completion. Attempting to
 * join a fiber that has erred will result in a catchable error, _if_ that
 * error does not result from interruption.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const joinAll: <E, A>(fibers: Iterable<Fiber<E, A>>) => Effect.Effect<never, E, void>;
/**
 * Maps over the value the Fiber computes.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const map: {
    <A, B>(f: (a: A) => B): <E>(self: Fiber<E, A>) => Fiber<E, B>;
    <E, A, B>(self: Fiber<E, A>, f: (a: A) => B): Fiber<E, B>;
};
/**
 * Effectually maps over the value the fiber computes.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const mapEffect: {
    <A, E2, A2>(f: (a: A) => Effect.Effect<never, E2, A2>): <E>(self: Fiber<E, A>) => Fiber<E2 | E, A2>;
    <E, A, E2, A2>(self: Fiber<E, A>, f: (a: A) => Effect.Effect<never, E2, A2>): Fiber<E | E2, A2>;
};
/**
 * Passes the success of this fiber to the specified callback, and continues
 * with the fiber that it returns.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const mapFiber: {
    <E, E2, A, B>(f: (a: A) => Fiber<E2, B>): (self: Fiber<E, A>) => Effect.Effect<never, never, Fiber<E | E2, B>>;
    <E, A, E2, B>(self: Fiber<E, A>, f: (a: A) => Fiber<E2, B>): Effect.Effect<never, never, Fiber<E | E2, B>>;
};
/**
 * Folds over the `Fiber` or `RuntimeFiber`.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const match: {
    <E, A, Z>(options: {
        readonly onFiber: (fiber: Fiber<E, A>) => Z;
        readonly onRuntimeFiber: (fiber: RuntimeFiber<E, A>) => Z;
    }): (self: Fiber<E, A>) => Z;
    <E, A, Z>(self: Fiber<E, A>, options: {
        readonly onFiber: (fiber: Fiber<E, A>) => Z;
        readonly onRuntimeFiber: (fiber: RuntimeFiber<E, A>) => Z;
    }): Z;
};
/**
 * A fiber that never fails or succeeds.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const never: Fiber<never, never>;
/**
 * Returns a fiber that prefers `this` fiber, but falls back to the `that` one
 * when `this` one fails. Interrupting the returned fiber will interrupt both
 * fibers, sequentially, from left to right.
 *
 * @since 2.0.0
 * @category alternatives
 */
export declare const orElse: {
    <E2, A2>(that: Fiber<E2, A2>): <E, A>(self: Fiber<E, A>) => Fiber<E2 | E, A2 | A>;
    <E, A, E2, A2>(self: Fiber<E, A>, that: Fiber<E2, A2>): Fiber<E | E2, A | A2>;
};
/**
 * Returns a fiber that prefers `this` fiber, but falls back to the `that` one
 * when `this` one fails. Interrupting the returned fiber will interrupt both
 * fibers, sequentially, from left to right.
 *
 * @since 2.0.0
 * @category alternatives
 */
export declare const orElseEither: {
    <E2, A2>(that: Fiber<E2, A2>): <E, A>(self: Fiber<E, A>) => Fiber<E2 | E, Either.Either<A, A2>>;
    <E, A, E2, A2>(self: Fiber<E, A>, that: Fiber<E2, A2>): Fiber<E | E2, Either.Either<A, A2>>;
};
/**
 * Tentatively observes the fiber, but returns immediately if it is not
 * already done.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const poll: <E, A>(self: Fiber<E, A>) => Effect.Effect<never, never, Option.Option<Exit.Exit<E, A>>>;
/**
 * Pretty-prints a `RuntimeFiber`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const pretty: <E, A>(self: RuntimeFiber<E, A>) => Effect.Effect<never, never, string>;
/**
 * Returns a chunk containing all root fibers.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const roots: Effect.Effect<never, never, Array<RuntimeFiber<any, any>>>;
/**
 * Returns a chunk containing all root fibers.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const unsafeRoots: (_: void) => Array<RuntimeFiber<any, any>>;
/**
 * Converts this fiber into a scoped effect. The fiber is interrupted when the
 * scope is closed.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const scoped: <E, A>(self: Fiber<E, A>) => Effect.Effect<Scope.Scope, never, Fiber<E, A>>;
/**
 * Returns the `FiberStatus` of a `RuntimeFiber`.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const status: <E, A>(self: RuntimeFiber<E, A>) => Effect.Effect<never, never, FiberStatus.FiberStatus>;
/**
 * Returns a fiber that has already succeeded with the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const succeed: <A>(value: A) => Fiber<never, A>;
/**
 * A fiber that has already succeeded with unit.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const unit: Fiber<never, void>;
/**
 * Zips this fiber and the specified fiber together, producing a tuple of
 * their output.
 *
 * @since 2.0.0
 * @category zipping
 */
export declare const zip: {
    <E2, A2>(that: Fiber<E2, A2>): <E, A>(self: Fiber<E, A>) => Fiber<E2 | E, readonly [A, A2]>;
    <E, A, E2, A2>(self: Fiber<E, A>, that: Fiber<E2, A2>): Fiber<E | E2, readonly [A, A2]>;
};
/**
 * Same as `zip` but discards the output of that `Fiber`.
 *
 * @since 2.0.0
 * @category zipping
 */
export declare const zipLeft: {
    <E2, A2>(that: Fiber<E2, A2>): <E, A>(self: Fiber<E, A>) => Fiber<E2 | E, A>;
    <E, A, E2, A2>(self: Fiber<E, A>, that: Fiber<E2, A2>): Fiber<E | E2, A>;
};
/**
 * Same as `zip` but discards the output of this `Fiber`.
 *
 * @since 2.0.0
 * @category zipping
 */
export declare const zipRight: {
    <E2, A2>(that: Fiber<E2, A2>): <E, A>(self: Fiber<E, A>) => Fiber<E2 | E, A2>;
    <E, A, E2, A2>(self: Fiber<E, A>, that: Fiber<E2, A2>): Fiber<E | E2, A2>;
};
/**
 * Zips this fiber with the specified fiber, combining their results using the
 * specified combiner function. Both joins and interruptions are performed in
 * sequential order from left to right.
 *
 * @since 2.0.0
 * @category zipping
 */
export declare const zipWith: {
    <E2, A, B, C>(that: Fiber<E2, B>, f: (a: A, b: B) => C): <E>(self: Fiber<E, A>) => Fiber<E2 | E, C>;
    <E, A, E2, B, C>(self: Fiber<E, A>, that: Fiber<E2, B>, f: (a: A, b: B) => C): Fiber<E | E2, C>;
};
//# sourceMappingURL=Fiber.d.ts.map