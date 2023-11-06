<template>
  <div>
    Hello {{ effect }}
  </div>
</template>

<script setup lang="ts">
import * as Effect from "effect/Effect"

const effect = Effect.succeed("SubpathWildcard").pipe(Effect.runSync)
</script>
