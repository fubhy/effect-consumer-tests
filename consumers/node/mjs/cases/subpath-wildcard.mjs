import * as Effect from "effect/Effect"

Effect.succeed("subpath-wildcard").pipe(Effect.tap(Effect.log), Effect.runSync)
