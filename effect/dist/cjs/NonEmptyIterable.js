"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unprepend = void 0;
/**
 * @category getters
 * @since 2.0.0
 */
const unprepend = self => {
  const iterator = self[Symbol.iterator]();
  const next = iterator.next();
  if (next.done) {
    throw new Error("BUG: NonEmptyIterator should not be empty");
  }
  return [next.value, iterator];
};
exports.unprepend = unprepend;
//# sourceMappingURL=NonEmptyIterable.js.map