"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = exports.unnested = exports.nested = exports.mapName = exports.andThen = exports.empty = void 0;
const Either = /*#__PURE__*/require("../../Either.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const List = /*#__PURE__*/require("../../List.js");
const Option = /*#__PURE__*/require("../../Option.js");
const RA = /*#__PURE__*/require("../../ReadonlyArray.js");
const configError = /*#__PURE__*/require("../configError.js");
/** @internal */
exports.empty = {
  _tag: "Empty"
};
/** @internal */
exports.andThen = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => ({
  _tag: "AndThen",
  first: self,
  second: that
}));
/** @internal */
exports.mapName = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.andThen)(self, {
  _tag: "MapName",
  f
}));
/** @internal */
exports.nested = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, name) => (0, exports.andThen)(self, {
  _tag: "Nested",
  name
}));
/** @internal */
exports.unnested = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, name) => (0, exports.andThen)(self, {
  _tag: "Unnested",
  name
}));
/** @internal */
exports.patch = /*#__PURE__*/(0, Function_js_1.dual)(2, (path, patch) => {
  let input = List.of(patch);
  let output = path;
  while (List.isCons(input)) {
    const patch = input.head;
    switch (patch._tag) {
      case "Empty":
        {
          input = input.tail;
          break;
        }
      case "AndThen":
        {
          input = List.cons(patch.first, List.cons(patch.second, input.tail));
          break;
        }
      case "MapName":
        {
          output = RA.map(output, patch.f);
          input = input.tail;
          break;
        }
      case "Nested":
        {
          output = RA.prepend(output, patch.name);
          input = input.tail;
          break;
        }
      case "Unnested":
        {
          const containsName = (0, Function_js_1.pipe)(RA.head(output), Option.contains(patch.name));
          if (containsName) {
            output = RA.tailNonEmpty(output);
            input = input.tail;
          } else {
            return Either.left(configError.MissingData(output, `Expected ${patch.name} to be in path in ConfigProvider#unnested`));
          }
          break;
        }
    }
  }
  return Either.right(output);
});
//# sourceMappingURL=pathPatch.js.map