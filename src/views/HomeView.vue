<template>
  <div class="home" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave" ref="homeContainer">
    <!-- 滑鼠跟隨光芒粒子效果 -->
    <div class="light-particles">
      <div 
        v-for="(particle, index) in particles" 
        :key="index"
        class="light-particle"
        :class="{ 'gathering': isGathering }"
        :style="getParticleStyle(particle, index)"
      ></div>
    </div>
    
    <!-- LiblibAI 風格英雄區域 -->
    <div class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-text">🚀 AI 驅動的智能平台</span>
          </div>
          
          <h1 class="hero-title">
            探索 AI 工作流程
            <span class="title-highlight">加速您的創意過程</span>
          </h1>
          
          <p class="hero-description">
            發現、使用和分享 AI 驅動的工作流程，從內容創作到數據分析，
            讓人工智能為您的創意和業務流程注入新的活力。
          </p>
          
          <div class="hero-actions">
            <button class="btn-primary hero-btn" @click="getStarted">
              開始探索
            </button>
            <button class="btn-secondary hero-btn" @click="learnMore">
              了解更多
            </button>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">10,000+</span>
              <span class="stat-label">工作流程</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">50,000+</span>
              <span class="stat-label">活躍用戶</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">95%</span>
              <span class="stat-label">滿意度</span>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="visual-grid">
            <div class="grid-item item-1">
              <div class="item-icon">🤖</div>
              <span>AI 分析</span>
            </div>
            <div class="grid-item item-2">
              <div class="item-icon">📊</div>
              <span>數據洞察</span>
            </div>
            <div class="grid-item item-3">
              <div class="item-icon">⚡</div>
              <span>自動化</span>
            </div>
            <div class="grid-item item-4">
              <div class="item-icon">🎯</div>
              <span>精準優化</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 工作流程展示區域 -->
    <div class="workflows-section">
      <div class="workflows-container">
        <div class="section-header">
          <h2 class="section-title">熱門工作流程</h2>
          <p class="section-subtitle">探索最受歡迎的 AI 工作流程，提升您的工作效率</p>
        </div>
        
        <div class="workflows-grid">
          <WorkflowCard
            v-for="workflow in workflows"
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
        
        <div class="section-actions">
          <button class="btn-outline" @click="viewAllWorkflows">
            查看所有工作流程
          </button>
        </div>
      </div>
    </div>

    <!-- 分類區域 -->
    <div class="categories-section">
      <div class="categories-container">
        <div class="section-header">
          <h2 class="section-title">工作流程分類</h2>
          <p class="section-subtitle">按類別瀏覽，快速找到您需要的工作流程</p>
        </div>
        
        <div class="categories-grid">
          <div 
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            @click="viewCategory(category)"
          >
            <div class="category-icon" v-html="category.icon"></div>
            <h3 class="category-title">{{ category.name }}</h3>
            <p class="category-description">{{ category.description }}</p>
            <span class="category-count">{{ category.count }} 個工作流程</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { throttle } from 'lodash-es'
import WorkflowCard from '@/components/WorkflowCard.vue'

const router = useRouter()
const homeContainer = ref<HTMLElement>()

// 滑鼠位置跟蹤
const mouseX = ref(0)
const mouseY = ref(0)
const isGathering = ref(false)
let gatheringTimer: number | null = null

// 光芒粒子定義
interface Particle {
  id: number
  baseX: number
  baseY: number
  size: number
  delay: number
  speed: number
  color: string
  orbitRadius: number
  isCenter: boolean
  trailOffset: number
}

// 創建光芒粒子
const particles = ref<Particle[]>([])

// 初始化粒子
const initParticles = () => {
  const colors = [
    'rgba(0, 212, 255, 0.9)',
    'rgba(102, 126, 234, 0.8)',
    'rgba(168, 85, 247, 0.7)',
    'rgba(34, 139, 230, 0.8)',
    'rgba(79, 172, 254, 0.7)'
  ]
  
  particles.value = Array.from({ length: 12 }, (_, i) => {
    // 按大小排序：最大的在前，漸漸變小
    const size = 10 - (i * 0.6) // 從10px漸減到3.4px
    const orbitRadius = i === 0 ? 0 : 20 + (i * 12) // 第一個在中心，其他軌道半徑遞增
    
    // 為移動軌跡創建更優美的初始偏移
    const angle = (i * 137.5) % 360 // 黃金角度分布
    const distance = Math.sqrt(i) * 15 // 螺旋式分布
    
    return {
      id: i,
      baseX: i === 0 ? 0 : Math.cos(angle * Math.PI / 180) * distance,
      baseY: i === 0 ? 0 : Math.sin(angle * Math.PI / 180) * distance,
      size: Math.max(size, 3), // 最小3px
      delay: i * 30, // 按順序延遲，最大的先動
      speed: 1 - (i * 0.07), // 最大的速度最快，遞減更明顯
      color: colors[Math.floor(i / 2.5) % colors.length], // 按組分配顏色
      orbitRadius: orbitRadius,
      isCenter: i === 0, // 標記中心粒子
      trailOffset: i * 0.5 // 軌跡偏移因子
    }
  }).sort((a, b) => b.size - a.size) // 按大小降序排列
}

// 當前滑鼠位置記錄（用於跟隨效果）
const currentMouseX = ref(0)
const currentMouseY = ref(0)
const targetMouseX = ref(0)
const targetMouseY = ref(0)

// 動畫幀計數器（用於旋轉效果）
let animationFrame: number | null = null
const rotationTime = ref(0)

// 開始旋轉動畫
const startRotationAnimation = () => {
  if (animationFrame) return
  
  const animate = () => {
    rotationTime.value += 16 // 約60fps
    if (isGathering.value) {
      animationFrame = requestAnimationFrame(animate)
    } else {
      animationFrame = null
    }
  }
  animationFrame = requestAnimationFrame(animate)
}

// 獲取粒子樣式
const getParticleStyle = (particle: Particle, index: number) => {
  let targetX, targetY
  
  if (isGathering.value) {
    if (particle.isCenter) {
      // 中心粒子保持在滑鼠位置
      targetX = mouseX.value
      targetY = mouseY.value
    } else {
      // 其他粒子圍繞中心軌道旋轉，每個軌道速度略有不同
      const baseAngle = (index - 1) * (360 / 11) // 基礎角度分布
      const rotationSpeed = 0.8 + (index % 3) * 0.3 // 不同軌道不同速度
      const currentAngle = baseAngle + (rotationTime.value * rotationSpeed * 0.001)
      const angleRad = currentAngle * Math.PI / 180
      
      targetX = mouseX.value + Math.cos(angleRad) * particle.orbitRadius
      targetY = mouseY.value + Math.sin(angleRad) * particle.orbitRadius
    }
  } else {
    // 移動時的優美跟隨效果：流體動力學風格軌跡
    const speedFactor = particle.speed
    const lagFactor = (1 - speedFactor) * 0.8 // 延遲因子
    
    // 計算移動方向和速度
    const deltaX = mouseX.value - currentMouseX.value
    const deltaY = mouseY.value - currentMouseY.value
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // 流體動力學效果：根據移動速度調整粒子軌跡
    const fluidOffset = Math.min(velocity * 0.3, 30) * lagFactor
    const perpendicular = {
      x: -deltaY / (velocity + 0.1), // 避免除零
      y: deltaX / (velocity + 0.1)
    }
    
    // 波浪式偏移，讓每個粒子有獨特的軌跡
    const wavePhase = Date.now() * 0.002 + particle.id * 0.8
    const waveAmplitude = (12 - particle.size) * 0.8 // 小粒子波動更大
    const waveOffset = Math.sin(wavePhase) * waveAmplitude * lagFactor
    
    // 螺旋式拖尾效果
    const spiralOffset = particle.trailOffset * lagFactor * Math.cos(wavePhase * 0.5)
    
    targetX = mouseX.value + 
              particle.baseX * lagFactor + 
              perpendicular.x * fluidOffset + 
              perpendicular.x * waveOffset +
              perpendicular.y * spiralOffset
              
    targetY = mouseY.value + 
              particle.baseY * lagFactor + 
              perpendicular.y * fluidOffset + 
              perpendicular.y * waveOffset +
              perpendicular.x * spiralOffset
  }
  
  return {
    left: `${targetX}px`,
    top: `${targetY}px`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    backgroundColor: particle.color,
    transitionDuration: isGathering.value 
      ? `${0.8 + index * 0.05}s` // 聚集時平滑過渡
      : `${0.08 + (1 - particle.speed) * 0.12}s`, // 跟隨時流暢緩動
    transitionTimingFunction: isGathering.value ? 'cubic-bezier(0.4, 0, 0.2, 1)' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translate(-50%, -50%)',
    zIndex: Math.floor(particle.size) // 大粒子在上層
  }
}

// 💡 優化：緩存容器尺寸，減少 DOM 查詢
const cachedRect = ref<DOMRect | null>(null)

// 更新容器尺寸緩存
const updateContainerRect = () => {
  if (homeContainer.value) {
    cachedRect.value = homeContainer.value.getBoundingClientRect()
  }
}

// 🚀 優化：使用 throttle 限制滑鼠事件頻率
const handleMouseMove = throttle((event: MouseEvent) => {
  if (!cachedRect.value) return
  
  // 更新滑鼠位置記錄（用於軌跡計算）
  currentMouseX.value = mouseX.value
  currentMouseY.value = mouseY.value
  mouseX.value = event.clientX - cachedRect.value.left
  mouseY.value = event.clientY - cachedRect.value.top
  
  // 重置聚集狀態
  if (isGathering.value) {
    isGathering.value = false
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }
  
  if (gatheringTimer) {
    clearTimeout(gatheringTimer)
  }
  
  // 滑鼠停止移動後開始聚集
  gatheringTimer = setTimeout(() => {
    isGathering.value = true
    startRotationAnimation() // 開始旋轉動畫
  }, 300) // 300ms 後開始聚集
}, 16) // 限制為 60fps

// 處理滑鼠離開
const handleMouseLeave = () => {
  isGathering.value = false
  if (gatheringTimer) {
    clearTimeout(gatheringTimer)
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

// 💡 組件生命週期管理
onMounted(() => {
  initParticles()
  updateContainerRect()
  
  // 監聽視窗大小變化，更新容器尺寸
  window.addEventListener('resize', updateContainerRect)
})

// 🧹 重要：清理所有副作用，避免內存泄漏
onUnmounted(() => {
  // 清理計時器
  if (gatheringTimer) {
    clearTimeout(gatheringTimer)
    gatheringTimer = null
  }
  
  // 清理動畫幀
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  
  // 移除事件監聽器
  window.removeEventListener('resize', updateContainerRect)
  
  console.log('🧹 HomeView 資源清理完成')
})

// 工作流程數據
const workflows = ref([
  {
    id: 1,
    title: 'SEO 關鍵字分析器',
    category: 'SEO優化',
    description: '智能分析網站關鍵字排名，提供詳細的SEO優化建議和競爭對手分析報告。',
    usage: 2534,
    rating: 4.8,
    users: '1.2k',
    tags: ['SEO', 'AI', '分析'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/></svg>'
  },
  {
    id: 2,
    title: '內容智能生成器',
    category: '內容創作',
    description: '基於AI的內容生成工具，自動創建高質量的文章、社交媒體貼文和營銷文案。',
    usage: 1890,
    rating: 4.6,
    users: '890',
    tags: ['AI', '自動化', '內容'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>'
  },
  {
    id: 3,
    title: '數據可視化分析',
    category: '數據分析',
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
    category: '社交營銷',
    description: '智能社交媒體內容排程，最佳時間發布建議，多平台同步管理。',
    usage: 1256,
    rating: 4.7,
    users: '634',
    tags: ['社交', '自動化', '營銷'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20Z"/></svg>'
  },
  {
    id: 5,
    title: '客戶行為追蹤',
    category: '用戶分析',
    description: '深度分析用戶行為模式，提供個性化推薦和轉換優化策略。',
    usage: 987,
    rating: 4.5,
    users: '445',
    tags: ['追蹤', '分析', '優化'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/></svg>'
  },
  {
    id: 6,
    title: '電子郵件營銷自動化',
    category: '郵件營銷',
    description: '智能電子郵件序列設計，個性化內容推送，提升開信率和轉換率。',
    usage: 1567,
    rating: 4.4,
    users: '723',
    tags: ['郵件', '自動化', '營銷'],
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>'
  }
])

// 分類數據
const categories = ref([
  {
    id: 1,
    name: 'SEO優化',
    description: '提升網站搜索排名和流量',
    count: 156,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3z"/></svg>'
  },
  {
    id: 2,
    name: '內容創作',
    description: 'AI驅動的內容生成和編輯',
    count: 234,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"/></svg>'
  },
  {
    id: 3,
    name: '數據分析',
    description: '智能數據處理和洞察生成',
    count: 189,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z"/></svg>'
  },
  {
    id: 4,
    name: '營銷自動化',
    description: '自動化營銷流程和客戶管理',
    count: 127,
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>'
  }
])

const getStarted = () => {
  router.push('/sign-in')
}

const learnMore = () => {
  alert('了解更多功能開發中！')
}

const viewWorkflow = (workflow: any) => {
  console.log('查看工作流程:', workflow.title)
}

const previewWorkflow = (workflow: any) => {
  console.log('預覽工作流程:', workflow.title)
}

const useWorkflow = (workflow: any) => {
  console.log('使用工作流程:', workflow.title)
}

const viewAllWorkflows = () => {
  router.push('/analysis')
}

const viewCategory = (category: any) => {
  console.log('查看分類:', category.name)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--primary-bg);
  position: relative;
  overflow: hidden;
}

/* 光芒粒子容器 */
.light-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 單個光芒粒子 */
.light-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: all 0.1s ease-out;
  box-shadow: 
    0 0 6px currentColor,
    0 0 12px currentColor,
    0 0 18px currentColor;
  animation: sparkle 2s ease-in-out infinite alternate;
}

/* 聚集狀態的粒子 */
.light-particle.gathering {
  animation: sparkle 2s ease-in-out infinite alternate;
  box-shadow: 
    0 0 8px currentColor,
    0 0 16px currentColor,
    0 0 24px currentColor;
}

/* 粒子閃爍效果 */
@keyframes sparkle {
  0% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(0.9);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 不同大小粒子的發光強度 */
.light-particle {
  filter: brightness(1.2);
}

.light-particle:nth-child(1) {
  /* 最大粒子 - 最亮 */
  box-shadow: 
    0 0 10px currentColor,
    0 0 20px currentColor,
    0 0 30px currentColor;
  filter: brightness(1.5);
}

.light-particle:nth-child(2),
.light-particle:nth-child(3) {
  /* 第二、三大粒子 */
  box-shadow: 
    0 0 8px currentColor,
    0 0 16px currentColor,
    0 0 24px currentColor;
  filter: brightness(1.3);
}

/* 英雄區域 */
.hero-section {
  background: transparent;
  padding: 4rem 0 6rem 0;
  position: relative;
  z-index: 2;
}

/* 移除靜態背景元素，讓滑鼠光圈效果更明顯 */

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 3;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.hero-badge {
  display: inline-flex;
  align-self: flex-start;
}

.badge-text {
  background: rgba(34, 139, 230, 0.1);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(34, 139, 230, 0.2);
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  margin: 0;
}

.title-highlight {
  display: block;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
}

.hero-btn {
  padding: 0.875rem 1.75rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-primary);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--accent-bg);
  border-color: var(--primary-color);
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-top: var(--spacing-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* 視覺網格 */
.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  max-width: 300px;
}

.grid-item {
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: float 4s ease-in-out infinite;
}

.grid-item:nth-child(1) { animation-delay: 0s; }
.grid-item:nth-child(2) { animation-delay: 1s; }
.grid-item:nth-child(3) { animation-delay: 2s; }
.grid-item:nth-child(4) { animation-delay: 3s; }

.grid-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-hover);
  transform: translateY(-4px);
}

.item-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.grid-item span {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

/* 工作流程區域 */
.workflows-section {
  background: var(--secondary-bg);
  padding: 6rem 0;
}

.workflows-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: 3rem;
}

.section-actions {
  text-align: center;
}

.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: 0.875rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

/* 分類區域 */
.categories-section {
  background: var(--primary-bg);
  padding: 6rem 0;
}

.categories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.category-card {
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.category-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.category-icon {
  width: 64px;
  height: 64px;
  background: var(--accent-bg);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg) auto;
  color: var(--primary-color);
  border: 1px solid var(--border-color);
}

.category-icon svg {
  width: 32px;
  height: 32px;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.category-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 var(--spacing-md) 0;
  font-size: 0.9rem;
}

.category-count {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

/* 響應式設計 */
@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .workflows-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 3rem 0 4rem 0;
  }
  
  .hero-container,
  .workflows-container,
  .categories-container {
    padding: 0 var(--spacing-md);
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .hero-stats {
    justify-content: center;
    gap: var(--spacing-xl);
  }
  
  .visual-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }
  
  .workflows-section,
  .categories-section {
    padding: 4rem 0;
  }
  
  .section-title {
    font-size: 1.875rem;
  }
}

/* 動畫效果 */
@keyframes backgroundFloat {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-10px, -5px) scale(1.02);
  }
  100% {
    transform: translate(5px, -10px) scale(0.98);
  }
}

@keyframes patternMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(60px, 60px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}</style>
