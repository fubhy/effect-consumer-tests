"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchSimple = exports.match = void 0;
const core = /*#__PURE__*/require("./core.js");
/** @internal */
const match = (options, sequential, unbounded, bounded) => {
  switch (options?.concurrency) {
    case undefined:
      {
        return sequential();
      }
    case "unbounded":
      {
        return unbounded();
      }
    case "inherit":
      {
        return core.fiberRefGetWith(core.currentConcurrency, concurrency => concurrency === "unbounded" ? unbounded() : concurrency > 1 ? bounded(concurrency) : sequential());
      }
    default:
      {
        return options.concurrency > 1 ? bounded(options.concurrency) : sequential();
      }
  }
};
exports.match = match;
/** @internal */
const matchSimple = (options, sequential, concurrent) => {
  switch (options?.concurrency) {
    case undefined:
      {
        return sequential();
      }
    case "unbounded":
      {
        return concurrent();
      }
    case "inherit":
      {
        return core.fiberRefGetWith(core.currentConcurrency, concurrency => concurrency === "unbounded" ? concurrent() : concurrency > 1 ? concurrent() : sequential());
      }
    default:
      {
        return options.concurrency > 1 ? concurrent() : sequential();
      }
  }
};
exports.matchSimple = matchSimple;
//# sourceMappingURL=concurrency.js.map