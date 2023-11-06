"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = exports.combine = exports.diff = exports.empty = exports.ContextPatchTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Dual = /*#__PURE__*/require("../../Function.js");
const context_js_1 = /*#__PURE__*/require("../context.js");
const data_js_1 = /*#__PURE__*/require("../data.js");
/** @internal */
exports.ContextPatchTypeId = /*#__PURE__*/Symbol.for("effect/DifferContextPatch");
function variance(a) {
  return a;
}
/** @internal */
const PatchProto = {
  ...data_js_1.Structural.prototype,
  [exports.ContextPatchTypeId]: {
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
const AddServiceProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "AddService"
});
const makeAddService = (tag, service) => {
  const o = Object.create(AddServiceProto);
  o.tag = tag;
  o.service = service;
  return o;
};
const RemoveServiceProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "RemoveService"
});
const makeRemoveService = tag => {
  const o = Object.create(RemoveServiceProto);
  o.tag = tag;
  return o;
};
const UpdateServiceProto = /*#__PURE__*/Object.assign( /*#__PURE__*/Object.create(PatchProto), {
  _tag: "UpdateService"
});
const makeUpdateService = (tag, update) => {
  const o = Object.create(UpdateServiceProto);
  o.tag = tag;
  o.update = update;
  return o;
};
/** @internal */
const diff = (oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch = (0, exports.empty)();
  for (const [tag, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag)) {
      const old = missingServices.get(tag);
      missingServices.delete(tag);
      if (!Equal.equals(old, newService)) {
        patch = (0, exports.combine)(makeUpdateService(tag, () => newService))(patch);
      }
    } else {
      missingServices.delete(tag);
      patch = (0, exports.combine)(makeAddService(tag, newService))(patch);
    }
  }
  for (const [tag] of missingServices.entries()) {
    patch = (0, exports.combine)(makeRemoveService(tag))(patch);
  }
  return patch;
};
exports.diff = diff;
/** @internal */
exports.combine = /*#__PURE__*/Dual.dual(2, (self, that) => makeAndThen(self, that));
/** @internal */
exports.patch = /*#__PURE__*/Dual.dual(2, (self, context) => {
  let wasServiceUpdated = false;
  let patches = Chunk.of(self);
  const updatedContext = new Map(context.unsafeMap);
  while (Chunk.isNonEmpty(patches)) {
    const head = Chunk.headNonEmpty(patches);
    const tail = Chunk.tailNonEmpty(patches);
    switch (head._tag) {
      case "Empty":
        {
          patches = tail;
          break;
        }
      case "AddService":
        {
          updatedContext.set(head.tag, head.service);
          patches = tail;
          break;
        }
      case "AndThen":
        {
          patches = Chunk.prepend(Chunk.prepend(tail, head.second), head.first);
          break;
        }
      case "RemoveService":
        {
          updatedContext.delete(head.tag);
          patches = tail;
          break;
        }
      case "UpdateService":
        {
          updatedContext.set(head.tag, head.update(updatedContext.get(head.tag)));
          wasServiceUpdated = true;
          patches = tail;
          break;
        }
    }
  }
  if (!wasServiceUpdated) {
    return (0, context_js_1.makeContext)(updatedContext);
  }
  const map = new Map();
  for (const [tag] of context.unsafeMap) {
    if (updatedContext.has(tag)) {
      map.set(tag, updatedContext.get(tag));
      updatedContext.delete(tag);
    }
  }
  for (const [tag, s] of updatedContext) {
    map.set(tag, s);
  }
  return (0, context_js_1.makeContext)(map);
});
//# sourceMappingURL=contextPatch.js.map