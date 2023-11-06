"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractSupervisor = exports.unsafeTrack = exports.track = exports.none = exports.fromEffect = exports.fibersIn = exports.addSupervisor = exports.SupervisorTypeId = void 0;
const core = /*#__PURE__*/require("./internal/core.js");
const circular = /*#__PURE__*/require("./internal/layer/circular.js");
const internal = /*#__PURE__*/require("./internal/supervisor.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.SupervisorTypeId = internal.SupervisorTypeId;
/**
 * @since 2.0.0
 * @category context
 */
exports.addSupervisor = circular.addSupervisor;
/**
 * Creates a new supervisor that tracks children in a set.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fibersIn = internal.fibersIn;
/**
 * Creates a new supervisor that constantly yields effect when polled
 *
 * @since 2.0.0
 * @category constructors
 */
exports.fromEffect = internal.fromEffect;
/**
 * A supervisor that doesn't do anything in response to supervision events.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.none = internal.none;
/**
 * Creates a new supervisor that tracks children in a set.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.track = internal.track;
/**
 * Unsafely creates a new supervisor that tracks children in a set.
 *
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeTrack = internal.unsafeTrack;
/**
 * @since 2.0.0
 * @category constructors
 */
class AbstractSupervisor {
  /**
   * @since 2.0.0
   */
  onStart(_context, _effect, _parent, _fiber) {
    //
  }
  /**
   * @since 2.0.0
   */
  onEnd(_value, _fiber) {
    //
  }
  /**
   * @since 2.0.0
   */
  onEffect(_fiber, _effect) {
    //
  }
  /**
   * @since 2.0.0
   */
  onSuspend(_fiber) {
    //
  }
  /**
   * @since 2.0.0
   */
  onResume(_fiber) {
    //
  }
  /**
   * @since 2.0.0
   */
  map(f) {
    return new internal.ProxySupervisor(this, () => core.map(this.value(), f));
  }
  /**
   * @since 2.0.0
   */
  zip(right) {
    return new internal.Zip(this, right);
  }
  /**
   * @since 2.0.0
   */
  onRun(execution, _fiber) {
    return execution();
  }
  /**
   * @since 2.0.0
   */
  [exports.SupervisorTypeId] = internal.supervisorVariance;
}
exports.AbstractSupervisor = AbstractSupervisor;
//# sourceMappingURL=Supervisor.js.map