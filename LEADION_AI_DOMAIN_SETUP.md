# 🌐 Leadion.ai 自定義域名部署指南

## 📋 部署架構規劃

### 🎯 **域名分配策略**
```
https://leadion.ai          → 前端 (Vue3 應用)
https://api.leadion.ai      → 後端 API (Node.js + Express)
```

**優勢：**
- ✅ 清晰的服務分離
- ✅ 符合業界標準慣例
- ✅ 易於擴展和維護
- ✅ SEO 友好

## 🚀 **分步驟部署流程**

### 第 1 步：部署後端 API 到 Zeabur

#### 1.1 創建後端服務
```bash
# 在 Zeabur 控制台
1. 創建新專案 "Leadion-AI"
2. 選擇 GitHub 倉庫：leadion-workflow  
3. 服務名稱：leadion-api
4. 根目錄：backend/
5. 建構指令：npm install
6. 啟動指令：npm start
```

#### 1.2 設定後端環境變數
```bash
# 資料庫
DATABASE_URL=postgresql://root:trJBh9nGWNRLXj250TOx61M8cC4Vl3b7@hnd1.clusters.zeabur.com:22072/zeabur

# 認證系統
JWT_SECRET=leadio-super-secret-jwt-key-32-characters-long-for-security-PROD
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (先用臨時設定，後面會更新)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=https://api.leadion.ai/api/auth/google/callback

# Email 服務
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=riverchang@adbest.com.tw
SMTP_PASS=krhsoffdpjgskaba
FROM_EMAIL=noreply@leadion.ai

# 應用配置
NODE_ENV=production
PORT=3001
APP_ENV=production

# CORS 設定
CORS_ORIGIN=https://leadion.ai,https://www.leadion.ai

# N8N 整合
N8N_BASE_URL=https://awesomeseo.zeabur.app

# 管理員
ADMIN_EMAILS=jianjingkuan@gmail.com,riverchang@adbest.com.tw

# 前端網址
FRONTEND_URL=https://leadion.ai
```

#### 1.3 設定自定義域名
```bash
# 在 Zeabur 服務設定中
1. 點擊 "Domains" 標籤
2. 添加自定義域名：api.leadion.ai
3. 複製提供的 CNAME 記錄
```

### 第 2 步：配置 DNS 記錄

#### 2.1 在你的域名提供商 (如 GoDaddy, Cloudflare) 添加記錄
```dns
# A 記錄或 CNAME (根據 Zeabur 提供的指示)
api.leadion.ai    →    [Zeabur 提供的目標地址]
www.leadion.ai    →    [Zeabur 提供的目標地址] 
leadion.ai        →    [Zeabur 提供的目標地址]
```

### 第 3 步：部署前端到 Zeabur

#### 3.1 創建前端服務
```bash
# 在同一個 Zeabur 專案中
1. 添加新服務：leadion-frontend
2. 選擇同樣的 GitHub 倉庫
3. 根目錄：/ (前端在倉庫根目錄)
4. 建構指令：npm run build
5. 輸出目錄：dist
```

#### 3.2 設定前端環境變數
```bash
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# API 配置 (使用自定義域名)
VITE_BACKEND_URL=https://api.leadion.ai
VITE_N8N_BASE_URL=https://awesomeseo.zeabur.app
VITE_N8N_WEBHOOK_URL=https://awesomeseo.zeabur.app/webhook

# 應用配置
VITE_APP_NAME=LeadIO
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

#### 3.3 設定前端自定義域名
```bash
# 在前端服務的 Domains 設定
1. 添加域名：leadion.ai
2. 添加域名：www.leadion.ai
```

### 第 4 步：更新 Google OAuth 設定

#### 4.1 Google Cloud Console 設定
```bash
1. 前往 https://console.cloud.google.com/
2. 選擇你的專案
3. 進入 APIs & Services > Credentials
4. 編輯 OAuth 2.0 Client ID
5. 更新授權的重定向 URI：
   - https://api.leadion.ai/api/auth/google/callback
   - https://localhost:3001/api/auth/google/callback (保留用於開發)
```

### 第 5 步：SSL 證書和安全性

Zeabur 會自動為你的自定義域名提供免費的 SSL 證書！

## 🔧 **部署後配置更新**

### 更新生產環境配置檔案

```bash
# 前端 .env.production 更新
VITE_BACKEND_URL=https://api.leadion.ai

# 後端環境變數更新
GOOGLE_REDIRECT_URI=https://api.leadion.ai/api/auth/google/callback
CORS_ORIGIN=https://leadion.ai,https://www.leadion.ai
FRONTEND_URL=https://leadion.ai
```

## 🧪 **部署後驗證**

### 健康檢查端點測試
```bash
# 後端健康檢查
curl https://api.leadion.ai/health
curl https://api.leadion.ai/db-health  
curl https://api.leadion.ai/n8n-health

# 前端訪問
https://leadion.ai
```

### 功能完整測試
1. ✅ 用戶註冊/登入
2. ✅ Google OAuth 登入
3. ✅ Email 驗證碼發送
4. ✅ 點數系統操作
5. ✅ 管理員功能
6. ✅ N8N Webhook 接收

## 📊 **性能優化建議**

### CDN 配置 (可選)
```bash
# 可以考慮使用 Cloudflare 作為 CDN
1. 將 DNS 管理轉移到 Cloudflare
2. 啟用 CDN 和緩存優化
3. 啟用 Brotli 壓縮
```

### 監控和分析
```bash
# 建議添加的監控工具
- Google Analytics (前端)
- Sentry 錯誤追蹤
- Uptime 監控服務
```

## 🚨 **注意事項**

### 安全性檢查
- ✅ 所有連接都使用 HTTPS
- ✅ CORS 設定限制為信任域名
- ✅ 環境變數敏感資訊保護
- ✅ JWT Secret 使用生產級別密鑰

### 成本考慮
- Zeabur 免費方案有使用限制
- 考慮升級到付費方案支援更多流量
- 域名續費記得定期處理

## 🎉 **完成後的最終狀態**

```
用戶訪問：https://leadion.ai
          ↓
前端 Vue3 應用 (Zeabur)
          ↓ API 請求
後端 Node.js API：https://api.leadion.ai (Zeabur)
          ↓ 資料庫查詢  
PostgreSQL (Zeabur)
          ↓ N8N 整合
N8N 服務：https://awesomeseo.zeabur.app
```

**你的 leadion.ai 就準備好為全世界用戶提供服務了！** 🌟