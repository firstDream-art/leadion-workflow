// API 處理 n8n webhook 通知
import { useWorkflowStore } from '@/stores/workflow'

import type { ExecutionStatus } from '@/types'

export interface N8nWebhookPayload {
  executionId: string
  workflowName: string
  status: 'completed' | 'failed'
  resultUrl?: string
  duration?: string
  timestamp: string
}

// 這個函數會被調用來處理 n8n 的完成通知
export const handleN8nWebhook = (payload: N8nWebhookPayload) => {
  const workflowStore = useWorkflowStore()
  
  console.log('收到 n8n 完成通知:', payload)
  
  // 更新對應的執行記錄
  workflowStore.updateExecutionByN8nId(payload.executionId, {
    status: payload.status,
    duration: payload.duration || '已完成',
    resultUrl: payload.resultUrl
  })
  
  // 可以在這裡添加通知用戶的邏輯
  if (payload.status === 'completed') {
    console.log('✅ SEO 分析完成！結果:', payload.resultUrl)
  } else {
    console.log('❌ SEO 分析失敗')
  }
}

// 模擬接收 webhook 的函數（開發環境使用）
export const simulateWebhookReceiver = () => {
  // 在實際環境中，這會是一個真正的 HTTP 端點
  // 這裡我們創建一個全域函數讓 n8n 可以調用
  (window as any).receiveN8nWebhook = (payload: N8nWebhookPayload) => {
    handleN8nWebhook(payload)
  }
}