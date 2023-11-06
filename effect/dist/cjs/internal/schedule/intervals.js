"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.max = exports.isNonEmpty = exports.lessThan = exports.end = exports.start = exports.intersect = exports.union = exports.fromIterable = exports.empty = exports.make = exports.IntervalsTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
const Interval = /*#__PURE__*/require("../../ScheduleInterval.js");
/** @internal */
const IntervalsSymbolKey = "effect/ScheduleIntervals";
/** @internal */
exports.IntervalsTypeId = /*#__PURE__*/Symbol.for(IntervalsSymbolKey);
/** @internal */
const make = intervals => {
  return {
    [exports.IntervalsTypeId]: exports.IntervalsTypeId,
    intervals
  };
};
exports.make = make;
/** @internal */
exports.empty = /*#__PURE__*/(0, exports.make)( /*#__PURE__*/Chunk.empty());
/** @internal */
const fromIterable = intervals => Array.from(intervals).reduce((intervals, interval) => (0, Function_js_1.pipe)(intervals, (0, exports.union)((0, exports.make)(Chunk.of(interval)))), exports.empty);
exports.fromIterable = fromIterable;
/** @internal */
exports.union = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (!Chunk.isNonEmpty(that.intervals)) {
    return self;
  }
  if (!Chunk.isNonEmpty(self.intervals)) {
    return that;
  }
  if (Chunk.headNonEmpty(self.intervals).startMillis < Chunk.headNonEmpty(that.intervals).startMillis) {
    return unionLoop(Chunk.tailNonEmpty(self.intervals), that.intervals, Chunk.headNonEmpty(self.intervals), Chunk.empty());
  }
  return unionLoop(self.intervals, Chunk.tailNonEmpty(that.intervals), Chunk.headNonEmpty(that.intervals), Chunk.empty());
});
/** @internal */
const unionLoop = (_self, _that, _interval, _acc) => {
  let self = _self;
  let that = _that;
  let interval = _interval;
  let acc = _acc;
  while (Chunk.isNonEmpty(self) || Chunk.isNonEmpty(that)) {
    if (!Chunk.isNonEmpty(self) && Chunk.isNonEmpty(that)) {
      if (interval.endMillis < Chunk.headNonEmpty(that).startMillis) {
        acc = (0, Function_js_1.pipe)(acc, Chunk.prepend(interval));
        interval = Chunk.headNonEmpty(that);
        that = Chunk.tailNonEmpty(that);
        self = Chunk.empty();
      } else {
        interval = Interval.make(interval.startMillis, Chunk.headNonEmpty(that).endMillis);
        that = Chunk.tailNonEmpty(that);
        self = Chunk.empty();
      }
    } else if (Chunk.isNonEmpty(self) && Chunk.isEmpty(that)) {
      if (interval.endMillis < Chunk.headNonEmpty(self).startMillis) {
        acc = (0, Function_js_1.pipe)(acc, Chunk.prepend(interval));
        interval = Chunk.headNonEmpty(self);
        that = Chunk.empty();
        self = Chunk.tailNonEmpty(self);
      } else {
        interval = Interval.make(interval.startMillis, Chunk.headNonEmpty(self).endMillis);
        that = Chunk.empty();
        self = Chunk.tailNonEmpty(self);
      }
    } else if (Chunk.isNonEmpty(self) && Chunk.isNonEmpty(that)) {
      if (Chunk.headNonEmpty(self).startMillis < Chunk.headNonEmpty(that).startMillis) {
        if (interval.endMillis < Chunk.headNonEmpty(self).startMillis) {
          acc = (0, Function_js_1.pipe)(acc, Chunk.prepend(interval));
          interval = Chunk.headNonEmpty(self);
          self = Chunk.tailNonEmpty(self);
        } else {
          interval = Interval.make(interval.startMillis, Chunk.headNonEmpty(self).endMillis);
          self = Chunk.tailNonEmpty(self);
        }
      } else if (interval.endMillis < Chunk.headNonEmpty(that).startMillis) {
        acc = (0, Function_js_1.pipe)(acc, Chunk.prepend(interval));
        interval = Chunk.headNonEmpty(that);
        that = Chunk.tailNonEmpty(that);
      } else {
        interval = Interval.make(interval.startMillis, Chunk.headNonEmpty(that).endMillis);
        that = Chunk.tailNonEmpty(that);
      }
    } else {
      throw new Error("BUG: Intervals.unionLoop - please report an issue at https://github.com/Effect-TS/io/issues");
    }
  }
  return (0, exports.make)((0, Function_js_1.pipe)(acc, Chunk.prepend(interval), Chunk.reverse));
};
/** @internal */
exports.intersect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => intersectLoop(self.intervals, that.intervals, Chunk.empty()));
/** @internal */
const intersectLoop = (_left, _right, _acc) => {
  let left = _left;
  let right = _right;
  let acc = _acc;
  while (Chunk.isNonEmpty(left) && Chunk.isNonEmpty(right)) {
    const interval = (0, Function_js_1.pipe)(Chunk.headNonEmpty(left), Interval.intersect(Chunk.headNonEmpty(right)));
    const intervals = Interval.isEmpty(interval) ? acc : (0, Function_js_1.pipe)(acc, Chunk.prepend(interval));
    if ((0, Function_js_1.pipe)(Chunk.headNonEmpty(left), Interval.lessThan(Chunk.headNonEmpty(right)))) {
      left = Chunk.tailNonEmpty(left);
    } else {
      right = Chunk.tailNonEmpty(right);
    }
    acc = intervals;
  }
  return (0, exports.make)(Chunk.reverse(acc));
};
/** @internal */
const start = self => {
  return (0, Function_js_1.pipe)(self.intervals, Chunk.head, Option.getOrElse(() => Interval.empty)).startMillis;
};
exports.start = start;
/** @internal */
const end = self => {
  return (0, Function_js_1.pipe)(self.intervals, Chunk.head, Option.getOrElse(() => Interval.empty)).endMillis;
};
exports.end = end;
/** @internal */
exports.lessThan = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.start)(self) < (0, exports.start)(that));
/** @internal */
const isNonEmpty = self => {
  return Chunk.isNonEmpty(self.intervals);
};
exports.isNonEmpty = isNonEmpty;
/** @internal */
exports.max = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.lessThan)(self, that) ? that : self);
//# sourceMappingURL=intervals.js.map