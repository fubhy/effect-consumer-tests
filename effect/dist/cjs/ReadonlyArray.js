"use strict";

/**
 * This module provides utility functions for working with arrays in TypeScript.
 *
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modify = exports.replaceOption = exports.replace = exports.insertAt = exports.findLast = exports.findFirst = exports.findLastIndex = exports.findFirstIndex = exports.dropWhile = exports.dropRight = exports.drop = exports.span = exports.takeWhile = exports.takeRight = exports.take = exports.initNonEmpty = exports.init = exports.tailNonEmpty = exports.tail = exports.lastNonEmpty = exports.last = exports.headNonEmpty = exports.head = exports.unappend = exports.unprepend = exports.unsafeGet = exports.get = exports.length = exports.isNonEmptyReadonlyArray = exports.isNonEmptyArray = exports.isEmptyReadonlyArray = exports.isEmptyArray = exports.scanRight = exports.scan = exports.appendAllNonEmpty = exports.appendAll = exports.append = exports.prependAllNonEmpty = exports.prependAll = exports.prepend = exports.matchRight = exports.matchLeft = exports.match = exports.fromOption = exports.fromRecord = exports.fromIterable = exports.replicate = exports.range = exports.makeBy = exports.make = void 0;
exports.flatMapNonEmpty = exports.flatMap = exports.map = exports.of = exports.empty = exports.difference = exports.differenceWith = exports.intersection = exports.intersectionWith = exports.unionNonEmpty = exports.unionNonEmptyWith = exports.union = exports.unionWith = exports.groupBy = exports.group = exports.groupWith = exports.chunksOfNonEmpty = exports.chunksOf = exports.splitNonEmptyAt = exports.copy = exports.splitAt = exports.chopNonEmpty = exports.chop = exports.dedupeNonEmpty = exports.dedupeNonEmptyWith = exports.contains = exports.containsWith = exports.rotateNonEmpty = exports.rotate = exports.setNonEmptyLast = exports.modifyNonEmptyLast = exports.setNonEmptyHead = exports.modifyNonEmptyHead = exports.intersperseNonEmpty = exports.intersperse = exports.unzipNonEmpty = exports.unzip = exports.zipNonEmptyWith = exports.zipNonEmpty = exports.zipWith = exports.zip = exports.sortByNonEmpty = exports.sortBy = exports.sortNonEmpty = exports.sortWith = exports.sort = exports.reverseNonEmpty = exports.reverse = exports.remove = exports.modifyOption = void 0;
exports.cartesian = exports.cartesianWith = exports.mapAccum = exports.join = exports.dedupeAdjacent = exports.dedupeAdjacentWith = exports.dedupe = exports.dedupeWith = exports.forEach = exports.getEquivalence = exports.getOrder = exports.unfold = exports.max = exports.min = exports.extend = exports.some = exports.every = exports.liftEither = exports.flatMapNullable = exports.liftNullable = exports.fromNullable = exports.liftOption = exports.liftPredicate = exports.reduceRight = exports.reduce = exports.separate = exports.partition = exports.filter = exports.compact = exports.partitionMap = exports.filterMapWhile = exports.filterMap = exports.flattenNonEmpty = exports.flatten = void 0;
const E = /*#__PURE__*/require("./Either.js");
const Equal = /*#__PURE__*/require("./Equal.js");
const Equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const readonlyArray = /*#__PURE__*/require("./internal/readonlyArray.js");
const O = /*#__PURE__*/require("./Option.js");
const Order = /*#__PURE__*/require("./Order.js");
const RR = /*#__PURE__*/require("./ReadonlyRecord.js");
/**
 * Builds a `NonEmptyArray` from an non-empty collection of elements.
 *
 * @category constructors
 * @since 2.0.0
 */
const make = (...elements) => elements;
exports.make = make;
/**
 * Return a `NonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to an integer >= 1.
 *
 * @example
 * import { makeBy } from 'effect/ReadonlyArray'
 *
 * assert.deepStrictEqual(makeBy(5, n => n * 2), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.0.0
 */
const makeBy = (n, f) => {
  const max = Math.max(1, Math.floor(n));
  const out = [f(0)];
  for (let i = 1; i < max; i++) {
    out.push(f(i));
  }
  return out;
};
exports.makeBy = makeBy;
/**
 * Return a `NonEmptyArray` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'effect/ReadonlyArray'
 *
 * assert.deepStrictEqual(range(1, 3), [1, 2, 3])
 *
 * @category constructors
 * @since 2.0.0
 */
const range = (start, end) => start <= end ? (0, exports.makeBy)(end - start + 1, i => start + i) : [start];
exports.range = range;
/**
 * Return a `NonEmptyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to an integer >= 1.
 *
 * @example
 * import { replicate } from 'effect/ReadonlyArray'
 *
 * assert.deepStrictEqual(replicate("a", 3), ["a", "a", "a"])
 *
 * @category constructors
 * @since 2.0.0
 */
exports.replicate = /*#__PURE__*/(0, Function_js_1.dual)(2, (a, n) => (0, exports.makeBy)(n, () => a));
/**
 * @category conversions
 * @since 2.0.0
 */
const fromIterable = collection => Array.isArray(collection) ? collection : Array.from(collection);
exports.fromIterable = fromIterable;
/**
 * Takes a record and returns an array of tuples containing its keys and values.
 *
 * @param self - The record to transform.
 *
 * @example
 * import { fromRecord } from "effect/ReadonlyArray"
 *
 * const x = { a: 1, b: 2, c: 3 }
 * assert.deepStrictEqual(fromRecord(x), [["a", 1], ["b", 2], ["c", 3]])
 *
 * @category conversions
 * @since 2.0.0
 */
exports.fromRecord = RR.toEntries;
/**
 * @category conversions
 * @since 2.0.0
 */
exports.fromOption = O.toArray;
/**
 * @category pattern matching
 * @since 2.0.0
 */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onEmpty,
  onNonEmpty
}) => (0, exports.isNonEmptyReadonlyArray)(self) ? onNonEmpty(self) : onEmpty());
/**
 * @category pattern matching
 * @since 2.0.0
 */
exports.matchLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onEmpty,
  onNonEmpty
}) => (0, exports.isNonEmptyReadonlyArray)(self) ? onNonEmpty((0, exports.headNonEmpty)(self), (0, exports.tailNonEmpty)(self)) : onEmpty());
/**
 * @category pattern matching
 * @since 2.0.0
 */
exports.matchRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onEmpty,
  onNonEmpty
}) => (0, exports.isNonEmptyReadonlyArray)(self) ? onNonEmpty((0, exports.initNonEmpty)(self), (0, exports.lastNonEmpty)(self)) : onEmpty());
/**
 * Prepend an element to the front of an `Iterable`, creating a new `NonEmptyArray`.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.prepend = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, head) => [head, ...self]);
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.prependAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.fromIterable)(that).concat((0, exports.fromIterable)(self)));
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.prependAllNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.prependAll)(self, that));
/**
 * Append an element to the end of an `Iterable`, creating a new `NonEmptyArray`.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.append = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, last) => [...self, last]);
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.appendAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.fromIterable)(self).concat((0, exports.fromIterable)(that)));
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.appendAllNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.appendAll)(self, that));
/**
 * Reduce an `Iterable` from the left, keeping all intermediate results instead of only the final result.
 *
 * @category folding
 * @since 2.0.0
 */
exports.scan = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, b, f) => {
  const out = [b];
  let i = 0;
  for (const a of self) {
    out[i + 1] = f(out[i], a);
    i++;
  }
  return out;
});
/**
 * Reduce an `Iterable` from the right, keeping all intermediate results instead of only the final result.
 *
 * @category folding
 * @since 2.0.0
 */
exports.scanRight = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, b, f) => {
  const input = (0, exports.fromIterable)(self);
  const out = new Array(input.length + 1);
  out[input.length] = b;
  for (let i = input.length - 1; i >= 0; i--) {
    out[i] = f(out[i + 1], input[i]);
  }
  return out;
});
/**
 * Determine if an `Array` is empty narrowing down the type to `[]`.
 *
 * @param self - The `Array` to check.
 *
 * @example
 * import { isEmptyArray } from "effect/ReadonlyArray"
 *
 * assert.deepStrictEqual(isEmptyArray([]), true);
 * assert.deepStrictEqual(isEmptyArray([1, 2, 3]), false);
 *
 * @category guards
 * @since 2.0.0
 */
const isEmptyArray = self => self.length === 0;
exports.isEmptyArray = isEmptyArray;
/**
 * Determine if a `ReadonlyArray` is empty narrowing down the type to `readonly []`.
 *
 * @param self - The `ReadonlyArray` to check.
 *
 * @example
 * import { isEmptyReadonlyArray } from "effect/ReadonlyArray"
 *
 * assert.deepStrictEqual(isEmptyReadonlyArray([]), true);
 * assert.deepStrictEqual(isEmptyReadonlyArray([1, 2, 3]), false);
 *
 * @category guards
 * @since 2.0.0
 */
exports.isEmptyReadonlyArray = exports.isEmptyArray;
/**
 * Determine if an `Array` is non empty narrowing down the type to `NonEmptyArray`.
 *
 * An `Array` is considered to be a `NonEmptyArray` if it contains at least one element.
 *
 * @param self - The `Array` to check.
 *
 * @example
 * import { isNonEmptyArray } from "effect/ReadonlyArray"
 *
 * assert.deepStrictEqual(isNonEmptyArray([]), false);
 * assert.deepStrictEqual(isNonEmptyArray([1, 2, 3]), true);
 *
 * @category guards
 * @since 2.0.0
 */
exports.isNonEmptyArray = readonlyArray.isNonEmptyArray;
/**
 * Determine if a `ReadonlyArray` is non empty narrowing down the type to `NonEmptyReadonlyArray`.
 *
 * A `ReadonlyArray` is considered to be a `NonEmptyReadonlyArray` if it contains at least one element.
 *
 * @param self - The `ReadonlyArray` to check.
 *
 * @example
 * import { isNonEmptyReadonlyArray } from "effect/ReadonlyArray"
 *
 * assert.deepStrictEqual(isNonEmptyReadonlyArray([]), false);
 * assert.deepStrictEqual(isNonEmptyReadonlyArray([1, 2, 3]), true);
 *
 * @category guards
 * @since 2.0.0
 */
exports.isNonEmptyReadonlyArray = readonlyArray.isNonEmptyArray;
/**
 * Return the number of elements in a `ReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
const length = self => self.length;
exports.length = length;
const isOutOfBound = (i, as) => i < 0 || i >= as.length;
const clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length));
/**
 * This function provides a safe way to read a value at a particular index from a `ReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
exports.get = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBound(i, self) ? O.none() : O.some(self[i]);
});
/**
 * Gets an element unsafely, will throw on out of bounds.
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => {
  const i = Math.floor(index);
  if (isOutOfBound(i, self)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self[i];
});
/**
 * Return a tuple containing the first element, and a new `Array` of the remaining elements, if any.
 *
 * @category getters
 * @since 2.0.0
 */
const unprepend = self => [(0, exports.headNonEmpty)(self), (0, exports.tailNonEmpty)(self)];
exports.unprepend = unprepend;
/**
 * Return a tuple containing a copy of the `NonEmptyReadonlyArray` without its last element, and that last element.
 *
 * @category getters
 * @since 2.0.0
 */
const unappend = self => [(0, exports.initNonEmpty)(self), (0, exports.lastNonEmpty)(self)];
exports.unappend = unappend;
/**
 * Get the first element of a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
exports.head = /*#__PURE__*/(0, exports.get)(0);
/**
 * @category getters
 * @since 2.0.0
 */
exports.headNonEmpty = /*#__PURE__*/(0, exports.unsafeGet)(0);
/**
 * Get the last element in a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
const last = self => (0, exports.isNonEmptyReadonlyArray)(self) ? O.some((0, exports.lastNonEmpty)(self)) : O.none();
exports.last = last;
/**
 * @category getters
 * @since 2.0.0
 */
const lastNonEmpty = self => self[self.length - 1];
exports.lastNonEmpty = lastNonEmpty;
/**
 * Get all but the first element of an `Iterable`, creating a new `Array`, or `None` if the `Iterable` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
const tail = self => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? O.some((0, exports.tailNonEmpty)(input)) : O.none();
};
exports.tail = tail;
/**
 * @category getters
 * @since 2.0.0
 */
const tailNonEmpty = self => self.slice(1);
exports.tailNonEmpty = tailNonEmpty;
/**
 * Get all but the last element of an `Iterable`, creating a new `Array`, or `None` if the `Iterable` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
const init = self => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? O.some((0, exports.initNonEmpty)(input)) : O.none();
};
exports.init = init;
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @category getters
 * @since 2.0.0
 */
const initNonEmpty = self => self.slice(0, -1);
exports.initNonEmpty = initNonEmpty;
/**
 * Keep only a max number of elements from the start of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
exports.take = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const input = (0, exports.fromIterable)(self);
  return input.slice(0, clamp(n, input));
});
/**
 * Keep only a max number of elements from the end of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
exports.takeRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const input = (0, exports.fromIterable)(self);
  const i = clamp(n, input);
  return i === 0 ? [] : input.slice(-i);
});
/**
 * Calculate the longest initial subarray for which all element satisfy the specified predicate, creating a new `Array`.
 *
 * @category getters
 * @since 2.0.0
 */
exports.takeWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const out = [];
  for (const a of self) {
    if (!predicate(a)) {
      break;
    }
    out.push(a);
  }
  return out;
});
const spanIndex = (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (!predicate(a)) {
      break;
    }
    i++;
  }
  return i;
};
/**
 * Split an `Iterable` into two parts:
 *
 * 1. the longest initial subarray for which all elements satisfy the specified predicate
 * 2. the remaining elements
 *
 * @category filtering
 * @since 2.0.0
 */
exports.span = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.splitAt)(self, spanIndex(self, predicate)));
/**
 * Drop a max number of elements from the start of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
exports.drop = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const input = (0, exports.fromIterable)(self);
  return input.slice(clamp(n, input), input.length);
});
/**
 * Drop a max number of elements from the end of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
exports.dropRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const input = (0, exports.fromIterable)(self);
  return input.slice(0, input.length - clamp(n, input));
});
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new `Array`.
 *
 * @category getters
 * @since 2.0.0
 */
exports.dropWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.fromIterable)(self).slice(spanIndex(self, predicate)));
/**
 * Return the first index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findFirstIndex = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (predicate(a)) {
      return O.some(i);
    }
    i++;
  }
  return O.none();
});
/**
 * Return the last index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findLastIndex = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const input = (0, exports.fromIterable)(self);
  for (let i = input.length - 1; i >= 0; i--) {
    if (predicate(input[i])) {
      return O.some(i);
    }
  }
  return O.none();
});
/**
 * Returns the first element that satisfies the specified
 * predicate, or `None` if no such element exists.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findFirst = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const input = (0, exports.fromIterable)(self);
  for (let i = 0; i < input.length; i++) {
    if (predicate(input[i])) {
      return O.some(input[i]);
    }
  }
  return O.none();
});
/**
 * Find the last element for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findLast = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const input = (0, exports.fromIterable)(self);
  for (let i = input.length - 1; i >= 0; i--) {
    if (predicate(input[i])) {
      return O.some(input[i]);
    }
  }
  return O.none();
});
/**
 * Insert an element at the specified index, creating a new `NonEmptyArray`,
 * or return `None` if the index is out of bounds.
 *
 * @since 2.0.0
 */
exports.insertAt = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, b) => {
  const out = Array.from(self);
  //             v--- `= self.length` is ok, it means inserting in last position
  if (i < 0 || i > out.length) {
    return O.none();
  }
  out.splice(i, 0, b);
  return O.some(out);
});
/**
 * Change the element at the specified index, creating a new `Array`,
 * or return a copy of the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
exports.replace = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, b) => (0, exports.modify)(self, i, () => b));
/**
 * @since 2.0.0
 */
exports.replaceOption = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, b) => (0, exports.modifyOption)(self, i, () => b));
/**
 * Apply a function to the element at the specified index, creating a new `Array`,
 * or return a copy of the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
exports.modify = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, f) => O.getOrElse((0, exports.modifyOption)(self, i, f), () => Array.from(self)));
/**
 * Apply a function to the element at the specified index, creating a new `Array`,
 * or return `None` if the index is out of bounds.
 *
 * @since 2.0.0
 */
exports.modifyOption = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, f) => {
  const out = Array.from(self);
  if (isOutOfBound(i, out)) {
    return O.none();
  }
  const next = f(out[i]);
  // @ts-expect-error
  out[i] = next;
  return O.some(out);
});
/**
 * Delete the element at the specified index, creating a new `Array`,
 * or return a copy of the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
exports.remove = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, i) => {
  const out = Array.from(self);
  if (isOutOfBound(i, out)) {
    return out;
  }
  out.splice(i, 1);
  return out;
});
/**
 * Reverse an `Iterable`, creating a new `Array`.
 *
 * @category elements
 * @since 2.0.0
 */
const reverse = self => Array.from(self).reverse();
exports.reverse = reverse;
/**
 * @category elements
 * @since 2.0.0
 */
const reverseNonEmpty = self => [(0, exports.lastNonEmpty)(self), ...self.slice(0, -1).reverse()];
exports.reverseNonEmpty = reverseNonEmpty;
/**
 * Sort the elements of an `Iterable` in increasing order, creating a new `Array`.
 *
 * @category sorting
 * @since 2.0.0
 */
exports.sort = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
/**
 * @since 2.0.0
 * @category elements
 */
exports.sortWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, f, order) => (0, exports.sort)(self, Order.mapInput(order, f)));
/**
 * Sort the elements of a `NonEmptyReadonlyArray` in increasing order, creating a new `NonEmptyArray`.
 *
 * @category sorting
 * @since 2.0.0
 */
exports.sortNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, O) => (0, exports.sort)(O)(self));
/**
 * Sort the elements of an `Iterable` in increasing order, where elements are compared
 * using first `orders[0]`, then `orders[1]`, etc...
 *
 * @category sorting
 * @since 2.0.0
 */
const sortBy = (...orders) => self => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? (0, exports.sortByNonEmpty)(...orders)(input) : [];
};
exports.sortBy = sortBy;
/**
 * @category sorting
 * @since 2.0.0
 */
const sortByNonEmpty = (...orders) => (0, exports.sortNonEmpty)(Order.combineAll(orders));
exports.sortByNonEmpty = sortByNonEmpty;
/**
 * Takes two `Iterable`s and returns an `Array` of corresponding pairs.
 * If one input `Iterable` is short, excess elements of the
 * longer `Iterable` are discarded.
 *
 * @since 2.0.0
 */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWith)(self, that, (a, b) => [a, b]));
/**
 * Apply a function to pairs of elements at the same index in two `Iterable`s, collecting the results in a new `Array`. If one
 * input `Iterable` is short, excess elements of the longer `Iterable` are discarded.
 *
 * @since 2.0.0
 */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => {
  const as = (0, exports.fromIterable)(self);
  const bs = (0, exports.fromIterable)(that);
  return (0, exports.isNonEmptyReadonlyArray)(as) && (0, exports.isNonEmptyReadonlyArray)(bs) ? (0, exports.zipNonEmptyWith)(bs, f)(as) : [];
});
/**
 * @since 2.0.0
 */
exports.zipNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipNonEmptyWith)(self, that, (a, b) => [a, b]));
/**
 * @since 2.0.0
 */
exports.zipNonEmptyWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => {
  const cs = [f((0, exports.headNonEmpty)(self), (0, exports.headNonEmpty)(that))];
  const len = Math.min(self.length, that.length);
  for (let i = 1; i < len; i++) {
    cs[i] = f(self[i], that[i]);
  }
  return cs;
});
/**
 * This function is the inverse of `zip`. Takes an `Iterable` of pairs and return two corresponding `Array`s.
 *
 * @since 2.0.0
 */
const unzip = self => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? (0, exports.unzipNonEmpty)(input) : [[], []];
};
exports.unzip = unzip;
/**
 * @since 2.0.0
 */
const unzipNonEmpty = self => {
  const fa = [self[0][0]];
  const fb = [self[0][1]];
  for (let i = 1; i < self.length; i++) {
    fa[i] = self[i][0];
    fb[i] = self[i][1];
  }
  return [fa, fb];
};
exports.unzipNonEmpty = unzipNonEmpty;
/**
 * Places an element in between members of an `Iterable`
 *
 * @since 2.0.0
 */
exports.intersperse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, middle) => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? (0, exports.intersperseNonEmpty)(input, middle) : [];
});
/**
 * Places an element in between members of a `NonEmptyReadonlyArray`
 *
 * @since 2.0.0
 */
exports.intersperseNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, middle) => {
  const out = [(0, exports.headNonEmpty)(self)];
  const tail = (0, exports.tailNonEmpty)(self);
  for (let i = 0; i < tail.length; i++) {
    if (i < tail.length) {
      out.push(middle);
    }
    out.push(tail[i]);
  }
  return out;
});
/**
 * Apply a function to the head, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
exports.modifyNonEmptyHead = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => [f((0, exports.headNonEmpty)(self)), ...(0, exports.tailNonEmpty)(self)]);
/**
 * Change the head, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
exports.setNonEmptyHead = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, b) => (0, exports.modifyNonEmptyHead)(self, () => b));
/**
 * Apply a function to the last element, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
exports.modifyNonEmptyLast = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.append)((0, exports.initNonEmpty)(self), f((0, exports.lastNonEmpty)(self))));
/**
 * Change the last element, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
exports.setNonEmptyLast = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, b) => (0, exports.modifyNonEmptyLast)(self, () => b));
/**
 * Rotate an `Iterable` by `n` steps.
 *
 * @since 2.0.0
 */
exports.rotate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? (0, exports.rotateNonEmpty)(input, n) : [];
});
/**
 * Rotate a `NonEmptyReadonlyArray` by `n` steps.
 *
 * @since 2.0.0
 */
exports.rotateNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const len = self.length;
  const m = Math.round(n) % len;
  if (isOutOfBound(Math.abs(m), self) || m === 0) {
    return (0, exports.copy)(self);
  }
  if (m < 0) {
    const [f, s] = (0, exports.splitNonEmptyAt)(self, -m);
    return (0, exports.appendAllNonEmpty)(s, f);
  } else {
    return (0, exports.rotateNonEmpty)(self, m - len);
  }
});
/**
 * Returns a function that checks if a `ReadonlyArray` contains a given value using a provided `isEquivalent` function.
 *
 * @category elements
 * @since 2.0.0
 */
const containsWith = isEquivalent => (0, Function_js_1.dual)(2, (self, a) => {
  for (const i of self) {
    if (isEquivalent(a, i)) {
      return true;
    }
  }
  return false;
});
exports.containsWith = containsWith;
const _equivalence = /*#__PURE__*/Equal.equivalence();
/**
 * Returns a function that checks if a `ReadonlyArray` contains a given value using the default `Equivalence`.
 *
 * @category elements
 * @since 2.0.0
 */
exports.contains = /*#__PURE__*/(0, exports.containsWith)(_equivalence);
/**
 * Remove duplicates from a `NonEmptyReadonlyArray`, keeping the first occurrence of an element using the provided `isEquivalent` function.
 *
 * @since 2.0.0
 */
exports.dedupeNonEmptyWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, isEquivalent) => {
  const out = [(0, exports.headNonEmpty)(self)];
  const rest = (0, exports.tailNonEmpty)(self);
  for (const a of rest) {
    if (out.every(o => !isEquivalent(a, o))) {
      out.push(a);
    }
  }
  return out;
});
/**
 * Remove duplicates from a `NonEmptyReadonlyArray`, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 */
exports.dedupeNonEmpty = /*#__PURE__*/(0, exports.dedupeNonEmptyWith)( /*#__PURE__*/Equal.equivalence());
/**
 * A useful recursion pattern for processing an `Iterable` to produce a new `Array`, often used for "chopping" up the input
 * `Iterable`. Typically chop is called with some function that will consume an initial prefix of the `Iterable` and produce a
 * value and the rest of the `Array`.
 *
 * @since 2.0.0
 */
exports.chop = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? (0, exports.chopNonEmpty)(input, f) : [];
});
/**
 * A useful recursion pattern for processing a `NonEmptyReadonlyArray` to produce a new `NonEmptyReadonlyArray`, often used for "chopping" up the input
 * `NonEmptyReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `NonEmptyReadonlyArray` and produce a
 * value and the tail of the `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
exports.chopNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const [b, rest] = f(self);
  const out = [b];
  let next = rest;
  while (readonlyArray.isNonEmptyArray(next)) {
    const [b, rest] = f(next);
    out.push(b);
    next = rest;
  }
  return out;
});
/**
 * Splits an `Iterable` into two pieces, the first piece has max `n` elements.
 *
 * @category getters
 * @since 2.0.0
 */
exports.splitAt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const input = Array.from(self);
  return n >= 1 && (0, exports.isNonEmptyReadonlyArray)(input) ? (0, exports.splitNonEmptyAt)(input, n) : (0, exports.isEmptyReadonlyArray)(input) ? [input, []] : [[], input];
});
/**
 * @since 2.0.0
 */
exports.copy = self => self.slice();
/**
 * Splits a `NonEmptyReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category getters
 * @since 2.0.0
 */
exports.splitNonEmptyAt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const m = Math.max(1, n);
  return m >= self.length ? [(0, exports.copy)(self), []] : [(0, exports.prepend)(self.slice(1, m), (0, exports.headNonEmpty)(self)), self.slice(m)];
});
/**
 * Splits an `Iterable` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `Iterable`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `self`.
 *
 * @category getters
 * @since 2.0.0
 */
exports.chunksOf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? (0, exports.chunksOfNonEmpty)(input, n) : [];
});
/**
 * Splits a `NonEmptyReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `NonEmptyReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
exports.chunksOfNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.chopNonEmpty)(self, (0, exports.splitNonEmptyAt)(n)));
/**
 * Group equal, consecutive elements of a `NonEmptyReadonlyArray` into `NonEmptyArray`s using the provided `isEquivalent` function.
 *
 * @category grouping
 * @since 2.0.0
 */
exports.groupWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, isEquivalent) => (0, exports.chopNonEmpty)(self, as => {
  const h = (0, exports.headNonEmpty)(as);
  const out = [h];
  let i = 1;
  for (; i < as.length; i++) {
    const a = as[i];
    if (isEquivalent(a, h)) {
      out.push(a);
    } else {
      break;
    }
  }
  return [out, as.slice(i)];
}));
/**
 * Group equal, consecutive elements of a `NonEmptyReadonlyArray` into `NonEmptyArray`s.
 *
 * @category grouping
 * @since 2.0.0
 */
exports.group = /*#__PURE__*/(0, exports.groupWith)( /*#__PURE__*/Equal.equivalence());
/**
 * Splits an `Iterable` into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @category grouping
 * @since 2.0.0
 */
exports.groupBy = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const out = {};
  for (const a of self) {
    const k = f(a);
    if (Object.prototype.hasOwnProperty.call(out, k)) {
      out[k].push(a);
    } else {
      out[k] = [a];
    }
  }
  return out;
});
/**
 * @since 2.0.0
 */
const unionWith = isEquivalent => (0, Function_js_1.dual)(2, (self, that) => {
  const a = (0, exports.fromIterable)(self);
  const b = (0, exports.fromIterable)(that);
  return (0, exports.isNonEmptyReadonlyArray)(a) && (0, exports.isNonEmptyReadonlyArray)(b) ? (0, exports.unionNonEmptyWith)(isEquivalent)(a, b) : (0, exports.isNonEmptyReadonlyArray)(a) ? a : b;
});
exports.unionWith = unionWith;
/**
 * @since 2.0.0
 */
exports.union = /*#__PURE__*/(0, exports.unionWith)(_equivalence);
/**
 * @since 2.0.0
 */
const unionNonEmptyWith = isEquivalent => {
  const dedupe = (0, exports.dedupeNonEmptyWith)(isEquivalent);
  return (0, Function_js_1.dual)(2, (self, that) => dedupe((0, exports.appendAllNonEmpty)(self, that)));
};
exports.unionNonEmptyWith = unionNonEmptyWith;
/**
 * @since 2.0.0
 */
exports.unionNonEmpty = /*#__PURE__*/(0, exports.unionNonEmptyWith)(_equivalence);
/**
 * Creates an `Array` of unique values that are included in all given `Iterable`s using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
const intersectionWith = isEquivalent => {
  const has = (0, exports.containsWith)(isEquivalent);
  return (0, Function_js_1.dual)(2, (self, that) => (0, exports.fromIterable)(self).filter(a => has(that, a)));
};
exports.intersectionWith = intersectionWith;
/**
 * Creates an `Array` of unique values that are included in all given `Iterable`s.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
exports.intersection = /*#__PURE__*/(0, exports.intersectionWith)(_equivalence);
/**
 * Creates a `Array` of values not included in the other given `Iterable` using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
const differenceWith = isEquivalent => {
  const has = (0, exports.containsWith)(isEquivalent);
  return (0, Function_js_1.dual)(2, (self, that) => (0, exports.fromIterable)(self).filter(a => !has(that, a)));
};
exports.differenceWith = differenceWith;
/**
 * Creates a `Array` of values not included in the other given `Iterable` using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
exports.difference = /*#__PURE__*/(0, exports.differenceWith)(_equivalence);
/**
 * @category constructors
 * @since 2.0.0
 */
const empty = () => [];
exports.empty = empty;
/**
 * Constructs a new `NonEmptyArray<A>` from the specified value.
 *
 * @category constructors
 * @since 2.0.0
 */
const of = a => [a];
exports.of = of;
/**
 * @category mapping
 * @since 2.0.0
 */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.map(f));
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  if ((0, exports.isEmptyReadonlyArray)(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    out.push(...f(self[i], i));
  }
  return out;
});
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatMapNonEmpty = exports.flatMap;
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flatten = /*#__PURE__*/(0, exports.flatMap)(Function_js_1.identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flattenNonEmpty = /*#__PURE__*/(0, exports.flatMapNonEmpty)(Function_js_1.identity);
/**
 * @category filtering
 * @since 2.0.0
 */
exports.filterMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const as = (0, exports.fromIterable)(self);
  const out = [];
  for (let i = 0; i < as.length; i++) {
    const o = f(as[i], i);
    if (O.isSome(o)) {
      out.push(o.value);
    }
  }
  return out;
});
/**
 * Transforms all elements of the `readonlyArray` for as long as the specified function returns some value
 *
 * @category filtering
 * @since 2.0.0
 */
exports.filterMapWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const out = [];
  for (const a of self) {
    const b = f(a);
    if (O.isSome(b)) {
      out.push(b.value);
    } else {
      break;
    }
  }
  return out;
});
/**
 * @category filtering
 * @since 2.0.0
 */
exports.partitionMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const left = [];
  const right = [];
  const as = (0, exports.fromIterable)(self);
  for (let i = 0; i < as.length; i++) {
    const e = f(as[i], i);
    if (E.isLeft(e)) {
      left.push(e.left);
    } else {
      right.push(e.right);
    }
  }
  return [left, right];
});
/**
 * @category filtering
 * @since 2.0.0
 */
exports.compact = /*#__PURE__*/(0, exports.filterMap)(Function_js_1.identity);
/**
 * @category filtering
 * @since 2.0.0
 */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const as = (0, exports.fromIterable)(self);
  const out = [];
  for (let i = 0; i < as.length; i++) {
    if (predicate(as[i], i)) {
      out.push(as[i]);
    }
  }
  return out;
});
/**
 * @category filtering
 * @since 2.0.0
 */
exports.partition = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const left = [];
  const right = [];
  const as = (0, exports.fromIterable)(self);
  for (let i = 0; i < as.length; i++) {
    if (predicate(as[i], i)) {
      right.push(as[i]);
    } else {
      left.push(as[i]);
    }
  }
  return [left, right];
});
/**
 * @category filtering
 * @since 2.0.0
 */
exports.separate = /*#__PURE__*/(0, exports.partitionMap)(Function_js_1.identity);
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, b, f) => (0, exports.fromIterable)(self).reduce((b, a, i) => f(b, a, i), b));
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduceRight = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, b, f) => (0, exports.fromIterable)(self).reduceRight((b, a, i) => f(b, a, i), b));
/**
 * @category lifting
 * @since 2.0.0
 */
const liftPredicate = predicate => b => predicate(b) ? [b] : [];
exports.liftPredicate = liftPredicate;
/**
 * @category lifting
 * @since 2.0.0
 */
const liftOption = f => (...a) => (0, exports.fromOption)(f(...a));
exports.liftOption = liftOption;
/**
 * @category conversions
 * @since 2.0.0
 */
const fromNullable = a => a == null ? (0, exports.empty)() : [a];
exports.fromNullable = fromNullable;
/**
 * @category lifting
 * @since 2.0.0
 */
const liftNullable = f => (...a) => (0, exports.fromNullable)(f(...a));
exports.liftNullable = liftNullable;
/**
 * @category combining
 * @since 2.0.0
 */
exports.flatMapNullable = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.isNonEmptyReadonlyArray)(self) ? (0, exports.fromNullable)(f((0, exports.headNonEmpty)(self))) : (0, exports.empty)());
/**
 * @category lifting
 * @since 2.0.0
 */
const liftEither = f => (...a) => {
  const e = f(...a);
  return E.isLeft(e) ? [] : [e.right];
};
exports.liftEither = liftEither;
/**
 * Check if a predicate holds true for every `ReadonlyArray` element.
 *
 * @category elements
 * @since 2.0.0
 */
exports.every = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, refinement) => self.every(refinement));
/**
 * Check if a predicate holds true for some `ReadonlyArray` element.
 *
 * @category elements
 * @since 2.0.0
 */
exports.some = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => self.some(predicate));
/**
 * @since 2.0.0
 */
exports.extend = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.map((_, i, as) => f(as.slice(i))));
/**
 * @since 2.0.0
 */
exports.min = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, O) => self.reduce(Order.min(O)));
/**
 * @since 2.0.0
 */
exports.max = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, O) => self.reduce(Order.max(O)));
/**
 * @category constructors
 * @since 2.0.0
 */
const unfold = (b, f) => {
  const out = [];
  let next = b;
  let o;
  while (O.isSome(o = f(next))) {
    const [a, b] = o.value;
    out.push(a);
    next = b;
  }
  return out;
};
exports.unfold = unfold;
/**
 * This function creates and returns a new `Order` for an array of values based on a given `Order` for the elements of the array.
 * The returned `Order` compares two arrays by applying the given `Order` to each element in the arrays.
 * If all elements are equal, the arrays are then compared based on their length.
 * It is useful when you need to compare two arrays of the same type and you have a specific way of comparing each element of the array.
 *
 * @category instances
 * @since 2.0.0
 */
exports.getOrder = Order.array;
/**
 * @category instances
 * @since 2.0.0
 */
exports.getEquivalence = Equivalence.array;
/**
 * Iterate over the `Iterable` applying `f`.
 *
 * @since 2.0.0
 */
exports.forEach = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.fromIterable)(self).forEach((a, i) => f(a, i)));
/**
 * Remove duplicates from am `Iterable` using the provided `isEquivalent` function, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 */
exports.dedupeWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, isEquivalent) => {
  const input = (0, exports.fromIterable)(self);
  return (0, exports.isNonEmptyReadonlyArray)(input) ? (0, exports.dedupeNonEmptyWith)(isEquivalent)(input) : [];
});
/**
 * Remove duplicates from am `Iterable`, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 */
exports.dedupe = /*#__PURE__*/(0, exports.dedupeWith)( /*#__PURE__*/Equal.equivalence());
/**
 * Deduplicates adjacent elements that are identical using the provided `isEquivalent` function.
 *
 * @since 2.0.0
 */
exports.dedupeAdjacentWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, isEquivalent) => {
  const out = [];
  let lastA = O.none();
  for (const a of self) {
    if (O.isNone(lastA) || !isEquivalent(a, lastA.value)) {
      out.push(a);
      lastA = O.some(a);
    }
  }
  return out;
});
/**
 * Deduplicates adjacent elements that are identical.
 *
 * @since 2.0.0
 */
exports.dedupeAdjacent = /*#__PURE__*/(0, exports.dedupeAdjacentWith)( /*#__PURE__*/Equal.equivalence());
/**
 * Joins the elements together with "sep" in the middle.
 *
 * @since 2.0.0
 * @category folding
 */
exports.join = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, sep) => (0, exports.fromIterable)(self).join(sep));
/**
 * Statefully maps over the chunk, producing new elements of type `B`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.mapAccum = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => {
  let s1 = s;
  const out = [];
  for (const a of self) {
    const r = f(s1, a);
    s1 = r[0];
    out.push(r[1]);
  }
  return [s1, out];
});
/**
 * Zips this chunk crosswise with the specified chunk using the specified combiner.
 *
 * @since 2.0.0
 * @category elements
 */
exports.cartesianWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.flatMap)(self, a => (0, exports.map)(that, b => f(a, b))));
/**
 * Zips this chunk crosswise with the specified chunk.
 *
 * @since 2.0.0
 * @category elements
 */
exports.cartesian = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.cartesianWith)(self, that, (a, b) => [a, b]));
//# sourceMappingURL=ReadonlyArray.js.map