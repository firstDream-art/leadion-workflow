<template>
  <div class="home">
    <!-- 英雄區域 -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="tech-circle"></div>
        <div class="floating-elements">
          <div class="element element-1"></div>
          <div class="element element-2"></div>
          <div class="element element-3"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-title-wrapper">
          <h1 class="hero-title">
            <span class="title-chinese">有感決策</span>
            <span class="title-english">Accelerate insight</span>
            <span class="title-brand">With LeadIO AI</span>
          </h1>
          <div class="hero-subtitle">
            <p>為成長型企業提供全面的 AI 自動化</p>
            <p>和數據驅動的行銷解決方案</p>
            <p>透過智能科技的產品與服務</p>
            <p>將帶來效率、洞察力和成長</p>
          </div>
        </div>
        
        <div class="hero-actions">
          <button class="btn btn-primary hero-btn" @click="getStarted">
            立即預約AI顧問諮詢
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 功能特色區域 -->
    <div class="features-section">
      <div class="features-container">
        <div class="section-header">
          <h2 class="section-title">核心功能</h2>
          <p class="section-subtitle">運用 AI 技術驅動的專業 SEO 分析平台</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg"></div>
              <span class="feature-icon-text">SEO</span>
            </div>
            <h3 class="feature-title">智能 SEO 分析</h3>
            <p class="feature-description">
              深度分析網站的 SEO 表現，運用 AI 算法提供精準的優化建議和策略指導
            </p>
            <div class="feature-metrics">
              <span class="metric">準確率 95%+</span>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg"></div>
              <span class="feature-icon-text">DATA</span>
            </div>
            <h3 class="feature-title">數據洞察報告</h3>
            <p class="feature-description">
              生成專業的可視化分析報告，幫助您制定數據驅動的優化策略
            </p>
            <div class="feature-metrics">
              <span class="metric">即時生成</span>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg"></div>
              <span class="feature-icon-text">AI</span>
            </div>
            <h3 class="feature-title">AI 智能建議</h3>
            <p class="feature-description">
              運用先進的機器學習技術，提供個性化的智能優化建議
            </p>
            <div class="feature-metrics">
              <span class="metric">24/7 監控</span>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg"></div>
              <span class="feature-icon-text">FAST</span>
            </div>
            <h3 class="feature-title">快速響應</h3>
            <p class="feature-description">
              一鍵啟動分析流程，快速獲得結果，大幅節省您的寶貴時間
            </p>
            <div class="feature-metrics">
              <span class="metric">< 30秒</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 統計數據區域 -->
    <div class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">10,000+</div>
          <div class="stat-label">網站分析</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">95%</div>
          <div class="stat-label">準確率</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">24/7</div>
          <div class="stat-label">AI 監控</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">< 30s</div>
          <div class="stat-label">響應時間</div>
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
  background: var(--primary-bg);
  overflow-x: hidden;
}

/* 英雄區域 */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(ellipse at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.tech-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  opacity: 0.3;
  animation: rotate 20s linear infinite, pulse 4s ease-in-out infinite;
}

.tech-circle::before,
.tech-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid var(--secondary-color);
  border-radius: 50%;
  opacity: 0.5;
}

.tech-circle::before {
  width: 120%;
  height: 120%;
  animation: rotate 30s linear infinite reverse;
}

.tech-circle::after {
  width: 80%;
  height: 80%;
  animation: rotate 15s linear infinite;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.element {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 50%;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.element-3 {
  bottom: 30%;
  left: 25%;
  animation-delay: 4s;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
}

.hero-title-wrapper {
  margin-bottom: 3rem;
}

.hero-title {
  line-height: 1.2;
  margin-bottom: 2rem;
}

.title-chinese {
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.title-english {
  display: block;
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.title-brand {
  display: block;
  font-size: 2.8rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 3rem;
}

.hero-subtitle p {
  margin-bottom: 0.3rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.hero-btn {
  padding: 16px 32px;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.hero-btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* 功能特色區域 */
.features-section {
  padding: 6rem 2rem;
  background: var(--secondary-bg);
  position: relative;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--gradient-card);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: translateX(0);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-card);
  border-color: var(--primary-color);
}

.feature-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
}

.feature-icon-wrapper:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(0, 212, 255, 0.4);
}

.feature-icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.feature-icon-text {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  z-index: 1;
  letter-spacing: 1px;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-metrics {
  display: flex;
  justify-content: center;
}

.metric {
  background: rgba(0, 212, 255, 0.1);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

/* 統計數據區域 */
.stats-section {
  padding: 4rem 2rem;
  background: var(--primary-bg);
}

.stats-container {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 2rem 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

/* 動畫 */
@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
  50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .title-chinese {
    font-size: 2.5rem;
  }
  
  .title-english {
    font-size: 1.8rem;
  }
  
  .title-brand {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .tech-circle {
    width: 400px;
    height: 400px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1rem;
  }
  
  .title-chinese {
    font-size: 2rem;
  }
  
  .title-english {
    font-size: 1.4rem;
  }
  
  .title-brand {
    font-size: 1.6rem;
  }
  
  .hero-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
</style> 