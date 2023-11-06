import type * as Effect from "../Effect.js";
import * as OpCodes from "./opCodes/effect.js";
export interface Commit extends Op<OpCodes.OP_COMMIT, {
    commit(): Effect.Effect<unknown, unknown, unknown>;
}> {
}
//# sourceMappingURL=core.d.ts.map