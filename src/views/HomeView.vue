<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          歡迎使用 LeadIO
        </h1>
        <p class="hero-subtitle">
          專業的 SEO 分析平台，使用 AI 技術提供深度數據洞察
        </p>
        <div class="hero-actions">
          <button class="btn primary" @click="getStarted">
            立即開始
          </button>
          <button class="btn secondary" @click="learnMore">
            了解更多
          </button>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="features-container">
        <h2>核心功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🔍 SEO 分析</h3>
            <p>深度分析網站的 SEO 表現，提供詳細的優化建議</p>
          </div>
          <div class="feature-card">
            <h3>📊 數據報告</h3>
            <p>生成專業的分析報告，幫助您制定優化策略</p>
          </div>
          <div class="feature-card">
            <h3>🤖 AI 洞察</h3>
            <p>運用 AI 技術，提供智能化的優化建議</p>
          </div>
          <div class="feature-card">
            <h3>⚡ 快速分析</h3>
            <p>一鍵分析，快速獲得結果，節省您的寶貴時間</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const getStarted = () => {
  router.push('/sign-in')
}

const learnMore = () => {
  alert('了解更多功能開發中！')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn.primary {
  background: #fff;
  color: #667eea;
}

.btn.primary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
}

.btn.secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.features-section {
  padding: 6rem 2rem;
  background: #f8f9fa;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.features-container h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .features-container h2 {
    font-size: 2rem;
  }
}
</style> 