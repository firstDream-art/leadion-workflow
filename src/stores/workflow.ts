import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface WorkflowExecution {
  id: number
  workflowName: string
  executedAt: Date
  status: 'running' | 'success' | 'failed'
  duration: string
  resultUrl?: string
}

export const useWorkflowStore = defineStore('workflow', () => {
  const executionHistory = ref<WorkflowExecution[]>([
    {
      id: 1,
      workflowName: 'SEO 關鍵字分析器',
      executedAt: new Date(Date.now() - 2 * 60 * 1000),
      status: 'success',
      duration: '45秒'
    },
    {
      id: 2,
      workflowName: '內容智能生成器',
      executedAt: new Date(Date.now() - 15 * 60 * 1000),
      status: 'success',
      duration: '1分23秒'
    },
    {
      id: 3,
      workflowName: '數據可視化分析',
      executedAt: new Date(Date.now() - 45 * 60 * 1000),
      status: 'failed',
      duration: '30秒'
    }
  ])

  // 添加新的執行記錄
  const addExecution = (execution: Omit<WorkflowExecution, 'id'>) => {
    const newExecution: WorkflowExecution = {
      ...execution,
      id: Date.now()
    }
    executionHistory.value.unshift(newExecution)
    return newExecution.id
  }

  // 更新執行狀態
  const updateExecution = (id: number, updates: Partial<WorkflowExecution>) => {
    const index = executionHistory.value.findIndex(ex => ex.id === id)
    if (index !== -1) {
      executionHistory.value[index] = { ...executionHistory.value[index], ...updates }
    }
  }

  // 根據 n8n 的執行 ID 更新狀態
  const updateExecutionByN8nId = (n8nExecutionId: string, updates: Partial<WorkflowExecution>) => {
    // 這裡我們先用最新的記錄，實際應該存儲 n8n 的執行 ID
    const latestExecution = executionHistory.value.find(ex => ex.status === 'running')
    if (latestExecution) {
      updateExecution(latestExecution.id, updates)
    }
  }

  return {
    executionHistory,
    addExecution,
    updateExecution,
    updateExecutionByN8nId
  }
})