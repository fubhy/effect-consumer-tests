"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMissingDataOnly = exports.reduceWithContext = exports.prefixed = exports.isUnsupported = exports.isSourceUnavailable = exports.isMissingData = exports.isInvalidData = exports.isOr = exports.isAnd = exports.isConfigError = exports.Unsupported = exports.SourceUnavailable = exports.MissingData = exports.InvalidData = exports.Or = exports.And = exports.proto = exports.ConfigErrorTypeId = void 0;
const Either = /*#__PURE__*/require("../Either.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const RA = /*#__PURE__*/require("../ReadonlyArray.js");
const OpCodes = /*#__PURE__*/require("./opCodes/configError.js");
/** @internal */
const ConfigErrorSymbolKey = "effect/ConfigError";
/** @internal */
exports.ConfigErrorTypeId = /*#__PURE__*/Symbol.for(ConfigErrorSymbolKey);
/** @internal */
exports.proto = {
  [exports.ConfigErrorTypeId]: exports.ConfigErrorTypeId
};
/** @internal */
const And = (self, that) => {
  const error = Object.create(exports.proto);
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
exports.And = And;
/** @internal */
const Or = (self, that) => {
  const error = Object.create(exports.proto);
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
exports.Or = Or;
/** @internal */
const InvalidData = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(exports.proto);
  error._tag = OpCodes.OP_INVALID_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = (0, Function_js_1.pipe)(this.path, RA.join(options.pathDelim));
      return `(Invalid data at ${path}: "${this.message}")`;
    }
  });
  return error;
};
exports.InvalidData = InvalidData;
/** @internal */
const MissingData = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(exports.proto);
  error._tag = OpCodes.OP_MISSING_DATA;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = (0, Function_js_1.pipe)(this.path, RA.join(options.pathDelim));
      return `(Missing data at ${path}: "${this.message}")`;
    }
  });
  return error;
};
exports.MissingData = MissingData;
/** @internal */
const SourceUnavailable = (path, message, cause, options = {
  pathDelim: "."
}) => {
  const error = Object.create(exports.proto);
  error._tag = OpCodes.OP_SOURCE_UNAVAILABLE;
  error.path = path;
  error.message = message;
  error.cause = cause;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = (0, Function_js_1.pipe)(this.path, RA.join(options.pathDelim));
      return `(Source unavailable at ${path}: "${this.message}")`;
    }
  });
  return error;
};
exports.SourceUnavailable = SourceUnavailable;
/** @internal */
const Unsupported = (path, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(exports.proto);
  error._tag = OpCodes.OP_UNSUPPORTED;
  error.path = path;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path = (0, Function_js_1.pipe)(this.path, RA.join(options.pathDelim));
      return `(Unsupported operation at ${path}: "${this.message}")`;
    }
  });
  return error;
};
exports.Unsupported = Unsupported;
/** @internal */
const isConfigError = u => (0, Predicate_js_1.hasProperty)(u, exports.ConfigErrorTypeId);
exports.isConfigError = isConfigError;
/** @internal */
const isAnd = self => self._tag === OpCodes.OP_AND;
exports.isAnd = isAnd;
/** @internal */
const isOr = self => self._tag === OpCodes.OP_OR;
exports.isOr = isOr;
/** @internal */
const isInvalidData = self => self._tag === OpCodes.OP_INVALID_DATA;
exports.isInvalidData = isInvalidData;
/** @internal */
const isMissingData = self => self._tag === OpCodes.OP_MISSING_DATA;
exports.isMissingData = isMissingData;
/** @internal */
const isSourceUnavailable = self => self._tag === OpCodes.OP_SOURCE_UNAVAILABLE;
exports.isSourceUnavailable = isSourceUnavailable;
/** @internal */
const isUnsupported = self => self._tag === OpCodes.OP_UNSUPPORTED;
exports.isUnsupported = isUnsupported;
/** @internal */
exports.prefixed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, prefix) => {
  switch (self._tag) {
    case OpCodes.OP_AND:
      {
        return (0, exports.And)((0, exports.prefixed)(prefix)(self.left), (0, exports.prefixed)(prefix)(self.right));
      }
    case OpCodes.OP_OR:
      {
        return (0, exports.Or)((0, exports.prefixed)(prefix)(self.left), (0, exports.prefixed)(prefix)(self.right));
      }
    case OpCodes.OP_INVALID_DATA:
      {
        return (0, exports.InvalidData)([...prefix, ...self.path], self.message);
      }
    case OpCodes.OP_MISSING_DATA:
      {
        return (0, exports.MissingData)([...prefix, ...self.path], self.message);
      }
    case OpCodes.OP_SOURCE_UNAVAILABLE:
      {
        return (0, exports.SourceUnavailable)([...prefix, ...self.path], self.message, self.cause);
      }
    case OpCodes.OP_UNSUPPORTED:
      {
        return (0, exports.Unsupported)([...prefix, ...self.path], self.message);
      }
  }
});
/** @internal */
const IsMissingDataOnlyReducer = {
  andCase: (_, left, right) => left && right,
  orCase: (_, left, right) => left && right,
  invalidDataCase: Function_js_1.constFalse,
  missingDataCase: Function_js_1.constTrue,
  sourceUnavailableCase: Function_js_1.constFalse,
  unsupportedCase: Function_js_1.constFalse
};
/** @internal */
exports.reduceWithContext = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, context, reducer) => {
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
const isMissingDataOnly = self => (0, exports.reduceWithContext)(self, void 0, IsMissingDataOnlyReducer);
exports.isMissingDataOnly = isMissingDataOnly;
//# sourceMappingURL=configError.js.map