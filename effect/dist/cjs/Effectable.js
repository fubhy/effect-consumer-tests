"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StructuralClass = exports.Class = exports.StructuralCommitPrototype = exports.CommitPrototype = exports.EffectPrototype = exports.ChannelTypeId = exports.SinkTypeId = exports.StreamTypeId = exports.EffectTypeId = void 0;
const internal = /*#__PURE__*/require("./internal/effectable.js");
/**
 * @since 2.0.0
 * @category type ids
 */
exports.EffectTypeId = internal.EffectTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
exports.StreamTypeId = internal.StreamTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
exports.SinkTypeId = internal.SinkTypeId;
/**
 * @since 2.0.0
 * @category type ids
 */
exports.ChannelTypeId = internal.ChannelTypeId;
/**
 * @since 2.0.0
 * @category prototypes
 */
exports.EffectPrototype = internal.EffectPrototype;
/**
 * @since 2.0.0
 * @category prototypes
 */
exports.CommitPrototype = internal.CommitPrototype;
/**
 * @since 2.0.0
 * @category prototypes
 */
exports.StructuralCommitPrototype = internal.StructuralCommitPrototype;
const Base = internal.Base;
const StructuralBase = internal.StructuralBase;
/**
 * @since 2.0.0
 * @category constructors
 */
class Class extends Base {}
exports.Class = Class;
/**
 * @since 2.0.0
 * @category constructors
 */
class StructuralClass extends StructuralBase {}
exports.StructuralClass = StructuralClass;
//# sourceMappingURL=Effectable.js.map