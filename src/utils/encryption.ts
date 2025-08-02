// 前端資料加密工具
// 提供不依賴部署環境的額外安全保護

import CryptoJS from 'crypto-js'

class EncryptionService {
  private readonly secretKey: string
  private readonly ivLength = 16

  constructor() {
    // 使用環境變數或固定 key (生產環境應使用環境變數)
    this.secretKey = import.meta.env.VITE_ENCRYPTION_KEY || 'leadion-ai-default-key-2025'
  }

  /**
   * 加密敏感資料
   */
  encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data)
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString()
      return encrypted
    } catch (error) {
      console.error('加密失敗:', error)
      throw new Error('資料加密失敗')
    }
  }

  /**
   * 解密資料
   */
  decrypt(encryptedData: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey)
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8)
      return JSON.parse(jsonString)
    } catch (error) {
      console.error('解密失敗:', error)
      throw new Error('資料解密失敗')
    }
  }

  /**
   * 生成請求簽名 (防止請求被篡改)
   */
  generateSignature(data: any, timestamp: number): string {
    const message = JSON.stringify(data) + timestamp.toString()
    return CryptoJS.HmacSHA256(message, this.secretKey).toString()
  }

  /**
   * 驗證請求簽名
   */
  verifySignature(data: any, timestamp: number, signature: string): boolean {
    const expectedSignature = this.generateSignature(data, timestamp)
    return expectedSignature === signature
  }

  /**
   * 安全的表單資料傳輸
   */
  secureFormData(formData: Record<string, any>) {
    const timestamp = Date.now()
    const encryptedData = this.encrypt(formData)
    const signature = this.generateSignature(formData, timestamp)

    return {
      data: encryptedData,
      timestamp,
      signature
    }
  }

  /**
   * 檢查當前連線是否安全
   */
  isSecureConnection(): boolean {
    return window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost'
  }

  /**
   * 安全警告
   */
  checkSecurityAndWarn(): void {
    if (!this.isSecureConnection()) {
      console.warn('⚠️ 警告：當前連線不安全 (非 HTTPS)')
      // 可以顯示用戶警告
    }
  }
}

// 創建單例
export const encryptionService = new EncryptionService()

// 便利方法
export const {
  encrypt,
  decrypt,
  generateSignature,
  verifySignature,
  secureFormData,
  isSecureConnection,
  checkSecurityAndWarn
} = encryptionService