"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncEffect = exports.unsafeRunSyncExitEffect = exports.unsafeRunSyncEffect = exports.unsafeRunPromiseExitEffect = exports.unsafeRunPromiseEffect = exports.unsafeForkEffect = exports.unsafeRunEffect = exports.defaultRuntime = exports.defaultRuntimeFlags = exports.runtime = exports.make = exports.RuntimeImpl = exports.unsafeRunPromiseExit = exports.unsafeRunPromise = exports.unsafeRunSyncExit = exports.isFiberFailure = exports.fiberFailure = exports.FiberFailureCauseId = exports.FiberFailureId = exports.isAsyncFiberException = exports.unsafeRunSync = exports.unsafeRunCallback = exports.unsafeFork = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const Fiber = /*#__PURE__*/require("../Fiber.js");
const FiberId = /*#__PURE__*/require("../FiberId.js");
const FiberRefs = /*#__PURE__*/require("../FiberRefs.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate = /*#__PURE__*/require("../Predicate.js");
const _scheduler = /*#__PURE__*/require("../Scheduler.js");
const cause_js_1 = /*#__PURE__*/require("./cause.js");
const InternalCause = /*#__PURE__*/require("./cause.js");
const core = /*#__PURE__*/require("./core.js");
const FiberRuntime = /*#__PURE__*/require("./fiberRuntime.js");
const fiberScope = /*#__PURE__*/require("./fiberScope.js");
const OpCodes = /*#__PURE__*/require("./opCodes/effect.js");
const runtimeFlags = /*#__PURE__*/require("./runtimeFlags.js");
const _supervisor = /*#__PURE__*/require("./supervisor.js");
/** @internal */
const unsafeFork = runtime => (self, options) => {
  const fiberId = FiberId.unsafeMake();
  const effect = self;
  let fiberRefs = FiberRefs.updatedAs(runtime.fiberRefs, {
    fiberId,
    fiberRef: core.currentContext,
    value: runtime.context
  });
  if (options?.scheduler) {
    fiberRefs = FiberRefs.updatedAs(fiberRefs, {
      fiberId,
      fiberRef: _scheduler.currentScheduler,
      value: options.scheduler
    });
  }
  if (options?.updateRefs) {
    fiberRefs = options.updateRefs(fiberRefs, fiberId);
  }
  const fiberRuntime = new FiberRuntime.FiberRuntime(fiberId, FiberRefs.forkAs(fiberRefs, fiberId), runtime.runtimeFlags);
  const supervisor = fiberRuntime._supervisor;
  // we can compare by reference here as _supervisor.none is wrapped with globalValue
  if (supervisor !== _supervisor.none) {
    supervisor.onStart(runtime.context, effect, Option.none(), fiberRuntime);
    fiberRuntime.addObserver(exit => supervisor.onEnd(exit, fiberRuntime));
  }
  fiberScope.globalScope.add(runtime.runtimeFlags, fiberRuntime);
  fiberRuntime.start(effect);
  return fiberRuntime;
};
exports.unsafeFork = unsafeFork;
/** @internal */
const unsafeRunCallback = runtime => (effect, onExit) => {
  const fiberRuntime = (0, exports.unsafeFork)(runtime)(effect);
  if (onExit) {
    fiberRuntime.addObserver(exit => {
      onExit(exit);
    });
  }
  return (id, onExitInterrupt) => (0, exports.unsafeRunCallback)(runtime)((0, Function_js_1.pipe)(fiberRuntime, Fiber.interruptAs(id ?? FiberId.none)), onExitInterrupt ? exit => onExitInterrupt(Exit.flatten(exit)) : void 0);
};
exports.unsafeRunCallback = unsafeRunCallback;
/** @internal */
const unsafeRunSync = runtime => effect => {
  const result = (0, exports.unsafeRunSyncExit)(runtime)(effect);
  if (result._tag === "Failure") {
    throw (0, exports.fiberFailure)(result.i0);
  } else {
    return result.i0;
  }
};
exports.unsafeRunSync = unsafeRunSync;
/** @internal */
const asyncFiberException = fiber => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = limit;
  const message = `Fiber #${fiber.id().id} cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work`;
  const _tag = "AsyncFiberException";
  Object.defineProperties(error, {
    _tag: {
      value: _tag
    },
    fiber: {
      value: fiber
    },
    message: {
      value: message
    },
    name: {
      value: _tag
    },
    toString: {
      get() {
        return () => message;
      }
    },
    [Inspectable_js_1.NodeInspectSymbol]: {
      get() {
        return () => message;
      }
    }
  });
  return error;
};
/** @internal */
const isAsyncFiberException = u => Predicate.isTagged(u, "AsyncFiberException") && "fiber" in u;
exports.isAsyncFiberException = isAsyncFiberException;
/** @internal */
exports.FiberFailureId = /*#__PURE__*/Symbol.for("effect/Runtime/FiberFailure");
/** @internal */
exports.FiberFailureCauseId = /*#__PURE__*/Symbol.for("effect/Runtime/FiberFailure/Cause");
/** @internal */
const fiberFailure = cause => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = limit;
  const prettyErrors = InternalCause.prettyErrors(cause);
  if (prettyErrors.length > 0) {
    const head = prettyErrors[0];
    error.name = head.message.split(":")[0];
    error.message = head.message.substring(error.name.length + 2);
    error.stack = InternalCause.pretty(cause);
  }
  error[exports.FiberFailureId] = exports.FiberFailureId;
  error[exports.FiberFailureCauseId] = cause;
  error.toJSON = () => {
    return {
      _id: "FiberFailure",
      cause: cause.toJSON()
    };
  };
  error.toString = () => {
    return (0, Inspectable_js_1.toString)(error.toJSON());
  };
  error[Inspectable_js_1.NodeInspectSymbol] = () => {
    return error.toJSON();
  };
  return error;
};
exports.fiberFailure = fiberFailure;
/** @internal */
const isFiberFailure = u => Predicate.hasProperty(u, exports.FiberFailureId);
exports.isFiberFailure = isFiberFailure;
const fastPath = effect => {
  const op = effect;
  switch (op._op) {
    case "Failure":
    case "Success":
      {
        // @ts-expect-error
        return op;
      }
    case "Left":
      {
        return core.exitFail(op.left);
      }
    case "Right":
      {
        return core.exitSucceed(op.right);
      }
    case "Some":
      {
        return core.exitSucceed(op.value);
      }
    case "None":
      {
        // @ts-expect-error
        return core.exitFail((0, cause_js_1.NoSuchElementException)());
      }
  }
};
/** @internal */
const unsafeRunSyncExit = runtime => effect => {
  const op = fastPath(effect);
  if (op) {
    return op;
  }
  const scheduler = new _scheduler.SyncScheduler();
  const fiberRuntime = (0, exports.unsafeFork)(runtime)(effect, {
    scheduler
  });
  scheduler.flush();
  const result = fiberRuntime.unsafePoll();
  if (result) {
    return result;
  }
  throw asyncFiberException(fiberRuntime);
};
exports.unsafeRunSyncExit = unsafeRunSyncExit;
/** @internal */
const unsafeRunPromise = runtime => effect => (0, exports.unsafeRunPromiseExit)(runtime)(effect).then(result => {
  switch (result._tag) {
    case OpCodes.OP_SUCCESS:
      {
        return result.i0;
      }
    case OpCodes.OP_FAILURE:
      {
        throw (0, exports.fiberFailure)(result.i0);
      }
  }
});
exports.unsafeRunPromise = unsafeRunPromise;
/** @internal */
const unsafeRunPromiseExit = runtime => effect => new Promise(resolve => {
  const op = fastPath(effect);
  if (op) {
    resolve(op);
  }
  (0, exports.unsafeFork)(runtime)(effect).addObserver(exit => {
    resolve(exit);
  });
});
exports.unsafeRunPromiseExit = unsafeRunPromiseExit;
/** @internal */
class RuntimeImpl {
  context;
  runtimeFlags;
  fiberRefs;
  constructor(context, runtimeFlags, fiberRefs) {
    this.context = context;
    this.runtimeFlags = runtimeFlags;
    this.fiberRefs = fiberRefs;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.RuntimeImpl = RuntimeImpl;
/** @internal */
const make = options => new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs);
exports.make = make;
/** @internal */
const runtime = () => core.withFiberRuntime((state, status) => core.succeed(new RuntimeImpl(state.getFiberRef(core.currentContext), status.runtimeFlags, state.getFiberRefs())));
exports.runtime = runtime;
/** @internal */
exports.defaultRuntimeFlags = /*#__PURE__*/runtimeFlags.make(runtimeFlags.Interruption, runtimeFlags.CooperativeYielding, runtimeFlags.RuntimeMetrics);
/** @internal */
exports.defaultRuntime = /*#__PURE__*/(0, exports.make)({
  context: /*#__PURE__*/Context.empty(),
  runtimeFlags: exports.defaultRuntimeFlags,
  fiberRefs: /*#__PURE__*/FiberRefs.empty()
});
/** @internal */
exports.unsafeRunEffect = /*#__PURE__*/(0, exports.unsafeRunCallback)(exports.defaultRuntime);
/** @internal */
exports.unsafeForkEffect = /*#__PURE__*/(0, exports.unsafeFork)(exports.defaultRuntime);
/** @internal */
exports.unsafeRunPromiseEffect = /*#__PURE__*/(0, exports.unsafeRunPromise)(exports.defaultRuntime);
/** @internal */
exports.unsafeRunPromiseExitEffect = /*#__PURE__*/(0, exports.unsafeRunPromiseExit)(exports.defaultRuntime);
/** @internal */
exports.unsafeRunSyncEffect = /*#__PURE__*/(0, exports.unsafeRunSync)(exports.defaultRuntime);
/** @internal */
exports.unsafeRunSyncExitEffect = /*#__PURE__*/(0, exports.unsafeRunSyncExit)(exports.defaultRuntime);
// circular with Effect
/** @internal */
const asyncEffect = register => core.flatMap(core.deferredMake(), deferred => core.flatMap((0, exports.runtime)(), runtime => core.uninterruptibleMask(restore => core.zipRight(FiberRuntime.fork(restore(core.catchAllCause(register(cb => (0, exports.unsafeRunCallback)(runtime)(core.intoDeferred(cb, deferred))), cause => core.deferredFailCause(deferred, cause)))), restore(core.deferredAwait(deferred))))));
exports.asyncEffect = asyncEffect;
//# sourceMappingURL=runtime.js.map