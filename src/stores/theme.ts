import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeConfig } from '@/types'

export const useThemeStore = defineStore('theme', () => {
  // 當前主題狀態 - 只支援兩種主題
  const currentTheme = ref<'dark' | 'light'>('dark') // 預設為暗色主題
  
  // 主題配置
  const themeConfig = computed<ThemeConfig>(() => ({
    isDark: currentTheme.value !== 'light'
  }))
  
  // 主題名稱
  const themeName = computed<'dark' | 'light'>(() => 
    currentTheme.value
  )
  
  // 相容性屬性
  const isDark = computed(() => currentTheme.value !== 'light')
  
  // 從 localStorage 讀取已保存的主題設定
  const initTheme = () => {
    const savedTheme = localStorage.getItem('leadio-theme') as string | null
    
    // 強制清理任何非標準主題，確保只有 light 和 dark
    if (savedTheme !== 'light' && savedTheme !== 'dark') {
      // 清除舊的主題設定，包括 cosmic 或其他無效值
      localStorage.removeItem('leadio-theme')
      console.log('已清除舊的主題設定:', savedTheme)
      
      // 根據系統偏好設定預設主題
      currentTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      currentTheme.value = savedTheme as 'dark' | 'light'
    }
    
    applyTheme()
  }
  
  // 切換主題 (在兩個主題間切換)
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme()
    saveTheme()
  }
  
  // 設定主題
  const setTheme = (theme: 'light' | 'dark') => {
    currentTheme.value = theme
    applyTheme()
    saveTheme()
  }
  
  // 應用主題到 DOM
  const applyTheme = () => {
    const root = document.documentElement
    
    if (currentTheme.value === 'dark') {
      // 暗色主題 - 深邃科技感漸變
      root.style.setProperty('--primary-bg', 'radial-gradient(ellipse at top left, rgba(102, 126, 234, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(0, 212, 255, 0.06) 0%, transparent 50%), linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)')
      root.style.setProperty('--secondary-bg', 'linear-gradient(145deg, rgba(26, 31, 46, 0.95) 0%, rgba(36, 43, 61, 0.95) 100%)')
      root.style.setProperty('--accent-bg', 'linear-gradient(135deg, rgba(36, 43, 61, 0.8) 0%, rgba(26, 31, 46, 0.9) 100%)')
      root.style.setProperty('--primary-color', '#00d4ff')
      root.style.setProperty('--secondary-color', '#4fc3f7')
      root.style.setProperty('--success-color', '#00e676')
      root.style.setProperty('--warning-color', '#ffab40')
      root.style.setProperty('--error-color', '#ff5252')
      root.style.setProperty('--text-primary', '#ffffff')
      root.style.setProperty('--text-secondary', '#b3c5ef')
      root.style.setProperty('--text-muted', '#8892b0')
      root.style.setProperty('--border-color', '#2d3748')
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #00d4ff 100%)')
      root.style.setProperty('--gradient-card', 'linear-gradient(145deg, #1a1f2e 0%, #242b3d 100%)')
      root.style.setProperty('--shadow-primary', '0 20px 40px rgba(0, 212, 255, 0.1)')
      root.style.setProperty('--shadow-card', '0 8px 32px rgba(0, 0, 0, 0.3)')
      root.style.setProperty('--shadow-hover', '0 8px 25px rgba(0, 212, 255, 0.2)')
    } else if (currentTheme.value === 'light') {
      // 亮色主題 - 清新科技感漸變
      root.style.setProperty('--primary-bg', 'radial-gradient(ellipse at top left, rgba(34, 139, 230, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(102, 126, 234, 0.03) 0%, transparent 50%), linear-gradient(135deg, #fafbfc 0%, #f8f9fa 50%, #fafbfc 100%)')
      root.style.setProperty('--secondary-bg', 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)')
      root.style.setProperty('--accent-bg', 'linear-gradient(135deg, rgba(248, 249, 250, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)')
      root.style.setProperty('--primary-color', '#228be6')
      root.style.setProperty('--secondary-color', '#339af0')
      root.style.setProperty('--success-color', '#51cf66')
      root.style.setProperty('--warning-color', '#ffd43b')
      root.style.setProperty('--error-color', '#ff6b6b')
      root.style.setProperty('--text-primary', '#212529')
      root.style.setProperty('--text-secondary', '#495057')
      root.style.setProperty('--text-muted', '#6c757d')
      root.style.setProperty('--border-color', '#e9ecef')
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #228be6 0%, #339af0 100%)')
      root.style.setProperty('--gradient-card', 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)')
      root.style.setProperty('--shadow-primary', '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)')
      root.style.setProperty('--shadow-card', '0 1px 3px rgba(0, 0, 0, 0.05)')
      root.style.setProperty('--shadow-hover', '0 4px 12px rgba(0, 0, 0, 0.1)')
    }
    
    // 更新 data-theme 屬性
    root.setAttribute('data-theme', currentTheme.value)
  }
  
  // 保存主題設定到 localStorage
  const saveTheme = () => {
    localStorage.setItem('leadio-theme', currentTheme.value)
  }
  
  // 監聽系統主題變化
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // 只有在沒有手動設定主題時才跟隨系統
      if (!localStorage.getItem('leadio-theme')) {
        currentTheme.value = e.matches ? 'dark' : 'light'
        applyTheme()
      }
    })
  }
  
  return {
    currentTheme,
    isDark,
    themeConfig,
    themeName,
    initTheme,
    toggleTheme,
    setTheme,
    applyTheme,
    watchSystemTheme
  }
})