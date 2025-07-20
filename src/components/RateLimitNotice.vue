<template>
  <div v-if="show" class="rate-limit-notice">
    <div class="notice-content">
      <div class="notice-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <div class="notice-text">
        <h3 class="notice-title">請稍候片刻</h3>
        <p class="notice-message">{{ message }}</p>
        <div v-if="retryCountdown > 0" class="retry-countdown">
          {{ retryCountdown }} 秒後自動重試
        </div>
      </div>
      <button v-if="showRetryButton" @click="$emit('retry')" class="retry-button">
        立即重試
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

interface Props {
  show: boolean
  message?: string
  autoRetryDelay?: number
  showRetryButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: '系統正在處理大量請求，為了保護服務穩定性，請稍後再試。',
  autoRetryDelay: 0,
  showRetryButton: true
})

const emit = defineEmits<{
  retry: []
  autoRetry: []
}>()

const retryCountdown = ref(0)
let countdownTimer: number | null = null

// 監聽顯示狀態變化
watch(() => props.show, (newShow) => {
  if (newShow && props.autoRetryDelay > 0) {
    startCountdown()
  } else {
    clearCountdown()
  }
})

function startCountdown() {
  retryCountdown.value = Math.ceil(props.autoRetryDelay / 1000)
  
  countdownTimer = setInterval(() => {
    retryCountdown.value--
    
    if (retryCountdown.value <= 0) {
      clearCountdown()
      emit('autoRetry')
    }
  }, 1000)
}

function clearCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  retryCountdown.value = 0
}

onUnmounted(() => {
  clearCountdown()
})
</script>

<style scoped>
.rate-limit-notice {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.notice-content {
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 50px rgba(0, 212, 255, 0.1);
  position: relative;
}

.notice-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 16px 16px 0 0;
}

.notice-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem auto;
  color: #fbbf24;
  animation: pulse 2s ease-in-out infinite;
}

.notice-icon svg {
  width: 100%;
  height: 100%;
}

.notice-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.notice-message {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.retry-countdown {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 1rem;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.retry-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* 響應式設計 */
@media (max-width: 480px) {
  .notice-content {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .notice-title {
    font-size: 1.1rem;
  }
  
  .notice-message {
    font-size: 0.9rem;
  }
}
</style>