<script setup lang="ts">
defineProps<{
  for?: string
}>()
</script>

<template>
  <label
    :for="for"
    class="
      mb-2
      block
      text-sm
      font-medium
      text-slate-700
    "
  >
    <slot />
  </label>
</template>