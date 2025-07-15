<template>
  <div class="reports">
    <div class="reports-header">
      <h1>分析報告</h1>
      <p>查看您的 SEO 分析報告</p>
    </div>

    <div class="reports-container">
      <div class="reports-toolbar">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜尋報告..."
            class="search-input"
          />
        </div>
        <button class="refresh-btn" @click="refreshReports">
          重新整理
        </button>
      </div>

      <div class="reports-grid" v-if="filteredReports.length > 0">
        <div 
          v-for="report in filteredReports" 
          :key="report.id"
          class="report-card"
          @click="viewReport(report)"
        >
          <div class="report-header">
            <h3>{{ report.title }}</h3>
            <span class="report-status" :class="report.status">
              {{ getStatusText(report.status) }}
            </span>
          </div>
          <div class="report-info">
            <p class="report-url">{{ report.url }}</p>
            <p class="report-date">{{ formatDate(report.createdAt) }}</p>
          </div>
          <div class="report-score">
            <span class="score">{{ report.score }}/100</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-content">
          <h3>暫無報告</h3>
          <p>您還沒有任何分析報告。開始您的第一次分析吧！</p>
          <button class="start-analysis-btn" @click="goToAnalysis">
            開始分析
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
const searchQuery = ref('')

// 模擬報告數據
const reports = ref([
  {
    id: 1,
    title: 'Example.com SEO 分析',
    url: 'https://example.com',
    status: 'completed',
    score: 85,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    title: 'My-website.com 分析',
    url: 'https://my-website.com',
    status: 'completed',
    score: 72,
    createdAt: new Date('2024-01-10')
  },
  {
    id: 3,
    title: 'Test-site.com 分析',
    url: 'https://test-site.com',
    status: 'processing',
    score: 0,
    createdAt: new Date('2024-01-12')
  }
])

const filteredReports = computed(() => {
  if (!searchQuery.value) return reports.value
  return reports.value.filter(report => 
    report.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    report.url.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const refreshReports = () => {
  alert('重新整理報告功能開發中！')
}

const viewReport = (report: any) => {
  alert(`查看報告: ${report.title}\n功能開發中，稍後會顯示詳細報告內容`)
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

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.reports {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.reports-header {
  text-align: center;
  margin-bottom: 3rem;
}

.reports-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.reports-header p {
  color: #7f8c8d;
  font-size: 1.2rem;
}

.reports-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.reports-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-bar {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.refresh-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover {
  background: #2980b9;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.report-header h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin: 0;
  flex: 1;
}

.report-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.report-status.completed {
  background: #d4edda;
  color: #155724;
}

.report-status.processing {
  background: #fff3cd;
  color: #856404;
}

.report-status.failed {
  background: #f8d7da;
  color: #721c24;
}

.report-info {
  margin-bottom: 1rem;
}

.report-url {
  color: #3498db;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.report-date {
  color: #7f8c8d;
  font-size: 0.8rem;
  margin: 0;
}

.report-score {
  text-align: right;
}

.score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #27ae60;
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
  .reports {
    padding: 1rem;
  }
  
  .reports-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    max-width: none;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
}
</style> 