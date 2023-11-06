"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaggedError = exports.Error = exports.taggedEnum = exports.Structural = exports.TaggedClass = exports.Class = exports.tagged = exports.case = exports.unsafeArray = exports.array = exports.tuple = exports.unsafeStruct = exports.struct = void 0;
const Effect = /*#__PURE__*/require("./Effect.js");
const Effectable = /*#__PURE__*/require("./Effectable.js");
const internal = /*#__PURE__*/require("./internal/data.js");
/**
 * @example
 * import * as Data from "effect/Data"
 * import * as Equal from "effect/Equal"
 *
 * const alice = Data.struct({ name: "Alice", age: 30 })
 *
 * const bob = Data.struct({ name: "Bob", age: 40 })
 *
 * assert.deepStrictEqual(Equal.equals(alice, alice), true)
 * assert.deepStrictEqual(Equal.equals(alice, Data.struct({ name: "Alice", age: 30 })), true)
 *
 * assert.deepStrictEqual(Equal.equals(alice, { name: "Alice", age: 30 }), false)
 * assert.deepStrictEqual(Equal.equals(alice, bob), false)
 *
 * @category constructors
 * @since 2.0.0
 */
exports.struct = internal.struct;
/**
 * @category constructors
 * @since 2.0.0
 */
const unsafeStruct = as => Object.setPrototypeOf(as, internal.StructProto);
exports.unsafeStruct = unsafeStruct;
/**
 * @example
 * import * as Data from "effect/Data"
 * import * as Equal from "effect/Equal"
 *
 * const alice = Data.tuple("Alice", 30)
 *
 * const bob = Data.tuple("Bob", 40)
 *
 * assert.deepStrictEqual(Equal.equals(alice, alice), true)
 * assert.deepStrictEqual(Equal.equals(alice, Data.tuple("Alice", 30)), true)
 *
 * assert.deepStrictEqual(Equal.equals(alice, ["Alice", 30]), false)
 * assert.deepStrictEqual(Equal.equals(alice, bob), false)
 *
 * @category constructors
 * @since 2.0.0
 */
const tuple = (...as) => (0, exports.unsafeArray)(as);
exports.tuple = tuple;
/**
 * @example
 * import * as Data from "effect/Data"
 * import * as Equal from "effect/Equal"
 *
 * const alice = Data.struct({ name: "Alice", age: 30 })
 * const bob = Data.struct({ name: "Bob", age: 40 })
 *
 * const persons = Data.array([alice, bob])
 *
 * assert.deepStrictEqual(
 *   Equal.equals(
 *     persons,
 *     Data.array([
 *       Data.struct({ name: "Alice", age: 30 }),
 *       Data.struct({ name: "Bob", age: 40 })
 *     ])
 *   ),
 *   true
 * )
 *
 * @category constructors
 * @since 2.0.0
 */
const array = as => (0, exports.unsafeArray)(as.slice(0));
exports.array = array;
/**
 * @category constructors
 * @since 2.0.0
 */
const unsafeArray = as => Object.setPrototypeOf(as, internal.ArrayProto);
exports.unsafeArray = unsafeArray;
const _case = () => args => args === undefined ? Object.create(internal.StructProto) : (0, exports.struct)(args);
exports.case = _case;
/**
 * Provides a tagged constructor for the specified `Case`.
 *
 * @example
 * import * as Data from "effect/Data"
 *
 * interface Person extends Data.Case {
 *   readonly _tag: "Person" // the tag
 *   readonly name: string
 * }
 *
 * const Person = Data.tagged<Person>("Person")
 *
 * const mike = Person({ name: "Mike" })
 *
 * assert.deepEqual(mike, { _tag: "Person", name: "Mike" })
 *
 * @since 2.0.0
 * @category constructors
 */
const tagged = tag => args => {
  const value = args === undefined ? Object.create(internal.StructProto) : (0, exports.struct)(args);
  value._tag = tag;
  return value;
};
exports.tagged = tagged;
/**
 * Provides a constructor for a Case Class.
 *
 * @example
 * import * as Data from "effect/Data"
 * import * as Equal from "effect/Equal"
 *
 * class Person extends Data.Class<{ readonly name: string }> {}
 *
 * // Creating instances of Person
 * const mike1 = new Person({ name: "Mike" })
 * const mike2 = new Person({ name: "Mike" })
 * const john = new Person({ name: "John" })
 *
 * // Checking equality
 * assert.deepStrictEqual(Equal.equals(mike1, mike2), true)
 * assert.deepStrictEqual(Equal.equals(mike1, john), false)
 *
 * @since 2.0.0
 * @category constructors
 */
exports.Class = internal.Structural;
/**
 * Provides a Tagged constructor for a Case Class.
 *
 * @example
 * import * as Data from "effect/Data"
 * import * as Equal from "effect/Equal"
 *
 * class Person extends Data.TaggedClass("Person")<{ readonly name: string }> {}
 *
 * // Creating instances of Person
 * const mike1 = new Person({ name: "Mike" })
 * const mike2 = new Person({ name: "Mike" })
 * const john = new Person({ name: "John" })
 *
 * // Checking equality
 * assert.deepStrictEqual(Equal.equals(mike1, mike2), true)
 * assert.deepStrictEqual(Equal.equals(mike1, john), false)
 *
 * assert.deepStrictEqual(mike1._tag, "Person")
 *
 * @since 2.0.0
 * @category constructors
 */
const TaggedClass = tag => {
  class Base extends exports.Class {
    _tag = tag;
  }
  return Base;
};
exports.TaggedClass = TaggedClass;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.Structural = internal.Structural;
/**
 * Create a constructor for a tagged union of `Data` structs.
 *
 * You can also pass a `TaggedEnum.WithGenerics` if you want to add generics to
 * the constructor.
 *
 * @example
 * import * as Data from "effect/Data"
 *
 * const { BadRequest, NotFound } = Data.taggedEnum<
 *   | Data.Data<{ readonly _tag: "BadRequest"; readonly status: 400; readonly message: string }>
 *   | Data.Data<{ readonly _tag: "NotFound"; readonly status: 404; readonly message: string }>
 * >()
 *
 * const notFound = NotFound({ status: 404, message: "Not Found" })
 *
 * @example
 * import * as Data from "effect/Data"
 *
 * type MyResult<E, A> = Data.TaggedEnum<{
 *   Failure: { readonly error: E }
 *   Success: { readonly value: A }
 * }>
 * interface MyResultDefinition extends Data.TaggedEnum.WithGenerics<2> {
 *   readonly taggedEnum: MyResult<this["A"], this["B"]>
 * }
 * const { Failure, Success } = Data.taggedEnum<MyResultDefinition>()
 *
 * const success = Success({ value: 1 })
 *
 * @category constructors
 * @since 2.0.0
 */
const taggedEnum = () => new Proxy({}, {
  get(_target, tag, _receiver) {
    return (0, exports.tagged)(tag);
  }
});
exports.taggedEnum = taggedEnum;
const YieldableErrorProto = {
  ...Effectable.StructuralCommitPrototype,
  commit() {
    return Effect.fail(this);
  },
  toString() {
    return `${this.name}: ${this.message}`;
  }
};
/**
 * Provides a constructor for a Case Class.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.Error = /*#__PURE__*/function () {
  class Base extends globalThis.Error {
    constructor(args) {
      super();
      Object.assign(this, args);
    }
  }
  Object.assign(Base.prototype, YieldableErrorProto);
  return Base;
}();
/**
 * @since 2.0.0
 * @category constructors
 */
const TaggedError = tag => {
  class Base extends exports.Error {
    _tag = tag;
  }
  ;
  Base.prototype.name = tag;
  return Base;
};
exports.TaggedError = TaggedError;
//# sourceMappingURL=Data.js.map