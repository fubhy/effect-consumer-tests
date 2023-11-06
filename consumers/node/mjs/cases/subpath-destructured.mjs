import { succeed, tap, log, runSync } from "effect/Effect"

succeed("subpath-destructured").pipe(tap(log), runSync)
