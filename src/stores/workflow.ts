import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WorkflowExecution } from '@/types'

export const useWorkflowStore = defineStore('workflow', () => {
  const executionHistory = ref<WorkflowExecution[]>([
    {
      id: '1',
      workflowName: 'SEO 關鍵字分析器',
      category: 'seo',
      status: 'completed',
      startTime: new Date(Date.now() - 2 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 1000 + 45000)
    },
    {
      id: '2',
      workflowName: '內容智能生成器',
      category: 'content',
      status: 'completed',
      startTime: new Date(Date.now() - 15 * 60 * 1000),
      endTime: new Date(Date.now() - 15 * 60 * 1000 + 83000)
    },
    {
      id: '3',
      workflowName: '數據可視化分析',
      category: 'analytics',
      status: 'failed',
      startTime: new Date(Date.now() - 45 * 60 * 1000),
      endTime: new Date(Date.now() - 45 * 60 * 1000 + 30000),
      errorMessage: '連接超時'
    }
  ])

  // 添加新的執行記錄
  const addExecution = (execution: Omit<WorkflowExecution, 'id'>) => {
    const newExecution: WorkflowExecution = {
      ...execution,
      id: `execution_${Date.now()}`
    }
    executionHistory.value.unshift(newExecution)
    return newExecution.id
  }

  // 更新執行狀態
  const updateExecution = (id: string, updates: Partial<WorkflowExecution>) => {
    const index = executionHistory.value.findIndex(ex => ex.id === id)
    if (index !== -1) {
      executionHistory.value[index] = { ...executionHistory.value[index], ...updates }
    }
  }

  // 根據 n8n 的執行 ID 更新狀態
  const updateExecutionByN8nId = (_n8nExecutionId: string, updates: Partial<WorkflowExecution>) => {
    // 查找運行中的執行記錄
    const runningExecution = executionHistory.value.find(ex => ex.status === 'running')
    if (runningExecution) {
      updateExecution(runningExecution.id, updates)
    }
  }

  // 計算執行持續時間
  const getExecutionDuration = (execution: WorkflowExecution): string => {
    if (!execution.endTime) return '--'
    
    const duration = execution.endTime.getTime() - execution.startTime.getTime()
    const seconds = Math.floor(duration / 1000)
    const minutes = Math.floor(seconds / 60)
    
    if (minutes > 0) {
      return `${minutes}分${seconds % 60}秒`
    }
    return `${seconds}秒`
  }

  return {
    executionHistory,
    addExecution,
    updateExecution,
    updateExecutionByN8nId,
    getExecutionDuration
  }
})