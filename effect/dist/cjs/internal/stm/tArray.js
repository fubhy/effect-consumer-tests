"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSTM = exports.update = exports.transformSTM = exports.transform = exports.toArray = exports.someSTM = exports.some = exports.size = exports.reduceSTM = exports.reduceOptionSTM = exports.reduceOption = exports.reduce = exports.minOption = exports.maxOption = exports.make = exports.lastOption = exports.headOption = exports.get = exports.fromIterable = exports.forEach = exports.findLastSTM = exports.findLastIndexFrom = exports.findLastIndex = exports.findLast = exports.findFirstSTM = exports.findFirstIndexWhereFromSTM = exports.findFirstIndexWhereSTM = exports.findFirstIndexWhereFrom = exports.findFirstIndexWhere = exports.findFirstIndexFrom = exports.findFirstIndex = exports.findFirst = exports.everySTM = exports.every = exports.empty = exports.countSTM = exports.count = exports.contains = exports.collectFirstSTM = exports.collectFirst = exports.TArrayImpl = exports.TArrayTypeId = void 0;
const Equal = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
const Order = /*#__PURE__*/require("../../Order.js");
const core = /*#__PURE__*/require("./core.js");
const stm = /*#__PURE__*/require("./stm.js");
const tRef = /*#__PURE__*/require("./tRef.js");
/** @internal */
const TArraySymbolKey = "effect/TArray";
/** @internal */
exports.TArrayTypeId = /*#__PURE__*/Symbol.for(TArraySymbolKey);
/** @internal */
const tArrayVariance = {
  _A: _ => _
};
/** @internal */
class TArrayImpl {
  chunk;
  [exports.TArrayTypeId] = tArrayVariance;
  constructor(chunk) {
    this.chunk = chunk;
  }
}
exports.TArrayImpl = TArrayImpl;
/** @internal */
exports.collectFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.collectFirstSTM)(self, a => (0, Function_js_1.pipe)(pf(a), Option.map(core.succeed))));
/** @internal */
exports.collectFirstSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => core.withSTMRuntime(runtime => {
  let index = 0;
  let result = Option.none();
  while (Option.isNone(result) && index < self.chunk.length) {
    const element = (0, Function_js_1.pipe)(self.chunk[index], tRef.unsafeGet(runtime.journal));
    const option = pf(element);
    if (Option.isSome(option)) {
      result = option;
    }
    index = index + 1;
  }
  return (0, Function_js_1.pipe)(result, Option.match({
    onNone: () => stm.succeedNone,
    onSome: core.map(Option.some)
  }));
}));
/** @internal */
exports.contains = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.some)(self, a => Equal.equals(a)(value)));
/** @internal */
exports.count = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.reduce)(self, 0, (n, a) => predicate(a) ? n + 1 : n));
/** @internal */
exports.countSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.reduceSTM)(self, 0, (n, a) => core.map(predicate(a), bool => bool ? n + 1 : n)));
/** @internal */
const empty = () => (0, exports.fromIterable)([]);
exports.empty = empty;
/** @internal */
exports.every = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => stm.negate((0, exports.some)(self, a => !predicate(a))));
/** @internal */
exports.everySTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.map((0, exports.countSTM)(self, predicate), count => count === self.chunk.length));
/** @internal */
exports.findFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.collectFirst)(self, a => predicate(a) ? Option.some(a) : Option.none()));
/** @internal */
exports.findFirstIndex = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.findFirstIndexFrom)(self, value, 0));
/** @internal */
exports.findFirstIndexFrom = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, value, from) => (0, exports.findFirstIndexWhereFrom)(self, a => Equal.equals(a)(value), from));
/** @internal */
exports.findFirstIndexWhere = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.findFirstIndexWhereFrom)(self, predicate, 0));
/** @internal */
exports.findFirstIndexWhereFrom = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, predicate, from) => {
  if (from < 0) {
    return stm.succeedNone;
  }
  return core.effect(journal => {
    let index = from;
    let found = false;
    while (!found && index < self.chunk.length) {
      const element = tRef.unsafeGet(self.chunk[index], journal);
      found = predicate(element);
      index = index + 1;
    }
    if (found) {
      return Option.some(index - 1);
    }
    return Option.none();
  });
});
/** @internal */
exports.findFirstIndexWhereSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.findFirstIndexWhereFromSTM)(self, predicate, 0));
/** @internal */
exports.findFirstIndexWhereFromSTM = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, predicate, from) => {
  const forIndex = index => index < self.chunk.length ? (0, Function_js_1.pipe)(tRef.get(self.chunk[index]), core.flatMap(predicate), core.flatMap(bool => bool ? core.succeed(Option.some(index)) : forIndex(index + 1))) : stm.succeedNone;
  return from < 0 ? stm.succeedNone : forIndex(from);
});
/** @internal */
exports.findFirstSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const init = [Option.none(), 0];
  const cont = state => Option.isNone(state[0]) && state[1] < self.chunk.length - 1;
  return core.map(stm.iterate(init, {
    while: cont,
    body: state => {
      const index = state[1];
      return (0, Function_js_1.pipe)(tRef.get(self.chunk[index]), core.flatMap(value => core.map(predicate(value), bool => [bool ? Option.some(value) : Option.none(), index + 1])));
    }
  }), state => state[0]);
});
/** @internal */
exports.findLast = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.effect(journal => {
  let index = self.chunk.length - 1;
  let result = Option.none();
  while (Option.isNone(result) && index >= 0) {
    const element = tRef.unsafeGet(self.chunk[index], journal);
    if (predicate(element)) {
      result = Option.some(element);
    }
    index = index - 1;
  }
  return result;
}));
/** @internal */
exports.findLastIndex = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.findLastIndexFrom)(self, value, self.chunk.length - 1));
/** @internal */
exports.findLastIndexFrom = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, value, end) => {
  if (end >= self.chunk.length) {
    return stm.succeedNone;
  }
  return core.effect(journal => {
    let index = end;
    let found = false;
    while (!found && index >= 0) {
      const element = tRef.unsafeGet(self.chunk[index], journal);
      found = Equal.equals(element)(value);
      index = index - 1;
    }
    if (found) {
      return Option.some(index + 1);
    }
    return Option.none();
  });
});
/** @internal */
exports.findLastSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const init = [Option.none(), self.chunk.length - 1];
  const cont = state => Option.isNone(state[0]) && state[1] >= 0;
  return core.map(stm.iterate(init, {
    while: cont,
    body: state => {
      const index = state[1];
      return (0, Function_js_1.pipe)(tRef.get(self.chunk[index]), core.flatMap(value => core.map(predicate(value), bool => [bool ? Option.some(value) : Option.none(), index - 1])));
    }
  }), state => state[0]);
});
/** @internal */
exports.forEach = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.reduceSTM)(self, void 0, (_, a) => f(a)));
/** @internal */
const fromIterable = iterable => core.map(stm.forEach(iterable, tRef.make), chunk => new TArrayImpl(chunk));
exports.fromIterable = fromIterable;
/** @internal */
exports.get = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => {
  if (index < 0 || index >= self.chunk.length) {
    return core.dieMessage("Index out of bounds");
  }
  return tRef.get(self.chunk[index]);
});
/** @internal */
const headOption = self => self.chunk.length === 0 ? core.succeed(Option.none()) : core.map(tRef.get(self.chunk[0]), Option.some);
exports.headOption = headOption;
/** @internal */
const lastOption = self => self.chunk.length === 0 ? stm.succeedNone : core.map(tRef.get(self.chunk[self.chunk.length - 1]), Option.some);
exports.lastOption = lastOption;
/** @internal */
const make = (...elements) => (0, exports.fromIterable)(elements);
exports.make = make;
/** @internal */
exports.maxOption = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, order) => {
  const greaterThan = Order.greaterThan(order);
  return (0, exports.reduceOption)(self, (acc, curr) => greaterThan(acc)(curr) ? curr : acc);
});
/** @internal */
exports.minOption = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, order) => {
  const lessThan = Order.lessThan(order);
  return (0, exports.reduceOption)(self, (acc, curr) => lessThan(acc)(curr) ? curr : acc);
});
/** @internal */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => core.effect(journal => {
  let index = 0;
  let result = zero;
  while (index < self.chunk.length) {
    const element = tRef.unsafeGet(self.chunk[index], journal);
    result = f(result, element);
    index = index + 1;
  }
  return result;
}));
/** @internal */
exports.reduceOption = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.effect(journal => {
  let index = 0;
  let result = undefined;
  while (index < self.chunk.length) {
    const element = tRef.unsafeGet(self.chunk[index], journal);
    result = result === undefined ? element : f(result, element);
    index = index + 1;
  }
  return Option.fromNullable(result);
}));
/** @internal */
exports.reduceOptionSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.reduceSTM)(self, Option.none(), (acc, curr) => Option.isSome(acc) ? core.map(f(acc.value, curr), Option.some) : stm.succeedSome(curr)));
/** @internal */
exports.reduceSTM = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => core.flatMap((0, exports.toArray)(self), stm.reduce(zero, f)));
/** @internal */
const size = self => self.chunk.length;
exports.size = size;
/** @internal */
exports.some = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.map((0, exports.findFirst)(self, predicate), Option.isSome));
/** @internal */
exports.someSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => core.map((0, exports.countSTM)(self, predicate), n => n > 0));
/** @internal */
const toArray = self => stm.forEach(self.chunk, tRef.get);
exports.toArray = toArray;
/** @internal */
exports.transform = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.effect(journal => {
  let index = 0;
  while (index < self.chunk.length) {
    const ref = self.chunk[index];
    tRef.unsafeSet(ref, f(tRef.unsafeGet(ref, journal)), journal);
    index = index + 1;
  }
  return void 0;
}));
/** @internal */
exports.transformSTM = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => core.flatMap(stm.forEach(self.chunk, ref => core.flatMap(tRef.get(ref), f)), chunk => core.effect(journal => {
  const iterator = chunk[Symbol.iterator]();
  let index = 0;
  let next;
  while ((next = iterator.next()) && !next.done) {
    tRef.unsafeSet(self.chunk[index], next.value, journal);
    index = index + 1;
  }
  return void 0;
})));
/** @internal */
exports.update = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, index, f) => {
  if (index < 0 || index >= self.chunk.length) {
    return core.dieMessage("Index out of bounds");
  }
  return tRef.update(self.chunk[index], f);
});
/** @internal */
exports.updateSTM = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, index, f) => {
  if (index < 0 || index >= self.chunk.length) {
    return core.dieMessage("Index out of bounds");
  }
  return (0, Function_js_1.pipe)(tRef.get(self.chunk[index]), core.flatMap(f), core.flatMap(updated => tRef.set(self.chunk[index], updated)));
});
//# sourceMappingURL=tArray.js.map