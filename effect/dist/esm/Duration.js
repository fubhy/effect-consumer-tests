/**
 * @since 2.0.0
 */
import * as Equal from "./Equal.js";
import { dual } from "./Function.js";
import * as Hash from "./Hash.js";
import { NodeInspectSymbol, toString } from "./Inspectable.js";
import * as Option from "./Option.js";
import * as order from "./Order.js";
import { pipeArguments } from "./Pipeable.js";
import { hasProperty, isBigInt, isNumber } from "./Predicate.js";
const TypeId = /*#__PURE__*/Symbol.for("effect/Duration");
const bigint1e3 = /*#__PURE__*/BigInt(1000);
const bigint1e9 = /*#__PURE__*/BigInt(1000000000);
const DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos|micros|millis|seconds|minutes|hours|days|weeks)$/;
/**
 * @since 2.0.0
 */
export const decode = input => {
  if (isDuration(input)) {
    return input;
  } else if (isNumber(input)) {
    return millis(input);
  } else if (isBigInt(input)) {
    return nanos(input);
  } else {
    DURATION_REGEX.lastIndex = 0; // Reset the lastIndex before each use
    const match = DURATION_REGEX.exec(input);
    if (match) {
      const [_, valueStr, unit] = match;
      const value = Number(valueStr);
      switch (unit) {
        case "nanos":
          return nanos(BigInt(valueStr));
        case "micros":
          return micros(BigInt(valueStr));
        case "millis":
          return millis(value);
        case "seconds":
          return seconds(value);
        case "minutes":
          return minutes(value);
        case "hours":
          return hours(value);
        case "days":
          return days(value);
        case "weeks":
          return weeks(value);
      }
    }
  }
  throw new Error("Invalid duration input");
};
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
    return isDuration(that) && equals(this, that);
  },
  toString() {
    return toString(this.toJSON());
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
          hrtime: toHrTime(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
const make = input => {
  const duration = Object.create(DurationProto);
  if (isNumber(input)) {
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
export const isDuration = u => hasProperty(u, TypeId);
/**
 * @since 2.0.0
 * @category constructors
 */
export const zero = /*#__PURE__*/make(0);
/**
 * @since 2.0.0
 * @category constructors
 */
export const infinity = /*#__PURE__*/make(Infinity);
/**
 * @since 2.0.0
 * @category constructors
 */
export const nanos = nanos => make(nanos);
/**
 * @since 2.0.0
 * @category constructors
 */
export const micros = micros => make(micros * bigint1e3);
/**
 * @since 2.0.0
 * @category constructors
 */
export const millis = millis => make(millis);
/**
 * @since 2.0.0
 * @category constructors
 */
export const seconds = seconds => make(seconds * 1000);
/**
 * @since 2.0.0
 * @category constructors
 */
export const minutes = minutes => make(minutes * 60000);
/**
 * @since 2.0.0
 * @category constructors
 */
export const hours = hours => make(hours * 3600000);
/**
 * @since 2.0.0
 * @category constructors
 */
export const days = days => make(days * 86400000);
/**
 * @since 2.0.0
 * @category constructors
 */
export const weeks = weeks => make(weeks * 604800000);
/**
 * @since 2.0.0
 * @category getters
 */
export const toMillis = self => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return Infinity;
    case "Nanos":
      return Number(_self.value.nanos) / 1000000;
    case "Millis":
      return _self.value.millis;
  }
};
/**
 * @since 2.0.0
 * @category getters
 */
export const toSeconds = self => toMillis(self) / 1000;
/**
 * Get the duration in nanoseconds as a bigint.
 *
 * If the duration is infinite, returns `Option.none()`
 *
 * @since 2.0.0
 * @category getters
 */
export const toNanos = self => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return Option.none();
    case "Nanos":
      return Option.some(_self.value.nanos);
    case "Millis":
      return Option.some(BigInt(Math.round(_self.value.millis * 1000000)));
  }
};
/**
 * Get the duration in nanoseconds as a bigint.
 *
 * If the duration is infinite, it throws an error.
 *
 * @since 2.0.0
 * @category getters
 */
export const unsafeToNanos = self => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1000000));
  }
};
/**
 * @since 2.0.0
 * @category getters
 */
export const toHrTime = self => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
    case "Nanos":
      return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
    case "Millis":
      return [Math.floor(_self.value.millis / 1000), Math.round(_self.value.millis % 1000 * 1000000)];
  }
};
/**
 * @since 2.0.0
 * @category pattern matching
 */
export const match = /*#__PURE__*/dual(2, (self, options) => {
  const _self = decode(self);
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
export const matchWith = /*#__PURE__*/dual(3, (self, that, options) => {
  const _self = decode(self);
  const _that = decode(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis(toMillis(_self), toMillis(_that));
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
export const Order = /*#__PURE__*/order.make((self, that) => matchWith(self, that, {
  onMillis: (self, that) => self < that ? -1 : self > that ? 1 : 0,
  onNanos: (self, that) => self < that ? -1 : self > that ? 1 : 0
}));
/**
 * Checks if a `Duration` is between a `minimum` and `maximum` value.
 *
 * @category predicates
 * @since 2.0.0
 */
export const between = /*#__PURE__*/order.between( /*#__PURE__*/order.mapInput(Order, decode));
/**
 * @category instances
 * @since 2.0.0
 */
export const Equivalence = (self, that) => matchWith(self, that, {
  onMillis: (self, that) => self === that,
  onNanos: (self, that) => self === that
});
const _min = /*#__PURE__*/order.min(Order);
/**
 * @since 2.0.0
 */
export const min = /*#__PURE__*/dual(2, (self, that) => _min(decode(self), decode(that)));
const _max = /*#__PURE__*/order.max(Order);
/**
 * @since 2.0.0
 */
export const max = /*#__PURE__*/dual(2, (self, that) => _max(decode(self), decode(that)));
const _clamp = /*#__PURE__*/order.clamp(Order);
/**
 * @since 2.0.0
 */
export const clamp = /*#__PURE__*/dual(3, (self, minimum, maximum) => _clamp(decode(self), decode(minimum), decode(maximum)));
/**
 * @since 2.0.0
 * @category math
 */
export const times = /*#__PURE__*/dual(2, (self, times) => match(self, {
  onMillis: millis => make(millis * times),
  onNanos: nanos => make(nanos * BigInt(times))
}));
/**
 * @since 2.0.0
 * @category math
 */
export const sum = /*#__PURE__*/dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self, that) => make(self + that),
  onNanos: (self, that) => make(self + that)
}));
/**
 * @since 2.0.0
 * @category predicates
 */
export const lessThan = /*#__PURE__*/dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self, that) => self < that,
  onNanos: (self, that) => self < that
}));
/**
 * @since 2.0.0
 * @category predicates
 */
export const lessThanOrEqualTo = /*#__PURE__*/dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self, that) => self <= that,
  onNanos: (self, that) => self <= that
}));
/**
 * @since 2.0.0
 * @category predicates
 */
export const greaterThan = /*#__PURE__*/dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self, that) => self > that,
  onNanos: (self, that) => self > that
}));
/**
 * @since 2.0.0
 * @category predicates
 */
export const greaterThanOrEqualTo = /*#__PURE__*/dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self, that) => self >= that,
  onNanos: (self, that) => self >= that
}));
/**
 * @since 2.0.0
 * @category predicates
 */
export const equals = /*#__PURE__*/dual(2, (self, that) => Equivalence(decode(self), decode(that)));
//# sourceMappingURL=Duration.js.map