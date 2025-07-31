// 認證服務 - 處理所有認證相關的 API 呼叫
// 包含登入、註冊、登出、Token 管理等功能

import axios, { AxiosInstance } from 'axios'
import { config } from '@/config'

// API 端點配置 - 支援動態主機檢測
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
const AUTH_ENDPOINTS = {
  sendCode: '/api/auth/send-code',
  verifyCode: '/api/auth/verify-code',
  googleToken: '/api/auth/google/token',
  googleUrl: '/api/auth/google/url',
  refresh: '/api/auth/refresh',
  logout: '/api/auth/logout',
  me: '/api/auth/me',
  sessions: '/api/auth/sessions',
  status: '/api/auth/status'
}

// 認證服務類
class AuthService {
  private api: AxiosInstance
  
  constructor() {
    // 創建 Axios 實例
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 請求攔截器 - 自動添加 token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getStoredAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 響應攔截器 - 處理錯誤和自動刷新 token
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            // 嘗試刷新 token
            const refreshToken = this.getStoredRefreshToken()
            if (refreshToken) {
              console.log('🔄 Token 過期，嘗試自動刷新...')
              
              const refreshResponse = await this.refreshToken(refreshToken)
              if (refreshResponse.success) {
                // 更新 localStorage 中的 tokens
                const currentTokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}')
                const newTokens = {
                  ...currentTokens,
                  accessToken: refreshResponse.accessToken,
                  expiresAt: refreshResponse.expiresAt
                }
                localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
                
                // 更新請求 header
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`
                
                console.log('✅ Token 刷新成功，重新發送請求')
                
                // 重新發送原始請求
                return this.api(originalRequest)
              }
            }
          } catch (refreshError) {
            console.error('❌ Token 刷新失敗:', refreshError)
            
            // 刷新失敗，清除認證狀態
            localStorage.removeItem('auth_tokens')
            localStorage.removeItem('auth_user')
            
            // 通知應用需要重新登入
            window.dispatchEvent(new CustomEvent('auth-expired'))
          }
        }
        
        return Promise.reject(error)
      }
    )
  }

  // 從 localStorage 獲取 access token
  private getStoredAccessToken(): string | null {
    try {
      const tokens = localStorage.getItem('auth_tokens')
      if (tokens) {
        const parsed = JSON.parse(tokens)
        return parsed.accessToken || null
      }
    } catch (error) {
      console.error('獲取 access token 失敗:', error)
    }
    return null
  }

  // 從 localStorage 獲取 refresh token
  private getStoredRefreshToken(): string | null {
    try {
      const tokens = localStorage.getItem('auth_tokens')
      if (tokens) {
        const parsed = JSON.parse(tokens)
        return parsed.refreshToken || null
      }
    } catch (error) {
      console.error('獲取 refresh token 失敗:', error)
    }
    return null
  }

  // 設置認證 token
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // 清除認證 token
  clearAuthToken() {
    delete this.api.defaults.headers.common['Authorization']
  }

  // 檢查認證服務狀態
  async checkStatus() {
    try {
      const response = await this.api.get(AUTH_ENDPOINTS.status)
      return response.data
    } catch (error) {
      console.error('檢查認證服務狀態失敗:', error)
      throw this.handleError(error)
    }
  }

  // 發送驗證碼
  async sendVerificationCode(email: string, type: 'login' | 'registration') {
    try {
      const response = await this.api.post(AUTH_ENDPOINTS.sendCode, {
        email,
        type
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 驗證驗證碼
  async verifyCode(email: string, code: string, type: 'login' | 'registration') {
    try {
      const response = await this.api.post(AUTH_ENDPOINTS.verifyCode, {
        email,
        code,
        type
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Google 登入
  async signInWithGoogle(idToken: string) {
    try {
      const response = await this.api.post(AUTH_ENDPOINTS.googleToken, {
        idToken
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 獲取 Google OAuth URL
  async getGoogleAuthUrl() {
    try {
      const response = await this.api.get(AUTH_ENDPOINTS.googleUrl)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 刷新 Token
  async refreshToken(refreshToken: string) {
    try {
      const response = await this.api.post(AUTH_ENDPOINTS.refresh, {
        refreshToken
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 登出
  async logout(refreshToken?: string) {
    try {
      const response = await this.api.post(AUTH_ENDPOINTS.logout, {
        refreshToken
      })
      return response.data
    } catch (error) {
      // 登出失敗也不拋出錯誤，確保用戶能夠登出
      console.error('登出 API 錯誤:', error)
      return { success: true }
    }
  }

  // 獲取當前用戶資訊
  async getCurrentUser() {
    try {
      const response = await this.api.get(AUTH_ENDPOINTS.me)
      return response.data.user
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 獲取用戶會話列表
  async getUserSessions() {
    try {
      const response = await this.api.get(AUTH_ENDPOINTS.sessions)
      return response.data.sessions
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 統一錯誤處理
  private handleError(error: any): Error {
    if (error.response) {
      // 服務器返回錯誤
      const { data, status } = error.response
      const message = data?.message || this.getDefaultErrorMessage(status)
      
      console.error(`API 錯誤 ${status}:`, message)
      return new Error(message)
    } else if (error.request) {
      // 請求發送但沒有收到響應
      console.error('網絡錯誤:', error.message)
      return new Error('網絡連接失敗，請檢查您的網絡')
    } else {
      // 其他錯誤
      console.error('請求錯誤:', error.message)
      return new Error(error.message || '發生未知錯誤')
    }
  }

  // 根據狀態碼獲取預設錯誤訊息
  private getDefaultErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: '請求參數錯誤',
      401: '認證失敗，請重新登入',
      403: '權限不足',
      404: '資源不存在',
      429: '請求過於頻繁，請稍後再試',
      500: '服務器錯誤，請稍後再試',
      502: '服務器維護中，請稍後再試',
      503: '服務暫時不可用'
    }
    return messages[status] || `請求失敗 (${status})`
  }
}

// 導出單例
export const authService = new AuthService()

// 導出類型
export interface SendCodeResponse {
  success: boolean
  message: string
  expiresInMinutes: number
}

export interface VerifyCodeResponse {
  success: boolean
  user: any
  tokens: {
    accessToken: string
    refreshToken: string
    expiresAt?: Date
  }
  isNewUser: boolean
}

export interface GoogleAuthResponse {
  success: boolean
  user: any
  tokens: {
    accessToken: string
    refreshToken: string
    expiresAt?: Date
  }
  isNewUser: boolean
}

export interface RefreshTokenResponse {
  success: boolean
  accessToken: string
  expiresAt?: Date
}