"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipWith = exports.zipRight = exports.zipLeft = exports.zip = exports.sync = exports.succeed = exports.retry = exports.orTry = exports.map = exports.interruptAs = exports.interrupt = exports.withSTMRuntime = exports.matchSTM = exports.flatMap = exports.failSync = exports.fail = exports.ensuring = exports.effect = exports.dieSync = exports.dieMessage = exports.die = exports.mapInputContext = exports.catchAll = exports.STMDriver = exports.contextWithSTM = exports.contextWith = exports.context = exports.unsafeAtomically = exports.commit = exports.isSTM = exports.STMTypeId = void 0;
const Cause = /*#__PURE__*/require("../../Cause.js");
const Context = /*#__PURE__*/require("../../Context.js");
const Effect = /*#__PURE__*/require("../../Effect.js");
const Either = /*#__PURE__*/require("../../Either.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Exit = /*#__PURE__*/require("../../Exit.js");
const FiberRef = /*#__PURE__*/require("../../FiberRef.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Hash = /*#__PURE__*/require("../../Hash.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const Stream_js_1 = /*#__PURE__*/require("../../Stream.js");
const core_stream_js_1 = /*#__PURE__*/require("../core-stream.js");
const core_js_1 = /*#__PURE__*/require("../core.js");
const effectable_js_1 = /*#__PURE__*/require("../effectable.js");
const effect_js_1 = /*#__PURE__*/require("../opCodes/effect.js");
const sink_js_1 = /*#__PURE__*/require("../sink.js");
const OpCodes = /*#__PURE__*/require("./opCodes/stm.js");
const TExitOpCodes = /*#__PURE__*/require("./opCodes/tExit.js");
const TryCommitOpCodes = /*#__PURE__*/require("./opCodes/tryCommit.js");
const Journal = /*#__PURE__*/require("./stm/journal.js");
const STMState = /*#__PURE__*/require("./stm/stmState.js");
const TExit = /*#__PURE__*/require("./stm/tExit.js");
const TryCommit = /*#__PURE__*/require("./stm/tryCommit.js");
const TxnId = /*#__PURE__*/require("./stm/txnId.js");
/** @internal */
const STMSymbolKey = "effect/STM";
/** @internal */
exports.STMTypeId = /*#__PURE__*/Symbol.for(STMSymbolKey);
/** @internal */
const stmVariance = {
  _R: _ => _,
  _E: _ => _,
  _A: _ => _
};
/** @internal */
class STMPrimitive {
  i0;
  _tag = effect_js_1.OP_COMMIT;
  _op = effect_js_1.OP_COMMIT;
  i1 = undefined;
  i2 = undefined;
  [Effect.EffectTypeId];
  [Stream_js_1.StreamTypeId];
  [sink_js_1.SinkTypeId];
  [core_stream_js_1.ChannelTypeId];
  get [exports.STMTypeId]() {
    return stmVariance;
  }
  constructor(i0) {
    this.i0 = i0;
    this[Effect.EffectTypeId] = effectable_js_1.effectVariance;
    this[Stream_js_1.StreamTypeId] = stmVariance;
    this[sink_js_1.SinkTypeId] = stmVariance;
    this[core_stream_js_1.ChannelTypeId] = stmVariance;
  }
  [Equal.symbol](that) {
    return this === that;
  }
  [Hash.symbol]() {
    return Hash.random(this);
  }
  commit() {
    return (0, exports.unsafeAtomically)(this, Function_js_1.constVoid, Function_js_1.constVoid);
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
const isSTM = u => (0, Predicate_js_1.hasProperty)(u, exports.STMTypeId);
exports.isSTM = isSTM;
/** @internal */
const commit = self => (0, exports.unsafeAtomically)(self, Function_js_1.constVoid, Function_js_1.constVoid);
exports.commit = commit;
/** @internal */
const unsafeAtomically = (self, onDone, onInterrupt) => (0, core_js_1.withFiberRuntime)(state => {
  const fiberId = state.id();
  const env = state.getFiberRef(FiberRef.currentContext);
  const scheduler = state.getFiberRef(FiberRef.currentScheduler);
  const priority = state.getFiberRef(FiberRef.currentSchedulingPriority);
  const commitResult = tryCommitSync(fiberId, self, env, scheduler, priority);
  switch (commitResult._tag) {
    case TryCommitOpCodes.OP_DONE:
      {
        onDone(commitResult.exit);
        return commitResult.exit;
      }
    case TryCommitOpCodes.OP_SUSPEND:
      {
        const txnId = TxnId.make();
        const state = {
          value: STMState.running
        };
        const effect = Effect.async(k => tryCommitAsync(fiberId, self, txnId, state, env, scheduler, priority, k));
        return Effect.uninterruptibleMask(restore => (0, Function_js_1.pipe)(restore(effect), Effect.catchAllCause(cause => {
          let currentState = state.value;
          if (STMState.isRunning(currentState)) {
            state.value = STMState.interrupted;
          }
          currentState = state.value;
          if (STMState.isDone(currentState)) {
            onDone(currentState.exit);
            return currentState.exit;
          }
          onInterrupt();
          return Effect.failCause(cause);
        })));
      }
  }
});
exports.unsafeAtomically = unsafeAtomically;
/** @internal */
const tryCommit = (fiberId, stm, state, env, scheduler, priority) => {
  const journal = new Map();
  const tExit = new STMDriver(stm, journal, fiberId, env).run();
  const analysis = Journal.analyzeJournal(journal);
  if (analysis === Journal.JournalAnalysisReadWrite) {
    Journal.commitJournal(journal);
  } else if (analysis === Journal.JournalAnalysisInvalid) {
    throw new Error("BUG: STM.TryCommit.tryCommit - please report an issue at https://github.com/Effect-TS/io/issues");
  }
  switch (tExit._tag) {
    case TExitOpCodes.OP_SUCCEED:
      {
        state.value = STMState.fromTExit(tExit);
        return completeTodos(Exit.succeed(tExit.value), journal, scheduler, priority);
      }
    case TExitOpCodes.OP_FAIL:
      {
        state.value = STMState.fromTExit(tExit);
        const cause = Cause.fail(tExit.error);
        return completeTodos(Exit.failCause(cause), journal, scheduler, priority);
      }
    case TExitOpCodes.OP_DIE:
      {
        state.value = STMState.fromTExit(tExit);
        const cause = Cause.die(tExit.defect);
        return completeTodos(Exit.failCause(cause), journal, scheduler, priority);
      }
    case TExitOpCodes.OP_INTERRUPT:
      {
        state.value = STMState.fromTExit(tExit);
        const cause = Cause.interrupt(fiberId);
        return completeTodos(Exit.failCause(cause), journal, scheduler, priority);
      }
    case TExitOpCodes.OP_RETRY:
      {
        return TryCommit.suspend(journal);
      }
  }
};
/** @internal */
const tryCommitSync = (fiberId, stm, env, scheduler, priority) => {
  const journal = new Map();
  const tExit = new STMDriver(stm, journal, fiberId, env).run();
  const analysis = Journal.analyzeJournal(journal);
  if (analysis === Journal.JournalAnalysisReadWrite && TExit.isSuccess(tExit)) {
    Journal.commitJournal(journal);
  } else if (analysis === Journal.JournalAnalysisInvalid) {
    throw new Error("BUG: STM.TryCommit.tryCommitSync - please report an issue at https://github.com/Effect-TS/io/issues");
  }
  switch (tExit._tag) {
    case TExitOpCodes.OP_SUCCEED:
      {
        return completeTodos(Exit.succeed(tExit.value), journal, scheduler, priority);
      }
    case TExitOpCodes.OP_FAIL:
      {
        const cause = Cause.fail(tExit.error);
        return completeTodos(Exit.failCause(cause), journal, scheduler, priority);
      }
    case TExitOpCodes.OP_DIE:
      {
        const cause = Cause.die(tExit.defect);
        return completeTodos(Exit.failCause(cause), journal, scheduler, priority);
      }
    case TExitOpCodes.OP_INTERRUPT:
      {
        const cause = Cause.interrupt(fiberId);
        return completeTodos(Exit.failCause(cause), journal, scheduler, priority);
      }
    case TExitOpCodes.OP_RETRY:
      {
        return TryCommit.suspend(journal);
      }
  }
};
/** @internal */
const tryCommitAsync = (fiberId, self, txnId, state, context, scheduler, priority, k) => {
  if (STMState.isRunning(state.value)) {
    const result = tryCommit(fiberId, self, state, context, scheduler, priority);
    switch (result._tag) {
      case TryCommitOpCodes.OP_DONE:
        {
          completeTryCommit(result.exit, k);
          break;
        }
      case TryCommitOpCodes.OP_SUSPEND:
        {
          Journal.addTodo(txnId, result.journal, () => tryCommitAsync(fiberId, self, txnId, state, context, scheduler, priority, k));
          break;
        }
    }
  }
};
/** @internal */
const completeTodos = (exit, journal, scheduler, priority) => {
  const todos = Journal.collectTodos(journal);
  if (todos.size > 0) {
    scheduler.scheduleTask(() => Journal.execTodos(todos), priority);
  }
  return TryCommit.done(exit);
};
/** @internal */
const completeTryCommit = (exit, k) => {
  k(exit);
};
/** @internal */
const context = () => (0, exports.effect)((_, __, env) => env);
exports.context = context;
/** @internal */
const contextWith = f => (0, exports.map)((0, exports.context)(), f);
exports.contextWith = contextWith;
/** @internal */
const contextWithSTM = f => (0, exports.flatMap)((0, exports.context)(), f);
exports.contextWithSTM = contextWithSTM;
/** @internal */
class STMDriver {
  self;
  journal;
  fiberId;
  contStack = [];
  env;
  constructor(self, journal, fiberId, r0) {
    this.self = self;
    this.journal = journal;
    this.fiberId = fiberId;
    this.env = r0;
  }
  getEnv() {
    return this.env;
  }
  pushStack(cont) {
    this.contStack.push(cont);
  }
  popStack() {
    return this.contStack.pop();
  }
  nextSuccess() {
    let current = this.popStack();
    while (current !== undefined && current.i0 !== OpCodes.OP_ON_SUCCESS) {
      current = this.popStack();
    }
    return current;
  }
  nextFailure() {
    let current = this.popStack();
    while (current !== undefined && current.i0 !== OpCodes.OP_ON_FAILURE) {
      current = this.popStack();
    }
    return current;
  }
  nextRetry() {
    let current = this.popStack();
    while (current !== undefined && current.i0 !== OpCodes.OP_ON_RETRY) {
      current = this.popStack();
    }
    return current;
  }
  run() {
    let curr = this.self;
    let exit = undefined;
    while (exit === undefined && curr !== undefined) {
      try {
        const current = curr;
        if (current) {
          switch (current._tag) {
            case "Tag":
              {
                curr = (0, exports.effect)((_, __, env) => Context.unsafeGet(env, current));
                break;
              }
            case "Left":
              {
                curr = (0, exports.fail)(current.left);
                break;
              }
            case "None":
              {
                curr = (0, exports.fail)(Cause.NoSuchElementException());
                break;
              }
            case "Right":
              {
                curr = (0, exports.succeed)(current.right);
                break;
              }
            case "Some":
              {
                curr = (0, exports.succeed)(current.value);
                break;
              }
            case "Commit":
              {
                switch (current.i0) {
                  case OpCodes.OP_DIE:
                    {
                      exit = TExit.die(current.i1());
                      break;
                    }
                  case OpCodes.OP_FAIL:
                    {
                      const cont = this.nextFailure();
                      if (cont === undefined) {
                        exit = TExit.fail(current.i1());
                      } else {
                        curr = cont.i2(current.i1());
                      }
                      break;
                    }
                  case OpCodes.OP_RETRY:
                    {
                      const cont = this.nextRetry();
                      if (cont === undefined) {
                        exit = TExit.retry;
                      } else {
                        curr = cont.i2();
                      }
                      break;
                    }
                  case OpCodes.OP_INTERRUPT:
                    {
                      exit = TExit.interrupt(this.fiberId);
                      break;
                    }
                  case OpCodes.OP_WITH_STM_RUNTIME:
                    {
                      curr = current.i1(this);
                      break;
                    }
                  case OpCodes.OP_ON_SUCCESS:
                  case OpCodes.OP_ON_FAILURE:
                  case OpCodes.OP_ON_RETRY:
                    {
                      this.pushStack(current);
                      curr = current.i1;
                      break;
                    }
                  case OpCodes.OP_PROVIDE:
                    {
                      const env = this.env;
                      this.env = current.i2(env);
                      curr = (0, Function_js_1.pipe)(current.i1, (0, exports.ensuring)((0, exports.sync)(() => this.env = env)));
                      break;
                    }
                  case OpCodes.OP_SUCCEED:
                    {
                      const value = current.i1;
                      const cont = this.nextSuccess();
                      if (cont === undefined) {
                        exit = TExit.succeed(value);
                      } else {
                        curr = cont.i2(value);
                      }
                      break;
                    }
                  case OpCodes.OP_SYNC:
                    {
                      const value = current.i1();
                      const cont = this.nextSuccess();
                      if (cont === undefined) {
                        exit = TExit.succeed(value);
                      } else {
                        curr = cont.i2(value);
                      }
                      break;
                    }
                }
                break;
              }
          }
        }
      } catch (e) {
        curr = (0, exports.die)(e);
      }
    }
    return exit;
  }
}
exports.STMDriver = STMDriver;
/** @internal */
exports.catchAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const stm = new STMPrimitive(OpCodes.OP_ON_FAILURE);
  stm.i1 = self;
  stm.i2 = f;
  return stm;
});
/** @internal */
exports.mapInputContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const stm = new STMPrimitive(OpCodes.OP_PROVIDE);
  stm.i1 = self;
  stm.i2 = f;
  return stm;
});
/** @internal */
const die = defect => (0, exports.dieSync)(() => defect);
exports.die = die;
/** @internal */
const dieMessage = message => (0, exports.dieSync)(() => Cause.RuntimeException(message));
exports.dieMessage = dieMessage;
/** @internal */
const dieSync = evaluate => {
  const stm = new STMPrimitive(OpCodes.OP_DIE);
  stm.i1 = evaluate;
  return stm;
};
exports.dieSync = dieSync;
/** @internal */
const effect = f => (0, exports.withSTMRuntime)(_ => (0, exports.succeed)(f(_.journal, _.fiberId, _.getEnv())));
exports.effect = effect;
/** @internal */
exports.ensuring = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => (0, exports.matchSTM)(self, {
  onFailure: e => (0, exports.zipRight)(finalizer, (0, exports.fail)(e)),
  onSuccess: a => (0, exports.zipRight)(finalizer, (0, exports.succeed)(a))
}));
/** @internal */
const fail = error => (0, exports.failSync)(() => error);
exports.fail = fail;
/** @internal */
const failSync = evaluate => {
  const stm = new STMPrimitive(OpCodes.OP_FAIL);
  stm.i1 = evaluate;
  return stm;
};
exports.failSync = failSync;
/** @internal */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const stm = new STMPrimitive(OpCodes.OP_ON_SUCCESS);
  stm.i1 = self;
  stm.i2 = f;
  return stm;
});
/** @internal */
exports.matchSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => (0, Function_js_1.pipe)(self, (0, exports.map)(Either.right), (0, exports.catchAll)(e => (0, Function_js_1.pipe)(onFailure(e), (0, exports.map)(Either.left))), (0, exports.flatMap)(either => {
  switch (either._tag) {
    case "Left":
      {
        return (0, exports.succeed)(either.left);
      }
    case "Right":
      {
        return onSuccess(either.right);
      }
  }
})));
/** @internal */
const withSTMRuntime = f => {
  const stm = new STMPrimitive(OpCodes.OP_WITH_STM_RUNTIME);
  stm.i1 = f;
  return stm;
};
exports.withSTMRuntime = withSTMRuntime;
/** @internal */
exports.interrupt = /*#__PURE__*/(0, exports.withSTMRuntime)(_ => {
  const stm = new STMPrimitive(OpCodes.OP_INTERRUPT);
  stm.i1 = _.fiberId;
  return stm;
});
/** @internal */
const interruptAs = fiberId => {
  const stm = new STMPrimitive(OpCodes.OP_INTERRUPT);
  stm.i1 = fiberId;
  return stm;
};
exports.interruptAs = interruptAs;
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.flatMap)(a => (0, exports.sync)(() => f(a)))));
/** @internal */
exports.orTry = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  const stm = new STMPrimitive(OpCodes.OP_ON_RETRY);
  stm.i1 = self;
  stm.i2 = that;
  return stm;
});
/** @internal */
exports.retry = /*#__PURE__*/new STMPrimitive(OpCodes.OP_RETRY);
/** @internal */
const succeed = value => {
  const stm = new STMPrimitive(OpCodes.OP_SUCCEED);
  stm.i1 = value;
  return stm;
};
exports.succeed = succeed;
/** @internal */
const sync = evaluate => {
  const stm = new STMPrimitive(OpCodes.OP_SYNC);
  stm.i1 = evaluate;
  return stm;
};
exports.sync = sync;
/** @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.zipWith)(that, (a, a1) => [a, a1])));
/** @internal */
exports.zipLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.flatMap)(a => (0, Function_js_1.pipe)(that, (0, exports.map)(() => a)))));
/** @internal */
exports.zipRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, Function_js_1.pipe)(self, (0, exports.flatMap)(() => that)));
/** @internal */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, Function_js_1.pipe)(self, (0, exports.flatMap)(a => (0, Function_js_1.pipe)(that, (0, exports.map)(b => f(a, b))))));
//# sourceMappingURL=core.js.map