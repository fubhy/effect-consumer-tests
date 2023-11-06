/**
 * @since 2.0.0
 */
/**
 * @category symbol
 * @since 2.0.0
 */
export declare const nonEmpty: unique symbol;
/**
 * @category model
 * @since 2.0.0
 */
export interface NonEmptyIterable<A> extends Iterable<A> {
    readonly [nonEmpty]: A;
}
/**
 * @category getters
 * @since 2.0.0
 */
export declare const unprepend: <A>(self: NonEmptyIterable<A>) => readonly [A, Iterator<A, any, undefined>];
//# sourceMappingURL=NonEmptyIterable.d.ts.map