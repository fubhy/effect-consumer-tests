"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = exports.reduce = exports.concat = void 0;
/** @internal */
function concat(that) {
  return self => {
    return {
      [Symbol.iterator]() {
        const iterA = self[Symbol.iterator]();
        let doneA = false;
        let iterB;
        return {
          next() {
            if (!doneA) {
              const r = iterA.next();
              if (r.done) {
                doneA = true;
                iterB = that[Symbol.iterator]();
                return iterB.next();
              }
              return r;
            }
            return iterB.next();
          }
        };
      }
    };
  };
}
exports.concat = concat;
/** @internal */
function reduce(b, f) {
  return function (iterable) {
    if (Array.isArray(iterable)) {
      return iterable.reduce(f, b);
    }
    let result = b;
    for (const n of iterable) {
      result = f(result, n);
    }
    return result;
  };
}
exports.reduce = reduce;
/** @internal */
function map(f) {
  return function (iterable) {
    if (Array.isArray(iterable)) {
      return iterable.map(f);
    }
    return function* () {
      for (const n of iterable) {
        yield f(n);
      }
    }();
  };
}
exports.map = map;
//# sourceMappingURL=Iterable.js.map