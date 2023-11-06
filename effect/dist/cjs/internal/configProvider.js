"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.within = exports.upperCase = exports.snakeCase = exports.lowerCase = exports.kebabCase = exports.constantCase = exports.orElse = exports.unnested = exports.nested = exports.mapInputPath = exports.fromMap = exports.fromEnv = exports.fromFlat = exports.makeFlat = exports.make = exports.FlatConfigProviderTypeId = exports.configProviderTag = exports.ConfigProviderTypeId = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Either = /*#__PURE__*/require("../Either.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const number = /*#__PURE__*/require("../Number.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const RA = /*#__PURE__*/require("../ReadonlyArray.js");
const _config = /*#__PURE__*/require("./config.js");
const configError = /*#__PURE__*/require("./configError.js");
const pathPatch = /*#__PURE__*/require("./configProvider/pathPatch.js");
const core = /*#__PURE__*/require("./core.js");
const OpCodes = /*#__PURE__*/require("./opCodes/config.js");
const StringUtils = /*#__PURE__*/require("./string-utils.js");
const concat = (l, r) => [...l, ...r];
/** @internal */
const ConfigProviderSymbolKey = "effect/ConfigProvider";
/** @internal */
exports.ConfigProviderTypeId = /*#__PURE__*/Symbol.for(ConfigProviderSymbolKey);
/** @internal */
exports.configProviderTag = /*#__PURE__*/Context.Tag(exports.ConfigProviderTypeId);
/** @internal */
const FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
/** @internal */
exports.FlatConfigProviderTypeId = /*#__PURE__*/Symbol.for(FlatConfigProviderSymbolKey);
/** @internal */
const make = options => ({
  [exports.ConfigProviderTypeId]: exports.ConfigProviderTypeId,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  ...options
});
exports.make = make;
/** @internal */
const makeFlat = options => ({
  [exports.FlatConfigProviderTypeId]: exports.FlatConfigProviderTypeId,
  patch: options.patch,
  load: (path, config, split = true) => options.load(path, config, split),
  enumerateChildren: options.enumerateChildren
});
exports.makeFlat = makeFlat;
/** @internal */
const fromFlat = flat => (0, exports.make)({
  load: config => core.flatMap(fromFlatLoop(flat, RA.empty(), config, false), chunk => Option.match(RA.head(chunk), {
    onNone: () => core.fail(configError.MissingData(RA.empty(), `Expected a single value having structure: ${config}`)),
    onSome: core.succeed
  })),
  flattened: flat
});
exports.fromFlat = fromFlat;
/** @internal */
const fromEnv = (config = {}) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, config);
  const makePathString = path => (0, Function_js_1.pipe)(path, RA.join(pathDelim));
  const unmakePathString = pathString => pathString.split(pathDelim);
  const getEnv = () => typeof process !== "undefined" && "env" in process && typeof process.env === "object" ? process.env : {};
  const load = (path, primitive, split = true) => {
    const pathString = makePathString(path);
    const current = getEnv();
    const valueOpt = pathString in current ? Option.some(current[pathString]) : Option.none();
    return (0, Function_js_1.pipe)(valueOpt, core.mapError(() => configError.MissingData(path, `Expected ${pathString} to exist in the process context`)), core.flatMap(value => parsePrimitive(value, path, primitive, seqDelim, split)));
  };
  const enumerateChildren = path => core.sync(() => {
    const current = getEnv();
    const keys = Object.keys(current);
    const keyPaths = Array.from(keys).map(value => unmakePathString(value.toUpperCase()));
    const filteredKeyPaths = keyPaths.filter(keyPath => {
      for (let i = 0; i < path.length; i++) {
        const pathComponent = (0, Function_js_1.pipe)(path, RA.unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === undefined || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap(keyPath => keyPath.slice(path.length, path.length + 1));
    return HashSet.fromIterable(filteredKeyPaths);
  });
  return (0, exports.fromFlat)((0, exports.makeFlat)({
    load,
    enumerateChildren,
    patch: pathPatch.empty
  }));
};
exports.fromEnv = fromEnv;
/** @internal */
const fromMap = (map, config = {}) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({
    seqDelim: ",",
    pathDelim: "."
  }, config);
  const makePathString = path => (0, Function_js_1.pipe)(path, RA.join(pathDelim));
  const unmakePathString = pathString => pathString.split(pathDelim);
  const mapWithIndexSplit = splitIndexInKeys(map, str => Array.from(unmakePathString(str)), makePathString);
  const load = (path, primitive, split = true) => {
    const pathString = makePathString(path);
    const valueOpt = mapWithIndexSplit.has(pathString) ? Option.some(mapWithIndexSplit.get(pathString)) : Option.none();
    return (0, Function_js_1.pipe)(valueOpt, core.mapError(() => configError.MissingData(path, `Expected ${pathString} to exist in the provided map`)), core.flatMap(value => parsePrimitive(value, path, primitive, seqDelim, split)));
  };
  const enumerateChildren = path => core.sync(() => {
    const keyPaths = Array.from(mapWithIndexSplit.keys()).map(unmakePathString);
    const filteredKeyPaths = keyPaths.filter(keyPath => {
      for (let i = 0; i < path.length; i++) {
        const pathComponent = (0, Function_js_1.pipe)(path, RA.unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === undefined || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap(keyPath => keyPath.slice(path.length, path.length + 1));
    return HashSet.fromIterable(filteredKeyPaths);
  });
  return (0, exports.fromFlat)((0, exports.makeFlat)({
    load,
    enumerateChildren,
    patch: pathPatch.empty
  }));
};
exports.fromMap = fromMap;
const extend = (leftDef, rightDef, left, right) => {
  const leftPad = RA.unfold(left.length, index => index >= right.length ? Option.none() : Option.some([leftDef(index), index + 1]));
  const rightPad = RA.unfold(right.length, index => index >= left.length ? Option.none() : Option.some([rightDef(index), index + 1]));
  const leftExtension = concat(left, leftPad);
  const rightExtension = concat(right, rightPad);
  return [leftExtension, rightExtension];
};
const fromFlatLoop = (flat, prefix, config, split) => {
  const op = config;
  switch (op._tag) {
    case OpCodes.OP_CONSTANT:
      {
        return core.succeed(RA.of(op.value));
      }
    case OpCodes.OP_DESCRIBED:
      {
        return core.suspend(() => fromFlatLoop(flat, prefix, op.config, split));
      }
    case OpCodes.OP_FAIL:
      {
        return core.fail(configError.MissingData(prefix, op.message));
      }
    case OpCodes.OP_FALLBACK:
      {
        return (0, Function_js_1.pipe)(core.suspend(() => fromFlatLoop(flat, prefix, op.first, split)), core.catchAll(error1 => {
          if (op.condition(error1)) {
            return (0, Function_js_1.pipe)(fromFlatLoop(flat, prefix, op.second, split), core.catchAll(error2 => core.fail(configError.Or(error1, error2))));
          }
          return core.fail(error1);
        }));
      }
    case OpCodes.OP_LAZY:
      {
        return core.suspend(() => fromFlatLoop(flat, prefix, op.config(), split));
      }
    case OpCodes.OP_MAP_OR_FAIL:
      {
        return core.suspend(() => (0, Function_js_1.pipe)(fromFlatLoop(flat, prefix, op.original, split), core.flatMap(core.forEachSequential(a => (0, Function_js_1.pipe)(op.mapOrFail(a), core.mapError(configError.prefixed(prefix)))))));
      }
    case OpCodes.OP_NESTED:
      {
        return core.suspend(() => fromFlatLoop(flat, concat(prefix, RA.of(op.name)), op.config, split));
      }
    case OpCodes.OP_PRIMITIVE:
      {
        return (0, Function_js_1.pipe)(pathPatch.patch(prefix, flat.patch), core.flatMap(prefix => (0, Function_js_1.pipe)(flat.load(prefix, op, split), core.flatMap(values => {
          if (values.length === 0) {
            const name = (0, Function_js_1.pipe)(RA.last(prefix), Option.getOrElse(() => "<n/a>"));
            return core.fail(_config.missingError(name));
          }
          return core.succeed(values);
        }))));
      }
    case OpCodes.OP_SEQUENCE:
      {
        return (0, Function_js_1.pipe)(pathPatch.patch(prefix, flat.patch), core.flatMap(patchedPrefix => (0, Function_js_1.pipe)(flat.enumerateChildren(patchedPrefix), core.flatMap(indicesFrom), core.flatMap(indices => {
          if (indices.length === 0) {
            return core.suspend(() => core.map(fromFlatLoop(flat, patchedPrefix, op.config, true), RA.of));
          }
          return (0, Function_js_1.pipe)(core.forEachSequential(indices, index => fromFlatLoop(flat, RA.append(prefix, `[${index}]`), op.config, true)), core.map(chunkChunk => {
            const flattened = RA.flatten(chunkChunk);
            if (flattened.length === 0) {
              return RA.of(RA.empty());
            }
            return RA.of(flattened);
          }));
        }))));
      }
    case OpCodes.OP_HASHMAP:
      {
        return core.suspend(() => (0, Function_js_1.pipe)(pathPatch.patch(prefix, flat.patch), core.flatMap(prefix => (0, Function_js_1.pipe)(flat.enumerateChildren(prefix), core.flatMap(keys => {
          return (0, Function_js_1.pipe)(keys, core.forEachSequential(key => fromFlatLoop(flat, concat(prefix, RA.of(key)), op.valueConfig, split)), core.map(values => {
            if (values.length === 0) {
              return RA.of(HashMap.empty());
            }
            const matrix = values.map(x => Array.from(x));
            return (0, Function_js_1.pipe)(transpose(matrix), RA.map(values => HashMap.fromIterable(RA.zip(RA.fromIterable(keys), values))));
          }));
        })))));
      }
    case OpCodes.OP_ZIP_WITH:
      {
        return core.suspend(() => (0, Function_js_1.pipe)(fromFlatLoop(flat, prefix, op.left, split), core.either, core.flatMap(left => (0, Function_js_1.pipe)(fromFlatLoop(flat, prefix, op.right, split), core.either, core.flatMap(right => {
          if (Either.isLeft(left) && Either.isLeft(right)) {
            return core.fail(configError.And(left.left, right.left));
          }
          if (Either.isLeft(left) && Either.isRight(right)) {
            return core.fail(left.left);
          }
          if (Either.isRight(left) && Either.isLeft(right)) {
            return core.fail(right.left);
          }
          if (Either.isRight(left) && Either.isRight(right)) {
            const path = (0, Function_js_1.pipe)(prefix, RA.join("."));
            const fail = fromFlatLoopFail(prefix, path);
            const [lefts, rights] = extend(fail, fail, (0, Function_js_1.pipe)(left.right, RA.map(Either.right)), (0, Function_js_1.pipe)(right.right, RA.map(Either.right)));
            return (0, Function_js_1.pipe)(lefts, RA.zip(rights), core.forEachSequential(([left, right]) => (0, Function_js_1.pipe)(core.zip(left, right), core.map(([left, right]) => op.zip(left, right)))));
          }
          throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/io/issues");
        })))));
      }
  }
};
const fromFlatLoopFail = (prefix, path) => index => Either.left(configError.MissingData(prefix, `The element at index ${index} in a sequence at path "${path}" was missing`));
/** @internal */
exports.mapInputPath = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.fromFlat)(mapInputPathFlat(self.flattened, f)));
const mapInputPathFlat = (self, f) => (0, exports.makeFlat)({
  load: (path, config, split = true) => self.load(path, config, split),
  enumerateChildren: path => self.enumerateChildren(path),
  patch: pathPatch.mapName(self.patch, f)
});
/** @internal */
exports.nested = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, name) => (0, exports.fromFlat)((0, exports.makeFlat)({
  load: (path, config) => self.flattened.load(path, config, true),
  enumerateChildren: path => self.flattened.enumerateChildren(path),
  patch: pathPatch.nested(self.flattened.patch, name)
})));
/** @internal */
exports.unnested = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, name) => (0, exports.fromFlat)((0, exports.makeFlat)({
  load: (path, config) => self.flattened.load(path, config, true),
  enumerateChildren: path => self.flattened.enumerateChildren(path),
  patch: pathPatch.unnested(self.flattened.patch, name)
})));
/** @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.fromFlat)(orElseFlat(self.flattened, () => that().flattened)));
const orElseFlat = (self, that) => (0, exports.makeFlat)({
  load: (path, config, split) => (0, Function_js_1.pipe)(pathPatch.patch(path, self.patch), core.flatMap(patch => self.load(patch, config, split)), core.catchAll(error1 => (0, Function_js_1.pipe)(core.sync(that), core.flatMap(that => (0, Function_js_1.pipe)(pathPatch.patch(path, that.patch), core.flatMap(patch => that.load(patch, config, split)), core.catchAll(error2 => core.fail(configError.Or(error1, error2)))))))),
  enumerateChildren: path => (0, Function_js_1.pipe)(pathPatch.patch(path, self.patch), core.flatMap(patch => self.enumerateChildren(patch)), core.either, core.flatMap(left => (0, Function_js_1.pipe)(core.sync(that), core.flatMap(that => (0, Function_js_1.pipe)(pathPatch.patch(path, that.patch), core.flatMap(patch => that.enumerateChildren(patch)), core.either, core.flatMap(right => {
    if (Either.isLeft(left) && Either.isLeft(right)) {
      return core.fail(configError.And(left.left, right.left));
    }
    if (Either.isLeft(left) && Either.isRight(right)) {
      return core.succeed(right.right);
    }
    if (Either.isRight(left) && Either.isLeft(right)) {
      return core.succeed(left.right);
    }
    if (Either.isRight(left) && Either.isRight(right)) {
      return core.succeed((0, Function_js_1.pipe)(left.right, HashSet.union(right.right)));
    }
    throw new Error("BUG: ConfigProvider.orElseFlat - please report an issue at https://github.com/Effect-TS/io/issues");
  })))))),
  patch: pathPatch.empty
});
/** @internal */
const constantCase = self => (0, exports.mapInputPath)(self, StringUtils.constantCase);
exports.constantCase = constantCase;
/** @internal */
const kebabCase = self => (0, exports.mapInputPath)(self, StringUtils.kebabCase);
exports.kebabCase = kebabCase;
/** @internal */
const lowerCase = self => (0, exports.mapInputPath)(self, StringUtils.lowerCase);
exports.lowerCase = lowerCase;
/** @internal */
const snakeCase = self => (0, exports.mapInputPath)(self, StringUtils.snakeCase);
exports.snakeCase = snakeCase;
/** @internal */
const upperCase = self => (0, exports.mapInputPath)(self, StringUtils.upperCase);
exports.upperCase = upperCase;
/** @internal */
exports.within = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, path, f) => {
  const unnest = RA.reduce(path, self, (provider, name) => (0, exports.unnested)(provider, name));
  const nest = RA.reduceRight(path, f(unnest), (provider, name) => (0, exports.nested)(provider, name));
  return (0, exports.orElse)(nest, () => self);
});
const splitPathString = (text, delim) => {
  const split = text.split(new RegExp(`\\s*${escapeRegex(delim)}\\s*`));
  return split;
};
const parsePrimitive = (text, path, primitive, delimiter, split) => {
  if (!split) {
    return (0, Function_js_1.pipe)(primitive.parse(text), core.map(RA.of), core.mapError(configError.prefixed(path)));
  }
  return (0, Function_js_1.pipe)(splitPathString(text, delimiter), core.forEachSequential(char => primitive.parse(char.trim())), core.mapError(configError.prefixed(path)));
};
const transpose = array => {
  return Object.keys(array[0]).map(column => array.map(row => row[column]));
};
const escapeRegex = string => {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
};
const indicesFrom = quotedIndices => (0, Function_js_1.pipe)(core.forEachSequential(quotedIndices, parseQuotedIndex), core.mapBoth({
  onFailure: () => RA.empty(),
  onSuccess: RA.sort(number.Order)
}), core.either, core.map(Either.merge));
const STR_INDEX_REGEX = /(^.+)(\[(\d+)\])$/;
const QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
const parseQuotedIndex = str => {
  const match = str.match(QUOTED_INDEX_REGEX);
  if (match !== null) {
    const matchedIndex = match[2];
    return (0, Function_js_1.pipe)(matchedIndex !== undefined && matchedIndex.length > 0 ? Option.some(matchedIndex) : Option.none(), Option.flatMap(parseInteger));
  }
  return Option.none();
};
const splitIndexInKeys = (map, unmakePathString, makePathString) => {
  const newMap = new Map();
  for (const [pathString, value] of map) {
    const keyWithIndex = (0, Function_js_1.pipe)(unmakePathString(pathString), RA.flatMap(key => Option.match(splitIndexFrom(key), {
      onNone: () => RA.of(key),
      onSome: ([key, index]) => RA.make(key, `[${index}]`)
    })));
    newMap.set(makePathString(keyWithIndex), value);
  }
  return newMap;
};
const splitIndexFrom = key => {
  const match = key.match(STR_INDEX_REGEX);
  if (match !== null) {
    const matchedString = match[1];
    const matchedIndex = match[3];
    const optionalString = matchedString !== undefined && matchedString.length > 0 ? Option.some(matchedString) : Option.none();
    const optionalIndex = (0, Function_js_1.pipe)(matchedIndex !== undefined && matchedIndex.length > 0 ? Option.some(matchedIndex) : Option.none(), Option.flatMap(parseInteger));
    return Option.all([optionalString, optionalIndex]);
  }
  return Option.none();
};
const parseInteger = str => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? Option.none() : Option.some(parsedIndex);
};
//# sourceMappingURL=configProvider.js.map