# 🧪 Leadion AI 測試指南

## ⚠️ 絕對規則：每次新增代碼都必須寫測試！

**沒有測試 = 不允許提交代碼**

這不是建議，這是強制要求：
- ✅ 新增函數 → 必須有單元測試
- ✅ 新增組件 → 必須有組件測試  
- ✅ 新增 API → 必須有 API 測試
- ✅ 修改邏輯 → 必須更新測試
- ✅ 所有測試通過 → 才能提交

## 測試哲學

我們採用 **測試驅動開發 (TDD)** 方法，確保程式碼品質和可靠性：

1. **先寫測試** - 定義預期行為
2. **實現功能** - 讓測試通過  
3. **重構優化** - 保持測試綠燈

## 📊 測試覆蓋率目標

- **單元測試**: 80% 覆蓋率
- **整合測試**: 核心業務流程
- **E2E 測試**: 關鍵用戶路徑

## 🎯 前端測試

### 測試框架
- **Vitest** - 快速的單元測試框架
- **Vue Test Utils** - Vue 元件測試工具
- **jsdom** - 模擬瀏覽器環境

### 執行測試
```bash
# 執行所有測試
npm run test

# 監聽模式 (開發時使用)
npm run test:watch

# 覆蓋率報告
npm run test:coverage

# UI 介面 (視覺化)
npm run test:ui
```

### 測試結構
```
src/
├── stores/
│   └── __tests__/
│       └── auth.test.ts
├── components/
│   └── __tests__/
│       └── CreditDisplay.test.ts
├── services/
│   └── __tests__/
│       └── authService.test.ts
└── test/
    └── setup.ts
```

### 編寫測試範例

#### Store 測試
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should login successfully', async () => {
    const store = useAuthStore()
    // 測試邏輯
  })
})
```

#### 元件測試
```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CreditDisplay from '../CreditDisplay.vue'

describe('CreditDisplay', () => {
  it('should display credit balance', () => {
    const wrapper = mount(CreditDisplay, {
      props: { balance: 100 }
    })
    
    expect(wrapper.text()).toContain('100')
  })
})
```

## 🎯 後端測試

### 測試框架
- **Jest** - JavaScript 測試框架
- **Supertest** - HTTP 測試工具 (整合測試)

### 執行測試
```bash
# 執行所有測試
npm test

# 監聽模式
npm run test:watch

# 覆蓋率報告
npm run test:coverage

# 只執行單元測試
npm run test:unit
```

### 測試結構
```
backend/
├── tests/
│   ├── setup.js
│   ├── services/
│   │   └── creditService.test.js
│   ├── routes/
│   │   └── auth.test.js
│   └── integration/
│       └── api.test.js
└── jest.config.js
```

### 編寫測試範例

#### Service 測試
```javascript
const CreditService = require('../../src/services/creditService')

describe('CreditService', () => {
  it('should deduct credits successfully', async () => {
    const result = await CreditService.deductCredits('user@example.com', 10)
    
    expect(result.success).toBe(true)
    expect(result.newBalance).toBeGreaterThanOrEqual(0)
  })
})
```

#### API 路由測試
```javascript
const request = require('supertest')
const app = require('../../server')

describe('Auth API', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/email/verify')
      .send({
        email: 'test@example.com',
        code: '123456'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})
```

## 🎨 測試最佳實踐

### 1. 測試命名規範
```javascript
// ✅ 好的命名
describe('用戶登入功能', () => {
  it('應該在提供正確憑證時成功登入', () => {})
  it('應該在提供錯誤憑證時拒絕登入', () => {})
})

// ❌ 不好的命名  
describe('login', () => {
  it('works', () => {})
  it('fails', () => {})
})
```

### 2. 使用 AAA 模式
```javascript
it('should calculate total correctly', () => {
  // Arrange - 準備
  const credits = 100
  const deduction = 10
  
  // Act - 執行
  const result = calculateTotal(credits, deduction)
  
  // Assert - 驗證
  expect(result).toBe(90)
})
```

### 3. 測試隔離
```javascript
describe('User Service', () => {
  beforeEach(() => {
    // 每個測試前重置狀態
    jest.clearAllMocks()
    mockDatabase.reset()
  })
})
```

### 4. Mock 外部依賴
```javascript
// Mock API 呼叫
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock 資料庫
jest.mock('../config/database')
```

## 🚨 測試檢查清單

### 提交前必須檢查
- [ ] 所有測試通過 ✅
- [ ] 覆蓋率達到 80% ✅
- [ ] 新功能有對應測試 ✅
- [ ] 邊界情況已測試 ✅
- [ ] 錯誤處理已測試 ✅

### 核心功能測試清單
- [ ] 用戶註冊流程
- [ ] Email 驗證碼發送/驗證
- [ ] Google OAuth 登入
- [ ] JWT Token 管理
- [ ] 點數查詢/扣除/增加
- [ ] 管理員權限控制
- [ ] N8N Webhook 處理
- [ ] 錯誤處理機制

## 🔧 測試環境設定

### 前端測試環境變數
```bash
# .env.test
VITE_BACKEND_URL=http://localhost:3001
VITE_APP_ENV=test
```

### 後端測試環境變數
```bash
# .env.test  
NODE_ENV=test
DATABASE_URL=postgresql://test_db
JWT_SECRET=test-secret
```

## 📈 持續改進

### 測試指標監控
- 測試覆蓋率趨勢
- 測試執行時間
- 失敗率統計

### 測試技術債務
- 定期重構測試代碼
- 移除過時的測試
- 改善測試可讀性

---

**記住**: 好的測試是最好的文檔！測試應該清楚表達代碼的預期行為。