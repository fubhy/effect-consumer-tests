"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.externalSpan = exports.nativeTracer = exports.NativeSpan = exports.spanTag = exports.tracerTag = exports.make = exports.TracerTypeId = void 0;
/**
 * @since 2.0.0
 */
const Context = /*#__PURE__*/require("../Context.js");
const GlobalValue_js_1 = /*#__PURE__*/require("../GlobalValue.js");
const MutableRef = /*#__PURE__*/require("../MutableRef.js");
/** @internal */
exports.TracerTypeId = /*#__PURE__*/Symbol.for("effect/Tracer");
/** @internal */
const make = options => ({
  [exports.TracerTypeId]: exports.TracerTypeId,
  ...options
});
exports.make = make;
/** @internal */
exports.tracerTag = /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/Tracer"));
/** @internal */
exports.spanTag = /*#__PURE__*/Context.Tag( /*#__PURE__*/Symbol.for("effect/ParentSpan"));
const ids = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)("effect/Tracer/SpanId.ids", () => MutableRef.make(0));
/** @internal */
class NativeSpan {
  name;
  parent;
  context;
  links;
  startTime;
  _tag = "Span";
  spanId;
  traceId = "native";
  sampled = true;
  status;
  attributes;
  events = [];
  constructor(name, parent, context, links, startTime) {
    this.name = name;
    this.parent = parent;
    this.context = context;
    this.links = links;
    this.startTime = startTime;
    this.status = {
      _tag: "Started",
      startTime
    };
    this.attributes = new Map();
    this.spanId = `span${MutableRef.incrementAndGet(ids)}`;
  }
  end = (endTime, exit) => {
    this.status = {
      _tag: "Ended",
      endTime,
      exit,
      startTime: this.status.startTime
    };
  };
  attribute = (key, value) => {
    this.attributes.set(key, value);
  };
  event = (name, startTime, attributes) => {
    this.events.push([name, startTime, attributes ?? {}]);
  };
}
exports.NativeSpan = NativeSpan;
/** @internal */
exports.nativeTracer = /*#__PURE__*/(0, exports.make)({
  span: (name, parent, context, links, startTime) => new NativeSpan(name, parent, context, links, startTime),
  context: f => f()
});
/** @internal */
const externalSpan = options => ({
  _tag: "ExternalSpan",
  spanId: options.spanId,
  traceId: options.traceId,
  sampled: options.sampled ?? true,
  context: options.context ?? Context.empty()
});
exports.externalSpan = externalSpan;
//# sourceMappingURL=tracer.js.map