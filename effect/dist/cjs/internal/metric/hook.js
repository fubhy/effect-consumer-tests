"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.summary = exports.histogram = exports.gauge = exports.frequency = exports.counter = exports.onUpdate = exports.make = exports.MetricHookTypeId = void 0;
const Chunk = /*#__PURE__*/require("../../Chunk.js");
const Duration = /*#__PURE__*/require("../../Duration.js");
const Function_js_1 = /*#__PURE__*/require("../../Function.js");
const HashMap = /*#__PURE__*/require("../../HashMap.js");
const number = /*#__PURE__*/require("../../Number.js");
const Option = /*#__PURE__*/require("../../Option.js");
const Pipeable_js_1 = /*#__PURE__*/require("../../Pipeable.js");
const ReadonlyArray = /*#__PURE__*/require("../../ReadonlyArray.js");
const metricState = /*#__PURE__*/require("./state.js");
/** @internal */
const MetricHookSymbolKey = "effect/MetricHook";
/** @internal */
exports.MetricHookTypeId = /*#__PURE__*/Symbol.for(MetricHookSymbolKey);
/** @internal */
const metricHookVariance = {
  _In: _ => _,
  _Out: _ => _
};
/** @internal */
const make = options => ({
  [exports.MetricHookTypeId]: metricHookVariance,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  ...options
});
exports.make = make;
/** @internal */
exports.onUpdate = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, f) => ({
  [exports.MetricHookTypeId]: metricHookVariance,
  pipe() {
    return (0, Pipeable_js_1.pipeArguments)(this, arguments);
  },
  get: self.get,
  update: input => {
    self.update(input);
    return f(input);
  }
}));
const bigint0 = /*#__PURE__*/BigInt(0);
/** @internal */
const counter = key => {
  let sum = key.keyType.bigint ? bigint0 : 0;
  const canUpdate = key.keyType.incremental ? key.keyType.bigint ? value => value >= bigint0 : value => value >= 0 : _value => true;
  return (0, exports.make)({
    get: () => metricState.counter(sum),
    update: value => {
      if (canUpdate(value)) {
        sum = sum + value;
      }
    }
  });
};
exports.counter = counter;
/** @internal */
const frequency = _key => {
  let count = 0;
  const values = new Map();
  const update = word => {
    count = count + 1;
    const slotCount = values.get(word) ?? 0;
    values.set(word, slotCount + 1);
  };
  const snapshot = () => HashMap.fromIterable(values.entries());
  return (0, exports.make)({
    get: () => metricState.frequency(snapshot()),
    update
  });
};
exports.frequency = frequency;
/** @internal */
const gauge = (_key, startAt) => {
  let value = startAt;
  return (0, exports.make)({
    get: () => metricState.gauge(value),
    update: v => {
      value = v;
    }
  });
};
exports.gauge = gauge;
/** @internal */
const histogram = key => {
  const bounds = key.keyType.boundaries.values;
  const size = bounds.length;
  const values = new Uint32Array(size + 1);
  const boundaries = new Float32Array(size);
  let count = 0;
  let sum = 0;
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  (0, Function_js_1.pipe)(bounds, Chunk.sort(number.Order), Chunk.map((n, i) => {
    boundaries[i] = n;
  }));
  // Insert the value into the right bucket with a binary search
  const update = value => {
    let from = 0;
    let to = size;
    while (from !== to) {
      const mid = Math.floor(from + (to - from) / 2);
      const boundary = boundaries[mid];
      if (value <= boundary) {
        to = mid;
      } else {
        from = mid;
      }
      // The special case when to / from have a distance of one
      if (to === from + 1) {
        if (value <= boundaries[from]) {
          to = from;
        } else {
          from = to;
        }
      }
    }
    values[from] = values[from] + 1;
    count = count + 1;
    sum = sum + value;
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  };
  const getBuckets = () => {
    const builder = Array(size);
    let cumulated = 0;
    for (let i = 0; i < size; i++) {
      const boundary = boundaries[i];
      const value = values[i];
      cumulated = cumulated + value;
      builder[i] = [boundary, cumulated];
    }
    return Chunk.unsafeFromArray(builder);
  };
  return (0, exports.make)({
    get: () => metricState.histogram({
      buckets: getBuckets(),
      count,
      min,
      max,
      sum
    }),
    update
  });
};
exports.histogram = histogram;
/** @internal */
const summary = key => {
  const {
    error,
    maxAge,
    maxSize,
    quantiles
  } = key.keyType;
  const sortedQuantiles = (0, Function_js_1.pipe)(quantiles, Chunk.sort(number.Order));
  const values = Array(maxSize);
  let head = 0;
  let count = 0;
  let sum = 0;
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  // Just before the snapshot we filter out all values older than maxAge
  const snapshot = now => {
    const builder = [];
    // If the buffer is not full yet it contains valid items at the 0..last
    // indices and null values at the rest of the positions.
    //
    // If the buffer is already full then all elements contains a valid
    // measurement with timestamp.
    //
    // At any given point in time we can enumerate all the non-null elements in
    // the buffer and filter them by timestamp to get a valid view of a time
    // window.
    //
    // The order does not matter because it gets sorted before passing to
    // `calculateQuantiles`.
    let i = 0;
    while (i !== maxSize - 1) {
      const item = values[i];
      if (item != null) {
        const [t, v] = item;
        const age = Duration.millis(now - t);
        if (Duration.greaterThanOrEqualTo(age, Duration.zero) && age <= maxAge) {
          builder.push(v);
        }
      }
      i = i + 1;
    }
    return calculateQuantiles(error, sortedQuantiles, (0, Function_js_1.pipe)(Chunk.unsafeFromArray(builder), Chunk.sort(number.Order)));
  };
  const observe = (value, timestamp) => {
    if (maxSize > 0) {
      head = head + 1;
      const target = head % maxSize;
      values[target] = [timestamp, value];
    }
    count = count + 1;
    sum = sum + value;
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  };
  return (0, exports.make)({
    get: () => metricState.summary({
      error,
      quantiles: snapshot(Date.now()),
      count,
      min,
      max,
      sum
    }),
    update: ([value, timestamp]) => observe(value, timestamp)
  });
};
exports.summary = summary;
/** @internal */
const calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
  // The number of samples examined
  const sampleCount = sortedSamples.length;
  if (Chunk.isEmpty(sortedQuantiles)) {
    return Chunk.empty();
  }
  const head = Chunk.unsafeHead(sortedQuantiles);
  const tail = (0, Function_js_1.pipe)(sortedQuantiles, Chunk.drop(1));
  const resolved = (0, Function_js_1.pipe)(tail, ReadonlyArray.reduce(Chunk.of(resolveQuantile(error, sampleCount, Option.none(), 0, head, sortedSamples)), (accumulator, quantile) => {
    const h = Chunk.unsafeHead(accumulator);
    return (0, Function_js_1.pipe)(accumulator, Chunk.append(resolveQuantile(error, sampleCount, h.value, h.consumed, quantile, h.rest)));
  }));
  return (0, Function_js_1.pipe)(resolved, Chunk.map(rq => [rq.quantile, rq.value]));
};
/** @internal */
const resolveQuantile = (error, sampleCount, current, consumed, quantile, rest) => {
  let error_1 = error;
  let sampleCount_1 = sampleCount;
  let current_1 = current;
  let consumed_1 = consumed;
  let quantile_1 = quantile;
  let rest_1 = rest;
  let error_2 = error;
  let sampleCount_2 = sampleCount;
  let current_2 = current;
  let consumed_2 = consumed;
  let quantile_2 = quantile;
  let rest_2 = rest;
  // eslint-disable-next-line no-constant-condition
  while (1) {
    // If the remaining list of samples is empty, there is nothing more to resolve
    if (Chunk.isEmpty(rest_1)) {
      return {
        quantile: quantile_1,
        value: Option.none(),
        consumed: consumed_1,
        rest: Chunk.empty()
      };
    }
    // If the quantile is the 100% quantile, we can take the maximum of all the
    // remaining values as the result
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: Option.some(Chunk.unsafeLast(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: Chunk.empty()
      };
    }
    // Split into two chunks - the first chunk contains all elements of the same
    // value as the chunk head
    const sameHead = (0, Function_js_1.pipe)(rest_1, Chunk.splitWhere(n => n > Chunk.unsafeHead(rest_1)));
    // How many elements do we want to accept for this quantile
    const desired = quantile_1 * sampleCount_1;
    // The error margin
    const allowedError = error_1 / 2 * desired;
    // Taking into account the elements consumed from the samples so far and the
    // number of same elements at the beginning of the chunk, calculate the number
    // of elements we would have if we selected the current head as result
    const candConsumed = consumed_1 + sameHead[0].length;
    const candError = Math.abs(candConsumed - desired);
    // If we haven't got enough elements yet, recurse
    if (candConsumed < desired - allowedError) {
      error_2 = error_1;
      sampleCount_2 = sampleCount_1;
      current_2 = Chunk.head(rest_1);
      consumed_2 = candConsumed;
      quantile_2 = quantile_1;
      rest_2 = sameHead[1];
      error_1 = error_2;
      sampleCount_1 = sampleCount_2;
      current_1 = current_2;
      consumed_1 = consumed_2;
      quantile_1 = quantile_2;
      rest_1 = rest_2;
      continue;
    }
    // If we have too many elements, select the previous value and hand back the
    // the rest as leftover
    if (candConsumed > desired + allowedError) {
      return {
        quantile: quantile_1,
        value: current_1,
        consumed: consumed_1,
        rest: rest_1
      };
    }
    // If we are in the target interval, select the current head and hand back the leftover after dropping all elements
    // from the sample chunk that are equal to the current head
    switch (current_1._tag) {
      case "None":
        {
          error_2 = error_1;
          sampleCount_2 = sampleCount_1;
          current_2 = Chunk.head(rest_1);
          consumed_2 = candConsumed;
          quantile_2 = quantile_1;
          rest_2 = sameHead[1];
          error_1 = error_2;
          sampleCount_1 = sampleCount_2;
          current_1 = current_2;
          consumed_1 = consumed_2;
          quantile_1 = quantile_2;
          rest_1 = rest_2;
          continue;
        }
      case "Some":
        {
          const prevError = Math.abs(desired - current_1.value);
          if (candError < prevError) {
            error_2 = error_1;
            sampleCount_2 = sampleCount_1;
            current_2 = Chunk.head(rest_1);
            consumed_2 = candConsumed;
            quantile_2 = quantile_1;
            rest_2 = sameHead[1];
            error_1 = error_2;
            sampleCount_1 = sampleCount_2;
            current_1 = current_2;
            consumed_1 = consumed_2;
            quantile_1 = quantile_2;
            rest_1 = rest_2;
            continue;
          }
          return {
            quantile: quantile_1,
            value: Option.some(current_1.value),
            consumed: consumed_1,
            rest: rest_1
          };
        }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/io/issues");
};
//# sourceMappingURL=hook.js.map