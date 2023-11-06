"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = exports.randomTag = exports.RandomTypeId = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Context = /*#__PURE__*/require("../Context.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const PCGRandom = /*#__PURE__*/require("../Utils.js");
const core = /*#__PURE__*/require("./core.js");
/** @internal */
const RandomSymbolKey = "effect/Random";
/** @internal */
exports.RandomTypeId = /*#__PURE__*/Symbol.for(RandomSymbolKey);
/** @internal */
exports.randomTag = /*#__PURE__*/Context.Tag(exports.RandomTypeId);
/** @internal */
class RandomImpl {
  seed;
  [exports.RandomTypeId] = exports.RandomTypeId;
  PRNG;
  constructor(seed) {
    this.seed = seed;
    this.PRNG = new PCGRandom.PCGRandom(seed);
  }
  next() {
    return core.sync(() => this.PRNG.number());
  }
  nextBoolean() {
    return core.map(this.next(), n => n > 0.5);
  }
  nextInt() {
    return core.sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(min, max) {
    return core.map(this.next(), n => (max - min) * n + min);
  }
  nextIntBetween(min, max) {
    return core.sync(() => this.PRNG.integer(max - min) + min);
  }
  shuffle(elements) {
    return shuffleWith(elements, n => this.nextIntBetween(0, n + 1));
  }
}
const shuffleWith = (elements, nextIntBounded) => {
  return core.suspend(() => (0, Function_js_1.pipe)(core.sync(() => Array.from(elements)), core.flatMap(buffer => {
    const numbers = [];
    for (let i = buffer.length; i >= 2; i = i - 1) {
      numbers.push(i);
    }
    return (0, Function_js_1.pipe)(numbers, core.forEachSequentialDiscard(n => (0, Function_js_1.pipe)(nextIntBounded(n), core.map(k => swap(buffer, n - 1, k)))), core.as(Chunk.fromIterable(buffer)));
  })));
};
const swap = (buffer, index1, index2) => {
  const tmp = buffer[index1];
  buffer[index1] = buffer[index2];
  buffer[index2] = tmp;
  return buffer;
};
const make = seed => new RandomImpl(seed);
exports.make = make;
//# sourceMappingURL=random.js.map