/**
 * This module provides utility functions for working with arrays in TypeScript.
 *
 * @since 2.0.0
 */
import * as E from "./Either.js";
import * as Equal from "./Equal.js";
import * as Equivalence from "./Equivalence.js";
import { dual, identity } from "./Function.js";
import * as readonlyArray from "./internal/readonlyArray.js";
import * as O from "./Option.js";
import * as Order from "./Order.js";
import * as RR from "./ReadonlyRecord.js";
/**
 * Builds a `NonEmptyArray` from an non-empty collection of elements.
 *
 * @category constructors
 * @since 2.0.0
 */
export const make = (...elements) => elements;
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
export const makeBy = (n, f) => {
  const max = Math.max(1, Math.floor(n));
  const out = [f(0)];
  for (let i = 1; i < max; i++) {
    out.push(f(i));
  }
  return out;
};
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
export const range = (start, end) => start <= end ? makeBy(end - start + 1, i => start + i) : [start];
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
export const replicate = /*#__PURE__*/dual(2, (a, n) => makeBy(n, () => a));
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromIterable = collection => Array.isArray(collection) ? collection : Array.from(collection);
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
export const fromRecord = RR.toEntries;
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromOption = O.toArray;
/**
 * @category pattern matching
 * @since 2.0.0
 */
export const match = /*#__PURE__*/dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(self) : onEmpty());
/**
 * @category pattern matching
 * @since 2.0.0
 */
export const matchLeft = /*#__PURE__*/dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self)) : onEmpty());
/**
 * @category pattern matching
 * @since 2.0.0
 */
export const matchRight = /*#__PURE__*/dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(initNonEmpty(self), lastNonEmpty(self)) : onEmpty());
/**
 * Prepend an element to the front of an `Iterable`, creating a new `NonEmptyArray`.
 *
 * @category concatenating
 * @since 2.0.0
 */
export const prepend = /*#__PURE__*/dual(2, (self, head) => [head, ...self]);
/**
 * @category concatenating
 * @since 2.0.0
 */
export const prependAll = /*#__PURE__*/dual(2, (self, that) => fromIterable(that).concat(fromIterable(self)));
/**
 * @category concatenating
 * @since 2.0.0
 */
export const prependAllNonEmpty = /*#__PURE__*/dual(2, (self, that) => prependAll(self, that));
/**
 * Append an element to the end of an `Iterable`, creating a new `NonEmptyArray`.
 *
 * @category concatenating
 * @since 2.0.0
 */
export const append = /*#__PURE__*/dual(2, (self, last) => [...self, last]);
/**
 * @category concatenating
 * @since 2.0.0
 */
export const appendAll = /*#__PURE__*/dual(2, (self, that) => fromIterable(self).concat(fromIterable(that)));
/**
 * @category concatenating
 * @since 2.0.0
 */
export const appendAllNonEmpty = /*#__PURE__*/dual(2, (self, that) => appendAll(self, that));
/**
 * Reduce an `Iterable` from the left, keeping all intermediate results instead of only the final result.
 *
 * @category folding
 * @since 2.0.0
 */
export const scan = /*#__PURE__*/dual(3, (self, b, f) => {
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
export const scanRight = /*#__PURE__*/dual(3, (self, b, f) => {
  const input = fromIterable(self);
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
export const isEmptyArray = self => self.length === 0;
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
export const isEmptyReadonlyArray = isEmptyArray;
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
export const isNonEmptyArray = readonlyArray.isNonEmptyArray;
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
export const isNonEmptyReadonlyArray = readonlyArray.isNonEmptyArray;
/**
 * Return the number of elements in a `ReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
export const length = self => self.length;
const isOutOfBound = (i, as) => i < 0 || i >= as.length;
const clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length));
/**
 * This function provides a safe way to read a value at a particular index from a `ReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
export const get = /*#__PURE__*/dual(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBound(i, self) ? O.none() : O.some(self[i]);
});
/**
 * Gets an element unsafely, will throw on out of bounds.
 *
 * @since 2.0.0
 * @category unsafe
 */
export const unsafeGet = /*#__PURE__*/dual(2, (self, index) => {
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
export const unprepend = self => [headNonEmpty(self), tailNonEmpty(self)];
/**
 * Return a tuple containing a copy of the `NonEmptyReadonlyArray` without its last element, and that last element.
 *
 * @category getters
 * @since 2.0.0
 */
export const unappend = self => [initNonEmpty(self), lastNonEmpty(self)];
/**
 * Get the first element of a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
export const head = /*#__PURE__*/get(0);
/**
 * @category getters
 * @since 2.0.0
 */
export const headNonEmpty = /*#__PURE__*/unsafeGet(0);
/**
 * Get the last element in a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
export const last = self => isNonEmptyReadonlyArray(self) ? O.some(lastNonEmpty(self)) : O.none();
/**
 * @category getters
 * @since 2.0.0
 */
export const lastNonEmpty = self => self[self.length - 1];
/**
 * Get all but the first element of an `Iterable`, creating a new `Array`, or `None` if the `Iterable` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
export const tail = self => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? O.some(tailNonEmpty(input)) : O.none();
};
/**
 * @category getters
 * @since 2.0.0
 */
export const tailNonEmpty = self => self.slice(1);
/**
 * Get all but the last element of an `Iterable`, creating a new `Array`, or `None` if the `Iterable` is empty.
 *
 * @category getters
 * @since 2.0.0
 */
export const init = self => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? O.some(initNonEmpty(input)) : O.none();
};
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @category getters
 * @since 2.0.0
 */
export const initNonEmpty = self => self.slice(0, -1);
/**
 * Keep only a max number of elements from the start of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
export const take = /*#__PURE__*/dual(2, (self, n) => {
  const input = fromIterable(self);
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
export const takeRight = /*#__PURE__*/dual(2, (self, n) => {
  const input = fromIterable(self);
  const i = clamp(n, input);
  return i === 0 ? [] : input.slice(-i);
});
/**
 * Calculate the longest initial subarray for which all element satisfy the specified predicate, creating a new `Array`.
 *
 * @category getters
 * @since 2.0.0
 */
export const takeWhile = /*#__PURE__*/dual(2, (self, predicate) => {
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
export const span = /*#__PURE__*/dual(2, (self, predicate) => splitAt(self, spanIndex(self, predicate)));
/**
 * Drop a max number of elements from the start of an `Iterable`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 2.0.0
 */
export const drop = /*#__PURE__*/dual(2, (self, n) => {
  const input = fromIterable(self);
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
export const dropRight = /*#__PURE__*/dual(2, (self, n) => {
  const input = fromIterable(self);
  return input.slice(0, input.length - clamp(n, input));
});
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new `Array`.
 *
 * @category getters
 * @since 2.0.0
 */
export const dropWhile = /*#__PURE__*/dual(2, (self, predicate) => fromIterable(self).slice(spanIndex(self, predicate)));
/**
 * Return the first index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
export const findFirstIndex = /*#__PURE__*/dual(2, (self, predicate) => {
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
export const findLastIndex = /*#__PURE__*/dual(2, (self, predicate) => {
  const input = fromIterable(self);
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
export const findFirst = /*#__PURE__*/dual(2, (self, predicate) => {
  const input = fromIterable(self);
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
export const findLast = /*#__PURE__*/dual(2, (self, predicate) => {
  const input = fromIterable(self);
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
export const insertAt = /*#__PURE__*/dual(3, (self, i, b) => {
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
export const replace = /*#__PURE__*/dual(3, (self, i, b) => modify(self, i, () => b));
/**
 * @since 2.0.0
 */
export const replaceOption = /*#__PURE__*/dual(3, (self, i, b) => modifyOption(self, i, () => b));
/**
 * Apply a function to the element at the specified index, creating a new `Array`,
 * or return a copy of the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
export const modify = /*#__PURE__*/dual(3, (self, i, f) => O.getOrElse(modifyOption(self, i, f), () => Array.from(self)));
/**
 * Apply a function to the element at the specified index, creating a new `Array`,
 * or return `None` if the index is out of bounds.
 *
 * @since 2.0.0
 */
export const modifyOption = /*#__PURE__*/dual(3, (self, i, f) => {
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
export const remove = /*#__PURE__*/dual(2, (self, i) => {
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
export const reverse = self => Array.from(self).reverse();
/**
 * @category elements
 * @since 2.0.0
 */
export const reverseNonEmpty = self => [lastNonEmpty(self), ...self.slice(0, -1).reverse()];
/**
 * Sort the elements of an `Iterable` in increasing order, creating a new `Array`.
 *
 * @category sorting
 * @since 2.0.0
 */
export const sort = /*#__PURE__*/dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
/**
 * @since 2.0.0
 * @category elements
 */
export const sortWith = /*#__PURE__*/dual(3, (self, f, order) => sort(self, Order.mapInput(order, f)));
/**
 * Sort the elements of a `NonEmptyReadonlyArray` in increasing order, creating a new `NonEmptyArray`.
 *
 * @category sorting
 * @since 2.0.0
 */
export const sortNonEmpty = /*#__PURE__*/dual(2, (self, O) => sort(O)(self));
/**
 * Sort the elements of an `Iterable` in increasing order, where elements are compared
 * using first `orders[0]`, then `orders[1]`, etc...
 *
 * @category sorting
 * @since 2.0.0
 */
export const sortBy = (...orders) => self => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? sortByNonEmpty(...orders)(input) : [];
};
/**
 * @category sorting
 * @since 2.0.0
 */
export const sortByNonEmpty = (...orders) => sortNonEmpty(Order.combineAll(orders));
/**
 * Takes two `Iterable`s and returns an `Array` of corresponding pairs.
 * If one input `Iterable` is short, excess elements of the
 * longer `Iterable` are discarded.
 *
 * @since 2.0.0
 */
export const zip = /*#__PURE__*/dual(2, (self, that) => zipWith(self, that, (a, b) => [a, b]));
/**
 * Apply a function to pairs of elements at the same index in two `Iterable`s, collecting the results in a new `Array`. If one
 * input `Iterable` is short, excess elements of the longer `Iterable` are discarded.
 *
 * @since 2.0.0
 */
export const zipWith = /*#__PURE__*/dual(3, (self, that, f) => {
  const as = fromIterable(self);
  const bs = fromIterable(that);
  return isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs) ? zipNonEmptyWith(bs, f)(as) : [];
});
/**
 * @since 2.0.0
 */
export const zipNonEmpty = /*#__PURE__*/dual(2, (self, that) => zipNonEmptyWith(self, that, (a, b) => [a, b]));
/**
 * @since 2.0.0
 */
export const zipNonEmptyWith = /*#__PURE__*/dual(3, (self, that, f) => {
  const cs = [f(headNonEmpty(self), headNonEmpty(that))];
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
export const unzip = self => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? unzipNonEmpty(input) : [[], []];
};
/**
 * @since 2.0.0
 */
export const unzipNonEmpty = self => {
  const fa = [self[0][0]];
  const fb = [self[0][1]];
  for (let i = 1; i < self.length; i++) {
    fa[i] = self[i][0];
    fb[i] = self[i][1];
  }
  return [fa, fb];
};
/**
 * Places an element in between members of an `Iterable`
 *
 * @since 2.0.0
 */
export const intersperse = /*#__PURE__*/dual(2, (self, middle) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? intersperseNonEmpty(input, middle) : [];
});
/**
 * Places an element in between members of a `NonEmptyReadonlyArray`
 *
 * @since 2.0.0
 */
export const intersperseNonEmpty = /*#__PURE__*/dual(2, (self, middle) => {
  const out = [headNonEmpty(self)];
  const tail = tailNonEmpty(self);
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
export const modifyNonEmptyHead = /*#__PURE__*/dual(2, (self, f) => [f(headNonEmpty(self)), ...tailNonEmpty(self)]);
/**
 * Change the head, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export const setNonEmptyHead = /*#__PURE__*/dual(2, (self, b) => modifyNonEmptyHead(self, () => b));
/**
 * Apply a function to the last element, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export const modifyNonEmptyLast = /*#__PURE__*/dual(2, (self, f) => append(initNonEmpty(self), f(lastNonEmpty(self))));
/**
 * Change the last element, creating a new `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export const setNonEmptyLast = /*#__PURE__*/dual(2, (self, b) => modifyNonEmptyLast(self, () => b));
/**
 * Rotate an `Iterable` by `n` steps.
 *
 * @since 2.0.0
 */
export const rotate = /*#__PURE__*/dual(2, (self, n) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? rotateNonEmpty(input, n) : [];
});
/**
 * Rotate a `NonEmptyReadonlyArray` by `n` steps.
 *
 * @since 2.0.0
 */
export const rotateNonEmpty = /*#__PURE__*/dual(2, (self, n) => {
  const len = self.length;
  const m = Math.round(n) % len;
  if (isOutOfBound(Math.abs(m), self) || m === 0) {
    return copy(self);
  }
  if (m < 0) {
    const [f, s] = splitNonEmptyAt(self, -m);
    return appendAllNonEmpty(s, f);
  } else {
    return rotateNonEmpty(self, m - len);
  }
});
/**
 * Returns a function that checks if a `ReadonlyArray` contains a given value using a provided `isEquivalent` function.
 *
 * @category elements
 * @since 2.0.0
 */
export const containsWith = isEquivalent => dual(2, (self, a) => {
  for (const i of self) {
    if (isEquivalent(a, i)) {
      return true;
    }
  }
  return false;
});
const _equivalence = /*#__PURE__*/Equal.equivalence();
/**
 * Returns a function that checks if a `ReadonlyArray` contains a given value using the default `Equivalence`.
 *
 * @category elements
 * @since 2.0.0
 */
export const contains = /*#__PURE__*/containsWith(_equivalence);
/**
 * Remove duplicates from a `NonEmptyReadonlyArray`, keeping the first occurrence of an element using the provided `isEquivalent` function.
 *
 * @since 2.0.0
 */
export const dedupeNonEmptyWith = /*#__PURE__*/dual(2, (self, isEquivalent) => {
  const out = [headNonEmpty(self)];
  const rest = tailNonEmpty(self);
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
export const dedupeNonEmpty = /*#__PURE__*/dedupeNonEmptyWith( /*#__PURE__*/Equal.equivalence());
/**
 * A useful recursion pattern for processing an `Iterable` to produce a new `Array`, often used for "chopping" up the input
 * `Iterable`. Typically chop is called with some function that will consume an initial prefix of the `Iterable` and produce a
 * value and the rest of the `Array`.
 *
 * @since 2.0.0
 */
export const chop = /*#__PURE__*/dual(2, (self, f) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? chopNonEmpty(input, f) : [];
});
/**
 * A useful recursion pattern for processing a `NonEmptyReadonlyArray` to produce a new `NonEmptyReadonlyArray`, often used for "chopping" up the input
 * `NonEmptyReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `NonEmptyReadonlyArray` and produce a
 * value and the tail of the `NonEmptyReadonlyArray`.
 *
 * @since 2.0.0
 */
export const chopNonEmpty = /*#__PURE__*/dual(2, (self, f) => {
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
export const splitAt = /*#__PURE__*/dual(2, (self, n) => {
  const input = Array.from(self);
  return n >= 1 && isNonEmptyReadonlyArray(input) ? splitNonEmptyAt(input, n) : isEmptyReadonlyArray(input) ? [input, []] : [[], input];
});
/**
 * @since 2.0.0
 */
export const copy = self => self.slice();
/**
 * Splits a `NonEmptyReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category getters
 * @since 2.0.0
 */
export const splitNonEmptyAt = /*#__PURE__*/dual(2, (self, n) => {
  const m = Math.max(1, n);
  return m >= self.length ? [copy(self), []] : [prepend(self.slice(1, m), headNonEmpty(self)), self.slice(m)];
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
export const chunksOf = /*#__PURE__*/dual(2, (self, n) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? chunksOfNonEmpty(input, n) : [];
});
/**
 * Splits a `NonEmptyReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `NonEmptyReadonlyArray`.
 *
 * @category getters
 * @since 2.0.0
 */
export const chunksOfNonEmpty = /*#__PURE__*/dual(2, (self, n) => chopNonEmpty(self, splitNonEmptyAt(n)));
/**
 * Group equal, consecutive elements of a `NonEmptyReadonlyArray` into `NonEmptyArray`s using the provided `isEquivalent` function.
 *
 * @category grouping
 * @since 2.0.0
 */
export const groupWith = /*#__PURE__*/dual(2, (self, isEquivalent) => chopNonEmpty(self, as => {
  const h = headNonEmpty(as);
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
export const group = /*#__PURE__*/groupWith( /*#__PURE__*/Equal.equivalence());
/**
 * Splits an `Iterable` into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @category grouping
 * @since 2.0.0
 */
export const groupBy = /*#__PURE__*/dual(2, (self, f) => {
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
export const unionWith = isEquivalent => dual(2, (self, that) => {
  const a = fromIterable(self);
  const b = fromIterable(that);
  return isNonEmptyReadonlyArray(a) && isNonEmptyReadonlyArray(b) ? unionNonEmptyWith(isEquivalent)(a, b) : isNonEmptyReadonlyArray(a) ? a : b;
});
/**
 * @since 2.0.0
 */
export const union = /*#__PURE__*/unionWith(_equivalence);
/**
 * @since 2.0.0
 */
export const unionNonEmptyWith = isEquivalent => {
  const dedupe = dedupeNonEmptyWith(isEquivalent);
  return dual(2, (self, that) => dedupe(appendAllNonEmpty(self, that)));
};
/**
 * @since 2.0.0
 */
export const unionNonEmpty = /*#__PURE__*/unionNonEmptyWith(_equivalence);
/**
 * Creates an `Array` of unique values that are included in all given `Iterable`s using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
export const intersectionWith = isEquivalent => {
  const has = containsWith(isEquivalent);
  return dual(2, (self, that) => fromIterable(self).filter(a => has(that, a)));
};
/**
 * Creates an `Array` of unique values that are included in all given `Iterable`s.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
export const intersection = /*#__PURE__*/intersectionWith(_equivalence);
/**
 * Creates a `Array` of values not included in the other given `Iterable` using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
export const differenceWith = isEquivalent => {
  const has = containsWith(isEquivalent);
  return dual(2, (self, that) => fromIterable(self).filter(a => !has(that, a)));
};
/**
 * Creates a `Array` of values not included in the other given `Iterable` using the provided `isEquivalent` function.
 * The order and references of result values are determined by the first `Iterable`.
 *
 * @since 2.0.0
 */
export const difference = /*#__PURE__*/differenceWith(_equivalence);
/**
 * @category constructors
 * @since 2.0.0
 */
export const empty = () => [];
/**
 * Constructs a new `NonEmptyArray<A>` from the specified value.
 *
 * @category constructors
 * @since 2.0.0
 */
export const of = a => [a];
/**
 * @category mapping
 * @since 2.0.0
 */
export const map = /*#__PURE__*/dual(2, (self, f) => self.map(f));
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatMap = /*#__PURE__*/dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
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
export const flatMapNonEmpty = flatMap;
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flatten = /*#__PURE__*/flatMap(identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
export const flattenNonEmpty = /*#__PURE__*/flatMapNonEmpty(identity);
/**
 * @category filtering
 * @since 2.0.0
 */
export const filterMap = /*#__PURE__*/dual(2, (self, f) => {
  const as = fromIterable(self);
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
export const filterMapWhile = /*#__PURE__*/dual(2, (self, f) => {
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
export const partitionMap = /*#__PURE__*/dual(2, (self, f) => {
  const left = [];
  const right = [];
  const as = fromIterable(self);
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
export const compact = /*#__PURE__*/filterMap(identity);
/**
 * @category filtering
 * @since 2.0.0
 */
export const filter = /*#__PURE__*/dual(2, (self, predicate) => {
  const as = fromIterable(self);
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
export const partition = /*#__PURE__*/dual(2, (self, predicate) => {
  const left = [];
  const right = [];
  const as = fromIterable(self);
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
export const separate = /*#__PURE__*/partitionMap(identity);
/**
 * @category folding
 * @since 2.0.0
 */
export const reduce = /*#__PURE__*/dual(3, (self, b, f) => fromIterable(self).reduce((b, a, i) => f(b, a, i), b));
/**
 * @category folding
 * @since 2.0.0
 */
export const reduceRight = /*#__PURE__*/dual(3, (self, b, f) => fromIterable(self).reduceRight((b, a, i) => f(b, a, i), b));
/**
 * @category lifting
 * @since 2.0.0
 */
export const liftPredicate = predicate => b => predicate(b) ? [b] : [];
/**
 * @category lifting
 * @since 2.0.0
 */
export const liftOption = f => (...a) => fromOption(f(...a));
/**
 * @category conversions
 * @since 2.0.0
 */
export const fromNullable = a => a == null ? empty() : [a];
/**
 * @category lifting
 * @since 2.0.0
 */
export const liftNullable = f => (...a) => fromNullable(f(...a));
/**
 * @category combining
 * @since 2.0.0
 */
export const flatMapNullable = /*#__PURE__*/dual(2, (self, f) => isNonEmptyReadonlyArray(self) ? fromNullable(f(headNonEmpty(self))) : empty());
/**
 * @category lifting
 * @since 2.0.0
 */
export const liftEither = f => (...a) => {
  const e = f(...a);
  return E.isLeft(e) ? [] : [e.right];
};
/**
 * Check if a predicate holds true for every `ReadonlyArray` element.
 *
 * @category elements
 * @since 2.0.0
 */
export const every = /*#__PURE__*/dual(2, (self, refinement) => self.every(refinement));
/**
 * Check if a predicate holds true for some `ReadonlyArray` element.
 *
 * @category elements
 * @since 2.0.0
 */
export const some = /*#__PURE__*/dual(2, (self, predicate) => self.some(predicate));
/**
 * @since 2.0.0
 */
export const extend = /*#__PURE__*/dual(2, (self, f) => self.map((_, i, as) => f(as.slice(i))));
/**
 * @since 2.0.0
 */
export const min = /*#__PURE__*/dual(2, (self, O) => self.reduce(Order.min(O)));
/**
 * @since 2.0.0
 */
export const max = /*#__PURE__*/dual(2, (self, O) => self.reduce(Order.max(O)));
/**
 * @category constructors
 * @since 2.0.0
 */
export const unfold = (b, f) => {
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
/**
 * This function creates and returns a new `Order` for an array of values based on a given `Order` for the elements of the array.
 * The returned `Order` compares two arrays by applying the given `Order` to each element in the arrays.
 * If all elements are equal, the arrays are then compared based on their length.
 * It is useful when you need to compare two arrays of the same type and you have a specific way of comparing each element of the array.
 *
 * @category instances
 * @since 2.0.0
 */
export const getOrder = Order.array;
/**
 * @category instances
 * @since 2.0.0
 */
export const getEquivalence = Equivalence.array;
/**
 * Iterate over the `Iterable` applying `f`.
 *
 * @since 2.0.0
 */
export const forEach = /*#__PURE__*/dual(2, (self, f) => fromIterable(self).forEach((a, i) => f(a, i)));
/**
 * Remove duplicates from am `Iterable` using the provided `isEquivalent` function, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 */
export const dedupeWith = /*#__PURE__*/dual(2, (self, isEquivalent) => {
  const input = fromIterable(self);
  return isNonEmptyReadonlyArray(input) ? dedupeNonEmptyWith(isEquivalent)(input) : [];
});
/**
 * Remove duplicates from am `Iterable`, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 */
export const dedupe = /*#__PURE__*/dedupeWith( /*#__PURE__*/Equal.equivalence());
/**
 * Deduplicates adjacent elements that are identical using the provided `isEquivalent` function.
 *
 * @since 2.0.0
 */
export const dedupeAdjacentWith = /*#__PURE__*/dual(2, (self, isEquivalent) => {
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
export const dedupeAdjacent = /*#__PURE__*/dedupeAdjacentWith( /*#__PURE__*/Equal.equivalence());
/**
 * Joins the elements together with "sep" in the middle.
 *
 * @since 2.0.0
 * @category folding
 */
export const join = /*#__PURE__*/dual(2, (self, sep) => fromIterable(self).join(sep));
/**
 * Statefully maps over the chunk, producing new elements of type `B`.
 *
 * @since 2.0.0
 * @category folding
 */
export const mapAccum = /*#__PURE__*/dual(3, (self, s, f) => {
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
export const cartesianWith = /*#__PURE__*/dual(3, (self, that, f) => flatMap(self, a => map(that, b => f(a, b))));
/**
 * Zips this chunk crosswise with the specified chunk.
 *
 * @since 2.0.0
 * @category elements
 */
export const cartesian = /*#__PURE__*/dual(2, (self, that) => cartesianWith(self, that, (a, b) => [a, b]));
//# sourceMappingURL=ReadonlyArray.js.map