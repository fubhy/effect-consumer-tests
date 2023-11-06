"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SafeRefinementId = exports.exhaustive = exports.option = exports.either = exports.orElseAbsurd = exports.orElse = exports.instanceOfUnsafe = exports.instanceOf = exports.record = exports.date = exports.bigint = exports.null = exports.undefined = exports.boolean = exports.defined = exports.any = exports.number = exports.string = exports.is = exports.nonEmptyString = exports.not = exports.tagsExhaustive = exports.tags = exports.tagStartsWith = exports.tag = exports.discriminatorsExhaustive = exports.discriminators = exports.discriminatorStartsWith = exports.discriminator = exports.whenAnd = exports.whenOr = exports.when = exports.typeTags = exports.valueTags = exports.value = exports.type = exports.MatcherTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/matcher.js");
const Predicate = /*#__PURE__*/require("./Predicate.js");
/**
 * @category type ids
 * @since 1.0.0
 */
exports.MatcherTypeId = internal.TypeId;
/**
 * @category constructors
 * @since 1.0.0
 */
exports.type = internal.type;
/**
 * @category constructors
 * @since 1.0.0
 */
exports.value = internal.value;
/**
 * @category constructors
 * @since 1.0.0
 */
exports.valueTags = internal.valueTags;
/**
 * @category constructors
 * @since 1.0.0
 */
exports.typeTags = internal.typeTags;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.when = internal.when;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.whenOr = internal.whenOr;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.whenAnd = internal.whenAnd;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.discriminator = internal.discriminator;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.discriminatorStartsWith = internal.discriminatorStartsWith;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.discriminators = internal.discriminators;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.discriminatorsExhaustive = internal.discriminatorsExhaustive;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.tag = internal.tag;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.tagStartsWith = internal.tagStartsWith;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.tags = internal.tags;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.tagsExhaustive = internal.tagsExhaustive;
/**
 * @category combinators
 * @since 1.0.0
 */
exports.not = internal.not;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.nonEmptyString = internal.nonEmptyString;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.is = internal.is;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.string = Predicate.isString;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.number = Predicate.isNumber;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.any = internal.any;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.defined = internal.defined;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.boolean = Predicate.isBoolean;
const _undefined = Predicate.isUndefined;
exports.undefined = _undefined;
const _null = Predicate.isNull;
exports.null = _null;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.bigint = Predicate.isBigInt;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.date = Predicate.isDate;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.record = Predicate.isRecord;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.instanceOf = internal.instanceOf;
/**
 * @category predicates
 * @since 1.0.0
 */
exports.instanceOfUnsafe = internal.instanceOf;
/**
 * @category conversions
 * @since 1.0.0
 */
exports.orElse = internal.orElse;
/**
 * @category conversions
 * @since 1.0.0
 */
exports.orElseAbsurd = internal.orElseAbsurd;
/**
 * @category conversions
 * @since 1.0.0
 */
exports.either = internal.either;
/**
 * @category conversions
 * @since 1.0.0
 */
exports.option = internal.option;
/**
 * @category conversions
 * @since 1.0.0
 */
exports.exhaustive = internal.exhaustive;
/**
 * @since 1.0.0
 * @category type ids
 */
exports.SafeRefinementId = /*#__PURE__*/Symbol.for("effect/SafeRefinement");
const Fail = /*#__PURE__*/Symbol.for("effect/Fail");
//# sourceMappingURL=Match.js.map