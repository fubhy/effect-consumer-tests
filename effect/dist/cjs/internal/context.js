"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.omit = exports.pick = exports.merge = exports.getOption = exports.get = exports.unsafeGet = exports.add = exports.make = exports.empty = exports.isTag = exports.isContext = exports.makeContext = exports.ContextProto = exports.TypeId = exports.makeTag = exports.TagProto = exports.STMTypeId = exports.TagTypeId = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const effectable_js_1 = /*#__PURE__*/require("./effectable.js");
const option = /*#__PURE__*/require("./option.js");
/** @internal */
exports.TagTypeId = /*#__PURE__*/Symbol.for("effect/Context/Tag");
/** @internal */
const STMSymbolKey = "effect/STM";
/** @internal */
exports.STMTypeId = /*#__PURE__*/Symbol.for(STMSymbolKey);
/** @internal */
exports.TagProto = {
  ...effectable_js_1.EffectPrototype,
  _tag: "Tag",
  _op: "Tag",
  [exports.STMTypeId]: effectable_js_1.effectVariance,
  [exports.TagTypeId]: {
    _S: _ => _,
    _I: _ => _
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      identifier: this.identifier,
      stack: this.stack
    };
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self) {
    return self;
  },
  context(self) {
    return (0, exports.make)(this, self);
  }
};
const tagRegistry = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)("effect/Context/Tag/tagRegistry", () => new Map());
/** @internal */
const makeTag = identifier => {
  if (identifier && tagRegistry.has(identifier)) {
    return tagRegistry.get(identifier);
  }
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  const tag = Object.create(exports.TagProto);
  Object.defineProperty(tag, "stack", {
    get() {
      return creationError.stack;
    }
  });
  if (identifier) {
    tag.identifier = identifier;
    tagRegistry.set(identifier, tag);
  }
  return tag;
};
exports.makeTag = makeTag;
/** @internal */
exports.TypeId = /*#__PURE__*/Symbol.for("effect/Context");
/** @internal */
exports.ContextProto = {
  [exports.TypeId]: {
    _S: _ => _
  },
  [Equal.symbol](that) {
    if ((0, exports.isContext)(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (!that.unsafeMap.has(k) || !Equal.equals(this.unsafeMap.get(k), that.unsafeMap.get(k))) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  [Hash.symbol]() {
    return Hash.number(this.unsafeMap.size);
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  toString() {
    return (0, Inspectable_js_1.toString)(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(Inspectable_js_1.toJSON)
    };
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  }
};
/** @internal */
const makeContext = unsafeMap => {
  const context = Object.create(exports.ContextProto);
  context.unsafeMap = unsafeMap;
  return context;
};
exports.makeContext = makeContext;
const serviceNotFoundError = tag => {
  const error = new Error(`Service not found${tag.identifier ? `: ${String(tag.identifier)}` : ""}`);
  if (tag.stack) {
    const lines = tag.stack.split("\n");
    if (lines.length > 2) {
      const afterAt = lines[2].match(/at (.*)/);
      if (afterAt) {
        error.message = error.message + ` (defined at ${afterAt[1]})`;
      }
    }
  }
  if (error.stack) {
    const lines = error.stack.split("\n");
    lines.splice(1, 3);
    error.stack = lines.join("\n");
  }
  return error;
};
/** @internal */
const isContext = u => (0, Predicate_js_1.hasProperty)(u, exports.TypeId);
exports.isContext = isContext;
/** @internal */
const isTag = u => (0, Predicate_js_1.hasProperty)(u, exports.TagTypeId);
exports.isTag = isTag;
const _empty = /*#__PURE__*/(0, exports.makeContext)( /*#__PURE__*/new Map());
/** @internal */
const empty = () => _empty;
exports.empty = empty;
/** @internal */
const make = (tag, service) => (0, exports.makeContext)(new Map([[tag, service]]));
exports.make = make;
/** @internal */
exports.add = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, tag, service) => {
  const map = new Map(self.unsafeMap);
  map.set(tag, service);
  return (0, exports.makeContext)(map);
});
/** @internal */
exports.unsafeGet = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    throw serviceNotFoundError(tag);
  }
  return self.unsafeMap.get(tag);
});
/** @internal */
exports.get = exports.unsafeGet;
/** @internal */
exports.getOption = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    return option.none;
  }
  return option.some(self.unsafeMap.get(tag));
});
/** @internal */
exports.merge = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  const map = new Map(self.unsafeMap);
  for (const [tag, s] of that.unsafeMap) {
    map.set(tag, s);
  }
  return (0, exports.makeContext)(map);
});
/** @internal */
const pick = (...tags) => self => {
  const tagSet = new Set(tags);
  const newEnv = new Map();
  for (const [tag, s] of self.unsafeMap.entries()) {
    if (tagSet.has(tag)) {
      newEnv.set(tag, s);
    }
  }
  return (0, exports.makeContext)(newEnv);
};
exports.pick = pick;
/** @internal */
const omit = (...tags) => self => {
  const newEnv = new Map(self.unsafeMap);
  for (const tag of tags) {
    newEnv.delete(tag);
  }
  return (0, exports.makeContext)(newEnv);
};
exports.omit = omit;
//# sourceMappingURL=context.js.map