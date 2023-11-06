import * as Effect from "../Effect.js";
import * as Exit from "../Exit.js";
import * as Option from "../Option.js";
import { type Predicate } from "../Predicate.js";
import * as Queue from "../Queue.js";
import * as Scope from "../Scope.js";
import type * as Stream from "../Stream.js";
export declare const distributedWithDynamicCallback: (<E, A, _>(maximumLag: number, decide: (a: A) => Effect.Effect<never, never, Predicate<number>>, done: (exit: Exit.Exit<Option.Option<E>, never>) => Effect.Effect<never, never, _>) => <R>(self: Stream.Stream<R, E, A>) => Effect.Effect<Scope.Scope | R, never, Effect.Effect<never, never, readonly [number, Queue.Dequeue<Exit.Exit<Option.Option<E>, A>>]>>) & (<R_1, E_1, A_1, __1>(self: Stream.Stream<R_1, E_1, A_1>, maximumLag: number, decide: (a: A_1) => Effect.Effect<never, never, Predicate<number>>, done: (exit: Exit.Exit<Option.Option<E_1>, never>) => Effect.Effect<never, never, __1>) => Effect.Effect<Scope.Scope | R_1, never, Effect.Effect<never, never, readonly [number, Queue.Dequeue<Exit.Exit<Option.Option<E_1>, A_1>>]>>);
//# sourceMappingURL=stream.d.ts.map