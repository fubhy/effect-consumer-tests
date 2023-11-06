"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.none = exports.negate = exports.mergeAll = exports.merge = exports.mapError = exports.mapBoth = exports.mapAttempt = exports.loop = exports.iterate = exports.isSuccess = exports.isFailure = exports.ignore = exports.if_ = exports.head = exports.gen = exports.fromOption = exports.fromEither = exports.forEach = exports.match = exports.flipWith = exports.flip = exports.flatten = exports.filterOrFail = exports.filterOrElse = exports.filterOrDieMessage = exports.filterOrDie = exports.filterNot = exports.filter = exports.fiberId = exports.exists = exports.every = exports.eventually = exports.either = exports.cond = exports.commitEither = exports.collectSTM = exports.collect = exports.check = exports.catchTags = exports.catchTag = exports.catchSome = exports.let_ = exports.bindTo = exports.bind = exports.attempt = exports.asUnit = exports.asSomeError = exports.asSome = exports.as = exports.acquireUseRelease = void 0;
exports.whenSTM = exports.when = exports.validateFirst = exports.validateAll = exports.unsome = exports.unlessSTM = exports.unless = exports.unit = exports.try_ = exports.tapError = exports.tapBoth = exports.tap = exports.suspend = exports.summarized = exports.succeedSome = exports.succeedNone = exports.all = exports.some = exports.partition = exports.retryWhile = exports.retryUntil = exports.replicateSTMDiscard = exports.replicateSTM = exports.replicate = exports.repeatWhile = exports.repeatUntil = exports.rejectSTM = exports.reject = exports.refineOrDieWith = exports.refineOrDie = exports.reduceRight = exports.reduceAll = exports.reduce = exports.provideServiceSTM = exports.provideService = exports.provideSomeContext = exports.provideContext = exports.orElseSucceed = exports.orElseOptional = exports.orElseFail = exports.orElseEither = exports.orElse = exports.orDieWith = exports.orDie = exports.option = void 0;
const Cause = /*#__PURE__*/require("../../Cause.js");
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Context = /*#__PURE__*/require("../../Context.js");
const Effect = /*#__PURE__*/require("../../Effect.js");
const Either = /*#__PURE__*/require("../../Either.js");
const Exit = /*#__PURE__*/require("../../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
const predicate = /*#__PURE__*/require("../../Predicate.js");
const RA = /*#__PURE__*/require("../../ReadonlyArray.js");
const effectCore = /*#__PURE__*/require("../core.js");
const SingleShotGen = /*#__PURE__*/require("../singleShotGen.js");
const core = /*#__PURE__*/require("./core.js");
const Journal = /*#__PURE__*/require("./stm/journal.js");
const STMState = /*#__PURE__*/require("./stm/stmState.js");
/** @internal */
exports.acquireUseRelease = /*#__PURE__*/(0, Function_js_1.dual)(3, (acquire, use, release) => Effect.uninterruptibleMask(restore => {
  let state = STMState.running;
  return (0, Function_js_1.pipe)(restore(core.unsafeAtomically(acquire, exit => {
    state = STMState.done(exit);
  }, () => {
    state = STMState.interrupted;
  })), Effect.matchCauseEffect({
    onFailure: cause => {
      if (STMState.isDone(state) && Exit.isSuccess(state.exit)) {
        return (0, Function_js_1.pipe)(release(state.exit.value), Effect.matchCauseEffect({
          onFailure: cause2 => Effect.failCause(Cause.parallel(cause, cause2)),
          onSuccess: () => Effect.failCause(cause)
        }));
      }
      return Effect.failCause(cause);
    },
    onSuccess: a => (0, Function_js_1.pipe)(restore(use(a)), Effect.matchCauseEffect({
      onFailure: cause => (0, Function_js_1.pipe)(release(a), Effect.matchCauseEffect({
        onFailure: cause2 => Effect.failCause(Cause.parallel(cause, cause2)),
        onSuccess: () => Effect.failCause(cause)
      })),
      onSuccess: a2 => (0, Function_js_1.pipe)(release(a), Effect.as(a2))
    }))
  }));
}));
/** @internal */
exports.as = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, Function_js_1.pipe)(self, core.map(() => value)));
/** @internal */
const asSome = self => (0, Function_js_1.pipe)(self, core.map(Option.some));
exports.asSome = asSome;
/** @internal */
const asSomeError = self => (0, Function_js_1.pipe)(self, (0, exports.mapError)(Option.some));
exports.asSomeError = asSomeError;
/** @internal */
const asUnit = self => (0, Function_js_1.pipe)(self, core.map(Function_js_1.constVoid));
exports.asUnit = asUnit;
/** @internal */
const attempt = evaluate => (0, exports.suspend)(() => {
  try {
    return core.succeed(evaluate());
  } catch (defect) {
    return core.fail(defect);
  }
});
exports.attempt = attempt;
exports.bind = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, f) => core.flatMap(self, k => core.map(f(k), a => ({
  ...k,
  [tag]: a
}))));
/* @internal */
exports.bindTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, tag) => core.map(self, a => ({
  [tag]: a
})));
/* @internal */
exports.let_ = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, f) => core.map(self, k => ({
  ...k,
  [tag]: f(k)
})));
/** @internal */
exports.catchSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => core.catchAll(self, e => Option.getOrElse(pf(e), () => core.fail(e))));
exports.catchTag = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, k, f) => core.catchAll(self, e => {
  if ("_tag" in e && e["_tag"] === k) {
    return f(e);
  }
  return core.fail(e);
}));
/** @internal */
exports.catchTags = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, cases) => core.catchAll(self, e => {
  const keys = Object.keys(cases);
  if ("_tag" in e && keys.includes(e["_tag"])) {
    return cases[e["_tag"]](e);
  }
  return core.fail(e);
}));
/** @internal */
const check = predicate => (0, exports.suspend)(() => predicate() ? exports.unit : core.retry);
exports.check = check;
/** @internal */
exports.collect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.collectSTM)(self, a => Option.map(pf(a), core.succeed)));
/** @internal */
exports.collectSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => core.matchSTM(self, {
  onFailure: core.fail,
  onSuccess: a => {
    const option = pf(a);
    return Option.isSome(option) ? option.value : core.retry;
  }
}));
/** @internal */
const commitEither = self => Effect.flatten(core.commit((0, exports.either)(self)));
exports.commitEither = commitEither;
/** @internal */
const cond = (predicate, error, result) => {
  return (0, exports.suspend)(() => predicate() ? core.sync(result) : core.failSync(error));
};
exports.cond = cond;
/** @internal */
const either = self => (0, exports.match)(self, {
  onFailure: Either.left,
  onSuccess: Either.right
});
exports.either = either;
/** @internal */
const eventually = self => core.matchSTM(self, {
  onFailure: () => (0, exports.eventually)(self),
  onSuccess: core.succeed
});
exports.eventually = eventually;
/** @internal */
exports.every = /*#__PURE__*/(0, Function_js_1.dual)(2, (iterable, predicate) => (0, Function_js_1.pipe)(core.flatMap(core.sync(() => iterable[Symbol.iterator]()), iterator => {
  const loop = (0, exports.suspend)(() => {
    const next = iterator.next();
    if (next.done) {
      return core.succeed(true);
    }
    return (0, Function_js_1.pipe)(predicate(next.value), core.flatMap(bool => bool ? loop : core.succeed(bool)));
  });
  return loop;
})));
/** @internal */
exports.exists = /*#__PURE__*/(0, Function_js_1.dual)(2, (iterable, predicate) => core.flatMap(core.sync(() => iterable[Symbol.iterator]()), iterator => {
  const loop = (0, exports.suspend)(() => {
    const next = iterator.next();
    if (next.done) {
      return core.succeed(false);
    }
    return core.flatMap(predicate(next.value), bool => bool ? core.succeed(bool) : loop);
  });
  return loop;
}));
/** @internal */
exports.fiberId = /*#__PURE__*/core.effect((_, fiberId) => fiberId);
/** @internal */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(2, (iterable, predicate) => Array.from(iterable).reduce((acc, curr) => (0, Function_js_1.pipe)(acc, core.zipWith(predicate(curr), (as, p) => {
  if (p) {
    as.push(curr);
    return as;
  }
  return as;
})), core.succeed([])));
/** @internal */
exports.filterNot = /*#__PURE__*/(0, Function_js_1.dual)(2, (iterable, predicate) => (0, exports.filter)(iterable, a => (0, exports.negate)(predicate(a))));
/** @internal */
exports.filterOrDie = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, predicate, defect) => (0, exports.filterOrElse)(self, predicate, () => core.dieSync(defect)));
/** @internal */
exports.filterOrDieMessage = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, predicate, message) => (0, exports.filterOrElse)(self, predicate, () => core.dieMessage(message)));
/** @internal */
exports.filterOrElse = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, predicate, orElse) => core.flatMap(self, a => predicate(a) ? core.succeed(a) : orElse(a)));
/** @internal */
exports.filterOrFail = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, predicate, orFailWith) => (0, exports.filterOrElse)(self, predicate, a => core.failSync(() => orFailWith(a))));
/** @internal */
const flatten = self => core.flatMap(self, Function_js_1.identity);
exports.flatten = flatten;
/** @internal */
const flip = self => core.matchSTM(self, {
  onFailure: core.succeed,
  onSuccess: core.fail
});
exports.flip = flip;
/** @internal */
exports.flipWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flip)(f((0, exports.flip)(self))));
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => core.matchSTM(self, {
  onFailure: e => core.succeed(onFailure(e)),
  onSuccess: a => core.succeed(onSuccess(a))
}));
/** @internal */
exports.forEach = /*#__PURE__*/(0, Function_js_1.dual)(args => predicate.isIterable(args[0]), (iterable, f, options) => {
  if (options?.discard) {
    return (0, Function_js_1.pipe)(core.sync(() => iterable[Symbol.iterator]()), core.flatMap(iterator => {
      const loop = (0, exports.suspend)(() => {
        const next = iterator.next();
        if (next.done) {
          return exports.unit;
        }
        return (0, Function_js_1.pipe)(f(next.value), core.flatMap(() => loop));
      });
      return loop;
    }));
  }
  return (0, exports.suspend)(() => RA.fromIterable(iterable).reduce((acc, curr) => core.zipWith(acc, f(curr), (array, elem) => {
    array.push(elem);
    return array;
  }), core.succeed([])));
});
/** @internal */
const fromEither = either => {
  switch (either._tag) {
    case "Left":
      {
        return core.fail(either.left);
      }
    case "Right":
      {
        return core.succeed(either.right);
      }
  }
};
exports.fromEither = fromEither;
/** @internal */
const fromOption = option => Option.match(option, {
  onNone: () => core.fail(Option.none()),
  onSome: core.succeed
});
exports.fromOption = fromOption;
/** @internal */
class STMGen {
  value;
  constructor(value) {
    this.value = value;
  }
  [Symbol.iterator]() {
    return new SingleShotGen.SingleShotGen(this);
  }
}
const adapter = function () {
  let x = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    x = arguments[i](x);
  }
  return new STMGen(x);
};
/**
 * Inspired by https://github.com/tusharmath/qio/pull/22 (revised)
 * @internal
 */
const gen = f => (0, exports.suspend)(() => {
  const iterator = f(adapter);
  const state = iterator.next();
  const run = state => state.done ? core.succeed(state.value) : core.flatMap(state.value.value, val => run(iterator.next(val)));
  return run(state);
});
exports.gen = gen;
/** @internal */
const head = self => (0, Function_js_1.pipe)(self, core.matchSTM({
  onFailure: e => core.fail(Option.some(e)),
  onSuccess: a => {
    const i = a[Symbol.iterator]();
    const res = i.next();
    if (res.done) {
      return core.fail(Option.none());
    } else {
      return core.succeed(res.value);
    }
  }
}));
exports.head = head;
/** @internal */
exports.if_ = /*#__PURE__*/(0, Function_js_1.dual)(args => typeof args[0] === "boolean" || core.isSTM(args[0]), (self, {
  onFalse,
  onTrue
}) => {
  if (typeof self === "boolean") {
    return self ? onTrue : onFalse;
  }
  return core.flatMap(self, bool => bool ? onTrue : onFalse);
});
/** @internal */
const ignore = self => (0, exports.match)(self, {
  onFailure: () => exports.unit,
  onSuccess: () => exports.unit
});
exports.ignore = ignore;
/** @internal */
const isFailure = self => (0, exports.match)(self, {
  onFailure: Function_js_1.constTrue,
  onSuccess: Function_js_1.constFalse
});
exports.isFailure = isFailure;
/** @internal */
const isSuccess = self => (0, exports.match)(self, {
  onFailure: Function_js_1.constFalse,
  onSuccess: Function_js_1.constTrue
});
exports.isSuccess = isSuccess;
/** @internal */
const iterate = (initial, options) => iterateLoop(initial, options.while, options.body);
exports.iterate = iterate;
const iterateLoop = (initial, cont, body) => {
  if (cont(initial)) {
    return (0, Function_js_1.pipe)(body(initial), core.flatMap(z => iterateLoop(z, cont, body)));
  }
  return core.succeed(initial);
};
/** @internal */
const loop = (initial, options) => options.discard ? loopDiscardLoop(initial, options.while, options.step, options.body) : core.map(loopLoop(initial, options.while, options.step, options.body), a => Array.from(a));
exports.loop = loop;
const loopLoop = (initial, cont, inc, body) => {
  if (cont(initial)) {
    return (0, Function_js_1.pipe)(body(initial), core.flatMap(a => (0, Function_js_1.pipe)(loopLoop(inc(initial), cont, inc, body), core.map(Chunk.append(a)))));
  }
  return core.succeed(Chunk.empty());
};
const loopDiscardLoop = (initial, cont, inc, body) => {
  if (cont(initial)) {
    return (0, Function_js_1.pipe)(body(initial), core.flatMap(() => loopDiscardLoop(inc(initial), cont, inc, body)));
  }
  return exports.unit;
};
/** @internal */
exports.mapAttempt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.matchSTM(self, {
  onFailure: e => core.fail(e),
  onSuccess: a => (0, exports.attempt)(() => f(a))
}));
/** @internal */
exports.mapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => core.matchSTM(self, {
  onFailure: e => core.fail(onFailure(e)),
  onSuccess: a => core.succeed(onSuccess(a))
}));
/** @internal */
exports.mapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.matchSTM(self, {
  onFailure: e => core.fail(f(e)),
  onSuccess: core.succeed
}));
/** @internal */
const merge = self => core.matchSTM(self, {
  onFailure: e => core.succeed(e),
  onSuccess: core.succeed
});
exports.merge = merge;
/** @internal */
exports.mergeAll = /*#__PURE__*/(0, Function_js_1.dual)(3, (iterable, zero, f) => (0, exports.suspend)(() => Array.from(iterable).reduce((acc, curr) => (0, Function_js_1.pipe)(acc, core.zipWith(curr, f)), core.succeed(zero))));
/** @internal */
const negate = self => (0, Function_js_1.pipe)(self, core.map(b => !b));
exports.negate = negate;
/** @internal */
const none = self => core.matchSTM(self, {
  onFailure: e => core.fail(Option.some(e)),
  onSuccess: Option.match({
    onNone: () => exports.unit,
    onSome: () => core.fail(Option.none())
  })
});
exports.none = none;
/** @internal */
const option = self => (0, exports.match)(self, {
  onFailure: () => Option.none(),
  onSuccess: Option.some
});
exports.option = option;
/** @internal */
const orDie = self => (0, Function_js_1.pipe)(self, (0, exports.orDieWith)(Function_js_1.identity));
exports.orDie = orDie;
/** @internal */
exports.orDieWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(self, (0, exports.mapError)(f), core.catchAll(core.die)));
/** @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => core.flatMap(core.effect(journal => Journal.prepareResetJournal(journal)), reset => (0, Function_js_1.pipe)(core.orTry(self, () => core.flatMap(core.sync(reset), that)), core.catchAll(() => core.flatMap(core.sync(reset), that)))));
/** @internal */
exports.orElseEither = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.orElse)(core.map(self, Either.left), () => core.map(that(), Either.right)));
/** @internal */
exports.orElseFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, error) => (0, exports.orElse)(self, () => core.failSync(error)));
/** @internal */
exports.orElseOptional = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => core.catchAll(self, Option.match({
  onNone: that,
  onSome: e => core.fail(Option.some(e))
})));
/** @internal */
exports.orElseSucceed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.orElse)(self, () => core.sync(value)));
/** @internal */
exports.provideContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, env) => core.mapInputContext(self, _ => env));
/** @internal */
exports.provideSomeContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, context) => core.mapInputContext(self, parent => Context.merge(parent, context)));
/** @internal */
exports.provideService = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, resource) => (0, exports.provideServiceSTM)(self, tag, core.succeed(resource)));
/** @internal */
exports.provideServiceSTM = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, stm) => core.contextWithSTM(env => core.flatMap(stm, service => (0, exports.provideContext)(self, Context.add(env, tag, service)))));
/** @internal */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (iterable, zero, f) => (0, exports.suspend)(() => Array.from(iterable).reduce((acc, curr) => (0, Function_js_1.pipe)(acc, core.flatMap(s => f(s, curr))), core.succeed(zero))));
/** @internal */
exports.reduceAll = /*#__PURE__*/(0, Function_js_1.dual)(3, (iterable, initial, f) => (0, exports.suspend)(() => Array.from(iterable).reduce((acc, curr) => (0, Function_js_1.pipe)(acc, core.zipWith(curr, f)), initial)));
/** @internal */
exports.reduceRight = /*#__PURE__*/(0, Function_js_1.dual)(3, (iterable, zero, f) => (0, exports.suspend)(() => Array.from(iterable).reduceRight((acc, curr) => (0, Function_js_1.pipe)(acc, core.flatMap(s => f(s, curr))), core.succeed(zero))));
/** @internal */
exports.refineOrDie = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.refineOrDieWith)(self, pf, Function_js_1.identity));
/** @internal */
exports.refineOrDieWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, pf, f) => core.catchAll(self, e => Option.match(pf(e), {
  onNone: () => core.die(f(e)),
  onSome: core.fail
})));
/** @internal */
exports.reject = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.rejectSTM)(self, a => Option.map(pf(a), core.fail)));
/** @internal */
exports.rejectSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => core.flatMap(self, a => Option.match(pf(a), {
  onNone: () => core.succeed(a),
  onSome: core.flatMap(core.fail)
})));
/** @internal */
exports.repeatUntil = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => repeatUntilLoop(self, predicate));
const repeatUntilLoop = (self, predicate) => core.flatMap(self, a => predicate(a) ? core.succeed(a) : repeatUntilLoop(self, predicate));
/** @internal */
exports.repeatWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => repeatWhileLoop(self, predicate));
const repeatWhileLoop = (self, predicate) => (0, Function_js_1.pipe)(core.flatMap(self, a => predicate(a) ? repeatWhileLoop(self, predicate) : core.succeed(a)));
/** @internal */
exports.replicate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => Array.from({
  length: n
}, () => self));
/** @internal */
exports.replicateSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.all)((0, exports.replicate)(self, n)));
/** @internal */
exports.replicateSTMDiscard = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.all)((0, exports.replicate)(self, n), {
  discard: true
}));
/** @internal */
exports.retryUntil = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.matchSTM(self, {
  onFailure: core.fail,
  onSuccess: a => predicate(a) ? core.succeed(a) : core.retry
}));
/** @internal */
exports.retryWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.matchSTM(self, {
  onFailure: core.fail,
  onSuccess: a => !predicate(a) ? core.succeed(a) : core.retry
}));
/** @internal */
exports.partition = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, f) => (0, Function_js_1.pipe)((0, exports.forEach)(elements, a => (0, exports.either)(f(a))), core.map(as => effectCore.partitionMap(as, Function_js_1.identity))));
/** @internal */
const some = self => core.matchSTM(self, {
  onFailure: e => core.fail(Option.some(e)),
  onSuccess: Option.match({
    onNone: () => core.fail(Option.none()),
    onSome: core.succeed
  })
});
exports.some = some;
/* @internal */
exports.all = (input, options) => {
  if (Symbol.iterator in input) {
    return (0, exports.forEach)(input, Function_js_1.identity, options);
  } else if (options?.discard) {
    return (0, exports.forEach)(Object.values(input), Function_js_1.identity, options);
  }
  return core.map((0, exports.forEach)(Object.entries(input), ([_, e]) => core.map(e, a => [_, a])), values => {
    const res = {};
    for (const [k, v] of values) {
      ;
      res[k] = v;
    }
    return res;
  });
};
/** @internal */
exports.succeedNone = /*#__PURE__*/core.succeed( /*#__PURE__*/Option.none());
/** @internal */
const succeedSome = value => core.succeed(Option.some(value));
exports.succeedSome = succeedSome;
/** @internal */
exports.summarized = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, summary, f) => core.flatMap(summary, start => core.flatMap(self, value => core.map(summary, end => [f(start, end), value]))));
/** @internal */
const suspend = evaluate => (0, exports.flatten)(core.sync(evaluate));
exports.suspend = suspend;
/** @internal */
exports.tap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.flatMap(self, a => (0, exports.as)(f(a), a)));
/** @internal */
exports.tapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onFailure,
  onSuccess
}) => core.matchSTM(self, {
  onFailure: e => (0, Function_js_1.pipe)(onFailure(e), core.zipRight(core.fail(e))),
  onSuccess: a => (0, Function_js_1.pipe)(onSuccess(a), (0, exports.as)(a))
}));
/** @internal */
exports.tapError = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.matchSTM(self, {
  onFailure: e => core.zipRight(f(e), core.fail(e)),
  onSuccess: core.succeed
}));
/** @internal */
const try_ = arg => {
  const evaluate = typeof arg === "function" ? arg : arg.try;
  return (0, exports.suspend)(() => {
    try {
      return core.succeed(evaluate());
    } catch (error) {
      return core.fail("catch" in arg ? arg.catch(error) : error);
    }
  });
};
exports.try_ = try_;
/** @internal */
exports.unit = /*#__PURE__*/core.succeed(void 0);
/** @internal */
exports.unless = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.suspend)(() => predicate() ? exports.succeedNone : (0, exports.asSome)(self)));
/** @internal */
exports.unlessSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.flatMap(predicate, bool => bool ? exports.succeedNone : (0, exports.asSome)(self)));
/** @internal */
const unsome = self => core.matchSTM(self, {
  onFailure: Option.match({
    onNone: () => core.succeed(Option.none()),
    onSome: core.fail
  }),
  onSuccess: a => core.succeed(Option.some(a))
});
exports.unsome = unsome;
/** @internal */
exports.validateAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, f) => core.flatMap((0, exports.partition)(elements, f), ([errors, values]) => RA.isNonEmptyArray(errors) ? core.fail(errors) : core.succeed(values)));
/** @internal */
exports.validateFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (elements, f) => (0, exports.flip)((0, exports.forEach)(elements, a => (0, exports.flip)(f(a)))));
/** @internal */
exports.when = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.suspend)(() => predicate() ? (0, exports.asSome)(self) : exports.succeedNone));
/** @internal */
exports.whenSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.flatMap(predicate, bool => bool ? (0, exports.asSome)(self) : exports.succeedNone));
//# sourceMappingURL=stm.js.map