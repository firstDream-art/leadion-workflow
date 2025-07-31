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
          <h1 class="auth-title">加入 Leadion AI</h1>
        </div>
        <p class="auth-subtitle">建立您的帳戶，開始 AI 驅動的 SEO 分析之旅</p>
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="error" class="error-message">
        <AlertCircle :size="16" />
        <span>{{ error }}</span>
      </div>

      <!-- 註冊方式切換 -->
      <div class="auth-tabs">
        <button 
          :class="['tab-button', { active: authMode === 'email' }]"
          @click="authMode = 'email'"
        >
          <Mail :size="18" />
          Email 註冊
        </button>
        <button 
          :class="['tab-button', { active: authMode === 'google' }]"
          @click="authMode = 'google'"
        >
          <Chrome :size="18" />
          Google 註冊
        </button>
      </div>

      <!-- Email 註冊 -->
      <div v-if="authMode === 'email'" class="auth-form">
        <form @submit.prevent="handleEmailSubmit">
          <!-- Email 輸入 -->
          <div v-if="!showCodeInput" class="form-group">
            <label for="email">Email 地址</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
              :disabled="isLoading"
              @input="clearError"
            />
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <Loader2 v-if="isLoading" :size="16" class="animate-spin" />
              發送驗證碼
            </button>
          </div>

          <!-- 驗證碼輸入 -->
          <div v-else class="form-group">
            <label for="code">驗證碼</label>
            <p class="verification-hint">我們已發送驗證碼到 {{ email }}</p>
            <input
              id="code"
              v-model="verificationCode"
              type="text"
              placeholder="輸入 6 位數驗證碼"
              maxlength="6"
              required
              :disabled="isLoading"
              @input="clearError"
            />
            <div class="button-group">
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <Loader2 v-if="isLoading" :size="16" class="animate-spin" />
                完成註冊
              </button>
              <button type="button" class="btn btn-secondary" @click="resetForm">
                重新輸入 Email
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Google 註冊 -->
      <div v-else-if="authMode === 'google'" class="auth-form">
        <div class="google-auth-section">
          <p class="google-description">使用您的 Google 帳戶快速註冊</p>
          <button 
            class="btn btn-google" 
            @click="handleGoogleSignUp"
            :disabled="isLoading"
          >
            <Chrome :size="20" />
            <Loader2 v-if="isLoading" :size="16" class="animate-spin" />
            使用 Google 註冊
          </button>
          <p class="google-note">我們會安全地處理您的 Google 帳戶資訊</p>
        </div>
      </div>

      <!-- 登入連結 -->
      <div class="auth-footer">
        <div class="divider">
          <span class="divider-text">或</span>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import { AlertCircle, Mail, Chrome, Loader2 } from 'lucide-vue-next'

// 認證相關狀態
const { sendVerificationCode, verifyCode, signInWithGoogle, isLoading, error, clearError, setError } = useAuth()
const router = useRouter()

// 表單狀態
const authMode = ref<'email' | 'google'>('email')
const email = ref('')
const verificationCode = ref('')
const showCodeInput = ref(false)

// Email 註冊流程
async function handleEmailSubmit() {
  if (!showCodeInput.value) {
    // 發送驗證碼
    try {
      await sendVerificationCode(email.value, 'registration')
      showCodeInput.value = true
    } catch (err) {
      console.error('發送驗證碼失敗:', err)
    }
  } else {
    // 驗證驗證碼並完成註冊
    try {
      await verifyCode(email.value, verificationCode.value, 'registration')
      // 成功後會自動導向 dashboard
    } catch (err) {
      console.error('註冊失敗:', err)
    }
  }
}

// Google 註冊 - 簡化版：直接跳轉
async function handleGoogleSignUp() {
  try {
    console.log('🚀 開始 Google 註冊流程（直接跳轉）...')
    
    // 獲取 Google OAuth URL
    const { authUrl } = await authService.getGoogleAuthUrl()
    console.log('✅ 取得 Google 授權 URL:', authUrl)
    
    // 直接跳轉到 Google OAuth（不使用彈窗）
    window.location.href = authUrl
    
  } catch (err) {
    console.error('❌ Google 註冊失敗:', err)
    setError('Google 註冊失敗，請稍後再試')
  }
}

// 重置表單
function resetForm() {
  showCodeInput.value = false
  verificationCode.value = ''
  clearError()
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-bg);
  overflow: hidden;
}

.tech-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    transparent 20%, 
    rgba(0, 212, 255, 0.03) 25%, 
    transparent 26%, 
    transparent 74%, 
    rgba(0, 212, 255, 0.03) 75%, 
    transparent 80%
  );
  background-size: 100px 100px;
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
  background: radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.3), rgba(79, 195, 247, 0.1));
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: -100px;
  animation-delay: -7s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 30%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(50px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.auth-card {
  background: rgba(26, 31, 46, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-primary);
}

.logo-text {
  color: white;
  font-size: 28px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
}

.auth-title {
  color: var(--text-primary);
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 8px 0 0 0;
  line-height: 1.5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 107, 107, 0.1);
  color: var(--error-color);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.2);
  margin-bottom: 20px;
  font-size: 14px;
}

.auth-tabs {
  display: flex;
  background: rgba(36, 43, 61, 0.5);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.tab-button.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
}

.tab-button:hover:not(.active) {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.auth-form {
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group label {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.form-group input {
  padding: 14px 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.verification-hint {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-primary);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.btn-google {
  background: white;
  color: #1f2937;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
}

.btn-google:hover:not(:disabled) {
  background: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 12px;
}

.button-group .btn {
  flex: 1;
}

.google-auth-section {
  text-align: center;
  padding: 20px 0;
}

.google-description {
  color: var(--text-secondary);
  margin-bottom: 16px;
  font-size: 14px;
}

.google-note {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 12px;
  line-height: 1.4;
}

.auth-footer {
  text-align: center;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider-text {
  margin: 0 16px;
  color: var(--text-muted);
  font-size: 14px;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

.features-hint {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.feature-item {
  color: var(--text-muted);
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .auth-card {
    padding: 24px;
    margin: 16px;
  }
  
  .auth-title {
    font-size: 28px;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>