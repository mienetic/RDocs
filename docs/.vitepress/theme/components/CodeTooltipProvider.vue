<script setup lang="ts">
import { useCodeTooltips } from '../composables/useCodeTooltips'
import GlobalCodeTooltip from './GlobalCodeTooltip.vue'

// เปิดใช้งาน code tooltips
useCodeTooltips()
</script>

<template>
  <slot />
  <GlobalCodeTooltip />
</template>
