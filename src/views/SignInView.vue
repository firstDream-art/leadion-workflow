<template>
  <div class="auth-container">
    <div class="auth-background">
      <div class="tech-pattern"></div>
      <div class="floating-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>
    
    <div class="auth-card glass-effect">
      <!-- 品牌標題 -->
      <div class="auth-header">
        <div class="brand-logo">
          <div class="logo-wrapper">
            <div class="logo-circle">
              <span class="logo-text">L</span>
            </div>
          </div>
          <h1 class="auth-title">歡迎回到 LeadIO AI</h1>
        </div>
        <p class="auth-subtitle">登入您的帳戶以開始 AI 驅動的 SEO 分析</p>
      </div>

      <!-- Clerk 登入組件 -->
      <div class="auth-form">
        <SignIn 
          :redirect-url="'/dashboard'"
          :routing="'hash'"
          :fallback-redirect-url="'/dashboard'"
          :sign-up-url="'/sign-up'"
        />
        
        <!-- API 限制提示 -->
        <div class="rate-limit-notice">
          <p class="notice-text">
            <strong>提示：</strong>如果遇到登入問題，請稍等片刻後重試。
          </p>
        </div>
      </div>

      <!-- 註冊連結 -->
      <div class="auth-footer">
        <div class="divider">
          <span class="divider-text">或</span>
        </div>
        
        <!-- 新用戶提示 -->
        <div class="new-user-notice">
          <p class="notice-text">
            <strong>新用戶提醒：</strong>如果您還沒有帳戶，請先註冊才能登入。
          </p>
        </div>
        
        <p class="footer-text">
          還沒有帳戶？
          <router-link to="/sign-up" class="auth-link">
            立即註冊
          </router-link>
        </p>
        <div class="features-hint">
          <span class="feature-item">AI SEO 分析</span>
          <span class="feature-item">即時報告</span>
          <span class="feature-item">智能建議</span>
        </div>
      </div>
    </div>
    
    <!-- 速率限制提示 -->
    <RateLimitNotice 
      :show="showRateLimit" 
      :message="rateLimitMessage"
      :auto-retry-delay="retryDelay"
      @retry="handleRetry"
      @auto-retry="handleAutoRetry"
    />
  </div>
</template>

<script setup lang="ts">
import { SignIn } from '@clerk/vue'
import { ref, onMounted, onUnmounted } from 'vue'
import RateLimitNotice from '@/components/RateLimitNotice.vue'
import { clerkRateLimit, handleClerkError } from '@/utils/clerkRateLimit'

// 速率限制狀態
const showRateLimit = ref(false)
const rateLimitMessage = ref('')
const retryDelay = ref(0)

// 監聽全域錯誤事件
window.addEventListener('error', (event) => {
  const error = event.error
  if (error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
    handleRateLimitError(error)
  }
})

function handleRateLimitError(error: any) {
  showRateLimit.value = true
  rateLimitMessage.value = handleClerkError(error)
  retryDelay.value = clerkRateLimit.getSuggestedWaitTime()
}

function handleRetry() {
  showRateLimit.value = false
  // 重新載入頁面或重試操作
  window.location.reload()
}

function handleAutoRetry() {
  showRateLimit.value = false
  // 自動重試邏輯
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

// 🔧 優化後的樣式應用 - 使用 CSS 注入減少 DOM 查詢
onMounted(() => {
  console.log('📝 登入頁面：使用優化的樣式注入方式')
  
  // 💡 使用 CSS 注入（最高效）
  injectOptimizedSignInCSS()
  
  // 💡 監控 DOM 變化，僅在必要時應用樣式
  watchForSignInElements()
})

// 清理函數
onUnmounted(() => {
  cleanupSignInOptimizations()
})

/**
 * 注入優化的 CSS 樣式（登入頁面）
 */
function injectOptimizedSignInCSS() {
  const cssId = 'clerk-signin-optimized-styles'
  
  if (document.getElementById(cssId)) {
    return
  }

  const css = `
    /* 🎨 Clerk 登入頁面優化樣式 */
    .cl-socialButtonsBlockButton,
    .cl-socialButtons button {
      width: 44px !important;
      height: 44px !important;
      min-width: 44px !important;
      max-width: 44px !important;
      padding: 6px !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-right: 8px !important;
      box-sizing: border-box !important;
    }
    
    .cl-socialButtonsBlockButton *,
    .cl-socialButtons button * {
      width: 18px !important;
      height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      font-size: 18px !important;
      object-fit: contain !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .cl-formField {
      margin: 1.5rem auto !important;
      border: none !important;
      border-top: none !important;
      max-width: 350px !important;
      width: 100% !important;
    }
    
    .cl-formFieldLabel {
      margin-bottom: 0.5rem !important;
      margin-top: 0 !important;
      border: none !important;
      color: #374151 !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      text-align: left !important;
    }
    
    .cl-formFieldInput {
      width: 100% !important;
      height: 48px !important;
      padding: 12px 16px !important;
      border: 2px solid #d1d5db !important;
      border-radius: 8px !important;
      background: #ffffff !important;
      transition: border-color 0.2s ease !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
      box-sizing: border-box !important;
    }
    
    .cl-formFieldInput:focus {
      border: 2px solid #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
      outline: none !important;
    }
    
    .cl-formFieldInput:hover:not(:focus) {
      border: 2px solid #9ca3af !important;
    }
    
    .cl-dividerLine {
      display: none !important;
      height: 0 !important;
      background: none !important;
    }
    
    .cl-form,
    .cl-divider,
    [class*="cl-internal"] {
      border: none !important;
      border-top: none !important;
      border-bottom: none !important;
      box-shadow: none !important;
      outline: none !important;
    }
    
    /* 按鈕樣式由 scoped CSS 處理，避免衝突 */
  `

  const style = document.createElement('style')
  style.id = cssId
  style.textContent = css
  document.head.appendChild(style)
  
  console.log('✅ 登入頁面 CSS 樣式注入完成')
}

let signInObserver: MutationObserver | null = null
let isSignInProcessing = false

/**
 * 高效的 DOM 監控（登入頁面）
 */
function watchForSignInElements() {
  let timeoutId: number | null = null
  
  signInObserver = new MutationObserver(() => {
    if (isSignInProcessing) return
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      handleSignInElementsFound()
    }, 800)
  })

  signInObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  })
}

/**
 * 處理找到的 Clerk 元素（登入頁面）
 */
function handleSignInElementsFound() {
  if (isSignInProcessing) return
  isSignInProcessing = true
  
  try {
    // 簡化處理邏輯 - 不再創建自定義按鈕，讓 CSS 樣式自動應用
    console.log('🎯 登入頁面 Clerk 元素檢測完成，使用原生按鈕')
  } catch (error) {
    console.error('處理登入頁面 Clerk 元素時出錯:', error)
  } finally {
    isSignInProcessing = false
  }
}

/**
 * 清理登入頁面優化資源
 */
function cleanupSignInOptimizations() {
  if (signInObserver) {
    signInObserver.disconnect()
    signInObserver = null
  }
  
  const injectedStyle = document.getElementById('clerk-signin-optimized-styles')
  if (injectedStyle) {
    injectedStyle.remove()
  }
  
  console.log('🧹 清理登入頁面優化資源')
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--primary-bg);
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  z-index: 1;
}

.tech-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(102, 126, 234, 0.1) 0%, transparent 50%);
  animation: techFloat 8s ease-in-out infinite alternate;
}

.floating-orbs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: var(--gradient-primary);
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.auth-card {
  background: rgba(26, 31, 46, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 520px; /* 增加寬度以容納 Clerk 組件 */
  min-width: 400px; /* 設置最小寬度 */
  position: relative;
  z-index: 2;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 50px rgba(0, 212, 255, 0.1);
  /* 確保不會溢出 */
  box-sizing: border-box;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 20px 20px 0 0;
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.logo-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  z-index: 1;
}

.auth-title {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 0.75rem;
}

.auth-form {
  margin-bottom: 2rem;
  /* 恢復白色背景讓登入框更顯眼 */
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px) !important;
  border-radius: 16px !important;
  padding: 2rem !important; /* 恢復適當的內邊距 */
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
  /* 修復版面問題和對齊 */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: visible; /* 改為 visible 避免內容被裁切 */
  /* 確保內容居中 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 確保 Clerk 組件融入設計 */
.auth-form :deep(.cl-rootBox) {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow: visible !important;
  /* 確保組件居中 */
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.auth-form :deep(.cl-card) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow: visible !important;
  /* 內容居中 */
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

/* 修復 Clerk 內部容器樣式，避免雙層效果 */
.auth-form :deep([class*="cl-internal"]) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}

.auth-form :deep(.cl-internal-1wvh5g0) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  border-radius: 0 !important;
}

/* 確保所有表單元素居中 */
.auth-form :deep(.cl-main) {
  width: 100% !important;
  max-width: 350px !important; /* 與按鈕寬度保持一致 */
  margin: 0 auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

/* 隱藏 Clerk 預設標題，使用我們自己的 */
.auth-form :deep(.cl-headerTitle),
.auth-form :deep(.cl-headerSubtitle) {
  display: none !important;
}

/* 隱藏 Clerk 的註冊連結，因為我們有自己的 */
.auth-form :deep(.cl-footerActionLink),
.auth-form :deep(.cl-footer),
.auth-form :deep(.cl-footerAction) {
  display: none !important;
}

/* 強制顯示所有表單欄位 */
.auth-form :deep(.cl-formField),
.auth-form :deep(.cl-formField *),
.auth-form :deep(input),
.auth-form :deep(button) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* 特別針對密碼欄位 */
.auth-form :deep(input[type="password"]),
.auth-form :deep(.cl-formField:has(input[type="password"])),
.auth-form :deep(.cl-formField[data-localization-key*="password"]) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
}

/* 確保表單欄位和標籤正確顯示 */
.auth-form :deep(.cl-formField) {
  margin-bottom: 1.5rem !important;
  display: block !important;
  visibility: visible !important;
  width: 100% !important;
  max-width: 350px !important; /* 與按鈕寬度保持一致 */
  margin-left: auto !important;
  margin-right: auto !important;
  text-align: center !important;
  border: none !important; /* 移除邊框 */
  border-top: none !important; /* 特別移除上邊框 */
}

.auth-form :deep(.cl-formFieldLabel) {
  display: block !important;
  margin-bottom: 0.5rem !important;
  color: #374151 !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-align: left !important; /* 標籤靠左對齊 */
  width: 100% !important;
  border: none !important; /* 移除所有邊框 */
}

.auth-form :deep(.cl-formFieldInput) {
  width: 100% !important;
  height: 48px !important;
  padding: 0 1rem !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  font-size: 16px !important;
  color: #111827 !important;
  background: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  box-sizing: border-box !important;
  border-top: 1px solid #e5e7eb !important; /* 統一邊框 */
}

.auth-form :deep(.cl-formFieldInput:focus) {
  border-color: #228be6 !important;
  box-shadow: 0 0 0 3px rgba(34, 139, 230, 0.1) !important;
  outline: none !important;
}

/* 主要按鈕樣式 - 減少強制性，避免干擾 Clerk 功能 */
.auth-form :deep(.cl-formButtonPrimary) {
  width: 100%;
  max-width: 350px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 8px !important;
  color: white !important;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  box-sizing: border-box;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 保持按鈕原始文字和功能 */

.auth-form :deep(.cl-formButtonPrimary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 社交登入按鈕 */
.auth-form :deep(.cl-socialButtonsBlockButton),
.auth-form :deep(.cl-socialButtons .cl-socialButtonsBlockButton),
.auth-form :deep([data-localization-key*="socialButtonsBlockButton"]) {
  width: 48px !important; /* 縮小按鈕寬度 */
  height: 48px !important; /* 縮小按鈕高度 */
  min-width: 48px !important;
  max-width: 48px !important;
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  color: #374151 !important;
  font-weight: 500 !important;
  margin-bottom: 0 !important; /* 橫列排列時不需要底部間距 */
  margin-right: 8px !important; /* 添加右側間距 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important; /* 防止按鈕被壓縮 */
  padding: 8px !important; /* 確保圖標有適當間距 */
}

/* 調整社交按鈕內的圖標大小 - 使用更強的選擇器 */
.auth-form :deep(.cl-socialButtonsBlockButton svg),
.auth-form :deep(.cl-socialButtonsBlockButton img),
.auth-form :deep(.cl-socialButtons .cl-socialButtonsBlockButton svg),
.auth-form :deep(.cl-socialButtons .cl-socialButtonsBlockButton img),
.auth-form :deep(.cl-socialButtonsBlockButton *) {
  width: 20px !important; /* 縮小圖標 */
  height: 20px !important;
  max-width: 20px !important;
  max-height: 20px !important;
  object-fit: contain !important;
  margin: 0 !important;
}

.auth-form :deep(.cl-socialButtonsBlockButton:last-child) {
  margin-right: 0 !important; /* 最後一個按鈕不需要右側間距 */
}

.auth-form :deep(.cl-socialButtonsBlockButton:hover) {
  border-color: #228be6 !important;
  background: #f8f9fa !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* 確保所有表單區塊居中 */
.auth-form :deep(.cl-socialButtons),
.auth-form :deep(.cl-divider),
.auth-form :deep(.cl-form),
.auth-form :deep(.cl-formField) {
  width: 100% !important;
  max-width: 350px !important; /* 與按鈕寬度保持一致 */
  margin: 0 auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

/* 社交登入按鈕容器 */
.auth-form :deep(.cl-socialButtons) {
  gap: 12px !important;
  margin-bottom: 1rem !important; /* 稍微減少底部間距，因為有"或者"文字了 */
  /* 改為橫列排列 */
  display: flex !important;
  flex-direction: row !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  max-width: 350px !important; /* 與按鈕寬度保持一致 */
}

/* 分隔線樣式 - 保留"或者"文字但去掉線條 */
.auth-form :deep(.cl-divider) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 1.5rem auto !important;
  width: 100% !important;
  max-width: 350px !important;
}

.auth-form :deep(.cl-dividerLine) {
  display: none !important; /* 隱藏灰色線條 */
}

.auth-form :deep(.cl-dividerText) {
  display: block !important; /* 顯示"或者"文字 */
  color: #6b7280 !important;
  font-size: 14px !important;
  background: transparent !important; /* 移除背景色 */
  padding: 0 !important;
  text-align: center !important;
}

.auth-footer {
  text-align: center;
}

.divider {
  position: relative;
  margin: 2rem 0 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.divider-text {
  background: rgba(26, 31, 46, 0.9);
  color: var(--text-muted);
  padding: 0 1rem;
  font-size: 0.875rem;
  position: relative;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
}

.auth-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: width 0.3s ease;
}

.auth-link:hover::after {
  width: 100%;
}

.auth-link:hover {
  color: var(--secondary-color);
}

.features-hint {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.feature-item {
  background: rgba(0, 212, 255, 0.1);
  color: var(--primary-color);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

/* 動畫 */
@keyframes techFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10px, -10px) rotate(1deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.1; }
  50% { transform: translateY(-20px) scale(1.1); opacity: 0.2; }
}

/* 響應式設計 */
@media (max-width: 640px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 1.5rem 1rem; /* 減少 padding */
    max-width: 100%;
    min-width: unset; /* 移除最小寬度限制 */
    border-radius: 16px;
  }
  
  .auth-form {
    padding: 1rem; /* 進一步減少 padding */
  }
  
  .auth-title {
    font-size: 1.4rem;
  }
  
  .auth-subtitle {
    font-size: 0.9rem;
  }
  
  .logo-circle {
    width: 50px;
    height: 50px;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .features-hint {
    gap: 0.5rem;
  }
  
  .feature-item {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem 1rem;
  }
  
  .auth-title {
    font-size: 1.3rem;
  }
  
  .brand-logo {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .features-hint {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}

/* === 全域強制樣式 - 確保優先級最高 === */
.auth-form {
  /* 強制社交按鈕大小 */
  :deep(.cl-socialButtonsBlockButton) {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    max-width: 44px !important;
  }
  
  /* 強制圖標大小 */
  :deep(.cl-socialButtonsBlockButton svg),
  :deep(.cl-socialButtonsBlockButton img) {
    width: 18px !important;
    height: 18px !important;
    max-width: 18px !important;
    max-height: 18px !important;
  }
}

/* === 專注修復：社交登入按鈕大小 === */
.auth-form :deep(.cl-socialButtonsBlockButton),
.auth-form :deep(.cl-socialButtons button),
.auth-form :deep([data-localization-key*="socialButtonsBlockButton"]) {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  max-width: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  padding: 6px !important;
  border-radius: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 8px !important;
  box-sizing: border-box !important;
}

/* 強制縮小所有社交按鈕內的圖標和文字 */
.auth-form :deep(.cl-socialButtonsBlockButton *),
.auth-form :deep(.cl-socialButtons button *),
.auth-form :deep(.cl-socialButtonsBlockButton svg),
.auth-form :deep(.cl-socialButtonsBlockButton img),
.auth-form :deep(.cl-socialButtons button svg),
.auth-form :deep(.cl-socialButtons button img) {
  width: 18px !important;
  height: 18px !important;
  max-width: 18px !important;
  max-height: 18px !important;
  min-width: 18px !important;
  min-height: 18px !important;
  object-fit: contain !important;
  object-position: center !important;
  margin: 0 !important;
  padding: 0 !important;
  font-size: 18px !important;
  line-height: 1 !important;
}

.auth-form :deep(.cl-socialButtonsBlockButton:last-child) {
  margin-right: 0 !important;
}

/* === 移除灰色橫線和多餘邊框 === */
.auth-form :deep(.cl-form),
.auth-form :deep(.cl-form *),
.auth-form :deep(.cl-formField),
.auth-form :deep(.cl-formField *),
.auth-form :deep(.cl-formFieldLabel),
.auth-form :deep(.cl-formFieldInput),
.auth-form :deep(.cl-divider),
.auth-form :deep(.cl-dividerLine),
.auth-form :deep([class*="cl-internal"]),
.auth-form :deep([class*="cl-internal"]) {
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: none !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 特別針對表單區域的邊框移除 */
.auth-form :deep(.cl-form::before),
.auth-form :deep(.cl-form::after),
.auth-form :deep(.cl-formField::before),
.auth-form :deep(.cl-formField::after),
.auth-form :deep(.cl-divider::before),
.auth-form :deep(.cl-divider::after) {
  display: none !important;
  content: none !important;
}

/* 確保輸入框保持正常邊框 */
.auth-form :deep(.cl-formFieldInput) {
  border: 2px solid #d1d5db !important; /* 加粗邊框並使用更深的灰色 */
  border-radius: 8px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  padding: 12px 16px !important; /* 增加內邊距讓輸入框更舒適 */
  background: #ffffff !important;
  transition: border-color 0.2s ease !important;
}

/* 輸入框獲得焦點時的樣式 */
.auth-form :deep(.cl-formFieldInput:focus) {
  border: 2px solid #3b82f6 !important; /* 藍色邊框 */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important; /* 藍色外發光 */
  outline: none !important;
}

/* 輸入框懸停時的樣式 */
.auth-form :deep(.cl-formFieldInput:hover) {
  border: 2px solid #9ca3af !important; /* 懸停時稍深的灰色 */
}

/* 為電子郵件地址欄位加上上邊距 */
.auth-form :deep(.cl-formField) {
  margin-top: 1.5rem !important; /* 增加與上方"或者"文字的間距 */
  margin-bottom: 1.5rem !important;
}

/* 特別針對第一個表單欄位（通常是電子郵件） */
.auth-form :deep(.cl-formField:first-of-type),
.auth-form :deep(.cl-form .cl-formField:first-child) {
  margin-top: 1.5rem !important;
}

/* 為表單標籤也加上適當間距 */
.auth-form :deep(.cl-formFieldLabel) {
  margin-bottom: 0.5rem !important;
  margin-top: 0 !important;
}

/* 隱藏分隔線但保留文字 */
.auth-form :deep(.cl-dividerLine) {
  display: none !important;
  height: 0 !important;
  border: none !important;
  background: none !important;
}

/* === 自定義按鈕樣式 === */
.auth-form :deep(.custom-continue-btn) {
  /* 確保自定義按鈕樣式優先級 */
  width: 100% !important;
  height: 44px !important;
  margin-top: 1rem !important;
}

/* 重複樣式已移除 - 使用上方的主要按鈕樣式 */

/* 新用戶提示樣式 */
.new-user-notice {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
}

.notice-text {
  color: var(--text-primary);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.notice-text strong {
  color: var(--primary-color);
  font-weight: 600;
}



/* API 限制提示樣式 */
.rate-limit-notice {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
}

</style>