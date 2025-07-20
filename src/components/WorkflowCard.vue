<template>
  <div class="workflow-card" @click="$emit('click')">
    <!-- 卡片標題 -->
    <div class="card-header">
      <div class="card-icon">
        <slot name="icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </slot>
      </div>
      <div class="card-title-section">
        <h3 class="card-title">{{ title }}</h3>
        <div class="card-meta">
          <span class="card-category">{{ category }}</span>
          <span class="card-separator">•</span>
          <span class="card-usage">{{ usage }}次使用</span>
        </div>
      </div>
    </div>
    
    <!-- 卡片內容 -->
    <div class="card-content">
      <p class="card-description">{{ description }}</p>
      
      <!-- 標籤 -->
      <div class="card-tags" v-if="tags && tags.length">
        <span 
          v-for="tag in tags" 
          :key="tag" 
          class="tag"
          :class="getTagClass(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- 卡片操作 -->
    <div class="card-actions">
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{{ rating }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">👥</span>
          <span class="stat-value">{{ users }}</span>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn-secondary" @click.stop="$emit('preview')">
          預覽
        </button>
        <button class="btn-primary" @click.stop="$emit('use')">
          使用
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  category: string
  description: string
  usage: number
  rating: number
  users: string
  tags?: string[]
}

defineProps<Props>()
defineEmits(['click', 'preview', 'use'])

const getTagClass = (tag: string) => {
  const tagMap: Record<string, string> = {
    'AI': 'tag-ai',
    'SEO': 'tag-seo', 
    '分析': 'tag-analysis',
    '報告': 'tag-report',
    '自動化': 'tag-automation',
    '優化': 'tag-optimization'
  }
  return tagMap[tag] || 'tag-default'
}
</script>

<style scoped>
.workflow-card {
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.workflow-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

/* 卡片標題 */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.card-icon {
  width: 48px;
  height: 48px;
  background: var(--accent-bg);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
}

.card-icon svg {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
}

.card-title-section {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--text-muted);
}

.card-category {
  color: var(--primary-color);
  font-weight: 500;
}

.card-separator {
  color: var(--border-color);
}

/* 卡片內容 */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.card-description {
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.9rem;
  margin: 0;
}

/* 標籤 */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
}

.tag-ai {
  background: rgba(34, 139, 230, 0.1);
  color: var(--primary-color);
  border-color: rgba(34, 139, 230, 0.2);
}

.tag-seo {
  background: rgba(81, 207, 102, 0.1);
  color: var(--success-color);
  border-color: rgba(81, 207, 102, 0.2);
}

.tag-analysis {
  background: rgba(255, 212, 59, 0.1);
  color: var(--warning-color);
  border-color: rgba(255, 212, 59, 0.2);
}

.tag-report {
  background: rgba(255, 107, 107, 0.1);
  color: var(--error-color);
  border-color: rgba(255, 107, 107, 0.2);
}

.tag-automation {
  background: rgba(123, 104, 238, 0.1);
  color: #7b68ee;
  border-color: rgba(123, 104, 238, 0.2);
}

.tag-optimization {
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
  border-color: rgba(255, 149, 0, 0.2);
}

.tag-default {
  background: var(--accent-bg);
  color: var(--text-muted);
  border-color: var(--border-color);
}

/* 卡片操作 */
.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color);
}

.card-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.stat-icon {
  font-size: 0.75rem;
}

.stat-value {
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border-color: var(--primary-color);
}

.btn-primary:hover {
  box-shadow: var(--shadow-primary);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--accent-bg);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .workflow-card {
    padding: var(--spacing-md);
  }
  
  .card-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: stretch;
  }
  
  .btn-primary,
  .btn-secondary {
    flex: 1;
  }
}
</style>