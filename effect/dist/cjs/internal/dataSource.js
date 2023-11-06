"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.race = exports.provideContext = exports.never = exports.fromEffectTagged = exports.fromEffect = exports.fromFunctionBatched = exports.fromFunction = exports.eitherWith = exports.mapInputContext = exports.batchN = exports.around = exports.makeBatched = exports.makeWithEntry = exports.make = void 0;
const Cause = /*#__PURE__*/require("../Cause.js");
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Effect = /*#__PURE__*/require("../Effect.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const RA = /*#__PURE__*/require("../ReadonlyArray.js");
const core = /*#__PURE__*/require("./core.js");
const fiberRuntime_js_1 = /*#__PURE__*/require("./fiberRuntime.js");
const request_js_1 = /*#__PURE__*/require("./request.js");
/** @internal */
const make = runAll => new core.RequestResolverImpl(requests => runAll(requests.map(_ => _.map(_ => _.request))));
exports.make = make;
/** @internal */
const makeWithEntry = runAll => new core.RequestResolverImpl(requests => runAll(requests));
exports.makeWithEntry = makeWithEntry;
/** @internal */
const makeBatched = run => new core.RequestResolverImpl(requests => requests.length > 1 ? core.forEachSequentialDiscard(requests, block => (0, fiberRuntime_js_1.invokeWithInterrupt)(run(block.filter(_ => !_.state.completed).map(_ => _.request)), block)) : requests.length === 1 ? run(requests[0].filter(_ => !_.state.completed).map(_ => _.request)) : core.unit);
exports.makeBatched = makeBatched;
/** @internal */
exports.around = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, before, after) => new core.RequestResolverImpl(requests => core.acquireUseRelease(before, () => self.runAll(requests), after), Chunk.make("Around", self, before, after)));
/** @internal */
exports.batchN = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, n) => new core.RequestResolverImpl(requests => {
  return n < 1 ? core.die(Cause.IllegalArgumentException("RequestResolver.batchN: n must be at least 1")) : self.runAll(Array.from(Chunk.map(RA.reduce(requests, Chunk.empty(), (acc, chunk) => Chunk.appendAll(acc, Chunk.chunksOf(Chunk.unsafeFromArray(chunk), n))), chunk => Array.from(chunk))));
}, Chunk.make("BatchN", self, n)));
/** @internal */
exports.mapInputContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => new core.RequestResolverImpl(requests => core.mapInputContext(self.runAll(requests), context => f(context)), Chunk.make("MapInputContext", self, f)));
/** @internal */
exports.eitherWith = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, that, f) => new core.RequestResolverImpl(batch => (0, Function_js_1.pipe)(core.forEachSequential(batch, requests => {
  const [as, bs] = (0, Function_js_1.pipe)(requests, RA.partitionMap(f));
  return (0, fiberRuntime_js_1.zipWithOptions)(self.runAll(Array.of(as)), that.runAll(Array.of(bs)), () => void 0, {
    concurrent: true
  });
})), Chunk.make("EitherWith", self, that, f)));
/** @internal */
const fromFunction = f => (0, exports.makeBatched)(requests => core.forEachSequentialDiscard(requests, request => (0, request_js_1.complete)(request, core.exitSucceed(f(request))))).identified("FromFunction", f);
exports.fromFunction = fromFunction;
/** @internal */
const fromFunctionBatched = f => (0, exports.makeBatched)(as => Effect.forEach(f(as), (res, i) => (0, request_js_1.complete)(as[i], core.exitSucceed(res)), {
  discard: true
})).identified("FromFunctionBatched", f);
exports.fromFunctionBatched = fromFunctionBatched;
/** @internal */
const fromEffect = f => (0, exports.makeBatched)(requests => Effect.forEach(requests, a => Effect.flatMap(Effect.exit(f(a)), e => (0, request_js_1.complete)(a, e)), {
  concurrency: "unbounded",
  discard: true
})).identified("FromEffect", f);
exports.fromEffect = fromEffect;
/** @internal */
const fromEffectTagged = () => fns => (0, exports.makeBatched)(requests => {
  const grouped = {};
  const tags = [];
  for (let i = 0, len = requests.length; i < len; i++) {
    if (tags.includes(requests[i]._tag)) {
      grouped[requests[i]._tag].push(requests[i]);
    } else {
      grouped[requests[i]._tag] = [requests[i]];
      tags.push(requests[i]._tag);
    }
  }
  return Effect.forEach(tags, tag => Effect.matchCauseEffect(fns[tag](grouped[tag]), {
    onFailure: cause => Effect.forEach(grouped[tag], req => (0, request_js_1.complete)(req, core.exitFail(cause)), {
      discard: true
    }),
    onSuccess: res => Effect.forEach(grouped[tag], (req, i) => (0, request_js_1.complete)(req, core.exitSucceed(res[i])), {
      discard: true
    })
  }), {
    concurrency: "unbounded",
    discard: true
  });
}).identified("FromEffectTagged", fns);
exports.fromEffectTagged = fromEffectTagged;
/** @internal */
exports.never = /*#__PURE__*/(0, exports.make)(() => Effect.never).identified("Never");
/** @internal */
exports.provideContext = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, context) => (0, exports.mapInputContext)(self, _ => context).identified("ProvideContext", self, context));
/** @internal */
exports.race = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => new core.RequestResolverImpl(requests => Effect.race(self.runAll(requests), that.runAll(requests))).identified("Race", self, that));
//# sourceMappingURL=dataSource.js.map