<template>
  <Teleport to="body">
    <Transition name="notification" appear>
      <div v-if="show" class="auth-notification-overlay" @click.self="closeNotification">
        <div class="auth-notification-modal">
          <div class="notification-header">
            <div class="notification-icon" :class="iconClass">
              <component :is="iconComponent" />
            </div>
            <button class="close-btn" @click="closeNotification">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          
          <div class="notification-content">
            <h3 class="notification-title">{{ title }}</h3>
            <p class="notification-message">{{ message }}</p>
          </div>
          
          <div class="notification-actions">
            <button v-if="showCancel" class="btn-cancel" @click="closeNotification">
              {{ cancelText }}
            </button>
            <button class="btn-confirm" @click="handleConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'

interface Props {
  show: boolean
  type?: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

interface Emits {
  (event: 'confirm'): void
  (event: 'cancel'): void
  (event: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  confirmText: '確定',
  cancelText: '取消',
  showCancel: true
})

const emit = defineEmits<Emits>()

const iconClass = computed(() => {
  return {
    'icon-info': props.type === 'info',
    'icon-warning': props.type === 'warning', 
    'icon-error': props.type === 'error',
    'icon-success': props.type === 'success'
  }
})

const iconComponent = computed(() => {
  const icons = {
    info: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    warning: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' })
    ]),
    error: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    success: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ])
  }
  return icons[props.type]
})

const closeNotification = () => {
  emit('close')
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}
</script>

<style scoped>
.auth-notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.auth-notification-modal {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 50px rgba(0, 0, 0, 0.1);
  position: relative;
  transform: scale(1);
}

.notification-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon svg {
  width: 24px;
  height: 24px;
}

.icon-info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.icon-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.icon-error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.icon-success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.close-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.notification-content {
  margin-bottom: 2rem;
}

.notification-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.notification-message {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.notification-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.9rem;
  min-width: 80px;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 動畫效果 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.notification-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.notification-enter-active .auth-notification-modal,
.notification-leave-active .auth-notification-modal {
  transition: transform 0.3s ease;
}

.notification-enter-from .auth-notification-modal {
  transform: scale(0.9);
}

.notification-leave-to .auth-notification-modal {
  transform: scale(0.9);
}

/* 響應式設計 */
@media (max-width: 640px) {
  .auth-notification-modal {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .notification-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>