"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exhaustive = exports.option = exports.either = exports.orElseAbsurd = exports.orElse = exports.instanceOfUnsafe = exports.instanceOf = exports.defined = exports.any = exports.is = exports.nonEmptyString = exports.not = exports.tagsExhaustive = exports.tags = exports.tagStartsWith = exports.tag = exports.discriminatorsExhaustive = exports.discriminators = exports.discriminatorStartsWith = exports.discriminator = exports.whenAnd = exports.whenOr = exports.when = exports.typeTags = exports.valueTags = exports.value = exports.type = exports.TypeId = void 0;
const Either = /*#__PURE__*/require("../Either.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
/** @internal */
exports.TypeId = /*#__PURE__*/Symbol.for("@effect/matcher/Matcher");
const TypeMatcherProto = {
  [exports.TypeId]: {
    _input: Function_js_1.identity,
    _filters: Function_js_1.identity,
    _remaining: Function_js_1.identity,
    _result: Function_js_1.identity
  },
  _tag: "TypeMatcher",
  add(_case) {
    return makeTypeMatcher([...this.cases, _case]);
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
function makeTypeMatcher(cases) {
  const matcher = Object.create(TypeMatcherProto);
  matcher.cases = cases;
  return matcher;
}
const ValueMatcherProto = {
  [exports.TypeId]: {
    _input: Function_js_1.identity,
    _filters: Function_js_1.identity,
    _result: Function_js_1.identity
  },
  _tag: "ValueMatcher",
  add(_case) {
    if (this.value._tag === "Right") {
      return this;
    }
    if (_case._tag === "When" && _case.guard(this.provided) === true) {
      return makeValueMatcher(this.provided, Either.right(_case.evaluate(this.provided)));
    } else if (_case._tag === "Not" && _case.guard(this.provided) === false) {
      return makeValueMatcher(this.provided, Either.right(_case.evaluate(this.provided)));
    }
    return this;
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
function makeValueMatcher(provided, value) {
  const matcher = Object.create(ValueMatcherProto);
  matcher.provided = provided;
  matcher.value = value;
  return matcher;
}
const makeWhen = (guard, evaluate) => ({
  _tag: "When",
  guard,
  evaluate
});
const makeNot = (guard, evaluate) => ({
  _tag: "Not",
  guard,
  evaluate
});
const makePredicate = pattern => {
  if (typeof pattern === "function") {
    return pattern;
  } else if (Array.isArray(pattern)) {
    const predicates = pattern.map(makePredicate);
    const len = predicates.length;
    return u => {
      if (!Array.isArray(u)) {
        return false;
      }
      for (let i = 0; i < len; i++) {
        if (predicates[i](u[i]) === false) {
          return false;
        }
      }
      return true;
    };
  } else if (pattern !== null && typeof pattern === "object") {
    const keysAndPredicates = Object.entries(pattern).map(([k, p]) => [k, makePredicate(p)]);
    const len = keysAndPredicates.length;
    return u => {
      if (typeof u !== "object" || u === null) {
        return false;
      }
      for (let i = 0; i < len; i++) {
        const [key, predicate] = keysAndPredicates[i];
        if (!(key in u) || predicate(u[key]) === false) {
          return false;
        }
      }
      return true;
    };
  }
  return u => u === pattern;
};
const makeOrPredicate = patterns => {
  const predicates = patterns.map(makePredicate);
  const len = predicates.length;
  return u => {
    for (let i = 0; i < len; i++) {
      if (predicates[i](u) === true) {
        return true;
      }
    }
    return false;
  };
};
const makeAndPredicate = patterns => {
  const predicates = patterns.map(makePredicate);
  const len = predicates.length;
  return u => {
    for (let i = 0; i < len; i++) {
      if (predicates[i](u) === false) {
        return false;
      }
    }
    return true;
  };
};
/** @internal */
const type = () => makeTypeMatcher([]);
exports.type = type;
/** @internal */
const value = i => makeValueMatcher(i, Either.left(i));
exports.value = value;
/** @internal */
const valueTags = fields => {
  const match = (0, exports.tagsExhaustive)(fields)(makeTypeMatcher([]));
  return input => match(input);
};
exports.valueTags = valueTags;
/** @internal */
const typeTags = () => fields => {
  const match = (0, exports.tagsExhaustive)(fields)(makeTypeMatcher([]));
  return input => match(input);
};
exports.typeTags = typeTags;
/** @internal */
const when = (pattern, f) => self => self.add(makeWhen(makePredicate(pattern), f));
exports.when = when;
/** @internal */
const whenOr = (...args) => self => {
  const onMatch = args[args.length - 1];
  const patterns = args.slice(0, -1);
  return self.add(makeWhen(makeOrPredicate(patterns), onMatch));
};
exports.whenOr = whenOr;
/** @internal */
const whenAnd = (...args) => self => {
  const onMatch = args[args.length - 1];
  const patterns = args.slice(0, -1);
  return self.add(makeWhen(makeAndPredicate(patterns), onMatch));
};
exports.whenAnd = whenAnd;
/** @internal */
const discriminator = field => (...pattern) => {
  const f = pattern[pattern.length - 1];
  const values = pattern.slice(0, -1);
  const pred = values.length === 1 ? _ => _[field] === values[0] : _ => values.includes(_[field]);
  return self => self.add(makeWhen(pred, f));
};
exports.discriminator = discriminator;
/** @internal */
const discriminatorStartsWith = field => (pattern, f) => {
  const pred = _ => typeof _[field] === "string" && _[field].startsWith(pattern);
  return self => self.add(makeWhen(pred, f));
};
exports.discriminatorStartsWith = discriminatorStartsWith;
/** @internal */
const discriminators = field => fields => {
  const predicates = [];
  for (const key in fields) {
    const pred = _ => _[field] === key;
    const f = fields[key];
    if (f) {
      predicates.push(makeWhen(pred, f));
    }
  }
  const len = predicates.length;
  return self => {
    let matcher = self;
    for (let i = 0; i < len; i++) {
      matcher = matcher.add(predicates[i]);
    }
    return matcher;
  };
};
exports.discriminators = discriminators;
/** @internal */
const discriminatorsExhaustive = field => fields => {
  const addCases = (0, exports.discriminators)(field)(fields);
  return matcher => (0, exports.exhaustive)(addCases(matcher));
};
exports.discriminatorsExhaustive = discriminatorsExhaustive;
/** @internal */
exports.tag = /*#__PURE__*/(0, exports.discriminator)("_tag");
/** @internal */
exports.tagStartsWith = /*#__PURE__*/(0, exports.discriminatorStartsWith)("_tag");
/** @internal */
exports.tags = /*#__PURE__*/(0, exports.discriminators)("_tag");
/** @internal */
exports.tagsExhaustive = /*#__PURE__*/(0, exports.discriminatorsExhaustive)("_tag");
/** @internal */
const not = (pattern, f) => self => self.add(makeNot(makePredicate(pattern), f));
exports.not = not;
/** @internal */
exports.nonEmptyString = u => typeof u === "string" && u.length > 0;
/** @internal */
const is = (...literals) => {
  const len = literals.length;
  return u => {
    for (let i = 0; i < len; i++) {
      if (u === literals[i]) {
        return true;
      }
    }
    return false;
  };
};
exports.is = is;
/** @internal */
exports.any = () => true;
/** @internal */
const defined = u => u !== undefined && u !== null;
exports.defined = defined;
/** @internal */
const instanceOf = constructor => u => u instanceof constructor;
exports.instanceOf = instanceOf;
/** @internal */
exports.instanceOfUnsafe = exports.instanceOf;
/** @internal */
const orElse = f => self => {
  const result = (0, exports.either)(self);
  if (Either.isEither(result)) {
    // @ts-expect-error
    return result._tag === "Right" ? result.right : f(result.left);
  }
  // @ts-expect-error
  return input => {
    const a = result(input);
    return a._tag === "Right" ? a.right : f(a.left);
  };
};
exports.orElse = orElse;
/** @internal */
const orElseAbsurd = self => (0, exports.orElse)(() => {
  throw new Error("absurd");
})(self);
exports.orElseAbsurd = orElseAbsurd;
/** @internal */
exports.either = self => {
  if (self._tag === "ValueMatcher") {
    return self.value;
  }
  const len = self.cases.length;
  return input => {
    for (let i = 0; i < len; i++) {
      const _case = self.cases[i];
      if (_case._tag === "When" && _case.guard(input) === true) {
        return Either.right(_case.evaluate(input));
      } else if (_case._tag === "Not" && _case.guard(input) === false) {
        return Either.right(_case.evaluate(input));
      }
    }
    return Either.left(input);
  };
};
/** @internal */
exports.option = self => {
  const toEither = (0, exports.either)(self);
  if (Either.isEither(toEither)) {
    return Either.match(toEither, {
      onLeft: () => Option.none(),
      onRight: Option.some
    });
  }
  return input => Either.match(toEither(input), {
    onLeft: () => Option.none(),
    onRight: Option.some
  });
};
/** @internal */
exports.exhaustive = self => {
  const toEither = (0, exports.either)(self);
  if (Either.isEither(toEither)) {
    if (toEither._tag === "Right") {
      return toEither.right;
    }
    throw new Error("@effect/match: exhaustive absurd");
  }
  return u => {
    // @ts-expect-error
    const result = toEither(u);
    if (result._tag === "Right") {
      return result.right;
    }
    throw new Error("@effect/match: exhaustive absurd");
  };
};
//# sourceMappingURL=matcher.js.map