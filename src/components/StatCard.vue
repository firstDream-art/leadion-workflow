<template>
  <el-card class="stat-card" shadow="hover">
    <div class="stat-content">
      <div class="stat-info">
        <div class="stat-value">{{ value }}</div>
        <div class="stat-title">{{ title }}</div>
        <div v-if="trend" class="stat-trend" :class="trendClass">
          <el-icon>
            <TrendCharts />
          </el-icon>
          {{ trend }}
        </div>
      </div>
      <div class="stat-icon" :style="{ color }">
        <el-icon :size="32">
          <component :is="iconComponent" />
        </el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { 
  DataAnalysis,
  Document,
  TrendCharts,
  Timer,
  Monitor
} from '@element-plus/icons-vue'

interface Props {
  title: string
  value: string | number
  icon: string
  color: string
  trend?: string
}

const props = defineProps<Props>()

// 圖示映射
const iconMap: Record<string, any> = {
  DataAnalysis,
  Document,
  TrendCharts,
  Timer,
  Monitor
}

const iconComponent = computed(() => {
  return iconMap[props.icon] || DataAnalysis
})

// 趨勢樣式
const trendClass = computed(() => {
  if (!props.trend) return ''
  
  if (props.trend.startsWith('+')) {
    return 'trend-up'
  } else if (props.trend.startsWith('-')) {
    return 'trend-down'
  }
  return 'trend-neutral'
})
</script>

<style scoped>
.stat-card {
  border: none;
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  line-height: 1;
}

.stat-title {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 12px;
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  width: fit-content;
}

.trend-up {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.trend-down {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}

.trend-neutral {
  color: var(--el-color-info);
  background: var(--el-color-info-light-9);
}

.stat-icon {
  opacity: 0.8;
  transition: all 0.2s;
}

.stat-card:hover .stat-icon {
  opacity: 1;
  transform: scale(1.1);
}

/* 響應式設計 */
@media (max-width: 640px) {
  .stat-value {
    font-size: 24px;
  }
  
  .stat-icon {
    display: none;
  }
}
</style> 