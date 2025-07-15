// 應用程式配置
export const config = {
  // Clerk 認證配置
  clerk: {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_d29ydGh5LWtvaS04NS5jbGVyay5hY2NvdW50cy5kZXYk',
  },
  
  // n8n 後端配置
  n8n: {
    baseUrl: import.meta.env.VITE_N8N_BASE_URL || 'https://your-n8n-instance.zeabur.app',
    webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://your-n8n-instance.zeabur.app/webhook',
    endpoints: {
      // 表單處理端點
      submit: '/analysis/submit',
      status: '/analysis/status', 
      report: '/analysis/report',
      history: '/analysis/history',
      cancel: '/analysis/cancel',
      
      // 系統狀態
      health: '/health'
    },
    timeout: 30000, // 30 seconds
    retryAttempts: 2
  },
  
  // 應用配置
  app: {
    name: import.meta.env.VITE_APP_NAME || 'LeadIO',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    enableLogging: import.meta.env.DEV, // 開發模式下啟用日誌
    enableAnalytics: import.meta.env.PROD // 生產模式下啟用分析
  },
  
  // API 配置
  api: {
    timeout: 10000,
    maxRetries: 3
  }
}

// 類型定義
export type Config = typeof config 