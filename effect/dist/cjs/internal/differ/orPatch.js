"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = exports.combine = exports.diff = exports.makeUpdateRight = exports.makeUpdateLeft = exports.makeSetRight = exports.makeSetLeft = exports.makeAndThen = exports.empty = exports.OrPatchTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const E = /*#__PURE__*/require("../../Either.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Dual = /*#__PURE__*/require("../../Function.js");
const data_js_1 = /*#__PURE__*/require("../data.js");
/** @internal */
exports.OrPatchTypeId = /*#__PURE__*/Symbol.for("effect/DifferOrPatch");
function variance(a) {
  return a;
}
/** @internal */
const PatchProto = {
  ...data_js_1.Structural.prototype,
  [exports.OrPatchTypeId]: {
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
const SetLeftProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "SetLeft"
});
/** @internal */
const makeSetLeft = value => {
  const o = Object.create(SetLeftProto);
  o.value = value;
  return o;
};
exports.makeSetLeft = makeSetLeft;
const SetRightProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "SetRight"
});
/** @internal */
const makeSetRight = value => {
  const o = Object.create(SetRightProto);
  o.value = value;
  return o;
};
exports.makeSetRight = makeSetRight;
const UpdateLeftProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "UpdateLeft"
});
/** @internal */
const makeUpdateLeft = patch => {
  const o = Object.create(UpdateLeftProto);
  o.patch = patch;
  return o;
};
exports.makeUpdateLeft = makeUpdateLeft;
const UpdateRightProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "UpdateRight"
});
/** @internal */
const makeUpdateRight = patch => {
  const o = Object.create(UpdateRightProto);
  o.patch = patch;
  return o;
};
exports.makeUpdateRight = makeUpdateRight;
/** @internal */
const diff = options => {
  switch (options.oldValue._tag) {
    case "Left":
      {
        switch (options.newValue._tag) {
          case "Left":
            {
              const valuePatch = options.left.diff(options.oldValue.left, options.newValue.left);
              if (Equal.equals(valuePatch, options.left.empty)) {
                return (0, exports.empty)();
              }
              return (0, exports.makeUpdateLeft)(valuePatch);
            }
          case "Right":
            {
              return (0, exports.makeSetRight)(options.newValue.right);
            }
        }
      }
    case "Right":
      {
        switch (options.newValue._tag) {
          case "Left":
            {
              return (0, exports.makeSetLeft)(options.newValue.left);
            }
          case "Right":
            {
              const valuePatch = options.right.diff(options.oldValue.right, options.newValue.right);
              if (Equal.equals(valuePatch, options.right.empty)) {
                return (0, exports.empty)();
              }
              return (0, exports.makeUpdateRight)(valuePatch);
            }
        }
      }
  }
};
exports.diff = diff;
/** @internal */
exports.combine = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.makeAndThen)(self, that));
/** @internal */
exports.patch = /*#__PURE__*/Dual.dual(2, (self, {
  left,
  oldValue,
  right
}) => {
  let patches = Chunk.of(self);
  let result = oldValue;
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
      case "UpdateLeft":
        {
          if (result._tag === "Left") {
            result = E.left(left.patch(head.patch, result.left));
          }
          patches = tail;
          break;
        }
      case "UpdateRight":
        {
          if (result._tag === "Right") {
            result = E.right(right.patch(head.patch, result.right));
          }
          patches = tail;
          break;
        }
      case "SetLeft":
        {
          result = E.left(head.value);
          patches = tail;
          break;
        }
      case "SetRight":
        {
          result = E.right(head.value);
          patches = tail;
          break;
        }
    }
  }
  return result;
});
//# sourceMappingURL=orPatch.js.map