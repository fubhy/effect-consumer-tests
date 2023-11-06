"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = exports.updateWith = exports.update = exports.transform = exports.orElseEither = exports.hashSet = exports.hashMap = exports.chunk = exports.environment = exports.make = exports.DifferProto = exports.DifferTypeId = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Dual = /*#__PURE__*/require("../Function.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const ChunkPatch = /*#__PURE__*/require("./differ/chunkPatch.js");
const ContextPatch = /*#__PURE__*/require("./differ/contextPatch.js");
const HashMapPatch = /*#__PURE__*/require("./differ/hashMapPatch.js");
const HashSetPatch = /*#__PURE__*/require("./differ/hashSetPatch.js");
const OrPatch = /*#__PURE__*/require("./differ/orPatch.js");
/** @internal */
exports.DifferTypeId = /*#__PURE__*/Symbol.for("effect/Differ");
/** @internal */
exports.DifferProto = {
  [exports.DifferTypeId]: {
    _P: Function_js_1.identity,
    _V: Function_js_1.identity
  }
};
/** @internal */
const make = params => {
  const differ = Object.create(exports.DifferProto);
  differ.empty = params.empty;
  differ.diff = params.diff;
  differ.combine = params.combine;
  differ.patch = params.patch;
  return differ;
};
exports.make = make;
/** @internal */
const environment = () => (0, exports.make)({
  empty: ContextPatch.empty(),
  combine: (first, second) => ContextPatch.combine(second)(first),
  diff: (oldValue, newValue) => ContextPatch.diff(oldValue, newValue),
  patch: (patch, oldValue) => ContextPatch.patch(oldValue)(patch)
});
exports.environment = environment;
/** @internal */
const chunk = differ => (0, exports.make)({
  empty: ChunkPatch.empty(),
  combine: (first, second) => ChunkPatch.combine(second)(first),
  diff: (oldValue, newValue) => ChunkPatch.diff({
    oldValue,
    newValue,
    differ
  }),
  patch: (patch, oldValue) => ChunkPatch.patch(oldValue, differ)(patch)
});
exports.chunk = chunk;
/** @internal */
const hashMap = differ => (0, exports.make)({
  empty: HashMapPatch.empty(),
  combine: (first, second) => HashMapPatch.combine(second)(first),
  diff: (oldValue, newValue) => HashMapPatch.diff({
    oldValue,
    newValue,
    differ
  }),
  patch: (patch, oldValue) => HashMapPatch.patch(oldValue, differ)(patch)
});
exports.hashMap = hashMap;
/** @internal */
const hashSet = () => (0, exports.make)({
  empty: HashSetPatch.empty(),
  combine: (first, second) => HashSetPatch.combine(second)(first),
  diff: (oldValue, newValue) => HashSetPatch.diff(oldValue, newValue),
  patch: (patch, oldValue) => HashSetPatch.patch(oldValue)(patch)
});
exports.hashSet = hashSet;
/** @internal */
exports.orElseEither = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.make)({
  empty: OrPatch.empty(),
  combine: (first, second) => OrPatch.combine(first, second),
  diff: (oldValue, newValue) => OrPatch.diff({
    oldValue,
    newValue,
    left: self,
    right: that
  }),
  patch: (patch, oldValue) => OrPatch.patch(patch, {
    oldValue,
    left: self,
    right: that
  })
}));
/** @internal */
exports.transform = /*#__PURE__*/Dual.dual(2, (self, {
  toNew,
  toOld
}) => (0, exports.make)({
  empty: self.empty,
  combine: (first, second) => self.combine(first, second),
  diff: (oldValue, newValue) => self.diff(toOld(oldValue), toOld(newValue)),
  patch: (patch, oldValue) => toNew(self.patch(patch, toOld(oldValue)))
}));
/** @internal */
const update = () => (0, exports.updateWith)((_, a) => a);
exports.update = update;
/** @internal */
const updateWith = f => (0, exports.make)({
  empty: Function_js_1.identity,
  combine: (first, second) => {
    if (first === Function_js_1.identity) {
      return second;
    }
    if (second === Function_js_1.identity) {
      return first;
    }
    return a => second(first(a));
  },
  diff: (oldValue, newValue) => {
    if (Equal.equals(oldValue, newValue)) {
      return Function_js_1.identity;
    }
    return (0, Function_js_1.constant)(newValue);
  },
  patch: (patch, oldValue) => f(oldValue, patch(oldValue))
});
exports.updateWith = updateWith;
/** @internal */
exports.zip = /*#__PURE__*/Dual.dual(2, (self, that) => (0, exports.make)({
  empty: [self.empty, that.empty],
  combine: (first, second) => [self.combine(first[0], second[0]), that.combine(first[1], second[1])],
  diff: (oldValue, newValue) => [self.diff(oldValue[0], newValue[0]), that.diff(oldValue[1], newValue[1])],
  patch: (patch, oldValue) => [self.patch(patch[0], oldValue[0]), that.patch(patch[1], oldValue[1])]
}));
//# sourceMappingURL=differ.js.map