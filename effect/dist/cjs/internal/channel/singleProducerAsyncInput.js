"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = void 0;
const Cause = /*#__PURE__*/require("../../Cause.js");
const Deferred = /*#__PURE__*/require("../../Deferred.js");
const Effect = /*#__PURE__*/require("../../Effect.js");
const Either = /*#__PURE__*/require("../../Either.js");
const Exit = /*#__PURE__*/require("../../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Ref = /*#__PURE__*/require("../../Ref.js");
/** @internal */
const OP_STATE_EMPTY = "Empty";
/** @internal */
const OP_STATE_EMIT = "Emit";
/** @internal */
const OP_STATE_ERROR = "Error";
/** @internal */
const OP_STATE_DONE = "Done";
/** @internal */
const stateEmpty = notifyProducer => ({
  _tag: OP_STATE_EMPTY,
  notifyProducer
});
/** @internal */
const stateEmit = notifyConsumers => ({
  _tag: OP_STATE_EMIT,
  notifyConsumers
});
/** @internal */
const stateError = cause => ({
  _tag: OP_STATE_ERROR,
  cause
});
/** @internal */
const stateDone = done => ({
  _tag: OP_STATE_DONE,
  done
});
/** @internal */
class SingleProducerAsyncInputImpl {
  ref;
  constructor(ref) {
    this.ref = ref;
  }
  awaitRead() {
    return Effect.flatten(Ref.modify(this.ref, state => state._tag === OP_STATE_EMPTY ? [Deferred.await(state.notifyProducer), state] : [Effect.unit, state]));
  }
  close() {
    return Effect.fiberIdWith(fiberId => this.error(Cause.interrupt(fiberId)));
  }
  done(value) {
    return Effect.flatten(Ref.modify(this.ref, state => {
      switch (state._tag) {
        case OP_STATE_EMPTY:
          {
            return [Deferred.await(state.notifyProducer), state];
          }
        case OP_STATE_EMIT:
          {
            return [Effect.forEach(state.notifyConsumers, deferred => Deferred.succeed(deferred, Either.left(value)), {
              discard: true
            }), stateDone(value)];
          }
        case OP_STATE_ERROR:
          {
            return [Effect.interrupt, state];
          }
        case OP_STATE_DONE:
          {
            return [Effect.interrupt, state];
          }
      }
    }));
  }
  emit(element) {
    return Effect.flatMap(Deferred.make(), deferred => Effect.flatten(Ref.modify(this.ref, state => {
      switch (state._tag) {
        case OP_STATE_EMPTY:
          {
            return [Deferred.await(state.notifyProducer), state];
          }
        case OP_STATE_EMIT:
          {
            const notifyConsumer = state.notifyConsumers[0];
            const notifyConsumers = state.notifyConsumers.slice(1);
            if (notifyConsumer !== undefined) {
              return [Deferred.succeed(notifyConsumer, Either.right(element)), notifyConsumers.length === 0 ? stateEmpty(deferred) : stateEmit(notifyConsumers)];
            }
            throw new Error("Bug: Channel.SingleProducerAsyncInput.emit - Queue was empty! Please report an issue at https://github.com/Effect-TS/stream/issues");
          }
        case OP_STATE_ERROR:
          {
            return [Effect.interrupt, state];
          }
        case OP_STATE_DONE:
          {
            return [Effect.interrupt, state];
          }
      }
    })));
  }
  error(cause) {
    return Effect.flatten(Ref.modify(this.ref, state => {
      switch (state._tag) {
        case OP_STATE_EMPTY:
          {
            return [Deferred.await(state.notifyProducer), state];
          }
        case OP_STATE_EMIT:
          {
            return [Effect.forEach(state.notifyConsumers, deferred => Deferred.failCause(deferred, cause), {
              discard: true
            }), stateError(cause)];
          }
        case OP_STATE_ERROR:
          {
            return [Effect.interrupt, state];
          }
        case OP_STATE_DONE:
          {
            return [Effect.interrupt, state];
          }
      }
    }));
  }
  take() {
    return this.takeWith(cause => Exit.failCause(Cause.map(cause, Either.left)), elem => Exit.succeed(elem), done => Exit.fail(Either.right(done)));
  }
  takeWith(onError, onElement, onDone) {
    return Effect.flatMap(Deferred.make(), deferred => Effect.flatten(Ref.modify(this.ref, state => {
      switch (state._tag) {
        case OP_STATE_EMPTY:
          {
            return [Effect.zipRight(Deferred.succeed(state.notifyProducer, void 0), Effect.matchCause(Deferred.await(deferred), {
              onFailure: onError,
              onSuccess: Either.match({
                onLeft: onDone,
                onRight: onElement
              })
            })), stateEmit([deferred])];
          }
        case OP_STATE_EMIT:
          {
            return [Effect.matchCause(Deferred.await(deferred), {
              onFailure: onError,
              onSuccess: Either.match({
                onLeft: onDone,
                onRight: onElement
              })
            }), stateEmit([...state.notifyConsumers, deferred])];
          }
        case OP_STATE_ERROR:
          {
            return [Effect.succeed(onError(state.cause)), state];
          }
        case OP_STATE_DONE:
          {
            return [Effect.succeed(onDone(state.done)), state];
          }
      }
    })));
  }
}
/** @internal */
const make = () => (0, Function_js_1.pipe)(Deferred.make(), Effect.flatMap(deferred => Ref.make(stateEmpty(deferred))), Effect.map(ref => new SingleProducerAsyncInputImpl(ref)));
exports.make = make;
//# sourceMappingURL=singleProducerAsyncInput.js.map