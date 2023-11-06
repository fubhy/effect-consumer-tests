"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = exports.isParallelN = exports.isParallel = exports.isSequential = exports.parallelN = exports.parallel = exports.sequential = exports.OP_PARALLEL_N = exports.OP_PARALLEL = exports.OP_SEQUENTIAL = void 0;
const Function_js_1 = /*#__PURE__*/require("../Function.js");
/** @internal */
exports.OP_SEQUENTIAL = "Sequential";
/** @internal */
exports.OP_PARALLEL = "Parallel";
/** @internal */
exports.OP_PARALLEL_N = "ParallelN";
/** @internal */
exports.sequential = {
  _tag: exports.OP_SEQUENTIAL
};
/** @internal */
exports.parallel = {
  _tag: exports.OP_PARALLEL
};
/** @internal */
const parallelN = parallelism => ({
  _tag: exports.OP_PARALLEL_N,
  parallelism
});
exports.parallelN = parallelN;
/** @internal */
const isSequential = self => self._tag === exports.OP_SEQUENTIAL;
exports.isSequential = isSequential;
/** @internal */
const isParallel = self => self._tag === exports.OP_PARALLEL;
exports.isParallel = isParallel;
/** @internal */
const isParallelN = self => self._tag === exports.OP_PARALLEL_N;
exports.isParallelN = isParallelN;
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(4, (self, onSequential, onParallel, onParallelN) => {
  switch (self._tag) {
    case exports.OP_SEQUENTIAL:
      {
        return onSequential();
      }
    case exports.OP_PARALLEL:
      {
        return onParallel();
      }
    case exports.OP_PARALLEL_N:
      {
        return onParallelN(self.parallelism);
      }
  }
});
//# sourceMappingURL=executionStrategy.js.map