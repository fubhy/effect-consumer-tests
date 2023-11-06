"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InterruptedExceptionTypeId = exports.isRuntimeException = exports.RuntimeException = exports.RuntimeExceptionTypeId = exports.reduceWithContext = exports.reduce = exports.match = exports.filter = exports.find = exports.squashWith = exports.squash = exports.contains = exports.flatten = exports.flatMap = exports.map = exports.as = exports.stripSomeDefects = exports.electFailures = exports.stripFailures = exports.linearize = exports.keepDefectsAndElectFailures = exports.keepDefects = exports.interruptOption = exports.flipCauseOption = exports.dieOption = exports.failureOrCause = exports.failureOption = exports.interruptors = exports.defects = exports.failures = exports.isInterruptedOnly = exports.isInterrupted = exports.isDie = exports.isFailure = exports.isEmpty = exports.size = exports.isParallelType = exports.isSequentialType = exports.isInterruptType = exports.isDieType = exports.isFailType = exports.isEmptyType = exports.isCause = exports.sequential = exports.parallel = exports.interrupt = exports.die = exports.fail = exports.empty = exports.CauseTypeId = void 0;
exports.prettyErrors = exports.prettyErrorMessage = exports.pretty = exports.isInvalidCapacityError = exports.InvalidPubSubCapacityException = exports.InvalidPubSubCapacityExceptionTypeId = exports.isNoSuchElementException = exports.NoSuchElementException = exports.NoSuchElementExceptionTypeId = exports.isIllegalArgumentException = exports.IllegalArgumentException = exports.IllegalArgumentExceptionTypeId = exports.isInterruptedException = exports.InterruptedException = void 0;
const Chunk = /*#__PURE__*/require("../Chunk.js");
const Either = /*#__PURE__*/require("../Either.js");
const Equal = /*#__PURE__*/require("../Equal.js");
const FiberId = /*#__PURE__*/require("../FiberId.js");
const Function_js_1 = /*#__PURE__*/require("../Function.js");
const Hash = /*#__PURE__*/require("../Hash.js");
const HashSet = /*#__PURE__*/require("../HashSet.js");
const Inspectable_js_1 = /*#__PURE__*/require("../Inspectable.js");
const Option = /*#__PURE__*/require("../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../Pipeable.js");
const Predicate_js_1 = /*#__PURE__*/require("../Predicate.js");
const ReadonlyArray = /*#__PURE__*/require("../ReadonlyArray.js");
const OpCodes = /*#__PURE__*/require("./opCodes/cause.js");
// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------
/** @internal */
const CauseSymbolKey = "effect/Cause";
/** @internal */
exports.CauseTypeId = /*#__PURE__*/Symbol.for(CauseSymbolKey);
/** @internal */
const variance = {
  _E: _ => _
};
/** @internal */
const proto = {
  [exports.CauseTypeId]: variance,
  [Hash.symbol]() {
    return (0, Function_js_1.pipe)(Hash.hash(CauseSymbolKey), Hash.combine(Hash.hash(flattenCause(this))));
  },
  [Equal.symbol](that) {
    return (0, exports.isCause)(that) && causeEquals(this, that);
  },
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: (0, Inspectable_js_1.toJSON)(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: (0, Inspectable_js_1.toJSON)(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: (0, Inspectable_js_1.toJSON)(this.left),
          right: (0, Inspectable_js_1.toJSON)(this.right)
        };
    }
  },
  toString() {
    return (0, exports.pretty)(this);
  },
  [Inspectable_js_1.NodeInspectSymbol]() {
    return this.toJSON();
  }
};
// -----------------------------------------------------------------------------
// Constructors
// -----------------------------------------------------------------------------
/** @internal */
exports.empty = /*#__PURE__*/(() => {
  const o = /*#__PURE__*/Object.create(proto);
  o._tag = OpCodes.OP_EMPTY;
  return o;
})();
/** @internal */
const fail = error => {
  const o = Object.create(proto);
  o._tag = OpCodes.OP_FAIL;
  o.error = error;
  return o;
};
exports.fail = fail;
/** @internal */
const die = defect => {
  const o = Object.create(proto);
  o._tag = OpCodes.OP_DIE;
  o.defect = defect;
  return o;
};
exports.die = die;
/** @internal */
const interrupt = fiberId => {
  const o = Object.create(proto);
  o._tag = OpCodes.OP_INTERRUPT;
  o.fiberId = fiberId;
  return o;
};
exports.interrupt = interrupt;
/** @internal */
const parallel = (left, right) => {
  const o = Object.create(proto);
  o._tag = OpCodes.OP_PARALLEL;
  o.left = left;
  o.right = right;
  return o;
};
exports.parallel = parallel;
/** @internal */
const sequential = (left, right) => {
  const o = Object.create(proto);
  o._tag = OpCodes.OP_SEQUENTIAL;
  o.left = left;
  o.right = right;
  return o;
};
exports.sequential = sequential;
// -----------------------------------------------------------------------------
// Refinements
// -----------------------------------------------------------------------------
/** @internal */
const isCause = u => (0, Predicate_js_1.hasProperty)(u, exports.CauseTypeId);
exports.isCause = isCause;
/** @internal */
const isEmptyType = self => self._tag === OpCodes.OP_EMPTY;
exports.isEmptyType = isEmptyType;
/** @internal */
const isFailType = self => self._tag === OpCodes.OP_FAIL;
exports.isFailType = isFailType;
/** @internal */
const isDieType = self => self._tag === OpCodes.OP_DIE;
exports.isDieType = isDieType;
/** @internal */
const isInterruptType = self => self._tag === OpCodes.OP_INTERRUPT;
exports.isInterruptType = isInterruptType;
/** @internal */
const isSequentialType = self => self._tag === OpCodes.OP_SEQUENTIAL;
exports.isSequentialType = isSequentialType;
/** @internal */
const isParallelType = self => self._tag === OpCodes.OP_PARALLEL;
exports.isParallelType = isParallelType;
// -----------------------------------------------------------------------------
// Getters
// -----------------------------------------------------------------------------
/** @internal */
const size = self => (0, exports.reduceWithContext)(self, void 0, SizeCauseReducer);
exports.size = size;
/** @internal */
const isEmpty = self => {
  if (self._tag === OpCodes.OP_EMPTY) {
    return true;
  }
  return (0, exports.reduce)(self, true, (acc, cause) => {
    switch (cause._tag) {
      case OpCodes.OP_EMPTY:
        {
          return Option.some(acc);
        }
      case OpCodes.OP_DIE:
      case OpCodes.OP_FAIL:
      case OpCodes.OP_INTERRUPT:
        {
          return Option.some(false);
        }
      default:
        {
          return Option.none();
        }
    }
  });
};
exports.isEmpty = isEmpty;
/** @internal */
const isFailure = self => Option.isSome((0, exports.failureOption)(self));
exports.isFailure = isFailure;
/** @internal */
const isDie = self => Option.isSome((0, exports.dieOption)(self));
exports.isDie = isDie;
/** @internal */
const isInterrupted = self => Option.isSome((0, exports.interruptOption)(self));
exports.isInterrupted = isInterrupted;
/** @internal */
const isInterruptedOnly = self => (0, exports.reduceWithContext)(undefined, IsInterruptedOnlyCauseReducer)(self);
exports.isInterruptedOnly = isInterruptedOnly;
/** @internal */
const failures = self => Chunk.reverse((0, exports.reduce)(self, Chunk.empty(), (list, cause) => cause._tag === OpCodes.OP_FAIL ? Option.some((0, Function_js_1.pipe)(list, Chunk.prepend(cause.error))) : Option.none()));
exports.failures = failures;
/** @internal */
const defects = self => Chunk.reverse((0, exports.reduce)(self, Chunk.empty(), (list, cause) => cause._tag === OpCodes.OP_DIE ? Option.some((0, Function_js_1.pipe)(list, Chunk.prepend(cause.defect))) : Option.none()));
exports.defects = defects;
/** @internal */
const interruptors = self => (0, exports.reduce)(self, HashSet.empty(), (set, cause) => cause._tag === OpCodes.OP_INTERRUPT ? Option.some((0, Function_js_1.pipe)(set, HashSet.add(cause.fiberId))) : Option.none());
exports.interruptors = interruptors;
/** @internal */
const failureOption = self => (0, exports.find)(self, cause => cause._tag === OpCodes.OP_FAIL ? Option.some(cause.error) : Option.none());
exports.failureOption = failureOption;
/** @internal */
const failureOrCause = self => {
  const option = (0, exports.failureOption)(self);
  switch (option._tag) {
    case "None":
      {
        // no `E` inside this `Cause`, so it can be safely cast to `never`
        return Either.right(self);
      }
    case "Some":
      {
        return Either.left(option.value);
      }
  }
};
exports.failureOrCause = failureOrCause;
/** @internal */
const dieOption = self => (0, exports.find)(self, cause => cause._tag === OpCodes.OP_DIE ? Option.some(cause.defect) : Option.none());
exports.dieOption = dieOption;
/** @internal */
const flipCauseOption = self => (0, exports.match)(self, {
  onEmpty: Option.some(exports.empty),
  onFail: failureOption => (0, Function_js_1.pipe)(failureOption, Option.map(exports.fail)),
  onDie: defect => Option.some((0, exports.die)(defect)),
  onInterrupt: fiberId => Option.some((0, exports.interrupt)(fiberId)),
  onSequential: (left, right) => {
    if (Option.isSome(left) && Option.isSome(right)) {
      return Option.some((0, exports.sequential)(left.value, right.value));
    }
    if (Option.isNone(left) && Option.isSome(right)) {
      return Option.some(right.value);
    }
    if (Option.isSome(left) && Option.isNone(right)) {
      return Option.some(left.value);
    }
    return Option.none();
  },
  onParallel: (left, right) => {
    if (Option.isSome(left) && Option.isSome(right)) {
      return Option.some((0, exports.parallel)(left.value, right.value));
    }
    if (Option.isNone(left) && Option.isSome(right)) {
      return Option.some(right.value);
    }
    if (Option.isSome(left) && Option.isNone(right)) {
      return Option.some(left.value);
    }
    return Option.none();
  }
});
exports.flipCauseOption = flipCauseOption;
/** @internal */
const interruptOption = self => (0, exports.find)(self, cause => cause._tag === OpCodes.OP_INTERRUPT ? Option.some(cause.fiberId) : Option.none());
exports.interruptOption = interruptOption;
/** @internal */
const keepDefects = self => (0, exports.match)(self, {
  onEmpty: Option.none(),
  onFail: () => Option.none(),
  onDie: defect => Option.some((0, exports.die)(defect)),
  onInterrupt: () => Option.none(),
  onSequential: (left, right) => {
    if (Option.isSome(left) && Option.isSome(right)) {
      return Option.some((0, exports.sequential)(left.value, right.value));
    }
    if (Option.isSome(left) && Option.isNone(right)) {
      return Option.some(left.value);
    }
    if (Option.isNone(left) && Option.isSome(right)) {
      return Option.some(right.value);
    }
    return Option.none();
  },
  onParallel: (left, right) => {
    if (Option.isSome(left) && Option.isSome(right)) {
      return Option.some((0, exports.parallel)(left.value, right.value));
    }
    if (Option.isSome(left) && Option.isNone(right)) {
      return Option.some(left.value);
    }
    if (Option.isNone(left) && Option.isSome(right)) {
      return Option.some(right.value);
    }
    return Option.none();
  }
});
exports.keepDefects = keepDefects;
/** @internal */
const keepDefectsAndElectFailures = self => (0, exports.match)(self, {
  onEmpty: Option.none(),
  onFail: failure => Option.some((0, exports.die)(failure)),
  onDie: defect => Option.some((0, exports.die)(defect)),
  onInterrupt: () => Option.none(),
  onSequential: (left, right) => {
    if (Option.isSome(left) && Option.isSome(right)) {
      return Option.some((0, exports.sequential)(left.value, right.value));
    }
    if (Option.isSome(left) && Option.isNone(right)) {
      return Option.some(left.value);
    }
    if (Option.isNone(left) && Option.isSome(right)) {
      return Option.some(right.value);
    }
    return Option.none();
  },
  onParallel: (left, right) => {
    if (Option.isSome(left) && Option.isSome(right)) {
      return Option.some((0, exports.parallel)(left.value, right.value));
    }
    if (Option.isSome(left) && Option.isNone(right)) {
      return Option.some(left.value);
    }
    if (Option.isNone(left) && Option.isSome(right)) {
      return Option.some(right.value);
    }
    return Option.none();
  }
});
exports.keepDefectsAndElectFailures = keepDefectsAndElectFailures;
/** @internal */
const linearize = self => (0, exports.match)(self, {
  onEmpty: HashSet.empty(),
  onFail: error => HashSet.make((0, exports.fail)(error)),
  onDie: defect => HashSet.make((0, exports.die)(defect)),
  onInterrupt: fiberId => HashSet.make((0, exports.interrupt)(fiberId)),
  onSequential: (leftSet, rightSet) => (0, Function_js_1.pipe)(leftSet, HashSet.flatMap(leftCause => (0, Function_js_1.pipe)(rightSet, HashSet.map(rightCause => (0, exports.sequential)(leftCause, rightCause))))),
  onParallel: (leftSet, rightSet) => (0, Function_js_1.pipe)(leftSet, HashSet.flatMap(leftCause => (0, Function_js_1.pipe)(rightSet, HashSet.map(rightCause => (0, exports.parallel)(leftCause, rightCause)))))
});
exports.linearize = linearize;
/** @internal */
const stripFailures = self => (0, exports.match)(self, {
  onEmpty: exports.empty,
  onFail: () => exports.empty,
  onDie: defect => (0, exports.die)(defect),
  onInterrupt: fiberId => (0, exports.interrupt)(fiberId),
  onSequential: exports.sequential,
  onParallel: exports.parallel
});
exports.stripFailures = stripFailures;
/** @internal */
const electFailures = self => (0, exports.match)(self, {
  onEmpty: exports.empty,
  onFail: failure => (0, exports.die)(failure),
  onDie: defect => (0, exports.die)(defect),
  onInterrupt: fiberId => (0, exports.interrupt)(fiberId),
  onSequential: (left, right) => (0, exports.sequential)(left, right),
  onParallel: (left, right) => (0, exports.parallel)(left, right)
});
exports.electFailures = electFailures;
/** @internal */
exports.stripSomeDefects = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => (0, exports.match)(self, {
  onEmpty: Option.some(exports.empty),
  onFail: error => Option.some((0, exports.fail)(error)),
  onDie: defect => {
    const option = pf(defect);
    return Option.isSome(option) ? Option.none() : Option.some((0, exports.die)(defect));
  },
  onInterrupt: fiberId => Option.some((0, exports.interrupt)(fiberId)),
  onSequential: (left, right) => {
    if (Option.isSome(left) && Option.isSome(right)) {
      return Option.some((0, exports.sequential)(left.value, right.value));
    }
    if (Option.isSome(left) && Option.isNone(right)) {
      return Option.some(left.value);
    }
    if (Option.isNone(left) && Option.isSome(right)) {
      return Option.some(right.value);
    }
    return Option.none();
  },
  onParallel: (left, right) => {
    if (Option.isSome(left) && Option.isSome(right)) {
      return Option.some((0, exports.parallel)(left.value, right.value));
    }
    if (Option.isSome(left) && Option.isNone(right)) {
      return Option.some(left.value);
    }
    if (Option.isNone(left) && Option.isSome(right)) {
      return Option.some(right.value);
    }
    return Option.none();
  }
}));
// -----------------------------------------------------------------------------
// Mapping
// -----------------------------------------------------------------------------
/** @internal */
exports.as = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, error) => (0, exports.map)(self, () => error));
/** @internal */
exports.map = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.flatMap)(self, e => (0, exports.fail)(f(e))));
// -----------------------------------------------------------------------------
// Sequencing
// -----------------------------------------------------------------------------
/** @internal */
exports.flatMap = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => (0, exports.match)(self, {
  onEmpty: exports.empty,
  onFail: error => f(error),
  onDie: defect => (0, exports.die)(defect),
  onInterrupt: fiberId => (0, exports.interrupt)(fiberId),
  onSequential: (left, right) => (0, exports.sequential)(left, right),
  onParallel: (left, right) => (0, exports.parallel)(left, right)
}));
/** @internal */
const flatten = self => (0, exports.flatMap)(self, Function_js_1.identity);
exports.flatten = flatten;
// -----------------------------------------------------------------------------
// Equality
// -----------------------------------------------------------------------------
/** @internal */
exports.contains = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, that) => {
  if (that._tag === OpCodes.OP_EMPTY || self === that) {
    return true;
  }
  return (0, exports.reduce)(self, false, (accumulator, cause) => {
    return Option.some(accumulator || causeEquals(cause, that));
  });
});
/** @internal */
const causeEquals = (left, right) => {
  let leftStack = Chunk.of(left);
  let rightStack = Chunk.of(right);
  while (Chunk.isNonEmpty(leftStack) && Chunk.isNonEmpty(rightStack)) {
    const [leftParallel, leftSequential] = (0, Function_js_1.pipe)(Chunk.headNonEmpty(leftStack), (0, exports.reduce)([HashSet.empty(), Chunk.empty()], ([parallel, sequential], cause) => {
      const [par, seq] = evaluateCause(cause);
      return Option.some([(0, Function_js_1.pipe)(parallel, HashSet.union(par)), (0, Function_js_1.pipe)(sequential, Chunk.appendAll(seq))]);
    }));
    const [rightParallel, rightSequential] = (0, Function_js_1.pipe)(Chunk.headNonEmpty(rightStack), (0, exports.reduce)([HashSet.empty(), Chunk.empty()], ([parallel, sequential], cause) => {
      const [par, seq] = evaluateCause(cause);
      return Option.some([(0, Function_js_1.pipe)(parallel, HashSet.union(par)), (0, Function_js_1.pipe)(sequential, Chunk.appendAll(seq))]);
    }));
    if (!Equal.equals(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
// -----------------------------------------------------------------------------
// Flattening
// -----------------------------------------------------------------------------
/**
 * Flattens a cause to a sequence of sets of causes, where each set represents
 * causes that fail in parallel and sequential sets represent causes that fail
 * after each other.
 *
 * @internal
 */
const flattenCause = cause => {
  return flattenCauseLoop(Chunk.of(cause), Chunk.empty());
};
/** @internal */
const flattenCauseLoop = (causes, flattened) => {
  // eslint-disable-next-line no-constant-condition
  while (1) {
    const [parallel, sequential] = (0, Function_js_1.pipe)(causes, ReadonlyArray.reduce([HashSet.empty(), Chunk.empty()], ([parallel, sequential], cause) => {
      const [par, seq] = evaluateCause(cause);
      return [(0, Function_js_1.pipe)(parallel, HashSet.union(par)), (0, Function_js_1.pipe)(sequential, Chunk.appendAll(seq))];
    }));
    const updated = HashSet.size(parallel) > 0 ? (0, Function_js_1.pipe)(flattened, Chunk.prepend(parallel)) : flattened;
    if (Chunk.isEmpty(sequential)) {
      return Chunk.reverse(updated);
    }
    causes = sequential;
    flattened = updated;
  }
  throw new Error("BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues");
};
// -----------------------------------------------------------------------------
// Squashing
// -----------------------------------------------------------------------------
/** @internal */
const squash = self => {
  return (0, exports.squashWith)(Function_js_1.identity)(self);
};
exports.squash = squash;
/** @internal */
exports.squashWith = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => {
  const option = (0, Function_js_1.pipe)(self, exports.failureOption, Option.map(f));
  switch (option._tag) {
    case "None":
      {
        return (0, Function_js_1.pipe)((0, exports.defects)(self), Chunk.head, Option.match({
          onNone: () => {
            const interrupts = Array.from((0, exports.interruptors)(self)).flatMap(fiberId => Array.from(FiberId.ids(fiberId)).map(id => `#${id}`));
            return (0, exports.InterruptedException)(interrupts ? `Interrupted by fibers: ${interrupts.join(", ")}` : void 0);
          },
          onSome: Function_js_1.identity
        }));
      }
    case "Some":
      {
        return option.value;
      }
  }
});
// -----------------------------------------------------------------------------
// Finding
// -----------------------------------------------------------------------------
/** @internal */
exports.find = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, pf) => {
  const stack = [self];
  while (stack.length > 0) {
    const item = stack.pop();
    const option = pf(item);
    switch (option._tag) {
      case "None":
        {
          switch (item._tag) {
            case OpCodes.OP_SEQUENTIAL:
            case OpCodes.OP_PARALLEL:
              {
                stack.push(item.right);
                stack.push(item.left);
                break;
              }
          }
          break;
        }
      case "Some":
        {
          return option;
        }
    }
  }
  return Option.none();
});
// -----------------------------------------------------------------------------
// Filtering
// -----------------------------------------------------------------------------
/** @internal */
exports.filter = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, predicate) => (0, exports.reduceWithContext)(self, void 0, FilterCauseReducer(predicate)));
// -----------------------------------------------------------------------------
// Evaluation
// -----------------------------------------------------------------------------
/**
 * Takes one step in evaluating a cause, returning a set of causes that fail
 * in parallel and a list of causes that fail sequentially after those causes.
 *
 * @internal
 */
const evaluateCause = self => {
  let cause = self;
  const stack = [];
  let _parallel = HashSet.empty();
  let _sequential = Chunk.empty();
  while (cause !== undefined) {
    switch (cause._tag) {
      case OpCodes.OP_EMPTY:
        {
          if (stack.length === 0) {
            return [_parallel, _sequential];
          }
          cause = stack.pop();
          break;
        }
      case OpCodes.OP_FAIL:
        {
          if (stack.length === 0) {
            return [(0, Function_js_1.pipe)(_parallel, HashSet.add(cause.error)), _sequential];
          }
          _parallel = (0, Function_js_1.pipe)(_parallel, HashSet.add(cause.error));
          cause = stack.pop();
          break;
        }
      case OpCodes.OP_DIE:
        {
          if (stack.length === 0) {
            return [(0, Function_js_1.pipe)(_parallel, HashSet.add(cause.defect)), _sequential];
          }
          _parallel = (0, Function_js_1.pipe)(_parallel, HashSet.add(cause.defect));
          cause = stack.pop();
          break;
        }
      case OpCodes.OP_INTERRUPT:
        {
          if (stack.length === 0) {
            return [(0, Function_js_1.pipe)(_parallel, HashSet.add(cause.fiberId)), _sequential];
          }
          _parallel = (0, Function_js_1.pipe)(_parallel, HashSet.add(cause.fiberId));
          cause = stack.pop();
          break;
        }
      case OpCodes.OP_SEQUENTIAL:
        {
          switch (cause.left._tag) {
            case OpCodes.OP_EMPTY:
              {
                cause = cause.right;
                break;
              }
            case OpCodes.OP_SEQUENTIAL:
              {
                cause = (0, exports.sequential)(cause.left.left, (0, exports.sequential)(cause.left.right, cause.right));
                break;
              }
            case OpCodes.OP_PARALLEL:
              {
                cause = (0, exports.parallel)((0, exports.sequential)(cause.left.left, cause.right), (0, exports.sequential)(cause.left.right, cause.right));
                break;
              }
            default:
              {
                _sequential = (0, Function_js_1.pipe)(_sequential, Chunk.prepend(cause.right));
                cause = cause.left;
                break;
              }
          }
          break;
        }
      case OpCodes.OP_PARALLEL:
        {
          stack.push(cause.right);
          cause = cause.left;
          break;
        }
    }
  }
  throw new Error("BUG: Cause.evaluateCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues");
};
// -----------------------------------------------------------------------------
// Reducing
// -----------------------------------------------------------------------------
/** @internal */
const SizeCauseReducer = {
  emptyCase: () => 0,
  failCase: () => 1,
  dieCase: () => 1,
  interruptCase: () => 1,
  sequentialCase: (_, left, right) => left + right,
  parallelCase: (_, left, right) => left + right
};
/** @internal */
const IsInterruptedOnlyCauseReducer = {
  emptyCase: Function_js_1.constTrue,
  failCase: Function_js_1.constFalse,
  dieCase: Function_js_1.constFalse,
  interruptCase: Function_js_1.constTrue,
  sequentialCase: (_, left, right) => left && right,
  parallelCase: (_, left, right) => left && right
};
/** @internal */
const FilterCauseReducer = predicate => ({
  emptyCase: () => exports.empty,
  failCase: (_, error) => (0, exports.fail)(error),
  dieCase: (_, defect) => (0, exports.die)(defect),
  interruptCase: (_, fiberId) => (0, exports.interrupt)(fiberId),
  sequentialCase: (_, left, right) => {
    if (predicate(left)) {
      if (predicate(right)) {
        return (0, exports.sequential)(left, right);
      }
      return left;
    }
    if (predicate(right)) {
      return right;
    }
    return exports.empty;
  },
  parallelCase: (_, left, right) => {
    if (predicate(left)) {
      if (predicate(right)) {
        return (0, exports.parallel)(left, right);
      }
      return left;
    }
    if (predicate(right)) {
      return right;
    }
    return exports.empty;
  }
});
const OP_SEQUENTIAL_CASE = "SequentialCase";
const OP_PARALLEL_CASE = "ParallelCase";
/** @internal */
exports.match = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, {
  onDie,
  onEmpty,
  onFail,
  onInterrupt,
  onParallel,
  onSequential
}) => {
  return (0, exports.reduceWithContext)(self, void 0, {
    emptyCase: () => onEmpty,
    failCase: (_, error) => onFail(error),
    dieCase: (_, defect) => onDie(defect),
    interruptCase: (_, fiberId) => onInterrupt(fiberId),
    sequentialCase: (_, left, right) => onSequential(left, right),
    parallelCase: (_, left, right) => onParallel(left, right)
  });
});
/** @internal */
exports.reduce = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, zero, pf) => {
  let accumulator = zero;
  let cause = self;
  const causes = [];
  while (cause !== undefined) {
    const option = pf(accumulator, cause);
    accumulator = Option.isSome(option) ? option.value : accumulator;
    switch (cause._tag) {
      case OpCodes.OP_SEQUENTIAL:
        {
          causes.push(cause.right);
          cause = cause.left;
          break;
        }
      case OpCodes.OP_PARALLEL:
        {
          causes.push(cause.right);
          cause = cause.left;
          break;
        }
      default:
        {
          cause = undefined;
          break;
        }
    }
    if (cause === undefined && causes.length > 0) {
      cause = causes.pop();
    }
  }
  return accumulator;
});
/** @internal */
exports.reduceWithContext = /*#__PURE__*/(0, Function_js_1.dual)(3, (self, context, reducer) => {
  const input = [self];
  const output = [];
  while (input.length > 0) {
    const cause = input.pop();
    switch (cause._tag) {
      case OpCodes.OP_EMPTY:
        {
          output.push(Either.right(reducer.emptyCase(context)));
          break;
        }
      case OpCodes.OP_FAIL:
        {
          output.push(Either.right(reducer.failCase(context, cause.error)));
          break;
        }
      case OpCodes.OP_DIE:
        {
          output.push(Either.right(reducer.dieCase(context, cause.defect)));
          break;
        }
      case OpCodes.OP_INTERRUPT:
        {
          output.push(Either.right(reducer.interruptCase(context, cause.fiberId)));
          break;
        }
      case OpCodes.OP_SEQUENTIAL:
        {
          input.push(cause.right);
          input.push(cause.left);
          output.push(Either.left({
            _tag: OP_SEQUENTIAL_CASE
          }));
          break;
        }
      case OpCodes.OP_PARALLEL:
        {
          input.push(cause.right);
          input.push(cause.left);
          output.push(Either.left({
            _tag: OP_PARALLEL_CASE
          }));
          break;
        }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either = output.pop();
    switch (either._tag) {
      case "Left":
        {
          switch (either.left._tag) {
            case OP_SEQUENTIAL_CASE:
              {
                const left = accumulator.pop();
                const right = accumulator.pop();
                const value = reducer.sequentialCase(context, left, right);
                accumulator.push(value);
                break;
              }
            case OP_PARALLEL_CASE:
              {
                const left = accumulator.pop();
                const right = accumulator.pop();
                const value = reducer.parallelCase(context, left, right);
                accumulator.push(value);
                break;
              }
          }
          break;
        }
      case "Right":
        {
          accumulator.push(either.right);
          break;
        }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/io/issues");
  }
  return accumulator.pop();
});
// -----------------------------------------------------------------------------
// Errors
// -----------------------------------------------------------------------------
const makeException = (proto, tag) => {
  const _tag = {
    value: tag,
    enumerable: true
  };
  const protoWithToString = {
    ...proto,
    toString() {
      return `${this._tag}: ${this.message}`;
    }
  };
  return message => Object.create(protoWithToString, {
    _tag,
    message: {
      value: message,
      enumerable: true
    }
  });
};
/** @internal */
exports.RuntimeExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Cause/errors/RuntimeException");
/** @internal */
exports.RuntimeException = /*#__PURE__*/makeException({
  [exports.RuntimeExceptionTypeId]: exports.RuntimeExceptionTypeId
}, "RuntimeException");
/** @internal */
const isRuntimeException = u => (0, Predicate_js_1.hasProperty)(u, exports.RuntimeExceptionTypeId);
exports.isRuntimeException = isRuntimeException;
/** @internal */
exports.InterruptedExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Cause/errors/InterruptedException");
/** @internal */
exports.InterruptedException = /*#__PURE__*/makeException({
  [exports.InterruptedExceptionTypeId]: exports.InterruptedExceptionTypeId
}, "InterruptedException");
/** @internal */
const isInterruptedException = u => (0, Predicate_js_1.hasProperty)(u, exports.InterruptedExceptionTypeId);
exports.isInterruptedException = isInterruptedException;
/** @internal */
exports.IllegalArgumentExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Cause/errors/IllegalArgument");
/** @internal */
exports.IllegalArgumentException = /*#__PURE__*/makeException({
  [exports.IllegalArgumentExceptionTypeId]: exports.IllegalArgumentExceptionTypeId
}, "IllegalArgumentException");
/** @internal */
const isIllegalArgumentException = u => (0, Predicate_js_1.hasProperty)(u, exports.IllegalArgumentExceptionTypeId);
exports.isIllegalArgumentException = isIllegalArgumentException;
/** @internal */
exports.NoSuchElementExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Cause/errors/NoSuchElement");
/** @internal */
exports.NoSuchElementException = /*#__PURE__*/makeException({
  [exports.NoSuchElementExceptionTypeId]: exports.NoSuchElementExceptionTypeId
}, "NoSuchElementException");
/** @internal */
const isNoSuchElementException = u => (0, Predicate_js_1.hasProperty)(u, exports.NoSuchElementExceptionTypeId);
exports.isNoSuchElementException = isNoSuchElementException;
/** @internal */
exports.InvalidPubSubCapacityExceptionTypeId = /*#__PURE__*/Symbol.for("effect/Cause/errors/InvalidPubSubCapacityException");
/** @internal */
exports.InvalidPubSubCapacityException = /*#__PURE__*/makeException({
  [exports.InvalidPubSubCapacityExceptionTypeId]: exports.InvalidPubSubCapacityExceptionTypeId
}, "InvalidPubSubCapacityException");
/** @internal */
const isInvalidCapacityError = u => (0, Predicate_js_1.hasProperty)(u, exports.InvalidPubSubCapacityExceptionTypeId);
exports.isInvalidCapacityError = isInvalidCapacityError;
// -----------------------------------------------------------------------------
// Pretty Printing
// -----------------------------------------------------------------------------
const filterStack = stack => {
  const lines = stack.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("EffectPrimitive") || lines[i].includes("Generator.next") || lines[i].includes("FiberRuntime")) {
      return out.join("\n");
    } else {
      out.push(lines[i]);
    }
  }
  return out.join("\n");
};
/** @internal */
const pretty = cause => {
  if ((0, exports.isInterruptedOnly)(cause)) {
    return "All fibers interrupted without errors.";
  }
  const final = (0, exports.prettyErrors)(cause).map(e => {
    let message = e.message;
    if (e.stack) {
      message += `\r\n${filterStack(e.stack)}`;
    }
    if (e.span) {
      let current = e.span;
      let i = 0;
      while (current && current._tag === "Span" && i < 10) {
        message += `\r\n    at ${current.name}`;
        current = Option.getOrUndefined(current.parent);
        i++;
      }
    }
    return message;
  }).join("\r\n");
  return final;
};
exports.pretty = pretty;
class PrettyError {
  message;
  stack;
  span;
  constructor(message, stack, span) {
    this.message = message;
    this.stack = stack;
    this.span = span;
  }
  toJSON() {
    const out = {
      message: this.message
    };
    if (this.stack) {
      out.stack = this.stack;
    }
    if (this.span) {
      out.span = this.span;
    }
    return out;
  }
}
/**
 * A utility function for generating human-readable error messages from a generic error of type `unknown`.
 *
 * Rules:
 *
 * 1) If the input `u` is already a string, it's considered a message, and "Error" is added as a prefix.
 * 2) If `u` has a user-defined `toString()` method, it uses that method and adds "Error" as a prefix.
 * 3) If `u` is an object and its only (optional) properties are "name", "message", or "_tag", it constructs
 *    an error message based on those properties.
 * 4) Otherwise, it uses `JSON.stringify` to produce a string representation and uses it as the error message,
 *   with "Error" added as a prefix.
 *
 * @internal
 */
const prettyErrorMessage = u => {
  // 1)
  if (typeof u === "string") {
    return `Error: ${u}`;
  }
  // 2)
  if ((0, Predicate_js_1.hasProperty)(u, "toString") && (0, Predicate_js_1.isFunction)(u["toString"]) && u["toString"] !== Object.prototype.toString) {
    return u["toString"]();
  }
  // 3)
  return `Error: ${JSON.stringify(u)}`;
};
exports.prettyErrorMessage = prettyErrorMessage;
const spanSymbol = /*#__PURE__*/Symbol.for("effect/SpanAnnotation");
const defaultRenderError = error => {
  const span = (0, Predicate_js_1.hasProperty)(error, spanSymbol) && error[spanSymbol];
  if (error instanceof Error) {
    return new PrettyError((0, exports.prettyErrorMessage)(error), error.stack?.split("\n").filter(_ => _.match(/at (.*)/)).join("\n"), span);
  }
  return new PrettyError((0, exports.prettyErrorMessage)(error), void 0, span);
};
/** @internal */
const prettyErrors = cause => (0, exports.reduceWithContext)(cause, void 0, {
  emptyCase: () => [],
  dieCase: (_, unknownError) => {
    return [defaultRenderError(unknownError)];
  },
  failCase: (_, error) => {
    return [defaultRenderError(error)];
  },
  interruptCase: () => [],
  parallelCase: (_, l, r) => [...l, ...r],
  sequentialCase: (_, l, r) => [...l, ...r]
});
exports.prettyErrors = prettyErrors;
//# sourceMappingURL=cause.js.map