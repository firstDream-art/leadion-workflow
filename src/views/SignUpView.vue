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
          <h1 class="auth-title">加入 LeadIO AI</h1>
        </div>
        <p class="auth-subtitle">建立您的帳戶，開始 AI 驅動的 SEO 分析之旅</p>
      </div>

      <!-- Clerk 註冊組件 -->
      <div class="auth-form">
        <SignUp 
          :redirect-url="'/dashboard'"
          :routing="'hash'"
          :fallback-redirect-url="'/dashboard'"
          :sign-in-url="'/sign-in'"
        />
      </div>

      <!-- 登入連結 -->
      <div class="auth-footer">
        <div class="divider">
          <span class="divider-text">或</span>
        </div>
        
        <!-- 已有帳戶提示 -->
        <div class="existing-user-notice">
          <p class="notice-text">
            <strong>已有帳戶？</strong>請直接使用您的帳戶登入。
          </p>
        </div>
        
        <p class="footer-text">
          已經有帳戶了？
          <router-link to="/sign-in" class="auth-link">
            立即登入
          </router-link>
        </p>
        <div class="features-hint">
          <span class="feature-item">AI SEO 分析</span>
          <span class="feature-item">即時報告</span>
          <span class="feature-item">智能建議</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SignUp } from '@clerk/vue'
import { onMounted, onUnmounted } from 'vue'

// 🔧 優化後的樣式應用 - 使用 CSS 注入減少 DOM 查詢
onMounted(() => {
  console.log('📝 註冊頁面：使用優化的樣式注入方式')
  
  // 💡 方法一：使用 CSS 注入（推薦）
  injectOptimizedCSS()
  
  // 💡 方法二：監控 DOM 變化，僅在必要時應用樣式
  watchForClerkElements()
})

// 清理函數
onUnmounted(() => {
  cleanupOptimizations()
})

/**
 * 注入優化的 CSS 樣式（最高效的方法）
 */
function injectOptimizedCSS() {
  const cssId = 'clerk-signup-optimized-styles'
  
  // 避免重複注入
  if (document.getElementById(cssId)) {
    return
  }

  const css = `
    /* �� Clerk 註冊頁面優化樣式 */
    
    /* 🔥 隱藏造成排版問題的箭頭圖標 - 增強版 */
    .cl-buttonArrowIcon,
    svg.cl-buttonArrowIcon,
    .cl-formButtonPrimary .cl-buttonArrowIcon,
    .cl-formButtonPrimary svg,
    [class*="cl-buttonArrow"],
    [class*="cl-internal"] svg[class*="Arrow"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
    }
    
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
    
    /* 🎯 自定義按鈕樣式 */
    .custom-continue-btn {
      width: 100% !important;
      height: 44px !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      border: none !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-family: inherit !important;
      margin: 1rem auto !important;
      padding: 0 !important;
      max-width: 350px !important;
    }
    
    .custom-continue-btn:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
    }
    
    /* 隱藏原始 Clerk 按鈕 */
    .cl-formButtonPrimary {
      display: none !important;
    }
  `

  const style = document.createElement('style')
  style.id = cssId
  style.textContent = css
  document.head.appendChild(style)
  
  console.log('✅ CSS 樣式注入完成，大幅減少 DOM 查詢')
}

let observer: MutationObserver | null = null
let isProcessing = false

/**
 * 高效的 DOM 監控和樣式應用
 */
function watchForClerkElements() {
  // 防抖處理，避免過頻繁的處理
  let timeoutId: number | null = null
  
  observer = new MutationObserver(() => {
    if (isProcessing) return
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      handleClerkElementsFound()
    }, 800) // 增加防抖延遲
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false // 只監控結構變化，不監控屬性
  })
}

/**
 * 處理找到的 Clerk 元素（僅必要操作）
 */
function handleClerkElementsFound() {
  if (isProcessing) return
  isProcessing = true
  
  try {
    // 只處理按鈕替換（最關鍵的功能）
    const primaryButtons = document.querySelectorAll('.cl-formButtonPrimary:not(.processed)')
    
    if (primaryButtons.length > 0) {
      console.log(`🎯 發現 ${primaryButtons.length} 個需要處理的按鈕`)
      
      primaryButtons.forEach(button => {
        createCustomButton(button as HTMLElement)
        button.classList.add('processed') // 標記已處理
      })
    }
  } catch (error) {
    console.error('處理 Clerk 元素時出錯:', error)
  } finally {
    isProcessing = false
  }
}

/**
 * 創建自定義按鈕（最小化 DOM 操作）
 */
function createCustomButton(originalButton: HTMLElement) {
  // 檢查是否已經處理過
  if (originalButton.parentNode?.querySelector('.custom-continue-btn')) {
    return
  }
  
  // 隱藏原按鈕
  originalButton.style.display = 'none'
  
  // 創建新按鈕
  const customButton = document.createElement('button')
  customButton.textContent = '註冊'
  customButton.className = 'custom-continue-btn'
  
  // 點擊事件
  customButton.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🚀 觸發 Clerk 註冊')
    originalButton.click()
  }, { passive: false })
  
  // 插入按鈕
  originalButton.parentNode?.insertBefore(customButton, originalButton)
}

/**
 * 清理優化相關資源
 */
function cleanupOptimizations() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  
  // 移除注入的 CSS
  const injectedStyle = document.getElementById('clerk-signup-optimized-styles')
  if (injectedStyle) {
    injectedStyle.remove()
  }
  
  console.log('🧹 清理註冊頁面優化資源')
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
  max-width: 480px;
  position: relative;
  z-index: 2;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 50px rgba(0, 212, 255, 0.1);
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
  /* 恢復白色背景讓註冊框更顯眼 */
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

/* 確保 Clerk 組件融入設計並居中對齊 */
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

/* 隱藏 Clerk 預設標題，使用我們自己的 */
.auth-form :deep(.cl-headerTitle),
.auth-form :deep(.cl-headerSubtitle) {
  display: none !important;
}

/* 隱藏 Clerk 的登入連結，因為我們有自己的 */
.auth-form :deep(.cl-footerActionLink),
.auth-form :deep(.cl-footer),
.auth-form :deep(.cl-footerAction) {
  display: none !important;
}

/* 確保表單欄位沒有多餘的邊框 */
.auth-form :deep(.cl-formField) {
  margin-bottom: 1.5rem !important;
  display: block !important;
  visibility: visible !important;
  width: 100% !important;
  max-width: 350px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  border: none !important; /* 移除所有邊框 */
  border-top: none !important; /* 特別移除上邊框 */
}

.auth-form :deep(.cl-formFieldLabel) {
  display: block !important;
  margin-bottom: 0.5rem !important;
  color: #374151 !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-align: left !important;
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
}

.auth-form :deep(.cl-formFieldInput:focus) {
  border-color: #228be6 !important;
  box-shadow: 0 0 0 3px rgba(34, 139, 230, 0.1) !important;
  outline: none !important;
}

/* 主要按鈕樣式 */
.auth-form :deep(.cl-formButtonPrimary) {
  width: 100% !important;
  max-width: 350px !important; /* 稍微減小最大寬度確保居中 */
  height: 52px !important; /* 稍微增加高度給文字更多空間 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #00d4ff 100%) !important;
  border: none !important;
  border-radius: 8px !important;
  color: transparent !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2) !important;
  transition: all 0.3s ease !important;
  box-sizing: border-box !important;
  margin: 0 auto 2rem auto !important; /* 確保按鈕居中並添加底部間距 */
  display: flex !important; /* 改用 flex 布局確保文字居中 */
  align-items: center !important;
  justify-content: center !important;
  /* 隱藏原始文字 */
  text-indent: -9999px !important;
  position: relative !important;
  overflow: visible !important; /* 確保文字不被截斷 */
  /* 確保按鈕文字正確顯示 */
  font-family: inherit !important;
  line-height: 1.2 !important;
  letter-spacing: 0.5px !important;
}

/* 🔥 強制隱藏按鈕箭頭圖標 - 備用方案 */
.auth-form :deep(.cl-buttonArrowIcon),
.auth-form :deep(svg.cl-buttonArrowIcon),
.auth-form :deep(.cl-formButtonPrimary .cl-buttonArrowIcon),
.auth-form :deep(.cl-formButtonPrimary svg),
.auth-form :deep([class*="cl-buttonArrow"]),
.auth-form :deep([class*="cl-internal"] svg[class*="Arrow"]) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
}

/* 修改按鈕文字為"註冊" - 優化版本 */
.auth-form :deep(.cl-formButtonPrimary::after) {
  content: '註冊' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: white !important;
  background: transparent !important;
  border: none !important;
  z-index: 10 !important; /* 提高 z-index 確保顯示在最上層 */
  pointer-events: none !important; /* 不阻擋點擊事件 */
}

/* 強制隱藏原始文字，但不影響偽元素 */
.auth-form :deep(.cl-formButtonPrimary) {
  font-size: 0 !important; /* 隱藏文字但保持按鈕功能 */
  line-height: 0 !important;
}

.auth-form :deep(.cl-formButtonPrimary > *) {
  opacity: 0 !important;
  visibility: hidden !important;
}

.auth-form :deep(.cl-formButtonPrimary:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4) !important;
}

/* 社交登入按鈕 */
.auth-form :deep(.cl-socialButtonsBlockButton) {
  width: 48px !important; /* 縮小按鈕寬度 */
  height: 48px !important; /* 縮小按鈕高度 */
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  color: #374151 !important;
  font-weight: 500 !important;
  margin-bottom: 0 !important; /* 橫列排列時不需要底部間距 */
  margin-right: 8px !important; /* 添加右側間距 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important; /* 防止按鈕被壓縮 */
}

/* 調整社交按鈕內的圖標大小 */
.auth-form :deep(.cl-socialButtonsBlockButton svg),
.auth-form :deep(.cl-socialButtonsBlockButton img) {
  width: 20px !important; /* 縮小圖標 */
  height: 20px !important;
  object-fit: contain !important;
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
  margin-bottom: 2rem;
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

.benefits-hint {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0, 212, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  transition: all 0.3s ease;
}

.benefit-item:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.4);
  transform: translateY(-2px);
}

.benefit-marker {
  width: 12px;
  height: 12px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 12px;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.benefit-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
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
    padding: 2rem 1.5rem;
    max-width: 100%;
    border-radius: 16px;
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
  
  .benefit-item {
    padding: 0.6rem 0.8rem;
  }
  
  .benefit-text {
    font-size: 0.85rem;
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
  
  .benefit-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .benefit-marker {
    width: 10px;
    height: 10px;
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

/* 已有帳戶提示樣式 */
.existing-user-notice {
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

/* 功能提示樣式 */
.features-hint {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.feature-item {
  background: rgba(0, 212, 255, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(0, 212, 255, 0.2);
}



/* === 自定義按鈕樣式 === */
.auth-form :deep(.custom-continue-btn) {
  /* 確保自定義按鈕樣式優先級 */
  width: 100% !important;
  height: 44px !important;
  margin-top: 1rem !important;
}

/* 隱藏原本的 Clerk 按鈕 */
.auth-form :deep(.cl-formButtonPrimary) {
  display: none !important;
}




</style> 