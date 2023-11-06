"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepend = exports.pop = exports.shift = exports.append = exports.reset = exports.forEach = exports.head = exports.tail = exports.length = exports.isEmpty = exports.make = exports.fromIterable = exports.empty = void 0;
/**
 * @since 2.0.0
 */
const Dual = /*#__PURE__*/require("./Function.js");
const Inspectable_js_1 = /*#__PURE__*/require("./Inspectable.js");
const Pipeable_js_1 = /*#__PURE__*/require("./Pipeable.js");
const TypeId = /*#__PURE__*/Symbol.for("effect/MutableList");
const MutableListProto = {
  [TypeId]: TypeId,
  [Symbol.iterator]() {
    let done = false;
    let head = this.head;
    return {
      next() {
        if (done) {
          return this.return();
        }
        if (head == null) {
          done = true;
          return this.return();
        }
        const value = head.value;
        head = head.next;
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
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableList",
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
/** @internal */
class LinkedListNode {
  value;
  removed = false;
  prev = undefined;
  next = undefined;
  constructor(value) {
    this.value = value;
  }
}
/**
 * Creates an empty `MutableList`.
 *
 * @since 2.0.0
 * @category constructors
 */
const empty = () => {
  const list = Object.create(MutableListProto);
  list.head = undefined;
  list.tail = undefined;
  list._length = 0;
  return list;
};
exports.empty = empty;
/**
 * Creates a new `MutableList` from an `Iterable`.
 *
 * @since 2.0.0
 * @category constructors
 */
const fromIterable = iterable => {
  const list = (0, exports.empty)();
  for (const element of iterable) {
    (0, exports.append)(list, element);
  }
  return list;
};
exports.fromIterable = fromIterable;
/**
 * Creates a new `MutableList` from the specified elements.
 *
 * @since 2.0.0
 * @category constructors
 */
const make = (...elements) => (0, exports.fromIterable)(elements);
exports.make = make;
/**
 * Returns `true` if the list contains zero elements, `false`, otherwise.
 *
 * @since 2.0.0
 * @category getters
 */
const isEmpty = self => (0, exports.length)(self) === 0;
exports.isEmpty = isEmpty;
/**
 * Returns the length of the list.
 *
 * @since 2.0.0
 * @category getters
 */
const length = self => self._length;
exports.length = length;
/**
 * Returns the last element of the list, if it exists.
 *
 * @since 2.0.0
 * @category getters
 */
const tail = self => self.tail === undefined ? undefined : self.tail.value;
exports.tail = tail;
/**
 * Returns the first element of the list, if it exists.
 *
 * @since 2.0.0
 * @category getters
 */
const head = self => self.head === undefined ? undefined : self.head.value;
exports.head = head;
/**
 * Executes the specified function `f` for each element in the list.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.forEach = /*#__PURE__*/Dual.dual(2, (self, f) => {
  let current = self.head;
  while (current !== undefined) {
    f(current.value);
    current = current.next;
  }
});
/**
 * Removes all elements from the doubly-linked list.
 *
 * @since 2.0.0
 */
const reset = self => {
  ;
  self._length = 0;
  self.head = undefined;
  self.tail = undefined;
  return self;
};
exports.reset = reset;
/**
 * Appends the specified element to the end of the `MutableList`.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.append = /*#__PURE__*/Dual.dual(2, (self, value) => {
  const node = new LinkedListNode(value);
  if (self.head === undefined) {
    self.head = node;
  }
  if (self.tail === undefined) {
    self.tail = node;
  } else {
    self.tail.next = node;
    node.prev = self.tail;
    self.tail = node;
  }
  ;
  self._length += 1;
  return self;
});
/**
 * Removes the first value from the list and returns it, if it exists.
 *
 * @since 0.0.1
 */
const shift = self => {
  const head = self.head;
  if (head !== undefined) {
    remove(self, head);
    return head.value;
  }
  return undefined;
};
exports.shift = shift;
/**
 * Removes the last value from the list and returns it, if it exists.
 *
 * @since 0.0.1
 */
const pop = self => {
  const tail = self.tail;
  if (tail !== undefined) {
    remove(self, tail);
    return tail.value;
  }
  return undefined;
};
exports.pop = pop;
/**
 * Prepends the specified value to the beginning of the list.
 *
 * @category concatenating
 * @since 2.0.0
 */
exports.prepend = /*#__PURE__*/Dual.dual(2, (self, value) => {
  const node = new LinkedListNode(value);
  node.next = self.head;
  if (self.head !== undefined) {
    self.head.prev = node;
  }
  self.head = node;
  if (self.tail === undefined) {
    self.tail = node;
  }
  ;
  self._length += 1;
  return self;
});
const remove = (self, node) => {
  if (node.removed) {
    return;
  }
  node.removed = true;
  if (node.prev !== undefined && node.next !== undefined) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  } else if (node.prev !== undefined) {
    self.tail = node.prev;
    node.prev.next = undefined;
  } else if (node.next !== undefined) {
    self.head = node.next;
    node.next.prev = undefined;
  } else {
    self.tail = undefined;
    self.head = undefined;
  }
  if (self._length > 0) {
    ;
    self._length -= 1;
  }
};
//# sourceMappingURL=MutableList.js.map