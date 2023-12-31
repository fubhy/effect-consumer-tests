import * as Chunk from "../Chunk.js";
import * as Context from "../Context.js";
import { pipe } from "../Function.js";
import * as PCGRandom from "../Utils.js";
import * as core from "./core.js";
/** @internal */
const RandomSymbolKey = "effect/Random";
/** @internal */
export const RandomTypeId = /*#__PURE__*/Symbol.for(RandomSymbolKey);
/** @internal */
export const randomTag = /*#__PURE__*/Context.Tag(RandomTypeId);
/** @internal */
class RandomImpl {
  seed;
  [RandomTypeId] = RandomTypeId;
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
  return core.suspend(() => pipe(core.sync(() => Array.from(elements)), core.flatMap(buffer => {
    const numbers = [];
    for (let i = buffer.length; i >= 2; i = i - 1) {
      numbers.push(i);
    }
    return pipe(numbers, core.forEachSequentialDiscard(n => pipe(nextIntBounded(n), core.map(k => swap(buffer, n - 1, k)))), core.as(Chunk.fromIterable(buffer)));
  })));
};
const swap = (buffer, index1, index2) => {
  const tmp = buffer[index1];
  buffer[index1] = buffer[index2];
  buffer[index2] = tmp;
  return buffer;
};
export const make = seed => new RandomImpl(seed);
//# sourceMappingURL=random.js.map