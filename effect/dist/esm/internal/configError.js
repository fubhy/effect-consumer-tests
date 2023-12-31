import * as Either from "../Either.js";
import { constFalse, constTrue, dual, pipe } from "../Function.js";
import { hasProperty } from "../Predicate.js";
import * as RA from "../ReadonlyArray.js";
import * as OpCodes from "./opCodes/configError.js";
/** @internal */
const ConfigErrorSymbolKey = "effect/ConfigError";
/** @internal */
export const ConfigErrorTypeId = /*#__PURE__*/Symbol.for(ConfigErrorSymbolKey);
/** @internal */
export const proto = {
  [ConfigErrorTypeId]: ConfigErrorTypeId
};
/** @internal */
export const And = (self, that) => {
  const error = Object.create(proto);
  error._tag = OpCodes.OP_AND;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} and ${this.right}`;
    }
  });
  return error;
};
/** @internal */
export const Or = (self, that) => {
  const error = Object.create(proto);
  error._tag = OpCodes.OP_OR;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} or ${this.right}`;
    }
  });
  return error;
};
/** @internal */
export const InvalidData = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto);
  error._tag = OpCodes.OP_INVALID_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, RA.join(options.pathDelim));
      return `(Invalid data at ${path}: "${this.message}")`;
    }
  });
  return error;
};
/** @internal */
export const MissingData = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto);
  error._tag = OpCodes.OP_MISSING_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, RA.join(options.pathDelim));
      return `(Missing data at ${path}: "${this.message}")`;
    }
  });
  return error;
};
/** @internal */
export const SourceUnavailable = (path, message, cause, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto);
  error._tag = OpCodes.OP_SOURCE_UNAVAILABLE;
  error.path = path;
  error.message = message;
  error.cause = cause;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, RA.join(options.pathDelim));
      return `(Source unavailable at ${path}: "${this.message}")`;
    }
  });
  return error;
};
/** @internal */
export const Unsupported = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto);
  error._tag = OpCodes.OP_UNSUPPORTED;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = pipe(this.path, RA.join(options.pathDelim));
      return `(Unsupported operation at ${path}: "${this.message}")`;
    }
  });
  return error;
};
/** @internal */
export const isConfigError = u => hasProperty(u, ConfigErrorTypeId);
/** @internal */
export const isAnd = self => self._tag === OpCodes.OP_AND;
/** @internal */
export const isOr = self => self._tag === OpCodes.OP_OR;
/** @internal */
export const isInvalidData = self => self._tag === OpCodes.OP_INVALID_DATA;
/** @internal */
export const isMissingData = self => self._tag === OpCodes.OP_MISSING_DATA;
/** @internal */
export const isSourceUnavailable = self => self._tag === OpCodes.OP_SOURCE_UNAVAILABLE;
/** @internal */
export const isUnsupported = self => self._tag === OpCodes.OP_UNSUPPORTED;
/** @internal */
export const prefixed = /*#__PURE__*/dual(2, (self, prefix) => {
  switch (self._tag) {
    case OpCodes.OP_AND:
      {
        return And(prefixed(prefix)(self.left), prefixed(prefix)(self.right));
      }
    case OpCodes.OP_OR:
      {
        return Or(prefixed(prefix)(self.left), prefixed(prefix)(self.right));
      }
    case OpCodes.OP_INVALID_DATA:
      {
        return InvalidData([...prefix, ...self.path], self.message);
      }
    case OpCodes.OP_MISSING_DATA:
      {
        return MissingData([...prefix, ...self.path], self.message);
      }
    case OpCodes.OP_SOURCE_UNAVAILABLE:
      {
        return SourceUnavailable([...prefix, ...self.path], self.message, self.cause);
      }
    case OpCodes.OP_UNSUPPORTED:
      {
        return Unsupported([...prefix, ...self.path], self.message);
      }
  }
});
/** @internal */
const IsMissingDataOnlyReducer = {
  andCase: (_, left, right) => left && right,
  orCase: (_, left, right) => left && right,
  invalidDataCase: constFalse,
  missingDataCase: constTrue,
  sourceUnavailableCase: constFalse,
  unsupportedCase: constFalse
};
/** @internal */
export const reduceWithContext = /*#__PURE__*/dual(3, (self, context, reducer) => {
  const input = [self];
  const output = [];
  while (input.length > 0) {
    const error = input.pop();
    switch (error._tag) {
      case OpCodes.OP_AND:
        {
          input.push(error.right);
          input.push(error.left);
          output.push(Either.left({
            _tag: "AndCase"
          }));
          break;
        }
      case OpCodes.OP_OR:
        {
          input.push(error.right);
          input.push(error.left);
          output.push(Either.left({
            _tag: "OrCase"
          }));
          break;
        }
      case OpCodes.OP_INVALID_DATA:
        {
          output.push(Either.right(reducer.invalidDataCase(context, error.path, error.message)));
          break;
        }
      case OpCodes.OP_MISSING_DATA:
        {
          output.push(Either.right(reducer.missingDataCase(context, error.path, error.message)));
          break;
        }
      case OpCodes.OP_SOURCE_UNAVAILABLE:
        {
          output.push(Either.right(reducer.sourceUnavailableCase(context, error.path, error.message, error.cause)));
          break;
        }
      case OpCodes.OP_UNSUPPORTED:
        {
          output.push(Either.right(reducer.unsupportedCase(context, error.path, error.message)));
          break;
        }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either = output.pop();
    switch (either._tag) {
      case "Left":
        {
          switch (either.left._tag) {
            case "AndCase":
              {
                const left = accumulator.pop();
                const right = accumulator.pop();
                const value = reducer.andCase(context, left, right);
                accumulator.push(value);
                break;
              }
            case "OrCase":
              {
                const left = accumulator.pop();
                const right = accumulator.pop();
                const value = reducer.orCase(context, left, right);
                accumulator.push(value);
                break;
              }
          }
          break;
        }
      case "Right":
        {
          accumulator.push(either.right);
          break;
        }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: ConfigError.reduceWithContext - please report an issue at https://github.com/Effect-TS/io/issues");
  }
  return accumulator.pop();
});
/** @internal */
export const isMissingDataOnly = self => reduceWithContext(self, void 0, IsMissingDataOnlyReducer);
//# sourceMappingURL=configError.js.map