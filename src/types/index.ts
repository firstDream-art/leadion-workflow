// 工作流執行狀態
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed'

// 工作流分類
export type WorkflowCategory = 'seo' | 'content' | 'analytics' | 'automation' | 'all'

// 工作流執行記錄
export interface WorkflowExecution {
  id: string
  workflowName: string
  category: WorkflowCategory
  status: ExecutionStatus
  startTime: Date
  endTime?: Date
  inputData?: Record<string, any>
  outputData?: Record<string, any>
  errorMessage?: string
}

// SEO 分析表單數據
export interface SeoFormData {
  keyword: string
  brandName: string
  brandWebsite: string
}

// 工作流定義
export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  category: WorkflowCategory
  icon: string
  isActive: boolean
  requiredFields: string[]
  webhookUrl?: string
}

// API 響應格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 主題類型
export type ThemeType = 'light' | 'dark'

// 主題設定
export interface ThemeConfig {
  isDark: boolean
  theme?: ThemeType
}

// n8n Webhook 回調數據
export interface N8nWebhookData {
  executionId: string
  workflowId: string
  status: ExecutionStatus
  data?: Record<string, any>
  error?: string
  timestamp: string
}

// 用戶設定
export interface UserPreferences {
  theme: ThemeConfig
  defaultCategory: WorkflowCategory
  autoRefresh: boolean
}

// 錯誤類型
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
}