<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { getTypeInfo, type RustTypeInfo } from '../data/rust-types'

const props = defineProps<{
  typeName: string
}>()

const showTooltip = ref(false)
const tooltipStyle = ref({})
const triggerRef = ref<HTMLElement | null>(null)

const typeInfo = computed<RustTypeInfo | undefined>(() => {
  return getTypeInfo(props.typeName)
})

const updateTooltipPosition = () => {
  if (!triggerRef.value) return
  
  const rect = triggerRef.value.getBoundingClientRect()
  const tooltipWidth = 280
  const tooltipHeight = 100
  
  let left = rect.left + rect.width / 2 - tooltipWidth / 2
  let top = rect.top - tooltipHeight - 8
  
  // Stay within viewport
  if (left < 10) left = 10
  if (left + tooltipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltipWidth - 10
  }
  
  // Show below if no space above
  if (top < 10) {
    top = rect.bottom + 8
  }
  
  tooltipStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${tooltipWidth}px`
  }
}

const handleMouseEnter = () => {
  showTooltip.value = true
  nextTick(updateTooltipPosition)
}

const handleMouseLeave = () => {
  showTooltip.value = false
}

const handleClick = (e: MouseEvent) => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // On touch devices: show tooltip (user will click footer button to navigate)
  if (isTouchDevice) {
    if (!showTooltip.value) {
      e.preventDefault()
      showTooltip.value = true
      nextTick(updateTooltipPosition)
    }
    return
  }
  
  // On desktop: redirect directly (hover already shows tooltip)
  if (typeInfo.value?.link) {
    e.preventDefault()
    window.location.href = typeInfo.value.link
  }
}

// Navigate when clicking the footer link
const handleLinkClick = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (typeInfo.value?.link) {
    window.location.href = typeInfo.value.link
  }
}

// Hide tooltip when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  if (showTooltip.value && triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
    showTooltip.value = false
  }
}

// Handle scroll and resize
onMounted(() => {
  window.addEventListener('scroll', updateTooltipPosition, true)
  window.addEventListener('resize', updateTooltipPosition)
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateTooltipPosition, true)
  window.removeEventListener('resize', updateTooltipPosition)
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<template>
  <span
    ref="triggerRef"
    class="code-tooltip-trigger"
    :class="{ 'has-link': typeInfo?.link }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <slot>{{ typeName }}</slot>
  </span>
  
  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div
        v-if="showTooltip && typeInfo"
        class="code-tooltip"
        :style="tooltipStyle"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        <div class="tooltip-header">
          <Icon 
            v-if="typeInfo.icon" 
            :icon="typeInfo.icon" 
            class="tooltip-icon"
            :width="20"
            :height="20"
          />
          <span class="tooltip-name">{{ typeInfo.name }}</span>
        </div>
        <div class="tooltip-description">
          {{ typeInfo.description }}
        </div>
        <div 
          v-if="typeInfo.link" 
          class="tooltip-footer"
          @click="handleLinkClick"
        >
          <Icon icon="lucide:external-link" :width="14" :height="14" />
          <span class="tooltip-link-hint">คลิกเพื่อดูเพิ่มเติม</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.code-tooltip-trigger {
  cursor: help;
  border-bottom: 1px dashed var(--vp-c-brand-2);
  transition: all 0.2s ease;
}

.code-tooltip-trigger.has-link {
  cursor: pointer;
}

.code-tooltip-trigger:hover {
  background-color: var(--vp-c-brand-soft);
  border-bottom-color: var(--vp-c-brand-1);
}

.code-tooltip {
  position: fixed;
  z-index: 9999;
  padding: 12px 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.tooltip-icon {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}

.tooltip-name {
  font-weight: 600;
  font-size: 1.1em;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}

.tooltip-description {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.tooltip-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-border);
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-brand-2);
  cursor: pointer;
  transition: color 0.2s ease;
}

.tooltip-footer:hover {
  color: var(--vp-c-brand-1);
}

.tooltip-link-hint {
  font-size: 0.8em;
}

/* Animation */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>

