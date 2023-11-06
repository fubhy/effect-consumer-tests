"use strict";

/**
 * @since 2.0.0
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withScheduler = exports.currentScheduler = exports.timerBatched = exports.timer = exports.makeBatched = exports.make = exports.defaultShouldYield = exports.makeMatrix = exports.ControlledScheduler = exports.SyncScheduler = exports.defaultScheduler = exports.MixedScheduler = exports.PriorityBuckets = void 0;
const Function_js_1 = /*#__PURE__*/require("./Function.js");
const GlobalValue_js_1 = /*#__PURE__*/require("./GlobalValue.js");
const core = /*#__PURE__*/require("./internal/core.js");
const timeout = /*#__PURE__*/require("./internal/timeout.js");
/**
 * @since 2.0.0
 * @category utils
 */
class PriorityBuckets {
  /**
   * @since 2.0.0
   */
  buckets = [];
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    let bucket = undefined;
    let index;
    for (index = 0; index < this.buckets.length; index++) {
      if (this.buckets[index][0] <= priority) {
        bucket = this.buckets[index];
      } else {
        break;
      }
    }
    if (bucket) {
      bucket[1].push(task);
    } else {
      const newBuckets = [];
      for (let i = 0; i < index; i++) {
        newBuckets.push(this.buckets[i]);
      }
      newBuckets.push([priority, [task]]);
      for (let i = index; i < this.buckets.length; i++) {
        newBuckets.push(this.buckets[i]);
      }
      this.buckets = newBuckets;
    }
  }
}
exports.PriorityBuckets = PriorityBuckets;
/**
 * @since 2.0.0
 * @category constructors
 */
class MixedScheduler {
  maxNextTickBeforeTimer;
  /**
   * @since 2.0.0
   */
  running = false;
  /**
   * @since 2.0.0
   */
  tasks = new PriorityBuckets();
  constructor(
  /**
   * @since 2.0.0
   */
  maxNextTickBeforeTimer) {
    this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
  }
  /**
   * @since 2.0.0
   */
  starveInternal(depth) {
    const tasks = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (this.tasks.buckets.length === 0) {
      this.running = false;
    } else {
      this.starve(depth);
    }
  }
  /**
   * @since 2.0.0
   */
  starve(depth = 0) {
    if (depth >= this.maxNextTickBeforeTimer) {
      timeout.set(() => this.starveInternal(0), 0);
    } else {
      Promise.resolve(void 0).then(() => this.starveInternal(depth + 1));
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(core.currentMaxOpsBeforeYield) ? fiber.getFiberRef(core.currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (!this.running) {
      this.running = true;
      this.starve();
    }
  }
}
exports.MixedScheduler = MixedScheduler;
/**
 * @since 2.0.0
 * @category schedulers
 */
exports.defaultScheduler = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/Scheduler/defaultScheduler"), () => new MixedScheduler(2048));
/**
 * @since 2.0.0
 * @category constructors
 */
class SyncScheduler {
  /**
   * @since 2.0.0
   */
  tasks = new PriorityBuckets();
  /**
   * @since 2.0.0
   */
  deferred = false;
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    if (this.deferred) {
      exports.defaultScheduler.scheduleTask(task, priority);
    } else {
      this.tasks.scheduleTask(task, priority);
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(core.currentMaxOpsBeforeYield) ? fiber.getFiberRef(core.currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  flush() {
    while (this.tasks.buckets.length > 0) {
      const tasks = this.tasks.buckets;
      this.tasks.buckets = [];
      for (const [_, toRun] of tasks) {
        for (let i = 0; i < toRun.length; i++) {
          toRun[i]();
        }
      }
    }
    this.deferred = true;
  }
}
exports.SyncScheduler = SyncScheduler;
/**
 * @since 2.0.0
 * @category constructors
 */
class ControlledScheduler {
  /**
   * @since 2.0.0
   */
  tasks = new PriorityBuckets();
  /**
   * @since 2.0.0
   */
  deferred = false;
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    if (this.deferred) {
      exports.defaultScheduler.scheduleTask(task, priority);
    } else {
      this.tasks.scheduleTask(task, priority);
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(core.currentMaxOpsBeforeYield) ? fiber.getFiberRef(core.currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  step() {
    const tasks = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
  }
}
exports.ControlledScheduler = ControlledScheduler;
/**
 * @since 2.0.0
 * @category constructors
 */
const makeMatrix = (...record) => {
  const index = record.sort(([p0], [p1]) => p0 < p1 ? -1 : p0 > p1 ? 1 : 0);
  return {
    shouldYield(fiber) {
      for (const scheduler of record) {
        const priority = scheduler[1].shouldYield(fiber);
        if (priority !== false) {
          return priority;
        }
      }
      return false;
    },
    scheduleTask(task, priority) {
      let scheduler = undefined;
      for (const i of index) {
        if (priority >= i[0]) {
          scheduler = i[1];
        } else {
          return (scheduler ?? exports.defaultScheduler).scheduleTask(task, priority);
        }
      }
      return (scheduler ?? exports.defaultScheduler).scheduleTask(task, priority);
    }
  };
};
exports.makeMatrix = makeMatrix;
/**
 * @since 2.0.0
 * @category utilities
 */
const defaultShouldYield = fiber => {
  return fiber.currentOpCount > fiber.getFiberRef(core.currentMaxOpsBeforeYield) ? fiber.getFiberRef(core.currentSchedulingPriority) : false;
};
exports.defaultShouldYield = defaultShouldYield;
/**
 * @since 2.0.0
 * @category constructors
 */
const make = (scheduleTask, shouldYield = exports.defaultShouldYield) => ({
  scheduleTask,
  shouldYield
});
exports.make = make;
/**
 * @since 2.0.0
 * @category constructors
 */
const makeBatched = (callback, shouldYield = exports.defaultShouldYield) => {
  let running = false;
  const tasks = new PriorityBuckets();
  const starveInternal = () => {
    const tasksToRun = tasks.buckets;
    tasks.buckets = [];
    for (const [_, toRun] of tasksToRun) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (tasks.buckets.length === 0) {
      running = false;
    } else {
      starve();
    }
  };
  const starve = () => callback(starveInternal);
  return (0, exports.make)((task, priority) => {
    tasks.scheduleTask(task, priority);
    if (!running) {
      running = true;
      starve();
    }
  }, shouldYield);
};
exports.makeBatched = makeBatched;
/**
 * @since 2.0.0
 * @category constructors
 */
const timer = (ms, shouldYield = exports.defaultShouldYield) => (0, exports.make)(task => timeout.set(task, ms), shouldYield);
exports.timer = timer;
/**
 * @since 2.0.0
 * @category constructors
 */
const timerBatched = (ms, shouldYield = exports.defaultShouldYield) => (0, exports.makeBatched)(task => timeout.set(task, ms), shouldYield);
exports.timerBatched = timerBatched;
/** @internal */
exports.currentScheduler = /*#__PURE__*/(0, GlobalValue_js_1.globalValue)( /*#__PURE__*/Symbol.for("effect/FiberRef/currentScheduler"), () => core.fiberRefUnsafeMake(exports.defaultScheduler));
/** @internal */
exports.withScheduler = /*#__PURE__*/(0, Function_js_1.dual)(2, (self, scheduler) => core.fiberRefLocally(self, exports.currentScheduler, scheduler));
//# sourceMappingURL=Scheduler.js.map