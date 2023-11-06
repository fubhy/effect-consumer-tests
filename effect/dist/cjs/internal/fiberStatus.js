"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSuspended = exports.isRunning = exports.isDone = exports.isFiberStatus = exports.suspended = exports.running = exports.done = exports.OP_SUSPENDED = exports.OP_RUNNING = exports.OP_DONE = exports.FiberStatusTypeId = void 0;
const Equal = /*#__PURE__*/require("../Equal.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const FiberStatusSymbolKey = "effect/FiberStatus";
/** @internal */
exports.FiberStatusTypeId = /*#__PURE__*/Symbol.for(FiberStatusSymbolKey);
/** @internal */
exports.OP_DONE = "Done";
/** @internal */
exports.OP_RUNNING = "Running";
/** @internal */
exports.OP_SUSPENDED = "Suspended";
/** @internal */
class Done {
  [exports.FiberStatusTypeId] = exports.FiberStatusTypeId;
  _tag = exports.OP_DONE;
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(FiberStatusSymbolKey), Hash.combine(Hash.hash(this._tag)));
  }
  [Equal.symbol](that) {
    return (0, exports.isFiberStatus)(that) && that._tag === exports.OP_DONE;
  }
}
/** @internal */
class Running {
  runtimeFlags;
  [exports.FiberStatusTypeId] = exports.FiberStatusTypeId;
  _tag = exports.OP_RUNNING;
  constructor(runtimeFlags) {
    this.runtimeFlags = runtimeFlags;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(FiberStatusSymbolKey), Hash.combine(Hash.hash(this._tag)), Hash.combine(Hash.hash(this.runtimeFlags)));
  }
  [Equal.symbol](that) {
    return (0, exports.isFiberStatus)(that) && that._tag === exports.OP_RUNNING && this.runtimeFlags === that.runtimeFlags;
  }
}
/** @internal */
class Suspended {
  runtimeFlags;
  blockingOn;
  [exports.FiberStatusTypeId] = exports.FiberStatusTypeId;
  _tag = exports.OP_SUSPENDED;
  constructor(runtimeFlags, blockingOn) {
    this.runtimeFlags = runtimeFlags;
    this.blockingOn = blockingOn;
  }
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(FiberStatusSymbolKey), Hash.combine(Hash.hash(this._tag)), Hash.combine(Hash.hash(this.runtimeFlags)), Hash.combine(Hash.hash(this.blockingOn)));
  }
  [Equal.symbol](that) {
    return (0, exports.isFiberStatus)(that) && that._tag === exports.OP_SUSPENDED && this.runtimeFlags === that.runtimeFlags && Equal.equals(this.blockingOn, that.blockingOn);
  }
}
/** @internal */
exports.done = /*#__PURE__*/new Done();
/** @internal */
const running = runtimeFlags => new Running(runtimeFlags);
exports.running = running;
/** @internal */
const suspended = (runtimeFlags, blockingOn) => new Suspended(runtimeFlags, blockingOn);
exports.suspended = suspended;
/** @internal */
const isFiberStatus = u => (0, Predicate_js_1.hasProperty)(u, exports.FiberStatusTypeId);
exports.isFiberStatus = isFiberStatus;
/** @internal */
const isDone = self => self._tag === exports.OP_DONE;
exports.isDone = isDone;
/** @internal */
const isRunning = self => self._tag === exports.OP_RUNNING;
exports.isRunning = isRunning;
/** @internal */
const isSuspended = self => self._tag === exports.OP_SUSPENDED;
exports.isSuspended = isSuspended;
//# sourceMappingURL=fiberStatus.js.map