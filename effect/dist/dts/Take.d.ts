/**
 * @since 2.0.0
 */
import type * as Cause from "./Cause.js";
import type * as Chunk from "./Chunk.js";
import type * as Effect from "./Effect.js";
import type * as Exit from "./Exit.js";
import type * as Option from "./Option.js";
import type { Pipeable } from "./Pipeable.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const TakeTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type TakeTypeId = typeof TakeTypeId;
/**
 * A `Take<E, A>` represents a single `take` from a queue modeling a stream of
 * values. A `Take` may be a failure cause `Cause<E>`, a chunk value `Chunk<A>`,
 * or an end-of-stream marker.
 *
 * @since 2.0.0
 * @category models
 */
export interface Take<E, A> extends Take.Variance<E, A>, Pipeable {
}
/**
 * @since 2.0.0
 */
export declare namespace Take {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<E, A> {
        readonly [TakeTypeId]: {
            readonly _E: (_: never) => E;
            readonly _A: (_: never) => A;
        };
    }
}
/**
 * Creates a `Take` with the specified chunk.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const chunk: <A>(chunk: Chunk.Chunk<A>) => Take<never, A>;
/**
 * Creates a failing `Take` with the specified defect.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const die: (defect: unknown) => Take<never, never>;
/**
 * Creates a failing `Take` with the specified error message.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const dieMessage: (message: string) => Take<never, never>;
/**
 * Transforms a `Take<E, A>` to an `Effect<never, E, A>`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const done: <E, A>(self: Take<E, A>) => Effect.Effect<never, Option.Option<E>, Chunk.Chunk<A>>;
/**
 * Represents the end-of-stream marker.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const end: Take<never, never>;
/**
 * Creates a failing `Take` with the specified error.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fail: <E>(error: E) => Take<E, never>;
/**
 * Creates a failing `Take` with the specified cause.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const failCause: <E>(cause: Cause.Cause<E>) => Take<E, never>;
/**
 * Creates an effect from `Effect<R, E, A>` that does not fail, but succeeds with
 * the `Take<E, A>`. Error from stream when pulling is converted to
 * `Take.failCause`. Creates a single value chunk.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromEffect: <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, never, Take<E, A>>;
/**
 * Creates a `Take` from an `Exit`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromExit: <E, A>(exit: Exit.Exit<E, A>) => Take<E, A>;
/**
 * Creates effect from `Effect<R, Option<E>, Chunk<A>>` that does not fail, but
 * succeeds with the `Take<E, A>`. Errors from stream when pulling are converted
 * to `Take.failCause`, and the end-of-stream is converted to `Take.end`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromPull: <R, E, A>(pull: Effect.Effect<R, Option.Option<E>, Chunk.Chunk<A>>) => Effect.Effect<R, never, Take<E, A>>;
/**
 * Checks if this `take` is done (`Take.end`).
 *
 * @since 2.0.0
 * @category getters
 */
export declare const isDone: <E, A>(self: Take<E, A>) => boolean;
/**
 * Checks if this `take` is a failure.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const isFailure: <E, A>(self: Take<E, A>) => boolean;
/**
 * Checks if this `take` is a success.
 *
 * @since 2.0.0
 * @category getters
 */
export declare const isSuccess: <E, A>(self: Take<E, A>) => boolean;
/**
 * Constructs a `Take`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const make: <E, A>(exit: Exit.Exit<Option.Option<E>, Chunk.Chunk<A>>) => Take<E, A>;
/**
 * Transforms `Take<E, A>` to `Take<E, B>` by applying function `f`.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const map: {
    <A, B>(f: (a: A) => B): <E>(self: Take<E, A>) => Take<E, B>;
    <E, A, B>(self: Take<E, A>, f: (a: A) => B): Take<E, B>;
};
/**
 * Folds over the failure cause, success value and end-of-stream marker to
 * yield a value.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const match: {
    <Z, E, Z2, A, Z3>(options: {
        readonly onEnd: () => Z;
        readonly onFailure: (cause: Cause.Cause<E>) => Z2;
        readonly onSuccess: (chunk: Chunk.Chunk<A>) => Z3;
    }): (self: Take<E, A>) => Z | Z2 | Z3;
    <Z, E, Z2, A, Z3>(self: Take<E, A>, options: {
        readonly onEnd: () => Z;
        readonly onFailure: (cause: Cause.Cause<E>) => Z2;
        readonly onSuccess: (chunk: Chunk.Chunk<A>) => Z3;
    }): Z | Z2 | Z3;
};
/**
 * Effectful version of `Take.fold`.
 *
 * Folds over the failure cause, success value and end-of-stream marker to
 * yield an effect.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const matchEffect: {
    <R, E2, Z, R2, E, Z2, A, R3, E3, Z3>(options: {
        readonly onEnd: () => Effect.Effect<R, E2, Z>;
        readonly onFailure: (cause: Cause.Cause<E>) => Effect.Effect<R2, E2, Z2>;
        readonly onSuccess: (chunk: Chunk.Chunk<A>) => Effect.Effect<R3, E3, Z3>;
    }): (self: Take<E, A>) => Effect.Effect<R | R2 | R3, E2 | E | E3, Z | Z2 | Z3>;
    <R, E2, Z, R2, E, Z2, A, R3, E3, Z3>(self: Take<E, A>, options: {
        readonly onEnd: () => Effect.Effect<R, E2, Z>;
        readonly onFailure: (cause: Cause.Cause<E>) => Effect.Effect<R2, E2, Z2>;
        readonly onSuccess: (chunk: Chunk.Chunk<A>) => Effect.Effect<R3, E3, Z3>;
    }): Effect.Effect<R | R2 | R3, E2 | E | E3, Z | Z2 | Z3>;
};
/**
 * Creates a `Take` with a single value chunk.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const of: <A>(value: A) => Take<never, A>;
/**
 * Returns an effect that effectfully "peeks" at the success of this take.
 *
 * @since 2.0.0
 * @category sequencing
 */
export declare const tap: {
    <A, R, E2, _>(f: (chunk: Chunk.Chunk<A>) => Effect.Effect<R, E2, _>): <E>(self: Take<E, A>) => Effect.Effect<R, E2 | E, void>;
    <E, A, R, E2, _>(self: Take<E, A>, f: (chunk: Chunk.Chunk<A>) => Effect.Effect<R, E2, _>): Effect.Effect<R, E | E2, void>;
};
//# sourceMappingURL=Take.d.ts.map