"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = exports.nextRange = exports.nextIntBetween = exports.nextInt = exports.nextBoolean = exports.next = exports.live = exports.Tag = exports.TRandomTypeId = void 0;
const Context = /*#__PURE__*/require("../../Context.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Layer = /*#__PURE__*/require("../../Layer.js");
const Random = /*#__PURE__*/require("../../Utils.js");
const core = /*#__PURE__*/require("./core.js");
const stm = /*#__PURE__*/require("./stm.js");
const tArray = /*#__PURE__*/require("./tArray.js");
const tRef = /*#__PURE__*/require("./tRef.js");
const TRandomSymbolKey = "effect/TRandom";
/** @internal */
exports.TRandomTypeId = /*#__PURE__*/Symbol.for(TRandomSymbolKey);
const randomInteger = state => {
  const prng = new Random.PCGRandom();
  prng.setState(state);
  return [prng.integer(0), prng.getState()];
};
const randomIntegerBetween = (low, high) => {
  return state => {
    const prng = new Random.PCGRandom();
    prng.setState(state);
    return [prng.integer(high - low) + low, prng.getState()];
  };
};
const randomNumber = state => {
  const prng = new Random.PCGRandom();
  prng.setState(state);
  return [prng.number(), prng.getState()];
};
const withState = (state, f) => {
  return (0, Function_js_1.pipe)(state, tRef.modify(f));
};
const shuffleWith = (iterable, nextIntBounded) => {
  const swap = (buffer, index1, index2) => (0, Function_js_1.pipe)(buffer, tArray.get(index1), core.flatMap(tmp => (0, Function_js_1.pipe)(buffer, tArray.updateSTM(index1, () => (0, Function_js_1.pipe)(buffer, tArray.get(index2))), core.zipRight((0, Function_js_1.pipe)(buffer, tArray.update(index2, () => tmp))))));
  return (0, Function_js_1.pipe)(tArray.fromIterable(iterable), core.flatMap(buffer => {
    const array = [];
    for (let i = array.length; i >= 2; i = i - 1) {
      array.push(i);
    }
    return (0, Function_js_1.pipe)(array, stm.forEach(n => (0, Function_js_1.pipe)(nextIntBounded(n), core.flatMap(k => swap(buffer, n - 1, k))), {
      discard: true
    }), core.zipRight(tArray.toArray(buffer)));
  }));
};
/** @internal */
exports.Tag = /*#__PURE__*/Context.Tag();
class TRandomImpl {
  state;
  [exports.TRandomTypeId] = exports.TRandomTypeId;
  constructor(state) {
    this.state = state;
    this.next = withState(this.state, randomNumber);
    this.nextBoolean = core.flatMap(this.next, n => core.succeed(n > 0.5));
    this.nextInt = withState(this.state, randomInteger);
  }
  next;
  nextBoolean;
  nextInt;
  nextRange(min, max) {
    return core.flatMap(this.next, n => core.succeed((max - min) * n + min));
  }
  nextIntBetween(low, high) {
    return withState(this.state, randomIntegerBetween(low, high));
  }
  shuffle(elements) {
    return shuffleWith(elements, n => this.nextIntBetween(0, n));
  }
}
/** @internal */
exports.live = /*#__PURE__*/Layer.effect(exports.Tag, /*#__PURE__*/(0, Function_js_1.pipe)( /*#__PURE__*/tRef.make( /*#__PURE__*/new Random.PCGRandom(Math.random() * 4294967296 >>> 0).getState()), /*#__PURE__*/core.map(seed => new TRandomImpl(seed)), core.commit));
/** @internal */
exports.next = /*#__PURE__*/core.flatMap(exports.Tag, random => random.next);
/** @internal */
exports.nextBoolean = /*#__PURE__*/core.flatMap(exports.Tag, random => random.nextBoolean);
/** @internal */
exports.nextInt = /*#__PURE__*/core.flatMap(exports.Tag, random => random.nextInt);
/** @internal */
const nextIntBetween = (low, high) => core.flatMap(exports.Tag, random => random.nextIntBetween(low, high));
exports.nextIntBetween = nextIntBetween;
/** @internal */
const nextRange = (min, max) => core.flatMap(exports.Tag, random => random.nextRange(min, max));
exports.nextRange = nextRange;
/** @internal */
const shuffle = elements => core.flatMap(exports.Tag, random => random.shuffle(elements));
exports.shuffle = shuffle;
//# sourceMappingURL=tRandom.js.map