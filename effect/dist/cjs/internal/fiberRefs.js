"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatedAs = exports.getOrDefault = exports.get = exports.delete_ = exports.setAll = exports.fiberRefs = exports.forkAs = exports.joinAs = exports.FiberRefsImpl = exports.FiberRefsSym = exports.empty = exports.unsafeMake = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Arr = /*#__PURE__*/require("../ReadonlyArray.js");
const core = /*#__PURE__*/require("./core.js");
/** @internal */
function unsafeMake(fiberRefLocals) {
  return new FiberRefsImpl(fiberRefLocals);
}
exports.unsafeMake = unsafeMake;
/** @internal */
function empty() {
  return unsafeMake(new Map());
}
exports.empty = empty;
/** @internal */
exports.FiberRefsSym = /*#__PURE__*/Symbol.for("effect/FiberRefs");
/** @internal */
class FiberRefsImpl {
  locals;
  [exports.FiberRefsSym] = exports.FiberRefsSym;
  constructor(locals) {
    this.locals = locals;
  }
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
}
exports.FiberRefsImpl = FiberRefsImpl;
/** @internal */
const findAncestor = (_ref, _parentStack, _childStack, _childModified = false) => {
  const ref = _ref;
  let parentStack = _parentStack;
  let childStack = _childStack;
  let childModified = _childModified;
  let ret = undefined;
  while (ret === undefined) {
    if (Arr.isNonEmptyReadonlyArray(parentStack) && Arr.isNonEmptyReadonlyArray(childStack)) {
      const parentFiberId = Arr.headNonEmpty(parentStack)[0];
      const parentAncestors = Arr.tailNonEmpty(parentStack);
      const childFiberId = Arr.headNonEmpty(childStack)[0];
      const childRefValue = Arr.headNonEmpty(childStack)[1];
      const childAncestors = Arr.tailNonEmpty(childStack);
      if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
        childStack = childAncestors;
        childModified = true;
      } else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) {
        parentStack = parentAncestors;
      } else {
        if (parentFiberId.id < childFiberId.id) {
          childStack = childAncestors;
          childModified = true;
        } else if (parentFiberId.id > childFiberId.id) {
          parentStack = parentAncestors;
        } else {
          ret = [childRefValue, childModified];
        }
      }
    } else {
      ret = [ref.initial, true];
    }
  }
  return ret;
};
/** @internal */
exports.joinAs = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, fiberId, that) => {
  const parentFiberRefs = new Map(self.locals);
  for (const [fiberRef, childStack] of that.locals) {
    const childValue = Arr.headNonEmpty(childStack)[1];
    if (!Equal.equals(Arr.headNonEmpty(childStack)[0], fiberId)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (Equal.equals(childValue, fiberRef.initial)) {
          continue;
        }
        parentFiberRefs.set(fiberRef, [[fiberId, fiberRef.join(fiberRef.initial, childValue)]]);
        continue;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(fiberRef, parentStack, childStack);
      if (wasModified) {
        const patch = fiberRef.diff(ancestor, childValue);
        const oldValue = Arr.headNonEmpty(parentStack)[1];
        const newValue = fiberRef.join(oldValue, fiberRef.patch(patch)(oldValue));
        if (!Equal.equals(oldValue, newValue)) {
          let newStack;
          const parentFiberId = Arr.headNonEmpty(parentStack)[0];
          if (Equal.equals(parentFiberId, fiberId)) {
            newStack = Arr.prepend([parentFiberId, newValue])(Arr.tailNonEmpty(parentStack));
          } else {
            newStack = Arr.prepend([fiberId, newValue])(parentStack);
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  }
  return new FiberRefsImpl(new Map(parentFiberRefs));
});
/** @internal */
exports.forkAs = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, childId) => {
  const map = new Map();
  for (const [fiberRef, stack] of self.locals.entries()) {
    const oldValue = Arr.headNonEmpty(stack)[1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (Equal.equals(oldValue, newValue)) {
      map.set(fiberRef, stack);
    } else {
      map.set(fiberRef, Arr.prepend([childId, newValue])(stack));
    }
  }
  return new FiberRefsImpl(map);
});
/** @internal */
const fiberRefs = self => HashSet.fromIterable(self.locals.keys());
exports.fiberRefs = fiberRefs;
/** @internal */
const setAll = self => core.forEachSequentialDiscard((0, exports.fiberRefs)(self), fiberRef => core.fiberRefSet(fiberRef, (0, exports.getOrDefault)(self, fiberRef)));
exports.setAll = setAll;
/** @internal */
exports.delete_ = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, fiberRef) => {
  const locals = new Map(self.locals);
  locals.delete(fiberRef);
  return new FiberRefsImpl(locals);
});
/** @internal */
exports.get = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, fiberRef) => {
  if (!self.locals.has(fiberRef)) {
    return Option.none();
  }
  return Option.some(Arr.headNonEmpty(self.locals.get(fiberRef))[1]);
});
/** @internal */
exports.getOrDefault = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, fiberRef) => (0, Function_js_1.pipe)((0, exports.get)(self, fiberRef), Option.getOrElse(() => fiberRef.initial)));
/** @internal */
exports.updatedAs = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  fiberId,
  fiberRef,
  value
}) => {
  const oldStack = self.locals.has(fiberRef) ? self.locals.get(fiberRef) : Arr.empty();
  let newStack;
  if (Arr.isEmptyReadonlyArray(oldStack)) {
    newStack = Arr.of([fiberId, value]);
  } else {
    const [currentId, currentValue] = Arr.headNonEmpty(oldStack);
    if (Equal.equals(currentId, fiberId)) {
      if (Equal.equals(currentValue, value)) {
        return self;
      } else {
        newStack = Arr.prepend([fiberId, value])(Arr.tailNonEmpty(oldStack));
      }
    } else {
      newStack = Arr.prepend([fiberId, value])(oldStack);
    }
  }
  const locals = new Map(self.locals);
  return new FiberRefsImpl(locals.set(fiberRef, newStack));
});
//# sourceMappingURL=fiberRefs.js.map