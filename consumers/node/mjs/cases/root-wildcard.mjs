import * as Effect from "effect"

Effect.Effect.succeed("root wildcard").pipe(Effect.Effect.tap(Effect.Effect.log), Effect.Effect.runSync)
