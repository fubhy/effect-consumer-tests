"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PCGRandom = exports.adapter = exports.makeGenKind = exports.SingleShotGen = exports.GenKindImpl = exports.GenKindTypeId = void 0;
/**
 * @since 2.0.0
 */
const Function_js_1 = /*#__PURE__*/require("./Function.js");
/*
 * Copyright 2014 Thom Chiovoloni, released under the MIT license.
 *
 * A random number generator based on the basic implementation of the PCG algorithm,
 * as described here: http://www.pcg-random.org/
 *
 * Adapted for TypeScript from Thom's original code at https://github.com/thomcc/pcg-random
 *
 * forked from https://github.com/frptools
 *
 * @since 2.0.0
 */
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
/**
 * @category symbols
 * @since 2.0.0
 */
exports.GenKindTypeId = /*#__PURE__*/Symbol.for("effect/Gen/GenKind");
/**
 * @category constructors
 * @since 2.0.0
 */
class GenKindImpl {
  value;
  constructor(
  /**
   * @since 2.0.0
   */
  value) {
    this.value = value;
  }
  /**
   * @since 2.0.0
   */
  get _F() {
    return Function_js_1.identity;
  }
  /**
   * @since 2.0.0
   */
  get _R() {
    return _ => _;
  }
  /**
   * @since 2.0.0
   */
  get _O() {
    return _ => _;
  }
  /**
   * @since 2.0.0
   */
  get _E() {
    return _ => _;
  }
  /**
   * @since 2.0.0
   */
  [exports.GenKindTypeId] = exports.GenKindTypeId;
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
}
exports.GenKindImpl = GenKindImpl;
/**
 * @category constructors
 * @since 2.0.0
 */
class SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  /**
   * @since 2.0.0
   */
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  /**
   * @since 2.0.0
   */
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this.self);
  }
}
exports.SingleShotGen = SingleShotGen;
/**
 * @category constructors
 * @since 2.0.0
 */
const makeGenKind = kind => new GenKindImpl(kind);
exports.makeGenKind = makeGenKind;
/**
 * @category adapters
 * @since 2.0.0
 */
const adapter = () =>
// @ts-expect-error
function () {
  let x = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    x = arguments[i](x);
  }
  return new GenKindImpl(x);
};
exports.adapter = adapter;
const defaultIncHi = 0x14057b7e;
const defaultIncLo = 0xf767814f;
const MUL_HI = 0x5851f42d >>> 0;
const MUL_LO = 0x4c957f2d >>> 0;
const BIT_53 = 9007199254740992.0;
const BIT_27 = 134217728.0;
/**
 * PCG is a family of simple fast space-efficient statistically good algorithms
 * for random number generation. Unlike many general-purpose RNGs, they are also
 * hard to predict.
 *
 * @category model
 * @since 2.0.0
 */
class PCGRandom {
  _state;
  constructor(seedHi, seedLo, incHi, incLo) {
    if ((0, Predicate_js_1.isNullable)(seedLo) && (0, Predicate_js_1.isNullable)(seedHi)) {
      seedLo = Math.random() * 0xffffffff >>> 0;
      seedHi = 0;
    } else if ((0, Predicate_js_1.isNullable)(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if ((0, Predicate_js_1.isNullable)(incLo) && (0, Predicate_js_1.isNullable)(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo;
      incHi = this._state ? this._state[2] : defaultIncHi;
    } else if ((0, Predicate_js_1.isNullable)(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(state) {
    this._state[0] = state[0];
    this._state[1] = state[1];
    this._state[2] = state[2];
    this._state[3] = state[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(max) {
    if (!max) {
      return this._next();
    }
    max = max >>> 0;
    if ((max & max - 1) === 0) {
      return this._next() & max - 1; // fast path for power of 2
    }

    let num = 0;
    const skew = (-max >>> 0) % max >>> 0;
    for (num = this._next(); num < skew; num = this._next()) {
      // this loop will rarely execute more than twice,
      // and is intentionally empty
    }
    return num % max;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const hi = (this._next() & 0x03ffffff) * 1.0;
    const lo = (this._next() & 0x07ffffff) * 1.0;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  /** @internal */
  _next() {
    // save current state (what we'll use for this number)
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    // churn LCG.
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    // get least sig. 32 bits of ((oldstate >> 18) ^ oldstate) >> 27
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    // rotate xorshifted right a random amount, based on the most sig. 5 bits
    // bits of the old state.
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
}
exports.PCGRandom = PCGRandom;
function mul64(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 0xffff) >>> 0;
  let c0 = (aLo & 0xffff) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 0xffff) * (bLo & 0xffff) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
// add two 64 bit numbers (given in parts), and store the result in `out`.
function add64(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
}
//# sourceMappingURL=Utils.js.map