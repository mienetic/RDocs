<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { getTypeInfo } from '../data/rust-types'
import { tooltipState } from '../composables/useCodeTooltips'

const tooltipStyle = computed(() => {
  return {
    left: `${tooltipState.x}px`,
    top: `${tooltipState.y}px`,
    width: '280px',
    display: tooltipState.visible ? 'block' : 'none',
    opacity: tooltipState.visible ? 1 : 0,
    transform: tooltipState.visible ? 'translateY(0)' : 'translateY(4px)'
  }
})

const typeInfo = computed(() => {
  if (!tooltipState.typeName) return undefined
  return getTypeInfo(tooltipState.typeName)
})

const handleLinkClick = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (typeInfo.value?.link) {
    const basePath = '/RDocs'
    window.location.href = basePath + typeInfo.value.link
  }
}

// Close tooltip when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  if (!tooltipState.visible) return
  
  const tooltip = document.querySelector('.rust-type-tooltip')
  const target = e.target as HTMLElement
  
  // Don't close if clicking inside the tooltip
  if (tooltip && tooltip.contains(target)) {
    return
  }
  
  // Don't close if clicking on a rust type trigger (will show new tooltip)
  if (target.hasAttribute('data-rust-type') || target.closest('[data-rust-type]')) {
    return
  }
  
  // Clear background from all highlighted types before closing
  const highlightedTypes = document.querySelectorAll('[data-rust-type]')
  highlightedTypes.forEach(el => {
    const element = el as HTMLElement
    if (element.style.backgroundColor) {
      element.style.backgroundColor = ''
    }
  })
  
  // Close tooltip
  tooltipState.visible = false
}

watch(() => tooltipState.visible, (visible) => {
  if (visible) {
    document.addEventListener('click', handleClickOutside, true)
  } else {
    document.removeEventListener('click', handleClickOutside, true)
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="rust-type-tooltip" :style="tooltipStyle">
      <div v-if="typeInfo" class="tooltip-content">
        <div class="tooltip-header">
          <Icon 
            v-if="typeInfo.icon" 
            :icon="typeInfo.icon" 
            class="tooltip-icon"
            width="20"
            height="20"
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
          <Icon icon="lucide:external-link" width="14" height="14" />
          <span class="tooltip-link-hint">คลิกเพื่อดูเพิ่มเติม</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.rust-type-tooltip {
  position: fixed;
  z-index: 9999;
  padding: 12px 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  pointer-events: auto; /* Allow clicks on tooltip and its buttons */
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.tooltip-icon {
  color: var(--vp-c-brand-1);
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
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-border);
  color: var(--vp-c-brand-1);
  cursor: pointer;
  transition: color 0.2s ease;
}

.tooltip-footer:hover {
  color: var(--vp-c-brand-2);
}

.tooltip-link-hint {
  font-size: 0.85em;
}
</style>
