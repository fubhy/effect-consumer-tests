import * as Context from "../Context.js";
import * as Either from "../Either.js";
import { dual, pipe } from "../Function.js";
import * as HashMap from "../HashMap.js";
import * as HashSet from "../HashSet.js";
import * as number from "../Number.js";
import * as Option from "../Option.js";
import { pipeArguments } from "../Pipeable.js";
import * as RA from "../ReadonlyArray.js";
import * as _config from "./config.js";
import * as configError from "./configError.js";
import * as pathPatch from "./configProvider/pathPatch.js";
import * as core from "./core.js";
import * as OpCodes from "./opCodes/config.js";
import * as StringUtils from "./string-utils.js";
const concat = (l, r) => [...l, ...r];
/** @internal */
const ConfigProviderSymbolKey = "effect/ConfigProvider";
/** @internal */
export const ConfigProviderTypeId = /*#__PURE__*/Symbol.for(ConfigProviderSymbolKey);
/** @internal */
export const configProviderTag = /*#__PURE__*/Context.Tag(ConfigProviderTypeId);
/** @internal */
const FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
/** @internal */
export const FlatConfigProviderTypeId = /*#__PURE__*/Symbol.for(FlatConfigProviderSymbolKey);
/** @internal */
export const make = options => ({
  [ConfigProviderTypeId]: ConfigProviderTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
/** @internal */
export const makeFlat = options => ({
  [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
  patch: options.patch,
  load: (path, config, split = true) => options.load(path, config, split),
  enumerateChildren: options.enumerateChildren
});
/** @internal */
export const fromFlat = flat => make({
  load: config => core.flatMap(fromFlatLoop(flat, RA.empty(), config, false), chunk => Option.match(RA.head(chunk), {
    onNone: () => core.fail(configError.MissingData(RA.empty(), `Expected a single value having structure: ${config}`)),
    onSome: core.succeed
  })),
  flattened: flat
});
/** @internal */
export const fromEnv = (config = {}) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, config);
  const makePathString = path => pipe(path, RA.join(pathDelim));
  const unmakePathString = pathString => pathString.split(pathDelim);
  const getEnv = () => typeof process !== "undefined" && "env" in process && typeof process.env === "object" ? process.env : {};
  const load = (path, primitive, split = true) => {
    const pathString = makePathString(path);
    const current = getEnv();
    const valueOpt = pathString in current ? Option.some(current[pathString]) : Option.none();
    return pipe(valueOpt, core.mapError(() => configError.MissingData(path, `Expected ${pathString} to exist in the process context`)), core.flatMap(value => parsePrimitive(value, path, primitive, seqDelim, split)));
  };
  const enumerateChildren = path => core.sync(() => {
    const current = getEnv();
    const keys = Object.keys(current);
    const keyPaths = Array.from(keys).map(value => unmakePathString(value.toUpperCase()));
    const filteredKeyPaths = keyPaths.filter(keyPath => {
      for (let i = 0; i < path.length; i++) {
        const pathComponent = pipe(path, RA.unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === undefined || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap(keyPath => keyPath.slice(path.length, path.length + 1));
    return HashSet.fromIterable(filteredKeyPaths);
  });
  return fromFlat(makeFlat({
    load,
    enumerateChildren,
    patch: pathPatch.empty
  }));
};
/** @internal */
export const fromMap = (map, config = {}) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({
    seqDelim: ",",
    pathDelim: "."
  }, config);
  const makePathString = path => pipe(path, RA.join(pathDelim));
  const unmakePathString = pathString => pathString.split(pathDelim);
  const mapWithIndexSplit = splitIndexInKeys(map, str => Array.from(unmakePathString(str)), makePathString);
  const load = (path, primitive, split = true) => {
    const pathString = makePathString(path);
    const valueOpt = mapWithIndexSplit.has(pathString) ? Option.some(mapWithIndexSplit.get(pathString)) : Option.none();
    return pipe(valueOpt, core.mapError(() => configError.MissingData(path, `Expected ${pathString} to exist in the provided map`)), core.flatMap(value => parsePrimitive(value, path, primitive, seqDelim, split)));
  };
  const enumerateChildren = path => core.sync(() => {
    const keyPaths = Array.from(mapWithIndexSplit.keys()).map(unmakePathString);
    const filteredKeyPaths = keyPaths.filter(keyPath => {
      for (let i = 0; i < path.length; i++) {
        const pathComponent = pipe(path, RA.unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === undefined || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap(keyPath => keyPath.slice(path.length, path.length + 1));
    return HashSet.fromIterable(filteredKeyPaths);
  });
  return fromFlat(makeFlat({
    load,
    enumerateChildren,
    patch: pathPatch.empty
  }));
};
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
        return pipe(core.suspend(() => fromFlatLoop(flat, prefix, op.first, split)), core.catchAll(error1 => {
          if (op.condition(error1)) {
            return pipe(fromFlatLoop(flat, prefix, op.second, split), core.catchAll(error2 => core.fail(configError.Or(error1, error2))));
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
        return core.suspend(() => pipe(fromFlatLoop(flat, prefix, op.original, split), core.flatMap(core.forEachSequential(a => pipe(op.mapOrFail(a), core.mapError(configError.prefixed(prefix)))))));
      }
    case OpCodes.OP_NESTED:
      {
        return core.suspend(() => fromFlatLoop(flat, concat(prefix, RA.of(op.name)), op.config, split));
      }
    case OpCodes.OP_PRIMITIVE:
      {
        return pipe(pathPatch.patch(prefix, flat.patch), core.flatMap(prefix => pipe(flat.load(prefix, op, split), core.flatMap(values => {
          if (values.length === 0) {
            const name = pipe(RA.last(prefix), Option.getOrElse(() => "<n/a>"));
            return core.fail(_config.missingError(name));
          }
          return core.succeed(values);
        }))));
      }
    case OpCodes.OP_SEQUENCE:
      {
        return pipe(pathPatch.patch(prefix, flat.patch), core.flatMap(patchedPrefix => pipe(flat.enumerateChildren(patchedPrefix), core.flatMap(indicesFrom), core.flatMap(indices => {
          if (indices.length === 0) {
            return core.suspend(() => core.map(fromFlatLoop(flat, patchedPrefix, op.config, true), RA.of));
          }
          return pipe(core.forEachSequential(indices, index => fromFlatLoop(flat, RA.append(prefix, `[${index}]`), op.config, true)), core.map(chunkChunk => {
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
        return core.suspend(() => pipe(pathPatch.patch(prefix, flat.patch), core.flatMap(prefix => pipe(flat.enumerateChildren(prefix), core.flatMap(keys => {
          return pipe(keys, core.forEachSequential(key => fromFlatLoop(flat, concat(prefix, RA.of(key)), op.valueConfig, split)), core.map(values => {
            if (values.length === 0) {
              return RA.of(HashMap.empty());
            }
            const matrix = values.map(x => Array.from(x));
            return pipe(transpose(matrix), RA.map(values => HashMap.fromIterable(RA.zip(RA.fromIterable(keys), values))));
          }));
        })))));
      }
    case OpCodes.OP_ZIP_WITH:
      {
        return core.suspend(() => pipe(fromFlatLoop(flat, prefix, op.left, split), core.either, core.flatMap(left => pipe(fromFlatLoop(flat, prefix, op.right, split), core.either, core.flatMap(right => {
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
            const path = pipe(prefix, RA.join("."));
            const fail = fromFlatLoopFail(prefix, path);
            const [lefts, rights] = extend(fail, fail, pipe(left.right, RA.map(Either.right)), pipe(right.right, RA.map(Either.right)));
            return pipe(lefts, RA.zip(rights), core.forEachSequential(([left, right]) => pipe(core.zip(left, right), core.map(([left, right]) => op.zip(left, right)))));
          }
          throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/io/issues");
        })))));
      }
  }
};
const fromFlatLoopFail = (prefix, path) => index => Either.left(configError.MissingData(prefix, `The element at index ${index} in a sequence at path "${path}" was missing`));
/** @internal */
export const mapInputPath = /*#__PURE__*/dual(2, (self, f) => fromFlat(mapInputPathFlat(self.flattened, f)));
const mapInputPathFlat = (self, f) => makeFlat({
  load: (path, config, split = true) => self.load(path, config, split),
  enumerateChildren: path => self.enumerateChildren(path),
  patch: pathPatch.mapName(self.patch, f)
});
/** @internal */
export const nested = /*#__PURE__*/dual(2, (self, name) => fromFlat(makeFlat({
  load: (path, config) => self.flattened.load(path, config, true),
  enumerateChildren: path => self.flattened.enumerateChildren(path),
  patch: pathPatch.nested(self.flattened.patch, name)
})));
/** @internal */
export const unnested = /*#__PURE__*/dual(2, (self, name) => fromFlat(makeFlat({
  load: (path, config) => self.flattened.load(path, config, true),
  enumerateChildren: path => self.flattened.enumerateChildren(path),
  patch: pathPatch.unnested(self.flattened.patch, name)
})));
/** @internal */
export const orElse = /*#__PURE__*/dual(2, (self, that) => fromFlat(orElseFlat(self.flattened, () => that().flattened)));
const orElseFlat = (self, that) => makeFlat({
  load: (path, config, split) => pipe(pathPatch.patch(path, self.patch), core.flatMap(patch => self.load(patch, config, split)), core.catchAll(error1 => pipe(core.sync(that), core.flatMap(that => pipe(pathPatch.patch(path, that.patch), core.flatMap(patch => that.load(patch, config, split)), core.catchAll(error2 => core.fail(configError.Or(error1, error2)))))))),
  enumerateChildren: path => pipe(pathPatch.patch(path, self.patch), core.flatMap(patch => self.enumerateChildren(patch)), core.either, core.flatMap(left => pipe(core.sync(that), core.flatMap(that => pipe(pathPatch.patch(path, that.patch), core.flatMap(patch => that.enumerateChildren(patch)), core.either, core.flatMap(right => {
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
      return core.succeed(pipe(left.right, HashSet.union(right.right)));
    }
    throw new Error("BUG: ConfigProvider.orElseFlat - please report an issue at https://github.com/Effect-TS/io/issues");
  })))))),
  patch: pathPatch.empty
});
/** @internal */
export const constantCase = self => mapInputPath(self, StringUtils.constantCase);
/** @internal */
export const kebabCase = self => mapInputPath(self, StringUtils.kebabCase);
/** @internal */
export const lowerCase = self => mapInputPath(self, StringUtils.lowerCase);
/** @internal */
export const snakeCase = self => mapInputPath(self, StringUtils.snakeCase);
/** @internal */
export const upperCase = self => mapInputPath(self, StringUtils.upperCase);
/** @internal */
export const within = /*#__PURE__*/dual(3, (self, path, f) => {
  const unnest = RA.reduce(path, self, (provider, name) => unnested(provider, name));
  const nest = RA.reduceRight(path, f(unnest), (provider, name) => nested(provider, name));
  return orElse(nest, () => self);
});
const splitPathString = (text, delim) => {
  const split = text.split(new RegExp(`\\s*${escapeRegex(delim)}\\s*`));
  return split;
};
const parsePrimitive = (text, path, primitive, delimiter, split) => {
  if (!split) {
    return pipe(primitive.parse(text), core.map(RA.of), core.mapError(configError.prefixed(path)));
  }
  return pipe(splitPathString(text, delimiter), core.forEachSequential(char => primitive.parse(char.trim())), core.mapError(configError.prefixed(path)));
};
const transpose = array => {
  return Object.keys(array[0]).map(column => array.map(row => row[column]));
};
const escapeRegex = string => {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
};
const indicesFrom = quotedIndices => pipe(core.forEachSequential(quotedIndices, parseQuotedIndex), core.mapBoth({
  onFailure: () => RA.empty(),
  onSuccess: RA.sort(number.Order)
}), core.either, core.map(Either.merge));
const STR_INDEX_REGEX = /(^.+)(\[(\d+)\])$/;
const QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
const parseQuotedIndex = str => {
  const match = str.match(QUOTED_INDEX_REGEX);
  if (match !== null) {
    const matchedIndex = match[2];
    return pipe(matchedIndex !== undefined && matchedIndex.length > 0 ? Option.some(matchedIndex) : Option.none(), Option.flatMap(parseInteger));
  }
  return Option.none();
};
const splitIndexInKeys = (map, unmakePathString, makePathString) => {
  const newMap = new Map();
  for (const [pathString, value] of map) {
    const keyWithIndex = pipe(unmakePathString(pathString), RA.flatMap(key => Option.match(splitIndexFrom(key), {
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
    const optionalIndex = pipe(matchedIndex !== undefined && matchedIndex.length > 0 ? Option.some(matchedIndex) : Option.none(), Option.flatMap(parseInteger));
    return Option.all([optionalString, optionalIndex]);
  }
  return Option.none();
};
const parseInteger = str => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? Option.none() : Option.some(parsedIndex);
};
//# sourceMappingURL=configProvider.js.map