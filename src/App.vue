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
import { useThemeStore } from '@/stores/theme'

// Clerk 認證狀態
const { isSignedIn, isLoaded } = useAuth()

// 主題狀態
const themeStore = useThemeStore()

// 應用程式載入時的初始化
onMounted(() => {
  console.log('LeadIO App 已載入')
  console.log('Clerk 載入狀態:', isLoaded.value)
  console.log('用戶登入狀態:', isSignedIn.value)
  
  // 初始化主題系統
  themeStore.initTheme()
  themeStore.watchSystemTheme()
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
  /* LiblibAI 風格配色 - 現代化設計系統 */
  --primary-bg: #fafbfc; /* 極淺灰背景 */
  --secondary-bg: #ffffff; /* 純白背景 */
  --accent-bg: #f8f9fa; /* 輕微灰色背景 */
  --primary-color: #228be6; /* 主藍色 */
  --secondary-color: #339af0; /* 次要藍色 */
  --success-color: #51cf66; /* 成功綠色 */
  --warning-color: #ffd43b; /* 警告黃色 */
  --error-color: #ff6b6b; /* 錯誤紅色 */
  --text-primary: #212529; /* 主要文字 */
  --text-secondary: #495057; /* 次要文字 */
  --text-muted: #6c757d; /* 柔和文字 */
  --border-color: #e9ecef; /* 邊框顏色 */
  --gradient-primary: linear-gradient(135deg, #228be6 0%, #339af0 100%);
  --gradient-card: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  --shadow-primary: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  /* Mantine 風格間距 */
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* 圓角設定 */
  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  border: 1px solid rgba(102, 126, 234, 0.5);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.8);
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