"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valuesBackward = exports.valuesForward = exports.size = exports.removeFirst = exports.reduce = exports.forEachBetween = exports.forEachLessThan = exports.forEachGreaterThanEqual = exports.forEach = exports.lessThanEqualForwards = exports.lessThanEqualBackwards = exports.lessThanForwards = exports.lessThanBackwards = exports.greaterThanEqualForwards = exports.greaterThanEqualBackwards = exports.greaterThanForwards = exports.greaterThanBackwards = exports.reversed = exports.last = exports.keysBackward = exports.keysForward = exports.insert = exports.has = exports.getOrder = exports.getAt = exports.first = exports.findFirst = exports.findAll = exports.atForwards = exports.atBackwards = exports.make = exports.fromIterable = exports.empty = exports.isRedBlackTree = exports.RedBlackTreeTypeId = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const Dual = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const iterator_js_1 = /*#__PURE__*/require("./redBlackTree/iterator.js");
const Node = /*#__PURE__*/require("./redBlackTree/node.js");
const stack_js_1 = /*#__PURE__*/require("./stack.js");
const RedBlackTreeSymbolKey = "effect/RedBlackTree";
/** @internal */
exports.RedBlackTreeTypeId = /*#__PURE__*/Symbol.for(RedBlackTreeSymbolKey);
const RedBlackTreeProto = {
  [exports.RedBlackTreeTypeId]: exports.RedBlackTreeTypeId,
  [Hash.symbol]() {
    return Hash.combine(Hash.hash(RedBlackTreeSymbolKey))(Hash.array(Array.from(this)));
  },
  [Equal.symbol](that) {
    if ((0, exports.isRedBlackTree)(that)) {
      if ((this._root?.count ?? 0) !== (that._root?.count ?? 0)) {
        return false;
      }
      return Equal.equals(Array.from(this), Array.from(that));
    }
    return false;
  },
  [Symbol.iterator]() {
    const stack = [];
    let n = this._root;
    while (n != null) {
      stack.push(n);
      n = n.left;
    }
    return new iterator_js_1.RedBlackTreeIterator(this, stack, iterator_js_1.Direction.Forward);
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "RedBlackTree",
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
const makeImpl = (ord, root) => {
  const tree = Object.create(RedBlackTreeProto);
  tree._ord = ord;
  tree._root = root;
  return tree;
};
/** @internal */
const isRedBlackTree = u => (0, Predicate_js_1.hasProperty)(u, exports.RedBlackTreeTypeId);
exports.isRedBlackTree = isRedBlackTree;
/** @internal */
const empty = ord => makeImpl(ord, undefined);
exports.empty = empty;
/** @internal */
const fromIterable = ord => entries => {
  let tree = (0, exports.empty)(ord);
  for (const [key, value] of entries) {
    tree = (0, exports.insert)(tree, key, value);
  }
  return tree;
};
exports.fromIterable = fromIterable;
/** @internal */
const make = ord => (...entries) => {
  return (0, exports.fromIterable)(ord)(entries);
};
exports.make = make;
/** @internal */
exports.atBackwards = /*#__PURE__*/Dual.dual(2, (self, index) => at(self, index, iterator_js_1.Direction.Backward));
/** @internal */
exports.atForwards = /*#__PURE__*/Dual.dual(2, (self, index) => at(self, index, iterator_js_1.Direction.Forward));
const at = (self, index, direction) => {
  return {
    [Symbol.iterator]: () => {
      if (index < 0) {
        return new iterator_js_1.RedBlackTreeIterator(self, [], direction);
      }
      let node = self._root;
      const stack = [];
      while (node !== undefined) {
        stack.push(node);
        if (node.left !== undefined) {
          if (index < node.left.count) {
            node = node.left;
            continue;
          }
          index -= node.left.count;
        }
        if (!index) {
          return new iterator_js_1.RedBlackTreeIterator(self, stack, direction);
        }
        index -= 1;
        if (node.right !== undefined) {
          if (index >= node.right.count) {
            break;
          }
          node = node.right;
        } else {
          break;
        }
      }
      return new iterator_js_1.RedBlackTreeIterator(self, [], direction);
    }
  };
};
/** @internal */
exports.findAll = /*#__PURE__*/Dual.dual(2, (self, key) => {
  const stack = [];
  let node = self._root;
  let result = Chunk.empty();
  while (node !== undefined || stack.length > 0) {
    if (node) {
      stack.push(node);
      node = node.left;
    } else {
      const current = stack.pop();
      if (Equal.equals(key, current.key)) {
        result = Chunk.prepend(current.value)(result);
      }
      node = current.right;
    }
  }
  return result;
});
/** @internal */
exports.findFirst = /*#__PURE__*/Dual.dual(2, (self, key) => {
  const cmp = self._ord;
  let node = self._root;
  while (node !== undefined) {
    const d = cmp(key, node.key);
    if (Equal.equals(key, node.key)) {
      return Option.some(node.value);
    }
    if (d <= 0) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  return Option.none();
});
/** @internal */
const first = self => {
  let node = self._root;
  let current = self._root;
  while (node !== undefined) {
    current = node;
    node = node.left;
  }
  return current ? Option.some([current.key, current.value]) : Option.none();
};
exports.first = first;
/** @internal */
exports.getAt = /*#__PURE__*/Dual.dual(2, (self, index) => {
  if (index < 0) {
    return Option.none();
  }
  let root = self._root;
  let node = undefined;
  while (root !== undefined) {
    node = root;
    if (root.left) {
      if (index < root.left.count) {
        root = root.left;
        continue;
      }
      index -= root.left.count;
    }
    if (!index) {
      return Option.some([node.key, node.value]);
    }
    index -= 1;
    if (root.right) {
      if (index >= root.right.count) {
        break;
      }
      root = root.right;
    } else {
      break;
    }
  }
  return Option.none();
});
/** @internal */
const getOrder = tree => tree._ord;
exports.getOrder = getOrder;
/** @internal */
exports.has = /*#__PURE__*/Dual.dual(2, (self, key) => Option.isSome((0, exports.findFirst)(self, key)));
/** @internal */
exports.insert = /*#__PURE__*/Dual.dual(3, (self, key, value) => {
  const cmp = self._ord;
  // Find point to insert new node at
  let n = self._root;
  const n_stack = [];
  const d_stack = [];
  while (n != null) {
    const d = cmp(key, n.key);
    n_stack.push(n);
    d_stack.push(d);
    if (d <= 0) {
      n = n.left;
    } else {
      n = n.right;
    }
  }
  // Rebuild path to leaf node
  n_stack.push(new Node.Node(Node.Color.Red, key, value, undefined, undefined, 1));
  for (let s = n_stack.length - 2; s >= 0; --s) {
    const n2 = n_stack[s];
    if (d_stack[s] <= 0) {
      n_stack[s] = new Node.Node(n2.color, n2.key, n2.value, n_stack[s + 1], n2.right, n2.count + 1);
    } else {
      n_stack[s] = new Node.Node(n2.color, n2.key, n2.value, n2.left, n_stack[s + 1], n2.count + 1);
    }
  }
  // Rebalance tree using rotations
  for (let s = n_stack.length - 1; s > 1; --s) {
    const p = n_stack[s - 1];
    const n3 = n_stack[s];
    if (p.color === Node.Color.Black || n3.color === Node.Color.Black) {
      break;
    }
    const pp = n_stack[s - 2];
    if (pp.left === p) {
      if (p.left === n3) {
        const y = pp.right;
        if (y && y.color === Node.Color.Red) {
          p.color = Node.Color.Black;
          pp.right = Node.repaint(y, Node.Color.Black);
          pp.color = Node.Color.Red;
          s -= 1;
        } else {
          pp.color = Node.Color.Red;
          pp.left = p.right;
          p.color = Node.Color.Black;
          p.right = pp;
          n_stack[s - 2] = p;
          n_stack[s - 1] = n3;
          Node.recount(pp);
          Node.recount(p);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.left === pp) {
              ppp.left = p;
            } else {
              ppp.right = p;
            }
          }
          break;
        }
      } else {
        const y = pp.right;
        if (y && y.color === Node.Color.Red) {
          p.color = Node.Color.Black;
          pp.right = Node.repaint(y, Node.Color.Black);
          pp.color = Node.Color.Red;
          s -= 1;
        } else {
          p.right = n3.left;
          pp.color = Node.Color.Red;
          pp.left = n3.right;
          n3.color = Node.Color.Black;
          n3.left = p;
          n3.right = pp;
          n_stack[s - 2] = n3;
          n_stack[s - 1] = p;
          Node.recount(pp);
          Node.recount(p);
          Node.recount(n3);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.left === pp) {
              ppp.left = n3;
            } else {
              ppp.right = n3;
            }
          }
          break;
        }
      }
    } else {
      if (p.right === n3) {
        const y = pp.left;
        if (y && y.color === Node.Color.Red) {
          p.color = Node.Color.Black;
          pp.left = Node.repaint(y, Node.Color.Black);
          pp.color = Node.Color.Red;
          s -= 1;
        } else {
          pp.color = Node.Color.Red;
          pp.right = p.left;
          p.color = Node.Color.Black;
          p.left = pp;
          n_stack[s - 2] = p;
          n_stack[s - 1] = n3;
          Node.recount(pp);
          Node.recount(p);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.right === pp) {
              ppp.right = p;
            } else {
              ppp.left = p;
            }
          }
          break;
        }
      } else {
        const y = pp.left;
        if (y && y.color === Node.Color.Red) {
          p.color = Node.Color.Black;
          pp.left = Node.repaint(y, Node.Color.Black);
          pp.color = Node.Color.Red;
          s -= 1;
        } else {
          p.left = n3.right;
          pp.color = Node.Color.Red;
          pp.right = n3.left;
          n3.color = Node.Color.Black;
          n3.right = p;
          n3.left = pp;
          n_stack[s - 2] = n3;
          n_stack[s - 1] = p;
          Node.recount(pp);
          Node.recount(p);
          Node.recount(n3);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.right === pp) {
              ppp.right = n3;
            } else {
              ppp.left = n3;
            }
          }
          break;
        }
      }
    }
  }
  // Return new tree
  n_stack[0].color = Node.Color.Black;
  return makeImpl(self._ord, n_stack[0]);
});
/** @internal */
const keysForward = self => keys(self, iterator_js_1.Direction.Forward);
exports.keysForward = keysForward;
/** @internal */
const keysBackward = self => keys(self, iterator_js_1.Direction.Backward);
exports.keysBackward = keysBackward;
const keys = (self, direction) => {
  const begin = self[Symbol.iterator]();
  let count = 0;
  return {
    [Symbol.iterator]: () => keys(self, direction),
    next: () => {
      count++;
      const entry = begin.key;
      if (direction === iterator_js_1.Direction.Forward) {
        begin.moveNext();
      } else {
        begin.movePrev();
      }
      switch (entry._tag) {
        case "None":
          {
            return {
              done: true,
              value: count
            };
          }
        case "Some":
          {
            return {
              done: false,
              value: entry.value
            };
          }
      }
    }
  };
};
/** @internal */
const last = self => {
  let node = self._root;
  let current = self._root;
  while (node !== undefined) {
    current = node;
    node = node.right;
  }
  return current ? Option.some([current.key, current.value]) : Option.none();
};
exports.last = last;
/** @internal */
const reversed = self => {
  return {
    [Symbol.iterator]: () => {
      const stack = [];
      let node = self._root;
      while (node !== undefined) {
        stack.push(node);
        node = node.right;
      }
      return new iterator_js_1.RedBlackTreeIterator(self, stack, iterator_js_1.Direction.Backward);
    }
  };
};
exports.reversed = reversed;
/** @internal */
exports.greaterThanBackwards = /*#__PURE__*/Dual.dual(2, (self, key) => greaterThan(self, key, iterator_js_1.Direction.Backward));
/** @internal */
exports.greaterThanForwards = /*#__PURE__*/Dual.dual(2, (self, key) => greaterThan(self, key, iterator_js_1.Direction.Forward));
const greaterThan = (self, key, direction) => {
  return {
    [Symbol.iterator]: () => {
      const cmp = self._ord;
      let node = self._root;
      const stack = [];
      let last_ptr = 0;
      while (node !== undefined) {
        const d = cmp(key, node.key);
        stack.push(node);
        if (d < 0) {
          last_ptr = stack.length;
        }
        if (d < 0) {
          node = node.left;
        } else {
          node = node.right;
        }
      }
      stack.length = last_ptr;
      return new iterator_js_1.RedBlackTreeIterator(self, stack, direction);
    }
  };
};
/** @internal */
exports.greaterThanEqualBackwards = /*#__PURE__*/Dual.dual(2, (self, key) => greaterThanEqual(self, key, iterator_js_1.Direction.Backward));
/** @internal */
exports.greaterThanEqualForwards = /*#__PURE__*/Dual.dual(2, (self, key) => greaterThanEqual(self, key, iterator_js_1.Direction.Forward));
const greaterThanEqual = (self, key, direction = iterator_js_1.Direction.Forward) => {
  return {
    [Symbol.iterator]: () => {
      const cmp = self._ord;
      let node = self._root;
      const stack = [];
      let last_ptr = 0;
      while (node !== undefined) {
        const d = cmp(key, node.key);
        stack.push(node);
        if (d <= 0) {
          last_ptr = stack.length;
        }
        if (d <= 0) {
          node = node.left;
        } else {
          node = node.right;
        }
      }
      stack.length = last_ptr;
      return new iterator_js_1.RedBlackTreeIterator(self, stack, direction);
    }
  };
};
/** @internal */
exports.lessThanBackwards = /*#__PURE__*/Dual.dual(2, (self, key) => lessThan(self, key, iterator_js_1.Direction.Backward));
/** @internal */
exports.lessThanForwards = /*#__PURE__*/Dual.dual(2, (self, key) => lessThan(self, key, iterator_js_1.Direction.Forward));
const lessThan = (self, key, direction) => {
  return {
    [Symbol.iterator]: () => {
      const cmp = self._ord;
      let node = self._root;
      const stack = [];
      let last_ptr = 0;
      while (node !== undefined) {
        const d = cmp(key, node.key);
        stack.push(node);
        if (d > 0) {
          last_ptr = stack.length;
        }
        if (d <= 0) {
          node = node.left;
        } else {
          node = node.right;
        }
      }
      stack.length = last_ptr;
      return new iterator_js_1.RedBlackTreeIterator(self, stack, direction);
    }
  };
};
/** @internal */
exports.lessThanEqualBackwards = /*#__PURE__*/Dual.dual(2, (self, key) => lessThanEqual(self, key, iterator_js_1.Direction.Backward));
/** @internal */
exports.lessThanEqualForwards = /*#__PURE__*/Dual.dual(2, (self, key) => lessThanEqual(self, key, iterator_js_1.Direction.Forward));
const lessThanEqual = (self, key, direction) => {
  return {
    [Symbol.iterator]: () => {
      const cmp = self._ord;
      let node = self._root;
      const stack = [];
      let last_ptr = 0;
      while (node !== undefined) {
        const d = cmp(key, node.key);
        stack.push(node);
        if (d >= 0) {
          last_ptr = stack.length;
        }
        if (d < 0) {
          node = node.left;
        } else {
          node = node.right;
        }
      }
      stack.length = last_ptr;
      return new iterator_js_1.RedBlackTreeIterator(self, stack, direction);
    }
  };
};
/** @internal */
exports.forEach = /*#__PURE__*/Dual.dual(2, (self, f) => {
  const root = self._root;
  if (root !== undefined) {
    visitFull(root, (key, value) => {
      f(key, value);
      return Option.none();
    });
  }
});
/** @internal */
exports.forEachGreaterThanEqual = /*#__PURE__*/Dual.dual(3, (self, min, f) => {
  const root = self._root;
  const ord = self._ord;
  if (root !== undefined) {
    visitGreaterThanEqual(root, min, ord, (key, value) => {
      f(key, value);
      return Option.none();
    });
  }
});
/** @internal */
exports.forEachLessThan = /*#__PURE__*/Dual.dual(3, (self, max, f) => {
  const root = self._root;
  const ord = self._ord;
  if (root !== undefined) {
    visitLessThan(root, max, ord, (key, value) => {
      f(key, value);
      return Option.none();
    });
  }
});
/** @internal */
exports.forEachBetween = /*#__PURE__*/Dual.dual(2, (self, {
  body,
  max,
  min
}) => {
  const root = self._root;
  const ord = self._ord;
  if (root) {
    visitBetween(root, min, max, ord, (key, value) => {
      body(key, value);
      return Option.none();
    });
  }
});
/** @internal */
exports.reduce = /*#__PURE__*/Dual.dual(3, (self, zero, f) => {
  let accumulator = zero;
  for (const entry of self) {
    accumulator = f(accumulator, entry[1], entry[0]);
  }
  return accumulator;
});
/** @internal */
exports.removeFirst = /*#__PURE__*/Dual.dual(2, (self, key) => {
  if (!(0, exports.has)(self, key)) {
    return self;
  }
  const ord = self._ord;
  const cmp = ord;
  let node = self._root;
  const stack = [];
  while (node !== undefined) {
    const d = cmp(key, node.key);
    stack.push(node);
    if (Equal.equals(key, node.key)) {
      node = undefined;
    } else if (d <= 0) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  if (stack.length === 0) {
    return self;
  }
  const cstack = new Array(stack.length);
  let n = stack[stack.length - 1];
  cstack[cstack.length - 1] = new Node.Node(n.color, n.key, n.value, n.left, n.right, n.count);
  for (let i = stack.length - 2; i >= 0; --i) {
    n = stack[i];
    if (n.left === stack[i + 1]) {
      cstack[i] = new Node.Node(n.color, n.key, n.value, cstack[i + 1], n.right, n.count);
    } else {
      cstack[i] = new Node.Node(n.color, n.key, n.value, n.left, cstack[i + 1], n.count);
    }
  }
  // Get node
  n = cstack[cstack.length - 1];
  // If not leaf, then swap with previous node
  if (n.left !== undefined && n.right !== undefined) {
    // First walk to previous leaf
    const split = cstack.length;
    n = n.left;
    while (n.right != null) {
      cstack.push(n);
      n = n.right;
    }
    // Copy path to leaf
    const v = cstack[split - 1];
    cstack.push(new Node.Node(n.color, v.key, v.value, n.left, n.right, n.count));
    cstack[split - 1].key = n.key;
    cstack[split - 1].value = n.value;
    // Fix up stack
    for (let i = cstack.length - 2; i >= split; --i) {
      n = cstack[i];
      cstack[i] = new Node.Node(n.color, n.key, n.value, n.left, cstack[i + 1], n.count);
    }
    cstack[split - 1].left = cstack[split];
  }
  // Remove leaf node
  n = cstack[cstack.length - 1];
  if (n.color === Node.Color.Red) {
    // Easy case: removing red leaf
    const p = cstack[cstack.length - 2];
    if (p.left === n) {
      p.left = undefined;
    } else if (p.right === n) {
      p.right = undefined;
    }
    cstack.pop();
    for (let i = 0; i < cstack.length; ++i) {
      cstack[i].count--;
    }
    return makeImpl(ord, cstack[0]);
  } else {
    if (n.left !== undefined || n.right !== undefined) {
      // Second easy case:  Single child black parent
      if (n.left !== undefined) {
        Node.swap(n, n.left);
      } else if (n.right !== undefined) {
        Node.swap(n, n.right);
      }
      // Child must be red, so repaint it black to balance color
      n.color = Node.Color.Black;
      for (let i = 0; i < cstack.length - 1; ++i) {
        cstack[i].count--;
      }
      return makeImpl(ord, cstack[0]);
    } else if (cstack.length === 1) {
      // Third easy case: root
      return makeImpl(ord, undefined);
    } else {
      // Hard case: Repaint n, and then do some nasty stuff
      for (let i = 0; i < cstack.length; ++i) {
        cstack[i].count--;
      }
      const parent = cstack[cstack.length - 2];
      fixDoubleBlack(cstack);
      // Fix up links
      if (parent.left === n) {
        parent.left = undefined;
      } else {
        parent.right = undefined;
      }
    }
  }
  return makeImpl(ord, cstack[0]);
});
/** @internal */
const size = self => self._root?.count ?? 0;
exports.size = size;
/** @internal */
const valuesForward = self => values(self, iterator_js_1.Direction.Forward);
exports.valuesForward = valuesForward;
/** @internal */
const valuesBackward = self => values(self, iterator_js_1.Direction.Backward);
exports.valuesBackward = valuesBackward;
/** @internal */
const values = (self, direction) => {
  const begin = self[Symbol.iterator]();
  let count = 0;
  return {
    [Symbol.iterator]: () => values(self, direction),
    next: () => {
      count++;
      const entry = begin.value;
      if (direction === iterator_js_1.Direction.Forward) {
        begin.moveNext();
      } else {
        begin.movePrev();
      }
      switch (entry._tag) {
        case "None":
          {
            return {
              done: true,
              value: count
            };
          }
        case "Some":
          {
            return {
              done: false,
              value: entry.value
            };
          }
      }
    }
  };
};
const visitFull = (node, visit) => {
  let current = node;
  let stack = undefined;
  let done = false;
  while (!done) {
    if (current != null) {
      stack = new stack_js_1.Stack(current, stack);
      current = current.left;
    } else if (stack != null) {
      const value = visit(stack.value.key, stack.value.value);
      if (Option.isSome(value)) {
        return value;
      }
      current = stack.value.right;
      stack = stack.previous;
    } else {
      done = true;
    }
  }
  return Option.none();
};
const visitGreaterThanEqual = (node, min, ord, visit) => {
  let current = node;
  let stack = undefined;
  let done = false;
  while (!done) {
    if (current !== undefined) {
      stack = new stack_js_1.Stack(current, stack);
      if (ord(min, current.key) <= 0) {
        current = current.left;
      } else {
        current = undefined;
      }
    } else if (stack !== undefined) {
      if (ord(min, stack.value.key) <= 0) {
        const value = visit(stack.value.key, stack.value.value);
        if (Option.isSome(value)) {
          return value;
        }
      }
      current = stack.value.right;
      stack = stack.previous;
    } else {
      done = true;
    }
  }
  return Option.none();
};
const visitLessThan = (node, max, ord, visit) => {
  let current = node;
  let stack = undefined;
  let done = false;
  while (!done) {
    if (current !== undefined) {
      stack = new stack_js_1.Stack(current, stack);
      current = current.left;
    } else if (stack !== undefined && ord(max, stack.value.key) > 0) {
      const value = visit(stack.value.key, stack.value.value);
      if (Option.isSome(value)) {
        return value;
      }
      current = stack.value.right;
      stack = stack.previous;
    } else {
      done = true;
    }
  }
  return Option.none();
};
const visitBetween = (node, min, max, ord, visit) => {
  let current = node;
  let stack = undefined;
  let done = false;
  while (!done) {
    if (current !== undefined) {
      stack = new stack_js_1.Stack(current, stack);
      if (ord(min, current.key) <= 0) {
        current = current.left;
      } else {
        current = undefined;
      }
    } else if (stack !== undefined && ord(max, stack.value.key) > 0) {
      if (ord(min, stack.value.key) <= 0) {
        const value = visit(stack.value.key, stack.value.value);
        if (Option.isSome(value)) {
          return value;
        }
      }
      current = stack.value.right;
      stack = stack.previous;
    } else {
      done = true;
    }
  }
  return Option.none();
};
/**
 * Fix up a double black node in a Red-Black Tree.
 */
const fixDoubleBlack = stack => {
  let n, p, s, z;
  for (let i = stack.length - 1; i >= 0; --i) {
    n = stack[i];
    if (i === 0) {
      n.color = Node.Color.Black;
      return;
    }
    p = stack[i - 1];
    if (p.left === n) {
      s = p.right;
      if (s !== undefined && s.right !== undefined && s.right.color === Node.Color.Red) {
        s = p.right = Node.clone(s);
        z = s.right = Node.clone(s.right);
        p.right = s.left;
        s.left = p;
        s.right = z;
        s.color = p.color;
        n.color = Node.Color.Black;
        p.color = Node.Color.Black;
        z.color = Node.Color.Black;
        Node.recount(p);
        Node.recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = s;
          } else {
            pp.right = s;
          }
        }
        stack[i - 1] = s;
        return;
      } else if (s !== undefined && s.left !== undefined && s.left.color === Node.Color.Red) {
        s = p.right = Node.clone(s);
        z = s.left = Node.clone(s.left);
        p.right = z.left;
        s.left = z.right;
        z.left = p;
        z.right = s;
        z.color = p.color;
        p.color = Node.Color.Black;
        s.color = Node.Color.Black;
        n.color = Node.Color.Black;
        Node.recount(p);
        Node.recount(s);
        Node.recount(z);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = z;
          } else {
            pp.right = z;
          }
        }
        stack[i - 1] = z;
        return;
      }
      if (s !== undefined && s.color === Node.Color.Black) {
        if (p.color === Node.Color.Red) {
          p.color = Node.Color.Black;
          p.right = Node.repaint(s, Node.Color.Red);
          return;
        } else {
          p.right = Node.repaint(s, Node.Color.Red);
          continue;
        }
      } else if (s !== undefined) {
        s = Node.clone(s);
        p.right = s.left;
        s.left = p;
        s.color = p.color;
        p.color = Node.Color.Red;
        Node.recount(p);
        Node.recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = s;
          } else {
            pp.right = s;
          }
        }
        stack[i - 1] = s;
        stack[i] = p;
        if (i + 1 < stack.length) {
          stack[i + 1] = n;
        } else {
          stack.push(n);
        }
        i = i + 2;
      }
    } else {
      s = p.left;
      if (s !== undefined && s.left !== undefined && s.left.color === Node.Color.Red) {
        s = p.left = Node.clone(s);
        z = s.left = Node.clone(s.left);
        p.left = s.right;
        s.right = p;
        s.left = z;
        s.color = p.color;
        n.color = Node.Color.Black;
        p.color = Node.Color.Black;
        z.color = Node.Color.Black;
        Node.recount(p);
        Node.recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = s;
          } else {
            pp.left = s;
          }
        }
        stack[i - 1] = s;
        return;
      } else if (s !== undefined && s.right !== undefined && s.right.color === Node.Color.Red) {
        s = p.left = Node.clone(s);
        z = s.right = Node.clone(s.right);
        p.left = z.right;
        s.right = z.left;
        z.right = p;
        z.left = s;
        z.color = p.color;
        p.color = Node.Color.Black;
        s.color = Node.Color.Black;
        n.color = Node.Color.Black;
        Node.recount(p);
        Node.recount(s);
        Node.recount(z);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = z;
          } else {
            pp.left = z;
          }
        }
        stack[i - 1] = z;
        return;
      }
      if (s !== undefined && s.color === Node.Color.Black) {
        if (p.color === Node.Color.Red) {
          p.color = Node.Color.Black;
          p.left = Node.repaint(s, Node.Color.Red);
          return;
        } else {
          p.left = Node.repaint(s, Node.Color.Red);
          continue;
        }
      } else if (s !== undefined) {
        s = Node.clone(s);
        p.left = s.right;
        s.right = p;
        s.color = p.color;
        p.color = Node.Color.Red;
        Node.recount(p);
        Node.recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = s;
          } else {
            pp.left = s;
          }
        }
        stack[i - 1] = s;
        stack[i] = p;
        if (i + 1 < stack.length) {
          stack[i + 1] = n;
        } else {
          stack.push(n);
        }
        i = i + 2;
      }
    }
  }
};
//# sourceMappingURL=redBlackTree.js.map