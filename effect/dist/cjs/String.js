"use strict";

/**
 * This module provides utility functions and type class instances for working with the `string` type in TypeScript.
 * It includes functions for basic string manipulation, as well as type class instances for
 * `Equivalence` and `Order`.
 *
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripMargin = exports.stripMarginWith = exports.linesWithSeparators = exports.takeRight = exports.takeLeft = exports.toLocaleUpperCase = exports.toLocaleLowerCase = exports.search = exports.replaceAll = exports.repeat = exports.padStart = exports.padEnd = exports.normalize = exports.matchAll = exports.match = exports.localeCompare = exports.lastIndexOf = exports.indexOf = exports.codePointAt = exports.charAt = exports.at = exports.substring = exports.charCodeAt = exports.endsWith = exports.startsWith = exports.includes = exports.split = exports.length = exports.isNonEmpty = exports.isEmpty = exports.slice = exports.trimEnd = exports.trimStart = exports.trim = exports.replace = exports.uncapitalize = exports.capitalize = exports.toLowerCase = exports.toUpperCase = exports.concat = exports.empty = exports.Order = exports.Equivalence = exports.isString = void 0;
const equivalence = /*#__PURE__*/require("./Equivalence.js");
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const readonlyArray = /*#__PURE__*/require("./internal/readonlyArray.js");
const number = /*#__PURE__*/require("./Number.js");
const Option = /*#__PURE__*/require("./Option.js");
const order = /*#__PURE__*/require("./Order.js");
const predicate = /*#__PURE__*/require("./Predicate.js");
/**
 * Tests if a value is a `string`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isString } from 'effect/String'
 *
 * assert.deepStrictEqual(isString("a"), true)
 * assert.deepStrictEqual(isString(1), false)
 *
 * @category guards
 * @since 2.0.0
 */
exports.isString = predicate.isString;
/**
 * @category instances
 * @since 2.0.0
 */
exports.Equivalence = equivalence.string;
/**
 * @category instances
 * @since 2.0.0
 */
exports.Order = order.string;
/**
 * The empty string `""`.
 *
 * @since 2.0.0
 */
exports.empty = "";
/**
 * Concatenates two strings at runtime.
 *
 * @since 2.0.0
 */
exports.concat = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => self + that);
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe('a', S.toUpperCase), 'A')
 *
 * @since 2.0.0
 */
const toUpperCase = self => self.toUpperCase();
exports.toUpperCase = toUpperCase;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe('A', S.toLowerCase), 'a')
 *
 * @since 2.0.0
 */
const toLowerCase = self => self.toLowerCase();
exports.toLowerCase = toLowerCase;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.capitalize), 'Abc')
 *
 * @since 2.0.0
 */
const capitalize = self => {
  if (self.length === 0) return self;
  return (0, exports.toUpperCase)(self[0]) + self.slice(1);
};
exports.capitalize = capitalize;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe('ABC', S.uncapitalize), 'aBC')
 *
 * @since 2.0.0
 */
const uncapitalize = self => {
  if (self.length === 0) return self;
  return (0, exports.toLowerCase)(self[0]) + self.slice(1);
};
exports.uncapitalize = uncapitalize;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.replace('b', 'd')), 'adc')
 *
 * @since 2.0.0
 */
const replace = (searchValue, replaceValue) => self => self.replace(searchValue, replaceValue);
exports.replace = replace;
/**
 * @example
 * import * as S from 'effect/String'
 *
 * assert.deepStrictEqual(S.trim(' a '), 'a')
 *
 * @since 2.0.0
 */
const trim = self => self.trim();
exports.trim = trim;
/**
 * @example
 * import * as S from 'effect/String'
 *
 * assert.deepStrictEqual(S.trimStart(' a '), 'a ')
 *
 * @since 2.0.0
 */
const trimStart = self => self.trimStart();
exports.trimStart = trimStart;
/**
 * @example
 * import * as S from 'effect/String'
 *
 * assert.deepStrictEqual(S.trimEnd(' a '), ' a')
 *
 * @since 2.0.0
 */
const trimEnd = self => self.trimEnd();
exports.trimEnd = trimEnd;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe('abcd', S.slice(1, 3)), 'bc')
 *
 * @since 2.0.0
 */
const slice = (start, end) => self => self.slice(start, end);
exports.slice = slice;
/**
 * Test whether a `string` is empty.
 *
 * @example
 * import * as S from 'effect/String'
 *
 * assert.deepStrictEqual(S.isEmpty(''), true)
 * assert.deepStrictEqual(S.isEmpty('a'), false)
 *
 * @since 2.0.0
 */
const isEmpty = self => self.length === 0;
exports.isEmpty = isEmpty;
/**
 * Test whether a `string` is non empty.
 *
 * @since 2.0.0
 */
const isNonEmpty = self => self.length > 0;
exports.isNonEmpty = isNonEmpty;
/**
 * Calculate the number of characters in a `string`.
 *
 * @example
 * import * as S from 'effect/String'
 *
 * assert.deepStrictEqual(S.length('abc'), 3)
 *
 * @since 2.0.0
 */
const length = self => self.length;
exports.length = length;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe('abc', S.split('')), ['a', 'b', 'c'])
 * assert.deepStrictEqual(pipe('', S.split('')), [''])
 *
 * @since 2.0.0
 */
exports.split = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, separator) => {
  const out = self.split(separator);
  return readonlyArray.isNonEmptyArray(out) ? out : [self];
});
/**
 * Returns `true` if `searchString` appears as a substring of `self`, at one or more positions that are
 * greater than or equal to `position`; otherwise, returns `false`.
 *
 * @since 2.0.0
 */
const includes = (searchString, position) => self => self.includes(searchString, position);
exports.includes = includes;
/**
 * @since 2.0.0
 */
const startsWith = (searchString, position) => self => self.startsWith(searchString, position);
exports.startsWith = startsWith;
/**
 * @since 2.0.0
 */
const endsWith = (searchString, position) => self => self.endsWith(searchString, position);
exports.endsWith = endsWith;
/**
 * @example
 * import * as S from 'effect/String'
 * import * as Option from 'effect/Option'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("abc", S.charCodeAt(1)), Option.some(98))
 * assert.deepStrictEqual(pipe("abc", S.charCodeAt(4)), Option.none())
 *
 * @since 2.0.0
 */
exports.charCodeAt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => Option.filter(Option.some(self.charCodeAt(index)), charCode => !isNaN(charCode)));
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("abcd", S.substring(1)), "bcd")
 * assert.deepStrictEqual(pipe("abcd", S.substring(1, 3)), "bc")
 *
 * @since 2.0.0
 */
const substring = (start, end) => self => self.substring(start, end);
exports.substring = substring;
/**
 * @example
 * import * as S from 'effect/String'
 * import * as Option from 'effect/Option'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("abc", S.at(1)), Option.some("b"))
 * assert.deepStrictEqual(pipe("abc", S.at(4)), Option.none())
 *
 * @since 2.0.0
 */
exports.at = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => Option.fromNullable(self.at(index)));
/**
 * @example
 * import * as S from 'effect/String'
 * import * as Option from 'effect/Option'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("abc", S.charAt(1)), Option.some("b"))
 * assert.deepStrictEqual(pipe("abc", S.charAt(4)), Option.none())
 *
 * @since 2.0.0
 */
exports.charAt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => Option.filter(Option.some(self.charAt(index)), exports.isNonEmpty));
/**
 * @example
 * import * as S from 'effect/String'
 * import * as Option from 'effect/Option'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("abc", S.codePointAt(1)), Option.some(98))
 *
 * @since 2.0.0
 */
exports.codePointAt = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, index) => Option.fromNullable(self.codePointAt(index)));
/**
 * @example
 * import * as S from 'effect/String'
 * import * as Option from 'effect/Option'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("abbbc", S.indexOf("b")), Option.some(1))
 *
 * @since 2.0.0
 */
const indexOf = searchString => self => Option.filter(Option.some(self.indexOf(searchString)), number.greaterThanOrEqualTo(0));
exports.indexOf = indexOf;
/**
 * @example
 * import * as S from 'effect/String'
 * import * as Option from 'effect/Option'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("abbbc", S.lastIndexOf("b")), Option.some(3))
 * assert.deepStrictEqual(pipe("abbbc", S.lastIndexOf("d")), Option.none())
 *
 * @since 2.0.0
 */
const lastIndexOf = searchString => self => Option.filter(Option.some(self.lastIndexOf(searchString)), number.greaterThanOrEqualTo(0));
exports.lastIndexOf = lastIndexOf;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("a", S.localeCompare("b")), -1)
 * assert.deepStrictEqual(pipe("b", S.localeCompare("a")), 1)
 * assert.deepStrictEqual(pipe("a", S.localeCompare("a")), 0)
 *
 * @since 2.0.0
 */
const localeCompare = (that, locales, options) => self => number.sign(self.localeCompare(that, locales, options));
exports.localeCompare = localeCompare;
/**
 * It is the `pipe`-able version of the native `match` method.
 *
 * @since 2.0.0
 */
const match = regexp => self => Option.fromNullable(self.match(regexp));
exports.match = match;
/**
 * It is the `pipe`-able version of the native `matchAll` method.
 *
 * @since 2.0.0
 */
const matchAll = regexp => self => self.matchAll(regexp);
exports.matchAll = matchAll;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * const str = "\u1E9B\u0323";
 * assert.deepStrictEqual(pipe(str, S.normalize()), "\u1E9B\u0323")
 * assert.deepStrictEqual(pipe(str, S.normalize("NFC")), "\u1E9B\u0323")
 * assert.deepStrictEqual(pipe(str, S.normalize("NFD")), "\u017F\u0323\u0307")
 * assert.deepStrictEqual(pipe(str, S.normalize("NFKC")), "\u1E69")
 * assert.deepStrictEqual(pipe(str, S.normalize("NFKD")), "\u0073\u0323\u0307")
 *
 * @since 2.0.0
 */
const normalize = form => self => self.normalize(form);
exports.normalize = normalize;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("a", S.padEnd(5)), "a    ")
 * assert.deepStrictEqual(pipe("a", S.padEnd(5, "_")), "a____")
 *
 * @since 2.0.0
 */
const padEnd = (maxLength, fillString) => self => self.padEnd(maxLength, fillString);
exports.padEnd = padEnd;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("a", S.padStart(5)), "    a")
 * assert.deepStrictEqual(pipe("a", S.padStart(5, "_")), "____a")
 *
 * @since 2.0.0
 */
const padStart = (maxLength, fillString) => self => self.padStart(maxLength, fillString);
exports.padStart = padStart;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("a", S.repeat(5)), "aaaaa")
 *
 * @since 2.0.0
 */
const repeat = count => self => self.repeat(count);
exports.repeat = repeat;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("ababb", S.replaceAll("b", "c")), "acacc")
 * assert.deepStrictEqual(pipe("ababb", S.replaceAll(/ba/g, "cc")), "accbb")
 *
 * @since 2.0.0
 */
const replaceAll = (searchValue, replaceValue) => self => self.replaceAll(searchValue, replaceValue);
exports.replaceAll = replaceAll;
/**
 * @example
 * import * as S from 'effect/String'
 * import * as Option from 'effect/Option'
 * import { pipe } from 'effect/Function'
 *
 * assert.deepStrictEqual(pipe("ababb", S.search("b")), Option.some(1))
 * assert.deepStrictEqual(pipe("ababb", S.search(/abb/)), Option.some(2))
 * assert.deepStrictEqual(pipe("ababb", S.search("d")), Option.none())
 *
 * @since 2.0.0
 */
exports.search = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, regexp) => Option.filter(Option.some(self.search(regexp)), number.greaterThanOrEqualTo(0)));
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * const str = "\u0130"
 * assert.deepStrictEqual(pipe(str, S.toLocaleLowerCase("tr")), "i")
 *
 * @since 2.0.0
 */
const toLocaleLowerCase = locale => self => self.toLocaleLowerCase(locale);
exports.toLocaleLowerCase = toLocaleLowerCase;
/**
 * @example
 * import * as S from 'effect/String'
 * import { pipe } from 'effect/Function'
 *
 * const str = "i\u0307"
 * assert.deepStrictEqual(pipe(str, S.toLocaleUpperCase("lt-LT")), "I")
 *
 * @since 2.0.0
 */
const toLocaleUpperCase = locale => self => self.toLocaleUpperCase(locale);
exports.toLocaleUpperCase = toLocaleUpperCase;
/**
 * Keep the specified number of characters from the start of a string.
 *
 * If `n` is larger than the available number of characters, the string will
 * be returned whole.
 *
 * If `n` is not a positive number, an empty string will be returned.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import * as S from 'effect/String'
 *
 * assert.deepStrictEqual(S.takeLeft("Hello World", 5), "Hello")
 *
 * @since 2.0.0
 */
exports.takeLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => self.slice(0, Math.max(n, 0)));
/**
 * Keep the specified number of characters from the end of a string.
 *
 * If `n` is larger than the available number of characters, the string will
 * be returned whole.
 *
 * If `n` is not a positive number, an empty string will be returned.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import * as S from 'effect/String'
 *
 * assert.deepStrictEqual(S.takeRight("Hello World", 5), "World")
 *
 * @since 2.0.0
 */
exports.takeRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => self.slice(Math.max(0, self.length - Math.floor(n)), Infinity));
const CR = 0x0d;
const LF = 0x0a;
/**
 * Returns an `IterableIterator` which yields each line contained within the
 * string, trimming off the trailing newline character.
 *
 * @since 2.0.0
 */
// export const linesIterator = (self: string): LinesIterator => linesSeparated(self, true)
/**
 * Returns an `IterableIterator` which yields each line contained within the
 * string as well as the trailing newline character.
 *
 * @since 2.0.0
 */
const linesWithSeparators = s => linesSeparated(s, false);
exports.linesWithSeparators = linesWithSeparators;
/**
 * For every line in this string, strip a leading prefix consisting of blanks
 * or control characters followed by the character specified by `marginChar`
 * from the line.
 *
 * @since 2.0.0
 */
exports.stripMarginWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, marginChar) => {
  let out = "";
  for (const line of (0, exports.linesWithSeparators)(self)) {
    let index = 0;
    while (index < line.length && line.charAt(index) <= " ") {
      index = index + 1;
    }
    const stripped = index < line.length && line.charAt(index) === marginChar ? line.substring(index + 1) : line;
    out = out + stripped;
  }
  return out;
});
/**
 * For every line in this string, strip a leading prefix consisting of blanks
 * or control characters followed by the `"|"` character from the line.
 *
 * @since 2.0.0
 */
const stripMargin = self => (0, exports.stripMarginWith)(self, "|");
exports.stripMargin = stripMargin;
class LinesIterator {
  s;
  stripped;
  index;
  length;
  constructor(s, stripped = false) {
    this.s = s;
    this.stripped = stripped;
    this.index = 0;
    this.length = s.length;
  }
  next() {
    if (this.done) {
      return {
        done: true,
        value: undefined
      };
    }
    const start = this.index;
    while (!this.done && !isLineBreak(this.s[this.index])) {
      this.index = this.index + 1;
    }
    let end = this.index;
    if (!this.done) {
      const char = this.s[this.index];
      this.index = this.index + 1;
      if (!this.done && isLineBreak2(char, this.s[this.index])) {
        this.index = this.index + 1;
      }
      if (!this.stripped) {
        end = this.index;
      }
    }
    return {
      done: false,
      value: this.s.substring(start, end)
    };
  }
  [Symbol.iterator]() {
    return new LinesIterator(this.s, this.stripped);
  }
  get done() {
    return this.index >= this.length;
  }
}
/**
 * Test if the provided character is a line break character (i.e. either `"\r"`
 * or `"\n"`).
 */
const isLineBreak = char => {
  const code = char.charCodeAt(0);
  return code === CR || code === LF;
};
/**
 * Test if the provided characters combine to form a carriage return/line-feed
 * (i.e. `"\r\n"`).
 */
const isLineBreak2 = (char0, char1) => char0.charCodeAt(0) === CR && char1.charCodeAt(0) === LF;
const linesSeparated = (self, stripped) => new LinesIterator(self, stripped);
//# sourceMappingURL=String.js.map