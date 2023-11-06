"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropRight = exports.drop = exports.drainFork = exports.drain = exports.distributedWithDynamic = exports.distributedWith = exports.dieMessage = exports.dieSync = exports.die = exports.debounce = exports.crossWith = exports.crossRight = exports.crossLeft = exports.cross = exports.concatAll = exports.concat = exports.combineChunks = exports.combine = exports.chunksWith = exports.chunks = exports.changesWithEffect = exports.changesWith = exports.changes = exports.catchSomeCause = exports.catchTags = exports.catchTag = exports.catchSome = exports.catchAllCause = exports.catchAll = exports.bufferChunks = exports.buffer = exports.broadcastedQueuesDynamic = exports.broadcastedQueues = exports.broadcastDynamic = exports.broadcast = exports.branchAfter = exports.asyncScoped = exports.asyncOption = exports.asyncInterrupt = exports.asyncEffect = exports.async = exports.as = exports.aggregateWithinEither = exports.aggregateWithin = exports.aggregate = exports.acquireRelease = exports.accumulateChunks = exports.accumulate = exports.DefaultChunkSize = exports.StreamTypeId = void 0;
exports.fromReadableStream = exports.fromQueue = exports.fromPull = exports.fromIteratorSucceed = exports.fromIterableEffect = exports.fromIterable = exports.fromPubSub = exports.fromEffectOption = exports.fromEffect = exports.fromChunks = exports.fromChunkQueue = exports.fromChunkPubSub = exports.fromChunk = exports.toChannel = exports.fromChannel = exports.fromAsyncIterable = exports.forever = exports.flattenTake = exports.flattenIterables = exports.flattenExitOption = exports.flattenEffect = exports.flattenChunks = exports.flatten = exports.flatMap = exports.findEffect = exports.find = exports.finalizer = exports.filterMapWhileEffect = exports.filterMapWhile = exports.filterMapEffect = exports.filterMap = exports.filterEffect = exports.filter = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.execute = exports.contextWithStream = exports.contextWithEffect = exports.contextWith = exports.context = exports.ensuringWith = exports.ensuring = exports.empty = exports.either = exports.dropWhileEffect = exports.dropWhile = exports.dropUntilEffect = exports.dropUntil = void 0;
exports.orElseIfEmptyChunk = exports.orElseIfEmpty = exports.orElseFail = exports.orElseEither = exports.orElse = exports.orDieWith = exports.orDie = exports.onDone = exports.onError = exports.never = exports.mkString = exports.mergeRight = exports.mergeLeft = exports.mergeEither = exports.mergeWith = exports.mergeAll = exports.merge = exports.mapErrorCause = exports.mapError = exports.mapEffect = exports.mapConcatEffect = exports.mapConcatChunkEffect = exports.mapConcatChunk = exports.mapConcat = exports.mapChunksEffect = exports.mapChunks = exports.mapBoth = exports.mapAccumEffect = exports.mapAccum = exports.map = exports.make = exports.iterate = exports.interruptWhenDeferred = exports.interruptWhen = exports.interruptAfter = exports.intersperseAffixes = exports.intersperse = exports.interleaveWith = exports.interleave = exports.identity = exports.haltWhenDeferred = exports.haltWhen = exports.haltAfter = exports.groupedWithin = exports.grouped = exports.groupByKey = exports.groupBy = exports.groupAdjacentBy = exports.fromSchedule = exports.fromReadableStreamByob = void 0;
exports.runForEachChunk = exports.runForEach = exports.runFoldWhileScopedEffect = exports.runFoldWhileScoped = exports.runFoldWhileEffect = exports.runFoldWhile = exports.runFoldScopedEffect = exports.runFoldScoped = exports.runFoldEffect = exports.runFold = exports.runDrain = exports.runCount = exports.runCollect = exports.run = exports.retry = exports.repeatWith = exports.repeatValue = exports.repeatElementsWith = exports.repeatElements = exports.repeatEither = exports.repeatEffectWithSchedule = exports.repeatEffectOption = exports.repeatEffectChunkOption = exports.repeatEffectChunk = exports.repeatEffect = exports.repeat = exports.refineOrDieWith = exports.refineOrDie = exports.rechunk = exports.range = exports.provideSomeLayer = exports.mapInputContext = exports.provideServiceStream = exports.provideServiceEffect = exports.provideService = exports.provideLayer = exports.provideContext = exports.prepend = exports.pipeThroughChannelOrFail = exports.pipeThroughChannel = exports.pipeThrough = exports.peel = exports.partitionEither = exports.partition = exports.paginateEffect = exports.paginateChunkEffect = exports.paginateChunk = exports.paginate = exports.orElseSucceed = exports.orElseIfEmptyStream = void 0;
exports.toPull = exports.toPubSub = exports.timeoutTo = exports.timeoutFailCause = exports.timeoutFail = exports.timeout = exports.tick = exports.throttleEffect = exports.throttle = exports.tapSink = exports.tapErrorCause = exports.tapError = exports.tapBoth = exports.tap = exports.takeWhile = exports.takeUntilEffect = exports.takeUntil = exports.takeRight = exports.take = exports.suspend = exports.sync = exports.succeed = exports.splitLines = exports.splitOnChunk = exports.split = exports.someOrFail = exports.someOrElse = exports.some = exports.slidingSize = exports.sliding = exports.scoped = exports.scheduleWith = exports.schedule = exports.scanReduceEffect = exports.scanReduce = exports.scanEffect = exports.scan = exports.runSum = exports.runScoped = exports.runLast = exports.runIntoQueueScoped = exports.runIntoQueueElementsScoped = exports.runIntoQueue = exports.runIntoPubSubScoped = exports.runIntoPubSub = exports.runHead = exports.runForEachWhileScoped = exports.runForEachWhile = exports.runForEachScoped = exports.runForEachChunkScoped = void 0;
exports.encodeText = exports.decodeText = exports.let = exports.bindTo = exports.bindEffect = exports.bind = exports.Do = exports.zipWithIndex = exports.zipWithPreviousAndNext = exports.zipWithPrevious = exports.zipWithNext = exports.zipWithChunks = exports.zipWith = exports.zipRight = exports.zipLeft = exports.zipLatestWith = exports.zipLatest = exports.zipAllWith = exports.zipAllSortedByKeyWith = exports.zipAllSortedByKeyRight = exports.zipAllSortedByKeyLeft = exports.zipAllSortedByKey = exports.zipAllRight = exports.zipAllLeft = exports.zipAll = exports.zipFlatten = exports.zip = exports.withSpan = exports.whenEffect = exports.whenCaseEffect = exports.whenCase = exports.when = exports.updateService = exports.unwrapScoped = exports.unwrap = exports.unit = exports.unfoldEffect = exports.unfoldChunkEffect = exports.unfoldChunk = exports.unfold = exports.transduce = exports.toReadableStream = exports.toQueueOfElements = exports.toQueue = void 0;
const _groupBy = /*#__PURE__*/require("./internal/groupBy.js");
const internal = /*#__PURE__*/require("./internal/stream.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.StreamTypeId = internal.StreamTypeId;
/**
 * The default chunk size used by the various combinators and constructors of
 * `Stream`.
 *
 * @since 2.0.0
 * @category constants
 */
exports.DefaultChunkSize = internal.DefaultChunkSize;
/**
 * Collects each underlying Chunk of the stream into a new chunk, and emits it
 * on each pull.
 *
 * @since 2.0.0
 * @category utils
 */
exports.accumulate = internal.accumulate;
/**
 * Re-chunks the elements of the stream by accumulating each underlying chunk.
 *
 * @since 2.0.0
 * @category utils
 */
exports.accumulateChunks = internal.accumulateChunks;
/**
 * Creates a stream from a single value that will get cleaned up after the
 * stream is consumed.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.acquireRelease = internal.acquireRelease;
/**
 * Aggregates elements of this stream using the provided sink for as long as
 * the downstream operators on the stream are busy.
 *
 * This operator divides the stream into two asynchronous "islands". Operators
 * upstream of this operator run on one fiber, while downstream operators run
 * on another. Whenever the downstream fiber is busy processing elements, the
 * upstream fiber will feed elements into the sink until it signals
 * completion.
 *
 * Any sink can be used here, but see `Sink.foldWeightedEffect` and
 * `Sink.foldUntilEffect` for sinks that cover the common usecases.
 *
 * @since 2.0.0
 * @category utils
 */
exports.aggregate = internal.aggregate;
/**
 * Like `aggregateWithinEither`, but only returns the `Right` results.
 *
 * @param sink A `Sink` used to perform the aggregation.
 * @param schedule A `Schedule` used to signal when to stop the aggregation.
 * @since 2.0.0
 * @category utils
 */
exports.aggregateWithin = internal.aggregateWithin;
/**
 * Aggregates elements using the provided sink until it completes, or until
 * the delay signalled by the schedule has passed.
 *
 * This operator divides the stream into two asynchronous islands. Operators
 * upstream of this operator run on one fiber, while downstream operators run
 * on another. Elements will be aggregated by the sink until the downstream
 * fiber pulls the aggregated value, or until the schedule's delay has passed.
 *
 * Aggregated elements will be fed into the schedule to determine the delays
 * between pulls.
 *
 * @param sink A `Sink` used to perform the aggregation.
 * @param schedule A `Schedule` used to signal when to stop the aggregation.
 * @since 2.0.0
 * @category utils
 */
exports.aggregateWithinEither = internal.aggregateWithinEither;
/**
 * Maps the success values of this stream to the specified constant value.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.as = internal.as;
const _async = internal._async;
exports.async = _async;
/**
 * Creates a stream from an asynchronous callback that can be called multiple
 * times The registration of the callback itself returns an effect. The
 * optionality of the error type `E` can be used to signal the end of the
 * stream, by setting it to `None`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.asyncEffect = internal.asyncEffect;
/**
 * Creates a stream from an asynchronous callback that can be called multiple
 * times. The registration of the callback returns either a canceler or
 * synchronously returns a stream. The optionality of the error type `E` can
 * be used to signal the end of the stream, by setting it to `None`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.asyncInterrupt = internal.asyncInterrupt;
/**
 * Creates a stream from an asynchronous callback that can be called multiple
 * times. The registration of the callback can possibly return the stream
 * synchronously. The optionality of the error type `E` can be used to signal
 * the end of the stream, by setting it to `None`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.asyncOption = internal.asyncOption;
/**
 * Creates a stream from an asynchronous callback that can be called multiple
 * times. The registration of the callback itself returns an a scoped
 * resource. The optionality of the error type `E` can be used to signal the
 * end of the stream, by setting it to `None`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.asyncScoped = internal.asyncScoped;
/**
 * Returns a `Stream` that first collects `n` elements from the input `Stream`,
 * and then creates a new `Stream` using the specified function, and sends all
 * the following elements through that.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.branchAfter = internal.branchAfter;
/**
 * Fan out the stream, producing a list of streams that have the same elements
 * as this stream. The driver stream will only ever advance the `maximumLag`
 * chunks before the slowest downstream stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.broadcast = internal.broadcast;
/**
 * Fan out the stream, producing a dynamic number of streams that have the
 * same elements as this stream. The driver stream will only ever advance the
 * `maximumLag` chunks before the slowest downstream stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.broadcastDynamic = internal.broadcastDynamic;
/**
 * Converts the stream to a scoped list of queues. Every value will be
 * replicated to every queue with the slowest queue being allowed to buffer
 * `maximumLag` chunks before the driver is back pressured.
 *
 * Queues can unsubscribe from upstream by shutting down.
 *
 * @since 2.0.0
 * @category utils
 */
exports.broadcastedQueues = internal.broadcastedQueues;
/**
 * Converts the stream to a scoped dynamic amount of queues. Every chunk will
 * be replicated to every queue with the slowest queue being allowed to buffer
 * `maximumLag` chunks before the driver is back pressured.
 *
 * Queues can unsubscribe from upstream by shutting down.
 *
 * @since 2.0.0
 * @category utils
 */
exports.broadcastedQueuesDynamic = internal.broadcastedQueuesDynamic;
/**
 * Allows a faster producer to progress independently of a slower consumer by
 * buffering up to `capacity` elements in a queue.
 *
 * @note This combinator destroys the chunking structure. It's recommended to
 *       use rechunk afterwards. Additionally, prefer capacities that are powers
 *       of 2 for better performance.
 * @since 2.0.0
 * @category utils
 */
exports.buffer = internal.buffer;
/**
 * Allows a faster producer to progress independently of a slower consumer by
 * buffering up to `capacity` chunks in a queue.
 *
 * @note Prefer capacities that are powers of 2 for better performance.
 * @since 2.0.0
 * @category utils
 */
exports.bufferChunks = internal.bufferChunks;
/**
 * Switches over to the stream produced by the provided function in case this
 * one fails with a typed error.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchAll = internal.catchAll;
/**
 * Switches over to the stream produced by the provided function in case this
 * one fails. Allows recovery from all causes of failure, including
 * interruption if the stream is uninterruptible.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchAllCause = internal.catchAllCause;
/**
 * Switches over to the stream produced by the provided function in case this
 * one fails with some typed error.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchSome = internal.catchSome;
/**
 * Switches over to the stream produced by the provided function in case this
 * one fails with an error matching the given `_tag`.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchTag = internal.catchTag;
/**
 * Switches over to the stream produced by one of the provided functions, in
 * case this one fails with an error matching one of the given `_tag`'s.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchTags = internal.catchTags;
/**
 * Switches over to the stream produced by the provided function in case this
 * one fails with some errors. Allows recovery from all causes of failure,
 * including interruption if the stream is uninterruptible.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.catchSomeCause = internal.catchSomeCause;
/**
 * Returns a new stream that only emits elements that are not equal to the
 * previous element emitted, using natural equality to determine whether two
 * elements are equal.
 *
 * @since 2.0.0
 * @category utils
 */
exports.changes = internal.changes;
/**
 * Returns a new stream that only emits elements that are not equal to the
 * previous element emitted, using the specified function to determine whether
 * two elements are equal.
 *
 * @since 2.0.0
 * @category utils
 */
exports.changesWith = internal.changesWith;
/**
 * Returns a new stream that only emits elements that are not equal to the
 * previous element emitted, using the specified effectual function to
 * determine whether two elements are equal.
 *
 * @since 2.0.0
 * @category utils
 */
exports.changesWithEffect = internal.changesWithEffect;
/**
 * Exposes the underlying chunks of the stream as a stream of chunks of
 * elements.
 *
 * @since 2.0.0
 * @category utils
 */
exports.chunks = internal.chunks;
/**
 * Performs the specified stream transformation with the chunk structure of
 * the stream exposed.
 *
 * @since 2.0.0
 * @category utils
 */
exports.chunksWith = internal.chunksWith;
/**
 * Combines the elements from this stream and the specified stream by
 * repeatedly applying the function `f` to extract an element using both sides
 * and conceptually "offer" it to the destination stream. `f` can maintain
 * some internal state to control the combining process, with the initial
 * state being specified by `s`.
 *
 * Where possible, prefer `Stream.combineChunks` for a more efficient
 * implementation.
 *
 * @since 2.0.0
 * @category utils
 */
exports.combine = internal.combine;
/**
 * Combines the chunks from this stream and the specified stream by repeatedly
 * applying the function `f` to extract a chunk using both sides and
 * conceptually "offer" it to the destination stream. `f` can maintain some
 * internal state to control the combining process, with the initial state
 * being specified by `s`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.combineChunks = internal.combineChunks;
/**
 * Concatenates the specified stream with this stream, resulting in a stream
 * that emits the elements from this stream and then the elements from the
 * specified stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.concat = internal.concat;
/**
 * Concatenates all of the streams in the chunk to one stream.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.concatAll = internal.concatAll;
/**
 * Composes this stream with the specified stream to create a cartesian
 * product of elements. The `that` stream would be run multiple times, for
 * every element in the `this` stream.
 *
 * See also `Stream.zip` for the more common point-wise variant.
 *
 * @since 2.0.0
 * @category utils
 */
exports.cross = internal.cross;
/**
 * Composes this stream with the specified stream to create a cartesian
 * product of elements, but keeps only elements from this stream. The `that`
 * stream would be run multiple times, for every element in the `this` stream.
 *
 * See also `Stream.zipLeft` for the more common point-wise variant.
 *
 * @since 2.0.0
 * @category utils
 */
exports.crossLeft = internal.crossLeft;
/**
 * Composes this stream with the specified stream to create a cartesian
 * product of elements, but keeps only elements from the other stream. The
 * `that` stream would be run multiple times, for every element in the `this`
 * stream.
 *
 * See also `Stream.zipRight` for the more common point-wise variant.
 *
 * @since 2.0.0
 * @category utils
 */
exports.crossRight = internal.crossRight;
/**
 * Composes this stream with the specified stream to create a cartesian
 * product of elements with a specified function. The `that` stream would be
 * run multiple times, for every element in the `this` stream.
 *
 * See also `Stream.zipWith` for the more common point-wise variant.
 *
 * @since 2.0.0
 * @category utils
 */
exports.crossWith = internal.crossWith;
/**
 * Delays the emission of values by holding new values for a set duration. If
 * no new values arrive during that time the value is emitted, however if a
 * new value is received during the holding period the previous value is
 * discarded and the process is repeated with the new value.
 *
 * This operator is useful if you have a stream of "bursty" events which
 * eventually settle down and you only need the final event of the burst. For
 * example, a search engine may only want to initiate a search after a user
 * has paused typing so as to not prematurely recommend results.
 *
 * @since 2.0.0
 * @category utils
 */
exports.debounce = internal.debounce;
/**
 * The stream that dies with the specified defect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.die = internal.die;
/**
 * The stream that dies with the specified lazily evaluated defect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dieSync = internal.dieSync;
/**
 * The stream that dies with an exception described by `message`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dieMessage = internal.dieMessage;
/**
 * More powerful version of `Stream.broadcast`. Allows to provide a function
 * that determines what queues should receive which elements. The decide
 * function will receive the indices of the queues in the resulting list.
 *
 * @since 2.0.0
 * @category utils
 */
exports.distributedWith = internal.distributedWith;
/**
 * More powerful version of `Stream.distributedWith`. This returns a function
 * that will produce new queues and corresponding indices. You can also
 * provide a function that will be executed after the final events are
 * enqueued in all queues. Shutdown of the queues is handled by the driver.
 * Downstream users can also shutdown queues manually. In this case the driver
 * will continue but no longer backpressure on them.
 *
 * @since 2.0.0
 * @category utils
 */
exports.distributedWithDynamic = internal.distributedWithDynamic;
/**
 * Converts this stream to a stream that executes its effects but emits no
 * elements. Useful for sequencing effects using streams:
 *
 * @since 2.0.0
 * @category utils
 */
exports.drain = internal.drain;
/**
 * Drains the provided stream in the background for as long as this stream is
 * running. If this stream ends before `other`, `other` will be interrupted.
 * If `other` fails, this stream will fail with that error.
 *
 * @since 2.0.0
 * @category utils
 */
exports.drainFork = internal.drainFork;
/**
 * Drops the specified number of elements from this stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.drop = internal.drop;
/**
 * Drops the last specified number of elements from this stream.
 *
 * @note This combinator keeps `n` elements in memory. Be careful with big
 *       numbers.
 * @since 2.0.0
 * @category utils
 */
exports.dropRight = internal.dropRight;
/**
 * Drops all elements of the stream until the specified predicate evaluates to
 * `true`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.dropUntil = internal.dropUntil;
/**
 * Drops all elements of the stream until the specified effectful predicate
 * evaluates to `true`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.dropUntilEffect = internal.dropUntilEffect;
/**
 * Drops all elements of the stream for as long as the specified predicate
 * evaluates to `true`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.dropWhile = internal.dropWhile;
/**
 * Drops all elements of the stream for as long as the specified predicate
 * produces an effect that evalutates to `true`
 *
 * @since 2.0.0
 * @category utils
 */
exports.dropWhileEffect = internal.dropWhileEffect;
/**
 * Returns a stream whose failures and successes have been lifted into an
 * `Either`. The resulting stream cannot fail, because the failures have been
 * exposed as part of the `Either` success case.
 *
 * @note The stream will end as soon as the first error occurs.
 *
 * @since 2.0.0
 * @category utils
 */
exports.either = internal.either;
/**
 * The empty stream.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = internal.empty;
/**
 * Executes the provided finalizer after this stream's finalizers run.
 *
 * @since 2.0.0
 * @category utils
 */
exports.ensuring = internal.ensuring;
/**
 * Executes the provided finalizer after this stream's finalizers run.
 *
 * @since 2.0.0
 * @category utils
 */
exports.ensuringWith = internal.ensuringWith;
/**
 * Accesses the whole context of the stream.
 *
 * @since 2.0.0
 * @category context
 */
exports.context = internal.context;
/**
 * Accesses the context of the stream.
 *
 * @since 2.0.0
 * @category context
 */
exports.contextWith = internal.contextWith;
/**
 * Accesses the context of the stream in the context of an effect.
 *
 * @since 2.0.0
 * @category context
 */
exports.contextWithEffect = internal.contextWithEffect;
/**
 * Accesses the context of the stream in the context of a stream.
 *
 * @since 2.0.0
 * @category context
 */
exports.contextWithStream = internal.contextWithStream;
/**
 * Creates a stream that executes the specified effect but emits no elements.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.execute = internal.execute;
/**
 * Terminates with the specified error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fail = internal.fail;
/**
 * Terminates with the specified lazily evaluated error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failSync = internal.failSync;
/**
 * The stream that always fails with the specified `Cause`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failCause = internal.failCause;
/**
 * The stream that always fails with the specified lazily evaluated `Cause`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.failCauseSync = internal.failCauseSync;
/**
 * Filters the elements emitted by this stream using the provided function.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filter = internal.filter;
/**
 * Effectfully filters the elements emitted by this stream.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterEffect = internal.filterEffect;
/**
 * Performs a filter and map in a single step.
 *
 * @since 2.0.0
 * @category utils
 */
exports.filterMap = internal.filterMap;
/**
 * Performs an effectful filter and map in a single step.
 *
 * @since 2.0.0
 * @category utils
 */
exports.filterMapEffect = internal.filterMapEffect;
/**
 * Transforms all elements of the stream for as long as the specified partial
 * function is defined.
 *
 * @since 2.0.0
 * @category utils
 */
exports.filterMapWhile = internal.filterMapWhile;
/**
 * Effectfully transforms all elements of the stream for as long as the
 * specified partial function is defined.
 *
 * @since 2.0.0
 * @category utils
 */
exports.filterMapWhileEffect = internal.filterMapWhileEffect;
/**
 * Creates a one-element stream that never fails and executes the finalizer
 * when it ends.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.finalizer = internal.finalizer;
/**
 * Finds the first element emitted by this stream that satisfies the provided
 * predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.find = internal.find;
/**
 * Finds the first element emitted by this stream that satisfies the provided
 * effectful predicate.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findEffect = internal.findEffect;
/**
 * Returns a stream made of the concatenation in strict order of all the
 * streams produced by passing each element of this stream to `f0`
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = internal.flatMap;
/**
 * Flattens this stream-of-streams into a stream made of the concatenation in
 * strict order of all the streams.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatten = internal.flatten;
/**
 * Submerges the chunks carried by this stream into the stream's structure,
 * while still preserving them.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flattenChunks = internal.flattenChunks;
/**
 * Flattens `Effect` values into the stream's structure, preserving all
 * information about the effect.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flattenEffect = internal.flattenEffect;
/**
 * Unwraps `Exit` values that also signify end-of-stream by failing with `None`.
 *
 * For `Exit` values that do not signal end-of-stream, prefer:
 *
 * ```ts
 * stream.mapZIO(ZIO.done(_))
 * ```
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flattenExitOption = internal.flattenExitOption;
/**
 * Submerges the iterables carried by this stream into the stream's structure,
 * while still preserving them.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flattenIterables = internal.flattenIterables;
/**
 * Unwraps `Exit` values and flatten chunks that also signify end-of-stream
 * by failing with `None`.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flattenTake = internal.flattenTake;
/**
 * Repeats this stream forever.
 *
 * @since 2.0.0
 * @category utils
 */
exports.forever = internal.forever;
/**
 * Creates a stream from an `AsyncIterable`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromAsyncIterable = internal.fromAsyncIterable;
/**
 * Creates a stream from a `Channel`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromChannel = internal.fromChannel;
/**
 * Creates a channel from a `Stream`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.toChannel = internal.toChannel;
/**
 * Creates a stream from a `Chunk` of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromChunk = internal.fromChunk;
/**
 * Creates a stream from a subscription to a `PubSub`.
 *
 * @param shutdown If `true`, the `PubSub` will be shutdown after the stream is evaluated (defaults to `false`)
 * @since 2.0.0
 * @category constructors
 */
exports.fromChunkPubSub = internal.fromChunkPubSub;
/**
 * Creates a stream from a `Queue` of values.
 *
 * @param shutdown If `true`, the queue will be shutdown after the stream is evaluated (defaults to `false`)
 * @since 2.0.0
 * @category constructors
 */
exports.fromChunkQueue = internal.fromChunkQueue;
/**
 * Creates a stream from an arbitrary number of chunks.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromChunks = internal.fromChunks;
/**
 * Either emits the success value of this effect or terminates the stream
 * with the failure value of this effect.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEffect = internal.fromEffect;
/**
 * Creates a stream from an effect producing a value of type `A` or an empty
 * `Stream`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEffectOption = internal.fromEffectOption;
/**
 * Creates a stream from a subscription to a `PubSub`.
 *
 * @param shutdown If `true`, the `PubSub` will be shutdown after the stream is evaluated (defaults to `false`)
 * @since 2.0.0
 * @category constructors
 */
exports.fromPubSub = internal.fromPubSub;
/**
 * Creates a stream from an `Iterable` collection of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = internal.fromIterable;
/**
 * Creates a stream from an effect producing a value of type `Iterable<A>`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterableEffect = internal.fromIterableEffect;
/**
 * Creates a stream from an iterator
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIteratorSucceed = internal.fromIteratorSucceed;
/**
 * Creates a stream from an effect that pulls elements from another stream.
 *
 * See `Stream.toPull` for reference.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromPull = internal.fromPull;
/**
 * Creates a stream from a queue of values
 *
 * @param maxChunkSize The maximum number of queued elements to put in one chunk in the stream
 * @param shutdown If `true`, the queue will be shutdown after the stream is evaluated (defaults to `false`)
 * @since 2.0.0
 * @category constructors
 */
exports.fromQueue = internal.fromQueue;
/**
 * Creates a stream from a `ReadableStream`.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromReadableStream = internal.fromReadableStream;
/**
 * Creates a stream from a `ReadableStreamBYOBReader`.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamBYOBReader.
 *
 * @param allocSize Controls the size of the underlying `ArrayBuffer` (defaults to `4096`).
 * @since 2.0.0
 * @category constructors
 */
exports.fromReadableStreamByob = internal.fromReadableStreamByob;
/**
 * Creates a stream from a `Schedule` that does not require any further
 * input. The stream will emit an element for each value output from the
 * schedule, continuing for as long as the schedule continues.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromSchedule = internal.fromSchedule;
/**
 * Creates a pipeline that groups on adjacent keys, calculated by the
 * specified function.
 *
 * @since 2.0.0
 * @category grouping
 */
exports.groupAdjacentBy = internal.groupAdjacentBy;
/**
 * More powerful version of `Stream.groupByKey`.
 *
 * @since 2.0.0
 * @category grouping
 */
exports.groupBy = _groupBy.groupBy;
/**
 * Partition a stream using a function and process each stream individually.
 * This returns a data structure that can be used to further filter down which
 * groups shall be processed.
 *
 * After calling apply on the GroupBy object, the remaining groups will be
 * processed in parallel and the resulting streams merged in a
 * nondeterministic fashion.
 *
 * Up to `buffer` elements may be buffered in any group stream before the
 * producer is backpressured. Take care to consume from all streams in order
 * to prevent deadlocks.
 *
 * For example, to collect the first 2 words for every starting letter from a
 * stream of words:
 *
 * ```ts
 * import * as GroupBy from "./GroupBy"
 * import * as Stream from "./Stream"
 * import { pipe } from "./Function"
 *
 * pipe(
 *   Stream.fromIterable(["hello", "world", "hi", "holla"]),
 *   Stream.groupByKey((word) => word[0]),
 *   GroupBy.evaluate((key, stream) =>
 *     pipe(
 *       stream,
 *       Stream.take(2),
 *       Stream.map((words) => [key, words] as const)
 *     )
 *   )
 * )
 * ```
 *
 * @since 2.0.0
 * @category utils
 */
exports.groupByKey = _groupBy.groupByKey;
/**
 * Partitions the stream with specified `chunkSize`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.grouped = internal.grouped;
/**
 * Partitions the stream with the specified `chunkSize` or until the specified
 * `duration` has passed, whichever is satisfied first.
 *
 * @since 2.0.0
 * @category utils
 */
exports.groupedWithin = internal.groupedWithin;
/**
 * Specialized version of haltWhen which halts the evaluation of this stream
 * after the given duration.
 *
 * An element in the process of being pulled will not be interrupted when the
 * given duration completes. See `interruptAfter` for this behavior.
 *
 * @since 2.0.0
 * @category utils
 */
exports.haltAfter = internal.haltAfter;
/**
 * Halts the evaluation of this stream when the provided effect completes. The
 * given effect will be forked as part of the returned stream, and its success
 * will be discarded.
 *
 * An element in the process of being pulled will not be interrupted when the
 * effect completes. See `interruptWhen` for this behavior.
 *
 * If the effect completes with a failure, the stream will emit that failure.
 *
 * @since 2.0.0
 * @category utils
 */
exports.haltWhen = internal.haltWhen;
/**
 * Halts the evaluation of this stream when the provided promise resolves.
 *
 * If the promise completes with a failure, the stream will emit that failure.
 *
 * @since 2.0.0
 * @category utils
 */
exports.haltWhenDeferred = internal.haltWhenDeferred;
/**
 * The identity pipeline, which does not modify streams in any way.
 *
 * @since 2.0.0
 * @category utils
 */
exports.identity = internal.identityStream;
/**
 * Interleaves this stream and the specified stream deterministically by
 * alternating pulling values from this stream and the specified stream. When
 * one stream is exhausted all remaining values in the other stream will be
 * pulled.
 *
 * @since 2.0.0
 * @category utils
 */
exports.interleave = internal.interleave;
/**
 * Combines this stream and the specified stream deterministically using the
 * stream of boolean values `pull` to control which stream to pull from next.
 * A value of `true` indicates to pull from this stream and a value of `false`
 * indicates to pull from the specified stream. Only consumes as many elements
 * as requested by the `pull` stream. If either this stream or the specified
 * stream are exhausted further requests for values from that stream will be
 * ignored.
 *
 * @since 2.0.0
 * @category utils
 */
exports.interleaveWith = internal.interleaveWith;
/**
 * Intersperse stream with provided `element`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.intersperse = internal.intersperse;
/**
 * Intersperse the specified element, also adding a prefix and a suffix.
 *
 * @since 2.0.0
 * @category utils
 */
exports.intersperseAffixes = internal.intersperseAffixes;
/**
 * Specialized version of `Stream.interruptWhen` which interrupts the
 * evaluation of this stream after the given `Duration`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.interruptAfter = internal.interruptAfter;
/**
 * Interrupts the evaluation of this stream when the provided effect
 * completes. The given effect will be forked as part of this stream, and its
 * success will be discarded. This combinator will also interrupt any
 * in-progress element being pulled from upstream.
 *
 * If the effect completes with a failure before the stream completes, the
 * returned stream will emit that failure.
 *
 * @since 2.0.0
 * @category utils
 */
exports.interruptWhen = internal.interruptWhen;
/**
 * Interrupts the evaluation of this stream when the provided promise
 * resolves. This combinator will also interrupt any in-progress element being
 * pulled from upstream.
 *
 * If the promise completes with a failure, the stream will emit that failure.
 *
 * @since 2.0.0
 * @category utils
 */
exports.interruptWhenDeferred = internal.interruptWhenDeferred;
/**
 * The infinite stream of iterative function application: a, f(a), f(f(a)),
 * f(f(f(a))), ...
 *
 * @since 2.0.0
 * @category constructors
 */
exports.iterate = internal.iterate;
/**
 * Creates a stream from an sequence of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Transforms the elements of this stream using the supplied function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = internal.map;
/**
 * Statefully maps over the elements of this stream to produce new elements.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapAccum = internal.mapAccum;
/**
 * Statefully and effectfully maps over the elements of this stream to produce
 * new elements.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapAccumEffect = internal.mapAccumEffect;
/**
 * Returns a stream whose failure and success channels have been mapped by the
 * specified `onFailure` and `onSuccess` functions.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mapBoth = internal.mapBoth;
/**
 * Transforms the chunks emitted by this stream.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapChunks = internal.mapChunks;
/**
 * Effectfully transforms the chunks emitted by this stream.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapChunksEffect = internal.mapChunksEffect;
/**
 * Maps each element to an iterable, and flattens the iterables into the
 * output of this stream.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapConcat = internal.mapConcat;
/**
 * Maps each element to a chunk, and flattens the chunks into the output of
 * this stream.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapConcatChunk = internal.mapConcatChunk;
/**
 * Effectfully maps each element to a chunk, and flattens the chunks into the
 * output of this stream.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapConcatChunkEffect = internal.mapConcatChunkEffect;
/**
 * Effectfully maps each element to an iterable, and flattens the iterables
 * into the output of this stream.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapConcatEffect = internal.mapConcatEffect;
/**
 * Maps over elements of the stream with the specified effectful function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapEffect = _groupBy.mapEffectOptions;
/**
 * Transforms the errors emitted by this stream using `f`.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapError = internal.mapError;
/**
 * Transforms the full causes of failures emitted by this stream.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapErrorCause = internal.mapErrorCause;
/**
 * Merges this stream and the specified stream together.
 *
 * New produced stream will terminate when both specified stream terminate if
 * no termination strategy is specified.
 *
 * @since 2.0.0
 * @category utils
 */
exports.merge = internal.merge;
/**
 * Merges a variable list of streams in a non-deterministic fashion. Up to `n`
 * streams may be consumed in parallel and up to `outputBuffer` chunks may be
 * buffered by this operator.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mergeAll = internal.mergeAll;
/**
 * Merges this stream and the specified stream together to a common element
 * type with the specified mapping functions.
 *
 * New produced stream will terminate when both specified stream terminate if
 * no termination strategy is specified.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mergeWith = internal.mergeWith;
/**
 * Merges this stream and the specified stream together to produce a stream of
 * eithers.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mergeEither = internal.mergeEither;
/**
 * Merges this stream and the specified stream together, discarding the values
 * from the right stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mergeLeft = internal.mergeLeft;
/**
 * Merges this stream and the specified stream together, discarding the values
 * from the left stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mergeRight = internal.mergeRight;
/**
 * Returns a combined string resulting from concatenating each of the values
 * from the stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.mkString = internal.mkString;
/**
 * The stream that never produces any value or fails with any error.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.never = internal.never;
/**
 * Runs the specified effect if this stream fails, providing the error to the
 * effect if it exists.
 *
 * Note: Unlike `Effect.onError` there is no guarantee that the provided
 * effect will not be interrupted.
 *
 * @since 2.0.0
 * @category utils
 */
exports.onError = internal.onError;
/**
 * Runs the specified effect if this stream ends.
 *
 * @since 2.0.0
 * @category utils
 */
exports.onDone = internal.onDone;
/**
 * Translates any failure into a stream termination, making the stream
 * infallible and all failures unchecked.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orDie = internal.orDie;
/**
 * Keeps none of the errors, and terminates the stream with them, using the
 * specified function to convert the `E` into a defect.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orDieWith = internal.orDieWith;
/**
 * Switches to the provided stream in case this one fails with a typed error.
 *
 * See also `Stream.catchAll`.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElse = internal.orElse;
/**
 * Switches to the provided stream in case this one fails with a typed error.
 *
 * See also `Stream.catchAll`.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseEither = internal.orElseEither;
/**
 * Fails with given error in case this one fails with a typed error.
 *
 * See also `Stream.catchAll`.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseFail = internal.orElseFail;
/**
 * Produces the specified element if this stream is empty.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseIfEmpty = internal.orElseIfEmpty;
/**
 * Produces the specified chunk if this stream is empty.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseIfEmptyChunk = internal.orElseIfEmptyChunk;
/**
 * Switches to the provided stream in case this one is empty.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseIfEmptyStream = internal.orElseIfEmptyStream;
/**
 * Succeeds with the specified value if this one fails with a typed error.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.orElseSucceed = internal.orElseSucceed;
/**
 * Like `Stream.unfold`, but allows the emission of values to end one step further
 * than the unfolding of the state. This is useful for embedding paginated
 * APIs, hence the name.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.paginate = internal.paginate;
/**
 * Like `Stream.unfoldChunk`, but allows the emission of values to end one step
 * further than the unfolding of the state. This is useful for embedding
 * paginated APIs, hence the name.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.paginateChunk = internal.paginateChunk;
/**
 * Like `Stream.unfoldChunkEffect`, but allows the emission of values to end one step
 * further than the unfolding of the state. This is useful for embedding
 * paginated APIs, hence the name.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.paginateChunkEffect = internal.paginateChunkEffect;
/**
 * Like `Stream.unfoldEffect` but allows the emission of values to end one step
 * further than the unfolding of the state. This is useful for embedding
 * paginated APIs, hence the name.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.paginateEffect = internal.paginateEffect;
/**
 * Partition a stream using a predicate. The first stream will contain all
 * element evaluated to true and the second one will contain all element
 * evaluated to false. The faster stream may advance by up to buffer elements
 * further than the slower one.
 *
 * @since 2.0.0
 * @category utils
 */
exports.partition = internal.partition;
/**
 * Split a stream by an effectful predicate. The faster stream may advance by
 * up to buffer elements further than the slower one.
 *
 * @since 2.0.0
 * @category utils
 */
exports.partitionEither = internal.partitionEither;
/**
 * Peels off enough material from the stream to construct a `Z` using the
 * provided `Sink` and then returns both the `Z` and the rest of the
 * `Stream` in a scope. Like all scoped values, the provided stream is
 * valid only within the scope.
 *
 * @since 2.0.0
 * @category utils
 */
exports.peel = internal.peel;
/**
 * Pipes all of the values from this stream through the provided sink.
 *
 * See also `Stream.transduce`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.pipeThrough = internal.pipeThrough;
/**
 * Pipes all the values from this stream through the provided channel.
 *
 * @since 2.0.0
 * @category utils
 */
exports.pipeThroughChannel = internal.pipeThroughChannel;
/**
 * Pipes all values from this stream through the provided channel, passing
 * through any error emitted by this stream unchanged.
 *
 * @since 2.0.0
 * @category utils
 */
exports.pipeThroughChannelOrFail = internal.pipeThroughChannelOrFail;
/**
 * Emits the provided chunk before emitting any other value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.prepend = internal.prepend;
/**
 * Provides the stream with its required context, which eliminates its
 * dependency on `R`.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideContext = internal.provideContext;
/**
 * Provides a `Layer` to the stream, which translates it to another level.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideLayer = internal.provideLayer;
/**
 * Provides the stream with the single service it requires. If the stream
 * requires more than one service use `Stream.provideContext` instead.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideService = internal.provideService;
/**
 * Provides the stream with the single service it requires. If the stream
 * requires more than one service use `Stream.provideContext` instead.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideServiceEffect = internal.provideServiceEffect;
/**
 * Provides the stream with the single service it requires. If the stream
 * requires more than one service use `Stream.provideContext` instead.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideServiceStream = internal.provideServiceStream;
/**
 * Transforms the context being provided to the stream with the specified
 * function.
 *
 * @since 2.0.0
 * @category context
 */
exports.mapInputContext = internal.mapInputContext;
/**
 * Splits the context into two parts, providing one part using the
 * specified layer and leaving the remainder `R0`.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideSomeLayer = internal.provideSomeLayer;
/**
 * Constructs a stream from a range of integers, including both endpoints.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.range = internal.range;
/**
 * Re-chunks the elements of the stream into chunks of `n` elements each. The
 * last chunk might contain less than `n` elements.
 *
 * @since 2.0.0
 * @category utils
 */
exports.rechunk = internal.rechunk;
/**
 * Keeps some of the errors, and terminates the fiber with the rest
 *
 * @since 2.0.0
 * @category error handling
 */
exports.refineOrDie = internal.refineOrDie;
/**
 * Keeps some of the errors, and terminates the fiber with the rest, using the
 * specified function to convert the `E` into a defect.
 *
 * @since 2.0.0
 * @category error handling
 */
exports.refineOrDieWith = internal.refineOrDieWith;
/**
 * Repeats the entire stream using the specified schedule. The stream will
 * execute normally, and then repeat again according to the provided schedule.
 *
 * @since 2.0.0
 * @category utils
 */
exports.repeat = internal.repeat;
/**
 * Creates a stream from an effect producing a value of type `A` which repeats
 * forever.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.repeatEffect = internal.repeatEffect;
/**
 * Creates a stream from an effect producing chunks of `A` values which
 * repeats forever.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.repeatEffectChunk = internal.repeatEffectChunk;
/**
 * Creates a stream from an effect producing chunks of `A` values until it
 * fails with `None`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.repeatEffectChunkOption = internal.repeatEffectChunkOption;
/**
 * Creates a stream from an effect producing values of type `A` until it fails
 * with `None`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.repeatEffectOption = internal.repeatEffectOption;
/**
 * Creates a stream from an effect producing a value of type `A`, which is
 * repeated using the specified schedule.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.repeatEffectWithSchedule = internal.repeatEffectWithSchedule;
/**
 * Repeats the entire stream using the specified schedule. The stream will
 * execute normally, and then repeat again according to the provided schedule.
 * The schedule output will be emitted at the end of each repetition.
 *
 * @since 2.0.0
 * @category utils
 */
exports.repeatEither = internal.repeatEither;
/**
 * Repeats each element of the stream using the provided schedule. Repetitions
 * are done in addition to the first execution, which means using
 * `Schedule.recurs(1)` actually results in the original effect, plus an
 * additional recurrence, for a total of two repetitions of each value in the
 * stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.repeatElements = internal.repeatElements;
/**
 * Repeats each element of the stream using the provided schedule. When the
 * schedule is finished, then the output of the schedule will be emitted into
 * the stream. Repetitions are done in addition to the first execution, which
 * means using `Schedule.recurs(1)` actually results in the original effect,
 * plus an additional recurrence, for a total of two repetitions of each value
 * in the stream.
 *
 * This function accepts two conversion functions, which allow the output of
 * this stream and the output of the provided schedule to be unified into a
 * single type. For example, `Either` or similar data type.
 *
 * @since 2.0.0
 * @category utils
 */
exports.repeatElementsWith = internal.repeatElementsWith;
/**
 * Repeats the provided value infinitely.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.repeatValue = internal.repeatValue;
/**
 * Repeats the entire stream using the specified schedule. The stream will
 * execute normally, and then repeat again according to the provided schedule.
 * The schedule output will be emitted at the end of each repetition and can
 * be unified with the stream elements using the provided functions.
 *
 * @since 2.0.0
 * @category utils
 */
exports.repeatWith = internal.repeatWith;
/**
 * When the stream fails, retry it according to the given schedule
 *
 * This retries the entire stream, so will re-execute all of the stream's
 * acquire operations.
 *
 * The schedule is reset as soon as the first element passes through the
 * stream again.
 *
 * @param schedule A `Schedule` receiving as input the errors of the stream.
 * @since 2.0.0
 * @category utils
 */
exports.retry = internal.retry;
/**
 * Runs the sink on the stream to produce either the sink's result or an error.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.run = internal.run;
/**
 * Runs the stream and collects all of its elements to a chunk.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runCollect = internal.runCollect;
/**
 * Runs the stream and emits the number of elements processed
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runCount = internal.runCount;
/**
 * Runs the stream only for its effects. The emitted elements are discarded.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runDrain = internal.runDrain;
/**
 * Executes a pure fold over the stream of values - reduces all elements in
 * the stream to a value of type `S`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runFold = internal.runFold;
/**
 * Executes an effectful fold over the stream of values.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runFoldEffect = internal.runFoldEffect;
/**
 * Executes a pure fold over the stream of values. Returns a scoped value that
 * represents the scope of the stream.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runFoldScoped = internal.runFoldScoped;
/**
 * Executes an effectful fold over the stream of values. Returns a scoped
 * value that represents the scope of the stream.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runFoldScopedEffect = internal.runFoldScopedEffect;
/**
 * Reduces the elements in the stream to a value of type `S`. Stops the fold
 * early when the condition is not fulfilled. Example:
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runFoldWhile = internal.runFoldWhile;
/**
 * Executes an effectful fold over the stream of values. Stops the fold early
 * when the condition is not fulfilled.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runFoldWhileEffect = internal.runFoldWhileEffect;
/**
 * Executes a pure fold over the stream of values. Returns a scoped value that
 * represents the scope of the stream. Stops the fold early when the condition
 * is not fulfilled.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runFoldWhileScoped = internal.runFoldWhileScoped;
/**
 * Executes an effectful fold over the stream of values. Returns a scoped
 * value that represents the scope of the stream. Stops the fold early when
 * the condition is not fulfilled.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runFoldWhileScopedEffect = internal.runFoldWhileScopedEffect;
/**
 * Consumes all elements of the stream, passing them to the specified
 * callback.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runForEach = internal.runForEach;
/**
 * Consumes all elements of the stream, passing them to the specified
 * callback.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runForEachChunk = internal.runForEachChunk;
/**
 * Like `Stream.runForEachChunk`, but returns a scoped effect so the
 * finalization order can be controlled.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runForEachChunkScoped = internal.runForEachChunkScoped;
/**
 * Like `Stream.forEach`, but returns a scoped effect so the finalization
 * order can be controlled.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runForEachScoped = internal.runForEachScoped;
/**
 * Consumes elements of the stream, passing them to the specified callback,
 * and terminating consumption when the callback returns `false`.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runForEachWhile = internal.runForEachWhile;
/**
 * Like `Stream.runForEachWhile`, but returns a scoped effect so the
 * finalization order can be controlled.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runForEachWhileScoped = internal.runForEachWhileScoped;
/**
 * Runs the stream to completion and yields the first value emitted by it,
 * discarding the rest of the elements.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runHead = internal.runHead;
/**
 * Publishes elements of this stream to a `PubSub`. Stream failure and ending will
 * also be signalled.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runIntoPubSub = internal.runIntoPubSub;
/**
 * Like `Stream.runIntoPubSub`, but provides the result as a scoped effect to
 * allow for scope composition.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runIntoPubSubScoped = internal.runIntoPubSubScoped;
/**
 * Enqueues elements of this stream into a queue. Stream failure and ending
 * will also be signalled.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runIntoQueue = internal.runIntoQueue;
/**
 * Like `Stream.runIntoQueue`, but provides the result as a scoped [[ZIO]]
 * to allow for scope composition.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runIntoQueueElementsScoped = internal.runIntoQueueElementsScoped;
/**
 * Like `Stream.runIntoQueue`, but provides the result as a scoped effect
 * to allow for scope composition.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runIntoQueueScoped = internal.runIntoQueueScoped;
/**
 * Runs the stream to completion and yields the last value emitted by it,
 * discarding the rest of the elements.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runLast = internal.runLast;
/**
 * @since 2.0.0
 * @category destructors
 */
exports.runScoped = internal.runScoped;
/**
 * Runs the stream to a sink which sums elements, provided they are Numeric.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.runSum = internal.runSum;
/**
 * Statefully maps over the elements of this stream to produce all
 * intermediate results of type `S` given an initial S.
 *
 * @since 2.0.0
 * @category utils
 */
exports.scan = internal.scan;
/**
 * Statefully and effectfully maps over the elements of this stream to produce
 * all intermediate results of type `S` given an initial S.
 *
 * @since 2.0.0
 * @category utils
 */
exports.scanEffect = internal.scanEffect;
/**
 * Statefully maps over the elements of this stream to produce all
 * intermediate results.
 *
 * See also `Stream.scan`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.scanReduce = internal.scanReduce;
/**
 * Statefully and effectfully maps over the elements of this stream to produce
 * all intermediate results.
 *
 * See also `Stream.scanEffect`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.scanReduceEffect = internal.scanReduceEffect;
/**
 * Schedules the output of the stream using the provided `schedule`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.schedule = internal.schedule;
/**
 * Schedules the output of the stream using the provided `schedule` and emits
 * its output at the end (if `schedule` is finite). Uses the provided function
 * to align the stream and schedule outputs on the same type.
 *
 * @since 2.0.0
 * @category utils
 */
exports.scheduleWith = internal.scheduleWith;
/**
 * Creates a single-valued stream from a scoped resource.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.scoped = internal.scoped;
/**
 * Emits a sliding window of `n` elements.
 *
 * ```ts
 * import * as Stream from "./Stream"
 * import { pipe } from "./Function"
 *
 * pipe(
 *   Stream.make(1, 2, 3, 4),
 *   Stream.sliding(2),
 *   Stream.runCollect
 * )
 * // => Chunk(Chunk(1, 2), Chunk(2, 3), Chunk(3, 4))
 * ```
 *
 * @since 2.0.0
 * @category utils
 */
exports.sliding = internal.sliding;
/**
 * Like `sliding`, but with a configurable `stepSize` parameter.
 *
 * @since 2.0.0
 * @category utils
 */
exports.slidingSize = internal.slidingSize;
/**
 * Converts an option on values into an option on errors.
 *
 * @since 2.0.0
 * @category utils
 */
exports.some = internal.some;
/**
 * Extracts the optional value, or returns the given 'default'.
 *
 * @since 2.0.0
 * @category utils
 */
exports.someOrElse = internal.someOrElse;
/**
 * Extracts the optional value, or fails with the given error 'e'.
 *
 * @since 2.0.0
 * @category utils
 */
exports.someOrFail = internal.someOrFail;
/**
 * Splits elements based on a predicate.
 *
 * ```ts
 * import * as Stream from "./Stream"
 * import { pipe } from "./Function"
 *
 * pipe(
 *   Stream.range(1, 10),
 *   Stream.split((n) => n % 4 === 0),
 *   Stream.runCollect
 * )
 * // => Chunk(Chunk(1, 2, 3), Chunk(5, 6, 7), Chunk(9))
 * ```
 *
 * @since 2.0.0
 * @category utils
 */
exports.split = internal.split;
/**
 * Splits elements on a delimiter and transforms the splits into desired output.
 *
 * @since 2.0.0
 * @category utils
 */
exports.splitOnChunk = internal.splitOnChunk;
/**
 * Splits strings on newlines. Handles both Windows newlines (`\r\n`) and UNIX
 * newlines (`\n`).
 *
 * @since 2.0.0
 * @category combinators
 */
exports.splitLines = internal.splitLines;
/**
 * Creates a single-valued pure stream.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = internal.succeed;
/**
 * Creates a single-valued pure stream.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sync = internal.sync;
/**
 * Returns a lazily constructed stream.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.suspend = internal.suspend;
/**
 * Takes the specified number of elements from this stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.take = internal.take;
/**
 * Takes the last specified number of elements from this stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.takeRight = internal.takeRight;
/**
 * Takes all elements of the stream until the specified predicate evaluates to
 * `true`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.takeUntil = internal.takeUntil;
/**
 * Takes all elements of the stream until the specified effectual predicate
 * evaluates to `true`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.takeUntilEffect = internal.takeUntilEffect;
/**
 * Takes all elements of the stream for as long as the specified predicate
 * evaluates to `true`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.takeWhile = internal.takeWhile;
/**
 * Adds an effect to consumption of every element of the stream.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tap = internal.tap;
/**
 * Returns a stream that effectfully "peeks" at the failure or success of
 * the stream.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapBoth = internal.tapBoth;
/**
 * Returns a stream that effectfully "peeks" at the failure of the stream.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapError = internal.tapError;
/**
 * Returns a stream that effectfully "peeks" at the cause of failure of the
 * stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.tapErrorCause = internal.tapErrorCause;
/**
 * Sends all elements emitted by this stream to the specified sink in addition
 * to emitting them.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapSink = internal.tapSink;
/**
 * Delays the chunks of this stream according to the given bandwidth
 * parameters using the token bucket algorithm. Allows for burst in the
 * processing of elements by allowing the token bucket to accumulate tokens up
 * to a `units + burst` threshold. The weight of each chunk is determined by
 * the `costFn` function.
 *
 * If using the "enforce" strategy, chunks that do not meet the bandwidth
 * constraints are dropped. If using the "shape" strategy, chunks are delayed
 * until they can be emitted without exceeding the bandwidth constraints.
 *
 * Defaults to the "shape" strategy.
 *
 * @since 2.0.0
 * @category utils
 */
exports.throttle = internal.throttle;
/**
 * Delays the chunks of this stream according to the given bandwidth
 * parameters using the token bucket algorithm. Allows for burst in the
 * processing of elements by allowing the token bucket to accumulate tokens up
 * to a `units + burst` threshold. The weight of each chunk is determined by
 * the effectful `costFn` function.
 *
 * If using the "enforce" strategy, chunks that do not meet the bandwidth
 * constraints are dropped. If using the "shape" strategy, chunks are delayed
 * until they can be emitted without exceeding the bandwidth constraints.
 *
 * Defaults to the "shape" strategy.
 *
 * @since 2.0.0
 * @category utils
 */
exports.throttleEffect = internal.throttleEffect;
/**
 * A stream that emits Unit values spaced by the specified duration.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.tick = internal.tick;
/**
 * Ends the stream if it does not produce a value after the specified duration.
 *
 * @since 2.0.0
 * @category utils
 */
exports.timeout = internal.timeout;
/**
 * Fails the stream with given error if it does not produce a value after d
 * duration.
 *
 * @since 2.0.0
 * @category utils
 */
exports.timeoutFail = internal.timeoutFail;
/**
 * Fails the stream with given cause if it does not produce a value after d
 * duration.
 *
 * @since 2.0.0
 * @category utils
 */
exports.timeoutFailCause = internal.timeoutFailCause;
/**
 * Switches the stream if it does not produce a value after the specified
 * duration.
 *
 * @since 2.0.0
 * @category utils
 */
exports.timeoutTo = internal.timeoutTo;
/**
 * Converts the stream to a scoped `PubSub` of chunks. After the scope is closed,
 * the `PubSub` will never again produce values and should be discarded.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toPubSub = internal.toPubSub;
/**
 * Returns in a scope a ZIO effect that can be used to repeatedly pull chunks
 * from the stream. The pull effect fails with None when the stream is
 * finished, or with Some error if it fails, otherwise it returns a chunk of
 * the stream's output.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toPull = internal.toPull;
/**
 * Converts the stream to a scoped queue of chunks. After the scope is closed,
 * the queue will never again produce values and should be discarded.
 *
 * Defaults to the "suspend" back pressure strategy with a capacity of 2.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toQueue = internal.toQueue;
/**
 * Converts the stream to a scoped queue of elements. After the scope is
 * closed, the queue will never again produce values and should be discarded.
 *
 * Defaults to a capacity of 2.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toQueueOfElements = internal.toQueueOfElements;
/**
 * Converts the stream to a `ReadableStream`.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.toReadableStream = internal.toReadableStream;
/**
 * Applies the transducer to the stream and emits its outputs.
 *
 * @since 2.0.0
 * @category utils
 */
exports.transduce = internal.transduce;
/**
 * Creates a stream by peeling off the "layers" of a value of type `S`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unfold = internal.unfold;
/**
 * Creates a stream by peeling off the "layers" of a value of type `S`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unfoldChunk = internal.unfoldChunk;
/**
 * Creates a stream by effectfully peeling off the "layers" of a value of type
 * `S`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unfoldChunkEffect = internal.unfoldChunkEffect;
/**
 * Creates a stream by effectfully peeling off the "layers" of a value of type
 * `S`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unfoldEffect = internal.unfoldEffect;
/**
 * A stream that contains a single `Unit` value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unit = internal.unit;
/**
 * Creates a stream produced from an `Effect`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unwrap = internal.unwrap;
/**
 * Creates a stream produced from a scoped `Effect`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unwrapScoped = internal.unwrapScoped;
/**
 * Updates the specified service within the context of the `Stream`.
 *
 * @since 2.0.0
 * @category context
 */
exports.updateService = internal.updateService;
/**
 * Returns the specified stream if the given condition is satisfied, otherwise
 * returns an empty stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.when = internal.when;
/**
 * Returns the resulting stream when the given `PartialFunction` is defined
 * for the given value, otherwise returns an empty stream.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.whenCase = internal.whenCase;
/**
 * Returns the stream when the given partial function is defined for the given
 * effectful value, otherwise returns an empty stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.whenCaseEffect = internal.whenCaseEffect;
/**
 * Returns the stream if the given effectful condition is satisfied, otherwise
 * returns an empty stream.
 *
 * @since 2.0.0
 * @category utils
 */
exports.whenEffect = internal.whenEffect;
/**
 * Wraps the stream with a new span for tracing.
 *
 * @since 2.0.0
 * @category tracing
 */
exports.withSpan = internal.withSpan;
/**
 * Zips this stream with another point-wise and emits tuples of elements from
 * both streams.
 *
 * The new stream will end when one of the sides ends.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zip = internal.zip;
/**
 * Zips this stream with another point-wise and emits tuples of elements from
 * both streams.
 *
 * The new stream will end when one of the sides ends.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipFlatten = internal.zipFlatten;
/**
 * Zips this stream with another point-wise, creating a new stream of pairs of
 * elements from both sides.
 *
 * The defaults `defaultLeft` and `defaultRight` will be used if the streams
 * have different lengths and one of the streams has ended before the other.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipAll = internal.zipAll;
/**
 * Zips this stream with another point-wise, and keeps only elements from this
 * stream.
 *
 * The provided default value will be used if the other stream ends before
 * this one.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipAllLeft = internal.zipAllLeft;
/**
 * Zips this stream with another point-wise, and keeps only elements from the
 * other stream.
 *
 * The provided default value will be used if this stream ends before the
 * other one.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipAllRight = internal.zipAllRight;
/**
 * Zips this stream that is sorted by distinct keys and the specified stream
 * that is sorted by distinct keys to produce a new stream that is sorted by
 * distinct keys. Combines values associated with each key into a tuple,
 * using the specified values `defaultLeft` and `defaultRight` to fill in
 * missing values.
 *
 * This allows zipping potentially unbounded streams of data by key in
 * constant space but the caller is responsible for ensuring that the
 * streams are sorted by distinct keys.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipAllSortedByKey = internal.zipAllSortedByKey;
/**
 * Zips this stream that is sorted by distinct keys and the specified stream
 * that is sorted by distinct keys to produce a new stream that is sorted by
 * distinct keys. Keeps only values from this stream, using the specified
 * value `default` to fill in missing values.
 *
 * This allows zipping potentially unbounded streams of data by key in
 * constant space but the caller is responsible for ensuring that the
 * streams are sorted by distinct keys.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipAllSortedByKeyLeft = internal.zipAllSortedByKeyLeft;
/**
 * Zips this stream that is sorted by distinct keys and the specified stream
 * that is sorted by distinct keys to produce a new stream that is sorted by
 * distinct keys. Keeps only values from that stream, using the specified
 * value `default` to fill in missing values.
 *
 * This allows zipping potentially unbounded streams of data by key in
 * constant space but the caller is responsible for ensuring that the
 * streams are sorted by distinct keys.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipAllSortedByKeyRight = internal.zipAllSortedByKeyRight;
/**
 * Zips this stream that is sorted by distinct keys and the specified stream
 * that is sorted by distinct keys to produce a new stream that is sorted by
 * distinct keys. Uses the functions `left`, `right`, and `both` to handle
 * the cases where a key and value exist in this stream, that stream, or
 * both streams.
 *
 * This allows zipping potentially unbounded streams of data by key in
 * constant space but the caller is responsible for ensuring that the
 * streams are sorted by distinct keys.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipAllSortedByKeyWith = internal.zipAllSortedByKeyWith;
/**
 * Zips this stream with another point-wise. The provided functions will be
 * used to create elements for the composed stream.
 *
 * The functions `left` and `right` will be used if the streams have different
 * lengths and one of the streams has ended before the other.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipAllWith = internal.zipAllWith;
/**
 * Zips the two streams so that when a value is emitted by either of the two
 * streams, it is combined with the latest value from the other stream to
 * produce a result.
 *
 * Note: tracking the latest value is done on a per-chunk basis. That means
 * that emitted elements that are not the last value in chunks will never be
 * used for zipping.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipLatest = internal.zipLatest;
/**
 * Zips the two streams so that when a value is emitted by either of the two
 * streams, it is combined with the latest value from the other stream to
 * produce a result.
 *
 * Note: tracking the latest value is done on a per-chunk basis. That means
 * that emitted elements that are not the last value in chunks will never be
 * used for zipping.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipLatestWith = internal.zipLatestWith;
/**
 * Zips this stream with another point-wise, but keeps only the outputs of
 * this stream.
 *
 * The new stream will end when one of the sides ends.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipLeft = internal.zipLeft;
/**
 * Zips this stream with another point-wise, but keeps only the outputs of the
 * other stream.
 *
 * The new stream will end when one of the sides ends.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipRight = internal.zipRight;
/**
 * Zips this stream with another point-wise and applies the function to the
 * paired elements.
 *
 * The new stream will end when one of the sides ends.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWith = internal.zipWith;
/**
 * Zips this stream with another point-wise and applies the function to the
 * paired elements.
 *
 * The new stream will end when one of the sides ends.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWithChunks = internal.zipWithChunks;
/**
 * Zips each element with the next element if present.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWithNext = internal.zipWithNext;
/**
 * Zips each element with the previous element. Initially accompanied by
 * `None`.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWithPrevious = internal.zipWithPrevious;
/**
 * Zips each element with both the previous and next element.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWithPreviousAndNext = internal.zipWithPreviousAndNext;
/**
 * Zips this stream together with the index of elements.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWithIndex = internal.zipWithIndex;
// -------------------------------------------------------------------------------------
// Do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 * @category do notation
 */
exports.Do = internal.Do;
/**
 * Binds a value from a stream in a `do` scope
 *
 * @since 2.0.0
 * @category do notation
 */
exports.bind = internal.bind;
/**
 * Binds an effectful value in a `do` scope
 *
 * @since 2.0.0
 * @category do notation
 */
exports.bindEffect = _groupBy.bindEffect;
/**
 * @since 2.0.0
 * @category do notation
 */
exports.bindTo = internal.bindTo;
const let_ = internal.let_;
exports.let = let_;
// -------------------------------------------------------------------------------------
// encoding
// -------------------------------------------------------------------------------------
/**
 * Decode Uint8Array chunks into a stream of strings using the specified encoding.
 *
 * @since 2.0.0
 * @category encoding
 */
exports.decodeText = internal.decodeText;
/**
 * Encode a stream of strings into a stream of Uint8Array chunks using the specified encoding.
 *
 * @since 2.0.0
 * @category encoding
 */
exports.encodeText = internal.encodeText;
//# sourceMappingURL=Stream.js.map