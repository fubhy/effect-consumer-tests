import * as core from "./core.js";
/** @internal */
export const match = (options, sequential, unbounded, bounded) => {
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
/** @internal */
export const matchSimple = (options, sequential, concurrent) => {
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
//# sourceMappingURL=concurrency.js.map