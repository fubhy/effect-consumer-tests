"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equals = exports.greaterThanOrEqualTo = exports.greaterThan = exports.lessThanOrEqualTo = exports.lessThan = exports.sum = exports.times = exports.clamp = exports.max = exports.min = exports.Equivalence = exports.between = exports.Order = exports.matchWith = exports.match = exports.toHrTime = exports.unsafeToNanos = exports.toNanos = exports.toSeconds = exports.toMillis = exports.weeks = exports.days = exports.hours = exports.minutes = exports.seconds = exports.millis = exports.micros = exports.nanos = exports.infinity = exports.zero = exports.isDuration = exports.decode = void 0;
/**
 * @since 2.0.0
 */
const Equal = /*#__PURE__*/require("./Equal.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Hash = /*#__PURE__*/require("./Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const Option = /*#__PURE__*/require("./Option.js");
const order = /*#__PURE__*/require("./Order.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/Duration");
const bigint1e3 = /*#__PURE__*/BigInt(1000);
const bigint1e9 = /*#__PURE__*/BigInt(1000000000);
const DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos|micros|millis|seconds|minutes|hours|days|weeks)$/;
/**
 * @since 2.0.0
 */
const decode = input => {
  if ((0, exports.isDuration)(input)) {
    return input;
  } else if ((0, Predicate_js_1.isNumber)(input)) {
    return (0, exports.millis)(input);
  } else if ((0, Predicate_js_1.isBigInt)(input)) {
    return (0, exports.nanos)(input);
  } else {
    DURATION_REGEX.lastIndex = 0; // Reset the lastIndex before each use
    const match = DURATION_REGEX.exec(input);
    if (match) {
      const [_, valueStr, unit] = match;
      const value = Number(valueStr);
      switch (unit) {
        case "nanos":
          return (0, exports.nanos)(BigInt(valueStr));
        case "micros":
          return (0, exports.micros)(BigInt(valueStr));
        case "millis":
          return (0, exports.millis)(value);
        case "seconds":
          return (0, exports.seconds)(value);
        case "minutes":
          return (0, exports.minutes)(value);
        case "hours":
          return (0, exports.hours)(value);
        case "days":
          return (0, exports.days)(value);
        case "weeks":
          return (0, exports.weeks)(value);
      }
    }
  }
  throw new Error("Invalid duration input");
};
exports.decode = decode;
const zeroValue = {
  _tag: "Millis",
  millis: 0
};
const infinityValue = {
  _tag: "Infinity"
};
const DurationProto = {
  [TypeId]: TypeId,
  [Hash.symbol]() {
    return Hash.structure(this.value);
  },
  [Equal.symbol](that) {
    return (0, exports.isDuration)(that) && (0, exports.equals)(this, that);
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: (0, exports.toHrTime)(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
const make = input => {
  const duration = Object.create(DurationProto);
  if ((0, Predicate_js_1.isNumber)(input)) {
    if (isNaN(input) || input < 0) {
      duration.value = zeroValue;
    } else if (!Number.isFinite(input)) {
      duration.value = infinityValue;
    } else if (!Number.isInteger(input)) {
      duration.value = {
        _tag: "Nanos",
        nanos: BigInt(Math.round(input * 1000000))
      };
    } else {
      duration.value = {
        _tag: "Millis",
        millis: input
      };
    }
  } else if (input < BigInt(0)) {
    duration.value = zeroValue;
  } else {
    duration.value = {
      _tag: "Nanos",
      nanos: input
    };
  }
  return duration;
};
/**
 * @since 2.0.0
 * @category guards
 */
const isDuration = u => (0, Predicate_js_1.hasProperty)(u, TypeId);
exports.isDuration = isDuration;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.zero = /*#__PURE__*/make(0);
/**
 * @since 2.0.0
 * @category constructors
 */
exports.infinity = /*#__PURE__*/make(Infinity);
/**
 * @since 2.0.0
 * @category constructors
 */
const nanos = nanos => make(nanos);
exports.nanos = nanos;
/**
 * @since 2.0.0
 * @category constructors
 */
const micros = micros => make(micros * bigint1e3);
exports.micros = micros;
/**
 * @since 2.0.0
 * @category constructors
 */
const millis = millis => make(millis);
exports.millis = millis;
/**
 * @since 2.0.0
 * @category constructors
 */
const seconds = seconds => make(seconds * 1000);
exports.seconds = seconds;
/**
 * @since 2.0.0
 * @category constructors
 */
const minutes = minutes => make(minutes * 60000);
exports.minutes = minutes;
/**
 * @since 2.0.0
 * @category constructors
 */
const hours = hours => make(hours * 3600000);
exports.hours = hours;
/**
 * @since 2.0.0
 * @category constructors
 */
const days = days => make(days * 86400000);
exports.days = days;
/**
 * @since 2.0.0
 * @category constructors
 */
const weeks = weeks => make(weeks * 604800000);
exports.weeks = weeks;
/**
 * @since 2.0.0
 * @category getters
 */
const toMillis = self => {
  const _self = (0, exports.decode)(self);
  switch (_self.value._tag) {
    case "Infinity":
      return Infinity;
    case "Nanos":
      return Number(_self.value.nanos) / 1000000;
    case "Millis":
      return _self.value.millis;
  }
};
exports.toMillis = toMillis;
/**
 * @since 2.0.0
 * @category getters
 */
const toSeconds = self => (0, exports.toMillis)(self) / 1000;
exports.toSeconds = toSeconds;
/**
 * Get the duration in nanoseconds as a bigint.
 *
 * If the duration is infinite, returns `Option.none()`
 *
 * @since 2.0.0
 * @category getters
 */
const toNanos = self => {
  const _self = (0, exports.decode)(self);
  switch (_self.value._tag) {
    case "Infinity":
      return Option.none();
    case "Nanos":
      return Option.some(_self.value.nanos);
    case "Millis":
      return Option.some(BigInt(Math.round(_self.value.millis * 1000000)));
  }
};
exports.toNanos = toNanos;
/**
 * Get the duration in nanoseconds as a bigint.
 *
 * If the duration is infinite, it throws an error.
 *
 * @since 2.0.0
 * @category getters
 */
const unsafeToNanos = self => {
  const _self = (0, exports.decode)(self);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1000000));
  }
};
exports.unsafeToNanos = unsafeToNanos;
/**
 * @since 2.0.0
 * @category getters
 */
const toHrTime = self => {
  const _self = (0, exports.decode)(self);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
    case "Nanos":
      return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
    case "Millis":
      return [Math.floor(_self.value.millis / 1000), Math.round(_self.value.millis % 1000 * 1000000)];
  }
};
exports.toHrTime = toHrTime;
/**
 * @since 2.0.0
 * @category pattern matching
 */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const _self = (0, exports.decode)(self);
  switch (_self.value._tag) {
    case "Nanos":
      return options.onNanos(_self.value.nanos);
    case "Infinity":
      return options.onMillis(Infinity);
    case "Millis":
      return options.onMillis(_self.value.millis);
  }
});
/**
 * @since 2.0.0
 * @category pattern matching
 */
exports.matchWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, options) => {
  const _self = (0, exports.decode)(self);
  const _that = (0, exports.decode)(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis((0, exports.toMillis)(_self), (0, exports.toMillis)(_that));
  } else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
    const selfNanos = _self.value._tag === "Nanos" ? _self.value.nanos : BigInt(Math.round(_self.value.millis * 1000000));
    const thatNanos = _that.value._tag === "Nanos" ? _that.value.nanos : BigInt(Math.round(_that.value.millis * 1000000));
    return options.onNanos(selfNanos, thatNanos);
  }
  return options.onMillis(_self.value.millis, _that.value.millis);
});
/**
 * @category instances
 * @since 2.0.0
 */
exports.Order = /*#__PURE__*/order.make((self, that) => (0, exports.matchWith)(self, that, {
  onMillis: (self, that) => self < that ? -1 : self > that ? 1 : 0,
  onNanos: (self, that) => self < that ? -1 : self > that ? 1 : 0
}));
/**
 * Checks if a `Duration` is between a `minimum` and `maximum` value.
 *
 * @category predicates
 * @since 2.0.0
 */
exports.between = /*#__PURE__*/order.between( /*#__PURE__*/order.mapInput(exports.Order, exports.decode));
/**
 * @category instances
 * @since 2.0.0
 */
const Equivalence = (self, that) => (0, exports.matchWith)(self, that, {
  onMillis: (self, that) => self === that,
  onNanos: (self, that) => self === that
});
exports.Equivalence = Equivalence;
const _min = /*#__PURE__*/order.min(exports.Order);
/**
 * @since 2.0.0
 */
exports.min = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => _min((0, exports.decode)(self), (0, exports.decode)(that)));
const _max = /*#__PURE__*/order.max(exports.Order);
/**
 * @since 2.0.0
 */
exports.max = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => _max((0, exports.decode)(self), (0, exports.decode)(that)));
const _clamp = /*#__PURE__*/order.clamp(exports.Order);
/**
 * @since 2.0.0
 */
exports.clamp = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, minimum, maximum) => _clamp((0, exports.decode)(self), (0, exports.decode)(minimum), (0, exports.decode)(maximum)));
/**
 * @since 2.0.0
 * @category math
 */
exports.times = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, times) => (0, exports.match)(self, {
  onMillis: millis => make(millis * times),
  onNanos: nanos => make(nanos * BigInt(times))
}));
/**
 * @since 2.0.0
 * @category math
 */
exports.sum = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.matchWith)(self, that, {
  onMillis: (self, that) => make(self + that),
  onNanos: (self, that) => make(self + that)
}));
/**
 * @since 2.0.0
 * @category predicates
 */
exports.lessThan = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.matchWith)(self, that, {
  onMillis: (self, that) => self < that,
  onNanos: (self, that) => self < that
}));
/**
 * @since 2.0.0
 * @category predicates
 */
exports.lessThanOrEqualTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.matchWith)(self, that, {
  onMillis: (self, that) => self <= that,
  onNanos: (self, that) => self <= that
}));
/**
 * @since 2.0.0
 * @category predicates
 */
exports.greaterThan = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.matchWith)(self, that, {
  onMillis: (self, that) => self > that,
  onNanos: (self, that) => self > that
}));
/**
 * @since 2.0.0
 * @category predicates
 */
exports.greaterThanOrEqualTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.matchWith)(self, that, {
  onMillis: (self, that) => self >= that,
  onNanos: (self, that) => self >= that
}));
/**
 * @since 2.0.0
 * @category predicates
 */
exports.equals = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.Equivalence)((0, exports.decode)(self), (0, exports.decode)(that)));
//# sourceMappingURL=Duration.js.map