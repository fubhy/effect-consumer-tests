"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipWith = exports.zip = exports.withDescription = exports.withDefault = exports.validate = exports.unwrap = exports.isConfig = exports.hashMap = exports.sync = exports.suspend = exports.succeed = exports.all = exports.string = exports.hashSet = exports.secret = exports.repeat = exports.primitive = exports.option = exports.orElseIf = exports.orElse = exports.nested = exports.missingError = exports.mapOrFail = exports.mapAttempt = exports.map = exports.logLevel = exports.integer = exports.number = exports.fail = exports.date = exports.chunk = exports.array = exports.boolean = exports.ConfigTypeId = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const ConfigError = /*#__PURE__*/require("../ConfigError.js");
const Either = /*#__PURE__*/require("../Either.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const configError = /*#__PURE__*/require("./configError.js");
const configSecret = /*#__PURE__*/require("./configSecret.js");
const core = /*#__PURE__*/require("./core.js");
const OpCodes = /*#__PURE__*/require("./opCodes/config.js");
/** @internal */
const ConfigSymbolKey = "effect/Config";
/** @internal */
exports.ConfigTypeId = /*#__PURE__*/Symbol.for(ConfigSymbolKey);
/** @internal */
const configVariance = {
  _A: _ => _
};
/** @internal */
const proto = {
  [exports.ConfigTypeId]: configVariance,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
const boolean = name => {
  const config = (0, exports.primitive)("a boolean property", text => {
    switch (text) {
      case "true":
      case "yes":
      case "on":
      case "1":
        {
          return Either.right(true);
        }
      case "false":
      case "no":
      case "off":
      case "0":
        {
          return Either.right(false);
        }
      default:
        {
          const error = configError.InvalidData([], `Expected a boolean value, but received ${text}`);
          return Either.left(error);
        }
    }
  });
  return name === undefined ? config : (0, exports.nested)(name)(config);
};
exports.boolean = boolean;
/** @internal */
const array = (config, name) => {
  return (0, Function_js_1.pipe)((0, exports.chunk)(config, name), (0, exports.map)(Chunk.toReadonlyArray));
};
exports.array = array;
/** @internal */
const chunk = (config, name) => {
  return (0, exports.map)(name === undefined ? (0, exports.repeat)(config) : (0, exports.nested)(name)((0, exports.repeat)(config)), Chunk.unsafeFromArray);
};
exports.chunk = chunk;
/** @internal */
const date = name => {
  const config = (0, exports.primitive)("a date property", text => {
    const result = Date.parse(text);
    if (Number.isNaN(result)) {
      return Either.left(configError.InvalidData([], `Expected a date value but received ${text}`));
    }
    return Either.right(new Date(result));
  });
  return name === undefined ? config : (0, exports.nested)(name)(config);
};
exports.date = date;
/** @internal */
const fail = message => {
  const fail = Object.create(proto);
  fail._tag = OpCodes.OP_FAIL;
  fail.message = message;
  fail.parse = () => Either.left(configError.Unsupported([], message));
  return fail;
};
exports.fail = fail;
/** @internal */
const number = name => {
  const config = (0, exports.primitive)("a number property", text => {
    const result = Number.parseFloat(text);
    if (Number.isNaN(result)) {
      return Either.left(configError.InvalidData([], `Expected an number value but received ${text}`));
    }
    return Either.right(result);
  });
  return name === undefined ? config : (0, exports.nested)(name)(config);
};
exports.number = number;
/** @internal */
const integer = name => {
  const config = (0, exports.primitive)("an integer property", text => {
    const result = Number.parseInt(text, 10);
    if (Number.isNaN(result)) {
      return Either.left(configError.InvalidData([], `Expected an integer value but received ${text}`));
    }
    return Either.right(result);
  });
  return name === undefined ? config : (0, exports.nested)(name)(config);
};
exports.integer = integer;
/** @internal */
const logLevel = name => {
  const config = (0, exports.mapOrFail)((0, exports.string)(), value => {
    const label = value.toUpperCase();
    const level = core.allLogLevels.find(level => level.label === label);
    return level === undefined ? Either.left(configError.InvalidData([], `Expected a log level, but found: ${value}`)) : Either.right(level);
  });
  return name === undefined ? config : (0, exports.nested)(config, name);
};
exports.logLevel = logLevel;
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapOrFail)(self, a => Either.right(f(a))));
/** @internal */
exports.mapAttempt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.mapOrFail)(self, a => {
  try {
    return Either.right(f(a));
  } catch (error) {
    return Either.left(configError.InvalidData([], error instanceof Error ? error.message : `${error}`));
  }
}));
/** @internal */
exports.mapOrFail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const mapOrFail = Object.create(proto);
  mapOrFail._tag = OpCodes.OP_MAP_OR_FAIL;
  mapOrFail.original = self;
  mapOrFail.mapOrFail = f;
  return mapOrFail;
});
/** @internal */
const missingError = name => {
  return self => {
    return configError.MissingData([], `Expected ${self.description} with name ${name}`);
  };
};
exports.missingError = missingError;
/** @internal */
exports.nested = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, name) => {
  const nested = Object.create(proto);
  nested._tag = OpCodes.OP_NESTED;
  nested.name = name;
  nested.config = self;
  return nested;
});
/** @internal */
exports.orElse = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  const fallback = Object.create(proto);
  fallback._tag = OpCodes.OP_FALLBACK;
  fallback.first = self;
  fallback.second = (0, exports.suspend)(that);
  fallback.condition = Function_js_1.constTrue;
  return fallback;
});
/** @internal */
exports.orElseIf = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, options) => {
  const fallback = Object.create(proto);
  fallback._tag = OpCodes.OP_FALLBACK;
  fallback.first = self;
  fallback.second = (0, exports.suspend)(options.orElse);
  fallback.condition = options.if;
  return fallback;
});
/** @internal */
const option = self => {
  return (0, Function_js_1.pipe)(self, (0, exports.map)(Option.some), (0, exports.orElseIf)({
    orElse: () => (0, exports.succeed)(Option.none()),
    if: ConfigError.isMissingDataOnly
  }));
};
exports.option = option;
/** @internal */
const primitive = (description, parse) => {
  const primitive = Object.create(proto);
  primitive._tag = OpCodes.OP_PRIMITIVE;
  primitive.description = description;
  primitive.parse = parse;
  return primitive;
};
exports.primitive = primitive;
/** @internal */
const repeat = self => {
  const repeat = Object.create(proto);
  repeat._tag = OpCodes.OP_SEQUENCE;
  repeat.config = self;
  return repeat;
};
exports.repeat = repeat;
/** @internal */
const secret = name => {
  const config = (0, exports.primitive)("a secret property", text => Either.right(configSecret.fromString(text)));
  return name === undefined ? config : (0, exports.nested)(name)(config);
};
exports.secret = secret;
/** @internal */
const hashSet = (config, name) => {
  const newConfig = (0, exports.map)((0, exports.chunk)(config), HashSet.fromIterable);
  return name === undefined ? newConfig : (0, exports.nested)(name)(newConfig);
};
exports.hashSet = hashSet;
/** @internal */
const string = name => {
  const config = (0, exports.primitive)("a text property", Either.right);
  return name === undefined ? config : (0, exports.nested)(name)(config);
};
exports.string = string;
const all = arg => {
  if (Array.isArray(arg)) {
    return tuple(arg);
  } else if (Symbol.iterator in arg) {
    return tuple([...arg]);
  }
  return struct(arg);
};
exports.all = all;
const struct = r => {
  const entries = Object.entries(r);
  let result = (0, Function_js_1.pipe)(entries[0][1], (0, exports.map)(value => ({
    [entries[0][0]]: value
  })));
  if (entries.length === 1) {
    return result;
  }
  const rest = entries.slice(1);
  for (const [key, config] of rest) {
    result = (0, Function_js_1.pipe)(result, (0, exports.zipWith)(config, (record, value) => ({
      ...record,
      [key]: value
    })));
  }
  return result;
};
/** @internal */
const succeed = value => {
  const constant = Object.create(proto);
  constant._tag = OpCodes.OP_CONSTANT;
  constant.value = value;
  constant.parse = () => Either.right(value);
  return constant;
};
exports.succeed = succeed;
/** @internal */
const suspend = config => {
  const lazy = Object.create(proto);
  lazy._tag = OpCodes.OP_LAZY;
  lazy.config = config;
  return lazy;
};
exports.suspend = suspend;
/** @internal */
const sync = value => {
  return (0, exports.suspend)(() => (0, exports.succeed)(value()));
};
exports.sync = sync;
/** @internal */
const hashMap = (config, name) => {
  const table = Object.create(proto);
  table._tag = OpCodes.OP_HASHMAP;
  table.valueConfig = config;
  return name === undefined ? table : (0, exports.nested)(name)(table);
};
exports.hashMap = hashMap;
/** @internal */
const isConfig = u => (0, Predicate_js_1.hasProperty)(u, exports.ConfigTypeId);
exports.isConfig = isConfig;
/** @internal */
const tuple = tuple => {
  if (tuple.length === 0) {
    return (0, exports.succeed)([]);
  }
  if (tuple.length === 1) {
    return (0, exports.map)(tuple[0], x => [x]);
  }
  let result = (0, exports.map)(tuple[0], x => [x]);
  for (let i = 1; i < tuple.length; i++) {
    const config = tuple[i];
    result = (0, Function_js_1.pipe)(result, (0, exports.zipWith)(config, (tuple, value) => [...tuple, value]));
  }
  return result;
};
/**
 * @internal
 */
const unwrap = wrapped => {
  if ((0, exports.isConfig)(wrapped)) {
    return wrapped;
  }
  return struct(Object.fromEntries(Object.entries(wrapped).map(([k, a]) => [k, (0, exports.unwrap)(a)])));
};
exports.unwrap = unwrap;
/** @internal */
exports.validate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  message,
  validation
}) => (0, exports.mapOrFail)(self, a => {
  if (validation(a)) {
    return Either.right(a);
  }
  return Either.left(configError.InvalidData([], message));
}));
/** @internal */
exports.withDefault = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, def) => (0, exports.orElseIf)(self, {
  orElse: () => (0, exports.succeed)(def),
  if: ConfigError.isMissingDataOnly
}));
/** @internal */
exports.withDescription = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, description) => {
  const described = Object.create(proto);
  described._tag = OpCodes.OP_DESCRIBED;
  described.config = self;
  described.description = description;
  return described;
});
/** @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.zipWith)(self, that, (a, b) => [a, b]));
/** @internal */
exports.zipWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => {
  const zipWith = Object.create(proto);
  zipWith._tag = OpCodes.OP_ZIP_WITH;
  zipWith.left = self;
  zipWith.right = that;
  zipWith.zip = f;
  return zipWith;
});
//# sourceMappingURL=config.js.map