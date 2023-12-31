import * as Equal from "../Equal.js";
import { dual } from "../Function.js";
import { globalValue } from "../GlobalValue.js";
import * as Hash from "../Hash.js";
import { NodeInspectSymbol, toJSON, toString } from "../Inspectable.js";
import { pipeArguments } from "../Pipeable.js";
import { hasProperty } from "../Predicate.js";
import { EffectPrototype, effectVariance } from "./effectable.js";
import * as option from "./option.js";
/** @internal */
export const TagTypeId = /*#__PURE__*/Symbol.for("effect/Context/Tag");
/** @internal */
const STMSymbolKey = "effect/STM";
/** @internal */
export const STMTypeId = /*#__PURE__*/Symbol.for(STMSymbolKey);
/** @internal */
export const TagProto = {
  ...EffectPrototype,
  _tag: "Tag",
  _op: "Tag",
  [STMTypeId]: effectVariance,
  [TagTypeId]: {
    _S: _ => _,
    _I: _ => _
  },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      identifier: this.identifier,
      stack: this.stack
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self) {
    return self;
  },
  context(self) {
    return make(this, self);
  }
};
const tagRegistry = /*#__PURE__*/globalValue("effect/Context/Tag/tagRegistry", () => new Map());
/** @internal */
export const makeTag = identifier => {
  if (identifier && tagRegistry.has(identifier)) {
    return tagRegistry.get(identifier);
  }
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  const tag = Object.create(TagProto);
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
/** @internal */
export const TypeId = /*#__PURE__*/Symbol.for("effect/Context");
/** @internal */
export const ContextProto = {
  [TypeId]: {
    _S: _ => _
  },
  [Equal.symbol](that) {
    if (isContext(that)) {
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
    return pipeArguments(this, arguments);
  },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
/** @internal */
export const makeContext = unsafeMap => {
  const context = Object.create(ContextProto);
  context.unsafeMap = unsafeMap;
  return context;
};
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
export const isContext = u => hasProperty(u, TypeId);
/** @internal */
export const isTag = u => hasProperty(u, TagTypeId);
const _empty = /*#__PURE__*/makeContext( /*#__PURE__*/new Map());
/** @internal */
export const empty = () => _empty;
/** @internal */
export const make = (tag, service) => makeContext(new Map([[tag, service]]));
/** @internal */
export const add = /*#__PURE__*/dual(3, (self, tag, service) => {
  const map = new Map(self.unsafeMap);
  map.set(tag, service);
  return makeContext(map);
});
/** @internal */
export const unsafeGet = /*#__PURE__*/dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    throw serviceNotFoundError(tag);
  }
  return self.unsafeMap.get(tag);
});
/** @internal */
export const get = unsafeGet;
/** @internal */
export const getOption = /*#__PURE__*/dual(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    return option.none;
  }
  return option.some(self.unsafeMap.get(tag));
});
/** @internal */
export const merge = /*#__PURE__*/dual(2, (self, that) => {
  const map = new Map(self.unsafeMap);
  for (const [tag, s] of that.unsafeMap) {
    map.set(tag, s);
  }
  return makeContext(map);
});
/** @internal */
export const pick = (...tags) => self => {
  const tagSet = new Set(tags);
  const newEnv = new Map();
  for (const [tag, s] of self.unsafeMap.entries()) {
    if (tagSet.has(tag)) {
      newEnv.set(tag, s);
    }
  }
  return makeContext(newEnv);
};
/** @internal */
export const omit = (...tags) => self => {
  const newEnv = new Map(self.unsafeMap);
  for (const tag of tags) {
    newEnv.delete(tag);
  }
  return makeContext(newEnv);
};
//# sourceMappingURL=context.js.map