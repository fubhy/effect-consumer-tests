"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Inspectable = exports.HashSet = exports.HashMap = exports.Hash = exports.HKT = exports.GroupBy = exports.GlobalValue = exports.Function = exports.FiberStatus = exports.FiberRefsPatch = exports.FiberRefs = exports.FiberRef = exports.FiberId = exports.Fiber = exports.Exit = exports.ExecutionStrategy = exports.Equivalence = exports.Equal = exports.Encoding = exports.Either = exports.Effectable = exports.Effect = exports.Duration = exports.Differ = exports.Deferred = exports.DefaultServices = exports.Data = exports.Context = exports.Console = exports.ConfigSecret = exports.ConfigProviderPathPatch = exports.ConfigProvider = exports.ConfigError = exports.Config = exports.Clock = exports.Chunk = exports.ChildExecutorDecision = exports.Channel = exports.Cause = exports.Cache = exports.Brand = exports.Boolean = exports.BigInt = exports.BigDecimal = exports.unsafeCoerce = exports.pipe = exports.identity = exports.hole = exports.flow = exports.absurd = void 0;
exports.Schedule = exports.STM = exports.RuntimeFlagsPatch = exports.RuntimeFlags = exports.Runtime = exports.Resource = exports.RequestResolver = exports.RequestBlock = exports.Request = exports.Reloadable = exports.Ref = exports.RedBlackTree = exports.ReadonlyRecord = exports.ReadonlyArray = exports.Random = exports.Queue = exports.PubSub = exports.Predicate = exports.Pool = exports.Pipeable = exports.Ordering = exports.Order = exports.Option = exports.Number = exports.NonEmptyIterable = exports.MutableRef = exports.MutableQueue = exports.MutableList = exports.MutableHashSet = exports.MutableHashMap = exports.MetricState = exports.MetricRegistry = exports.MetricPolling = exports.MetricPair = exports.MetricLabel = exports.MetricKeyType = exports.MetricKey = exports.MetricHook = exports.MetricBoundaries = exports.Metric = exports.MergeStrategy = exports.MergeState = exports.MergeDecision = exports.Match = exports.Logger = exports.LogSpan = exports.LogLevel = exports.List = exports.Layer = exports.KeyedPool = void 0;
exports.Utils = exports.UpstreamPullStrategy = exports.UpstreamPullRequest = exports.Unify = exports.Types = exports.Tuple = exports.Tracer = exports.TestSized = exports.TestServices = exports.TestLive = exports.TestContext = exports.TestConfig = exports.TestClock = exports.TestAnnotations = exports.TestAnnotationMap = exports.TestAnnotation = exports.Take = exports.TSet = exports.TSemaphore = exports.TRef = exports.TReentrantLock = exports.TRandom = exports.TQueue = exports.TPubSub = exports.TPriorityQueue = exports.TMap = exports.TDeferred = exports.TArray = exports.SynchronizedRef = exports.Symbol = exports.Supervisor = exports.SubscriptionRef = exports.Struct = exports.String = exports.Streamable = exports.StreamHaltStrategy = exports.StreamEmit = exports.Stream = exports.SortedSet = exports.SortedMap = exports.Sink = exports.SingleProducerAsyncInput = exports.ScopedRef = exports.ScopedCache = exports.Scope = exports.Scheduler = exports.ScheduleIntervals = exports.ScheduleInterval = exports.ScheduleDecision = void 0;
var Function_js_1 = /*#__PURE__*/require("./Function.js");
/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "absurd", {
  enumerable: true,
  get: function () {
    return Function_js_1.absurd;
  }
});
/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "flow", {
  enumerable: true,
  get: function () {
    return Function_js_1.flow;
  }
});
/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "hole", {
  enumerable: true,
  get: function () {
    return Function_js_1.hole;
  }
});
/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "identity", {
  enumerable: true,
  get: function () {
    return Function_js_1.identity;
  }
});
/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "pipe", {
  enumerable: true,
  get: function () {
    return Function_js_1.pipe;
  }
});
/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "unsafeCoerce", {
  enumerable: true,
  get: function () {
    return Function_js_1.unsafeCoerce;
  }
});
/**
 * This module provides utility functions and type class instances for working with the `BigDecimal` type in TypeScript.
 * It includes functions for basic arithmetic operations, as well as type class instances for `Equivalence` and `Order`.
 *
 * A `BigDecimal` allows storing any real number to arbitrary precision; which avoids common floating point errors
 * (such as 0.1 + 0.2 ≠ 0.3) at the cost of complexity.
 *
 * Internally, `BigDecimal` uses a `BigInt` object, paired with a 64-bit integer which determines the position of the
 * decimal point. Therefore, the precision *is not* actually arbitrary, but limited to 2<sup>63</sup> decimal places.
 *
 * It is not recommended to convert a floating point number to a decimal directly, as the floating point representation
 * may be unexpected.
 *
 * @since 2.0.0
 */
exports.BigDecimal = /*#__PURE__*/require("./BigDecimal.js");
/**
 * This module provides utility functions and type class instances for working with the `bigint` type in TypeScript.
 * It includes functions for basic arithmetic operations, as well as type class instances for
 * `Equivalence` and `Order`.
 *
 * @since 2.0.0
 */
exports.BigInt = /*#__PURE__*/require("./BigInt.js");
/**
 * This module provides utility functions and type class instances for working with the `boolean` type in TypeScript.
 * It includes functions for basic boolean operations, as well as type class instances for
 * `Equivalence` and `Order`.
 *
 * @since 2.0.0
 */
exports.Boolean = /*#__PURE__*/require("./Boolean.js");
/**
 * This module provides types and utility functions to create and work with branded types,
 * which are TypeScript types with an added type tag to prevent accidental usage of a value in the wrong context.
 *
 * The `refined` and `nominal` functions are both used to create branded types in TypeScript.
 * The main difference between them is that `refined` allows for validation of the data, while `nominal` does not.
 *
 * The `nominal` function is used to create a new branded type that has the same underlying type as the input, but with a different name.
 * This is useful when you want to distinguish between two values of the same type that have different meanings.
 * The `nominal` function does not perform any validation of the input data.
 *
 * On the other hand, the `refined` function is used to create a new branded type that has the same underlying type as the input,
 * but with a different name, and it also allows for validation of the input data.
 * The `refined` function takes a predicate that is used to validate the input data.
 * If the input data fails the validation, a `BrandErrors` is returned, which provides information about the specific validation failure.
 *
 * @since 2.0.0
 */
exports.Brand = /*#__PURE__*/require("./Brand.js");
/**
 * @since 2.0.0
 */
exports.Cache = /*#__PURE__*/require("./Cache.js");
/**
 * The `Effect<R, E, A>` type is polymorphic in values of type `E` and we can
 * work with any error type that we want. However, there is a lot of information
 * that is not inside an arbitrary `E` value. So as a result, an `Effect` needs
 * somewhere to store things like unexpected errors or defects, stack and
 * execution traces, causes of fiber interruptions, and so forth.
 *
 * Effect-TS is very strict about preserving the full information related to a
 * failure. It captures all type of errors into the `Cause` data type. `Effect`
 * uses the `Cause<E>` data type to store the full story of failure. So its
 * error model is lossless. It doesn't throw information related to the failure
 * result. So we can figure out exactly what happened during the operation of
 * our effects.
 *
 * It is important to note that `Cause` is an underlying data type representing
 * errors occuring within an `Effect` workflow. Thus, we don't usually deal with
 * `Cause`s directly. Even though it is not a data type that we deal with very
 * often, the `Cause` of a failing `Effect` workflow can be accessed at any
 * time, which gives us total access to all parallel and sequential errors in
 * occurring within our codebase.
 *
 * @since 2.0.0
 */
exports.Cause = /*#__PURE__*/require("./Cause.js");
/**
 * @since 2.0.0
 */
exports.Channel = /*#__PURE__*/require("./Channel.js");
/**
 * @since 2.0.0
 */
exports.ChildExecutorDecision = /*#__PURE__*/require("./ChildExecutorDecision.js");
/**
 * @since 2.0.0
 */
exports.Chunk = /*#__PURE__*/require("./Chunk.js");
/**
 * @since 2.0.0
 */
exports.Clock = /*#__PURE__*/require("./Clock.js");
/**
 * @since 2.0.0
 */
exports.Config = /*#__PURE__*/require("./Config.js");
/**
 * @since 2.0.0
 */
exports.ConfigError = /*#__PURE__*/require("./ConfigError.js");
/**
 * @since 2.0.0
 */
exports.ConfigProvider = /*#__PURE__*/require("./ConfigProvider.js");
/**
 * @since 2.0.0
 */
exports.ConfigProviderPathPatch = /*#__PURE__*/require("./ConfigProviderPathPatch.js");
/**
 * @since 2.0.0
 */
exports.ConfigSecret = /*#__PURE__*/require("./ConfigSecret.js");
/**
 * @since 2.0.0
 */
exports.Console = /*#__PURE__*/require("./Console.js");
/**
 * This module provides a data structure called `Context` that can be used for dependency injection in effectful
 * programs. It is essentially a table mapping `Tag`s to their implementations (called `Service`s), and can be used to
 * manage dependencies in a type-safe way. The `Context` data structure is essentially a way of providing access to a set
 * of related services that can be passed around as a single unit. This module provides functions to create, modify, and
 * query the contents of a `Context`, as well as a number of utility types for working with tags and services.
 *
 * @since 2.0.0
 */
exports.Context = /*#__PURE__*/require("./Context.js");
/**
 * @since 2.0.0
 */
exports.Data = /*#__PURE__*/require("./Data.js");
/**
 * @since 2.0.0
 */
exports.DefaultServices = /*#__PURE__*/require("./DefaultServices.js");
/**
 * @since 2.0.0
 */
exports.Deferred = /*#__PURE__*/require("./Deferred.js");
/**
 * @since 2.0.0
 */
exports.Differ = /*#__PURE__*/require("./Differ.js");
/**
 * @since 2.0.0
 */
exports.Duration = /*#__PURE__*/require("./Duration.js");
/**
 * @since 2.0.0
 */
exports.Effect = /*#__PURE__*/require("./Effect.js");
/**
 * @since 2.0.0
 */
exports.Effectable = /*#__PURE__*/require("./Effectable.js");
/**
 * @since 2.0.0
 */
exports.Either = /*#__PURE__*/require("./Either.js");
/**
 * This module provides encoding & decoding functionality for:
 *
 * - base64 (RFC4648)
 * - base64 (URL)
 * - hex
 *
 * @since 2.0.0
 */
exports.Encoding = /*#__PURE__*/require("./Encoding.js");
/**
 * @since 2.0.0
 */
exports.Equal = /*#__PURE__*/require("./Equal.js");
/**
 * This module provides an implementation of the `Equivalence` type class, which defines a binary relation
 * that is reflexive, symmetric, and transitive. In other words, it defines a notion of equivalence between values of a certain type.
 * These properties are also known in mathematics as an "equivalence relation".
 *
 * @since 2.0.0
 */
exports.Equivalence = /*#__PURE__*/require("./Equivalence.js");
/**
 * @since 2.0.0
 */
exports.ExecutionStrategy = /*#__PURE__*/require("./ExecutionStrategy.js");
/**
 * @since 2.0.0
 */
exports.Exit = /*#__PURE__*/require("./Exit.js");
/**
 * @since 2.0.0
 */
exports.Fiber = /*#__PURE__*/require("./Fiber.js");
/**
 * @since 2.0.0
 */
exports.FiberId = /*#__PURE__*/require("./FiberId.js");
/**
 * @since 2.0.0
 */
exports.FiberRef = /*#__PURE__*/require("./FiberRef.js");
/**
 * @since 2.0.0
 */
exports.FiberRefs = /*#__PURE__*/require("./FiberRefs.js");
/**
 * @since 2.0.0
 */
exports.FiberRefsPatch = /*#__PURE__*/require("./FiberRefsPatch.js");
/**
 * @since 2.0.0
 */
exports.FiberStatus = /*#__PURE__*/require("./FiberStatus.js");
/**
 * @since 2.0.0
 */
exports.Function = /*#__PURE__*/require("./Function.js");
/**
 * @since 2.0.0
 */
exports.GlobalValue = /*#__PURE__*/require("./GlobalValue.js");
/**
 * @since 2.0.0
 */
exports.GroupBy = /*#__PURE__*/require("./GroupBy.js");
/**
 * @since 2.0.0
 */
exports.HKT = /*#__PURE__*/require("./HKT.js");
/**
 * @since 2.0.0
 */
exports.Hash = /*#__PURE__*/require("./Hash.js");
/**
 * @since 2.0.0
 */
exports.HashMap = /*#__PURE__*/require("./HashMap.js");
/**
 * @since 2.0.0
 */
exports.HashSet = /*#__PURE__*/require("./HashSet.js");
/**
 * @since 2.0.0
 */
exports.Inspectable = /*#__PURE__*/require("./Inspectable.js");
/**
 * @since 2.0.0
 */
exports.KeyedPool = /*#__PURE__*/require("./KeyedPool.js");
/**
 * A `Layer<RIn, E, ROut>` describes how to build one or more services in your
 * application. Services can be injected into effects via
 * `Effect.provideService`. Effects can require services via `Effect.service`.
 *
 * Layer can be thought of as recipes for producing bundles of services, given
 * their dependencies (other services).
 *
 * Construction of services can be effectful and utilize resources that must be
 * acquired and safely released when the services are done being utilized.
 *
 * By default layers are shared, meaning that if the same layer is used twice
 * the layer will only be allocated a single time.
 *
 * Because of their excellent composition properties, layers are the idiomatic
 * way in Effect-TS to create services that depend on other services.
 *
 * @since 2.0.0
 */
exports.Layer = /*#__PURE__*/require("./Layer.js");
/**
 * A data type for immutable linked lists representing ordered collections of elements of type `A`.
 *
 * This data type is optimal for last-in-first-out (LIFO), stack-like access patterns. If you need another access pattern, for example, random access or FIFO, consider using a collection more suited to this than `List`.
 *
 * **Performance**
 *
 * - Time: `List` has `O(1)` prepend and head/tail access. Most other operations are `O(n)` on the number of elements in the list. This includes the index-based lookup of elements, `length`, `append` and `reverse`.
 * - Space: `List` implements structural sharing of the tail list. This means that many operations are either zero- or constant-memory cost.
 *
 * @since 2.0.0
 */
exports.List = /*#__PURE__*/require("./List.js");
/**
 * @since 2.0.0
 */
exports.LogLevel = /*#__PURE__*/require("./LogLevel.js");
/**
 * @since 2.0.0
 */
exports.LogSpan = /*#__PURE__*/require("./LogSpan.js");
/**
 * @since 2.0.0
 */
exports.Logger = /*#__PURE__*/require("./Logger.js");
/**
 * @since 1.0.0
 */
exports.Match = /*#__PURE__*/require("./Match.js");
/**
 * @since 2.0.0
 */
exports.MergeDecision = /*#__PURE__*/require("./MergeDecision.js");
/**
 * @since 2.0.0
 */
exports.MergeState = /*#__PURE__*/require("./MergeState.js");
/**
 * @since 2.0.0
 */
exports.MergeStrategy = /*#__PURE__*/require("./MergeStrategy.js");
/**
 * @since 2.0.0
 */
exports.Metric = /*#__PURE__*/require("./Metric.js");
/**
 * @since 2.0.0
 */
exports.MetricBoundaries = /*#__PURE__*/require("./MetricBoundaries.js");
/**
 * @since 2.0.0
 */
exports.MetricHook = /*#__PURE__*/require("./MetricHook.js");
/**
 * @since 2.0.0
 */
exports.MetricKey = /*#__PURE__*/require("./MetricKey.js");
/**
 * @since 2.0.0
 */
exports.MetricKeyType = /*#__PURE__*/require("./MetricKeyType.js");
/**
 * @since 2.0.0
 */
exports.MetricLabel = /*#__PURE__*/require("./MetricLabel.js");
/**
 * @since 2.0.0
 */
exports.MetricPair = /*#__PURE__*/require("./MetricPair.js");
/**
 * @since 2.0.0
 */
exports.MetricPolling = /*#__PURE__*/require("./MetricPolling.js");
/**
 * @since 2.0.0
 */
exports.MetricRegistry = /*#__PURE__*/require("./MetricRegistry.js");
/**
 * @since 2.0.0
 */
exports.MetricState = /*#__PURE__*/require("./MetricState.js");
/**
 * @since 2.0.0
 */
exports.MutableHashMap = /*#__PURE__*/require("./MutableHashMap.js");
/**
 * @since 2.0.0
 */
exports.MutableHashSet = /*#__PURE__*/require("./MutableHashSet.js");
/**
 * @since 2.0.0
 */
exports.MutableList = /*#__PURE__*/require("./MutableList.js");
/**
 * @since 2.0.0
 */
exports.MutableQueue = /*#__PURE__*/require("./MutableQueue.js");
/**
 * @since 2.0.0
 */
exports.MutableRef = /*#__PURE__*/require("./MutableRef.js");
/**
 * @since 2.0.0
 */
exports.NonEmptyIterable = /*#__PURE__*/require("./NonEmptyIterable.js");
/**
 * This module provides utility functions and type class instances for working with the `number` type in TypeScript.
 * It includes functions for basic arithmetic operations, as well as type class instances for
 * `Equivalence` and `Order`.
 *
 * @since 2.0.0
 */
exports.Number = /*#__PURE__*/require("./Number.js");
/**
 * @since 2.0.0
 */
exports.Option = /*#__PURE__*/require("./Option.js");
/**
 * @since 2.0.0
 */
exports.Order = /*#__PURE__*/require("./Order.js");
/**
 * @since 2.0.0
 */
exports.Ordering = /*#__PURE__*/require("./Ordering.js");
/**
 * @since 2.0.0
 */
exports.Pipeable = /*#__PURE__*/require("./Pipeable.js");
/**
 * @since 2.0.0
 */
exports.Pool = /*#__PURE__*/require("./Pool.js");
/**
 * @since 2.0.0
 */
exports.Predicate = /*#__PURE__*/require("./Predicate.js");
/**
 * @since 2.0.0
 */
exports.PubSub = /*#__PURE__*/require("./PubSub.js");
/**
 * @since 2.0.0
 */
exports.Queue = /*#__PURE__*/require("./Queue.js");
/**
 * @since 2.0.0
 */
exports.Random = /*#__PURE__*/require("./Random.js");
/**
 * This module provides utility functions for working with arrays in TypeScript.
 *
 * @since 2.0.0
 */
exports.ReadonlyArray = /*#__PURE__*/require("./ReadonlyArray.js");
/**
 * This module provides utility functions for working with records in TypeScript.
 *
 * @since 2.0.0
 */
exports.ReadonlyRecord = /*#__PURE__*/require("./ReadonlyRecord.js");
/**
 * @since 2.0.0
 */
exports.RedBlackTree = /*#__PURE__*/require("./RedBlackTree.js");
/**
 * @since 2.0.0
 */
exports.Ref = /*#__PURE__*/require("./Ref.js");
/**
 * @since 2.0.0
 */
exports.Reloadable = /*#__PURE__*/require("./Reloadable.js");
/**
 * @since 2.0.0
 */
exports.Request = /*#__PURE__*/require("./Request.js");
/**
 * @since 2.0.0
 */
exports.RequestBlock = /*#__PURE__*/require("./RequestBlock.js");
/**
 * @since 2.0.0
 */
exports.RequestResolver = /*#__PURE__*/require("./RequestResolver.js");
/**
 * @since 2.0.0
 */
exports.Resource = /*#__PURE__*/require("./Resource.js");
/**
 * @since 2.0.0
 */
exports.Runtime = /*#__PURE__*/require("./Runtime.js");
/**
 * @since 2.0.0
 */
exports.RuntimeFlags = /*#__PURE__*/require("./RuntimeFlags.js");
/**
 * @since 2.0.0
 */
exports.RuntimeFlagsPatch = /*#__PURE__*/require("./RuntimeFlagsPatch.js");
/**
 * @since 2.0.0
 */
exports.STM = /*#__PURE__*/require("./STM.js");
/**
 * @since 2.0.0
 */
exports.Schedule = /*#__PURE__*/require("./Schedule.js");
/**
 * @since 2.0.0
 */
exports.ScheduleDecision = /*#__PURE__*/require("./ScheduleDecision.js");
/**
 * @since 2.0.0
 */
exports.ScheduleInterval = /*#__PURE__*/require("./ScheduleInterval.js");
/**
 * @since 2.0.0
 */
exports.ScheduleIntervals = /*#__PURE__*/require("./ScheduleIntervals.js");
/**
 * @since 2.0.0
 */
exports.Scheduler = /*#__PURE__*/require("./Scheduler.js");
/**
 * @since 2.0.0
 */
exports.Scope = /*#__PURE__*/require("./Scope.js");
/**
 * @since 2.0.0
 */
exports.ScopedCache = /*#__PURE__*/require("./ScopedCache.js");
/**
 * @since 2.0.0
 */
exports.ScopedRef = /*#__PURE__*/require("./ScopedRef.js");
/**
 * @since 2.0.0
 */
exports.SingleProducerAsyncInput = /*#__PURE__*/require("./SingleProducerAsyncInput.js");
/**
 * @since 2.0.0
 */
exports.Sink = /*#__PURE__*/require("./Sink.js");
/**
 * @since 2.0.0
 */
exports.SortedMap = /*#__PURE__*/require("./SortedMap.js");
/**
 * @since 2.0.0
 */
exports.SortedSet = /*#__PURE__*/require("./SortedSet.js");
/**
 * @since 2.0.0
 */
exports.Stream = /*#__PURE__*/require("./Stream.js");
/**
 * @since 2.0.0
 */
exports.StreamEmit = /*#__PURE__*/require("./StreamEmit.js");
/**
 * @since 2.0.0
 */
exports.StreamHaltStrategy = /*#__PURE__*/require("./StreamHaltStrategy.js");
/**
 * @since 2.0.0
 */
exports.Streamable = /*#__PURE__*/require("./Streamable.js");
/**
 * This module provides utility functions and type class instances for working with the `string` type in TypeScript.
 * It includes functions for basic string manipulation, as well as type class instances for
 * `Equivalence` and `Order`.
 *
 * @since 2.0.0
 */
exports.String = /*#__PURE__*/require("./String.js");
/**
 * This module provides utility functions for working with structs in TypeScript.
 *
 * @since 2.0.0
 */
exports.Struct = /*#__PURE__*/require("./Struct.js");
/**
 * @since 2.0.0
 */
exports.SubscriptionRef = /*#__PURE__*/require("./SubscriptionRef.js");
/**
 * A `Supervisor<T>` is allowed to supervise the launching and termination of
 * fibers, producing some visible value of type `T` from the supervision.
 *
 * @since 2.0.0
 */
exports.Supervisor = /*#__PURE__*/require("./Supervisor.js");
/**
 * @since 2.0.0
 */
exports.Symbol = /*#__PURE__*/require("./Symbol.js");
/**
 * @since 2.0.0
 */
exports.SynchronizedRef = /*#__PURE__*/require("./SynchronizedRef.js");
/**
 * @since 2.0.0
 */
exports.TArray = /*#__PURE__*/require("./TArray.js");
/**
 * @since 2.0.0
 */
exports.TDeferred = /*#__PURE__*/require("./TDeferred.js");
/**
 * @since 2.0.0
 */
exports.TMap = /*#__PURE__*/require("./TMap.js");
/**
 * @since 2.0.0
 */
exports.TPriorityQueue = /*#__PURE__*/require("./TPriorityQueue.js");
/**
 * @since 2.0.0
 */
exports.TPubSub = /*#__PURE__*/require("./TPubSub.js");
/**
 * @since 2.0.0
 */
exports.TQueue = /*#__PURE__*/require("./TQueue.js");
/**
 * @since 2.0.0
 */
exports.TRandom = /*#__PURE__*/require("./TRandom.js");
/**
 * @since 2.0.0
 */
exports.TReentrantLock = /*#__PURE__*/require("./TReentrantLock.js");
/**
 * @since 2.0.0
 */
exports.TRef = /*#__PURE__*/require("./TRef.js");
/**
 * @since 2.0.0
 */
exports.TSemaphore = /*#__PURE__*/require("./TSemaphore.js");
/**
 * @since 2.0.0
 */
exports.TSet = /*#__PURE__*/require("./TSet.js");
/**
 * @since 2.0.0
 */
exports.Take = /*#__PURE__*/require("./Take.js");
/**
 * @since 2.0.0
 */
exports.TestAnnotation = /*#__PURE__*/require("./TestAnnotation.js");
/**
 * @since 2.0.0
 */
exports.TestAnnotationMap = /*#__PURE__*/require("./TestAnnotationMap.js");
/**
 * @since 2.0.0
 */
exports.TestAnnotations = /*#__PURE__*/require("./TestAnnotations.js");
/**
 * @since 2.0.0
 */
exports.TestClock = /*#__PURE__*/require("./TestClock.js");
/**
 * @since 2.0.0
 */
exports.TestConfig = /*#__PURE__*/require("./TestConfig.js");
/**
 * @since 2.0.0
 */
exports.TestContext = /*#__PURE__*/require("./TestContext.js");
/**
 * @since 2.0.0
 */
exports.TestLive = /*#__PURE__*/require("./TestLive.js");
/**
 * @since 2.0.0
 */
exports.TestServices = /*#__PURE__*/require("./TestServices.js");
/**
 * @since 2.0.0
 */
exports.TestSized = /*#__PURE__*/require("./TestSized.js");
/**
 * @since 2.0.0
 */
exports.Tracer = /*#__PURE__*/require("./Tracer.js");
/**
 * This module provides utility functions for working with tuples in TypeScript.
 *
 * @since 2.0.0
 */
exports.Tuple = /*#__PURE__*/require("./Tuple.js");
/**
 * A collection of types that are commonly used types.
 *
 * @since 2.0.0
 */
exports.Types = /*#__PURE__*/require("./Types.js");
/**
 * @since 2.0.0
 */
exports.Unify = /*#__PURE__*/require("./Unify.js");
/**
 * @since 2.0.0
 */
exports.UpstreamPullRequest = /*#__PURE__*/require("./UpstreamPullRequest.js");
/**
 * @since 2.0.0
 */
exports.UpstreamPullStrategy = /*#__PURE__*/require("./UpstreamPullStrategy.js");
/**
 * @since 2.0.0
 */
exports.Utils = /*#__PURE__*/require("./Utils.js");
//# sourceMappingURL=index.js.map