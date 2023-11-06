"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recount = exports.repaint = exports.swap = exports.clone = exports.Node = exports.Color = void 0;
/** @internal */
exports.Color = {
  Red: 0,
  Black: 1 << 0
};
/** @internal */
class Node {
  color;
  key;
  value;
  left;
  right;
  count;
  constructor(color, key, value, left, right, count) {
    this.color = color;
    this.key = key;
    this.value = value;
    this.left = left;
    this.right = right;
    this.count = count;
  }
}
exports.Node = Node;
/** @internal */
function clone(node) {
  return new Node(node.color, node.key, node.value, node.left, node.right, node.count);
}
exports.clone = clone;
/** @internal */
function swap(n, v) {
  n.key = v.key;
  n.value = v.value;
  n.left = v.left;
  n.right = v.right;
  n.color = v.color;
  n.count = v.count;
}
exports.swap = swap;
/** @internal */
function repaint(node, color) {
  return new Node(color, node.key, node.value, node.left, node.right, node.count);
}
exports.repaint = repaint;
/** @internal */
function recount(node) {
  node.count = 1 + (node.left?.count ?? 0) + (node.right?.count ?? 0);
}
exports.recount = recount;
//# sourceMappingURL=node.js.map