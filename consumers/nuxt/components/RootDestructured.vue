<template>
  <div>
    Hello {{ effect }}
  </div>
</template>

<script setup lang="ts">
import { Effect } from "effect"

const effect = Effect.succeed("RootDestructured").pipe(Effect.runSync)
</script>
