import { Effect } from "effect"

export const RootDestructured = () => {
    return <div>{Effect.succeed("RootDestructured").pipe(Effect.runSync)}</div>
}
