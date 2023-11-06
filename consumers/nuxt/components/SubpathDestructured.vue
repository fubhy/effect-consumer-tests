<template>
  <div>
    Hello {{ effect }}
  </div>
</template>

<script setup lang="ts">
import { succeed, runSync } from "effect/Effect"

const effect = succeed("SubpathDestructured").pipe(runSync)
</script>
