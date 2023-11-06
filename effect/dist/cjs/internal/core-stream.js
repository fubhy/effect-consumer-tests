"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.write = exports.unit = exports.sync = exports.suspend = exports.succeedNow = exports.succeed = exports.readWithCause = exports.readWith = exports.readOrFail = exports.provideContext = exports.pipeTo = exports.fromEffect = exports.foldCauseChannel = exports.flatMap = exports.failCauseSync = exports.failCause = exports.failSync = exports.fail = exports.ensuringWith = exports.embedInput = exports.concatMapWithCustom = exports.concatMapWith = exports.concatAllWith = exports.concatAll = exports.collectElements = exports.catchAllCause = exports.acquireReleaseOut = exports.isChannel = exports.ChannelTypeId = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Effect = /*#__PURE__*/require("../Effect.js");
const Either = /*#__PURE__*/require("../Either.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const childExecutorDecision = /*#__PURE__*/require("./channel/childExecutorDecision.js");
const continuation_js_1 = /*#__PURE__*/require("./channel/continuation.js");
const upstreamPullStrategy = /*#__PURE__*/require("./channel/upstreamPullStrategy.js");
const OpCodes = /*#__PURE__*/require("./opCodes/channel.js");
/** @internal */
const ChannelSymbolKey = "effect/Channel";
/** @internal */
exports.ChannelTypeId = /*#__PURE__*/Symbol.for(ChannelSymbolKey);
/** @internal */
const channelVariance = {
  _Env: _ => _,
  _InErr: _ => _,
  _InElem: _ => _,
  _InDone: _ => _,
  _OutErr: _ => _,
  _OutElem: _ => _,
  _OutDone: _ => _
};
/** @internal */
const proto = {
  [exports.ChannelTypeId]: channelVariance,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
const isChannel = u => (0, Predicate_js_1.hasProperty)(u, exports.ChannelTypeId) || Effect.isEffect(u);
exports.isChannel = isChannel;
/** @internal */
exports.acquireReleaseOut = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, release) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_BRACKET_OUT;
  op.acquire = () => self;
  op.finalizer = release;
  return op;
});
/** @internal */
exports.catchAllCause = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_FOLD;
  op.channel = self;
  op.k = new continuation_js_1.ContinuationKImpl(exports.succeed, f);
  return op;
});
/** @internal */
const collectElements = self => {
  return (0, exports.suspend)(() => {
    const builder = [];
    return (0, exports.flatMap)((0, exports.pipeTo)(self, collectElementsReader(builder)), value => (0, exports.sync)(() => [Chunk.fromIterable(builder), value]));
  });
};
exports.collectElements = collectElements;
/** @internal */
const collectElementsReader = builder => (0, exports.readWith)({
  onInput: outElem => (0, exports.flatMap)((0, exports.sync)(() => {
    builder.push(outElem);
  }), () => collectElementsReader(builder)),
  onFailure: exports.fail,
  onDone: exports.succeedNow
});
/** @internal */
const concatAll = channels => (0, exports.concatAllWith)(channels, Function_js_1.constVoid, Function_js_1.constVoid);
exports.concatAll = concatAll;
/** @internal */
const concatAllWith = (channels, f, g) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_CONCAT_ALL;
  op.combineInners = f;
  op.combineAll = g;
  op.onPull = () => upstreamPullStrategy.PullAfterNext(Option.none());
  op.onEmit = () => childExecutorDecision.Continue;
  op.value = () => channels;
  op.k = Function_js_1.identity;
  return op;
};
exports.concatAllWith = concatAllWith;
/** @internal */
exports.concatMapWith = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, f, g, h) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_CONCAT_ALL;
  op.combineInners = g;
  op.combineAll = h;
  op.onPull = () => upstreamPullStrategy.PullAfterNext(Option.none());
  op.onEmit = () => childExecutorDecision.Continue;
  op.value = () => self;
  op.k = f;
  return op;
});
/** @internal */
exports.concatMapWithCustom = /*#__PURE__*/(0, Function_js_1.dual)(6, (self, f, g, h, onPull, onEmit) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_CONCAT_ALL;
  op.combineInners = g;
  op.combineAll = h;
  op.onPull = onPull;
  op.onEmit = onEmit;
  op.value = () => self;
  op.k = f;
  return op;
});
/** @internal */
exports.embedInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, input) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_BRIDGE;
  op.input = input;
  op.channel = self;
  return op;
});
/** @internal */
exports.ensuringWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_ENSURING;
  op.channel = self;
  op.finalizer = finalizer;
  return op;
});
/** @internal */
const fail = error => (0, exports.failCause)(Cause.fail(error));
exports.fail = fail;
/** @internal */
const failSync = evaluate => (0, exports.failCauseSync)(() => Cause.fail(evaluate()));
exports.failSync = failSync;
/** @internal */
const failCause = cause => (0, exports.failCauseSync)(() => cause);
exports.failCause = failCause;
/** @internal */
const failCauseSync = evaluate => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_FAIL;
  op.error = evaluate;
  return op;
};
exports.failCauseSync = failCauseSync;
/** @internal */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_FOLD;
  op.channel = self;
  op.k = new continuation_js_1.ContinuationKImpl(f, exports.failCause);
  return op;
});
/** @internal */
exports.foldCauseChannel = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_FOLD;
  op.channel = self;
  op.k = new continuation_js_1.ContinuationKImpl(options.onSuccess, options.onFailure);
  return op;
});
/** @internal */
const fromEffect = effect => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_FROM_EFFECT;
  op.effect = () => effect;
  return op;
};
exports.fromEffect = fromEffect;
/** @internal */
exports.pipeTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_PIPE_TO;
  op.left = () => self;
  op.right = () => that;
  return op;
});
/** @internal */
exports.provideContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, env) => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_PROVIDE;
  op.context = () => env;
  op.inner = self;
  return op;
});
/** @internal */
const readOrFail = error => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_READ;
  op.more = exports.succeed;
  op.done = new continuation_js_1.ContinuationKImpl(() => (0, exports.fail)(error), () => (0, exports.fail)(error));
  return op;
};
exports.readOrFail = readOrFail;
/** @internal */
const readWith = options => (0, exports.readWithCause)({
  onInput: options.onInput,
  onFailure: cause => Either.match(Cause.failureOrCause(cause), {
    onLeft: options.onFailure,
    onRight: exports.failCause
  }),
  onDone: options.onDone
});
exports.readWith = readWith;
/** @internal */
const readWithCause = options => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_READ;
  op.more = options.onInput;
  op.done = new continuation_js_1.ContinuationKImpl(options.onDone, options.onFailure);
  return op;
};
exports.readWithCause = readWithCause;
/** @internal */
const succeed = value => (0, exports.sync)(() => value);
exports.succeed = succeed;
/** @internal */
const succeedNow = result => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_SUCCEED_NOW;
  op.terminal = result;
  return op;
};
exports.succeedNow = succeedNow;
/** @internal */
const suspend = evaluate => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_SUSPEND;
  op.channel = evaluate;
  return op;
};
exports.suspend = suspend;
const sync = evaluate => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_SUCCEED;
  op.evaluate = evaluate;
  return op;
};
exports.sync = sync;
/** @internal */
exports.unit = /*#__PURE__*/(0, exports.succeedNow)(void 0);
/** @internal */
const write = out => {
  const op = Object.create(proto);
  op._tag = OpCodes.OP_EMIT;
  op.out = out;
  return op;
};
exports.write = write;
//# sourceMappingURL=core-stream.js.map