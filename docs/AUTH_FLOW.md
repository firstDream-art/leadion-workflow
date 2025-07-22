# 🔐 LeadIO 認證與資料流程

## 用戶註冊/登入流程

```
用戶訪問網站 → Clerk 登入組件 → 輸入 Email → Clerk 發送驗證信 → 
用戶點擊連結 → 帳號激活 → 返回你的網站 (已登入狀態)
```

### ✅ Clerk 自動處理的部分
- 用戶註冊表單
- 郵件驗證發送
- 密碼設定和加密
- 用戶資料存儲
- Session 管理
- 密碼重置

### 🎯 你只需要處理的部分
- 業務邏輯（SEO報告）
- 報告資料存儲
- n8n 工作流整合

## 📊 資料架構設計

### Clerk 存儲 (他們的雲端)
```javascript
// Clerk User Object - 你不需要管理
{
  id: "user_2abc123",           // 這個ID你會用到
  emailAddress: "user@email.com",
  firstName: "張",
  lastName: "先生", 
  createdAt: "2025-01-21T...",
  // ... Clerk 管理的其他欄位
}
```

### 你的資料庫 (只存業務數據)
```sql
-- seo_reports 表
{
  id: "uuid-123",
  clerk_user_id: "user_2abc123",  ← 來自 Clerk
  report_url: "https://your-app.zeabur.app/reports/...",
  website_url: "https://客戶網站.com",
  report_title: "SEO 分析報告",
  created_at: "2025-01-21T...",
  expires_at: "2025-02-20T..."
}
```

## 🔗 前後端整合

### 前端 (Vue + Clerk)
```typescript
// 用戶登入後取得 token
import { useAuth } from '@clerk/vue';

const { getToken, userId } = useAuth();

// 發送 API 請求時帶上 token
const token = await getToken();
fetch('/api/reports', {
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});
```

### 後端 (Express + Clerk)
```javascript
// 驗證 Clerk token
import { clerkClient } from '@clerk/express';

app.use('/api/reports', async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const payload = await clerkClient.verifyToken(token);
  
  req.userId = payload.sub;  // 這就是 Clerk 的用戶 ID
  next();
});

// 創建報告時使用這個 ID
app.post('/api/reports', (req, res) => {
  const { userId } = req;  // 來自 Clerk
  
  // 存到你的資料庫
  await Report.create({
    clerk_user_id: userId,
    report_url: uploadResult.url,
    website_url: req.body.websiteUrl,
    // ...
  });
});
```

## 🎯 實際場景範例

### 場景1: 新用戶註冊
```
1. 用戶輸入 email → Clerk 處理
2. Clerk 發送驗證信 → 用戶點擊
3. 用戶設定密碼 → Clerk 存儲
4. 登入成功 → 前端取得 userId
5. 用戶可以開始使用 SEO 功能
```

### 場景2: 用戶生成報告
```
1. 用戶已登入 (Clerk session 有效)
2. 用戶提交網址 → 觸發 n8n 工作流
3. n8n 生成 HTML → 調用你的 API (帶 userId)
4. 你的 API 存儲報告 → 資料庫 + Zeabur storage
5. 用戶在 Dashboard 看到報告列表
```

### 場景3: 用戶查看歷史報告
```
1. 前端發送請求 (帶 Clerk token)
2. 後端驗證 token → 取得 userId
3. 查詢資料庫: WHERE clerk_user_id = userId
4. 返回該用戶的所有報告
```

## 💡 你完全不需要處理的

❌ **用戶密碼管理**
- 密碼加密/驗證
- 密碼重置流程  
- 密碼強度規則

❌ **郵件系統**
- 驗證信發送
- 忘記密碼信
- 歡迎信

❌ **Session 管理**
- Token 生成/驗證
- 過期處理
- Refresh token

❌ **用戶資料管理**
- 個人資料存儲
- 頭像上傳
- 偏好設定

## 🚀 你只需要專注在

✅ **業務邏輯**
- SEO 報告生成
- 報告存儲管理
- n8n 工作流整合

✅ **資料關聯**
- 報告 ↔ 用戶的關聯
- 報告過期管理
- 存儲空間管理

## 📝 總結

**Clerk = 用戶管理專家**
- 處理所有認證相關的複雜邏輯
- 你只需要用他們提供的 `userId`

**你的後端 = 業務邏輯專家** 
- 專注在 SEO 報告功能
- 用 `clerk_user_id` 關聯業務數據

這樣分工讓你可以專注在核心業務功能，而不用煩惱用戶管理的複雜性！