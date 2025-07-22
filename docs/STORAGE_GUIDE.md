# 🗄️ LeadIO 雲端存儲指南

## 為什麼需要雲端存儲？

**❌ 錯誤做法：**
```
專案目錄/uploads/reports/
├── user1/report1.html
├── user2/report2.html  
└── ... (越來越多文件)
```

**問題：**
- 服務器硬碟容量有限
- 部署時文件會丟失
- 無法擴展到多台服務器
- 沒有備份機制
- 影響服務器性能

**✅ 正確做法：**
```
客戶報告 → 雲端存儲服務 → CDN加速 → 全球用戶訪問
```

## 🎯 推薦方案比較

### 1. AWS S3 + CloudFront (企業級)

```javascript
// .env 配置
CLOUD_STORAGE_PROVIDER=aws
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key  
AWS_REGION=ap-east-1
AWS_S3_BUCKET=leadio-seo-reports
AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net
```

**成本估算：**
- 前12個月：基本免費
- 存儲：$0.023/GB/月
- 流量：$0.085/GB
- 月估算：10GB存儲 + 50GB流量 ≈ $4.5/月

**適用：** 需要全球加速、企業級可靠性

### 2. DigitalOcean Spaces (性價比)

```javascript
// .env 配置  
CLOUD_STORAGE_PROVIDER=digitalocean
DO_SPACES_ENDPOINT=sgp1.digitaloceanspaces.com
DO_SPACES_KEY=your_key
DO_SPACES_SECRET=your_secret
DO_SPACES_NAME=leadio-reports
DO_SPACES_CDN_URL=https://leadio-reports.sgp1.cdn.digitaloceanspaces.com
```

**成本：**
- 固定 $5/月：250GB存儲 + 1TB流量
- 超出部分：$0.02/GB存儲，$0.01/GB流量

**適用：** 中小型專案，成本可預測

### 3. Cloudinary (專業媒體)

```javascript
// .env 配置
CLOUD_STORAGE_PROVIDER=cloudinary  
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**成本：**
- 免費：25GB存儲 + 25GB流量/月
- 付費：$89/月起

**適用：** 需要圖片處理功能的專案

## 🚀 快速設置

### Step 1: 選擇並配置存儲服務

推薦新手選擇 **DigitalOcean Spaces**：

1. 註冊 DigitalOcean 帳號
2. 創建 Space (類似 S3 bucket)
3. 獲取 API 金鑰
4. 配置 CDN

### Step 2: 更新環境變數

```bash
# leadio-api/.env
CLOUD_STORAGE_PROVIDER=digitalocean
DO_SPACES_ENDPOINT=sgp1.digitaloceanspaces.com
DO_SPACES_KEY=your_spaces_key
DO_SPACES_SECRET=your_spaces_secret  
DO_SPACES_NAME=leadio-seo-reports
DO_SPACES_CDN_URL=https://leadio-seo-reports.sgp1.cdn.digitaloceanspaces.com
```

### Step 3: 安裝依賴

```bash
npm install aws-sdk
```

### Step 4: 更新路由

```javascript
// routes/reports.js
import CloudStorageService from '../services/cloudStorageService.js';

const storageService = new CloudStorageService();

// 替換原本的 LocalStorageService
```

## 🔧 檔案組織架構

```
你的雲端存儲/
└── reports/
    ├── user-123/
    │   ├── EXAMPLE-2025-01-15-1430.html
    │   └── GOOGLE-2025-01-16-0920.html
    ├── user-456/
    │   └── FACEBOOK-2025-01-17-1145.html
    └── user-789/
        └── AMAZON-2025-01-18-1520.html
```

## 🌐 訪問 URL 格式

**DigitalOcean Spaces CDN:**
```
https://leadio-seo-reports.sgp1.cdn.digitaloceanspaces.com/reports/user-123/EXAMPLE-2025-01-15-1430.html
```

**AWS CloudFront:**
```  
https://d1234567890.cloudfront.net/reports/user-123/EXAMPLE-2025-01-15-1430.html
```

## 💡 最佳實踐

### 1. 文件命名規範
```javascript
// 格式：SITENAME-YYYY-MM-DD-HHMM.html
const fileName = `${siteName}-${timestamp}.html`;
```

### 2. 存儲優化
- 設置適當的緩存策略
- 壓縮HTML內容
- 設置自動過期刪除

### 3. 安全設置
- 使用 IAM 角色限制權限
- 啟用 HTTPS 加密
- 設置 CORS 規則

### 4. 監控與備份
- 監控存儲使用量
- 設置成本警報
- 定期備份重要數據

## 🎯 推薦選擇

**新手/小型專案：** DigitalOcean Spaces
- 簡單易用
- 成本可預測  
- 包含CDN

**企業/大型專案：** AWS S3 + CloudFront
- 最佳性能
- 全球分發
- 豐富的生態系統

**需要圖片處理：** 保留 Cloudinary
- 自動優化
- 格式轉換
- 響應式圖片

現在你的客戶報告將安全存放在專業雲端服務中，而不是你的專案目錄！