# 🚀 Zeabur 後端部署詳細步驟指南

## 📌 部署前準備

### 1. 確認後端程式碼結構
```
leadio-api/
├── backend/
│   ├── package.json         # ✅ 確認有 "start" 腳本
│   ├── server.js           # ✅ 主程式入口
│   ├── .env.example        # ✅ 環境變數範例
│   └── ...其他檔案
```

### 2. 檢查 package.json
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 🎯 Step 1: 在 Zeabur 創建新專案

1. **登入 Zeabur**
   - 前往 https://zeabur.com
   - 使用 GitHub 帳號登入

2. **創建新專案**
   ```
   點擊 "New Project" → 輸入專案名稱 "leadio-backend"
   ```

## 🎯 Step 2: 連接 GitHub 倉庫

1. **選擇部署來源**
   ```
   Deploy from GitHub → 授權 GitHub 存取權限
   ```

2. **選擇倉庫**
   ```
   搜尋並選擇: leadio-workflow (或你的倉庫名稱)
   ```

3. **設定部署路徑**
   ```
   Root Directory: backend/
   （因為後端在 backend 子目錄）
   ```

## 🎯 Step 3: 配置環境變數

在 Zeabur 服務設定中，點擊 "Environment Variables" 並添加：

```bash
# 資料庫配置
DATABASE_URL=postgresql://root:trJBh9nGWNRLXj250TOx61M8cC4Vl3b7@hnd1.clusters.zeabur.com:22072/zeabur

# JWT 配置
JWT_SECRET=leadio-super-secret-jwt-key-32-characters-long-for-security-PROD
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=https://leadio-backend.zeabur.app/api/auth/google/callback

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

# CORS 設定 (暫時允許所有來源，部署成功後再限制)
CORS_ORIGIN=*

# N8N 設定
N8N_BASE_URL=https://awesomeseo.zeabur.app

# 管理員
ADMIN_EMAILS=jianjingkuan@gmail.com,riverchang@adbest.com.tw

# 前端網址 (先用 Zeabur 預設域名)
FRONTEND_URL=https://leadio-frontend.zeabur.app
```

## 🎯 Step 4: 觸發部署

1. **自動部署**
   - Zeabur 會自動開始建構和部署
   - 觀察部署日誌是否有錯誤

2. **檢查部署狀態**
   ```
   Status: Building → Deploying → Running ✅
   ```

## 🎯 Step 5: 獲取後端 URL

部署成功後，Zeabur 會提供一個預設域名：
```
https://leadio-backend.zeabur.app
```

## 🎯 Step 6: 測試後端 API

使用瀏覽器或 curl 測試：

```bash
# 健康檢查
curl https://leadio-backend.zeabur.app/health

# 資料庫連接檢查
curl https://leadio-backend.zeabur.app/db-health

# N8N 連接檢查
curl https://leadio-backend.zeabur.app/n8n-health
```

## 🔗 Step 7: 配置 N8N Webhook

現在你的後端已經部署成功，可以在 N8N workflow 中使用！

### N8N HTTP Request 節點配置：

```json
{
  "method": "POST",
  "url": "https://leadio-backend.zeabur.app/api/n8n/webhook",
  "authentication": "None",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "sendBody": true,
  "bodyParameters": {
    "parameters": [
      {
        "name": "userEmail",
        "value": "={{ $json.email }}"
      },
      {
        "name": "promptId",
        "value": "={{ $json.promptId }}"
      },
      {
        "name": "result",
        "value": "={{ $json.result }}"
      },
      {
        "name": "status",
        "value": "completed"
      }
    ]
  }
}
```

## ⚠️ 常見問題排除

### 1. 部署失敗
- 檢查 package.json 是否有 "start" 腳本
- 查看部署日誌的錯誤訊息

### 2. 資料庫連接失敗
- 確認 DATABASE_URL 格式正確
- 檢查資料庫是否允許外部連接

### 3. CORS 錯誤
- 暫時設定 CORS_ORIGIN=* 
- 部署成功後再限制為特定域名

## ✅ 部署成功後的下一步

1. **更新前端配置**
   - 將前端的 API URL 更新為 Zeabur 後端 URL
   
2. **測試完整流程**
   - 前端發送請求到 N8N
   - N8N 處理後回傳到後端
   - 後端儲存結果到資料庫

3. **監控和日誌**
   - 在 Zeabur 控制台查看實時日誌
   - 監控 API 請求和錯誤

## 📝 重要提醒

- **第一次部署**：先確保後端能正常運行
- **資料庫遷移**：如果需要執行 migrations，可以在 Zeabur 控制台執行
- **安全性**：部署成功後，記得更新 CORS 和其他安全設定

---

💡 **提示**：如果遇到問題，請查看 Zeabur 的部署日誌，通常會有詳細的錯誤訊息幫助你排除問題。