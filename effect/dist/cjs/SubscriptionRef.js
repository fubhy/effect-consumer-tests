"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSomeAndGetEffect = exports.updateSomeAndGet = exports.updateSomeEffect = exports.updateSome = exports.updateAndGetEffect = exports.updateAndGet = exports.updateEffect = exports.update = exports.setAndGet = exports.set = exports.modifySomeEffect = exports.modifySome = exports.modifyEffect = exports.modify = exports.make = exports.getAndUpdateSomeEffect = exports.getAndUpdateSome = exports.getAndUpdateEffect = exports.getAndUpdate = exports.getAndSet = exports.get = exports.SubscriptionRefTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/subscriptionRef.js");
const Ref = /*#__PURE__*/require("./Ref.js");
const Synchronized = /*#__PURE__*/require("./SynchronizedRef.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.SubscriptionRefTypeId = internal.SubscriptionRefTypeId;
/**
 * @since 2.0.0
 * @category getters
 */
exports.get = internal.get;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndSet = Ref.getAndSet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdate = Ref.getAndUpdate;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdateEffect = Synchronized.getAndUpdateEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdateSome = Ref.getAndUpdateSome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdateSomeEffect = Synchronized.getAndUpdateSomeEffect;
/**
 * Creates a new `SubscriptionRef` with the specified value.
 *
 * @since 2.0.0
 * @category constructors
 */
exports.make = internal.make;
/**
 * @since 2.0.0
 * @category utils
 */
exports.modify = internal.modify;
/**
 * @since 2.0.0
 * @category utils
 */
exports.modifyEffect = internal.modifyEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.modifySome = Ref.modifySome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.modifySomeEffect = Synchronized.modifySomeEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.set = internal.set;
/**
 * @since 2.0.0
 * @category utils
 */
exports.setAndGet = Ref.setAndGet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.update = Ref.update;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateEffect = Synchronized.updateEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateAndGet = Ref.updateAndGet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateAndGetEffect = Synchronized.updateAndGetEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSome = Ref.updateSome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSomeEffect = Synchronized.updateSomeEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSomeAndGet = Ref.updateSomeAndGet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSomeAndGetEffect = Synchronized.updateSomeAndGetEffect;
//# sourceMappingURL=SubscriptionRef.js.map