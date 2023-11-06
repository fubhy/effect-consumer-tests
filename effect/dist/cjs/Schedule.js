"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jitteredWith = exports.jittered = exports.intersectWith = exports.intersect = exports.identity = exports.hourOfDay = exports.fromFunction = exports.fromDelays = exports.fromDelay = exports.forever = exports.fixed = exports.fibonacci = exports.exponential = exports.ensuring = exports.elapsed = exports.eitherWith = exports.either = exports.duration = exports.driver = exports.mapBothEffect = exports.mapBoth = exports.delays = exports.delayedSchedule = exports.delayedEffect = exports.delayed = exports.dayOfWeek = exports.dayOfMonth = exports.count = exports.mapInputEffect = exports.mapInputContext = exports.mapInput = exports.compose = exports.collectWhileEffect = exports.collectWhile = exports.collectUntilEffect = exports.collectUntil = exports.collectAllOutputs = exports.collectAllInputs = exports.checkEffect = exports.check = exports.bothInOut = exports.asUnit = exports.as = exports.andThenEither = exports.andThen = exports.addDelayEffect = exports.addDelay = exports.makeWithState = exports.ScheduleDriverTypeId = exports.ScheduleTypeId = void 0;
exports.zipWith = exports.zipRight = exports.zipLeft = exports.windowed = exports.whileOutputEffect = exports.whileOutput = exports.whileInputEffect = exports.whileInput = exports.upTo = exports.untilOutputEffect = exports.untilOutput = exports.untilInputEffect = exports.untilInput = exports.unionWith = exports.union = exports.unfold = exports.tapOutput = exports.tapInput = exports.sync = exports.succeed = exports.stop = exports.spaced = exports.secondOfMinute = exports.run = exports.resetWhen = exports.resetAfter = exports.repetitions = exports.repeatForever = exports.reduceEffect = exports.reduce = exports.recurs = exports.recurWhileEffect = exports.recurWhile = exports.recurUpTo = exports.recurUntilOption = exports.recurUntilEffect = exports.recurUntil = exports.provideService = exports.provideContext = exports.passthrough = exports.once = exports.onDecision = exports.modifyDelayEffect = exports.modifyDelay = exports.minuteOfHour = exports.mapEffect = exports.map = exports.linear = void 0;
const internal = /*#__PURE__*/require("./internal/schedule.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ScheduleTypeId = internal.ScheduleTypeId;
/**
 * @since 2.0.0
 * @category symbols
 */
exports.ScheduleDriverTypeId = internal.ScheduleDriverTypeId;
/**
 * Constructs a new `Schedule` with the specified `initial` state and the
 * specified `step` function.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.makeWithState = internal.makeWithState;
/**
 * Returns a new schedule with the given delay added to every interval defined
 * by this schedule.
 *
 * @since 2.0.0
 * @category utils
 */
exports.addDelay = internal.addDelay;
/**
 * Returns a new schedule with the given effectfully computed delay added to
 * every interval defined by this schedule.
 *
 * @since 2.0.0
 * @category utils
 */
exports.addDelayEffect = internal.addDelayEffect;
/**
 * The same as `andThenEither`, but merges the output.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.andThen = internal.andThen;
/**
 * Returns a new schedule that first executes this schedule to completion, and
 * then executes the specified schedule to completion.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.andThenEither = internal.andThenEither;
/**
 * Returns a new schedule that maps this schedule to a constant output.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.as = internal.as;
/**
 * Returns a new schedule that maps the output of this schedule to unit.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.asUnit = internal.asUnit;
/**
 * Returns a new schedule that has both the inputs and outputs of this and the
 * specified schedule.
 *
 * @since 2.0.0
 * @category utils
 */
exports.bothInOut = internal.bothInOut;
/**
 * Returns a new schedule that passes each input and output of this schedule
 * to the specified function, and then determines whether or not to continue
 * based on the return value of the function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.check = internal.check;
/**
 * Returns a new schedule that passes each input and output of this schedule
 * to the specified function, and then determines whether or not to continue
 * based on the return value of the function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.checkEffect = internal.checkEffect;
/**
 * A schedule that recurs anywhere, collecting all inputs into a `Chunk`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.collectAllInputs = internal.collectAllInputs;
/**
 * Returns a new schedule that collects the outputs of this one into a chunk.
 *
 * @since 2.0.0
 * @category utils
 */
exports.collectAllOutputs = internal.collectAllOutputs;
/**
 * A schedule that recurs until the condition f fails, collecting all inputs
 * into a list.
 *
 * @since 2.0.0
 * @category utils
 */
exports.collectUntil = internal.collectUntil;
/**
 * A schedule that recurs until the effectful condition f fails, collecting
 * all inputs into a list.
 *
 * @since 2.0.0
 * @category utils
 */
exports.collectUntilEffect = internal.collectUntilEffect;
/**
 * A schedule that recurs as long as the condition f holds, collecting all
 * inputs into a list.
 *
 * @since 2.0.0
 * @category utils
 */
exports.collectWhile = internal.collectWhile;
/**
 * A schedule that recurs as long as the effectful condition holds, collecting
 * all inputs into a list.
 *
 * @category utils
 * @since 2.0.0
 */
exports.collectWhileEffect = internal.collectWhileEffect;
/**
 * Returns the composition of this schedule and the specified schedule, by
 * piping the output of this one into the input of the other. Effects
 * described by this schedule will always be executed before the effects
 * described by the second schedule.
 *
 * @since 2.0.0
 * @category utils
 */
exports.compose = internal.compose;
/**
 * Returns a new schedule that deals with a narrower class of inputs than this
 * schedule.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapInput = internal.mapInput;
/**
 * Transforms the context being provided to this schedule with the
 * specified function.
 *
 * @since 2.0.0
 * @category context
 */
exports.mapInputContext = internal.mapInputContext;
/**
 * Returns a new schedule that deals with a narrower class of inputs than this
 * schedule.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapInputEffect = internal.mapInputEffect;
/**
 * A schedule that always recurs, which counts the number of recurrences.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.count = internal.count;
/**
 * Cron-like schedule that recurs every specified `day` of month. Won't recur
 * on months containing less days than specified in `day` param.
 *
 * It triggers at zero hour of the day. Producing a count of repeats: 0, 1, 2.
 *
 * NOTE: `day` parameter is validated lazily. Must be in range 1...31.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dayOfMonth = internal.dayOfMonth;
/**
 * Cron-like schedule that recurs every specified `day` of each week. It
 * triggers at zero hour of the week. Producing a count of repeats: 0, 1, 2.
 *
 * NOTE: `day` parameter is validated lazily. Must be in range 1 (Monday)...7
 * (Sunday).
 *
 * @since 2.0.0
 * @category constructors
 */
exports.dayOfWeek = internal.dayOfWeek;
/**
 * Returns a new schedule with the specified effectfully computed delay added
 * before the start of each interval produced by this schedule.
 *
 * @since 2.0.0
 * @category utils
 */
exports.delayed = internal.delayed;
/**
 * Returns a new schedule with the specified effectfully computed delay added
 * before the start of each interval produced by this schedule.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.delayedEffect = internal.delayedEffect;
/**
 * Takes a schedule that produces a delay, and returns a new schedule that
 * uses this delay to further delay intervals in the resulting schedule.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.delayedSchedule = internal.delayedSchedule;
/**
 * Returns a new schedule that outputs the delay between each occurence.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.delays = internal.delays;
/**
 * Returns a new schedule that maps both the input and output.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapBoth = internal.mapBoth;
/**
 * Returns a new schedule that maps both the input and output.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapBothEffect = internal.mapBothEffect;
/**
 * Returns a driver that can be used to step the schedule, appropriately
 * handling sleeping.
 *
 * @since 2.0.0
 * @category getter
 */
exports.driver = internal.driver;
/**
 * A schedule that can recur one time, the specified amount of time into the
 * future.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.duration = internal.duration;
/**
 * Returns a new schedule that performs a geometric union on the intervals
 * defined by both schedules.
 *
 * @since 2.0.0
 * @category alternatives
 */
exports.either = internal.either;
/**
 * The same as `either` followed by `map`.
 *
 * @since 2.0.0
 * @category alternatives
 */
exports.eitherWith = internal.eitherWith;
/**
 * A schedule that occurs everywhere, which returns the total elapsed duration
 * since the first step.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.elapsed = internal.elapsed;
/**
 * Returns a new schedule that will run the specified finalizer as soon as the
 * schedule is complete. Note that unlike `Effect.ensuring`, this method does not
 * guarantee the finalizer will be run. The `Schedule` may not initialize or
 * the driver of the schedule may not run to completion. However, if the
 * `Schedule` ever decides not to continue, then the finalizer will be run.
 *
 * @since 2.0.0
 * @category finalization
 */
exports.ensuring = internal.ensuring;
/**
 * A schedule that always recurs, but will wait a certain amount between
 * repetitions, given by `base * factor.pow(n)`, where `n` is the number of
 * repetitions so far. Returns the current duration between recurrences.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.exponential = internal.exponential;
/**
 * A schedule that always recurs, increasing delays by summing the preceding
 * two delays (similar to the fibonacci sequence). Returns the current
 * duration between recurrences.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fibonacci = internal.fibonacci;
/**
 * A schedule that recurs on a fixed interval. Returns the number of
 * repetitions of the schedule so far.
 *
 * If the action run between updates takes longer than the interval, then the
 * action will be run immediately, but re-runs will not "pile up".
 *
 * ```
 * |-----interval-----|-----interval-----|-----interval-----|
 * |---------action--------||action|-----|action|-----------|
 * ```
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fixed = internal.fixed;
/**
 * A schedule that always recurs, producing a count of repeats: 0, 1, 2.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.forever = internal.forever;
/**
 * A schedule that recurs once with the specified delay.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromDelay = internal.fromDelay;
/**
 * A schedule that recurs once for each of the specified durations, delaying
 * each time for the length of the specified duration. Returns the length of
 * the current duration between recurrences.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromDelays = internal.fromDelays;
/**
 * A schedule that always recurs, mapping input values through the specified
 * function.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromFunction = internal.fromFunction;
/**
 * Cron-like schedule that recurs every specified `hour` of each day. It
 * triggers at zero minute of the hour. Producing a count of repeats: 0, 1, 2.
 *
 * NOTE: `hour` parameter is validated lazily. Must be in range 0...23.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.hourOfDay = internal.hourOfDay;
/**
 * A schedule that always recurs, which returns inputs as outputs.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.identity = internal.identity;
/**
 * Returns a new schedule that performs a geometric intersection on the
 * intervals defined by both schedules.
 *
 * @since 2.0.0
 * @category utils
 */
exports.intersect = internal.intersect;
/**
 * Returns a new schedule that combines this schedule with the specified
 * schedule, continuing as long as both schedules want to continue and merging
 * the next intervals according to the specified merge function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.intersectWith = internal.intersectWith;
/**
 * Returns a new schedule that randomly modifies the size of the intervals of
 * this schedule.
 *
 * Defaults `min` to `0.8` and `max` to `1.2`.
 *
 * The new interval size is between `min * old interval size` and `max * old
 * interval size`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.jittered = internal.jittered;
/**
 * Returns a new schedule that randomly modifies the size of the intervals of
 * this schedule.
 *
 * The new interval size is between `min * old interval size` and `max * old
 * interval size`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.jitteredWith = internal.jitteredWith;
/**
 * A schedule that always recurs, but will repeat on a linear time interval,
 * given by `base * n` where `n` is the number of repetitions so far. Returns
 * the current duration between recurrences.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.linear = internal.linear;
/**
 * Returns a new schedule that maps the output of this schedule through the
 * specified function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = internal.map;
/**
 * Returns a new schedule that maps the output of this schedule through the
 * specified effectful function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.mapEffect = internal.mapEffect;
/**
 * Cron-like schedule that recurs every specified `minute` of each hour. It
 * triggers at zero second of the minute. Producing a count of repeats: 0, 1,
 * 2.
 *
 * NOTE: `minute` parameter is validated lazily. Must be in range 0...59.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.minuteOfHour = internal.minuteOfHour;
/**
 * Returns a new schedule that modifies the delay using the specified
 * function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.modifyDelay = internal.modifyDelay;
/**
 * Returns a new schedule that modifies the delay using the specified
 * effectual function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.modifyDelayEffect = internal.modifyDelayEffect;
/**
 * Returns a new schedule that applies the current one but runs the specified
 * effect for every decision of this schedule. This can be used to create
 * schedules that log failures, decisions, or computed values.
 *
 * @since 2.0.0
 * @category utils
 */
exports.onDecision = internal.onDecision;
/**
 * A schedule that recurs one time.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.once = internal.once;
/**
 * Returns a new schedule that passes through the inputs of this schedule.
 *
 * @since 2.0.0
 * @category utils
 */
exports.passthrough = internal.passthrough;
/**
 * Returns a new schedule with its context provided to it, so the
 * resulting schedule does not require any context.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideContext = internal.provideContext;
/**
 * Returns a new schedule with the single service it requires provided to it.
 * If the schedule requires multiple services use `provideContext`
 * instead.
 *
 * @since 2.0.0
 * @category context
 */
exports.provideService = internal.provideService;
/**
 * A schedule that recurs for until the predicate evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.recurUntil = internal.recurUntil;
/**
 * A schedule that recurs for until the predicate evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.recurUntilEffect = internal.recurUntilEffect;
/**
 * A schedule that recurs for until the input value becomes applicable to
 * partial function and then map that value with given function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.recurUntilOption = internal.recurUntilOption;
/**
 * A schedule that recurs during the given duration.
 *
 * @since 2.0.0
 * @category utils
 */
exports.recurUpTo = internal.recurUpTo;
/**
 * A schedule that recurs for as long as the predicate evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.recurWhile = internal.recurWhile;
/**
 * A schedule that recurs for as long as the effectful predicate evaluates to
 * true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.recurWhileEffect = internal.recurWhileEffect;
/**
 * A schedule spanning all time, which can be stepped only the specified
 * number of times before it terminates.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.recurs = internal.recurs;
/**
 * Returns a new schedule that folds over the outputs of this one.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduce = internal.reduce;
/**
 * Returns a new schedule that effectfully folds over the outputs of this one.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduceEffect = internal.reduceEffect;
/**
 * Returns a new schedule that loops this one continuously, resetting the
 * state when this schedule is done.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.repeatForever = internal.forever;
/**
 * Returns a new schedule that outputs the number of repetitions of this one.
 *
 * @since 2.0.0
 * @category utils
 */
exports.repetitions = internal.repetitions;
/**
 * Return a new schedule that automatically resets the schedule to its initial
 * state after some time of inactivity defined by `duration`.
 *
 * @since 2.0.0
 * @category utils
 */
exports.resetAfter = internal.resetAfter;
/**
 * Resets the schedule when the specified predicate on the schedule output
 * evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.resetWhen = internal.resetWhen;
/**
 * Runs a schedule using the provided inputs, and collects all outputs.
 *
 * @since 2.0.0
 * @category destructors
 */
exports.run = internal.run;
/**
 * Cron-like schedule that recurs every specified `second` of each minute. It
 * triggers at zero nanosecond of the second. Producing a count of repeats: 0,
 * 1, 2.
 *
 * NOTE: `second` parameter is validated lazily. Must be in range 0...59.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.secondOfMinute = internal.secondOfMinute;
/**
 * Returns a schedule that recurs continuously, each repetition spaced the
 * specified duration from the last run.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.spaced = internal.spaced;
/**
 * A schedule that does not recur, it just stops.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.stop = internal.stop;
/**
 * Returns a schedule that repeats one time, producing the specified constant
 * value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.succeed = internal.succeed;
/**
 * Returns a schedule that repeats one time, producing the specified constant
 * value.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.sync = internal.sync;
/**
 * Returns a new schedule that effectfully processes every input to this
 * schedule.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapInput = internal.tapInput;
/**
 * Returns a new schedule that effectfully processes every output from this
 * schedule.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.tapOutput = internal.tapOutput;
/**
 * Unfolds a schedule that repeats one time from the specified state and
 * iterator.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.unfold = internal.unfold;
/**
 * Returns a new schedule that performs a geometric union on the intervals
 * defined by both schedules.
 *
 * @since 2.0.0
 * @category utils
 */
exports.union = internal.union;
/**
 * Returns a new schedule that combines this schedule with the specified
 * schedule, continuing as long as either schedule wants to continue and
 * merging the next intervals according to the specified merge function.
 *
 * @since 2.0.0
 * @category utils
 */
exports.unionWith = internal.unionWith;
/**
 * Returns a new schedule that continues until the specified predicate on the
 * input evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.untilInput = internal.untilInput;
/**
 * Returns a new schedule that continues until the specified effectful
 * predicate on the input evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.untilInputEffect = internal.untilInputEffect;
/**
 * Returns a new schedule that continues until the specified predicate on the
 * output evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.untilOutput = internal.untilOutput;
/**
 * Returns a new schedule that continues until the specified effectful
 * predicate on the output evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.untilOutputEffect = internal.untilOutputEffect;
/**
 * A schedule that recurs during the given duration.
 *
 * @since 2.0.0
 * @category utils
 */
exports.upTo = internal.upTo;
/**
 * Returns a new schedule that continues for as long the specified predicate
 * on the input evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.whileInput = internal.whileInput;
/**
 * Returns a new schedule that continues for as long the specified effectful
 * predicate on the input evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.whileInputEffect = internal.whileInputEffect;
/**
 * Returns a new schedule that continues for as long the specified predicate
 * on the output evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.whileOutput = internal.whileOutput;
/**
 * Returns a new schedule that continues for as long the specified effectful
 * predicate on the output evaluates to true.
 *
 * @since 2.0.0
 * @category utils
 */
exports.whileOutputEffect = internal.whileOutputEffect;
/**
 * A schedule that divides the timeline to `interval`-long windows, and sleeps
 * until the nearest window boundary every time it recurs.
 *
 * For example, `windowed(Duration.seconds(10))` would produce a schedule as
 * follows:
 *
 * ```
 *      10s        10s        10s       10s
 * |----------|----------|----------|----------|
 * |action------|sleep---|act|-sleep|action----|
 * ```
 *
 * @since 2.0.0
 * @category constructors
 */
exports.windowed = internal.windowed;
/**
 * The same as `intersect` but ignores the right output.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipLeft = internal.zipLeft;
/**
 * The same as `intersect` but ignores the left output.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipRight = internal.zipRight;
/**
 * Equivalent to `intersect` followed by `map`.
 *
 * @since 2.0.0
 * @category zipping
 */
exports.zipWith = internal.zipWith;
//# sourceMappingURL=Schedule.js.map