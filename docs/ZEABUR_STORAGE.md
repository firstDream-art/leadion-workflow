# 🚀 Zeabur 存儲解決方案

## 為什麼選擇 Zeabur 存儲？

✅ **完美整合**
- 與現有 Zeabur 部署無縫整合
- 不需要額外註冊第三方服務
- 統一管理和計費

✅ **簡單配置**
- 一個 `zeabur.yaml` 檔案搞定
- 持久化存儲自動掛載
- 環境變數輕鬆管理

✅ **成本效益**
- 包含在 Zeabur 服務計價中
- 無需額外的對象存儲費用
- 適合中小型專案

## 📁 Zeabur 存儲架構

```
Zeabur 容器內存儲結構：
/app/
├── src/                    # 應用程式碼
├── data/                   # 持久化存儲目錄
│   └── reports/            # HTML 報告存儲
│       ├── user-123/
│       │   ├── GOOGLE-2025-01-15-1430.html
│       │   └── FACEBOOK-2025-01-16-0920.html
│       └── user-456/
│           └── AMAZON-2025-01-17-1145.html
└── uploads/                # 臨時文件（不持久化）
```

## 🛠️ 配置步驟

### 1. 更新 Zeabur 配置

已經創建了 `zeabur.yaml`：

```yaml
services:
  leadio-api:
    build: .
    volumes:
      - /app/data:/data    # 持久化存儲掛載
    environment:
      STORAGE_PATH: /data/reports
      STORAGE_TYPE: zeabur
```

### 2. 更新後端代碼

```javascript
// 在 routes/reports.js 中使用 Zeabur 存儲
import ZeaburStorageService from '../services/zeaburStorageService.js';

const storageService = new ZeaburStorageService();
```

### 3. 環境變數配置

在 Zeabur Dashboard 設置：

```bash
STORAGE_PATH=/data/reports
STORAGE_TYPE=zeabur
PUBLIC_URL=https://your-app.zeabur.app
```

## 🔗 訪問 URL 格式

你的 HTML 報告將可以通過以下格式訪問：

```
https://your-leadio-api.zeabur.app/reports/user-123/GOOGLE-2025-01-15-1430.html
```

## 📊 存儲管理功能

### 自動清理
```javascript
// 清理 30 天前的報告
await storageService.cleanupExpiredReports(30);
```

### 存儲統計
```javascript
// 獲取存儲使用情況
const stats = await storageService.getStorageStats();
console.log(`總文件: ${stats.totalFiles}, 總大小: ${stats.totalSizeFormatted}`);
```

### 用戶報告列表
```javascript
// 列出特定用戶的所有報告
const userReports = await storageService.listUserReports('user-123');
```

## ⚡ 性能優化

### 1. 靜態文件服務
```javascript
// server.js
app.use('/reports', express.static(process.env.STORAGE_PATH || '/data/reports'));
```

### 2. 緩存策略
```javascript
app.use('/reports', express.static('/data/reports', {
  maxAge: '1d',           // 1天緩存
  etag: true,            // 啟用 ETag
  lastModified: true     // 啟用 Last-Modified
}));
```

### 3. 壓縮
```javascript
import compression from 'compression';
app.use(compression());
```

## 🔒 安全考量

### 1. 存取控制
```javascript
// 驗證用戶是否有權存取報告
app.get('/reports/:userId/:filename', async (req, res) => {
  const { userId, filename } = req.params;
  
  // 檢查用戶認證
  if (!req.userId || req.userId !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // 提供文件
  res.sendFile(path.join(process.env.STORAGE_PATH, userId, filename));
});
```

### 2. 檔案類型限制
```javascript
// 只允許 HTML 檔案
if (!filename.endsWith('.html')) {
  return res.status(400).json({ error: 'Invalid file type' });
}
```

## 📈 監控與維護

### 1. 存儲監控
```javascript
// 添加存儲統計 API
app.get('/api/admin/storage-stats', async (req, res) => {
  const stats = await storageService.getStorageStats();
  res.json(stats);
});
```

### 2. 定期清理
```javascript
// 設定定期清理任務
import cron from 'node-cron';

// 每天凌晨 2 點清理過期報告
cron.schedule('0 2 * * *', async () => {
  console.log('🧹 Starting daily cleanup...');
  const cleaned = await storageService.cleanupExpiredReports(30);
  console.log(`✅ Cleaned ${cleaned} expired reports`);
});
```

## 🚀 部署流程

### 1. 推送到 GitHub
```bash
git add .
git commit -m "Add Zeabur storage support"
git push origin main
```

### 2. Zeabur 部署
1. 連接 GitHub repository
2. 設置環境變數
3. 啟用持久化存儲
4. 部署

### 3. 測試存儲
```bash
# 測試存儲功能
curl -X POST https://your-app.zeabur.app/api/test-storage
```

## 💰 成本分析

**Zeabur 存儲 vs 外部服務：**

| 方案 | 月成本 | 優點 | 缺點 |
|------|--------|------|------|
| Zeabur 持久化存儲 | ~$5-10 | 簡單、整合 | 無 CDN |
| AWS S3 + CloudFront | ~$3-15 | 全球 CDN | 複雜配置 |
| DigitalOcean Spaces | ~$5 | 包含 CDN | 額外服務 |

**推薦：先用 Zeabur 存儲開始，業務成長後再考慮 CDN**

## 🎯 下一步

1. 測試 Zeabur 存儲服務
2. 更新路由使用 Zeabur 存儲
3. 部署到 Zeabur
4. 配置 n8n 工作流
5. 完整測試流程

現在你可以完全在 Zeabur 生態系統內解決存儲問題！🚀