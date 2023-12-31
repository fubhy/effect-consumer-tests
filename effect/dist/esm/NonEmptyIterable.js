/**
 * @since 2.0.0
 */
/**
 * @category getters
 * @since 2.0.0
 */
export const unprepend = self => {
  const iterator = self[Symbol.iterator]();
  const next = iterator.next();
  if (next.done) {
    throw new Error("BUG: NonEmptyIterator should not be empty");
  }
  return [next.value, iterator];
};
//# sourceMappingURL=NonEmptyIterable.js.map