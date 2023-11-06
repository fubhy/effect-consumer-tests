"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = exports.use = exports.fork = exports.extend = exports.close = exports.addFinalizerExit = exports.addFinalizer = exports.Scope = exports.CloseableScopeTypeId = exports.ScopeTypeId = void 0;
const core = /*#__PURE__*/require("./internal/core.js");
const fiberRuntime = /*#__PURE__*/require("./internal/fiberRuntime.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ScopeTypeId = core.ScopeTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.CloseableScopeTypeId = core.CloseableScopeTypeId;
/**
 * @since 2.0.0
 * @category context
 */
exports.Scope = fiberRuntime.scopeTag;
/**
 * Adds a finalizer to this scope. The finalizer is guaranteed to be run when
 * the scope is closed.
 *
 * @since 2.0.0
 * @category utils
 */
exports.addFinalizer = core.scopeAddFinalizer;
/**
 * A simplified version of `addFinalizerWith` when the `finalizer` does not
 * depend on the `Exit` value that the scope is closed with.
 *
 * @since 2.0.0
 * @category utils
 */
exports.addFinalizerExit = core.scopeAddFinalizerExit;
/**
 * Closes a scope with the specified exit value, running all finalizers that
 * have been added to the scope.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.close = core.scopeClose;
/**
 * Extends the scope of an `Effect` workflow that needs a scope into this
 * scope by providing it to the workflow but not closing the scope when the
 * workflow completes execution. This allows extending a scoped value into a
 * larger scope.
 *
 * @since 2.0.0
 * @category utils
 */
exports.extend = fiberRuntime.scopeExtend;
/**
 * Forks a new scope that is a child of this scope. The child scope will
 * automatically be closed when this scope is closed.
 *
 * @since 2.0.0
 * @category utils
 */
exports.fork = core.scopeFork;
/**
 * Uses the scope by providing it to an `Effect` workflow that needs a scope,
 * guaranteeing that the scope is closed with the result of that workflow as
 * soon as the workflow completes execution, whether by success, failure, or
 * interruption.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.use = fiberRuntime.scopeUse;
/**
 * Creates a Scope where Finalizers will run according to the `ExecutionStrategy`.
 *
 * If an ExecutionStrategy is not provided `sequential` will be used.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = fiberRuntime.scopeMake;
//# sourceMappingURL=Scope.js.map