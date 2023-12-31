import * as Context from "../Context.js";
import * as Exit from "../Exit.js";
import * as Fiber from "../Fiber.js";
import * as FiberId from "../FiberId.js";
import * as FiberRefs from "../FiberRefs.js";
import { pipe } from "../Function.js";
import { NodeInspectSymbol, toString } from "../Inspectable.js";
import * as Option from "../Option.js";
import { pipeArguments } from "../Pipeable.js";
import * as Predicate from "../Predicate.js";
import * as _scheduler from "../Scheduler.js";
import { NoSuchElementException } from "./cause.js";
import * as InternalCause from "./cause.js";
import * as core from "./core.js";
import * as FiberRuntime from "./fiberRuntime.js";
import * as fiberScope from "./fiberScope.js";
import * as OpCodes from "./opCodes/effect.js";
import * as runtimeFlags from "./runtimeFlags.js";
import * as _supervisor from "./supervisor.js";
/** @internal */
export const unsafeFork = runtime => (self, options) => {
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
/** @internal */
export const unsafeRunCallback = runtime => (effect, onExit) => {
  const fiberRuntime = unsafeFork(runtime)(effect);
  if (onExit) {
    fiberRuntime.addObserver(exit => {
      onExit(exit);
    });
  }
  return (id, onExitInterrupt) => unsafeRunCallback(runtime)(pipe(fiberRuntime, Fiber.interruptAs(id ?? FiberId.none)), onExitInterrupt ? exit => onExitInterrupt(Exit.flatten(exit)) : void 0);
};
/** @internal */
export const unsafeRunSync = runtime => effect => {
  const result = unsafeRunSyncExit(runtime)(effect);
  if (result._tag === "Failure") {
    throw fiberFailure(result.i0);
  } else {
    return result.i0;
  }
};
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
    [NodeInspectSymbol]: {
      get() {
        return () => message;
      }
    }
  });
  return error;
};
/** @internal */
export const isAsyncFiberException = u => Predicate.isTagged(u, "AsyncFiberException") && "fiber" in u;
/** @internal */
export const FiberFailureId = /*#__PURE__*/Symbol.for("effect/Runtime/FiberFailure");
/** @internal */
export const FiberFailureCauseId = /*#__PURE__*/Symbol.for("effect/Runtime/FiberFailure/Cause");
/** @internal */
export const fiberFailure = cause => {
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
  error[FiberFailureId] = FiberFailureId;
  error[FiberFailureCauseId] = cause;
  error.toJSON = () => {
    return {
      _id: "FiberFailure",
      cause: cause.toJSON()
    };
  };
  error.toString = () => {
    return toString(error.toJSON());
  };
  error[NodeInspectSymbol] = () => {
    return error.toJSON();
  };
  return error;
};
/** @internal */
export const isFiberFailure = u => Predicate.hasProperty(u, FiberFailureId);
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
        return core.exitFail(NoSuchElementException());
      }
  }
};
/** @internal */
export const unsafeRunSyncExit = runtime => effect => {
  const op = fastPath(effect);
  if (op) {
    return op;
  }
  const scheduler = new _scheduler.SyncScheduler();
  const fiberRuntime = unsafeFork(runtime)(effect, {
    scheduler
  });
  scheduler.flush();
  const result = fiberRuntime.unsafePoll();
  if (result) {
    return result;
  }
  throw asyncFiberException(fiberRuntime);
};
/** @internal */
export const unsafeRunPromise = runtime => effect => unsafeRunPromiseExit(runtime)(effect).then(result => {
  switch (result._tag) {
    case OpCodes.OP_SUCCESS:
      {
        return result.i0;
      }
    case OpCodes.OP_FAILURE:
      {
        throw fiberFailure(result.i0);
      }
  }
});
/** @internal */
export const unsafeRunPromiseExit = runtime => effect => new Promise(resolve => {
  const op = fastPath(effect);
  if (op) {
    resolve(op);
  }
  unsafeFork(runtime)(effect).addObserver(exit => {
    resolve(exit);
  });
});
/** @internal */
export class RuntimeImpl {
  context;
  runtimeFlags;
  fiberRefs;
  constructor(context, runtimeFlags, fiberRefs) {
    this.context = context;
    this.runtimeFlags = runtimeFlags;
    this.fiberRefs = fiberRefs;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
}
/** @internal */
export const make = options => new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs);
/** @internal */
export const runtime = () => core.withFiberRuntime((state, status) => core.succeed(new RuntimeImpl(state.getFiberRef(core.currentContext), status.runtimeFlags, state.getFiberRefs())));
/** @internal */
export const defaultRuntimeFlags = /*#__PURE__*/runtimeFlags.make(runtimeFlags.Interruption, runtimeFlags.CooperativeYielding, runtimeFlags.RuntimeMetrics);
/** @internal */
export const defaultRuntime = /*#__PURE__*/make({
  context: /*#__PURE__*/Context.empty(),
  runtimeFlags: defaultRuntimeFlags,
  fiberRefs: /*#__PURE__*/FiberRefs.empty()
});
/** @internal */
export const unsafeRunEffect = /*#__PURE__*/unsafeRunCallback(defaultRuntime);
/** @internal */
export const unsafeForkEffect = /*#__PURE__*/unsafeFork(defaultRuntime);
/** @internal */
export const unsafeRunPromiseEffect = /*#__PURE__*/unsafeRunPromise(defaultRuntime);
/** @internal */
export const unsafeRunPromiseExitEffect = /*#__PURE__*/unsafeRunPromiseExit(defaultRuntime);
/** @internal */
export const unsafeRunSyncEffect = /*#__PURE__*/unsafeRunSync(defaultRuntime);
/** @internal */
export const unsafeRunSyncExitEffect = /*#__PURE__*/unsafeRunSyncExit(defaultRuntime);
// circular with Effect
/** @internal */
export const asyncEffect = register => core.flatMap(core.deferredMake(), deferred => core.flatMap(runtime(), runtime => core.uninterruptibleMask(restore => core.zipRight(FiberRuntime.fork(restore(core.catchAllCause(register(cb => unsafeRunCallback(runtime)(core.intoDeferred(cb, deferred))), cause => core.deferredFailCause(deferred, cause)))), restore(core.deferredAwait(deferred))))));
//# sourceMappingURL=runtime.js.map