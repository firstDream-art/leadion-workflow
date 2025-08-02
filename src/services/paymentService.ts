/**
 * 金流服務 - ECPay (綠界) 串接
 */

import axios from 'axios'

export interface PaymentRequest {
  amount: number
  userEmail: string
  orderId?: string
  description?: string
  paymentType?: 'ALL' | 'Credit' | 'WebATM' | 'ATM' | 'CVS' | 'BARCODE'
}

export interface PaymentResponse {
  success: boolean
  paymentUrl?: string
  orderId: string
  message: string
  data?: any
}

export interface PaymentCallback {
  orderId: string
  amount: number
  status: 'success' | 'failed' | 'pending'
  paymentType: string
  transactionId: string
  timestamp: string
}

export interface TopupPackage {
  id: string
  credits: number
  price: number
  bonus: number
  popular?: boolean
  description: string
}

// 預設儲值套餐
export const TOPUP_PACKAGES: TopupPackage[] = [
  {
    id: 'basic',
    credits: 100,
    price: 99,
    bonus: 0,
    description: '基礎套餐'
  },
  {
    id: 'standard',
    credits: 500,
    price: 450,
    bonus: 50,
    popular: true,
    description: '標準套餐 +50 點數'
  },
  {
    id: 'premium',
    credits: 1000,
    price: 850,
    bonus: 150,
    description: '進階套餐 +150 點數'
  },
  {
    id: 'enterprise',
    credits: 5000,
    price: 4000,
    bonus: 1000,
    description: '企業套餐 +1000 點數'
  }
]

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

class PaymentService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  /**
   * 創建付款訂單
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('🚀 創建付款訂單:', request)

      const response = await this.apiClient.post<PaymentResponse>('/api/payment/create', {
        amount: request.amount,
        userEmail: request.userEmail,
        orderId: request.orderId || this.generateOrderId(),
        description: request.description || `Leadion AI 點數儲值 - ${request.amount} 元`,
        paymentType: request.paymentType || 'ALL'
      })

      console.log('✅ 付款訂單創建成功:', response.data)
      return response.data

    } catch (error: any) {
      console.error('❌ 創建付款訂單失敗:', error)
      
      if (error.response) {
        throw new Error(`付款服務錯誤: ${error.response.data?.message || error.response.statusText}`)
      } else if (error.request) {
        throw new Error('無法連接到付款服務，請檢查網路連接')
      } else {
        throw new Error(error.message || '創建付款訂單失敗')
      }
    }
  }

  /**
   * 查詢付款狀態
   */
  async getPaymentStatus(orderId: string): Promise<PaymentCallback> {
    try {
      console.log('🔍 查詢付款狀態:', orderId)

      const response = await this.apiClient.get<{ success: boolean; data: PaymentCallback }>(
        `/api/payment/status/${orderId}`
      )

      if (!response.data.success) {
        throw new Error('查詢付款狀態失敗')
      }

      console.log('✅ 付款狀態查詢成功:', response.data.data)
      return response.data.data

    } catch (error: any) {
      console.error('❌ 查詢付款狀態失敗:', error)
      throw new Error('查詢付款狀態失敗')
    }
  }

  /**
   * 獲取用戶付款記錄
   */
  async getPaymentHistory(userEmail: string, limit: number = 10): Promise<PaymentCallback[]> {
    try {
      console.log('📝 獲取付款記錄:', userEmail)

      const response = await this.apiClient.get<{ success: boolean; data: PaymentCallback[] }>(
        `/api/payment/history/${encodeURIComponent(userEmail)}`,
        { params: { limit } }
      )

      if (!response.data.success) {
        throw new Error('獲取付款記錄失敗')
      }

      console.log('✅ 付款記錄獲取成功:', response.data.data.length, '筆記錄')
      return response.data.data

    } catch (error: any) {
      console.error('❌ 獲取付款記錄失敗:', error)
      return []
    }
  }

  /**
   * 取消付款
   */
  async cancelPayment(orderId: string): Promise<boolean> {
    try {
      console.log('🚫 取消付款:', orderId)

      const response = await this.apiClient.post<{ success: boolean; message: string }>(
        `/api/payment/cancel/${orderId}`
      )

      console.log('✅ 付款取消成功:', response.data.message)
      return response.data.success

    } catch (error: any) {
      console.error('❌ 取消付款失敗:', error)
      return false
    }
  }

  /**
   * 生成訂單編號
   */
  private generateOrderId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `LD${timestamp}${random}`.toUpperCase()
  }

  /**
   * 計算套餐總點數 (基礎點數 + 加贈點數)
   */
  calculateTotalCredits(pkg: TopupPackage): number {
    return pkg.credits + pkg.bonus
  }

  /**
   * 格式化價格顯示
   */
  formatPrice(price: number): string {
    return `NT$ ${price.toLocaleString()}`
  }

  /**
   * 獲取套餐性價比 (點數/價格)
   */
  getPackageValue(pkg: TopupPackage): number {
    return this.calculateTotalCredits(pkg) / pkg.price
  }
}

// 導出單例實例
export const paymentService = new PaymentService()

// 便利函數
export async function createTopupPayment(
  userEmail: string, 
  packageId: string
): Promise<PaymentResponse> {
  const pkg = TOPUP_PACKAGES.find(p => p.id === packageId)
  if (!pkg) {
    throw new Error('儲值套餐不存在')
  }

  return paymentService.createPayment({
    amount: pkg.price,
    userEmail,
    description: `${pkg.description} - ${paymentService.calculateTotalCredits(pkg)} 點數`,
    paymentType: 'ALL'
  })
}

export async function getUserPaymentHistory(userEmail: string): Promise<PaymentCallback[]> {
  return paymentService.getPaymentHistory(userEmail, 20)
}