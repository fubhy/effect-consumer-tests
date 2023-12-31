import type * as Effect from "../Effect.js";
import type { Concurrency } from "../Types.js";
import * as concurrency from "./concurrency.js";
export declare const forEachOptions: {
    <A, R, E, B>(f: (a: A, i: number) => Effect.Effect<R, E, B>, options?: {
        readonly concurrency?: Concurrency;
        readonly batching?: boolean | "inherit";
        readonly discard?: false;
    }): (self: Iterable<A>) => Effect.Effect<R, E, B[]>;
    <A_1, R_1, E_1, B_1>(f: (a: A_1, i: number) => Effect.Effect<R_1, E_1, B_1>, options: {
        readonly concurrency?: Concurrency;
        readonly batching?: boolean | "inherit";
        readonly discard: true;
    }): (self: Iterable<A_1>) => Effect.Effect<R_1, E_1, void>;
} & {
    <A_2, R_2, E_2, B_2>(self: Iterable<A_2>, f: (a: A_2, i: number) => Effect.Effect<R_2, E_2, B_2>, options?: {
        readonly concurrency?: Concurrency;
        readonly batching?: boolean | "inherit";
        readonly discard?: false;
    }): Effect.Effect<R_2, E_2, B_2[]>;
    <A_3, R_3, E_3, B_3>(self: Iterable<A_3>, f: (a: A_3, i: number) => Effect.Effect<R_3, E_3, B_3>, options: {
        readonly concurrency?: Concurrency;
        readonly batching?: boolean | "inherit";
        readonly discard: true;
    }): Effect.Effect<R_3, E_3, void>;
};
//# sourceMappingURL=fiberRuntime.d.ts.map