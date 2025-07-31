<template>
  <div class="admin-dashboard">
    <!-- 無權限提示 -->
    <div v-if="!isUserAdmin" class="no-access">
      <div class="no-access-content">
        <div class="no-access-icon">
          <Shield :size="64" />
        </div>
        <h2>訪問受限</h2>
        <p>只有管理員才能訪問此頁面</p>
        <el-button @click="$router.push('/dashboard')">返回首頁</el-button>
      </div>
    </div>

    <!-- 管理後台內容 -->
    <div v-else class="admin-content">
      <div class="container">
        <!-- 頁面標題 -->
        <div class="admin-header">
          <h1 class="admin-title">
            <Settings :size="32" />
            管理後台
          </h1>
          <p class="admin-subtitle">系統管理和點數控制中心</p>
          <div class="admin-info">
            <el-tag type="success" size="large">
              <Crown :size="16" />
              管理員：{{ user?.email }}
            </el-tag>
          </div>
        </div>

        <!-- 統計卡片 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon users">
              <Users :size="24" />
            </div>
            <div class="stat-content">
              <h3>總用戶數</h3>
              <div class="stat-value">{{ stats.totalUsers }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon credits">
              <Coins :size="24" />
            </div>
            <div class="stat-content">
              <h3>總點數發放</h3>
              <div class="stat-value">{{ formatNumber(stats.totalCredits) }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon transactions">
              <Activity :size="24" />
            </div>
            <div class="stat-content">
              <h3>總交易筆數</h3>
              <div class="stat-value">{{ stats.totalTransactions }}</div>
            </div>
          </div>
        </div>

        <!-- 功能區域 -->
        <div class="admin-sections">
          <!-- 點數管理 -->
          <div class="admin-section">
            <div class="section-header">
              <h2>
                <Wallet :size="24" />
                點數管理
              </h2>
            </div>
            
            <div class="section-content">
              <!-- 快速操作 -->
              <div class="quick-actions">
                <el-card>
                  <template #header>
                    <span>快速調整點數</span>
                  </template>
                  
                  <el-form @submit.prevent="handleQuickCredit" class="quick-form">
                    <el-form-item label="用戶 Email">
                      <el-input 
                        v-model="quickCreditForm.email" 
                        placeholder="輸入用戶 Email"
                        type="email"
                      />
                    </el-form-item>
                    
                    <el-form-item label="點數調整">
                      <div class="credit-controls">
                        <el-input-number 
                          v-model="quickCreditForm.amount" 
                          :min="1" 
                          :max="10000"
                          placeholder="點數"
                        />
                        <el-radio-group v-model="quickCreditForm.type">
                          <el-radio-button value="add">增加</el-radio-button>
                          <el-radio-button value="deduct">扣除</el-radio-button>
                        </el-radio-group>
                      </div>
                    </el-form-item>
                    
                    <el-form-item label="備註">
                      <el-input 
                        v-model="quickCreditForm.description" 
                        placeholder="調整原因"
                      />
                    </el-form-item>
                    
                    <el-form-item>
                      <el-button 
                        type="primary" 
                        @click="handleQuickCredit"
                        :loading="isProcessing"
                      >
                        執行調整
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
              </div>

              <!-- 用戶列表 -->
              <div class="users-table">
                <el-card>
                  <template #header>
                    <div class="table-header">
                      <span>用戶點數列表</span>
                      <el-button @click="refreshUserList" :loading="isLoadingUsers">
                        <RotateCcw :size="16" />
                        刷新
                      </el-button>
                    </div>
                  </template>
                  
                  <el-table 
                    :data="usersList" 
                    v-loading="isLoadingUsers"
                    class="dark-table"
                    :class="{ 'dark-mode': isDark }"
                  >
                    <el-table-column prop="email" label="用戶 Email" min-width="200">
                      <template #default="{ row }">
                        <div class="user-email-cell">
                          {{ row.email }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="balance" label="當前餘額" width="120">
                      <template #default="{ row }">
                        <el-tag :type="row.balance > 50 ? 'success' : row.balance > 10 ? 'warning' : 'danger'">
                          {{ row.balance }} 點
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalPurchased" label="總購買" width="120" />
                    <el-table-column prop="totalUsed" label="總使用" width="120" />
                    <el-table-column label="操作" width="200">
                      <template #default="{ row }">
                        <el-button size="small" @click="viewUserTransactions(row.email)">
                          查看記錄
                        </el-button>
                        <el-button size="small" type="primary" @click="editUserCredits(row)">
                          調整點數
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用戶詳情對話框 -->
    <el-dialog v-model="showUserDialog" title="用戶詳細資訊" width="600px">
      <div v-if="selectedUser" class="user-details">
        <h3>{{ selectedUser.email }}</h3>
        <div class="user-stats">
          <div class="user-stat">
            <span class="label">當前餘額:</span>
            <span class="value">{{ selectedUser.balance }} 點</span>
          </div>
          <div class="user-stat">
            <span class="label">總購買:</span>
            <span class="value">{{ selectedUser.totalPurchased }} 點</span>
          </div>
          <div class="user-stat">
            <span class="label">總使用:</span>
            <span class="value">{{ selectedUser.totalUsed }} 點</span>
          </div>
        </div>
        
        <!-- 交易記錄 -->
        <div class="user-transactions">
          <h4>最近交易記錄</h4>
          <el-table :data="userTransactions" size="small">
            <el-table-column prop="type" label="類型" width="80">
              <template #default="{ row }">
                <el-tag :type="row.type === 'purchase' ? 'success' : 'warning'">
                  {{ row.type === 'purchase' ? '儲值' : '消費' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金額" width="80" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="createdAt" label="時間" width="120">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { isAdmin } from '@/config/admin'
import { creditService } from '@/services/creditService'
import { ElMessage } from 'element-plus'
import { useThemeStore } from '@/stores/theme'
import {
  Shield, Settings, Crown, Users, Coins, Activity, 
  Wallet, RotateCcw
} from 'lucide-vue-next'

// 認證狀態
const { user } = useAuth()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

// 管理員權限檢查
const isUserAdmin = computed(() => isAdmin(user.value?.email))

// 響應式數據
const stats = ref({
  totalUsers: 0,
  totalCredits: 0,
  totalTransactions: 0
})

const usersList = ref<any[]>([])
const isLoadingUsers = ref(false)
const isProcessing = ref(false)

// 快速調整表單
const quickCreditForm = ref({
  email: '',
  amount: 100,
  type: 'add' as 'add' | 'deduct',
  description: ''
})

// 用戶詳情對話框
const showUserDialog = ref(false)
const selectedUser = ref<any>(null)
const userTransactions = ref<any[]>([])

// 節流控制
const lastRefreshTime = ref(0)
const REFRESH_COOLDOWN = 15000 // 15秒冷卻時間 - 避免 429 錯誤

// 方法
function formatNumber(num: number): string {
  return num.toLocaleString()
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-TW')
}

async function refreshUserList() {
  // 檢查冷卻時間
  const now = Date.now()
  if (now - lastRefreshTime.value < REFRESH_COOLDOWN) {
    const remainingTime = Math.ceil((REFRESH_COOLDOWN - (now - lastRefreshTime.value)) / 1000)
    ElMessage.warning(`請等待 ${remainingTime} 秒後再重新整理`)
    return
  }
  
  try {
    isLoadingUsers.value = true
    lastRefreshTime.value = now
    
    const users = await creditService.getAllUsers()
    usersList.value = users
    
    // 計算統計數據
    stats.value = {
      totalUsers: users.length,
      totalCredits: users.reduce((sum, user) => sum + (user.totalPurchased || 0), 0),
      totalTransactions: users.reduce((sum, user) => sum + (user.transactionCount || 0), 0)
    }
    
    ElMessage.success('用戶列表已更新')
  } catch (error: any) {
    console.error('獲取用戶列表失敗:', error)
    
    if (error.response?.status === 429) {
      ElMessage.warning('⏰ 請求過於頻繁，請等待 15 秒後再試')
      // 強制延長冷卻時間
      lastRefreshTime.value = Date.now()
    } else if (error.message?.includes('請求過於頻繁')) {
      ElMessage.warning('🚧 系統忙碌中，請稍後再試')
    } else if (error.response?.status === 401) {
      ElMessage.error('🔒 認證失效，請重新登入')
    } else {
      ElMessage.error('❌ 獲取用戶列表失敗: ' + (error.message || '未知錯誤'))
    }
  } finally {
    isLoadingUsers.value = false
  }
}

async function handleQuickCredit() {
  if (!quickCreditForm.value.email || !quickCreditForm.value.amount) {
    ElMessage.warning('請填寫完整資訊')
    return
  }

  try {
    isProcessing.value = true
    
    // 獲取認證 token
    const authTokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}')
    const accessToken = authTokens.accessToken
    
    if (!accessToken) {
      ElMessage.error('認證已過期，請重新登入')
      return
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
    
    let response
    
    if (quickCreditForm.value.type === 'add') {
      // 增加點數
      response = await fetch(`http://localhost:3001/api/credits/${encodeURIComponent(quickCreditForm.value.email)}/purchase`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: quickCreditForm.value.amount,
          description: quickCreditForm.value.description || '管理員手動調整'
        })
      })
    } else {
      // 扣除點數
      response = await fetch(`http://localhost:3001/api/credits/${encodeURIComponent(quickCreditForm.value.email)}/deduct`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: quickCreditForm.value.amount,
          description: quickCreditForm.value.description || '管理員手動扣除'
        })
      })
    }
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }
    
    const result = await response.json()
    console.log('點數調整成功:', result)
    
    ElMessage.success('點數調整成功')
    quickCreditForm.value = { email: '', amount: 100, type: 'add', description: '' }
    refreshUserList()
    
  } catch (error) {
    console.error('點數調整失敗:', error)
    ElMessage.error(`點數調整失敗: ${error.message}`)
  } finally {
    isProcessing.value = false
  }
}

async function viewUserTransactions(email: string) {
  try {
    const user = usersList.value.find(u => u.email === email)
    selectedUser.value = user
    
    const transactions = await creditService.getTransactions(email, 20)
    userTransactions.value = transactions
    
    showUserDialog.value = true
  } catch (error) {
    ElMessage.error('獲取用戶交易記錄失敗')
  }
}

function editUserCredits(user: any) {
  quickCreditForm.value.email = user.email
}

// 生命週期
// 📌 只在進入管理後台頁面時載入一次用戶列表，不會背景自動刷新
onMounted(() => {
  if (isUserAdmin.value) {
    // 延遲載入避免與其他請求衝突
    setTimeout(() => {
      refreshUserList()
    }, 1000)
  }
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--primary-bg);
}

/* 無權限頁面 */
.no-access {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.no-access-content {
  text-align: center;
  background: var(--secondary-bg);
  padding: 3rem;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
}

.no-access-icon {
  color: var(--warning-color);
  margin-bottom: 1rem;
}

/* 管理後台內容 */
.admin-content {
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.admin-header {
  text-align: center;
  margin-bottom: 3rem;
}

.admin-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.admin-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.admin-info {
  display: flex;
  justify-content: center;
}

/* 統計卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--secondary-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.users {
  background: rgba(33, 150, 243, 0.1);
  color: var(--primary-color);
}

.stat-icon.credits {
  background: rgba(255, 171, 64, 0.1);
  color: var(--warning-color);
}

.stat-icon.transactions {
  background: rgba(0, 230, 118, 0.1);
  color: var(--success-color);
}

.stat-content h3 {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* 管理區域 */
.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-section {
  background: var(--secondary-bg);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-card);
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 快速操作 */
.quick-form {
  max-width: 500px;
}

.credit-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* 表格 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 用戶詳情 */
.user-details h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.user-stat {
  display: flex;
  justify-content: space-between;
}

.user-stat .label {
  color: var(--text-secondary);
}

.user-stat .value {
  font-weight: 600;
  color: var(--text-primary);
}

.user-transactions h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

/* 表格樣式優化 */
.user-email-cell {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  color: var(--text-primary);
  word-break: break-word;
  overflow-wrap: anywhere;
}

/* Element Plus 表格暗色模式樣式 */
:deep(.el-table) {
  --el-table-bg-color: var(--secondary-bg) !important;
  --el-table-tr-bg-color: var(--secondary-bg) !important;
  --el-table-header-bg-color: var(--accent-bg) !important;
  --el-table-row-hover-bg-color: var(--accent-bg) !important;
  --el-table-text-color: var(--text-primary) !important;
  --el-table-header-text-color: var(--text-primary) !important;
  --el-table-border-color: var(--border-color) !important;
  background-color: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
}

:deep(.el-table__inner-wrapper) {
  background-color: var(--secondary-bg) !important;
}

:deep(.el-table__header-wrapper) {
  background-color: var(--accent-bg) !important;
}

:deep(.el-table__body-wrapper) {
  background-color: var(--secondary-bg) !important;
}

:deep(.el-table th) {
  background-color: var(--accent-bg) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-color) !important;
}

:deep(.el-table td) {
  background-color: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-color) !important;
}

:deep(.el-table th.el-table__cell) {
  background-color: var(--accent-bg) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-color) !important;
}

:deep(.el-table td.el-table__cell) {
  background-color: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-color) !important;
}

:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid var(--border-color) !important;
}

:deep(.el-table tbody tr.hover-row > td) {
  background-color: var(--accent-bg) !important;
}

:deep(.el-table tbody tr:hover > td) {
  background-color: var(--accent-bg) !important;
}

:deep(.el-table tbody tr.hover-row > td.el-table__cell) {
  background-color: var(--accent-bg) !important;
}

:deep(.el-table tbody tr:hover > td.el-table__cell) {
  background-color: var(--accent-bg) !important;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

/* 強制暗色模式表格樣式 */
.dark-table {
  background-color: var(--secondary-bg) !important;
}

.dark-table.dark-mode {
  background-color: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
}

.dark-table.dark-mode :deep(.el-table__inner-wrapper),
.dark-table.dark-mode :deep(.el-table__header-wrapper),
.dark-table.dark-mode :deep(.el-table__body-wrapper) {
  background-color: var(--secondary-bg) !important;
}

.dark-table.dark-mode :deep(th),
.dark-table.dark-mode :deep(.el-table__header th) {
  background-color: var(--accent-bg) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.dark-table.dark-mode :deep(td),
.dark-table.dark-mode :deep(.el-table__body td) {
  background-color: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

.dark-table.dark-mode :deep(.el-table__row:hover td) {
  background-color: var(--accent-bg) !important;
}

/* Element Plus Card 組件暗色模式 */
:deep(.el-card) {
  background-color: var(--secondary-bg) !important;
  border-color: var(--border-color) !important;
}

:deep(.el-card__header) {
  background-color: var(--accent-bg) !important;
  color: var(--text-primary) !important;
  border-bottom: 1px solid var(--border-color) !important;
}

:deep(.el-card__body) {
  background-color: var(--secondary-bg) !important;
  color: var(--text-primary) !important;
}

/* 表單元素暗色模式 */
:deep(.el-input) {
  --el-input-bg-color: var(--accent-bg);
  --el-input-text-color: var(--text-primary);
  --el-input-placeholder-color: var(--text-muted);
  --el-input-border-color: var(--border-color);
}

:deep(.el-input__wrapper) {
  background-color: var(--accent-bg) !important;
  box-shadow: 0 0 0 1px var(--border-color) inset !important;
}

:deep(.el-input__inner) {
  background-color: var(--accent-bg) !important;
  color: var(--text-primary) !important;
}

:deep(.el-input__inner::placeholder) {
  color: var(--text-muted) !important;
}

:deep(.el-button--default) {
  background-color: var(--accent-bg) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-color) !important;
}

:deep(.el-button--default:hover) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

/* 表單標籤文字 */
.quick-form label,
.quick-form .form-label {
  color: var(--text-primary) !important;
}

/* 快速調整點數區域標題 */
.admin-section h2,
.section-header h2 {
  color: var(--text-primary) !important;
}

/* 表格容器 */
.users-table {
  background: var(--secondary-bg);
  border-radius: var(--radius-md);
  padding: 1rem;
  border: 1px solid var(--border-color);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .admin-content {
    padding: 1rem;
  }
  
  .admin-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .credit-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>