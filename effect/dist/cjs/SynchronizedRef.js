"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsafeMake = exports.updateSomeAndGetEffect = exports.updateSomeAndGet = exports.updateSomeEffect = exports.updateSome = exports.updateAndGetEffect = exports.updateAndGet = exports.updateEffect = exports.update = exports.setAndGet = exports.set = exports.modifySomeEffect = exports.modifySome = exports.modifyEffect = exports.modify = exports.getAndUpdateSomeEffect = exports.getAndUpdateSome = exports.getAndUpdateEffect = exports.getAndUpdate = exports.getAndSet = exports.get = exports.make = exports.SynchronizedRefTypeId = void 0;
const circular = /*#__PURE__*/require("./internal/effect/circular.js");
const ref = /*#__PURE__*/require("./internal/ref.js");
const internal = /*#__PURE__*/require("./internal/synchronizedRef.js");
/**
 * @since 2.0.0
 * @category symbols
 */
exports.SynchronizedRefTypeId = circular.SynchronizedTypeId;
/**
 * @since 2.0.0
 * @category constructors
 */
exports.make = circular.makeSynchronized;
/**
 * @since 2.0.0
 * @category getters
 */
exports.get = ref.get;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndSet = ref.getAndSet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdate = ref.getAndUpdate;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdateEffect = internal.getAndUpdateEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdateSome = ref.getAndUpdateSome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.getAndUpdateSomeEffect = internal.getAndUpdateSomeEffect;
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
exports.modifySome = ref.modifySome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.modifySomeEffect = internal.modifySomeEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.set = ref.set;
/**
 * @since 2.0.0
 * @category utils
 */
exports.setAndGet = ref.setAndGet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.update = ref.update;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateEffect = internal.updateEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateAndGet = ref.updateAndGet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateAndGetEffect = internal.updateAndGetEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSome = ref.updateSome;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSomeEffect = internal.updateSomeEffect;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSomeAndGet = ref.updateSomeAndGet;
/**
 * @since 2.0.0
 * @category utils
 */
exports.updateSomeAndGetEffect = circular.updateSomeAndGetEffectSynchronized;
/**
 * @since 2.0.0
 * @category unsafe
 */
exports.unsafeMake = circular.unsafeMakeSynchronized;
//# sourceMappingURL=SynchronizedRef.js.map