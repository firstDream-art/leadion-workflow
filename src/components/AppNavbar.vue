<template>
  <nav class="app-navbar">
    <div class="navbar-container">
      <!-- Logo 和品牌 -->
      <div class="navbar-brand">
        <h1>LeadIO</h1>
      </div>
      
      <!-- 導航選單 -->
      <div class="navbar-menu">
        <router-link to="/dashboard" class="nav-item">
          儀表板
        </router-link>
        <router-link to="/analysis" class="nav-item">
          分析
        </router-link>
        <router-link to="/reports" class="nav-item">
          報告
        </router-link>
        <router-link to="/history" class="nav-item">
          歷史記錄
        </router-link>
      </div>
      
      <!-- 用戶選單 -->
      <div class="navbar-user">
        <button @click="handleSignOut" class="sign-out-btn">
          登出
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '@clerk/vue'

const { signOut } = useAuth()

const handleSignOut = () => {
  signOut.value()
}
</script>

<style scoped>
.app-navbar {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar-brand h1 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #1f2937;
  background-color: #f3f4f6;
}

.sign-out-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sign-out-btn:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .navbar-menu {
    gap: 1rem;
  }
  
  .nav-item {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
}
</style> 