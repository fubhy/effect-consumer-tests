"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromDequeue = exports.failCause = exports.fail = exports.end = exports.empty = exports.emitChunk = exports.emit = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Effect = /*#__PURE__*/require("../../Effect.js");
const Option = /*#__PURE__*/require("../../Option.js");
const Queue = /*#__PURE__*/require("../../Queue.js");
const take = /*#__PURE__*/require("../take.js");
/** @internal */
const emit = value => Effect.succeed(Chunk.of(value));
exports.emit = emit;
/** @internal */
const emitChunk = chunk => Effect.succeed(chunk);
exports.emitChunk = emitChunk;
/** @internal */
const empty = () => Effect.succeed(Chunk.empty());
exports.empty = empty;
/** @internal */
const end = () => Effect.fail(Option.none());
exports.end = end;
/** @internal */
const fail = error => Effect.fail(Option.some(error));
exports.fail = fail;
/** @internal */
const failCause = cause => Effect.mapError(Effect.failCause(cause), Option.some);
exports.failCause = failCause;
/** @internal */
const fromDequeue = dequeue => Effect.flatMap(Queue.take(dequeue), take.done);
exports.fromDequeue = fromDequeue;
//# sourceMappingURL=pull.js.map