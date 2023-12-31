"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = exports.combine = exports.diff = exports.empty = exports.ChunkPatchTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Dual = /*#__PURE__*/require("../../Function.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Data = /*#__PURE__*/require("../data.js");
/** @internal */
exports.ChunkPatchTypeId = /*#__PURE__*/Symbol.for("effect/DifferChunkPatch");
function variance(a) {
  return a;
}
const PatchProto = {
  ...Data.Structural.prototype,
  [exports.ChunkPatchTypeId]: {
    _Value: variance,
    _Patch: variance
  }
};
const EmptyProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "Empty"
});
const _empty = /*#__PURE__*/Object.create(EmptyProto);
/**
 * @internal
 */
const empty = () => _empty;
exports.empty = empty;
const AndThenProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "AndThen"
});
const makeAndThen = (first, second) => {
  const o = Object.create(AndThenProto);
  o.first = first;
  o.second = second;
  return o;
};
const AppendProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "Append"
});
const makeAppend = values => {
  const o = Object.create(AppendProto);
  o.values = values;
  return o;
};
const SliceProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "Slice"
});
const makeSlice = (from, until) => {
  const o = Object.create(SliceProto);
  o.from = from;
  o.until = until;
  return o;
};
const UpdateProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "Update"
});
const makeUpdate = (index, patch) => {
  const o = Object.create(UpdateProto);
  o.index = index;
  o.patch = patch;
  return o;
};
/** @internal */
const diff = options => {
  let i = 0;
  let patch = (0, exports.empty)();
  while (i < options.oldValue.length && i < options.newValue.length) {
    const oldElement = Chunk.unsafeGet(i)(options.oldValue);
    const newElement = Chunk.unsafeGet(i)(options.newValue);
    const valuePatch = options.differ.diff(oldElement, newElement);
    if (!Equal.equals(valuePatch, options.differ.empty)) {
      patch = (0, Function_js_1.pipe)(patch, (0, exports.combine)(makeUpdate(i, valuePatch)));
    }
    i = i + 1;
  }
  if (i < options.oldValue.length) {
    patch = (0, Function_js_1.pipe)(patch, (0, exports.combine)(makeSlice(0, i)));
  }
  if (i < options.newValue.length) {
    patch = (0, Function_js_1.pipe)(patch, (0, exports.combine)(makeAppend(Chunk.drop(i)(options.newValue))));
  }
  return patch;
};
exports.diff = diff;
/** @internal */
exports.combine = /*#__PURE__*/Dual.dual(2, (self, that) => makeAndThen(self, that));
/** @internal */
exports.patch = /*#__PURE__*/Dual.dual(3, (self, oldValue, differ) => {
  let chunk = oldValue;
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
      case "Append":
        {
          chunk = Chunk.appendAll(head.values)(chunk);
          patches = tail;
          break;
        }
      case "Slice":
        {
          const array = Chunk.toReadonlyArray(chunk);
          chunk = Chunk.unsafeFromArray(array.slice(head.from, head.until));
          patches = tail;
          break;
        }
      case "Update":
        {
          const array = Chunk.toReadonlyArray(chunk);
          array[head.index] = differ.patch(head.patch, array[head.index]);
          chunk = Chunk.unsafeFromArray(array);
          patches = tail;
          break;
        }
    }
  }
  return chunk;
});
//# sourceMappingURL=chunkPatch.js.map