<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- 品牌標題 -->
      <div class="auth-header">
        <h1 class="auth-title">歡迎回到 LeadIO</h1>
        <p class="auth-subtitle">登入您的帳戶以開始分析</p>
      </div>

      <!-- Clerk 登入組件 -->
      <div class="auth-form">
        <SignIn 
          :appearance="{
            elements: {
              rootBox: 'clerk-root',
              card: 'clerk-card',
              headerTitle: 'clerk-header',
              formButtonPrimary: 'clerk-button'
            }
          }"
        />
      </div>

      <!-- 註冊連結 -->
      <div class="auth-footer">
        <p>
          還沒有帳戶？
          <router-link to="/sign-up" class="auth-link">
            立即註冊
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SignIn } from '@clerk/vue'
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.auth-card {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.auth-form {
  margin-bottom: 2rem;
}

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.auth-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

/* Clerk 組件自訂樣式 */
:deep(.clerk-root) {
  width: 100%;
}

:deep(.clerk-card) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.clerk-header) {
  display: none; /* 隱藏 Clerk 預設標題，使用我們自己的 */
}

:deep(.clerk-button) {
  background: #3498db !important;
  border-radius: 8px !important;
  height: 44px !important;
  font-weight: 500 !important;
  transition: all 0.2s !important;
}

:deep(.clerk-button:hover) {
  background: #2980b9 !important;
  transform: translateY(-1px);
}

/* 輸入框樣式 */
:deep(.cl-formFieldInput) {
  border-radius: 8px !important;
  border: 2px solid #ecf0f1 !important;
  height: 44px !important;
}

:deep(.cl-formFieldInput:focus) {
  border-color: #3498db !important;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 2rem 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
}
</style> 