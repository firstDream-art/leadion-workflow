<template>
  <div class="auth-callback">
    <div class="loading">
      <div class="spinner"></div>
      <p>處理登入中...</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  console.log('🔄 AuthCallback 頁面載入')
  console.log('🔍 當前 URL:', window.location.href)

  try {
    console.log('📋 Route query:', route.query)
    
    // 從 URL 參數中取得認證數據
    const encodedData = route.query.data as string
    
    if (!encodedData) {
      console.error('❌ 缺少認證數據')
      throw new Error('缺少認證數據')
    }
    
    console.log('📦 收到編碼數據:', encodedData.substring(0, 50) + '...')
    
    // 解碼認證數據
    const authData = JSON.parse(atob(encodedData))
    console.log('✅ 解碼成功:', authData)
    
    if (authData.type === 'GOOGLE_OAUTH_SUCCESS') {
      console.log('✅ 設置認證狀態並跳轉到 dashboard')
      
      // 設置認證狀態
      authStore.setAuth({
        user: authData.user,
        tokens: authData.tokens
      })
      
      // 跳轉到 dashboard
      router.push('/dashboard')
      
    } else {
      throw new Error('無效的認證數據')
    }
    
  } catch (error) {
    console.error('❌ 處理認證回調失敗:', error)
    router.push('/sign-in?error=auth_failed')
  }
})
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-bg);
}

.loading {
  text-align: center;
  color: var(--text-primary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>