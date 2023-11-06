"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logfmtLogger = exports.serializeUnknown = exports.stringLogger = exports.zipRight = exports.zipLeft = exports.zip = exports.sync = exports.succeed = exports.simple = exports.none = exports.map = exports.filterLogLevel = exports.mapInput = exports.makeLogger = exports.LoggerTypeId = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const List = /*#__PURE__*/require("../List.js");
const LogSpan = /*#__PURE__*/require("../LogSpan.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Cause = /*#__PURE__*/require("./cause.js");
const _fiberId = /*#__PURE__*/require("./fiberId.js");
/** @internal */
const LoggerSymbolKey = "effect/Logger";
/** @internal */
exports.LoggerTypeId = /*#__PURE__*/Symbol.for(LoggerSymbolKey);
/** @internal */
const loggerVariance = {
  _Message: _ => _,
  _Output: _ => _
};
/** @internal */
const makeLogger = log => ({
  [exports.LoggerTypeId]: loggerVariance,
  log,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
});
exports.makeLogger = makeLogger;
/** @internal */
exports.mapInput = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeLogger)(options => self.log({
  ...options,
  message: f(options.message)
})));
/** @internal */
exports.filterLogLevel = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeLogger)(options => f(options.logLevel) ? Option.some(self.log(options)) : Option.none()));
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.makeLogger)(options => f(self.log(options))));
/** @internal */
exports.none = {
  [exports.LoggerTypeId]: loggerVariance,
  log: Function_js_1.constVoid,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
};
/** @internal */
const simple = log => ({
  [exports.LoggerTypeId]: loggerVariance,
  log: ({
    message
  }) => log(message),
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  }
});
exports.simple = simple;
/** @internal */
const succeed = value => {
  return (0, exports.simple)(() => value);
};
exports.succeed = succeed;
/** @internal */
const sync = evaluate => {
  return (0, exports.simple)(evaluate);
};
exports.sync = sync;
/** @internal */
exports.zip = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.makeLogger)(options => [self.log(options), that.log(options)]));
/** @internal */
exports.zipLeft = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.map)((0, exports.zip)(self, that), tuple => tuple[0]));
/** @internal */
exports.zipRight = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => (0, exports.map)((0, exports.zip)(self, that), tuple => tuple[1]));
/** @internal */
exports.stringLogger = /*#__PURE__*/(0, exports.makeLogger)(({
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
  const stringMessage = (0, exports.serializeUnknown)(message);
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
      output = output + (0, Function_js_1.pipe)(span, LogSpan.render(nowMillis));
    }
  }
  if ((0, Function_js_1.pipe)(annotations, HashMap.size) > 0) {
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
      output = appendQuoted((0, exports.serializeUnknown)(value), output);
    }
  }
  return output;
});
const serializeUnknown = u => {
  try {
    return typeof u === "object" ? JSON.stringify(u) : String(u);
  } catch (_) {
    return String(u);
  }
};
exports.serializeUnknown = serializeUnknown;
/** @internal */
const escapeDoubleQuotes = str => `"${str.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
const textOnly = /^[^\s"=]+$/;
/** @internal */
const appendQuoted = (label, output) => output + (label.match(textOnly) ? label : escapeDoubleQuotes(label));
/** @internal */
exports.logfmtLogger = /*#__PURE__*/(0, exports.makeLogger)(({
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
  const stringMessage = (0, exports.serializeUnknown)(message);
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
      output = output + (0, Function_js_1.pipe)(span, renderLogSpanLogfmt(nowMillis));
    }
  }
  if ((0, Function_js_1.pipe)(annotations, HashMap.size) > 0) {
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
      output = appendQuotedLogfmt((0, exports.serializeUnknown)(value), output);
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