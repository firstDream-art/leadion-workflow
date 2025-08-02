# 📋 Leadion AI 專案設計規格書

## 🎯 專案概述

**專案名稱**: Leadion AI  
**專案類型**: AI 驅動的 SEO 分析與優化平台  
**技術棧**: Vue 3 + TypeScript (前端) / Node.js + Express (後端) / PostgreSQL (資料庫) / N8N (工作流)

## 🏗️ 系統架構

### 前端架構
```
Vue 3 + TypeScript
├── 框架: Vue 3 Composition API
├── 狀態管理: Pinia
├── 路由: Vue Router
├── UI 框架: Element Plus
├── HTTP 客戶端: Axios
├── 樣式: Tailwind CSS + SCSS
└── 構建工具: Vite
```

### 後端架構
```
Node.js + Express
├── 運行時: Node.js v18+
├── 框架: Express.js
├── 資料庫: PostgreSQL
├── ORM: 原生 SQL (pg 套件)
├── 認證: JWT
├── 郵件服務: Nodemailer
└── OAuth: Google OAuth 2.0
```

## 🔐 認證系統設計

### 1. 認證方式
- **Email + 驗證碼**: 主要登入方式
- **Google OAuth**: 快速登入選項
- **JWT Token**: 無狀態認證機制

### 2. Token 規格
```javascript
// Access Token
{
  exp: 24小時,
  payload: { email, userId }
}

// Refresh Token  
{
  exp: 7天,
  payload: { email, userId, sessionId }
}
```

### 3. 認證流程
1. 用戶輸入 Email → 發送驗證碼
2. 驗證成功 → 生成 JWT tokens
3. 前端儲存於 localStorage
4. API 請求攜帶 Bearer token
5. Token 過期自動刷新

## 💳 點數系統設計

### 1. 點數規則
- **新用戶**: 贈送 300 點
- **扣點規則**: 每次 AI 分析扣 10 點
- **最低餘額**: 0 點時無法使用服務

### 2. 點數操作 API
```typescript
// 查詢點數
GET /api/credits/balance

// 管理員增加點數
POST /api/admin/credits/:userEmail/add
{ amount: number, description: string }

// 管理員扣除點數
POST /api/admin/credits/:userEmail/deduct
{ amount: number, description: string }
```

## 🎨 UI/UX 設計規範

### 1. 主題系統
- **亮色主題**: 白底黑字
- **暗色主題**: 深色背景 + 白色文字
- **主色調**: #00d4ff (天藍色)

### 2. 元件規範
```scss
// 導航欄高度
$navbar-height: 64px;

// 圓角規範
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;

// 間距規範
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
```

### 3. 響應式斷點
```scss
$mobile: 640px;
$tablet: 768px;
$desktop: 1024px;
$wide: 1280px;
```

## 🔄 N8N 工作流整合

### 1. Webhook 端點
```
POST /api/n8n/webhook
{
  userEmail: string,
  promptId: string,
  result: object,
  status: 'completed' | 'failed'
}
```

### 2. 工作流觸發
1. 前端發送分析請求到 N8N
2. N8N 處理 AI 分析
3. 完成後回調後端 API
4. 後端儲存結果並扣點

## 📁 資料庫架構

### 核心資料表
```sql
-- 用戶表
users (
  id, email, first_name, last_name, 
  username, avatar_url, is_verified,
  created_at, updated_at
)

-- 點數記錄表
user_credits (
  id, user_email, balance, 
  total_earned, total_spent,
  last_updated
)

-- 交易記錄表
credit_transactions (
  id, user_email, type, amount,
  balance_after, description,
  created_at
)

-- Email 驗證碼表
email_verification_codes (
  id, email, verification_code,
  usage_type, expires_at, is_used
)

-- OAuth 連結表
oauth_connections (
  id, user_email, provider,
  provider_user_id, provider_email
)
```

## 🚀 部署架構

### 生產環境配置
```
前端: https://leadion.ai
後端: https://api.leadion.ai
N8N: https://awesomeseo.zeabur.app
```

### 環境變數規範
```bash
# 必要的後端環境變數
DATABASE_URL
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
SMTP_USER
SMTP_PASS
ADMIN_EMAILS

# 必要的前端環境變數
VITE_GOOGLE_CLIENT_ID
VITE_BACKEND_URL
VITE_N8N_BASE_URL
```

## 📏 編碼規範

### 1. TypeScript 規範
```typescript
// 使用 interface 定義物件類型
interface User {
  id: string
  email: string
  credits: number
}

// 使用 type 定義聯合類型
type Status = 'pending' | 'completed' | 'failed'

// 避免使用 any
// 優先使用 unknown 或具體類型
```

### 2. Vue 元件規範
```vue
<script setup lang="ts">
// 1. 導入依賴
import { ref, computed } from 'vue'

// 2. 定義 props
interface Props {
  userId: string
}
const props = defineProps<Props>()

// 3. 定義 emits
const emit = defineEmits<{
  update: [value: string]
}>()

// 4. 響應式數據
const count = ref(0)

// 5. 計算屬性
const doubled = computed(() => count.value * 2)

// 6. 方法
function handleClick() {
  // ...
}
</script>
```

### 3. API 規範
```javascript
// RESTful 路由命名
GET    /api/users          // 列表
GET    /api/users/:id      // 詳情
POST   /api/users          // 創建
PUT    /api/users/:id      // 更新
DELETE /api/users/:id      // 刪除

// 統一回應格式
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```

## 🔒 安全規範

### 1. 認證安全
- JWT Secret 至少 32 字元
- Token 存儲於 httpOnly cookie (未來優化)
- 實施 CORS 白名單
- 使用 Helmet.js 設置安全標頭

### 2. 資料驗證
- 前端驗證 + 後端驗證
- 使用參數化查詢防止 SQL 注入
- XSS 防護：對用戶輸入進行轉義
- 速率限制：防止暴力攻擊

### 3. 敏感資訊
- 環境變數不提交到版本控制
- 生產環境使用強密碼
- OAuth 密鑰定期更換
- 資料庫連接使用 SSL

## 📝 版本控制規範

### Git 分支策略
```
main        → 生產環境
develop     → 開發環境
feature/*   → 功能開發
hotfix/*    → 緊急修復
```

### Commit 訊息格式
```
feat: 新增功能
fix: 修復問題
docs: 文檔更新
style: 代碼格式調整
refactor: 重構代碼
test: 測試相關
chore: 構建或輔助工具
```

## 🧪 測試規範 (強制執行)

### ⚠️ 絕對規則
**每次新增代碼都必須寫單元測試 - 沒有例外！**

1. **新增函數** → 必須有對應測試
2. **新增組件** → 必須有組件測試
3. **新增 API** → 必須有 API 測試
4. **修改邏輯** → 必須更新相關測試
5. **提交代碼** → 所有測試必須通過

### 測試框架配置
```json
// 前端測試
{
  "framework": "Vitest",
  "coverage": "v8",
  "environment": "jsdom",
  "setupFiles": ["./src/test/setup.ts"]
}

// 後端測試
{
  "framework": "Jest",
  "testEnvironment": "node",
  "coverageDirectory": "coverage"
}
```

### 測試覆蓋率目標
- 單元測試: 80%
- 整合測試: 核心流程
- E2E 測試: 關鍵用戶路徑

### 前端單元測試範例
```typescript
// src/stores/__tests__/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should login user successfully', async () => {
    const store = useAuthStore()
    await store.login('test@example.com', '123456')
    
    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe('test@example.com')
  })

  it('should handle login failure', async () => {
    const store = useAuthStore()
    await expect(store.login('invalid@example.com', 'wrong'))
      .rejects.toThrow('認證失敗')
  })
})
```

### 後端單元測試範例
```javascript
// backend/tests/services/creditService.test.js
describe('CreditService', () => {
  it('should deduct credits successfully', async () => {
    const result = await CreditService.deductCredits('user@example.com', 10)
    
    expect(result.success).toBe(true)
    expect(result.newBalance).toBeGreaterThanOrEqual(0)
  })

  it('should prevent negative balance', async () => {
    await expect(CreditService.deductCredits('user@example.com', 999999))
      .rejects.toThrow('餘額不足')
  })
})
```

### 測試執行指令
```bash
# 前端測試
npm run test          # 執行測試
npm run test:watch    # 監聽模式
npm run test:coverage # 覆蓋率報告

# 後端測試
npm test              # 執行測試
npm run test:watch    # 監聽模式
npm run test:coverage # 覆蓋率報告
```

### 測試檢查清單
- [ ] 用戶註冊/登入流程
- [ ] Email 驗證碼發送
- [ ] Google OAuth 登入
- [ ] 點數查詢與扣除
- [ ] 管理員功能
- [ ] N8N Webhook 接收
- [ ] Token 刷新機制
- [ ] 錯誤處理流程
- [ ] 輸入驗證
- [ ] API 權限控制

## 📊 監控與維護

### 健康檢查端點
```
GET /health          → 服務狀態
GET /db-health       → 資料庫連接
GET /n8n-health      → N8N 服務狀態
```

### 日誌規範
```javascript
console.log('✅ 成功訊息')    // 成功
console.error('❌ 錯誤訊息')  // 錯誤
console.warn('⚠️ 警告訊息')   // 警告
console.info('ℹ️ 資訊訊息')   // 資訊
```

## 🔄 更新記錄

### 2024-08-02
- 初始化專案設計規格
- 定義核心架構與規範
- 確立認證與點數系統

---

**注意**: 此文檔為專案的核心設計規格，任何重大變更都應更新此文檔。