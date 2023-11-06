"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultConsole = exports.consoleTag = exports.TypeId = void 0;
const Context = /*#__PURE__*/require("../../Context.js");
const core = /*#__PURE__*/require("../core.js");
/** @internal */
exports.TypeId = /*#__PURE__*/Symbol.for("effect/Console");
/** @internal */
exports.consoleTag = /*#__PURE__*/Context.Tag(exports.TypeId);
/** @internal */
exports.defaultConsole = {
  [exports.TypeId]: exports.TypeId,
  assert(condition, ...args) {
    return core.sync(() => {
      console.assert(condition, ...args);
    });
  },
  clear: /*#__PURE__*/core.sync(() => {
    console.clear();
  }),
  count(label) {
    return core.sync(() => {
      console.count(label);
    });
  },
  countReset(label) {
    return core.sync(() => {
      console.countReset(label);
    });
  },
  debug(...args) {
    return core.sync(() => {
      console.debug(...args);
    });
  },
  dir(item, options) {
    return core.sync(() => {
      console.dir(item, options);
    });
  },
  dirxml(...args) {
    return core.sync(() => {
      console.dirxml(...args);
    });
  },
  error(...args) {
    return core.sync(() => {
      console.error(...args);
    });
  },
  group(options) {
    return options?.collapsed ? core.sync(() => console.groupCollapsed(options?.label)) : core.sync(() => console.group(options?.label));
  },
  groupEnd: /*#__PURE__*/core.sync(() => {
    console.groupEnd();
  }),
  info(...args) {
    return core.sync(() => {
      console.info(...args);
    });
  },
  log(...args) {
    return core.sync(() => {
      console.log(...args);
    });
  },
  table(tabularData, properties) {
    return core.sync(() => {
      console.table(tabularData, properties);
    });
  },
  time(label) {
    return core.sync(() => console.time(label));
  },
  timeEnd(label) {
    return core.sync(() => console.timeEnd(label));
  },
  timeLog(label, ...args) {
    return core.sync(() => {
      console.timeLog(label, ...args);
    });
  },
  trace(...args) {
    return core.sync(() => {
      console.trace(...args);
    });
  },
  warn(...args) {
    return core.sync(() => {
      console.warn(...args);
    });
  },
  unsafe: console
};
//# sourceMappingURL=console.js.map