"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapEffect = exports.map = exports.linear = exports.jitteredWith = exports.jittered = exports.intersectWith = exports.intersect = exports.identity = exports.hourOfDay = exports.fromFunction = exports.fromDelays = exports.fromDelay = exports.fixed = exports.fibonacci = exports.exponential = exports.ensuring = exports.eitherWith = exports.either = exports.duration = exports.driver = exports.mapBothEffect = exports.mapBoth = exports.delays = exports.delayedSchedule = exports.delayedEffect = exports.delayed = exports.dayOfWeek = exports.dayOfMonth = exports.mapInputEffect = exports.mapInputContext = exports.mapInput = exports.compose = exports.collectWhileEffect = exports.collectWhile = exports.collectUntilEffect = exports.collectUntil = exports.collectAllOutputs = exports.collectAllInputs = exports.checkEffect = exports.check = exports.bothInOut = exports.asUnit = exports.as = exports.andThenEither = exports.andThen = exports.addDelayEffect = exports.addDelay = exports.makeWithState = exports.ScheduleDriverTypeId = exports.ScheduleTypeId = void 0;
exports.beginningOfHour = exports.nextMinute = exports.endOfMinute = exports.beginningOfMinute = exports.nextSecond = exports.endOfSecond = exports.beginningOfSecond = exports.zipWith = exports.zipRight = exports.zipLeft = exports.windowed = exports.whileOutputEffect = exports.whileOutput = exports.whileInputEffect = exports.whileInput = exports.upTo = exports.untilOutputEffect = exports.untilOutput = exports.untilInputEffect = exports.untilInput = exports.unionWith = exports.union = exports.unfold = exports.tapOutput = exports.tapInput = exports.sync = exports.succeed = exports.spaced = exports.secondOfMinute = exports.run = exports.resetWhen = exports.resetAfter = exports.repetitions = exports.repeatForever = exports.reduceEffect = exports.reduce = exports.recurs = exports.recurWhileEffect = exports.recurWhile = exports.recurUpTo = exports.recurUntilOption = exports.recurUntilEffect = exports.recurUntil = exports.provideService = exports.provideContext = exports.passthrough = exports.onDecision = exports.modifyDelayEffect = exports.modifyDelay = exports.minuteOfHour = void 0;
exports.stop = exports.once = exports.forever = exports.elapsed = exports.count = exports.scheduleFrom_Effect = exports.schedule_Effect = exports.retryWhileEffect_Effect = exports.retryWhile_Effect = exports.retryUntilEffect_Effect = exports.retryUntil_Effect = exports.retryOrElse_Effect = exports.retryN_Effect = exports.retry_Effect = exports.repeatWhileEffect_Effect = exports.repeatWhile_Effect = exports.repeatUntilEffect_Effect = exports.repeatUntil_Effect = exports.repeatOrElse_Effect = exports.repeat_Effect = exports.findNextMonth = exports.nextDayOfMonth = exports.nextDay = exports.endOfDay = exports.beginningOfDay = exports.nextHour = exports.endOfHour = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Clock = /*#__PURE__*/require("../Clock.js");
const Context = /*#__PURE__*/require("../Context.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Either = /*#__PURE__*/require("../Either.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Random = /*#__PURE__*/require("../Random.js");
const ScheduleDecision = /*#__PURE__*/require("../ScheduleDecision.js");
const Interval = /*#__PURE__*/require("../ScheduleInterval.js");
const Intervals = /*#__PURE__*/require("../ScheduleIntervals.js");
const internalCause = /*#__PURE__*/require("./cause.js");
const effect = /*#__PURE__*/require("./core-effect.js");
const core = /*#__PURE__*/require("./core.js");
const ref = /*#__PURE__*/require("./ref.js");
/** @internal */
const ScheduleSymbolKey = "effect/Schedule";
/** @internal */
exports.ScheduleTypeId = /*#__PURE__*/Symbol.for(ScheduleSymbolKey);
/** @internal */
const ScheduleDriverSymbolKey = "effect/ScheduleDriver";
/** @internal */
exports.ScheduleDriverTypeId = /*#__PURE__*/Symbol.for(ScheduleDriverSymbolKey);
/** @internal */
const scheduleVariance = {
  _Env: _ => _,
  _In: _ => _,
  _Out: _ => _
};
const scheduleDriverVariance = {
  _Env: _ => _,
  _In: _ => _,
  _Out: _ => _
};
/** @internal */
class ScheduleImpl {
  initial;
  step;
  [exports.ScheduleTypeId] = scheduleVariance;
  constructor(initial, step) {
    this.initial = initial;
    this.step = step;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
/** @internal */
class ScheduleDriverImpl {
  schedule;
  ref;
  [exports.ScheduleDriverTypeId] = scheduleDriverVariance;
  constructor(schedule, ref) {
    this.schedule = schedule;
    this.ref = ref;
  }
  state() {
    return core.map(ref.get(this.ref), tuple => tuple[1]);
  }
  last() {
    return core.flatMap(ref.get(this.ref), ([element, _]) => {
      switch (element._tag) {
        case "None":
          {
            return core.failSync(() => internalCause.NoSuchElementException());
          }
        case "Some":
          {
            return core.succeed(element.value);
          }
      }
    });
  }
  reset() {
    return ref.set(this.ref, [Option.none(), this.schedule.initial]);
  }
  next(input) {
    return (0, Function_js_1.pipe)(core.map(ref.get(this.ref), tuple => tuple[1]), core.flatMap(state => (0, Function_js_1.pipe)(Clock.currentTimeMillis, core.flatMap(now => (0, Function_js_1.pipe)(core.suspend(() => this.schedule.step(now, input, state)), core.flatMap(([state, out, decision]) => ScheduleDecision.isDone(decision) ? (0, Function_js_1.pipe)(ref.set(this.ref, [Option.some(out), state]), core.zipRight(core.fail(Option.none()))) : (0, Function_js_1.pipe)(ref.set(this.ref, [Option.some(out), state]), core.zipRight(effect.sleep(Duration.millis(Intervals.start(decision.intervals) - now))), core.as(out))))))));
  }
}
/** @internal */
const makeWithState = (initial, step) => new ScheduleImpl(initial, step);
exports.makeWithState = makeWithState;
/** @internal */
exports.addDelay = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.addDelayEffect)(self, out => core.sync(() => f(out))));
/** @internal */
exports.addDelayEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.modifyDelayEffect)(self, (out, duration) => core.map(f(out), delay => Duration.sum(duration, Duration.decode(delay)))));
/** @internal */
exports.andThen = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.map)((0, exports.andThenEither)(self, that), Either.merge));
/** @internal */
exports.andThenEither = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.makeWithState)([self.initial, that.initial, true], (now, input, state) => state[2] ? core.flatMap(self.step(now, input, state[0]), ([lState, out, decision]) => {
  if (ScheduleDecision.isDone(decision)) {
    return core.map(that.step(now, input, state[1]), ([rState, out, decision]) => [[lState, rState, false], Either.right(out), decision]);
  }
  return core.succeed([[lState, state[1], true], Either.left(out), decision]);
}) : core.map(that.step(now, input, state[1]), ([rState, out, decision]) => [[state[0], rState, false], Either.right(out), decision])));
/** @internal */
exports.as = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, out) => (0, exports.map)(self, () => out));
/** @internal */
const asUnit = self => (0, exports.map)(self, Function_js_1.constVoid);
exports.asUnit = asUnit;
/** @internal */
exports.bothInOut = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.makeWithState)([self.initial, that.initial], (now, [in1, in2], state) => core.zipWith(self.step(now, in1, state[0]), that.step(now, in2, state[1]), ([lState, out, lDecision], [rState, out2, rDecision]) => {
  if (ScheduleDecision.isContinue(lDecision) && ScheduleDecision.isContinue(rDecision)) {
    const interval = (0, Function_js_1.pipe)(lDecision.intervals, Intervals.union(rDecision.intervals));
    return [[lState, rState], [out, out2], ScheduleDecision.continue(interval)];
  }
  return [[lState, rState], [out, out2], ScheduleDecision.done];
})));
/** @internal */
exports.check = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, test) => (0, exports.checkEffect)(self, (input, out) => core.sync(() => test(input, out))));
/** @internal */
exports.checkEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, test) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.flatMap(self.step(now, input, state), ([state, out, decision]) => {
  if (ScheduleDecision.isDone(decision)) {
    return core.succeed([state, out, ScheduleDecision.done]);
  }
  return core.map(test(input, out), cont => cont ? [state, out, decision] : [state, out, ScheduleDecision.done]);
})));
/** @internal */
const collectAllInputs = () => (0, exports.collectAllOutputs)((0, exports.identity)());
exports.collectAllInputs = collectAllInputs;
/** @internal */
const collectAllOutputs = self => (0, exports.reduce)(self, Chunk.empty(), (outs, out) => (0, Function_js_1.pipe)(outs, Chunk.append(out)));
exports.collectAllOutputs = collectAllOutputs;
/** @internal */
const collectUntil = f => (0, exports.collectAllOutputs)((0, exports.recurUntil)(f));
exports.collectUntil = collectUntil;
/** @internal */
const collectUntilEffect = f => (0, exports.collectAllOutputs)((0, exports.recurUntilEffect)(f));
exports.collectUntilEffect = collectUntilEffect;
/** @internal */
const collectWhile = f => (0, exports.collectAllOutputs)((0, exports.recurWhile)(f));
exports.collectWhile = collectWhile;
/** @internal */
const collectWhileEffect = f => (0, exports.collectAllOutputs)((0, exports.recurWhileEffect)(f));
exports.collectWhileEffect = collectWhileEffect;
/** @internal */
exports.compose = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.makeWithState)([self.initial, that.initial], (now, input, state) => core.flatMap(self.step(now, input, state[0]), ([lState, out, lDecision]) => core.map(that.step(now, out, state[1]), ([rState, out2, rDecision]) => ScheduleDecision.isDone(lDecision) ? [[lState, rState], out2, ScheduleDecision.done] : ScheduleDecision.isDone(rDecision) ? [[lState, rState], out2, ScheduleDecision.done] : [[lState, rState], out2, ScheduleDecision.continue((0, Function_js_1.pipe)(lDecision.intervals, Intervals.max(rDecision.intervals)))]))));
/** @internal */
exports.mapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapInputEffect)(self, input2 => core.sync(() => f(input2))));
/** @internal */
exports.mapInputContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.mapInputContext(self.step(now, input, state), f)));
/** @internal */
exports.mapInputEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeWithState)(self.initial, (now, input2, state) => core.flatMap(f(input2), input => self.step(now, input, state))));
/** @internal */
const dayOfMonth = day => {
  return (0, exports.makeWithState)([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
    if (!Number.isInteger(day) || day < 1 || 31 < day) {
      return core.dieSync(() => internalCause.IllegalArgumentException(`Invalid argument in: dayOfMonth(${day}). Must be in range 1...31`));
    }
    const n = state[1];
    const initial = n === 0;
    const day0 = (0, exports.nextDayOfMonth)(now, day, initial);
    const start = (0, exports.beginningOfDay)(day0);
    const end = (0, exports.endOfDay)(day0);
    const interval = Interval.make(start, end);
    return core.succeed([[end, n + 1], n, ScheduleDecision.continueWith(interval)]);
  });
};
exports.dayOfMonth = dayOfMonth;
/** @internal */
const dayOfWeek = day => {
  return (0, exports.makeWithState)([Number.MIN_SAFE_INTEGER, 0], (now, _, state) => {
    if (!Number.isInteger(day) || day < 1 || 7 < day) {
      return core.dieSync(() => internalCause.IllegalArgumentException(`Invalid argument in: dayOfWeek(${day}). Must be in range 1 (Monday)...7 (Sunday)`));
    }
    const n = state[1];
    const initial = n === 0;
    const day0 = (0, exports.nextDay)(now, day, initial);
    const start = (0, exports.beginningOfDay)(day0);
    const end = (0, exports.endOfDay)(day0);
    const interval = Interval.make(start, end);
    return core.succeed([[end, n + 1], n, ScheduleDecision.continueWith(interval)]);
  });
};
exports.dayOfWeek = dayOfWeek;
/** @internal */
exports.delayed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.delayedEffect)(self, duration => core.sync(() => f(duration))));
/** @internal */
exports.delayedEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.modifyDelayEffect)(self, (_, delay) => f(delay)));
/** @internal */
const delayedSchedule = schedule => (0, exports.addDelay)(schedule, x => x);
exports.delayedSchedule = delayedSchedule;
/** @internal */
const delays = self => (0, exports.makeWithState)(self.initial, (now, input, state) => (0, Function_js_1.pipe)(self.step(now, input, state), core.flatMap(([state, _, decision]) => {
  if (ScheduleDecision.isDone(decision)) {
    return core.succeed([state, Duration.zero, decision]);
  }
  return core.succeed([state, Duration.millis(Intervals.start(decision.intervals) - now), decision]);
})));
exports.delays = delays;
/** @internal */
exports.mapBoth = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onInput,
  onOutput
}) => (0, exports.map)((0, exports.mapInput)(self, onInput), onOutput));
/** @internal */
exports.mapBothEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onInput,
  onOutput
}) => (0, exports.mapEffect)((0, exports.mapInputEffect)(self, onInput), onOutput));
/** @internal */
const driver = self => (0, Function_js_1.pipe)(ref.make([Option.none(), self.initial]), core.map(ref => new ScheduleDriverImpl(self, ref)));
exports.driver = driver;
/** @internal */
const duration = durationInput => {
  const duration = Duration.decode(durationInput);
  const durationMillis = Duration.toMillis(duration);
  return (0, exports.makeWithState)(true, (now, _, state) => core.succeed(state ? [false, duration, ScheduleDecision.continueWith(Interval.after(now + durationMillis))] : [false, Duration.zero, ScheduleDecision.done]));
};
exports.duration = duration;
/** @internal */
exports.either = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.union)(self, that));
/** @internal */
exports.eitherWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.unionWith)(self, that, f));
/** @internal */
exports.ensuring = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, finalizer) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.flatMap(self.step(now, input, state), ([state, out, decision]) => ScheduleDecision.isDone(decision) ? core.as(finalizer, [state, out, decision]) : core.succeed([state, out, decision]))));
/** @internal */
const exponential = (baseInput, factor = 2.0) => {
  const base = Duration.decode(baseInput);
  return (0, exports.delayedSchedule)((0, exports.map)(exports.forever, i => Duration.times(base, Math.pow(factor, i))));
};
exports.exponential = exponential;
/** @internal */
const fibonacci = oneInput => {
  const one = Duration.decode(oneInput);
  return (0, exports.delayedSchedule)((0, Function_js_1.pipe)((0, exports.unfold)([one, one], ([a, b]) => [b, Duration.sum(a, b)]), (0, exports.map)(out => out[0])));
};
exports.fibonacci = fibonacci;
/** @internal */
const fixed = intervalInput => {
  const interval = Duration.decode(intervalInput);
  const intervalMillis = Duration.toMillis(interval);
  return (0, exports.makeWithState)([Option.none(), 0], (now, _, [option, n]) => core.sync(() => {
    switch (option._tag) {
      case "None":
        {
          return [[Option.some([now, now + intervalMillis]), n + 1], n, ScheduleDecision.continueWith(Interval.after(now + intervalMillis))];
        }
      case "Some":
        {
          const [startMillis, lastRun] = option.value;
          const runningBehind = now > lastRun + intervalMillis;
          const boundary = Equal.equals(interval, Duration.zero) ? interval : Duration.millis(intervalMillis - (now - startMillis) % intervalMillis);
          const sleepTime = Equal.equals(boundary, Duration.zero) ? interval : boundary;
          const nextRun = runningBehind ? now : now + Duration.toMillis(sleepTime);
          return [[Option.some([startMillis, nextRun]), n + 1], n, ScheduleDecision.continueWith(Interval.after(nextRun))];
        }
    }
  }));
};
exports.fixed = fixed;
/** @internal */
const fromDelay = delay => (0, exports.duration)(delay);
exports.fromDelay = fromDelay;
/** @internal */
const fromDelays = (delay, ...delays) => (0, exports.makeWithState)([[delay, ...delays].map(_ => Duration.decode(_)), true], (now, _, [durations, cont]) => core.sync(() => {
  if (cont) {
    const x = durations[0];
    const interval = Interval.after(now + Duration.toMillis(x));
    if (durations.length >= 2) {
      return [[durations.slice(1), true], x, ScheduleDecision.continueWith(interval)];
    }
    const y = durations.slice(1);
    return [[[x, ...y], false], x, ScheduleDecision.continueWith(interval)];
  }
  return [[durations, false], Duration.zero, ScheduleDecision.done];
}));
exports.fromDelays = fromDelays;
/** @internal */
const fromFunction = f => (0, exports.map)((0, exports.identity)(), f);
exports.fromFunction = fromFunction;
/** @internal */
const hourOfDay = hour => (0, exports.makeWithState)([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
  if (!Number.isInteger(hour) || hour < 0 || 23 < hour) {
    return core.dieSync(() => internalCause.IllegalArgumentException(`Invalid argument in: hourOfDay(${hour}). Must be in range 0...23`));
  }
  const n = state[1];
  const initial = n === 0;
  const hour0 = (0, exports.nextHour)(now, hour, initial);
  const start = (0, exports.beginningOfHour)(hour0);
  const end = (0, exports.endOfHour)(hour0);
  const interval = Interval.make(start, end);
  return core.succeed([[end, n + 1], n, ScheduleDecision.continueWith(interval)]);
});
exports.hourOfDay = hourOfDay;
/** @internal */
const identity = () => (0, exports.makeWithState)(void 0, (now, input, state) => core.succeed([state, input, ScheduleDecision.continueWith(Interval.after(now))]));
exports.identity = identity;
/** @internal */
exports.intersect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.intersectWith)(self, that, Intervals.intersect));
/** @internal */
exports.intersectWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.makeWithState)([self.initial, that.initial], (now, input, state) => (0, Function_js_1.pipe)(core.zipWith(self.step(now, input, state[0]), that.step(now, input, state[1]), (a, b) => [a, b]), core.flatMap(([[lState, out, lDecision], [rState, out2, rDecision]]) => {
  if (ScheduleDecision.isContinue(lDecision) && ScheduleDecision.isContinue(rDecision)) {
    return intersectWithLoop(self, that, input, lState, out, lDecision.intervals, rState, out2, rDecision.intervals, f);
  }
  return core.succeed([[lState, rState], [out, out2], ScheduleDecision.done]);
}))));
/** @internal */
const intersectWithLoop = (self, that, input, lState, out, lInterval, rState, out2, rInterval, f) => {
  const combined = f(lInterval, rInterval);
  if (Intervals.isNonEmpty(combined)) {
    return core.succeed([[lState, rState], [out, out2], ScheduleDecision.continue(combined)]);
  }
  if ((0, Function_js_1.pipe)(lInterval, Intervals.lessThan(rInterval))) {
    return core.flatMap(self.step(Intervals.end(lInterval), input, lState), ([lState, out, decision]) => {
      if (ScheduleDecision.isDone(decision)) {
        return core.succeed([[lState, rState], [out, out2], ScheduleDecision.done]);
      }
      return intersectWithLoop(self, that, input, lState, out, decision.intervals, rState, out2, rInterval, f);
    });
  }
  return core.flatMap(that.step(Intervals.end(rInterval), input, rState), ([rState, out2, decision]) => {
    if (ScheduleDecision.isDone(decision)) {
      return core.succeed([[lState, rState], [out, out2], ScheduleDecision.done]);
    }
    return intersectWithLoop(self, that, input, lState, out, lInterval, rState, out2, decision.intervals, f);
  });
};
/** @internal */
const jittered = self => (0, exports.jitteredWith)(self, {
  min: 0.8,
  max: 1.2
});
exports.jittered = jittered;
/** @internal */
exports.jitteredWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const {
    max,
    min
  } = Object.assign({
    min: 0.8,
    max: 1.2
  }, options);
  return (0, exports.delayedEffect)(self, duration => core.map(Random.next, random => {
    const d = Duration.toMillis(duration);
    const jittered = d * min * (1 - random) + d * max * random;
    return Duration.millis(jittered);
  }));
});
/** @internal */
const linear = baseInput => {
  const base = Duration.decode(baseInput);
  return (0, exports.delayedSchedule)((0, exports.map)(exports.forever, i => Duration.times(base, i + 1)));
};
exports.linear = linear;
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapEffect)(self, out => core.sync(() => f(out))));
/** @internal */
exports.mapEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.flatMap(self.step(now, input, state), ([state, out, decision]) => core.map(f(out), out2 => [state, out2, decision]))));
/** @internal */
const minuteOfHour = minute => (0, exports.makeWithState)([Number.MIN_SAFE_INTEGER, 0], (now, _, state) => {
  if (!Number.isInteger(minute) || minute < 0 || 59 < minute) {
    return core.dieSync(() => internalCause.IllegalArgumentException(`Invalid argument in: minuteOfHour(${minute}). Must be in range 0...59`));
  }
  const n = state[1];
  const initial = n === 0;
  const minute0 = (0, exports.nextMinute)(now, minute, initial);
  const start = (0, exports.beginningOfMinute)(minute0);
  const end = (0, exports.endOfMinute)(minute0);
  const interval = Interval.make(start, end);
  return core.succeed([[end, n + 1], n, ScheduleDecision.continueWith(interval)]);
});
exports.minuteOfHour = minuteOfHour;
/** @internal */
exports.modifyDelay = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.modifyDelayEffect)(self, (out, duration) => core.sync(() => f(out, duration))));
/** @internal */
exports.modifyDelayEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.flatMap(self.step(now, input, state), ([state, out, decision]) => {
  if (ScheduleDecision.isDone(decision)) {
    return core.succeed([state, out, decision]);
  }
  const intervals = decision.intervals;
  const delay = Interval.size(Interval.make(now, Intervals.start(intervals)));
  return core.map(f(out, delay), durationInput => {
    const duration = Duration.decode(durationInput);
    const oldStart = Intervals.start(intervals);
    const newStart = now + Duration.toMillis(duration);
    const delta = newStart - oldStart;
    const newEnd = Math.min(Math.max(0, Intervals.end(intervals) + delta), Number.MAX_SAFE_INTEGER);
    const newInterval = Interval.make(newStart, newEnd);
    return [state, out, ScheduleDecision.continueWith(newInterval)];
  });
})));
/** @internal */
exports.onDecision = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.flatMap(self.step(now, input, state), ([state, out, decision]) => core.as(f(out, decision), [state, out, decision]))));
/** @internal */
const passthrough = self => (0, exports.makeWithState)(self.initial, (now, input, state) => (0, Function_js_1.pipe)(self.step(now, input, state), core.map(([state, _, decision]) => [state, input, decision])));
exports.passthrough = passthrough;
/** @internal */
exports.provideContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, context) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.provideContext(self.step(now, input, state), context)));
/** @internal */
exports.provideService = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, service) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.contextWithEffect(env => core.provideContext(
// @ts-expect-error
self.step(now, input, state), Context.add(env, tag, service)))));
/** @internal */
const recurUntil = f => (0, exports.untilInput)((0, exports.identity)(), f);
exports.recurUntil = recurUntil;
/** @internal */
const recurUntilEffect = f => (0, exports.untilInputEffect)((0, exports.identity)(), f);
exports.recurUntilEffect = recurUntilEffect;
/** @internal */
const recurUntilOption = pf => (0, exports.untilOutput)((0, exports.map)((0, exports.identity)(), pf), Option.isSome);
exports.recurUntilOption = recurUntilOption;
/** @internal */
const recurUpTo = durationInput => {
  const duration = Duration.decode(durationInput);
  return (0, exports.whileOutput)(exports.elapsed, elapsed => Duration.lessThan(elapsed, duration));
};
exports.recurUpTo = recurUpTo;
/** @internal */
const recurWhile = f => (0, exports.whileInput)((0, exports.identity)(), f);
exports.recurWhile = recurWhile;
/** @internal */
const recurWhileEffect = f => (0, exports.whileInputEffect)((0, exports.identity)(), f);
exports.recurWhileEffect = recurWhileEffect;
/** @internal */
const recurs = n => (0, exports.whileOutput)(exports.forever, out => out < n);
exports.recurs = recurs;
/** @internal */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => (0, exports.reduceEffect)(self, zero, (z, out) => core.sync(() => f(z, out))));
/** @internal */
exports.reduceEffect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => (0, exports.makeWithState)([self.initial, zero], (now, input, [s, z]) => core.flatMap(self.step(now, input, s), ([s, out, decision]) => ScheduleDecision.isDone(decision) ? core.succeed([[s, z], z, decision]) : core.map(f(z, out), z2 => [[s, z2], z, decision]))));
/** @internal */
const repeatForever = self => (0, exports.makeWithState)(self.initial, (now, input, state) => {
  const step = (now, input, state) => core.flatMap(self.step(now, input, state), ([state, out, decision]) => ScheduleDecision.isDone(decision) ? step(now, input, self.initial) : core.succeed([state, out, decision]));
  return step(now, input, state);
});
exports.repeatForever = repeatForever;
/** @internal */
const repetitions = self => (0, exports.reduce)(self, 0, (n, _) => n + 1);
exports.repetitions = repetitions;
/** @internal */
exports.resetAfter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, durationInput) => {
  const duration = Duration.decode(durationInput);
  return (0, Function_js_1.pipe)(self, (0, exports.intersect)(exports.elapsed), (0, exports.resetWhen)(([, time]) => Duration.greaterThanOrEqualTo(time, duration)), (0, exports.map)(out => out[0]));
});
/** @internal */
exports.resetWhen = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.flatMap(self.step(now, input, state), ([state, out, decision]) => f(out) ? self.step(now, input, self.initial) : core.succeed([state, out, decision]))));
/** @internal */
exports.run = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, now, input) => (0, Function_js_1.pipe)(runLoop(self, now, Chunk.fromIterable(input), self.initial, Chunk.empty()), core.map(list => Chunk.reverse(list))));
/** @internal */
const runLoop = (self, now, inputs, state, acc) => {
  if (!Chunk.isNonEmpty(inputs)) {
    return core.succeed(acc);
  }
  const input = Chunk.headNonEmpty(inputs);
  const nextInputs = Chunk.tailNonEmpty(inputs);
  return core.flatMap(self.step(now, input, state), ([state, out, decision]) => {
    if (ScheduleDecision.isDone(decision)) {
      return core.sync(() => (0, Function_js_1.pipe)(acc, Chunk.prepend(out)));
    }
    return runLoop(self, Intervals.start(decision.intervals), nextInputs, state, Chunk.prepend(acc, out));
  });
};
/** @internal */
const secondOfMinute = second => (0, exports.makeWithState)([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
  if (!Number.isInteger(second) || second < 0 || 59 < second) {
    return core.dieSync(() => internalCause.IllegalArgumentException(`Invalid argument in: secondOfMinute(${second}). Must be in range 0...59`));
  }
  const n = state[1];
  const initial = n === 0;
  const second0 = (0, exports.nextSecond)(now, second, initial);
  const start = (0, exports.beginningOfSecond)(second0);
  const end = (0, exports.endOfSecond)(second0);
  const interval = Interval.make(start, end);
  return core.succeed([[end, n + 1], n, ScheduleDecision.continueWith(interval)]);
});
exports.secondOfMinute = secondOfMinute;
/** @internal */
const spaced = duration => (0, exports.addDelay)(exports.forever, () => duration);
exports.spaced = spaced;
/** @internal */
const succeed = value => (0, exports.map)(exports.forever, () => value);
exports.succeed = succeed;
/** @internal */
const sync = evaluate => (0, exports.map)(exports.forever, evaluate);
exports.sync = sync;
/** @internal */
exports.tapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.zipRight(f(input), self.step(now, input, state))));
/** @internal */
exports.tapOutput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeWithState)(self.initial, (now, input, state) => core.tap(self.step(now, input, state), ([, out]) => f(out))));
/** @internal */
const unfold = (initial, f) => (0, exports.makeWithState)(initial, (now, _, state) => core.sync(() => [f(state), state, ScheduleDecision.continueWith(Interval.after(now))]));
exports.unfold = unfold;
/** @internal */
exports.union = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.unionWith)(self, that, Intervals.union));
/** @internal */
exports.unionWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.makeWithState)([self.initial, that.initial], (now, input, state) => core.zipWith(self.step(now, input, state[0]), that.step(now, input, state[1]), ([lState, l, lDecision], [rState, r, rDecision]) => {
  if (ScheduleDecision.isDone(lDecision) && ScheduleDecision.isDone(rDecision)) {
    return [[lState, rState], [l, r], ScheduleDecision.done];
  }
  if (ScheduleDecision.isDone(lDecision) && ScheduleDecision.isContinue(rDecision)) {
    return [[lState, rState], [l, r], ScheduleDecision.continue(rDecision.intervals)];
  }
  if (ScheduleDecision.isContinue(lDecision) && ScheduleDecision.isDone(rDecision)) {
    return [[lState, rState], [l, r], ScheduleDecision.continue(lDecision.intervals)];
  }
  if (ScheduleDecision.isContinue(lDecision) && ScheduleDecision.isContinue(rDecision)) {
    const combined = f(lDecision.intervals, rDecision.intervals);
    return [[lState, rState], [l, r], ScheduleDecision.continue(combined)];
  }
  throw new Error("BUG: Schedule.unionWith - please report an issue at https://github.com/Effect-TS/io/issues");
})));
/** @internal */
exports.untilInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.check)(self, (input, _) => !f(input)));
/** @internal */
exports.untilInputEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.checkEffect)(self, (input, _) => effect.negate(f(input))));
/** @internal */
exports.untilOutput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.check)(self, (_, out) => !f(out)));
/** @internal */
exports.untilOutputEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.checkEffect)(self, (_, out) => effect.negate(f(out))));
/** @internal */
exports.upTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, duration) => (0, exports.zipLeft)(self, (0, exports.recurUpTo)(duration)));
/** @internal */
exports.whileInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.check)(self, (input, _) => f(input)));
/** @internal */
exports.whileInputEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.checkEffect)(self, (input, _) => f(input)));
/** @internal */
exports.whileOutput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.check)(self, (_, out) => f(out)));
/** @internal */
exports.whileOutputEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.checkEffect)(self, (_, out) => f(out)));
/** @internal */
const windowed = intervalInput => {
  const interval = Duration.decode(intervalInput);
  const millis = Duration.toMillis(interval);
  return (0, exports.makeWithState)([Option.none(), 0], (now, _, [option, n]) => {
    switch (option._tag) {
      case "None":
        {
          return core.succeed([[Option.some(now), n + 1], n, ScheduleDecision.continueWith(Interval.after(now + millis))]);
        }
      case "Some":
        {
          return core.succeed([[Option.some(option.value), n + 1], n, ScheduleDecision.continueWith(Interval.after(now + (millis - (now - option.value) % millis)))]);
        }
    }
  });
};
exports.windowed = windowed;
/** @internal */
exports.zipLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.map)((0, exports.intersect)(self, that), out => out[0]));
/** @internal */
exports.zipRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.map)((0, exports.intersect)(self, that), out => out[1]));
/** @internal */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.map)((0, exports.intersect)(self, that), ([out, out2]) => f(out, out2)));
// -----------------------------------------------------------------------------
// Seconds
// -----------------------------------------------------------------------------
/** @internal */
const beginningOfSecond = now => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0).getTime();
};
exports.beginningOfSecond = beginningOfSecond;
/** @internal */
const endOfSecond = now => {
  const date = new Date((0, exports.beginningOfSecond)(now));
  return date.setSeconds(date.getSeconds() + 1);
};
exports.endOfSecond = endOfSecond;
/** @internal */
const nextSecond = (now, second, initial) => {
  const date = new Date(now);
  if (date.getSeconds() === second && initial) {
    return now;
  }
  if (date.getSeconds() < second) {
    return date.setSeconds(second);
  }
  // Set seconds to the provided value and add one minute
  const newDate = new Date(date.setSeconds(second));
  return newDate.setTime(newDate.getTime() + 1000 * 60);
};
exports.nextSecond = nextSecond;
// -----------------------------------------------------------------------------
// Minutes
// -----------------------------------------------------------------------------
/** @internal */
const beginningOfMinute = now => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0).getTime();
};
exports.beginningOfMinute = beginningOfMinute;
/** @internal */
const endOfMinute = now => {
  const date = new Date((0, exports.beginningOfMinute)(now));
  return date.setMinutes(date.getMinutes() + 1);
};
exports.endOfMinute = endOfMinute;
/** @internal */
const nextMinute = (now, minute, initial) => {
  const date = new Date(now);
  if (date.getMinutes() === minute && initial) {
    return now;
  }
  if (date.getMinutes() < minute) {
    return date.setMinutes(minute);
  }
  // Set minutes to the provided value and add one hour
  const newDate = new Date(date.setMinutes(minute));
  return newDate.setTime(newDate.getTime() + 1000 * 60 * 60);
};
exports.nextMinute = nextMinute;
// -----------------------------------------------------------------------------
// Hours
// -----------------------------------------------------------------------------
/** @internal */
const beginningOfHour = now => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0).getTime();
};
exports.beginningOfHour = beginningOfHour;
/** @internal */
const endOfHour = now => {
  const date = new Date((0, exports.beginningOfHour)(now));
  return date.setHours(date.getHours() + 1);
};
exports.endOfHour = endOfHour;
/** @internal */
const nextHour = (now, hour, initial) => {
  const date = new Date(now);
  if (date.getHours() === hour && initial) {
    return now;
  }
  if (date.getHours() < hour) {
    return date.setHours(hour);
  }
  // Set hours to the provided value and add one day
  const newDate = new Date(date.setHours(hour));
  return newDate.setTime(newDate.getTime() + 1000 * 60 * 60 * 24);
};
exports.nextHour = nextHour;
// -----------------------------------------------------------------------------
// Days
// -----------------------------------------------------------------------------
/** @internal */
const beginningOfDay = now => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
};
exports.beginningOfDay = beginningOfDay;
/** @internal */
const endOfDay = now => {
  const date = new Date((0, exports.beginningOfDay)(now));
  return date.setDate(date.getDate() + 1);
};
exports.endOfDay = endOfDay;
/** @internal */
const nextDay = (now, dayOfWeek, initial) => {
  const date = new Date(now);
  if (date.getDay() === dayOfWeek && initial) {
    return now;
  }
  const nextDayOfWeek = (7 + dayOfWeek - date.getDay()) % 7;
  return date.setDate(date.getDate() + (nextDayOfWeek === 0 ? 7 : nextDayOfWeek));
};
exports.nextDay = nextDay;
/** @internal */
const nextDayOfMonth = (now, day, initial) => {
  const date = new Date(now);
  if (date.getDate() === day && initial) {
    return now;
  }
  if (date.getDate() < day) {
    return date.setDate(day);
  }
  return (0, exports.findNextMonth)(now, day, 1);
};
exports.nextDayOfMonth = nextDayOfMonth;
/** @internal */
const findNextMonth = (now, day, months) => {
  const d = new Date(now);
  const tmp1 = new Date(d.setDate(day));
  const tmp2 = new Date(tmp1.setMonth(tmp1.getMonth() + months));
  if (tmp2.getDate() === day) {
    const d2 = new Date(now);
    const tmp3 = new Date(d2.setDate(day));
    return tmp3.setMonth(tmp3.getMonth() + months);
  }
  return (0, exports.findNextMonth)(now, day, months + 1);
};
exports.findNextMonth = findNextMonth;
// circular with Effect
/** @internal */
exports.repeat_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, exports.repeatOrElse_Effect)(self, schedule, (e, _) => core.fail(e)));
/** @internal */
exports.repeatOrElse_Effect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, schedule, orElse) => core.flatMap((0, exports.driver)(schedule), driver => core.matchEffect(self, {
  onFailure: error => orElse(error, Option.none()),
  onSuccess: value => repeatOrElseEffectLoop(self, driver, orElse, value)
})));
/** @internal */
const repeatOrElseEffectLoop = (self, driver, orElse, value) => {
  return core.matchEffect(driver.next(value), {
    onFailure: () => core.orDie(driver.last()),
    onSuccess: b => core.matchEffect(self, {
      onFailure: error => orElse(error, Option.some(b)),
      onSuccess: value => repeatOrElseEffectLoop(self, driver, orElse, value)
    })
  });
};
/** @internal */
exports.repeatUntil_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.repeatUntilEffect_Effect)(self, a => core.sync(() => f(a))));
/** @internal */
exports.repeatUntilEffect_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.flatMap(self, a => core.flatMap(f(a), result => result ? core.succeed(a) : core.flatMap(core.yieldNow(), () => (0, exports.repeatUntilEffect_Effect)(self, f)))));
/** @internal */
exports.repeatWhile_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.repeatWhileEffect_Effect)(self, a => core.sync(() => f(a))));
/** @internal */
exports.repeatWhileEffect_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.repeatUntilEffect_Effect)(self, a => effect.negate(f(a))));
/** @internal */
exports.retry_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, policy) => (0, exports.retryOrElse_Effect)(self, policy, (e, _) => core.fail(e)));
/** @internal */
exports.retryN_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => retryN_EffectLoop(self, n));
/** @internal */
const retryN_EffectLoop = (self, n) => {
  return core.catchAll(self, e => n < 0 ? core.fail(e) : core.flatMap(core.yieldNow(), () => retryN_EffectLoop(self, n - 1)));
};
/** @internal */
exports.retryOrElse_Effect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, policy, orElse) => core.flatMap((0, exports.driver)(policy), driver => retryOrElse_EffectLoop(self, driver, orElse)));
/** @internal */
const retryOrElse_EffectLoop = (self, driver, orElse) => {
  return core.catchAll(self, e => core.matchEffect(driver.next(e), {
    onFailure: () => (0, Function_js_1.pipe)(driver.last(), core.orDie, core.flatMap(out => orElse(e, out))),
    onSuccess: () => retryOrElse_EffectLoop(self, driver, orElse)
  }));
};
/** @internal */
exports.retryUntil_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.retryUntilEffect_Effect)(self, e => core.sync(() => f(e))));
/** @internal */
exports.retryUntilEffect_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.catchAll(self, e => core.flatMap(f(e), b => b ? core.fail(e) : core.flatMap(core.yieldNow(), () => (0, exports.retryUntilEffect_Effect)(self, f)))));
/** @internal */
exports.retryWhile_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.retryWhileEffect_Effect)(self, e => core.sync(() => f(e))));
/** @internal */
exports.retryWhileEffect_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.retryUntilEffect_Effect)(self, e => effect.negate(f(e))));
/** @internal */
exports.schedule_Effect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, schedule) => (0, exports.scheduleFrom_Effect)(self, void 0, schedule));
/** @internal */
exports.scheduleFrom_Effect = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, initial, schedule) => core.flatMap((0, exports.driver)(schedule), driver => scheduleFrom_EffectLoop(self, initial, driver)));
/** @internal */
const scheduleFrom_EffectLoop = (self, initial, driver) => core.matchEffect(driver.next(initial), {
  onFailure: () => core.orDie(driver.last()),
  onSuccess: () => core.flatMap(self, a => scheduleFrom_EffectLoop(self, a, driver))
});
/** @internal */
exports.count = /*#__PURE__*/(0, exports.unfold)(0, n => n + 1);
/** @internal */
exports.elapsed = /*#__PURE__*/(0, exports.makeWithState)( /*#__PURE__*/Option.none(), (now, _, state) => {
  switch (state._tag) {
    case "None":
      {
        return core.succeed([Option.some(now), Duration.zero, ScheduleDecision.continueWith(Interval.after(now))]);
      }
    case "Some":
      {
        return core.succeed([Option.some(state.value), Duration.millis(now - state.value), ScheduleDecision.continueWith(Interval.after(now))]);
      }
  }
});
/** @internal */
exports.forever = /*#__PURE__*/(0, exports.unfold)(0, n => n + 1);
/** @internal */
exports.once = /*#__PURE__*/(0, exports.asUnit)( /*#__PURE__*/(0, exports.recurs)(1));
/** @internal */
exports.stop = /*#__PURE__*/(0, exports.asUnit)( /*#__PURE__*/(0, exports.recurs)(0));
//# sourceMappingURL=schedule.js.map