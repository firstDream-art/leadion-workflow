// 認證 Hook - 提供方便的認證功能訪問
// 簡化組件中的認證邏輯

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  
  // 從 store 提取響應式狀態
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    userEmail,
    userFullName,
    userInitials
  } = storeToRefs(authStore)
  
  // 從 store 提取方法
  const {
    initialize,
    sendVerificationCode,
    verifyCode,
    signInWithGoogle,
    signOut,
    refreshAccessToken,
    updateUser,
    clearError,
    setError
  } = authStore
  
  return {
    // 狀態
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
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
    clearError,
    setError
  }
}