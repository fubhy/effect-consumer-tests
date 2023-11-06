"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayNode = exports.IndexedNode = exports.CollisionNode = exports.LeafNode = exports.canEditNode = exports.isLeafNode = exports.isEmptyNode = exports.EmptyNode = void 0;
const Equal_js_1 = /*#__PURE__*/require("../../Equal.js");
const O = /*#__PURE__*/require("../../Option.js");
const Predicate_js_1 = /*#__PURE__*/require("../../Predicate.js");
const stack_js_1 = /*#__PURE__*/require("../stack.js");
const array_js_1 = /*#__PURE__*/require("./array.js");
const bitwise_js_1 = /*#__PURE__*/require("./bitwise.js");
const config_js_1 = /*#__PURE__*/require("./config.js");
/** @internal */
class EmptyNode {
  _tag = "EmptyNode";
  modify(edit, _shift, f, hash, key, size) {
    const v = f(O.none());
    if (O.isNone(v)) return new EmptyNode();
    ++size.value;
    return new LeafNode(edit, hash, key, v);
  }
}
exports.EmptyNode = EmptyNode;
/** @internal */
function isEmptyNode(a) {
  return (0, Predicate_js_1.isTagged)(a, "EmptyNode");
}
exports.isEmptyNode = isEmptyNode;
/** @internal */
function isLeafNode(node) {
  return isEmptyNode(node) || node._tag === "LeafNode" || node._tag === "CollisionNode";
}
exports.isLeafNode = isLeafNode;
/** @internal */
function canEditNode(node, edit) {
  return isEmptyNode(node) ? false : edit === node.edit;
}
exports.canEditNode = canEditNode;
/** @internal */
class LeafNode {
  edit;
  hash;
  key;
  value;
  _tag = "LeafNode";
  constructor(edit, hash, key, value) {
    this.edit = edit;
    this.hash = hash;
    this.key = key;
    this.value = value;
  }
  modify(edit, shift, f, hash, key, size) {
    if ((0, Equal_js_1.equals)(key, this.key)) {
      const v = f(this.value);
      if (v === this.value) return this;else if (O.isNone(v)) {
        ;
        --size.value;
        return new EmptyNode();
      }
      if (canEditNode(this, edit)) {
        this.value = v;
        return this;
      }
      return new LeafNode(edit, hash, key, v);
    }
    const v = f(O.none());
    if (O.isNone(v)) return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, hash, new LeafNode(edit, hash, key, v));
  }
}
exports.LeafNode = LeafNode;
/** @internal */
class CollisionNode {
  edit;
  hash;
  children;
  _tag = "CollisionNode";
  constructor(edit, hash, children) {
    this.edit = edit;
    this.hash = hash;
    this.children = children;
  }
  modify(edit, shift, f, hash, key, size) {
    if (hash === this.hash) {
      const canEdit = canEditNode(this, edit);
      const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key, size);
      if (list === this.children) return this;
      return list.length > 1 ? new CollisionNode(edit, this.hash, list) : list[0]; // collapse single element collision list
    }

    const v = f(O.none());
    if (O.isNone(v)) return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, hash, new LeafNode(edit, hash, key, v));
  }
  updateCollisionList(mutate, edit, hash, list, f, key, size) {
    const len = list.length;
    for (let i = 0; i < len; ++i) {
      const child = list[i];
      if ("key" in child && (0, Equal_js_1.equals)(key, child.key)) {
        const value = child.value;
        const newValue = f(value);
        if (newValue === value) return list;
        if (O.isNone(newValue)) {
          ;
          --size.value;
          return (0, array_js_1.arraySpliceOut)(mutate, i, list);
        }
        return (0, array_js_1.arrayUpdate)(mutate, i, new LeafNode(edit, hash, key, newValue), list);
      }
    }
    const newValue = f(O.none());
    if (O.isNone(newValue)) return list;
    ++size.value;
    return (0, array_js_1.arrayUpdate)(mutate, len, new LeafNode(edit, hash, key, newValue), list);
  }
}
exports.CollisionNode = CollisionNode;
/** @internal */
class IndexedNode {
  edit;
  mask;
  children;
  _tag = "IndexedNode";
  constructor(edit, mask, children) {
    this.edit = edit;
    this.mask = mask;
    this.children = children;
  }
  modify(edit, shift, f, hash, key, size) {
    const mask = this.mask;
    const children = this.children;
    const frag = (0, bitwise_js_1.hashFragment)(shift, hash);
    const bit = (0, bitwise_js_1.toBitmap)(frag);
    const indx = (0, bitwise_js_1.fromBitmap)(mask, bit);
    const exists = mask & bit;
    const canEdit = canEditNode(this, edit);
    if (!exists) {
      const _newChild = new EmptyNode().modify(edit, shift + config_js_1.SIZE, f, hash, key, size);
      if (!_newChild) return this;
      return children.length >= config_js_1.MAX_INDEX_NODE ? expand(edit, frag, _newChild, mask, children) : new IndexedNode(edit, mask | bit, (0, array_js_1.arraySpliceIn)(canEdit, indx, _newChild, children));
    }
    const current = children[indx];
    const child = current.modify(edit, shift + config_js_1.SIZE, f, hash, key, size);
    if (current === child) return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode(child)) {
      // remove
      bitmap &= ~bit;
      if (!bitmap) return new EmptyNode();
      if (children.length <= 2 && isLeafNode(children[indx ^ 1])) {
        return children[indx ^ 1]; // collapse
      }

      newChildren = (0, array_js_1.arraySpliceOut)(canEdit, indx, children);
    } else {
      // modify
      newChildren = (0, array_js_1.arrayUpdate)(canEdit, indx, child, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new IndexedNode(edit, bitmap, newChildren);
  }
}
exports.IndexedNode = IndexedNode;
/** @internal */
class ArrayNode {
  edit;
  size;
  children;
  _tag = "ArrayNode";
  constructor(edit, size, children) {
    this.edit = edit;
    this.size = size;
    this.children = children;
  }
  modify(edit, shift, f, hash, key, size) {
    let count = this.size;
    const children = this.children;
    const frag = (0, bitwise_js_1.hashFragment)(shift, hash);
    const child = children[frag];
    const newChild = (child || new EmptyNode()).modify(edit, shift + config_js_1.SIZE, f, hash, key, size);
    if (child === newChild) return this;
    const canEdit = canEditNode(this, edit);
    let newChildren;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      // add
      ;
      ++count;
      newChildren = (0, array_js_1.arrayUpdate)(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      // remove
      ;
      --count;
      if (count <= config_js_1.MIN_ARRAY_NODE) {
        return pack(edit, count, frag, children);
      }
      newChildren = (0, array_js_1.arrayUpdate)(canEdit, frag, new EmptyNode(), children);
    } else {
      // modify
      newChildren = (0, array_js_1.arrayUpdate)(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return new ArrayNode(edit, count, newChildren);
  }
}
exports.ArrayNode = ArrayNode;
function pack(edit, count, removed, elements) {
  const children = new Array(count - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode(elem)) {
        children[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode(edit, bitmap, children);
}
function expand(edit, frag, child, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count = 0;
  for (let i = 0; bit; ++i) {
    if (bit & 1) arr[i] = subNodes[count++];
    bit >>>= 1;
  }
  arr[frag] = child;
  return new ArrayNode(edit, count + 1, arr);
}
function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
  if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1]);
  const subH1 = (0, bitwise_js_1.hashFragment)(shift, h1);
  const subH2 = (0, bitwise_js_1.hashFragment)(shift, h2);
  if (subH1 === subH2) {
    return child => new IndexedNode(edit, (0, bitwise_js_1.toBitmap)(subH1) | (0, bitwise_js_1.toBitmap)(subH2), [child]);
  } else {
    const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode(edit, (0, bitwise_js_1.toBitmap)(subH1) | (0, bitwise_js_1.toBitmap)(subH2), children);
  }
}
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
  let stack = undefined;
  let currentShift = shift;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
    if (typeof res === "function") {
      stack = new stack_js_1.Stack(res, stack);
      currentShift = currentShift + config_js_1.SIZE;
    } else {
      let final = res;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
}
//# sourceMappingURL=node.js.map