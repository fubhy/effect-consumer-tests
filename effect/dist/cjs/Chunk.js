"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.split = exports.splitAt = exports.sortWith = exports.sort = exports.size = exports.separate = exports.partitionMap = exports.partition = exports.mapAccum = exports.map = exports.unsafeLast = exports.last = exports.headNonEmpty = exports.unsafeHead = exports.head = exports.isNonEmpty = exports.isEmpty = exports.intersection = exports.chunksOf = exports.flattenNonEmpty = exports.flatten = exports.forEach = exports.flatMapNonEmpty = exports.flatMap = exports.compact = exports.filterMapWhile = exports.filter = exports.filterMap = exports.appendAllNonEmpty = exports.appendAll = exports.prependAllNonEmpty = exports.prependAll = exports.dropWhile = exports.dropRight = exports.drop = exports.take = exports.prepend = exports.append = exports.unsafeGet = exports.unsafeFromNonEmptyArray = exports.unsafeFromArray = exports.get = exports.reverse = exports.toReadonlyArray = exports.fromIterable = exports.of = exports.make = exports.empty = exports.isChunk = exports.getEquivalence = void 0;
exports.reduceRight = exports.reduce = exports.join = exports.some = exports.every = exports.findLastIndex = exports.findLast = exports.findFirstIndex = exports.findFirst = exports.containsWith = exports.contains = exports.range = exports.makeBy = exports.replaceOption = exports.replace = exports.modify = exports.modifyOption = exports.remove = exports.zip = exports.zipWith = exports.unzip = exports.dedupeAdjacent = exports.dedupe = exports.union = exports.takeWhile = exports.takeRight = exports.tailNonEmpty = exports.tail = exports.splitWhere = void 0;
const Equal = /*#__PURE__*/require("./Equal.js");
const Equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const Hash = /*#__PURE__*/require("./Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const O = /*#__PURE__*/require("./Option.js");
const Order = /*#__PURE__*/require("./Order.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("./Predicate.js");
const RA = /*#__PURE__*/require("./ReadonlyArray.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/Chunk");
function copy(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
const emptyArray = [];
/**
 * Compares the two chunks of equal length using the specified function
 *
 * @category equivalence
 * @since 2.0.0
 */
const getEquivalence = isEquivalent => Equivalence.make((self, that) => self.length === that.length && (0, exports.toReadonlyArray)(self).every((value, i) => isEquivalent(value, (0, exports.unsafeGet)(that, i))));
exports.getEquivalence = getEquivalence;
const _equivalence = /*#__PURE__*/(0, exports.getEquivalence)(Equal.equals);
const ChunkProto = {
  [TypeId]: {
    _A: _ => _
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: (0, exports.toReadonlyArray)(this).map(Inspectable_js_1.toJSON)
    };
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  [Equal.symbol](that) {
    return (0, exports.isChunk)(that) && _equivalence(this, that);
  },
  [Hash.symbol]() {
    return Hash.array((0, exports.toReadonlyArray)(this));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray":
        {
          return this.backing.array[Symbol.iterator]();
        }
      case "IEmpty":
        {
          return emptyArray[Symbol.iterator]();
        }
      default:
        {
          return (0, exports.toReadonlyArray)(this)[Symbol.iterator]();
        }
    }
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
const makeChunk = backing => {
  const chunk = Object.create(ChunkProto);
  chunk.backing = backing;
  switch (backing._tag) {
    case "IEmpty":
      {
        chunk.length = 0;
        chunk.depth = 0;
        chunk.left = chunk;
        chunk.right = chunk;
        break;
      }
    case "IConcat":
      {
        chunk.length = backing.left.length + backing.right.length;
        chunk.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
        chunk.left = backing.left;
        chunk.right = backing.right;
        break;
      }
    case "IArray":
      {
        chunk.length = backing.array.length;
        chunk.depth = 0;
        chunk.left = _empty;
        chunk.right = _empty;
        break;
      }
    case "ISingleton":
      {
        chunk.length = 1;
        chunk.depth = 0;
        chunk.left = _empty;
        chunk.right = _empty;
        break;
      }
    case "ISlice":
      {
        chunk.length = backing.length;
        chunk.depth = backing.chunk.depth + 1;
        chunk.left = _empty;
        chunk.right = _empty;
        break;
      }
  }
  return chunk;
};
/**
 * Checks if `u` is a `Chunk<unknown>`
 *
 * @category constructors
 * @since 2.0.0
 */
const isChunk = u => (0, Predicate_js_1.hasProperty)(u, TypeId);
exports.isChunk = isChunk;
const _empty = /*#__PURE__*/makeChunk({
  _tag: "IEmpty"
});
/**
 * @category constructors
 * @since 2.0.0
 */
const empty = () => _empty;
exports.empty = empty;
/**
 * Builds a `NonEmptyChunk` from an non-empty collection of elements.
 *
 * @category constructors
 * @since 2.0.0
 */
const make = (...as) => as.length === 1 ? (0, exports.of)(as[0]) : (0, exports.unsafeFromNonEmptyArray)(as);
exports.make = make;
/**
 * Builds a `NonEmptyChunk` from a single element.
 *
 * @category constructors
 * @since 2.0.0
 */
const of = a => makeChunk({
  _tag: "ISingleton",
  a
});
exports.of = of;
/**
 * Converts from an `Iterable<A>`
 *
 * @category conversions
 * @since 2.0.0
 */
const fromIterable = self => (0, exports.isChunk)(self) ? self : makeChunk({
  _tag: "IArray",
  array: RA.fromIterable(self)
});
exports.fromIterable = fromIterable;
const copyToArray = (self, array, initial) => {
  switch (self.backing._tag) {
    case "IArray":
      {
        copy(self.backing.array, 0, array, initial, self.length);
        break;
      }
    case "IConcat":
      {
        copyToArray(self.left, array, initial);
        copyToArray(self.right, array, initial + self.left.length);
        break;
      }
    case "ISingleton":
      {
        array[initial] = self.backing.a;
        break;
      }
    case "ISlice":
      {
        let i = 0;
        let j = initial;
        while (i < self.length) {
          array[j] = (0, exports.unsafeGet)(self, i);
          i += 1;
          j += 1;
        }
        break;
      }
  }
};
/**
 * Converts the specified `Chunk` to a `ReadonlyArray`.
 *
 * @category conversions
 * @since 2.0.0
 */
const toReadonlyArray = self => {
  switch (self.backing._tag) {
    case "IEmpty":
      {
        return emptyArray;
      }
    case "IArray":
      {
        return self.backing.array;
      }
    default:
      {
        const arr = new Array(self.length);
        copyToArray(self, arr, 0);
        self.backing = {
          _tag: "IArray",
          array: arr
        };
        self.left = _empty;
        self.right = _empty;
        self.depth = 0;
        return arr;
      }
  }
};
exports.toReadonlyArray = toReadonlyArray;
/**
 * @since 2.0.0
 * @category elements
 */
const reverse = self => {
  switch (self.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self;
    case "IArray":
      {
        return makeChunk({
          _tag: "IArray",
          array: RA.reverse(self.backing.array)
        });
      }
    case "IConcat":
      {
        return makeChunk({
          _tag: "IConcat",
          left: (0, exports.reverse)(self.backing.right),
          right: (0, exports.reverse)(self.backing.left)
        });
      }
    case "ISlice":
      return (0, exports.unsafeFromArray)(RA.reverse((0, exports.toReadonlyArray)(self)));
  }
};
exports.reverse = reverse;
/**
 * This function provides a safe way to read a value at a particular index from a `Chunk`.
 *
 * @category elements
 * @since 2.0.0
 */
exports.get = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => index < 0 || index >= self.length ? O.none() : O.some((0, exports.unsafeGet)(self, index)));
/**
 * Wraps an array into a chunk without copying, unsafe on mutable arrays
 *
 * @since 2.0.0
 * @category unsafe
 */
const unsafeFromArray = self => makeChunk({
  _tag: "IArray",
  array: self
});
exports.unsafeFromArray = unsafeFromArray;
/**
 * Wraps an array into a chunk without copying, unsafe on mutable arrays
 *
 * @since 2.0.0
 * @category unsafe
 */
const unsafeFromNonEmptyArray = self => (0, exports.unsafeFromArray)(self);
exports.unsafeFromNonEmptyArray = unsafeFromNonEmptyArray;
/**
 * Gets an element unsafely, will throw on out of bounds
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => {
  switch (self.backing._tag) {
    case "IEmpty":
      {
        throw new Error(`Index out of bounds`);
      }
    case "ISingleton":
      {
        if (index !== 0) {
          throw new Error(`Index out of bounds`);
        }
        return self.backing.a;
      }
    case "IArray":
      {
        if (index >= self.length || index < 0) {
          throw new Error(`Index out of bounds`);
        }
        return self.backing.array[index];
      }
    case "IConcat":
      {
        return index < self.left.length ? (0, exports.unsafeGet)(self.left, index) : (0, exports.unsafeGet)(self.right, index - self.left.length);
      }
    case "ISlice":
      {
        return (0, exports.unsafeGet)(self.backing.chunk, index + self.backing.offset);
      }
  }
});
/**
 * Appends the specified element to the end of the `Chunk`.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.append = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, a) => (0, exports.appendAllNonEmpty)(self, (0, exports.of)(a)));
/**
 * Prepend an element to the front of a `Chunk`, creating a new `NonEmptyChunk`.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.prepend = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, elem) => (0, exports.appendAllNonEmpty)((0, exports.of)(elem), self));
/**
 * Takes the first up to `n` elements from the chunk
 *
 * @since 2.0.0
 */
exports.take = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  if (n <= 0) {
    return _empty;
  } else if (n >= self.length) {
    return self;
  } else {
    switch (self.backing._tag) {
      case "ISlice":
        {
          return makeChunk({
            _tag: "ISlice",
            chunk: self.backing.chunk,
            length: n,
            offset: self.backing.offset
          });
        }
      case "IConcat":
        {
          if (n > self.left.length) {
            return makeChunk({
              _tag: "IConcat",
              left: self.left,
              right: (0, exports.take)(self.right, n - self.left.length)
            });
          }
          return (0, exports.take)(self.left, n);
        }
      default:
        {
          return makeChunk({
            _tag: "ISlice",
            chunk: self,
            offset: 0,
            length: n
          });
        }
    }
  }
});
/**
 * Drops the first up to `n` elements from the chunk
 *
 * @since 2.0.0
 */
exports.drop = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  if (n <= 0) {
    return self;
  } else if (n >= self.length) {
    return _empty;
  } else {
    switch (self.backing._tag) {
      case "ISlice":
        {
          return makeChunk({
            _tag: "ISlice",
            chunk: self.backing.chunk,
            offset: self.backing.offset + n,
            length: self.backing.length - n
          });
        }
      case "IConcat":
        {
          if (n > self.left.length) {
            return (0, exports.drop)(self.right, n - self.left.length);
          }
          return makeChunk({
            _tag: "IConcat",
            left: (0, exports.drop)(self.left, n),
            right: self.right
          });
        }
      default:
        {
          return makeChunk({
            _tag: "ISlice",
            chunk: self,
            offset: n,
            length: self.length - n
          });
        }
    }
  }
});
/**
 * Drops the last `n` elements.
 *
 * @since 2.0.0
 */
exports.dropRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.take)(self, Math.max(0, self.length - n)));
/**
 * Drops all elements so long as the predicate returns true.
 *
 * @since 2.0.0
 */
exports.dropWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const arr = (0, exports.toReadonlyArray)(self);
  const len = arr.length;
  let i = 0;
  while (i < len && f(arr[i])) {
    i++;
  }
  return (0, exports.drop)(self, i);
});
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.prependAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.appendAll)(that, self));
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.prependAllNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.prependAll)(self, that));
/**
 * Concatenates the two chunks
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.appendAll = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (self.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self;
  }
  const diff = that.depth - self.depth;
  if (Math.abs(diff) <= 1) {
    return makeChunk({
      _tag: "IConcat",
      left: self,
      right: that
    });
  } else if (diff < -1) {
    if (self.left.depth >= self.right.depth) {
      const nr = (0, exports.appendAll)(self.right, that);
      return makeChunk({
        _tag: "IConcat",
        left: self.left,
        right: nr
      });
    } else {
      const nrr = (0, exports.appendAll)(self.right.right, that);
      if (nrr.depth === self.depth - 3) {
        const nr = makeChunk({
          _tag: "IConcat",
          left: self.right.left,
          right: nrr
        });
        return makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: nr
        });
      } else {
        const nl = makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: self.right.left
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: nrr
        });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = (0, exports.appendAll)(self, that.left);
      return makeChunk({
        _tag: "IConcat",
        left: nl,
        right: that.right
      });
    } else {
      const nll = (0, exports.appendAll)(self, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk({
          _tag: "IConcat",
          left: nll,
          right: that.left.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: that.right
        });
      } else {
        const nr = makeChunk({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nll,
          right: nr
        });
      }
    }
  }
});
/**
 * @category concatenating
 * @since 2.0.0
 */
exports.appendAllNonEmpty = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.appendAll)(self, that));
/**
 * Returns a filtered and mapped subset of the elements.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.unsafeFromArray)(RA.filterMap(self, f)));
/**
 * Returns a filtered and mapped subset of the elements.
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.unsafeFromArray)(RA.filterMap(self, O.liftPredicate(predicate))));
/**
 * Transforms all elements of the chunk for as long as the specified function returns some value
 *
 * @since 2.0.0
 * @category filtering
 */
exports.filterMapWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.unsafeFromArray)(RA.filterMapWhile(self, f)));
/**
 * Filter out optional values
 *
 * @since 2.0.0
 * @category filtering
 */
const compact = self => (0, exports.filterMap)(self, Function_js_1.identity);
exports.compact = compact;
/**
 * Returns a chunk with the elements mapped by the specified function.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  if (self.backing._tag === "ISingleton") {
    return f(self.backing.a, 0);
  }
  let out = _empty;
  let i = 0;
  for (const k of self) {
    out = (0, exports.appendAll)(out, f(k, i++));
  }
  return out;
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
exports.forEach = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.toReadonlyArray)(self).forEach(f));
/**
 * Flattens a chunk of chunks into a single chunk by concatenating all chunks.
 *
 * @since 2.0.0
 * @category sequencing
 */
exports.flatten = /*#__PURE__*/(0, exports.flatMap)(Function_js_1.identity);
/**
 * @category sequencing
 * @since 2.0.0
 */
exports.flattenNonEmpty = /*#__PURE__*/(0, exports.flatMapNonEmpty)(Function_js_1.identity);
/**
 * Groups elements in chunks of up to `n` elements.
 *
 * @since 2.0.0
 * @category elements
 */
exports.chunksOf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => {
  const gr = [];
  let current = [];
  (0, exports.toReadonlyArray)(self).forEach(a => {
    current.push(a);
    if (current.length >= n) {
      gr.push((0, exports.unsafeFromArray)(current));
      current = [];
    }
  });
  if (current.length > 0) {
    gr.push((0, exports.unsafeFromArray)(current));
  }
  return (0, exports.unsafeFromArray)(gr);
});
/**
 * Creates a Chunk of unique values that are included in all given Chunks.
 *
 * The order and references of result values are determined by the Chunk.
 *
 * @since 2.0.0
 * @category elements
 */
exports.intersection = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.unsafeFromArray)(RA.intersection((0, exports.toReadonlyArray)(self), (0, exports.toReadonlyArray)(that))));
/**
 * Determines if the chunk is empty.
 *
 * @since 2.0.0
 * @category elements
 */
const isEmpty = self => self.length === 0;
exports.isEmpty = isEmpty;
/**
 * Determines if the chunk is not empty.
 *
 * @since 2.0.0
 * @category elements
 */
const isNonEmpty = self => self.length > 0;
exports.isNonEmpty = isNonEmpty;
/**
 * Returns the first element of this chunk if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
exports.head = /*#__PURE__*/(0, exports.get)(0);
/**
 * Returns the first element of this chunk.
 *
 * @since 2.0.0
 * @category unsafe
 */
const unsafeHead = self => (0, exports.unsafeGet)(self, 0);
exports.unsafeHead = unsafeHead;
/**
 * Returns the first element of this non empty chunk.
 *
 * @since 2.0.0
 * @category elements
 */
exports.headNonEmpty = exports.unsafeHead;
/**
 * Returns the last element of this chunk if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
const last = self => (0, exports.get)(self, self.length - 1);
exports.last = last;
/**
 * Returns the last element of this chunk.
 *
 * @since 2.0.0
 * @category unsafe
 */
const unsafeLast = self => (0, exports.unsafeGet)(self, self.length - 1);
exports.unsafeLast = unsafeLast;
/**
 * Returns a chunk with the elements mapped by the specified f function.
 *
 * @since 2.0.0
 * @category mapping
 */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => self.backing._tag === "ISingleton" ? (0, exports.of)(f(self.backing.a, 0)) : (0, exports.unsafeFromArray)((0, Function_js_1.pipe)((0, exports.toReadonlyArray)(self), RA.map((a, i) => f(a, i)))));
/**
 * Statefully maps over the chunk, producing new elements of type `B`.
 *
 * @since 2.0.0
 * @category folding
 */
exports.mapAccum = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, s, f) => {
  const [s1, as] = RA.mapAccum(self, s, f);
  return [s1, (0, exports.unsafeFromArray)(as)];
});
/**
 * Separate elements based on a predicate that also exposes the index of the element.
 *
 * @category filtering
 * @since 2.0.0
 */
exports.partition = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, Function_js_1.pipe)(RA.partition((0, exports.toReadonlyArray)(self), predicate), ([l, r]) => [(0, exports.unsafeFromArray)(l), (0, exports.unsafeFromArray)(r)]));
/**
 * Partitions the elements of this chunk into two chunks using f.
 *
 * @category filtering
 * @since 2.0.0
 */
exports.partitionMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, Function_js_1.pipe)(RA.partitionMap((0, exports.toReadonlyArray)(self), f), ([l, r]) => [(0, exports.unsafeFromArray)(l), (0, exports.unsafeFromArray)(r)]));
/**
 * Partitions the elements of this chunk into two chunks.
 *
 * @category filtering
 * @since 2.0.0
 */
const separate = self => (0, Function_js_1.pipe)(RA.separate((0, exports.toReadonlyArray)(self)), ([l, r]) => [(0, exports.unsafeFromArray)(l), (0, exports.unsafeFromArray)(r)]);
exports.separate = separate;
/**
 * Retireves the size of the chunk
 *
 * @since 2.0.0
 * @category elements
 */
const size = self => self.length;
exports.size = size;
/**
 * Sort the elements of a Chunk in increasing order, creating a new Chunk.
 *
 * @since 2.0.0
 * @category elements
 */
exports.sort = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, O) => (0, exports.unsafeFromArray)(RA.sort((0, exports.toReadonlyArray)(self), O)));
/**
 * @since 2.0.0
 * @category elements
 */
exports.sortWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, f, order) => (0, exports.sort)(self, Order.mapInput(order, f)));
/**
 *  Returns two splits of this chunk at the specified index.
 *
 * @since 2.0.0
 * @category elements
 */
exports.splitAt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => [(0, exports.take)(self, n), (0, exports.drop)(self, n)]);
/**
 * Splits this chunk into `n` equally sized chunks.
 *
 * @since 2.0.0
 * @category elements
 */
exports.split = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.chunksOf)(self, Math.ceil(self.length / Math.floor(n))));
/**
 * Splits this chunk on the first element that matches this predicate.
 *
 * @category elements
 * @since 2.0.0
 */
exports.splitWhere = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  let i = 0;
  for (const a of (0, exports.toReadonlyArray)(self)) {
    if (predicate(a)) {
      break;
    } else {
      i++;
    }
  }
  return (0, exports.splitAt)(self, i);
});
/**
 * Returns every elements after the first.
 *
 * @since 2.0.0
 * @category elements
 */
const tail = self => self.length > 0 ? O.some((0, exports.drop)(self, 1)) : O.none();
exports.tail = tail;
/**
 * Returns every elements after the first.
 *
 * @since 2.0.0
 * @category elements
 */
const tailNonEmpty = self => (0, exports.drop)(self, 1);
exports.tailNonEmpty = tailNonEmpty;
/**
 * Takes the last `n` elements.
 *
 * @since 2.0.0
 * @category elements
 */
exports.takeRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => (0, exports.drop)(self, self.length - n));
/**
 * Takes all elements so long as the predicate returns true.
 *
 * @since 2.0.0
 * @category elements
 */
exports.takeWhile = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => {
  const res = [];
  for (const a of (0, exports.toReadonlyArray)(self)) {
    if (predicate(a)) {
      res.push(a);
    } else {
      break;
    }
  }
  return (0, exports.unsafeFromArray)(res);
});
/**
 * Creates a Chunks of unique values, in order, from all given Chunks.
 *
 * @since 2.0.0
 * @category elements
 */
exports.union = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.unsafeFromArray)(RA.union((0, exports.toReadonlyArray)(self), (0, exports.toReadonlyArray)(that))));
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @since 2.0.0
 * @category elements
 */
const dedupe = self => (0, exports.unsafeFromArray)(RA.dedupe((0, exports.toReadonlyArray)(self)));
exports.dedupe = dedupe;
/**
 * Deduplicates adjacent elements that are identical.
 *
 * @since 2.0.0
 * @category filtering
 */
const dedupeAdjacent = self => (0, exports.unsafeFromArray)(RA.dedupeAdjacent(self));
exports.dedupeAdjacent = dedupeAdjacent;
/**
 * Takes a `Chunk` of pairs and return two corresponding `Chunk`s.
 *
 * Note: The function is reverse of `zip`.
 *
 * @since 2.0.0
 * @category elements
 */
const unzip = self => {
  const [left, right] = RA.unzip(self);
  return [(0, exports.unsafeFromArray)(left), (0, exports.unsafeFromArray)(right)];
};
exports.unzip = unzip;
/**
 * Zips this chunk pointwise with the specified chunk using the specified combiner.
 *
 * @since 2.0.0
 * @category elements
 */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => (0, exports.unsafeFromArray)(RA.zipWith(self, that, f)));
/**
 * Zips this chunk pointwise with the specified chunk.
 *
 * @since 2.0.0
 * @category elements
 */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWith)(self, that, (a, b) => [a, b]));
/**
 * Delete the element at the specified index, creating a new `Chunk`,
 * or returning the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
exports.remove = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, i) => (0, exports.unsafeFromArray)(RA.remove((0, exports.toReadonlyArray)(self), i)));
/**
 * @since 2.0.0
 */
exports.modifyOption = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, f) => O.map(RA.modifyOption((0, exports.toReadonlyArray)(self), i, f), exports.unsafeFromArray));
/**
 * Apply a function to the element at the specified index, creating a new `Chunk`,
 * or returning the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
exports.modify = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, f) => O.getOrElse((0, exports.modifyOption)(self, i, f), () => self));
/**
 * Change the element at the specified index, creating a new `Chunk`,
 * or returning the input if the index is out of bounds.
 *
 * @since 2.0.0
 */
exports.replace = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, b) => (0, exports.modify)(self, i, () => b));
/**
 * @since 2.0.0
 */
exports.replaceOption = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, i, b) => (0, exports.modifyOption)(self, i, () => b));
/**
 * Return a Chunk of length n with element i initialized with f(i).
 *
 * **Note**. `n` is normalized to an integer >= 1.
 *
 * @category constructors
 * @since 2.0.0
 */
exports.makeBy = /*#__PURE__*/(0, Function_js_1.dual)(2, (n, f) => (0, exports.fromIterable)(RA.makeBy(n, f)));
/**
 * Create a non empty `Chunk` containing a range of integers, including both endpoints.
 *
 * @category constructors
 * @since 2.0.0
 */
const range = (start, end) => start <= end ? (0, exports.makeBy)(end - start + 1, i => start + i) : (0, exports.of)(start);
exports.range = range;
// -------------------------------------------------------------------------------------
// re-exports from ReadonlyArray
// -------------------------------------------------------------------------------------
/**
 * Returns a function that checks if a `Chunk` contains a given value using the default `Equivalence`.
 *
 * @category elements
 * @since 2.0.0
 */
exports.contains = RA.contains;
/**
 * Returns a function that checks if a `Chunk` contains a given value using a provided `isEquivalent` function.
 *
 * @category elements
 * @since 2.0.0
 */
exports.containsWith = RA.containsWith;
/**
 * Returns the first element that satisfies the specified
 * predicate, or `None` if no such element exists.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findFirst = RA.findFirst;
/**
 * Return the first index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findFirstIndex = RA.findFirstIndex;
/**
 * Find the last element for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findLast = RA.findLast;
/**
 * Return the last index for which a predicate holds.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findLastIndex = RA.findLastIndex;
/**
 * Check if a predicate holds true for every `Chunk` element.
 *
 * @category elements
 * @since 2.0.0
 */
exports.every = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, refinement) => RA.fromIterable(self).every(refinement));
/**
 * Check if a predicate holds true for some `Chunk` element.
 *
 * @category elements
 * @since 2.0.0
 */
exports.some = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => RA.fromIterable(self).some(predicate));
/**
 * Joins the elements together with "sep" in the middle.
 *
 * @category folding
 * @since 2.0.0
 */
exports.join = RA.join;
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduce = RA.reduce;
/**
 * @category folding
 * @since 2.0.0
 */
exports.reduceRight = RA.reduceRight;
//# sourceMappingURL=Chunk.js.map