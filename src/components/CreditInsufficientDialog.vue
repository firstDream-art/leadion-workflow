<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="handleDialogClose"
    title="點數不足"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="insufficient-credit-content">
      <div class="warning-icon">
        <AlertTriangle :size="48" />
      </div>
      
      <div class="message-section">
        <h3 class="warning-title">點數不足</h3>
        <p class="warning-message">
          {{ message }}
        </p>
        
        <div class="credit-info">
          <div class="info-item">
            <span class="label">需要點數：</span>
            <span class="value required">{{ requiredCredits }} 點</span>
          </div>
          <div class="info-item">
            <span class="label">當前餘額：</span>
            <span class="value current">{{ currentBalance }} 點</span>
          </div>
          <div class="info-item">
            <span class="label">缺少點數：</span>
            <span class="value shortage">{{ shortage }} 點</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">
          稍後再說
        </el-button>
        <el-button type="primary" @click="handleTopup">
          <Plus :size="16" />
          立即儲值
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { AlertTriangle, Plus } from 'lucide-vue-next'

interface Props {
  visible: boolean
  requiredCredits: number
  currentBalance: number
  message?: string
}

interface Emits {
  (event: 'close'): void
  (event: 'topup'): void
}

const props = withDefaults(defineProps<Props>(), {
  message: '執行此操作需要更多點數，請先儲值後再使用。'
})

const emit = defineEmits<Emits>()
const router = useRouter()

const shortage = computed(() => {
  return Math.max(0, props.requiredCredits - props.currentBalance)
})

const handleDialogClose = (value: boolean) => {
  if (!value) {
    emit('close')
  }
}

const handleClose = () => {
  emit('close')
}

const handleTopup = () => {
  emit('topup')
  // 導航到點數管理頁面
  router.push('/credits')
  handleClose()
}
</script>

<style scoped>
.insufficient-credit-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
}

.warning-icon {
  color: var(--el-color-warning);
  margin-bottom: 1rem;
}

.message-section {
  width: 100%;
}

.warning-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 0.75rem;
}

.warning-message {
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.credit-info {
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
}

.value {
  font-weight: 600;
  font-size: 1rem;
}

.value.required {
  color: var(--el-color-primary);
}

.value.current {
  color: var(--el-text-color-primary);
}

.value.shortage {
  color: var(--el-color-danger);
}

.dialog-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* 響應式設計 */
@media (max-width: 480px) {
  .warning-title {
    font-size: 1.1rem;
  }
  
  .warning-message {
    font-size: 0.9rem;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
  
  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>