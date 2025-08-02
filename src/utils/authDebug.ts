// 認證調試工具
// 用於檢查和調試認證狀態

export interface TokenInfo {
  isValid: boolean
  isExpired: boolean
  expiresAt?: Date
  timeUntilExpiry?: number
  payload?: any
}

// 解析 JWT token (不驗證簽名，僅用於調試)
export function parseJWTToken(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }
    
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch (error) {
    console.error('Failed to parse JWT token:', error)
    return null
  }
}

// 檢查 localStorage 中的認證狀態
export function checkAuthStatus(): TokenInfo {
  try {
    const authTokens = localStorage.getItem('auth_tokens')
    if (!authTokens) {
      return { isValid: false, isExpired: true }
    }
    
    const tokens = JSON.parse(authTokens)
    if (!tokens.accessToken) {
      return { isValid: false, isExpired: true }
    }
    
    // 解析 token 獲取過期時間
    const payload = parseJWTToken(tokens.accessToken)
    if (!payload) {
      return { isValid: false, isExpired: true }
    }
    
    const now = Date.now() / 1000
    const isExpired = payload.exp < now
    const timeUntilExpiry = payload.exp - now
    
    return {
      isValid: !isExpired,
      isExpired,
      expiresAt: new Date(payload.exp * 1000),
      timeUntilExpiry: timeUntilExpiry * 1000, // 轉換為毫秒
      payload
    }
  } catch (error) {
    console.error('Failed to check auth status:', error)
    return { isValid: false, isExpired: true }
  }
}

// 格式化時間
export function formatTimeUntilExpiry(ms: number): string {
  if (ms <= 0) return '已過期'
  
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天 ${hours % 24}小時`
  if (hours > 0) return `${hours}小時 ${minutes % 60}分鐘`
  if (minutes > 0) return `${minutes}分鐘 ${seconds % 60}秒`
  return `${seconds}秒`
}

// 調試認證狀態 (開發環境使用)
export function debugAuthStatus(): void {
  if (process.env.NODE_ENV !== 'development') return
  
  const status = checkAuthStatus()
  console.group('🔍 認證狀態調試')
  console.log('有效性:', status.isValid ? '✅ 有效' : '❌ 無效')
  console.log('是否過期:', status.isExpired ? '⚠️ 已過期' : '✅ 未過期')
  
  if (status.expiresAt) {
    console.log('過期時間:', status.expiresAt.toLocaleString('zh-TW'))
  }
  
  if (status.timeUntilExpiry !== undefined) {
    console.log('距離過期:', formatTimeUntilExpiry(status.timeUntilExpiry))
  }
  
  if (status.payload) {
    console.log('Token 內容:', status.payload)
  }
  
  console.groupEnd()
}