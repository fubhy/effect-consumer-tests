"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RingBuffer = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Option = /*#__PURE__*/require("../Option.js");
/** @internal */
class RingBuffer {
  capacity;
  array;
  size = 0;
  current = 0;
  constructor(capacity) {
    this.capacity = capacity;
    this.array = Array.from({
      length: capacity
    }, Function_js_1.constUndefined);
  }
  head() {
    return Option.fromNullable(this.array[this.current]);
  }
  lastOrNull() {
    if (this.size === 0) {
      return undefined;
    }
    const index = this.current === 0 ? this.array.length - 1 : this.current - 1;
    return this.array[index] ?? undefined;
  }
  put(value) {
    this.array[this.current] = value;
    this.increment();
  }
  dropLast() {
    if (this.size > 0) {
      this.decrement();
      this.array[this.current] = undefined;
    }
  }
  toChunk() {
    const begin = this.current - this.size;
    const newArray = begin < 0 ? [...this.array.slice(this.capacity + begin, this.capacity), ...this.array.slice(0, this.current)] : this.array.slice(begin, this.current);
    return Chunk.fromIterable(newArray);
  }
  increment() {
    if (this.size < this.capacity) {
      this.size += 1;
    }
    this.current = (this.current + 1) % this.capacity;
  }
  decrement() {
    this.size -= 1;
    if (this.current > 0) {
      this.current -= 1;
    } else {
      this.current = this.capacity - 1;
    }
  }
}
exports.RingBuffer = RingBuffer;
//# sourceMappingURL=ringBuffer.js.map