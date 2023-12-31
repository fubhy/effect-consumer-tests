/**
 * @since 2.0.0
 */
import { pipeArguments } from "./Pipeable.js";
import * as Stream from "./Stream.js";
const streamVariance = {
  _R: _ => _,
  _E: _ => _,
  _A: _ => _
};
/**
 * @since 2.0.0
 * @category constructors
 */
export class Class {
  /**
   * @since 2.0.0
   */
  [Stream.StreamTypeId] = streamVariance;
  /**
   * @since 2.0.0
   */
  pipe() {
    return pipeArguments(this, arguments);
  }
  /**
   * @internal
   */
  get channel() {
    return Stream.toChannel(this.toStream());
  }
}
//# sourceMappingURL=Streamable.js.map