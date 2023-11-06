"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = exports.combine = exports.diff = exports.empty = exports.OP_AND_THEN = exports.OP_UPDATE = exports.OP_REMOVE = exports.OP_ADD = exports.OP_EMPTY = void 0;
const Equal_js_1 = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Arr = /*#__PURE__*/require("../../ReadonlyArray.js");
const _fiberRefs = /*#__PURE__*/require("../fiberRefs.js");
/** @internal */
exports.OP_EMPTY = "Empty";
/** @internal */
exports.OP_ADD = "Add";
/** @internal */
exports.OP_REMOVE = "Remove";
/** @internal */
exports.OP_UPDATE = "Update";
/** @internal */
exports.OP_AND_THEN = "AndThen";
/** @internal */
exports.empty = {
  _tag: exports.OP_EMPTY
};
/** @internal */
const diff = (oldValue, newValue) => {
  const missingLocals = new Map(oldValue.locals);
  let patch = exports.empty;
  for (const [fiberRef, pairs] of newValue.locals.entries()) {
    const newValue = Arr.headNonEmpty(pairs)[1];
    const old = missingLocals.get(fiberRef);
    if (old !== undefined) {
      const oldValue = Arr.headNonEmpty(old)[1];
      if (!(0, Equal_js_1.equals)(oldValue, newValue)) {
        patch = (0, exports.combine)({
          _tag: exports.OP_UPDATE,
          fiberRef,
          patch: fiberRef.diff(oldValue, newValue)
        })(patch);
      }
    } else {
      patch = (0, exports.combine)({
        _tag: exports.OP_ADD,
        fiberRef,
        value: newValue
      })(patch);
    }
    missingLocals.delete(fiberRef);
  }
  for (const [fiberRef] of missingLocals.entries()) {
    patch = (0, exports.combine)({
      _tag: exports.OP_REMOVE,
      fiberRef
    })(patch);
  }
  return patch;
};
exports.diff = diff;
/** @internal */
exports.combine = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => ({
  _tag: exports.OP_AND_THEN,
  first: self,
  second: that
}));
/** @internal */
exports.patch = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, fiberId, oldValue) => {
  let fiberRefs = oldValue;
  let patches = Arr.of(self);
  while (Arr.isNonEmptyReadonlyArray(patches)) {
    const head = Arr.headNonEmpty(patches);
    const tail = Arr.tailNonEmpty(patches);
    switch (head._tag) {
      case exports.OP_EMPTY:
        {
          patches = tail;
          break;
        }
      case exports.OP_ADD:
        {
          fiberRefs = _fiberRefs.updatedAs(fiberRefs, {
            fiberId,
            fiberRef: head.fiberRef,
            value: head.value
          });
          patches = tail;
          break;
        }
      case exports.OP_REMOVE:
        {
          fiberRefs = _fiberRefs.delete_(fiberRefs, head.fiberRef);
          patches = tail;
          break;
        }
      case exports.OP_UPDATE:
        {
          const value = _fiberRefs.getOrDefault(fiberRefs, head.fiberRef);
          fiberRefs = _fiberRefs.updatedAs(fiberRefs, {
            fiberId,
            fiberRef: head.fiberRef,
            value: head.fiberRef.patch(head.patch)(value)
          });
          patches = tail;
          break;
        }
      case exports.OP_AND_THEN:
        {
          patches = Arr.prepend(head.first)(Arr.prepend(head.second)(tail));
          break;
        }
    }
  }
  return fiberRefs;
});
//# sourceMappingURL=patch.js.map