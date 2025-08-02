import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('登入功能', () => {
    it('應該成功登入並儲存 token', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
          },
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        },
      }

      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const store = useAuthStore()
      await store.sendVerificationCode('test@example.com')
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse)
      await store.verifyCode('test@example.com', '123456', 'login')

      expect(store.isAuthenticated).toBe(true)
      expect(store.user?.email).toBe('test@example.com')
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'mock-access-token')
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token')
    })

    it('應該處理登入失敗', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('網路錯誤'))

      const store = useAuthStore()
      await expect(store.sendVerificationCode('invalid@example.com'))
        .rejects.toThrow()
      
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBeTruthy()
    })
  })

  describe('登出功能', () => {
    it('應該清除所有認證資料', async () => {
      const store = useAuthStore()
      
      // 先設定已登入狀態
      store.user = { id: '1', email: 'test@example.com' } as any
      store.accessToken = 'mock-token'
      store.refreshToken = 'mock-refresh-token'

      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(store.refreshToken).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken')
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken')
    })
  })

  describe('Token 管理', () => {
    it('應該自動刷新過期的 token', async () => {
      const mockRefreshResponse = {
        data: {
          success: true,
          tokens: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        },
      }

      mockedAxios.post.mockResolvedValueOnce(mockRefreshResponse)

      const store = useAuthStore()
      store.refreshToken = 'old-refresh-token'

      const result = await store.refreshAccessToken()

      expect(result).toBe(true)
      expect(store.accessToken).toBe('new-access-token')
      expect(store.refreshToken).toBe('new-refresh-token')
    })
  })

  describe('錯誤處理', () => {
    it('應該設定和清除錯誤訊息', () => {
      const store = useAuthStore()

      store.setError('測試錯誤')
      expect(store.error).toBe('測試錯誤')

      store.clearError()
      expect(store.error).toBeNull()
    })
  })
})