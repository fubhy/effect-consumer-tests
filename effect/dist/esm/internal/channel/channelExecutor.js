import * as Cause from "../../Cause.js";
import * as Deferred from "../../Deferred.js";
import * as Effect from "../../Effect.js";
import * as ExecutionStrategy from "../../ExecutionStrategy.js";
import * as Exit from "../../Exit.js";
import * as Fiber from "../../Fiber.js";
import { identity, pipe } from "../../Function.js";
import * as Option from "../../Option.js";
import * as Scope from "../../Scope.js";
import * as core from "../core-stream.js";
import * as ChannelOpCodes from "../opCodes/channel.js";
import * as ChildExecutorDecisionOpCodes from "../opCodes/channelChildExecutorDecision.js";
import * as ChannelStateOpCodes from "../opCodes/channelState.js";
import * as UpstreamPullStrategyOpCodes from "../opCodes/channelUpstreamPullStrategy.js";
import * as ContinuationOpCodes from "../opCodes/continuation.js";
import * as ChannelState from "./channelState.js";
import * as Continuation from "./continuation.js";
import * as Subexecutor from "./subexecutor.js";
import * as upstreamPullRequest from "./upstreamPullRequest.js";
export class ChannelExecutor {
  _activeSubexecutor = undefined;
  _cancelled = undefined;
  _closeLastSubstream = undefined;
  _currentChannel;
  _done = undefined;
  _doneStack = [];
  _emitted = undefined;
  _executeCloseLastSubstream;
  _input = undefined;
  _inProgressFinalizer = undefined;
  _providedEnv;
  constructor(initialChannel, providedEnv, executeCloseLastSubstream) {
    this._currentChannel = initialChannel;
    this._executeCloseLastSubstream = executeCloseLastSubstream;
    this._providedEnv = providedEnv;
  }
  run() {
    let result = undefined;
    while (result === undefined) {
      if (this._cancelled !== undefined) {
        result = this.processCancellation();
      } else if (this._activeSubexecutor !== undefined) {
        result = this.runSubexecutor();
      } else {
        try {
          if (this._currentChannel === undefined) {
            result = ChannelState.Done();
          } else {
            if (Effect.isEffect(this._currentChannel)) {
              this._currentChannel = core.fromEffect(this._currentChannel);
            } else {
              switch (this._currentChannel._tag) {
                case ChannelOpCodes.OP_BRACKET_OUT:
                  {
                    result = this.runBracketOut(this._currentChannel);
                    break;
                  }
                case ChannelOpCodes.OP_BRIDGE:
                  {
                    const bridgeInput = this._currentChannel.input;
                    // PipeTo(left, Bridge(queue, channel))
                    // In a fiber: repeatedly run left and push its outputs to the queue
                    // Add a finalizer to interrupt the fiber and close the executor
                    this._currentChannel = this._currentChannel.channel;
                    if (this._input !== undefined) {
                      const inputExecutor = this._input;
                      this._input = undefined;
                      const drainer = () => Effect.flatMap(bridgeInput.awaitRead(), () => Effect.suspend(() => {
                        const state = inputExecutor.run();
                        switch (state._tag) {
                          case ChannelStateOpCodes.OP_DONE:
                            {
                              return Exit.match(inputExecutor.getDone(), {
                                onFailure: cause => bridgeInput.error(cause),
                                onSuccess: value => bridgeInput.done(value)
                              });
                            }
                          case ChannelStateOpCodes.OP_EMIT:
                            {
                              return Effect.flatMap(bridgeInput.emit(inputExecutor.getEmit()), () => drainer());
                            }
                          case ChannelStateOpCodes.OP_FROM_EFFECT:
                            {
                              return Effect.matchCauseEffect(state.effect, {
                                onFailure: cause => bridgeInput.error(cause),
                                onSuccess: () => drainer()
                              });
                            }
                          case ChannelStateOpCodes.OP_READ:
                            {
                              return readUpstream(state, () => drainer(), cause => bridgeInput.error(cause));
                            }
                        }
                      }));
                      result = ChannelState.FromEffect(Effect.flatMap(Effect.forkDaemon(drainer()), fiber => Effect.sync(() => this.addFinalizer(exit => Effect.flatMap(Fiber.interrupt(fiber), () => Effect.suspend(() => {
                        const effect = this.restorePipe(exit, inputExecutor);
                        return effect !== undefined ? effect : Effect.unit;
                      }))))));
                    }
                    break;
                  }
                case ChannelOpCodes.OP_CONCAT_ALL:
                  {
                    const executor = new ChannelExecutor(this._currentChannel.value(), this._providedEnv, effect => Effect.sync(() => {
                      const prevLastClose = this._closeLastSubstream === undefined ? Effect.unit : this._closeLastSubstream;
                      this._closeLastSubstream = pipe(prevLastClose, Effect.zipRight(effect));
                    }));
                    executor._input = this._input;
                    const channel = this._currentChannel;
                    this._activeSubexecutor = new Subexecutor.PullFromUpstream(executor, value => channel.k(value), undefined, [], (x, y) => channel.combineInners(x, y), (x, y) => channel.combineAll(x, y), request => channel.onPull(request), value => channel.onEmit(value));
                    this._closeLastSubstream = undefined;
                    this._currentChannel = undefined;
                    break;
                  }
                case ChannelOpCodes.OP_EMIT:
                  {
                    this._emitted = this._currentChannel.out;
                    this._currentChannel = this._activeSubexecutor !== undefined ? undefined : core.unit;
                    result = ChannelState.Emit();
                    break;
                  }
                case ChannelOpCodes.OP_ENSURING:
                  {
                    this.runEnsuring(this._currentChannel);
                    break;
                  }
                case ChannelOpCodes.OP_FAIL:
                  {
                    result = this.doneHalt(this._currentChannel.error());
                    break;
                  }
                case ChannelOpCodes.OP_FOLD:
                  {
                    this._doneStack.push(this._currentChannel.k);
                    this._currentChannel = this._currentChannel.channel;
                    break;
                  }
                case ChannelOpCodes.OP_FROM_EFFECT:
                  {
                    const effect = this._providedEnv === undefined ? this._currentChannel.effect() : pipe(this._currentChannel.effect(), Effect.provide(this._providedEnv));
                    result = ChannelState.FromEffect(Effect.matchCauseEffect(effect, {
                      onFailure: cause => {
                        const state = this.doneHalt(cause);
                        return state !== undefined && ChannelState.isFromEffect(state) ? state.effect : Effect.unit;
                      },
                      onSuccess: value => {
                        const state = this.doneSucceed(value);
                        return state !== undefined && ChannelState.isFromEffect(state) ? state.effect : Effect.unit;
                      }
                    }));
                    break;
                  }
                case ChannelOpCodes.OP_PIPE_TO:
                  {
                    const previousInput = this._input;
                    const leftExec = new ChannelExecutor(this._currentChannel.left(), this._providedEnv, effect => this._executeCloseLastSubstream(effect));
                    leftExec._input = previousInput;
                    this._input = leftExec;
                    this.addFinalizer(exit => {
                      const effect = this.restorePipe(exit, previousInput);
                      return effect !== undefined ? effect : Effect.unit;
                    });
                    this._currentChannel = this._currentChannel.right();
                    break;
                  }
                case ChannelOpCodes.OP_PROVIDE:
                  {
                    const previousEnv = this._providedEnv;
                    this._providedEnv = this._currentChannel.context();
                    this._currentChannel = this._currentChannel.inner;
                    this.addFinalizer(() => Effect.sync(() => {
                      this._providedEnv = previousEnv;
                    }));
                    break;
                  }
                case ChannelOpCodes.OP_READ:
                  {
                    const read = this._currentChannel;
                    result = ChannelState.Read(this._input, identity, emitted => {
                      try {
                        this._currentChannel = read.more(emitted);
                      } catch (error) {
                        this._currentChannel = read.done.onExit(Exit.die(error));
                      }
                      return undefined;
                    }, exit => {
                      const onExit = exit => {
                        return read.done.onExit(exit);
                      };
                      this._currentChannel = onExit(exit);
                      return undefined;
                    });
                    break;
                  }
                case ChannelOpCodes.OP_SUCCEED:
                  {
                    result = this.doneSucceed(this._currentChannel.evaluate());
                    break;
                  }
                case ChannelOpCodes.OP_SUCCEED_NOW:
                  {
                    result = this.doneSucceed(this._currentChannel.terminal);
                    break;
                  }
                case ChannelOpCodes.OP_SUSPEND:
                  {
                    this._currentChannel = this._currentChannel.channel();
                    break;
                  }
                default:
                  {
                    // @ts-expect-error
                    this._currentChannel._tag;
                  }
              }
            }
          }
        } catch (error) {
          this._currentChannel = core.failCause(Cause.die(error));
        }
      }
    }
    return result;
  }
  getDone() {
    return this._done;
  }
  getEmit() {
    return this._emitted;
  }
  cancelWith(exit) {
    this._cancelled = exit;
  }
  clearInProgressFinalizer() {
    this._inProgressFinalizer = undefined;
  }
  storeInProgressFinalizer(finalizer) {
    this._inProgressFinalizer = finalizer;
  }
  popAllFinalizers(exit) {
    const finalizers = [];
    let next = this._doneStack.pop();
    while (next) {
      if (next._tag === "ContinuationFinalizer") {
        finalizers.push(next.finalizer);
      }
      next = this._doneStack.pop();
    }
    const effect = finalizers.length === 0 ? Effect.unit : runFinalizers(finalizers, exit);
    this.storeInProgressFinalizer(effect);
    return effect;
  }
  popNextFinalizers() {
    const builder = [];
    while (this._doneStack.length !== 0) {
      const cont = this._doneStack[this._doneStack.length - 1];
      if (cont._tag === ContinuationOpCodes.OP_CONTINUATION_K) {
        return builder;
      }
      builder.push(cont);
      this._doneStack.pop();
    }
    return builder;
  }
  restorePipe(exit, prev) {
    const currInput = this._input;
    this._input = prev;
    if (currInput !== undefined) {
      const effect = currInput.close(exit);
      return effect;
    }
    return Effect.unit;
  }
  close(exit) {
    let runInProgressFinalizers = undefined;
    const finalizer = this._inProgressFinalizer;
    if (finalizer !== undefined) {
      runInProgressFinalizers = pipe(finalizer, Effect.ensuring(Effect.sync(() => this.clearInProgressFinalizer())));
    }
    let closeSelf = undefined;
    const selfFinalizers = this.popAllFinalizers(exit);
    if (selfFinalizers !== undefined) {
      closeSelf = pipe(selfFinalizers, Effect.ensuring(Effect.sync(() => this.clearInProgressFinalizer())));
    }
    const closeSubexecutors = this._activeSubexecutor === undefined ? undefined : this._activeSubexecutor.close(exit);
    if (closeSubexecutors === undefined && runInProgressFinalizers === undefined && closeSelf === undefined) {
      return undefined;
    }
    return pipe(Effect.exit(ifNotNull(closeSubexecutors)), Effect.zip(Effect.exit(ifNotNull(runInProgressFinalizers))), Effect.zip(Effect.exit(ifNotNull(closeSelf))), Effect.map(([[exit1, exit2], exit3]) => pipe(exit1, Exit.zipRight(exit2), Exit.zipRight(exit3))), Effect.uninterruptible,
    // TODO: remove
    Effect.flatMap(exit => Effect.suspend(() => exit)));
  }
  doneSucceed(value) {
    if (this._doneStack.length === 0) {
      this._done = Exit.succeed(value);
      this._currentChannel = undefined;
      return ChannelState.Done();
    }
    const head = this._doneStack[this._doneStack.length - 1];
    if (head._tag === ContinuationOpCodes.OP_CONTINUATION_K) {
      this._doneStack.pop();
      this._currentChannel = head.onSuccess(value);
      return undefined;
    }
    const finalizers = this.popNextFinalizers();
    if (this._doneStack.length === 0) {
      this._doneStack = finalizers.reverse();
      this._done = Exit.succeed(value);
      this._currentChannel = undefined;
      return ChannelState.Done();
    }
    const finalizerEffect = runFinalizers(finalizers.map(f => f.finalizer), Exit.succeed(value));
    this.storeInProgressFinalizer(finalizerEffect);
    const effect = pipe(finalizerEffect, Effect.ensuring(Effect.sync(() => this.clearInProgressFinalizer())), Effect.uninterruptible, Effect.flatMap(() => Effect.sync(() => this.doneSucceed(value))));
    return ChannelState.FromEffect(effect);
  }
  doneHalt(cause) {
    if (this._doneStack.length === 0) {
      this._done = Exit.failCause(cause);
      this._currentChannel = undefined;
      return ChannelState.Done();
    }
    const head = this._doneStack[this._doneStack.length - 1];
    if (head._tag === ContinuationOpCodes.OP_CONTINUATION_K) {
      this._doneStack.pop();
      this._currentChannel = head.onHalt(cause);
      return undefined;
    }
    const finalizers = this.popNextFinalizers();
    if (this._doneStack.length === 0) {
      this._doneStack = finalizers.reverse();
      this._done = Exit.failCause(cause);
      this._currentChannel = undefined;
      return ChannelState.Done();
    }
    const finalizerEffect = runFinalizers(finalizers.map(f => f.finalizer), Exit.failCause(cause));
    this.storeInProgressFinalizer(finalizerEffect);
    const effect = pipe(finalizerEffect, Effect.ensuring(Effect.sync(() => this.clearInProgressFinalizer())), Effect.uninterruptible, Effect.flatMap(() => Effect.sync(() => this.doneHalt(cause))));
    return ChannelState.FromEffect(effect);
  }
  processCancellation() {
    this._currentChannel = undefined;
    this._done = this._cancelled;
    this._cancelled = undefined;
    return ChannelState.Done();
  }
  runBracketOut(bracketOut) {
    const effect = Effect.uninterruptible(Effect.matchCauseEffect(this.provide(bracketOut.acquire()), {
      onFailure: cause => Effect.sync(() => {
        this._currentChannel = core.failCause(cause);
      }),
      onSuccess: out => Effect.sync(() => {
        this.addFinalizer(exit => this.provide(bracketOut.finalizer(out, exit)));
        this._currentChannel = core.write(out);
      })
    }));
    return ChannelState.FromEffect(effect);
  }
  provide(effect) {
    if (this._providedEnv === undefined) {
      return effect;
    }
    return pipe(effect, Effect.provide(this._providedEnv));
  }
  runEnsuring(ensuring) {
    this.addFinalizer(ensuring.finalizer);
    this._currentChannel = ensuring.channel;
  }
  addFinalizer(f) {
    this._doneStack.push(new Continuation.ContinuationFinalizerImpl(f));
  }
  runSubexecutor() {
    const subexecutor = this._activeSubexecutor;
    switch (subexecutor._tag) {
      case Subexecutor.OP_PULL_FROM_CHILD:
        {
          return this.pullFromChild(subexecutor.childExecutor, subexecutor.parentSubexecutor, subexecutor.onEmit, subexecutor);
        }
      case Subexecutor.OP_PULL_FROM_UPSTREAM:
        {
          return this.pullFromUpstream(subexecutor);
        }
      case Subexecutor.OP_DRAIN_CHILD_EXECUTORS:
        {
          return this.drainChildExecutors(subexecutor);
        }
      case Subexecutor.OP_EMIT:
        {
          this._emitted = subexecutor.value;
          this._activeSubexecutor = subexecutor.next;
          return ChannelState.Emit();
        }
    }
  }
  replaceSubexecutor(nextSubExec) {
    this._currentChannel = undefined;
    this._activeSubexecutor = nextSubExec;
  }
  finishWithExit(exit) {
    const state = Exit.match(exit, {
      onFailure: cause => this.doneHalt(cause),
      onSuccess: value => this.doneSucceed(value)
    });
    this._activeSubexecutor = undefined;
    return state === undefined ? Effect.unit : ChannelState.effect(state);
  }
  finishSubexecutorWithCloseEffect(subexecutorDone, ...closeFuncs) {
    this.addFinalizer(() => pipe(closeFuncs, Effect.forEach(closeFunc => pipe(Effect.sync(() => closeFunc(subexecutorDone)), Effect.flatMap(closeEffect => closeEffect !== undefined ? closeEffect : Effect.unit)), {
      discard: true
    })));
    const state = pipe(subexecutorDone, Exit.match({
      onFailure: cause => this.doneHalt(cause),
      onSuccess: value => this.doneSucceed(value)
    }));
    this._activeSubexecutor = undefined;
    return state;
  }
  applyUpstreamPullStrategy(upstreamFinished, queue, strategy) {
    switch (strategy._tag) {
      case UpstreamPullStrategyOpCodes.OP_PULL_AFTER_NEXT:
        {
          const shouldPrepend = !upstreamFinished || queue.some(subexecutor => subexecutor !== undefined);
          return [strategy.emitSeparator, shouldPrepend ? [undefined, ...queue] : queue];
        }
      case UpstreamPullStrategyOpCodes.OP_PULL_AFTER_ALL_ENQUEUED:
        {
          const shouldEnqueue = !upstreamFinished || queue.some(subexecutor => subexecutor !== undefined);
          return [strategy.emitSeparator, shouldEnqueue ? [...queue, undefined] : queue];
        }
    }
  }
  pullFromChild(childExecutor, parentSubexecutor, onEmitted, subexecutor) {
    return ChannelState.Read(childExecutor, identity, emitted => {
      const childExecutorDecision = onEmitted(emitted);
      switch (childExecutorDecision._tag) {
        case ChildExecutorDecisionOpCodes.OP_CONTINUE:
          {
            break;
          }
        case ChildExecutorDecisionOpCodes.OP_CLOSE:
          {
            this.finishWithDoneValue(childExecutor, parentSubexecutor, childExecutorDecision.value);
            break;
          }
        case ChildExecutorDecisionOpCodes.OP_YIELD:
          {
            const modifiedParent = parentSubexecutor.enqueuePullFromChild(subexecutor);
            this.replaceSubexecutor(modifiedParent);
            break;
          }
      }
      this._activeSubexecutor = new Subexecutor.Emit(emitted, this._activeSubexecutor);
      return undefined;
    }, Exit.match({
      onFailure: cause => {
        const state = this.handleSubexecutorFailure(childExecutor, parentSubexecutor, cause);
        return state === undefined ? undefined : ChannelState.effectOrUndefinedIgnored(state);
      },
      onSuccess: doneValue => {
        this.finishWithDoneValue(childExecutor, parentSubexecutor, doneValue);
        return undefined;
      }
    }));
  }
  finishWithDoneValue(childExecutor, parentSubexecutor, doneValue) {
    const subexecutor = parentSubexecutor;
    switch (subexecutor._tag) {
      case Subexecutor.OP_PULL_FROM_UPSTREAM:
        {
          const modifiedParent = new Subexecutor.PullFromUpstream(subexecutor.upstreamExecutor, subexecutor.createChild, subexecutor.lastDone !== undefined ? subexecutor.combineChildResults(subexecutor.lastDone, doneValue) : doneValue, subexecutor.activeChildExecutors, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull, subexecutor.onEmit);
          this._closeLastSubstream = childExecutor.close(Exit.succeed(doneValue));
          this.replaceSubexecutor(modifiedParent);
          break;
        }
      case Subexecutor.OP_DRAIN_CHILD_EXECUTORS:
        {
          const modifiedParent = new Subexecutor.DrainChildExecutors(subexecutor.upstreamExecutor, subexecutor.lastDone !== undefined ? subexecutor.combineChildResults(subexecutor.lastDone, doneValue) : doneValue, subexecutor.activeChildExecutors, subexecutor.upstreamDone, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull);
          this._closeLastSubstream = childExecutor.close(Exit.succeed(doneValue));
          this.replaceSubexecutor(modifiedParent);
          break;
        }
      default:
        {
          break;
        }
    }
  }
  handleSubexecutorFailure(childExecutor, parentSubexecutor, cause) {
    return this.finishSubexecutorWithCloseEffect(Exit.failCause(cause), exit => parentSubexecutor.close(exit), exit => childExecutor.close(exit));
  }
  pullFromUpstream(subexecutor) {
    if (subexecutor.activeChildExecutors.length === 0) {
      return this.performPullFromUpstream(subexecutor);
    }
    const activeChild = subexecutor.activeChildExecutors[0];
    const parentSubexecutor = new Subexecutor.PullFromUpstream(subexecutor.upstreamExecutor, subexecutor.createChild, subexecutor.lastDone, subexecutor.activeChildExecutors.slice(1), subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull, subexecutor.onEmit);
    if (activeChild === undefined) {
      return this.performPullFromUpstream(parentSubexecutor);
    }
    this.replaceSubexecutor(new Subexecutor.PullFromChild(activeChild.childExecutor, parentSubexecutor, activeChild.onEmit));
    return undefined;
  }
  performPullFromUpstream(subexecutor) {
    return ChannelState.Read(subexecutor.upstreamExecutor, effect => {
      const closeLastSubstream = this._closeLastSubstream === undefined ? Effect.unit : this._closeLastSubstream;
      this._closeLastSubstream = undefined;
      return pipe(this._executeCloseLastSubstream(closeLastSubstream), Effect.zipRight(effect));
    }, emitted => {
      if (this._closeLastSubstream !== undefined) {
        const closeLastSubstream = this._closeLastSubstream;
        this._closeLastSubstream = undefined;
        return pipe(this._executeCloseLastSubstream(closeLastSubstream), Effect.map(() => {
          const childExecutor = new ChannelExecutor(subexecutor.createChild(emitted), this._providedEnv, this._executeCloseLastSubstream);
          childExecutor._input = this._input;
          const [emitSeparator, updatedChildExecutors] = this.applyUpstreamPullStrategy(false, subexecutor.activeChildExecutors, subexecutor.onPull(upstreamPullRequest.Pulled(emitted)));
          this._activeSubexecutor = new Subexecutor.PullFromChild(childExecutor, new Subexecutor.PullFromUpstream(subexecutor.upstreamExecutor, subexecutor.createChild, subexecutor.lastDone, updatedChildExecutors, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull, subexecutor.onEmit), subexecutor.onEmit);
          if (Option.isSome(emitSeparator)) {
            this._activeSubexecutor = new Subexecutor.Emit(emitSeparator.value, this._activeSubexecutor);
          }
          return undefined;
        }));
      }
      const childExecutor = new ChannelExecutor(subexecutor.createChild(emitted), this._providedEnv, this._executeCloseLastSubstream);
      childExecutor._input = this._input;
      const [emitSeparator, updatedChildExecutors] = this.applyUpstreamPullStrategy(false, subexecutor.activeChildExecutors, subexecutor.onPull(upstreamPullRequest.Pulled(emitted)));
      this._activeSubexecutor = new Subexecutor.PullFromChild(childExecutor, new Subexecutor.PullFromUpstream(subexecutor.upstreamExecutor, subexecutor.createChild, subexecutor.lastDone, updatedChildExecutors, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull, subexecutor.onEmit), subexecutor.onEmit);
      if (Option.isSome(emitSeparator)) {
        this._activeSubexecutor = new Subexecutor.Emit(emitSeparator.value, this._activeSubexecutor);
      }
      return undefined;
    }, exit => {
      if (subexecutor.activeChildExecutors.some(subexecutor => subexecutor !== undefined)) {
        const drain = new Subexecutor.DrainChildExecutors(subexecutor.upstreamExecutor, subexecutor.lastDone, [undefined, ...subexecutor.activeChildExecutors], subexecutor.upstreamExecutor.getDone(), subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull);
        if (this._closeLastSubstream !== undefined) {
          const closeLastSubstream = this._closeLastSubstream;
          this._closeLastSubstream = undefined;
          return pipe(this._executeCloseLastSubstream(closeLastSubstream), Effect.map(() => this.replaceSubexecutor(drain)));
        }
        this.replaceSubexecutor(drain);
        return undefined;
      }
      const closeLastSubstream = this._closeLastSubstream;
      const state = this.finishSubexecutorWithCloseEffect(pipe(exit, Exit.map(a => subexecutor.combineWithChildResult(subexecutor.lastDone, a))), () => closeLastSubstream, exit => subexecutor.upstreamExecutor.close(exit));
      return state === undefined ? undefined :
      // NOTE: assuming finalizers cannot fail
      ChannelState.effectOrUndefinedIgnored(state);
    });
  }
  drainChildExecutors(subexecutor) {
    if (subexecutor.activeChildExecutors.length === 0) {
      const lastClose = this._closeLastSubstream;
      if (lastClose !== undefined) {
        this.addFinalizer(() => Effect.succeed(lastClose));
      }
      return this.finishSubexecutorWithCloseEffect(subexecutor.upstreamDone, () => lastClose, exit => subexecutor.upstreamExecutor.close(exit));
    }
    const activeChild = subexecutor.activeChildExecutors[0];
    const rest = subexecutor.activeChildExecutors.slice(1);
    if (activeChild === undefined) {
      const [emitSeparator, remainingExecutors] = this.applyUpstreamPullStrategy(true, rest, subexecutor.onPull(upstreamPullRequest.NoUpstream(rest.reduce((n, curr) => curr !== undefined ? n + 1 : n, 0))));
      this.replaceSubexecutor(new Subexecutor.DrainChildExecutors(subexecutor.upstreamExecutor, subexecutor.lastDone, remainingExecutors, subexecutor.upstreamDone, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull));
      if (Option.isSome(emitSeparator)) {
        this._emitted = emitSeparator.value;
        return ChannelState.Emit();
      }
      return undefined;
    }
    const parentSubexecutor = new Subexecutor.DrainChildExecutors(subexecutor.upstreamExecutor, subexecutor.lastDone, rest, subexecutor.upstreamDone, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull);
    this.replaceSubexecutor(new Subexecutor.PullFromChild(activeChild.childExecutor, parentSubexecutor, activeChild.onEmit));
    return undefined;
  }
}
const ifNotNull = effect => effect !== undefined ? effect : Effect.unit;
const runFinalizers = (finalizers, exit) => {
  return pipe(Effect.forEach(finalizers, fin => Effect.exit(fin(exit))), Effect.map(exits => pipe(Exit.all(exits), Option.getOrElse(() => Exit.unit))), Effect.flatMap(exit => Effect.suspend(() => exit)));
};
/**
 * @internal
 */
export const readUpstream = (r, onSuccess, onFailure) => {
  const readStack = [r];
  const read = () => {
    const current = readStack.pop();
    if (current === undefined || current.upstream === undefined) {
      return Effect.dieMessage("Unexpected end of input for channel execution");
    }
    const state = current.upstream.run();
    switch (state._tag) {
      case ChannelStateOpCodes.OP_EMIT:
        {
          const emitEffect = current.onEmit(current.upstream.getEmit());
          if (readStack.length === 0) {
            if (emitEffect === undefined) {
              return Effect.suspend(onSuccess);
            }
            return pipe(emitEffect, Effect.matchCauseEffect({
              onFailure,
              onSuccess
            }));
          }
          if (emitEffect === undefined) {
            return Effect.suspend(() => read());
          }
          return pipe(emitEffect, Effect.matchCauseEffect({
            onFailure,
            onSuccess: () => read()
          }));
        }
      case ChannelStateOpCodes.OP_DONE:
        {
          const doneEffect = current.onDone(current.upstream.getDone());
          if (readStack.length === 0) {
            if (doneEffect === undefined) {
              return Effect.suspend(onSuccess);
            }
            return pipe(doneEffect, Effect.matchCauseEffect({
              onFailure,
              onSuccess
            }));
          }
          if (doneEffect === undefined) {
            return Effect.suspend(() => read());
          }
          return pipe(doneEffect, Effect.matchCauseEffect({
            onFailure,
            onSuccess: () => read()
          }));
        }
      case ChannelStateOpCodes.OP_FROM_EFFECT:
        {
          readStack.push(current);
          return pipe(current.onEffect(state.effect), Effect.catchAllCause(cause => Effect.suspend(() => {
            const doneEffect = current.onDone(Exit.failCause(cause));
            return doneEffect === undefined ? Effect.unit : doneEffect;
          })), Effect.matchCauseEffect({
            onFailure,
            onSuccess: () => read()
          }));
        }
      case ChannelStateOpCodes.OP_READ:
        {
          readStack.push(current);
          readStack.push(state);
          return Effect.suspend(() => read());
        }
    }
  };
  return read();
};
/** @internal */
export const run = self => pipe(runScoped(self), Effect.scoped);
/** @internal */
export const runScoped = self => {
  const run = (channelDeferred, scopeDeferred, scope) => Effect.acquireUseRelease(Effect.sync(() => new ChannelExecutor(self, void 0, identity)), exec => Effect.suspend(() => pipe(runScopedInterpret(exec.run(), exec), Effect.intoDeferred(channelDeferred), Effect.zipRight(Deferred.await(channelDeferred)), Effect.zipLeft(Deferred.await(scopeDeferred)))), (exec, exit) => {
    const finalize = exec.close(exit);
    if (finalize === undefined) {
      return Effect.unit;
    }
    return Effect.tapErrorCause(finalize, cause => Scope.addFinalizer(scope, Effect.failCause(cause)));
  });
  return Effect.uninterruptibleMask(restore => Effect.flatMap(Effect.scope, parent => pipe(Effect.all([Scope.fork(parent, ExecutionStrategy.sequential), Deferred.make(), Deferred.make()]), Effect.flatMap(([child, channelDeferred, scopeDeferred]) => pipe(Effect.forkScoped(restore(run(channelDeferred, scopeDeferred, child))), Effect.flatMap(fiber => pipe(Effect.addFinalizer(() => Deferred.succeed(scopeDeferred, void 0)), Effect.zipRight(restore(Deferred.await(channelDeferred))), Effect.zipLeft(Fiber.inheritAll(fiber)))))))));
};
/** @internal */
const runScopedInterpret = (channelState, exec) => {
  const op = channelState;
  switch (op._tag) {
    case ChannelStateOpCodes.OP_FROM_EFFECT:
      {
        return pipe(op.effect, Effect.flatMap(() => runScopedInterpret(exec.run(), exec)));
      }
    case ChannelStateOpCodes.OP_EMIT:
      {
        // Can't really happen because Out <:< Nothing. So just skip ahead.
        return runScopedInterpret(exec.run(), exec);
      }
    case ChannelStateOpCodes.OP_DONE:
      {
        return Effect.suspend(() => exec.getDone());
      }
    case ChannelStateOpCodes.OP_READ:
      {
        return readUpstream(op, () => runScopedInterpret(exec.run(), exec), Effect.failCause);
      }
  }
};
//# sourceMappingURL=channelExecutor.js.map