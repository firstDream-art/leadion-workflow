<template>
  <div class="rive-demo-container">
    <div class="demo-header">
      <h1>🎯 Rive 2D 角色互動 Demo</h1>
      <p class="demo-description">
        移動滑鼠或觸控螢幕，看角色的眼睛和頭部如何跟隨您的移動！
      </p>
    </div>

    <div class="demo-content">
      <!-- Rive 動畫容器 -->
      <div class="rive-container">
        <canvas 
          ref="riveCanvas" 
          class="rive-canvas"
          @pointermove="handlePointerMove"
        ></canvas>
        
        <!-- 載入指示器 -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>正在載入角色動畫...</p>
        </div>

        <!-- 錯誤顯示 -->
        <div v-if="error" class="error-overlay">
          <div class="error-icon">⚠️</div>
          <p>{{ error }}</p>
          <button @click="initializeRive" class="retry-btn">重試</button>
        </div>

        <!-- 如果沒有.riv檔案的提示 -->
        <div v-if="showFileGuide" class="file-guide-overlay">
          <div class="guide-content">
            <h3>🎨 如何建立Rive檔案</h3>
            <ol>
              <li>前往 <a href="https://rive.app" target="_blank">Rive.app</a> 建立帳號</li>
              <li>建立新專案，設計您的2D角色</li>
              <li>新增 State Machine 和兩個 Number 輸入：<code>xAxis</code> 和 <code>yAxis</code></li>
              <li>設定眼睛/頭部的約束或混合，讓它們響應這些輸入</li>
              <li>匯出為 <code>.riv</code> 檔案並放在 <code>public/rive/character.riv</code></li>
            </ol>
            <button @click="showFileGuide = false" class="close-guide-btn">我知道了</button>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <h3>🎛️ 控制設定</h3>
        
        <div class="control-group">
          <label>平滑度</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            v-model="smoothness"
            class="slider"
          >
          <span class="value">{{ smoothness }}</span>
        </div>

        <div class="control-group">
          <label>敏感度</label>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            v-model="sensitivity"
            class="slider"
          >
          <span class="value">{{ sensitivity }}</span>
        </div>

        <div class="control-group">
          <label>
            <input type="checkbox" v-model="invertY">
            反轉Y軸
          </label>
        </div>

        <div class="status">
          <p><strong>目前座標：</strong></p>
          <p>X: {{ currentX.toFixed(1) }}%</p>
          <p>Y: {{ currentY.toFixed(1) }}%</p>
          <p><strong>平滑座標：</strong></p>
          <p>X: {{ smoothX.toFixed(1) }}%</p>
          <p>Y: {{ smoothY.toFixed(1) }}%</p>
        </div>
      </div>
    </div>

    <!-- 技術說明 -->
    <div class="tech-details">
      <h3>🔧 技術實作細節</h3>
      <div class="details-grid">
        <div class="detail-card">
          <h4>Rive 設定</h4>
          <ul>
            <li>State Machine 名稱：<code>Main</code></li>
            <li>X軸輸入：<code>xAxis</code> (0-100)</li>
            <li>Y軸輸入：<code>yAxis</code> (0-100)</li>
            <li>動畫類型：約束或1D Blend</li>
          </ul>
        </div>
        
        <div class="detail-card">
          <h4>Vue 3 整合</h4>
          <ul>
            <li>套件：<code>@rive-app/canvas</code></li>
            <li>事件：<code>pointermove</code></li>
            <li>響應式：<code>ref</code> 和 <code>computed</code></li>
            <li>生命週期：<code>onMounted</code></li>
          </ul>
        </div>
        
        <div class="detail-card">
          <h4>平滑算法</h4>
          <ul>
            <li>線性插值 (LERP)</li>
            <li>可調整平滑度</li>
            <li>RAF 動畫循環</li>
            <li>效能優化</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { Rive, StateMachineInput } from '@rive-app/canvas'

// 響應式狀態
const riveCanvas = ref<HTMLCanvasElement | null>(null)
const isLoading = ref(true)
const error = ref('')
const showFileGuide = ref(false)

// 動畫控制
let riveInstance: Rive | null = null
let xInput: StateMachineInput | null = null
let yInput: StateMachineInput | null = null
let animationFrame: number | null = null

// 座標狀態
const currentX = ref(50)
const currentY = ref(50)
const smoothX = ref(50)
const smoothY = ref(50)

// 控制參數
const smoothness = ref(0.8)
const sensitivity = ref(1.0)
const invertY = ref(false)

// 目標座標（用於平滑）
const targetX = ref(50)
const targetY = ref(50)

// 初始化 Rive
const initializeRive = async () => {
  if (!riveCanvas.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    // 清理現有實例
    if (riveInstance) {
      riveInstance.cleanup()
    }

    riveInstance = new Rive({
      src: '/rive/character.riv',
      canvas: riveCanvas.value,
      stateMachines: ['Main'],
      autoplay: true,
      onLoad: () => {
        console.log('Rive 載入成功')
        isLoading.value = false
        
        // 調整畫布大小
        riveInstance?.resizeDrawingSurfaceToCanvas()
        
        // 獲取狀態機輸入
        const inputs = riveInstance?.stateMachineInputs('Main')
        if (inputs) {
          xInput = inputs.find(i => i.name === 'xAxis') || null
          yInput = inputs.find(i => i.name === 'yAxis') || null
          
          if (!xInput || !yInput) {
            error.value = '找不到 xAxis 或 yAxis 輸入，請檢查 Rive 檔案設定'
            return
          }
          
          console.log('找到輸入:', { xInput: xInput.name, yInput: yInput.name })
          
          // 開始動畫循環
          startAnimationLoop()
        }
      },
      onLoadError: () => {
        console.log('Rive 檔案載入失敗')
        isLoading.value = false
        showFileGuide.value = true
      }
    })
  } catch (err) {
    console.error('Rive 初始化錯誤:', err)
    error.value = `初始化失敗: ${err}`
    isLoading.value = false
  }
}

// 處理指針移動
const handlePointerMove = (event: PointerEvent) => {
  if (!riveCanvas.value) return
  
  const rect = riveCanvas.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100 * sensitivity.value
  const y = ((event.clientY - rect.top) / rect.height) * 100 * sensitivity.value
  
  // 限制範圍
  targetX.value = Math.max(0, Math.min(100, x))
  targetY.value = Math.max(0, Math.min(100, invertY.value ? 100 - y : y))
  
  currentX.value = targetX.value
  currentY.value = targetY.value
}

// 動畫循環（平滑效果）
const startAnimationLoop = () => {
  const animate = () => {
    // 線性插值平滑
    const lerpFactor = 1 - smoothness.value
    smoothX.value += (targetX.value - smoothX.value) * lerpFactor
    smoothY.value += (targetY.value - smoothY.value) * lerpFactor
    
    // 更新 Rive 輸入
    if (xInput && yInput) {
      xInput.value = smoothX.value
      yInput.value = smoothY.value
    }
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}

// 監聽控制參數變化
watch([smoothness, sensitivity, invertY], () => {
  console.log('控制參數更新:', { smoothness: smoothness.value, sensitivity: sensitivity.value, invertY: invertY.value })
})

// 生命週期
onMounted(() => {
  initializeRive()
})

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  if (riveInstance) {
    riveInstance.cleanup()
  }
})
</script>

<style scoped>
.rive-demo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.demo-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.demo-description {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .demo-content {
    grid-template-columns: 1fr;
  }
}

.rive-container {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  min-height: 400px;
}

.rive-canvas {
  width: 100%;
  height: 400px;
  display: block;
  cursor: none;
}

.loading-overlay,
.error-overlay,
.file-guide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-overlay .error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn,
.close-guide-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover,
.close-guide-btn:hover {
  background: #5a67d8;
}

.file-guide-overlay {
  padding: 2rem;
}

.guide-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  max-width: 500px;
}

.guide-content h3 {
  margin-bottom: 1rem;
  color: #333;
}

.guide-content ol {
  text-align: left;
  margin-bottom: 1.5rem;
}

.guide-content li {
  margin-bottom: 0.5rem;
}

.guide-content code {
  background: #f7fafc;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.guide-content a {
  color: #667eea;
  text-decoration: none;
}

.guide-content a:hover {
  text-decoration: underline;
}

.control-panel {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  height: fit-content;
}

.control-panel h3 {
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.control-group {
  margin-bottom: 1.5rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.slider {
  width: 100%;
  margin-bottom: 0.5rem;
}

.value {
  display: inline-block;
  background: #f7fafc;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
}

.control-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.status {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.status p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.tech-details {
  margin-top: 3rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.tech-details h3 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.detail-card h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.detail-card ul {
  list-style: none;
  padding: 0;
}

.detail-card li {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.detail-card li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #667eea;
}

.detail-card code {
  background: #f7fafc;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}
</style> 