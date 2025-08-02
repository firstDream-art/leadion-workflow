# Zeabur 部署指南

## 📋 部署前檢查清單

### 🔧 必要配置

#### 後端環境變數
```bash
# 資料庫
DATABASE_URL=postgresql://root:trJBh9nGWNRLXj250TOx61M8cC4Vl3b7@hnd1.clusters.zeabur.com:22072/zeabur

# JWT 認證
JWT_SECRET=leadio-super-secret-jwt-key-32-characters-long-for-security
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=https://your-backend-domain.zeabur.app/api/auth/google/callback

# Email 服務
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=riverchang@adbest.com.tw
SMTP_PASS=krhsoffdpjgskaba
FROM_EMAIL=noreply@leadio.ai

# 應用配置
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.zeabur.app

# N8N 整合
N8N_BASE_URL=https://awesomeseo.zeabur.app

# 管理員
ADMIN_EMAILS=jianjingkuan@gmail.com,riverchang@adbest.com.tw
```

#### 前端環境變數
```bash
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# API 配置
VITE_BACKEND_URL=https://your-backend-domain.zeabur.app
VITE_N8N_BASE_URL=https://awesomeseo.zeabur.app
VITE_N8N_WEBHOOK_URL=https://awesomeseo.zeabur.app/webhook

# 應用配置
VITE_APP_NAME=LeadIO
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

## 🚀 部署步驟

### 1. 後端部署
1. 在 Zeabur 創建新服務，選擇 GitHub 倉庫 `leadion-workflow`
2. 設定根目錄為 `backend/`
3. 設定啟動命令：`npm start`
4. 添加上述環境變數
5. 部署完成後記錄域名

### 2. 前端部署
1. 在 Zeabur 創建新服務，選擇 GitHub 倉庫 `leadion-workflow`
2. 設定根目錄為 `/`（前端在根目錄）
3. 設定建構命令：`npm run build`
4. 更新 `VITE_BACKEND_URL` 為後端實際域名
5. 添加其他前端環境變數
6. 部署完成後記錄域名

### 3. Google OAuth 設定更新
在 Google Cloud Console 中更新重定向 URI：
- 開發環境：`http://localhost:3001/api/auth/google/callback`
- 生產環境：`https://your-backend-domain.zeabur.app/api/auth/google/callback`

### 4. 資料庫設定
確認 Zeabur PostgreSQL 服務正常運行，並更新連線字串。

## 🔍 部署後驗證

### 健康檢查端點
- 系統健康：`https://your-backend-domain.zeabur.app/health`
- 資料庫健康：`https://your-backend-domain.zeabur.app/db-health`
- N8N 整合健康：`https://your-backend-domain.zeabur.app/n8n-health`

### 功能測試
1. ✅ 用戶註冊/登入
2. ✅ Google OAuth 登入
3. ✅ Email 驗證碼發送
4. ✅ 點數系統運作
5. ✅ N8N Webhook 接收
6. ✅ 管理員功能

## ⚠️ 注意事項

### 安全性
- JWT Secret 應為每個環境生成不同的值
- 確保 CORS 設定只允許信任的域名
- 定期更新 Gmail App Password

### 效能
- 前端已配置 Gzip 壓縮和資源優化
- 後端已配置連線池和速率限制
- 建議配置 CDN 加速靜態資源

### 監控
- 使用健康檢查端點進行監控
- 檢查應用日誌確認運行狀態
- 監控資料庫連線數和回應時間

## 🆘 故障排除

### 常見問題
1. **Google OAuth 失敗**：檢查重定向 URI 是否正確設定
2. **資料庫連線失敗**：檢查環境變數和網路連線
3. **Email 發送失敗**：檢查 Gmail App Password 和 SMTP 設定
4. **N8N 整合失敗**：檢查 Webhook URL 和網路連線

### 日誌查看
- Zeabur 控制台 → 服務 → 日誌標籤
- 關注 error 和 warning 級別的日誌