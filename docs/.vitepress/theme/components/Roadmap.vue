<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { roadmapData } from '../data/roadmap'
</script>

<template>
  <div class="roadmap-container">
    <div class="roadmap-line"></div>
    
    <div class="roadmap-start">
      <div class="start-badge">
        <Icon icon="lucide:rocket" width="24" height="24" />
        <span>เริ่มต้น</span>
      </div>
    </div>

    <div v-for="(level, index) in roadmapData" :key="index" class="roadmap-level" :class="level.colorClass">
      <div class="level-marker">
        <div class="marker-dot"></div>
      </div>
      
      <div class="level-card">
        <div class="card-header">
          <div class="header-icon">
            <Icon :icon="level.icon" width="28" height="28" />
          </div>
          <div class="header-info">
            <h3>{{ level.title }}</h3>
            <span class="duration">{{ level.duration }}</span>
          </div>
        </div>
        
        <p class="description">{{ level.description }}</p>
        
        <div class="topics-grid">
          <a v-for="(item, i) in level.items" 
             :key="i" 
             :href="item.link ? '/RDocs' + item.link : undefined"
             class="topic-item"
             :class="{ 'highlight': item.highlight }"
          >
            {{ item.text }}
          </a>
        </div>
      </div>
    </div>

    <div class="roadmap-end">
      <div class="end-badge">
        <Icon icon="lucide:trophy" width="32" height="32" />
        <span>Rust Master!</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roadmap-container {
  position: relative;
  max-width: 800px;
  margin: 40px auto;
  padding: 20px 0;
  font-family: var(--vp-font-family-base);
}

.roadmap-line {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--vp-c-border);
  z-index: 0;
  border-radius: 2px;
}

@media (max-width: 640px) {
  .roadmap-line {
    left: 20px;
  }
}

.roadmap-start, .roadmap-end {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.roadmap-end {
  margin-top: 20px;
  margin-bottom: 0;
}

.start-badge, .end-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--vp-c-bg-elv);
  border: 2px solid var(--vp-c-brand-1);
  padding: 8px 16px;
  border-radius: 99px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.end-badge {
  border-color: #FFD700;
  color: #FFD700;
  background: #2c2c2c;
}

.start-badge {
  margin-left: 0; /* Align with line if needed, or stick to left layout */
}

/* Level Styles */
.roadmap-level {
  position: relative;
  margin-bottom: 40px;
  padding-left: 60px;
}

@media (max-width: 640px) {
  .roadmap-level {
    padding-left: 50px;
  }
}

.level-marker {
  position: absolute;
  left: 14px;
  top: 24px;
  width: 24px;
  height: 24px;
  background: var(--vp-c-bg);
  border: 4px solid var(--level-color);
  border-radius: 50%;
  z-index: 1;
  transform: translateX(-50%);
}

.roadmap-level.beginner { --level-color: #F74C00; }
.roadmap-level.intermediate { --level-color: #1890FF; }
.roadmap-level.advanced { --level-color: #52C41A; }

.level-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-left: 4px solid var(--level-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.level-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.header-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  background: var(--vp-c-bg-alt);
  border-radius: 12px;
  color: var(--level-color);
}

.header-info h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--level-color);
}

.duration {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  display: block;
}

.description {
  margin: 0 0 20px 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* Topics Grid */
.topics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-item {
  display: inline-block;
  padding: 4px 12px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: all 0.2s;
}

.topic-item:hover {
  background: var(--level-color);
  color: white;
  border-color: var(--level-color);
  text-decoration: none;
}

.topic-item.highlight {
  border-color: var(--level-color);
  font-weight: 600;
}
</style>
