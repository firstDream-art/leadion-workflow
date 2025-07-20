<template>
  <div class="dashboard">
    <!-- 左側歷史記錄側邊欄 -->
    <div class="dashboard-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">執行歷史</h3>
        <button class="refresh-btn" @click="refreshHistory" title="刷新歷史記錄">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      
      <div class="history-list">
        <!-- 💡 優化：限制渲染數量，提升性能 -->
        <div 
          v-for="record in limitedExecutionHistory" 
          :key="record.id"
          class="history-item"
          :class="{ 'completed': record.status === 'completed', 'failed': record.status === 'failed', 'running': record.status === 'running' }"
          @click="viewHistoryDetail(record)"
        >
          <div class="history-icon">
            <svg v-if="record.status === 'completed'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else-if="record.status === 'failed'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
            </svg>
          </div>
          
          <div class="history-content">
            <div class="history-title">{{ record.workflowName }}</div>
            <div class="history-time">{{ formatTime(record.startTime) }}</div>
            <div class="history-status" :class="record.status">
              {{ getStatusText(record.status) }}
            </div>
            <div v-if="record.endTime" class="history-duration">
              {{ workflowStore.getExecutionDuration(record) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="dashboard-main">
      <!-- 頁面標題 -->
      <div class="dashboard-header">
        <h1 class="page-title">AI 工作流程</h1>
        <p class="page-subtitle">探索和執行強大的 AI 驅動工作流程</p>
      </div>

      <!-- 分類標籤 -->
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="category-tab"
          :class="{ 'active': selectedCategory === category.id }"
          @click="selectCategory(category.id as WorkflowCategory)"
        >
          <span class="tab-icon" v-html="category.icon"></span>
          <span class="tab-text">{{ category.name }}</span>
          <span class="tab-count">{{ category.count }}</span>
        </button>
      </div>

      <!-- 工作流程網格 -->
      <div class="workflows-grid">
        <WorkflowCard
          v-for="workflow in filteredWorkflows"
          :key="workflow.id"
          :title="workflow.title"
          :category="workflow.category"
          :description="workflow.description"
          :usage="workflow.usage"
          :rating="workflow.rating"
          :users="workflow.users"
          :tags="workflow.tags"
          @click="viewWorkflow(workflow)"
          @preview="previewWorkflow(workflow)"
          @use="useWorkflow(workflow)"
        >
          <template #icon>
            <div v-html="workflow.icon"></div>
          </template>
        </WorkflowCard>
      </div>

      <!-- 空狀態 -->
      <div v-if="filteredWorkflows.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="empty-title">沒有找到工作流程</h3>
        <p class="empty-description">嘗試選擇其他分類或創建新的工作流程</p>
      </div>
    </div>
    
    <!-- SEO 分析器表單 -->
    <SeoAnalyzerForm
      :isVisible="showSeoAnalyzer"
      @close="showSeoAnalyzer = false"
      @analysis-complete="handleSeoAnalysisComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef, markRaw } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import { simulateWebhookReceiver } from '@/api/webhook'
import type { WorkflowCategory } from '@/types'

// 懶加載組件
const WorkflowCard = defineAsyncComponent(() => import('@/components/WorkflowCard.vue'))
const SeoAnalyzerForm = defineAsyncComponent(() => import('@/components/SeoAnalyzerForm.vue'))

// 選中的分類
const selectedCategory = ref<WorkflowCategory>('all')

// SEO 分析器顯示狀態
const showSeoAnalyzer = ref<boolean>(false)

// 使用 workflow store
const workflowStore = useWorkflowStore()

// 初始化 webhook 接收器
onMounted(() => {
  simulateWebhookReceiver()
})

// 分類數據 - 使用 shallowRef 提升效能
const categories = shallowRef([
  {
    id: 'all',
    name: '全部',
    count: 24,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>'
  },
  {
    id: 'seo',
    name: 'SEO優化',
    count: 8,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3z"/></svg>'
  },
  {
    id: 'content',
    name: '內容創作',
    count: 6,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/></svg>'
  },
  {
    id: 'analysis',
    name: '數據分析',
    count: 5,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z"/></svg>'
  },
  {
    id: 'automation',
    name: '自動化',
    count: 5,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"/></svg>'
  }
])

// 工作流程數據 - 使用 shallowRef 並凍結對象提升效能
const workflows = shallowRef(markRaw([
  {
    id: 1,
    title: 'SEO 關鍵字分析器',
    category: 'seo',
    categoryName: 'SEO優化',
    description: '智能分析網站關鍵字排名，提供詳細的SEO優化建議和競爭對手分析報告。',
    usage: 2534,
    rating: 4.8,
    users: '1.2k',
    tags: ['SEO', 'AI', '分析'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3z"/></svg>'
  },
  {
    id: 2,
    title: '內容智能生成器',
    category: 'content',
    categoryName: '內容創作',
    description: '基於AI的內容生成工具，自動創建高質量的文章、社交媒體貼文和營銷文案。',
    usage: 1890,
    rating: 4.6,
    users: '890',
    tags: ['AI', '自動化', '內容'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/></svg>'
  },
  {
    id: 3,
    title: '數據可視化分析',
    category: 'analysis',
    categoryName: '數據分析',
    description: '將複雜數據轉換為直觀圖表，自動生成商業洞察報告和趨勢分析。',
    usage: 3421,
    rating: 4.9,
    users: '2.1k',
    tags: ['數據', '分析', '報告'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z"/></svg>'
  },
  {
    id: 4,
    title: '社交媒體排程器',
    category: 'automation',
    categoryName: '自動化',
    description: '智能社交媒體內容排程，最佳時間發布建議，多平台同步管理。',
    usage: 1256,
    rating: 4.7,
    users: '634',
    tags: ['社交', '自動化', '營銷'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>'
  },
  {
    id: 5,
    title: '競爭對手分析',
    category: 'seo',
    categoryName: 'SEO優化',
    description: '深度分析競爭對手的SEO策略，監控關鍵字排名變化，提供超越策略。',
    usage: 987,
    rating: 4.5,
    users: '445',
    tags: ['SEO', '競爭分析', '監控'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/></svg>'
  },
  {
    id: 6,
    title: '電子郵件營銷自動化',
    category: 'automation',
    categoryName: '自動化',
    description: '智能電子郵件序列設計，個性化內容推送，提升開信率和轉換率。',
    usage: 1567,
    rating: 4.4,
    users: '723',
    tags: ['郵件', '自動化', '營銷'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>'
  },
  {
    id: 7,
    title: '網站性能檢測',
    category: 'seo',
    categoryName: 'SEO優化',
    description: '全面檢測網站載入速度、Core Web Vitals 和 SEO 技術指標。',
    usage: 2156,
    rating: 4.7,
    users: '956',
    tags: ['SEO', '性能', '檢測'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1M12,7C9.24,7 7,9.24 7,12S9.24,17 12,17S17,14.76 17,12S14.76,7 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>'
  },
  {
    id: 8,
    title: '文案優化助手',
    category: 'content',
    categoryName: '內容創作',
    description: '利用 AI 技術優化營銷文案，提升點擊率和轉換率。',
    usage: 1234,
    rating: 4.3,
    users: '567',
    tags: ['文案', '優化', 'AI'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>'
  }
]))

// 💡 優化：限制執行歷史渲染數量，提升性能
const HISTORY_DISPLAY_LIMIT = 50

// 從 store 獲取執行歷史
const executionHistory = computed(() => workflowStore.executionHistory)

// 限制顯示的執行歷史數量
const limitedExecutionHistory = computed(() => 
  executionHistory.value.slice(0, HISTORY_DISPLAY_LIMIT)
)

// 計算過濾後的工作流程 - 優化過濾邏輯
const filteredWorkflows = computed(() => {
  const category = selectedCategory.value
  if (category === 'all') {
    return workflows.value
  }
  return workflows.value.filter(workflow => workflow.category === category)
})

// 優化方法 - 使用型別安全
const selectCategory = (categoryId: WorkflowCategory): void => {
  selectedCategory.value = categoryId
}

const viewWorkflow = (workflow: any): void => {
  console.log('查看工作流程:', workflow.title)
}

const previewWorkflow = (workflow: any): void => {
  console.log('預覽工作流程:', workflow.title)
}

const useWorkflow = (workflow: any): void => {
  console.log('使用工作流程:', workflow.title)
  
  // 如果是 SEO 關鍵字分析器，顯示表單
  if (workflow.id === 1) {
    showSeoAnalyzer.value = true
    return
  }
  
  // 其他工作流程的模擬執行 - 使用 store
  const executionId = workflowStore.addExecution({
    workflowName: workflow.title,
    category: workflow.category as WorkflowCategory,
    status: 'running',
    startTime: new Date()
  })
  
  // 模擬執行完成
  setTimeout(() => {
    const success = Math.random() > 0.2
    workflowStore.updateExecution(executionId, {
      status: success ? 'completed' : 'failed',
      endTime: new Date(),
      errorMessage: success ? undefined : '模擬執行失敗'
    })
  }, 3000)
}

const refreshHistory = (): void => {
  console.log('刷新歷史記錄')
}

const viewHistoryDetail = (record: any): void => {
  console.log('查看歷史詳情:', record)
}

// 格式化時間顯示
const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '剛剛'
  if (minutes < 60) return `${minutes}分鐘前`
  if (hours < 24) return `${hours}小時前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 獲取狀態文字
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'completed': '成功',
    'failed': '失敗',
    'running': '進行中',
    'pending': '等待中'
  }
  return statusMap[status] || status
}

// SEO 分析完成處理 - 在 SeoAnalyzerForm 中已處理
const handleSeoAnalysisComplete = (result: any): void => {
  console.log('SEO 分析啟動:', result)
  // 表單組件已經處理了執行記錄的添加和管理
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: calc(100vh - 70px);
  background: var(--primary-bg);
}

/* 左側歷史記錄側邊欄 */
.dashboard-sidebar {
  width: 320px;
  background: var(--secondary-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.refresh-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-muted);
}

.refresh-btn:hover {
  background: var(--accent-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: var(--spacing-xs);
  border: 1px solid transparent;
}

.history-item:hover {
  background: var(--accent-bg);
  border-color: var(--border-color);
}

.history-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.history-icon svg {
  width: 18px;
  height: 18px;
}

.history-item.completed .history-icon,
.history-item.success .history-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.history-item.failed .history-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.history-item.running .history-icon {
  background: rgba(249, 115, 22, 0.1);
  color: #ea580c;
}

.history-item.pending .history-icon {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.history-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-xs);
  display: inline-block;
}

.history-status.completed,
.history-status.success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.history-status.failed {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.history-status.running {
  background: rgba(249, 115, 22, 0.1);
  color: #ea580c;
}

.history-status.pending {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.history-content {
  flex: 1;
  min-width: 0;
}

.history-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.125rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.125rem;
}

.history-duration {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* 主要內容區域 */
.dashboard-main {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

.dashboard-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 分類標籤 */
.category-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  overflow-x: auto;
  padding-bottom: var(--spacing-xs);
}

.category-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  color: var(--text-primary);
}


.category-tab.active {
  background: var(--gradient-primary);
  border-color: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-primary);
}

.tab-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon svg {
  width: 16px;
  height: 16px;
}

.tab-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-xs);
  font-size: 0.75rem;
  font-weight: 600;
}

.category-tab:not(.active) .tab-count {
  background: var(--accent-bg);
  color: var(--text-muted);
}

/* 工作流程網格 */
.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

/* 空狀態 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-lg) auto;
  color: var(--text-muted);
  opacity: 0.5;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-description {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .dashboard {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
    height: auto;
    position: static;
    max-height: 300px;
  }
  
  .dashboard-main {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .dashboard-main {
    padding: var(--spacing-md);
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .category-tabs {
    gap: var(--spacing-xs);
  }
  
  .category-tab {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .workflows-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .sidebar-header {
    padding: var(--spacing-md);
  }
  
  .history-list {
    padding: var(--spacing-xs);
  }
}

@media (max-width: 640px) {
  .dashboard-sidebar {
    max-height: 250px;
  }
  
  .category-tab .tab-text {
    display: none;
  }
  
  .category-tab {
    padding: var(--spacing-xs);
    aspect-ratio: 1;
    justify-content: center;
  }
  
  .history-title {
    font-size: 0.8rem;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
}
</style>