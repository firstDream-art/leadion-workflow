<template>
  <div class="credit-display">
    <!-- 點數餘額顯示 -->
    <div class="credit-balance" :class="{ 'loading': isLoading, 'error': hasError }">
      <div class="credit-icon">
        <Coins :size="14" />
      </div>
      <div class="credit-info">
        <span class="credit-amount">{{ displayBalance }}</span>
        <span class="credit-label">點數</span>
      </div>
      <button 
        v-if="!isLoading && !hasError" 
        @click="refreshBalance" 
        class="refresh-btn"
        :disabled="isRefreshing"
      >
        <RotateCcw :size="10" :class="{ 'spinning': isRefreshing }" />
      </button>
    </div>

    <!-- 低點數警告 -->
    <div v-if="showLowBalanceWarning" class="low-balance-warning">
      <AlertTriangle :size="16" />
      <span>點數不足，請儲值</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Coins, RotateCcw, AlertTriangle } from 'lucide-vue-next'
import { creditService, type CreditBalance } from '@/services/creditService'

// Props
interface Props {
  autoRefresh?: boolean
  refreshInterval?: number
  lowBalanceThreshold?: number
  showWarning?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoRefresh: false, // 關閉自動刷新，只在需要時手動刷新
  refreshInterval: 30000,
  lowBalanceThreshold: 10,
  showWarning: true
})

// 響應式數據
const { user, isAuthenticated, isLoading: authLoading, isInitialized } = useAuth()
const balance = ref<CreditBalance | null>(null)
const isLoading = ref(false)
const isRefreshing = ref(false)
const hasError = ref(false)
const refreshTimer = ref<NodeJS.Timeout | null>(null)

// 計算屬性
const displayBalance = computed(() => {
  if (isLoading.value) return '...'
  if (hasError.value) return '--'
  return balance.value?.balance?.toLocaleString() || '0'
})

const showLowBalanceWarning = computed(() => {
  return props.showWarning && 
         balance.value && 
         balance.value.balance < props.lowBalanceThreshold &&
         !isLoading.value &&
         !hasError.value
})

const userEmail = computed(() => {
  console.log('🔍 計算 userEmail，當前 user:', user.value)
  
  if (!user.value?.email) {
    console.log('❌ 用戶 email 不存在')
    return null
  }
  
  console.log('✅ 用戶 email:', user.value.email)
  return user.value.email
})

// 方法
async function loadBalance() {
  try {
    hasError.value = false
    console.log('🚀 開始載入點數...')
    
    // 不傳 userEmail，使用當前用戶的點數
    const result = await creditService.getBalance()
    balance.value = result
    console.log(`💰 點數載入成功:`, result)
    console.log(`💰 餘額: ${result.balance} 點`)
  } catch (err) {
    console.error('❌ 載入點數失敗:', err)
    console.error('❌ 錯誤詳情:', err.response?.data || err.message)
    hasError.value = true
    balance.value = null
  }
}

async function refreshBalance() {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  try {
    await loadBalance()
  } finally {
    isRefreshing.value = false
  }
}

function startAutoRefresh() {
  if (!props.autoRefresh) return
  
  stopAutoRefresh()
  refreshTimer.value = setInterval(() => {
    if (!isRefreshing.value && userEmail.value) {
      loadBalance()
    }
  }, props.refreshInterval)
}

function stopAutoRefresh() {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = null
  }
}

// 初始化載入
async function initialize() {
  if (!isInitialized.value || !isAuthenticated.value) {
    console.log('⏳ 等待認證載入或用戶登入...', { isInitialized: isInitialized.value, isAuthenticated: isAuthenticated.value })
    return
  }
  
  console.log('🚀 開始初始化點數載入...')
  isLoading.value = true
  try {
    await loadBalance()
  } finally {
    isLoading.value = false
    startAutoRefresh()
  }
}

// 生命週期
onMounted(() => {
  // 如果是彈窗環境，跳過所有邏輯
  if (window.opener) {
    console.log('🪟 CreditDisplay 在彈窗中，跳過初始化')
    return
  }

  // 監聽認證載入狀態，當用戶準備好時初始化
  let hasInitialized = false
  const stopWatching = watch(
    [() => isInitialized?.value, () => isAuthenticated?.value],
    ([loaded, signedIn]) => {
      console.log('👀 Watch 觸發:', { loaded, signedIn, user: user?.value })
      
      if (loaded && signedIn && !hasInitialized) {
        console.log('✅ 條件滿足，開始初始化')
        hasInitialized = true
        initialize()
        // 延遲停止監聽，避免在回調中立即調用
        nextTick(() => {
          stopWatching()
        })
      } else if (loaded && !signedIn) {
        console.log('🚪 用戶未登入，跳轉到登入頁')
        // 可以在這裡處理未登入的情況
      }
    },
    { immediate: true }
  )

  // 🔄 監聽全局點數更新事件 - 只在執行扣點動作後觸發
  const handleGlobalCreditsUpdate = () => {
    console.log('🔄 收到全局點數更新事件，刷新餘額')
    if (isAuthenticated.value) {
      refreshBalance()
    }
  }
  
  window.addEventListener('credits-updated', handleGlobalCreditsUpdate)
  
  // 清理事件監聽器
  onUnmounted(() => {
    window.removeEventListener('credits-updated', handleGlobalCreditsUpdate)
  })
})

onUnmounted(() => {
  stopAutoRefresh()
})

// 導出方法供父組件使用
defineExpose({
  refresh: refreshBalance,
  balance: computed(() => balance.value)
})
</script>

<style scoped>
.credit-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.credit-balance {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--accent-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  min-width: 90px;
  max-width: 120px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.85rem;
  height: 32px;
}

.credit-balance.loading {
  opacity: 0.7;
}

.credit-balance.error {
  border-color: var(--error-color);
  background: rgba(255, 107, 107, 0.1);
}

.credit-balance:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.credit-icon {
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.credit-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.credit-amount {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.credit-label {
  font-size: 0.65rem;
  color: var(--text-secondary);
  line-height: 1;
}

.refresh-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 1px;
  border-radius: 3px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.refresh-btn:hover {
  color: var(--primary-color);
  background: rgba(0, 212, 255, 0.1);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.low-balance-warning {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 212, 59, 0.1);
  border: 1px solid var(--warning-color);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--warning-color);
}
</style>