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
          :appearance="{
            elements: {
              rootBox: 'clerk-root',
              card: 'clerk-card',
              headerTitle: 'clerk-header',
              headerSubtitle: 'clerk-subtitle',
              formButtonPrimary: 'clerk-button',
              formFieldInput: 'clerk-input',
              formFieldLabel: 'clerk-label'
            }
          }"
        />
      </div>

      <!-- 登入連結 -->
      <div class="auth-footer">
        <div class="divider">
          <span class="divider-text">或</span>
        </div>
        <p class="footer-text">
          已有帳戶？
          <router-link to="/sign-in" class="auth-link">
            立即登入分析
          </router-link>
        </p>
        <div class="benefits-hint">
          <div class="benefit-item">
            <div class="benefit-marker"></div>
            <span class="benefit-text">精準 SEO 診斷</span>
          </div>
          <div class="benefit-item">
            <div class="benefit-marker"></div>
            <span class="benefit-text">即時優化建議</span>
          </div>
          <div class="benefit-item">
            <div class="benefit-marker"></div>
            <span class="benefit-text">數據驅動成長</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SignUp } from '@clerk/vue'
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
  /* 表單區域使用亮色主題 */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
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

/* Clerk 組件完全自訂樣式 */
:deep(.clerk-root) {
  width: 100%;
}

:deep(.clerk-card) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.clerk-header) {
  display: none !important;
}

:deep(.clerk-subtitle) {
  display: none !important;
}

/* 隱藏 Clerk 默認標題 */
:deep(.cl-headerTitle) {
  display: none !important;
}

:deep(.cl-headerSubtitle) {
  display: none !important;
}

:deep(.cl-socialButtonsBlockButton__facebook) {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  height: 48px !important;
  transition: all 0.3s ease !important;
  margin-bottom: 8px !important;
  color: #374151 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

:deep(.cl-socialButtonsBlockButton__google) {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  height: 48px !important;
  transition: all 0.3s ease !important;
  margin-bottom: 8px !important;
  color: #374151 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

:deep(.cl-socialButtonsBlockButton__facebook:hover),
:deep(.cl-socialButtonsBlockButton__google:hover) {
  border-color: #228be6 !important;
  background: #f8f9fa !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

:deep(.cl-formButtonPrimary) {
  background: var(--gradient-primary) !important;
  border: none !important;
  border-radius: 8px !important;
  height: 48px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  transition: all 0.3s ease !important;
  width: 100% !important;
  cursor: pointer !important;
  box-shadow: var(--shadow-primary) !important;
}

:deep(.cl-formButtonPrimary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4) !important;
}

:deep(.cl-formFieldInput) {
  background: #ffffff !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  height: 48px !important;
  padding: 0 16px !important;
  font-size: 16px !important;
  transition: all 0.3s ease !important;
  width: 100% !important;
  color: #111827 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

:deep(.cl-formFieldInput:focus) {
  border-color: #228be6 !important;
  box-shadow: 0 0 0 3px rgba(34, 139, 230, 0.1) !important;
  outline: none !important;
  background: #ffffff !important;
}

:deep(.cl-formFieldLabel) {
  color: #374151 !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  margin-bottom: 6px !important;
}

:deep(.cl-dividerLine) {
  background: #e5e7eb !important;
  height: 1px !important;
  margin: 20px 0 !important;
}

:deep(.cl-dividerText) {
  color: #6b7280 !important;
  font-size: 14px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  padding: 0 16px !important;
}

:deep(.cl-formField) {
  margin-bottom: 20px !important;
}

:deep(.cl-footerActionLink) {
  color: #228be6 !important;
  text-decoration: none !important;
  font-weight: 500 !important;
}

:deep(.cl-footerActionLink:hover) {
  color: #1e40af !important;
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
</style> 