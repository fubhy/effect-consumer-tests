"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = exports.combine = exports.diff = exports.makeRemove = exports.makeAdd = exports.makeAndThen = exports.empty = exports.HashSetPatchTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Dual = /*#__PURE__*/require("../../Function.js");
const HashSet = /*#__PURE__*/require("../../HashSet.js");
const data_js_1 = /*#__PURE__*/require("../data.js");
/** @internal */
exports.HashSetPatchTypeId = /*#__PURE__*/Symbol.for("effect/DifferHashSetPatch");
function variance(a) {
  return a;
}
/** @internal */
const PatchProto = {
  ...data_js_1.Structural.prototype,
  [exports.HashSetPatchTypeId]: {
    _Value: variance,
    _Key: variance,
    _Patch: variance
  }
};
const EmptyProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "Empty"
});
const _empty = /*#__PURE__*/Object.create(EmptyProto);
/** @internal */
const empty = () => _empty;
exports.empty = empty;
const AndThenProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "AndThen"
});
/** @internal */
const makeAndThen = (first, second) => {
  const o = Object.create(AndThenProto);
  o.first = first;
  o.second = second;
  return o;
};
exports.makeAndThen = makeAndThen;
const AddProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "Add"
});
/** @internal */
const makeAdd = value => {
  const o = Object.create(AddProto);
  o.value = value;
  return o;
};
exports.makeAdd = makeAdd;
const RemoveProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "Remove"
});
/** @internal */
const makeRemove = value => {
  const o = Object.create(RemoveProto);
  o.value = value;
  return o;
};
exports.makeRemove = makeRemove;
/** @internal */
const diff = (oldValue, newValue) => {
  const [removed, patch] = HashSet.reduce([oldValue, (0, exports.empty)()], ([set, patch], value) => {
    if (HashSet.has(value)(set)) {
      return [HashSet.remove(value)(set), patch];
    }
    return [set, (0, exports.combine)((0, exports.makeAdd)(value))(patch)];
  })(newValue);
  return HashSet.reduce(patch, (patch, value) => (0, exports.combine)((0, exports.makeRemove)(value))(patch))(removed);
};
exports.diff = diff;
/** @internal */
exports.combine = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.makeAndThen)(self, that));
/** @internal */
exports.patch = /*#__PURE__*/Dual.dual(2, (self, oldValue) => {
  let set = oldValue;
  let patches = Chunk.of(self);
  while (Chunk.isNonEmpty(patches)) {
    const head = Chunk.headNonEmpty(patches);
    const tail = Chunk.tailNonEmpty(patches);
    switch (head._tag) {
      case "Empty":
        {
          patches = tail;
          break;
        }
      case "AndThen":
        {
          patches = Chunk.prepend(head.first)(Chunk.prepend(head.second)(tail));
          break;
        }
      case "Add":
        {
          set = HashSet.add(head.value)(set);
          patches = tail;
          break;
        }
      case "Remove":
        {
          set = HashSet.remove(head.value)(set);
          patches = tail;
        }
    }
  }
  return set;
});
//# sourceMappingURL=hashSetPatch.js.map