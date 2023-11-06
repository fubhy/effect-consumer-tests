import { Effect } from "effect"

Effect.succeed("root-destructured").pipe(Effect.tap(Effect.log), Effect.runSync)
