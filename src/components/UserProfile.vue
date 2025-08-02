<template>
  <div class="user-profile">
    <div class="user-info" v-if="user">
      <!-- 用戶信息 - 只顯示 Email -->
      <div class="user-details">
        <div class="user-email">{{ userEmail }}</div>
      </div>
    </div>
    
    <!-- 載入狀態 -->
    <div v-else class="loading-state">
      <span>載入中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

// 調試信息
watchEffect(() => {
  console.log('👤 UserProfile user data:', user.value)
})

// 計算屬性 - 簡化版本
const userEmail = computed(() => {
  return user.value?.email || ''
})
</script>

<style scoped>
.user-profile {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  min-width: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-email {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}


/* 載入狀態 */
.loading-state {
  padding: 8px 12px;
}

.user-skeleton {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skeleton-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .user-details {
    display: block;
  }
  
  .user-info {
    padding: 6px 8px;
    min-width: 120px;
  }
  
  .user-email {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .user-info {
    padding: 4px 6px;
    min-width: 100px;
  }
  
  .user-email {
    font-size: 11px;
  }
}

</style>