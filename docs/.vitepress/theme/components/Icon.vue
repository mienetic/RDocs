<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  name: string
  size?: number | string
  color?: string
}>()
</script>

<template>
  <Icon 
    :icon="name" 
    :width="size || 20" 
    :height="size || 20"
    :style="color ? { color } : {}"
    class="icon-component"
  />
</template>

<style scoped>
.icon-component {
  display: inline-flex;
  vertical-align: middle;
}
</style>
