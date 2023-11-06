"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sequentialCollectionToChunk = exports.sequentialCollectionKeys = exports.sequentialCollectionIsEmpty = exports.sequentialCollectionCombine = exports.sequentialCollectionMake = exports.SequentialCollectionTypeId = exports.parallelCollectionToChunk = exports.parallelCollectionToSequentialCollection = exports.parallelCollectionKeys = exports.parallelCollectionIsEmpty = exports.parallelCollectionCombine = exports.parallelCollectionMake = exports.parallelCollectionEmpty = exports.RequestBlockParallelTypeId = exports.makeEntry = exports.isEntry = exports.EntryTypeId = exports.flatten = exports.reduce = exports.mapRequestResolvers = exports.MapRequestResolversReducer = exports.single = exports.seq = exports.par = exports.empty = void 0;
const Either = /*#__PURE__*/require("../Either.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const HashMap = /*#__PURE__*/require("../HashMap.js");
const List = /*#__PURE__*/require("../List.js");
const Option = /*#__PURE__*/require("../Option.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
/** @internal */
exports.empty = {
  _tag: "Empty"
};
/**
 * Combines this collection of blocked requests with the specified collection
 * of blocked requests, in parallel.
 *
 * @internal
 */
const par = (self, that) => ({
  _tag: "Par",
  left: self,
  right: that
});
exports.par = par;
/**
 * Combines this collection of blocked requests with the specified collection
 * of blocked requests, in sequence.
 *
 * @internal
 */
const seq = (self, that) => ({
  _tag: "Seq",
  left: self,
  right: that
});
exports.seq = seq;
/**
 * Constructs a collection of blocked requests from the specified blocked
 * request and data source.
 *
 * @internal
 */
const single = (dataSource, blockedRequest) => ({
  _tag: "Single",
  dataSource,
  blockedRequest
});
exports.single = single;
/** @internal */
const MapRequestResolversReducer = f => ({
  emptyCase: () => exports.empty,
  parCase: (left, right) => (0, exports.par)(left, right),
  seqCase: (left, right) => (0, exports.seq)(left, right),
  singleCase: (dataSource, blockedRequest) => (0, exports.single)(f(dataSource), blockedRequest)
});
exports.MapRequestResolversReducer = MapRequestResolversReducer;
/**
 * Transforms all data sources with the specified data source aspect, which
 * can change the environment type of data sources but must preserve the
 * request type of each data source.
 *
 * @internal
 */
const mapRequestResolvers = (self, f) => (0, exports.reduce)(self, (0, exports.MapRequestResolversReducer)(f));
exports.mapRequestResolvers = mapRequestResolvers;
/**
 * Folds over the cases of this collection of blocked requests with the
 * specified functions.
 *
 * @internal
 */
const reduce = (self, reducer) => {
  let input = List.of(self);
  let output = List.empty();
  while (List.isCons(input)) {
    const current = input.head;
    switch (current._tag) {
      case "Empty":
        {
          output = List.cons(Either.right(reducer.emptyCase()), output);
          input = input.tail;
          break;
        }
      case "Par":
        {
          output = List.cons(Either.left({
            _tag: "ParCase"
          }), output);
          input = List.cons(current.left, List.cons(current.right, input.tail));
          break;
        }
      case "Seq":
        {
          output = List.cons(Either.left({
            _tag: "SeqCase"
          }), output);
          input = List.cons(current.left, List.cons(current.right, input.tail));
          break;
        }
      case "Single":
        {
          const result = reducer.singleCase(current.dataSource, current.blockedRequest);
          output = List.cons(Either.right(result), output);
          input = input.tail;
          break;
        }
    }
  }
  const result = List.reduce(output, List.empty(), (acc, current) => {
    switch (current._tag) {
      case "Left":
        {
          const left = List.unsafeHead(acc);
          const right = List.unsafeHead(List.unsafeTail(acc));
          const tail = List.unsafeTail(List.unsafeTail(acc));
          switch (current.left._tag) {
            case "ParCase":
              {
                return List.cons(reducer.parCase(left, right), tail);
              }
            case "SeqCase":
              {
                return List.cons(reducer.seqCase(left, right), tail);
              }
          }
        }
      case "Right":
        {
          return List.cons(current.right, acc);
        }
    }
  });
  if (List.isNil(result)) {
    throw new Error("BUG: BlockedRequests.reduce - please report an issue at https://github.com/Effect-TS/query/issues");
  }
  return result.head;
};
exports.reduce = reduce;
/**
 * Flattens a collection of blocked requests into a collection of pipelined
 * and batched requests that can be submitted for execution.
 *
 * @internal
 */
const flatten = self => {
  let current = List.of(self);
  let updated = List.empty();
  // eslint-disable-next-line no-constant-condition
  while (1) {
    const [parallel, sequential] = List.reduce(current, [(0, exports.parallelCollectionEmpty)(), List.empty()], ([parallel, sequential], blockedRequest) => {
      const [par, seq] = step(blockedRequest);
      return [(0, exports.parallelCollectionCombine)(parallel, par), List.appendAll(sequential, seq)];
    });
    updated = merge(updated, parallel);
    if (List.isNil(sequential)) {
      return List.reverse(updated);
    }
    current = sequential;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/query/issues");
};
exports.flatten = flatten;
/**
 * Takes one step in evaluating a collection of blocked requests, returning a
 * collection of blocked requests that can be performed in parallel and a list
 * of blocked requests that must be performed sequentially after those
 * requests.
 */
const step = requests => {
  let current = requests;
  let parallel = (0, exports.parallelCollectionEmpty)();
  let stack = List.empty();
  let sequential = List.empty();
  // eslint-disable-next-line no-constant-condition
  while (1) {
    switch (current._tag) {
      case "Empty":
        {
          if (List.isNil(stack)) {
            return [parallel, sequential];
          }
          current = stack.head;
          stack = stack.tail;
          break;
        }
      case "Par":
        {
          stack = List.cons(current.right, stack);
          current = current.left;
          break;
        }
      case "Seq":
        {
          const left = current.left;
          const right = current.right;
          switch (left._tag) {
            case "Empty":
              {
                current = right;
                break;
              }
            case "Par":
              {
                const l = left.left;
                const r = left.right;
                current = (0, exports.par)((0, exports.seq)(l, right), (0, exports.seq)(r, right));
                break;
              }
            case "Seq":
              {
                const l = left.left;
                const r = left.right;
                current = (0, exports.seq)(l, (0, exports.seq)(r, right));
                break;
              }
            case "Single":
              {
                current = left;
                sequential = List.cons(right, sequential);
                break;
              }
          }
          break;
        }
      case "Single":
        {
          parallel = (0, exports.parallelCollectionCombine)(parallel, (0, exports.parallelCollectionMake)(current.dataSource, current.blockedRequest));
          if (List.isNil(stack)) {
            return [parallel, sequential];
          }
          current = stack.head;
          stack = stack.tail;
          break;
        }
    }
  }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/query/issues");
};
/**
 * Merges a collection of requests that must be executed sequentially with a
 * collection of requests that can be executed in parallel. If the collections
 * are both from the same single data source then the requests can be
 * pipelined while preserving ordering guarantees.
 */
const merge = (sequential, parallel) => {
  if (List.isNil(sequential)) {
    return List.of((0, exports.parallelCollectionToSequentialCollection)(parallel));
  }
  if ((0, exports.parallelCollectionIsEmpty)(parallel)) {
    return sequential;
  }
  const seqHeadKeys = (0, exports.sequentialCollectionKeys)(sequential.head);
  const parKeys = (0, exports.parallelCollectionKeys)(parallel);
  if (seqHeadKeys.length === 1 && parKeys.length === 1 && Equal.equals(seqHeadKeys[0], parKeys[0])) {
    return List.cons((0, exports.sequentialCollectionCombine)(sequential.head, (0, exports.parallelCollectionToSequentialCollection)(parallel)), sequential.tail);
  }
  return List.cons((0, exports.parallelCollectionToSequentialCollection)(parallel), sequential);
};
//
// circular
//
/** @internal */
exports.EntryTypeId = /*#__PURE__*/Symbol.for("effect/RequestBlock/Entry");
/** @internal */
class EntryImpl {
  request;
  result;
  listeners;
  ownerId;
  state;
  [exports.EntryTypeId] = blockedRequestVariance;
  constructor(request, result, listeners, ownerId, state) {
    this.request = request;
    this.result = result;
    this.listeners = listeners;
    this.ownerId = ownerId;
    this.state = state;
  }
}
/** @internal */
const blockedRequestVariance = {
  _R: _ => _
};
/** @internal */
const isEntry = u => (0, Predicate_js_1.hasProperty)(u, exports.EntryTypeId);
exports.isEntry = isEntry;
/** @internal */
const makeEntry = options => new EntryImpl(options.request, options.result, options.listeners, options.ownerId, options.state);
exports.makeEntry = makeEntry;
/** @internal */
exports.RequestBlockParallelTypeId = /*#__PURE__*/Symbol.for("effect/RequestBlock/RequestBlockParallel");
const parallelVariance = {
  _R: _ => _
};
class ParallelImpl {
  map;
  [exports.RequestBlockParallelTypeId] = parallelVariance;
  constructor(map) {
    this.map = map;
  }
}
/** @internal */
const parallelCollectionEmpty = () => new ParallelImpl(HashMap.empty());
exports.parallelCollectionEmpty = parallelCollectionEmpty;
/** @internal */
const parallelCollectionMake = (dataSource, blockedRequest) => new ParallelImpl(HashMap.make([dataSource, Array.of(blockedRequest)]));
exports.parallelCollectionMake = parallelCollectionMake;
/** @internal */
const parallelCollectionCombine = (self, that) => new ParallelImpl(HashMap.reduce(self.map, that.map, (map, value, key) => HashMap.set(map, key, Option.match(HashMap.get(map, key), {
  onNone: () => value,
  onSome: a => [...a, ...value]
}))));
exports.parallelCollectionCombine = parallelCollectionCombine;
/** @internal */
const parallelCollectionIsEmpty = self => HashMap.isEmpty(self.map);
exports.parallelCollectionIsEmpty = parallelCollectionIsEmpty;
/** @internal */
const parallelCollectionKeys = self => Array.from(HashMap.keys(self.map));
exports.parallelCollectionKeys = parallelCollectionKeys;
/** @internal */
const parallelCollectionToSequentialCollection = self => (0, exports.sequentialCollectionMake)(HashMap.map(self.map, x => Array.of(x)));
exports.parallelCollectionToSequentialCollection = parallelCollectionToSequentialCollection;
/** @internal */
const parallelCollectionToChunk = self => Array.from(self.map);
exports.parallelCollectionToChunk = parallelCollectionToChunk;
/** @internal */
exports.SequentialCollectionTypeId = /*#__PURE__*/Symbol.for("effect/RequestBlock/RequestBlockSequential");
/** @internal */
const sequentialVariance = {
  _R: _ => _
};
class SequentialImpl {
  map;
  [exports.SequentialCollectionTypeId] = sequentialVariance;
  constructor(map) {
    this.map = map;
  }
}
/** @internal */
const sequentialCollectionMake = map => new SequentialImpl(map);
exports.sequentialCollectionMake = sequentialCollectionMake;
/** @internal */
const sequentialCollectionCombine = (self, that) => new SequentialImpl(HashMap.reduce(that.map, self.map, (map, value, key) => HashMap.set(map, key, Option.match(HashMap.get(map, key), {
  onNone: () => [],
  onSome: a => [...a, ...value]
}))));
exports.sequentialCollectionCombine = sequentialCollectionCombine;
/** @internal */
const sequentialCollectionIsEmpty = self => HashMap.isEmpty(self.map);
exports.sequentialCollectionIsEmpty = sequentialCollectionIsEmpty;
/** @internal */
const sequentialCollectionKeys = self => Array.from(HashMap.keys(self.map));
exports.sequentialCollectionKeys = sequentialCollectionKeys;
/** @internal */
const sequentialCollectionToChunk = self => Array.from(self.map);
exports.sequentialCollectionToChunk = sequentialCollectionToChunk;
//# sourceMappingURL=blockedRequests.js.map