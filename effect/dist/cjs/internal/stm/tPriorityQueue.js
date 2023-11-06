"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toReadonlyArray = exports.toChunk = exports.takeUpTo = exports.takeOption = exports.takeAll = exports.take = exports.size = exports.retainIf = exports.removeIf = exports.peekOption = exports.peek = exports.offerAll = exports.offer = exports.make = exports.isNonEmpty = exports.isEmpty = exports.fromIterable = exports.empty = exports.TPriorityQueueImpl = exports.TPriorityQueueTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
const ReadonlyArray = /*#__PURE__*/require("../../ReadonlyArray.js");
const SortedMap = /*#__PURE__*/require("../../SortedMap.js");
const core = /*#__PURE__*/require("./core.js");
const tRef = /*#__PURE__*/require("./tRef.js");
/** @internal */
const TPriorityQueueSymbolKey = "effect/TPriorityQueue";
/** @internal */
exports.TPriorityQueueTypeId = /*#__PURE__*/Symbol.for(TPriorityQueueSymbolKey);
/** @internal */
const tPriorityQueueVariance = {
  _A: _ => _
};
/** @internal */
class TPriorityQueueImpl {
  ref;
  [exports.TPriorityQueueTypeId] = tPriorityQueueVariance;
  constructor(ref) {
    this.ref = ref;
  }
}
exports.TPriorityQueueImpl = TPriorityQueueImpl;
/** @internal */
const empty = order => (0, Function_js_1.pipe)(tRef.make(SortedMap.empty(order)), core.map(ref => new TPriorityQueueImpl(ref)));
exports.empty = empty;
/** @internal */
const fromIterable = order => iterable => (0, Function_js_1.pipe)(tRef.make(Array.from(iterable).reduce((map, value) => (0, Function_js_1.pipe)(map, SortedMap.set(value, (0, Function_js_1.pipe)(map, SortedMap.get(value), Option.match({
  onNone: () => ReadonlyArray.of(value),
  onSome: ReadonlyArray.prepend(value)
})))), SortedMap.empty(order))), core.map(ref => new TPriorityQueueImpl(ref)));
exports.fromIterable = fromIterable;
/** @internal */
const isEmpty = self => core.map(tRef.get(self.ref), SortedMap.isEmpty);
exports.isEmpty = isEmpty;
/** @internal */
const isNonEmpty = self => core.map(tRef.get(self.ref), SortedMap.isNonEmpty);
exports.isNonEmpty = isNonEmpty;
/** @internal */
const make = order => (...elements) => (0, exports.fromIterable)(order)(elements);
exports.make = make;
/** @internal */
exports.offer = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => tRef.update(self.ref, map => SortedMap.set(map, value, Option.match(SortedMap.get(map, value), {
  onNone: () => ReadonlyArray.of(value),
  onSome: ReadonlyArray.prepend(value)
}))));
/** @internal */
exports.offerAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, values) => tRef.update(self.ref, map => Array.from(values).reduce((map, value) => SortedMap.set(map, value, Option.match(SortedMap.get(map, value), {
  onNone: () => ReadonlyArray.of(value),
  onSome: ReadonlyArray.prepend(value)
})), map)));
/** @internal */
const peek = self => core.withSTMRuntime(runtime => {
  const map = tRef.unsafeGet(self.ref, runtime.journal);
  return Option.match(SortedMap.headOption(map), {
    onNone: () => core.retry,
    onSome: elements => core.succeed(elements[0])
  });
});
exports.peek = peek;
/** @internal */
const peekOption = self => tRef.modify(self.ref, map => [Option.map(SortedMap.headOption(map), elements => elements[0]), map]);
exports.peekOption = peekOption;
/** @internal */
exports.removeIf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.retainIf)(self, a => !predicate(a)));
/** @internal */
exports.retainIf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => tRef.update(self.ref, map => SortedMap.reduce(map, SortedMap.empty(SortedMap.getOrder(map)), (map, value, key) => {
  const filtered = ReadonlyArray.filter(value, predicate);
  return filtered.length > 0 ? SortedMap.set(map, key, filtered) : SortedMap.remove(map, key);
})));
/** @internal */
const size = self => tRef.modify(self.ref, map => [SortedMap.reduce(map, 0, (n, as) => n + as.length), map]);
exports.size = size;
/** @internal */
const take = self => core.withSTMRuntime(runtime => {
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
exports.take = take;
/** @internal */
const takeAll = self => tRef.modify(self.ref, map => {
  const builder = [];
  for (const entry of map) {
    builder.push(...entry[1]);
  }
  return [builder, SortedMap.empty(SortedMap.getOrder(map))];
});
exports.takeAll = takeAll;
/** @internal */
const takeOption = self => core.effect(journal => {
  const map = (0, Function_js_1.pipe)(self.ref, tRef.unsafeGet(journal));
  return Option.match(SortedMap.headOption(map), {
    onNone: () => Option.none(),
    onSome: ([key, value]) => {
      const tail = value.slice(1);
      tRef.unsafeSet(self.ref, tail.length > 0 ? SortedMap.set(map, key, tail) : SortedMap.remove(map, key), journal);
      return Option.some(value[0]);
    }
  });
});
exports.takeOption = takeOption;
/** @internal */
exports.takeUpTo = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => tRef.modify(self.ref, map => {
  const builder = [];
  const iterator = map[Symbol.iterator]();
  let updated = map;
  let index = 0;
  let next;
  while ((next = iterator.next()) && !next.done && index < n) {
    const [key, value] = next.value;
    const [left, right] = (0, Function_js_1.pipe)(value, ReadonlyArray.splitAt(n - index));
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
const toChunk = self => tRef.modify(self.ref, map => {
  const builder = [];
  for (const entry of map) {
    builder.push(...entry[1]);
  }
  return [builder, map];
});
exports.toChunk = toChunk;
/** @internal */
const toReadonlyArray = self => tRef.modify(self.ref, map => {
  const builder = [];
  for (const entry of map) {
    builder.push(...entry[1]);
  }
  return [builder, map];
});
exports.toReadonlyArray = toReadonlyArray;
//# sourceMappingURL=tPriorityQueue.js.map