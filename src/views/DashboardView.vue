<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>儀表板</h1>
      <p>歡迎使用 LeadIO SEO 分析平台</p>
    </div>
    
    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>總分析次數</h3>
          <div class="stat-number">42</div>
        </div>
        <div class="stat-card">
          <h3>活躍關鍵字</h3>
          <div class="stat-number">156</div>
        </div>
        <div class="stat-card">
          <h3>報告生成</h3>
          <div class="stat-number">12</div>
        </div>
        <div class="stat-card">
          <h3>優化建議</h3>
          <div class="stat-number">28</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="action-btn primary" @click="startAnalysis">
          開始新分析
        </button>
        <button class="action-btn secondary" @click="viewReports">
          查看報告
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const startAnalysis = () => {
  alert('分析功能開發中！')
}

const viewReports = () => {
  alert('報告功能開發中！')
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 3rem;
  text-align: center;
}

.dashboard-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #7f8c8d;
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e5e7eb;
}

.stat-card h3 {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-number {
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.action-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #3498db;
  color: white;
}

.action-btn.primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.action-btn.secondary:hover {
  background: #d5dbdb;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style> 