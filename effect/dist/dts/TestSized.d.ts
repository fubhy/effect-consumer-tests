/**
 * @since 2.0.0
 */
import * as Context from "./Context.js";
import type * as Effect from "./Effect.js";
import type * as FiberRef from "./FiberRef.js";
/**
 * @since 2.0.0
 */
export declare const TestSizedTypeId: unique symbol;
/**
 * @since 2.0.0
 */
export type TestSizedTypeId = typeof TestSizedTypeId;
/**
 * @since 2.0.0
 */
export interface TestSized {
    readonly [TestSizedTypeId]: TestSizedTypeId;
    readonly fiberRef: FiberRef.FiberRef<number>;
    size(): Effect.Effect<never, never, number>;
    withSize(size: number): <R, E, A>(effect: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A>;
}
/**
 * @since 2.0.0
 */
export declare const TestSized: Context.Tag<TestSized, TestSized>;
/**
 * @since 2.0.0
 */
export declare const make: (size: number) => TestSized;
/**
 * @since 2.0.0
 */
export declare const fromFiberRef: (fiberRef: FiberRef.FiberRef<number>) => TestSized;
//# sourceMappingURL=TestSized.d.ts.map