<template>
  <div class="seo-analyzer-modal" v-if="isVisible" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">SEO 關鍵字分析器</h2>
        <button class="close-btn" @click="close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="submitAnalysis" class="analyzer-form">
        <div class="form-group">
          <label for="keyword" class="form-label">目標關鍵字</label>
          <input
            id="keyword"
            v-model="formData.keyword"
            type="text"
            class="form-input"
            placeholder="輸入要分析的關鍵字"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="brandName" class="form-label">品牌名稱</label>
          <input
            id="brandName"
            v-model="formData.brandName"
            type="text"
            class="form-input"
            placeholder="輸入您的品牌名稱"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="brandWebsite" class="form-label">品牌網址</label>
          <input
            id="brandWebsite"
            v-model="formData.brandWebsite"
            type="url"
            class="form-input"
            placeholder="https://example.com"
            :class="{ 'form-input-error': formData.brandWebsite && !isValidUrl(formData.brandWebsite) }"
            required
          />
          <span v-if="formData.brandWebsite && !isValidUrl(formData.brandWebsite)" class="field-error">
            請輸入有效的網址格式
          </span>
        </div>
        
        
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="close">
            取消
          </button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting || !isFormValid">
            <div class="btn-content">
              <div v-if="isSubmitting" class="loading-spinner"></div>
              <span v-if="isSubmitting">分析中...</span>
              <span v-else>開始分析</span>
            </div>
          </button>
        </div>
      </form>
      
      <!-- 結果顯示區域 -->
      <div v-if="analysisResult" class="result-section">
        <h3 class="result-title">分析結果</h3>
        <div class="result-content">
          <pre>{{ JSON.stringify(analysisResult, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 錯誤顯示 -->
      <div v-if="error" class="error-section">
        <p class="error-message">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import type { SeoFormData, ApiResponse } from '@/types'

interface Props {
  isVisible: boolean
}

interface Emits {
  (event: 'close'): void
  (event: 'analysis-complete', result: ApiResponse): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const workflowStore = useWorkflowStore()

const isSubmitting = ref<boolean>(false)
const analysisResult = ref<ApiResponse | null>(null)
const error = ref<string>('')

const formData = reactive<SeoFormData>({
  keyword: '',
  brandName: '',
  brandWebsite: ''
})

// 💡 優化：緩存 URL 驗證結果，避免重複計算
const urlValidationCache = new Map<string, boolean>()

// URL 驗證
const isValidUrl = (url: string): boolean => {
  // 檢查緩存
  if (urlValidationCache.has(url)) {
    return urlValidationCache.get(url)!
  }
  
  try {
    new URL(url)
    urlValidationCache.set(url, true)
    return true
  } catch {
    urlValidationCache.set(url, false)
    return false
  }
}

// 🚀 優化：分別緩存各個驗證結果
const isUrlValid = computed(() => isValidUrl(formData.brandWebsite))

// 表單驗證
const isFormValid = computed<boolean>(() => {
  return formData.keyword.trim().length > 0 &&
         formData.brandName.trim().length > 0 &&
         formData.brandWebsite.trim().length > 0 &&
         isUrlValid.value
})

// 清理緩存當 URL 改變時
watch(() => formData.brandWebsite, () => {
  // 保持最新的 100 個驗證結果，清理舊的
  if (urlValidationCache.size > 100) {
    const entries = Array.from(urlValidationCache.entries())
    urlValidationCache.clear()
    // 保留最新的 50 個
    entries.slice(-50).forEach(([key, value]) => {
      urlValidationCache.set(key, value)
    })
  }
})

const resetForm = (): void => {
  formData.keyword = ''
  formData.brandName = ''
  formData.brandWebsite = ''
  analysisResult.value = null
  error.value = ''
}

const close = (): void => {
  emit('close')
  resetForm()
}

const submitAnalysis = async (): Promise<void> => {
  if (isSubmitting.value || !isFormValid.value) return
  
  isSubmitting.value = true
  error.value = ''
  analysisResult.value = null
  
  // 添加執行記錄到歷史
  const executionId = workflowStore.addExecution({
    workflowName: 'SEO 關鍵字分析器',
    category: 'seo',
    status: 'running',
    startTime: new Date(),
    inputData: { ...formData }
  })
  
  try {
    // 使用正確的 field 名稱
    const formDataToSend = new FormData()
    formDataToSend.append('field-0', formData.keyword.trim())
    formDataToSend.append('field-1', formData.brandName.trim())
    formDataToSend.append('field-2', formData.brandWebsite.trim())
    
    console.log('發送的資料:', {
      '主關鍵詞': formData.keyword,
      '品牌名稱': formData.brandName,
      '品牌官網': formData.brandWebsite
    })
    
    const response = await fetch('https://awesomeseo.zeabur.app/form-test/3ed00c5a-c772-46e1-a44c-13a42ce56cc3', {
      method: 'POST',
      body: formDataToSend
    })
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`)
    }
    
    const result: ApiResponse = await response.json()
    
    // 更新執行狀態為完成
    workflowStore.updateExecution(executionId, {
      status: 'completed',
      endTime: new Date(),
      outputData: result
    })
    
    analysisResult.value = {
      success: true,
      message: '✅ SEO 分析已成功啟動！分析結果將在完成後通知您。',
      data: result
    }
    
    // 發送成功事件給父組件
    emit('analysis-complete', analysisResult.value)
    
    // 自動關閉表單
    setTimeout(() => {
      close()
    }, 2000)
    
  } catch (err) {
    console.error('分析請求失敗:', err)
    
    const errorMessage = err instanceof Error ? err.message : '未知錯誤'
    error.value = `分析請求失敗: ${errorMessage}`
    
    // 更新執行狀態為失敗
    workflowStore.updateExecution(executionId, {
      status: 'failed',
      endTime: new Date(),
      errorMessage: error.value
    })
    
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.seo-analyzer-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--secondary-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--accent-bg);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.analyzer-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(34, 139, 230, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border-color: var(--primary-color);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--accent-bg);
  color: var(--text-primary);
}

.result-section {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.result-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.result-content {
  background: var(--primary-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
  overflow-x: auto;
}

.error-section {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid var(--error-color);
  border-radius: var(--radius-md);
}

.error-message {
  color: var(--error-color);
  margin: 0;
  font-size: 0.9rem;
}

/* 表單驗證樣式 */
.form-input-error {
  border-color: var(--error-color) !important;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1) !important;
}

.field-error {
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

/* 按鈕內容樣式 */
.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Loading spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 響應式設計 */
@media (max-width: 640px) {
  .modal-content {
    padding: var(--spacing-lg);
    margin: var(--spacing-md);
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>