"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locally = exports.race = exports.provideContext = exports.never = exports.fromEffectTagged = exports.fromEffect = exports.fromFunctionBatched = exports.fromFunction = exports.eitherWith = exports.mapInputContext = exports.batchN = exports.around = exports.makeBatched = exports.makeWithEntry = exports.make = exports.isRequestResolver = exports.contextFromServices = exports.contextFromEffect = exports.RequestResolverTypeId = void 0;
const Context = /*#__PURE__*/require("./Context.js");
const Effect = /*#__PURE__*/require("./Effect.js");
const core = /*#__PURE__*/require("./internal/core.js");
const internal = /*#__PURE__*/require("./internal/dataSource.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.RequestResolverTypeId = core.RequestResolverTypeId;
/**
 * @since 2.0.0
 * @category utils
 */
const contextFromEffect = self => Effect.contextWith(_ => (0, exports.provideContext)(self, _));
exports.contextFromEffect = contextFromEffect;
/**
 * @since 2.0.0
 * @category utils
 */
const contextFromServices = (...services) => self => Effect.contextWith(_ => (0, exports.provideContext)(self, Context.pick(...services)(_)));
exports.contextFromServices = contextFromServices;
/**
 * Returns `true` if the specified value is a `RequestResolver`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isRequestResolver = core.isRequestResolver;
/**
 * Constructs a data source with the specified identifier and method to run
 * requests.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Constructs a data source with the specified identifier and method to run
 * requests.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeWithEntry = internal.makeWithEntry;
/**
 * Constructs a data source from a function taking a collection of requests
 * and returning a `RequestCompletionMap`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeBatched = internal.makeBatched;
/**
 * A data source aspect that executes requests between two effects, `before`
 * and `after`, where the result of `before` can be used by `after`.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.around = internal.around;
/**
 * Returns a data source that executes at most `n` requests in parallel.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.batchN = internal.batchN;
/**
 * Provides this data source with part of its required context.
 *
 * @since 2.0.0
 * @category context
 */
exports.mapInputContext = internal.mapInputContext;
/**
 * Returns a new data source that executes requests of type `C` using the
 * specified function to transform `C` requests into requests that either this
 * data source or that data source can execute.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.eitherWith = internal.eitherWith;
/**
 * Constructs a data source from a pure function.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromFunction = internal.fromFunction;
/**
 * Constructs a data source from a pure function that takes a list of requests
 * and returns a list of results of the same size. Each item in the result
 * list must correspond to the item at the same index in the request list.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromFunctionBatched = internal.fromFunctionBatched;
/**
 * Constructs a data source from an effectual function.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEffect = internal.fromEffect;
/**
 * Constructs a data source from a list of tags paired to functions, that takes
 * a list of requests and returns a list of results of the same size. Each item
 * in the result list must correspond to the item at the same index in the
 * request list.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEffectTagged = internal.fromEffectTagged;
/**
 * A data source that never executes requests.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.never = internal.never;
/**
 * Provides this data source with its required context.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideContext = internal.provideContext;
/**
 * Returns a new data source that executes requests by sending them to this
 * data source and that data source, returning the results from the first data
 * source to complete and safely interrupting the loser.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.race = internal.race;
/**
 * Returns a new data source with a localized FiberRef
 *
 * @since 2.0.0
 * @category combinators
 */
exports.locally = core.resolverLocally;
//# sourceMappingURL=RequestResolver.js.map