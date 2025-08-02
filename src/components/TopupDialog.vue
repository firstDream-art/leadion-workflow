<template>
  <el-dialog 
    v-model="visible" 
    title="儲值點數" 
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="!isProcessing"
    :before-close="handleClose"
    class="topup-dialog"
  >
    <!-- 載入狀態 -->
    <div v-if="isProcessing" class="processing-overlay">
      <div class="processing-content">
        <el-icon class="loading-icon" :size="48">
          <Loader2 />
        </el-icon>
        <h3>處理付款中...</h3>
        <p>請稍候，正在為您創建付款訂單</p>
      </div>
    </div>

    <!-- 主要內容 -->
    <div v-else class="topup-content">
      <!-- 當前餘額 -->
      <div class="current-balance">
        <div class="balance-card">
          <div class="balance-icon">
            <Coins :size="24" />
          </div>
          <div class="balance-info">
            <h3>當前餘額</h3>
            <div class="balance-amount">{{ formatNumber(currentBalance) }} 點</div>
          </div>
        </div>
      </div>

      <!-- 儲值套餐 -->
      <div class="packages-section">
        <h3 class="section-title">選擇儲值套餐</h3>
        
        <div class="packages-grid">
          <div 
            v-for="pkg in packages" 
            :key="pkg.id"
            class="package-card"
            :class="{
              'selected': selectedPackage?.id === pkg.id,
              'popular': pkg.popular
            }"
            @click="selectPackage(pkg)"
          >
            <!-- 熱門標籤 -->
            <div v-if="pkg.popular" class="popular-badge">
              <Star :size="14" />
              熱門
            </div>

            <div class="package-header">
              <h4 class="package-title">{{ pkg.description }}</h4>
              <div class="package-price">{{ formatPrice(pkg.price) }}</div>
            </div>

            <div class="package-details">
              <div class="credit-breakdown">
                <div class="base-credits">
                  <span class="label">基礎點數</span>
                  <span class="value">{{ formatNumber(pkg.credits) }} 點</span>
                </div>
                <div v-if="pkg.bonus > 0" class="bonus-credits">
                  <span class="label">加贈點數</span>
                  <span class="value bonus">+{{ formatNumber(pkg.bonus) }} 點</span>
                </div>
                <div class="total-credits">
                  <span class="label">總共獲得</span>
                  <span class="value total">{{ formatNumber(calculateTotalCredits(pkg)) }} 點</span>
                </div>
              </div>

              <div class="package-value">
                <span class="value-label">性價比</span>
                <span class="value-ratio">{{ getValueRatio(pkg) }} 點/元</span>
              </div>
            </div>

            <!-- 選中指示器 -->
            <div v-if="selectedPackage?.id === pkg.id" class="selected-indicator">
              <Check :size="20" />
            </div>
          </div>
        </div>
      </div>

      <!-- 付款方式 -->
      <div v-if="selectedPackage" class="payment-section">
        <h3 class="section-title">付款方式</h3>
        
        <div class="payment-methods">
          <div 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="payment-method"
            :class="{ 'selected': selectedPaymentMethod === method.id }"
            @click="selectedPaymentMethod = method.id"
          >
            <div class="method-icon" v-html="method.icon"></div>
            <div class="method-info">
              <h4>{{ method.name }}</h4>
              <p>{{ method.description }}</p>
            </div>
            <div v-if="selectedPaymentMethod === method.id" class="method-selected">
              <Check :size="16" />
            </div>
          </div>
        </div>
      </div>

      <!-- 訂單摘要 -->
      <div v-if="selectedPackage" class="order-summary">
        <h3 class="section-title">訂單摘要</h3>
        
        <div class="summary-card">
          <div class="summary-row">
            <span class="label">套餐</span>
            <span class="value">{{ selectedPackage.description }}</span>
          </div>
          <div class="summary-row">
            <span class="label">基礎點數</span>
            <span class="value">{{ formatNumber(selectedPackage.credits) }} 點</span>
          </div>
          <div v-if="selectedPackage.bonus > 0" class="summary-row bonus-row">
            <span class="label">加贈點數</span>
            <span class="value">+{{ formatNumber(selectedPackage.bonus) }} 點</span>
          </div>
          <div class="summary-row total-row">
            <span class="label">總點數</span>
            <span class="value">{{ formatNumber(calculateTotalCredits(selectedPackage)) }} 點</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row price-row">
            <span class="label">付款金額</span>
            <span class="value price">{{ formatPrice(selectedPackage.price) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按鈕 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="isProcessing">
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="handlePayment"
          :disabled="!canProceedPayment"
          :loading="isProcessing"
        >
          <CreditCard :size="16" />
          確認付款
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuth } from '@/composables/useAuth'
import { 
  Coins, Star, Check, CreditCard, Loader2 
} from 'lucide-vue-next'
import { 
  paymentService, 
  TOPUP_PACKAGES, 
  createTopupPayment,
  type TopupPackage 
} from '@/services/paymentService'

interface Props {
  modelValue: boolean
  currentBalance: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'payment-success', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 認證狀態
const { user } = useAuth()

// 響應式狀態
const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const packages = ref(TOPUP_PACKAGES)
const selectedPackage = ref<TopupPackage | null>(null)
const selectedPaymentMethod = ref<string>('ALL')
const isProcessing = ref(false)

// 付款方式
const paymentMethods = ref([
  {
    id: 'ALL',
    name: '全方位付款',
    description: '信用卡、WebATM、ATM、超商代碼、LINE Pay',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.11,4 20,4M20,18H4V12H20V18M20,8H4V6H20V8Z"/></svg>'
  },
  {
    id: 'Credit',
    name: '信用卡',
    description: '支援 Visa、MasterCard、JCB',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.11,4 20,4M20,18H4V12H20V18M20,8H4V6H20V8M11,16H5V14H11V16M15,16H13V14H15V16Z"/></svg>'
  },
  {
    id: 'WebATM',
    name: '網路銀行',
    description: '線上銀行轉帳付款',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9Z"/></svg>'
  }
])

// 計算屬性
const canProceedPayment = computed(() => {
  return selectedPackage.value && selectedPaymentMethod.value && user.value?.email && !isProcessing.value
})

// 方法
function selectPackage(pkg: TopupPackage) {
  selectedPackage.value = pkg
}

function calculateTotalCredits(pkg: TopupPackage): number {
  return paymentService.calculateTotalCredits(pkg)
}

function formatPrice(price: number): string {
  return paymentService.formatPrice(price)
}

function formatNumber(num: number): string {
  return num.toLocaleString()
}

function getValueRatio(pkg: TopupPackage): string {
  const ratio = paymentService.getPackageValue(pkg)
  return ratio.toFixed(2)
}

async function handlePayment() {
  if (!selectedPackage.value || !user.value?.email) {
    ElMessage.error('請選擇儲值套餐')
    return
  }

  try {
    isProcessing.value = true
    
    console.log('🚀 開始付款流程:', {
      package: selectedPackage.value,
      paymentMethod: selectedPaymentMethod.value,
      userEmail: user.value.email
    })

    // 創建付款訂單
    const paymentResponse = await createTopupPayment(
      user.value.email,
      selectedPackage.value.id
    )

    if (paymentResponse.success && paymentResponse.paymentUrl) {
      console.log('✅ 付款訂單創建成功，跳轉到付款頁面')
      
      // 跳轉到付款頁面
      window.open(paymentResponse.paymentUrl, '_blank')
      
      // 發出成功事件
      emit('payment-success', {
        orderId: paymentResponse.orderId,
        package: selectedPackage.value,
        paymentUrl: paymentResponse.paymentUrl
      })
      
      ElMessage.success('付款訂單已創建，請在新視窗完成付款')
      
      // 關閉對話框
      visible.value = false
      
    } else {
      throw new Error(paymentResponse.message || '創建付款訂單失敗')
    }
    
  } catch (error: any) {
    console.error('❌ 付款流程失敗:', error)
    ElMessage.error(error.message || '付款流程發生錯誤，請稍後再試')
  } finally {
    isProcessing.value = false
  }
}

function handleClose(done?: () => void) {
  if (isProcessing.value) {
    ElMessage.warning('付款處理中，請稍候')
    return
  }
  
  // 重置狀態
  selectedPackage.value = null
  selectedPaymentMethod.value = 'ALL'
  
  if (done) {
    done()
  } else {
    visible.value = false
  }
}

// 監聽對話框打開，預選熱門套餐
watch(visible, (newValue) => {
  if (newValue) {
    const popularPackage = packages.value.find(pkg => pkg.popular)
    if (popularPackage) {
      selectedPackage.value = popularPackage
    }
  }
})
</script>

<style scoped>
.topup-dialog {
  --dialog-padding: 24px;
}

.processing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 8px;
}

.processing-content {
  text-align: center;
  padding: 2rem;
}

.processing-content h3 {
  margin: 1rem 0 0.5rem;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.processing-content p {
  color: var(--text-secondary);
  margin: 0;
}

.loading-icon {
  color: var(--primary-color);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.topup-content {
  padding: var(--dialog-padding);
  max-height: 70vh;
  overflow-y: auto;
}

/* 當前餘額 */
.current-balance {
  margin-bottom: 2rem;
}

.balance-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.balance-icon {
  width: 48px;
  height: 48px;
  background: var(--color-warning-light);
  color: var(--color-warning);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.balance-info h3 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.balance-amount {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* 套餐選擇 */
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.package-card {
  position: relative;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.package-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.package-card.selected {
  border-color: var(--primary-color);
  background: var(--primary-bg-light);
  box-shadow: var(--shadow-primary);
}

.package-card.popular {
  border-color: var(--color-warning);
}

.popular-badge {
  position: absolute;
  top: -1px;
  right: 12px;
  background: var(--color-warning);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 8px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.package-header {
  margin-bottom: 1rem;
}

.package-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.package-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.package-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.credit-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.credit-breakdown > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.credit-breakdown .label {
  color: var(--text-secondary);
}

.credit-breakdown .value {
  font-weight: 600;
  color: var(--text-primary);
}

.credit-breakdown .value.bonus {
  color: var(--color-success);
}

.credit-breakdown .value.total {
  color: var(--primary-color);
  font-size: 1rem;
}

.credit-breakdown .total-credits {
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.package-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--bg-tertiary);
  border-radius: 6px;
  font-size: 0.8rem;
}

.value-label {
  color: var(--text-secondary);
}

.value-ratio {
  font-weight: 600;
  color: var(--text-primary);
}

.selected-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 付款方式 */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-method:hover {
  border-color: var(--primary-color);
}

.payment-method.selected {
  border-color: var(--primary-color);
  background: var(--primary-bg-light);
}

.method-icon {
  width: 40px;
  height: 40px;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-info {
  flex: 1;
}

.method-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
}

.method-info p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

.method-selected {
  width: 24px;
  height: 24px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 訂單摘要 */
.summary-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-row .label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.summary-row .value {
  font-weight: 600;
  color: var(--text-primary);
}

.summary-row.bonus-row .value {
  color: var(--color-success);
}

.summary-row.total-row .value {
  color: var(--primary-color);
  font-size: 1.1rem;
}

.summary-row.price-row {
  padding-top: 1rem;
}

.summary-row.price-row .label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-row.price-row .value.price {
  font-size: 1.2rem;
  color: var(--primary-color);
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 0;
}

/* 底部按鈕 */
.dialog-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: var(--dialog-padding);
  border-top: 1px solid var(--border-color);
  margin: 0 calc(-1 * var(--dialog-padding));
  margin-top: 1rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .packages-grid {
    grid-template-columns: 1fr;
  }
  
  .dialog-footer {
    flex-direction: column-reverse;
  }
  
  .topup-content {
    padding: 1rem;
  }
}
</style>