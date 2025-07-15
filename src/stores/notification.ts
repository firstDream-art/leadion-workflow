import { defineStore } from 'pinia'

export interface Notification {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[]
  }),

  actions: {
    addNotification(notification: Omit<Notification, 'id'>) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newNotification: Notification = {
        id,
        ...notification
      }
      
      this.notifications.push(newNotification)
      
      // 自動移除通知 (除非 duration 為 0)
      if (notification.duration !== 0) {
        const duration = notification.duration || 5000
        setTimeout(() => {
          this.removeNotification(id)
        }, duration)
      }
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    clearAll() {
      this.notifications = []
    },

    // 便利方法
    success(message: string, title?: string) {
      this.addNotification({ message, title, type: 'success' })
    },

    error(message: string, title?: string) {
      this.addNotification({ message, title, type: 'error', duration: 0 })
    },

    warning(message: string, title?: string) {
      this.addNotification({ message, title, type: 'warning' })
    },

    info(message: string, title?: string) {
      this.addNotification({ message, title, type: 'info' })
    }
  }
}) 