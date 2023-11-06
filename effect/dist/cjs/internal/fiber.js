"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentFiber = exports.currentFiberURI = exports.unit = exports.succeed = exports.status = exports.roots = exports.unsafeRoots = exports.pretty = exports.poll = exports.orElseEither = exports.orElse = exports.never = exports.match = exports.mapFiber = exports.mapEffect = exports.map = exports.join = exports.interruptAsFork = exports.interruptAllAs = exports.interruptAll = exports.interrupted = exports.inheritAll = exports.id = exports.fromEffect = exports.failCause = exports.fail = exports.dumpAll = exports.dump = exports.done = exports.children = exports._await = exports.isRuntimeFiber = exports.isFiber = exports.Order = exports.RuntimeFiberTypeId = exports.fiberVariance = exports.FiberTypeId = void 0;
const Clock = /*#__PURE__*/require("../Clock.js");
const Either = /*#__PURE__*/require("../Either.js");
const Exit = /*#__PURE__*/require("../Exit.js");
const FiberId = /*#__PURE__*/require("../FiberId.js");
const FiberStatus = /*#__PURE__*/require("../FiberStatus.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const number = /*#__PURE__*/require("../Number.js");
const Option = /*#__PURE__*/require("../Option.js");
const order = /*#__PURE__*/require("../Order.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const core = /*#__PURE__*/require("./core.js");
const fiberScope = /*#__PURE__*/require("./fiberScope.js");
const runtimeFlags = /*#__PURE__*/require("./runtimeFlags.js");
/** @internal */
const FiberSymbolKey = "effect/Fiber";
/** @internal */
exports.FiberTypeId = /*#__PURE__*/Symbol.for(FiberSymbolKey);
/** @internal */
exports.fiberVariance = {
  _E: _ => _,
  _A: _ => _
};
/** @internal */
const fiberProto = {
  [exports.FiberTypeId]: exports.fiberVariance,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
const RuntimeFiberSymbolKey = "effect/Fiber";
/** @internal */
exports.RuntimeFiberTypeId = /*#__PURE__*/Symbol.for(RuntimeFiberSymbolKey);
/** @internal */
exports.Order = /*#__PURE__*/(0, Function_js_1.pipe)( /*#__PURE__*/order.tuple(number.Order, number.Order), /*#__PURE__*/order.mapInput(fiber => [fiber.id().startTimeMillis, fiber.id().id]));
/** @internal */
const isFiber = u => (0, Predicate_js_1.hasProperty)(u, exports.FiberTypeId);
exports.isFiber = isFiber;
/** @internal */
const isRuntimeFiber = self => exports.RuntimeFiberTypeId in self;
exports.isRuntimeFiber = isRuntimeFiber;
/** @internal */
const _await = self => self.await();
exports._await = _await;
/** @internal */
const children = self => self.children();
exports.children = children;
/** @internal */
const done = exit => ({
  ...fiberProto,
  id: () => FiberId.none,
  await: () => core.succeed(exit),
  children: () => core.succeed([]),
  inheritAll: () => core.unit,
  poll: () => core.succeed(Option.some(exit)),
  interruptAsFork: () => core.unit
});
exports.done = done;
/** @internal */
const dump = self => core.map(self.status(), status => ({
  id: self.id(),
  status
}));
exports.dump = dump;
/** @internal */
const dumpAll = fibers => core.forEachSequential(fibers, exports.dump);
exports.dumpAll = dumpAll;
/** @internal */
const fail = error => (0, exports.done)(Exit.fail(error));
exports.fail = fail;
/** @internal */
const failCause = cause => (0, exports.done)(Exit.failCause(cause));
exports.failCause = failCause;
/** @internal */
const fromEffect = effect => core.map(core.exit(effect), exports.done);
exports.fromEffect = fromEffect;
/** @internal */
const id = self => self.id();
exports.id = id;
/** @internal */
const inheritAll = self => self.inheritAll();
exports.inheritAll = inheritAll;
/** @internal */
const interrupted = fiberId => (0, exports.done)(Exit.interrupt(fiberId));
exports.interrupted = interrupted;
/** @internal */
const interruptAll = fibers => core.flatMap(core.fiberId, fiberId => (0, Function_js_1.pipe)(fibers, (0, exports.interruptAllAs)(fiberId)));
exports.interruptAll = interruptAll;
/** @internal */
exports.interruptAllAs = /*#__PURE__*/(0, Function_js_1.dual)(2, (fibers, fiberId) => (0, Function_js_1.pipe)(core.forEachSequentialDiscard(fibers, (0, exports.interruptAsFork)(fiberId)), core.zipRight((0, Function_js_1.pipe)(fibers, core.forEachSequentialDiscard(exports._await)))));
/** @internal */
exports.interruptAsFork = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, fiberId) => self.interruptAsFork(fiberId));
/** @internal */
const join = self => core.zipLeft(core.flatten(self.await()), self.inheritAll());
exports.join = join;
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapEffect)(self, a => core.sync(() => f(a))));
/** @internal */
exports.mapEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => ({
  ...fiberProto,
  id: () => self.id(),
  await: () => core.flatMap(self.await(), Exit.forEachEffect(f)),
  children: () => self.children(),
  inheritAll: () => self.inheritAll(),
  poll: () => core.flatMap(self.poll(), result => {
    switch (result._tag) {
      case "None":
        {
          return core.succeed(Option.none());
        }
      case "Some":
        {
          return (0, Function_js_1.pipe)(Exit.forEachEffect(result.value, f), core.map(Option.some));
        }
    }
  }),
  interruptAsFork: id => self.interruptAsFork(id)
}));
/** @internal */
exports.mapFiber = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.map(self.await(), Exit.match({
  onFailure: cause => (0, exports.failCause)(cause),
  onSuccess: a => f(a)
})));
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFiber,
  onRuntimeFiber
}) => {
  if ((0, exports.isRuntimeFiber)(self)) {
    return onRuntimeFiber(self);
  }
  return onFiber(self);
});
/** @internal */
exports.never = {
  ...fiberProto,
  id: () => FiberId.none,
  await: () => core.never,
  children: () => core.succeed([]),
  inheritAll: () => core.never,
  poll: () => core.succeed(Option.none()),
  interruptAsFork: () => core.never
};
/** @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => ({
  ...fiberProto,
  id: () => FiberId.getOrElse(self.id(), that.id()),
  await: () => core.zipWith(self.await(), that.await(), (exit1, exit2) => Exit.isSuccess(exit1) ? exit1 : exit2),
  children: () => self.children(),
  inheritAll: () => core.zipRight(that.inheritAll(), self.inheritAll()),
  poll: () => core.zipWith(self.poll(), that.poll(), (option1, option2) => {
    switch (option1._tag) {
      case "None":
        {
          return Option.none();
        }
      case "Some":
        {
          return Exit.isSuccess(option1.value) ? option1 : option2;
        }
    }
  }),
  interruptAsFork: id => (0, Function_js_1.pipe)(core.interruptAsFiber(self, id), core.zipRight((0, Function_js_1.pipe)(that, core.interruptAsFiber(id))), core.asUnit)
}));
/** @internal */
exports.orElseEither = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.orElse)((0, exports.map)(self, Either.left), (0, exports.map)(that, Either.right)));
/** @internal */
const poll = self => self.poll();
exports.poll = poll;
// forked from https://github.com/sindresorhus/parse-ms/blob/4da2ffbdba02c6e288c08236695bdece0adca173/index.js
// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
/** @internal */
const parseMs = milliseconds => {
  const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
  return {
    days: roundTowardsZero(milliseconds / 86400000),
    hours: roundTowardsZero(milliseconds / 3600000) % 24,
    minutes: roundTowardsZero(milliseconds / 60000) % 60,
    seconds: roundTowardsZero(milliseconds / 1000) % 60,
    milliseconds: roundTowardsZero(milliseconds) % 1000,
    microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
    nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
  };
};
/** @internal */
const renderStatus = status => {
  if (FiberStatus.isDone(status)) {
    return "Done";
  }
  if (FiberStatus.isRunning(status)) {
    return "Running";
  }
  const isInterruptible = runtimeFlags.interruptible(status.runtimeFlags) ? "interruptible" : "uninterruptible";
  return `Suspended(${isInterruptible})`;
};
/** @internal */
const pretty = self => core.flatMap(Clock.currentTimeMillis, now => core.map((0, exports.dump)(self), dump => {
  const time = now - dump.id.startTimeMillis;
  const {
    days,
    hours,
    milliseconds,
    minutes,
    seconds
  } = parseMs(time);
  const lifeMsg = (days === 0 ? "" : `${days}d`) + (days === 0 && hours === 0 ? "" : `${hours}h`) + (days === 0 && hours === 0 && minutes === 0 ? "" : `${minutes}m`) + (days === 0 && hours === 0 && minutes === 0 && seconds === 0 ? "" : `${seconds}s`) + `${milliseconds}ms`;
  const waitMsg = FiberStatus.isSuspended(dump.status) ? (() => {
    const ids = FiberId.ids(dump.status.blockingOn);
    return HashSet.size(ids) > 0 ? `waiting on ` + Array.from(ids).map(id => `${id}`).join(", ") : "";
  })() : "";
  const statusMsg = renderStatus(dump.status);
  return `[Fiber](#${dump.id.id}) (${lifeMsg}) ${waitMsg}\n   Status: ${statusMsg}`;
}));
exports.pretty = pretty;
/** @internal */
const unsafeRoots = () => Array.from(fiberScope.globalScope.roots);
exports.unsafeRoots = unsafeRoots;
/** @internal */
exports.roots = /*#__PURE__*/core.sync(exports.unsafeRoots);
/** @internal */
const status = self => self.status();
exports.status = status;
/** @internal */
const succeed = value => (0, exports.done)(Exit.succeed(value));
exports.succeed = succeed;
/** @internal */
exports.unit = /*#__PURE__*/(0, exports.succeed)(void 0);
/** @internal */
exports.currentFiberURI = "effect/FiberCurrent";
/** @internal */
const getCurrentFiber = () => Option.fromNullable(globalThis[exports.currentFiberURI]);
exports.getCurrentFiber = getCurrentFiber;
//# sourceMappingURL=fiber.js.map