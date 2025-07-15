<template>
  <div class="history">
    <div class="history-header">
      <h1>分析歷史</h1>
      <p>查看您的所有分析記錄</p>
    </div>

    <div class="history-container">
      <div class="history-filters">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">全部狀態</option>
          <option value="completed">已完成</option>
          <option value="processing">處理中</option>
          <option value="failed">失敗</option>
        </select>
        
        <select v-model="selectedPeriod" class="filter-select">
          <option value="">全部時間</option>
          <option value="today">今天</option>
          <option value="week">本週</option>
          <option value="month">本月</option>
        </select>
        
        <button class="clear-filters-btn" @click="clearFilters">
          清除篩選
        </button>
      </div>

      <div class="history-list" v-if="filteredHistory.length > 0">
        <div 
          v-for="item in filteredHistory" 
          :key="item.id"
          class="history-item"
        >
          <div class="item-info">
            <div class="item-main">
              <h4>{{ item.title }}</h4>
              <p class="item-url">{{ item.url }}</p>
            </div>
            <div class="item-meta">
              <span class="item-date">{{ formatDateTime(item.createdAt) }}</span>
              <span class="item-status" :class="item.status">
                {{ getStatusText(item.status) }}
              </span>
            </div>
          </div>
          
          <div class="item-actions">
            <button 
              v-if="item.status === 'completed'" 
              class="action-btn view-btn"
              @click="viewResult(item)"
            >
              查看結果
            </button>
            <button 
              v-if="item.status === 'processing'" 
              class="action-btn cancel-btn"
              @click="cancelAnalysis(item)"
            >
              取消
            </button>
            <button 
              v-if="item.status === 'failed'" 
              class="action-btn retry-btn"
              @click="retryAnalysis(item)"
            >
              重試
            </button>
            <button 
              class="action-btn delete-btn"
              @click="deleteItem(item)"
            >
              刪除
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-content">
          <h3>無歷史記錄</h3>
          <p>您還沒有任何分析歷史記錄</p>
          <button class="start-analysis-btn" @click="goToAnalysis">
            開始第一次分析
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedStatus = ref('')
const selectedPeriod = ref('')

// 模擬歷史數據
const history = ref([
  {
    id: 1,
    title: 'Example.com SEO 分析',
    url: 'https://example.com',
    status: 'completed',
    createdAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: 2,
    title: 'My-website.com 深度分析',
    url: 'https://my-website.com',
    status: 'completed',
    createdAt: new Date('2024-01-14T15:45:00')
  },
  {
    id: 3,
    title: 'Test-site.com 快速檢查',
    url: 'https://test-site.com',
    status: 'processing',
    createdAt: new Date('2024-01-14T09:20:00')
  },
  {
    id: 4,
    title: 'Demo-site.com 分析',
    url: 'https://demo-site.com',
    status: 'failed',
    createdAt: new Date('2024-01-13T14:10:00')
  },
  {
    id: 5,
    title: 'Portfolio.com 檢測',
    url: 'https://portfolio.com',
    status: 'completed',
    createdAt: new Date('2024-01-12T11:00:00')
  }
])

const filteredHistory = computed(() => {
  let filtered = history.value

  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }

  if (selectedPeriod.value) {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfDay.getTime() - (startOfDay.getDay() * 24 * 60 * 60 * 1000))
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    filtered = filtered.filter(item => {
      switch (selectedPeriod.value) {
        case 'today':
          return item.createdAt >= startOfDay
        case 'week':
          return item.createdAt >= startOfWeek
        case 'month':
          return item.createdAt >= startOfMonth
        default:
          return true
      }
    })
  }

  return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

const clearFilters = () => {
  selectedStatus.value = ''
  selectedPeriod.value = ''
}

const viewResult = (item: any) => {
  alert(`查看分析結果: ${item.title}\n功能開發中，稍後會顯示詳細結果`)
}

const cancelAnalysis = (item: any) => {
  if (confirm(`確定要取消 "${item.title}" 的分析嗎？`)) {
    item.status = 'failed'
    alert('分析已取消')
  }
}

const retryAnalysis = (item: any) => {
  if (confirm(`確定要重新分析 "${item.title}" 嗎？`)) {
    item.status = 'processing'
    alert('重新分析已開始')
  }
}

const deleteItem = (item: any) => {
  if (confirm(`確定要刪除 "${item.title}" 的記錄嗎？`)) {
    const index = history.value.findIndex(h => h.id === item.id)
    if (index > -1) {
      history.value.splice(index, 1)
    }
  }
}

const goToAnalysis = () => {
  router.push('/analysis')
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    completed: '已完成',
    processing: '處理中',
    failed: '失敗'
  }
  return statusMap[status] || status
}

const formatDateTime = (date: Date) => {
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.history {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.history-header {
  text-align: center;
  margin-bottom: 3rem;
}

.history-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.history-header p {
  color: #7f8c8d;
  font-size: 1.2rem;
}

.history-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.history-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #3498db;
}

.clear-filters-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-filters-btn:hover {
  background: #c0392b;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.history-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-info {
  flex: 1;
}

.item-main h4 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.item-url {
  color: #3498db;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.item-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item-date {
  color: #7f8c8d;
  font-size: 0.8rem;
}

.item-status {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

.item-status.completed {
  background: #d4edda;
  color: #155724;
}

.item-status.processing {
  background: #fff3cd;
  color: #856404;
}

.item-status.failed {
  background: #f8d7da;
  color: #721c24;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn {
  background: #3498db;
  color: white;
}

.view-btn:hover {
  background: #2980b9;
}

.cancel-btn, .retry-btn {
  background: #f39c12;
  color: white;
}

.cancel-btn:hover, .retry-btn:hover {
  background: #e67e22;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background: #c0392b;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-content h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.empty-content p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.start-analysis-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-analysis-btn:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .history {
    padding: 1rem;
  }
  
  .history-filters {
    flex-direction: column;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .item-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style> 