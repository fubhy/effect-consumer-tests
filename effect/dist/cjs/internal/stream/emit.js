"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make = void 0;
const Cause = /*#__PURE__*/require("../../Cause.js");
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Effect = /*#__PURE__*/require("../../Effect.js");
const Exit = /*#__PURE__*/require("../../Exit.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const Option = /*#__PURE__*/require("../../Option.js");
/** @internal */
const make = emit => {
  const ops = {
    chunk(as) {
      return this(Effect.succeed(as));
    },
    die(defect) {
      return this(Effect.die(defect));
    },
    dieMessage(message) {
      return this(Effect.dieMessage(message));
    },
    done(exit) {
      return this(Effect.suspend(() => Exit.mapBoth(exit, {
        onFailure: Option.some,
        onSuccess: Chunk.of
      })));
    },
    end() {
      return this(Effect.fail(Option.none()));
    },
    fail(e) {
      return this(Effect.fail(Option.some(e)));
    },
    fromEffect(effect) {
      return this(Effect.mapBoth(effect, {
        onFailure: Option.some,
        onSuccess: Chunk.of
      }));
    },
    fromEffectChunk(effect) {
      return this((0, Function_js_1.pipe)(effect, Effect.mapError(Option.some)));
    },
    halt(cause) {
      return this(Effect.failCause((0, Function_js_1.pipe)(cause, Cause.map(Option.some))));
    },
    single(value) {
      return this(Effect.succeed(Chunk.of(value)));
    }
  };
  return Object.assign(emit, ops);
};
exports.make = make;
//# sourceMappingURL=emit.js.map