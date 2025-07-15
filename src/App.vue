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
/* 全域樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e1e1e1;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #666;
  font-size: 16px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  #app {
    font-size: 14px;
  }
}

/* 深色模式支援 */
@media (prefers-color-scheme: dark) {
  #app {
    color-scheme: dark;
    background-color: #1a1a1a;
    color: #ffffff;
  }
  
  .loading-container {
    background: #1a1a1a;
  }
}
</style> 