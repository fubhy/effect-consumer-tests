"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterOutCompleted = exports.Listeners = exports.succeed = exports.fail = exports.completeEffect = exports.complete = exports.tagged = exports.of = exports.isRequest = exports.RequestTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const completedRequestMap = /*#__PURE__*/require("./completedRequestMap.js");
const core = /*#__PURE__*/require("./core.js");
const Data = /*#__PURE__*/require("./data.js");
/** @internal */
const RequestSymbolKey = "effect/Request";
/** @internal */
exports.RequestTypeId = /*#__PURE__*/Symbol.for(RequestSymbolKey);
/** @internal */
const requestVariance = {
  _E: _ => _,
  _A: _ => _
};
/** @internal */
const isRequest = u => (0, Predicate_js_1.hasProperty)(u, exports.RequestTypeId);
exports.isRequest = isRequest;
/** @internal */
const of = () => args =>
// @ts-expect-error
Data.struct({
  [exports.RequestTypeId]: requestVariance,
  ...args
});
exports.of = of;
/** @internal */
const tagged = tag => args =>
// @ts-expect-error
Data.struct({
  [exports.RequestTypeId]: requestVariance,
  _tag: tag,
  ...args
});
exports.tagged = tagged;
/** @internal */
exports.complete = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, result) => core.fiberRefGetWith(completedRequestMap.currentRequestMap, map => core.sync(() => {
  if (map.has(self)) {
    const entry = map.get(self);
    if (!entry.state.completed) {
      entry.state.completed = true;
      core.deferredUnsafeDone(entry.result, result);
    }
  }
})));
/** @internal */
exports.completeEffect = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, effect) => core.matchEffect(effect, {
  onFailure: error => (0, exports.complete)(self, core.exitFail(error)),
  onSuccess: value => (0, exports.complete)(self, core.exitSucceed(value))
}));
/** @internal */
exports.fail = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, error) => (0, exports.complete)(self, core.exitFail(error)));
/** @internal */
exports.succeed = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, value) => (0, exports.complete)(self, core.exitSucceed(value)));
/** @internal */
class Listeners {
  count = 0;
  observers = new Set();
  addObserver(f) {
    this.observers.add(f);
  }
  removeObserver(f) {
    this.observers.delete(f);
  }
  increment() {
    this.count++;
    this.observers.forEach(f => f(this.count));
  }
  decrement() {
    this.count--;
    this.observers.forEach(f => f(this.count));
  }
}
exports.Listeners = Listeners;
/**
 * @internal
 */
const filterOutCompleted = requests => core.fiberRefGetWith(completedRequestMap.currentRequestMap, map => core.succeed(requests.filter(request => !(map.get(request)?.state.completed === true))));
exports.filterOutCompleted = filterOutCompleted;
//# sourceMappingURL=request.js.map