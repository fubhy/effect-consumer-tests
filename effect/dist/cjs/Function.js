"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SK = exports.hole = exports.flow = exports.pipe = exports.untupled = exports.tupled = exports.absurd = exports.compose = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.unsafeCoerce = exports.identity = exports.apply = exports.dual = exports.isFunction = void 0;
/**
 * Tests if a value is a `function`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isFunction } from 'effect/Predicate'
 *
 * assert.deepStrictEqual(isFunction(isFunction), true)
 * assert.deepStrictEqual(isFunction("function"), false)
 *
 * @category guards
 * @since 2.0.0
 */
const isFunction = input => typeof input === "function";
exports.isFunction = isFunction;
/**
 * Creates a function that can be used in a data-last (aka `pipe`able) or
 * data-first style.
 *
 * The first parameter to `dual` is either the arity of the uncurried function
 * or a predicate that determines if the function is being used in a data-first
 * or data-last style.
 *
 * Using the arity is the most common use case, but there are some cases where
 * you may want to use a predicate. For example, if you have a function that
 * takes an optional argument, you can use a predicate to determine if the
 * function is being used in a data-first or data-last style.
 *
 * @param arity - Either the arity of the uncurried function or a predicate
 *                which determines if the function is being used in a data-first
 *                or data-last style.
 * @param body - The definition of the uncurried function.
 *
 * @example
 * import { dual, pipe } from "effect/Function"
 *
 * // Exampe using arity to determine data-first or data-last style
 * const sum: {
 *   (that: number): (self: number) => number
 *   (self: number, that: number): number
 * } = dual(2, (self: number, that: number): number => self + that)
 *
 * assert.deepStrictEqual(sum(2, 3), 5)
 * assert.deepStrictEqual(pipe(2, sum(3)), 5)
 *
 * // Example using a predicate to determine data-first or data-last style
 * const sum2: {
 *   (that: number): (self: number) => number
 *   (self: number, that: number): number
 * } = dual((args) => args.length === 1, (self: number, that: number): number => self + that)
 *
 * assert.deepStrictEqual(sum(2, 3), 5)
 * assert.deepStrictEqual(pipe(2, sum(3)), 5)
 *
 * @since 2.0.0
 */
const dual = function (arity, body) {
  if (typeof arity === "function") {
    return function () {
      if (arity(arguments)) {
        // @ts-expect-error
        return body.apply(this, arguments);
      }
      return self => body(self, ...arguments);
    };
  }
  switch (arity) {
    case 0:
      return body;
    case 1:
      return function (a) {
        if (arguments.length >= 1) {
          return body(a);
        }
        return function () {
          return body(a);
        };
      };
    case 2:
      return function (a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function (self) {
          return body(self, a);
        };
      };
    case 3:
      return function (a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function (self) {
          return body(self, a, b);
        };
      };
    case 4:
      return function (a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function (self) {
          return body(self, a, b, c);
        };
      };
    case 5:
      return function (a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function (self) {
          return body(self, a, b, c, d);
        };
      };
    default:
      return function () {
        if (arguments.length >= arity) {
          // @ts-expect-error
          return body.apply(this, arguments);
        }
        const args = arguments;
        return function (self) {
          return body(self, ...args);
        };
      };
  }
};
exports.dual = dual;
/**
 * Apply a function to a given value.
 *
 * @param a - The value that the function will be applied to.
 * @param self - The function to be applied to a value.
 *
 * @example
 * import { pipe, apply } from "effect/Function"
 * import { length } from 'effect/String'
 *
 * assert.deepStrictEqual(pipe(length, apply("hello")), 5)
 *
 * @since 2.0.0
 */
const apply = a => self => self(a);
exports.apply = apply;
/**
 * The identity function, i.e. A function that returns its input argument.
 *
 * @param a - The input argument.
 *
 * @example
 * import { identity } from "effect/Function"
 *
 * assert.deepStrictEqual(identity(5), 5)
 *
 * @since 2.0.0
 */
const identity = a => a;
exports.identity = identity;
/**
 * Casts the result to the specified type.
 *
 * @param a - The value to be casted to the target type.
 *
 * @example
 * import { unsafeCoerce, identity } from "effect/Function"
 *
 * assert.deepStrictEqual(unsafeCoerce, identity)
 *
 * @since 2.0.0
 */
exports.unsafeCoerce = exports.identity;
/**
 * Creates a constant value that never changes.
 *
 * This is useful when you want to pass a value to a higher-order function (a function that takes another function as its argument)
 * and want that inner function to always use the same value, no matter how many times it is called.
 *
 * @param value - The constant value to be returned.
 *
 * @example
 * import { constant } from "effect/Function"
 *
 * const constNull = constant(null)
 *
 * assert.deepStrictEqual(constNull(), null)
 * assert.deepStrictEqual(constNull(), null)
 *
 * @since 2.0.0
 */
const constant = value => () => value;
exports.constant = constant;
/**
 * A thunk that returns always `true`.
 *
 * @example
 * import { constTrue } from "effect/Function"
 *
 * assert.deepStrictEqual(constTrue(), true)
 *
 * @since 2.0.0
 */
exports.constTrue = /*#__PURE__*/(0, exports.constant)(true);
/**
 * A thunk that returns always `false`.
 *
 * @example
 * import { constFalse } from "effect/Function"
 *
 * assert.deepStrictEqual(constFalse(), false)
 *
 * @since 2.0.0
 */
exports.constFalse = /*#__PURE__*/(0, exports.constant)(false);
/**
 * A thunk that returns always `null`.
 *
 * @example
 * import { constNull } from "effect/Function"
 *
 * assert.deepStrictEqual(constNull(), null)
 *
 * @since 2.0.0
 */
exports.constNull = /*#__PURE__*/(0, exports.constant)(null);
/**
 * A thunk that returns always `undefined`.
 *
 * @example
 * import { constUndefined } from "effect/Function"
 *
 * assert.deepStrictEqual(constUndefined(), undefined)
 *
 * @since 2.0.0
 */
exports.constUndefined = /*#__PURE__*/(0, exports.constant)(undefined);
/**
 * A thunk that returns always `void`.
 *
 * @example
 * import { constVoid } from "effect/Function"
 *
 * assert.deepStrictEqual(constVoid(), undefined)
 *
 * @since 2.0.0
 */
exports.constVoid = exports.constUndefined;
/**
 * Reverses the order of arguments for a curried function.
 *
 * @param f - A curried function that takes multiple arguments.
 *
 * @example
 * import { flip } from "effect/Function"
 *
 * const f = (a: number) => (b: string) => a - b.length
 *
 * assert.deepStrictEqual(flip(f)('aaa')(2), -1)
 *
 * @since 2.0.0
 */
const flip = f => (...b) => (...a) => f(...a)(...b);
exports.flip = flip;
/**
 * Composes two functions, `ab` and `bc` into a single function that takes in an argument `a` of type `A` and returns a result of type `C`.
 * The result is obtained by first applying the `ab` function to `a` and then applying the `bc` function to the result of `ab`.
 *
 * @param ab - A function that maps from `A` to `B`.
 * @param bc - A function that maps from `B` to `C`.
 *
 * @example
 * import { compose } from "effect/Function"
 *
 * const increment = (n: number) => n + 1;
 * const square = (n: number) => n * n;
 *
 * assert.strictEqual(compose(increment, square)(2), 9);
 *
 * @since 2.0.0
 */
exports.compose = /*#__PURE__*/(0, exports.dual)(2, (ab, bc) => a => bc(ab(a)));
/**
 * The `absurd` function is a stub for cases where a value of type `never` is encountered in your code,
 * meaning that it should be impossible for this code to be executed.
 *
 * This function is particularly when it's necessary to specify that certain cases are impossible.
 *
 * @since 2.0.0
 */
const absurd = _ => {
  throw new Error("Called `absurd` function which should be uncallable");
};
exports.absurd = absurd;
/**
 * Creates a tupled version of this function: instead of `n` arguments, it accepts a single tuple argument.
 *
 * @example
 * import { tupled } from "effect/Function"
 *
 * const sumTupled = tupled((x: number, y: number): number => x + y)
 *
 * assert.deepStrictEqual(sumTupled([1, 2]), 3)
 *
 * @since 2.0.0
 */
const tupled = f => a => f(...a);
exports.tupled = tupled;
/**
 * Inverse function of `tupled`
 *
 * @example
 * import { untupled } from "effect/Function"
 *
 * const getFirst = untupled(<A, B>(tuple: [A, B]): A => tuple[0])
 *
 * assert.deepStrictEqual(getFirst(1, 2), 1)
 *
 * @since 2.0.0
 */
const untupled = f => (...a) => f(a);
exports.untupled = untupled;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default:
      {
        let ret = arguments[0];
        for (let i = 1; i < arguments.length; i++) {
          ret = arguments[i](ret);
        }
        return ret;
      }
  }
}
exports.pipe = pipe;
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
  switch (arguments.length) {
    case 1:
      return ab;
    case 2:
      return function () {
        return bc(ab.apply(this, arguments));
      };
    case 3:
      return function () {
        return cd(bc(ab.apply(this, arguments)));
      };
    case 4:
      return function () {
        return de(cd(bc(ab.apply(this, arguments))));
      };
    case 5:
      return function () {
        return ef(de(cd(bc(ab.apply(this, arguments)))));
      };
    case 6:
      return function () {
        return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
      };
    case 7:
      return function () {
        return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
      };
    case 8:
      return function () {
        return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
      };
    case 9:
      return function () {
        return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
      };
  }
  return;
}
exports.flow = flow;
/**
 * Type hole simulation.
 *
 * @since 2.0.0
 */
exports.hole = /*#__PURE__*/(0, exports.unsafeCoerce)(exports.absurd);
/**
 * The SK combinator, also known as the "S-K combinator" or "S-combinator", is a fundamental combinator in the
 * lambda calculus and the SKI combinator calculus.
 *
 * This function is useful for discarding the first argument passed to it and returning the second argument.
 *
 * @param _ - The first argument to be discarded.
 * @param b - The second argument to be returned.
 *
 * @example
 * import { SK } from "effect/Function";
 *
 * assert.deepStrictEqual(SK(0, "hello"), "hello")
 *
 * @since 2.0.0
 */
const SK = (_, b) => b;
exports.SK = SK;
//# sourceMappingURL=Function.js.map