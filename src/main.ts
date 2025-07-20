import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { clerkPlugin } from '@clerk/vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 導入繁體中文本地化
import { zhTW } from '@clerk/localizations'

import App from './App.vue'
import router from './router'
import { config } from './config'
// 引入速率限制工具
import { handleClerkError, clerkRateLimit } from './utils/clerkRateLimit'

const app = createApp(App)

// 設定 Pinia 狀態管理
app.use(createPinia())

// 設定 Clerk 認證 - 優化配置減少 API 請求
app.use(clerkPlugin, {
  publishableKey: config.clerk.publishableKey,
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/dashboard',
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  // 繁體中文本地化
  localization: zhTW,
  // 關鍵優化：減少 API 請求頻率
  telemetry: false, // 關閉遙測數據收集
  isSatellite: false, // 確保不是衛星應用
  // 減少 API 請求的外觀配置
  appearance: {
    layout: {
      logoPlacement: 'none',
      showOptionalFields: false,
      // 關閉實時驗證減少 API 調用
      unsafe_disableDevelopmentModeWarnings: true
    },
    variables: {
      colorPrimary: '#00d4ff',
      borderRadius: '8px'
    },
    elements: {
      formButtonPrimary: {
        fontSize: '16px',
        fontWeight: '600'
      },
      formField: {
        borderColor: '#e9ecef'
      },
      // 關閉動畫減少重複渲染
      card: {
        transition: 'none'
      }
    }
  },
  // 添加緩存策略
  options: {
    // 延長會話檢查間隔減少 API 請求
    sessionTokenRefreshInterval: 10 * 60 * 1000, // 10分鐘
    // 關閉自動重試機制
    maxRetries: 0
  }
})

// 全局錯誤處理 - 增強版
app.config.errorHandler = (err: any, vm, info) => {
  console.error('應用錯誤:', err)
  console.error('錯誤信息:', info)
  
  // 如果是 Clerk 相關錯誤，使用專業的錯誤處理
  if (err?.message?.includes('clerk') || err?.message?.includes('429') || err?.message?.includes('Too Many Requests')) {
    const friendlyMessage = handleClerkError(err)
    console.warn('Clerk 錯誤處理:', friendlyMessage)
    
    // 在生產環境中，可以顯示用戶友好的提示
    if (process.env.NODE_ENV === 'production') {
      // 這裡可以添加用戶通知邏輯
      console.log('用戶提示:', friendlyMessage)
    }
  }
}

// 設定 Element Plus UI
app.use(ElementPlus)

// 設定路由
app.use(router)

app.mount('#app') 