<template>
  <nav class="app-navbar">
    <div class="navbar-container">
      <!-- Logo 和品牌 -->
      <div class="navbar-brand">
        <div class="brand-logo">
          <div class="nav-logo-circle">
            <span class="nav-logo-text">L</span>
          </div>
          <h1 class="brand-title">LeadIO AI</h1>
        </div>
      </div>
      
      <!-- 導航選單 -->
      <div class="navbar-menu">
        <router-link to="/dashboard" class="nav-item">
          <span class="nav-text">儀表板</span>
        </router-link>
        <router-link to="/analysis" class="nav-item">
          <span class="nav-text">SEO分析</span>
        </router-link>
        <router-link to="/reports" class="nav-item">
          <span class="nav-text">複盈報告</span>
        </router-link>
        <router-link to="/history" class="nav-item">
          <span class="nav-text">整合分享</span>
        </router-link>
        <a href="#" class="nav-item" @click.prevent="showConsultation">
          <span class="nav-text">顧問諮詢</span>
        </a>
      </div>
      
      <!-- 用戶選單和動作 -->
      <div class="navbar-actions">
        <button class="action-btn consultation-btn" @click="showConsultation">
          立即預約
        </button>
        <div class="user-menu">
          <button @click="handleSignOut" class="sign-out-btn">
            <span>登出</span>
          </button>
        </div>
      </div>
      
      <!-- 手機版選單按鈕 -->
      <div class="mobile-menu-btn" @click="toggleMobileMenu">
        <span class="hamburger"></span>
        <span class="hamburger"></span>
        <span class="hamburger"></span>
      </div>
    </div>
    
    <!-- 手機版選單 -->
    <div class="mobile-menu" :class="{ 'is-open': isMobileMenuOpen }">
      <div class="mobile-nav-items">
        <router-link to="/dashboard" class="mobile-nav-item" @click="closeMobileMenu">
          儀表板
        </router-link>
        <router-link to="/analysis" class="mobile-nav-item" @click="closeMobileMenu">
          SEO分析
        </router-link>
        <router-link to="/reports" class="mobile-nav-item" @click="closeMobileMenu">
          複盈報告
        </router-link>
        <router-link to="/history" class="mobile-nav-item" @click="closeMobileMenu">
          整合分享
        </router-link>
        <a href="#" class="mobile-nav-item" @click.prevent="showConsultation">
          顧問諮詢
        </a>
        <div class="mobile-actions">
          <button class="mobile-consultation-btn" @click="showConsultation">
            立即預約
          </button>
          <button @click="handleSignOut" class="mobile-sign-out-btn">
            登出
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@clerk/vue'

const { signOut } = useAuth()
const isMobileMenuOpen = ref(false)

const handleSignOut = () => {
  signOut.value()
}

const showConsultation = () => {
  alert('顧問諮詢功能開發中！敬請期待')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.app-navbar {
  background: var(--secondary-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* 品牌區域 */
.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.nav-logo-circle {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.nav-logo-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  z-index: 1;
}

.brand-title {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 導航選單 */
.navbar-menu {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.nav-item:hover::before,
.nav-item.router-link-active::before {
  opacity: 0.1;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--primary-color);
  transform: translateY(-2px);
}

.nav-text {
  font-size: 0.95rem;
}

/* 用戶操作區域 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-primary);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
}

.consultation-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-menu {
  display: flex;
  align-items: center;
}

.sign-out-btn {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.sign-out-btn:hover {
  color: var(--error-color);
  border-color: var(--error-color);
  background: rgba(255, 82, 82, 0.1);
}



/* 手機版選單按鈕 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.mobile-menu-btn:hover {
  background: var(--accent-bg);
}

.hamburger {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 1px;
  transition: all 0.3s ease;
}

/* 手機版選單 */
.mobile-menu {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: var(--secondary-bg);
  border-top: 1px solid var(--border-color);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  backdrop-filter: blur(20px);
}

.mobile-menu.is-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav-items {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-bg);
  border: 1px solid var(--border-color);
}

.mobile-nav-item:hover,
.mobile-nav-item.router-link-active {
  color: var(--primary-color);
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--primary-color);
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.mobile-consultation-btn {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-sign-out-btn {
  background: transparent;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-sign-out-btn:hover {
  background: rgba(255, 82, 82, 0.1);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }
  
  .navbar-menu,
  .navbar-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .brand-title {
    font-size: 1.3rem;
  }
  
  .nav-logo-circle {
    width: 36px;
    height: 36px;
  }
  
  .nav-logo-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    height: 60px;
    padding: 0 1rem;
  }
  
  .brand-title {
    font-size: 1.2rem;
  }
  
  .mobile-nav-items {
    padding: 1.5rem 1rem;
  }
}

/* 動畫效果 */
@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.nav-item,
.mobile-nav-item {
  animation: slideIn 0.3s ease;
}
</style> 