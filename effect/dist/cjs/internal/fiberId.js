"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeMake = exports.toSet = exports.toOption = exports.threadName = exports.make = exports.ids = exports.getOrElse = exports.combineAll = exports.combine = exports.isComposite = exports.isRuntime = exports.isNone = exports.isFiberId = exports.composite = exports.runtime = exports.none = exports.FiberIdTypeId = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
const Option = /*#__PURE__*/require("../Option.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
/** @internal */
const FiberIdSymbolKey = "effect/FiberId";
/** @internal */
exports.FiberIdTypeId = /*#__PURE__*/Symbol.for(FiberIdSymbolKey);
/** @internal */
const OP_NONE = "None";
/** @internal */
const OP_RUNTIME = "Runtime";
/** @internal */
const OP_COMPOSITE = "Composite";
/** @internal */
class None {
  [exports.FiberIdTypeId] = exports.FiberIdTypeId;
  _tag = OP_NONE;
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(FiberIdSymbolKey), Hash.combine(Hash.hash(this._tag)));
  }
  [Equal.symbol](that) {
    return (0, exports.isFiberId)(that) && that._tag === OP_NONE;
  }
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  }
}
/** @internal */
class Runtime {
  id;
  startTimeMillis;
  [exports.FiberIdTypeId] = exports.FiberIdTypeId;
  _tag = OP_RUNTIME;
  constructor(id, startTimeMillis) {
    this.id = id;
    this.startTimeMillis = startTimeMillis;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(FiberIdSymbolKey), Hash.combine(Hash.hash(this._tag)), Hash.combine(Hash.hash(this.id)), Hash.combine(Hash.hash(this.startTimeMillis)));
  }
  [Equal.symbol](that) {
    return (0, exports.isFiberId)(that) && that._tag === OP_RUNTIME && this.id === that.id && this.startTimeMillis === that.startTimeMillis;
  }
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  }
}
/** @internal */
class Composite {
  left;
  right;
  [exports.FiberIdTypeId] = exports.FiberIdTypeId;
  _tag = OP_COMPOSITE;
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(FiberIdSymbolKey), Hash.combine(Hash.hash(this._tag)), Hash.combine(Hash.hash(this.left)), Hash.combine(Hash.hash(this.right)));
  }
  [Equal.symbol](that) {
    return (0, exports.isFiberId)(that) && that._tag === OP_COMPOSITE && Equal.equals(this.left, that.left) && Equal.equals(this.right, that.right);
  }
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      left: (0, Inspectable_js_1.toJSON)(this.left),
      right: (0, Inspectable_js_1.toJSON)(this.right)
    };
  }
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  }
}
/** @internal */
exports.none = /*#__PURE__*/new None();
/** @internal */
const runtime = (id, startTimeMillis) => {
  return new Runtime(id, startTimeMillis);
};
exports.runtime = runtime;
/** @internal */
const composite = (left, right) => {
  return new Composite(left, right);
};
exports.composite = composite;
/** @internal */
const isFiberId = self => (0, Predicate_js_1.hasProperty)(self, exports.FiberIdTypeId);
exports.isFiberId = isFiberId;
/** @internal */
const isNone = self => {
  return self._tag === OP_NONE || (0, Function_js_1.pipe)((0, exports.toSet)(self), HashSet.every(id => (0, exports.isNone)(id)));
};
exports.isNone = isNone;
/** @internal */
const isRuntime = self => {
  return self._tag === OP_RUNTIME;
};
exports.isRuntime = isRuntime;
/** @internal */
const isComposite = self => {
  return self._tag === OP_COMPOSITE;
};
exports.isComposite = isComposite;
/** @internal */
exports.combine = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (self._tag === OP_NONE) {
    return that;
  }
  if (that._tag === OP_NONE) {
    return self;
  }
  return new Composite(self, that);
});
/** @internal */
const combineAll = fiberIds => {
  return (0, Function_js_1.pipe)(fiberIds, HashSet.reduce(exports.none, (a, b) => (0, exports.combine)(b)(a)));
};
exports.combineAll = combineAll;
/** @internal */
exports.getOrElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.isNone)(self) ? that : self);
/** @internal */
const ids = self => {
  switch (self._tag) {
    case OP_NONE:
      {
        return HashSet.empty();
      }
    case OP_RUNTIME:
      {
        return HashSet.make(self.id);
      }
    case OP_COMPOSITE:
      {
        return (0, Function_js_1.pipe)((0, exports.ids)(self.left), HashSet.union((0, exports.ids)(self.right)));
      }
  }
};
exports.ids = ids;
const _fiberCounter = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Fiber/Id/_fiberCounter"), () => MutableRef.make(0));
/** @internal */
const make = (id, startTimeSeconds) => {
  return new Runtime(id, startTimeSeconds);
};
exports.make = make;
/** @internal */
const threadName = self => {
  const identifiers = Array.from((0, exports.ids)(self)).map(n => `#${n}`).join(",");
  return identifiers;
};
exports.threadName = threadName;
/** @internal */
const toOption = self => {
  const fiberIds = (0, exports.toSet)(self);
  if (HashSet.size(fiberIds) === 0) {
    return Option.none();
  }
  let first = true;
  let acc;
  for (const fiberId of fiberIds) {
    if (first) {
      acc = fiberId;
      first = false;
    } else {
      // @ts-expect-error
      acc = (0, Function_js_1.pipe)(acc, (0, exports.combine)(fiberId));
    }
  }
  // @ts-expect-error
  return Option.some(acc);
};
exports.toOption = toOption;
/** @internal */
const toSet = self => {
  switch (self._tag) {
    case OP_NONE:
      {
        return HashSet.empty();
      }
    case OP_RUNTIME:
      {
        return HashSet.make(self);
      }
    case OP_COMPOSITE:
      {
        return (0, Function_js_1.pipe)((0, exports.toSet)(self.left), HashSet.union((0, exports.toSet)(self.right)));
      }
  }
};
exports.toSet = toSet;
/** @internal */
const unsafeMake = () => {
  const id = MutableRef.get(_fiberCounter);
  (0, Function_js_1.pipe)(_fiberCounter, MutableRef.set(id + 1));
  return new Runtime(id, new Date().getTime());
};
exports.unsafeMake = unsafeMake;
//# sourceMappingURL=fiberId.js.map