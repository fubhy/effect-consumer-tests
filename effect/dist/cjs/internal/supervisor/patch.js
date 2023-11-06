"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.differ = exports.diff = exports.patch = exports.combine = exports.empty = exports.OP_AND_THEN = exports.OP_REMOVE_SUPERVISOR = exports.OP_ADD_SUPERVISOR = exports.OP_EMPTY = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Differ = /*#__PURE__*/require("../../Differ.js");
const Equal = /*#__PURE__*/require("../../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const HashSet = /*#__PURE__*/require("../../HashSet.js");
const supervisor = /*#__PURE__*/require("../supervisor.js");
/** @internal */
exports.OP_EMPTY = "Empty";
/** @internal */
exports.OP_ADD_SUPERVISOR = "AddSupervisor";
/** @internal */
exports.OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
/** @internal */
exports.OP_AND_THEN = "AndThen";
/**
 * The empty `SupervisorPatch`.
 *
 * @internal
 */
exports.empty = {
  _tag: exports.OP_EMPTY
};
/**
 * Combines two patches to produce a new patch that describes applying the
 * updates from this patch and then the updates from the specified patch.
 *
 * @internal
 */
const combine = (self, that) => {
  return {
    _tag: exports.OP_AND_THEN,
    first: self,
    second: that
  };
};
exports.combine = combine;
/**
 * Applies a `SupervisorPatch` to a `Supervisor` to produce a new `Supervisor`.
 *
 * @internal
 */
const patch = (self, supervisor) => {
  return patchLoop(supervisor, Chunk.of(self));
};
exports.patch = patch;
/** @internal */
const patchLoop = (_supervisor, _patches) => {
  let supervisor = _supervisor;
  let patches = _patches;
  while (Chunk.isNonEmpty(patches)) {
    const head = Chunk.headNonEmpty(patches);
    switch (head._tag) {
      case exports.OP_EMPTY:
        {
          patches = Chunk.tailNonEmpty(patches);
          break;
        }
      case exports.OP_ADD_SUPERVISOR:
        {
          supervisor = supervisor.zip(head.supervisor);
          patches = Chunk.tailNonEmpty(patches);
          break;
        }
      case exports.OP_REMOVE_SUPERVISOR:
        {
          supervisor = removeSupervisor(supervisor, head.supervisor);
          patches = Chunk.tailNonEmpty(patches);
          break;
        }
      case exports.OP_AND_THEN:
        {
          patches = Chunk.prepend(head.first)(Chunk.prepend(head.second)(Chunk.tailNonEmpty(patches)));
          break;
        }
    }
  }
  return supervisor;
};
/** @internal */
const removeSupervisor = (self, that) => {
  if (Equal.equals(self, that)) {
    return supervisor.none;
  } else {
    if (supervisor.isZip(self)) {
      return removeSupervisor(self.left, that).zip(removeSupervisor(self.right, that));
    } else {
      return self;
    }
  }
};
/** @internal */
const toSet = self => {
  if (Equal.equals(self, supervisor.none)) {
    return HashSet.empty();
  } else {
    if (supervisor.isZip(self)) {
      return (0, Function_js_1.pipe)(toSet(self.left), HashSet.union(toSet(self.right)));
    } else {
      return HashSet.make(self);
    }
  }
};
/** @internal */
const diff = (oldValue, newValue) => {
  if (Equal.equals(oldValue, newValue)) {
    return exports.empty;
  }
  const oldSupervisors = toSet(oldValue);
  const newSupervisors = toSet(newValue);
  const added = (0, Function_js_1.pipe)(newSupervisors, HashSet.difference(oldSupervisors), HashSet.reduce(exports.empty, (patch, supervisor) => (0, exports.combine)(patch, {
    _tag: exports.OP_ADD_SUPERVISOR,
    supervisor
  })));
  const removed = (0, Function_js_1.pipe)(oldSupervisors, HashSet.difference(newSupervisors), HashSet.reduce(exports.empty, (patch, supervisor) => (0, exports.combine)(patch, {
    _tag: exports.OP_REMOVE_SUPERVISOR,
    supervisor
  })));
  return (0, exports.combine)(added, removed);
};
exports.diff = diff;
/** @internal */
exports.differ = /*#__PURE__*/Differ.make({
  empty: exports.empty,
  patch: exports.patch,
  combine: exports.combine,
  diff: exports.diff
});
//# sourceMappingURL=patch.js.map