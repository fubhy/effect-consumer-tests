const { succeed, tap, log, runSync } = require("effect/Effect")

succeed("subpath-destructured").pipe(tap(log), runSync)
