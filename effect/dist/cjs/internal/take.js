"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tap = exports.of = exports.map = exports.matchEffect = exports.match = exports.make = exports.isSuccess = exports.isFailure = exports.isDone = exports.fromPull = exports.fromExit = exports.fromEffect = exports.failCause = exports.fail = exports.end = exports.done = exports.dieMessage = exports.die = exports.chunk = exports.TakeImpl = exports.TakeTypeId = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Effect = /*#__PURE__*/require("../Effect.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
/** @internal */
const TakeSymbolKey = "effect/Take";
/** @internal */
exports.TakeTypeId = /*#__PURE__*/Symbol.for(TakeSymbolKey);
/** @internal */
const takeVariance = {
  _E: _ => _,
  _A: _ => _
};
/** @internal */
class TakeImpl {
  exit;
  [exports.TakeTypeId] = takeVariance;
  constructor(exit) {
    this.exit = exit;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.TakeImpl = TakeImpl;
/** @internal */
const chunk = chunk => new TakeImpl(Exit.succeed(chunk));
exports.chunk = chunk;
/** @internal */
const die = defect => new TakeImpl(Exit.die(defect));
exports.die = die;
/** @internal */
const dieMessage = message => new TakeImpl(Exit.die(Cause.RuntimeException(message)));
exports.dieMessage = dieMessage;
/** @internal */
const done = self => Effect.suspend(() => self.exit);
exports.done = done;
/** @internal */
exports.end = /*#__PURE__*/new TakeImpl( /*#__PURE__*/Exit.fail( /*#__PURE__*/Option.none()));
/** @internal */
const fail = error => new TakeImpl(Exit.fail(Option.some(error)));
exports.fail = fail;
/** @internal */
const failCause = cause => new TakeImpl(Exit.failCause((0, Function_js_1.pipe)(cause, Cause.map(Option.some))));
exports.failCause = failCause;
/** @internal */
const fromEffect = effect => Effect.matchCause(effect, {
  onFailure: exports.failCause,
  onSuccess: exports.of
});
exports.fromEffect = fromEffect;
/** @internal */
const fromExit = exit => new TakeImpl((0, Function_js_1.pipe)(exit, Exit.mapBoth({
  onFailure: Option.some,
  onSuccess: Chunk.of
})));
exports.fromExit = fromExit;
/** @internal */
const fromPull = pull => Effect.matchCause(pull, {
  onFailure: cause => Option.match(Cause.flipCauseOption(cause), {
    onNone: () => exports.end,
    onSome: exports.failCause
  }),
  onSuccess: exports.chunk
});
exports.fromPull = fromPull;
/** @internal */
const isDone = self => Exit.match(self.exit, {
  onFailure: cause => Option.isNone(Cause.flipCauseOption(cause)),
  onSuccess: Function_js_1.constFalse
});
exports.isDone = isDone;
/** @internal */
const isFailure = self => Exit.match(self.exit, {
  onFailure: cause => Option.isSome(Cause.flipCauseOption(cause)),
  onSuccess: Function_js_1.constFalse
});
exports.isFailure = isFailure;
/** @internal */
const isSuccess = self => Exit.match(self.exit, {
  onFailure: Function_js_1.constFalse,
  onSuccess: Function_js_1.constTrue
});
exports.isSuccess = isSuccess;
/** @internal */
const make = exit => new TakeImpl(exit);
exports.make = make;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onEnd,
  onFailure,
  onSuccess
}) => Exit.match(self.exit, {
  onFailure: cause => Option.match(Cause.flipCauseOption(cause), {
    onNone: onEnd,
    onSome: onFailure
  }),
  onSuccess
}));
/** @internal */
exports.matchEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onEnd,
  onFailure,
  onSuccess
}) => Exit.matchEffect(self.exit, {
  onFailure: cause => Option.match(Cause.flipCauseOption(cause), {
    onNone: onEnd,
    onSome: onFailure
  }),
  onSuccess
}));
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new TakeImpl((0, Function_js_1.pipe)(self.exit, Exit.map(Chunk.map(f)))));
/** @internal */
const of = value => new TakeImpl(Exit.succeed(Chunk.of(value)));
exports.of = of;
/** @internal */
exports.tap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self.exit, Exit.forEachEffect(f), Effect.asUnit));
//# sourceMappingURL=take.js.map