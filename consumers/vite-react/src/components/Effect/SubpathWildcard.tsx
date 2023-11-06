import * as Effect from "effect/Effect"

export const SubpathWildcard = () => {
    return <div>{Effect.succeed("SubpathWildcard").pipe(Effect.runSync)}</div>
}
