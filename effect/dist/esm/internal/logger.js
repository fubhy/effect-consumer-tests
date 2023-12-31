import { constVoid, dual, pipe } from "../Function.js";
import * as HashMap from "../HashMap.js";
import * as List from "../List.js";
import * as LogSpan from "../LogSpan.js";
import * as Option from "../Option.js";
import { pipeArguments } from "../Pipeable.js";
import * as Cause from "./cause.js";
import * as _fiberId from "./fiberId.js";
/** @internal */
const LoggerSymbolKey = "effect/Logger";
/** @internal */
export const LoggerTypeId = /*#__PURE__*/Symbol.for(LoggerSymbolKey);
/** @internal */
const loggerVariance = {
  _Message: _ => _,
  _Output: _ => _
};
/** @internal */
export const makeLogger = log => ({
  [LoggerTypeId]: loggerVariance,
  log,
  pipe() {
    return pipeArguments(this, arguments);
  }
});
/** @internal */
export const mapInput = /*#__PURE__*/dual(2, (self, f) => makeLogger(options => self.log({
  ...options,
  message: f(options.message)
})));
/** @internal */
export const filterLogLevel = /*#__PURE__*/dual(2, (self, f) => makeLogger(options => f(options.logLevel) ? Option.some(self.log(options)) : Option.none()));
/** @internal */
export const map = /*#__PURE__*/dual(2, (self, f) => makeLogger(options => f(self.log(options))));
/** @internal */
export const none = {
  [LoggerTypeId]: loggerVariance,
  log: constVoid,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
/** @internal */
export const simple = log => ({
  [LoggerTypeId]: loggerVariance,
  log: ({
    message
  }) => log(message),
  pipe() {
    return pipeArguments(this, arguments);
  }
});
/** @internal */
export const succeed = value => {
  return simple(() => value);
};
/** @internal */
export const sync = evaluate => {
  return simple(evaluate);
};
/** @internal */
export const zip = /*#__PURE__*/dual(2, (self, that) => makeLogger(options => [self.log(options), that.log(options)]));
/** @internal */
export const zipLeft = /*#__PURE__*/dual(2, (self, that) => map(zip(self, that), tuple => tuple[0]));
/** @internal */
export const zipRight = /*#__PURE__*/dual(2, (self, that) => map(zip(self, that), tuple => tuple[1]));
/** @internal */
export const stringLogger = /*#__PURE__*/makeLogger(({
  annotations,
  cause,
  date,
  fiberId,
  logLevel,
  message,
  spans
}) => {
  const nowMillis = date.getTime();
  const outputArray = [`timestamp=${date.toISOString()}`, `level=${logLevel.label}`, `fiber=${_fiberId.threadName(fiberId)}`];
  let output = outputArray.join(" ");
  const stringMessage = serializeUnknown(message);
  if (stringMessage.length > 0) {
    output = output + " message=";
    output = appendQuoted(stringMessage, output);
  }
  if (cause != null && cause._tag !== "Empty") {
    output = output + " cause=";
    output = appendQuoted(Cause.pretty(cause), output);
  }
  if (List.isCons(spans)) {
    output = output + " ";
    let first = true;
    for (const span of spans) {
      if (first) {
        first = false;
      } else {
        output = output + " ";
      }
      output = output + pipe(span, LogSpan.render(nowMillis));
    }
  }
  if (pipe(annotations, HashMap.size) > 0) {
    output = output + " ";
    let first = true;
    for (const [key, value] of annotations) {
      if (first) {
        first = false;
      } else {
        output = output + " ";
      }
      output = output + filterKeyName(key);
      output = output + "=";
      output = appendQuoted(serializeUnknown(value), output);
    }
  }
  return output;
});
export const serializeUnknown = u => {
  try {
    return typeof u === "object" ? JSON.stringify(u) : String(u);
  } catch (_) {
    return String(u);
  }
};
/** @internal */
const escapeDoubleQuotes = str => `"${str.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
const textOnly = /^[^\s"=]+$/;
/** @internal */
const appendQuoted = (label, output) => output + (label.match(textOnly) ? label : escapeDoubleQuotes(label));
/** @internal */
export const logfmtLogger = /*#__PURE__*/makeLogger(({
  annotations,
  cause,
  date,
  fiberId,
  logLevel,
  message,
  spans
}) => {
  const nowMillis = date.getTime();
  const outputArray = [`timestamp=${date.toISOString()}`, `level=${logLevel.label}`, `fiber=${_fiberId.threadName(fiberId)}`];
  let output = outputArray.join(" ");
  const stringMessage = serializeUnknown(message);
  if (stringMessage.length > 0) {
    output = output + " message=";
    output = appendQuotedLogfmt(stringMessage, output);
  }
  if (cause != null && cause._tag !== "Empty") {
    output = output + " cause=";
    output = appendQuotedLogfmt(Cause.pretty(cause), output);
  }
  if (List.isCons(spans)) {
    output = output + " ";
    let first = true;
    for (const span of spans) {
      if (first) {
        first = false;
      } else {
        output = output + " ";
      }
      output = output + pipe(span, renderLogSpanLogfmt(nowMillis));
    }
  }
  if (pipe(annotations, HashMap.size) > 0) {
    output = output + " ";
    let first = true;
    for (const [key, value] of annotations) {
      if (first) {
        first = false;
      } else {
        output = output + " ";
      }
      output = output + filterKeyName(key);
      output = output + "=";
      output = appendQuotedLogfmt(serializeUnknown(value), output);
    }
  }
  return output;
});
/** @internal */
const filterKeyName = key => key.replace(/[\s="]/g, "_");
/** @internal */
const escapeDoubleQuotesLogfmt = str => JSON.stringify(str);
/** @internal */
const appendQuotedLogfmt = (label, output) => output + (label.match(textOnly) ? label : escapeDoubleQuotesLogfmt(label));
/** @internal */
const renderLogSpanLogfmt = now => self => {
  const label = filterKeyName(self.label);
  return `${label}=${now - self.startTime}ms`;
};
//# sourceMappingURL=logger.js.map