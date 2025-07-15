<template>
  <div id="app">
    <!-- 全域載入狀態 -->
    <div v-if="!isLoaded" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>正在載入應用程式...</p>
      </div>
    </div>
    
    <!-- 主要內容 -->
    <div v-else>
      <!-- 導航欄（僅在已登入時顯示） -->
      <AppNavbar v-if="isSignedIn" />
      
      <!-- 路由視圖 -->
      <router-view />
      
      <!-- 全域通知 -->
      <AppNotifications />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@clerk/vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppNotifications from '@/components/AppNotifications.vue'

// Clerk 認證狀態
const { isSignedIn, isLoaded } = useAuth()

// 應用程式載入時的初始化
onMounted(() => {
  console.log('LeadIO App 已載入')
  console.log('Clerk 載入狀態:', isLoaded.value)
  console.log('用戶登入狀態:', isSignedIn.value)
})
</script>

<style>
/* 全域樣式 - 深色科技感主題 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 深色主題配色 - 參考 Leadion AI */
  --primary-bg: #0f1419; /* 深藍黑色背景 */
  --secondary-bg: #1a1f2e; /* 稍淺的深藍色 */
  --accent-bg: #242b3d; /* 卡片背景 */
  --primary-color: #00d4ff; /* 亮藍色強調 */
  --secondary-color: #4fc3f7; /* 次要藍色 */
  --success-color: #00e676; /* 成功綠色 */
  --warning-color: #ffab40; /* 警告橙色 */
  --error-color: #ff5252; /* 錯誤紅色 */
  --text-primary: #ffffff; /* 主要文字 */
  --text-secondary: #b3c5ef; /* 次要文字 */
  --text-muted: #8892b0; /* 柔和文字 */
  --border-color: #2d3748; /* 邊框顏色 */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #00d4ff 100%);
  --gradient-card: linear-gradient(145deg, #1a1f2e 0%, #242b3d 100%);
  --shadow-primary: 0 20px 40px rgba(0, 212, 255, 0.1);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans', Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--primary-bg);
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.6;
}

body {
  background: var(--primary-bg);
  overflow-x: hidden;
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: var(--primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
}

/* 全域按鈕樣式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 212, 255, 0.2);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: var(--primary-bg);
  transform: translateY(-2px);
}

/* 響應式設計 */
@media (max-width: 768px) {
  #app {
    font-size: 14px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

/* 滾動條樣式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--secondary-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

/* 選擇文字樣式 */
::selection {
  background: var(--primary-color);
  color: var(--primary-bg);
}

/* 動畫效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 玻璃效果 */
.glass-effect {
  background: rgba(26, 31, 46, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style> 