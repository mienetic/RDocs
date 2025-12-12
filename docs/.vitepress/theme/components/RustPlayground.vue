<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  edition?: string
}>()

const codeRef = ref<HTMLElement | null>(null)
const code = ref('')

onMounted(() => {
  // ดึง code จาก slot content
  if (codeRef.value) {
    const codeBlock = codeRef.value.querySelector('pre code')
    if (codeBlock) {
      code.value = codeBlock.textContent || ''
    }
  }
})

// สร้าง URL สำหรับ Rust Playground
const playgroundUrl = computed(() => {
  const codeText = encodeURIComponent(code.value.trim())
  const edition = props.edition || '2024'
  return `https://play.rust-lang.org/?version=stable&mode=debug&edition=${edition}&code=${codeText}`
})

const openPlayground = () => {
  if (code.value) {
    window.open(playgroundUrl.value, '_blank')
  }
}
</script>

<template>
  <div class="rust-playground" ref="codeRef">
    <div class="playground-header">
      <span class="lang-badge">Rust</span>
      <button 
        class="run-button" 
        @click="openPlayground"
        title="เปิดใน Rust Playground"
      >
        <svg class="play-icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M8 5v14l11-7z"/>
        </svg>
        <span>Run</span>
      </button>
    </div>
    <div class="code-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.rust-playground {
  position: relative;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.lang-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #F74C00;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.run-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #F74C00 0%, #FF6B1A 100%);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.run-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(247, 76, 0, 0.4);
}

.run-button:active {
  transform: translateY(0);
}

.play-icon {
  flex-shrink: 0;
}

.code-content {
  background: var(--vp-code-block-bg);
}

.code-content :deep(div[class*='language-']) {
  margin: 0;
  border-radius: 0;
  border: none;
}

.code-content :deep(pre) {
  margin: 0;
  border-radius: 0;
}
</style>
