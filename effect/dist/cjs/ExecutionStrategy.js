"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isParallelN = exports.isParallel = exports.isSequential = exports.parallelN = exports.parallel = exports.sequential = void 0;
const internal = /*#__PURE__*/require("./internal/executionStrategy.js");
/**
 * Execute effects sequentially.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.sequential = internal.sequential;
/**
 * Execute effects in parallel.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.parallel = internal.parallel;
/**
 * Execute effects in parallel, up to the specified number of concurrent fibers.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.parallelN = internal.parallelN;
/**
 * Returns `true` if the specified `ExecutionStrategy` is an instance of
 * `Sequential`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isSequential = internal.isSequential;
/**
 * Returns `true` if the specified `ExecutionStrategy` is an instance of
 * `Sequential`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isParallel = internal.isParallel;
/**
 * Returns `true` if the specified `ExecutionStrategy` is an instance of
 * `Sequential`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
exports.isParallelN = internal.isParallelN;
/**
 * Folds over the specified `ExecutionStrategy` using the provided case
 * functions.
 *
 * @since 2.0.0
 * @category folding
 */
exports.match = internal.match;
//# sourceMappingURL=ExecutionStrategy.js.map