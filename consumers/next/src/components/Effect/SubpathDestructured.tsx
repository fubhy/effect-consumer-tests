import { succeed, runSync } from "effect/Effect"

export const SubpathDestructured = () => {
    return <div>{succeed("SubpathDestructured").pipe(runSync)}</div>
}
