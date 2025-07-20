/**
 * Clerk API 速率限制處理工具
 * 用於監控和處理 429 Too Many Requests 錯誤
 */

interface RateLimitTracker {
  lastRequest: number
  requestCount: number
  waitTime: number
}

class ClerkRateLimitManager {
  private tracker: RateLimitTracker = {
    lastRequest: 0,
    requestCount: 0,
    waitTime: 1000 // 初始等待時間 1 秒
  }

  private readonly MAX_REQUESTS_PER_MINUTE = 20
  private readonly RESET_INTERVAL = 60000 // 1 分鐘
  private readonly MAX_WAIT_TIME = 30000 // 最長等待 30 秒

  /**
   * 檢查是否可以發送請求
   */
  canMakeRequest(): boolean {
    const now = Date.now()
    
    // 重置計數器（如果超過 1 分鐘）
    if (now - this.tracker.lastRequest > this.RESET_INTERVAL) {
      this.tracker.requestCount = 0
      this.tracker.waitTime = 1000
    }

    // 檢查請求頻率
    if (this.tracker.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      console.warn('Clerk API 請求達到限制，請稍後再試')
      return false
    }

    return true
  }

  /**
   * 記錄請求
   */
  recordRequest(): void {
    this.tracker.lastRequest = Date.now()
    this.tracker.requestCount++
  }

  /**
   * 處理 429 錯誤
   */
  handle429Error(): number {
    console.warn('遇到 Clerk API 速率限制 (429)，自動調整請求頻率')
    
    // 指數退避算法
    this.tracker.waitTime = Math.min(
      this.tracker.waitTime * 2,
      this.MAX_WAIT_TIME
    )
    
    return this.tracker.waitTime
  }

  /**
   * 獲取建議等待時間
   */
  getSuggestedWaitTime(): number {
    return this.tracker.waitTime
  }

  /**
   * 重置限制狀態
   */
  reset(): void {
    this.tracker = {
      lastRequest: 0,
      requestCount: 0,
      waitTime: 1000
    }
  }

  /**
   * 獲取當前狀態
   */
  getStatus() {
    return {
      requestCount: this.tracker.requestCount,
      waitTime: this.tracker.waitTime,
      canRequest: this.canMakeRequest()
    }
  }
}

// 創建全域實例
export const clerkRateLimit = new ClerkRateLimitManager()

/**
 * 帶有速率限制的 Clerk 操作包裝器
 */
export async function withRateLimit<T>(
  operation: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      // 檢查是否可以發送請求
      if (!clerkRateLimit.canMakeRequest()) {
        const waitTime = clerkRateLimit.getSuggestedWaitTime()
        console.log(`等待 ${waitTime}ms 後重試...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }

      // 記錄請求
      clerkRateLimit.recordRequest()
      
      // 執行操作
      const result = await operation()
      return result

    } catch (error: any) {
      console.error('Clerk 操作錯誤:', error)

      // 處理 429 錯誤
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
        const waitTime = clerkRateLimit.handle429Error()
        
        if (i < retries - 1) {
          console.log(`第 ${i + 1} 次重試，等待 ${waitTime}ms...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
      }

      // 如果不是 429 錯誤或已達到最大重試次數，直接拋出
      throw error
    }
  }

  throw new Error('達到最大重試次數，操作失敗')
}

/**
 * 用戶友好的錯誤處理
 */
export function handleClerkError(error: any): string {
  if (error?.status === 429 || error?.message?.includes('429')) {
    return '請求太頻繁，請稍後再試。這是正常的安全機制，請耐心等待。'
  }
  
  if (error?.message?.includes('network')) {
    return '網路連接問題，請檢查您的網路連接。'
  }
  
  if (error?.message?.includes('invalid')) {
    return '提供的信息無效，請檢查您的輸入。'
  }
  
  return '登入系統暫時繁忙，請稍後再試。'
}