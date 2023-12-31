import * as Context from "../Context.js";
import * as Duration from "../Duration.js";
import { dual, pipe } from "../Function.js";
import { globalValue } from "../GlobalValue.js";
import * as clock from "./clock.js";
import * as configProvider from "./configProvider.js";
import * as core from "./core.js";
import * as console_ from "./defaultServices/console.js";
import * as random from "./random.js";
import * as tracer from "./tracer.js";
/** @internal */
export const liveServices = /*#__PURE__*/pipe( /*#__PURE__*/Context.empty(), /*#__PURE__*/Context.add(clock.clockTag, /*#__PURE__*/clock.make()), /*#__PURE__*/Context.add(console_.consoleTag, console_.defaultConsole), /*#__PURE__*/Context.add(random.randomTag, /*#__PURE__*/random.make( /*#__PURE__*/Math.random() * 4294967296 >>> 0)), /*#__PURE__*/Context.add(configProvider.configProviderTag, /*#__PURE__*/configProvider.fromEnv()), /*#__PURE__*/Context.add(tracer.tracerTag, tracer.nativeTracer));
/**
 * The `FiberRef` holding the default `Effect` services.
 *
 * @since 2.0.0
 * @category fiberRefs
 */
export const currentServices = /*#__PURE__*/globalValue( /*#__PURE__*/Symbol.for("effect/DefaultServices/currentServices"), () => core.fiberRefUnsafeMakeContext(liveServices));
// circular with Clock
/** @internal */
export const sleep = duration => {
  const decodedDuration = Duration.decode(duration);
  return clockWith(clock => clock.sleep(decodedDuration));
};
/** @internal */
export const clockWith = f => core.fiberRefGetWith(currentServices, services => f(Context.get(services, clock.clockTag)));
/** @internal */
export const currentTimeMillis = /*#__PURE__*/clockWith(clock => clock.currentTimeMillis);
/** @internal */
export const currentTimeNanos = /*#__PURE__*/clockWith(clock => clock.currentTimeNanos);
/** @internal */
export const withClock = /*#__PURE__*/dual(2, (effect, value) => core.fiberRefLocallyWith(currentServices, Context.add(clock.clockTag, value))(effect));
// circular with ConfigProvider
/** @internal */
export const withConfigProvider = /*#__PURE__*/dual(2, (effect, value) => core.fiberRefLocallyWith(currentServices, Context.add(configProvider.configProviderTag, value))(effect));
/** @internal */
export const configProviderWith = f => core.fiberRefGetWith(currentServices, services => f(Context.get(services, configProvider.configProviderTag)));
/** @internal */
export const config = config => configProviderWith(_ => _.load(config));
/** @internal */
export const configOrDie = config => core.orDie(configProviderWith(_ => _.load(config)));
// circular with Random
/** @internal */
export const randomWith = f => core.fiberRefGetWith(currentServices, services => f(Context.get(services, random.randomTag)));
/** @internal */
export const next = /*#__PURE__*/randomWith(random => random.next());
/** @internal */
export const nextInt = /*#__PURE__*/randomWith(random => random.nextInt());
/** @internal */
export const nextBoolean = /*#__PURE__*/randomWith(random => random.nextBoolean());
/** @internal */
export const nextRange = (min, max) => randomWith(random => random.nextRange(min, max));
/** @internal */
export const nextIntBetween = (min, max) => randomWith(random => random.nextIntBetween(min, max));
/** @internal */
export const shuffle = elements => randomWith(random => random.shuffle(elements));
// circular with Tracer
/** @internal */
export const tracerWith = f => core.fiberRefGetWith(currentServices, services => f(Context.get(services, tracer.tracerTag)));
/** @internal */
export const withTracer = /*#__PURE__*/dual(2, (effect, value) => core.fiberRefLocallyWith(currentServices, Context.add(tracer.tracerTag, value))(effect));
//# sourceMappingURL=defaultServices.js.map