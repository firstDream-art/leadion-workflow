<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- 品牌標題 -->
      <div class="auth-header">
        <h1 class="auth-title">歡迎回到 LeadIO</h1>
        <p class="auth-subtitle">登入您的帳戶以開始分析</p>
      </div>

      <!-- 簡化登入表單 -->
      <div class="auth-form">
        <div class="form-group">
          <label>電子郵件</label>
          <input type="email" placeholder="請輸入您的電子郵件" />
        </div>
        <div class="form-group">
          <label>密碼</label>
          <input type="password" placeholder="請輸入您的密碼" />
        </div>
        <button class="login-btn" @click="handleLogin">登入</button>
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
const handleLogin = () => {
  alert('登入功能開發中，稍後會整合 Clerk 認證系統')
}
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
  max-width: 400px;
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.login-btn {
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background: #2980b9;
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
</style> 