"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pollUpTo = exports.poll = exports.offerAll = exports.offer = exports.capacity = exports.isFull = exports.isEmpty = exports.length = exports.unbounded = exports.bounded = exports.EmptyMutableQueue = void 0;
/**
 * @since 2.0.0
 */
const Chunk = /*#__PURE__*/require("./Chunk.js");
const Dual = /*#__PURE__*/require("./Function.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const MutableList = /*#__PURE__*/require("./MutableList.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/MutableQueue");
/**
 * @since 2.0.0
 * @category symbol
 */
exports.EmptyMutableQueue = /*#__PURE__*/Symbol.for("effect/mutable/MutableQueue/Empty");
const MutableQueueProto = {
  [TypeId]: TypeId,
  [Symbol.iterator]() {
    return Array.from(this.queue)[Symbol.iterator]();
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableQueue",
      values: Array.from(this).map(Inspectable_js_1.toJSON)
    };
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
const make = capacity => {
  const queue = Object.create(MutableQueueProto);
  queue.queue = MutableList.empty();
  queue.capacity = capacity;
  return queue;
};
/**
 * Creates a new bounded `MutableQueue`.
 *
 * @since 2.0.0
 * @category constructors
 */
const bounded = capacity => make(capacity);
exports.bounded = bounded;
/**
 * Creates a new unbounded `MutableQueue`.
 *
 * @since 2.0.0
 * @category constructors
 */
const unbounded = () => make(undefined);
exports.unbounded = unbounded;
/**
 * Returns the current number of elements in the queue.
 *
 * @since 2.0.0
 * @category getters
 */
const length = self => MutableList.length(self.queue);
exports.length = length;
/**
 * Returns `true` if the queue is empty, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
const isEmpty = self => MutableList.isEmpty(self.queue);
exports.isEmpty = isEmpty;
/**
 * Returns `true` if the queue is full, `false` otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
const isFull = self => self.capacity === undefined ? false : MutableList.length(self.queue) === self.capacity;
exports.isFull = isFull;
/**
 * The **maximum** number of elements that a queue can hold.
 *
 * **Note**: unbounded queues can still implement this interface with
 * `capacity = Infinity`.
 *
 * @since 2.0.0
 * @category getters
 */
const capacity = self => self.capacity === undefined ? Infinity : self.capacity;
exports.capacity = capacity;
/**
 * Offers an element to the queue.
 *
 * Returns whether the enqueue was successful or not.
 *
 * @since 2.0.0
 */
exports.offer = /*#__PURE__*/Dual.dual(2, (self, value) => {
  const queueLength = MutableList.length(self.queue);
  if (self.capacity !== undefined && queueLength === self.capacity) {
    return false;
  }
  MutableList.append(value)(self.queue);
  return true;
});
/**
 * Enqueues a collection of values into the queue.
 *
 * Returns a `Chunk` of the values that were **not** able to be enqueued.
 *
 * @since 2.0.0
 */
exports.offerAll = /*#__PURE__*/Dual.dual(2, (self, values) => {
  const iterator = values[Symbol.iterator]();
  let next;
  let remainder = Chunk.empty();
  let offering = true;
  while (offering && (next = iterator.next()) && !next.done) {
    offering = (0, exports.offer)(next.value)(self);
  }
  while (next != null && !next.done) {
    remainder = Chunk.prepend(next.value)(remainder);
    next = iterator.next();
  }
  return Chunk.reverse(remainder);
});
/**
 * Dequeues an element from the queue.
 *
 * Returns either an element from the queue, or the `def` param.
 *
 * **Note**: if there is no meaningful default for your type, you can always
 * use `poll(MutableQueue.EmptyMutableQueue)`.
 *
 * @since 2.0.0
 */
exports.poll = /*#__PURE__*/Dual.dual(2, (self, def) => {
  if (MutableList.isEmpty(self.queue)) {
    return def;
  }
  return MutableList.shift(self.queue);
});
/**
 * Dequeues up to `n` elements from the queue.
 *
 * Returns a `List` of up to `n` elements.
 *
 * @since 2.0.0
 */
exports.pollUpTo = /*#__PURE__*/Dual.dual(2, (self, n) => {
  let result = Chunk.empty();
  let count = 0;
  while (count < n) {
    const element = (0, exports.poll)(exports.EmptyMutableQueue)(self);
    if (element === exports.EmptyMutableQueue) {
      break;
    }
    result = Chunk.prepend(element)(result);
    count += 1;
  }
  return Chunk.reverse(result);
});
//# sourceMappingURL=MutableQueue.js.map