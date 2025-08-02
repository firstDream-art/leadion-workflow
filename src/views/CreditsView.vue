<template>
  <div class="credits-view">
    <div class="container">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h1 class="page-title">點數管理</h1>
        <p class="page-subtitle">管理您的點數餘額和查看交易記錄</p>
      </div>

      <!-- 點數總覽卡片 -->
      <div class="credit-overview">
        <div class="overview-cards">
          <!-- 當前餘額 -->
          <div class="overview-card balance-card">
            <div class="card-icon">
              <Coins :size="24" />
            </div>
            <div class="card-content">
              <h3 class="card-title">當前餘額</h3>
              <div class="card-value">{{ formatNumber(balance?.balance || 0) }}</div>
              <p class="card-subtitle">可用點數</p>
            </div>
          </div>

          <!-- 總購買點數 -->
          <div class="overview-card purchased-card">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <h3 class="card-title">總購買</h3>
              <div class="card-value">{{ formatNumber(balance?.totalPurchased || 0) }}</div>
              <p class="card-subtitle">累計儲值</p>
            </div>
          </div>

          <!-- 總使用點數 -->
          <div class="overview-card used-card">
            <div class="card-icon">
              <Activity :size="24" />
            </div>
            <div class="card-content">
              <h3 class="card-title">總使用</h3>
              <div class="card-value">{{ formatNumber(balance?.totalUsed || 0) }}</div>
              <p class="card-subtitle">已消費點數</p>
            </div>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="credit-actions">
          <!-- 暫時隱藏儲值功能，待正式環境部署後啟用 -->
          <!-- <el-button type="primary" size="large" @click="showTopupDialog = true">
            <Plus :size="16" />
            儲值點數
          </el-button> -->
          
          <el-button size="large" @click="refreshData">
            <RotateCcw :size="16" :class="{ 'spinning': isRefreshing }" />
            重新整理
          </el-button>
          
          <!-- 開發階段說明 -->
          <div class="dev-notice">
            <el-alert
              title="開發階段"
              description="點數儲值功能開發完成，待正式環境部署後啟用。目前可透過後台手動調整點數。"
              type="info"
              :closable="false"
              show-icon>
            </el-alert>
          </div>
        </div>
      </div>

      <!-- 交易記錄 -->
      <div class="transaction-history">
        <div class="section-header">
          <h2 class="section-title">交易記錄</h2>
          <div class="section-actions">
            <el-select v-model="transactionFilter" placeholder="篩選類型" size="small">
              <el-option label="全部" value="all" />
              <el-option label="儲值" value="purchase" />
              <el-option label="消費" value="deduct" />
              <el-option label="退款" value="refund" />
            </el-select>
          </div>
        </div>

        <!-- 載入狀態 -->
        <div v-if="isLoadingTransactions" class="loading-state">
          <el-skeleton :rows="5" animated />
        </div>

        <!-- 交易列表 -->
        <div v-else-if="filteredTransactions.length > 0" class="transaction-list">
          <div 
            v-for="transaction in filteredTransactions" 
            :key="transaction.id"
            class="transaction-item"
            :class="`transaction-${transaction.type}`"
          >
            <div class="transaction-icon">
              <Plus v-if="transaction.type === 'purchase'" :size="20" />
              <Minus v-else-if="transaction.type === 'deduct'" :size="20" />
              <RotateCcw v-else-if="transaction.type === 'refund'" :size="20" />
            </div>
            
            <div class="transaction-details">
              <div class="transaction-title">
                {{ getTransactionTitle(transaction) }}
              </div>
              <div class="transaction-subtitle">
                {{ transaction.description || getTransactionSubtitle(transaction) }}
              </div>
              <div class="transaction-time">
                {{ formatDate(transaction.createdAt) }}
              </div>
            </div>

            <div class="transaction-amount" :class="`amount-${transaction.type}`">
              <span class="amount-sign">{{ getAmountSign(transaction.type) }}</span>
              <span class="amount-value">{{ Math.abs(transaction.amount) }}</span>
              <span class="amount-unit">點</span>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <FileText :size="48" />
          </div>
          <h3 class="empty-title">暫無交易記錄</h3>
          <p class="empty-subtitle">您還沒有任何點數交易記錄</p>
        </div>

        <!-- 載入更多 -->
        <div v-if="filteredTransactions.length > 0 && hasMoreTransactions" class="load-more">
          <el-button @click="loadMoreTransactions" :loading="isLoadingMore" plain>
            載入更多記錄
          </el-button>
        </div>
      </div>
    </div>

    <!-- 儲值對話框 -->
    <TopupDialog 
      v-model="showTopupDialog"
      :current-balance="balance?.balance || 0"
      @payment-success="handlePaymentSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { 
  Coins, TrendingUp, Activity, Plus, RotateCcw, 
  Minus, FileText 
} from 'lucide-vue-next'
import { creditService, type CreditBalance, type CreditTransaction } from '@/services/creditService'
import { paymentService, getUserPaymentHistory, type PaymentCallback } from '@/services/paymentService'
import { ElMessage } from 'element-plus'
import TopupDialog from '@/components/TopupDialog.vue'

// 響應式數據
const { user } = useAuth()
const balance = ref<CreditBalance | null>(null)
const transactions = ref<CreditTransaction[]>([])
const paymentHistory = ref<PaymentCallback[]>([])
const isLoading = ref(true)
const isLoadingTransactions = ref(true)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const hasMoreTransactions = ref(true)
const transactionFilter = ref<string>('all')
const showTopupDialog = ref(false)

// 計算屬性
const userEmail = computed(() => {
  return user.value?.email || null
})

// 合併交易記錄和付款記錄
const allTransactions = computed(() => {
  const creditTxns = transactions.value.map(t => ({
    ...t,
    source: 'credit'
  }))
  
  const paymentTxns = paymentHistory.value.map(p => ({
    id: p.orderId,
    type: p.status === 'success' ? 'purchase' : 'pending',
    amount: p.amount,
    balanceAfter: 0, // 付款記錄不包含餘額
    description: `付款 ${p.status === 'success' ? '成功' : '處理中'} - ${p.paymentType}`,
    createdAt: p.timestamp,
    source: 'payment'
  }))
  
  return [...creditTxns, ...paymentTxns].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

const filteredTransactions = computed(() => {
  if (transactionFilter.value === 'all') {
    return allTransactions.value
  }
  return allTransactions.value.filter(t => t.type === transactionFilter.value)
})

// 方法
function formatNumber(num: number): string {
  return num.toLocaleString()
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTransactionTitle(transaction: CreditTransaction): string {
  const titles = {
    purchase: '點數儲值',
    deduct: transaction.workflowName || '點數消費',
    refund: '點數退款'
  }
  return titles[transaction.type] || '未知交易'
}

function getTransactionSubtitle(transaction: CreditTransaction): string {
  const subtitles = {
    purchase: '信用卡儲值',
    deduct: '工作流執行',
    refund: '系統退款'
  }
  return subtitles[transaction.type] || ''
}

function getAmountSign(type: string): string {
  return type === 'purchase' || type === 'refund' ? '+' : '-'
}

async function loadBalance() {
  try {
    // 不傳 userEmail，使用當前用戶的點數
    balance.value = await creditService.getBalance()
  } catch (error) {
    console.error('載入點數餘額失敗:', error)
    ElMessage.error('載入點數餘額失敗')
  }
}

async function loadTransactions() {
  try {
    isLoadingTransactions.value = true
    
    // 載入點數交易記錄 - 不傳 userEmail，使用當前用戶
    const creditTxns = await creditService.getTransactions(undefined, 20)
    transactions.value = creditTxns
    
    // 載入付款記錄 - 這個仍需要 userEmail
    if (userEmail.value) {
      const paymentTxns = await getUserPaymentHistory(userEmail.value)
      paymentHistory.value = paymentTxns
    }
    
    hasMoreTransactions.value = creditTxns.length >= 20
  } catch (error) {
    console.error('載入交易記錄失敗:', error)
    ElMessage.error('載入交易記錄失敗')
  } finally {
    isLoadingTransactions.value = false
  }
}

async function loadMoreTransactions() {
  if (!userEmail.value || isLoadingMore.value) return

  try {
    isLoadingMore.value = true
    // 這裡需要實現分頁載入
    // const result = await creditService.getTransactions(userEmail.value, 20, transactions.value.length)
    // transactions.value.push(...result)
    // hasMoreTransactions.value = result.length >= 20
    
    // 暫時模擬
    await new Promise(resolve => setTimeout(resolve, 1000))
    hasMoreTransactions.value = false
    ElMessage.info('沒有更多記錄了')
  } catch (error) {
    console.error('載入更多記錄失敗:', error)
    ElMessage.error('載入更多記錄失敗')
  } finally {
    isLoadingMore.value = false
  }
}

async function refreshData() {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  try {
    await Promise.all([
      loadBalance(),
      loadTransactions()
    ])
    ElMessage.success('資料已更新')
  } catch (error) {
    console.error('重新整理失敗:', error)
    ElMessage.error('重新整理失敗')
  } finally {
    isRefreshing.value = false
  }
}

// 生命週期
onMounted(async () => {
  if (!userEmail.value) {
    ElMessage.error('請先登入')
    return
  }

  try {
    await Promise.all([
      loadBalance(),
      loadTransactions()
    ])
  } catch (error) {
    console.error('初始化失敗:', error)
  } finally {
    isLoading.value = false
  }
})

// 處理付款成功
function handlePaymentSuccess(data: any) {
  console.log('💰 付款成功:', data)
  ElMessage.success('付款訂單已創建，請完成付款以獲得點數')
  
  // 刷新交易記錄以顯示新的付款記錄
  setTimeout(() => {
    loadTransactions()
  }, 1000)
}
</script>

<style scoped>
.credits-view {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 頁面標題 */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* 點數總覽 */
.credit-overview {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-card);
  margin-bottom: 3rem;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.balance-card .card-icon {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.purchased-card .card-icon {
  background: var(--color-success-light);
  color: var(--color-success);
}

.used-card .card-icon {
  background: var(--color-info-light);
  color: var(--color-info);
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.card-subtitle {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.credit-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.dev-notice {
  width: 100%;
  max-width: 600px;
}

/* 交易記錄 */
.transaction-history {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-card);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.transaction-item:hover {
  border-color: var(--border-color-hover);
  background: var(--bg-hover);
}

.transaction-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transaction-purchase .transaction-icon {
  background: var(--color-success-light);
  color: var(--color-success);
}

.transaction-deduct .transaction-icon {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.transaction-refund .transaction-icon {
  background: var(--color-info-light);
  color: var(--color-info);
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.transaction-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.transaction-time {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.transaction-amount {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-weight: 600;
}

.amount-purchase {
  color: var(--color-success);
}

.amount-deduct {
  color: var(--color-danger);
}

.amount-refund {
  color: var(--color-info);
}

.amount-value {
  font-size: 1.1rem;
}

.amount-unit {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 空狀態 */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  color: var(--text-tertiary);
}

/* 載入更多 */
.load-more {
  text-align: center;
  margin-top: 2rem;
}


/* 動畫 */
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .credits-view {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .credit-overview,
  .transaction-history {
    padding: 1.5rem;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .credit-actions {
    flex-direction: column;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .transaction-amount {
    align-self: flex-end;
  }
}
</style>