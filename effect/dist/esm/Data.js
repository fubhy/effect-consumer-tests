import * as Effect from "./Effect.js";
import * as Effectable from "./Effectable.js";
import * as internal from "./internal/data.js";
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
export const struct = internal.struct;
/**
 * @category constructors
 * @since 2.0.0
 */
export const unsafeStruct = as => Object.setPrototypeOf(as, internal.StructProto);
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
export const tuple = (...as) => unsafeArray(as);
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
export const array = as => unsafeArray(as.slice(0));
/**
 * @category constructors
 * @since 2.0.0
 */
export const unsafeArray = as => Object.setPrototypeOf(as, internal.ArrayProto);
const _case = () => args => args === undefined ? Object.create(internal.StructProto) : struct(args);
export {
/**
 * Provides a constructor for the specified `Case`.
 *
 * @example
 * import * as Data from "effect/Data"
 * import * as Equal from "effect/Equal"
 *
 * // Extending Data.Case to implement Equal
 * interface Person extends Data.Case {
 *   readonly name: string
 * }
 *
 * // Creating a constructor for the specified Case
 * const Person = Data.case<Person>()
 *
 * // Creating instances of Person
 * const mike1 = Person({ name: "Mike" })
 * const mike2 = Person({ name: "Mike" })
 * const john = Person({ name: "John" })
 *
 * // Checking equality
 * assert.deepStrictEqual(Equal.equals(mike1, mike2), true)
 * assert.deepStrictEqual(Equal.equals(mike1, john), false)
 *
 * @since 2.0.0
 * @category constructors
 */
_case as case };
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
export const tagged = tag => args => {
  const value = args === undefined ? Object.create(internal.StructProto) : struct(args);
  value._tag = tag;
  return value;
};
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
export const Class = internal.Structural;
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
export const TaggedClass = tag => {
  class Base extends Class {
    _tag = tag;
  }
  return Base;
};
/**
 * @since 2.0.0
 * @category constructors
 */
export const Structural = internal.Structural;
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
export const taggedEnum = () => new Proxy({}, {
  get(_target, tag, _receiver) {
    return tagged(tag);
  }
});
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
export const Error = /*#__PURE__*/function () {
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
export const TaggedError = tag => {
  class Base extends Error {
    _tag = tag;
  }
  ;
  Base.prototype.name = tag;
  return Base;
};
//# sourceMappingURL=Data.js.map