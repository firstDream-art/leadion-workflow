import axios, { AxiosInstance } from 'axios'
import { useAuth } from '@/composables/useAuth'
import { config } from '@/config'

// 🔗 後端 API 基礎配置
const BACKEND_URL = config.backend.baseUrl || 'http://localhost:3001'

// 📊 報告相關類型定義
export interface Report {
  id: string
  userEmail: string
  websiteUrl: string
  reportTitle: string
  keywords: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  reportHtml?: string
  fileSize?: number
  executionTimeSeconds?: number
  creditsUsed: number
  errorMessage?: string
  createdAt: string
  startedAt?: string
  completedAt?: string
  // 保留舊的相容性欄位
  userId?: string
  reportUrl?: string
  expiresAt?: string
  isEmailed?: boolean
  daysUntilExpiry?: number | null
}

export interface ReportListResponse {
  success: boolean
  data: {
    reports: Report[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
  }
}

export interface ReportStatsResponse {
  success: boolean
  data: {
    counts: {
      active: number
      total: number
    }
    recentReports: Report[]
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ReportService {
  private api: AxiosInstance
  private auth: any

  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 🔐 請求攔截器 - 自動添加 JWT token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          // 使用自建認證系統獲取 token
          const token = localStorage.getItem('auth_token')
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }

          console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`)
          return config
        } catch (error) {
          console.error('❌ Failed to get auth token:', error)
          return config
        }
      },
      (error) => {
        console.error('❌ Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // 📥 回應攔截器 - 統一錯誤處理
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('❌ API Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url
        })
        return Promise.reject(error)
      }
    )
  }

  // 🏥 後端健康檢查
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health')
      return response.data.status === 'ok'
    } catch (error) {
      console.error('❌ Backend health check failed:', error)
      return false
    }
  }

  // 📊 獲取用戶報告列表
  async getReports(options: {
    limit?: number
    offset?: number
    status?: 'active' | 'expired' | 'deleted'
  } = {}): Promise<ReportListResponse> {
    try {
      const { limit = 20, offset = 0, status = 'active' } = options
      const response = await this.api.get('/api/reports', {
        params: { limit, offset, status }
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '獲取報告列表失敗')
    }
  }

  // 📄 獲取特定報告
  async getReport(reportId: string): Promise<ApiResponse<Report>> {
    try {
      const response = await this.api.get(`/api/reports/${reportId}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '獲取報告失敗')
    }
  }

  // 📧 發送報告到郵箱
  async emailReport(reportId: string, email: string, userName?: string): Promise<ApiResponse> {
    try {
      const response = await this.api.post(`/api/reports/${reportId}/email`, {
        email,
        userName: userName || 'Leadion 用戶'
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '發送報告郵件失敗')
    }
  }

  // 🗑️ 刪除報告
  async deleteReport(reportId: string, permanent = false): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/api/reports/${reportId}`, {
        params: { permanent }
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '刪除報告失敗')
    }
  }

  // 📊 獲取報告統計
  async getReportStats(): Promise<ReportStatsResponse> {
    try {
      const response = await this.api.get('/api/reports/stats/summary')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '獲取報告統計失敗')
    }
  }

  // 🔄 刷新報告狀態
  async refreshReports(): Promise<ReportListResponse> {
    console.log('🔄 刷新報告列表...')
    return this.getReports({ limit: 50 })
  }

  // 📈 檢查後端連接狀態
  async checkConnection(): Promise<{
    connected: boolean
    services: {
      database: string
      cloudinary: string
      email: string
    }
  }> {
    try {
      const response = await this.api.get('/health/detailed')
      return {
        connected: response.data.status === 'healthy',
        services: response.data.services
      }
    } catch (error) {
      return {
        connected: false,
        services: {
          database: 'unknown',
          cloudinary: 'unknown', 
          email: 'unknown'
        }
      }
    }
  }

  // 🔄 輪詢報告狀態直到完成
  async pollReportStatus(
    reportId: string, 
    onStatusUpdate: (report: Report) => void,
    maxAttempts: number = 60, // 最多輪詢 5 分鐘 (每 5 秒一次)
    interval: number = 5000   // 5 秒間隔
  ): Promise<Report> {
    return new Promise((resolve, reject) => {
      let attempts = 0
      
      const poll = async () => {
        try {
          attempts++
          console.log(`🔄 輪詢報告狀態 (${attempts}/${maxAttempts}): ${reportId}`)
          
          const response = await this.getReport(reportId)
          if (!response.success || !response.data) {
            throw new Error(response.message || '獲取報告失敗')
          }
          
          const report = response.data
          onStatusUpdate(report)
          
          if (report.status === 'completed') {
            console.log('✅ 報告已完成!')
            resolve(report)
            return
          }
          
          if (report.status === 'failed') {
            console.log('❌ 報告生成失敗')
            reject(new Error(report.errorMessage || '報告生成失敗'))
            return
          }
          
          if (attempts >= maxAttempts) {
            console.log('⏰ 輪詢超時')
            reject(new Error('報告生成超時，請稍後手動查看'))
            return
          }
          
          // 繼續輪詢
          setTimeout(poll, interval)
          
        } catch (error) {
          console.error('輪詢報告狀態失敗:', error)
          if (attempts >= maxAttempts) {
            reject(error)
          } else {
            // 繼續嘗試
            setTimeout(poll, interval)
          }
        }
      }
      
      // 開始輪詢
      poll()
    })
  }

  // 🔗 獲取報告的 HTML 內容 URL
  getReportViewUrl(reportId: string): string {
    return `${BACKEND_URL}/api/reports/view/${reportId}`
  }

  // 🔍 搜索報告
  async searchReports(query: string): Promise<Report[]> {
    try {
      const allReports = await this.getReports({ limit: 100 })
      
      // 客戶端搜索 (後續可以改為服務端搜索)
      const searchTerms = query.toLowerCase().split(' ')
      
      return allReports.data.reports.filter(report => {
        const searchableText = [
          report.reportTitle,
          report.websiteUrl
        ].join(' ').toLowerCase()
        
        return searchTerms.every(term => searchableText.includes(term))
      })
    } catch (error: any) {
      throw new Error('搜索報告失敗: ' + error.message)
    }
  }

  // 📂 批量操作
  async batchDeleteReports(reportIds: string[]): Promise<{
    success: number
    failed: number
    errors: string[]
  }> {
    const results = { success: 0, failed: 0, errors: [] as string[] }
    
    for (const id of reportIds) {
      try {
        await this.deleteReport(id)
        results.success++
      } catch (error: any) {
        results.failed++
        results.errors.push(`報告 ${id}: ${error.message}`)
      }
    }
    
    return results
  }
}

// 創建服務實例
export const reportService = new ReportService()

// 🎯 便利方法導出
export const {
  healthCheck,
  getReports,
  getReport,
  emailReport,
  deleteReport,
  getReportStats,
  refreshReports,
  checkConnection,
  searchReports,
  batchDeleteReports
} = reportService

export default reportService