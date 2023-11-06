"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTracer = exports.tracerWith = exports.shuffle = exports.nextIntBetween = exports.nextRange = exports.nextBoolean = exports.nextInt = exports.next = exports.randomWith = exports.configOrDie = exports.config = exports.configProviderWith = exports.withConfigProvider = exports.withClock = exports.currentTimeNanos = exports.currentTimeMillis = exports.clockWith = exports.sleep = exports.currentServices = exports.liveServices = void 0;
const Context = /*#__PURE__*/require("../Context.js");
const Duration = /*#__PURE__*/require("../Duration.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const clock = /*#__PURE__*/require("./clock.js");
const configProvider = /*#__PURE__*/require("./configProvider.js");
const core = /*#__PURE__*/require("./core.js");
const console_ = /*#__PURE__*/require("./defaultServices/console.js");
const random = /*#__PURE__*/require("./random.js");
const tracer = /*#__PURE__*/require("./tracer.js");
/** @internal */
exports.liveServices = /*#__PURE__*/(0, Function_js_1.pipe)( /*#__PURE__*/Context.empty(), /*#__PURE__*/Context.add(clock.clockTag, /*#__PURE__*/clock.make()), /*#__PURE__*/Context.add(console_.consoleTag, console_.defaultConsole), /*#__PURE__*/Context.add(random.randomTag, /*#__PURE__*/random.make( /*#__PURE__*/Math.random() * 4294967296 >>> 0)), /*#__PURE__*/Context.add(configProvider.configProviderTag, /*#__PURE__*/configProvider.fromEnv()), /*#__PURE__*/Context.add(tracer.tracerTag, tracer.nativeTracer));
/**
 * The `FiberRef` holding the default `Effect` services.
 *
 * @since 2.0.0
 * @category fiberRefs
 */
exports.currentServices = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/DefaultServices/currentServices"), () => core.fiberRefUnsafeMakeContext(exports.liveServices));
// circular with Clock
/** @internal */
const sleep = duration => {
  const decodedDuration = Duration.decode(duration);
  return (0, exports.clockWith)(clock => clock.sleep(decodedDuration));
};
exports.sleep = sleep;
/** @internal */
const clockWith = f => core.fiberRefGetWith(exports.currentServices, services => f(Context.get(services, clock.clockTag)));
exports.clockWith = clockWith;
/** @internal */
exports.currentTimeMillis = /*#__PURE__*/(0, exports.clockWith)(clock => clock.currentTimeMillis);
/** @internal */
exports.currentTimeNanos = /*#__PURE__*/(0, exports.clockWith)(clock => clock.currentTimeNanos);
/** @internal */
exports.withClock = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, value) => core.fiberRefLocallyWith(exports.currentServices, Context.add(clock.clockTag, value))(effect));
// circular with ConfigProvider
/** @internal */
exports.withConfigProvider = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, value) => core.fiberRefLocallyWith(exports.currentServices, Context.add(configProvider.configProviderTag, value))(effect));
/** @internal */
const configProviderWith = f => core.fiberRefGetWith(exports.currentServices, services => f(Context.get(services, configProvider.configProviderTag)));
exports.configProviderWith = configProviderWith;
/** @internal */
const config = config => (0, exports.configProviderWith)(_ => _.load(config));
exports.config = config;
/** @internal */
const configOrDie = config => core.orDie((0, exports.configProviderWith)(_ => _.load(config)));
exports.configOrDie = configOrDie;
// circular with Random
/** @internal */
const randomWith = f => core.fiberRefGetWith(exports.currentServices, services => f(Context.get(services, random.randomTag)));
exports.randomWith = randomWith;
/** @internal */
exports.next = /*#__PURE__*/(0, exports.randomWith)(random => random.next());
/** @internal */
exports.nextInt = /*#__PURE__*/(0, exports.randomWith)(random => random.nextInt());
/** @internal */
exports.nextBoolean = /*#__PURE__*/(0, exports.randomWith)(random => random.nextBoolean());
/** @internal */
const nextRange = (min, max) => (0, exports.randomWith)(random => random.nextRange(min, max));
exports.nextRange = nextRange;
/** @internal */
const nextIntBetween = (min, max) => (0, exports.randomWith)(random => random.nextIntBetween(min, max));
exports.nextIntBetween = nextIntBetween;
/** @internal */
const shuffle = elements => (0, exports.randomWith)(random => random.shuffle(elements));
exports.shuffle = shuffle;
// circular with Tracer
/** @internal */
const tracerWith = f => core.fiberRefGetWith(exports.currentServices, services => f(Context.get(services, tracer.tracerTag)));
exports.tracerWith = tracerWith;
/** @internal */
exports.withTracer = /*#__PURE__*/(0, Function_js_1.dual)(2, (effect, value) => core.fiberRefLocallyWith(exports.currentServices, Context.add(tracer.tracerTag, value))(effect));
//# sourceMappingURL=defaultServices.js.map