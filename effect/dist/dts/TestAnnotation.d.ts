/**
 * @since 2.0.0
 */
import * as Chunk from "./Chunk.js";
import * as Context from "./Context.js";
import * as Either from "./Either.js";
import * as Equal from "./Equal.js";
import type * as Fiber from "./Fiber.js";
import * as HashSet from "./HashSet.js";
import type * as MutableRef from "./MutableRef.js";
import type * as SortedSet from "./SortedSet.js";
/**
 * @since 2.0.0
 */
export declare const TestAnnotationTypeId: unique symbol;
/**
 * @since 2.0.0
 */
export type TestAnnotationTypeId = typeof TestAnnotationTypeId;
/**
 * @since 2.0.0
 */
export interface TestAnnotation<A> extends Equal.Equal {
    readonly [TestAnnotationTypeId]: TestAnnotationTypeId;
    readonly identifier: string;
    readonly tag: Context.Tag<A, A>;
    readonly initial: A;
    readonly combine: (a: A, b: A) => A;
}
/**
 * @since 2.0.0
 */
export declare const isTestAnnotation: (u: unknown) => u is TestAnnotation<unknown>;
/**
 * @since 2.0.0
 */
export declare const make: <A>(identifier: string, tag: Context.Tag<A, A>, initial: A, combine: (a: A, b: A) => A) => TestAnnotation<A>;
/**
 * @since 2.0.0
 */
export declare const compose: <A>(left: Either.Either<number, Chunk.Chunk<A>>, right: Either.Either<number, Chunk.Chunk<A>>) => Either.Either<number, Chunk.Chunk<A>>;
/**
 * @since 2.0.0
 */
export declare const fibers: TestAnnotation<Either.Either<number, Chunk.Chunk<MutableRef.MutableRef<SortedSet.SortedSet<Fiber.RuntimeFiber<unknown, unknown>>>>>>;
/**
 * An annotation which counts ignored tests.
 *
 * @since 2.0.0
 */
export declare const ignored: TestAnnotation<number>;
/**
 * An annotation which counts repeated tests.
 *
 * @since 2.0.0
 */
export declare const repeated: TestAnnotation<number>;
/**
 * An annotation which counts retried tests.
 *
 * @since 2.0.0
 */
export declare const retried: TestAnnotation<number>;
/**
 * An annotation which tags tests with strings.
 *
 * @since 2.0.0
 */
export declare const tagged: TestAnnotation<HashSet.HashSet<string>>;
//# sourceMappingURL=TestAnnotation.d.ts.map