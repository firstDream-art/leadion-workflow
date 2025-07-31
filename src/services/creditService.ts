/**
 * 點數系統服務
 * 負責處理所有與點數相關的 API 請求
 */

import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { config } from '@/config'

// 點數相關類型定義
export interface CreditBalance {
  userEmail: string
  balance: number
  totalPurchased: number
  totalUsed: number
  createdAt: string
  updatedAt: string
}

export interface CreditTransaction {
  id: string
  type: 'purchase' | 'deduct' | 'refund'
  amount: number
  balanceAfter: number
  workflowName?: string
  description: string
  createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// API 基礎 URL - 支援動態主機檢測
const getApiBaseUrl = () => {
  const configUrl = config.backend.baseUrl
  
  // 如果設定為 'auto'，自動使用當前主機
  if (configUrl === 'auto') {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    return `${protocol}//${hostname}:3001`
  }
  
  return configUrl || 'http://localhost:3001'
}

const API_BASE_URL = getApiBaseUrl()

class CreditService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  constructor() {
    // 設置請求攔截器，自動添加 JWT token
    this.apiClient.interceptors.request.use(
      (config) => {
        const authTokens = localStorage.getItem('auth_tokens')
        if (authTokens) {
          try {
            const tokens = JSON.parse(authTokens)
            if (tokens.accessToken) {
              config.headers.Authorization = `Bearer ${tokens.accessToken}`
            }
          } catch (error) {
            console.error('解析認證 token 失敗:', error)
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 設置回應攔截器，處理認證錯誤
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            // 嘗試獲取 refresh token 並刷新
            const authTokens = localStorage.getItem('auth_tokens')
            if (authTokens) {
              const tokens = JSON.parse(authTokens)
              if (tokens.refreshToken) {
                console.log('🔄 CreditService: Token 過期，嘗試自動刷新...')
                
                // 使用 authService 的 refresh 方法
                const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ refreshToken: tokens.refreshToken })
                })
                
                if (refreshResponse.ok) {
                  const refreshData = await refreshResponse.json()
                  
                  if (refreshData.success) {
                    // 更新 localStorage 中的 tokens
                    const newTokens = {
                      ...tokens,
                      accessToken: refreshData.accessToken,
                      expiresAt: refreshData.expiresAt
                    }
                    localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
                    
                    // 更新請求 header
                    originalRequest.headers.Authorization = `Bearer ${refreshData.accessToken}`
                    
                    console.log('✅ CreditService: Token 刷新成功，重新發送請求')
                    
                    // 重新發送原始請求
                    return this.apiClient(originalRequest)
                  }
                }
              }
            }
          } catch (refreshError) {
            console.error('❌ CreditService: Token 刷新失敗:', refreshError)
          }
          
          // 刷新失敗，清除認證狀態並通知應用
          localStorage.removeItem('auth_tokens')
          localStorage.removeItem('auth_user')
          window.dispatchEvent(new CustomEvent('auth-expired'))
        }
        
        return Promise.reject(error)
      }
    )
  }

  /**
   * 獲取用戶點數餘額
   */
  async getBalance(userEmail?: string): Promise<CreditBalance> {
    try {
      console.log(`💰 查詢用戶點數餘額: ${userEmail || '當前用戶'}`)
      console.log(`🌐 API 基礎 URL: ${API_BASE_URL}`)
      
      // 如果沒有指定 userEmail，查詢當前用戶自己的餘額
      // 如果指定了 userEmail，使用管理員端點查詢特定用戶
      const url = userEmail 
        ? `/api/credits/${encodeURIComponent(userEmail)}/balance`  // 管理員端點
        : `/api/credits/balance`  // 一般用戶端點
      
      console.log(`🔗 完整請求 URL: ${API_BASE_URL}${url}`)
      
      const response = await this.apiClient.get<ApiResponse<CreditBalance>>(url)

      console.log(`📨 API 響應:`, response.data)

      if (!response.data.success) {
        throw new Error(response.data.message || '查詢點數餘額失敗')
      }

      console.log(`✅ 點數餘額查詢成功: ${response.data.data?.balance} 點`)
      return response.data.data!
      
    } catch (error: any) {
      console.error('❌ 查詢點數餘額失敗:', error)
      
      if (error.response) {
        console.error('📨 錯誤響應:', error.response.data)
        console.error('🔢 狀態碼:', error.response.status)
        throw new Error(`API 錯誤: ${error.response.data?.message || error.response.statusText}`)
      } else if (error.request) {
        console.error('📡 請求錯誤:', error.request)
        throw new Error('無法連接到服務器，請檢查網路連接')
      } else {
        console.error('❓ 未知錯誤:', error.message)
        throw new Error(error.message || '無法獲取點數餘額，請稍後再試')
      }
    }
  }

  /**
   * 獲取交易記錄
   */
  async getTransactions(userEmail?: string, limit: number = 10): Promise<CreditTransaction[]> {
    try {
      console.log(`📝 查詢交易記錄: ${userEmail || '當前用戶'}`)
      
      // 如果沒有指定 userEmail，查詢當前用戶自己的交易記錄
      // 如果指定了 userEmail，使用管理員端點查詢特定用戶
      const url = userEmail 
        ? `/api/credits/${encodeURIComponent(userEmail)}/transactions`  // 管理員端點
        : `/api/credits/transactions`  // 一般用戶端點
      
      const response = await this.apiClient.get<ApiResponse<{ transactions: CreditTransaction[] }>>(
        url,
        { params: { limit } }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || '查詢交易記錄失敗')
      }

      console.log(`✅ 交易記錄查詢成功: ${response.data.data?.transactions.length} 筆記錄`)
      return response.data.data?.transactions || []
      
    } catch (error) {
      console.error('❌ 查詢交易記錄失敗:', error)
      throw new Error('無法獲取交易記錄，請稍後再試')
    }
  }

  /**
   * 檢查點數是否足夠
   */
  async checkCredits(requiredAmount: number, userEmail?: string): Promise<boolean> {
    try {
      const balance = await this.getBalance(userEmail)
      const hasEnough = balance.balance >= requiredAmount
      
      console.log(`🔍 點數檢查: 需要 ${requiredAmount} 點，餘額 ${balance.balance} 點，${hasEnough ? '足夠' : '不足'}`)
      
      return hasEnough
      
    } catch (error) {
      console.error('❌ 檢查點數失敗:', error)
      return false
    }
  }

  /**
   * 測試資料庫連接
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.apiClient.get<ApiResponse>('/api/credits/test-db')
      return response.data.success
    } catch (error) {
      console.error('❌ 資料庫連接測試失敗:', error)
      return false
    }
  }

  /**
   * 扣除工作流點數
   */
  async deductWorkflowCredits(
    userEmail: string, 
    amount: number, 
    workflowName: string, 
    description?: string
  ): Promise<any> {
    try {
      console.log(`💳 扣除工作流點數: ${userEmail}, ${amount} 點, ${workflowName}`)
      
      const response = await this.apiClient.post<ApiResponse>(
        `/api/workflow-credits/${encodeURIComponent(userEmail)}/deduct`,
        {
          amount,
          workflowName,
          description
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || '扣除點數失敗')
      }

      console.log(`✅ 點數扣除成功: 新餘額 ${response.data.data?.newBalance} 點`)
      return response.data.data
      
    } catch (error) {
      console.error('❌ 扣除工作流點數失敗:', error)
      throw new Error('無法扣除點數，請稍後再試')
    }
  }

  /**
   * 退還工作流點數（執行失敗時使用）
   */
  async refundWorkflowCredits(
    userEmail: string, 
    amount: number, 
    workflowName: string, 
    reason: string,
    referenceId?: string
  ): Promise<any> {
    try {
      console.log(`🔄 退還工作流點數: ${userEmail}, ${amount} 點, ${reason}`)
      
      const response = await this.apiClient.post<ApiResponse>(
        `/api/workflow-credits/${encodeURIComponent(userEmail)}/refund`,
        {
          amount,
          workflowName,
          reason,
          referenceId
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || '退還點數失敗')
      }

      console.log(`✅ 點數退還成功: 新餘額 ${response.data.data?.newBalance} 點`)
      return response.data.data
      
    } catch (error) {
      console.error('❌ 退還工作流點數失敗:', error)
      throw new Error('無法退還點數，請稍後再試')
    }
  }

  /**
   * 獲取所有用戶列表（帶請求保護）
   */
  private static lastGetUsersTime = 0
  private static getUsersController: AbortController | null = null
  
  async getAllUsers(): Promise<any[]> {
    // 防止短時間內重複請求
    const now = Date.now()
    if (now - CreditService.lastGetUsersTime < 3000) {
      console.warn('⏳ 請求間隔太短，跳過重複請求')
      throw new Error('請求間隔太短，請稍後再試')
    }
    
    // 取消之前的請求
    if (CreditService.getUsersController) {
      CreditService.getUsersController.abort()
    }
    CreditService.getUsersController = new AbortController()
    
    try {
      CreditService.lastGetUsersTime = now
      console.log('🔄 發送用戶列表請求...')
      
      const response = await this.apiClient.get<ApiResponse<{ users: any[] }>>('/api/credits/users', {
        signal: CreditService.getUsersController.signal
      })
      
      console.log('✅ 用戶列表請求成功')
      return response.data.data?.users || []
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('⚡ 用戶列表請求被取消')
        throw new Error('請求被取消')
      }
      
      console.error('❌ 獲取用戶列表失敗:', error)
      
      // 如果是 429 錯誤，提供友好的錯誤訊息
      if (error.response?.status === 429) {
        console.warn('⚠️ 請求過於頻繁，請稍後再試')
        throw new Error('請求過於頻繁，請稍後再試')
      }
      
      throw error
    } finally {
      CreditService.getUsersController = null
    }
  }
}

// 導出單例實例
export const creditService = new CreditService()

// 導出便利函數
export async function getUserCredits(userEmail?: string): Promise<CreditBalance | null> {
  try {
    return await creditService.getBalance(userEmail)
  } catch (error) {
    console.error('獲取用戶點數失敗:', error)
    return null
  }
}

export async function checkUserCredits(requiredAmount: number, userEmail?: string): Promise<boolean> {
  try {
    return await creditService.checkCredits(requiredAmount, userEmail)
  } catch (error) {
    console.error('檢查用戶點數失敗:', error)
    return false
  }
}