// 自建認證系統 - Pinia Store
// 管理用戶登入狀態、Token、用戶資訊等

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import router from '@/router'
import { useNotificationStore } from '@/stores/notification'

// 定義用戶類型
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  username?: string
  avatarUrl?: string
  isVerified: boolean
  createdAt: string
  credits?: {
    balance: number
    total_purchased: number
    total_used: number
  }
}

// 定義認證 Token 類型
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt?: Date
}

export const useAuthStore = defineStore('auth', () => {
  // 狀態
  const user = ref<User | null>(null)
  const tokens = ref<AuthTokens | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // 計算屬性
  const isAuthenticated = computed(() => !!user.value && !!tokens.value)
  const userEmail = computed(() => user.value?.email || '')
  const userFullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`.trim()
  })
  const userInitials = computed(() => {
    if (!user.value) return ''
    const first = user.value.firstName?.[0] || ''
    const last = user.value.lastName?.[0] || ''
    return (first + last).toUpperCase()
  })

  // 從 localStorage 載入認證狀態
  function loadAuthFromStorage() {
    try {
      // 清理所有 Clerk 相關的舊資料
      Object.keys(localStorage).forEach(key => {
        if (key.includes('clerk') || key.includes('__session')) {
          localStorage.removeItem(key)
        }
      })
      
      const storedTokens = localStorage.getItem('auth_tokens')
      const storedUser = localStorage.getItem('auth_user')

      if (storedTokens && storedUser) {
        tokens.value = JSON.parse(storedTokens)
        user.value = JSON.parse(storedUser)
        
        // 檢查 token 是否過期
        if (tokens.value?.expiresAt) {
          const expiresAt = new Date(tokens.value.expiresAt)
          const now = new Date()
          
          if (expiresAt < now) {
            console.log('🚨 Token 已過期，清除認證狀態')
            clearAuth()
            return false
          }
          
          // 如果 token 在 5 分鐘內過期，也清除狀態讓用戶重新登入
          const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)
          if (expiresAt < fiveMinutesFromNow) {
            console.log('⚠️ Token 即將過期（5分鐘內），清除認證狀態')
            clearAuth()
            return false
          }
        } else {
          // 沒有過期時間的 token 視為有效，但這不是最佳實踐
          console.log('⚠️ Token 沒有過期時間，假設仍然有效')
        }
        
        return true
      }
    } catch (error) {
      console.error('載入認證狀態失敗:', error)
      clearAuth()
    }
    return false
  }

  // 保存認證狀態到 localStorage
  function saveAuthToStorage() {
    try {
      if (tokens.value && user.value) {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens.value))
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      } else {
        localStorage.removeItem('auth_tokens')
        localStorage.removeItem('auth_user')
      }
    } catch (error) {
      console.error('保存認證狀態失敗:', error)
    }
  }

  // 設置認證狀態
  function setAuth(authData: { user: User; tokens: AuthTokens }) {
    user.value = authData.user
    tokens.value = authData.tokens
    saveAuthToStorage()
    
    // 設置 Axios 預設 header
    if (authData.tokens.accessToken) {
      authService.setAuthToken(authData.tokens.accessToken)
    }
  }

  // 清除認證狀態
  function clearAuth() {
    user.value = null
    tokens.value = null
    localStorage.removeItem('auth_tokens')
    localStorage.removeItem('auth_user')
    authService.clearAuthToken()
  }

  // 初始化認證狀態
  async function initialize() {
    if (isInitialized.value) return

    isLoading.value = true
    try {
      // 從 localStorage 載入
      const hasAuth = loadAuthFromStorage()
      
      if (hasAuth && tokens.value?.accessToken) {
        // 設置 token 到 service
        authService.setAuthToken(tokens.value.accessToken)
        
        // 簡化初始化：先不驗證 token 有效性，等實際 API 調用時再處理
        // 這樣可以避免載入時卡住
        console.log('✅ 從 localStorage 載入認證狀態成功')
      } else {
        console.log('ℹ️ 沒有儲存的認證狀態，用戶需要登入')
      }
      
      // 監聽認證過期事件
      window.addEventListener('auth-expired', handleAuthExpired)
      
    } catch (error) {
      console.error('初始化認證狀態失敗:', error)
      clearAuth()
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  // 處理認證過期
  function handleAuthExpired() {
    console.log('🚨 收到認證過期事件，自動登出用戶')
    
    // 顯示友好的通知
    const notificationStore = useNotificationStore()
    notificationStore.addNotification({
      type: 'warning',
      title: '登入狀態已過期',
      message: '為了您的安全，請重新登入以繼續使用服務',
      duration: 8000
    })
    
    clearAuth()
    router.push('/sign-in')
  }

  // Email 發送驗證碼
  async function sendVerificationCode(email: string, type: 'login' | 'registration') {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await authService.sendVerificationCode(email, type)
      return result
    } catch (err: any) {
      error.value = err.message || '發送驗證碼失敗'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Email 驗證碼登入/註冊
  async function verifyCode(email: string, code: string, type: 'login' | 'registration') {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await authService.verifyCode(email, code, type)
      
      // 設置認證狀態
      setAuth({
        user: result.user,
        tokens: result.tokens
      })
      
      // 導向到儀表板
      router.push('/dashboard')
      
      return result
    } catch (err: any) {
      error.value = err.message || '驗證失敗'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Google 登入
  async function signInWithGoogle(idToken: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await authService.signInWithGoogle(idToken)
      
      // 設置認證狀態
      setAuth({
        user: result.user,
        tokens: result.tokens
      })
      
      // 導向到儀表板
      router.push('/dashboard')
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Google 登入失敗'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  async function signOut() {
    isLoading.value = true
    error.value = null
    
    try {
      // 呼叫後端登出 API
      if (tokens.value?.refreshToken) {
        await authService.logout(tokens.value.refreshToken)
      }
    } catch (err) {
      console.error('登出 API 錯誤:', err)
      // 即使 API 失敗也要清除本地狀態
    } finally {
      // 清除認證狀態
      clearAuth()
      isLoading.value = false
      
      // 導向到登入頁
      router.push('/sign-in')
    }
  }

  // 刷新 Access Token
  async function refreshAccessToken() {
    if (!tokens.value?.refreshToken) {
      throw new Error('No refresh token available')
    }
    
    try {
      const result = await authService.refreshToken(tokens.value.refreshToken)
      
      // 更新 tokens
      tokens.value = {
        ...tokens.value,
        accessToken: result.accessToken,
        expiresAt: result.expiresAt
      }
      
      saveAuthToStorage()
      
      // 更新 service 的 token
      authService.setAuthToken(result.accessToken)
      
      return result.accessToken
    } catch (error) {
      // 刷新失敗，清除認證狀態
      clearAuth()
      throw error
    }
  }

  // 更新用戶資訊
  async function updateUser(updates: Partial<User>) {
    if (!user.value) return
    
    user.value = {
      ...user.value,
      ...updates
    }
    
    saveAuthToStorage()
  }

  // 檢查是否需要刷新 token
  function shouldRefreshToken(): boolean {
    if (!tokens.value?.expiresAt) return false
    
    const expiresAt = new Date(tokens.value.expiresAt)
    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)
    
    // 如果 token 在 5 分鐘內過期，則需要刷新
    return expiresAt < fiveMinutesFromNow
  }

  // 清除錯誤
  function clearError() {
    error.value = null
  }

  // 設定錯誤
  function setError(message: string) {
    error.value = message
  }

  return {
    // 狀態
    user: computed(() => user.value),
    tokens: computed(() => tokens.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    isInitialized: computed(() => isInitialized.value),
    
    // 計算屬性
    isAuthenticated,
    userEmail,
    userFullName,
    userInitials,
    
    // 方法
    initialize,
    sendVerificationCode,
    verifyCode,
    signInWithGoogle,
    signOut,
    refreshAccessToken,
    updateUser,
    shouldRefreshToken,
    setAuth,
    clearAuth,
    clearError,
    setError
  }
})