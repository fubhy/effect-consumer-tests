import * as Effect from "effect"

export const RootWildcard = () => {
    return <div>{Effect.Effect.succeed("RootWildcard").pipe(Effect.Effect.runSync)}</div>
}
