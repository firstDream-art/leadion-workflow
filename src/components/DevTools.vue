<template>
  <div v-if="isDev" class="dev-tools">
    <el-button size="small" type="primary" @click="testCredits">
      💰 測試點數 API
    </el-button>
    <el-button size="small" type="warning" @click="showAuthInfo">
      🔍 查看認證信息
    </el-button>
    <el-button size="small" type="danger" @click="clearAuthState">
      🧹 清除認證狀態
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { creditService } from '@/services/creditService'
import { checkAuthStatus, formatTimeUntilExpiry, debugAuthStatus } from '@/utils/authDebug'

const { user, signOut } = useAuth()

// 只在開發環境顯示
const isDev = computed(() => import.meta.env.DEV)

// 清除認證狀態
const clearAuthState = async () => {
  try {
    console.log('🧹 開始清除認證狀態...')
    
    // 1. 嘗試系統登出
    try {
      await signOut()
    } catch (e) {
      console.log('系統登出失敗，繼續強制清除')
    }
    
    // 2. 強制清除所有存儲
    localStorage.clear()
    sessionStorage.clear()
    
    // 3. 清除所有 cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // 4. 強制跳轉到登入頁
    window.location.href = '/sign-in'
    
  } catch (error) {
    console.error('清除認證狀態失敗:', error)
    // 最後手段：強制重新載入
    window.location.reload()
  }
}

// 測試點數 API
const testCredits = async () => {
  console.log('🧪 開始測試點數 API...')
  
  try {
    // 測試當前用戶的點數（一般用戶端點）
    const result = await creditService.getBalance()
    console.log('✅ API 測試成功:', result)
    alert(`點數測試成功！餘額: ${result.balance} 點`)
  } catch (error) {
    console.error('❌ API 測試失敗:', error)
    alert(`點數測試失敗: ${error}`)
  }
}

// 顯示認證信息
const showAuthInfo = () => {
  console.log('🔐 當前認證狀態:')
  console.log('用戶:', user.value)
  console.log('用戶 Email:', user.value?.email)
  
  // 使用新的認證調試工具
  debugAuthStatus()
  
  const authStatus = checkAuthStatus()
  
  // 顯示友好的彈框信息
  const statusText = `
認證狀態: ${authStatus.isValid ? '✅ 有效' : '❌ 無效'}
是否過期: ${authStatus.isExpired ? '⚠️ 已過期' : '✅ 未過期'}
${authStatus.expiresAt ? `過期時間: ${authStatus.expiresAt.toLocaleString('zh-TW')}` : ''}
${authStatus.timeUntilExpiry !== undefined ? `距離過期: ${formatTimeUntilExpiry(authStatus.timeUntilExpiry)}` : ''}
用戶 Email: ${user.value?.email || '未登入'}
  `.trim()
  
  alert(statusText)
  
  console.log('LocalStorage keys:', Object.keys(localStorage))
  console.log('SessionStorage keys:', Object.keys(sessionStorage))
  
  // 顯示認證相關的儲存
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('auth') || key.includes('token') || key.includes('__session')
  )
  console.log('認證相關 keys:', authKeys)
}
</script>

<style scoped>
.dev-tools {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  gap: 8px;
  padding: 8px;
  background: var(--accent-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-hover);
}
</style>