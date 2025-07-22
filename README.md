# 🚀 LeadIO API

LeadIO SEO 分析平台的後端 API 服務

## 📋 功能特點

- 🔐 **Clerk 認證整合** - 安全的用戶管理
- 📊 **SEO 報告存儲** - 支援 HTML 報告文件
- 🗄️ **Zeabur 持久化存儲** - 文件安全存放
- 🔄 **n8n 工作流整合** - 自動化報告生成
- 📧 **郵件通知系統** - 報告完成通知
- 🧹 **自動清理機制** - 過期報告自動刪除

## 🛠️ 技術棧

- **Node.js** - 運行環境
- **Express.js** - Web 框架  
- **PostgreSQL** - 數據庫
- **Clerk** - 用戶認證
- **Zeabur** - 部署和存儲

## 🚀 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 配置環境變數
複製 `.env` 範例並修改：
```env
STORAGE_TYPE=zeabur
CLERK_PUBLISHABLE_KEY=your_key
DATABASE_URL=postgresql://...
```

### 3. 啟動服務器
```bash
npm run dev
```

## 📚 主要 API

- `GET /api/reports` - 獲取報告列表
- `POST /api/reports` - 創建報告 (n8n 調用)
- `GET /health` - 健康檢查

## 🔗 認證流程

使用 Clerk 處理用戶認證，後端只需：
1. 驗證 Clerk JWT token
2. 取得 `clerkUserId`
3. 關聯業務數據

## 📁 資料架構

```sql
-- 只需要一個簡單的報告表
CREATE TABLE seo_reports (
  id UUID PRIMARY KEY,
  clerk_user_id VARCHAR(255),  -- 來自 Clerk
  report_url TEXT,
  website_url VARCHAR(500),
  created_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

用戶資料由 Clerk 管理，你不需要自己的 users 表！

## 🚀 部署到 Zeabur

1. 推送到 GitHub
2. 在 Zeabur 連接 repository  
3. 設置環境變數
4. 啟用持久化存儲 (`/data`)
5. 部署

## 📞 支援

查看 `docs/` 目錄中的詳細文檔。
