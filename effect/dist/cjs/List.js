"use strict";

/**
 * A data type for immutable linked lists representing ordered collections of elements of type `A`.
 *
 * This data type is optimal for last-in-first-out (LIFO), stack-like access patterns. If you need another access pattern, for example, random access or FIFO, consider using a collection more suited to this than `List`.
 *
 * **Performance**
 *
 * - Time: `List` has `O(1)` prepend and head/tail access. Most other operations are `O(n)` on the number of elements in the list. This includes the index-based lookup of elements, `length`, `append` and `reverse`.
 * - Space: `List` implements structural sharing of the tail list. This means that many operations are either zero- or constant-memory cost.
 *
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeTail = exports.unsafeLast = exports.unsafeHead = exports.toChunk = exports.take = exports.tail = exports.splitAt = exports.reverse = exports.reduceRight = exports.reduce = exports.partitionMap = exports.partition = exports.map = exports.last = exports.head = exports.forEach = exports.flatMapNonEmpty = exports.flatMap = exports.findFirst = exports.compact = exports.filterMap = exports.filter = exports.some = exports.every = exports.drop = exports.prependAllReversed = exports.prependAllNonEmpty = exports.prependAll = exports.prepend = exports.appendAllNonEmpty = exports.appendAll = exports.append = exports.make = exports.fromIterable = exports.of = exports.empty = exports.cons = exports.nil = exports.size = exports.isCons = exports.isNil = exports.isList = exports.getEquivalence = exports.toReadonlyArray = exports.TypeId = void 0;
/**
 * This file is ported from
 *
 * Scala (https://www.scala-lang.org)
 *
 * Copyright EPFL and Lightbend, Inc.
 *
 * Licensed under Apache License 2.0
 * (http://www.apache.org/licenses/LICENSE-2.0).
 */
const Chunk = /*#__PURE__*/require("./Chunk.js");
const Either = /*#__PURE__*/require("./Either.js");
const Equal = /*#__PURE__*/require("./Equal.js");
const Equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Hash = /*#__PURE__*/require("./Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const Option = /*#__PURE__*/require("./Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const ReadonlyArray = /*#__PURE__*/require("./ReadonlyArray.js");
/**
 * @since 2.0.0
 * @category symbol
 */
exports.TypeId = /*#__PURE__*/Symbol.for("effect/List");
/**
 * Converts the specified `List` to a `ReadonlyArray`.
 *
 * @category conversions
 * @since 2.0.0
 */
const toReadonlyArray = self => Array.from(self);
exports.toReadonlyArray = toReadonlyArray;
/**
 * @category equivalence
 * @since 2.0.0
 */
const getEquivalence = isEquivalent => Equivalence.mapInput(ReadonlyArray.getEquivalence(isEquivalent), exports.toReadonlyArray);
exports.getEquivalence = getEquivalence;
const _equivalence = /*#__PURE__*/(0, exports.getEquivalence)(Equal.equals);
const ConsProto = {
  [exports.TypeId]: exports.TypeId,
  _tag: "Cons",
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: (0, exports.toReadonlyArray)(this).map(Inspectable_js_1.toJSON)
    };
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  [Equal.symbol](that) {
    return (0, exports.isList)(that) && this._tag === that._tag && _equivalence(this, that);
  },
  [Hash.symbol]() {
    return Hash.array((0, exports.toReadonlyArray)(this));
  },
  [Symbol.iterator]() {
    let done = false;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this;
    return {
      next() {
        if (done) {
          return this.return();
        }
        if (self._tag === "Nil") {
          done = true;
          return this.return();
        }
        const value = self.head;
        self = self.tail;
        return {
          done,
          value
        };
      },
      return(value) {
        if (!done) {
          done = true;
        }
        return {
          done: true,
          value
        };
      }
    };
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
const makeCons = (head, tail) => {
  const cons = Object.create(ConsProto);
  cons.head = head;
  cons.tail = tail;
  return cons;
};
const NilProto = {
  [exports.TypeId]: exports.TypeId,
  _tag: "Nil",
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  [Hash.symbol]() {
    return Hash.array((0, exports.toReadonlyArray)(this));
  },
  [Equal.symbol](that) {
    return (0, exports.isList)(that) && this._tag === that._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: true,
          value: undefined
        };
      }
    };
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
const _Nil = /*#__PURE__*/Object.create(NilProto);
/**
 * Returns `true` if the specified value is a `List`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
const isList = u => (0, Predicate_js_1.hasProperty)(u, exports.TypeId);
exports.isList = isList;
/**
 * Returns `true` if the specified value is a `List.Nil<A>`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
const isNil = self => self._tag === "Nil";
exports.isNil = isNil;
/**
 * Returns `true` if the specified value is a `List.Cons<A>`, `false` otherwise.
 *
 * @since 2.0.0
 * @category refinements
 */
const isCons = self => self._tag === "Cons";
exports.isCons = isCons;
/**
 * Returns the number of elements contained in the specified `List`
 *
 * @since 2.0.0
 * @category getters
 */
const size = self => {
  let these = self;
  let len = 0;
  while (!(0, exports.isNil)(these)) {
    len += 1;
    these = these.tail;
  }
  return len;
};
exports.size = size;
/**
 * Constructs a new empty `List<A>`.
 *
 * @since 2.0.0
 * @category constructors
 */
const nil = () => _Nil;
exports.nil = nil;
/**
 * Constructs a new `List.Cons<A>` from the specified `head` and `tail` values.
 *
 * @since 2.0.0
 * @category constructors
 */
const cons = (head, tail) => makeCons(head, tail);
exports.cons = cons;
/**
 * Constructs a new empty `List<A>`.
 *
 * Alias of {@link nil}.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = exports.nil;
/**
 * Constructs a new `List<A>` from the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
const of = value => makeCons(value, _Nil);
exports.of = of;
/**
 * Constructs a new `List<A>` from the specified `Iterable<A>`.
 *
 * @since 2.0.0
 * @category constructors
 */
const fromIterable = prefix => {
  const iterator = prefix[Symbol.iterator]();
  let next;
  if ((next = iterator.next()) && !next.done) {
    const result = makeCons(next.value, _Nil);
    let curr = result;
    while ((next = iterator.next()) && !next.done) {
      const temp = makeCons(next.value, _Nil);
      curr.tail = temp;
      curr = temp;
    }
    return result;
  } else {
    return _Nil;
  }
};
exports.fromIterable = fromIterable;
/**
 * Constructs a new `List<A>` from the specified values.
 *
 * @since 2.0.0
 * @category constructors
 */
const make = (...elements) => (0, exports.fromIterable)(elements);
exports.make = make;
/**
 * Appends the specified element to the end of the `List`, creating a new `Cons`.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.append = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, element) => (0, exports.appendAllNonEmpty)(self, (0, exports.of)(element)));
/**
 * Concatentates the specified lists together.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.appendAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.prependAll)(that, self));
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.appendAllNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.appendAll)(self, that));
/**
 * Prepends the specified element to the beginning of the list.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.prepend = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, element) => (0, exports.cons)(element, self));
/**
 * Prepends the specified prefix list to the beginning of the specified list.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.prependAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, prefix) => {
  if ((0, exports.isNil)(self)) {
    return prefix;
  } else if ((0, exports.isNil)(prefix)) {
    return self;
  } else {
    const result = makeCons(prefix.head, self);
    let curr = result;
    let that = prefix.tail;
    while (!(0, exports.isNil)(that)) {
      const temp = makeCons(that.head, self);
      curr.tail = temp;
      curr = temp;
      that = that.tail;
    }
    return result;
  }
});
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.prependAllNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.prependAll)(self, that));
/**
 * Prepends the specified prefix list (in reverse order) to the beginning of the
 * specified list.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.prependAllReversed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, prefix) => {
  let out = self;
  let pres = prefix;
  while ((0, exports.isCons)(pres)) {
    out = makeCons(pres.head, out);
    pres = pres.tail;
  }
  return out;
});
/**
 * Drops the first `n` elements from the specified list.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.drop = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  if (n <= 0) {
    return self;
  }
  if (n >= (0, exports.size)(self)) {
    return _Nil;
  }
  let these = self;
  let i = 0;
  while (!(0, exports.isNil)(these) && i < n) {
    these = these.tail;
    i += 1;
  }
  return these;
});
/**
 * Check if a predicate holds true for every `List` element.
 *
 * @since 2.0.0
 * @category elements
 */
exports.every = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, refinement) => {
  for (const a of self) {
    if (!refinement(a)) {
      return false;
    }
  }
  return true;
});
/**
 * Check if a predicate holds true for some `List` element.
 *
 * @since 2.0.0
 * @category elements
 */
exports.some = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  let these = self;
  while (!(0, exports.isNil)(these)) {
    if (predicate(these.head)) {
      return true;
    }
    these = these.tail;
  }
  return false;
});
/**
 * Filters a list using the specified predicate.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => noneIn(self, predicate, false));
// everything seen so far is not included
const noneIn = (self, predicate, isFlipped) => {
  /* eslint-disable no-constant-condition */
  while (true) {
    if ((0, exports.isNil)(self)) {
      return _Nil;
    } else {
      if (predicate(self.head) !== isFlipped) {
        return allIn(self, self.tail, predicate, isFlipped);
      } else {
        self = self.tail;
      }
    }
  }
};
// everything from 'start' is included, if everything from this point is in we can return the origin
// start otherwise if we discover an element that is out we must create a new partial list.
const allIn = (start, remaining, predicate, isFlipped) => {
  /* eslint-disable no-constant-condition */
  while (true) {
    if ((0, exports.isNil)(remaining)) {
      return start;
    } else {
      if (predicate(remaining.head) !== isFlipped) {
        remaining = remaining.tail;
      } else {
        return partialFill(start, remaining, predicate, isFlipped);
      }
    }
  }
};
// we have seen elements that should be included then one that should be excluded, start building
const partialFill = (origStart, firstMiss, predicate, isFlipped) => {
  const newHead = makeCons((0, exports.unsafeHead)(origStart), _Nil);
  let toProcess = (0, exports.unsafeTail)(origStart);
  let currentLast = newHead;
  // we know that all elements are :: until at least firstMiss.tail
  while (!(toProcess === firstMiss)) {
    const newElem = makeCons((0, exports.unsafeHead)(toProcess), _Nil);
    currentLast.tail = newElem;
    currentLast = (0, Function_js_1.unsafeCoerce)(newElem);
    toProcess = (0, Function_js_1.unsafeCoerce)(toProcess.tail);
  }
  // at this point newHead points to a list which is a duplicate of all the 'in' elements up to the first miss.
  // currentLast is the last element in that list.
  // now we are going to try and share as much of the tail as we can, only moving elements across when we have to.
  let next = firstMiss.tail;
  let nextToCopy = (0, Function_js_1.unsafeCoerce)(next); // the next element we would need to copy to our list if we cant share.
  while (!(0, exports.isNil)(next)) {
    // generally recommended is next.isNonEmpty but this incurs an extra method call.
    const head = (0, exports.unsafeHead)(next);
    if (predicate(head) !== isFlipped) {
      next = next.tail;
    } else {
      // its not a match - do we have outstanding elements?
      while (!(nextToCopy === next)) {
        const newElem = makeCons((0, exports.unsafeHead)(nextToCopy), _Nil);
        currentLast.tail = newElem;
        currentLast = newElem;
        nextToCopy = (0, Function_js_1.unsafeCoerce)(nextToCopy.tail);
      }
      nextToCopy = (0, Function_js_1.unsafeCoerce)(next.tail);
      next = next.tail;
    }
  }
  // we have remaining elements - they are unchanged attach them to the end
  if (!(0, exports.isNil)(nextToCopy)) {
    currentLast.tail = nextToCopy;
  }
  return newHead;
};
/**
 * Filters and maps a list using the specified partial function. The resulting
 * list may be smaller than the input list due to the possibility of the partial
 * function not being defined for some elements.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.filterMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const bs = [];
  for (const a of self) {
    const oa = f(a);
    if (Option.isSome(oa)) {
      bs.push(oa.value);
    }
  }
  return (0, exports.fromIterable)(bs);
});
/**
 * Removes all `None` values from the specified list.
 *
 * @since 2.0.0
 * @category combinators
 */
const compact = self => (0, exports.filterMap)(self, Function_js_1.identity);
exports.compact = compact;
/**
 * Returns the first element that satisfies the specified
 * predicate, or `None` if no such element exists.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  let these = self;
  while (!(0, exports.isNil)(these)) {
    if (predicate(these.head)) {
      return Option.some(these.head);
    }
    these = these.tail;
  }
  return Option.none();
});
/**
 * Flat maps a list using the specified function.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  let rest = self;
  let head = undefined;
  let tail = undefined;
  while (!(0, exports.isNil)(rest)) {
    let bs = f(rest.head);
    while (!(0, exports.isNil)(bs)) {
      const next = makeCons(bs.head, _Nil);
      if (tail === undefined) {
        head = next;
      } else {
        tail.tail = next;
      }
      tail = next;
      bs = bs.tail;
    }
    rest = rest.tail;
  }
  if (head === undefined) {
    return _Nil;
  }
  return head;
});
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatMapNonEmpty = exports.flatMap;
/**
 * Applies the specified function to each element of the `List`.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.forEach = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  let these = self;
  while (!(0, exports.isNil)(these)) {
    f(these.head);
    these = these.tail;
  }
});
/**
 * Returns the first element of the specified list, or `None` if the list is
 * empty.
 *
 * @since 2.0.0
 * @category getters
 */
const head = self => (0, exports.isNil)(self) ? Option.none() : Option.some(self.head);
exports.head = head;
/**
 * Returns the last element of the specified list, or `None` if the list is
 * empty.
 *
 * @since 2.0.0
 * @category getters
 */
const last = self => (0, exports.isNil)(self) ? Option.none() : Option.some((0, exports.unsafeLast)(self));
exports.last = last;
/**
 * Applies the specified mapping function to each element of the list.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  if ((0, exports.isNil)(self)) {
    return self;
  } else {
    let i = 0;
    const head = makeCons(f(self.head, i++), _Nil);
    let nextHead = head;
    let rest = self.tail;
    while (!(0, exports.isNil)(rest)) {
      const next = makeCons(f(rest.head, i++), _Nil);
      nextHead.tail = next;
      nextHead = next;
      rest = rest.tail;
    }
    return head;
  }
});
/**
 * Partition a list into two lists, where the first list contains all elements
 * that did not satisfy the specified predicate, and the second list contains
 * all elements that did satisfy the specified predicate.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.partition = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const left = [];
  const right = [];
  for (const a of self) {
    if (predicate(a)) {
      right.push(a);
    } else {
      left.push(a);
    }
  }
  return [(0, exports.fromIterable)(left), (0, exports.fromIterable)(right)];
});
/**
 * Partition a list into two lists, where the first list contains all elements
 * for which the specified function returned a `Left`, and the second list
 * contains all elements for which the specified function returned a `Right`.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.partitionMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const left = [];
  const right = [];
  for (const a of self) {
    const e = f(a);
    if (Either.isLeft(e)) {
      left.push(e.left);
    } else {
      right.push(e.right);
    }
  }
  return [(0, exports.fromIterable)(left), (0, exports.fromIterable)(right)];
});
/**
 * Folds over the elements of the list using the specified function, using the
 * specified initial value.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => {
  let acc = zero;
  let these = self;
  while (!(0, exports.isNil)(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
/**
 * Folds over the elements of the list using the specified function, beginning
 * with the last element of the list, using the specified initial value.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduceRight = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, f) => {
  let acc = zero;
  let these = (0, exports.reverse)(self);
  while (!(0, exports.isNil)(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
/**
 * Returns a new list with the elements of the specified list in reverse order.
 *
 * @since 2.0.0
 * @category elements
 */
const reverse = self => {
  let result = (0, exports.empty)();
  let these = self;
  while (!(0, exports.isNil)(these)) {
    result = (0, exports.prepend)(result, these.head);
    these = these.tail;
  }
  return result;
};
exports.reverse = reverse;
/**
 * Splits the specified list into two lists at the specified index.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.splitAt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => [(0, exports.take)(self, n), (0, exports.drop)(self, n)]);
/**
 * Returns the tail of the specified list, or `None` if the list is empty.
 *
 * @since 2.0.0
 * @category getters
 */
const tail = self => (0, exports.isNil)(self) ? Option.none() : Option.some(self.tail);
exports.tail = tail;
/**
 * Takes the specified number of elements from the beginning of the specified
 * list.
 *
 * @since 2.0.0
 * @category combinators
 */
exports.take = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  if (n <= 0) {
    return _Nil;
  }
  if (n >= (0, exports.size)(self)) {
    return self;
  }
  let these = (0, exports.make)((0, exports.unsafeHead)(self));
  let current = (0, exports.unsafeTail)(self);
  for (let i = 1; i < n; i++) {
    these = makeCons((0, exports.unsafeHead)(current), these);
    current = (0, exports.unsafeTail)(current);
  }
  return (0, exports.reverse)(these);
});
/**
 * Converts the specified `List` to a `Chunk`.
 *
 * @since 2.0.0
 * @category conversions
 */
const toChunk = self => Chunk.fromIterable(self);
exports.toChunk = toChunk;
/**
 * Unsafely returns the first element of the specified `List`.
 *
 * @since 2.0.0
 * @category unsafe
 */
const unsafeHead = self => {
  if ((0, exports.isNil)(self)) {
    throw new Error("Expected List to be non-empty");
  }
  return self.head;
};
exports.unsafeHead = unsafeHead;
/**
 * Unsafely returns the last element of the specified `List`.
 *
 * @since 2.0.0
 * @category unsafe
 */
const unsafeLast = self => {
  if ((0, exports.isNil)(self)) {
    throw new Error("Expected List to be non-empty");
  }
  let these = self;
  let scout = self.tail;
  while (!(0, exports.isNil)(scout)) {
    these = scout;
    scout = scout.tail;
  }
  return these.head;
};
exports.unsafeLast = unsafeLast;
/**
 * Unsafely returns the tail of the specified `List`.
 *
 * @since 2.0.0
 * @category unsafe
 */
const unsafeTail = self => {
  if ((0, exports.isNil)(self)) {
    throw new Error("Expected List to be non-empty");
  }
  return self.tail;
};
exports.unsafeTail = unsafeTail;
//# sourceMappingURL=List.js.map