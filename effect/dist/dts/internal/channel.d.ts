import type * as Channel from "../Channel.js";
import * as Effect from "../Effect.js";
export declare const mapInputInEffect: (<Env1, InErr, InElem0, InElem>(f: (a: InElem0) => Effect.Effect<Env1, InErr, InElem>) => <Env, InDone, OutErr, OutElem, OutDone>(self: Channel.Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>) => Channel.Channel<Env1 | Env, InErr, InElem0, InDone, OutErr, OutElem, OutDone>) & (<Env_1, InDone_1, OutErr_1, OutElem_1, OutDone_1, Env1_1, InErr_1, InElem0_1, InElem_1>(self: Channel.Channel<Env_1, InErr_1, InElem_1, InDone_1, OutErr_1, OutElem_1, OutDone_1>, f: (a: InElem0_1) => Effect.Effect<Env1_1, InErr_1, InElem_1>) => Channel.Channel<Env_1 | Env1_1, InErr_1, InElem0_1, InDone_1, OutErr_1, OutElem_1, OutDone_1>);
//# sourceMappingURL=channel.d.ts.map