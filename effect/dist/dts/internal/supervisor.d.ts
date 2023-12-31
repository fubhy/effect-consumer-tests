import type * as Context from "../Context.js";
import type * as Effect from "../Effect.js";
import type * as Exit from "../Exit.js";
import type * as Fiber from "../Fiber.js";
import type * as Option from "../Option.js";
import type * as Supervisor from "../Supervisor.js";
export declare const isZip: (self: unknown) => self is Zip<any, any>;
export declare class Track implements Supervisor.Supervisor<Array<Fiber.RuntimeFiber<any, any>>> {
    readonly [SupervisorTypeId]: {
        _T: (_: never) => never;
    };
    readonly fibers: Set<Fiber.RuntimeFiber<any, any>>;
    value(): Effect.Effect<never, never, Array<Fiber.RuntimeFiber<any, any>>>;
    onStart<R, E, A>(_context: Context.Context<R>, _effect: Effect.Effect<R, E, A>, _parent: Option.Option<Fiber.RuntimeFiber<any, any>>, fiber: Fiber.RuntimeFiber<E, A>): void;
    onEnd<E, A>(_value: Exit.Exit<E, A>, fiber: Fiber.RuntimeFiber<E, A>): void;
    onEffect<E, A>(_fiber: Fiber.RuntimeFiber<E, A>, _effect: Effect.Effect<any, any, any>): void;
    onSuspend<E, A>(_fiber: Fiber.RuntimeFiber<E, A>): void;
    onResume<E, A>(_fiber: Fiber.RuntimeFiber<E, A>): void;
    map<B>(f: (a: Array<Fiber.RuntimeFiber<any, any>>) => B): Supervisor.Supervisor<B>;
    zip<A>(right: Supervisor.Supervisor<A>): Supervisor.Supervisor<readonly [Array<Fiber.RuntimeFiber<any, any>>, A]>;
    onRun<E, A, X>(execution: () => X, _fiber: Fiber.RuntimeFiber<E, A>): X;
}
export declare class Const<T> implements Supervisor.Supervisor<T> {
    readonly effect: Effect.Effect<never, never, T>;
    readonly [SupervisorTypeId]: {
        _T: (_: never) => never;
    };
    constructor(effect: Effect.Effect<never, never, T>);
    value(): Effect.Effect<never, never, T>;
    onStart<R, E, A>(_context: Context.Context<R>, _effect: Effect.Effect<R, E, A>, _parent: Option.Option<Fiber.RuntimeFiber<any, any>>, _fiber: Fiber.RuntimeFiber<E, A>): void;
    onEnd<E, A>(_value: Exit.Exit<E, A>, _fiber: Fiber.RuntimeFiber<E, A>): void;
    onEffect<E, A>(_fiber: Fiber.RuntimeFiber<E, A>, _effect: Effect.Effect<any, any, any>): void;
    onSuspend<E, A>(_fiber: Fiber.RuntimeFiber<E, A>): void;
    onResume<E, A>(_fiber: Fiber.RuntimeFiber<E, A>): void;
    map<B>(f: (a: T) => B): Supervisor.Supervisor<B>;
    zip<A>(right: Supervisor.Supervisor<A>): Supervisor.Supervisor<readonly [T, A]>;
    onRun<E, A, X>(execution: () => X, _fiber: Fiber.RuntimeFiber<E, A>): X;
}
//# sourceMappingURL=supervisor.d.ts.map