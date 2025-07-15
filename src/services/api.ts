import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { config } from '@/config'
import { useNotificationStore } from '@/stores/notification'

// API 回應類型定義
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分析請求類型
export interface AnalysisRequest {
  url: string
  analysisType: 'basic' | 'advanced' | 'comprehensive'
  options?: {
    includeCompetitors?: boolean
    includeKeywords?: boolean
    generateReport?: boolean
  }
}

// 分析狀態類型
export interface AnalysisStatus {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  estimatedTimeRemaining?: number
  message?: string
}

// 分析結果類型
export interface AnalysisResult {
  id: string
  url: string
  analysisType: string
  completedAt: string
  report: {
    summary: string
    score: number
    recommendations: string[]
    details: Record<string, any>
  }
}

class ApiService {
  private api: AxiosInstance
  private notificationStore: any

  constructor() {
    this.api = axios.create({
      baseURL: config.n8n.webhookUrl,
      timeout: config.n8n.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
    this.notificationStore = useNotificationStore()
  }

  private setupInterceptors() {
    // 請求攔截器
    this.api.interceptors.request.use(
      (config) => {
        // 添加認證 header（如果需要）
        const token = localStorage.getItem('clerk-session-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 回應攔截器
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => {
        this.handleApiError(error)
        return Promise.reject(error)
      }
    )
  }

  private handleApiError(error: AxiosError) {
    let message = '發生未知錯誤'

    if (error.response) {
      // 伺服器回應錯誤
      const status = error.response.status
      switch (status) {
        case 400:
          message = '請求參數錯誤'
          break
        case 401:
          message = '認證失敗，請重新登入'
          break
        case 403:
          message = '沒有權限執行此操作'
          break
        case 404:
          message = '請求的資源不存在'
          break
        case 429:
          message = '請求過於頻繁，請稍後再試'
          break
        case 500:
          message = 'n8n 服務暫時無法使用'
          break
        default:
          message = `伺服器錯誤 (${status})`
      }
    } else if (error.request) {
      // 網路錯誤
      message = '無法連接到 n8n 服務，請檢查網路連線'
    }

    if (config.app.enableLogging) {
      console.error('API Error:', error)
    }

    this.notificationStore?.error('API 錯誤', message)
  }

  // 健康檢查
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get(config.n8n.endpoints.health)
      return response.data.status === 'online'
    } catch (error) {
      return false
    }
  }

  // 提交分析請求
  async submitAnalysis(request: AnalysisRequest): Promise<ApiResponse<{ analysisId: string }>> {
    try {
      const response = await this.api.post(config.n8n.endpoints.submit, request)
      
      this.notificationStore?.success(
        '分析已提交',
        '您的 SEO 分析請求已成功提交，正在處理中...'
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '提交分析請求失敗'
      }
    }
  }

  // 查詢分析狀態
  async getAnalysisStatus(analysisId: string): Promise<ApiResponse<AnalysisStatus>> {
    try {
      const response = await this.api.get(`${config.n8n.endpoints.status}/${analysisId}`)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '查詢分析狀態失敗'
      }
    }
  }

  // 獲取分析報告
  async getAnalysisReport(analysisId: string): Promise<ApiResponse<AnalysisResult>> {
    try {
      const response = await this.api.get(`${config.n8n.endpoints.report}/${analysisId}`)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '獲取分析報告失敗'
      }
    }
  }

  // 獲取分析歷史
  async getAnalysisHistory(limit = 20, offset = 0): Promise<ApiResponse<AnalysisResult[]>> {
    try {
      const response = await this.api.get(config.n8n.endpoints.history, {
        params: { limit, offset }
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '獲取分析歷史失敗'
      }
    }
  }

  // 取消分析
  async cancelAnalysis(analysisId: string): Promise<ApiResponse> {
    try {
      const response = await this.api.post(`${config.n8n.endpoints.cancel}/${analysisId}`)
      
      this.notificationStore?.info(
        '分析已取消',
        '您的分析請求已成功取消'
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '取消分析失敗'
      }
    }
  }

  // 重試機制的包裝方法
  async withRetry<T>(
    operation: () => Promise<T>, 
    maxRetries = config.api.maxRetries
  ): Promise<T> {
    let lastError: any

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000) // 指數退避
          await new Promise(resolve => setTimeout(resolve, delay))
          
          if (config.app.enableLogging) {
            console.log(`API 重試 ${attempt}/${maxRetries}，${delay}ms 後重試`)
          }
        }
      }
    }

    throw lastError
  }
}

// 創建 API 服務實例
export const apiService = new ApiService()

// 便利方法導出
export const {
  healthCheck,
  submitAnalysis,
  getAnalysisStatus,
  getAnalysisReport,
  getAnalysisHistory,
  cancelAnalysis,
  withRetry
} = apiService 