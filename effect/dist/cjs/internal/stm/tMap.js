"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.values = exports.updateWith = exports.transformValuesSTM = exports.transformValues = exports.transformSTM = exports.transform = exports.toReadonlyMap = exports.toReadonlyArray = exports.toHashMap = exports.toArray = exports.takeSomeSTM = exports.takeSome = exports.takeFirstSTM = exports.takeFirst = exports.size = exports.setIfAbsent = exports.set = exports.retainIfDiscard = exports.retainIf = exports.removeIfDiscard = exports.removeIf = exports.removeAll = exports.remove = exports.reduceWithIndexSTM = exports.reduceWithIndex = exports.reduceSTM = exports.reduce = exports.merge = exports.make = exports.keys = exports.isEmpty = exports.has = exports.getOrElse = exports.get = exports.fromIterable = exports.forEach = exports.findAllSTM = exports.findAll = exports.findSTM = exports.find = exports.empty = exports.TMapTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Hash = /*#__PURE__*/require("../../Hash.js");
const HashMap = /*#__PURE__*/require("../../HashMap.js");
const Option = /*#__PURE__*/require("../../Option.js");
const RA = /*#__PURE__*/require("../../ReadonlyArray.js");
const STM = /*#__PURE__*/require("../../STM.js");
const core = /*#__PURE__*/require("./core.js");
const stm = /*#__PURE__*/require("./stm.js");
const tArray = /*#__PURE__*/require("./tArray.js");
const tRef = /*#__PURE__*/require("./tRef.js");
/** @internal */
const TMapSymbolKey = "effect/TMap";
/** @internal */
exports.TMapTypeId = /*#__PURE__*/Symbol.for(TMapSymbolKey);
/** @internal */
const tMapVariance = {
  _K: _ => _,
  _V: _ => _
};
/** @internal */
class TMapImpl {
  tBuckets;
  tSize;
  [exports.TMapTypeId] = tMapVariance;
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
    buckets[index] = (0, Function_js_1.pipe)(buckets[index], Chunk.prepend(entry));
    size = size + 1;
  }
  return (0, Function_js_1.pipe)(tArray.fromIterable(buckets), core.flatMap(buckets => (0, Function_js_1.pipe)(tRef.make(buckets), core.flatMap(tBuckets => (0, Function_js_1.pipe)(tRef.make(size), core.map(tSize => new TMapImpl(tBuckets, tSize)))))));
};
/** @internal */
const empty = () => (0, exports.fromIterable)([]);
exports.empty = empty;
/** @internal */
exports.find = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.findSTM)(self, (key, value) => {
  const option = pf(key, value);
  if (Option.isSome(option)) {
    return core.succeed(option.value);
  }
  return core.fail(Option.none());
}));
/** @internal */
exports.findSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.reduceWithIndexSTM)(self, Option.none(), (acc, value, key) => Option.isNone(acc) ? core.matchSTM(f(key, value), {
  onFailure: Option.match({
    onNone: () => stm.succeedNone,
    onSome: core.fail
  }),
  onSuccess: stm.succeedSome
}) : STM.succeed(acc)));
/** @internal */
exports.findAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.findAllSTM)(self, (key, value) => {
  const option = pf(key, value);
  if (Option.isSome(option)) {
    return core.succeed(option.value);
  }
  return core.fail(Option.none());
}));
/** @internal */
exports.findAllSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => core.map((0, exports.reduceWithIndexSTM)(self, Chunk.empty(), (acc, value, key) => core.matchSTM(pf(key, value), {
  onFailure: Option.match({
    onNone: () => core.succeed(acc),
    onSome: core.fail
  }),
  onSuccess: a => core.succeed(Chunk.append(acc, a))
})), a => Array.from(a)));
/** @internal */
exports.forEach = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.reduceWithIndexSTM)(self, void 0, (_, value, key) => stm.asUnit(f(key, value))));
/** @internal */
const fromIterable = iterable => stm.suspend(() => {
  const data = Chunk.fromIterable(iterable);
  const capacity = data.length < InitialCapacity ? InitialCapacity : nextPowerOfTwo(data.length);
  return allocate(capacity, data);
});
exports.fromIterable = fromIterable;
/** @internal */
exports.get = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, key) => core.effect(journal => {
  const buckets = tRef.unsafeGet(self.tBuckets, journal);
  const index = indexOf(key, buckets.chunk.length);
  const bucket = tRef.unsafeGet(buckets.chunk[index], journal);
  return (0, Function_js_1.pipe)(Chunk.findFirst(bucket, entry => Equal.equals(entry[0])(key)), Option.map(entry => entry[1]));
}));
/** @internal */
exports.getOrElse = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, fallback) => core.map((0, exports.get)(self, key), Option.getOrElse(fallback)));
/** @internal */
exports.has = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, key) => core.map((0, exports.get)(self, key), Option.isSome));
/** @internal */
const isEmpty = self => core.map(tRef.get(self.tSize), size => size === 0);
exports.isEmpty = isEmpty;
/** @internal */
const keys = self => core.map((0, exports.toArray)(self), RA.map(entry => entry[0]));
exports.keys = keys;
/** @internal */
const make = (...entries) => (0, exports.fromIterable)(entries);
exports.make = make;
/** @internal */
exports.merge = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, key, value, f) => core.flatMap((0, exports.get)(self, key), Option.match({
  onNone: () => stm.as((0, exports.set)(self, key, value), value),
  onSome: v0 => {
    const v1 = f(v0, value);
    return stm.as((0, exports.set)(self, key, v1), v1);
  }
})));
/** @internal */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => (0, exports.reduceWithIndex)(self, zero, (acc, value) => f(acc, value)));
/** @internal */
exports.reduceSTM = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => (0, exports.reduceWithIndexSTM)(self, zero, (acc, value) => f(acc, value)));
/** @internal */
exports.reduceWithIndex = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => core.effect(journal => {
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
exports.reduceWithIndexSTM = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => core.flatMap((0, exports.toArray)(self), stm.reduce(zero, (acc, entry) => f(acc, entry[1], entry[0]))));
/** @internal */
exports.remove = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, key) => core.effect(journal => {
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
exports.removeAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, keys) => core.effect(journal => {
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
exports.removeIf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.effect(journal => {
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
exports.removeIfDiscard = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.effect(journal => {
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
exports.retainIf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.removeIf)(self, (key, value) => !predicate(key, value)));
/** @internal */
exports.retainIfDiscard = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.removeIfDiscard)(self, (key, value) => !predicate(key, value)));
/** @internal */
exports.set = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, value) => {
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
exports.setIfAbsent = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, value) => core.flatMap((0, exports.get)(self, key), Option.match({
  onNone: () => (0, exports.set)(self, key, value),
  onSome: () => stm.unit
})));
/** @internal */
const size = self => tRef.get(self.tSize);
exports.size = size;
/** @internal */
exports.takeFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)(core.effect(journal => {
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
exports.takeFirstSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)((0, exports.findSTM)(self, (key, value) => core.map(pf(key, value), a => [key, a])), stm.collect(option => Option.isSome(option) ? Option.some(option.value) : Option.none()), core.flatMap(entry => stm.as((0, exports.remove)(self, entry[0]), entry[1]))));
/** @internal */
exports.takeSome = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)(core.effect(journal => {
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
exports.takeSomeSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, Function_js_1.pipe)((0, exports.findAllSTM)(self, (key, value) => core.map(pf(key, value), a => [key, a])), core.map(chunk => RA.isNonEmptyArray(chunk) ? Option.some(chunk) : Option.none()), stm.collect(option => Option.isSome(option) ? Option.some(option.value) : Option.none()), core.flatMap(entries => stm.as((0, exports.removeAll)(self, entries.map(entry => entry[0])), RA.map(entries, entry => entry[1])))));
/** @internal */
const toArray = self => core.effect(journal => {
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
exports.toArray = toArray;
/** @internal */
const toHashMap = self => (0, exports.reduceWithIndex)(self, HashMap.empty(), (acc, value, key) => (0, Function_js_1.pipe)(acc, HashMap.set(key, value)));
exports.toHashMap = toHashMap;
/** @internal */
const toReadonlyArray = self => (0, exports.reduceWithIndex)(self, [], (acc, value, key) => [[key, value], ...acc]);
exports.toReadonlyArray = toReadonlyArray;
/** @internal */
const toReadonlyMap = self => (0, exports.reduceWithIndex)(self, new Map(), (acc, value, key) => acc.set(key, value));
exports.toReadonlyMap = toReadonlyMap;
/** @internal */
exports.transform = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.effect(journal => {
  const buckets = (0, Function_js_1.pipe)(self.tBuckets, tRef.unsafeGet(journal));
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
exports.transformSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(core.flatMap((0, exports.toArray)(self), stm.forEach(entry => f(entry[0], entry[1]))), core.flatMap(newData => core.effect(journal => {
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
exports.transformValues = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.transform)(self, (key, value) => [key, f(value)]));
/** @internal */
exports.transformValuesSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.transformSTM)(self, (key, value) => core.map(f(value), value => [key, value])));
/** @internal */
exports.updateWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, key, f) => core.flatMap((0, exports.get)(self, key), option => Option.match(f(option), {
  onNone: () => stm.as((0, exports.remove)(self, key), Option.none()),
  onSome: value => stm.as((0, exports.set)(self, key, value), Option.some(value))
})));
/** @internal */
const values = self => core.map((0, exports.toArray)(self), RA.map(entry => entry[1]));
exports.values = values;
//# sourceMappingURL=tMap.js.map