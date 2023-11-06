import { Effect } from "effect"

export const RootDestructured = () => {
    return <div>Hello {Effect.succeed("RootDestructured").pipe(Effect.runSync)}</div>
}
