# 程式設計基礎規範與最佳實踐

## 🚫 絕對禁止的行為

### 1. 用戶體驗 (UX) 禁忌
- **禁止使用原生 `alert()`、`confirm()`、`prompt()`**
  - ❌ `alert('錯誤訊息')`
  - ✅ 使用自定義通知組件 `<AuthNotification>`、`<Toast>` 等
- **禁止英文錯誤訊息直接顯示給用戶**
  - ❌ 直接顯示 "The External Account was not found"
  - ✅ 翻譯為中文 "找不到此社交帳號，請先註冊"
- **禁止無意義的錯誤提示**
  - ❌ 只顯示圖標或符號without說明
  - ✅ 提供清楚的文字說明和解決方案

### 2. 程式碼組織禁忌
- **禁止重複代碼**
  - ❌ 在多個地方寫相同的邏輯
  - ✅ 提取為共用函數或組件
- **禁止硬編碼值**
  - ❌ `setTimeout(() => {}, 3000)`
  - ✅ `const RETRY_DELAY = 3000; setTimeout(() => {}, RETRY_DELAY)`
- **禁止過深的嵌套**
  - ❌ 超過 3 層的 if/else 嵌套
  - ✅ 使用早期返回、guard clauses

## ✅ 必須遵守的原則

### 1. 用戶體驗原則
```typescript
// ✅ 良好的錯誤處理模式
const handleError = (error: any) => {
  const translatedMessage = translateError(error.message)
  showNotification({
    type: 'error',
    title: '操作失敗',
    message: translatedMessage,
    actions: [{
      text: '重試',
      handler: () => retryOperation()
    }]
  })
}
```

### 2. 組件設計原則
```vue
<!-- ✅ 可重用的組件模式 -->
<template>
  <BaseNotification
    :show="visible"
    :type="notificationType"
    :title="title"
    :message="message"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
```

### 3. 狀態管理原則
```typescript
// ✅ 清楚的狀態結構
interface NotificationState {
  show: boolean
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  duration?: number
}

const notification = ref<NotificationState>({
  show: false,
  type: 'info',
  title: '',
  message: ''
})
```

## 🏗️ 架構設計原則

### 1. 關注點分離 (Separation of Concerns)
```typescript
// ✅ 邏輯分層
// utils/errorHandler.ts - 錯誤處理
export const translateError = (message: string): string => { /* ... */ }

// composables/useNotification.ts - 通知邏輯
export const useNotification = () => { /* ... */ }

// components/AuthNotification.vue - UI 組件
// views/SignInView.vue - 頁面邏輯
```

### 2. 依賴注入模式
```typescript
// ✅ 避免硬依賴
interface ErrorHandler {
  handleError(error: Error): void
  translateMessage(message: string): string
}

// 注入依賴，方便測試和替換
const useAuthFlow = (errorHandler: ErrorHandler) => {
  // ...
}
```

### 3. 配置驅動開發
```typescript
// ✅ 配置文件管理常數
export const AUTH_CONFIG = {
  RETRY_DELAY: 3000,
  MAX_RETRIES: 3,
  ERROR_MESSAGES: {
    'The External Account was not found': '找不到此社交帳號，請先註冊',
    'form_identifier_not_found': '帳號不存在，請先註冊'
  }
} as const
```

## 📝 代碼質量標準

### 1. 命名規範
```typescript
// ✅ 有意義的命名
const handleSignUpRequired = (error: AuthError) => { /* ... */ }
const translateClerkError = (message: string): string => { /* ... */ }
const showAuthNotification = (config: NotificationConfig) => { /* ... */ }

// ❌ 無意義的命名
const handle = (e: any) => { /* ... */ }
const doStuff = (msg: string) => { /* ... */ }
```

### 2. 類型安全
```typescript
// ✅ 明確的類型定義
interface AuthError {
  code: string
  message: string
  details?: Record<string, any>
}

interface NotificationConfig {
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  duration?: number
  showCancel?: boolean
}

// ❌ 過度使用 any
const handleError = (error: any) => { /* ... */ }
```

### 3. 錯誤處理模式
```typescript
// ✅ 結構化錯誤處理
class AuthErrorHandler {
  private errorTranslations: Record<string, string> = {
    'The External Account was not found': '找不到此社交帳號，請先註冊',
    // ...
  }

  handleError(error: Error): void {
    const translatedMessage = this.translateError(error.message)
    this.showNotification({
      type: 'error',
      title: '登入失敗',
      message: translatedMessage
    })
  }

  private translateError(message: string): string {
    return this.errorTranslations[message] || message
  }
}
```

## 🔧 開發工具和實踐

### 1. 文件結構
```
src/
├── components/          # 可重用組件
│   ├── base/           # 基礎組件
│   ├── auth/           # 認證相關組件
│   └── notifications/  # 通知組件
├── composables/        # 組合式函數
├── utils/              # 工具函數
├── types/              # 類型定義
├── constants/          # 常數配置
└── views/              # 頁面組件
```

### 2. 測試策略
```typescript
// ✅ 為核心功能寫測試
describe('AuthErrorHandler', () => {
  it('should translate English error messages to Chinese', () => {
    const handler = new AuthErrorHandler()
    const result = handler.translateError('The External Account was not found')
    expect(result).toBe('找不到此社交帳號，請先註冊')
  })
})
```

### 3. 程式碼審查清單
- [ ] 是否使用了原生的 alert/confirm？
- [ ] 錯誤訊息是否已翻譯為中文？
- [ ] 是否有重複的代碼可以提取？
- [ ] 組件是否可重用？
- [ ] 是否有適當的類型定義？
- [ ] 是否有適當的錯誤處理？

## 🎯 具體實施步驟

### 1. 每次開發新功能時
1. **設計階段**：考慮用戶體驗和錯誤情況
2. **實現階段**：使用共用組件和工具函數
3. **測試階段**：測試錯誤情況和邊界條件
4. **審查階段**：檢查是否符合規範

### 2. 重構現有代碼時
1. **識別**：找出違反規範的代碼
2. **提取**：將重複邏輯提取為共用函數
3. **替換**：用標準組件替換原生 UI
4. **測試**：確保功能不受影響

### 3. 持續改進
- 定期更新此規範文件
- 分享最佳實踐案例
- 建立代碼審查流程

---

## 📚 延伸閱讀
- Vue 3 組合式 API 最佳實踐
- TypeScript 嚴格模式配置
- 無障礙設計原則 (a11y)
- 國際化 (i18n) 最佳實踐

**記住：好的代碼不只是能工作，更要可讀、可維護、可擴展！**