/**
 * @since 2.0.0
 */
import type * as Cause from "./Cause.js";
import type * as ChildExecutorDecision from "./ChildExecutorDecision.js";
import type * as Chunk from "./Chunk.js";
import type * as Context from "./Context.js";
import type * as Deferred from "./Deferred.js";
import type * as Effect from "./Effect.js";
import type * as Either from "./Either.js";
import type * as Exit from "./Exit.js";
import type { LazyArg } from "./Function.js";
import type * as Layer from "./Layer.js";
import type * as MergeDecision from "./MergeDecision.js";
import type * as MergeStrategy from "./MergeStrategy.js";
import type * as Option from "./Option.js";
import type { Pipeable } from "./Pipeable.js";
import type { Predicate } from "./Predicate.js";
import type * as PubSub from "./PubSub.js";
import type * as Queue from "./Queue.js";
import type * as Ref from "./Ref.js";
import type * as Scope from "./Scope.js";
import type * as SingleProducerAsyncInput from "./SingleProducerAsyncInput.js";
import type * as Sink from "./Sink.js";
import type * as Stream from "./Stream.js";
import type * as Tracer from "./Tracer.js";
import type * as Unify from "./Unify.js";
import type * as UpstreamPullRequest from "./UpstreamPullRequest.js";
import type * as UpstreamPullStrategy from "./UpstreamPullStrategy.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const ChannelTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type ChannelTypeId = typeof ChannelTypeId;
/**
 * A `Channel` is a nexus of I/O operations, which supports both reading and
 * writing. A channel may read values of type `InElem` and write values of type
 * `OutElem`. When the channel finishes, it yields a value of type `OutDone`. A
 * channel may fail with a value of type `OutErr`.
 *
 * Channels are the foundation of Streams: both streams and sinks are built on
 * channels. Most users shouldn't have to use channels directly, as streams and
 * sinks are much more convenient and cover all common use cases. However, when
 * adding new stream and sink operators, or doing something highly specialized,
 * it may be useful to use channels directly.
 *
 * Channels compose in a variety of ways:
 *
 *  - **Piping**: One channel can be piped to another channel, assuming the
 *    input type of the second is the same as the output type of the first.
 *  - **Sequencing**: The terminal value of one channel can be used to create
 *    another channel, and both the first channel and the function that makes
 *    the second channel can be composed into a channel.
 *  - **Concatenating**: The output of one channel can be used to create other
 *    channels, which are all concatenated together. The first channel and the
 *    function that makes the other channels can be composed into a channel.
 *
 * @since 2.0.0
 * @category models
 */
export interface Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone> extends Channel.Variance<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, Pipeable {
    [Unify.typeSymbol]?: unknown;
    [Unify.unifySymbol]?: ChannelUnify<this>;
    [Unify.blacklistSymbol]?: ChannelUnifyBlacklist;
}
/**
 * @since 2.0.0
 * @category models
 */
export interface ChannelUnify<A extends {
    [Unify.typeSymbol]?: any;
}> extends Effect.EffectUnify<A> {
    Channel?: () => A[Unify.typeSymbol] extends Channel<infer Env, infer InErr, infer InElem, infer InDone, infer OutErr, infer OutElem, infer OutDone> | infer _ ? Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone> : never;
}
/**
 * @category models
 * @since 2.0.0
 */
export interface ChannelUnifyBlacklist extends Effect.EffectUnifyBlacklist {
    Channel?: true;
}
/**
 * @since 2.0.0
 * @category models
 */
declare module "./Effect.js" {
    interface Effect<R, E, A> extends Channel<R, unknown, unknown, unknown, E, never, A> {
    }
    interface EffectUnifyBlacklist {
        Channel?: true;
    }
}
/**
 * @since 2.0.0
 */
export declare namespace Channel {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone> {
        readonly [ChannelTypeId]: VarianceStruct<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    }
    /**
     * @since 2.0.0
     * @category models
     */
    interface VarianceStruct<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone> {
        _Env: (_: never) => Env;
        _InErr: (_: InErr) => void;
        _InElem: (_: InElem) => void;
        _InDone: (_: InDone) => void;
        _OutErr: (_: never) => OutErr;
        _OutElem: (_: never) => OutElem;
        _OutDone: (_: never) => OutDone;
    }
}
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const ChannelExceptionTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type ChannelExceptionTypeId = typeof ChannelExceptionTypeId;
/**
 * Represents a generic checked exception which occurs when a `Channel` is
 * executed.
 *
 * @since 2.0.0
 * @category models
 */
export interface ChannelException<E> {
    readonly _tag: "ChannelException";
    readonly [ChannelExceptionTypeId]: ChannelExceptionTypeId;
    readonly error: E;
}
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const acquireUseRelease: <Env, InErr, InElem, InDone, OutErr, OutElem1, OutDone, Acquired>(acquire: Effect.Effect<Env, OutErr, Acquired>, use: (a: Acquired) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem1, OutDone>, release: (a: Acquired, exit: Exit.Exit<OutErr, OutDone>) => Effect.Effect<Env, never, any>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem1, OutDone>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const acquireReleaseOut: <R, R2, E, Z>(self: Effect.Effect<R, E, Z>, release: (z: Z, e: Exit.Exit<unknown, unknown>) => Effect.Effect<R2, never, unknown>) => Channel<R | R2, unknown, unknown, unknown, E, Z, void>;
/**
 * Returns a new channel that is the same as this one, except the terminal
 * value of the channel is the specified constant value.
 *
 * This method produces the same result as mapping this channel to the
 * specified constant value.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const as: {
    <OutDone2>(value: OutDone2): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone2>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, OutDone2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, value: OutDone2): Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone2>;
};
/**
 * @since 2.0.0
 * @category mapping
 */
export declare const asUnit: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, void>;
/**
 * Creates a channel backed by a buffer. When the buffer is empty, the channel
 * will simply passthrough its input as output. However, when the buffer is
 * non-empty, the value inside the buffer will be passed along as output.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const buffer: <InErr, InElem, InDone>(options: {
    readonly empty: InElem;
    readonly isEmpty: Predicate<InElem>;
    readonly ref: Ref.Ref<InElem>;
}) => Channel<never, InErr, InElem, InDone, InErr, InElem, InDone>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const bufferChunk: <InErr, InElem, InDone>(ref: Ref.Ref<Chunk.Chunk<InElem>>) => Channel<never, InErr, Chunk.Chunk<InElem>, InDone, InErr, Chunk.Chunk<InElem>, InDone>;
/**
 * Returns a new channel that is the same as this one, except if this channel
 * errors for any typed error, then the returned channel will switch over to
 * using the fallback channel returned by the specified error handler.
 *
 * @since 2.0.0
 * @category error handling
 */
export declare const catchAll: {
    <Env1, InErr1, InElem1, InDone1, OutErr, OutErr1, OutElem1, OutDone1>(f: (error: OutErr) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>): <Env, InErr, InElem, InDone, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1, OutElem1 | OutElem, OutDone1 | OutDone>;
    <Env, InErr, InElem, InDone, OutElem, OutDone, Env1, InErr1, InElem1, InDone1, OutErr, OutErr1, OutElem1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (error: OutErr) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1, OutElem | OutElem1, OutDone | OutDone1>;
};
/**
 * Returns a new channel that is the same as this one, except if this channel
 * errors for any typed error, then the returned channel will switch over to
 * using the fallback channel returned by the specified error handler.
 *
 * @since 2.0.0
 * @category error handling
 */
export declare const catchAllCause: {
    <Env1, InErr1, InElem1, InDone1, OutErr, OutErr1, OutElem1, OutDone1>(f: (cause: Cause.Cause<OutErr>) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>): <Env, InErr, InElem, InDone, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1, OutElem1 | OutElem, OutDone1 | OutDone>;
    <Env, InErr, InElem, InDone, OutElem, OutDone, Env1, InErr1, InElem1, InDone1, OutErr, OutErr1, OutElem1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (cause: Cause.Cause<OutErr>) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1, OutElem | OutElem1, OutDone | OutDone1>;
};
/**
 * Concat sequentially a channel of channels.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const concatAll: <Env, InErr, InElem, InDone, OutErr, OutElem>(channels: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env, InErr, InElem, InDone, OutErr, OutElem, any>, any>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, any>;
/**
 * Concat sequentially a channel of channels.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const concatAllWith: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, OutDone2, OutDone3, Env2, InErr2, InElem2, InDone2, OutErr2>(channels: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem, OutDone>, OutDone2>, f: (o: OutDone, o1: OutDone) => OutDone, g: (o: OutDone, o2: OutDone2) => OutDone3) => Channel<Env | Env2, InErr & InErr2, InElem & InElem2, InDone & InDone2, OutErr | OutErr2, OutElem, OutDone3>;
/**
 * Returns a new channel whose outputs are fed to the specified factory
 * function, which creates new channels in response. These new channels are
 * sequentially concatenated together, and all their outputs appear as outputs
 * of the newly returned channel.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const concatMap: {
    <OutElem, OutElem2, Env2, InErr2, InElem2, InDone2, OutErr2, _>(f: (o: OutElem) => Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem2, _>): <Env, InErr, InElem, InDone, OutErr, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env2 | Env, InErr & InErr2, InElem & InElem2, InDone & InDone2, OutErr2 | OutErr, OutElem2, unknown>;
    <Env, InErr, InElem, InDone, OutErr, OutDone, OutElem, OutElem2, Env2, InErr2, InElem2, InDone2, OutErr2, _>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (o: OutElem) => Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem2, _>): Channel<Env | Env2, InErr & InErr2, InElem & InElem2, InDone & InDone2, OutErr | OutErr2, OutElem2, unknown>;
};
/**
 * Returns a new channel whose outputs are fed to the specified factory
 * function, which creates new channels in response. These new channels are
 * sequentially concatenated together, and all their outputs appear as outputs
 * of the newly returned channel. The provided merging function is used to
 * merge the terminal values of all channels into the single terminal value of
 * the returned channel.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const concatMapWith: {
    <OutElem, OutElem2, OutDone, OutDone2, OutDone3, Env2, InErr2, InElem2, InDone2, OutErr2>(f: (o: OutElem) => Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem2, OutDone>, g: (o: OutDone, o1: OutDone) => OutDone, h: (o: OutDone, o2: OutDone2) => OutDone3): <Env, InErr, InElem, InDone, OutErr>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone2>) => Channel<Env2 | Env, InErr & InErr2, InElem & InElem2, InDone & InDone2, OutErr2 | OutErr, OutElem2, OutDone3>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutElem2, OutDone, OutDone2, OutDone3, Env2, InErr2, InElem2, InDone2, OutErr2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone2>, f: (o: OutElem) => Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem2, OutDone>, g: (o: OutDone, o1: OutDone) => OutDone, h: (o: OutDone, o2: OutDone2) => OutDone3): Channel<Env | Env2, InErr & InErr2, InElem & InElem2, InDone & InDone2, OutErr | OutErr2, OutElem2, OutDone3>;
};
/**
 * Returns a new channel whose outputs are fed to the specified factory
 * function, which creates new channels in response. These new channels are
 * sequentially concatenated together, and all their outputs appear as outputs
 * of the newly returned channel. The provided merging function is used to
 * merge the terminal values of all channels into the single terminal value of
 * the returned channel.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const concatMapWithCustom: {
    <OutElem, OutElem2, OutDone, OutDone2, OutDone3, Env2, InErr2, InElem2, InDone2, OutErr2>(f: (o: OutElem) => Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem2, OutDone>, g: (o: OutDone, o1: OutDone) => OutDone, h: (o: OutDone, o2: OutDone2) => OutDone3, onPull: (upstreamPullRequest: UpstreamPullRequest.UpstreamPullRequest<OutElem>) => UpstreamPullStrategy.UpstreamPullStrategy<OutElem2>, onEmit: (elem: OutElem2) => ChildExecutorDecision.ChildExecutorDecision): <Env, InErr, InElem, InDone, OutErr>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone2>) => Channel<Env2 | Env, InErr & InErr2, InElem & InElem2, InDone & InDone2, OutErr2 | OutErr, OutElem2, OutDone3>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutElem2, OutDone, OutDone2, OutDone3, Env2, InErr2, InElem2, InDone2, OutErr2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone2>, f: (o: OutElem) => Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem2, OutDone>, g: (o: OutDone, o1: OutDone) => OutDone, h: (o: OutDone, o2: OutDone2) => OutDone3, onPull: (upstreamPullRequest: UpstreamPullRequest.UpstreamPullRequest<OutElem>) => UpstreamPullStrategy.UpstreamPullStrategy<OutElem2>, onEmit: (elem: OutElem2) => ChildExecutorDecision.ChildExecutorDecision): Channel<Env | Env2, InErr & InErr2, InElem & InElem2, InDone & InDone2, OutErr | OutErr2, OutElem2, OutDone3>;
};
/**
 * Returns a new channel, which is the same as this one, except its outputs
 * are filtered and transformed by the specified partial function.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const collect: {
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutElem2, OutDone>(pf: (o: OutElem) => Option.Option<OutElem2>): (self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem2, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutElem2, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, pf: (o: OutElem) => Option.Option<OutElem2>): Channel<Env, InErr, InElem, InDone, OutErr, OutElem2, OutDone>;
};
/**
 * Returns a new channel, which is the concatenation of all the channels that
 * are written out by this channel. This method may only be called on channels
 * that output other channels.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const concatOut: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env, InErr, InElem, InDone, OutErr, OutElem, unknown>, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, unknown>;
/**
 * Returns a new channel which is the same as this one but applies the given
 * function to the input channel's done value.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mapInput: {
    <InDone0, InDone>(f: (a: InDone0) => InDone): <Env, InErr, InElem, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone0, OutErr, OutElem, OutDone>;
    <Env, InErr, InElem, OutErr, OutElem, OutDone, InDone0, InDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (a: InDone0) => InDone): Channel<Env, InErr, InElem, InDone0, OutErr, OutElem, OutDone>;
};
/**
 * Returns a new channel which is the same as this one but applies the given
 * effectual function to the input channel's done value.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mapInputEffect: {
    <Env1, InErr, InDone0, InDone>(f: (i: InDone0) => Effect.Effect<Env1, InErr, InDone>): <Env, InElem, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr, InElem, InDone0, OutErr, OutElem, OutDone>;
    <Env, InElem, OutErr, OutElem, OutDone, Env1, InErr, InDone0, InDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (i: InDone0) => Effect.Effect<Env1, InErr, InDone>): Channel<Env | Env1, InErr, InElem, InDone0, OutErr, OutElem, OutDone>;
};
/**
 * Returns a new channel which is the same as this one but applies the given
 * function to the input channel's error value.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mapInputError: {
    <InErr0, InErr>(f: (a: InErr0) => InErr): <Env, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr0, InElem, InDone, OutErr, OutElem, OutDone>;
    <Env, InElem, InDone, OutErr, OutElem, OutDone, InErr0, InErr>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (a: InErr0) => InErr): Channel<Env, InErr0, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Returns a new channel which is the same as this one but applies the given
 * effectual function to the input channel's error value.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mapInputErrorEffect: {
    <Env1, InErr0, InErr, InDone>(f: (error: InErr0) => Effect.Effect<Env1, InErr, InDone>): <Env, InElem, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr0, InElem, InDone, OutErr, OutElem, OutDone>;
    <Env, InElem, OutErr, OutElem, OutDone, Env1, InErr0, InErr, InDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (error: InErr0) => Effect.Effect<Env1, InErr, InDone>): Channel<Env | Env1, InErr0, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Returns a new channel which is the same as this one but applies the given
 * function to the input channel's output elements.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mapInputIn: {
    <InElem0, InElem>(f: (a: InElem0) => InElem): <Env, InErr, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem0, InDone, OutErr, OutElem, OutDone>;
    <Env, InErr, InDone, OutErr, OutElem, OutDone, InElem0, InElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (a: InElem0) => InElem): Channel<Env, InErr, InElem0, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Returns a new channel which is the same as this one but applies the given
 * effectual function to the input channel's output elements.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mapInputInEffect: {
    <Env1, InErr, InElem0, InElem>(f: (a: InElem0) => Effect.Effect<Env1, InErr, InElem>): <Env, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr, InElem0, InDone, OutErr, OutElem, OutDone>;
    <Env, InDone, OutErr, OutElem, OutDone, Env1, InErr, InElem0, InElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (a: InElem0) => Effect.Effect<Env1, InErr, InElem>): Channel<Env | Env1, InErr, InElem0, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Returns a new channel, which is the same as this one, except that all the
 * outputs are collected and bundled into a tuple together with the terminal
 * value of this channel.
 *
 * As the channel returned from this channel collects all of this channel's
 * output into an in- memory chunk, it is not safe to call this method on
 * channels that output a large or unbounded number of values.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const doneCollect: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, never, readonly [Chunk.Chunk<OutElem>, OutDone]>;
/**
 * Returns a new channel which reads all the elements from upstream's output
 * channel and ignores them, then terminates with the upstream result value.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const drain: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, never, OutDone>;
/**
 * Returns a new channel which connects the given `AsyncInputProducer` as
 * this channel's input.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const embedInput: {
    <InErr, InElem, InDone>(input: SingleProducerAsyncInput.AsyncInputProducer<InErr, InElem, InDone>): <Env, OutErr, OutElem, OutDone>(self: Channel<Env, unknown, unknown, unknown, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    <Env, OutErr, OutElem, OutDone, InErr, InElem, InDone>(self: Channel<Env, unknown, unknown, unknown, OutErr, OutElem, OutDone>, input: SingleProducerAsyncInput.AsyncInputProducer<InErr, InElem, InDone>): Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Returns a new channel that collects the output and terminal value of this
 * channel, which it then writes as output of the returned channel.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const emitCollect: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, readonly [Chunk.Chunk<OutElem>, OutDone], void>;
/**
 * Returns a new channel with an attached finalizer. The finalizer is
 * guaranteed to be executed so long as the channel begins execution (and
 * regardless of whether or not it completes).
 *
 * @since 2.0.0
 * @category utils
 */
export declare const ensuring: {
    <Env1, Z>(finalizer: Effect.Effect<Env1, never, Z>): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env1, Z>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, finalizer: Effect.Effect<Env1, never, Z>): Channel<Env | Env1, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Returns a new channel with an attached finalizer. The finalizer is
 * guaranteed to be executed so long as the channel begins execution (and
 * regardless of whether or not it completes).
 *
 * @since 2.0.0
 * @category utils
 */
export declare const ensuringWith: {
    <Env2, OutErr, OutDone>(finalizer: (e: Exit.Exit<OutErr, OutDone>) => Effect.Effect<Env2, never, unknown>): <Env, InErr, InElem, InDone, OutElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env2 | Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutElem, Env2, OutErr, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, finalizer: (e: Exit.Exit<OutErr, OutDone>) => Effect.Effect<Env2, never, unknown>): Channel<Env | Env2, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Accesses the whole context of the channel.
 *
 * @since 2.0.0
 * @category context
 */
export declare const context: <Env>() => Channel<Env, unknown, unknown, unknown, never, never, Context.Context<Env>>;
/**
 * Accesses the context of the channel with the specified function.
 *
 * @since 2.0.0
 * @category context
 */
export declare const contextWith: <Env, OutDone>(f: (env: Context.Context<Env>) => OutDone) => Channel<Env, unknown, unknown, unknown, never, never, OutDone>;
/**
 * Accesses the context of the channel in the context of a channel.
 *
 * @since 2.0.0
 * @category context
 */
export declare const contextWithChannel: <Env, Env1, InErr, InElem, InDone, OutErr, OutElem, OutDone>(f: (env: Context.Context<Env>) => Channel<Env1, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env | Env1, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
/**
 * Accesses the context of the channel in the context of an effect.
 *
 * @since 2.0.0
 * @category context
 */
export declare const contextWithEffect: <Env, Env1, OutErr, OutDone>(f: (env: Context.Context<Env>) => Effect.Effect<Env1, OutErr, OutDone>) => Channel<Env | Env1, unknown, unknown, unknown, OutErr, never, OutDone>;
/**
 * Constructs a channel that fails immediately with the specified error.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fail: <E>(error: E) => Channel<never, unknown, unknown, unknown, E, never, never>;
/**
 * Constructs a channel that succeeds immediately with the specified lazily
 * evaluated value.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const failSync: <E>(evaluate: LazyArg<E>) => Channel<never, unknown, unknown, unknown, E, never, never>;
/**
 * Constructs a channel that fails immediately with the specified `Cause`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const failCause: <E>(cause: Cause.Cause<E>) => Channel<never, unknown, unknown, unknown, E, never, never>;
/**
 * Constructs a channel that succeeds immediately with the specified lazily
 * evaluated `Cause`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const failCauseSync: <E>(evaluate: LazyArg<Cause.Cause<E>>) => Channel<never, unknown, unknown, unknown, E, never, never>;
/**
 * Returns a new channel, which sequentially combines this channel, together
 * with the provided factory function, which creates a second channel based on
 * the terminal value of this channel. The result is a channel that will first
 * perform the functions of this channel, before performing the functions of
 * the created channel (including yielding its terminal value).
 *
 * @since 2.0.0
 * @category sequencing
 */
export declare const flatMap: {
    <OutDone, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone2>(f: (d: OutDone) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone2>): <Env, InErr, InElem, InDone, OutErr, OutElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1 | OutErr, OutElem1 | OutElem, OutDone2>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (d: OutDone) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone2>): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem | OutElem1, OutDone2>;
};
/**
 * Returns a new channel, which flattens the terminal value of this channel.
 * This function may only be called if the terminal value of this channel is
 * another channel of compatible types.
 *
 * @since 2.0.0
 * @category sequencing
 */
export declare const flatten: <Env, InErr, InElem, InDone, OutErr, OutElem, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone2>>) => Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem | OutElem1, OutDone2>;
/**
 * Folds over the result of this channel.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const foldChannel: {
    <Env1, Env2, InErr1, InErr2, InElem1, InElem2, InDone1, InDone2, OutErr, OutErr1, OutErr2, OutElem1, OutElem2, OutDone, OutDone1, OutDone2>(options: {
        readonly onFailure: (error: OutErr) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>;
        readonly onSuccess: (done: OutDone) => Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem2, OutDone2>;
    }): <Env, InErr, InElem, InDone, OutElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env2 | Env, InErr & InErr1 & InErr2, InElem & InElem1 & InElem2, InDone & InDone1 & InDone2, OutErr1 | OutErr2, OutElem1 | OutElem2 | OutElem, OutDone1 | OutDone2>;
    <Env, InErr, InElem, InDone, OutElem, Env1, Env2, InErr1, InErr2, InElem1, InElem2, InDone1, InDone2, OutErr, OutErr1, OutErr2, OutElem1, OutElem2, OutDone, OutDone1, OutDone2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, options: {
        readonly onFailure: (error: OutErr) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>;
        readonly onSuccess: (done: OutDone) => Channel<Env2, InErr2, InElem2, InDone2, OutErr2, OutElem2, OutDone2>;
    }): Channel<Env | Env1 | Env2, InErr & InErr1 & InErr2, InElem & InElem1 & InElem2, InDone & InDone1 & InDone2, OutErr1 | OutErr2, OutElem | OutElem1 | OutElem2, OutDone1 | OutDone2>;
};
/**
 * Folds over the result of this channel including any cause of termination.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const foldCauseChannel: {
    <Env1, Env2, InErr1, InErr2, InElem1, InElem2, InDone1, InDone2, OutErr, OutErr2, OutErr3, OutElem1, OutElem2, OutDone, OutDone2, OutDone3>(options: {
        readonly onFailure: (c: Cause.Cause<OutErr>) => Channel<Env1, InErr1, InElem1, InDone1, OutErr2, OutElem1, OutDone2>;
        readonly onSuccess: (o: OutDone) => Channel<Env2, InErr2, InElem2, InDone2, OutErr3, OutElem2, OutDone3>;
    }): <Env, InErr, InElem, InDone, OutElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env2 | Env, InErr & InErr1 & InErr2, InElem & InElem1 & InElem2, InDone & InDone1 & InDone2, OutErr2 | OutErr3, OutElem1 | OutElem2 | OutElem, OutDone2 | OutDone3>;
    <Env, InErr, InElem, InDone, OutElem, Env1, Env2, InErr1, InErr2, InElem1, InElem2, InDone1, InDone2, OutErr, OutErr2, OutErr3, OutElem1, OutElem2, OutDone, OutDone2, OutDone3>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, options: {
        readonly onFailure: (c: Cause.Cause<OutErr>) => Channel<Env1, InErr1, InElem1, InDone1, OutErr2, OutElem1, OutDone2>;
        readonly onSuccess: (o: OutDone) => Channel<Env2, InErr2, InElem2, InDone2, OutErr3, OutElem2, OutDone3>;
    }): Channel<Env | Env1 | Env2, InErr & InErr1 & InErr2, InElem & InElem1 & InElem2, InDone & InDone1 & InDone2, OutErr2 | OutErr3, OutElem | OutElem1 | OutElem2, OutDone2 | OutDone3>;
};
/**
 * Use an effect to end a channel.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromEffect: <R, E, A>(effect: Effect.Effect<R, E, A>) => Channel<R, unknown, unknown, unknown, E, never, A>;
/**
 * Constructs a channel from an `Either`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromEither: <E, A>(either: Either.Either<E, A>) => Channel<never, unknown, unknown, unknown, E, never, A>;
/**
 * Construct a `Channel` from an `AsyncInputConsumer`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromInput: <Err, Elem, Done>(input: SingleProducerAsyncInput.AsyncInputConsumer<Err, Elem, Done>) => Channel<never, unknown, unknown, unknown, Err, Elem, Done>;
/**
 * Construct a `Channel` from a `PubSub`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromPubSub: <Err, Done, Elem>(pubsub: PubSub.PubSub<Either.Either<Exit.Exit<Err, Done>, Elem>>) => Channel<never, unknown, unknown, unknown, Err, Elem, Done>;
/**
 * Construct a `Channel` from a `PubSub` within a scoped effect.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromPubSubScoped: <Err, Done, Elem>(pubsub: PubSub.PubSub<Either.Either<Exit.Exit<Err, Done>, Elem>>) => Effect.Effect<Scope.Scope, never, Channel<never, unknown, unknown, unknown, Err, Elem, Done>>;
/**
 * Construct a `Channel` from an `Option`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromOption: <A>(option: Option.Option<A>) => Channel<never, unknown, unknown, unknown, Option.Option<never>, never, A>;
/**
 * Construct a `Channel` from a `Queue`.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const fromQueue: <Err, Elem, Done>(queue: Queue.Dequeue<Either.Either<Exit.Exit<Err, Done>, Elem>>) => Channel<never, unknown, unknown, unknown, Err, Elem, Done>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const identity: <Err, Elem, Done>() => Channel<never, Err, Elem, Done, Err, Elem, Done>;
/**
 * Returns a new channel, which is the same as this one, except it will be
 * interrupted when the specified effect completes. If the effect completes
 * successfully before the underlying channel is done, then the returned
 * channel will yield the success value of the effect as its terminal value.
 * On the other hand, if the underlying channel finishes first, then the
 * returned channel will yield the success value of the underlying channel as
 * its terminal value.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const interruptWhen: {
    <Env1, OutErr1, OutDone1>(effect: Effect.Effect<Env1, OutErr1, OutDone1>): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr, InElem, InDone, OutErr1 | OutErr, OutElem, OutDone1 | OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env1, OutErr1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, effect: Effect.Effect<Env1, OutErr1, OutDone1>): Channel<Env | Env1, InErr, InElem, InDone, OutErr | OutErr1, OutElem, OutDone | OutDone1>;
};
/**
 * Returns a new channel, which is the same as this one, except it will be
 * interrupted when the specified deferred is completed. If the deferred is
 * completed before the underlying channel is done, then the returned channel
 * will yield the value of the deferred. Otherwise, if the underlying channel
 * finishes first, then the returned channel will yield the value of the
 * underlying channel.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const interruptWhenDeferred: {
    <OutErr1, OutDone1>(deferred: Deferred.Deferred<OutErr1, OutDone1>): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr1 | OutErr, OutElem, OutDone1 | OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, OutErr1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, deferred: Deferred.Deferred<OutErr1, OutDone1>): Channel<Env, InErr, InElem, InDone, OutErr | OutErr1, OutElem, OutDone | OutDone1>;
};
/**
 * Returns a new channel, which is the same as this one, except the terminal
 * value of the returned channel is created by applying the specified function
 * to the terminal value of this channel.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const map: {
    <OutDone, OutDone2>(f: (out: OutDone) => OutDone2): <Env, InErr, InElem, InDone, OutErr, OutElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone2>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, OutDone2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (out: OutDone) => OutDone2): Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone2>;
};
/**
 * Returns a new channel, which is the same as this one, except the terminal
 * value of the returned channel is created by applying the specified
 * effectful function to the terminal value of this channel.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const mapEffect: {
    <Env1, OutErr1, OutDone, OutDone1>(f: (o: OutDone) => Effect.Effect<Env1, OutErr1, OutDone1>): <Env, InErr, InElem, InDone, OutErr, OutElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr, InElem, InDone, OutErr1 | OutErr, OutElem, OutDone1>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, Env1, OutErr1, OutDone, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (o: OutDone) => Effect.Effect<Env1, OutErr1, OutDone1>): Channel<Env | Env1, InErr, InElem, InDone, OutErr | OutErr1, OutElem, OutDone1>;
};
/**
 * Returns a new channel, which is the same as this one, except the failure
 * value of the returned channel is created by applying the specified function
 * to the failure value of this channel.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const mapError: {
    <OutErr, OutErr2>(f: (err: OutErr) => OutErr2): <Env, InErr, InElem, InDone, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr2, OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutElem, OutDone, OutErr, OutErr2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (err: OutErr) => OutErr2): Channel<Env, InErr, InElem, InDone, OutErr2, OutElem, OutDone>;
};
/**
 * A more powerful version of `mapError` which also surfaces the `Cause`
 * of the channel failure.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const mapErrorCause: {
    <OutErr, OutErr2>(f: (cause: Cause.Cause<OutErr>) => Cause.Cause<OutErr2>): <Env, InErr, InElem, InDone, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr2, OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutElem, OutDone, OutErr, OutErr2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (cause: Cause.Cause<OutErr>) => Cause.Cause<OutErr2>): Channel<Env, InErr, InElem, InDone, OutErr2, OutElem, OutDone>;
};
/**
 * Maps the output of this channel using the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const mapOut: {
    <OutElem, OutElem2>(f: (o: OutElem) => OutElem2): <Env, InErr, InElem, InDone, OutErr, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem2, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutDone, OutElem, OutElem2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (o: OutElem) => OutElem2): Channel<Env, InErr, InElem, InDone, OutErr, OutElem2, OutDone>;
};
/**
 * Creates a channel that is like this channel but the given effectful function
 * gets applied to each emitted output element.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const mapOutEffect: {
    <OutElem, Env1, OutErr1, OutElem1>(f: (o: OutElem) => Effect.Effect<Env1, OutErr1, OutElem1>): <Env, InErr, InElem, InDone, OutErr, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr, InElem, InDone, OutErr1 | OutErr, OutElem1, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutDone, OutElem, Env1, OutErr1, OutElem1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (o: OutElem) => Effect.Effect<Env1, OutErr1, OutElem1>): Channel<Env | Env1, InErr, InElem, InDone, OutErr | OutErr1, OutElem1, OutDone>;
};
/**
 * Creates a channel that is like this channel but the given ZIO function gets
 * applied to each emitted output element, taking `n` elements at once and
 * mapping them in parallel.
 *
 * @since 2.0.0
 * @category mapping
 */
export declare const mapOutEffectPar: {
    <OutElem, Env1, OutErr1, OutElem1>(f: (o: OutElem) => Effect.Effect<Env1, OutErr1, OutElem1>, n: number): <Env, InErr, InElem, InDone, OutErr, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr, InElem, InDone, OutErr1 | OutErr, OutElem1, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutDone, OutElem, Env1, OutErr1, OutElem1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (o: OutElem) => Effect.Effect<Env1, OutErr1, OutElem1>, n: number): Channel<Env | Env1, InErr, InElem, InDone, OutErr | OutErr1, OutElem1, OutDone>;
};
/**
 * @since 2.0.0
 * @category utils
 */
export declare const mergeAll: (options: {
    readonly concurrency: number | "unbounded";
    readonly bufferSize?: number;
    readonly mergeStrategy?: MergeStrategy.MergeStrategy;
}) => <Env, Env1, InErr, InErr1, InElem, InElem1, InDone, InDone1, OutErr, OutErr1, OutElem>(channels: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem, unknown>, unknown>) => Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem, unknown>;
/**
 * @since 2.0.0
 * @category utils
 */
export declare const mergeAllUnbounded: <Env, Env1, InErr, InErr1, InElem, InElem1, InDone, InDone1, OutErr, OutErr1, OutElem>(channels: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem, unknown>, unknown>) => Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem, unknown>;
/**
 * @since 2.0.0
 * @category utils
 */
export declare const mergeAllUnboundedWith: <Env, Env1, InErr, InErr1, InElem, InElem1, InDone, InDone1, OutErr, OutErr1, OutElem, OutDone>(channels: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem, OutDone>, OutDone>, f: (o1: OutDone, o2: OutDone) => OutDone) => Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem, OutDone>;
/**
 * @since 2.0.0
 * @category utils
 */
export declare const mergeAllWith: ({ bufferSize, concurrency, mergeStrategy }: {
    readonly concurrency: number | "unbounded";
    readonly bufferSize?: number;
    readonly mergeStrategy?: MergeStrategy.MergeStrategy;
}) => <Env, Env1, InErr, InErr1, InElem, InElem1, InDone, InDone1, OutErr, OutErr1, OutElem, OutDone>(channels: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem, OutDone>, OutDone>, f: (o1: OutDone, o2: OutDone) => OutDone) => Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem, OutDone>;
/**
 * Returns a new channel which creates a new channel for each emitted element
 * and merges some of them together. Different merge strategies control what
 * happens if there are more than the given maximum number of channels gets
 * created. See `Channel.mergeAll`.
 *
 * @param n The maximum number of channels to merge.
 * @param f The function that creates a new channel from each emitted element.
 * @since 2.0.0
 * @category mapping
 */
export declare const mergeMap: {
    <OutElem, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, Z>(f: (outElem: OutElem) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, Z>, options: {
        readonly concurrency: number | "unbounded";
        readonly bufferSize?: number;
        readonly mergeStrategy?: MergeStrategy.MergeStrategy;
    }): <Env, InErr, InElem, InDone, OutErr, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1 | OutErr, OutElem1, unknown>;
    <Env, InErr, InElem, InDone, OutErr, OutDone, OutElem, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, Z>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (outElem: OutElem) => Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, Z>, options: {
        readonly concurrency: number | "unbounded";
        readonly bufferSize?: number;
        readonly mergeStrategy?: MergeStrategy.MergeStrategy;
    }): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem1, unknown>;
};
/**
 * Returns a new channel which merges a number of channels emitted by this
 * channel using the back pressuring merge strategy. See `Channel.mergeAll`.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mergeOut: {
    (n: number): <Env, Env1, InErr, InErr1, InElem, InElem1, InDone, InDone1, OutErr, OutErr1, OutElem1, OutDone, Z>(self: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, Z>, OutDone>) => Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem1, unknown>;
    <Env, Env1, InErr, InErr1, InElem, InElem1, InDone, InDone1, OutErr, OutErr1, OutElem1, OutDone, Z>(self: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, Z>, OutDone>, n: number): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem1, unknown>;
};
/**
 * Returns a new channel which merges a number of channels emitted by this
 * channel using the back pressuring merge strategy and uses a given function
 * to merge each completed subchannel's result value. See
 * `Channel.mergeAll`.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mergeOutWith: {
    <OutDone1>(n: number, f: (o1: OutDone1, o2: OutDone1) => OutDone1): <Env, Env1, InErr, InErr1, InElem, InElem1, InDone, InDone1, OutErr, OutErr1, OutElem1>(self: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>, OutDone1>) => Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem1, OutDone1>;
    <Env, Env1, InErr, InErr1, InElem, InElem1, InDone, InDone1, OutErr, OutErr1, OutElem1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>, OutDone1>, n: number, f: (o1: OutDone1, o2: OutDone1) => OutDone1): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem1, OutDone1>;
};
/**
 * Returns a new channel, which is the merge of this channel and the specified
 * channel, where the behavior of the returned channel on left or right early
 * termination is decided by the specified `leftDone` and `rightDone` merge
 * decisions.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const mergeWith: {
    <Env1, InErr1, InElem1, InDone1, OutErr, OutErr1, OutErr2, OutErr3, OutElem1, OutDone, OutDone1, OutDone2, OutDone3>(options: {
        readonly other: Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>;
        readonly onSelfDone: (exit: Exit.Exit<OutErr, OutDone>) => MergeDecision.MergeDecision<Env1, OutErr1, OutDone1, OutErr2, OutDone2>;
        readonly onOtherDone: (ex: Exit.Exit<OutErr1, OutDone1>) => MergeDecision.MergeDecision<Env1, OutErr, OutDone, OutErr3, OutDone3>;
    }): <Env, InErr, InElem, InDone, OutElem>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr2 | OutErr3, OutElem1 | OutElem, OutDone2 | OutDone3>;
    <Env, InErr, InElem, InDone, OutElem, Env1, InErr1, InElem1, InDone1, OutErr, OutErr1, OutErr2, OutErr3, OutElem1, OutDone, OutDone1, OutDone2, OutDone3>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, options: {
        readonly other: Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>;
        readonly onSelfDone: (exit: Exit.Exit<OutErr, OutDone>) => MergeDecision.MergeDecision<Env1, OutErr1, OutDone1, OutErr2, OutDone2>;
        readonly onOtherDone: (ex: Exit.Exit<OutErr1, OutDone1>) => MergeDecision.MergeDecision<Env1, OutErr, OutDone, OutErr3, OutDone3>;
    }): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr2 | OutErr3, OutElem | OutElem1, OutDone2 | OutDone3>;
};
/**
 * Returns a channel that never completes
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const never: Channel<never, unknown, unknown, unknown, never, never, never>;
/**
 * Translates channel failure into death of the fiber, making all failures
 * unchecked and not a part of the type of the channel.
 *
 * @since 2.0.0
 * @category error handling
 */
export declare const orDie: {
    <E>(error: LazyArg<E>): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, never, OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, E>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, error: LazyArg<E>): Channel<Env, InErr, InElem, InDone, never, OutElem, OutDone>;
};
/**
 * Keeps none of the errors, and terminates the fiber with them, using the
 * specified function to convert the `OutErr` into a defect.
 *
 * @since 2.0.0
 * @category error handling
 */
export declare const orDieWith: {
    <OutErr>(f: (e: OutErr) => unknown): <Env, InErr, InElem, InDone, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, never, OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutElem, OutDone, OutErr>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (e: OutErr) => unknown): Channel<Env, InErr, InElem, InDone, never, OutElem, OutDone>;
};
/**
 * Returns a new channel that will perform the operations of this one, until
 * failure, and then it will switch over to the operations of the specified
 * fallback channel.
 *
 * @since 2.0.0
 * @category error handling
 */
export declare const orElse: {
    <Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>(that: LazyArg<Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>>): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1, OutElem1 | OutElem, OutDone1 | OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, that: LazyArg<Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>>): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1, OutElem | OutElem1, OutDone | OutDone1>;
};
/**
 * Returns a new channel that pipes the output of this channel into the
 * specified channel. The returned channel has the input type of this channel,
 * and the output type of the specified channel, terminating with the value of
 * the specified channel.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const pipeTo: {
    <Env2, OutErr, OutElem, OutDone, OutErr2, OutElem2, OutDone2>(that: Channel<Env2, OutErr, OutElem, OutDone, OutErr2, OutElem2, OutDone2>): <Env, InErr, InElem, InDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env2 | Env, InErr, InElem, InDone, OutErr2, OutElem2, OutDone2>;
    <Env, InErr, InElem, InDone, Env2, OutErr, OutElem, OutDone, OutErr2, OutElem2, OutDone2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, that: Channel<Env2, OutErr, OutElem, OutDone, OutErr2, OutElem2, OutDone2>): Channel<Env | Env2, InErr, InElem, InDone, OutErr2, OutElem2, OutDone2>;
};
/**
 * Returns a new channel that pipes the output of this channel into the
 * specified channel and preserves this channel's failures without providing
 * them to the other channel for observation.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const pipeToOrFail: {
    <Env2, OutElem, OutDone, OutErr2, OutElem2, OutDone2>(that: Channel<Env2, never, OutElem, OutDone, OutErr2, OutElem2, OutDone2>): <Env, InErr, InElem, InDone, OutErr>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env2 | Env, InErr, InElem, InDone, OutErr2 | OutErr, OutElem2, OutDone2>;
    <Env, InErr, InElem, InDone, OutErr, Env2, OutElem, OutDone, OutErr2, OutElem2, OutDone2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, that: Channel<Env2, never, OutElem, OutDone, OutErr2, OutElem2, OutDone2>): Channel<Env | Env2, InErr, InElem, InDone, OutErr | OutErr2, OutElem2, OutDone2>;
};
/**
 * Provides the channel with its required context, which eliminates its
 * dependency on `Env`.
 *
 * @since 2.0.0
 * @category context
 */
export declare const provideContext: {
    <Env>(env: Context.Context<Env>): <InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<never, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    <InErr, InElem, InDone, OutErr, OutElem, OutDone, Env>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, env: Context.Context<Env>): Channel<never, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Provides a layer to the channel, which translates it to another level.
 *
 * @since 2.0.0
 * @category context
 */
export declare const provideLayer: {
    <Env0, Env, OutErr2>(layer: Layer.Layer<Env0, OutErr2, Env>): <InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env0, InErr, InElem, InDone, OutErr2 | OutErr, OutElem, OutDone>;
    <InErr, InElem, InDone, OutErr, OutElem, OutDone, Env0, Env, OutErr2>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, layer: Layer.Layer<Env0, OutErr2, Env>): Channel<Env0, InErr, InElem, InDone, OutErr | OutErr2, OutElem, OutDone>;
};
/**
 * Transforms the context being provided to the channel with the specified
 * function.
 *
 * @since 2.0.0
 * @category context
 */
export declare const mapInputContext: {
    <Env0, Env>(f: (env: Context.Context<Env0>) => Context.Context<Env>): <InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env0, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    <InErr, InElem, InDone, OutErr, OutElem, OutDone, Env0, Env>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, f: (env: Context.Context<Env0>) => Context.Context<Env>): Channel<Env0, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Splits the context into two parts, providing one part using the
 * specified layer and leaving the remainder `Env0`.
 *
 * @since 2.0.0
 * @category context
 */
export declare const provideSomeLayer: {
    <Env0, Env2, OutErr2>(layer: Layer.Layer<Env0, OutErr2, Env2>): <R, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<R, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env0 | Exclude<R, Env2>, InErr, InElem, InDone, OutErr2 | OutErr, OutElem, OutDone>;
    <R, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env0, Env2, OutErr2>(self: Channel<R, InErr, InElem, InDone, OutErr, OutElem, OutDone>, layer: Layer.Layer<Env0, OutErr2, Env2>): Channel<Env0 | Exclude<R, Env2>, InErr, InElem, InDone, OutErr | OutErr2, OutElem, OutDone>;
};
/**
 * Provides the effect with the single service it requires. If the effect
 * requires more than one service use `provideContext` instead.
 *
 * @since 2.0.0
 * @category context
 */
export declare const provideService: {
    <T extends Context.Tag<any, any>>(tag: T, service: Context.Tag.Service<T>): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Exclude<Env, Context.Tag.Identifier<T>>, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, T extends Context.Tag<any, any>>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, tag: T, service: Context.Tag.Service<T>): Channel<Exclude<Env, Context.Tag.Identifier<T>>, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const read: <In>() => Channel<never, unknown, In, unknown, Option.Option<never>, never, In>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const readOrFail: <In, E>(error: E) => Channel<never, unknown, In, unknown, E, never, In>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const readWith: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env2, OutErr2, OutElem2, OutDone2, Env3, OutErr3, OutElem3, OutDone3>(options: {
    readonly onInput: (input: InElem) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    readonly onFailure: (error: InErr) => Channel<Env2, InErr, InElem, InDone, OutErr2, OutElem2, OutDone2>;
    readonly onDone: (done: InDone) => Channel<Env3, InErr, InElem, InDone, OutErr3, OutElem3, OutDone3>;
}) => Channel<Env | Env2 | Env3, InErr, InElem, InDone, OutErr | OutErr2 | OutErr3, OutElem | OutElem2 | OutElem3, OutDone | OutDone2 | OutDone3>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const readWithCause: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env2, OutErr2, OutElem2, OutDone2, Env3, OutErr3, OutElem3, OutDone3>(options: {
    readonly onInput: (input: InElem) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    readonly onFailure: (cause: Cause.Cause<InErr>) => Channel<Env2, InErr, InElem, InDone, OutErr2, OutElem2, OutDone2>;
    readonly onDone: (done: InDone) => Channel<Env3, InErr, InElem, InDone, OutErr3, OutElem3, OutDone3>;
}) => Channel<Env | Env2 | Env3, InErr, InElem, InDone, OutErr | OutErr2 | OutErr3, OutElem | OutElem2 | OutElem3, OutDone | OutDone2 | OutDone3>;
/**
 * Creates a channel which repeatedly runs this channel.
 *
 * @since 2.0.0
 * @category utils
 */
export declare const repeated: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
/**
 * Runs a channel until the end is received.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const run: <Env, InErr, InDone, OutErr, OutDone>(self: Channel<Env, InErr, unknown, InDone, OutErr, never, OutDone>) => Effect.Effect<Env, OutErr, OutDone>;
/**
 * Run the channel until it finishes with a done value or fails with an error
 * and collects its emitted output elements.
 *
 * The channel must not read any input.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const runCollect: <Env, InErr, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, unknown, InDone, OutErr, OutElem, OutDone>) => Effect.Effect<Env, OutErr, readonly [Chunk.Chunk<OutElem>, OutDone]>;
/**
 * Runs a channel until the end is received.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const runDrain: <Env, InErr, InDone, OutElem, OutErr, OutDone>(self: Channel<Env, InErr, unknown, InDone, OutErr, OutElem, OutDone>) => Effect.Effect<Env, OutErr, OutDone>;
/**
 * Use a scoped effect to emit an output element.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const scoped: <R, E, A>(effect: Effect.Effect<R, E, A>) => Channel<Exclude<R, Scope.Scope>, unknown, unknown, unknown, E, A, unknown>;
/**
 * Constructs a channel that succeeds immediately with the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const succeed: <A>(value: A) => Channel<never, unknown, unknown, unknown, never, never, A>;
/**
 * Lazily constructs a channel from the given side effect.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const suspend: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(evaluate: LazyArg<Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
/**
 * Constructs a channel that succeeds immediately with the specified lazy value.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const sync: <OutDone>(evaluate: LazyArg<OutDone>) => Channel<never, unknown, unknown, unknown, never, never, OutDone>;
/**
 * Converts a `Channel` to a `PubSub`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toPubSub: <Err, Done, Elem>(pubsub: PubSub.PubSub<Either.Either<Exit.Exit<Err, Done>, Elem>>) => Channel<never, Err, Elem, Done, never, never, unknown>;
/**
 * Returns a scoped `Effect` that can be used to repeatedly pull elements from
 * the constructed `Channel`. The pull effect fails with the channel's failure
 * in case the channel fails, or returns either the channel's done value or an
 * emitted element.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toPull: <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Effect.Effect<Scope.Scope | Env, never, Effect.Effect<Env, OutErr, Either.Either<OutDone, OutElem>>>;
/**
 * Converts a `Channel` to a `Queue`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toQueue: <Err, Done, Elem>(queue: Queue.Enqueue<Either.Either<Exit.Exit<Err, Done>, Elem>>) => Channel<never, Err, Elem, Done, never, never, unknown>;
/** Converts this channel to a `Sink`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toSink: <Env, InErr, InElem, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, Chunk.Chunk<InElem>, unknown, OutErr, Chunk.Chunk<OutElem>, OutDone>) => Sink.Sink<Env, OutErr, InElem, OutElem, OutDone>;
/**
 * Converts this channel to a `Stream`.
 *
 * @since 2.0.0
 * @category destructors
 */
export declare const toStream: <Env, OutErr, OutElem, OutDone>(self: Channel<Env, unknown, unknown, unknown, OutErr, Chunk.Chunk<OutElem>, OutDone>) => Stream.Stream<Env, OutErr, OutElem>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const unit: Channel<never, unknown, unknown, unknown, never, never, void>;
/**
 * Makes a channel from an effect that returns a channel in case of success.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const unwrap: <R, E, R2, InErr, InElem, InDone, OutErr, OutElem, OutDone>(channel: Effect.Effect<R, E, Channel<R2, InErr, InElem, InDone, OutErr, OutElem, OutDone>>) => Channel<R | R2, InErr, InElem, InDone, E | OutErr, OutElem, OutDone>;
/**
 * Makes a channel from a managed that returns a channel in case of success.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const unwrapScoped: <R, E, Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Effect.Effect<R, E, Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>>) => Channel<Env | Exclude<R, Scope.Scope>, InErr, InElem, InDone, E | OutErr, OutElem, OutDone>;
/**
 * Updates a service in the context of this channel.
 *
 * @since 2.0.0
 * @category context
 */
export declare const updateService: {
    <T extends Context.Tag<any, any>>(tag: T, f: (resource: Context.Tag.Service<T>) => Context.Tag.Service<T>): <R, InErr, InDone, OutElem, OutErr, OutDone>(self: Channel<R, InErr, unknown, InDone, OutErr, OutElem, OutDone>) => Channel<T | R, InErr, unknown, InDone, OutErr, OutElem, OutDone>;
    <R, InErr, InDone, OutElem, OutErr, OutDone, T extends Context.Tag<any, any>>(self: Channel<R, InErr, unknown, InDone, OutErr, OutElem, OutDone>, tag: T, f: (resource: Context.Tag.Service<T>) => Context.Tag.Service<T>): Channel<R | T, InErr, unknown, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Wraps the channel with a new span for tracing.
 *
 * @since 2.0.0
 * @category tracing
 */
export declare const withSpan: {
    (name: string, options?: {
        readonly attributes?: Record<string, unknown>;
        readonly links?: ReadonlyArray<Tracer.SpanLink>;
        readonly parent?: Tracer.ParentSpan;
        readonly root?: boolean;
        readonly context?: Context.Context<never>;
    }): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, name: string, options?: {
        readonly attributes?: Record<string, unknown>;
        readonly links?: ReadonlyArray<Tracer.SpanLink>;
        readonly parent?: Tracer.ParentSpan;
        readonly root?: boolean;
        readonly context?: Context.Context<never>;
    }): Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>;
};
/**
 * Writes a single value to the channel.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const write: <OutElem>(out: OutElem) => Channel<never, unknown, unknown, unknown, never, OutElem, void>;
/**
 * Writes a sequence of values to the channel.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const writeAll: <OutElems extends Array<any>>(...outs: OutElems) => Channel<never, unknown, unknown, unknown, never, OutElems[number], void>;
/**
 * Writes a `Chunk` of values to the channel.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const writeChunk: <OutElem>(outs: Chunk.Chunk<OutElem>) => Channel<never, unknown, unknown, unknown, never, OutElem, void>;
/**
 * Returns a new channel that is the sequential composition of this channel
 * and the specified channel. The returned channel terminates with a tuple of
 * the terminal values of both channels.
 *
 * @since 2.0.0
 * @category zipping
 */
export declare const zip: {
    <Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>(that: Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>, options?: {
        readonly concurrent?: boolean;
    }): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1 | OutErr, OutElem1 | OutElem, readonly [OutDone, OutDone1]>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, that: Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>, options?: {
        readonly concurrent?: boolean;
    }): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem | OutElem1, readonly [OutDone, OutDone1]>;
};
/**
 * Returns a new channel that is the sequential composition of this channel
 * and the specified channel. The returned channel terminates with the
 * terminal value of this channel.
 *
 * @since 2.0.0
 * @category zipping
 */
export declare const zipLeft: {
    <Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>(that: Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>, options?: {
        readonly concurrent?: boolean;
    }): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1 | OutErr, OutElem1 | OutElem, OutDone>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, that: Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>, options?: {
        readonly concurrent?: boolean;
    }): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem | OutElem1, OutDone>;
};
/**
 * Returns a new channel that is the sequential composition of this channel
 * and the specified channel. The returned channel terminates with the
 * terminal value of that channel.
 *
 * @since 2.0.0
 * @category zipping
 */
export declare const zipRight: {
    <Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>(that: Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>, options?: {
        readonly concurrent?: boolean;
    }): <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel<Env1 | Env, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr1 | OutErr, OutElem1 | OutElem, OutDone1>;
    <Env, InErr, InElem, InDone, OutErr, OutElem, OutDone, Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>(self: Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>, that: Channel<Env1, InErr1, InElem1, InDone1, OutErr1, OutElem1, OutDone1>, options?: {
        readonly concurrent?: boolean;
    }): Channel<Env | Env1, InErr & InErr1, InElem & InElem1, InDone & InDone1, OutErr | OutErr1, OutElem | OutElem1, OutDone1>;
};
/**
 * Represents a generic checked exception which occurs when a `Channel` is
 * executed.
 *
 * @since 2.0.0
 * @category errors
 */
export declare const ChannelException: <E>(error: E) => ChannelException<E>;
/**
 * Returns `true` if the specified value is an `ChannelException`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
export declare const isChannelException: (u: unknown) => u is ChannelException<unknown>;
//# sourceMappingURL=Channel.d.ts.map