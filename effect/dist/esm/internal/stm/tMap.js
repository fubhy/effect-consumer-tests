import * as Chunk from "../../Chunk.js";
import * as Equal from "../../Equal.js";
import { dual, pipe } from "../../Function.js";
import * as Hash from "../../Hash.js";
import * as HashMap from "../../HashMap.js";
import * as Option from "../../Option.js";
import * as RA from "../../ReadonlyArray.js";
import * as STM from "../../STM.js";
import * as core from "./core.js";
import * as stm from "./stm.js";
import * as tArray from "./tArray.js";
import * as tRef from "./tRef.js";
/** @internal */
const TMapSymbolKey = "effect/TMap";
/** @internal */
export const TMapTypeId = /*#__PURE__*/Symbol.for(TMapSymbolKey);
/** @internal */
const tMapVariance = {
  _K: _ => _,
  _V: _ => _
};
/** @internal */
class TMapImpl {
  tBuckets;
  tSize;
  [TMapTypeId] = tMapVariance;
  constructor(tBuckets, tSize) {
    this.tBuckets = tBuckets;
    this.tSize = tSize;
  }
}
/** @internal */
const InitialCapacity = 16;
const LoadFactor = 0.75;
/** @internal */
const nextPowerOfTwo = size => {
  const n = -1 >>> Math.clz32(size - 1);
  return n < 0 ? 1 : n + 1;
};
/** @internal */
const hash = key => {
  const h = Hash.hash(key);
  return h ^ h >>> 16;
};
/** @internal */
const indexOf = (k, capacity) => hash(k) & capacity - 1;
/** @internal */
const allocate = (capacity, data) => {
  const buckets = Array.from({
    length: capacity
  }, () => Chunk.empty());
  const distinct = new Map(data);
  let size = 0;
  for (const entry of distinct) {
    const index = indexOf(entry[0], capacity);
    buckets[index] = pipe(buckets[index], Chunk.prepend(entry));
    size = size + 1;
  }
  return pipe(tArray.fromIterable(buckets), core.flatMap(buckets => pipe(tRef.make(buckets), core.flatMap(tBuckets => pipe(tRef.make(size), core.map(tSize => new TMapImpl(tBuckets, tSize)))))));
};
/** @internal */
export const empty = () => fromIterable([]);
/** @internal */
export const find = /*#__PURE__*/dual(2, (self, pf) => findSTM(self, (key, value) => {
  const option = pf(key, value);
  if (Option.isSome(option)) {
    return core.succeed(option.value);
  }
  return core.fail(Option.none());
}));
/** @internal */
export const findSTM = /*#__PURE__*/dual(2, (self, f) => reduceWithIndexSTM(self, Option.none(), (acc, value, key) => Option.isNone(acc) ? core.matchSTM(f(key, value), {
  onFailure: Option.match({
    onNone: () => stm.succeedNone,
    onSome: core.fail
  }),
  onSuccess: stm.succeedSome
}) : STM.succeed(acc)));
/** @internal */
export const findAll = /*#__PURE__*/dual(2, (self, pf) => findAllSTM(self, (key, value) => {
  const option = pf(key, value);
  if (Option.isSome(option)) {
    return core.succeed(option.value);
  }
  return core.fail(Option.none());
}));
/** @internal */
export const findAllSTM = /*#__PURE__*/dual(2, (self, pf) => core.map(reduceWithIndexSTM(self, Chunk.empty(), (acc, value, key) => core.matchSTM(pf(key, value), {
  onFailure: Option.match({
    onNone: () => core.succeed(acc),
    onSome: core.fail
  }),
  onSuccess: a => core.succeed(Chunk.append(acc, a))
})), a => Array.from(a)));
/** @internal */
export const forEach = /*#__PURE__*/dual(2, (self, f) => reduceWithIndexSTM(self, void 0, (_, value, key) => stm.asUnit(f(key, value))));
/** @internal */
export const fromIterable = iterable => stm.suspend(() => {
  const data = Chunk.fromIterable(iterable);
  const capacity = data.length < InitialCapacity ? InitialCapacity : nextPowerOfTwo(data.length);
  return allocate(capacity, data);
});
/** @internal */
export const get = /*#__PURE__*/dual(2, (self, key) => core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const index = indexOf(key, buckets.chunk.length);
  const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
  return pipe(Chunk.findFirst(bucket, entry => Equal.equals(entry[0])(key)), Option.map(entry => entry[1]));
}));
/** @internal */
export const getOrElse = /*#__PURE__*/dual(3, (self, key, fallback) => core.map(get(self, key), Option.getOrElse(fallback)));
/** @internal */
export const has = /*#__PURE__*/dual(2, (self, key) => core.map(get(self, key), Option.isSome));
/** @internal */
export const isEmpty = self => core.map(tRef.get(self.tSize), size => size === 0);
/** @internal */
export const keys = self => core.map(toArray(self), RA.map(entry => entry[0]));
/** @internal */
export const make = (...entries) => fromIterable(entries);
/** @internal */
export const merge = /*#__PURE__*/dual(4, (self, key, value, f) => core.flatMap(get(self, key), Option.match({
  onNone: () => stm.as(set(self, key, value), value),
  onSome: v0 => {
    const v1 = f(v0, value);
    return stm.as(set(self, key, v1), v1);
  }
})));
/** @internal */
export const reduce = /*#__PURE__*/dual(3, (self, zero, f) => reduceWithIndex(self, zero, (acc, value) => f(acc, value)));
/** @internal */
export const reduceSTM = /*#__PURE__*/dual(3, (self, zero, f) => reduceWithIndexSTM(self, zero, (acc, value) => f(acc, value)));
/** @internal */
export const reduceWithIndex = /*#__PURE__*/dual(3, (self, zero, f) => core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  let result = zero;
  let index = 0;
  while (index < buckets.chunk.length) {
    const bucket = buckets.chunk[index];
    const items = tRef.unsafeGet(bucket, journal);
    result = Chunk.reduce(items, result, (acc, entry) => f(acc, entry[1], entry[0]));
    index = index + 1;
  }
  return result;
}));
/** @internal */
export const reduceWithIndexSTM = /*#__PURE__*/dual(3, (self, zero, f) => core.flatMap(toArray(self), stm.reduce(zero, (acc, entry) => f(acc, entry[1], entry[0]))));
/** @internal */
export const remove = /*#__PURE__*/dual(2, (self, key) => core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const index = indexOf(key, buckets.chunk.length);
  const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
  const [toRemove, toRetain] = Chunk.partition(bucket, entry => Equal.equals(entry[1], key));
  if (Chunk.isNonEmpty(toRemove)) {
    const currentSize = tRef.unsafeGet(self.tSize, journal);
    tRef.unsafeSet(buckets.chunk[index], toRetain, journal);
    tRef.unsafeSet(self.tSize, currentSize - 1, journal);
  }
}));
/** @internal */
export const removeAll = /*#__PURE__*/dual(2, (self, keys) => core.effect(journal => {
  const iterator = keys[Symbol.iterator]();
  let next;
  while ((next = iterator.next()) && !next.done) {
    const buckets = tRef.unsafeGet(self.tBuckets, journal);
    const index = indexOf(next.value, buckets.chunk.length);
    const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
    const [toRemove, toRetain] = Chunk.partition(bucket, entry => Equal.equals(next.value)(entry[0]));
    if (Chunk.isNonEmpty(toRemove)) {
      const currentSize = tRef.unsafeGet(self.tSize, journal);
      tRef.unsafeSet(buckets.chunk[index], toRetain, journal);
      tRef.unsafeSet(self.tSize, currentSize - 1, journal);
    }
  }
}));
/** @internal */
export const removeIf = /*#__PURE__*/dual(2, (self, predicate) => core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const capacity = buckets.chunk.length;
  const removed = [];
  let index = 0;
  let newSize = 0;
  while (index < capacity) {
    const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
    const iterator = bucket[Symbol.iterator]();
    let next;
    let newBucket = Chunk.empty();
    while ((next = iterator.next()) && !next.done) {
      if (!predicate(next.value[0], next.value[1])) {
        newBucket = Chunk.prepend(newBucket, next.value);
        newSize = newSize + 1;
      } else {
        removed.push(next.value);
      }
    }
    tRef.unsafeSet(buckets.chunk[index], newBucket, journal);
    index = index + 1;
  }
  tRef.unsafeSet(self.tSize, newSize, journal);
  return removed;
}));
/** @internal */
export const removeIfDiscard = /*#__PURE__*/dual(2, (self, predicate) => core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const capacity = buckets.chunk.length;
  let index = 0;
  let newSize = 0;
  while (index < capacity) {
    const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
    const iterator = bucket[Symbol.iterator]();
    let next;
    let newBucket = Chunk.empty();
    while ((next = iterator.next()) && !next.done) {
      if (!predicate(next.value[0], next.value[1])) {
        newBucket = Chunk.prepend(newBucket, next.value);
        newSize = newSize + 1;
      }
    }
    tRef.unsafeSet(buckets.chunk[index], newBucket, journal);
    index = index + 1;
  }
  tRef.unsafeSet(self.tSize, newSize, journal);
}));
/** @internal */
export const retainIf = /*#__PURE__*/dual(2, (self, predicate) => removeIf(self, (key, value) => !predicate(key, value)));
/** @internal */
export const retainIfDiscard = /*#__PURE__*/dual(2, (self, predicate) => removeIfDiscard(self, (key, value) => !predicate(key, value)));
/** @internal */
export const set = /*#__PURE__*/dual(3, (self, key, value) => {
  const resize = (journal, buckets) => {
    const capacity = buckets.chunk.length;
    const newCapacity = capacity << 1;
    const newBuckets = Array.from({
      length: newCapacity
    }, () => Chunk.empty());
    let index = 0;
    while (index < capacity) {
      const pairs = tRef.unsafeGet(buckets.chunk[index], journal);
      const iterator = pairs[Symbol.iterator]();
      let next;
      while ((next = iterator.next()) && !next.done) {
        const newIndex = indexOf(next.value[0], newCapacity);
        newBuckets[newIndex] = Chunk.prepend(newBuckets[newIndex], next.value);
      }
      index = index + 1;
    }
    // insert new pair
    const newIndex = indexOf(key, newCapacity);
    newBuckets[newIndex] = Chunk.prepend(newBuckets[newIndex], [key, value]);
    const newArray = [];
    index = 0;
    while (index < newCapacity) {
      newArray[index] = new tRef.TRefImpl(newBuckets[index]);
      index = index + 1;
    }
    const newTArray = new tArray.TArrayImpl(newArray);
    tRef.unsafeSet(self.tBuckets, newTArray, journal);
  };
  return core.effect(journal => {
    const buckets = tRef.unsafeGet(self.tBuckets, journal);
    const capacity = buckets.chunk.length;
    const index = indexOf(key, capacity);
    const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
    const shouldUpdate = Chunk.some(bucket, entry => Equal.equals(key)(entry[0]));
    if (shouldUpdate) {
      const newBucket = Chunk.map(bucket, entry => Equal.equals(key)(entry[0]) ? [key, value] : entry);
      tRef.unsafeSet(buckets.chunk[index], newBucket, journal);
    } else {
      const newSize = tRef.unsafeGet(self.tSize, journal) + 1;
      tRef.unsafeSet(self.tSize, newSize, journal);
      if (capacity * LoadFactor < newSize) {
        resize(journal, buckets);
      } else {
        const newBucket = Chunk.prepend(bucket, [key, value]);
        tRef.unsafeSet(buckets.chunk[index], newBucket, journal);
      }
    }
  });
});
/** @internal */
export const setIfAbsent = /*#__PURE__*/dual(3, (self, key, value) => core.flatMap(get(self, key), Option.match({
  onNone: () => set(self, key, value),
  onSome: () => stm.unit
})));
/** @internal */
export const size = self => tRef.get(self.tSize);
/** @internal */
export const takeFirst = /*#__PURE__*/dual(2, (self, pf) => pipe(core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const capacity = buckets.chunk.length;
  const size = tRef.unsafeGet(self.tSize, journal);
  let result = Option.none();
  let index = 0;
  while (index < capacity && Option.isNone(result)) {
    const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
    const recreate = Chunk.some(bucket, entry => Option.isSome(pf(entry[0], entry[1])));
    if (recreate) {
      const iterator = bucket[Symbol.iterator]();
      let newBucket = Chunk.empty();
      let next;
      while ((next = iterator.next()) && !next.done && Option.isNone(result)) {
        const option = pf(next.value[0], next.value[1]);
        if (Option.isSome(option) && Option.isNone(result)) {
          result = option;
        } else {
          newBucket = Chunk.prepend(newBucket, next.value);
        }
      }
      tRef.unsafeSet(buckets.chunk[index], newBucket, journal);
    }
    index = index + 1;
  }
  if (Option.isSome(result)) {
    tRef.unsafeSet(self.tSize, size - 1, journal);
  }
  return result;
}), stm.collect(option => Option.isSome(option) ? Option.some(option.value) : Option.none())));
/** @internal */
export const takeFirstSTM = /*#__PURE__*/dual(2, (self, pf) => pipe(findSTM(self, (key, value) => core.map(pf(key, value), a => [key, a])), stm.collect(option => Option.isSome(option) ? Option.some(option.value) : Option.none()), core.flatMap(entry => stm.as(remove(self, entry[0]), entry[1]))));
/** @internal */
export const takeSome = /*#__PURE__*/dual(2, (self, pf) => pipe(core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const capacity = buckets.chunk.length;
  const builder = [];
  let newSize = 0;
  let index = 0;
  while (index < capacity) {
    const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
    const recreate = Chunk.some(bucket, entry => Option.isSome(pf(entry[0], entry[1])));
    if (recreate) {
      const iterator = bucket[Symbol.iterator]();
      let newBucket = Chunk.empty();
      let next;
      while ((next = iterator.next()) && !next.done) {
        const option = pf(next.value[0], next.value[1]);
        if (Option.isSome(option)) {
          builder.push(option.value);
        } else {
          newBucket = Chunk.prepend(newBucket, next.value);
          newSize = newSize + 1;
        }
      }
      tRef.unsafeSet(buckets.chunk[index], newBucket, journal);
    } else {
      newSize = newSize + bucket.length;
    }
    index = index + 1;
  }
  tRef.unsafeSet(self.tSize, newSize, journal);
  if (builder.length > 0) {
    return Option.some(builder);
  }
  return Option.none();
}), stm.collect(option => Option.isSome(option) ? Option.some(option.value) : Option.none())));
/** @internal */
export const takeSomeSTM = /*#__PURE__*/dual(2, (self, pf) => pipe(findAllSTM(self, (key, value) => core.map(pf(key, value), a => [key, a])), core.map(chunk => RA.isNonEmptyArray(chunk) ? Option.some(chunk) : Option.none()), stm.collect(option => Option.isSome(option) ? Option.some(option.value) : Option.none()), core.flatMap(entries => stm.as(removeAll(self, entries.map(entry => entry[0])), RA.map(entries, entry => entry[1])))));
/** @internal */
export const toArray = self => core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const capacity = buckets.chunk.length;
  const builder = [];
  let index = 0;
  while (index < capacity) {
    const bucket = buckets.chunk[index];
    builder.push(...tRef.unsafeGet(bucket, journal));
    index = index + 1;
  }
  return builder;
});
/** @internal */
export const toHashMap = self => reduceWithIndex(self, HashMap.empty(), (acc, value, key) => pipe(acc, HashMap.set(key, value)));
/** @internal */
export const toReadonlyArray = self => reduceWithIndex(self, [], (acc, value, key) => [[key, value], ...acc]);
/** @internal */
export const toReadonlyMap = self => reduceWithIndex(self, new Map(), (acc, value, key) => acc.set(key, value));
/** @internal */
export const transform = /*#__PURE__*/dual(2, (self, f) => core.effect(journal => {
  const buckets = pipe(self.tBuckets, tRef.unsafeGet(journal));
  const capacity = buckets.chunk.length;
  const newBuckets = Array.from({
    length: capacity
  }, () => Chunk.empty());
  let newSize = 0;
  let index = 0;
  while (index < capacity) {
    const bucket = buckets.chunk[index];
    const pairs = tRef.unsafeGet(bucket, journal);
    const iterator = pairs[Symbol.iterator]();
    let next;
    while ((next = iterator.next()) && !next.done) {
      const newPair = f(next.value[0], next.value[1]);
      const index = indexOf(newPair[0], capacity);
      const newBucket = newBuckets[index];
      if (!Chunk.some(newBucket, entry => Equal.equals(entry[0], newPair[0]))) {
        newBuckets[index] = Chunk.prepend(newBucket, newPair);
        newSize = newSize + 1;
      }
    }
    index = index + 1;
  }
  index = 0;
  while (index < capacity) {
    tRef.unsafeSet(buckets.chunk[index], newBuckets[index], journal);
    index = index + 1;
  }
  tRef.unsafeSet(self.tSize, newSize, journal);
}));
/** @internal */
export const transformSTM = /*#__PURE__*/dual(2, (self, f) => pipe(core.flatMap(toArray(self), stm.forEach(entry => f(entry[0], entry[1]))), core.flatMap(newData => core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const capacity = buckets.chunk.length;
  const newBuckets = Array.from({
    length: capacity
  }, () => Chunk.empty());
  const iterator = newData[Symbol.iterator]();
  let newSize = 0;
  let next;
  while ((next = iterator.next()) && !next.done) {
    const index = indexOf(next.value[0], capacity);
    const newBucket = newBuckets[index];
    if (!Chunk.some(newBucket, entry => Equal.equals(entry[0])(next.value[0]))) {
      newBuckets[index] = Chunk.prepend(newBucket, next.value);
      newSize = newSize + 1;
    }
  }
  let index = 0;
  while (index < capacity) {
    tRef.unsafeSet(buckets.chunk[index], newBuckets[index], journal);
    index = index + 1;
  }
  tRef.unsafeSet(self.tSize, newSize, journal);
}))));
/** @internal */
export const transformValues = /*#__PURE__*/dual(2, (self, f) => transform(self, (key, value) => [key, f(value)]));
/** @internal */
export const transformValuesSTM = /*#__PURE__*/dual(2, (self, f) => transformSTM(self, (key, value) => core.map(f(value), value => [key, value])));
/** @internal */
export const updateWith = /*#__PURE__*/dual(3, (self, key, f) => core.flatMap(get(self, key), option => Option.match(f(option), {
  onNone: () => stm.as(remove(self, key), Option.none()),
  onSome: value => stm.as(set(self, key, value), Option.some(value))
})));
/** @internal */
export const values = self => core.map(toArray(self), RA.map(entry => entry[1]));
//# sourceMappingURL=tMap.js.map