import { dual, pipe } from "../../Function.js";
import * as Option from "../../Option.js";
import * as ReadonlyArray from "../../ReadonlyArray.js";
import * as SortedMap from "../../SortedMap.js";
import * as core from "./core.js";
import * as tRef from "./tRef.js";
/** @internal */
const TPriorityQueueSymbolKey = "effect/TPriorityQueue";
/** @internal */
export const TPriorityQueueTypeId = /*#__PURE__*/Symbol.for(TPriorityQueueSymbolKey);
/** @internal */
const tPriorityQueueVariance = {
  _A: _ => _
};
/** @internal */
export class TPriorityQueueImpl {
  ref;
  [TPriorityQueueTypeId] = tPriorityQueueVariance;
  constructor(ref) {
    this.ref = ref;
  }
}
/** @internal */
export const empty = order => pipe(tRef.make(SortedMap.empty(order)), core.map(ref => new TPriorityQueueImpl(ref)));
/** @internal */
export const fromIterable = order => iterable => pipe(tRef.make(Array.from(iterable).reduce((map, value) => pipe(map, SortedMap.set(value, pipe(map, SortedMap.get(value), Option.match({
  onNone: () => ReadonlyArray.of(value),
  onSome: ReadonlyArray.prepend(value)
})))), SortedMap.empty(order))), core.map(ref => new TPriorityQueueImpl(ref)));
/** @internal */
export const isEmpty = self => core.map(tRef.get(self.ref), SortedMap.isEmpty);
/** @internal */
export const isNonEmpty = self => core.map(tRef.get(self.ref), SortedMap.isNonEmpty);
/** @internal */
export const make = order => (...elements) => fromIterable(order)(elements);
/** @internal */
export const offer = /*#__PURE__*/dual(2, (self, value) => tRef.update(self.ref, map => SortedMap.set(map, value, Option.match(SortedMap.get(map, value), {
  onNone: () => ReadonlyArray.of(value),
  onSome: ReadonlyArray.prepend(value)
}))));
/** @internal */
export const offerAll = /*#__PURE__*/dual(2, (self, values) => tRef.update(self.ref, map => Array.from(values).reduce((map, value) => SortedMap.set(map, value, Option.match(SortedMap.get(map, value), {
  onNone: () => ReadonlyArray.of(value),
  onSome: ReadonlyArray.prepend(value)
})), map)));
/** @internal */
export const peek = self => core.withSTMRuntime(runtime => {
  const map = tRef.unsafeGet(self.ref, runtime.journal);
  return Option.match(SortedMap.headOption(map), {
    onNone: () => core.retry,
    onSome: elements => core.succeed(elements[0])
  });
});
/** @internal */
export const peekOption = self => tRef.modify(self.ref, map => [Option.map(SortedMap.headOption(map), elements => elements[0]), map]);
/** @internal */
export const removeIf = /*#__PURE__*/dual(2, (self, predicate) => retainIf(self, a => !predicate(a)));
/** @internal */
export const retainIf = /*#__PURE__*/dual(2, (self, predicate) => tRef.update(self.ref, map => SortedMap.reduce(map, SortedMap.empty(SortedMap.getOrder(map)), (map, value, key) => {
  const filtered = ReadonlyArray.filter(value, predicate);
  return filtered.length > 0 ? SortedMap.set(map, key, filtered) : SortedMap.remove(map, key);
})));
/** @internal */
export const size = self => tRef.modify(self.ref, map => [SortedMap.reduce(map, 0, (n, as) => n + as.length), map]);
/** @internal */
export const take = self => core.withSTMRuntime(runtime => {
  const map = tRef.unsafeGet(self.ref, runtime.journal);
  return Option.match(SortedMap.headOption(map), {
    onNone: () => core.retry,
    onSome: values => {
      const head = values[1][0];
      const tail = values[1].slice(1);
      tRef.unsafeSet(self.ref, tail.length > 0 ? SortedMap.set(map, head, tail) : SortedMap.remove(map, head), runtime.journal);
      return core.succeed(head);
    }
  });
});
/** @internal */
export const takeAll = self => tRef.modify(self.ref, map => {
  const builder = [];
  for (const entry of map) {
    builder.push(...entry[1]);
  }
  return [builder, SortedMap.empty(SortedMap.getOrder(map))];
});
/** @internal */
export const takeOption = self => core.effect(journal => {
  const map = pipe(self.ref, tRef.unsafeGet(journal));
  return Option.match(SortedMap.headOption(map), {
    onNone: () => Option.none(),
    onSome: ([key, value]) => {
      const tail = value.slice(1);
      tRef.unsafeSet(self.ref, tail.length > 0 ? SortedMap.set(map, key, tail) : SortedMap.remove(map, key), journal);
      return Option.some(value[0]);
    }
  });
});
/** @internal */
export const takeUpTo = /*#__PURE__*/dual(2, (self, n) => tRef.modify(self.ref, map => {
  const builder = [];
  const iterator = map[Symbol.iterator]();
  let updated = map;
  let index = 0;
  let next;
  while ((next = iterator.next()) && !next.done && index < n) {
    const [key, value] = next.value;
    const [left, right] = pipe(value, ReadonlyArray.splitAt(n - index));
    builder.push(...left);
    if (right.length > 0) {
      updated = SortedMap.set(updated, key, right);
    } else {
      updated = SortedMap.remove(updated, key);
    }
    index = index + left.length;
  }
  return [builder, updated];
}));
/** @internal */
export const toChunk = self => tRef.modify(self.ref, map => {
  const builder = [];
  for (const entry of map) {
    builder.push(...entry[1]);
  }
  return [builder, map];
});
/** @internal */
export const toReadonlyArray = self => tRef.modify(self.ref, map => {
  const builder = [];
  for (const entry of map) {
    builder.push(...entry[1]);
  }
  return [builder, map];
});
//# sourceMappingURL=tPriorityQueue.js.map