"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidate = exports.get = exports.makeWithTTL = exports.make = exports.isPool = exports.PoolTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/pool.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.PoolTypeId = internal.PoolTypeId;
/**
 * Returns `true` if the specified value is a `Pool`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isPool = internal.isPool;
/**
 * Makes a new pool of the specified fixed size. The pool is returned in a
 * `Scope`, which governs the lifetime of the pool. When the pool is shutdown
 * because the `Scope` is closed, the individual items allocated by the pool
 * will be released in some unspecified order.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Makes a new pool with the specified minimum and maximum sizes and time to
 * live before a pool whose excess items are not being used will be shrunk
 * down to the minimum size. The pool is returned in a `Scope`, which governs
 * the lifetime of the pool. When the pool is shutdown because the `Scope` is
 * used, the individual items allocated by the pool will be released in some
 * unspecified order.
 *
 * ```ts
 * import * as Duration from "./Duration"
 * import * as Effect from "effect/Effect"
 * import * as Pool from "effect/Pool"
 * import * as Scope from "effect/Scope"
 * import { pipe } from "./Function"
 *
 * Effect.scoped(
 *   pipe(
 *     Pool.make(acquireDbConnection, 10, 20, Duration.seconds(60)),
 *     Effect.flatMap((pool) =>
 *       Effect.scoped(
 *         pipe(
 *           pool.get(),
 *           Effect.flatMap((connection) => useConnection(connection))
 *         )
 *       )
 *     )
 *   )
 * )
 * ```
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeWithTTL = internal.makeWithTTL;
/**
 * Retrieves an item from the pool in a scoped effect. Note that if
 * acquisition fails, then the returned effect will fail for that same reason.
 * Retrying a failed acquisition attempt will repeat the acquisition attempt.
 *
 * @since 2.0.0
 * @category getters
 */
exports.get = internal.get;
/**
 * Invalidates the specified item. This will cause the pool to eventually
 * reallocate the item, although this reallocation may occur lazily rather
 * than eagerly.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.invalidate = internal.invalidate;
//# sourceMappingURL=Pool.js.map