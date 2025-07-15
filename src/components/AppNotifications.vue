<template>
  <teleport to="body">
    <div v-if="notifications.length > 0" class="notifications-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'notification',
            `notification-${notification.type}`
          ]"
        >
          <div class="notification-content">
            <div class="notification-icon">
              <span v-if="notification.type === 'success'">✓</span>
              <span v-else-if="notification.type === 'error'">✕</span>
              <span v-else-if="notification.type === 'warning'">⚠</span>
              <span v-else>ℹ</span>
            </div>
            <div class="notification-text">
              <h4 v-if="notification.title">{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
            </div>
            <button
              @click="removeNotification(notification.id)"
              class="notification-close"
            >
              ×
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { notifications, removeNotification } = notificationStore
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  max-width: 400px;
}

.notification {
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.75rem;
}

.notification-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  color: white;
}

.notification-text {
  flex: 1;
}

.notification-text h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.notification-text p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: currentColor;
  opacity: 0.6;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  opacity: 1;
}

/* 通知類型樣式 */
.notification-success {
  background: #10b981;
  color: white;
}

.notification-error {
  background: #ef4444;
  color: white;
}

.notification-warning {
  background: #f59e0b;
  color: white;
}

.notification-info {
  background: #3b82f6;
  color: white;
}

/* 動畫效果 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style> 