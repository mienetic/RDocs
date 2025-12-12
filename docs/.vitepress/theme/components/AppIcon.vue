<script setup>
import { Icon } from '@iconify/vue'

defineProps<{
  icon: string
  size?: string
}>()
</script>

<template>
  <Icon :icon="icon" :style="{ fontSize: size || '1.2em' }" class="custom-icon" />
</template>

<style scoped>
.custom-icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.3em;
}
</style>
