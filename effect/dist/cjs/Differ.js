"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = exports.updateWith = exports.update = exports.transform = exports.orElseEither = exports.hashSet = exports.hashMap = exports.chunk = exports.environment = exports.make = exports.patch = exports.combine = exports.diff = exports.empty = exports.TypeId = void 0;
const Dual = /*#__PURE__*/require("./Function.js");
const internal = /*#__PURE__*/require("./internal/differ.js");
const ChunkPatch = /*#__PURE__*/require("./internal/differ/chunkPatch.js");
const ContextPatch = /*#__PURE__*/require("./internal/differ/contextPatch.js");
const HashMapPatch = /*#__PURE__*/require("./internal/differ/hashMapPatch.js");
const HashSetPatch = /*#__PURE__*/require("./internal/differ/hashSetPatch.js");
const OrPatch = /*#__PURE__*/require("./internal/differ/orPatch.js");
/**
 * @since 2.0.0
 * @category symbol
 */
exports.TypeId = internal.DifferTypeId;
const ChunkPatchTypeId = ChunkPatch.ChunkPatchTypeId;
const ContextPatchTypeId = ContextPatch.ContextPatchTypeId;
const HashMapPatchTypeId = HashMapPatch.HashMapPatchTypeId;
const HashSetPatchTypeId = HashSetPatch.HashSetPatchTypeId;
const OrPatchTypeId = OrPatch.OrPatchTypeId;
/**
 * An empty patch that describes no changes.
 *
 * @since 2.0.0
 * @category patch
 */
const empty = self => self.empty;
exports.empty = empty;
/**
 * @since 2.0.0
 * @category patch
 */
exports.diff = /*#__PURE__*/Dual.dual(3, (self, oldValue, newValue) => self.diff(oldValue, newValue));
/**
 * Combines two patches to produce a new patch that describes the updates of
 * the first patch and then the updates of the second patch. The combine
 * operation should be associative. In addition, if the combine operation is
 * commutative then joining multiple fibers concurrently will result in
 * deterministic `FiberRef` values.
 *
 * @since 2.0.0
 * @category patch
 */
exports.combine = /*#__PURE__*/Dual.dual(3, (self, first, second) => self.combine(first, second));
/**
 * Applies a patch to an old value to produce a new value that is equal to the
 * old value with the updates described by the patch.
 *
 * @since 2.0.0
 * @category patch
 */
exports.patch = /*#__PURE__*/Dual.dual(3, (self, patch, oldValue) => self.patch(patch, oldValue));
/**
 * Constructs a new `Differ`.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * Constructs a differ that knows how to diff `Env` values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.environment = internal.environment;
/**
 * Constructs a differ that knows how to diff a `Chunk` of values given a
 * differ that knows how to diff the values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.chunk = internal.chunk;
/**
 * Constructs a differ that knows how to diff a `HashMap` of keys and values given
 * a differ that knows how to diff the values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.hashMap = internal.hashMap;
/**
 * Constructs a differ that knows how to diff a `HashSet` of values.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.hashSet = internal.hashSet;
/**
 * Combines this differ and the specified differ to produce a differ that
 * knows how to diff the sum of their values.
 *
 * @since 2.0.0
 */
exports.orElseEither = internal.orElseEither;
/**
 * Transforms the type of values that this differ knows how to differ using
 * the specified functions that map the new and old value types to each other.
 *
 * @since 2.0.0
 */
exports.transform = internal.transform;
/**
 * Constructs a differ that just diffs two values by returning a function that
 * sets the value to the new value. This differ does not support combining
 * multiple updates to the value compositionally and should only be used when
 * there is no compositional way to update them.
 *
 * @since 2.0.0
 */
exports.update = internal.update;
/**
 * A variant of `update` that allows specifying the function that will be used
 * to combine old values with new values.
 *
 * @since 2.0.0
 */
exports.updateWith = internal.updateWith;
/**
 * Combines this differ and the specified differ to produce a new differ that
 * knows how to diff the product of their values.
 *
 * @since 2.0.0
 */
exports.zip = internal.zip;
//# sourceMappingURL=Differ.js.map