"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interruptWhen = exports.identity = exports.fromQueue = exports.fromOption = exports.fromPubSubScoped = exports.fromPubSub = exports.fromInput = exports.fromEither = exports.fromEffect = exports.foldCauseChannel = exports.foldChannel = exports.flatten = exports.flatMap = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.contextWithEffect = exports.contextWithChannel = exports.contextWith = exports.context = exports.ensuringWith = exports.ensuring = exports.emitCollect = exports.embedInput = exports.drain = exports.doneCollect = exports.mapInputInEffect = exports.mapInputIn = exports.mapInputErrorEffect = exports.mapInputError = exports.mapInputEffect = exports.mapInput = exports.concatOut = exports.collect = exports.concatMapWithCustom = exports.concatMapWith = exports.concatMap = exports.concatAllWith = exports.concatAll = exports.catchAllCause = exports.catchAll = exports.bufferChunk = exports.buffer = exports.asUnit = exports.as = exports.acquireReleaseOut = exports.acquireUseRelease = exports.ChannelExceptionTypeId = exports.ChannelTypeId = void 0;
exports.write = exports.withSpan = exports.updateService = exports.unwrapScoped = exports.unwrap = exports.unit = exports.toStream = exports.toSink = exports.toQueue = exports.toPull = exports.toPubSub = exports.sync = exports.suspend = exports.succeed = exports.scoped = exports.runDrain = exports.runCollect = exports.run = exports.repeated = exports.readWithCause = exports.readWith = exports.readOrFail = exports.read = exports.provideService = exports.provideSomeLayer = exports.mapInputContext = exports.provideLayer = exports.provideContext = exports.pipeToOrFail = exports.pipeTo = exports.orElse = exports.orDieWith = exports.orDie = exports.never = exports.mergeWith = exports.mergeOutWith = exports.mergeOut = exports.mergeMap = exports.mergeAllWith = exports.mergeAllUnboundedWith = exports.mergeAllUnbounded = exports.mergeAll = exports.mapOutEffectPar = exports.mapOutEffect = exports.mapOut = exports.mapErrorCause = exports.mapError = exports.mapEffect = exports.map = exports.interruptWhenDeferred = void 0;
exports.isChannelException = exports.ChannelException = exports.zipRight = exports.zipLeft = exports.zip = exports.writeChunk = exports.writeAll = void 0;
const channel = /*#__PURE__*/require("./internal/channel.js");
const core = /*#__PURE__*/require("./internal/core-stream.js");
const sink = /*#__PURE__*/require("./internal/sink.js");
const stream = /*#__PURE__*/require("./internal/stream.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ChannelTypeId = core.ChannelTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ChannelExceptionTypeId = channel.ChannelExceptionTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.acquireUseRelease = channel.acquireUseRelease;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.acquireReleaseOut = core.acquireReleaseOut;
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
exports.as = channel.as;
/**
 * @since 2.0.0
 * @category mapping
 */
exports.asUnit = channel.asUnit;
/**
 * Creates a channel backed by a buffer. When the buffer is empty, the channel
 * will simply passthrough its input as output. However, when the buffer is
 * non-empty, the value inside the buffer will be passed along as output.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.buffer = channel.buffer;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.bufferChunk = channel.bufferChunk;
/**
 * Returns a new channel that is the same as this one, except if this channel
 * errors for any typed error, then the returned channel will switch over to
 * using the fallback channel returned by the specified error handler.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchAll = channel.catchAll;
/**
 * Returns a new channel that is the same as this one, except if this channel
 * errors for any typed error, then the returned channel will switch over to
 * using the fallback channel returned by the specified error handler.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchAllCause = core.catchAllCause;
/**
 * Concat sequentially a channel of channels.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.concatAll = core.concatAll;
/**
 * Concat sequentially a channel of channels.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.concatAllWith = core.concatAllWith;
/**
 * Returns a new channel whose outputs are fed to the specified factory
 * function, which creates new channels in response. These new channels are
 * sequentially concatenated together, and all their outputs appear as outputs
 * of the newly returned channel.
 *
 * @since 2.0.0
 * @category utils
 */
exports.concatMap = channel.concatMap;
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
exports.concatMapWith = core.concatMapWith;
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
exports.concatMapWithCustom = core.concatMapWithCustom;
/**
 * Returns a new channel, which is the same as this one, except its outputs
 * are filtered and transformed by the specified partial function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.collect = channel.collect;
/**
 * Returns a new channel, which is the concatenation of all the channels that
 * are written out by this channel. This method may only be called on channels
 * that output other channels.
 *
 * @since 2.0.0
 * @category utils
 */
exports.concatOut = channel.concatOut;
/**
 * Returns a new channel which is the same as this one but applies the given
 * function to the input channel's done value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapInput = channel.mapInput;
/**
 * Returns a new channel which is the same as this one but applies the given
 * effectual function to the input channel's done value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapInputEffect = channel.mapInputEffect;
/**
 * Returns a new channel which is the same as this one but applies the given
 * function to the input channel's error value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapInputError = channel.mapInputError;
/**
 * Returns a new channel which is the same as this one but applies the given
 * effectual function to the input channel's error value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapInputErrorEffect = channel.mapInputErrorEffect;
/**
 * Returns a new channel which is the same as this one but applies the given
 * function to the input channel's output elements.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapInputIn = channel.mapInputIn;
/**
 * Returns a new channel which is the same as this one but applies the given
 * effectual function to the input channel's output elements.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapInputInEffect = channel.mapInputInEffect;
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
exports.doneCollect = channel.doneCollect;
/**
 * Returns a new channel which reads all the elements from upstream's output
 * channel and ignores them, then terminates with the upstream result value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.drain = channel.drain;
/**
 * Returns a new channel which connects the given `AsyncInputProducer` as
 * this channel's input.
 *
 * @since 2.0.0
 * @category utils
 */
exports.embedInput = core.embedInput;
/**
 * Returns a new channel that collects the output and terminal value of this
 * channel, which it then writes as output of the returned channel.
 *
 * @since 2.0.0
 * @category utils
 */
exports.emitCollect = channel.emitCollect;
/**
 * Returns a new channel with an attached finalizer. The finalizer is
 * guaranteed to be executed so long as the channel begins execution (and
 * regardless of whether or not it completes).
 *
 * @since 2.0.0
 * @category utils
 */
exports.ensuring = channel.ensuring;
/**
 * Returns a new channel with an attached finalizer. The finalizer is
 * guaranteed to be executed so long as the channel begins execution (and
 * regardless of whether or not it completes).
 *
 * @since 2.0.0
 * @category utils
 */
exports.ensuringWith = core.ensuringWith;
/**
 * Accesses the whole context of the channel.
 *
 * @since 2.0.0
 * @category context
 */
exports.context = channel.context;
/**
 * Accesses the context of the channel with the specified function.
 *
 * @since 2.0.0
 * @category context
 */
exports.contextWith = channel.contextWith;
/**
 * Accesses the context of the channel in the context of a channel.
 *
 * @since 2.0.0
 * @category context
 */
exports.contextWithChannel = channel.contextWithChannel;
/**
 * Accesses the context of the channel in the context of an effect.
 *
 * @since 2.0.0
 * @category context
 */
exports.contextWithEffect = channel.contextWithEffect;
/**
 * Constructs a channel that fails immediately with the specified error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fail = core.fail;
/**
 * Constructs a channel that succeeds immediately with the specified lazily
 * evaluated value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failSync = core.failSync;
/**
 * Constructs a channel that fails immediately with the specified `Cause`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failCause = core.failCause;
/**
 * Constructs a channel that succeeds immediately with the specified lazily
 * evaluated `Cause`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failCauseSync = core.failCauseSync;
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
exports.flatMap = core.flatMap;
/**
 * Returns a new channel, which flattens the terminal value of this channel.
 * This function may only be called if the terminal value of this channel is
 * another channel of compatible types.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatten = channel.flatten;
/**
 * Folds over the result of this channel.
 *
 * @since 2.0.0
 * @category utils
 */
exports.foldChannel = channel.foldChannel;
/**
 * Folds over the result of this channel including any cause of termination.
 *
 * @since 2.0.0
 * @category utils
 */
exports.foldCauseChannel = core.foldCauseChannel;
/**
 * Use an effect to end a channel.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEffect = core.fromEffect;
/**
 * Constructs a channel from an `Either`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEither = channel.fromEither;
/**
 * Construct a `Channel` from an `AsyncInputConsumer`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromInput = channel.fromInput;
/**
 * Construct a `Channel` from a `PubSub`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromPubSub = channel.fromPubSub;
/**
 * Construct a `Channel` from a `PubSub` within a scoped effect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromPubSubScoped = channel.fromPubSubScoped;
/**
 * Construct a `Channel` from an `Option`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromOption = channel.fromOption;
/**
 * Construct a `Channel` from a `Queue`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromQueue = channel.fromQueue;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.identity = channel.identityChannel;
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
exports.interruptWhen = channel.interruptWhen;
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
exports.interruptWhenDeferred = channel.interruptWhenDeferred;
/**
 * Returns a new channel, which is the same as this one, except the terminal
 * value of the returned channel is created by applying the specified function
 * to the terminal value of this channel.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = channel.map;
/**
 * Returns a new channel, which is the same as this one, except the terminal
 * value of the returned channel is created by applying the specified
 * effectful function to the terminal value of this channel.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapEffect = channel.mapEffect;
/**
 * Returns a new channel, which is the same as this one, except the failure
 * value of the returned channel is created by applying the specified function
 * to the failure value of this channel.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapError = channel.mapError;
/**
 * A more powerful version of `mapError` which also surfaces the `Cause`
 * of the channel failure.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapErrorCause = channel.mapErrorCause;
/**
 * Maps the output of this channel using the specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapOut = channel.mapOut;
/**
 * Creates a channel that is like this channel but the given effectful function
 * gets applied to each emitted output element.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapOutEffect = channel.mapOutEffect;
/**
 * Creates a channel that is like this channel but the given ZIO function gets
 * applied to each emitted output element, taking `n` elements at once and
 * mapping them in parallel.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapOutEffectPar = channel.mapOutEffectPar;
/**
 * @since 2.0.0
 * @category utils
 */
exports.mergeAll = channel.mergeAll;
/**
 * @since 2.0.0
 * @category utils
 */
exports.mergeAllUnbounded = channel.mergeAllUnbounded;
/**
 * @since 2.0.0
 * @category utils
 */
exports.mergeAllUnboundedWith = channel.mergeAllUnboundedWith;
/**
 * @since 2.0.0
 * @category utils
 */
exports.mergeAllWith = channel.mergeAllWith;
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
exports.mergeMap = channel.mergeMap;
/**
 * Returns a new channel which merges a number of channels emitted by this
 * channel using the back pressuring merge strategy. See `Channel.mergeAll`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mergeOut = channel.mergeOut;
/**
 * Returns a new channel which merges a number of channels emitted by this
 * channel using the back pressuring merge strategy and uses a given function
 * to merge each completed subchannel's result value. See
 * `Channel.mergeAll`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mergeOutWith = channel.mergeOutWith;
/**
 * Returns a new channel, which is the merge of this channel and the specified
 * channel, where the behavior of the returned channel on left or right early
 * termination is decided by the specified `leftDone` and `rightDone` merge
 * decisions.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mergeWith = channel.mergeWith;
/**
 * Returns a channel that never completes
 *
 * @since 2.0.0
 * @category constructors
 */
exports.never = channel.never;
/**
 * Translates channel failure into death of the fiber, making all failures
 * unchecked and not a part of the type of the channel.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orDie = channel.orDie;
/**
 * Keeps none of the errors, and terminates the fiber with them, using the
 * specified function to convert the `OutErr` into a defect.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orDieWith = channel.orDieWith;
/**
 * Returns a new channel that will perform the operations of this one, until
 * failure, and then it will switch over to the operations of the specified
 * fallback channel.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElse = channel.orElse;
/**
 * Returns a new channel that pipes the output of this channel into the
 * specified channel. The returned channel has the input type of this channel,
 * and the output type of the specified channel, terminating with the value of
 * the specified channel.
 *
 * @since 2.0.0
 * @category utils
 */
exports.pipeTo = core.pipeTo;
/**
 * Returns a new channel that pipes the output of this channel into the
 * specified channel and preserves this channel's failures without providing
 * them to the other channel for observation.
 *
 * @since 2.0.0
 * @category utils
 */
exports.pipeToOrFail = channel.pipeToOrFail;
/**
 * Provides the channel with its required context, which eliminates its
 * dependency on `Env`.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideContext = core.provideContext;
/**
 * Provides a layer to the channel, which translates it to another level.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideLayer = channel.provideLayer;
/**
 * Transforms the context being provided to the channel with the specified
 * function.
 *
 * @since 2.0.0
 * @category context
 */
exports.mapInputContext = channel.mapInputContext;
/**
 * Splits the context into two parts, providing one part using the
 * specified layer and leaving the remainder `Env0`.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideSomeLayer = channel.provideSomeLayer;
/**
 * Provides the effect with the single service it requires. If the effect
 * requires more than one service use `provideContext` instead.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideService = channel.provideService;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.read = channel.read;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.readOrFail = core.readOrFail;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.readWith = core.readWith;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.readWithCause = core.readWithCause;
/**
 * Creates a channel which repeatedly runs this channel.
 *
 * @since 2.0.0
 * @category utils
 */
exports.repeated = channel.repeated;
/**
 * Runs a channel until the end is received.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.run = channel.run;
/**
 * Run the channel until it finishes with a done value or fails with an error
 * and collects its emitted output elements.
 *
 * The channel must not read any input.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runCollect = channel.runCollect;
/**
 * Runs a channel until the end is received.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runDrain = channel.runDrain;
/**
 * Use a scoped effect to emit an output element.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.scoped = channel.scoped;
/**
 * Constructs a channel that succeeds immediately with the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = core.succeed;
/**
 * Lazily constructs a channel from the given side effect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.suspend = core.suspend;
/**
 * Constructs a channel that succeeds immediately with the specified lazy value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sync = core.sync;
/**
 * Converts a `Channel` to a `PubSub`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toPubSub = channel.toPubSub;
/**
 * Returns a scoped `Effect` that can be used to repeatedly pull elements from
 * the constructed `Channel`. The pull effect fails with the channel's failure
 * in case the channel fails, or returns either the channel's done value or an
 * emitted element.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toPull = channel.toPull;
/**
 * Converts a `Channel` to a `Queue`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toQueue = channel.toQueue;
/** Converts this channel to a `Sink`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toSink = sink.channelToSink;
/**
 * Converts this channel to a `Stream`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toStream = stream.channelToStream;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.unit = core.unit;
/**
 * Makes a channel from an effect that returns a channel in case of success.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unwrap = channel.unwrap;
/**
 * Makes a channel from a managed that returns a channel in case of success.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unwrapScoped = channel.unwrapScoped;
/**
 * Updates a service in the context of this channel.
 *
 * @since 2.0.0
 * @category context
 */
exports.updateService = channel.updateService;
/**
 * Wraps the channel with a new span for tracing.
 *
 * @since 2.0.0
 * @category tracing
 */
exports.withSpan = channel.withSpan;
/**
 * Writes a single value to the channel.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.write = core.write;
/**
 * Writes a sequence of values to the channel.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.writeAll = channel.writeAll;
/**
 * Writes a `Chunk` of values to the channel.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.writeChunk = channel.writeChunk;
/**
 * Returns a new channel that is the sequential composition of this channel
 * and the specified channel. The returned channel terminates with a tuple of
 * the terminal values of both channels.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zip = channel.zip;
/**
 * Returns a new channel that is the sequential composition of this channel
 * and the specified channel. The returned channel terminates with the
 * terminal value of this channel.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipLeft = channel.zipLeft;
/**
 * Returns a new channel that is the sequential composition of this channel
 * and the specified channel. The returned channel terminates with the
 * terminal value of that channel.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipRight = channel.zipRight;
/**
 * Represents a generic checked exception which occurs when a `Channel` is
 * executed.
 *
 * @since 2.0.0
 * @category errors
 */
exports.ChannelException = channel.ChannelException;
/**
 * Returns `true` if the specified value is an `ChannelException`, `false`
 * otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isChannelException = channel.isChannelException;
//# sourceMappingURL=Channel.js.map