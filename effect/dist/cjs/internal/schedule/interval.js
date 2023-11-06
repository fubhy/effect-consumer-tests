"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.before = exports.after = exports.union = exports.size = exports.intersect = exports.isNonEmpty = exports.isEmpty = exports.max = exports.min = exports.lessThan = exports.make = exports.empty = exports.IntervalTypeId = void 0;
const Duration = /*#__PURE__*/require("../../Duration.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
/** @internal */
const IntervalSymbolKey = "effect/ScheduleInterval";
/** @internal */
exports.IntervalTypeId = /*#__PURE__*/Symbol.for(IntervalSymbolKey);
/** @internal */
exports.empty = {
  [exports.IntervalTypeId]: exports.IntervalTypeId,
  startMillis: 0,
  endMillis: 0
};
/** @internal */
const make = (startMillis, endMillis) => {
  if (startMillis > endMillis) {
    return exports.empty;
  }
  return {
    [exports.IntervalTypeId]: exports.IntervalTypeId,
    startMillis,
    endMillis
  };
};
exports.make = make;
/** @internal */
exports.lessThan = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.min)(self, that) === self);
/** @internal */
exports.min = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (self.endMillis <= that.startMillis) return self;
  if (that.endMillis <= self.startMillis) return that;
  if (self.startMillis < that.startMillis) return self;
  if (that.startMillis < self.startMillis) return that;
  if (self.endMillis <= that.endMillis) return self;
  return that;
});
/** @internal */
exports.max = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.min)(self, that) === self ? that : self);
/** @internal */
const isEmpty = self => {
  return self.startMillis >= self.endMillis;
};
exports.isEmpty = isEmpty;
/** @internal */
const isNonEmpty = self => {
  return !(0, exports.isEmpty)(self);
};
exports.isNonEmpty = isNonEmpty;
/** @internal */
exports.intersect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  const start = Math.max(self.startMillis, that.startMillis);
  const end = Math.min(self.endMillis, that.endMillis);
  return (0, exports.make)(start, end);
});
/** @internal */
const size = self => {
  return Duration.millis(self.endMillis - self.startMillis);
};
exports.size = size;
/** @internal */
exports.union = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  const start = Math.max(self.startMillis, that.startMillis);
  const end = Math.min(self.endMillis, that.endMillis);
  return start < end ? Option.none() : Option.some((0, exports.make)(start, end));
});
/** @internal */
const after = startMilliseconds => {
  return (0, exports.make)(startMilliseconds, Number.POSITIVE_INFINITY);
};
exports.after = after;
/** @internal */
const before = endMilliseconds => {
  return (0, exports.make)(Number.NEGATIVE_INFINITY, endMilliseconds);
};
exports.before = before;
//# sourceMappingURL=interval.js.map