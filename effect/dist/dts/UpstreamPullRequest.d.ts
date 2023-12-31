/**
 * @since 2.0.0
 * @category symbols
 */
export declare const UpstreamPullRequestTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type UpstreamPullRequestTypeId = typeof UpstreamPullRequestTypeId;
/**
 * @since 2.0.0
 * @category models
 */
export type UpstreamPullRequest<A> = Pulled<A> | NoUpstream;
/**
 * @since 2.0.0
 */
export declare namespace UpstreamPullRequest {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<A> {
        readonly [UpstreamPullRequestTypeId]: {
            readonly _A: (_: never) => A;
        };
    }
}
/**
 * @since 2.0.0
 * @category models
 */
export interface Pulled<A> extends UpstreamPullRequest.Variance<A> {
    readonly _tag: "Pulled";
    readonly value: A;
}
/**
 * @since 2.0.0
 * @category models
 */
export interface NoUpstream extends UpstreamPullRequest.Variance<never> {
    readonly _tag: "NoUpstream";
    readonly activeDownstreamCount: number;
}
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const Pulled: <A>(value: A) => UpstreamPullRequest<A>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const NoUpstream: (activeDownstreamCount: number) => UpstreamPullRequest<never>;
/**
 * Returns `true` if the specified value is an `UpstreamPullRequest`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isUpstreamPullRequest: (u: unknown) => u is UpstreamPullRequest<unknown>;
/**
 * Returns `true` if the specified `UpstreamPullRequest` is a `Pulled`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isPulled: <A>(self: UpstreamPullRequest<A>) => self is Pulled<A>;
/**
 * Returns `true` if the specified `UpstreamPullRequest` is a `NoUpstream`,
 * `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isNoUpstream: <A>(self: UpstreamPullRequest<A>) => self is NoUpstream;
/**
 * Folds an `UpstreamPullRequest<A>` into a value of type `Z`.
 *
 * @since 2.0.0
 * @category folding
 */
export declare const match: {
    <A, Z>(options: {
        readonly onPulled: (value: A) => Z;
        readonly onNoUpstream: (activeDownstreamCount: number) => Z;
    }): (self: UpstreamPullRequest<A>) => Z;
    <A, Z>(self: UpstreamPullRequest<A>, options: {
        readonly onPulled: (value: A) => Z;
        readonly onNoUpstream: (activeDownstreamCount: number) => Z;
    }): Z;
};
//# sourceMappingURL=UpstreamPullRequest.d.ts.map