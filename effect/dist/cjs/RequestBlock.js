"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locally = exports.mapInputContext = exports.sequential = exports.reduce = exports.parallel = exports.mapRequestResolvers = exports.empty = exports.single = void 0;
const _RequestBlock = /*#__PURE__*/require("./internal/blockedRequests.js");
const core = /*#__PURE__*/require("./internal/core.js");
const _dataSource = /*#__PURE__*/require("./internal/dataSource.js");
/**
 * @since 2.0.0
 * @category constructors
 */
exports.single = _RequestBlock.single;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.empty = _RequestBlock.empty;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.mapRequestResolvers = _RequestBlock.mapRequestResolvers;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.parallel = _RequestBlock.par;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.reduce = _RequestBlock.reduce;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.sequential = _RequestBlock.seq;
/**
 * Provides each data source with part of its required environment.
 *
 * @since 2.0.0
 * @category utils
 */
const mapInputContext = (self, f) => (0, exports.reduce)(self, MapInputContextReducer(f));
exports.mapInputContext = mapInputContext;
const MapInputContextReducer = f => ({
  emptyCase: () => exports.empty,
  parCase: (left, right) => (0, exports.parallel)(left, right),
  seqCase: (left, right) => (0, exports.sequential)(left, right),
  singleCase: (dataSource, blockedRequest) => (0, exports.single)(_dataSource.mapInputContext(dataSource, f), blockedRequest)
});
/**
 * Provides each data source with a fiber ref value.
 *
 * @since 2.0.0
 * @category utils
 */
exports.locally = core.requestBlockLocally;
//# sourceMappingURL=RequestBlock.js.map