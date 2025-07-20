import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 當前主題狀態
  const isDark = ref(true) // 預設為暗色主題
  
  // 主題名稱
  const themeName = computed(() => isDark.value ? 'dark' : 'light')
  
  // 從 localStorage 讀取已保存的主題設定
  const initTheme = () => {
    const savedTheme = localStorage.getItem('leadio-theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 檢查系統偏好設定
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }
  
  // 切換主題
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
    saveTheme()
  }
  
  // 設定主題
  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
    applyTheme()
    saveTheme()
  }
  
  // 應用主題到 DOM
  const applyTheme = () => {
    const root = document.documentElement
    
    if (isDark.value) {
      // 暗色主題變數
      root.style.setProperty('--primary-bg', '#0f1419')
      root.style.setProperty('--secondary-bg', '#1a1f2e')
      root.style.setProperty('--accent-bg', '#242b3d')
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
    } else {
      // 亮色主題變數 (LiblibAI 風格)
      root.style.setProperty('--primary-bg', '#fafbfc')
      root.style.setProperty('--secondary-bg', '#ffffff')
      root.style.setProperty('--accent-bg', '#f8f9fa')
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
    root.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }
  
  // 保存主題設定到 localStorage
  const saveTheme = () => {
    localStorage.setItem('leadio-theme', isDark.value ? 'dark' : 'light')
  }
  
  // 監聽系統主題變化
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // 只有在沒有手動設定主題時才跟隨系統
      if (!localStorage.getItem('leadio-theme')) {
        isDark.value = e.matches
        applyTheme()
      }
    })
  }
  
  return {
    isDark,
    themeName,
    initTheme,
    toggleTheme,
    setTheme,
    applyTheme,
    watchSystemTheme
  }
})