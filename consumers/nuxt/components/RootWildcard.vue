<template>
  <div>
    Hello {{ effect }}
  </div>
</template>

<script setup lang="ts">
import * as Effect from "effect"

const effect = Effect.Effect.succeed("RootWildcard").pipe(Effect.Effect.runSync)
</script>
