import type * as Chunk from "../../Chunk.js";
export interface Emit<A> {
    readonly _tag: OP_EMIT;
    readonly elements: Chunk.Chunk<A>;
}
//# sourceMappingURL=handoffSignal.d.ts.map