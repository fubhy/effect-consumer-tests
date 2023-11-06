"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valuesReversed = exports.values = exports.size = exports.reversed = exports.removeFirst = exports.reduce = exports.forEachBetween = exports.forEachLessThan = exports.forEachGreaterThanEqual = exports.forEach = exports.lessThanEqualReversed = exports.lessThanEqual = exports.lessThanReversed = exports.lessThan = exports.last = exports.keysReversed = exports.keys = exports.insert = exports.has = exports.greaterThanEqualReversed = exports.greaterThanEqual = exports.greaterThanReversed = exports.greaterThan = exports.getOrder = exports.getAt = exports.first = exports.findFirst = exports.findAll = exports.atReversed = exports.at = exports.make = exports.fromIterable = exports.empty = exports.isRedBlackTree = exports.Direction = void 0;
const RBT = /*#__PURE__*/require("./internal/redBlackTree.js");
const RBTI = /*#__PURE__*/require("./internal/redBlackTree/iterator.js");
const TypeId = RBT.RedBlackTreeTypeId;
/**
 * @since 2.0.0
 * @category constants
 */
exports.Direction = RBTI.Direction;
/**
 * @since 2.0.0
 * @category refinements
 */
exports.isRedBlackTree = RBT.isRedBlackTree;
/**
 * Creates an empty `RedBlackTree`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.empty = RBT.empty;
/**
 * Constructs a new tree from an iterable of key-value pairs.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromIterable = RBT.fromIterable;
/**
 * Constructs a new `RedBlackTree` from the specified entries.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = RBT.make;
/**
 * Returns an iterator that points to the element at the specified index of the
 * tree.
 *
 * **Note**: The iterator will run through elements in order.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.at = RBT.atForwards;
/**
 * Returns an iterator that points to the element at the specified index of the
 * tree.
 *
 * **Note**: The iterator will run through elements in reverse order.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.atReversed = RBT.atBackwards;
/**
 * Finds all values in the tree associated with the specified key.
 *
 * @since 2.0.0
 * @category elements
 */
exports.findAll = RBT.findAll;
/**
 * Finds the first value in the tree associated with the specified key, if it exists.
 *
 * @category elements
 * @since 2.0.0
 */
exports.findFirst = RBT.findFirst;
/**
 * Returns the first entry in the tree, if it exists.
 *
 * @since 2.0.0
 * @category getters
 */
exports.first = RBT.first;
/**
 * Returns the element at the specified index within the tree or `None` if the
 * specified index does not exist.
 *
 * @since 2.0.0
 * @category elements
 */
exports.getAt = RBT.getAt;
/**
 * Gets the `Order<K>` that the `RedBlackTree<K, V>` is using.
 *
 * @since 2.0.0
 * @category getters
 */
exports.getOrder = RBT.getOrder;
/**
 * Returns an iterator that traverse entries in order with keys greater than the
 * specified key.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.greaterThan = RBT.greaterThanForwards;
/**
 * Returns an iterator that traverse entries in reverse order with keys greater
 * than the specified key.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.greaterThanReversed = RBT.greaterThanBackwards;
/**
 * Returns an iterator that traverse entries in order with keys greater than or
 * equal to the specified key.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.greaterThanEqual = RBT.greaterThanEqualForwards;
/**
 * Returns an iterator that traverse entries in reverse order with keys greater
 * than or equal to the specified key.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.greaterThanEqualReversed = RBT.greaterThanEqualBackwards;
/**
 * Finds the item with key, if it exists.
 *
 * @since 2.0.0
 * @category elements
 */
exports.has = RBT.has;
/**
 * Insert a new item into the tree.
 *
 * @since 2.0.0
 */
exports.insert = RBT.insert;
/**
 * Get all the keys present in the tree in order.
 *
 * @since 2.0.0
 * @category getters
 */
exports.keys = RBT.keysForward;
/**
 * Get all the keys present in the tree in reverse order.
 *
 * @since 2.0.0
 * @category getters
 */
exports.keysReversed = RBT.keysBackward;
/**
 * Returns the last entry in the tree, if it exists.
 *
 * @since 2.0.0
 * @category getters
 */
exports.last = RBT.last;
/**
 * Returns an iterator that traverse entries in order with keys less than the
 * specified key.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.lessThan = RBT.lessThanForwards;
/**
 * Returns an iterator that traverse entries in reverse order with keys less
 * than the specified key.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.lessThanReversed = RBT.lessThanBackwards;
/**
 * Returns an iterator that traverse entries in order with keys less than or
 * equal to the specified key.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.lessThanEqual = RBT.lessThanEqualForwards;
/**
 * Returns an iterator that traverse entries in reverse order with keys less
 * than or equal to the specified key.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.lessThanEqualReversed = RBT.lessThanEqualBackwards;
/**
 * Execute the specified function for each node of the tree, in order.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.forEach = RBT.forEach;
/**
 * Visit each node of the tree in order with key greater then or equal to max.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.forEachGreaterThanEqual = RBT.forEachGreaterThanEqual;
/**
 * Visit each node of the tree in order with key lower then max.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.forEachLessThan = RBT.forEachLessThan;
/**
 * Visit each node of the tree in order with key lower than max and greater
 * than or equal to min.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.forEachBetween = RBT.forEachBetween;
/**
 * Reduce a state over the entries of the tree.
 *
 * @since 2.0.0
 * @category folding
 */
exports.reduce = RBT.reduce;
/**
 * Removes the entry with the specified key, if it exists.
 *
 * @since 2.0.0
 */
exports.removeFirst = RBT.removeFirst;
/**
 * Traverse the tree in reverse order.
 *
 * @since 2.0.0
 * @category traversing
 */
exports.reversed = RBT.reversed;
/**
 * Returns the size of the tree.
 *
 * @since 2.0.0
 * @category getters
 */
exports.size = RBT.size;
/**
 * Get all values present in the tree in order.
 *
 * @since 2.0.0
 * @category getters
 */
exports.values = RBT.valuesForward;
/**
 * Get all values present in the tree in reverse order.
 *
 * @since 2.0.0
 * @category getters
 */
exports.valuesReversed = RBT.valuesBackward;
//# sourceMappingURL=RedBlackTree.js.map